import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { ebay as ep } from "../episodes/ebay";
import { Eyebrow } from "../mdh/kit";
import { centre, LaserPen, Rays } from "./kit";

/**
 * Instagram cover for the eBay reel: "eBay's FIRST SALE WAS BROKEN?!" and the presenter holding the snapped pointer.
 * Render a late frame (--frame=60) so the springs have settled. Everything important sits inside the 3:4 grid crop
 * (y 240 to 1680).
 */
export const CoverEbay: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <Rays t={0} x={540} y={1120} k={0.5} />
    <div style={{ position: "absolute", left: 0, top: 344, width: 1080, display: "flex", justifyContent: "center" }}>
      <Eyebrow text="Internet Stories · Ep 3" dot />
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 412, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ ...type.display, fontSize: 120, color: P.ink, whiteSpace: "nowrap" }}>eBay's FIRST</div>
      <div style={{ ...type.display, fontSize: 120, color: P.ink, whiteSpace: "nowrap" }}>SALE WAS</div>
      <Sticker size={138} tone="lime" rotate={-3} style={{ marginTop: 10 }}>
        BROKEN?!
      </Sticker>
    </div>
    <Avatar keys={[{ at: 0, pose: "explain", expr: "surprised", look: [0.5, 0.4] }]} places={[{ at: 0, x: 500, y: 1230, s: 0.92 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(740, 1590, 1, "rotate(-16deg)") }}>
      <LaserPen s={0.72} gap={30} bend={11} broken t={1} />
    </div>
    <BrandBug />
  </AbsoluteFill>
);
