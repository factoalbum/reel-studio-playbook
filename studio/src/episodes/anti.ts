import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./anti-voice-env.json";

/**
 * Creator Secrets: "Tum abhi bhi Claude par ₹2,000 barbaad kar rahe ho... sirf Reels Edit karne ke liye?!": the
 * owner's Google AI Studio recording (public/anti/voice.wav, 58.24 s, a byte-identical copy of "Generated Audio
 * November 15, 2026 - 6_32PM.wav", never edited). Phrase edges come from the pauses in the voice (silencedetect
 * -40 dB); words were checked with whisper.cpp (small, Hindi) on pieces cut at the pauses. Roman Hinglish.
 *
 * Fact check, 15 Nov 2026:
 * - antigravity.google/docs/models: Claude Sonnet 4.6 (thinking), Claude Opus 4.6 (thinking) and GPT-OSS-120b are
 *   on Free & Google AI Plus and "Will be removed on November 18, 2026". Gemini 3.8 Flash stays on Free (the
 *   table also lists Gemini 4 Hydrogen). 18 Nov 2026 is a Wednesday.
 * - antigravity.google/docs/plans: without Pro or Ultra you get "A meaningful quota, refreshed weekly" and
 *   "A weekly rate limit". Google publishes no number, so the meter on screen is illustrative and labelled.
 * - Claude Pro in India: about ₹2,000 a month on annual billing, ₹2,399 monthly (news coverage, July 2026).
 *   The reel shows the figure with a question mark; it is not a promise of savings.
 * - We build our own reels with Claude Code. The Antigravity workflow is shown as an illustration and has not
 *   been run end to end by us; nothing on screen claims a tested result.
 * - Instagram DMs are restricted until 4 Dec 2026: no DM is shown or promised.
 */

const captions: Cap[] = [
  ...card([0.23, 1.06, "Tum abhi bhi"], [1.15, 2.75, "*Claude par *₹2,000"]),
  ...card([2.75, 3.5, "*barbaad kar rahe ho..."]),
  ...card([3.84, 5.42, "sirf *Reels *Edit karne ke liye?!"]),
  ...card([5.74, 6.4, "Wahi kaam"], [6.4, 7.7, "*Google *Antigravity ke"]),
  ...card([7.7, 9.95, "*Free *Plan mein bhi kar sakte ho!"]),
  ...card([10.51, 10.86, "Bas"], [11.02, 12.06, "ye *chaar *Steps dekho!"]),
  ...card([12.74, 13.36, "*Pehla!"], [13.48, 14.7, "Apna *Reel *Project *Folder"]),
  ...card([14.7, 16.04, "*Antigravity mein kholo!"]),
  ...card([16.6, 17.0, "*Doosra!"], [17.4, 18.3, "*Prompt do:"]),
  ...card([18.3, 19.62, "Setup *Video *Engine with"]),
  ...card([19.62, 20.3, "*Remotion,"], [20.5, 21.2, "*FFmpeg"], [21.42, 21.93, "aur *Whisper!"]),
  ...card([22.86, 23.45, "*Teesra!"], [23.59, 25.5, "Apni pasand ki *Reels se"]),
  ...card([25.7, 26.04, "*Fonts,"], [26.12, 27.24, "*Cuts aur *Transitions ki"]),
  ...card([27.33, 28.18, "*Style *Guide banwao!"]),
  ...card([29.16, 29.75, "*Chautha!"], [29.75, 31.58, "Apna *Voiceover ya *Footage daalo..."]),
  ...card([31.9, 32.47, "*Captions,"], [32.57, 33.4, "*Animations aur"]),
  ...card([33.4, 34.66, "*Final *Reel taiyaar karwao!"]),
  ...card([35.43, 35.94, "Lekin"], [36.09, 37.87, "asli *twist abhi baaki hai!"]),
  ...card([38.39, 39.3, "*18 *November se"], [39.3, 41.52, "*Antigravity ke *Free *Plan se"]),
  ...card([41.69, 43.62, "*Claude *Models hat rahe hain!"]),
  ...card([43.78, 45.1, "*Gemini *Flash rahega..."]),
  ...card([45.1, 46.72, "lekin *Weekly *Limits ke saath!"]),
  ...card([47.46, 47.84, "Aur haan,"], [48.09, 48.92, "*Final *Video"]),
  ...card([49.11, 49.65, "*khud *Check"], [49.76, 50.79, "karna zaroori hai!"]),
  ...card([51.62, 52.44, "Poora *Setup chahiye?"]),
  ...card([52.93, 53.41, "*Comment karo"], [53.58, 53.9, "*EDIT!"]),
  ...card([54.12, 54.72, "Aur aisi"], [54.85, 56.08, "kaam ki *AI *Tricks ke liye"]),
  ...card([56.4, 56.85, "*Follow karo"], [57.0, 57.93, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  tum: 0.23,
  claude: 1.15,
  hazaar: 2.1,
  barbaad: 2.75,
  sirf: 3.84,
  edit: 4.4,
  // 2. Free alternative
  wahi: 5.74,
  google: 6.4,
  free: 7.7,
  sakte: 9.1,
  // 3. Four steps
  bas: 10.51,
  chaar: 11.02,
  // 4. Step 1
  pehla: 12.74,
  apna: 13.48,
  anti: 14.7,
  kholo: 15.5,
  // 5. Step 2
  doosra: 16.6,
  prompt: 17.4,
  setup: 18.3,
  remotion: 19.62,
  ffmpeg: 20.5,
  whisper: 21.42,
  // 6. Step 3
  teesra: 22.86,
  apni: 23.59,
  fonts: 25.7,
  cuts: 26.12,
  trans: 26.6,
  style: 27.33,
  // 7. Step 4
  chautha: 29.16,
  voice: 29.75,
  captions: 31.9,
  anims: 32.57,
  final: 33.4,
  taiyaar: 34.0,
  // 8. Rehook
  lekin: 35.43,
  asli: 36.09,
  baaki: 37.2,
  // 9. 18 November
  date: 38.39,
  anti2: 39.3,
  claudeM: 41.69,
  hat: 42.6,
  // 10. Gemini Flash
  gemini: 43.78,
  weekly: 45.4,
  // 11. QC
  haan: 47.46,
  finalV: 48.09,
  check: 49.11,
  zaroori: 49.76,
  // 12. CTA
  setupQ: 51.62,
  comment: 52.93,
  editWord: 53.58,
  // 13. Follow
  aisi: 54.12,
  tricks: 55.2,
  follow: 56.4,
  brand: 57.0,
  end: 58.24,
};

export const anti = {
  voiceover: "anti/voice.wav",
  voiceSeconds: 58.24,
  music: "anti/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.3, -0.8], jump: true },
    { at: C.barbaad, pose: "explain", expr: "annoyed", look: [0.4, -0.7] },
    { at: C.sirf, pose: "think", expr: "skeptic", look: [0.2, -0.7], tilt: 5 },
    { at: C.wahi, pose: "oneMore", expr: "happy", look: [0.4, -0.6], jump: true },
    { at: C.free, pose: "surprised", expr: "excited", look: [0.3, -0.8], jump: true },
    { at: C.bas, pose: "point", aim: -50, expr: "talk", look: [0.5, -0.7] },
    { at: C.pehla, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.kholo, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.doosra, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.remotion, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.teesra, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.fonts, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.style, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.chautha, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.captions, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.taiyaar, pose: "thumbs", expr: "excited", look: [0.5, -0.6], jump: true },
    { at: C.lekin, pose: "think", expr: "thinking", look: [0, -0.4], tilt: 5 },
    { at: C.baaki, pose: "oneMore", expr: "excited", look: [0, -0.3], jump: true },
    { at: C.date, pose: "surprised", expr: "surprised", look: [0.3, -0.8], jump: true },
    { at: C.claudeM, pose: "explain", expr: "skeptic", look: [0.5, -0.6] },
    { at: C.gemini, pose: "point", aim: -50, expr: "talk", look: [0.5, -0.7] },
    { at: C.weekly, pose: "oneMore", expr: "skeptic", look: [0.4, -0.6] },
    { at: C.haan, pose: "oneMore", expr: "talk", look: [0.3, -0.5] },
    { at: C.check, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.zaroori + 0.4, pose: "thumbs", expr: "happy", look: [0.4, -0.5] },
    { at: C.setupQ, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.comment, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.aisi, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1450, s: 0.8 },
    { at: C.pehla - 0.1, ...LAYOUT.avatar.corner },
    { at: C.lekin - 0.1, x: 540, y: 1450, s: 0.78 },
    { at: C.gemini - 0.1, ...LAYOUT.avatar.corner },
    { at: C.setupQ - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.6, 4.6, 7.4, 10.3, 13.2, 16.3, 19.2, 22.4, 25.3, 28.6, 31.5, 34.5, 37.0, 40.6, 43.5, 46.9, 50.2, 52.6, 55.6, 57.8],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.claude, "flip", 0.4],
    [C.hazaar - 0.04, "fx-boom", 0.5],
    [C.hazaar, "coin", 0.36],
    [C.barbaad, "warn", 0.36],
    [C.sirf - 0.06, "whoosh", 0.4],
    [C.sirf, "stamp", 0.5],
    // Free alternative
    [C.wahi - 0.08, "whoosh", 0.4],
    [C.google - 0.04, "fx-boom", 0.45],
    [C.google, "fx-reveal", 0.46],
    [C.google + 0.05, "sparkle", 0.34],
    [C.free, "fx-pop", 0.42],
    [C.sakte, "fx-connect", 0.34],
    // Four steps
    [C.bas - 0.08, "whoosh", 0.4],
    ...[0, 1, 2, 3].map((i) => [C.chaar + i * 0.2, "pop", 0.3] as [number, string, number]),
    // Step 1
    [C.pehla - 0.05, "fx-step1", 0.48],
    [C.apna, "swish", 0.32],
    [C.anti, "flip", 0.36],
    [C.kholo, "click", 0.4],
    [C.kholo + 0.15, "ding", 0.3],
    // Step 2
    [C.doosra - 0.05, "fx-step2", 0.48],
    [C.prompt + 0.2, "typing", 0.32],
    [C.setup + 0.5, "typing", 0.3],
    [C.remotion, "fx-pop", 0.4],
    [C.ffmpeg, "fx-pop", 0.4],
    [C.whisper, "fx-pop", 0.4],
    [C.whisper + 0.35, "fx-connect", 0.38],
    // Step 3
    [C.teesra - 0.05, "fx-step3", 0.48],
    ...[0, 1, 2].map((i) => [C.apni + 0.3 + i * 0.25, "swish", 0.26] as [number, string, number]),
    [C.fonts, "pop", 0.32],
    [C.cuts, "pop", 0.32],
    [C.trans, "pop", 0.32],
    [C.style, "flip", 0.4],
    [C.style + 0.05, "sparkle", 0.32],
    // Step 4
    [C.chautha - 0.08, "whoosh", 0.4],
    [C.chautha, "fx-pop", 0.44],
    [C.voice, "swish", 0.3],
    [C.captions, "fx-connect", 0.34],
    [C.anims, "fx-connect", 0.34],
    [C.final, "fx-connect", 0.34],
    [C.taiyaar, "fx-boom", 0.4],
    [C.taiyaar + 0.03, "ding", 0.36],
    // Rehook
    [C.lekin - 0.1, "fx-boom", 0.45],
    [C.lekin, "whoosh", 0.38],
    [C.asli, "riser", 0.4],
    [C.baaki, "stamp", 0.46],
    // 18 November
    [C.date - 0.04, "fx-boom", 0.55],
    [C.date, "flip", 0.42],
    [C.date + 0.05, "fx-reveal", 0.42],
    [C.claudeM, "swish", 0.32],
    [C.hat, "warn", 0.38],
    [C.hat + 0.02, "stamp", 0.42],
    // Gemini Flash
    [C.gemini - 0.08, "whoosh", 0.38],
    [C.gemini, "fx-reveal", 0.42],
    [C.gemini + 0.05, "sparkle", 0.32],
    [C.weekly, "pop", 0.32],
    [C.weekly + 0.5, "click", 0.3],
    // QC
    [C.haan - 0.08, "whoosh", 0.4],
    [C.haan, "pop", 0.32],
    ...[0, 1, 2, 3, 4].map((i) => [C.finalV + 0.1 + i * 0.42, "click", 0.34] as [number, string, number]),
    [C.zaroori + 0.4, "ding", 0.36],
    // CTA
    [C.setupQ, "pop", 0.3],
    [C.comment - 0.05, "fx-boom", 0.45],
    [C.comment, "swish", 0.32],
    [C.editWord, "fx-pop", 0.52],
    [C.editWord + 0.02, "sparkle", 0.34],
    // Follow
    [C.aisi - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.28],
    [C.follow, "pop", 0.32],
    [C.brand, "fx-pop", 0.4],
    [C.brand + 0.03, "sparkle", 0.36],
  ] as [number, string, number][],
};
