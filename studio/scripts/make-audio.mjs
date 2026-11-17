// Synthesises the background music bed and sound effects (original audio, no samples, no licences needed).
// Usage: node scripts/make-audio.mjs 18.41
import fs from "node:fs";

const SR = 48000;
const TOTAL = Number(process.argv[2] ?? 18.41);
fs.mkdirSync("public/sfx", { recursive: true });
fs.mkdirSync("public/music", { recursive: true });

function writeWav(file, L, R) {
  const n = L.length;
  const out = Buffer.alloc(44 + n * 4);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + n * 4, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(n * 4, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), o);
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), o + 2);
    o += 4;
  }
  fs.writeFileSync(file, out);
}

let seed = 1234567;
const rnd = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const buf = (sec) => new Float32Array(Math.round(sec * SR));
const tri = (ph) => (2 / Math.PI) * Math.asin(Math.sin(ph));

class Biquad {
  constructor() {
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
  }
  set(type, f, q) {
    const w0 = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const c = Math.cos(w0);
    const al = Math.sin(w0) / (2 * q);
    let b0;
    let b1;
    let b2;
    if (type === "lp") [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (type === "hp") [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [al, 0, -al];
    const a0 = 1 + al;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * c) / a0;
    this.a2 = (1 - al) / a0;
    return this;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

function normalize(arrs, peak) {
  let m = 0;
  for (const a of arrs) for (const v of a) m = Math.max(m, Math.abs(v));
  const g = m > 0 ? peak / m : 1;
  for (const a of arrs) for (let i = 0; i < a.length; i++) a[i] *= g;
}

function whoosh(sec, f0, f1, peakAt) {
  const L = buf(sec);
  const R = buf(sec);
  const a = new Biquad();
  const b = new Biquad();
  for (let i = 0; i < L.length; i++) {
    const t = i / L.length;
    const f = f0 * Math.pow(f1 / f0, t);
    if (i % 32 === 0) {
      a.set("bp", f, 1.1);
      b.set("bp", f * 1.6, 1.4);
    }
    const env = t < peakAt ? Math.pow(t / peakAt, 2) : Math.pow(1 - (t - peakAt) / (1 - peakAt), 1.7);
    const x = noise();
    const y = (a.run(x) + 0.5 * b.run(x)) * env;
    L[i] = y * (1 - 0.6 * t);
    R[i] = y * (0.4 + 0.6 * t);
  }
  normalize([L, R], 0.5);
  return [L, R];
}

function pop() {
  const L = buf(0.16);
  let ph = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    const f = 300 + 750 * Math.exp(-t / 0.018);
    ph += (2 * Math.PI * f) / SR;
    const env = Math.min(1, t / 0.002) * Math.exp(-t / 0.04);
    L[i] = Math.sin(ph) * env + (t < 0.003 ? noise() * 0.25 * (1 - t / 0.003) : 0);
  }
  normalize([L], 0.5);
  return [L, L.slice()];
}

function click() {
  const L = buf(0.07);
  const bp = new Biquad().set("bp", 3800, 2.5);
  let ph = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 2100) / SR;
    L[i] = bp.run(noise()) * Math.exp(-t / 0.004) * 2 + Math.sin(ph) * Math.exp(-t / 0.007) * 0.45;
  }
  normalize([L], 0.45);
  return [L, L.slice()];
}

function coin() {
  const L = buf(0.75);
  let ph = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    const first = t < 0.075;
    ph += (2 * Math.PI * (first ? 987.77 : 1318.51)) / SR;
    const env = first ? Math.min(1, t / 0.003) * 0.8 : Math.exp(-(t - 0.075) / 0.22);
    L[i] = (Math.sin(ph) + 0.25 * Math.sin(2 * ph) + 0.1 * Math.sin(3 * ph)) * env;
  }
  normalize([L], 0.4);
  return [L, L.slice()];
}

function impact() {
  const L = buf(1.1);
  const lp = new Biquad().set("lp", 900, 0.7);
  let ph = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (38 + 85 * Math.exp(-t / 0.07))) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.32);
    const n = lp.run(noise()) * Math.exp(-t / 0.05) * 0.9;
    L[i] = Math.tanh((body * 1.2 + n) * 1.4);
  }
  normalize([L], 0.55);
  return [L, L.slice()];
}

function ding() {
  const L = buf(0.9);
  let a = 0;
  let b = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    a += (2 * Math.PI * 1567.98) / SR;
    b += (2 * Math.PI * 2349.32) / SR;
    L[i] = (Math.sin(a) + 0.45 * Math.sin(b)) * Math.min(1, t / 0.004) * Math.exp(-t / 0.26);
  }
  normalize([L], 0.35);
  return [L, L.slice()];
}

function typing() {
  const L = buf(0.75);
  for (const t0 of [0, 0.12, 0.24, 0.36, 0.48]) {
    const bp = new Biquad().set("bp", 2500 + rnd() * 1400, 1.8);
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < 0.035 * SR; i++) {
      const t = i / SR;
      L[s0 + i] += bp.run(noise()) * Math.exp(-t / 0.006) * 2 + (t < 0.004 ? noise() * 0.35 : 0);
    }
  }
  normalize([L], 0.4);
  return [L, L.slice()];
}

function musicBed(total) {
  const L = buf(total);
  const R = buf(total);
  const N = L.length;
  const beat = 60 / 120;
  const chords = [
    { root: 110.0, pad: [220.0, 261.63, 329.63], arp: [440.0, 523.25, 659.25, 880.0] },
    { root: 87.31, pad: [174.61, 220.0, 261.63], arp: [349.23, 440.0, 523.25, 698.46] },
    { root: 130.81, pad: [196.0, 261.63, 329.63], arp: [392.0, 523.25, 659.25, 783.99] },
    { root: 98.0, pad: [196.0, 246.94, 293.66], arp: [392.0, 493.88, 587.33, 783.99] },
  ];
  const chordAt = (t) => chords[Math.floor(t / (beat * 4)) % 4];
  const duck = (t) => 1 - 0.55 * Math.exp(-(t % (beat * 2)) / 0.12);
  const put = (arr, i, v) => {
    if (i >= 0 && i < N) arr[i] += v;
  };

  // Kick on beats 1 and 3.
  for (let k = 0; k * beat * 2 < total; k++) {
    const s0 = Math.round(k * beat * 2 * SR);
    let ph = 0;
    for (let i = 0; i < 0.35 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (48 + 110 * Math.exp(-t / 0.035))) / SR;
      const v = Math.sin(ph) * Math.exp(-t / 0.16) * 0.55 + (t < 0.003 ? noise() * 0.15 : 0);
      put(L, s0 + i, v);
      put(R, s0 + i, v);
    }
  }
  // Clap on beats 2 and 4 after the hook.
  for (let k = 0; beat + k * beat * 2 < total; k++) {
    const t0 = beat + k * beat * 2;
    if (t0 < 5.9) continue;
    const bp = new Biquad().set("bp", 1300, 0.9);
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < 0.2 * SR; i++) {
      const t = i / SR;
      const burst = t < 0.03 ? 0.6 + 0.4 * Math.sin(t * 2 * Math.PI * 100) : 1;
      const v = bp.run(noise()) * Math.exp(-t / 0.07) * burst * 0.5;
      put(L, s0 + i, v * 0.9);
      put(R, s0 + i, v);
    }
  }
  // Hi-hats: 8ths, 16ths in the build-up.
  for (let t0 = 0; t0 < total; t0 += beat / 4) {
    const sixteenth = Math.round(t0 / (beat / 4)) % 2 === 1;
    if (sixteenth && !(t0 > 10.6 && t0 < 14)) continue;
    const off = Math.round(t0 / (beat / 2)) % 2 === 1;
    const hp = new Biquad().set("hp", 7500, 0.7);
    const s0 = Math.round(t0 * SR);
    const lvl = sixteenth ? 0.035 : off ? 0.07 : 0.045;
    for (let i = 0; i < 0.05 * SR; i++) {
      const t = i / SR;
      const v = hp.run(noise()) * Math.exp(-t / 0.018) * lvl;
      put(L, s0 + i, v * 0.8);
      put(R, s0 + i, v);
    }
  }
  // Bass: 8th-note pulses on the chord root.
  for (let t0 = 0; t0 < total; t0 += beat / 2) {
    const f = chordAt(t0).root;
    const s0 = Math.round(t0 * SR);
    let ph = 0;
    for (let i = 0; i < 0.3 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f) / SR;
      const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.15);
      const v = Math.tanh((Math.sin(ph) + 0.35 * Math.sin(2 * ph)) * 1.4) * env * 0.2 * duck(t0 + t);
      put(L, s0 + i, v);
      put(R, s0 + i, v);
    }
  }
  // Pad: soft detuned chord per bar.
  for (let b = 0; b * beat * 4 < total; b++) {
    const t0 = b * beat * 4;
    const ch = chords[b % 4];
    const s0 = Math.round(t0 * SR);
    const len = beat * 4 + 0.4;
    for (const f of ch.pad) {
      for (const det of [-0.004, 0.004]) {
        let ph = rnd() * 6;
        for (let i = 0; i < len * SR; i++) {
          const t = i / SR;
          ph += (2 * Math.PI * f * (1 + det)) / SR;
          const env = Math.min(1, t / 0.25) * Math.min(1, (len - t) / 0.4);
          const v = Math.sin(ph) * env * 0.035 * duck(t0 + t);
          put(L, s0 + i, det < 0 ? v : v * 0.7);
          put(R, s0 + i, det < 0 ? v * 0.7 : v);
        }
      }
    }
  }
  // Plucked arpeggio from the explanation onwards, with a soft stereo echo.
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  const echo = Math.round(beat * 0.75 * SR);
  const dryL = buf(total);
  const dryR = buf(total);
  for (let k = 0; k * (beat / 2) < total; k++) {
    const t0 = k * (beat / 2);
    if (t0 < 5.9) continue;
    const f = chordAt(t0).arp[pattern[k % 8]];
    const s0 = Math.round(t0 * SR);
    const pan = k % 2 ? 0.75 : 1;
    let ph = 0;
    for (let i = 0; i < 0.4 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f) / SR;
      const v = tri(ph) * Math.min(1, t / 0.003) * Math.exp(-t / 0.12) * 0.06;
      if (s0 + i < N) {
        dryL[s0 + i] += v * pan;
        dryR[s0 + i] += v * (1.75 - pan);
      }
    }
  }
  for (let i = 0; i < N; i++) {
    const eL = i >= echo ? dryR[i - echo] * 0.3 : 0;
    const eR = i >= echo ? dryL[i - echo] * 0.3 : 0;
    L[i] += dryL[i] + eL;
    R[i] += dryR[i] + eR;
  }
  normalize([L, R], 0.32);
  const fadeIn = 0.03 * SR;
  const fadeOutStart = N - 0.7 * SR;
  for (let i = 0; i < N; i++) {
    let g = 1;
    if (i < fadeIn) g = i / fadeIn;
    if (i > fadeOutStart) g = Math.max(0, 1 - (i - fadeOutStart) / (N - fadeOutStart));
    L[i] *= g;
    R[i] *= g;
  }
  return [L, R];
}

const out = {
  "sfx/whoosh.wav": whoosh(0.6, 250, 4000, 0.6),
  "sfx/swish.wav": whoosh(0.35, 3500, 600, 0.3),
  "sfx/pop.wav": pop(),
  "sfx/click.wav": click(),
  "sfx/coin.wav": coin(),
  "sfx/impact.wav": impact(),
  "sfx/ding.wav": ding(),
  "sfx/typing.wav": typing(),
  "music/bed.wav": musicBed(TOTAL),
};
for (const [file, [L, R]] of Object.entries(out)) {
  writeWav(`public/${file}`, L, R);
  console.log(file, (L.length / SR).toFixed(2) + "s");
}
