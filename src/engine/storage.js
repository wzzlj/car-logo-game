// 本地存储引擎：多孩独立档案、学习报告、错题记忆权重、家长设置、跨手机迁移
// 奖惩升级：用「10格能量灯 -> 1把金钥匙」替代几百上千的大数字车币，幼儿园小朋友一眼看懂，同时保持同等收集难度

const STORAGE_KEY = 'car_logo_adventure_state_v1';
export const ENERGY_PER_KEY = 10;

export const AVATARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function createProfile(name = '小车手', avatar = 'A') {
  return {
    id: 'p_' + Math.random().toString(36).slice(2, 8),
    name,
    avatar,
    stars: 0,
    keys: 0,     // 直观金钥匙数量（3~32 把即可解锁全部车库豪车）
    energy: 3,   // 当前充能格数（0~9，满 10 格自动合成 1 把金钥匙）
    coins: 0,    // 兼容旧字段
    unlockedLevel: 1,
    levelStars: {},
    learnedBrands: [],
    brandStats: {},
    dailySeconds: {},
    garage: {
      ownedCars: ['wuling'],
      activeCar: 'wuling',
      ownedThemes: ['sunny'],
      activeTheme: 'sunny',
      ownedDecors: [],
      activeDecors: [],
      carColors: {}
    }
  };
}

function migrateProfile(p) {
  const base = createProfile(p.name || '小车手', p.avatar || 'A');
  const merged = {
    ...base,
    ...p,
    garage: { ...base.garage, ...(p.garage || {}) }
  };
  // 将旧版大数字 coins 平滑折算为金钥匙 + 能量格（每 30 车币 = 1 把金钥匙，难度不降且不丢进度）
  if (typeof p.keys !== 'number' || typeof p.energy !== 'number') {
    const oldCoins = Number(p.coins || 0);
    merged.keys = Math.floor(oldCoins / 30);
    merged.energy = Math.min(ENERGY_PER_KEY - 1, Math.floor((oldCoins % 30) / 3));
  }
  if (!merged.garage.carColors) merged.garage.carColors = {};
  return merged;
}

function createDefaultState() {
  const first = createProfile('小车手', 'A');
  return {
    version: 2,
    activeProfileId: first.id,
    profiles: [first],
    settings: {
      voiceEnabled: true,
      sfxEnabled: true,
      scope: 'all', // 'all' (88个) | 'cn' (43个国产)
      mealModeEnabled: false,
      mealTriggerCount: 3,
      mealDurationSec: 60,
      eyeRestMinutes: 15,
      dailyLimitMinutes: 30,
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
        profiles: parsed.profiles.map(migrateProfile),
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

  // 给当前孩子增加能量格，满 10 格自动合成金钥匙，返回本步获得的钥匙数
  addEnergy(amount) {
    const p = this.getActiveProfile();
    const total = (p.energy || 0) + amount;
    const keysGained = Math.floor(total / ENERGY_PER_KEY);
    p.keys = (p.keys || 0) + keysGained;
    p.energy = total % ENERGY_PER_KEY;
    this.save();
    return { keysGained, energy: p.energy, keys: p.keys };
  }

  spendKeys(cost) {
    const p = this.getActiveProfile();
    if ((p.keys || 0) < cost) return false;
    p.keys -= cost;
    this.save();
    return true;
  }

  recordAnswer(brandId, isCorrect) {
    const p = this.getActiveProfile();
    if (!Array.isArray(p.learnedBrands)) p.learnedBrands = [];
    if (!p.learnedBrands.includes(brandId)) p.learnedBrands.push(brandId);
    if (!p.brandStats[brandId]) p.brandStats[brandId] = { r: 0, w: 0 };
    let res = { keysGained: 0, energy: p.energy, keys: p.keys };
    if (isCorrect) {
      p.brandStats[brandId].r += 1;
      res = this.addEnergy(1); // 每答对 1 题点亮 1 格能量灯
    } else {
      p.brandStats[brandId].w += 1;
      this.save();
    }
    return res;
  }

  markLearned(brandIds) {
    const p = this.getActiveProfile();
    if (!Array.isArray(p.learnedBrands)) p.learnedBrands = [];
    brandIds.forEach((id) => {
      if (!p.learnedBrands.includes(id)) p.learnedBrands.push(id);
    });
    this.save();
  }

  getLearnedBrandIds() {
    const p = this.getActiveProfile();
    const set = new Set(Array.isArray(p.learnedBrands) ? p.learnedBrands : []);
    Object.keys(p.brandStats || {}).forEach((id) => set.add(id));
    return [...set];
  }

  // 通关一局奖励星星 + 额外能量格（一般 3~6 格，Boss 极速快答 8 格）
  completeRound(starsEarned, bonusEnergy = 3) {
    const p = this.getActiveProfile();
    p.stars += starsEarned;
    return this.addEnergy(bonusEnergy);
  }

  resetActiveProgress() {
    const p = this.getActiveProfile();
    p.stars = 0;
    p.keys = 0;
    p.energy = 3;
    p.coins = 0;
    p.unlockedLevel = 1;
    p.levelStars = {};
    p.learnedBrands = [];
    p.brandStats = {};
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

  getMistakeBrandIds(limit = 6) {
    const p = this.getActiveProfile();
    return Object.entries(p.brandStats)
      .filter(([, s]) => s.w > 0 && s.w >= s.r)
      .sort((a, b) => (b[1].w - b[1].r) - (a[1].w - a[1].r))
      .slice(0, limit)
      .map(([id]) => id);
  }

  exportCode() {
    const recentKeys = (obj) => {
      const entries = Object.entries(obj || {}).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
      return Object.fromEntries(entries);
    };
    const compact = {
      a: this.state.activeProfileId,
      s: {
        v: this.state.settings.voiceEnabled ? 1 : 0,
        x: this.state.settings.sfxEnabled ? 1 : 0,
        c: this.state.settings.scope === 'cn' ? 1 : 0,
        m: this.state.settings.mealModeEnabled ? 1 : 0,
        mc: this.state.settings.mealTriggerCount,
        ms: this.state.settings.mealDurationSec,
        e: this.state.settings.eyeRestMinutes,
        d: this.state.settings.dailyLimitMinutes
      },
      p: this.state.profiles.map((p) => ({
        i: p.id,
        n: p.name,
        av: p.avatar,
        st: p.stars,
        ky: p.keys,
        en: p.energy,
        bs: p.brandStats,
        ds: recentKeys(p.dailySeconds),
        g: [
          p.garage.ownedCars,
          p.garage.activeCar,
          p.garage.ownedThemes,
          p.garage.activeTheme,
          p.garage.ownedDecors,
          p.garage.activeDecors,
          p.garage.carColors || {}
        ]
      }))
    };
    const payload = JSON.stringify(compact);
    const bytes = new TextEncoder().encode(payload);
    let binary = '';
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    const b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    this.state.settings.lastBackupAt = Date.now();
    this.save();
    return 'CAR2:' + b64;
  }

  importCode(rawCode) {
    const cleaned = (rawCode || '').trim();
    const isV2 = cleaned.startsWith('CAR2:');
    const isV1 = cleaned.startsWith('CAR1:');
    if (!isV1 && !isV2) {
      throw new Error('存档码格式不正确，请确认以 CAR2: 或 CAR1: 开头');
    }
    let b64 = cleaned.slice(5).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);

    if (isV2) {
      if (!parsed || !Array.isArray(parsed.p) || parsed.p.length === 0) {
        throw new Error('存档内容无效');
      }
      const s = parsed.s || {};
      this.state = {
        version: 2,
        activeProfileId: parsed.a || parsed.p[0].i,
        settings: {
          ...createDefaultState().settings,
          voiceEnabled: s.v !== 0,
          sfxEnabled: s.x !== 0,
          scope: s.c === 1 ? 'cn' : 'all',
          mealModeEnabled: s.m === 1,
          mealTriggerCount: s.mc || 3,
          mealDurationSec: s.ms || 60,
          eyeRestMinutes: s.e ?? 15,
          dailyLimitMinutes: s.d ?? 30,
          lastBackupAt: Date.now()
        },
        profiles: parsed.p.map((x) => migrateProfile({
          id: x.i,
          name: x.n || '小车手',
          avatar: x.av || 'A',
          stars: x.st || 0,
          keys: typeof x.ky === 'number' ? x.ky : undefined,
          energy: typeof x.en === 'number' ? x.en : undefined,
          coins: x.co || 0,
          brandStats: x.bs || {},
          dailySeconds: x.ds || {},
          garage: {
            ownedCars: (x.g && x.g[0]) || ['wuling'],
            activeCar: (x.g && x.g[1]) || 'wuling',
            ownedThemes: (x.g && x.g[2]) || ['sunny'],
            activeTheme: (x.g && x.g[3]) || 'sunny',
            ownedDecors: (x.g && x.g[4]) || [],
            activeDecors: (x.g && x.g[5]) || [],
            carColors: (x.g && x.g[6]) || {}
          }
        }))
      };
    } else {
      if (!parsed || !Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
        throw new Error('存档内容无效');
      }
      this.state = {
        ...createDefaultState(),
        ...parsed,
        profiles: parsed.profiles.map(migrateProfile),
        settings: { ...createDefaultState().settings, ...(parsed.settings || {}), lastBackupAt: Date.now() }
      };
    }
    this.save();
    return this.state;
  }

  needsBackupReminder() {
    const days = (Date.now() - (this.state.settings.lastBackupAt || 0)) / (1000 * 60 * 60 * 24);
    return days >= 5;
  }
}

export const store = new Store();
