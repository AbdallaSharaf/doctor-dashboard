self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    // Cache important assets, etc.
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
            '/doctor-dashboard/',  // Home page
            '/doctor-dashboard/index.html',
            '/doctor-dashboard/pwa-icon.png',
            '/doctor-dashboard/logo-pwa-512.png',
          // Add more files to cache if needed
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
    // You can clear old caches or handle activation steps here
  });
  
  self.addEventListener('fetch', (event) => {
    // Handle fetch events, cache responses
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);  // Network fallback
      })
    );
  });
  