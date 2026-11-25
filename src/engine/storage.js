// 本地存储引擎：多孩独立档案、学习报告、错题记忆权重、家长设置、以及跨手机进度导出/导入

const STORAGE_KEY = 'car_logo_adventure_state_v1';

export const AVATARS = ['🚗', '🏎️', '🚙', '🚕', '🚌', '🚒', '🚓', '🚜', '🦖', '🐻'];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function createProfile(name = '小车手', avatar = '🚗') {
  return {
    id: 'p_' + Math.random().toString(36).slice(2, 8),
    name,
    avatar,
    stars: 0,
    coins: 30,
    unlockedLevel: 1,
    levelStars: {},
    brandStats: {}, // { [brandId]: { r: rightCount, w: wrongCount } }
    dailySeconds: {}, // { 'YYYY-MM-DD': seconds }
    garage: {
      ownedCars: ['wuling'],
      activeCar: 'wuling',
      ownedThemes: ['sunny'],
      activeTheme: 'sunny',
      ownedDecors: [],
      activeDecors: []
    }
  };
}

function createDefaultState() {
  const first = createProfile('小车手', '🚗');
  return {
    version: 1,
    activeProfileId: first.id,
    profiles: [first],
    settings: {
      voiceEnabled: true,
      sfxEnabled: true,
      scope: 'all', // 'all' | 'cn'
      mealModeEnabled: false,
      mealTriggerCount: 3, // 每答3题休息吃饭
      mealDurationSec: 60, // 每次休息60秒
      eyeRestMinutes: 15,  // 护眼提醒间隔
      dailyLimitMinutes: 30, // 每日时长上限（0表示不限制）
      lastBackupAt: Date.now()
    }
  };
}

class Store {
  constructor() {
    this.state = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
        return createDefaultState();
      }
      return {
        ...createDefaultState(),
        ...parsed,
        settings: { ...createDefaultState().settings, ...(parsed.settings || {}) }
      };
    } catch {
      return createDefaultState();
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Safari private browsing fallback
    }
    this.listeners.forEach((fn) => fn(this.state));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getActiveProfile() {
    return (
      this.state.profiles.find((p) => p.id === this.state.activeProfileId) ||
      this.state.profiles[0]
    );
  }

  setActiveProfile(id) {
    if (this.state.profiles.some((p) => p.id === id)) {
      this.state.activeProfileId = id;
      this.save();
    }
  }

  addProfile(name, avatar) {
    const p = createProfile(name.trim() || '宝宝', avatar || AVATARS[this.state.profiles.length % AVATARS.length]);
    this.state.profiles.push(p);
    this.state.activeProfileId = p.id;
    this.save();
    return p;
  }

  deleteProfile(id) {
    if (this.state.profiles.length <= 1) return false;
    this.state.profiles = this.state.profiles.filter((p) => p.id !== id);
    if (this.state.activeProfileId === id) {
      this.state.activeProfileId = this.state.profiles[0].id;
    }
    this.save();
    return true;
  }

  updateSettings(patch) {
    this.state.settings = { ...this.state.settings, ...patch };
    this.save();
  }

  recordAnswer(brandId, isCorrect) {
    const p = this.getActiveProfile();
    if (!p.brandStats[brandId]) p.brandStats[brandId] = { r: 0, w: 0 };
    if (isCorrect) {
      p.brandStats[brandId].r += 1;
      p.coins += 5;
    } else {
      p.brandStats[brandId].w += 1;
    }
    this.save();
  }

  completeLevel(levelId, starsEarned, rewardCoins) {
    const p = this.getActiveProfile();
    const prev = p.levelStars[levelId] || 0;
    if (starsEarned > prev) {
      p.stars += starsEarned - prev;
      p.levelStars[levelId] = starsEarned;
    }
    p.coins += rewardCoins;
    if (levelId >= p.unlockedLevel) {
      p.unlockedLevel = levelId + 1;
    }
    this.save();
  }

  resetActiveProgress() {
    const p = this.getActiveProfile();
    p.stars = 0;
    p.coins = 30;
    p.unlockedLevel = 1;
    p.levelStars = {};
    p.brandStats = {};
    this.save();
  }

  jumpToLevel(levelId) {
    const p = this.getActiveProfile();
    p.unlockedLevel = Math.max(p.unlockedLevel, levelId);
    this.save();
  }

  addPlaySeconds(sec) {
    const p = this.getActiveProfile();
    const key = todayKey();
    p.dailySeconds[key] = (p.dailySeconds[key] || 0) + sec;
    this.save();
  }

  getTodayMinutes() {
    const p = this.getActiveProfile();
    return Math.floor((p.dailySeconds[todayKey()] || 0) / 60);
  }

  // 获取需要重点复习的错题车标
  getMistakeBrandIds(limit = 4) {
    const p = this.getActiveProfile();
    return Object.entries(p.brandStats)
      .filter(([, s]) => s.w > 0 && s.w >= s.r)
      .sort((a, b) => (b[1].w - b[1].r) - (a[1].w - a[1].r))
      .slice(0, limit)
      .map(([id]) => id);
  }

  // 导出为紧凑跨设备迁移码
  exportCode() {
    const payload = JSON.stringify(this.state);
    const bytes = new TextEncoder().encode(payload);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    const b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    this.state.settings.lastBackupAt = Date.now();
    this.save();
    return 'CAR1:' + b64;
  }

  // 导入迁移码
  importCode(rawCode) {
    const cleaned = (rawCode || '').trim();
    if (!cleaned.startsWith('CAR1:')) {
      throw new Error('存档码格式不正确，请确认以 CAR1: 开头');
    }
    let b64 = cleaned.slice(5).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      throw new Error('存档内容无效');
    }
    this.state = {
      ...createDefaultState(),
      ...parsed,
      settings: { ...createDefaultState().settings, ...(parsed.settings || {}), lastBackupAt: Date.now() }
    };
    this.save();
    return this.state;
  }

  needsBackupReminder() {
    const days = (Date.now() - (this.state.settings.lastBackupAt || 0)) / (1000 * 60 * 60 * 24);
    return days >= 5;
  }
}

export const store = new Store();
