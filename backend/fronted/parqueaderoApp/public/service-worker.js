/* Service Worker para Parqueadero UCC */

const CACHE_NAME = 'parqueadero-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Manejo de fetch - Network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignorar no GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Return cached version on error
        return caches.match(request).then(response => {
          return response || new Response('Offline - sin conexión', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});
