// 50个车标有声图鉴（支持按国产/进口/已掌握筛选，点击查看新旧标、颜色变体与真车外观）

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { renderCarShowcaseHTML } from '../data/cars.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';

let filter = 'all';

export function renderEncyclopediaScreen(root, { showModal, closeModal }) {
  const profile = store.getActiveProfile();

  const filtered = BRANDS.filter((b) => {
    const stat = profile.brandStats[b.id];
    const mastered = stat && stat.r >= 2 && stat.r > stat.w;
    if (filter === 'cn') return b.origin === 'cn';
    if (filter === 'intl') return b.origin === 'intl';
    if (filter === 'mastered') return mastered;
    return true;
  });

  root.innerHTML = `
    <div class="filter-row">
      <button class="variant-chip ${filter === 'all' ? 'active' : ''}" data-f="all">全部 (50)</button>
      <button class="variant-chip ${filter === 'cn' ? 'active' : ''}" data-f="cn">🇨🇳 国产 (32)</button>
      <button class="variant-chip ${filter === 'intl' ? 'active' : ''}" data-f="intl">🌍 进口 (18)</button>
      <button class="variant-chip ${filter === 'mastered' ? 'active' : ''}" data-f="mastered">⭐ 已掌握</button>
    </div>

    <div class="brand-grid">
      ${filtered.map((b) => {
        const stat = profile.brandStats[b.id];
        const mastered = stat && stat.r >= 2 && stat.r > stat.w;
        return `
          <div class="brand-cell ${mastered ? 'mastered' : ''}" data-bid="${b.id}">
            ${mastered ? '<span class="master-dot">⭐</span>' : ''}
            ${renderLogoSVG(b.id)}
            <div class="brand-cell-name">${b.name}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  root.querySelectorAll('[data-f]').forEach((btn) => {
    btn.onclick = () => {
      audio.click();
      filter = btn.dataset.f;
      renderEncyclopediaScreen(root, { showModal, closeModal });
    };
  });

  root.querySelectorAll('.brand-cell').forEach((cell) => {
    cell.onclick = () => {
      const brand = BRAND_MAP[cell.dataset.bid];
      if (!brand) return;
      audio.click();
      openBrandDetail(brand, showModal, closeModal);
    };
  });
}

function openBrandDetail(brand, showModal, closeModal) {
  let activeVid = brand.variants[0].id;

  function renderDetail() {
    const html = `
      <div class="modal-header">
        <h2 class="modal-title">${brand.name} <span style="font-size:13px;color:#64748B;font-weight:700;">${brand.en}</span></h2>
        <button id="detail-close" class="icon-btn">✖️</button>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;">
        <div class="logo-stage" style="background:${brand.bgColor};width:150px;height:150px;">
          ${renderLogoSVG(brand.id, { variantId: activeVid })}
        </div>

        <button id="detail-speak" class="speak-big-btn btn-sm" style="padding:10px 18px;font-size:16px;">
          🔊 听介绍 · ${brand.name}
        </button>

        ${brand.variants.length > 1 ? `
          <div class="variant-chips">
            ${brand.variants.map((v) => `
              <button class="variant-chip ${v.id === activeVid ? 'active' : ''}" data-vid="${v.id}">${v.label}</button>
            `).join('')}
          </div>
        ` : ''}

        ${renderCarShowcaseHTML(brand, { showBadge: true, showCaption: true })}

        <p style="margin:0;font-size:14px;font-weight:700;color:#475569;line-height:1.5;">
          ${brand.fact}
        </p>
        <div style="font-size:12px;color:#94A3B8;font-weight:700;">
          所属集团：${brand.group} · ${brand.origin === 'cn' ? '🇨🇳 中国品牌' : '🌍 国际品牌'}
        </div>
      </div>
    `;

    const el = showModal(html);
    el.querySelector('#detail-close').onclick = () => {
      audio.stopSpeak();
      closeModal();
    };
    el.querySelector('#detail-speak').onclick = () => {
      audio.honk();
      audio.speak(`${brand.name}！${brand.fact}`);
    };
    el.querySelectorAll('[data-vid]').forEach((btn) => {
      btn.onclick = () => {
        audio.click();
        activeVid = btn.dataset.vid;
        renderDetail();
      };
    });
  }

  audio.speak(`${brand.name}！${brand.fact}`);
  renderDetail();
}
