// Service Worker for carb-me PWA
const CACHE_NAME = 'carb-me-1.10.0';

// Get the base path from the service worker's location
const BASE_PATH = new URL('.', self.location).pathname.replace(/\/$/, '');

// Assets to cache immediately on install (relative to base path)
const PRECACHE_ASSETS = [
  '',
  '/lebensmittel-daten.json',
  '/manifest.json'
].map(path => BASE_PATH + path || '/');

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell, base:', BASE_PATH);
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        event.waitUntil(
          fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => {
            // Network failed, that's ok - we have cache
          })
        );
        return cachedResponse;
      }

      // No cache - fetch from network and cache result
      return fetch(request).then((networkResponse) => {
        // Only cache successful responses
        if (networkResponse.ok) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed and no cache - return offline page for navigation
        if (request.mode === 'navigate') {
          return caches.match(BASE_PATH || '/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
