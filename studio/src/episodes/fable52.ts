import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./fable52-voice-env.json";

/**
 * "Bhai, Fable 5.2 free mein use karo… bas kuch hi dino ke liye!": the owner's recording
 * (public/fable52/voice.wav, 42.44 s, a byte-identical copy of "Generated Audio November 14, 2026 - 10_10AM.wav",
 * never edited). Phrase edges come from the pauses in the voice envelope; words were checked with whisper.cpp
 * (small) on the whole file and on pieces cut at the pauses. Captions are Roman Hinglish, word for word.
 *
 * Fact check, 14 Nov 2026 (Anthropic help article "Claude Fable 5.2 launch offers"):
 * - Fable 5.2 launched on 9 Nov 2026.
 * - Pro and standard Team seats get Fable 5.2 included for one week, ending 16 Nov 2026 at 11:59 pm PT
 *   (about 1:29 pm IST on 17 Nov), for up to 50% of weekly usage limits.
 * - Only for subscriptions whose billing was in place before 9 Nov 2026, 10:00 am PT. Not on the Free plan.
 * So "free mein" is true only as "no extra cost for eligible Claude Pro plans, for a few days". The screen says
 * that in the hook and in the Pro scene. The reel must go out before the offer ends.
 */

const captions: Cap[] = [
  ...card([0.17, 0.6, "Bhai,"], [0.93, 2.02, "*Fable *5.2"]),
  ...card([2.11, 3.33, "*free mein use karo…"]),
  ...card([3.57, 4.83, "bas *kuch *hi *dino ke liye!"]),
  ...card([5.07, 5.7, "*Claude *Pro hai?"]),
  ...card([5.93, 7.1, "Toh abhi bina *extra *cost ke"]),
  ...card([7.15, 8.37, "isse *try kar sakte ho."]),
  ...card([8.8, 9.33, "Toh ye *3"], [9.5, 11.1, "*kamaal ke kaam karo!"]),
  ...card([11.53, 12.23, "*Number *3!"]),
  ...card([12.63, 13.4, "Apne baare mein"]),
  ...card([13.42, 14.9, "*5 *sawaalon ke jawaab do…"]),
  ...card([15.13, 15.97, "aur AI se"], [16.17, 16.77, "apna khud ka"]),
  ...card([16.9, 18.1, "*3D *Animal *Mascot"]),
  ...card([18.14, 19.07, "design karwao!"]),
  ...card([19.47, 20.03, "*Number *2!"]),
  ...card([20.4, 21.9, "Apne *2027 ke *Goals"], [21.95, 22.5, "batao…"]),
  ...card([22.56, 23.63, "aur *Month-by-Month"]),
  ...card([23.9, 25.43, "poora *Action *Plan banwao!"]),
  ...card([25.87, 26.83, "Aur *number *1!"]),
  ...card([27.2, 28.0, "*Claude *Code se"]),
  ...card([28.2, 29.36, "apni *AI *Reel banane ka"]),
  ...card([29.4, 30.6, "*Workflow taiyaar karwao!"]),
  ...card([31.13, 32.35, "Aur aisi *Animated *Reels"]),
  ...card([32.39, 33.5, "banana seekhna hai?"]),
  ...card([33.8, 35.03, "*Comment karo *KIT!"]),
  ...card([35.33, 36.5, "Poori *AI *Reel banane ka"]),
  ...card([36.55, 37.7, "*Step-by-Step *Setup"]),
  ...card([37.93, 38.53, "aur *Prompts"], [38.67, 39.3, "share karunga!"]),
  ...card([39.5, 40.73, "Aur aisi *AI *Tricks ke liye"]),
  ...card([40.97, 41.33, "*Follow karo"], [41.36, 42.35, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  bhai: 0.17,
  fable: 0.93,
  fiveTwo: 1.3,
  free: 2.11,
  bas: 3.57,
  dino: 4.15,
  // 2. Claude Pro
  pro: 5.07,
  toh: 5.93,
  extra: 6.55,
  tryK: 7.45,
  // 3. Countdown
  ye: 8.8,
  teen: 9.0,
  kaam: 10.27,
  // 4. Number 3: mascot
  n3: 11.53,
  apne: 12.63,
  paanch: 13.42,
  jawab: 14.31,
  aurAi: 15.13,
  threeD: 16.9,
  mascot: 17.7,
  // 5. Number 2: 2027 plan
  n2: 19.47,
  goals2027: 20.72,
  month: 22.7,
  plan: 24.6,
  // 6. Number 1: Claude Code workflow
  n1: 25.87,
  claudeCode: 27.2,
  reel: 28.6,
  workflow: 29.4,
  taiyaar: 29.87,
  // 7. Kit
  aisi: 31.13,
  animated: 31.44,
  seekhna: 32.8,
  // 8. Comment KIT
  comment: 33.8,
  kit: 34.7,
  step: 36.55,
  setup: 37.34,
  prompts: 38.05,
  // 9. Follow
  aur: 39.5,
  tricks: 39.9,
  follow: 40.97,
  brand: 41.36,
  end: 42.44,
};

export const fable52 = {
  voiceover: "fable52/voice.wav",
  voiceSeconds: 42.44,
  music: "fable52/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.4, -0.7] },
    { at: C.bhai, pose: "surprised", expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.free, pose: "surprised", expr: "surprised", look: [0.5, -0.7], jump: true },
    { at: C.bas, pose: "oneMore", expr: "excited", look: [0.2, -0.7] },
    { at: C.pro, pose: "point", aim: -55, expr: "talk", look: [0.6, -0.7] },
    { at: C.extra, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.ye, pose: "oneMore", expr: "excited", look: [0, -0.6], jump: true },
    { at: C.n3, pose: "point", aim: -50, expr: "excited", look: [0.6, -0.7] },
    { at: C.apne, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.aurAi, pose: "think", expr: "thinking", look: [0.6, -0.7], tilt: 4 },
    { at: C.threeD, pose: "surprised", expr: "excited", look: [0.6, -0.8], jump: true },
    { at: C.n2, pose: "point", aim: -50, expr: "excited", look: [0.6, -0.7] },
    { at: C.goals2027, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.month, pose: "point", aim: -40, expr: "happy", look: [0.6, -0.6] },
    { at: C.n1, pose: "oneMore", expr: "excited", look: [0.3, -0.7], jump: true },
    { at: C.claudeCode, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.workflow, pose: "thumbs", expr: "happy", look: [0.6, -0.6] },
    { at: C.aisi, pose: "think", expr: "thinking", look: [0.5, -0.7], tilt: 5 },
    { at: C.comment, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6], jump: true },
    { at: C.step, pose: "explain", expr: "happy", look: [0.5, -0.5] },
    { at: C.aur, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 280, y: 1450, s: 0.8 },
    { at: C.pro - 0.1, ...LAYOUT.avatar.corner },
    { at: C.ye - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.n3 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.aisi - 0.1, x: 540, y: 1460, s: 0.7 },
    { at: C.comment - 0.1, ...LAYOUT.avatar.corner },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.7, 4.6, 7.9, 10.8, 13.9, 16.4, 19.2, 22.3, 25.5, 28.1, 31.0, 33.6, 36.9, 39.4, 41.9],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook: hit on frame 0, slam on FREE?!, stamp on LIMITED TIME
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.fable, "fx-reveal", 0.4],
    [C.free - 0.06, "whoosh", 0.4],
    [C.free, "fx-boom", 0.5],
    [C.free + 0.04, "sparkle", 0.32],
    [C.bas, "stamp", 0.45],
    [C.dino, "pop", 0.28],
    // Claude Pro
    [C.pro - 0.05, "whoosh", 0.36],
    [C.pro, "fx-pop", 0.4],
    [C.toh + 0.1, "fx-connect", 0.36],
    ...[0, 0.22, 0.44, 0.66].map((d) => [C.toh + 0.2 + d, "click", 0.26] as [number, string, number]),
    [C.extra, "stamp", 0.45],
    [C.tryK, "ding", 0.3],
    // Countdown
    [C.ye - 0.05, "fx-streak", 0.36],
    [C.teen, "fx-step3", 0.45],
    [C.teen + 0.68, "fx-step2", 0.45],
    [C.teen + 1.35, "fx-step1", 0.45],
    // Number 3
    [C.n3 - 0.08, "whoosh", 0.4],
    [C.n3, "fx-step3", 0.5],
    [C.apne, "swish", 0.3],
    ...[0, 1, 2, 3, 4].map((i) => [C.paanch + i * 0.18, "pop", 0.24] as [number, string, number]),
    ...[0, 1, 2, 3, 4].map((i) => [C.jawab + i * 0.16, "click", 0.3] as [number, string, number]),
    [C.aurAi, "riser", 0.3],
    [C.threeD - 0.05, "fx-boom", 0.42],
    [C.threeD, "fx-reveal", 0.45],
    [C.mascot, "sparkle", 0.36],
    // Number 2
    [C.n2 - 0.08, "whoosh", 0.4],
    [C.n2, "fx-step2", 0.5],
    ...[0, 1, 2].map((i) => [C.goals2027 + 0.1 + i * 0.5, "pop", 0.3] as [number, string, number]),
    [C.month - 0.1, "flip", 0.34],
    ...Array.from({ length: 12 }, (_, i) => [C.month + i * 0.235, "click", 0.2] as [number, string, number]),
    [C.plan, "fx-reveal", 0.36],
    // Number 1
    [C.n1 - 0.08, "whoosh", 0.42],
    [C.n1, "fx-step1", 0.5],
    [C.n1 + 0.4, "fx-boom", 0.36],
    [C.claudeCode, "typing", 0.32],
    [C.claudeCode + 0.7, "typing", 0.3],
    [C.claudeCode + 0.75, "flip", 0.3],
    ...[0, 1, 2, 3, 4, 5].map((i) => [C.reel + 0.2 + i * 0.27, "fx-connect", 0.24] as [number, string, number]),
    [C.taiyaar + 0.4, "ding", 0.34],
    // Kit
    [C.aisi - 0.08, "whoosh", 0.38],
    [C.aisi + 0.25, "swish", 0.3],
    [C.animated, "fx-reveal", 0.4],
    [C.seekhna, "pop", 0.3],
    [C.seekhna + 0.15, "pop", 0.28],
    // Comment KIT
    [C.comment, "fx-reveal", 0.36],
    [C.kit, "fx-pop", 0.52],
    [C.kit + 0.02, "sparkle", 0.34],
    [C.step, "pop", 0.3],
    [C.setup, "pop", 0.3],
    [C.prompts, "pop", 0.32],
    // Follow
    [C.aur - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.28],
    [C.follow, "pop", 0.32],
    [C.brand, "fx-pop", 0.4],
    [C.brand + 0.03, "sparkle", 0.36],
  ] as [number, string, number][],
};
