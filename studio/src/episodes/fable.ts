import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./fable-voice-env.json";

/**
 * Creator Secrets #06: "Anthropic ne launch kiya hai Fable 5.2" + the Higgsfield MCP connector, in the owner's
 * Google AI Studio recording (public/fable/voice.wav, 45.68 s, a byte-identical copy of
 * "higgsfiled anthropic.wav", never edited). Word times from whisper.cpp (small) word mode; unclear words were
 * re-checked in Hindi on pieces cut at the pauses. Captions are Roman Hinglish, word for word, "3" for "teen".
 * The brief's hook line "Bhai, Claude ke andar AI videos banao… FREE mein?!" is NOT in the audio; the audio
 * starts at 0.29 s with "Anthropic ne launch kiya hai".
 *
 * Fact check, 11 Nov 2026:
 * - Fable 5.2: launched by Anthropic on 9 Nov 2026 (launch coverage of Anthropic's announcement).
 * - Higgsfield's own post: "free 72-hour Higgsfield MCP trial … $0 now … auto-renews to Higgsfield Ultra with
 *   40% off your first month unless you cancel". Eligibility and card requirement are not stated.
 * - Higgsfield help centre (integrations): MCP needs an active paid subscription; "Every generation through a
 *   connected agent deducts credits, regardless of your plan"; unlimited/free offers apply only on higgsfield.ai.
 *   So the billing scene says MCP GENERATIONS USE HIGGSFIELD CREDITS + CHECK CURRENT TRIAL TERMS in large type.
 * - Claude (checked in the live app): Settings → Connectors now says "Connectors have moved to Customize";
 *   Customize → Connectors → "+ Add" → "Add custom connector" (Name, MCP server URL, Continue). Custom connectors
 *   work on the Free plan too (one connector). MCP URL https://mcp.higgsfield.ai/mcp (Higgsfield help centre).
 */

const captions: Cap[] = [
  ...card([0.29, 2.2, "*Anthropic ne *launch kiya hai"], [2.42, 3.95, "| *Fable *5.2!"]),
  ...card([4.06, 4.98, "Aur isi mauke par"], [5.12, 6.1, "| *Higgsfield ka"]),
  ...card([6.22, 7.65, "*3 din wala *free *trial"], [7.73, 8.5, "| saamne aaya hai,"]),
  ...card([8.52, 9.35, "jisme *naye *users"], [9.42, 10.35, "| *AI *video *models"]),
  ...card([10.4, 11.6, "*try kar sakte hain."]),
  ...card([11.86, 13.95, "Lekin ye kaam *karega *kaise?"]),
  ...card([14.12, 15.25, "Bas *3 *steps."]),
  ...card([15.48, 16.25, "*Pehla:"], [16.41, 17.65, "| *Claude ki *settings mein jaao,"]),
  ...card([17.75, 18.78, "phir *Connectors kholo."]),
  ...card([18.84, 19.3, "*Doosra:"], [19.36, 21.25, "| *Add *custom *connector par click karo."]),
  ...card([21.32, 22.65, "*Higgsfield ka *MCP *link"], [22.72, 24.25, "| *paste karke *connect karo."]),
  ...card([24.36, 24.8, "*Teesra:"], [24.85, 26.42, "| *Higgsfield se *sign-in karo"]),
  ...card([26.48, 27.52, "aur *Claude ko batao"], [27.57, 28.75, "| kaisi *video chahiye."]),
  ...card([28.93, 31.15, "Bas, *video *Higgsfield banayega,"]),
  ...card([31.29, 32.3, "*Claude se hi *instructions"], [32.34, 33.15, "| de sakte ho."]),
  ...card([33.22, 34.5, "Lekin *dhyaan rakhna,"], [34.66, 35.85, "| *trial ke baad *paid *plan"]),
  ...card([35.93, 37.35, "*auto-renew ho sakta hai."]),
  ...card([37.44, 38.62, "*Terms *zaroor *check karna."]),
  ...card([38.72, 40.42, "Poora *setup *link chahiye?"]),
  ...card([40.47, 41.75, "*Comment karo *FABLE!"]),
  ...card([41.8, 43.6, "Aur aisi hi *AI *tricks ke liye"]),
  ...card([43.65, 44.35, "*follow karo"], [44.39, 45.6, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook + Fable 5.2
  anthropic: 0.29,
  launch: 1.1,
  fable: 2.42,
  fiveTwo: 2.91,
  // 2. Higgsfield + trial
  aur: 4.06,
  higgs: 5.12,
  teen: 6.22,
  free: 7.14,
  saamne: 7.73,
  jisme: 8.52,
  ai: 9.42,
  models: 9.95,
  tryK: 10.4,
  // 3. How does it work? Claude → MCP → Higgsfield → video
  lekin: 11.86,
  kaise: 13.41,
  // 4. 3 steps
  bas: 14.12,
  three: 14.41,
  // 5. Step 1: Settings → Connectors (→ Customize)
  step1: 15.48,
  claudeSet: 16.41,
  settings: 16.8,
  phir: 17.75,
  connectors: 17.99,
  kholo: 18.54,
  // 6. Step 2: Add custom connector, paste the MCP link, connect
  step2: 18.84,
  add: 19.36,
  click: 20.71,
  higgsLink: 21.32,
  mcp: 22.2,
  paste: 22.72,
  connect: 23.5,
  // 7. Step 3: sign in, ask Claude
  step3: 24.36,
  signin: 24.85,
  authorize: 25.69,
  aurClaude: 26.48,
  batao: 27.23,
  video: 27.82,
  // 8. The reveal
  bas2: 28.93,
  banayega: 29.49,
  claudeSe: 31.29,
  instructions: 31.6,
  // 9. Billing
  dhyan: 33.22,
  trial: 34.66,
  paid: 35.38,
  renew: 35.93,
  terms: 37.44,
  check: 37.98,
  // 10. Comment
  setup: 38.72,
  link: 39.43,
  comment: 40.47,
  fableWord: 41.33,
  // 11. Follow
  aisi: 41.8,
  tricks: 42.75,
  follow: 43.65,
  brand: 44.39,
  end: 45.68,
};

export const fable = {
  voiceover: "fable/voice.wav",
  voiceSeconds: 45.68,
  music: "fable/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.7, -0.6] },
    { at: C.anthropic, pose: "surprised", expr: "excited", look: [0.6, -0.7], jump: true },
    { at: C.fable, pose: "point", aim: -60, expr: "excited", look: [0.5, -0.8] },
    { at: C.higgs, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.teen, pose: "oneMore", expr: "excited", look: [0.3, -0.6], jump: true },
    { at: C.jisme, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.lekin, pose: "think", expr: "thinking", look: [0.5, -0.7], tilt: 5 },
    { at: C.bas, pose: "oneMore", expr: "excited", look: [0, -0.5] },
    { at: C.step1, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.kholo, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.step2, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.paste, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.connect, pose: "thumbs", expr: "happy", look: [0.5, -0.5] },
    { at: C.step3, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.aurClaude, pose: "think", expr: "thinking", look: [0.6, -0.7], tilt: 4 },
    { at: C.bas2, pose: "surprised", expr: "surprised", look: [0.6, -0.8], jump: true },
    { at: C.claudeSe, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.dhyan, pose: "point", aim: -35, expr: "skeptic", look: [0.7, -0.5] },
    { at: C.renew, pose: "surprised", expr: "skeptic", look: [0.7, -0.6] },
    { at: C.terms, pose: "explain", expr: "talk", look: [0.6, -0.5] },
    { at: C.setup, pose: "explain", expr: "happy", look: [0.5, -0.5] },
    { at: C.comment, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.aisi, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    // Lower left, looking up at the wall of AI-video thumbnails.
    { at: -2, x: 250, y: 1440, s: 0.72 },
    { at: C.lekin - 0.1, x: 540, y: 1460, s: 0.68 },
    { at: C.step1 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.bas2 - 0.1, x: 870, y: 1450, s: 0.66 },
    { at: C.dhyan - 0.1, x: 540, y: 1460, s: 0.68 },
    { at: C.setup - 0.1, ...LAYOUT.avatar.corner },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.9, 4.7, 7.5, 10.2, 13.1, 16.2, 19.6, 22.4, 25.3, 28.2, 31.0, 34.1, 37.0, 40.0, 42.9],

  // [time, file in public/sfx, volume]. fx-* files are this episode's own synthesised effects.
  sfx: [
    // Hook: cinematic hit + light streak, then the Claude logo reveal
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.anthropic + 0.05, "fx-reveal", 0.42],
    [C.fable - 0.05, "whoosh", 0.4],
    [C.fiveTwo, "fx-reveal", 0.45],
    [C.fiveTwo + 0.05, "sparkle", 0.3],
    // Higgsfield
    [C.aur, "fx-streak", 0.35],
    [C.higgs, "fx-reveal", 0.45],
    [C.teen, "stamp", 0.42],
    [C.free, "pop", 0.3],
    ...[0, 0.18, 0.36, 0.54].map((d) => [C.ai + d, "pop", 0.26] as [number, string, number]),
    // Claude → MCP → Higgsfield → video
    [C.lekin - 0.05, "whoosh", 0.38],
    ...[0, 0.45, 0.9].map((d) => [C.lekin + 0.35 + d, "fx-connect", 0.36] as [number, string, number]),
    [C.kaise + 0.2, "ding", 0.3],
    // 3 steps
    [C.bas - 0.05, "whoosh", 0.36],
    [C.three, "fx-step1", 0.4],
    [C.three + 0.2, "fx-step2", 0.4],
    [C.three + 0.4, "fx-step3", 0.4],
    // Step 1
    [C.step1 - 0.05, "fx-step1", 0.45],
    [C.settings, "click", 0.4],
    [C.phir, "swish", 0.3],
    [C.connectors + 0.35, "click", 0.4],
    [C.kholo, "flip", 0.3],
    // Step 2
    [C.step2 - 0.05, "fx-step2", 0.45],
    [C.add + 0.1, "click", 0.4],
    [C.click, "click", 0.4],
    [C.click + 0.15, "typing", 0.3],
    [C.paste, "snap", 0.42],
    [C.paste + 0.05, "fx-connect", 0.3],
    [C.connect, "click", 0.45],
    [C.connect + 0.3, "fx-connect", 0.38],
    // Step 3
    [C.step3 - 0.05, "fx-step3", 0.45],
    [C.authorize, "click", 0.4],
    [C.authorize + 0.25, "ding", 0.32],
    [C.batao - 0.1, "typing", 0.32],
    [C.video + 0.6, "click", 0.4],
    // Reveal (the biggest moment after the hook)
    [C.bas2 - 0.1, "fx-connect", 0.4],
    [C.banayega - 0.05, "fx-boom", 0.42],
    [C.banayega, "fx-reveal", 0.42],
    [C.banayega + 0.05, "sparkle", 0.32],
    [C.claudeSe, "pop", 0.3],
    [C.instructions + 0.4, "pop", 0.26],
    // Billing
    [C.dhyan - 0.05, "whoosh", 0.38],
    [C.trial, "pop", 0.32],
    [C.renew - 0.02, "warn", 0.42],
    [C.renew, "stamp", 0.4],
    [C.terms - 0.05, "fx-streak", 0.3],
    [C.check, "stamp", 0.45],
    // Comment
    [C.setup - 0.05, "whoosh", 0.38],
    [C.link, "pop", 0.3],
    [C.comment, "fx-reveal", 0.36],
    [C.fableWord, "fx-pop", 0.5],
    [C.fableWord + 0.02, "sparkle", 0.32],
    // Follow
    [C.aisi - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.28],
    [C.follow, "pop", 0.32],
    [C.brand, "fx-pop", 0.4],
    [C.brand + 0.03, "sparkle", 0.36],
  ] as [number, string, number][],
};
