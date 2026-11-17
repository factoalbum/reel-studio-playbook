import React from "react";
import { random, spring } from "remotion";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";

/** Shared parts of the Million Dollar Homepage reel: timing helpers, the pixel grid, made-up ads, Alex Tew and props. */

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0 to 1 between times a and b. */
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const ei = (x: number) => x * x * x;
/** Eased 0 to 1 between times a and b. */
export const go = (t: number, a: number, b: number) => io(seg(t, a, b));
/** A spring that starts at time `at` (0 before it). */
export const pop = (t: number, at: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  t < at ? 0 : spring({ frame: Math.round((t - at) * 30), fps: 30, config: { damping: 12, stiffness: 150, mass: 0.7, ...cfg } });
/** Fades in over `fi` from a, out over `fo` before b. */
export const vis = (t: number, a: number, b: number, fi = 0.25, fo = 0.3) => clamp01((t - a) / fi) * clamp01((b - t) / fo);
export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// ---------------------------------------------------------------------------------------------------------------
// The pixel grid: 1000 x 1000 pixels, sold in 10 x 10 blocks. Drawn as one SVG in grid units, so a "camera" is
// just a viewBox: cx, cy is the grid point in the middle of the view and span is how many pixels fit across it.

export type GridCam = { cx: number; cy: number; span: number };

/** Exponential zoom between two cameras (k from 0 to 1), so zooming feels even at every scale. */
export const zoomCam = (a: GridCam, b: GridCam, k: number): GridCam => ({
  span: a.span * Math.pow(b.span / a.span, k),
  cx: lerp(a.cx, b.cx, k),
  cy: lerp(a.cy, b.cy, k),
});

const AD_COLOURS = [
  ["#FF5A4E", "#FFFFFF"],
  ["#FFB000", "#171717"],
  ["#2D7FF9", "#FFFFFF"],
  ["#18A058", "#FFFFFF"],
  ["#8B5CF6", "#FFFFFF"],
  ["#FF7AB6", "#171717"],
  ["#00B8D9", "#171717"],
  ["#FFE14D", "#171717"],
  ["#171717", "#C8F169"],
  ["#FFFFFF", "#171717"],
  ["#C8F169", "#171717"],
  ["#F97316", "#FFFFFF"],
];
// Generic words only: the ads in the animation are made up, never real brands.
const AD_WORDS = ["PIZZA", "SHOES", "GAMES", "MUSIC", "TRAVEL", "BOOKS", "CARS", "TOYS", "PETS", "BIKES", "COFFEE", "PHONES", "TEES", "CAKES", "GOLF", "SURF", "RADIO", "HOTEL", "FILMS", "ART", "WEB", "DEALS", "SALE!", "FUN", "JOBS", "TEA", "CAMERA", "SPORT", "PIXEL", "DESIGN"];

export type Tile = { x: number; y: number; w: number; h: number; bg: string; fg: string; word: string; mark: number; at: number };

/** The made-up ads that fill the grid, with the time each one lands. Built once, the same on every frame. */
export const TILES: Tile[] = (() => {
  const N = 100;
  const used = new Uint8Array(N * N);
  const raw: Omit<Tile, "at">[] = [];
  const style = (k: string) => {
    const c = AD_COLOURS[Math.floor(random(`c${k}`) * AD_COLOURS.length)];
    return { bg: c[0], fg: c[1], word: AD_WORDS[Math.floor(random(`w${k}`) * AD_WORDS.length)], mark: Math.floor(random(`m${k}`) * 4) };
  };
  const place = (bx: number, by: number, w: number, h: number, k: string) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) used[(by + j) * N + bx + i] = 1;
    raw.push({ x: bx * 10, y: by * 10, w: w * 10, h: h * 10, ...style(k) });
  };
  const free = (bx: number, by: number, w: number, h: number) => {
    if (bx + w > N || by + h > N) return false;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (used[(by + j) * N + bx + i]) return false;
    return true;
  };
  // A few big "premium" ads first, then everything else in small blocks.
  for (let n = 0; n < 60; n++) {
    const w = 5 + Math.floor(random(`bw${n}`) * 9);
    const h = 3 + Math.floor(random(`bh${n}`) * 6);
    const bx = Math.floor(random(`bx${n}`) * (N - w));
    const by = Math.floor(random(`by${n}`) * (N - h));
    if (free(bx, by, w, h)) place(bx, by, w, h, `big${n}`);
  }
  for (let by = 0; by < N; by++)
    for (let bx = 0; bx < N; bx++) {
      if (used[by * N + bx]) continue;
      let w = 1 + Math.floor(Math.pow(random(`sw${bx}-${by}`), 2) * 5);
      let h = 1 + Math.floor(Math.pow(random(`sh${bx}-${by}`), 2) * 4);
      while (w > 1 && !free(bx, by, w, 1)) w--;
      while (h > 1 && !free(bx, by, w, h)) h--;
      place(bx, by, w, h, `${bx}-${by}`);
    }
  // Landing order: random, so ads arrive everywhere at once.
  const order = raw.map((r, i) => ({ r, k: random(`o${i}`) })).sort((a, b) => a.k - b.k);
  return order.map(({ r }, i) => {
    const q = i / order.length;
    const at = q < 0.05 ? lerp(35.3, 37.3, q / 0.05) : q < 0.9 ? lerp(37.3, 40.85, (q - 0.05) / 0.85) : lerp(40.85, 42.2, (q - 0.9) / 0.1);
    return { ...r, at };
  });
})();

/** The first ad: the one bought in the "Company to $100 to block" moment. */
export const FIRST = { x: 500, y: 500, w: 10, h: 10, bg: "#FFB000", fg: "#171717", word: "PIZZA" };
/** Its neighbours, which land right after it. */
export const NEXT: { x: number; y: number; w: number; h: number; bg: string; fg: string; word: string; at: number }[] = [
  { x: 510, y: 490, w: 20, h: 10, bg: "#2D7FF9", fg: "#FFFFFF", word: "MUSIC", at: 35.3 },
  { x: 480, y: 510, w: 20, h: 20, bg: "#FF5A4E", fg: "#FFFFFF", word: "SHOES", at: 35.6 },
  { x: 490, y: 480, w: 10, h: 20, bg: "#18A058", fg: "#FFFFFF", word: "TEA", at: 35.9 },
  { x: 510, y: 510, w: 10, h: 10, bg: "#8B5CF6", fg: "#FFFFFF", word: "ART", at: 36.2 },
];

export const PixelGrid: React.FC<{
  w: number;
  h: number;
  cam: GridCam;
  t: number;
  /** 0 = blank page, 1 = grid lines drawn. */
  lines: number;
  /** Highlighted pixel or block (lime), with its strength 0 to 1. */
  glow?: { x: number; y: number; w: number; h: number; k: number };
  /** Show the made-up ads up to time t. */
  ads?: boolean;
  first?: number;
  /** 0 to 1: the real grid (public file) replaces the drawing, cell by cell. */
  real?: { href: string; k: number };
}> = ({ w, h, cam, t, lines, glow, ads = false, first = 0, real }) => {
  const s = w / cam.span; // screen px per grid pixel
  const vw = cam.span;
  const vh = h / s;
  const x0 = cam.cx - vw / 2;
  const y0 = cam.cy - vh / 2;
  const lw = 1.4 / s;
  const pxA = clamp01((s - 4) / 10) * lines;
  const blkA = clamp01((s * 10 - 3) / 6) * lines;
  const bigA = clamp01((s * 100 - 30) / 60) * lines * 0.6;
  const inView = (r: { x: number; y: number; w: number; h: number }) => r.x + r.w > x0 && r.x < x0 + vw && r.y + r.h > y0 && r.y < y0 + vh;
  const tileFx = (r: { x: number; y: number; w: number; h: number }, k: number) => {
    const cx = r.x + r.w / 2;
    const cy = r.y + r.h / 2;
    const sc = Math.max(0, k);
    return `translate(${cx} ${cy}) scale(${sc}) translate(${-cx} ${-cy})`;
  };
  const label = (r: { x: number; y: number; w: number; h: number; fg: string; word: string }, k: number) => {
    const sw = r.w * s;
    const sh = r.h * s;
    if (sw < 46 || sh < 22) return null;
    const fs = Math.min(r.h * 0.42, (r.w * 1.6) / Math.max(3, r.word.length));
    return (
      <text x={r.x + r.w / 2} y={r.y + r.h / 2 + fs * 0.36} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={fs} fill={r.fg} opacity={k}>
        {r.word}
      </text>
    );
  };
  const cells = real && real.k > 0 ? 20 : 0;
  return (
    <svg width={w} height={h} viewBox={`${x0} ${y0} ${vw} ${vh}`} style={{ position: "absolute", left: 0, top: 0, display: "block" }}>
      <defs>
        <pattern id="mdh-px" width={1} height={1} patternUnits="userSpaceOnUse">
          <path d="M1 0V1H0" fill="none" stroke={P.lineStrong} strokeWidth={lw} />
        </pattern>
        <pattern id="mdh-blk" width={10} height={10} patternUnits="userSpaceOnUse">
          <path d="M10 0V10H0" fill="none" stroke={P.ink3} strokeWidth={lw * 1.2} />
        </pattern>
        <pattern id="mdh-big" width={100} height={100} patternUnits="userSpaceOnUse">
          <path d="M100 0V100H0" fill="none" stroke={P.ink2} strokeWidth={lw * 1.6} />
        </pattern>
        {real && <pattern id="mdh-real" width={1000} height={1000} patternUnits="userSpaceOnUse"><image href={real.href} width={1000} height={1000} /></pattern>}
      </defs>
      {/* Page outside the grid, then the grid's white canvas. */}
      <rect x={x0} y={y0} width={vw} height={vh} fill={P.paper2} />
      <rect x={0} y={0} width={1000} height={1000} fill="#FFFFFF" />
      {ads &&
        TILES.map((r, i) => {
          if (t < r.at || !inView(r)) return null;
          // Settled tiles skip the spring (it is costly to run for thousands of tiles).
          const k = t - r.at > 0.8 ? 1 : Math.min(1.08, pop(t, r.at, { damping: 11, stiffness: 220, mass: 0.5 }));
          return (
            <g key={i} transform={tileFx(r, k)}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.bg} stroke={P.ink} strokeWidth={Math.min(0.8, lw * 0.8)} />
              {r.mark === 1 && r.w >= 20 && <circle cx={r.x + r.w * 0.2} cy={r.y + r.h / 2} r={Math.min(r.w, r.h) * 0.16} fill={r.fg} opacity={0.85} />}
              {label(r, 1)}
            </g>
          );
        })}
      {ads &&
        NEXT.map((r, i) => {
          if (t < r.at || !inView(r)) return null;
          const k = Math.min(1.08, pop(t, r.at, { damping: 10, stiffness: 200, mass: 0.6 }));
          return (
            <g key={`n${i}`} transform={tileFx(r, k)}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.bg} stroke={P.ink} strokeWidth={lw * 1.5} />
              {label(r, 1)}
            </g>
          );
        })}
      {first > 0 && (
        <g transform={tileFx(FIRST, Math.min(1.08, first))}>
          <rect x={FIRST.x} y={FIRST.y} width={10} height={10} fill={FIRST.bg} stroke={P.ink} strokeWidth={lw * 1.5} />
          {/* A tiny pizza slice: the made-up company's logo. */}
          <path d="M502 502 L508 502 L505 508.2 Z" fill="#FFE7A3" stroke={P.ink} strokeWidth={lw * 1.1} strokeLinejoin="round" />
          <circle cx={504.4} cy={503.6} r={0.55} fill="#FF5A4E" />
          <circle cx={505.9} cy={504.4} r={0.5} fill="#FF5A4E" />
          {s * 10 > 120 && (
            <text x={505} y={509.6} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={1.15} fill={P.ink}>
              PIXEL PIZZA
            </text>
          )}
        </g>
      )}
      {lines > 0 && (
        <>
          <rect x={0} y={0} width={1000} height={1000} fill="url(#mdh-px)" opacity={pxA} />
          <rect x={0} y={0} width={1000} height={1000} fill="url(#mdh-blk)" opacity={blkA} />
          <rect x={0} y={0} width={1000} height={1000} fill="url(#mdh-big)" opacity={bigA} />
        </>
      )}
      {glow && glow.k > 0 && (
        <rect x={glow.x} y={glow.y} width={glow.w} height={glow.h} fill={P.lime} fillOpacity={0.85 * glow.k} stroke={P.ink} strokeWidth={lw * 3} strokeOpacity={glow.k} />
      )}
      {cells > 0 &&
        Array.from({ length: cells * cells }, (_, i) => {
          const cx = i % cells;
          const cy = Math.floor(i / cells);
          const start = random(`real${i}`) * 0.7;
          const k = clamp01((real!.k - start) / 0.3);
          if (k <= 0) return null;
          const size = 1000 / cells;
          const r = { x: cx * size, y: cy * size, w: size, h: size };
          return <rect key={`r${i}`} x={r.x} y={r.y} width={size + 0.5} height={size + 0.5} fill="url(#mdh-real)" transform={tileFx(r, 0.6 + 0.4 * eo(k))} opacity={k} />;
        })}
      {/* Grid edge. */}
      <rect x={0} y={0} width={1000} height={1000} fill="none" stroke={P.ink} strokeWidth={lw * 2.5} />
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// Props

/** Dollar coin in the illustration gold (the brand coin carries a rupee sign). */
export const DollarCoin: React.FC<{ size: number; spin?: number; style?: React.CSSProperties }> = ({ size, spin = 1, style }) => (
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
    $
  </div>
);

/** Small mono label on an ink pill (the website's eyebrow style). */
export const Eyebrow: React.FC<{ text: string; dot?: boolean; t?: number; style?: React.CSSProperties; size?: number }> = ({ text, dot = false, t = 0, style, size = 26 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: P.ink,
      color: P.card,
      borderRadius: 999,
      padding: `${size * 0.42}px ${size * 0.8}px`,
      ...type.label,
      fontSize: size,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {dot && <span style={{ width: size * 0.55, height: size * 0.55, borderRadius: 99, background: P.lime, opacity: 0.55 + 0.45 * Math.abs(Math.sin(t * 4)) }} />}
    {text}
  </div>
);

/** A light bulb with rays, for "idea". `k` is its glow 0 to 1. */
export const Bulb: React.FC<{ size: number; k: number; t: number }> = ({ size, k, t }) => (
  <svg width={size} height={size * 1.25} viewBox="-60 -80 120 150" style={{ overflow: "visible" }}>
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const r0 = 52 + 4 * Math.sin(t * 8 + i);
      return <line key={i} x1={Math.cos(a) * r0} y1={-18 + Math.sin(a) * r0} x2={Math.cos(a) * (r0 + 22 * k)} y2={-18 + Math.sin(a) * (r0 + 22 * k)} stroke={P.ink} strokeWidth={7} strokeLinecap="round" opacity={k} />;
    })}
    <circle cx={0} cy={-18} r={40} fill={k > 0.5 ? "#FFE58A" : "#FFFFFF"} stroke={P.ink} strokeWidth={6} />
    <path d="M-14 -14 Q0 6 14 -14" fill="none" stroke={P.ink} strokeWidth={4} opacity={0.6} />
    <rect x={-20} y={20} width={40} height={14} rx={4} fill={P.lineStrong} stroke={P.ink} strokeWidth={5} />
    <rect x={-16} y={34} width={32} height={12} rx={4} fill={P.lineStrong} stroke={P.ink} strokeWidth={5} />
  </svg>
);

// ---------------------------------------------------------------------------------------------------------------
// Alex Tew, 2005: a separate, simply drawn historical character (not a likeness), in the series' flat style.

export type AlexPose = "type" | "head" | "up" | "look";
export type AlexFace = "calm" | "worried" | "excited";

const AX = { skin: "#F2C9A8", skinShade: "#DDA683", hair: "#8A5A35", hairHi: "#A8744A", hoodie: "#5B7083", hoodieHi: "#6F8598", tee: "#FFFFFF", line: P.ink };

export const Alex: React.FC<{ pose: AlexPose; face: AlexFace; t: number; blink?: boolean }> = ({ pose, face, t, blink = false }) => {
  const bob = Math.sin(t * 2.2) * 3;
  const typing = pose === "type" ? Math.sin(t * 22) * 4 : 0;
  // Arms: [shoulder, elbow, hand]
  const armL: [number, number][] = pose === "type" ? [[-112, 10], [-140, 150], [-70, 230 + typing]] : [[-112, 10], [-138, 150], [-80, 240]];
  const armR: [number, number][] =
    pose === "type"
      ? [[112, 10], [140, 150], [70, 230 - typing]]
      : pose === "head"
        ? [[112, 10], [170, -60], [86, -190 + Math.sin(t * 9) * 6]]
        : pose === "up"
          ? [[112, 10], [168, -90], [150, -250]]
          : [[112, 10], [138, 150], [80, 240]];
  const arm = (pts: [number, number][], key: string) => {
    const d = `M${pts[0][0]} ${pts[0][1]} Q${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`;
    return (
      <g key={key}>
        <path d={d} fill="none" stroke={AX.line} strokeWidth={66} strokeLinecap="round" />
        <path d={d} fill="none" stroke={AX.hoodie} strokeWidth={54} strokeLinecap="round" />
        <circle cx={pts[2][0]} cy={pts[2][1]} r={27} fill={AX.skin} stroke={AX.line} strokeWidth={6} />
        {pose === "up" && key === "R" && <rect x={pts[2][0] - 7} y={pts[2][1] - 62} width={16} height={44} rx={8} fill={AX.skin} stroke={AX.line} strokeWidth={6} />}
      </g>
    );
  };
  const brow = face === "worried" ? 1 : face === "excited" ? -1 : 0;
  const eyeH = blink ? 2 : face === "excited" ? 15 : 12;
  return (
    <svg viewBox="-220 -300 440 580" width={440} height={580} style={{ overflow: "visible", transform: `translateY(${bob}px)` }}>
      {/* Body: a slate hoodie over a white tee. */}
      <path d="M-160 280 C-165 70 -120 -10 0 -18 C120 -10 165 70 160 280 Z" fill={AX.hoodie} stroke={AX.line} strokeWidth={7} />
      <path d="M-40 -14 L0 60 L40 -14" fill={AX.tee} stroke={AX.line} strokeWidth={6} strokeLinejoin="round" />
      <path d="M-70 -8 Q0 40 70 -8" fill="none" stroke={AX.hoodieHi} strokeWidth={14} />
      <line x1={-22} y1={30} x2={-26} y2={110} stroke={AX.line} strokeWidth={5} />
      <line x1={22} y1={30} x2={26} y2={110} stroke={AX.line} strokeWidth={5} />
      {pose !== "type" && arm(armL, "L")}
      {/* Neck and head. */}
      <rect x={-26} y={-60} width={52} height={50} fill={AX.skinShade} stroke={AX.line} strokeWidth={6} />
      <g transform={`rotate(${pose === "head" ? -6 : pose === "up" ? 4 : 0} 0 -130)`}>
        <ellipse cx={-76} cy={-128} rx={14} ry={20} fill={AX.skin} stroke={AX.line} strokeWidth={6} />
        <ellipse cx={76} cy={-128} rx={14} ry={20} fill={AX.skin} stroke={AX.line} strokeWidth={6} />
        <ellipse cx={0} cy={-135} rx={76} ry={88} fill={AX.skin} stroke={AX.line} strokeWidth={7} />
        {/* Short, messy light-brown hair. */}
        <path
          d="M-80 -150 C-86 -210 -40 -238 0 -232 C30 -244 70 -226 82 -190 C90 -170 84 -152 78 -146 C70 -170 50 -186 26 -184 C34 -170 20 -166 6 -180 C-6 -164 -28 -170 -30 -184 C-48 -178 -66 -168 -80 -150 Z"
          fill={AX.hair}
          stroke={AX.line}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <path d="M-40 -214 C-20 -224 10 -226 30 -218" fill="none" stroke={AX.hairHi} strokeWidth={8} strokeLinecap="round" />
        {/* Brows, eyes, nose, mouth. */}
        <path d={`M-48 ${-158 - brow * 2} L-18 ${-162 + brow * 6}`} stroke={AX.line} strokeWidth={8} strokeLinecap="round" />
        <path d={`M48 ${-158 - brow * 2} L18 ${-162 + brow * 6}`} stroke={AX.line} strokeWidth={8} strokeLinecap="round" />
        <ellipse cx={-32} cy={-132} rx={10} ry={eyeH} fill={AX.line} />
        <ellipse cx={32} cy={-132} rx={10} ry={eyeH} fill={AX.line} />
        {!blink && <circle cx={-29} cy={-137} r={3.5} fill="#FFFFFF" />}
        {!blink && <circle cx={35} cy={-137} r={3.5} fill="#FFFFFF" />}
        <path d="M0 -122 Q-8 -98 2 -96" fill="none" stroke={AX.line} strokeWidth={5} strokeLinecap="round" />
        {face === "excited" ? (
          <path d="M-30 -78 Q0 -40 30 -78 Z" fill="#5E1F22" stroke={AX.line} strokeWidth={6} strokeLinejoin="round" />
        ) : face === "worried" ? (
          <path d="M-20 -70 Q0 -84 20 -70" fill="none" stroke={AX.line} strokeWidth={6} strokeLinecap="round" />
        ) : (
          <path d="M-22 -78 Q0 -64 22 -78" fill="none" stroke={AX.line} strokeWidth={6} strokeLinecap="round" />
        )}
        {face === "worried" && <path d="M58 -170 q8 14 0 22 q-8 -8 0 -22 Z" fill="#9FD3F0" stroke={AX.line} strokeWidth={4} />}
      </g>
      {pose !== "type" && arm(armR, "R")}
      {pose === "type" && (
        <>
          {arm(armL, "L")}
          {arm(armR, "R")}
        </>
      )}
    </svg>
  );
};

/** A browser window drawn by us (for the made-up pages), with the series' address bar look. */
export const Window: React.FC<{ w: number; h: number; host: string; typed?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, h, host, typed = 1, children, style }) => (
  <div style={{ position: "absolute", width: w, height: h, borderRadius: 26, overflow: "hidden", background: P.card, border: `4px solid ${P.ink}`, boxShadow: shadow.soft, display: "flex", flexDirection: "column", ...style }}>
    <div style={{ height: 72, flexShrink: 0, background: P.paper2, borderBottom: `3px solid ${P.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 22px" }}>
      {[P.pink, P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 18, height: 18, borderRadius: 18, background: c, border: `2px solid ${P.ink}`, flexShrink: 0 }} />
      ))}
      <div style={{ marginLeft: 12, flex: 1, height: 46, borderRadius: 23, background: P.card, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: mono, fontSize: 25, fontWeight: 600, color: P.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
        {host.slice(0, Math.round(host.length * clamp01(typed)))}
        {typed < 1 && <span style={{ width: 3, height: 28, background: P.ink, marginLeft: 2 }} />}
      </div>
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);
