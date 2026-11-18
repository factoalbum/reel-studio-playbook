import React from "react";
import { AbsoluteFill, Freeze } from "remotion";
import { Reel01v3 } from "./Reel01v3";
import { Reel01v4 } from "./Reel01v4";
import { Reel02 } from "./Reel02";
import { ReelMDH } from "./ReelMDH";
import { ReelGoogle } from "./ReelGoogle";
import { ReelSecrets } from "./ReelSecrets";
import { ReelEbay } from "./ReelEbay";
import { ReelBonus } from "./ReelBonus";
import { ReelImmich } from "./ReelImmich";
import { ReelGoogle5 } from "./ReelGoogle5";
import { ReelJio } from "./ReelJio";
import { ReelThirty } from "./thirty/ReelThirty";
import { ReelLaunch } from "./ReelLaunch";
import { ReelSales } from "./ReelSales";
import { ReelClaude } from "./ReelClaude";
import { ReelFable } from "./ReelFable";
import { ReelFable52 } from "./ReelFable52";
import { ReelGta6 } from "./ReelGta6";
import { ReelAgent } from "./ReelAgent";
import { ReelAnti } from "./ReelAnti";
import { ReelTokens } from "./ReelTokens";
import { ReelGta6Clip } from "./ReelGta6Clip";
import { ReelOpenShorts } from "./ReelOpenShorts";

const Thirty01: React.FC = () => <ReelThirty ep="ep01" />;
const REELS = { v3: Reel01v3, v4: Reel01v4, "02": Reel02, mdh: ReelMDH, google: ReelGoogle, secrets: ReelSecrets, ebay: ReelEbay, bonus: ReelBonus, immich: ReelImmich, google5: ReelGoogle5, jio: ReelJio, thirty01: Thirty01, launch: ReelLaunch, sales: ReelSales, claude: ReelClaude, fable: ReelFable, fable52: ReelFable52, gta6: ReelGta6, agent: ReelAgent, anti: ReelAnti, tokens: ReelTokens, gta6clip: ReelGta6Clip, openshorts: ReelOpenShorts };

/** Preview helper: several frames of a reel on one image (3 columns at 1/3 size). */
export const Sheet: React.FC<{ times: number[]; reel?: keyof typeof REELS }> = ({ times, reel = "v4" }) => {
  const Reel = REELS[reel];
  return (
    <AbsoluteFill style={{ background: "#000", display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start" }}>
      {times.map((s) => (
        <div key={s} style={{ width: 360, height: 640, overflow: "hidden", position: "relative", outline: "2px solid #333" }}>
          <div style={{ position: "absolute", width: 1080, height: 1920, transform: "scale(0.3333)", transformOrigin: "0 0" }}>
            <Freeze frame={Math.round(s * 30)}>
              <Reel />
            </Freeze>
          </div>
          <div style={{ position: "absolute", left: 6, bottom: 6, color: "#fff", font: "bold 22px sans-serif", background: "#000b", padding: "2px 8px" }}>{s}s</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
