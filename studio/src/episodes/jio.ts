import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import type { LogoKey } from "../jio/Scenes";
import { card } from "./mdh";
import voiceEnv from "./jio-voice-env.json";

/**
 * Creator Secrets #04: "Jio ne AI free diya? (5 use cases)", in the owner's recording (public/jio/voice.wav, 65.2 s,
 * never edited). Words come from local whisper.cpp passes (out/jio-asr) checked against the brief; phrase times come
 * from the recording's pauses (silencedetect -35 dB) and loudness. Numbers are written as digits, which fit either
 * the Hindi or the English number word.
 */

const captions: Cap[] = [
  ...card([0.03, 1.2, "*Jio ne *₹35,000 ka"], [1.25, 2.45, "| *AI *free diya."]),
  ...card([2.79, 3.16, "Tum sirf"], [3.47, 4.13, "*chat kar rahe ho?"]),
  ...card([4.78, 5.77, "Ye *5 *kaam karo!"]),
  ...card([6.44, 7.09, "Number *5:"], [7.53, 8.26, "*Photo *editing"]),
  ...card([8.77, 10.0, "Photo edit, *sirf *bolke."]),
  ...card([10.34, 11.1, "*Background badlo,"], [11.12, 12.05, "| *purani photo *theek karo."]),
  ...card([12.33, 13.05, "*Nano *Banana se."]),
  ...card([13.83, 14.32, "Number *4:"], [14.71, 15.19, "*Gmail"]),
  ...card([16.1, 16.76, "Bhara hua *Gmail?"]),
  ...card([17.35, 18.0, "*Gemini se bolo,"], [18.02, 18.69, "*summary do."]),
  ...card([19.06, 20.1, "*Reply bhi likh dega."]),
  ...card([20.61, 21.0, "Aur ek cheez,"], [21.05, 22.2, "| *18 *mahine baad"], [22.22, 23.4, "| tumhari *photos pe asar daalegi."]),
  ...card([23.45, 24.15, "*End mein bataunga."]),
  ...card([25.06, 25.62, "Number *3:"], [25.66, 26.37, "*Storage"]),
  ...card([26.94, 28.15, "*TBs ka *storage."], [28.2, 29.69, "| *Phone ki saari *photos ka *backup."]),
  ...card([30.5, 31.15, "Number *2:"], [31.18, 32.0, "*Google *Docs"]),
  ...card([32.67, 33.53, "*Google *Docs mein *Gemini,"]),
  ...card([33.99, 34.72, "*notes do,"], [34.74, 35.59, "| poora *document *ready."]),
  ...card([36.39, 36.85, "Number *1:"], [36.88, 37.61, "*NotebookLM"]),
  ...card([38.04, 38.87, "Ab *sabse *kaam ka,"], [39.18, 39.85, "*NotebookLM!"]),
  ...card([40.59, 41.25, "Koi bhi *PDF"], [41.43, 42.13, "| ya *YouTube *link."]),
  ...card([42.23, 43.15, "Ye *Hindi mein"], [43.17, 43.85, "| *podcast bana deta hai."]),
  ...card([44.27, 44.95, "Padhne ki jagah"], [44.97, 45.33, "*suno."]),
  ...card([46.21, 46.66, "*Coder ho?"], [46.95, 48.02, "| *Gemini *CLI bhi *free hai!"]),
  ...card([48.9, 49.77, "Ab *photos wali baat."]),
  ...card([50.29, 51.07, "*18 *mahine baad"], [51.17, 51.6, "| *plan *khatam."]),
  ...card([52.02, 52.74, "*Auto-renew nahi."]),
  ...card([53.13, 54.43, "Storage wapas *15 *GB."]),
  ...card([54.85, 55.93, "*15 *GB se zyada bhara,"], [56.13, 57.3, "| toh nayi photos *backup nahi hongi."]),
  ...card([57.94, 59.38, "*Activation *date abhi *note karo."]),
  ...card([60.37, 61.99, "Us *dost ko bhejo jiske paas *Jio."]),
  ...card([62.58, 63.05, "Comment karo"], [63.13, 63.5, "*GEMINI."]),
  ...card([63.8, 64.91, "Saare *links *DM kar dunga."]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 0. Hook
  jio: 0.03,
  rupees: 0.38,
  ai: 1.6,
  free: 1.9,
  tum: 2.79,
  chat: 3.47,
  // A. Countdown
  yeAt: 4.78,
  paanchWord: 4.98,
  kaam: 5.3,
  // #5 Photo editing
  u5: 6.44,
  u5Name: 7.53,
  u5Demo: 8.77,
  bgAt: 10.34,
  oldAt: 11.12,
  nanoAt: 12.33,
  // #4 Gmail
  u4: 13.83,
  u4Name: 14.71,
  u4Demo: 16.1,
  sumAt: 17.35,
  replyAt: 19.06,
  // Tease
  tease: 20.61,
  teaseCal: 21.05,
  teasePhotos: 22.3,
  endMein: 23.45,
  // #3 Storage
  u3: 25.06,
  u3Name: 25.66,
  u3Demo: 26.94,
  tbAt: 26.94,
  backupAt: 28.2,
  // #2 Docs
  u2: 30.5,
  u2Name: 31.18,
  u2Demo: 32.67,
  notesAt: 33.99,
  docAt: 34.74,
  // #1 NotebookLM
  u1: 36.39,
  u1Name: 36.88,
  kaamKa: 38.04,
  nbAgain: 39.18,
  u1Demo: 40.45,
  pdfAt: 40.6,
  ytAt: 41.43,
  hindiAt: 42.65,
  podcastAt: 43.2,
  suno: 44.27,
  // Bonus
  coder: 46.21,
  cli: 46.95,
  cliFree: 47.55,
  // Payoff
  photosBaat: 48.9,
  plan18: 50.29,
  planEnd: 51.17,
  autoRenew: 52.02,
  gb15: 53.13,
  overAt: 54.87,
  noBackup: 56.13,
  activation: 57.94,
  // Share and CTA
  share: 60.37,
  jioDost: 61.3,
  comment: 62.58,
  keyword: 63.13,
  dm: 63.8,
  endCard: 64.95,
};

type Use = { n: number; title: string; label: string; short: string; chip: string; logo: LogoKey; logo2?: LogoKey; at: number; nameAt: number; demo: number; end: number };

/** The five use cases in spoken order (#5 first). */
export const USES: Use[] = [
  { n: 5, title: "PHOTO EDITING", label: "PHOTO EDITING", short: "Photo edit", chip: "Nano Banana · Gemini", logo: "nano", logo2: "gemini", at: C.u5, nameAt: C.u5Name, demo: C.u5Demo, end: C.u4 },
  { n: 4, title: "GMAIL + GEMINI", label: "GMAIL + GEMINI", short: "Gmail", chip: "Summary + reply draft", logo: "gmail", logo2: "gemini", at: C.u4, nameAt: C.u4Name, demo: C.u4Demo, end: C.tease },
  { n: 3, title: "2 TB STORAGE", label: "TBs OF STORAGE", short: "Storage", chip: "Photos backup · Google One", logo: "one", logo2: "photos", at: C.u3, nameAt: C.u3Name, demo: C.u3Demo, end: C.u2 },
  { n: 2, title: "DOCS + GEMINI", label: "GOOGLE DOCS + GEMINI", short: "Docs", chip: "Notes → full document", logo: "docs", logo2: "gemini", at: C.u2, nameAt: C.u2Name, demo: C.u2Demo, end: C.u1 },
  { n: 1, title: "NOTEBOOKLM", label: "NOTEBOOKLM", short: "NotebookLM", chip: "PDF / YouTube → Hindi podcast", logo: "notebooklm", at: C.u1, nameAt: C.u1Name, demo: C.u1Demo, end: C.coder },
];

export const jio = {
  voiceover: "jio/voice.wav",
  voiceSeconds: 65.2,
  tailSeconds: 1.2,
  music: "jio/music.wav",
  env: voiceEnv as number[],
  disclaimer: ["Not sponsored. Illustrations.", "Offer terms & limits vary."],
  captions,

  avatarKeys: [
    { at: 0, pose: "rest", expr: "surprised", look: [0, -0.4] },
    { at: C.rupees, pose: "surprised", expr: "surprised", look: [0.3, -0.7], jump: true },
    { at: C.free, pose: "surprised", expr: "excited", look: [0, -0.3], jump: true },
    { at: C.tum, pose: "think", expr: "skeptic", look: [0.5, -0.6], tilt: 5 },
    { at: C.yeAt, pose: "explain", expr: "excited", look: [0.4, -0.6] },
    { at: C.kaam, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: C.u5, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.bgAt, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.6] },
    { at: C.nanoAt, pose: "thumbs", expr: "happy", look: [0.3, -0.4] },
    { at: C.u4, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.u4Demo, pose: "think", expr: "annoyed", look: [0.6, -0.6], tilt: -4 },
    { at: C.sumAt, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.tease, pose: "oneMore", expr: "thinking", look: [0.4, -0.5] },
    { at: C.endMein, pose: "point", aim: -40, expr: "skeptic", look: [0.3, -0.3] },
    { at: C.u3, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.backupAt, pose: "thumbs", expr: "happy", look: [0.3, -0.4] },
    { at: C.u2, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.docAt, pose: "surprised", expr: "excited", look: [0.5, -0.6], jump: true },
    { at: C.u1, pose: "oneMore", expr: "excited", look: [0.4, -0.5] },
    { at: C.u1Demo, pose: "point", aim: -45, expr: "happy", look: [0.6, -0.6] },
    { at: C.podcastAt, pose: "surprised", expr: "excited", look: [0.4, -0.6] },
    { at: C.suno, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: C.coder, pose: "think", expr: "thinking", look: [0.5, -0.6], tilt: 4 },
    { at: C.cli, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.photosBaat, pose: "oneMore", expr: "thinking", look: [0.3, -0.5] },
    { at: C.planEnd, pose: "think", expr: "annoyed", look: [0.5, -0.6], tilt: -4 },
    { at: C.noBackup, pose: "surprised", expr: "surprised", look: [0.5, -0.6] },
    { at: C.activation, pose: "point", aim: -40, expr: "talk", look: [0.5, -0.6] },
    { at: C.share, pose: "explain", expr: "happy", look: [0.4, -0.5] },
    { at: C.keyword, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: C.endCard, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    // Off screen for the dark opener, bursts in shocked on "35,000".
    { at: 0, x: -500, y: 1440, s: 0.7 },
    { at: C.rupees - 0.1, ...LAYOUT.avatar.corner },
    { at: C.endCard, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [3.0, 6.2, 9.4, 12.8, 15.6, 19.5, 22.9, 26.5, 29.9, 33.7, 37.3, 41.0, 44.6, 48.4, 52.6, 56.5, 60.1, 64.2],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "riser", 0.2],
    [C.jio, "impact", 0.5],
    [C.rupees, "coin", 0.4],
    [C.rupees + 0.15, "coin", 0.32],
    [C.ai, "sparkle", 0.4],
    [C.free - 0.03, "impact", 0.6],
    [C.free, "snap", 0.45],
    [C.free + 0.1, "sparkle", 0.45],
    [C.tum - 0.08, "whoosh", 0.4],
    ...[0, 0.35, 0.7].map((d) => [C.tum + 0.15 + d, "pop", 0.25] as [number, string, number]),
    [C.chat, "stamp", 0.42],
    [C.yeAt - 0.1, "whoosh", 0.45],
    ...[0, 0.09, 0.18, 0.27, 0.36].map((d) => [C.paanchWord + d, "flip", 0.22] as [number, string, number]),
    [C.kaam, "ding", 0.35],
    // A whoosh on each number, an impact on each name.
    ...[C.u5, C.u4, C.u3, C.u2, C.u1].map((at) => [at - 0.12, "whoosh", 0.45] as [number, string, number]),
    ...[C.u5Name, C.u4Name, C.u3Name, C.u2Name, C.u1Name].flatMap((at) => [[at, "impact", 0.42] as [number, string, number], [at + 0.05, "sparkle", 0.3] as [number, string, number]]),
    // Photo editing
    [C.bgAt, "typing", 0.28],
    [C.bgAt + 0.5, "swish", 0.35],
    [C.oldAt - 0.1, "pop", 0.3],
    [C.oldAt + 0.5, "sparkle", 0.35],
    [C.nanoAt, "pop", 0.35],
    // Gmail
    ...[0, 0.15, 0.3, 0.45].map((d) => [C.u4Demo + d, "click", 0.22] as [number, string, number]),
    [C.sumAt, "swish", 0.32],
    ...[0, 0.23, 0.46].map((d) => [C.sumAt + 0.35 + d, "pop", 0.25] as [number, string, number]),
    [C.replyAt + 0.25, "typing", 0.3],
    // Tease
    [C.tease - 0.1, "whoosh", 0.35],
    ...[0, 0.12, 0.24, 0.36, 0.48, 0.6].map((d) => [C.teaseCal + d, "flip", 0.2] as [number, string, number]),
    [C.teasePhotos + 0.3, "warn", 0.4],
    [C.endMein, "pop", 0.3],
    // Storage
    [C.tbAt, "impact", 0.4],
    ...[0, 0.2, 0.4, 0.6, 0.8].map((d) => [C.backupAt + d, "swish", 0.18] as [number, string, number]),
    [C.backupAt + 1.5, "ding", 0.35],
    // Docs
    [C.u2Demo, "pop", 0.3],
    [C.notesAt + 0.05, "sparkle", 0.3],
    [C.docAt, "typing", 0.3],
    [C.docAt + 0.6, "ding", 0.35],
    // NotebookLM
    [C.pdfAt, "swish", 0.3],
    [C.ytAt, "pop", 0.3],
    [C.hindiAt, "click", 0.3],
    [C.podcastAt, "sparkle", 0.38],
    [C.kaamKa, "pop", 0.32],
    [C.nbAgain, "sparkle", 0.32],
    [C.suno, "stamp", 0.35],
    // Bonus
    [C.coder - 0.12, "whoosh", 0.45],
    [C.coder + 0.2, "typing", 0.3],
    [C.cli, "impact", 0.4],
    [C.cliFree, "stamp", 0.45],
    // Payoff
    [C.photosBaat - 0.12, "whoosh", 0.45],
    [C.photosBaat, "warn", 0.45],
    ...[0, 0.12, 0.24, 0.36, 0.48, 0.6].map((d) => [C.plan18 + d, "flip", 0.2] as [number, string, number]),
    [C.planEnd, "stamp", 0.5],
    [C.autoRenew, "snap", 0.4],
    [C.gb15 + 0.1, "swish", 0.35],
    [C.noBackup, "warn", 0.5],
    [C.activation, "impact", 0.45],
    [C.activation + 0.1, "sparkle", 0.4],
    // Share and CTA
    [C.share - 0.1, "whoosh", 0.4],
    [C.jioDost + 0.2, "swish", 0.35],
    [C.jioDost + 0.8, "ding", 0.3],
    [C.comment, "pop", 0.3],
    [C.keyword - 0.05, "typing", 0.3],
    [C.keyword + 0.4, "impact", 0.5],
    [C.keyword + 0.45, "sparkle", 0.45],
    [C.dm, "pop", 0.3],
    [C.endCard, "whoosh", 0.4],
    [C.endCard + 0.9, "click", 0.45],
  ] as [number, string, number][],
};
