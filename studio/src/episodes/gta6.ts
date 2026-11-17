import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./gta6-voice-env.json";

/**
 * Creator Secrets: "GTA 6 ki Reels banakar paise kamaane ka soch rahe ho?": the owner's Google AI Studio
 * recording (public/gta6/voice.wav, 53.00 s, a byte-identical copy of "Generated Audio November 14, 2026 -
 * 10_46AM.wav", never edited). Phrase edges come from the pauses in the voice envelope; words were checked with
 * whisper.cpp (small) on the whole file and on pieces cut at the pauses. Captions are Roman Hinglish.
 *
 * Fact check, 14 Nov 2026:
 * - GTA 6 release date: Thursday 19 November 2026, announced by Rockstar Games and repeated in Take-Two's
 *   9 Nov 2026 earnings report. PS5 and Xbox Series X|S.
 * - The kit is real and live: internetoolbox.com/ai-reel-kit, INR 49, a ready-made Claude Code folder and
 *   6 copy-paste prompts; it needs a paid Claude plan. Instagram DMs are restricted, so nothing on screen
 *   promises a DM or automatic delivery: the call to action is the link in bio.
 * - No income is promised. The reel says a gameplay clip alone does not earn.
 */

const captions: Cap[] = [
  ...card([0.17, 1.92, "*GTA *6 ki Reels banakar"]),
  ...card([1.96, 3.53, "*paise kamaane ka soch rahe ho?"]),
  ...card([4.03, 4.57, "Bhai, *ruko zara!"]),
  ...card([4.97, 5.9, "Sirf *gameplay daalne se"], [5.95, 6.87, "| *kamaai *nahi hoti."]),
  ...card([7.4, 8.4, "*19 *November ko"]),
  ...card([8.45, 9.97, "*GTA *6 launch ho raha hai"]),
  ...card([10.17, 11.05, "aur tum abhi bhi sirf"]),
  ...card([11.09, 12.53, "reels *scroll kar rahe ho?"]),
  ...card([13.1, 13.37, "Toh dekho,"], [13.63, 14.35, "main apni"]),
  ...card([14.39, 15.57, "*AI *Reels kaise banata hoon."]),
  ...card([15.97, 17.85, "Sabse pehle *ChatGPT se"]),
  ...card([18.1, 19.07, "damdaar *hook"], [19.2, 19.7, "aur *script."]),
  ...card([20.17, 20.47, "Phir"], [20.63, 21.65, "*Google *AI *Studio se"]),
  ...card([21.7, 22.43, "*voiceover."]),
  ...card([22.77, 23.03, "Aur ab"], [23.23, 23.53, "*asli"], [23.73, 24.73, "*game shuru!"]),
  ...card([25.23, 26.85, "*Claude *Code aur *Remotion se"]),
  ...card([26.89, 27.73, "*animation,"], [27.97, 28.73, "*captions"]),
  ...card([28.9, 30.1, "aur poori *reel taiyaar!"]),
  ...card([30.43, 31.6, "Bina ghanton"], [31.65, 32.9, "| *manual *timeline *editing ke!"]),
  ...card([33.37, 33.6, "Haan,"], [33.87, 34.88, "*final *quality *check"]),
  ...card([34.92, 35.6, "khud karna padta hai."]),
  ...card([36.17, 36.84, "Ab tum bhi aisi"]),
  ...card([36.87, 38.63, "*animated *reels banana chahte ho?"]),
  ...card([39.1, 40.78, "Meri *AI *Reel *Kit mein hai"]),
  ...card([40.81, 42.43, "ready-made *Claude *Code *folder"]),
  ...card([42.67, 43.2, "aur *6"], [43.33, 44.53, "*copy-paste *prompts."]),
  ...card([45.0, 45.83, "Poora setup chahiye?"]),
  ...card([46.07, 46.93, "*Link *bio mein hai."]),
  ...card([47.47, 48.8, "*Comment karo *GTA!"]),
  ...card([49.23, 50.63, "Aur aisi *AI *tricks ke liye"]),
  ...card([50.93, 51.5, "*follow karo"], [51.55, 52.7, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  gta: 0.17,
  paise: 1.96,
  soch: 2.86,
  ruko: 4.03,
  sirf: 4.97,
  kamaai: 5.95,
  nahi: 6.2,
  // 2. 19 November
  date: 7.4,
  launch: 8.6,
  aurTum: 10.17,
  scroll: 11.3,
  // 3. How I make my reels
  toh: 13.1,
  main: 13.63,
  kaise: 14.63,
  // 4. ChatGPT
  sabse: 15.97,
  chatgpt: 16.8,
  hook: 18.6,
  script: 19.25,
  // 5. Google AI Studio
  phir: 20.17,
  studio: 20.63,
  voiceover: 21.85,
  // 6. Asli game shuru
  aurAb: 22.77,
  asli: 23.23,
  game: 23.73,
  shuru: 24.1,
  // 7. Claude Code + Remotion
  claude: 25.23,
  remotion: 26.05,
  anim: 26.89,
  captions: 27.97,
  poori: 28.9,
  taiyaar: 29.47,
  // 8. No manual timeline editing
  bina: 30.43,
  ghanton: 30.99,
  editing: 32.4,
  haan: 33.37,
  // 9. The kit
  ab: 36.17,
  animated: 36.87,
  chahte: 38.16,
  meri: 39.1,
  kit: 39.85,
  ready: 40.81,
  chhe: 42.67,
  prompts: 43.33,
  // 10. Link in bio, comment GTA
  poora: 45.0,
  link: 46.07,
  comment: 47.47,
  gtaWord: 48.3,
  // 11. Follow
  aur: 49.23,
  tricks: 49.7,
  follow: 50.93,
  brand: 51.55,
  end: 53.0,
};

export const gta6 = {
  voiceover: "gta6/voice.wav",
  voiceSeconds: 53.0,
  music: "gta6/music.wav",
  env: voiceEnv as number[],
  captions,
  /** On-screen line for the honest "you still check it yourself" beat (scene 8). */
  checkLine: "Final quality check: khud",

  avatarKeys: [
    { at: -1, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 5 },
    { at: C.paise, pose: "surprised", expr: "excited", look: [0.4, -0.7], jump: true },
    { at: C.ruko, pose: "oneMore", expr: "skeptic", look: [0.2, -0.5], jump: true },
    { at: C.sirf, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.date, pose: "surprised", expr: "surprised", look: [0.5, -0.8], jump: true },
    { at: C.aurTum, pose: "point", aim: -40, expr: "annoyed", look: [0.7, -0.5] },
    { at: C.toh, pose: "oneMore", expr: "happy", look: [0, -0.5], jump: true },
    { at: C.sabse, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.hook, pose: "thumbs", expr: "happy", look: [0.6, -0.6] },
    { at: C.phir, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.voiceover, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.aurAb, pose: "oneMore", expr: "excited", look: [0, -0.6] },
    { at: C.shuru, pose: "surprised", expr: "excited", look: [0.2, -0.8], jump: true },
    { at: C.claude, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.anim, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.taiyaar, pose: "thumbs", expr: "excited", look: [0.6, -0.6], jump: true },
    { at: C.bina, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.haan, pose: "think", expr: "thinking", look: [0.6, -0.5], tilt: 4 },
    { at: C.ab, pose: "oneMore", expr: "happy", look: [0, -0.6] },
    { at: C.meri, pose: "point", aim: -45, expr: "excited", look: [0.6, -0.6], jump: true },
    { at: C.ready, pose: "explain", expr: "happy", look: [0.6, -0.5] },
    { at: C.poora, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.link, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.comment, pose: "point", aim: -40, expr: "happy", look: [0.6, -0.6] },
    { at: C.aur, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1460, s: 0.76 },
    { at: C.sirf - 0.1, x: 800, y: 1460, s: 0.7 },
    { at: C.date - 0.1, ...LAYOUT.avatar.corner },
    { at: C.toh - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.sabse - 0.1, ...LAYOUT.avatar.corner },
    { at: C.aurAb - 0.1, x: 540, y: 1470, s: 0.74 },
    { at: C.claude - 0.1, ...LAYOUT.avatar.corner },
    { at: C.ab - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.meri - 0.1, ...LAYOUT.avatar.corner },
    { at: C.poora - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.6, 4.6, 7.2, 10.0, 12.9, 15.8, 19.0, 22.6, 25.0, 28.2, 31.2, 34.0, 36.4, 39.0, 42.5, 45.5, 48.9, 51.9],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    ...[0, 1, 2, 3, 4, 5].map((i) => [C.paise + i * 0.09, "coin", 0.26] as [number, string, number]),
    [C.ruko - 0.06, "whoosh", 0.4],
    [C.ruko, "stamp", 0.5],
    [C.sirf, "swish", 0.32],
    [C.nahi - 0.02, "warn", 0.4],
    [C.nahi, "stamp", 0.42],
    // 19 November
    [C.date - 0.08, "whoosh", 0.4],
    [C.date, "flip", 0.4],
    [C.date + 0.05, "fx-reveal", 0.4],
    [C.launch, "fx-boom", 0.42],
    [C.launch + 0.04, "sparkle", 0.32],
    [C.aurTum, "swish", 0.34],
    ...[0, 0.42, 0.84, 1.26].map((d) => [C.aurTum + 0.3 + d, "swish", 0.18] as [number, string, number]),
    [C.scroll, "stamp", 0.42],
    // How I make my reels
    [C.toh - 0.08, "whoosh", 0.4],
    [C.toh, "fx-pop", 0.4],
    ...[0, 1, 2, 3].map((i) => [C.main + 0.15 + i * 0.22, "fx-connect", 0.3] as [number, string, number]),
    // ChatGPT
    [C.sabse - 0.05, "fx-step1", 0.48],
    [C.chatgpt + 0.5, "typing", 0.32],
    [C.hook, "stamp", 0.42],
    [C.script, "stamp", 0.4],
    // Google AI Studio
    [C.phir - 0.05, "fx-step2", 0.48],
    [C.studio, "fx-reveal", 0.34],
    [C.voiceover, "stamp", 0.42],
    [C.voiceover + 0.04, "ding", 0.3],
    // Asli game shuru
    [C.aurAb, "riser", 0.34],
    [C.asli, "fx-pop", 0.42],
    [C.shuru - 0.04, "fx-boom", 0.52],
    [C.shuru, "fx-reveal", 0.42],
    [C.shuru + 0.05, "sparkle", 0.34],
    // Claude Code + Remotion
    [C.claude - 0.08, "whoosh", 0.4],
    [C.claude, "fx-step3", 0.48],
    [C.claude + 0.2, "typing", 0.3],
    [C.remotion, "typing", 0.3],
    [C.anim, "fx-connect", 0.34],
    [C.captions, "fx-connect", 0.34],
    [C.poori, "flip", 0.32],
    [C.taiyaar, "fx-boom", 0.4],
    [C.taiyaar + 0.03, "ding", 0.36],
    // No manual timeline editing
    [C.bina, "swish", 0.34],
    [C.ghanton, "pop", 0.3],
    [C.editing - 0.1, "warn", 0.38],
    [C.editing, "stamp", 0.45],
    [C.haan, "pop", 0.32],
    // The kit
    [C.ab - 0.08, "whoosh", 0.4],
    [C.animated, "fx-pop", 0.4],
    [C.meri, "swish", 0.34],
    [C.kit, "fx-reveal", 0.42],
    [C.kit + 0.04, "sparkle", 0.32],
    [C.ready, "pop", 0.34],
    [C.chhe, "pop", 0.34],
    [C.prompts + 0.3, "click", 0.3],
    // Link in bio, comment GTA
    [C.poora, "pop", 0.3],
    [C.link - 0.05, "fx-boom", 0.45],
    [C.link, "fx-reveal", 0.42],
    [C.comment, "swish", 0.32],
    [C.gtaWord, "fx-pop", 0.52],
    [C.gtaWord + 0.02, "sparkle", 0.34],
    // Follow
    [C.aur - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.28],
    [C.follow, "pop", 0.32],
    [C.brand, "fx-pop", 0.4],
    [C.brand + 0.03, "sparkle", 0.36],
  ] as [number, string, number][],
};
