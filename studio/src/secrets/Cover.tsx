import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, palette as P, shadow, Sticker, type } from "../brand";
import { secrets as ep } from "../episodes/secrets";

/**
 * Instagram cover for Creator Secrets #01: "AI REELS IN 6 STEPS?!" over a real frame from the Google reel, presenter in shock.
 * Render a late frame (e.g. --frame=60) so the springs have settled. Everything important sits inside
 * the 3:4 grid crop (y 240 to 1680).
 */
export const CoverSecrets: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 90, top: 760, width: 900, height: 600, borderRadius: 30, border: `6px solid ${P.ink}`, boxShadow: shadow.soft, overflow: "hidden", transform: "rotate(-2deg)" }}>
      <Img src={staticFile("secrets/screens/room-frame.png")} style={{ position: "absolute", left: 0, top: -268, width: 890 }} />
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 268, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...type.label, fontSize: 30, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "8px 24px", marginBottom: 22 }}>Creator Secrets #01</div>
      <Sticker size={150} tone="lime" rotate={-3}>
        AI REELS
      </Sticker>
      <div style={{ marginTop: 18 }}>
        <Sticker size={112} tone="ink" rotate={2}>
          IN 6 STEPS?!
        </Sticker>
      </div>
    </div>
    <Avatar keys={[{ at: 0, pose: "surprised", expr: "surprised", look: [0, -0.3] }]} places={[{ at: 0, x: 540, y: 1240, s: 0.86 }]} env={ep.env.map(() => 0)} blinks={[]} />
  </AbsoluteFill>
);
