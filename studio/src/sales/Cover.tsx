import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, shadow, Sticker, type } from "../brand";
import { sales as ep } from "../episodes/sales";
import { centre } from "../immich/kit";
import { Chip, ProductBox, RealPage } from "../launch/kit";

/**
 * Instagram cover for Build in Public Episode 02: "MY FIRST ₹300 EBOOK SALES?!" / "HOW I DID IT", the surprised presenter,
 * the kit box with a real prompt page, the real Topmate listing, ₹99, and the honesty note with the real numbers.
 * Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverSales: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ ...type.display, fontSize: 92, color: P.ink, whiteSpace: "nowrap", lineHeight: 1 }}>MY FIRST</div>
      <div style={{ ...type.display, fontSize: 150, color: P.ink, whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "-0.05em", textShadow: `7px 7px 0 ${P.lime}` }}>₹300 EBOOK</div>
      <Sticker size={96} tone="lime" rotate={-3}>
        SALES?!
      </Sticker>
    </div>
    <div style={{ ...centre(540, 760, 1, "rotate(-1deg)") }}>
      <Chip text="HOW I DID IT · BUILD IN PUBLIC #02" size={32} tone="ink" />
    </div>
    <div style={{ ...centre(905, 1030, 1, "rotate(9deg)") }}>
      <div style={{ width: 230, height: 300, overflow: "hidden", borderRadius: 18, border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7), position: "relative", background: P.card }}>
        <Img src={staticFile("sales/topmate.png")} style={{ position: "absolute", left: 0, top: -240 * (230 / 860), width: 230 }} />
      </div>
    </div>
    <div style={{ ...centre(640, 1010, 1, "rotate(-10deg)") }}>
      <RealPage src="launch/pages/prompts-p2.png" w={200} />
    </div>
    <div style={{ ...centre(760, 1060, 1) }}>
      <ProductBox w={270} t={1.2} yaw={-22} glow={0.9} />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: -2, x: 275, y: 1290, s: 0.8 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(800, 1385, 1, "rotate(-5deg)") }}>
      <Sticker size={140} tone="lime" rotate={0}>
        ₹99
      </Sticker>
    </div>
    <div style={{ position: "absolute", left: 90, width: 900, top: 1525, textAlign: "center", ...type.body, fontSize: 30, lineHeight: 1.3, color: P.ink, background: P.card, border: `4px solid ${P.ink}`, borderRadius: 18, padding: "10px 18px", boxSizing: "border-box" }}>
      3 orders · all friends &amp; family testing checkout · ₹276 after fees · not profit
    </div>
    <BrandBug />
  </AbsoluteFill>
);
