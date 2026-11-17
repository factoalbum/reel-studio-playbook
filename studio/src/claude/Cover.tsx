import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, Sticker, type } from "../brand";
import { mono } from "../brand/tokens";
import { claude as ep } from "../episodes/claude";
import { centre, RED } from "../immich/kit";
import { Chip } from "../launch/kit";

/**
 * Instagram cover for Creator Secrets #05: "CLAUDE CODE FREE?!" / "CHECK YOUR PLAN FIRST", the surprised presenter,
 * the real Claude Pro pricing card (Claude Code row highlighted), a Claude Code terminal and the Gemini CLI update chip.
 * Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverClaude: React.FC = () => {
  const s = 330 / 380;
  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ ...type.display, fontSize: 128, color: P.lime, background: P.ink, borderRadius: 24, padding: "4px 28px 10px", whiteSpace: "nowrap", letterSpacing: "-0.05em" }}>CLAUDE CODE</div>
        <Sticker size={150} tone="lime" rotate={-3}>
          FREE?!
        </Sticker>
      </div>
      <div style={{ ...centre(540, 735, 1, "rotate(-1deg)") }}>
        <Chip text="CHECK YOUR PLAN FIRST" size={40} tone="ink" />
      </div>
      {/* Real Claude Pro card, scrolled to the "Claude Code" row */}
      <div style={{ ...centre(820, 1000, 1, "rotate(5deg)") }}>
        <div style={{ position: "relative", width: 330, height: 360, overflow: "hidden", borderRadius: 20, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(8), background: P.card }}>
          <Img src={staticFile("claude/pro-card.png")} style={{ position: "absolute", left: 0, top: -330 * s, width: 330 }} />
          <div style={{ position: "absolute", left: 16 * s, top: (583 - 330) * s, width: 340 * s, height: 46 * s, border: `5px solid ${P.lime}`, borderRadius: 10, boxShadow: "0 0 0 3px rgba(23,23,23,0.85)" }} />
        </div>
      </div>
      {/* Claude Code terminal */}
      <div style={{ ...centre(560, 905, 1, "rotate(-4deg)") }}>
        <div style={{ width: 500, background: "#1B1B1A", border: `5px solid ${P.ink}`, borderRadius: 20, boxShadow: shadow.hard(8), overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 8, padding: "11px 16px", background: "#2C2B28" }}>
            {[RED, P.gold, P.lime].map((c) => (
              <div key={c} style={{ width: 15, height: 15, borderRadius: 99, background: c }} />
            ))}
          </div>
          <div style={{ padding: "14px 18px 18px", fontFamily: mono, fontWeight: 500, fontSize: 27, lineHeight: 1.5, color: "#E8E6DF" }}>
            <div>
              <span style={{ color: P.lime }}>$ </span>claude
            </div>
            <div style={{ color: "#D97757" }}>✻ Welcome to Claude Code!</div>
            <div style={{ color: P.lime }}>✓ Claude Pro login</div>
          </div>
        </div>
      </div>
      <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: -2, x: 270, y: 1300, s: 0.8 }]} env={ep.env.map(() => 0)} blinks={[]} />
      <div style={{ ...centre(780, 1330, 1, "rotate(-3deg)") }}>
        <Chip text="+ GEMINI CLI UPDATE" size={34} tone="lime" />
      </div>
      <div style={{ ...centre(780, 1420, 1, "rotate(-3deg)") }}>
        <Chip text="3 STEPS · API WARNING" size={28} tone="card" />
      </div>
      <BrandBug />
    </AbsoluteFill>
  );
};
