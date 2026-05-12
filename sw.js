const CACHE_NAME = 'qrsedekah-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/qrcode.min.js',
  './js/html5-qrcode.min.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './data/hikmah.json'
];

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - version.json → NetworkOnly (always fresh)
// - data JSON files → NetworkFirst (fresh when online, cache fallback offline)
// - everything else → CacheFirst (static assets)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NetworkOnly for versioning file
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // NetworkFirst for data files
  if (url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CacheFirst for everything else
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});