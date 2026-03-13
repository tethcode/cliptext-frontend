self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // This stays empty for now since we're offline, 
  // but its presence satisfies the PWA requirement.
  event.respondWith(fetch(event.request));
});