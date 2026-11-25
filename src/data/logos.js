// 50个汽车品牌的真实官方车标渲染器
// 区分：
// - 默认（答题选项 & 车头识别）：优先渲染车头纯图标（Emblem，不含多余英文字母）
// - variantId === 'wordmark'：展示“图标 + 英文字母”完整品牌标（供学习卡片和图鉴对比讲解）
// - variantId === 'classic'：展示经典旧标（如吉利、别克）

import { BRAND_MAP } from './brands.js';
import { REAL_LOGO_MAP, REAL_CLASSIC_LOGO_MAP, REAL_WORDMARK_MAP } from './logoManifest.js';

// 车头上常见为纯图形图标、但官方标志常附带英文字母的品牌（学习时会特别提醒小朋友区别）
export const ICON_VS_TEXT_BRANDS = new Set([
  'denza', 'fangchengbao', 'zeekr', 'gwm', 'deepal', 'chery', 'roewe', 'gac', 'aion',
  'nio', 'xpeng', 'lixiang', 'toyota', 'volvo', 'cadillac', 'audi', 'hyundai', 'mazda',
  'lexus', 'mercedes', 'bmw', 'vw', 'honda', 'porsche', 'ferrari', 'tesla', 'wuling'
]);

const COLOR_FILTERS = {
  black:  'brightness(0) saturate(100%)',
  silver: 'brightness(0) saturate(100%) invert(56%) sepia(8%) saturate(380%) hue-rotate(175deg) brightness(96%) contrast(94%)',
  gold:   'brightness(0) saturate(100%) invert(64%) sepia(65%) saturate(580%) hue-rotate(6deg) brightness(96%) contrast(95%)',
  red:    'brightness(0) saturate(100%) invert(21%) sepia(92%) saturate(4200%) hue-rotate(348deg) brightness(92%) contrast(102%)',
  blue:   'brightness(0) saturate(100%) invert(34%) sepia(96%) saturate(2200%) hue-rotate(196deg) brightness(95%) contrast(98%)'
};

export function hasFullWordmark(brandId) {
  return Boolean(REAL_WORDMARK_MAP && REAL_WORDMARK_MAP[brandId]);
}

export function isIconOnlyOnHood(brandId) {
  return ICON_VS_TEXT_BRANDS.has(brandId);
}

export function renderLogoSVG(brandId, opts = {}) {
  const brand = BRAND_MAP[brandId];
  const name = brand ? brand.name : brandId;

  let logoUrl = REAL_LOGO_MAP[brandId];
  if (opts.variantId === 'classic' && REAL_CLASSIC_LOGO_MAP[brandId]) {
    logoUrl = REAL_CLASSIC_LOGO_MAP[brandId];
  } else if (opts.variantId === 'wordmark' && REAL_WORDMARK_MAP && REAL_WORDMARK_MAP[brandId]) {
    logoUrl = REAL_WORDMARK_MAP[brandId];
  }

  if (!logoUrl) {
    return `<div class="brand-logo-fallback">${name}</div>`;
  }

  let filter = '';
  if (opts.variantId && !['default', 'classic', 'wordmark'].includes(opts.variantId)) {
    filter = COLOR_FILTERS[opts.variantId] || '';
  }

  const styleAttr = filter ? ` style="filter:${filter};"` : '';
  return `<img class="brand-logo-img" src="${logoUrl}" alt="${name}车标" draggable="false"${styleAttr} />`;
}
