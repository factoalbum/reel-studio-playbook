import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, PhoneShell } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C, anti as ep } from "../episodes/anti";
import { Chip, mix, sc } from "../launch/kit";
import { BrowserWin, EnergyLine, Streak } from "../fable/kit";
import { PipeStep } from "../fable52/kit";
import { Caret, Lime, Logo, RED, Slam, Stage, typed } from "../agent/Scenes";

/**
 * Creator Secrets: "Claude par ₹2,000... sirf reels edit karne ke liye?!" → Google Antigravity's free plan, four
 * steps (open the project, set up Remotion + FFmpeg + Whisper, make a style guide, make the reel) → the 18 Nov
 * change (Claude models leave the free plan, Gemini Flash stays with weekly limits) → check it yourself → comment
 * EDIT. Times: src/episodes/anti.ts.
 * Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, presenter below.
 * Logos (public/anti/logos, never redrawn): antigravity.png = antigravity.google/assets/image/antigravity-logo.png;
 * gemini.png = the Gemini sparkle favicon from gemini.google; ffmpeg.svg = FFmpeg's logo (Wikimedia Commons copy);
 * Remotion and the Claude spark are the files earlier reels use. Whisper has no logo of its own: its name is set
 * in our type with a neutral waveform. Every app window here is our own drawing and is labelled an illustration.
 */

type S = { t: number };
const out = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.1 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.hazaar, 0.06, 0.7) + push(C.google, 0.06, 0.7) + push(C.taiyaar, 0.05, 0.6) + push(C.baaki, 0.05, 0.5) + push(C.date, 0.07, 0.8) + push(C.editWord, 0.06, 0.6);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.wahi, C.bas, C.chautha, C.haan, C.setupQ].map((at, i) => {
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
    <Streak t={t} at={C.google - 0.08} dur={0.45} />
    <Streak t={t} at={C.date - 0.1} dur={0.45} />
    <Streak t={t} at={C.editWord - 0.08} />
  </>
);

// =================================================================================================================
// Shared bits

type App = "antigravity" | "gemini" | "remotion";
const SRC: Record<App, string> = { antigravity: "anti/logos/antigravity.png", gemini: "anti/logos/gemini.png", remotion: "gta6/logos/remotion.png" };

/** An official logo file on a white tile, flat and undistorted. */
export const Tile: React.FC<{ app: App; size: number; glow?: number }> = ({ app, size, glow = 0 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: "#FFFFFF", border: `${Math.max(4, size * 0.035)}px solid ${P.ink}`, boxShadow: `${shadow.hard(Math.max(5, size * 0.05))}${glow > 0 ? `, 0 0 ${size * 0.5 * glow}px ${P.lime}` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <Img src={staticFile(SRC[app])} style={{ width: size * (app === "antigravity" ? 0.86 : 0.64), height: size * (app === "antigravity" ? 0.86 : 0.64), objectFit: "contain", display: "block" }} />
  </div>
);

const Folder: React.FC<{ w: number; label?: string }> = ({ w, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <svg width={w} height={w * 0.79} viewBox="0 0 66 52">
      <path d="M3 8 h20 l6 7 h34 v34 h-60z" fill={P.limeDeep} stroke={P.ink} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M3 49 l6 -26 h54 l-3 26z" fill={P.lime} stroke={P.ink} strokeWidth={3.5} strokeLinejoin="round" />
    </svg>
    {label && <div style={{ ...type.label, fontSize: Math.max(18, w * 0.13), color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "4px 12px", whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);

/** Step header: number pill and the step's title. */
const StepHead: React.FC<{ t: number; at: number; n: number; title: string }> = ({ t, at, n, title }) => {
  const k = pop(t, at, { damping: 10, stiffness: 210 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: `translateY(${(1 - mix(k)) * -50}px)`, opacity: mix(k) }}>
      <div style={{ ...type.label, fontSize: 30, color: P.lime, background: P.ink, borderRadius: 999, padding: "9px 22px 10px", whiteSpace: "nowrap", transform: `scale(${sc(k)})` }}>STEP {n}</div>
      <div style={{ ...type.display, fontSize: title.length > 22 ? 60 : title.length > 18 ? 68 : 80, lineHeight: 1, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em" }}>{title}</div>
    </div>
  );
};

// =================================================================================================================
// 1. Hook: ₹2,000?! ... sirf reels edit karne ke liye?!

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.wahi + 0.3) return null;
  const o = out(t, C.wahi);
  const swap = eo(seg(t, C.sirf - 0.1, C.sirf + 0.15));
    const waste = pop(t, C.barbaad, { damping: 8, stiffness: 240 });
  const reel = pop(t, C.edit, { damping: 9, stiffness: 220 });
  const shake = t > C.hazaar && t < C.hazaar + 0.35 ? Math.sin(t * 90) * 9 * (1 - (t - C.hazaar) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${shake}px)` }}>
      {swap < 1 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 318, textAlign: "center", opacity: 1 - swap, transform: `scale(${1 + swap * 0.4})` }}>
          <Slam t={t} at={-0.3}>
            <span style={{ ...type.display, fontSize: 210, lineHeight: 1, color: P.ink, letterSpacing: "-0.05em", textShadow: `9px 9px 0 ${P.lime}` }}>₹2,000?!</span>
          </Slam>
        </div>
      )}
      {swap > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ ...type.display, fontSize: 92, color: P.ink, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
            <Slam t={t} at={C.sirf}>
              SIRF REELS EDIT
            </Slam>
          </div>
          <div style={{ transform: "rotate(-2.5deg)" }}>
            <Slam t={t} at={C.edit}>
              <div style={{ ...type.display, fontSize: 96, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 28, padding: "6px 30px 16px", boxShadow: shadow.hard(10), letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>KARNE KE LIYE?!</div>
            </Slam>
          </div>
        </div>
      )}
      {/* the subscription card, on screen from frame 0 */}
      <div style={{ ...centre(lerp(540, 400, eo(mix(reel))), 800, 1 + Math.sin(t * 3) * 0.01, "rotate(-2deg)") }}>
        <div style={{ width: 600, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 36, boxShadow: shadow.hard(12), padding: "26px 30px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Logo app="claude" size={110} />
            <div>
              <div style={{ ...type.display, fontSize: 64, lineHeight: 1, color: P.ink }}>Claude Pro</div>
              <div style={{ ...type.label, fontSize: 22, color: P.ink3, marginTop: 6 }}>BILLED YEARLY</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - C.hazaar - 0.15) / 0.25)})`, transformOrigin: "left center" }}>
            <div style={{ ...type.display, fontSize: 120, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em" }}>₹2,000</div>
            <div style={{ ...type.display, fontSize: 40, color: P.ink3 }}>/ month</div>
          </div>
        </div>
      </div>
      {waste > 0 && (
        <div style={{ ...centre(lerp(760, 620, eo(mix(reel))), 1000, sc(waste), `rotate(${(1 - mix(waste)) * 14 + 5}deg)`), zIndex: 3 }}>
          <div style={{ ...type.display, fontSize: 70, color: "#fff", background: RED, border: `6px solid ${P.ink}`, borderRadius: 22, padding: "4px 26px 12px", boxShadow: shadow.hard(8), whiteSpace: "nowrap" }}>BARBAAD?</div>
        </div>
      )}
      {reel > 0 && (
        <div style={{ ...centre(860, 760, sc(reel), "rotate(6deg)"), zIndex: 2 }}>
          <div style={{ width: 190, height: 330, borderRadius: 28, background: P.ink, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <svg width={90} height={90} viewBox="0 0 10 10">
              <circle cx={5} cy={5} r={4.6} fill={P.lime} />
              <path d="M4 3 L7 5 L4 7 Z" fill={P.ink} />
            </svg>
            <div style={{ ...type.label, fontSize: 22, color: P.lime }}>REEL EDIT</div>
          </div>
        </div>
      )}
      <DemoTag text="Claude Pro, India · annual billing · checked 15 Nov 2026" style={{ left: 185, top: 1110, opacity: mix(pop(t, C.claude, {})) }} />
      <Burst t={t} at={C.hazaar} x={540} y={800} r={480} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 2. The free alternative: Google Antigravity, free tier, usage limits apply

export const FreeScene: React.FC<S> = ({ t }) => {
  if (t < C.wahi - 0.1 || t > C.bas + 0.3) return null;
  const o = out(t, C.bas);
  const folder = pop(t, C.wahi + 0.05, { damping: 11, stiffness: 190 });
  const logo = pop(t, C.google, { damping: 8, stiffness: 230 });
  const free = pop(t, C.free, { damping: 8, stiffness: 240 });
  const note = pop(t, C.sakte, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {logo > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${sc(logo)})` }}>
          <div style={{ ...type.label, fontSize: 36, color: P.ink3 }}>GOOGLE</div>
          <div style={{ ...type.display, fontSize: 124, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em" }}>ANTIGRAVITY</div>
        </div>
      )}
      {folder > 0 && (
        <div style={{ ...centre(230, 740 + Math.sin(t * 2.4) * 6, sc(folder), "rotate(-4deg)") }}>
          <Folder w={210} label="MY AI REELS" />
        </div>
      )}
      <EnergyLine from={[350, 720]} to={[560, 720]} k={seg(t, C.wahi + 0.35, C.google + 0.1)} t={t} width={12} />
      {logo > 0 && (
        <div style={{ ...centre(730, 720 + Math.cos(t * 2.4) * 6, sc(logo), "rotate(3deg)") }}>
          <Tile app="antigravity" size={320} glow={0.6} />
        </div>
      )}
      {free > 0 && (
        <div style={{ ...centre(540, 985, sc(free), `rotate(${(1 - mix(free)) * 10 - 2}deg)`), zIndex: 3 }}>
          <Sticker size={74} tone="lime" rotate={0}>
            FREE TIER AVAILABLE
          </Sticker>
        </div>
      )}
      {note > 0 && (
        <div style={{ ...centre(540, 1098, sc(note)) }}>
          <Chip text="Usage limits apply" size={34} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.google} x={730} y={720} r={460} color={P.lime} />
      <Sparks t={t} at={C.free} x={540} y={985} n={10} r={300} />
    </div>
  );
};

// =================================================================================================================
// 3. Four steps

const STEPS = ["PROJECT", "VIDEO ENGINE", "STYLE GUIDE", "FINAL REEL"];

export const StepsScene: React.FC<S> = ({ t }) => {
  if (t < C.bas - 0.1 || t > C.pehla + 0.3) return null;
  const o = out(t, C.pehla);
  const head = pop(t, C.bas, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head), "rotate(-2deg)") }}>
          <Sticker size={110} tone="ink" rotate={0}>
            4 STEPS
          </Sticker>
        </div>
      )}
      {STEPS.map((s, i) => {
        const k = pop(t, C.chaar + i * 0.2, { damping: 8, stiffness: 230 });
        if (k <= 0) return null;
        return (
          <div key={s} style={{ ...centre(300 + (i % 2) * 480, 680 + Math.floor(i / 2) * 250 + Math.sin(t * 2.4 + i) * 6, sc(k), `rotate(${(i % 2 ? 1 : -1) * 2.5}deg)`) }}>
            <div style={{ width: 430, background: i === 0 ? P.lime : P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(9), padding: "14px 22px 20px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ ...type.display, fontSize: 120, lineHeight: 0.9, color: P.ink, letterSpacing: "-0.05em" }}>{i + 1}</div>
              <div style={{ ...type.display, fontSize: 40, lineHeight: 1.05, color: P.ink }}>{s}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 4. Step 1: open your reel project folder (our own drawing of an editor window)

const FILES = ["voice.wav", "src/", "public/", "package.json"];

export const OpenScene: React.FC<S> = ({ t }) => {
  if (t < C.pehla - 0.1 || t > C.doosra + 0.3) return null;
  const o = out(t, C.doosra);
  const win = pop(t, C.pehla + 0.15, { damping: 13, stiffness: 170 });
  const drop = eo(seg(t, C.anti, C.kholo));
  const folder = pop(t, C.apna, { damping: 10, stiffness: 200 });
  const opened = t >= C.kholo;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.pehla} n={1} title="OPEN YOUR PROJECT" />
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1300, 800, eo(mix(win))), 1, "rotate(-0.5deg)") }}>
          <BrowserWin w={880} h={430} url="Antigravity · editor">
            <div style={{ display: "flex", height: "100%" }}>
              <div style={{ width: 300, borderRight: `3px solid ${P.ink}`, background: P.paper2, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>EXPLORER</div>
                {opened && <div style={{ ...type.display, fontSize: 26, color: P.ink, background: P.lime, borderRadius: 8, padding: "4px 10px" }}>MY AI REELS</div>}
                {opened &&
                  FILES.map((f, i) => (
                    <div key={f} style={{ fontFamily: mono, fontWeight: 600, fontSize: 24, color: P.ink2, paddingLeft: 16, opacity: mix(pop(t, C.kholo + 0.08 + i * 0.08, {})) }}>
                      {f}
                    </div>
                  ))}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <Img src={staticFile("anti/logos/antigravity.png")} style={{ width: 130, height: 130 }} />
                <div style={{ ...type.display, fontSize: 36, color: P.ink, border: `5px solid ${P.ink}`, borderRadius: 16, padding: "8px 26px 12px", background: opened ? P.lime : P.card, boxShadow: shadow.hard(6) }}>{opened ? "Folder opened ✓" : "Open Folder"}</div>
              </div>
            </div>
          </BrowserWin>
        </div>
      )}
      {folder > 0 && drop < 1 && (
        <div style={{ ...centre(lerp(830, 250, drop), lerp(600, 760, drop), sc(folder) * lerp(1, 0.5, drop), `rotate(${lerp(6, 0, drop)}deg)`), opacity: 1 - seg(drop, 0.8, 1), zIndex: 3 }}>
          <Folder w={170} label="MY AI REELS" />
        </div>
      )}
      {win > 0 && <DemoTag text="Illustration · File > Open Folder" style={{ left: 390, top: 1105, opacity: mix(win) }} />}
    </div>
  );
};

// =================================================================================================================
// 5. Step 2: the prompt, then Remotion + FFmpeg + Whisper become one video engine

const PROMPT = "Setup a video engine using Remotion, FFmpeg and Whisper.";
const TOOLS: [string, string, number][] = [
  ["Remotion", "ANIMATION", C.remotion],
  ["FFmpeg", "EXPORT", C.ffmpeg],
  ["Whisper", "CAPTIONS", C.whisper],
];

const ToolLogo: React.FC<{ i: number; t: number }> = ({ i, t }) =>
  i === 0 ? (
    <Img src={staticFile("gta6/logos/remotion.png")} style={{ width: 92, height: 92, objectFit: "contain" }} />
  ) : i === 1 ? (
    <Img src={staticFile("anti/logos/ffmpeg.svg")} style={{ width: 216, height: 58 }} />
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 6, height: 80 }}>
      {Array.from({ length: 9 }, (_, b) => (
        <div key={b} style={{ width: 10, borderRadius: 5, background: P.ink, height: 18 + Math.abs(Math.sin(t * 5 + b * 0.9)) * 58 }} />
      ))}
    </div>
  );

export const EngineScene: React.FC<S> = ({ t }) => {
  if (t < C.doosra - 0.1 || t > C.teesra + 0.3) return null;
  const o = out(t, C.teesra);
  const box = pop(t, C.prompt, { damping: 12, stiffness: 180 });
  const s = typed(t, PROMPT, C.prompt + 0.2, C.remotion);
  const pipe = ["AUDIO", "TRANSCRIBE", "ANIMATE", "RENDER"];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.doosra} n={2} title="SETUP VIDEO ENGINE" />
      {box > 0 && (
        <div style={{ ...centre(540, lerp(1300, 620, eo(mix(box))), 1, "rotate(-0.8deg)") }}>
          <div style={{ width: 880, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(9), padding: "16px 24px 22px", display: "flex", gap: 18, alignItems: "flex-start" }}>
            <Img src={staticFile("anti/logos/antigravity.png")} style={{ width: 76, height: 76, flex: "0 0 auto" }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>YOUR PROMPT</div>
              <div style={{ ...type.display, fontSize: 38, lineHeight: 1.18, color: P.ink, minHeight: 92 }}>
                {s}
                <Caret t={t} on={s.length < PROMPT.length} />
              </div>
            </div>
          </div>
        </div>
      )}
      {TOOLS.map(([name, job, at], i) => {
        const k = pop(t, at, { damping: 8, stiffness: 230 });
        if (k <= 0) return null;
        return (
          <div key={name} style={{ ...centre(240 + i * 300, 850, sc(k), `rotate(${(i - 1) * 2.5}deg)`) }}>
            <div style={{ width: 272, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: `${shadow.hard(8)}, 0 0 40px rgba(200,241,105,0.6)`, padding: "14px 10px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ToolLogo i={i} t={t} />
              </div>
              <div style={{ ...type.display, fontSize: 38, color: P.ink }}>{name}</div>
              <div style={{ ...type.label, fontSize: 17, color: P.olive }}>{job}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 90, width: 900, top: 1000, display: "flex", gap: 12 }}>
        {pipe.map((p, i) => {
          const at = C.whisper + 0.35 + i * 0.14;
          return <PipeStep key={p} label={p} n={i + 1} k={seg(t, at, at + 0.2)} hot={t >= at && (i === 3 || t < at + 0.14)} w={(900 - 36) / 4} />;
        })}
      </div>
      {t > C.whisper + 0.3 && <DemoTag text="Illustration · installs can need a few fixes" style={{ left: 335, top: 1112, opacity: mix(pop(t, C.whisper + 0.5, {})) }} />}
    </div>
  );
};

// =================================================================================================================
// 6. Step 3: a style guide from reels you like (our own covers shown; learn the style, never copy)

const REAL = ["mdh", "claude", "ebay"];
const PARTS: [string, number][] = [
  ["FONTS", C.fonts],
  ["CUTS", C.cuts],
  ["TRANSITIONS", C.trans],
];

export const StyleScene: React.FC<S> = ({ t }) => {
  if (t < C.teesra - 0.1 || t > C.chautha + 0.3) return null;
  const o = out(t, C.chautha);
  const merge = eo(seg(t, C.style - 0.1, C.style + 0.2));
  const sheet = pop(t, C.style, { damping: 10, stiffness: 190 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.teesra} n={3} title="CREATE YOUR STYLE SYSTEM" />
      {merge < 1 &&
        REAL.map((r, i) => {
          const k = pop(t, C.apni + 0.3 + i * 0.25, { damping: 10, stiffness: 200 });
          if (k <= 0) return null;
          return (
            <div key={r} style={{ ...centre(190 + i * 110, 790 + i * 14, sc(k), `rotate(${-8 + i * 7}deg)`), opacity: 1 - merge, zIndex: i }}>
              <Img src={staticFile(`fable52/real-${r}.jpg`)} style={{ width: 200, height: 356, objectFit: "cover", borderRadius: 18, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7), display: "block" }} />
            </div>
          );
        })}
      {merge < 1 &&
        PARTS.map(([p, at], i) => {
          const k = pop(t, at, { damping: 8, stiffness: 230 });
          if (k <= 0) return null;
          return (
            <div key={p} style={{ ...centre(790, 640 + i * 150, sc(k), `rotate(${(i - 1) * 3}deg)`), opacity: 1 - merge }}>
              <Chip text={p} size={48} tone={i === 1 ? "lime" : "card"} />
            </div>
          );
        })}
      <EnergyLine from={[480, 790]} to={[620, 790]} k={seg(t, C.fonts - 0.3, C.fonts + 0.1) * (1 - merge)} t={t} width={10} />
      {sheet > 0 && (
        <div style={{ ...centre(540, 790, sc(sheet), "rotate(-1deg)"), zIndex: 5 }}>
          <div style={{ width: 860, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: `${shadow.hard(10)}, 0 0 60px rgba(200,241,105,0.6)`, padding: "20px 26px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 30, color: P.ink }}>STYLE-GUIDE.md</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                {[P.paper, P.ink, P.lime, P.olive].map((c) => (
                  <div key={c} style={{ width: 44, height: 44, borderRadius: 12, background: c, border: `3px solid ${P.ink}` }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ flex: 1, background: P.limeWash, border: `4px solid ${P.ink}`, borderRadius: 20, padding: "10px 16px 14px" }}>
                <div style={{ ...type.label, fontSize: 18, color: P.olive }}>FONTS</div>
                <div style={{ ...type.display, fontSize: 96, lineHeight: 1, color: P.ink }}>Aa</div>
                <div style={{ ...type.body, fontWeight: 600, fontSize: 20, color: P.ink2 }}>Bold headline, mono label</div>
              </div>
              <div style={{ flex: 1, background: P.limeWash, border: `4px solid ${P.ink}`, borderRadius: 20, padding: "10px 16px 14px" }}>
                <div style={{ ...type.label, fontSize: 18, color: P.olive }}>CUTS</div>
                <div style={{ display: "flex", gap: 5, height: 96, alignItems: "center" }}>
                  {[70, 44, 58, 36].map((w, i) => (
                    <div key={i} style={{ width: w, height: 58, borderRadius: 8, background: i % 2 ? P.lime : P.ink, border: `3px solid ${P.ink}` }} />
                  ))}
                </div>
                <div style={{ ...type.body, fontWeight: 600, fontSize: 20, color: P.ink2 }}>One idea per scene</div>
              </div>
              <div style={{ flex: 1, background: P.limeWash, border: `4px solid ${P.ink}`, borderRadius: 20, padding: "10px 16px 14px" }}>
                <div style={{ ...type.label, fontSize: 18, color: P.olive }}>TRANSITIONS</div>
                <div style={{ position: "relative", height: 96 }}>
                  <div style={{ position: "absolute", left: 4, top: 18, width: 84, height: 60, borderRadius: 10, background: P.card, border: `3px solid ${P.ink}` }} />
                  <div style={{ position: "absolute", left: 60 + Math.sin(t * 3) * 14, top: 18, width: 84, height: 60, borderRadius: 10, background: P.lime, border: `3px solid ${P.ink}`, transform: "skewX(-10deg)" }} />
                </div>
                <div style={{ ...type.body, fontWeight: 600, fontSize: 20, color: P.ink2 }}>Wipes, pops, pushes</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DemoTag text="Our own reel covers · learn the style, never copy" style={{ left: 235, top: 1108, opacity: mix(pop(t, C.apni + 0.4, {})), zIndex: 6 }} />
    </div>
  );
};

// =================================================================================================================
// 7. Step 4: from audio to reel (voice → captions → animation → export → MP4 on a phone)

const ROWS: [string, number][] = [
  ["VOICE / FOOTAGE", C.voice],
  ["WHISPER CAPTIONS", C.captions],
  ["REMOTION ANIMATION", C.anims],
  ["FFMPEG EXPORT", C.final],
];

export const MakeScene: React.FC<S> = ({ t }) => {
  if (t < C.chautha - 0.1 || t > C.lekin + 0.3) return null;
  const o = eo(seg(t, C.lekin - 0.15, C.lekin + 0.15));
  const head = pop(t, C.chautha, { damping: 9, stiffness: 220 });
  const phone = pop(t, C.voice + 0.2, { damping: 12, stiffness: 170 });
  const done = pop(t, C.taiyaar, { damping: 8, stiffness: 230 });
  const prog = seg(t, C.final, C.taiyaar);
  const f = Math.round(t * 30);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `scale(${1 - o * 0.12})`, transformOrigin: "540px 800px" }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ ...type.label, fontSize: 30, color: P.lime, background: P.ink, borderRadius: 999, padding: "9px 22px 10px", transform: `scale(${sc(head)})` }}>STEP 4</div>
          <div style={{ ...type.display, fontSize: 80, lineHeight: 1, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.03em", transform: `scale(${sc(head)})` }}>
            FROM AUDIO <Lime>TO REEL</Lime>
          </div>
        </div>
      )}
      {ROWS.map(([label, at], i) => {
        const k = pop(t, at, { damping: 10, stiffness: 210 });
        if (k <= 0) return null;
        const hot = t >= at && (i === 3 ? t < C.taiyaar : t < ROWS[i + 1][1]);
        return (
          <div key={label} style={{ ...centre(350, 590 + i * 132, sc(k)) }}>
            <div style={{ width: 520, height: 104, boxSizing: "border-box", background: hot ? P.lime : P.card, border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(7), padding: "0 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ ...type.display, fontSize: 30, color: P.ink, whiteSpace: "nowrap", flex: 1 }}>{label}</div>
              {i === 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, height: 70 }}>
                  {Array.from({ length: 14 }, (_, b) => (
                    <div key={b} style={{ width: 7, borderRadius: 4, background: P.ink, height: 8 + Math.min(1, (ep.env[Math.max(0, f - 13 + b)] ?? 0) * 1.5) * 60 }} />
                  ))}
                </div>
              )}
              {i === 1 && <div style={{ ...type.display, fontSize: 24, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "2px 10px 4px" }}>Aa</div>}
              {i === 2 && <div style={{ width: 44, height: 44, borderRadius: 12, background: P.ink, transform: `rotate(${t * 140}deg)` }} />}
              {i === 3 && <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: P.ink }}>{Math.round(prog * 100)}%</div>}
            </div>
          </div>
        );
      })}
      {phone > 0 && (
        <div style={{ ...centre(lerp(1300, 830, eo(mix(phone))), 800, 1, "rotate(4deg)") }}>
          <PhoneShell w={300} glow={done > 0 ? 1 : 0}>
            <div style={{ position: "relative", width: "100%", height: 520, overflow: "hidden", background: "#141413" }}>
              <Img src={staticFile("anti/prev-reel.png")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: done > 0 ? 1 : 0.18 }} />
              {done <= 0 && (
                <div style={{ position: "absolute", left: 24, right: 24, top: 240 }}>
                  <div style={{ ...type.label, fontSize: 18, color: "#D9D6CC", marginBottom: 10 }}>RENDERING</div>
                  <div style={{ height: 16, borderRadius: 8, background: "#3A3933", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${prog * 100}%`, background: P.lime }} />
                  </div>
                </div>
              )}
            </div>
          </PhoneShell>
        </div>
      )}
      {done > 0 && (
        <div style={{ ...centre(830, 1075, sc(done), "rotate(-3deg)"), zIndex: 3 }}>
          <Sticker size={50} tone="lime" rotate={0}>
            FINAL MP4 ✓
          </Sticker>
        </div>
      )}
      {phone > 0 && <DemoTag text="Illustration · phone shows a real reel of ours" style={{ left: 110, top: 1112, opacity: mix(phone) }} />}
      <Burst t={t} at={C.taiyaar} x={830} y={800} r={420} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 8 to 10. Rehook → 18 November (Claude models leave the free plan) → Gemini Flash stays, weekly limits

const Cal: React.FC<{ mystery: boolean }> = ({ mystery }) => (
  <div style={{ width: 330, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, overflow: "hidden", boxShadow: `0 0 80px rgba(200,241,105,0.75)` }}>
    <div style={{ background: P.lime, color: P.ink, ...type.label, fontSize: 26, textAlign: "center", padding: "12px 0 13px", borderBottom: `5px solid ${P.ink}` }}>NOVEMBER 2026</div>
    <div style={{ ...type.display, fontSize: 200, lineHeight: 1, color: P.ink, textAlign: "center", letterSpacing: "-0.06em", padding: "4px 0 0" }}>{mystery ? "?" : "18"}</div>
    <div style={{ ...type.label, fontSize: 22, color: P.ink3, textAlign: "center", padding: "0 0 18px" }}>{mystery ? "COMING UP" : "WEDNESDAY"}</div>
  </div>
);

const MODELS: [string, boolean][] = [
  ["Claude Sonnet 4.6", true],
  ["Claude Opus 4.6", true],
  ["Gemini 3.8 Flash", false],
];

export const TwistScene: React.FC<S> = ({ t }) => {
  if (t < C.lekin - 0.1 || t > C.haan + 0.3) return null;
  const o = out(t, C.haan);
  const stage = eo(seg(t, C.lekin - 0.1, C.lekin + 0.2));
  const best = pop(t, C.baaki, { damping: 8, stiffness: 240 });
  const cal = pop(t, C.asli, { damping: 12, stiffness: 160 });
  const date = pop(t, C.date, { damping: 8, stiffness: 230 });
  const side = eo(seg(t, C.anti2 - 0.2, C.anti2 + 0.2));
  const list = pop(t, C.anti2, { damping: 11, stiffness: 190 });
  const gone = eo(seg(t, C.hat - 0.05, C.hat + 0.3));
  const gem = pop(t, C.gemini, { damping: 8, stiffness: 230 });
  const meter = seg(t, C.weekly, C.weekly + 1.2);
  const pulse = date > 0 ? 1 : 1 + Math.sin(t * 7) * 0.025;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Stage k={stage} />
      {/* headlines */}
      {date <= 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 356, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ ...type.display, fontSize: 116, color: "#FAF9F5", letterSpacing: "-0.04em" }}>
            <Slam t={t} at={C.lekin + 0.05}>
              WAIT...
            </Slam>
          </div>
          {best > 0 && <div style={{ ...type.display, fontSize: 96, color: P.lime, letterSpacing: "-0.03em", transform: `scale(${sc(best)}) rotate(-2deg)`, whiteSpace: "nowrap" }}>BIG UPDATE!</div>}
        </div>
      )}
      {date > 0 && gem <= 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 352, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ ...type.display, fontSize: 96, lineHeight: 1, color: "#FAF9F5", letterSpacing: "-0.04em", transform: `scale(${sc(date)})` }}>MODEL ACCESS</div>
          <div style={{ ...type.display, fontSize: 96, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 28, padding: "4px 30px 14px", boxShadow: "9px 9px 0 #FAF9F5", letterSpacing: "-0.04em", transform: `scale(${sc(pop(t, C.date + 0.12, { damping: 8, stiffness: 240 }))}) rotate(-2deg)` }}>CHANGING</div>
        </div>
      )}
      {gem > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 352, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, transform: `scale(${sc(gem)})` }}>
            <Tile app="gemini" size={112} glow={0.6} />
            <div style={{ ...type.display, fontSize: 100, lineHeight: 1, color: "#FAF9F5", letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>GEMINI FLASH</div>
          </div>
          <div style={{ ...type.display, fontSize: 46, color: P.ink, background: P.lime, border: `5px solid ${P.ink}`, borderRadius: 18, padding: "4px 22px 10px", transform: `scale(${sc(pop(t, C.gemini + 0.25, { damping: 9, stiffness: 230 }))}) rotate(-1.5deg)`, whiteSpace: "nowrap" }}>FREE TIER • WEEKLY LIMITS</div>
        </div>
      )}
      {/* calendar */}
      {cal > 0 && (
        <div style={{ ...centre(lerp(540, 270, side), lerp(840, 800, side), sc(cal) * pulse * lerp(1, 0.8, side), `rotate(${lerp(0, -4, side)}deg)`) }}>
          <Cal mystery={date <= 0} />
        </div>
      )}
      {/* the free plan's model list */}
      {list > 0 && (
        <div style={{ ...centre(lerp(1300, 720, eo(mix(list))), 800, 1, "rotate(1.5deg)") }}>
          <div style={{ width: 520, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: `0 0 60px rgba(200,241,105,0.45)`, padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Img src={staticFile("anti/logos/antigravity.png")} style={{ width: 56, height: 56 }} />
              <div style={{ ...type.display, fontSize: 34, color: P.ink }}>Antigravity</div>
              <div style={{ marginLeft: "auto", ...type.label, fontSize: 20, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "4px 12px" }}>FREE PLAN</div>
            </div>
            {MODELS.map(([m, leaves]) => {
              const off = leaves ? gone : 0;
              const hot = !leaves && gem > 0;
              return (
                <div key={m} style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, background: hot ? P.lime : P.paper2, border: `4px solid ${P.ink}`, borderRadius: 16, padding: "10px 14px 12px", opacity: 1 - off * 0.45, transform: `scale(${hot ? 1.04 : 1})` }}>
                  <div style={{ ...type.display, fontSize: 32, color: P.ink, whiteSpace: "nowrap" }}>{m}</div>
                  {leaves && off > 0 && <div style={{ position: "absolute", left: 10, top: "52%", height: 6, borderRadius: 3, background: RED, width: `${off * 62}%` }} />}
                  {leaves && off > 0.6 && <div style={{ marginLeft: "auto", ...type.label, fontSize: 18, color: "#fff", background: RED, borderRadius: 8, padding: "3px 8px", whiteSpace: "nowrap" }}>OUT 18 NOV</div>}
                  {hot && <div style={{ marginLeft: "auto", ...type.label, fontSize: 18, color: P.lime, background: P.ink, borderRadius: 8, padding: "3px 8px" }}>STAYS</div>}
                </div>
              );
            })}
            {t > C.weekly && (
              <div style={{ opacity: mix(pop(t, C.weekly, {})) }}>
                <div style={{ display: "flex", justifyContent: "space-between", ...type.label, fontSize: 17, color: P.ink3, marginBottom: 6 }}>
                  <span>WEEKLY LIMIT</span>
                  <span>ILLUSTRATIVE</span>
                </div>
                <div style={{ height: 20, borderRadius: 10, background: P.line, border: `3px solid ${P.ink}`, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${lerp(100, 38, eo(meter))}%`, background: P.lime }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {date > 0 && <DemoTag dark text={t > C.weekly ? "Google gives no number · meter is illustrative" : "Source: antigravity.google/docs/models · checked 15 Nov 2026"} style={{ left: t > C.weekly ? 320 : 240, top: 1082, opacity: mix(date) }} />}
      <Burst t={t} at={C.baaki} x={540} y={520} r={420} color={P.lime} />
      <Burst t={t} at={C.date} x={540} y={840} r={560} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 11. Final QC, by you

const CHECKS = ["AUDIO SYNC", "CAPTION ACCURACY", "FONT CLARITY", "CHARACTER CONSISTENCY", "FINAL RENDER"];

export const QcScene: React.FC<S> = ({ t }) => {
  if (t < C.haan - 0.1 || t > C.setupQ + 0.3) return null;
  const o = out(t, C.setupQ);
  const head = pop(t, C.haan, { damping: 9, stiffness: 220 });
  const panel = pop(t, C.haan + 0.15, { damping: 13, stiffness: 170 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={66} tone="ink" rotate={0}>
            FINAL QC MAT BHOOLNA!
          </Sticker>
        </div>
      )}
      {panel > 0 && (
        <div style={{ ...centre(540, lerp(1300, 810, eo(mix(panel))), 1, "rotate(0.6deg)") }}>
          <div style={{ width: 780, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "18px 24px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>QUALITY CHECK · BY YOU</div>
            {CHECKS.map((c, i) => {
              const k = pop(t, C.finalV + 0.1 + i * 0.42, { damping: 8, stiffness: 240 });
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 16, background: k > 0 ? P.limeWash : P.paper2, border: `4px solid ${P.ink}`, borderRadius: 16, padding: "8px 14px 10px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: k > 0 ? P.lime : P.card, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 32, color: P.ink }}>
                    <span style={{ transform: `scale(${k > 0 ? sc(k) : 0})`, display: "inline-block" }}>✓</span>
                  </div>
                  <div style={{ ...type.display, fontSize: 36, color: P.ink, whiteSpace: "nowrap" }}>{c}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 12. Poora setup chahiye? Comment EDIT (no DMs promised or shown)

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.setupQ - 0.1 || t > C.aisi + 0.3) return null;
  const o = out(t, C.aisi);
  const head = pop(t, C.setupQ, { damping: 10, stiffness: 210 });
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.editWord, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Poora <Lime>setup</Lime> chahiye?
        </div>
      )}
      {bubble > 0 && (
        <div style={{ ...centre(540, 790, sc(bubble), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 700, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "26px 30px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ ...type.label, fontSize: 36, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 210, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>EDIT</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 80, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      {big > 0 && (
        <div style={{ ...centre(560, 1055, mix(pop(t, C.editWord + 0.15, {})), "rotate(1.5deg)") }}>
          <Chip text="ANTIGRAVITY SETUP" size={40} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.editWord} x={540} y={800} r={460} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 13. Follow @internetoolbox

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
              <Sticker size={78} tone="ink" rotate={0}>
                KAAM KI AI TRICKS
              </Sticker>
            </div>
          )}
          {(["antigravity", "remotion", "gemini"] as const).map((a, i) => {
            const k = pop(t, C.tricks - 0.3 + i * 0.12, { damping: 10, stiffness: 230 });
            return (
              <div key={a} style={{ ...centre(290 + i * 250, 690, sc(k), `rotate(${(i - 1) * 5}deg)`) }}>
                <Tile app={a} size={160} />
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
