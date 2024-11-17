const CACHE_NAME = 'my-cache-v1';  // Versioned cache name

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll([
        '/doctor-dashboard/',  
        '/doctor-dashboard/index.html',
        '/doctor-dashboard/pwa-icon.png',
        '/doctor-dashboard/logo-pwa-512.png',
      ]);
    }).then(() => {
      console.log('All assets cached');
    }).catch((error) => {
      console.error('Caching failed:', error);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');

  // Clear old caches (if any)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('Old caches cleared');
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve cached response
        console.log('Serving from cache:', event.request.url);
        return cachedResponse;
      }
      
      // Fetch from network and cache the response if successful
      return fetch(event.request).then((networkResponse) => {
        // Only cache successful responses (status 200)
        if (networkResponse && networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch((error) => {
        console.error('Fetch failed:', error);
        // Optionally, handle offline fallback here (e.g., show an offline page)
        return caches.match('/doctor-dashboard/offline.html');
      });
    })
  );
});
