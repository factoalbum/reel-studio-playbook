import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { launch as ep } from "../episodes/launch";
import { centre } from "../immich/kit";
import { Chip, ProductBox, RealPage, XlsxPage } from "./kit";

/**
 * Instagram cover: "EBOOK BANA LI…" / "BECHOGE KAISE?!", the surprised presenter, the kit box with a real prompt page and
 * the workbook preview behind it, and a large ₹99. Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
export const CoverLaunch: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 318, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ ...type.display, fontSize: 118, color: P.ink, whiteSpace: "nowrap", lineHeight: 1 }}>EBOOK BANA LI…</div>
      <Sticker size={106} tone="lime" rotate={-3}>
        BECHOGE KAISE?!
      </Sticker>
    </div>
    <div style={{ ...centre(540, 690, 1, "rotate(-1deg)") }}>
      <Chip text="8 FILES · PDF + DOCX + XLSX" size={32} tone="ink" />
    </div>
    <div style={{ ...centre(625, 985, 1, "rotate(-12deg)") }}>
      <RealPage src="launch/pages/prompts-p2.png" w={215} />
    </div>
    <div style={{ ...centre(935, 1000, 1, "rotate(11deg)") }}>
      <XlsxPage w={225} />
    </div>
    <div style={{ ...centre(780, 1010, 1) }}>
      <ProductBox w={290} t={1.2} yaw={-22} glow={0.9} />
    </div>
    <Avatar keys={[{ at: -1, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: -2, x: 285, y: 1330, s: 0.8 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(790, 1430, 1, "rotate(-5deg)") }}>
      <Sticker size={170} tone="lime" rotate={0}>
        ₹99
      </Sticker>
    </div>
    <div style={{ ...centre(540, 1625, 1) }}>
      <Sticker size={36} tone="ink" rotate={-2}>
        EBOOK LAUNCH KIT · FOR INDIA
      </Sticker>
    </div>
    <BrandBug />
  </AbsoluteFill>
);
