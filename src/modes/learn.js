// Direction A (Mini Cockpit) 先学后考认识卡片：深炭灰金属展台 + 车头纯图标提示 + 完整真车实拍 + 中文语音

import { BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG, hasFullWordmark, isIconOnlyOnHood } from '../data/logos.js';
import { renderCarShowcaseHTML } from '../data/cars.js';
import { audio } from '../engine/audio.js';
import { ICONS } from '../ui/icons.js';

export function runLearnPhase(root, { brandIds, onComplete, onExit }) {
  let index = 0;
  let activeVariantId = 'default';

  function render() {
    const brand = BRAND_MAP[brandIds[index]];
    if (!brand) {
      onComplete();
      return;
    }

    const chips = brand.variants.map((v) => ({ id: v.id, label: v.label }));
    if (hasFullWordmark(brand.id)) {
      chips[0] = { id: 'default', label: '车头纯图标' };
      chips.splice(1, 0, { id: 'wordmark', label: '带字母完整标' });
    }
    if (!chips.some((c) => c.id === activeVariantId)) {
      activeVariantId = chips[0].id;
    }

    const showHoodTip = isIconOnlyOnHood(brand.id);
    const pct = Math.round(((index + 1) / brandIds.length) * 100);

    root.innerHTML = `
      <div class="play-header">
        <button id="learn-exit" class="icon-btn" aria-label="返回驾驶舱">${ICONS.back(18)}</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip">${index + 1}/${brandIds.length}</span>
      </div>

      <div class="learn-card">
        <div style="font-size:12px;font-weight:800;color:#FF4F17;letter-spacing:0.06em;">
          先来认识这个新朋友
        </div>

        <div id="learn-logo-stage" class="logo-stage">
          <div class="logo-stage-pad">
            ${renderLogoSVG(brand.id, { variantId: activeVariantId })}
          </div>
        </div>

        <button id="learn-speak-btn" class="speak-big-btn">
          ${ICONS.speaker(19)}
          <span>${brand.name}</span>
        </button>

        ${chips.length > 1 ? `
          <div class="variant-chips">
            ${chips.map((v) => `
              <button class="variant-chip ${v.id === activeVariantId ? 'active' : ''}" data-vid="${v.id}">
                ${v.label}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${showHoodTip ? `
          <div class="hood-tip-box">
            <strong>车头认标提示：</strong>平时在真车车头上一般只看<strong>图形图标</strong>，没有旁边的英文字母哦！
          </div>
        ` : ''}

        ${renderCarShowcaseHTML(brand, { showBadge: false, showCaption: true })}

        <p style="margin:0;font-size:14px;font-weight:700;color:#525B6B;line-height:1.55;">
          ${brand.fact}
        </p>

        <div style="display:flex;gap:10px;width:100%;margin-top:4px;">
          ${index > 0 ? `<button id="learn-prev" class="btn btn-soft" style="flex:1">上一个</button>` : ''}
          <button id="learn-next" class="btn btn-primary" style="flex:2">
            ${index === brandIds.length - 1 ? '认识啦，发车挑战' : '认识啦，下一个'}
          </button>
        </div>
      </div>
    `;

    const voiceHint = showHoodTip
      ? `这是${brand.name}！${brand.fact}记住哦，平时在车头上一般只有图形，没有英文字母！`
      : `这是${brand.name}！${brand.fact}`;
    audio.speak(voiceHint);

    root.querySelector('#learn-exit').onclick = () => {
      audio.stopSpeak();
      audio.click();
      onExit();
    };
    root.querySelector('#learn-speak-btn').onclick = () => {
      audio.honk();
      audio.speak(voiceHint);
    };
    root.querySelector('#learn-logo-stage').onclick = () => {
      audio.click();
      audio.speak(brand.name);
    };
    root.querySelectorAll('.variant-chip').forEach((btn) => {
      btn.onclick = () => {
        audio.click();
        activeVariantId = btn.dataset.vid;
        const cObj = chips.find((v) => v.id === activeVariantId);
        render();
        if (cObj) {
          audio.speak(`${brand.name}的${cObj.label}`);
        }
      };
    });
    const prevBtn = root.querySelector('#learn-prev');
    if (prevBtn) {
      prevBtn.onclick = () => {
        audio.click();
        index -= 1;
        activeVariantId = 'default';
        render();
      };
    }
    root.querySelector('#learn-next').onclick = () => {
      audio.click();
      if (index < brandIds.length - 1) {
        index += 1;
        activeVariantId = 'default';
        render();
      } else {
        onComplete();
      }
    };
  }

  render();
}
