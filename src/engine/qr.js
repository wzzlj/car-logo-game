// 零依赖纯前端标准 QR Code 编码与 Canvas 渲染器（纠错等级 L，支持 Byte 模式最高 Version 18）
// 用于把跨手机存档迁移码生成可扫码的二维码

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function rsGenerator(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function rsRemainder(data, ecLen) {
  const gen = rsGenerator(ecLen);
  const res = new Uint8Array(ecLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ res[0];
    res.copyWithin(0, 1);
    res[ecLen - 1] = 0;
    for (let j = 0; j < ecLen; j++) {
      res[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return res;
}

// Level L 表: [totalCodewords, ecPerBlock, blocksGroup1, dataPerBlock1, blocksGroup2, dataPerBlock2]
const VERSION_L = [
  null,
  [26, 7, 1, 19, 0, 0],
  [44, 10, 1, 34, 0, 0],
  [70, 15, 1, 55, 0, 0],
  [100, 20, 1, 80, 0, 0],
  [134, 26, 1, 108, 0, 0],
  [172, 18, 2, 68, 0, 0],
  [196, 20, 2, 78, 0, 0],
  [242, 24, 2, 97, 0, 0],
  [292, 30, 2, 116, 0, 0],
  [346, 18, 2, 68, 2, 69],
  [404, 20, 4, 81, 0, 0],
  [466, 24, 2, 92, 2, 93],
  [532, 26, 4, 107, 0, 0],
  [581, 30, 3, 115, 1, 116],
  [655, 22, 5, 87, 1, 88],
  [733, 24, 5, 98, 1, 99],
  [815, 28, 1, 107, 5, 108],
  [901, 30, 5, 120, 1, 121]
];

const ALIGN_POS = [
  [],
  [],
  [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
  [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
  [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66],
  [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82]
];

function chooseVersion(byteLen) {
  for (let v = 1; v < VERSION_L.length; v++) {
    const [, , b1, d1, b2, d2] = VERSION_L[v];
    const cap = b1 * d1 + b2 * d2;
    const headerBytes = v < 10 ? 2 : 3;
    if (byteLen + headerBytes <= cap) return v;
  }
  return -1;
}

function encodeMatrix(text) {
  const bytes = new TextEncoder().encode(text);
  const v = chooseVersion(bytes.length);
  if (v < 0) return null;

  const [, ecLen, b1, d1, b2, d2] = VERSION_L[v];
  const totalData = b1 * d1 + b2 * d2;

  // Build bit stream: Byte mode (0100) + length (8 or 16 bits) + data + terminator
  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4);
  pushBits(bytes.length, v < 10 ? 8 : 16);
  for (const b of bytes) pushBits(b, 8);
  pushBits(0, Math.min(4, totalData * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let val = 0;
    for (let j = 0; j < 8; j++) val = (val << 1) | bits[i + j];
    dataBytes.push(val);
  }
  const pad = [0xec, 0x11];
  let pi = 0;
  while (dataBytes.length < totalData) dataBytes.push(pad[pi++ & 1]);

  // Split blocks & compute RS EC
  const dataBlocks = [];
  const ecBlocks = [];
  let offset = 0;
  const specs = [
    ...Array.from({ length: b1 }, () => d1),
    ...Array.from({ length: b2 }, () => d2)
  ];
  for (const len of specs) {
    const blk = dataBytes.slice(offset, offset + len);
    offset += len;
    dataBlocks.push(blk);
    ecBlocks.push(rsRemainder(blk, ecLen));
  }

  // Interleave
  const finalBytes = [];
  const maxD = Math.max(d1, d2);
  for (let i = 0; i < maxD; i++) {
    for (const blk of dataBlocks) if (i < blk.length) finalBytes.push(blk[i]);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const ec of ecBlocks) finalBytes.push(ec[i]);
  }

  const size = v * 4 + 17;
  const mod = Array.from({ length: size }, () => new Int8Array(size)); // 0 empty, 1 dark, -1 light
  const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

  const setFunc = (r, c, dark) => {
    if (r < 0 || c < 0 || r >= size || c >= size) return;
    mod[r][c] = dark ? 1 : -1;
    isFunc[r][c] = 1;
  };

  // Finder patterns
  const drawFinder = (r0, c0) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const inBox = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const dark =
          inBox &&
          (dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4));
        setFunc(r0 + dr, c0 + dc, dark);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Alignment patterns
  const pos = ALIGN_POS[v];
  for (const r of pos) {
    for (const c of pos) {
      if (isFunc[r][c]) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const dark = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
          setFunc(r + dr, c + dc, dark);
        }
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }
  setFunc(size - 8, 8, true); // Dark module

  // Reserve format info & version info
  for (let i = 0; i < 9; i++) {
    if (!isFunc[8][i]) setFunc(8, i, false);
    if (!isFunc[i][8]) setFunc(i, 8, false);
  }
  for (let i = 0; i < 8; i++) {
    setFunc(8, size - 1 - i, false);
    setFunc(size - 1 - i, 8, false);
  }
  if (v >= 7) {
    let rem = v;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) * 0x1f25);
    const vBits = (v << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((vBits >> i) & 1) === 1;
      const a = Math.floor(i / 3);
      const b = size - 11 + (i % 3);
      setFunc(a, b, dark);
      setFunc(b, a, dark);
    }
  }

  // Place data bits with mask 0: (r + c) % 2 === 0
  let bitIdx = 0;
  const totalBits = finalBytes.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      const r = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        if (isFunc[r][c]) continue;
        let dark = false;
        if (bitIdx < totalBits) {
          dark = ((finalBytes[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) === 1;
          bitIdx++;
        }
        if ((r + c) % 2 === 0) dark = !dark;
        mod[r][c] = dark ? 1 : -1;
      }
    }
  }

  // Format bits for EC Level L (01) + Mask 0 (000) -> 01000 -> precomputed 15-bit: 0x77C4
  const fmt = 0x77c4;
  for (let i = 0; i <= 5; i++) setFunc(8, i, ((fmt >> (14 - i)) & 1) === 1);
  setFunc(8, 7, ((fmt >> 8) & 1) === 1);
  setFunc(8, 8, ((fmt >> 7) & 1) === 1);
  setFunc(7, 8, ((fmt >> 6) & 1) === 1);
  for (let i = 0; i <= 5; i++) setFunc(5 - i, 8, ((fmt >> (5 - i)) & 1) === 1);
  for (let i = 0; i < 7; i++) setFunc(size - 1 - i, 8, ((fmt >> (14 - i)) & 1) === 1);
  for (let i = 0; i < 8; i++) setFunc(8, size - 8 + i, ((fmt >> (7 - i)) & 1) === 1);

  return mod;
}

export function renderQRToCanvas(canvas, text, pxSize = 220) {
  const mod = encodeMatrix(text);
  if (!mod) return false;
  const n = mod.length;
  const quiet = 3;
  const scale = Math.max(2, Math.floor(pxSize / (n + quiet * 2)));
  const total = (n + quiet * 2) * scale;
  canvas.width = total;
  canvas.height = total;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, total, total);
  ctx.fillStyle = '#111827';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (mod[r][c] === 1) {
        ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
  }
  return true;
}
