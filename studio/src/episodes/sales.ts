import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./sales-voice-env.json";

/**
 * Build in Public, Episode 02: "How I made my first ebook sales", in the owner's recording
 * (public/sales/voice.wav, 44.20 s, a byte-identical copy of "ebook part 2.wav", never edited).
 * Phrase times come from the recording's pauses (ffmpeg silencedetect at -35 dB and -30 dB) and short whisper.cpp
 * passes; words inside a phrase are spread by syllables. Spoken numbers are shown as digits ("teen sau" = 300,
 * "ikkis" = 21, "ninyanve rupaye" = ₹99) so the captions stay word for word with the voice.
 *
 * Honesty (owner's decision, 11 Nov 2026): the narration keeps "about ₹300 in one day". Topmate records show
 * 3 orders on 9 and 10 Nov, all friends and family testing the checkout, ₹276.40 received after fees, ₹0 on ads.
 * The hook therefore carries a readable on-screen note with those facts.
 */

const captions: Cap[] = [
  ...card([0.15, 0.89, "*Bhai,"], [1.02, 2.04, "maine apni *pehli *Ebook"]),
  ...card([2.04, 3.16, "*bechkar sirf"], [3.16, 4.18, "*ek *din mein"]),
  ...card([4.39, 5.25, "lagbhag *₹300"], [5.25, 6.14, "ki *Sales kar li!"]),
  ...card([6.96, 8.14, "Wo bhi *bina"], [8.22, 9.09, "*Paid *Ads ke!"]),
  ...card([9.65, 10.52, "Lekin ye"], [10.68, 11.79, "sab *kiya *kaise?"]),
  ...card([12.24, 14.17, "Sabse pehle *ChatGPT se"], [14.26, 14.96, "| *Ebook ka *Draft banaya!"]),
  ...card([15.36, 16.25, "Phir *21 *AI *Prompts,"], [16.35, 17.31, "| *Editable *Templates"]),
  ...card([17.31, 18.24, "aur *Workbook"], [18.33, 19.51, "*taiyaar kiye!"]),
  ...card([20.31, 21.4, "*Topmate par sirf"], [21.4, 22.3, "*₹99 mein"], [22.3, 23.01, "*Launch kiya,"]),
  ...card([23.12, 24.62, "aur apni *Website se *jod diya!"]),
  ...card([24.95, 25.72, "Aur ab *asli *Challenge"], [25.85, 27.29, "shuru hota hai…"]),
  ...card([27.61, 28.2, "*anjaan *Customers"], [28.27, 29.23, "tak *pahunchna!"]),
  ...card([29.78, 30.37, "Tum bhi"], [30.45, 31.9, "apni pehli *Ebook banakar"]),
  ...card([31.9, 33.36, "uska *Launch karna *seekhna chahte ho?"]),
  ...card([33.88, 34.56, "*Comment karo"], [34.71, 35.12, "*EBOOK!"]),
  ...card([35.48, 36.75, "Poora *Setup *share karunga!"]),
  ...card([37.16, 38.4, "Meri *Ebook *Launch *Kit"], [38.4, 39.54, "| ka *link *Bio mein hai!"]),
  ...card([39.94, 40.39, "Aur aage"], [40.46, 41.43, "kitni *Sales hoti hain,"]),
  ...card([41.58, 42.71, "dekhne ke liye *Follow karo"], [42.94, 43.93, "*Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Money hook
  bhai: 0.15,
  maine: 1.02,
  bechkar: 2.04,
  ekDin: 3.16,
  lagbhag: 4.39,
  teenSau: 4.75,
  sales: 5.4,
  // 2. No paid ads
  noAds: 6.85,
  bina: 7.6,
  ads: 8.22,
  // 3. How
  how: 9.6,
  lekin: 9.65,
  kaise: 11.15,
  // 4. Step 1: ChatGPT draft
  step1: 12.15,
  chatgpt: 12.9,
  draft: 14.26,
  banaya: 14.55,
  // 5. Step 2: the kit
  step2: 15.25,
  ikkis: 15.55,
  editable: 16.35,
  workbook: 17.55,
  taiyaar: 18.33,
  // 6. Step 3: Topmate
  step3: 20.15,
  topmate: 20.31,
  price: 21.4,
  launch: 22.3,
  website: 23.12,
  jod: 23.9,
  // 7. The real challenge
  challenge: 24.85,
  asli: 25.2,
  anjaan: 27.61,
  pahunchna: 28.27,
  // 8. Comment CTA
  cta: 29.7,
  tumBhi: 29.78,
  launchKarna: 31.9,
  comment: 33.88,
  ebookWord: 34.71,
  setup: 35.48,
  // 9. Link in bio
  link: 37.05,
  kit: 37.37,
  linkWord: 38.4,
  bio: 38.9,
  // 10. Follow
  journey: 39.85,
  kitni: 40.46,
  dekhne: 41.58,
  follow: 42.15,
  brand: 42.94,
  end: 44.2,
};

export const sales = {
  voiceover: "sales/voice.wav",
  voiceSeconds: 44.2,
  music: "sales/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.5] },
    { at: C.bhai, pose: "surprised", expr: "excited", look: [0.6, -0.6], jump: true },
    { at: C.maine + 0.2, pose: "explain", expr: "talk", look: [0.5, -0.5] },
    { at: C.lagbhag, pose: "point", aim: -60, expr: "excited", look: [0.5, -0.8] },
    { at: C.sales, pose: "thumbs", expr: "happy", look: [0.4, -0.4] },
    { at: C.noAds, pose: "explain", expr: "talk", look: [0.6, -0.4] },
    { at: C.bina, pose: "point", aim: -15, expr: "skeptic", look: [0.8, -0.3] },
    { at: C.ads, pose: "thumbs", expr: "happy", look: [0.4, -0.5], jump: true },
    { at: C.lekin, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 5 },
    { at: C.step1, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.banaya, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: C.ikkis, pose: "point", aim: -45, expr: "excited", look: [0.6, -0.7] },
    { at: C.workbook, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    { at: C.taiyaar, pose: "thumbs", expr: "happy", look: [0.4, -0.5] },
    { at: C.topmate, pose: "point", aim: -40, expr: "talk", look: [0.6, -0.6] },
    { at: C.price, pose: "surprised", expr: "excited", look: [0.6, -0.6], jump: true },
    { at: C.website, pose: "explain", expr: "talk", look: [0.5, -0.5] },
    { at: C.challenge, pose: "think", expr: "thinking", look: [-0.4, -0.6], tilt: -5 },
    { at: C.anjaan, pose: "think", expr: "skeptic", look: [-0.6, -0.5], tilt: 4 },
    { at: C.tumBhi, pose: "explain", expr: "happy", look: [0.5, -0.5] },
    { at: C.comment, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.6] },
    { at: C.setup, pose: "thumbs", expr: "happy", look: [0.4, -0.4] },
    { at: C.link, pose: "point", aim: -140, expr: "excited", look: [-0.6, -0.6] },
    { at: C.journey, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    // Already beside the ₹300 headline on the first frame.
    { at: -2, x: 255, y: 1010, s: 0.8 },
    { at: C.noAds - 0.05, x: 250, y: 1080, s: 0.78 },
    { at: C.lekin, x: 540, y: 1060, s: 0.95 },
    { at: C.step1 - 0.1, ...LAYOUT.avatar.corner },
    { at: C.challenge - 0.1, x: 830, y: 1440, s: 0.7 },
    { at: C.cta - 0.1, ...LAYOUT.avatar.corner },
    { at: C.link - 0.1, x: 835, y: 1440, s: 0.7 },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.8, 4.1, 7.4, 10.2, 13.3, 16.8, 19.9, 23.4, 26.6, 30.1, 33.0, 36.2, 39.6, 42.6],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "impact", 0.6],
    [0.02, "coin", 0.45],
    [0.08, "sparkle", 0.35],
    [C.maine, "whoosh", 0.25],
    [C.ekDin, "pop", 0.3],
    [C.teenSau - 0.02, "impact", 0.5],
    [C.teenSau, "coin", 0.4],
    [C.teenSau + 0.14, "coin", 0.3],
    [C.sales, "ding", 0.35],
    // No ads
    [C.noAds, "whoosh", 0.4],
    ...[0, 0.12, 0.24].map((d) => [C.noAds + 0.15 + d, "pop", 0.25] as [number, string, number]),
    [C.bina + 0.1, "swish", 0.45],
    [C.bina + 0.2, "swish", 0.35],
    [C.ads, "stamp", 0.55],
    [C.ads + 0.04, "impact", 0.4],
    // How
    [C.how - 0.05, "whoosh", 0.35],
    [C.kaise, "pop", 0.35],
    [C.kaise + 0.2, "warn", 0.25],
    // Step 1
    [C.step1 - 0.05, "whoosh", 0.4],
    [C.step1 + 0.1, "click", 0.35],
    [C.chatgpt + 0.2, "typing", 0.32],
    ...[0, 0.18, 0.36, 0.54, 0.72].map((d) => [C.draft - 0.3 + d, "flip", 0.18] as [number, string, number]),
    [C.banaya, "ding", 0.35],
    // Step 2
    [C.step2 - 0.05, "whoosh", 0.4],
    ...[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((d) => [C.step2 + 0.1 + d, "flip", 0.16] as [number, string, number]),
    [C.ikkis, "impact", 0.4],
    [C.ikkis + 0.05, "sparkle", 0.3],
    [C.editable, "pop", 0.35],
    [C.workbook, "pop", 0.35],
    [C.taiyaar, "snap", 0.4],
    [C.taiyaar + 0.05, "sparkle", 0.35],
    // Step 3
    [C.step3 - 0.05, "whoosh", 0.4],
    [C.topmate + 0.1, "click", 0.35],
    [C.price - 0.02, "impact", 0.6],
    [C.price, "coin", 0.45],
    [C.price + 0.05, "sparkle", 0.4],
    [C.launch, "pop", 0.35],
    [C.website, "swish", 0.4],
    [C.jod, "snap", 0.45],
    [C.jod + 0.05, "ding", 0.3],
    // Challenge
    [C.challenge - 0.1, "riser", 0.22],
    [C.challenge, "whoosh", 0.4],
    [C.asli, "stamp", 0.45],
    ...[0, 0.12, 0.24, 0.36, 0.48].map((d) => [C.anjaan + d, "pop", 0.22] as [number, string, number]),
    [C.pahunchna, "warn", 0.3],
    // CTA
    [C.cta - 0.05, "whoosh", 0.4],
    [C.launchKarna, "swish", 0.3],
    [C.comment, "pop", 0.35],
    [C.ebookWord - 0.2, "typing", 0.3],
    [C.ebookWord + 0.3, "click", 0.45],
    [C.ebookWord + 0.32, "sparkle", 0.35],
    [C.setup, "ding", 0.32],
    // Link
    [C.link - 0.05, "whoosh", 0.4],
    [C.kit, "pop", 0.3],
    [C.linkWord, "impact", 0.45],
    [C.linkWord + 0.04, "sparkle", 0.35],
    [C.bio, "click", 0.4],
    // Follow
    [C.journey - 0.05, "whoosh", 0.35],
    ...[0, 0.25, 0.5].map((d) => [C.journey + 0.2 + d, "pop", 0.25] as [number, string, number]),
    [C.kitni, "flip", 0.3],
    [C.follow, "pop", 0.32],
    [C.follow + 0.55, "click", 0.45],
    [C.brand, "sparkle", 0.4],
  ] as [number, string, number][],
};
