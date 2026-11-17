// google.com for $12 music bed (original synthesis, no samples, no licences needed).
// Same instruments and chords as the series theme (make-audio-mdh.mjs), arranged for this story: a punchy hook
// with a hit on "SOLD" (3.13 s), a quiet rewind into the 2015 night, a groove when the domain shows as available,
// a riser into "Payment successful" (31.13 s), a ticking clock for the minute as owner, a hit on the cancel (40.35 s),
// a lift for the reward and the doubling (56.65 s), a thinking pad under the comment question, and the outro.
// Writes public/google/music.wav only; never touches other episodes' files.
// Usage: node scripts/make-audio-google.mjs 87.26
import fs from "node:fs";

const SR = 48000;
const TOTAL = Number(process.argv[2] ?? 87.26);
const BEAT = 0.5; // 120 BPM
const T0 = 1.13; // grid offset, so bar lines fall on 3.13 s, 31.13 s and 81.13 s
// [from, mode]: intro = sparse, build = rising, full = groove, break = pad only.
const SECTIONS = [
  [0, "build"],
  [3.13, "full"],
  [7.13, "break"],
  [11.13, "intro"],
  [21.13, "build"],
  [23.13, "full"],
  [27.13, "intro"],
  [29.13, "build"],
  [31.13, "full"],
  [35.13, "intro"],
  [40.35, "break"],
  [43.13, "build"],
  [45.13, "intro"],
  [49.13, "build"],
  [51.13, "full"],
  [53.13, "intro"],
  [55.13, "build"],
  [57.13, "full"],
  [59.13, "intro"],
  [65.13, "break"],
  [73.13, "full"],
  [77.13, "intro"],
  [79.13, "build"],
  [81.13, "full"],
];
const LAST_HIT = 86.6;
const RISERS = [
  [1.2, 3.13, 0.1],
  [21.9, 23.88, 0.1],
  [29.2, 31.13, 0.14],
  [38.4, 40.35, 0.12],
  [54.6, 56.65, 0.12],
  [79.2, 81.13, 0.1],
];
const HITS = [3.13, 31.13, 40.35, 56.65, 81.13];
// The clock while Sanmay owns google.com: a woodblock tick that speeds up towards the cancel.
const TICK_FROM = 33.13;
const TICK_TO = 40.2;
const modeAt = (t) => {
  let m = "intro";
  for (const [from, mode] of SECTIONS) if (t >= from - 0.01) m = mode;
  return t > LAST_HIT + 0.01 ? "end" : m;
};
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

let seed = 7654321;
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

/** Noise swell that rises in pitch and level, ending on the beat it leads into. */
function riser(sec) {
  const L = buf(sec);
  const R = buf(sec);
  const a = new Biquad();
  const b = new Biquad();
  let ph = 0;
  for (let i = 0; i < L.length; i++) {
    const t = i / L.length;
    const f = 300 * Math.pow(5000 / 300, t * t);
    if (i % 32 === 0) {
      a.set("bp", f, 1.6);
      b.set("bp", f * 1.5, 2);
    }
    ph += (2 * Math.PI * (180 + 700 * t * t)) / SR;
    const env = Math.pow(t, 2.2) * (t > 0.97 ? (1 - t) / 0.03 : 1);
    const x = noise();
    const y = (a.run(x) + 0.6 * b.run(x)) * env + Math.sin(ph) * env * 0.05;
    L[i] = y * (0.8 + 0.2 * Math.sin(t * 40));
    R[i] = y * (0.8 + 0.2 * Math.cos(t * 40));
  }
  normalize([L, R], 0.45);
  return [L, R];
}

/** Quick rising sparkle (five bell notes), for a transformation. */
function sparkle() {
  const L = buf(0.9);
  const R = buf(0.9);
  const notes = [1318.51, 1567.98, 1975.53, 2349.32, 2637.02];
  notes.forEach((f, k) => {
    const s0 = Math.round(k * 0.055 * SR);
    let ph = 0;
    for (let i = 0; s0 + i < L.length; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f) / SR;
      const v = (Math.sin(ph) + 0.3 * Math.sin(2.76 * ph)) * Math.min(1, t / 0.002) * Math.exp(-t / 0.18);
      L[s0 + i] += v * (k % 2 ? 0.7 : 1);
      R[s0 + i] += v * (k % 2 ? 1 : 0.7);
    }
  });
  normalize([L, R], 0.35);
  return [L, R];
}

function musicBed(total) {
  const L = buf(total);
  const R = buf(total);
  const N = L.length;
  const chords = [
    { root: 110.0, pad: [220.0, 261.63, 329.63], arp: [440.0, 523.25, 659.25, 880.0] },
    { root: 87.31, pad: [174.61, 220.0, 261.63], arp: [349.23, 440.0, 523.25, 698.46] },
    { root: 130.81, pad: [196.0, 261.63, 329.63], arp: [392.0, 523.25, 659.25, 783.99] },
    { root: 98.0, pad: [196.0, 246.94, 293.66], arp: [392.0, 493.88, 587.33, 783.99] },
  ];
  const bar = (t) => Math.max(0, Math.floor((t - T0) / (BEAT * 4)));
  const chordAt = (t) => chords[bar(t) % 4];
  const full = (t) => modeAt(t) === "full";
  const duck = (t) => {
    if (!full(t)) return 1;
    const sinceKick = (((t - T0) % (BEAT * 2)) + BEAT * 2) % (BEAT * 2);
    return 1 - 0.5 * Math.exp(-sinceKick / 0.12);
  };
  const put = (arr, i, v) => {
    if (i >= 0 && i < N) arr[i] += v;
  };
  const beats = [];
  for (let k = 0; T0 + k * BEAT < total; k++) beats.push({ k, t: T0 + k * BEAT });

  // Kick: once a bar in the intro, every beat in a build, beats 1 and 3 in the groove, none in the break.
  for (const { k, t: t0 } of beats) {
    const m = modeAt(t0);
    if (m === "break" || m === "end") continue;
    if (m === "intro" && k % 4 !== 0) continue;
    if (m === "full" && k % 2 !== 0) continue;
    const lvl = m === "intro" ? 0.34 : m === "build" ? 0.46 : 0.55;
    const s0 = Math.round(t0 * SR);
    let ph = 0;
    for (let i = 0; i < 0.35 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (48 + 110 * Math.exp(-t / 0.035))) / SR;
      const v = Math.sin(ph) * Math.exp(-t / 0.16) * lvl + (t < 0.003 ? noise() * 0.15 : 0);
      put(L, s0 + i, v);
      put(R, s0 + i, v);
    }
  }
  // Clap on beats 2 and 4 in the groove; a short roll leads into each big hit.
  const clapAt = (t0, lvl) => {
    const bp = new Biquad().set("bp", 1300, 0.9);
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < 0.2 * SR; i++) {
      const t = i / SR;
      const burst = t < 0.03 ? 0.6 + 0.4 * Math.sin(t * 2 * Math.PI * 100) : 1;
      const v = bp.run(noise()) * Math.exp(-t / 0.07) * burst * lvl;
      put(L, s0 + i, v * 0.9);
      put(R, s0 + i, v);
    }
  };
  for (const { k, t } of beats) if (full(t) && k % 2 === 1) clapAt(t, 0.42);
  for (const hit of HITS) for (let j = 1; j <= 8; j++) clapAt(hit - j * (BEAT / 4), 0.1 + 0.03 * (8 - j));
  // Hi-hats: eighths in the groove, sixteenths in a build, quiet offbeats in the intro, none in the break.
  for (let t0 = T0; t0 < Math.min(total, LAST_HIT + 0.3); t0 += BEAT / 4) {
    const m = modeAt(t0);
    if (m === "break" || m === "end") continue;
    const n = Math.round((t0 - T0) / (BEAT / 4));
    const sixteenth = n % 2 === 1;
    if (sixteenth && m !== "build") continue;
    const off = Math.round((t0 - T0) / (BEAT / 2)) % 2 === 1;
    if (m === "intro" && !off) continue;
    const hp = new Biquad().set("hp", 7500, 0.7);
    const s0 = Math.round(t0 * SR);
    const lvl = (sixteenth ? 0.035 : off ? 0.065 : 0.045) * (m === "intro" ? 0.6 : 1);
    for (let i = 0; i < 0.05 * SR; i++) {
      const t = i / SR;
      const v = hp.run(noise()) * Math.exp(-t / 0.018) * lvl;
      put(L, s0 + i, v * 0.8);
      put(R, s0 + i, v);
    }
  }
  // Bass: one long note per bar outside the groove, eighth-note pulses in it.
  for (let t0 = T0; t0 < Math.min(total, LAST_HIT + 0.3); t0 += BEAT / 2) {
    const long = !full(t0);
    if (long && Math.round((t0 - T0) / (BEAT / 2)) % 8 !== 0) continue;
    const f = chordAt(t0).root;
    const len = long ? 1.9 : 0.3;
    const s0 = Math.round(t0 * SR);
    let ph = 0;
    for (let i = 0; i < len * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f) / SR;
      const env = Math.min(1, t / 0.004) * (len > 1 ? Math.exp(-t / 0.9) * 0.6 : Math.exp(-t / 0.15));
      const v = Math.tanh((Math.sin(ph) + 0.35 * Math.sin(2 * ph)) * 1.4) * env * 0.2 * duck(t0 + t);
      put(L, s0 + i, v);
      put(R, s0 + i, v);
    }
  }
  // Pad: soft detuned chord per bar, a little louder in the break.
  for (let b = 0; T0 + b * BEAT * 4 < total; b++) {
    const t0 = T0 + b * BEAT * 4;
    const ch = chords[b % 4];
    const s0 = Math.round(t0 * SR);
    const len = BEAT * 4 + 0.4;
    const lvl = modeAt(t0 + 0.1) === "break" ? 0.05 : 0.035;
    for (const f of ch.pad) {
      for (const det of [-0.004, 0.004]) {
        let ph = rnd() * 6;
        for (let i = 0; i < len * SR; i++) {
          const t = i / SR;
          ph += (2 * Math.PI * f * (1 + det)) / SR;
          const env = Math.min(1, t / 0.25) * Math.min(1, (len - t) / 0.4);
          const v = Math.sin(ph) * env * lvl * duck(t0 + t);
          put(L, s0 + i, det < 0 ? v : v * 0.7);
          put(R, s0 + i, det < 0 ? v * 0.7 : v);
        }
      }
    }
  }
  // Plucked arpeggio with a soft stereo echo: sparse in the intro and the break, rising in a build, full in the groove.
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  const rising = [0, 1, 2, 3, 0, 1, 2, 3];
  const echo = Math.round(BEAT * 0.75 * SR);
  const dryL = buf(total);
  const dryR = buf(total);
  for (let k = 0; T0 + k * (BEAT / 2) < Math.min(total, LAST_HIT + 0.3); k++) {
    const t0 = T0 + k * (BEAT / 2);
    const m = modeAt(t0);
    if ((m === "intro" || m === "break") && k % 4 !== 0) continue;
    const ch = chordAt(t0);
    const f = m === "build" ? ch.arp[rising[k % 8]] * (k % 8 >= 4 ? 2 : 1) : ch.arp[pattern[k % 8]];
    const s0 = Math.round(t0 * SR);
    const pan = k % 2 ? 0.75 : 1;
    const lvl = m === "full" || m === "build" ? 0.06 : 0.045;
    let ph = 0;
    for (let i = 0; i < 0.4 * SR; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * f) / SR;
      const v = tri(ph) * Math.min(1, t / 0.003) * Math.exp(-t / 0.12) * lvl;
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
  for (let t0 = TICK_FROM, k = 0; t0 < TICK_TO; k++) {
    const bp = new Biquad().set("bp", k % 2 ? 1900 : 2500, 6);
    const s0 = Math.round(t0 * SR);
    for (let i = 0; i < 0.06 * SR; i++) {
      const t = i / SR;
      const v = bp.run(noise()) * Math.exp(-t / 0.012) * 0.55;
      put(L, s0 + i, v * (k % 2 ? 0.8 : 1));
      put(R, s0 + i, v * (k % 2 ? 1 : 0.8));
    }
    t0 += t0 < 37.62 ? BEAT : BEAT / 2;
  }
  for (const [from, to, lvl] of RISERS) {
    const [rl, rr] = riser(to - from);
    const s0 = Math.round(from * SR);
    for (let i = 0; i < rl.length; i++) {
      put(L, s0 + i, rl[i] * lvl);
      put(R, s0 + i, rr[i] * lvl);
    }
  }
  normalize([L, R], 0.32);
  const fadeIn = 0.25 * SR;
  const fadeOutStart = N - 0.75 * SR;
  for (let i = 0; i < N; i++) {
    let g = 1;
    if (i < fadeIn) g = i / fadeIn;
    if (i > fadeOutStart) g = Math.max(0, 1 - (i - fadeOutStart) / (N - fadeOutStart));
    L[i] *= g;
    R[i] *= g;
  }
  return [L, R];
}

fs.mkdirSync("public/google", { recursive: true });
const [L, R] = musicBed(TOTAL);
writeWav("public/google/music.wav", L, R);
console.log("google/music.wav", (L.length / SR).toFixed(2) + "s");
