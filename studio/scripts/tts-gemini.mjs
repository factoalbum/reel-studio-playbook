// Text to voice with Gemini TTS, the same engine as Google AI Studio's speech page.
// Owner's settings (18 Nov 2026): voice Puck, style "Promote", model Gemini 3.1 Flash TTS.
//
// Usage: node scripts/tts-gemini.mjs <script.txt> <out.wav> [--model id] [--voice Puck] [--style "..."]
//        [--speakers "You=Puck,Claude=Charon"]  two-speaker mode: the script uses "You:" / "Claude:" line labels
// Needs GEMINI_API_KEY in the environment (free-tier project, no billing). The key is never printed.
// Output: 24 kHz 16-bit mono WAV, like AI Studio's "Generated Audio" files.

import fs from "node:fs";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const [inFile, outFile] = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
if (!inFile || !outFile) {
  console.error("usage: node scripts/tts-gemini.mjs <script.txt> <out.wav> [--model id] [--voice Puck] [--style text]");
  process.exit(1);
}
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("GEMINI_API_KEY is not set. Run: setx GEMINI_API_KEY \"...\" in your own PowerShell, then restart.");
  process.exit(1);
}

const model = opt("model", "gemini-3.1-flash-tts-preview");
const voice = opt("voice", "Puck");
// AI Studio's "Promote" style preset, written as a plain instruction.
const style = opt("style", "Read this like an energetic, upbeat promo: confident, punchy and excited, in natural Hinglish");
const text = fs.readFileSync(inFile, "utf8").trim();
// Two-speaker mode (Gemini allows exactly two): "You=Puck,Claude=Charon".
const speakers = opt("speakers", "")
  ? opt("speakers", "")
      .split(",")
      .map((x) => x.split("=").map((y) => y.trim()))
  : null;

const body = {
  contents: [{ parts: [{ text: `${style}:\n\n${text}` }] }],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: speakers
      ? {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakers.map(([speaker, v]) => ({ speaker, voiceConfig: { prebuiltVoiceConfig: { voiceName: v } } })),
          },
        }
      : { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
  },
};

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-goog-api-key": key },
  body: JSON.stringify(body),
});
if (!res.ok) {
  const err = await res.text();
  console.error(`HTTP ${res.status}: ${err.slice(0, 600)}`);
  process.exit(2);
}
const json = await res.json();
const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
if (!part) {
  console.error("No audio in the response:", JSON.stringify(json).slice(0, 600));
  process.exit(3);
}
const pcm = Buffer.from(part.inlineData.data, "base64");
const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType || "")?.[1] || 24000);

// Wrap the raw 16-bit mono PCM in a WAV header.
const h = Buffer.alloc(44);
h.write("RIFF", 0);
h.writeUInt32LE(36 + pcm.length, 4);
h.write("WAVE", 8);
h.write("fmt ", 12);
h.writeUInt32LE(16, 16);
h.writeUInt16LE(1, 20);
h.writeUInt16LE(1, 22);
h.writeUInt32LE(rate, 24);
h.writeUInt32LE(rate * 2, 28);
h.writeUInt16LE(2, 32);
h.writeUInt16LE(16, 34);
h.write("data", 36);
h.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(outFile, Buffer.concat([h, pcm]));
console.log(`saved ${outFile}: ${(pcm.length / 2 / rate).toFixed(2)} s, ${rate} Hz, voice ${speakers ? speakers.map((x) => x.join("=")).join(", ") : voice}, model ${model}`);
