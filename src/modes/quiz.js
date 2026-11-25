// 多玩法答题引擎：混合识别 (mixed)、听音选标 (listen)、真车特写放大猜标 (car2logo)、限时快答 (boss)
// 核心升级：
// 1. “看真车猜车标”默认放大居中展示 + 支持点击「🔍 放大看车标」(2.2x 特写) +「🔄 换个角度」(切换2张实拍图)
// 2. 支持点击照片任意位置作为放大焦点，方便小朋友把镜头直接对准车头/车尾车标！
// 3. 答题时隐藏车型文字防泄题；Boss 倒计时在吃饭/护眼弹窗期间自动暂停

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { renderCarSVG, getRealCarPhotoUrl } from '../data/cars.js';
import { audio, randomPraise, randomEncourage } from '../engine/audio.js';
import { store } from '../engine/storage.js';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function runQuizMode(root, {
  level,
  brandIds,
  isPaused,
  onAnswerTracked,
  onBurstFX,
  onComplete,
  onExit
}) {
  const mode = level.mode; // 'mixed' | 'listen' | 'car2logo' | 'boss'
  const scope = store.state.settings.scope;
  const pool = scope === 'cn' ? BRANDS.filter((b) => b.origin === 'cn') : BRANDS;

  // 融入 1~2 道历史错题帮助巩固记忆
  const mistakes = store.getMistakeBrandIds(2).filter(
    (id) => !brandIds.includes(id) && pool.some((b) => b.id === id)
  );
  const baseQueue = shuffle([...brandIds, ...mistakes.slice(0, 2)]);
  const questionIds = mode === 'boss' ? baseQueue.slice(0, 8) : baseQueue.slice(0, Math.min(8, baseQueue.length));

  let qIndex = 0;
  let correctCount = 0;
  let wrongAttempts = 0;
  let locked = false;
  let timerId = null;
  let timeLeft = level.timeLimit || 0;

  function cleanup() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    audio.stopSpeak();
  }

  function finish() {
    cleanup();
    const ratio = correctCount / Math.max(1, questionIds.length);
    const stars = ratio >= 0.9 && wrongAttempts <= 1 ? 3 : ratio >= 0.6 ? 2 : 1;
    onComplete({ stars, correctCount, total: questionIds.length });
  }

  if (mode === 'boss' && timeLeft > 0) {
    timerId = setInterval(() => {
      if (isPaused && isPaused()) return;
      timeLeft -= 1;
      const el = root.querySelector('#boss-timer');
      if (el) el.textContent = `⏱️ ${timeLeft}秒`;
      if (timeLeft <= 0) finish();
    }, 1000);
  }

  function renderQuestion() {
    if (qIndex >= questionIds.length) {
      finish();
      return;
    }
    locked = false;
    const targetId = questionIds[qIndex];
    const target = BRAND_MAP[targetId];
    const pct = Math.round((qIndex / questionIds.length) * 100);

    // 决定本题子模式
    let subMode = mode;
    if (mode === 'mixed') {
      const seq = ['listen', 'car-to-logo', 'listen', 'logo-to-car'];
      subMode = seq[qIndex % seq.length];
    } else if (mode === 'boss') {
      subMode = qIndex % 2 === 0 ? 'listen' : 'car-to-logo';
    } else if (mode === 'car2logo') {
      subMode = qIndex % 3 === 2 ? 'logo-to-car' : 'car-to-logo';
    }

    const distractors = shuffle(pool.filter((b) => b.id !== target.id)).slice(0, 3);
    const fourBrands = shuffle([target, ...distractors]);

    let options = [];
    let promptHTML = '';
    let speechText = '';

    // 真车图片缩放与角度状态
    let photoIdx = Math.random() < 0.5 ? 1 : 2;
    let isZoomed = false;
    let originX = 50;
    let originY = 55;

    if (subMode === 'car-to-logo') {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        html: renderLogoSVG(b.id, { variantId: 'default' })
      }));
      speechText = '看看这辆真车，可以点放大镜看清车标哦，它是哪个牌子呢？';
      promptHTML = `
        <h2 class="prompt-title" style="font-size:18px;margin-bottom:8px;">🚘 看看真车，点放大镜找车标！</h2>
        <div id="car-zoom-stage" class="car-zoom-stage">
          <div class="car-svg-wrap" style="height:100%;">${renderCarSVG(target, { showBadge: false })}</div>
          <img
            id="car-zoom-img"
            class="car-zoom-img"
            src="${getRealCarPhotoUrl(target.id, photoIdx)}"
            alt="汽车实拍图"
            style="transform:scale(1.32);transform-origin:50% 55%;"
            onerror="this.remove()"
          />
          <div class="zoom-tip-pill" id="zoom-tip-pill">👆 点图片任意位置放大看车标</div>
        </div>
        <div class="zoom-controls">
          <button id="btn-toggle-zoom" class="btn btn-warning btn-sm" style="flex:1;">🔍 放大看车标</button>
          ${target.id !== 'aito' ? `<button id="btn-switch-angle" class="btn btn-soft btn-sm" style="flex:1;">🔄 换个角度</button>` : ''}
          <button id="q-speak" class="btn btn-secondary btn-sm">🔊 提示</button>
        </div>
      `;
    } else if (subMode === 'logo-to-car') {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        isCar: true,
        html: `<div style="position:relative;width:100%;height:108px;border-radius:14px;overflow:hidden;">${renderCarSVG(b, { showBadge: false })}<img src="${getRealCarPhotoUrl(b.id, 1)}" alt="汽车照片" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.18);" onerror="this.remove()" /></div>`
      }));
      speechText = `请帮${target.name}车标找到它自己的真车吧！`;
      promptHTML = `
        <h2 class="prompt-title">🔍 帮【${target.name}】找到它的真车！</h2>
        <div style="width:92px;height:92px;margin:0 auto 8px;background:#FFFFFF;border-radius:20px;padding:10px;border:2px solid #E2E8F0;display:flex;align-items:center;justify-content:center;">
          ${renderLogoSVG(target.id, { variantId: 'default' })}
        </div>
        <button id="q-speak" class="speak-big-btn btn-sm pulse-speak" style="padding:8px 16px;font-size:15px;">🔊 读出来</button>
      `;
    } else {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        html: renderLogoSVG(b.id, { variantId: 'default' })
      }));
      speechText = `请找出，${target.name}的车标在哪里？`;
      promptHTML = `
        <h2 class="prompt-title">👂 听名字，点一点正确的车标！</h2>
        <button id="q-speak" class="speak-big-btn pulse-speak">🔊 ${target.name}</button>
      `;
    }

    root.innerHTML = `
      <div class="play-header">
        <button id="q-exit" class="icon-btn" aria-label="返回首页">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${mode === 'boss'
          ? `<span id="boss-timer" class="timer-pill">⏱️ ${timeLeft}秒</span>`
          : `<span class="stat-chip" style="font-size:13px;padding:4px 10px;">${qIndex + 1}/${questionIds.length}</span>`
        }
      </div>

      <div class="prompt-card" style="padding:14px;">
        ${promptHTML}
      </div>

      <div class="options-grid">
        ${options.map((opt, idx) => `
          <button class="option-tile ${opt.isCar ? 'car-option' : ''}" data-idx="${idx}">
            ${opt.html}
          </button>
        `).join('')}
      </div>
    `;

    audio.speak(speechText);

    root.querySelector('#q-exit').onclick = () => {
      cleanup();
      audio.click();
      onExit();
    };

    const speakBtn = root.querySelector('#q-speak');
    if (speakBtn) {
      speakBtn.onclick = () => {
        audio.click();
        audio.speak(subMode === 'car-to-logo' ? `提示：这辆车是${target.name}哦！` : speechText);
      };
    }

    // 绑定真车放大镜与换角度交互
    const zoomStage = root.querySelector('#car-zoom-stage');
    const zoomImg = root.querySelector('#car-zoom-img');
    const zoomBtn = root.querySelector('#btn-toggle-zoom');
    const angleBtn = root.querySelector('#btn-switch-angle');
    const tipPill = root.querySelector('#zoom-tip-pill');

    const applyZoom = () => {
      if (!zoomImg) return;
      const scale = isZoomed ? 2.25 : 1.32;
      zoomImg.style.transformOrigin = `${originX}% ${originY}%`;
      zoomImg.style.transform = `scale(${scale})`;
      if (zoomBtn) zoomBtn.textContent = isZoomed ? '🔎 恢复全景' : '🔍 放大看车标';
      if (tipPill) tipPill.textContent = isZoomed ? '🔍 已放大 2.2 倍 · 再点还原' : '👆 点车标位置局部放大';
    };

    if (zoomStage && zoomImg) {
      zoomStage.onclick = (e) => {
        audio.click();
        const rect = zoomStage.getBoundingClientRect();
        if (!isZoomed) {
          originX = Math.max(15, Math.min(85, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
          originY = Math.max(15, Math.min(85, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
          isZoomed = true;
        } else {
          isZoomed = false;
          originX = 50;
          originY = 55;
        }
        applyZoom();
      };
    }

    if (zoomBtn) {
      zoomBtn.onclick = () => {
        audio.click();
        isZoomed = !isZoomed;
        originX = 50;
        originY = 55;
        applyZoom();
      };
    }

    if (angleBtn && zoomImg) {
      angleBtn.onclick = () => {
        audio.click();
        photoIdx = photoIdx === 1 ? 2 : 1;
        isZoomed = false;
        originX = 50;
        originY = 55;
        zoomImg.src = getRealCarPhotoUrl(target.id, photoIdx);
        applyZoom();
      };
    }

    root.querySelectorAll('.option-tile').forEach((btn) => {
      btn.onclick = (e) => {
        if (locked) return;
        const opt = options[Number(btn.dataset.idx)];
        if (opt.isCorrect) {
          locked = true;
          btn.classList.add('correct');
          correctCount += 1;
          store.recordAnswer(target.id, true);
          audio.correct();
          setTimeout(() => audio.honk(), 220);
          const praise = (subMode === 'logo-to-car' || subMode === 'car-to-logo')
            ? `答对啦！这就是${target.carModel}！`
            : randomPraise();
          audio.speak(praise);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);

          const proceed = () => {
            qIndex += 1;
            renderQuestion();
          };

          setTimeout(() => {
            const paused = onAnswerTracked && onAnswerTracked(true, proceed);
            if (!paused) proceed();
          }, 950);
        } else {
          btn.classList.add('wrong');
          wrongAttempts += 1;
          store.recordAnswer(target.id, false);
          audio.wrong();
          audio.speak(randomEncourage());
          setTimeout(() => btn.classList.remove('wrong'), 450);

          if (onAnswerTracked) {
            onAnswerTracked(false, () => {});
          }
        }
      };
    });
  }

  renderQuestion();
}
