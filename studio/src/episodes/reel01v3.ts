import type { GuideKey, GuidePlace } from "../components/Guide";
import type { Cap } from "../components/WordCaptions";
import voiceEnv from "./reel01-voice-env.json";

/**
 * Reel 01 v3: "Ruler website se paisa?!" with the Internet Toolbox guide.
 * Words and timings come from a local whisper.cpp transcript of public/voice.wav (scripts/transcribe*.mjs),
 * checked against the pauses and loudness of the recording (scripts/voice-env.mjs). Times are seconds.
 */
export const reel01v3 = {
  voiceover: "voice.wav",
  voiceSeconds: 17.96,
  tailSeconds: 0.45,
  music: "music/bed.wav",
  // Real screenshot of https://www.piliapp.com/actual-size/cm-ruler/ (owner's own capture).
  screenshot: { file: "piliapp-ruler.png", width: 1879, height: 951 },
  // The part of the screenshot that is shown: drops the browser buttons and the profile icon.
  crop: { x: 145, y: 11, w: 1500, h: 940 },
  disclaimer: ["Illustration only. Results vary.", "No income promise."],
  env: voiceEnv as number[],

  captions: [
    { start: 0.28, end: 1.17, words: [["Bhai,", 0.28], ["ek", 0.72], ["ruler", 0.86], ["ki", 1.04]], hi: ["ruler"] },
    { start: 1.18, end: 2.7, words: [["website", 1.18], ["se", 1.76], ["bhi", 2.03], ["paisa?!", 2.3]], hi: ["paisa?!"] },
    { start: 3.24, end: 3.95, words: [["Ye", 3.24], ["dekho,", 3.36]], hi: ["dekho,"] },
    { start: 4.08, end: 5.6, words: [["bas", 4.08], ["ek", 4.4], ["online", 4.55], ["ruler.", 5.12]], hi: ["online", "ruler."] },
    { start: 6.36, end: 6.84, words: [["Socho,", 6.36]], hi: [] },
    { start: 6.86, end: 7.46, words: [["traffic", 6.86], ["aaye", 7.1], ["toh", 7.34]], hi: ["traffic"] },
    { start: 7.47, end: 8.1, words: [["ads", 7.47], ["se", 7.59], ["earning", 7.71]], hi: ["ads", "earning"] },
    { start: 8.12, end: 8.92, words: [["bhi", 8.12], ["ho", 8.3], ["sakti", 8.42], ["hai.", 8.72]], hi: ["sakti"] },
    { start: 9.37, end: 10.4, words: [["Aur", 9.37], ["sabse", 9.46], ["crazy", 9.82], ["baat?", 10.14]], hi: ["crazy"] },
    { start: 10.98, end: 11.88, words: [["Tum", 10.98], ["ise", 11.06], ["free", 11.4], ["mein", 11.74]], hi: ["free"] },
    { start: 11.9, end: 12.55, words: [["bana", 11.9], ["sakte", 12.1], ["ho!", 12.38]], hi: [] },
    { start: 13.28, end: 13.8, words: [["Kaise?", 13.28]], hi: ["Kaise?"] },
    { start: 14.43, end: 15.3, words: [["Comment", 14.43], ["LEARN", 14.77]], hi: ["LEARN"] },
    { start: 15.49, end: 16.1, words: [["aur", 15.49], ["follow", 15.63], ["karo.", 15.84]], hi: ["follow"] },
    { start: 16.22, end: 16.85, words: [["Part", 16.22], ["2", 16.47], ["mein", 16.73]], hi: ["Part", "2"] },
    { start: 16.86, end: 17.75, words: [["banake", 16.86], ["dikhaunga!", 17.1]], hi: [] },
  ] as Cap[],

  // The guide's poses. aim: pointing direction in degrees (-90 = straight up).
  guideKeys: [
    { at: 0.0, pose: "surprised", expr: "surprised", look: [0, 0] },
    { at: 2.02, pose: "surprised", expr: "excited", look: [0, 0], jump: true },
    { at: 2.8, pose: "rest", expr: "happy", look: [0.5, -0.9] },
    { at: 3.2, pose: "point", aim: -74, expr: "talk", look: [0.3, -1] },
    { at: 4.35, pose: "point", aim: -64, expr: "talk", look: [0.6, -0.9] },
    { at: 5.65, pose: "explain", expr: "happy", look: [0.4, -0.7] },
    { at: 6.3, pose: "explain", expr: "talk", look: [0.5, -0.8] },
    { at: 7.4, pose: "point", aim: -60, expr: "talk", look: [0.6, -0.7] },
    { at: 8.1, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: 9.22, pose: "oneMore", expr: "excited", look: [0, 0], jump: true },
    { at: 10.85, pose: "explain", expr: "talk", look: [0.4, -0.7] },
    { at: 11.85, pose: "thumbs", expr: "excited", look: [0, 0] },
    { at: 13.12, pose: "think", expr: "thinking", look: [-0.6, -0.9] },
    { at: 14.3, pose: "point", aim: -72, expr: "talk", look: [0.4, -1] },
    { at: 15.45, pose: "point", aim: -62, expr: "talk", look: [0.6, -0.8] },
    { at: 16.2, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: 17.05, pose: "wave", expr: "happy", look: [0, 0] },
  ] as GuideKey[],
  // Where the guide stands: big and centred for the hook and the twist, bottom-left while showing things.
  guidePlaces: [
    { at: 0.0, x: 540, y: 930, s: 1.25 },
    { at: 2.78, x: 250, y: 1455, s: 0.7 },
    { at: 9.2, x: 540, y: 950, s: 1.15 },
    { at: 10.75, x: 250, y: 1455, s: 0.7 },
  ] as GuidePlace[],
  blinks: [1.45, 4.3, 5.85, 8.62, 12.75, 14.12, 16.95],

  // [time, file in public/sfx, volume]
  sfx: [
    [0.0, "whoosh", 0.45],
    [0.13, "impact", 0.5],
    [0.86, "pop", 0.32],
    [2.3, "pop", 0.38],
    [2.78, "whoosh", 0.42],
    [3.0, "swish", 0.32],
    [3.5, "click", 0.55],
    [3.52, "pop", 0.42],
    [4.35, "swish", 0.4],
    [4.75, "pop", 0.36],
    [5.98, "swish", 0.36],
    [6.86, "whoosh", 0.26],
    [7.47, "pop", 0.34],
    [7.56, "pop", 0.3],
    [7.65, "pop", 0.3],
    [7.72, "coin", 0.42],
    [9.16, "whoosh", 0.42],
    [9.82, "pop", 0.38],
    [10.75, "whoosh", 0.38],
    [11.0, "typing", 0.4],
    [11.4, "ding", 0.36],
    [11.86, "swish", 0.36],
    [13.28, "pop", 0.45],
    [13.95, "whoosh", 0.42],
    [14.43, "pop", 0.38],
    [14.77, "typing", 0.42],
    [15.18, "click", 0.55],
    [15.49, "pop", 0.34],
    [15.66, "click", 0.55],
    [15.7, "ding", 0.38],
    [16.24, "impact", 0.45],
  ] as [number, string, number][],
};
