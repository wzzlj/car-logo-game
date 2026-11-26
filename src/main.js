// 应用主控制器：Direction A 迷你驾驶舱 + 88车标先学再混玩循环 + 金钥匙能量奖励 + 吃饭/护眼计时

import { BRAND_MAP } from './data/brands.js';
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
  document.getElementById('profile-name').textContent = p.name;
  document.getElementById('hud-stars').textContent = p.stars;
  document.getElementById('hud-keys').textContent = p.keys || 0;

  bottomNav.classList.toggle('hidden', inGameplay);
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === currentTab);
  });

  if (!inGameplay && store.needsBackupReminder()) {
    noticeBanner.classList.remove('hidden');
    noticeBanner.innerHTML = `
      <span>好久没备份啦，建议去家长模式导出存档防丢失</span>
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
  const fallback = MIXED_LEARNING_ORDER.filter((id) => {
    const b = BRAND_MAP[id];
    return b && (scope === 'cn' ? b.origin === 'cn' : true);
  });
  return [...new Set([...learned, ...fallback.slice(0, 8)])];
}

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
      const oldOnes = learnedPool.filter((id) => !newBatchIds.includes(id)).sort(() => Math.random() - 0.5).slice(0, 3);
      const roundIds = [...newBatchIds, ...oldOnes];
      const bonusEnergy = 4;

      runQuizMode(screenRoot, {
        level: { title: '混合认车标挑战', mode: 'mixed' },
        brandIds: roundIds,
        isPaused: () => !overlayRoot.classList.contains('hidden'),
        onAnswerTracked: handleAnswerTracked,
        onBurstFX: overlays.burstFX,
        onComplete: ({ stars }) => {
          const { keysGained } = store.completeRound(stars, bonusEnergy);
          const nextBatch = getNextBatchToLearn(store.state.settings.scope, 3);
          overlays.showVictory({
            title: '本轮车标挑战',
            stars,
            bonusEnergy,
            keysGained,
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
    car2logo: { title: '真车放大猜', count: 6, bonusEnergy: 4 },
    listen: { title: '听音混搭猜', count: 6, bonusEnergy: 3 },
    memory: { title: '翻牌记忆乐', count: 4, bonusEnergy: 4 },
    puzzle: { title: '车标小拼图', count: 3, bonusEnergy: 5 },
    boss: { title: '极速快答挑战', count: 8, bonusEnergy: 7, timeLimit: 45 }
  };
  const cfg = modeConfig[mode] || modeConfig.listen;
  const chosen = pool.slice(0, cfg.count);

  const common = {
    level: { title: cfg.title, mode, timeLimit: cfg.timeLimit || 0 },
    brandIds: chosen,
    isPaused: () => !overlayRoot.classList.contains('hidden'),
    onAnswerTracked: handleAnswerTracked,
    onBurstFX: overlays.burstFX,
    onComplete: ({ stars }) => {
      const { keysGained } = store.completeRound(stars, cfg.bonusEnergy);
      overlays.showVictory({
        title: cfg.title,
        stars,
        bonusEnergy: cfg.bonusEnergy,
        keysGained,
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
  const bonusEnergy = 4;
  runQuizMode(screenRoot, {
    level: { title: '错题小复习', mode: 'mixed' },
    brandIds: ids,
    isPaused: () => !overlayRoot.classList.contains('hidden'),
    onAnswerTracked: handleAnswerTracked,
    onBurstFX: overlays.burstFX,
    onComplete: ({ stars }) => {
      const { keysGained } = store.completeRound(stars, bonusEnergy);
      overlays.showVictory({
        title: '错题小复习',
        stars,
        bonusEnergy,
        keysGained,
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
