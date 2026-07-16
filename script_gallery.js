// ========== ГАЛЕРЕЯ: АВТОМАТИЧЕСКАЯ ЗАГРУЗКА С ЛАЙТБОКСОМ ==========

let currentPhotos = [];
let currentIndex = 0;

// Функция для добавления фото в галерею
function addPhotosToGallery(photoUrls) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    currentPhotos = photoUrls;
    
    // Удаляем сообщение "Пока нет фото"
    const emptyMessage = grid.querySelector('.gallery-empty');
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    // Добавляем каждое фото
    photoUrls.forEach((url, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Фото с праздника';
        img.loading = 'lazy';
        
        // Открываем лайтбокс по клику
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        item.appendChild(img);
        grid.appendChild(item);
    });
}

// ========== ЛАЙТБОКС ==========

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightbox || !lightboxImage) return;
    
    currentIndex = index;
    lightboxImage.src = currentPhotos[currentIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    updateCounter();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changePhoto(direction) {
    if (!currentPhotos.length) return;
    
    currentIndex = (currentIndex + direction + currentPhotos.length) % currentPhotos.length;
    const lightboxImage = document.getElementById('lightboxImage');
    if (!lightboxImage) return;
    
    lightboxImage.src = currentPhotos[currentIndex];
    updateCounter();
}

function updateCounter() {
    const counter = document.getElementById('lightboxCounter');
    if (!counter) return;
    counter.textContent = `${currentIndex + 1} / ${currentPhotos.length}`;
}

// ===== ИНИЦИАЛИЗАЦИЯ =====

// Слушатели для лайтбокса
document.addEventListener('DOMContentLoaded', function() {
    // Кнопки
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev')?.addEventListener('click', function(e) {
        e.stopPropagation();
        changePhoto(-1);
    });
    document.getElementById('lightboxNext')?.addEventListener('click', function(e) {
        e.stopPropagation();
        changePhoto(1);
    });
    
    // Закрытие по клику на фон
    document.getElementById('lightbox')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
            changePhoto(-1);
        }
        if (e.key === 'ArrowRight') {
            changePhoto(1);
        }
    });
});

// ===== ФОТО ДЛЯ ГАЛЕРЕИ =====

const photoFiles = [
	'guest1.jpg',
    'guest2.jpg',
    'guest3.jpg',
	'guest4.jpg',
	'guest5.jpg',
	'guest6.jpg',
	'guest7.jpg',
	'guest8.jpg',
];

// Формируем пути к фото — они лежат в папке img/gallery/
const galleryPhotos = photoFiles.map(file => `img/gallery/${file}`);

// Показываем фото на странице
addPhotosToGallery(galleryPhotos);

console.log('📸 Галерея загружена! Всего фото:', galleryPhotos.length);
console.log('💡 Кликните на фото для просмотра в полный экран');