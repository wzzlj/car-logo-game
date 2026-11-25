const CACHE_NAME = 'car-logo-game-v4';
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./assets/icons/icon.svg",
  "./src/main.js",
  "./src/data/brands.js",
  "./src/data/logoManifest.js",
  "./src/data/logos.js",
  "./src/data/cars.js",
  "./src/data/levels.js",
  "./src/data/garage.js",
  "./src/engine/audio.js",
  "./src/engine/storage.js",
  "./src/engine/qr.js",
  "./src/modes/learn.js",
  "./src/modes/quiz.js",
  "./src/modes/memory.js",
  "./src/modes/puzzle.js",
  "./src/ui/map.js",
  "./src/ui/garage.js",
  "./src/ui/encyclopedia.js",
  "./src/ui/parent.js",
  "./src/ui/overlays.js",
  "./assets/logos/aion.png",
  "./assets/logos/aito.svg",
  "./assets/logos/audi.svg",
  "./assets/logos/avatr.svg",
  "./assets/logos/baojun.png",
  "./assets/logos/bmw.svg",
  "./assets/logos/buick.svg",
  "./assets/logos/buick_classic.svg",
  "./assets/logos/byd.svg",
  "./assets/logos/cadillac.svg",
  "./assets/logos/changan.svg",
  "./assets/logos/chery.svg",
  "./assets/logos/deepal.svg",
  "./assets/logos/denza.svg",
  "./assets/logos/exeed.png",
  "./assets/logos/fangchengbao.png",
  "./assets/logos/ferrari.svg",
  "./assets/logos/ford.svg",
  "./assets/logos/gac.png",
  "./assets/logos/geely.svg",
  "./assets/logos/geely_classic.svg",
  "./assets/logos/gwm.png",
  "./assets/logos/haval.svg",
  "./assets/logos/honda.svg",
  "./assets/logos/hongqi.svg",
  "./assets/logos/hyundai.svg",
  "./assets/logos/im.svg",
  "./assets/logos/jetour.svg",
  "./assets/logos/landrover.svg",
  "./assets/logos/leapmotor.png",
  "./assets/logos/lexus.svg",
  "./assets/logos/lixiang.svg",
  "./assets/logos/lynkco.svg",
  "./assets/logos/mazda.svg",
  "./assets/logos/mercedes.png",
  "./assets/logos/mg.svg",
  "./assets/logos/nio.svg",
  "./assets/logos/nissan.svg",
  "./assets/logos/ora.svg",
  "./assets/logos/porsche.png",
  "./assets/logos/roewe.png",
  "./assets/logos/tank.svg",
  "./assets/logos/tesla.svg",
  "./assets/logos/toyota.svg",
  "./assets/logos/volvo.svg",
  "./assets/logos/vw.svg",
  "./assets/logos/wey.png",
  "./assets/logos/wuling.svg",
  "./assets/logos/xiaomi.svg",
  "./assets/logos/xpeng.svg",
  "./assets/logos/yangwang.svg",
  "./assets/logos/zeekr.svg"
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
