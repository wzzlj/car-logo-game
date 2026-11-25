// 车标翻牌配对玩法：幼儿园友好 3×2 / 3×4 卡片配对

import { BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { audio, randomPraise } from '../engine/audio.js';
import { store } from '../engine/storage.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function runMemoryMode(root, { brandIds, onAnswerTracked, onBurstFX, onComplete, onExit }) {
  const chosen = brandIds.slice(0, 3); // 3 对 = 6 张超大卡片，非常适合幼儿园小朋友
  const cards = shuffle(
    chosen.flatMap((id) => [
      { uid: id + '_a', brandId: id, matched: false },
      { uid: id + '_b', brandId: id, matched: false }
    ])
  );

  let flipped = [];
  let matchedPairs = 0;
  let busy = false;
  let moves = 0;

  function render() {
    const pct = Math.round((matchedPairs / chosen.length) * 100);
    root.innerHTML = `
      <div class="play-header">
        <button id="mem-exit" class="icon-btn">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip" style="font-size:13px;padding:4px 10px;">🃏 ${matchedPairs}/${chosen.length}</span>
      </div>

      <div class="prompt-card">
        <h2 class="prompt-title">🃏 翻开卡片，找到一样的车标吧！</h2>
        <button id="mem-speak" class="speak-big-btn btn-sm" style="padding:8px 16px;font-size:15px;">🔊 听规则</button>
      </div>

      <div class="memory-grid">
        ${cards.map((c, idx) => {
          const isOpen = c.matched || flipped.includes(idx);
          return `
            <div class="memory-card ${isOpen ? 'flipped' : ''} ${c.matched ? 'matched' : ''}" data-idx="${idx}">
              <div class="memory-inner">
                <div class="memory-face memory-front">🚗</div>
                <div class="memory-face memory-back">
                  ${renderLogoSVG(c.brandId)}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    root.querySelector('#mem-exit').onclick = () => {
      audio.stopSpeak();
      audio.click();
      onExit();
    };

    root.querySelector('#mem-speak').onclick = () => {
      audio.speak('点一点小汽车卡片，把两个一模一样的车标配成一对吧！');
    };

    root.querySelectorAll('.memory-card').forEach((el) => {
      el.onclick = (e) => {
        if (busy) return;
        const idx = Number(el.dataset.idx);
        const card = cards[idx];
        if (card.matched || flipped.includes(idx)) return;

        audio.flip();
        flipped.push(idx);
        el.classList.add('flipped');

        if (flipped.length === 2) {
          busy = true;
          moves += 1;
          const [i1, i2] = flipped;
          const c1 = cards[i1];
          const c2 = cards[i2];

          if (c1.brandId === c2.brandId) {
            c1.matched = true;
            c2.matched = true;
            matchedPairs += 1;
            const brand = BRAND_MAP[c1.brandId];
            store.recordAnswer(c1.brandId, true);
            audio.correct();
            audio.speak(`${brand.name}！${randomPraise()}`);
            if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);

            setTimeout(() => {
              flipped = [];
              busy = false;
              const nextStep = () => {
                if (matchedPairs >= chosen.length) {
                  const stars = moves <= chosen.length + 2 ? 3 : moves <= chosen.length + 4 ? 2 : 1;
                  onComplete({ stars, correctCount: chosen.length, total: chosen.length });
                } else {
                  render();
                }
              };
              const paused = onAnswerTracked && onAnswerTracked(true, nextStep);
              if (!paused) nextStep();
            }, 650);
          } else {
            audio.wrong();
            setTimeout(() => {
              flipped = [];
              busy = false;
              render();
              if (onAnswerTracked) onAnswerTracked(false, () => {});
            }, 850);
          }
        }
      };
    });
  }

  audio.speak('翻牌记忆大挑战！找出两个一模一样的车标吧！');
  render();
}
