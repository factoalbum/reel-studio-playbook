import React from "react";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { clamp01 } from "../mdh/kit";

/**
 * Shared parts of the google.com reel: two side characters (Sanmay Ved and the friend), the reconstructed
 * domain-shop screens, the $12 receipt and money formatting. Timing helpers come from ../mdh/kit.
 */

/** $6,006.13 style, with cents. */
export const cents = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---------------------------------------------------------------------------------------------------------------
// Side characters: simply drawn illustrations in the series' flat style (not likenesses), built like Alex Tew.

export type FigPose = "look" | "type" | "lean" | "head" | "head2" | "up" | "cheer" | "hold" | "holdL" | "point";
export type FigFace = "calm" | "curious" | "shocked" | "worried" | "happy" | "money";
type FigStyle = { skin: string; skinShade: string; hair: string; hairHi: string; shirt: string; shirtHi: string; tee: string; curly: boolean; glasses: boolean };

/** Sanmay Ved in 2015: short black hair, glasses, a blue shirt over a white tee. */
export const SANMAY: FigStyle = { skin: "#C68B63", skinShade: "#A8714E", hair: "#17120F", hairHi: "#3B322B", shirt: "#4A6FA5", shirtHi: "#6187BD", tee: "#FFFFFF", curly: false, glasses: true };
/** The friend who sees a business idea in everything: curly hair and a gold hoodie. */
export const FRIEND: FigStyle = { skin: "#E2B08B", skinShade: "#C58F6A", hair: "#3A2418", hairHi: "#5A3A28", shirt: P.gold, shirtHi: "#F2CB6B", tee: P.card, curly: true, glasses: false };

const LINE = P.ink;

export const Figure: React.FC<{ look: FigStyle; pose: FigPose; face: FigFace; t: number; blink?: boolean }> = ({ look: L, pose, face, t, blink = false }) => {
  const bob = Math.sin(t * 2.2) * 3;
  const typing = pose === "type" ? Math.sin(t * 22) * 4 : 0;
  const down = (s: 1 | -1): [number, number][] => [[112 * s, 10], [138 * s, 150], [80 * s, 240]];
  const onHead = (s: 1 | -1): [number, number][] => [[112 * s, 10], [170 * s, -60], [86 * s, -190 + Math.sin(t * 9) * 5]];
  const raised = (s: 1 | -1): [number, number][] => [[112 * s, 10], [168 * s, -90], [150 * s, -250 + Math.sin(t * 7) * 6]];
  const arms: Record<FigPose, [[number, number][], [number, number][]]> = {
    look: [down(-1), down(1)],
    type: [[[-112, 10], [-140, 150], [-70, 230 + typing]], [[112, 10], [140, 150], [70, 230 - typing]]],
    lean: [[[-112, 10], [-150, 130], [-40, 200]], [[112, 10], [150, 130], [40, 200]]],
    head: [down(-1), onHead(1)],
    head2: [onHead(-1), onHead(1)],
    up: [down(-1), raised(1)],
    cheer: [raised(-1), raised(1)],
    hold: [down(-1), [[112, 10], [200, 110], [205, 10]]],
    holdL: [[[-112, 10], [-200, 110], [-205, 10]], down(1)],
    point: [down(-1), [[112, 10], [210, 20], [270, -60]]],
  };
  const [armL, armR] = arms[pose];
  const front = pose === "type" || pose === "lean";
  const arm = (pts: [number, number][], key: string) => {
    const d = `M${pts[0][0]} ${pts[0][1]} Q${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`;
    return (
      <g key={key}>
        <path d={d} fill="none" stroke={LINE} strokeWidth={66} strokeLinecap="round" />
        <path d={d} fill="none" stroke={L.shirt} strokeWidth={54} strokeLinecap="round" />
        <circle cx={pts[2][0]} cy={pts[2][1]} r={27} fill={L.skin} stroke={LINE} strokeWidth={6} />
      </g>
    );
  };
  const lift = face === "shocked" ? -10 : face === "worried" ? 0 : face === "curious" ? -4 : 0;
  const inner = face === "worried" ? 8 : face === "shocked" ? -2 : 0;
  const eyeH = blink ? 2 : face === "shocked" ? 17 : 12;
  const headTilt = pose === "head" ? -6 : pose === "head2" ? 0 : pose === "up" || pose === "cheer" ? 4 : pose === "lean" ? 5 : 0;
  return (
    <svg viewBox="-220 -300 440 580" width={440} height={580} style={{ overflow: "visible", transform: `translateY(${bob}px)` }}>
      {/* Body: an open shirt over a tee. */}
      <path d="M-160 280 C-165 70 -120 -10 0 -18 C120 -10 165 70 160 280 Z" fill={L.shirt} stroke={LINE} strokeWidth={7} />
      <path d="M-46 -14 C-40 80 -36 180 -34 280 L34 280 C36 180 40 80 46 -14 Z" fill={L.tee} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-70 -8 Q0 40 70 -8" fill="none" stroke={L.shirtHi} strokeWidth={14} />
      {!front && arm(armL, "L")}
      <rect x={-26} y={-60} width={52} height={50} fill={L.skinShade} stroke={LINE} strokeWidth={6} />
      <g transform={`rotate(${headTilt} 0 -130)`}>
        <ellipse cx={-76} cy={-128} rx={14} ry={20} fill={L.skin} stroke={LINE} strokeWidth={6} />
        <ellipse cx={76} cy={-128} rx={14} ry={20} fill={L.skin} stroke={LINE} strokeWidth={6} />
        <ellipse cx={0} cy={-135} rx={76} ry={88} fill={L.skin} stroke={LINE} strokeWidth={7} />
        {L.curly ? (
          // Curly hair: a crown of round curls.
          <g>
            {Array.from({ length: 9 }, (_, i) => {
              const a = Math.PI * (1.05 + (i / 8) * 0.9);
              return <circle key={i} cx={Math.cos(a) * 72} cy={-150 + Math.sin(a) * 80} r={30} fill={L.hair} stroke={LINE} strokeWidth={6} />;
            })}
            <ellipse cx={0} cy={-205} rx={66} ry={34} fill={L.hair} />
          </g>
        ) : (
          // Short, neat hair with a small quiff.
          <path
            d="M-80 -146 C-90 -204 -46 -240 4 -236 C56 -240 92 -204 80 -146 C74 -170 56 -186 30 -190 C40 -176 22 -172 8 -186 C-14 -192 -50 -186 -66 -168 C-72 -162 -77 -154 -80 -146 Z"
            fill={L.hair}
            stroke={LINE}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        )}
        <path d="M-36 -216 C-14 -226 14 -228 34 -220" fill="none" stroke={L.hairHi} strokeWidth={8} strokeLinecap="round" />
        {/* Brows, eyes, nose, mouth. */}
        <path d={`M-50 ${-160 + lift} L-18 ${-163 + lift + inner}`} stroke={LINE} strokeWidth={8} strokeLinecap="round" />
        <path d={`M50 ${-160 + lift - (face === "curious" ? 8 : 0)} L18 ${-163 + lift + inner}`} stroke={LINE} strokeWidth={8} strokeLinecap="round" />
        {face === "money" ? (
          <>
            <text x={-32} y={-118} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={44} fill={P.olive}>
              $
            </text>
            <text x={32} y={-118} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={44} fill={P.olive}>
              $
            </text>
          </>
        ) : face === "happy" && !blink ? (
          <>
            <path d="M-44 -128 Q-32 -144 -20 -128" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
            <path d="M20 -128 Q32 -144 44 -128" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
          </>
        ) : face === "shocked" && !blink ? (
          <>
            <circle cx={-32} cy={-132} r={17} fill={P.card} stroke={LINE} strokeWidth={5} />
            <circle cx={32} cy={-132} r={17} fill={P.card} stroke={LINE} strokeWidth={5} />
            <circle cx={-30} cy={-130} r={7} fill={LINE} />
            <circle cx={34} cy={-130} r={7} fill={LINE} />
          </>
        ) : (
          <>
            <ellipse cx={-32} cy={-132} rx={10} ry={eyeH} fill={LINE} />
            <ellipse cx={32} cy={-132} rx={10} ry={eyeH} fill={LINE} />
            {!blink && <circle cx={-29} cy={-137} r={3.5} fill={P.card} />}
            {!blink && <circle cx={35} cy={-137} r={3.5} fill={P.card} />}
          </>
        )}
        {L.glasses && (
          <g fill="none" stroke={LINE} strokeWidth={5}>
            <rect x={-60} y={-156} width={54} height={44} rx={12} />
            <rect x={6} y={-156} width={54} height={44} rx={12} />
            <path d="M-6 -138 Q0 -144 6 -138" />
          </g>
        )}
        <path d="M0 -120 Q-8 -98 2 -96" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
        {face === "shocked" ? (
          <ellipse cx={0} cy={-70} rx={16} ry={21} fill="#5E1F22" stroke={LINE} strokeWidth={6} />
        ) : face === "happy" || face === "money" ? (
          <path d="M-32 -80 Q0 -36 32 -80 Z" fill="#5E1F22" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
        ) : face === "worried" ? (
          <path d="M-20 -70 Q0 -84 20 -70" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
        ) : face === "curious" ? (
          <ellipse cx={4} cy={-74} rx={9} ry={10} fill="#5E1F22" stroke={LINE} strokeWidth={5} />
        ) : (
          <path d="M-22 -78 Q0 -64 22 -78" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
        )}
        {(face === "worried" || face === "shocked") && <path d="M60 -176 q8 14 0 22 q-8 -8 0 -22 Z" fill="#9FD3F0" stroke={LINE} strokeWidth={4} />}
      </g>
      {!front && arm(armR, "R")}
      {front && (
        <>
          {arm(armL, "L")}
          {arm(armR, "R")}
        </>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The reconstructed domain shop. Drawn by us, never the real screens, and always labelled as a reconstruction.

export const ReconTag: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", ...type.label, fontSize: 19, letterSpacing: "0.08em", color: P.ink, background: P.gold, border: `3px solid ${P.ink}`, borderRadius: 8, padding: "5px 12px", whiteSpace: "nowrap", ...style }}>
    Reconstruction · not the real screen
  </div>
);

/** The shop's header bar inside the window. */
export const ShopHeader: React.FC = () => (
  <div style={{ height: 84, display: "flex", alignItems: "center", gap: 14, padding: "0 30px", borderBottom: `3px solid ${P.line}` }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 14, height: 14, borderRadius: 14, background: P.ink }} />
    </div>
    <div style={{ ...type.display, fontSize: 36, color: P.ink, letterSpacing: "-0.02em" }}>Google Domains</div>
    <div style={{ marginLeft: "auto", ...type.label, fontSize: 18, color: P.ink3 }}>2015</div>
  </div>
);

/** Search box with typed text and a caret. */
export const SearchBox: React.FC<{ text: string; typed: number; t: number }> = ({ text, typed, t }) => {
  const n = Math.round(text.length * clamp01(typed));
  return (
    <div style={{ height: 96, borderRadius: 48, border: `4px solid ${P.ink}`, background: P.card, display: "flex", alignItems: "center", padding: "0 34px", gap: 18, boxShadow: shadow.hard(6) }}>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={17} cy={17} r={12} fill="none" stroke={P.ink} strokeWidth={5} />
        <path d="M26 26 L36 36" stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 46, color: P.ink }}>{text.slice(0, n)}</div>
      {(typed < 1 || Math.floor(t * 2.4) % 2 === 0) && <div style={{ width: 4, height: 50, background: P.ink, marginLeft: -12 }} />}
    </div>
  );
};

/** A pill button that can be pressed (press 0 to 1 shrinks it for a moment). */
export const ShopButton: React.FC<{ label: string; press?: number; tone?: "lime" | "ink"; size?: number; style?: React.CSSProperties }> = ({ label, press = 0, tone = "lime", size = 40, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: size * 2.1,
      padding: `0 ${size * 1.1}px`,
      borderRadius: size * 1.05,
      background: tone === "lime" ? P.lime : P.ink,
      color: tone === "lime" ? P.ink : P.lime,
      border: `4px solid ${P.ink}`,
      boxShadow: press > 0.5 ? "none" : shadow.hard(6),
      transform: `translate(${press > 0.5 ? 5 : 0}px, ${press > 0.5 ? 5 : 0}px) scale(${1 - 0.06 * Math.sin(Math.PI * clamp01(press))})`,
      ...type.display,
      fontSize: size,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {label}
  </div>
);

/** Green tick in a circle, drawn on with `k` (0 to 1). */
export const Tick: React.FC<{ size: number; k: number; color?: string }> = ({ size, k, color = P.lime }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={color} stroke={P.ink} strokeWidth={7} />
    <path d="M28 52 L44 68 L74 36" fill="none" stroke={P.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - clamp01(k))} />
  </svg>
);

/** Red-pink cross in a circle, for the cancelled order. */
export const Cross: React.FC<{ size: number; k: number }> = ({ size, k }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={P.pink} stroke={P.ink} strokeWidth={7} />
    <path d="M33 33 L67 67 M67 33 L33 67" fill="none" stroke={P.ink} strokeWidth={10} strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * (1 - clamp01(k))} />
  </svg>
);

// ---------------------------------------------------------------------------------------------------------------
// The $12 receipt card that travels through the ending (held, shared, saved).

export const Receipt: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 300, style }) => {
  const s = w / 300;
  return (
    <div
      style={{
        width: w,
        background: P.card,
        border: `${Math.max(3, 4 * s)}px solid ${P.ink}`,
        borderRadius: 18 * s,
        boxShadow: shadow.hard(Math.round(7 * s)),
        padding: `${18 * s}px ${22 * s}px`,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ ...type.label, fontSize: 16 * s, color: P.ink3 }}>Receipt · 29 Sep 2015</div>
      <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 34 * s, color: P.ink, marginTop: 8 * s }}>google.com</div>
      <div style={{ borderTop: `${2 * s}px dashed ${P.lineStrong}`, margin: `${10 * s}px 0` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ ...type.body, fontSize: 20 * s, color: P.ink2 }}>Domain, 1 year</div>
        <div style={{ ...type.display, fontSize: 46 * s, color: P.ink }}>$12</div>
      </div>
    </div>
  );
};

/** Instagram-like action icons, drawn simply in the brand style (small, never covering the story). */
export const Icon: React.FC<{ kind: "comment" | "share" | "save"; size: number; fill?: number }> = ({ kind, size, fill = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ overflow: "visible" }}>
    {kind === "comment" && <path d="M24 6 C13 6 6 13 6 22 C6 27 8 31 12 34 L10 43 L19 38 C21 38.6 22.5 39 24 39 C35 39 42 31.5 42 22.5 C42 13 35 6 24 6 Z" fill={P.lime} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />}
    {kind === "share" && <path d="M42 6 L6 20 L20 26 L26 42 Z M20 26 L42 6" fill={P.lime} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />}
    {kind === "save" && (
      <path d="M12 6 H36 V42 L24 32 L12 42 Z" fill={`color-mix(in srgb, ${P.lime} ${clamp01(fill) * 100}%, ${P.card})`} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
    )}
  </svg>
);
