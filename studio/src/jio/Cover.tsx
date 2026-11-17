import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { jio as ep } from "../episodes/jio";
import { centre } from "../immich/kit";
import { Logo, type LogoKey } from "./Scenes";

/**
 * Instagram cover: "JIO NE AI FREE DIYA?!" / "5 THINGS YOU SHOULD USE", the surprised presenter, the Jio logo with a
 * Gemini glow and the official tool tiles. Everything important sits inside the 3:4 grid crop (y 240 to 1680).
 */
const SPOTS: { k: LogoKey; x: number; y: number; r: number; s: number }[] = [
  { k: "gmail", x: 760, y: 1030, r: 8, s: 140 },
  { k: "docs", x: 935, y: 1180, r: -6, s: 125 },
  { k: "notebooklm", x: 735, y: 1255, r: -10, s: 135 },
  { k: "one", x: 920, y: 1405, r: 7, s: 125 },
  { k: "nano", x: 715, y: 1480, r: 4, s: 140 },
];

export const CoverJio: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", width: 150, height: 150 }}>
          <Img src={staticFile("jio/logos/gemini.png")} style={{ position: "absolute", left: -40, top: -40, width: 230, height: 230, opacity: 0.55, filter: "blur(14px)" }} />
          <Img src={staticFile("jio/logos/jio.svg")} style={{ position: "absolute", inset: 0, width: 150, height: 150 }} />
        </div>
        <div style={{ ...type.display, fontSize: 132, color: P.ink, whiteSpace: "nowrap", lineHeight: 1 }}>JIO NE AI</div>
      </div>
      <Sticker size={138} tone="lime" rotate={-4} style={{ marginTop: 8 }}>
        FREE DIYA?!
      </Sticker>
    </div>
    <div style={{ ...centre(540, 790, 1, "rotate(-2deg)"), ...type.display, fontSize: 52, color: "#fff", background: P.ink, borderRadius: 18, padding: "10px 26px", whiteSpace: "nowrap" }}>5 THINGS YOU SHOULD USE</div>
    {SPOTS.map((s) => (
      <div key={s.k} style={{ ...centre(s.x, s.y, 1, `rotate(${s.r}deg)`) }}>
        <Logo k={s.k} size={s.s} style={{ boxShadow: "6px 6px 0 #1b1b1b" }} />
      </div>
    ))}
    <Avatar keys={[{ at: 0, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: 0, x: 330, y: 1330, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(540, 1630, 1) }}>
      <Sticker size={34} tone="ink" rotate={-2}>
        CREATOR SECRETS #04
      </Sticker>
    </div>
    <BrandBug />
  </AbsoluteFill>
);
