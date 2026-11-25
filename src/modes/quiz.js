// 多玩法答题引擎：听音选标 (listen)、真车配对 (car2logo)、颜色侦探 (color)、Boss 限时快答 (boss)
// 内置：错题重复出现机制 + 吃饭模式回调 + 星星烟花特效

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG, getWrongColors } from '../data/logos.js';
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
  onAnswerTracked,
  onBurstFX,
  onComplete,
  onExit
}) {
  const mode = level.mode;
  const scope = store.state.settings.scope;
  const pool = scope === 'cn' ? BRANDS.filter((b) => b.origin === 'cn') : BRANDS;

  // 融入 1~2 道历史错题帮助巩固记忆
  const mistakes = store.getMistakeBrandIds(2).filter((id) => !brandIds.includes(id) && pool.some((b) => b.id === id));
  const baseQueue = shuffle([...brandIds, ...mistakes.slice(0, mode === 'boss' ? 2 : 1)]);
  const questionIds = mode === 'boss' ? baseQueue.slice(0, 8) : baseQueue.slice(0, Math.min(6, baseQueue.length));

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

    // 决定本题子模式
    let subMode = mode;
    if (mode === 'boss') {
      const subTypes = ['listen', 'car2logo', 'color'];
      subMode = subTypes[qIndex % subTypes.length];
    } else if (mode === 'car2logo') {
      subMode = qIndex % 2 === 0 ? 'car-to-logo' : 'logo-to-car';
    }

    // 准备 4 个选项
    let options = [];
    let promptHTML = '';
    let speechText = '';

    if (subMode === 'color') {
      const realVariant = target.variants[0];
      const wrongColors = shuffle(getWrongColors(realVariant.color)).slice(0, 3);
      options = shuffle([
        { key: 'real', isCorrect: true, html: renderLogoSVG(target.id, { variantId: realVariant.id }), label: '' },
        ...wrongColors.map((hex, i) => ({
          key: 'w' + i,
          isCorrect: false,
          html: renderLogoSVG(target.id, { variantId: realVariant.id, colorOverride: hex }),
          label: ''
        }))
      ]);
      speechText = `找一找，哪一个是颜色正确的${target.name}车标呢？`;
      promptHTML = `
        <h2 class="prompt-title">🎨 哪一个才是真正颜色的【${target.name}】？</h2>
        <button id="q-speak" class="speak-big-btn">🔊 再听一遍</button>
      `;
    } else {
      const distractors = shuffle(pool.filter((b) => b.id !== target.id)).slice(0, 3);
      const fourBrands = shuffle([target, ...distractors]);

      if (subMode === 'car-to-logo' || subMode === 'car2logo') {
        options = fourBrands.map((b) => {
          const v = b.variants[Math.floor(Math.random() * b.variants.length)];
          return {
            key: b.id,
            isCorrect: b.id === target.id,
            html: renderLogoSVG(b.id, { variantId: v.id }),
            label: ''
          };
        });
        speechText = `看看这辆漂亮的真车，它是哪个品牌的车标呢？`;
        const photoIdx = Math.random() < 0.5 ? 1 : 2;
        promptHTML = `
          <h2 class="prompt-title">🚘 这辆真车是哪个车标？</h2>
          <div style="margin:0 auto 10px;">
            ${renderCarShowcaseHTML(target, { showBadge: false, showCaption: false, photoIdx })}
          </div>
          <button id="q-speak" class="speak-big-btn btn-sm" style="padding:8px 16px;font-size:15px;">🔊 听提示</button>
        `;
      } else if (subMode === 'logo-to-car') {
        options = fourBrands.map((b) => ({
          key: b.id,
          isCorrect: b.id === target.id,
          isCar: true,
          html: `<div style="position:relative;width:100%;height:92px;border-radius:14px;overflow:hidden;">${renderCarSVG(b, { showBadge: true })}<img src="${getRealCarPhotoUrl(b.id, 1)}" alt="${b.carModel}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove()" /></div>`,
          label: b.carModel
        }));
        speechText = `请帮${target.name}车标找到它自己的汽车吧！`;
        promptHTML = `
          <h2 class="prompt-title">🔍 帮【${target.name}】找到它的真车！</h2>
          <div style="width:92px;height:92px;margin:0 auto 8px;background:${target.bgColor};border-radius:20px;padding:10px;border:2px solid #E2E8F0;">
            ${renderLogoSVG(target.id)}
          </div>
          <button id="q-speak" class="speak-big-btn btn-sm" style="padding:8px 16px;font-size:15px;">🔊 读出来</button>
        `;
      } else {
        // listen mode
        options = fourBrands.map((b) => {
          const v = b.variants[Math.floor(Math.random() * b.variants.length)];
          return {
            key: b.id,
            isCorrect: b.id === target.id,
            html: renderLogoSVG(b.id, { variantId: v.id }),
            label: ''
          };
        });
        speechText = `请找出，${target.name}的车标在哪里？`;
        promptHTML = `
          <h2 class="prompt-title">👂 听名字，点一点正确的车标！</h2>
          <button id="q-speak" class="speak-big-btn">🔊 ${target.name}</button>
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
            ${opt.label ? `<span style="font-size:12px;font-weight:800;color:#475569;">${opt.label}</span>` : ''}
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
          audio.speak(randomPraise());
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

          // 吃饭模式：答错也计入答题次数，达到次数同样提醒吃饭休息
          if (onAnswerTracked) {
            onAnswerTracked(false, () => {});
          }
        }
      };
    });
  }

  renderQuestion();
}
