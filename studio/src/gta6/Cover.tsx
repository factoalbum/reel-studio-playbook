import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, type } from "../brand";
import { gta6 as ep } from "../episodes/gta6";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { AppTile, type AppKey } from "./Scenes";

/**
 * Instagram cover: "GTA 6 REELS = PAISA?" / "MY AI REEL WORKFLOW", the presenter, the four official app logos
 * and the real kit cover. "GTA 6" is typeset in our own style (no game logo or artwork). Everything important
 * sits inside the 3:4 grid crop (y 240 to 1680).
 */
const APPS: AppKey[] = ["chatgpt", "aistudio", "claude", "remotion"];

export const CoverGta6: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 350, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ ...type.display, fontSize: 230, lineHeight: 0.92, color: "#FAF9F5", background: P.ink, border: `10px solid ${P.ink}`, borderRadius: 44, padding: "12px 54px 28px", boxShadow: `16px 16px 0 ${P.lime}`, whiteSpace: "nowrap", letterSpacing: "-0.04em", transform: "rotate(-2deg)" }}>
        GTA <span style={{ color: P.lime }}>6</span>
      </div>
      <div style={{ ...type.display, fontSize: 112, color: P.ink, whiteSpace: "nowrap", marginTop: 14 }}>
        REELS = <span style={{ background: P.lime, borderRadius: 16, padding: "0 16px" }}>PAISA?</span>
      </div>
    </div>
    <div style={{ ...centre(540, 880, 1, "rotate(1.5deg)") }}>
      <Chip text="MY AI REEL WORKFLOW" size={56} tone="ink" />
    </div>
    {APPS.map((a, i) => (
      <div key={a} style={{ ...centre(180 + i * 240, 1050, 1, `rotate(${(i % 2 ? 1 : -1) * 4}deg)`) }}>
        <AppTile app={a} size={170} />
      </div>
    ))}
    <div style={{ ...centre(800, 1420, 1, "rotate(5deg)") }}>
      <Img src={staticFile("fable52/kit-cover.png")} style={{ width: 300, height: 424, display: "block", borderRadius: 16, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(10) }} />
    </div>
    <div style={{ ...centre(800, 1660, 1, "rotate(-2deg)") }}>
      <Chip text="AI REEL KIT · LINK IN BIO" size={30} tone="lime" />
    </div>
    <Avatar keys={[{ at: -1, pose: "point", aim: -50, expr: "excited", look: [0.5, -0.6] }]} places={[{ at: -2, x: 290, y: 1440, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
