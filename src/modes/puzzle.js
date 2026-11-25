// 车标四宫格拼图玩法：点选下方碎片再点上方空位（带浅色底图提示，让幼儿园小朋友有满满成就感）

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

export function runPuzzleMode(root, { brandIds, onAnswerTracked, onBurstFX, onComplete, onExit }) {
  const queue = brandIds.slice(0, 3);
  let pIndex = 0;
  let slots = [null, null, null, null]; // 每格放入的碎片编号 (0..3)
  let trayOrder = shuffle([0, 1, 2, 3]);
  let selectedPiece = null;
  let mistakes = 0;

  function render() {
    if (pIndex >= queue.length) {
      const stars = mistakes <= 1 ? 3 : mistakes <= 3 ? 2 : 1;
      onComplete({ stars, correctCount: queue.length, total: queue.length });
      return;
    }

    const brand = BRAND_MAP[queue[pIndex]];
    const logoSvg = renderLogoSVG(brand.id);
    const pct = Math.round((pIndex / queue.length) * 100);

    root.innerHTML = `
      <div class="play-header">
        <button id="puz-exit" class="icon-btn">⬅️</button>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="stat-chip" style="font-size:13px;padding:4px 10px;">🧩 ${pIndex + 1}/${queue.length}</span>
      </div>

      <div class="prompt-card" style="padding:12px;">
        <h2 class="prompt-title" style="margin-bottom:4px;">🧩 拼出【${brand.name}】车标！</h2>
        <div style="font-size:13px;font-weight:700;color:#5F6C7B;">先点下面一块碎片，再点上面对应的格子</div>
      </div>

      <div class="puzzle-board">
        ${[0, 1, 2, 3].map((slotIdx) => {
          const placed = slots[slotIdx];
          return `
            <div class="puzzle-slot ${placed !== null ? 'filled' : ''}" data-slot="${slotIdx}">
              ${placed !== null
                ? `<div class="quad-clip quad-${placed}">${logoSvg}</div>`
                : `<div class="quad-clip quad-${slotIdx}" style="opacity:0.16;filter:grayscale(1);">${logoSvg}</div>`
              }
            </div>
          `;
        }).join('')}
      </div>

      <div class="puzzle-tray">
        ${trayOrder.map((pieceId) => {
          const isUsed = slots.includes(pieceId);
          const isSel = selectedPiece === pieceId;
          return `
            <div class="puzzle-piece ${isUsed ? 'used' : ''} ${isSel ? 'selected' : ''}" data-piece="${pieceId}">
              <div class="quad-clip quad-${pieceId}">${logoSvg}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    root.querySelector('#puz-exit').onclick = () => {
      audio.stopSpeak();
      audio.click();
      onExit();
    };

    root.querySelectorAll('.puzzle-piece').forEach((el) => {
      el.onclick = () => {
        const pieceId = Number(el.dataset.piece);
        if (slots.includes(pieceId)) return;
        audio.click();
        selectedPiece = pieceId;
        render();
      };
    });

    root.querySelectorAll('.puzzle-slot').forEach((el) => {
      el.onclick = (e) => {
        const slotIdx = Number(el.dataset.slot);
        if (slots[slotIdx] !== null) return;

        // 如果孩子没先选碎片，自动帮他选中第一块未放碎片
        if (selectedPiece === null) {
          const firstAvail = trayOrder.find((id) => !slots.includes(id));
          if (firstAvail === undefined) return;
          selectedPiece = firstAvail;
        }

        if (selectedPiece === slotIdx) {
          slots[slotIdx] = selectedPiece;
          selectedPiece = null;
          audio.correct();

          if (slots.every((s) => s !== null)) {
            store.recordAnswer(brand.id, true);
            audio.honk();
            audio.speak(`${brand.name}拼好啦！${randomPraise()}`);
            if (onBurstFX) onBurstFX(e.clientX || window.innerWidth / 2, e.clientY || 280);
            render();
            setTimeout(() => {
              const nextPuzzle = () => {
                pIndex += 1;
                slots = [null, null, null, null];
                trayOrder = shuffle([0, 1, 2, 3]);
                selectedPiece = null;
                render();
                if (pIndex < queue.length) {
                  audio.speak(`接下来拼一拼${BRAND_MAP[queue[pIndex]].name}吧！`);
                }
              };
              const paused = onAnswerTracked && onAnswerTracked(true, nextPuzzle);
              if (!paused) nextPuzzle();
            }, 900);
          } else {
            render();
          }
        } else {
          mistakes += 1;
          audio.wrong();
          audio.speak('这块不在这里哦，看看浅色影子再放！');
          el.style.animation = 'wobble 0.35s ease';
          setTimeout(() => { el.style.animation = ''; }, 380);
        }
      };
    });
  }

  audio.speak(`车标拼图开始啦！拼出${BRAND_MAP[queue[0]].name}吧！`);
  render();
}
