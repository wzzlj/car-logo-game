// Direction A (Mini Cockpit) 车库喷漆房：11 款专属精细车型 + 9 色烤漆喷涂 + 直观金钥匙进度解锁

import { GARAGE_CARS, GARAGE_THEMES, GARAGE_DECORS } from '../data/garage.js';
import { BRAND_MAP } from '../data/brands.js';
import { renderCarSVG, getRealCarPhotoUrl } from '../data/cars.js';
import { renderLogoSVG } from '../data/logos.js';
import { store, ENERGY_PER_KEY } from '../engine/storage.js';
import { audio } from '../engine/audio.js';
import { ICONS } from './icons.js';

const PAINT_COLORS = [
  { name: '赛车橙', hex: '#FF4F17' },
  { name: '法拉利红', hex: '#E11D48' },
  { name: '赛道黄', hex: '#F59E0B' },
  { name: '薄荷绿', hex: '#10B981' },
  { name: '海湾蓝', hex: '#2563EB' },
  { name: '电光紫', hex: '#7C3AED' },
  { name: '甜心粉', hex: '#EC4899' },
  { name: '珍珠白', hex: '#F1F5F9' },
  { name: '枪灰黑', hex: '#2B313F' }
];

let currentTab = 'cars';
let viewMode = 'paint'; // 'paint' | 'photo'

function renderKeyProgress(haveKeys, costKeys) {
  const pct = Math.min(100, Math.round((haveKeys / Math.max(1, costKeys)) * 100));
  const remain = Math.max(0, costKeys - haveKeys);
  const showDots = costKeys <= 12;
  return `
    <div class="key-progress-wrap">
      ${showDots
        ? `<div class="key-slots-dots">${Array.from({ length: costKeys }, (_, i) => `<span class="key-dot ${i < haveKeys ? 'have' : ''}"></span>`).join('')}</div>`
        : `<div class="key-progress-bar"><div class="key-progress-fill" style="width:${pct}%"></div></div>`
      }
      <div style="font-size:11px;font-weight:800;color:${remain === 0 ? '#FF4F17' : '#646D7E'};">
        ${remain === 0 ? '钥匙够啦！点我领车' : `已攒 ${haveKeys}/${costKeys} 把钥匙`}
      </div>
    </div>
  `;
}

export function renderGarageScreen(root, { onBurstFX }) {
  const profile = store.getActiveProfile();
  const g = profile.garage;
  if (!g.carColors) g.carColors = {};

  const activeCarBrand = BRAND_MAP[g.activeCar] || BRAND_MAP.wuling;
  const activeCarMeta = GARAGE_CARS.find((c) => c.id === g.activeCar) || GARAGE_CARS[0];
  const activeTheme = GARAGE_THEMES.find((t) => t.id === g.activeTheme) || GARAGE_THEMES[0];
  const activeDecorObjs = GARAGE_DECORS.filter((d) => g.activeDecors.includes(d.id));
  const currentColor = g.carColors[activeCarBrand.id] || activeCarBrand.carColor;
  const currentColorObj = PAINT_COLORS.find((c) => c.hex.toLowerCase() === currentColor.toLowerCase());
  const keys = profile.keys || 0;
  const energy = profile.energy || 0;

  root.innerHTML = `
    <div class="garage-stage" style="background:${activeTheme.bg}">
      <div class="garage-top-bar">
        <div class="garage-decor-row">
          ${activeDecorObjs.length > 0
            ? activeDecorObjs.map((d) => `<span class="decor-tag">${d.name}</span>`).join('')
            : `<span class="decor-tag">${activeTheme.tag} · BAY 01</span>`
          }
        </div>
        <button id="btn-toggle-view" class="garage-view-pill">
          ${viewMode === 'paint' ? `${ICONS.camera(14)} 实拍对照` : `${ICONS.paint(14)} 喷漆展车`}
        </button>
      </div>

      <div id="garage-car-tap" class="garage-car-display">
        ${viewMode === 'paint'
          ? `<div class="garage-paint-car">${renderCarSVG(activeCarBrand, { showBadge: true, customColor: currentColor })}</div>`
          : `<div class="garage-photo-frame">
               <img src="${getRealCarPhotoUrl(activeCarBrand.id, 1)}" alt="${activeCarMeta.name}" class="garage-real-img" />
               <div class="garage-mini-logo">${renderLogoSVG(activeCarBrand.id)}</div>
             </div>`
        }
        <div class="car-nameplate">
          ${ICONS.speaker(14)}
          <span>${activeCarMeta.name}</span>
        </div>
      </div>
    </div>

    <!-- 免费烤漆喷涂面板 -->
    <div class="paint-bar">
      <div class="paint-bar-head">
        <span>免费烤漆变色</span>
        <strong>${currentColorObj ? currentColorObj.name : '原厂车漆'}</strong>
      </div>
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

    <!-- 当前钥匙与充能状态条 -->
    <div class="paint-bar" style="padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
      <div style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:900;color:#171B24;">
        <span style="color:#FF4F17;display:grid;place-items:center;">${ICONS.keySolid(17)}</span>
        <span>拥有 ${keys} 把金钥匙</span>
      </div>
      <div style="font-size:12px;font-weight:800;color:#646D7E;">
        能量 ${energy}/${ENERGY_PER_KEY}（满格 +1 钥匙）
      </div>
    </div>

    <div class="garage-tabs">
      <button class="pill-tab ${currentTab === 'cars' ? 'active' : ''}" data-gtab="cars">爱车展厅</button>
      <button class="pill-tab ${currentTab === 'themes' ? 'active' : ''}" data-gtab="themes">车库主题</button>
      <button class="pill-tab ${currentTab === 'decors' ? 'active' : ''}" data-gtab="decors">赛道装备</button>
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
      audio.speak(`哇！你的小汽车喷成了${cname}！`);
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
      const ready = !owned && keys >= car.costKeys;
      const brand = BRAND_MAP[car.id];
      const savedColor = g.carColors[car.id] || brand.carColor;
      return `
        <div class="shop-card ${equipped ? 'equipped' : ready ? 'ready-unlock' : ''}">
          <div style="position:relative;width:100%;height:78px;overflow:hidden;border-radius:12px;background:#1A1F29;display:grid;place-items:center;">
            ${renderCarSVG(brand, { showBadge: false, customColor: savedColor })}
          </div>
          <div style="font-size:13px;font-weight:900;">${car.name}</div>
          ${!owned ? renderKeyProgress(keys, car.costKeys) : ''}
          <button class="btn btn-sm ${equipped ? 'btn-success' : owned ? 'btn-secondary' : ready ? 'btn-primary' : 'btn-soft'} btn-block" data-car-id="${car.id}">
            ${equipped ? `${ICONS.check(14)} 正在展示` : owned ? '开进车库' : ready ? `${ICONS.keySolid(14)} 领新车` : `${ICONS.lock(13)} ${car.costKeys} 把钥匙`}
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
        } else if (store.spendKeys(car.costKeys)) {
          g.ownedCars.push(id);
          g.activeCar = id;
          store.save();
          audio.win();
          audio.speak(`恭喜解锁新车，${car.name}！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          const need = car.costKeys - (profile.keys || 0);
          audio.wrong();
          audio.speak(`还差${need}把金钥匙就能开走${car.name}啦，再去认车标攒钥匙吧！`);
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  } else if (currentTab === 'themes') {
    shop.innerHTML = GARAGE_THEMES.map((t) => {
      const owned = g.ownedThemes.includes(t.id);
      const equipped = g.activeTheme === t.id;
      const ready = !owned && keys >= t.costKeys;
      return `
        <div class="shop-card ${equipped ? 'equipped' : ready ? 'ready-unlock' : ''}">
          <div style="width:100%;height:64px;border-radius:12px;background:${t.bg};display:grid;place-items:center;color:#FFF;font-family:ui-monospace,monospace;font-size:12px;font-weight:900;letter-spacing:0.1em;border:1px solid rgba(0,0,0,0.12);">
            ${t.tag}
          </div>
          <div style="font-size:13px;font-weight:900;">${t.name}</div>
          ${!owned ? renderKeyProgress(keys, t.costKeys) : ''}
          <button class="btn btn-sm ${equipped ? 'btn-success' : owned ? 'btn-secondary' : ready ? 'btn-primary' : 'btn-soft'} btn-block" data-theme-id="${t.id}">
            ${equipped ? `${ICONS.check(14)} 使用中` : owned ? '切换主题' : ready ? `${ICONS.keySolid(14)} 立即装修` : `${ICONS.lock(13)} ${t.costKeys} 把钥匙`}
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
        } else if (store.spendKeys(theme.costKeys)) {
          g.ownedThemes.push(id);
          g.activeTheme = id;
          store.save();
          audio.win();
          audio.speak(`太漂亮啦！解锁了${theme.name}！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          const need = theme.costKeys - (profile.keys || 0);
          audio.wrong();
          audio.speak(`还差${need}把金钥匙就能装修${theme.name}啦！`);
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  } else {
    shop.innerHTML = GARAGE_DECORS.map((d) => {
      const owned = g.ownedDecors.includes(d.id);
      const active = g.activeDecors.includes(d.id);
      const ready = !owned && keys >= d.costKeys;
      return `
        <div class="shop-card ${active ? 'equipped' : ready ? 'ready-unlock' : ''}">
          <div style="width:52px;height:52px;border-radius:14px;background:#1A1F29;color:#FF6433;display:grid;place-items:center;font-family:ui-monospace,monospace;font-size:12px;font-weight:900;">
            ${d.badge}
          </div>
          <div style="font-size:13px;font-weight:900;">${d.name}</div>
          ${!owned ? renderKeyProgress(keys, d.costKeys) : ''}
          <button class="btn btn-sm ${active ? 'btn-success' : owned ? 'btn-secondary' : ready ? 'btn-primary' : 'btn-soft'} btn-block" data-decor-id="${d.id}">
            ${active ? `${ICONS.check(14)} 已摆放` : owned ? '摆进车库' : ready ? `${ICONS.keySolid(14)} 解锁装备` : `${ICONS.lock(13)} ${d.costKeys} 把钥匙`}
          </button>
        </div>
      `;
    }).join('');

    shop.querySelectorAll('[data-decor-id]').forEach((btn) => {
      btn.onclick = (e) => {
        const id = btn.dataset.decorId;
        const decor = GARAGE_DECORS.find((d) => d.id === id);
        if (g.ownedDecors.includes(id)) {
          g.activeDecors = g.activeDecors.includes(id)
            ? g.activeDecors.filter((x) => x !== id)
            : [...g.activeDecors, id];
          store.save();
          audio.click();
        } else if (store.spendKeys(decor.costKeys)) {
          g.ownedDecors.push(id);
          g.activeDecors.push(id);
          store.save();
          audio.win();
          audio.speak(`解锁了${decor.name}，摆进车库啦！`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);
        } else {
          const need = decor.costKeys - (profile.keys || 0);
          audio.wrong();
          audio.speak(`还差${need}把金钥匙就能买${decor.name}啦！`);
        }
        renderGarageScreen(root, { onBurstFX });
      };
    });
  }
}
