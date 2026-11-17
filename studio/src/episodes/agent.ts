import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "./mdh";
import voiceEnv from "./agent-voice-env.json";

/**
 * Creator Secrets: "Claude ne abhi-abhi Instagram ka game khatam kar diya!": the owner's Google AI Studio recording
 * (public/agent/voice.wav, 59.48 s, a byte-identical copy of "Generated Audio November 15, 2026 - 5_40PM.wav", never
 * edited). Phrase edges come from the pauses in the voice (silencedetect -40 dB); words were checked with whisper.cpp
 * (small, Hindi) on pieces cut at the pauses, and the CTA piece again in English ("Comment Agent"). Roman Hinglish.
 *
 * Fact check, 15 Nov 2026 (README of github.com/Jakeschincariol/instagram-agent-skill, MIT):
 * - 13 Claude Code skills. The reel names five of them: /ig-comment (drafts comments on other people's posts),
 *   /ig-reply (drafts replies under your own post), /ig-profile (scores the profile out of 100 on a 12-part rubric,
 *   then rewrites it), /ig-plan (the week: what, format, when, 10 accounts to engage with), /ig-viral (finds reels
 *   that beat their account's own median in your niche, names the hook formula, writes a swipe file).
 * - Install: "/plugin marketplace add Jakeschincariol/instagram-agent-skill" then "/plugin install instagram-agent",
 *   or copy skills/ig-* into ~/.claude/skills/. No signup, no API key, never logs in, never posts:
 *   "Nothing gets posted until you say yes." A community project, not by Anthropic or Instagram.
 * - Claude Code needs a paid Claude plan. Instagram DMs are restricted until 4 Dec 2026: no DM is shown or promised.
 * - "Game khatam" is hype: the reel never shows Instagram shutting down or Claude controlling an account.
 */

const captions: Cap[] = [
  ...card([0.16, 0.99, "*Claude ne abhi-abhi"]),
  ...card([1.24, 1.93, "*Instagram ka"], [2.02, 2.98, "*game *khatam"], [3.14, 4.07, "kar diya!"]),
  ...card([4.56, 4.73, "Ab"], [4.87, 6.29, "*Claude se apne *Instagram ka"]),
  ...card([6.54, 8.96, "poora *Content *Workflow manage karne mein"]),
  ...card([9.41, 10.36, "*madad le sakte ho!"]),
  ...card([10.69, 11.5, "Iska naam hai..."]),
  ...card([11.67, 12.54, "*Instagram *Agent *Skill!"]),
  ...card([13.01, 14.4, "Ismein aisi *Skills hain"]),
  ...card([14.49, 15.37, "jo tumhara *ghanton ka kaam"], [15.46, 17.13, "| *aasaan kar sakti hain!"]),
  ...card([17.53, 18.19, "Ek *Skill"], [18.33, 19.14, "tumhari *Niche ke"]),
  ...card([19.31, 19.95, "Posts ke liye"], [20.09, 21.04, "*Comments taiyaar karti hai!"]),
  ...card([21.45, 21.95, "*Doosri"], [22.26, 23.31, "tumhare *Comments ke *Replies"]),
  ...card([23.42, 24.11, "likhti hai!"]),
  ...card([24.58, 25.0, "*Teesri"], [25.29, 25.62, "tumhari"], [25.72, 27.59, "| *Instagram *Profile *Optimize karti hai!"]),
  ...card([28.02, 28.85, "Aur *chauthi..."]),
  ...card([29.24, 30.4, "poore *hafte ka"], [30.51, 31.52, "*Content *Plan!"]),
  ...card([31.97, 32.74, "Kya *post karna hai,"], [33.11, 33.78, "*kab karna hai,"]),
  ...card([33.96, 35.05, "aur kis *Audience ke liye!"]),
  ...card([35.49, 36.75, "Lekin sabse *crazy"], [36.9, 37.71, "*part abhi"], [37.95, 38.67, "baaki hai!"]),
  ...card([39.17, 40.63, "Iski *Virality *Skill!"]),
  ...card([41.1, 43.08, "Jo tumhari *Niche ke *Successful Content"]),
  ...card([43.17, 43.83, "ke *Patterns se,"]),
  ...card([43.94, 46.11, "naye *Viral-Style *Reel *Ideas deti hai!"]),
  ...card([46.41, 48.43, "Bas *Claude *Code mein *Skills Setup karo,"]),
  ...card([48.59, 50.15, "aur apna *Content *Workflow shuru karo!"]),
  ...card([50.75, 51.99, "*Posting aur *Final *Approval"], [52.1, 52.91, "| tumhare *haath mein rahega!"]),
  ...card([53.35, 54.13, "Poora *Setup chahiye?"]),
  ...card([54.55, 55.2, "*Comment karo"], [55.45, 55.89, "*AGENT!"]),
  ...card([56.29, 57.48, "Aur aisi *AI *Tricks ke liye"]),
  ...card([57.59, 58.16, "*Follow karo"], [58.3, 59.24, "| *Internet *Toolbox!"]),
];

/** Scene cues, in seconds of the voice. */
export const C = {
  // 1. Hook
  claude: 0.16,
  insta: 1.24,
  game: 2.02,
  khatam: 2.5,
  diya: 3.14,
  // 2. Workflow
  ab: 4.56,
  apne: 5.6,
  poora: 6.54,
  workflow: 7.3,
  manage: 8.1,
  madad: 9.41,
  // 3. Reveal
  naam: 10.69,
  name: 11.67,
  // 4. Organised
  ismein: 13.01,
  skills: 13.8,
  ghanton: 14.49,
  aasaan: 15.46,
  // 5. Comments
  ek: 17.53,
  niche: 18.33,
  posts: 19.31,
  comments: 20.09,
  // 6. Replies
  doosri: 21.45,
  replies: 22.26,
  likhti: 23.42,
  // 7. Profile
  teesri: 24.58,
  profile: 25.72,
  optimize: 26.5,
  // 8. Plan
  chauthi: 28.02,
  hafte: 29.24,
  plan: 30.51,
  kya: 31.97,
  kab: 33.11,
  kis: 33.96,
  // 9. Rehook
  lekin: 35.49,
  crazy: 36.2,
  part: 36.9,
  baaki: 37.95,
  // 10. Virality
  iski: 39.17,
  virality: 39.5,
  // 11. Patterns
  jo: 41.1,
  successful: 42.0,
  patterns: 43.17,
  naye: 43.94,
  ideas: 45.0,
  // 12. Setup
  bas: 46.41,
  setup: 47.5,
  aur: 48.59,
  shuru: 49.6,
  // 13. Control
  posting: 50.75,
  approval: 51.3,
  haath: 52.1,
  // 14. CTA
  setupQ: 53.35,
  comment: 54.55,
  agent: 55.45,
  // 15. Follow
  aisi: 56.29,
  tricks: 56.9,
  follow: 57.59,
  brand: 58.3,
  end: 59.48,
};

export const agent = {
  voiceover: "agent/voice.wav",
  voiceSeconds: 59.48,
  music: "agent/music.wav",
  env: voiceEnv as number[],
  captions,

  avatarKeys: [
    { at: -1, pose: "surprised", expr: "surprised", look: [0.2, -0.8], jump: true },
    { at: C.game, pose: "surprised", expr: "excited", look: [0, -0.7], jump: true },
    { at: C.ab, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.madad, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.naam, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.name, pose: "surprised", expr: "excited", look: [0.3, -0.8], jump: true },
    { at: C.ismein, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.aasaan, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.ek, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.comments, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.doosri, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.likhti, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.teesri, pose: "point", aim: -45, expr: "talk", look: [0.6, -0.7] },
    { at: C.optimize, pose: "explain", expr: "excited", look: [0.6, -0.6] },
    { at: C.chauthi, pose: "oneMore", expr: "happy", look: [0.4, -0.6], jump: true },
    { at: C.kya, pose: "point", aim: -40, expr: "talk", look: [0.6, -0.6] },
    { at: C.kis, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.lekin, pose: "think", expr: "thinking", look: [0, -0.4], tilt: 5 },
    { at: C.baaki, pose: "oneMore", expr: "excited", look: [0, -0.3], jump: true },
    { at: C.virality, pose: "surprised", expr: "excited", look: [0.2, -0.8], jump: true },
    { at: C.jo, pose: "explain", expr: "talk", look: [0.6, -0.6] },
    { at: C.naye, pose: "thumbs", expr: "excited", look: [0.5, -0.6] },
    { at: C.bas, pose: "point", aim: -50, expr: "talk", look: [0.6, -0.7] },
    { at: C.shuru, pose: "thumbs", expr: "happy", look: [0.5, -0.6] },
    { at: C.posting, pose: "explain", expr: "happy", look: [0.6, -0.6] },
    { at: C.haath, pose: "thumbs", expr: "happy", look: [0.3, -0.5] },
    { at: C.setupQ, pose: "think", expr: "thinking", look: [0.4, -0.7], tilt: 4 },
    { at: C.comment, pose: "point", aim: -60, expr: "excited", look: [0.4, -0.8], jump: true },
    { at: C.aisi, pose: "oneMore", expr: "happy", look: [0, -0.4] },
    { at: C.follow, pose: "wave", expr: "happy", look: [0, 0] },
  ] as AvatarKey[],
  avatarPlaces: [
    { at: -2, x: 540, y: 1450, s: 0.8 },
    { at: C.ab - 0.1, ...LAYOUT.avatar.corner },
    { at: C.naam - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.ismein - 0.1, ...LAYOUT.avatar.corner },
    { at: C.lekin - 0.1, x: 540, y: 1450, s: 0.78 },
    { at: C.jo - 0.1, ...LAYOUT.avatar.corner },
    { at: C.setupQ - 0.1, x: 540, y: 1460, s: 0.72 },
    { at: C.follow - 0.1, x: 540, y: 1520, s: 0.8 },
  ] as AvatarPlace[],
  blinks: [1.8, 4.4, 7.4, 10.5, 13.3, 16.2, 19.0, 22.0, 25.1, 28.4, 31.6, 34.6, 37.2, 40.8, 44.0, 47.0, 50.4, 53.0, 56.0, 58.6],

  // [time, file in public/sfx, volume]. All files are the series' own synthesised effects.
  sfx: [
    // Hook
    [0.0, "fx-boom", 0.55],
    [0.02, "fx-streak", 0.4],
    [C.insta - 0.06, "whoosh", 0.4],
    [C.insta, "fx-pop", 0.42],
    [C.game - 0.04, "fx-boom", 0.55],
    [C.game, "stamp", 0.5],
    [C.diya, "sparkle", 0.34],
    // Workflow
    [C.ab - 0.08, "whoosh", 0.4],
    [C.ab + 0.1, "fx-pop", 0.36],
    [C.apne, "fx-pop", 0.36],
    [C.poora, "fx-connect", 0.36],
    ...[0, 1, 2, 3, 4].map((i) => [C.workflow + i * 0.22, "pop", 0.26] as [number, string, number]),
    [C.madad, "ding", 0.32],
    // Reveal
    [C.naam - 0.08, "whoosh", 0.4],
    [C.naam + 0.1, "riser", 0.3],
    [C.name - 0.04, "fx-boom", 0.5],
    [C.name, "fx-reveal", 0.44],
    [C.name + 0.04, "sparkle", 0.34],
    // Organised
    [C.ismein - 0.08, "whoosh", 0.4],
    ...[0, 1, 2, 3, 4, 5].map((i) => [C.ismein + 0.1 + i * 0.16, "pop", 0.24] as [number, string, number]),
    [C.aasaan, "fx-connect", 0.4],
    [C.aasaan + 0.5, "ding", 0.32],
    // Comments
    [C.ek - 0.05, "fx-step1", 0.48],
    [C.niche, "swish", 0.32],
    [C.posts + 0.3, "typing", 0.3],
    [C.comments + 0.6, "stamp", 0.4],
    // Replies
    [C.doosri - 0.05, "fx-step2", 0.48],
    [C.replies + 0.2, "typing", 0.3],
    [C.likhti + 0.1, "ding", 0.34],
    // Profile
    [C.teesri - 0.05, "fx-step3", 0.48],
    [C.profile, "swish", 0.32],
    [C.optimize, "flip", 0.4],
    [C.optimize + 0.05, "sparkle", 0.32],
    // Plan
    [C.chauthi - 0.08, "whoosh", 0.4],
    [C.chauthi, "fx-pop", 0.4],
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => [C.hafte + 0.1 + i * 0.16, "pop", 0.24] as [number, string, number]),
    [C.plan, "stamp", 0.42],
    [C.kya, "click", 0.32],
    [C.kab, "click", 0.32],
    [C.kis, "click", 0.32],
    // Rehook
    [C.lekin - 0.1, "fx-boom", 0.45],
    [C.lekin, "whoosh", 0.38],
    [C.crazy, "riser", 0.4],
    [C.baaki, "stamp", 0.46],
    // Virality
    [C.iski - 0.04, "fx-boom", 0.55],
    [C.virality, "fx-reveal", 0.48],
    [C.virality + 0.05, "sparkle", 0.38],
    // Patterns
    [C.jo - 0.08, "whoosh", 0.38],
    ...[0, 1, 2, 3].map((i) => [C.successful + i * 0.3, "pop", 0.26] as [number, string, number]),
    [C.patterns, "fx-connect", 0.4],
    [C.naye, "fx-pop", 0.42],
    [C.ideas, "ding", 0.34],
    // Setup
    [C.bas - 0.08, "whoosh", 0.4],
    [C.bas + 0.2, "typing", 0.32],
    [C.setup, "typing", 0.3],
    [C.aur, "fx-connect", 0.34],
    [C.shuru, "ding", 0.36],
    // Control
    [C.posting - 0.05, "swish", 0.34],
    [C.approval + 0.6, "click", 0.4],
    [C.haath, "stamp", 0.42],
    [C.haath + 0.04, "ding", 0.32],
    // CTA
    [C.setupQ, "pop", 0.3],
    [C.comment - 0.05, "fx-boom", 0.45],
    [C.comment, "swish", 0.32],
    [C.agent, "fx-pop", 0.52],
    [C.agent + 0.02, "sparkle", 0.34],
    // Follow
    [C.aisi - 0.05, "whoosh", 0.35],
    [C.tricks, "pop", 0.28],
    [C.follow, "pop", 0.32],
    [C.brand, "fx-pop", 0.4],
    [C.brand + 0.03, "sparkle", 0.36],
  ] as [number, string, number][],
};
