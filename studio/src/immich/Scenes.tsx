import React from "react";
import { random } from "remotion";
import { Burst, Mark as Reaction, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { CommentCard, FollowButton } from "../brand/Cta";
import { Headline } from "../brand/Headline";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks, Stamp, TickBox } from "../bonus/kit";
import { C } from "../episodes/immich";
import { clamp01, eo, go, lerp, pop, seg } from "../mdh/kit";
import {
  Album,
  BigLabel,
  centre,
  CloudIcon,
  DemoTag,
  DriveStack,
  FaceChip,
  FlowLine,
  Gauge,
  HomeServer,
  ImmichLogo,
  Laptop,
  Notice,
  PhoneShell,
  PhotoGrid,
  PlanCard,
  RED,
  SearchPill,
  Snap,
  SnapKind,
  StatusRow,
  StorageBar,
  TabBar,
  Terminal,
  UploadRing,
  VmCard,
  WarnIcon,
} from "./kit";

/**
 * The Immich reel, scene by scene. Every time comes from src/episodes/immich.ts (cue table C), which follows the
 * owner's recording. Layers: Backdrop > DarkVeil > scenes > Avatar > front titles > chrome > subtitles.
 */

type S = { t: number };

const shakeAt = (t: number, at: number, amp = 14, len = 0.4) => (t > at && t < at + len ? Math.sin(t * 95) * amp * (1 - seg(t, at, at + len)) : 0);
const mix = (k: number) => Math.min(1, k);

/** Camera push on the big beats: a scale around CAM_ORIGIN. */
export const CAM_ORIGIN = "540px 900px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.9) => amt * eo(seg(t, at, at + 0.35)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  return 1 + push(C.bhai, 0.05, 0.5) + push(C.resultsAt, 0.05, 1.1) + push(C.warnAt, 0.06, 0.5) + push(C.askAt, 0.07, 0.5);
};

/** Colour bars that sweep across the three big scene changes. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.featAt, C.serverQ, C.askAt].map((at, i) => {
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

/** The app screen used in several scenes: header with the Immich logo, search pill, timeline grid, tab bar. */
const AppScreen: React.FC<{ w: number; t: number; rows?: number; seed?: number; search?: React.ReactNode; tab?: number; logo?: boolean; children?: React.ReactNode }> = ({
  w,
  t,
  rows = 5,
  seed = 0,
  search,
  tab = 0,
  logo = true,
  children,
}) => {
  const sw = w * 0.93;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <StatusRow w={sw} />
      <div style={{ display: "flex", alignItems: "center", gap: sw * 0.03, padding: `${sw * 0.03}px ${sw * 0.06}px` }}>
        {logo && <ImmichLogo size={sw * 0.1} />}
        <div style={{ ...type.display, fontSize: sw * 0.075, color: P.ink }}>{logo ? "immich" : "Photos"}</div>
      </div>
      <div style={{ padding: `0 ${sw * 0.05}px` }}>{search ?? <SearchPill w={sw * 0.9} text="" typed={0} t={t} />}</div>
      <div style={{ ...type.display, fontSize: sw * 0.05, color: P.ink2, padding: `${sw * 0.04}px ${sw * 0.06}px ${sw * 0.02}px` }}>Today</div>
      <div style={{ padding: `0 ${sw * 0.04}px` }}>
        {children ?? <PhotoGrid w={sw * 0.92} rows={rows} kinds={["sunset", "family", "mountain", "food", "pet", "city", "flower", "lake"]} seed={seed} gap={4} />}
      </div>
      <TabBar w={sw} on={tab} />
    </div>
  );
};

// =================================================================================================================
// 0. Hook (0 to C.subsAt): storage full, a monthly plan card, the presenter pushes it away, the title, FREE?!

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.smash + 0.1) return null;
  const slide = eo(seg(t, 0.05, 0.55));
  const stamp = pop(t, 0.03, { damping: 8, stiffness: 240 });
  const sh = shakeAt(t, 0.05, 16, 0.5);
  const cardIn = pop(t, C.cardIn, { damping: 13, stiffness: 150 });
  const push = eo(seg(t, C.free - 0.05, C.free + 0.4));
  const pw = 340;
  const px = lerp(560, 720, slide);
  return (
    <>
      <div style={{ ...centre(px, 935, lerp(1.12, 1, slide), `rotate(${lerp(-3, 4, slide)}deg) translate(${sh}px, 0)`) }}>
        <PhoneShell w={pw}>
          <StatusRow w={pw * 0.93} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 6px" }}>
            <CloudIcon size={34} />
            <div style={{ ...type.display, fontSize: 26, color: P.ink }}>Photos</div>
          </div>
          <div style={{ padding: "4px 20px 12px" }}>
            <StorageBar w={276} fill={1} label="Storage" note="FULL" />
          </div>
          <div style={{ padding: "0 14px" }}>
            <PhotoGrid w={288} rows={5} kinds={["family", "sunset", "food", "pet", "mountain", "city"]} dim={0.35} gap={5} />
          </div>
        </PhoneShell>
      </div>
      {/* The stamp sits above the phone (not inside its screen) so the slam is never clipped. */}
      <div style={{ ...centre(px + sh, 930, 1) }}>
        <Stamp p={stamp} text="STORAGE FULL!" size={46} rotate={-10} color={RED} />
      </div>
      <Burst t={t} at={0.04} x={px} y={600} r={260} color={RED} />
      {/* A monthly plan card slides up over the phone, then gets pushed off by the presenter's hand. */}
      {cardIn > 0 && push < 1 && (
        <div style={{ ...centre(lerp(px, 1500, push), lerp(lerp(1500, 1110, mix(cardIn)), 980, push), 0.9, `rotate(${lerp(3, 40, push)}deg)`) }}>
          <PlanCard w={380} press={t > C.free - 0.15 && t < C.free + 0.05 ? 1 : 0} />
        </div>
      )}
      <Reaction t={t} at={C.free + 0.05} x={800} y={1180} text="NOPE!" color={P.lime} size={52} rot={10} />
    </>
  );
};

/** The hook title, each part landing when it is said. */
export const HookTitle: React.FC<S> = ({ t }) => {
  if (t > C.smash + 0.1) return null;
  return (
    <Headline
      t={t}
      top={330}
      inAt={C.google}
      outAt={C.smash}
      lines={[
        { size: 92, segs: [{ text: "GOOGLE PHOTOS", at: C.google }] },
        { size: 92, segs: [{ text: "JAISA", at: C.jaisa }, { text: "STORAGE?!", at: C.storage, tone: "lime" }] },
      ]}
      pulse={{ text: "STORAGE?!", at: C.storage + 0.15 }}
    />
  );
};

/** Smash cut: FREE?! full screen. The small line keeps it honest. */
export const SmashCut: React.FC<S> = ({ t }) => {
  if (t < C.smash || t > C.subsAt + 0.12) return null;
  const p = pop(t, C.smash, { damping: 8, stiffness: 260, mass: 0.6 });
  const out = seg(t, C.subsAt - 0.05, C.subsAt + 0.12);
  const sh = shakeAt(t, C.smash, 22, 0.35);
  return (
    <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: 1 - out, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 46%, ${P.olive} 0%, ${P.ink} 58%)` }} />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <div key={i} style={{ position: "absolute", left: 540, top: 880, width: 1400, height: 26, background: P.lime, opacity: 0.08, transformOrigin: "0 50%", transform: `rotate(${(a * 180) / Math.PI + t * 20}deg)` }} />;
      })}
      <div style={{ ...centre(540 + sh, 840, lerp(1.9, 1, mix(p)) * (p > 1 ? 1 + (p - 1) * 0.2 : 1), "rotate(-4deg)"), display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ ...type.display, fontSize: 290, color: P.lime, textShadow: `12px 12px 0 ${P.olive}` }}>FREE?!</span>
      </div>
      <div style={{ ...centre(540, 1110, mix(pop(t, C.smash + 0.12, { damping: 9 }))), fontSize: 170, lineHeight: 1 }}>🤯</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center", ...type.body, fontSize: 30, color: P.limeSoft, opacity: seg(t, C.smash + 0.15, C.smash + 0.3) }}>
        Free software · storage depends on your setup
      </div>
    </div>
  );
};

// =================================================================================================================
// A. The subscription problem (C.subsAt to C.ownAt)

const BILLS: { at: () => number; x: number; y: number; rot: number; title: string; sub: string; tone: "red" | "ink" | "gold" }[] = [
  { at: () => C.mahine, x: 330, y: 470, rot: -6, title: "Plan renews", sub: "every month", tone: "gold" },
  { at: () => C.subscription, x: 750, y: 600, rot: 5, title: "Subscription active", sub: "auto-renew on", tone: "ink" },
  { at: () => C.baar, x: 330, y: 780, rot: -4, title: "Storage almost full", sub: "upgrade to keep backing up", tone: "red" },
  { at: () => C.baar + 0.45, x: 760, y: 900, rot: 4, title: "Payment due", sub: "this month", tone: "gold" },
  { at: () => C.baar + 0.9, x: 740, y: 860, rot: -3, title: "Payment due", sub: "again", tone: "gold" },
  { at: () => C.khareedne, x: 360, y: 990, rot: 6, title: "Buy more storage?", sub: "storage full again", tone: "red" },
];

export const SubsScene: React.FC<S> = ({ t }) => {
  if (t < C.subsAt - 0.05 || t > C.naamAt + 0.5) return null;
  const inK = pop(t, C.subsAt, { damping: 13, stiffness: 160 });
  const swipe = eo(seg(t, C.tension, C.tension + 0.4));
  // The phone stays and becomes the "own setup" phone in the next scene, leaving with it.
  const toOwn = go(t, C.ownAt, C.ownAt + 0.55);
  const gone = eo(seg(t, C.naamAt - 0.1, C.naamAt + 0.3));
  const fill = lerp(0.82, 1, seg(t, C.khareedne - 0.2, C.khareedne + 0.3));
  return (
    <>
      <div style={{ ...centre(lerp(540, 330, toOwn), lerp(760, 770, toOwn), lerp(0.7, 1, mix(inK)) * lerp(1, 0.92, toOwn) * (1 - 0.15 * gone), `perspective(1200px) rotateY(${lerp(0, 24, toOwn)}deg)`), opacity: 1 - gone }}>
        <PhoneShell w={300} glow={toOwn}>
          <AppScreen w={300} t={t} rows={4} logo={false} search={<div style={{ padding: "4px 4px 6px" }}><StorageBar w={250} fill={toOwn > 0.5 ? 0.35 : fill} label={toOwn > 0.5 ? "Your storage" : "Storage"} note={toOwn > 0.5 ? "your disk" : fill > 0.97 ? "FULL" : undefined} /></div>} />
        </PhoneShell>
      </div>
      {BILLS.map((b, i) => {
        const k = pop(t, b.at(), { damping: 11, stiffness: 190 });
        if (k <= 0) return null;
        const dir = b.x < 540 ? -1 : 1;
        const fly = clamp01(swipe * 1.4 - i * 0.07);
        return (
          <div key={i} style={{ ...centre(b.x + dir * 1100 * eo(fly), b.y - 120 * fly, lerp(0.5, 1, mix(k)) * (k > 1 ? 1 + (k - 1) * 0.3 : 1), `rotate(${b.rot + dir * 40 * fly}deg)`), opacity: 1 - fly }}>
            <Notice w={390} title={b.title} sub={b.sub} tone={b.tone} />
          </div>
        );
      })}
      <Burst t={t} at={C.tension + 0.05} x={540} y={760} r={340} color={P.lime} />
    </>
  );
};

// =================================================================================================================
// B. Your own photo cloud (C.ownAt to C.naamAt)

export const OwnScene: React.FC<S> = ({ t }) => {
  if (t < C.ownAt || t > C.naamAt + 0.5) return null;
  const build = seg(t, C.serverBuild, C.serverBuild + 0.95);
  const line = seg(t, C.lineAt, C.lineAt + 0.45);
  const out = eo(seg(t, C.naamAt - 0.1, C.naamAt + 0.3));
  const title = pop(t, C.ownTitle, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.15 * out})`, transformOrigin: "540px 760px" }}>
      <div style={{ ...centre(770, 760, 1) }}>
        <HomeServer w={300} k={build} t={t} />
      </div>
      <FlowLine from={[470, 690]} to={[620, 690]} k={line} t={t} bend={-110} />
      {/* Photos travel along the line once it is drawn. */}
      {[0, 1, 2].map((i) => {
        const k = seg(t, C.lineAt + 0.5 + i * 0.45, C.lineAt + 1.1 + i * 0.45);
        if (k <= 0 || k >= 1) return null;
        const x = lerp(470, 620, k);
        const y = 690 + -110 * 2 * k * (1 - k);
        return (
          <div key={i} style={{ ...centre(x, y, 1, `rotate(${(k - 0.5) * 20}deg)`), border: `4px solid ${P.card}`, borderRadius: 10, boxShadow: shadow.hard(4) }}>
            <Snap kind={(["sunset", "family", "pet"] as SnapKind[])[i]} seed={i + 3} w={74} h={74} r={6} />
          </div>
        );
      })}
      {title > 0 && (
        <div style={{ ...centre(540, 400, mix(title) * (title > 1 ? 1 + (title - 1) * 0.3 : 1)) }}>
          <BigLabel text="YOUR OWN PHOTO CLOUD" size={64} tone="lime" />
        </div>
      )}
      <Sparks t={t} at={C.serverBuild + 0.95} x={770} y={620} />
    </div>
  );
};

// =================================================================================================================
// C. Immich reveal (C.naamAt to C.featAt)

export const RevealScene: React.FC<S> = ({ t }) => {
  if (t < C.naamAt || t > C.featAt + 0.3) return null;
  const inK = pop(t, C.naamAt, { damping: 12, stiffness: 170 });
  const flip = go(t, C.immich - 0.12, C.immich + 0.18);
  // Logo and name finish moving left before "FREE &" lands under them, so the labels never overlap.
  const toSide = go(t, C.immich + 0.45, C.freeWord);
  const name = pop(t, C.immich + 0.08, { damping: 9, stiffness: 220 });
  const free = pop(t, C.freeWord, { damping: 9, stiffness: 220 });
  const open = pop(t, C.openWord, { damping: 9, stiffness: 220 });
  const phone = pop(t, C.openWord + 0.05, { damping: 13, stiffness: 150 });
  const wiggle = t < C.immich - 0.12 ? Math.sin(t * 40) * 3 * seg(t, C.naamAt + 0.2, C.immich) : 0;
  const cardX = lerp(540, 300, toSide);
  const cardY = lerp(600, 500, toSide);
  const cardS = lerp(1, 0.72, toSide);
  const showLogo = flip >= 0.5;
  return (
    <>
      <div style={{ ...centre(cardX, cardY, mix(inK) * cardS, `perspective(900px) rotateY(${showLogo ? (1 - flip) * 180 : flip * 180}deg) rotate(${wiggle}deg)`) }}>
        <div style={{ width: 260, height: 260, borderRadius: 60, background: showLogo ? P.card : P.ink, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(10), display: "flex", alignItems: "center", justifyContent: "center" }}>
          {showLogo ? <ImmichLogo size={190} /> : <span style={{ ...type.display, fontSize: 170, color: P.lime }}>?</span>}
        </div>
      </div>
      <Burst t={t} at={C.immich} x={540} y={600} r={380} color={P.lime} />
      <Sparks t={t} at={C.immich} x={540} y={600} n={14} r={300} />
      {name > 0 && (
        <div style={{ ...centre(lerp(540, 300, toSide), lerp(820, 690, toSide), mix(name) * lerp(1, 0.8, toSide)), ...type.display, fontSize: 124, color: P.ink, letterSpacing: "0.02em" }}>IMMICH</div>
      )}
      {free > 0 && (
        <div style={{ ...centre(300, 800, mix(free) * (free > 1 ? 1 + (free - 1) * 0.3 : 1)) }}>
          <BigLabel text="FREE &" size={56} tone="lime" rotate={-3} />
        </div>
      )}
      {open > 0 && (
        <div style={{ ...centre(300, 900, mix(open) * (open > 1 ? 1 + (open - 1) * 0.3 : 1)) }}>
          <BigLabel text="OPEN SOURCE" size={56} tone="ink" rotate={2} />
        </div>
      )}
      {t > C.openWord + 0.3 && (
        <div style={{ position: "absolute", left: 100, width: 400, top: 975, ...type.body, fontSize: 25, lineHeight: 1.3, color: P.ink2, opacity: seg(t, C.openWord + 0.3, C.openWord + 0.6) }}>
          Free software. A server, disks and power can still cost money.
        </div>
      )}
      {phone > 0 && (
        <div style={{ ...centre(lerp(1250, 775, mix(phone)), 790, 1, `rotate(${lerp(14, 4, mix(phone))}deg)`) }}>
          <PhoneShell w={270} glow={0.5}>
            <AppScreen w={270} t={t} rows={4} seed={2} />
          </PhoneShell>
          <DemoTag style={{ left: 30, top: -40 }} />
        </div>
      )}
    </>
  );
};

// =================================================================================================================
// D. Features (C.featAt to C.crazyAt): auto backup, face recognition, albums, then all three ticked.

const FeatTitle: React.FC<{ t: number; at: number; out: number; text: string; note?: string }> = ({ t, at, out, text, note }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230 });
  const o = seg(t, out - 0.12, out + 0.05);
  if (k <= 0 || o >= 1) return null;
  return (
    <>
      <div style={{ ...centre(540, 400, mix(k) * (k > 1 ? 1 + (k - 1) * 0.3 : 1) * (1 - 0.3 * o)), opacity: 1 - o }}>
        <BigLabel text={text} size={62} tone="ink" />
      </div>
      {note && <div style={{ position: "absolute", left: 0, right: 0, top: 466, textAlign: "center", ...type.body, fontSize: 26, color: P.ink3, opacity: (1 - o) * seg(t, at + 0.15, at + 0.35) }}>{note}</div>}
    </>
  );
};

export const FeatScene: React.FC<S> = ({ t }) => {
  if (t < C.featAt - 0.1 || t > C.crazyAt + 0.3) return null;
  const end1 = C.faceAt;
  const end2 = C.albumsAt;
  const end3 = C.sabKuch;
  return (
    <>
      {/* 1. Auto backup: a new photo travels from the phone to the server; the ring fills and ticks. */}
      {t < end1 + 0.15 && (() => {
        const o = eo(seg(t, end1 - 0.12, end1 + 0.15));
        const k = seg(t, C.backupWord - 0.1, C.backupWord + 0.6);
        const inK = pop(t, C.featAt, { damping: 13, stiffness: 160 });
        return (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1100 * o}px)` }}>
            <div style={{ ...centre(290, 770, mix(inK)) }}>
              <PhoneShell w={230}>
                <AppScreen w={230} t={t} rows={3} seed={5} />
              </PhoneShell>
            </div>
            <div style={{ ...centre(800, 770, mix(inK)) }}>
              <HomeServer w={240} k={1} t={t} />
            </div>
            <FlowLine from={[400, 700]} to={[680, 700]} k={seg(t, C.featAt + 0.1, C.featAt + 0.45)} t={t} bend={-120} />
            {k > 0 && k < 1 && (
              <div style={{ ...centre(lerp(400, 680, k), 700 - 120 * 2 * k * (1 - k), 1.1, `rotate(${(k - 0.5) * 24}deg)`), border: `5px solid ${P.card}`, borderRadius: 12, boxShadow: shadow.hard(5) }}>
                <Snap kind="sunset" seed={1} w={96} h={96} r={8} />
              </div>
            )}
            <div style={{ ...centre(290, 1035) }}>
              <UploadRing size={110} k={seg(t, C.backupWord - 0.1, C.backupWord + 0.6)} />
            </div>
            <Sparks t={t} at={C.backupWord + 0.6} x={290} y={1035} />
          </div>
        );
      })()}
      <FeatTitle t={t} at={C.backupWord} out={end1} text="AUTO BACKUP" note="after you switch backup on in the app" />

      {/* 2. Face recognition: fictional portraits fly into a People row. */}
      {t > end1 - 0.1 && t < end2 + 0.15 && (() => {
        const o = eo(seg(t, end2 - 0.12, end2 + 0.15));
        const group = go(t, end1 + 0.35, end1 + 0.8);
        const faces = [0, 1, 0, 2, 1, 0];
        const slots: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
        return (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${-1100 * o}px)` }}>
            {faces.map((v, i) => {
              const k = pop(t, end1 + i * 0.04, { damping: 12, stiffness: 200 });
              const gx = [260, 540, 820][i % 3];
              const gy = 620 + Math.floor(i / 3) * 230;
              const n = slots[v]++;
              const tx = [300, 540, 780][v] + n * 22;
              const ty = 900 - n * 14;
              return (
                <div key={i} style={{ ...centre(lerp(gx, tx, group), lerp(gy, ty, group), mix(k) * lerp(1, 0.75, group)), background: P.card, padding: 10, borderRadius: 22, border: `4px solid ${P.ink}`, boxShadow: shadow.hard(5) }}>
                  <FaceChip size={150} v={v} />
                </div>
              );
            })}
            {group > 0.6 &&
              [0, 1, 2].map((v) => (
                <div key={v} style={{ ...centre([300, 540, 780][v] + 20, 1040), ...type.label, fontSize: 24, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "4px 14px", opacity: seg(t, end1 + 0.7, end1 + 0.85) }}>
                  {[3, 2, 1][v]} photos
                </div>
              ))}
          </div>
        );
      })()}
      <FeatTitle t={t} at={C.faceAt} out={end2} text="FACE RECOGNITION" note="sample faces, not real people" />

      {/* 3. Albums: a pile of photos sorts itself into three albums. */}
      {t > end2 - 0.1 && t < end3 + 0.15 && (() => {
        const o = eo(seg(t, end3 - 0.08, end3 + 0.15));
        const albums: [string, SnapKind][] = [
          ["Trips", "sunset"],
          ["Family", "family"],
          ["Food", "food"],
        ];
        const pile: [SnapKind, number][] = [
          ["sunset", 0],
          ["family", 1],
          ["food", 2],
          ["lake", 0],
          ["family", 1],
          ["food", 2],
        ];
        return (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `scale(${1 - 0.1 * o})`, transformOrigin: "540px 760px" }}>
            {albums.map(([name, kind], i) => (
              <div key={name} style={{ ...centre(300 + i * 240, 900, mix(pop(t, end2 + i * 0.05, { damping: 12 }))) }}>
                <Album w={190} name={name} kind={kind} seed={i + 1} />
              </div>
            ))}
            {pile.map(([kind, to], i) => {
              const k = go(t, end2 + 0.15 + i * 0.07, end2 + 0.5 + i * 0.07);
              if (k >= 1) return null;
              const sx = 440 + (i % 3) * 100;
              const sy = 580 + Math.floor(i / 3) * 40;
              return (
                <div key={i} style={{ ...centre(lerp(sx, 300 + to * 240, k), lerp(sy, 880, k) - 120 * Math.sin(Math.PI * k), lerp(1, 0.4, k), `rotate(${(i - 2.5) * 8 * (1 - k)}deg)`), border: `4px solid ${P.card}`, borderRadius: 10, boxShadow: shadow.hard(4) }}>
                  <Snap kind={kind} seed={i} w={120} h={120} r={6} />
                </div>
              );
            })}
          </div>
        );
      })()}
      <FeatTitle t={t} at={C.albumsAt} out={end3} text="ALBUMS" />

      {/* "Sab kuch!": all three, ticked. */}
      {t > end3 - 0.05 && (() => {
        const o = eo(seg(t, C.crazyAt - 0.25, C.crazyAt + 0.05));
        return (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
            {["AUTO BACKUP", "FACE RECOGNITION", "ALBUMS"].map((label, i) => {
              const k = pop(t, end3 + i * 0.14, { damping: 10, stiffness: 210 });
              if (k <= 0) return null;
              return (
                <div key={label} style={{ ...centre(540, 520 + i * 150, mix(k)), display: "flex", alignItems: "center", gap: 20, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 28, padding: "14px 30px 14px 18px", boxShadow: shadow.hard(7), width: 640, boxSizing: "border-box" }}>
                  <TickBox k={clamp01((t - end3 - i * 0.14 - 0.1) / 0.25)} size={76} />
                  <div style={{ ...type.display, fontSize: 52, color: P.ink, whiteSpace: "nowrap" }}>{label}</div>
                </div>
              );
            })}
            <Sparks t={t} at={end3 + 0.4} x={540} y={670} n={14} r={360} />
          </div>
        );
      })()}
    </>
  );
};

// =================================================================================================================
// E. Smart search (C.crazyAt to C.serverQ): the scene darkens, "Beach Sunset" is typed, sunset photos cascade in.

export const DarkVeil: React.FC<S> = ({ t }) => {
  const k = seg(t, C.crazyAt - 0.1, C.crazyAt + 0.4) * (1 - seg(t, C.serverQ - 0.1, C.serverQ + 0.3));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 60% 40%, rgba(20,20,20,${0.55 * k}) 0%, rgba(12,12,12,${0.86 * k}) 70%)` }} />;
};

export const SearchScene: React.FC<S> = ({ t }) => {
  if (t < C.crazyAt - 0.1 || t > C.serverQ + 0.35) return null;
  const inK = pop(t, C.crazyAt, { damping: 13, stiffness: 140 });
  const out = eo(seg(t, C.serverQ - 0.05, C.serverQ + 0.3));
  const active = seg(t, C.searchAt, C.searchAt + 0.3);
  const typed = 12 * seg(t, C.typeAt, C.typeTo);
  const thinking = t >= C.typeTo + 0.05 && t < C.resultsAt;
  const showResults = t >= C.resultsAt;
  const w = 360;
  const sw = w * 0.93;
  const label = pop(t, C.wowAt, { damping: 9, stiffness: 230 });
  const crazy = pop(t, C.featureWord, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {crazy > 0 && t < C.searchAt + 0.2 && (
        <div style={{ ...centre(540, 360, mix(crazy) * (1 - seg(t, C.searchAt - 0.1, C.searchAt + 0.2))), ...type.display, fontSize: 64, color: P.lime, whiteSpace: "nowrap" }}>SABSE CRAZY FEATURE?</div>
      )}
      <div style={{ ...centre(610, 770, lerp(0.6, 1, mix(inK))) }}>
        <PhoneShell w={w} glow={showResults ? 1 : 0.35}>
          <StatusRow w={sw} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: `10px ${sw * 0.06}px` }}>
            <ImmichLogo size={sw * 0.1} />
            <div style={{ ...type.display, fontSize: sw * 0.075, color: P.ink }}>immich</div>
          </div>
          <div style={{ padding: `0 ${sw * 0.05}px`, transform: `scale(${1 + 0.04 * active})`, transformOrigin: "50% 50%" }}>
            <SearchPill w={sw * 0.9} text="Beach Sunset" typed={typed} t={t} active={active} placeholder="Search your photos" />
          </div>
          <div style={{ ...type.display, fontSize: sw * 0.05, color: P.ink2, padding: `${sw * 0.04}px ${sw * 0.06}px ${sw * 0.02}px` }}>{showResults ? "Smart search results" : "Today"}</div>
          <div style={{ padding: `0 ${sw * 0.04}px`, position: "relative" }}>
            {!showResults && !thinking && <PhotoGrid w={sw * 0.92} rows={4} kinds={["family", "city", "food", "mountain", "pet", "flower", "family", "city", "food"]} seed={7} gap={4} dim={0.45 * active} />}
            {thinking && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, width: sw * 0.92 }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} style={{ height: (sw * 0.92 - 8) / 3, borderRadius: 6, background: P.paper2, opacity: 0.5 + 0.5 * Math.sin(t * 14 - i * 0.6) }} />
                ))}
              </div>
            )}
            {showResults && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4, width: sw * 0.92 }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const k = pop(t, C.resultsAt + i * 0.06, { damping: 12, stiffness: 200 });
                  const cell = (sw * 0.92 - 8) / 3;
                  return (
                    <div key={i} style={{ opacity: mix(k * 2), transform: `translateY(${(1 - mix(k)) * -140}px) scale(${lerp(1.4, 1, mix(k))}) rotate(${(1 - mix(k)) * (i % 2 ? 10 : -10)}deg)` }}>
                      <Snap kind={i % 4 === 3 ? "lake" : "sunset"} seed={i} w={cell} h={cell} r={6} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <TabBar w={sw} on={active > 0.5 ? 1 : 0} />
        </PhoneShell>
      </div>
      {/* Bigger photo cards float out of the phone for depth. */}
      {[
        { x: 215, y: 560, r: -10, s: 0, d: 0.25 },
        { x: 875, y: 600, r: 9, s: 3, d: 0.4 },
        { x: 870, y: 1010, r: -6, s: 5, d: 0.55 },
      ].map((c, i) => {
        const k = pop(t, C.resultsAt + c.d, { damping: 11, stiffness: 150 });
        if (k <= 0) return null;
        const bob = Math.sin(t * 2 + i) * 6;
        return (
          <div key={i} style={{ ...centre(lerp(610, c.x, mix(k)), lerp(770, c.y, mix(k)) + bob, lerp(0.3, 1, mix(k)), `perspective(800px) rotateY(${c.r * 2}deg) rotate(${c.r}deg)`), border: `7px solid ${P.card}`, borderRadius: 16, boxShadow: "0 24px 40px rgba(0,0,0,0.45)" }}>
            <Snap kind="sunset" seed={c.s} w={190} h={190} r={10} />
          </div>
        );
      })}
      {label > 0 && (
        <div style={{ ...centre(540, 352, mix(label) * (label > 1 ? 1 + (label - 1) * 0.3 : 1)) }}>
          <BigLabel text="SMART PHOTO SEARCH 🤯" size={54} tone="lime" />
        </div>
      )}
      <Sparks t={t} at={C.resultsAt + 0.1} x={610} y={600} n={14} r={380} />
      {t > C.searchAt && <DemoTag dark text="Illustration · results depend on your photos & setup" style={{ left: 80, top: 1118, opacity: seg(t, C.searchAt, C.searchAt + 0.3) }} />}
    </div>
  );
};

// =================================================================================================================
// F. Where does the server come from? (C.serverQ to C.warnAt)

export const ServerScene: React.FC<S> = ({ t }) => {
  if (t < C.serverQ - 0.05 || t > C.warnAt + 0.3) return null;
  const q = pop(t, C.qMark, { damping: 8, stiffness: 200 });
  const qOut = seg(t, C.oracleAt - 0.1, C.oracleAt + 0.15);
  const rise = pop(t, C.oracleAt, { damping: 14, stiffness: 110 });
  const always = pop(t, C.alwaysFree, { damping: 9, stiffness: 220 });
  const vm = go(t, C.vmAt, C.vmAt + 0.55);
  const up = go(t, C.limitAt - 0.1, C.limitAt + 0.4);
  const gauge = pop(t, C.limitAt + 0.1, { damping: 12, stiffness: 170 });
  const limited = pop(t, C.limitWord, { damping: 9, stiffness: 220 });
  const term = pop(t, C.techAt, { damping: 12, stiffness: 170 });
  const tech = pop(t, C.techWord, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.warnAt - 0.1, C.warnAt + 0.25));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {/* The big question mark above the presenter. */}
      {q > 0 && qOut < 1 && (
        <div style={{ ...centre(540, 470, mix(q) * (1 - qOut) * (q > 1 ? 1 + (q - 1) * 0.3 : 1), `rotate(${Math.sin(t * 6) * 6}deg)`), ...type.display, fontSize: 300, color: P.ink, textShadow: `12px 12px 0 ${P.lime}` }}>?</div>
      )}
      {q > 0 && qOut < 1 && [[300, 560, -14], [800, 600, 12]].map(([x, y, r], i) => (
        <div key={i} style={{ ...centre(x, y, mix(pop(t, C.qMark + 0.15 + i * 0.1, { damping: 9 })) * (1 - qOut), `rotate(${r}deg)`), ...type.display, fontSize: 110, color: P.olive }}>?</div>
      ))}
      {/* Oracle Cloud: the cloud rises, then moves up when the limits come in. */}
      {rise > 0 && (
        <div style={{ ...centre(540, lerp(lerp(1500, 640, mix(rise)), 455, up), lerp(1, 0.5, up)) }}>
          <div style={{ position: "relative", width: 840, height: 588 }}>
            <div style={{ position: "absolute", inset: 0 }}>
              <CloudIcon size={840} fill={P.limeSoft} stroke={1.8} />
            </div>
            {/* The text sits in the wide lower body of the cloud so the outline never cuts it. */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 262, textAlign: "center", ...type.display, fontSize: 80, color: P.ink, whiteSpace: "nowrap" }}>ORACLE CLOUD</div>
            {always > 0 && (
              <div style={{ position: "absolute", left: 0, right: 0, top: 372, display: "flex", justifyContent: "center", transform: `scale(${mix(always) * (always > 1 ? 1 + (always - 1) * 0.3 : 1)})` }}>
                <BigLabel text="ALWAYS FREE TIER" size={62} tone="ink" />
              </div>
            )}
          </div>
        </div>
      )}
      {vm > 0 && up < 1 && (
        <div style={{ ...centre(540, 1000, lerp(0.4, 1, vm) * (1 - up), "") , opacity: 1 - up }}>
          <VmCard w={360} t={t} spin={lerp(180, 0, vm)} />
        </div>
      )}
      {vm > 0.6 && up < 1 && (
        <div style={{ ...centre(540, 1125), ...type.label, fontSize: 22, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "6px 16px", whiteSpace: "nowrap", opacity: 1 - up }}>
          Arm VM: up to 2 OCPU · 12 GB RAM
        </div>
      )}
      {/* The catches: limited storage, technical setup. */}
      {gauge > 0 && (
        <div style={{ ...centre(300, 740, mix(gauge)), background: P.card, border: `5px solid ${P.ink}`, borderRadius: 28, padding: "22px 20px 16px", boxShadow: shadow.hard(7) }}>
          <Gauge size={330} fill={lerp(0, 0.9, go(t, C.limitAt + 0.2, C.limitAt + 1.1))} label="200 GB block storage, total" />
        </div>
      )}
      {limited > 0 && (
        <div style={{ ...centre(300, 965, mix(limited) * (limited > 1 ? 1 + (limited - 1) * 0.3 : 1)) }}>
          <BigLabel text="LIMITED RESOURCES" size={44} tone="red" />
        </div>
      )}
      {term > 0 && (
        <div style={{ ...centre(740, 740, mix(term), `rotate(${(1 - mix(term)) * 8}deg)`) }}>
          <Terminal w={400} t={t} k={seg(t, C.techAt + 0.15, C.warnAt - 0.3)} lines={["ssh ubuntu@your-vm", "docker compose up -d", "Starting immich..."]} />
        </div>
      )}
      {tech > 0 && (
        <div style={{ ...centre(740, 975, mix(tech) * (tech > 1 ? 1 + (tech - 1) * 0.3 : 1)) }}>
          <BigLabel text={"TECHNICAL SETUP\nREQUIRED"} size={40} tone="ink" style={{ whiteSpace: "pre", textAlign: "center", lineHeight: 1.05 }} />
        </div>
      )}
      {t > C.limitAt + 0.4 && (
        <div style={{ position: "absolute", left: 80, right: 130, top: 1075, textAlign: "center", ...type.body, fontSize: 23, lineHeight: 1.3, color: P.ink2, opacity: seg(t, C.limitAt + 0.4, C.limitAt + 0.7) }}>
          Always Free limits and capacity apply; idle VMs can be reclaimed. Immich needs 6 GB+ RAM.
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// G. The backup warning (C.warnAt to C.askAt)

export const BackupScene: React.FC<S> = ({ t }) => {
  if (t < C.warnAt - 0.05 || t > C.askAt + 0.3) return null;
  const w = pop(t, C.warnAt, { damping: 8, stiffness: 230 });
  const small = go(t, C.copiesAt - 0.05, C.copiesAt + 0.35);
  const sh = shakeAt(t, C.warnAt, 14, 0.5);
  const one = pop(t, C.copiesAt + 0.05, { damping: 12, stiffness: 170 });
  const apart = go(t, C.alagWord - 0.25, C.alagWord + 0.4);
  const keep = pop(t, C.zaroori, { damping: 9, stiffness: 220 });
  const out = eo(seg(t, C.askAt - 0.1, C.askAt + 0.2));
  const ring = seg(t, C.warnAt, C.warnAt + 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
      {ring > 0 && ring < 1 && <div style={{ ...centre(540, 640, 1), width: 260 + 500 * ring, height: 260 + 500 * ring, borderRadius: 999, border: `${16 * (1 - ring)}px solid ${RED}`, opacity: 1 - ring }} />}
      {w > 0 && (
        <div style={{ ...centre(lerp(540 + sh, 540, small), lerp(640, 400, small), mix(w) * lerp(1, 0.45, small) * (w > 1 ? 1 + (w - 1) * 0.3 : 1)) }}>
          <WarnIcon size={260} />
        </div>
      )}
      {small > 0.5 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 478, textAlign: "center", ...type.body, fontSize: 26, color: P.ink2, opacity: seg(t, C.copiesAt + 0.2, C.copiesAt + 0.45) }}>
          Immich's own docs: set up separate backups
        </div>
      )}
      {one > 0 &&
        [0, 1].map((i) => {
          const x = lerp(540, i === 0 ? 300 : 780, apart);
          const show = i === 0 || apart > 0;
          if (!show) return null;
          return (
            <div key={i} style={{ ...centre(x, 790, mix(one) * lerp(1, 0.86, apart), `rotate(${lerp(0, i === 0 ? -3 : 3, apart)}deg)`) }}>
              <DriveStack w={340} label={apart < 0.5 ? "YOUR PHOTOS" : i === 0 ? "IMMICH\nSTORAGE" : "SEPARATE\nBACKUP"} tone={i === 0 ? "lime" : "ink"} seed={2} logo={i === 0 && apart >= 0.5} />
            </div>
          );
        })}
      {apart > 0.8 && (
        <div style={{ ...centre(540, 760), ...type.label, fontSize: 24, color: P.ink, background: P.card, border: `3px dashed ${P.ink}`, borderRadius: 99, padding: "6px 14px", opacity: seg(t, C.alagWord + 0.25, C.alagWord + 0.45) }}>copy</div>
      )}
      {keep > 0 && (
        <div style={{ ...centre(540, 1075, mix(keep) * (keep > 1 ? 1 + (keep - 1) * 0.3 : 1)) }}>
          <BigLabel text="ALWAYS KEEP A SECOND BACKUP" size={44} tone="ink" />
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// H. Call to action and outro (C.askAt to the end)

const SetupDiagram: React.FC<{ t: number; w: number }> = ({ t, w }) => {
  const steps = ["Get a server", "Install with Docker", "Connect the app", "Add a backup"];
  const ats = [C.setupAt + 0.35, C.stepWord, C.stepWord + 0.35, C.stepWord + 0.7];
  return (
    <div style={{ position: "absolute", inset: 0, padding: 22, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ImmichLogo size={44} />
        <div style={{ ...type.display, fontSize: 34, color: P.ink }}>Immich setup</div>
        <div style={{ flex: 1 }} />
        <div style={{ ...type.label, fontSize: 16, color: P.ink3, border: `2px solid ${P.line}`, borderRadius: 8, padding: "3px 8px" }}>Simplified</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 26, padding: "0 10px" }}>
        {[
          { label: "Phone app", icon: <div style={{ width: 46, height: 80, borderRadius: 12, background: P.ink, border: `4px solid ${P.ink}` }}><div style={{ margin: 5, height: 62, borderRadius: 8, background: P.lime }} /></div> },
          { label: "Your server", icon: <div style={{ width: 92, height: 80, borderRadius: 14, background: P.ink, display: "flex", alignItems: "center", justifyContent: "center" }}><ImmichLogo size={50} /></div> },
          { label: "Backup", icon: <div style={{ width: 92, height: 64, borderRadius: 14, background: P.lime, border: `4px solid ${P.ink}` }} /> },
        ].map((n, i, arr) => (
          <React.Fragment key={n.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: seg(t, C.setupAt + i * 0.12, C.setupAt + 0.2 + i * 0.12) }}>
              {n.icon}
              <div style={{ ...type.display, fontSize: 22, color: P.ink }}>{n.label}</div>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: 6, margin: "0 12px 30px", borderRadius: 6, background: `repeating-linear-gradient(90deg, ${P.olive} 0 14px, transparent 14px 24px)`, backgroundPosition: `${t * 60}px 0` }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
        {steps.map((s, i) => {
          const k = pop(t, ats[i], { damping: 11, stiffness: 210 });
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 14, padding: "8px 12px", transform: `scale(${mix(k)})`, opacity: mix(k * 2) }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: P.lime, border: `3px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 20 }}>{i + 1}</div>
              <div style={{ ...type.display, fontSize: 22, color: P.ink, whiteSpace: "nowrap" }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.askAt - 0.05) return null;
  const lap = pop(t, C.setupAt, { damping: 13, stiffness: 150 });
  const lapOut = go(t, C.commentAt - 0.15, C.commentAt + 0.2);
  const step = pop(t, C.stepWord, { damping: 9, stiffness: 220 });
  const bubble = pop(t, C.photoWord, { damping: 8, stiffness: 230 });
  const ctaOut = eo(seg(t, C.outroAt - 0.1, C.outroAt + 0.2));
  const mark = pop(t, C.outroAt + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, C.outroAt + 0.25, { damping: 11, stiffness: 190 });
  const series = pop(t, C.outroAt + 0.45, { damping: 11, stiffness: 190 });
  return (
    <>
      {lap > 0 && lapOut < 1 && (
        <div style={{ ...centre(540, lerp(lerp(1300, 760, mix(lap)), 1500, lapOut), 1, `rotate(${(1 - mix(lap)) * 6}deg)`), opacity: 1 - lapOut }}>
          <Laptop w={820}>
            <SetupDiagram t={t} w={820} />
          </Laptop>
        </div>
      )}
      {step > 0 && lapOut < 1 && (
        <div style={{ ...centre(540, 400, mix(step) * (step > 1 ? 1 + (step - 1) * 0.3 : 1) * (1 - lapOut)) }}>
          <BigLabel text="STEP-BY-STEP SETUP?" size={58} tone="lime" />
        </div>
      )}
      {ctaOut < 1 && t > C.commentAt - 0.1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - ctaOut }}>
          <CommentCard t={t} at={C.commentAt} keyword="PHOTO" typeAt={C.photoWord - 0.05} typeTo={C.photoWord + 0.35} sendAt={C.photoWord + 0.5} top={820} />
          {bubble > 0 && (
            <div style={{ ...centre(540, 560, mix(bubble) * (bubble > 1 ? 1 + (bubble - 1) * 0.3 : 1), `rotate(${(1 - mix(bubble)) * -12 - 3}deg)`) }}>
              <div style={{ position: "relative", background: P.lime, border: `7px solid ${P.ink}`, borderRadius: 60, padding: "18px 56px", boxShadow: shadow.hard(10), display: "flex", alignItems: "center", gap: 22 }}>
                <span style={{ ...type.display, fontSize: 150, color: P.ink }}>PHOTO</span>
                <span style={{ fontSize: 120, lineHeight: 1 }}>📸</span>
                <div style={{ position: "absolute", left: 120, bottom: -46, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `46px solid ${P.ink}` }} />
                <div style={{ position: "absolute", left: 128, bottom: -32, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `32px solid ${P.lime}` }} />
              </div>
            </div>
          )}
          <Burst t={t} at={C.photoWord} x={540} y={560} r={420} color={P.lime} />
          <Sparks t={t} at={C.photoWord + 0.5} x={880} y={882} />
          {t > C.commentAt + 0.3 && <div style={{ position: "absolute", left: 0, right: 0, top: 975, textAlign: "center", ...type.body, fontSize: 26, color: P.ink3, opacity: seg(t, C.commentAt + 0.3, C.commentAt + 0.6) }}>Tell me if you want the full setup video</div>}
        </div>
      )}
      {/* Outro: brand, handle, follow. */}
      {mark > 0 && (
        <div style={{ ...centre(540, 540, mix(mark) * (mark > 1 ? 1 + (mark - 1) * 0.3 : 1), `rotate(${(1 - mix(mark)) * 20}deg)`) }}>
          <BrandMark size={170} />
        </div>
      )}
      {handle > 0 && (
        <div style={{ ...centre(540, 715, mix(handle)), ...type.display, fontSize: 60, color: P.ink, whiteSpace: "nowrap" }}>
          FOLLOW <span style={{ background: P.lime, borderRadius: 12, padding: "0 12px" }}>@INTERNETOOLBOX</span>
        </div>
      )}
      {series > 0 && (
        <div style={{ ...centre(540, 795, mix(series)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Creator Secrets · tech tricks that save money</div>
      )}
      <FollowButton t={t} at={C.outroAt + 0.6} tapAt={C.followWord} top={850} invite />
      {t > C.followWord && (
        <div style={{ ...centre(800, 900, mix(pop(t, C.followWord + 0.1, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
    </>
  );
};

/** Little sticker shown on the hook so viewers know which series this is. */
export const SeriesTag: React.FC<S> = ({ t }) => {
  // Shown in the empty top band before the title lands, so it never covers the phone or the presenter.
  if (t > C.google) return null;
  const k = pop(t, 0.3, { damping: 12, stiffness: 180 });
  return (
    <div style={{ ...centre(540, 420, mix(k) * (1 - seg(t, C.google - 0.2, C.google))) }}>
      <Sticker size={30} tone="ink" rotate={-2}>
        CREATOR SECRETS #02
      </Sticker>
    </div>
  );
};

export const randomSeed = random;
