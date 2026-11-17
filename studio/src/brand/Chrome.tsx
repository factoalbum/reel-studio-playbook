import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { LAYOUT, palette as P, SAFE, sans, type } from "./tokens";

/** Warm paper background with a faint dot grid and the website's soft lime glow. */
export const Backdrop: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const drift = (t * 10) % 44;
  const mask = "radial-gradient(ellipse at 50% 45%, black 30%, transparent 80%)";
  return (
    <AbsoluteFill style={{ background: P.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${P.lineStrong} 2.4px, transparent 2.8px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: `22px ${22 - drift}px`,
          opacity: 0.5,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${86 + Math.sin(t * 0.6) * 3}% 16%, ${P.lime}70 0%, transparent 34%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 10% 92%, ${P.lime}40 0%, transparent 30%)` }} />
    </AbsoluteFill>
  );
};

/** The website's logo: lime square in an ink square, with "IT". */
export const BrandMark: React.FC<{ size?: number; round?: boolean }> = ({ size = 56, round = false }) => (
  <div style={{ width: size, height: size, borderRadius: round ? size : size * 0.19, background: P.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <div
      style={{
        width: size * 0.78,
        height: size * 0.78,
        borderRadius: round ? size : size * 0.14,
        background: P.lime,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: size * 0.36,
        color: P.ink,
      }}
    >
      IT
    </div>
  </div>
);

/** Logo and name, top left, in every reel. */
export const BrandBug: React.FC = () => (
  <div style={{ position: "absolute", left: SAFE.left, top: LAYOUT.brandTop, display: "flex", alignItems: "center", gap: 14 }}>
    <BrandMark size={54} />
    <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 32, color: P.ink }}>Internet Toolbox</div>
  </div>
);

/** Honesty line, top right, in every reel that mentions money. */
export const Disclaimer: React.FC<{ lines: string[] }> = ({ lines }) => (
  <div style={{ position: "absolute", right: 1080 - SAFE.right, top: LAYOUT.brandTop + 4, textAlign: "right", ...type.body, fontSize: 22, lineHeight: 1.3, color: P.ink3 }}>
    {lines.map((l) => (
      <div key={l}>{l}</div>
    ))}
  </div>
);

/** Lime progress line along the top edge. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: P.lime, borderBottom: `3px solid ${P.ink}` }} />;
};
