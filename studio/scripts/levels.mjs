// Loudness check for a PCM16 WAV: peak, and RMS (dBFS) in speech windows vs. pauses.
// Usage: node scripts/levels.mjs file.wav
import fs from "node:fs";

const buf = fs.readFileSync(process.argv[2]);
const ch = buf.readUInt16LE(22);
const sr = buf.readUInt32LE(24);
let off = 12;
let data = 0;
let len = 0;
while (off < buf.length) {
  const id = buf.toString("ascii", off, off + 4);
  const l = buf.readUInt32LE(off + 4);
  if (id === "data") {
    data = off + 8;
    len = Math.min(l, buf.length - off - 8);
    break;
  }
  off += 8 + l;
}
const frames = Math.floor(len / 2 / ch);
const sample = (i) => {
  let s = 0;
  for (let c = 0; c < ch; c++) s += buf.readInt16LE(data + (i * ch + c) * 2) / 32768;
  return s / ch;
};
let peak = 0;
for (let i = 0; i < frames * ch; i++) peak = Math.max(peak, Math.abs(buf.readInt16LE(data + i * 2) / 32768));
const db = (v) => (v > 0 ? (20 * Math.log10(v)).toFixed(1) : "-inf");
const rms = (a, b) => {
  let s = 0;
  let n = 0;
  for (let i = Math.round(a * sr); i < Math.min(frames, Math.round(b * sr)); i++) {
    const v = sample(i);
    s += v * v;
    n++;
  }
  return n ? Math.sqrt(s / n) : 0;
};
const speech = [[0.3, 2.6], [3.3, 3.8], [4.1, 5.5], [6.4, 8.8], [9.4, 10.3], [11.0, 12.45], [13.3, 13.58], [14.45, 17.6]];
const pauses = [[2.75, 3.2], [5.62, 6.3], [10.4, 10.95], [12.6, 13.2], [13.65, 14.4], [17.7, 18.3]];
console.log(`${process.argv[2]}: ${sr} Hz, ${ch} ch, ${(frames / sr).toFixed(2)} s, peak ${db(peak)} dBFS`);
console.log("speech windows:", speech.map(([a, b]) => `${a}-${b}:${db(rms(a, b))}`).join("  "));
console.log("pauses:        ", pauses.map(([a, b]) => `${a}-${b}:${db(rms(a, b))}`).join("  "));
