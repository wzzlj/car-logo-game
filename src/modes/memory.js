// Direction A (Mini Cockpit) 翻牌配对玩法（无 Emoji，统一机械图标）

import { BRAND_MAP } from '../data/brands.js';
import { renderLogoSVG } from '../data/logos.js';
import { audio, randomPraise } from '../engine/audio.js';
import { store } from '../engine/storage.js';
import { ICONS } from '../ui/icons.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function runMemoryMode(root, { brandIds, onAnswerTracked, onBurstFX, onComplete, onExit }) {
  const rounds = [];
  if (brandIds.length <= 4) {
    rounds.push([...brandIds]);
  } else {
    const mid = Math.ceil(brandIds.length / 2);
    rounds.push(brandIds.slice(0, mid));
    rounds.push(brandIds.slice(mid));
  }

  let roundIdx = 0;
  let totalMoves = 0;
  let totalPairs = brandIds.length;
  let totalMatched = 0;
  let cards = [];
  let flipped = [];
  let matchedInRound = 0;
  let busy = false;

  function initRound() {
    const chosen = rounds[roundIdx];
    cards = shuffle(
      chosen.flatMap((id) => [
        { uid: id + '_a', brandId: id, matched: false },
        { uid: id + '_b', brandId: id, matched: false }
      ])
    );
    flipped = [];
    matchedInRound = 0;
    busy = false;
  }

  function render() {
    const chosen = rounds[roundIdx];
    const pct = Math.round((totalMatched / Math.max(1, totalPairs)) * 100);
    const cols = cards.length === 8 ? 4 : 3;

    root.innerHTML = `
      <div class="play-header">
        <button id="mem-exit" class="icon-btn" aria-label="返回">${ICONS.back(18)}</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip">${rounds.length > 1 ? `${roundIdx + 1}/${rounds.length} · ` : ''}${matchedInRound}/${chosen.length}</span>
      </div>

      <div class="prompt-card" style="padding:12px;">
        <h2 class="prompt-title" style="margin-bottom:8px;">翻开卡片，找到一样的车标</h2>
        <button id="mem-speak" class="speak-big-btn btn-sm" style="padding:8px 16px;font-size:14px;">${ICONS.speaker(16)} 听规则</button>
      </div>

      <div class="memory-grid" style="grid-template-columns:repeat(${cols}, 1fr);">
        ${cards.map((c, idx) => {
          const isOpen = c.matched || flipped.includes(idx);
          return `
            <div class="memory-card ${isOpen ? 'flipped' : ''} ${c.matched ? 'matched' : ''}" data-idx="${idx}">
              <div class="memory-inner">
                <div class="memory-face memory-front">${ICONS.steering(30)}</div>
                <div class="memory-face memory-back">${renderLogoSVG(c.brandId)}</div>
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
      audio.speak('点一点卡片，把两个一模一样的车标配成一对吧！');
    };

    root.querySelectorAll('.memory-card').forEach((el) => {
      el.onclick = (e) => {
        if (busy) return;
        const idx = Number(el.dataset.idx);
        const card = cards[idx];
        if (card.matched) {
          audio.click();
          audio.speak(BRAND_MAP[card.brandId]?.name || '');
          return;
        }
        if (flipped.includes(idx)) return;

        audio.flip();
        flipped.push(idx);
        el.classList.add('flipped');

        if (flipped.length === 2) {
          busy = true;
          totalMoves += 1;
          const [i1, i2] = flipped;
          const c1 = cards[i1];
          const c2 = cards[i2];

          if (c1.brandId === c2.brandId) {
            c1.matched = true;
            c2.matched = true;
            matchedInRound += 1;
            totalMatched += 1;
            const brand = BRAND_MAP[c1.brandId];
            store.recordAnswer(c1.brandId, true);
            audio.correct();
            audio.speak(`${brand.name}！${randomPraise()}`);
            if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 300);

            setTimeout(() => {
              flipped = [];
              busy = false;
              const nextStep = () => {
                if (matchedInRound >= chosen.length) {
                  if (roundIdx < rounds.length - 1) {
                    roundIdx += 1;
                    initRound();
                    render();
                    audio.speak('太棒啦，进入下一轮翻牌挑战！');
                  } else {
                    const stars = totalMoves <= totalPairs + 3 ? 3 : totalMoves <= totalPairs + 6 ? 2 : 1;
                    onComplete({ stars, correctCount: totalPairs, total: totalPairs });
                  }
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

  initRound();
  audio.speak('翻牌记忆大挑战！找出两个一模一样的车标吧！');
  render();
}
