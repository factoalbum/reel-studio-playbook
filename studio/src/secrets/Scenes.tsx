import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BrandMark, Burst, CommentCard, FollowButton, mono, palette as P, shadow, Sticker, TapPointer, type } from "../brand";
import { clamp01, range, usePop } from "../components/motion";
import { C, secrets as ep } from "../episodes/secrets";
import { google } from "../episodes/google";
import googleEnv from "../episodes/google-voice-env.json";
import { FileChip, Footage, Highlight, MiniAvatar, Outline, ScreenFrame, ScreenShot, Shot, SHOTS, STAGE, useSpan, Wave } from "./kit";

const END_S1 = C.s2 - 0.16;
const END_S2 = C.s3 - 0.16;
const END_S3 = C.s4 - 0.16;
const END_S4 = C.s5Say - 0.08;
const END_S5 = C.s6 - 0.16;
const END_S6 = C.lekin - 0.1;

const StampWords: React.FC<{ t: number; at: number; out: number; x: number; y: number; size: number; rotate: number; tone?: "lime" | "ink"; lines: string[] }> = ({ t, at, out, x, y, size, rotate, tone = "lime", lines }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 240, mass: 0.6 });
  const o = range(t, out - 0.16, out);
  if (t < at || o >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${(2.1 - 1.1 * Math.min(1, p)) * (1 - 0.3 * o)})`, opacity: Math.min(1, p * 2.2) * (1 - o) }}>
      <Sticker size={size} tone={tone} rotate={rotate}>
        <span style={{ display: "inline-block", textAlign: "center" }}>
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </span>
      </Sticker>
    </div>
  );
};

/** Opens on the real Google reel with no intro; "NO CAMERA!" and "NO MANUAL ANIMATION?!" land on their words. */
export const Hook: React.FC<{ t: number }> = ({ t }) => {
  if (t >= C.gridAt + 0.1) return null;
  const leave = range(t, C.gridAt - 0.16, C.gridAt + 0.1);
  const cuts: [number, Shot][] = [
    [0, SHOTS.room],
    [3.72, SHOTS.clock],
    [6.5, SHOTS.double],
    [9.8, SHOTS.alex],
  ];
  const kick = cuts.reduce((m, [at]) => Math.max(m, t >= at ? Math.exp(-(t - at) * 9) : 0), 0);
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${leave * -1160}px)` }}>
        <ScreenFrame w={870} h={740} label={undefined} style={{ left: 80, top: 330, transform: `scale(${1 + 0.035 * kick}) rotate(${-0.5 + 0.8 * kick}deg)` }}>
          <Footage t={t} w={860} h={730} cuts={cuts} end={C.gridAt + 0.1} />
        </ScreenFrame>
        <StampWords t={t} at={C.cameraWord} out={9.82} x={348} y={620} size={92} rotate={-5} lines={["NO CAMERA!"]} />
        <StampWords t={t} at={C.animateWord} out={9.82} x={560} y={872} size={84} rotate={3} tone="ink" lines={["NO MANUAL", "ANIMATION?!"]} />
        <StampWords t={t} at={C.kaiseWord} out={C.gridAt} x={790} y={560} size={170} rotate={-4} lines={["?!"]} />
      </div>
    </>
  );
};

const STEPS = ["Script", "Voice", "Character", "Captions", "Animation", "Render"];

/** The six steps as tiles. Step five gets the "watch this one" promise. */
export const SixGrid: React.FC<{ t: number }> = ({ t }) => {
  const out = C.s1 - 0.14;
  const { o, on } = useSpan(t, C.gridAt, out);
  const enter = usePop(t, C.gridAt, { damping: 15, stiffness: 150, mass: 0.75 });
  const five = usePopSafe(t, C.fifthWord);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 80, top: 330, width: 870, height: 800, opacity: 1 - o, transform: `translateX(${(1 - enter) * 900 - o * 1000}px)` }}>
      <div style={{ ...type.display, fontSize: 86, color: P.ink, marginBottom: 20 }}>
        Sirf <span style={{ background: P.lime, padding: "0 12px", borderRadius: 12 }}>6 steps</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 }}>
        {STEPS.map((s, i) => (
          <Tile key={s} t={t} i={i} label={s} five={five} />
        ))}
      </div>
    </div>
  );
};

const usePopSafe = (t: number, at: number) => usePop(t, at, { damping: 9, stiffness: 220, mass: 0.6 });

const Tile: React.FC<{ t: number; i: number; label: string; five: number }> = ({ t, i, label, five }) => {
  const p = usePop(t, C.sixWord + i * 0.16, { damping: 10, stiffness: 220, mass: 0.6 });
  const me = i === 4;
  const dim = me ? 1 : 1 - 0.55 * Math.min(1, five);
  const ring = 1 + 0.03 * Math.sin(t * 11) * Math.min(1, five);
  return (
    <div
      style={{
        position: "relative",
        height: 276,
        borderRadius: 24,
        border: `5px solid ${P.ink}`,
        background: me && five > 0 ? P.lime : P.card,
        boxShadow: shadow.hard(me ? 10 : 7),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(1, p * 2) * dim,
        transform: `scale(${p * (me ? 1 + 0.1 * Math.min(1, five) : 1) * (me ? ring : 1)})`,
        zIndex: me ? 2 : 1,
      }}
    >
      <div style={{ ...type.display, fontSize: 118, color: P.ink, lineHeight: 1 }}>0{i + 1}</div>
      <div style={{ ...type.label, fontSize: 28, letterSpacing: "0.04em", color: me && five > 0 ? P.ink : P.ink2, marginTop: 10 }}>{label}</div>
      {me && five > 0 && (
        <div style={{ position: "absolute", top: -34, left: "50%", transform: `translateX(-50%) scale(${five}) rotate(-3deg)`, ...type.label, fontSize: 25, letterSpacing: "0.03em", color: P.lime, background: P.ink, border: `3px solid ${P.ink}`, borderRadius: 12, padding: "5px 12px", whiteSpace: "nowrap" }}>Watch this one</div>
      )}
    </div>
  );
};

/** Step 1: the real script in the owner's ChatGPT chat appears line by line; the hook and the scene list get boxed. */
export const Step1: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.s1 - 0.16, END_S1);
  if (!on) return null;
  const reveal = 44 + 528 * clamp01((t - 17.3) / 3.2);
  return (
    <ScreenFrame w={STAGE.w} h={STAGE.h} bg="#2F2F2F" style={{ left: STAGE.x, top: STAGE.y, transform: `perspective(1500px) translateX(${(1 - p) * 780 - o * 1160}px) rotateY(${(1 - p) * -38}deg)` }}>
      <ScreenShot
        t={t}
        src="secrets/screens/chatgpt.jpg"
        picW={752}
        cam={[
          [C.s1 - 0.2, 6, 30, 1.45],
          [C.scriptWord - 0.4, 6, 30, 1.45],
          [C.scriptWord + 0.1, 6, 149, 1.45],
          [30, 6, 149, 1.45],
        ]}
      >
        <div style={{ position: "absolute", left: 0, width: 752, top: reveal, height: 620, background: "#2F2F2F" }} />
        <Outline t={t} at={C.hookWord} out={END_S1} x={12} y={48} w={410} h={162} tag="Hook" line={4} tagSize={17} />
        <Outline t={t} at={C.scriptWord} out={END_S1} x={12} y={254} w={566} h={304} tag="Scene list" line={4} tagSize={17} />
      </ScreenShot>
      <RealTag text="Real ChatGPT chat" />
    </ScreenFrame>
  );
};

const RealTag: React.FC<{ text: string; dark?: boolean }> = ({ text }) => (
  <div style={{ position: "absolute", right: 14, top: 14, ...type.label, fontSize: 21, letterSpacing: "0.07em", color: P.lime, background: P.ink, border: `3px solid ${P.lime}`, borderRadius: 999, padding: "5px 15px", whiteSpace: "nowrap" }}>{text}</div>
);

/** Step 2: the real AI Studio speech screen with our script, then the real waveform of this reel's voice. */
export const Step2: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.s2 - 0.16, END_S2);
  const card = usePop(t, 22.9, { damping: 13, stiffness: 170, mass: 0.7 });
  if (!on) return null;
  const k = clamp01((t - (C.voiceWord - 0.5)) / 2.3);
  const shown = Math.round(k * ep.voiceSeconds);
  const stamp = `${Math.floor(shown / 60)}:${String(shown % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o, transform: `translateY(${o * -60}px)` }}>
      <ScreenFrame w={STAGE.w} h={384} style={{ left: STAGE.x, top: STAGE.y, transform: `scale(${0.7 + 0.3 * p}) rotate(${(1 - p) * 4}deg)`, opacity: Math.min(1, p * 2) }}>
        <ScreenShot
          t={t}
          src="secrets/screens/aistudio.jpg"
          picW={1352}
          cam={[
            [C.s2 - 0.2, 50, 84, 1.5],
            [C.studioWord + 0.1, 50, 84, 1.5],
            [23.45, 430, 84, 1.5],
            [24.05, 779, 165, 1.5],
            [30, 779, 165, 1.5],
          ]}
        >
          <Outline t={t} at={C.studioWord} out={23.5} x={58} y={90} w={941} h={142} tag="Our script" line={4} tagSize={16} tagLeft />
          <Outline t={t} at={24.0} out={END_S2} x={1072} y={324} w={270} h={64} tag="Voice: Puck" line={4} tagSize={16} />
        </ScreenShot>
        <RealTag text="Real AI Studio" />
      </ScreenFrame>
      {card > 0 && (
        <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y + 400, width: STAGE.w, height: 224, boxSizing: "border-box", borderRadius: 26, border: `5px solid ${P.ink}`, background: P.card, boxShadow: shadow.hard(8), transform: `translateY(${(1 - card) * 300}px)`, opacity: Math.min(1, card * 2), padding: "16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <FileChip text="voice.wav" />
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 30, color: P.ink2 }}>{stamp} / 1:11</div>
          </div>
          <Wave env={ep.env} bars={68} w={812} h={112} k={k} />
        </div>
      )}
    </div>
  );
};

const POSES = [
  { pose: "point", expr: "talk", aim: -60 },
  { pose: "thumbs", expr: "happy" },
  { pose: "think", expr: "thinking" },
  { pose: "wave", expr: "happy" },
  { pose: "surprised", expr: "surprised" },
] as const;

const SWATCHES = [P.lime, P.ink, P.paper, P.olive];

/** Step 3: the real Claude Code session, the approved character in five poses, and the brand theme. */
export const Step3: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.s3 - 0.16, END_S3);
  const strip = usePop(t, C.characterWord - 0.25, { damping: 14, stiffness: 170, mass: 0.7 });
  const brand = usePop(t, C.brandWord, { damping: 10, stiffness: 220, mass: 0.6 });
  if (!on) return null;
  const tall = 1 - range(t, C.characterWord - 0.3, C.characterWord + 0.05);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o, transform: `translateX(${o * 1160}px)` }}>
      <ScreenFrame w={STAGE.w} h={300 + 300 * tall} style={{ left: STAGE.x, top: STAGE.y, transform: `perspective(1400px) rotateX(${(1 - p) * 70}deg)`, transformOrigin: "50% 0%", opacity: Math.min(1, p * 2) }}>
        <Img src={staticFile("secrets/screens/claude-project.png")} style={{ position: "absolute", left: 0, top: 0, width: 860 }} />
        <RealTag text="Real Claude Code" />
        {brand > 0 && (
          <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", alignItems: "center", gap: 10, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 16, padding: "8px 14px", transform: `scale(${brand})`, transformOrigin: "100% 100%" }}>
            <span style={{ ...type.label, fontSize: 21, letterSpacing: "0.05em", color: P.ink }}>Brand theme</span>
            {SWATCHES.map((c) => (
              <div key={c} style={{ width: 34, height: 34, borderRadius: 34, background: c, border: `3px solid ${P.ink}` }} />
            ))}
          </div>
        )}
      </ScreenFrame>
      {strip > 0 && (
        <ScreenFrame w={STAGE.w} h={310} bg={P.limeWash} style={{ left: STAGE.x, top: STAGE.y + 314, transform: `translateY(${(1 - strip) * 280}px)`, opacity: Math.min(1, strip * 2) }}>
          {POSES.map((q, i) => {
            const at = C.characterWord + i * 0.2;
            if (t < at) return null;
            return <PoseCell key={q.pose} t={t} at={at} i={i} q={q} />;
          })}
        </ScreenFrame>
      )}
    </div>
  );
};

const PoseCell: React.FC<{ t: number; at: number; i: number; q: (typeof POSES)[number] }> = ({ t, at, i, q }) => {
  const p = usePop(t, at, { damping: 10, stiffness: 220, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 300, transform: `translateY(${(1 - p) * 220}px)` }}>
      <MiniAvatar x={92 + i * 169} y={108} s={0.3} pose={q.pose} expr={q.expr} aim={"aim" in q ? q.aim : undefined} />
    </div>
  );
};

/** Step 4: a real voice waveform, real word timestamps from the Google reel's caption file, and the caption they make. */
export const Step4: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.s4 - 0.16, END_S4);
  if (!on) return null;
  const from = 19.68;
  const to = 21.9;
  const words = google.captions.filter((c) => c.start >= from - 0.01 && c.end <= to + 0.05).flatMap((c) => c.words);
  const clock = from + (to - from) * clamp01((t - 31.3) / 2.3);
  const k = (clock - from) / (to - from);
  return (
    <div style={{ position: "absolute", left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, boxSizing: "border-box", borderRadius: 26, border: `5px solid ${P.ink}`, background: P.card, boxShadow: shadow.hard(9), padding: "20px 26px", transform: `translateY(${(1 - p) * 860 - o * 900}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <FileChip text="google.ts" />
        <div style={{ ...type.label, fontSize: 21, letterSpacing: "0.06em", color: P.olive }}>Real caption file</div>
      </div>
      <div style={{ marginTop: 26 }}>
        <Wave env={googleEnv as number[]} from={from * 30} to={to * 30} bars={60} w={808} h={128} k={k} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 30 }}>
        {words.map(([word, at], i) => {
          const said = clock >= at;
          return (
            <div key={i} style={{ flex: "1 1 30%", borderRadius: 14, border: `4px solid ${P.ink}`, background: said ? P.lime : P.paper2, padding: "7px 14px", transform: `scale(${said ? 1 + 0.08 * Math.exp(-(clock - at) * 8) : 1})` }}>
              <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 25, color: said ? P.ink : P.ink3 }}>{at.toFixed(2)}s</div>
              <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 40, color: said ? P.ink : P.ink3 }}>{word}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center", columnGap: 16, ...type.display, letterSpacing: "-0.02em", fontSize: 46 }}>
        {words.slice(0, 4).map(([word, at], i) => (
          <span key={i} style={{ color: clock >= at ? P.ink : P.lineStrong, background: word === "search" && clock >= at ? P.lime : "transparent", borderRadius: 8, padding: "0 6px" }}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Dark stage for the biggest moment of the reel, so it looks different from every other step. */
export const DarkStage: React.FC<{ t: number }> = ({ t }) => {
  const a = range(t, C.s5Say - 0.1, C.s5 - 0.1);
  const b = range(t, END_S5 - 0.2, END_S5);
  if (t < C.s5Say - 0.1 || b >= 1) return null;
  const glow = 0.28 + 0.2 * Math.exp(-Math.max(0, t - C.result) * 2.5) * (t >= C.result ? 1 : 0);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${a * 1200}px at 540px 1020px)`, opacity: 1 - b, background: `radial-gradient(circle at 50% 42%, rgba(200,241,105,${glow}), rgba(23,23,23,0) 62%), ${P.ink}` }} />
  );
};

const BOARD = ["0:00  Hook, real reel", "0:17  Steps 1 to 4", "0:34  The reveal", "0:44  Check + render", "1:04  Comment REEL"];

const InputCard: React.FC<{ t: number; at: number; i: number; label: string; children: React.ReactNode }> = ({ t, at, i, label, children }) => {
  const p = usePop(t, at, { damping: 11, stiffness: 200, mass: 0.65 });
  if (p <= 0) return null;
  const fly = range(t, 37.86, 38.36);
  const x = 80 + i * 299;
  const y = 516;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 272,
        height: 300,
        boxSizing: "border-box",
        borderRadius: 22,
        border: `5px solid ${P.ink}`,
        background: P.card,
        boxShadow: `8px 8px 0 ${P.lime}`,
        overflow: "hidden",
        transform: `translate(${(299 - i * 299) * fly}px, ${fly * 320}px) scale(${p * (1 - 0.8 * fly)})`,
        opacity: 1 - fly * 0.9,
      }}
    >
      <div style={{ ...type.label, fontSize: 25, letterSpacing: "0.04em", color: P.ink, background: P.lime, padding: "6px 14px", borderBottom: `4px solid ${P.ink}` }}>{label}</div>
      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>{children}</div>
    </div>
  );
};

/** Step 5: script + voice + storyboard go into Claude Code, a wipe turns them into real footage, then "Result!". */
export const Reveal: React.FC<{ t: number }> = ({ t }) => {
  const panel = usePop(t, C.audioWord - 0.3, { damping: 14, stiffness: 150, mass: 0.75 });
  const res = usePop(t, C.result, { damping: 12, stiffness: 190, mass: 0.7 });
  if (t < C.s5Say || t >= END_S5) return null;
  const inputs = t < 38.5;
  const grow = range(t, 38.3, 38.75);
  const wipe = range(t, C.codeWord + 0.1, C.codeWord + 0.65);
  const filmAt = C.codeWord + 0.1;
  const cuts: [number, Shot][] = [];
  const order = [SHOTS.alex, SHOTS.sold, SHOTS.pixels, SHOTS.room, SHOTS.coins, SHOTS.clock, SHOTS.tiles, SHOTS.reward, SHOTS.bulb, SHOTS.cancel];
  order.forEach((s, i) => cuts.push([filmAt + i * 0.43, s]));
  const big: [number, Shot][] = [
    [C.result, SHOTS.homepage],
    [C.result + 0.58, SHOTS.double],
    [C.result + 1.1, SHOTS.sales],
  ];
  const beat = cuts.reduce((m, [at]) => Math.max(m, t >= at ? Math.exp(-(t - at) * 12) : 0), 0);
  const hold = range(t, C.raha, C.result);
  const out = range(t, END_S5 - 0.2, END_S5);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${out * -1160}px)` }}>
      {inputs && (
        <>
          <InputCard t={t} at={35.98} i={0} label="Script">
            <Img src={staticFile("secrets/screens/chatgpt.jpg")} style={{ position: "absolute", left: 0, top: -30, width: 420 }} />
          </InputCard>
          <InputCard t={t} at={C.audioWord} i={1} label="Voice">
            <div style={{ position: "absolute", left: 16, top: 52 }}>
              <Wave env={ep.env} bars={22} w={230} h={136} k={1} played={P.ink} />
            </div>
          </InputCard>
          <InputCard t={t} at={C.boardWord} i={2} label="Storyboard">
            <div style={{ padding: "12px 12px", fontFamily: mono, fontWeight: 600, fontSize: 19, lineHeight: 1.75, color: P.ink }}>
              {BOARD.map((b) => (
                <div key={b} style={{ whiteSpace: "nowrap" }}>
                  {b}
                </div>
              ))}
            </div>
          </InputCard>
        </>
      )}
      {t >= C.audioWord - 0.3 && t < C.result && (
        <ScreenFrame
          w={STAGE.w}
          h={280 + (STAGE.h - 280) * grow}
          dark
          style={{ left: STAGE.x, top: 842 + (STAGE.y - 842) * grow, transform: `scale(${(1 + 0.04 * beat) * (1 - 0.1 * hold)})`, opacity: Math.min(1, panel * 2), filter: hold > 0 ? `brightness(${1 - 0.55 * hold})` : undefined }}
        >
          <Img src={staticFile("secrets/screens/claude-build.png")} style={{ position: "absolute", left: 0, top: 0, width: 860 }} />
          {wipe > 0 && (
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` }}>
              <Footage t={t} w={860} h={614} cuts={cuts} end={C.result} push={0.12} />
            </div>
          )}
          {wipe > 0 && wipe < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${wipe * 100}%`, width: 10, background: P.lime, boxShadow: `0 0 30px ${P.lime}` }} />}
          {!wipe && <RealTag text="Real Claude Code" />}
        </ScreenFrame>
      )}
      <Highlight t={t} at={C.scenesWord} out={C.raha} lines={["ANIMATED", "SCENES"]} size={58} x={700} y={1380} />
      <Highlight t={t} at={C.cameraMoveWord} out={C.raha} lines={["CAMERA MOVEMENT"]} size={46} x={716} y={1510} />
      {t >= C.result && (
        <>
          <div style={{ position: "absolute", left: 0, top: 322, width: 1080, height: 800, overflow: "hidden", borderTop: `6px solid ${P.lime}`, borderBottom: `6px solid ${P.lime}`, transform: `scale(${1.3 - 0.3 * Math.min(1, res)})` }}>
            <Footage t={t} w={1080} h={790} cuts={big} end={END_S5} push={0.05} />
          </div>
          <div style={{ position: "absolute", inset: 0, background: P.lime, opacity: Math.max(0, 0.85 - (t - C.result) * 4.5) }} />
          <StampWords t={t} at={C.result + 0.08} out={END_S5} x={540} y={965} size={82} rotate={-2.5} lines={["FROM VOICE TO", "CINEMATIC VIDEO!"]} />
          <Highlight t={t} at={C.result + 0.3} out={END_S5} lines={["FINAL REEL"]} size={64} x={700} y={1430} />
        </>
      )}
    </div>
  );
};

const CheckTick: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 240, mass: 0.6 });
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 84, height: 84, borderRadius: 84, background: P.lime, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(-50%, -50%) scale(${p})`, ...type.display, fontSize: 52, color: P.ink }}>✓</div>
  );
};

const FrameCard: React.FC<{ src: string; left: number; label: string; tone: string; fg: string; t: number; at: number; children?: React.ReactNode }> = ({ src, left, label, tone, fg, t, at, children }) => {
  const p = usePop(t, at, { damping: 12, stiffness: 190, mass: 0.7 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left, top: 14, width: 415, height: 586, boxSizing: "border-box", borderRadius: 20, border: `5px solid ${P.ink}`, overflow: "hidden", background: P.paper, transform: `scale(${p})` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: -92, width: 405 }} />
      {children}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: tone, borderTop: `4px solid ${P.ink}`, ...type.label, fontSize: 26, letterSpacing: "0.03em", color: fg, textAlign: "center", padding: "7px 0" }}>{label}</div>
    </div>
  );
};

/** Step 6: the real check sheet, a real mistake and its real fix from the Google reel, then the real render. */
export const Step6: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.s6 - 0.16, END_S6);
  const errAt = C.fixWord - 0.72;
  const ring = usePop(t, errAt + 0.2, { damping: 11, stiffness: 200, mass: 0.6 });
  if (!on) return null;
  const sheet = t < errAt;
  const rendering = t >= C.renderSay;
  const k = clamp01((t - C.renderSay) / (C.renderWord + 0.34 - C.renderSay));
  const frames = Math.round(k * 2618);
  const done = k >= 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o }}>
      <ScreenFrame w={STAGE.w} h={STAGE.h} bg={P.paper2} style={{ left: STAGE.x, top: STAGE.y, transform: `scale(${2.2 - 1.2 * p}) translateY(${o * -60}px)`, opacity: Math.min(1, p * 3) }}>
        {sheet && (
          <>
            <ScreenShot
              t={t}
              src="secrets/screens/check-sheet.png"
              picW={1080}
              cam={[
                [C.s6, 0, 0, 0.8],
                [C.checkWord, 0, 0, 0.8],
                [errAt, 0, 60, 0.8],
              ]}
            />
            <CheckTick t={t} at={C.checkWord + 0.12} x={144} y={190} />
            <CheckTick t={t} at={C.checkWord + 0.42} x={432} y={190} />
            <CheckTick t={t} at={C.checkWord + 0.72} x={720} y={190} />
            <RealTag text="Real check sheet" />
          </>
        )}
        {!sheet && !rendering && (
          <>
            <FrameCard src="secrets/screens/before.png" left={14} label="Text on face" tone={P.pink} fg={P.ink} t={t} at={errAt}>
              {ring > 0 && <div style={{ position: "absolute", left: 40, top: 134, width: 214, height: 214, boxSizing: "border-box", borderRadius: 214, border: `7px solid ${P.pink}`, boxShadow: `0 0 0 3px ${P.ink}`, transform: `scale(${1.4 - 0.4 * Math.min(1, ring)})` }} />}
            </FrameCard>
            <FrameCard src="secrets/screens/after.png" left={441} label="Fixed" tone={P.lime} fg={P.ink} t={t} at={C.fixWord} />
          </>
        )}
        {rendering && (
          <div style={{ position: "absolute", inset: 0, background: P.ink, padding: "54px 44px" }}>
            <div style={{ ...type.label, fontSize: 28, letterSpacing: "0.06em", color: P.lime }}>{done ? "Render finished" : "Rendering"}</div>
            <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 64, color: P.card, marginTop: 14 }}>{frames}/2618</div>
            <div style={{ height: 44, marginTop: 28, borderRadius: 44, border: `4px solid ${P.card}`, overflow: "hidden" }}>
              <div style={{ width: `${k * 100}%`, height: "100%", background: P.lime }} />
            </div>
            {k > 0.6 && (
              <div style={{ marginTop: 42 }}>
                <FileChip dark text="internet-toolbox-google-domain-v2.mp4" style={{ fontSize: 31, display: "inline-block" }} />
                <div style={{ fontFamily: mono, fontWeight: 500, fontSize: 30, color: P.lineStrong, marginTop: 20 }}>1080 x 1920 · 30 fps · 26.8 MB</div>
              </div>
            )}
          </div>
        )}
      </ScreenFrame>
      <CheckFixRender t={t} />
      {t >= C.renderWord + 0.34 && t < C.renderWord + 0.9 && <Burst t={t} at={C.renderWord + 0.34} x={515} y={STAGE.y + 300} color={P.lime} />}
    </div>
  );
};

const CheckFixRender: React.FC<{ t: number }> = ({ t }) => {
  const parts: [string, number][] = [
    ["CHECK.", C.checkWord],
    ["FIX.", C.fixWord],
    ["RENDER.", C.renderWord],
  ];
  return (
    <div style={{ position: "absolute", left: 480, top: 1330, width: 470, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
      {parts.map(([w, at], i) =>
        t >= at ? (
          <div key={w} style={{ marginLeft: i * 34 }}>
            <PopTag t={t} at={at} text={w} />
          </div>
        ) : null,
      )}
    </div>
  );
};

const PopTag: React.FC<{ t: number; at: number; text: string }> = ({ t, at, text }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 230, mass: 0.6 });
  return (
    <Sticker size={50} rotate={-2} pop={p}>
      {text}
    </Sticker>
  );
};

/** The honest line, then the fast recap: not one magic prompt, six steps with planning and editing. */
export const NotMagic: React.FC<{ t: number }> = ({ t }) => {
  const out = C.pdfAt;
  const { p, o, on } = useSpan(t, C.lekin - 0.08, out);
  const stamp = usePop(t, 52.5, { damping: 8, stiffness: 240, mass: 0.6 });
  const recap = usePop(t, 51.2, { damping: 15, stiffness: 150, mass: 0.75 });
  if (!on) return null;
  const press = t >= C.magicWord + 0.2 && t < C.magicWord + 0.34 ? 0.92 : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o, transform: `translateY(${o * -80}px)` }}>
      <div style={{ position: "absolute", left: 80, top: 342, width: 870, height: 214, display: "flex", justifyContent: "center", alignItems: "center", transform: `scale(${p})` }}>
        <div style={{ ...type.display, fontSize: 84, color: P.ink, background: P.lime, border: `6px solid ${P.ink}`, borderRadius: 34, boxShadow: shadow.hard(10), padding: "16px 64px 24px", transform: `scale(${press})`, filter: stamp > 0 ? "grayscale(0.85)" : undefined }}>Make Reel</div>
        {stamp > 0 && (
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) rotate(-7deg) scale(${(1.8 - 0.8 * Math.min(1, stamp)) * 1})`, border: `8px solid ${P.pink}`, color: P.ink, background: "rgba(255,255,255,0.96)", borderRadius: 16, padding: "4px 26px", ...type.label, letterSpacing: "0.02em", fontSize: 52, whiteSpace: "nowrap" }}>Not a magic prompt</div>
        )}
      </div>
      <TapPointer t={t} from={[860, 720]} to={[560, 470]} at={C.magicWord - 0.45} tapAt={C.magicWord + 0.2} />
      <div style={{ position: "absolute", left: 80, top: 590, width: 870, height: 520, boxSizing: "border-box", borderRadius: 26, border: `5px solid ${P.ink}`, background: P.card, boxShadow: shadow.hard(9), padding: "20px 30px", opacity: recap > 0 ? 1 : 0, transform: `translateY(${(1 - recap) * 640}px)` }}>
        <div style={{ ...type.display, fontSize: 66, color: P.ink, marginBottom: 16 }}>
          6 steps<span style={{ color: P.olive }}>, real work</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 26px" }}>
          {STEPS.map((s, i) => (
            <RecapRow key={s} t={t} i={i} label={s} />
          ))}
        </div>
      </div>
      <Highlight t={t} at={C.planningWord} out={out} lines={["PLANNING"]} size={56} x={700} y={1370} />
      <Highlight t={t} at={C.editingWord} out={out} lines={["+ EDITING"]} size={56} x={724} y={1490} tone="ink" />
    </div>
  );
};

const RecapRow: React.FC<{ t: number; i: number; label: string }> = ({ t, i, label }) => {
  const at = 53.5 + i * 0.3;
  const p = usePop(t, at, { damping: 9, stiffness: 240, mass: 0.6 });
  const done = t >= at;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 110, boxSizing: "border-box", borderRadius: 18, border: `4px solid ${P.ink}`, background: done ? P.limeSoft : P.paper2, padding: "0 16px" }}>
      <div style={{ ...type.display, fontSize: 48, color: P.ink, width: 66 }}>0{i + 1}</div>
      <div style={{ flex: 1, ...type.display, letterSpacing: "-0.02em", fontSize: 40, color: P.ink }}>{label}</div>
      <div style={{ width: 54, height: 54, borderRadius: 54, background: P.lime, border: `4px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})`, ...type.display, fontSize: 34, color: P.ink }}>✓</div>
    </div>
  );
};

const PAGE_W = 470;
const PAGE_H = 665;

const Page: React.FC<{ n: number; rot: number; dx: number; dy: number; k: number; clip?: string }> = ({ n, rot, dx, dy, k, clip }) => (
  <div style={{ position: "absolute", left: 104, top: 346, width: PAGE_W, height: PAGE_H, transformOrigin: "50% 100%", transform: `translate(${dx * k}px, ${dy * k}px) rotate(${rot * k}deg)`, boxShadow: shadow.soft, borderRadius: 10, clipPath: clip }}>
    <Img src={staticFile(`secrets/screens/pdf-${n}.png`)} style={{ width: "100%", height: "100%", borderRadius: 10, border: `3px solid ${P.ink}`, boxSizing: "border-box", display: "block" }} />
  </div>
);

/** The real free PDF: the cover lands, the inner pages fan out, and the three promises land on their words. */
export const PdfReveal: React.FC<{ t: number }> = ({ t }) => {
  const { p, o, on } = useSpan(t, C.pdfAt, C.wantAt + 0.1);
  const k2 = usePop(t, C.workflowWord, { damping: 13, stiffness: 170, mass: 0.7 });
  const k3 = usePop(t, C.promptsWord, { damping: 13, stiffness: 170, mass: 0.7 });
  const k4 = usePop(t, C.checklistWord, { damping: 13, stiffness: 170, mass: 0.7 });
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o, transform: `translateY(${(1 - p) * 1000}px) scale(${1 - 0.35 * o})` }}>
      <Page n={4} rot={15} dx={120} dy={-6} k={k4} clip="inset(0 0 11% 0)" />
      <Page n={3} rot={10} dx={84} dy={-4} k={k3} />
      <Page n={2} rot={5} dx={44} dy={-2} k={k2} />
      <Page n={1} rot={0} dx={0} dy={0} k={1} />
      <Highlight t={t} at={C.workflowWord} out={C.wantAt + 0.1} lines={["6-STEP", "WORKFLOW"]} size={50} x={752} y={486} />
      <Highlight t={t} at={C.promptsWord} out={C.wantAt + 0.1} lines={["3 COPY-PASTE", "PROMPTS"]} size={46} x={748} y={684} tone="ink" />
      <Highlight t={t} at={C.checklistWord} out={C.wantAt + 0.1} lines={["FINAL VIDEO", "CHECKLIST"]} size={48} x={752} y={882} />
      <StampWords t={t} at={C.freeWord} out={C.wantAt + 0.1} x={330} y={1040} size={84} rotate={-5} lines={["FREE PDF"]} />
    </div>
  );
};

/** "Tumhe bhi banani hai aisi Reels?": three real reels side by side. */
export const WantThese: React.FC<{ t: number }> = ({ t }) => {
  const { o, on } = useSpan(t, C.wantAt, C.ctaAt);
  if (!on) return null;
  const list: [Shot, number, number][] = [
    [SHOTS.reward, -3, 0],
    [SHOTS.coins, 0, 0.14],
    [SHOTS.room, 3, 0.28],
  ];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o }}>
      {list.map(([s, rot, delay], i) => (
        <ReelCard key={i} t={t} s={s} rot={rot} delay={delay} i={i} />
      ))}
    </div>
  );
};

const ReelCard: React.FC<{ t: number; s: Shot; rot: number; delay: number; i: number }> = ({ t, s, rot, delay, i }) => {
  const p = usePop(t, C.wantAt + delay, { damping: 12, stiffness: 180, mass: 0.7 });
  if (p <= 0) return null;
  return (
    <ScreenFrame w={282} h={510} style={{ left: 76 + i * 292, top: 480, transform: `translateY(${(1 - p) * 900}px) rotate(${rot}deg)` }}>
      <Footage t={t} w={272} h={500} cuts={[[C.wantAt + delay, s]]} end={C.ctaAt} push={0} full />
    </ScreenFrame>
  );
};

/** The PDF beside the presenter, from "Tumhe bhi" to the end of the call to action. */
export const HeldPdf: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, C.ctaAt, { damping: 12, stiffness: 170, mass: 0.7 });
  const o = range(t, C.outroAt - 0.18, C.outroAt);
  if (t < C.ctaAt || o >= 1) return null;
  const bob = 7 * Math.sin(t * 3);
  return (
    <div style={{ position: "absolute", left: 494, top: 1250 + bob, width: 226, height: 320, transform: `scale(${p * (1 - 0.3 * o)}) rotate(5deg)`, opacity: 1 - o }}>
      <Img src={staticFile("secrets/screens/pdf-1.png")} style={{ width: "100%", height: "100%", borderRadius: 8, border: `4px solid ${P.ink}`, boxSizing: "border-box", boxShadow: shadow.hard(7) }} />
    </div>
  );
};

/** "COMMENT REEL": the keyword is the biggest thing in the reel. The DM is sent by hand, so no fake inbox here. */
export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const { o, on } = useSpan(t, C.ctaAt, C.outroAt);
  const reel = usePop(t, C.commentWord, { damping: 8, stiffness: 220, mass: 0.7 });
  const top = usePop(t, C.ctaAt, { damping: 11, stiffness: 200, mass: 0.65 });
  const dm = usePop(t, C.dmAt, { damping: 9, stiffness: 220, mass: 0.6 });
  if (!on) return null;
  const pulse = 1 + 0.025 * Math.sin(t * 7);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: 1 - o, transform: `translateY(${o * -70}px)` }}>
      <div style={{ position: "absolute", left: 0, width: 1030, top: 326, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ transform: `scale(${top})` }}>
          <Sticker size={74} tone="ink" rotate={-2}>
            COMMENT
          </Sticker>
        </div>
        <div style={{ marginTop: 12, transform: `scale(${(2 - Math.min(1, reel)) * pulse})`, opacity: Math.min(1, reel * 2) }}>
          <Sticker size={170} tone="lime" rotate={-2}>
            REEL
          </Sticker>
        </div>
      </div>
      <CommentCard t={t} at={C.ctaAt + 0.2} keyword="REEL" typeAt={C.reelWord - 0.2} typeTo={C.reelWord + 0.3} sendAt={C.reelWord + 0.5} top={668} />
      {dm > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1030, top: 812, display: "flex", justifyContent: "center", transform: `scale(${dm})` }}>
          <Sticker size={58} tone="lime" rotate={1.5}>
            GET THE FREE PDF IN DM
          </Sticker>
        </div>
      )}
    </div>
  );
};

/** The approved outro: logo, handle, and the Follow button that never claims a follow. */
export const Outro: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, C.outroAt, { damping: 11, stiffness: 180, mass: 0.7 });
  const h = usePop(t, C.followWord, { damping: 9, stiffness: 220, mass: 0.6 });
  if (t < C.outroAt) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      <div style={{ position: "absolute", left: 0, width: 1030, top: 380, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${p})` }}>
        <BrandMark size={150} />
        <div style={{ ...type.display, fontSize: 104, color: P.ink, marginTop: 22 }}>Internet Toolbox</div>
        <div style={{ ...type.label, fontSize: 34, letterSpacing: "0.1em", color: P.olive, marginTop: 14 }}>Comment REEL for the free PDF</div>
      </div>
      <StampWords t={t} at={C.outroAt + 0.8} out={C.followWord} x={515} y={820} size={84} rotate={-3} lines={["AI TRICKS"]} />
      {h > 0 && (
        <div style={{ position: "absolute", left: 0, width: 1030, top: 762, display: "flex", justifyContent: "center", transform: `scale(${h})` }}>
          <Sticker size={56} tone="lime" rotate={-2}>
            FOLLOW @INTERNETOOLBOX
          </Sticker>
        </div>
      )}
      <FollowButton t={t} at={C.followWord + 0.1} tapAt={C.followWord + 0.92} top={930} invite />
    </div>
  );
};
