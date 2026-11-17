import fs from "node:fs";
const buf = fs.readFileSync(process.argv[2]);
const sr = buf.readUInt32LE(24);
let off = 12; let dataOff = 0, dataLen = 0;
while (off < buf.length) { const id = buf.toString("ascii", off, off + 4); const len = buf.readUInt32LE(off + 4); if (id === "data") { dataOff = off + 8; dataLen = len; break; } off += 8 + len; }
const n = dataLen / 2; const x = new Float32Array(n);
for (let i = 0; i < n; i++) x[i] = buf.readInt16LE(dataOff + i * 2) / 32768;
const hop = Math.round(sr * 0.01); const frames = Math.floor(n / hop);
const env = new Float32Array(frames);
for (let f = 0; f < frames; f++) { let s = 0; for (let i = 0; i < hop * 2 && f * hop + i < n; i++) s += x[f * hop + i] ** 2; env[f] = Math.sqrt(s / (hop * 2)); }
// smooth ~50ms
const sm = new Float32Array(frames);
for (let f = 0; f < frames; f++) { let s = 0, c = 0; for (let k = -3; k <= 3; k++) { const j = f + k; if (j >= 0 && j < frames) { s += env[j]; c++; } } sm[f] = s / c; }
const max = Math.max(...sm); const thr = max * 0.12;
const peaks = [];
for (let f = 3; f < frames - 3; f++) { if (sm[f] > thr && sm[f] >= sm[f - 1] && sm[f] > sm[f + 1]) { let ok = true; for (let k = -8; k <= 8; k++) { const j = f + k; if (j >= 0 && j < frames && sm[j] > sm[f]) { ok = false; break; } } if (ok) peaks.push(+(f * 0.01).toFixed(2)); } }
console.log(JSON.stringify({ sr, dur: n / sr, peaks: peaks.length, p: peaks }));
