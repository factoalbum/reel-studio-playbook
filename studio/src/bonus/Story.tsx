import React from "react";
import { random } from "remotion";
import { Burst, Mark as Reaction, Sticker } from "../brand/Bits";
import { FollowButton } from "../brand/Cta";
import { Headline } from "../brand/Headline";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { C, bonus } from "../episodes/bonus";
import { eo, Eyebrow, go, lerp, pop, seg, vis } from "../mdh/kit";
import { BrandMark } from "../brand/Chrome";
import { Calculator, centre, Desk, DiyaRow, FEST, Garland, Heart, NotEqual, PaperPlane, Person, Phone, SalarySlip, Scales, Sparks, Stamp, TickBox, WarmGlow } from "./kit";

/**
 * The Diwali bonus reel, scene by scene. Every time comes from src/episodes/bonus.ts (cue table C), which follows the
 * owner's recording. The presenter (brand Avatar) explains; the employee and the manager act the situations out.
 * Layers: Festive (back) > scenes > Avatar > front props > chrome > subtitles.
 */

type S = { t: number };

const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);
const blinkAt = (t: number, list: number[]) => list.some((b) => t >= b && t < b + 0.12);

/** Camera push used on the big beats: returns a scale around CAM_ORIGIN. */
export const CAM_ORIGIN = "540px 1000px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.9) => amt * eo(seg(t, at, at + 0.35)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  return 1 + push(C.avatarIn, 0.08, 1.4) + push(C.wait, 0.1, 1.0);
};

/** Colour bars that sweep across a hard scene change. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.checksAt, C.revealAt, C.twistAt, C.actAt, C.shareAt].map((at, i) => {
      const k = seg(t, at - 0.2, at + 0.2);
      if (k <= 0 || k >= 1) return null;
      return (
        <div key={at} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
          <div style={{ flex: 1, background: i % 2 ? FEST.marigold : P.ink }} />
          <div style={{ flex: 1, background: i % 2 ? P.ink : P.lime }} />
        </div>
      );
    })}
  </>
);

/** Festive frame: warm glow, the marigold toran above the brand row, diyas at the foot. */
export const Festive: React.FC<S> = ({ t }) => (
  <>
    <WarmGlow k={0.9} />
    <Garland t={t} y={150} swags={3} depth={56} />
    <DiyaRow t={t} y={1652} xs={[120, 360, 720, 960]} s={0.72} />
  </>
);

// =================================================================================================================
// 1. The hook (0 to C.checksAt): payday notification, BONUS ₹0 stamp, the presenter bursts in, "LEGAL RIGHT?"

export const HookBack: React.FC<S> = ({ t }) => {
  if (t > C.checksAt + 0.3) return null;
  const slide = go(t, C.avatarIn, C.avatarIn + 0.5);
  const x = lerp(760, 800, slide);
  const s = lerp(1.05, 0.9, slide);
  const face = t < C.stampAt ? "happy" : t < C.legalAt ? "shocked" : t < C.teenAt ? "worried" : "curious";
  return <Person who="emp" x={x} bottom={1560} s={s} pose={t < C.avatarIn + 0.2 ? "hold" : t < C.teenAt ? "head" : "look"} face={face} t={t} blink={blinkAt(t, [2.9, 5.6])} flip />;
};

export const HookFront: React.FC<S> = ({ t }) => {
  if (t > C.checksAt + 0.3) return null;
  const slideIn = eo(seg(t, 0, 0.35));
  const away = eo(seg(t, C.avatarIn, C.avatarIn + 0.45));
  const notif = seg(t, 0.12, 0.5);
  const st = pop(t, C.stampAt, { damping: 8, stiffness: 240 });
  const sh = shakeAt(t, C.stampAt, 18);
  const legal = pop(t, C.legalAt, { damping: 9, stiffness: 220 });
  return (
    <>
      {/* The phone in the employee's hand, then thrown aside when the presenter arrives. */}
      {away < 1 && (
        <div style={{ ...centre(lerp(420, -260, away), lerp(1010, 880, away), lerp(0.9, 1, slideIn), `rotate(${lerp(-6, -40, away)}deg) translate(${sh}px, 0)`) }}>
          <Phone t={t} k={notif} w={330} zero={t >= C.stampAt ? 1 : 0} />
          <div style={{ position: "absolute", left: "50%", top: 470, transform: "translateX(-50%)" }}>
            <Stamp p={st} text="BONUS: ₹0?!" size={70} rotate={-12} />
          </div>
        </div>
      )}
      <Burst t={t} at={C.stampAt} x={420} y={1080} r={300} color={FEST.red} />
      <Reaction t={t} at={C.stampAt + 0.1} x={930} y={760} text="?!" color={FEST.marigold} size={80} rot={12} />
      {/* "Ho sakta hai ye tera legal haq ho": the scales swing in. */}
      {legal > 0 && t < C.teenAt + 0.1 && (
        <div style={{ ...centre(540, 470, Math.min(1.06, legal) * (1 - 0.2 * go(t, C.teenAt - 0.2, C.teenAt + 0.1)), `rotate(${(1 - Math.min(1, legal)) * -10}deg)`), opacity: 1 - seg(t, C.teenAt - 0.1, C.teenAt + 0.1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, background: P.ink, borderRadius: 30, padding: "16px 36px 16px 22px", boxShadow: `9px 9px 0 ${P.lime}` }}>
            <div style={{ background: P.card, borderRadius: 20, padding: 8, display: "flex" }}>
              <Scales size={96} tilt={10 * Math.sin(t * 4) * Math.exp(-(t - C.legalAt) * 1.5)} />
            </div>
            <div style={{ ...type.display, fontSize: 92, color: P.lime, whiteSpace: "nowrap" }}>LEGAL RIGHT?</div>
          </div>
        </div>
      )}
      <Burst t={t} at={C.legalAt} x={540} y={470} r={360} color={P.lime} />
      {/* "Bas teen cheezein check kar": three empty boxes, numbered. */}
      {[0, 1, 2].map((i) => {
        const k = pop(t, C.teenAt + i * 0.16, { damping: 10, stiffness: 200 });
        if (k <= 0) return null;
        const out = seg(t, C.checksAt - 0.25, C.checksAt);
        return (
          <div key={i} style={{ ...centre(300 + i * 240, 470 - 140 * out, Math.min(1.05, k) * (1 - 0.4 * out)), display: "flex", alignItems: "center", gap: 12, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 22, padding: "12px 20px", boxShadow: shadow.hard(6) }}>
            <div style={{ ...type.display, fontSize: 64, color: P.ink }}>{i + 1}</div>
            <TickBox k={0} size={60} />
          </div>
        );
      })}
      {t > C.checkWord && t < C.checksAt && (
        <div style={{ ...centre(540, 610, Math.min(1.05, pop(t, C.checkWord, { damping: 9 }))) }}>
          <Sticker size={56} tone="lime" rotate={-3}>
            Teen cheezein check kar
          </Sticker>
        </div>
      )}
    </>
  );
};

/** The hook title, outside the camera push so it never runs into the logo row. Each word lands when it is said. */
export const HookTitle: React.FC<S> = ({ t }) => {
  if (t > C.legalAt + 0.2) return null;
  const sh = shakeAt(t, C.stampAt, 18);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${sh * 0.5}px, 0)` }}>
      <Headline
        t={t}
        top={330}
        inAt={C.titleAt}
        outAt={C.legalAt - 0.25}
        lines={[
          { size: 104, segs: [{ text: "DIWALI", at: C.titleAt }, { text: "BONUS", at: C.bonusWord }] },
          { size: 104, segs: [{ text: "NAHI MILA?!", at: C.nahiWord, tone: "lime" }] },
        ]}
        pulse={{ text: "NAHI MILA?!", at: C.milaWord }}
      />
    </div>
  );
};

// =================================================================================================================
// 2. Three checks (C.checksAt to C.revealAt). One card at a time in the middle; the progress row stays on top.

const CHECKS = [
  { n: 1, short: "Wages", at: () => C.c1, done: () => C.c1done },
  { n: 2, short: "20+ staff", at: () => C.c2, done: () => C.c2done },
  { n: 3, short: "30 days", at: () => C.c3, done: () => C.c3done },
];

const ProgressRow: React.FC<S> = ({ t }) => {
  if (t < C.checksAt || t > C.revealAt + 0.2) return null;
  const k = eo(seg(t, C.checksAt, C.checksAt + 0.35));
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 340 - 60 * (1 - k), opacity: k, display: "flex", justifyContent: "center", gap: 16 }}>
      {CHECKS.map((c) => {
        const on = t >= c.at();
        const done = t >= c.done();
        return (
          <div key={c.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px 10px 12px", borderRadius: 999, border: `4px solid ${P.ink}`, background: done ? P.lime : on ? P.card : P.paper2, boxShadow: on ? shadow.hard(5) : "none", transform: `scale(${on && !done ? 1.08 : 1})` }}>
            <TickBox k={done ? Math.min(1, (t - c.done()) / 0.25) : 0} size={44} />
            <div style={{ ...type.display, fontSize: 34, color: P.ink, whiteSpace: "nowrap" }}>{c.short}</div>
          </div>
        );
      })}
    </div>
  );
};

/** The frame every check card shares. */
const CheckCard: React.FC<{ t: number; from: number; to: number; done: number; n: number; title: React.ReactNode; note: string; children: React.ReactNode }> = ({ t, from, to, done, n, title, note, children }) => {
  const k = pop(t, from, { damping: 12, stiffness: 160 });
  const out = eo(seg(t, to - 0.2, to + 0.1));
  if (k <= 0 || out >= 1) return null;
  const tick = pop(t, done, { damping: 8, stiffness: 240 });
  return (
    <div style={{ position: "absolute", left: 80, top: 436, width: 870, height: 700, transform: `translateX(${-1100 * out}px) scale(${lerp(0.85, 1, Math.min(1, k))})`, opacity: Math.min(1, k * 1.5), transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: 0, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.soft, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 30, top: 26, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...type.label, fontSize: 24, color: P.card, background: P.ink, borderRadius: 10, padding: "6px 14px" }}>Check {n}</div>
        </div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 82, ...type.display, fontSize: 58, lineHeight: 1.12, color: P.ink }}>{title}</div>
        <div style={{ position: "absolute", left: 30, right: 30, top: 236, bottom: 110 }}>{children}</div>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 22, ...type.body, fontSize: 24, lineHeight: 1.25, color: P.ink3, borderTop: `3px solid ${P.line}`, paddingTop: 10 }}>{note}</div>
      </div>
      {tick > 0 && (
        <div style={{ ...centre(800, 50, Math.min(1.1, tick) * lerp(2, 1, Math.min(1, tick))) }}>
          <TickBox k={Math.min(1, (t - done) / 0.25)} size={120} />
        </div>
      )}
      <Sparks t={t} at={done} x={800} y={50} />
    </div>
  );
};

/** Indian digit grouping without toLocaleString (deterministic on every machine). */
export const inr = (n: number) => {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${rest},${last}`;
};

export const ChecksScene: React.FC<S> = ({ t }) => {
  if (t < C.checksAt - 0.1 || t > C.revealAt + 0.2) return null;
  const count = Math.round(21000 * eo(seg(t, C.hazaar - 0.35, C.hazaar + 0.4)));
  const staff = Math.min(20, Math.floor(22 * seg(t, C.c2 + 0.6, C.bees + 0.1)));
  const day = Math.min(30, Math.floor(30 * seg(t, C.tees - 0.9, C.tees + 0.15)));
  return (
    <>
      <ProgressRow t={t} />
      <CheckCard t={t} from={C.c1} to={C.c2} done={C.c1done} n={1} title={<>Monthly wages<br />up to <span style={{ background: P.lime, borderRadius: 10, padding: "0 10px" }}>₹21,000</span></>} note="Wages as the law defines them (basic pay, DA and so on), not take-home pay. Central notification, Aug 2026; states notify their own.">
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <SalarySlip w={360} bonus="?" hi={0} />
        </div>
        <div style={{ position: "absolute", left: 400, top: 30, width: 410, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ ...type.label, fontSize: 24, color: P.ink3 }}>Legal wages</div>
          <div style={{ ...type.display, fontSize: 100, color: P.ink }}>{t < C.hazaar - 0.35 ? "₹ ?" : `₹${inr(count)}`}</div>
          <div style={{ ...type.display, fontSize: 40, color: P.olive }}>a month, or less</div>
        </div>
      </CheckCard>
      <CheckCard t={t} from={C.c2} to={C.c3} done={C.c2done} n={2} title={<><span style={{ background: P.lime, borderRadius: 10, padding: "0 10px" }}>20+</span> employees</>} note="The company counts as a whole. Some employers are excluded or exempt; coverage rules apply.">
        <svg width={810} height={330} viewBox="0 0 810 330" style={{ position: "absolute", left: 0, top: 0, transform: "scale(0.92)", transformOrigin: "50% 0" }}>
          <rect x={6} y={6} width={798} height={318} rx={22} fill={P.paper2} stroke={P.ink} strokeWidth={5} />
          {Array.from({ length: 22 }, (_, i) => {
            const col = i % 11;
            const row = Math.floor(i / 11);
            const x = 52 + col * 70;
            const y = 110 + row * 140;
            const here = i < staff + (t > C.bees + 0.2 ? 2 : 0);
            return (
              <g key={i} transform={`translate(${x} ${y})`} opacity={here ? 1 : 0.18}>
                <circle cx={0} cy={-34} r={18} fill={here ? [EMP_SKIN, "#D9A47E", "#B07A55"][i % 3] : P.lineStrong} stroke={P.ink} strokeWidth={4} />
                <path d="M-26 22 C-26 -6 -14 -12 0 -12 C14 -12 26 -6 26 22 Z" fill={here ? [FEST.sky, P.lime, FEST.marigold, P.teal][i % 4] : P.lineStrong} stroke={P.ink} strokeWidth={4} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", right: 20, top: -96, ...type.display, fontSize: 92, color: P.ink }}>{t > C.bees + 0.2 ? "20+" : staff}</div>
      </CheckCard>
      <CheckCard t={t} from={C.c3} to={C.revealAt} done={C.c3done} n={3} title={<>Worked <span style={{ background: P.lime, borderRadius: 10, padding: "0 10px" }}>30 days</span> this year</>} note="At least 30 working days in the accounting year.">
        <div style={{ position: "absolute", left: 0, top: 0, width: 810, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} style={{ height: 88, borderRadius: 12, border: `4px solid ${P.ink}`, background: i < day ? P.lime : P.card, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 32, color: P.ink, transform: i === day - 1 ? "scale(1.12)" : undefined }}>
              {i + 1}
            </div>
          ))}
        </div>
      </CheckCard>
    </>
  );
};

const EMP_SKIN = "#C98E64";

/** The employee reacts in the corner while the checks run (bottom right, clear of the subtitles). */
export const ChecksEmployee: React.FC<S> = ({ t }) => {
  if (t < C.checksAt || t > C.revealAt + 0.1) return null;
  const k = eo(seg(t, C.checksAt, C.checksAt + 0.4));
  const done = [C.c1done, C.c2done, C.c3done].some((d) => t > d && t < d + 0.8);
  return <Person who="emp" x={lerp(1300, 820, k)} bottom={1640} s={0.72} pose={done ? "cheer" : "look"} face={done ? "happy" : "curious"} t={t} blink={blinkAt(t, [9.2, 14.8, 18.3])} flip />;
};

export { random, mono, Calculator, Desk, Heart, NotEqual, PaperPlane, BrandMark, FollowButton, Eyebrow, vis, bonus };
