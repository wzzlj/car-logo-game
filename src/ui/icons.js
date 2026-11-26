// Direction A (Mini Cockpit) 统一汽车机械风内联 SVG 图标库（全场零系统 Emoji 图标）

const S = (body, size = 18, extra = '') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;

export const ICONS = {
  steering: (sz = 20) => S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M4.5 16l5.5-3M19.5 16l-5.5-3"/>', sz),
  garage: (sz = 20) => S('<path d="M3 10.5L12 4l9 6.5V20H3v-9.5z"/><path d="M7 20v-7h10v7"/><path d="M7 16h10"/>', sz),
  book: (sz = 20) => S('<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h5"/>', sz),
  star: (sz = 16) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1z"/></svg>`,
  key: (sz = 16) => S('<circle cx="7.5" cy="12" r="4.5"/><path d="M12 12h9M17 12v3M20 12v2"/>', sz),
  keySolid: (sz = 16) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 6.5a5.5 5.5 0 1 0 5.15 7.4h3.35v2.6h2.4v-2.6H21v2h2v-4.8H12.65A5.5 5.5 0 0 0 7.5 6.5zm0 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>`,
  lock: (sz = 16) => S('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', sz),
  back: (sz = 18) => S('<path d="M15 18l-6-6 6-6"/>', sz),
  close: (sz = 18) => S('<path d="M18 6L6 18M6 6l12 12"/>', sz),
  search: (sz = 18) => S('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/><path d="M11 8v6M8 11h6"/>', sz),
  zoomOut: (sz = 18) => S('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/><path d="M8 11h6"/>', sz),
  speaker: (sz = 18) => S('<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.8 5.8a9 9 0 0 1 0 12.4"/>', sz),
  cards: (sz = 18) => S('<rect x="3" y="4" width="11" height="15" rx="2"/><path d="M14 8h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8"/>', sz),
  puzzle: (sz = 18) => S('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>', sz),
  bolt: (sz = 18) => S('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', sz),
  repeat: (sz = 18) => S('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', sz),
  power: (sz = 18) => S('<path d="M12 3v8"/><path d="M6.8 6.8a8 8 0 1 0 10.4 0"/>', sz),
  camera: (sz = 16) => S('<path d="M4 7h3l2-2h6l2 2h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 7z"/><circle cx="12" cy="13" r="3.5"/>', sz),
  paint: (sz = 16) => S('<path d="M18 3l3 3-9 9-4 1 1-4 9-9z"/><path d="M5 19c1.5-1 3.5-1 5 0"/>', sz),
  check: (sz = 16) => S('<path d="M20 6L9 17l-5-5"/>', sz),
  trophy: (sz = 28) => S('<path d="M6 4h12v5a6 6 0 0 1-12 0V4z"/><path d="M6 6H3v2a3 3 0 0 0 3 3"/><path d="M18 6h3v2a3 3 0 0 1-3 3"/><path d="M12 15v5M8 20h8"/>', sz),
  timer: (sz = 16) => S('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>', sz),
  eye: (sz = 28) => S('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', sz),
  meal: (sz = 28) => S('<path d="M4 13h16a8 8 0 0 1-16 0z"/><path d="M7 9c0-2 1-3 2-4M12 9c0-2 1-3 2-4M17 9c0-2 1-3 2-4"/>', sz),
  rotate: (sz = 16) => S('<path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>', sz),
  plus: (sz = 16) => S('<path d="M12 5v14M5 12h14"/>', sz),
  user: (sz = 18) => S('<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>', sz),
  sparkle: (sz = 16) => S('<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/>', sz),
  info: (sz = 16) => S('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', sz)
};
