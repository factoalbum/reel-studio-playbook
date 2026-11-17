import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { card } from "../episodes/mdh";

/**
 * "30 DAYS. ONE DIGITAL PRODUCT." Reel template: the data for one weekly episode.
 *
 * Each week only needs a new JSON file in src/episodes/thirty/ (copy the last one) plus the voice files in public/thirty/epNN/.
 * The scenes in src/thirty/Scenes.tsx never change. Avatar poses, blinks and sound effects are built from the cue
 * times here, so the weekly edit is: cue times, caption segments, the counters and the optional lesson.
 *
 * Honesty: counters are only ever numbers the owner has verified. Friend checkouts were tests and are never counted
 * as purchases. Nothing here invents revenue, customers, screenshots or reviews.
 */

export type CounterRow = { label: string; from: number; to: number };

export type ThirtyJson = {
  episode: number;
  day: number;
  totalDays: number;
  /** Empty until the owner's WAV is in public/thirty/epNN/. */
  voiceover: string;
  music: string;
  voiceSeconds: number;
  tailSeconds: number;
  keyword: string;
  dmLine: string;
  disclaimer: string[];
  rules: string[];
  counters: CounterRow[];
  note: string;
  /** Optional "lesson of the week" card; null skips the scene. */
  lesson: { title: string; text: string } | null;
  cues: {
    hook: number;
    days: number;
    product: number;
    dayBadge: number;
    experiment: number;
    rules: number[];
    kit: number;
    files: number;
    price: number;
    tracker: number;
    dayFill: number;
    counters: number[];
    note: number;
    lesson: number | null;
    sample: number;
    comment: number;
    keyword: number;
    dm: number;
    outro: number;
  };
  /** Caption cards: each card is a list of [start, end, "words with *highlight and | line break"]. */
  captions: [number, number, string][][];
  /** Optional hand-tuned overrides. Leave empty to use the defaults built from the cues. */
  avatarKeys?: AvatarKey[];
  sfx?: [number, string, number][];
};

export type ThirtyEpisode = ThirtyJson & {
  env: number[];
  caps: Cap[];
  keys: AvatarKey[];
  places: AvatarPlace[];
  blinks: number[];
  effects: [number, string, number][];
  label: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

function defaultKeys(c: ThirtyJson["cues"]): AvatarKey[] {
  const k: AvatarKey[] = [
    { at: 0, pose: "rest", expr: "surprised", look: [0, -0.4] },
    { at: c.days, pose: "surprised", expr: "surprised", look: [0.2, -0.7], jump: true },
    { at: c.product, pose: "surprised", expr: "excited", look: [0, -0.5] },
    { at: c.dayBadge, pose: "thumbs", expr: "happy", look: [0, 0] },
    { at: c.experiment, pose: "explain", expr: "talk", look: [0.4, -0.6] },
    ...c.rules.map((at, i) => ({ at, pose: "point" as const, aim: -40 - i * 6, expr: "talk" as const, look: [0.6, -0.6] as [number, number] })),
    { at: c.kit, pose: "oneMore", expr: "excited", look: [0.4, -0.6] },
    { at: c.files, pose: "surprised", expr: "excited", look: [0.5, -0.6], jump: true },
    { at: c.price, pose: "thumbs", expr: "happy", look: [0.3, -0.3] },
    { at: c.tracker, pose: "explain", expr: "talk", look: [0.5, -0.6] },
    ...c.counters.map((at) => ({ at, pose: "point" as const, aim: -35, expr: "talk" as const, look: [0.6, -0.5] as [number, number] })),
    { at: c.note, pose: "think", expr: "thinking", look: [0.5, -0.5], tilt: 4 },
  ];
  if (c.lesson !== null) k.push({ at: c.lesson, pose: "think", expr: "thinking", look: [0.5, -0.6], tilt: -4 });
  k.push(
    { at: c.sample, pose: "explain", expr: "happy", look: [0.5, -0.6] },
    { at: c.keyword, pose: "thumbs", expr: "excited", look: [0, 0], jump: true },
    { at: c.outro, pose: "wave", expr: "happy", look: [0, 0] },
  );
  return k.sort((a, b) => a.at - b.at);
}

function defaultSfx(j: ThirtyJson): [number, string, number][] {
  const c = j.cues;
  const s: [number, string, number][] = [
    [0, "riser", 0.2],
    [c.days, "impact", 0.55],
    [c.days + 0.05, "flip", 0.3],
    [c.product, "impact", 0.45],
    [c.product + 0.08, "sparkle", 0.4],
    [c.dayBadge, "stamp", 0.45],
    [c.experiment - 0.1, "whoosh", 0.4],
    ...c.rules.map((at) => [at, "pop", 0.3] as [number, string, number]),
    [c.kit - 0.12, "whoosh", 0.45],
    [c.kit + 0.05, "pop", 0.35],
    [c.files, "swish", 0.4],
    ...Array.from({ length: 8 }, (_, i) => [c.files + 0.1 + i * 0.09, "flip", 0.18] as [number, string, number]),
    [c.price, "coin", 0.4],
    [c.price + 0.05, "stamp", 0.4],
    [c.tracker - 0.12, "whoosh", 0.45],
    ...Array.from({ length: Math.min(j.day, 30) }, (_, i) => [c.dayFill + i * 0.05, "click", 0.14] as [number, string, number]),
    [c.dayFill + j.day * 0.05 + 0.1, "ding", 0.35],
    ...c.counters.map((at) => [at, "pop", 0.32] as [number, string, number]),
    [c.note, "snap", 0.3],
  ];
  if (c.lesson !== null) s.push([c.lesson - 0.1, "whoosh", 0.35], [c.lesson + 0.1, "sparkle", 0.35]);
  s.push(
    [c.sample - 0.12, "whoosh", 0.45],
    [c.sample + 0.1, "swish", 0.35],
    [c.sample + 0.25, "swish", 0.3],
    [c.comment, "pop", 0.3],
    [c.keyword - 0.05, "typing", 0.3],
    [c.keyword + 0.45, "impact", 0.45],
    [c.keyword + 0.5, "sparkle", 0.4],
    [c.dm, "pop", 0.3],
    [c.outro, "whoosh", 0.4],
    [c.outro + 0.9, "click", 0.45],
  );
  return s;
}

export function buildEpisode(j: ThirtyJson, env: number[] | null): ThirtyEpisode {
  const c = j.cues;
  const end = j.voiceSeconds + j.tailSeconds;
  const blinks: number[] = [];
  for (let b = 2.6; b < end - 0.5; b += 3.4 + ((blinks.length * 7) % 5) * 0.15) blinks.push(Math.round(b * 10) / 10);
  return {
    ...j,
    env: env ?? new Array(Math.ceil(end * 30)).fill(0),
    caps: j.captions.flatMap((segs) => card(...segs)),
    keys: j.avatarKeys?.length ? j.avatarKeys : defaultKeys(c),
    places: [
      { at: 0, x: 540, y: 1430, s: 0.82 },
      { at: c.experiment - 0.15, ...LAYOUT.avatar.corner },
      { at: c.outro, x: 540, y: 1520, s: 0.8 },
    ],
    blinks,
    effects: j.sfx?.length ? j.sfx : defaultSfx(j),
    label: `EP ${pad(j.episode)} · DAY ${pad(j.day)}`,
  };
}

export { pad };
