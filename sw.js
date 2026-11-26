const CACHE_NAME = 'car-logo-game-v6';
const CORE_ASSETS = [
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
  "./src/ui/icons.js",
  "./src/ui/map.js",
  "./src/ui/garage.js",
  "./src/ui/encyclopedia.js",
  "./src/ui/parent.js",
  "./src/ui/overlays.js",
  "./assets/logos/acura.svg",
  "./assets/logos/aion.png",
  "./assets/logos/aito.svg",
  "./assets/logos/alfaromeo.png",
  "./assets/logos/arcfox.svg",
  "./assets/logos/astonmartin.svg",
  "./assets/logos/audi.svg",
  "./assets/logos/avatr.svg",
  "./assets/logos/baic.png",
  "./assets/logos/baojun.png",
  "./assets/logos/bentley.svg",
  "./assets/logos/bmw.svg",
  "./assets/logos/bugatti.svg",
  "./assets/logos/buick.svg",
  "./assets/logos/buick_classic.svg",
  "./assets/logos/byd.svg",
  "./assets/logos/cadillac.svg",
  "./assets/logos/changan.svg",
  "./assets/logos/chery.svg",
  "./assets/logos/chevrolet.svg",
  "./assets/logos/citroen.svg",
  "./assets/logos/deepal.svg",
  "./assets/logos/denza.svg",
  "./assets/logos/dongfeng.svg",
  "./assets/logos/exeed.png",
  "./assets/logos/fangchengbao.png",
  "./assets/logos/faw.png",
  "./assets/logos/ferrari.svg",
  "./assets/logos/fiat.svg",
  "./assets/logos/ford.svg",
  "./assets/logos/foton.svg",
  "./assets/logos/gac.png",
  "./assets/logos/geely.svg",
  "./assets/logos/geely_classic.svg",
  "./assets/logos/gwm.png",
  "./assets/logos/haval.svg",
  "./assets/logos/honda.svg",
  "./assets/logos/hongqi.svg",
  "./assets/logos/hyundai.svg",
  "./assets/logos/im.svg",
  "./assets/logos/infiniti.svg",
  "./assets/logos/jac.png",
  "./assets/logos/jaguar.svg",
  "./assets/logos/jeep.svg",
  "./assets/logos/jetour.svg",
  "./assets/logos/kia.svg",
  "./assets/logos/kinglong.png",
  "./assets/logos/lamborghini.svg",
  "./assets/logos/landrover.svg",
  "./assets/logos/leapmotor.png",
  "./assets/logos/lexus.svg",
  "./assets/logos/lincoln.svg",
  "./assets/logos/lixiang.svg",
  "./assets/logos/lotus.svg",
  "./assets/logos/lynkco.svg",
  "./assets/logos/maserati.svg",
  "./assets/logos/maxus.png",
  "./assets/logos/mazda.svg",
  "./assets/logos/mclaren.svg",
  "./assets/logos/mercedes.png",
  "./assets/logos/mg.svg",
  "./assets/logos/mini.svg",
  "./assets/logos/mitsubishi.svg",
  "./assets/logos/neta.png",
  "./assets/logos/nio.svg",
  "./assets/logos/nissan.svg",
  "./assets/logos/ora.svg",
  "./assets/logos/peugeot.svg",
  "./assets/logos/polestar.svg",
  "./assets/logos/porsche.png",
  "./assets/logos/renault.svg",
  "./assets/logos/roewe.png",
  "./assets/logos/rollsroyce.svg",
  "./assets/logos/skoda.png",
  "./assets/logos/smart.svg",
  "./assets/logos/subaru.png",
  "./assets/logos/suzuki.svg",
  "./assets/logos/tank.svg",
  "./assets/logos/tesla.svg",
  "./assets/logos/toyota.svg",
  "./assets/logos/volvo.svg",
  "./assets/logos/voyah.png",
  "./assets/logos/vw.svg",
  "./assets/logos/wey.png",
  "./assets/logos/wuling.svg",
  "./assets/logos/xiaomi.svg",
  "./assets/logos/xpeng.svg",
  "./assets/logos/yangwang.svg",
  "./assets/logos/yutong.png",
  "./assets/logos/zeekr.svg"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
