import React from "react";
import { Img, staticFile } from "remotion";
import { mono, palette as P, shadow } from "./tokens";

export type Cam = { cx: number; cy: number; z: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Shot = { file: string; width: number; height: number };

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Camera at time t from keys [start time, camera]; each move takes `move` seconds. Zoom eases in log space. */
export function camAt(keys: [number, Cam][], t: number, move = 0.55): Cam {
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (keys[k][0] <= t) i = k;
  const [at, cur] = keys[i];
  const prev = i > 0 ? keys[i - 1][1] : cur;
  const k = easeInOut(Math.max(0, Math.min(1, (t - at) / move)));
  const z = Math.exp(Math.log(prev.z) + (Math.log(cur.z) - Math.log(prev.z)) * k);
  return { cx: prev.cx + (cur.cx - prev.cx) * k, cy: prev.cy + (cur.cy - prev.cy) * k, z };
}

/** Screenshot point to frame pixels, for labels drawn outside the panel so they stay crisp. */
export const toFrame = (panel: Rect, u: number, v: number, c: Cam): [number, number] => [panel.x + panel.w / 2 + (u - c.cx) * c.z, panel.y + panel.h / 2 + (v - c.cy) * c.z];

/**
 * Real website proof: the owner's screenshot in a white card, seen through a virtual camera.
 * `soften` blurs regions (third-party ad creatives). Children are drawn in screenshot (crop) coordinates.
 * `enter` (spring, 0 to 1) and `out` (0 to 1) drive the entrance and exit.
 */
export const ProofPanel: React.FC<{ panel: Rect; shot: Shot; crop: Rect; cam: Cam; enter: number; out: number; soften?: Rect[]; children?: React.ReactNode }> = ({
  panel,
  shot,
  crop,
  cam,
  enter,
  out,
  soften = [],
  children,
}) => {
  const src = staticFile(shot.file);
  return (
    <div
      style={{
        position: "absolute",
        left: panel.x,
        top: panel.y,
        width: panel.w,
        height: panel.h,
        borderRadius: 26,
        overflow: "hidden",
        background: P.card,
        border: `4px solid ${P.ink}`,
        boxShadow: shadow.soft,
        transform: `translateY(${(1 - enter) * 340 + out * 120}px) scale(${(0.7 + 0.3 * enter) * (1 - 0.12 * out)}) rotate(${(1 - Math.min(enter, 1)) * -5}deg)`,
        opacity: Math.min(1, enter * 1.5) * (1 - out),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: crop.w,
          height: crop.h,
          overflow: "hidden",
          transformOrigin: "0 0",
          transform: `translate(${panel.w / 2 - cam.cx * cam.z}px, ${panel.h / 2 - cam.cy * cam.z}px) scale(${cam.z})`,
        }}
      >
        <Img src={src} style={{ position: "absolute", left: -crop.x, top: -crop.y, width: shot.width, height: shot.height }} />
        {soften.map((r, i) => (
          <div key={i} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden" }}>
            <Img src={src} style={{ position: "absolute", left: -crop.x - r.x, top: -crop.y - r.y, width: shot.width, height: shot.height, filter: "blur(6px)" }} />
          </div>
        ))}
        {children}
      </div>
    </div>
  );
};

/** Website-style browser window for things we draw ourselves (not proof): paper body, quiet chrome, URL pill. */
export const BrowserCard: React.FC<{ width: number; height: number; url: string; children: React.ReactNode }> = ({ width, height, url, children }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 26,
      overflow: "hidden",
      background: P.paper,
      border: `4px solid ${P.ink}`,
      boxShadow: shadow.soft,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div style={{ height: 74, background: P.paper2, borderBottom: `3px solid ${P.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", flexShrink: 0 }}>
      {[P.pink, P.gold, P.lime].map((c) => (
        <div key={c} style={{ width: 20, height: 20, borderRadius: 20, background: c, border: `2px solid ${P.ink}` }} />
      ))}
      <div
        style={{
          marginLeft: 14,
          flex: 1,
          height: 44,
          borderRadius: 22,
          background: P.card,
          border: `2px solid ${P.line}`,
          color: P.ink2,
          fontFamily: mono,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          fontSize: 24,
        }}
      >
        {url}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
  </div>
);
