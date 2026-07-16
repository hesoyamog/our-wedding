// ========== ГАЛЕРЕЯ: АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ==========

// Функция для добавления фото в галерею
function addPhotosToGallery(photoUrls) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    // Удаляем сообщение "Пока нет фото"
    const emptyMessage = grid.querySelector('.gallery-empty');
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    // Добавляем каждое фото
    photoUrls.forEach(url => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Фото с праздника';
        img.loading = 'lazy';
        
        item.appendChild(img);
        grid.appendChild(item);
    });
}

// ===== АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ФОТО =====
// Просто добавьте новые фото в папку img/gallery/
// И укажите их имена в массиве ниже

const photoFiles = [
    'guest1.jpg',
    'guest2.jpg',
    'guest3.jpg',
    // Добавляйте новые фото сюда
    // 'guest4.jpg',
    // 'guest5.jpg',
];

// Формируем пути к фото
const galleryPhotos = photoFiles.map(file => `img/gallery/${file}`);

// Показываем фото на странице
addPhotosToGallery(galleryPhotos);

console.log('📸 Галерея загружена!');
console.log('💡 Как добавить фото:');
console.log('1. Положите фото в папку img/gallery/');
console.log('2. Добавьте имя файла в массив photoFiles');
console.log('3. Загрузите обновления на GitHub');