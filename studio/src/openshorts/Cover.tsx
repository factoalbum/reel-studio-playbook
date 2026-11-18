import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Avatar, BrandBug, type } from "../brand";
import { openshorts as ep } from "../episodes/openshorts";
import { centre } from "../immich/kit";
import { NightBackdrop } from "./Scenes";

const L = (f: string) => staticFile(`openshorts/logos/${f}`);

/** Instagram cover: GTA VI logo, "AI CLIPPER = FREE?", OpenShorts + GitHub. Key content inside the 3:4 crop (y 240 to 1680). */
export const CoverOpenShorts: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0B0614", overflow: "hidden" }}>
    <NightBackdrop t={0} />
    <div style={{ ...centre(540, 575, 1, "rotate(-3deg)") }}>
      <Img src={L("gta-poster-logo-trim.png")} style={{ height: 400, filter: "drop-shadow(0 0 40px #FF4FA3)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 815, textAlign: "center" }}>
      <div style={{ ...type.display, fontSize: 112, lineHeight: 1, color: "#FFFFFF", textShadow: "0 8px 30px rgba(0,0,0,0.7)" }}>AI CLIPPER</div>
      <div style={{ ...type.display, fontSize: 150, lineHeight: 1.05 }}>
        <span style={{ background: "linear-gradient(90deg, #FF8A3D, #FF4FA3)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 0 24px #FF4FA399)" }}>FREE hai?!</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 560, top: 1160, display: "flex", alignItems: "center", gap: 18, background: "rgba(22,14,36,0.94)", border: "2px solid rgba(255,255,255,0.14)", borderRadius: 26, padding: "16px 24px", transform: "rotate(-3deg)", boxShadow: "0 0 40px #FF8A3D55" }}>
      <Img src={L("openshorts-logo.png")} style={{ width: 70 }} />
      <Img src={L("github-mark-white.svg")} style={{ width: 62 }} />
      <div style={{ ...type.display, fontSize: 40, color: "#FFFFFF" }}>★ 8.8K</div>
    </div>
    <Avatar keys={[{ at: -1, pose: "point", aim: -40, expr: "excited", look: [0.5, -0.6] }]} places={[{ at: -2, x: 290, y: 1440, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug light />
  </AbsoluteFill>
);
