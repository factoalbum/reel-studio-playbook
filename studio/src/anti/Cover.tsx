import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, type } from "../brand";
import { anti as ep } from "../episodes/anti";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { Logo } from "../agent/Scenes";
import { Tile } from "./Scenes";

/**
 * Instagram cover: "₹2,000 FOR REEL EDITING?!" / "TRY GOOGLE ANTIGRAVITY", the presenter, the official Claude and
 * Antigravity logos, a real reel of ours as the editing preview. "Free tier · limits apply" is on the cover, so it
 * never reads as unlimited. Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverAnti: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...type.display, fontSize: 230, lineHeight: 1, color: P.ink, letterSpacing: "-0.05em", textShadow: `10px 10px 0 ${P.lime}`, whiteSpace: "nowrap" }}>₹2,000</div>
      <div style={{ ...type.display, fontSize: 92, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 32, padding: "8px 30px 18px", boxShadow: shadow.hard(12), letterSpacing: "-0.04em", whiteSpace: "nowrap", transform: "rotate(-2deg)" }}>FOR REEL EDITING?!</div>
    </div>
    <div style={{ ...centre(540, 835, 1, "rotate(1.5deg)") }}>
      <Chip text="TRY GOOGLE ANTIGRAVITY" size={54} tone="ink" />
    </div>
    <div style={{ ...centre(300, 1030, 1, "rotate(-6deg)") }}>
      <Logo app="claude" size={180} />
    </div>
    <div style={{ ...centre(540, 1030, 1), ...type.display, fontSize: 70, color: P.ink3 }}>vs</div>
    <div style={{ ...centre(780, 1030, 1, "rotate(6deg)") }}>
      <Tile app="antigravity" size={200} glow={0.6} />
    </div>
    <div style={{ ...centre(820, 1400, 1, "rotate(5deg)") }}>
      <Img src={staticFile("anti/prev-reel.png")} style={{ width: 250, height: 444, objectFit: "cover", borderRadius: 22, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(10), display: "block" }} />
    </div>
    <div style={{ ...centre(800, 1655, 1, "rotate(-3deg)") }}>
      <Chip text="FREE TIER · LIMITS APPLY" size={32} tone="lime" />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.4, -0.7] }]} places={[{ at: -2, x: 300, y: 1450, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
