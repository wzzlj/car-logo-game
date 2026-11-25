const CACHE_NAME = 'car-logo-game-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './assets/icons/icon.svg',
  './src/main.js',
  './src/data/brands.js',
  './src/data/logoManifest.js',
  './src/data/logos.js',
  './src/data/cars.js',
  './src/data/levels.js',
  './src/data/garage.js',
  './src/engine/audio.js',
  './src/engine/storage.js',
  './src/engine/qr.js',
  './src/modes/learn.js',
  './src/modes/quiz.js',
  './src/modes/memory.js',
  './src/modes/puzzle.js',
  './src/ui/map.js',
  './src/ui/garage.js',
  './src/ui/encyclopedia.js',
  './src/ui/parent.js',
  './src/ui/overlays.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
