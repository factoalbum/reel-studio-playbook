// Episode 02 music bed and two new sound effects (original synthesis, no samples, no licences needed).
// Same instruments and chords as the series theme (make-audio.mjs), arranged around this episode's voice:
// bars land on the website reveal (10.32 s), the ChatGPT reveal (23.32 s) and the call to action (26.82 s).
// Writes public/ep02/music.wav, public/sfx/riser.wav and public/sfx/sparkle.wav; never touches Episode 01's files.
// Usage: node scripts/make-audio-ep02.mjs 36.14
import fs from "node:fs";

const SR = 48000;
const TOTAL = Number(process.argv[2] ?? 36.14);
const BEAT = 0.5; // 120 BPM
const T0 = 0.32; // grid offset, so bar lines fall on the voice's big moments
const PART = { buildFrom: 6.82, reveal: 10.32, breakFrom: 20.82, drop: 23.32, cta: 26.82, lastHit: 35.32 };

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
  const inBreak = (t) => t >= PART.breakFrom - 0.01 && t < PART.drop - 0.01;
  const full = (t) => t >= PART.reveal - 0.01 && !inBreak(t) && t <= PART.lastHit + 0.01;
  // Pump against the kick (every two beats) while the full groove plays.
  const duck = (t) => {
    if (!full(t)) return 1;
    const sinceKick = (((t - T0) % (BEAT * 2)) + BEAT * 2) % (BEAT * 2);
    return 1 - 0.55 * Math.exp(-sinceKick / 0.12);
  };
  const put = (arr, i, v) => {
    if (i >= 0 && i < N) arr[i] += v;
  };
  const beats = [];
  for (let k = 0; T0 + k * BEAT < total; k++) beats.push({ k, t: T0 + k * BEAT });

  // Kick: half time in the intro, every beat in the build, beats 1 and 3 in the groove, none in the break.
  for (const { k, t: t0 } of beats) {
    if (t0 > PART.lastHit + 0.01 || inBreak(t0)) continue;
    const intro = t0 < PART.buildFrom - 0.01;
    const build = !intro && t0 < PART.reveal - 0.01;
    if (intro && k % 4 !== 0) continue;
    if (!intro && !build && k % 2 !== 0) continue;
    const lvl = intro ? 0.38 : build ? 0.42 + 0.1 * ((t0 - PART.buildFrom) / (PART.reveal - PART.buildFrom)) : 0.55;
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
  // Clap on beats 2 and 4 once the website is revealed; a short roll leads into each reveal.
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
  for (const { k, t } of beats) if (full(t) && k % 2 === 1) clapAt(t, 0.5);
  for (const hit of [PART.reveal, PART.drop]) {
    for (let j = 1; j <= 8; j++) clapAt(hit - j * (BEAT / 4), 0.12 + 0.03 * (8 - j));
  }
  // Hi-hats: eighths, sixteenths in the build and after the ChatGPT drop; silent in the break.
  for (let t0 = T0; t0 < Math.min(total, PART.lastHit + 0.3); t0 += BEAT / 4) {
    if (inBreak(t0)) continue;
    const n = Math.round((t0 - T0) / (BEAT / 4));
    const sixteenth = n % 2 === 1;
    const busy = (t0 >= PART.buildFrom && t0 < PART.reveal) || (t0 >= PART.drop && t0 < PART.cta);
    if (sixteenth && !busy) continue;
    const off = Math.round((t0 - T0) / (BEAT / 2)) % 2 === 1;
    const hp = new Biquad().set("hp", 7500, 0.7);
    const s0 = Math.round(t0 * SR);
    const lvl = (sixteenth ? 0.035 : off ? 0.07 : 0.045) * (t0 < PART.buildFrom ? 0.7 : 1);
    for (let i = 0; i < 0.05 * SR; i++) {
      const t = i / SR;
      const v = hp.run(noise()) * Math.exp(-t / 0.018) * lvl;
      put(L, s0 + i, v * 0.8);
      put(R, s0 + i, v);
    }
  }
  // Bass: one long note per bar in the intro, eighth-note pulses from the reveal, held root in the break.
  for (let t0 = T0; t0 < Math.min(total, PART.lastHit + 0.3); t0 += BEAT / 2) {
    const intro = t0 < PART.reveal - 0.01;
    if ((intro || inBreak(t0)) && Math.round((t0 - T0) / (BEAT / 2)) % 8 !== 0) continue;
    const f = chordAt(t0).root;
    const len = intro || inBreak(t0) ? 1.9 : 0.3;
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
    const lvl = inBreak(t0 + 0.1) ? 0.05 : 0.035;
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
  // Plucked arpeggio with a soft stereo echo: sparse in the intro, rising in the build, full from the reveal.
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  const rising = [0, 1, 2, 3, 0, 1, 2, 3];
  const echo = Math.round(BEAT * 0.75 * SR);
  const dryL = buf(total);
  const dryR = buf(total);
  for (let k = 0; T0 + k * (BEAT / 2) < Math.min(total, PART.lastHit + 0.3); k++) {
    const t0 = T0 + k * (BEAT / 2);
    if (inBreak(t0)) continue;
    const intro = t0 < PART.buildFrom - 0.01;
    const build = !intro && t0 < PART.reveal - 0.01;
    if (intro && k % 4 !== 0) continue;
    const ch = chordAt(t0);
    const f = build ? ch.arp[rising[k % 8]] * (k % 8 >= 4 ? 2 : 1) : ch.arp[pattern[k % 8]];
    const s0 = Math.round(t0 * SR);
    const pan = k % 2 ? 0.75 : 1;
    const lvl = intro ? 0.045 : 0.06;
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
  // Risers into the two reveals.
  for (const [from, to, lvl] of [
    [8.82, PART.reveal, 0.12],
    [21.82, PART.drop, 0.14],
  ]) {
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

fs.mkdirSync("public/ep02", { recursive: true });
const out = {
  "sfx/riser.wav": riser(1.5),
  "sfx/sparkle.wav": sparkle(),
  "ep02/music.wav": musicBed(TOTAL),
};
for (const [file, [L, R]] of Object.entries(out)) {
  writeWav(`public/${file}`, L, R);
  console.log(file, (L.length / SR).toFixed(2) + "s");
}
