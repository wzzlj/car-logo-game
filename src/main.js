// 应用主控制器：统一调度导航、游戏模式、吃饭模式计数、护眼计时与 PWA 注册

import { BRANDS } from './data/brands.js';
import { LEVELS } from './data/levels.js';
import { store } from './engine/storage.js';
import { audio } from './engine/audio.js';
import { createOverlayManager } from './ui/overlays.js';
import { renderMapScreen } from './ui/map.js';
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

// 首次触碰解锁 iOS AudioContext
window.addEventListener('pointerdown', () => audio.unlock(), { once: true });

// 注册 PWA Service Worker
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

  // 定期提醒家长备份（预防 iPhone Safari 7天自动清理缓存）
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

// 吃饭模式钩子：无论答对或答错都计数，达到阈值立即弹出吃饭倒计时
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

function startLevel(level) {
  const scope = store.state.settings.scope;
  let brandIds = [...level.brandIds];
  if (scope === 'cn') {
    brandIds = brandIds.filter((id) => BRANDS.find((b) => b.id === id && b.origin === 'cn'));
    if (brandIds.length === 0) brandIds = ['byd', 'wuling', 'xiaomi', 'hongqi'];
  }

  inGameplay = true;
  syncHUD();

  const exitToMap = () => {
    inGameplay = false;
    currentTab = 'map';
    renderCurrentTab();
  };

  const launchPlayMode = () => {
    const onComplete = ({ stars }) => {
      store.completeLevel(level.id, stars, level.rewardCoins);
      const nextLv = LEVELS.find((l) => l.id === level.id + 1);
      overlays.showVictory({
        title: level.title,
        stars,
        rewardCoins: level.rewardCoins,
        onNext: nextLv ? () => startLevel(nextLv) : null,
        onMap: exitToMap
      });
    };

    const common = {
      level,
      brandIds,
      isPaused: () => !overlayRoot.classList.contains('hidden'),
      onAnswerTracked: handleAnswerTracked,
      onBurstFX: overlays.burstFX,
      onComplete,
      onExit: exitToMap
    };

    if (level.mode === 'memory') {
      runMemoryMode(screenRoot, common);
    } else if (level.mode === 'puzzle') {
      runPuzzleMode(screenRoot, common);
    } else {
      runQuizMode(screenRoot, common);
    }
  };

  if (level.learnFirst) {
    // 修复 #4：学习本关全部品牌，不再截断前4个
    runLearnPhase(screenRoot, {
      brandIds,
      onComplete: launchPlayMode,
      onExit: exitToMap
    });
  } else {
    launchPlayMode();
  }
}

function startCustomQuiz(title, brandIds, mode = 'listen') {
  const virtualLevel = {
    id: 0,
    title,
    mode,
    brandIds,
    learnFirst: false,
    rewardCoins: 25
  };
  inGameplay = true;
  syncHUD();
  const exitToMap = () => {
    inGameplay = false;
    currentTab = 'map';
    renderCurrentTab();
  };
  runQuizMode(screenRoot, {
    level: virtualLevel,
    brandIds,
    onAnswerTracked: handleAnswerTracked,
    onBurstFX: overlays.burstFX,
    onComplete: ({ stars }) => {
      const p = store.getActiveProfile();
      p.coins += 25;
      store.save();
      overlays.showVictory({ title, stars, rewardCoins: 25, onNext: null, onMap: exitToMap });
    },
    onExit: exitToMap
  });
}

function renderCurrentTab() {
  syncHUD();
  screenRoot.scrollTop = 0;

  if (currentTab === 'map') {
    renderMapScreen(screenRoot, {
      onStartLevel: startLevel,
      onStartMistakeReview: (ids) => startCustomQuiz('错题小复习', ids, 'listen'),
      onStartFreeQuiz: () => {
        const pool = store.state.settings.scope === 'cn'
          ? BRANDS.filter((b) => b.origin === 'cn')
          : BRANDS;
        const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 6).map((b) => b.id);
        startCustomQuiz('随机趣味挑战', picked, 'listen');
      }
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

// 绑定底部导航与顶部按钮
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

// 每 10 秒统计游玩时长，触发护眼提醒或每日时长上限
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

// 启动渲染
renderCurrentTab();
