import React from "react";
import { Img, staticFile } from "remotion";
import { palette as P } from "./tokens";
import type { Rect, Shot } from "./ProofPanel";
import { ClickRing, LabelPill, Pointer, Sticker } from "./Bits";
import { range, usePop } from "../components/motion";

/** Ink frame with a lime wash around part of a real screenshot (page coordinates). Sizes divide by the zoom to look constant. */
export const Highlight: React.FC<{ t: number; r: Rect; at: number; outAt: number; z: number; dashed?: boolean }> = ({ t, r, at, outAt, z, dashed }) => {
  const p = usePop(t, at, { damping: 12, stiffness: 190, mass: 0.6 });
  const out = range(t, outAt, outAt + 0.2);
  if (p <= 0 || out >= 1) return null;
  const pad = 8 / z;
  return (
    <div
      style={{
        position: "absolute",
        left: r.x - pad,
        top: r.y - pad,
        width: r.w + pad * 2,
        height: r.h + pad * 2,
        borderRadius: 16 / z,
        border: `${6 / z}px ${dashed ? "dashed" : "solid"} ${P.ink}`,
        background: `${P.lime}38`,
        boxShadow: `0 0 0 ${4 / z}px ${P.lime}`,
        transform: `scale(${1.25 - 0.25 * Math.min(p, 1.05)})`,
        opacity: Math.min(1, p * 2) * (1 - out),
      }}
    />
  );
};

/** A stop on a pointer's path, in page coordinates. With `click`, the pointer presses there at `at`. */
export type CursorStop = { at: number; u: number; v: number; click?: boolean };

/**
 * Mouse pointer over real footage: glides in from `from` (frame pixels), then from stop to stop, clicking where asked.
 * `map` turns page coordinates into frame pixels with the current camera, so the pointer stays on its target while the camera moves.
 */
export const Cursor: React.FC<{ t: number; stops: CursorStop[]; map: (u: number, v: number) => [number, number]; from: [number, number]; showAt: number; hideAt: number }> = ({
  t,
  stops,
  map,
  from,
  showAt,
  hideAt,
}) => {
  if (t < showAt || t > hideAt + 0.2) return null;
  let pos: [number, number] = from;
  let prevAt = showAt;
  for (const s of stops) {
    const target = map(s.u, s.v);
    const start = Math.max(prevAt, s.at - 0.42);
    if (t < start) break;
    if (t < s.at) {
      const k = range(t, start, s.at);
      pos = [pos[0] + (target[0] - pos[0]) * k, pos[1] + (target[1] - pos[1]) * k - Math.sin(k * Math.PI) * 60];
      break;
    }
    pos = target;
    prevAt = s.at;
  }
  const click = [...stops].reverse().find((s) => s.click && t >= s.at && t < s.at + 0.3);
  const pressing = stops.some((s) => s.click && t >= s.at - 0.05 && t < s.at + 0.05);
  return (
    <div style={{ position: "absolute", left: pos[0], top: pos[1], opacity: 1 - range(t, hideAt, hideAt + 0.2) }}>
      {click && <ClickRing k={range(t, click.at, click.at + 0.25)} />}
      <Pointer press={pressing ? 0.82 : 1} />
    </div>
  );
};

/** "Real website"-style label pinned above a panel's top-right corner. */
export const RealPill: React.FC<{ t: number; at: number; text: string; right: number; top: number; outAt?: number }> = ({ t, at, text, right, top, outAt = 999 }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 190, mass: 0.6 });
  const out = range(t, outAt, outAt + 0.2);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", right: 1080 - right, top, transformOrigin: "100% 50%", opacity: 1 - out }}>
      <LabelPill text={text} t={t} size={26} pop={p} />
    </div>
  );
};

/** A sticker that pops at a frame position (centred on x) and leaves at outAt. */
export const PopSticker: React.FC<{ t: number; at: number; outAt?: number; x: number; y: number; size: number; tone?: "lime" | "ink" | "card" | "gold"; rotate?: number; children: React.ReactNode }> = ({
  t,
  at,
  outAt = 999,
  x,
  y,
  size,
  tone = "lime",
  rotate = -4,
  children,
}) => {
  const p = usePop(t, at, { damping: 9, stiffness: 210, mass: 0.6 });
  const out = range(t, outAt, outAt + 0.2);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x - 600, width: 1200, top: y, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out) }}>
      <Sticker size={size} tone={tone} rotate={rotate} pop={p}>
        {children}
      </Sticker>
    </div>
  );
};

/** A real screenshot from an earlier episode, as a tilted card with a label: "Last time...". */
export const RecapCard: React.FC<{ shot: Shot; crop: Rect; width: number; label: string; caption: string; t: number; pop: number; rotate?: number }> = ({
  shot,
  crop,
  width,
  label,
  caption,
  t,
  pop,
  rotate = -3,
}) => {
  const s = width / crop.w;
  return (
    <div style={{ position: "relative", width: width + 24, transform: `scale(${pop}) rotate(${rotate}deg)` }}>
      <div style={{ background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, padding: 12, boxShadow: `10px 10px 0 ${P.ink}` }}>
        <div style={{ position: "relative", width, height: crop.h * s, overflow: "hidden", borderRadius: 12 }}>
          <Img src={staticFile(shot.file)} style={{ position: "absolute", left: -crop.x * s, top: -crop.y * s, width: shot.width * s, height: shot.height * s }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: -18, top: -30 }}>
        <LabelPill text={label} t={t} size={26} />
      </div>
      <div style={{ position: "absolute", right: -24, bottom: -34 }}>
        <Sticker size={44} rotate={4}>
          {caption}
        </Sticker>
      </div>
    </div>
  );
};
