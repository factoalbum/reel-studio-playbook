import React from "react";
import { Img, random, staticFile } from "remotion";
import { colors, fontFamily } from "../theme";
import { range, usePop } from "../components/motion";
import { KineticHeader } from "../components/KineticHeader";
import { reel01v3 as ep } from "../episodes/reel01v3";

/**
 * The real PiliApp page (owner's screenshot), shown from 2.8 to 9.4 s.
 * A virtual camera moves over the screenshot: address bar, then the ruler, then the whole page with its ad slots.
 */
export const PANEL = { x: 80, y: 540, w: 870, h: 545 };
type Cam = { cx: number; cy: number; z: number };
type Rect = { x: number; y: number; w: number; h: number };

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

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function camAt(t: number): Cam {
  let i = 0;
  for (let k = 0; k < CAM.length; k++) if (CAM[k][0] <= t) i = k;
  const [at, cur] = CAM[i];
  const prev = i > 0 ? CAM[i - 1][1] : cur;
  const k = easeInOut(Math.max(0, Math.min(1, (t - at) / 0.55)));
  const z = Math.exp(Math.log(prev.z) + (Math.log(cur.z) - Math.log(prev.z)) * k);
  return { cx: prev.cx + (cur.cx - prev.cx) * k, cy: prev.cy + (cur.cy - prev.cy) * k, z };
}
/** Screenshot-crop point to frame pixels. */
const toFrame = (u: number, v: number, c: Cam): [number, number] => [PANEL.x + PANEL.w / 2 + (u - c.cx) * c.z, PANEL.y + PANEL.h / 2 + (v - c.cy) * c.z];

export const WebsiteScene: React.FC<{ t: number }> = ({ t }) => {
  const enter = usePop(t, 2.8, { damping: 14, stiffness: 120, mass: 0.9 });
  if (t < 2.75 || t > 9.45) return null;
  const c = camAt(t);
  const out = range(t, 9.15, 9.4);
  const { crop, screenshot: ss } = ep;
  const shot = staticFile(ss.file);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: 26,
          overflow: "hidden",
          background: "#FFFFFF",
          border: `4px solid ${colors.cyan}AA`,
          boxShadow: `0 0 70px ${colors.cyan}55, 0 40px 90px #00000099`,
          transform: `translateY(${(1 - enter) * 340 + out * 120}px) scale(${(0.7 + 0.3 * enter) * (1 - 0.12 * out)}) rotate(${(1 - Math.min(enter, 1)) * -5}deg)`,
          opacity: Math.min(1, enter * 1.5) * (1 - out),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: crop.w,
            height: crop.h,
            overflow: "hidden",
            transformOrigin: "0 0",
            transform: `translate(${PANEL.w / 2 - c.cx * c.z}px, ${PANEL.h / 2 - c.cy * c.z}px) scale(${c.z})`,
          }}
        >
          <Img src={shot} style={{ position: "absolute", left: -crop.x, top: -crop.y, width: ss.width, height: ss.height }} />
          {/* The ad creatives are softened: the slots stay visible, third-party brands are not featured. */}
          {ADS.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden" }}>
              <Img src={shot} style={{ position: "absolute", left: -crop.x - r.x, top: -crop.y - r.y, width: ss.width, height: ss.height, filter: "blur(6px)" }} />
            </div>
          ))}
          <Highlight t={t} r={URL_BAR} at={3.5} outAt={4.4} z={c.z} color={colors.yellow} />
          <RulerSweep t={t} r={RULER} at={4.75} outAt={5.95} z={c.z} />
          {ADS.map((r, i) => (
            <Highlight key={i} t={t} r={r} at={7.47 + i * 0.09} outAt={9.2} z={c.z} color={colors.yellow} dashed />
          ))}
        </div>
      </div>

      {/* Labels in frame space, so they stay crisp and readable while the camera moves. */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
        <DomainTag t={t} />
        <Badge t={t} at={3.15} />
        <RulerTag t={t} />
        {ADS.map((r, i) => {
          const [x, y] = toFrame(r.x, r.y, c);
          return <AdBadge key={i} t={t} at={7.47 + i * 0.09} x={x + 10} y={y + 10} />;
        })}
        {ADS.map((r, i) => {
          const [x, y] = toFrame(r.x + r.w / 2, r.y, c);
          return <RisingCoin key={i} t={t} at={7.72 + i * 0.07} x={x} y={y} />;
        })}
        <Cursor t={t} />
        <Visitors t={t} />
      </div>

      <KineticHeader
        t={t}
        top={326}
        inAt={6.86}
        outAt={9.15}
        pulse={{ text: "POSSIBLE", at: 8.42 }}
        lines={[
          { size: 96, segs: [{ text: "TRAFFIC", at: 6.86, color: colors.cyan }, { text: "+ ADS", at: 7.47 }] },
          { size: 70, segs: [{ text: "= EARNING", at: 7.71, color: colors.yellow }, { text: "POSSIBLE", at: 7.71, color: colors.yellow }] },
        ]}
      />
    </>
  );
};

const Highlight: React.FC<{ t: number; r: Rect; at: number; outAt: number; z: number; color: string; dashed?: boolean }> = ({ t, r, at, outAt, z, color, dashed }) => {
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
        border: `${6 / z}px ${dashed ? "dashed" : "solid"} ${color}`,
        boxShadow: `0 0 ${30 / z}px ${color}AA`,
        background: `${color}14`,
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
      <div style={{ position: "absolute", inset: 0, borderTop: `${6 / z}px solid ${colors.cyan}`, borderBottom: `${6 / z}px solid ${colors.cyan}`, background: `${colors.cyan}1F`, boxShadow: `inset 0 0 ${40 / z}px ${colors.cyan}88` }} />
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
      <svg width={60} height={34} viewBox="0 0 60 34" style={{ position: "absolute", left: 120, top: -30, opacity: 1 - park }}>
        <path d="M30 2 L58 32 H2 Z" fill={colors.yellow} stroke={colors.navy} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div
        style={{
          fontFamily,
          fontWeight: 900,
          fontSize: 68,
          letterSpacing: 1,
          color: colors.navy,
          background: colors.yellow,
          border: `6px solid ${colors.navy}`,
          borderRadius: 22,
          padding: "6px 30px 8px",
          whiteSpace: "nowrap",
          boxShadow: `0 0 40px ${colors.yellow}88, 0 14px 30px #00000066`,
        }}
      >
        PILIAPP.COM
      </div>
    </div>
  );
};

const Badge: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 190, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 1080 - (PANEL.x + PANEL.w) + 14,
        top: PANEL.y - 30,
        transform: `scale(${p})`,
        transformOrigin: "100% 50%",
        fontFamily,
        fontWeight: 800,
        fontSize: 30,
        color: colors.navy,
        background: colors.cyan,
        border: `5px solid ${colors.navy}`,
        borderRadius: 40,
        padding: "6px 20px",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 14, background: colors.navy, opacity: Math.floor(t * 3) % 2 ? 1 : 0.35 }} />
      REAL WEBSITE
    </div>
  );
};

const RulerTag: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 4.75, { damping: 10, stiffness: 200, mass: 0.6 });
  const out = range(t, 5.9, 6.1);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1030, top: 726, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out) }}>
      <div
        style={{
          transform: `scale(${p}) rotate(-3deg)`,
          fontFamily,
          fontWeight: 900,
          fontSize: 50,
          color: colors.navy,
          background: colors.cyan,
          border: `6px solid ${colors.navy}`,
          borderRadius: 18,
          padding: "4px 26px 6px",
          whiteSpace: "nowrap",
          boxShadow: `0 0 36px ${colors.cyan}88`,
        }}
      >
        ONLINE RULER
      </div>
    </div>
  );
};

const AdBadge: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 220, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${p}) rotate(-6deg)`,
        fontFamily,
        fontWeight: 900,
        fontSize: 40,
        color: colors.navy,
        background: colors.yellow,
        border: `5px solid ${colors.navy}`,
        borderRadius: 14,
        padding: "0px 16px 2px",
        boxShadow: `0 0 26px ${colors.yellow}AA`,
      }}
    >
      AD
    </div>
  );
};

const RisingCoin: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const k = range(t, at, at + 1.0);
  if (t < at || k >= 1) return null;
  const spin = Math.cos((t - at) * 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 34,
        top: y - 40 - k * 170,
        width: 68,
        height: 68,
        borderRadius: 68,
        background: `radial-gradient(circle at 35% 30%, #FEF08A, ${colors.yellow} 55%, #CA8A04)`,
        border: `5px solid ${colors.navy}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        fontWeight: 900,
        fontSize: 38,
        color: "#713F12",
        transform: `scaleX(${0.3 + 0.7 * Math.abs(spin)})`,
        opacity: k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3,
      }}
    >
      ₹
    </div>
  );
};

/** A mouse pointer that glides to the real address bar and clicks it. */
const Cursor: React.FC<{ t: number }> = ({ t }) => {
  if (t < 3.06 || t > 3.74) return null;
  const k = range(t, 3.06, 3.48);
  const target = toFrame(URL_BAR.x + 230, URL_BAR.y + 22, CAM[1][1]);
  const x = 900 + (target[0] - 900) * k;
  const y = 1150 + (target[1] - 1150) * k - Math.sin(k * Math.PI) * 120;
  const press = t > 3.48 && t < 3.58 ? 0.82 : 1;
  const ring = range(t, 3.5, 3.72);
  const fade = range(t, 3.56, 3.7);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: 1 - fade }}>
      {t >= 3.5 && (
        <div
          style={{
            position: "absolute",
            left: -40 - ring * 30,
            top: -40 - ring * 30,
            width: 80 + ring * 60,
            height: 80 + ring * 60,
            borderRadius: 200,
            border: `6px solid ${colors.yellow}`,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg width={64} height={78} viewBox="0 0 64 78" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 6px 10px #00000088)" }}>
        <path d="M4 4 L4 62 L19 48 L30 73 L42 68 L31 43 L52 43 Z" fill="#FFFFFF" stroke={colors.navy} strokeWidth={5} strokeLinejoin="round" />
      </svg>
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
  color: [colors.cyan, colors.white, colors.yellow][i % 3],
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
          <circle cx={23} cy={15} r={11} fill={v.color} stroke={colors.navy} strokeWidth={4} />
          <path d="M5 54 C5 36 13 29 23 29 C33 29 41 36 41 54 Z" fill={v.color} stroke={colors.navy} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      );
    })}
  </>
);
