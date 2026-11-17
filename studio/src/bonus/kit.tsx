import React from "react";
import { random } from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { Figure } from "../google/kit";
import { clamp01, eo, lerp, seg } from "../mdh/kit";

// The rupee sign lives in the latin-ext part of the fonts (same trick as the Pinterest pins).
loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin-ext"] });
loadMono("normal", { weights: ["500", "600"], subsets: ["latin-ext"] });

/**
 * Parts of the Diwali bonus reel, all drawn by us: festive decor (diyas, marigold garland, warm glow), the two side
 * characters (an employee and a manager, flat illustrations on the same Figure rig as the earlier episodes), the
 * phone notification, the stamp, the salary slip, the check cards, the calculator, the accounting-year timeline,
 * the HR chat and small icons. No government logos, no real notices, no real apps.
 */

export const FEST = { marigold: "#F39A1E", marigoldDk: "#D9731A", saffron: "#FFB43A", leaf: "#3E8E3A", leafDk: "#2D6B2A", flame: "#FFC94A", flameHot: "#FF8A1F", clay: "#B5542D", clayDk: "#8A3A1C", red: "#E0452B", redDk: "#B3301B", sky: "#7FA7D9" };

export const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) ${extra}` });

// ---------------------------------------------------------------------------------------------------------------
// Festive decor

/** A clay diya with a flickering flame. Drawn around the flame's base at (0, 0). */
export const Diya: React.FC<{ t: number; s?: number; seed?: number }> = ({ t, s = 1, seed = 0 }) => {
  const f = 1 + 0.08 * Math.sin(t * 13 + seed * 2.1) + 0.05 * Math.sin(t * 21 + seed);
  const sway = 3 * Math.sin(t * 7 + seed);
  return (
    <svg viewBox="-80 -110 160 150" width={160 * s} height={150 * s} style={{ overflow: "visible" }}>
      <ellipse cx={0} cy={-30} rx={46 * f} ry={52 * f} fill={FEST.flame} opacity={0.22} />
      <g transform={`translate(0 2) scale(1 ${f}) skewX(${sway})`}>
        <path d="M0 -58 C14 -36 15 -14 0 0 C-15 -14 -14 -36 0 -58 Z" fill={FEST.flameHot} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M0 -36 C7 -24 7 -12 0 -5 C-7 -12 -7 -24 0 -36 Z" fill={FEST.flame} />
      </g>
      <path d="M-66 4 C-60 30 -34 38 0 38 C34 38 60 30 66 4 Q44 -2 22 4 L0 -2 L-22 4 Q-44 -2 -66 4 Z" fill={FEST.clay} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-50 18 Q0 30 50 18" fill="none" stroke={FEST.saffron} strokeWidth={5} strokeLinecap="round" />
      {[-30, 0, 30].map((x) => (
        <circle key={x} cx={x} cy={26} r={4} fill={P.lime} stroke={P.ink} strokeWidth={2} />
      ))}
    </svg>
  );
};

/** One marigold bloom. */
const Bloom: React.FC<{ x: number; y: number; r: number; c: string }> = ({ x, y, r, c }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={c} stroke={P.ink} strokeWidth={3} />
    <circle r={r * 0.62} fill="none" stroke={FEST.marigoldDk} strokeWidth={3} strokeDasharray="4 5" />
    <circle r={r * 0.25} fill={FEST.marigoldDk} />
  </g>
);

/** A marigold toran: swags of flowers with mango leaves, across the full width at `y`. */
export const Garland: React.FC<{ t: number; y: number; swags?: number; depth?: number }> = ({ t, y, swags = 3, depth = 70 }) => {
  const W = 1080;
  const w = W / swags;
  const blooms: React.ReactNode[] = [];
  for (let s = 0; s < swags; s++) {
    for (let i = 0; i <= 12; i++) {
      const k = i / 12;
      const x = s * w + k * w;
      const yy = Math.sin(Math.PI * k) * depth + Math.sin(t * 1.6 + s) * 3 * Math.sin(Math.PI * k);
      blooms.push(<Bloom key={`${s}-${i}`} x={x} y={yy} r={i % 2 ? 17 : 19} c={i % 3 === 0 ? FEST.saffron : FEST.marigold} />);
    }
  }
  return (
    <svg viewBox={`0 -30 ${W} ${depth + 120}`} width={W} height={depth + 120} style={{ position: "absolute", left: 0, top: y - 30, overflow: "visible" }}>
      {Array.from({ length: swags + 1 }, (_, i) => (
        <g key={i} transform={`translate(${i * w} 0)`}>
          {[-1, 1].map((d) => (
            <path key={d} d={`M0 4 C${d * 10} 34 ${d * 26} 58 ${d * 18} 84 C${d * 4} 62 ${d * 2} 34 0 4 Z`} fill={FEST.leaf} stroke={P.ink} strokeWidth={3} transform={`rotate(${d * 14 + Math.sin(t * 2 + i) * 4})`} />
          ))}
          <path d={`M0 0 L0 ${70 + Math.sin(t * 2.2 + i) * 4}`} stroke={FEST.marigoldDk} strokeWidth={4} />
          <Bloom x={0} y={74} r={15} c={FEST.saffron} />
        </g>
      ))}
      {blooms}
    </svg>
  );
};

/** Warm festive light over the paper backdrop. `k` is the strength (0 to 1). */
export const WarmGlow: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: k, background: `radial-gradient(70% 38% at 50% 100%, rgba(255,180,58,0.30), rgba(255,180,58,0) 70%), radial-gradient(60% 30% at 50% 0%, rgba(243,154,30,0.18), rgba(243,154,30,0) 70%)` }} />
);

/** A row of diyas along the bottom edge. */
export const DiyaRow: React.FC<{ t: number; y: number; xs?: number[]; s?: number }> = ({ t, y, xs = [140, 330, 750, 940], s = 0.8 }) => (
  <>
    {xs.map((x, i) => (
      <div key={x} style={{ ...centre(x, y, 1) }}>
        <Diya t={t} s={s} seed={i * 1.7} />
      </div>
    ))}
  </>
);

// ---------------------------------------------------------------------------------------------------------------
// Side characters: an employee and a manager. Flat illustrations, not likenesses. Same Figure rig as earlier reels.

/** The employee: young, short black hair, a light blue office shirt. */
export const EMP = { skin: "#C98E64", skinShade: "#AC7350", hair: "#16110E", hairHi: "#3A3029", shirt: FEST.sky, shirtHi: "#A9C6EC", tee: "#FFFFFF", curly: false, glasses: false };
/** The manager: glasses, greying hair, a navy blazer over a white shirt. Professional, never a villain. */
export const BOSS = { skin: "#D9A47E", skinShade: "#BC8760", hair: "#5B5853", hairHi: "#8D8A84", shirt: "#2F3B52", shirtHi: "#46556F", tee: "#FFFFFF", curly: false, glasses: true };

/** The friend in the share scene: curly hair, a marigold festive kurta. */
export const FRIEND = { skin: "#B97F58", skinShade: "#9C6544", hair: "#1E1712", hairHi: "#43362C", shirt: FEST.marigold, shirtHi: "#FFC266", tee: "#FFF4E0", curly: true, glasses: false };
const LOOKS = { emp: EMP, boss: BOSS, friend: FRIEND };

type FigPose = React.ComponentProps<typeof Figure>["pose"];
type FigFace = React.ComponentProps<typeof Figure>["face"];

/**
 * A side character with feet at (x, bottom), scale s. `tie` draws the manager's tie, `badge` the employee's lanyard,
 * on the same bob as the Figure (both live in the Figure's 440 x 580 box).
 */
export const Person: React.FC<{ who: "emp" | "boss" | "friend"; x: number; bottom: number; s: number; pose: FigPose; face: FigFace; t: number; blink?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ who, x, bottom, s, pose, face, t, blink = false, flip = false, style }) => {
  const bob = Math.sin(t * 2.2) * 3;
  return (
    <div style={{ position: "absolute", left: x - 220, top: bottom - 580, width: 440, height: 580, transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: "50% 100%", ...style }}>
      <Figure look={LOOKS[who]} pose={pose} face={face} t={t} blink={blink} />
      <svg viewBox="-220 -300 440 580" width={440} height={580} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `translateY(${bob}px)`, pointerEvents: "none" }}>
        {who === "boss" ? (
          <g>
            <path d="M-12 -12 L12 -12 L8 6 L-8 6 Z" fill={FEST.marigoldDk} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d="M-8 6 L8 6 L16 150 L0 172 L-16 150 Z" fill={FEST.marigold} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d="M-10 60 L12 40 M-12 110 L14 88" stroke={FEST.marigoldDk} strokeWidth={5} />
          </g>
        ) : who === "friend" ? (
          <g>
            <path d="M0 -6 L0 96" stroke={FEST.marigoldDk} strokeWidth={6} strokeLinecap="round" />
            {[18, 50, 82].map((y) => (
              <circle key={y} cx={0} cy={y} r={6} fill={FEST.flame} stroke={P.ink} strokeWidth={3} />
            ))}
          </g>
        ) : (
          <g>
            <path d="M-40 -10 L-12 120 M40 -10 L12 120" stroke={P.olive} strokeWidth={8} strokeLinecap="round" />
            <rect x={-34} y={116} width={68} height={86} rx={10} fill={P.card} stroke={P.ink} strokeWidth={4} />
            <rect x={-34} y={116} width={68} height={22} rx={6} fill={P.lime} stroke={P.ink} strokeWidth={4} />
            <circle cx={0} cy={164} r={13} fill={EMP.skinShade} stroke={P.ink} strokeWidth={3} />
            <rect x={-20} y={184} width={40} height={6} rx={3} fill={P.lineStrong} />
          </g>
        )}
      </svg>
    </div>
  );
};

/** A plain office desk (front panel), drawn in front of a seated character. */
export const Desk: React.FC<{ x: number; top: number; w?: number; label?: string }> = ({ x, top, w = 520, label }) => (
  <div style={{ position: "absolute", left: x - w / 2, top, width: w }}>
    <div style={{ height: 30, background: "#8C6A4F", border: `5px solid ${P.ink}`, borderRadius: 10 }} />
    <div style={{ height: 150, margin: "0 26px", background: "#A9825F", border: `5px solid ${P.ink}`, borderTop: "none", borderRadius: "0 0 12px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label && <div style={{ ...type.label, fontSize: 22, color: P.paper, background: P.ink, borderRadius: 8, padding: "6px 14px" }}>{label}</div>}
    </div>
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// Props

/** A phone with a lock-screen style notification. `k` (0 to 1) slides the notification in. */
export const Phone: React.FC<{ t: number; k: number; w?: number; zero?: number }> = ({ t, k, w = 360, zero = 0 }) => {
  const h = w * 1.9;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.14, background: P.ink, border: `6px solid ${P.ink}`, boxShadow: shadow.soft }}>
      <div style={{ position: "absolute", inset: 12, borderRadius: w * 0.11, background: `linear-gradient(180deg, #2A3550, #1B2233)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", ...type.display, fontSize: w * 0.2, color: P.card }}>10:30</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 26 + w * 0.24, textAlign: "center", ...type.label, fontSize: w * 0.05, color: "#B9C2D6" }}>Payday</div>
        <div style={{ position: "absolute", left: 14, right: 14, top: lerp(-200, h * 0.36, eo(k)), background: "rgba(250,249,246,0.96)", borderRadius: 22, padding: "16px 18px", border: `4px solid ${P.ink}`, boxShadow: shadow.hard(5) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: P.lime, border: `3px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 22 }}>₹</div>
            <div style={{ ...type.label, fontSize: 17, color: P.ink3 }}>Payroll · now</div>
          </div>
          <div style={{ ...type.display, fontSize: w * 0.085, color: P.ink, marginTop: 10 }}>Salary credited</div>
          <div style={{ ...type.display, fontSize: w * 0.078, color: zero > 0 ? FEST.red : P.ink2, marginTop: 6 }}>Bonus: ₹0</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 20, width: w * 0.28, height: 22, marginLeft: -w * 0.14, borderRadius: 12, background: P.ink }} />
    </div>
  );
};

/** A rubber stamp that slams in: `p` is a spring (0 to about 1). */
export const Stamp: React.FC<{ p: number; text: string; size?: number; rotate?: number; color?: string }> = ({ p, text, size = 110, rotate = -9, color = FEST.red }) => {
  if (p <= 0) return null;
  const k = Math.min(1, p);
  return (
    <div style={{ transform: `scale(${lerp(2.6, 1, k) * (p > 1 ? 1 + (p - 1) * 0.3 : 1)}) rotate(${rotate}deg)`, opacity: Math.min(1, p * 2), display: "inline-block", border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.2, padding: `${size * 0.06}px ${size * 0.3}px`, ...type.display, fontSize: size, color, background: "rgba(255,255,255,0.88)", whiteSpace: "nowrap", boxShadow: `0 0 0 ${size * 0.05}px rgba(255,255,255,0.9)` }}>
      {text}
    </div>
  );
};

/** A salary slip card. Lines are labels with bars, never real figures; `bonus` shows the bonus row. */
export const SalarySlip: React.FC<{ w?: number; bonus?: React.ReactNode; hi?: number; style?: React.CSSProperties }> = ({ w = 420, bonus = "₹0", hi = 0, style }) => (
  <div style={{ width: w, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(7), padding: "22px 26px", boxSizing: "border-box", ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ ...type.label, fontSize: w * 0.05, color: P.ink }}>Salary slip</div>
      <div style={{ ...type.label, fontSize: w * 0.04, color: P.ink3 }}>Oct</div>
    </div>
    {[["Basic", 0.62], ["DA", 0.4], ["Allowances", 0.5]].map(([l, bw]) => (
      <div key={l as string} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
        <div style={{ ...type.body, fontSize: w * 0.05, color: P.ink2, width: w * 0.36 }}>{l}</div>
        <div style={{ height: 14, borderRadius: 7, background: P.line, width: `${(bw as number) * 100}%` }} />
      </div>
    ))}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 14, borderTop: `3px dashed ${P.lineStrong}`, background: hi > 0 ? `rgba(224,69,43,${0.12 * hi})` : undefined, borderRadius: 8 }}>
      <div style={{ ...type.display, fontSize: w * 0.064, color: P.ink }}>Bonus</div>
      <div style={{ ...type.display, fontSize: w * 0.075, color: FEST.red }}>{bonus}</div>
    </div>
  </div>
);

/** A green tick in a box; `k` (0 to 1) draws the tick. */
export const TickBox: React.FC<{ k: number; size?: number }> = ({ k, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect x={4} y={4} width={56} height={56} rx={14} fill={k > 0 ? P.lime : P.card} stroke={P.ink} strokeWidth={6} />
    <path d="M16 33 L28 45 L49 20" fill="none" stroke={P.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - clamp01(k))} />
  </svg>
);

/** The scales of justice, drawn (not an emoji). */
export const Scales: React.FC<{ size?: number; tilt?: number }> = ({ size = 120, tilt = 0 }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: "visible" }}>
    <path d="M0 -44 L0 44 M-24 46 L24 46" stroke={P.ink} strokeWidth={7} strokeLinecap="round" />
    <circle cx={0} cy={-46} r={7} fill={P.gold} stroke={P.ink} strokeWidth={4} />
    <g transform={`rotate(${tilt} 0 -34)`}>
      <path d="M-44 -34 L44 -34" stroke={P.ink} strokeWidth={7} strokeLinecap="round" />
      {[-44, 44].map((x) => (
        <g key={x} transform={`rotate(${-tilt} ${x} -34)`}>
          <path d={`M${x} -34 L${x - 16} 4 M${x} -34 L${x + 16} 4`} stroke={P.ink} strokeWidth={4} />
          <path d={`M${x - 22} 4 Q${x} 26 ${x + 22} 4 Z`} fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  </svg>
);

/** A drawn "not equal" sign, because the brand fonts lack the glyph. */
export const NotEqual: React.FC<{ size?: number; color?: string }> = ({ size = 80, color = P.ink }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M12 30 L68 30 M12 52 L68 52" stroke={color} strokeWidth={10} strokeLinecap="round" />
    <path d="M52 10 L28 72" stroke={FEST.red} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

/** Paper plane share icon. */
export const PaperPlane: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ overflow: "visible" }}>
    <path d="M10 56 L110 12 L78 106 L56 70 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M56 70 L110 12 L48 62 Z" fill={P.lime} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M56 70 L58 92 L68 80" fill={P.lineStrong} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

/** A green heart (drawn). */
export const Heart: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M30 52 C10 38 4 28 4 19 C4 10 11 4 19 4 C24 4 28 7 30 11 C32 7 36 4 41 4 C49 4 56 10 56 19 C56 28 50 38 30 52 Z" fill={P.lime} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

/** A chunky calculator whose display shows `display`. */
export const Calculator: React.FC<{ w?: number; display: React.ReactNode; press?: number }> = ({ w = 360, display, press = -1 }) => {
  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "%", "="];
  return (
    <div style={{ width: w, padding: w * 0.06, boxSizing: "border-box", background: P.ink, borderRadius: w * 0.09, border: `6px solid ${P.ink}`, boxShadow: `10px 10px 0 ${P.olive}` }}>
      <div style={{ height: w * 0.3, borderRadius: w * 0.05, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: `0 ${w * 0.05}px`, ...type.display, fontSize: w * 0.2, color: P.ink }}>{display}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: w * 0.03, marginTop: w * 0.05 }}>
        {keys.map((k, i) => (
          <div key={k} style={{ height: w * 0.15, borderRadius: w * 0.035, background: i === press ? P.lime : i % 4 === 3 || k === "%" || k === "=" ? P.gold : "#3A3A3A", border: `3px solid #000`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: w * 0.075, color: i % 4 === 3 || k === "%" || k === "=" || i === press ? P.ink : P.card, transform: i === press ? "translateY(3px)" : undefined }}>
            {k}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Spark dots that fly out from (x, y) at time `at` (a small celebration, not a particle storm). */
export const Sparks: React.FC<{ t: number; at: number; x: number; y: number; n?: number; r?: number }> = ({ t, at, x, y, n = 10, r = 220 }) => {
  const k = seg(t, at, at + 0.7);
  if (k <= 0 || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + random(`sp${at}${i}`) * 0.5;
        const d = r * eo(k) * (0.7 + 0.3 * random(`sd${at}${i}`));
        const c = [P.lime, FEST.marigold, P.gold, FEST.saffron][i % 4];
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * d - 9, top: y + Math.sin(a) * d - 9, width: 18, height: 18, borderRadius: i % 2 ? 4 : 18, background: c, border: `3px solid ${P.ink}`, opacity: 1 - k, transform: `rotate(${k * 180}deg)` }} />;
      })}
    </>
  );
};

export { mono, sans };
