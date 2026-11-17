// New sound effects for the eBay reel (original synthesis, no samples, no licences needed).
// Writes public/sfx/snap.wav, stamp.wav, flip.wav and modem.wav; adds new files only, never changes the existing ones.
// Usage: node scripts/make-sfx-ebay.mjs
import fs from "node:fs";

const SR = 48000;
let seed = 7;
const noise = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed / 2147483647) * 2 - 1;
};

function write(name, x, peak = 0.9) {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  const g = m ? peak / m : 1;
  const out = Buffer.alloc(44 + x.length * 2);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + x.length * 2, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(1, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(x.length * 2, 40);
  x.forEach((v, i) => out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * g)) * 32767), 44 + i * 2));
  fs.writeFileSync(`public/sfx/${name}.wav`, out);
}

const buf = (s) => new Float32Array(Math.round(s * SR));

/** High-passed noise burst at `at` seconds, decaying over `tau`. */
function crack(x, at, tau, lvl) {
  const a = Math.round(at * SR);
  let prev = 0;
  for (let i = a; i < x.length; i++) {
    const d = (i - a) / SR;
    const e = Math.exp(-d / tau);
    if (e < 0.001) break;
    const n = noise();
    x[i] += (n - prev) * e * lvl;
    prev = n;
  }
}

/** A falling sine thud. */
function thud(x, at, f0, f1, tau, lvl) {
  const a = Math.round(at * SR);
  let ph = 0;
  for (let i = a; i < x.length; i++) {
    const d = (i - a) / SR;
    const e = Math.exp(-d / tau);
    if (e < 0.001) break;
    ph += (2 * Math.PI * (f1 + (f0 - f1) * Math.exp(-d / 0.03))) / SR;
    x[i] += Math.sin(ph) * e * lvl;
  }
}

// The laser pointer breaking: a hard crack, a splinter a moment later, a small body thud.
{
  const x = buf(0.42);
  crack(x, 0, 0.012, 1);
  crack(x, 0.018, 0.02, 0.7);
  crack(x, 0.06, 0.012, 0.45);
  crack(x, 0.1, 0.009, 0.3);
  thud(x, 0, 520, 150, 0.05, 0.55);
  write("snap", x);
}

// The rubber stamp: a deep thump with a papery slap on top.
{
  const x = buf(0.5);
  thud(x, 0, 240, 62, 0.11, 1);
  crack(x, 0, 0.018, 0.5);
  crack(x, 0.012, 0.05, 0.14);
  write("stamp", x);
}

// One flip of a digit or a calendar page.
{
  const x = buf(0.09);
  crack(x, 0, 0.006, 0.9);
  thud(x, 0, 1900, 900, 0.012, 0.5);
  write("flip", x, 0.8);
}

// A short dial-up chirp, quiet under the 1995 room.
{
  const x = buf(1.15);
  const step = [
    [0, 0.2, 1270],
    [0.2, 0.34, 2100],
    [0.34, 0.5, 980],
    [0.5, 0.62, 2250],
  ];
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const s = step.find(([a, b]) => t >= a && t < b);
    const f = s ? s[2] : 1800 + 600 * Math.sin(t * 90);
    ph += (2 * Math.PI * f) / SR;
    const tone = Math.sin(ph) * (s ? 0.5 : 0.22);
    const hiss = t >= 0.62 ? noise() * 0.34 * (1 + Math.sin(t * 240)) * 0.5 : 0;
    const env = Math.min(1, t / 0.01) * Math.min(1, (1.15 - t) / 0.12);
    x[i] = (tone + hiss) * env;
  }
  write("modem", x, 0.6);
}
console.log("sfx written");
