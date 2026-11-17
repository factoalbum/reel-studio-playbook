import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, Backdrop, BrandBug, palette as P, Sticker, type } from "../brand";
import { immich as ep } from "../episodes/immich";
import { centre, ImmichLogo, PhoneShell, PhotoGrid, RED, StatusRow, WarnIcon } from "./kit";

/**
 * Instagram cover for the Immich reel: "GOOGLE PHOTOS JAISA STORAGE" / "FREE?!", the surprised presenter, a phone full
 * of photos with the Immich logo, a small storage warning. Everything important sits inside the 3:4 grid crop
 * (y 240 to 1680). Render frame 60 so the springs have settled.
 */
export const CoverImmich: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: P.paper, overflow: "hidden" }}>
    <Backdrop />
    <div style={{ position: "absolute", left: 0, width: 1080, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ ...type.display, fontSize: 112, color: P.ink, whiteSpace: "nowrap" }}>GOOGLE PHOTOS</div>
      <div style={{ ...type.display, fontSize: 112, color: P.ink, whiteSpace: "nowrap" }}>JAISA STORAGE</div>
      <Sticker size={150} tone="lime" rotate={-4} style={{ marginTop: 8 }}>
        FREE?!
      </Sticker>
    </div>
    {/* Phone full of photos with the Immich logo. */}
    <div style={{ ...centre(790, 1250, 1, "rotate(7deg)") }}>
      <PhoneShell w={300} glow={0.6}>
        <StatusRow w={279} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px" }}>
          <ImmichLogo size={34} />
          <div style={{ ...type.display, fontSize: 24, color: P.ink }}>immich</div>
        </div>
        <div style={{ padding: "0 12px" }}>
          <PhotoGrid w={258} rows={6} kinds={["sunset", "family", "mountain", "food", "pet", "lake", "flower", "city"]} gap={4} />
        </div>
      </PhoneShell>
    </div>
    <div style={{ ...centre(905, 960, 1, "rotate(12deg)"), background: P.card, borderRadius: 40, border: `6px solid ${P.ink}`, padding: 14, boxShadow: `8px 8px 0 ${P.ink}` }}>
      <ImmichLogo size={110} />
    </div>
    <div style={{ ...centre(600, 1010, 1, "rotate(-8deg)"), display: "flex", alignItems: "center", gap: 10, background: P.card, border: `5px solid ${P.ink}`, borderRadius: 20, padding: "8px 16px 8px 10px", boxShadow: `6px 6px 0 ${P.ink}` }}>
      <WarnIcon size={52} />
      <div style={{ ...type.display, fontSize: 34, color: RED, whiteSpace: "nowrap" }}>Storage full</div>
    </div>
    <Avatar keys={[{ at: 0, pose: "surprised", expr: "surprised", look: [0.6, -0.3] }]} places={[{ at: 0, x: 330, y: 1290, s: 0.82 }]} env={ep.env.map(() => 0)} blinks={[]} />
    <div style={{ ...centre(540, 1610, 1) }}>
      <Sticker size={34} tone="ink" rotate={-2}>
        CREATOR SECRETS #02
      </Sticker>
    </div>
    <BrandBug />
  </AbsoluteFill>
);
