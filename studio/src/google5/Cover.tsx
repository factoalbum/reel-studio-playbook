import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { google5 as ep } from "../episodes/google5";
import { centre } from "../immich/kit";
import { ToolLogo } from "./Scenes";

/**
 * Instagram cover: "5 GOOGLE AI TOOLS" / "FREE?!" / "₹18,000 WORTH?", the surprised presenter and the five official
 * tool tiles floating round him. Everything important sits inside the 3:4 grid crop (y 240 to 1680). Render frame 60.
 */
const SPOTS = [
  { x: 760, y: 1010, r: 8, s: 150 },
  { x: 930, y: 1190, r: -6, s: 130 },
  { x: 720, y: 1250, r: -10, s: 140 },
  { x: 900, y: 1420, r: 7, s: 130 },
  { x: 700, y: 1500, r: 4, s: 140 },
];

export const CoverGoogle5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 350, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ ...type.display, fontSize: 128, color: P.ink, whiteSpace: "nowrap", lineHeight: 1 }}>5 GOOGLE</div>
      <div style={{ ...type.display, fontSize: 128, color: P.ink, whiteSpace: "nowrap", lineHeight: 1 }}>AI TOOLS</div>
      <Sticker size={150} tone="lime" rotate={-4} style={{ marginTop: 12 }}>
        FREE?!
      </Sticker>
    </div>
    <div style={{ ...centre(330, 1000, 1, "rotate(-6deg)"), ...type.display, fontSize: 50, color: "#fff", background: P.ink, borderRadius: 18, padding: "10px 22px", whiteSpace: "nowrap" }}>₹18,000 WORTH?</div>
    {SPOTS.map((s, i) => (
      <div key={i} style={{ ...centre(s.x, s.y, 1, `rotate(${s.r}deg)`) }}>
        <ToolLogo i={i} size={s.s} style={{ boxShadow: "6px 6px 0 #1b1b1b" }} />
      </div>
    ))}
    <Avatar keys={[{ at: 0, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: 0, x: 330, y: 1330, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(540, 1630, 1) }}>
      <Sticker size={34} tone="ink" rotate={-2}>
        CREATOR SECRETS #03
      </Sticker>
    </div>
    <BrandBug />
  </AbsoluteFill>
);
