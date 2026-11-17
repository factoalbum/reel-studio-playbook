import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, Sticker, type } from "../brand";
import { bonus as ep } from "../episodes/bonus";
import { centre, DiyaRow, FEST, Garland, Person, SalarySlip, Scales, WarmGlow } from "./kit";

/**
 * Instagram cover for the Diwali bonus reel: "DIWALI BONUS NAHI MILA?!" / "KNOW YOUR RIGHTS", the presenter pointing at
 * the headline, the confused employee with his salary slip, a big rupee coin, diyas and marigolds.
 * Everything important sits inside the 3:4 grid crop (y 240 to 1680). Render frame 60 so the springs have settled.
 */
export const CoverBonus: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <WarmGlow k={1} />
    <Garland t={0} y={150} swags={3} depth={56} />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...type.display, fontSize: 124, color: P.ink, whiteSpace: "nowrap" }}>DIWALI BONUS</div>
      <Sticker size={128} tone="lime" rotate={-3}>
        NAHI MILA?!
      </Sticker>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, background: P.ink, borderRadius: 26, padding: "12px 30px 12px 22px", boxShadow: `8px 8px 0 ${P.lime}` }}>
        <div style={{ background: P.card, borderRadius: 18, padding: 6, display: "flex" }}>
          <Scales size={78} tilt={-6} />
        </div>
        <div style={{ ...type.display, fontSize: 66, color: P.lime, whiteSpace: "nowrap" }}>KNOW YOUR RIGHTS</div>
      </div>
    </div>
    {/* The big rupee coin behind the two characters. */}
    <div style={{ ...centre(560, 1090, 1), width: 300, height: 300, borderRadius: 300, background: P.gold, border: `8px solid ${P.ink}`, boxShadow: shadow.hard(10), display: "flex", alignItems: "center", justifyContent: "center", ...type.display, fontSize: 210, color: P.ink }}>₹</div>
    <Avatar keys={[{ at: 0, pose: "point", aim: -58, expr: "excited", look: [0.5, -0.7] }]} places={[{ at: 0, x: 300, y: 1290, s: 0.78 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <Person who="emp" x={820} bottom={1640} s={0.86} pose="hold" face="worried" t={0.4} flip />
    <div style={{ ...centre(640, 1505, 1, "rotate(-8deg)") }}>
      <SalarySlip w={300} bonus="₹0?" hi={1} />
    </div>
    <DiyaRow t={0.3} y={1660} xs={[150, 400, 680, 930]} s={0.75} />
    <div style={{ ...centre(870, 1010, 1, "rotate(10deg)") }}>
      <div style={{ ...type.display, fontSize: 92, color: FEST.red }}>?</div>
    </div>
    <BrandBug />
  </AbsoluteFill>
);
