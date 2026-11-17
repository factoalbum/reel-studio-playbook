import React from "react";
import { colors, fontFamily } from "../theme";
import { range, usePop } from "./motion";

export type Seg = { text: string; at: number; color?: string };
export type HeaderLine = { segs: Seg[]; size: number };

/** A header whose parts slam in at their own times (in sync with the voice), then leave together. */
export const KineticHeader: React.FC<{ t: number; lines: HeaderLine[]; top: number; inAt: number; outAt: number; pulse?: { text: string; at: number } }> = ({
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
        <div key={i} style={{ display: "flex", justifyContent: "center", columnGap: Math.round(l.size * 0.24) }}>
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
  const bump = pulseAt !== undefined && t >= pulseAt ? Math.sin(Math.min(1, (t - pulseAt) / 0.32) * Math.PI) * 0.16 : 0;
  const color = seg.color ?? colors.white;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: -2,
        whiteSpace: "nowrap",
        color,
        // Parts that have not been said yet keep their space, so nothing jumps.
        opacity: Math.min(1, p * 2),
        transform: `scale(${(2 - Math.min(p, 1.06)) * (1 + bump)}) rotate(${(1 - Math.min(p, 1)) * -4}deg)`,
        filter: `blur(${Math.max(0, 1 - p) * 10}px)`,
        textShadow: `0 7px 0 ${colors.navy}, 0 0 36px ${color}55`,
        WebkitTextStroke: `12px ${colors.navy}`,
        paintOrder: "stroke fill",
      }}
    >
      {seg.text}
    </span>
  );
};
