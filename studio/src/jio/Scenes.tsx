import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks, Stamp } from "../bonus/kit";
import { C, USES } from "../episodes/jio";
import { clamp01, eo, go, lerp, pop, seg } from "../mdh/kit";
import { BigLabel, centre, CloudIcon, DemoTag, PhoneShell, PhotoGrid, RED, Snap, StatusRow, WarnIcon } from "../immich/kit";

/**
 * "Jio ne AI free diya? (5 use cases)", scene by scene. Every time comes from src/episodes/jio.ts (cue table C), which
 * follows the owner's recording. Logos are the official files in public/jio/logos (Jio's own CDN and Google's gstatic
 * product logos). Nano Banana and Gemini CLI have no product logo, so they are labelled cards, never invented marks.
 * All app screens are our own drawings and are labelled Illustration.
 */

type S = { t: number };
const mix = (k: number) => Math.min(1, k);
const sc = (k: number) => mix(k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1);
const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);
const G = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const GREEN = "#1E9E57";
export const JIO_BLUE = "#0F3CC9";

export const CAM_ORIGIN = "540px 820px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.7) => amt * eo(seg(t, at, at + 0.3)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  return 1 + push(C.free, 0.05, 0.6) + USES.reduce((s, u) => s + push(u.nameAt, 0.04), 0) + push(C.cli, 0.04) + push(C.keyword + 0.4, 0.05);
};

/** Colour bars that sweep across on every use-case number, the bonus and the photo payoff. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[...USES.map((u) => u.at), C.coder, C.photosBaat].map((at, i) => {
      const k = seg(t, at - 0.22, at + 0.18);
      if (k <= 0 || k >= 1) return null;
      return (
        <div key={i} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
          <div style={{ flex: 1, background: i % 2 ? P.lime : P.ink }} />
          <div style={{ flex: 1, background: i % 2 ? P.ink : P.lime }} />
        </div>
      );
    })}
  </>
);

// =================================================================================================================
// Shared pieces

export type LogoKey = "jio" | "gemini" | "gmail" | "docs" | "photos" | "one" | "notebooklm" | "nano" | "cli";
const FILES: Partial<Record<LogoKey, string>> = { jio: "jio.svg", gemini: "gemini.png", gmail: "gmail.png", docs: "docs.png", photos: "photos.png", one: "google-one.png", notebooklm: "notebooklm.svg" };

/** Official logo on a white tile. Nano Banana and Gemini CLI get labelled cards instead of a made-up logo. */
export const Logo: React.FC<{ k: LogoKey; size: number; style?: React.CSSProperties; bare?: boolean }> = ({ k, size, style, bare = false }) => {
  const tile: React.CSSProperties = bare
    ? { width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }
    : { width: size, height: size, borderRadius: size * 0.24, background: k === "cli" ? "#16181d" : "#fff", border: `${Math.max(3, Math.round(size * 0.035))}px solid ${P.ink}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", boxSizing: "border-box", flexShrink: 0, ...style };
  if (k === "nano")
    return (
      <div style={{ ...tile, background: bare ? undefined : "#FFF6CC" }}>
        <div style={{ fontSize: size * 0.44, lineHeight: 1 }}>🍌</div>
        <div style={{ ...type.display, fontSize: size * 0.13, color: P.ink, lineHeight: 1.05, marginTop: size * 0.04, whiteSpace: "nowrap" }}>Nano Banana</div>
      </div>
    );
  if (k === "cli")
    return (
      <div style={tile}>
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.05 }}>
          <div style={{ fontFamily: "Consolas, monospace", fontWeight: 700, fontSize: size * 0.3, color: P.lime, lineHeight: 1 }}>&gt;_</div>
          <Img src={staticFile("jio/logos/gemini.png")} style={{ width: size * 0.3, height: size * 0.3 }} />
        </div>
        <div style={{ ...type.display, fontSize: size * 0.14, color: "#fff", marginTop: size * 0.06, whiteSpace: "nowrap" }}>Gemini CLI</div>
      </div>
    );
  return (
    <div style={tile}>
      <Img src={staticFile(`jio/logos/${FILES[k]}`)} style={{ width: k === "jio" ? "92%" : "74%", height: k === "jio" ? "92%" : "74%", objectFit: "contain" }} />
    </div>
  );
};

/** A plain app window frame (our own drawing, not any product's real interface). */
const Win: React.FC<{ w: number; h: number; title?: string; dark?: boolean; icon?: LogoKey; children?: React.ReactNode }> = ({ w, h, title, dark = false, icon, children }) => (
  <div style={{ width: w, height: h, background: dark ? "#16181d" : P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), overflow: "hidden", position: "relative", boxSizing: "border-box" }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: dark ? "#22252c" : P.paper2, borderBottom: `3px solid ${dark ? "#2e323a" : P.line}` }}>
      {[RED, "#F2B33D", GREEN].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
      ))}
      {icon && <Logo k={icon} size={30} bare style={{ marginLeft: 8 }} />}
      {title && <div style={{ ...type.label, fontSize: 20, color: dark ? "#9aa3b2" : P.ink2, marginLeft: icon ? 2 : 10, whiteSpace: "nowrap" }}>{title}</div>}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 50, bottom: 0 }}>{children}</div>
  </div>
);

const Caret: React.FC<{ t: number; color?: string }> = ({ t, color = P.ink }) => <span style={{ display: "inline-block", width: 4, height: "1em", background: color, marginLeft: 3, verticalAlign: "-0.12em", opacity: Math.sin(t * 12) > 0 ? 1 : 0 }} />;

const Chip: React.FC<{ text: string; tone?: "lime" | "ink" | "card" | "red" | "blue"; size?: number; style?: React.CSSProperties }> = ({ text, tone = "card", size = 30, style }) => {
  const bg = tone === "lime" ? P.lime : tone === "ink" ? P.ink : tone === "red" ? RED : tone === "blue" ? JIO_BLUE : P.card;
  const fg = tone === "ink" || tone === "red" || tone === "blue" ? "#fff" : P.ink;
  return <div style={{ ...type.display, fontSize: size, color: fg, background: bg, border: `4px solid ${P.ink}`, borderRadius: 99, padding: `${size * 0.22}px ${size * 0.7}px`, whiteSpace: "nowrap", boxShadow: shadow.hard(5), ...style }}>{text}</div>;
};

/** Small honest print under a scene. */
const Fine: React.FC<{ text: string; top: number; k: number; w?: number }> = ({ text, top, k, w = 860 }) =>
  k <= 0 ? null : (
    <div style={{ position: "absolute", left: (1080 - w) / 2, width: w, top, display: "flex", justifyContent: "center", opacity: k }}>
      <div style={{ ...type.body, fontSize: 24, lineHeight: 1.3, textAlign: "center", color: P.ink2, background: "rgba(255,255,255,0.9)", border: `3px solid ${P.line}`, borderRadius: 18, padding: "6px 18px" }}>{text}</div>
    </div>
  );

const Bars: React.FC<{ widths: number[]; k: number; color?: string; h?: number; gap?: number }> = ({ widths, k, color = P.ink3, h = 13, gap = 10 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {widths.map((w, n) => (
      <div key={n} style={{ height: h, width: `${w * 100 * clamp01(k * widths.length - n)}%`, background: color, borderRadius: h / 2 }} />
    ))}
  </div>
);

const Wave: React.FC<{ t: number; n?: number; h?: number; color?: string; w?: number }> = ({ t, n = 22, h = 30, color = P.lime, w = 8 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: h }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: w, borderRadius: w / 2, background: color, height: 6 + (h - 6) * Math.abs(Math.sin(t * 7 + i * 0.8)) }} />
    ))}
  </div>
);

// =================================================================================================================
// 0. Hook (0 to C.yeAt): Jio logo, ₹35,000 KA AI, FREE?!, then TUM SIRF CHAT KAR RAHE HO?

export const OpenerBg: React.FC<S> = ({ t }) => {
  const out = seg(t, C.tum - 0.15, C.tum + 0.2);
  if (out >= 1) return null;
  const glow = seg(t, 0, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 42%, #1b2340 0%, ${P.ink} 64%)`, opacity: 1 - out, overflow: "hidden" }}>
      {[JIO_BLUE, ...G].map((c, i) => {
        const a = t * 0.9 + (i * Math.PI * 2) / 5;
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 280 - 260, top: 760 + Math.sin(a) * 200 - 260, width: 520, height: 520, borderRadius: 999, background: c, opacity: (i === 0 ? 0.35 : 0.16) * glow, filter: "blur(90px)" }} />;
      })}
    </div>
  );
};

/** The Gemini sparkle used as a glow mark (the official 2025 file). */
const Sparkle: React.FC<{ size: number; spin?: number; style?: React.CSSProperties }> = ({ size, spin = 0, style }) => (
  <Img src={staticFile("jio/logos/gemini.png")} style={{ width: size, height: size, transform: `rotate(${spin}deg)`, filter: "drop-shadow(0 0 30px rgba(120,160,255,0.8))", ...style }} />
);

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.yeAt + 0.2) return null;
  const logo = pop(t, C.jio, { damping: 9, stiffness: 220 });
  const rs = pop(t, C.rupees, { damping: 8, stiffness: 240 });
  const ai = pop(t, C.ai, { damping: 9, stiffness: 230 });
  const free = pop(t, C.free, { damping: 7, stiffness: 260, mass: 0.6 });
  const part1Out = seg(t, C.tum - 0.15, C.tum + 0.1);
  const q = pop(t, C.tum, { damping: 10, stiffness: 210 });
  const chat = pop(t, C.chat, { damping: 9, stiffness: 230 });
  const phone = pop(t, C.tum + 0.05, { damping: 13, stiffness: 170 });
  const out = eo(seg(t, C.yeAt - 0.2, C.yeAt + 0.15));
  const sh = shakeAt(t, C.free, 18, 0.35) + shakeAt(t, C.rupees, 8, 0.3);
  const up = go(t, C.rupees - 0.1, C.rupees + 0.25);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${sh}px)` }}>
      {part1Out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - part1Out }}>
          {logo > 0 && (
            <div style={{ ...centre(lerp(540, 540, up), lerp(640, 430, up), sc(logo) * lerp(1.5, 0.9, up), `rotate(${(1 - mix(logo)) * -20}deg)`), filter: "drop-shadow(0 0 40px rgba(15,60,201,0.9))" }}>
              <Logo k="jio" size={200} bare />
            </div>
          )}
          {rs > 0 && (
            <div style={{ ...centre(540, 640, sc(rs), `rotate(${(1 - mix(rs)) * -8 - 2}deg)`), ...type.display, fontSize: 168, color: P.lime, whiteSpace: "nowrap", textShadow: `0 0 50px rgba(200,240,90,0.55), 10px 10px 0 ${P.olive}` }}>₹35,000</div>
          )}
          {ai > 0 && (
            <div style={{ ...centre(540, 800, sc(ai)), display: "flex", alignItems: "center", gap: 22, ...type.display, fontSize: 110, color: "#fff", whiteSpace: "nowrap" }}>
              KA <Sparkle size={110} spin={t * 40} /> AI
            </div>
          )}
          {free > 0 && (
            <div style={{ ...centre(540, 960, lerp(1.8, 1, mix(free)) * (free > 1 ? 1 + (free - 1) * 0.2 : 1), "rotate(-5deg)") }}>
              <div style={{ ...type.display, fontSize: 176, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 40, padding: "0 40px", boxShadow: `0 0 70px rgba(200,240,90,0.7)`, whiteSpace: "nowrap" }}>FREE?!</div>
            </div>
          )}
          <Burst t={t} at={C.free} x={540} y={960} r={460} color={P.lime} />
          <Sparks t={t} at={C.free + 0.05} x={540} y={960} n={14} r={420} />
          {t > C.rupees + 0.3 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1118, textAlign: "center", ...type.body, fontSize: 26, color: "#cfd6e4", opacity: seg(t, C.rupees + 0.3, C.rupees + 0.6) }}>
              Google AI Pro, 18 months · plan value ₹35,100 as listed by Jio
            </div>
          )}
        </div>
      )}
      {q > 0 && (
        <>
          <div style={{ ...centre(540, 455, sc(q), "rotate(-2deg)"), textAlign: "center", ...type.display, fontSize: 88, lineHeight: 1.02, color: P.ink, whiteSpace: "nowrap" }}>
            TUM SIRF <span style={{ background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 22, padding: "0 18px" }}>CHAT</span>
            <br />
            KAR RAHE HO?
          </div>
          <div style={{ ...centre(lerp(1250, 750, mix(phone)), 835, 1, `rotate(${lerp(14, 4, mix(phone))}deg)`) }}>
            <PhoneShell w={265}>
              <StatusRow w={246} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px 8px" }}>
                <Logo k="gemini" size={30} bare />
                <div style={{ ...type.display, fontSize: 22, color: P.ink }}>Chat</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 16px" }}>
                {["hi 👋", "ek joke sunao 😂", "aur ek 😅"].map((m, n) => {
                  const mk = pop(t, C.tum + 0.15 + n * 0.35, { damping: 12, stiffness: 220 });
                  return mk <= 0 ? null : (
                    <div key={n} style={{ alignSelf: "flex-end", transform: `scale(${mix(mk)})`, transformOrigin: "100% 50%", ...type.body, fontWeight: 700, fontSize: 21, color: P.ink, background: P.limeSoft, border: `3px solid ${P.ink}`, borderRadius: "16px 16px 4px 16px", padding: "6px 12px", whiteSpace: "nowrap" }}>{m}</div>
                  );
                })}
              </div>
            </PhoneShell>
          </div>
          {chat > 0 && (
            <div style={{ ...centre(330, 760, sc(chat), "rotate(-8deg)") }}>
              <Stamp p={chat} text="SIRF CHAT?" size={64} rotate={0} color={RED} />
            </div>
          )}
          <Fine k={seg(t, C.tum + 0.3, C.tum + 0.6)} top={1112} text="New claims closed 29 Oct 2026 · Already activated? Ye tumhare liye" w={900} />
        </>
      )}
    </div>
  );
};

// =================================================================================================================
// A. Countdown intro (C.yeAt to C.u5): 5 USE CASES, five cards spin into a board, 5 to 1.

const BOARD = [
  { x: 240, y: 655 },
  { x: 540, y: 655 },
  { x: 840, y: 655 },
  { x: 390, y: 945 },
  { x: 690, y: 945 },
];

export const CountdownScene: React.FC<S> = ({ t }) => {
  if (t < C.yeAt - 0.1 || t > C.u5 + 0.2) return null;
  const title = pop(t, C.yeAt + 0.05, { damping: 10, stiffness: 210 });
  const kaam = pop(t, C.kaam, { damping: 8, stiffness: 240 });
  const out = eo(seg(t, C.u5 - 0.25, C.u5 + 0.1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {title > 0 && (
        <div style={{ ...centre(540, 400, sc(title)) }}>
          <BigLabel text="5 USE CASES" size={84} tone="ink" />
        </div>
      )}
      {USES.map((u, i) => {
        const k = pop(t, C.paanchWord + i * 0.09, { damping: 11, stiffness: 200 });
        if (k <= 0) return null;
        const b = BOARD[i];
        const spin = (1 - mix(k)) * 360;
        return (
          <div key={i} style={{ ...centre(lerp(540, b.x, mix(k)), lerp(1300, b.y, mix(k)) + Math.sin(t * 2.2 + i) * 5, sc(k), `rotateY(${spin}deg) rotate(${(1 - mix(k)) * (i % 2 ? 14 : -14)}deg)`) }}>
            <div style={{ width: 250, height: 285, borderRadius: 34, background: P.card, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
              <div style={{ position: "absolute", left: -18, top: -18, width: 70, height: 70, borderRadius: 99, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 34, color: P.ink }}>{u.n}</div>
              <Logo k={u.logo} size={136} />
              <div style={{ ...type.display, fontSize: 30, color: P.ink, whiteSpace: "nowrap" }}>{u.short}</div>
            </div>
          </div>
        );
      })}
      {kaam > 0 && (
        <div style={{ ...centre(830, 1122, sc(kaam), "rotate(-4deg)") }}>
          <Sticker size={44} tone="lime" rotate={0}>
            YE 5 KAAM KARO ✓
          </Sticker>
        </div>
      )}
      <Sparks t={t} at={C.kaam} x={800} y={1110} n={10} r={220} />
    </div>
  );
};

// =================================================================================================================
// Use-case scenes: the number slams, the card lands, then shrinks to the top while the demo plays.

const UseCard: React.FC<{ i: number; w: number }> = ({ i, w }) => {
  const u = USES[i];
  return (
    <div style={{ width: w, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "36px 30px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: -28, top: -28, width: 96, height: 96, borderRadius: 99, background: P.lime, border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 44, color: P.ink }}>#{u.n}</div>
      <div style={{ display: "flex", gap: 18 }}>
        <Logo k={u.logo} size={190} />
        {u.logo2 && <Logo k={u.logo2} size={190} />}
      </div>
      <div style={{ ...type.display, fontSize: Math.min(76, (w - 70) / (u.title.length * 0.6)), color: P.ink, whiteSpace: "nowrap", lineHeight: 1.05 }}>{u.title}</div>
      <div style={{ ...type.display, fontSize: 30, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 99, padding: "6px 24px", whiteSpace: "nowrap" }}>{u.chip}</div>
    </div>
  );
};

export const UseScene: React.FC<S & { i: number }> = ({ t, i }) => {
  const u = USES[i];
  if (t < u.at - 0.1 || t > u.end + 0.1) return null;
  const num = pop(t, u.at, { damping: 9, stiffness: 240 });
  const numOut = seg(t, u.nameAt - 0.15, u.nameAt + 0.08);
  const cardK = pop(t, u.nameAt - 0.05, { damping: 11, stiffness: 200 });
  const up = go(t, u.demo - 0.35, u.demo + 0.15);
  const out = eo(seg(t, u.end - 0.22, u.end + 0.05));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-160 * out}px)` }}>
      {num > 0 && numOut < 1 && (
        <div style={{ ...centre(540, 700, sc(num) * (1 - 0.4 * numOut), `rotate(${(1 - mix(num)) * -14}deg)`), opacity: 1 - numOut, ...type.display, fontSize: 400, color: P.lime, WebkitTextStroke: `10px ${P.ink}`, textShadow: `16px 16px 0 ${P.ink}`, lineHeight: 1 }}>
          #{u.n}
        </div>
      )}
      <Burst t={t} at={u.nameAt} x={540} y={690} r={430} color={P.lime} />
      {cardK > 0 && up < 1 && (
        <div style={{ ...centre(540, lerp(690, 455, up), sc(cardK) * lerp(1, 0.5, up) * (1 + (i === 4 ? 0.06 * Math.sin(Math.PI * seg(t, C.nbAgain, C.nbAgain + 0.35)) : 0))), opacity: 1 - seg(up, 0.85, 1) }}>
          <UseCard i={i} w={720} />
        </div>
      )}
      {up > 0.8 && (
        <div style={{ ...centre(540, 425, 1), display: "flex", alignItems: "center", gap: 16, opacity: seg(up, 0.8, 1) }}>
          <div style={{ width: 70, height: 70, borderRadius: 99, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 34, color: P.ink }}>#{u.n}</div>
          <BigLabel text={u.label} size={58} tone="ink" rotate={-1} />
        </div>
      )}
      <Sparks t={t} at={u.nameAt + 0.05} x={540} y={620} n={12} r={380} />
      {i === 4 && t > C.kaamKa && up < 0.5 && (
        <div style={{ ...centre(560, 1000, sc(pop(t, C.kaamKa, { damping: 8, stiffness: 240 })), "rotate(-4deg)"), opacity: 1 - seg(up, 0, 0.5) }}>
          <Sticker size={40} tone="lime" rotate={0}>
            SABSE KAAM KA ⭐
          </Sticker>
        </div>
      )}
      {i === 0 && <PhotoDemo t={t} />}
      {i === 1 && <GmailDemo t={t} />}
      {i === 2 && <StorageDemo t={t} />}
      {i === 3 && <DocsDemo t={t} />}
      {i === 4 && <NotebookDemo t={t} />}
    </div>
  );
};

// #5 Photo editing: say it, the background swaps, an old photo is restored, Nano Banana.
const Person: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 1.1} viewBox="0 0 100 110" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)" }}>
    <path d="M14 110 C16 78 30 66 50 66 C70 66 84 78 86 110 Z" fill="#2F4A6B" stroke={P.ink} strokeWidth={3} />
    <circle cx={50} cy={40} r={22} fill="#C98E64" stroke={P.ink} strokeWidth={3} />
    <path d="M28 36 C28 18 44 12 54 14 C66 16 74 26 72 38 C66 30 54 26 40 30 C34 32 30 34 28 36 Z" fill="#1d1712" />
  </svg>
);

const PhotoDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.u5Demo - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const cmd = "Background badlo";
  const typed = cmd.slice(0, Math.floor(cmd.length * seg(t, C.bgAt - 0.1, C.bgAt + 0.45)));
  const swap = eo(seg(t, C.bgAt + 0.5, C.bgAt + 0.95));
  const old = pop(t, C.oldAt - 0.15, { damping: 12, stiffness: 190 });
  const fix = eo(seg(t, C.oldAt + 0.45, C.oldAt + 1.0));
  const nano = pop(t, C.nanoAt, { damping: 8, stiffness: 240 });
  return (
    <>
      <div style={{ ...centre(540, 600, mix(k)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 99, padding: "10px 26px 10px 14px", boxShadow: shadow.hard(6) }}>
          <div style={{ width: 54, height: 54, borderRadius: 99, background: P.lime, border: `3px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🎙️</div>
          <div style={{ ...type.display, fontSize: 34, color: P.ink, whiteSpace: "nowrap", minWidth: 330 }}>
            {t < C.bgAt - 0.1 ? <Wave t={t} n={14} h={34} color={P.ink} w={7} /> : `"${typed}"`}
            {t >= C.bgAt - 0.1 && t < C.bgAt + 0.5 && <Caret t={t} />}
          </div>
        </div>
      </div>
      {/* Background swap */}
      <div style={{ ...centre(lerp(-200, 300, mix(k)), 850, 1, "rotate(-3deg)") }}>
        <div style={{ width: 360, height: 400, borderRadius: 24, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8), overflow: "hidden", position: "relative", background: "#8a8f98" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#9aa0a8, #6f747c)" }} />
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - swap * 100}% 0 0)` }}>
            <Snap kind="sunset" seed={3} w={360} h={400} r={0} />
          </div>
          <Person w={250} />
          {swap > 0 && swap < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${swap * 100}%`, width: 8, marginLeft: -4, background: "#fff", boxShadow: "0 0 20px #fff" }} />}
          <div style={{ position: "absolute", left: 12, top: 12, ...type.display, fontSize: 22, color: P.ink, background: swap > 0.5 ? P.lime : P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "2px 10px" }}>{swap > 0.5 ? "AFTER ✓" : "BEFORE"}</div>
        </div>
      </div>
      {/* Old photo restore */}
      {old > 0 && (
        <div style={{ ...centre(lerp(1300, 775, mix(old)), 852, sc(old), "rotate(4deg)") }}>
          <div style={{ width: 340, height: 400, background: "#f4ecd8", border: `6px solid ${P.ink}`, borderRadius: 14, boxShadow: shadow.hard(8), padding: 16, boxSizing: "border-box", position: "relative" }}>
            <div style={{ width: "100%", height: 300, overflow: "hidden", borderRadius: 6, position: "relative", filter: `sepia(${1 - fix}) contrast(${lerp(0.8, 1, fix)}) blur(${lerp(1.4, 0, fix)}px) saturate(${lerp(0.6, 1, fix)})` }}>
              <Snap kind="family" seed={2} w={308} h={300} r={0} />
              <svg width={308} height={300} style={{ position: "absolute", inset: 0, opacity: 1 - fix }}>
                <path d="M40 0 L70 120 L60 300" stroke="#fff" strokeWidth={4} fill="none" opacity={0.8} />
                <path d="M300 60 L180 110 L120 90" stroke="#fff" strokeWidth={3} fill="none" opacity={0.7} />
                <circle cx={230} cy={220} r={26} fill="#fff" opacity={0.35} />
              </svg>
            </div>
            <div style={{ ...type.display, fontSize: 26, color: P.ink2, textAlign: "center", marginTop: 10 }}>{fix > 0.5 ? "Theek ho gayi ✓" : "Purani photo"}</div>
          </div>
        </div>
      )}
      <Sparks t={t} at={C.oldAt + 1.0} x={775} y={870} n={10} r={240} />
      {nano > 0 && (
        <div style={{ ...centre(540, 1100, sc(nano), "rotate(-3deg)") }}>
          <Chip text="🍌 NANO BANANA · in Gemini" tone="lime" size={36} />
        </div>
      )}
      <DemoTag text="Illustration" style={{ left: 120, top: 1062, opacity: mix(k) * (1 - mix(nano)) }} />
    </>
  );
};

// #4 Gmail: an overflowing inbox, Gemini summarises it, then drafts a reply.
const MAILS = ["Bank: Statement ready", "Sale! 70% off 🔥", "Team: Meeting kal?", "Order #4821 shipped", "Newsletter #188", "OTP 482913", "Electricity bill due", "Offer just for you"];
const GmailDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.u4Demo - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const count = Math.round(lerp(1240, 9999, eo(seg(t, C.u4Demo, C.u4Demo + 0.9))));
  const scroll = (t - C.u4Demo) * 60;
  const panel = pop(t, C.sumAt - 0.1, { damping: 12, stiffness: 190 });
  const sum = seg(t, C.sumAt + 0.3, C.sumAt + 1.0);
  const reply = pop(t, C.replyAt, { damping: 11, stiffness: 200 });
  const text = "Thanks! Kal 4 baje meeting done 👍";
  const typed = text.slice(0, Math.floor(text.length * seg(t, C.replyAt + 0.25, C.replyAt + 1.1)));
  return (
    <>
      <div style={{ ...centre(lerp(-260, 300, mix(k)), 840, 1, `rotate(${-2 + shakeAt(t, C.u4Demo + 0.9, 2, 0.4)}deg)`) }}>
        <Win w={480} h={500} title="Inbox" icon="gmail">
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ ...type.display, fontSize: 26, color: P.ink }}>Inbox</div>
            <div style={{ ...type.display, fontSize: 26, color: "#fff", background: RED, borderRadius: 99, padding: "2px 14px" }}>{count >= 9999 ? "9,999+" : count.toLocaleString("en-IN")}</div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 56, bottom: 0, overflow: "hidden" }}>
            <div style={{ transform: `translateY(${-(scroll % 62)}px)` }}>
              {Array.from({ length: 10 }, (_, n) => (
                <div key={n} style={{ height: 62, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderBottom: `2px solid ${P.line}`, opacity: 1 - 0.55 * mix(panel) }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: G[(n + Math.floor(scroll / 62)) % 4] }} />
                  <div style={{ ...type.body, fontWeight: 700, fontSize: 21, color: P.ink, whiteSpace: "nowrap" }}>{MAILS[(n + Math.floor(scroll / 62)) % MAILS.length]}</div>
                </div>
              ))}
            </div>
          </div>
        </Win>
      </div>
      {panel > 0 && (
        <div style={{ ...centre(lerp(1300, 790, mix(panel)), 830, 1, "rotate(2deg)") }}>
          <Win w={440} h={520} title="Gemini" icon="gemini">
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ alignSelf: "flex-end", ...type.body, fontWeight: 700, fontSize: 22, color: P.ink, background: P.limeSoft, border: `3px solid ${P.ink}`, borderRadius: "16px 16px 4px 16px", padding: "6px 14px" }}>Summary do ✨</div>
              {[
                ["💳", "Bill due: Friday"],
                ["📦", "Order shipped"],
                ["📅", "Meeting kal 4 PM"],
              ].map(([ic, tx], n) => {
                const r = clamp01(sum * 3 - n);
                return (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 14, padding: "8px 12px", opacity: r, transform: `translateX(${(1 - eo(r)) * 60}px)` }}>
                    <div style={{ fontSize: 26 }}>{ic}</div>
                    <div style={{ ...type.display, fontSize: 24, color: P.ink, whiteSpace: "nowrap" }}>{tx}</div>
                  </div>
                );
              })}
              {reply > 0 && (
                <div style={{ transform: `scale(${mix(reply)})`, transformOrigin: "50% 0", background: "#fff", border: `3px solid ${P.ink}`, borderRadius: 14, padding: "8px 12px" }}>
                  <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>✍️ DRAFT REPLY</div>
                  <div style={{ ...type.body, fontWeight: 700, fontSize: 21, color: P.ink, minHeight: 56 }}>
                    {typed}
                    {t < C.replyAt + 1.2 && <Caret t={t} />}
                  </div>
                </div>
              )}
            </div>
          </Win>
        </div>
      )}
      <Sparks t={t} at={C.sumAt + 0.4} x={790} y={760} n={10} r={260} />
      <DemoTag text="Illustration" style={{ left: 90, top: 1100, opacity: mix(k) }} />
    </>
  );
};

// #3 Storage: phone photos fly into the cloud, the meter jumps from 15 GB to 2 TB.
const KINDS = ["family", "sunset", "food", "pet", "mountain", "lake", "city", "flower"] as const;
const StorageDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.u3Demo - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const tb = pop(t, C.tbAt, { damping: 8, stiffness: 230 });
  const meter = eo(seg(t, C.tbAt, C.tbAt + 0.7));
  const backup = seg(t, C.backupAt, C.backupAt + 1.6);
  return (
    <>
      <div style={{ ...centre(lerp(-200, 250, mix(k)), 860, 1, "rotate(-4deg)") }}>
        <PhoneShell w={260}>
          <StatusRow w={242} />
          <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Logo k="photos" size={30} bare />
            <div style={{ ...type.display, fontSize: 20, color: P.ink }}>Photos</div>
          </div>
          <div style={{ padding: "0 10px" }}>
            <PhotoGrid w={222} rows={5} kinds={[...KINDS]} gap={5} />
          </div>
        </PhoneShell>
      </div>
      <div style={{ ...centre(lerp(1300, 760, mix(k)), 700, 1) }}>
        <div style={{ position: "relative", width: 400, height: 280 }}>
          <CloudIcon size={400} fill={P.card} stroke={4} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", justifyContent: "center", gap: 14 }}>
            <Logo k="one" size={86} bare />
            <Logo k="photos" size={86} bare />
          </div>
        </div>
      </div>
      {/* photos flying to the cloud */}
      {backup > 0 &&
        Array.from({ length: 8 }, (_, n) => {
          const f = clamp01(backup * 2.2 - n * 0.16);
          if (f <= 0 || f >= 1) return null;
          const x = lerp(250, 760, eo(f));
          const y = lerp(860, 720, eo(f)) - Math.sin(f * Math.PI) * 140;
          return (
            <div key={n} style={{ ...centre(x, y, lerp(1, 0.5, f), `rotate(${n * 23}deg)`), opacity: 1 - seg(f, 0.85, 1) }}>
              <Snap kind={KINDS[n % KINDS.length]} seed={n} w={90} h={90} r={10} style={{ border: `4px solid ${P.ink}` }} />
            </div>
          );
        })}
      {backup > 0.9 && (
        <div style={{ ...centre(760, 860, mix(pop(t, C.backupAt + 1.5, { damping: 10 }))) }}>
          <Chip text="✓ Backup ho gaya" tone="card" size={30} />
        </div>
      )}
      {tb > 0 && (
        <div style={{ ...centre(760, 990, sc(tb)) }}>
          <div style={{ width: 440, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "14px 20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>STORAGE</div>
              <div style={{ ...type.display, fontSize: 52, color: P.ink }}>{meter < 0.5 ? "15 GB" : "2 TB"}</div>
            </div>
            <div style={{ marginTop: 8, height: 30, borderRadius: 99, background: P.paper2, border: `3px solid ${P.ink}`, overflow: "hidden" }}>
              <div style={{ width: `${lerp(8, 100, meter)}%`, height: "100%", background: P.lime }} />
            </div>
          </div>
        </div>
      )}
      <Sparks t={t} at={C.tbAt + 0.5} x={760} y={990} n={10} r={260} />
      <DemoTag text="Illustration" style={{ left: 90, top: 1110, opacity: mix(k) }} />
    </>
  );
};

// #2 Google Docs: rough notes go in, Gemini writes the document.
const NOTES = ["• trip plan Goa", "• 3 din, 4 log", "• budget ₹20k", "• train + hotel"];
const DocsDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.u2Demo - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const notes = pop(t, C.u2Demo, { damping: 11, stiffness: 200 });
  const glow = seg(t, C.notesAt, C.notesAt + 0.3) * (1 - seg(t, C.docAt + 0.8, C.docAt + 1.1));
  const doc = seg(t, C.docAt - 0.2, C.docAt + 0.9);
  const ready = pop(t, C.docAt + 0.6, { damping: 8, stiffness: 240 });
  return (
    <>
      {notes > 0 && (
        <div style={{ ...centre(lerp(-200, 245, mix(notes)), 820, sc(notes), "rotate(-5deg)") }}>
          <div style={{ width: 330, background: "#FFF3A6", border: `5px solid ${P.ink}`, borderRadius: 10, boxShadow: `${shadow.hard(7)}${glow > 0 ? `, 0 0 ${50 * glow}px rgba(66,133,244,${0.6 * glow})` : ""}`, padding: "18px 22px", boxSizing: "border-box" }}>
            <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>MY NOTES</div>
            {NOTES.map((n, j) => (
              <div key={j} style={{ fontFamily: "'Segoe Print', 'Comic Sans MS', cursive", fontSize: 30, color: P.ink, whiteSpace: "nowrap" }}>{n}</div>
            ))}
          </div>
        </div>
      )}
      {glow > 0 && (
        <div style={{ ...centre(470, 1010, mix(glow)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo k="gemini" size={70} bare style={{ transform: `rotate(${t * 160}deg)` }} />
            <div style={{ ...type.display, fontSize: 60, color: P.ink }}>→</div>
          </div>
        </div>
      )}
      <div style={{ ...centre(lerp(1300, 720, mix(k)), 840, 1, "rotate(2deg)") }}>
        <Win w={470} h={560} title="Trip Plan" icon="docs">
          <div style={{ padding: "18px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
            {doc <= 0 && (
              <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, ...type.display, fontSize: 24, color: P.ink, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "6px 16px", opacity: seg(t, C.u2Demo + 0.3, C.u2Demo + 0.6) }}>
                <Logo k="gemini" size={28} bare /> Help me create
              </div>
            )}
            <div style={{ ...type.display, fontSize: 34, color: P.ink, opacity: clamp01(doc * 4) }}>Goa Trip Plan ✈️</div>
            <div style={{ ...type.label, fontSize: 20, color: P.ink3, opacity: clamp01(doc * 4 - 0.5) }}>OVERVIEW</div>
            <Bars widths={[0.95, 0.9, 0.7]} k={clamp01(doc * 2 - 0.3)} color={P.ink2} h={12} gap={9} />
            <div style={{ ...type.label, fontSize: 20, color: P.ink3, opacity: clamp01(doc * 3 - 1.4) }}>BUDGET</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, opacity: clamp01(doc * 3 - 1.6) }}>
              {["Train", "₹6,000", "Hotel", "₹9,000", "Food", "₹5,000"].map((c, j) => (
                <div key={j} style={{ ...type.body, fontWeight: 700, fontSize: 21, color: P.ink, background: j % 2 ? P.limeSoft : P.paper2, borderRadius: 8, padding: "3px 10px" }}>{c}</div>
              ))}
            </div>
            <Bars widths={[0.9, 0.6]} k={clamp01(doc * 3 - 2)} color={P.ink3} h={12} gap={9} />
          </div>
        </Win>
      </div>
      {ready > 0 && (
        <div style={{ ...centre(720, 1100, sc(ready), "rotate(-3deg)") }}>
          <Chip text="✓ Document ready" tone="lime" size={34} />
        </div>
      )}
      <Sparks t={t} at={C.docAt + 0.6} x={720} y={1000} n={10} r={260} />
      <DemoTag text="Illustration" style={{ left: 90, top: 1100, opacity: mix(k) }} />
    </>
  );
};

// #1 NotebookLM: a PDF and a YouTube link go in, a Hindi audio overview comes out.
const NotebookDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.u1Demo - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const pdf = pop(t, C.pdfAt, { damping: 11, stiffness: 190 });
  const yt = pop(t, C.ytAt, { damping: 11, stiffness: 190 });
  const hindi = pop(t, C.hindiAt, { damping: 9, stiffness: 220 });
  const pod = pop(t, C.podcastAt, { damping: 10, stiffness: 200 });
  const suno = pop(t, C.suno, { damping: 9, stiffness: 220 });
  const read = seg(t, C.suno - 0.1, C.suno + 0.3);
  return (
    <>
      {pdf > 0 && (
        <div style={{ ...centre(lerp(-100, 215, mix(pdf)), 700, sc(pdf), "rotate(-6deg)"), width: 200, height: 240, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(6), padding: 18, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ ...type.display, fontSize: 28, color: "#fff", background: RED, borderRadius: 8, padding: "2px 12px", alignSelf: "flex-start" }}>PDF</div>
          <Bars widths={[0.9, 0.7, 0.85, 0.6, 0.75]} k={1} color={P.line} h={10} />
        </div>
      )}
      {yt > 0 && (
        <div style={{ ...centre(lerp(-160, 235, mix(yt)), 935, sc(yt), "rotate(4deg)") }}>
          <div style={{ width: 300, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(6), padding: "12px 16px", boxSizing: "border-box" }}>
            <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>🔗 YOUTUBE LINK</div>
            <div style={{ ...type.body, fontWeight: 700, fontSize: 22, color: SKY, whiteSpace: "nowrap", overflow: "hidden" }}>youtube.com/watch?v=…</div>
          </div>
        </div>
      )}
      <div style={{ ...centre(lerp(1300, 700, mix(k)), 830, 1) }}>
        <Win w={540} h={500} title="NotebookLM" icon="notebooklm">
          <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>SOURCES · {(pdf > 0 ? 1 : 0) + (yt > 0 ? 1 : 0)}</div>
            <Bars widths={[0.9, 0.75]} k={clamp01((t - C.pdfAt) * 1.5)} color={P.line} h={12} />
            {hindi > 0 && (
              <div style={{ alignSelf: "flex-start", transform: `scale(${sc(hindi)})`, transformOrigin: "0 50%" }}>
                <Chip text="Language: हिंदी ✓" tone="lime" size={28} />
              </div>
            )}
            {pod > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.ink, borderRadius: 18, padding: "14px 16px", transform: `scale(${sc(pod)})` }}>
                <div style={{ width: 60, height: 60, borderRadius: 99, background: P.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>▶</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <div style={{ ...type.display, fontSize: 26, color: "#fff", whiteSpace: "nowrap" }}>🎧 Audio Overview · Hindi</div>
                  <Wave t={t} />
                </div>
              </div>
            )}
          </div>
        </Win>
      </div>
      {suno > 0 && (
        <div style={{ ...centre(560, 1100, sc(suno), "rotate(-2deg)") }}>
          <div style={{ ...type.display, fontSize: 46, color: P.ink, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 24, padding: "6px 26px", boxShadow: shadow.hard(8), whiteSpace: "nowrap" }}>
            <span style={{ textDecoration: read > 0.5 ? "line-through" : "none", textDecorationThickness: 6, opacity: 0.6 }}>📖 READ LESS</span> · 🎧 LISTEN MORE
          </div>
        </div>
      )}
      <Sparks t={t} at={C.podcastAt + 0.1} x={700} y={960} n={10} r={260} />
      <DemoTag text="Illustration" style={{ left: 90, top: 1060, opacity: mix(k) * (1 - mix(suno)) }} />
    </>
  );
};
const SKY = "#2F6FDE";

// =================================================================================================================
// Tease (C.tease to C.u3): 18 months later? Photos dim. End mein bataunga.

const Calendar: React.FC<{ w: number; top: string; big: string; tone?: "lime" | "red" | "ink" }> = ({ w, top, big, tone = "ink" }) => (
  <div style={{ width: w, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(10), overflow: "hidden" }}>
    <div style={{ background: tone === "red" ? RED : tone === "lime" ? P.lime : P.ink, color: tone === "lime" ? P.ink : "#fff", ...type.display, fontSize: w * 0.12, textAlign: "center", padding: "6px 0", whiteSpace: "nowrap" }}>{top}</div>
    <div style={{ ...type.display, fontSize: w * 0.3, color: P.ink, textAlign: "center", lineHeight: 1.15, padding: "6px 0 10px", whiteSpace: "nowrap" }}>{big}</div>
  </div>
);

export const TeaseScene: React.FC<S> = ({ t }) => {
  if (t < C.tease - 0.1 || t > C.u3 + 0.1) return null;
  const k = pop(t, C.tease, { damping: 10, stiffness: 210 });
  const cal = pop(t, C.teaseCal, { damping: 9, stiffness: 220 });
  const flip = seg(t, C.teaseCal, C.teaseCal + 0.8);
  const months = Math.round(lerp(0, 18, eo(flip)));
  const dim = seg(t, C.teasePhotos, C.teasePhotos + 0.6);
  const end = pop(t, C.endMein, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.u3 - 0.2, C.u3 + 0.05));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, background: `rgba(23,23,23,${0.06 * mix(k)})` }}>
      {k > 0 && (
        <div style={{ ...centre(540, 400, sc(k)) }}>
          <BigLabel text="AUR EK CHEEZ..." size={70} tone="ink" />
        </div>
      )}
      {cal > 0 && (
        <div style={{ ...centre(300, 780, sc(cal), `rotate(${-4 + Math.sin(flip * 30) * 3 * (1 - flip)}deg)`) }}>
          <Calendar w={330} top="+ MONTHS" big={`${months}`} tone={months >= 18 ? "red" : "ink"} />
        </div>
      )}
      {k > 0 && (
        <div style={{ ...centre(770, 800, mix(k), "rotate(3deg)") }}>
          <div style={{ position: "relative", filter: `grayscale(${dim}) brightness(${lerp(1, 0.55, dim)})` }}>
            {[2, 1, 0].map((n) => (
              <div key={n} style={{ position: n ? "absolute" : "relative", left: n * 18, top: -n * 18, transform: `rotate(${n * 5}deg)` }}>
                <Snap kind={KINDS[n]} seed={n + 4} w={300} h={300} r={16} style={{ border: `6px solid ${P.ink}` }} />
              </div>
            ))}
          </div>
          {dim > 0.3 && (
            <div style={{ ...centre(150, 150, sc(pop(t, C.teasePhotos + 0.3, { damping: 8 }))) }}>
              <WarnIcon size={130} />
            </div>
          )}
        </div>
      )}
      {dim > 0.4 && (
        <div style={{ ...centre(540, 1010, sc(pop(t, C.teasePhotos + 0.25, { damping: 9 })), "rotate(-2deg)") }}>
          <Chip text="18 MONTHS LATER?" tone="red" size={46} />
        </div>
      )}
      {end > 0 && (
        <div style={{ ...centre(540, 1105, sc(end), "rotate(3deg)") }}>
          <Sticker size={36} tone="lime" rotate={0}>
            END MEIN BATAUNGA 👀
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// Bonus (C.coder to C.photosBaat): Gemini CLI in a terminal.

const CLI_LINES = [
  { p: "$ ", s: "gemini", c: P.lime },
  { p: "> ", s: "is function ka bug fix karo", c: "#fff" },
  { p: "✦ ", s: "Found it: loop off by one. Fixed ✓", c: "#8ab4f8" },
];
export const BonusScene: React.FC<S> = ({ t }) => {
  if (t < C.coder - 0.1 || t > C.photosBaat + 0.1) return null;
  const head = pop(t, C.coder, { damping: 9, stiffness: 230 });
  const term = pop(t, C.coder + 0.15, { damping: 12, stiffness: 190 });
  const name = pop(t, C.cli, { damping: 8, stiffness: 240 });
  const free = pop(t, C.cliFree, { damping: 8, stiffness: 240 });
  const out = eo(seg(t, C.photosBaat - 0.22, C.photosBaat + 0.05));
  const span = Math.max(0.6, C.photosBaat - C.coder - 0.5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)) }}>
          <BigLabel text={name > 0 ? "BONUS: GEMINI CLI" : "CODER HO? 👨‍💻"} size={66} tone={name > 0 ? "lime" : "ink"} />
        </div>
      )}
      {term > 0 && (
        <div style={{ ...centre(540, 770, mix(term), "rotate(-1deg)") }}>
          <Win w={860} h={380} title="Terminal" dark>
            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16, fontFamily: "Consolas, 'Courier New', monospace", fontSize: 32 }}>
              {name > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, transform: `scale(${sc(name)})`, transformOrigin: "0 50%" }}>
                  <Logo k="gemini" size={56} bare />
                  <div style={{ ...type.display, fontSize: 52, background: "linear-gradient(90deg,#4285F4,#9b72cb,#d96570)", WebkitBackgroundClip: "text", color: "transparent" }}>Gemini CLI</div>
                </div>
              )}
              {CLI_LINES.map((l, n) => {
                const typed = l.s.slice(0, Math.floor(l.s.length * seg(t, C.coder + 0.2 + (n * span) / 3, C.coder + 0.2 + ((n + 0.8) * span) / 3)));
                return (
                  <div key={n} style={{ color: l.c, whiteSpace: "nowrap" }}>
                    <span style={{ color: "#6b7280" }}>{l.p}</span>
                    {typed}
                  </div>
                );
              })}
            </div>
          </Win>
        </div>
      )}
      {free > 0 && (
        <div style={{ ...centre(860, 585, sc(free), "rotate(8deg)") }}>
          <Stamp p={free} text="FREE" size={80} rotate={0} color={GREEN} />
        </div>
      )}
      <Fine k={seg(t, C.cliFree + 0.2, C.cliFree + 0.5)} top={1010} text="Free tier with a Google account · daily limits apply" w={760} />
      <Sparks t={t} at={C.cliFree + 0.05} x={860} y={585} n={10} r={220} />
    </div>
  );
};

// =================================================================================================================
// The photo payoff (C.photosBaat to C.share): plan ends, no auto-renew, back to 15 GB, backup stops, note the date.

export const WarningScene: React.FC<S> = ({ t }) => {
  if (t < C.photosBaat - 0.1 || t > C.share + 0.15) return null;
  const head = pop(t, C.photosBaat, { damping: 10, stiffness: 210 });
  // Phase 1: calendar and plan end
  const cal = pop(t, C.plan18 - 0.1, { damping: 10, stiffness: 210 });
  const flip = seg(t, C.plan18, C.plan18 + 0.7);
  const ends = pop(t, C.planEnd, { damping: 8, stiffness: 240 });
  const renew = pop(t, C.autoRenew, { damping: 8, stiffness: 240 });
  const p1Out = eo(seg(t, C.gb15 - 0.25, C.gb15));
  // Phase 2: storage drops, backup blocked
  const meterK = pop(t, C.gb15 - 0.05, { damping: 11, stiffness: 200 });
  const shrink = eo(seg(t, C.gb15 + 0.1, C.gb15 + 0.8));
  const flow = seg(t, C.overAt, C.overAt + 1.0);
  const blocked = pop(t, C.noBackup, { damping: 8, stiffness: 240 });
  const p2Out = eo(seg(t, C.activation - 0.2, C.activation + 0.05));
  // Phase 3: activation date
  const act = pop(t, C.activation, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.share - 0.2, C.share + 0.1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head) * (1 - 0.2 * mix(act))) }}>
          <BigLabel text="AB PHOTOS WALI BAAT ⚠️" size={64} tone="red" />
        </div>
      )}
      {t < C.plan18 + 0.2 && (
        <div style={{ ...centre(540, 790, sc(pop(t, C.photosBaat + 0.15, { damping: 10, stiffness: 200 })), "rotate(-3deg)"), opacity: 1 - seg(t, C.plan18 - 0.15, C.plan18 + 0.15) }}>
          <div style={{ position: "relative" }}>
            {[2, 1, 0].map((n) => (
              <div key={n} style={{ position: n ? "absolute" : "relative", left: n * 22, top: -n * 22, transform: `rotate(${n * 6}deg)` }}>
                <Snap kind={KINDS[n + 1]} seed={n + 7} w={360} h={360} r={18} style={{ border: `6px solid ${P.ink}` }} />
              </div>
            ))}
            <div style={{ ...centre(300, 60, sc(pop(t, C.photosBaat + 0.45, { damping: 8 })) * (1 + 0.05 * Math.sin(t * 8))) }}>
              <WarnIcon size={150} />
            </div>
          </div>
        </div>
      )}
      {p1Out < 1 && cal > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - p1Out }}>
          <div style={{ ...centre(330, 760, sc(cal), "rotate(-4deg)") }}>
            <Calendar w={340} top={flip >= 1 ? "18 MONTHS" : "MONTH"} big={`${Math.max(1, Math.round(lerp(1, 18, eo(flip))))}`} tone={flip >= 1 ? "red" : "ink"} />
          </div>
          {ends > 0 && (
            <div style={{ ...centre(330, 765) }}>
              <Stamp p={ends} text="PLAN KHATAM" size={56} rotate={-12} color={RED} />
            </div>
          )}
          {renew > 0 && (
            <div style={{ ...centre(760, 760, sc(renew), "rotate(3deg)") }}>
              <div style={{ width: 380, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(8), padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 80, lineHeight: 1 }}>🔁</div>
                <div style={{ ...type.display, fontSize: 40, color: P.ink, whiteSpace: "nowrap" }}>AUTO-RENEW</div>
                <div style={{ ...type.display, fontSize: 44, color: "#fff", background: RED, border: `4px solid ${P.ink}`, borderRadius: 99, padding: "2px 30px" }}>NAHI ✗</div>
              </div>
            </div>
          )}
        </div>
      )}
      {p1Out > 0 && p2Out < 1 && meterK > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - p2Out }}>
          <div style={{ ...centre(540, lerp(700, 600, go(t, C.overAt - 0.3, C.overAt + 0.1)), sc(meterK)) }}>
            <div style={{ width: 800, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(8), padding: "16px 26px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ ...type.label, fontSize: 24, color: P.ink3 }}>STORAGE</div>
                <div style={{ ...type.display, fontSize: 64, color: shrink > 0.5 ? RED : P.ink }}>{shrink > 0.5 ? "15 GB" : "2 TB"}</div>
              </div>
              <div style={{ marginTop: 8, height: 36, borderRadius: 99, background: P.paper2, border: `3px solid ${P.ink}`, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${lerp(100, 9, shrink)}%`, height: "100%", background: shrink > 0.5 ? RED : P.lime }} />
              </div>
              {flow > 0 && <div style={{ ...type.display, fontSize: 28, color: RED, marginTop: 8 }}>Used: 15 GB se zyada! ⚠️</div>}
            </div>
          </div>
          {flow <= 0 && shrink > 0.3 && (
            <div style={{ ...centre(540, 900, sc(pop(t, C.gb15 + 0.5, { damping: 9, stiffness: 220 })), "rotate(-2deg)"), display: "flex", alignItems: "center", gap: 24, ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap" }}>
              <span style={{ textDecoration: "line-through", textDecorationThickness: 8, opacity: 0.55 }}>2 TB</span>
              <span>→</span>
              <span style={{ color: "#fff", background: RED, border: `6px solid ${P.ink}`, borderRadius: 24, padding: "0 22px" }}>15 GB</span>
            </div>
          )}
          {flow > 0 && (
            <>
              <div style={{ ...centre(250, 900, mix(flow * 3), "rotate(-4deg)") }}>
                <PhotoGrid w={240} rows={2} kinds={[...KINDS]} gap={6} />
              </div>
              <div style={{ ...centre(820, 880, mix(flow * 3)) }}>
                <div style={{ position: "relative" }}>
                  <CloudIcon size={300} fill={P.paper2} stroke={4} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
                    <Logo k="photos" size={80} bare />
                  </div>
                </div>
              </div>
              {Array.from({ length: 3 }, (_, n) => {
                const f = clamp01(flow * 2 - n * 0.3);
                if (f <= 0) return null;
                const x = lerp(330, 560, Math.min(f, 1));
                return (
                  <div key={n} style={{ ...centre(x + (blocked > 0 ? Math.sin(t * 40 + n) * 4 : 0), 880 + (n - 1) * 40, 0.9) }}>
                    <Snap kind={KINDS[n + 3]} seed={n} w={70} h={70} r={8} style={{ border: `3px solid ${P.ink}` }} />
                  </div>
                );
              })}
              {blocked > 0 && (
                <div style={{ ...centre(640, 880, sc(blocked)) }}>
                  <div style={{ width: 110, height: 110, borderRadius: 99, background: RED, border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 70, color: "#fff" }}>✗</div>
                </div>
              )}
            </>
          )}
          {blocked > 0 && (
            <div style={{ ...centre(540, 1035, sc(blocked), "rotate(-2deg)") }}>
              <Chip text="NAYI PHOTOS BACKUP NAHI HONGI" tone="red" size={40} />
            </div>
          )}
        </div>
      )}
      {act > 0 && (
        <>
          <div style={{ ...centre(540, 760, sc(act), "rotate(-2deg)") }}>
            <div style={{ width: 760, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 36, boxShadow: shadow.hard(12), padding: "26px 30px", display: "flex", alignItems: "center", gap: 26, boxSizing: "border-box" }}>
              <div style={{ fontSize: 130, lineHeight: 1 }}>📅</div>
              <div>
                <div style={{ ...type.display, fontSize: 66, color: P.ink, lineHeight: 1.02 }}>ACTIVATION</div>
                <div style={{ ...type.display, fontSize: 66, color: P.ink, lineHeight: 1.02 }}>DATE NOTE KARO</div>
              </div>
            </div>
          </div>
          <div style={{ ...centre(540, 960, mix(pop(t, C.activation + 0.3, { damping: 11 }))), ...type.display, fontSize: 34, color: P.ink2, whiteSpace: "nowrap" }}>18 mahine usi din se gine jaate hain</div>
        </>
      )}
      <Fine
        k={seg(t, C.gb15 + 0.3, C.gb15 + 0.6)}
        top={1100}
        w={900}
        text={act > 0 ? "Check your plan in MyJio and Google One. Terms may change." : "Over 15 GB: Photos backup & Gmail pause till you free space"}
      />
      <Burst t={t} at={C.noBackup} x={640} y={880} r={300} color={RED} />
      <Sparks t={t} at={C.activation + 0.1} x={540} y={760} n={12} r={400} />
    </div>
  );
};

// =================================================================================================================
// Share (C.share to C.comment)

export const ShareScene: React.FC<S> = ({ t }) => {
  if (t < C.share - 0.1 || t > C.comment + 0.15) return null;
  const head = pop(t, C.share, { damping: 10, stiffness: 210 });
  const friend = pop(t, C.jioDost, { damping: 9, stiffness: 220 });
  const send = go(t, C.jioDost + 0.2, C.jioDost + 0.8);
  const out = eo(seg(t, C.comment - 0.2, C.comment + 0.05));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {head > 0 && (
        <div style={{ ...centre(540, 410, sc(head)) }}>
          <BigLabel text="SHARE THIS WITH A JIO USER" size={56} tone="ink" />
        </div>
      )}
      {head > 0 && (
        <div style={{ ...centre(lerp(300, 720, send), lerp(760, 730, send) - Math.sin(send * Math.PI) * 120, sc(head) * lerp(1, 0.6, send), `rotate(${lerp(-10, 20, send)}deg)`), opacity: 1 - seg(send, 0.85, 1) }}>
          <div style={{ width: 200, height: 200, borderRadius: 44, background: P.lime, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={110} height={110} viewBox="0 0 24 24" fill="none" stroke={P.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9 22 2z" fill="#fff" />
            </svg>
          </div>
        </div>
      )}
      {friend > 0 && (
        <div style={{ ...centre(740, 780, sc(friend), "rotate(3deg)") }}>
          <div style={{ width: 380, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 32, boxShadow: shadow.hard(8), padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 130, height: 130, borderRadius: 99, background: "#FFD9A8", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76 }}>🧑</div>
              <div style={{ position: "absolute", right: -16, bottom: -6 }}>
                <Logo k="jio" size={64} bare />
              </div>
            </div>
            <div style={{ ...type.display, fontSize: 38, color: P.ink, whiteSpace: "nowrap" }}>Jio wala dost</div>
            {send > 0.8 && <div style={{ ...type.display, fontSize: 28, color: GREEN }}>✓ Sent</div>}
          </div>
        </div>
      )}
      <Fine k={seg(t, C.share + 0.4, C.share + 0.7)} top={1060} text="Kaam ka hai agar unhone offer pehle se activate kiya hai" w={820} />
      <Sparks t={t} at={C.jioDost + 0.8} x={740} y={760} n={10} r={260} />
    </div>
  );
};

// =================================================================================================================
// CTA and end card (C.comment to the end)

const ORBIT: LogoKey[] = ["gemini", "gmail", "docs", "photos", "notebooklm", "one"];
export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.comment - 0.1) return null;
  const bubble = pop(t, C.keyword + 0.4, { damping: 8, stiffness: 230 });
  const dm = pop(t, C.dm, { damping: 10, stiffness: 210 });
  const ctaOut = eo(seg(t, C.endCard - 0.1, C.endCard + 0.2));
  const mark = pop(t, C.endCard + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.endCard + 0.2, { damping: 11, stiffness: 190 });
  return (
    <>
      {ctaOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - ctaOut }}>
          {ORBIT.map((k, i) => {
            const kk = pop(t, C.keyword + 0.5 + i * 0.07, { damping: 10, stiffness: 210 });
            if (kk <= 0) return null;
            const a = (i / ORBIT.length) * Math.PI * 2 + t * 0.6;
            return (
              <div key={k} style={{ ...centre(540 + Math.cos(a) * 420, 560 + Math.sin(a) * 200, sc(kk)) }}>
                <Logo k={k} size={110} style={{ boxShadow: shadow.hard(5) }} />
              </div>
            );
          })}
          {bubble > 0 && (
            <div style={{ ...centre(540, 560, sc(bubble), `rotate(${(1 - mix(bubble)) * -12 - 3}deg)`) }}>
              <div style={{ position: "relative", background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 60, padding: "18px 50px", boxShadow: shadow.hard(10), ...type.display, fontSize: 150, color: P.ink, whiteSpace: "nowrap" }}>
                GEMINI
                <div style={{ position: "absolute", left: 120, bottom: -46, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `46px solid ${P.ink}` }} />
                <div style={{ position: "absolute", left: 128, bottom: -32, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `32px solid ${P.lime}` }} />
              </div>
            </div>
          )}
          <CommentCard t={t} at={C.comment} keyword="GEMINI" typeAt={C.keyword - 0.05} typeTo={C.keyword + 0.4} sendAt={C.keyword + 0.55} top={820} />
          {dm > 0 && (
            <div style={{ ...centre(540, 1040, sc(dm), "rotate(-2deg)") }}>
              <Chip text="📩 Saare links DM mein" tone="card" size={38} />
            </div>
          )}
          <Burst t={t} at={C.keyword + 0.4} x={540} y={560} r={420} color={P.lime} />
          <Sparks t={t} at={C.keyword + 0.55} x={880} y={882} />
        </div>
      )}
      {mark > 0 && (
        <div style={{ ...centre(540, 560, sc(mark), `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 735, mix(handle)), ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>@INTERNETOOLBOX</span>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Creator Secrets · AI tricks that save time</div>}
      <FollowButton t={t} at={C.endCard + 0.3} tapAt={C.endCard + 0.9} top={870} invite />
      {t > C.endCard + 0.9 && (
        <div style={{ ...centre(800, 920, mix(pop(t, C.endCard + 1.0, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
    </>
  );
};

/** Series sticker on the dark opener. */
export const SeriesTag: React.FC<S> = ({ t }) => {
  if (t > C.rupees + 0.1) return null;
  const k = pop(t, 0.15, { damping: 12, stiffness: 180 });
  return (
    <div style={{ ...centre(540, 330, mix(k) * (1 - seg(t, C.rupees - 0.1, C.rupees + 0.1))) }}>
      <Sticker size={30} tone="lime" rotate={-2}>
        CREATOR SECRETS #04
      </Sticker>
    </div>
  );
};
