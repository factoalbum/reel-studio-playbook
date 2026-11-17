import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const drift = (t * 14) % 90;
  const mask = "radial-gradient(ellipse at 50% 45%, black 20%, transparent 75%)";
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navy2} 55%, ${colors.navy} 100%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${colors.navy3}55 2px, transparent 2px), linear-gradient(90deg, ${colors.navy3}55 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0px ${drift}px`,
          opacity: 0.55,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + Math.sin(t * 0.7) * 8}% 42%, ${colors.cyan}26 0%, transparent 46%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 90%, ${colors.yellow}14 0%, transparent 38%)` }} />
    </AbsoluteFill>
  );
};
