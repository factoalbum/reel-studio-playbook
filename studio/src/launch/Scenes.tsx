import React from "react";
import { Img, staticFile } from "remotion";
import { Burst, Sticker } from "../brand/Bits";
import { BrandMark } from "../brand/Chrome";
import { FollowButton, TapPointer } from "../brand/Cta";
import { Headline } from "../brand/Headline";
import { palette as P, shadow, type } from "../brand/tokens";
import { Heart, Sparks } from "../bonus/kit";
import { centre, DemoTag, Laptop, PhoneShell, StatusRow } from "../immich/kit";
import { eo, io, lerp, pop, seg } from "../mdh/kit";
import { C, KIT_FILES } from "../episodes/launch";
import { BookCover } from "../thirty/Scenes";
import { Chip, FileIcon, FmtBadge, type Key, mix, OutlinePage, ProductBox, RealPage, sc, shakeAt, track, WireframePage, XlsxPage } from "./kit";

/**
 * Ebook launch reel scenes. Times come from src/episodes/launch.ts (the recording's word starts).
 * Dark world for the hook and the problem, an iris to the cream brand world at the reveal.
 */

type S = { t: number };
const WHITE = "#FAF9F6";
/** 0 before `at`, 1 once the scene has left (0.25 s exit). */
const leave = (t: number, at: number) => eo(seg(t, at - 0.12, at + 0.13));

// =================================================================================================================
// Camera, wipes, dark room

export const CAM_ORIGIN = "540px 820px";
export const cam = (t: number) => {
  const push = (at: number, amt: number, hold = 0.5) => amt * eo(seg(t, at, at + 0.18)) * (1 - eo(seg(t, at + hold, at + hold + 0.4)));
  const drift = 0.05 * eo(seg(t, 0, 1.8)) * (1 - eo(seg(t, C.par - 0.1, C.par + 0.3)));
  return 1 + drift + push(C.par, 0.06, 0.2) + push(C.bechoge, 0.05, 0.25) + push(C.kaise, 0.07, 0.35) + push(C.kit, 0.04) + push(C.price, 0.07, 0.6) + push(C.link, 0.035);
};

/** Ink and lime bars that sweep across between the big sections. */
export const Wipes: React.FC<S> = ({ t }) => (
  <>
    {[C.files, C.value, C.journey, C.cta].map((at, i) => {
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

/** The lights go off at 0.3 s; at the reveal a cream iris opens from the centre. */
export const DarkRoom: React.FC<S> = ({ t }) => {
  const on = eo(seg(t, 0.28, 0.42));
  if (on <= 0 || t > C.reveal + 0.5) return null;
  const r = 1500 * io(seg(t, C.reveal - 0.02, C.reveal + 0.42));
  const mask = r > 0 ? `radial-gradient(circle at 540px 820px, transparent ${r}px, black ${r + 2}px)` : undefined;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: on, background: "radial-gradient(circle at 540px 760px, #272b1e 0%, #151515 52%, #0c0c0c 100%)", maskImage: mask, WebkitMaskImage: mask }}>
        <div style={{ position: "absolute", left: 120, top: 340, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,241,105,0.16) 0%, rgba(200,241,105,0) 65%)" }} />
        {Array.from({ length: 22 }, (_, i) => {
          const x = ((i * 137) % 980) + 50;
          const y = (i * 271 + t * 26 * (1 + (i % 3))) % 1500;
          return <div key={i} style={{ position: "absolute", left: x, top: 1800 - y, width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2, borderRadius: 8, background: P.lime, opacity: 0.16 }} />;
        })}
      </div>
      {r > 0 && r < 1490 && <div style={{ position: "absolute", left: 540 - r, top: 820 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `18px solid ${P.lime}`, boxSizing: "border-box" }} />}
    </>
  );
};

/** The brand bug in white for the dark opener. */
export const DarkBug: React.FC<S> = ({ t }) => (
  <div style={{ position: "absolute", left: 80, top: 258, display: "flex", alignItems: "center", gap: 14 }}>
    <BrandMark size={54} />
    <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 32, color: t < 0.35 ? P.ink : WHITE }}>Internet Toolbox</div>
  </div>
);

// =================================================================================================================
// Shared props for the opener

/** The viewer's own ebook (generic, teal), so it never gets confused with the kit. */
const MyBook: React.FC<{ w: number }> = ({ w }) => {
  const u = w / 200;
  return (
    <div style={{ position: "relative", width: w, height: w * 1.36, borderRadius: 8 * u, background: P.teal, border: `${4 * u}px solid ${P.ink}`, boxShadow: `${7 * u}px ${8 * u}px 0 ${P.ink}`, overflow: "hidden", boxSizing: "border-box" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 13 * u, background: "rgba(0,0,0,0.3)" }} />
      <div style={{ position: "absolute", left: 28 * u, top: 34 * u, ...type.label, fontSize: 10 * u, color: P.limeSoft, letterSpacing: "0.1em" }}>Ebook</div>
      <div style={{ position: "absolute", left: 26 * u, top: 56 * u, ...type.display, fontSize: 34 * u, lineHeight: 1, color: WHITE }}>
        My first
        <br />
        ebook
      </div>
      <div style={{ position: "absolute", left: 28 * u, top: 150 * u, width: 60 * u, height: 8 * u, borderRadius: 6 * u, background: P.gold }} />
      <div style={{ position: "absolute", left: 28 * u, bottom: 22 * u, ...type.body, fontSize: 13 * u, color: P.limeSoft }}>by you</div>
    </div>
  );
};

const Bars: React.FC<{ widths: number[]; k: number; h?: number; gap?: number; color?: string }> = ({ widths, k, h = 9, gap = 8, color = P.lineStrong }) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>
    {widths.map((w, n) => (
      <div key={n} style={{ height: h, width: `${w * 100 * Math.max(0, Math.min(1, k * widths.length - n))}%`, background: color, borderRadius: h / 2 }} />
    ))}
  </div>
);

const ReadyScreen: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", background: P.paper }}>
    <MyBook w={100} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ ...type.label, fontSize: 12, letterSpacing: "0.04em", color: P.ink3 }}>my-first-ebook.pdf</div>
      <div style={{ alignSelf: "flex-start", ...type.display, fontSize: 22, color: P.ink, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 99, padding: "2px 12px", whiteSpace: "nowrap" }}>Ebook ready ✓</div>
      <Bars widths={[1, 0.8, 0.9]} k={1} />
    </div>
  </div>
);

const ChatScreen: React.FC<S> = ({ t }) => {
  const ask = pop(t, C.chatgpt + 0.1, { damping: 12, stiffness: 220 });
  const write = seg(t, C.chatgpt + 0.55, C.likh + 0.45);
  const done = pop(t, C.likh + 0.35, { damping: 11, stiffness: 220 });
  return (
    <div style={{ position: "absolute", inset: 0, background: P.card, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 34, flex: "0 0 34px", display: "flex", alignItems: "center", padding: "0 14px", borderBottom: `2px solid ${P.line}`, ...type.display, fontSize: 18, color: P.ink }}>ChatGPT</div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ alignSelf: "flex-end", transform: `scale(${mix(ask)})`, transformOrigin: "100% 50%", ...type.body, fontWeight: 700, fontSize: 16, color: P.ink, background: P.paper2, border: `2px solid ${P.lineStrong}`, borderRadius: "14px 14px 4px 14px", padding: "4px 12px", whiteSpace: "nowrap" }}>Write my ebook</div>
        <div style={{ display: "flex", gap: 9 }}>
          <div style={{ flex: "0 0 18px", height: 18, borderRadius: 9, background: P.ink3 }} />
          <div style={{ flex: 1 }}>
            <Bars widths={[1, 0.94, 0.98, 0.72, 1, 0.88, 0.6]} k={write} h={8} gap={7} />
          </div>
        </div>
        {done > 0 && <div style={{ alignSelf: "flex-start", marginLeft: 27, transform: `scale(${sc(done)})`, transformOrigin: "0 50%", ...type.display, fontSize: 16, color: P.ink, background: P.lime, border: `2px solid ${P.ink}`, borderRadius: 99, padding: "1px 10px" }}>Draft ready ✓</div>}
      </div>
    </div>
  );
};

/** One laptop carries the opener: on the desk, floating, then the ChatGPT draft. */
const LAPTOP: Key[] = [
  [-1, 770, 1102, 1, 1],
  [0.35, 540, 840, 1.22, 1],
  [C.par - 0.05, 540, 1010, 0.8, 0.55],
  [C.socho - 0.1, 540, 700, 1.3, 1],
  [C.lekin, 540, 985, 0.85, 0.85],
  [C.reveal - 0.32, 540, 820, 0.2, 0],
];
const EBOOK: Key[] = [
  [-1, 640, 900, 0.3, 0],
  [0.6, 820, 700, 1, 1],
  [C.par - 0.05, 800, 960, 0.8, 1],
  [C.socho - 0.3, 1250, 300, 0.6, 0],
];

// =================================================================================================================
// 1. Hook: EBOOK BANA TOH LOGE… / PAR BECHOGE KAISE?!

const Slam: React.FC<{ t: number; at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, at, children, style }) => {
  const k = pop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <span style={{ display: "inline-block", opacity: Math.min(1, k * 3), transform: `scale(${lerp(2.1, 1, Math.min(1, k)) * (k > 1 ? 1 + (k - 1) * 0.25 : 1)})`, filter: `blur(${Math.max(0, 1 - k) * 8}px)`, ...style }}>
      {children}
    </span>
  );
};

export const HookScene: React.FC<S> = ({ t }) => {
  if (t > C.socho + 0.3) return null;
  const sh = shakeAt(t, C.bechoge, 14, 0.3) + shakeAt(t, C.kaise, 20, 0.35);
  const out1 = eo(seg(t, C.par - 0.08, C.par + 0.12));
  const out2 = eo(seg(t, C.socho - 0.25, C.socho));
  const ready = 1 - eo(seg(t, 0.3, 0.45));
  const bk = track(t, EBOOK, 0.5);
  const big = { ...type.display, color: WHITE, whiteSpace: "nowrap" as const };
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${sh}px)` }}>
      {ready > 0 && (
        <div style={{ ...centre(770, 900, 1, "rotate(4deg)"), opacity: ready }}>
          <Sticker size={34} tone="lime" rotate={0}>
            EBOOK READY ✓
          </Sticker>
        </div>
      )}
      {bk.o > 0 && (
        <div style={{ ...centre(bk.x, bk.y, bk.s, `rotate(${8 + Math.sin(t * 2.4) * 4}deg) translateY(${Math.sin(t * 3) * 8}px)`), opacity: bk.o, filter: "drop-shadow(0 0 40px rgba(200,241,105,0.35))" }}>
          <MyBook w={180} />
        </div>
      )}
      {out1 < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out1, transform: `translateY(${-out1 * 120}px)` }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 340, display: "flex", justifyContent: "center", gap: 34, ...big, fontSize: 132 }}>
            <Slam t={t} at={C.ebook}>EBOOK</Slam>
            <Slam t={t} at={C.bana}>BANA</Slam>
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 488, display: "flex", justifyContent: "center", gap: 30, ...big, fontSize: 112 }}>
            <Slam t={t} at={C.toh}>TOH</Slam>
            <Slam t={t} at={C.loge} style={{ color: P.lime }}>
              LOGE…
            </Slam>
          </div>
        </div>
      )}
      {t > C.par - 0.05 && out2 < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out2, transform: `scale(${1 + out2 * 0.2})`, transformOrigin: "540px 600px" }}>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", justifyContent: "center", ...big, fontSize: 104 }}>
            <Slam t={t} at={C.par}>PAR</Slam>
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 470, display: "flex", justifyContent: "center" }}>
            <Slam t={t} at={C.bechoge}>
              <Sticker size={150} tone="lime" rotate={-3}>
                BECHOGE
              </Sticker>
            </Slam>
          </div>
          <div style={{ position: "absolute", left: 0, width: 1080, top: 680, display: "flex", justifyContent: "center", ...big, fontSize: 176, textShadow: `8px 8px 0 ${P.olive}` }}>
            <Slam t={t} at={C.kaise}>
              <span style={{ display: "inline-block", transform: "rotate(2deg)" }}>KAISE?!</span>
            </Slam>
          </div>
          <Burst t={t} at={C.bechoge} x={540} y={560} r={420} color={P.lime} />
          <Burst t={t} at={C.kaise} x={540} y={780} r={480} color={P.lime} />
          {[
            [690, 880, -14],
            [915, 905, 12],
            [890, 1080, -6],
          ].map(([x, y, r], i) => {
            const k = pop(t, C.kaise + 0.08 + i * 0.1, { damping: 8, stiffness: 240 });
            return k <= 0 ? null : (
              <div key={i} style={{ ...centre(x, y, sc(k), `rotate(${r + Math.sin(t * 5 + i) * 6}deg)`), ...type.display, fontSize: 84, color: P.lime, textShadow: `5px 5px 0 ${P.ink}` }}>
                ?
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** The desk in front of the seated presenter; it drops away when the lights go off. */
export const HookFront: React.FC<S> = ({ t }) => {
  const k = eo(seg(t, 0.3, 0.62));
  if (k >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - k, transform: `translateY(${k * 260}px)` }}>
      <div style={{ position: "absolute", left: 30, width: 1020, top: 1236, height: 36, background: "#8C6A4F", border: `5px solid ${P.ink}`, borderRadius: 12 }} />
      <div style={{ position: "absolute", left: 76, width: 928, top: 1268, height: 700, background: "#A9825F", border: `5px solid ${P.ink}`, borderTop: "none" }} />
      {/* a mug */}
      <div style={{ position: "absolute", left: 130, top: 1150, width: 74, height: 90, background: P.card, border: `5px solid ${P.ink}`, borderRadius: "8px 8px 16px 16px" }}>
        <div style={{ position: "absolute", left: 8, right: 8, top: 22, height: 14, borderRadius: 6, background: P.lime }} />
        <div style={{ position: "absolute", right: -30, top: 18, width: 30, height: 40, border: `5px solid ${P.ink}`, borderLeft: "none", borderRadius: "0 20px 20px 0" }} />
      </div>
    </div>
  );
};

// =================================================================================================================
// The laptop (hook and problem)

export const OpenerLaptop: React.FC<S> = ({ t }) => {
  if (t > C.reveal + 0.1) return null;
  const l = track(t, LAPTOP, 0.5);
  if (l.o <= 0) return null;
  const chat = t >= C.socho - 0.05;
  return (
    <div style={{ ...centre(l.x, l.y, l.s), opacity: l.o, filter: t > 0.35 ? "drop-shadow(0 0 50px rgba(200,241,105,0.28))" : undefined }}>
      <Laptop w={420}>{chat ? <ChatScreen t={t} /> : <ReadyScreen />}</Laptop>
    </div>
  );
};

// =================================================================================================================
// 2. Problem: the draft, the cover, then WHO WILL BUY? / WHERE WILL YOU SELL? / HOW WILL YOU START?

const QCard: React.FC<{ text: string; k: number; rot: number }> = ({ text, k, rot }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      background: P.card,
      border: `6px solid ${P.ink}`,
      borderRadius: 26,
      padding: "12px 30px 12px 14px",
      boxShadow: `9px 9px 0 ${P.lime}`,
      ...type.display,
      fontSize: 54,
      color: P.ink,
      whiteSpace: "nowrap",
      transform: `scale(${sc(k)}) rotate(${rot + (1 - mix(k)) * -10}deg)`,
    }}
  >
    <div style={{ flex: "0 0 70px", height: 70, borderRadius: 35, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, boxSizing: "border-box" }}>?</div>
    {text}
  </div>
);

const SHEETS = [0, 1, 2];
const COVER: Key[] = [
  [-1, 1350, 560, 1, 1],
  [C.cover - 0.05, 850, 590, 1, 1],
  [C.lekin, 775, 955, 0.7, 0.85],
  [C.reveal - 0.32, 540, 820, 0.2, 0],
];

export const ProblemScene: React.FC<S> = ({ t }) => {
  if (t < C.socho - 0.2 || t > C.reveal + 0.1) return null;
  const cv = track(t, COVER, 0.42);
  const yay = pop(t, C.banaLiya, { damping: 9, stiffness: 230 });
  const socho = pop(t, C.socho, { damping: 10, stiffness: 210 });
  const sochoOut = eo(seg(t, C.likh - 0.15, C.likh + 0.05));
  const written = pop(t, C.likh, { damping: 9, stiffness: 230 });
  const yayOut = eo(seg(t, C.lekin - 0.1, C.lekin + 0.15));
  const sheetsOut = eo(seg(t, C.lekin - 0.1, C.lekin + 0.25));
  const qOut = eo(seg(t, C.reveal - 0.3, C.reveal - 0.02));
  const qs: [string, number, number, number, number][] = [
    ["WHO WILL BUY?", C.kaun, 470, 420, -4],
    ["WHERE WILL YOU SELL?", C.kahaan, 560, 588, 3],
    ["HOW WILL YOU START?", C.howStart, 500, 756, -2],
  ];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* draft pages slide out of the laptop into a stack */}
      {sheetsOut < 1 &&
        SHEETS.map((i) => {
          const k = eo(seg(t, C.likh + 0.2 + i * 0.15, C.likh + 0.5 + i * 0.15));
          if (k <= 0) return null;
          return (
            <div key={i} style={{ ...centre(lerp(560, 860 - i * 8, k), lerp(700, 790 - i * 10, k), lerp(0.3, 1, k), `rotate(${lerp(0, 6 - i * 5, k)}deg)`), opacity: 1 - sheetsOut, width: 120, height: 160, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 8, boxShadow: shadow.hard(5), padding: 14, boxSizing: "border-box" }}>
              <Bars widths={[0.7, 1, 0.9, 1, 0.6]} k={1} h={7} gap={9} />
            </div>
          );
        })}
      {cv.o > 0 && t > C.cover - 0.1 && (
        <div style={{ ...centre(cv.x, cv.y, cv.s, `rotate(${8 + Math.sin(t * 2.2) * 3}deg)`), opacity: cv.o }}>
          <MyBook w={190} />
        </div>
      )}
      {socho > 0 && sochoOut < 1 && (
        <div style={{ ...centre(540, 420, sc(socho) * (1 - sochoOut)), ...type.display, fontSize: 120, color: WHITE, whiteSpace: "nowrap" }}>SOCHO…</div>
      )}
      {written > 0 && yayOut < 1 && (
        <div style={{ ...centre(430, 400, sc(written) * (1 - yayOut), "rotate(-3deg)") }}>
          <Sticker size={54} tone="card" rotate={0}>
            EBOOK WRITTEN ✓
          </Sticker>
        </div>
      )}
      {yay > 0 && yayOut < 1 && (
        <div style={{ ...centre(470, 492, sc(yay) * (1 - yayOut), "rotate(2deg)") }}>
          <Sticker size={54} tone="lime" rotate={0}>
            COVER READY ✓
          </Sticker>
        </div>
      )}
      <Sparks t={t} at={C.banaLiya} x={850} y={590} n={14} r={300} />
      <Burst t={t} at={C.banaLiya} x={470} y={492} r={360} color={P.lime} />
      {qOut < 1 &&
        qs.map(([text, at, x, y, rot]) => {
          const k = pop(t, at, { damping: 10, stiffness: 210 });
          if (k <= 0) return null;
          return (
            <div key={text} style={{ ...centre(lerp(x, 540, qOut), lerp(y, 820, qOut), 1 - qOut * 0.8), opacity: 1 - qOut }}>
              <QCard text={text} k={k} rot={rot} />
            </div>
          );
        })}
    </div>
  );
};

// =================================================================================================================
// 3. Reveal: the kit box rises, the 8 files fan out behind it

/** Fan slots behind the box: [x, y, rotation]. Outer cards sit lower and lean more. */
const FAN: [number, number, number][] = [
  [205, 850, -22],
  [275, 812, -15],
  [345, 786, -9],
  [415, 772, -4],
  [665, 772, 4],
  [735, 786, 9],
  [805, 812, 15],
  [875, 850, 22],
];
const FAN_ORDER = [0, 7, 1, 6, 2, 5, 3, 4];

export const KitCard: React.FC<{ i: number; w: number }> = ({ i, w }) => {
  const f = KIT_FILES[i];
  return (
    <div style={{ position: "relative" }}>
      {f.img ? <RealPage src={f.img} w={w} /> : f.draw === "xlsx" ? <XlsxPage w={w} /> : <OutlinePage w={w} />}
      <FmtBadge fmt={f.fmt} size={w * 0.1} style={{ position: "absolute", left: w * 0.06, bottom: w * 0.06 }} />
    </div>
  );
};

/** Box plus fanned files. `rise` 0 to 1 lifts the box in; `fan` 0 to 1 spreads the files. */
export const KitFan: React.FC<{ t: number; x: number; y: number; s: number; rise: number; fan: number[]; glow?: number }> = ({ t, x, y, s, rise, fan, glow = 1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${(x - 540) * 1}px, ${y - 800}px) scale(${s})`, transformOrigin: "540px 800px" }}>
    {FAN_ORDER.map((i) => {
      const k = fan[i] ?? 0;
      if (k <= 0) return null;
      const [fx, fy, fr] = FAN[i];
      const m = eo(mix(k));
      return (
        <div key={i} style={{ ...centre(lerp(540, fx, m), lerp(800, fy, m), lerp(0.4, 1, mix(k)) * (k > 1 ? 1 + (k - 1) * 0.2 : 1), `rotate(${fr * m}deg)`) }}>
          <KitCard i={i} w={140} />
        </div>
      );
    })}
    {rise > 0 && (
      <div style={{ ...centre(540, lerp(1500, 800, eo(mix(rise))), 1, `rotate(${(1 - mix(rise)) * -8}deg)`) }}>
        <ProductBox w={280} t={t} yaw={-24 + Math.sin(t * 0.9) * 6} glow={glow} />
      </div>
    )}
  </div>
);

const Rays: React.FC<{ t: number; x: number; y: number; k: number; color?: string }> = ({ t, x, y, k, color = P.lime }) =>
  k <= 0 ? null : (
    <svg width={2000} height={2000} viewBox="-1000 -1000 2000 2000" style={{ position: "absolute", left: x - 1000, top: y - 1000, opacity: 0.32 * k, transform: `rotate(${t * 9}deg) scale(${0.6 + 0.4 * k})` }}>
      {Array.from({ length: 14 }, (_, i) => {
        const a0 = (i / 14) * Math.PI * 2;
        const a1 = a0 + Math.PI / 14;
        return <path key={i} d={`M0 0 L${Math.cos(a0) * 1000} ${Math.sin(a0) * 1000} L${Math.cos(a1) * 1000} ${Math.sin(a1) * 1000} Z`} fill={color} />;
      })}
    </svg>
  );

export const RevealScene: React.FC<S> = ({ t }) => {
  if (t < C.reveal - 0.05) return null;
  const o = leave(t, C.files);
  if (o >= 1) return null;
  const rise = pop(t, C.maine, { damping: 12, stiffness: 120 });
  const fan = KIT_FILES.map((_, i) => pop(t, C.banaya + i * 0.05, { damping: 12, stiffness: 170 }));
  const intro = pop(t, C.maine + 0.05, { damping: 10, stiffness: 220 });
  const introOut = eo(seg(t, C.kitEbook - 0.15, C.kitEbook + 0.05));
  const sub = pop(t, C.kit + 0.1, { damping: 12, stiffness: 190 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Rays t={t} x={540} y={800} k={eo(seg(t, C.maine, C.maine + 0.6))} color={P.limeSoft} />
      <KitFan t={t} x={540} y={800} s={1} rise={rise} fan={fan} />
      {intro > 0 && introOut < 1 && (
        <div style={{ ...centre(540, 420, sc(intro) * (1 - introOut), "rotate(-3deg)") }}>
          <Sticker size={50} tone="ink" rotate={0}>
            INTRODUCING
          </Sticker>
        </div>
      )}
      <Headline
        t={t}
        top={330}
        inAt={C.kitEbook}
        outAt={C.files - 0.25}
        pulse={{ text: "Kit", at: C.kit }}
        lines={[
          {
            size: 96,
            segs: [
              { text: "Ebook", at: C.kitEbook },
              { text: "Launch", at: C.kitLaunch },
              { text: "Kit", at: C.kit, tone: "marker" },
            ],
          },
          { size: 62, segs: [{ text: "for India", at: C.india, tone: "lime" }] },
        ]}
      />
      {sub > 0 && (
        <div style={{ ...centre(540, 1092, mix(sub)), ...type.label, fontSize: 30, letterSpacing: "0.1em", color: P.ink, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 14, padding: "8px 20px", boxShadow: shadow.hard(5), whiteSpace: "nowrap" }}>
          PLAN <span style={{ color: P.oliveSoft }}>•</span> WRITE <span style={{ color: P.oliveSoft }}>•</span> PREPARE TO LAUNCH
        </div>
      )}
      <Burst t={t} at={C.kit} x={540} y={380} r={420} color={P.lime} />
      <Sparks t={t} at={C.kit + 0.05} x={540} y={800} n={14} r={420} />
    </div>
  );
};

// =================================================================================================================
// 4. What buyers get: prompts, templates, guide + workbook + outline

const PROMPT_PAGES = [1, 2, 3, 4, 5, 6].map((n) => `launch/pages/prompts-p${n}.png`);
/** Real prompt titles with their numbers in the pack. */
const PROMPT_CHIPS: { n: number; text: string; x: number; y: number; r: number }[] = [
  { n: 4, text: "Score three ideas", x: 262, y: 690, r: -5 },
  { n: 6, text: "Build a chapter outline", x: 740, y: 770, r: 4 },
  { n: 9, text: "Draft from my notes", x: 272, y: 925, r: 3 },
  { n: 19, text: "Write honest FAQs", x: 772, y: 1005, r: -4 },
];

const FlipBook: React.FC<{ t: number; pages: string[]; at: number; step: number; w: number }> = ({ t, pages, at, step, w }) => {
  const h = (w * 1160) / 820;
  return (
    <div style={{ position: "relative", width: w, height: h, perspective: 2200 }}>
      {pages.map((src, i) => {
        const k = i < pages.length - 1 ? io(seg(t, at + i * step, at + i * step + 0.3)) : 0;
        if (k >= 1) return null;
        return (
          <div key={src} style={{ position: "absolute", inset: 0, zIndex: pages.length - i, transformOrigin: "0% 50%", transform: `rotateY(${-175 * k}deg)`, backfaceVisibility: "hidden" }}>
            <RealPage src={src} w={w} />
            {k > 0 && <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: `rgba(23,23,23,${0.3 * Math.sin(k * Math.PI)})` }} />}
          </div>
        );
      })}
    </div>
  );
};

export const FilesScene: React.FC<S> = ({ t }) => {
  if (t < C.files - 0.15) return null;
  const o = leave(t, C.value);
  if (o >= 1) return null;
  const aOut = eo(seg(t, C.editable - 0.2, C.editable + 0.05));
  const bOut = eo(seg(t, C.guide - 0.2, C.guide + 0.05));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {aOut < 1 && <PromptsBeat t={t} out={aOut} />}
      {t > C.editable - 0.25 && bOut < 1 && <TemplatesBeat t={t} out={bOut} />}
      {t > C.guide - 0.25 && <PlanningBeat t={t} />}
    </div>
  );
};

const PromptsBeat: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const n = 1 + Math.floor(20 * eo(seg(t, C.ikkis, C.ai - 0.12)) + 0.0001);
  const num = pop(t, C.ikkis - 0.05, { damping: 9, stiffness: 230 });
  const word = pop(t, C.ai, { damping: 9, stiffness: 230 });
  const book = pop(t, C.files + 0.1, { damping: 13, stiffness: 160 });
  const fmts = pop(t, C.prompts + 0.05, { damping: 11, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-out * 300}px)` }}>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 340, height: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <div style={{ width: 230, display: "flex", justifyContent: "center", transform: `scale(${sc(num)})` }}>
          <Sticker size={124} tone="lime" rotate={-4}>
            {n}
          </Sticker>
        </div>
        <div style={{ ...type.display, fontSize: 104, color: P.ink, whiteSpace: "nowrap", opacity: Math.min(1, word * 2), transform: `scale(${lerp(1.6, 1, Math.min(1, word))})`, filter: `blur(${Math.max(0, 1 - word) * 8}px)` }}>AI PROMPTS</div>
      </div>
      <div style={{ ...centre(540, lerp(1400, 845, eo(mix(book))), 1, `rotate(${(1 - mix(book)) * 8}deg)`) }}>
        <FlipBook t={t} pages={PROMPT_PAGES} at={C.ikkis + 0.15} step={0.3} w={360} />
      </div>
      {PROMPT_CHIPS.map((c, i) => {
        const k = pop(t, C.ikkis + 0.3 + i * 0.3, { damping: 10, stiffness: 220 });
        if (k <= 0) return null;
        return (
          <div key={c.n} style={{ ...centre(c.x, c.y, sc(k), `rotate(${c.r}deg)`), display: "flex", alignItems: "center", gap: 10, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 16, padding: "7px 16px 7px 8px", boxShadow: shadow.hard(5), whiteSpace: "nowrap" }}>
            <div style={{ ...type.label, letterSpacing: "0.02em", fontSize: 20, background: P.lime, border: `3px solid ${P.ink}`, borderRadius: 9, padding: "1px 7px", color: P.ink }}>#{c.n}</div>
            <div style={{ ...type.display, fontSize: 25, color: P.ink }}>{c.text}</div>
          </div>
        );
      })}
      {fmts > 0 && (
        <div style={{ ...centre(540, 1108, sc(fmts)), display: "flex", alignItems: "center", gap: 12, ...type.label, fontSize: 22, color: P.ink2 }}>
          <FmtBadge fmt="PDF" size={24} />+<FmtBadge fmt="DOCX" size={24} />
          <span style={{ marginLeft: 6 }}>real pages</span>
        </div>
      )}
    </div>
  );
};

const TemplatesBeat: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const page = pop(t, C.editable + 0.05, { damping: 13, stiffness: 170 });
  const offer = pop(t, C.offer, { damping: 12, stiffness: 170 });
  const chip = pop(t, C.templates, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-out * 300}px)` }}>
      <Headline
        t={t}
        top={330}
        inAt={C.editable}
        outAt={C.guide - 0.2}
        lines={[
          { size: 92, segs: [{ text: "Editable", at: C.editable, tone: "lime" }] },
          { size: 84, segs: [{ text: "launch templates", at: C.landing }] },
        ]}
      />
      {page > 0 && (
        <div style={{ ...centre(lerp(-300, 320, eo(mix(page))), 845, 1, `rotate(${-3 * mix(page)}deg)`) }}>
          <WireframePage w={330} t={t} at={C.landing} />
        </div>
      )}
      {offer > 0 && (
        <div style={{ ...centre(lerp(1400, 765, eo(mix(offer))), 865, 1, `rotate(${4 * mix(offer)}deg)`) }}>
          <RealPage src="launch/pages/templates-p2.png" w={300} />
        </div>
      )}
      {chip > 0 && (
        <div style={{ ...centre(540, 1112, sc(chip), "rotate(-2deg)") }}>
          <Chip text="PDF + editable DOCX" size={30} tone="ink" />
        </div>
      )}
    </div>
  );
};

const PlanningBeat: React.FC<S> = ({ t }) => {
  const cards: { at: number; x: number; y: number; r: number; w: number; node: React.ReactNode; label: string; fmts: ("PDF" | "DOCX" | "XLSX")[] }[] = [
    { at: C.guide, x: 265, y: 815, r: -6, w: 250, node: <RealPage src="launch/pages/guide-p1.png" w={250} />, label: "Planning guide", fmts: ["PDF", "DOCX"] },
    { at: C.excel, x: 540, y: 798, r: 0, w: 270, node: <XlsxPage w={270} />, label: "Excel workbook", fmts: ["XLSX"] },
    { at: C.outline, x: 815, y: 815, r: 6, w: 250, node: <OutlinePage w={250} />, label: "Outline worksheet", fmts: ["DOCX"] },
  ];
  const bundle = eo(seg(t, C.bundle, C.bundle + 0.4));
  const tag = pop(t, C.bundle + 0.2, { damping: 10, stiffness: 210 });
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline
        t={t}
        top={330}
        inAt={C.guide}
        outAt={C.value - 0.2}
        lines={[
          { size: 80, segs: [{ text: "Planning guide", at: C.guide, tone: "marker" }] },
          {
            size: 62,
            segs: [
              { text: "+ Workbook", at: C.excel },
              { text: "+ Outline", at: C.outline },
            ],
          },
        ]}
      />
      {cards.map((c, i) => {
        const k = pop(t, c.at, { damping: 11, stiffness: 180 });
        if (k <= 0) return null;
        const bx = lerp(c.x, 540 + (i - 1) * 70, bundle);
        const by = lerp(c.y, 800 + Math.abs(i - 1) * 14, bundle);
        const br = lerp(c.r, (i - 1) * 7, bundle);
        return (
          <div key={c.label} style={{ ...centre(bx, lerp(1450, by, eo(mix(k))), (k > 1 ? 1 + (k - 1) * 0.2 : 1) * (1 - 0.08 * bundle), `rotate(${br + (1 - mix(k)) * 12}deg)`), zIndex: i === 1 ? 2 : 1 }}>
            {c.node}
            <div style={{ position: "absolute", left: 10, bottom: 10, display: "flex", gap: 6 }}>
              {c.fmts.map((f) => (
                <FmtBadge key={f} fmt={f} size={20} />
              ))}
            </div>
            <div style={{ position: "absolute", left: "50%", top: "100%", marginTop: 14, transform: "translateX(-50%)", ...type.display, fontSize: 30, color: P.ink, whiteSpace: "nowrap", opacity: 1 - bundle }}>{c.label}</div>
          </div>
        );
      })}
      {tag > 0 && (
        <div style={{ ...centre(540, 1080, sc(tag), "rotate(-3deg)") }}>
          <Sticker size={46} tone="ink" rotate={0}>
            PDF · DOCX · XLSX
          </Sticker>
        </div>
      )}
      <Sparks t={t} at={C.bundle + 0.1} x={540} y={800} n={12} r={360} />
    </div>
  );
};

// =================================================================================================================
// 5. Value: IDEA → OUTLINE → WRITE → PREPARE → LAUNCH, then 8 downloadable files

const NODES = [
  { label: "IDEA", x: 180, y: 560 },
  { label: "OUTLINE", x: 345, y: 720 },
  { label: "WRITE", x: 510, y: 560 },
  { label: "PREPARE", x: 675, y: 720 },
  { label: "LAUNCH", x: 860, y: 560 },
];

export const ValueScene: React.FC<S> = ({ t }) => {
  if (t < C.value - 0.15) return null;
  const o = leave(t, C.keemat);
  if (o >= 1) return null;
  const squeeze = eo(seg(t, C.sab, C.sab + 0.4));
  const files = pop(t, C.ek, { damping: 9, stiffness: 220 });
  const fmts = pop(t, C.kitMein, { damping: 11, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      <Headline
        t={t}
        top={330}
        inAt={C.steps[0]}
        outAt={C.sab}
        lines={[
          {
            size: 84,
            segs: [
              { text: "Your", at: C.steps[0] },
              { text: "first", at: C.steps[0] + 0.12, tone: "marker" },
              { text: "ebook", at: C.steps[0] + 0.24 },
            ],
          },
        ]}
      />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-squeeze * 150}px) scale(${1 - squeeze * 0.22})`, transformOrigin: "540px 420px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          {NODES.slice(1).map((n, i) => {
            const a = NODES[i];
            const k = eo(seg(t, C.steps[i + 1] - 0.3, C.steps[i + 1]));
            const len = Math.hypot(n.x - a.x, n.y - a.y);
            return (
              <g key={i}>
                <line x1={a.x} y1={a.y} x2={n.x} y2={n.y} stroke={P.lineStrong} strokeWidth={10} strokeDasharray="4 18" strokeLinecap="round" />
                <line x1={a.x} y1={a.y} x2={n.x} y2={n.y} stroke={P.ink} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${len * k} ${len}`} />
              </g>
            );
          })}
        </svg>
        {NODES.map((n, i) => {
          const show = pop(t, C.value + 0.05 + i * 0.06, { damping: 13, stiffness: 200 });
          const hit = pop(t, C.steps[i], { damping: 8, stiffness: 240 });
          const on = hit > 0;
          return (
            <React.Fragment key={n.label}>
              <div style={{ ...centre(n.x, n.y, mix(show) * (on ? 1 + 0.18 * Math.sin(Math.min(1, hit) * Math.PI) : 1)), width: 112, height: 112, borderRadius: 56, background: on ? P.lime : P.card, border: on ? `6px solid ${P.ink}` : `5px dashed ${P.lineStrong}`, boxShadow: on ? shadow.hard(6) : "none", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 52, color: on ? P.ink : P.lineStrong }}>
                {on ? "✓" : i + 1}
              </div>
              <div style={{ ...centre(n.x, n.y + 86, mix(show)), ...type.label, fontSize: 26, letterSpacing: "0.06em", color: on ? P.ink : P.ink3, whiteSpace: "nowrap" }}>{n.label}</div>
            </React.Fragment>
          );
        })}
      </div>
      {files > 0 && (
        <div style={{ ...centre(540, 830, sc(files), `rotate(${(1 - mix(files)) * -10 - 2}deg)`) }}>
          <Sticker size={56} tone="ink" rotate={0}>
            8 DOWNLOADABLE FILES
          </Sticker>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, width: 1080, top: 905, display: "flex", justifyContent: "center", gap: 12 }}>
        {KIT_FILES.map((f, i) => {
          const k = pop(t, C.ek + i * 0.035, { damping: 11, stiffness: 220 });
          return (
            <div key={i} style={{ transform: `scale(${mix(Math.max(0, k))}) translateY(${(1 - mix(Math.max(0, k))) * 40}px)`, opacity: k > 0 ? 1 : 0 }}>
              <FileIcon fmt={f.fmt} name={f.name.replace("21 prompts", "Prompts")} w={84} />
            </div>
          );
        })}
      </div>
      {fmts > 0 && (
        <div style={{ ...centre(540, 1112, sc(fmts)) }}>
          <Chip text="PDF + EDITABLE DOCX + XLSX" size={30} tone="lime" />
        </div>
      )}
      <Burst t={t} at={C.ek} x={540} y={830} r={400} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 6. Price: Aur keemat? → ONLY ₹99 · INSTANT DIGITAL DOWNLOAD

export const PriceScene: React.FC<S> = ({ t }) => {
  if (t < C.keemat - 0.15) return null;
  const o = leave(t, C.journey);
  if (o >= 1) return null;
  const kit = pop(t, C.keemat, { damping: 12, stiffness: 150 });
  const tag = pop(t, C.keemat + 0.15, { damping: 8, stiffness: 200 });
  const tagOut = eo(seg(t, C.price - 0.1, C.price + 0.02));
  const only = pop(t, C.sirf, { damping: 9, stiffness: 230 });
  const price = pop(t, C.price, { damping: 7, stiffness: 260, mass: 0.6 });
  const dl = pop(t, C.rupaye, { damping: 10, stiffness: 210 });
  const sh = shakeAt(t, C.price, 16, 0.35);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, transform: `translateX(${sh}px)` }}>
      <Rays t={t} x={540} y={600} k={eo(seg(t, C.price, C.price + 0.4))} />
      <KitFan t={t} x={540} y={865} s={0.82} rise={kit} fan={KIT_FILES.map((_, i) => pop(t, C.keemat + 0.1 + i * 0.04, { damping: 12, stiffness: 170 }))} glow={eo(seg(t, C.price, C.price + 0.3))} />
      {tag > 0 && tagOut < 1 && (
        <div style={{ ...centre(540, 580, mix(tag) * (1 - tagOut), `rotate(${Math.sin((t - C.keemat) * 7) * 9 * Math.exp(-(t - C.keemat) * 1.2)}deg)`), transformOrigin: "50% 0%" }}>
          <div style={{ position: "relative", ...type.display, fontSize: 120, color: P.ink, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 30, padding: "4px 50px", boxShadow: shadow.hard(10), whiteSpace: "nowrap" }}>
            ₹ ???
            <div style={{ position: "absolute", left: "50%", top: 14, width: 26, height: 26, marginLeft: -13, borderRadius: 13, border: `6px solid ${P.ink}`, background: P.paper }} />
          </div>
        </div>
      )}
      {only > 0 && (
        <div style={{ ...centre(540, 395, sc(only), "rotate(-3deg)") }}>
          <Sticker size={62} tone="ink" rotate={0}>
            ONLY
          </Sticker>
        </div>
      )}
      {price > 0 && (
        <div style={{ ...centre(540, 590, lerp(2.2, 1, mix(price)) * (price > 1 ? 1 + (price - 1) * 0.3 : 1), "rotate(-4deg)"), filter: `drop-shadow(0 0 60px rgba(200,241,105,${0.6 * mix(price)}))` }}>
          <Sticker size={210} tone="lime" rotate={0}>
            ₹99
          </Sticker>
        </div>
      )}
      {dl > 0 && (
        <div style={{ ...centre(540, 1108, sc(dl), "rotate(-1deg)") }}>
          <Chip text="INSTANT DIGITAL DOWNLOAD" size={32} tone="ink" />
        </div>
      )}
      <Burst t={t} at={C.price} x={540} y={590} r={520} color={P.ink} />
      <Sparks t={t} at={C.price + 0.03} x={540} y={590} n={16} r={480} />
    </div>
  );
};

// =================================================================================================================
// 7. Journey: making reels, our real reel covers, WHAT WORKED? / WHAT DIDN'T?

// Our real reel covers (the Million Dollar Homepage one is left out: its "$1,000,000+" could read as an income claim here).
const COVERS = ["google", "ebay", "immich", "google5"].map((k) => `launch/covers/${k}.jpg`);

const Editor: React.FC<{ t: number; w: number; h: number }> = ({ t, w, h }) => {
  const ph = seg(t, C.reels, C.main);
  const clips = [
    [0, 0.18, P.lime],
    [0.19, 0.38, P.ink],
    [0.39, 0.52, P.gold],
    [0.53, 0.74, P.lime],
    [0.75, 1, P.teal],
  ] as const;
  return (
    <div style={{ width: w, height: h, background: "#1b1c1f", border: `5px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(8), overflow: "hidden", position: "relative", boxSizing: "border-box" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#26282d", borderBottom: "3px solid #33363c" }}>
        {["#E0452B", "#F2B33D", "#1E9E57"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
        <div style={{ ...type.label, letterSpacing: "0.04em", fontSize: 16, color: "#aab0bb", marginLeft: 8 }}>reel.tsx · Remotion</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 62, display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          ["VOICE", "wave"],
          ["MUSIC", "bar"],
          ["SCENES", "clips"],
        ].map(([label, kind]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, height: 52 }}>
            <div style={{ width: 76, ...type.label, letterSpacing: "0.04em", fontSize: 14, color: "#8d939e" }}>{label}</div>
            <div style={{ flex: 1, height: "100%", position: "relative", background: "#24262b", borderRadius: 8, overflow: "hidden" }}>
              {kind === "wave" && (
                <div style={{ position: "absolute", inset: "6px 6px", display: "flex", alignItems: "center", gap: 3 }}>
                  {Array.from({ length: 46 }, (_, i) => (
                    <div key={i} style={{ flex: 1, height: `${20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))}%`, background: P.lime, borderRadius: 3 }} />
                  ))}
                </div>
              )}
              {kind === "bar" && <div style={{ position: "absolute", left: 6, right: 6, top: 14, bottom: 14, borderRadius: 6, background: P.oliveSoft }} />}
              {kind === "clips" &&
                clips.map(([a, b, c], i) => <div key={i} style={{ position: "absolute", left: `${a * 100}%`, width: `${(b - a) * 100}%`, top: 6, bottom: 6, background: c, border: "3px solid #0e0f11", borderRadius: 6, boxSizing: "border-box" }} />)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 56, bottom: 16, left: 14 + 86 + (w - 14 * 2 - 86 - 10) * ph, width: 4, background: "#ff5a3c", borderRadius: 2 }} />
    </div>
  );
};

const Notebook: React.FC<{ title: string; tone: "lime" | "ink"; w: number; h: number; t: number }> = ({ title, tone, w, h, t }) => (
  <div style={{ position: "relative", width: w, height: h, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(8), boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: 30, right: 30, top: -18, display: "flex", justifyContent: "space-between" }}>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ width: 16, height: 34, borderRadius: 8, border: `4px solid ${P.ink}`, background: P.paper2 }} />
      ))}
    </div>
    <div style={{ margin: "30px 20px 0", padding: "8px 14px", borderRadius: 12, background: tone === "lime" ? P.lime : P.ink, color: tone === "lime" ? P.ink : P.lime, border: `4px solid ${P.ink}`, ...type.display, fontSize: 40, textAlign: "center", whiteSpace: "nowrap" }}>{title}</div>
    <div style={{ position: "absolute", left: 54, top: 112, bottom: 18, width: 3, background: "#E9A3A3" }} />
    <div style={{ position: "absolute", left: 20, right: 20, top: 140, display: "flex", flexDirection: "column", gap: 34 }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ height: 3, background: P.line }} />
      ))}
    </div>
    <div style={{ position: "absolute", right: 18, bottom: 16, ...type.display, fontSize: 90, color: P.line, transform: `rotate(${Math.sin(t * 2) * 4}deg)` }}>?</div>
  </div>
);

export const JourneyScene: React.FC<S> = ({ t }) => {
  if (t < C.journey - 0.15) return null;
  const o = leave(t, C.cta);
  if (o >= 1) return null;
  const aOut = eo(seg(t, C.main - 0.15, C.main + 0.15));
  const head = pop(t, C.reels, { damping: 10, stiffness: 210 });
  const phone = pop(t, C.reels + 0.05, { damping: 13, stiffness: 160 });
  const ed = pop(t, C.reels + 0.2, { damping: 13, stiffness: 160 });
  const follow = pop(t, C.main, { damping: 10, stiffness: 210 });
  const journey = pop(t, C.journeyWord, { damping: 8, stiffness: 230 });
  const cardsOut = eo(seg(t, C.kya - 0.15, C.kya + 0.15));
  const note = pop(t, C.main + 0.6, { damping: 12, stiffness: 200 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {/* A. making a reel */}
      {aOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - aOut, transform: `translateY(${-aOut * 120}px)` }}>
          {head > 0 && (
            <div style={{ ...centre(540, 400, sc(head), "rotate(-2deg)") }}>
              <Sticker size={60} tone="ink" rotate={0}>
                SELLING WITH REELS?
              </Sticker>
            </div>
          )}
          {phone > 0 && (
            <div style={{ ...centre(lerp(-300, 315, eo(mix(phone))), 830, 1, `rotate(${-4 * mix(phone)}deg)`) }}>
              <PhoneShell w={290}>
                <Img src={staticFile(COVERS[2])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", left: 14, top: 40, display: "flex", alignItems: "center", gap: 6, ...type.label, fontSize: 15, color: "#fff", background: "rgba(23,23,23,0.8)", borderRadius: 8, padding: "3px 9px" }}>
                  <div style={{ width: 11, height: 11, borderRadius: 6, background: "#E0452B", opacity: Math.sin(t * 9) > -0.3 ? 1 : 0.2 }} />
                  REC
                </div>
                <div style={{ position: "absolute", left: 14, right: 14, bottom: 22, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.5)" }}>
                  <div style={{ width: `${seg(t, C.reels, C.main) * 100}%`, height: "100%", borderRadius: 3, background: P.lime }} />
                </div>
              </PhoneShell>
            </div>
          )}
          {ed > 0 && (
            <div style={{ ...centre(lerp(1500, 712, eo(mix(ed))), 760, 1, `rotate(${2 * mix(ed)}deg)`) }}>
              <Editor t={t} w={460} h={300} />
            </div>
          )}
          {ed > 0 && <DemoTag text="How I make these reels" style={{ left: 600, top: 930 }} />}
        </div>
      )}
      {/* B + C title */}
      {follow > 0 && (
        <>
          <div style={{ ...centre(540, 380, sc(follow), "rotate(-2deg)") }}>
            <Sticker size={50} tone="ink" rotate={0}>
              FOLLOW THE REAL
            </Sticker>
          </div>
          <div style={{ ...centre(540, 480, journey > 0 ? sc(journey) : 0, "rotate(2deg)") }}>
            <Sticker size={68} tone="lime" rotate={0}>
              MARKETING JOURNEY
            </Sticker>
          </div>
        </>
      )}
      {/* B. our real reels */}
      {t > C.main - 0.1 &&
        cardsOut < 1 &&
        COVERS.map((src, i) => {
          const k = pop(t, C.main + 0.3 + i * 0.12, { damping: 12, stiffness: 180 });
          if (k <= 0) return null;
          const x = 540 + (i - 1.5) * 185;
          const y = 800 + Math.abs(i - 1.5) * 24;
          return (
            <div key={src} style={{ ...centre(lerp(x + 900, x, eo(mix(k))), y + cardsOut * 500, 1, `rotate(${(i - 1.5) * 5}deg)`), opacity: 1 - cardsOut, width: 170, height: 302, borderRadius: 16, border: `4px solid ${P.ink}`, boxShadow: shadow.hard(6), overflow: "hidden", background: P.card }}>
              <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      {/* C. the notebooks */}
      {[
        { title: "WHAT WORKED?", tone: "lime" as const, at: C.kaam, x: 315 },
        { title: "WHAT DIDN'T?", tone: "ink" as const, at: C.nahi, x: 765 },
      ].map((n) => {
        const k = pop(t, n.at, { damping: 11, stiffness: 190 });
        if (k <= 0) return null;
        return (
          <div key={n.title} style={{ ...centre(n.x, lerp(1300, 790, eo(mix(k))), k > 1 ? 1 + (k - 1) * 0.2 : 1, `rotate(${n.tone === "lime" ? -3 : 3}deg)`) }}>
            <Notebook title={n.title} tone={n.tone} w={380} h={420} t={t} />
          </div>
        );
      })}
      {note > 0 && (
        <div style={{ ...centre(540, 1110, mix(note)), ...type.body, fontWeight: 600, fontSize: 29, color: P.ink2, background: P.card, border: `3px solid ${P.line}`, borderRadius: 14, padding: "6px 18px", whiteSpace: "nowrap" }}>
          Free reel series · not part of the ₹99 kit
        </div>
      )}
    </div>
  );
};

// =================================================================================================================
// 8. CTA: the real ebook page on a phone, LINK IN BIO

const PHONE = { x: 350, y: 785, w: 370 };
const SCREEN_W = PHONE.w * 0.93;
const IMG_S = SCREEN_W / 780;
const IMG_TOP = 76;
const CROP = 24;
const screenTop = PHONE.y - (PHONE.w * 2.02) / 2 + PHONE.w * 0.035;
const screenLeft = PHONE.x - PHONE.w / 2 + PHONE.w * 0.035;
/** The real "Buy now · ₹99" button inside the phone, in frame coordinates. */
const BUY = { x: screenLeft + 32 * IMG_S, y: screenTop + IMG_TOP + (61 - CROP) * IMG_S, w: 716 * IMG_S, h: 104 * IMG_S };

export const CtaScene: React.FC<S> = ({ t }) => {
  if (t < C.cta - 0.15) return null;
  const o = leave(t, C.agla);
  if (o >= 1) return null;
  const phone = pop(t, C.cta + 0.05, { damping: 13, stiffness: 160 });
  const name = pop(t, C.toh2 + 0.3, { damping: 10, stiffness: 210 });
  const link = pop(t, C.link, { damping: 8, stiffness: 240 });
  const lens = pop(t, C.link + 0.25, { damping: 12, stiffness: 190 });
  const dl = pop(t, C.seekho, { damping: 10, stiffness: 210 });
  const ring = t > C.link + 0.2 ? 0.5 + 0.5 * Math.sin((t - C.link) * 8) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o }}>
      {phone > 0 && (
        <div style={{ ...centre(PHONE.x, lerp(1700, PHONE.y, eo(mix(phone))), 1) }}>
          <PhoneShell w={PHONE.w} glow={ring * 0.6}>
            <StatusRow w={SCREEN_W} />
            <div style={{ position: "absolute", left: 12, right: 12, top: 34, height: 34, display: "flex", alignItems: "center", gap: 7, padding: "0 12px", borderRadius: 17, background: P.paper2, border: `2px solid ${P.line}` }}>
              <div style={{ width: 10, height: 9, marginTop: 4, borderRadius: 2, background: P.ink3, position: "relative" }}>
                <div style={{ position: "absolute", left: 1, top: -7, width: 8, height: 9, border: `2px solid ${P.ink3}`, borderBottom: "none", borderRadius: "5px 5px 0 0", boxSizing: "border-box" }} />
              </div>
              <div style={{ ...type.label, letterSpacing: "0.01em", textTransform: "none", fontSize: 13, color: P.ink2, whiteSpace: "nowrap" }}>internetoolbox.com/ebook-launch-kit</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: IMG_TOP, bottom: 0, overflow: "hidden" }}>
              <Img src={staticFile("launch/site-buy.png")} style={{ position: "absolute", left: 0, top: -CROP * IMG_S, width: SCREEN_W }} />
            </div>
          </PhoneShell>
        </div>
      )}
      {ring > 0 && <div style={{ position: "absolute", left: BUY.x - 8, top: BUY.y - 8, width: BUY.w + 16, height: BUY.h + 16, borderRadius: 14, border: `${5 + ring * 3}px solid ${P.lime}`, boxShadow: `0 0 ${20 + ring * 20}px rgba(200,241,105,0.8)`, boxSizing: "border-box" }} />}
      {lens > 0 && (
        <div style={{ ...centre(748, 588, sc(lens), "rotate(2deg)") }}>
          <div style={{ position: "relative", width: 400, height: 220, borderRadius: 24, border: `6px solid ${P.ink}`, background: P.paper, overflow: "hidden", boxShadow: shadow.hard(9) }}>
            <Img src={staticFile("launch/site-buy.png")} style={{ position: "absolute", left: -190, top: -48, width: 780 }} />
          </div>
          <DemoTag text="Real page · internetoolbox.com" style={{ left: 64, top: 236 }} />
        </div>
      )}
      {link > 0 && (
        <div style={{ ...centre(600, 364, sc(link), `rotate(${(1 - mix(link)) * -10 - 3}deg)`) }}>
          <Sticker size={74} tone="lime" rotate={0}>
            LINK IN BIO
          </Sticker>
        </div>
      )}
      {name > 0 && (
        <div style={{ ...centre(720, 872, sc(name), "rotate(3deg)") }}>
          <Sticker size={32} tone="ink" rotate={0}>
            EBOOK LAUNCH KIT · ₹99
          </Sticker>
        </div>
      )}
      {dl > 0 && (
        <div style={{ ...centre(745, 990, sc(dl), "rotate(-3deg)") }}>
          <Chip text="INSTANT DOWNLOAD" size={30} tone="lime" />
        </div>
      )}
      <TapPointer t={t} from={[1000, 1260]} to={[BUY.x + BUY.w * 0.62, BUY.y + BUY.h * 0.55]} at={C.link + 0.35} tapAt={C.khareedo} />
      <Burst t={t} at={C.link} x={600} y={364} r={380} color={P.lime} />
    </div>
  );
};

// =================================================================================================================
// 9. Follow: NEXT CHAPTER COMING, then the brand end card

export const FollowScene: React.FC<S> = ({ t }) => {
  if (t < C.agla - 0.1) return null;
  const nOut = eo(seg(t, C.follow - 0.15, C.follow + 0.1));
  const book = pop(t, C.agla, { damping: 11, stiffness: 180 });
  const next = pop(t, C.chapter, { damping: 9, stiffness: 230 });
  const at = C.follow;
  const mark = pop(t, at + 0.05, { damping: 10, stiffness: 190 });
  const handle = pop(t, at + 0.2, { damping: 11, stiffness: 190 });
  const bump = t > C.brand ? 1 + 0.12 * Math.sin(Math.min(1, (t - C.brand) / 0.4) * Math.PI) : 1;
  return (
    <>
      {nOut < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - nOut, transform: `scale(${1 - nOut * 0.2})`, transformOrigin: "540px 700px" }}>
          {book > 0 && (
            <div style={{ ...centre(540, 820, sc(book), `rotate(${-6 + Math.sin(t * 3) * 3}deg)`) }}>
              <div style={{ position: "relative" }}>
                {[2, 1].map((n) => {
                  const k = io(seg(t, C.chapter - 0.05 + (2 - n) * 0.12, C.chapter + 0.3 + (2 - n) * 0.12));
                  return <div key={n} style={{ position: "absolute", left: 4, top: 4, width: 262, height: 360, zIndex: 2, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 8, transformOrigin: "0% 50%", transform: `perspective(1500px) rotateY(${-160 * k}deg)`, opacity: k > 0 && k < 1 ? 1 : 0 }} />;
                })}
                <BookCover w={270} />
              </div>
            </div>
          )}
          {next > 0 && (
            <>
              <div style={{ ...centre(540, 400, sc(next), "rotate(-2deg)") }}>
                <Sticker size={70} tone="ink" rotate={0}>
                  NEXT CHAPTER
                </Sticker>
              </div>
              <div style={{ ...centre(540, 510, sc(pop(t, C.chapter + 0.2, { damping: 9, stiffness: 230 })), "rotate(3deg)") }}>
                <Sticker size={58} tone="lime" rotate={0}>
                  COMING
                </Sticker>
              </div>
            </>
          )}
          <Burst t={t} at={C.chapter} x={540} y={450} r={380} color={P.lime} />
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
      {handle > 0 && <div style={{ ...centre(540, 815, mix(handle)), ...type.label, fontSize: 26, color: P.ink3, whiteSpace: "nowrap" }}>Next chapter coming</div>}
      <FollowButton t={t} at={at + 0.25} tapAt={C.karo} top={870} invite />
      {t > C.karo && (
        <div style={{ ...centre(800, 920, mix(pop(t, C.karo + 0.1, { damping: 8 })), `rotate(${12 + Math.sin(t * 5) * 6}deg)`) }}>
          <Heart size={56} />
        </div>
      )}
      <Sparks t={t} at={C.brand} x={540} y={560} n={12} r={260} />
    </>
  );
};
