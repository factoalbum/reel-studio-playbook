import React from "react";
import { colors, fontFamily } from "../theme";

export const BrowserFrame: React.FC<{ width: number; height: number; children: React.ReactNode; label?: string; glow?: number }> = ({
  width,
  height,
  children,
  label = "ruler tool",
  glow = 0.5,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 34,
      overflow: "hidden",
      background: "#0F1B3D",
      border: `3px solid ${colors.cyan}66`,
      boxShadow: `0 0 ${80 * glow}px ${colors.cyan}55, 0 40px 90px #00000088`,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: 78, background: "#16275A", display: "flex", alignItems: "center", gap: 14, padding: "0 26px", flexShrink: 0 }}>
      {["#FB7185", "#FACC15", "#4ADE80"].map((c) => (
        <div key={c} style={{ width: 20, height: 20, borderRadius: 20, background: c }} />
      ))}
      <div
        style={{
          marginLeft: 18,
          flex: 1,
          height: 44,
          borderRadius: 22,
          background: "#0A1128",
          color: colors.muted,
          fontFamily,
          fontWeight: 600,
          fontSize: 24,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
        }}
      >
        {label}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#F8FAFC 0%,#E2E8F0 100%)" }}>
      {children}
    </div>
  </div>
);
