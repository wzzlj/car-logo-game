// “先学后考”认识卡片环节：清晰讲明“车头纯图标”与“完整带字母标”的区别 + 真实汽车外观 + 中文语音讲解

import { BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG, hasFullWordmark, isIconOnlyOnHood } from '../data/logos.js';
import { renderCarShowcaseHTML } from '../data/cars.js';
import { audio } from '../engine/audio.js';

export function runLearnPhase(root, { brandIds, onComplete, onExit }) {
  let index = 0;
  let activeVariantId = 'default';

  function render() {
    const brand = BRAND_MAP[brandIds[index]];
    if (!brand) {
      onComplete();
      return;
    }

    // 组合本品牌真实存在的展示项（默认车头标 + 若有带字母完整标则加上对比按钮 + 真实颜色/旧标变体）
    const chips = brand.variants.map((v) => ({ id: v.id, label: v.label }));
    if (hasFullWordmark(brand.id)) {
      chips[0] = { id: 'default', label: '🚘 车头纯图标' };
      chips.splice(1, 0, { id: 'wordmark', label: '🔤 带字母完整标' });
    }
    if (!chips.some((c) => c.id === activeVariantId)) {
      activeVariantId = chips[0].id;
    }

    const showHoodTip = isIconOnlyOnHood(brand.id);
    const pct = Math.round(((index + 1) / brandIds.length) * 100);

    root.innerHTML = `
      <div class="play-header">
        <button id="learn-exit" class="icon-btn" aria-label="返回首页">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip" style="font-size:13px;padding:4px 10px;">📖 ${index + 1}/${brandIds.length}</span>
      </div>

      <div class="learn-card">
        <div style="font-size:13px;font-weight:800;color:#FF6B35;background:#FFF0E6;padding:4px 12px;border-radius:999px;">
          ✨ 先来认识一下它！
        </div>

        <div id="learn-logo-stage" class="logo-stage" style="background:#FFFFFF;">
          ${renderLogoSVG(brand.id, { variantId: activeVariantId })}
        </div>

        <button id="learn-speak-btn" class="speak-big-btn pulse-speak">
          <span>🔊</span>
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
            💡 小提示：平时在汽车车头上一般只看<strong>图形图标</strong>，没有旁边的英文字母哦！
          </div>
        ` : ''}

        ${renderCarShowcaseHTML(brand, { showBadge: false, showCaption: true })}

        <p style="margin:2px 0 6px;font-size:14px;font-weight:700;color:#5F6C7B;line-height:1.5;">
          ${brand.fact}
        </p>

        <div style="display:flex;gap:10px;width:100%;">
          ${index > 0 ? `<button id="learn-prev" class="btn btn-soft" style="flex:1">⬅️ 上一个</button>` : ''}
          <button id="learn-next" class="btn btn-success" style="flex:2">
            ${index === brandIds.length - 1 ? '🚀 认识啦，开始玩！' : '认识啦，下一个 ➡️'}
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
          const msg = activeVariantId === 'wordmark'
            ? `这是${brand.name}带英文字母的完整标志，车头上一般只放图形哦`
            : `${brand.name}的${cObj.label.replace(/^[^\u4e00-\u9fa5]+/, '')}`;
          audio.speak(msg);
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
