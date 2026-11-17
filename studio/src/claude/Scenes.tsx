import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, Laptop, RED, WarnIcon } from "../immich/kit";
import { eo, io, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/claude";
import { Chip, mix, sc } from "../launch/kit";

/**
 * Creator Secrets #05 scenes (Claude Code with Claude Pro, 3 steps, API billing, the Gemini CLI update).
 * Times come from src/episodes/claude.ts. Layout bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140,
 * subtitles 1160 to 1290, the presenter below that, all inside the Instagram safe zone (250 to 1580).
 * Real screenshots (11 Nov 2026): public/claude/pro-card.png (claude.com/pricing), docs.png (code.claude.com
 * overview), gemini-notice.png (github.com/google-gemini/gemini-cli README). Terminal screens are illustrations.
 */

type S = { t: number };
const CLAY = "#D97757"; // the accent Claude Code's own terminal uses for its ✻ mark
const TERM_BG = "#1B1B1A";
const TERM_FG = "#E8E6DF";
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera and wipes

export const CAM_ORIGIN = "540px 700px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  const open = 0.1 * (1 - eo(seg(t, 0.0, 1.2)));
  // No camera moves between C.free and C.setup: the Gemini update holds still.
  return 1 + open + push(C.ruko, 0.07, 0.4) + push(C.plan, 0.05, 0.6) + push(C.install, 0.03, 0.8) + push(C.login, 0.035) + push(C.mat + 1.0, 0.03) + push(C.charges, 0.05, 0.6) + push(C.codeWord, 0.04, 0.4);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.step1, C.dhyan, C.setup].map((at, i) => {
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
// Shared bits

const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, k * 3), transform: `scale(${lerp(2.1, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1)})`, filter: `blur(${Math.max(0, 1 - k) * 8}px)`, ...style }}>
      {children}
    </span>
  );
};

const StepHead: React.FC<{ t: number; at: number; out: number; n: number; title: string }> = ({ t, at, out, n, title }) => {
  const k = pop(t, at, { damping: 11, stiffness: 200 });
  const o = leave(t, out);
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: 1 - o, transform: `translateY(${(1 - mix(k)) * -60}px)` }}>
      <div style={{ ...type.label, fontSize: 30, color: P.lime, background: P.ink, borderRadius: 999, padding: "10px 22px 11px", transform: `scale(${sc(k)})` }}>STEP {n}</div>
      <div style={{ ...type.display, fontSize: 64, color: P.ink, whiteSpace: "nowrap", transform: `scale(${sc(pop(t, at + 0.08, { damping: 11, stiffness: 200 }))})` }}>{title}</div>
    </div>
  );
};

const STEPS = ["INSTALL", "LOGIN", "REVIEW"];
const StepDots: React.FC<{ t: number; on: number; at: number; out: number }> = ({ t, on, at, out }) => {
  const o = leave(t, out);
  const k = mix(pop(t, at, { damping: 12, stiffness: 200 }));
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 428, display: "flex", justifyContent: "center", gap: 14, opacity: k * (1 - o) }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ ...type.label, fontSize: 20, padding: "6px 14px", borderRadius: 999, border: `3px solid ${P.ink}`, background: i < on ? P.lime : i === on ? P.card : P.paper2, color: i <= on ? P.ink : P.ink3 }}>
          {i < on ? "✓ " : ""}
          {s}
        </div>
      ))}
    </div>
  );
};

const Arrow: React.FC<{ k: number; w?: number; down?: boolean; color?: string }> = ({ k, w = 60, down = false, color = P.ink }) => (
  <svg width={down ? 40 : w} height={down ? w : 40} viewBox={down ? `0 0 40 ${w}` : `0 0 ${w} 40`} style={{ opacity: k, flex: "0 0 auto" }}>
    {down ? (
      <path d={`M20 4 V${w - 10} M8 ${w - 22} L20 ${w - 8} L32 ${w - 22}`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} />
    ) : (
      <path d={`M4 20 H${w - 10} M${w - 22} 8 L${w - 8} 20 L${w - 22} 32`} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} />
    )}
  </svg>
);

/** One terminal line. `to` types it from `at` to `to`; `tone` sets the colour. */
type TL = { text: string; at: number; to?: number; tone?: "cmd" | "out" | "ok" | "warn" | "clay" | "sel" | "dim" | "you"; prefix?: string };
const TONE: Record<string, string> = { cmd: TERM_FG, out: "#BDBAB0", ok: P.lime, warn: P.gold, clay: CLAY, sel: P.ink, dim: "#8C897F", you: TERM_FG };

/** A dark terminal window that prints its lines on time (an illustration of the CLI, not a recording). */
const TermWin: React.FC<{ t: number; w: number; lines: TL[]; fs?: number; minH?: number; title?: string; glow?: number }> = ({ t, w, lines, fs = 26, minH = 0, title, glow = 0 }) => (
  <div style={{ width: w, background: TERM_BG, border: `5px solid ${P.ink}`, borderRadius: 20, boxShadow: `${shadow.hard(8)}${glow > 0 ? `, 0 0 ${50 * glow}px ${P.lime}` : ""}`, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", background: "#2C2B28" }}>
      {[RED, P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 15, height: 15, borderRadius: 99, background: c }} />
      ))}
      {title && <div style={{ marginLeft: 10, fontFamily: mono, fontSize: 17, color: "#9C998F", whiteSpace: "nowrap" }}>{title}</div>}
    </div>
    <div style={{ padding: "14px 18px 18px", fontFamily: mono, fontWeight: 500, fontSize: fs, lineHeight: 1.45, color: TERM_FG, minHeight: minH }}>
      {lines.map((l, i) => {
        if (t < l.at) return null;
        const n = l.to ? Math.floor(seg(t, l.at, l.to) * l.text.length + 0.0001) : l.text.length;
        const typing = l.to !== undefined && n < l.text.length;
        const pre = l.prefix ?? (l.tone === "cmd" ? "$ " : l.tone === "you" ? "> " : "");
        const k = Math.min(1, (t - l.at) / 0.12);
        return (
          <div key={i} style={{ whiteSpace: "pre-wrap", opacity: k, color: TONE[l.tone ?? "out"], background: l.tone === "sel" ? P.lime : "transparent", borderRadius: 6, padding: l.tone === "sel" ? "0 8px" : 0, margin: l.tone === "sel" ? "2px -8px" : 0 }}>
            {pre && <span style={{ color: l.tone === "sel" ? P.ink : l.tone === "you" ? CLAY : P.lime }}>{pre}</span>}
            {l.text.slice(0, n)}
            {typing && <span style={{ opacity: Math.floor(t * 6) % 2 ? 1 : 0, background: TERM_FG }}> </span>}
          </div>
        );
      })}
    </div>
  </div>
);

/** A real screenshot inside a browser card, with an optional scroll and highlight box (source pixels). */
const ShotCard: React.FC<{ src: string; srcW: number; w: number; h: number; url: string; scroll?: number; hl?: { y: number; h: number; x?: number; w?: number; k: number } }> = ({ src, srcW, w, h, url, scroll = 0, hl }) => {
  const s = (w - 10) / srcW;
  return (
    <div style={{ width: w, borderRadius: 20, border: `5px solid ${P.ink}`, background: P.card, overflow: "hidden", boxShadow: shadow.hard(8) }}>
      <div style={{ height: 42, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: `3px solid ${P.ink}`, background: P.paper2 }}>
        {[P.pink, P.gold, P.lime].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, border: `2px solid ${P.ink}` }} />
        ))}
        <div style={{ ...type.label, textTransform: "none", letterSpacing: "0.01em", fontSize: 15, color: P.ink2, marginLeft: 8, whiteSpace: "nowrap" }}>{url}</div>
      </div>
      <div style={{ position: "relative", height: h, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -scroll * s, width: w - 10 }} />
        {hl && hl.k > 0 && (
          <div style={{ position: "absolute", left: (hl.x ?? 8) * s, top: (hl.y - scroll) * s, width: (hl.w ?? srcW - 16) * s * Math.min(1, hl.k), height: hl.h * s, border: `5px solid ${P.lime}`, borderRadius: 10, background: "rgba(198,242,78,0.18)", boxShadow: "0 0 0 3px rgba(23,23,23,0.85)" }} />
        )}
      </div>
    </div>
  );
};

// =================================================================================================================
// 1. Hook: CLAUDE CODE KE LIYE EXTRA PAYMENT?! (visible on the first frame)

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.agar + 0.3) return null;
  const o = leave(t, C.agar);
  const bill = pop(t, 0.35, { damping: 12, stiffness: 170 });
  const q = pop(t, C.paise, { damping: 9, stiffness: 230 });
  const stop = pop(t, C.ruko, { damping: 8, stiffness: 260 });
  const shake = t > C.ruko && t < C.ruko + 0.35 ? Math.sin((t - C.ruko) * 70) * 10 * (1 - (t - C.ruko) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 372, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ ...type.display, fontSize: 66, color: P.ink, whiteSpace: "nowrap" }}>
          <Slam t={t} at={-0.35}>
            <span style={{ background: P.ink, color: P.lime, borderRadius: 14, padding: "2px 16px" }}>CLAUDE CODE</span> KE LIYE
          </Slam>
        </div>
        <div style={{ ...type.display, fontSize: 100, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.05em", textShadow: `6px 6px 0 ${P.lime}` }}>
          <Slam t={t} at={-0.2}>EXTRA PAYMENT?!</Slam>
        </div>
      </div>
      {/* The myth: a second subscription line for Claude Code (no real amounts) */}
      {bill > 0 && (
        <div style={{ ...centre(lerp(1300, 760, eo(mix(bill))), 860, 1, `rotate(${4 + Math.sin(t * 1.5) * 1.2}deg)`) }}>
          <div style={{ width: 420, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(8), padding: "20px 24px 22px" }}>
            <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>Monthly subscriptions</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, ...type.display, fontSize: 34, color: P.ink }}>
              <span>Claude Pro</span>
              <span style={{ color: P.olive }}>✓</span>
            </div>
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, ...type.display, fontSize: 34, color: P.ink }}>
              <span>Claude Code</span>
              <span style={{ background: P.gold, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "0 10px", transform: `scale(${q > 0 ? sc(q) : 0})` }}>₹ ???</span>
              {stop > 0 && <div style={{ position: "absolute", left: -10, top: 22, height: 8, width: `${Math.min(1, stop) * 104}%`, background: RED, borderRadius: 4, transform: "rotate(-3deg)" }} />}
            </div>
            <div style={{ marginTop: 18, borderTop: `3px dashed ${P.lineStrong}`, paddingTop: 12, ...type.label, fontSize: 18, color: P.ink3 }}>Pay twice?</div>
          </div>
        </div>
      )}
      {stop > 0 && (
        <div style={{ ...centre(770, 1040, sc(stop), `rotate(${(1 - mix(stop)) * 16 - 6}deg)`) }}>
          <Sticker size={74} tone="lime" rotate={0}>
            RUKO ZARA! ✋
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.ruko} x={770} y={1040} r={360} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 2. Claude Pro → Claude Code (real pricing card)

const PRO_ROW = 605; // "Claude Code" row in pro-card.png (source pixels)
export const ProScene: React.FC<S> = ({ t }) => {
  if (t < C.agar - 0.1 || t > C.bas + 0.3) return null;
  const o = leave(t, C.bas);
  const card = pop(t, C.agar + 0.05, { damping: 13, stiffness: 160 });
  const scroll = 330 * io(seg(t, C.pro + 0.2, C.to + 0.3));
  const hl = eo(seg(t, C.to + 0.3, C.plan));
  const a = pop(t, C.pro, { damping: 11, stiffness: 210 });
  const b = pop(t, C.to + 0.3, { damping: 11, stiffness: 210 });
  const term = pop(t, C.plan - 0.1, { damping: 12, stiffness: 180 });
  const inc = pop(t, C.shaamil, { damping: 8, stiffness: 250 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 335, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        <div style={{ transform: `scale(${sc(a)})` }}>
          <Chip text="CLAUDE PRO" size={44} tone="card" />
        </div>
        <Arrow k={eo(seg(t, C.to, C.to + 0.3))} w={80} />
        <div style={{ transform: `scale(${sc(b)})` }}>
          <Chip text="CLAUDE CODE" size={44} tone="lime" />
        </div>
      </div>
      {card > 0 && (
        <div style={{ ...centre(lerp(-300, 300, eo(mix(card))), 760, 1, "rotate(-2deg)") }}>
          <ShotCard src="claude/pro-card.png" srcW={380} w={440} h={560} url="claude.com/pricing" scroll={scroll} hl={{ y: PRO_ROW - 22, h: 46, x: 20, w: 330, k: hl }} />
        </div>
      )}
      {card > 0 && <DemoTag text="Real page · claude.com/pricing" style={{ left: 95, top: 1085, opacity: mix(card) }} />}
      {term > 0 && (
        <div style={{ ...centre(lerp(1400, 790, eo(mix(term))), 690, 1, "rotate(2deg)") }}>
          <TermWin
            t={t}
            w={430}
            fs={22}
            minH={150}
            title="claude"
            lines={[
              { text: "✻ Welcome to Claude Code!", at: C.plan, tone: "clay" },
              { text: "Signed in with Claude Pro", at: C.shaamil + 0.1, tone: "ok", prefix: "✓ " },
              { text: "", at: C.shaamil + 0.3, tone: "you", to: C.shaamil + 0.31 },
            ]}
          />
        </div>
      )}
      {inc > 0 && (
        <div style={{ ...centre(790, 900, sc(inc), `rotate(${(1 - mix(inc)) * 14 - 4}deg)`) }}>
          <Sticker size={74} tone="lime" rotate={0}>
            INCLUDED ✓
          </Sticker>
        </div>
      )}
      {inc > 0 && (
        <div style={{ ...centre(790, 1010, mix(inc)) }}>
          <Chip text="Plan usage limits apply" size={24} tone="card" />
        </div>
      )}
      <Burst t={t} at={C.shaamil} x={790} y={900} r={340} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 3. Bas 3 steps

export const ThreeScene: React.FC<S> = ({ t }) => {
  if (t < C.bas - 0.1 || t > C.step1 + 0.3) return null;
  const o = leave(t, C.step1);
  const head = pop(t, C.bas, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 430, sc(head), "rotate(-2deg)") }}>
        <Sticker size={96} tone="ink" rotate={0}>
          BAS 3 STEPS
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 610, display: "flex", justifyContent: "center", gap: 26 }}>
        {STEPS.map((s, i) => {
          const k = pop(t, C.teen + i * 0.2, { damping: 10, stiffness: 230 });
          return (
            <div key={s} style={{ width: 270, padding: "22px 0 20px", borderRadius: 26, background: i === 1 ? P.lime : P.card, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7), display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${sc(k)}) rotate(${(i - 1) * 3}deg)`, opacity: Math.min(1, k * 2) }}>
              <div style={{ ...type.display, fontSize: 96, color: P.ink, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ ...type.label, fontSize: 28, color: P.ink }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =================================================================================================================
// 4. Step 1: install (real docs page, then the command)

export const InstallScene: React.FC<S> = ({ t }) => {
  if (t < C.step1 - 0.1 || t > C.step2 + 0.3) return null;
  const lap = pop(t, C.step1 + 0.15, { damping: 13, stiffness: 150 });
  const scroll = 760 * io(seg(t, C.official + 0.5, C.install + 0.1));
  const hl = eo(seg(t, C.install + 0.1, C.install + 0.5));
  const term = pop(t, C.install + 0.35, { damping: 12, stiffness: 170 });
  const SW = 900 * 0.86 - 900 * 0.044 - 12;
  const s = SW / 860;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.step2) }}>
      <StepHead t={t} at={C.step1} out={C.step2} n={1} title="INSTALL" />
      <StepDots t={t} on={0} at={C.step1 + 0.1} out={C.step2} />
      {lap > 0 && (
        <div style={{ ...centre(540, lerp(1300, 740, eo(mix(lap))), 1) }}>
          <Laptop w={900}>
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#FAF9F5" }}>
              <Img src={staticFile("claude/docs.png")} style={{ position: "absolute", left: 0, top: -scroll * s, width: SW }} />
              {hl > 0 && (
                <div style={{ position: "absolute", left: 14 * s, top: (1150 - scroll) * s, width: 826 * s * hl, height: 62 * s, border: `5px solid ${P.lime}`, borderRadius: 10, boxShadow: "0 0 0 3px rgba(23,23,23,0.85)" }} />
              )}
            </div>
          </Laptop>
        </div>
      )}
      {lap > 0 && <DemoTag text="Real docs · code.claude.com" style={{ left: 95, top: 1015, opacity: mix(lap) }} />}
      {term > 0 && (
        <div style={{ ...centre(lerp(1500, 600, eo(mix(term))), 1030, 1, "rotate(-1deg)") }}>
          <TermWin
            t={t}
            w={760}
            fs={23}
            title="Windows PowerShell"
            lines={[
              { text: "irm https://claude.ai/install.ps1 | iex", at: C.install + 0.4, to: C.install + 0.95, tone: "cmd" },
              { text: "Claude Code installed", at: C.install + 1.05, tone: "ok", prefix: "✓ " },
            ]}
          />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. Step 2: terminal → claude → log in with the Claude subscription

export const LoginScene: React.FC<S> = ({ t }) => {
  if (t < C.step2 - 0.1 || t > C.step3 + 0.3) return null;
  const win = pop(t, C.step2 + 0.15, { damping: 13, stiffness: 160 });
  const ok = pop(t, C.login, { damping: 8, stiffness: 250 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.step3) }}>
      <StepHead t={t} at={C.step2} out={C.step3} n={2} title="LOGIN" />
      <StepDots t={t} on={1} at={C.step2 + 0.1} out={C.step3} />
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1400, 770, eo(mix(win))), 1) }}>
          <TermWin
            t={t}
            w={940}
            fs={25}
            minH={430}
            title="Terminal · my-project"
            glow={ok > 0 ? 0.35 : 0}
            lines={[
              { text: "cd my-project", at: C.terminal, to: C.terminal + 0.45, tone: "cmd" },
              { text: "claude", at: C.claudeCmd, to: C.claudeCmd + 0.35, tone: "cmd" },
              { text: "✻ Welcome to Claude Code!", at: C.claudeCmd + 0.55, tone: "clay" },
              { text: "Select login method:", at: C.account - 0.15, tone: "cmd" },
              { text: "1. Claude account with subscription · Pro, Max…", at: C.account, tone: "sel", prefix: "❯ " },
              { text: "2. Anthropic Console account · API usage billing", at: C.account + 0.15, tone: "dim", prefix: "  " },
              { text: "Login successful", at: C.login, tone: "ok", prefix: "✓ " },
            ]}
          />
        </div>
      )}
      {win > 0 && <DemoTag text="Illustration of the CLI" dark style={{ left: 95, top: 1070, opacity: mix(win) }} />}
      {ok > 0 && (
        <div style={{ ...centre(650, 1070, sc(ok), `rotate(${(1 - mix(ok)) * 12 - 3}deg)`) }}>
          <Sticker size={44} tone="lime" rotate={0}>
            SUBSCRIPTION LOGIN ✓
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 6. Step 3: open the project, ask for a read-only review

const FILES = [
  { name: "src/", dir: true },
  { name: "app.js", flag: 0 },
  { name: "utils.js", flag: 1 },
  { name: "index.html", flag: 2 },
  { name: "README.md" },
];
const REVIEW = ["app.js:24 · handle fetch errors", "utils.js:8 · unused variable", "index.html · add image alt text"];
const SEND = C.mat + 0.23;

export const ReviewScene: React.FC<S> = ({ t }) => {
  if (t < C.step3 - 0.1 || t > C.dhyan + 0.3) return null;
  const tree = pop(t, C.project, { damping: 12, stiffness: 180 });
  const term = pop(t, C.bolo - 0.1, { damping: 12, stiffness: 170 });
  const safe = pop(t, SEND + 0.95, { damping: 9, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.dhyan) }}>
      <StepHead t={t} at={C.step3} out={C.dhyan} n={3} title="REVIEW" />
      <StepDots t={t} on={2} at={C.step3 + 0.1} out={C.dhyan} />
      {tree > 0 && (
        <div style={{ ...centre(lerp(-300, 200, eo(mix(tree))), 720, 1, "rotate(-2deg)") }}>
          <div style={{ width: 300, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(7), padding: "16px 18px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, ...type.display, fontSize: 30, color: P.ink }}>
              <svg width={36} height={30} viewBox="0 0 36 30">
                <path d="M2 6 Q2 3 5 3 H14 L18 7 H31 Q34 7 34 10 V25 Q34 28 31 28 H5 Q2 28 2 25 Z" fill={P.gold} stroke={P.ink} strokeWidth={3} />
              </svg>
              my-project
            </div>
            {FILES.map((f, i) => {
              const k = pop(t, C.project + 0.15 + i * 0.08, { damping: 12, stiffness: 220 });
              const flagged = f.flag !== undefined && t > SEND + 0.3 + f.flag * 0.22;
              return (
                <div key={f.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingLeft: f.dir ? 0 : 22, fontFamily: mono, fontSize: 24, color: P.ink, opacity: Math.min(1, k * 2), transform: `translateX(${(1 - mix(k)) * -30}px)` }}>
                  <span>{f.dir ? "▸ " : ""}{f.name}</span>
                  {flagged && <span style={{ ...type.label, fontSize: 16, color: P.ink, background: P.gold, border: `2px solid ${P.ink}`, borderRadius: 8, padding: "2px 6px" }}>TIP</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {term > 0 && (
        <div style={{ ...centre(lerp(1500, 690, eo(mix(term))), 740, 1, "rotate(1deg)") }}>
          <TermWin
            t={t}
            w={600}
            fs={24}
            minH={440}
            title="claude · my-project"
            lines={[
              { text: "Review my code. Suggest improvements. Do not modify files.", at: C.prompt, to: C.mat + 0.13, tone: "you" },
              { text: "Read 5 files", at: SEND, tone: "clay", prefix: "● " },
              ...REVIEW.map((r, i) => ({ text: r, at: SEND + 0.3 + i * 0.22, tone: "warn" as const, prefix: `${i + 1}. ` })),
              { text: "No files changed.", at: SEND + 0.95, tone: "ok", prefix: "✓ " },
            ]}
          />
        </div>
      )}
      {term > 0 && <DemoTag text="Illustration · example project" style={{ left: 95, top: 1015, opacity: mix(term) }} />}
      {safe > 0 && (
        <div style={{ ...centre(730, 1060, sc(safe), "rotate(-3deg)") }}>
          <Sticker size={48} tone="lime" rotate={0}>
            READ-ONLY REVIEW ✓
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 7. API billing warning (split screen)

const BillCard: React.FC<{ title: string; line: string; foot: string; good: boolean; k: number; hot: number }> = ({ title, line, foot, good, k, hot }) => (
  <div style={{ width: 430, minHeight: 360, background: good ? P.lime : P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: `${shadow.hard(9)}${hot > 0 ? `, 0 0 ${60 * hot}px ${P.gold}` : ""}`, padding: "26px 26px 22px", display: "flex", flexDirection: "column", gap: 16, transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {good ? (
        <div style={{ width: 64, height: 64, borderRadius: 32, background: P.ink, color: P.lime, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 42 }}>✓</div>
      ) : (
        <WarnIcon size={64} />
      )}
      <div style={{ ...type.display, fontSize: 46, color: P.ink, lineHeight: 1 }}>{title}</div>
    </div>
    <div style={{ ...type.display, fontSize: 40, color: P.ink, lineHeight: 1.12 }}>{line}</div>
    <div style={{ marginTop: "auto", ...type.label, fontSize: 19, color: P.ink2, borderTop: `3px dashed ${good ? P.ink : P.lineStrong}`, paddingTop: 12 }}>{foot}</div>
  </div>
);

export const ApiScene: React.FC<S> = ({ t }) => {
  if (t < C.dhyan - 0.1 || t > C.free + 0.3) return null;
  const o = leave(t, C.free);
  const head = pop(t, C.dhyan, { damping: 10, stiffness: 220 });
  const left = pop(t, C.dhyan + 0.25, { damping: 12, stiffness: 190 });
  const right = pop(t, C.api, { damping: 12, stiffness: 190 });
  const hot = t > C.charges ? 0.6 + 0.4 * Math.sin((t - C.charges) * 9) : 0;
  const shake = t > C.charges && t < C.charges + 0.4 ? Math.sin((t - C.charges) * 60) * 9 * (1 - (t - C.charges) / 0.4) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 395, sc(head), "rotate(-2deg)") }}>
        <Sticker size={84} tone="ink" rotate={0}>
          DHYAN RAKHNA ⚠
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 520, display: "flex", justifyContent: "center", gap: 30 }}>
        <BillCard title="CLAUDE PRO" line="Included access within plan limits" foot="Login: Claude account" good k={left} hot={0} />
        <div style={{ transform: `translateX(${shake}px)` }}>
          <BillCard title="API BILLING" line="Separate charges may apply" foot="Login: API key (Console)" good={false} k={right} hot={hot} />
        </div>
      </div>
      {t > C.apiLogin && (
        <div style={{ ...centre(795, 965, sc(pop(t, C.apiLogin, { damping: 10, stiffness: 220 })), "rotate(3deg)") }}>
          <Chip text="API KEY = PAY PER USE" size={26} tone="ink" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 8. Gemini CLI, with Google's official update (free access ended on 18 June 2026)

export const GeminiScene: React.FC<S> = ({ t }) => {
  if (t < C.free - 0.15 || t > C.setup + 0.3) return null;
  const veil = eo(seg(t, C.free - 0.15, C.free + 0.25)) * (1 - eo(seg(t, C.setup - 0.15, C.setup + 0.15)));
  const o = leave(t, C.setup);
  const q = pop(t, C.free + 0.1, { damping: 10, stiffness: 210 });
  const flash = seg(t, C.gemini - 0.12, C.gemini + 0.4);
  const name = pop(t, C.gemini, { damping: 9, stiffness: 230 });
  const term = pop(t, C.gemini + 0.25, { damping: 12, stiffness: 180 });
  const strike = eo(seg(t, C.freeTier + 0.15, C.freeTier + 0.45));
  const stamp = pop(t, C.freeTier + 0.25, { damping: 7, stiffness: 260 });
  const notice = pop(t, C.freeTier + 0.5, { damping: 13, stiffness: 160 });
  const hl = eo(seg(t, C.freeTier + 0.9, C.limits));
  const moved = pop(t, C.limits, { damping: 10, stiffness: 220 });
  return (
    <>
      <div style={{ position: "absolute", inset: -60, background: `rgba(21,21,20,${0.94 * veil})` }} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
        {t < C.gemini + 0.1 && q > 0 && (
          <div style={{ ...centre(540, 620, sc(q) * (1 - eo(seg(t, C.gemini - 0.1, C.gemini + 0.1)))), ...type.display, fontSize: 104, color: "#F4F2EA", whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.05 }}>
            BILKUL <span style={{ color: P.lime }}>FREE</span>
            <br />
            AI CODER?
          </div>
        )}
        {flash > 0 && flash < 1 && (
          <div style={{ position: "absolute", left: 540 - 60, top: 640 - 60, width: 120, height: 120, borderRadius: 60, background: P.lime, transform: `scale(${lerp(0.2, 26, eo(flash))})`, opacity: 1 - eo(seg(t, C.gemini + 0.1, C.gemini + 0.4)) }} />
        )}
        {name > 0 && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${sc(name)})`, transformOrigin: "540px 60px" }}>
            <div style={{ ...type.display, fontSize: 92, color: "#F4F2EA", whiteSpace: "nowrap" }}>
              GEMINI CLI <span style={{ color: P.lime }}>—</span>
            </div>
            <div style={{ position: "relative", ...type.display, fontSize: 84, color: P.lime, whiteSpace: "nowrap" }}>
              FREE TIER?
              <div style={{ position: "absolute", left: -10, top: "50%", height: 10, width: `${strike * 106}%`, background: RED, borderRadius: 5, transform: "rotate(-4deg)" }} />
            </div>
          </div>
        )}
        {term > 0 && notice < 0.5 && (
          <div style={{ ...centre(540, lerp(1300, 790, eo(mix(term))), 1 - mix(notice) * 0.2) }}>
            <TermWin
              t={t}
              w={760}
              fs={26}
              minH={200}
              title="gemini-cli"
              lines={[
                { text: "gemini", at: C.gemini + 0.4, to: C.gemini + 0.75, tone: "cmd" },
                { text: "Free tier for personal accounts?", at: C.gemini + 0.95, tone: "dim", prefix: "? " },
              ]}
            />
          </div>
        )}
        {notice > 0 && (
          <div style={{ ...centre(540, lerp(1400, 795, eo(mix(notice))), 1, "rotate(-1deg)") }}>
            <ShotCard src="claude/gemini-notice.png" srcW={580} w={720} h={520} url="github.com/google-gemini/gemini-cli" scroll={130} hl={{ y: 290, h: 74, x: 52, w: 470, k: hl }} />
          </div>
        )}
        {stamp > 0 && (
          <div style={{ ...centre(810, 620, sc(stamp), `rotate(${(1 - mix(stamp)) * 20 + 8}deg)`) }}>
            <div style={{ ...type.display, fontSize: 46, color: RED, border: `7px solid ${RED}`, borderRadius: 16, padding: "6px 18px", background: "rgba(250,249,246,0.96)", whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.05 }}>
              UPDATE:
              <br />
              ENDED 18 JUN 2026
            </div>
          </div>
        )}
        {moved > 0 && (
          <div style={{ ...centre(540, 1105, sc(moved), "rotate(-1deg)") }}>
            <Sticker size={44} tone="lime" rotate={0}>
              FREE ACCESS MOVED → ANTIGRAVITY CLI
            </Sticker>
          </div>
        )}
        {notice > 0 && <DemoTag text="Official notice · Google, 2026" dark style={{ left: 95, top: 1300, opacity: mix(notice) }} />}
        {moved > 0 && <DemoTag text="Usage limits apply" dark style={{ left: 95, top: 1345, opacity: mix(moved) }} />}
      </div>
    </>
  );
};

// =================================================================================================================
// 9. Setup + comment CODE

export const CommentScene: React.FC<S> = ({ t }) => {
  if (t < C.setup - 0.1 || t > C.aisi + 0.3) return null;
  const o = leave(t, C.aisi);
  const head = pop(t, C.setup, { damping: 11, stiffness: 200 });
  const items = ["Install command", "Login steps", "Review prompt", "Official links"];
  const big = pop(t, C.codeWord, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 325, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${sc(head)})`, transformOrigin: "540px 0" }}>
          <div style={{ ...type.display, fontSize: 68, color: P.ink, whiteSpace: "nowrap" }}>Full setup +</div>
          <div style={{ ...type.display, fontSize: 68, color: P.ink, whiteSpace: "nowrap" }}>
            <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>official links?</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 90, width: 900, top: 520, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
        {items.map((s, i) => {
          const k = pop(t, C.links + i * 0.18, { damping: 11, stiffness: 220 });
          return (
            <div key={s} style={{ transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
              <Chip text={`✓ ${s}`} size={26} tone={i === 3 ? "lime" : "card"} />
            </div>
          );
        })}
      </div>
      <CommentCard t={t} at={C.comment - 0.1} keyword="CODE" typeAt={C.codeWord - 0.25} typeTo={C.codeWord + 0.05} sendAt={C.codeWord + 0.25} top={680} />
      {big > 0 && (
        <div style={{ ...centre(540, 960, sc(big), `rotate(${(1 - mix(big)) * -12 - 2}deg)`) }}>
          <Sticker size={100} tone="lime" rotate={0}>
            COMMENT &quot;CODE&quot;
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.codeWord + 0.25} x={540} y={960} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 10. Follow

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.aisi - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.aisi + 0.05, { damping: 10, stiffness: 210 });
  const mark = pop(t, C.follow + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.follow + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
  const tricks = ["AI tools", "Free options", "Real setups"];
  return (
    <>
      {nOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - nOut, transform: `scale(${1 - nOut * 0.2})`, transformOrigin: "540px 700px" }}>
          {head > 0 && (
            <div style={{ ...centre(540, 440, sc(head), "rotate(-1.5deg)") }}>
              <Sticker size={84} tone="ink" rotate={0}>
                MORE AI TRICKS
              </Sticker>
            </div>
          )}
          <div style={{ position: "absolute", left: 0, width: 1080, top: 600, display: "flex", justifyContent: "center", gap: 14 }}>
            {tricks.map((s, i) => {
              const k = pop(t, C.tricks - 0.3 + i * 0.15, { damping: 10, stiffness: 230 });
              return (
                <div key={s} style={{ transform: `scale(${sc(k)}) rotate(${(i - 1) * 3}deg)`, opacity: Math.min(1, k * 2) }}>
                  <Chip text={s} size={30} tone={i === 1 ? "lime" : "card"} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {mark > 0 && (
        <div style={{ ...centre(540, 560, sc(mark) * bump, `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 735, mix(handle)), ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>@INTERNETOOLBOX</span>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Creator Secrets · #05</div>}
      <FollowButton t={t} at={C.follow + 0.25} tapAt={C.follow + 0.55} top={870} invite />
      {t > C.follow + 0.55 && (
        <div style={{ ...centre(800, 920, mix(pop(t, C.follow + 0.65, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
      <Sparks t={t} at={C.brand} x={540} y={560} n={12} r={260} />
    </>
  );
};
