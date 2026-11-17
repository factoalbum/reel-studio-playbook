import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { palette as P, SAFE, shadow, type } from "../brand/tokens";
import { PHONE_L, REST_L, REST_R } from "./kit3d";
import { BrandBugLight, Stage, type Shot } from "./Stage";

/** Where the subtitle card sits in the film frames: on the desk, under the characters, inside the safe zone. */
export const SKIT_CAPTION_TOP = 1466;

/** Look test for the 3D desk skit: one frame per camera setup. */
export const LOOK_SHOTS: (Shot & { line: string; hi: string[] })[] = [
  {
    // 0. Wide: the whole desk.
    cam: { pos: [0, 1.25, 5.35], look: [-0.05, 0.9, -0.7], fov: 30 },
    mascot: { handL: PHONE_L, phone: 0.5, phoneHand: "L", gaze: [-0.25, -0.7], pitch: 0.12, yaw: -0.12, smile: 0.7 },
    buddy: { yaw: 0.45, gaze: [0.8, 0.5], eye: 1 },
    line: "Claude! Ye reel dekh.",
    hi: ["Claude!", "reel"],
  },
  {
    // 1. Close on the mascot, talking to Claude.
    cam: { pos: [-0.4, 1.4, 2.9], look: [0.22, 1.12, -0.95], fov: 30 },
    mascot: { handL: [-0.36, 0.86, 0.42], phone: 0.25, phoneHand: "L", phoneYaw: 0.5, gaze: [-0.6, -0.3], yaw: -0.3, mouth: 0.7, brow: 0.7, wide: 0.5, smile: 0.8 },
    buddy: { yaw: 0.45, gaze: [0.8, 0.5] },
    line: "Itni viral kyun hui?",
    hi: ["viral"],
  },
  {
    // 2. Close on Claude, spark lit.
    cam: { pos: [0.35, 1.0, 2.25], look: [-0.48, 0.82, -0.45], fov: 28 },
    mascot: {},
    buddy: { yaw: 0.3, eye: 1.25, mouth: 0.65, spark: 1, stretch: 1.07, spin: 0.2 },
    line: "Dikh gaya! 87 screenshots!",
    hi: ["Dikh", "87"],
  },
  {
    // 3. Two-shot: the mascot surprised, Claude pleased.
    cam: { pos: [0.55, 1.15, 3.9], look: [-0.1, 0.9, -0.7], fov: 31 },
    mascot: { handL: REST_L, handR: REST_R, yaw: -0.5, gaze: [-0.8, -0.45], brow: 1, wide: 1, mouth: 0.4, smile: 0.2, roll: -0.06 },
    buddy: { yaw: 0.1, mood: 1, eye: 1, spark: 0.6, mouth: 0.1 },
    line: "Screenshots? Video nahi?",
    hi: ["Screenshots?"],
  },
  {
    // 4. Ending: both look at the viewer.
    cam: { pos: [0, 1.22, 4.7], look: [-0.05, 0.9, -0.7], fov: 30 },
    mascot: { handL: REST_L, handR: [0.66, 1.02, 0.3], smile: 1, mouth: 0.5, brow: 0.5, gaze: [0, 0] },
    buddy: { yaw: 0, eye: 1, mood: 1, spark: 1, mouth: 0.3 },
    line: "Comment karo WATCH!",
    hi: ["WATCH!"],
  },
];

export const LookSkit: React.FC = () => {
  const frame = useCurrentFrame();
  const s = LOOK_SHOTS[Math.min(LOOK_SHOTS.length - 1, frame)];
  return (
    <AbsoluteFill>
      <Stage shot={s} />
      <BrandBugLight />
      {/* Sample subtitle in the series style. */}
      <div style={{ position: "absolute", left: SAFE.left, width: SAFE.right - SAFE.left, top: SKIT_CAPTION_TOP, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", columnGap: 16, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 22, boxShadow: shadow.hard(7), padding: "9px 24px 13px", ...type.display, fontSize: 62, color: P.ink }}>
          {s.line.split(" ").map((w, i) => (
            <span key={i} style={s.hi.includes(w) ? { background: P.lime, borderRadius: 8, padding: "0 6px", margin: "0 -6px" } : undefined}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
