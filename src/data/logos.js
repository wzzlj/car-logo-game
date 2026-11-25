// 50个汽车品牌的真实官方车标渲染器（图片来自 assets/logos/，由 Wikimedia Commons / Wikipedia 收集）
// 支持：标准真标展示、黑化/银色/金色等常见车身变体预览、以及“颜色侦探”模式趣味错色滤镜

import { BRAND_MAP } from './brands.js';
import { REAL_LOGO_MAP } from './logoManifest.js';

// 为“颜色侦探”模式提供 3 种明显区别于原色的滤镜方案
const WRONG_COLOR_FILTERS = [
  'sepia(1) saturate(5) hue-rotate(85deg) brightness(1.05)',   // 奇异荧光绿
  'sepia(1) saturate(5.5) hue-rotate(255deg) brightness(0.95)', // 奇异紫罗兰
  'sepia(1) saturate(5) hue-rotate(305deg) brightness(1.05)',   // 奇异粉红
  'sepia(1) saturate(5) hue-rotate(170deg) brightness(1.0)',    // 奇异青蓝
  'sepia(1) saturate(6) hue-rotate(15deg) brightness(1.05)'     // 奇异亮橙
];

function getVariantFilter(variantId, colorOverride) {
  if (colorOverride) {
    // colorOverride 传入的是错色索引或色值字符串
    if (typeof colorOverride === 'string' && colorOverride.startsWith('filter:')) {
      return colorOverride.slice(7);
    }
    const idx = Math.abs(
      String(colorOverride)
        .split('')
        .reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    ) % WRONG_COLOR_FILTERS.length;
    return WRONG_COLOR_FILTERS[idx];
  }

  switch (variantId) {
    case 'black':
      return 'grayscale(1) brightness(0.18) contrast(2.2)';
    case 'silver':
      return 'grayscale(1) brightness(1.15) contrast(1.05)';
    case 'gold':
      return 'sepia(0.95) saturate(2.2) hue-rotate(8deg) brightness(1.02)';
    case 'blue':
      return 'sepia(0.75) saturate(2.8) hue-rotate(175deg)';
    case 'red':
      return 'sepia(0.8) saturate(4) hue-rotate(330deg)';
    case 'pink':
      return 'sepia(0.7) saturate(3.2) hue-rotate(290deg)';
    case 'green':
      return 'sepia(0.8) saturate(3) hue-rotate(95deg)';
    default:
      return '';
  }
}

export function renderLogoSVG(brandId, opts = {}) {
  const brand = BRAND_MAP[brandId];
  const logoUrl = REAL_LOGO_MAP[brandId];
  const name = brand ? brand.name : brandId;

  if (!logoUrl) {
    return `<div class="brand-logo-fallback">${name}</div>`;
  }

  const isDefaultVariant =
    !opts.variantId || (brand && brand.variants[0] && opts.variantId === brand.variants[0].id);
  const filter = opts.colorOverride
    ? getVariantFilter(null, opts.colorOverride)
    : isDefaultVariant
      ? ''
      : getVariantFilter(opts.variantId, null);
  const styleAttr = filter ? ` style="filter:${filter};"` : '';

  return `<img class="brand-logo-img" src="${logoUrl}" alt="${name}车标" draggable="false"${styleAttr} />`;
}

// 为“颜色侦探”模式返回 3 个明显不同的错色滤镜标识
export function getWrongColors(_correctColor) {
  return WRONG_COLOR_FILTERS.map((f) => `filter:${f}`);
}
