import type { Cap } from "../brand/Subtitles";
import { card } from "./mdh";
import voiceEnv from "./watch-voice-env.json";

/**
 * 3D desk skit: "Claude watches reels" (keyword WATCH). Script by the owner, 18 Nov 2026.
 * Voice: made by Claude with Gemini TTS two-speaker mode (gemini-3.1-flash-tts-preview): You = Puck (the owner's
 * voice), Claude = Charon. Take 2 of 2 from public/skit/script.txt, with 1.4 s of silence inserted at 26.95 s for
 * the "3 hours later" jump (public/skit/voice.wav, 41.72 s). Line edges from silencedetect, words checked with
 * whisper.cpp (small).
 *
 * The tool in the story is real: the watch-video Claude Code plugin (github.com/MarcinSufa/claude-watch-video, MIT):
 * ffmpeg keyframes plus a Whisper transcript. Install lines on screen are copied from its README (18 Nov 2026).
 * Chachu, his reel and his wedding video are made up for the skit and drawn by us.
 */

/** Who speaks when (seconds). */
export const LINES: { who: "you" | "claude"; a: number; b: number }[] = [
  { who: "you", a: 0.28, b: 3.34 },
  { who: "claude", a: 3.84, b: 5.62 },
  { who: "you", a: 6.07, b: 8.26 },
  { who: "claude", a: 8.89, b: 9.62 },
  { who: "you", a: 10.19, b: 12.57 },
  { who: "claude", a: 13.21, b: 17.28 },
  { who: "you", a: 17.81, b: 19.42 },
  { who: "claude", a: 19.94, b: 21.76 },
  { who: "you", a: 22.25, b: 23.12 },
  { who: "claude", a: 23.79, b: 25.43 },
  { who: "you", a: 25.94, b: 26.61 },
  { who: "you", a: 28.76, b: 31.06 },
  { who: "claude", a: 31.66, b: 33.81 },
  { who: "you", a: 34.4, b: 35.45 },
  { who: "claude", a: 36.08, b: 37.64 },
  { who: "you", a: 38.32, b: 41.37 },
];

/** Shot cuts and story beats. */
export const C = {
  reel: 1.2,
  claudeNo: 3.6,
  ruk: 5.85,
  file: 6.6,
  plugin: 7.55,
  kya: 8.65,
  frames: 9.95,
  text: 11.4,
  achha: 13.0,
  seeti: 15.6,
  haan: 17.6,
  cooker: 19.7,
  ya: 20.85,
  tu: 22.0,
  ekAur: 23.55,
  bas: 25.7,
  skip: 26.75,
  night: 28.6,
  teen: 29.6,
  shaadi: 31.4,
  phone: 34.15,
  promise: 35.9,
  cta: 37.95,
  comment: 40.45,
  end: 41.72,
};

const captions: Cap[] = [
  ...card([0.28, 1.4, "*Claude, ye *reel dekh."]),
  ...card([1.75, 3.34, "*Chachu *viral | kaise ho gaye?"]),
  ...card([3.84, 5.62, "Main *Instagram | nahi khol sakta."]),
  ...card([6.07, 7.31, "Ruk. *Video *file | deta hoon."]),
  ...card([7.58, 8.26, "Ye *plugin laga."]),
  ...card([8.89, 9.62, "Ab *kya milega?"]),
  ...card([10.19, 12.57, "Video ke *frames | aur jo bola, uska *text."]),
  ...card([13.21, 14.09, "Achha,"]),
  ...card([14.68, 17.28, "chachu *cooker ki *seeti pe | *naach rahe hain?"]),
  ...card([17.81, 19.42, "Haan. *Beat pakad li."]),
  ...card([19.94, 20.67, "*Cooker ne,"]),
  ...card([20.98, 21.76, "ya *chachu ne?"]),
  ...card([22.25, 23.12, "Tu *analysis kar."]),
  ...card([23.79, 25.43, "*Ek *aur video de. | *Compare karna hai."]),
  ...card([25.94, 26.61, "*Bas *ek."]),
  ...card([28.76, 31.06, "*Claude! *Teen baj gaye. | Analysis?"]),
  ...card([31.66, 33.81, "Chachu ki *shaadi wali | video bhi bhej."]),
  ...card([34.4, 35.45, "*Phone *wapas."]),
  ...card([36.08, 37.64, "*Bas *ek *aur. | *Promise."]),
  ...card([38.32, 40.08, "Tumhe bhi Claude ko | *video samjhana hai?"]),
  ...card([40.47, 41.37, "Comment *WATCH."]),
];

export const watch = {
  voiceover: "skit/voice.wav",
  voiceSeconds: 41.72,
  music: "skit/music.wav",
  env: voiceEnv as number[],
  captions,
  // [time, file in public/sfx, volume]. The series' own synthesised effects.
  sfx: [
    [0.05, "fx-reveal", 0.35],
    [C.reel + 0.55, "pop", 0.35],
    [C.claudeNo, "whoosh", 0.3],
    [C.claudeNo + 0.5, "warn", 0.3],
    [C.ruk, "whoosh", 0.3],
    [C.file, "swish", 0.4],
    [C.file + 0.5, "fx-pop", 0.35],
    [C.plugin, "typing", 0.3],
    [C.plugin + 0.75, "ding", 0.35],
    [C.kya, "whoosh", 0.3],
    [C.frames, "fx-connect", 0.35],
    ...[0, 1, 2, 3, 4, 5].map((i) => [C.frames + 0.25 + i * 0.12, "click", 0.18] as [number, string, number]),
    [C.text, "typing", 0.25],
    [C.achha, "whoosh", 0.3],
    [C.achha + 0.2, "fx-streak", 0.3],
    [C.seeti, "riser", 0.3],
    [C.seeti + 0.55, "fx-boom", 0.3],
    [C.haan, "whoosh", 0.3],
    [C.haan + 0.2, "sparkle", 0.3],
    [C.cooker, "whoosh", 0.3],
    [C.cooker + 0.3, "pop", 0.3],
    [C.ya, "pop", 0.3],
    [C.tu, "whoosh", 0.3],
    [C.ekAur, "whoosh", 0.3],
    [C.ekAur + 0.3, "fx-pop", 0.3],
    [C.bas, "snap", 0.3],
    [C.skip, "whoosh", 0.45],
    [C.skip + 0.2, "riser", 0.28],
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => [C.skip + 0.4 + i * 0.16, "click", 0.2] as [number, string, number]),
    [C.night, "impact", 0.32],
    [C.teen, "warn", 0.28],
    [C.shaadi, "whoosh", 0.3],
    [C.shaadi + 0.4, "sparkle", 0.3],
    [C.phone, "whoosh", 0.35],
    [C.phone + 0.35, "snap", 0.4],
    [C.promise, "whoosh", 0.25],
    [C.cta, "fx-reveal", 0.35],
    [C.comment - 0.2, "typing", 0.3],
    [C.comment + 0.5, "ding", 0.35],
  ] as [number, string, number][],
};
