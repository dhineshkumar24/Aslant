import { CONFIG } from './config.js';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.droneGain = null;
    this.droneOscillators = [];
    this.droneLfo = null;
    this.unlocked = false;
  }

  unlock() {
    if (this.unlocked) {
      if (this.ctx?.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = CONFIG.AUDIO.MASTER_VOLUME;
    this.masterGain.connect(this.ctx.destination);
    this.unlocked = true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startDrone() {
    if (!this.unlocked || !this.ctx) return;
    this.stopDrone();

    const { DRONE_VOLUME, DRONE_FILTER_HZ } = CONFIG.AUDIO;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = DRONE_FILTER_HZ;
    filter.Q.value = 0.7;

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0;
    this.droneGain.connect(filter);
    filter.connect(this.masterGain);

    const freqs = [55, 82.5, 110];
    this.droneOscillators = freqs.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const gain = this.ctx.createGain();
      gain.gain.value = i === 0 ? 0.5 : 0.28;
      osc.connect(gain);
      gain.connect(this.droneGain);
      osc.start();
      return { osc, gain };
    });

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 40;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.droneLfo = { lfo, lfoGain };

    const now = this.ctx.currentTime;
    this.droneGain.gain.setValueAtTime(0, now);
    this.droneGain.gain.linearRampToValueAtTime(DRONE_VOLUME, now + 2.5);
  }

  stopDrone() {
    if (!this.ctx || !this.droneGain) return;

    const now = this.ctx.currentTime;
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
    this.droneGain.gain.linearRampToValueAtTime(0, now + 0.6);

    const nodes = this.droneOscillators;
    const lfo = this.droneLfo;
    this.droneOscillators = [];
    this.droneLfo = null;

    setTimeout(() => {
      nodes.forEach(({ osc }) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Already stopped
        }
      });
      if (lfo) {
        try {
          lfo.lfo.stop();
          lfo.lfo.disconnect();
          lfo.lfoGain.disconnect();
        } catch {
          // Already stopped
        }
      }
    }, 700);
  }

  playHit() {
    if (!this.unlocked || !this.ctx) return;

    const now = this.ctx.currentTime;
    const { HIT_VOLUME, HIT_DURATION } = CONFIG.AUDIO;

    const hitGain = this.ctx.createGain();
    hitGain.gain.setValueAtTime(HIT_VOLUME, now);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + HIT_DURATION);
    hitGain.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + HIT_DURATION);
    osc.connect(hitGain);
    osc.start(now);
    osc.stop(now + HIT_DURATION + 0.05);

    const bufferSize = this.ctx.sampleRate * HIT_DURATION;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(HIT_VOLUME * 0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + HIT_DURATION);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + HIT_DURATION + 0.05);
  }
}

export const audio = new AudioManager();
