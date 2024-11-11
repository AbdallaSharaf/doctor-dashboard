self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
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
  