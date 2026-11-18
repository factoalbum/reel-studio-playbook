import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./gta6clip-voice-env.json";

/**
 * Creator Secrets: "19 November ko GTA 6 aa raha hai... clips kaat ke paise banayenge": GTA 6 launch-day clipping.
 * The owner's Google AI Studio recording (public/gta6clip/voice.wav, 71.08 s, a byte-identical copy of
 * "Generated Audio November 18, 2026 - 1_57AM.wav", MD5 a346e5ac53bd005cf656d35365c2e634, never edited). Phrase
 * edges come from the pauses (silencedetect -38 dB, 0.12 s); words were checked with whisper.cpp (small) on pieces
 * cut at the pauses. The voice follows the owner's script; subtitles are Roman Hinglish.
 *
 * Fact check, 17 to 18 Nov 2026:
 * - GTA 6: Rockstar Games, 19 November 2026, PS5 and Xbox Series X|S (Rockstar announcement; TweakTown, Fox).
 * - Clipping campaigns: brands and creators set a rate per 1,000 views and a total budget; approved clips are paid
 *   by views; payment stops when the budget runs out; clips can be rejected (docs.whop.com Content Rewards;
 *   contentrewards.com). Median rate about $1.09 per 1,000 views across 707 campaigns, data of 10 Nov 2026
 *   (contentrewards.com/articles/how-much-do-clippers-make). Joining is free.
 * - OpusClip free plan: 60 credits = 60 minutes of upload a month, watermark on exports (third-party pricing
 *   summaries, Nov 2026; OpusClip's own page can change).
 * - Inspired by the format of two reels (@techstackbro, @ezsnippet). Our own words, angle and visuals; we add the
 *   real rate and the two traps. No Rockstar logo, artwork or footage: "GTA 6" is set in our own type, the stream and
 *   clips are code illustrations, labelled. The campaign card is an illustration, labelled, not a real listing.
 * - No income promise: "agar clip approve ho jaaye", "results vary" on screen. No DM promised (DMs restricted).
 */

const captions: Cap[] = [
  ...card([0.17, 1.4, "*19 *November ko"], [1.45, 3.5, "*GTA *6 aa raha hai,"]),
  ...card([3.7, 4.5, "aur us din"], [4.55, 5.25, "kuch log"]),
  ...card([5.42, 6.15, "*khel ke *nahi,"]),
  ...card([6.6, 8.05, "*clips *kaat ke | *paise banayenge!"]),
  ...card([8.38, 9.6, "Ise kehte hain *clipping."]),
  ...card([9.78, 12.45, "*Brands aur *creators | *campaign chalate hain:"]),
  ...card([12.64, 14.3, "unke videos ke | chhote *clips banao,"]),
  ...card([14.44, 16.4, "post karo aur | *views ke hisaab se"]),
  ...card([16.56, 17.45, "*paisa lo."], [17.5, 17.95, "*Kitna?"]),
  ...card([18.24, 19.7, "Zyada tar campaigns lagbhag"]),
  ...card([19.87, 22.1, "*$1 per *1,000 *views dete hain."]),
  ...card([22.25, 24.9, "Yaani *1 *lakh *views pe | around *$100,"]),
  ...card([25.05, 26.6, "agar clip *approve ho jaaye."]),
  ...card([26.93, 27.6, "*Step *1:"], [28.0, 29.8, "*Whop pe *Content *Rewards kholo,"]),
  ...card([29.95, 31.85, "gaming ya *GTA *6 campaign dhoondho."]),
  ...card([32.04, 33.3, "Join karna *free hai."], [33.4, 34.15, "Koi *paisa maange,"]),
  ...card([34.34, 35.3, "toh samjho *scam hai."]),
  ...card([35.85, 36.4, "*Step *2:"], [36.55, 37.85, "launch wale din | *streams dekho,"]),
  ...card([38.5, 39.95, "sabse mazedaar *moment ka"], [40.05, 41.3, "*timestamp note karo."]),
  ...card([41.58, 42.15, "*Step *3:"], [42.19, 44.45, "*OpusClip ke *free plan mein | link daalo,"]),
  ...card([44.64, 46.2, "*AI khud short clip | bana dega."]),
  ...card([46.36, 48.05, "Free mein mahine ke | *60 *minute milte hain,"]),
  ...card([48.25, 49.3, "bas *watermark aata hai."]),
  ...card([49.64, 50.3, "*Step *4:"], [50.31, 52.75, "pehle *24 *ghante mein | post karo."]),
  ...card([52.99, 54.15, "Campaign ka *budget khatam,"]),
  ...card([54.29, 55.4, "toh *payment bhi khatam."]),
  ...card([55.45, 57.3, "Late clips ko | *views milte hain,"], [57.41, 58.2, "*paisa *nahi."]),
  ...card([58.57, 60.45, "Aur sirf unhi creators ke | clips banao"], [60.57, 62.95, "jinka *campaign hai | ya *permission di hai."]),
  ...card([63.07, 63.28, "Warna"], [63.3, 64.55, "*copyright *strike."]),
  ...card([64.68, 66.75, "Poora *GTA *6 *clipping plan | *free chahiye?"]),
  ...card([66.95, 68.0, "*Comment karo *GTA6,"], [68.06, 70.5, "ya *link *in *bio pe | *GTA6 type karo."]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  nov: 0.17,
  gta: 1.51,
  aaRaha: 2.62,
  aur: 3.7,
  log: 4.31,
  khel: 5.42,
  nahi: 5.9,
  clips: 6.6,
  kaat: 7.05,
  paise: 7.5,
  // 2. What clipping is
  ise: 8.38,
  clipping: 9.1,
  brands: 9.78,
  creators: 10.57,
  campaign: 11.26,
  unke: 12.64,
  chhote: 13.48,
  banao: 14.1,
  post: 14.44,
  views: 15.08,
  paisaLo: 16.56,
  // 3. The real number
  kitna: 17.5,
  zyada: 18.24,
  dollar: 19.87,
  thousand: 20.64,
  yaani: 22.25,
  lakh: 22.6,
  hundred: 24.0,
  agar: 25.05,
  approve: 25.77,
  // 4. Step 1: Whop Content Rewards
  step1: 26.93,
  whop: 28.03,
  rewards: 28.33,
  gaming: 29.95,
  gta6: 30.39,
  join: 32.04,
  free: 32.76,
  koi: 33.4,
  scam: 34.87,
  // 5. Step 2: streams, timestamp
  step2: 35.8,
  launch: 36.55,
  streams: 37.25,
  moment: 38.5,
  timestamp: 40.05,
  note: 40.87,
  // 6. Step 3: OpusClip
  step3: 41.58,
  opus: 42.19,
  link: 43.75,
  ai: 44.64,
  short: 45.21,
  freeMein: 46.36,
  sixty: 47.16,
  watermark: 48.35,
  // 7. Step 4: first 24 hours, budget
  step4: 49.64,
  hours: 50.62,
  postNow: 51.79,
  budget: 52.99,
  payment: 54.39,
  late: 55.45,
  lateViews: 56.39,
  paisaNahi: 57.41,
  // 8. Honest: permission, copyright
  sirf: 58.57,
  permission: 62.21,
  warna: 63.07,
  strike: 63.3,
  // 9. CTA
  poora: 64.68,
  comment: 66.95,
  gtaWord: 67.2,
  bio: 68.06,
  end: 71.08,
};

export const gta6clip = {
  voiceover: "gta6clip/voice.wav",
  voiceSeconds: 71.08,
  music: "gta6clip/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "excited", look: [0.3, -0.8], tilt: 3 },
    { at: C.aur, pose: "think", expr: "thinking", look: [0.4, -0.6], tilt: 4 },
    { at: C.khel, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.clips, pose: "oneMore", expr: "excited", look: [0.2, -0.6], jump: true },
    { at: C.ise, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.unke, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.paisaLo, pose: "thumbs", expr: "excited", look: [0.5, -0.6], jump: true },
    { at: C.kitna, pose: "think", expr: "thinking", look: [0.4, -0.8], tilt: 5 },
    { at: C.dollar, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.hundred, pose: "surprised", expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.agar, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.step1, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.join, pose: "thumbs", expr: "happy", look: [0.6, -0.6] },
    { at: C.koi, pose: "explain", expr: "annoyed", look: [0.6, -0.6] },
    { at: C.step2, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.moment, pose: "oneMore", expr: "excited", look: [0.4, -0.7] },
    { at: C.step3, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.ai, pose: "thumbs", expr: "happy", look: [0.6, -0.6] },
    { at: C.watermark, pose: "explain", expr: "skeptic", look: [0.6, -0.6] },
    { at: C.step4, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.budget, pose: "explain", expr: "annoyed", look: [0.6, -0.6] },
    { at: C.paisaNahi, pose: "think", expr: "skeptic", look: [0.5, -0.6], tilt: 4 },
    { at: C.sirf, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.warna, pose: "surprised", expr: "surprised", look: [0.4, -0.7], jump: true },
    { at: C.poora, pose: "oneMore", expr: "happy", look: [0, -0.6] },
    { at: C.comment, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.bio, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1470, s: 0.74 },
    { at: C.khel - 0.1, x: 800, y: 1460, s: 0.7 },
    { at: C.ise - 0.1, ...LAYOUT.avatar.corner },
    { at: C.kitna - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.step1 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.sirf - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.poora - 0.1, ...LAYOUT.avatar.corner },
    { at: C.bio - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.2, 4.1, 7.0, 10.1, 13.2, 16.0, 19.1, 22.4, 25.4, 28.6, 31.6, 34.6, 37.6, 40.6, 43.6, 46.6, 49.8, 52.8, 55.9, 58.9, 62.0, 65.2, 68.3],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.nov, "flip", 0.42],
    [C.gta - 0.05, "stamp", 0.5],
    [C.aaRaha, "fx-reveal", 0.4],
    [C.khel, "swish", 0.32],
    [C.nahi, "warn", 0.38],
    [C.clips - 0.06, "whoosh", 0.4],
    [C.kaat, "stamp", 0.45],
    [C.kaat + 0.2, "swish", 0.3],
    ...[0, 1, 2, 3, 4, 5].map((i) => [C.paise + i * 0.08, "coin", 0.26] as [number, string, number]),
    // What clipping is
    [C.ise - 0.08, "whoosh", 0.4],
    [C.clipping, "fx-pop", 0.45],
    [C.brands, "pop", 0.3],
    [C.creators, "pop", 0.3],
    [C.campaign, "fx-connect", 0.32],
    ...[0, 1, 2].map((i) => [C.chhote + i * 0.18, "swish", 0.24] as [number, string, number]),
    [C.post, "click", 0.3],
    [C.views, "fx-connect", 0.3],
    ...[0, 1, 2, 3].map((i) => [C.paisaLo + i * 0.08, "coin", 0.24] as [number, string, number]),
    // The real number
    [C.kitna - 0.06, "whoosh", 0.4],
    [C.kitna, "stamp", 0.45],
    [C.dollar, "fx-pop", 0.42],
    [C.thousand, "pop", 0.32],
    [C.lakh, "riser", 0.3],
    [C.hundred, "fx-boom", 0.45],
    [C.hundred + 0.03, "sparkle", 0.34],
    [C.approve - 0.05, "warn", 0.36],
    [C.approve + 0.2, "stamp", 0.42],
    // Step 1
    [C.step1 - 0.08, "whoosh", 0.4],
    [C.step1, "fx-step1", 0.48],
    [C.rewards, "fx-reveal", 0.36],
    [C.gta6, "pop", 0.32],
    [C.free, "ding", 0.32],
    [C.scam - 0.05, "warn", 0.42],
    [C.scam, "stamp", 0.5],
    // Step 2
    [C.step2 - 0.05, "fx-step2", 0.48],
    [C.streams, "fx-reveal", 0.32],
    [C.moment, "fx-pop", 0.38],
    [C.timestamp, "typing", 0.32],
    [C.note, "stamp", 0.4],
    // Step 3
    [C.step3 - 0.05, "fx-step3", 0.48],
    [C.link, "click", 0.32],
    [C.ai, "fx-connect", 0.34],
    [C.short, "fx-reveal", 0.38],
    [C.short + 0.04, "sparkle", 0.3],
    [C.sixty, "pop", 0.32],
    [C.watermark, "stamp", 0.38],
    // Step 4
    [C.step4 - 0.05, "fx-step1", 0.44],
    [C.hours, "flip", 0.38],
    [C.postNow, "click", 0.32],
    [C.budget, "riser", 0.3],
    [C.payment, "warn", 0.4],
    [C.payment + 0.25, "stamp", 0.48],
    [C.late, "swish", 0.3],
    [C.paisaNahi, "stamp", 0.45],
    // Honest
    [C.sirf - 0.06, "whoosh", 0.38],
    [C.permission, "ding", 0.32],
    [C.warna, "warn", 0.42],
    [C.strike, "fx-boom", 0.5],
    [C.strike + 0.02, "stamp", 0.5],
    // CTA
    [C.poora - 0.06, "whoosh", 0.4],
    [C.poora + 0.3, "fx-pop", 0.4],
    [C.comment, "swish", 0.32],
    [C.gtaWord, "fx-pop", 0.52],
    [C.gtaWord + 0.02, "sparkle", 0.34],
    [C.bio, "fx-boom", 0.42],
    [C.bio + 0.04, "fx-reveal", 0.4],
  ] as [number, string, number][],
};
