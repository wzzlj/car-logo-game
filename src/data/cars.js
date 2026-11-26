// 真实汽车展示 & 车库 11 款高细节专属车型可喷漆 SVG 引擎
// 每款车库可解锁车辆均按真实车型特征独立建模（车身比例、标志性灯组、格栅、轮毂、尾翼/备胎、玻璃反光与烤漆高光），喷漆变色时仅重绘漆面！

import { REAL_LOGO_MAP } from './logoManifest.js';

// 11 款车库专属高细节车型渲染（可自由喷漆变色，面向右侧 3/4 侧面展厅视角）
function renderDetailedModelSVG(id, color, logoUrl, showBadge) {
  const uid = `g_${id}_${Math.random().toString(36).slice(2, 6)}`;
  const defs = `
    <defs>
      <linearGradient id="${uid}_body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.32"/>
        <stop offset="38%" stop-color="#FFFFFF" stop-opacity="0.04"/>
        <stop offset="72%" stop-color="#000000" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
      </linearGradient>
      <linearGradient id="${uid}_glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#CFE8FF"/>
        <stop offset="45%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <radialGradient id="${uid}_rim" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F8FAFC"/>
        <stop offset="65%" stop-color="#94A3B8"/>
        <stop offset="100%" stop-color="#475569"/>
      </radialGradient>
    </defs>
  `;

  const wheel = (cx, cy, r = 21, caliper = '#EF4444') => `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#141821" stroke="#2D3545" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 5.5}" fill="url(#${uid}_rim)"/>
      <path d="M${cx + 4} ${cy - 6} A9 9 0 0 1 ${cx + 8} ${cy + 5}" stroke="${caliper}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <g stroke="#1E293B" stroke-width="2.2" stroke-linecap="round">
        <line x1="${cx}" y1="${cy - (r - 6)}" x2="${cx}" y2="${cy + (r - 6)}"/>
        <line x1="${cx - (r - 6)}" y1="${cy}" x2="${cx + (r - 6)}" y2="${cy}"/>
        <line x1="${cx - (r - 9)}" y1="${cy - (r - 9)}" x2="${cx + (r - 9)}" y2="${cy + (r - 9)}"/>
        <line x1="${cx + (r - 9)}" y1="${cy - (r - 9)}" x2="${cx - (r - 9)}" y2="${cy + (r - 9)}"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="4.5" fill="#111827" stroke="#E2E8F0" stroke-width="1.5"/>
    </g>
  `;

  const badge = (x, y) => (showBadge && logoUrl
    ? `<g><circle cx="${x}" cy="${y}" r="11" fill="#FFFFFF" opacity="0.95" stroke="#1E293B" stroke-width="1.2"/><image href="${logoUrl}" x="${x - 8}" y="${y - 8}" width="16" height="16" preserveAspectRatio="xMidYMid meet"/></g>`
    : '');

  let art = '';
  switch (id) {
    case 'wuling': // 五菱宏光 MINI EV：方正双门呆萌短轴小车 + 悬浮白/黑车顶 + 方形呆萌大灯
      art = `
        <ellipse cx="170" cy="136" rx="98" ry="9" fill="#000" opacity="0.28"/>
        <!-- Body -->
        <path d="M84 126 V74 C84 56 96 42 114 40 H218 C236 40 248 54 252 74 L260 88 C264 95 264 114 260 126 Z" fill="${color}" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M84 126 V74 C84 56 96 42 114 40 H218 C236 40 248 54 252 74 L260 88 C264 95 264 114 260 126 Z" fill="url(#${uid}_body)"/>
        <!-- Contrast Cute Roof -->
        <path d="M110 42 H220 C228 42 234 45 238 50 H102 C104 45 107 42 110 42 Z" fill="#F8FAFC" opacity="0.92"/>
        <!-- Windows -->
        <path d="M104 52 H164 V82 H96 Z M172 52 H228 L242 82 H172 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <!-- Front Cute Face & Square Headlight -->
        <rect x="242" y="88" width="18" height="14" rx="4" fill="#FEF08A" stroke="#1E2430" stroke-width="1.8"/>
        <rect x="247" y="92" width="8" height="6" rx="2" fill="#FFFFFF"/>
        <rect x="82" y="88" width="10" height="16" rx="3" fill="#EF4444" stroke="#1E2430" stroke-width="1.5"/>
        <!-- Charging Trim & Door Line -->
        <line x1="168" y1="52" x2="168" y2="122" stroke="#1E2430" stroke-width="1.5" opacity="0.45"/>
        <rect x="176" y="90" width="14" height="4" rx="2" fill="#1E2430" opacity="0.65"/>
        <rect x="92" y="120" width="162" height="7" rx="3.5" fill="#1E2430"/>
        ${wheel(118, 126, 19, '#38BDF8')}
        ${wheel(224, 126, 19, '#38BDF8')}
        ${badge(194, 104)}
      `;
      break;

    case 'xiaomi': // 小米 SU7：超流线溜背轿跑 + 水滴大灯 + 运动小鸭尾 + 黄色卡钳
      art = `
        <ellipse cx="170" cy="136" rx="134" ry="9" fill="#000" opacity="0.32"/>
        <!-- Rear Ducktail & Fastback Body -->
        <path d="M26 120 L34 92 L48 84 L96 52 C118 42 154 40 192 46 L238 66 L296 80 C310 84 316 96 314 114 L306 124 H34 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M26 120 L34 92 L48 84 L96 52 C118 42 154 40 192 46 L238 66 L296 80 C310 84 316 96 314 114 L306 124 H34 Z" fill="url(#${uid}_body)"/>
        <!-- Sleek Teardrop Glasshouse -->
        <path d="M84 74 C112 52 152 48 188 53 L228 74 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <line x1="158" y1="50" x2="152" y2="74" stroke="#1E2430" stroke-width="2.2"/>
        <!-- Waterdrop Headlight + Front Air Curtain -->
        <path d="M272 86 Q296 82 308 92 Q294 98 272 94 Z" fill="#E0F2FE" stroke="#1E2430" stroke-width="1.5"/>
        <line x1="278" y1="90" x2="302" y2="90" stroke="#38BDF8" stroke-width="2"/>
        <!-- Halo Taillight -->
        <path d="M30 92 Q42 88 56 92 L50 98 L30 98 Z" fill="#EF4444"/>
        <!-- Sport Side Skirt & Flush Handles -->
        <path d="M114 122 H228 L224 126 H118 Z" fill="#111827"/>
        <rect x="132" y="84" width="14" height="3" rx="1.5" fill="#1E2430" opacity="0.6"/>
        <rect x="184" y="84" width="14" height="3" rx="1.5" fill="#1E2430" opacity="0.6"/>
        <path d="M236 96 Q244 106 236 114" stroke="#1E2430" stroke-width="2" fill="none" opacity="0.45"/>
        ${wheel(88, 122, 22, '#FACC15')}
        ${wheel(254, 122, 22, '#FACC15')}
        ${badge(172, 102)}
      `;
      break;

    case 'byd': // 比亚迪 汉 EV：修长龙颜行政轿跑 + 贯穿镀铬龙须饰条 + 肌肉后肩线
      art = `
        <ellipse cx="170" cy="136" rx="134" ry="9" fill="#000" opacity="0.3"/>
        <path d="M28 122 V92 C32 82 46 78 64 76 L104 48 H196 C220 48 242 62 258 74 L300 84 C312 88 316 100 314 116 L306 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M28 122 V92 C32 82 46 78 64 76 L104 48 H196 C220 48 242 62 258 74 L300 84 C312 88 316 100 314 116 L306 122 Z" fill="url(#${uid}_body)"/>
        <!-- Glasshouse with Chrome Trim -->
        <path d="M90 74 L112 54 H192 C214 54 232 64 244 74 Z" fill="url(#${uid}_glass)" stroke="#E2E8F0" stroke-width="2.2"/>
        <line x1="162" y1="54" x2="158" y2="74" stroke="#1E2430" stroke-width="2.5"/>
        <!-- Dragon Face Chrome Bar + Slim Matrix Headlight -->
        <path d="M268 86 L310 92 L308 98 L268 94 Z" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1"/>
        <path d="M276 89 L304 93" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Chinese Knot Taillight -->
        <rect x="28" y="88" width="24" height="8" rx="3" fill="#DC2626"/>
        <path d="M62 94 Q170 86 260 94" stroke="#FFFFFF" stroke-width="1.8" fill="none" opacity="0.35"/>
        ${wheel(88, 122, 22, '#DC2626')}
        ${wheel(254, 122, 22, '#DC2626')}
        ${badge(172, 102)}
      `;
      break;

    case 'tank': // 坦克 300：硬派方盒子 + 外挂书包备胎 + 车顶行李架 + 复古圆灯横杠 + 黑色大轮眉
      art = `
        <ellipse cx="172" cy="138" rx="126" ry="9" fill="#000" opacity="0.32"/>
        <!-- Rear External Spare Tire -->
        <rect x="28" y="66" width="22" height="44" rx="8" fill="#1E2430" stroke="#475569" stroke-width="2"/>
        <rect x="33" y="74" width="12" height="28" rx="4" fill="#334155"/>
        <!-- Roof Rack -->
        <path d="M74 34 H212 M86 34 V40 M144 34 V40 M200 34 V40" stroke="#1E2430" stroke-width="3" stroke-linecap="round"/>
        <!-- Boxy Off-Road Body -->
        <path d="M48 122 V52 C48 44 54 40 64 40 H218 C228 40 234 46 238 64 L288 70 C298 72 304 80 304 94 V122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M48 122 V52 C48 44 54 40 64 40 H218 C228 40 234 46 238 64 L288 70 C298 72 304 80 304 94 V122 Z" fill="url(#${uid}_body)"/>
        <!-- Boxy Windows -->
        <rect x="64" y="48" width="44" height="26" rx="3" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <rect x="116" y="48" width="48" height="26" rx="3" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <path d="M172 48 H216 L226 74 H172 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <!-- Wide Black Wheel Arch Fenders & Heavy Bumper -->
        <path d="M62 122 A30 30 0 0 1 122 122 Z" fill="#1E2430"/>
        <path d="M220 122 A30 30 0 0 1 280 122 Z" fill="#1E2430"/>
        <rect x="292" y="106" width="18" height="16" rx="4" fill="#1E2430"/>
        <!-- Iconic Round Headlight with Horizontal Bar -->
        <circle cx="294" cy="86" r="9" fill="#1E2430"/>
        <circle cx="294" cy="86" r="6.5" fill="#FEF08A"/>
        <line x1="284" y1="86" x2="304" y2="86" stroke="#FFFFFF" stroke-width="2.5"/>
        <!-- Taillight -->
        <rect x="48" y="84" width="8" height="20" rx="2" fill="#EF4444"/>
        ${wheel(92, 122, 23, '#F97316')}
        ${wheel(250, 122, 23, '#F97316')}
        ${badge(172, 98)}
      `;
      break;

    case 'bmw': // 宝马运动轿跑：长车头短前悬 + 经典双肾格栅侧面轮廓 + 天使眼 + 霍氏拐角
      art = `
        <ellipse cx="170" cy="136" rx="134" ry="9" fill="#000" opacity="0.3"/>
        <path d="M28 122 V90 C30 82 40 78 58 76 L96 48 H186 C210 48 232 60 248 74 L298 82 C310 85 314 96 312 114 L306 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M28 122 V90 C30 82 40 78 58 76 L96 48 H186 C210 48 232 60 248 74 L298 82 C310 85 314 96 312 114 L306 122 Z" fill="url(#${uid}_body)"/>
        <!-- Glass with Hofmeister Kink -->
        <path d="M84 74 C90 66 96 54 110 54 H184 C204 54 222 64 234 74 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2.2"/>
        <line x1="154" y1="54" x2="150" y2="74" stroke="#1E2430" stroke-width="2.5"/>
        <!-- Kidney Grille Nose + Angel Eye Headlight -->
        <path d="M304 94 H314 V112 H302 Z" fill="#111827" stroke="#E2E8F0" stroke-width="1.5"/>
        <path d="M272 86 L304 88 L302 96 L274 94 Z" fill="#E0F2FE" stroke="#1E2430" stroke-width="1.5"/>
        <circle cx="284" cy="91" r="2.8" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <circle cx="295" cy="91" r="2.8" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <!-- M-Sport Side Air Breather -->
        <path d="M222 96 L228 112" stroke="#1E2430" stroke-width="3" stroke-linecap="round"/>
        <rect x="28" y="88" width="22" height="9" rx="3" fill="#DC2626"/>
        ${wheel(86, 122, 22, '#2563EB')}
        ${wheel(256, 122, 22, '#2563EB')}
        ${badge(170, 100)}
      `;
      break;

    case 'hongqi': // 红旗 H9：大气直瀑前脸 + 标志性红色中轴旗标 + 气派行政三厢车身 + 镀铬腰线
      art = `
        <ellipse cx="170" cy="136" rx="138" ry="9" fill="#000" opacity="0.3"/>
        <path d="M24 122 V86 C26 78 38 74 58 74 L98 46 H198 C222 46 242 58 256 74 L306 78 C314 80 318 92 316 116 L310 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M24 122 V86 C26 78 38 74 58 74 L98 46 H198 C222 46 242 58 256 74 L306 78 C314 80 318 92 316 116 L310 122 Z" fill="url(#${uid}_body)"/>
        <!-- Prestigious Chrome Window Trim -->
        <path d="M84 74 L106 52 H194 C216 52 232 62 244 74 Z" fill="url(#${uid}_glass)" stroke="#F8FAFC" stroke-width="2.5"/>
        <line x1="158" y1="52" x2="156" y2="74" stroke="#1E2430" stroke-width="2.5"/>
        <!-- Iconic Red Flag Strip on Hood + Vertical Waterfall Grille -->
        <path d="M256 74 L308 79" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
        <rect x="304" y="84" width="12" height="28" rx="3" fill="#CBD5E1" stroke="#1E2430" stroke-width="1.5"/>
        <line x1="308" y1="86" x2="308" y2="110" stroke="#475569" stroke-width="1.2"/>
        <line x1="312" y1="86" x2="312" y2="110" stroke="#475569" stroke-width="1.2"/>
        <rect x="278" y="84" width="24" height="8" rx="3" fill="#FEF08A" stroke="#1E2430" stroke-width="1.4"/>
        <!-- Side Red Flag Badge Accent -->
        <rect x="220" y="86" width="12" height="5" rx="2" fill="#DC2626"/>
        <line x1="34" y1="94" x2="296" y2="94" stroke="#F8FAFC" stroke-width="1.8" opacity="0.55"/>
        <rect x="24" y="84" width="14" height="16" rx="3" fill="#DC2626"/>
        ${wheel(84, 122, 22, '#94A3B8')}
        ${wheel(256, 122, 22, '#94A3B8')}
        ${badge(170, 102)}
      `;
      break;

    case 'tesla': // 特斯拉：极简无格栅俯冲前脸 + 全景一体弧形玻璃车顶 + 隐藏门把手
      art = `
        <ellipse cx="170" cy="136" rx="134" ry="9" fill="#000" opacity="0.28"/>
        <path d="M28 122 L34 90 C38 80 50 76 70 72 L116 44 C146 38 184 40 218 54 L256 74 L302 86 C312 90 316 102 312 116 L306 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M28 122 L34 90 C38 80 50 76 70 72 L116 44 C146 38 184 40 218 54 L256 74 L302 86 C312 90 316 102 312 116 L306 122 Z" fill="url(#${uid}_body)"/>
        <!-- Continuous Panoramic Glass Arc -->
        <path d="M78 72 C110 46 156 42 204 54 L244 74 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <line x1="164" y1="46" x2="158" y2="74" stroke="#1E2430" stroke-width="2"/>
        <!-- Minimal Grille-less Nose & Sharp Headlight -->
        <path d="M272 86 Q294 84 306 94 Q288 96 272 92 Z" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.2"/>
        <rect x="132" y="84" width="14" height="3" rx="1.5" fill="#1E2430"/>
        <rect x="184" y="84" width="14" height="3" rx="1.5" fill="#1E2430"/>
        <path d="M30 88 L48 92 L46 98 L30 96 Z" fill="#EF4444"/>
        ${wheel(88, 122, 22, '#EF4444')}
        ${wheel(254, 122, 22, '#EF4444')}
        ${badge(170, 102)}
      `;
      break;

    case 'mercedes': // 奔驰大 G：标志性超高方盒子 + 引擎盖突出转向灯 + 复古圆灯 + 黑色防擦条 + 外挂圆备胎
      art = `
        <ellipse cx="172" cy="138" rx="126" ry="9" fill="#000" opacity="0.34"/>
        <!-- Rear Spare Tire Cover -->
        <rect x="26" y="64" width="22" height="48" rx="9" fill="#111827" stroke="#CBD5E1" stroke-width="2"/>
        <!-- Tall Boxy G-Class Silhouette -->
        <path d="M48 122 V42 C48 36 52 34 60 34 H218 L230 68 H294 C302 68 306 74 306 86 V122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M48 122 V42 C48 36 52 34 60 34 H218 L230 68 H294 C302 68 306 74 306 86 V122 Z" fill="url(#${uid}_body)"/>
        <!-- Flat Tall Windows -->
        <rect x="60" y="42" width="46" height="28" rx="2" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <rect x="114" y="42" width="46" height="28" rx="2" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <path d="M168 42 H214 L222 70 H168 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <!-- Iconic Hood-Mounted Turn Signal! -->
        <rect x="278" y="61" width="12" height="7" rx="3" fill="#F59E0B" stroke="#1E2430" stroke-width="1.6"/>
        <!-- Signature Side Rubbing Strip -->
        <line x1="50" y1="86" x2="292" y2="86" stroke="#1E2430" stroke-width="4"/>
        <!-- Round Headlight & Side Step -->
        <circle cx="296" cy="84" r="8" fill="#FFFFFF" stroke="#1E2430" stroke-width="2"/>
        <rect x="118" y="120" width="106" height="6" rx="2" fill="#94A3B8" stroke="#1E2430" stroke-width="1.2"/>
        <rect x="48" y="96" width="8" height="14" rx="2" fill="#DC2626"/>
        ${wheel(92, 122, 23, '#DC2626')}
        ${wheel(252, 122, 23, '#DC2626')}
        ${badge(172, 102)}
      `;
      break;

    case 'yangwang': // 仰望 U8：巨无霸硬派方盒 + 车顶三犄角激光雷达 + 八边形书包备胎 + 梯形粗犷轮眉
      art = `
        <ellipse cx="172" cy="138" rx="134" ry="9" fill="#000" opacity="0.34"/>
        <!-- Octagonal Spare Tire Backpack -->
        <polygon points="24,72 34,62 46,62 46,112 34,112 24,102" fill="#1E2430" stroke="#94A3B8" stroke-width="2"/>
        <!-- Roof LiDAR Pod ("小犄角") -->
        <path d="M214 36 L228 28 H238 L242 36 Z" fill="#111827"/>
        <!-- Massive Boxy SUV Body -->
        <path d="M46 122 V44 C46 38 52 36 62 36 H226 L242 66 L298 70 C308 72 312 82 312 96 V122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M46 122 V44 C46 38 52 36 62 36 H226 L242 66 L298 70 C308 72 312 82 312 96 V122 Z" fill="url(#${uid}_body)"/>
        <!-- Floating Black Pillar Windows -->
        <path d="M60 44 H222 L234 68 H60 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2.2"/>
        <line x1="118" y1="44" x2="118" y2="68" stroke="#1E2430" stroke-width="3"/>
        <line x1="176" y1="44" x2="176" y2="68" stroke="#1E2430" stroke-width="3"/>
        <!-- Trapezoidal Black Wheel Arches -->
        <polygon points="58,122 70,96 116,96 128,122" fill="#1E2430"/>
        <polygon points="218,122 230,96 276,96 288,122" fill="#1E2430"/>
        <!-- Pixelated Interstellar Headlight -->
        <path d="M294 74 H310 V96 H298 Z" fill="#111827"/>
        <circle cx="302" cy="80" r="2.2" fill="#38BDF8"/>
        <circle cx="302" cy="87" r="2.2" fill="#38BDF8"/>
        <circle cx="302" cy="93" r="2.2" fill="#E0F2FE"/>
        <rect x="46" y="76" width="8" height="24" rx="2" fill="#EF4444"/>
        ${wheel(93, 122, 24, '#F59E0B')}
        ${wheel(253, 122, 24, '#F59E0B')}
        ${badge(172, 98)}
      `;
      break;

    case 'porsche': // 保时捷 911：标志性大溜背水滴线条 + 突起的青蛙圆眼睛大灯 + 运动尾翼 + 红色大卡钳
      art = `
        <ellipse cx="170" cy="136" rx="134" ry="9" fill="#000" opacity="0.32"/>
        <!-- Rear Sport Wing -->
        <path d="M36 78 L58 76 L54 84 H38 Z" fill="#1E2430"/>
        <!-- Iconic 911 Teardrop Flyline -->
        <path d="M32 122 L38 92 C48 80 78 66 116 48 C144 38 178 40 206 54 L242 74 C272 74 298 80 310 96 C314 104 314 114 308 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M32 122 L38 92 C48 80 78 66 116 48 C144 38 178 40 206 54 L242 74 C272 74 298 80 310 96 C314 104 314 114 308 122 Z" fill="url(#${uid}_body)"/>
        <!-- Curved 911 Side Glass -->
        <path d="M108 74 C122 54 156 46 196 56 L228 74 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <line x1="168" y1="50" x2="166" y2="74" stroke="#1E2430" stroke-width="2"/>
        <!-- Signature Frog-Eye Protruding Oval Headlight! -->
        <ellipse cx="284" cy="82" rx="13" ry="8" transform="rotate(24 284 82)" fill="#F8FAFC" stroke="#1E2430" stroke-width="2"/>
        <circle cx="286" cy="83" r="4" fill="#38BDF8" opacity="0.7"/>
        <!-- Lightbar Taillight & Side Intake -->
        <rect x="34" y="92" width="18" height="6" rx="3" fill="#EF4444"/>
        <path d="M106 106 L124 98 L122 114 Z" fill="#1E2430" opacity="0.75"/>
        ${wheel(88, 122, 22, '#EF4444')}
        ${wheel(254, 122, 22, '#EF4444')}
        ${badge(174, 102)}
      `;
      break;

    case 'ferrari': // 法拉利超跑：极度低趴楔形车身 + 标志性侧进气风道 + 引擎透明盖 + 翼子板黄盾 + 黄色卡钳
      art = `
        <ellipse cx="170" cy="136" rx="140" ry="8" fill="#000" opacity="0.36"/>
        <!-- Ultra-low Wedge Supercar Body -->
        <path d="M22 122 L28 90 L52 80 L114 54 C140 46 172 46 198 58 L236 78 L302 88 C316 92 320 104 316 118 L306 122 Z" fill="${color}" stroke="#1E2430" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M22 122 L28 90 L52 80 L114 54 C140 46 172 46 198 58 L236 78 L302 88 C316 92 320 104 316 118 L306 122 Z" fill="url(#${uid}_body)"/>
        <!-- Cab-Forward Fighter Canopy -->
        <path d="M116 76 C134 56 164 52 194 62 L222 78 Z" fill="url(#${uid}_glass)" stroke="#1E2430" stroke-width="2"/>
        <!-- Rear Engine Louver -->
        <path d="M58 82 L106 62 L112 72 L64 88 Z" fill="#1E2430" opacity="0.75"/>
        <!-- Aggressive Side Air Intake Scoop -->
        <path d="M126 98 L166 86 L158 112 L120 112 Z" fill="#111827"/>
        <!-- Front Carbon Splitter & Rear Diffuser -->
        <rect x="282" y="118" width="34" height="5" rx="2" fill="#111827"/>
        <rect x="22" y="116" width="28" height="7" rx="2" fill="#111827"/>
        <!-- Sharp Swept Headlight & Round Twin Taillight -->
        <path d="M270 88 L306 94 L298 98 L268 93 Z" fill="#FEF08A"/>
        <circle cx="30" cy="96" r="5" fill="#EF4444" stroke="#1E2430" stroke-width="1.5"/>
        <!-- Scuderia Yellow Fender Shield -->
        <polygon points="222,88 232,88 231,96 227,100 223,96" fill="#FACC15" stroke="#1E2430" stroke-width="1"/>
        ${wheel(86, 122, 22, '#FACC15')}
        ${wheel(256, 122, 22, '#FACC15')}
        ${badge(186, 102)}
      `;
      break;

    default:
      return null;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 156" role="img" aria-label="${id}">
      ${defs}
      ${art}
    </svg>
  `;
}

export function renderCarSVG(brand, { showBadge = true, customColor = null } = {}) {
  const color = customColor || brand.carColor || '#FF4F17';
  const logoUrl = REAL_LOGO_MAP[brand.id];

  // 11 款车库主打车型使用专属高细节模型
  const detailed = renderDetailedModelSVG(brand.id, color, logoUrl, showBadge);
  if (detailed) return detailed;

  // 其他品牌回退到精致通用车身（同样支持高光与轮毂细节）
  const type = brand.bodyType || 'sedan';
  const bodyPath = type === 'boxy-suv'
    ? 'M42 120 V68 C42 60 48 56 58 56 H84 L96 34 H234 C248 34 256 42 260 60 L292 68 C302 70 306 78 306 92 V120 Z'
    : type === 'sport'
      ? 'M26 120 V94 C26 78 48 68 88 64 L132 44 H212 C240 44 264 58 286 72 L308 84 C316 90 318 102 314 120 Z'
      : 'M32 120 V86 C32 72 50 64 82 62 L120 40 H214 C240 40 262 52 280 68 L302 78 C310 82 314 92 314 104 V120 Z';
  const windowPath = type === 'boxy-suv'
    ? 'M100 42 H162 V66 H88 Z M172 42 H236 L246 66 H172 Z'
    : 'M118 48 H172 V70 H94 Z M182 48 H216 C234 48 248 56 258 70 H182 Z';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 156" role="img" aria-label="${brand.carModel}">
      <ellipse cx="172" cy="134" rx="126" ry="9" fill="#000" opacity="0.25"/>
      <path d="${bodyPath}" fill="${color}" stroke="#1E2430" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${windowPath}" fill="#475569" stroke="#1E2430" stroke-width="2" stroke-linejoin="round"/>
      <rect x="292" y="84" width="16" height="9" rx="4" fill="#FEF08A"/>
      <rect x="34" y="84" width="14" height="9" rx="3" fill="#EF4444"/>
      <circle cx="88" cy="122" r="21" fill="#141821" stroke="#CBD5E1" stroke-width="2.5"/>
      <circle cx="88" cy="122" r="9" fill="#94A3B8"/>
      <circle cx="252" cy="122" r="21" fill="#141821" stroke="#CBD5E1" stroke-width="2.5"/>
      <circle cx="252" cy="122" r="9" fill="#94A3B8"/>
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

// 记录仅有 1 张照片的新增品牌（防止换角度点到不存在的 _2.jpg）
const SINGLE_PHOTO_IDS = new Set([
  'aito', 'voyah', 'dongfeng', 'faw', 'baic', 'arcfox', 'jac', 'neta', 'maxus', 'foton', 'yutong', 'kinglong',
  'lamborghini', 'maserati', 'rollsroyce', 'bentley', 'astonmartin', 'mclaren', 'bugatti', 'jaguar', 'mini',
  'smart', 'jeep', 'chevrolet', 'lincoln', 'kia', 'peugeot', 'citroen', 'renault', 'skoda', 'subaru',
  'mitsubishi', 'suzuki', 'infiniti', 'acura', 'alfaromeo', 'fiat', 'lotus', 'polestar'
]);

export function hasSecondCarPhoto(brandId) {
  return !SINGLE_PHOTO_IDS.has(brandId);
}

export function getRealCarPhotoUrl(brandId, variantIdx = 1) {
  const key = PHOTO_KEY_MAP[brandId] || brandId;
  const idx = brandId === 'aito' ? 2 : (SINGLE_PHOTO_IDS.has(brandId) ? 1 : variantIdx);
  return `./assets/cars/${key}_${idx}.jpg`;
}

// 渲染真车展示盒（使用完整无裁切视角，保证车头车标不被截掉）
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
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#161B24;"
        onerror="this.remove()"
      />
      ${showCaption ? `<span class="car-caption">${brand.carModel}</span>` : ''}
    </div>
  `;
}
