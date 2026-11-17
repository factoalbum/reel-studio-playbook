// Everything that changes from episode to episode lives here: timings, captions and options.
// Times are in seconds from the start of the voiceover file.
export type Caption = { start: number; end: number; text: string; hi?: string[] };

export const reel01 = {
  voiceover: "voice.wav",
  voiceSeconds: 17.96,
  tailSeconds: 0.45,
  // Optional: a real browser screenshot placed in /public (for example "ruler-screenshot.png").
  screenshot: undefined as string | undefined,
  disclaimer: "Illustration only. Results vary. No income promise.",
  scenes: {
    ruler: [0, 5.95],
    traffic: [5.95, 10.66],
    build: [10.66, 14.0],
    cta: [14.0, 18.41],
  } as Record<string, [number, number]>,
  // Moments inside scenes (absolute seconds), taken from the pauses in the voiceover.
  events: {
    titleSlam: 2.1, // "ruler!"
    trafficTitle: 7.35, // "traffic"
    adAppears: 8.25, // "ads"
    coins: 9.45, // "income"
    codeStart: 10.98, // "Tum bhi free..."
    buildTitle: 11.55,
    freePill: 12.05,
    morph: 12.15,
    how: 13.25, // "Kaise?"
    commentBubble: 14.45, // "Comment LEARN"
    followTap: 15.7, // "follow"
    part2: 16.4, // "Part two"
  },
  captions: [
    { start: 0.28, end: 1.1, text: "Ye dekho…", hi: ["dekho…"] },
    { start: 1.1, end: 2.8, text: "screen par ek ruler!", hi: ["ruler!"] },
    { start: 3.22, end: 5.7, text: "Bas itna simple tool.", hi: ["simple"] },
    { start: 6.35, end: 8.25, text: "Aisi websites par traffic aaye,", hi: ["traffic"] },
    { start: 8.25, end: 9.3, text: "toh ads se…", hi: ["ads"] },
    { start: 9.37, end: 10.55, text: "income ho sakti hai.", hi: ["income"] },
    { start: 10.98, end: 11.5, text: "Tum bhi", hi: [] },
    { start: 11.5, end: 12.0, text: "free mein", hi: ["free"] },
    { start: 12.0, end: 12.65, text: "bana sakte ho!", hi: [] },
    { start: 13.23, end: 13.85, text: "Kaise?", hi: ["Kaise?"] },
    { start: 14.43, end: 15.3, text: "Comment LEARN", hi: ["LEARN"] },
    { start: 15.49, end: 16.15, text: "aur follow karo.", hi: ["follow"] },
    { start: 16.22, end: 17.9, text: "Part two mein banayenge!", hi: ["Part", "two"] },
  ] as Caption[],
};
