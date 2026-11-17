import React from "react";
import { random, spring, useCurrentFrame } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { FollowButton } from "../brand/Cta";
import { HeroTitle } from "../brand/Headline";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { C, google } from "../episodes/google";
import { Bulb, DollarCoin, eo, Eyebrow, go, lerp, pop, seg, vis } from "../mdh/kit";
import { cents, FigFace, FigPose, Figure, FRIEND, Icon, Receipt, SANMAY } from "./kit";

/**
 * The second half of the google.com reel: the reward and the charity, the recap, the four engagement moments
 * (comment, share, save, follow) and the series outro. All times come from src/episodes/google.ts.
 */

type S = { t: number };
const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) ${extra}` });

/** A side character standing with its feet at (x, bottom). */
const Stand: React.FC<{ x: number; bottom: number; s: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, bottom, s, children, style }) => (
  <div style={{ position: "absolute", left: x - 220, top: bottom - 580, width: 440, height: 580, transform: `scale(${s})`, transformOrigin: "50% 100%", ...style }}>{children}</div>
);

// =================================================================================================================
// The reward (42.6 to 57.9 s): the report, $6,006.13, the charity decision, and Google doubling it.

const sanmayState = (t: number): { pose: FigPose; face: FigFace } => {
  if (t >= C.doubleAt) return { pose: "cheer", face: "happy" };
  if (t >= C.charityAt) return { pose: "point", face: "happy" };
  if (t >= C.rewardCount) return { pose: "head2", face: "shocked" };
  if (t >= C.rewardAt) return { pose: "look", face: "curious" };
  if (t >= C.reportSend) return { pose: "look", face: "calm" };
  return { pose: "type", face: "curious" };
};

const ReportCard: React.FC<{ t: number }> = ({ t }) => {
  const p = pop(t, C.reportAt + 0.1, { damping: 12, stiffness: 160 });
  const fly = go(t, C.reportSend + 0.25, C.reportSend + 0.8);
  if (p <= 0 || fly >= 1) return null;
  const press = seg(t, C.reportSend - 0.1, C.reportSend + 0.15);
  const sent = t >= C.reportSend;
  return (
    <div style={{ ...centre(lerp(745, 1000, fly), lerp(560, 300, fly), Math.min(1.04, p) * (1 - 0.6 * fly), `rotate(${-3 + fly * 20}deg)`), opacity: 1 - seg(fly, 0.6, 1), width: 480, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(8), padding: "24px 28px", boxSizing: "border-box" }}>
      <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>New report</div>
      <div style={{ ...type.body, fontSize: 25, color: P.ink2, marginTop: 12 }}>
        To: <b style={{ color: P.ink }}>Google security team</b>
      </div>
      <div style={{ ...type.display, fontSize: 36, color: P.ink, marginTop: 10 }}>"I just bought google.com?!"</div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <div style={{ ...type.display, fontSize: 30, padding: "12px 28px", borderRadius: 30, border: `4px solid ${P.ink}`, background: sent ? P.ink : P.lime, color: sent ? P.lime : P.ink, transform: `scale(${1 - 0.08 * Math.sin(Math.PI * press)})` }}>
          {sent ? "Sent ✓" : "Send"}
        </div>
      </div>
    </div>
  );
};

/** Coins pour from the reward card into the charity box. */
const CoinStream: React.FC<{ t: number; from: [number, number]; to: [number, number]; at: number; until: number }> = ({ t, from, to, at, until }) => (
  <>
    {Array.from({ length: 14 }, (_, i) => {
      const start = at + i * ((until - at - 0.6) / 14);
      const k = seg(t, start, start + 0.6);
      if (k <= 0 || k >= 1) return null;
      const x = lerp(from[0], to[0], k) + Math.sin(i * 1.7) * 30 * Math.sin(Math.PI * k);
      const y = lerp(from[1], to[1], k) - 160 * Math.sin(Math.PI * k);
      return <DollarCoin key={i} size={56} spin={Math.cos(t * 10 + i)} style={{ position: "absolute", left: x - 28, top: y - 28, opacity: 1 - seg(k, 0.85, 1) }} />;
    })}
  </>
);

const CharityBox: React.FC<{ t: number }> = ({ t }) => {
  const p = pop(t, C.charityWord, { damping: 10, stiffness: 180 });
  if (p <= 0) return null;
  const glow = vis(t, C.doubleAt + 0.6, C.recapAt + 0.4, 0.3, 0.4);
  const fill = seg(t, C.doubleAt + 0.7, C.recapAt - 0.2);
  return (
    <div style={{ ...centre(800, 960, Math.min(1.06, p)), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: 360, background: `radial-gradient(closest-side, ${P.lime}, transparent)`, opacity: 0.8 * glow, top: -80 }} />
      <svg width={250} height={220} viewBox="0 0 250 220" style={{ position: "relative", overflow: "visible" }}>
        {/* A donation box: lid with a coin slot, a heart on the front, filling up with lime. */}
        <rect x={20} y={70} width={210} height={140} rx={18} fill={P.card} stroke={P.ink} strokeWidth={7} />
        <rect x={27} y={203 - 126 * fill} width={196} height={126 * fill} rx={10} fill={P.limeSoft} />
        <rect x={10} y={46} width={230} height={36} rx={12} fill={P.ink} />
        <rect x={90} y={58} width={70} height={10} rx={5} fill={P.lime} />
        <path d="M125 182 C80 152 72 120 96 108 C110 101 121 110 125 120 C129 110 140 101 154 108 C178 120 170 152 125 182 Z" fill={P.pink} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" transform={`translate(125 145) scale(${1 + 0.08 * Math.sin(t * 6)}) translate(-125 -145)`} />
      </svg>
      <div style={{ position: "relative", marginTop: 6 }}>
        <Sticker size={40} tone="ink" rotate={2}>
          Charity
        </Sticker>
      </div>
    </div>
  );
};

export const RewardScene: React.FC<S> = ({ t }) => {
  if (t < C.reportAt - 0.4 || t > C.recapAt + 0.6) return null;
  const inK = pop(t, C.reportAt - 0.3, { damping: 14, stiffness: 120 });
  const out = go(t, C.recapAt, C.recapAt + 0.5);
  const { pose, face } = sanmayState(t);
  const blink = [46.9, 50.9, 54.0].some((b) => Math.abs(t - b) < 0.06);
  const jump = t >= C.doubleAt ? -40 * Math.abs(Math.sin(Math.PI * seg(t, C.doubleAt, C.doubleAt + 0.9) * 2)) : 0;
  // The reward card: counts to $6,006.13, then the x2 stamp rolls it to $12,012.26.
  const card = pop(t, C.rewardAt, { damping: 11, stiffness: 170 });
  const first = 6006.13 * eo(seg(t, C.rewardCount, C.rewardCount + 1.5));
  const second = lerp(6006.13, 12012.26, eo(seg(t, C.doubleWord - 0.3, C.doubleWord + 0.6)));
  const amount = t < C.doubleWord - 0.3 ? first : second;
  const stamp = pop(t, C.doubleAt + 0.1, { damping: 8, stiffness: 240 });
  const doubled = pop(t, C.doubleAt + 0.4, { damping: 9, stiffness: 200 });
  const toCharity = go(t, C.charityWord, C.charityWord + 0.8);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      <Stand x={lerp(-200, 300, Math.min(1, inK))} bottom={1165 + jump} s={1}>
        <Figure look={SANMAY} pose={pose} face={face} t={t} blink={blink} />
      </Stand>
      {t > C.reportAt && t < C.rewardAt && (
        <div style={{ position: "absolute", left: 120, top: 360 }}>
          <Eyebrow text="Sanmay reports it" size={24} />
        </div>
      )}
      <ReportCard t={t} />
      {/* Coins pop out from behind the card when the first reward lands. */}
      {t > C.rewardCount + 1.5 &&
        t < C.rewardCount + 3.2 &&
        Array.from({ length: 10 }, (_, i) => {
          const k = t - C.rewardCount - 1.5;
          const a = -Math.PI * (0.1 + 0.8 * random(`rw${i}`));
          const v = 420 + random(`rv${i}`) * 380;
          return <DollarCoin key={i} size={60} spin={Math.cos(k * 12 + i)} style={{ position: "absolute", left: 690 + Math.cos(a) * v * k - 30, top: 520 + Math.sin(a) * v * k * 0.7 + 900 * k * k - 30, opacity: 1 - seg(k, 1.1, 1.7) }} />;
        })}
      {card > 0 && (
        <div style={{ ...centre(lerp(745, 690, toCharity), lerp(560, 520, toCharity), Math.min(1.05, card)), width: 520, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "26px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ ...type.label, fontSize: 20, color: P.olive }}>Reward from Google</div>
          <div style={{ ...type.display, fontSize: 84, color: P.ink, fontVariantNumeric: "tabular-nums", marginTop: 6 }}>{cents(amount)}</div>
          {stamp > 0 && (
            <div style={{ ...centre(470, 30, Math.min(1.2, stamp), "rotate(12deg)"), width: 120, height: 120, borderRadius: 120, background: P.lime, border: `6px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 54, color: P.ink }}>×2</div>
          )}
        </div>
      )}
      {toCharity > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M760 700 Q840 780 800 860" fill="none" stroke={P.ink} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" opacity={toCharity * (1 - seg(t, C.doubleAt + 0.2, C.doubleAt + 0.4))} />
        </svg>
      )}
      <CharityBox t={t} />
      <CoinStream t={t} from={[860, 600]} to={[800, 930]} at={C.doubleWord + 0.7} until={C.recapAt} />
      {doubled > 0 && (
        <div style={{ ...centre(720, 770, Math.min(1.1, doubled)), display: "flex", flexDirection: "column", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
          {/* Two lines, so it stays clear of Sanmay and inside the safe zone. */}
          <Sticker size={48} tone="lime" rotate={-3}>
            Google doubled
          </Sticker>
          <Sticker size={48} tone="lime" rotate={-3}>
            the reward!
          </Sticker>
        </div>
      )}
      {t > C.doubleWord + 1.2 && (
        <div style={{ ...centre(800, 1120), ...type.label, fontSize: 20, color: P.ink, background: P.card, borderRadius: 8, padding: "4px 12px", opacity: seg(t, C.doubleWord + 1.2, C.doubleWord + 1.5), whiteSpace: "nowrap" }}>
          All of it went to charity
        </div>
      )}
      <Burst t={t} at={C.rewardCount + 1.5} x={690} y={560} r={260} color={P.lime} />
      <Burst t={t} at={C.doubleWord + 0.5} x={690} y={560} r={300} />
    </div>
  );
};

// =================================================================================================================
// The recap (57.9 to 65.6 s): one search, one minute, a donation of over $12,000.

const RecapTile: React.FC<{ t: number; at: number; x: number; label: string; sub: string; hot?: boolean; children: React.ReactNode }> = ({ t, at, x, label, sub, hot = false, children }) => {
  const k = pop(t, at, { damping: 9, stiffness: 200 });
  const out = go(t, C.askAt - 0.4, C.askAt);
  if (k <= 0 || out >= 1) return null;
  return (
    <div style={{ ...centre(x, 720 - out * 400, Math.min(1.08, k)), opacity: 1 - out, width: 290, height: 400, background: hot ? P.lime : P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {children}
      <div style={{ ...type.display, fontSize: 50, color: P.ink }}>{label}</div>
      <div style={{ ...type.label, fontSize: 20, color: hot ? P.ink : P.ink3 }}>{sub}</div>
    </div>
  );
};

export const RecapScene: React.FC<S> = ({ t }) => {
  if (t < C.recapAt - 0.2 || t > C.askAt + 0.2) return null;
  const head = vis(t, C.recapAt + 0.1, C.askAt - 0.2, 0.25, 0.3);
  const plus = (at: number, x: number) => (t > at ? <div style={{ ...centre(x, 720), ...type.display, fontSize: 70, color: P.ink, opacity: seg(t, at, at + 0.2) * (1 - go(t, C.askAt - 0.4, C.askAt)) }}>→</div> : null);
  return (
    <>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 400, display: "flex", justifyContent: "center", opacity: head }}>
        <Eyebrow text="Poori kahani, 3 steps mein" size={26} />
      </div>
      <RecapTile t={t} at={C.searchTile} x={205} label="1 search" sub="google.com">
        <svg width={110} height={110} viewBox="0 0 40 40">
          <circle cx={17} cy={17} r={12} fill={P.limeSoft} stroke={P.ink} strokeWidth={3.5} />
          <path d="M26 26 L36 36" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
        </svg>
      </RecapTile>
      {plus(C.minuteTile - 0.1, 372)}
      <RecapTile t={t} at={C.minuteTile} x={540} label="1 minute" sub="as the owner">
        <Stopwatch size={110} k={seg(t, C.minuteTile, C.minuteTile + 1)} />
      </RecapTile>
      {plus(C.donationTile - 0.1, 708)}
      <RecapTile t={t} at={C.donationTile} x={875} label="$12,012" sub="to charity" hot={t > C.donationAmt}>
        <svg width={110} height={110} viewBox="0 0 100 100">
          <path d="M50 88 C14 62 6 36 26 24 C38 17 47 24 50 33 C53 24 62 17 74 24 C94 36 86 62 50 88 Z" fill={P.pink} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
        </svg>
      </RecapTile>
      <Burst t={t} at={C.donationAmt} x={875} y={720} r={230} color={P.lime} />
    </>
  );
};

/** A stopwatch whose hand sweeps once as k goes 0 to 1. */
export const Stopwatch: React.FC<{ size: number; k: number }> = ({ size, k }) => {
  const a = k * Math.PI * 2 - Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox="-60 -66 120 126">
      <rect x={-10} y={-66} width={20} height={14} rx={4} fill={P.ink} />
      <circle r={50} fill={P.card} stroke={P.ink} strokeWidth={8} />
      <path d={`M0 0 L0 -42 A42 42 0 ${k > 0.5 ? 1 : 0} 1 ${Math.cos(a) * 42} ${Math.sin(a) * 42} Z`} fill={P.lime} opacity={k > 0 ? 1 : 0} />
      <line x1={0} y1={0} x2={Math.cos(a) * 40} y2={Math.sin(a) * 40} stroke={P.ink} strokeWidth={7} strokeLinecap="round" />
      <circle r={7} fill={P.ink} />
    </svg>
  );
};

// =================================================================================================================
// The engagement ending (66.4 to 80.8 s). Captions sit lower here (google.captionLowFrom/To), so the stage is
// 330 to 1420 px. The receipt rides on the presenter's open palm, then flies to the friend and into the saved list.

/** Where the presenter's open palm is (the "explain" pose), for the receipt to rest on. */
const palm = (t: number, env: number[]): [number, number] => {
  const f = Math.round(t * 30);
  const e = (i: number) => env[Math.max(0, Math.min(env.length - 1, i))] ?? 0;
  const level = (e(f - 1) + 2 * e(f) + e(f + 1)) / 4;
  const open = Math.pow(Math.max(0, Math.min(1, (level - 0.1) / 0.72)), 0.85);
  // The same placement spring as the Avatar, so the receipt moves with the presenter.
  const places = google.avatarPlaces;
  let pi = 0;
  for (let i = 0; i < places.length; i++) if (places[i].at <= t) pi = i;
  const cur = places[pi];
  const prev = places[Math.max(0, pi - 1)];
  const k = spring({ frame: Math.max(0, Math.round((t - cur.at) * 30)), fps: 30, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const px = lerp(prev.x, cur.x, k);
  const py = lerp(prev.y, cur.y, k);
  const ps = lerp(prev.s, cur.s, k);
  return [px + 230 * ps, py + (446 - 22 * open) * ps];
};

const FRIEND_HAND: [number, number] = [612, 1185];
const SLOT2: [number, number] = [540, 620];

/** Example answers, clearly marked as made up (never real comments). */
const EXAMPLES: { text: string; x: number; y: number; at: number }[] = [
  { text: "Kabhi nahi bechta!", x: 225, y: 790, at: 0 },
  { text: "Website bana deta!", x: 830, y: 830, at: 0.4 },
  { text: "Google ko bechta!", x: 205, y: 880, at: 0.8 },
];

export const AskScene: React.FC<S> = ({ t }) => {
  if (t < C.askAt - 0.2 || t > C.shareAt + 0.6) return null;
  const out = go(t, C.shareAt - 0.1, C.shareAt + 0.4);
  const line1 = pop(t, C.googleWord, { damping: 10, stiffness: 190 });
  const line2 = pop(t, C.kyaKarte, { damping: 8, stiffness: 220 });
  const pulse = t > C.commentAt ? 1 + 0.06 * Math.sin((t - C.commentAt) * 14) * Math.exp(-(t - C.commentAt) * 1.5) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* The question: the strongest element of the ending. */}
      <div style={{ position: "absolute", left: 60, width: 960, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${pulse})` }}>
        {t < C.googleWord && (
          <div style={{ opacity: seg(t, C.askAt, C.askAt + 0.3) }}>
            <Eyebrow text="Ab socho…" size={30} />
          </div>
        )}
        {line1 > 0 && (
          <div style={{ ...type.display, fontSize: 92, color: P.ink, transform: `scale(${Math.min(1.08, line1)})`, whiteSpace: "nowrap" }}>
            google.com for <span style={{ background: `linear-gradient(transparent 55%, ${P.lime} 55%, ${P.lime} 92%, transparent 92%)` }}>$12</span>
          </div>
        )}
        {line2 > 0 && (
          <Sticker size={74} tone="ink" rotate={-2} pop={Math.min(1.1, line2)}>
            What would you do?
          </Sticker>
        )}
      </div>
      {/* The comment nudge: a small pill, never a big screen. */}
      {t > C.commentAt - 0.1 && (
        <div style={{ ...centre(540, 640, Math.min(1.1, pop(t, C.commentAt - 0.1, { damping: 9, stiffness: 220 }))), display: "flex", alignItems: "center", gap: 12, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 40, padding: "10px 24px 10px 16px", boxShadow: shadow.hard(5) }}>
          <Icon kind="comment" size={46} />
          <div style={{ ...type.display, fontSize: 36, color: P.ink }}>Comment mein batao</div>
        </div>
      )}
      {t > C.kyaKarte + 0.2 && (
        <div style={{ ...centre(540, 712), ...type.label, fontSize: 18, color: P.ink3, opacity: seg(t, C.kyaKarte + 0.2, C.kyaKarte + 0.5), whiteSpace: "nowrap" }}>Example comments · illustration</div>
      )}
      {EXAMPLES.map((b, i) => {
        const k = pop(t, C.kyaKarte + 0.3 + b.at, { damping: 11, stiffness: 200 });
        if (k <= 0) return null;
        const bob = Math.sin(t * 2 + i) * 5;
        return (
          <div key={i} style={{ ...centre(b.x, b.y + bob, Math.min(1.05, k) * 0.94), display: "flex", alignItems: "center", gap: 12, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 26, padding: "12px 20px", boxShadow: shadow.hard(4), whiteSpace: "nowrap" }}>
            <div style={{ width: 34, height: 34, borderRadius: 34, background: [P.gold, P.limeSoft, P.pink][i], border: `3px solid ${P.ink}`, flexShrink: 0 }} />
            <div style={{ ...type.body, fontWeight: 600, fontSize: 30, color: P.ink }}>{b.text}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Things that sit in front of the presenter: the receipt in every stage of its trip. */
export const ReceiptTrip: React.FC<S> = ({ t }) => {
  const frame = useCurrentFrame();
  if (t < C.askAt + 0.1 || t > C.outroAt + 0.2) return null;
  const appear = pop(t, C.askAt + 0.15, { damping: 10, stiffness: 190 });
  const throwK = go(t, C.throwAt, C.catchAt);
  const saveK = go(t, C.saveAt + 0.1, C.saveWord - 0.1);
  const leave = go(t, C.outroAt - 0.3, C.outroAt + 0.1);
  let [x, y] = palm(t, google.env);
  let s = 0.85 * Math.min(1.06, appear);
  let r = -6 + 2 * Math.sin(frame / 15);
  y -= 105;
  if (throwK > 0) {
    const [fx, fy] = FRIEND_HAND;
    const [sx, sy] = palm(C.throwAt, google.env);
    x = lerp(sx, fx, throwK);
    y = lerp(sy - 105, fy - 80, throwK) - 260 * Math.sin(Math.PI * throwK);
    r = lerp(-6, 8, throwK) + 360 * eo(throwK);
    s = lerp(0.85, 0.72, throwK);
  }
  if (saveK > 0) {
    x = lerp(FRIEND_HAND[0], SLOT2[0], saveK);
    y = lerp(FRIEND_HAND[1] - 80, SLOT2[1], saveK) - 120 * Math.sin(Math.PI * saveK);
    r = lerp(8, 0, saveK);
    s = lerp(0.72, 0.7, saveK);
  }
  return (
    <>
      {/* Share trail: a dashed arc drawn behind the flying card. */}
      {throwK > 0 && throwK < 1 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - seg(t, C.catchAt, C.catchAt + 0.3) }}>
          <path
            d={`M${palm(C.throwAt, google.env)[0]} ${palm(C.throwAt, google.env)[1] - 105} Q${(palm(C.throwAt, google.env)[0] + FRIEND_HAND[0]) / 2} ${FRIEND_HAND[1] - 560} ${FRIEND_HAND[0]} ${FRIEND_HAND[1] - 80}`}
            fill="none"
            stroke={P.ink}
            strokeWidth={5}
            strokeDasharray="12 14"
            strokeLinecap="round"
            pathLength={1}
            strokeDashoffset={0}
            opacity={0.5}
          />
        </svg>
      )}
      <div style={{ ...centre(x, y, s, `rotate(${r}deg)`), opacity: 1 - leave }}>
        <Receipt w={300} />
      </div>
    </>
  );
};

// ---- Share: the friend who sees a business idea in everything.

export const ShareScene: React.FC<S> = ({ t }) => {
  if (t < C.shareAt - 0.3 || t > C.saveWord + 0.8) return null;
  const inK = pop(t, C.shareAt - 0.2, { damping: 14, stiffness: 130 });
  const out = go(t, C.saveAt, C.saveAt + 0.6);
  const caught = t >= C.catchAt;
  const idea = t >= C.ideaWord;
  const pose: FigPose = idea ? "cheer" : caught ? "holdL" : "look";
  const face: FigFace = idea ? "money" : caught ? "curious" : "calm";
  const jump = idea ? -50 * Math.abs(Math.sin(Math.PI * seg(t, C.ideaWord, C.ideaWord + 1.2) * 2)) : 0;
  const bubble = pop(t, C.ideaWord + 0.1, { damping: 8, stiffness: 220 });
  const pill = pop(t, C.shareAt + 0.1, { damping: 10, stiffness: 200 });
  const pulse = t > C.shareWord ? 1 + 0.08 * Math.sin((t - C.shareWord) * 14) * Math.exp(-(t - C.shareWord) * 2) : 1;
  return (
    <>
      {pill > 0 && (
        <div style={{ ...centre(540, 400, Math.min(1.08, pill) * pulse), opacity: 1 - out, display: "flex", alignItems: "center", gap: 12, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 40, padding: "10px 26px 10px 16px", boxShadow: shadow.hard(5) }}>
          <Icon kind="share" size={42} />
          <div style={{ ...type.display, fontSize: 34, color: P.ink }}>Share with that one friend</div>
        </div>
      )}
      <Stand x={lerp(1300, 790, Math.min(1, inK)) + out * 600} bottom={1400 + jump} s={0.85}>
        <Figure look={FRIEND} pose={pose} face={face} t={t} blink={Math.abs(t - 74.6) < 0.06} />
      </Stand>
      {bubble > 0 && out < 1 && (
        <div style={{ ...centre(700, 650, Math.min(1.12, bubble), "rotate(3deg)"), opacity: 1 - out, display: "flex", alignItems: "center", gap: 10, background: P.lime, border: `5px solid ${P.ink}`, borderRadius: 30, padding: "14px 26px", boxShadow: shadow.hard(6), whiteSpace: "nowrap" }}>
          <Bulb size={56} k={1} t={t} />
          <div style={{ ...type.display, fontSize: 46, color: P.ink }}>Business idea!!</div>
        </div>
      )}
      <Burst t={t} at={C.ideaWord + 0.1} x={700} y={650} r={240} color={P.lime} />
    </>
  );
};

// ---- Save: the receipt lands in the saved "Internet Stories" collection.

export const SaveScene: React.FC<S> = ({ t }) => {
  if (t < C.saveAt - 0.2 || t > C.outroAt + 0.4) return null;
  const p = pop(t, C.saveAt, { damping: 12, stiffness: 170 });
  const out = go(t, C.outroAt - 0.3, C.outroAt + 0.2);
  const click = pop(t, C.saveWord, { damping: 7, stiffness: 260 });
  const filled = seg(t, C.saveWord - 0.05, C.saveWord + 0.1);
  return (
    <div style={{ ...centre(540, 590, Math.min(1.04, p) * (1 - 0.2 * out)), opacity: 1 - out, width: 880, height: 470, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.soft }}>
      <div style={{ position: "absolute", left: 34, top: 26, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, click) * Math.PI)})` }}>
          <Icon kind="save" size={52} fill={filled} />
        </div>
        <div>
          <div style={{ ...type.label, fontSize: 18, color: P.ink3 }}>Saved</div>
          <div style={{ ...type.display, fontSize: 40, color: P.ink }}>Internet Stories</div>
        </div>
      </div>
      {/* Slot 1: the last story; slot 2 is where the receipt lands; slot 3 is the next one. */}
      <div style={{ position: "absolute", left: 40, top: 130, width: 250, height: 300, borderRadius: 20, border: `4px solid ${P.ink}`, background: P.paper2, overflow: "hidden" }}>
        <svg width={250} height={190} viewBox="0 0 10 7.6">
          {Array.from({ length: 70 }, (_, i) => (
            <rect key={i} x={i % 10} y={Math.floor(i / 10) * 1.1} width={0.92} height={1} fill={[P.gold, P.pink, P.lime, "#2D7FF9", "#18A058", P.card][Math.floor(random(`sv${i}`) * 6)]} />
          ))}
        </svg>
        <div style={{ ...type.label, fontSize: 15, color: P.ink3, padding: "10px 14px 0" }}>Ep 1</div>
        <div style={{ ...type.display, fontSize: 24, color: P.ink, padding: "2px 14px" }}>Million Dollar Homepage</div>
      </div>
      <div style={{ position: "absolute", left: 315, top: 130, width: 250, height: 300, borderRadius: 20, border: `4px dashed ${P.lineStrong}`, background: P.limeWash }}>
        <div style={{ position: "absolute", left: 14, bottom: 14 }}>
          <div style={{ ...type.label, fontSize: 15, color: P.ink3 }}>Ep 2</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 590, top: 130, width: 250, height: 300, borderRadius: 20, border: `4px dashed ${P.lineStrong}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.label, fontSize: 18, color: P.ink3 }}>
        Next story…
      </div>
      {click > 0 && <Burst t={t} at={C.saveWord} x={60} y={52} r={110} color={P.lime} />}
    </div>
  );
};

// ---- Follow: the series outro (same as the Million Dollar Homepage reel), but the button never says "Following".

export const Outro: React.FC<S> = ({ t }) => {
  if (t < C.outroAt) return null;
  return (
    <>
      <HeroTitle t={t} at={C.outroAt + 0.1} top={430} lines={[{ text: "Internet", size: 130 }, { text: "Stories", size: 130, tone: "lime" }]} />
      {t > C.outroAt + 0.5 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 760, display: "flex", justifyContent: "center", opacity: seg(t, C.outroAt + 0.5, C.outroAt + 0.8) * (1 - seg(t, C.followAt - 0.25, C.followAt)) }}>
          <Eyebrow text="Crazy lekin sachchi kahaniyan" size={28} />
        </div>
      )}
      <FollowButton t={t} at={C.followAt} tapAt={C.toolboxAt} top={760} invite />
      {t > C.followAt && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 905, display: "flex", justifyContent: "center", opacity: seg(t, C.followAt, C.followAt + 0.2) }}>
          <div style={{ ...type.label, fontFamily: mono, fontSize: 30, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "10px 26px" }}>@internetoolbox</div>
        </div>
      )}
    </>
  );
};

