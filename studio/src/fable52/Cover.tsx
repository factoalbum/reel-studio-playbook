import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, type } from "../brand";
import { fable52 as ep } from "../episodes/fable52";
import { centre } from "../immich/kit";
import { Chip } from "../launch/kit";
import { ClaudeLogo, CLAY } from "../fable/logos";
import { Mascot, Term } from "./kit";

/**
 * Instagram cover: "FABLE 5.2 FREE?!" / "3 THINGS TO TRY", the presenter, the real Claude logo, the illustrative
 * mascot, a 2027 card and a Claude Code terminal. Everything important sits inside the 3:4 grid crop
 * (y 240 to 1680). The offer line keeps the claim honest: Claude Pro, limited time.
 */
export const CoverFable52: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ ...centre(730, 330, 1, "rotate(3deg)") }}>
      <div style={{ background: "#141413", border: `6px solid ${P.ink}`, borderRadius: 24, padding: "16px 24px", boxShadow: shadow.hard(7) }}>
        <ClaudeLogo h={58} light />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 410, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...type.display, fontSize: 176, color: P.ink, whiteSpace: "nowrap", letterSpacing: "-0.055em", textShadow: `7px 7px 0 ${P.lime}` }}>
        FABLE <span style={{ color: CLAY }}>5.2</span>
      </div>
      <div style={{ ...type.display, fontSize: 190, lineHeight: 0.95, color: P.ink, background: P.lime, border: `8px solid ${P.ink}`, borderRadius: 34, padding: "4px 40px 18px", boxShadow: shadow.hard(12), whiteSpace: "nowrap", letterSpacing: "-0.05em", transform: "rotate(-3deg)" }}>FREE?!</div>
    </div>
    <div style={{ ...centre(540, 895, 1, "rotate(1.5deg)") }}>
      <Chip text="3 THINGS TO TRY" size={62} tone="ink" />
    </div>
    <div style={{ ...centre(540, 1000) }}>
      <Chip text="Claude Pro · limited time · limits apply" size={28} tone="card" />
    </div>
    {/* 1: Claude Code terminal */}
    <div style={{ ...centre(770, 1140, 1, "rotate(3deg)") }}>
      <Term t={9} w={440} fs={24} title="claude" lines={[{ text: "claude", at: 0, tone: "cmd" }, { text: "✻ Claude Code", at: 0, tone: "clay" }, { text: "AI reel workflow", at: 0, tone: "you" }]} />
    </div>
    {/* 2: the 2027 card */}
    <div style={{ ...centre(880, 1400, 1, "rotate(-5deg)") }}>
      <div style={{ width: 250, background: P.card, border: `6px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), overflow: "hidden" }}>
        <div style={{ background: P.ink, color: P.lime, ...type.label, fontSize: 22, padding: "8px 0", textAlign: "center" }}>ACTION PLAN</div>
        <div style={{ ...type.display, fontSize: 96, color: P.ink, textAlign: "center", padding: "4px 0 14px" }}>2027</div>
      </div>
    </div>
    {/* 3: the mascot */}
    <div style={{ ...centre(600, 1400), width: 300, height: 300, borderRadius: 999, background: P.lime, border: `6px solid ${P.ink}`, boxShadow: shadow.hard(8) }} />
    <div style={{ ...centre(600, 1390) }}>
      <Mascot size={250} t={0.3} id="cv" />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.5] }]} places={[{ at: -2, x: 250, y: 1400, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
