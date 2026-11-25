// 儿童友好中文语音播报 + Web Audio 合成音效引擎（零外部音频依赖，完美适配 iPhone Safari）

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.sfxEnabled = true;
    this.zhVoice = null;
    this._initVoices();
  }

  _initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      this.zhVoice =
        voices.find((v) => v.lang === 'zh-CN' && /tingting|meijia|sinji|xiaoxiao|google/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('zh-cn')) ||
        voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ||
        null;
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
  }

  configure({ voiceEnabled, sfxEnabled }) {
    if (typeof voiceEnabled === 'boolean') this.voiceEnabled = voiceEnabled;
    if (typeof sfxEnabled === 'boolean') this.sfxEnabled = sfxEnabled;
  }

  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  speak(text, { rate = 0.94, pitch = 1.08 } = {}) {
    if (!this.voiceEnabled || !text) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = rate;
      u.pitch = pitch;
      if (this.zhVoice) u.voice = this.zhVoice;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore speech errors on restricted devices
    }
  }

  stopSpeak() {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
  }

  _tone(freq, duration, type = 'sine', startOffset = 0, gainVal = 0.16) {
    if (!this.sfxEnabled) return;
    this.unlock();
    if (!this.ctx) return;
    const now = this.ctx.currentTime + startOffset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  click() {
    this._tone(580, 0.07, 'triangle', 0, 0.12);
  }

  flip() {
    this._tone(420, 0.08, 'sine', 0, 0.1);
    this._tone(640, 0.08, 'sine', 0.05, 0.1);
  }

  correct() {
    this._tone(523.25, 0.12, 'triangle', 0, 0.18);
    this._tone(659.25, 0.12, 'triangle', 0.1, 0.18);
    this._tone(783.99, 0.22, 'triangle', 0.2, 0.2);
  }

  wrong() {
    this._tone(260, 0.16, 'sine', 0, 0.14);
    this._tone(210, 0.22, 'sine', 0.14, 0.14);
  }

  honk() {
    // 可爱汽车双音喇叭“嘀嘀！”
    this._tone(440, 0.14, 'sawtooth', 0, 0.09);
    this._tone(554, 0.14, 'sawtooth', 0, 0.08);
    this._tone(440, 0.18, 'sawtooth', 0.18, 0.09);
    this._tone(554, 0.18, 'sawtooth', 0.18, 0.08);
  }

  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => this._tone(n, 0.22, 'triangle', i * 0.11, 0.18));
  }

  mealBell() {
    this._tone(880, 0.25, 'sine', 0, 0.16);
    this._tone(659.25, 0.35, 'sine', 0.22, 0.16);
  }
}

export const audio = new AudioEngine();

export const PRAISES = [
  '太棒啦！你真聪明！',
  '答对啦！给你一颗大星星！',
  '哇塞，小车神就是你！',
  '好厉害呀，一眼就认出来啦！',
  '真棒！继续加油哦！'
];

export const ENCOURAGES = [
  '没关系，再仔细看看哦！',
  '差点就对啦，再试一次吧！',
  '加油加油，你可以的！'
];

export function randomPraise() {
  return PRAISES[Math.floor(Math.random() * PRAISES.length)];
}

export function randomEncourage() {
  return ENCOURAGES[Math.floor(Math.random() * ENCOURAGES.length)];
}
