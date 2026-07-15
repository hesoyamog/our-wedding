// ========== НАСТРОЙКИ TELEGRAM ==========
const BOT_TOKEN = '8577554424:AAHJSaH0nqFH8IPGKooqChZh_SHrGGAaWEg';

const CHAT_IDS = [
    '402311694',
    '1072868851'
];

// ========== ТАЙМЕР ==========
function startTimer() {
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

async function sendToTelegram(name, guests, event, comment) {
    let message = `💒 <b>НОВЫЙ ГОСТЬ!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${name}\n`;
    message += `👥 <b>Гостей:</b> ${guests}\n`;
    message += `📍 <b>Будет на:</b> ${event}\n`;
    if (comment && comment.trim() !== '') {
        message += `📝 <b>Комментарий:</b> ${comment}\n`;
    }
    message += `\n🕐 ${new Date().toLocaleString('ru-RU')}`;

    const results = [];
    for (const chatId of CHAT_IDS) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            results.push({ chatId, success: response.ok });
        } catch (error) {
            results.push({ chatId, success: false, error: error.message });
        }
    }
    return results;
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const guests = document.getElementById('guests').value;
    const event = document.getElementById('event').value;
    const comment = document.getElementById('comment').value.trim();
    
    if (!name) {
        alert('Пожалуйста, напишите ваше имя :)');
        document.getElementById('name').focus();
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = '⏳ Отправка...';
    loadingMsg.style.display = 'block';
    successMsg.classList.remove('show');
    
    try {
        const results = await sendToTelegram(name, guests, event, comment);
        const successCount = results.filter(r => r.success).length;
        const totalCount = results.length;
        
        successMsg.textContent = `✅ Спасибо, ${name}! Уведомление отправлено (${successCount}/${totalCount} получателей). Ждём вас! 🎉`;
        successMsg.classList.add('show');
        form.reset();
        
        setTimeout(() => {
            loadingMsg.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = '💞 Отправить ответ';
        }, 2000);
        
        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 7000);
        
    } catch (error) {
        loadingMsg.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = '💞 Отправить ответ';
        alert('❌ Ошибка отправки. Попробуйте ещё раз.');
    }
});

console.log('🎉 Свадебный сайт работает!');
console.log('📅 Дата свадьбы: 18 августа 2026, 10:10');