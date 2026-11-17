import React from "react";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton } from "../brand/Cta";
import { palette as P, shadow, type } from "../brand/tokens";
import { C } from "../episodes/bonus";
import { eo, go, lerp, pop, seg } from "../mdh/kit";
import { Calculator, centre, Desk, FEST, Heart, NotEqual, PaperPlane, Person, Sparks, Stamp, TickBox } from "./kit";

/**
 * Second half of the Diwali bonus reel: the 8.33% reveal, the Diwali-date twist with the accounting-year timeline,
 * what to do (HR chat and checklist), and the share and follow ending. Times come from src/episodes/bonus.ts.
 */

type S = { t: number };
const blinkAt = (t: number, list: number[]) => list.some((b) => t >= b && t < b + 0.12);
const hl = (s: React.ReactNode) => <span style={{ background: P.lime, borderRadius: 10, padding: "0 10px" }}>{s}</span>;

// =================================================================================================================
// 3. The reveal: a big calculator lands in the presenter's hands and shows 8.33%.

export const RevealScene: React.FC<S> = ({ t }) => {
  if (t < C.revealAt - 0.1 || t > C.twistAt + 0.2) return null;
  const head = pop(t, C.revealAt + 0.05, { damping: 10, stiffness: 190 });
  const calc = pop(t, C.calcAt, { damping: 9, stiffness: 170 });
  const pct = seg(t, C.pctAt - 0.5, C.pctAt + 0.15);
  const shown = pct >= 1 ? "8.33%" : pct > 0 ? (8.33 * eo(pct)).toFixed(2) : "0";
  const out = eo(seg(t, C.twistAt - 0.2, C.twistAt + 0.1));
  const note = pop(t, C.pctAt + 0.5, { damping: 12 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {head > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${Math.min(1.05, head)})` }}>
          <div style={{ ...type.label, fontSize: 28, color: P.ink3 }}>If every rule applies</div>
          <div style={{ ...type.display, fontSize: 84, color: P.ink }}>Annual {hl("minimum")} bonus</div>
        </div>
      )}
      {calc > 0 && (
        // Pulled out from the presenter's side (bottom left) up to the middle of the frame.
        <div style={{ ...centre(lerp(330, 640, Math.min(1, calc)), lerp(1500, 790, Math.min(1, calc)), lerp(0.4, 1, Math.min(1, calc)), `rotate(${lerp(-30, 4, Math.min(1, calc))}deg)`) }}>
          <Calculator w={440} display={shown} press={t > C.pctAt - 0.1 && t < C.pctAt + 0.1 ? 14 : -1} />
        </div>
      )}
      <Burst t={t} at={C.pctAt} x={640} y={620} r={320} color={P.lime} />
      <Sparks t={t} at={C.pctAt} x={640} y={620} n={12} r={280} />
      {note > 0 && (
        <div style={{ position: "absolute", left: 110, width: 860, top: 1066 - 30 * (1 - Math.min(1, note)), opacity: Math.min(1, note), ...type.body, fontWeight: 600, fontSize: 27, lineHeight: 1.3, color: P.ink, textAlign: "center", background: "rgba(250,249,246,0.9)", borderRadius: 14, padding: "6px 10px" }}>
          8.33% of the wages earned in the year, or ₹100 if that is higher. Worked out on the legal wage basis, not your full gross salary.
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 4. The twist: the employee points at Diwali on the calendar; freeze, "WAIT... WHAT?!", the calendar becomes the
// accounting-year timeline with the 8-month window. Then DIWALI GIFT is not the STATUTORY BONUS.

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export const frozen = (t: number) => t >= C.wait && t < C.wait + 0.75;

export const TwistScene: React.FC<S> = ({ t }) => {
  if (t < C.twistAt - 0.1 || t > C.actAt + 0.2) return null;
  const ft = frozen(t) ? C.wait : t; // animation clock stops during the freeze
  const inK = eo(seg(t, C.twistAt, C.twistAt + 0.4));
  const tl = go(t, C.timelineAt, C.timelineAt + 0.6); // calendar to timeline
  const win = go(t, C.monthsAt, C.monthsAt + 1.0); // the 8-month window fills
  const out = eo(seg(t, C.actAt - 0.2, C.actAt + 0.1));
  const gift = pop(t, C.giftAt, { damping: 10, stiffness: 190 });
  const ring = pop(t, C.diwaliWord, { damping: 7, stiffness: 240 }); // Diwali gets circled on the word
  const cw = 800;
  // Timeline geometry: 20 months, the year ends after the 12th, the window is the next 8.
  const at = (m: number) => `${(m / 20) * 100}%`;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, filter: frozen(t) ? "saturate(0.35) contrast(1.05)" : undefined }}>
      {/* The November wall calendar with Diwali circled; it unrolls into the timeline. */}
      <div style={{ position: "absolute", left: 140, top: lerp(400, 420, tl), width: cw, height: lerp(452, 300, tl), transform: `translateY(${(1 - inK) * -600}px)`, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.soft, overflow: "hidden" }}>
        <div style={{ height: 76, background: FEST.marigold, borderBottom: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", ...type.display, fontSize: 44, color: P.ink }}>
          <span>{tl < 0.5 ? "November" : "Accounting year"}</span>
          <span style={{ ...type.label, fontSize: 24 }}>{tl < 0.5 ? "Diwali" : "Apr to Mar"}</span>
        </div>
        {tl < 0.5 ? (
          <div style={{ opacity: 1 - tl * 2, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, padding: 16 }}>
            {Array.from({ length: 21 }, (_, i) => (
              <div key={i} style={{ height: 104, borderRadius: 14, border: `4px solid ${i === 7 ? FEST.red : P.line}`, background: i === 7 ? "#FFE3B8" : P.paper, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 38, color: P.ink, position: "relative" }}>
                {i === 7 ? <span style={{ fontSize: 48 }}>🪔</span> : i + 1}
                {i === 7 && ring > 0 && <div style={{ position: "absolute", inset: -12, borderRadius: 60, border: `6px solid ${FEST.red}`, transform: `scale(${Math.min(1.1, ring)}) rotate(-8deg)` }} />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ opacity: (tl - 0.5) * 2, position: "absolute", left: 30, right: 30, top: 96, height: 190 }}>
            <div style={{ position: "absolute", left: at(12), top: 0, transform: "translateX(-50%)", ...type.label, fontSize: 22, color: P.ink }}>Year ends</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 64, height: 18, borderRadius: 9, background: P.line }} />
            <div style={{ position: "absolute", left: 0, width: at(12), top: 64, height: 18, borderRadius: 9, background: P.ink3 }} />
            <div style={{ position: "absolute", left: at(12), width: `${(8 / 20) * 100 * win}%`, top: 54, height: 38, borderRadius: 19, background: P.lime, border: `4px solid ${P.ink}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", left: at(12), top: 34, width: 6, height: 78, marginLeft: -3, borderRadius: 3, background: P.ink }} />
            {MONTHS.map((m, i) => (
              <div key={i} style={{ position: "absolute", left: at(i + 0.5), top: 100, width: 3, height: 12, marginLeft: -1.5, background: i >= 12 && i < 12 + 8 * win + 0.01 ? P.olive : P.lineStrong }} />
            ))}
            <div style={{ position: "absolute", left: 0, top: 122, ...type.display, fontSize: 30, color: P.ink3 }}>Apr</div>
            <div style={{ position: "absolute", left: at(12), top: 122, transform: "translateX(-50%)", ...type.display, fontSize: 30, color: P.ink }}>31 Mar</div>
            {win > 0.95 && <div style={{ position: "absolute", right: 0, top: 122, ...type.display, fontSize: 30, color: P.olive }}>+8 months</div>}
          </div>
        )}
      </div>
      {/* The assumption, then the answer stamped on it on "zaroori nahi". */}
      {t < C.timelineAt + 0.3 && pop(t, C.qAt, { damping: 11, stiffness: 200 }) > 0 && (
        <div style={{ ...centre(540, 980, Math.min(1.04, pop(t, C.qAt, { damping: 11, stiffness: 200 }))), opacity: 1 - seg(t, C.timelineAt - 0.1, C.timelineAt + 0.3) }}>
          <div style={{ position: "relative", background: P.card, border: `5px solid ${P.ink}`, borderRadius: 999, padding: "16px 36px", ...type.display, fontSize: 52, color: P.ink, boxShadow: shadow.hard(6), whiteSpace: "nowrap" }}>
            Bonus on Diwali day?
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <Stamp p={pop(t, C.zarooriWord, { damping: 9, stiffness: 260 })} text="NOT NECESSARILY" size={50} rotate={-7} />
            </div>
          </div>
        </div>
      )}
      {tl > 0.6 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: seg(t, C.timelineAt + 0.3, C.timelineAt + 0.6) }}>
          <div style={{ ...type.display, fontSize: 56, color: P.ink, textAlign: "center" }}>Up to {hl("8 months")} after</div>
          <div style={{ ...type.display, fontSize: 56, color: P.ink, textAlign: "center" }}>the accounting year ends</div>
          <div style={{ ...type.body, fontSize: 24, color: P.ink3, marginTop: 6 }}>General deadline; extensions and exceptions may apply.</div>
        </div>
      )}
      {/* The employee points at the calendar; the manager says nothing, only expressions. */}
      <Person who="emp" x={lerp(-200, 250, inK)} bottom={1770} s={0.7} pose={t < C.timelineAt ? "point" : "head"} face={frozen(t) ? "shocked" : t < C.wait ? "happy" : "curious"} t={ft} blink={blinkAt(t, [C.twistAt + 1.4])} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${(1 - inK) * 600}px)` }}>
        <Person who="boss" x={840} bottom={1720} s={0.66} pose="look" face={frozen(t) ? "curious" : t < C.wait ? "calm" : "worried"} t={ft} blink={blinkAt(t, [C.twistAt + 0.9, C.monthsAt + 0.6])} />
        <Desk x={840} top={1670} w={360} />
      </div>
      {gift > 0 && (
        <div style={{ ...centre(540, 1040, Math.min(1.05, gift)), display: "flex", alignItems: "center", gap: 14, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, padding: "14px 24px", boxShadow: shadow.hard(7) }}>
          <div style={{ ...type.display, fontSize: 40, color: FEST.marigoldDk, textAlign: "center", lineHeight: 1.05 }}>DIWALI<br />GIFT</div>
          <NotEqual size={70} />
          <div style={{ ...type.display, fontSize: 40, color: P.olive, textAlign: "center", lineHeight: 1.05 }}>STATUTORY<br />ANNUAL BONUS</div>
        </div>
      )}
    </div>
  );
};

/** "WAIT... WHAT?!" over the frozen frame (drawn in front of the presenter). */
export const WaitWhat: React.FC<S> = ({ t }) => {
  const p = pop(t, C.wait, { damping: 8, stiffness: 260 });
  if (p <= 0 || t > C.wait + 1.3) return null;
  const out = seg(t, C.wait + 1.0, C.wait + 1.3);
  return (
    <>
      {frozen(t) && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 14px ${P.ink}` }} />}
      <div style={{ ...centre(540, 640, Math.min(1.08, p) * lerp(1.9, 1, Math.min(1, p)) * (1 - 0.3 * out), "rotate(-4deg)"), opacity: 1 - out }}>
        <Sticker size={112} tone="ink" rotate={0}>
          WAIT... WHAT?!
        </Sticker>
      </div>
    </>
  );
};

// =================================================================================================================
// 5. What to do: the employee messages HR; the presenter's checklist.

const TODO = ["Check eligibility", "Check your wage basis", "Ask HR or payroll", "Read the rules that apply"];

export const ActScene: React.FC<S> = ({ t }) => {
  if (t < C.actAt - 0.1 || t > C.shareAt + 0.2) return null;
  const chat = pop(t, C.chatAt, { damping: 12, stiffness: 170 });
  const out = eo(seg(t, C.shareAt - 0.2, C.shareAt + 0.1));
  const msg = "Hi! Am I eligible for statutory bonus?";
  const typed = Math.floor(seg(t, C.chatAt + 0.3, C.chatAt + 1.4) * msg.length);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {chat > 0 && (
        <div style={{ position: "absolute", left: 80, top: 330, width: 870, transform: `scale(${lerp(0.8, 1, Math.min(1, chat))})`, opacity: Math.min(1, chat * 1.5), background: P.card, border: `5px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.soft, overflow: "hidden" }}>
          <div style={{ height: 76, background: P.ink, display: "flex", alignItems: "center", gap: 14, padding: "0 24px" }}>
            <div style={{ width: 44, height: 44, borderRadius: 44, background: FEST.marigold, border: `3px solid ${P.card}` }} />
            <div style={{ ...type.display, fontSize: 32, color: P.card }}>HR / Payroll</div>
            <div style={{ marginLeft: "auto", ...type.label, fontSize: 16, color: P.lime }}>illustration</div>
          </div>
          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 14, minHeight: 190 }}>
            <div style={{ alignSelf: "flex-end", maxWidth: 680, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: "22px 22px 6px 22px", padding: "12px 18px", ...type.display, fontSize: 38, color: P.ink }}>
              {msg.slice(0, typed)}
              {typed < msg.length && <span style={{ opacity: Math.round(t * 4) % 2 }}>|</span>}
            </div>
            {t > C.chatAt + 1.9 && (
              <div style={{ alignSelf: "flex-start", maxWidth: 640, background: P.paper2, border: `4px solid ${P.ink}`, borderRadius: "22px 22px 22px 6px", padding: "12px 18px", ...type.display, fontSize: 36, color: P.ink, opacity: seg(t, C.chatAt + 1.9, C.chatAt + 2.2) }}>
                Let me check your details 👍
              </div>
            )}
          </div>
        </div>
      )}
      {TODO.map((item, i) => {
        const at = C.listAts[i];
        const k = pop(t, at, { damping: 11, stiffness: 200 });
        if (k <= 0) return null;
        return (
          <div key={item} style={{ position: "absolute", left: 170, top: 740 + i * 98, transform: `translateX(${(1 - Math.min(1, k)) * 300}px)`, opacity: Math.min(1, k * 1.5), display: "flex", alignItems: "center", gap: 18 }}>
            <TickBox k={Math.min(1, (t - at - 0.15) / 0.25)} size={64} />
            <div style={{ ...type.display, fontSize: 46, color: P.ink, whiteSpace: "nowrap" }}>{item}</div>
          </div>
        );
      })}
      <Person who="emp" x={830} bottom={1660} s={0.62} pose="hold" face={t < C.chatAt + 1.9 ? "curious" : "happy"} t={t} blink={blinkAt(t, [C.actAt + 1.2])} flip />
    </div>
  );
};

// =================================================================================================================
// 6. Share and follow.

export const ShareScene: React.FC<S> = ({ t }) => {
  if (t < C.shareAt - 0.1) return null;
  const q = pop(t, C.shareAt + 0.05, { damping: 10, stiffness: 190 });
  const panels = pop(t, C.shareAt + 0.35, { damping: 12, stiffness: 180 });
  const plane = seg(t, C.planeAt, C.planeAt + 0.9);
  const landed = t >= C.planeAt + 0.9;
  const sh = pop(t, C.shareWord, { damping: 8, stiffness: 230 });
  const end = pop(t, C.followAt, { damping: 10, stiffness: 190 });
  const qOut = eo(seg(t, C.followAt - 0.2, C.followAt + 0.1));
  // Two panels: you (the employee) and a friend who is still waiting; the paper plane carries the video across.
  const panel = (left: number, label: string, kid: React.ReactNode, i: number) => {
    const k = Math.min(1, Math.max(0, panels - i * 0.12));
    return (
      <div style={{ position: "absolute", left, top: 665, width: 420, height: 465, transform: `translateY(${(1 - k) * 80}px) scale(${lerp(0.85, 1, k)})`, opacity: Math.min(1, k * 1.6), background: "linear-gradient(180deg, #FFF6E2, #FFE7BF)", border: `5px solid ${P.ink}`, borderRadius: 30, overflow: "hidden", boxShadow: shadow.soft }}>
        {kid}
        <div style={{ position: "absolute", left: 18, top: 16, background: P.ink, color: P.card, borderRadius: 999, padding: "6px 16px", ...type.label, fontSize: 20 }}>{label}</div>
      </div>
    );
  };
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - qOut }}>
        {q > 0 && (
          <div style={{ position: "absolute", left: 0, width: 1080, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${Math.min(1.05, q)})` }}>
            <div style={{ ...type.display, fontSize: 72, color: P.ink }}>KNOW SOMEONE</div>
            <div style={{ ...type.display, fontSize: 72, color: P.ink }}>WAITING FOR A {hl("BONUS?")}</div>
          </div>
        )}
        {panels > 0 && (
          <>
            {panel(80, "You", <Person who="emp" x={210} bottom={650} s={0.95} pose="point" face="happy" t={t} blink={blinkAt(t, [C.shareAt + 1.6])} />, 0)}
            {panel(580, "Your friend", <Person who="friend" x={210} bottom={650} s={0.95} pose={landed ? "cheer" : "look"} face={landed ? "happy" : "worried"} t={t} blink={blinkAt(t, [C.shareAt + 1.1, C.planeAt + 2.2])} flip />, 1)}
          </>
        )}
        {plane > 0 && plane < 1 && (
          <div style={{ ...centre(lerp(400, 700, eo(plane)), 860 - Math.sin(plane * Math.PI) * 170, lerp(0.8, 1.05, plane), `rotate(${lerp(-18, 14, plane)}deg)`) }}>
            <PaperPlane size={150} />
          </div>
        )}
        <Sparks t={t} at={C.planeAt + 0.9} x={790} y={860} n={10} r={200} />
        {sh > 0 && (
          <div style={{ ...centre(540, 600, Math.min(1.06, sh) * lerp(1.8, 1, Math.min(1, sh))) }}>
            <Sticker size={80} tone="lime" rotate={-3}>
              SHARE THIS WITH THEM!
            </Sticker>
          </div>
        )}
      </div>
      {end > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${Math.min(1.05, end)})` }}>
          <BrandMark size={170} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, ...type.display, fontSize: 60, color: P.ink }}>
            FOLLOW @INTERNETOOLBOX <Heart size={54} />
          </div>
        </div>
      )}
      <FollowButton t={t} at={C.followAt + 0.25} tapAt={C.followWord} top={760} invite />
      <Sparks t={t} at={C.followAt + 0.3} x={540} y={520} n={12} r={300} />
    </>
  );
};

/** The readable disclaimer card near the end. */
export const LegalCard: React.FC<S> = ({ t }) => {
  if (t < C.discAt) return null;
  const k = eo(seg(t, C.discAt, C.discAt + 0.35));
  return (
    <div style={{ position: "absolute", left: 120, width: 840, top: 930, opacity: k, transform: `translateY(${(1 - k) * 30}px)`, background: P.paper2, border: `3px solid ${P.lineStrong}`, borderRadius: 18, padding: "14px 22px", ...type.body, fontSize: 26, lineHeight: 1.3, color: P.ink2, textAlign: "center" }}>
      General information only. Eligibility and exceptions apply. Not legal advice.
      <div style={{ ...type.label, fontSize: 16, color: P.ink3, marginTop: 6 }}>Code on Wages, 2019 · central bonus notifications, Aug 2026</div>
    </div>
  );
};
