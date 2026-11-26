export type SoundKind = 'click' | 'submit' | 'preset' | 'toggle' | 'export';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

const SOUND_PROFILES: Record<
  SoundKind,
  { freq: number; endFreq: number; duration: number; type: OscillatorType; gain: number }
> = {
  click: { freq: 520, endFreq: 380, duration: 0.045, type: 'sine', gain: 0.05 },
  submit: { freq: 440, endFreq: 660, duration: 0.09, type: 'triangle', gain: 0.06 },
  preset: { freq: 580, endFreq: 740, duration: 0.06, type: 'sine', gain: 0.05 },
  toggle: { freq: 620, endFreq: 480, duration: 0.04, type: 'sine', gain: 0.04 },
  export: { freq: 500, endFreq: 820, duration: 0.1, type: 'triangle', gain: 0.05 },
};

export function playButtonSound(kind: SoundKind = 'click'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const profile = SOUND_PROFILES[kind];
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = profile.type;
  osc.frequency.setValueAtTime(profile.freq, now);
  osc.frequency.exponentialRampToValueAtTime(profile.endFreq, now + profile.duration);

  gainNode.gain.setValueAtTime(profile.gain, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + profile.duration);
}

let lastMoneySoundAt = 0;

export function playMoneySound(): void {
  const nowMs = Date.now();
  if (nowMs - lastMoneySoundAt < 120) return;
  lastMoneySoundAt = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [1318.5, 1760];
  notes.forEach((freq, idx) => {
    const start = now + idx * 0.035;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.04, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.07);
  });
}

export function classifyButtonSound(button: HTMLButtonElement): SoundKind {
  if (button.type === 'submit') return 'submit';
  const text = (button.textContent || '').toLowerCase();
  if (text.includes('export')) return 'export';
  if (text.includes('starter') || text.includes('average') || text.includes('excellent')) {
    return 'preset';
  }
  if (
    button.getAttribute('aria-pressed') !== null ||
    button.getAttribute('aria-expanded') !== null
  ) {
    return 'toggle';
  }
  return 'click';
}
