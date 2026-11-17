import React from "react";
import { colors, fontFamily } from "../theme";
import { range, usePop } from "../components/motion";

/** "Aur sabse crazy baat?" (9.2 to 10.8 s): light rays behind the guide and two reaction marks. */
export const CrazyScene: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 9.25, { damping: 14, stiffness: 120, mass: 0.8 });
  if (t < 9.2 || t > 10.85) return null;
  const out = range(t, 10.6, 10.8);
  const spin = (t - 9.2) * 14;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: (1 - out) * Math.min(1, p * 1.4) }}>
      <svg width={1600} height={1600} viewBox="-800 -800 1600 1600" style={{ position: "absolute", left: 540 - 800, top: 900 - 800, transform: `scale(${0.6 + 0.4 * p}) rotate(${spin}deg)` }}>
        <defs>
          <radialGradient id="crazy-glow">
            <stop offset="0" stopColor={colors.cyan} stopOpacity={0.45} />
            <stop offset="1" stopColor={colors.cyan} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: 16 }, (_, i) => {
          const a0 = (i / 16) * Math.PI * 2;
          const a1 = a0 + Math.PI / 30;
          return <path key={i} d={`M0 0 L${Math.cos(a0) * 800} ${Math.sin(a0) * 800} L${Math.cos(a1) * 800} ${Math.sin(a1) * 800} Z`} fill={i % 2 ? colors.yellow : colors.cyan} opacity={0.12} />;
        })}
        <circle r={520} fill="url(#crazy-glow)" />
      </svg>
      <Mark t={t} at={9.82} x={790} y={600} text="!?" color={colors.yellow} rot={12} />
      <Mark t={t} at={9.95} x={150} y={640} text="!!" color={colors.cyan} rot={-12} />
    </div>
  );
};

const Mark: React.FC<{ t: number; at: number; x: number; y: number; text: string; color: string; rot: number }> = ({ t, at, x, y, text, color, rot }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 220, mass: 0.6 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((t - at) * 6) * 8,
        fontFamily,
        fontWeight: 900,
        fontSize: 150,
        lineHeight: 1,
        color,
        transform: `scale(${p}) rotate(${rot}deg)`,
        opacity: Math.min(1, p * 2),
        textShadow: `0 6px 0 ${colors.navy}, 0 0 40px ${color}88`,
        WebkitTextStroke: `10px ${colors.navy}`,
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  );
};
