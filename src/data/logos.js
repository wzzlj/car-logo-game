// 50个汽车品牌的矢量车标 SVG 渲染器
// 支持：标准版、新旧版本（classic / new）、以及颜色变体（用于“颜色辨别”玩法与真实路况多色车标学习）

import { BRAND_MAP } from './brands.js';

function wrap(inner, viewBox = '0 0 120 120') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img">${inner}</svg>`;
}

export function renderLogoSVG(brandId, opts = {}) {
  const brand = BRAND_MAP[brandId];
  if (!brand) return wrap(`<circle cx="60" cy="60" r="44" fill="#CBD5E1"/>`);

  const variant =
    brand.variants.find((v) => v.id === opts.variantId) || brand.variants[0];
  const c = opts.colorOverride || variant.color || brand.primaryColor;
  const style = opts.styleOverride || variant.style || 'new';
  const strokeDark = '#1E293B';

  switch (brandId) {
    // 1. 比亚迪
    case 'byd':
      if (style === 'classic') {
        return wrap(`
          <ellipse cx="60" cy="60" rx="52" ry="34" fill="${c}" stroke="#E2E8F0" stroke-width="5"/>
          <ellipse cx="60" cy="60" rx="45" ry="27" fill="none" stroke="#FFFFFF" stroke-width="2.5"/>
          <text x="60" y="70" text-anchor="middle" font-size="28" font-weight="900" font-family="Arial, sans-serif" letter-spacing="3" fill="#FFFFFF">BYD</text>
        `);
      }
      return wrap(`
        <rect x="8" y="34" width="104" height="52" rx="14" fill="#F8FAFC" stroke="${c}" stroke-width="4"/>
        <text x="60" y="71" text-anchor="middle" font-size="32" font-weight="900" font-family="Arial, sans-serif" letter-spacing="5" fill="${c}">BYD</text>
      `);

    // 2. 仰望 (甲骨文“电”)
    case 'yangwang':
      return wrap(`
        <path d="M60 14 L82 40 L60 64 L38 40 Z" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>
        <path d="M60 56 L82 80 L60 106 L38 80 Z" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>
        <line x1="60" y1="14" x2="60" y2="106" stroke="${c}" stroke-width="6"/>
        <path d="M22 60 H42 M78 60 H98" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      `);

    // 3. 腾势
    case 'denza':
      return wrap(`
        <path d="M24 38 C16 64 30 96 60 104 C90 96 104 64 96 38 C86 24 72 20 60 20 C48 20 34 24 24 38 Z" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M60 32 C74 48 74 72 60 88 C46 72 46 48 60 32 Z" fill="${c}"/>
        <circle cx="60" cy="60" r="8" fill="#FFFFFF"/>
      `);

    // 4. 方程豹
    case 'fangchengbao':
      return wrap(`
        <path d="M24 44 L48 24 L72 44 L96 24 L96 76 L72 96 L48 76 L24 96 Z" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>
        <path d="M40 60 L60 44 L80 60 L60 76 Z" fill="${c}"/>
      `);

    // 5. 吉利
    case 'geely':
      if (style === 'classic') {
        return wrap(`
          <path d="M22 18 H98 V64 C98 88 78 102 60 108 C42 102 22 88 22 64 Z" fill="#1E293B" stroke="#CBD5E1" stroke-width="5"/>
          <rect x="30" y="26" width="26" height="20" rx="3" fill="${c}"/>
          <rect x="64" y="26" width="26" height="20" rx="3" fill="#111827"/>
          <rect x="30" y="52" width="26" height="20" rx="3" fill="#111827"/>
          <rect x="64" y="52" width="26" height="20" rx="3" fill="${c}"/>
          <path d="M30 78 H56 V94 C44 90 34 85 30 78 Z" fill="${c}"/>
          <path d="M64 78 H90 C86 85 76 90 64 94 Z" fill="#111827"/>
        `);
      }
      return wrap(`
        <path d="M24 18 H96 V64 C96 86 78 100 60 106 C42 100 24 86 24 64 Z" fill="none" stroke="${c}" stroke-width="6"/>
        <line x1="60" y1="20" x2="60" y2="104" stroke="${c}" stroke-width="5"/>
        <line x1="26" y1="48" x2="94" y2="48" stroke="${c}" stroke-width="5"/>
        <line x1="28" y1="74" x2="92" y2="74" stroke="${c}" stroke-width="5"/>
      `);

    // 6. 领克 (握手方块)
    case 'lynkco':
      return wrap(`
        <rect x="18" y="34" width="84" height="52" rx="8" fill="${c}"/>
        <path d="M28 46 H74 V58 H44 V74 H28 Z" fill="#FFFFFF"/>
        <path d="M92 74 H46 V62 H76 V46 H92 Z" fill="#FFFFFF" opacity="0.88"/>
      `);

    // 7. 极氪 (曙光镂空方框)
    case 'zeekr':
      return wrap(`
        <rect x="24" y="18" width="72" height="84" rx="8" fill="none" stroke="${c}" stroke-width="8"/>
        <path d="M28 52 L92 38" stroke="${c}" stroke-width="8"/>
        <path d="M28 82 L92 68" stroke="${c}" stroke-width="8"/>
      `);

    // 8. 长城 (烽火台)
    case 'gwm':
      return wrap(`
        <ellipse cx="60" cy="60" rx="48" ry="38" fill="${c}" stroke="#CBD5E1" stroke-width="5"/>
        <path d="M60 22 L72 78 L60 68 L48 78 Z" fill="#FFFFFF"/>
        <rect x="34" y="80" width="52" height="7" rx="3" fill="#FFFFFF"/>
      `);

    // 9. 哈弗
    case 'haval':
      return wrap(`
        <rect x="10" y="34" width="100" height="52" rx="12" fill="${c}" stroke="#E2E8F0" stroke-width="4"/>
        <text x="60" y="69" text-anchor="middle" font-size="25" font-weight="900" font-family="Arial, sans-serif" letter-spacing="2" fill="#FFFFFF">HAVAL</text>
      `);

    // 10. 坦克
    case 'tank':
      return wrap(`
        <path d="M24 22 H96 L88 46 H70 V96 L60 104 L50 96 V46 H32 Z" fill="${c}" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>
        <path d="M36 30 H84" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
        <text x="60" y="76" text-anchor="middle" font-size="16" font-weight="900" fill="#FFFFFF">T</text>
      `);

    // 11. 魏牌 (竖旗)
    case 'wey':
      return wrap(`
        <rect x="48" y="14" width="24" height="92" rx="6" fill="${c}" stroke="#CBD5E1" stroke-width="4"/>
        <rect x="57" y="24" width="6" height="72" rx="3" fill="#FFFFFF"/>
      `);

    // 12. 欧拉 (可爱感叹号)
    case 'ora':
      return wrap(`
        <ellipse cx="60" cy="60" rx="34" ry="48" fill="none" stroke="${c}" stroke-width="7"/>
        <rect x="53" y="28" width="14" height="40" rx="7" fill="${c}"/>
        <circle cx="60" cy="84" r="8" fill="${c}"/>
      `);

    // 13. 长安 (V字)
    case 'changan':
      return wrap(`
        <path d="M20 28 L46 28 L60 76 L74 28 L100 28 L68 98 H52 Z" fill="${c}" stroke="#E2E8F0" stroke-width="3" stroke-linejoin="round"/>
      `);

    // 14. 深蓝 (三瓣飞船)
    case 'deepal':
      return wrap(`
        <polygon points="60,14 96,42 74,56 60,44 46,56 24,42" fill="${c}"/>
        <polygon points="60,48 84,64 60,106 36,64" fill="${c}" opacity="0.82"/>
        <circle cx="60" cy="54" r="6" fill="#FFFFFF"/>
      `);

    // 15. 阿维塔
    case 'avatr':
      return wrap(`
        <polygon points="60,14 100,82 76,94 60,64 44,94 20,82" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>
        <polygon points="60,36 74,62 46,62" fill="${c}"/>
      `);

    // 16. 奇瑞 (椭圆内A)
    case 'chery':
      return wrap(`
        <ellipse cx="60" cy="60" rx="50" ry="34" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M36 86 L60 28 L84 86" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M44 68 H76" stroke="${c}" stroke-width="6" stroke-linecap="round"/>
      `);

    // 17. 星途
    case 'exeed':
      return wrap(`
        <rect x="8" y="36" width="104" height="48" rx="12" fill="#F8FAFC" stroke="${c}" stroke-width="4"/>
        <text x="60" y="68" text-anchor="middle" font-size="22" font-weight="900" letter-spacing="4" fill="${c}">EXEED</text>
      `);

    // 18. 捷途 (“行”字造型)
    case 'jetour':
      return wrap(`
        <path d="M30 26 L54 26 L44 94 H28 Z" fill="${c}"/>
        <path d="M62 26 H94 V40 H76 V94 H62 Z" fill="${c}"/>
        <line x1="22" y1="58" x2="98" y2="58" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
      `);

    // 19. 荣威 (双狮盾牌)
    case 'roewe':
      return wrap(`
        <path d="M22 18 H98 V64 C98 88 78 102 60 108 C42 102 22 88 22 64 Z" fill="${style === 'classic' ? '#1E293B' : '#F8FAFC'}" stroke="${c}" stroke-width="6"/>
        <path d="M26 22 H60 V102 C44 96 26 84 26 64 Z" fill="${c}" opacity="${style === 'classic' ? '0.9' : '0.25'}"/>
        <rect x="55" y="28" width="10" height="58" rx="4" fill="#FFD166"/>
        <circle cx="42" cy="52" r="10" fill="#FFFFFF"/>
        <circle cx="78" cy="52" r="10" fill="#FFFFFF"/>
      `);

    // 20. 名爵 (八角形 MG)
    case 'mg':
      return wrap(`
        <polygon points="40,14 80,14 106,40 106,80 80,106 40,106 14,80 14,40" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>
        <text x="60" y="73" text-anchor="middle" font-size="36" font-weight="900" font-family="Arial, sans-serif" fill="${c}">MG</text>
      `);

    // 21. 智己 (IM)
    case 'im':
      return wrap(`
        <circle cx="34" cy="44" r="12" fill="none" stroke="${c}" stroke-width="7"/>
        <rect x="28" y="64" width="12" height="32" rx="6" fill="${c}"/>
        <circle cx="78" cy="44" r="12" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M58 96 V68 C58 58 98 58 98 68 V96" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
      `);

    // 22. 五菱 (五颗红菱形)
    case 'wuling':
      return wrap(`
        <polygon points="60,26 70,48 60,70 50,48" fill="${c}"/>
        <polygon points="40,42 54,58 46,78 32,62" fill="${c}"/>
        <polygon points="80,42 88,62 74,78 66,58" fill="${c}"/>
        <polygon points="18,48 36,64 28,82 10,66" fill="${c}"/>
        <polygon points="102,48 110,66 92,82 84,64" fill="${c}"/>
      `);

    // 23. 宝骏 (钻石标 / 经典马头)
    case 'baojun':
      if (style === 'classic') {
        return wrap(`
          <path d="M24 22 H96 V66 C96 86 78 100 60 106 C42 100 24 86 24 66 Z" fill="none" stroke="${c}" stroke-width="6"/>
          <path d="M44 82 C44 58 50 40 72 34 L82 46 L68 54 C74 62 74 74 66 84 Z" fill="${c}"/>
        `);
      }
      return wrap(`
        <polygon points="60,12 96,60 60,108 24,60" fill="none" stroke="${c}" stroke-width="8" stroke-linejoin="round"/>
        <polygon points="60,28 80,60 60,92 40,60" fill="${c}"/>
      `);

    // 24. 传祺 (大G)
    case 'gac':
      return wrap(`
        <ellipse cx="60" cy="60" rx="48" ry="36" fill="none" stroke="${c}" stroke-width="8"/>
        <path d="M84 46 C76 36 44 36 36 60 C44 84 82 84 88 64 H60" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      `);

    // 25. 埃安 (科技蓝G箭标)
    case 'aion':
      return wrap(`
        <circle cx="60" cy="60" r="44" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M82 44 C72 32 42 36 36 60 C32 78 56 90 78 78 L86 60 H58" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="60" r="6" fill="${c}"/>
      `);

    // 26. 红旗 (红酒杯/金葵花)
    case 'hongqi':
      if (style === 'classic') {
        return wrap(`
          <circle cx="60" cy="60" r="46" fill="#FFF8E1" stroke="${c}" stroke-width="6"/>
          <circle cx="60" cy="60" r="18" fill="${c}"/>
          ${Array.from({ length: 12 }, (_, i) => `<ellipse cx="60" cy="26" rx="5" ry="12" fill="${c}" transform="rotate(${i * 30} 60 60)"/>`).join('')}
        `);
      }
      return wrap(`
        <path d="M36 16 H84 L74 62 C72 74 66 80 60 80 C54 80 48 74 46 62 Z" fill="${c}" stroke="#CBD5E1" stroke-width="4" stroke-linejoin="round"/>
        <rect x="55" y="78" width="10" height="28" rx="4" fill="${c}"/>
        <path d="M44 24 H76 L70 54 H50 Z" fill="#FFFFFF" opacity="0.25"/>
      `);

    // 27. 蔚来 (天空+大地)
    case 'nio':
      return wrap(`
        <path d="M22 52 A38 38 0 0 1 98 52" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
        <path d="M26 98 L60 58 L94 98" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      `);

    // 28. 小鹏 (X飞翼)
    case 'xpeng':
      return wrap(`
        <path d="M18 32 L54 56 L18 80 L34 88 L60 68 L86 88 L102 80 L66 56 L102 32 L86 24 L60 44 L34 24 Z" fill="${c}"/>
      `);

    // 29. 理想 (LI方框)
    case 'lixiang':
      return wrap(`
        <rect x="20" y="20" width="80" height="80" rx="22" fill="none" stroke="${c}" stroke-width="8"/>
        <path d="M42 38 V82 H76" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="78" y1="38" x2="78" y2="64" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
      `);

    // 30. 问界 (星环圆标)
    case 'aito':
      return wrap(`
        <circle cx="60" cy="60" r="42" fill="none" stroke="${c}" stroke-width="7"/>
        <ellipse cx="60" cy="60" rx="46" ry="16" fill="none" stroke="${c}" stroke-width="6" transform="rotate(-18 60 60)"/>
        <text x="60" y="67" text-anchor="middle" font-size="18" font-weight="900" fill="${c}">AITO</text>
      `);

    // 31. 小米 (橙色圆角方块 MI)
    case 'xiaomi':
      return wrap(`
        <rect x="16" y="16" width="88" height="88" rx="28" fill="${c}"/>
        <path d="M34 78 V44 H58 C66 44 68 48 68 56 V78 H58 V54 H44 V78 Z" fill="#FFFFFF"/>
        <rect x="49" y="59" width="6" height="19" fill="#FFFFFF"/>
        <rect x="76" y="44" width="10" height="34" fill="#FFFFFF"/>
      `);

    // 32. 零跑 (LP跑道)
    case 'leapmotor':
      return wrap(`
        <rect x="24" y="20" width="72" height="80" rx="34" fill="none" stroke="${c}" stroke-width="8"/>
        <path d="M46 38 V82 H74" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M62 38 H74 C82 38 82 58 74 58 H62" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
      `);

    // 33. 大众 (VW)
    case 'vw':
      return wrap(`
        <circle cx="60" cy="60" r="48" fill="${style === 'classic' ? '#E2E8F0' : '#FFFFFF'}" stroke="${c}" stroke-width="8"/>
        <path d="M30 28 L60 72 L90 28" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 46 L46 94 L60 66 L74 94 L98 46" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `);

    // 34. 丰田 (三椭圆牛头)
    case 'toyota':
      return wrap(`
        <ellipse cx="60" cy="60" rx="50" ry="34" fill="none" stroke="${c}" stroke-width="7"/>
        <ellipse cx="60" cy="60" rx="16" ry="32" fill="none" stroke="${c}" stroke-width="6"/>
        <ellipse cx="60" cy="44" rx="36" ry="12" fill="none" stroke="${c}" stroke-width="6"/>
      `);

    // 35. 本田 (方框H)
    case 'honda':
      return wrap(`
        <rect x="18" y="22" width="84" height="76" rx="16" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M38 36 L44 84 M82 36 L76 84 M42 62 H78" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
      `);

    // 36. 日产 (圆圈+横条)
    case 'nissan':
      return wrap(`
        <circle cx="60" cy="60" r="42" fill="none" stroke="${c}" stroke-width="${style === 'classic' ? '9' : '6'}"/>
        <rect x="10" y="47" width="100" height="26" rx="6" fill="#FFFFFF" stroke="${c}" stroke-width="4"/>
        <text x="60" y="66" text-anchor="middle" font-size="18" font-weight="900" letter-spacing="1.5" fill="${c}">NISSAN</text>
      `);

    // 37. 奔驰 (三叉星)
    case 'mercedes':
      return wrap(`
        <circle cx="60" cy="60" r="48" fill="none" stroke="${c}" stroke-width="7"/>
        <polygon points="60,14 66,56 102,84 60,68 18,84 54,56" fill="${c}"/>
      `);

    // 38. 宝马 (蓝白风车圆盘)
    case 'bmw':
      return wrap(`
        <circle cx="60" cy="60" r="50" fill="${style === 'classic' ? '#111827' : '#F8FAFC'}" stroke="#94A3B8" stroke-width="4"/>
        <circle cx="60" cy="60" r="34" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
        <path d="M60 60 L60 26 A34 34 0 0 0 26 60 Z" fill="${c}"/>
        <path d="M60 60 L94 60 A34 34 0 0 1 60 94 Z" fill="${c}"/>
        <text x="60" y="23" text-anchor="middle" font-size="11" font-weight="900" fill="${style === 'classic' ? '#FFFFFF' : strokeDark}">BMW</text>
      `);

    // 39. 奥迪 (四个圆环)
    case 'audi':
      return wrap(`
        <circle cx="24" cy="60" r="16" fill="none" stroke="${c}" stroke-width="5.5"/>
        <circle cx="48" cy="60" r="16" fill="none" stroke="${c}" stroke-width="5.5"/>
        <circle cx="72" cy="60" r="16" fill="none" stroke="${c}" stroke-width="5.5"/>
        <circle cx="96" cy="60" r="16" fill="none" stroke="${c}" stroke-width="5.5"/>
      `);

    // 40. 保时捷 (金红黑盾牌)
    case 'porsche':
      return wrap(`
        <path d="M24 16 H96 V66 C96 88 78 102 60 108 C42 102 24 88 24 66 Z" fill="${c}" stroke="#1E293B" stroke-width="5"/>
        <rect x="28" y="24" width="64" height="14" fill="#1E293B"/>
        <rect x="60" y="40" width="32" height="24" fill="#D62828"/>
        <rect x="28" y="64" width="32" height="24" fill="#D62828"/>
        <line x1="60" y1="40" x2="60" y2="98" stroke="#1E293B" stroke-width="4"/>
        <line x1="28" y1="64" x2="92" y2="64" stroke="#1E293B" stroke-width="4"/>
        <circle cx="60" cy="64" r="11" fill="#FFD166" stroke="#1E293B" stroke-width="3"/>
      `);

    // 41. 特斯拉 (T)
    case 'tesla':
      return wrap(`
        <path d="M18 30 C42 20 78 20 102 30 L96 38 C76 30 44 30 24 38 Z" fill="${c}"/>
        <path d="M24 44 C44 38 76 38 96 44 L86 52 H69 L60 106 L51 52 H34 Z" fill="${c}"/>
      `);

    // 42. 福特 (蓝椭圆)
    case 'ford':
      return wrap(`
        <ellipse cx="60" cy="60" rx="52" ry="30" fill="${c}" stroke="#CBD5E1" stroke-width="5"/>
        <ellipse cx="60" cy="60" rx="46" ry="24" fill="none" stroke="#FFFFFF" stroke-width="2"/>
        <text x="60" y="70" text-anchor="middle" font-size="30" font-style="italic" font-weight="900" font-family="Georgia, serif" fill="#FFFFFF">Ford</text>
      `);

    // 43. 别克 (三盾牌)
    case 'buick':
      if (style === 'classic') {
        return wrap(`
          <circle cx="60" cy="60" r="46" fill="none" stroke="${c}" stroke-width="6"/>
          <path d="M32 54 L46 46 V82 L32 88 Z" fill="#D62828"/>
          <path d="M53 42 L67 34 V70 L53 76 Z" fill="#94A3B8"/>
          <path d="M74 30 L88 22 V58 L74 64 Z" fill="#0077B6"/>
        `);
      }
      return wrap(`
        <path d="M20 30 L38 24 V82 L29 94 L20 82 Z" fill="${c}"/>
        <path d="M51 30 L69 24 V82 L60 94 L51 82 Z" fill="#94A3B8"/>
        <path d="M82 30 L100 24 V82 L91 94 L82 82 Z" fill="#0077B6"/>
      `);

    // 44. 凯迪拉克 (彩色盾牌)
    case 'cadillac':
      return wrap(`
        <path d="M18 32 H102 L90 78 L60 96 L30 78 Z" fill="#FFFFFF" stroke="#475569" stroke-width="5" stroke-linejoin="round"/>
        <rect x="26" y="38" width="34" height="18" fill="${c}"/>
        <rect x="60" y="38" width="34" height="18" fill="#FFB703"/>
        <rect x="30" y="56" width="30" height="20" fill="#1E293B"/>
        <rect x="60" y="56" width="30" height="20" fill="#0077B6"/>
      `);

    // 45. 现代 (斜H椭圆)
    case 'hyundai':
      return wrap(`
        <ellipse cx="60" cy="60" rx="50" ry="32" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M42 82 L54 38 M66 82 L78 38 M47 64 C56 54 64 66 73 56" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
      `);

    // 46. 马自达 (海鸥展翅)
    case 'mazda':
      return wrap(`
        <ellipse cx="60" cy="60" rx="48" ry="38" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M20 44 C38 46 50 56 60 74 C70 56 82 46 100 44" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `);

    // 47. 雷克萨斯 (斜L椭圆)
    case 'lexus':
      return wrap(`
        <ellipse cx="60" cy="60" rx="50" ry="36" fill="none" stroke="${c}" stroke-width="7"/>
        <path d="M56 32 L38 78 H86" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      `);

    // 48. 路虎 (绿椭圆)
    case 'landrover':
      return wrap(`
        <ellipse cx="60" cy="60" rx="52" ry="30" fill="${c}" stroke="#CBD5E1" stroke-width="5"/>
        <text x="52" y="56" text-anchor="middle" font-size="14" font-weight="900" fill="#FFFFFF">LAND</text>
        <text x="68" y="74" text-anchor="middle" font-size="14" font-weight="900" fill="#FFFFFF">ROVER</text>
      `);

    // 49. 沃尔沃 (带箭头圆环)
    case 'volvo':
      return wrap(`
        <circle cx="56" cy="64" r="36" fill="none" stroke="${c}" stroke-width="8"/>
        <line x1="82" y1="38" x2="104" y2="16" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
        <polyline points="86,16 104,16 104,34" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="20" y="54" width="72" height="20" rx="4" fill="${c}"/>
        <text x="56" y="69" text-anchor="middle" font-size="13" font-weight="900" letter-spacing="2" fill="#FFFFFF">VOLVO</text>
      `);

    // 50. 法拉利 (黄盾跃马)
    case 'ferrari':
      return wrap(`
        <path d="M26 16 H94 V64 C94 88 78 102 60 108 C42 102 26 88 26 64 Z" fill="${c}" stroke="#1E293B" stroke-width="5"/>
        <rect x="29" y="19" width="21" height="8" fill="#009246"/>
        <rect x="50" y="19" width="20" height="8" fill="#FFFFFF"/>
        <rect x="70" y="19" width="21" height="8" fill="#CE2B37"/>
        <!-- 跃马剪影 -->
        <path d="M48 86 C48 72 54 64 56 54 C48 52 44 46 50 38 C56 32 66 34 70 42 C72 48 68 54 66 58 C74 62 76 74 70 86 L62 84 C64 74 62 68 58 68 L54 86 Z" fill="#111827"/>
      `);

    default:
      return wrap(`
        <circle cx="60" cy="60" r="46" fill="${c}"/>
        <text x="60" y="68" text-anchor="middle" font-size="22" font-weight="900" fill="#FFFFFF">${brand.name.slice(0, 2)}</text>
      `);
  }
}

// 为“颜色辨别”模式生成与正确颜色明显不同的干扰色
export function getWrongColors(correctColor) {
  const palette = ['#2EC4B6', '#FF6B9D', '#8338EC', '#80ED99', '#FFB703', '#FF595E', '#3A86FF'];
  return palette.filter((hex) => hex.toLowerCase() !== (correctColor || '').toLowerCase());
}
