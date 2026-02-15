/**
 * ResqTap Service Worker
 * Provides offline caching for emergency data
 */

const CACHE_NAME = 'resqtap-v1';
const OFFLINE_URL = '/offline.html';
const IS_DEV = ['localhost', '127.0.0.1', '0.0.0.0'].includes(self.location.hostname);

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/injury.html',
    '/cpr.html',
    '/style.css',
    '/cpr.css',
    '/script.js',
    '/injury.js',
    '/offline.html'
];

// API endpoints to cache
const API_CACHE_URLS = [
    '/api/crisis',
    '/api/crisis/critical'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    if (IS_DEV) return;
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName !== CACHE_NAME)
                        .map((cacheName) => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    if (IS_DEV) {
        return;
    }

    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    const fetchWithTimeout = (req, ms = 6000) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return fetch(req, { signal: controller.signal }).finally(() => clearTimeout(timer));
    };

    // Handle API requests with network-first strategy
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetchWithTimeout(request)
                .then((response) => {
                    // Clone response and cache it
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    // Fallback to cached API response
                    return caches.match(request);
                })
        );
        return;
    }

    // Handle static assets with cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Cache successful responses
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => cache.put(request, responseClone));

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Handle background sync for offline favorites
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-favorites') {
        event.waitUntil(syncFavorites());
    }
});

async function syncFavorites() {
    // Future: sync favorites to server when online
    console.log('Syncing favorites...');
}
