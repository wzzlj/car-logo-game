// 车库养成系统：直观金钥匙解锁 + 4套精致插画级场景背景 + 6套可视化实景赛道装备（均含商店精绘图标与车库实景摆放效果）

export const GARAGE_CARS = [
  { id: 'wuling', name: '五菱宏光萌萌车', costKeys: 0, desc: '方方正正双门小电车，送给小小车手的第一辆车！' },
  { id: 'xiaomi', name: '小米 SU7 疾风号', costKeys: 4, desc: '流线型轿跑，标志性水滴大灯和运动溜背！' },
  { id: 'byd', name: '比亚迪 汉 龙颜轿跑', costKeys: 6, desc: '低趴运动轿跑，帅气龙颜前脸和贯穿尾灯！' },
  { id: 'tank', name: '坦克 300 越野王', costKeys: 8, desc: '复古圆眼大灯、方盒子车身和背挂小书包备胎！' },
  { id: 'bmw', name: '宝马 运动轿跑', costKeys: 10, desc: '经典双肾格栅、天使眼大灯和霍氏拐角车窗！' },
  { id: 'hongqi', name: '红旗 H9 礼宾车', costKeys: 12, desc: '大气直瀑前脸、红色中轴旗标和双色豪华车身！' },
  { id: 'tesla', name: '特斯拉 未来电车', costKeys: 15, desc: '极简无格栅封闭前脸、大玻璃全景天幕！' },
  { id: 'mercedes', name: '奔驰 大G 越野王', costKeys: 18, desc: '经典方盒子硬派越野、圆形大灯和外挂圆备胎！' },
  { id: 'yangwang', name: '仰望 U8 超级越野', costKeys: 22, desc: '霸气大尺寸硬派方盒、八边形书包备胎和梯形轮眉！' },
  { id: 'porsche', name: '保时捷 911 蛙眼跑车', costKeys: 26, desc: '标志性青蛙圆眼睛、大溜背曲线和动感尾翼！' },
  { id: 'ferrari', name: '法拉利 红色闪电', costKeys: 32, desc: '超低趴楔形超跑车身、侧进气风道和碳纤扩散器！' }
];

export const GARAGE_THEMES = [
  { id: 'sunny', name: '阳光落地窗展厅', costKeys: 0 },
  { id: 'racing', name: '冠军赛道维修站', costKeys: 5 },
  { id: 'forest', name: '山野日落露营地', costKeys: 8 },
  { id: 'space', name: '星际太空车库', costKeys: 12 }
];

export const GARAGE_DECORS = [
  { id: 'flags', name: '冠军格子旗', costKeys: 3 },
  { id: 'cone', name: '赛道安全桩', costKeys: 4 },
  { id: 'trophy', name: '金色冠军杯', costKeys: 5 },
  { id: 'wash', name: '泡泡洗车机', costKeys: 6 },
  { id: 'lift', name: '红色举升机', costKeys: 7 },
  { id: 'podium', name: '舞台聚光灯', costKeys: 9 }
];

// 4 套高精致度建筑/场景级车库背景 SVG（同时用于车库大舞台与商店缩略图）
export function renderThemeBackdropSVG(themeId) {
  const uid = `th_${themeId}_${Math.random().toString(36).slice(2, 6)}`;

  if (themeId === 'racing') {
    // 冠军赛道维修站（F1/GT Pit-Stop）
    return `
      <svg class="theme-scene-svg" viewBox="0 0 380 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="${uid}_wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E2430"/>
            <stop offset="100%" stop-color="#2D3546"/>
          </linearGradient>
          <linearGradient id="${uid}_floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2A303C"/>
            <stop offset="100%" stop-color="#171B24"/>
          </linearGradient>
          <linearGradient id="${uid}_glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Back wall -->
        <rect width="380" height="152" fill="url(#${uid}_wall)"/>
        <!-- Architectural steel ceiling trusses -->
        <rect x="0" y="0" width="380" height="24" fill="#141821"/>
        <path d="M0 24 L30 0 L60 24 L90 0 L120 24 L150 0 L180 24 L210 0 L240 24 L270 0 L300 24 L330 0 L360 24 L380 8" stroke="#333C4F" stroke-width="2" fill="none"/>
        <!-- Overhead LED Pit Light Bars -->
        <rect x="38" y="22" width="84" height="5" rx="2.5" fill="#F8FAFC"/>
        <rect x="148" y="22" width="84" height="5" rx="2.5" fill="#F8FAFC"/>
        <rect x="258" y="22" width="84" height="5" rx="2.5" fill="#F8FAFC"/>
        <polygon points="38,27 122,27 148,140 12,140" fill="url(#${uid}_glow)"/>
        <polygon points="148,27 232,27 256,140 124,140" fill="url(#${uid}_glow)"/>
        <polygon points="258,27 342,27 368,140 232,140" fill="url(#${uid}_glow)"/>
        <!-- Racing Wall Stripes & Pit Board -->
        <rect x="0" y="106" width="380" height="8" fill="#FF4F17"/>
        <rect x="0" y="114" width="380" height="4" fill="#F8FAFC" opacity="0.85"/>
        <!-- Track Window looking out at kerb -->
        <rect x="112" y="42" width="156" height="54" rx="8" fill="#0F172A" stroke="#475569" stroke-width="2"/>
        <rect x="116" y="46" width="148" height="28" rx="4" fill="#38BDF8" opacity="0.25"/>
        <!-- Red/White Racing Kerbs -->
        <g transform="translate(116,76)">
          <rect x="0" y="0" width="22" height="14" fill="#EF4444"/><rect x="22" y="0" width="22" height="14" fill="#F8FAFC"/>
          <rect x="44" y="0" width="22" height="14" fill="#EF4444"/><rect x="66" y="0" width="22" height="14" fill="#F8FAFC"/>
          <rect x="88" y="0" width="22" height="14" fill="#EF4444"/><rect x="110" y="0" width="22" height="14" fill="#F8FAFC"/>
          <rect x="132" y="0" width="16" height="14" fill="#EF4444"/>
        </g>
        <!-- Pit Signal Lights -->
        <rect x="302" y="46" width="44" height="22" rx="6" fill="#111827" stroke="#475569" stroke-width="1.5"/>
        <circle cx="314" cy="57" r="4.5" fill="#EF4444"/><circle cx="324" cy="57" r="4.5" fill="#F59E0B"/><circle cx="334" cy="57" r="4.5" fill="#22C55E"/>
        <!-- Stacked Racing Tires on Left -->
        <rect x="22" y="128" width="44" height="12" rx="4" fill="#111827" stroke="#475569" stroke-width="1.5"/>
        <rect x="24" y="115" width="40" height="12" rx="4" fill="#111827" stroke="#475569" stroke-width="1.5"/>
        <rect x="26" y="102" width="36" height="12" rx="4" fill="#111827" stroke="#475569" stroke-width="1.5"/>
        <!-- Pit Bay Floor -->
        <rect y="150" width="380" height="80" fill="url(#${uid}_floor)"/>
        <line x1="0" y1="150" x2="380" y2="150" stroke="#64748B" stroke-width="2"/>
        <!-- Pit Box Painted Lines -->
        <path d="M52 230 L96 156 H284 L328 230" fill="none" stroke="#F8FAFC" stroke-width="2.5" opacity="0.35" stroke-dasharray="12 8"/>
      </svg>
    `;
  }

  if (themeId === 'forest') {
    // 山野日落露营地（Golden Hour Alpine Camp）
    return `
      <svg class="theme-scene-svg" viewBox="0 0 380 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="${uid}_sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3B82F6"/>
            <stop offset="52%" stop-color="#93C5FD"/>
            <stop offset="85%" stop-color="#FDE68A"/>
            <stop offset="100%" stop-color="#FDBA74"/>
          </linearGradient>
          <linearGradient id="${uid}_ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#84A98C"/>
            <stop offset="30%" stop-color="#52796F"/>
            <stop offset="100%" stop-color="#2F3E46"/>
          </linearGradient>
        </defs>
        <!-- Sunset Sky -->
        <rect width="380" height="156" fill="url(#${uid}_sky)"/>
        <!-- Warm Sun -->
        <circle cx="292" cy="64" r="24" fill="#FEF08A" opacity="0.92"/>
        <circle cx="292" cy="64" r="38" fill="#FEF08A" opacity="0.25"/>
        <!-- Soft Clouds -->
        <path d="M46 46 Q56 34 72 38 Q84 30 98 40 Q108 42 104 52 H44 Q38 48 46 46 Z" fill="#FFFFFF" opacity="0.82"/>
        <path d="M186 38 Q196 28 210 32 Q220 26 232 34 Q240 36 236 44 H184 Z" fill="#FFFFFF" opacity="0.72"/>
        <!-- Distant Layered Mountains -->
        <path d="M0 150 L68 82 L138 128 L216 72 L300 132 L352 94 L380 120 V156 H0 Z" fill="#64748B" opacity="0.55"/>
        <path d="M0 156 L54 108 L118 140 L186 98 L264 142 L338 106 L380 134 V156 H0 Z" fill="#3B5B53"/>
        <!-- Pine Trees -->
        <g fill="#1F4037">
          <polygon points="28,154 44,104 60,154"/><polygon points="50,154 64,114 78,154"/>
          <polygon points="316,154 334,102 352,154"/><polygon points="342,154 358,116 374,154"/>
        </g>
        <!-- Cozy A-Frame Camping Tent with Glowing Lantern -->
        <polygon points="244,154 276,108 308,154" fill="#EA580C" stroke="#7C2D12" stroke-width="2"/>
        <polygon points="264,154 276,126 288,154" fill="#FEF08A"/>
        <!-- Camp String Lights -->
        <path d="M0 24 Q190 54 380 24" stroke="#475569" stroke-width="1.5" fill="none"/>
        <g fill="#FEF08A">
          <circle cx="54" cy="31" r="3.2"/><circle cx="118" cy="37" r="3.2"/><circle cx="190" cy="39" r="3.2"/><circle cx="262" cy="37" r="3.2"/><circle cx="326" cy="31" r="3.2"/>
        </g>
        <!-- Meadow & Timber Camp Deck -->
        <rect y="152" width="380" height="78" fill="url(#${uid}_ground)"/>
        <path d="M24 230 L76 164 H304 L356 230 Z" fill="#CBD5E1" opacity="0.22"/>
      </svg>
    `;
  }

  if (themeId === 'space') {
    // 星际太空车库（Orbital Hangar）
    return `
      <svg class="theme-scene-svg" viewBox="0 0 380 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="${uid}_cosmos" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0B1026"/>
            <stop offset="55%" stop-color="#1E1B4B"/>
            <stop offset="100%" stop-color="#312E81"/>
          </linearGradient>
          <linearGradient id="${uid}_deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <!-- Outer Space Viewport -->
        <rect width="380" height="156" fill="url(#${uid}_cosmos)"/>
        <!-- Stars -->
        <g fill="#FFFFFF" opacity="0.85">
          <circle cx="42" cy="34" r="1.4"/><circle cx="88" cy="62" r="1.8"/><circle cx="134" cy="28" r="1.2"/>
          <circle cx="212" cy="40" r="1.6"/><circle cx="316" cy="36" r="1.8"/><circle cx="348" cy="74" r="1.3"/>
          <circle cx="164" cy="78" r="1.2"/><circle cx="256" cy="86" r="1.5"/>
        </g>
        <!-- Glowing Ringed Planet -->
        <circle cx="278" cy="68" r="26" fill="#F97316"/>
        <path d="M254 64 Q278 52 302 64" fill="none" stroke="#FDBA74" stroke-width="4" opacity="0.6"/>
        <ellipse cx="278" cy="70" rx="48" ry="11" transform="rotate(-16 278 70)" fill="none" stroke="#38BDF8" stroke-width="3.5" opacity="0.85"/>
        <!-- Small Blue Moon -->
        <circle cx="96" cy="52" r="11" fill="#38BDF8" opacity="0.8"/>
        <!-- Sci-Fi Hexagonal Hangar Bulkhead Frame -->
        <path d="M0 0 H380 V154 H336 L306 24 H74 L44 154 H0 Z" fill="#1A2030" opacity="0.92"/>
        <path d="M44 154 L74 24 H306 L336 154" fill="none" stroke="#38BDF8" stroke-width="2" opacity="0.65"/>
        <!-- Glowing Hangar Deck -->
        <rect y="152" width="380" height="78" fill="url(#${uid}_deck)"/>
        <line x1="0" y1="152" x2="380" y2="152" stroke="#38BDF8" stroke-width="2.5" opacity="0.8"/>
        <!-- Neon Docking Runway Strips -->
        <line x1="94" y1="158" x2="48" y2="230" stroke="#38BDF8" stroke-width="3" opacity="0.55"/>
        <line x1="286" y1="158" x2="332" y2="230" stroke="#38BDF8" stroke-width="3" opacity="0.55"/>
        <line x1="120" y1="196" x2="260" y2="196" stroke="#FF4F17" stroke-width="3" stroke-dasharray="14 10" opacity="0.8"/>
      </svg>
    `;
  }

  // 默认：sunny（阳光落地窗展厅 — Bright Architectural Showroom）
  return `
    <svg class="theme-scene-svg" viewBox="0 0 380 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${uid}_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#60A5FA"/>
          <stop offset="65%" stop-color="#BAE6FD"/>
          <stop offset="100%" stop-color="#FEF9C3"/>
        </linearGradient>
        <linearGradient id="${uid}_floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
        <linearGradient id="${uid}_sunbeam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Showroom Wall -->
      <rect width="380" height="154" fill="#F1F5F9"/>
      <!-- Panoramic Glass Window -->
      <rect x="28" y="22" width="324" height="114" rx="10" fill="url(#${uid}_sky)" stroke="#334155" stroke-width="3"/>
      <!-- Sun & Clouds Outside -->
      <circle cx="304" cy="50" r="16" fill="#FDE047"/>
      <path d="M64 56 Q74 44 90 48 Q102 42 114 52 H60 Z" fill="#FFFFFF" opacity="0.9"/>
      <path d="M188 48 Q198 38 212 42 Q222 36 232 46 H186 Z" fill="#FFFFFF" opacity="0.8"/>
      <!-- Rolling Green Hills Outside -->
      <path d="M30 134 Q108 92 196 122 Q284 94 350 124 V134 Z" fill="#86EFAC"/>
      <path d="M30 134 Q138 108 242 130 Q306 112 350 134 Z" fill="#4ADE80"/>
      <!-- Window Mullions -->
      <line x1="136" y1="22" x2="136" y2="136" stroke="#334155" stroke-width="3"/>
      <line x1="244" y1="22" x2="244" y2="136" stroke="#334155" stroke-width="3"/>
      <!-- Warm Sunbeam -->
      <polygon points="244,24 350,24 250,220 130,220" fill="url(#${uid}_sunbeam)"/>
      <!-- Potted Plant in Showroom Corner -->
      <rect x="18" y="128" width="22" height="22" rx="4" fill="#D97706" stroke="#78350F" stroke-width="1.5"/>
      <ellipse cx="29" cy="116" rx="14" ry="15" fill="#16A34A"/>
      <ellipse cx="22" cy="110" rx="8" ry="10" fill="#22C55E"/>
      <!-- Polished Perspective Showroom Floor -->
      <rect y="152" width="380" height="78" fill="url(#${uid}_floor)"/>
      <line x1="0" y1="152" x2="380" y2="152" stroke="#64748B" stroke-width="2"/>
      <g stroke="#FFFFFF" stroke-width="1.5" opacity="0.4">
        <line x1="95" y1="152" x2="30" y2="230"/>
        <line x1="190" y1="152" x2="190" y2="230"/>
        <line x1="285" y1="152" x2="350" y2="230"/>
        <line x1="0" y1="184" x2="380" y2="184"/>
      </g>
    </svg>
  `;
}

// 6 款赛道装备的商店精绘彩色 SVG 图标（彻底替换黑底英文字母！）
export function renderDecorIconSVG(decorId) {
  switch (decorId) {
    case 'flags':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FFF7ED"/>
          <!-- Flag Poles -->
          <line x1="16" y1="52" x2="26" y2="14" stroke="#B45309" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="48" y1="52" x2="38" y2="14" stroke="#B45309" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Left Checkered Flag -->
          <g transform="rotate(-14 26 20)">
            <rect x="24" y="14" width="22" height="16" rx="2" fill="#FFFFFF" stroke="#1E293B" stroke-width="2"/>
            <rect x="25" y="15" width="7" height="7" fill="#1E293B"/><rect x="39" y="15" width="6" height="7" fill="#1E293B"/>
            <rect x="32" y="22" width="7" height="7" fill="#1E293B"/>
          </g>
          <!-- Right Red Flag -->
          <g transform="rotate(14 38 20)">
            <rect x="18" y="16" width="22" height="16" rx="2" fill="#FF4F17" stroke="#9A3412" stroke-width="2"/>
            <polygon points="29,20 31,24 35,24 32,26 33,30 29,28 25,30 26,26 23,24 27,24" fill="#FEF08A"/>
          </g>
        </svg>
      `;
    case 'cone':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEF2F2"/>
          <ellipse cx="32" cy="52" rx="20" ry="5" fill="#CBD5E1"/>
          <rect x="14" y="46" width="36" height="7" rx="3" fill="#EA580C" stroke="#7C2D12" stroke-width="2"/>
          <polygon points="20,46 29,14 35,14 44,46" fill="#FF4F17" stroke="#7C2D12" stroke-width="2" stroke-linejoin="round"/>
          <polygon points="25.5,27 38.5,27 40.5,34 23.5,34" fill="#FFFFFF"/>
          <polygon points="27.5,20 36.5,20 37.5,24 26.5,24" fill="#FFFFFF"/>
        </svg>
      `;
    case 'trophy':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#FEFCE8"/>
          <path d="M18 16 H11 C11 26 15 30 21 30" fill="none" stroke="#D97706" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M46 16 H53 C53 26 49 30 43 30" fill="none" stroke="#D97706" stroke-width="3.5" stroke-linecap="round"/>
          <path d="M18 14 H46 V26 C46 35 40 40 32 40 C24 40 18 35 18 26 Z" fill="#FACC15" stroke="#B45309" stroke-width="2.2"/>
          <rect x="29" y="40" width="6" height="9" fill="#D97706"/>
          <rect x="20" y="48" width="24" height="6" rx="2.5" fill="#1E293B"/>
          <polygon points="32,19 34,24 39,24 35,27 36.5,32 32,29 27.5,32 29,27 25,24 30,24" fill="#FFFFFF"/>
        </svg>
      `;
    case 'wash':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#EFF6FF"/>
          <!-- Wash Arch -->
          <path d="M12 52 V22 C12 15 17 12 24 12 H40 C47 12 52 15 52 22 V52" fill="none" stroke="#2563EB" stroke-width="6" stroke-linecap="round"/>
          <!-- Foam Bubbles -->
          <circle cx="24" cy="28" r="6" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
          <circle cx="34" cy="24" r="7" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
          <circle cx="42" cy="30" r="5" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
          <circle cx="28" cy="39" r="5" fill="#BAE6FD" stroke="#38BDF8" stroke-width="1.8"/>
          <circle cx="39" cy="42" r="6" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
        </svg>
      `;
    case 'lift':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#F1F5F9"/>
          <!-- Twin Red Hydraulic Posts -->
          <rect x="13" y="12" width="8" height="40" rx="2" fill="#DC2626" stroke="#7F1D1D" stroke-width="1.8"/>
          <rect x="43" y="12" width="8" height="40" rx="2" fill="#DC2626" stroke="#7F1D1D" stroke-width="1.8"/>
          <rect x="10" y="10" width="44" height="5" rx="2" fill="#334155"/>
          <!-- Lift Arms -->
          <rect x="18" y="34" width="28" height="6" rx="2" fill="#F59E0B" stroke="#78350F" stroke-width="1.6"/>
          <rect x="10" y="50" width="14" height="4" rx="1.5" fill="#1E293B"/>
          <rect x="40" y="50" width="14" height="4" rx="1.5" fill="#1E293B"/>
        </svg>
      `;
    case 'podium':
      return `
        <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#1E2430"/>
          <!-- Spotlight Beams -->
          <polygon points="18,16 32,54 10,54" fill="#FEF08A" opacity="0.32"/>
          <polygon points="46,16 54,54 32,54" fill="#38BDF8" opacity="0.32"/>
          <!-- Overhead Lamp Housings -->
          <rect x="13" y="10" width="10" height="8" rx="3" fill="#F8FAFC"/>
          <rect x="41" y="10" width="10" height="8" rx="3" fill="#F8FAFC"/>
          <circle cx="18" cy="18" r="3" fill="#FACC15"/>
          <circle cx="46" cy="18" r="3" fill="#38BDF8"/>
          <ellipse cx="32" cy="52" rx="20" ry="4" fill="#FACC15" opacity="0.5"/>
        </svg>
      `;
    default:
      return '';
  }
}

// 将已装备的赛道装备真实摆放到车库舞台场景里（SVG 叠加层）
export function renderSceneDecorsSVG(activeDecorIds = []) {
  if (!activeDecorIds || activeDecorIds.length === 0) return '';
  const parts = [];

  if (activeDecorIds.includes('podium')) {
    parts.push(`
      <polygon points="88,0 185,220 20,220" fill="#FEF08A" opacity="0.18"/>
      <polygon points="292,0 360,220 195,220" fill="#38BDF8" opacity="0.16"/>
      <rect x="78" y="0" width="20" height="10" rx="3" fill="#1E293B"/><circle cx="88" cy="10" r="4" fill="#FACC15"/>
      <rect x="282" y="0" width="20" height="10" rx="3" fill="#1E293B"/><circle cx="292" cy="10" r="4" fill="#38BDF8"/>
    `);
  }
  if (activeDecorIds.includes('flags')) {
    parts.push(`
      <path d="M0 14 Q190 42 380 14" stroke="#1E293B" stroke-width="2" fill="none"/>
      <polygon points="36,20 52,22 44,36" fill="#FF4F17"/>
      <polygon points="86,25 102,26 94,40" fill="#FACC15"/>
      <polygon points="138,28 154,28 146,42" fill="#1E293B"/>
      <polygon points="226,28 242,28 234,42" fill="#FFFFFF" stroke="#1E293B" stroke-width="1"/>
      <polygon points="278,25 294,26 286,40" fill="#FF4F17"/>
      <polygon points="328,20 344,22 336,36" fill="#FACC15"/>
    `);
  }
  if (activeDecorIds.includes('lift')) {
    parts.push(`
      <rect x="38" y="56" width="12" height="130" rx="3" fill="#DC2626" stroke="#7F1D1D" stroke-width="2"/>
      <rect x="330" y="56" width="12" height="130" rx="3" fill="#DC2626" stroke="#7F1D1D" stroke-width="2"/>
      <rect x="34" y="182" width="20" height="6" rx="2" fill="#1E293B"/>
      <rect x="326" y="182" width="20" height="6" rx="2" fill="#1E293B"/>
    `);
  }
  if (activeDecorIds.includes('wash')) {
    parts.push(`
      <g opacity="0.9">
        <circle cx="72" cy="86" r="8" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
        <circle cx="88" cy="70" r="5" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
        <circle cx="302" cy="82" r="9" fill="#FFFFFF" stroke="#60A5FA" stroke-width="2"/>
        <circle cx="286" cy="64" r="6" fill="#E0F2FE" stroke="#38BDF8" stroke-width="1.5"/>
        <circle cx="318" cy="102" r="5" fill="#FFFFFF" stroke="#60A5FA" stroke-width="1.5"/>
      </g>
    `);
  }
  if (activeDecorIds.includes('trophy')) {
    parts.push(`
      <g transform="translate(22,146)">
        <rect x="4" y="34" width="24" height="14" rx="3" fill="#1E293B"/>
        <path d="M8 12 H24 V20 C24 25 20 28 16 28 C12 28 8 25 8 20 Z" fill="#FACC15" stroke="#B45309" stroke-width="1.8"/>
        <rect x="14" y="28" width="4" height="6" fill="#D97706"/>
      </g>
    `);
  }
  if (activeDecorIds.includes('cone')) {
    parts.push(`
      <g transform="translate(332,164)">
        <rect x="0" y="24" width="24" height="5" rx="2" fill="#EA580C"/>
        <polygon points="4,24 10,2 14,2 20,24" fill="#FF4F17" stroke="#7C2D12" stroke-width="1.5"/>
        <polygon points="7,14 17,14 18,18 6,18" fill="#FFFFFF"/>
      </g>
    `);
  }

  return `
    <svg class="theme-decors-svg" viewBox="0 0 380 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      ${parts.join('')}
    </svg>
  `;
}
