import React from "react";
import { colors, fontFamily } from "../theme";
import { range, usePop } from "../components/motion";
import { Title } from "../components/Title";

/** Hook (0 to 2.8 s): the title slams in over the surprised guide, then shrinks into the header for the website reveal. */
export const HookScene: React.FC<{ t: number }> = ({ t }) => {
  if (t > 6.75) return null;
  const shrink = range(t, 2.78, 3.12);
  const out = range(t, 6.45, 6.7);
  const shake = t > 0.14 && t < 0.6 ? Math.sin(t * 90) * 12 * (1 - (t - 0.14) / 0.46) : 0;
  const marksOut = range(t, 2.7, 2.9);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "540px 336px",
          transform: `translate(${shake}px, ${-out * 40}px) scale(${1 - 0.38 * shrink})`,
          opacity: 1 - out,
        }}
      >
        <Title t={t} at={0.12} top={340} tilt={-4} lines={[{ text: "RULER WEBSITE", size: 100 }, { text: "SE PAISA?!", size: 150, color: colors.yellow }]} />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - marksOut }}>
        <Mark t={t} at={0.55} x={170} y={690} text="?" color={colors.yellow} size={150} rot={-14} />
        <Mark t={t} at={0.8} x={850} y={660} text="!" color={colors.cyan} size={160} rot={12} />
        <Mark t={t} at={2.3} x={880} y={900} text="?" color={colors.yellow} size={110} rot={16} />
        <RulerIcon t={t} at={0.86} x={46} y={880} />
        <Coin t={t} at={2.3} x={70} y={1020} />
      </div>
    </>
  );
};

const Mark: React.FC<{ t: number; at: number; x: number; y: number; text: string; color: string; size: number; rot: number }> = ({ t, at, x, y, text, color, size, rot }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 220, mass: 0.6 });
  const bob = Math.sin((t - at) * 5) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        fontFamily,
        fontWeight: 900,
        fontSize: size,
        color,
        lineHeight: 1,
        transform: `scale(${p}) rotate(${rot + (1 - Math.min(p, 1)) * 40}deg)`,
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

const RulerIcon: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin((t - at) * 4) * 6, transform: `scale(${p}) rotate(-18deg)`, opacity: Math.min(1, p * 2) }}>
      <svg width={190} height={64} viewBox="0 0 190 64">
        <rect x={3} y={3} width={184} height={58} rx={12} fill={colors.yellow} stroke={colors.navy} strokeWidth={6} />
        {Array.from({ length: 17 }, (_, i) => (
          <line key={i} x1={14 + i * 10} x2={14 + i * 10} y1={6} y2={i % 5 === 0 ? 34 : 22} stroke={colors.navy} strokeWidth={i % 5 === 0 ? 4 : 2.5} strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
};

const Coin: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 200, mass: 0.6 });
  const spin = Math.cos((t - at) * 7);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - p * 30,
        width: 96,
        height: 96,
        borderRadius: 96,
        background: `radial-gradient(circle at 35% 30%, #FEF08A, ${colors.yellow} 55%, #CA8A04)`,
        border: `6px solid ${colors.navy}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 54,
        color: "#713F12",
        transform: `scale(${p}) scaleX(${0.35 + 0.65 * Math.abs(spin)})`,
        opacity: Math.min(1, p * 2),
        boxShadow: `0 0 40px ${colors.yellow}66`,
      }}
    >
      ₹
    </div>
  );
};
