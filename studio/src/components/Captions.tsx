import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontFamily, SAFE } from "../theme";
import type { Caption } from "../episodes/reel01";
import { syllables, usePop } from "./motion";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Kinetic captions: words pop in one by one across the time the chunk is spoken. */
export const Captions: React.FC<{ captions: Caption[]; top?: number }> = ({ captions, top = 1275 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // The latest chunk that has started; it fades out only if no newer chunk replaced it.
  const started = captions.filter((c) => c.start - 0.05 <= t);
  const chunk = started[started.length - 1];
  if (!chunk || t > chunk.end + 0.2) return null;
  const words = chunk.text.split(" ");
  const total = words.reduce((s, w) => s + syllables(w), 0);
  const span = Math.max(0.25, (chunk.end - chunk.start) * 0.8);
  let acc = 0;
  const wordStarts = words.map((w) => {
    const s = chunk.start + (acc / total) * span;
    acc += syllables(w);
    return s;
  });
  const out = clamp(1 - (t - chunk.end) / 0.2, 0, 1);
  // Pop-in is anchored to the chunk start, so a fresh chunk never starts dimmed.
  const size = chunk.text.length <= 14 ? 92 : chunk.text.length <= 22 ? 76 : 66;
  return (
    <div style={{ position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top, display: "flex", justifyContent: "center", opacity: out }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 20, rowGap: 6, maxWidth: SAFE.right - SAFE.left }}>
        {words.map((w, i) => (
          <Word key={`${chunk.start}-${i}`} word={w} at={wordStarts[i]} t={t} hi={(chunk.hi ?? []).includes(w)} size={size} />
        ))}
      </div>
    </div>
  );
};

const Word: React.FC<{ word: string; at: number; t: number; hi: boolean; size: number }> = ({ word, at, t, hi, size }) => {
  const p = usePop(t, at - 0.02, { damping: 11, stiffness: 190, mass: 0.6 });
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: -1,
        textTransform: "uppercase",
        color: hi ? colors.yellow : colors.white,
        transform: `scale(${0.55 + 0.45 * p}) translateY(${(1 - p) * 26}px)`,
        opacity: Math.min(1, p * 1.6),
        filter: `blur(${(1 - p) * 6}px)`,
        textShadow: `0 4px 0 ${colors.navy}, 0 0 28px ${hi ? colors.yellow + "55" : colors.cyan + "33"}`,
        WebkitTextStroke: `10px ${colors.navy}`,
        paintOrder: "stroke fill",
      }}
    >
      {word}
    </span>
  );
};
