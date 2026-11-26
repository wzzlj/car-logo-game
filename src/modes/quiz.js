// Direction A (Mini Cockpit) 多玩法答题引擎 + 精准车标局部放大取景器（无预裁切 + 点哪放哪 + 拖动微调）

import { BRANDS, BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { getRealCarPhotoUrl, hasSecondCarPhoto } from '../data/cars.js';
import { audio, randomPraise, randomEncourage } from '../engine/audio.js';
import { store } from '../engine/storage.js';
import { ICONS } from '../ui/icons.js';

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
      if (el) el.innerHTML = `${ICONS.timer(14)} ${timeLeft}s`;
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

    let photoIdx = hasSecondCarPhoto(target.id) && Math.random() < 0.5 ? 2 : 1;

    if (subMode === 'car-to-logo') {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        html: renderLogoSVG(b.id, { variantId: 'default' })
      }));
      speechText = '看看这辆真车，点一下车标的位置就能直接放大看清哦！';
      promptHTML = `
        <h2 class="prompt-title" style="font-size:15px;margin-bottom:8px;">点车头车标位置精准放大 · 放大后可拖动</h2>
        <div id="car-zoom-stage" class="car-zoom-stage">
          <img
            id="car-zoom-img"
            class="car-zoom-img"
            src="${getRealCarPhotoUrl(target.id, photoIdx)}"
            alt="汽车实拍图"
            draggable="false"
          />
          <div id="vf-reticle" class="vf-reticle" style="left:50%;top:58%;opacity:0.85;"></div>
          <div class="vf-overlay">
            <div class="vf-row">
              <span class="vf-tag" id="vf-scale-tag">1.0× 全景</span>
              <span class="vf-tag accent" id="vf-hint-tag">点车标处放大</span>
            </div>
            <div class="vf-row">
              <span class="vf-tag">CAM-0${photoIdx}</span>
              <span class="vf-tag">TAP / DRAG</span>
            </div>
          </div>
        </div>
        <div class="zoom-controls">
          <button id="btn-toggle-zoom" class="btn btn-secondary btn-sm" style="flex:1;">${ICONS.search(15)} 放大 2.8×</button>
          ${hasSecondCarPhoto(target.id) ? `<button id="btn-switch-angle" class="btn btn-soft btn-sm" style="flex:1;">${ICONS.rotate(15)} 换角度</button>` : ''}
          <button id="q-speak" class="btn btn-soft btn-sm">${ICONS.speaker(15)} 提示</button>
        </div>
      `;
    } else if (subMode === 'logo-to-car') {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        isCar: true,
        html: `<div style="position:relative;width:100%;height:106px;border-radius:12px;overflow:hidden;background:#141821;"><img src="${getRealCarPhotoUrl(b.id, 1)}" alt="汽车照片" loading="lazy" style="width:100%;height:100%;object-fit:contain;" /></div>`
      }));
      speechText = `请帮${target.name}车标找到它自己的真车吧！`;
      promptHTML = `
        <h2 class="prompt-title">帮【${target.name}】找到它的真车</h2>
        <div class="logo-stage" style="width:108px;height:108px;padding:8px;margin:0 auto 10px;border-radius:18px;">
          <div class="logo-stage-pad" style="border-radius:12px;padding:8px;">
            ${renderLogoSVG(target.id, { variantId: 'default' })}
          </div>
        </div>
        <button id="q-speak" class="speak-big-btn btn-sm" style="padding:8px 16px;font-size:14px;">${ICONS.speaker(16)} 再读一遍</button>
      `;
    } else {
      options = fourBrands.map((b) => ({
        key: b.id,
        isCorrect: b.id === target.id,
        html: renderLogoSVG(b.id, { variantId: 'default' })
      }));
      speechText = `请找出，${target.name}的车标在哪里？`;
      promptHTML = `
        <h2 class="prompt-title">听名字，选出正确的车标</h2>
        <button id="q-speak" class="speak-big-btn">${ICONS.speaker(19)} ${target.name}</button>
      `;
    }

    root.innerHTML = `
      <div class="play-header">
        <button id="q-exit" class="icon-btn" aria-label="返回驾驶舱">${ICONS.back(18)}</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${mode === 'boss'
          ? `<span id="boss-timer" class="timer-pill">${ICONS.timer(14)} ${timeLeft}s</span>`
          : `<span class="stat-chip">${qIndex + 1}/${questionIds.length}</span>`
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
        audio.speak(subMode === 'car-to-logo' ? `提示：这辆车是${target.name}哦！` : speechText);
      };
    }

    // ==================== 精准无裁切放大 + 拖动平移控制器 ====================
    const stage = root.querySelector('#car-zoom-stage');
    const img = root.querySelector('#car-zoom-img');
    const reticle = root.querySelector('#vf-reticle');
    const scaleTag = root.querySelector('#vf-scale-tag');
    const hintTag = root.querySelector('#vf-hint-tag');
    const zoomBtn = root.querySelector('#btn-toggle-zoom');
    const angleBtn = root.querySelector('#btn-switch-angle');

    if (stage && img) {
      let scale = 1;
      let tx = 0;
      let ty = 0;
      let focusX = 0.5;
      let focusY = 0.58;
      let dragging = false;
      let moved = false;
      let startX = 0;
      let startY = 0;
      let startTx = 0;
      let startTy = 0;

      const clampPan = (nx, ny, s) => {
        const w = stage.clientWidth || 320;
        const h = stage.clientHeight || 214;
        const minX = w - w * s;
        const minY = h - h * s;
        return [
          Math.max(minX, Math.min(0, nx)),
          Math.max(minY, Math.min(0, ny))
        ];
      };

      const renderTransform = () => {
        img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
        if (scaleTag) scaleTag.textContent = scale > 1 ? `${scale.toFixed(1)}× 特写` : '1.0× 全景';
        if (hintTag) hintTag.textContent = scale > 1 ? '拖动可找车标 · 点按还原' : '点车标处放大';
        if (zoomBtn) zoomBtn.innerHTML = scale > 1 ? `${ICONS.zoomOut(15)} 恢复全景` : `${ICONS.search(15)} 放大 2.8×`;
        if (reticle) {
          if (scale > 1) {
            reticle.style.left = '50%';
            reticle.style.top = '50%';
            reticle.style.opacity = '0.9';
          } else {
            reticle.style.left = `${Math.round(focusX * 100)}%`;
            reticle.style.top = `${Math.round(focusY * 100)}%`;
            reticle.style.opacity = '0.75';
          }
        }
      };

      const zoomToPoint = (fx, fy, targetScale = 2.8) => {
        const w = stage.clientWidth || 320;
        const h = stage.clientHeight || 214;
        focusX = Math.max(0.05, Math.min(0.95, fx));
        focusY = Math.max(0.05, Math.min(0.95, fy));
        scale = targetScale;
        const rawTx = w / 2 - focusX * w * scale;
        const rawTy = h / 2 - focusY * h * scale;
        [tx, ty] = clampPan(rawTx, rawTy, scale);
        renderTransform();
      };

      const resetZoom = () => {
        scale = 1;
        tx = 0;
        ty = 0;
        renderTransform();
      };

      stage.addEventListener('pointerdown', (e) => {
        dragging = true;
        moved = false;
        startX = e.clientX;
        startY = e.clientY;
        startTx = tx;
        startTy = ty;
        stage.classList.add('dragging');
        if (stage.setPointerCapture) stage.setPointerCapture(e.pointerId);
      });

      stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.hypot(dx, dy) > 6) moved = true;
        if (scale > 1 && moved) {
          [tx, ty] = clampPan(startTx + dx, startTy + dy, scale);
          renderTransform();
        }
      });

      const endDrag = (e) => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('dragging');
        if (!moved) {
          audio.click();
          const rect = stage.getBoundingClientRect();
          if (scale === 1) {
            const fx = (e.clientX - rect.left) / rect.width;
            const fy = (e.clientY - rect.top) / rect.height;
            zoomToPoint(fx, fy, 2.8);
          } else {
            resetZoom();
          }
        }
      };

      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);

      if (zoomBtn) {
        zoomBtn.onclick = () => {
          audio.click();
          if (scale === 1) zoomToPoint(focusX, focusY, 2.8);
          else resetZoom();
        };
      }

      if (angleBtn) {
        angleBtn.onclick = () => {
          audio.click();
          photoIdx = photoIdx === 1 ? 2 : 1;
          img.src = getRealCarPhotoUrl(target.id, photoIdx);
          focusX = 0.5;
          focusY = 0.58;
          resetZoom();
        };
      }
    }

    root.querySelectorAll('.option-tile').forEach((btn) => {
      btn.onclick = (e) => {
        if (locked) return;
        const opt = options[Number(btn.dataset.idx)];
        if (opt.isCorrect) {
          locked = true;
          correctCount += 1;
          btn.classList.add('correct');
          const res = store.recordAnswer(target.id, true);
          audio.correct();
          const keyNote = res.keysGained > 0 ? '能量满格，获得一把金钥匙！' : '';
          audio.speak(`${randomPraise()}这就是${target.name}！${keyNote}`);
          if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);

          setTimeout(() => {
            const proceed = () => {
              qIndex += 1;
              renderQuestion();
            };
            const paused = onAnswerTracked && onAnswerTracked(true, proceed);
            if (!paused) proceed();
          }, 950);
        } else {
          wrongAttempts += 1;
          btn.classList.add('wrong');
          store.recordAnswer(target.id, false);
          audio.wrong();
          audio.speak(randomEncourage());
          setTimeout(() => btn.classList.remove('wrong'), 480);
          if (onAnswerTracked) onAnswerTracked(false, () => {});
        }
      };
    });
  }

  renderQuestion();
}
