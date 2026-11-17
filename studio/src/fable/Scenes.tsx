import React from "react";
import { Burst, ClickRing, Pointer, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, PhoneShell, RED, WarnIcon } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/fable";
import { Chip, mix, sc } from "../launch/kit";
import { AiClip, BrowserWin, Card3D, cursorAt, EnergyLine, Streak, TermPill, type ClipKind } from "./kit";
import { AnthropicLogo, ClaudeLogo, ClaudeSpark, CLAY, HiggsLogo, HiggsTile, McpBadge } from "./logos";

/**
 * Creator Secrets #06 scenes: Fable 5.2, the Higgsfield MCP trial, 3 setup steps in Claude, the video reveal,
 * billing, comment FABLE, follow. Times come from src/episodes/fable.ts. Bands: brand bug ~258, headlines 320 to
 * 470, main visual 480 to 1140, subtitles 1170 to 1290, the presenter below, all inside the safe zone (250 to 1580).
 * Claude screens are reconstructions of the live app as checked on 11 Nov 2026 (Customize → Connectors →
 * "+ Add" → "Add custom connector"), labelled "Illustrative UI". Video clips are code illustrations, labelled.
 */

type S = { t: number };
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));
const CU = { bg: "#FAF9F5", side: "#F0EEE6", ink: "#141413", mute: "#73726C", line: "#E3E0D6" };
const MCP_URL = "https://mcp.higgsfield.ai/mcp";
const PROMPT = "Create a cinematic video of a futuristic Indian city at sunset.";

// =================================================================================================================
// Camera and wipes

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.12 * (1 - eo(seg(t, 0.0, 1.1)));
  return 1 + open + push(C.fiveTwo, 0.05, 0.7) + push(C.higgs, 0.04, 0.6) + push(C.paste, 0.03, 0.5) + push(C.banayega, 0.07, 1.2) + push(C.renew, 0.04, 0.5) + push(C.fableWord, 0.05, 0.4);
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

/** Light streaks over everything (hook, Higgsfield, the terms). */
export const Streaks: React.FC<S> = ({ t }) => (
  <>
    <Streak t={t} at={0.02} />
    <Streak t={t} at={C.aur} />
    <Streak t={t} at={C.banayega - 0.1} dur={0.45} />
    <Streak t={t} at={C.terms - 0.05} />
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

const Cursor: React.FC<{ t: number; keys: [number, number, number][]; clicks: number[] }> = ({ t, keys, clicks }) => {
  const [x, y] = cursorAt(t, keys);
  const last = clicks.filter((c) => t >= c).pop();
  const press = clicks.some((c) => t >= c && t < c + 0.12) ? 0.86 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 20 }}>
      {last !== undefined && t < last + 0.5 && <ClickRing k={seg(t, last, last + 0.5)} />}
      <div style={{ transform: "scale(0.7)", transformOrigin: "0 0" }}>
        <Pointer press={press} />
      </div>
    </div>
  );
};

/** Highlight ring around a UI element (window coordinates). */
const Ring: React.FC<{ x: number; y: number; w: number; h: number; k: number; r?: number }> = ({ x, y, w, h, k, r = 12 }) =>
  k > 0 ? <div style={{ position: "absolute", left: x - 6, top: y - 6, width: w + 12, height: h + 12, borderRadius: r, border: `5px solid ${P.lime}`, boxShadow: "0 0 0 3px rgba(23,23,23,0.85)", opacity: Math.min(1, k), transform: `scale(${lerp(1.15, 1, eo(Math.min(1, k)))})` }} /> : null;

const Typed: React.FC<{ t: number; text: string; at: number; to: number; caret?: boolean }> = ({ t, text, at, to, caret = true }) => {
  const n = Math.floor(seg(t, at, to) * text.length + 0.0001);
  const typing = t >= at && n < text.length;
  return (
    <>
      {t >= at ? text.slice(0, n) : ""}
      {caret && typing && <span style={{ display: "inline-block", width: 3, height: "1em", background: CU.ink, verticalAlign: "-0.12em", opacity: Math.floor(t * 6) % 2 ? 1 : 0 }} />}
    </>
  );
};

// =================================================================================================================
// 1. Hook: AI VIDEOS INSIDE CLAUDE?! (visible on frame 0), then the Claude logo and the Fable 5.2 card

const WALL: { kind: ClipKind; x: number; y: number; r: number }[] = [
  { kind: "city", x: 225, y: 700, r: -8 },
  { kind: "landscape", x: 855, y: 690, r: 7 },
  { kind: "character", x: 250, y: 985, r: 6 },
  { kind: "film", x: 835, y: 990, r: -6 },
];

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.aur + 0.3) return null;
  const o = leave(t, C.aur);
  const h1Out = eo(seg(t, C.fable - 0.2, C.fable + 0.05));
  const logo = pop(t, C.anthropic, { damping: 12, stiffness: 150 });
  const logoOut = eo(seg(t, C.fable - 0.1, C.fable + 0.2));
  const fable = pop(t, C.fable, { damping: 13, stiffness: 140 });
  const fiveTwo = pop(t, C.fiveTwo, { damping: 8, stiffness: 240 });
  const spread = eo(seg(t, C.anthropic, C.anthropic + 0.5));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* The wall of AI-video thumbnails */}
      {WALL.map((c, i) => {
        const k = pop(t, -0.4 + i * 0.07, { damping: 12, stiffness: 170 });
        const dx = (c.x < 540 ? -1 : 1) * 70 * spread;
        const fade = 1 - 0.45 * spread * (1 - h1Out * 0.0);
        return (
          <div key={c.kind} style={{ ...centre(c.x + dx, c.y + Math.sin(t * 1.4 + i) * 8, sc(k) * (1 - 0.12 * spread), `rotate(${c.r}deg)`), opacity: Math.min(1, k * 2) * fade }}>
            <div style={{ border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(8), overflow: "hidden" }}>
              <AiClip kind={c.kind} t={t + i * 3} w={250} h={250} radius={16} />
            </div>
          </div>
        );
      })}
      {/* Headline 1 */}
      {h1Out < 1 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 345, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 1 - h1Out, transform: `translateY(${-40 * h1Out}px)` }}>
          <div style={{ ...type.display, fontSize: 118, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.05em", textShadow: `6px 6px 0 ${P.lime}` }}>
            <Slam t={t} at={-0.35}>AI VIDEOS</Slam>
          </div>
          <div style={{ ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
            <Slam t={t} at={-0.22}>
              INSIDE <span style={{ background: P.ink, color: P.lime, borderRadius: 14, padding: "0 16px" }}>CLAUDE</span>?!
            </Slam>
          </div>
        </div>
      )}
      {/* The official Claude logo, big */}
      {logo > 0 && logoOut < 1 && (
        <div style={{ ...centre(540, 830, sc(logo) * (1 - 0.3 * logoOut)), opacity: 1 - logoOut }}>
          <Card3D k={logo} t={t} yaw={-26}>
            <div style={{ background: P.card, border: `6px solid ${P.ink}`, borderRadius: 30, padding: "40px 54px 30px", boxShadow: `${shadow.hard(10)}, 0 0 70px rgba(217,119,87,0.35)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <ClaudeLogo h={112} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, ...type.label, fontSize: 20, color: P.ink3 }}>
                BY <AnthropicLogo h={20} />
              </div>
            </div>
          </Card3D>
        </div>
      )}
      {/* Headline 2 + the Fable 5.2 model card */}
      {fable > 0 && (
        <div style={{ ...centre(540, 400, sc(fable), "rotate(-1.5deg)") }}>
          <Sticker size={70} tone="ink" rotate={0}>
            NEW CLAUDE MODEL
          </Sticker>
        </div>
      )}
      {fable > 0 && (
        <div style={{ ...centre(540, lerp(1200, 800, eo(mix(fable)))) }}>
          <Card3D k={fable} t={t} yaw={30}>
            <div style={{ width: 760, background: "#141413", border: `6px solid ${P.ink}`, borderRadius: 34, padding: "40px 46px 34px", boxShadow: `${shadow.hard(10)}, 0 0 ${60 + 40 * Math.sin(t * 3)}px rgba(217,119,87,0.45)`, display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
              {/* subtle animated background lines */}
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: -100 + ((t * 60 + i * 150) % 1000), top: 0, width: 2, height: "100%", background: "rgba(250,249,245,0.06)", transform: "skewX(-20deg)" }} />
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <ClaudeLogo h={64} light />
                <div style={{ ...type.label, fontSize: 18, color: "#141413", background: P.lime, borderRadius: 999, padding: "6px 14px" }}>AI MODEL</div>
              </div>
              <div style={{ ...type.display, fontSize: 150, color: "#FAF9F5", letterSpacing: "-0.05em", lineHeight: 0.95, whiteSpace: "nowrap" }}>
                Fable <span style={{ display: "inline-block", color: CLAY, transform: `scale(${fiveTwo > 0 ? sc(fiveTwo) : 0.001})`, transformOrigin: "20% 60%" }}>5.2</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid rgba(250,249,245,0.18)", paddingTop: 14 }}>
                <AnthropicLogo h={18} light />
                <div style={{ fontFamily: mono, fontSize: 20, color: "#C9C6BC" }}>Launched 9 Nov 2026</div>
              </div>
            </div>
          </Card3D>
        </div>
      )}
      <Burst t={t} at={C.fiveTwo} x={760} y={790} r={380} color={CLAY} />
    </div>
  );
};

// =================================================================================================================
// 2. Higgsfield + the 3-day trial + what people try

const USES: { kind: ClipKind; label: string }[] = [
  { kind: "landscape", label: "Cinematic landscape" },
  { kind: "product", label: "Product animation" },
  { kind: "character", label: "Character animation" },
  { kind: "film", label: "Short film scene" },
];

export const HiggsScene: React.FC<S> = ({ t }) => {
  if (t < C.aur - 0.1 || t > C.lekin + 0.3) return null;
  const o = leave(t, C.lekin);
  const mini = pop(t, C.aur + 0.05, { damping: 13, stiffness: 170 });
  const logo = pop(t, C.higgs, { damping: 11, stiffness: 160 });
  const shrink = eo(seg(t, C.jisme - 0.1, C.jisme + 0.3));
  const trial = pop(t, C.teen, { damping: 8, stiffness: 250 });
  const zero = pop(t, C.free + 0.1, { damping: 10, stiffness: 220 });
  const trialOut = eo(seg(t, C.jisme - 0.15, C.jisme + 0.1));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* Claude's model (left) vs Higgsfield's video tools (right): kept apart on purpose */}
      {mini > 0 && (
        <div style={{ ...centre(lerp(540, 285, eo(mix(mini))), 400, lerp(1.4, 1, eo(mix(mini)))), opacity: 1 - shrink }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#141413", border: `5px solid ${P.ink}`, borderRadius: 22, padding: "14px 20px", boxShadow: shadow.hard(6) }}>
            <ClaudeSpark size={46} />
            <div>
              <div style={{ ...type.display, fontSize: 34, color: "#FAF9F5", whiteSpace: "nowrap" }}>Fable 5.2</div>
              <div style={{ ...type.label, fontSize: 15, color: P.lime }}>AI MODEL · CLAUDE</div>
            </div>
          </div>
        </div>
      )}
      {logo > 0 && (
        <div style={{ ...centre(810, 400, sc(logo) * (1 - shrink)), opacity: 1 - shrink }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, padding: "12px 18px", boxShadow: shadow.hard(6) }}>
            <HiggsTile size={50} />
            <div>
              <div style={{ ...type.display, fontSize: 34, color: P.ink, whiteSpace: "nowrap" }}>Higgsfield</div>
              <div style={{ ...type.label, fontSize: 15, color: P.olive }}>AI VIDEO · SEPARATE SERVICE</div>
            </div>
          </div>
        </div>
      )}
      {/* The big Higgsfield reveal */}
      {logo > 0 && (
        <div style={{ ...centre(540, lerp(760, 700, shrink), sc(logo) * lerp(1, 0.55, shrink)), opacity: 1 - shrink }}>
          <Card3D k={logo} t={t} yaw={-28}>
            <div style={{ background: "#0E0E0E", border: `6px solid ${P.ink}`, borderRadius: 34, padding: "52px 60px", boxShadow: `${shadow.hard(10)}, 0 0 ${70 + 30 * Math.sin(t * 3)}px rgba(209,254,23,0.45)` }}>
              <HiggsLogo h={124} light />
            </div>
          </Card3D>
        </div>
      )}
      <Burst t={t} at={C.higgs} x={540} y={760} r={420} color={P.lime} />
      {trial > 0 && trialOut < 1 && (
        <div style={{ ...centre(540, 990, sc(trial) * (1 - trialOut), `rotate(${(1 - mix(trial)) * 14 - 3}deg)`), opacity: 1 - trialOut }}>
          <Sticker size={80} tone="lime" rotate={0}>
            3-DAY MCP TRIAL
          </Sticker>
        </div>
      )}
      {zero > 0 && trialOut < 1 && (
        <div style={{ ...centre(540, 1100, mix(zero)), opacity: 1 - trialOut, display: "flex", gap: 12 }}>
          <Chip text="$0 to start" size={28} tone="ink" />
          <Chip text="then a paid plan" size={28} tone="card" />
        </div>
      )}
      {/* Use cases (illustrations) */}
      {USES.map((u, i) => {
        const k = pop(t, C.ai + i * 0.18, { damping: 12, stiffness: 200 });
        if (k <= 0) return null;
        const x = i % 2 ? 790 : 290;
        const y = i < 2 ? 640 : 930;
        return (
          <div key={u.kind} style={{ ...centre(x, y, sc(k), `rotate(${(i % 2 ? 1 : -1) * 2}deg)`), opacity: Math.min(1, k * 2) }}>
            <div style={{ border: `5px solid ${P.ink}`, borderRadius: 22, overflow: "hidden", boxShadow: shadow.hard(7), background: P.card }}>
              <AiClip kind={u.kind} t={t + i * 2} w={400} h={220} radius={0} />
              <div style={{ ...type.display, fontSize: 28, color: P.ink, padding: "10px 16px 12px", borderTop: `4px solid ${P.ink}`, whiteSpace: "nowrap" }}>{u.label}</div>
            </div>
          </div>
        );
      })}
      {t > C.ai && <DemoTag text="Illustrations made in code · not real generations" style={{ left: 250, top: 1110, opacity: mix(pop(t, C.ai + 0.6)) }} />}
      {t > C.models - 0.2 && (
        <div style={{ ...centre(540, 470, sc(pop(t, C.models - 0.2, { damping: 11, stiffness: 210 })), "rotate(-1deg)") }}>
          <Chip text={<span style={{ display: "flex", alignItems: "center", gap: 12 }}><HiggsTile size={34} /> AI video models on Higgsfield</span>} size={30} tone="card" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 3. How does it work? CLAUDE → MCP → HIGGSFIELD → VIDEO

const NODES_Y = 790;
const NODES_X = [150, 400, 660, 925];

export const HowScene: React.FC<S> = ({ t }) => {
  if (t < C.lekin - 0.1 || t > C.bas + 0.3) return null;
  const o = leave(t, C.bas);
  const q = pop(t, C.lekin, { damping: 10, stiffness: 220 });
  const tag = pop(t, C.kaise, { damping: 9, stiffness: 230 });
  const at = (i: number) => C.lekin + 0.35 + i * 0.45;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 410, sc(q) * (1 - 0.15 * mix(tag)), "rotate(-1.5deg)") }}>
        <Sticker size={74} tone="ink" rotate={0}>
          KAAM KAISE KAREGA?
        </Sticker>
      </div>
      {tag > 0 && (
        <div style={{ ...centre(540, 1060, sc(tag), "rotate(1deg)") }}>
          <TermPill text="HIGGSFIELD MCP" k={tag} size={56} />
        </div>
      )}
      {[0, 1, 2].map((i) => (
        <EnergyLine key={i} from={[NODES_X[i] + 70, NODES_Y]} to={[NODES_X[i + 1] - 70, NODES_Y]} k={seg(t, at(i) + 0.15, at(i) + 0.45)} t={t + i * 0.3} />
      ))}
      {NODES_X.map((x, i) => {
        const k = pop(t, at(i) - 0.15, { damping: 10, stiffness: 220 });
        if (k <= 0) return null;
        const label = ["CLAUDE", "MCP", "HIGGSFIELD", "VIDEO"][i];
        return (
          <div key={i} style={{ ...centre(x, NODES_Y + 40, sc(k)), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 0 && (
                <div style={{ width: 140, height: 140, borderRadius: 34, background: "#141413", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadow.hard(6) }}>
                  <ClaudeSpark size={92} />
                </div>
              )}
              {i === 1 && <McpBadge size={140} dark label={false} glow={t > at(1) + 0.4 ? 0.6 + 0.4 * Math.sin(t * 6) : 0} />}
              {i === 2 && <HiggsTile size={140} style={{ border: `5px solid ${P.ink}`, boxShadow: shadow.hard(6) }} />}
              {i === 3 && (
                <div style={{ border: `5px solid ${P.ink}`, borderRadius: 26, overflow: "hidden", boxShadow: shadow.hard(6) }}>
                  <AiClip kind="city" t={t} w={140} h={140} radius={0} hud={false} />
                </div>
              )}
            </div>
            <div style={{ ...type.label, fontSize: 24, color: P.ink, whiteSpace: "nowrap" }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 4. 3 easy steps

const STEP_NAMES = ["SETTINGS", "CONNECTOR", "SIGN IN + ASK"];
export const ThreeScene: React.FC<S> = ({ t }) => {
  if (t < C.bas - 0.1 || t > C.step1 + 0.3) return null;
  const o = leave(t, C.step1);
  const head = pop(t, C.bas, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 440, sc(head), "rotate(-2deg)") }}>
        <Sticker size={96} tone="ink" rotate={0}>
          3 EASY STEPS
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 600, display: "flex", justifyContent: "center", gap: 22 }}>
        {STEP_NAMES.map((s, i) => {
          const k = pop(t, C.three + i * 0.2, { damping: 10, stiffness: 230 });
          return (
            <div key={s} style={{ width: 290, padding: "24px 0 22px", borderRadius: 26, background: i === 1 ? P.lime : P.card, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7), display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${sc(k)}) rotate(${(i - 1) * 3}deg)`, opacity: Math.min(1, k * 2) }}>
              <div style={{ ...type.display, fontSize: 100, color: P.ink, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ ...type.label, fontSize: 25, color: P.ink, whiteSpace: "nowrap" }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =================================================================================================================
// Claude window (reconstruction). Window inner size 900 × 590; positions below are window coordinates.

const WIN_W = 900;
const WIN_H = 590;
const WIN_X = 540;
const WIN_Y = 790;

const Sidebar: React.FC<{ hot?: number }> = ({ hot = 0 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 210, background: CU.side, borderRight: `2px solid ${CU.line}`, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <ClaudeLogo h={30} />
    </div>
    {["New chat", "Search", "Projects", "Artifacts", "Customize"].map((s) => (
      <div key={s} style={{ fontFamily: "inherit", fontSize: 21, color: CU.ink, padding: "7px 8px", borderRadius: 8 }}>{s}</div>
    ))}
    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 10, background: hot > 0 ? "#E6E3D8" : "transparent" }}>
      <div style={{ width: 34, height: 34, borderRadius: 17, background: "#C9C5BB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: CU.ink }}>Y</div>
      <div style={{ fontSize: 19, color: CU.ink }}>Your account</div>
    </div>
  </div>
);

const SETTINGS_NAV = ["Account", "Billing", "Usage", "Appearance", "Your Claude", "Capabilities", "Notifications", "Privacy", "Customize", "Code"];

/** Settings dialog: search + nav on the left, a panel on the right. */
const SettingsDialog: React.FC<{ k: number; panel: "general" | "connectors" | "customize"; search: React.ReactNode; addHot?: number }> = ({ k, panel, search, addHot = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: `rgba(20,20,19,${0.35 * Math.min(1, k)})` }}>
    <div style={{ position: "absolute", left: 40, top: 30, width: WIN_W - 80, height: WIN_H - 60, background: CU.bg, borderRadius: 18, border: `2px solid ${CU.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", overflow: "hidden", transform: `scale(${lerp(0.94, 1, eo(Math.min(1, k)))})`, opacity: Math.min(1, k * 2) }}>
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 22px", borderBottom: `2px solid ${CU.line}`, fontSize: 24, fontWeight: 700, color: CU.ink }}>Settings</div>
      <div style={{ position: "absolute", left: 0, top: 52, bottom: 0, width: 230, borderRight: `2px solid ${CU.line}`, padding: "14px 14px" }}>
        <div style={{ height: 38, borderRadius: 10, border: `2px solid ${CU.line}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 19, color: CU.mute, marginBottom: 10 }}>{search}</div>
        {SETTINGS_NAV.map((s) => (
          <div key={s} style={{ fontSize: 19, color: CU.ink, padding: "5px 8px", borderRadius: 8, background: (panel === "customize" && s === "Customize") ? "#E6E3D8" : "transparent" }}>{s}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 250, top: 70, right: 22, bottom: 20 }}>
        {panel === "general" && (
          <>
            <div style={{ fontSize: 26, fontWeight: 700, color: CU.ink }}>Account</div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ marginTop: 18, height: 18, width: [300, 360, 240][i], borderRadius: 9, background: "#E9E6DC" }} />
            ))}
          </>
        )}
        {panel === "connectors" && (
          <>
            <div style={{ fontSize: 26, fontWeight: 700, color: CU.ink }}>Connectors</div>
            <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.45, color: CU.ink }}>
              Connectors have moved to <span style={{ color: "#2F6FDE", textDecoration: "underline" }}>Customize</span>. Head there to browse, connect, and manage them.
            </div>
          </>
        )}
        {panel === "customize" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {["Connectors", "Skills", "Plugins"].map((s, i) => (
                <div key={s} style={{ fontSize: 19, padding: "6px 12px", borderRadius: 9, border: `2px solid ${i === 0 ? CU.ink : CU.line}`, background: i === 0 ? "#fff" : "transparent", color: CU.ink }}>{s}</div>
              ))}
              <div style={{ marginLeft: "auto", fontSize: 19, padding: "6px 14px", borderRadius: 9, background: addHot > 0 ? P.lime : "#E6E3D8", color: CU.ink, fontWeight: 700 }}>+ Add ▾</div>
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ marginTop: 14, height: 62, borderRadius: 12, border: `2px solid ${CU.line}`, background: "#fff", display: "flex", alignItems: "center", gap: 12, padding: "0 14px" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: ["#DCE8FB", "#FBE3DC", "#E3F4D7", "#EFE3FB"][i] }} />
                <div style={{ height: 14, width: [180, 140, 200, 160][i], borderRadius: 7, background: "#E9E6DC" }} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
);

const ClaudeHome: React.FC<{ composer?: React.ReactNode; chip?: boolean }> = ({ composer, chip = false }) => (
  <>
    <Sidebar />
    <div style={{ position: "absolute", left: 210, right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 38, color: CU.ink, fontWeight: 600 }}>
        <ClaudeSpark size={40} /> How can I help you today?
      </div>
      <div style={{ width: 600, minHeight: 130, background: "#fff", border: `2px solid ${CU.line}`, borderRadius: 18, padding: "16px 18px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 23, lineHeight: 1.35, color: composer ? CU.ink : CU.mute }}>{composer ?? "How can I help you today?"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <div style={{ fontSize: 20, color: CU.mute }}>+</div>
          {chip && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 17, color: CU.ink, background: "#F3F1EA", border: `2px solid ${CU.line}`, borderRadius: 999, padding: "3px 10px 3px 4px" }}>
              <HiggsTile size={22} /> Higgsfield ✓
            </div>
          )}
          <div style={{ marginLeft: "auto", fontSize: 16, color: CU.mute }}>Fable 5.2</div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: CLAY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>↑</div>
        </div>
      </div>
    </div>
  </>
);

/** Where the window sits on screen (for the cursor). */
const winToScreen = (x: number, y: number): [number, number] => [WIN_X - WIN_W / 2 + x, WIN_Y - (WIN_H + 46) / 2 + 46 + y];

const ClaudeWindow: React.FC<{ t: number; k: number; children: React.ReactNode; url?: string }> = ({ k, children, url = "claude.ai" }) => (
  <div style={{ ...centre(WIN_X, lerp(1300, WIN_Y, eo(Math.min(1, k)))) }}>
    <BrowserWin w={WIN_W} h={WIN_H} url={url}>
      {children}
    </BrowserWin>
  </div>
);

// =================================================================================================================
// 5. Step 1: Settings → Connectors (now under Customize)

export const Step1Scene: React.FC<S> = ({ t }) => {
  if (t < C.step1 - 0.1 || t > C.step2 + 0.3) return null;
  const win = pop(t, C.step1 + 0.1, { damping: 14, stiffness: 160 });
  const menu = pop(t, C.claudeSet + 0.25, { damping: 14, stiffness: 240 });
  const dlg = seg(t, C.settings + 0.15, C.settings + 0.4);
  const panel: "general" | "connectors" | "customize" = t > C.kholo - 0.25 ? "customize" : t > C.connectors ? "connectors" : "general";
  const search = t > C.phir + 0.05 ? <Typed t={t} text="Connectors" at={C.phir + 0.05} to={C.connectors - 0.02} /> : "Search";
  const p1 = pop(t, C.settings, { damping: 10, stiffness: 230 });
  const p2 = pop(t, C.connectors, { damping: 10, stiffness: 230 });
  const p3 = pop(t, C.kholo - 0.2, { damping: 10, stiffness: 230 });
  const cur = (x: number, y: number): [number, number] => winToScreen(x, y);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.step2) }}>
      <StepHead t={t} at={C.step1} out={C.step2} n={1} title="SETTINGS" />
      {win > 0 && (
        <ClaudeWindow t={t} k={win}>
          <ClaudeHome />
          {menu > 0 && dlg < 1 && (
            <div style={{ position: "absolute", left: 14, bottom: 64, width: 220, background: "#fff", border: `2px solid ${CU.line}`, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", padding: 8, transform: `scale(${lerp(0.9, 1, eo(mix(menu)))})`, transformOrigin: "0 100%", opacity: mix(menu) }}>
              {["Settings", "Language", "Get help", "Log out"].map((s, i) => (
                <div key={s} style={{ fontSize: 20, padding: "7px 10px", borderRadius: 8, background: i === 0 && t > C.settings - 0.2 ? P.lime : "transparent", color: CU.ink, fontWeight: i === 0 ? 700 : 400 }}>{s}</div>
              ))}
            </div>
          )}
          {dlg > 0 && <SettingsDialog k={dlg} panel={panel} search={search} />}
          {panel === "connectors" && <Ring x={250 + 40 + 132} y={30 + 70 + 52} w={112} h={30} k={eo(seg(t, C.connectors + 0.1, C.connectors + 0.3))} r={8} />}
          {panel === "customize" && <Ring x={40 + 250} y={30 + 70} w={150} h={38} k={eo(seg(t, C.kholo - 0.15, C.kholo + 0.1))} r={10} />}
        </ClaudeWindow>
      )}
      {win > 0 && <DemoTag text="Illustrative UI · Claude, Nov 2026" style={{ left: 600, top: 486, opacity: mix(win) }} />}
      {win > 0 && (
        <Cursor
          t={t}
          keys={[
            [C.step1, ...cur(620, 420)],
            [C.claudeSet + 0.2, ...cur(110, 560)],
            [C.settings - 0.05, ...cur(80, 380)],
            [C.connectors + 0.3, ...cur(450, 160)],
            [C.kholo - 0.1, ...cur(340, 120)],
          ]}
          clicks={[C.claudeSet + 0.2, C.settings, C.connectors + 0.32]}
        />
      )}
      {/* Readable labels: Settings → Connectors (→ Customize) */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1088, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        {p1 > 0 && <TermPill text="SETTINGS" k={p1} tone="card" size={34} />}
        {p2 > 0 && <div style={{ ...type.display, fontSize: 40, color: P.ink, opacity: mix(p2) }}>→</div>}
        {p2 > 0 && <TermPill text="CONNECTORS" k={p2} size={34} />}
        {p3 > 0 && <TermPill text="now in CUSTOMIZE" k={p3} tone="ink" size={28} />}
      </div>
    </div>
  );
};

// =================================================================================================================
// 6. Step 2: Add custom connector → name + MCP link → Continue

export const Step2Scene: React.FC<S> = ({ t }) => {
  if (t < C.step2 - 0.1 || t > C.step3 + 0.3) return null;
  const drop = pop(t, C.add + 0.12, { damping: 14, stiffness: 240 });
  const modal = seg(t, C.click + 0.05, C.click + 0.3);
  const fly = eo(seg(t, C.paste - 0.25, C.paste));
  const pasted = t >= C.paste;
  const flash = pasted ? 1 - seg(t, C.paste, C.paste + 0.5) : 0;
  const done = t > C.connect + 0.05;
  const copy = pop(t, C.higgsLink, { damping: 12, stiffness: 190 });
  const pillA = pop(t, C.add, { damping: 10, stiffness: 230 });
  const pillB = pop(t, C.paste, { damping: 9, stiffness: 240 });
  const cur = (x: number, y: number): [number, number] => winToScreen(x, y);
  // modal geometry (window coords)
  const MX = 150;
  const MY = 70;
  const MW = 600;
  const urlField: [number, number] = [MX + 24, MY + 250];
  const [ux, uy] = winToScreen(urlField[0] + 260, urlField[1] + 22);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.step3) }}>
      <StepHead t={t} at={C.step2} out={C.step3} n={2} title="ADD CONNECTOR" />
      <ClaudeWindow t={t} k={1}>
        <ClaudeHome />
        <SettingsDialog k={1} panel="customize" search="Search" addHot={t > C.add ? 1 : 0} />
        {drop > 0 && modal < 1 && (
          <div style={{ position: "absolute", right: 40, top: 30 + 70 + 44, width: 290, background: "#fff", border: `2px solid ${CU.line}`, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", padding: 8, opacity: mix(drop), transform: `translateY(${(1 - eo(mix(drop))) * -10}px)` }}>
            <div style={{ fontSize: 21, padding: "9px 12px", borderRadius: 8, background: t > C.click - 0.35 ? P.lime : "transparent", color: CU.ink, fontWeight: 700 }}>Add custom connector</div>
          </div>
        )}
        {modal > 0 && (
          <div style={{ position: "absolute", inset: 0, background: `rgba(20,20,19,${0.4 * modal})` }}>
            <div style={{ position: "absolute", left: MX, top: MY, width: MW, background: CU.bg, borderRadius: 18, border: `2px solid ${CU.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.3)", padding: "22px 24px", transform: `scale(${lerp(0.92, 1, eo(modal))})`, opacity: Math.min(1, modal * 2) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 27, fontWeight: 700, color: CU.ink }}>Add custom connector</div>
                <div style={{ fontSize: 17, color: CU.mute }}>{done ? "Step 2 of 2" : "Step 1 of 2"}</div>
              </div>
              <div style={{ marginTop: 18, fontSize: 18, color: CU.mute }}>Name</div>
              <div style={{ marginTop: 6, height: 46, borderRadius: 10, border: `2px solid ${t > C.click && t < C.higgsLink ? CU.ink : CU.line}`, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 22, color: CU.ink }}>
                <Typed t={t} text="Higgsfield" at={C.click + 0.25} to={C.higgsLink - 0.1} />
              </div>
              <div style={{ marginTop: 16, fontSize: 18, color: CU.mute }}>MCP server URL</div>
              <div style={{ position: "relative", marginTop: 6, height: 46, borderRadius: 10, border: `2px solid ${pasted ? CU.ink : CU.line}`, background: pasted ? `rgba(200,241,105,${0.25 + 0.6 * flash})` : "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontFamily: mono, fontSize: 21, color: pasted ? CU.ink : "#A9A69C", whiteSpace: "nowrap" }}>
                {pasted ? MCP_URL : "https://mcp.example.com/mcp"}
              </div>
              <div style={{ marginTop: 14, fontSize: 16, lineHeight: 1.4, color: CU.mute }}>Only use connectors from developers you trust.</div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <div style={{ fontSize: 20, padding: "8px 16px", borderRadius: 10, border: `2px solid ${CU.line}`, color: CU.ink }}>Cancel</div>
                <div style={{ fontSize: 20, padding: "8px 18px", borderRadius: 10, background: done ? P.lime : t > C.paste + 0.3 ? CU.ink : "#C9C6BC", color: done ? CU.ink : "#fff", fontWeight: 700 }}>{done ? "Connect ✓" : "Continue"}</div>
              </div>
            </div>
            {done && <Ring x={MX + MW - 24 - 128} y={MY + 400} w={128} h={44} k={eo(seg(t, C.connect, C.connect + 0.25))} r={10} />}
          </div>
        )}
      </ClaudeWindow>
      <DemoTag text="Illustrative UI · Claude, Nov 2026" style={{ left: 600, top: 486 }} />
      {/* The MCP link from Higgsfield's help centre flies into the field */}
      {copy > 0 && !pasted && (
        <div style={{ ...centre(lerp(540, ux, fly), lerp(1080, uy, fly), sc(copy) * lerp(1, 0.75, fly)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: P.ink, border: `5px solid ${P.ink}`, borderRadius: 18, padding: "12px 18px", boxShadow: `5px 5px 0 ${P.lime}, 0 0 40px rgba(200,241,105,0.5)` }}>
            <HiggsTile size={40} />
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, color: P.lime, whiteSpace: "nowrap" }}>{MCP_URL}</div>
          </div>
        </div>
      )}
      {copy > 0 && !pasted && <DemoTag text="MCP link · Higgsfield help centre" style={{ left: 330, top: 1130, opacity: mix(copy) * (1 - fly) }} />}
      <Burst t={t} at={C.paste} x={ux} y={uy} r={300} color={P.lime} />
      <Cursor
        t={t}
        keys={[
          [C.step2, ...cur(340, 120)],
          [C.add + 0.1, ...cur(800, 115)],
          [C.click, ...cur(720, 168)],
          [C.connect - 0.05, ...cur(MX + MW - 80, MY + 420)],
        ]}
        clicks={[C.add + 0.1, C.click, C.connect]}
      />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1088, display: "flex", justifyContent: "center" }}>
        {pillA > 0 && !pasted && <TermPill text="ADD CUSTOM CONNECTOR" k={pillA} size={36} />}
        {pillB > 0 && <TermPill text="mcp.higgsfield.ai/mcp" k={pillB} tone="ink" size={38} />}
      </div>
    </div>
  );
};

// =================================================================================================================
// 7. Step 3: sign in to Higgsfield (generic), then tell Claude what video you want

export const Step3Scene: React.FC<S> = ({ t }) => {
  if (t < C.step3 - 0.1 || t > C.bas2 + 0.3) return null;
  const pop1 = pop(t, C.signin - 0.15, { damping: 14, stiffness: 180 });
  const popOut = eo(seg(t, C.aurClaude - 0.15, C.aurClaude + 0.15));
  const authz = t > C.authorize - 0.1;
  const ok = pop(t, C.authorize + 0.25, { damping: 9, stiffness: 240 });
  const pillA = pop(t, C.signin, { damping: 10, stiffness: 230 });
  const pillB = pop(t, C.aurClaude, { damping: 10, stiffness: 230 });
  const typeFrom = C.batao - 0.15;
  const typeTo = C.video + 0.45;
  const sent = t > C.video + 0.6;
  const [sx, sy] = winToScreen(210 + 345 + 300 - 30, 295 + 65 + 50);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave(t, C.bas2) }}>
      <StepHead t={t} at={C.step3} out={C.bas2} n={3} title="SIGN IN + ASK" />
      <ClaudeWindow t={t} k={1}>
        <ClaudeHome chip={t > C.aurClaude} composer={t > typeFrom ? <Typed t={t} text={PROMPT} at={typeFrom} to={typeTo} /> : undefined} />
        {sent && <div style={{ position: "absolute", inset: 0, background: `rgba(250,249,245,${0.5 * seg(t, C.video + 0.6, C.video + 0.9)})` }} />}
      </ClaudeWindow>
      <DemoTag text="Illustrative UI · Claude, Nov 2026" style={{ left: 600, top: 486 }} />
      {/* Higgsfield sign-in pop-up (generic: no real account, no password) */}
      {pop1 > 0 && popOut < 1 && (
        <div style={{ ...centre(540, lerp(1250, 800, eo(mix(pop1))) + popOut * 500), opacity: 1 - popOut }}>
          <BrowserWin w={640} h={420} url="higgsfield.ai · sign in" dark>
            <div style={{ position: "absolute", inset: 0, background: "#0E0E0E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <HiggsLogo h={58} light />
              {!authz ? (
                <>
                  <div style={{ fontSize: 26, color: "#EDEDED" }}>Sign in to continue</div>
                  {["Continue with Google", "Continue with email"].map((s, i) => (
                    <div key={s} style={{ width: 400, height: 54, borderRadius: 12, border: "2px solid #3A3A3A", background: i === 0 && t > C.signin + 0.4 ? "#262626" : "#171717", color: "#EDEDED", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>{s}</div>
                  ))}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 25, color: "#EDEDED", textAlign: "center", lineHeight: 1.35 }}>
                    <b>Claude</b> wants to connect
                    <br />
                    to your Higgsfield account
                  </div>
                  <div style={{ width: 400, height: 58, borderRadius: 12, background: "#D1FE17", color: "#111", fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok > 0 ? "Connected ✓" : "Authorize"}</div>
                </>
              )}
            </div>
          </BrowserWin>
        </div>
      )}
      {pop1 > 0 && popOut < 1 && <DemoTag text="Generic sign-in · no real account shown" dark style={{ left: 330, top: 1035, opacity: mix(pop1) * (1 - popOut) }} />}
      <Cursor
        t={t}
        keys={[
          [C.step3, ...winToScreen(560, 420)],
          [C.signin + 0.35, 540, 820],
          [C.authorize + 0.1, 540, 900],
          [C.aurClaude + 0.2, ...winToScreen(700, 470)],
          [C.video + 0.55, sx, sy],
        ]}
        clicks={[C.signin + 0.4, C.authorize + 0.15, C.video + 0.6]}
      />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1088, display: "flex", justifyContent: "center" }}>
        {pillA > 0 && t < C.aurClaude && <TermPill text="SIGN IN TO HIGGSFIELD" k={pillA} size={36} />}
        {pillB > 0 && <TermPill text="TELL CLAUDE THE VIDEO" k={pillB} tone="ink" size={36} />}
      </div>
    </div>
  );
};

// =================================================================================================================
// 8. The reveal: Higgsfield makes the video; you steer it from Claude

const ASKS = ["Vertical 9:16", "Slow camera push", "Golden-hour light"];

export const RevealScene: React.FC<S> = ({ t }) => {
  if (t < C.bas2 - 0.15 || t > C.dhyan + 0.3) return null;
  const veil = eo(seg(t, C.bas2 - 0.15, C.bas2 + 0.2)) * (1 - eo(seg(t, C.dhyan - 0.15, C.dhyan + 0.15)));
  const o = leave(t, C.dhyan);
  const tool = pop(t, C.bas2, { damping: 13, stiffness: 190 });
  const toolOut = eo(seg(t, C.banayega - 0.1, C.banayega + 0.2));
  const load = eo(seg(t, C.bas2 + 0.1, C.banayega - 0.05));
  const phone = pop(t, C.banayega, { damping: 13, stiffness: 120 });
  const tag = pop(t, C.banayega + 0.35, { damping: 10, stiffness: 220 });
  const flash = seg(t, C.banayega - 0.05, C.banayega + 0.4);
  return (
    <>
      <div style={{ position: "absolute", inset: -80, background: `radial-gradient(ellipse at 50% 45%, rgba(40,32,70,${0.97 * veil}) 0%, rgba(14,14,16,${0.98 * veil}) 70%)` }} />
      {/* futuristic ambience: drifting lime particles */}
      {veil > 0.05 &&
        Array.from({ length: 26 }, (_, i) => {
          const x = (i * 97) % 1080;
          const y = 1500 - (((t - C.bas2) * (40 + (i % 5) * 18) + i * 61) % 1300);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: 9, background: P.lime, opacity: 0.35 * veil, boxShadow: `0 0 12px ${P.lime}` }} />;
        })}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
        {/* Claude calls the Higgsfield connector */}
        {tool > 0 && toolOut < 1 && (
          <div style={{ ...centre(540, 760, sc(tool) * (1 - 0.3 * toolOut)), opacity: 1 - toolOut }}>
            <div style={{ width: 760, background: "#1F1E1D", border: "3px solid #3A3936", borderRadius: 24, padding: "24px 28px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 27, color: "#EDEBE4" }}>
                <ClaudeSpark size={40} /> Using <HiggsTile size={34} /> <b>Higgsfield</b> · generate video
              </div>
              <div style={{ marginTop: 18, fontFamily: mono, fontSize: 21, color: "#BDBAB0", whiteSpace: "nowrap", overflow: "hidden" }}>“{PROMPT}”</div>
              <div style={{ marginTop: 18, height: 12, borderRadius: 6, background: "#33322F", overflow: "hidden" }}>
                <div style={{ width: `${load * 100}%`, height: "100%", background: P.lime, boxShadow: `0 0 16px ${P.lime}` }} />
              </div>
            </div>
          </div>
        )}
        {tool > 0 && toolOut < 1 && <EnergyLine from={[540, 640]} to={[540, 480]} k={seg(t, C.bas2 + 0.1, C.bas2 + 0.35)} t={t} dark />}
        {flash > 0 && flash < 1 && <div style={{ position: "absolute", left: 540 - 60, top: 760 - 60, width: 120, height: 120, borderRadius: 60, background: P.lime, transform: `scale(${lerp(0.2, 24, eo(flash))})`, opacity: 1 - eo(seg(t, C.banayega + 0.05, C.banayega + 0.4)) }} />}
        {/* The phone with the (illustrative) generated clip */}
        {phone > 0 && (
          <div style={{ ...centre(540, lerp(1500, 770, eo(mix(phone))), lerp(0.6, 1, eo(mix(phone))) * (1 + 0.025 * Math.sin((t - C.banayega) * 1.5)), `rotate(${(1 - eo(mix(phone))) * -10}deg)`) }}>
            <PhoneShell w={320} dark glow={0.9}>
              <AiClip kind="city" t={t - C.banayega} w={298} h={624} radius={0} play={seg(t, C.banayega, C.dhyan)} />
              <div style={{ position: "absolute", left: 14, top: 40, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.45)", borderRadius: 10, padding: "4px 10px 4px 4px" }}>
                <HiggsTile size={28} />
                <span style={{ fontSize: 17, color: "#fff", fontWeight: 700 }}>Higgsfield</span>
              </div>
            </PhoneShell>
          </div>
        )}
        {tag > 0 && (
          <div style={{ ...centre(540, 385, sc(tag), "rotate(-1.5deg)") }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#0E0E0E", border: `4px solid ${P.lime}`, borderRadius: 999, padding: "10px 26px 10px 12px", boxShadow: `0 0 40px rgba(209,254,23,0.4)` }}>
              <HiggsTile size={54} />
              <span style={{ ...type.display, fontSize: 46, color: "#FAFAFA", whiteSpace: "nowrap" }}>VIDEO BY HIGGSFIELD</span>
            </div>
          </div>
        )}
        {/* You steer it from Claude */}
        {ASKS.map((a, i) => {
          const k = pop(t, C.claudeSe + i * 0.35, { damping: 11, stiffness: 220 });
          if (k <= 0) return null;
          const left = i % 2 === 0;
          return (
            <div key={a} style={{ ...centre(left ? 225 : 860, 560 + i * 170, sc(k), `rotate(${left ? -3 : 3}deg)`) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#FAF9F5", border: `4px solid ${P.ink}`, borderRadius: 20, padding: "12px 18px", boxShadow: `5px 5px 0 ${P.lime}` }}>
                <ClaudeSpark size={34} />
                <span style={{ ...type.display, fontSize: 30, color: P.ink, whiteSpace: "nowrap" }}>{a}</span>
              </div>
            </div>
          );
        })}
        {phone > 0 && <DemoTag text="Illustration · not a real Higgsfield generation" dark style={{ left: 290, top: 1112, opacity: mix(phone) }} />}
      </div>
      <Sparks t={t} at={C.banayega} x={540} y={770} n={14} r={330} />
    </>
  );
};

// =================================================================================================================
// 9. Billing: auto-renew + MCP uses credits (official terms)

export const BillingScene: React.FC<S> = ({ t }) => {
  if (t < C.dhyan - 0.1 || t > C.setup + 0.3) return null;
  const o = leave(t, C.setup);
  const head = pop(t, C.dhyan, { damping: 10, stiffness: 220 });
  const a = pop(t, C.trial, { damping: 12, stiffness: 200 });
  const b = pop(t, C.paid, { damping: 12, stiffness: 200 });
  const stamp = pop(t, C.renew, { damping: 7, stiffness: 260 });
  const fix = pop(t, C.terms, { damping: 12, stiffness: 180 });
  const check = pop(t, C.check, { damping: 8, stiffness: 250 });
  const shake = t > C.renew && t < C.renew + 0.4 ? Math.sin((t - C.renew) * 60) * 8 * (1 - (t - C.renew) / 0.4) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 400, sc(head), "rotate(-2deg)") }}>
        <Sticker size={80} tone="ink" rotate={0}>
          DHYAN RAKHNA ⚠
        </Sticker>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 520, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, transform: `scale(${lerp(1, 0.86, eo(seg(t, C.terms - 0.1, C.terms + 0.2)))}) translateY(${-40 * eo(seg(t, C.terms - 0.1, C.terms + 0.2))}px)`, transformOrigin: "540px 0" }}>
        <div style={{ width: 380, minHeight: 220, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "22px 24px", transform: `scale(${sc(a)})`, opacity: Math.min(1, a * 2) }}>
          <div style={{ ...type.label, fontSize: 20, color: P.ink2 }}>HIGGSFIELD</div>
          <div style={{ ...type.display, fontSize: 52, color: P.ink, marginTop: 8 }}>3-day trial</div>
          <div style={{ ...type.display, fontSize: 30, color: P.ink, marginTop: 10 }}>$0 to start</div>
        </div>
        <svg width={70} height={40} viewBox="0 0 70 40" style={{ opacity: mix(b) }}>
          <path d="M4 20 H56 M44 8 L60 20 L44 32" fill="none" stroke={P.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "relative", width: 380, minHeight: 220, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: `${shadow.hard(8)}${stamp > 0 ? `, 0 0 50px ${P.gold}` : ""}`, padding: "22px 24px", transform: `scale(${sc(b)}) translateX(${shake}px)`, opacity: Math.min(1, b * 2) }}>
          <div style={{ ...type.label, fontSize: 20, color: P.ink2 }}>THEN</div>
          <div style={{ ...type.display, fontSize: 52, color: P.ink, marginTop: 8 }}>Paid plan</div>
          <div style={{ ...type.display, fontSize: 28, color: P.ink2, marginTop: 10 }}>Ultra, unless you cancel</div>
          {stamp > 0 && (
            <div style={{ ...centre(225, 228, sc(stamp), `rotate(${(1 - mix(stamp)) * 20 - 10}deg)`), ...type.display, fontSize: 44, color: RED, border: `7px solid ${RED}`, borderRadius: 16, padding: "4px 16px", background: "rgba(250,249,246,0.95)", whiteSpace: "nowrap" }}>AUTO-RENEW</div>
          )}
        </div>
      </div>
      {/* The correction card: official Higgsfield terms, in large type */}
      {fix > 0 && (
        <div style={{ ...centre(540, lerp(1300, 935, eo(mix(fix)))) }}>
          <div style={{ width: 900, background: P.ink, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: `8px 8px 0 ${P.lime}`, padding: "26px 32px", display: "flex", alignItems: "center", gap: 22 }}>
            <WarnIcon size={86} />
            <div style={{ ...type.display, fontSize: 52, color: "#FAF9F5", lineHeight: 1.08 }}>
              MCP generations use <span style={{ color: P.lime }}>Higgsfield credits</span>
            </div>
          </div>
        </div>
      )}
      {check > 0 && (
        <div style={{ ...centre(540, 1095, sc(check), `rotate(${(1 - mix(check)) * 12 - 2}deg)`) }}>
          <Sticker size={54} tone="lime" rotate={0}>
            CHECK CURRENT TRIAL TERMS
          </Sticker>
        </div>
      )}
      {fix > 0 && <DemoTag text="Source: Higgsfield help centre + offer post, checked 11 Nov 2026" style={{ left: 200, top: 1022, opacity: mix(fix) }} />}
    </div>
  );
};

// =================================================================================================================
// 10. Comment FABLE

export const CommentScene: React.FC<S> = ({ t }) => {
  if (t < C.setup - 0.1 || t > C.aisi + 0.3) return null;
  const o = leave(t, C.aisi);
  const head = pop(t, C.setup, { damping: 11, stiffness: 200 });
  const items = ["3 steps", "MCP link", "Official links"];
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.fableWord, { damping: 8, stiffness: 240 });
  const sides = pop(t, C.comment + 0.2, { damping: 12, stiffness: 190 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 390, sc(head)), ...type.display, fontSize: 72, color: P.ink, whiteSpace: "nowrap" }}>
          Poora <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>setup link?</span>
        </div>
      )}
      <div style={{ position: "absolute", left: 90, width: 900, top: 470, display: "flex", justifyContent: "center", gap: 12 }}>
        {items.map((s, i) => {
          const k = pop(t, C.link + i * 0.18, { damping: 11, stiffness: 220 });
          return (
            <div key={s} style={{ transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
              <Chip text={`✓ ${s}`} size={28} tone={i === 2 ? "lime" : "card"} />
            </div>
          );
        })}
      </div>
      {/* Claude and Higgsfield on either side */}
      {sides > 0 && (
        <div style={{ ...centre(lerp(-100, 130, eo(mix(sides))), 790, 1, `rotate(${-8 + Math.sin(t * 1.5) * 3}deg)`) }}>
          <div style={{ width: 150, height: 150, borderRadius: 36, background: "#141413", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: shadow.hard(7) }}>
            <ClaudeSpark size={96} />
          </div>
        </div>
      )}
      {sides > 0 && (
        <div style={{ ...centre(lerp(1180, 950, eo(mix(sides))), 790, 1, `rotate(${8 + Math.cos(t * 1.5) * 3}deg)`) }}>
          <HiggsTile size={150} style={{ border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7) }} />
        </div>
      )}
      {/* The big comment bubble (no fake comments, no fake DMs) */}
      {bubble > 0 && (
        <div style={{ ...centre(540, 820, sc(bubble), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 600, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "30px 30px 34px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ ...type.label, fontSize: 30, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 150, color: P.ink, lineHeight: 0.95, background: big > 0 ? P.lime : "transparent", borderRadius: 22, padding: "0 22px 8px", transform: `scale(${big > 0 ? sc(big) : 1})` }}>FABLE</div>
            <div style={{ ...type.label, fontSize: 24, color: P.ink, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "6px 16px", marginTop: 6 }}>OFFICIAL SETUP LINK</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 70, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      <Burst t={t} at={C.fableWord} x={540} y={800} r={420} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 11. Follow

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.aisi - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.aisi + 0.05, { damping: 10, stiffness: 210 });
  const mark = pop(t, C.follow + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.follow + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
  const tricks = ["AI tools", "Real setups", "Honest costs"];
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
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>INTERNET TOOLBOX</span>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Creator Secrets · #06</div>}
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
