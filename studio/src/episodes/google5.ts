import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./google5-voice-env.json";

/**
 * Creator Secrets #03: 5 Google AI tools, in the owner's recording (public/google5/voice.wav, 64.2 s, never edited).
 * Words come from local whisper.cpp passes (out/google5-asr) checked against the brief; phrase times come from the
 * recording's pauses and loudness dips (src/episodes/google5-voice-env.json). The spoken tools are Stitch, Pomelli,
 * Antigravity, NotebookLM and AI Studio. The CTA keyword is written "Google 5", which fits "Five" and "Paanch" alike.
 */

const captions: Cap[] = [
  ...card([0.33, 1.95, "Kal raat *Google ne"], [2.0, 3.25, "| *18,000 rupay ke"], [3.3, 4.95, "| *5 *paid AI tools"]),
  ...card([5.0, 6.36, "bilkul *FREE kar diye hain!"]),
  ...card([6.66, 7.6, "Google ke ye *paanch"], [7.65, 9.4, "| kamaal ke *AI *tools"], [9.5, 10.45, "| *free mein"]),
  ...card([10.5, 12.1, "*try zaroor kar sakte ho!"]),
  ...card([12.44, 13.6, "Aur *aakhri wala to main"], [13.62, 14.75, "| *khud istemaal karta hoon."]),
  ...card([15.5, 15.87, "Number ek:"], [16.13, 16.93, "*Google *Stitch"]),
  ...card([17.25, 18.45, "Bas apna *idea batao"], [18.5, 19.95, "| aur ye *website ya *app ki"]),
  ...card([20.0, 21.2, "*shaandaar *UI *design"], [21.25, 22.0, "| bana deta hai."]),
  ...card([22.53, 23.0, "Number do:"], [23.23, 24.2, "*Google *Pomelli"]),
  ...card([24.47, 26.3, "Apni *website ka *link do"], [26.37, 27.85, "| aur apne *brand ke liye"], [27.89, 29.15, "| *social *media *creatives banao."]),
  ...card([29.77, 30.3, "Number teen:"], [30.5, 31.7, "| *Google *Antigravity"]),
  ...card([32.13, 33.5, "Ek *AI *agent"], [33.63, 34.75, "| jo *code likhne aur"], [34.78, 35.6, "| *bugs theek karne mein"], [35.65, 36.31, "| *madad karta hai."]),
  ...card([36.93, 37.4, "Number chaar:"], [37.77, 38.93, "| *Google *NotebookLM"]),
  ...card([39.33, 41.08, "*PDFs aur *notes se *summary,"], [41.27, 42.37, "| *sawaalon ke *jawaab,"], [42.52, 43.1, "| yahan tak ki"], [43.24, 44.27, "| *Audio *Overview bhi!"]),
  ...card([44.8, 45.5, "Aur number paanch:"], [45.87, 46.97, "| *Google *AI *Studio"]),
  ...card([47.4, 48.35, "*AI *models test karo,"], [48.81, 49.6, "| *voice banao,"], [49.87, 51.3, "| main to apni *reels ki aawaz"], [51.37, 52.45, "| bhi isi se banata hoon."]),
  ...card([52.92, 53.8, "Bas *dhyaan rahe,"], [53.84, 54.85, "| *free *access ki bhi"], [54.87, 55.61, "| kuch *limits hain."]),
  ...card([56.2, 57.1, "Ab in *paanchon ke"], [57.11, 58.13, "| *official *links chahiye?"]),
  ...card([58.57, 59.07, "Comment karo"], [59.27, 60.0, "*Google *5!"]),
  ...card([60.3, 61.25, "Aur aisi kaam ki"], [61.31, 62.5, "| *AI *tricks ke liye,"], [62.63, 63.0, "| *follow karo"], [63.05, 64.1, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 0. Hook: ₹18,000 KE 5 PAID AI TOOLS? then FREE?!
  kal: 0.33,
  google: 0.9,
  rupees: 2.0,
  five: 3.3,
  paid: 4.04,
  bilkul: 5.0,
  free: 5.39,
  // A. The five cards, "free mein try"
  cardsAt: 6.62,
  paanch: 7.32,
  tools: 8.6,
  freeMein: 9.5,
  tryWord: 10.5,
  aakhri: 12.44,
  khud: 13.62,
  // 1. Stitch
  s1: 15.5,
  s1Name: 16.13,
  ideaAt: 17.25,
  websiteAt: 18.75,
  uiAt: 20.0,
  s1End: 22.05,
  // 2. Pomelli
  s2: 22.53,
  s2Name: 23.23,
  linkAt: 24.47,
  linkDrop: 25.63,
  brandAt: 26.6,
  socialAt: 27.89,
  s2End: 29.17,
  // 3. Antigravity
  s3: 29.77,
  s3Name: 30.5,
  agentAt: 32.13,
  codeAt: 33.63,
  bugsAt: 34.78,
  fixAt: 35.65,
  s3End: 36.31,
  // 4. NotebookLM
  s4: 36.93,
  s4Name: 37.77,
  pdfAt: 39.33,
  summaryAt: 40.4,
  qaAt: 41.27,
  yahanAt: 42.52,
  audioAt: 43.24,
  s4End: 44.27,
  // 5. AI Studio
  s5: 44.8,
  s5Name: 45.87,
  modelsAt: 47.4,
  voiceAt: 48.81,
  reelsAt: 49.87,
  s5End: 52.45,
  // Limits
  dhyaan: 52.92,
  access: 53.84,
  limits: 54.87,
  // CTA and outro
  linksAt: 56.2,
  official: 57.11,
  commentAt: 58.57,
  keyword: 59.27,
  outroAt: 60.3,
  followWord: 62.63,
  toolboxAt: 63.05,
};

/** The five tools in spoken order. `logo` is a file in public/google5/logos (null = official wordmark only). */
export const TOOLS = [
  { n: 1, name: "Google Stitch", short: "Stitch", use: "UI / App Design", note: "Google Labs · free to try", logo: "stitch-512.png", at: C.s1, nameAt: C.s1Name, demo: C.ideaAt, end: C.s2 },
  { n: 2, name: "Pomelli", short: "Pomelli", use: "AI Creative / Branding", note: "Google Labs beta · select countries", logo: null, at: C.s2, nameAt: C.s2Name, demo: C.linkAt, end: C.s3 },
  { n: 3, name: "Google Antigravity", short: "Antigravity", use: "AI Coding Agent", note: "Free plan · usage limits", logo: "antigravity.svg", at: C.s3, nameAt: C.s3Name, demo: C.agentAt, end: C.s4 },
  { n: 4, name: "Google NotebookLM", short: "NotebookLM", use: "Notes + Audio Overview", note: "Free plan · usage limits", logo: "notebooklm.svg", at: C.s4, nameAt: C.s4Name, demo: C.pdfAt, end: C.s5 },
  { n: 5, name: "Google AI Studio", short: "AI Studio", use: "Test Models + Voice", note: "Free tier · usage limits", logo: "aistudio-512.png", at: C.s5, nameAt: C.s5Name, demo: C.modelsAt, end: C.dhyaan },
] as const;

export const google5 = {
  voiceover: "google5/voice.wav",
  voiceSeconds: 64.2,
  tailSeconds: 0.5,
  music: "google5/music.wav",
  env: voiceEnv as number[],
  disclaimer: ["Not sponsored. Illustrations.", "Free access & limits vary."],
  captions,
  /** Every caption sits at the normal height (the scenes keep 1150 to 1270 clear). */
  captionLow: (_start: number) => false,
  captionLowTop: 1460,

  avatarKeys: [
    { at: 0, pose: "rest", expr: "surprised", look: [0, -0.4] },
    { at: C.rupees, pose: "surprised", expr: "surprised", look: [0.3, -0.7], jump: true },
    { at: C.paid, pose: "think", expr: "skeptic", look: [0.5, -0.6], tilt: 5 },
    { at: C.free, pose: "surprised", expr: "excited", look: [0, -0.3], jump: true },
    { at: C.cardsAt, pose: "explain", expr: "talk", look: [0.4, -0.6] },
    { at: C.tryWord, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: C.aakhri, pose: "oneMore", expr: "excited", look: [0.5, -0.5] },
    { at: C.khud, pose: "point", aim: -40, expr: "happy", look: [0.6, -0.6] },
    { at: C.s1, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.ideaAt, pose: "think", expr: "thinking", look: [0.6, -0.7], tilt: 4 },
    { at: C.uiAt, pose: "point", aim: -50, expr: "excited", look: [0.6, -0.7] },
    { at: C.s2, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.linkDrop, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.6] },
    { at: C.socialAt, pose: "thumbs", expr: "happy", look: [0.3, -0.4] },
    { at: C.s3, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.bugsAt, pose: "think", expr: "annoyed", look: [0.6, -0.6], tilt: -4 },
    { at: C.fixAt, pose: "thumbs", expr: "excited", look: [0.3, -0.4], jump: true },
    { at: C.s4, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.qaAt, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.6] },
    { at: C.audioAt, pose: "surprised", expr: "excited", look: [0.4, -0.6] },
    { at: C.s5, pose: "oneMore", expr: "excited", look: [0.4, -0.5] },
    { at: C.s5Name, pose: "point", aim: -45, expr: "happy", look: [0.6, -0.6] },
    { at: C.reelsAt, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: C.dhyaan, pose: "oneMore", expr: "thinking", look: [0.3, -0.5] },
    { at: C.linksAt, pose: "explain", expr: "talk", look: [0.3, -0.5] },
    { at: C.keyword, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: C.outroAt, pose: "wave", expr: "happy", look: [0, 0] },
    { at: C.toolboxAt, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
  ] as AvatarKey[],
  avatarPlaces: [
    // Off screen for the dark opener, bursts in shocked on "18,000".
    { at: 0, x: -500, y: 1440, s: 0.7 },
    { at: C.rupees - 0.1, ...LAYOUT.avatar.corner },
    { at: C.free, x: -500, y: 1440, s: 0.7 },
    { at: C.cardsAt, ...LAYOUT.avatar.corner },
    { at: C.outroAt, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [3.0, 7.9, 11.3, 14.2, 19.0, 21.4, 25.9, 28.4, 31.3, 34.2, 38.4, 41.9, 46.4, 50.1, 54.2, 57.5, 61.4],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "riser", 0.2],
    [C.kal, "impact", 0.45],
    [C.rupees, "coin", 0.4],
    [C.rupees + 0.15, "coin", 0.32],
    [C.five, "whoosh", 0.4],
    ...[0, 0.12, 0.24, 0.36, 0.48].map((d) => [C.five + 0.1 + d, "pop", 0.22] as [number, string, number]),
    [C.paid, "stamp", 0.45],
    [C.free - 0.03, "impact", 0.8],
    [C.free, "snap", 0.45],
    [C.free + 0.1, "sparkle", 0.45],
    [C.cardsAt - 0.1, "whoosh", 0.45],
    ...[0, 0.1, 0.2, 0.3, 0.4].map((d) => [C.paanch + d, "flip", 0.22] as [number, string, number]),
    [C.freeMein, "ding", 0.35],
    [C.tryWord, "stamp", 0.4],
    [C.aakhri, "swish", 0.35],
    [C.khud, "pop", 0.32],
    // Tools: a whoosh on each number, an impact on each name.
    ...[C.s1, C.s2, C.s3, C.s4, C.s5].flatMap((at) => [[at - 0.12, "whoosh", 0.45] as [number, string, number]]),
    ...[C.s1Name, C.s2Name, C.s3Name, C.s4Name, C.s5Name].flatMap((at) => [[at, "impact", 0.42] as [number, string, number], [at + 0.05, "sparkle", 0.3] as [number, string, number]]),
    // Stitch
    [C.ideaAt + 0.2, "typing", 0.3],
    ...[0, 0.18, 0.36, 0.54].map((d) => [C.uiAt + d, "click", 0.3] as [number, string, number]),
    [C.uiAt + 0.9, "ding", 0.35],
    // Pomelli
    [C.linkAt + 0.2, "typing", 0.25],
    [C.linkDrop, "pop", 0.35],
    [C.brandAt, "swish", 0.3],
    ...[0, 0.15, 0.3].map((d) => [C.socialAt + d, "flip", 0.25] as [number, string, number]),
    // Antigravity
    [C.agentAt, "pop", 0.3],
    [C.codeAt, "typing", 0.32],
    [C.bugsAt, "snap", 0.3],
    ...[0, 0.2, 0.4].map((d) => [C.fixAt + d, "ding", 0.25] as [number, string, number]),
    // NotebookLM
    [C.pdfAt, "swish", 0.3],
    [C.summaryAt, "pop", 0.3],
    [C.qaAt, "pop", 0.3],
    [C.audioAt, "sparkle", 0.38],
    // AI Studio
    [C.modelsAt, "click", 0.3],
    [C.voiceAt, "pop", 0.3],
    [C.reelsAt + 0.5, "ding", 0.32],
    // Limits
    [C.dhyaan - 0.1, "whoosh", 0.4],
    [C.limits, "stamp", 0.42],
    // CTA
    [C.linksAt - 0.1, "whoosh", 0.4],
    [C.commentAt, "pop", 0.3],
    [C.keyword - 0.05, "typing", 0.3],
    [C.keyword + 0.5, "impact", 0.5],
    [C.keyword + 0.55, "sparkle", 0.45],
    [C.outroAt, "whoosh", 0.4],
    [C.followWord, "click", 0.45],
    [C.toolboxAt + 0.1, "sparkle", 0.4],
  ] as [number, string, number][],
};
