import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./tokens-voice-env.json";

/**
 * Creator Secrets: "Kisi ne Claude Code ko free mein chalane ka tareeka open-source kar diya": FreeLLMAPI. The
 * owner's Google AI Studio recording (public/tokens/voice.wav, 93.36 s, a byte-identical copy of "Generated Audio
 * November 17, 2026 - 10_07AM.wav", MD5 5449e95a1aa56c3217d96e1492416682, never edited). Phrase edges come from the
 * pauses in the voice (silencedetect -38 dB, 0.12 s); words were checked with whisper.cpp (small) on pieces cut at
 * the pauses. Subtitles follow the owner's script, Roman Hinglish.
 *
 * Fact check, 17 Nov 2026 (github.com/tashfeenahmed/freellmapi, README):
 * - MIT licence; one OpenAI-compatible /v1 endpoint over many providers' free tiers; Anthropic /v1/messages, so
 *   Claude Code runs on it (`npx freellmapi setup-claude`); falls over to the next provider on a rate limit; per-key
 *   quota tracking in the dashboard; 23 coding agents listed, including Codex CLI, Cursor, OpenCode and Qwen Code.
 * - The narration's "34 providers, 635 model endpoints, about 7.4 billion tokens a month" was the README's figure
 *   from 23 Aug to 12 Nov 2026 (commit e03d74d refreshed it). Today it says 87 providers, 1,313 free endpoints,
 *   about 10.1 billion tokens a month. The voice is kept as recorded; the screen shows the update under each number.
 * - Gemini (Google), Qwen and DeepSeek models are in the catalog (DeepSeek V4 and Qwen3 via several providers).
 * - The README says "personal experimentation and learning, not production" and that each provider's terms still
 *   apply. It does not give the real Claude model: the narration says so, and the screen repeats it.
 * - We have not run FreeLLMAPI ourselves; the dashboard pictures are the project's own README screenshots, labelled.
 * - Instagram DMs are restricted until 4 Dec 2026: no DM is shown or promised.
 */

const captions: Cap[] = [
  ...card([0.24, 0.62, "Kisi ne"], [0.78, 4.43, "*Claude *Code ko *free mein | chalane ka tareeka | *open-source kar diya."]),
  ...card([5.0, 5.74, "*End tak dekho!"]),
  ...card([6.21, 8.32, "Aur ye koi | ek model ka | *free *trial *nahi hai!"]),
  ...card([9.0, 9.84, "Tareeka number *one:"], [9.97, 12.21, "| pichhli reel mein bataya tha | *Google *Antigravity."]),
  ...card([12.72, 13.72, "Tareeka number *two:"], [14.05, 15.34, "| *FreeLLMAPI!"]),
  ...card([16.03, 19.05, "*FreeLLMAPI | *MIT *License ke saath | *open-source hai."]),
  ...card([19.54, 21.75, "Ye alag-alag *AI *providers ke | *free *tiers ko"], [21.98, 23.8, "| ek hi *endpoint ke peeche | jod deta hai."]),
  ...card([24.35, 28.23, "Iske current catalog mein | *34 *providers"], [28.4, 29.76, "| aur *635 model endpoints hain,"]),
  ...card([30.21, 35.5, "jinki combined listed capacity | lagbhag *7.4 *billion | tokens per month hai!"]),
  ...card([35.97, 37.66, "*Tokens matlab | AI ka *data *pack,"], [38.18, 41.05, "| lekin har provider ki | *limit aur *reset timing | alag hoti hai."]),
  ...card([41.79, 42.72, "Ab samjho *game!"]),
  ...card([43.4, 44.63, "*Claude *Code ko *haath samjho,"], [45.03, 46.48, "| aur *AI *model ko *dimaag."]),
  ...card([47.08, 51.68, "*FreeLLMAPI se | *Gemini, *Qwen aur *DeepSeek jaise | *free *models | connect kar sakte ho."]),
  ...card([52.18, 53.87, "Matlab coding agent | *Claude *Code hi,"], [54.2, 55.77, "| lekin uska *dimaag | *badal sakte ho!"]),
  ...card([56.34, 58.31, "*Multiple *providers | *ek hi jagah manage karo."]),
  ...card([58.96, 60.11, "Ek provider ki *limit *khatam?"], [60.48, 62.6, "| *Router next available provider | try kar sakta hai!"]),
  ...card([63.21, 64.93, "Aur jitne providers | connect karoge,"], [65.06, 67.46, "| unki available *quota | *dashboard par track kar sakte ho."]),
  ...card([68.09, 69.09, "Sirf *Claude *Code nahi"], [69.52, 73.41, "| *Codex, *Cursor, | *OpenCode aur *Qwen *Code jaise | tools bhi *supported hain!"]),
  ...card([74.04, 77.6, "Ab *apps banao, | *websites banao, | ya *side *projects par | experiment karo"], [77.93, 79.29, "| *free-tier *limits ke andar!"]),
  ...card([79.99, 80.55, "Ek *sach baat:"], [80.71, 82.85, "| isse *asli *Claude model | *free *nahi milta."]),
  ...card([83.23, 86.91, "Ye connected *free *AI *models ko | *Claude *Code ke saath | chalane ka tareeka hai."]),
  ...card([87.54, 88.39, "Poora *setup chahiye?"]),
  ...card([88.84, 89.97, "*Comment karo *TOKENS!"]),
  ...card([90.57, 93.11, "*Link *in *bio kholo aur | keyword box mein | *TOKENS type karo!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  kisi: 0.24,
  claude: 0.85,
  free: 1.75,
  open: 3.3,
  end: 5.0,
  // 2. Not a free trial
  aur: 6.21,
  trial: 7.3,
  nahi: 7.85,
  // 3. Way 1: Antigravity
  one: 9.0,
  pichhli: 9.97,
  google: 11.25,
  // 4. Way 2: FreeLLMAPI
  two: 12.72,
  fllm: 14.05,
  // 5. MIT, open source
  fllm2: 16.03,
  mit: 17.15,
  open2: 18.2,
  // 6. One endpoint
  ye: 19.54,
  providers: 20.3,
  tiers: 21.1,
  endpoint: 22.5,
  jod: 23.1,
  // 7. Numbers
  catalog: 24.35,
  n34: 26.92,
  n635: 28.4,
  combined: 30.21,
  n74: 32.6,
  perMonth: 34.3,
  // 8. Data pack
  tokens: 35.97,
  pack: 37.0,
  lekin: 38.18,
  limit: 39.2,
  reset: 39.7,
  // 9. Rehook
  game: 41.79,
  // 10. Hand and brain
  haath: 43.4,
  dimaag: 45.95,
  // 11. Free models
  models: 47.08,
  gemini: 48.24,
  qwen: 49.0,
  deepseek: 49.55,
  connect: 50.85,
  // 12. Brain swap
  matlab: 52.18,
  claudeHi: 53.2,
  badal: 54.8,
  // 13. One place
  multi: 56.34,
  jagah: 57.3,
  // 14. Failover
  khatam: 58.96,
  router: 60.48,
  // 15. Quota dashboard
  jitne: 63.21,
  quota: 65.6,
  dash: 66.0,
  // 16. Agents
  sirf: 68.09,
  codex: 69.52,
  cursor: 70.1,
  opencode: 70.75,
  qwencode: 71.65,
  supported: 72.85,
  // 17. Build
  apps: 74.04,
  websites: 74.94,
  side: 76.18,
  limits: 77.93,
  // 18. Honest note
  sach: 79.99,
  asli: 80.71,
  ye2: 83.23,
  // 19. CTA
  setupQ: 87.54,
  comment: 88.84,
  tokensWord: 89.3,
  link: 90.57,
  box: 91.5,
  tokensType: 92.4,
  end2: 93.36,
};

export const tokens = {
  voiceover: "tokens/voice.wav",
  voiceSeconds: 93.36,
  music: "tokens/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.3, -0.8], jump: true },
    { at: C.open, pose: "explain", expr: "excited", look: [0.4, -0.7] },
    { at: C.end, pose: "point", aim: -60, expr: "talk", look: [0.2, -0.5] },
    { at: C.aur, pose: "think", expr: "skeptic", look: [0.3, -0.7], tilt: 5 },
    { at: C.nahi, pose: "oneMore", expr: "happy", look: [0.4, -0.6] },
    { at: C.one, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.two, pose: "surprised", expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.fllm2, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.ye, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.catalog, pose: "explain", expr: "talk", look: [0.5, -0.7] },
    { at: C.n74, pose: "surprised", expr: "surprised", look: [0.4, -0.8], jump: true },
    { at: C.tokens, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.lekin, pose: "think", expr: "thinking", look: [0.4, -0.6], tilt: 4 },
    { at: C.game, pose: "oneMore", expr: "excited", look: [0, -0.3], jump: true },
    { at: C.haath, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.models, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.connect, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.matlab, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.multi, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.khatam, pose: "surprised", expr: "surprised", look: [0.4, -0.7] },
    { at: C.router, pose: "thumbs", expr: "happy", look: [0.5, -0.6], jump: true },
    { at: C.jitne, pose: "explain", expr: "talk", look: [0.5, -0.7] },
    { at: C.sirf, pose: "point", aim: -50, expr: "excited", look: [0.6, -0.7] },
    { at: C.supported, pose: "thumbs", expr: "happy", look: [0.4, -0.6] },
    { at: C.apps, pose: "explain", expr: "excited", look: [0.5, -0.6] },
    { at: C.limits, pose: "oneMore", expr: "skeptic", look: [0.4, -0.6] },
    { at: C.sach, pose: "think", expr: "thinking", look: [0.2, -0.4], tilt: 5 },
    { at: C.ye2, pose: "explain", expr: "talk", look: [0.4, -0.5] },
    { at: C.setupQ, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.comment, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.link, pose: "point", aim: -45, expr: "happy", look: [0.4, -0.7] },
    { at: C.tokensType, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1450, s: 0.8 },
    { at: C.aur - 0.1, ...LAYOUT.avatar.corner },
    { at: C.game - 0.1, x: 540, y: 1450, s: 0.78 },
    { at: C.haath - 0.1, ...LAYOUT.avatar.corner },
    { at: C.sach - 0.1, x: 540, y: 1450, s: 0.76 },
    { at: C.ye2 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.setupQ - 0.1, x: 540, y: 1460, s: 0.72 },
  ] as AvatarPlace[],
  blinks: Array.from({ length: 31 }, (_, i) => Math.round((1.6 + i * 2.97) * 100) / 100),

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.claude, "flip", 0.4],
    [C.free, "fx-boom", 0.48],
    [C.free + 0.02, "coin", 0.34],
    [C.open, "stamp", 0.48],
    [C.end - 0.05, "whoosh", 0.38],
    [C.end, "pop", 0.34],
    // Not a trial
    [C.aur - 0.08, "whoosh", 0.4],
    [C.trial, "flip", 0.36],
    [C.nahi, "stamp", 0.5],
    [C.nahi + 0.02, "warn", 0.3],
    // Way 1
    [C.one - 0.05, "fx-step1", 0.48],
    [C.pichhli, "swish", 0.32],
    [C.google, "fx-reveal", 0.42],
    [C.google + 0.05, "sparkle", 0.3],
    // Way 2
    [C.two - 0.08, "fx-boom", 0.5],
    [C.two - 0.05, "fx-step2", 0.48],
    [C.fllm, "fx-reveal", 0.46],
    [C.fllm + 0.05, "sparkle", 0.34],
    // MIT
    [C.fllm2 - 0.08, "whoosh", 0.36],
    [C.mit, "stamp", 0.44],
    [C.open2, "fx-pop", 0.4],
    // One endpoint
    ...[0, 1, 2, 3, 4].map((i) => [C.providers + i * 0.16, "pop", 0.28] as [number, string, number]),
    [C.tiers + 0.2, "fx-connect", 0.36],
    [C.endpoint, "fx-connect", 0.38],
    [C.jod, "ding", 0.34],
    // Numbers
    [C.catalog - 0.08, "whoosh", 0.38],
    [C.n34, "fx-pop", 0.46],
    [C.n635, "fx-pop", 0.46],
    [C.n74 - 0.04, "fx-boom", 0.5],
    [C.n74, "coin", 0.36],
    [C.n34 + 0.9, "click", 0.3],
    [C.n635 + 0.9, "click", 0.3],
    [C.perMonth, "ding", 0.34],
    // Data pack
    [C.tokens - 0.08, "whoosh", 0.38],
    [C.pack, "fx-pop", 0.4],
    [C.lekin, "swish", 0.32],
    ...[0, 1, 2].map((i) => [C.limit + i * 0.3, "click", 0.3] as [number, string, number]),
    // Rehook
    [C.game - 0.1, "fx-boom", 0.48],
    [C.game, "riser", 0.36],
    [C.game + 0.4, "stamp", 0.44],
    // Hand + brain
    [C.haath - 0.06, "whoosh", 0.38],
    [C.haath + 0.3, "pop", 0.34],
    [C.dimaag, "fx-pop", 0.42],
    [C.dimaag + 0.05, "sparkle", 0.3],
    // Free models
    [C.models - 0.06, "whoosh", 0.36],
    [C.gemini, "fx-pop", 0.42],
    [C.qwen, "fx-pop", 0.42],
    [C.deepseek, "fx-pop", 0.42],
    [C.connect, "fx-connect", 0.4],
    // Brain swap
    [C.matlab - 0.06, "whoosh", 0.36],
    ...[0, 1, 2, 3].map((i) => [C.badal + i * 0.4, "flip", 0.32] as [number, string, number]),
    // One place
    [C.multi - 0.08, "whoosh", 0.38],
    [C.jagah, "fx-reveal", 0.4],
    // Failover
    [C.khatam - 0.06, "warn", 0.4],
    [C.khatam + 0.4, "stamp", 0.42],
    [C.router, "fx-connect", 0.4],
    [C.router + 1.0, "ding", 0.36],
    // Quota
    [C.jitne - 0.08, "whoosh", 0.36],
    [C.quota, "swish", 0.3],
    [C.dash, "fx-reveal", 0.38],
    // Agents
    [C.sirf - 0.06, "fx-boom", 0.44],
    [C.sirf, "flip", 0.36],
    [C.codex, "fx-pop", 0.42],
    [C.cursor, "fx-pop", 0.42],
    [C.opencode, "fx-pop", 0.42],
    [C.qwencode, "fx-pop", 0.42],
    [C.supported, "ding", 0.36],
    // Build
    [C.apps - 0.06, "whoosh", 0.36],
    [C.apps, "pop", 0.34],
    [C.websites, "pop", 0.34],
    [C.side, "pop", 0.34],
    [C.limits, "warn", 0.3],
    // Honest note
    [C.sach - 0.1, "fx-boom", 0.45],
    [C.sach, "whoosh", 0.36],
    [C.asli + 1.2, "stamp", 0.46],
    [C.ye2, "fx-connect", 0.36],
    [C.ye2 + 2.0, "ding", 0.34],
    // CTA
    [C.setupQ - 0.06, "whoosh", 0.38],
    [C.setupQ, "pop", 0.3],
    [C.comment - 0.05, "fx-boom", 0.45],
    [C.tokensWord, "fx-pop", 0.52],
    [C.tokensWord + 0.02, "sparkle", 0.34],
    [C.link, "swish", 0.32],
    [C.box + 0.3, "typing", 0.32],
    [C.tokensType + 0.3, "ding", 0.38],
  ] as [number, string, number][],
};
