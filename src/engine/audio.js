// 儿童友好中文语音播报 + Web Audio 合成音效引擎
// 针对 iPhone Safari / PWA 主屏幕模式深度优化：
// 1. 首次触屏同时解锁 AudioContext 与 speechSynthesis
// 2. 从后台切回/重开时自动 resume() 唤醒卡死的语音队列
// 3. 避免 cancel() 后同步 speak() 被 iOS 吞音，且持久引用当前 Utterance 防止 GC 中断播报

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.voiceEnabled = true;
    this.sfxEnabled = true;
    this._speechUnlocked = false;
    this._currentUtterance = null;
    this._speakTimer = null;
    this._speakSeq = 0;
    this._bindLifecycle();
  }

  _bindLifecycle() {
    if (typeof window === 'undefined') return;
    const wakeSpeech = () => {
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.resume();
        } catch {}
      }
    };
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) wakeSpeech();
    });
    window.addEventListener('pageshow', wakeSpeech);
    window.addEventListener('focus', wakeSpeech);
  }

  _pickZhVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    return (
      voices.find((v) => v.lang === 'zh-CN' && /tingting|meijia|sinji|xiaoxiao|yuna|google/i.test(v.name)) ||
      voices.find((v) => v.lang.toLowerCase() === 'zh-cn') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ||
      null
    );
  }

  configure({ voiceEnabled, sfxEnabled }) {
    if (typeof voiceEnabled === 'boolean') this.voiceEnabled = voiceEnabled;
    if (typeof sfxEnabled === 'boolean') this.sfxEnabled = sfxEnabled;
  }

  unlock() {
    // 1. 解锁 Web Audio
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    // 2. 同步预热并解锁 iOS Safari / PWA 的 speechSynthesis
    if (!this._speechUnlocked && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;
        synth.resume();
        const silent = new SpeechSynthesisUtterance('');
        silent.lang = 'zh-CN';
        silent.volume = 0;
        synth.speak(silent);
        this._speechUnlocked = true;
      } catch {}
    }
  }

  speak(text, { rate = 0.94, pitch = 1.06 } = {}) {
    if (!this.voiceEnabled || !text) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;
    const seq = ++this._speakSeq;
    if (this._speakTimer) {
      clearTimeout(this._speakTimer);
      this._speakTimer = null;
    }

    const doSpeak = () => {
      if (seq !== this._speakSeq) return;
      try {
        synth.resume();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = rate;
        u.pitch = pitch;
        const v = this._pickZhVoice();
        if (v) u.voice = v;

        // 持久引用防止 iOS Safari 垃圾回收提前掐断语音
        this._currentUtterance = u;
        u.onend = () => {
          if (this._currentUtterance === u) this._currentUtterance = null;
        };
        u.onerror = () => {
          if (this._currentUtterance === u) this._currentUtterance = null;
        };
        synth.speak(u);
      } catch {
        // ignore
      }
    };

    try {
      if (synth.speaking || synth.pending) {
        synth.cancel();
        // iOS WebKit 经典坑：cancel() 后必须留出短暂间隔再 speak()，否则新语音会被静默吞掉
        this._speakTimer = setTimeout(doSpeak, 65);
      } else {
        doSpeak();
      }
    } catch {
      doSpeak();
    }
  }

  stopSpeak() {
    this._speakSeq += 1;
    if (this._speakTimer) {
      clearTimeout(this._speakTimer);
      this._speakTimer = null;
    }
    this._currentUtterance = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
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

  paint() {
    // 可爱喷漆魔法音效
    this._tone(520, 0.08, 'sine', 0, 0.12);
    this._tone(740, 0.09, 'triangle', 0.06, 0.14);
    this._tone(980, 0.14, 'sine', 0.12, 0.13);
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
