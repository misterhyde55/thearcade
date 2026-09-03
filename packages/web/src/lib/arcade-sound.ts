"use client";

// Small synthesized arcade blips via the Web Audio API — no audio files to
// host, so there's nothing that can 404 in production. Only ever fires
// after a user gesture (the intro requires a click before any sound plays),
// which also satisfies browser autoplay-audio restrictions.

const MUTE_KEY = "arcade.introMuted";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

// Defaults to muted until the visitor explicitly opts in, so nothing plays
// unexpectedly on a first visit.
export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTE_KEY) !== "0";
}

export function setSoundMuted(muted: boolean): void {
  window.localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

function beep(freq: number, startOffset: number, duration: number, type: OscillatorType = "square", gainPeak = 0.06) {
  const audio = getContext();
  if (!audio || isSoundMuted()) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = audio.currentTime + startOffset;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(gainPeak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playCoinSound() {
  beep(1568, 0, 0.09, "square");
  beep(2093, 0.09, 0.22, "square");
}

export function playConfirmBlip() {
  beep(880, 0, 0.06, "square", 0.05);
}

export function playStartupSweep() {
  const audio = getContext();
  if (!audio || isSoundMuted()) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "sawtooth";
  const start = audio.currentTime;
  osc.frequency.setValueAtTime(220, start);
  osc.frequency.exponentialRampToValueAtTime(1760, start + 0.45);
  gain.gain.setValueAtTime(0.05, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + 0.52);
}
