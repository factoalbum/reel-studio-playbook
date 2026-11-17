import React from "react";
import { random, spring } from "remotion";
import { Burst, Mark as Reaction, Sticker } from "../brand/Bits";
import { FollowButton } from "../brand/Cta";
import { HeroTitle } from "../brand/Headline";
import { mono, palette as P, shadow, type } from "../brand/tokens";
import { C, ebay } from "../episodes/ebay";
import { Figure } from "../google/kit";
import { eo, Eyebrow, go, lerp, pop, seg } from "../mdh/kit";
import { centre, Crt, DeskFront, FlipCalendar, Keyboard, LaserPen, ListingCard, MARK, MARK_2015, OldPage, PIERRE, PriceBoard, Rays, ReconTag, Room95, Shards, SnapFlash, SoldStamp, Stand, YearTunnel } from "./kit";

/**
 * The eBay reel, scene by scene. Scenes are drawn behind the presenter unless noted; every time comes from
 * src/episodes/ebay.ts. Match cuts: the pointer's tip opens the time tunnel, the 1995 frame becomes the CRT screen,
 * the listing flies out of that screen, and the pointer Mark holds up is the same one the presenter holds at the end.
 */

type S = { t: number };

/** A short hit that decays: for screen shakes. */
const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);

/** Where the presenter's open palm is (the "explain" pose); the same maths as the Avatar's placement spring. */
const palm = (t: number): [number, number] => {
  const env = ebay.env;
  const f = Math.round(t * 30);
  const e = (i: number) => env[Math.max(0, Math.min(env.length - 1, i))] ?? 0;
  const level = (e(f - 1) + 2 * e(f) + e(f + 1)) / 4;
  const open = Math.pow(Math.max(0, Math.min(1, (level - 0.1) / 0.72)), 0.85);
  const places = ebay.avatarPlaces;
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

/** Colour bars that sweep across a hard scene change; the change happens behind them. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.buyerAt, C.twistAt, C.calFrom, C.askAt, C.seriesAt].map((at, i) => {
      const k = seg(t, at - 0.2, at + 0.2);
      if (k <= 0 || k >= 1) return null;
      return (
        <div key={at} style={{ position: "absolute", left: -500, top: -100, width: 2080, height: 2120, transform: `translateX(${lerp(-1700, 1700, eo(k))}px) skewX(-14deg)`, display: "flex" }}>
          <div style={{ flex: 1, background: i % 2 ? P.lime : P.ink }} />
          <div style={{ flex: 1, background: i % 2 ? P.ink : P.lime }} />
        </div>
      );
    })}
  </>
);

// =================================================================================================================
// 1. The hook (0 to 6.2 s). HookBack sits behind the presenter, HookFront in front.

const POINTER: [number, number] = [540, 610];

/** Camera zoom on the presenter and the pointer: creeps in during the pause, then snaps back on "BROKEN". */
export const hookCam = (t: number) => {
  if (t > C.irisAt + 0.5) return 1;
  const open = lerp(1.1, 1, eo(seg(t, 0, 0.45)));
  const creep = go(t, C.leanAt, C.brokenAt) * (1 - eo(seg(t, C.brokenAt, C.brokenAt + 0.22)));
  return open * (1 + 0.1 * creep);
};
export const CAM_ORIGIN = "540px 1120px";

export const HookBack: React.FC<S> = ({ t }) => {
  if (t > C.irisAt + 0.5) return null;
  const k = 0.45 + 0.4 * seg(t, C.brokenAt, C.brokenAt + 0.1);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${lerp(1.08, 1, eo(seg(t, 0, 0.5)))})` }}>
      <Rays t={t * 2.4} x={540} y={760} k={k} />
    </div>
  );
};

export const HookFront: React.FC<S> = ({ t }) => {
  if (t > C.irisAt + 0.5) return null;
  const whole = t < C.snapAt;
  const fly = seg(t, C.snapAt, C.catchAt);
  const [hx, hy] = palm(Math.max(C.catchAt, t));
  const rest = t >= C.catchAt;
  const settle = rest ? Math.exp(-(t - C.catchAt) * 7) * Math.sin((t - C.catchAt) * 22) * 26 : 0;
  // The pieces fall in an arc from above the head into the open hand.
  const x = lerp(POINTER[0], hx - 8, eo(fly));
  const y = rest ? hy - 112 + settle : lerp(POINTER[1], hy - 112, fly * fly) - 90 * Math.sin(Math.PI * fly);
  const sway = whole ? -14 + 5 * Math.sin(t * 9) : rest ? -18 + 3 * Math.sin(t * 2) : lerp(-14, 346, eo(fly));
  const s = lerp(0.98, 0.64, eo(fly));
  const held = go(t, C.leanAt, C.leanAt + 0.7);
  const pushed = pop(t, C.brokenAt, { damping: 7, stiffness: 240 });
  const lift = rest ? 1 + 0.14 * held + 0.1 * Math.sin(Math.min(1, pushed) * Math.PI) : 1;
  const beat = 1 + 0.07 * Math.sin(Math.PI * seg(t, C.firstWord, C.firstWord + 0.32));
  const bk = pop(t, C.brokenAt, { damping: 8, stiffness: 240 });
  const sh = shakeAt(t, C.brokenAt, 16);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${hookCam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <div style={{ ...centre(x, y, lift, `rotate(${sway}deg)`) }}>
          <LaserPen s={s} gap={lerp(0, 36, eo(fly))} bend={lerp(0, 12, eo(fly))} beam={whole ? 1 : 0} beamLen={1100} broken={!whole} t={t} />
        </div>
      </div>
      <SnapFlash t={t} at={C.snapAt} x={POINTER[0]} y={POINTER[1]} />
      <Shards t={t} at={C.snapAt} x={POINTER[0]} y={POINTER[1]} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sh}px, ${-sh * 0.6}px)` }}>
      {t >= C.titleAt && (
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 700, transform: `scale(${beat})`, transformOrigin: "50% 430px" }}>
          <HeroTitle t={t} at={C.titleAt} top={316} lines={[{ text: "eBay's FIRST", size: 102 }, { text: "SALE?!", size: 102, tone: "lime" }]} />
        </div>
      )}
      {bk > 0 && (
        <div style={{ ...centre(540, 668, Math.min(1.06, bk) * lerp(2.4, 1, Math.min(1, bk))) }}>
          <Sticker size={108} tone="ink" rotate={-4}>
            BROKEN! 🤯
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.brokenAt} x={540} y={668} r={330} color={P.lime} />
      <Reaction t={t} at={C.brokenAt + 0.08} x={150} y={930} text="!!" color={P.lime} size={84} rot={-14} />
      <Reaction t={t} at={C.brokenAt + 0.16} x={940} y={1010} text="?!" color={P.lime} size={74} rot={12} />
      <Rim t={t} />
      </div>
    </>
  );
};

/** The small "#1" tag that pins down what the word "first" means, beside the pieces in the hand. */
const Rim: React.FC<S> = ({ t }) => {
  const p = pop(t, C.soldWord, { damping: 9, stiffness: 210 });
  if (p <= 0 || t > C.brokenAt) return null;
  return (
    <div style={{ ...centre(232, 1150, Math.min(1.06, p), "rotate(-6deg)") }}>
      <Sticker size={46} tone="card" rotate={0}>
        Item no. 1
      </Sticker>
    </div>
  );
};

// =================================================================================================================
// 2. Back to 1995. The tunnel opens from the pointer's tip and sits above the presenter.

export const Tunnel: React.FC<S> = ({ t }) => {
  if (t < C.irisAt - 0.02 || t > C.roomAt + 0.05) return null;
  const [hx, hy] = palm(C.irisAt);
  const r = 2300 * Math.pow(seg(t, C.irisAt, C.irisAt + 0.34), 2);
  const k = go(t, C.rewindFrom - 0.2, C.yearLand);
  const land = pop(t, C.yearLand, { damping: 8, stiffness: 240 });
  const dive = Math.pow(seg(t, C.diveAt, C.roomAt), 2.4);
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `circle(${r}px at ${hx + 40}px ${hy - 110}px)`, transform: `scale(${1 + 0.05 * Math.sin(Math.min(1, land) * Math.PI) + dive * 3.2})`, transformOrigin: "540px 800px" }}>
      <YearTunnel t={t} k={k} />
      <div style={{ position: "absolute", left: 0, top: 336, width: 1080, display: "flex", justifyContent: "center", opacity: 1 - dive }}>
        <Eyebrow text="Internet Stories · Ep 3" dot t={t} />
      </div>
      {land > 0 && (
        <div style={{ ...centre(540, 1076, Math.min(1.08, land)), opacity: 1 - seg(t, C.diveAt - 0.1, C.diveAt + 0.06) }}>
          <Sticker size={56} tone="lime" rotate={-3}>
            Asli kahani
          </Sticker>
        </div>
      )}
    </div>
  );
};

const CRT_CENTRE = { x: 540, y: 811 };

/** The 1995 room: pull out of the CRT, the AuctionWeb page loads, then the camera moves over to Pierre at the desk. */
export const RoomScene: React.FC<S> = ({ t }) => {
  if (t < C.roomAt - 0.02 || t > C.buyerAt + 0.1) return null;
  const out = eo(seg(t, C.roomAt, C.roomAt + 0.95));
  const zoom = lerp(4.1, 1, out) * (1 + 0.035 * seg(t, C.roomAt + 0.95, C.panAt));
  const pan = go(t, C.panAt, C.panAt + 0.6);
  const pageK = seg(t, C.pageAt, C.pageAt + 0.14);
  const title = pop(t, C.pageAt, { damping: 9, stiffness: 220 });
  const titleOut = go(t, C.panAt - 0.1, C.panAt + 0.2);
  const dim = go(t, C.listAt, C.listAt + 0.3);
  const typing = t > C.panAt + 0.4 && t < C.penAt;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: `${CRT_CENTRE.x}px ${CRT_CENTRE.y}px` }}>
      <Room95 t={t} cx={lerp(0, -70, pan)} />
      <Pierre t={t} pan={pan} />
      <DeskFront cx={lerp(0, -70, pan)} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-262 * pan}px) scale(${lerp(1, 0.62, pan)})`, transformOrigin: "540px 1240px" }}>
        <div style={{ position: "absolute", left: 160, top: 520 }}>
          <Crt w={760} t={t}>
            <div style={{ position: "absolute", inset: 0, background: P.lime, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 158, color: P.ink }}>1995</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${pageK * 100}%`, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 480 }}>
                <OldPage row={seg(t, C.rowAt, C.rowAt + 0.1)} pick={seg(t, C.rowAt, C.rowAt + 0.15) * (1 - seg(t, C.rowAt + 0.5, C.rowAt + 0.8))} />
              </div>
            </div>
          </Crt>
        </div>
      </div>
      {t >= C.pageAt && <ReconTag style={{ left: lerp(226, 84, pan), top: lerp(1092, 738, pan), opacity: 1 - dim }} />}
      <div style={{ position: "absolute", left: lerp(230, 462, pan), top: 1290, transform: `scale(${lerp(1, 0.84, pan)})`, transformOrigin: "0 0" }}>
        <Keyboard w={620} t={t} typing={typing} />
      </div>
      {title > 0 && titleOut < 1 && (
        <div style={{ ...centre(540, 440, Math.min(1.08, title) * (1 - titleOut)), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ ...type.label, fontSize: 26, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "6px 20px" }}>eBay's original name</div>
          <Sticker size={92} tone="lime" rotate={-3}>
            AuctionWeb
          </Sticker>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: P.limeWash, opacity: 0.93 * dim }} />
    </div>
  );
};

const PIERRE_X = 765;
const PIERRE_BOTTOM = 1262;
const PIERRE_S = 0.92;
const PIERRE_HAND: [number, number] = [PIERRE_X - 205 * PIERRE_S, PIERRE_BOTTOM - 270 * PIERRE_S];

const Pierre: React.FC<S & { pan: number }> = ({ t, pan }) => {
  if (pan <= 0) return null;
  const holding = t >= C.penAt && t < C.sendAt + 0.3;
  const name = pop(t, C.nameAt, { damping: 9, stiffness: 210 });
  const send = go(t, C.sendAt, C.rowAt);
  const penP = pop(t, C.penAt, { damping: 9, stiffness: 200 });
  const CRT_POINT: [number, number] = [284, 890];
  return (
    <>
      <Stand x={lerp(1320, PIERRE_X, pan)} bottom={PIERRE_BOTTOM} s={PIERRE_S}>
        <Figure look={PIERRE} pose={holding ? "holdL" : "type"} face={holding ? "curious" : "calm"} t={t} blink={Math.abs(t - 12.6) < 0.06} />
      </Stand>
      {name > 0 && (
        <div style={{ ...centre(PIERRE_X - 20, 560, Math.min(1.06, name)), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ ...type.label, fontSize: 24, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "5px 18px" }}>Founder · illustrated</div>
          <Sticker size={56} tone="lime" rotate={-3}>
            Pierre Omidyar
          </Sticker>
        </div>
      )}
      {penP > 0 && send < 1 && (
        <div style={{ ...centre(lerp(PIERRE_HAND[0], CRT_POINT[0], send), lerp(PIERRE_HAND[1] - 44, CRT_POINT[1], send) - 90 * Math.sin(Math.PI * send), Math.min(1.08, penP) * lerp(1, 0.25, send), `rotate(${-14 + send * 40}deg)`), opacity: 1 - seg(send, 0.8, 1) }}>
          <LaserPen s={0.44} gap={20} bend={11} broken t={t} />
        </div>
      )}
    </>
  );
};

/** The listing flies out of the monitor towards the viewer; the presenter comes in to examine it. */
export const ListingScene: React.FC<S> = ({ t }) => {
  if (t < C.listAt || t > C.buyerAt + 0.1) return null;
  const k = eo(seg(t, C.listAt, C.listAt + 0.42));
  const bob = Math.sin(t * 2.4) * 8;
  const chip = 1 + 0.2 * Math.sin(Math.PI * seg(t, C.tootiAt, C.tootiAt + 0.34));
  const who = pop(t, C.kaunAt, { damping: 8, stiffness: 230 });
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, perspective: 1500 }}>
        <div style={{ ...centre(lerp(284, 540, k), lerp(890, 660, k) + bob, lerp(0.14, 1, k), `rotateY(${lerp(40, -3, k)}deg) rotateX(${lerp(14, 2, k)}deg)`) }}>
          <ListingCard t={t} w={820} broken={chip} />
        </div>
      </div>
      <ReconTag style={{ left: 290, top: 900, opacity: seg(t, C.listAt + 0.3, C.listAt + 0.5) }} />
      {who > 0 && (
        <div style={{ ...centre(625, 1040, Math.min(1.08, who)) }}>
          <Sticker size={92} tone="ink" rotate={3}>
            ???
          </Sticker>
        </div>
      )}
      <Reaction t={t} at={C.tootiAt} x={120} y={410} text="?" color={P.lime} size={90} rot={-12} />
      <Reaction t={t} at={C.tootiAt + 0.2} x={950} y={440} text="?" color={P.lime} size={70} rot={14} />
    </>
  );
};

// =================================================================================================================
// 4. The surprising buyer (17.4 to 22 s).

export const BuyerScene: React.FC<S> = ({ t }) => {
  if (t < C.buyerAt || t > C.twistAt + 0.1) return null;
  const inK = pop(t, C.buyerAt + 0.05, { damping: 14, stiffness: 130 });
  const name = pop(t, C.markName, { damping: 9, stiffness: 210 });
  const board = pop(t, C.buyerAt + 0.12, { damping: 10, stiffness: 200 });
  const sold = pop(t, C.soldAt, { damping: 9, stiffness: 300 });
  const sh = shakeAt(t, C.soldAt, 20, 0.45);
  const done = t >= C.soldAt;
  const pose = done ? "cheer" : t >= C.spinAt ? "up" : "look";
  const face = done ? "happy" : t >= C.spinAt ? "curious" : "calm";
  const jump = done ? -36 * Math.abs(Math.sin(Math.PI * seg(t, C.soldAt, C.soldAt + 0.8) * 2)) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${sh}px, ${sh * 0.5}px)` }}>
      <div style={{ position: "absolute", inset: 0, background: P.paper2 }} />
      <div style={{ position: "absolute", left: -200, top: 150, width: 1480, height: 1200, background: "radial-gradient(closest-side, rgba(200,241,105,0.75), rgba(200,241,105,0))" }} />
      <Rays t={t} x={540} y={640} k={0.5 * seg(t, C.soldAt, C.soldAt + 0.2)} r={1300} />
      <Stand x={lerp(1320, 745, Math.min(1, inK))} bottom={1400 + jump} s={1.05}>
        <Figure look={MARK} pose={pose} face={face} t={t} blink={Math.abs(t - 18.9) < 0.06} />
      </Stand>
      <DeskFront top={1340} />
      {name > 0 && (
        <div style={{ ...centre(280, 950, Math.min(1.06, name)), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Sticker size={58} tone="lime" rotate={-3}>
            Mark Fraser
          </Sticker>
          <div style={{ ...type.label, fontSize: 23, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "5px 16px" }}>The buyer · illustrated</div>
        </div>
      )}
      {board > 0 && (
        <div style={{ ...centre(530, 512, Math.min(1.05, board)), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ ...type.label, fontSize: 26, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "6px 20px" }}>Final price</div>
          <PriceBoard t={t} from={C.spinAt} ats={C.digits} h={196} />
        </div>
      )}
      <div style={{ ...centre(350, 742) }}>
        <SoldStamp p={sold} size={112} rotate={-8} />
      </div>
      <Burst t={t} at={C.soldAt} x={350} y={742} r={300} color={P.lime} />
      <Reaction t={t} at={C.soldAt + 0.1} x={950} y={700} text="!!" color={P.lime} size={84} rot={12} />
    </div>
  );
};

// =================================================================================================================
// 5. The 20-year twist (22 to 33.4 s).

export const TwistScene: React.FC<S> = ({ t }) => {
  if (t < C.twistAt || t > C.calFrom + 0.1) return null;
  const p = pop(t, C.twistWord, { damping: 8, stiffness: 240 });
  return (
    <>
      <Rays t={t * 3} x={540} y={880} k={0.8} />
      {p > 0 && (
        <div style={{ ...centre(540, 470, Math.min(1.08, p) * lerp(2.2, 1, Math.min(1, p))) }}>
          <Sticker size={126} tone="ink" rotate={-3}>
            ASLI TWIST?
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.twistWord} x={540} y={470} r={300} color={P.lime} />
    </>
  );
};

export const CalendarScene: React.FC<S> = ({ t }) => {
  if (t < C.calFrom || t > C.camAt + 0.3) return null;
  const inK = pop(t, C.calFrom, { damping: 13, stiffness: 180 });
  const land = pop(t, C.calTo, { damping: 7, stiffness: 240 });
  const sh = shakeAt(t, C.calTo, 18, 0.4);
  const out = go(t, C.camAt - 0.1, C.camAt + 0.25);
  return (
    <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: 1 - out, transform: `translate(${sh}px, ${-sh * 0.5}px)` }}>
      <Rays t={t * 5} x={540} y={760} k={0.1 + 0.28 * seg(t, C.calTo, C.calTo + 0.15)} r={1500} />
      <div style={{ ...centre(540, 760, Math.min(1.04, inK) * (1 + 0.1 * Math.sin(Math.min(1, land) * Math.PI)) * lerp(1, 1.5, out)) }}>
        <FlipCalendar t={t} a={C.calFrom + 0.05} b={C.calTo} w={700} />
      </div>
      {land > 0 && (
        <div style={{ ...centre(540, 1190 - 110, Math.min(1.08, land)) }}>
          <Sticker size={74} tone="lime" rotate={-3}>
            20 YEARS LATER
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.calTo} x={540} y={760} r={420} color={P.lime} />
    </div>
  );
};

const MARK_X = 540;
const MARK_BOTTOM = 1330;
const MARK_S = 1.26;
/** The raised hand of the "up" pose, on screen. */
const RAISED: [number, number] = [MARK_X + 150 * MARK_S, MARK_BOTTOM - 530 * MARK_S];

/** A camera's viewfinder around the shot: "Mark ne camera par". */
const Viewfinder: React.FC<S & { k: number }> = ({ t, k }) => {
  const c = (x: number, y: number, r: number) => <path d="M0 70 V0 H70" transform={`translate(${x} ${y}) rotate(${r})`} fill="none" stroke={P.ink} strokeWidth={9} strokeLinecap="round" />;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {c(100, 350, 0)}
        {c(980, 350, 90)}
        {c(980, 1120, 180)}
        {c(100, 1120, 270)}
      </svg>
      <div style={{ position: "absolute", left: 140, top: 384, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 28, background: "#D8344B", opacity: Math.floor(t * 2.4) % 2 ? 0.25 : 1 }} />
        <div style={{ ...type.label, fontSize: 30, color: P.ink }}>REC</div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 384, ...type.label, fontSize: 30, color: P.ink }}>2015</div>
    </div>
  );
};

export const PayoffScene: React.FC<S> = ({ t }) => {
  if (t < C.camAt - 0.2 || t > C.askAt + 0.1) return null;
  const raise = pop(t, C.raiseAt, { damping: 10, stiffness: 170 });
  const hero = go(t, C.gadgetAt, C.gadgetAt + 0.5);
  const push = lerp(1, 1.08, go(t, C.raiseAt, C.gadgetAt));
  const inK = pop(t, C.camAt, { damping: 14, stiffness: 130 });
  const orig = pop(t, C.originalAt, { damping: 8, stiffness: 230 });
  const rays = seg(t, C.raiseAt, C.raiseAt + 0.25);
  const finder = seg(t, C.camAt + 0.2, C.camAt + 0.4) * (1 - hero);
  const penScale = lerp(0.5, 1.18, hero) * Math.min(1.08, Math.max(raise, hero));
  const penX = lerp(RAISED[0] - 6, 540, hero);
  const penY = lerp(RAISED[1] - 74, 700, hero);
  const gadget = pop(t, 29.62, { damping: 9, stiffness: 220 });
  const frame = go(t, C.historyAt, C.historyAt + 0.7);
  const plate = pop(t, C.plateAt, { damping: 8, stiffness: 220 });
  const shift = lerp(0, -40, frame);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: P.paper2 }} />
      <Rays t={t} x={penX} y={penY} k={0.85 * rays} r={1700} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push * lerp(1, 2.1, hero)})`, transformOrigin: `${RAISED[0]}px ${RAISED[1]}px`, opacity: 1 - seg(hero, 0.35, 0.8) }}>
        <Stand x={MARK_X} bottom={MARK_BOTTOM + (1 - Math.min(1, inK)) * 300} s={MARK_S}>
          <Figure look={MARK_2015} pose={t >= C.raiseAt ? "up" : "look"} face={t >= C.raiseAt ? "happy" : "calm"} t={t} blink={Math.abs(t - 26.5) < 0.06} />
        </Stand>
        <DeskFront top={1310} />
      </div>
      <Viewfinder t={t} k={finder} />
      {t >= C.camAt + 0.3 && hero < 1 && <ReconTag text="Animated reconstruction" style={{ left: 345, top: 388, opacity: 1 - hero }} />}
      {orig > 0 && hero < 1 && (
        <div style={{ ...centre(392, 520, Math.min(1.08, orig)), opacity: 1 - hero }}>
          <Sticker size={70} tone="lime" rotate={-3}>
            WAHI ORIGINAL!
          </Sticker>
        </div>
      )}
      {orig > 0 && hero < 1 && (
        <div style={{ ...centre(292, 622, Math.min(1, orig)), opacity: 1 - hero, ...type.label, fontSize: 25, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "6px 18px", whiteSpace: "nowrap" }}>
          Kept since 1995
        </div>
      )}
      {/* The pointer: raised in Mark's hand, then the hero of the frame. */}
      {t >= C.raiseAt && (
        <div style={{ ...centre(penX, penY + shift, Math.max(0.01, penScale), `rotate(${lerp(-58, -9, hero)}deg)`) }}>
          <LaserPen s={1} gap={lerp(24, 30, hero)} bend={11} broken t={t} />
        </div>
      )}
      <Burst t={t} at={C.raiseAt} x={RAISED[0]} y={RAISED[1] - 70} r={300} color={P.lime} />
      {gadget > 0 && frame < 1 && (
        <div style={{ ...centre(540, 1000, Math.min(1.08, gadget)), opacity: 1 - frame }}>
          <Sticker size={84} tone="ink" rotate={-3}>
            Broken gadget
          </Sticker>
        </div>
      )}
      {frame > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <rect x={96} y={420} width={888} height={480} rx={36} fill="none" stroke={P.ink} strokeWidth={22} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - frame} />
          <rect x={96} y={420} width={888} height={480} rx={36} fill="none" stroke={P.gold} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - frame} />
        </svg>
      )}
      {plate > 0 && (
        <div style={{ ...centre(540, 985, Math.min(1.08, plate)), background: P.gold, border: `6px solid ${P.ink}`, borderRadius: 18, boxShadow: shadow.hard(8), padding: "12px 34px 14px", textAlign: "center" }}>
          <div style={{ ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>Internet history</div>
          <div style={{ ...type.label, fontSize: 25, color: P.ink, marginTop: 4 }}>1995 · sold for $14.83</div>
        </div>
      )}
      <Burst t={t} at={C.plateAt} x={540} y={985} r={320} color={P.lime} />
    </>
  );
};

// =================================================================================================================
// 6. The question, the series and the outro.

const BUBBLES: { text: string; x: number; y: number; at: number; rot: number }[] = [
  { text: "Haan, le lunga! 😂", x: 216, y: 1128, at: C.bubbleA, rot: -4 },
  { text: "Pagal ho kya? 😅", x: 810, y: 1150, at: C.bubbleB, rot: 4 },
];

export const AskScene: React.FC<S> = ({ t }) => {
  if (t < C.askAt || t > C.seriesAt + 0.1) return null;
  const would = pop(t, C.wouldAt, { damping: 8, stiffness: 230 });
  const com = pop(t, C.commentAt, { damping: 8, stiffness: 240 });
  return (
    <>
      <Rays t={t} x={540} y={900} k={0.45} />
      {would > 0 && (
        <div style={{ ...centre(540, 420, Math.min(1.08, would) * lerp(1.8, 1, Math.min(1, would))) }}>
          <Sticker size={68} tone="lime" rotate={-2}>
            WOULD YOU BUY IT? 🤔
          </Sticker>
        </div>
      )}
      {com > 0 && (
        <div style={{ ...centre(540, 560, Math.min(1.08, com) * lerp(1.8, 1, Math.min(1, com))) }}>
          <Sticker size={60} tone="ink" rotate={2}>
            COMMENT YOUR ANSWER!
          </Sticker>
        </div>
      )}
    </>
  );
};

/** The two example answers, drawn in front of the presenter so the head never covers them. */
export const AskBubbles: React.FC<S> = ({ t }) => {
  if (t < C.bubbleA || t > C.seriesAt + 0.1) return null;
  return (
    <>
      {BUBBLES.map((b) => {
        const k = pop(t, b.at, { damping: 9, stiffness: 210 });
        if (k <= 0) return null;
        const bob = Math.sin(t * 2.4 + b.x) * 6;
        return (
          <div key={b.text} style={{ ...centre(b.x, b.y + bob, Math.min(1.06, k), `rotate(${b.rot}deg)`), background: P.card, border: `4px solid ${P.ink}`, borderRadius: 26, padding: "10px 20px 12px", boxShadow: shadow.hard(5), whiteSpace: "nowrap", textAlign: "center" }}>
            <div style={{ ...type.display, fontSize: 32, color: P.ink }}>{b.text}</div>
            <div style={{ ...type.label, fontSize: 15, color: P.ink3, marginTop: 2 }}>Example</div>
          </div>
        );
      })}
    </>
  );
};

/** The pointer in the presenter's hand during the question, then it flies onto the Ep 3 card. */
export const PenInHand: React.FC<S> = ({ t }) => {
  if (t < C.askAt + 0.05 || t > C.seriesAt + 0.55) return null;
  const [hx, hy] = palm(Math.min(t, C.seriesAt - 0.02));
  const fly = go(t, C.seriesAt + 0.05, C.seriesAt + 0.5);
  const appear = pop(t, C.askAt + 0.25, { damping: 9, stiffness: 200 });
  const x = lerp(hx - 8, 810, fly);
  const y = lerp(hy - 112, 800, fly) - 120 * Math.sin(Math.PI * fly);
  return (
    <div style={{ ...centre(x, y, Math.min(1.06, appear) * lerp(1, 0.55, fly), `rotate(${lerp(-18 + 3 * Math.sin(t * 2), -20, fly)}deg)`), opacity: 1 - seg(fly, 0.85, 1) }}>
      <LaserPen s={0.64} gap={24} bend={12} broken t={t} />
    </div>
  );
};

const EP_CARDS: { ep: string; title: string; x: number; rot: number; at: number; lime?: boolean }[] = [
  { ep: "Ep 1", title: "Million Dollar Homepage", x: 262, rot: -7, at: 0.02 },
  { ep: "Ep 2", title: "google.com for $12", x: 540, rot: 2, at: 0.16 },
  { ep: "Ep 3", title: "The broken laser pointer", x: 818, rot: 7, at: 0.3, lime: true },
];

export const SeriesScene: React.FC<S> = ({ t }) => {
  if (t < C.seriesAt || t > C.outroAt + 0.2) return null;
  const head = pop(t, C.crazyAt - 0.05, { damping: 8, stiffness: 230 });
  const out = go(t, C.outroAt - 0.12, C.outroAt + 0.14);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {head > 0 && (
        <div style={{ ...centre(540, 470, Math.min(1.08, head)) }}>
          <Sticker size={88} tone="lime" rotate={-3}>
            Crazy true stories
          </Sticker>
        </div>
      )}
      {EP_CARDS.map((c, i) => {
        const k = pop(t, C.seriesAt + c.at, { damping: 10, stiffness: 190 });
        if (k <= 0) return null;
        return (
          <div key={c.ep} style={{ ...centre(c.x, 860 + (i === 1 ? -24 : 0), Math.min(1.05, k), `rotate(${c.rot}deg)`), width: 272, height: 350, boxSizing: "border-box", background: c.lime ? P.lime : P.card, border: `5px solid ${P.ink}`, borderRadius: 24, boxShadow: shadow.hard(7), padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {i === 0 && (
              <svg width={214} height={150} viewBox="0 0 10 7" style={{ position: "absolute", left: 20, top: 20 }}>
                {Array.from({ length: 70 }, (_, n) => (
                  <rect key={n} x={n % 10} y={Math.floor(n / 10)} width={0.92} height={0.92} fill={[P.gold, P.pink, P.lime, "#2D7FF9", "#18A058", P.paper2][Math.floor(random(`sc${n}`) * 6)]} />
                ))}
              </svg>
            )}
            {i === 1 && (
              <div style={{ position: "absolute", left: 20, right: 20, top: 56, height: 74, borderRadius: 40, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontWeight: 600, fontSize: 30, color: P.ink, background: P.paper }}>
                google.com
              </div>
            )}
            {i === 2 && (
              <div style={{ position: "absolute", left: 134, top: 92, transform: "rotate(-20deg)" }}>
                <LaserPen s={0.33} gap={13} bend={11} broken t={t} />
              </div>
            )}
            <div style={{ ...type.label, fontSize: 20, color: P.ink }}>{c.ep}</div>
            <div style={{ ...type.display, fontSize: 36, color: P.ink, marginTop: 4 }}>{c.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export const Outro: React.FC<S> = ({ t }) => {
  if (t < C.outroAt) return null;
  return (
    <>
      <Rays t={t} x={540} y={760} k={0.4} />
      <HeroTitle t={t} at={C.outroAt + 0.1} top={400} lines={[{ text: "FOLLOW", size: 124, tone: "lime" }, { text: "@INTERNETOOLBOX", size: 86 }]} />
      <FollowButton t={t} at={C.followAt + 0.1} tapAt={C.toolboxAt} top={770} invite />
      {t > C.followAt + 0.2 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 920, display: "flex", justifyContent: "center", opacity: seg(t, C.followAt + 0.2, C.followAt + 0.5) }}>
          <Eyebrow text="Internet Stories" size={28} />
        </div>
      )}
    </>
  );
};

