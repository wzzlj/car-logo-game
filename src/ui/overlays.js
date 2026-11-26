// Direction A (Mini Cockpit) 弹窗与庆祝特效：直观 10格能量灯 + 金钥匙合成庆祝 + 吃饭/护眼/算术锁

import { audio } from '../engine/audio.js';
import { store, AVATARS, ENERGY_PER_KEY } from '../engine/storage.js';
import { ICONS } from './icons.js';

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
    const colors = ['#FF4F17', '#F59E0B', '#16A34A', '#38BDF8', '#FFFFFF'];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('span');
      el.className = 'fx-particle';
      el.style.background = colors[i % colors.length];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.3;
      const dist = 60 + Math.random() * 90;
      el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      el.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
      el.style.setProperty('--rot', `${(Math.random() - 0.5) * 360}deg`);
      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }

  // 通关庆祝弹窗（展示本次点亮的能量格与新合成的金钥匙）
  function showVictory({ title, stars, bonusEnergy, keysGained, onNext, onMap }) {
    const p = store.getActiveProfile();
    const energy = p.energy || 0;
    const keys = p.keys || 0;

    audio.win();
    const keySpeech = keysGained > 0
      ? `能量满格，恭喜获得${keysGained}把金钥匙！现在一共有${keys}把金钥匙啦！`
      : `能量又增加了${bonusEnergy}格，再加把劲就能合成新金钥匙啦！`;
    audio.speak(`太棒啦！完成${title}！获得${stars}颗星星！${keySpeech}`);
    burstFX(window.innerWidth / 2, window.innerHeight / 3);

    const starHtml = [1, 2, 3].map((n) => `
      <span style="color:${n <= stars ? '#F59E0B' : '#CBD5E1'};display:inline-flex;">${ICONS.star(34)}</span>
    `).join('');

    const el = showModal(`
      <div style="text-align:center;">
        <div class="break-badge" style="color:#FACC15;">${ICONS.trophy(32)}</div>
        <h2 style="margin:0 0 8px;font-size:22px;font-weight:900;">本轮挑战完成！</h2>
        <div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px;">${starHtml}</div>

        <div style="background:#1A1F29;color:#F4F6FA;border-radius:16px;padding:12px 14px;margin-bottom:16px;">
          ${keysGained > 0 ? `
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,79,23,0.2);color:#FF8C66;padding:6px 14px;border-radius:999px;font-size:15px;font-weight:900;margin-bottom:10px;">
              ${ICONS.keySolid(17)} 合成 +${keysGained} 把金钥匙！（共 ${keys} 把）
            </div>
          ` : `
            <div style="font-size:13px;font-weight:800;color:#FACC15;margin-bottom:8px;">
              能量灯 +${bonusEnergy} 格（还差 ${ENERGY_PER_KEY - energy} 格合成金钥匙）
            </div>
          `}
          <div class="energy-leds">
            ${Array.from({ length: ENERGY_PER_KEY }, (_, i) => `<div class="energy-led ${i < energy ? 'lit' : ''}"></div>`).join('')}
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          ${onNext ? `<button id="vic-next" class="btn btn-primary btn-block">再来一局</button>` : ''}
          <button id="vic-map" class="btn btn-soft btn-block">返回驾驶舱</button>
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

  function showMealBreak(seconds, onResume) {
    let left = seconds;
    audio.mealBell();
    audio.speak('吃饭时间到啦！先乖乖吃几口饭，倒计时结束我们继续玩小汽车！');

    const el = showModal(`
      <div class="break-card">
        <div class="break-badge">${ICONS.meal(32)}</div>
        <h2 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#FF4F17;">干饭小休息</h2>
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#525B6B;">
          宝贝大口吃饭饭，吃完小汽车马上回来陪你玩！
        </p>
        <div id="meal-count" class="countdown-big">${left}s</div>
        <button id="meal-resume" class="btn btn-success btn-block hidden">吃完啦，继续玩</button>
        <button id="meal-parent-skip" class="btn btn-soft btn-sm" style="margin-top:12px;">${ICONS.lock(14)} 家长提前结束</button>
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
      showMathVerify('家长提前结束吃饭休息', () => {
        closeModal();
        if (onResume) onResume();
      }, () => showMealBreak(left, onResume));
    };
  }

  function showMathVerify(title, onPass, onCancel) {
    const a = 3 + Math.floor(Math.random() * 6);
    const b = 3 + Math.floor(Math.random() * 6);
    const expected = a * b;
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">${ICONS.lock(17)} ${title}</h2>
        <button id="mv-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
      </div>
      <div style="text-align:center;font-family:ui-monospace,monospace;font-size:30px;font-weight:900;color:#FF4F17;margin:8px 0 12px;">
        ${a} × ${b} = ?
      </div>
      <input id="mv-input" type="number" inputmode="numeric" placeholder="输入答案" style="width:100%;padding:12px;font-size:20px;font-weight:900;text-align:center;border-radius:14px;border:2px solid #CBD5E1;margin-bottom:10px;" />
      <div id="mv-err" style="color:#E11D48;font-size:13px;font-weight:800;text-align:center;margin-bottom:8px;"></div>
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
        el.querySelector('#mv-err').textContent = '答案不对哦，再算一次';
        audio.wrong();
      }
    };
    el.querySelector('#mv-ok').onclick = check;
    inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
  }

  function showConfirm(title, message, onConfirm, onCancel) {
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button id="cf-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
      </div>
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#525B6B;line-height:1.5;">${message}</p>
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

  function showEyeRest({ isDailyLimit = false } = {}) {
    audio.mealBell();
    audio.speak(
      isDailyLimit
        ? '今天玩游戏的时间到啦，让小眼睛好好休息一下，明天再来哦！'
        : '已经玩了一会儿啦，看看远处的大树和蓝天，让小眼睛休息一下吧！'
    );

    const el = showModal(`
      <div class="break-card">
        <div class="break-badge">${ICONS.eye(32)}</div>
        <h2 style="margin:0 0 8px;font-size:21px;font-weight:900;">
          ${isDailyLimit ? '今日游戏时间已到' : '小眼睛休息一下'}
        </h2>
        <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#525B6B;">
          ${isDailyLimit ? '保护视力，明天再来和汽车小伙伴玩！' : '向窗外远眺 20 秒，眨眨眼睛更明亮！'}
        </p>
        ${!isDailyLimit
          ? `<button id="eye-ok" class="btn btn-primary btn-block">休息好啦，继续玩</button>`
          : `<button id="eye-unlock" class="btn btn-soft btn-block">${ICONS.lock(14)} 家长解锁继续</button>`
        }
      </div>
    `, { dismissible: !isDailyLimit });

    const okBtn = el.querySelector('#eye-ok');
    if (okBtn) okBtn.onclick = () => { audio.click(); closeModal(); };
    const unlockBtn = el.querySelector('#eye-unlock');
    if (unlockBtn) {
      unlockBtn.onclick = () => {
        showMathVerify('家长解锁延长15分钟', () => {
          store.updateSettings({ dailyLimitMinutes: store.state.settings.dailyLimitMinutes + 15 });
          closeModal();
        }, () => showEyeRest({ isDailyLimit: true }));
      };
    }
  }

  function showProfileSwitcher(onChanged) {
    const active = store.getActiveProfile();
    const el = showModal(`
      <div class="modal-header">
        <h2 class="modal-title">${ICONS.user(18)} 选择小朋友档案</h2>
        <button id="prof-close" class="icon-btn" aria-label="关闭">${ICONS.close(16)}</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
        ${store.state.profiles.map((p) => `
          <button class="btn ${p.id === active.id ? 'btn-primary' : 'btn-soft'} btn-block" data-pid="${p.id}" style="justify-content:space-between;">
            <span>${p.name}</span>
            <span style="font-size:13px;font-family:ui-monospace,monospace;">★ ${p.stars} · ${p.keys || 0} 把钥匙</span>
          </button>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;">
        <input id="new-kid-name" type="text" placeholder="添加新小朋友名字..." style="flex:1;padding:10px 12px;border-radius:12px;border:1px solid #CBD5E1;font-size:14px;" />
        <button id="add-kid-btn" class="btn btn-secondary btn-sm">${ICONS.plus(14)} 添加</button>
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
