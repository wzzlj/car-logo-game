// 通用弹窗与特效模块：通关庆祝、吃饭模式倒计时、护眼休息、多孩切换、星星烟花特效

import { audio } from '../engine/audio.js';
import { store, AVATARS } from '../engine/storage.js';

export function createOverlayManager(overlayRoot, fxLayer) {
  let activeTimer = null;

  function clearTimer() {
    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }
  }

  function showModal(innerHTML, { dismissible = true } = {}) {
    clearTimer();
    overlayRoot.innerHTML = `<div class="modal-card">${innerHTML}</div>`;
    overlayRoot.classList.remove('hidden');
    overlayRoot.onclick = (e) => {
      if (dismissible && e.target === overlayRoot) closeModal();
    };
    return overlayRoot.querySelector('.modal-card');
  }

  function closeModal() {
    clearTimer();
    overlayRoot.classList.add('hidden');
    overlayRoot.innerHTML = '';
  }

  function burstFX(x, y) {
    const emojis = ['⭐', '🌟', '✨', '🚗', '🎉', '💫'];
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.className = 'fx-particle';
      el.textContent = emojis[i % emojis.length];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.4;
      const dist = 65 + Math.random() * 85;
      el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 360}deg`);
      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 950);
    }
  }

  // 通关庆祝弹窗
  function showVictory({ title, stars, rewardCoins, onNext, onMap }) {
    audio.win();
    audio.speak(`太棒啦！恭喜通关${title}！获得${stars}颗大星星和${rewardCoins}枚车币！`);
    burstFX(window.innerWidth / 2, window.innerHeight / 3);

    const starStr = [1, 2, 3].map((n) => (n <= stars ? '⭐' : '☆')).join(' ');
    const el = showModal(`
      <div style="text-align:center;">
        <div style="font-size:64px;margin-bottom:4px;">🏆</div>
        <h2 style="margin:0 0 8px;font-size:24px;font-weight:900;">闯关成功！</h2>
        <div style="font-size:36px;margin-bottom:10px;">${starStr}</div>
        <div style="display:inline-flex;align-items:center;gap:6px;background:#FFF3D6;border:2px solid #FFD166;padding:8px 18px;border-radius:999px;font-size:18px;font-weight:900;color:#B45309;margin-bottom:18px;">
          🪙 +${rewardCoins} 车币
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${onNext ? `<button id="vic-next" class="btn btn-primary btn-block">🚀 再来一局！</button>` : ''}
          <button id="vic-map" class="btn btn-soft btn-block">🏠 返回首页</button>
        </div>
      </div>
    `, { dismissible: false });

    if (onNext) {
      el.querySelector('#vic-next').onclick = () => {
        audio.click();
        closeModal();
        onNext();
      };
    }
    el.querySelector('#vic-map').onclick = () => {
      audio.click();
      closeModal();
      onMap();
    };
  }

  // 吃饭模式：休息倒计时（默认1分钟）
  function showMealBreak(seconds, onResume) {
    let left = seconds;
    audio.mealBell();
    audio.speak('吃饭时间到啦！先乖乖吃几口饭，倒计时结束我们继续玩小汽车！');

    const el = showModal(`
      <div class="break-card">
        <div class="break-emoji">🍚</div>
        <h2 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#FF6B35;">干饭小休息！</h2>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#475569;">
          宝贝大口吃饭饭，吃完小汽车马上回来陪你玩～
        </p>
        <div id="meal-count" class="countdown-big">${left}s</div>
        <button id="meal-resume" class="btn btn-success btn-block hidden">😋 吃完啦，继续玩！</button>
        <button id="meal-parent-skip" class="btn btn-soft btn-sm" style="margin-top:12px;">🔒 家长提前结束</button>
      </div>
    `, { dismissible: false });

    const countEl = el.querySelector('#meal-count');
    const resumeBtn = el.querySelector('#meal-resume');
    const skipBtn = el.querySelector('#meal-parent-skip');

    activeTimer = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearTimer();
        countEl.textContent = '0s';
        resumeBtn.classList.remove('hidden');
        skipBtn.classList.add('hidden');
        audio.correct();
        audio.speak('休息结束啦！点绿色按钮继续玩吧！');
      } else {
        countEl.textContent = `${left}s`;
      }
    }, 1000);

    resumeBtn.onclick = () => {
      audio.click();
      closeModal();
      if (onResume) onResume();
    };

    skipBtn.onclick = () => {
      showMathVerify('🔒 家长提前结束吃饭休息', () => {
        closeModal();
        if (onResume) onResume();
      }, () => showMealBreak(left, onResume));
    };
  }

  // 自定义应用内家长算术验证弹窗（替代原生 window.prompt，完美兼容 iPhone PWA 全屏模式）
  function showMathVerify(title, onPass, onCancel) {
    const a = 3 + Math.floor(Math.random() * 6);
    const b = 3 + Math.floor(Math.random() * 6);
    const expected = a * b;
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button id="mv-close" class="icon-btn">✖️</button>
      </div>
      <div style="text-align:center;font-size:30px;font-weight:900;color:#FF6B35;margin:8px 0 12px;">
        ${a} × ${b} = ?
      </div>
      <input id="mv-input" type="number" inputmode="numeric" placeholder="输入答案" style="width:100%;padding:12px;font-size:20px;font-weight:900;text-align:center;border-radius:16px;border:2px solid #CBD5E1;margin-bottom:10px;" />
      <div id="mv-err" style="color:#EF476F;font-size:13px;font-weight:800;text-align:center;margin-bottom:8px;"></div>
      <button id="mv-ok" class="btn btn-primary btn-block">确认解锁</button>
    `, { dismissible: false });
    const inp = el.querySelector('#mv-input');
    setTimeout(() => inp.focus(), 60);
    el.querySelector('#mv-close').onclick = () => {
      if (onCancel) onCancel(); else closeModal();
    };
    const check = () => {
      if (Number(inp.value) === expected) {
        audio.click();
        onPass();
      } else {
        el.querySelector('#mv-err').textContent = '答案不对哦，再算一次～';
        audio.wrong();
      }
    };
    el.querySelector('#mv-ok').onclick = check;
    inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
  }

  // 自定义应用内确认弹窗（替代 window.confirm / alert）
  function showConfirm(title, message, onConfirm, onCancel) {
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button id="cf-close" class="icon-btn">✖️</button>
      </div>
      <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#475569;line-height:1.5;">${message}</p>
      <div style="display:flex;gap:10px;">
        <button id="cf-no" class="btn btn-soft" style="flex:1;">取消</button>
        <button id="cf-yes" class="btn btn-danger" style="flex:1;">确定</button>
      </div>
    `, { dismissible: false });
    const cancel = () => { if (onCancel) onCancel(); else closeModal(); };
    el.querySelector('#cf-close').onclick = cancel;
    el.querySelector('#cf-no').onclick = cancel;
    el.querySelector('#cf-yes').onclick = () => { audio.click(); onConfirm(); };
  }

  // 护眼提醒 / 今日时长上限
  function showEyeRest({ isDailyLimit = false } = {}) {
    audio.mealBell();
    audio.speak(
      isDailyLimit
        ? '今天玩游戏的时间到啦，让小眼睛好好休息一下，明天再来哦！'
        : '已经玩了一会儿啦，看看远处的大树和蓝天，让小眼睛休息一下吧！'
    );

    const el = showModal(`
      <div class="break-card">
        <div class="break-emoji">${isDailyLimit ? '🌙' : '👀'}</div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:900;">
          ${isDailyLimit ? '今日游戏时间已到' : '小眼睛休息一下吧'}
        </h2>
        <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#475569;">
          ${isDailyLimit ? '保护视力，明天再来和汽车小伙伴玩！' : '向窗外远眺 20 秒，眨眨眼睛更明亮！'}
        </p>
        ${!isDailyLimit
          ? `<button id="eye-ok" class="btn btn-primary btn-block">👀 休息好啦，继续玩</button>`
          : `<button id="eye-unlock" class="btn btn-soft btn-block">🔒 家长解锁继续</button>`
        }
      </div>
    `, { dismissible: !isDailyLimit });

    const okBtn = el.querySelector('#eye-ok');
    if (okBtn) okBtn.onclick = () => { audio.click(); closeModal(); };
    const unlockBtn = el.querySelector('#eye-unlock');
    if (unlockBtn) {
      unlockBtn.onclick = () => {
        showMathVerify('🔒 家长解锁延长15分钟', () => {
          store.updateSettings({ dailyLimitMinutes: store.state.settings.dailyLimitMinutes + 15 });
          closeModal();
        }, () => showEyeRest({ isDailyLimit: true }));
      };
    }
  }

  // 多孩档案快速切换
  function showProfileSwitcher(onChanged) {
    const active = store.getActiveProfile();
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">👶 选择小朋友档案</h2>
        <button id="prof-close" class="icon-btn">✖️</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">
        ${store.state.profiles.map((p) => `
          <button class="btn ${p.id === active.id ? 'btn-primary' : 'btn-soft'} btn-block" data-pid="${p.id}" style="justify-content:space-between;">
            <span>${p.avatar} ${p.name}</span>
            <span style="font-size:14px;">⭐ ${p.stars} · 🪙 ${p.coins}</span>
          </button>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;">
        <input id="new-kid-name" type="text" placeholder="添加新小朋友名字..." style="flex:1;padding:10px 12px;border-radius:14px;border:2px solid #CBD5E1;font-size:15px;" />
        <button id="add-kid-btn" class="btn btn-success btn-sm">➕ 添加</button>
      </div>
    `);

    el.querySelector('#prof-close').onclick = () => closeModal();
    el.querySelectorAll('[data-pid]').forEach((btn) => {
      btn.onclick = () => {
        audio.click();
        store.setActiveProfile(btn.dataset.pid);
        closeModal();
        if (onChanged) onChanged();
      };
    });
    el.querySelector('#add-kid-btn').onclick = () => {
      const name = el.querySelector('#new-kid-name').value.trim();
      if (!name) return;
      const avatar = AVATARS[store.state.profiles.length % AVATARS.length];
      store.addProfile(name, avatar);
      audio.correct();
      closeModal();
      if (onChanged) onChanged();
    };
  }

  return {
    showModal,
    closeModal,
    burstFX,
    showVictory,
    showMealBreak,
    showEyeRest,
    showProfileSwitcher,
    showMathVerify,
    showConfirm
  };
}
