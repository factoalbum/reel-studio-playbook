import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Coin, Sticker } from "../brand/Bits";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Sparks } from "../bonus/kit";
import { centre, DemoTag, PhoneShell } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/gta6clip";
import { Chip, mix, sc } from "../launch/kit";
import { AiClip, Card3D, EnergyLine, Streak } from "../fable/kit";

/**
 * Creator Secrets: GTA 6 launch-day clipping. "Khel ke nahi, clips kaat ke paise" → what clipping is → the real
 * rate ($1 per 1,000 views, only if approved) → 4 steps (Whop Content Rewards, streams + timestamps, OpusClip free,
 * first 24 hours before the budget runs out) → permission or copyright strike → comment GTA6 / link in bio.
 * Times: src/episodes/gta6clip.ts. Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140,
 * subtitles 1170 to 1290, presenter below.
 * Owner's call (18 Nov): official logos for recognition (GTA VI from rockstargames.com/VI, Whop, OpusClip, YouTube
 * from their own sites, in public/gta6clip/logos, shown unaltered). No game footage or key art. Streams, clips and
 * the campaign card are code illustrations and are labelled. Background: ViceBackdrop (Vice City sunset in code).
 */

type S = { t: number };
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));
const RED = "#E0452B";

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.12 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.gta, 0.05, 0.8) + push(C.kaat, 0.06, 0.6) + push(C.kitna, 0.05, 0.5) + push(C.hundred, 0.07, 0.7) + push(C.scam, 0.06, 0.5) + push(C.short, 0.05, 0.6) + push(C.paisaNahi, 0.06, 0.5) + push(C.strike, 0.08, 0.6) + push(C.gtaWord, 0.06, 0.6);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.ise, C.kitna, C.step1, C.step2, C.step3, C.step4, C.sirf, C.poora].map((at, i) => {
      const k = seg(t, at - 0.22, at + 0.18);
      if (k <= 0 || k >= 1) return null;
      return (
        <div key={i} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
          <div style={{ flex: 1, background: i % 2 ? "#FF5CAA" : "#2B0A46" }} />
          <div style={{ flex: 1, background: i % 2 ? "#2B0A46" : "#FFB347" }} />
        </div>
      );
    })}
  </>
);

export const Streaks: React.FC<S> = ({ t }) => (
  <>
    <Streak t={t} at={0.02} />
    <Streak t={t} at={C.kaat - 0.08} />
    <Streak t={t} at={C.hundred - 0.1} dur={0.45} />
    <Streak t={t} at={C.scam - 0.08} />
    <Streak t={t} at={C.strike - 0.08} dur={0.45} />
    <Streak t={t} at={C.gtaWord - 0.1} />
  </>
);

// =================================================================================================================
// Shared bits

const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, k * 3), transform: `scale(${lerp(2.1, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1)})`, filter: `blur(${Math.max(0, 1 - k) * 8}px)`, ...style }}>
      {children}
    </span>
  );
};

const Lime: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px", margin: "0 2px" }}>{children}</span>;

/** The official GTA VI logo (rockstargames.com/VI), shown unaltered. `size` = height in px. */
export const Gta: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0.6 }) => (
  <Img src={staticFile("gta6clip/logos/gta-poster-logo-trim.png")} style={{ height: size * 1.9, width: "auto", display: "block", filter: `drop-shadow(0 0 ${size * 0.25 * glow}px rgba(255,92,170,0.85)) drop-shadow(0 ${size * 0.06}px 0 rgba(43,10,70,0.6))` }} />
);

/** Official brand logo tile (files from each brand's own site, never redrawn). */
export type Brand = "whop" | "opus" | "youtube";
const LOGO: Record<Brand, { src: string; bg: string; pad: number }> = {
  whop: { src: "gta6clip/logos/whop-icon.png", bg: "#FF4D14", pad: 0 },
  opus: { src: "gta6clip/logos/opus-icon.png", bg: "#121214", pad: 0 },
  youtube: { src: "gta6clip/logos/youtube-icon.png", bg: "#FFFFFF", pad: 0.12 },
};
export const LogoTile: React.FC<{ brand: Brand; size: number; style?: React.CSSProperties }> = ({ brand, size, style }) => {
  const l = LOGO[brand];
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.24, background: l.bg, border: `${Math.max(3, size * 0.04)}px solid ${P.ink}`, boxShadow: shadow.hard(Math.max(4, size * 0.05)), display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flex: "0 0 auto", ...style }}>
      <Img src={staticFile(l.src)} style={{ width: size * (1 - l.pad * 2), height: size * (1 - l.pad * 2), objectFit: "contain", display: "block" }} />
    </div>
  );
};

/** Vice City sunset, drawn in code: pastel sky, striped retro sun, palms, neon grid floor. Light enough for ink text. */
export const ViceBackdrop: React.FC<S> = ({ t }) => {
  const drift = Math.sin(t * 0.4) * 10;
  const palm = (x: number, flip: number, s: number, key: number) => (
    <svg key={key} width={420 * s} height={900 * s} viewBox="0 0 420 900" style={{ position: "absolute", left: x, bottom: 300, transform: `scaleX(${flip}) rotate(${Math.sin(t * 0.8 + key) * 1.2}deg)`, transformOrigin: "50% 100%", opacity: 0.5 }}>
      <path d="M200 900 C205 700 185 450 230 250" stroke="#5B2A86" strokeWidth={26} fill="none" strokeLinecap="round" />
      {[-70, -30, 10, 50, 95, 140].map((a, i) => (
        <path key={i} d="M230 250 C300 220 360 240 410 300 C350 270 290 270 230 262 Z" fill="#5B2A86" transform={`rotate(${a + 20} 230 250)`} />
      ))}
    </svg>
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #F3E6FF 0%, #FFD9EC 38%, #FFD3B5 62%, #FFE9D6 100%)" }}>
      <div style={{ position: "absolute", left: 540 - 360, top: 560 + drift, width: 720, height: 720, borderRadius: 999, background: "linear-gradient(180deg, #FFB347 0%, #FF6FA8 70%)", opacity: 0.55, maskImage: "repeating-linear-gradient(180deg, #000 0 46px, transparent 46px 58px)", WebkitMaskImage: "repeating-linear-gradient(180deg, #000 0 46px, transparent 46px 58px)" }} />
      {palm(-150, 1, 0.9, 1)}
      {palm(820, -1, 1.0, 2)}
      <svg width={1080} height={520} viewBox="0 0 1080 520" style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.35 }}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={540 + (i - 6) * 40} y1={0} x2={540 + (i - 6) * 260} y2={520} stroke="#E0368C" strokeWidth={3} />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const y = Math.pow(((i + ((t * 0.6) % 1)) / 8), 2) * 520;
          return <line key={`h${i}`} x1={0} y1={y} x2={1080} y2={y} stroke="#E0368C" strokeWidth={3} />;
        })}
      </svg>
    </div>
  );
};

/** Scissors drawn in code. `open` 0..1. */
const Scissors: React.FC<{ size: number; open: number; color?: string }> = ({ size, open, color = P.ink }) => {
  const a = 8 + open * 22;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
      <g transform={`rotate(${-a} 50 50)`}>
        <path d="M50 50 L98 44 L98 50 Z" fill="#DCD9D0" stroke={color} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={22} cy={64} r={14} fill={P.lime} stroke={color} strokeWidth={6} />
        <path d="M33 58 L50 50" stroke={color} strokeWidth={7} strokeLinecap="round" />
      </g>
      <g transform={`rotate(${a} 50 50)`}>
        <path d="M50 50 L98 56 L98 50 Z" fill="#EDEBE4" stroke={color} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={22} cy={36} r={14} fill={P.lime} stroke={color} strokeWidth={6} />
        <path d="M33 42 L50 50" stroke={color} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle cx={50} cy={50} r={5} fill={color} />
    </svg>
  );
};

/** Step header: number pill and the step title (text only, no third-party logos). */
const StepHead: React.FC<{ t: number; at: number; n: number; title: React.ReactNode; size?: number; logo?: Brand }> = ({ t, at, n, title, size = 58, logo }) => {
  const k = pop(t, at, { damping: 10, stiffness: 210 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: 330, height: 130, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, transform: `translateY(${(1 - mix(k)) * -50}px)`, opacity: mix(k) }}>
      <div style={{ ...type.label, fontSize: 30, color: P.lime, background: P.ink, borderRadius: 999, padding: "10px 20px 11px", whiteSpace: "nowrap", flex: "0 0 auto", transform: `scale(${sc(k)}) rotate(-3deg)` }}>STEP {n}</div>
      {logo && (
        <div style={{ transform: `scale(${sc(pop(t, at + 0.08, { damping: 9, stiffness: 230 }))}) rotate(-4deg)` }}>
          <LogoTile brand={logo} size={96} />
        </div>
      )}
      <div style={{ ...type.display, fontSize: size, color: P.ink, whiteSpace: "nowrap" }}>{title}</div>
    </div>
  );
};

/** A big counter that rolls from `from` to `to` between `a` and `b`. */
const roll = (t: number, a: number, b: number, from: number, to: number) => Math.round(lerp(from, to, eo(seg(t, a, b))));
const fmt = (n: number) => n.toLocaleString("en-IN");

/** A red stamp that slams in. */
const Stamp: React.FC<{ t: number; at: number; x: number; y: number; text: React.ReactNode; size?: number; rot?: number; tone?: "red" | "ink" | "lime" }> = ({ t, at, x, y, text, size = 70, rot = -8, tone = "red" }) => {
  const k = pop(t, at, { damping: 8, stiffness: 260 });
  if (k <= 0) return null;
  const c = tone === "red" ? RED : tone === "lime" ? P.olive : P.ink;
  return (
    <div style={{ ...centre(x, y, lerp(1.8, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.2 : 1), `rotate(${rot}deg)`), opacity: Math.min(1, k * 2.5), zIndex: 5 }}>
      <div style={{ ...type.display, fontSize: size, lineHeight: 1, color: c, border: `8px solid ${c}`, borderRadius: 18, padding: "10px 26px 16px", background: "rgba(250,249,245,0.92)", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>{text}</div>
    </div>
  );
};

// =================================================================================================================
// 1. Hook: 19 NOV, GTA 6 → kuch log khel ke nahi, clips kaat ke paise banayenge

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.ise + 0.3) return null;
  const o = leave(t, C.ise);
  const cal = pop(t, -0.3, { damping: 10, stiffness: 200 });
  const gta = pop(t, -0.12, { damping: 8, stiffness: 240 });
  const shift = eo(seg(t, C.aur - 0.1, C.aur + 0.3));
  const pad = pop(t, C.log, { damping: 12, stiffness: 180 });
  const no = pop(t, C.nahi, { damping: 8, stiffness: 250 });
  const cut = pop(t, C.clips, { damping: 11, stiffness: 200 });
  const snip = eo(seg(t, C.kaat, C.kaat + 0.25));
  const coins = pop(t, C.paise, { damping: 11, stiffness: 190 });
  const days = Math.round(lerp(1, 19, eo(seg(t, -0.25, 1.2))));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* calendar + GTA 6, on screen from frame 0, then moves up */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: lerp(400, 300, shift), display: "flex", justifyContent: "center", alignItems: "center", gap: 26, transform: `scale(${lerp(1, 0.55, shift)})`, transformOrigin: "540px 0" }}>
        <div style={{ transform: `scale(${sc(cal)}) rotate(-5deg)` }}>
          <Card3D k={cal} t={t} yaw={18}>
            <div style={{ width: 270, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(12), overflow: "hidden" }}>
              <div style={{ background: P.ink, color: P.lime, ...type.label, fontSize: 34, textAlign: "center", padding: "14px 0 16px" }}>NOV 2026</div>
              <div style={{ ...type.display, fontSize: 170, lineHeight: 0.95, color: P.ink, textAlign: "center", letterSpacing: "-0.06em", padding: "8px 0 4px" }}>{String(days).padStart(2, "0")}</div>
              <div style={{ ...type.label, fontSize: 24, color: P.ink3, textAlign: "center", padding: "0 0 20px" }}>THURSDAY</div>
            </div>
          </Card3D>
        </div>
        {gta > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${sc(gta)}) rotate(3deg)` }}>
            <Gta size={230} glow={0.6 + 0.4 * Math.sin(t * 6) ** 2} />
            <div style={{ ...type.display, fontSize: 60, color: P.ink, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 20, padding: "2px 22px 10px", boxShadow: shadow.hard(7), opacity: mix(pop(t, C.aaRaha, { damping: 9, stiffness: 230 })), whiteSpace: "nowrap" }}>AA RAHA HAI</div>
          </div>
        )}
      </div>
      {/* khel ke nahi: a controller, crossed out */}
      {pad > 0 && (
        <div style={{ ...centre(lerp(-200, 300, eo(mix(pad))), 830, 1, `rotate(${-8 + Math.sin(t * 3) * 2}deg)`) }}>
          <div style={{ position: "relative", width: 380, height: 260, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 40, boxShadow: shadow.hard(10), display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - 0.35 * mix(cut) }}>
            <svg width={300} height={170} viewBox="0 0 300 170">
              <path d="M60 30 H240 C290 30 300 150 260 155 C230 158 215 120 190 120 H110 C85 120 70 158 40 155 C0 150 10 30 60 30 Z" fill={P.ink} />
              <rect x={62} y={70} width={44} height={14} rx={4} fill={P.lime} />
              <rect x={77} y={55} width={14} height={44} rx={4} fill={P.lime} />
              {[[210, 62], [236, 80], [184, 80], [210, 98]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={11} fill={i === 0 ? P.lime : "#FAF9F5"} />
              ))}
            </svg>
            <div style={{ position: "absolute", top: -26, left: 24, ...type.label, fontSize: 24, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 12, padding: "4px 12px" }}>KHEL KE</div>
            {no > 0 && (
              <svg width={380} height={260} viewBox="0 0 380 260" style={{ position: "absolute", inset: 0 }}>
                <path d="M40 40 L340 220 M340 40 L40 220" stroke={RED} strokeWidth={24} strokeLinecap="round" strokeDasharray={800} strokeDashoffset={(1 - mix(no)) * 800} />
              </svg>
            )}
          </div>
        </div>
      )}
      {/* clips kaat ke: scissors cut a stream strip into short clips */}
      {cut > 0 && (
        <div style={{ ...centre(780, 860, sc(cut), "rotate(4deg)") }}>
          <div style={{ position: "relative", width: 420, height: 300 }}>
            {[0, 1, 2].map((i) => {
              const dx = snip * (i - 1) * 46;
              const dy = snip * (i === 1 ? -16 : 10);
              return (
                <div key={i} style={{ position: "absolute", left: 20 + i * 128 + dx, top: 40 + dy, width: 124, height: 220, border: `5px solid ${P.ink}`, borderRadius: snip > 0.5 ? 18 : 6, overflow: "hidden", boxShadow: shadow.hard(6), transform: `rotate(${snip * (i - 1) * 7}deg)` }}>
                  <AiClip kind={(["city", "film", "character"] as const)[i]} t={t + i * 2} w={124} h={220} radius={0} hud={false} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: lerp(-40, 360, eo(seg(t, C.kaat - 0.15, C.kaat + 0.2))), top: 120, transform: "rotate(90deg)" }}>
              <Scissors size={110} open={0.5 + 0.5 * Math.sin(t * 22)} />
            </div>
          </div>
        </div>
      )}
      {cut > 0 && <DemoTag text="Illustration · not game footage" style={{ left: 600, top: 1080, opacity: mix(cut) }} />}
      {coins > 0 &&
        Array.from({ length: 8 }, (_, i) => {
          const k = pop(t, C.paise + i * 0.06, { damping: 11, stiffness: 190 });
          const x = 600 + ((i * 97) % 380);
          const y = 600 + ((i * 71) % 180) - (t - C.paise) * 40;
          return (
            <div key={i} style={{ ...centre(x, y, sc(k) * 0.9, `rotate(${(i % 2 ? 1 : -1) * 14}deg)`), zIndex: 4 }}>
              <Coin size={70 + (i % 3) * 18} spin={Math.cos(t * 5 + i)} />
            </div>
          );
        })}
      <Burst t={t} at={C.gta} x={700} y={560} r={420} color={P.lime} />
      <Burst t={t} at={C.kaat} x={780} y={860} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 2. Ise kehte hain CLIPPING: creator's long video → short clips → views → paisa

export const WhatScene: React.FC<S> = ({ t }) => {
  if (t < C.ise - 0.1 || t > C.kitna + 0.3) return null;
  const o = leave(t, C.kitna);
  const word = pop(t, C.clipping, { damping: 8, stiffness: 240 });
  const flow = eo(seg(t, C.brands - 0.2, C.brands + 0.2));
  const src = pop(t, C.brands, { damping: 12, stiffness: 180 });
  const camp = pop(t, C.campaign, { damping: 9, stiffness: 230 });
  const clips = [0, 1, 2].map((i) => pop(t, C.chhote + i * 0.18, { damping: 10, stiffness: 220 }));
  const views = pop(t, C.views, { damping: 10, stiffness: 220 });
  const money = pop(t, C.paisaLo, { damping: 8, stiffness: 240 });
  const v = roll(t, C.views, C.paisaLo + 0.6, 0, 48200);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, lerp(640, 395, flow), lerp(1, 0.62, flow)), ...type.display, fontSize: 64, color: P.ink, whiteSpace: "nowrap", opacity: mix(pop(t, C.ise, { damping: 10, stiffness: 210 })) }}>
        Ise kehte hain
      </div>
      {word > 0 && (
        <div style={{ ...centre(540, lerp(790, 470, flow), sc(word) * lerp(1, 0.55, flow), "rotate(-3deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, ...type.display, fontSize: 168, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 36, padding: "6px 40px 22px", boxShadow: shadow.hard(14), letterSpacing: "-0.05em" }}>
            <Scissors size={130} open={0.5 + 0.5 * Math.sin(t * 9)} />
            CLIPPING
          </div>
        </div>
      )}
      {/* the creator's long video */}
      {src > 0 && (
        <div style={{ ...centre(270, 720, sc(src), "rotate(-3deg)") }}>
          <div style={{ position: "relative", width: 380, border: `6px solid ${P.ink}`, borderRadius: 24, overflow: "hidden", boxShadow: shadow.hard(9), background: "#111" }}>
            <AiClip kind="film" t={t} w={380} h={214} radius={0} hud={false} />
            <div style={{ position: "absolute", left: 12, top: 12, ...type.label, fontSize: 18, color: "#fff", background: RED, borderRadius: 6, padding: "3px 10px" }}>● LIVE 3:12:40</div>
            <Img src={staticFile("gta6clip/logos/youtube-wordmark.svg")} style={{ position: "absolute", right: 10, top: 10, height: 30, background: "#fff", borderRadius: 6, padding: "4px 8px" }} />
            <div style={{ height: 14, background: "#2C2B28" }}>
              <div style={{ width: `${30 + ((t * 9) % 60)}%`, height: "100%", background: RED }} />
            </div>
          </div>
          <div style={{ ...type.label, fontSize: 22, color: P.ink, textAlign: "center", marginTop: 12 }}>BRANDS + CREATORS</div>
        </div>
      )}
      {camp > 0 && (
        <div style={{ ...centre(270, 950, sc(camp), "rotate(2deg)") }}>
          <Chip text="CAMPAIGN: $ per 1K views" size={26} tone="ink" />
        </div>
      )}
      <EnergyLine from={[470, 720]} to={[600, 720]} k={seg(t, C.unke, C.chhote)} t={t} width={10} />
      {/* short vertical clips */}
      {clips.map((k, i) =>
        k > 0 ? (
          <div key={i} style={{ ...centre(660 + i * 120, 700 + (i === 1 ? -26 : 14), sc(k), `rotate(${(i - 1) * 6}deg)`) }}>
            <div style={{ width: 108, height: 192, border: `5px solid ${P.ink}`, borderRadius: 16, overflow: "hidden", boxShadow: shadow.hard(6) }}>
              <AiClip kind={(["character", "city", "landscape"] as const)[i]} t={t + i * 3} w={108} h={192} radius={0} hud={false} />
            </div>
          </div>
        ) : null,
      )}
      {views > 0 && (
        <div style={{ ...centre(780, 900, sc(views), "rotate(-2deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "10px 22px 14px" }}>
            <svg width={52} height={40} viewBox="0 0 52 40">
              <path d="M2 20 C12 4 40 4 50 20 C40 36 12 36 2 20 Z" fill="none" stroke={P.ink} strokeWidth={5} />
              <circle cx={26} cy={20} r={8} fill={P.ink} />
            </svg>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 52, color: P.ink }}>{fmt(v)}</div>
          </div>
        </div>
      )}
      {money > 0 && (
        <div style={{ ...centre(780, 1035, sc(money), "rotate(3deg)") }}>
          <Sticker size={60} tone="lime" rotate={0}>
            VIEWS = PAISA
          </Sticker>
        </div>
      )}
      {src > 0 && <DemoTag text="Illustration" style={{ left: 120, top: 1080, opacity: mix(src) }} />}
      <Burst t={t} at={C.clipping} x={540} y={790} r={460} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 3. Kitna? $1 per 1,000 views → 1 lakh views ≈ $100 → agar approve ho

export const NumberScene: React.FC<S> = ({ t }) => {
  if (t < C.kitna - 0.1 || t > C.step1 + 0.3) return null;
  const o = leave(t, C.step1);
  const q = pop(t, C.kitna, { damping: 8, stiffness: 250 });
  const qOut = eo(seg(t, C.zyada - 0.1, C.zyada + 0.2));
  const rate = pop(t, C.dollar, { damping: 10, stiffness: 210 });
  const up = eo(seg(t, C.yaani - 0.1, C.yaani + 0.3));
  const meter = pop(t, C.lakh, { damping: 12, stiffness: 180 });
  const views = roll(t, C.lakh, C.hundred, 0, 100000);
  const dollars = Math.round(views / 1000);
  const big = pop(t, C.hundred, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {q > 0 && qOut < 1 && (
        <div style={{ ...centre(540, 700, sc(q) * (1 - qOut * 0.3), `rotate(${(1 - mix(q)) * 12 - 3}deg)`), opacity: 1 - qOut }}>
          <div style={{ ...type.display, fontSize: 250, lineHeight: 0.9, color: P.ink, letterSpacing: "-0.05em", textShadow: `10px 10px 0 ${P.lime}` }}>KITNA?</div>
        </div>
      )}
      {rate > 0 && (
        <div style={{ ...centre(540, lerp(700, 420, up), sc(rate) * lerp(1, 0.6, up), "rotate(-2deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, background: P.ink, border: `7px solid ${P.ink}`, borderRadius: 36, boxShadow: `12px 12px 0 ${P.lime}`, padding: "20px 40px 28px" }}>
            <div style={{ ...type.display, fontSize: 150, lineHeight: 0.95, color: P.lime, letterSpacing: "-0.05em" }}>$1</div>
            <div style={{ ...type.display, fontSize: 60, lineHeight: 1.0, color: "#FAF9F5" }}>
              per
              <br />
              <span style={{ fontSize: 76, opacity: mix(pop(t, C.thousand, { damping: 9, stiffness: 230 })) }}>1,000 views</span>
            </div>
          </div>
        </div>
      )}
      {rate > 0 && up < 0.5 && <DemoTag text="Median about $1.09 per 1,000 views, 707 campaigns · data 10 Nov 2026" style={{ left: 175, top: 905, opacity: mix(rate) * (1 - up * 2) }} />}
      {meter > 0 && (
        <div style={{ ...centre(540, 760, sc(meter), "rotate(1deg)") }}>
          <div style={{ width: 860, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(12), padding: "24px 34px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ ...type.label, fontSize: 28, color: P.ink3 }}>VIEWS</div>
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 78, color: P.ink }}>{fmt(views)}</div>
            </div>
            <div style={{ height: 34, background: P.paper2, border: `4px solid ${P.ink}`, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${(views / 100000) * 100}%`, height: "100%", background: P.lime }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ ...type.label, fontSize: 28, color: P.ink3 }}>PAYOUT</div>
              <div style={{ ...type.display, fontSize: big > 0 ? 120 : 84, lineHeight: 1, color: P.ink, background: big > 0 ? P.lime : "transparent", borderRadius: 18, padding: "0 18px 6px", transform: `scale(${big > 0 ? sc(big) : 1})` }}>~${dollars}</div>
            </div>
          </div>
        </div>
      )}
      <Stamp t={t} at={C.approve} x={540} y={1060} text="SIRF AGAR APPROVE ✓" size={58} rot={-4} tone="ink" />
      {t > C.approve + 0.3 && <div style={{ ...centre(860, 965, mix(pop(t, C.approve + 0.3, {}))), ...type.label, fontSize: 22, color: P.ink3, zIndex: 6 }}>RESULTS VARY</div>}
      <Burst t={t} at={C.hundred} x={700} y={860} r={460} color={P.lime} />
      <Sparks t={t} at={C.hundred} x={720} y={860} n={12} r={260} />
    </div>
  );
};

// =================================================================================================================
// 4. Step 1: Whop → Content Rewards → gaming / GTA 6 campaign. Join free; asks money = scam.

export const Step1Scene: React.FC<S> = ({ t }) => {
  if (t < C.step1 - 0.1 || t > C.step2 + 0.3) return null;
  const o = leave(t, C.step2);
  const win = pop(t, C.whop, { damping: 13, stiffness: 170 });
  const tab = eo(seg(t, C.rewards, C.rewards + 0.3));
  const cards = [0, 1, 2].map((i) => pop(t, C.gaming + i * 0.15, { damping: 11, stiffness: 200 }));
  const hot = t > C.gta6;
  const free = pop(t, C.free, { damping: 9, stiffness: 230 });
  const budget = 1 - 0.38 * eo(seg(t, C.gaming, C.step2));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step1} n={1} logo="whop" title={<>Whop → <Lime>Content Rewards</Lime></>} size={46} />
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1300, 760, eo(mix(win))), 1, "rotate(-1deg)") }}>
          <div style={{ width: 860, background: "#FFFFFF", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: P.paper2, borderBottom: `4px solid ${P.ink}`, padding: "12px 18px" }}>
              {[RED, P.gold, P.lime].map((c) => (
                <div key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c, border: `2px solid ${P.ink}` }} />
              ))}
              <div style={{ marginLeft: 12, fontFamily: mono, fontSize: 22, color: P.ink2 }}>Content Rewards · campaigns</div>
              <div style={{ marginLeft: "auto", ...type.label, fontSize: 18, color: P.ink, background: P.lime, borderRadius: 8, padding: "3px 10px", opacity: tab }}>GAMING</div>
            </div>
            <div style={{ padding: "18px 20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {(
                [
                  ["GTA 6 launch clips", "$1.00 / 1K views", true],
                  ["Gaming stream highlights", "$0.80 / 1K views", false],
                  ["Esports moments", "$1.25 / 1K views", false],
                ] as [string, string, boolean][]
              ).map(([name, r, gtaRow], i) =>
                cards[i] > 0 ? (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 16, border: `4px solid ${P.ink}`, borderRadius: 18, padding: "12px 16px", background: gtaRow && hot ? P.limeWash : P.card, transform: `translateX(${(1 - mix(cards[i])) * 300}px) scale(${gtaRow && hot ? 1.03 : 1})`, opacity: mix(cards[i]), boxShadow: gtaRow && hot ? shadow.hard(6) : "none" }}>
                    <div style={{ width: 70, height: 70, borderRadius: 16, overflow: "hidden", border: `3px solid ${P.ink}`, flex: "0 0 auto" }}>
                      <AiClip kind={(["city", "film", "character"] as const)[i]} t={t + i} w={70} h={70} radius={0} hud={false} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...type.display, fontSize: 34, color: P.ink }}>{name}</div>
                      {gtaRow && (
                        <div style={{ marginTop: 8, height: 14, borderRadius: 99, background: P.paper2, border: `3px solid ${P.ink}`, overflow: "hidden", width: 300 }}>
                          <div style={{ width: `${budget * 100}%`, height: "100%", background: P.olive }} />
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: P.ink }}>{r}</div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>
      )}
      {win > 0 && <DemoTag text="Illustration · not a real listing, rates vary" style={{ left: 200, top: 1045, opacity: mix(win) }} />}
      {free > 0 && (
        <div style={{ ...centre(830, 520, sc(free), `rotate(${(1 - mix(free)) * 14 + 6}deg)`), zIndex: 4 }}>
          <Sticker size={60} tone="lime" rotate={0}>
            JOIN = FREE
          </Sticker>
        </div>
      )}
      <Stamp t={t} at={C.scam} x={540} y={780} text="PAISA MAANGE = SCAM" size={64} rot={-7} />
      <Burst t={t} at={C.scam} x={540} y={780} r={480} color={RED} />
    </div>
  );
};

// =================================================================================================================
// 5. Step 2: launch day streams → best moment → timestamp note

export const Step2Scene: React.FC<S> = ({ t }) => {
  if (t < C.step2 - 0.1 || t > C.step3 + 0.3) return null;
  const o = leave(t, C.step3);
  const player = pop(t, C.launch, { damping: 13, stiffness: 170 });
  const spike = pop(t, C.moment, { damping: 8, stiffness: 240 });
  const note = pop(t, C.timestamp, { damping: 11, stiffness: 200 });
  const ts = "02:14:37";
  const n = Math.floor(seg(t, C.timestamp + 0.1, C.note + 0.1) * ts.length);
  const chat = Math.floor((t - C.streams) * 6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step2} n={2} logo="youtube" title={<>Launch day <Lime>streams</Lime></>} size={54} />
      {player > 0 && (
        <div style={{ ...centre(470, lerp(1300, 720, eo(mix(player))), 1, "rotate(-1.5deg)") }}>
          <div style={{ width: 700, background: "#141413", border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(10), overflow: "hidden" }}>
            <div style={{ position: "relative" }}>
              <AiClip kind="city" t={t} w={700} h={394} radius={0} hud={false} />
              <div style={{ position: "absolute", left: 14, top: 14, ...type.label, fontSize: 20, color: "#fff", background: RED, borderRadius: 6, padding: "4px 10px" }}>● LIVE · GTA 6 DAY 1</div>
              <Img src={staticFile("gta6clip/logos/youtube-wordmark.svg")} style={{ position: "absolute", left: 14, bottom: 14, height: 40, background: "#fff", borderRadius: 8, padding: "6px 12px" }} />
              <div style={{ position: "absolute", right: 14, top: 14, fontFamily: mono, fontSize: 20, color: "#fff", background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "4px 10px" }}>👁 {fmt(48000 + Math.round(t * 311) % 9000)}</div>
            </div>
            {/* hype graph with a spike at the best moment */}
            <svg width={700} height={110} viewBox="0 0 700 110" style={{ display: "block", background: "#1F1E1D" }}>
              <path d={`M0 90 ${Array.from({ length: 35 }, (_, i) => `L${i * 20 + 20} ${i === 22 ? 90 - 80 * mix(spike) : 90 - (14 + ((i * 37) % 23))}`).join(" ")}`} fill="none" stroke={P.lime} strokeWidth={5} strokeLinejoin="round" />
              {spike > 0 && <circle cx={460} cy={10 + (1 - mix(spike)) * 70} r={12} fill={RED} stroke="#fff" strokeWidth={3} />}
            </svg>
          </div>
        </div>
      )}
      {player > 0 && (
        <div style={{ position: "absolute", left: 830, top: 560, width: 210, display: "flex", flexDirection: "column", gap: 10 }}>
          {["OMG 😂", "clip it!!", "🔥🔥🔥", "wait what", "replay!", "LOL"].slice(0, Math.max(0, Math.min(6, chat))).map((m, i) => (
            <div key={i} style={{ ...type.body, fontWeight: 700, fontSize: 24, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 14, padding: "6px 12px", transform: `rotate(${(i % 2 ? 1 : -1) * 2}deg)` }}>
              {m}
            </div>
          ))}
        </div>
      )}
      {spike > 0 && (
        <div style={{ ...centre(470, 640, sc(spike), "rotate(-2deg)"), zIndex: 3 }}>
          <Sticker size={56} tone="ink" rotate={0}>
            MAZEDAAR MOMENT!
          </Sticker>
        </div>
      )}
      {note > 0 && (
        <div style={{ ...centre(540, 1040, sc(note), "rotate(2deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF6B8", border: `6px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(8), padding: "14px 26px 18px" }}>
            <div style={{ ...type.label, fontSize: 26, color: P.ink2 }}>TIMESTAMP</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 64, color: P.ink, minWidth: 330 }}>
              {ts.slice(0, n)}
              {n < ts.length && <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0 }}>|</span>}
            </div>
          </div>
        </div>
      )}
      {player > 0 && <DemoTag text="Illustration · not game footage" style={{ left: 140, top: 945, opacity: mix(player) * (1 - mix(note)) }} />}
      <Burst t={t} at={C.moment} x={470} y={640} r={360} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 6. Step 3: OpusClip free plan → paste link → AI makes the short. 60 min a month free, watermark.

export const Step3Scene: React.FC<S> = ({ t }) => {
  if (t < C.step3 - 0.1 || t > C.step4 + 0.3) return null;
  const o = leave(t, C.step4);
  const box = pop(t, C.opus + 0.1, { damping: 13, stiffness: 170 });
  const url = "youtube.com/live/gta6-day1";
  const n = Math.floor(seg(t, C.link - 0.3, C.link + 0.5) * url.length);
  const ai = seg(t, C.ai, C.short);
  const phone = pop(t, C.short, { damping: 10, stiffness: 210 });
  const sixty = pop(t, C.sixty, { damping: 9, stiffness: 230 });
  const wm = pop(t, C.watermark, { damping: 9, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step3} n={3} logo="opus" title={<>OpusClip <Lime>free plan</Lime></>} />
      {box > 0 && (
        <div style={{ ...centre(400, lerp(1300, 600, eo(mix(box))), 1, "rotate(-1deg)") }}>
          <div style={{ width: 600, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(10), padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>PASTE A VIDEO LINK</div>
            <div style={{ fontFamily: mono, fontSize: 28, color: P.ink, background: P.paper2, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "12px 16px", minHeight: 40 }}>
              {url.slice(0, n)}
              {n < url.length && t > C.link - 0.3 && <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0 }}>|</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ ...type.display, fontSize: 32, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "6px 20px 10px", transform: `scale(${t > C.ai && t < C.ai + 0.2 ? 0.92 : 1})` }}>Get clips</div>
              {ai > 0 && <div style={{ flex: 1, height: 18, borderRadius: 99, background: P.paper2, border: `3px solid ${P.ink}`, overflow: "hidden" }}><div style={{ width: `${ai * 100}%`, height: "100%", background: P.olive }} /></div>}
              {ai > 0 && <div style={{ ...type.label, fontSize: 22, color: P.ink }}>AI ✦</div>}
            </div>
          </div>
        </div>
      )}
      {box > 0 && <DemoTag text="Illustration · not OpusClip's real screen" style={{ left: 140, top: 760, opacity: mix(box) }} />}
      {phone > 0 && (
        <div style={{ ...centre(lerp(1300, 850, eo(mix(phone))), 760, 1, `rotate(${5 + Math.sin(t * 2) * 1.5}deg)`) }}>
          <PhoneShell w={250} glow={0.6}>
            <div style={{ position: "relative", width: "100%", height: 444, overflow: "hidden" }}>
              <AiClip kind="character" t={t} w={250} h={444} radius={0} hud={false} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", ...type.display, fontSize: 28, color: "#fff", textShadow: "0 3px 0 #000" }}>WAIT FOR IT 😂</div>
              {wm > 0 && <div style={{ position: "absolute", right: 10, top: 12, ...type.label, fontSize: 16, color: "#fff", background: "rgba(0,0,0,0.55)", borderRadius: 6, padding: "3px 8px", transform: `scale(${sc(wm)})` }}>WATERMARK</div>}
            </div>
          </PhoneShell>
        </div>
      )}
      {sixty > 0 && (
        <div style={{ ...centre(380, 960, sc(sixty), "rotate(-2deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: P.ink, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: `9px 9px 0 ${P.lime}`, padding: "12px 26px 16px" }}>
            <div style={{ ...type.display, fontSize: 96, lineHeight: 0.95, color: P.lime, letterSpacing: "-0.05em" }}>60</div>
            <div style={{ ...type.display, fontSize: 36, lineHeight: 1.05, color: "#FAF9F5" }}>
              min / month
              <br />
              free
            </div>
          </div>
        </div>
      )}
      {wm > 0 && (
        <div style={{ ...centre(540, 1112, mix(wm)), ...type.label, fontSize: 22, color: P.ink2, whiteSpace: "nowrap" }}>Watermark on free clips · check the campaign rules</div>
      )}
      <Burst t={t} at={C.short} x={850} y={760} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 7. Step 4: post within 24 hours. Budget khatam = payment khatam. Late clips: views yes, paisa no.

export const Step4Scene: React.FC<S> = ({ t }) => {
  if (t < C.step4 - 0.1 || t > C.sirf + 0.3) return null;
  const o = leave(t, C.sirf);
  const clock = pop(t, C.hours, { damping: 10, stiffness: 210 });
  const hrs = Math.max(0, 24 - Math.floor(eo(seg(t, C.hours, C.budget)) * 23));
  const shift = eo(seg(t, C.budget - 0.15, C.budget + 0.25));
  const bar = pop(t, C.budget, { damping: 12, stiffness: 180 });
  const drain = 1 - eo(seg(t, C.budget + 0.1, C.payment + 0.2));
  const late = pop(t, C.late, { damping: 11, stiffness: 200 });
  const lv = roll(t, C.lateViews, C.paisaNahi, 0, 92000);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step4} n={4} title={<>Pehle <Lime>24 ghante</Lime></>} />
      {clock > 0 && (
        <div style={{ ...centre(lerp(540, 250, shift), lerp(740, 580, shift), sc(clock) * lerp(1, 0.6, shift), "rotate(-3deg)") }}>
          <div style={{ position: "relative", width: 380, height: 380, borderRadius: 999, background: P.card, border: `9px solid ${P.ink}`, boxShadow: shadow.hard(12), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={380} height={380} viewBox="0 0 380 380" style={{ position: "absolute", inset: 0 }}>
              <circle cx={190} cy={190} r={150} fill="none" stroke={P.lime} strokeWidth={34} strokeDasharray={942} strokeDashoffset={942 * (1 - hrs / 24)} transform="rotate(-90 190 190)" />
            </svg>
            <div style={{ ...type.display, fontSize: 130, lineHeight: 0.9, color: P.ink, letterSpacing: "-0.05em", zIndex: 1 }}>{hrs}h</div>
          </div>
        </div>
      )}
      {clock > 0 && shift < 1 && (
        <div style={{ ...centre(540, 1040, mix(pop(t, C.postNow, { damping: 9, stiffness: 230 })) * (1 - shift)), opacity: 1 - shift }}>
          <Sticker size={60} tone="lime" rotate={-2}>
            JALDI POST KARO
          </Sticker>
        </div>
      )}
      {bar > 0 && (
        <div style={{ ...centre(700, 560, sc(bar), "rotate(1.5deg)") }}>
          <div style={{ width: 520, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(9), padding: "16px 22px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...type.label, fontSize: 24, color: P.ink3 }}>
              <span>CAMPAIGN BUDGET</span>
              <span style={{ color: drain < 0.05 ? RED : P.ink }}>{drain < 0.05 ? "$0 LEFT" : `$${fmt(Math.round(drain * 5000))}`}</span>
            </div>
            <div style={{ marginTop: 12, height: 40, borderRadius: 99, background: P.paper2, border: `5px solid ${P.ink}`, overflow: "hidden" }}>
              <div style={{ width: `${drain * 100}%`, height: "100%", background: drain < 0.25 ? RED : P.olive }} />
            </div>
          </div>
        </div>
      )}
      <Stamp t={t} at={C.payment + 0.25} x={700} y={720} text="PAYMENT KHATAM" size={62} rot={-6} />
      {late > 0 && (
        <div style={{ ...centre(540, 940, sc(late), "rotate(-1deg)") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(9), padding: "14px 26px 18px" }}>
            <div style={{ ...type.label, fontSize: 24, color: P.ink3 }}>LATE CLIP</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 46, color: P.ink }}>👁 {fmt(lv)}</div>
            <div style={{ ...type.display, fontSize: 58, color: t > C.paisaNahi ? RED : P.ink3 }}>$0</div>
          </div>
        </div>
      )}
      <Stamp t={t} at={C.paisaNahi} x={720} y={1060} text="PAISA NAHI" size={60} rot={5} />
      <Burst t={t} at={C.payment + 0.25} x={700} y={720} r={420} color={RED} />
    </div>
  );
};

// =================================================================================================================
// 8. Honest: only creators with a campaign or permission. Warna copyright strike.

export const HonestScene: React.FC<S> = ({ t }) => {
  if (t < C.sirf - 0.1 || t > C.poora + 0.3) return null;
  const o = leave(t, C.poora);
  const head = pop(t, C.sirf, { damping: 10, stiffness: 210 });
  const rows = [pop(t, C.sirf + 1.6, { damping: 10, stiffness: 220 }), pop(t, C.permission, { damping: 10, stiffness: 220 })];
  const warn = pop(t, C.warna, { damping: 8, stiffness: 250 });
  const strike = pop(t, C.strike, { damping: 7, stiffness: 260 });
  const shake = t > C.strike && t < C.strike + 0.35 ? Math.sin(t * 90) * 10 * (1 - (t - C.strike) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${shake}px)` }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={70} tone="ink" rotate={0}>
            SIRF UNHI KE CLIPS
          </Sticker>
        </div>
      )}
      {(
        [
          ["Campaign hai", 0],
          ["Permission di hai", 1],
        ] as [string, number][]
      ).map(([label, i]) =>
        rows[i] > 0 ? (
          <div key={label} style={{ ...centre(540, 590 + i * 150, sc(rows[i]), `rotate(${i ? 1.5 : -1.5}deg)`) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, width: 680, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(9), padding: "16px 26px 20px", opacity: 1 - 0.4 * mix(warn) }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 50, color: P.ink }}>✓</div>
              <div style={{ ...type.display, fontSize: 56, color: P.ink }}>{label}</div>
            </div>
          </div>
        ) : null,
      )}
      {warn > 0 && (
        <div style={{ ...centre(540, 880, sc(warn)), ...type.display, fontSize: 72, color: P.ink, whiteSpace: "nowrap" }}>
          <Lime>WARNA</Lime>
        </div>
      )}
      {strike > 0 && (
        <div style={{ ...centre(540, 1010, lerp(2, 1, Math.min(1, strike)) * (strike > 1 ? 1 + (strike - 1) * 0.2 : 1), "rotate(-4deg)"), zIndex: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: RED, border: `8px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(12), padding: "12px 30px 18px" }}>
            <svg width={80} height={72} viewBox="0 0 40 36">
              <path d="M20 2 L38 34 H2 Z" fill="#FFF6B8" stroke={P.ink} strokeWidth={3} strokeLinejoin="round" />
              <rect x={18.3} y={12} width={3.4} height={12} rx={1.5} fill={P.ink} />
              <circle cx={20} cy={29} r={2.2} fill={P.ink} />
            </svg>
            <div style={{ ...type.display, fontSize: 70, color: "#FFFFFF", whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>COPYRIGHT STRIKE</div>
          </div>
        </div>
      )}
      <Burst t={t} at={C.strike} x={540} y={1010} r={520} color={RED} />
    </div>
  );
};

// =================================================================================================================
// 9. CTA: poora plan free → comment GTA6 / link in bio, type GTA6. Bookend: the 19 NOV card returns.

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.poora - 0.1) return null;
  const head = pop(t, C.poora + 0.05, { damping: 10, stiffness: 210 });
  const up = eo(seg(t, C.comment - 0.2, C.comment + 0.15));
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.gtaWord, { damping: 8, stiffness: 240 });
  const link = pop(t, C.bio, { damping: 9, stiffness: 220 });
  const typed = "GTA6".slice(0, Math.floor(seg(t, C.bio + 0.6, C.bio + 1.2) * 4));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {head > 0 && (
        <div style={{ ...centre(540, lerp(560, 420, up), sc(head) * lerp(1, 0.7, up)), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Gta size={120} />
            <div style={{ ...type.display, fontSize: 92, color: P.ink, whiteSpace: "nowrap" }}>CLIPPING</div>
          </div>
          <div style={{ ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap", opacity: 1 - up, height: (1 - up) * 100 }}>
            poora plan <Lime>FREE</Lime>
          </div>
        </div>
      )}
      {bubble > 0 && (
        <div style={{ ...centre(540, lerp(760, 640, eo(mix(link))), sc(bubble) * lerp(1, 0.78, eo(mix(link))), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 640, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "22px 30px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ ...type.label, fontSize: 34, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 190, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>GTA6</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 70, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      {link > 0 && (
        <div style={{ ...centre(540, 990, sc(link), "rotate(-1.5deg)") }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: P.ink, border: `7px solid ${P.ink}`, borderRadius: 36, boxShadow: `12px 12px 0 ${P.lime}`, padding: "20px 36px 26px" }}>
            <div style={{ ...type.display, fontSize: 72, lineHeight: 0.95, color: P.lime, whiteSpace: "nowrap" }}>ya LINK IN BIO</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontWeight: 600, fontSize: 36, color: "#F4F2EA", whiteSpace: "nowrap" }}>
              internetoolbox.com/links
              <span style={{ background: "#FAF9F5", color: P.ink, borderRadius: 10, padding: "2px 14px", minWidth: 110, display: "inline-block" }}>
                {typed}
                <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0 }}>|</span>
              </span>
            </div>
          </div>
        </div>
      )}
      <Burst t={t} at={C.gtaWord} x={540} y={760} r={460} color={P.lime} />
      <Sparks t={t} at={C.bio} x={540} y={990} n={12} r={280} />
    </div>
  );
};
