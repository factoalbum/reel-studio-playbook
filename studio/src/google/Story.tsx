import React from "react";
import { random } from "remotion";
import { Burst, Pointer, ClickRing, Sticker } from "../brand/Bits";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { C } from "../episodes/google";
import { DollarCoin, eo, Eyebrow, go, lerp, pop, seg, vis, Window } from "../mdh/kit";
import { Stopwatch } from "./Ending";
import { Cross, FigFace, FigPose, Figure, ReconTag, SANMAY, SearchBox, ShopButton, ShopHeader, Tick } from "./kit";

/**
 * The first half of the google.com reel: the hook, the rewind to 29 September 2015, the reconstructed search and
 * checkout, "Payment successful", and the order cancelled about a minute later. All times come from src/episodes/google.ts.
 */

type S = { t: number };
const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) ${extra}` });

// =================================================================================================================
// 1. The impossible purchase (0 to 8.4 s): google.com floats in a deep lime-lit space, a $12 tag swings in, SOLD.

/** A perspective floor of lime lines rushing towards the camera, with floating specks: the "digital space". */
export const DeepSpace: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  const hz = 760;
  const rows = Array.from({ length: 14 }, (_, i) => {
    const z = ((i + (t * 0.9) % 1) / 14) ** 2.2;
    return hz + z * 1300;
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      <div style={{ position: "absolute", left: -300, top: 180, width: 1680, height: 1300, background: "radial-gradient(closest-side, rgba(200,241,105,0.42), rgba(200,241,105,0))" }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.paper} stopOpacity={1} />
            <stop offset="1" stopColor={P.limeWash} stopOpacity={1} />
          </linearGradient>
        </defs>
        <rect x={0} y={hz} width={1080} height={1920 - hz} fill="url(#g-floor)" />
        {Array.from({ length: 17 }, (_, i) => {
          const x = -1400 + i * 245;
          return <line key={i} x1={540} y1={hz} x2={x} y2={2100} stroke={P.oliveSoft} strokeWidth={2.5} opacity={0.35} />;
        })}
        {rows.map((y, i) => (
          <line key={i} x1={0} y1={y} x2={1080} y2={y} stroke={P.oliveSoft} strokeWidth={1 + (y - hz) / 300} opacity={0.12 + 0.3 * ((y - hz) / 1300)} />
        ))}
        <line x1={0} y1={hz} x2={1080} y2={hz} stroke={P.lime} strokeWidth={6} />
      </svg>
      {Array.from({ length: 22 }, (_, i) => {
        const depth = 0.4 + random(`gd${i}`) * 0.9;
        const x = (random(`gx${i}`) * 1300 - 110 + t * 18 * depth) % 1200;
        const y = 340 + random(`gy${i}`) * 820 + Math.sin(t * 0.8 + i) * 14 * depth;
        const s = 6 + depth * 9;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: 3, background: i % 3 ? P.ink : P.lime, border: i % 3 ? "none" : `2px solid ${P.ink}`, opacity: 0.18 + depth * 0.2, transform: `rotate(${t * 40 * depth + i * 20}deg)` }} />;
      })}
    </div>
  );
};

/** The giant address bar: google.com as a domain name (no logo, our own type). */
export const DomainPill: React.FC<{ t: number; w?: number; sold?: number }> = ({ t, w = 860, sold = 0 }) => (
  <div style={{ position: "relative", width: w, height: 190, borderRadius: 95, background: P.card, border: `7px solid ${P.ink}`, boxShadow: `${shadow.hard(10)}, 0 60px 80px rgba(23,23,23,0.18)`, display: "flex", alignItems: "center", padding: "0 50px", boxSizing: "border-box", gap: 30 }}>
    <svg width={64} height={74} viewBox="0 0 32 37">
      <rect x={3} y={15} width={26} height={20} rx={5} fill={P.lime} stroke={P.ink} strokeWidth={3} />
      <path d="M9 15 V10 a7 7 0 0 1 14 0 V15" fill="none" stroke={P.ink} strokeWidth={3.4} />
    </svg>
    <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 112, color: P.ink, letterSpacing: "-0.02em" }}>google.com</div>
    {Math.floor(t * 2.2) % 2 === 0 && sold <= 0 && <div style={{ width: 6, height: 104, background: P.ink, marginLeft: -24 }} />}
  </div>
);

const PriceTag: React.FC<{ t: number; fade: number }> = ({ t, fade }) => {
  const p = pop(t, C.tagAt, { damping: 6, stiffness: 120, mass: 0.8 });
  if (p <= 0 || fade >= 1) return null;
  // Hangs from the bar on a string and swings, settling slowly; the price always reads upright.
  const swing = 22 * Math.exp(-(t - C.tagAt) * 1.3) * Math.sin((t - C.tagAt) * 7) + 3 * Math.sin(t * 1.7);
  return (
    <div style={{ position: "absolute", left: 690, top: 168, opacity: 1 - fade, transform: `rotate(${swing}deg) scale(${Math.min(1.05, p)})`, transformOrigin: "0px 0px" }}>
      <svg width={1} height={1} viewBox="0 0 1 1" style={{ overflow: "visible" }}>
        <path d="M0 0 L0 74" stroke={P.ink} strokeWidth={5} />
        <path d="M0 58 L74 108 L74 250 L-74 250 L-74 108 Z" fill={P.gold} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={0} cy={98} r={12} fill={P.paper} stroke={P.ink} strokeWidth={5} />
        <text x={0} y={212} textAnchor="middle" fontFamily={sans} fontWeight={700} fontSize={84} fill={P.ink} letterSpacing={-3}>
          $12
        </text>
      </svg>
    </div>
  );
};

const Building: React.FC = () => (
  <svg width={120} height={120} viewBox="0 0 60 60">
    <rect x={12} y={8} width={36} height={48} rx={3} fill={P.paper2} stroke={P.ink} strokeWidth={3.5} />
    {[16, 26, 36].map((y) => [20, 34].map((x) => <rect key={`${x}${y}`} x={x} y={y} width={7} height={6} rx={1} fill={P.ink} />))}
    <rect x={26} y={46} width={9} height={10} fill={P.ink} />
  </svg>
);
const Globe: React.FC = () => (
  <svg width={120} height={120} viewBox="0 0 60 60">
    <circle cx={30} cy={30} r={22} fill={P.limeSoft} stroke={P.ink} strokeWidth={3.5} />
    <ellipse cx={30} cy={30} rx={10} ry={22} fill="none" stroke={P.ink} strokeWidth={3} />
    <path d="M9 23 H51 M9 37 H51" stroke={P.ink} strokeWidth={3} />
  </svg>
);

const VsCard: React.FC<{ t: number; at: number; x: number; title: string; label: string; good: boolean; children: React.ReactNode }> = ({ t, at, x, title, label, good, children }) => {
  const p = pop(t, at, { damping: 10, stiffness: 180 });
  if (p <= 0) return null;
  const strike = !good ? go(t, C.strikeAt, C.strikeAt + 0.25) : 0;
  const win = good ? pop(t, C.domainAt, { damping: 8, stiffness: 220 }) : 0;
  return (
    <div style={{ ...centre(x, 960, Math.min(1.05, p) * (good ? 1 + 0.08 * Math.min(1, win) : 1 - 0.08 * strike)), width: 400, height: 300, background: good && win > 0 ? P.lime : P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: 1 - 0.45 * strike }}>
      {children}
      <div style={{ fontFamily: good ? mono : sans, fontWeight: 700, fontSize: 48, color: P.ink }}>{title}</div>
      <div style={{ ...type.label, fontSize: 20, color: P.ink, marginTop: 6 }}>{label}</div>
      {strike > 0 && <div style={{ position: "absolute", width: 360, height: 14, background: P.ink, borderRadius: 7, transform: `rotate(-24deg) scaleX(${strike})` }} />}
      {win > 0 && (
        <div style={{ position: "absolute", right: -26, top: -30, transform: `scale(${Math.min(1.1, win)})` }}>
          <Tick size={88} k={seg(t, C.domainAt + 0.05, C.domainAt + 0.4)} color={P.card} />
        </div>
      )}
    </div>
  );
};

export const Hook: React.FC<S> = ({ t }) => {
  if (t > C.rewindAt + 0.6) return null;
  const leave = go(t, C.jokeAt + 0.6, C.rewindAt + 0.4);
  const push = lerp(0.9, 1.04, eo(seg(t, 0, C.companyAt))) * (1 + 0.04 * Math.sin(Math.PI * Math.min(1, pop(t, C.soldAt, { damping: 8, stiffness: 220 }))));
  const shake = t > C.soldAt && t < C.soldAt + 0.35 ? Math.sin(t * 95) * 12 * (1 - seg(t, C.soldAt, C.soldAt + 0.35)) : 0;
  const lift = go(t, C.companyAt - 0.2, C.companyAt + 0.3);
  const sold = pop(t, C.soldAt, { damping: 8, stiffness: 240 });
  const real = pop(t, C.jokeAt + 0.1, { damping: 8, stiffness: 240 });
  const tilt = 9 * Math.sin(t * 0.7) * (1 - lift * 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - seg(leave, 0.6, 1), transform: `scale(${1 + leave * 0.5})`, filter: `blur(${leave * 8}px)` }}>
      <DeepSpace t={t} k={1} />
      <div style={{ position: "absolute", left: 0, top: 336, width: 1080, display: "flex", justifyContent: "center" }}>
        <Eyebrow text="Internet Stories · Ep 2" dot t={t} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, perspective: 1600 }}>
        <div style={{ ...centre(540 + shake, lerp(640, 560, lift) - shake * 0.4, push * lerp(1, 0.86, lift), `rotateY(${tilt}deg) rotateX(${lerp(8, 2, eo(seg(t, 0, 2)))}deg)`), transformStyle: "preserve-3d" }}>
          <DomainPill t={t} sold={sold} />
          <PriceTag t={t} fade={lift} />
          {sold > 0 && (
            <div style={{ ...centre(300, 4, Math.min(1.25, sold) * (1 + 0.5 * Math.max(0, 1 - (t - C.soldAt) * 6)), "rotate(-12deg)"), border: `8px solid ${P.pink}`, color: P.pink, background: "rgba(255,255,255,0.9)", borderRadius: 16, padding: "4px 26px", ...type.label, letterSpacing: "0.08em", fontSize: 66, whiteSpace: "nowrap" }}>
              Sold!
            </div>
          )}
          {real > 0 && (
            <div style={{ ...centre(640, 230, Math.min(1.2, real), "rotate(8deg)"), width: 200, height: 200, borderRadius: 200, border: `8px solid ${P.ink}`, background: P.lime, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...type.label, fontSize: 30, letterSpacing: "0.06em", color: P.ink, textAlign: "center", lineHeight: 1.1 }}>
              True
              <br />
              story
            </div>
          )}
        </div>
        {/* A label under the bar, so it is clear this is a website address, not the company. */}
        <div style={{ ...centre(540, lerp(800, 700, lift)), opacity: seg(t, C.domainWord, C.domainWord + 0.3) * (1 - lift), ...type.label, fontSize: 26, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "8px 22px", whiteSpace: "nowrap" }}>
          The domain · the website address
        </div>
      </div>
      <VsCard t={t} at={C.companyAt} x={290} title="Google" label="The company" good={false}>
        <Building />
      </VsCard>
      <VsCard t={t} at={C.companyAt + 0.35} x={790} title="google.com" label="Its domain" good>
        <Globe />
      </VsCard>
      <Burst t={t} at={C.soldAt} x={540} y={640} r={300} />
    </div>
  );
};

// =================================================================================================================
// 2. 29 September 2015 (8.4 to 19.6 s): rewind, the night, Sanmay at his desk, then into the screen.

export const Rewind: React.FC<S> = ({ t }) => {
  const k = vis(t, C.rewindAt - 0.1, C.nightAt + 0.3, 0.25, 0.4);
  if (k <= 0) return null;
  const yk = eo(seg(t, C.rewindAt + 0.1, C.yearLand));
  const year = Math.round(lerp(2026, 2015, yk));
  const land = pop(t, C.yearLand, { damping: 8, stiffness: 240 });
  const real = pop(t, C.realAt, { damping: 10, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      <div style={{ position: "absolute", inset: 0, background: P.paper2 }} />
      {/* Rewind: speed lines pull inwards, like tape winding back. */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {Array.from({ length: 44 }, (_, i) => {
          const a = (i / 44) * Math.PI * 2 + random(`ra${i}`) * 0.1;
          const ph = 1 - ((t * 1.8 + random(`rp${i}`)) % 1);
          const r1 = 1100 * ph + 120;
          const r0 = r1 * 0.7;
          return <line key={i} x1={540 + Math.cos(a) * r0} y1={760 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={760 + Math.sin(a) * r1} stroke={i % 5 ? P.ink : P.oliveSoft} strokeWidth={6} strokeLinecap="round" opacity={0.22 * (1 - ph) * (1 - seg(t, C.yearLand, C.yearLand + 0.6) * 0.7)} />;
        })}
      </svg>
      <div style={{ ...centre(540, 520), display: "flex", alignItems: "center", gap: 14, opacity: 1 - seg(t, C.yearLand - 0.1, C.yearLand + 0.1) }}>
        <svg width={90} height={60} viewBox="0 0 90 60">
          <path d="M44 6 L6 30 L44 54 Z M84 6 L46 30 L84 54 Z" fill={P.ink} />
        </svg>
        <div style={{ ...type.label, fontSize: 34, color: P.ink }}>Rewind</div>
      </div>
      <div style={{ ...centre(540, 760, 1 + 0.1 * Math.sin(Math.min(1, land) * Math.PI)), ...type.display, fontSize: 290, color: P.ink, fontVariantNumeric: "tabular-nums", filter: `blur(${yk < 1 ? 3 : 0}px)` }}>{year}</div>
      {real > 0 && (
        <div style={{ ...centre(540, 960, Math.min(1.1, real)) }}>
          <Sticker size={56} tone="lime" rotate={-3}>
            Asli kahani
          </Sticker>
        </div>
      )}
    </div>
  );
};

const NightRoom: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
    <rect x={-400} y={-200} width={1880} height={2400} fill="#E9E1D0" />
    {Array.from({ length: 24 }, (_, i) => (
      <rect key={i} x={-400 + i * 80} y={-200} width={36} height={1440} fill="#E3D9C5" />
    ))}
    {/* Night window with a city skyline. */}
    <rect x={70} y={380} width={380} height={400} rx={12} fill="#22304A" stroke={P.ink} strokeWidth={8} />
    <circle cx={350} cy={460} r={36} fill="#F3E9C6" />
    {[
      [100, 620, 60, 160],
      [170, 580, 50, 200],
      [230, 650, 70, 130],
      [310, 600, 46, 180],
      [366, 660, 70, 120],
    ].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#14203A" />
        {Array.from({ length: 6 }, (_, j) => (
          <rect key={j} x={x + 10 + (j % 2) * 20} y={y + 16 + Math.floor(j / 2) * 34} width={10} height={14} fill="#F3E9C6" opacity={random(`wl${i}${j}`) > 0.45 ? 0.5 + 0.4 * Math.sin(t * 2 + i + j) : 0.08} />
        ))}
      </g>
    ))}
    <line x1={260} y1={380} x2={260} y2={780} stroke={P.ink} strokeWidth={8} />
    {/* Calendar: September 2015, the 29th circled. */}
    <g transform="translate(640 360) rotate(2)">
      <rect width={300} height={270} rx={14} fill={P.card} stroke={P.ink} strokeWidth={7} />
      <rect width={300} height={70} rx={14} fill={P.ink} />
      <text x={150} y={48} textAnchor="middle" fontFamily={mono} fontWeight={600} fontSize={34} letterSpacing={3} fill={P.lime}>
        SEP 2015
      </text>
      {Array.from({ length: 30 }, (_, i) => (
        <text key={i} x={30 + (i % 7) * 40} y={104 + Math.floor(i / 7) * 34} textAnchor="middle" fontFamily={mono} fontWeight={600} fontSize={20} fill={i === 28 ? P.ink : P.ink3}>
          {i + 1}
        </text>
      ))}
      <circle cx={30 + (28 % 7) * 40} cy={98 + Math.floor(28 / 7) * 34} r={21} fill="none" stroke={P.pink} strokeWidth={6} />
    </g>
  </svg>
);

const Monitor: React.FC<{ t: number }> = ({ t }) => {
  const on = seg(t, C.domainsAt - 0.1, C.domainsAt + 0.2);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* Desk. */}
      <rect x={-60} y={1036} width={1200} height={40} rx={8} fill="#CFA172" stroke={P.ink} strokeWidth={7} />
      <rect x={-60} y={1072} width={1200} height={900} fill="#B8875A" stroke={P.ink} strokeWidth={7} />
      {/* A 2015 flat monitor, turned towards us so we can see the screen. */}
      <rect x={250} y={990} width={70} height={46} fill="#9A9A96" stroke={P.ink} strokeWidth={6} />
      <rect x={200} y={1026} width={170} height={16} rx={6} fill="#9A9A96" stroke={P.ink} strokeWidth={6} />
      <rect x={70} y={740} width={430} height={260} rx={16} fill="#2A2A2A" stroke={P.ink} strokeWidth={7} />
      <rect x={86} y={756} width={398} height={228} rx={8} fill={on > 0 ? "#FFFFFF" : "#3A4A60"} />
      {on > 0 && (
        <g opacity={on}>
          <rect x={86} y={756} width={398} height={34} fill={P.paper2} />
          <text x={104} y={780} fontFamily={sans} fontWeight={700} fontSize={18} fill={P.ink}>
            Google Domains
          </text>
          <rect x={120} y={820} width={330} height={44} rx={22} fill={P.card} stroke={P.ink} strokeWidth={4} />
          <rect x={140} y={836} width={(150 * (Math.sin(t * 3) + 1)) / 2 + 20} height={12} rx={6} fill={P.lineStrong} />
          {[890, 924].map((y) => (
            <rect key={y} x={120} y={y} width={330} height={24} rx={8} fill={P.paper2} />
          ))}
        </g>
      )}
      {/* Glow from the screen. */}
      <ellipse cx={285} cy={870} rx={360} ry={260} fill={P.lime} opacity={0.1 + 0.08 * on} />
      {/* Mug and lamp. */}
      <rect x={560} y={985} width={50} height={56} rx={8} fill={P.lime} stroke={P.ink} strokeWidth={6} />
      <path d="M610 998 q22 0 22 16 q0 14 -22 14" fill="none" stroke={P.ink} strokeWidth={6} />
      <path d="M1010 1036 L990 870 L915 800" fill="none" stroke={P.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M880 780 L960 770 L940 830 Z" fill={P.ink} />
      <path d="M925 820 L760 1040 L1080 1040 L1010 820 Z" fill="#FFF3C4" opacity={0.4} />
    </svg>
  );
};

export const Night: React.FC<S> = ({ t }) => {
  if (t < C.nightAt - 0.3 || t > C.shopAt + 0.5) return null;
  const inK = seg(t, C.nightAt - 0.3, C.nightAt + 0.2);
  // Camera: starts on the calendar, pulls back to show Sanmay, drifts, then dives into the monitor.
  const pull = go(t, C.nightAt + 0.6, C.nameAt);
  const dive = go(t, C.diveAt, C.shopAt);
  const sBase = lerp(1.9, 1.0, pull) * lerp(1, 1.05, go(t, C.nameAt, C.diveAt)) * lerp(1, 6.5, Math.pow(dive, 1.6));
  const fx = lerp(lerp(790, 560, pull), 285, dive);
  const fy = lerp(lerp(500, 860, pull), 870, dive);
  const cam = (depth: number): React.CSSProperties => {
    const s = 1 + (sBase - 1) * depth;
    return { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${540 - fx * s}px, ${900 - fy * s}px) scale(${s})` };
  };
  const sIn = pop(t, C.nameAt - 0.6, { damping: 13, stiffness: 140 });
  const pose: FigPose = t >= C.domainsAt ? "lean" : t >= C.exGoogleAt ? "look" : "type";
  const face: FigFace = t >= C.domainsAt ? "curious" : "calm";
  const name = pop(t, C.nameAt, { damping: 10, stiffness: 190 });
  const ex = pop(t, C.exGoogleAt, { damping: 10, stiffness: 190 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: inK, overflow: "hidden" }}>
      <div style={cam(0.85)}>
        <NightRoom t={t} />
      </div>
      <div style={cam(1)}>
        <div style={{ position: "absolute", left: 700 - 220, top: 900 - 300 + (1 - Math.min(1, sIn)) * 300, width: 440, height: 580 }}>
          <Figure look={SANMAY} pose={pose} face={face} t={t} blink={[15.2, 17.2].some((b) => Math.abs(t - b) < 0.06)} />
        </div>
        <Monitor t={t} />
      </div>
      {/* Night: the room is dim, lit by the screen. */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 35% 48%, rgba(23,23,23,0) 0%, rgba(23,23,23,0.42) 70%)", opacity: 1 - dive }} />
      {name > 0 && (
        <div style={{ position: "absolute", left: 96, top: 430, display: "flex", flexDirection: "column", alignItems: "flex-start", transform: `scale(${Math.min(1.1, name)}) rotate(-3deg)`, transformOrigin: "0 50%", opacity: 1 - seg(t, C.diveAt - 0.2, C.diveAt + 0.2) }}>
          <Sticker size={58} tone="ink" rotate={0}>
            Sanmay Ved
          </Sticker>
          {ex > 0 && <div style={{ marginTop: 12, ...type.label, fontSize: 22, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "6px 12px", transform: `scale(${Math.min(1.1, ex)})`, transformOrigin: "0 50%" }}>Ex-Google employee</div>}
          <div style={{ marginTop: 6, ...type.body, fontSize: 18, color: P.ink, background: P.card, borderRadius: 8, padding: "2px 10px" }}>Illustration</div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: seg(t, C.shopAt - 0.3, C.shopAt) * (1 - seg(t, C.shopAt, C.shopAt + 0.4)) }} />
    </div>
  );
};

// =================================================================================================================
// 3 and 4. The shop (19.5 to 42.6 s): search, AVAILABLE $12, checkout, payment successful, the domain in his
// account for about a minute, then ORDER CANCELLED and the refund. One reconstructed window, with a moving camera.

// Sanmay stands below the window's bottom-right corner, and his thought bubble sits between the window and the captions.
const WIN = { x: 60, y: 345, w: 960, h: 590 };

const Spinner: React.FC<{ t: number; size: number }> = ({ t, size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${t * 520}deg)` }}>
    <circle cx={20} cy={20} r={15} fill="none" stroke={P.line} strokeWidth={6} />
    <path d="M20 5 A15 15 0 0 1 35 20" fill="none" stroke={P.ink} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

const Chip: React.FC<{ text: string; bg: string; k?: number }> = ({ text, bg, k = 1 }) => (
  <div style={{ ...type.label, fontSize: 24, color: P.ink, background: bg, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "8px 18px", transform: `scale(${k})`, whiteSpace: "nowrap" }}>{text}</div>
);

/** Seconds as owner, shown as 00:SS (about a minute, not an exact count). */
const ownedFor = (t: number) => {
  const k = seg(t, C.successAt, C.cancelAt - 0.4);
  return Math.min(60, Math.round(60 * (0.12 * k + 0.88 * Math.pow(k, 2.2))));
};

const ShopContent: React.FC<{ t: number }> = ({ t }) => {
  const result = pop(t, C.screenAt, { damping: 12, stiffness: 170 });
  const avail = pop(t, C.availableAt, { damping: 8, stiffness: 240 });
  const price = pop(t, C.priceAt + 0.15, { damping: 9, stiffness: 220 });
  const dollar = pop(t, C.dollarAt, { damping: 7, stiffness: 260 });
  const checkout = t >= C.buyClick + 0.15;
  const paying = t >= C.payClick + 0.05;
  const success = t >= C.successAt;
  const account = t >= C.accountAt;
  const cancelled = t >= C.cancelAt;
  const sk = pop(t, C.successAt, { damping: 8, stiffness: 200 });
  const ak = pop(t, C.accountAt, { damping: 11, stiffness: 180 });
  const ck = pop(t, C.cancelAt, { damping: 7, stiffness: 260 });
  const refund = pop(t, C.refundAt, { damping: 9, stiffness: 220 });
  const pad: React.CSSProperties = { position: "absolute", left: 36, right: 36 };
  return (
    <>
      <ShopHeader />
      {!account && (
        <>
          <div style={{ ...pad, top: 112, ...type.display, fontSize: 40, color: P.ink }}>{success ? "" : checkout ? "Checkout" : "Find a domain"}</div>
          {!checkout && (
            <div style={{ ...pad, top: 178 }}>
              <SearchBox text="google.com" typed={seg(t, C.typeFrom, C.typeTo)} t={t} />
            </div>
          )}
        </>
      )}
      {/* Search result: google.com, Available, $12. */}
      {result > 0 && !checkout && (
        <div style={{ ...pad, top: 320, height: 180, transform: `translateY(${(1 - Math.min(1, result)) * 40}px)`, opacity: Math.min(1, result * 1.5), background: avail > 0 ? P.limeWash : P.card, border: `4px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(7), display: "flex", alignItems: "center", padding: "0 30px", gap: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 52, color: P.ink }}>google.com</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {avail <= 0 ? (
                <>
                  <Spinner t={t} size={34} />
                  <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>Checking…</div>
                </>
              ) : (
                <Chip text="Available" bg={P.lime} k={Math.min(1.15, avail)} />
              )}
            </div>
          </div>
          {price > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, transform: `scale(${Math.min(1.1, price)})` }}>
              <div style={{ ...type.display, fontSize: 76, color: P.ink, transform: `scale(${1 + 0.18 * Math.sin(Math.min(1, dollar) * Math.PI)})` }}>
                $12<span style={{ fontSize: 30, color: P.ink3 }}>/yr</span>
              </div>
              <ShopButton label="Buy" size={30} press={seg(t, C.buyClick - 0.08, C.buyClick + 0.1)} />
            </div>
          )}
        </div>
      )}
      {/* Checkout. */}
      {checkout && !success && (
        <div style={{ ...pad, top: 186, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(7), padding: "26px 30px", boxSizing: "border-box" }}>
          <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>Order summary</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 44, color: P.ink }}>google.com</div>
            <div style={{ ...type.display, fontSize: 44, color: P.ink }}>$12.00</div>
          </div>
          <div style={{ ...type.body, fontSize: 24, color: P.ink2, marginTop: 6 }}>1 year registration</div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 20, marginTop: 26 }}>
            {paying && <Spinner t={t} size={52} />}
            <ShopButton label={paying ? "Processing…" : "Purchase"} size={34} press={seg(t, C.payClick - 0.08, C.payClick + 0.1)} tone={paying ? "ink" : "lime"} />
          </div>
        </div>
      )}
      {/* Payment successful: the big reveal. */}
      {success && !account && (
        <div style={{ ...pad, top: 104, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${Math.min(1.08, sk)})` }}>
          <Tick size={150} k={seg(t, C.successAt + 0.05, C.successAt + 0.45)} />
          <div style={{ ...type.display, fontSize: 80, color: P.ink, marginTop: 14, textAlign: "center", lineHeight: 0.98 }}>
            Payment
            <br />
            successful
          </div>
          <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 32, color: P.ink2, marginTop: 14 }}>google.com · $12.00</div>
        </div>
      )}
      {/* His account: google.com is in it, for about a minute. */}
      {account && (
        <div style={{ ...pad, top: 112, transform: `scale(${Math.min(1.04, ak)})`, transformOrigin: "50% 0%" }}>
          <div style={{ ...type.display, fontSize: 40, color: P.ink }}>My domains</div>
          <div style={{ marginTop: 22, height: 170, background: cancelled ? P.paper2 : P.limeWash, border: `4px solid ${P.ink}`, borderRadius: 24, display: "flex", alignItems: "center", padding: "0 28px", gap: 18, boxShadow: shadow.hard(6) }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 50, color: P.ink, textDecoration: cancelled ? "line-through" : "none" }}>google.com</div>
              <div style={{ ...type.body, fontSize: 22, color: P.ink2 }}>Owner: Sanmay Ved</div>
            </div>
            {cancelled ? <Chip text="Cancelled" bg={P.pink} k={Math.min(1.15, ck)} /> : <Chip text="Active" bg={P.lime} />}
          </div>
          {/* Time as owner. */}
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18 }}>
            <Stopwatch size={86} k={ownedFor(t) / 60} />
            <div>
              <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>Owner for</div>
              <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 56, color: P.ink, fontVariantNumeric: "tabular-nums" }}>
                {t >= C.cancelAt - 0.4 ? "≈ 1 min" : `0:${String(ownedFor(t)).padStart(2, "0")}`}
              </div>
            </div>
            {refund > 0 && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, transform: `scale(${Math.min(1.1, refund)})`, transformOrigin: "100% 50%" }}>
                <DollarCoin size={56} spin={Math.cos(t * 6)} />
                <Chip text="$12 refunded" bg={P.gold} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/** Pointer path: to Buy, then to Purchase. Positions are inside the window. */
const ShopPointer: React.FC<{ t: number }> = ({ t }) => {
  const legs: [number, number, [number, number], [number, number], number][] = [
    [C.thinkAt + 0.6, C.buyClick, [700, 640], [830, 515], C.buyClick],
    [C.buyClick + 0.3, C.payClick, [830, 515], [780, 470], C.payClick],
  ];
  for (const [a, b, from, to, tap] of legs) {
    if (t < a || t > tap + 0.45) continue;
    const k = eo(seg(t, a, b - 0.06));
    const press = t >= tap - 0.06 && t < tap + 0.04 ? 0.82 : 1;
    return (
      <div style={{ position: "absolute", left: lerp(from[0], to[0], k), top: lerp(from[1], to[1], k), opacity: 1 - seg(t, tap + 0.25, tap + 0.45) }}>
        {t >= tap && <ClickRing k={seg(t, tap, tap + 0.25)} />}
        <Pointer press={press} />
      </div>
    );
  }
  return null;
};

const sanmayShop = (t: number): { pose: FigPose; face: FigFace } => {
  if (t >= C.cancelAt) return { pose: "head2", face: "shocked" };
  if (t >= C.phirAt) return { pose: "look", face: "worried" };
  if (t >= C.successAt) return { pose: "cheer", face: "shocked" };
  if (t >= C.lekinAt) return { pose: "look", face: "curious" };
  if (t >= C.thinkAt) return { pose: "head", face: "worried" };
  return { pose: "look", face: "curious" };
};

export const Shop: React.FC<S> = ({ t }) => {
  if (t < C.shopAt - 0.1 || t > C.twistAt + 0.5) return null;
  const inK = seg(t, C.shopAt - 0.1, C.shopAt + 0.3);
  const out = go(t, C.twistAt - 0.25, C.twistAt + 0.35);
  // Camera: a slow push, a perspective swing on the success, a shake on the cancel. For the last minute a big
  // clock comes forward instead, so the window never slides under the logo.
  const success = pop(t, C.successAt, { damping: 10, stiffness: 120 });
  const swing = t >= C.successAt ? 8 * Math.exp(-(t - C.successAt) * 1.6) * Math.sin((t - C.successAt) * 6) : 0;
  const shake = t > C.cancelAt && t < C.cancelAt + 0.45 ? Math.sin(t * 90) * 16 * (1 - seg(t, C.cancelAt, C.cancelAt + 0.45)) : 0;
  const scale = lerp(0.96, 1.0, go(t, C.shopAt, C.successAt)) * (1 + 0.05 * Math.sin(Math.min(1, success) * Math.PI));
  const ox = 0;
  const oy = 0;
  const clockIn = pop(t, C.phirAt, { damping: 12, stiffness: 150 });
  const clockGrow = lerp(0.8, 1.15, go(t, C.phirAt, C.cancelAt - 0.1));
  const clockDrop = go(t, C.cancelAt - 0.05, C.cancelAt + 0.3);
  const thought = vis(t, C.thinkAt + 0.1, C.lekinAt + 0.5, 0.25, 0.3);
  const errX = go(t, C.lekinAt, C.lekinAt + 0.3);
  const stamp = pop(t, C.cancelAt, { damping: 7, stiffness: 260 });
  const { pose, face } = sanmayShop(t);
  const sIn = pop(t, C.screenAt + 0.2, { damping: 13, stiffness: 140 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: inK * (1 - out), transform: `translateY(${out * 300}px) rotate(${out * 8}deg)` }}>
      <div style={{ position: "absolute", inset: 0, perspective: 1800 }}>
        <div style={{ position: "absolute", left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, transform: `translate(${ox + shake}px, ${oy}px) scale(${scale}) rotateY(${swing}deg) rotateX(${swing * 0.4}deg)`, transformOrigin: "50% 50%" }}>
          <Window w={WIN.w} h={WIN.h} host="domains.google.com">
            <ShopContent t={t} />
          </Window>
          <ReconTag style={{ right: 26, top: -24, transform: "rotate(2deg)" }} />
          <ShopPointer t={t} />
          {/* ORDER CANCELLED: slams over the window. */}
          {stamp > 0 && (
            <div style={{ ...centre(WIN.w / 2, 330, Math.min(1.25, stamp) * (1 + 0.6 * Math.max(0, 1 - (t - C.cancelAt) * 6)), "rotate(-9deg)"), display: "flex", alignItems: "center", gap: 18, border: `10px solid ${P.pink}`, background: "rgba(255,255,255,0.94)", borderRadius: 22, padding: "10px 30px", whiteSpace: "nowrap" }}>
              <Cross size={90} k={seg(t, C.cancelAt + 0.05, C.cancelAt + 0.35)} />
              <div style={{ ...type.label, letterSpacing: "0.06em", fontSize: 70, color: P.pink }}>Order cancelled!</div>
            </div>
          )}
        </div>
      </div>
      {/* The last minute: a big clock comes forward, the room darkens, time runs out. */}
      {clockIn > 0 && clockDrop < 1 && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(23,23,23,0.05) 0%, rgba(23,23,23,0.5) 75%)", opacity: Math.min(1, clockIn) * (1 - clockDrop) }} />
          <div style={{ ...centre(540, 650 + clockDrop * 500, Math.min(1.05, clockIn) * clockGrow, `rotate(${clockDrop * 30}deg)`), opacity: 1 - seg(clockDrop, 0, 0.6), display: "flex", flexDirection: "column", alignItems: "center", background: P.card, border: `6px solid ${P.ink}`, borderRadius: 40, padding: "30px 50px", boxShadow: shadow.hard(10) }}>
            <Stopwatch size={230} k={ownedFor(t) / 60} />
            <div style={{ ...type.label, fontSize: 26, color: P.ink3, marginTop: 14 }}>google.com owner for</div>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 108, color: P.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{t >= C.cancelAt - 0.4 ? "≈ 1:00" : `0:${String(ownedFor(t)).padStart(2, "0")}`}</div>
            <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>About one minute</div>
          </div>
        </>
      )}
      {/* Sanmay, below the window's bottom-right corner, reacting to his screen. */}
      {sIn > 0 && <div style={{ position: "absolute", left: 875 - 220, top: 1172 - 580 + (1 - Math.min(1, sIn)) * 400, width: 440, height: 580, transform: "scale(0.5)", transformOrigin: "50% 100%" }}>
        <Figure look={SANMAY} pose={pose} face={face} t={t} blink={[24.6, 34.8].some((b) => Math.abs(t - b) < 0.06)} />
      </div>}
      {thought > 0 && (
        <div style={{ ...centre(560, 1055, thought), display: "flex", alignItems: "center", gap: 12, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 30, padding: "12px 24px", boxShadow: shadow.hard(5) }}>
          <svg width={46} height={42} viewBox="0 0 46 42">
            <path d="M23 3 L44 39 H2 Z" fill={P.gold} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d="M23 15 V26" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
            <circle cx={23} cy={32} r={3} fill={P.ink} />
          </svg>
          <div style={{ position: "relative", ...type.display, fontSize: 38, color: P.ink }}>
            Error aayega…
            <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 6, background: P.ink, transform: `scaleX(${errX})`, transformOrigin: "0 50%" }} />
          </div>
        </div>
      )}
      {/* The refund: a coin flies from the window back out. */}
      {t > C.refundAt && t < C.refundAt + 1.0 && (
        <DollarCoin size={80} spin={Math.cos(t * 12)} style={{ position: "absolute", left: lerp(330, 860, eo(seg(t, C.refundAt, C.refundAt + 0.8))) - 40, top: lerp(860, 1000, seg(t, C.refundAt, C.refundAt + 0.8)) - 240 * Math.sin(Math.PI * seg(t, C.refundAt, C.refundAt + 0.8)) - 40, opacity: 1 - seg(t, C.refundAt + 0.7, C.refundAt + 1) }} />
      )}
      <Burst t={t} at={C.successAt} x={540} y={620} r={330} color={P.lime} />
      <Burst t={t} at={C.availableAt} x={300} y={830} r={200} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// The turn (42.6 to 45.4 s): the presenter steps in for "asli twist".

export const TwistTitle: React.FC<S> = ({ t }) => {
  if (t < C.twistAt - 0.1 || t > C.reportAt) return null;
  const out = go(t, C.reportAt - 0.4, C.reportAt);
  const k = pop(t, C.twistWord, { damping: 8, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 360, display: "flex", justifyContent: "center", opacity: seg(t, C.twistAt, C.twistAt + 0.25) }}>
        <Eyebrow text="Lekin bhai…" size={28} />
      </div>
      {k > 0 && (
        <div style={{ ...centre(540, 480, Math.min(1.12, k)) }}>
          <Sticker size={92} tone="lime" rotate={-4}>
            Asli twist
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.twistWord} x={540} y={480} r={280} />
    </div>
  );
};
