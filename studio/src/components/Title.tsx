import React from "react";
import { colors, fontFamily } from "../theme";
import { usePop } from "./motion";

/** A big slam-in title. Lines can be coloured individually. */
export const Title: React.FC<{
  t: number;
  at: number;
  lines: { text: string; color?: string; size?: number }[];
  top: number;
  tilt?: number;
}> = ({ t, at, lines, top, tilt = -3 }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 210, mass: 0.7 });
  const scale = 2.1 - 1.1 * Math.min(p, 1.08);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top,
        textAlign: "center",
        transform: `scale(${scale}) rotate(${(1 - Math.min(p, 1)) * tilt}deg)`,
        opacity: Math.min(1, p * 2),
        filter: `blur(${Math.max(0, 1 - p) * 10}px)`,
      }}
    >
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: l.size ?? 130,
            lineHeight: 1.0,
            letterSpacing: -2,
            color: l.color ?? colors.white,
            textShadow: `0 8px 0 ${colors.navy}, 0 0 40px ${(l.color ?? colors.cyan) + "55"}`,
            WebkitTextStroke: `12px ${colors.navy}`,
            paintOrder: "stroke fill",
          }}
        >
          {l.text}
        </div>
      ))}
    </div>
  );
};
