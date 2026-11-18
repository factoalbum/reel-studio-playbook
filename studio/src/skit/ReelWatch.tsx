import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ProgressBar, ReelAudio, Subtitles } from "../brand";
import { type } from "../brand/tokens";
import { C, LINES, watch as ep } from "../episodes/watch";
import { lerp, seg } from "../mdh/kit";
import { TimeSkip, Inserts } from "./Inserts";
import { PHONE_L, REST_L, REST_R, type Cam, type MascotPose, type BuddyPose, type V3 } from "./kit3d";
import { SKIT_CAPTION_TOP } from "./LookSkit";
import { BrandBugLight, Stage, type Shot } from "./Stage";

/**
 * "Claude watches reels": the 3D desk skit (keyword WATCH). The owner's script, two Gemini voices
 * (You = Puck, Claude = Charon). Hard cuts on each line, a slow push inside every shot, 2D story inserts on top.
 */

const WIDE: Cam = { pos: [0, 1.25, 5.35], look: [-0.05, 0.9, -0.7], fov: 30 };
const END: Cam = { pos: [0, 1.22, 4.7], look: [-0.05, 0.9, -0.7], fov: 30 };
const MCU: Cam = { pos: [-0.4, 1.4, 2.9], look: [0.22, 1.12, -0.95], fov: 30 };
const CCU: Cam = { pos: [0.35, 1.0, 2.25], look: [-0.48, 0.82, -0.45], fov: 28 };
const TWO: Cam = { pos: [0.55, 1.15, 3.9], look: [-0.1, 0.9, -0.7], fov: 31 };

/** Move the camera k of the way towards what it looks at (a slow push-in). */
const push = (c: Cam, k: number): Cam => ({
  ...c,
  pos: [lerp(c.pos[0], c.look[0], k), lerp(c.pos[1], c.look[1], k), lerp(c.pos[2], c.look[2], k)] as V3,
});

type Beat = { from: number; cam: Cam; push?: number; night?: number; prop?: boolean; m: (t: number) => MascotPose; b: (t: number) => BuddyPose };

const wob = (t: number, f = 2.2, a = 1) => Math.sin(t * f) * a;
const toClaude: MascotPose = { yaw: -0.38, gaze: [-0.8, -0.35] };
const toMascot: BuddyPose = { yaw: 0.45, gaze: [0.8, 0.45] };

const BEATS: Beat[] = [
  // 1. "Claude, ye reel dekh."
  { from: 0, cam: WIDE, push: 0.12, m: (t) => ({ ...toClaude, handL: PHONE_L, phone: 0.5, phoneHand: "L", smile: 0.8, brow: 0.5, wide: 0.3, bob: wob(t, 3, 0.01) }), b: () => ({ ...toMascot }) },
  // 2. "Main Instagram nahi khol sakta."
  { from: C.claudeNo, cam: CCU, push: 0.1, m: () => ({}), b: (t) => ({ yaw: 0.3 + (t > 4.3 && t < 5.3 ? Math.sin(t * 10) * 0.18 : 0), gaze: [0.4, 0.3], eye: 0.9, mood: -0.25 }) },
  // 3. "Ruk. Video file deta hoon. Ye plugin laga."
  { from: C.ruk, cam: TWO, push: 0.08, m: (t) => ({ ...toClaude, handL: REST_L, handR: [lerp(0.34, -0.05, seg(t, 6.4, 6.8)), lerp(0.075, 0.55, seg(t, 6.4, 6.8)), 0.55], brow: 0.6, smile: 0.5, wide: 0.2 }), b: () => ({ ...toMascot, eye: 1.05 }) },
  // 4. "Ab kya milega?"
  { from: C.kya, cam: CCU, push: 0.08, m: () => ({}), b: () => ({ yaw: 0.35, tilt: 0.2, gaze: [0.4, 0.85], eye: 1.15 }) },
  // 5. "Video ke frames aur jo bola, uska text."
  { from: C.frames, cam: TWO, push: 0.1, m: (t) => ({ ...toClaude, handL: [-0.25, 0.25 + Math.max(0, wob(t, 4, 0.12)), 0.6], handR: [0.3, 0.25 + Math.max(0, -wob(t, 4, 0.12)), 0.55], brow: 0.5, smile: 0.4 }), b: () => ({ ...toMascot, eye: 1.2, spark: 0.4 }) },
  // 6. "Achha, chachu cooker ki seeti pe naach rahe hain?"
  { from: C.achha, cam: CCU, push: 0.22, m: () => ({}), b: (t) => ({ yaw: 0.2, gaze: [Math.sin(t * 3) * 0.8, 0.25], eye: t > C.seeti + 0.4 ? 1.35 : 1.2, stretch: 1.04, spark: 1, spin: t * 0.8, hop: t > C.seeti + 0.4 && t < C.seeti + 0.9 ? 0.05 : 0 }) },
  // 7. "Haan. Beat pakad li."
  { from: C.haan, cam: MCU, push: 0.06, m: (t) => ({ yaw: -0.3, gaze: [-0.5, -0.3], smile: 1, brow: 0.7, wide: 0.3, bob: Math.abs(wob(t, 9, 0.025)), roll: wob(t, 4.5, 0.05) }), b: () => ({}) },
  // 8. "Cooker ne, ya chachu ne?"
  { from: C.cooker, cam: CCU, push: 0.08, m: () => ({}), b: (t) => ({ yaw: 0.25, tilt: t < C.ya ? -0.16 : 0.16, gaze: t < C.ya ? [-0.7, 0.1] : [0.7, 0.1], eye: 0.8, mood: 0 }) },
  // 9. "Tu analysis kar."
  { from: C.tu, cam: WIDE, push: 0.05, m: (t) => ({ yaw: 0.35, gaze: [0.6, -0.5], handR: [0.62, 0.9 + wob(t, 10, 0.06), 0.3], smile: 0.5, brow: 0.3 }), b: (t) => ({ ...toMascot, hop: Math.abs(wob(t, 9, 0.03)), spark: 0.8 }) },
  // 10. "Ek aur video de. Compare karna hai."
  { from: C.ekAur, cam: CCU, push: 0.12, m: () => ({}), b: (t) => ({ yaw: 0.3, gaze: [0.6, 0.5], hop: Math.abs(wob(t, 8, 0.045)), stretch: 1.1, eye: 1.3, mood: 0.6, spark: 1, spin: t }) },
  // 11. "Bas ek."
  { from: C.bas, cam: MCU, push: 0.05, m: () => ({ ...toClaude, handR: [0.5, 1.12, 0.38], brow: -0.4, browTilt: 0.7, smile: 0.1 }), b: () => ({}) },
  // Time jump (covered by the 2D card).
  { from: C.skip, cam: WIDE, night: 1, prop: true, m: () => ({ ...toClaude, blink: 0.4 }), b: () => ({ ...toMascot, spark: 1 }) },
  // 12. "Claude! Teen baj gaye. Analysis?"
  { from: C.night, cam: WIDE, push: 0.1, night: 1, prop: true, m: () => ({ ...toClaude, blink: 0.42, brow: -0.3, browTilt: -0.6, lean: 0.06 }), b: (t) => ({ yaw: 0.15, gaze: [0.6, -0.4], eye: 1.3, spark: 1, spin: t * 2, hop: Math.abs(wob(t, 12, 0.012)) }) },
  // 13. "Chachu ki shaadi wali video bhi bhej."
  { from: C.shaadi, cam: CCU, push: 0.14, night: 1, m: () => ({}), b: (t) => ({ yaw: 0.35, gaze: [0.7, 0.45], stretch: 1.12, eye: 1.35, mood: 0.8, hop: Math.abs(wob(t, 8, 0.04)), spark: 1, spin: t * 2 }) },
  // 14. "Phone wapas."
  { from: C.phone, cam: TWO, push: 0.06, night: 1, m: (t) => ({ ...toClaude, handL: t < C.phone + 0.35 ? [lerp(-0.22, -0.48, seg(t, C.phone, C.phone + 0.35)), lerp(0.075, 0.5, seg(t, C.phone, C.phone + 0.35)), 0.7] : PHONE_L, phone: t < C.phone + 0.35 ? null : 0.5, phoneHand: "L", brow: 0.2, browTilt: 0.9, smile: 0 }), b: () => ({ ...toMascot, eye: 1.1, mood: -0.3 }) },
  // 15. "Bas ek aur. Promise."
  { from: C.promise, cam: CCU, push: 0.1, night: 1, m: () => ({}), b: (t) => ({ yaw: 0.35, tilt: 0.12, gaze: [0.6, -0.3], eye: 0.8, mood: -1, stretch: 0.9 + wob(t, 3, 0.015), spark: 0.25 }) },
  // 16. CTA: both to camera.
  { from: C.cta, cam: END, push: 0.05, m: (t) => ({ handL: REST_L, handR: [0.66, 1.02 + wob(t, 8, 0.05), 0.3], smile: 1, brow: 0.5, gaze: [0, 0] }), b: () => ({ yaw: 0, eye: 1, mood: 1, spark: 1, gaze: [0, 0] }) },
];

/** Punch-in zooms on the jokes and a shake on "Phone wapas". */
const HITS: [number, number][] = [
  [0, 0.1],
  [C.seeti + 0.55, 0.08],
  [C.ya, 0.07],
  [C.bas + 0.2, 0.06],
  [C.teen, 0.07],
  [C.shaadi + 0.3, 0.06],
  [C.phone + 0.35, 0.09],
  [C.promise + 0.9, 0.06],
];
const punch = (t: number) => 1 + HITS.reduce((acc, [at, amt]) => (t >= at ? acc + amt * Math.exp(-(t - at) * 3.2) : acc), 0);
const shake = (t: number) => {
  const d = t - (C.phone + 0.35);
  return d >= 0 && d < 0.35 ? [Math.sin(d * 90) * 14 * (1 - d / 0.35), Math.cos(d * 70) * 10 * (1 - d / 0.35)] : [0, 0];
};

/** Hook title, visible from the very first frame. */
const Hook: React.FC<{ t: number }> = ({ t }) => {
  if (t > C.reel + 0.6) return null;
  const o = 1 - seg(t, C.reel + 0.35, C.reel + 0.6);
  const k = 1 + 0.18 * Math.exp(-t * 6);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 320, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${k}) rotate(${-2 + Math.sin(t * 5) * 0.8}deg)` }}>
      <div style={{ ...type.display, fontSize: 96, color: "#FFFFFF", WebkitTextStroke: "3px #171717", textShadow: "6px 6px 0 #171717" }}>CLAUDE KO</div>
      <div style={{ ...type.display, fontSize: 104, color: "#171717", background: "#C8F169", border: "5px solid #171717", borderRadius: 22, padding: "4px 26px 12px", boxShadow: "8px 8px 0 #171717", marginTop: 10 }}>REELS KI LAT 😳</div>
    </div>
  );
};

const speaking = (t: number) => LINES.find((l) => t >= l.a - 0.05 && t <= l.b + 0.08)?.who;

/** Blinks: mascot every ~3.2 s, Claude offset. */
const blink = (t: number, off: number) => {
  const p = (t + off) % 3.2;
  return p < 0.12 ? Math.sin((p / 0.12) * Math.PI) : 0;
};

export const ReelWatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const i = BEATS.reduce((k, bt, j) => (t >= bt.from ? j : k), 0);
  const beat = BEATS[i];
  const next = BEATS[i + 1]?.from ?? C.end;
  const k = seg(t, beat.from, next);
  const env = ep.env[Math.min(ep.env.length - 1, frame)] ?? 0;
  const who = speaking(t);
  const m = beat.m(t);
  const b = beat.b(t);
  const shot: Shot = {
    cam: push(beat.cam, (beat.push ?? 0) * k),
    night: beat.night ?? 0,
    propPhone: beat.prop,
    mascot: { ...m, mouth: who === "you" ? Math.min(1, env * 1.15) : 0, blink: Math.max(m.blink ?? 0, blink(t, 0)) },
    buddy: { ...b, mouth: who === "claude" ? Math.min(1, env * 1.2) : 0, eye: (b.eye ?? 1) * (1 - 0.9 * blink(t, 1.4)) },
  };
  const chip = who === "you" ? { label: "YOU", bg: "#C8F169", fg: "#171717" } : who === "claude" ? { label: "CLAUDE", bg: "#D97757", fg: "#FFFFFF" } : null;
  return (
    <AbsoluteFill style={{ backgroundColor: "#141B2E" }}>
      <AbsoluteFill style={{ transform: `translate(${shake(t)[0]}px, ${shake(t)[1]}px) scale(${punch(t)})`, transformOrigin: "50% 45%" }}>
        <Stage shot={shot} />
      </AbsoluteFill>
      <Hook t={t} />
      <Inserts t={t} />
      <TimeSkip t={t} />
      <BrandBugLight />
      {chip && t < C.skip - 0.1 + (t > C.night ? 99 : 0) && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: SKIT_CAPTION_TOP - 64, display: "flex", justifyContent: "center" }}>
          <div style={{ ...type.label, fontSize: 24, background: chip.bg, color: chip.fg, borderRadius: 12, padding: "6px 16px", border: "3px solid #171717" }}>{chip.label}</div>
        </div>
      )}
      <Subtitles captions={ep.captions} top={SKIT_CAPTION_TOP} />
      <ProgressBar />
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} musicLevel={0.28} />
    </AbsoluteFill>
  );
};
