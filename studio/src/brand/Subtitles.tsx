import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAYOUT, palette as P, SAFE, shadow, type } from "./tokens";
import { usePop } from "../components/motion";

export type Word = [string, number];
/** A caption chunk: each word carries the time it is spoken (from the transcript). `hi` words get the lime marker. */
export type Cap = { start: number; end: number; words: Word[]; hi?: string[] };

/**
 * Series subtitles: one white card per phrase. Upcoming words wait in light grey, each word turns ink
 * when it is spoken, and key words get a lime highlighter. Sized to fit one line inside the safe zone.
 */
export const Subtitles: React.FC<{ captions: Cap[]; top?: number }> = ({ captions, top = LAYOUT.captionTop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const started = captions.filter((c) => c.start - 0.06 <= t);
  const chunk = started[started.length - 1];
  if (!chunk || t > chunk.end + 0.18) return null;
  const out = Math.max(0, Math.min(1, 1 - (t - chunk.end) / 0.18));
  const p = spring({ frame: Math.max(0, Math.round((t - chunk.start + 0.06) * fps)), fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
  const width = SAFE.right - SAFE.left;
  const chars = chunk.words.map((w) => w[0]).join(" ").length;
  const size = Math.round(Math.min(78, (width - 90) / (chars * 0.55)));
  return (
    <div style={{ position: "absolute", left: SAFE.left, width, top, display: "flex", justifyContent: "center", opacity: out }}>
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          columnGap: Math.round(size * 0.24),
          background: P.card,
          border: `4px solid ${P.ink}`,
          borderRadius: 22,
          boxShadow: shadow.hard(7),
          padding: `${Math.round(size * 0.14)}px ${Math.round(size * 0.36)}px ${Math.round(size * 0.2)}px`,
          transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})`,
        }}
      >
        {chunk.words.map(([w, at], i) => (
          <SubWord key={`${chunk.start}-${i}`} word={w} at={at} t={t} hi={(chunk.hi ?? []).includes(w)} size={size} />
        ))}
      </div>
    </div>
  );
};

const SubWord: React.FC<{ word: string; at: number; t: number; hi: boolean; size: number }> = ({ word, at, t, hi, size }) => {
  // Words land a hair before they are heard, which reads as in sync.
  const p = usePop(t, at - 0.05, { damping: 11, stiffness: 200, mass: 0.6 });
  const said = p > 0;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI)})` }}>
      {hi && said && (
        <span
          style={{
            position: "absolute",
            left: "-0.1em",
            right: "-0.1em",
            top: "0.16em",
            bottom: "0.02em",
            background: P.lime,
            borderRadius: "0.14em",
            transform: `scaleX(${Math.min(1, p)}) skewX(-6deg)`,
            transformOrigin: "0 50%",
          }}
        />
      )}
      <span style={{ position: "relative", ...type.display, letterSpacing: "-0.02em", fontSize: size, color: said ? P.ink : P.lineStrong }}>{word}</span>
    </span>
  );
};
