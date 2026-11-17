import React from "react";
import { palette as P, sans, shadow, type } from "./tokens";
import { range, usePop } from "../components/motion";

/** Sticker tones. "lime" is the website's tag style; "ink" is the inverse for a second accent. */
export type Tone = "lime" | "ink" | "card" | "gold";
const TONES: Record<Tone, { bg: string; fg: string }> = {
  lime: { bg: P.lime, fg: P.ink },
  ink: { bg: P.ink, fg: P.lime },
  card: { bg: P.card, fg: P.ink },
  gold: { bg: P.gold, fg: P.ink },
};

/** The brand tag: Plex Sans Bold on a colour block with an ink border and a hard ink shadow, slightly rotated. */
export const Sticker: React.FC<{ children: React.ReactNode; size: number; tone?: Tone; rotate?: number; pop?: number; style?: React.CSSProperties }> = ({
  children,
  size,
  tone = "lime",
  rotate = -3,
  pop = 1,
  style,
}) => {
  const c = TONES[tone];
  const b = Math.max(4, Math.round(size * 0.075));
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.2,
        ...type.display,
        fontSize: size,
        lineHeight: 1.08,
        color: c.fg,
        background: c.bg,
        border: `${b}px solid ${P.ink}`,
        borderRadius: size * 0.26,
        padding: `${size * 0.08}px ${size * 0.34}px ${size * 0.13}px`,
        boxShadow: tone === "ink" ? `${b + 2}px ${b + 2}px 0 ${P.lime}` : shadow.hard(b + 2),
        whiteSpace: "nowrap",
        transform: `scale(${pop}) rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Small ink pill with a mono label and a blinking lime dot ("REAL WEBSITE"). */
export const LabelPill: React.FC<{ text: string; t: number; size?: number; pop?: number; style?: React.CSSProperties }> = ({ text, t, size = 28, pop = 1, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      ...type.label,
      fontSize: size,
      color: P.paper,
      background: P.ink,
      borderRadius: 999,
      padding: `${size * 0.32}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`,
      boxShadow: shadow.soft,
      whiteSpace: "nowrap",
      transform: `scale(${pop})`,
      ...style,
    }}
  >
    <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: 99, background: P.lime, opacity: Math.floor(t * 3) % 2 ? 1 : 0.35 }} />
    {text}
  </div>
);

/** Reaction mark ("?", "!") that pops in and bobs: coloured fill, ink outline, hard ink shadow. */
export const Mark: React.FC<{ t: number; at: number; x: number; y: number; text: string; color?: string; size: number; rot: number }> = ({ t, at, x, y, text, color = P.lime, size, rot }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 220, mass: 0.6 });
  const bob = Math.sin((t - at) * 5) * 8;
  const s = Math.round(size * 0.06);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1,
        transform: `scale(${p}) rotate(${rot + (1 - Math.min(p, 1)) * 40}deg)`,
        opacity: Math.min(1, p * 2),
        textShadow: `${s}px ${s}px 0 ${P.ink}`,
        WebkitTextStroke: `${Math.round(size * 0.055)}px ${P.ink}`,
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  );
};

/** Short radial burst of lines. */
export const Burst: React.FC<{ t: number; at: number; x: number; y: number; color?: string; r?: number }> = ({ t, at, x, y, color = P.ink, r = 150 }) => {
  const k = range(t, at, at + 0.5);
  if (t < at || k >= 1) return null;
  return (
    <svg width={r * 4} height={r * 4} viewBox={`${-r * 2} ${-r * 2} ${r * 4} ${r * 4}`} style={{ position: "absolute", left: x - r * 2, top: y - r * 2, opacity: 1 - k }}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r0 = r * (0.55 + 0.6 * k);
        const r1 = r * (0.85 + 0.9 * k);
        return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} stroke={color} strokeWidth={10} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Rupee coin in the illustration gold, with an ink outline. `spin` squashes it like a turning coin. */
export const Coin: React.FC<{ size: number; spin?: number; style?: React.CSSProperties }> = ({ size, spin = 1, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: P.gold,
      border: `${Math.round(size * 0.07)}px solid ${P.ink}`,
      boxShadow: `inset ${-size * 0.08}px ${-size * 0.08}px 0 #C9962F`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: sans,
      fontWeight: 700,
      fontSize: size * 0.56,
      color: P.ink,
      transform: `scaleX(${0.3 + 0.7 * Math.abs(spin)})`,
      ...style,
    }}
  >
    ₹
  </div>
);

/** Mouse pointer: white with an ink outline. */
export const Pointer: React.FC<{ press?: number }> = ({ press = 1 }) => (
  <svg width={64} height={78} viewBox="0 0 64 78" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px rgba(23,23,23,0.3))" }}>
    <path d="M4 4 L4 62 L19 48 L30 73 L42 68 L31 43 L52 43 Z" fill="#FFFFFF" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

/** Expanding ring for a click or tap. `k` runs 0 to 1. */
export const ClickRing: React.FC<{ k: number }> = ({ k }) => (
  <div
    style={{
      position: "absolute",
      left: -40 - k * 30,
      top: -40 - k * 30,
      width: 80 + k * 60,
      height: 80 + k * 60,
      borderRadius: 200,
      border: `6px solid ${P.ink}`,
      background: `${P.lime}66`,
      opacity: 1 - k,
    }}
  />
);
