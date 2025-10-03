class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        // Настройки для Intersection Observer
        this.observerOptions = {
            root: null, // viewport
            rootMargin: '100px', // загружаем за 100px до появления в области видимости
            threshold: 0.1 // когда 10% элемента видно
        };

        // Создаем observer для iframe'ов
        this.iframeObserver = new IntersectionObserver(
            this.handleIframeIntersection.bind(this),
            this.observerOptions
        );

        // Создаем observer для изображений (дополнительно)
        this.imageObserver = new IntersectionObserver(
            this.handleImageIntersection.bind(this),
            this.observerOptions
        );

        this.setupLazyLoading();
    }

    setupLazyLoading() {
        // Обрабатываем iframe'ы
        this.setupIframeLazyLoading();
        
        // Обрабатываем изображения (дополнительно)
        this.setupImageLazyLoading();
    }

    setupIframeLazyLoading() {
        // Находим все iframe'ы
        const iframes = document.querySelectorAll('iframe[src]');
        
        iframes.forEach(iframe => {
            // Сохраняем оригинальный src в data-src
            iframe.dataset.src = iframe.src;
            
            // Заменяем src на placeholder или убираем
            iframe.src = this.createPlaceholderSrc(iframe);
            
            // Добавляем класс для стилизации
            iframe.classList.add('lazy-iframe');
            
            // Начинаем наблюдение
            this.iframeObserver.observe(iframe);
        });
    }

    setupImageLazyLoading() {
        // Находим изображения с атрибутом loading="lazy" для дополнительного контроля
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    createPlaceholderSrc(iframe) {
        const width = iframe.width || 560;
        const height = iframe.height || 315;
        
        // Создаем SVG placeholder
        const placeholderSvg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      font-family="Arial, sans-serif" font-size="16" fill="#666">
                    Нажмите для загрузки видео
                </text>
                <circle cx="50%" cy="40%" r="20" fill="#13B2C7" opacity="0.8"/>
                <polygon points="45,35 45,45 55,40" fill="white"/>
            </svg>
        `;
        
        return `data:image/svg+xml;base64,${btoa(placeholderSvg)}`;
    }

    handleIframeIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                this.loadIframe(iframe);
                this.iframeObserver.unobserve(iframe);
            }
        });
    }

    handleImageIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                this.loadImage(img);
                this.imageObserver.unobserve(img);
            }
        });
    }

    loadIframe(iframe) {
        if (iframe.dataset.src) {
            // Добавляем класс загрузки
            iframe.classList.add('loading');
            
            // Устанавливаем оригинальный src
            iframe.src = iframe.dataset.src;
            
            // Обработчик успешной загрузки
            iframe.addEventListener('load', () => {
                iframe.classList.remove('loading', 'lazy-iframe');
                iframe.classList.add('loaded');
                
                // Удаляем data-src
                delete iframe.dataset.src;
                
                // Событие для аналитики или других целей
                this.dispatchCustomEvent('iframeLoaded', iframe);
            });

            // Обработчик ошибки загрузки
            iframe.addEventListener('error', () => {
                iframe.classList.remove('loading');
                iframe.classList.add('error');
                
                this.dispatchCustomEvent('iframeError', iframe);
            });
        }
    }

    loadImage(img) {
        if (img.dataset.src) {
            img.classList.add('loading');
            
            const newImg = new Image();
            newImg.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                delete img.dataset.src;
                
                this.dispatchCustomEvent('imageLoaded', img);
            };
            
            newImg.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                
                this.dispatchCustomEvent('imageError', img);
            };
            
            newImg.src = img.dataset.src;
        }
    }

    dispatchCustomEvent(eventName, element) {
        const event = new CustomEvent(eventName, {
            detail: { element },
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // Метод для принудительной загрузки всех элементов
    loadAll() {
        document.querySelectorAll('.lazy-iframe').forEach(iframe => {
            this.loadIframe(iframe);
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    // Метод для добавления новых элементов после загрузки страницы
    observeNewElements() {
        const newIframes = document.querySelectorAll('iframe[src]:not(.lazy-iframe):not(.loaded)');
        newIframes.forEach(iframe => {
            iframe.dataset.src = iframe.src;
            iframe.src = this.createPlaceholderSrc(iframe);
            iframe.classList.add('lazy-iframe');
            this.iframeObserver.observe(iframe);
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
    
    // Событие для отладки
    document.addEventListener('iframeLoaded', (e) => {
        console.log('Iframe loaded:', e.detail.element);
    });
    
    document.addEventListener('iframeError', (e) => {
        console.error('Iframe failed to load:', e.detail.element);
    });
});

// Экспорт для модульной системы (если используется)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}