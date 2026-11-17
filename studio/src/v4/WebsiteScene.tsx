import React from "react";
import { random } from "remotion";
import { LAYOUT, palette as P } from "../brand/tokens";
import { camAt, ProofPanel, toFrame, type Cam, type Rect } from "../brand/ProofPanel";
import { Headline } from "../brand/Headline";
import { ClickRing, Coin, LabelPill, Pointer, Sticker } from "../brand/Bits";
import { range, usePop } from "../components/motion";
import { reel01v4 as ep } from "../episodes/reel01v4";

/**
 * The real PiliApp page (owner's screenshot), shown from 2.8 to 9.4 s.
 * A virtual camera moves over the screenshot: address bar, then the ruler, then the whole page with its ad slots.
 */
const PANEL = LAYOUT.panel;

// Camera keys in screenshot-crop pixels. Each move takes 0.55 s from its start time.
const CAM: [number, Cam][] = [
  [0, { cx: 750, cy: 470, z: 0.58 }],
  [3.0, { cx: 422, cy: 237, z: 1.15 }],
  [4.35, { cx: 750, cy: 400, z: 0.8 }],
  [5.98, { cx: 750, cy: 470, z: 0.58 }],
];
// Regions of the cropped screenshot.
const URL_BAR: Rect = { x: 44, y: 14, w: 336, h: 42 };
const RULER: Rect = { x: -10, y: 380, w: 1520, h: 166 };
const ADS: Rect[] = [
  { x: 130, y: 578, w: 405, h: 336 },
  { x: 562, y: 578, w: 405, h: 336 },
  { x: 994, y: 578, w: 405, h: 336 },
];

export const WebsiteScene: React.FC<{ t: number }> = ({ t }) => {
  const enter = usePop(t, 2.8, { damping: 14, stiffness: 120, mass: 0.9 });
  if (t < 2.75 || t > 9.45) return null;
  const c = camAt(CAM, t);
  const out = range(t, 9.15, 9.4);
  return (
    <>
      {/* The ad creatives are softened: the slots stay visible, third-party brands are not featured. */}
      <ProofPanel panel={PANEL} shot={ep.screenshot} crop={ep.crop} cam={c} enter={enter} out={out} soften={ADS}>
        <Highlight t={t} r={URL_BAR} at={3.5} outAt={4.4} z={c.z} />
        <RulerSweep t={t} r={RULER} at={4.75} outAt={5.95} z={c.z} />
        {ADS.map((r, i) => (
          <Highlight key={i} t={t} r={r} at={7.47 + i * 0.09} outAt={9.2} z={c.z} dashed />
        ))}
      </ProofPanel>

      {/* Labels in frame space, so they stay crisp and readable while the camera moves. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        <DomainTag t={t} />
        <RealBadge t={t} at={3.15} />
        <RulerTag t={t} />
        {ADS.map((r, i) => {
          const [x, y] = toFrame(PANEL, r.x, r.y, c);
          return <AdBadge key={i} t={t} at={7.47 + i * 0.09} x={x + 10} y={y + 10} />;
        })}
        {ADS.map((r, i) => {
          const [x, y] = toFrame(PANEL, r.x + r.w / 2, r.y, c);
          return <RisingCoin key={i} t={t} at={7.72 + i * 0.07} x={x} y={y} />;
        })}
        <Cursor t={t} />
        <Visitors t={t} />
      </div>

      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={6.86}
        outAt={9.15}
        pulse={{ text: "= earning possible", at: 8.42 }}
        lines={[
          { size: 88, segs: [{ text: "Traffic", at: 6.86, tone: "marker" }, { text: "+ ads", at: 7.47 }] },
          { size: 66, segs: [{ text: "= earning possible", at: 7.71, tone: "lime" }] },
        ]}
      />
    </>
  );
};

/** Ink frame with a lime wash around a part of the screenshot. Sizes are divided by the zoom to look constant. */
const Highlight: React.FC<{ t: number; r: Rect; at: number; outAt: number; z: number; dashed?: boolean }> = ({ t, r, at, outAt, z, dashed }) => {
  const p = usePop(t, at, { damping: 12, stiffness: 190, mass: 0.6 });
  const out = range(t, outAt, outAt + 0.2);
  if (p <= 0 || out >= 1) return null;
  const pad = 8 / z;
  return (
    <div
      style={{
        position: "absolute",
        left: r.x - pad,
        top: r.y - pad,
        width: r.w + pad * 2,
        height: r.h + pad * 2,
        borderRadius: 16 / z,
        border: `${6 / z}px ${dashed ? "dashed" : "solid"} ${P.ink}`,
        background: `${P.lime}38`,
        boxShadow: `0 0 0 ${4 / z}px ${P.lime}`,
        transform: `scale(${1.25 - 0.25 * Math.min(p, 1.05)})`,
        opacity: Math.min(1, p * 2) * (1 - out),
      }}
    />
  );
};

const RulerSweep: React.FC<{ t: number; r: Rect; at: number; outAt: number; z: number }> = ({ t, r, at, outAt, z }) => {
  const p = range(t, at, at + 0.25);
  const out = range(t, outAt, outAt + 0.2);
  if (p <= 0 || out >= 1) return null;
  const sweep = range(t, at, at + 0.9);
  return (
    <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", opacity: p * (1 - out) }}>
      <div style={{ position: "absolute", inset: 0, borderTop: `${5 / z}px solid ${P.ink}`, borderBottom: `${5 / z}px solid ${P.ink}`, background: `${P.lime}4D` }} />
      <div
        style={{
          position: "absolute",
          top: -20,
          height: r.h + 40,
          width: 240,
          left: -300 + sweep * (r.w + 600),
          background: "linear-gradient(90deg, transparent, #FFFFFFCC, transparent)",
          transform: "skewX(-20deg)",
        }}
      />
    </div>
  );
};

/** PILIAPP.COM: big under the real address bar, then parked on the panel's top-left corner. */
const DomainTag: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 3.52, { damping: 9, stiffness: 200, mass: 0.6 });
  if (p <= 0) return null;
  const park = range(t, 4.35, 4.75);
  const x = 112 + (96 - 112) * park;
  const y = 616 + (500 - 616) * park;
  const s = 1 - 0.42 * park;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `scale(${s * Math.min(p, 1.1)})`, opacity: Math.min(1, p * 2) }}>
      <svg width={60} height={36} viewBox="0 0 60 36" style={{ position: "absolute", left: 120, top: -31, opacity: 1 - park }}>
        <path d="M30 3 L57 33 H3 Z" fill={P.lime} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <Sticker size={64} rotate={0}>
        PILIAPP.COM
      </Sticker>
    </div>
  );
};

const RealBadge: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 190, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", right: 1080 - (PANEL.x + PANEL.w) + 14, top: PANEL.y - 30, transformOrigin: "100% 50%" }}>
      <LabelPill text="Real website" t={t} size={28} pop={p} />
    </div>
  );
};

const RulerTag: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 4.75, { damping: 10, stiffness: 200, mass: 0.6 });
  const out = range(t, 5.9, 6.1);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1030, top: 726, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out) }}>
      <Sticker size={52} pop={p}>
        Online ruler
      </Sticker>
    </div>
  );
};

const AdBadge: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 220, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <Sticker size={38} tone="ink" rotate={-6} pop={p}>
        AD
      </Sticker>
    </div>
  );
};

const RisingCoin: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = range(t, at, at + 1.0);
  if (t < at || k >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x - 32, top: y - 40 - k * 170, opacity: k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3 }}>
      <Coin size={64} spin={Math.cos((t - at) * 9)} />
    </div>
  );
};

/** A mouse pointer that glides to the real address bar and clicks it. */
const Cursor: React.FC<{ t: number }> = ({ t }) => {
  if (t < 3.06 || t > 3.74) return null;
  const k = range(t, 3.06, 3.48);
  const target = toFrame(PANEL, URL_BAR.x + 230, URL_BAR.y + 22, CAM[1][1]);
  const x = 900 + (target[0] - 900) * k;
  const y = 1150 + (target[1] - 1150) * k - Math.sin(k * Math.PI) * 120;
  const press = t > 3.48 && t < 3.58 ? 0.82 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - range(t, 3.56, 3.7) }}>
      {t >= 3.5 && <ClickRing k={range(t, 3.5, 3.72)} />}
      <Pointer press={press} />
    </div>
  );
};

/** Visitors streaming into the page while "traffic" is said (an illustration, no numbers). */
const VISITORS = Array.from({ length: 16 }, (_, i) => ({
  t0: 6.88 + i * 0.065,
  fromLeft: i % 2 === 0,
  sy: 560 + random(`vy-${i}`) * 560,
  ex: 200 + random(`vx-${i}`) * 640,
  ey: 640 + random(`vey-${i}`) * 260,
  color: [P.lime, P.card, P.gold][i % 3],
}));
const Visitors: React.FC<{ t: number }> = ({ t }) => (
  <>
    {VISITORS.map((v, i) => {
      const k = (t - v.t0) / 0.8;
      if (k < 0 || k > 1) return null;
      const e = 1 - Math.pow(1 - k, 2);
      const x = (v.fromLeft ? -60 : 1140) + (v.ex - (v.fromLeft ? -60 : 1140)) * e;
      const y = v.sy + (v.ey - v.sy) * e - Math.sin(e * Math.PI) * 90;
      const s = 1 - 0.45 * e;
      const o = k > 0.72 ? 1 - (k - 0.72) / 0.28 : 1;
      return (
        <svg key={i} width={46} height={58} viewBox="0 0 46 58" style={{ position: "absolute", left: x - 23, top: y - 29, transform: `scale(${s})`, opacity: o }}>
          <circle cx={23} cy={15} r={11} fill={v.color} stroke={P.ink} strokeWidth={4} />
          <path d="M5 54 C5 36 13 29 23 29 C33 29 41 36 41 54 Z" fill={v.color} stroke={P.ink} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      );
    })}
  </>
);
