import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { google as ep } from "../episodes/google";
import { Eyebrow } from "../mdh/kit";
import { DeepSpace, DomainPill } from "./Story";

/**
 * Instagram cover for the google.com reel: "google.com" bar stamped SOLD, "Sirf $12 mein?!", the presenter in shock.
 * Render a late frame (e.g. --frame=60) so the presenter's springs have settled. Everything important sits inside
 * the 3:4 grid crop (y 240 to 1680).
 */
export const CoverGoogle: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <DeepSpace t={4} k={1} />
    <div style={{ position: "absolute", left: 0, top: 336, width: 1080, display: "flex", justifyContent: "center" }}>
      <Eyebrow text="Internet Stories · Ep 2" dot />
    </div>
    <div style={{ position: "absolute", left: 540, top: 560, transform: "translate(-50%, -50%) rotate(-2deg)" }}>
      <DomainPill t={0.3} sold={1} />
      <div style={{ position: "absolute", left: 240, top: -30, transform: "rotate(-12deg)", border: `8px solid ${P.pink}`, color: P.pink, background: "rgba(255,255,255,0.92)", borderRadius: 16, padding: "4px 26px", ...type.label, letterSpacing: "0.08em", fontSize: 66, whiteSpace: "nowrap" }}>
        Sold!
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Sticker size={124} tone="lime" rotate={-3}>
        Sirf $12 mein?!
      </Sticker>
      <div style={{ ...type.label, fontSize: 26, color: P.ink, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 999, padding: "8px 22px", marginTop: 26 }}>
        The domain, not the company · true story
      </div>
    </div>
    <Avatar keys={[{ at: 0, pose: "surprised", expr: "surprised", look: [0.2, -0.9] }]} places={[{ at: 0, x: 540, y: 1520, s: 0.95 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <BrandBug />
  </AbsoluteFill>
);
