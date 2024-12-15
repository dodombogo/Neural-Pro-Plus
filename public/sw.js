const CACHE_NAME = 'neural-pro-plus-v1';
const OFFLINE_URL = '/Neural-Pro-Plus/offline.html';

const urlsToCache = [
  '/Neural-Pro-Plus/',
  '/Neural-Pro-Plus/index.html',
  '/Neural-Pro-Plus/manifest.json',
  '/Neural-Pro-Plus/icon-192.png',
  '/Neural-Pro-Plus/icon-512.png',
  '/Neural-Pro-Plus/assets/index.css',
  '/Neural-Pro-Plus/assets/index.js'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Clone the request because it's a stream that can only be consumed once
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it's a stream that can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching new resource:', event.request.url);
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If the network is unavailable, try to return the cached offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
}); 