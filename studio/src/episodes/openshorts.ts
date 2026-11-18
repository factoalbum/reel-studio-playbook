import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./openshorts-voice-env.json";

/**
 * Creator Secrets: OpenShorts, the free open-source AI clipper, on GTA 6 launch week.
 * Voice: made by Claude with Gemini TTS (gemini-3.1-flash-tts-preview, voice Puck, "Promote" style), the owner's
 * AI Studio settings, from public/openshorts/script.txt; take 2 of 2 (57.2 s), unedited, approved workflow 18 Nov.
 * Phrase edges from silencedetect (-38 dB, 0.25 s); words checked with whisper.cpp (small).
 *
 * Fact check, 18 Nov 2026:
 * - OpenShorts: github.com/mutonby/openshorts, MIT, 8,867 stars, 1,861 forks (GitHub API). README: paste a YouTube
 *   link or upload a file; Gemini ranks the transcript to pick 3 to 15 moments; reframes to 9:16; faster-whisper
 *   captions burned in. Self-hosted is free with Docker and 8 GB+ RAM (README "Setup: Docker, 8GB+ RAM"), with your
 *   own Gemini key (free tier) or a local model. Cloud version has a free plan with a watermark.
 * - OpusClip Starter $15/mo (OpenShorts README comparison, "public pricing pages, checked October 2026").
 * - GTA 6: 19 November 2026 (Rockstar). Risks on screen: footage belongs to Rockstar; YouTube monetization rules;
 *   competition. Only clip creators who allow it.
 * - Format inspired by a reel by @mikasa._.ai; our words, voice and visuals. No DM promised (DMs restricted).
 */

export const C = {
  // 1. Hook
  khatam: 1.55,
  nov: 2.85,
  gta: 3.9,
  log: 5.2,
  paise: 6.4,
  // 2. AI
  lekin: 7.44,
  aiKhud: 8.9,
  // 3. What clippers do
  karte: 10.32,
  lambi: 11.52,
  best: 12.3,
  shorts: 13.5,
  views: 14.4,
  paiseLete: 15.2,
  // 4. Paid tools
  tools: 16.11,
  opus: 17.33,
  fifteen: 19.1,
  // 5. Free
  os: 20.4,
  free: 21.9,
  openSource: 23.36,
  github: 24.3,
  stars: 25.2,
  // 6. Flow
  link: 26.3,
  aiBest: 27.75,
  vertical: 29.25,
  captions: 31.46,
  // 7. Needs
  baat: 33.1,
  computer: 34.2,
  docker: 36.3,
  ram: 36.8,
  // 8. Risks
  earning: 37.98,
  risks: 39.3,
  footage: 39.93,
  youtube: 41.1,
  competition: 43.5,
  // 9. Start
  isliye: 45.14,
  permission: 47.0,
  launch: 47.93,
  aaj: 48.9,
  // 10. CTA
  guide: 50.07,
  comment: 51.57,
  clipper: 52.1,
  bio: 52.75,
  aisi: 54.59,
  follow: 56.3,
  end: 57.2,
};

const captions: Cap[] = [
  ...card([0.25, 2.5, "*AI ne *clippers ka | kaam hi *khatam kar diya?"]),
  ...card([2.85, 5.05, "*19 *November ko | *GTA *6 aa raha hai,"]),
  ...card([5.2, 7.1, "aur log *clips bana ke | *paise kama rahe hain."]),
  ...card([7.44, 9.95, "Lekin ab clipping, | *AI *khud karega."]),
  ...card([10.32, 11.2, "Clippers karte *kya hain?"]),
  ...card([11.52, 14.3, "Lambi stream se *best *moments | kaatke *Shorts banate hain,"]),
  ...card([14.4, 15.65, "aur *views ke hisaab se | *paise lete hain."]),
  ...card([16.11, 16.95, "Aur *clipping *tools?"]),
  ...card([17.33, 20.3, "*OpusClip jaise tools ka plan | *$15 mahine se shuru hota hai."]),
  ...card([20.4, 23.0, "Lekin *OpenShorts, | bilkul *free hai!"]),
  ...card([23.36, 26.2, "*Open *source hai, *GitHub par, | *8,000+ *stars."]),
  ...card([26.3, 27.7, "Video ka *link paste karo."]),
  ...card([27.75, 29.2, "*AI best moments dhoondhega."]),
  ...card([29.25, 31.1, "Clips banengi | vertical, *9:16."]),
  ...card([31.46, 32.9, "*Captions bhi, apne aap."]),
  ...card([33.1, 35.7, "Bas ek baat: free version | aapke *computer pe chalta hai,"]),
  ...card([35.75, 37.4, "*Docker aur *8 *GB *RAM chahiye."]),
  ...card([37.98, 39.6, "*Earning ka mauka hai, | lekin *risks bhi hain."]),
  ...card([39.93, 41.0, "Footage *Rockstar ki hai."]),
  ...card([41.1, 43.4, "*YouTube ke *monetization | *rules follow karo."]),
  ...card([43.45, 44.85, "Aur *competition, | bahut hoga."]),
  ...card([45.14, 47.55, "Isliye sirf unki clips banao | jo *permission dete hain,"]),
  ...card([47.93, 49.75, "aur launch se pehle, | *aaj hi setup kar lo."]),
  ...card([50.07, 51.27, "Poori *setup *guide chahiye?"]),
  ...card([51.57, 52.6, "*Comment karo *CLIPPER,"]),
  ...card([52.65, 54.25, "ya *link *in *bio pe | *CLIPPER type karo."]),
  ...card([54.59, 57.1, "Aisi aur *AI tricks ke liye, | *follow kar lo!"]),
];

export const openshorts = {
  voiceover: "openshorts/voice.wav",
  voiceSeconds: 57.2,
  music: "openshorts/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.3, -0.8], tilt: 3 },
    { at: C.nov, pose: "point", aim: -50, expr: "excited", look: [0.5, -0.8] },
    { at: C.log, pose: "thumbs", expr: "happy", look: [0.4, -0.6] },
    { at: C.lekin, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.aiKhud, pose: "oneMore", expr: "excited", look: [0.4, -0.7], jump: true },
    { at: C.karte, pose: "think", expr: "thinking", look: [0.4, -0.8], tilt: 5 },
    { at: C.lambi, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.views, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.tools, pose: "think", expr: "skeptic", look: [0.4, -0.7] },
    { at: C.fifteen, pose: "explain", expr: "annoyed", look: [0.6, -0.6] },
    { at: C.os, pose: "surprised", expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.openSource, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.link, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.vertical, pose: "point", aim: -40, expr: "happy", look: [0.6, -0.7] },
    { at: C.captions, pose: "thumbs", expr: "excited", look: [0.5, -0.6], jump: true },
    { at: C.baat, pose: "oneMore", expr: "talk", look: [0.4, -0.6] },
    { at: C.docker, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.earning, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.risks, pose: "surprised", expr: "surprised", look: [0.4, -0.7], jump: true },
    { at: C.footage, pose: "explain", expr: "annoyed", look: [0.6, -0.6] },
    { at: C.isliye, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.aaj, pose: "oneMore", expr: "excited", look: [0.4, -0.7], jump: true },
    { at: C.guide, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8] },
    { at: C.aisi, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1480, s: 0.74 },
    { at: C.lekin - 0.1, ...LAYOUT.avatar.corner },
    { at: C.os - 0.1, x: 540, y: 1470, s: 0.72 },
    { at: C.link - 0.1, ...LAYOUT.avatar.corner },
    { at: C.earning - 0.1, x: 540, y: 1480, s: 0.72 },
    { at: C.isliye - 0.1, ...LAYOUT.avatar.corner },
    { at: C.aisi - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.2, 4.1, 7.0, 10.1, 13.2, 16.0, 19.1, 22.4, 25.4, 28.6, 31.6, 34.6, 37.6, 40.6, 43.6, 46.6, 49.8, 52.8, 55.9],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.khatam, "stamp", 0.5],
    [C.nov - 0.05, "fx-reveal", 0.45],
    [C.gta, "impact", 0.4],
    [C.log, "whoosh", 0.35],
    ...[0, 1, 2, 3, 4].map((i) => [C.paise + i * 0.07, "coin", 0.24] as [number, string, number]),
    [C.lekin - 0.08, "whoosh", 0.4],
    [C.aiKhud, "fx-connect", 0.4],
    [C.aiKhud + 0.35, "pop", 0.3],
    [C.aiKhud + 0.7, "pop", 0.3],
    [C.karte - 0.08, "whoosh", 0.4],
    [C.lambi, "fx-pop", 0.35],
    [C.best, "snap", 0.4],
    ...[0, 1, 2].map((i) => [C.shorts + i * 0.12, "swish", 0.26] as [number, string, number]),
    [C.views, "riser", 0.28],
    [C.tools - 0.08, "whoosh", 0.4],
    [C.opus, "fx-pop", 0.4],
    [C.fifteen, "stamp", 0.45],
    [C.os - 0.08, "whoosh", 0.42],
    [C.os, "fx-reveal", 0.42],
    [C.free, "fx-boom", 0.5],
    [C.free + 0.03, "sparkle", 0.36],
    [C.github, "fx-pop", 0.38],
    [C.stars, "riser", 0.3],
    [C.link - 0.08, "whoosh", 0.4],
    [C.link + 0.2, "typing", 0.3],
    [C.aiBest, "fx-connect", 0.36],
    [C.vertical, "swish", 0.36],
    [C.captions, "pop", 0.35],
    [C.captions + 0.3, "pop", 0.32],
    [C.captions + 0.6, "ding", 0.36],
    [C.baat - 0.08, "whoosh", 0.4],
    [C.computer + 0.2, "typing", 0.3],
    [C.docker, "fx-pop", 0.38],
    [C.ram, "fx-pop", 0.38],
    [C.earning - 0.08, "whoosh", 0.4],
    [C.risks, "warn", 0.45],
    [C.risks + 0.02, "impact", 0.4],
    [C.footage, "click", 0.35],
    [C.youtube, "click", 0.35],
    [C.competition, "click", 0.35],
    [C.isliye - 0.08, "whoosh", 0.4],
    [C.permission, "ding", 0.34],
    [C.launch, "flip", 0.4],
    [C.aaj, "fx-boom", 0.45],
    [C.aaj + 0.03, "sparkle", 0.36],
    [C.guide - 0.08, "whoosh", 0.4],
    [C.comment + 0.1, "typing", 0.3],
    [C.clipper + 0.35, "ding", 0.36],
    [C.bio, "fx-pop", 0.38],
    [C.aisi, "fx-reveal", 0.36],
    [C.follow + 0.3, "click", 0.42],
    [C.follow + 0.33, "sparkle", 0.34],
  ] as [number, string, number][],
};
