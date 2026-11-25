// 50个汽车品牌的真实官方车标渲染器（图片来自 assets/logos/，来源 Wikimedia Commons / Wikipedia）
// 修复：
// 1. 纯黑/单色 SVG 使用 brightness(0) saturate(100%) + 目标色相矩阵，确保“黑/银/金/红/蓝/橙/粉/绿”变体真实变色
// 2. 支持真实经典旧标图片切换（REAL_CLASSIC_LOGO_MAP）
// 3. “颜色侦探”模式仅使用本身带有鲜明标志色的品牌，并用高对比错色方案避免 4 选 1 撞色

import { BRAND_MAP } from './brands.js';
import { REAL_LOGO_MAP, REAL_CLASSIC_LOGO_MAP } from './logoManifest.js';

// 带有鲜明标志性色彩、适合“颜色侦探”模式的品牌清单
export const COLORFUL_BRAND_IDS = [
  'xiaomi', 'hongqi', 'wuling', 'haval', 'mg', 'byd', 'changan', 'aion', 'baojun', 'fangchengbao',
  'bmw', 'vw', 'ford', 'landrover', 'tesla', 'honda', 'porsche', 'toyota'
];

// 多色徽标（使用 hue-rotate 保持内部多色对比，不会糊成纯单色）
const MULTICOLOR_EMBLEMS = new Set(['bmw', 'porsche', 'ford', 'baojun', 'gwm']);

// 针对单色/纯色车标的精准 CSS 染色滤镜（即使原图是纯黑 #000000 也能染出鲜艳真实颜色）
const COLOR_FILTERS = {
  black:  'brightness(0) saturate(100%)',
  silver: 'brightness(0) saturate(100%) invert(56%) sepia(8%) saturate(380%) hue-rotate(175deg) brightness(96%) contrast(94%)',
  gold:   'brightness(0) saturate(100%) invert(64%) sepia(65%) saturate(580%) hue-rotate(6deg) brightness(96%) contrast(95%)',
  red:    'brightness(0) saturate(100%) invert(21%) sepia(92%) saturate(4200%) hue-rotate(348deg) brightness(92%) contrast(102%)',
  blue:   'brightness(0) saturate(100%) invert(34%) sepia(96%) saturate(2200%) hue-rotate(196deg) brightness(95%) contrast(98%)',
  orange: 'brightness(0) saturate(100%) invert(48%) sepia(97%) saturate(2400%) hue-rotate(2deg) brightness(101%) contrast(102%)',
  pink:   'brightness(0) saturate(100%) invert(56%) sepia(65%) saturate(1900%) hue-rotate(302deg) brightness(100%) contrast(102%)',
  green:  'brightness(0) saturate(100%) invert(42%) sepia(74%) saturate(650%) hue-rotate(104deg) brightness(92%) contrast(96%)',
  teal:   'brightness(0) saturate(100%) invert(37%) sepia(60%) saturate(950%) hue-rotate(142deg) brightness(92%) contrast(96%)',
  purple: 'brightness(0) saturate(100%) invert(26%) sepia(88%) saturate(3200%) hue-rotate(262deg) brightness(92%) contrast(102%)'
};

const MULTI_DECOY_FILTERS = [
  'hue-rotate(115deg) saturate(1.8)',
  'hue-rotate(215deg) saturate(1.9)',
  'hue-rotate(300deg) saturate(2.1)'
];

export function renderLogoSVG(brandId, opts = {}) {
  const brand = BRAND_MAP[brandId];
  const name = brand ? brand.name : brandId;

  // 若选择经典旧标且有真实旧标文件，则直接切换为真实旧标图
  const useClassic = opts.variantId === 'classic' && REAL_CLASSIC_LOGO_MAP[brandId];
  const logoUrl = useClassic ? REAL_CLASSIC_LOGO_MAP[brandId] : REAL_LOGO_MAP[brandId];

  if (!logoUrl) {
    return `<div class="brand-logo-fallback">${name}</div>`;
  }

  let filter = '';
  if (opts.colorOverride) {
    filter = opts.colorOverride.startsWith('filter:')
      ? opts.colorOverride.slice(7)
      : (COLOR_FILTERS[opts.colorOverride] || '');
  } else if (opts.variantId && opts.variantId !== 'default' && opts.variantId !== 'classic') {
    filter = COLOR_FILTERS[opts.variantId] || '';
  }

  const styleAttr = filter ? ` style="filter:${filter};"` : '';
  return `<img class="brand-logo-img" src="${logoUrl}" alt="${name}车标" draggable="false"${styleAttr} />`;
}

// 为“颜色侦探”模式返回 3 个与真实原色明显不同的错色滤镜
export function getWrongColors(brandId) {
  if (MULTICOLOR_EMBLEMS.has(brandId)) {
    return MULTI_DECOY_FILTERS.map((f) => `filter:${f}`);
  }
  const brand = BRAND_MAP[brandId];
  const mainHex = (brand?.primaryColor || '').toLowerCase();
  // 根据原色避开相近色系，挑选 3 个高对比错色
  let candidates = ['green', 'purple', 'pink', 'orange', 'blue'];
  if (['#005a2b', '#1b4332', '#2a9d8f', '#006d77'].includes(mainHex)) {
    candidates = ['pink', 'orange', 'purple', 'red'];
  } else if (['#004e98', '#023e8a', '#0077b6', '#00b4d8', '#3a86ff', '#003478'].includes(mainHex)) {
    candidates = ['green', 'orange', 'pink', 'purple'];
  } else if (['#ff6900', '#e85d04'].includes(mainHex)) {
    candidates = ['green', 'purple', 'blue', 'pink'];
  }
  return candidates.slice(0, 3).map((c) => `filter:${COLOR_FILTERS[c]}`);
}
