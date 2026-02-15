// frontend/imageCache.js
/**
 * A simple in-memory cache and lazy loader for images.
 */
const imageCache = {
    preloaded: new Set(),

    /**
     * Kicks off the download for a list of image URLs and stores them in the browser cache.
     * Does not wait for them to finish loading.
     * @param {string[]} urls - Array of image URLs to preload.
     */
    preload(urls) {
        if (!Array.isArray(urls)) return;
        urls.forEach(url => {
            if (url && !this.preloaded.has(url)) {
                this.preloaded.add(url);
                const img = new Image();
                img.src = url;
            }
        });
    },

    /**
     * Scans the DOM for images with the '.lazy-image' class and uses IntersectionObserver
     * to load them only when they are near the viewport.
     */
    lazyLoad() {
        const lazyImages = Array.from(document.querySelectorAll('img.lazy-image'));

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, self) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;

                        // On load, add 'loaded' class for fade-in effect.
                        lazyImage.onload = () => {
                            lazyImage.classList.add('loaded');
                        };

                        // On error, log it. The placeholder style remains.
                        lazyImage.onerror = () => {
                            console.error(`Failed to load image: ${lazyImage.dataset.src}`);
                        };

                        // Stop observing this image once loading has started.
                        lazyImage.classList.remove('lazy-image');
                        self.unobserve(lazyImage);
                    }
                });
            });

            lazyImages.forEach(image => observer.observe(image));
        } else {
            // Fallback for browsers without IntersectionObserver. Load all images immediately.
            console.warn('IntersectionObserver not supported. Loading all images immediately.');
            lazyImages.forEach(lazyImage => {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove('lazy-image');
                lazyImage.classList.add('loaded');
            });
        }
    }
};

export { imageCache };