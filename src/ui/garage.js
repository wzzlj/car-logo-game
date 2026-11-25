// 我的车库养成、装修与“小汽车喷漆变色”界面

import { GARAGE_CARS, GARAGE_THEMES, GARAGE_DECORS } from '../data/garage.js';
import { BRAND_MAP } from '../data/brands.js';
import { renderCarSVG, getRealCarPhotoUrl } from '../data/cars.js';
import { renderLogoSVG } from '../data/logos.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';

const PAINT_COLORS = [
  { name: '烈焰红', hex: '#E63946' },
  { name: '活力橙', hex: '#FF6B35' },
  { name: '柠檬黄', hex: '#FFB703' },
  { name: '薄荷绿', hex: '#2EC4B6' },
  { name: '天空蓝', hex: '#3A86FF' },
  { name: '闪电紫', hex: '#8338EC' },
  { name: '甜心粉', hex: '#FF6B9D' },
  { name: '珍珠白', hex: '#F1F5F9' },
  { name: '酷炫黑', hex: '#2B2D42' }
];

let currentTab = 'cars';
let viewMode = 'paint'; // 'paint' (可喷漆变色矢量车) | 'photo' (真车实拍对照)

export function renderGarageScreen(root, { onBurstFX }) {
  const profile = store.getActiveProfile();
  const g = profile.garage;
  if (!g.carColors) g.carColors = {};

  const activeCarBrand = BRAND_MAP[g.activeCar] || BRAND_MAP.wuling;
  const activeCarMeta = GARAGE_CARS.find((c) => c.id === g.activeCar) || GARAGE_CARS[0];
  const activeTheme = GARAGE_THEMES.find((t) => t.id === g.activeTheme) || GARAGE_THEMES[0];
  const activeDecorObjs = GARAGE_DECORS.filter((d) => g.activeDecors.includes(d.id));
  const currentColor = g.carColors[activeCarBrand.id] || activeCarBrand.carColor;

  root.innerHTML = `
    <div class="garage-stage" style="background:${activeTheme.bg}">
      <div class="garage-top-bar">
        <div class="garage-decor-row" style="gap:8px;">
          ${activeDecorObjs.length > 0
            ? activeDecorObjs.map((d) => `<span title="${d.name}">${d.emoji}</span>`).join('')
            : '<span style="opacity:0.75;font-size:12px;font-weight:800;background:rgba(255,255,255,0.75);padding:4px 10px;border-radius:999px;">买点摆件装扮车库吧</span>'
          }
        </div>
        <button id="btn-toggle-view" class="garage-view-pill">
          ${viewMode === 'paint' ? '📸 看真车照片' : '🎨 回到喷漆车'}
        </button>
      </div>

      <div id="garage-car-tap" class="garage-car-display">
        ${viewMode === 'paint'
          ? `<div class="garage-paint-car">${renderCarSVG(activeCarBrand, { showBadge: true, customColor: currentColor })}</div>`
          : `<div class="garage-photo-frame">
               ${renderCarSVG(activeCarBrand, { showBadge: false, customColor: currentColor })}
               <img src="${getRealCarPhotoUrl(activeCarBrand.id, 1)}" alt="${activeCarMeta.name}" class="garage-real-img" onerror="this.remove()" />
               <div class="garage-mini-logo">${renderLogoSVG(activeCarBrand.id)}</div>
             </div>`
        }
        <div style="background:rgba(255,255,255,0.92);padding:5px 14px;border-radius:999px;font-size:14px;font-weight:900;margin-top:6px;box-shadow:0 3px 8px rgba(0,0,0,0.12);">
          🔊 点一点爱车：${activeCarMeta.name}
        </div>
      </div>
    </div>

    <!-- 汽车喷漆房调色盘 -->
    <div class="paint-bar">
      <div class="paint-bar-title">🎨 给爱车喷漆变色（免费随便换！）</div>
      <div class="paint-swatches">
        ${PAINT_COLORS.map((c) => `
          <button
            class="paint-swatch ${currentColor.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}"
            data-color="${c.hex}"
            data-cname="${c.name}"
            style="background:${c.hex};"
            title="${c.name}"
            aria-label="${c.name}"
          ></button>
        `).join('')}
      </div>
    </div>

    <div class="garage-tabs">
      <button class="pill-tab ${currentTab === 'cars' ? 'active' : ''}" data-gtab="cars">🚗 爱车展厅</button>
      <button class="pill-tab ${currentTab === 'themes' ? 'active' : ''}" data-gtab="themes">🏞️ 车库主题</button>
      <button class="pill-tab ${currentTab === 'decors' ? 'active' : ''}" data-gtab="decors">🎈 趣味摆件</button>
    </div>

    <div id="garage-shop" class="shop-grid"></div>
  `;

  root.querySelector('#btn-toggle-view').onclick = () => {
    audio.click();
    viewMode = viewMode === 'paint' ? 'photo' : 'paint';
    renderGarageScreen(root, { onBurstFX });
  };

  root.querySelector('#garage-car-tap').onclick = (e) => {
    audio.honk();
    audio.speak(`嘀嘀！这是我的${activeCarMeta.name}！`);
    if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 200);
  };

  root.querySelectorAll('.paint-swatch').forEach((btn) => {
    btn.onclick = (e) => {
      const hex = btn.dataset.color;
      const cname = btn.dataset.cname;
      g.carColors[activeCarBrand.id] = hex;
      viewMode = 'paint';
      store.save();
      audio.paint();
      audio.speak(`哇！你的小汽车变成${cname}啦！`);
      if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 240);
      renderGarageScreen(root, { onBurstFX });
    };
  });

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
      const savedColor = g.carColors[car.id] || brand.carColor;
      return `
        <div class="shop-card ${equipped ? 'equipped' : ''}">
          <div style="position:relative;width:100%;height:82px;overflow:hidden;border-radius:12px;">
            ${renderCarSVG(brand, { showBadge: false, customColor: savedColor })}
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
          audio.speak(`还需要多玩几局攒够车币才能买${car.name}哦！`);
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
          audio.speak('车币还不够哦，多玩几局攒车币吧！');
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
          audio.speak('车币不够哦，去多玩几局赢车币吧！');
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  }
}
