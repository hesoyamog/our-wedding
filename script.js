// ========== НАСТРОЙКИ TELEGRAM ==========
const BOT_TOKEN = '8577554424:AAHJSaH0nqFH8IPGKooqChZh_SHrGGAaWEg';

// 👇 СПИСОК ВСЕХ, КТО ДОЛЖЕН ПОЛУЧАТЬ УВЕДОМЛЕНИЯ
const CHAT_IDS = [
    '402311694',   // ← Первый получатель
    '1072868851'   // ← Второй получатель
];

// ========== ТАЙМЕР ==========
function startTimer() {
    // ⏰ ДАТА СВАДЬБЫ: 18 августа 2026, 10:10
    const weddingDate = new Date(2026, 7, 18, 10, 10, 0).getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateTimer() {
        const now = new Date().getTime();
        let diff = weddingDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

startTimer();

// ========== ОТПРАВКА В TELEGRAM ==========
const form = document.getElementById('rsvpForm');
const successMsg = document.getElementById('successMessage');
const loadingMsg = document.getElementById('loadingMessage');
const submitBtn = form.querySelector('.btn');

// Функция для отправки в Telegram всем получателям
async function sendToTelegram(name, guests, comment) {
    // Формируем красивое сообщение
    let message = `💒 <b>НОВЫЙ ГОСТЬ!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${name}\n`;
    message += `👥 <b>Гостей:</b> ${guests}\n`;
    
    if (comment && comment.trim() !== '') {
        message += `📝 <b>Комментарий:</b> ${comment}\n`;
    }
    
    message += `\n🕐 ${new Date().toLocaleString('ru-RU')}`;

    // Отправляем каждому получателю
    const results = [];
    for (const chatId of CHAT_IDS) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Ошибка отправки для Chat ID ${chatId}:`, errorData);
                results.push({ chatId, success: false, error: errorData });
            } else {
                results.push({ chatId, success: true });
            }
        } catch (error) {
            console.error(`Ошибка соединения для Chat ID ${chatId}:`, error);
            results.push({ chatId, success: false, error: error.message });
        }
    }

    // Проверяем, был ли успех хотя бы у одного получателя
    const anySuccess = results.some(r => r.success);
    if (!anySuccess) {
        throw new Error('Не удалось отправить сообщение ни одному получателю');
    }

    return results;
}

// Обработка отправки формы
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Получаем данные из формы
    const name = document.getElementById('name').value.trim();
    const guests = document.getElementById('guests').value;
    const comment = document.getElementById('comment').value.trim();
    
    // Валидация
    if (!name) {
        alert('Пожалуйста, напишите ваше имя :)');
        document.getElementById('name').focus();
        return;
    }
    
    // Отключаем кнопку и показываем загрузку
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = '⏳ Отправка...';
    loadingMsg.style.display = 'block';
    successMsg.classList.remove('show');
    
    try {
        // Отправляем в Telegram всем получателям
        const results = await sendToTelegram(name, guests, comment);
        
        // Проверяем, сколько успешных отправок
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        // Успех!
        successMsg.textContent = `✅ Спасибо, ${name}! Уведомление отправлено (${successCount}/${totalCount} получателей). Ждём вас! 🎉`;
        successMsg.classList.add('show');
        form.reset(); // Очищаем форму
        
        // Убираем загрузку через 2 секунды
        setTimeout(() => {
            loadingMsg.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = '💞 Отправить ответ';
        }, 2000);
        
        // Скрываем сообщение об успехе через 7 секунд
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 7000);
        
    } catch (error) {
        // Ошибка
        loadingMsg.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '💞 Отправить ответ';
        
        // Показываем ошибку
        alert('❌ Извините, не удалось отправить ответ. Пожалуйста, попробуйте ещё раз или напишите нам вручную в Telegram 😊');
        console.error('Детали ошибки:', error);
    }
});

// Сообщаем в консоль, что всё работает
console.log('🎉 Свадебный сайт с Telegram ботом готов!');
console.log(`👥 Уведомления получат ${CHAT_IDS.length} человек(а):`, CHAT_IDS);
console.log('📅 Дата свадьбы: 18 августа 2026 года, 10:10');