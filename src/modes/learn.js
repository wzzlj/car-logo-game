// “先学后考”认识卡片环节：展示车标、新旧/多色变体切换、真车外观与中文语音讲解

import { BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { renderCarShowcaseHTML } from '../data/cars.js';
import { audio } from '../engine/audio.js';

export function runLearnPhase(root, { brandIds, onComplete, onExit }) {
  let index = 0;
  let activeVariantId = null;

  function render() {
    const brand = BRAND_MAP[brandIds[index]];
    if (!brand) {
      onComplete();
      return;
    }
    if (!activeVariantId || !brand.variants.some((v) => v.id === activeVariantId)) {
      activeVariantId = brand.variants[0].id;
    }
    const pct = Math.round(((index + 1) / brandIds.length) * 100);

    root.innerHTML = `
      <div class="play-header">
        <button id="learn-exit" class="icon-btn" aria-label="返回地图">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip" style="font-size:13px;padding:4px 10px;">📖 ${index + 1}/${brandIds.length}</span>
      </div>

      <div class="learn-card">
        <div style="font-size:13px;font-weight:800;color:#FF6B35;background:#FFF0E6;padding:4px 12px;border-radius:999px;">
          ✨ 先来认识一下它！
        </div>

        <div id="learn-logo-stage" class="logo-stage" style="background:${brand.bgColor}">
          ${renderLogoSVG(brand.id, { variantId: activeVariantId })}
        </div>

        <button id="learn-speak-btn" class="speak-big-btn">
          <span>🔊</span>
          <span>${brand.name}</span>
        </button>

        ${brand.variants.length > 1 ? `
          <div class="variant-chips">
            ${brand.variants.map((v) => `
              <button class="variant-chip ${v.id === activeVariantId ? 'active' : ''}" data-vid="${v.id}">
                ${v.label}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${renderCarShowcaseHTML(brand, { showBadge: true, showCaption: true })}

        <p style="margin:2px 0 6px;font-size:14px;font-weight:700;color:#5F6C7B;line-height:1.5;">
          ${brand.fact}
        </p>

        <div style="display:flex;gap:10px;width:100%;">
          ${index > 0 ? `<button id="learn-prev" class="btn btn-soft" style="flex:1">⬅️ 上一个</button>` : ''}
          <button id="learn-next" class="btn btn-success" style="flex:2">
            ${index === brandIds.length - 1 ? '🚀 开始闯关答题！' : '认识啦，下一个 ➡️'}
          </button>
        </div>
      </div>
    `;

    audio.speak(`这是${brand.name}！${brand.fact}`);

    root.querySelector('#learn-exit').onclick = () => {
      audio.stopSpeak();
      audio.click();
      onExit();
    };

    root.querySelector('#learn-speak-btn').onclick = () => {
      audio.honk();
      audio.speak(`${brand.name}！${brand.fact}`);
    };

    root.querySelector('#learn-logo-stage').onclick = () => {
      audio.click();
      audio.speak(brand.name);
    };

    root.querySelectorAll('.variant-chip').forEach((btn) => {
      btn.onclick = () => {
        audio.click();
        activeVariantId = btn.dataset.vid;
        const vObj = brand.variants.find((v) => v.id === activeVariantId);
        render();
        if (vObj) audio.speak(`${brand.name}的${vObj.label}`);
      };
    });

    const prevBtn = root.querySelector('#learn-prev');
    if (prevBtn) {
      prevBtn.onclick = () => {
        audio.click();
        index -= 1;
        activeVariantId = null;
        render();
      };
    }

    root.querySelector('#learn-next').onclick = () => {
      audio.click();
      if (index < brandIds.length - 1) {
        index += 1;
        activeVariantId = null;
        render();
      } else {
        onComplete();
      }
    };
  }

  render();
}
