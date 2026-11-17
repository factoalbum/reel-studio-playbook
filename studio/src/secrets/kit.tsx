import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { Avatar, mono, palette as P, shadow, Sticker, type } from "../brand";
import type { PoseName, Expr } from "../brand/Avatar";
import { clamp01, range, usePop } from "../components/motion";

/** Where the screen sits in every step: upper part of the frame, above the subtitles and the presenter. */
export const STAGE = { x: 80, y: 506, w: 870, h: 624 };

/** Enters at `at`, leaves at `out`: returns the pair of progress values every scene needs. */
export const useSpan = (t: number, at: number, out: number, opts?: { damping?: number; stiffness?: number; mass?: number }) => {
  const p = usePop(t, at, { damping: 15, stiffness: 150, mass: 0.75, ...opts });
  const o = range(t, out - 0.2, out);
  return { p, o, on: t >= at && t < out };
};

/**
 * The big "STEP 01/06" badge and the six progress dots. Done dots are solid, the current one is lime and large,
 * the ones to come are outlines. The badge bumps when the step number is spoken.
 */
export const StepBadge: React.FC<{ t: number; n: number; at: number; out: number; dark?: boolean }> = ({ t, n, at, out, dark = false }) => {
  const { p, o, on } = useSpan(t, at, out, { damping: 9, stiffness: 230, mass: 0.6 });
  if (!on) return null;
  const line = dark ? P.lime : P.ink;
  return (
    <div style={{ position: "absolute", left: 634, top: 326, width: 316, opacity: 1 - o, transform: `translateY(${o * -24}px)` }}>
      <div
        style={{
          transform: `scale(${p}) rotate(${-3 * Math.min(1, p)}deg)`,
          transformOrigin: "50% 60%",
          background: P.lime,
          border: `6px solid ${P.ink}`,
          borderRadius: 24,
          boxShadow: dark ? `10px 10px 0 ${P.card}` : shadow.hard(10),
          padding: "8px 18px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <span style={{ ...type.label, fontSize: 32, color: P.ink, letterSpacing: "0.04em" }}>Step</span>
        <span style={{ ...type.display, fontSize: 86, color: P.ink, lineHeight: 1 }}>
          0{n}
          <span style={{ fontSize: 44, color: P.olive }}>/06</span>
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 13, marginTop: 20 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => {
          const cur = i === n;
          const done = i < n;
          const size = cur ? 30 : 20;
          return (
            <div
              key={i}
              style={{ width: size, height: size, borderRadius: 99, boxSizing: "border-box", border: `4px solid ${line}`, background: cur ? P.lime : done ? line : "transparent", transform: cur ? `scale(${0.7 + 0.3 * Math.min(1, p)})` : "none" }}
            />
          );
        })}
      </div>
    </div>
  );
};

/** Step title, top left: two lines, the second in olive (lime on the dark stage). */
export const StepTitle: React.FC<{ t: number; at: number; out: number; lines: [string, string]; dark?: boolean; size?: number }> = ({ t, at, out, lines, dark = false, size = 70 }) => {
  const { p, o, on } = useSpan(t, at, out);
  if (!on) return null;
  const tx = (i: number) => (1 - clamp01(p * 1.2 - i * 0.2)) * -70;
  return (
    <div style={{ position: "absolute", left: 80, top: 336, width: 550, opacity: Math.min(1, p * 1.6) * (1 - o) }}>
      <div style={{ ...type.display, fontSize: size, color: dark ? P.card : P.ink, transform: `translateX(${tx(0)}px)`, whiteSpace: "nowrap" }}>{lines[0]}</div>
      <div style={{ ...type.display, fontSize: size, color: dark ? P.lime : P.olive, transform: `translateX(${tx(1)}px)`, marginTop: 6, whiteSpace: "nowrap" }}>{lines[1]}</div>
    </div>
  );
};

/** The key phrase of a step, beside the presenter, in the bubble's place. */
export const Highlight: React.FC<{ t: number; at: number; out: number; lines: string[]; size?: number; tone?: "lime" | "ink"; x?: number; y?: number }> = ({ t, at, out, lines, size = 62, tone = "lime", x = 712, y = 1440 }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 220, mass: 0.6 });
  const o = range(t, out - 0.18, out);
  if (t < at || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p * (1 - 0.2 * o)})`, opacity: 1 - o }}>
      <Sticker size={size} tone={tone} rotate={-2.5}>
        <span style={{ display: "inline-block", textAlign: "center" }}>
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </span>
      </Sticker>
    </div>
  );
};

/** Dark-mode-safe frame around a real screen. `label` says what it is, so nothing passes for a mock-up. */
export const ScreenFrame: React.FC<{ w: number; h: number; label?: string; dark?: boolean; style?: React.CSSProperties; children: React.ReactNode; bg?: string }> = ({ w, h, label, dark = false, style, children, bg = P.ink }) => (
  <div style={{ position: "absolute", width: w, height: h, boxSizing: "border-box", borderRadius: 26, border: `5px solid ${dark ? P.card : P.ink}`, background: bg, boxShadow: shadow.soft, ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden" }}>{children}</div>
    {label && (
      <div style={{ position: "absolute", right: 14, top: -22, ...type.label, fontSize: 22, letterSpacing: "0.08em", color: P.lime, background: P.ink, border: `3px solid ${dark ? P.lime : P.ink}`, borderRadius: 999, padding: "5px 16px", whiteSpace: "nowrap" }}>{label}</div>
    )}
  </div>
);

/** A real screen picture with a keyframed camera: `cam` is [t, x, y, scale], x/y = picture point at the frame's top left. */
export const ScreenShot: React.FC<{ t: number; src: string; picW: number; cam: [number, number, number, number][]; children?: React.ReactNode }> = ({ t, src, picW, cam, children }) => {
  let a = cam[0];
  let b = cam[cam.length - 1];
  for (let i = 0; i + 1 < cam.length; i++) {
    if (t >= cam[i][0] && t <= cam[i + 1][0]) {
      a = cam[i];
      b = cam[i + 1];
    }
  }
  const k = a === b ? 1 : range(t, a[0], b[0]);
  const x = a[1] + (b[1] - a[1]) * k;
  const y = a[2] + (b[2] - a[2]) * k;
  const s = a[3] + (b[3] - a[3]) * k;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: picW, transformOrigin: "0 0", transform: `scale(${s}) translate(${-x}px, ${-y}px)` }}>
      <Img src={staticFile(src)} style={{ display: "block", width: picW }} />
      {children}
    </div>
  );
};

export type Shot = { src: string; from: number };
export const SHOTS = {
  room: { src: "g-room", from: 0.3 },
  roomLate: { src: "g-room", from: 3.4 },
  sold: { src: "g-sold", from: 0.5 },
  clock: { src: "g-clock", from: 0.6 },
  cancel: { src: "g-clock", from: 3.9 },
  reward: { src: "g-reward", from: 1.1 },
  double: { src: "g-reward", from: 6.6 },
  sales: { src: "m-sales", from: 3.6 },
  coins: { src: "m-sales", from: 1.0 },
  alex: { src: "m-room", from: 1.2 },
  bulb: { src: "m-room", from: 6.6 },
  tiles: { src: "m-grid", from: 2.6 },
  pixels: { src: "m-grid", from: 8.8 },
  homepage: { src: "m-grid", from: 14.4 },
} satisfies Record<string, Shot>;

/** Top of the 1080 x 1920 source frame kept in a card: this skips the source reel's own logo row and its subtitles. */
const CROP_TOP = 322;
const CROP_H = 838;

/**
 * Real footage from our finished reels, muted. `cuts` is a list of [start time, shot]. Each shot plays from its own
 * point in the source clip. `w` and `h` set the card; the camera drifts in a little on every shot.
 */
export const Footage: React.FC<{ t: number; w: number; h: number; cuts: [number, Shot][]; end: number; push?: number; full?: boolean }> = ({ t, w, h, cuts, end, push = 0.07, full = false }) => {
  const { fps } = useVideoConfig();
  const base = full ? Math.max(w / 1080, h / 1920) : Math.max(w / 1080, h / CROP_H);
  return (
    <>
      {cuts.map(([at, s], i) => {
        const to = i + 1 < cuts.length ? cuts[i + 1][0] : end;
        if (t < at - 0.04 || t >= to) return null;
        const z = 1 + push * clamp01((t - at) / (to - at));
        const vw = 1080 * base;
        return (
          <Sequence key={`${at}-${s.src}`} from={Math.round(at * fps)} durationInFrames={Math.max(1, Math.round((to - at) * fps))} layout="none">
            <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 45%" }}>
              <OffthreadVideo
                src={staticFile(`secrets/clips/${s.src}.mp4`)}
                startFrom={Math.round(s.from * fps)}
                muted
                style={{ position: "absolute", left: (w - vw) / 2, top: full ? 0 : -CROP_TOP * base - (CROP_H * base - h) / 2, width: vw, height: 1920 * base }}
              />
            </div>
          </Sequence>
        );
      })}
    </>
  );
};

/** Bars of a real voice file: one bar per slice of its loudness data. Played bars are ink or lime, the rest wait grey. */
export const Wave: React.FC<{ env: number[]; bars: number; w: number; h: number; k: number; from?: number; to?: number; played?: string; idle?: string }> = ({ env, bars, w, h, k, from = 0, to = env.length, played = P.ink, idle = P.lineStrong }) => {
  const step = (to - from) / bars;
  const gap = 4;
  const bw = (w - gap * (bars - 1)) / bars;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {Array.from({ length: bars }).map((_, i) => {
        let v = 0;
        for (let f = Math.floor(from + i * step); f < from + (i + 1) * step; f++) v = Math.max(v, env[f] ?? 0);
        const bh = Math.max(6, v * h);
        const on = i / bars <= k;
        return <div key={i} style={{ position: "absolute", left: i * (bw + gap), top: (h - bh) / 2, width: bw, height: bh, borderRadius: bw, background: on ? played : idle }} />;
      })}
      <div style={{ position: "absolute", left: k * w - 3, top: -12, width: 6, height: h + 24, borderRadius: 6, background: P.ink, opacity: k > 0 && k < 1 ? 1 : 0 }} />
    </div>
  );
};

/** Lime outline around a part of a real screen, with a small tag. Draws itself in. */
export const Outline: React.FC<{ t: number; at: number; out: number; x: number; y: number; w: number; h: number; tag?: string; color?: string; line?: number; tagSize?: number; tagLeft?: boolean }> = ({ t, at, out, x, y, w, h, tag, color = P.lime, line = 6, tagSize = 24, tagLeft = false }) => {
  const p = usePop(t, at, { damping: 12, stiffness: 200, mass: 0.6 });
  const o = range(t, out - 0.15, out);
  if (t < at || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box", border: `${line}px solid ${color}`, borderRadius: 16, boxShadow: `0 0 0 2px ${P.ink}`, opacity: Math.min(1, p * 1.5) * (1 - o), transform: `scale(${1.06 - 0.06 * Math.min(1, p)})` }}>
      {tag && <div style={{ position: "absolute", ...(tagLeft ? { left: 10 } : { right: 10 }), bottom: -tagSize, ...type.label, fontSize: tagSize, letterSpacing: "0.06em", color: P.ink, background: color, border: `2px solid ${P.ink}`, borderRadius: 8, padding: "2px 10px", whiteSpace: "nowrap" }}>{tag}</div>}
    </div>
  );
};

/** The same approved presenter, small, for the "one character, every reel" strip. */
export const MiniAvatar: React.FC<{ x: number; y: number; s: number; pose: PoseName; expr: Expr; aim?: number }> = ({ x, y, s, pose, expr, aim }) => (
  <Avatar keys={[{ at: 0, pose, expr, aim }]} places={[{ at: -5, x, y, s }]} env={[]} blinks={[]} halo={false} />
);

/** Small mono file chip: "voice.wav". */
export const FileChip: React.FC<{ text: string; style?: React.CSSProperties; dark?: boolean }> = ({ text, style, dark }) => (
  <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 28, color: dark ? P.lime : P.ink, background: dark ? P.ink : P.card, border: `3px solid ${dark ? P.lime : P.ink}`, borderRadius: 12, padding: "4px 14px", whiteSpace: "nowrap", ...style }}>{text}</div>
);
