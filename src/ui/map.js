// Direction A (Mini Cockpit) 驾驶舱首页：里程刻度进度 + 10格能量灯换金钥匙 + 深炭展台3标预览 + 实体 ENGINE START 启动键

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { MIXED_LEARNING_ORDER } from '../data/levels.js';
import { renderLogoSVG } from '../data/logos.js';
import { store, ENERGY_PER_KEY } from '../engine/storage.js';
import { audio } from '../engine/audio.js';
import { ICONS } from './icons.js';

export function getNextBatchToLearn(scope = 'all', count = 3) {
  const learnedSet = new Set(store.getLearnedBrandIds());
  const ordered = MIXED_LEARNING_ORDER.filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const unlearned = ordered.filter((id) => !learnedSet.has(id));
  if (unlearned.length >= count) return unlearned.slice(0, count);

  const profile = store.getActiveProfile();
  const byWeakness = [...ordered].sort((a, b) => {
    const sa = profile.brandStats[a] || { r: 0, w: 0 };
    const sb = profile.brandStats[b] || { r: 0, w: 0 };
    return (sa.r - sa.w) - (sb.r - sb.w);
  });
  return [...unlearned, ...byWeakness.filter((id) => !unlearned.includes(id))].slice(0, count);
}

export function renderMapScreen(root, {
  onStartLearnAndPlay,
  onStartMode,
  onStartMistakeReview
}) {
  const profile = store.getActiveProfile();
  const scope = store.state.settings.scope;
  const scopedBrands = BRANDS.filter((b) => (scope === 'cn' ? b.origin === 'cn' : true));
  const totalCount = scopedBrands.length;
  const learnedIds = store.getLearnedBrandIds().filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const nextBatch = getNextBatchToLearn(scope, 3);
  const mistakeIds = store.getMistakeBrandIds(6).filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });

  const litTicks = Math.round((learnedIds.length / Math.max(1, totalCount)) * 22);
  const energy = profile.energy || 0;
  const remainEnergy = ENERGY_PER_KEY - energy;

  root.innerHTML = `
    <section class="instrument-deck">
      <div class="deck-head">
        <span class="deck-kicker">车标里程表 · ${scope === 'cn' ? '中国国产精选' : '国产+国际混搭'}</span>
        <div class="odometer">${learnedIds.length} <span>/ ${totalCount}</span></div>
      </div>

      <div class="gauge-ticks" aria-hidden="true">
        ${Array.from({ length: 22 }, (_, i) => `<div class="gauge-tick ${i < litTicks ? 'on' : ''}"></div>`).join('')}
      </div>

      <!-- 幼儿园直观奖励条：10格能量灯 -> 1把金钥匙 -->
      <div class="energy-strip">
        <div class="energy-top">
          <span>能量满格合成 1 把金钥匙</span>
          <strong>还差 ${remainEnergy} 格</strong>
        </div>
        <div class="energy-leds" aria-label="能量进度 ${energy} / ${ENERGY_PER_KEY}">
          ${Array.from({ length: ENERGY_PER_KEY }, (_, i) => `<div class="energy-led ${i < energy ? 'lit' : ''}"></div>`).join('')}
        </div>
      </div>

      <div class="tray-head">
        <span>${learnedIds.length < totalCount ? '本轮发车 · 认识 3 个新朋友' : '全图鉴混搭复习时间'}</span>
        <span style="color:#FF8C66;">点徽标听名字</span>
      </div>

      <div class="preview-logo-row">
        ${nextBatch.map((id) => `
          <button class="preview-logo-chip" data-preview-id="${id}">
            <div class="preview-logo-box">${renderLogoSVG(id)}</div>
            <span>${BRAND_MAP[id].name}</span>
          </button>
        `).join('')}
      </div>

      <button id="btn-instant-play" class="engine-start-btn">
        <span>启动出发 · 先学再混玩</span>
        <span class="start-ring">${ICONS.power(17)}</span>
      </button>
    </section>

    <div class="section-label">
      <span>自由挑战控制台</span>
      <span>6 种模式</span>
    </div>

    <div class="quick-actions">
      <button id="mode-car" class="quick-card accent">
        <span class="q-icon">${ICONS.search(19)}</span>
        <div>
          <div class="q-title">真车放大猜</div>
          <div class="q-sub">瞄准车头找车标</div>
        </div>
      </button>

      <button id="mode-mixed" class="quick-card">
        <span class="q-icon">${ICONS.speaker(19)}</span>
        <div>
          <div class="q-title">听音混搭猜</div>
          <div class="q-sub">学过的全混一起</div>
        </div>
      </button>

      <button id="mode-memory" class="quick-card">
        <span class="q-icon">${ICONS.cards(19)}</span>
        <div>
          <div class="q-title">翻牌记忆乐</div>
          <div class="q-sub">配对相同车标</div>
        </div>
      </button>

      <button id="mode-puzzle" class="quick-card">
        <span class="q-icon">${ICONS.puzzle(19)}</span>
        <div>
          <div class="q-title">车标小拼图</div>
          <div class="q-sub">四块拼出完整标</div>
        </div>
      </button>

      <button id="mode-boss" class="quick-card accent">
        <span class="q-icon">${ICONS.bolt(19)}</span>
        <div>
          <div class="q-title">极速快答</div>
          <div class="q-sub">快速攒金钥匙</div>
        </div>
      </button>

      <button id="mode-review" class="quick-card gold">
        <span class="q-icon">${ICONS.repeat(19)}</span>
        <div>
          <div class="q-title">错题小复习</div>
          <div class="q-sub">${mistakeIds.length > 0 ? `${mistakeIds.length} 个待巩固` : '目前全都会'}</div>
        </div>
      </button>
    </div>
  `;

  root.querySelectorAll('[data-preview-id]').forEach((btn) => {
    btn.onclick = () => {
      const b = BRAND_MAP[btn.dataset.previewId];
      if (!b) return;
      audio.click();
      audio.speak(b.name);
    };
  });

  root.querySelector('#btn-instant-play').onclick = () => {
    audio.honk();
    onStartLearnAndPlay(nextBatch);
  };
  root.querySelector('#mode-car').onclick = () => { audio.click(); onStartMode('car2logo'); };
  root.querySelector('#mode-mixed').onclick = () => { audio.click(); onStartMode('listen'); };
  root.querySelector('#mode-memory').onclick = () => { audio.click(); onStartMode('memory'); };
  root.querySelector('#mode-puzzle').onclick = () => { audio.click(); onStartMode('puzzle'); };
  root.querySelector('#mode-boss').onclick = () => { audio.click(); onStartMode('boss'); };
  root.querySelector('#mode-review').onclick = () => {
    audio.click();
    if (mistakeIds.length === 0) {
      audio.speak('太棒啦，现在没有错题哦，去玩新挑战吧！');
      return;
    }
    onStartMistakeReview(mistakeIds);
  };
}
