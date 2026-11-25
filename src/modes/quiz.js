// 多玩法答题引擎：听音选标 (listen)、真车配对 (car2logo)、颜色侦探 (color)、Boss 限时快答 (boss)
// 修复：
// - 颜色侦探仅使用有鲜明标志色的品牌，并用高对比滤镜生成明显不同的错色干扰项
// - 看车标找真车模式隐藏车型文字防泄题，答对后再播报车型名
// - Boss 关倒计时在吃饭模式/护眼弹窗期间自动暂停
// - 喇叭按钮带呼吸提示，兼容 iOS Safari 语音策略

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG, getWrongColors, COLORFUL_BRAND_IDS } from '../data/logos.js';
import { renderCarSVG, renderCarShowcaseHTML, getRealCarPhotoUrl } from '../data/cars.js';
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
  const mode = level.mode;
  const scope = store.state.settings.scope;
  const pool = scope === 'cn' ? BRANDS.filter((b) => b.origin === 'cn') : BRANDS;

  // 融入 1~2 道历史错题帮助巩固记忆（颜色侦探模式仅融入彩色品牌错题）
  const mistakes = store.getMistakeBrandIds(2).filter((id) => {
    if (brandIds.includes(id)) return false;
    if (!pool.some((b) => b.id === id)) return false;
    if (mode === 'color' && !COLORFUL_BRAND_IDS.includes(id)) return false;
    return true;
  });

  const baseQueue = shuffle([...brandIds, ...mistakes.slice(0, mode === 'boss' ? 2 : 1)]);
  const questionIds = mode === 'boss' ? baseQueue.slice(0, 8) : baseQueue;

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
      // 修复 #7：弹窗（如吃饭休息/护眼提醒）显示期间自动暂停 Boss 倒计时！
      if (isPaused && isPaused()) return;
      timeLeft -= 1;
      const el = root.querySelector('#boss-timer');
      if (el) el.textContent = `⏱️ ${timeLeft}秒`;
      if (timeLeft <= 0) {
        finish();
      }
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

    // 决定本题子模式（Boss 关仅对 COLORFUL_BRAND_IDS 出颜色题）
    let subMode = mode;
    if (mode === 'boss') {
      if (qIndex % 3 === 2 && COLORFUL_BRAND_IDS.includes(target.id)) {
        subMode = 'color';
      } else {
        subMode = qIndex % 2 === 0 ? 'listen' : 'car-to-logo';
      }
    } else if (mode === 'car2logo') {
      subMode = qIndex % 2 === 0 ? 'car-to-logo' : 'logo-to-car';
    }

    let options = [];
    let promptHTML = '';
    let speechText = '';

    if (subMode === 'color') {
      const wrongFilters = shuffle(getWrongColors(target.id)).slice(0, 3);
      options = shuffle([
        { key: 'real', isCorrect: true, html: renderLogoSVG(target.id, { variantId: 'default' }) },
        ...wrongFilters.map((flt, i) => ({
          key: 'w' + i,
          isCorrect: false,
          html: renderLogoSVG(target.id, { colorOverride: flt })
        }))
      ]);
      speechText = `找一找，哪一个是颜色正确的${target.name}车标呢？`;
      promptHTML = `
        <h2 class="prompt-title">🎨 哪一个才是真正颜色的【${target.name}】？</h2>
        <button id="q-speak" class="speak-big-btn pulse-speak">🔊 再听一遍</button>
      `;
    } else {
      const distractors = shuffle(pool.filter((b) => b.id !== target.id)).slice(0, 3);
      const fourBrands = shuffle([target, ...distractors]);

      if (subMode === 'car-to-logo' || subMode === 'car2logo') {
        options = fourBrands.map((b) => ({
          key: b.id,
          isCorrect: b.id === target.id,
          html: renderLogoSVG(b.id, { variantId: 'default' })
        }));
        speechText = `看看这辆漂亮的真车，它是哪个品牌的车标呢？`;
        const photoIdx = Math.random() < 0.5 ? 1 : 2;
        promptHTML = `
          <h2 class="prompt-title">🚘 这辆真车是哪个车标？</h2>
          <div style="margin:0 auto 10px;">
            ${renderCarShowcaseHTML(target, { showBadge: false, showCaption: false, photoIdx })}
          </div>
          <button id="q-speak" class="speak-big-btn btn-sm pulse-speak" style="padding:8px 16px;font-size:15px;">🔊 听提示</button>
        `;
      } else if (subMode === 'logo-to-car') {
        // 修复 #6：答题时不显示车型文字，防止直接泄题！
        options = fourBrands.map((b) => ({
          key: b.id,
          isCorrect: b.id === target.id,
          isCar: true,
          html: `<div style="position:relative;width:100%;height:104px;border-radius:14px;overflow:hidden;">${renderCarSVG(b, { showBadge: false })}<img src="${getRealCarPhotoUrl(b.id, 1)}" alt="汽车照片" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove()" /></div>`
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
    }

    root.innerHTML = `
      <div class="play-header">
        <button id="q-exit" class="icon-btn" aria-label="退出关卡">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${mode === 'boss'
          ? `<span id="boss-timer" class="timer-pill">⏱️ ${timeLeft}秒</span>`
          : `<span class="stat-chip" style="font-size:13px;padding:4px 10px;">${qIndex + 1}/${questionIds.length}</span>`
        }
      </div>

      <div class="prompt-card">
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
        audio.speak(subMode === 'car-to-logo' ? `这是${target.name}的汽车哦！` : speechText);
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
          const praise = subMode === 'logo-to-car'
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
