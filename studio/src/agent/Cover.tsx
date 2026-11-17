import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, mono, palette as P, shadow, type } from "../brand";
import { agent as ep } from "../episodes/agent";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { Logo } from "./Scenes";

/**
 * Instagram cover: "CLAUDE NE INSTAGRAM KA GAME KHATAM?!" / "INSTAGRAM AGENT SKILLS", the presenter, the official
 * Claude and Instagram logos, floating planning cards and the Virality Skill card. Everything important sits
 * inside the 3:4 grid crop (y 240 to 1680). No suggestion that Instagram shuts down.
 */
const CARDS: [string, number, number, number][] = [
  ["/ig-plan", 860, 1180, 6],
  ["/ig-reply", 840, 1330, -4],
  ["/ig-profile", 870, 1480, 5],
];

export const CoverAgent: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ ...type.display, fontSize: 112, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>CLAUDE NE</div>
      <div style={{ ...type.display, fontSize: 112, lineHeight: 1, color: P.ink, letterSpacing: "-0.04em", whiteSpace: "nowrap" }}>INSTAGRAM KA</div>
      <div style={{ ...type.display, fontSize: 124, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 34, padding: "6px 34px 18px", boxShadow: shadow.hard(12), letterSpacing: "-0.04em", whiteSpace: "nowrap", transform: "rotate(-2deg)", marginTop: 8 }}>GAME KHATAM?!</div>
    </div>
    <div style={{ ...centre(540, 845, 1, "rotate(1.5deg)") }}>
      <Chip text="INSTAGRAM AGENT SKILLS" size={54} tone="ink" />
    </div>
    <div style={{ ...centre(330, 1030, 1, "rotate(-6deg)") }}>
      <Logo app="claude" size={190} glow={0.5} />
    </div>
    <div style={{ ...centre(750, 1030, 1, "rotate(6deg)") }}>
      <Logo app="insta" size={190} glow={0.5} />
    </div>
    <div style={{ ...centre(540, 1030, 1) }}>
      <div style={{ width: 90, height: 12, borderRadius: 6, background: P.lime, border: `3px solid ${P.ink}` }} />
    </div>
    {CARDS.map(([c, x, y, r]) => (
      <div key={c} style={{ ...centre(x, y, 1, `rotate(${r}deg)`) }}>
        <div style={{ fontFamily: mono, fontWeight: 600, fontSize: 34, color: "#F4F2EA", background: P.ink, border: `4px solid ${P.ink}`, borderRadius: 16, padding: "10px 18px 12px", boxShadow: shadow.hard(6), whiteSpace: "nowrap" }}>{c}</div>
      </div>
    ))}
    <div style={{ ...centre(780, 1625, 1, "rotate(-3deg)") }}>
      <Chip text="+ VIRALITY SKILL" size={40} tone="lime" />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "excited", look: [0.4, -0.7] }]} places={[{ at: -2, x: 300, y: 1450, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
