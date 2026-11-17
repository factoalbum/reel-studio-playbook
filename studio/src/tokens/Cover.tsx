import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, type } from "../brand";
import { tokens as ep } from "../episodes/tokens";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { Tile } from "./Scenes";

/**
 * Instagram cover: "CLAUDE CODE" / "FREE MEIN?!", FreeLLMAPI and the free models it connects, the presenter. "Free
 * models, not the real Claude" is on the cover, so it never reads as free Claude. Everything important sits inside
 * the 3:4 grid crop (y 240 to 1680).
 */
export const CoverTokens: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ ...type.display, fontSize: 150, lineHeight: 1, color: P.ink, letterSpacing: "-0.05em", textShadow: `9px 9px 0 ${P.lime}`, whiteSpace: "nowrap" }}>CLAUDE CODE</div>
      <div style={{ ...type.display, fontSize: 120, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 32, padding: "6px 36px 18px", boxShadow: shadow.hard(12), letterSpacing: "-0.04em", whiteSpace: "nowrap", transform: "rotate(-2deg)" }}>FREE MEIN?!</div>
    </div>
    <div style={{ ...centre(540, 850, 1, "rotate(1.5deg)") }}>
      <Chip text="FreeLLMAPI · OPEN-SOURCE" size={50} tone="ink" />
    </div>
    <div style={{ ...centre(270, 1060, 1, "rotate(-6deg)") }}>
      <Tile app="claudecode" size={190} />
    </div>
    <div style={{ ...centre(470, 1060, 1), ...type.display, fontSize: 80, color: P.ink }}>+</div>
    <div style={{ ...centre(640, 1040, 1, "rotate(4deg)") }}>
      <Tile app="gemini" size={130} />
    </div>
    <div style={{ ...centre(800, 1090, 1, "rotate(-3deg)") }}>
      <Tile app="qwen" size={130} />
    </div>
    <div style={{ ...centre(940, 1020, 1, "rotate(6deg)") }}>
      <Tile app="deepseek" size={120} />
    </div>
    <div style={{ ...centre(760, 1640, 1, "rotate(-3deg)") }}>
      <Chip text="FREE MODELS · NOT THE REAL CLAUDE" size={30} tone="lime" />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.4, -0.7] }]} places={[{ at: -2, x: 300, y: 1450, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
