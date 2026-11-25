// 我的车库养成与装修界面

import { GARAGE_CARS, GARAGE_THEMES, GARAGE_DECORS } from '../data/garage.js';
import { BRAND_MAP } from '../data/brands.js';
import { renderCarSVG, getRealCarPhotoUrl } from '../data/cars.js';
import { renderLogoSVG } from '../data/logos.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';

let currentTab = 'cars';

export function renderGarageScreen(root, { onBurstFX }) {
  const profile = store.getActiveProfile();
  const g = profile.garage;
  const activeCarBrand = BRAND_MAP[g.activeCar] || BRAND_MAP.wuling;
  const activeCarMeta = GARAGE_CARS.find((c) => c.id === g.activeCar) || GARAGE_CARS[0];
  const activeTheme = GARAGE_THEMES.find((t) => t.id === g.activeTheme) || GARAGE_THEMES[0];
  const activeDecorObjs = GARAGE_DECORS.filter((d) => g.activeDecors.includes(d.id));

  root.innerHTML = `
    <div class="garage-stage" style="background:${activeTheme.bg}">
      <div class="garage-decor-row">
        ${activeDecorObjs.length > 0
          ? activeDecorObjs.map((d) => `<span title="${d.name}">${d.emoji}</span>`).join('')
          : '<span style="opacity:0.45;font-size:14px;font-weight:800;background:rgba(255,255,255,0.7);padding:4px 10px;border-radius:999px;">买点小摆件装饰车库吧！</span>'
        }
      </div>

      <div id="garage-car-tap" class="garage-car-display">
        <div class="garage-photo-frame">
          ${renderCarSVG(activeCarBrand, { showBadge: false })}
          <img src="${getRealCarPhotoUrl(activeCarBrand.id, 1)}" alt="${activeCarMeta.name}" class="garage-real-img" onerror="this.remove()" />
          <div class="garage-mini-logo">${renderLogoSVG(activeCarBrand.id)}</div>
        </div>
        <div style="background:rgba(255,255,255,0.92);padding:5px 14px;border-radius:999px;font-size:14px;font-weight:900;margin-top:8px;box-shadow:0 3px 8px rgba(0,0,0,0.12);">
          🔊 点一点爱车：${activeCarMeta.name}
        </div>
      </div>
    </div>

    <div class="garage-tabs">
      <button class="pill-tab ${currentTab === 'cars' ? 'active' : ''}" data-gtab="cars">🚗 爱车展厅</button>
      <button class="pill-tab ${currentTab === 'themes' ? 'active' : ''}" data-gtab="themes">🎨 车库主题</button>
      <button class="pill-tab ${currentTab === 'decors' ? 'active' : ''}" data-gtab="decors">🎈 趣味摆件</button>
    </div>

    <div id="garage-shop" class="shop-grid"></div>
  `;

  root.querySelector('#garage-car-tap').onclick = (e) => {
    audio.honk();
    audio.speak(`嘀嘀！这是我的${activeCarMeta.name}！`);
    if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 200);
  };

  root.querySelectorAll('.pill-tab').forEach((btn) => {
    btn.onclick = () => {
      audio.click();
      currentTab = btn.dataset.gtab;
      renderGarageScreen(root, { onBurstFX });
    };
  });

  const shop = root.querySelector('#garage-shop');

  if (currentTab === 'cars') {
    shop.innerHTML = GARAGE_CARS.map((car) => {
      const owned = g.ownedCars.includes(car.id);
      const equipped = g.activeCar === car.id;
      const brand = BRAND_MAP[car.id];
      return `
        <div class="shop-card ${equipped ? 'equipped' : ''}">
          <div style="position:relative;width:100%;height:82px;overflow:hidden;border-radius:12px;">
            ${renderCarSVG(brand, { showBadge: false })}
            <img src="${getRealCarPhotoUrl(brand.id, 1)}" alt="${car.name}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove()" />
          </div>
          <div style="font-size:14px;font-weight:900;">${car.name}</div>
          <button class="btn btn-sm ${equipped ? 'btn-success' : owned ? 'btn-secondary' : 'btn-warning'} btn-block" data-car-id="${car.id}">
            ${equipped ? '✅ 正在展示' : owned ? '开进车库' : `🪙 ${car.cost} 解锁`}
          </button>
        </div>
      `;
    }).join('');

    shop.querySelectorAll('[data-car-id]').forEach((btn) => {
      btn.onclick = (e) => {
        const id = btn.dataset.carId;
        const car = GARAGE_CARS.find((c) => c.id === id);
        if (g.ownedCars.includes(id)) {
          g.activeCar = id;
          store.save();
          audio.honk();
          audio.speak(`已把${car.name}开进车库啦！`);
        } else if (profile.coins >= car.cost) {
          profile.coins -= car.cost;
          g.ownedCars.push(id);
          g.activeCar = id;
          store.save();
          audio.win();
          audio.speak(`恭喜获得新车，${car.name}！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          audio.wrong();
          audio.speak(`车币还不够哦，再闯一关赚点车币吧！`);
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  } else if (currentTab === 'themes') {
    shop.innerHTML = GARAGE_THEMES.map((t) => {
      const owned = g.ownedThemes.includes(t.id);
      const equipped = g.activeTheme === t.id;
      return `
        <div class="shop-card ${equipped ? 'equipped' : ''}">
          <div style="width:100%;height:68px;border-radius:14px;background:${t.bg};display:flex;align-items:center;justify-content:center;font-size:32px;">
            ${t.emoji}
          </div>
          <div style="font-size:14px;font-weight:900;">${t.name}</div>
          <button class="btn btn-sm ${equipped ? 'btn-success' : owned ? 'btn-secondary' : 'btn-warning'} btn-block" data-theme-id="${t.id}">
            ${equipped ? '✅ 使用中' : owned ? '切换主题' : `🪙 ${t.cost} 装修`}
          </button>
        </div>
      `;
    }).join('');

    shop.querySelectorAll('[data-theme-id]').forEach((btn) => {
      btn.onclick = (e) => {
        const id = btn.dataset.themeId;
        const theme = GARAGE_THEMES.find((t) => t.id === id);
        if (g.ownedThemes.includes(id)) {
          g.activeTheme = id;
          store.save();
          audio.correct();
          audio.speak(`车库换成了${theme.name}！`);
        } else if (profile.coins >= theme.cost) {
          profile.coins -= theme.cost;
          g.ownedThemes.push(id);
          g.activeTheme = id;
          store.save();
          audio.win();
          audio.speak(`太漂亮啦！解锁了${theme.name}！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          audio.wrong();
          audio.speak('车币还差一点点，继续闯关吧！');
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  } else {
    shop.innerHTML = GARAGE_DECORS.map((d) => {
      const owned = g.ownedDecors.includes(d.id);
      const active = g.activeDecors.includes(d.id);
      return `
        <div class="shop-card ${active ? 'equipped' : ''}">
          <div style="font-size:44px;line-height:1.2;">${d.emoji}</div>
          <div style="font-size:14px;font-weight:900;">${d.name}</div>
          <button class="btn btn-sm ${active ? 'btn-success' : owned ? 'btn-secondary' : 'btn-warning'} btn-block" data-decor-id="${d.id}">
            ${active ? '✅ 已摆放(点此收起)' : owned ? '摆进车库' : `🪙 ${d.cost} 购买`}
          </button>
        </div>
      `;
    }).join('');

    shop.querySelectorAll('[data-decor-id]').forEach((btn) => {
      btn.onclick = (e) => {
        const id = btn.dataset.decorId;
        const decor = GARAGE_DECORS.find((d) => d.id === id);
        if (g.ownedDecors.includes(id)) {
          if (g.activeDecors.includes(id)) {
            g.activeDecors = g.activeDecors.filter((x) => x !== id);
          } else {
            g.activeDecors.push(id);
          }
          store.save();
          audio.click();
        } else if (profile.coins >= decor.cost) {
          profile.coins -= decor.cost;
          g.ownedDecors.push(id);
          g.activeDecors.push(id);
          store.save();
          audio.win();
          audio.speak(`买到了${decor.name}，摆进车库啦！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          audio.wrong();
          audio.speak('车币不够哦，去闯关赢车币吧！');
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  }
}
