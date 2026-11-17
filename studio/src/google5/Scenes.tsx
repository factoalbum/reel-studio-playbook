import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks, Stamp } from "../bonus/kit";
import { C, TOOLS } from "../episodes/google5";
import { clamp01, eo, go, lerp, pop, seg } from "../mdh/kit";
import { BigLabel, centre, DemoTag, RED, WarnIcon } from "../immich/kit";

/**
 * "5 Google AI tools", scene by scene. Every time comes from src/episodes/google5.ts (cue table C), which follows the
 * owner's recording. Tool logos are the official files in public/google5/logos (from each tool's own site); Pomelli
 * shows its name only because its site offers no product logo. All app screens are labelled illustrations.
 */

type S = { t: number };
const mix = (k: number) => Math.min(1, k);
/** Spring scale with a little overshoot. */
const sc = (k: number) => mix(k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1);
const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);
/** Google's four colours, used only as glow. */
const G = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
const GREEN = "#1E9E57";

export const CAM_ORIGIN = "540px 820px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.7) => amt * eo(seg(t, at, at + 0.3)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  return 1 + push(C.rupees, 0.05, 0.9) + TOOLS.reduce((s, tool) => s + push(tool.nameAt, 0.04), 0) + push(C.keyword + 0.5, 0.05);
};

/** Colour bars that sweep across on every tool number. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {TOOLS.map((tool, i) => {
      const k = seg(t, tool.at - 0.22, tool.at + 0.18);
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

/** Official logo tile. Pomelli has no published product logo, so its tile carries the name only. */
export const ToolLogo: React.FC<{ i: number; size: number; style?: React.CSSProperties }> = ({ i, size, style }) => {
  const tool = TOOLS[i];
  const full = tool.logo === "stitch-512.png";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: "#fff",
        border: `${Math.max(3, Math.round(size * 0.035))}px solid ${P.ink}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxSizing: "border-box",
        flexShrink: 0,
        ...style,
      }}
    >
      {tool.logo ? (
        <Img src={staticFile(`google5/logos/${tool.logo}`)} style={{ width: full ? "100%" : "80%", height: full ? "100%" : "80%", objectFit: full ? "cover" : "contain" }} />
      ) : (
        <>
          <div style={{ ...type.display, fontSize: size * 0.22, color: P.ink, lineHeight: 1 }}>Pomelli</div>
          <div style={{ ...type.body, fontSize: size * 0.085, color: P.ink3, marginTop: size * 0.04 }}>Google Labs</div>
        </>
      )}
    </div>
  );
};

/** The big showcase card for one tool: number badge, official logo, name, use-case chip, honest small print. */
const ToolCard: React.FC<{ i: number; w: number }> = ({ i, w }) => {
  const tool = TOOLS[i];
  const nameSize = Math.min(68, (w - 70) / (tool.name.length * 0.56));
  return (
    <div style={{ width: w, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "36px 30px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: -28, top: -28, width: 96, height: 96, borderRadius: 99, background: P.lime, border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 44, color: P.ink }}>#{tool.n}</div>
      <ToolLogo i={i} size={200} />
      <div style={{ ...type.display, fontSize: nameSize, color: P.ink, whiteSpace: "nowrap", lineHeight: 1.05 }}>{tool.name}</div>
      <div style={{ ...type.display, fontSize: 32, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 99, padding: "6px 24px", whiteSpace: "nowrap" }}>{tool.use}</div>
      <div style={{ ...type.body, fontSize: 24, color: P.ink3, whiteSpace: "nowrap" }}>{tool.note}</div>
    </div>
  );
};

/** A plain app window frame (our own drawing, not any product's real interface). */
const Win: React.FC<{ w: number; h: number; title?: string; dark?: boolean; children?: React.ReactNode }> = ({ w, h, title, dark = false, children }) => (
  <div style={{ width: w, height: h, background: dark ? "#16181d" : P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), overflow: "hidden", position: "relative", boxSizing: "border-box" }}>
    <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: dark ? "#22252c" : P.paper2, borderBottom: `3px solid ${dark ? "#2e323a" : P.line}` }}>
      {[RED, "#F2B33D", GREEN].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
      ))}
      {title && <div style={{ ...type.label, fontSize: 18, color: dark ? "#9aa3b2" : P.ink3, marginLeft: 10 }}>{title}</div>}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 44, bottom: 0 }}>{children}</div>
  </div>
);

/** Rounded block that starts as a grey wireframe and fills with colour (`c` 0 to 1). */
const Block: React.FC<{ k: number; c: number; w: number | string; h: number; color: string; r?: number; style?: React.CSSProperties }> = ({ k, c, w, h, color, r = 10, style }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: c > 0.5 ? color : P.paper2, border: `3px ${c > 0.5 ? "solid" : "dashed"} ${c > 0.5 ? P.ink : P.lineStrong}`, transform: `scale(${mix(k)})`, opacity: mix(k * 2), boxSizing: "border-box", ...style }} />
);

const Caret: React.FC<{ t: number; color?: string }> = ({ t, color = P.ink }) => <span style={{ display: "inline-block", width: 4, height: "1em", background: color, marginLeft: 3, verticalAlign: "-0.12em", opacity: Math.sin(t * 12) > 0 ? 1 : 0 }} />;

const Chip: React.FC<{ text: string; tone?: "lime" | "ink" | "card" | "red"; size?: number; style?: React.CSSProperties }> = ({ text, tone = "card", size = 30, style }) => {
  const bg = tone === "lime" ? P.lime : tone === "ink" ? P.ink : tone === "red" ? RED : P.card;
  const fg = tone === "ink" || tone === "red" ? "#fff" : P.ink;
  return <div style={{ ...type.display, fontSize: size, color: fg, background: bg, border: `4px solid ${P.ink}`, borderRadius: 99, padding: `${size * 0.22}px ${size * 0.7}px`, whiteSpace: "nowrap", boxShadow: shadow.hard(5), ...style }}>{text}</div>;
};

// =================================================================================================================
// 0. Hook (0 to C.cardsAt): dark opener, ₹18,000 KE 5 PAID AI TOOLS?, locked cards, PAID stamp, then FREE?!

export const OpenerBg: React.FC<S> = ({ t }) => {
  const out = seg(t, C.cardsAt - 0.15, C.cardsAt + 0.25);
  if (out >= 1) return null;
  const glow = seg(t, C.google - 0.1, C.google + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 42%, #262a22 0%, ${P.ink} 62%)`, opacity: 1 - out, overflow: "hidden" }}>
      {G.map((c, i) => {
        const a = t * 0.9 + (i * Math.PI) / 2;
        return <div key={c} style={{ position: "absolute", left: 540 + Math.cos(a) * 280 - 260, top: 760 + Math.sin(a) * 200 - 260, width: 520, height: 520, borderRadius: 999, background: c, opacity: 0.2 * glow, filter: "blur(90px)" }} />;
      })}
    </div>
  );
};

const LockedCard: React.FC<{ w: number; open: number }> = ({ w, open }) => (
  <div style={{ width: w, height: w * 1.25, borderRadius: 28, background: "#22252c", border: `5px solid ${open > 0.5 ? P.lime : "#3a3f48"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
    <div style={{ fontSize: w * 0.42, lineHeight: 1 }}>{open > 0.5 ? "🔓" : "🔒"}</div>
    <div style={{ ...type.display, fontSize: w * 0.15, color: open > 0.5 ? P.lime : "#c9cfd8" }}>{open > 0.5 ? "FREE?" : "₹ / month"}</div>
  </div>
);

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.free + 0.1) return null;
  const g = pop(t, C.google - 0.05, { damping: 10, stiffness: 200 });
  const gOut = seg(t, C.rupees - 0.15, C.rupees + 0.05);
  const rs = pop(t, C.rupees, { damping: 8, stiffness: 240 });
  const tools = pop(t, C.five, { damping: 10, stiffness: 220 });
  const stamp = pop(t, C.paid, { damping: 8, stiffness: 240 });
  const sh = shakeAt(t, C.paid, 12, 0.35) + shakeAt(t, C.rupees, 10, 0.3);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${sh}px)` }}>
      {g > 0 && gOut < 1 && (
        <div style={{ ...centre(540, 560, sc(g) * (1 - 0.3 * gOut)), opacity: 1 - gOut, ...type.display, fontSize: 150, color: "#fff", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
          {"GOOGLE".split("").map((ch, i) => (
            <span key={i} style={{ textShadow: `0 0 40px ${G[i % 4]}` }}>{ch}</span>
          ))}
        </div>
      )}
      {rs > 0 && (
        <div style={{ ...centre(540, 470, sc(rs), `rotate(${(1 - mix(rs)) * -8 - 2}deg)`), ...type.display, fontSize: 170, color: P.lime, whiteSpace: "nowrap", textShadow: `0 0 50px rgba(200,240,90,0.55), 10px 10px 0 ${P.olive}` }}>₹18,000 KE</div>
      )}
      {tools > 0 && (
        <div style={{ ...centre(540, 650, sc(tools)), ...type.display, fontSize: 92, color: "#fff", whiteSpace: "nowrap" }}>
          <span style={{ color: P.lime }}>5</span> PAID AI TOOLS?
        </div>
      )}
      {[0, 1, 2, 3, 4].map((i) => {
        const k = pop(t, C.five + 0.1 + i * 0.12, { damping: 11, stiffness: 190 });
        const x = 540 + (i - 2) * 185;
        const y = 960 + Math.abs(i - 2) * 30;
        // Before "5 paid AI tools" the cards wait as dim shapes in the dark, so the opener is never empty.
        if (k <= 0)
          return (
            <div key={i} style={{ ...centre(x, y + Math.sin(t * 2 + i) * 8, 0.9, `rotate(${(i - 2) * 7}deg)`), opacity: (0.2 + 0.08 * Math.sin(t * 3 + i)) * seg(t, 0, 0.3), filter: "blur(2px)" }}>
              <LockedCard w={170} open={0} />
            </div>
          );
        return (
          <div key={i} style={{ ...centre(lerp(540, x, mix(k)), lerp(1500, y, mix(k)), sc(k) * 0.95, `rotate(${(i - 2) * 7}deg)`) }}>
            <LockedCard w={170} open={0} />
          </div>
        );
      })}
      {stamp > 0 && (
        <div style={{ ...centre(540, 975) }}>
          <Stamp p={stamp} text="PAID" size={86} rotate={-10} color={RED} />
        </div>
      )}
    </div>
  );
};

/** Smash cut: FREE?! full screen, with the qualifier the brief asked for. */
export const SmashFree: React.FC<S> = ({ t }) => {
  if (t < C.free - 0.02 || t > C.cardsAt + 0.15) return null;
  const p = pop(t, C.free, { damping: 8, stiffness: 260, mass: 0.6 });
  const out = seg(t, C.cardsAt - 0.12, C.cardsAt + 0.15);
  const sh = shakeAt(t, C.free, 22, 0.35);
  return (
    <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: 1 - out, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 44%, ${P.olive} 0%, ${P.ink} 60%)` }} />
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 540, top: 820, width: 1400, height: 26, background: i % 4 === 0 ? P.lime : G[i % 4], opacity: 0.09, transformOrigin: "0 50%", transform: `rotate(${(i / 16) * 360 + t * 24}deg)` }} />
      ))}
      <div style={{ ...centre(540 + sh, 800, lerp(1.9, 1, mix(p)) * (p > 1 ? 1 + (p - 1) * 0.2 : 1), "rotate(-4deg)"), ...type.display, fontSize: 300, color: P.lime, textShadow: `12px 12px 0 ${P.olive}`, whiteSpace: "nowrap" }}>FREE?!</div>
      <div style={{ ...centre(540, 1000, mix(pop(t, C.free + 0.1, { damping: 9 }))), fontSize: 150, lineHeight: 1 }}>🔓</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1092, textAlign: "center", ...type.body, fontSize: 32, color: P.limeSoft, opacity: seg(t, C.free + 0.2, C.free + 0.4) }}>
        Free access / beta / limits may apply
      </div>
    </div>
  );
};

// =================================================================================================================
// A. The five cards (C.cardsAt to C.s1): logos pop in, FREE MEIN TRY, #5 stays a mystery.

const GRID = [
  { x: 240, y: 640 },
  { x: 540, y: 640 },
  { x: 840, y: 640 },
  { x: 390, y: 945 },
  { x: 690, y: 945 },
];

export const GridScene: React.FC<S> = ({ t }) => {
  if (t < C.cardsAt - 0.1 || t > C.s1 + 0.2) return null;
  const title = pop(t, C.cardsAt, { damping: 10, stiffness: 210 });
  const free = pop(t, C.freeMein, { damping: 8, stiffness: 240 });
  const tryK = pop(t, C.tryWord + 0.2, { damping: 10, stiffness: 200 });
  const last = go(t, C.aakhri - 0.05, C.aakhri + 0.4);
  const mine = pop(t, C.khud, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.s1 - 0.25, C.s1 + 0.1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {title > 0 && (
        <div style={{ ...centre(540, 380, sc(title)) }}>
          <BigLabel text="5 GOOGLE AI TOOLS" size={72} tone="ink" />
        </div>
      )}
      {free > 0 && (
        <div style={{ ...centre(810, 462, sc(free), "rotate(6deg)") }}>
          <Sticker size={44} tone="lime" rotate={0}>
            FREE MEIN TRY ✓
          </Sticker>
        </div>
      )}
      {GRID.map((g, i) => {
        const k = pop(t, C.paanch + i * 0.1, { damping: 11, stiffness: 200 });
        if (k <= 0) return null;
        const mystery = i === 4;
        const dim = i < 4 ? last : 0;
        const big = mystery ? last : 0;
        const bob = Math.sin(t * 2.2 + i) * 5;
        return (
          <div key={i} style={{ ...centre(lerp(540, g.x, mix(k)), lerp(1250, g.y, mix(k)) + bob, sc(k) * (1 + 0.14 * big), `rotate(${(1 - mix(k)) * (i % 2 ? 14 : -14) + (mystery ? Math.sin(t * 9) * 3 * big : 0)}deg)`), opacity: 1 - 0.55 * dim }}>
            {mystery ? (
              <div style={{ width: 250, height: 280, borderRadius: 34, background: P.ink, border: `6px solid ${P.ink}`, boxShadow: `${shadow.hard(8)}${big > 0 ? `, 0 0 ${60 * big}px rgba(200,240,90,0.8)` : ""}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ ...type.display, fontSize: 150, color: P.lime, lineHeight: 1 }}>?</div>
                <div style={{ ...type.display, fontSize: 30, color: "#fff" }}>#5</div>
              </div>
            ) : (
              <div style={{ width: 250, height: 280, borderRadius: 34, background: P.card, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <ToolLogo i={i} size={136} />
                <div style={{ ...type.display, fontSize: 34, color: P.ink, whiteSpace: "nowrap" }}>{TOOLS[i].short}</div>
              </div>
            )}
          </div>
        );
      })}
      {mine > 0 && (
        <div style={{ ...centre(840, 790, sc(mine), "rotate(8deg)") }}>
          <Sticker size={34} tone="lime" rotate={0}>
            I USE THIS ONE 👀
          </Sticker>
        </div>
      )}
      {tryK > 0 && last < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1102, display: "flex", justifyContent: "center", opacity: mix(tryK) * (1 - last) }}>
          <div style={{ ...type.body, fontSize: 26, color: P.ink2, background: P.card, border: `3px solid ${P.line}`, borderRadius: 99, padding: "6px 18px" }}>Free to try · some are beta · limits may apply</div>
        </div>
      )}
      <Sparks t={t} at={C.freeMein} x={800} y={478} n={10} r={220} />
    </div>
  );
};

// =================================================================================================================
// Tool scenes: the number slams, the showcase card lands, then shrinks to the top while the demo plays.

export const ToolScene: React.FC<S & { i: number }> = ({ t, i }) => {
  const tool = TOOLS[i];
  if (t < tool.at - 0.1 || t > tool.end + 0.1) return null;
  const num = pop(t, tool.at, { damping: 9, stiffness: 240 });
  const numOut = seg(t, tool.nameAt - 0.15, tool.nameAt + 0.08);
  const cardK = pop(t, tool.nameAt - 0.05, { damping: 11, stiffness: 200 });
  const up = go(t, tool.demo - 0.35, tool.demo + 0.15);
  const out = eo(seg(t, tool.end - 0.22, tool.end + 0.05));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-160 * out}px)` }}>
      {num > 0 && numOut < 1 && (
        <div style={{ ...centre(540, 700, sc(num) * (1 - 0.4 * numOut), `rotate(${(1 - mix(num)) * -14}deg)`), opacity: 1 - numOut, ...type.display, fontSize: 400, color: P.lime, WebkitTextStroke: `10px ${P.ink}`, textShadow: `16px 16px 0 ${P.ink}`, lineHeight: 1 }}>
          #{tool.n}
        </div>
      )}
      <Burst t={t} at={tool.nameAt} x={540} y={690} r={430} color={P.lime} />
      {cardK > 0 && (
        <div style={{ ...centre(540, lerp(690, 455, up), sc(cardK) * lerp(1, 0.5, up)) }}>
          <ToolCard i={i} w={680} />
        </div>
      )}
      <Sparks t={t} at={tool.nameAt + 0.05} x={540} y={620} n={12} r={380} />
      {i === 0 && <StitchDemo t={t} />}
      {i === 1 && <PomelliDemo t={t} />}
      {i === 2 && <AgDemo t={t} />}
      {i === 3 && <NotebookDemo t={t} />}
      {i === 4 && <StudioDemo t={t} />}
    </div>
  );
};

// 1. Stitch: an idea typed into a prompt bar, then a phone screen and a web page assemble themselves.
const StitchDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.ideaAt - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const prompt = "Design a fitness app home screen";
  const typed = prompt.slice(0, Math.floor(prompt.length * seg(t, C.ideaAt + 0.1, C.ideaAt + 1.3)));
  const press = t > C.websiteAt - 0.05 && t < C.websiteAt + 0.15;
  const b = (j: number) => pop(t, C.websiteAt + 0.15 + j * 0.1, { damping: 12, stiffness: 200 });
  const c = (j: number) => seg(t, C.uiAt + j * 0.07, C.uiAt + 0.1 + j * 0.07);
  const sweep = seg(t, C.uiAt, C.uiAt + 0.8);
  const devices = pop(t, C.websiteAt, { damping: 13, stiffness: 160 });
  const tag = pop(t, C.uiAt + 0.6, { damping: 9, stiffness: 220 });
  return (
    <>
      <div style={{ ...centre(540, 650, mix(k)), width: 840, height: 92, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 99, boxShadow: shadow.hard(7), display: "flex", alignItems: "center", gap: 14, padding: "0 12px 0 28px", boxSizing: "border-box" }}>
        <div style={{ fontSize: 34 }}>✨</div>
        <div style={{ ...type.body, fontWeight: 700, fontSize: 30, color: P.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
          {typed || <span style={{ color: P.ink3 }}>Describe your app...</span>}
          {t < C.websiteAt && <Caret t={t} />}
        </div>
        <div style={{ ...type.display, fontSize: 26, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 99, padding: "10px 22px", transform: `scale(${press ? 0.9 : 1})` }}>Generate</div>
      </div>
      {devices > 0 && (
        <>
          {/* Phone */}
          <div style={{ ...centre(lerp(540, 320, mix(devices)), 905, mix(devices), "rotate(-4deg)"), width: 240, height: 440, background: P.ink, borderRadius: 40, padding: 10, boxShadow: shadow.hard(8), boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 30, padding: 14, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
              <Block k={b(0)} c={c(0)} w="60%" h={20} color={P.ink} r={6} />
              <Block k={b(1)} c={c(1)} w="100%" h={120} color={P.lime} r={16} />
              <div style={{ display: "flex", gap: 10 }}>
                <Block k={b(2)} c={c(2)} w="50%" h={84} color="#FFD7A8" r={14} />
                <Block k={b(3)} c={c(3)} w="50%" h={84} color="#BFE3FF" r={14} />
              </div>
              <Block k={b(4)} c={c(4)} w="100%" h={56} color="#F5F0E6" r={14} />
              <Block k={b(5)} c={c(5)} w="100%" h={44} color={P.ink} r={99} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 80, left: lerp(-120, 300, sweep), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", transform: "skewX(-15deg)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
            </div>
          </div>
          {/* Web page */}
          <div style={{ ...centre(lerp(540, 735, mix(devices)), 890, mix(devices), "rotate(3deg)") }}>
            <Win w={470} h={340} title="your-app.com">
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, position: "relative", height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Block k={b(1)} c={c(1)} w={90} h={20} color={P.ink} r={6} />
                  <div style={{ flex: 1 }} />
                  <Block k={b(2)} c={c(2)} w={60} h={16} color={P.lineStrong} r={6} />
                  <Block k={b(2)} c={c(2)} w={60} h={16} color={P.lineStrong} r={6} />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <Block k={b(3)} c={c(3)} w="90%" h={26} color={P.ink} r={6} />
                    <Block k={b(3)} c={c(3)} w="70%" h={26} color={P.ink} r={6} />
                    <Block k={b(4)} c={c(4)} w={110} h={34} color={P.lime} r={99} />
                  </div>
                  <Block k={b(4)} c={c(4)} w={160} h={110} color="#FFD7A8" r={14} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[5, 6, 7].map((j) => (
                    <Block key={j} k={b(j)} c={c(j)} w="33%" h={70} color={["#BFE3FF", "#E9F7C8", "#FFE7EC"][j - 5]} r={12} />
                  ))}
                </div>
                <div style={{ position: "absolute", top: 0, bottom: 0, width: 110, left: lerp(-160, 560, sweep), background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)", transform: "skewX(-15deg)", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
              </div>
            </Win>
          </div>
        </>
      )}
      {tag > 0 && (
        <div style={{ ...centre(760, 1098, sc(tag), "rotate(-3deg)") }}>
          <Sticker size={34} tone="lime" rotate={0}>
            UI IN SECONDS ⚡
          </Sticker>
        </div>
      )}
      <Sparks t={t} at={C.uiAt + 0.6} x={600} y={880} n={12} r={320} />
      <DemoTag text="Illustration" style={{ left: 80, top: 1105, opacity: mix(k) }} />
    </>
  );
};

// 2. Pomelli: a website link goes in, a brand profile comes out, then social posts for a sample brand.
const SWATCH = ["#7A3E1D", "#E8A33D", "#F6E7CB", "#2F4A3A"];
const POSTS = [
  { title: "Monsoon Special", bg: `linear-gradient(160deg, ${SWATCH[0]}, #A65A2C)`, fg: "#fff", emoji: "☕" },
  { title: "2-for-1 Friday", bg: `linear-gradient(160deg, ${SWATCH[1]}, #F3C26B)`, fg: P.ink, emoji: "🥐" },
  { title: "New: Masala Chai", bg: `linear-gradient(160deg, ${SWATCH[3]}, #4C6E58)`, fg: "#fff", emoji: "🫖" },
];

const PomelliDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.linkAt - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const url = "chaicorner.in";
  const typed = url.slice(0, Math.floor(url.length * seg(t, C.linkAt + 0.1, C.linkAt + 0.9)));
  const drop = go(t, C.linkDrop - 0.1, C.linkDrop + 0.3);
  const dna = pop(t, C.linkDrop + 0.15, { damping: 12, stiffness: 180 });
  const posts = go(t, C.socialAt - 0.15, C.socialAt + 0.3);
  return (
    <>
      {drop < 1 && (
        <div style={{ ...centre(540, lerp(650, 820, drop), mix(k) * lerp(1, 0.4, drop)), opacity: 1 - drop, width: 700, height: 92, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 99, boxShadow: shadow.hard(7), display: "flex", alignItems: "center", gap: 14, padding: "0 28px", boxSizing: "border-box" }}>
          <div style={{ fontSize: 34 }}>🔗</div>
          <div style={{ ...type.body, fontWeight: 700, fontSize: 32, color: P.ink, whiteSpace: "nowrap" }}>
            {typed}
            <Caret t={t} />
          </div>
        </div>
      )}
      {dna > 0 && posts < 1 && (
        <div style={{ ...centre(540, 870, sc(dna) * (1 - 0.3 * posts)), opacity: 1 - posts }}>
          <Win w={780} h={340} title="Brand profile">
            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", gap: 16 }}>
                {SWATCH.map((c, j) => (
                  <div key={c} style={{ width: 92, height: 92, borderRadius: 20, background: c, border: `4px solid ${P.ink}`, transform: `scale(${mix(pop(t, C.brandAt + j * 0.08, { damping: 10, stiffness: 220 }))})` }} />
                ))}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 76, color: P.ink, opacity: seg(t, C.brandAt + 0.3, C.brandAt + 0.5) }}>Aa</div>
              </div>
              <div style={{ display: "flex", gap: 12, opacity: seg(t, C.brandAt + 0.4, C.brandAt + 0.6) }}>
                {["Warm", "Friendly", "Desi chai vibes"].map((w) => (
                  <div key={w} style={{ ...type.display, fontSize: 24, color: P.ink, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "6px 16px" }}>{w}</div>
                ))}
              </div>
            </div>
          </Win>
        </div>
      )}
      {posts > 0 &&
        POSTS.map((p, j) => {
          const pk = pop(t, C.socialAt + j * 0.15, { damping: 11, stiffness: 190 });
          if (pk <= 0) return null;
          const x = [280, 540, 800][j];
          return (
            <div key={j} style={{ ...centre(lerp(540, x, mix(pk)), lerp(1000, 880 + Math.abs(j - 1) * 20, mix(pk)), sc(pk), `rotate(${(j - 1) * 8}deg)`), width: 250, height: 310, borderRadius: 24, background: p.bg, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, boxSizing: "border-box" }}>
              <div style={{ fontSize: 96, lineHeight: 1 }}>{p.emoji}</div>
              <div style={{ ...type.display, fontSize: 32, color: p.fg, textAlign: "center", lineHeight: 1.05 }}>{p.title}</div>
              <div style={{ ...type.label, fontSize: 16, color: p.fg, opacity: 0.8 }}>chaicorner.in</div>
            </div>
          );
        })}
      <Sparks t={t} at={C.socialAt + 0.3} x={540} y={860} n={12} r={340} />
      <DemoTag text="Illustration · sample brand" style={{ left: 80, top: 1105, opacity: mix(k) }} />
    </>
  );
};

// 3. Antigravity: an AI agent writes code; two bugs light up red, then turn into green checks.
const CODE = ["def cart_total(cart):", "    total = 0", "    for item in cart:", "        total += item.price * item.qty", "    if total > 999:", "        total *= 0.9  # discount", "    return round(total, 2)"];
const BUG_LINES = [2, 5];

const AgDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.agentAt - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const shown = CODE.length * seg(t, C.codeAt - 0.2, C.codeAt + 1.0);
  const bug = t > C.bugsAt && t < C.fixAt + 0.15;
  const fixed = t >= C.fixAt + 0.15;
  const agent = pop(t, C.agentAt + 0.1, { damping: 10, stiffness: 210 });
  const pass = pop(t, C.fixAt + 0.5, { damping: 9, stiffness: 220 });
  return (
    <>
      <div style={{ ...centre(540, 880, mix(k), "rotate(-1deg)") }}>
        <Win w={860} h={430} title="cart.py" dark>
          <div style={{ padding: "18px 20px", fontFamily: "Consolas, 'Courier New', monospace", fontSize: 25, lineHeight: "44px" }}>
            {CODE.map((line, j) => {
              const vis = clamp01(shown - j);
              if (vis <= 0) return null;
              const isBug = BUG_LINES.includes(j);
              const chars = Math.floor(line.length * vis);
              return (
                <div key={j} style={{ display: "flex", alignItems: "center", whiteSpace: "pre", background: isBug && bug ? "rgba(224,69,43,0.25)" : isBug && fixed ? "rgba(30,158,87,0.2)" : "transparent", borderRadius: 6, position: "relative" }}>
                  <span style={{ color: "#5c6370", width: 40, textAlign: "right", marginRight: 18 }}>{j + 1}</span>
                  <span style={{ color: j === 0 ? "#c5e478" : "#d7dae0" }}>{line.slice(0, chars)}</span>
                  {isBug && bug && <span style={{ position: "absolute", right: 10, fontSize: 30 }}>🐞</span>}
                  {isBug && fixed && <span style={{ position: "absolute", right: 12, ...type.display, fontSize: 30, color: "#46d17a" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </Win>
      </div>
      {agent > 0 && (
        <div style={{ ...centre(800, 650, sc(agent), "rotate(3deg)") }}>
          <Chip text={fixed ? "✦ AI agent: bugs fixed" : t > C.bugsAt ? "✦ AI agent: fixing bugs…" : "✦ AI agent: writing code…"} tone="lime" size={28} />
        </div>
      )}
      {pass > 0 && (
        <div style={{ ...centre(380, 1098, sc(pass), "rotate(-2deg)") }}>
          <Chip text="✓ Tests passed" tone="card" size={30} style={{ color: GREEN }} />
        </div>
      )}
      <Sparks t={t} at={C.fixAt + 0.15} x={700} y={850} n={12} r={300} />
      <DemoTag text="Illustration" style={{ left: 760, top: 1105, opacity: mix(k) }} />
    </>
  );
};

// 4. NotebookLM: a PDF and notes go in; a summary, an answer and an Audio Overview come out.
const NotebookDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.pdfAt - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const docs = [
    { label: "PDF", tone: RED, at: C.pdfAt, y: 720 },
    { label: "NOTES", tone: P.lime, at: C.pdfAt + 0.35, y: 940 },
  ];
  const sum = seg(t, C.summaryAt - 0.2, C.summaryAt + 0.6);
  const q = pop(t, C.qaAt, { damping: 11, stiffness: 200 });
  const a = seg(t, C.qaAt + 0.4, C.qaAt + 1.0);
  const audio = pop(t, C.audioAt, { damping: 10, stiffness: 200 });
  return (
    <>
      {docs.map((d, j) => {
        const dk = pop(t, d.at, { damping: 11, stiffness: 190 });
        if (dk <= 0) return null;
        return (
          <div key={j} style={{ ...centre(lerp(-100, 215, mix(dk)), d.y, sc(dk), `rotate(${j ? 5 : -6}deg)`), width: 190, height: 230, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(6), padding: 18, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ ...type.display, fontSize: 26, color: d.tone === RED ? "#fff" : P.ink, background: d.tone, borderRadius: 8, padding: "2px 10px", alignSelf: "flex-start" }}>{d.label}</div>
            {[0.9, 0.7, 0.85, 0.6, 0.75].map((w, n) => (
              <div key={n} style={{ height: 10, width: `${w * 100}%`, background: P.line, borderRadius: 4 }} />
            ))}
          </div>
        );
      })}
      <div style={{ ...centre(lerp(1200, 680, mix(k)), 872) }}>
        <Win w={560} h={540} title="Notebook">
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ToolLogo i={3} size={46} />
              <div style={{ ...type.display, fontSize: 30, color: P.ink }}>Summary</div>
            </div>
            {[0.95, 0.88, 0.72].map((w, n) => (
              <div key={n} style={{ height: 14, width: `${w * 100 * clamp01(sum * 3 - n)}%`, background: P.ink2, borderRadius: 6 }} />
            ))}
            {q > 0 && (
              <div style={{ alignSelf: "flex-end", ...type.body, fontWeight: 700, fontSize: 24, color: P.ink, background: P.limeSoft, border: `3px solid ${P.ink}`, borderRadius: "18px 18px 4px 18px", padding: "8px 16px", transform: `scale(${mix(q)})`, transformOrigin: "100% 100%" }}>Main points kya hain?</div>
            )}
            {a > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, background: P.paper2, borderRadius: 14, padding: 12 }}>
                {[0.9, 0.65].map((w, n) => (
                  <div key={n} style={{ height: 12, width: `${w * 100 * clamp01(a * 2 - n)}%`, background: P.ink3, borderRadius: 5 }} />
                ))}
              </div>
            )}
            {audio > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.ink, borderRadius: 18, padding: "12px 16px", transform: `scale(${sc(audio)})` }}>
                <div style={{ width: 52, height: 52, borderRadius: 99, background: P.lime, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>▶</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <div style={{ ...type.display, fontSize: 24, color: "#fff" }}>🎧 Audio Overview</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, height: 30 }}>
                    {Array.from({ length: 22 }, (_, n) => (
                      <div key={n} style={{ width: 8, borderRadius: 4, background: P.lime, height: 6 + 22 * Math.abs(Math.sin(t * 7 + n * 0.8)) }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Win>
      </div>
      <Sparks t={t} at={C.audioAt + 0.1} x={680} y={1020} n={10} r={260} />
      <DemoTag text="Illustration" style={{ left: 80, top: 1105, opacity: mix(k) }} />
    </>
  );
};

// 5. AI Studio: try a model, generate a voice, the presenter's reel voiceover.
const StudioDemo: React.FC<S> = ({ t }) => {
  const k = pop(t, C.modelsAt - 0.1, { damping: 13, stiffness: 170 });
  if (k <= 0) return null;
  const prompt = "Ek catchy reel hook likho";
  const typed = prompt.slice(0, Math.floor(prompt.length * seg(t, C.modelsAt + 0.1, C.modelsAt + 0.8)));
  const run = t > C.modelsAt + 0.85 && t < C.modelsAt + 1.0;
  const ans = seg(t, C.modelsAt + 1.0, C.modelsAt + 1.4);
  const voice = pop(t, C.voiceAt, { damping: 12, stiffness: 180 });
  const wave = seg(t, C.voiceAt + 0.2, C.voiceAt + 1.0);
  const mine = pop(t, C.reelsAt + 0.5, { damping: 9, stiffness: 220 });
  return (
    <>
      <div style={{ ...centre(540, 750, mix(k)) }}>
        <Win w={840} h={300} title="Playground">
          <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ ...type.display, fontSize: 24, color: P.ink, border: `3px solid ${P.ink}`, borderRadius: 12, padding: "6px 14px" }}>Model: Gemini ▾</div>
              <div style={{ flex: 1 }} />
              <div style={{ ...type.display, fontSize: 24, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 12, padding: "6px 18px", transform: `scale(${run ? 0.9 : 1})` }}>Run ▶</div>
            </div>
            <div style={{ ...type.body, fontWeight: 700, fontSize: 28, color: P.ink, background: P.paper2, borderRadius: 12, padding: "10px 16px", whiteSpace: "nowrap" }}>
              {typed}
              {t < C.modelsAt + 0.9 && <Caret t={t} />}
            </div>
            {[0.92, 0.7].map((w, n) => (
              <div key={n} style={{ height: 13, width: `${w * 100 * clamp01(ans * 2 - n)}%`, background: P.ink3, borderRadius: 6 }} />
            ))}
          </div>
        </Win>
      </div>
      {voice > 0 && (
        <div style={{ ...centre(540, 1005, sc(voice), "rotate(1deg)") }}>
          <Win w={840} h={200} title="Speech">
            <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontSize: 50 }}>🎙️</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, height: 90, flex: 1 }}>
                {Array.from({ length: 40 }, (_, n) => (
                  <div key={n} style={{ width: 10, borderRadius: 5, background: n / 40 < wave ? P.ink : P.line, height: 10 + 70 * Math.abs(Math.sin(n * 1.7) * Math.cos(n * 0.45)) * (n / 40 < wave ? 1 : 0.3) }} />
                ))}
              </div>
              <div style={{ ...type.display, fontSize: 22, color: GREEN, opacity: seg(t, C.voiceAt + 1.0, C.voiceAt + 1.2) }}>✓ voice.wav</div>
            </div>
          </Win>
        </div>
      )}
      {mine > 0 && (
        <div style={{ ...centre(720, 1110, sc(mine), "rotate(-3deg)") }}>
          <Sticker size={32} tone="lime" rotate={0}>
            MERI REELS KI AAWAZ 🎙️
          </Sticker>
        </div>
      )}
      <Sparks t={t} at={C.voiceAt + 1.0} x={540} y={1000} n={10} r={300} />
      <DemoTag text="Illustration" style={{ left: 80, top: 1105, opacity: mix(k) * (1 - mix(mine)) }} />
    </>
  );
};

// =================================================================================================================
// Limits (C.dhyaan to C.linksAt)

export const LimitsScene: React.FC<S> = ({ t }) => {
  if (t < C.dhyaan - 0.1 || t > C.linksAt + 0.2) return null;
  const w = pop(t, C.dhyaan, { damping: 8, stiffness: 230 });
  const label = pop(t, C.dhyaan + 0.2, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.linksAt - 0.15, C.linksAt + 0.15));
  const chips: { text: string; tone: "lime" | "ink" | "card" | "red"; at: number; x: number; y: number; r: number }[] = [
    { text: "FREE ACCESS ✓", tone: "lime", at: C.access, x: 330, y: 770, r: -4 },
    { text: "USAGE LIMITS", tone: "red", at: C.limits, x: 760, y: 770, r: 4 },
    { text: "SOME ARE BETA", tone: "ink", at: C.access + 0.45, x: 330, y: 890, r: 3 },
    { text: "VARIES BY COUNTRY", tone: "card", at: C.limits + 0.3, x: 730, y: 890, r: -3 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {w > 0 && (
        <div style={{ ...centre(540 + shakeAt(t, C.dhyaan, 12, 0.4), 440, sc(w)) }}>
          <WarnIcon size={170} />
        </div>
      )}
      {label > 0 && (
        <div style={{ ...centre(540, 610, sc(label)) }}>
          <BigLabel text="DHYAAN RAHE!" size={78} tone="ink" />
        </div>
      )}
      {chips.map((c, i) => {
        const k = pop(t, c.at, { damping: 9, stiffness: 220 });
        if (k <= 0) return null;
        return (
          <div key={i} style={{ ...centre(c.x, c.y, sc(k), `rotate(${c.r}deg)`) }}>
            <Chip text={c.text} tone={c.tone} size={34} />
          </div>
        );
      })}
      {t > C.limits + 0.3 && (
        <div style={{ position: "absolute", left: 110, right: 110, top: 990, textAlign: "center", ...type.body, fontSize: 26, lineHeight: 1.35, color: P.ink2, opacity: seg(t, C.limits + 0.3, C.limits + 0.6) }}>
          Free plans have daily or usage limits. Some tools are Google Labs betas or only in select countries.
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// CTA and outro (C.linksAt to the end)

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.linksAt - 0.1) return null;
  const head = pop(t, C.linksAt, { damping: 10, stiffness: 210 });
  const rowOut = go(t, C.keyword + 0.3, C.keyword + 0.6);
  const bubble = pop(t, C.keyword + 0.5, { damping: 8, stiffness: 230 });
  const ctaOut = eo(seg(t, C.outroAt - 0.1, C.outroAt + 0.2));
  const mark = pop(t, C.outroAt + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.outroAt + 0.25, { damping: 11, stiffness: 190 });
  const series = pop(t, C.outroAt + 0.45, { damping: 11, stiffness: 190 });
  return (
    <>
      {ctaOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - ctaOut }}>
          {head > 0 && rowOut < 1 && (
            <div style={{ ...centre(540, 400, sc(head) * (1 - rowOut)) }}>
              <BigLabel text="OFFICIAL LINKS?" size={70} tone="lime" />
            </div>
          )}
          {rowOut < 1 &&
            TOOLS.map((_, i) => {
              const k = pop(t, C.linksAt + 0.2 + i * 0.1, { damping: 10, stiffness: 210 });
              if (k <= 0) return null;
              return (
                <div key={i} style={{ ...centre(190 + i * 175, 590 + Math.sin(t * 3 + i) * 6, sc(k) * (1 - rowOut), `rotate(${(i - 2) * 4}deg)`) }}>
                  <ToolLogo i={i} size={140} style={{ boxShadow: shadow.hard(6) }} />
                </div>
              );
            })}
          {t > C.commentAt - 0.1 && <CommentCard t={t} at={C.commentAt} keyword="GOOGLE 5" typeAt={C.keyword - 0.05} typeTo={C.keyword + 0.45} sendAt={C.keyword + 0.6} top={820} />}
          {bubble > 0 && (
            <div style={{ ...centre(540, 560, sc(bubble), `rotate(${(1 - mix(bubble)) * -12 - 3}deg)`) }}>
              <div style={{ position: "relative", background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 60, padding: "18px 50px", boxShadow: shadow.hard(10), ...type.display, fontSize: 140, color: P.ink, whiteSpace: "nowrap" }}>
                GOOGLE 5
                <div style={{ position: "absolute", left: 120, bottom: -46, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `46px solid ${P.ink}` }} />
                <div style={{ position: "absolute", left: 128, bottom: -32, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `32px solid ${P.lime}` }} />
              </div>
            </div>
          )}
          <Burst t={t} at={C.keyword + 0.5} x={540} y={560} r={420} color={P.lime} />
          <Sparks t={t} at={C.keyword + 0.6} x={880} y={882} />
        </div>
      )}
      {mark > 0 && (
        <div style={{ ...centre(540, 540, sc(mark), `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 715, mix(handle)), ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>@INTERNETOOLBOX</span>
        </div>
      )}
      {series > 0 && <div style={{ ...centre(540, 795, mix(series)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Creator Secrets · AI tricks that save time</div>}
      <FollowButton t={t} at={C.outroAt + 0.6} tapAt={C.followWord} top={850} invite />
      {t > C.followWord && (
        <div style={{ ...centre(800, 900, mix(pop(t, C.followWord + 0.1, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
    </>
  );
};

/** Series sticker on the dark opener. */
export const SeriesTag: React.FC<S> = ({ t }) => {
  if (t > C.rupees) return null;
  const k = pop(t, 0.25, { damping: 12, stiffness: 180 });
  return (
    <div style={{ ...centre(540, 330, mix(k) * (1 - seg(t, C.rupees - 0.2, C.rupees))) }}>
      <Sticker size={30} tone="lime" rotate={-2}>
        CREATOR SECRETS #03
      </Sticker>
    </div>
  );
};
