import React from "react";
import { Img, random, staticFile } from "remotion";
import { Burst, Mark, Sticker } from "../brand/Bits";
import { FollowButton } from "../brand/Cta";
import { HeroTitle } from "../brand/Headline";
import { mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { C, mdh } from "../episodes/mdh";
import { Alex, AlexFace, AlexPose, Bulb, DollarCoin, eo, Eyebrow, go, GridCam, io, lerp, money, pop, PixelGrid, seg, vis, Window, zoomCam } from "./kit";

type S = { t: number };
const centre = (x: number, y: number, k = 1, extra = ""): React.CSSProperties => ({ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${k}) ${extra}` });

// =================================================================================================================
// 1. The impossible business (0 to 13 s): an empty website, no product, no service... and over $1 million in sales.

const ProductIcon: React.FC = () => (
  <svg width={150} height={150} viewBox="-75 -75 150 150">
    <path d="M-50 -20 L0 -45 L50 -20 L50 35 L0 60 L-50 35 Z" fill="#E9C58F" stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-50 -20 L0 5 L50 -20 M0 5 L0 60" fill="none" stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-25 -32 L25 -8" stroke={P.ink} strokeWidth={6} />
  </svg>
);
const ServiceIcon: React.FC = () => (
  <svg width={150} height={150} viewBox="-75 -75 150 150">
    <path d="M-48 10 A48 48 0 0 1 48 10" fill="none" stroke={P.ink} strokeWidth={9} />
    <rect x={-60} y={2} width={26} height={44} rx={10} fill={P.lime} stroke={P.ink} strokeWidth={6} />
    <rect x={34} y={2} width={26} height={44} rx={10} fill={P.lime} stroke={P.ink} strokeWidth={6} />
    <path d="M47 44 Q40 64 12 64" fill="none" stroke={P.ink} strokeWidth={6} />
    <circle cx={8} cy={64} r={8} fill={P.ink} />
  </svg>
);

/** An item that appears, gets crossed out and vanishes ("na koi product"). */
const Gone: React.FC<{ t: number; at: number; x: number; label: string; children: React.ReactNode }> = ({ t, at, x, label, children }) => {
  const p = pop(t, at, { damping: 10, stiffness: 190 });
  const strike = go(t, at + 0.55, at + 0.75);
  const out = go(t, at + 0.95, at + 1.25);
  if (p <= 0 || out >= 1) return null;
  return (
    <div style={{ ...centre(x, 250, p * (1 - out * 0.6)), opacity: 1 - out, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, filter: `blur(${out * 8}px)` }}>
      {children}
      <div style={{ position: "relative", ...type.label, fontSize: 30, color: P.ink }}>
        {label}
        <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 6, background: P.ink, transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: "0 50%" }} />
      </div>
      <div style={{ position: "absolute", top: 20, width: 190, height: 8, background: P.ink, borderRadius: 4, transform: `rotate(-38deg) scaleX(${strike})` }} />
    </div>
  );
};

export const Scene1: React.FC<S> = ({ t }) => {
  if (t > C.travelAt + 1) return null;
  const settle = eo(seg(t, 0, 3.2));
  const push = lerp(0.93, 1.05, go(t, 0, C.millionAt));
  const hit = pop(t, C.millionAt, { damping: 8, stiffness: 220 });
  const shake = t > C.millionAt && t < C.millionAt + 0.4 ? Math.sin(t * 95) * 12 * (1 - seg(t, C.millionAt, C.millionAt + 0.4)) : 0;
  const leave = go(t, C.travelAt, C.travelAt + 0.85);
  const scale = push * (1 + 0.04 * Math.sin(Math.min(1, hit) * Math.PI)) * lerp(1, 0.05, leave);
  const lime = seg(t, C.millionAt - 0.02, C.millionAt + 0.12);
  const count = 1000000 * eo(seg(t, C.millionAt, C.millionAt + 1.1));
  const tag = pop(t, C.bikriAt, { damping: 9, stiffness: 200 });
  const kaise = t >= C.kaiseAt - 0.2;
  return (
    <>
      {/* A soft spotlight and floating dust: the "minimal cinematic environment". */}
      <div style={{ position: "absolute", left: -200, top: 200, width: 1480, height: 1300, background: "radial-gradient(closest-side, rgba(200,241,105,0.32), rgba(200,241,105,0))", opacity: 1 - leave }} />
      {Array.from({ length: 18 }, (_, i) => {
        const x = random(`dx${i}`) * 1080;
        const y = (random(`dy${i}`) * 1500 + 300 - t * (14 + random(`ds${i}`) * 20)) % 1500;
        return <div key={i} style={{ position: "absolute", left: x, top: 280 + ((y + 1500) % 1500) * 0.6, width: 8, height: 8, borderRadius: 8, background: P.ink, opacity: 0.12 * (1 - leave) }} />;
      })}
      <div style={{ position: "absolute", left: 0, top: 336, width: 1080, display: "flex", justifyContent: "center", opacity: vis(t, 0, C.travelAt, 0.01, 0.3) }}>
        <Eyebrow text="Internet Stories" />
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 420,
          width: 840,
          height: 640,
          perspective: 1800,
          transform: `translate(${shake}px, ${-shake * 0.5}px) scale(${scale}) rotate(${leave * 160}deg)`,
          opacity: 1 - seg(t, C.travelAt + 0.6, C.travelAt + 0.85),
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `rotateY(${lerp(-16, 0, settle)}deg) rotateX(${lerp(9, 0, settle)}deg)` }}>
          <Window w={840} h={640} host={"www.________.com"}>
            <div style={{ position: "absolute", inset: 0, background: `color-mix(in srgb, ${P.lime} ${lime * 100}%, ${P.card})` }} />
            {/* The empty page: dashed placeholders and a blinking cursor. */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - lime }}>
              {[
                [40, 30, 760, 60],
                [40, 120, 470, 26],
                [40, 160, 360, 26],
                [40, 420, 230, 110],
                [295, 420, 230, 110],
                [550, 420, 230, 110],
              ].map(([x, y, w, h], i) => (
                <div key={i} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 14, border: `3px dashed ${P.line}` }} />
              ))}
              <div style={{ position: "absolute", left: 412, top: 230, width: 5, height: 70, background: P.ink, opacity: Math.floor(t * 2.2) % 2 ? 0 : 1 }} />
              <Gone t={t} at={C.productAt} x={290} label="PRODUCT">
                <ProductIcon />
              </Gone>
              <Gone t={t} at={C.serviceAt} x={550} label="SERVICE">
                <ServiceIcon />
              </Gone>
            </div>
            {/* Sales counter: $0, then over a million. */}
            {lime <= 0 ? (
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center" }}>
                <div style={{ ...type.label, fontSize: 30, color: P.ink3, background: P.paper2, border: `3px solid ${P.line}`, borderRadius: 999, padding: "10px 26px" }}>SALES: $0</div>
              </div>
            ) : (
              <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.6 + 0.4 * Math.min(1.1, hit)})` }}>
                <div style={{ ...type.label, fontSize: 30, color: P.olive }}>TOTAL SALES</div>
                <div style={{ ...type.display, fontSize: 132, color: P.ink, fontVariantNumeric: "tabular-nums" }}>
                  {money(count)}
                  {count >= 999999 ? "+" : ""}
                </div>
              </div>
            )}
          </Window>
        </div>
        {tag > 0 && (
          <div style={{ ...centre(420, 500, Math.min(1.1, tag)) }}>
            <Sticker size={58} tone="ink" rotate={-3}>
              Over $1 million in sales
            </Sticker>
          </div>
        )}
      </div>
      {/* Coins burst out of the page when the money lands. */}
      {t > C.millionAt &&
        t < C.millionAt + 2.2 &&
        Array.from({ length: 14 }, (_, i) => {
          const k = t - C.millionAt;
          const a = random(`ca${i}`) * Math.PI * 2;
          const v = 520 + random(`cv${i}`) * 520;
          const x = 540 + Math.cos(a) * v * k;
          const y = 720 + Math.sin(a) * v * k * 0.7 + 900 * k * k;
          return <DollarCoin key={i} size={70} spin={Math.cos(k * 12 + i)} style={{ position: "absolute", left: x - 35, top: y - 35, opacity: 1 - seg(k, 1.4, 2.2) }} />;
        })}
      <Burst t={t} at={C.millionAt} x={540} y={720} r={260} />
      {kaise && <Mark t={t} at={C.kaiseAt} x={620} y={1420} text="?" size={150} rot={10} />}
    </>
  );
};

// =================================================================================================================
// 2. Welcome to 2005 (12.6 to 24.5 s): back in time, into a student's room; the fees; the idea.

const Room: React.FC<{ t: number }> = ({ t }) => {
  const lamp = seg(t, C.lampAt, C.lampAt + 0.12);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0 }}>
      {/* Wall and skirting. */}
      <rect x={-400} y={-200} width={1880} height={2400} fill="#EFE6D3" />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={-400 + i * 80} y={-200} width={36} height={1440} fill="#E9DEC7" />
      ))}
      <rect x={-400} y={1000} width={1880} height={60} fill="#D9CBAE" />
      {/* Night window. */}
      <rect x={80} y={400} width={320} height={360} rx={10} fill="#2B3A55" stroke={P.ink} strokeWidth={8} />
      <circle cx={310} cy={480} r={34} fill="#F3E9C6" />
      {[
        [140, 450],
        [200, 560],
        [330, 620],
        [120, 680],
        [260, 700],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#F3E9C6" opacity={0.6 + 0.4 * Math.sin(t * 3 + i)} />
      ))}
      <line x1={240} y1={400} x2={240} y2={760} stroke={P.ink} strokeWidth={8} />
      <line x1={80} y1={580} x2={400} y2={580} stroke={P.ink} strokeWidth={8} />
      {/* Pennant and calendar. */}
      <path d="M440 380 L640 405 L440 440 Z" fill={P.gold} stroke={P.ink} strokeWidth={6} strokeLinejoin="round" />
      <text x={470} y={420} fontFamily={sans} fontWeight={700} fontSize={26} fill={P.ink}>
        UNI
      </text>
      <g transform="translate(700 370) rotate(3)">
        <rect width={230} height={200} rx={12} fill="#FFFFFF" stroke={P.ink} strokeWidth={6} />
        <rect width={230} height={58} rx={12} fill={P.ink} />
        <text x={115} y={42} textAnchor="middle" fontFamily={mono} fontWeight={600} fontSize={30} letterSpacing={3} fill={P.lime}>
          AUG 2005
        </text>
        {Array.from({ length: 15 }, (_, i) => (
          <rect key={i} x={22 + (i % 5) * 40} y={78 + Math.floor(i / 5) * 38} width={24} height={20} rx={4} fill={i === 11 ? P.lime : P.line} stroke={i === 11 ? P.ink : "none"} strokeWidth={3} />
        ))}
      </g>
      {/* Lamp light. */}
      <path d="M905 790 L700 1045 L1080 1045 L1000 790 Z" fill="#FFF3C4" opacity={0.55 * lamp} />
    </svg>
  );
};

const Desk: React.FC<{ t: number }> = ({ t }) => {
  const lamp = seg(t, C.lampAt, C.lampAt + 0.12);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* CRT monitor. */}
      <path d="M150 780 L410 780 L430 1010 L130 1010 Z" fill="#D9D1BC" stroke={P.ink} strokeWidth={7} strokeLinejoin="round" />
      <rect x={110} y={760} width={340} height={260} rx={22} fill="#E8E1CF" stroke={P.ink} strokeWidth={7} />
      <rect x={140} y={786} width={280} height={200} rx={14} fill={lamp > 0 ? "#CFE3F7" : "#7E8CA0"} stroke={P.ink} strokeWidth={6} />
      {lamp > 0 &&
        [0, 1, 2, 3].map((i) => <rect key={i} x={164} y={812 + i * 34} width={[200, 150, 180, 90][i]} height={14} rx={7} fill="#9BB8D6" opacity={0.6 + 0.4 * Math.sin(t * 2 + i)} />)}
      <rect x={250} y={1020} width={60} height={22} fill="#D9D1BC" stroke={P.ink} strokeWidth={6} />
      {/* Desk top and front. */}
      <rect x={-60} y={1036} width={1200} height={40} rx={8} fill="#CFA172" stroke={P.ink} strokeWidth={7} />
      <rect x={-60} y={1072} width={1200} height={900} fill="#B8875A" stroke={P.ink} strokeWidth={7} />
      {/* Drawers sit below the subtitles, so they never read as a second caption box. */}
      {[1330, 1470].map((y) => (
        <g key={y}>
          <rect x={640} y={y} width={340} height={120} rx={10} fill="#C4946A" stroke={P.ink} strokeWidth={6} />
          <rect x={770} y={y + 48} width={80} height={16} rx={8} fill={P.ink} />
        </g>
      ))}
      {[1120, 1210, 1290].map((y, i) => (
        <path key={y} d={`M${-40 + i * 70} ${y} q 120 -14 260 0 t 300 4`} fill="none" stroke="#A47449" strokeWidth={5} strokeLinecap="round" />
      ))}
      {/* Keyboard, notebook, mug and lamp. */}
      <path d="M300 1040 L560 1040 L548 1022 L312 1022 Z" fill="#E8E1CF" stroke={P.ink} strokeWidth={5} strokeLinejoin="round" />
      <g transform="translate(760 1000) rotate(-4)">
        <rect width={170} height={44} rx={6} fill="#FFFFFF" stroke={P.ink} strokeWidth={6} />
        <line x1={85} y1={0} x2={85} y2={44} stroke={P.ink} strokeWidth={4} />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={10 + i * 12} y1={8} x2={10 + i * 12} y2={38} stroke={P.lineStrong} strokeWidth={2} />
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <line key={i} x1={6} y1={12 + i * 10} x2={80} y2={12 + i * 10} stroke={P.lineStrong} strokeWidth={2} />
        ))}
      </g>
      <rect x={640} y={985} width={50} height={56} rx={8} fill={P.pink} stroke={P.ink} strokeWidth={6} />
      <path d="M690 998 q22 0 22 16 q0 14 -22 14" fill="none" stroke={P.ink} strokeWidth={6} />
      <path d="M1000 1036 L980 860 L905 790" fill="none" stroke={P.ink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M870 770 L950 760 L930 820 Z" fill={P.ink} />
      <circle cx={918} cy={812} r={10} fill={lamp > 0 ? "#FFE58A" : "#7E8CA0"} />
      <rect x={960} y={1026} width={80} height={14} rx={5} fill={P.ink} />
    </svg>
  );
};

const Bill: React.FC<{ t: number }> = ({ t }) => {
  const p = pop(t, C.feesAt, { damping: 13, stiffness: 120 });
  const out = go(t, C.ideaAt - 0.3, C.ideaAt + 0.15);
  if (p <= 0 || out >= 1) return null;
  const x = lerp(1300, 820, Math.min(1, p)) + out * 500;
  const stamp = pop(t, C.feesAt + 0.9, { damping: 9, stiffness: 240 });
  return (
    <div style={{ ...centre(x, 600, 1, `rotate(${lerp(30, 6, Math.min(1, p)) + out * 40}deg)`), width: 300, height: 360, background: "#FFFFFF", border: `5px solid ${P.ink}`, borderRadius: 12, boxShadow: shadow.hard(7), padding: 22, boxSizing: "border-box" }}>
      <div style={{ ...type.label, fontSize: 20, color: P.ink3 }}>UNIVERSITY</div>
      <div style={{ ...type.display, fontSize: 40, color: P.ink, marginTop: 4 }}>College fees</div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ height: 12, borderRadius: 6, background: P.line, marginTop: 18, width: [230, 190, 220, 150][i] }} />
      ))}
      <div style={{ ...centre(150, 290, Math.min(1.2, stamp) * (stamp > 0 ? 1 : 0), "rotate(-12deg)"), border: `6px solid ${P.pink}`, color: P.pink, borderRadius: 10, padding: "4px 16px", ...type.label, fontSize: 34 }}>
        DUE
      </div>
    </div>
  );
};

const alexState = (t: number): { pose: AlexPose; face: AlexFace } => {
  if (t >= C.ideaAt) return { pose: "up", face: "excited" };
  if (t >= 21.54) return { pose: "look", face: "worried" };
  if (t >= C.feesAt) return { pose: "head", face: "worried" };
  if (t >= 16.0) return { pose: "look", face: "calm" };
  return { pose: "type", face: "calm" };
};

export const Scene2: React.FC<S> = ({ t }) => {
  if (t < C.travelAt || t > C.siteAt + 0.4) return null;
  // Time travel: the year spins back from 2026 to 2005.
  const travel = vis(t, C.travelAt, C.roomAt + 0.5, 0.2, 0.5);
  const yk = eo(seg(t, C.travelAt + 0.15, C.yearLand));
  const year = Math.round(lerp(2026, 2005, yk));
  const land = pop(t, C.yearLand, { damping: 8, stiffness: 240 });
  const toWall = go(t, C.roomAt, C.roomAt + 0.6);
  // Room camera: starts on the calendar, pulls back, drifts, then dives into the notebook.
  const pull = go(t, C.roomAt, C.roomAt + 1.4);
  const dive = go(t, C.diveAt, C.siteAt);
  const sBase = lerp(1.45, 1.0, pull) * lerp(1, 1.06, go(t, 16.2, 21.5)) * lerp(1, 7, Math.pow(dive, 1.6));
  const fx = lerp(lerp(815, 560, pull), 845, dive);
  const fy = lerp(lerp(470, 880, pull), 1022, dive);
  const cam = (depth: number): React.CSSProperties => {
    const s = 1 + (sBase - 1) * depth;
    return { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${540 - fx * s}px, ${900 - fy * s}px) scale(${s})` };
  };
  const roomIn = seg(t, C.roomAt, C.roomAt + 0.35);
  const dim = 1 - seg(t, C.lampAt, C.lampAt + 0.15);
  const { pose, face } = alexState(t);
  const blink = [16.9, 19.6, 21.2, 24.0].some((b) => Math.abs(t - b) < 0.06);
  const name = pop(t, C.nameAt, { damping: 10, stiffness: 190 });
  const bulb = pop(t, C.ideaAt, { damping: 8, stiffness: 200 });
  const jump = t >= C.ideaAt ? -40 * Math.sin(Math.PI * seg(t, C.ideaAt, C.ideaAt + 0.35)) : 0;
  const alexIn = pop(t, 15.5, { damping: 13, stiffness: 140 });
  return (
    <>
      {roomIn > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: roomIn, overflow: "hidden" }}>
          <div style={cam(0.82)}>
            <Room t={t} />
          </div>
          <div style={cam(1)}>
            <div style={{ position: "absolute", left: 600 - 220, top: 880 - 300 + (1 - alexIn) * 260 + jump, width: 440, height: 580 }}>
              <Alex pose={pose} face={face} t={t} blink={blink} />
            </div>
            {bulb > 0 && (
              <div style={{ ...centre(600, 500, Math.min(1.15, bulb)) }}>
                <Bulb size={150} k={seg(t, C.ideaAt, C.ideaAt + 0.3)} t={t} />
              </div>
            )}
            <Desk t={t} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: 0.5 * dim }} />
          <Bill t={t} />
          {name > 0 && (
            <div style={{ position: "absolute", left: 90, top: 640, display: "flex", flexDirection: "column", alignItems: "flex-start", transform: `scale(${Math.min(1.1, name)}) rotate(-3deg)`, transformOrigin: "0 50%", opacity: 1 - seg(t, C.diveAt - 0.2, C.diveAt + 0.2) }}>
              <Sticker size={56} tone="ink" rotate={0}>
                Alex Tew
              </Sticker>
              <div style={{ marginTop: 10, ...type.label, fontSize: 22, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 10, padding: "6px 12px" }}>21 • STUDENT • ENGLAND</div>
              <div style={{ marginTop: 6, ...type.body, fontSize: 18, color: P.ink, background: P.card, borderRadius: 8, padding: "2px 10px" }}>Illustration</div>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: seg(t, C.siteAt - 0.25, C.siteAt) * (1 - seg(t, C.siteAt, C.siteAt + 0.35)) }} />
        </div>
      )}
      {travel > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: travel }}>
          <div style={{ position: "absolute", inset: 0, background: "#EADFC8", opacity: 0.9 * (1 - toWall) }} />
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - toWall }}>
            {Array.from({ length: 40 }, (_, i) => {
              const a = (i / 40) * Math.PI * 2 + random(`sa${i}`) * 0.1;
              const ph = (t * 1.6 + random(`sp${i}`)) % 1;
              const r1 = 1100 * (1 - ph);
              const r0 = r1 * 0.72;
              return <line key={i} x1={540 + Math.cos(a) * r0} y1={760 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={760 + Math.sin(a) * r1} stroke={P.ink} strokeWidth={6} strokeLinecap="round" opacity={0.25 * ph} />;
            })}
          </svg>
          <div style={{ ...centre(lerp(540, 815, toWall), lerp(760, 470, toWall), lerp(1, 0.25, toWall) * (1 + 0.1 * Math.sin(Math.min(1, land) * Math.PI))), display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - seg(t, C.roomAt + 0.4, C.roomAt + 0.6) }}>
            <div style={{ ...type.display, fontSize: 260, color: P.ink, fontVariantNumeric: "tabular-nums", filter: `blur(${yk < 1 ? 2.5 : 0}px)` }}>{year}</div>
            {land > 0 && <Eyebrow text="England, 2005" style={{ transform: `scale(${Math.min(1, land)})` }} />}
          </div>
        </div>
      )}
    </>
  );
};

// =================================================================================================================
// 3 to 6. The pixel idea, the ads, the total and the real website, all in one browser window (24.5 to 56 s).

const WIN = { x: 74, y: 340, w: 932, h: 812 };
const VIEW = { w: WIN.w - 8, h: WIN.h - 8 - 72 };
const FULL: GridCam = { cx: 500, cy: 500, span: VIEW.w / (VIEW.h / 1000) };

function gridCam(t: number): GridCam {
  const close: GridCam = { cx: 505, cy: 505, span: 14 };
  const pixel: GridCam = { cx: 505.5, cy: 505.5, span: 7 };
  const block: GridCam = { cx: 505, cy: 505, span: 34 };
  const near: GridCam = { cx: 503, cy: 503, span: 95 };
  if (t < C.zoomOutFrom) return close;
  if (t < C.pixelAt) return zoomCam(close, FULL, io(seg(t, C.zoomOutFrom, C.zoomOutTo)));
  if (t < C.buyAt) return zoomCam(FULL, pixel, io(seg(t, C.pixelAt, 30.9)));
  if (t < C.moreAt) return zoomCam(pixel, block, io(seg(t, C.buyAt, 33.9)));
  if (t < C.fillFrom) return zoomCam(block, near, io(seg(t, C.moreAt, 36.6)));
  return zoomCam(near, FULL, io(seg(t, C.fillFrom, 39.0)));
}

/** Camera on the real screenshot (CSS px of milliondollarhomepage.com): u, v is the point in the middle of the view. */
function realCam(t: number) {
  const a = { u: 640, v: 568, z: VIEW.h / 1000 };
  const b = { u: 640, v: 450, z: 0.81 };
  const c = { u: 880, v: 300, z: 1.3 };
  const k1 = io(seg(t, C.nameReveal, C.pullTo));
  const k2 = io(seg(t, C.inspectFrom, 55.4));
  return {
    u: lerp(lerp(a.u, b.u, k1), c.u, k2),
    v: lerp(lerp(a.v, b.v, k1), c.v, k2),
    z: lerp(a.z, b.z, k1) * Math.pow(c.z / b.z, k2),
  };
}

export const GridScene: React.FC<S> = ({ t }) => {
  if (t < C.siteAt - 0.05 || t > C.lessonAt + 0.2) return null;
  const enter = pop(t, C.siteAt, { damping: 13, stiffness: 160 });
  const leave = go(t, 55.55, C.lessonAt + 0.15);
  // A cinematic tilt while the ads pour in, flat again for the total.
  const tilt = go(t, C.fillFrom, 38.7) * (1 - go(t, C.aakhirAt, 42.4));
  const drift = Math.sin((t - C.fillFrom) * 0.9) * 30 * tilt;
  const cam = gridCam(t);
  const s = VIEW.w / cam.span;
  const toScreen = (gx: number, gy: number): [number, number] => [WIN.x + 4 + VIEW.w / 2 + (gx - cam.cx) * s, WIN.y + 4 + 72 + VIEW.h / 2 + (gy - cam.cy) * s];
  const lines = seg(t, C.gridAt, C.gridAt + 0.5);
  const pixGlow = pop(t, C.dollarAt - 0.2) * (1 - seg(t, C.blockLabel - 0.2, C.blockLabel));
  const blkGlow = pop(t, C.blockLabel) * (1 - seg(t, C.placeAt, C.placeAt + 0.15));
  const onePixel = pop(t, C.gridAt + 0.3) * (1 - seg(t, C.zoomOutFrom, C.zoomOutFrom + 0.6));
  const glow =
    t < C.pixelAt ? { x: 505, y: 505, w: 1, h: 1, k: onePixel } : pixGlow > 0 ? { x: 505, y: 505, w: 1, h: 1, k: pixGlow } : { x: 500, y: 500, w: 10, h: 10, k: blkGlow };
  const realK = seg(t, C.realAt, C.nameReveal - 0.05);
  const realTop = seg(t, C.nameReveal - 0.05, C.nameReveal + 0.1);
  const rc = realCam(t);
  const host = t < C.nameReveal ? "www.________.com" : "milliondollarhomepage.com";
  const typed = t < C.nameReveal ? 1 : seg(t, C.nameReveal, C.nameReveal + 0.6);
  const dimK = seg(t, 42.5, 42.9) * (1 - seg(t, 46.9, C.realAt));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: WIN.x,
          top: WIN.y,
          width: WIN.w,
          height: WIN.h,
          perspective: 2000,
          transform: `translate(${drift}px, ${-leave * 260}px) scale(${lerp(0.82, 1, Math.min(1, enter)) * lerp(1, 0.7, leave)})`,
          opacity: Math.min(1, enter * 2) * (1 - leave),
        }}
      >
        <div style={{ position: "absolute", inset: 0, transform: `rotateX(${20 * tilt}deg) rotateZ(${-5 * tilt}deg) scale(${1 - 0.06 * tilt})`, transformOrigin: "50% 40%" }}>
          <Window w={WIN.w} h={WIN.h} host={host} typed={typed}>
            {realTop < 1 && <PixelGrid w={VIEW.w} h={VIEW.h} cam={cam} t={t} lines={lines} glow={glow} ads first={pop(t, C.placeAt, { damping: 9, stiffness: 220 })} real={{ href: staticFile(mdh.capture.grid.file), k: realK }} />}
            {realTop > 0 && (
              <div style={{ position: "absolute", inset: 0, opacity: realTop, background: "#888" }}>
                <Img
                  src={staticFile(mdh.capture.top.file)}
                  style={{ position: "absolute", left: VIEW.w / 2 - rc.u * rc.z, top: VIEW.h / 2 - rc.v * rc.z, width: 1280 * rc.z, height: 900 * rc.z }}
                />
              </div>
            )}
            {dimK > 0 && <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: 0.62 * dimK }} />}
            {t > C.nameReveal && (
              <div style={{ position: "absolute", left: 16, bottom: 14, ...type.label, fontSize: 17, color: P.ink, background: "rgba(250,249,246,0.92)", borderRadius: 8, padding: "6px 10px", opacity: seg(t, C.nameReveal + 0.3, C.nameReveal + 0.6) }}>
                Real screenshot of milliondollarhomepage.com • 29 Oct 2026
              </div>
            )}
          </Window>
        </div>
      </div>
      <GridOverlays t={t} toScreen={toScreen} rc={rc} />
    </>
  );
};

const GridOverlays: React.FC<{ t: number; toScreen: (x: number, y: number) => [number, number]; rc: { u: number; v: number; z: number } }> = ({ t, toScreen, rc }) => {
  const cam = gridCam(t);
  const pixels = Math.round(Math.pow(Math.min(1000, cam.span), 2) / 1000) * 1000;
  const million = pop(t, 27.3, { damping: 10, stiffness: 190 });
  const millionOut = seg(t, C.pixelAt, C.pixelAt + 0.25);
  const dollar = pop(t, C.dollarAt, { damping: 8, stiffness: 230 });
  const dollarOut = seg(t, C.buyAt, C.buyAt + 0.25);
  const hundred = pop(t, C.blockLabel, { damping: 9, stiffness: 220 });
  const hundredOut = seg(t, 35.2, 35.45);
  const company = pop(t, C.buyAt, { damping: 11, stiffness: 170 });
  const companyOut = go(t, 35.5, 35.9);
  const pay = seg(t, C.payAt, C.placeAt);
  const [bx, by] = toScreen(505, 505);
  const total = pop(t, C.totalAt, { damping: 8, stiffness: 230 });
  const countK = Math.pow(seg(t, C.countFrom, C.totalAt), 2.2);
  const totalVis = vis(t, C.countFrom - 0.1, C.realAt - 0.05, 0.25, 0.35);
  const gross = pop(t, C.grossAt);
  const fin = pop(t, C.finalAt);
  const title = vis(t, C.nameReveal, C.realBadge, 0.01, 0.2);
  const real = pop(t, C.realBadge, { damping: 9, stiffness: 210 });
  const online = pop(t, C.onlineAt, { damping: 9, stiffness: 210 });
  const bottomTags = vis(t, C.realBadge, 55.6, 0.01, 0.25);
  // Callout rings on two real ads, in screen space from the real screenshot's camera.
  const ring = (u: number, v: number, at: number, r: number) => {
    const k = pop(t, at, { damping: 10, stiffness: 200 });
    if (k <= 0 || t > 55.7) return null;
    const x = WIN.x + 4 + VIEW.w / 2 + (u - rc.u) * rc.z;
    const y = WIN.y + 4 + 72 + VIEW.h / 2 + (v - rc.v) * rc.z;
    return <div key={at} style={{ ...centre(x, y, Math.min(1.1, k)), width: r * 2, height: r * 2, borderRadius: r, border: `7px solid ${P.lime}`, boxShadow: `0 0 0 4px ${P.ink}` }} />;
  };
  const one = pop(t, C.gridAt + 0.35, { damping: 10, stiffness: 200 }) * (1 - seg(t, C.zoomOutFrom, C.zoomOutFrom + 0.3));
  const [px, py] = toScreen(505.5, 505);
  return (
    <>
      {one > 0 && t < C.pixelAt && (
        <div style={{ ...centre(px, py - 70, Math.min(1.1, one)) }}>
          <Eyebrow text="1 pixel" size={26} />
        </div>
      )}
      {million > 0 && millionOut < 1 && (
        <div style={{ ...centre(540, 470, Math.min(1.1, million)), opacity: 1 - millionOut, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Sticker size={70} tone="lime" rotate={-3}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{pixels.toLocaleString("en-US")}</span> pixels
          </Sticker>
          {t > C.zoomOutTo - 0.2 && <Eyebrow text="1000 × 1000 grid" />}
        </div>
      )}
      {dollar > 0 && dollarOut < 1 && (
        <div style={{ ...centre(540, 1010, Math.min(1.12, dollar)), opacity: 1 - dollarOut }}>
          <Sticker size={84} tone="ink" rotate={-3}>
            1 pixel = $1
          </Sticker>
        </div>
      )}
      {hundred > 0 && hundredOut < 1 && (
        <div style={{ ...centre(560, 1030, Math.min(1.12, hundred)), opacity: 1 - hundredOut }}>
          <Sticker size={70} tone="lime" rotate={2}>
            100 pixels = $100
          </Sticker>
        </div>
      )}
      {company > 0 && companyOut < 1 && (
        <div style={{ position: "absolute", left: 96 - companyOut * 500, top: 450, transform: `scale(${Math.min(1.05, company)})`, transformOrigin: "0 0", background: P.card, border: `4px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(6), padding: "16px 22px", display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={64} height={64} viewBox="0 0 10 10">
            <rect width={10} height={10} rx={2} fill="#FFB000" stroke={P.ink} strokeWidth={0.6} />
            <path d="M2 2 L8 2 L5 8.2 Z" fill="#FFE7A3" stroke={P.ink} strokeWidth={0.5} strokeLinejoin="round" />
            <circle cx={4.4} cy={3.6} r={0.6} fill="#FF5A4E" />
            <circle cx={5.9} cy={4.4} r={0.55} fill="#FF5A4E" />
          </svg>
          <div>
            <div style={{ ...type.display, fontSize: 34, color: P.ink }}>Pixel Pizza Co.</div>
            <div style={{ ...type.label, fontSize: 16, color: P.ink3 }}>MADE-UP COMPANY</div>
          </div>
        </div>
      )}
      {pay > 0 && pay < 1 && (
        <div style={{ ...centre(lerp(250, bx, eo(pay)), lerp(560, by, eo(pay)) - 160 * Math.sin(Math.PI * pay), 1), display: "flex", alignItems: "center", gap: 10 }}>
          <DollarCoin size={84} spin={Math.cos(pay * 14)} />
          <div style={{ ...type.display, fontSize: 46, color: P.ink, background: P.lime, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "0 12px" }}>$100</div>
        </div>
      )}
      <Burst t={t} at={C.placeAt} x={bx} y={by} r={150} />
      {/* "SOLD" stamps while the grid fills. */}
      {[37.7, 38.2, 38.6, 39.0, 39.4, 39.8, 40.2].map((at, i) => {
        const k = pop(t, at, { damping: 9, stiffness: 240 });
        if (k <= 0 || t > at + 0.9) return null;
        const x = 200 + random(`sx${i}`) * 680;
        const y = 520 + random(`sy${i}`) * 520;
        return (
          <div key={i} style={{ ...centre(x, y, Math.min(1.1, k), `rotate(${-12 + random(`sr${i}`) * 24}deg)`), opacity: 1 - seg(t, at + 0.6, at + 0.9), border: `5px solid ${P.ink}`, background: P.lime, borderRadius: 10, padding: "2px 14px", ...type.label, fontSize: 30, color: P.ink }}>
            SOLD
          </div>
        );
      })}
      {totalVis > 0 && (
        <div style={{ ...centre(540, 760, 1), opacity: totalVis, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <div style={{ ...type.label, fontSize: 28, color: P.lime }}>AND THE TOTAL…</div>
          <div
            style={{
              ...type.display,
              fontSize: 128,
              color: P.ink,
              background: P.lime,
              border: `6px solid ${P.ink}`,
              borderRadius: 28,
              padding: "6px 34px 14px",
              boxShadow: shadow.hard(10),
              fontVariantNumeric: "tabular-nums",
              transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, total) * Math.PI)})`,
            }}
          >
            {money(1037100 * countK)}
          </div>
          {gross > 0 && <Eyebrow text="Total gross pixel sales" size={30} style={{ transform: `scale(${Math.min(1.08, gross)})` }} />}
          {fin > 0 && (
            <div style={{ transform: `scale(${Math.min(1.08, fin)}) rotate(-2deg)` }}>
              <Sticker size={44} tone="card" rotate={0}>
                Final sale: January 2006
              </Sticker>
            </div>
          )}
          {t > 46.0 && <div style={{ ...type.body, fontSize: 24, color: P.card, opacity: seg(t, 46.0, 46.3) }}>Gross sales, not profit</div>}
        </div>
      )}
      <Burst t={t} at={C.totalAt} x={540} y={760} r={300} color={P.lime} />
      {title > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 880, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: title }}>
          <div style={{ transform: `scale(${Math.min(1.1, pop(t, C.nameReveal, { damping: 9, stiffness: 210 }))})` }}>
            <Sticker size={64} tone="ink" rotate={-2}>
              The Million Dollar
            </Sticker>
          </div>
          <div style={{ transform: `scale(${Math.min(1.1, pop(t, 49.74, { damping: 9, stiffness: 210 }))})` }}>
            <Sticker size={84} tone="lime" rotate={2}>
              Homepage
            </Sticker>
          </div>
        </div>
      )}
      {bottomTags > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 900, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: bottomTags }}>
          {real > 0 && (
            <div style={{ transform: `scale(${Math.min(1.1, real)})` }}>
              <Sticker size={74} tone="lime" rotate={-3}>
                Real website
              </Sticker>
            </div>
          )}
          {online > 0 && <Eyebrow text="Still online • 2026" dot t={t} size={30} style={{ transform: `scale(${Math.min(1.1, online)})` }} />}
        </div>
      )}
      {ring(998, 106, 54.15, 95)}
      {ring(819, 243, 54.65, 105)}
      {t > 54.15 && t < 55.7 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 430, display: "flex", justifyContent: "center", opacity: seg(t, 54.15, 54.4) * (1 - seg(t, 55.45, 55.7)) }}>
          <Eyebrow text="Real ads • bought 2005–06" size={26} />
        </div>
      )}
    </>
  );
};

// =================================================================================================================
// 7. The lesson and the outro (56 to 73 s): idea + attention; Internet Stories; follow.

const MiniSite: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const parts: [number, React.CSSProperties][] = [
    [0.0, { left: 26, top: 22, width: 640, height: 52, background: P.lime, borderRadius: 12 }],
    [0.3, { left: 26, top: 100, width: 420, height: 34, background: P.ink, borderRadius: 8 }],
    [0.45, { left: 26, top: 148, width: 300, height: 22, background: P.lineStrong, borderRadius: 8 }],
    [0.7, { left: 26, top: 200, width: 196, height: 150, background: P.limeSoft, borderRadius: 14, border: `3px solid ${P.ink}` }],
    [0.85, { left: 248, top: 200, width: 196, height: 150, background: P.limeSoft, borderRadius: 14, border: `3px solid ${P.ink}` }],
    [1.0, { left: 470, top: 200, width: 196, height: 150, background: P.limeSoft, borderRadius: 14, border: `3px solid ${P.ink}` }],
    [1.25, { left: 26, top: 374, width: 210, height: 50, background: P.ink, borderRadius: 25 }],
  ];
  return (
    <>
      {parts.map(([d, st], i) => {
        const k = pop(t, at + d, { damping: 10, stiffness: 220 });
        return k > 0 ? <div key={i} style={{ position: "absolute", ...st, boxSizing: "border-box", transform: `scale(${Math.min(1.08, k)})` }} /> : null;
      })}
    </>
  );
};

const Person: React.FC<{ c: string }> = ({ c }) => (
  <svg width={44} height={56} viewBox="0 0 44 56">
    <circle cx={22} cy={14} r={11} fill={c} stroke={P.ink} strokeWidth={4} />
    <path d="M4 54 C4 34 40 34 40 54 Z" fill={c} stroke={P.ink} strokeWidth={4} />
  </svg>
);

const Tile: React.FC<{ t: number; at: number; x: number; label: string; children: React.ReactNode; out: number }> = ({ t, at, x, label, children, out }) => {
  const k = pop(t, at, { damping: 9, stiffness: 200 });
  if (k <= 0) return null;
  return (
    <div style={{ ...centre(x, 600 - out * 500, Math.min(1.08, k)), opacity: 1 - out, width: 250, height: 270, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {children}
      <div style={{ ...type.display, fontSize: 40, color: P.ink }}>{label}</div>
    </div>
  );
};

export const Scene7: React.FC<S> = ({ t }) => {
  if (t < C.lessonAt - 0.2) return null;
  const bulb = pop(t, C.bulbAt, { damping: 8, stiffness: 200 });
  const bulbOut = go(t, C.buildAt - 0.1, C.buildAt + 0.2);
  const site = pop(t, C.buildAt, { damping: 12, stiffness: 160 });
  const toTile = go(t, C.gameAt, C.gameAt + 0.5);
  const tilesOut = go(t, C.outroAt, C.outroAt + 0.4);
  const stamp = pop(t, C.then2005, { damping: 8, stiffness: 240 });
  const sirf = pop(t, C.sirfAt, { damping: 10, stiffness: 220 });
  const result = pop(t, C.resultAt, { damping: 8, stiffness: 220 });
  // The website card shrinks into the first tile.
  const sx = lerp(540, 150, toTile);
  const sy = lerp(640, 600, toTile);
  const ss = lerp(1, 0.3, toTile);
  return (
    <>
      {bulb > 0 && bulbOut < 1 && (
        <div style={{ ...centre(800, 470, Math.min(1.15, bulb) * (1 - bulbOut)), display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Bulb size={170} k={seg(t, C.bulbAt, C.bulbAt + 0.3)} t={t} />
          <Sticker size={44} tone="lime" rotate={4}>
            Idea
          </Sticker>
        </div>
      )}
      {site > 0 && toTile < 1 && (
        <div style={{ ...centre(sx, sy, Math.min(1.04, site) * ss), width: 740, height: 520, opacity: 1 - seg(toTile, 0.8, 1) }}>
          <Window w={740} h={520} host="your-idea.example">
            <MiniSite t={t} at={C.buildAt + 0.1} />
          </Window>
          {stamp > 0 && (
            <div style={{ ...centre(640, 120, Math.min(1.2, stamp), "rotate(-14deg)"), width: 170, height: 170, borderRadius: 170, border: `8px solid ${P.ink}`, background: P.card, display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 56, color: P.ink }}>
              2005
            </div>
          )}
        </div>
      )}
      {/* "Laakhon dollar": coins pour into the page. */}
      {t > C.coinsAt &&
        t < C.gameAt + 0.4 &&
        Array.from({ length: 16 }, (_, i) => {
          const at = C.coinsAt + i * 0.11;
          const k = seg(t, at, at + 0.7);
          if (k <= 0 || k >= 1) return null;
          const x = 260 + random(`fx${i}`) * 560;
          return <DollarCoin key={i} size={74} spin={Math.cos(t * 9 + i)} style={{ position: "absolute", left: x, top: 280 + 560 * k * k - 37, opacity: 1 - seg(k, 0.8, 1) }} />;
        })}
      {/* Website + idea + attention = opportunity. */}
      <Tile t={t} at={C.gameAt + 0.35} x={210} label="Website" out={tilesOut}>
        <svg width={120} height={96} viewBox="0 0 120 96">
          <rect x={4} y={4} width={112} height={88} rx={12} fill={P.paper} stroke={P.ink} strokeWidth={6} />
          <rect x={4} y={4} width={112} height={22} rx={10} fill={P.lime} stroke={P.ink} strokeWidth={6} />
          <rect x={18} y={40} width={60} height={12} rx={6} fill={P.ink} />
          <rect x={18} y={62} width={84} height={14} rx={6} fill={P.lineStrong} />
        </svg>
      </Tile>
      {sirf > 0 && tilesOut < 1 && (
        <div style={{ ...centre(210, 780, Math.min(1.1, sirf)), opacity: 1 - tilesOut }}>
          <Eyebrow text="Sirf ye nahi" size={22} />
        </div>
      )}
      {t > C.ideaTile && tilesOut < 1 && <div style={{ ...centre(375, 600), ...type.display, fontSize: 80, color: P.ink, opacity: (1 - tilesOut) * seg(t, C.ideaTile, C.ideaTile + 0.15) }}>+</div>}
      <Tile t={t} at={C.ideaTile} x={540} label="Idea" out={tilesOut}>
        <Bulb size={92} k={1} t={t} />
      </Tile>
      {t > C.attention && tilesOut < 1 && <div style={{ ...centre(705, 600), ...type.display, fontSize: 80, color: P.ink, opacity: (1 - tilesOut) * seg(t, C.attention, C.attention + 0.15) }}>+</div>}
      <Tile t={t} at={C.attention} x={870} label="Attention" out={tilesOut}>
        <svg width={130} height={84} viewBox="0 0 130 84">
          <path d="M6 42 Q65 -16 124 42 Q65 100 6 42 Z" fill={P.card} stroke={P.ink} strokeWidth={6} />
          <circle cx={65 + 8 * Math.sin(t * 2)} cy={42} r={20} fill={P.ink} />
          <circle cx={71 + 8 * Math.sin(t * 2)} cy={36} r={6} fill={P.card} />
        </svg>
      </Tile>
      {/* Visitors arriving at the website. */}
      {t > C.attention + 0.2 &&
        tilesOut < 1 &&
        Array.from({ length: 12 }, (_, i) => {
          const k = ((t - C.attention - 0.2) * 0.55 + i / 12) % 1;
          const x = lerp(1000, 230, k);
          const y = 860 - 70 * Math.sin(Math.PI * k);
          return (
            <div key={i} style={{ ...centre(x, y, 1), opacity: (1 - tilesOut) * Math.min(1, k * 6) * Math.min(1, (1 - k) * 6) }}>
              <Person c={[P.lime, P.gold, P.pink, "#9FD3F0"][i % 4]} />
            </div>
          );
        })}
      {result > 0 && tilesOut < 1 && (
        <div style={{ ...centre(540, 990, Math.min(1.1, result)), opacity: 1 - tilesOut }}>
          <Sticker size={70} tone="ink" rotate={-2}>
            = Opportunity
          </Sticker>
        </div>
      )}
      <Burst t={t} at={C.resultAt} x={540} y={990} r={220} color={P.lime} />
      {/* Outro. */}
      {t > C.outroAt && <HeroTitle t={t} at={C.outroAt + 0.1} top={430} lines={[{ text: "Internet", size: 130 }, { text: "Stories", size: 130, tone: "lime" }]} />}
      {t > C.outroAt + 0.5 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 760, display: "flex", justifyContent: "center", opacity: seg(t, C.outroAt + 0.5, C.outroAt + 0.8) * (1 - seg(t, C.followAt - 0.25, C.followAt)) }}>
          <Eyebrow text="Ansuni kahaniyan" size={28} />
        </div>
      )}
      <FollowButton t={t} at={C.followAt} tapAt={C.tapAt} top={760} />
      {t > C.followAt && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 905, display: "flex", justifyContent: "center", opacity: seg(t, C.followAt, C.followAt + 0.2) }}>
          <Eyebrow text="Follow Internet Toolbox" size={28} />
        </div>
      )}
    </>
  );
};

