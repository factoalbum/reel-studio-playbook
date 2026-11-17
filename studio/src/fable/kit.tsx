import React from "react";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { eo, lerp, seg } from "../mdh/kit";

/**
 * Pieces for the Fable × Higgsfield reel: illustrated "AI video" clips drawn in code (never presented as real
 * generations, always labelled), a 2.5D card, a light streak, an energy line and a mouse cursor path.
 */

export type ClipKind = "city" | "landscape" | "product" | "character" | "film";

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** An animated illustrative clip. Fills its box (slice); `t` drives the motion, `play` 0..1 the progress bar. */
export const AiClip: React.FC<{ kind: ClipKind; t: number; w: number; h: number; radius?: number; play?: number; hud?: boolean }> = ({ kind, t, w, h, radius = 18, play, hud = true }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: radius, overflow: "hidden", background: "#111" }}>
    <svg width={w} height={h} viewBox="0 0 300 533" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      {kind === "city" && <City t={t} />}
      {kind === "landscape" && <Landscape t={t} />}
      {kind === "product" && <Product t={t} />}
      {kind === "character" && <Character t={t} />}
      {kind === "film" && <Film t={t} />}
    </svg>
    {hud && (
      <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <svg width={Math.max(14, w * 0.06)} height={Math.max(14, w * 0.06)} viewBox="0 0 10 10">
          <path d="M2 1 L9 5 L2 9 Z" fill="#fff" />
        </svg>
        <div style={{ flex: 1, height: Math.max(4, w * 0.015), borderRadius: 4, background: "rgba(255,255,255,0.35)", overflow: "hidden" }}>
          <div style={{ width: `${((play ?? (t * 0.25) % 1) * 100).toFixed(2)}%`, height: "100%", background: "#fff" }} />
        </div>
      </div>
    )}
  </div>
);

const City: React.FC<{ t: number }> = ({ t }) => {
  const drift = (t * 4) % 40;
  return (
    <g>
      <defs>
        <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24184F" />
          <stop offset="0.38" stopColor="#7A2F7C" />
          <stop offset="0.6" stopColor="#E0566C" />
          <stop offset="0.75" stopColor="#FF8F45" />
          <stop offset="0.86" stopColor="#FFC56E" />
        </linearGradient>
        <radialGradient id="cSun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF2C2" stopOpacity="1" />
          <stop offset="0.35" stopColor="#FFC96B" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FF8F45" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B1E52" />
          <stop offset="1" stopColor="#140B24" />
        </linearGradient>
      </defs>
      <rect width="300" height="533" fill="url(#cSky)" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={rnd(i) * 300} cy={rnd(i + 50) * 150} r={0.6 + rnd(i + 9) * 0.9} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />
      ))}
      <circle cx="150" cy="345" r="120" fill="url(#cSun)" />
      <circle cx="150" cy={350 - Math.sin(t * 0.4) * 3} r="40" fill="#FFE29A" />
      {/* far skyline: domes, minarets and towers */}
      <g fill="#6A2C6E" opacity="0.85" transform={`translate(${-drift * 0.3} 0)`}>
        <rect x="-10" y="330" width="40" height="80" />
        <rect x="35" y="290" width="18" height="120" />
        <path d="M60 340 h50 v70 h-50z M60 340 a25 25 0 0 1 50 0z" />
        <rect x="83" y="295" width="4" height="22" />
        <rect x="118" y="260" width="10" height="150" />
        <path d="M116 262 a7 7 0 0 1 14 0z" />
        <rect x="140" y="310" width="34" height="100" />
        <rect x="182" y="240" width="22" height="170" />
        <path d="M182 240 l11 -26 l11 26z" />
        <rect x="212" y="300" width="40" height="110" />
        <path d="M255 335 h46 v75 h-46z M255 335 a23 23 0 0 1 46 0z" />
        <rect x="300" y="300" width="30" height="110" />
      </g>
      {/* monorail */}
      <rect x="0" y="392" width="300" height="3" fill="#2A1236" />
      <g transform={`translate(${((t * 70) % 460) - 140} 0)`}>
        <rect x="0" y="380" width="96" height="12" rx="6" fill="#F4F2EA" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={8 + i * 12} y="383" width="7" height="4" rx="1" fill="#FFB85C" />
        ))}
      </g>
      {/* near skyline with lit windows */}
      <g fill="#2B1238" transform={`translate(${-drift * 0.7} 0)`}>
        <rect x="-20" y="380" width="60" height="70" />
        <rect x="45" y="355" width="38" height="95" />
        <rect x="90" y="395" width="55" height="55" />
        <rect x="150" y="340" width="30" height="110" />
        <path d="M150 340 l15 -18 l15 18z" />
        <rect x="186" y="372" width="62" height="78" />
        <rect x="252" y="350" width="40" height="100" />
        <rect x="296" y="380" width="50" height="70" />
        {Array.from({ length: 46 }, (_, i) => {
          const x = -15 + rnd(i + 3) * 340;
          const y = 360 + rnd(i + 70) * 80;
          const on = Math.sin(t * 1.3 + i * 2.1) > -0.6;
          return <rect key={i} x={x} y={y} width="4" height="5" fill={on ? "#FFB85C" : "#5B2E6E"} />;
        })}
      </g>
      {/* flying pods with light trails */}
      {[0, 1, 2].map((i) => {
        const x = (((t * (28 + i * 12) + i * 120) % 420) - 60);
        const y = 200 + i * 34 + Math.sin(t * 2 + i) * 4;
        return (
          <g key={i}>
            <rect x={x - 36} y={y + 1} width="36" height="2" fill="#FFE29A" opacity="0.5" />
            <ellipse cx={x} cy={y + 2} rx="8" ry="3.4" fill="#F4F2EA" />
            <circle cx={x + 5} cy={y + 2} r="1.4" fill={P.lime} />
          </g>
        );
      })}
      {/* water with the sun's reflection */}
      <rect x="0" y="450" width="300" height="83" fill="url(#cWater)" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={150 - (30 - i * 3) + Math.sin(t * 3 + i) * 4} y={458 + i * 8} width={(30 - i * 3) * 2} height="2.4" rx="1.2" fill="#FFC56E" opacity={0.8 - i * 0.08} />
      ))}
    </g>
  );
};

const Landscape: React.FC<{ t: number }> = ({ t }) => {
  const pan = Math.sin(t * 0.35) * 14;
  return (
    <g>
      <defs>
        <linearGradient id="lSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E7CC9" />
          <stop offset="0.55" stopColor="#9FD0F0" />
          <stop offset="0.75" stopColor="#FDE7C4" />
        </linearGradient>
      </defs>
      <rect width="300" height="533" fill="url(#lSky)" />
      <circle cx="210" cy="200" r="28" fill="#FFF3D1" />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((t * (8 + i * 4) + i * 110) % 380) - 40} cy={110 + i * 40} rx={40 - i * 6} ry="10" fill="#fff" opacity="0.85" />
      ))}
      <g transform={`translate(${pan * 0.4} 0)`}>
        <path d="M-40 330 L40 210 L110 300 L170 190 L260 310 L340 240 L340 400 L-40 400Z" fill="#7C9CC0" />
        <path d="M40 210 L60 240 L50 236 L40 252 L28 230Z M170 190 L192 222 L178 218 L168 232 L155 214Z" fill="#fff" />
      </g>
      <g transform={`translate(${pan} 0)`}>
        <path d="M-40 380 L60 280 L140 360 L220 270 L340 370 L340 420 L-40 420Z" fill="#45698A" />
      </g>
      <rect x="0" y="400" width="300" height="133" fill="#2F5B78" />
      <g transform={`translate(${pan} 0) scale(1 -0.5) translate(0 -1210)`} opacity="0.35">
        <path d="M-40 380 L60 280 L140 360 L220 270 L340 370 L340 420 L-40 420Z" fill="#45698A" />
      </g>
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={((t * 20 + i * 60) % 340) - 20} y={430 + i * 14} width="40" height="1.6" fill="#BFE0F5" opacity="0.6" />
      ))}
      {[0, 1].map((i) => {
        const x = ((t * 30 + i * 40) % 360) - 30;
        const f = Math.sin(t * 10 + i) * 3;
        return <path key={i} d={`M${x} ${150 + i * 12} q5 ${-f} 10 0 q5 ${-f} 10 0`} fill="none" stroke="#24364A" strokeWidth="1.6" />;
      })}
    </g>
  );
};

const Product: React.FC<{ t: number }> = ({ t }) => {
  const turn = Math.cos(t * 1.6);
  const sweep = ((t * 0.6) % 1) * 500 - 100;
  return (
    <g>
      <defs>
        <radialGradient id="pBg" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#3A3A3D" />
          <stop offset="1" stopColor="#0F0F10" />
        </radialGradient>
        <linearGradient id="pGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9BD13C" />
          <stop offset="0.5" stopColor={P.lime} />
          <stop offset="1" stopColor="#7DB52A" />
        </linearGradient>
      </defs>
      <rect width="300" height="533" fill="url(#pBg)" />
      <ellipse cx="150" cy="395" rx="95" ry="20" fill="#2A2A2C" stroke="#4A4A4D" strokeWidth="2" />
      <ellipse cx="150" cy="392" rx="70" ry="10" fill="#000" opacity="0.5" />
      <g transform={`translate(150 0) scale(${0.55 + 0.45 * Math.abs(turn)} 1) translate(-150 0)`}>
        <rect x="128" y="180" width="44" height="34" rx="6" fill="#D9D6CC" />
        <path d="M108 214 h84 q14 0 14 14 v150 q0 14 -14 14 h-84 q-14 0 -14 -14 v-150 q0 -14 14 -14z" fill="url(#pGlass)" opacity="0.92" />
        <rect x="118" y="270" width="64" height="58" rx="6" fill="#171717" />
        <rect x="128" y="286" width="44" height="6" rx="3" fill={P.lime} />
        <rect x="128" y="300" width="30" height="5" rx="2.5" fill="#8C897F" />
        <rect x={turn > 0 ? 112 : 176} y="224" width="8" height="150" rx="4" fill="#fff" opacity="0.45" />
      </g>
      <rect x={sweep} y="0" width="40" height="533" fill="#fff" opacity="0.08" transform="skewX(-20)" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={20 + rnd(i) * 260} cy={480 - (((t * (14 + rnd(i + 4) * 20)) + rnd(i + 8) * 400) % 420)} r={1 + rnd(i + 2) * 1.6} fill={P.lime} opacity="0.6" />
      ))}
    </g>
  );
};

const Character: React.FC<{ t: number }> = ({ t }) => {
  const bob = Math.sin(t * 3) * 8;
  const wave = Math.sin(t * 7) * 25;
  const blink = (t * 0.8) % 1 > 0.94;
  return (
    <g>
      <defs>
        <linearGradient id="chBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE3FF" />
          <stop offset="1" stopColor="#FCE3EC" />
        </linearGradient>
      </defs>
      <rect width="300" height="533" fill="url(#chBg)" />
      <ellipse cx="150" cy="420" rx="70" ry="12" fill="#000" opacity="0.12" />
      <g transform={`translate(0 ${bob})`}>
        <line x1="150" y1="170" x2="150" y2="200" stroke="#171717" strokeWidth="5" />
        <circle cx="150" cy="166" r="9" fill={Math.sin(t * 6) > 0 ? P.lime : "#FF8F45"} stroke="#171717" strokeWidth="4" />
        <rect x="95" y="198" width="110" height="88" rx="30" fill="#F4F2EA" stroke="#171717" strokeWidth="5" />
        <rect x="110" y="214" width="80" height="54" rx="18" fill="#1B1B1A" />
        {blink ? (
          <>
            <rect x="126" y="240" width="16" height="4" rx="2" fill={P.lime} />
            <rect x="158" y="240" width="16" height="4" rx="2" fill={P.lime} />
          </>
        ) : (
          <>
            <circle cx="134" cy="240" r="8" fill={P.lime} />
            <circle cx="166" cy="240" r="8" fill={P.lime} />
          </>
        )}
        <path d="M138 256 q12 8 24 0" fill="none" stroke={P.lime} strokeWidth="4" strokeLinecap="round" />
        <rect x="105" y="290" width="90" height="100" rx="28" fill={P.lime} stroke="#171717" strokeWidth="5" />
        <rect x="132" y="315" width="36" height="22" rx="6" fill="#171717" />
        <g transform={`rotate(${-30 + wave} 200 305)`}>
          <rect x="196" y="298" width="56" height="18" rx="9" fill="#F4F2EA" stroke="#171717" strokeWidth="5" />
        </g>
        <rect x="58" y="300" width="50" height="18" rx="9" fill="#F4F2EA" stroke="#171717" strokeWidth="5" transform="rotate(25 104 309)" />
      </g>
    </g>
  );
};

const Film: React.FC<{ t: number }> = ({ t }) => {
  const near = (t * 0.35) % 1;
  return (
    <g>
      <defs>
        <linearGradient id="fBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1026" />
          <stop offset="1" stopColor="#273061" />
        </linearGradient>
      </defs>
      <rect width="300" height="533" fill="url(#fBg)" />
      <g fill="#070A1A">
        <rect x="0" y="170" width="70" height="250" />
        <rect x="230" y="150" width="70" height="270" />
        <rect x="70" y="230" width="30" height="190" />
        <rect x="200" y="220" width="30" height="200" />
      </g>
      <rect x="18" y="200" width="40" height="16" rx="3" fill="none" stroke="#FF4FA3" strokeWidth="2.5" opacity={0.6 + 0.4 * Math.abs(Math.sin(t * 5))} />
      <rect x="240" y="190" width="44" height="14" rx="3" fill="none" stroke="#4FE3FF" strokeWidth="2.5" opacity={0.7 + 0.3 * Math.sin(t * 3)} />
      <path d="M100 420 L150 300 L200 420Z" fill="#1A2147" />
      <path d="M0 420 L300 420 L300 533 L0 533Z" fill="#141A3A" />
      {/* the car's headlights coming closer */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={150 + s * lerp(4, 40, near)} cy={lerp(305, 400, near)} r={lerp(2, 14, near)} fill="#FFF4C8" />
          <circle cx={150 + s * lerp(4, 40, near)} cy={lerp(305, 400, near)} r={lerp(6, 40, near)} fill="#FFF4C8" opacity="0.18" />
          <rect x={150 + s * lerp(4, 40, near) - 2} y={lerp(310, 425, near)} width="4" height={lerp(10, 90, near)} fill="#FFF4C8" opacity="0.25" />
        </g>
      ))}
      {Array.from({ length: 40 }, (_, i) => {
        const x = rnd(i) * 300;
        const y = ((t * 420 + rnd(i + 20) * 533) % 533);
        return <line key={i} x1={x} y1={y} x2={x - 3} y2={y + 14} stroke="#AFC3FF" strokeWidth="1" opacity="0.45" />;
      })}
      <rect x="0" y="0" width="300" height="70" fill="#000" />
      <rect x="0" y="463" width="300" height="70" fill="#000" />
    </g>
  );
};

/** A floating card with 2.5D rotation (the logo inside stays flat to the card, never distorted on its own). */
export const Card3D: React.FC<{ k: number; t: number; yaw?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ k, t, yaw = 22, children, style }) => {
  const ry = lerp(yaw, 0, eo(Math.min(1, k))) + Math.sin(t * 1.3) * 4;
  const rx = lerp(-10, 0, eo(Math.min(1, k))) + Math.cos(t * 1.1) * 2.5;
  return (
    <div style={{ perspective: 1400, ...style }}>
      <div style={{ transform: `rotateY(${ry}deg) rotateX(${rx}deg) translateY(${Math.sin(t * 1.7) * 6}px)`, transformStyle: "preserve-3d" }}>{children}</div>
    </div>
  );
};

/** A fast diagonal light streak across the screen, starting at `at`. */
export const Streak: React.FC<{ t: number; at: number; dur?: number; color?: string }> = ({ t, at, dur = 0.38, color = "#FFFFFF" }) => {
  const k = seg(t, at, at + dur);
  if (k <= 0 || k >= 1) return null;
  return (
    <div style={{ position: "absolute", left: lerp(-700, 1500, eo(k)), top: -200, width: 220, height: 2400, transform: "rotate(18deg)", background: `linear-gradient(90deg, transparent, ${color}cc 45%, ${P.lime}aa 55%, transparent)`, opacity: Math.sin(k * Math.PI) * 0.75, mixBlendMode: "screen", pointerEvents: "none" }} />
  );
};

/** A lime energy line drawn from a to b, with a bright pulse travelling along it. */
export const EnergyLine: React.FC<{ from: [number, number]; to: [number, number]; k: number; t: number; dark?: boolean; width?: number }> = ({ from, to, k, t, dark = false, width = 10 }) => {
  if (k <= 0) return null;
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const x = lerp(from[0], to[0], Math.min(1, k));
  const y = lerp(from[1], to[1], Math.min(1, k));
  const p = (t * 1.6) % 1;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={dark ? "#2C2B28" : P.ink} strokeWidth={width + 8} strokeLinecap="round" />
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} stroke={P.lime} strokeWidth={width} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${width}px ${P.lime})` }} />
      {k >= 1 && <circle cx={lerp(from[0], to[0], p)} cy={lerp(from[1], to[1], p)} r={width * 0.9} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 ${width * 1.4}px ${P.lime})` }} />}
      <title>{len}</title>
    </svg>
  );
};

/** Cursor position from keys [time, x, y]: glides (eased, 0.35 s) into each key. */
export const cursorAt = (t: number, keys: [number, number, number][]): [number, number] => {
  let [, x, y] = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const [at, kx, ky] = keys[i];
    const k = eo(seg(t, at - 0.35, at));
    x = lerp(x, kx, k);
    y = lerp(y, ky, k);
  }
  return [x, y];
};

/** A labelled browser window (light), used for the reconstructed Claude screens. */
export const BrowserWin: React.FC<{ w: number; h: number; url: string; children: React.ReactNode; dark?: boolean }> = ({ w, h, url, children, dark = false }) => (
  <div style={{ width: w, borderRadius: 22, border: `5px solid ${P.ink}`, background: dark ? "#1F1E1D" : "#FAF9F5", overflow: "hidden", boxShadow: shadow.hard(9) }}>
    <div style={{ height: 46, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", borderBottom: `3px solid ${P.ink}`, background: P.paper2 }}>
      {[P.pink, P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, border: `2px solid ${P.ink}` }} />
      ))}
      <div style={{ marginLeft: 12, flex: 1, height: 28, borderRadius: 8, background: P.card, border: `2px solid ${P.line}`, display: "flex", alignItems: "center", padding: "0 12px", fontFamily: mono, fontSize: 16, color: P.ink2, whiteSpace: "nowrap" }}>{url}</div>
    </div>
    <div style={{ position: "relative", height: h, overflow: "hidden", fontFamily: sans, fontWeight: 500 }}>{children}</div>
  </div>
);

/** Big readable label for a key term, e.g. a step's UI target. */
export const TermPill: React.FC<{ text: string; k: number; tone?: "lime" | "ink" | "card"; size?: number }> = ({ text, k, tone = "lime", size = 40 }) => (
  <div style={{ ...type.display, fontSize: size, color: tone === "ink" ? P.lime : P.ink, background: tone === "lime" ? P.lime : tone === "ink" ? P.ink : P.card, border: `5px solid ${P.ink}`, borderRadius: 16, padding: `${size * 0.12}px ${size * 0.45}px ${size * 0.18}px`, whiteSpace: "nowrap", boxShadow: shadow.hard(6), transform: `scale(${Math.min(1, k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1)})`, opacity: Math.min(1, k * 2) }}>
    {text}
  </div>
);
