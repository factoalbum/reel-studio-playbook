import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Coin, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, PhoneShell } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C, gta6 as ep } from "../episodes/gta6";
import { Chip, mix, sc } from "../launch/kit";
import { AiClip, Card3D, EnergyLine, Streak } from "../fable/kit";
import { ClaudeSpark } from "../fable/logos";
import { PipeStep, Term } from "../fable52/kit";

/**
 * Creator Secrets: "GTA 6 ki reels banakar paise kamaane ka soch rahe ho?" → how these reels are made
 * (ChatGPT, Google AI Studio, Claude Code, Remotion) → the AI Reel Kit (link in bio). Times: src/episodes/gta6.ts.
 * Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, presenter below.
 * "GTA 6" is typeset in our own style: no Rockstar logo, artwork or footage. The night-drive clip is a code
 * illustration and is labelled. App logos are the official files from each brand's own site (public/gta6/logos,
 * public/fable/logos), never redrawn. The kit cover and the reel covers are the project's real files.
 */

type S = { t: number };
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.12 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.ruko, 0.05, 0.5) + push(C.date, 0.05, 0.7) + push(C.game, 0.08, 0.7) + push(C.taiyaar, 0.05, 0.6) + push(C.kit, 0.05, 0.6) + push(C.link, 0.06, 0.6);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.date, C.toh, C.claude, C.ab].map((at, i) => {
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
    <Streak t={t} at={C.ruko - 0.08} />
    <Streak t={t} at={C.game - 0.1} dur={0.45} />
    <Streak t={t} at={C.taiyaar - 0.1} />
    <Streak t={t} at={C.link - 0.1} />
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

export type AppKey = "chatgpt" | "aistudio" | "claude" | "remotion";
const APP: Record<AppKey, { name: string; bg: string; pad: number }> = {
  chatgpt: { name: "ChatGPT", bg: "#FFFFFF", pad: 0.1 },
  aistudio: { name: "Google AI Studio", bg: "#FFFFFF", pad: 0.14 },
  claude: { name: "Claude Code", bg: "#141413", pad: 0.2 },
  remotion: { name: "Remotion", bg: "#FFFFFF", pad: 0.2 },
};

/** An app tile with the brand's official logo file, shown flat and undistorted. */
export const AppTile: React.FC<{ app: AppKey; size: number; label?: boolean; glow?: number; style?: React.CSSProperties }> = ({ app, size, label = false, glow = 0, style }) => {
  const a = APP[app];
  const inner = size * (1 - a.pad * 2);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.1, ...style }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.24, background: a.bg, border: `${Math.max(4, size * 0.035)}px solid ${P.ink}`, boxShadow: `${shadow.hard(Math.max(5, size * 0.05))}${glow > 0 ? `, 0 0 ${size * 0.5 * glow}px ${P.lime}` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {app === "claude" ? (
          <ClaudeSpark size={inner} />
        ) : (
          <Img src={staticFile(`gta6/logos/${app === "chatgpt" ? "chatgpt.svg" : app === "aistudio" ? "aistudio.png" : "remotion.png"}`)} style={{ width: inner, height: inner, objectFit: "contain", display: "block" }} />
        )}
      </div>
      {label && <div style={{ ...type.display, fontSize: Math.max(22, size * 0.2), color: P.ink, whiteSpace: "nowrap" }}>{a.name}</div>}
    </div>
  );
};

/** Step header: number pill, official app tile(s) and the app name. */
const StepHead: React.FC<{ t: number; at: number; n: number; apps: AppKey[]; title: string }> = ({ t, at, n, apps, title }) => {
  const k = pop(t, at, { damping: 10, stiffness: 210 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, width: 870, top: 322, height: 140, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, transform: `translateY(${(1 - mix(k)) * -50}px)`, opacity: mix(k) }}>
      <div style={{ ...type.label, fontSize: apps.length > 1 ? 22 : 28, color: P.lime, background: P.ink, borderRadius: 999, padding: "10px 18px 11px", whiteSpace: "nowrap", flex: "0 0 auto", transform: `scale(${sc(k)})` }}>STEP {n}</div>
      {apps.map((a, i) => (
        <div key={a} style={{ transform: `scale(${sc(pop(t, at + 0.06 + i * 0.1, { damping: 9, stiffness: 230 }))}) rotate(${i ? 4 : -4}deg)` }}>
          <AppTile app={a} size={apps.length > 1 ? 92 : 112} />
        </div>
      ))}
      <div style={{ ...type.display, fontSize: title.length > 18 ? 40 : title.length > 14 ? 50 : 60, color: P.ink, whiteSpace: "nowrap" }}>{title}</div>
    </div>
  );
};

/** "GTA 6" set in our own type (no game logo): ink block, lime 6. */
const Gta: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ ...type.display, fontSize: size, lineHeight: 0.92, color: "#FAF9F5", background: P.ink, border: `${Math.round(size * 0.05)}px solid ${P.ink}`, borderRadius: size * 0.18, padding: `${size * 0.06}px ${size * 0.22}px ${size * 0.12}px`, boxShadow: `${Math.round(size * 0.07)}px ${Math.round(size * 0.07)}px 0 ${P.lime}`, whiteSpace: "nowrap", letterSpacing: "-0.04em" }}>
    GTA <span style={{ color: P.lime }}>6</span>
  </div>
);

// =================================================================================================================
// 1. Hook: GTA 6 reels = paisa? → ruko zara, sirf gameplay se kamaai nahi hoti

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.date + 0.3) return null;
  const o = leave(t, C.date);
  const paise = pop(t, C.paise, { damping: 9, stiffness: 230 });
  const stop = pop(t, C.ruko, { damping: 8, stiffness: 240 });
  const shift = eo(seg(t, C.ruko - 0.1, C.ruko + 0.25));
  const clip = pop(t, C.sirf, { damping: 12, stiffness: 170 });
  const no = pop(t, C.nahi, { damping: 8, stiffness: 250 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* headline, on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: lerp(385, 322, shift), display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${lerp(1, 0.62, shift)})`, transformOrigin: "540px 0" }}>
        <Slam t={t} at={-0.35}>
          <Gta size={190} />
        </Slam>
        <div style={{ ...type.display, fontSize: 92, color: P.ink, whiteSpace: "nowrap", opacity: 1 - shift }}>
          <Slam t={t} at={-0.2}>
            REELS = <Lime>PAISA?</Lime>
          </Slam>
        </div>
      </div>
      {/* coins rain while "paise kamaane" is said */}
      {paise > 0 &&
        shift < 1 &&
        Array.from({ length: 9 }, (_, i) => {
          const k = pop(t, C.paise + i * 0.07, { damping: 11, stiffness: 190 });
          const x = 150 + ((i * 197) % 800);
          const y = 760 + ((i * 131) % 330) + Math.sin(t * 3 + i) * 10;
          return (
            <div key={i} style={{ ...centre(x, y, sc(k) * (1 - shift), `rotate(${(i % 2 ? 1 : -1) * 12}deg)`), opacity: 1 - shift }}>
              <Coin size={84 + (i % 3) * 22} spin={Math.cos(t * 4 + i)} />
            </div>
          );
        })}
      {/* ruko zara */}
      {stop > 0 && (
        <div style={{ ...centre(540, 540, sc(stop), `rotate(${(1 - mix(stop)) * -12 - 2}deg)`), zIndex: 3 }}>
          <Sticker size={82} tone="ink" rotate={0}>
            BHAI, RUKO ZARA!
          </Sticker>
        </div>
      )}
      {/* a gameplay clip alone does not earn */}
      {clip > 0 && (
        <div style={{ ...centre(lerp(-300, 360, eo(mix(clip))), 860, 1, "rotate(-4deg)") }}>
          <div style={{ position: "relative", border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden", boxShadow: shadow.hard(9) }}>
            <AiClip kind="film" t={t} w={400} h={470} radius={0} />
            <div style={{ position: "absolute", left: 12, top: 12, ...type.label, fontSize: 20, color: "#fff", background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "4px 10px" }}>GAMEPLAY CLIP</div>
            {no > 0 && (
              <svg width={400} height={470} viewBox="0 0 400 470" style={{ position: "absolute", inset: 0 }}>
                <path d="M40 60 L360 410 M360 60 L40 410" stroke="#E0452B" strokeWidth={26} strokeLinecap="round" strokeDasharray={1000} strokeDashoffset={(1 - mix(no)) * 1000} />
              </svg>
            )}
          </div>
        </div>
      )}
      {clip > 0 && <DemoTag text="Illustration · not game footage" style={{ left: 190, top: 1108, opacity: mix(clip) }} />}
      {no > 0 && (
        <div style={{ ...centre(790, 800, sc(no), `rotate(${(1 - mix(no)) * 14 + 4}deg)`) }}>
          <div style={{ ...type.display, fontSize: 64, lineHeight: 1.02, color: P.ink, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, padding: "16px 24px 22px", boxShadow: shadow.hard(9), textAlign: "center" }}>
            SIRF
            <br />
            GAMEPLAY
            <br />
            <span style={{ color: "#E0452B" }}>≠ KAMAAI</span>
          </div>
        </div>
      )}
      <Burst t={t} at={C.ruko} x={540} y={540} r={420} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 2. 19 November: GTA 6 launches, and you are still scrolling

export const DateScene: React.FC<S> = ({ t }) => {
  if (t < C.date - 0.1 || t > C.toh + 0.3) return null;
  const o = leave(t, C.toh);
  const cal = pop(t, C.date, { damping: 10, stiffness: 190 });
  const launch = pop(t, C.launch, { damping: 8, stiffness: 240 });
  const away = eo(seg(t, C.aurTum - 0.15, C.aurTum + 0.25));
  const phone = pop(t, C.aurTum, { damping: 12, stiffness: 170 });
  const still = pop(t, C.scroll, { damping: 8, stiffness: 240 });
  const scrollY = ((t - C.aurTum) * 420) % 520;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {cal > 0 && (
        <div style={{ ...centre(lerp(540, 300, away), lerp(760, 700, away), sc(cal) * lerp(1, 0.62, away), `rotate(${lerp(-3, -7, away)}deg)`) }}>
          <Card3D k={cal} t={t} yaw={24}>
            <div style={{ width: 600, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 40, boxShadow: shadow.hard(12), overflow: "hidden" }}>
              <div style={{ background: P.ink, color: P.lime, ...type.label, fontSize: 44, textAlign: "center", padding: "18px 0 20px" }}>NOVEMBER 2026</div>
              <div style={{ ...type.display, fontSize: 330, lineHeight: 0.95, color: P.ink, textAlign: "center", letterSpacing: "-0.06em", padding: "10px 0 0" }}>19</div>
              <div style={{ ...type.label, fontSize: 30, color: P.ink3, textAlign: "center", padding: "0 0 26px" }}>THURSDAY</div>
            </div>
          </Card3D>
        </div>
      )}
      {launch > 0 && (
        <div style={{ ...centre(lerp(540, 300, away), lerp(395, 430, away), sc(launch) * lerp(1, 0.6, away), "rotate(-2deg)"), display: "flex", alignItems: "center", gap: 18, opacity: 1 - away }}>
          <Gta size={92} />
          <div style={{ ...type.display, fontSize: 76, color: P.ink, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 22, padding: "4px 22px 12px", boxShadow: shadow.hard(8) }}>LAUNCH</div>
        </div>
      )}
      {cal > 0 && away < 0.5 && <DemoTag text="Date announced by Rockstar Games · checked 14 Nov 2026" style={{ left: 215, top: 1105, opacity: mix(cal) * (1 - away * 2) }} />}
      {/* still scrolling */}
      {phone > 0 && (
        <div style={{ ...centre(lerp(1300, 760, eo(mix(phone))), 800, 1, "rotate(5deg)") }}>
          <PhoneShell w={330}>
            <div style={{ position: "relative", width: "100%", height: 600, overflow: "hidden", background: "#111" }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ position: "absolute", left: 0, top: i * 520 - scrollY - 260 }}>
                  <AiClip kind={(["city", "film", "character", "landscape"] as const)[i]} t={t + i} w={330} h={510} radius={0} hud={false} />
                </div>
              ))}
              <div style={{ position: "absolute", right: 12, bottom: 60, display: "flex", flexDirection: "column", gap: 16 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 38, height: 38, borderRadius: 99, background: "rgba(255,255,255,0.85)" }} />
                ))}
              </div>
            </div>
          </PhoneShell>
        </div>
      )}
      {still > 0 && (
        <div style={{ ...centre(540, 400, sc(still), `rotate(${(1 - mix(still)) * 10 - 2}deg)`), zIndex: 3 }}>
          <Sticker size={74} tone="ink" rotate={0}>
            ABHI BHI SCROLLING?
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.launch} x={540} y={395} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 3. Dekho, main apni AI reels kaise banata hoon: the four tools in a row

const ROW: AppKey[] = ["chatgpt", "aistudio", "claude", "remotion"];

export const IntroScene: React.FC<S> = ({ t }) => {
  if (t < C.toh - 0.1 || t > C.sabse + 0.3) return null;
  const o = leave(t, C.sabse);
  const head = pop(t, C.toh, { damping: 10, stiffness: 210 });
  const sub = pop(t, C.main, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 380, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={76} tone="ink" rotate={0}>
            MERI AI REELS
          </Sticker>
        </div>
      )}
      {sub > 0 && (
        <div style={{ ...centre(540, 500, sc(sub)), ...type.display, fontSize: 68, color: P.ink, whiteSpace: "nowrap" }}>
          aise <Lime>banti hain</Lime>
        </div>
      )}
      <EnergyLine from={[190, 800]} to={[890, 800]} k={seg(t, C.main + 0.2, C.kaise + 0.4)} t={t} width={10} />
      {ROW.map((a, i) => {
        const k = pop(t, C.main + 0.15 + i * 0.22, { damping: 9, stiffness: 220 });
        if (k <= 0) return null;
        return (
          <div key={a} style={{ ...centre(190 + i * 233, 800 + Math.sin(t * 2.2 + i) * 8, sc(k), `rotate(${(i % 2 ? 1 : -1) * 4}deg)`) }}>
            <AppTile app={a} size={170} glow={0.4} />
          </div>
        );
      })}
      {ROW.map((a, i) => {
        const k = pop(t, C.main + 0.3 + i * 0.22, { damping: 11, stiffness: 220 });
        return (
          <div key={a} style={{ ...centre(190 + i * 233, 945, mix(k)), ...type.label, fontSize: 21, letterSpacing: "0.02em", color: P.ink, whiteSpace: "nowrap", opacity: mix(k) }}>
            {APP[a].name}
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 4. Step 1: ChatGPT → hook and script

const HOOK_LINE = "GTA 6 ki reels banakar paise kamaane ka soch rahe ho?";

export const ChatScene: React.FC<S> = ({ t }) => {
  if (t < C.sabse - 0.1 || t > C.phir + 0.3) return null;
  const o = leave(t, C.phir);
  const win = pop(t, C.sabse + 0.1, { damping: 13, stiffness: 170 });
  const n = Math.floor(seg(t, C.chatgpt + 0.5, C.hook + 0.3) * HOOK_LINE.length);
  const hook = pop(t, C.hook, { damping: 8, stiffness: 240 });
  const script = pop(t, C.script, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.sabse} n={1} apps={["chatgpt"]} title="ChatGPT" />
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1300, 770, eo(mix(win))), 1, "rotate(-1deg)") }}>
          <div style={{ width: 800, background: "#FFFFFF", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ alignSelf: "flex-end", maxWidth: 560, background: "#F0EEE6", borderRadius: 24, padding: "14px 22px", ...type.body, fontWeight: 600, fontSize: 32, color: "#141413" }}>Reel ke liye damdaar hook aur script likho</div>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <Img src={staticFile("gta6/logos/chatgpt.svg")} style={{ width: 52, height: 52, flex: "0 0 auto" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>HOOK</div>
                <div style={{ ...type.display, fontSize: 40, lineHeight: 1.15, color: "#141413", minHeight: 96, background: hook > 0 ? P.limeWash : "transparent", borderRadius: 12, padding: "2px 6px" }}>
                  {HOOK_LINE.slice(0, n)}
                  {n < HOOK_LINE.length && t > C.chatgpt + 0.5 && <span style={{ display: "inline-block", width: 4, height: "0.9em", background: "#141413", verticalAlign: "-0.1em", opacity: Math.floor(t * 6) % 2 ? 1 : 0 }} />}
                </div>
                <div style={{ ...type.label, fontSize: 20, color: P.ink3, opacity: mix(script) }}>SCRIPT</div>
                {[0.95, 0.8, 0.88].map((w, i) => (
                  <div key={i} style={{ height: 16, borderRadius: 8, background: "#E3E0D6", width: `${w * 100 * eo(seg(t, C.script + i * 0.08, C.script + 0.25 + i * 0.08))}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {win > 0 && <DemoTag text="Illustrative chat · the hook is this reel's real first line" style={{ left: 205, top: 1100, opacity: mix(win) }} />}
      {hook > 0 && (
        <div style={{ ...centre(820, 560, sc(hook), `rotate(${(1 - mix(hook)) * 14 + 5}deg)`), zIndex: 3 }}>
          <Sticker size={60} tone="lime" rotate={0}>
            HOOK ✓
          </Sticker>
        </div>
      )}
      {script > 0 && (
        <div style={{ ...centre(830, 1010, sc(script), `rotate(${(1 - mix(script)) * -14 - 4}deg)`), zIndex: 3 }}>
          <Sticker size={60} tone="ink" rotate={0}>
            SCRIPT ✓
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. Step 2: Google AI Studio → voiceover (the bars are this reel's real voice level)

export const VoiceScene: React.FC<S> = ({ t }) => {
  if (t < C.phir - 0.1 || t > C.aurAb + 0.3) return null;
  const o = leave(t, C.aurAb);
  const card = pop(t, C.phir + 0.1, { damping: 13, stiffness: 170 });
  const vo = pop(t, C.voiceover, { damping: 8, stiffness: 240 });
  const f = Math.round(t * 30);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.phir} n={2} apps={["aistudio"]} title="Google AI Studio" />
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1300, 770, eo(mix(card))), 1, "rotate(1deg)") }}>
          <div style={{ width: 800, background: "#141413", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: `${shadow.hard(10)}, 0 0 60px rgba(200,241,105,0.35)`, padding: "26px 30px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 99, background: P.lime, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={22} height={24} viewBox="0 0 10 10">
                  <path d="M2 1 L9 5 L2 9 Z" fill={P.ink} />
                </svg>
              </div>
              <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 26, color: "#F4F2EA" }}>voice.wav</div>
              <div style={{ marginLeft: "auto", fontFamily: mono, fontSize: 22, color: "#9C998F" }}>{`0:${String(Math.min(53, Math.floor(t))).padStart(2, "0")} / 0:53`}</div>
            </div>
            <div style={{ height: 210, display: "flex", alignItems: "center", gap: 6 }}>
              {Array.from({ length: 56 }, (_, i) => {
                const v = ep.env[Math.max(0, Math.min(ep.env.length - 1, f - 55 + i))] ?? 0;
                const h = 10 + Math.min(1, v * 1.5) * 195;
                return <div key={i} style={{ flex: 1, height: h, borderRadius: 6, background: i > 50 ? P.lime : i % 7 === 0 ? "#DDFB8E" : "#8FBF2E", opacity: 0.45 + 0.55 * (i / 56) }} />;
              })}
            </div>
          </div>
        </div>
      )}
      {card > 0 && <DemoTag text="Illustration · bars follow this reel's real voice track" style={{ left: 225, top: 1000, opacity: mix(card) }} />}
      {vo > 0 && (
        <div style={{ ...centre(540, 1085, sc(vo), "rotate(-2deg)") }}>
          <Sticker size={66} tone="lime" rotate={0}>
            VOICEOVER ✓
          </Sticker>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 6. Aur ab asli game shuru

export const GameOnScene: React.FC<S> = ({ t }) => {
  if (t < C.aurAb - 0.1 || t > C.claude + 0.3) return null;
  const o = leave(t, C.claude);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ ...type.display, fontSize: 90, color: P.ink }}>
          <Slam t={t} at={C.aurAb}>
            AUR AB
          </Slam>
        </div>
        <div style={{ ...type.display, fontSize: 170, lineHeight: 0.95, color: P.ink, letterSpacing: "-0.05em", textShadow: `8px 8px 0 ${P.lime}` }}>
          <Slam t={t} at={C.asli}>
            ASLI GAME
          </Slam>
        </div>
        <div style={{ transform: "rotate(-3deg)" }}>
          <Slam t={t} at={C.shuru}>
            <div style={{ ...type.display, fontSize: 180, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 34, padding: "4px 40px 18px", boxShadow: shadow.hard(12), letterSpacing: "-0.05em" }}>SHURU!</div>
          </Slam>
        </div>
      </div>
      <Burst t={t} at={C.shuru} x={540} y={900} r={520} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 7. Step 3: Claude Code + Remotion → animation, captions, the finished reel

const REAL = ["mdh", "claude", "ebay"];

export const BuildScene: React.FC<S> = ({ t }) => {
  if (t < C.claude - 0.1 || t > C.bina + 0.3) return null;
  const o = leave(t, C.bina);
  const term = pop(t, C.claude + 0.15, { damping: 13, stiffness: 170 });
  const steps: [string, number][] = [
    ["ANIMATION", C.anim],
    ["CAPTIONS", C.captions],
    ["REEL READY", C.taiyaar],
  ];
  const ready = pop(t, C.taiyaar, { damping: 9, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.claude} n={3} apps={["claude", "remotion"]} title="Claude Code + Remotion" />
      {term > 0 && (
        <div style={{ ...centre(430, lerp(1300, 640, eo(mix(term))), 1, "rotate(-1deg)") }}>
          <Term
            t={t}
            w={640}
            fs={26}
            minH={210}
            title="reel-01 · claude"
            lines={[
              { text: "claude", at: C.claude + 0.2, to: C.claude + 0.5, tone: "cmd" },
              { text: "✻ Claude Code", at: C.claude + 0.55, tone: "clay" },
              { text: "is voice se reel banao", at: C.remotion, to: C.anim, tone: "you" },
              { text: "animation: 11 scenes", at: C.anim + 0.25, tone: "ok" },
              { text: "captions: word by word", at: C.captions + 0.25, tone: "ok" },
              { text: "npx remotion render → reel.mp4", at: C.poori, tone: "ok" },
            ]}
          />
        </div>
      )}
      {REAL.map((r, i) => {
        const k = pop(t, C.poori + i * 0.14, { damping: 10, stiffness: 200 });
        if (k <= 0) return null;
        return (
          <div key={r} style={{ ...centre(808 + i * 52, 600 + i * 24, sc(k), `rotate(${-9 + i * 8}deg)`), zIndex: 4 }}>
            <Img src={staticFile(`fable52/real-${r}.jpg`)} style={{ width: 116, height: 206, objectFit: "cover", borderRadius: 12, border: `4px solid ${P.ink}`, boxShadow: shadow.hard(5), display: "block" }} />
          </div>
        );
      })}
      {t > C.poori && <DemoTag text="Real reel covers" style={{ left: 752, top: 756, opacity: mix(pop(t, C.poori, {})), zIndex: 5 }} />}
      <div style={{ position: "absolute", left: 110, width: 860, top: 880, display: "flex", gap: 14 }}>
        {steps.map(([s, at], i) => (
          <PipeStep key={s} label={s} n={i + 1} k={seg(t, at, at + 0.2)} hot={i === 2 ? t >= at : t >= at && t < steps[i + 1][1]} w={(860 - 28) / 3} />
        ))}
      </div>
      {ready > 0 && (
        <div style={{ ...centre(540, 1060, sc(ready), "rotate(-2deg)") }}>
          <Sticker size={64} tone="lime" rotate={0}>
            POORI REEL TAIYAAR!
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.taiyaar} x={540} y={1050} r={420} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 8. No hours of manual timeline editing (and the honest part: you still check it yourself)

export const TimelineScene: React.FC<S> = ({ t }) => {
  if (t < C.bina - 0.1 || t > C.ab + 0.3) return null;
  const o = leave(t, C.ab);
  const tl = pop(t, C.bina, { damping: 13, stiffness: 170 });
  const cross = eo(seg(t, C.editing - 0.1, C.editing + 0.3));
  const head = pop(t, C.ghanton, { damping: 9, stiffness: 220 });
  const haan = pop(t, C.haan, { damping: 9, stiffness: 220 });
  const tracks = [P.lime, "#F28A3C", P.pink, P.gold];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={62} tone="ink" rotate={0}>
            NO MANUAL TIMELINE EDITING
          </Sticker>
        </div>
      )}
      {tl > 0 && (
        <div style={{ ...centre(540, lerp(1300, 730, eo(mix(tl))), 1 - 0.18 * mix(haan), "rotate(1deg)"), opacity: 1 - 0.45 * mix(haan) }}>
          <div style={{ position: "relative", width: 840, background: "#1F1E1D", border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(10), padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 20, color: "#9C998F" }}>
              <span>TIMELINE</span>
              <span>02:47:13</span>
            </div>
            {tracks.map((c, r) => (
              <div key={r} style={{ position: "relative", height: 62, background: "#2C2B28", borderRadius: 10, overflow: "hidden" }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const x = ((i * 137 + r * 61) % 760) + Math.sin(t * 2 + i + r) * 6;
                  return <div key={i} style={{ position: "absolute", left: x, top: 8, width: 50 + ((i * 29 + r * 13) % 70), height: 46, borderRadius: 8, background: c, opacity: 0.85, border: "2px solid #141413" }} />;
                })}
              </div>
            ))}
            <div style={{ position: "absolute", left: 60 + ((t * 120) % 700), top: 50, width: 4, height: 300, background: "#fff" }} />
            <svg width={840} height={360} viewBox="0 0 840 360" style={{ position: "absolute", left: 0, top: 0 }}>
              <path d="M60 40 L780 320 M780 40 L60 320" stroke="#E0452B" strokeWidth={30} strokeLinecap="round" strokeDasharray={1600} strokeDashoffset={(1 - cross) * 1600} />
            </svg>
          </div>
        </div>
      )}
      {tl > 0 && <DemoTag text="Illustration" style={{ left: 130, top: 945, opacity: mix(tl) * (1 - mix(haan)) }} />}
      {haan > 0 && (
        <div style={{ ...centre(540, 1040, sc(haan), "rotate(-1.5deg)"), zIndex: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(9), padding: "16px 26px 20px" }}>
            <div style={{ width: 62, height: 62, borderRadius: 16, background: P.lime, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 42, color: P.ink }}>✓</div>
            <div style={{ ...type.display, fontSize: 54, color: P.ink, whiteSpace: "nowrap" }}>{ep.checkLine}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 9. The kit: real cover, real contents, real price and address

export const KitScene: React.FC<S> = ({ t }) => {
  if (t < C.ab - 0.1 || t > C.poora + 0.3) return null;
  const o = leave(t, C.poora);
  const head = pop(t, C.ab + 0.05, { damping: 10, stiffness: 210 });
  const headOut = eo(seg(t, C.meri - 0.15, C.meri + 0.05));
  const cover = pop(t, C.meri, { damping: 12, stiffness: 160 });
  const name = pop(t, C.kit, { damping: 9, stiffness: 230 });
  const a = pop(t, C.ready, { damping: 10, stiffness: 220 });
  const b = pop(t, C.chhe, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && headOut < 1 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 1 - headOut }}>
          <div style={{ ...type.display, fontSize: 84, color: P.ink, transform: `scale(${sc(head)})` }}>Tum bhi aisi</div>
          <div style={{ ...type.display, fontSize: 104, color: P.ink, transform: `scale(${sc(pop(t, C.animated, { damping: 9, stiffness: 230 }))})` }}>
            <Lime>ANIMATED REELS</Lime>
          </div>
          <div style={{ ...type.display, fontSize: 84, color: P.ink, transform: `scale(${sc(pop(t, C.chahte, { damping: 10, stiffness: 220 }))})` }}>banana chahte ho?</div>
        </div>
      )}
      {name > 0 && (
        <div style={{ ...centre(540, 392, sc(name), "rotate(-1.5deg)") }}>
          <Sticker size={78} tone="ink" rotate={0}>
            AI REEL KIT
          </Sticker>
        </div>
      )}
      {cover > 0 && (
        <div style={{ ...centre(lerp(-300, 330, eo(mix(cover))), 800) }}>
          <Card3D k={cover} t={t} yaw={28}>
            <Img src={staticFile("fable52/kit-cover.png")} style={{ width: 400, height: 566, display: "block", borderRadius: 18, border: `6px solid ${P.ink}`, boxShadow: `${shadow.hard(10)}, 0 0 50px rgba(200,241,105,0.7)` }} />
          </Card3D>
        </div>
      )}
      {cover > 0 && <DemoTag text="Real guide cover" style={{ left: 230, top: 1100, opacity: mix(cover) }} />}
      {a > 0 && (
        <div style={{ ...centre(770, 620, sc(a), `rotate(${(1 - mix(a)) * 12 + 2}deg)`) }}>
          <div style={{ width: 360, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "16px 20px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <svg width={70} height={60} viewBox="0 0 54 46" style={{ flex: "0 0 auto" }}>
              <path d="M3 8 h18 l6 7 h24 v26 h-48z" fill={P.lime} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
              <path d="M3 41 l8 -20 h45 l-3 20z" fill={P.limeDeep} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            </svg>
            <div style={{ ...type.display, fontSize: 34, lineHeight: 1.08, color: P.ink }}>
              Ready-made
              <br />
              Claude Code folder
            </div>
          </div>
        </div>
      )}
      {b > 0 && (
        <div style={{ ...centre(770, 830, sc(b), `rotate(${(1 - mix(b)) * -12 - 2}deg)`) }}>
          <div style={{ width: 360, background: P.lime, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "14px 20px 20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ ...type.display, fontSize: 110, lineHeight: 0.9, color: P.ink, letterSpacing: "-0.05em" }}>6</div>
            <div style={{ ...type.display, fontSize: 34, lineHeight: 1.08, color: P.ink }}>
              copy-paste
              <br />
              prompts
            </div>
          </div>
        </div>
      )}
      {b > 0 && (
        <div style={{ ...centre(760, 1010, sc(pop(t, C.prompts + 0.3, { damping: 10, stiffness: 220 }))) }}>
          <Chip text="₹49 · needs a paid Claude plan" size={23} tone="card" />
        </div>
      )}
      <Burst t={t} at={C.kit} x={540} y={392} r={340} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 10. Link in bio + comment GTA (no fake comments, no DMs)

export const LinkScene: React.FC<S> = ({ t }) => {
  if (t < C.poora - 0.1 || t > C.aur + 0.3) return null;
  const o = leave(t, C.aur);
  const head = pop(t, C.poora, { damping: 10, stiffness: 210 });
  const link = pop(t, C.link, { damping: 8, stiffness: 240 });
  const up = eo(seg(t, C.comment - 0.2, C.comment + 0.15));
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.gtaWord, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && up < 1 && (
        <div style={{ ...centre(540, 395, sc(head)), ...type.display, fontSize: 76, color: P.ink, whiteSpace: "nowrap", opacity: 1 - up }}>
          Poora <Lime>setup</Lime> chahiye?
        </div>
      )}
      {link > 0 && (
        <div style={{ ...centre(540, lerp(760, 440, up), sc(link) * lerp(1, 0.55, up), `rotate(${(1 - mix(link)) * 8 - 2}deg)`) }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: P.ink, border: `7px solid ${P.ink}`, borderRadius: 40, boxShadow: `12px 12px 0 ${P.lime}`, padding: "30px 44px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <svg width={96} height={96} viewBox="0 0 48 48" fill="none" stroke={P.lime} strokeWidth={5.5} strokeLinecap="round">
                <path d="M20 28a8 8 0 0 0 11.3 0l7-7A8 8 0 0 0 27 9.700l-3 3" />
                <path d="M28 20a8 8 0 0 0-11.3 0l-7 7A8 8 0 0 0 21 38.300l3-3" />
              </svg>
              <div style={{ ...type.display, fontSize: 130, lineHeight: 0.95, color: P.lime, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>LINK IN BIO</div>
            </div>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 34, color: "#F4F2EA", whiteSpace: "nowrap" }}>internetoolbox.com/ai-reel-kit</div>
          </div>
        </div>
      )}
      {bubble > 0 && (
        <div style={{ ...centre(540, 840, sc(bubble), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 640, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "26px 30px 34px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ ...type.label, fontSize: 34, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 200, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>GTA</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 70, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      <Burst t={t} at={C.link} x={540} y={760} r={480} color={P.lime} />
      <Burst t={t} at={C.gtaWord} x={540} y={840} r={440} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 11. Follow @internetoolbox

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.aur - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.aur + 0.05, { damping: 10, stiffness: 210 });
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
          {ROW.map((a, i) => {
            const k = pop(t, C.tricks - 0.3 + i * 0.12, { damping: 10, stiffness: 230 });
            return (
              <div key={a} style={{ ...centre(225 + i * 210, 660, sc(k), `rotate(${(i % 2 ? 1 : -1) * 5}deg)`) }}>
                <AppTile app={a} size={130} />
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
