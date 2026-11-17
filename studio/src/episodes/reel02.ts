import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import type { HookCues } from "../ep02/HookScene";
import type { HomeCues } from "../ep02/HomeScene";
import type { GstCues } from "../ep02/GstScene";
import type { BuildCues } from "../ep02/BuildScene";
import type { CtaCues } from "../ep02/CtaScene";
import capture from "./reel02-capture.json";
import voiceEnv from "./reel02-voice-env.json";

/**
 * Reel 02: "Ek ruler kyon? Poori tools ki website!" in the owner's own Hindi voice (public/ep02/voice.wav).
 * Word times come from whisper.cpp (scripts/transcribe-to.mjs, scripts/transcribe-clips-to.mjs), checked against
 * the pauses and loudness of the recording. Every scene takes its times from here, so a new take only needs new numbers.
 */

const hook: HookCues = {
  card: 0.15,
  na: 2.79,
  laugh: 3.2,
  think: 4.38,
  collapse: 5.5,
  title: 5.8,
  kyon: 6.27,
  burst: 7.03,
  tools: 7.24,
  ki: 7.58,
  website: 7.72,
  converge: 9.13,
  gone: 9.9,
};

const home: HomeCues = { enter: 9.62, meri: 10.62, internet: 11.78, count: 13.31, ninety: 13.64, free: 14.64, jaise: 16.03, gst: 16.42, click: 16.6, leave: 16.8 };

const gst: GstCues = {
  intro: 16.03,
  gstWord: 16.42,
  calcWord: 16.8,
  show: 16.8,
  amount: 17.77,
  keys: [17.85, 17.97, 18.09, 18.21],
  rateWord: 18.62,
  hover: 18.55,
  pick: 18.85,
  result: 19.4,
  resultWord: 19.65,
  ready: 20.27,
  out: 20.75,
};

const build: BuildCues = {
  crazy: 21.0,
  sabse: 21.26,
  crazyWord: 21.66,
  baat: 22.1,
  corner: 22.3,
  typeFrom: 22.4,
  typeTo: 23.25,
  send: 23.35,
  answer: 23.6,
  scroll: 24.25,
  chatgpt: 24.87,
  preview: 24.95,
  typed: 25.05,
  hover: 25.25,
  click: 25.5,
  works: 25.55,
  publish: 25.8,
  out: 26.62,
};

const cta: CtaCues = {
  enter: 26.7,
  domain: 26.97,
  link: 28.04,
  leave: 28.85,
  poori: 29.3,
  banana: 29.85,
  card: 29.9,
  comment: 31.2,
  keyword: 32.13,
  typeTo: 32.6,
  send: 32.75,
  followIn: 32.95,
  follow: 33.0,
  tap: 33.45,
  part: 34.03,
};

export const reel02 = {
  voiceover: "ep02/voice.wav",
  voiceSeconds: 35.64,
  tailSeconds: 0.5,
  // Made for this voice by scripts/make-audio-ep02.mjs (risers into the reveal and the ChatGPT drop).
  music: "ep02/music.wav",
  env: voiceEnv as number[],
  // The website's real address, exactly as typed in a browser.
  domain: "internetoolbox.com",
  // Call to action: the comment keyword and what comes next.
  keyword: "Part 3",
  next: "Part 3",
  part: "Part 2",
  // Shown from the ChatGPT part on: one demo tool was made with ChatGPT, not the whole website; domains are not free.
  disclaimer: ["ChatGPT demo: one simple tool.", "Custom domains cost extra."],
  disclaimerFrom: 20.9,
  // Episode 01's real screenshot (piliapp.com ruler), cropped to the address, title and ruler (no ads).
  recap: { shot: { file: "piliapp-ruler.png", width: 1879, height: 951 }, crop: { x: 145, y: 11, w: 1500, h: 564 } },
  // Real captures of www.internetoolbox.com and of ChatGPT's code in Chrome (scripts/capture-ep02*.mjs).
  capture,
  // The exact prompt used in ChatGPT and real screenshots of its answer (public/ep02/chatgpt/README.txt).
  chat: {
    prompt: "Make a simple percentage calculator in one HTML file using HTML, CSS and JavaScript. Keep the code short.",
    top: { file: "ep02/chatgpt/answer-top.png", width: 955, height: 758 },
    code: { file: "ep02/chatgpt/answer-code.png", width: 955, height: 758 },
  },
  cues: { hook, home, gst, build, cta },

  captions: [
    { start: 0.3, end: 0.56, words: [["Bhai,", 0.3]] },
    { start: 0.7, end: 1.32, words: [["pichhli", 0.7], ["reel", 1.02], ["mein", 1.17]] },
    { start: 1.38, end: 1.98, words: [["woh", 1.38], ["ruler", 1.5], ["wali", 1.76]], hi: ["ruler"] },
    { start: 2.02, end: 3.02, words: [["website", 2.02], ["dekhi", 2.4], ["thi", 2.66], ["na?", 2.79]], hi: ["website"] },
    { start: 4.4, end: 5.44, words: [["To", 4.4], ["maine", 4.55], ["socha,", 4.95]] },
    { start: 5.8, end: 6.63, words: [["ek", 5.8], ["ruler", 6.02], ["kyon?", 6.27]], hi: ["ruler", "kyon?"] },
    { start: 7.03, end: 7.68, words: [["Poori", 7.03], ["tools", 7.24], ["ki", 7.58]], hi: ["tools"] },
    { start: 7.72, end: 8.65, words: [["website", 7.72], ["banate", 8.12], ["hain!", 8.45]], hi: ["website"] },
    { start: 9.13, end: 10.01, words: [["Aur", 9.13], ["ye", 9.45], ["dekho!", 9.62]], hi: ["dekho!"] },
    { start: 10.32, end: 11.47, words: [["Ye", 10.32], ["hai", 10.45], ["meri", 10.62], ["website,", 10.98]], hi: ["website,"] },
    { start: 11.78, end: 13.05, words: [["Internet", 11.78], ["Toolbox!", 12.47]], hi: ["Internet", "Toolbox!"] },
    { start: 13.31, end: 14.58, words: [["Yahan", 13.31], ["90", 13.64], ["se", 13.95], ["zyada", 14.2]], hi: ["90"] },
    { start: 14.64, end: 15.62, words: [["free", 14.64], ["tools", 14.98], ["hain!", 15.33]], hi: ["free"] },
    { start: 16.03, end: 16.4, words: [["Jaise", 16.03], ["ye", 16.3]] },
    { start: 16.42, end: 17.33, words: [["GST", 16.42], ["calculator.", 16.8]], hi: ["GST"] },
    { start: 17.77, end: 18.26, words: [["Amount", 17.77], ["daalo,", 18.02]], hi: ["Amount"] },
    { start: 18.62, end: 19.09, words: [["rate", 18.62], ["chuno,", 18.85]], hi: ["rate"] },
    { start: 19.48, end: 20.67, words: [["aur", 19.48], ["result", 19.65], ["taiyaar!", 20.27]], hi: ["result"] },
    { start: 21.06, end: 21.87, words: [["Ab", 21.06], ["sabse", 21.26], ["crazy", 21.66]], hi: ["crazy"] },
    { start: 22.1, end: 22.99, words: [["baat", 22.1], ["suno:", 22.45]] },
    { start: 23.39, end: 24.22, words: [["aisa", 23.39], ["ek", 23.67], ["tool", 23.95]], hi: ["tool"] },
    { start: 24.27, end: 25.3, words: [["tum", 24.27], ["bhi", 24.51], ["ChatGPT", 24.87]], hi: ["ChatGPT"] },
    { start: 25.35, end: 25.74, words: [["ki", 25.35], ["madad", 25.45], ["se", 25.65]] },
    { start: 25.78, end: 26.37, words: [["bana", 25.78], ["sakte", 25.98], ["ho!", 26.22]] },
    { start: 26.77, end: 27.3, words: [["Meri", 26.77], ["website", 26.97]], hi: ["website"] },
    { start: 27.33, end: 27.83, words: [["check", 27.33], ["karni", 27.5], ["hai,", 27.68]] },
    { start: 28.04, end: 28.71, words: [["link", 28.04], ["bio", 28.28], ["mein", 28.5], ["hai.", 28.6]], hi: ["link", "bio"] },
    { start: 29.08, end: 29.8, words: [["Aur", 29.08], ["poori", 29.3], ["website", 29.5]], hi: ["website"] },
    { start: 29.85, end: 30.72, words: [["banana", 29.85], ["seekhna", 30.15], ["hai,", 30.5]], hi: ["seekhna"] },
    { start: 30.9, end: 31.92, words: [["to", 30.9], ["comment", 31.2], ["karo", 31.62]], hi: ["comment"] },
    { start: 32.13, end: 32.74, words: [["Part", 32.13], ["3", 32.48]], hi: ["Part", "3"] },
    { start: 32.87, end: 33.79, words: [["aur", 32.87], ["follow", 33.0], ["kar", 33.4], ["lo,", 33.62]], hi: ["follow"] },
    { start: 34.03, end: 34.52, words: [["Part", 34.03], ["3", 34.2], ["mein", 34.42]], hi: ["Part", "3"] },
    { start: 34.57, end: 35.41, words: [["bana", 34.57], ["kar", 34.75], ["dikhaunga!", 34.95]] },
  ] as Cap[],

  // aim: pointing direction in degrees (-90 = straight up). look: eye direction.
  avatarKeys: [
    { at: 0.0, pose: "point", aim: -78, expr: "talk", look: [0, -1] },
    { at: 1.4, pose: "point", aim: -70, expr: "talk", look: [0.2, -1] },
    { at: 2.79, pose: "explain", expr: "happy", look: [0, 0] },
    { at: 3.2, pose: "rest", expr: "happy", look: [0, 0], jump: true, tilt: 6 },
    { at: 4.38, pose: "think", expr: "thinking", look: [-0.6, -0.9] },
    { at: 5.8, pose: "explain", expr: "surprised", look: [0.5, -0.8] },
    { at: 6.2, pose: "surprised", expr: "surprised", look: [0, 0] },
    { at: 7.03, pose: "oneMore", expr: "excited", look: [0, 0], jump: true },
    { at: 8.4, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: 9.13, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: 10.32, pose: "point", aim: -60, expr: "excited", look: [0.6, -0.8] },
    { at: 11.78, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: 13.31, pose: "explain", expr: "talk", look: [0.4, -0.7] },
    { at: 14.64, pose: "point", aim: -55, expr: "excited", look: [0.6, -0.8] },
    { at: 16.03, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: 17.77, pose: "explain", expr: "talk", look: [0.5, -0.7] },
    { at: 18.62, pose: "point", aim: -40, expr: "talk", look: [0.7, -0.6] },
    { at: 20.27, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: 21.06, pose: "oneMore", expr: "excited", look: [0, 0], jump: true },
    { at: 22.1, pose: "explain", expr: "talk", look: [0, 0] },
    { at: 22.3, pose: "point", aim: -60, expr: "talk", look: [0.6, -0.8] },
    { at: 23.39, pose: "explain", expr: "talk", look: [0.5, -0.7] },
    { at: 24.87, pose: "point", aim: -55, expr: "excited", look: [0.6, -0.8] },
    { at: 25.78, pose: "thumbs", expr: "happy", look: [0, 0], jump: true },
    { at: 26.77, pose: "point", aim: -60, expr: "talk", look: [0.6, -0.8] },
    { at: 28.04, pose: "point", aim: -85, expr: "talk", look: [0.3, -1] },
    { at: 29.08, pose: "explain", expr: "talk", look: [0.4, -0.7] },
    { at: 30.9, pose: "point", aim: -40, expr: "talk", look: [0.7, -0.6] },
    { at: 32.13, pose: "oneMore", expr: "excited", look: [0, 0], jump: true },
    { at: 32.87, pose: "point", aim: -30, expr: "talk", look: [0.7, -0.5] },
    { at: 34.03, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: 34.9, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  // Big and centred for the hook and the twist, bottom-left while showing things (the series' standard spots).
  avatarPlaces: [
    { at: 0.0, ...LAYOUT.avatar.hero },
    { at: 4.35, ...LAYOUT.avatar.corner },
    { at: 21.0, ...LAYOUT.avatar.twist },
    { at: 22.05, ...LAYOUT.avatar.corner },
  ] as AvatarPlace[],
  blinks: [1.9, 4.2, 6.75, 9.0, 11.6, 13.1, 15.8, 17.5, 20.8, 23.0, 26.5, 28.85, 31.0, 33.9],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "whoosh", 0.4],
    [0.3, "pop", 0.35],
    [2.79, "pop", 0.32],
    [4.35, "whoosh", 0.35],
    [5.5, "swish", 0.3],
    [5.8, "impact", 0.45],
    [6.27, "pop", 0.35],
    [7.03, "sparkle", 0.5],
    [7.03, "whoosh", 0.3],
    [7.1, "pop", 0.22],
    [7.2, "pop", 0.22],
    [7.3, "pop", 0.22],
    [9.13, "swish", 0.35],
    [9.62, "whoosh", 0.45],
    [10.32, "impact", 0.4],
    [10.62, "pop", 0.32],
    [11.78, "pop", 0.38],
    [13.64, "pop", 0.35],
    [14.6, "swish", 0.3],
    [16.03, "swish", 0.3],
    [16.6, "click", 0.55],
    [16.8, "whoosh", 0.3],
    [17.77, "click", 0.5],
    [17.85, "typing", 0.4],
    [18.85, "click", 0.55],
    [19.65, "pop", 0.3],
    [20.27, "coin", 0.42],
    [20.29, "ding", 0.36],
    [20.75, "whoosh", 0.4],
    [21.66, "pop", 0.38],
    [22.1, "pop", 0.3],
    [22.3, "swish", 0.32],
    [22.4, "typing", 0.38],
    [22.85, "typing", 0.32],
    [23.33, "impact", 0.38],
    [23.35, "click", 0.5],
    [23.6, "whoosh", 0.35],
    [24.25, "swish", 0.25],
    [24.87, "pop", 0.35],
    [24.95, "whoosh", 0.35],
    [25.5, "click", 0.55],
    [25.55, "ding", 0.36],
    [25.8, "pop", 0.35],
    [26.6, "whoosh", 0.4],
    [26.97, "pop", 0.38],
    [28.04, "pop", 0.36],
    [28.85, "swish", 0.3],
    [29.3, "pop", 0.3],
    [29.9, "pop", 0.28],
    [31.2, "pop", 0.36],
    [32.13, "typing", 0.38],
    [32.75, "click", 0.55],
    [32.95, "pop", 0.3],
    [33.45, "click", 0.55],
    [33.47, "ding", 0.38],
    [34.03, "impact", 0.45],
  ] as [number, string, number][],
};
