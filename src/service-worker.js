// Service Worker for carb-me PWA
// Version wird zur Build-Zeit von VitePWA injiziert
const CACHE_VERSION = '1.11.0'; // Wird durch Build-Prozess ersetzt
const CACHE_NAME = `carb-me-${CACHE_VERSION}`;

// VitePWA injiziert Precache-Manifest hier
const PRECACHE_MANIFEST = self.__WB_MANIFEST || [];

// Get the base path from the service worker's location
const BASE_PATH = new URL('.', self.location).pathname.replace(/\/$/, '');

// Additional assets to cache (beyond VitePWA's manifest)
const ADDITIONAL_ASSETS = [
  '',
  '/lebensmittel-daten.json',
  '/manifest.json'
].map(path => BASE_PATH + path || '/');

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell, base:', BASE_PATH);
      console.log('[SW] VitePWA manifest entries:', PRECACHE_MANIFEST.length);

      // Cache VitePWA manifest entries (with revision hashes)
      const manifestPromises = PRECACHE_MANIFEST.map(entry => {
        const url = typeof entry === 'string' ? entry : entry.url;
        return cache.add(url).catch(err => console.log('[SW] Failed to cache:', url, err));
      });

      // Cache additional assets
      const additionalPromises = cache.addAll(ADDITIONAL_ASSETS);

      return Promise.all([...manifestPromises, additionalPromises]);
    })
  );
  // Don't skip waiting automatically - let the user decide via update notification
  console.log('[SW] New version installed, waiting for activation');
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW] Current cache:', CACHE_NAME);
      console.log('[SW] Found caches:', cacheNames);

      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('carb-me-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Only claim clients after user explicitly updates via SKIP_WAITING message
      console.log('[SW] Activated, waiting for user action to take control');
    })
  );
});

// Message Handler
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] User requested immediate activation');
    self.skipWaiting();
  }
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
