import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton } from "../brand/Cta";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag } from "../immich/kit";
import { eo, lerp, pop, seg } from "../mdh/kit";
import { C } from "../episodes/fable52";
import { Chip, mix, sc } from "../launch/kit";
import { Card3D, Streak } from "../fable/kit";
import { AnthropicLogo, ClaudeLogo, ClaudeSpark, CLAY } from "../fable/logos";
import { Mascot, MonthGrid, Particles, PipeStep, Term } from "./kit";

/**
 * "Fable 5.2: 3 things to try" scenes. Times come from src/episodes/fable52.ts. Bands: brand bug ~258, headlines
 * 320 to 470, main visual 480 to 1140, subtitles 1170 to 1290, the presenter below, all inside the safe zone.
 * Facts on screen follow Anthropic's help article "Claude Fable 5.2 launch offers" as read on 14 Nov 2026:
 * Pro plans get Fable 5.2 at no extra cost until 16 Nov 2026, 11:59 pm PT, up to 50% of weekly usage limits,
 * for subscriptions that were active before 9 Nov; not on the Free plan. No prices or billing screens are shown.
 * The plan card, the questions, the mascot, the goals and the month plan are illustrations and are labelled.
 */

type S = { t: number };
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera, wipes, streaks

export const CAM_ORIGIN = "540px 760px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.45)));
  const open = 0.12 * (1 - eo(seg(t, 0.0, 0.9)));
  return 1 + open + push(C.free, 0.07, 0.6) + push(C.extra, 0.04, 0.6) + push(C.mascot, 0.06, 0.9) + push(C.plan, 0.04, 0.6) + push(C.workflow, 0.04, 0.7) + push(C.kit, 0.06, 0.5);
};

export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.n3, C.n2, C.n1, C.aisi].map((at, i) => {
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
    <Streak t={t} at={C.free - 0.08} />
    <Streak t={t} at={C.ye - 0.05} />
    <Streak t={t} at={C.threeD - 0.1} dur={0.45} />
    <Streak t={t} at={C.kit - 0.1} />
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

const Arrow: React.FC<{ k: number; w?: number }> = ({ k, w = 60 }) => (
  <svg width={w} height={40} viewBox={`0 0 ${w} 40`} style={{ opacity: k, flex: "0 0 auto" }}>
    <path d={`M4 20 H${w - 10} M${w - 22} 8 L${w - 8} 20 L${w - 22} 32`} fill="none" stroke={P.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={w * 2} strokeDashoffset={(1 - k) * w * 2} />
  </svg>
);

/** "#3" badge plus the scene headline, on one row at the top of the safe zone. */
const NumHead: React.FC<{ t: number; at: number; n: number; children: React.ReactNode }> = ({ t, at, n, children }) => {
  const k = pop(t, at, { damping: 8, stiffness: 230 });
  if (k <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 80, width: 870, top: 325, height: 130, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 124, height: 124, flex: "0 0 auto", borderRadius: 34, background: P.ink, border: `5px solid ${P.ink}`, boxShadow: `7px 7px 0 ${P.lime}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sc(k)}) rotate(${lerp(-30, -5, mix(k))}deg)` }}>
        <div style={{ ...type.display, fontSize: 84, color: P.lime, letterSpacing: "-0.06em" }}>#{n}</div>
      </div>
      <div style={{ position: "relative", height: 130, flex: 1 }}>{children}</div>
    </div>
  );
};

/** A headline inside NumHead that shows between two times. */
const HeadText: React.FC<{ t: number; at: number; out?: number; size?: number; children: React.ReactNode }> = ({ t, at, out, size = 70, children }) => {
  const k = pop(t, at, { damping: 11, stiffness: 210 });
  const o = out === undefined ? 0 : eo(seg(t, out - 0.15, out + 0.05));
  if (k <= 0 || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, height: 130, display: "flex", alignItems: "center", ...type.display, fontSize: size, color: P.ink, whiteSpace: "nowrap", opacity: 1 - o, transform: `translateX(${(1 - mix(k)) * 60}px) scale(${0.9 + 0.1 * sc(k)})`, transformOrigin: "0 50%" }}>{children}</div>
  );
};

const Lime: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px", margin: "0 2px" }}>{children}</span>;

// =================================================================================================================
// 1. Hook: FABLE 5.2 (on frame 0) → FREE?! → LIMITED TIME!

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.pro + 0.3) return null;
  const o = leave(t, C.pro);
  const card = pop(t, -0.4, { damping: 12, stiffness: 160 });
  const fiveTwo = pop(t, C.fiveTwo, { damping: 8, stiffness: 240 });
  const free = pop(t, C.free, { damping: 8, stiffness: 250 });
  const lim = pop(t, C.bas, { damping: 9, stiffness: 230 });
  const who = pop(t, C.dino, { damping: 11, stiffness: 200 });
  const topOut = eo(seg(t, C.bas - 0.15, C.bas));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {topOut < 1 && (
        <div style={{ ...centre(540, 412, 1, "rotate(-1.5deg)"), opacity: 1 - topOut }}>
          <Slam t={t} at={-0.35}>
            <Sticker size={66} tone="ink" rotate={0}>
              NEW CLAUDE MODEL
            </Sticker>
          </Slam>
        </div>
      )}
      {lim > 0 && (
        <div style={{ ...centre(540, 385, sc(lim), `rotate(${(1 - mix(lim)) * 10 - 2}deg)`) }}>
          <Sticker size={84} tone="ink" rotate={0}>
            LIMITED TIME!
          </Sticker>
        </div>
      )}
      {/* The Fable 5.2 model card: real Claude logo, the model name typeset (no separate Fable logo exists) */}
      <div style={{ ...centre(540, lerp(760, 720, eo(mix(free))), sc(card)) }}>
        <Card3D k={card} t={t} yaw={26}>
          <div style={{ width: 780, background: "#141413", border: `6px solid ${P.ink}`, borderRadius: 34, padding: "40px 46px 34px", boxShadow: `${shadow.hard(10)}, 0 0 ${60 + 40 * Math.sin(t * 3)}px rgba(217,119,87,0.45)`, display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ position: "absolute", left: -100 + ((t * 60 + i * 150) % 1000), top: 0, width: 2, height: "100%", background: "rgba(250,249,245,0.06)", transform: "skewX(-20deg)" }} />
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ClaudeLogo h={64} light />
              <div style={{ ...type.label, fontSize: 18, color: "#141413", background: P.lime, borderRadius: 999, padding: "6px 14px" }}>AI MODEL</div>
            </div>
            <div style={{ ...type.display, fontSize: 158, color: "#FAF9F5", letterSpacing: "-0.05em", lineHeight: 0.95, whiteSpace: "nowrap" }}>
              Fable <span style={{ display: "inline-block", color: CLAY, transform: `scale(${t < C.fiveTwo ? 1 : 1 + 0.25 * Math.max(0, 1 - fiveTwo) + (fiveTwo > 1 ? (fiveTwo - 1) * 0.6 : 0)})`, transformOrigin: "30% 60%" }}>5.2</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid rgba(250,249,245,0.18)", paddingTop: 14 }}>
              <AnthropicLogo h={18} light />
              <div style={{ fontFamily: mono, fontSize: 18, color: "#9C998F" }}>launched 9 Nov 2026</div>
            </div>
          </div>
        </Card3D>
      </div>
      {free > 0 && (
        <div style={{ ...centre(700, 985, sc(free), `rotate(${(1 - mix(free)) * 16 - 6}deg)`) }}>
          <div style={{ ...type.display, fontSize: 170, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 34, padding: "8px 34px 18px", boxShadow: shadow.hard(12), whiteSpace: "nowrap", letterSpacing: "-0.05em" }}>FREE?!</div>
        </div>
      )}
      {who > 0 && (
        <div style={{ ...centre(540, 492, sc(who)) }}>
          <Chip text="Claude Pro offer · ends 16 Nov (PT)" size={30} tone="card" />
        </div>
      )}
      <Burst t={t} at={C.free} x={700} y={985} r={460} color={P.lime} />
      <Burst t={t} at={C.bas} x={540} y={385} r={300} color={P.ink} />
    </div>
  );
};

// =================================================================================================================
// 2. Claude Pro → Fable 5.2, no extra cost, with the real limits

const PLAN_ROWS = ["Fable 5.2 included this week", "Up to 50% of weekly usage limits", "Ends 16 Nov 2026, 11:59 pm PT", "Pro plans active before 9 Nov"];

export const ProScene: React.FC<S> = ({ t }) => {
  if (t < C.pro - 0.1 || t > C.ye + 0.3) return null;
  const o = leave(t, C.ye);
  const a = pop(t, C.pro, { damping: 10, stiffness: 220 });
  const b = pop(t, C.toh + 0.1, { damping: 10, stiffness: 220 });
  const card = pop(t, C.pro + 0.1, { damping: 13, stiffness: 160 });
  const no = pop(t, C.extra, { damping: 8, stiffness: 250 });
  const lab = pop(t, C.tryK, { damping: 11, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 340, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
        <div style={{ transform: `scale(${sc(a)})` }}>
          <Chip text="CLAUDE PRO" size={46} tone="card" />
        </div>
        <Arrow k={eo(seg(t, C.toh, C.toh + 0.3))} w={80} />
        <div style={{ transform: `scale(${sc(b)})` }}>
          <Chip text="FABLE 5.2" size={46} tone="lime" />
        </div>
      </div>
      {card > 0 && (
        <div style={{ ...centre(540, lerp(1300, 770, eo(mix(card)))) }}>
          <Card3D k={card} t={t} yaw={-20}>
            <div style={{ width: 720, background: "#FAF9F5", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), padding: "30px 36px 30px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <ClaudeLogo h={56} />
                <div style={{ ...type.display, fontSize: 44, color: "#141413", background: "#F0EEE6", border: "3px solid #141413", borderRadius: 14, padding: "2px 18px 6px" }}>Pro</div>
              </div>
              <div style={{ height: 3, background: "#E3E0D6" }} />
              {PLAN_ROWS.map((r, i) => {
                const k = eo(seg(t, C.toh + 0.2 + i * 0.22, C.toh + 0.45 + i * 0.22));
                return (
                  <div key={r} style={{ display: "flex", alignItems: "center", gap: 16, opacity: k, transform: `translateX(${(1 - k) * 40}px)` }}>
                    <div style={{ width: 40, height: 40, flex: "0 0 auto", borderRadius: 12, background: i === 0 ? P.lime : "#F0EEE6", border: `3px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 26, color: P.ink }}>{i === 0 ? "✓" : "i"}</div>
                    <div style={{ ...type.body, fontWeight: i === 0 ? 700 : 600, fontSize: 36, color: "#141413", whiteSpace: "nowrap" }}>{r}</div>
                  </div>
                );
              })}
            </div>
          </Card3D>
        </div>
      )}
      {card > 0 && <DemoTag text="Illustration · facts: Claude Help Center, 14 Nov 2026" style={{ left: 190, top: 1000, opacity: mix(card) }} />}
      {no > 0 && (
        <div style={{ ...centre(760, 555, sc(no), `rotate(${(1 - mix(no)) * 14 + 4}deg)`) }}>
          <Sticker size={62} tone="lime" rotate={0}>
            NO EXTRA COST
          </Sticker>
        </div>
      )}
      {lab > 0 && (
        <div style={{ ...centre(540, 1085, sc(lab)) }}>
          <Chip text="Eligible access • Usage limits apply" size={34} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.extra} x={760} y={555} r={320} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 3. Countdown: 3, 2, 1

export const CountScene: React.FC<S> = ({ t }) => {
  if (t < C.ye - 0.1 || t > C.n3 + 0.3) return null;
  const o = leave(t, C.n3);
  const head = pop(t, C.ye, { damping: 10, stiffness: 210 });
  const span = Math.max(0.2, (C.n3 - C.teen - 0.5) / 3);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 400, sc(head), "rotate(-1.5deg)") }}>
          <Sticker size={74} tone="ink" rotate={0}>
            3 KAMAAL KE KAAM
          </Sticker>
        </div>
      )}
      {[3, 2, 1].map((n, i) => {
        const at = C.teen + i * span;
        const k = pop(t, at, { damping: 8, stiffness: 240 });
        if (k <= 0) return null;
        const hot = t >= at && t < at + span;
        return (
          <div key={n} style={{ ...centre(230 + i * 310, 800 + Math.sin(t * 2 + i) * 8, sc(k), `rotate(${(i - 1) * 5 + (1 - mix(k)) * 25}deg)`) }}>
            <div style={{ width: 270, height: 380, borderRadius: 34, border: `7px solid ${P.ink}`, background: hot ? P.lime : i === 2 ? P.ink : P.card, boxShadow: shadow.hard(10), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <div style={{ ...type.label, fontSize: 24, color: !hot && i === 2 ? "#D9D6CC" : P.ink2 }}>NUMBER</div>
              <div style={{ ...type.display, fontSize: 230, lineHeight: 0.9, color: !hot && i === 2 ? P.lime : P.ink, letterSpacing: "-0.06em" }}>{n}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =================================================================================================================
// 4. Number 3: five answers → your own 3D animal mascot

const QUESTIONS = ["Favourite animal?", "3 words about you?", "Favourite colour?", "Your hobby?", "Your superpower?"];

export const MascotScene: React.FC<S> = ({ t }) => {
  if (t < C.n3 - 0.1 || t > C.n2 + 0.3) return null;
  const o = leave(t, C.n2);
  const card = pop(t, C.apne, { damping: 13, stiffness: 170 });
  const fly = seg(t, C.aurAi, C.threeD + 0.1);
  const away = eo(seg(t, C.aurAi, C.aurAi + 0.5));
  const m = pop(t, C.threeD, { damping: 9, stiffness: 170 });
  const qStep = Math.max(0.12, (C.jawab - C.paanch) / 5);
  const tStep = Math.max(0.1, (C.aurAi - C.jawab) / 5);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <NumHead t={t} at={C.n3} n={3}>
        <HeadText t={t} at={C.n3 + 0.15} out={C.threeD}>
          <Lime>5 QUESTIONS</Lime>
        </HeadText>
        <HeadText t={t} at={C.threeD} size={62}>
          YOUR <Lime>3D MASCOT</Lime>
        </HeadText>
      </NumHead>
      {card > 0 && away < 1 && (
        <div style={{ ...centre(lerp(540, 250, away), 800, sc(card) * lerp(1, 0.5, away), `rotate(${-2 - away * 6}deg)`), opacity: 1 - away * 0.9 }}>
          <div style={{ width: 720, background: "#FAF9F5", border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), padding: "24px 30px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ClaudeSpark size={44} />
              <div style={{ ...type.display, fontSize: 38, color: "#141413" }}>Apne baare mein</div>
              <div style={{ marginLeft: "auto", ...type.label, fontSize: 20, color: P.ink3 }}>5 SAWAAL</div>
            </div>
            {QUESTIONS.map((q, i) => {
              const k = eo(seg(t, C.paanch + i * qStep, C.paanch + i * qStep + 0.2));
              const done = pop(t, C.jawab + i * tStep, { damping: 9, stiffness: 260 });
              return (
                <div key={q} style={{ display: "flex", alignItems: "center", gap: 14, opacity: k, transform: `translateX(${(1 - k) * -40}px)`, background: done > 0 ? P.limeWash : "#fff", border: `3px solid ${P.ink}`, borderRadius: 16, padding: "10px 16px" }}>
                  <div style={{ ...type.label, fontSize: 22, color: P.ink3, width: 40 }}>Q{i + 1}</div>
                  <div style={{ ...type.body, fontWeight: 600, fontSize: 34, color: "#141413", whiteSpace: "nowrap", flex: 1 }}>{q}</div>
                  <div style={{ width: 42, height: 42, borderRadius: 12, border: `3px solid ${P.ink}`, background: done > 0 ? P.lime : "#fff", display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 28, color: P.ink }}>
                    <span style={{ transform: `scale(${sc(done)})` }}>✓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <Particles from={[420, 800]} to={[560, 790]} k={fly} />
      {m > 0 && (
        <>
          <div style={{ ...centre(560, 810, sc(m)), width: 560, height: 560, borderRadius: 999, background: `radial-gradient(circle at 40% 35%, ${P.limeSoft}, ${P.lime} 70%)`, border: `6px solid ${P.ink}`, boxShadow: `${shadow.hard(10)}, 0 0 ${70 + 30 * Math.sin(t * 3)}px rgba(200,241,105,0.9)` }} />
          <div style={{ ...centre(560, 800 + Math.sin(t * 2.2) * 8, sc(m), `rotate(${Math.sin(t * 1.6) * 3}deg)`) }}>
            <Mascot size={430} t={t} />
          </div>
          <DemoTag text="Illustrative mascot · drawn for this reel" style={{ left: 330, top: 1100, opacity: mix(m) }} />
        </>
      )}
      <Burst t={t} at={C.threeD} x={560} y={800} r={520} color={P.lime} />
      <Sparks t={t} at={C.mascot} x={560} y={780} n={14} r={360} />
    </div>
  );
};

// =================================================================================================================
// 5. Number 2: 2027 goals → a month-by-month action plan

const GOALS = ["Launch 1 digital product", "Post 100 reels", "Learn a new AI skill"];

export const PlanScene: React.FC<S> = ({ t }) => {
  if (t < C.n2 - 0.1 || t > C.n1 + 0.3) return null;
  const o = leave(t, C.n1);
  const goals = pop(t, C.goals2027 - 0.1, { damping: 13, stiffness: 170 });
  const up = eo(seg(t, C.month - 0.25, C.month + 0.15));
  const grid = pop(t, C.month - 0.1, { damping: 13, stiffness: 170 });
  const step = Math.max(0.06, (C.n1 - 0.35 - C.month) / 12);
  const gStep = Math.max(0.15, (C.month - 0.4 - C.goals2027) / 3);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <NumHead t={t} at={C.n2} n={2}>
        <HeadText t={t} at={C.n2 + 0.15} out={C.month} size={74}>
          <Lime>2027</Lime> GOALS
        </HeadText>
        <HeadText t={t} at={C.month} size={60}>
          2027 <Lime>ACTION PLAN</Lime>
        </HeadText>
      </NumHead>
      {goals > 0 && up < 1 && (
        <div style={{ ...centre(540, lerp(790, 620, up), sc(goals) * lerp(1, 0.7, up), "rotate(-1.5deg)"), opacity: 1 - up }}>
          <div style={{ width: 760, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), padding: "22px 30px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ ...type.display, fontSize: 44, color: P.ink }}>My 2027 goals</div>
              <div style={{ ...type.label, fontSize: 18, color: P.ink3, border: `2px solid ${P.line}`, borderRadius: 8, padding: "4px 10px" }}>SAMPLE</div>
            </div>
            {GOALS.map((g, i) => {
              const k = pop(t, C.goals2027 + 0.1 + i * gStep, { damping: 11, stiffness: 220 });
              return (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 16, opacity: mix(k), transform: `translateX(${(1 - mix(k)) * 50}px)`, background: i === 0 ? P.limeWash : P.paper, border: `3px solid ${P.ink}`, borderRadius: 16, padding: "12px 18px" }}>
                  <div style={{ width: 46, height: 46, flex: "0 0 auto", borderRadius: 99, background: P.ink, color: P.lime, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 28 }}>{i + 1}</div>
                  <div style={{ ...type.body, fontWeight: 700, fontSize: 40, color: P.ink, whiteSpace: "nowrap" }}>{g}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {grid > 0 && (
        <div style={{ ...centre(540, 850, mix(grid)), opacity: mix(grid) }}>
          <MonthGrid t={t} at={C.month} step={step} w={860} />
        </div>
      )}
      {grid > 0 && (
        <div style={{ ...centre(540, 545, sc(pop(t, C.month + 0.05, { damping: 9, stiffness: 230 })), "rotate(-2deg)"), zIndex: 3 }}>
          <Chip text="MONTH-BY-MONTH" size={40} tone="ink" />
        </div>
      )}
      {grid > 0 && <DemoTag text="Sample plan · a plan is a start, not a guarantee" style={{ left: 250, top: 1075, opacity: mix(grid) }} />}
      <Burst t={t} at={C.plan} x={540} y={850} r={480} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 6. Number 1: Claude Code builds your reel workflow (real project names, real covers; every step needs you)

const PIPE = ["IDEA", "SCRIPT", "VOICE", "CAPTIONS", "REMOTION", "MP4"];
const FILES = ["src/brand/", "public/voice.wav", "episodes/captions.ts", "out/reel.mp4"];
const REAL = ["mdh", "claude", "ebay"];

export const WorkflowScene: React.FC<S> = ({ t }) => {
  if (t < C.n1 - 0.1 || t > C.aisi + 0.3) return null;
  const o = leave(t, C.aisi);
  const term = pop(t, C.claudeCode - 0.15, { damping: 13, stiffness: 170 });
  const folder = pop(t, C.claudeCode + 0.7, { damping: 11, stiffness: 200 });
  const P0 = C.reel + 0.2;
  const pStep = Math.max(0.12, (C.aisi - 0.75 - (C.reel + 0.2)) / 6);
  const now = Math.floor((t - (C.reel + 0.2)) / pStep);
  const real = pop(t, C.workflow, { damping: 10, stiffness: 190 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <NumHead t={t} at={C.n1} n={1}>
        <HeadText t={t} at={C.n1 + 0.15} out={C.workflow} size={74}>
          <Lime>CLAUDE CODE</Lime>
        </HeadText>
        <HeadText t={t} at={C.workflow} size={58}>
          AI REEL <Lime>WORKFLOW</Lime>
        </HeadText>
      </NumHead>
      {term > 0 && (
        <div style={{ ...centre(430, lerp(1300, 625, eo(mix(term))), 1, "rotate(-1deg)") }}>
          <Term
            t={t}
            w={640}
            fs={26}
            minH={170}
            title="reel-01 · claude"
            lines={[
              { text: "claude", at: C.claudeCode - 0.05, to: C.claudeCode + 0.3, tone: "cmd" },
              { text: "✻ Claude Code", at: C.claudeCode + 0.35, tone: "clay" },
              { text: "AI reel workflow taiyaar karo", at: C.claudeCode + 0.7, to: C.workflow, tone: "you" },
              { text: "reel-01/ folder ready", at: C.workflow + 0.1, tone: "ok" },
            ]}
          />
        </div>
      )}
      {/* the project folder opens: real file names from this project */}
      {folder > 0 && (
        <div style={{ position: "absolute", left: 100, width: 850, top: 790, display: "flex", alignItems: "center", gap: 7, transform: `scale(${sc(folder)})`, transformOrigin: "0 50%" }}>
          <svg width={54} height={46} viewBox="0 0 54 46" style={{ flex: "0 0 auto" }}>
            <path d="M3 8 h18 l6 7 h24 v26 h-48z" fill={P.lime} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M3 41 l${6 + 3 * mix(folder)} -20 h45 l-3 20z`} fill={P.limeDeep} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
          </svg>
          {FILES.map((f, i) => {
            const k = pop(t, C.claudeCode + 0.8 + i * 0.14, { damping: 11, stiffness: 230 });
            return (
              <div key={f} style={{ fontFamily: mono, fontWeight: 600, fontSize: 18, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "5px 7px", whiteSpace: "nowrap", transform: `scale(${sc(k)})`, opacity: mix(k) }}>{f}</div>
            );
          })}
        </div>
      )}
      {/* the pipeline */}
      {t > P0 - 0.2 && (
        <div style={{ position: "absolute", left: 110, width: 860, top: 862, display: "flex", flexWrap: "wrap", gap: 14, opacity: eo(seg(t, P0 - 0.2, P0)) }}>
          {PIPE.map((p, i) => (
            <PipeStep key={p} label={p} n={i + 1} k={seg(t, P0 + i * pStep, P0 + i * pStep + 0.2)} hot={now === i || (i === 5 && now >= 5)} w={(860 - 28) / 3} />
          ))}
        </div>
      )}
      {/* real covers of reels made in this project */}
      {real > 0 &&
        REAL.map((r, i) => (
          <div key={r} style={{ ...centre(808 + i * 52, 590 + i * 22, sc(pop(t, C.workflow + i * 0.12, { damping: 10, stiffness: 200 })), `rotate(${-9 + i * 8}deg)`), zIndex: 4 }}>
            <Img src={staticFile(`fable52/real-${r}.jpg`)} style={{ width: 116, height: 206, objectFit: "cover", borderRadius: 12, border: `4px solid ${P.ink}`, boxShadow: shadow.hard(5), display: "block" }} />
          </div>
        ))}
      {real > 0 && <DemoTag text="Real reel covers" style={{ left: 752, top: 742, opacity: mix(real), zIndex: 5 }} />}
      {t > C.workflow && (
        <div style={{ ...centre(540, 1105, sc(pop(t, C.taiyaar, { damping: 10, stiffness: 210 }))) }}>
          <Chip text="Har step par aap guide karte ho" size={30} tone="ink" />
        </div>
      )}
      <Burst t={t} at={P0 + 5 * pStep} x={830} y={1000} r={200} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 7. The kit: the real guide cover

export const KitScene: React.FC<S> = ({ t }) => {
  if (t < C.aisi - 0.1 || t > C.comment + 0.3) return null;
  const o = leave(t, C.comment);
  const head = pop(t, C.aisi + 0.05, { damping: 10, stiffness: 210 });
  const cover = pop(t, C.aisi + 0.25, { damping: 12, stiffness: 160 });
  const a = pop(t, C.animated, { damping: 9, stiffness: 230 });
  const b = pop(t, C.seekhna, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {head > 0 && (
        <div style={{ ...centre(540, 395, sc(head)), ...type.display, fontSize: 70, color: P.ink, whiteSpace: "nowrap" }}>
          Aisi <Lime>ANIMATED REELS</Lime>?
        </div>
      )}
      {cover > 0 && (
        <div style={{ ...centre(lerp(-300, 340, eo(mix(cover))), 800) }}>
          <Card3D k={cover} t={t} yaw={28}>
            <Img src={staticFile("fable52/kit-cover.png")} style={{ width: 400, height: 566, display: "block", borderRadius: 18, border: `6px solid ${P.ink}`, boxShadow: `${shadow.hard(10)}, 0 0 50px rgba(200,241,105,0.7)` }} />
          </Card3D>
        </div>
      )}
      {cover > 0 && <DemoTag text="Real guide cover" style={{ left: 240, top: 1098, opacity: mix(cover) }} />}
      {a > 0 && (
        <div style={{ ...centre(790, 660, sc(a), `rotate(${(1 - mix(a)) * 12 + 3}deg)`) }}>
          <div style={{ ...type.display, fontSize: 68, lineHeight: 1, color: P.lime, background: P.ink, border: `6px solid ${P.ink}`, borderRadius: 26, padding: "18px 26px 24px", boxShadow: `8px 8px 0 ${P.lime}`, textAlign: "center" }}>
            AI REEL
            <br />
            CREATION
            <br />
            KIT
          </div>
        </div>
      )}
      {b > 0 && (
        <div style={{ ...centre(790, 900, sc(b), "rotate(-2deg)") }}>
          <Chip text="STEP-BY-STEP SETUP" size={30} tone="lime" />
        </div>
      )}
      {b > 0 && (
        <div style={{ ...centre(790, 980, sc(pop(t, C.seekhna + 0.15, { damping: 10, stiffness: 220 })), "rotate(2deg)") }}>
          <Chip text="+ PROMPTS" size={34} tone="card" />
        </div>
      )}
      <Burst t={t} at={C.animated} x={790} y={660} r={320} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 8. Comment KIT (no fake comments, no DMs shown)

export const CommentScene: React.FC<S> = ({ t }) => {
  if (t < C.comment - 0.1 || t > C.aur + 0.3) return null;
  const o = leave(t, C.aur);
  const bubble = pop(t, C.comment, { damping: 11, stiffness: 190 });
  const big = pop(t, C.kit, { damping: 8, stiffness: 240 });
  const items: [string, number][] = [
    ["Step-by-step", C.step],
    ["Setup", C.setup],
    ["Prompts", C.prompts],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <div style={{ position: "absolute", left: 90, width: 900, top: 350, display: "flex", justifyContent: "center", gap: 14 }}>
        {items.map(([s, at], i) => {
          const k = pop(t, at, { damping: 10, stiffness: 230 });
          return (
            <div key={s} style={{ transform: `scale(${sc(k)}) rotate(${(i - 1) * 2}deg)`, opacity: Math.min(1, k * 2) }}>
              <Chip text={`✓ ${s}`} size={36} tone={i === 2 ? "lime" : "card"} />
            </div>
          );
        })}
      </div>
      {bubble > 0 && (
        <div style={{ ...centre(lerp(1180, 872, eo(mix(bubble))), 555, 1, `rotate(${8 + Math.cos(t * 1.5) * 3}deg)`) }}>
          <Img src={staticFile("fable52/kit-cover.png")} style={{ width: 150, height: 212, display: "block", borderRadius: 10, border: `4px solid ${P.ink}`, boxShadow: shadow.hard(6) }} />
        </div>
      )}
      {bubble > 0 && (
        <div style={{ ...centre(540, 800, sc(bubble), `rotate(${(1 - mix(bubble)) * -8 - 1.5}deg)`) }}>
          <div style={{ position: "relative", width: 640, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 44, boxShadow: shadow.hard(10), padding: "30px 30px 34px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ ...type.label, fontSize: 34, color: P.ink2 }}>COMMENT</div>
            <div style={{ ...type.display, fontSize: 210, color: P.ink, lineHeight: 0.92, background: big > 0 ? P.lime : "transparent", borderRadius: 26, padding: "0 30px 10px", transform: `scale(${big > 0 ? sc(big) : 1})`, letterSpacing: "-0.04em" }}>KIT</div>
            <div style={{ ...type.label, fontSize: 25, color: P.ink, background: P.paper2, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "7px 18px", marginTop: 8, whiteSpace: "nowrap" }}>AI REEL WORKFLOW + PROMPTS</div>
            <svg width={90} height={70} viewBox="0 0 90 70" style={{ position: "absolute", left: 70, bottom: -62 }}>
              <path d="M6 0 L84 0 L10 64 Z" fill={P.card} stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
              <rect x="0" y="-8" width="90" height="12" fill={P.card} />
            </svg>
          </div>
        </div>
      )}
      <Burst t={t} at={C.kit} x={540} y={790} r={440} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 9. Follow @internetoolbox

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.aur - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const head = pop(t, C.aur + 0.05, { damping: 10, stiffness: 210 });
  const mark = pop(t, C.follow + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.follow + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
  const tricks = ["AI tools", "Real setups", "Honest limits"];
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
        <div style={{ ...centre(540, 540, sc(mark) * bump, `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 720, mix(handle)), ...type.display, fontSize: 64, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <Lime>@INTERNETOOLBOX</Lime>
        </div>
      )}
      {handle > 0 && <div style={{ ...centre(540, 805, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Internet Toolbox · AI tricks</div>}
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
