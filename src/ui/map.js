// 闯关地图主界面

import { LEVELS, MODE_META } from '../data/levels.js';
import { BRANDS } from '../data/brands.js';
import { store } from '../engine/storage.js';
import { audio } from '../engine/audio.js';

export function renderMapScreen(root, { onStartLevel, onStartMistakeReview, onStartFreeQuiz }) {
  const profile = store.getActiveProfile();
  const scope = store.state.settings.scope;
  const visibleLevels = scope === 'cn'
    ? LEVELS.filter((lv) => lv.brandIds.some((id) => BRANDS.find((b) => b.id === id && b.origin === 'cn')))
    : LEVELS;

  const masteredCount = Object.values(profile.brandStats).filter((s) => s.r >= 2 && s.r > s.w).length;
  const mistakeIds = store.getMistakeBrandIds(6);

  root.innerHTML = `
    <div class="hero-banner">
      <div>
        <h1>小小车标大冒险</h1>
        <p>已掌握 ${masteredCount} / ${scope === 'cn' ? 32 : 50} 个车标 · 收集车币装扮车库！</p>
      </div>
      <div class="hero-mascot">🚗</div>
    </div>

    <div class="quick-actions">
      <button id="qa-review" class="quick-card">
        <span class="q-emoji">🔁</span>
        <div>
          <div class="q-title">错题小复习</div>
          <div class="q-sub">${mistakeIds.length > 0 ? `${mistakeIds.length}个待巩固` : '目前全都会！'}</div>
        </div>
      </button>
      <button id="qa-random" class="quick-card">
        <span class="q-emoji">🎲</span>
        <div>
          <div class="q-title">随机来一局</div>
          <div class="q-sub">听音认车标</div>
        </div>
      </button>
    </div>

    <div class="level-road">
      ${visibleLevels.map((lv) => {
        const isUnlocked = lv.id <= profile.unlockedLevel;
        const stars = profile.levelStars[lv.id] || 0;
        const mode = MODE_META[lv.mode];
        const starStr = [1, 2, 3].map((n) => (n <= stars ? '⭐' : '☆')).join('');
        return `
          <div class="level-card ${isUnlocked ? 'unlocked' : 'locked'} ${lv.isBoss ? 'boss' : ''}" data-level-id="${lv.id}">
            <div class="level-badge" style="background:${lv.color}">
              <span>${isUnlocked ? lv.emoji : '🔒'}</span>
            </div>
            <div class="level-info">
              <div class="level-title-row">
                <span class="level-title">${lv.title}</span>
                <span class="mode-pill">${mode.emoji} ${mode.label}</span>
              </div>
              <div class="level-desc">${lv.desc}</div>
              <div class="level-stars">${isUnlocked ? starStr : '通关上一关解锁'}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  root.querySelector('#qa-review').onclick = () => {
    audio.click();
    if (mistakeIds.length === 0) {
      audio.speak('太棒啦，现在没有错题哦，去闯新关卡吧！');
      return;
    }
    onStartMistakeReview(mistakeIds);
  };

  root.querySelector('#qa-random').onclick = () => {
    audio.click();
    onStartFreeQuiz();
  };

  root.querySelectorAll('.level-card').forEach((card) => {
    card.onclick = () => {
      const id = Number(card.dataset.levelId);
      const lv = LEVELS.find((l) => l.id === id);
      if (!lv) return;
      if (id > profile.unlockedLevel) {
        audio.wrong();
        audio.speak('先通关前面的关卡，就能打开这一关啦！');
        return;
      }
      audio.click();
      onStartLevel(lv);
    };
  });
}
