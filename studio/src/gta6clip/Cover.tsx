import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, BrandBug, palette as P, shadow, type } from "../brand";
import { gta6clip as ep } from "../episodes/gta6clip";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { Gta, LogoTile, ViceBackdrop } from "./Scenes";

/**
 * Instagram cover: "GTA 6 / CLIPS = $$$?" with "$1 per 1,000 views" and "4 STEPS". "GTA 6" is set in our own type
 * (official GTA VI logo, no game artwork). Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverGta6Clip: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <ViceBackdrop t={0} />
    <div style={{ ...centre(540, 375, 1, "rotate(-1.5deg)") }}>
      <Chip text="19 NOV · LAUNCH DAY" size={44} tone="ink" />
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 430, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ transform: "rotate(-2deg)" }}>
        <Gta size={190} glow={1} />
      </div>
      <div style={{ ...type.display, fontSize: 124, color: P.ink, whiteSpace: "nowrap", marginTop: 10 }}>
        CLIPS = <span style={{ background: P.lime, borderRadius: 16, padding: "0 16px" }}>$$$?</span>
      </div>
    </div>
    <div style={{ ...centre(540, 1110, 1, "rotate(1.5deg)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, background: P.card, border: `7px solid ${P.ink}`, borderRadius: 30, boxShadow: shadow.hard(10), padding: "14px 30px 20px" }}>
        <div style={{ ...type.display, fontSize: 110, lineHeight: 0.95, color: P.ink, letterSpacing: "-0.05em" }}>$1</div>
        <div style={{ ...type.display, fontSize: 50, lineHeight: 1.0, color: P.ink }}>
          per 1,000
          <br />
          views?
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 590, top: 1270, display: "flex", gap: 18, transform: "rotate(-3deg)" }}>
      <LogoTile brand="whop" size={110} />
      <LogoTile brand="opus" size={110} />
      <LogoTile brand="youtube" size={110} />
    </div>
    <div style={{ ...centre(800, 1560, 1, "rotate(-2deg)") }}>
      <Chip text="4 STEPS + 2 TRAPS" size={40} tone="lime" />
    </div>
    <Avatar keys={[{ at: -1, pose: "point", aim: -50, expr: "excited", look: [0.5, -0.6] }]} places={[{ at: -2, x: 290, y: 1440, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
