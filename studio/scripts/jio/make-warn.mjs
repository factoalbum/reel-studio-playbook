// A soft two-tone warning chime for the Jio reel (original synthesis). Writes public/sfx/warn.wav only.
import fs from "node:fs";
const SR = 48000, N = Math.round(SR * 0.62);
const d = Buffer.alloc(44 + N * 4);
d.write("RIFF", 0); d.writeUInt32LE(36 + N * 4, 4); d.write("WAVEfmt ", 8); d.writeUInt32LE(16, 16); d.writeUInt16LE(1, 20); d.writeUInt16LE(2, 22);
d.writeUInt32LE(SR, 24); d.writeUInt32LE(SR * 4, 28); d.writeUInt16LE(4, 32); d.writeUInt16LE(16, 34); d.write("data", 36); d.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const tone = (f, a, len) => { const u = t - a; return u < 0 || u > len ? 0 : Math.sin(2 * Math.PI * f * u) * Math.min(1, u / 0.006) * Math.exp(-u / 0.12) + 0.35 * Math.sin(4 * Math.PI * f * u) * Math.min(1, u / 0.006) * Math.exp(-u / 0.06); };
  const v = 0.55 * (tone(880, 0, 0.3) + tone(622.25, 0.17, 0.42));
  const s = Math.max(-1, Math.min(1, v)) * 32767;
  d.writeInt16LE(s | 0, 44 + i * 4); d.writeInt16LE(s | 0, 46 + i * 4);
}
fs.writeFileSync("public/sfx/warn.wav", d);
console.log("sfx/warn.wav", (N / SR).toFixed(2) + "s");
