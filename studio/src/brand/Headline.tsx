import React from "react";
import { palette as P, type } from "./tokens";
import { Sticker } from "./Bits";
import { range, usePop } from "../components/motion";

/**
 * Headline tones: plain ink or olive words (like the website's headings), a lime tag ("lime"),
 * an ink tag with lime text ("inkTag"), or ink words on a lime highlighter stroke ("marker").
 */
export type HeadTone = "ink" | "olive" | "lime" | "inkTag" | "marker";

const Words: React.FC<{ text: string; size: number; tone: HeadTone; pop: number; rotate?: number }> = ({ text, size, tone, pop, rotate = -3 }) => {
  if (tone === "lime" || tone === "inkTag") {
    return (
      <Sticker size={size * 0.86} tone={tone === "lime" ? "lime" : "ink"} rotate={rotate * Math.min(1, pop)} style={{ margin: `${size * 0.06}px 0` }}>
        {text}
      </Sticker>
    );
  }
  const color = tone === "olive" ? P.olive : P.ink;
  return (
    <span style={{ position: "relative", display: "inline-block", ...type.display, fontSize: size, color, whiteSpace: "nowrap" }}>
      {tone === "marker" && (
        <span
          style={{
            position: "absolute",
            left: "-0.08em",
            right: "-0.08em",
            top: "0.2em",
            bottom: "0.04em",
            background: P.lime,
            borderRadius: "0.12em",
            transform: `scaleX(${Math.min(1, pop)}) skewX(-6deg)`,
            transformOrigin: "0 50%",
          }}
        />
      )}
      <span style={{ position: "relative" }}>{text}</span>
    </span>
  );
};

/** The hook title: every line slams in together, with a shake. */
export const HeroTitle: React.FC<{ t: number; at: number; top: number; lines: { text: string; size: number; tone?: HeadTone }[] }> = ({ t, at, top, lines }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 210, mass: 0.7 });
  const scale = 2.1 - 1.1 * Math.min(p, 1.08);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        transform: `scale(${scale}) rotate(${(1 - Math.min(p, 1)) * -4}deg)`,
        opacity: Math.min(1, p * 2),
        filter: `blur(${Math.max(0, 1 - p) * 10}px)`,
      }}
    >
      {lines.map((l, i) => (
        <Words key={i} text={l.text} size={l.size} tone={l.tone ?? "ink"} pop={p} />
      ))}
    </div>
  );
};

export type Seg = { text: string; at: number; tone?: HeadTone };
export type HeadLine = { segs: Seg[]; size: number };

/** A headline whose parts land at their own times (in sync with the voice), then leave together. */
export const Headline: React.FC<{ t: number; lines: HeadLine[]; top: number; inAt: number; outAt: number; pulse?: { text: string; at: number } }> = ({
  t,
  lines,
  top,
  inAt,
  outAt,
  pulse,
}) => {
  const out = range(t, outAt, outAt + 0.22);
  if (t < inAt - 0.05 || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: 1 - out,
        transform: `translateY(${-out * 40}px) scale(${1 - 0.1 * out})`,
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", alignItems: "center", columnGap: Math.round(l.size * 0.26) }}>
          {l.segs.map((s, j) => (
            <SegPop key={j} t={t} seg={s} size={l.size} pulseAt={pulse && pulse.text === s.text ? pulse.at : undefined} />
          ))}
        </div>
      ))}
    </div>
  );
};

const SegPop: React.FC<{ t: number; seg: Seg; size: number; pulseAt?: number }> = ({ t, seg, size, pulseAt }) => {
  const p = usePop(t, seg.at, { damping: 10, stiffness: 210, mass: 0.7 });
  const bump = pulseAt !== undefined && t >= pulseAt ? Math.sin(Math.min(1, (t - pulseAt) / 0.32) * Math.PI) * 0.12 : 0;
  return (
    <span
      style={{
        display: "inline-block",
        // Parts that have not been said yet keep their space, so nothing jumps.
        opacity: Math.min(1, p * 2),
        transform: `scale(${(1.6 - 0.6 * Math.min(p, 1.06)) * (1 + bump)})`,
        filter: `blur(${Math.max(0, 1 - p) * 8}px)`,
      }}
    >
      <Words text={seg.text} size={size} tone={seg.tone ?? "ink"} pop={p} rotate={-2} />
    </span>
  );
};
