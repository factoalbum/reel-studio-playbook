import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton, TapPointer } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/agent";
import { Chip, mix, sc } from "../launch/kit";
import { Card3D, EnergyLine, Streak } from "../fable/kit";
import { ClaudeSpark } from "../fable/logos";
import { PipeStep, Term } from "../fable52/kit";

/**
 * Creator Secrets: "Claude ne Instagram ka game khatam kar diya!" → the free community pack Instagram Agent Skill
 * (github.com/Jakeschincariol/instagram-agent-skill, MIT): niche comments, replies, profile, weekly plan, virality,
 * set up in Claude Code; you stay in control; comment AGENT. Times: src/episodes/agent.ts.
 * Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, presenter below.
 * Logos: the Claude spark is claude.com/icon.svg (public/fable/logos); the Instagram glyph is the official 2016
 * gradient glyph (public/agent/logos/instagram.svg, Wikimedia Commons copy of Meta's file; the 192 px favicon from
 * instagram.com is kept next to it for comparison). Neither is redrawn or recoloured. The skill pack has no logo:
 * it is shown as our own labelled card. Posts, comments and profiles are fictional and labelled.
 */

type S = { t: number };
export const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));
export const RED = "#E0452B";

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.1 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.game, 0.06, 0.8) + push(C.name, 0.05, 0.7) + push(C.baaki, 0.05, 0.6) + push(C.virality, 0.08, 0.8) + push(C.agent, 0.06, 0.6);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.ab, C.ismein, C.chauthi, C.jo, C.setupQ].map((at, i) => {
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

export const Streaks: React.FC<S> = ({ t }) => (
  <>
    <Streak t={t} at={0.02} />
    <Streak t={t} at={C.game - 0.08} dur={0.45} />
    <Streak t={t} at={C.name - 0.08} />
    <Streak t={t} at={C.virality - 0.1} dur={0.45} />
    <Streak t={t} at={C.agent - 0.08} />
  </>
);

// =================================================================================================================
// Shared bits

export const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, k * 3), transform: `scale(${lerp(2.1, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1)})`, filter: `blur(${Math.max(0, 1 - k) * 8}px)`, ...style }}>
      {children}
    </span>
  );
};

export const Lime: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: P.lime, color: P.ink, borderRadius: 12, padding: "0 12px", margin: "0 2px" }}>{children}</span>;

/** Official logo tiles, flat and undistorted: Claude spark on Claude's dark tile, the Instagram glyph on white. */
export const Logo: React.FC<{ app: "claude" | "insta"; size: number; glow?: number }> = ({ app, size, glow = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: app === "claude" ? "#141413" : "#FFFFFF", border: `${Math.max(4, size * 0.035)}px solid ${P.ink}`, boxShadow: `${shadow.hard(Math.max(5, size * 0.05))}${glow > 0 ? `, 0 0 ${size * 0.5 * glow}px ${P.lime}` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    {app === "claude" ? <ClaudeSpark size={size * 0.6} /> : <Img src={staticFile("agent/logos/instagram.svg")} style={{ width: size * 0.74, height: size * 0.74, display: "block" }} />}
  </div>
);

/** A dark stage card for the two dramatic moments (hook and rehook). */
export const Stage: React.FC<{ k: number; children?: React.ReactNode }> = ({ k, children }) => (
  <div style={{ position: "absolute", left: 50, top: 318, width: 980, height: 827, borderRadius: 52, background: "#141413", border: `7px solid ${P.ink}`, boxShadow: `0 0 90px rgba(200,241,105,${0.35 * k}), ${shadow.hard(12)}`, opacity: Math.min(1, k * 2), transform: `scale(${lerp(0.92, 1, eo(Math.min(1, k)))})`, overflow: "hidden" }}>
    <svg width={980} height={845} style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
      {Array.from({ length: 22 }, (_, r) => Array.from({ length: 25 }, (_, c) => <circle key={`${r}-${c}`} cx={20 + c * 40} cy={20 + r * 40} r={2} fill={P.lime} />))}
    </svg>
    {children}
  </div>
);

/** Skill header: number pill, the real command name, the title. */
const SkillHead: React.FC<{ t: number; at: number; n: number; cmd: string; title: string }> = ({ t, at, n, cmd, title }) => {
  const k = pop(t, at, { damping: 10, stiffness: 210 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, width: 920, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `translateY(${(1 - mix(k)) * -50}px)`, opacity: mix(k) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ ...type.label, fontSize: 26, color: P.lime, background: P.ink, borderRadius: 999, padding: "9px 18px 10px", whiteSpace: "nowrap", transform: `scale(${sc(k)})` }}>SKILL {n}</div>
        <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 30, color: P.ink, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "4px 14px 6px", boxShadow: shadow.hard(5), transform: `scale(${sc(pop(t, at + 0.1, { damping: 9, stiffness: 230 }))})` }}>{cmd}</div>
      </div>
      <div style={{ ...type.display, fontSize: title.length > 18 ? 66 : 78, lineHeight: 1, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>{title}</div>
    </div>
  );
};

/** A small fictional Instagram-style post. */
const Post: React.FC<{ w: number; handle: string; title: string; tone?: string }> = ({ w, handle, title, tone = "#2F3B52" }) => (
  <div style={{ width: w, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 99, background: `conic-gradient(#FEDA75, #FA7E1E, #D62976, #962FBF, #FEDA75)`, padding: 3 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#D9D6CC", border: "3px solid #fff" }} />
      </div>
      <div style={{ ...type.body, fontWeight: 700, fontSize: 22, color: P.ink }}>{handle}</div>
    </div>
    <div style={{ height: w * 0.9, background: tone, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...type.display, fontSize: w * 0.12, lineHeight: 1.05, color: "#FAF9F5", textAlign: "center" }}>{title}</div>
    </div>
    <div style={{ display: "flex", gap: 18, padding: "12px 18px 16px" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 30, height: 30, borderRadius: i === 0 ? 99 : 8, border: `3.5px solid ${P.ink}` }} />
      ))}
    </div>
  </div>
);

export const typed = (t: number, text: string, a: number, b: number) => text.slice(0, Math.floor(seg(t, a, b) * text.length));
export const Caret: React.FC<{ t: number; on: boolean }> = ({ t, on }) => (on ? <span style={{ display: "inline-block", width: 4, height: "0.9em", background: P.ink, verticalAlign: "-0.1em", opacity: Math.floor(t * 6) % 2 ? 1 : 0 }} /> : null);

const Draft: React.FC<{ t: number; w: number; label: string; text: string; a: number; b: number }> = ({ t, w, label, text, a, b }) => {
  const s = typed(t, text, a, b);
  return (
    <div style={{ width: w, background: P.limeWash, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ClaudeSpark size={34} />
        <div style={{ ...type.label, fontSize: 20, color: P.olive }}>{label}</div>
      </div>
      <div style={{ ...type.body, fontWeight: 600, fontSize: 31, lineHeight: 1.25, color: P.ink, minHeight: 120 }}>
        {s}
        <Caret t={t} on={t > a && s.length < text.length} />
      </div>
    </div>
  );
};

export const Tick: React.FC<{ k: number; text: string; x: number; y: number; rot?: number }> = ({ k, text, x, y, rot = -3 }) =>
  k > 0 ? (
    <div style={{ ...centre(x, y, sc(k), `rotate(${(1 - mix(k)) * 12 + rot}deg)`), zIndex: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(7), padding: "10px 20px 12px" }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: P.lime, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 34, color: P.ink }}>✓</div>
        <div style={{ ...type.display, fontSize: 40, color: P.ink, whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  ) : null;

export const Arrow: React.FC<{ size: number; color?: string }> = ({ size, color = P.ink }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 50 30" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M3 15 H40 M30 4 L44 15 L30 26" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// =================================================================================================================
// 1. Hook: CLAUDE NE... → INSTAGRAM KA GAME KHATAM?!

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.ab + 0.3) return null;
  const o = leave(t, C.ab);
  const claudeIn = pop(t, C.insta, { damping: 11, stiffness: 190 });
  const smash = eo(seg(t, C.game - 0.08, C.game + 0.12));
  const join = seg(t, C.insta + 0.2, C.game);
  const igX = lerp(540, 770, eo(Math.min(1, claudeIn)));
  const igS = lerp(1, 0.72, eo(Math.min(1, claudeIn)));
  const shake = t > C.game && t < C.game + 0.35 ? Math.sin(t * 90) * 10 * (1 - (t - C.game) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${shake}px)` }}>
      <Stage k={1} />
      {/* "CLAUDE NE..." on screen from frame 0, smashed away on "game" */}
      {smash < 1 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 380, textAlign: "center", ...type.display, fontSize: 132, color: "#FAF9F5", letterSpacing: "-0.04em", opacity: 1 - smash, transform: `scale(${1 + smash * 0.6})` }}>
          <Slam t={t} at={-0.3}>
            CLAUDE <span style={{ color: P.lime }}>NE...</span>
          </Slam>
        </div>
      )}
      {smash > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 350, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ ...type.display, fontSize: 96, color: "#FAF9F5", letterSpacing: "-0.03em" }}>
            <Slam t={t} at={C.game}>
              INSTAGRAM KA
            </Slam>
          </div>
          <div style={{ transform: "rotate(-2.5deg)" }}>
            <Slam t={t} at={C.khatam}>
              <div style={{ ...type.display, fontSize: 118, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 30, padding: "6px 34px 18px", boxShadow: `10px 10px 0 #FAF9F5`, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>GAME KHATAM?!</div>
            </Slam>
          </div>
        </div>
      )}
      {/* the two official logos: Instagram from frame 0, Claude flies in and connects */}
      <div style={{ ...centre(igX, lerp(780, 850, smash), igS * (1 + Math.sin(t * 3) * 0.015), `rotate(${lerp(0, 5, mix(claudeIn))}deg)`) }}>
        <Logo app="insta" size={330} glow={0.5} />
      </div>
      {claudeIn > 0 && (
        <div style={{ ...centre(lerp(-200, 310, eo(Math.min(1, claudeIn))), lerp(780, 850, smash), sc(claudeIn) * 0.72, "rotate(-5deg)") }}>
          <Logo app="claude" size={330} glow={0.5} />
        </div>
      )}
      <EnergyLine from={[430, lerp(780, 850, smash)]} to={[650, lerp(780, 850, smash)]} k={join} t={t} dark width={12} />
      {t > C.diya && <DemoTag dark text="Hype line · it writes drafts, you post" style={{ left: 330, top: 1075, opacity: mix(pop(t, C.diya, {})) }} />}
      <Burst t={t} at={C.game} x={540} y={520} r={520} color={P.lime} />
      <Sparks t={t} at={C.insta} x={540} y={800} n={10} r={240} />
    </div>
  );
};

// =================================================================================================================
// 2. Claude + Instagram content workflow (assistance, not an account connection)

const FEATURES = ["REELS", "CAPTIONS", "COMMENTS", "PROFILE", "CONTENT PLAN"];
const FPOS: [number, number][] = [
  [250, 830],
  [540, 860],
  [830, 830],
  [355, 985],
  [735, 985],
];

export const WorkflowScene: React.FC<S> = ({ t }) => {
  if (t < C.ab - 0.1 || t > C.naam + 0.3) return null;
  const o = leave(t, C.naam);
  const a = pop(t, C.ab + 0.1, { damping: 10, stiffness: 200 });
  const b = pop(t, C.apne, { damping: 10, stiffness: 200 });
  const head = pop(t, C.workflow - 0.2, { damping: 10, stiffness: 210 });
  const help = pop(t, C.madad, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${sc(head)})` }}>
          <div style={{ ...type.label, fontSize: 32, color: P.ink3 }}>INSTAGRAM</div>
          <div style={{ ...type.display, fontSize: 92, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>
            CONTENT <Lime>WORKFLOW</Lime>
          </div>
        </div>
      )}
      {a > 0 && (
        <div style={{ ...centre(lerp(-150, 220, eo(mix(a))), 640 + Math.sin(t * 2.4) * 8, sc(a), "rotate(-5deg)") }}>
          <Logo app="claude" size={190} glow={0.4} />
        </div>
      )}
      {b > 0 && (
        <div style={{ ...centre(lerp(1230, 860, eo(mix(b))), 640 + Math.cos(t * 2.4) * 8, sc(b), "rotate(5deg)") }}>
          <Logo app="insta" size={190} glow={0.4} />
        </div>
      )}
      <EnergyLine from={[330, 640]} to={[750, 640]} k={seg(t, C.poora, C.workflow + 0.2)} t={t} width={12} />
      {t > C.poora && (
        <div style={{ ...centre(540, 640, mix(pop(t, C.poora + 0.3, { damping: 10 }))), ...type.label, fontSize: 22, color: P.olive, background: P.limeSoft, border: `3px solid ${P.olive}`, borderRadius: 99, padding: "6px 14px" }}>AI DRAFTS</div>
      )}
      {FEATURES.map((f, i) => {
        const k = pop(t, C.workflow + i * 0.22, { damping: 9, stiffness: 220 });
        if (k <= 0) return null;
        const [x, y] = FPOS[i];
        return (
          <div key={f} style={{ ...centre(x, y + Math.sin(t * 2 + i) * 6, sc(k), `rotate(${(i % 2 ? 1 : -1) * 3}deg)`) }}>
            <Chip text={f} size={34} tone={i === 4 ? "lime" : "card"} />
          </div>
        );
      })}
      {help > 0 && (
        <div style={{ ...centre(540, 1090, sc(help), "rotate(-2deg)"), zIndex: 3 }}>
          <Sticker size={50} tone="ink" rotate={0}>
            AI HELPS · YOU DECIDE
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 3. Iska naam hai... INSTAGRAM AGENT SKILL (a folder opens, the skill cards come out)

const SKILL_CARDS = ["/ig-comment", "/ig-reply", "/ig-profile", "/ig-plan", "/ig-viral", "/ig-caption"];

export const RevealScene: React.FC<S> = ({ t }) => {
  if (t < C.naam - 0.1 || t > C.ismein + 0.3) return null;
  const o = leave(t, C.ismein);
  const folder = pop(t, C.naam + 0.05, { damping: 11, stiffness: 190 });
  const open = eo(seg(t, C.name - 0.1, C.name + 0.25));
  const name = pop(t, C.name, { damping: 8, stiffness: 240 });
  const dots = Math.min(3, Math.floor((t - C.naam) / 0.25));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {name <= 0 && t > C.naam && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 380, textAlign: "center", ...type.display, fontSize: 96, color: P.ink }}>
          Iska naam hai{".".repeat(Math.max(0, dots))}
        </div>
      )}
      {name > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${sc(name)})` }}>
          <div style={{ ...type.display, fontSize: 104, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em" }}>INSTAGRAM</div>
          <div style={{ ...type.display, fontSize: 112, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 30, padding: "4px 30px 16px", boxShadow: shadow.hard(10), letterSpacing: "-0.04em", transform: "rotate(-2deg)", whiteSpace: "nowrap" }}>AGENT SKILL</div>
        </div>
      )}
      {/* skill cards fan out of the folder */}
      {SKILL_CARDS.map((s, i) => {
        const k = pop(t, C.name + 0.15 + i * 0.1, { damping: 10, stiffness: 200 });
        if (k <= 0) return null;
        const ang = ((i % 3) - 1) * 6;
        const x = lerp(540, 260 + (i % 3) * 280, mix(k));
        const y = lerp(900, 640 + Math.floor(i / 3) * 100, mix(k));
        return (
          <div key={s} style={{ ...centre(x, y + Math.sin(t * 2.5 + i) * 5, sc(k), `rotate(${ang * 0.25}deg)`), zIndex: 1 }}>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 26, color: i % 3 === 1 ? P.ink : "#F4F2EA", background: i % 3 === 1 ? P.lime : P.ink, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "8px 14px 10px", boxShadow: shadow.hard(5), whiteSpace: "nowrap" }}>{s}</div>
          </div>
        );
      })}
      {folder > 0 && (
        <div style={{ ...centre(540, 930, sc(folder) * lerp(1, 0.8, open)), zIndex: 2 }}>
          <svg width={330} height={260} viewBox="0 0 66 52">
            <path d="M3 8 h20 l6 7 h34 v34 h-60z" fill={P.limeDeep} stroke={P.ink} strokeWidth={3.5} strokeLinejoin="round" />
            <g style={{ transform: `skewX(${-open * 18}deg) translateY(${open * 6}px)`, transformOrigin: "33px 49px" }}>
              <path d="M3 49 l6 -26 h54 l-3 26z" fill={P.lime} stroke={P.ink} strokeWidth={3.5} strokeLinejoin="round" />
            </g>
          </svg>
        </div>
      )}
      {name > 0 && (
        <div style={{ ...centre(540, 1062, mix(pop(t, C.name + 0.35, {}))), zIndex: 3 }}>
          <Chip text={<span style={{ fontFamily: mono, fontSize: 24 }}>github.com/Jakeschincariol/instagram-agent-skill</span>} size={24} tone="card" />
        </div>
      )}
      {name > 0 && <DemoTag text="Free · MIT · community project, not by Anthropic or Instagram" style={{ left: 175, top: 1102, opacity: mix(pop(t, C.name + 0.5, {})), zIndex: 3 }} />}
      <Burst t={t} at={C.name} x={540} y={420} r={440} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 4. Hours of work, organised: scattered creator things snap into one dashboard

const THINGS = ["PLAN", "PHONE", "CALENDAR", "REEL", "COMMENTS", "CAPTION"];
const THING_TONE = [P.lime, "#2F3B52", P.gold, P.pink, P.teal, P.limeDeep];

export const OrganiseScene: React.FC<S> = ({ t }) => {
  if (t < C.ismein - 0.1 || t > C.ek + 0.3) return null;
  const o = leave(t, C.ek);
  const tidy = eo(seg(t, C.aasaan - 0.1, C.aasaan + 0.5));
  const head = pop(t, C.ismein + 0.05, { damping: 10, stiffness: 210 });
  const done = pop(t, C.aasaan + 0.3, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${sc(head)})` }}>
          <div style={{ ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>YOUR CONTENT WORKFLOW</div>
          <div style={{ ...type.display, fontSize: 70, color: P.ink, whiteSpace: "nowrap", opacity: mix(done), transform: `scale(${done > 0 ? sc(done) : 0.6})` }}>
            <Lime>ORGANIZED WITH AI</Lime>
          </div>
        </div>
      )}
      {/* the dashboard frame appears as things land */}
      {tidy > 0 && (
        <div style={{ ...centre(540, 820, lerp(0.9, 1, tidy)), width: 880, height: 470, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), opacity: tidy }}>
          <div style={{ display: "flex", gap: 10, padding: "14px 18px" }}>
            {[RED, P.gold, P.lime].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 99, background: c, border: `2px solid ${P.ink}` }} />
            ))}
            <div style={{ marginLeft: 14, ...type.label, fontSize: 18, color: P.ink3 }}>CONTENT DASHBOARD</div>
          </div>
        </div>
      )}
      {THINGS.map((name, i) => {
        const k = pop(t, C.ismein + 0.1 + i * 0.16, { damping: 10, stiffness: 200 });
        if (k <= 0) return null;
        const sx = [200, 820, 330, 760, 170, 880][i];
        const sy = [640, 600, 930, 980, 800, 820][i];
        const gx = 260 + (i % 3) * 280;
        const gy = 760 + Math.floor(i / 3) * 175;
        const x = lerp(sx, gx, tidy);
        const y = lerp(sy + Math.sin(t * 2.2 + i) * 10, gy, tidy);
        const rot = lerp((i % 2 ? 1 : -1) * (8 + i * 2), 0, tidy);
        return (
          <div key={name} style={{ ...centre(x, y, sc(k), `rotate(${rot}deg)`), zIndex: 2 }}>
            <div style={{ width: 240, background: P.paper, border: `4px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(5), overflow: "hidden" }}>
              <div style={{ height: 14, background: THING_TONE[i], borderBottom: `3px solid ${P.ink}` }} />
              <div style={{ padding: "10px 14px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ ...type.display, fontSize: 30, color: P.ink }}>{name}</div>
                <div style={{ height: 10, borderRadius: 5, background: P.line, width: "86%" }} />
                <div style={{ height: 10, borderRadius: 5, background: P.line, width: "60%" }} />
              </div>
            </div>
          </div>
        );
      })}
      {done > 0 && (
        <div style={{ ...centre(540, 1100, sc(done)) }}>
          <Chip text="13 skills · this reel shows 5" size={30} tone="lime" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. Skill 1: comments for posts in your niche (drafts you review, never mass commenting)

const COMMENT = "Tool #3 is so underrated! Have you tried it for exam notes?";

export const CommentScene: React.FC<S> = ({ t }) => {
  if (t < C.ek - 0.1 || t > C.doosri + 0.3) return null;
  const o = leave(t, C.doosri);
  const post = pop(t, C.niche, { damping: 12, stiffness: 170 });
  const panel = pop(t, C.posts, { damping: 12, stiffness: 170 });
  const ok = pop(t, C.comments + 0.6, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <SkillHead t={t} at={C.ek} n={1} cmd="/ig-comment" title="NICHE COMMENTS" />
      {post > 0 && (
        <div style={{ ...centre(lerp(-250, 290, eo(mix(post))), 800, 1, "rotate(-3deg)") }}>
          <Post w={380} handle="@ai.tools.daily" title="5 AI tools every student needs" />
        </div>
      )}
      {post > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* scan line over the post while the skill reads it */}
          <rect x={110} y={lerp(620, 960, (t * 0.8) % 1)} width={360} height={6} rx={3} fill={P.lime} opacity={0.85 * (1 - seg(t, C.comments, C.comments + 0.3))} />
        </svg>
      )}
      {panel > 0 && (
        <div style={{ ...centre(lerp(1300, 745, eo(mix(panel))), 790, 1, "rotate(2deg)") }}>
          <Draft t={t} w={400} label="COMMENT DRAFT" text={COMMENT} a={C.posts + 0.3} b={C.comments + 0.5} />
        </div>
      )}
      {panel > 0 && (
        <div style={{ ...centre(745, 600, mix(panel)) }}>
          <Chip text="AI DRAFTS" size={30} tone="ink" />
        </div>
      )}
      <Tick k={ok} text="YOU REVIEW" x={745} y={1010} />
      {post > 0 && <DemoTag text="Illustration · fictional post" style={{ left: 120, top: 1105, opacity: mix(post) }} />}
    </div>
  );
};

// =================================================================================================================
// 6. Skill 2: reply drafts for comments on your own post

const REPLY = "Thanks Aman! Saare steps pinned comment mein hain.";

export const ReplyScene: React.FC<S> = ({ t }) => {
  if (t < C.doosri - 0.1 || t > C.teesri + 0.3) return null;
  const o = leave(t, C.teesri);
  const c = pop(t, C.doosri + 0.3, { damping: 11, stiffness: 190 });
  const r = pop(t, C.replies, { damping: 11, stiffness: 190 });
  const ok = pop(t, C.likhti + 0.1, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <SkillHead t={t} at={C.doosri} n={2} cmd="/ig-reply" title="SMART REPLY DRAFTS" />
      {c > 0 && (
        <div style={{ ...centre(lerp(-300, 470, eo(mix(c))), 640, 1, "rotate(-2deg)") }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", width: 700, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(8), padding: "18px 22px" }}>
            <div style={{ width: 60, height: 60, borderRadius: 99, background: "#C9B8A6", border: `3px solid ${P.ink}`, flex: "0 0 auto" }} />
            <div>
              <div style={{ ...type.body, fontWeight: 700, fontSize: 24, color: P.ink }}>aman_k</div>
              <div style={{ ...type.body, fontWeight: 600, fontSize: 36, color: P.ink }}>Bhai ye kaise banaya?</div>
            </div>
          </div>
        </div>
      )}
      {r > 0 && (
        <div style={{ ...centre(lerp(1400, 600, eo(mix(r))), 870, 1, "rotate(1.5deg)") }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <svg width={60} height={60} viewBox="0 0 30 30">
              <path d="M6 4 V16 Q6 22 12 22 H26 M20 16 L26 22 L20 28" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Draft t={t} w={640} label="REPLY DRAFT" text={REPLY} a={C.replies + 0.2} b={C.likhti + 0.3} />
          </div>
        </div>
      )}
      <Tick k={ok} text="YOU REVIEW" x={680} y={1060} rot={2} />
      {c > 0 && <DemoTag text="Illustration · fictional comment" style={{ left: 120, top: 1105, opacity: mix(c) }} />}
    </div>
  );
};

// =================================================================================================================
// 7. Skill 3: profile optimisation (before → after bio, scored on the skill's own rubric)

export const ProfileScene: React.FC<S> = ({ t }) => {
  if (t < C.teesri - 0.1 || t > C.chauthi + 0.3) return null;
  const o = leave(t, C.chauthi);
  const card = pop(t, C.profile, { damping: 12, stiffness: 170 });
  const flip = eo(seg(t, C.optimize - 0.1, C.optimize + 0.35));
  const badge = pop(t, C.optimize + 0.3, { damping: 8, stiffness: 240 });
  const rows = ["Clear bio", "Call to action", "Content category"];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <SkillHead t={t} at={C.teesri} n={3} cmd="/ig-profile" title="PROFILE OPTIMIZATION" />
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1300, 790, eo(mix(card))), 1, "rotate(-1deg)") }}>
          <Card3D k={card} t={t} yaw={16}>
            <div style={{ width: 820, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "24px 30px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <div style={{ width: 110, height: 110, borderRadius: 99, background: `conic-gradient(#FEDA75, #FA7E1E, #D62976, #962FBF, #FEDA75)`, padding: 5, flex: "0 0 auto" }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: 99, background: "#D9D6CC", border: "4px solid #fff" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...type.body, fontWeight: 700, fontSize: 32, color: P.ink }}>@your.page</div>
                  <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ height: 14, width: 110, borderRadius: 7, background: P.line }} />
                    ))}
                  </div>
                </div>
              </div>
              {/* bio: before, then after */}
              <div style={{ position: "relative", height: 150 }}>
                <div style={{ position: "absolute", inset: 0, opacity: 1 - flip, ...type.body, fontWeight: 500, fontSize: 32, lineHeight: 1.3, color: P.ink3 }}>
                  <span style={{ textDecoration: flip > 0 ? "line-through" : "none" }}>i post stuff about tech lol</span>
                </div>
                <div style={{ position: "absolute", inset: 0, opacity: flip, transform: `translateY(${(1 - flip) * 20}px)`, ...type.body, fontWeight: 700, fontSize: 32, lineHeight: 1.3, color: P.ink }}>
                  <span style={{ background: P.limeSoft }}>AI tools for creators, in Hinglish</span>
                  <br />
                  New tip every day
                  <br />
                  <span style={{ color: P.olive }}>Free guide: link below</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {rows.map((r, i) => {
                  const on = t > C.optimize + 0.15 + i * 0.2;
                  return (
                    <div key={r} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: on ? P.lime : P.paper2, border: `3px solid ${P.ink}`, borderRadius: 12, padding: "8px 10px", ...type.display, fontSize: 21, color: P.ink, whiteSpace: "nowrap" }}>
                      {on ? "✓" : "·"} {r}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card3D>
        </div>
      )}
      {badge > 0 && (
        <div style={{ ...centre(800, 560, sc(badge), `rotate(${(1 - mix(badge)) * 14 + 4}deg)`), zIndex: 3 }}>
          <Sticker size={48} tone="lime" rotate={0}>
            BIO + POSITIONING
          </Sticker>
        </div>
      )}
      {card > 0 && <DemoTag text="Illustration · fictional profile · the skill scores it out of 100 on a 12-part rubric" style={{ left: 95, top: 1110, opacity: mix(card) }} />}
    </div>
  );
};

// =================================================================================================================
// 8. Skill 4: the week's content plan (what, when, who)

const DAYS: [string, string][] = [
  ["MON", "AI Tips"],
  ["TUE", "Tutorial"],
  ["WED", "Reel"],
  ["THU", "Story"],
  ["FRI", "Edu Post"],
  ["SAT", "Reel"],
  ["SUN", "Story"],
];

export const PlanScene: React.FC<S> = ({ t }) => {
  if (t < C.chauthi - 0.1 || t > C.lekin + 0.3) return null;
  const o = eo(seg(t, C.lekin - 0.15, C.lekin + 0.2));
  const head = pop(t, C.chauthi, { damping: 9, stiffness: 220 });
  const title = pop(t, C.plan, { damping: 8, stiffness: 240 });
  const www: [string, number][] = [
    ["WHAT", C.kya],
    ["WHEN", C.kab],
    ["WHO", C.kis],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateY(${o * -120}px) scale(${1 - o * 0.15})`, transformOrigin: "540px 800px" }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, transform: `scale(${sc(head)})` }}>
            <div style={{ ...type.label, fontSize: 26, color: P.lime, background: P.ink, borderRadius: 999, padding: "9px 18px 10px" }}>SKILL 4</div>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 30, color: P.ink, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "4px 14px 6px", boxShadow: shadow.hard(5) }}>/ig-plan</div>
          </div>
          <div style={{ ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap", opacity: title > 0 ? 1 : 0.0, transform: `scale(${title > 0 ? sc(title) : 0.5})` }}>
            <Lime>7-DAY</Lime> CONTENT PLAN
          </div>
        </div>
      )}
      {DAYS.map(([d, what], i) => {
        const k = pop(t, C.hafte + 0.1 + i * 0.16, { damping: 9, stiffness: 220 });
        if (k <= 0) return null;
        const row = i < 4 ? 0 : 1;
        const col = row === 0 ? i : i - 4;
        const x = row === 0 ? 180 + col * 240 : 300 + col * 240;
        const y = 655 + row * 220;
        const hot = t > C.kya && ((t > C.kya && t < C.kab && i === 2) || (t >= C.kab && t < C.kis && i === 4) || (t >= C.kis && i === 0));
        return (
          <div key={d} style={{ ...centre(x, y, sc(k) * (hot ? 1.08 : 1), `rotate(${(i % 2 ? 1 : -1) * 2}deg)`) }}>
            <div style={{ width: 210, background: hot ? P.lime : P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(7), overflow: "hidden" }}>
              <div style={{ background: P.ink, color: P.lime, ...type.label, fontSize: 24, textAlign: "center", padding: "8px 0 9px" }}>{d}</div>
              <div style={{ ...type.display, fontSize: 32, color: P.ink, textAlign: "center", padding: "18px 6px 22px", whiteSpace: "nowrap" }}>{what}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1040, display: "flex", justifyContent: "center", gap: 22 }}>
        {www.map(([w, at]) => {
          const k = pop(t, at, { damping: 8, stiffness: 240 });
          return (
            <div key={w} style={{ ...type.display, fontSize: 46, color: P.ink, background: k > 0 ? P.lime : P.paper2, border: `5px solid ${P.ink}`, borderRadius: 18, padding: "6px 24px 10px", boxShadow: k > 0 ? shadow.hard(6) : "none", opacity: k > 0 ? 1 : 0.35, transform: `scale(${k > 0 ? sc(k) : 0.9})` }}>
              {w}
            </div>
          );
        })}
      </div>
      {t > C.hafte && <DemoTag text="Example plan · not a guaranteed best time" style={{ left: 330, top: 1125, opacity: mix(pop(t, C.hafte, {})) }} />}
    </div>
  );
};

// =================================================================================================================
// 9 + 10. Rehook (WAIT... THE BEST PART!) → the mystery card flips to VIRALITY SKILL

export const RehookScene: React.FC<S> = ({ t }) => {
  if (t < C.lekin - 0.1 || t > C.jo + 0.3) return null;
  const o = leave(t, C.jo);
  const stage = eo(seg(t, C.lekin - 0.1, C.lekin + 0.2));
  const best = pop(t, C.baaki, { damping: 8, stiffness: 240 });
  const reveal = pop(t, C.virality, { damping: 8, stiffness: 240 });
  const flip = eo(seg(t, C.iski - 0.05, C.virality + 0.2));
  const card = pop(t, C.crazy, { damping: 12, stiffness: 160 });
  const pulse = 1 + Math.sin(t * 7) * 0.025 * (1 - flip);
  const front = flip < 0.5;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Stage k={stage} />
      {reveal <= 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ ...type.display, fontSize: 120, color: "#FAF9F5", letterSpacing: "-0.04em" }}>
            <Slam t={t} at={C.lekin + 0.05}>
              WAIT...
            </Slam>
          </div>
          {best > 0 && (
            <div style={{ ...type.display, fontSize: 92, color: P.lime, letterSpacing: "-0.03em", transform: `scale(${sc(best)}) rotate(-2deg)`, whiteSpace: "nowrap" }}>THE BEST PART!</div>
          )}
        </div>
      )}
      {reveal > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 350, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ ...type.display, fontSize: 124, lineHeight: 1, color: "#FAF9F5", letterSpacing: "-0.04em", transform: `scale(${sc(reveal)})` }}>VIRALITY</div>
          <div style={{ ...type.display, fontSize: 124, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 30, padding: "4px 36px 16px", boxShadow: "10px 10px 0 #FAF9F5", letterSpacing: "-0.04em", transform: `scale(${sc(pop(t, C.virality + 0.12, { damping: 8, stiffness: 240 }))}) rotate(-2.5deg)` }}>SKILL</div>
        </div>
      )}
      {card > 0 && (
        <div style={{ ...centre(540, 880, sc(card) * pulse), perspective: 1400 }}>
          <div style={{ transform: `rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d" }}>
            <div style={{ width: 380, height: 300, borderRadius: 34, border: `6px solid ${P.ink}`, background: front ? "#26251F" : P.lime, boxShadow: `0 0 ${front ? 70 : 110}px rgba(200,241,105,${front ? 0.6 : 0.9})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: front ? "none" : "scaleX(-1)" }}>
              {front ? (
                <div style={{ ...type.display, fontSize: 190, lineHeight: 1, color: P.lime }}>?</div>
              ) : (
                <>
                  <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 44, color: P.ink }}>/ig-viral</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ width: 54, height: 86, borderRadius: 10, border: `4px solid ${P.ink}`, background: i === 1 ? P.ink : P.card }} />
                    ))}
                  </div>
                  <div style={{ ...type.label, fontSize: 20, color: P.ink }}>NICHE RESEARCH</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {reveal > 0 && <DemoTag dark text="Research + ideas · never a guarantee of views" style={{ left: 305, top: 1075, opacity: mix(reveal) }} />}
      <Burst t={t} at={C.baaki} x={540} y={520} r={420} color={P.lime} />
      <Burst t={t} at={C.virality} x={540} y={880} r={560} color={P.lime} />
      <Sparks t={t} at={C.virality} x={540} y={880} n={14} r={320} />
    </div>
  );
};

// =================================================================================================================
// 11. Patterns from successful niche content → new reel ideas

const PATTERNS = ["STRONG|HOOK", "CLEAR|DEMO", "QUICK|PAYOFF", "USEFUL|CTA"];

export const PatternScene: React.FC<S> = ({ t }) => {
  if (t < C.jo - 0.1 || t > C.bas + 0.3) return null;
  const o = leave(t, C.bas);
  const head = pop(t, C.jo + 0.05, { damping: 10, stiffness: 210 });
  const hub = pop(t, C.patterns, { damping: 9, stiffness: 220 });
  const idea = pop(t, C.naye, { damping: 9, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 328, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${sc(head)})` }}>
          <div style={{ ...type.display, fontSize: 82, color: P.ink, whiteSpace: "nowrap" }}>TREND PATTERNS</div>
          <div style={{ ...type.display, fontSize: 82, color: P.ink, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 16 }}>
            <Arrow size={90} />
            <Lime>NEW IDEAS</Lime>
          </div>
        </div>
      )}
      {t > C.jo && <div style={{ ...centre(540, 545, mix(pop(t, C.jo + 0.2, {}))), ...type.label, fontSize: 21, color: P.ink3, whiteSpace: "nowrap" }}>NICHE REELS THAT BEAT THEIR OWN ACCOUNT'S MEDIAN</div>}
      {PATTERNS.map((p, i) => {
        const k = pop(t, C.successful + i * 0.3, { damping: 9, stiffness: 210 });
        if (k <= 0) return null;
        const x = 180 + i * 240;
        const [a, b] = p.split("|");
        return (
          <div key={p} style={{ ...centre(x, 700 + Math.sin(t * 2.2 + i) * 6, sc(k), `rotate(${(i % 2 ? 1 : -1) * 3}deg)`) }}>
            <div style={{ width: 196, height: 250, background: i % 2 ? P.ink : P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(7), display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 14px 16px", position: "relative", overflow: "hidden" }}>
              <svg width={60} height={60} viewBox="0 0 10 10" style={{ position: "absolute", left: 68, top: 54, opacity: 0.8 }}>
                <circle cx={5} cy={5} r={4.6} fill={i % 2 ? "#3A3933" : P.paper2} />
                <path d="M4 3 L7 5 L4 7 Z" fill={i % 2 ? P.lime : P.ink} />
              </svg>
              <div style={{ ...type.display, fontSize: 34, lineHeight: 1.02, color: i % 2 ? P.lime : P.ink }}>
                {a}
                <br />
                {b}
              </div>
            </div>
          </div>
        );
      })}
      {PATTERNS.map((p, i) => (
        <EnergyLine key={p} from={[180 + i * 240, 830]} to={[540, 900]} k={seg(t, C.patterns + i * 0.08, C.patterns + 0.4 + i * 0.08)} t={t} width={7} />
      ))}
      {hub > 0 && (
        <div style={{ ...centre(540, 905, sc(hub)), zIndex: 2 }}>
          <Logo app="claude" size={120} glow={0.6} />
        </div>
      )}
      {idea > 0 && (
        <div style={{ ...centre(540, 1062, sc(idea), `rotate(${(1 - mix(idea)) * 8 - 1.5}deg)`), zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: P.lime, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "12px 24px 14px" }}>
            <div style={{ ...type.label, fontSize: 20, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "4px 10px" }}>NEW IDEA</div>
            <div style={{ ...type.display, fontSize: 36, color: P.ink, whiteSpace: "nowrap" }}>3 free AI tools for exam week</div>
          </div>
        </div>
      )}
      {t > C.successful && <DemoTag text="Illustration · ideas, not a guarantee" style={{ left: 380, top: 1128, opacity: mix(pop(t, C.successful, {})), zIndex: 3 }} />}
    </div>
  );
};

// =================================================================================================================
// 12. Set the skills up in Claude Code (the two install commands are quoted from the README)

export const SetupScene: React.FC<S> = ({ t }) => {
  if (t < C.bas - 0.1 || t > C.posting + 0.3) return null;
  const o = leave(t, C.posting);
  const head = pop(t, C.bas, { damping: 10, stiffness: 210 });
  const term = pop(t, C.bas + 0.1, { damping: 13, stiffness: 170 });
  const steps: [string, number][] = [
    ["SKILL FILES", C.bas + 0.5],
    ["CLAUDE CODE", C.aur],
    ["DRAFTS", C.shuru],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", alignItems: "center", justifyContent: "center", gap: 22, transform: `scale(${sc(head)})` }}>
          <Logo app="claude" size={120} />
          <div style={{ ...type.display, fontSize: 96, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>CLAUDE CODE</div>
        </div>
      )}
      {term > 0 && (
        <div style={{ ...centre(540, lerp(1300, 700, eo(mix(term))), 1, "rotate(-0.5deg)") }}>
          <Term
            t={t}
            w={900}
            fs={22}
            minH={250}
            title="my-instagram · claude"
            lines={[
              { text: "claude", at: C.bas + 0.15, to: C.bas + 0.4, tone: "cmd" },
              { text: "/plugin marketplace add Jakeschincariol/instagram-agent-skill", at: C.bas + 0.5, to: C.setup + 0.2, tone: "you" },
              { text: "/plugin install instagram-agent", at: C.setup + 0.3, to: C.aur, tone: "you" },
              { text: "13 skills ready: /ig-plan /ig-reply /ig-viral ...", at: C.aur + 0.1, tone: "ok" },
              { text: "/ig-plan", at: C.aur + 0.5, to: C.shuru - 0.1, tone: "you" },
              { text: "Week plan drafted. Review it, then post it yourself.", at: C.shuru, tone: "ok" },
            ]}
          />
        </div>
      )}
      <div style={{ position: "absolute", left: 100, width: 880, top: 945, display: "flex", gap: 14 }}>
        {steps.map(([s, at], i) => (
          <PipeStep key={s} label={s} n={i + 1} k={seg(t, at, at + 0.2)} hot={i === 2 ? t >= at : t >= at && t < steps[i + 1][1]} w={(880 - 28) / 3} />
        ))}
      </div>
      {term > 0 && (
        <div style={{ ...centre(540, 1100, mix(pop(t, C.setup, {}))) }}>
          <Chip text="Needs a paid Claude plan · commands from the README" size={24} tone="card" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 13. You stay in control: draft ready → review → approve (the creator taps it)

export const ControlScene: React.FC<S> = ({ t }) => {
  if (t < C.posting - 0.1 || t > C.setupQ + 0.3) return null;
  const o = leave(t, C.setupQ);
  const card = pop(t, C.posting, { damping: 12, stiffness: 170 });
  const tap = C.approval + 0.6;
  const approved = t >= tap;
  const head = pop(t, C.haath, { damping: 8, stiffness: 240 });
  const pre = pop(t, C.posting, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {pre > 0 && head <= 0 && (
        <div style={{ ...centre(540, 395, sc(pre)), ...type.display, fontSize: 70, color: P.ink, whiteSpace: "nowrap" }}>
          POSTING + <Lime>FINAL APPROVAL</Lime>
        </div>
      )}
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={70} tone="ink" rotate={0}>
            YOU STAY IN CONTROL
          </Sticker>
        </div>
      )}
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1300, 760, eo(mix(card))), 1, "rotate(-1deg)") }}>
          <div style={{ width: 800, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "24px 30px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ ...type.label, fontSize: 24, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "6px 16px" }}>DRAFT READY</div>
              <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: 22, color: P.ink3 }}>caption · reel idea</div>
            </div>
            {[0.95, 0.82, 0.9, 0.6].map((w, i) => (
              <div key={i} style={{ height: 18, borderRadius: 9, background: P.line, width: `${w * 100}%` }} />
            ))}
            <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
              <div style={{ flex: 1, ...type.display, fontSize: 38, color: P.ink, textAlign: "center", border: `5px solid ${P.ink}`, borderRadius: 20, padding: "12px 0 16px", background: t > C.approval ? P.paper2 : P.card }}>REVIEW</div>
              <div style={{ flex: 1, ...type.display, fontSize: 38, color: approved ? P.lime : P.ink, textAlign: "center", border: `5px solid ${P.ink}`, borderRadius: 20, padding: "12px 0 16px", background: approved ? P.ink : P.lime, boxShadow: approved ? "none" : shadow.hard(6), transform: `scale(${t > tap - 0.06 && t < tap + 0.08 ? 0.95 : 1})` }}>
                {approved ? "APPROVED ✓" : "APPROVE"}
              </div>
            </div>
          </div>
        </div>
      )}
      <TapPointer t={t} from={[980, 1150]} to={[760, 900]} at={C.approval} tapAt={tap} />
      {head > 0 && (
        <div style={{ ...centre(540, 1085, mix(head)) }}>
          <Chip text="Skills write. You post." size={34} tone="lime" />
        </div>
      )}
      {card > 0 && <DemoTag text="Illustration" style={{ left: 140, top: 1120, opacity: mix(card) * (1 - mix(head)) }} />}
    </div>
  );
};

// =================================================================================================================
// 14. Poora setup chahiye? Comment AGENT (no DMs promised or shown)

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.setupQ - 0.1 || t > C.aisi + 0.3) return null;
  const o = leave(t, C.aisi);
  const head = pop(t, C.setupQ, { damping: 10, stiffness: 210 });
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.agent, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Poora <Lime>setup</Lime> chahiye?
        </div>
      )}
      {bubble > 0 && (
        <div style={{ ...centre(540, 790, sc(bubble), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 760, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "26px 30px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ ...type.label, fontSize: 36, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 190, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>AGENT</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 80, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      {big > 0 && (
        <div style={{ ...centre(560, 1055, mix(pop(t, C.agent + 0.2, {})), "rotate(1.5deg)") }}>
          <Chip text="INSTAGRAM AGENT SETUP" size={40} tone="ink" />
        </div>
      )}
      {big > 0 && <div style={{ ...centre(540, 1122, mix(pop(t, C.agent + 0.4, {}))), ...type.label, fontSize: 22, color: P.ink2, whiteSpace: "nowrap" }}>OR TYPE AGENT AT THE LINK IN BIO</div>}
      <Burst t={t} at={C.agent} x={540} y={800} r={460} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 15. Follow @internetoolbox

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.aisi - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.aisi + 0.05, { damping: 10, stiffness: 210 });
  const mark = pop(t, C.follow + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.follow + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
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
          {(["claude", "insta"] as const).map((a, i) => {
            const k = pop(t, C.tricks - 0.2 + i * 0.12, { damping: 10, stiffness: 230 });
            return (
              <div key={a} style={{ ...centre(380 + i * 320, 680, sc(k), `rotate(${(i % 2 ? 1 : -1) * 5}deg)`) }}>
                <Logo app={a} size={160} />
              </div>
            );
          })}
        </div>
      )}
      {mark > 0 && (
        <div style={{ ...centre(540, 540, sc(mark) * bump, `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 720, mix(handle)), ...type.display, fontSize: 64, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <Lime>@INTERNETOOLBOX</Lime>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 805, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Internet Toolbox · Creator Secrets</div>}
      <FollowButton t={t} at={C.follow + 0.25} tapAt={C.follow + 0.55} top={870} invite />
      {t > C.follow + 0.55 && (
        <div style={{ ...centre(800, 920, mix(pop(t, C.follow + 0.65, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
      <Sparks t={t} at={C.brand} x={540} y={540} n={12} r={260} />
    </>
  );
};
