const imageCache = new Set();

export function preloadImages(imageUrls) {
  imageUrls.forEach(src => {
    if (imageCache.has(src)) return;

    const img = new Image();
    img.src = src;
    imageCache.add(src);
  });
}
