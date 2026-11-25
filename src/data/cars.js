// 真实汽车视觉展示模块
// 1. 优先尝试加载本地 assets/cars/<id>.jpg（如用户运行 scripts/fetch_wikimedia_assets.py 下载了维基共享资源真车图）
// 2. 默认即时呈现按品牌真实车身造型（轿车/SUV/方盒子越野/跑车/MPV/萌系小车/皮卡）+ 标志性前脸特征 + 实车配色绘制的高清矢量实车视图

import { REAL_LOGO_MAP } from './logoManifest.js';

export function renderCarSVG(brand, { showBadge = true, customColor = null } = {}) {
  const color = customColor || brand.carColor || '#3A86FF';
  const type = brand.bodyType || 'sedan';
  const isLightBar = ['lixiang', 'xpeng', 'nio', 'xiaomi', 'aito', 'deepal', 'avatr'].includes(brand.id);
  const logoUrl = REAL_LOGO_MAP[brand.id];
  const badgeHtml = showBadge && logoUrl
    ? `<circle cx="164" cy="86" r="15" fill="#FFFFFF" opacity="0.92"/><image href="${logoUrl}" x="152" y="74" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>`
    : '';

  let bodyPath = '';
  let windowPath = '';
  let wheelL = 88;
  let wheelR = 252;
  let wheelY = 122;

  if (type === 'boxy-suv') {
    bodyPath = 'M42 118 V70 C42 62 48 58 58 58 H82 L94 30 H238 C252 30 260 38 264 56 L292 64 C302 67 306 76 306 88 V118 Z';
    windowPath = 'M100 38 H162 V62 H88 Z M174 38 H242 L252 62 H174 Z';
  } else if (type === 'suv') {
    bodyPath = 'M36 118 V82 C36 68 50 60 76 58 L112 32 H222 C244 32 260 44 274 62 L296 72 C306 76 310 86 310 98 V118 Z';
    windowPath = 'M116 40 H168 V64 H92 Z M178 40 H220 C236 40 248 48 258 64 H178 Z';
  } else if (type === 'sport') {
    bodyPath = 'M26 118 V94 C26 78 48 68 88 64 L132 42 H214 C242 42 264 56 286 70 L308 82 C316 88 318 100 314 118 Z';
    windowPath = 'M136 50 H182 V68 H108 Z M192 50 H218 C236 50 250 58 262 68 H192 Z';
  } else if (type === 'mpv') {
    bodyPath = 'M36 118 V76 C36 62 50 48 76 36 H258 C278 36 292 48 298 70 L306 96 V118 Z';
    windowPath = 'M82 44 H142 V70 H64 Z M152 44 H210 V70 H152 Z M220 44 H268 L280 70 H220 Z';
  } else if (type === 'mini') {
    bodyPath = 'M68 118 V80 C68 62 86 42 122 38 H214 C244 38 264 54 272 78 L278 96 V118 Z';
    windowPath = 'M122 46 H168 V74 H96 Z M178 46 H214 C232 46 246 56 254 74 H178 Z';
    wheelL = 110;
    wheelR = 234;
  } else if (type === 'pickup') {
    bodyPath = 'M30 118 V76 H146 V38 H222 C236 38 248 46 256 64 L296 72 C306 76 310 86 310 98 V118 Z';
    windowPath = 'M156 46 H218 C230 46 238 52 246 68 H156 Z';
  } else {
    // sedan
    bodyPath = 'M32 118 V86 C32 72 50 64 82 62 L120 38 H216 C242 38 262 50 280 66 L302 76 C310 80 314 90 314 102 V118 Z';
    windowPath = 'M124 46 H172 V68 H98 Z M182 46 H216 C234 46 248 54 260 68 H182 Z';
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 160" role="img" aria-label="${brand.carModel}">
      <defs>
        <linearGradient id="sky-${brand.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DDF2FF"/>
          <stop offset="100%" stop-color="#F8FAFC"/>
        </linearGradient>
      </defs>
      <!-- Sky & Road -->
      <rect width="340" height="114" fill="url(#sky-${brand.id})"/>
      <circle cx="48" cy="28" r="14" fill="#FFE066" opacity="0.9"/>
      <ellipse cx="268" cy="26" rx="22" ry="9" fill="#FFFFFF" opacity="0.85"/>
      <ellipse cx="286" cy="28" rx="16" ry="8" fill="#FFFFFF" opacity="0.85"/>
      <rect y="114" width="340" height="46" fill="#64748B"/>
      <line x1="12" y1="138" x2="328" y2="138" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="22 18" opacity="0.7"/>
      <!-- Ground Shadow -->
      <ellipse cx="172" cy="126" rx="126" ry="11" fill="#1E293B" opacity="0.24"/>
      <!-- Car Body -->
      <path d="${bodyPath}" fill="${color}" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- Windows -->
      <path d="${windowPath}" fill="#BAE6FD" stroke="#1E293B" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Headlight & Taillight -->
      <rect x="${type === 'mini' ? 256 : 292}" y="82" width="16" height="10" rx="5" fill="${isLightBar ? '#38BDF8' : '#FEF08A'}"/>
      <rect x="${type === 'mini' ? 68 : 34}" y="82" width="14" height="10" rx="4" fill="#EF4444"/>
      ${isLightBar ? '<line x1="258" y1="78" x2="306" y2="84" stroke="#E0F2FE" stroke-width="4" stroke-linecap="round"/>' : ''}
      <!-- Door Handle -->
      <rect x="176" y="76" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.75"/>
      <!-- Wheels -->
      <circle cx="${wheelL}" cy="${wheelY}" r="22" fill="#1E293B" stroke="#E2E8F0" stroke-width="3"/>
      <circle cx="${wheelL}" cy="${wheelY}" r="10" fill="#CBD5E1"/>
      <circle cx="${wheelR}" cy="${wheelY}" r="22" fill="#1E293B" stroke="#E2E8F0" stroke-width="3"/>
      <circle cx="${wheelR}" cy="${wheelY}" r="10" fill="#CBD5E1"/>
      <!-- Optional Badge on Car Door/Hood -->
      ${badgeHtml}
    </svg>
  `;
}

// 映射品牌 ID 到已内置的真实汽车照片文件名（assets/cars/<fileKey>_1.jpg / _2.jpg）
const PHOTO_KEY_MAP = {
  fangchengbao: 'fcb',
  gwm: 'greatwall',
  gac: 'trumpchi',
  lixiang: 'liauto',
  mercedes: 'benz'
};

export function getRealCarPhotoUrl(brandId, variantIdx = 1) {
  const key = PHOTO_KEY_MAP[brandId] || brandId;
  // aito 目录中现有 aito_2.jpg
  const idx = brandId === 'aito' ? 2 : variantIdx;
  return `./assets/cars/${key}_${idx}.jpg`;
}

// 渲染带真车照片回退的展示盒（优先显示 assets/cars/ 中的真实汽车照片，加载失败时自动回退到高清矢量车）
export function renderCarShowcaseHTML(brand, { showBadge = true, showCaption = true, photoIdx = 1 } = {}) {
  const svgFallback = renderCarSVG(brand, { showBadge });
  const photoUrl = getRealCarPhotoUrl(brand.id, photoIdx);
  return `
    <div class="car-showcase-box">
      <div class="car-svg-wrap">${svgFallback}</div>
      <img
        src="${photoUrl}"
        alt="${brand.carModel}"
        loading="lazy"
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
        onerror="this.remove()"
      />
      ${showCaption ? `<span class="car-caption">${brand.carModel}</span>` : ''}
    </div>
  `;
}
