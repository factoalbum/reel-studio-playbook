import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, type } from "../brand";
import { fable as ep } from "../episodes/fable";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { AiClip, EnergyLine } from "./kit";
import { ClaudeLogo, HiggsLogo } from "./logos";

/**
 * Instagram cover for Creator Secrets #06: "AI VIDEOS INSIDE CLAUDE?!" / "HIGGSFIELD MCP SETUP", the presenter,
 * the official Claude and Higgsfield logos joined by a lime connection line, and illustrative video thumbnails.
 * Everything important sits inside the 3:4 grid crop (y 240 to 1680). No "free" or "unlimited" claims.
 */
export const CoverFable: React.FC = () => {
  const t = 1.2;
  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ ...type.display, fontSize: 150, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.055em", textShadow: `7px 7px 0 ${P.lime}` }}>AI VIDEOS</div>
        <div style={{ ...type.display, fontSize: 96, color: P.ink, whiteSpace: "nowrap" }}>
          INSIDE <span style={{ background: P.ink, color: P.lime, borderRadius: 16, padding: "0 18px" }}>CLAUDE</span>?!
        </div>
      </div>
      <div style={{ ...centre(540, 640, 1, "rotate(-1.5deg)") }}>
        <Chip text="HIGGSFIELD MCP SETUP" size={46} tone="lime" />
      </div>
      {/* logos joined by the connection line */}
      <EnergyLine from={[330, 800]} to={[750, 800]} k={1} t={0.3} width={12} />
      <div style={{ ...centre(300, 800, 1, "rotate(-4deg)") }}>
        <div style={{ background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, padding: "22px 26px", boxShadow: shadow.hard(8) }}>
          <ClaudeLogo h={62} />
        </div>
      </div>
      <div style={{ ...centre(800, 800, 1, "rotate(4deg)") }}>
        <div style={{ background: "#0E0E0E", border: `6px solid ${P.ink}`, borderRadius: 26, padding: "20px 24px", boxShadow: `${shadow.hard(8)}, 0 0 40px rgba(209,254,23,0.35)` }}>
          <HiggsLogo h={64} light />
        </div>
      </div>
      {/* illustrative clips */}
      {(
        [
          ["city", 790, 1130, 6, 300, 380],
          ["landscape", 560, 1070, -5, 220, 220],
        ] as const
      ).map(([kind, x, y, r, w, h]) => (
        <div key={kind} style={{ ...centre(x, y, 1, `rotate(${r}deg)`) }}>
          <div style={{ border: `6px solid ${P.ink}`, borderRadius: 24, overflow: "hidden", boxShadow: shadow.hard(8) }}>
            <AiClip kind={kind} t={t * 3} w={w} h={h} radius={0} play={0.4} />
          </div>
        </div>
      ))}
      <Avatar keys={[{ at: -1, pose: "point", aim: -40, expr: "excited", look: [0.6, -0.4] }]} places={[{ at: -2, x: 270, y: 1300, s: 0.8 }]} env={ep.env.map(() => 0)} blinks={[]} />
      <div style={{ ...centre(780, 1390, 1, "rotate(-3deg)") }}>
        <Chip text="3 EASY STEPS" size={40} tone="ink" />
      </div>
      <BrandBug />
    </AbsoluteFill>
  );
};
