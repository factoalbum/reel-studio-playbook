import React from "react";
import { AbsoluteFill } from "remotion";
import { Avatar, type AvatarKey } from "./Avatar";
import { palette as P, type } from "./tokens";

type Cell = Omit<AvatarKey, "at"> & { level?: number; label?: string };

/** The avatar in fixed poses: one big close-up, or a 3 x 2 grid. For checks and for exporting the character. */
export const AvatarBoard: React.FC<{ cells?: Cell[]; big?: Cell; transparent?: boolean }> = ({ cells = [], big, transparent = false }) => (
  <AbsoluteFill style={{ background: transparent ? "transparent" : P.paper }}>
    {big && <Avatar keys={[{ at: -10, ...big }]} places={[{ at: -10, x: 540, y: 600, s: 1.5 }]} env={[big.level ?? 0]} blinks={[]} halo={!transparent} />}
    {cells.map((c, i) => (
      <div key={i} style={{ position: "absolute", left: (i % 3) * 360, top: Math.floor(i / 3) * 960, width: 360, height: 960, overflow: "hidden" }}>
        <Avatar keys={[{ at: -10, ...c }]} places={[{ at: -10, x: 180, y: 330, s: 0.5 }]} env={[c.level ?? 0]} blinks={[]} halo={!transparent} />
        {c.label && <div style={{ position: "absolute", left: 16, top: 16, ...type.label, fontSize: 22, color: P.ink2 }}>{c.label}</div>}
      </div>
    ))}
  </AbsoluteFill>
);
