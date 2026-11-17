import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { THIRTY, type ThirtyId } from "../episodes/thirty";
import { centre } from "../immich/kit";
import { pad } from "./episode";
import { BookCover } from "./Scenes";

/**
 * Cover for every episode: "30 DAYS." / "ONE DIGITAL PRODUCT." with the day badge, the kit cover and the presenter.
 * Only the day and episode number change. Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverThirty: React.FC<{ ep: ThirtyId }> = ({ ep: id }) => {
  const ep = THIRTY[id];
  return (
    <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ ...type.display, fontSize: 196, color: P.ink, lineHeight: 0.95 }}>30 DAYS.</div>
        <div style={{ ...type.display, fontSize: 104, color: P.ink, lineHeight: 1.05, marginTop: 10 }}>ONE DIGITAL</div>
        <Sticker size={112} tone="lime" rotate={-3} style={{ marginTop: 6 }}>
          PRODUCT.
        </Sticker>
      </div>
      <div style={{ ...centre(800, 1150, 0.78, "rotate(8deg)") }}>
        <BookCover w={300} />
      </div>
      <Avatar keys={[{ at: 0, pose: "point", aim: -20, expr: "excited", look: [0.6, -0.2] }]} places={[{ at: 0, x: 330, y: 1330, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
      <div style={{ ...centre(540, 870, 1, "rotate(-2deg)") }}>
        <Sticker size={52} tone="ink" rotate={0}>
          DAY {pad(ep.day)} / {ep.totalDays} · EP {pad(ep.episode)}
        </Sticker>
      </div>
      <BrandBug />
    </AbsoluteFill>
  );
};
