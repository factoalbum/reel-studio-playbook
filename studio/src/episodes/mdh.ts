import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import capture from "./mdh-capture.json";
import voiceEnv from "./mdh-voice-env.json";

/**
 * "The Million Dollar Homepage": an Internet Stories mini-documentary, in the owner's Google AI Studio Hindi voice
 * (public/mdh/voice.wav, 72.48 s, never edited). Phrase times are the speech stretches between the recording's pauses
 * (an RMS pass on voice16k.wav); the words come from local whisper.cpp passes (public/mdh/*.srt, out/mdh-clips*).
 * Inside a phrase, word times are spread by syllables. Every scene takes its times from here.
 */

type Seg = [number, number, string];

const weight = (w: string) => {
  if (/\d/.test(w)) return w.replace(/\D/g, "").length;
  const m = w.toLowerCase().replace(/[^a-z]/g, "").match(/[aeiouy]+/g);
  return Math.max(1, m ? m.length : 1) + 0.3;
};

/**
 * Turns timed phrases into subtitle cards. Each card is one line: "|" starts a new card, and so does a phrase
 * whose text starts with "|". "*word" gets the lime marker. Word times are spread over the phrase by syllables.
 */
export function card(...segs: Seg[]): Cap[] {
  const caps: Cap[] = [];
  let cur: Cap | null = null;
  const r = (v: number) => Math.round(v * 100) / 100;
  segs.forEach(([a, b, text], si) => {
    const list: { w: string; brk: boolean }[] = [];
    let brk = si === 0;
    for (const tk of text.split(/\s+/).filter(Boolean)) {
      if (tk === "|") {
        brk = true;
        continue;
      }
      list.push({ w: tk, brk });
      brk = false;
    }
    const ws = list.map((x) => weight(x.w.replace(/^\*/, "")));
    const total = ws.reduce((s, v) => s + v, 0);
    let acc = 0;
    list.forEach((x, i) => {
      const at = r(a + ((b - a) * acc) / total);
      acc += ws[i];
      const end = r(a + ((b - a) * acc) / total);
      const w = x.w.replace(/^\*/, "");
      if (!cur || x.brk) {
        cur = { start: at, end, words: [], hi: [] };
        caps.push(cur);
      }
      cur.words.push([w, at]);
      cur.end = end;
      if (x.w.startsWith("*")) cur.hi!.push(w);
    });
  });
  return caps;
}

const captions: Cap[] = [
  ...card([0.06, 0.52, "Socho,"]),
  ...card([1.21, 2.7, "ek khaali *website…"]),
  ...card([3.43, 4.29, "na koi *product,"]),
  ...card([4.91, 5.68, "na koi *service,"]),
  ...card([6.4, 7.09, "phir bhi"], [7.52, 8.45, "is website par"]),
  ...card([8.58, 10.75, "*das *lakh *dollar se zyada | ki bikri hui!"]),
  ...card([11.57, 12.14, "Lekin *kaise?"]),
  ...card([12.97, 14.76, "Kahani hai saal *2005 ki."]),
  ...card([15.58, 16.79, "Ek 21 saal ka ladka,"], [17.28, 17.83, "*Alex *Tew,"]),
  ...card([18.47, 20.74, "apne college ki *fees ke liye | paise jutaana chahta tha."]),
  ...card([21.54, 23.66, "Tabhi uske dimaag mein | ek ajeeb sa *idea aaya."]),
  ...card([24.48, 25.42, "Usne ek *website banaayi,"]),
  ...card([25.99, 26.48, "jis mein the"]),
  ...card([26.8, 28.92, "*das *lakh | chhote chhote *pixels."]),
  ...card([29.57, 30.97, "Aur har *pixel ki keemat rakhi,"], [31.42, 32.09, "| ek *dollar."]),
  ...card([33.0, 36.69, "Companiyan *sau-sau pixels ke | blocks khareed kar | wahan apne *vigyapan | lagaane lagin."]),
  ...card([37.32, 39.25, "Dheere dheere | ye khaali website"], [39.72, 40.85, "| *vigyapanon se bhar gayi."]),
  ...card([41.52, 42.3, "Aur aakhir mein"]),
  ...card([42.68, 44.25, "iski kul *bikri pahunch gayi"]),
  ...card([44.55, 46.31, "*das *lakh *dollar se bhi upar."]),
  ...card([47.33, 47.86, "Naam tha,"]),
  ...card([48.26, 49.04, "The Million"], [49.18, 49.54, "Dollar"], [49.74, 50.35, "Homepage."]),
  ...card([51.15, 52.25, "Aur sabse *dilchasp baat,"]),
  ...card([52.94, 53.71, "ye website"], [53.88, 55.41, "| *aaj *bhi internet par | *maujood hai."]),
  ...card([56.11, 56.39, "Socho,"], [56.95, 57.83, "ek aisa *idea"]),
  ...card([58.23, 59.92, "jise aaj banaana | bahut *aasaan hai,"]),
  ...card([60.32, 60.86, "*2005 mein"], [61.06, 63.27, "| laakhon dollar ki | *bikri kar gaya."]),
  ...card([63.7, 65.94, "To asli *game sirf | website banaane ka nahi,"]),
  ...card([66.36, 68.37, "*idea aur logon ka | *dhyaan kheechne ka bhi hai."]),
  ...card([68.9, 71.12, "Aisi internet ki | *ansuni kahaniyon ke liye,"]),
  ...card([71.29, 72.17, "*follow karo Internet Toolbox."]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. The impossible business
  emptyAt: 1.21,
  productAt: 3.43,
  productX: 4.05,
  serviceAt: 4.91,
  serviceX: 5.45,
  phirAt: 6.4,
  millionAt: 8.58,
  bikriAt: 9.84,
  kaiseAt: 11.57,
  // 2. Welcome to 2005
  travelAt: 12.6,
  yearLand: 14.1,
  roomAt: 14.8,
  lampAt: 15.45,
  nameAt: 17.28,
  feesAt: 18.47,
  ideaAt: 22.71,
  diveAt: 23.66,
  // 3. The million-pixel idea
  siteAt: 24.48,
  gridAt: 25.99,
  zoomOutFrom: 26.8,
  zoomOutTo: 28.92,
  pixelAt: 29.57,
  dollarAt: 31.42,
  // 4. The ads arrive
  buyAt: 33.0,
  blockLabel: 33.55,
  payAt: 34.0,
  placeAt: 34.85,
  moreAt: 35.3,
  fillFrom: 37.32,
  fillMost: 40.85,
  // 5. The site becomes valuable
  aakhirAt: 41.52,
  countFrom: 42.68,
  totalAt: 44.71,
  grossAt: 45.3,
  finalAt: 45.85,
  // 6. The real website
  realAt: 47.33,
  nameReveal: 48.26,
  pullTo: 49.6,
  realBadge: 51.15,
  onlineAt: 52.94,
  inspectFrom: 53.4,
  // 7. The lesson and the outro
  lessonAt: 56.0,
  bulbAt: 56.95,
  buildAt: 58.23,
  then2005: 60.32,
  coinsAt: 61.06,
  gameAt: 63.7,
  sirfAt: 64.55,
  ideaTile: 66.36,
  attention: 67.0,
  resultAt: 67.95,
  outroAt: 68.9,
  followAt: 71.29,
  tapAt: 71.75,
};

export const mdh = {
  voiceover: "mdh/voice.wav",
  voiceSeconds: 72.48,
  tailSeconds: 0.5,
  // Made for this voice by scripts/make-audio-mdh.mjs (original synthesis).
  music: "mdh/music.wav",
  env: voiceEnv as number[],
  // Real screenshots of the live site (scripts/capture-mdh.mjs).
  capture,
  // Shown from the money reveal on.
  disclaimer: ["Historical facts. Gross sales, not profit.", "Ads in the animation are made up."],
  disclaimerFrom: 8.4,
  captions,

  // The presenter only appears for "Lekin kaise?" and for the lesson; Alex Tew is his own character.
  avatarKeys: [
    { at: 11.4, pose: "think", expr: "thinking", look: [0.4, -0.9] },
    { at: 11.57, pose: "surprised", expr: "surprised", look: [0.3, -0.6] },
    { at: 12.2, pose: "think", expr: "thinking", look: [-0.5, -0.9] },
    { at: 55.9, pose: "think", expr: "thinking", look: [0.4, -0.9] },
    { at: 56.95, pose: "point", aim: -60, expr: "excited", look: [0.6, -0.8] },
    { at: 58.23, pose: "explain", expr: "talk", look: [0.5, -0.7] },
    { at: 60.32, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: 61.06, pose: "surprised", expr: "surprised", look: [0.3, -0.6] },
    { at: 62.2, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: 63.7, pose: "explain", expr: "talk", look: [0.4, -0.7] },
    { at: 66.36, pose: "point", aim: -65, expr: "excited", look: [0.6, -0.8] },
    { at: 67.95, pose: "oneMore", expr: "excited", look: [0, 0], jump: true },
    { at: 68.9, pose: "explain", expr: "happy", look: [0, 0] },
    { at: 71.29, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: 11.4, ...LAYOUT.avatar.corner },
    { at: 12.55, x: 250, y: 3000, s: 0.7 },
    { at: 55.85, x: 540, y: 790, s: 1.15 },
    { at: 58.1, ...LAYOUT.avatar.corner },
    { at: 68.85, x: 540, y: 1530, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [11.9, 57.4, 59.6, 62.9, 65.2, 69.6, 72.0],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "whoosh", 0.3],
    [1.21, "pop", 0.25],
    [3.43, "pop", 0.3],
    [4.05, "swish", 0.3],
    [4.91, "pop", 0.3],
    [5.45, "swish", 0.3],
    [8.58, "impact", 0.5],
    [8.62, "coin", 0.4],
    [9.84, "ding", 0.32],
    [11.4, "whoosh", 0.3],
    [11.6, "pop", 0.3],
    [12.6, "whoosh", 0.45],
    [14.1, "impact", 0.4],
    [14.8, "whoosh", 0.35],
    [15.45, "click", 0.5],
    [17.28, "pop", 0.3],
    [18.5, "swish", 0.3],
    [18.9, "pop", 0.25],
    [22.71, "sparkle", 0.5],
    [22.75, "ding", 0.28],
    [23.66, "whoosh", 0.4],
    [24.48, "pop", 0.3],
    [25.99, "click", 0.4],
    [26.8, "swish", 0.35],
    [28.9, "pop", 0.28],
    [29.57, "whoosh", 0.35],
    [31.42, "coin", 0.45],
    [31.45, "impact", 0.3],
    [33.0, "pop", 0.28],
    [33.55, "pop", 0.25],
    [34.0, "coin", 0.4],
    [34.85, "click", 0.45],
    [35.3, "pop", 0.2],
    [35.6, "pop", 0.2],
    [35.9, "pop", 0.2],
    [36.2, "pop", 0.2],
    [37.32, "whoosh", 0.35],
    [37.6, "pop", 0.12],
    [38.0, "pop", 0.12],
    [38.35, "pop", 0.12],
    [38.7, "pop", 0.12],
    [39.0, "pop", 0.12],
    [39.3, "pop", 0.12],
    [39.6, "pop", 0.12],
    [39.9, "pop", 0.12],
    [40.2, "pop", 0.12],
    [41.52, "swish", 0.3],
    [44.71, "impact", 0.55],
    [44.74, "coin", 0.4],
    [45.3, "pop", 0.28],
    [45.85, "pop", 0.28],
    [47.33, "sparkle", 0.4],
    [48.26, "whoosh", 0.4],
    [48.5, "pop", 0.3],
    [51.15, "pop", 0.3],
    [52.94, "ding", 0.32],
    [53.4, "swish", 0.25],
    [55.9, "whoosh", 0.35],
    [56.95, "sparkle", 0.4],
    [58.23, "typing", 0.3],
    [60.32, "pop", 0.28],
    [61.06, "coin", 0.4],
    [63.7, "swish", 0.3],
    [64.55, "pop", 0.25],
    [66.36, "pop", 0.3],
    [67.0, "pop", 0.25],
    [67.95, "ding", 0.32],
    [68.9, "whoosh", 0.45],
    [69.2, "impact", 0.32],
    [71.29, "pop", 0.3],
    [71.75, "click", 0.55],
    [71.8, "ding", 0.3],
  ] as [number, string, number][],
};
