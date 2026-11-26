// Direction A (Mini Cockpit) 88 个车标有声图鉴（支持国产/国际/已掌握筛选 + 深炭灰展台详情卡）

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG, hasFullWordmark, isIconOnlyOnHood } from '../data/logos.js';
import { renderCarShowcaseHTML } from '../data/cars.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';
import { ICONS } from './icons.js';

let filter = 'all';

export function renderEncyclopediaScreen(root, { showModal, closeModal }) {
  const profile = store.getActiveProfile();
  const cnCount = BRANDS.filter((b) => b.origin === 'cn').length;
  const intlCount = BRANDS.length - cnCount;

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
      <button class="variant-chip ${filter === 'all' ? 'active' : ''}" data-f="all">全部 (${BRANDS.length})</button>
      <button class="variant-chip ${filter === 'cn' ? 'active' : ''}" data-f="cn">国产 (${cnCount})</button>
      <button class="variant-chip ${filter === 'intl' ? 'active' : ''}" data-f="intl">国际 (${intlCount})</button>
      <button class="variant-chip ${filter === 'mastered' ? 'active' : ''}" data-f="mastered">已掌握</button>
    </div>

    <div class="brand-grid">
      ${filtered.map((b) => {
        const stat = profile.brandStats[b.id];
        const mastered = stat && stat.r >= 2 && stat.r > stat.w;
        return `
          <div class="brand-cell ${mastered ? 'mastered' : ''}" data-bid="${b.id}">
            ${mastered ? `<span class="master-dot">${ICONS.star(13)}</span>` : ''}
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
  let activeVid = 'default';

  function renderDetail() {
    const chips = brand.variants.map((v) => ({ id: v.id, label: v.label }));
    if (hasFullWordmark(brand.id)) {
      chips[0] = { id: 'default', label: '车头纯图标' };
      chips.splice(1, 0, { id: 'wordmark', label: '带字母完整标' });
    }
    const showHoodTip = isIconOnlyOnHood(brand.id);

    const html = `
      <div class="modal-header">
        <h2 class="modal-title">${brand.name} <span style="font-size:12px;color:#646D7E;font-weight:700;">${brand.en}</span></h2>
        <button id="detail-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;">
        <div class="logo-stage" style="width:154px;height:154px;">
          <div class="logo-stage-pad">
            ${renderLogoSVG(brand.id, { variantId: activeVid })}
          </div>
        </div>

        <button id="detail-speak" class="speak-big-btn btn-sm" style="padding:10px 18px;font-size:15px;">
          ${ICONS.speaker(16)} 听介绍 · ${brand.name}
        </button>

        ${chips.length > 1 ? `
          <div class="variant-chips">
            ${chips.map((v) => `
              <button class="variant-chip ${v.id === activeVid ? 'active' : ''}" data-vid="${v.id}">${v.label}</button>
            `).join('')}
          </div>
        ` : ''}

        ${showHoodTip ? `
          <div class="hood-tip-box">
            <strong>车头认标提示：</strong>汽车车头上通常只展示图形图标，不带旁边的英文字母哦！
          </div>
        ` : ''}

        ${renderCarShowcaseHTML(brand, { showBadge: false, showCaption: true })}

        <p style="margin:0;font-size:14px;font-weight:700;color:#475569;line-height:1.5;">
          ${brand.fact}
        </p>
        <div style="font-size:12px;color:#646D7E;font-weight:700;">
          所属集团：${brand.group} · ${brand.origin === 'cn' ? '中国品牌' : '国际品牌'}
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
