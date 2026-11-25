// 应用主控制器：点开即玩的“学新标 + 混玩已学车标”循环 + 自由小游戏 + 吃饭模式与护眼计时

import { BRANDS, BRAND_MAP } from './data/brands.js';
import { MIXED_LEARNING_ORDER } from './data/levels.js';
import { store } from './engine/storage.js';
import { audio } from './engine/audio.js';
import { createOverlayManager } from './ui/overlays.js';
import { renderMapScreen, getNextBatchToLearn } from './ui/map.js';
import { renderGarageScreen } from './ui/garage.js';
import { renderEncyclopediaScreen } from './ui/encyclopedia.js';
import { openParentGate } from './ui/parent.js';
import { runLearnPhase } from './modes/learn.js';
import { runQuizMode } from './modes/quiz.js';
import { runMemoryMode } from './modes/memory.js';
import { runPuzzleMode } from './modes/puzzle.js';

const screenRoot = document.getElementById('screen-root');
const bottomNav = document.getElementById('bottom-nav');
const overlayRoot = document.getElementById('overlay-root');
const fxLayer = document.getElementById('fx-layer');
const noticeBanner = document.getElementById('notice-banner');

const overlays = createOverlayManager(overlayRoot, fxLayer);

let currentTab = 'map';
let inGameplay = false;
let mealAnswerCounter = 0;
let sessionSeconds = 0;

window.addEventListener('pointerdown', () => audio.unlock(), { once: true });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

function syncHUD() {
  const p = store.getActiveProfile();
  audio.configure(store.state.settings);
  document.getElementById('profile-avatar').textContent = p.avatar;
  document.getElementById('profile-name').textContent = p.name;
  document.getElementById('hud-stars').textContent = p.stars;
  document.getElementById('hud-coins').textContent = p.coins;

  bottomNav.classList.toggle('hidden', inGameplay);
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === currentTab);
  });

  if (!inGameplay && store.needsBackupReminder()) {
    noticeBanner.classList.remove('hidden');
    noticeBanner.innerHTML = `
      <span>💾 好久没备份啦，建议去家长模式导出存档防丢失</span>
      <button id="banner-backup-btn">去备份</button>
    `;
    noticeBanner.querySelector('#banner-backup-btn').onclick = () => {
      openParentGate({ overlays, onStateChanged: renderCurrentTab, onTestMealMode: triggerTestMeal });
    };
  } else {
    noticeBanner.classList.add('hidden');
  }
}

store.subscribe(syncHUD);

function triggerTestMeal() {
  overlays.showMealBreak(store.state.settings.mealDurationSec || 60, () => {});
}

function handleAnswerTracked(_isCorrect, resumeCallback) {
  const s = store.state.settings;
  if (!s.mealModeEnabled) return false;
  mealAnswerCounter += 1;
  if (mealAnswerCounter >= (s.mealTriggerCount || 3)) {
    mealAnswerCounter = 0;
    overlays.showMealBreak(s.mealDurationSec || 60, resumeCallback);
    return true;
  }
  return false;
}

function getPlayablePool() {
  const scope = store.state.settings.scope;
  const learned = store.getLearnedBrandIds().filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  // 如果还没学够 6 个，自动补入前几个热门国产+国际明星品牌，确保点开就能玩
  const fallback = MIXED_LEARNING_ORDER.filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  const merged = [...new Set([...learned, ...fallback.slice(0, 8)])];
  return merged;
}

// 核心循环：先学 3 个新标（国产+国际混合）-> 自动把以前学过的全混在一起识别玩！
function startLearnAndPlay(newBatchIds) {
  inGameplay = true;
  syncHUD();

  const exitToHome = () => {
    inGameplay = false;
    currentTab = 'map';
    renderCurrentTab();
  };

  runLearnPhase(screenRoot, {
    brandIds: newBatchIds,
    onComplete: () => {
      store.markLearned(newBatchIds);
      const learnedPool = getPlayablePool();
      // 混合：本次新学的 3 个 + 从以前学过的随机抽 3 个 = 6 题趣味混合大挑战
      const oldOnes = learnedPool.filter((id) => !newBatchIds.includes(id)).sort(() => Math.random() - 0.5).slice(0, 3);
      const roundIds = [...newBatchIds, ...oldOnes];
      const rewardCoins = 20;

      runQuizMode(screenRoot, {
        level: { title: '混合认车标挑战', mode: 'mixed', rewardCoins },
        brandIds: roundIds,
        isPaused: () => !overlayRoot.classList.contains('hidden'),
        onAnswerTracked: handleAnswerTracked,
        onBurstFX: overlays.burstFX,
        onComplete: ({ stars }) => {
          store.completeRound(stars, rewardCoins);
          const nextBatch = getNextBatchToLearn(store.state.settings.scope, 3);
          overlays.showVictory({
            title: '本轮车标挑战',
            stars,
            rewardCoins,
            onNext: () => startLearnAndPlay(nextBatch),
            onMap: exitToHome
          });
        },
        onExit: exitToHome
      });
    },
    onExit: exitToHome
  });
}

// 自由模式：真车放大猜 / 听音混搭 / 翻牌 / 拼图 / 极速快答
function startFreeMode(mode) {
  const pool = getPlayablePool().sort(() => Math.random() - 0.5);
  inGameplay = true;
  syncHUD();

  const exitToHome = () => {
    inGameplay = false;
    currentTab = 'map';
    renderCurrentTab();
  };

  const modeConfig = {
    car2logo: { title: '真车放大猜', count: 6, rewardCoins: 20 },
    listen: { title: '听音混搭猜', count: 6, rewardCoins: 18 },
    memory: { title: '翻牌记忆乐', count: 4, rewardCoins: 20 },
    puzzle: { title: '车标小拼图', count: 3, rewardCoins: 22 },
    boss: { title: '极速快答挑战', count: 8, rewardCoins: 35, timeLimit: 45 }
  };
  const cfg = modeConfig[mode] || modeConfig.listen;
  const chosen = pool.slice(0, cfg.count);

  const common = {
    level: { title: cfg.title, mode, timeLimit: cfg.timeLimit || 0, rewardCoins: cfg.rewardCoins },
    brandIds: chosen,
    isPaused: () => !overlayRoot.classList.contains('hidden'),
    onAnswerTracked: handleAnswerTracked,
    onBurstFX: overlays.burstFX,
    onComplete: ({ stars }) => {
      store.completeRound(stars, cfg.rewardCoins);
      overlays.showVictory({
        title: cfg.title,
        stars,
        rewardCoins: cfg.rewardCoins,
        onNext: () => startFreeMode(mode),
        onMap: exitToHome
      });
    },
    onExit: exitToHome
  };

  if (mode === 'memory') runMemoryMode(screenRoot, common);
  else if (mode === 'puzzle') runPuzzleMode(screenRoot, common);
  else runQuizMode(screenRoot, common);
}

function startMistakeReview(ids) {
  inGameplay = true;
  syncHUD();
  const exitToHome = () => {
    inGameplay = false;
    currentTab = 'map';
    renderCurrentTab();
  };
  runQuizMode(screenRoot, {
    level: { title: '错题小复习', mode: 'mixed', rewardCoins: 18 },
    brandIds: ids,
    isPaused: () => !overlayRoot.classList.contains('hidden'),
    onAnswerTracked: handleAnswerTracked,
    onBurstFX: overlays.burstFX,
    onComplete: ({ stars }) => {
      store.completeRound(stars, 18);
      overlays.showVictory({
        title: '错题小复习',
        stars,
        rewardCoins: 18,
        onNext: null,
        onMap: exitToHome
      });
    },
    onExit: exitToHome
  });
}

function renderCurrentTab() {
  syncHUD();
  screenRoot.scrollTop = 0;

  if (currentTab === 'map') {
    renderMapScreen(screenRoot, {
      onStartLearnAndPlay: startLearnAndPlay,
      onStartMode: startFreeMode,
      onStartMistakeReview: startMistakeReview
    });
  } else if (currentTab === 'garage') {
    renderGarageScreen(screenRoot, { onBurstFX: overlays.burstFX });
  } else if (currentTab === 'encyclopedia') {
    renderEncyclopediaScreen(screenRoot, {
      showModal: overlays.showModal,
      closeModal: overlays.closeModal
    });
  }
}

document.querySelectorAll('.nav-tab').forEach((btn) => {
  btn.onclick = () => {
    audio.click();
    currentTab = btn.dataset.tab;
    inGameplay = false;
    renderCurrentTab();
  };
});

document.getElementById('btn-parent').onclick = () => {
  audio.click();
  openParentGate({
    overlays,
    onStateChanged: renderCurrentTab,
    onTestMealMode: triggerTestMeal
  });
};

document.getElementById('profile-pill').onclick = () => {
  audio.click();
  overlays.showProfileSwitcher(() => {
    inGameplay = false;
    renderCurrentTab();
  });
};

setInterval(() => {
  if (document.hidden) return;
  sessionSeconds += 10;
  store.addPlaySeconds(10);

  const s = store.state.settings;
  if (s.dailyLimitMinutes > 0 && store.getTodayMinutes() >= s.dailyLimitMinutes) {
    if (overlayRoot.classList.contains('hidden')) {
      overlays.showEyeRest({ isDailyLimit: true });
    }
    return;
  }
  if (s.eyeRestMinutes > 0 && sessionSeconds >= s.eyeRestMinutes * 60) {
    sessionSeconds = 0;
    if (overlayRoot.classList.contains('hidden')) {
      overlays.showEyeRest({ isDailyLimit: false });
    }
  }
}, 10000);

renderCurrentTab();
