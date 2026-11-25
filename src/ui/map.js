// 点开即玩的首页主界面：去掉冗长关卡锁，主打“先学3个新标 + 混合以前学过的一起玩”核心循环 + 多种随时畅玩小游戏

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { MIXED_LEARNING_ORDER } from '../data/levels.js';
import { renderLogoSVG } from '../data/logos.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';

export function getNextBatchToLearn(scope = 'all', count = 3) {
  const learnedSet = new Set(store.getLearnedBrandIds());
  const ordered = MIXED_LEARNING_ORDER.filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const unlearned = ordered.filter((id) => !learnedSet.has(id));
  if (unlearned.length >= count) return unlearned.slice(0, count);
  // 全部都学过以后，优先挑选掌握度最低的 3 个复习
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
  const totalCount = scope === 'cn' ? 32 : 50;
  const learnedIds = store.getLearnedBrandIds().filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const nextBatch = getNextBatchToLearn(scope, 3);
  const mistakeIds = store.getMistakeBrandIds(6).filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const pct = Math.min(100, Math.round((learnedIds.length / totalCount) * 100));

  root.innerHTML = `
    <div class="hero-banner">
      <div style="flex:1;">
        <h1>小小车标大冒险</h1>
        <p>已认识 ${learnedIds.length} / ${totalCount} 个车标 · 边玩边攒车币买豪车！</p>
        <div class="progress-track" style="height:12px;margin-top:8px;background:rgba(255,255,255,0.35);border:none;">
          <div class="progress-fill" style="width:${pct}%;background:#FFFFFF;"></div>
        </div>
      </div>
      <div class="hero-mascot">🏎️</div>
    </div>

    <!-- 核心大按钮：点开就学 3 个新标（国产+国际混合）并混合之前学过的一起识别 -->
    <div class="play-hero-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span style="font-size:15px;font-weight:900;color:#FF6B35;">
          ✨ ${learnedIds.length < totalCount ? '接下来认识这 3 个新朋友：' : '全图鉴混搭复习时间：'}
        </span>
        <span style="font-size:12px;font-weight:800;color:#64748B;">国产+国际混合</span>
      </div>

      <div class="preview-logo-row">
        ${nextBatch.map((id) => `
          <div class="preview-logo-chip">
            <div class="preview-logo-box">${renderLogoSVG(id)}</div>
            <span>${BRAND_MAP[id].name}</span>
          </div>
        `).join('')}
      </div>

      <button id="btn-instant-play" class="btn btn-primary btn-block play-hero-btn">
        ▶️ 点开就玩！（先学再混玩）
      </button>
    </div>

    <div style="font-size:15px;font-weight:900;color:#232946;margin:16px 2px 10px;">
      🎮 趣味自由玩（用学过的车标随时挑战）
    </div>

    <div class="quick-actions" style="gap:12px;">
      <button id="mode-car" class="quick-card">
        <span class="q-emoji">🚘</span>
        <div>
          <div class="q-title">真车放大猜</div>
          <div class="q-sub">放大镜看真车标</div>
        </div>
      </button>

      <button id="mode-mixed" class="quick-card">
        <span class="q-emoji">🔊</span>
        <div>
          <div class="q-title">听音混搭猜</div>
          <div class="q-sub">学过的全混一起</div>
        </div>
      </button>

      <button id="mode-memory" class="quick-card">
        <span class="q-emoji">🃏</span>
        <div>
          <div class="q-title">翻牌记忆乐</div>
          <div class="q-sub">找一样的车标</div>
        </div>
      </button>

      <button id="mode-puzzle" class="quick-card">
        <span class="q-emoji">🧩</span>
        <div>
          <div class="q-title">车标小拼图</div>
          <div class="q-sub">四块拼出车标</div>
        </div>
      </button>

      <button id="mode-boss" class="quick-card" style="border-color:#FFB3C6;background:#FFF5F8;">
        <span class="q-emoji">⚡</span>
        <div>
          <div class="q-title">极速快答</div>
          <div class="q-sub">赢双倍车币！</div>
        </div>
      </button>

      <button id="mode-review" class="quick-card" style="border-color:#FFE08A;background:#FFFDF0;">
        <span class="q-emoji">🔁</span>
        <div>
          <div class="q-title">错题小复习</div>
          <div class="q-sub">${mistakeIds.length > 0 ? `${mistakeIds.length}个待巩固` : '目前全都会！'}</div>
        </div>
      </button>
    </div>
  `;

  root.querySelector('#btn-instant-play').onclick = () => {
    audio.click();
    onStartLearnAndPlay(nextBatch);
  };

  root.querySelector('#mode-car').onclick = () => {
    audio.click();
    onStartMode('car2logo');
  };
  root.querySelector('#mode-mixed').onclick = () => {
    audio.click();
    onStartMode('listen');
  };
  root.querySelector('#mode-memory').onclick = () => {
    audio.click();
    onStartMode('memory');
  };
  root.querySelector('#mode-puzzle').onclick = () => {
    audio.click();
    onStartMode('puzzle');
  };
  root.querySelector('#mode-boss').onclick = () => {
    audio.click();
    onStartMode('boss');
  };
  root.querySelector('#mode-review').onclick = () => {
    audio.click();
    if (mistakeIds.length === 0) {
      audio.speak('太棒啦，现在没有错题哦，去玩新挑战吧！');
      return;
    }
    onStartMistakeReview(mistakeIds);
  };
}
