import React from "react";
import { AbsoluteFill } from "remotion";
import { type } from "../brand/tokens";
import { PHONE_L } from "./kit3d";
import { BrandBugLight, Stage } from "./Stage";

/** Cover: 3 AM, Claude hooked on reels, the mascot holding the phone. Title inside the 3:4 crop (y 240 to 1680). */
export const CoverWatch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#141B2E" }}>
    <Stage
      shot={{
        cam: { pos: [0.3, 1.05, 4.9], look: [-0.1, 0.92, -0.7], fov: 30 },
        night: 1,
        mascot: { yaw: -0.38, gaze: [-0.8, -0.35], handL: PHONE_L, phone: 0.5, phoneHand: "L", brow: -0.3, browTilt: -0.6, blink: 0.35, mouth: 0.3 },
        buddy: { yaw: 0.4, gaze: [0.8, 0.5], eye: 1.35, stretch: 1.1, mood: 0.8, spark: 1, spin: 0.3 },
      }}
    />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 300, display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-2deg)" }}>
      <div style={{ ...type.display, fontSize: 110, color: "#FFFFFF", WebkitTextStroke: "3px #171717", textShadow: "7px 7px 0 #171717" }}>CLAUDE KO</div>
      <div style={{ ...type.display, fontSize: 120, color: "#171717", background: "#C8F169", border: "6px solid #171717", borderRadius: 24, padding: "4px 30px 14px", boxShadow: "9px 9px 0 #171717", marginTop: 12 }}>REELS KI LAT 😳</div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1400, display: "flex", justifyContent: "center" }}>
      <div style={{ ...type.display, fontSize: 52, color: "#FFFFFF", background: "rgba(20,26,44,0.92)", border: "4px solid rgba(255,255,255,0.2)", borderRadius: 18, padding: "10px 26px" }}>
        🕒 3:00 AM · <span style={{ color: "#C8F169" }}>"Bas ek aur"</span>
      </div>
    </div>
    <BrandBugLight />
  </AbsoluteFill>
);
