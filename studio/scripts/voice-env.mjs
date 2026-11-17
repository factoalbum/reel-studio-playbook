// Per-frame loudness of the voiceover (0..1), used for lip-sync and music ducking.
// Usage: node scripts/voice-env.mjs public/voice.wav src/episodes/reel01-voice-env.json 30
import fs from "node:fs";

const [input, output, fpsArg] = process.argv.slice(2);
const fps = Number(fpsArg ?? 30);
const buf = fs.readFileSync(input);
const sr = buf.readUInt32LE(24);
const channels = buf.readUInt16LE(22);
let off = 12;
let dataOff = 0;
let dataLen = 0;
while (off < buf.length) {
  const id = buf.toString("ascii", off, off + 4);
  const len = buf.readUInt32LE(off + 4);
  if (id === "data") {
    dataOff = off + 8;
    dataLen = len;
    break;
  }
  off += 8 + len;
}
const n = dataLen / 2 / channels;
const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = buf.readInt16LE(dataOff + i * 2 * channels) / 32768;

const frames = Math.ceil((n / sr) * fps) + 1;
const win = Math.round(sr * 0.045);
const raw = [];
for (let f = 0; f < frames; f++) {
  const c = Math.round((f / fps) * sr);
  let s = 0;
  let k = 0;
  for (let i = c - win / 2; i < c + win / 2; i++) {
    if (i >= 0 && i < n) {
      s += x[i] * x[i];
      k++;
    }
  }
  raw.push(k ? Math.sqrt(s / k) : 0);
}
const sorted = [...raw].sort((a, b) => a - b);
const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
const env = raw.map((v) => Math.round(Math.min(1, v / ref) * 1000) / 1000);
fs.writeFileSync(output, JSON.stringify(env));
console.log(`frames=${frames} sr=${sr} ref=${ref.toFixed(4)}`);
