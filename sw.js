const CACHE_NAME = 'qrsedekah-v9';
const OFFLINE_URL = 'offline.html';

const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './js/app.js',
  './js/qrcode.min.js',
  './js/html5-qrcode.min.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable_icon.png',
  './data/hikmah.json'
];

// ── Message handler (SKIP_WAITING from app update banner) ─────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Install — cache all static assets ────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate — clean old caches + enable navigation preload ──────
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Remove old caches
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    // Enable navigation preload if supported
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
    // Notify open tabs that new SW is active
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
  })());
});

// ── Fetch strategy ────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // NetworkOnly — always fresh version file
  if (url.pathname.endsWith('version.json')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  // NetworkFirst — data JSON files
  if (url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Navigation requests — preload → network → offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
        return await fetch(event.request);
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(OFFLINE_URL)) || (await cache.match('./'));
      }
    })());
    return;
  }

  // CacheFirst — all other static assets
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// ── Push Notifications ────────────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'QRSedekah', {
      body: data.body || 'Ada kemaskini baharu untuk anda.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});

// ── Background Sync ───────────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-qr-submissions') {
    event.waitUntil(syncSubmissions());
  }
});

async function syncSubmissions() {
  // Retry any pending community submissions when back online
  const clients = await self.clients.matchAll({ type: 'window' });
  clients.forEach(c => c.postMessage({ type: 'BG_SYNC' }));
}

// ── Periodic Background Sync ──────────────────────────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'refresh-masjid-data') {
    event.waitUntil(periodicRefresh());
  }
});

async function periodicRefresh() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await fetch('./data/version.json?nc=' + Date.now());
    if (res.ok) cache.put('./data/version.json', res);
  } catch {}
}
