import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Coin } from "../brand/Bits";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { AiClip, Streak } from "../fable/kit";
import { centre, DemoTag, PhoneShell } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/openshorts";
import { mix, sc } from "../launch/kit";

/**
 * Creator Secrets: OpenShorts, the free open-source AI clipper, on GTA 6 launch week.
 * Format inspired by a reel by @mikasa._.ai (beats: hook, what clippers do, paid tools, free GitHub tool, how it
 * works, risks, start today, CTA). Our own words, our own voice (Gemini TTS, Puck), our own visuals.
 * Theme follows the topic (owner's rule, 18 Nov): Vice City at night, dark glass cards, OpenShorts orange.
 * Real logos from each brand's own site, unaltered (GTA VI: rockstargames.com/VI; GitHub mark: github.com;
 * OpenShorts: its MIT repo; OpusClip: opus.pro; YouTube: gstatic branding). No game footage or key art.
 * The OpenShorts screens are code illustrations in its dashboard's style, labelled; the GitHub card uses the real
 * repo name, licence and star count (GitHub API, 18 Nov 2026: 8,867 stars, 1,861 forks, MIT).
 * Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, presenter below.
 */

type S = { t: number };
const OR = "#FF8A3D";
const PK = "#FF4FA3";
const RED = "#FF3B3B";
const GLASS = "rgba(22,14,36,0.94)";
const LINE = "rgba(255,255,255,0.14)";
const WHITE = "#FFFFFF";
const DIM = "rgba(255,255,255,0.62)";
const GRAD = `linear-gradient(90deg, ${OR}, ${PK})`;

const glass = (r = 28, glow = OR): React.CSSProperties => ({
  background: GLASS,
  border: `2px solid ${LINE}`,
  borderRadius: r,
  boxShadow: `0 0 46px ${glow}33, 0 24px 60px rgba(0,0,0,0.55)`,
});
/** 0 → 1 → 0 window: in at `a`, out at `b`. */
const win = (t: number, a: number, b: number) => eo(seg(t, a - 0.05, a + 0.2)) * (1 - eo(seg(t, b - 0.15, b + 0.1)));
const fmt = (n: number) => n.toLocaleString("en-IN");
const L = (f: string) => staticFile(`openshorts/logos/${f}`);

// =================================================================================================================
// Theme, camera, wipes

/** Vice City at night, drawn in code: dark violet sky, pink/orange glow, palms, neon grid. */
export const NightBackdrop: React.FC<S> = ({ t }) => {
  const palm = (x: number, flip: number, s: number, key: number) => (
    <svg key={key} width={420 * s} height={900 * s} viewBox="0 0 420 900" style={{ position: "absolute", left: x, bottom: 360, transform: `scaleX(${flip}) rotate(${Math.sin(t * 0.7 + key) * 1.2}deg)`, transformOrigin: "50% 100%" }}>
      <path d="M200 900 C205 700 185 450 230 250" stroke="#1C0F33" strokeWidth={26} fill="none" strokeLinecap="round" />
      {[-70, -30, 10, 50, 95, 140].map((a, i) => (
        <path key={i} d="M230 250 C300 220 360 240 410 300 C350 270 290 270 230 262 Z" fill="#1C0F33" transform={`rotate(${a + 20} 230 250)`} />
      ))}
    </svg>
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #07040F 0%, #140A26 45%, #2A0F3A 72%, #12081F 100%)" }}>
      <div style={{ position: "absolute", left: -200, top: 380 + Math.sin(t * 0.5) * 20, width: 900, height: 900, borderRadius: 999, background: `radial-gradient(circle, ${PK}40, transparent 65%)` }} />
      <div style={{ position: "absolute", right: -260, top: 820 + Math.cos(t * 0.4) * 20, width: 980, height: 980, borderRadius: 999, background: `radial-gradient(circle, ${OR}38, transparent 65%)` }} />
      {Array.from({ length: 40 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (i * 263) % 1080, top: 60 + ((i * 151) % 700), width: 3, height: 3, borderRadius: 9, background: WHITE, opacity: 0.25 + 0.35 * Math.abs(Math.sin(t * 1.3 + i)) }} />
      ))}
      {palm(-170, 1, 0.95, 1)}
      {palm(830, -1, 1.05, 2)}
      <svg width={1080} height={560} viewBox="0 0 1080 560" style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.55 }}>
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={540 + (i - 7) * 36} y1={0} x2={540 + (i - 7) * 230} y2={560} stroke={PK} strokeWidth={2.5} />
        ))}
        {Array.from({ length: 9 }, (_, i) => {
          const y = Math.pow((i + ((t * 0.7) % 1)) / 9, 2) * 560;
          return <line key={`h${i}`} x1={0} y1={y} x2={1080} y2={y} stroke={PK} strokeWidth={2.5} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 5px)" }} />
    </div>
  );
};

export const CAM_ORIGIN = "540px 720px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.14 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.gta, 0.05, 0.7) + push(C.aiKhud, 0.06, 0.6) + push(C.fifteen, 0.06, 0.6) + push(C.free, 0.08, 0.6) + push(C.stars, 0.05, 0.6) + push(C.captions, 0.05, 0.5) + push(C.risks, 0.07, 0.6) + push(C.aaj, 0.06, 0.6) + push(C.clipper, 0.06, 0.6);
};

const WIPES = () => [C.lekin, C.karte, C.tools, C.os, C.link, C.baat, C.earning, C.isliye, C.guide];
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {WIPES().map((at, i) => {
      const k = seg(t, at - 0.22, at + 0.18);
      if (k <= 0 || k >= 1) return null;
      return (
        <div key={i} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
          <div style={{ flex: 1, background: i % 2 ? PK : "#1A0B2E" }} />
          <div style={{ flex: 1, background: i % 2 ? "#1A0B2E" : OR }} />
        </div>
      );
    })}
  </>
);

export const Streaks: React.FC<S> = ({ t }) => (
  <>
    <Streak t={t} at={0.02} />
    <Streak t={t} at={C.aiKhud - 0.08} />
    <Streak t={t} at={C.free - 0.08} dur={0.45} />
    <Streak t={t} at={C.risks - 0.08} />
    <Streak t={t} at={C.clipper - 0.08} />
  </>
);

// =================================================================================================================
// Shared bits

/** Two-line headline: white line, then an orange-to-pink line. */
const Headline: React.FC<{ t: number; at: number; until: number; a: React.ReactNode; b?: React.ReactNode; top?: number; size?: number }> = ({ t, at, until, a, b, top = 320, size = 68 }) => {
  const k = pop(t, at, { damping: 12, stiffness: 200 });
  const o = 1 - eo(seg(t, until - 0.15, until + 0.1));
  if (k <= 0 || o <= 0) return null;
  const k2 = pop(t, at + 0.12, { damping: 12, stiffness: 200 });
  return (
    <div style={{ position: "absolute", left: 40, width: 1000, top, textAlign: "center", opacity: o }}>
      <div style={{ ...type.display, fontSize: size, lineHeight: 1.05, color: WHITE, transform: `translateY(${(1 - mix(k)) * 30}px)`, opacity: mix(k), textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{a}</div>
      {b && (
        <div style={{ ...type.display, fontSize: size * 1.08, lineHeight: 1.1, transform: `translateY(${(1 - mix(k2)) * 30}px)`, opacity: mix(k2) }}>
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 18px ${PK}66)` }}>{b}</span>
        </div>
      )}
    </div>
  );
};

const Logo: React.FC<{ f: string; size: number; bg?: string; pad?: number; style?: React.CSSProperties }> = ({ f, size, bg = "#121214", pad = 0, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: bg, border: `3px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flex: "0 0 auto", boxShadow: `0 0 30px ${OR}33`, ...style }}>
    <Img src={L(f)} style={{ width: size * (1 - pad * 2), height: size * (1 - pad * 2), objectFit: "contain" }} />
  </div>
);

const Pill: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = OR, size = 26, style }) => (
  <div style={{ ...type.label, fontSize: size, color: "#170C22", background: color, borderRadius: 999, padding: `${size * 0.3}px ${size * 0.8}px`, whiteSpace: "nowrap", display: "inline-block", ...style }}>{children}</div>
);

const Tag: React.FC<{ text: string; x: number; y: number; o?: number }> = ({ text, x, y, o = 1 }) => <DemoTag dark text={text} style={{ left: x, top: y, opacity: o }} />;

/** A stamp that slams in. */
const Stamp: React.FC<{ t: number; at: number; x: number; y: number; text: React.ReactNode; size?: number; rot?: number; color?: string }> = ({ t, at, x, y, text, size = 70, rot = -8, color = RED }) => {
  const k = pop(t, at, { damping: 8, stiffness: 260 });
  if (k <= 0) return null;
  return (
    <div style={{ ...centre(x, y, lerp(1.8, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.2 : 1), `rotate(${rot}deg)`), opacity: Math.min(1, k * 2.5), zIndex: 5 }}>
      <div style={{ ...type.display, fontSize: size, lineHeight: 1, color, border: `8px solid ${color}`, borderRadius: 18, padding: "10px 26px 16px", background: "rgba(14,8,24,0.9)", whiteSpace: "nowrap", boxShadow: `0 0 40px ${color}66` }}>{text}</div>
    </div>
  );
};

/** A vertical short in a phone: code-made scene, view count, optional caption word. */
const Short: React.FC<{ t: number; kind: "city" | "film" | "character" | "landscape"; views?: string; cap?: string; w?: number }> = ({ t, kind, views, cap, w = 230 }) => (
  <PhoneShell w={w} dark>
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <AiClip kind={kind} t={t} w={w - 16} h={(w - 16) * 1.9} radius={0} hud={false} />
      {cap && <div style={{ position: "absolute", left: 0, right: 0, top: "58%", textAlign: "center", ...type.display, fontSize: w * 0.12, color: WHITE, textShadow: "0 3px 0 #000, 0 0 12px #000" }}>{cap}</div>}
      {views && <div style={{ position: "absolute", left: 10, bottom: 14, fontFamily: mono, fontWeight: 700, fontSize: w * 0.075, color: WHITE, textShadow: "0 2px 6px #000" }}>▶ {views}</div>}
    </div>
  </PhoneShell>
);

// =================================================================================================================
// 1. Hook: AI ne clippers ka kaam khatam? → 19 Nov GTA 6 → log clips se paise

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.lekin + 0.3) return null;
  const o = 1 - eo(seg(t, C.lekin - 0.12, C.lekin + 0.13));
  const word = pop(t, -0.1, { damping: 9, stiffness: 240 });
  const strike = eo(seg(t, C.khatam - 0.1, C.khatam + 0.25));
  const gtaK = pop(t, C.nov - 0.05, { damping: 9, stiffness: 230 });
  const phones = pop(t, C.log, { damping: 12, stiffness: 180 });
  const up = eo(seg(t, C.nov - 0.2, C.nov + 0.2));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={-0.2} until={C.nov - 0.1} a={<>AI ne clippers ka</>} b={<>kaam khatam kar diya?</>} />
      {/* CLIPPERS, cut by an AI scissor line */}
      {up < 1 && (
        <div style={{ ...centre(540, 760, sc(word) * (1 - up * 0.3)), opacity: 1 - up }}>
          <div style={{ position: "relative", ...type.display, fontSize: 190, letterSpacing: "-0.04em", color: "transparent", background: `linear-gradient(180deg, #FFD3E8, ${PK})`, WebkitBackgroundClip: "text", backgroundClip: "text", filter: `drop-shadow(0 0 30px ${PK}aa)`, transform: "rotate(-4deg)" }}>
            CLIPPERS
            <div style={{ position: "absolute", left: -20, top: "52%", height: 16, width: `${strike * 112}%`, background: RED, borderRadius: 9, boxShadow: `0 0 24px ${RED}`, transform: "rotate(-6deg)" }} />
          </div>
          {strike > 0.5 && <div style={{ position: "absolute", right: -40, top: -70, transform: `scale(${sc(pop(t, C.khatam + 0.1, { damping: 8, stiffness: 240 }))}) rotate(10deg)` }}><Pill color={OR} size={34}>🤖 AI</Pill></div>}
        </div>
      )}
      {/* 19 NOV + official GTA VI logo */}
      {gtaK > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: lerp(470, 330, eo(seg(t, C.log - 0.2, C.log + 0.25))), display: "flex", justifyContent: "center", alignItems: "center", gap: 30, transform: `scale(${sc(gtaK) * lerp(1, 0.62, eo(seg(t, C.log - 0.2, C.log + 0.25)))})`, transformOrigin: "540px 0" }}>
          <div style={{ ...glass(30, PK), width: 250, overflow: "hidden", transform: "rotate(-5deg)" }}>
            <div style={{ background: RED, color: WHITE, ...type.label, fontSize: 28, textAlign: "center", padding: "10px 0" }}>LAUNCH</div>
            <div style={{ ...type.display, fontSize: 150, lineHeight: 1, color: WHITE, textAlign: "center", padding: "8px 0 0" }}>19</div>
            <div style={{ ...type.label, fontSize: 24, color: DIM, textAlign: "center", padding: "0 0 16px" }}>NOVEMBER</div>
          </div>
          <Img src={L("gta-poster-logo-trim.png")} style={{ height: 420, filter: `drop-shadow(0 0 ${30 + 20 * Math.sin(t * 6) ** 2}px ${PK})` }} />
        </div>
      )}
      {/* people earning from clips */}
      {phones > 0 && (
        <>
          {(["city", "character", "film"] as const).map((k, i) => (
            <div key={k} style={{ ...centre(260 + i * 280, lerp(1400, 860, eo(mix(pop(t, C.log + i * 0.1, { damping: 13, stiffness: 170 })))), 1, `rotate(${(i - 1) * 6}deg)`) }}>
              <Short t={t + i * 3} kind={k} w={230} views={["1.9M", "5.5M", "1.8M"][i]} />
            </div>
          ))}
          <Tag text="Illustration · not game footage" x={380} y={1100} o={mix(phones)} />
        </>
      )}
      {t > C.paise &&
        Array.from({ length: 7 }, (_, i) => {
          const k = pop(t, C.paise + i * 0.06, { damping: 11, stiffness: 190 });
          return (
            <div key={i} style={{ ...centre(150 + ((i * 131) % 800), 640 + ((i * 67) % 160) - (t - C.paise) * 50, sc(k) * 0.9), zIndex: 4 }}>
              <Coin size={64 + (i % 3) * 16} spin={Math.cos(t * 5 + i)} />
            </div>
          );
        })}
      <Burst t={t} at={C.khatam} x={540} y={760} r={420} color={PK} />
    </div>
  );
};

// =================================================================================================================
// 2. Lekin ab clipping, AI khud karega: an AI clipper panel auto-cutting a long stream

export const AiScene: React.FC<S> = ({ t }) => {
  if (t < C.lekin - 0.1 || t > C.karte + 0.3) return null;
  const o = 1 - eo(seg(t, C.karte - 0.12, C.karte + 0.13));
  const k = pop(t, C.lekin + 0.05, { damping: 12, stiffness: 190 });
  const scan = seg(t, C.aiKhud - 0.2, C.karte - 0.1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.lekin} until={C.karte} a={<>Lekin ab AI</>} b={<>khud clipping karega.</>} />
      <div style={{ ...centre(540, 760, sc(k)), ...glass(30), width: 900, padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✂</div>
          <div>
            <div style={{ ...type.display, fontSize: 36, color: WHITE }}>AI Clipper</div>
            <div style={{ fontFamily: mono, fontSize: 20, color: DIM }}>long stream → viral shorts · auto</div>
          </div>
          <div style={{ marginLeft: "auto" }}><Pill color="#3DDC84" size={22}>● running</Pill></div>
        </div>
        <div style={{ position: "relative", height: 150, borderRadius: 16, background: "#0B0714", overflow: "hidden", border: `2px solid ${LINE}` }}>
          {Array.from({ length: 70 }, (_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 1.7) * 80 + Math.sin(i * 0.37) * 30);
            const hot = [12, 13, 14, 31, 32, 50, 51, 52].includes(i);
            const lit = i / 70 < scan;
            return <div key={i} style={{ position: "absolute", left: 12 + i * 12.4, bottom: 20, width: 7, height: h, borderRadius: 4, background: hot && lit ? OR : lit ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }} />;
          })}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 12 + scan * 868, width: 3, background: PK, boxShadow: `0 0 18px ${PK}` }} />
          {[12, 31, 50].map((i, n) =>
            scan > (i + 3) / 70 ? (
              <div key={n} style={{ position: "absolute", left: 12 + i * 12.4 - 8, top: 8, ...type.label, fontSize: 16, color: "#170C22", background: OR, borderRadius: 6, padding: "2px 8px", transform: `scale(${sc(pop(t, C.aiKhud + n * 0.35, { damping: 9, stiffness: 240 }))})` }}>CLIP {n + 1}</div>
            ) : null,
          )}
        </div>
      </div>
      <Tag text="Illustration" x={110} y={900} o={mix(k)} />
    </div>
  );
};

// =================================================================================================================
// 3. Clippers karte kya hain? Long stream → best moments → Shorts → views = paise

export const WhatScene: React.FC<S> = ({ t }) => {
  if (t < C.karte - 0.1 || t > C.tools + 0.3) return null;
  const o = 1 - eo(seg(t, C.tools - 0.12, C.tools + 0.13));
  const player = pop(t, C.lambi - 0.1, { damping: 13, stiffness: 170 });
  const cut = pop(t, C.best, { damping: 10, stiffness: 210 });
  const shorts = pop(t, C.shorts, { damping: 12, stiffness: 190 });
  const views = Math.round(lerp(0, 1240000, eo(seg(t, C.views, C.paiseLete + 0.5))));
  const up = eo(seg(t, C.shorts - 0.25, C.shorts + 0.2));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.karte} until={C.views} a={<>Clippers karte</>} b={<>kya hain?</>} />
      <Headline t={t} at={C.views} until={C.tools} a={<>Views ke hisaab se</>} b={<>paise.</>} />
      {t < C.lambi + 0.1 && (
        <div style={{ ...centre(540, 740, sc(pop(t, C.karte + 0.1, { damping: 8, stiffness: 230 })) * (1 - mix(player)), "rotate(-6deg)"), display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 200, filter: `drop-shadow(0 0 30px ${OR})` }}>✂️</div>
          <div style={{ ...type.display, fontSize: 260, color: OR, textShadow: `0 0 40px ${OR}aa` }}>?</div>
        </div>
      )}
      {player > 0 && (
        <div style={{ ...centre(540, lerp(700, 620, up), sc(player) * lerp(1, 0.6, up)), ...glass(26, RED), width: 860, overflow: "hidden" }}>
          <div style={{ position: "relative" }}>
            <AiClip kind="city" t={t} w={860} h={420} radius={0} hud={false} />
            <div style={{ position: "absolute", left: 16, top: 16, ...type.label, fontSize: 22, color: WHITE, background: RED, borderRadius: 6, padding: "4px 12px" }}>● LIVE · 8 ghante ki GTA stream</div>
            <Img src={L("youtube-wordmark.svg")} style={{ position: "absolute", right: 16, top: 14, height: 40, background: WHITE, borderRadius: 8, padding: "6px 12px" }} />
            {cut > 0 && <div style={{ position: "absolute", left: 300, top: 120, ...type.display, fontSize: 52, color: WHITE, background: `${OR}ee`, borderRadius: 14, padding: "4px 18px", transform: `scale(${sc(cut)}) rotate(-4deg)` }}>BEST MOMENT!</div>}
          </div>
          <div style={{ height: 18, background: "#2A2233", position: "relative" }}>
            <div style={{ width: `${20 + ((t * 6) % 70)}%`, height: "100%", background: RED }} />
            {cut > 0 && [0.22, 0.48, 0.71].map((x, i) => <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: -6, width: 46, height: 30, borderRadius: 6, background: OR, opacity: mix(cut) }} />)}
          </div>
        </div>
      )}
      {shorts > 0 &&
        (["character", "film", "landscape"] as const).map((k, i) => (
          <div key={k} style={{ ...centre(260 + i * 280, lerp(1300, 930, eo(mix(pop(t, C.shorts + i * 0.12, { damping: 12, stiffness: 180 })))), 1, `rotate(${(i - 1) * 5}deg)`) }}>
            <Short t={t + i * 4} kind={k} w={200} views={["550K", "385K", "1.1M"][i]} />
          </div>
        ))}
      {t > C.views && (
        <div style={{ ...centre(540, 1128, sc(pop(t, C.views, { damping: 10, stiffness: 220 }))), ...glass(22), padding: "10px 26px", display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 36, color: WHITE }}>👁 {fmt(views)}</div>
          <div style={{ ...type.display, fontSize: 36, color: OR }}>= ₹₹₹</div>
        </div>
      )}
      {player > 0 && <Tag text="Illustration · not game footage" x={330} y={935} o={mix(player) * (1 - up)} />}
    </div>
  );
};

// =================================================================================================================
// 4. Clipping tools? OpusClip-type plans from $15 a month

export const ToolsScene: React.FC<S> = ({ t }) => {
  if (t < C.tools - 0.1 || t > C.os + 0.3) return null;
  const o = 1 - eo(seg(t, C.os - 0.12, C.os + 0.13));
  const card = pop(t, C.opus - 0.1, { damping: 11, stiffness: 200 });
  const price = 15;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.tools} until={C.os} a={<>Clipping tools?</>} b={<>$15 har mahine.</>} />
      {card > 0 && (
        <div style={{ ...centre(540, 760, sc(card), "rotate(-2deg)"), ...glass(30), width: 760, padding: "30px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Logo f="opus-icon.png" size={96} />
            <div>
              <div style={{ ...type.display, fontSize: 46, color: WHITE }}>OpusClip</div>
              <div style={{ ...type.label, fontSize: 22, color: DIM }}>STARTER PLAN</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 22 }}>
            <div style={{ ...type.display, fontSize: 170, lineHeight: 1, color: WHITE, letterSpacing: "-0.05em" }}>${price}</div>
            <div style={{ ...type.display, fontSize: 52, color: DIM }}>/month</div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 20, color: DIM, marginTop: 10 }}>public pricing, Oct 2026 · can change</div>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. OpenShorts: bilkul free, open source, GitHub, 8,000+ stars

export const FreeScene: React.FC<S> = ({ t }) => {
  if (t < C.os - 0.1 || t > C.link + 0.3) return null;
  const o = 1 - eo(seg(t, C.link - 0.12, C.link + 0.13));
  const logo = pop(t, C.os, { damping: 9, stiffness: 220 });
  const repo = pop(t, C.github - 0.1, { damping: 12, stiffness: 190 });
  const up = eo(seg(t, C.github - 0.3, C.github + 0.1));
  const stars = Math.round(lerp(0, 8867, eo(seg(t, C.github + 0.1, C.stars + 0.9))));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.os} until={C.openSource} a={<>OpenShorts:</>} b={<>bilkul FREE!</>} />
      <Headline t={t} at={C.openSource} until={C.link} a={<>Open source.</>} b={<>GitHub par.</>} />
      {logo > 0 && up < 1 && (
        <div style={{ ...centre(540, 760, sc(logo) * (1 - up * 0.4)), opacity: 1 - up, display: "flex", alignItems: "center", gap: 30 }}>
          <Img src={L("openshorts-logo.png")} style={{ width: 230, filter: `drop-shadow(0 0 30px ${OR})` }} />
          <div style={{ position: "relative" }}>
            <div style={{ ...type.display, fontSize: 120, color: DIM, lineHeight: 1 }}>$15</div>
            <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 12, background: RED, transform: `rotate(-12deg) scaleX(${eo(seg(t, C.free - 0.1, C.free + 0.15))})` }} />
            <div style={{ ...type.display, fontSize: 170, lineHeight: 1, color: "#3DDC84", textShadow: "0 0 30px #3DDC8488", transform: `scale(${sc(pop(t, C.free, { damping: 8, stiffness: 240 }))})` }}>$0</div>
          </div>
        </div>
      )}
      {repo > 0 && (
        <div style={{ ...centre(540, 780, sc(repo)), width: 920, background: "#0D1117", border: "2px solid #30363D", borderRadius: 24, overflow: "hidden", boxShadow: `0 0 50px ${OR}33, 0 30px 60px rgba(0,0,0,0.6)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 26px", background: "#010409", borderBottom: "2px solid #30363D" }}>
            <Img src={L("github-mark-white.svg")} style={{ width: 52, height: 52 }} />
            <div style={{ fontFamily: mono, fontSize: 30, color: "#E6EDF3" }}>
              mutonby / <b>openshorts</b>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 20, color: "#9198A1", border: "2px solid #30363D", borderRadius: 999, padding: "2px 14px" }}>Public</div>
          </div>
          <div style={{ padding: "22px 26px" }}>
            <div style={{ fontSize: 26, color: "#E6EDF3", lineHeight: 1.35 }}>Open source AI clip generator: long videos → viral 9:16 shorts, with subtitles.</div>
            <div style={{ display: "flex", gap: 16, marginTop: 22, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: "2px solid #30363D", borderRadius: 12, padding: "10px 18px", background: "#161B22", transform: `scale(${t > C.stars ? 1 + 0.08 * Math.max(0, 1 - (t - C.stars) * 2) : 1})` }}>
                <span style={{ fontSize: 32, color: "#E3B341" }}>★</span>
                <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 32, color: "#E6EDF3" }}>{fmt(stars)}</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 26, color: "#9198A1" }}>⑂ 1,861</div>
              <div style={{ fontFamily: mono, fontSize: 26, color: "#9198A1" }}>⚖ MIT</div>
              <Pill color="#3DDC84" size={22} style={{ marginLeft: "auto" }}>FREE</Pill>
            </div>
          </div>
        </div>
      )}
      {repo > 0 && <div style={{ ...centre(540, 1100), fontFamily: mono, fontSize: 22, color: DIM, opacity: mix(repo) }}>github.com/mutonby/openshorts · stars on 18 Nov 2026</div>}
      <Burst t={t} at={C.free} x={700} y={760} r={420} color="#3DDC84" />
    </div>
  );
};

// =================================================================================================================
// 6. Link paste → AI finds best moments → vertical 9:16 → captions

export const FlowScene: React.FC<S> = ({ t }) => {
  if (t < C.link - 0.1 || t > C.baat + 0.3) return null;
  const o = 1 - eo(seg(t, C.baat - 0.12, C.baat + 0.13));
  const app = pop(t, C.link, { damping: 12, stiffness: 190 });
  const url = "youtube.com/watch?v=gta6-stream";
  const typed = url.slice(0, Math.floor(seg(t, C.link + 0.2, C.link + 1.1) * url.length));
  const scan = seg(t, C.aiBest - 0.1, C.vertical - 0.2);
  const phone = pop(t, C.vertical, { damping: 11, stiffness: 190 });
  const capWords = ["THIS", "IS", "CRAZY 🔥"];
  const nCap = Math.floor(seg(t, C.captions, C.captions + 0.9) * 3.99);
  const head = t < C.aiBest ? ["Link paste karo.", ""] : t < C.vertical ? ["AI best moments", "dhoondhega."] : t < C.captions ? ["Clips banengi", "vertical 9:16."] : ["Captions bhi", "apne aap."];
  const at = t < C.aiBest ? C.link : t < C.vertical ? C.aiBest : t < C.captions ? C.vertical : C.captions;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline key={at} t={t} at={at} until={C.baat} a={head[0]} b={head[1] || undefined} />
      {app > 0 && (
        <div style={{ ...centre(lerp(540, 380, eo(mix(phone))), 760, sc(app) * lerp(1, 0.78, eo(mix(phone)))), ...glass(26), width: 860, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Img src={L("openshorts-logo.png")} style={{ width: 40 }} />
            <div style={{ ...type.display, fontSize: 30, color: WHITE }}>openshorts</div>
            <div style={{ marginLeft: "auto" }}><Pill size={20}>get clips</Pill></div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, fontFamily: mono, fontSize: 26, color: WHITE, background: "#0B0714", border: `2px solid ${typed.length ? OR : LINE}`, borderRadius: 12, padding: "14px 16px", whiteSpace: "nowrap", overflow: "hidden" }}>🔗 {typed}{t % 1 < 0.5 ? "|" : ""}</div>
            <div style={{ ...type.display, fontSize: 28, color: "#170C22", background: OR, borderRadius: 12, padding: "12px 22px" }}>Go →</div>
          </div>
          {t > C.aiBest - 0.1 && (
            <div style={{ marginTop: 18, position: "relative", borderRadius: 14, overflow: "hidden", border: `2px solid ${LINE}` }}>
              <AiClip kind="city" t={t} w={808} h={300} radius={0} hud={false} />
              <div style={{ position: "absolute", left: 14, top: 14, ...type.label, fontSize: 18, color: "#170C22", background: OR, borderRadius: 6, padding: "3px 10px" }}>{scan < 1 ? `analyzing ${Math.round(scan * 100)}%` : "3 viral moments found"}</div>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: scan * 808, width: 4, background: PK, boxShadow: `0 0 20px ${PK}` }} />
              {[0.2, 0.5, 0.78].map((x, i) =>
                scan > x ? <div key={i} style={{ position: "absolute", left: x * 808 - 40, bottom: 12, ...type.label, fontSize: 18, color: WHITE, background: "rgba(0,0,0,0.7)", border: `2px solid ${OR}`, borderRadius: 8, padding: "3px 8px" }}>🔥 {[92, 87, 81][i]}/100</div> : null,
              )}
            </div>
          )}
        </div>
      )}
      {phone > 0 && (
        <div style={{ ...centre(lerp(1200, 850, eo(mix(phone))), 790, 1, "rotate(4deg)") }}>
          <PhoneShell w={250} dark glow={0.6}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <AiClip kind="character" t={t} w={234} h={445} radius={0} hud={false} />
              <div style={{ position: "absolute", left: 0, right: 0, top: "60%", textAlign: "center", ...type.display, fontSize: 34, color: WHITE, textShadow: "0 3px 0 #000, 0 0 12px #000" }}>
                {capWords.slice(0, nCap).map((w, i) => (
                  <span key={i} style={{ color: i === nCap - 1 ? "#FFE14D" : WHITE }}>{w} </span>
                ))}
              </div>
              <div style={{ position: "absolute", right: 8, top: 10, ...type.label, fontSize: 14, color: WHITE, background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "2px 6px" }}>9:16</div>
            </div>
          </PhoneShell>
        </div>
      )}
      {app > 0 && <Tag text="Illustration · not OpenShorts' real screen" x={110} y={1110} o={mix(app)} />}
    </div>
  );
};

// =================================================================================================================
// 7. Bas ek baat: free version runs on your computer, Docker + 8 GB RAM

export const NeedScene: React.FC<S> = ({ t }) => {
  if (t < C.baat - 0.1 || t > C.earning + 0.3) return null;
  const o = 1 - eo(seg(t, C.earning - 0.12, C.earning + 0.13));
  const term = pop(t, C.computer - 0.1, { damping: 12, stiffness: 190 });
  const cmd = "docker compose up --build";
  const typed = cmd.slice(0, Math.floor(seg(t, C.computer + 0.2, C.docker) * cmd.length));
  const chips = [
    { at: C.docker, icon: "🐳", text: "Docker" },
    { at: C.ram, icon: "🧠", text: "8 GB+ RAM" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.baat} until={C.earning} a={<>Bas ek baat:</>} b={<>apne computer pe.</>} />
      {term > 0 && (
        <div style={{ ...centre(540, 690, sc(term)), width: 860, background: "#0B0714", border: `2px solid ${LINE}`, borderRadius: 22, overflow: "hidden", boxShadow: `0 0 40px ${OR}33` }}>
          <div style={{ display: "flex", gap: 10, padding: "14px 18px", background: "#1A1226" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
            <div style={{ fontFamily: mono, fontSize: 20, color: DIM, marginLeft: 12 }}>terminal · self-host</div>
          </div>
          <div style={{ padding: "22px 26px", fontFamily: mono, fontSize: 34, color: "#E6EDF3", lineHeight: 1.6 }}>
            <div><span style={{ color: OR }}>$</span> git clone …/openshorts</div>
            <div><span style={{ color: OR }}>$</span> {typed}{t % 1 < 0.5 ? "▌" : ""}</div>
            {t > C.ram && <div style={{ color: "#3DDC84" }}>✓ dashboard on localhost:5175</div>}
          </div>
        </div>
      )}
      {chips.map((c, i) => {
        const k = pop(t, c.at, { damping: 9, stiffness: 230 });
        if (k <= 0) return null;
        return (
          <div key={c.text} style={{ ...centre(320 + i * 440, 1030, sc(k), `rotate(${i ? 3 : -3}deg)`), ...glass(22), padding: "14px 30px", display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 46 }}>{c.icon}</span>
            <span style={{ ...type.display, fontSize: 46, color: WHITE, whiteSpace: "nowrap" }}>{c.text}</span>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 8. Earning ka mauka, lekin risks: footage, YouTube rules, competition

export const RiskScene: React.FC<S> = ({ t }) => {
  if (t < C.earning - 0.1 || t > C.isliye + 0.3) return null;
  const o = 1 - eo(seg(t, C.isliye - 0.12, C.isliye + 0.13));
  const big = pop(t, C.risks, { damping: 8, stiffness: 240 });
  const rows = [
    { at: C.footage, icon: "🎮", a: "Footage", b: "Rockstar ki hai" },
    { at: C.youtube, icon: "▶", a: "YouTube", b: "monetization rules" },
    { at: C.competition, icon: "👥", a: "Competition", b: "bahut zyada" },
  ];
  const shake = t > C.risks && t < C.risks + 0.35 ? Math.sin(t * 90) * 8 * (1 - (t - C.risks) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateX(${shake}px)` }}>
      <Headline t={t} at={C.earning} until={C.isliye} a={<>Earning ka mauka hai,</>} b={<>lekin risks bhi.</>} />
      {big > 0 && (
        <div style={{ ...centre(540, 560, lerp(1.6, 1, Math.min(1, big)), "rotate(-5deg)"), ...type.display, fontSize: 150, color: RED, letterSpacing: "0.02em", textShadow: `0 0 40px ${RED}aa, 6px 6px 0 #000`, opacity: Math.min(1, big * 2) }}>RISKS</div>
      )}
      {rows.map((r, i) => {
        const k = pop(t, r.at, { damping: 12, stiffness: 200 });
        if (k <= 0) return null;
        return (
          <div key={r.a} style={{ position: "absolute", left: 120, width: 840, top: 690 + i * 140, transform: `translateX(${(1 - mix(k)) * -400}px)`, opacity: mix(k), ...glass(22, RED), padding: "18px 26px", display: "flex", alignItems: "center", gap: 20 }}>
            {r.a === "YouTube" ? <Img src={L("youtube-icon.png")} style={{ width: 60 }} /> : <span style={{ fontSize: 46 }}>{r.icon}</span>}
            <div>
              <div style={{ ...type.display, fontSize: 40, color: WHITE }}>{r.a}</div>
              <div style={{ ...type.body, fontSize: 26, color: DIM }}>{r.b}</div>
            </div>
            <div style={{ marginLeft: "auto", width: 54, height: 54, borderRadius: 27, background: RED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔒</div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 9. Sirf permission wale creators; launch se pehle aaj hi setup → MISSION PASSED

export const StartScene: React.FC<S> = ({ t }) => {
  if (t < C.isliye - 0.1 || t > C.guide + 0.3) return null;
  const o = 1 - eo(seg(t, C.guide - 0.12, C.guide + 0.13));
  const perm = pop(t, C.isliye + 0.3, { damping: 11, stiffness: 200 });
  const cal = pop(t, C.launch, { damping: 11, stiffness: 200 });
  const pass = pop(t, C.aaj, { damping: 8, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <Headline t={t} at={C.isliye} until={C.launch} a={<>Sirf unki clips</>} b={<>jo permission dein.</>} />
      <Headline t={t} at={C.launch} until={C.guide} a={<>Launch se pehle,</>} b={<>aaj hi setup karo.</>} />
      {perm > 0 && t < C.launch + 0.2 && (
        <div style={{ ...centre(540, 760, sc(perm) * (1 - eo(seg(t, C.launch - 0.1, C.launch + 0.2)))), ...glass(26, "#3DDC84"), padding: "26px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
          {["Creator ka campaign hai", "Ya permission di hai"].map((x, i) => (
            <div key={x} style={{ display: "flex", alignItems: "center", gap: 16, opacity: mix(pop(t, C.isliye + 0.4 + i * 0.6, { damping: 12, stiffness: 200 })) }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#3DDC84", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#0B2A16" }}>✓</div>
              <div style={{ ...type.display, fontSize: 44, color: WHITE, whiteSpace: "nowrap" }}>{x}</div>
            </div>
          ))}
        </div>
      )}
      {cal > 0 && (
        <div style={{ ...centre(540, 720, sc(cal)), display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{ ...glass(26, "#3DDC84"), width: 230, overflow: "hidden", transform: "rotate(-4deg)" }}>
            <div style={{ background: "#3DDC84", ...type.label, fontSize: 26, textAlign: "center", padding: "8px 0", color: "#0B2A16" }}>AAJ</div>
            <div style={{ ...type.display, fontSize: 130, color: WHITE, textAlign: "center", lineHeight: 1.05 }}>18</div>
            <div style={{ ...type.label, fontSize: 22, color: DIM, textAlign: "center", paddingBottom: 12 }}>NOVEMBER</div>
          </div>
          <div style={{ fontSize: 60, color: DIM }}>→</div>
          <div style={{ ...glass(26, RED), width: 230, overflow: "hidden", transform: "rotate(4deg)" }}>
            <div style={{ background: RED, ...type.label, fontSize: 26, textAlign: "center", padding: "8px 0", color: WHITE }}>LAUNCH</div>
            <div style={{ ...type.display, fontSize: 130, color: WHITE, textAlign: "center", lineHeight: 1.05 }}>19</div>
            <div style={{ ...type.label, fontSize: 22, color: DIM, textAlign: "center", paddingBottom: 12 }}>NOVEMBER</div>
          </div>
        </div>
      )}
      {pass > 0 && (
        <div style={{ ...centre(540, 990, lerp(1.7, 1, Math.min(1, pass)), "rotate(-4deg)"), opacity: Math.min(1, pass * 2), textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic", fontWeight: 900, fontSize: 88, color: "#FFC233", letterSpacing: "0.02em", textShadow: "4px 4px 0 #000, 0 0 30px #FFC23388", whiteSpace: "nowrap" }}>MISSION PASSED!</div>
          <div style={{ ...type.label, fontSize: 28, color: WHITE, textShadow: "2px 2px 0 #000" }}>SETUP TODAY ✓</div>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 10. CTA: comment CLIPPER, or type CLIPPER at the link in bio → follow

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.guide - 0.1) return null;
  const box = pop(t, C.comment - 0.1, { damping: 11, stiffness: 200 });
  const word = "CLIPPER";
  const typed = word.slice(0, Math.floor(seg(t, C.comment + 0.1, C.clipper + 0.3) * word.length));
  const posted = t > C.clipper + 0.35;
  const link = pop(t, C.bio, { damping: 10, stiffness: 210 });
  const typed2 = word.slice(0, Math.floor(seg(t, C.bio + 0.4, C.bio + 1.1) * word.length));
  const prof = pop(t, C.aisi, { damping: 12, stiffness: 190 });
  const click = t > C.follow + 0.3;
  const cursorK = eo(seg(t, C.follow - 0.4, C.follow + 0.2));
  const up = eo(seg(t, C.aisi - 0.25, C.aisi + 0.15));
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline t={t} at={C.guide} until={C.aisi} a={<>Poori setup guide?</>} b={<>Comment karo CLIPPER.</>} size={64} />
      <Headline t={t} at={C.aisi} until={99} a={<>Aisi aur AI tricks?</>} b={<>Follow kar lo!</>} />
      {box > 0 && (
        <div style={{ ...centre(540, lerp(640, 560, up), sc(box) * lerp(1, 0.8, up)), ...glass(22), width: 800, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: GRAD }} />
          <div style={{ flex: 1, fontSize: 36, color: WHITE, ...type.display }}>{typed}{!posted && t % 1 < 0.5 ? "|" : ""}</div>
          <div style={{ ...type.display, fontSize: 30, color: posted ? "#3DDC84" : OR }}>{posted ? "✓ Posted" : "Post"}</div>
        </div>
      )}
      {link > 0 && (
        <div style={{ ...centre(540, lerp(810, 720, up), sc(link) * lerp(1, 0.8, up), "rotate(-1.5deg)"), ...glass(26, PK), padding: "20px 34px", textAlign: "center" }}>
          <div style={{ ...type.display, fontSize: 52, color: WHITE }}>ya <span style={{ color: OR }}>LINK IN BIO</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, justifyContent: "center" }}>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 34, color: DIM }}>internetoolbox.com/links</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, color: "#170C22", background: WHITE, borderRadius: 10, padding: "4px 14px", minWidth: 150, textAlign: "left" }}>{typed2}{t % 1 < 0.5 ? "|" : ""}</div>
          </div>
        </div>
      )}
      {prof > 0 && (
        <div style={{ ...centre(540, 960, sc(prof)), ...glass(26), width: 800, padding: "20px 24px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: P.lime, border: "4px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 34, color: P.ink }}>IT</div>
          <div>
            <div style={{ ...type.display, fontSize: 36, color: WHITE }}>internetoolbox</div>
            <div style={{ ...type.body, fontSize: 24, color: DIM }}>AI · Tech · Free tools</div>
          </div>
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <div style={{ ...type.display, fontSize: 32, color: click ? WHITE : "#170C22", background: click ? "#2A2233" : OR, borderRadius: 14, padding: "12px 26px", transform: `scale(${click ? sc(pop(t, C.follow + 0.3, { damping: 8, stiffness: 260 })) : 1})` }}>{click ? "Following ✓" : "Follow"}</div>
            {cursorK > 0 && <div style={{ position: "absolute", left: lerp(220, 70, cursorK), top: lerp(160, 40, cursorK), fontSize: 64, transform: `scale(${click && t < C.follow + 0.45 ? 0.85 : 1})` }}>👆</div>}
          </div>
        </div>
      )}
      {click &&
        Array.from({ length: 6 }, (_, i) => {
          const k = seg(t, C.follow + 0.3 + i * 0.08, C.follow + 1.6 + i * 0.08);
          return k > 0 && k < 1 ? <div key={i} style={{ ...centre(820 + (i % 3) * 50, 900 - k * 300, 1), fontSize: 44, opacity: 1 - k, color: PK }}>❤</div> : null;
        })}
    </div>
  );
};

// keep shadow import used for future tweaks
void shadow;
