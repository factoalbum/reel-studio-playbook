import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily, SAFE } from "../theme";
import { usePop } from "./motion";

export type Word = [string, number];
/** A caption chunk: each word carries the time it is spoken (from the transcript). */
export type Cap = { start: number; end: number; words: Word[]; hi?: string[] };

/** Word-timed captions: every word pops in when it is spoken; the chunk is sized to fit on one line. */
export const WordCaptions: React.FC<{ captions: Cap[]; top: number }> = ({ captions, top }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const started = captions.filter((c) => c.start - 0.06 <= t);
  const chunk = started[started.length - 1];
  if (!chunk || t > chunk.end + 0.18) return null;
  const out = Math.max(0, Math.min(1, 1 - (t - chunk.end) / 0.18));
  const width = SAFE.right - SAFE.left;
  const chars = chunk.words.map((w) => w[0]).join(" ").length;
  const size = Math.round(Math.min(92, (width - 30) / (chars * 0.62)));
  return (
    <div style={{ position: "absolute", left: SAFE.left, width, top, display: "flex", justifyContent: "center", opacity: out }}>
      <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "center", columnGap: Math.round(size * 0.26) }}>
        {chunk.words.map(([w, at], i) => (
          <WordPop key={`${chunk.start}-${i}`} word={w} at={at} t={t} hi={(chunk.hi ?? []).includes(w)} size={size} />
        ))}
      </div>
    </div>
  );
};

const WordPop: React.FC<{ word: string; at: number; t: number; hi: boolean; size: number }> = ({ word, at, t, hi, size }) => {
  // Words land a hair before they are heard, which reads as in sync.
  const p = usePop(t, at - 0.05, { damping: 11, stiffness: 190, mass: 0.6 });
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -1,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: hi ? colors.yellow : colors.white,
        transform: `scale(${0.55 + 0.45 * p}) translateY(${(1 - p) * 26}px)`,
        opacity: Math.min(1, p * 1.6),
        filter: `blur(${Math.max(0, 1 - p) * 6}px)`,
        textShadow: `0 4px 0 ${colors.navy}, 0 0 28px ${hi ? colors.yellow + "55" : colors.cyan + "33"}`,
        WebkitTextStroke: `10px ${colors.navy}`,
        paintOrder: "stroke fill",
      }}
    >
      {word}
    </span>
  );
};
