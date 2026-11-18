import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { BrandMark } from "../brand/Chrome";
import { HEIGHT, LAYOUT, SAFE, WIDTH, type } from "../brand/tokens";
import { Buddy3D, CameraRig, DeskSet, Lights, Mascot3D, Phone, RISER, RISER_TOP, RoomSet, type BuddyPose, type Cam, type MascotPose, type V3 } from "./kit3d";

export const MASCOT_POS: V3 = [0.2, 0, -0.95];
export const BUDDY_POS: V3 = [RISER[0], RISER_TOP, RISER[2]];

/** night: 0 day .. 1 (3 AM, dimmer warm key, stronger neon). propPhone: a phone leaning in front of Claude. */
export type Shot = { cam: Cam; mascot: MascotPose; buddy: BuddyPose; blur?: number; night?: number; propPhone?: boolean };

/** A phone propped against Claude's coaster, screen towards Claude. */
const PropPhone: React.FC = () => (
  <group position={[BUDDY_POS[0] + 0.34, BUDDY_POS[1] + 0.2, BUDDY_POS[2] + 0.22]} rotation={[0.25, -0.75, 0]}>
    <Phone glow={1} />
    <pointLight position={[0, 0.05, -0.25]} color="#CFE3FF" intensity={0.6} distance={1.4} decay={1.4} />
  </group>
);

/**
 * One film frame: the room on a blurred layer (cheap depth of field), the desk and the two characters sharp on top.
 * Both layers use the same camera.
 */
export const Stage: React.FC<{ shot: Shot }> = ({ shot }) => (
  <AbsoluteFill style={{ background: "linear-gradient(#1A2236, #2E3F5E 55%, #1A2236)" }}>
    <AbsoluteFill style={{ filter: `blur(${shot.blur ?? 9}px)`, transform: "scale(1.05)" }}>
      <ThreeCanvas width={WIDTH} height={HEIGHT}>
        <CameraRig cam={shot.cam} />
        <Lights shadows={false} warm={1 - 0.45 * (shot.night ?? 0)} />
        <RoomSet neon={1 + 0.4 * (shot.night ?? 0)} />
      </ThreeCanvas>
    </AbsoluteFill>
    <AbsoluteFill>
      <ThreeCanvas width={WIDTH} height={HEIGHT} shadows>
        <CameraRig cam={shot.cam} />
        <Lights warm={1 - 0.45 * (shot.night ?? 0)} />
        <DeskSet />
        {shot.propPhone && <PropPhone />}
        <Mascot3D pos={MASCOT_POS} pose={shot.mascot} />
        <Buddy3D pos={BUDDY_POS} pose={shot.buddy} />
      </ThreeCanvas>
    </AbsoluteFill>
    {/* Night: a blue wash over everything. */}
    <AbsoluteFill style={{ background: "#0B1430", opacity: 0.28 * (shot.night ?? 0), mixBlendMode: "multiply" }} />
    {/* Soft vignette, so the eye stays on the characters. */}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(8,10,18,0.5) 100%)" }} />
  </AbsoluteFill>
);

/** Logo and name for dark film frames. */
export const BrandBugLight: React.FC = () => (
  <div style={{ position: "absolute", left: SAFE.left, top: LAYOUT.brandTop, display: "flex", alignItems: "center", gap: 14 }}>
    <BrandMark size={50} />
    <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 30, color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}>Internet Toolbox</div>
  </div>
);
