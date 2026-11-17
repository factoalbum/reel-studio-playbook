import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Sparks } from "../bonus/kit";
import { centre, DemoTag, PhoneShell } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C, tokens as ep } from "../episodes/tokens";
import { Chip, mix, sc } from "../launch/kit";
import { BrowserWin, EnergyLine, Streak } from "../fable/kit";
import { Caret, Lime, RED, Slam, Stage, typed } from "../agent/Scenes";

/**
 * Creator Secrets: FreeLLMAPI. "Claude Code free mein?" → not a trial → way 1 Antigravity (last reel) → way 2
 * FreeLLMAPI (MIT) → one endpoint over many free tiers → the numbers (updated on screen) → tokens = data pack →
 * hand and brain → free models → same agent, new brain → one dashboard → failover → quota → other agents → build →
 * the honest note → comment / type TOKENS. Times: src/episodes/tokens.ts.
 * Bands: brand bug ~258, headlines 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, presenter below.
 * Logos (public/tokens/logos, never redrawn): FreeLLMAPI = freellmapi.co/favicon.svg; Claude Code, Codex, Cursor,
 * OpenCode, Qwen, DeepSeek and GitHub = @lobehub/icons-static-svg 1.103.0 (the brands' marks); Gemini and
 * Antigravity = the files the Antigravity reel used. Dashboard pictures = the project's README screenshots, labelled.
 */

type S = { t: number };
const out = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));
const DARK = "#141413";
const MINT = "#10B981";

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.1 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.free, 0.06, 0.7) + push(C.fllm, 0.06, 0.8) + push(C.n74, 0.05, 0.8) + push(C.game, 0.06, 0.6) + push(C.router + 1.0, 0.04, 0.5) + push(C.tokensWord, 0.06, 0.6);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.aur, C.one, C.ye, C.tokens, C.models, C.multi, C.jitne, C.apps, C.setupQ].map((at, i) => {
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
    <Streak t={t} at={C.two - 0.08} dur={0.45} />
    <Streak t={t} at={C.n74 - 0.1} dur={0.45} />
    <Streak t={t} at={C.sirf - 0.08} dur={0.4} />
    <Streak t={t} at={C.tokensWord - 0.08} />
  </>
);

// =================================================================================================================
// Logos

export type App = "claudecode" | "codex" | "cursor" | "opencode" | "qwen" | "deepseek" | "gemini" | "antigravity" | "fllm" | "github";
const SRC: Record<App, string> = {
  claudecode: "tokens/logos/claudecode-color.svg",
  codex: "tokens/logos/codex-color.svg",
  cursor: "tokens/logos/cursor.svg",
  opencode: "tokens/logos/opencode.svg",
  qwen: "tokens/logos/qwen-color.svg",
  deepseek: "tokens/logos/deepseek-color.svg",
  gemini: "anti/logos/gemini.png",
  antigravity: "anti/logos/antigravity.png",
  fllm: "tokens/logos/freellmapi.svg",
  github: "tokens/logos/github.svg",
};
export const NAME: Record<App, string> = {
  claudecode: "Claude Code",
  codex: "Codex",
  cursor: "Cursor",
  opencode: "OpenCode",
  qwen: "Qwen",
  deepseek: "DeepSeek",
  gemini: "Gemini",
  antigravity: "Antigravity",
  fllm: "FreeLLMAPI",
  github: "GitHub",
};
const FILL: Partial<Record<App, number>> = { antigravity: 0.86, fllm: 1, codex: 0.7 };

/** An official logo file on a white tile, flat and undistorted. FreeLLMAPI's mark is its own dark tile. */
export const Tile: React.FC<{ app: App; size: number; glow?: number; label?: boolean }> = ({ app, size, glow = 0, label = false }) => {
  const own = app === "fllm";
  const f = FILL[app] ?? 0.62;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.08 }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.24, background: own ? "#171717" : "#FFFFFF", border: `${Math.max(4, size * 0.035)}px solid ${P.ink}`, boxShadow: `${shadow.hard(Math.max(5, size * 0.05))}${glow > 0 ? `, 0 0 ${size * 0.5 * glow}px ${P.lime}` : ""}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxSizing: "border-box" }}>
        <Img src={staticFile(SRC[app])} style={{ width: size * f, height: size * f, objectFit: "contain", display: "block" }} />
      </div>
      {label && <div style={{ ...type.display, fontSize: Math.max(24, size * 0.2), color: P.ink, whiteSpace: "nowrap", background: P.card, border: `3px solid ${P.ink}`, borderRadius: 12, padding: "2px 12px 5px" }}>{NAME[app]}</div>}
    </div>
  );
};

/** The FreeLLMAPI name as the project writes it, next to its mark. */
const FllmName: React.FC<{ size: number; dark?: boolean }> = ({ size, dark = false }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
    <Img src={staticFile(SRC.fllm)} style={{ width: size * 1.1, height: size * 1.1, display: "block" }} />
    <div style={{ ...type.display, fontSize: size, lineHeight: 1, color: dark ? "#FAF9F5" : P.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>FreeLLMAPI</div>
  </div>
);

/** Brain bubble (our own drawing) with a model's logo inside. */
const Brain: React.FC<{ size: number; app?: App; label?: string; hot?: boolean }> = ({ size, app, label, hot }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ position: "relative", width: size, height: size * 0.82 }}>
      <svg width={size} height={size * 0.82} viewBox="0 0 100 82" style={{ position: "absolute", inset: 0 }}>
        <path d="M50 6 C38 -2 22 4 22 16 C8 16 2 30 8 40 C0 50 6 66 20 66 C24 78 42 82 50 72 C58 82 76 78 80 66 C94 66 100 50 92 40 C98 30 92 16 78 16 C78 4 62 -2 50 6 Z" fill={hot ? P.lime : "#F4B9C6"} stroke={P.ink} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M50 8 V72 M30 30 C38 32 40 40 36 46 M70 30 C62 32 60 40 64 46" fill="none" stroke={P.ink} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
      </svg>
      {app && (
        <div style={{ position: "absolute", left: "50%", top: "48%", transform: "translate(-50%,-50%)" }}>
          <Tile app={app} size={size * 0.42} />
        </div>
      )}
    </div>
    {label && <div style={{ ...type.label, fontSize: Math.max(18, size * 0.075), color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "4px 12px", whiteSpace: "nowrap" }}>{label}</div>}
  </div>
);

/** A hand (our own drawing) for "Claude Code = haath". */
const Hand: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w} viewBox="0 0 60 60">
    <path d="M18 56 C10 50 8 42 8 34 L8 24 C8 21 13 21 13 24 L13 31 L15 31 L15 12 C15 9 20 9 20 12 L20 29 L22 29 L22 8 C22 5 27 5 27 8 L27 29 L29 29 L29 11 C29 8 34 8 34 11 L34 31 L36 31 L36 18 C36 15 41 15 41 18 L41 40 C41 48 36 56 28 56 Z" fill="#F2C9A0" stroke={P.ink} strokeWidth={2.6} strokeLinejoin="round" />
  </svg>
);

// =================================================================================================================
// 1. Hook: Claude Code, free? Open-sourced. End tak dekho.

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.aur + 0.3) return null;
  const o = out(t, C.aur);
  const tile = pop(t, C.claude, { damping: 9, stiffness: 220 });
  const zero = pop(t, C.free, { damping: 8, stiffness: 240 });
  const open = pop(t, C.open, { damping: 8, stiffness: 240 });
  const end = pop(t, C.end, { damping: 9, stiffness: 230 });
  const shake = t > C.free && t < C.free + 0.35 ? Math.sin(t * 90) * 9 * (1 - (t - C.free) / 0.35) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${shake}px)` }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ ...type.display, fontSize: 112, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>
          <Slam t={t} at={-0.3}>
            CLAUDE CODE
          </Slam>
        </div>
        {zero > 0 && (
          <div style={{ ...type.display, fontSize: 104, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 28, padding: "4px 30px 14px", boxShadow: shadow.hard(10), letterSpacing: "-0.04em", whiteSpace: "nowrap", transform: `scale(${sc(zero)}) rotate(-2deg)` }}>FREE MEIN?!</div>
        )}
      </div>
      <div style={{ ...centre(lerp(540, 380, eo(mix(open))), 800 + Math.sin(t * 2.4) * 6, sc(tile) || (t < C.claude ? 0 : 1), "rotate(-3deg)") }}>
        <Tile app="claudecode" size={300} glow={0.5} />
      </div>
      {open > 0 && (
        <div style={{ ...centre(790, 760, sc(open), "rotate(4deg)") }}>
          <div style={{ width: 340, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(9), padding: "18px 20px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Img src={staticFile(SRC.github)} style={{ width: 110, height: 110 }} />
            <div style={{ ...type.display, fontSize: 46, color: P.ink, whiteSpace: "nowrap" }}>OPEN-SOURCE</div>
          </div>
        </div>
      )}
      {end > 0 && (
        <div style={{ ...centre(540, 1040, sc(end), `rotate(${(1 - mix(end)) * 10 - 2}deg)`), zIndex: 3 }}>
          <Sticker size={64} tone="ink" rotate={0}>
            END TAK DEKHO!
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.free} x={540} y={420} r={460} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 2. Not one model's free trial

export const TrialScene: React.FC<S> = ({ t }) => {
  if (t < C.aur - 0.1 || t > C.one + 0.3) return null;
  const o = out(t, C.one);
  const head = pop(t, C.aur, { damping: 10, stiffness: 210 });
  const card = pop(t, C.aur + 0.25, { damping: 11, stiffness: 190 });
  const x = pop(t, C.nahi, { damping: 7, stiffness: 260 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)), ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap" }}>
          Ek model ka <Lime>trial?</Lime>
        </div>
      )}
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1200, 770, eo(mix(card))), 1, "rotate(-2deg)") }}>
          <div style={{ width: 620, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "24px 30px 30px", display: "flex", flexDirection: "column", gap: 12, opacity: x > 0 ? 0.55 : 1 }}>
            <div style={{ ...type.label, fontSize: 24, color: P.ink3 }}>ONE MODEL</div>
            <div style={{ ...type.display, fontSize: 84, lineHeight: 1, color: P.ink }}>FREE TRIAL</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, height: 22, borderRadius: 11, background: P.line, border: `3px solid ${P.ink}`, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${lerp(100, 12, eo(seg(t, C.aur + 0.4, C.nahi)))}%`, background: RED }} />
              </div>
              <div style={{ ...type.label, fontSize: 22, color: P.ink }}>7 DAYS</div>
            </div>
          </div>
        </div>
      )}
      {x > 0 && (
        <div style={{ ...centre(540, 780, sc(x), "rotate(-8deg)"), zIndex: 3 }}>
          <div style={{ ...type.display, fontSize: 130, color: "#fff", background: RED, border: `7px solid ${P.ink}`, borderRadius: 28, padding: "0 40px 14px", boxShadow: shadow.hard(10), whiteSpace: "nowrap" }}>NAHI!</div>
        </div>
      )}
      {card > 0 && <DemoTag text="Illustration · a typical trial" style={{ left: 400, top: 1100, opacity: mix(card) }} />}
      <Burst t={t} at={C.nahi} x={540} y={780} r={420} color={RED} />
    </div>
  );
};

// =================================================================================================================
// 3 + 4. Way 1: Google Antigravity (our last reel) → Way 2: FreeLLMAPI

const WayPill: React.FC<{ n: number; k: number }> = ({ n, k }) => (
  <div style={{ ...type.label, fontSize: 32, color: P.lime, background: P.ink, borderRadius: 999, padding: "10px 26px 11px", whiteSpace: "nowrap", transform: `scale(${sc(k)})` }}>TAREEKA #{n}</div>
);

export const WaysScene: React.FC<S> = ({ t }) => {
  if (t < C.one - 0.1 || t > C.fllm2 + 0.3) return null;
  const o = out(t, C.fllm2);
  const p1 = pop(t, C.one, { damping: 10, stiffness: 220 });
  const cover = pop(t, C.pichhli, { damping: 11, stiffness: 190 });
  const ag = pop(t, C.google, { damping: 8, stiffness: 230 });
  const two = eo(seg(t, C.two - 0.15, C.two + 0.2));
  const p2 = pop(t, C.two, { damping: 9, stiffness: 230 });
  const fl = pop(t, C.fllm, { damping: 8, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* way 1 */}
      {two < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - two, transform: `translateX(${-two * 300}px)` }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {p1 > 0 && <WayPill n={1} k={p1} />}
            {ag > 0 && <div style={{ ...type.display, fontSize: 96, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em", transform: `scale(${sc(ag)})`, whiteSpace: "nowrap" }}>GOOGLE ANTIGRAVITY</div>}
          </div>
          {cover > 0 && (
            <div style={{ ...centre(330, 790, sc(cover), "rotate(-5deg)") }}>
              <Img src={staticFile("tokens/prev-anti.png")} style={{ width: 300, height: 533, objectFit: "cover", borderRadius: 26, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(10), display: "block" }} />
            </div>
          )}
          {cover > 0 && (
            <div style={{ ...centre(330, 1085, mix(cover), "rotate(-3deg)") }}>
              <Chip text="PICHHLI REEL" size={30} tone="ink" />
            </div>
          )}
          {ag > 0 && (
            <div style={{ ...centre(760, 780 + Math.sin(t * 2.4) * 6, sc(ag), "rotate(4deg)") }}>
              <Tile app="antigravity" size={300} glow={0.5} />
            </div>
          )}
          <Burst t={t} at={C.google} x={760} y={780} r={380} color={P.lime} />
        </div>
      )}
      {/* way 2 */}
      {two > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: two, transform: `translateX(${(1 - two) * 300}px)` }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 322, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {p2 > 0 && <WayPill n={2} k={p2} />}
          </div>
          {fl > 0 && (
            <div style={{ ...centre(540, 720, sc(fl)) }}>
              <div style={{ position: "relative", width: 360, height: 360, borderRadius: 86, background: "#171717", border: `8px solid ${P.ink}`, boxShadow: `${shadow.hard(12)}, 0 0 120px rgba(16,185,129,0.55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Img src={staticFile(SRC.fllm)} style={{ width: 340, height: 340 }} />
              </div>
            </div>
          )}
          {fl > 0 && (
            <div style={{ ...centre(540, 1000, sc(pop(t, C.fllm + 0.15, { damping: 9, stiffness: 230 }))), ...type.display, fontSize: 128, lineHeight: 1, color: P.ink, letterSpacing: "-0.05em", whiteSpace: "nowrap", textShadow: `8px 8px 0 ${P.lime}` }}>FreeLLMAPI</div>
          )}
          <Burst t={t} at={C.fllm} x={540} y={720} r={520} color={MINT} />
          <Sparks t={t} at={C.fllm} x={540} y={720} n={12} r={320} />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. MIT licence, open source (a GitHub-style repo card, our own drawing with the real repo name)

export const MitScene: React.FC<S> = ({ t }) => {
  if (t < C.fllm2 - 0.1 || t > C.ye + 0.3) return null;
  const o = out(t, C.ye);
  const card = pop(t, C.fllm2 + 0.1, { damping: 12, stiffness: 180 });
  const mit = pop(t, C.mit, { damping: 7, stiffness: 260 });
  const os = pop(t, C.open2, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 400, sc(pop(t, C.fllm2, { damping: 10, stiffness: 210 }))) }}>
        <FllmName size={84} />
      </div>
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1250, 760, eo(mix(card))), 1, "rotate(-1deg)") }}>
          <div style={{ width: 860, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 32, boxShadow: shadow.hard(10), padding: "22px 28px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Img src={staticFile(SRC.github)} style={{ width: 64, height: 64 }} />
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: P.ink }}>tashfeenahmed/<span style={{ background: P.lime, borderRadius: 6, padding: "0 6px" }}>freellmapi</span></div>
            </div>
            <div style={{ ...type.body, fontWeight: 600, fontSize: 30, color: P.ink2, lineHeight: 1.3 }}>Free LLM tiers, stacked behind one OpenAI-compatible endpoint.</div>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ transform: `scale(${mit > 0 ? sc(mit) : 0.001})` }}>
                <div style={{ display: "flex", border: `4px solid ${P.ink}`, borderRadius: 14, overflow: "hidden", ...type.display, fontSize: 40 }}>
                  <div style={{ background: P.ink, color: "#fff", padding: "4px 16px 8px" }}>License</div>
                  <div style={{ background: P.lime, color: P.ink, padding: "4px 16px 8px" }}>MIT</div>
                </div>
              </div>
              <div style={{ transform: `scale(${os > 0 ? sc(os) : 0.001})` }}>
                <Chip text="OPEN-SOURCE ✓" size={36} tone="ink" />
              </div>
            </div>
          </div>
        </div>
      )}
      {card > 0 && <DemoTag text="Source: github.com/tashfeenahmed/freellmapi · checked 17 Nov 2026" style={{ left: 175, top: 1100, opacity: mix(card) }} />}
      <Burst t={t} at={C.mit} x={300} y={900} r={300} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 6. Many free tiers → one endpoint

const PROVS: App[] = ["gemini", "qwen", "deepseek", "codex", "cursor"];
const PROV_LABEL = ["Google", "Qwen", "DeepSeek", "+ 84 more", ""];

export const EndpointScene: React.FC<S> = ({ t }) => {
  if (t < C.ye - 0.1 || t > C.catalog + 0.3) return null;
  const o = out(t, C.catalog);
  const head = pop(t, C.ye, { damping: 10, stiffness: 210 });
  const hub = pop(t, C.tiers, { damping: 10, stiffness: 200 });
  const ep1 = pop(t, C.endpoint, { damping: 8, stiffness: 240 });
  const ys = [560, 690, 820, 950];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)), ...type.display, fontSize: 76, color: P.ink, whiteSpace: "nowrap" }}>
          Free tiers → <Lime>1 endpoint</Lime>
        </div>
      )}
      {ys.map((y, i) => {
        const k = pop(t, C.providers + i * 0.16, { damping: 9, stiffness: 230 });
        if (k <= 0) return null;
        const more = i === 3;
        return (
          <React.Fragment key={i}>
            <EnergyLine from={[230, y]} to={[470, 760]} k={seg(t, C.tiers + i * 0.1, C.tiers + 0.4 + i * 0.1)} t={t} width={8} />
            <div style={{ ...centre(170, y, sc(k)) }}>
              {more ? (
                <div style={{ width: 110, height: 110, borderRadius: 26, background: P.lime, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(6), display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 44, color: P.ink }}>+</div>
              ) : (
                <Tile app={PROVS[i]} size={110} />
              )}
            </div>
            <div style={{ ...centre(170, y + 72, mix(k)), ...type.label, fontSize: 18, color: P.ink2, whiteSpace: "nowrap" }}>{more ? "MANY MORE" : PROV_LABEL[i]}</div>
          </React.Fragment>
        );
      })}
      {hub > 0 && (
        <div style={{ ...centre(560, 760, sc(hub)) }}>
          <div style={{ width: 250, background: "#171717", border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: `${shadow.hard(9)}, 0 0 70px rgba(16,185,129,0.5)`, padding: "18px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <Img src={staticFile(SRC.fllm)} style={{ width: 120, height: 120 }} />
            <div style={{ ...type.display, fontSize: 36, color: "#FAF9F5", whiteSpace: "nowrap" }}>FreeLLMAPI</div>
            <div style={{ ...type.label, fontSize: 16, color: MINT }}>ROUTER</div>
          </div>
        </div>
      )}
      <EnergyLine from={[690, 760]} to={[800, 760]} k={seg(t, C.endpoint - 0.2, C.endpoint + 0.1)} t={t} width={12} />
      {ep1 > 0 && (
        <div style={{ ...centre(900, 760, sc(ep1), "rotate(3deg)") }}>
          <div style={{ background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "14px 18px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ ...type.label, fontSize: 18, color: P.ink }}>ONE ENDPOINT</div>
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 52, color: P.ink }}>/v1</div>
          </div>
        </div>
      )}
      {hub > 0 && <DemoTag text="Simplified · logos are some of the providers and models" style={{ left: 250, top: 1100, opacity: mix(hub) }} />}
      <Burst t={t} at={C.jod} x={900} y={760} r={300} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 7. The numbers. The voice says the README's figures until 12 Nov; the screen adds today's under each one.

const NUMS: { at: number; big: string; unit: string; now: string }[] = [
  { at: C.n34, big: "34", unit: "PROVIDERS", now: "87" },
  { at: C.n635, big: "635", unit: "MODEL ENDPOINTS", now: "1,313" },
  { at: C.n74, big: "~7.4B", unit: "TOKENS / MONTH", now: "~10.1B" },
];

const countUp = (t: number, at: number, s: string) => {
  const k = eo(seg(t, at, at + 0.5));
  const m = s.match(/[\d.]+/);
  if (!m) return s;
  const v = parseFloat(m[0]) * k;
  const dec = m[0].includes(".") ? 1 : 0;
  return s.replace(m[0], v.toFixed(dec));
};

export const NumbersScene: React.FC<S> = ({ t }) => {
  if (t < C.catalog - 0.1 || t > C.tokens + 0.3) return null;
  const o = out(t, C.tokens);
  const head = pop(t, C.catalog, { damping: 10, stiffness: 210 });
  const upd = pop(t, C.n34 + 0.9, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head)), display: "flex", alignItems: "center", gap: 20 }}>
          <Img src={staticFile(SRC.fllm)} style={{ width: 80, height: 80 }} />
          <div style={{ ...type.display, fontSize: 76, color: P.ink, whiteSpace: "nowrap" }}>
            Free-tier <Lime>catalog</Lime>
          </div>
        </div>
      )}
      {NUMS.map((n, i) => {
        const k = pop(t, n.at, { damping: 8, stiffness: 230 });
        if (k <= 0) return null;
        const now = pop(t, n.at + 0.9, { damping: 9, stiffness: 230 });
        const big = i === 2;
        return (
          <div key={n.unit} style={{ ...centre(540, 590 + i * 175, sc(k), `rotate(${(i - 1) * 1.2}deg)`) }}>
            <div style={{ width: 900, height: 150, boxSizing: "border-box", background: big ? P.lime : P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(9), padding: "0 26px", display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ ...type.display, fontSize: 104, lineHeight: 1, color: P.ink, letterSpacing: "-0.05em", width: 330, whiteSpace: "nowrap" }}>{countUp(t, n.at, n.big)}</div>
              <div style={{ ...type.display, fontSize: 38, lineHeight: 1.05, color: P.ink, flex: 1 }}>{n.unit}</div>
              {now > 0 && (
                <div style={{ transform: `scale(${sc(now)}) rotate(4deg)`, background: P.ink, color: P.lime, borderRadius: 16, padding: "6px 14px 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ ...type.label, fontSize: 15, color: "#D9D6CC" }}>NOW</div>
                  <div style={{ ...type.display, fontSize: 40, lineHeight: 1, whiteSpace: "nowrap" }}>{n.now}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      {upd > 0 && (
        <div style={{ ...centre(540, 1102, mix(upd)) }}>
          <DemoTag text="Voice: README until 12 Nov · NOW = README on 17 Nov 2026 · listed free-tier capacity" style={{ position: "relative" }} />
        </div>
      )}
      <Burst t={t} at={C.n74} x={540} y={940} r={460} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 8. Tokens = AI ka data pack; every provider has its own limit and reset

const PACKS: { id: string; lim: string; reset: string; fill: number }[] = [
  { id: "A", lim: "Requests / day", reset: "DAILY", fill: 0.7 },
  { id: "B", lim: "Tokens / minute", reset: "EVERY MINUTE", fill: 0.35 },
  { id: "C", lim: "Tokens / month", reset: "MONTHLY", fill: 0.85 },
];

export const PackScene: React.FC<S> = ({ t }) => {
  if (t < C.tokens - 0.1 || t > C.game + 0.3) return null;
  const o = out(t, C.game);
  const phone = pop(t, C.tokens + 0.1, { damping: 12, stiffness: 180 });
  const pack = pop(t, C.pack, { damping: 8, stiffness: 240 });
  const rows = t >= C.lekin - 0.1;
  const swap = eo(seg(t, C.lekin - 0.15, C.lekin + 0.25));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 400, sc(pop(t, C.tokens, { damping: 10, stiffness: 210 }))), ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap" }}>
        {rows ? (
          <>
            Har provider <Lime>alag</Lime>
          </>
        ) : (
          <>
            Tokens = <Lime>data pack</Lime>
          </>
        )}
      </div>
      {phone > 0 && swap < 1 && (
        <div style={{ ...centre(540, lerp(1300, 790, eo(mix(phone))), 1 - swap * 0.3, "rotate(-3deg)"), opacity: 1 - swap }}>
          <PhoneShell w={300}>
            <div style={{ width: "100%", height: 520, background: P.paper, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 20, boxSizing: "border-box" }}>
              <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>AI DATA PACK</div>
              <svg width={180} height={180} viewBox="0 0 40 40">
                <circle cx={20} cy={20} r={16} fill="none" stroke={P.line} strokeWidth={6} />
                <circle cx={20} cy={20} r={16} fill="none" stroke={P.olive} strokeWidth={6} strokeDasharray={`${100.5 * lerp(1, 0.62, eo(seg(t, C.pack, C.lekin)))} 100.5`} transform="rotate(-90 20 20)" strokeLinecap="round" />
              </svg>
              <div style={{ ...type.display, fontSize: 40, color: P.ink }}>{Math.round(lerp(100, 62, eo(seg(t, C.pack, C.lekin))))}% left</div>
              <div style={{ ...type.label, fontSize: 16, color: P.ink3 }}>TOKENS</div>
            </div>
          </PhoneShell>
        </div>
      )}
      {pack > 0 && swap < 1 && (
        <div style={{ ...centre(730, 1040, sc(pack), "rotate(-3deg)"), opacity: 1 - swap, zIndex: 3 }}>
          <Sticker size={44} tone="lime" rotate={0}>
            1 TOKEN ≈ A WORD PIECE
          </Sticker>
        </div>
      )}
      {rows &&
        PACKS.map((p, i) => {
          const k = pop(t, C.limit + i * 0.3, { damping: 9, stiffness: 220 });
          if (k <= 0) return null;
          return (
            <div key={p.id} style={{ ...centre(540, 600 + i * 165, sc(k)) }}>
              <div style={{ width: 860, height: 140, boxSizing: "border-box", background: P.card, border: `5px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(8), padding: "0 22px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 92, height: 92, borderRadius: 22, background: i === 1 ? P.lime : P.ink, color: i === 1 ? P.ink : P.lime, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 48, boxSizing: "border-box" }}>{p.id}</div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ ...type.display, fontSize: 34, color: P.ink }}>Provider {p.id} · {p.lim}</div>
                    <div style={{ ...type.label, fontSize: 17, color: P.olive, whiteSpace: "nowrap" }}>RESETS {p.reset}</div>
                  </div>
                  <div style={{ height: 22, borderRadius: 11, background: P.line, border: `3px solid ${P.ink}`, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.fill * 100 * eo(seg(t, C.limit + i * 0.3, C.limit + i * 0.3 + 0.6))}%`, background: P.lime }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {rows && <DemoTag text="Illustration · real limits differ by provider and model" style={{ left: 280, top: 1100, opacity: swap }} />}
    </div>
  );
};

// =================================================================================================================
// 9. Rehook: Ab samjho game!

export const GameScene: React.FC<S> = ({ t }) => {
  if (t < C.game - 0.1 || t > C.haath + 0.3) return null;
  const o = out(t, C.haath);
  const stage = eo(seg(t, C.game - 0.1, C.game + 0.2));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Stage k={stage} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{ ...type.display, fontSize: 130, color: "#FAF9F5", letterSpacing: "-0.04em" }}>
          <Slam t={t} at={C.game + 0.05}>
            AB SAMJHO
          </Slam>
        </div>
        <div style={{ transform: "rotate(-3deg)" }}>
          <Slam t={t} at={C.game + 0.4}>
            <div style={{ ...type.display, fontSize: 150, lineHeight: 0.95, color: P.ink, background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 30, padding: "4px 40px 18px", boxShadow: "10px 10px 0 #FAF9F5", letterSpacing: "-0.04em" }}>GAME!</div>
          </Slam>
        </div>
      </div>
    </div>
  );
};

// =================================================================================================================
// 10 to 12. Claude Code = haath, AI model = dimaag → free models → same agent, new brain

const SWAP: App[] = ["gemini", "qwen", "deepseek", "gemini"];

export const BrainScene: React.FC<S> = ({ t }) => {
  if (t < C.haath - 0.1 || t > C.multi + 0.3) return null;
  const o = out(t, C.multi);
  const hand = pop(t, C.haath, { damping: 10, stiffness: 210 });
  const brain = pop(t, C.dimaag, { damping: 9, stiffness: 220 });
  const phase2 = t >= C.models - 0.1;
  const phase3 = t >= C.matlab - 0.1;
  const swapI = phase3 ? Math.min(SWAP.length - 1, Math.max(0, Math.floor((t - C.badal) / 0.4))) : -1;
  const brainApp: App | undefined = phase3 ? (t < C.badal ? undefined : SWAP[swapI]) : undefined;
  const brainHot = phase3 && t >= C.badal;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* headline */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", justifyContent: "center" }}>
        {!phase2 && hand > 0 && (
          <div style={{ ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap", transform: `scale(${sc(hand)})` }}>
            Haath + <Lime>dimaag</Lime>
          </div>
        )}
        {phase2 && !phase3 && (
          <div style={{ ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap", transform: `scale(${sc(pop(t, C.models, { damping: 10, stiffness: 210 }))})` }}>
            Free <Lime>dimaag</Lime> connect
          </div>
        )}
        {phase3 && (
          <div style={{ ...type.display, fontSize: 74, color: P.ink, whiteSpace: "nowrap", transform: `scale(${sc(pop(t, C.matlab, { damping: 10, stiffness: 210 }))})` }}>
            Same agent, <Lime>naya dimaag</Lime>
          </div>
        )}
      </div>
      {/* left: the agent = Claude Code + hand */}
      {hand > 0 && (
        <div style={{ ...centre(phase2 && !phase3 ? 250 : 290, 740, sc(hand)) }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Tile app="claudecode" size={200} />
              <div style={{ position: "absolute", right: -70, bottom: -40, transform: `rotate(${-14 + Math.sin(t * 6) * 6}deg)` }}>
                <Hand w={130} />
              </div>
            </div>
            <div style={{ ...type.display, fontSize: 40, color: P.ink, marginTop: 10 }}>Claude Code</div>
            <Chip text="HAATH = AGENT" size={26} tone="ink" />
          </div>
        </div>
      )}
      {/* right: the brain */}
      {brain > 0 && !phase2 && (
        <div style={{ ...centre(790, 740, sc(brain), "rotate(3deg)") }}>
          <Brain size={300} label="DIMAAG = AI MODEL" />
        </div>
      )}
      {phase2 && !phase3 && (
        <>
          <div style={{ ...centre(800, 740, 1) }}>
            <div style={{ width: 300, background: "#171717", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: `${shadow.hard(8)}, 0 0 60px rgba(16,185,129,0.4)`, padding: "16px 16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <FllmName size={34} dark />
              {(["gemini", "qwen", "deepseek"] as App[]).map((a, i) => {
                const at = [C.gemini, C.qwen, C.deepseek][i];
                const k = pop(t, at, { damping: 8, stiffness: 240 });
                return (
                  <div key={a} style={{ width: 250, display: "flex", alignItems: "center", gap: 14, background: t >= C.connect ? P.lime : P.card, border: `4px solid ${P.ink}`, borderRadius: 18, padding: "8px 12px", transform: `scale(${k > 0 ? sc(k) : 0.001})` }}>
                    <Tile app={a} size={64} />
                    <div style={{ ...type.display, fontSize: 34, color: P.ink }}>{NAME[a]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <EnergyLine from={[410, 740]} to={[640, 740]} k={seg(t, C.connect - 0.2, C.connect + 0.3)} t={t} width={12} />
          {t >= C.connect && (
            <div style={{ ...centre(540, 1060, sc(pop(t, C.connect, { damping: 9, stiffness: 230 })), "rotate(-2deg)") }}>
              <Sticker size={46} tone="lime" rotate={0}>
                FREE MODELS ✓
              </Sticker>
            </div>
          )}
        </>
      )}
      {phase3 && (
        <>
          <EnergyLine from={[420, 740]} to={[620, 740]} k={1} t={t} width={12} />
          <div style={{ ...centre(800, 740, sc(pop(t, C.matlab, { damping: 9, stiffness: 220 })), `rotate(${brainHot ? Math.sin(t * 12) * 2 : 0}deg)`) }}>
            <Brain size={330} app={brainApp} hot={brainHot} label={brainApp ? NAME[brainApp].toUpperCase() : "DIMAAG?"} />
          </div>
        </>
      )}
      {phase2 && !phase3 && <DemoTag text="Some of the free models in the catalog · 17 Nov 2026" style={{ left: 290, top: 1110 }} />}
      <Burst t={t} at={C.dimaag} x={790} y={740} r={340} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 13 + 15. The project's own dashboard (README screenshots): many providers in one place, quota tracking

const Shot: React.FC<{ w: number; h: number; sx: number; sy: number; scale: number }> = ({ w, h, sx, sy, scale }) => (
  <div style={{ width: w, height: h, overflow: "hidden", position: "relative", background: "#fff" }}>
    <Img src={staticFile("tokens/logos/hero.png")} style={{ position: "absolute", left: -sx * scale, top: -sy * scale, width: 1704 * scale, height: 985 * scale }} />
  </div>
);

export const DashScene: React.FC<S> = ({ t }) => {
  if (t < C.multi - 0.1 || t > C.khatam + 0.3) return null;
  const o = out(t, C.khatam);
  const head = pop(t, C.multi, { damping: 10, stiffness: 210 });
  const win = pop(t, C.multi + 0.15, { damping: 12, stiffness: 180 });
  const zoom = eo(seg(t, C.jagah, C.jagah + 0.8));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Sab <Lime>ek jagah</Lime>
        </div>
      )}
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1300, 790, eo(mix(win))), 1, "rotate(-1deg)") }}>
          <BrowserWin w={940} h={560} url="FreeLLMAPI · Models">
            <Shot w={930} h={560} sx={lerp(280, 300, zoom)} sy={lerp(130, 320, zoom)} scale={lerp(0.85, 1.05, zoom)} />
          </BrowserWin>
        </div>
      )}
      {win > 0 && <DemoTag text="Screenshot: FreeLLMAPI README (the project's own)" style={{ left: 290, top: 1110, opacity: mix(win) }} />}
    </div>
  );
};

export const QuotaScene: React.FC<S> = ({ t }) => {
  if (t < C.jitne - 0.1 || t > C.sirf + 0.3) return null;
  const o = out(t, C.sirf);
  const head = pop(t, C.jitne, { damping: 10, stiffness: 210 });
  const win = pop(t, C.jitne + 0.2, { damping: 12, stiffness: 180 });
  const hi = pop(t, C.dash, { damping: 9, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Quota <Lime>track karo</Lime>
        </div>
      )}
      {win > 0 && (
        <div style={{ ...centre(540, lerp(1300, 770, eo(mix(win))), 1, "rotate(0.8deg)") }}>
          <div style={{ border: `6px solid ${P.ink}`, borderRadius: 26, overflow: "hidden", boxShadow: shadow.hard(10) }}>
            <Shot w={940} h={430} sx={300} sy={325} scale={0.85} />
          </div>
        </div>
      )}
      {hi > 0 && (
        <div style={{ ...centre(540, 1040, sc(hi), "rotate(-2deg)") }}>
          <Sticker size={40} tone="lime" rotate={0}>
            MONTHLY TOKEN BUDGET
          </Sticker>
        </div>
      )}
      {win > 0 && <DemoTag text="Screenshot: FreeLLMAPI README · usage per key and model" style={{ left: 270, top: 1110, opacity: mix(win) }} />}
    </div>
  );
};

// =================================================================================================================
// 14. Failover: limit hit → the router tries the next provider

const CHAIN: { app: App; name: string }[] = [
  { app: "gemini", name: "Provider 1" },
  { app: "qwen", name: "Provider 2" },
  { app: "deepseek", name: "Provider 3" },
];

export const FailoverScene: React.FC<S> = ({ t }) => {
  if (t < C.khatam - 0.1 || t > C.jitne + 0.3) return null;
  const o = out(t, C.jitne);
  const head = pop(t, C.khatam, { damping: 10, stiffness: 210 });
  const hit = t >= C.khatam + 0.4;
  const jump = eo(seg(t, C.router, C.router + 0.9));
  const ok = t >= C.router + 1.0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Limit <Lime>khatam?</Lime>
        </div>
      )}
      <div style={{ ...centre(540, 560, mix(pop(t, C.khatam + 0.1, {}))) }}>
        <div style={{ background: "#171717", border: `5px solid ${P.ink}`, borderRadius: 22, padding: "10px 20px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <Img src={staticFile(SRC.fllm)} style={{ width: 52, height: 52 }} />
          <div style={{ ...type.display, fontSize: 34, color: "#FAF9F5" }}>Router</div>
        </div>
      </div>
      {CHAIN.map((c, i) => {
        const k = pop(t, C.khatam + 0.1 + i * 0.12, { damping: 10, stiffness: 220 });
        const dead = i === 0 && hit;
        const live = i === 1 && ok;
        return (
          <div key={c.name} style={{ ...centre(540, 690 + i * 125, sc(k)) }}>
            <div style={{ width: 760, height: 108, boxSizing: "border-box", background: live ? P.lime : P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(7), padding: "0 20px", display: "flex", alignItems: "center", gap: 18, opacity: dead ? 0.6 : 1 }}>
              <div style={{ ...type.display, fontSize: 36, color: P.ink3, width: 30 }}>{i + 1}</div>
              <Tile app={c.app} size={70} />
              <div style={{ ...type.display, fontSize: 36, color: P.ink, flex: 1 }}>{NAME[c.app]}</div>
              {dead && <div style={{ ...type.label, fontSize: 20, color: "#fff", background: RED, borderRadius: 10, padding: "6px 12px" }}>LIMIT HIT · SKIP</div>}
              {live && <div style={{ ...type.label, fontSize: 20, color: P.lime, background: P.ink, borderRadius: 10, padding: "6px 12px" }}>ANSWER ✓</div>}
              {i === 2 && !live && <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>STANDING BY</div>}
            </div>
          </div>
        );
      })}
      {jump > 0 && jump < 1 && (
        <div style={{ ...centre(950, lerp(690, 815, jump), 1, `rotate(${jump * 180}deg)`), ...type.display, fontSize: 60, color: P.ink }}>↓</div>
      )}
      {ok && (
        <div style={{ ...centre(540, 1060, sc(pop(t, C.router + 1.0, { damping: 9, stiffness: 230 })), "rotate(-2deg)") }}>
          <Sticker size={44} tone="ink" rotate={0}>
            KAAM NAHI RUKA
          </Sticker>
        </div>
      )}
      {t > C.khatam + 0.3 && <DemoTag text="Illustration of the README's fallback chain" style={{ left: 330, top: 1118 }} />}
      <Burst t={t} at={C.router + 1.0} x={540} y={850} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 16. Not just Claude Code: Codex, Cursor, OpenCode, Qwen Code

const AGENTS: { app: App; name: string; at: number }[] = [
  { app: "codex", name: "Codex", at: C.codex },
  { app: "cursor", name: "Cursor", at: C.cursor },
  { app: "opencode", name: "OpenCode", at: C.opencode },
  { app: "qwen", name: "Qwen Code", at: C.qwencode },
];

export const AgentsScene: React.FC<S> = ({ t }) => {
  if (t < C.sirf - 0.1 || t > C.apps + 0.3) return null;
  const o = out(t, C.apps);
  const cc = pop(t, C.sirf, { damping: 9, stiffness: 220 });
  const sup = pop(t, C.supported, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 395, sc(cc)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
        Sirf <Lime>Claude Code</Lime> nahi
      </div>
      {cc > 0 && (
        <div style={{ ...centre(540, 590, sc(cc)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, padding: "10px 20px", boxShadow: shadow.hard(7) }}>
            <Tile app="claudecode" size={84} />
            <div style={{ ...type.display, fontSize: 44, color: P.ink }}>Claude Code</div>
            <div style={{ ...type.label, fontSize: 20, color: P.ink, background: P.lime, borderRadius: 8, padding: "4px 8px" }}>✓</div>
          </div>
        </div>
      )}
      {AGENTS.map((a, i) => {
        const k = pop(t, a.at, { damping: 8, stiffness: 240 });
        if (k <= 0) return null;
        return (
          <div key={a.name} style={{ ...centre(300 + (i % 2) * 480, 790 + Math.floor(i / 2) * 200 + Math.sin(t * 2.4 + i) * 5, sc(k), `rotate(${(i % 2 ? 1 : -1) * 2.5}deg)`) }}>
            <div style={{ width: 420, height: 160, boxSizing: "border-box", background: t >= C.supported ? P.limeWash : P.card, border: `5px solid ${P.ink}`, borderRadius: 28, boxShadow: shadow.hard(8), padding: "0 20px", display: "flex", alignItems: "center", gap: 18 }}>
              <Tile app={a.app} size={110} />
              <div style={{ ...type.display, fontSize: 42, lineHeight: 1.05, color: P.ink }}>{a.name}</div>
            </div>
          </div>
        );
      })}
      {sup > 0 && (
        <div style={{ ...centre(820, 690, sc(sup), "rotate(6deg)"), zIndex: 3 }}>
          <Sticker size={40} tone="lime" rotate={0}>
            23 AGENTS LISTED
          </Sticker>
        </div>
      )}
      {cc > 0 && <DemoTag text="Supported agents per the FreeLLMAPI README · 17 Nov 2026" style={{ left: 260, top: 1112, opacity: mix(cc) }} />}
    </div>
  );
};

// =================================================================================================================
// 17. Build apps, websites, side projects, within free-tier limits

const BUILDS: { label: string; at: number; icon: string }[] = [
  { label: "APPS", at: C.apps, icon: "▣" },
  { label: "WEBSITES", at: C.websites, icon: "◎" },
  { label: "SIDE PROJECTS", at: C.side, icon: "✦" },
];

export const BuildScene: React.FC<S> = ({ t }) => {
  if (t < C.apps - 0.1 || t > C.sach + 0.3) return null;
  const o = out(t, C.sach);
  const lim = pop(t, C.limits, { damping: 9, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ ...centre(540, 400, sc(pop(t, C.apps, { damping: 10, stiffness: 210 }))), ...type.display, fontSize: 84, color: P.ink, whiteSpace: "nowrap" }}>
        Ab <Lime>banao!</Lime>
      </div>
      {BUILDS.map((b, i) => {
        const k = pop(t, b.at, { damping: 8, stiffness: 240 });
        if (k <= 0) return null;
        return (
          <div key={b.label} style={{ ...centre(540 + (i - 1) * 40, 590 + i * 150, sc(k), `rotate(${(i - 1) * -2}deg)`) }}>
            <div style={{ width: 720, height: 124, boxSizing: "border-box", background: i === 2 ? P.lime : P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(9), padding: "0 26px", display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: P.ink, color: P.lime, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 48 }}>{b.icon}</div>
              <div style={{ ...type.display, fontSize: 56, color: P.ink, whiteSpace: "nowrap" }}>{b.label}</div>
            </div>
          </div>
        );
      })}
      {lim > 0 && (
        <div style={{ ...centre(540, 1060, sc(lim), "rotate(-1.5deg)") }}>
          <Chip text="FREE-TIER LIMITS KE ANDAR" size={40} tone="ink" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 18. The honest note: no real Claude model for free

export const HonestScene: React.FC<S> = ({ t }) => {
  if (t < C.sach - 0.1 || t > C.setupQ + 0.3) return null;
  const o = out(t, C.setupQ);
  const stage = eo(seg(t, C.sach - 0.1, C.sach + 0.2));
  const no = pop(t, C.asli + 1.2, { damping: 7, stiffness: 260 });
  const yes = pop(t, C.ye2, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Stage k={stage} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 360, display: "flex", justifyContent: "center" }}>
        <div style={{ ...type.display, fontSize: 100, color: "#FAF9F5", letterSpacing: "-0.04em" }}>
          <Slam t={t} at={C.sach + 0.05}>
            EK SACH BAAT
          </Slam>
        </div>
      </div>
      {t >= C.asli && (
        <div style={{ ...centre(540, yes > 0 ? 640 : 720, sc(pop(t, C.asli, { damping: 11, stiffness: 190 })) * (yes > 0 ? 0.82 : 1), "rotate(-1.5deg)") }}>
          <div style={{ position: "relative", width: 760, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 32, padding: "20px 26px 24px", display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 120, height: 120, borderRadius: 28, background: DARK, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${P.ink}` }}>
              <Img src={staticFile("fable/logos/claude-spark.svg")} style={{ width: 76, height: 76 }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>ASLI CLAUDE MODEL</div>
              <div style={{ ...type.display, fontSize: 56, color: P.ink, lineHeight: 1.05 }}>Free nahi milta</div>
            </div>
            {no > 0 && (
              <div style={{ position: "absolute", right: -30, top: -40, transform: `scale(${sc(no)}) rotate(10deg)`, ...type.display, fontSize: 64, color: "#fff", background: RED, border: `6px solid ${P.ink}`, borderRadius: 22, padding: "0 22px 8px" }}>✗</div>
            )}
          </div>
        </div>
      )}
      {yes > 0 && (
        <div style={{ ...centre(540, 900, sc(yes), "rotate(1deg)") }}>
          <div style={{ width: 800, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 32, padding: "18px 24px 22px", display: "flex", alignItems: "center", gap: 18 }}>
            <Tile app="claudecode" size={100} />
            <div style={{ ...type.display, fontSize: 52, color: P.ink }}>+</div>
            {(["gemini", "qwen", "deepseek"] as App[]).map((a, i) => (
              <div key={a} style={{ transform: `scale(${sc(pop(t, C.ye2 + 0.4 + i * 0.25, { damping: 9, stiffness: 230 })) || 0.001})` }}>
                <Tile app={a} size={86} />
              </div>
            ))}
            <div style={{ ...type.display, fontSize: 40, color: P.ink, marginLeft: 6, lineHeight: 1 }}>free models</div>
          </div>
        </div>
      )}
      {yes > 0 && <DemoTag dark text="README: personal experimentation and learning, not production" style={{ left: 245, top: 1060, opacity: mix(yes) }} />}
    </div>
  );
};

// =================================================================================================================
// 19. CTA: Poora setup chahiye? Comment TOKENS / link in bio → keyword box → TOKENS (no DMs promised or shown)

const KW = "TOKENS";

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.setupQ - 0.1) return null;
  const head = pop(t, C.setupQ, { damping: 10, stiffness: 210 });
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.tokensWord, { damping: 8, stiffness: 240 });
  const swap = eo(seg(t, C.link - 0.15, C.link + 0.2));
  const page = pop(t, C.link, { damping: 12, stiffness: 180 });
  const s = typed(t, KW, C.box + 0.3, C.tokensType + 0.2);
  const done = t >= C.tokensType + 0.3;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head)), ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>
          Poora <Lime>setup</Lime> chahiye?
        </div>
      )}
      {bubble > 0 && swap < 1 && (
        <div style={{ ...centre(540, 790, sc(bubble) * (1 - swap * 0.3), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`), opacity: 1 - swap }}>
          <div style={{ position: "relative", width: 760, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "26px 30px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ ...type.label, fontSize: 36, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 170, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>{KW}</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 80, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      {page > 0 && swap > 0 && (
        <div style={{ ...centre(540, lerp(1300, 780, eo(mix(page))), 1, "rotate(-1deg)") }}>
          <BrowserWin w={860} h={560} url="internetoolbox.com/links">
            <div style={{ padding: "26px 34px 30px", display: "flex", flexDirection: "column", gap: 18, background: P.paper }}>
              <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>LINK IN BIO</div>
              <div style={{ ...type.display, fontSize: 46, color: P.ink }}>Got a keyword from a reel?</div>
              <div style={{ display: "flex", gap: 14 }}>
                <div style={{ flex: 1, height: 96, boxSizing: "border-box", background: P.card, border: `5px solid ${P.ink}`, borderRadius: 20, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: mono, fontWeight: 700, fontSize: 52, color: P.ink }}>
                  {s}
                  <Caret t={t} on={!done} />
                  {!s && <span style={{ color: P.ink3, fontSize: 32 }}>Type keyword</span>}
                </div>
                <div style={{ width: 150, height: 96, borderRadius: 20, background: done ? P.lime : P.ink, color: done ? P.ink : "#fff", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 40 }}>{done ? "✓" : "Go"}</div>
              </div>
              {done && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, background: P.limeWash, border: `4px solid ${P.ink}`, borderRadius: 18, padding: "10px 16px", transform: `scale(${sc(pop(t, C.tokensType + 0.3, { damping: 10, stiffness: 220 }))})`, transformOrigin: "left center" }}>
                  <Img src={staticFile(SRC.fllm)} style={{ width: 56, height: 56 }} />
                  <div style={{ ...type.display, fontSize: 36, color: P.ink }}>FreeLLMAPI setup, free</div>
                </div>
              )}
            </div>
          </BrowserWin>
        </div>
      )}
      {page > 0 && swap > 0 && <DemoTag text="Illustration of our link-in-bio page" style={{ left: 380, top: 1112, opacity: swap }} />}
      <Burst t={t} at={C.tokensWord} x={540} y={800} r={460} color={P.lime} />
      <Sparks t={t} at={C.tokensType + 0.3} x={540} y={900} n={12} r={300} />
    </div>
  );
};

export { ep };
