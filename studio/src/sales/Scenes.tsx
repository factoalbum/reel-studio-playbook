import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Coin, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, Laptop, PhoneShell, StatusRow } from "../immich/kit";
import { eo, io, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/sales";
import { Chip, mix, ProductBox, RealPage, sc } from "../launch/kit";
import { KitFan } from "../launch/Scenes";

/**
 * Build in Public, Episode 02 scenes. Times come from src/episodes/sales.ts (the recording's pauses).
 * Layout bands: brand bug ~258, headlines 320 to 680, main visual 480 to 1140, subtitles 1160 to 1290,
 * the honesty note and the corner presenter below that, all inside the Instagram safe zone (250 to 1580).
 */

type S = { t: number };
const WHITE = "#FAF9F6";
/** 0 before `at`, 1 once the scene has left (0.25 s exit). */
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera and wipes

export const CAM_ORIGIN = "540px 700px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  // The opener starts pushed toward ₹300 and settles back.
  const open = 0.09 * (1 - eo(seg(t, 0.05, 1.3)));
  return 1 + open + push(C.teenSau, 0.06, 0.6) + push(C.ads, 0.06, 0.4) + push(C.price, 0.07, 0.5) + push(C.anjaan, 0.04, 0.8) + push(C.ebookWord, 0.04, 0.4) + push(C.linkWord, 0.035);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.step1, C.step3, C.cta, C.journey].map((at, i) => {
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

/** Big kinetic word: lands from 2x with a blur. */
const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, k * 3), transform: `scale(${lerp(2.1, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1)})`, filter: `blur(${Math.max(0, 1 - k) * 8}px)`, ...style }}>
      {children}
    </span>
  );
};

/** "STEP n" pill plus a title, top of frame. */
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

/** Progress dots for the three steps, under the step title. */
const StepDots: React.FC<{ t: number; on: number; at: number; out: number }> = ({ t, on, at, out }) => {
  const o = leave(t, out);
  const k = mix(pop(t, at, { damping: 12, stiffness: 200 }));
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 428, display: "flex", justifyContent: "center", gap: 14, opacity: k * (1 - o) }}>
      {["DRAFT", "KIT", "LAUNCH"].map((s, i) => (
        <div key={s} style={{ ...type.label, fontSize: 20, padding: "6px 14px", borderRadius: 999, border: `3px solid ${P.ink}`, background: i < on ? P.lime : i === on ? P.card : P.paper2, color: i <= on ? P.ink : P.ink3 }}>
          {i < on ? "✓ " : ""}
          {s}
        </div>
      ))}
    </div>
  );
};

/** A chip-style arrow. */
const Arrow: React.FC<{ k: number; w?: number; down?: boolean }> = ({ k, w = 60, down = false }) => (
  <svg width={down ? 40 : w} height={down ? w : 40} viewBox={down ? `0 0 40 ${w}` : `0 0 ${w} 40`} style={{ opacity: k, flex: "0 0 auto" }}>
    {down ? (
      <path d={`M20 4 V${w - 10} M8 ${w - 22} L20 ${w - 8} L32 ${w - 22}`} fill="none" stroke={P.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} />
    ) : (
      <path d={`M4 20 H${w - 10} M${w - 22} 8 L${w - 8} 20 L${w - 22} 32`} fill="none" stroke={P.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} />
    )}
  </svg>
);

/** The real Topmate listing (public page, captured 11 Nov 2026), shown inside a phone. */
const TOP_IMG_W = 860; // screenshot width in pixels (430 css px at 2x)
const TopmatePhone: React.FC<{ w: number; scroll?: number; glow?: number }> = ({ w, scroll = 0, glow = 0 }) => {
  const sw = w * 0.93;
  const s = sw / TOP_IMG_W;
  return (
    <PhoneShell w={w} glow={glow}>
      <StatusRow w={sw} />
      <div style={{ position: "absolute", left: 12, right: 12, top: 34, height: 34, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 17, background: P.paper2, border: `2px solid ${P.line}` }}>
        <div style={{ ...type.label, letterSpacing: "0.01em", textTransform: "none", fontSize: 13, color: P.ink2, whiteSpace: "nowrap" }}>topmate.io/internettoolbox</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 76, bottom: 64 * (sw / 330), overflow: "hidden" }}>
        <Img src={staticFile("sales/topmate.png")} style={{ position: "absolute", left: 0, top: -(240 + scroll) * s, width: sw }} />
      </div>
      {/* The page's sticky buy bar sits at the bottom of the screenshot; pin it to the bottom of the screen. */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64 * (sw / 330), overflow: "hidden", background: WHITE }}>
        <Img src={staticFile("sales/topmate.png")} style={{ position: "absolute", left: 0, bottom: 0, width: sw }} />
      </div>
    </PhoneShell>
  );
};

/** The real ebook page on the website (launch/site-buy.png), in a browser card. */
const SiteCard: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, borderRadius: 20, border: `5px solid ${P.ink}`, background: P.card, overflow: "hidden", boxShadow: shadow.hard(8) }}>
    <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", borderBottom: `3px solid ${P.ink}`, background: P.paper2 }}>
      {[P.pink, P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c, border: `2px solid ${P.ink}` }} />
      ))}
      <div style={{ ...type.label, textTransform: "none", letterSpacing: "0.01em", fontSize: 15, color: P.ink2, marginLeft: 8, whiteSpace: "nowrap" }}>internetoolbox.com/ebook-launch-kit</div>
    </div>
    <div style={{ position: "relative", height: w * 0.62, overflow: "hidden" }}>
      <Img src={staticFile("launch/site-buy.png")} style={{ position: "absolute", left: 0, top: -12 * (w / 780), width: w }} />
    </div>
  </div>
);

// =================================================================================================================
// 1. Money hook: ₹300 SALES?! (visible on the first frame)

/** Readable honesty note with the real numbers (owner-confirmed, Topmate records). */
export const HonestNote: React.FC<{ t: number; at: number; out: number }> = ({ t, at, out }) => {
  const k = pop(t, at, { damping: 13, stiffness: 190 });
  const o = leave(t, out);
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 70, width: 940, top: 1330, opacity: Math.min(1, k * 2) * (1 - o), transform: `translateY(${(1 - mix(k)) * 40}px)` }}>
      <div style={{ background: P.card, border: `4px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(6), padding: "16px 24px 18px", display: "flex", gap: 18, alignItems: "center" }}>
        <div style={{ flex: "0 0 auto", ...type.label, fontSize: 20, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "6px 10px" }}>REAL NUMBERS</div>
        <div style={{ ...type.body, fontSize: 27, lineHeight: 1.28, color: P.ink }}>
          <b>3 orders on 9-10 Nov · ₹276 after fees · ₹0 ads.</b>
          <br />
          All 3 were friends &amp; family testing checkout. Not profit.
        </div>
      </div>
    </div>
  );
};

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.noAds + 0.3) return null;
  const o = leave(t, C.noAds);
  const pulse = t > C.teenSau ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.teenSau) / 0.35) * Math.PI) : 1;
  const sales = pop(t, -0.2, { damping: 9, stiffness: 230 });
  const card = pop(t, -0.35, { damping: 13, stiffness: 160 });
  const pages = pop(t, -0.3, { damping: 13, stiffness: 160 });
  const coins = [0, 1, 2, 3, 4].map((i) => seg(t, 0.05 + i * 0.07, 1.2 + i * 0.07));
  const coins2 = [0, 1, 2, 3].map((i) => seg(t, C.teenSau + i * 0.08, C.teenSau + 1.1 + i * 0.08));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateY(${o * -80}px)` }}>
      {/* Behind: real kit pages and the real Topmate listing */}
      <div style={{ ...centre(lerp(1100, 905, eo(mix(pages))), 905, 1, `rotate(${10 + Math.sin(t * 1.4) * 2}deg)`) }}>
        <RealPage src="launch/pages/guide-p1.png" w={190} />
      </div>
      <div style={{ ...centre(lerp(1100, 860, eo(mix(pages))), 930, 1, `rotate(${4 + Math.sin(t * 1.2 + 1) * 2}deg)`) }}>
        <RealPage src="launch/pages/prompts-p1.png" w={190} />
      </div>
      <div style={{ ...centre(lerp(1150, 720, eo(mix(card))), 900 + Math.sin(t * 1.6) * 6, 1, `rotate(${-4 + Math.sin(t * 1.1) * 1.5}deg)`) }}>
        <TopmatePhone w={300} scroll={0} glow={t > C.teenSau ? 0.6 : 0.2} />
      </div>
      <DemoTag text="Real page · topmate.io" style={{ left: 615, top: 1112, opacity: mix(card) }} />
      {/* Headline */}
      <div style={{ ...centre(540, 385, sc(pop(t, -0.3, { damping: 12, stiffness: 200 })), "rotate(-1.5deg)") }}>
        <Chip text="MY FIRST EBOOK SALES" size={32} tone="ink" />
      </div>
      <div style={{ ...centre(560, 545, pulse) }}>
        <Slam t={t} at={-0.25} style={{ ...type.display, fontSize: 250, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.05em", textShadow: `8px 8px 0 ${P.lime}` }}>
          ₹300
        </Slam>
      </div>
      <div style={{ ...centre(600, 715, sc(sales), `rotate(${(1 - mix(sales)) * -12 - 3}deg)`) }}>
        <Sticker size={96} tone="lime" rotate={0}>
          SALES?!
        </Sticker>
      </div>
      {/* Coins pop out of the price */}
      {[...coins.map((k, i) => ({ k, i, at: 0 })), ...coins2.map((k, i) => ({ k, i: i + 5, at: 1 }))].map(({ k, i }) =>
        k <= 0 || k >= 1 ? null : (
          <div key={i} style={{ ...centre(560 + Math.cos(i * 1.9) * 380 * eo(k), 545 - 260 * Math.sin(Math.PI * k) * (0.7 + (i % 3) * 0.2) + 300 * k * k, 1 - k * 0.3, `rotate(${k * 360 * (i % 2 ? 1 : -1)}deg)`), opacity: 1 - seg(k, 0.75, 1) }}>
            <Coin size={64} spin={1} />
          </div>
        )
      )}
      <Burst t={t} at={-0.1} x={560} y={545} r={420} color={P.lime} />
      <Burst t={t} at={C.teenSau} x={560} y={545} r={360} color={P.ink} />
    </div>
  );
};

// =================================================================================================================
// 2. No paid ads: the presenter pushes the ad cards away, ₹0 AD SPEND

const AdCard: React.FC<{ label: string; sub: string }> = ({ label, sub }) => (
  <div style={{ width: 380, height: 210, boxSizing: "border-box", borderRadius: 26, background: P.card, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(8), padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width={64} height={64} viewBox="0 0 64 64">
        <path d="M8 26 H20 L44 12 V52 L20 38 H8 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M14 38 L18 54 H26 L23 38" fill={P.card} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M52 24 Q58 32 52 40" fill="none" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{ ...type.display, fontSize: 52, color: P.ink }}>{label}</div>
    </div>
    <div style={{ ...type.label, fontSize: 22, color: P.ink3 }}>{sub}</div>
  </div>
);

export const NoAdsScene: React.FC<S> = ({ t }) => {
  if (t < C.noAds - 0.1 || t > C.how + 0.3) return null;
  const o = leave(t, C.how);
  const cards = [
    { label: "PAID ADS", sub: "Sponsored", x: 720, y: 560, r: -6 },
    { label: "PAID ADS", sub: "Boost post", x: 760, y: 720, r: 5 },
    { label: "PAID ADS", sub: "Promoted", x: 700, y: 880, r: -3 },
  ];
  const zero = pop(t, C.ads, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {cards.map((c, i) => {
        const k = pop(t, C.noAds + 0.12 + i * 0.12, { damping: 12, stiffness: 200 });
        const push = io(seg(t, C.bina + 0.08 + i * 0.07, C.bina + 0.5 + i * 0.07));
        if (k <= 0 || push >= 1) return null;
        return (
          <div key={i} style={{ ...centre(c.x + push * 900, c.y - push * 120, sc(k), `rotate(${c.r + push * 50}deg)`), opacity: 1 - push * 0.4 }}>
            <AdCard label={c.label} sub={c.sub} />
          </div>
        );
      })}
      {zero > 0 && (
        <>
          <div style={{ ...centre(640, 600, 1) }}>
            <Slam t={t} at={C.ads} style={{ ...type.display, fontSize: 280, color: P.ink, letterSpacing: "-0.05em", textShadow: `8px 8px 0 ${P.lime}` }}>
              ₹0
            </Slam>
          </div>
          <div style={{ ...centre(650, 800, sc(zero), "rotate(-3deg)") }}>
            <Sticker size={80} tone="lime" rotate={0}>
              AD SPEND
            </Sticker>
          </div>
        </>
      )}
      <Burst t={t} at={C.ads} x={640} y={640} r={420} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 3. How: "Lekin ye sab kiya kaise?" with the three-step preview

export const HowScene: React.FC<S> = ({ t }) => {
  if (t < C.how - 0.1 || t > C.step1 + 0.3) return null;
  const o = leave(t, C.step1);
  const steps = ["DRAFT", "KIT", "LAUNCH"];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 340, display: "flex", justifyContent: "center" }}>
        <Slam t={t} at={C.lekin} style={{ ...type.display, fontSize: 110, color: P.ink, whiteSpace: "nowrap" }}>
          HOW I DID IT
        </Slam>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 500, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
        {steps.map((s, i) => {
          const k = pop(t, C.lekin + 0.5 + i * 0.32, { damping: 10, stiffness: 220 });
          return (
            <React.Fragment key={s}>
              {i > 0 && <Arrow k={eo(seg(t, C.lekin + 0.4 + i * 0.32, C.lekin + 0.6 + i * 0.32))} w={54} />}
              <div style={{ transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
                <Chip text={`${i + 1} · ${s}`} size={40} tone={i === 1 ? "lime" : "card"} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {t > C.kaise && (
        <div style={{ ...centre(860, 760, sc(pop(t, C.kaise, { damping: 8, stiffness: 240 })), `rotate(${12 + Math.sin(t * 6) * 4}deg)`), ...type.display, fontSize: 200, color: P.ink, textShadow: `6px 6px 0 ${P.lime}` }}>?</div>
      )}
    </div>
  );
};

// =================================================================================================================
// 4. Step 1: ChatGPT draft (illustration; the product name is text only, no logo)

const PROMPT = "Help me plan and draft my first ebook";
const OUTLINE = ["1. Who is it for?", "2. The promise", "3. Chapter outline", "4. First draft", "5. Launch plan"];

const ChatDoc: React.FC<S> = ({ t }) => {
  const t0 = C.step1 + 0.35;
  const typed = Math.floor(seg(t, t0, t0 + 0.8) * PROMPT.length);
  const sent = t > t0 + 0.85;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", background: P.card }}>
      {/* chat side */}
      <div style={{ flex: "0 0 50%", borderRight: `3px solid ${P.line}`, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", padding: "0 18px", borderBottom: `2px solid ${P.line}`, ...type.display, fontSize: 32, color: P.ink }}>ChatGPT</div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ alignSelf: "flex-end", maxWidth: "92%", ...type.body, fontWeight: 600, fontSize: 27, lineHeight: 1.22, color: P.ink, background: P.paper2, border: `2px solid ${P.lineStrong}`, borderRadius: "16px 16px 4px 16px", padding: "8px 14px" }}>
            {PROMPT.slice(0, typed)}
            {!sent && <span style={{ display: "inline-block", width: 4, height: 26, marginLeft: 2, verticalAlign: "-4px", background: P.ink, opacity: Math.floor(t * 6) % 2 }} />}
          </div>
          {sent && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: "0 0 28px", height: 28, borderRadius: 14, background: P.ink3 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 0.9, 0.96, 0.7, 0.85].map((w, n) => (
                  <div key={n} style={{ height: 12, borderRadius: 6, background: P.lineStrong, width: `${w * 100 * Math.max(0, Math.min(1, seg(t, t0 + 0.9, t0 + 1.9) * 5 - n))}%` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* doc side: the outline assembles into a draft */}
      <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...type.label, fontSize: 17, letterSpacing: "0.02em", color: P.ink3, textTransform: "none" }}>my-ebook-draft.docx</div>
        {OUTLINE.map((line, i) => {
          const k = pop(t, t0 + 1.1 + i * 0.22, { damping: 12, stiffness: 220 });
          return (
            <div key={line} style={{ opacity: Math.min(1, k * 2), transform: `translateX(${(1 - mix(k)) * 40}px)` }}>
              <div style={{ ...type.display, fontSize: 25, color: P.ink }}>{line}</div>
              <div style={{ marginTop: 5, height: 7, width: `${60 + ((i * 17) % 35)}%`, borderRadius: 4, background: P.line }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DraftScene: React.FC<S> = ({ t }) => {
  if (t < C.step1 - 0.1 || t > C.step2 + 0.3) return null;
  const o = leave(t, C.step2);
  const lap = pop(t, C.step1 + 0.05, { damping: 13, stiffness: 150 });
  const chip = pop(t, C.banaya, { damping: 9, stiffness: 230 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step1} out={C.step2} n={1} title="PLAN & DRAFT" />
      <StepDots t={t} on={0} at={C.step1 + 0.2} out={C.step2} />
      {lap > 0 && (
        <div style={{ ...centre(540, lerp(1300, 790, eo(mix(lap))), sc(lap)) }}>
          <Laptop w={1000}>
            <ChatDoc t={t} />
          </Laptop>
        </div>
      )}
      {lap > 0 && <DemoTag text="Illustration" style={{ left: 90, top: 1095 }} />}
      {chip > 0 && (
        <div style={{ ...centre(780, 1100, sc(chip), "rotate(-3deg)") }}>
          <Chip text="DRAFT, NOT FINAL" size={32} tone="lime" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 5. Step 2: the real kit files (21 AI prompts, editable templates, planning workbook)

export const KitScene: React.FC<S> = ({ t }) => {
  if (t < C.step2 - 0.1 || t > C.step3 + 0.3) return null;
  const o = leave(t, C.step3);
  const rise = seg(t, C.step2 + 0.05, C.step2 + 0.45);
  const fan = Array.from({ length: 8 }, (_, i) => pop(t, C.step2 + 0.15 + i * 0.09, { damping: 12, stiffness: 170 }));
  const words: { text: string; at: number; x: number; y: number; r: number; tone: "lime" | "ink" | "card"; size: number }[] = [
    { text: "21 AI PROMPTS", at: C.ikkis, x: 320, y: 500, r: -4, tone: "lime", size: 56 },
    { text: "EDITABLE TEMPLATES", at: C.editable, x: 660, y: 590, r: 3, tone: "ink", size: 44 },
    { text: "PLANNING WORKBOOK", at: C.workbook, x: 400, y: 680, r: -2, tone: "card", size: 44 },
  ];
  const files = pop(t, C.taiyaar, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step2} out={C.step3} n={2} title="BUILD THE KIT" />
      <KitFan t={t} x={540} y={950} s={0.84} rise={rise} fan={fan} glow={1} />
      {words.map((w) => {
        const k = pop(t, w.at, { damping: 9, stiffness: 230 });
        if (k <= 0) return null;
        return (
          <div key={w.text} style={{ ...centre(w.x, w.y, sc(k), `rotate(${(1 - mix(k)) * -10 + w.r}deg)`) }}>
            <Sticker size={w.size} tone={w.tone} rotate={0}>
              {w.text}
            </Sticker>
          </div>
        );
      })}
      {files > 0 && (
        <div style={{ ...centre(540, 1120, sc(files)) }}>
          <Chip text="8 FILES · PDF + DOCX + XLSX · DIGITAL DOWNLOAD" size={26} tone="card" />
        </div>
      )}
      <DemoTag text="Real kit pages · box is a mockup" style={{ left: 640, top: 1330, opacity: mix(seg(t, C.step2 + 0.4, C.step2 + 0.7)) }} />
    </div>
  );
};

// =================================================================================================================
// 6. Step 3: launched on Topmate at ₹99, linked from the website

export const TopmateScene: React.FC<S> = ({ t }) => {
  if (t < C.step3 - 0.1 || t > C.challenge + 0.3) return null;
  const o = leave(t, C.challenge);
  const phone = pop(t, C.topmate, { damping: 13, stiffness: 150 });
  const price = pop(t, C.price, { damping: 8, stiffness: 240 });
  const site = pop(t, C.website, { damping: 12, stiffness: 170 });
  const link = eo(seg(t, C.jod - 0.1, C.jod + 0.35));
  const flow = [
    { text: "EBOOK FILES", at: C.topmate + 0.1 },
    { text: "TOPMATE CHECKOUT", at: C.price - 0.3 },
    { text: "INSTANT DOWNLOAD", at: C.launch },
  ];
  const scroll = 520 * io(seg(t, C.launch + 0.2, C.website + 0.6));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <StepHead t={t} at={C.step3} out={C.challenge} n={3} title="LAUNCH" />
      {/* EBOOK FILES → TOPMATE CHECKOUT → INSTANT DOWNLOAD */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 440, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
        {flow.map((f, i) => {
          const k = pop(t, f.at, { damping: 11, stiffness: 220 });
          return (
            <React.Fragment key={f.text}>
              {i > 0 && <Arrow k={eo(seg(t, f.at - 0.15, f.at + 0.05))} w={44} />}
              <div style={{ transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
                <Chip text={f.text} size={24} tone={i === 1 ? "lime" : "card"} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {phone > 0 && (
        <div style={{ ...centre(lerp(-300, 320, eo(mix(phone))), 845, 1, `rotate(${-3 + Math.sin(t * 1.3) * 1.2}deg)`) }}>
          <TopmatePhone w={318} scroll={scroll} glow={price > 0 ? 0.5 : 0} />
        </div>
      )}
      {phone > 0 && <DemoTag text="Real page · topmate.io" style={{ left: 170, top: 1105, opacity: mix(phone) }} />}
      {price > 0 && (
        <div style={{ ...centre(790, lerp(680, 600, mix(site)), sc(price) * lerp(1, 0.85, mix(site)), `rotate(${(1 - mix(price)) * 14 - 5}deg)`) }}>
          <Sticker size={170} tone="lime" rotate={0}>
            ₹99
          </Sticker>
        </div>
      )}
      {site > 0 && (
        <div style={{ ...centre(lerp(1400, 790, eo(mix(site))), 960, 1, "rotate(3deg)") }}>
          <SiteCard w={400} />
        </div>
      )}
      {link > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M640 960 C560 980 560 900 505 905" fill="none" stroke={P.ink} strokeWidth={9} strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - link)} />
          <path d="M640 960 C560 980 560 900 505 905" fill="none" stroke={P.lime} strokeWidth={4} strokeLinecap="round" strokeDasharray="420" strokeDashoffset={420 * (1 - link)} />
        </svg>
      )}
      {link >= 1 && (
        <div style={{ ...centre(800, 1125, sc(pop(t, C.jod + 0.3, { damping: 9, stiffness: 230 })), "rotate(-2deg)") }}>
          <Chip text="WEBSITE → CHECKOUT" size={24} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.price} x={790} y={680} r={320} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 7. The real challenge: reaching unknown customers

const Person: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 50 60">
    <circle cx={25} cy={16} r={11} fill={color} stroke={P.ink} strokeWidth={4} />
    <path d="M6 58 C6 40 14 32 25 32 C36 32 44 40 44 58 Z" fill={color} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

const BoardItem: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <div style={{ width: 150, height: 150, borderRadius: 26, background: P.card, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(6), display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    <div style={{ ...type.label, fontSize: 20, color: P.ink }}>{label}</div>
  </div>
);

export const ChallengeScene: React.FC<S> = ({ t }) => {
  if (t < C.challenge - 0.1 || t > C.cta + 0.3) return null;
  const o = leave(t, C.cta);
  const dim = eo(seg(t, C.challenge, C.challenge + 0.4));
  const board = pop(t, C.challenge + 0.1, { damping: 13, stiffness: 160 });
  const items = [0, 1, 2].map((i) => pop(t, C.challenge + 0.35 + i * 0.25, { damping: 11, stiffness: 210 }));
  const q = pop(t, C.asli + 0.6, { damping: 8, stiffness: 240 });
  const reveal = pop(t, C.anjaan, { damping: 9, stiffness: 230 });
  const people = [0, 1, 2, 3, 4].map((i) => pop(t, C.anjaan + i * 0.12, { damping: 10, stiffness: 220 }));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 540px 760px, rgba(23,23,23,0) 0%, rgba(23,23,23,0.16) 70%)", opacity: dim }} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", justifyContent: "center" }}>
        {reveal <= 0 ? (
          <Slam t={t} at={C.challenge} style={{ ...type.display, fontSize: 92, color: P.ink, whiteSpace: "nowrap" }}>
            THE REAL CHALLENGE?
          </Slam>
        ) : (
          <div style={{ transform: `scale(${sc(reveal)}) rotate(-2deg)` }}>
            <Sticker size={78} tone="lime" rotate={0}>
              FINDING REAL CUSTOMERS
            </Sticker>
          </div>
        )}
      </div>
      {/* The marketing board: reel, visitor, product page, and the missing piece */}
      {board > 0 && (
        <div style={{ ...centre(540, 720, sc(board)), width: 900, height: 330, borderRadius: 30, background: P.paper2, border: `5px solid ${P.ink}`, boxShadow: shadow.soft }}>
          <div style={{ position: "absolute", left: 30, top: 20, ...type.label, fontSize: 20, color: P.ink3 }}>Marketing board</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 24 }}>
            {[
              { label: "Reel", icon: <svg width={80} height={80} viewBox="0 0 80 80"><rect x={18} y={6} width={44} height={68} rx={10} fill={P.lime} stroke={P.ink} strokeWidth={5} /><path d="M34 30 L50 40 L34 50 Z" fill={P.ink} /></svg> },
              { label: "Visitor", icon: <svg width={80} height={80} viewBox="0 0 80 80"><circle cx={40} cy={26} r={13} fill={P.gold} stroke={P.ink} strokeWidth={5} /><path d="M14 72 C14 52 26 44 40 44 C54 44 66 52 66 72 Z" fill={P.gold} stroke={P.ink} strokeWidth={5} strokeLinejoin="round" /></svg> },
              { label: "Ebook page", icon: <svg width={80} height={80} viewBox="0 0 80 80"><rect x={14} y={6} width={52} height={68} rx={8} fill={P.card} stroke={P.ink} strokeWidth={5} /><path d="M24 22 H56 M24 34 H50 M24 46 H54" stroke={P.lineStrong} strokeWidth={5} strokeLinecap="round" /><rect x={24} y={54} width={32} height={12} rx={6} fill={P.lime} stroke={P.ink} strokeWidth={3} /></svg> },
            ].map((it, i) => (
              <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {i > 0 && <Arrow k={mix(items[i])} w={40} />}
                <div style={{ transform: `scale(${sc(items[i])})`, opacity: Math.min(1, items[i] * 2) }}>
                  <BoardItem label={it.label}>{it.icon}</BoardItem>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {q > 0 && (
        <div style={{ ...centre(870, 540, sc(q), `rotate(${10 + Math.sin(t * 5) * 5}deg)`), ...type.display, fontSize: 170, color: P.ink, textShadow: `6px 6px 0 ${P.lime}` }}>?</div>
      )}
      {/* Unknown customers: grey people with question marks */}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 920, display: "flex", justifyContent: "center", gap: 26 }}>
        {people.map((k, i) => (
          <div key={i} style={{ position: "relative", transform: `translateY(${(1 - mix(k)) * 60}px) scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
            <Person size={86} color={P.lineStrong} />
            <div style={{ position: "absolute", left: 30, top: -38, ...type.display, fontSize: 40, color: P.ink3 }}>?</div>
          </div>
        ))}
      </div>
      <Burst t={t} at={C.anjaan} x={540} y={380} r={360} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 8. Comment CTA: WANT TO LAUNCH YOUR FIRST EBOOK? COMMENT EBOOK

export const CommentScene: React.FC<S> = ({ t }) => {
  if (t < C.cta - 0.1 || t > C.link + 0.3) return null;
  const o = leave(t, C.link);
  const head = pop(t, C.tumBhi, { damping: 11, stiffness: 200 });
  const flow = ["DRAFT", "KIT", "LAUNCH"].map((_, i) => pop(t, C.launchKarna + i * 0.2, { damping: 11, stiffness: 220 }));
  const big = pop(t, C.ebookWord, { damping: 8, stiffness: 240 });
  const setup = pop(t, C.setup, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${sc(head)})`, transformOrigin: "540px 0" }}>
          <div style={{ ...type.display, fontSize: 70, color: P.ink, whiteSpace: "nowrap" }}>Want to launch</div>
          <div style={{ ...type.display, fontSize: 70, color: P.ink, whiteSpace: "nowrap" }}>
            your <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>first ebook?</span>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 535, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
        {["DRAFT", "KIT", "LAUNCH"].map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <Arrow k={mix(flow[i])} w={44} />}
            <div style={{ transform: `scale(${sc(flow[i])})`, opacity: Math.min(1, flow[i] * 2) }}>
              <Chip text={s} size={28} tone="card" />
            </div>
          </React.Fragment>
        ))}
      </div>
      <CommentCard t={t} at={C.comment - 0.1} keyword="EBOOK" typeAt={C.ebookWord - 0.25} typeTo={C.ebookWord + 0.15} sendAt={C.ebookWord + 0.3} top={680} />
      {big > 0 && (
        <div style={{ ...centre(540, 935, sc(big), `rotate(${(1 - mix(big)) * -12 - 2}deg)`) }}>
          <Sticker size={92} tone="lime" rotate={0}>
            COMMENT &quot;EBOOK&quot;
          </Sticker>
        </div>
      )}
      {setup > 0 && (
        <div style={{ ...centre(560, 1085, sc(setup), "rotate(2deg)") }}>
          <Chip text="I'LL REPLY WITH MY SETUP" size={28} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.ebookWord + 0.3} x={540} y={935} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 9. Link in bio: the real ebook page on a phone, the product box, ₹99

const PHONE = { x: 330, y: 790, w: 360 };
const SCREEN_W = PHONE.w * 0.93;
const IMG_S = SCREEN_W / 780;

export const LinkScene: React.FC<S> = ({ t }) => {
  if (t < C.link - 0.1 || t > C.journey + 0.3) return null;
  const o = leave(t, C.journey);
  const phone = pop(t, C.link, { damping: 13, stiffness: 160 });
  const box = pop(t, C.kit, { damping: 12, stiffness: 170 });
  const link = pop(t, C.linkWord, { damping: 8, stiffness: 240 });
  const ring = t > C.linkWord ? 0.5 + 0.5 * Math.sin((t - C.linkWord) * 8) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {phone > 0 && (
        <div style={{ ...centre(PHONE.x, lerp(1700, PHONE.y, eo(mix(phone))), 1, "rotate(-3deg)") }}>
          <PhoneShell w={PHONE.w} glow={ring * 0.6}>
            <StatusRow w={SCREEN_W} />
            <div style={{ position: "absolute", left: 12, right: 12, top: 34, height: 34, display: "flex", alignItems: "center", padding: "0 12px", borderRadius: 17, background: P.paper2, border: `2px solid ${P.line}` }}>
              <div style={{ ...type.label, letterSpacing: "0.01em", textTransform: "none", fontSize: 13, color: P.ink2, whiteSpace: "nowrap" }}>internetoolbox.com/ebook-launch-kit</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 76, bottom: 0, overflow: "hidden" }}>
              <Img src={staticFile("launch/site-buy.png")} style={{ position: "absolute", left: 0, top: -24 * IMG_S, width: SCREEN_W }} />
            </div>
          </PhoneShell>
        </div>
      )}
      {phone > 0 && <DemoTag text="Real page · internetoolbox.com" style={{ left: 130, top: 1290, opacity: mix(phone) }} />}
      {box > 0 && (
        <div style={{ ...centre(lerp(1300, 790, eo(mix(box))), 720, sc(box)) }}>
          <ProductBox w={260} t={t} yaw={-24 + Math.sin((t - C.kit) * 1.6) * 22} glow={0.9} />
        </div>
      )}
      {box > 0 && (
        <div style={{ ...centre(790, 960, sc(pop(t, C.kit + 0.25, { damping: 10, stiffness: 220 })), "rotate(2deg)") }}>
          <Sticker size={40} tone="ink" rotate={0}>
            EBOOK LAUNCH KIT
          </Sticker>
        </div>
      )}
      {box > 0 && (
        <div style={{ ...centre(800, 1060, sc(pop(t, C.kit + 0.45, { damping: 9, stiffness: 230 })), "rotate(-4deg)") }}>
          <Sticker size={84} tone="lime" rotate={0}>
            ₹99
          </Sticker>
        </div>
      )}
      {link > 0 && (
        <div style={{ ...centre(560, 400, sc(link), `rotate(${(1 - mix(link)) * -10 - 3}deg)`) }}>
          <Sticker size={84} tone="lime" rotate={0}>
            LINK IN BIO
          </Sticker>
        </div>
      )}
      <DemoTag text="Digital download · box is a mockup" style={{ left: 130, top: 1340, opacity: mix(box) }} />
      <Burst t={t} at={C.linkWord} x={560} y={400} r={360} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 10. Follow: the journey tracker, then the brand end card

const TRACK = ["Drafted", "Kit built", "Launched", "Real customers"];

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.journey - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.journey + 0.05, { damping: 10, stiffness: 210 });
  const fill = io(seg(t, C.journey + 0.2, C.kitni + 0.4));
  const mark = pop(t, C.follow + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.follow + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
  return (
    <>
      {nOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - nOut, transform: `scale(${1 - nOut * 0.2})`, transformOrigin: "540px 700px" }}>
          {head > 0 && (
            <div style={{ ...centre(540, 420, sc(head), "rotate(-1.5deg)") }}>
              <Sticker size={74} tone="ink" rotate={0}>
                THE JOURNEY CONTINUES
              </Sticker>
            </div>
          )}
          {/* Progress tracker: three steps done, the fourth still open */}
          <div style={{ position: "absolute", left: 110, width: 860, top: 640 }}>
            <div style={{ position: "absolute", left: 40, right: 40, top: 38, height: 14, borderRadius: 7, background: P.line, border: `3px solid ${P.ink}` }}>
              <div style={{ height: "100%", width: `${fill * 76}%`, background: P.lime, borderRadius: 7 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {TRACK.map((s, i) => {
                const k = pop(t, C.journey + 0.25 + i * 0.28, { damping: 10, stiffness: 220 });
                const done = i < 3;
                return (
                  <div key={s} style={{ width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${sc(k)})`, opacity: Math.min(1, k * 2) }}>
                    <div style={{ width: 90, height: 90, borderRadius: 45, background: done ? P.lime : P.card, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(5), display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 46, color: P.ink }}>
                      {done ? "✓" : "?"}
                    </div>
                    <div style={{ ...type.display, fontSize: 30, color: done ? P.ink : P.ink3, textAlign: "center", lineHeight: 1.1 }}>{s}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {t > C.kitni && (
            <div style={{ ...centre(540, 960, sc(pop(t, C.kitni + 0.1, { damping: 10, stiffness: 220 }))) }}>
              <Chip text="REAL NUMBERS ONLY · NEXT UPDATE SOON" size={28} tone="card" />
            </div>
          )}
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
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Build in public · Episode 02</div>}
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
