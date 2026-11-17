import React from "react";
import { random } from "remotion";
import { palette as P, sans, shadow, type } from "../brand/tokens";
import { clamp01, eo, lerp, seg } from "../mdh/kit";

/**
 * Parts of the eBay reel: the laser pointer (whole or snapped), the two side characters' looks, the 1995 room,
 * the CRT and keyboard, the reconstructed AuctionWeb page, the listing card, the flip-digit price, the SOLD stamp,
 * the year tunnel and the flip calendar. All drawn by us: nothing here is a real screenshot, and no eBay logo is used.
 */

export const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) ${extra}` });

/** A side character standing with its feet at (x, bottom). */
export const Stand: React.FC<{ x: number; bottom: number; s: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, bottom, s, children, style }) => (
  <div style={{ position: "absolute", left: x - 220, top: bottom - 580, width: 440, height: 580, transform: `scale(${s})`, transformOrigin: "50% 100%", ...style }}>{children}</div>
);

// ---------------------------------------------------------------------------------------------------------------
// Side characters: flat illustrations, not likenesses. Same Figure rig as the google.com reel.

/** Pierre Omidyar in 1995, illustrated: dark hair, glasses, a teal polo. */
export const PIERRE = { skin: "#E6BC97", skinShade: "#CC9B74", hair: "#2A1E18", hairHi: "#4D3A2E", shirt: P.teal, shirtHi: "#2B7A6C", tee: "#F3F1EB", curly: false, glasses: true };
/** Mark Fraser in 1995, illustrated: brown hair, a gold sweater. */
export const MARK = { skin: "#EDC6A4", skinShade: "#D3A37D", hair: "#5A3A28", hairHi: "#7C5641", shirt: P.gold, shirtHi: "#F2CB6B", tee: "#FFFFFF", curly: false, glasses: false };
/** The same illustrated Mark twenty years on: only the hair has gone grey. */
export const MARK_2015 = { ...MARK, hair: "#8D8A84", hairHi: "#B7B3AB" };

// ---------------------------------------------------------------------------------------------------------------
// The laser pointer. Drawn around its break point (0,0), about 620 units long and 68 thick.

const METAL = "#9AA0A8";
const METAL_HI = "#D5D9DE";
const METAL_DK = "#5F656C";
export const BEAM = "#FF2D2D";

const BRK = "L8 22 L-6 8 L10 -6 L-6 -20 L4 -34";
const TAIL = `M-296 -34 Q-314 -34 -314 -16 L-314 16 Q-314 34 -296 34 L-4 34 ${BRK} Z`;
const TIP = `M4 -34 L-6 -20 L10 -6 L-6 8 L8 22 L-4 34 L236 34 L304 13 L304 -13 L236 -34 Z`;

const PenTail: React.FC = () => (
  <g>
    <rect x={-250} y={-56} width={150} height={15} rx={7} fill={METAL_HI} stroke={P.ink} strokeWidth={6} />
    <rect x={-126} y={-56} width={14} height={30} fill={METAL_HI} stroke={P.ink} strokeWidth={6} />
    <path d={TAIL} fill={METAL} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-292 -19 L-10 -19" stroke={METAL_HI} strokeWidth={11} strokeLinecap="round" />
    <path d="M-292 20 L-10 20" stroke={METAL_DK} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    {[-288, -272, -256].map((x) => (
      <path key={x} d={`M${x} -32 V32`} stroke={P.ink} strokeWidth={4} opacity={0.65} />
    ))}
  </g>
);

const PenTip: React.FC<{ lit: number }> = ({ lit }) => (
  <g>
    <rect x={82} y={-50} width={76} height={24} rx={8} fill={P.lime} stroke={P.ink} strokeWidth={6} />
    <path d={TIP} fill={METAL} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
    <path d="M16 -19 L232 -19 L290 -6" fill="none" stroke={METAL_HI} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 20 L232 20" stroke={METAL_DK} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    <path d="M236 -34 L236 34" stroke={P.ink} strokeWidth={5} />
    <ellipse cx={304} cy={0} rx={7} ry={13} fill={lit > 0 ? BEAM : "#7B1E1E"} stroke={P.ink} strokeWidth={5} />
  </g>
);

/** Loose wires and a small spring hanging out of a snapped end. */
const Guts: React.FC<{ t: number; side: 1 | -1 }> = ({ t, side }) => {
  const sway = Math.sin(t * 5 + side) * 5;
  return (
    <g>
      <path d={`M${side * 2} -6 C${side * 26} 2 ${side * 28} 26 ${side * (42 + sway)} 44`} fill="none" stroke={P.pink} strokeWidth={6} strokeLinecap="round" />
      <path d={`M${side * 2} 8 C${side * 20} 18 ${side * 18} 42 ${side * (26 - sway)} 62`} fill="none" stroke={P.gold} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/**
 * The pointer as one object. `gap` pulls the two halves apart along the body, `bend` swings them (a snapped stick),
 * `beam` draws the red beam (0 to 1 of `beamLen`). `s` scales the whole thing. Rotate it from the outside.
 */
export const LaserPen: React.FC<{ s?: number; gap?: number; bend?: number; beam?: number; beamLen?: number; broken?: boolean; t?: number; drop?: number }> = ({ s = 1, gap = 0, bend = 0, beam = 0, beamLen = 900, broken = false, t = 0, drop = 0 }) => (
  <svg width={1} height={1} viewBox="0 0 1 1" style={{ overflow: "visible", display: "block" }}>
    <g transform={`scale(${s})`}>
      <g transform={`translate(${-gap} ${drop}) rotate(${-bend})`}>
        {broken && <Guts t={t} side={1} />}
        <PenTail />
      </g>
      <g transform={`translate(${gap} ${drop}) rotate(${bend})`}>
        {beam > 0 && (
          <g>
            <path d={`M304 0 H${304 + beam * beamLen}`} stroke={BEAM} strokeWidth={26} opacity={0.22} strokeLinecap="round" />
            <path d={`M304 0 H${304 + beam * beamLen}`} stroke={BEAM} strokeWidth={9} strokeLinecap="round" />
            <path d={`M304 0 H${304 + beam * beamLen}`} stroke="#FFD4D4" strokeWidth={3} strokeLinecap="round" />
          </g>
        )}
        {broken && <Guts t={t} side={-1} />}
        <PenTip lit={beam} />
      </g>
    </g>
  </svg>
);

/** Shards, a tiny spring and a battery flying out of the break, with gravity. A few pieces only. */
export const Shards: React.FC<{ t: number; at: number; x: number; y: number; n?: number; life?: number }> = ({ t, at, x, y, n = 9, life = 1.25 }) => {
  const dt = t - at;
  if (dt <= 0 || dt > life) return null;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI * (0.08 + 0.84 * random(`sa${i}`));
        const v = 620 + random(`sv${i}`) * 1000;
        const px = x + Math.cos(a) * v * dt;
        const py = y + Math.sin(a) * v * dt + 1500 * dt * dt;
        const r = (random(`sr${i}`) - 0.5) * 1500 * dt;
        const sz = 0.7 + random(`ss${i}`) * 0.9;
        const k = i % 4;
        return (
          <div key={i} style={{ position: "absolute", left: px, top: py, transform: `rotate(${r}deg) scale(${sz})`, opacity: 1 - seg(t, at + life - 0.3, at + life) }}>
            <svg width={1} height={1} viewBox="0 0 1 1" style={{ overflow: "visible" }}>
              {k === 0 && <path d="M0 -24 L22 14 L-18 18 Z" fill={METAL} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />}
              {k === 1 && <path d="M-14 -18 L18 -8 L4 22 Z" fill={METAL_HI} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />}
              {k === 2 && <path d="M-26 0 q6 -16 12 0 t12 0 t12 0 t12 0" fill="none" stroke={P.ink} strokeWidth={6} strokeLinecap="round" />}
              {k === 3 && (
                <g>
                  <rect x={-12} y={-26} width={24} height={52} rx={4} fill={P.lime} stroke={P.ink} strokeWidth={5} />
                  <rect x={-5} y={-33} width={10} height={7} fill={P.ink} />
                </g>
              )}
            </svg>
          </div>
        );
      })}
    </>
  );
};

/** A sharp white-and-ink crack star for the moment of the snap. */
export const SnapFlash: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = seg(t, at, at + 0.22);
  if (t < at || k >= 1) return null;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r = (i % 2 ? 90 : 240) * eo(k) * (0.8 + 0.4 * random(`sf${i}`));
    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg width={1} height={1} viewBox="0 0 1 1" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: 1 - k }}>
      <polygon points={pts} fill={P.card} stroke={P.ink} strokeWidth={8} strokeLinejoin="round" />
    </svg>
  );
};

/** Slow rays turning behind a big moment. */
export const Rays: React.FC<{ t: number; x: number; y: number; r?: number; n?: number; k: number; color?: string }> = ({ t, x, y, r = 1500, n = 14, k, color = P.lime }) => {
  if (k <= 0) return null;
  return (
    <svg width={1} height={1} viewBox="0 0 1 1" style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity: k }}>
      <g transform={`rotate(${t * 9})`}>
        {Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2;
          const w = Math.PI / n / 1.15;
          return <path key={i} d={`M0 0 L${Math.cos(a - w) * r} ${Math.sin(a - w) * r} L${Math.cos(a + w) * r} ${Math.sin(a + w) * r} Z`} fill={color} opacity={0.55} />;
        })}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// 1995: the tunnel, the room, the CRT, the keyboard.

const YEARS = [2026, 2020, 2015, 2010, 2005, 2000, 1995];

/** The camera backs down a timeline: year frames rush past, ending on 1995 straight ahead. `k` is 0 to 1. */
export const YearTunnel: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  const pos = k * (YEARS.length - 1);
  return (
    <div style={{ position: "absolute", inset: 0, background: P.ink, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const ph = (t * 1.6 + random(`ty${i}`)) % 1;
          const r0 = 80 + ph * 1200;
          const r1 = r0 + 90 + ph * 240;
          return <line key={i} x1={540 + Math.cos(a) * r0} y1={800 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={800 + Math.sin(a) * r1} stroke={i % 4 ? P.lime : P.card} strokeWidth={2 + ph * 7} strokeLinecap="round" opacity={0.15 + ph * 0.45} />;
        })}
      </svg>
      {YEARS.map((y, i) => {
        const z = i - pos;
        if (z < -0.28 || z > 4) return null;
        const s = z >= 0 ? 1 / (0.8 + 1.15 * z) : 1.25 * (1 - z * 9);
        const landed = i === YEARS.length - 1;
        const dx = Math.sin(i * 2.3) * 150 * Math.min(1, Math.max(0, z));
        return (
          <div key={y} style={{ ...centre(540 + dx, 800, s), width: 620, height: 400, background: landed ? P.lime : P.paper, border: `8px solid ${P.ink}`, borderRadius: 30, boxShadow: `14px 14px 0 ${landed ? P.card : P.lime}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 210, color: P.ink, opacity: clamp01((z + 0.28) / 0.12) * clamp01((4 - z) / 1.2), fontVariantNumeric: "tabular-nums" }}>
            {y}
          </div>
        );
      })}
    </div>
  );
};

/** The 1995 room, in depth layers. `cx` pans the camera; deeper layers move less. */
export const Room95: React.FC<{ t: number; cx?: number }> = ({ t, cx = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#E8DFCB", overflow: "hidden" }}>
    {/* Wall stripes and window: far layer. */}
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${cx * 0.25}px)` }}>
      <svg width={1400} height={1920} viewBox="0 0 1400 1920" style={{ position: "absolute", left: -160, top: 0 }}>
        {Array.from({ length: 19 }, (_, i) => (
          <rect key={i} x={i * 80} y={0} width={36} height={1250} fill="#E1D6BE" />
        ))}
        <rect x={880} y={372} width={330} height={430} rx={10} fill="#BFE4EA" stroke={P.ink} strokeWidth={8} />
        <path d="M1045 372 V802 M880 587 H1210" stroke={P.ink} strokeWidth={8} />
        <circle cx={1130} cy={462} r={38} fill={P.gold} opacity={0.85} />
      </svg>
    </div>
    {/* Shelf with floppies and a wall calendar: middle layer. */}
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${cx * 0.55}px)` }}>
      <svg width={700} height={700} viewBox="0 0 700 700" style={{ position: "absolute", left: 60, top: 340 }}>
        <rect x={0} y={150} width={430} height={22} fill="#A9855F" stroke={P.ink} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${24 + i * 96} ${54})`}>
            <rect width={86} height={96} rx={6} fill={[P.teal, P.gold, P.pink, P.ink2][i]} stroke={P.ink} strokeWidth={6} />
            <rect x={18} y={0} width={48} height={30} fill={P.lineStrong} stroke={P.ink} strokeWidth={4} />
            <rect x={14} y={52} width={58} height={44} fill={P.card} stroke={P.ink} strokeWidth={4} />
          </g>
        ))}
      </svg>
    </div>
    {/* Desk top: near layer. */}
    <div style={{ position: "absolute", left: -200, right: -200, top: 1240, bottom: 0, background: "#B79268", borderTop: `10px solid ${P.ink}`, transform: `translateX(${cx}px)` }}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 80 + i * 140, height: 6, background: "#A67F56" }} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, height: 200, background: "linear-gradient(rgba(23,23,23,0.16), rgba(23,23,23,0))" }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(closest-side at 50% 42%, rgba(255,255,255,${0.16 + 0.03 * Math.sin(t * 3)}), rgba(255,255,255,0))` }} />
  </div>
);

/** The front of the desk, drawn again over anyone standing behind it. */
export const DeskFront: React.FC<{ top?: number; cx?: number }> = ({ top = 1240, cx = 0 }) => (
  <div style={{ position: "absolute", left: -200, right: -200, top, bottom: 0, background: "#B79268", borderTop: `10px solid ${P.ink}`, transform: `translateX(${cx}px)` }}>
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 80 + i * 140, height: 6, background: "#A67F56" }} />
    ))}
  </div>
);

/** A beige 1990s monitor; children fill the screen. */
export const Crt: React.FC<{ w: number; t: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ w, t, children, style }) => {
  const h = Math.round(w * 0.8);
  const screenInset = Math.round(w * 0.07);
  return (
    <div style={{ width: w, height: h + 90, position: "relative", ...style }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, boxSizing: "border-box", background: "#DCD4BF", border: `7px solid ${P.ink}`, borderRadius: 34, boxShadow: `inset -14px -14px 0 #C4BBA3, inset 10px 10px 0 #EEE8D8, ${shadow.soft}` }}>
        <div style={{ position: "absolute", left: screenInset, right: screenInset, top: screenInset, bottom: screenInset + 26, background: "#101412", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden" }}>
          {children}
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.11) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />
          <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 70px rgba(0,0,0,0.42)", borderRadius: 20 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: `${((t * 0.32) % 1) * 100}%`, height: 46, background: "linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.08), rgba(255,255,255,0))" }} />
        </div>
        <div style={{ position: "absolute", right: 44, bottom: 15, width: 15, height: 15, borderRadius: 15, background: "#6EDC6E", border: `3px solid ${P.ink}` }} />
        <div style={{ position: "absolute", left: 50, bottom: 15, width: 96, height: 10, borderRadius: 6, background: "#C4BBA3" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: h - 6, width: w * 0.34, height: 46, transform: "translateX(-50%)", background: "#CFC7B1", border: `7px solid ${P.ink}`, borderTop: "none" }} />
      <div style={{ position: "absolute", left: "50%", top: h + 34, width: w * 0.56, height: 34, transform: "translateX(-50%)", background: "#DCD4BF", border: `7px solid ${P.ink}`, borderRadius: 14 }} />
    </div>
  );
};

/** A chunky keyboard; `press` lights a random key per beat while someone types. */
export const Keyboard: React.FC<{ w: number; t: number; typing?: boolean }> = ({ w, t, typing = false }) => {
  const lit = typing ? Math.floor(t * 14) : -1;
  const s = w / 840;
  return (
    <svg width={w} height={250 * s} viewBox="0 0 840 250">
      <rect x={4} y={4} width={832} height={240} rx={24} fill="#DCD4BF" stroke={P.ink} strokeWidth={7} />
      <rect x={4} y={204} width={832} height={40} rx={18} fill="#C4BBA3" />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 14 - (r === 3 ? 4 : 0) }, (_, c) => {
          const w2 = r === 3 && c === 4 ? 230 : 50;
          const x = 26 + c * 57 + (r === 3 && c > 4 ? 170 : 0) + r * 6;
          const on = lit >= 0 && Math.floor(random(`k${r}${c}`) * 40) === lit % 40;
          return <rect key={`${r}${c}`} x={x} y={22 + r * 46} width={w2} height={38} rx={7} fill={on ? P.lime : "#F1ECDE"} stroke={P.ink} strokeWidth={4} />;
        }),
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The reconstructed AuctionWeb page. Drawn by us, never the real page, and always labelled as a reconstruction.

export const ReconTag: React.FC<{ style?: React.CSSProperties; text?: string }> = ({ style, text = "Reconstruction · not the real page" }) => (
  <div style={{ position: "absolute", ...type.label, fontSize: 19, letterSpacing: "0.08em", color: P.ink, background: P.gold, border: `3px solid ${P.ink}`, borderRadius: 8, padding: "5px 12px", whiteSpace: "nowrap", ...style }}>{text}</div>
);

const SERIF = "'Times New Roman', Times, serif";

/** A grey 1995 web page: a serif heading, blue links, and one line for the listing. `row` reveals that line. */
export const OldPage: React.FC<{ row?: number; pick?: number }> = ({ row = 0, pick = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#C8C8C8", fontFamily: SERIF, color: "#000" }}>
    <div style={{ height: 40, background: "#0F2F7A", display: "flex", alignItems: "center", padding: "0 14px", color: "#fff", fontFamily: "Arial, sans-serif", fontWeight: 700, fontSize: 22 }}>
      AuctionWeb
      <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 22, height: 20, background: "#C8C8C8", border: "2px solid #fff", borderRightColor: "#444", borderBottomColor: "#444" }} />
        ))}
      </div>
    </div>
    <div style={{ padding: "16px 24px" }}>
      <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1 }}>AuctionWeb</div>
      <div style={{ fontSize: 30, marginTop: 6 }}>Auction listings</div>
      <div style={{ borderTop: "3px solid #777", borderBottom: "1px solid #fff", margin: "14px 0" }} />
      <div style={{ fontSize: 32, color: "#0000C8", textDecoration: "underline", opacity: clamp01(row), background: pick > 0 ? `rgba(255,240,120,${pick})` : "transparent" }}>Broken laser pointer</div>
    </div>
  </div>
);

/** The small pixel-style picture of the pointer used on the listing card. */
const PenThumb: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ width: 230, height: 190, border: `4px solid ${P.ink}`, borderRadius: 12, background: P.paper2, position: "relative", overflow: "hidden", flexShrink: 0 }}>
    <div style={{ position: "absolute", left: 115, top: 96, transform: "rotate(-20deg)" }}>
      <LaserPen s={0.3} gap={13} bend={9} broken t={t} />
    </div>
  </div>
);

export const ListingCard: React.FC<{ t: number; w?: number; price?: React.ReactNode; broken?: number }> = ({ t, w = 800, price, broken = 1 }) => (
  <div style={{ width: w, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: `${shadow.hard(10)}, ${shadow.soft}`, padding: "26px 30px 30px", boxSizing: "border-box", position: "relative" }}>
    <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>AuctionWeb · listing · 1995</div>
    <div style={{ display: "flex", gap: 26, marginTop: 16, alignItems: "center" }}>
      <PenThumb t={t} />
      <div>
        <div style={{ ...type.display, fontSize: 58, color: P.ink }}>
          Broken
          <br />
          laser pointer
        </div>
        <div style={{ display: "inline-block", marginTop: 14, ...type.label, fontSize: 24, color: P.card, background: P.ink, borderRadius: 8, padding: "6px 14px", transform: `scale(${broken})` }}>Condition: broken</div>
      </div>
    </div>
    {price}
  </div>
);

// ---------------------------------------------------------------------------------------------------------------
// The price and the stamp.

/** One flip digit: cycles quickly, then settles on `ch` at time `at`. */
const Flap: React.FC<{ t: number; at: number; ch: string; w: number; h: number; from: number }> = ({ t, at, ch, w, h, from }) => {
  const done = t >= at;
  const k = done ? eo(seg(t, at, at + 0.18)) : 0;
  const shown = done ? ch : t < from ? "0" : "0123456789"[Math.floor(random(`fl${ch}${Math.floor(t * 18)}`) * 10)];
  return (
    <div style={{ position: "relative", width: w, height: h, background: P.ink, borderRadius: 18, border: `5px solid ${P.ink}`, boxShadow: done ? `6px 6px 0 ${P.lime}` : "none", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - k) * (done ? -18 : 0)}px) scale(${1 + 0.14 * Math.sin(k * Math.PI)})`, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ ...type.display, fontSize: h * 0.82, color: done ? P.lime : P.card, fontVariantNumeric: "tabular-nums", letterSpacing: 0 }}>{shown}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, marginTop: -1, background: "rgba(0,0,0,0.6)" }} />
    </div>
  );
};

/** $14.83 on flip digits: they spin from `from`, and each digit lands on its own time. */
export const PriceBoard: React.FC<{ t: number; from: number; ats: [number, number, number, number]; h?: number }> = ({ t, from, ats, h = 210 }) => {
  const digits = ["1", "4", "8", "3"];
  const w = h * 0.72;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ ...type.display, fontSize: h * 0.82, color: P.ink }}>$</div>
      <Flap t={t} from={from} at={ats[0]} ch={digits[0]} w={w} h={h} />
      <Flap t={t} from={from} at={ats[1]} ch={digits[1]} w={w} h={h} />
      <div style={{ ...type.display, fontSize: h * 0.82, color: P.ink, alignSelf: "flex-end", lineHeight: 0.9 }}>.</div>
      <Flap t={t} from={from} at={ats[2]} ch={digits[2]} w={w} h={h} />
      <Flap t={t} from={from} at={ats[3]} ch={digits[3]} w={w} h={h} />
    </div>
  );
};

/** The rubber stamp. Slams from 3x; `p` is a spring from the scene. */
export const SoldStamp: React.FC<{ p: number; size?: number; rotate?: number }> = ({ p, size = 170, rotate = -11 }) => {
  if (p <= 0) return null;
  const c = "#D8344B";
  return (
    <div style={{ transform: `rotate(${rotate}deg) scale(${lerp(3, 1, Math.min(1, p))})`, opacity: Math.min(1, p * 3), border: `${size * 0.07}px solid ${c}`, borderRadius: size * 0.16, padding: `${size * 0.02}px ${size * 0.24}px`, color: c, background: "rgba(255,255,255,0.86)", fontFamily: sans, fontWeight: 700, fontSize: size, letterSpacing: "0.04em", lineHeight: 1.05, boxShadow: `inset 0 0 0 ${size * 0.02}px rgba(216,52,75,0.45)` }}>
      SOLD
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------------------
// The calendar: years flip quickly from 1995 to 2015, slowing into the landing.

export const FlipCalendar: React.FC<{ t: number; a: number; b: number; w?: number }> = ({ t, a, b, w = 620 }) => {
  const k = Math.pow(clamp01((t - a) / (b - a)), 0.6);
  const pos = k * 20;
  const year = 1995 + Math.floor(pos);
  const frac = pos - Math.floor(pos);
  const h = w * 0.82;
  const face = (y: number): React.CSSProperties => ({ position: "absolute", inset: 0, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: w * 0.34, color: P.ink, fontVariantNumeric: "tabular-nums" });
  return (
    <div style={{ width: w, height: h, position: "relative", perspective: 3200 }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: -34, display: "flex", justifyContent: "space-between", zIndex: 3 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 26, height: 70, borderRadius: 13, background: P.lineStrong, border: `5px solid ${P.ink}` }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 14, right: -14, top: 14, bottom: -14, background: P.ink, borderRadius: 24 }} />
      <div style={face(year)}>{Math.min(2015, k >= 1 ? 2015 : year + 1)}</div>
      {k < 1 && (
        <div style={{ ...face(year), transformOrigin: "50% 0%", transform: `rotateX(${frac * 96}deg)`, opacity: 1 - seg(frac, 0.8, 1) }}>{year}</div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 74, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: "24px 24px 0 0", ...type.label, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", color: P.ink, zIndex: 2 }} />
    </div>
  );
};

