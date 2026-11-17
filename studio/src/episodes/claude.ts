import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./claude-voice-env.json";

/**
 * Creator Secrets #05: "Claude Code ke liye alag se paise?", in the owner's Google AI Studio recording
 * (public/claude/voice.wav, 46.64 s, a byte-identical copy of "claude code api.wav", never edited).
 * Words come from whisper.cpp (small, Hindi) run on short pieces cut at the pauses; phrase times come from the
 * voice envelope (scripts/voice-env.mjs). Captions are Roman Hinglish, word for word, "3" for "teen".
 *
 * Fact check, 11 Nov 2026 (official pages): Claude Pro includes Claude Code (claude.com/pricing); the CLI asks you
 * to log in on first run, and an API key bills separately (code.claude.com/docs/en/overview). The narration's
 * "Gemini CLI ka free tier" is OUT OF DATE: the gemini-cli README says free individual access moved to
 * Antigravity CLI on 18 June 2026. The Gemini scene says so in large type, with the real README notice.
 */

const captions: Cap[] = [
  ...card([0.23, 1.57, "*Claude *Code ke liye"], [1.73, 2.87, "| alag se *paise de rahe ho?"]),
  ...card([3.3, 3.97, "*Ruko *zara!"]),
  ...card([4.4, 5.47, "Agar tumhare paas"], [5.57, 6.33, "| *Claude *Pro hai,"]),
  ...card([6.9, 7.67, "to *Claude *Code"], [7.87, 8.93, "| usi *plan mein *shaamil hai!"]),
  ...card([9.6, 9.9, "Bas"], [10.1, 10.73, "*3 *steps."]),
  ...card([11.27, 11.53, "*Pehla:"], [12.23, 13.1, "*official website se"]),
  ...card([13.27, 14.47, "*Claude *Code *install karo."]),
  ...card([15.2, 15.7, "*Doosra:"], [16.17, 16.83, "*terminal kholo,"]),
  ...card([17.2, 18.3, "*claude chalao"], [18.33, 20.03, "| aur apne *Pro *account se *login karo."]),
  ...card([20.8, 21.13, "*Teesra:"], [21.5, 23.03, "apna *project kholo aur bolo:"]),
  ...card([23.23, 24.6, "\"Mere *code ko *check karo,"], [24.77, 25.83, "| lekin kuch *badalna *mat.\""]),
  ...card([26.5, 27.43, "Aur *dhyan rakhna,"], [27.8, 29.1, "| *API *key se *login kiya,"]),
  ...card([29.17, 30.93, "to *alag *charges lag sakte hain."]),
  ...card([31.53, 32.53, "Lekin bilkul *free"], [32.63, 33.9, "| *coding *assistant chahiye?"]),
  ...card([34.17, 35.57, "To *Gemini *CLI ka"], [35.73, 36.63, "| *free *tier bhi"]),
  ...card([36.67, 37.17, "try kar sakte ho,"], [37.33, 37.97, "| *limits ke saath."]),
  ...card([38.7, 39.83, "Poora *setup aur"], [39.9, 40.67, "| *official *links chahiye?"]),
  ...card([41.1, 42.2, "*Comment karo *CODE!"]),
  ...card([42.6, 43.8, "Aur aisi *kaam ki"], [43.9, 44.57, "| *tricks ke liye,"]),
  ...card([44.87, 45.4, "*Follow karo"], [45.53, 46.5, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook: extra payment?!
  hook: 0.23,
  paise: 1.73,
  ruko: 3.3,
  // 2. Claude Pro includes Claude Code
  agar: 4.4,
  pro: 5.57,
  to: 6.9,
  plan: 7.87,
  shaamil: 8.35,
  // 3. Three steps
  bas: 9.6,
  teen: 10.1,
  // 4. Step 1: install
  step1: 11.27,
  official: 12.23,
  install: 13.27,
  // 5. Step 2: login
  step2: 15.2,
  terminal: 16.17,
  claudeCmd: 17.2,
  account: 18.33,
  login: 19.35,
  // 6. Step 3: review
  step3: 20.8,
  project: 21.5,
  bolo: 22.55,
  prompt: 23.23,
  mat: 24.77,
  // 7. API billing warning
  dhyan: 26.5,
  api: 27.8,
  apiLogin: 28.43,
  charges: 29.67,
  lag: 30.43,
  // 8. Gemini CLI (with the official update)
  free: 31.53,
  coding: 32.63,
  gemini: 34.17,
  freeTier: 35.73,
  limits: 37.33,
  // 9. Setup + comment
  setup: 38.7,
  links: 39.9,
  comment: 41.1,
  codeWord: 41.97,
  // 10. Follow
  aisi: 42.6,
  tricks: 44.1,
  follow: 44.87,
  brand: 45.53,
  end: 46.64,
};

export const claude = {
  voiceover: "claude/voice.wav",
  voiceSeconds: 46.64,
  music: "claude/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.5] },
    { at: C.hook, pose: "surprised", expr: "surprised", look: [0.6, -0.6], jump: true },
    { at: C.paise, pose: "explain", expr: "annoyed", look: [0.6, -0.4] },
    { at: C.ruko, pose: "point", aim: -70, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.agar, pose: "explain", expr: "talk", look: [0.6, -0.5] },
    { at: C.plan, pose: "thumbs", expr: "happy", look: [0.5, -0.5], jump: true },
    { at: C.bas, pose: "oneMore", expr: "excited", look: [0, -0.5] },
    { at: C.step1, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.install, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.step2, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.login, pose: "thumbs", expr: "happy", look: [0.5, -0.5] },
    { at: C.step3, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.prompt, pose: "think", expr: "thinking", look: [0.5, -0.7], tilt: 5 },
    { at: C.mat, pose: "explain", expr: "skeptic", look: [0.6, -0.5] },
    { at: C.dhyan, pose: "point", aim: -35, expr: "skeptic", look: [0.7, -0.5] },
    { at: C.charges, pose: "surprised", expr: "surprised", look: [0.7, -0.6] },
    { at: C.free, pose: "think", expr: "thinking", look: [-0.4, -0.6], tilt: -5 },
    { at: C.gemini, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8] },
    { at: C.freeTier + 0.3, pose: "surprised", expr: "skeptic", look: [0.5, -0.6] },
    { at: C.limits, pose: "explain", expr: "talk", look: [0.5, -0.5] },
    { at: C.setup, pose: "explain", expr: "happy", look: [0.5, -0.5] },
    { at: C.comment, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.aisi, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    // Beside the headline on the first frame.
    { at: -2, x: 260, y: 1060, s: 0.82 },
    { at: C.agar - 0.05, x: 830, y: 1440, s: 0.7 },
    { at: C.bas - 0.05, x: 540, y: 1440, s: 0.72 },
    { at: C.step1 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.dhyan - 0.1, x: 540, y: 1460, s: 0.68 },
    { at: C.free - 0.1, x: 830, y: 1440, s: 0.7 },
    { at: C.setup - 0.1, ...LAYOUT.avatar.corner },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.9, 4.6, 7.4, 10.4, 13.6, 16.9, 19.8, 23.0, 26.1, 29.3, 32.4, 35.2, 38.4, 41.7, 44.4],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "impact", 0.6],
    [0.05, "swish", 0.4],
    [C.paise, "coin", 0.35],
    [C.paise + 0.15, "coin", 0.3],
    [C.ruko - 0.02, "stamp", 0.6],
    [C.ruko, "impact", 0.45],
    // Pro
    [C.agar - 0.05, "whoosh", 0.4],
    [C.pro, "pop", 0.35],
    [C.to + 0.1, "swish", 0.35],
    [C.plan, "snap", 0.45],
    [C.shaamil, "ding", 0.38],
    [C.shaamil + 0.05, "sparkle", 0.35],
    // 3 steps
    [C.bas - 0.05, "whoosh", 0.35],
    ...[0, 0.2, 0.4].map((d) => [C.teen + d, "pop", 0.3] as [number, string, number]),
    // Step 1
    [C.step1 - 0.05, "whoosh", 0.4],
    [C.official, "click", 0.35],
    [C.install, "typing", 0.32],
    [C.install + 1.0, "ding", 0.3],
    // Step 2
    [C.step2 - 0.05, "whoosh", 0.4],
    [C.terminal, "pop", 0.3],
    [C.claudeCmd, "typing", 0.32],
    [C.account, "click", 0.4],
    [C.login, "ding", 0.35],
    [C.login + 0.05, "sparkle", 0.3],
    // Step 3
    [C.step3 - 0.05, "whoosh", 0.4],
    [C.project, "flip", 0.3],
    [C.prompt, "typing", 0.32],
    ...[0, 0.35, 0.7].map((d) => [C.mat + 0.4 + d, "pop", 0.25] as [number, string, number]),
    // API warning
    [C.dhyan - 0.05, "whoosh", 0.4],
    [C.api, "pop", 0.35],
    [C.charges - 0.02, "warn", 0.45],
    [C.charges, "impact", 0.35],
    // Gemini
    [C.free - 0.1, "riser", 0.25],
    [C.gemini - 0.02, "impact", 0.5],
    [C.gemini, "sparkle", 0.35],
    [C.freeTier + 0.25, "stamp", 0.55],
    [C.freeTier + 0.3, "warn", 0.35],
    [C.limits, "swish", 0.35],
    // Setup + comment
    [C.setup - 0.05, "whoosh", 0.4],
    ...[0, 0.18, 0.36].map((d) => [C.links + d, "pop", 0.25] as [number, string, number]),
    [C.comment, "pop", 0.35],
    [C.codeWord - 0.25, "typing", 0.3],
    [C.codeWord + 0.25, "click", 0.45],
    [C.codeWord + 0.27, "sparkle", 0.35],
    // Follow
    [C.aisi - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.3],
    [C.follow, "pop", 0.32],
    [C.brand, "sparkle", 0.4],
  ] as [number, string, number][],
};
