import React from "react";
import { palette as P, sans, shadow } from "./tokens";

/**
 * Tool tiles: one simple glyph per kind of tool on the website (calculators, PDF, images, text, code...),
 * as brand stickers (colour block, ink border, hard ink shadow). The rupee sign needs the latin-ext font subset.
 */
export type ToolKind = "calc" | "percent" | "rupee" | "pdf" | "image" | "qr" | "text" | "code" | "calendar" | "ruler" | "lock" | "clock";

export const TOOL_KINDS: ToolKind[] = ["calc", "percent", "rupee", "pdf", "image", "qr", "text", "code", "calendar", "ruler", "lock", "clock"];

const TONE: Record<ToolKind, string> = {
  calc: P.lime,
  percent: P.card,
  rupee: P.gold,
  pdf: P.card,
  image: P.limeSoft,
  qr: P.card,
  text: P.lime,
  code: P.ink,
  calendar: P.card,
  ruler: P.limeSoft,
  lock: P.lime,
  clock: P.gold,
};

const INK = P.ink;
const W = 6;

const Glyph: React.FC<{ kind: ToolKind }> = ({ kind }) => {
  const word = (text: string, size: number, color = INK) => (
    <text x={50} y={50} dy="0.35em" textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={size} fill={color}>
      {text}
    </text>
  );
  switch (kind) {
    case "calc":
      return (
        <>
          <rect x={25} y={12} width={50} height={76} rx={9} fill={P.card} stroke={INK} strokeWidth={W} />
          <rect x={33} y={21} width={34} height={17} rx={3} fill={P.lime} stroke={INK} strokeWidth={4} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={38 + c * 12} cy={52 + r * 12} r={4} fill={INK} />))}
        </>
      );
    case "percent":
      return word("%", 66);
    case "rupee":
      return word("₹", 68);
    case "pdf":
      return (
        <>
          <path d="M30 10 H62 L78 26 V90 H30 Z" fill={P.card} stroke={INK} strokeWidth={W} strokeLinejoin="round" />
          <path d="M62 10 V26 H78" fill="none" stroke={INK} strokeWidth={W} strokeLinejoin="round" />
          <rect x={16} y={50} width={52} height={24} rx={5} fill={INK} />
          <text x={42} y={62} dy="0.35em" textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={17} fill={P.lime}>
            PDF
          </text>
        </>
      );
    case "image":
      return (
        <>
          <rect x={12} y={20} width={76} height={60} rx={9} fill={P.card} stroke={INK} strokeWidth={W} />
          <circle cx={34} cy={40} r={7} fill={P.gold} stroke={INK} strokeWidth={4} />
          <path d="M17 75 L42 50 L57 64 L67 55 L84 72 V75 Z" fill={P.lime} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </>
      );
    case "qr":
      return (
        <>
          {[
            [14, 14],
            [58, 14],
            [14, 58],
          ].map(([x, y]) => (
            <g key={`${x}${y}`}>
              <rect x={x} y={y} width={28} height={28} rx={4} fill="none" stroke={INK} strokeWidth={W} />
              <rect x={x + 9} y={y + 9} width={10} height={10} fill={INK} />
            </g>
          ))}
          {[
            [62, 62],
            [76, 62],
            [62, 76],
            [80, 80],
            [70, 72],
          ].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x - 4} y={y - 4} width={9} height={9} fill={INK} />
          ))}
        </>
      );
    case "text":
      return word("Aa", 54);
    case "code":
      return word("</>", 44, P.lime);
    case "calendar":
      return (
        <>
          <rect x={14} y={20} width={72} height={66} rx={9} fill={P.card} stroke={INK} strokeWidth={W} />
          <path d="M14 29 a9 9 0 0 1 9 -9 H77 a9 9 0 0 1 9 9 V40 H14 Z" fill={P.lime} stroke={INK} strokeWidth={W} strokeLinejoin="round" />
          <path d="M34 12 V28 M66 12 V28" stroke={INK} strokeWidth={W} strokeLinecap="round" />
          {[0, 1, 2].map((c) => [0, 1].map((r) => <rect key={`${c}${r}`} x={27 + c * 17} y={50 + r * 15} width={10} height={9} rx={2} fill={INK} />))}
        </>
      );
    case "ruler":
      return (
        <g transform="rotate(-35 50 50)">
          <rect x={8} y={36} width={84} height={28} rx={5} fill={P.lime} stroke={INK} strokeWidth={W} />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={18 + i * 10} x2={18 + i * 10} y1={38} y2={i % 2 === 0 ? 54 : 47} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          ))}
        </g>
      );
    case "lock":
      return (
        <>
          <path d="M34 46 V34 a16 16 0 0 1 32 0 V46" fill="none" stroke={INK} strokeWidth={W + 1} />
          <rect x={22} y={44} width={56} height={44} rx={9} fill={P.card} stroke={INK} strokeWidth={W} />
          <circle cx={50} cy={63} r={6} fill={INK} />
          <path d="M50 66 V76" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx={50} cy={50} r={36} fill={P.card} stroke={INK} strokeWidth={W} />
          <path d="M50 28 V50 L66 60" fill="none" stroke={INK} strokeWidth={W} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
};

/** One tool tile. `size` is the tile's width in pixels. */
export const ToolTile: React.FC<{ kind: ToolKind; size: number; style?: React.CSSProperties }> = ({ kind, size, style }) => {
  const b = Math.max(4, Math.round(size * 0.045));
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: TONE[kind],
        border: `${b}px solid ${P.ink}`,
        boxShadow: kind === "code" ? `${b + 3}px ${b + 3}px 0 ${P.lime}` : shadow.hard(b + 3),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        <Glyph kind={kind} />
      </svg>
    </div>
  );
};
