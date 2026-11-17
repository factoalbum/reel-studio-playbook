import React from "react";
import { Img, staticFile } from "remotion";
import { mono, palette as P, shadow } from "./tokens";
import type { Cam, Rect, Shot } from "./ProofPanel";

/**
 * Real website footage in a quiet browser frame: an address bar with the page's real address,
 * then real screenshots seen through the same virtual camera as ProofPanel. The screenshot can change
 * over time (states of the page after real clicks and typing), like a screen recording cut to the voice.
 * Never use it for things we draw ourselves: that is BrowserCard.
 */

/** Height of the address bar on top of the page. */
export const BAR_H = 72;

const BORDER = 4;

/** The part of a BrowserProof panel that shows the page (under the address bar), in frame pixels. Use it with toFrame(). */
export const viewOf = (panel: Rect): Rect => ({ x: panel.x + BORDER, y: panel.y + BORDER + BAR_H, w: panel.w, h: panel.h - BAR_H });

/** A camera key: [start time, camera, seconds the move takes (default 0.55)]. */
export type CamKey = [number, Cam, number?];

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** Camera at time t. Each key starts a move from where the camera is; zoom eases in log space. */
export function camPath(keys: CamKey[], t: number): Cam {
  let cam = keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [at, to, move = 0.55] = keys[i];
    if (t < at) break;
    const k = easeInOut(Math.min(1, (t - at) / move));
    const z = Math.exp(Math.log(cam.z) + (Math.log(to.z) - Math.log(cam.z)) * k);
    cam = { cx: cam.cx + (to.cx - cam.cx) * k, cy: cam.cy + (to.cy - cam.cy) * k, z };
  }
  return cam;
}

/** The value of the last key that has started: [from time, value][]. */
export function keyAt<T>(keys: [number, T][], t: number): T {
  let v = keys[0][1];
  for (const [at, val] of keys) if (at <= t) v = val;
  return v;
}

const Lock: React.FC = () => (
  <svg width={22} height={26} viewBox="0 0 22 26" style={{ flexShrink: 0 }}>
    <rect x={2} y={11} width={18} height={13} rx={3} fill={P.ink} />
    <path d="M6 11 V7.5 a5 5 0 0 1 10 0 V11" fill="none" stroke={P.ink} strokeWidth={3} />
  </svg>
);

const FileIcon: React.FC = () => (
  <svg width={22} height={26} viewBox="0 0 22 26" style={{ flexShrink: 0 }}>
    <path d="M3 2 H14 L20 8 V24 H3 Z" fill={P.card} stroke={P.ink} strokeWidth={2.6} strokeLinejoin="round" />
    <path d="M14 2 V8 H20" fill="none" stroke={P.ink} strokeWidth={2.6} strokeLinejoin="round" />
  </svg>
);

/** The address bar on its own (also used above drawn cards that need the same frame). */
export const AddressBar: React.FC<{ host: string; path?: string; icon?: "lock" | "file" }> = ({ host, path = "", icon = "lock" }) => (
  <div style={{ boxSizing: "border-box", height: BAR_H, background: P.paper2, borderBottom: `3px solid ${P.line}`, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", flexShrink: 0 }}>
    {[P.pink, P.gold, P.lime].map((c) => (
      <div key={c} style={{ width: 18, height: 18, borderRadius: 18, background: c, border: `2px solid ${P.ink}`, flexShrink: 0 }} />
    ))}
    <div
      style={{
        marginLeft: 12,
        flex: 1,
        height: 46,
        borderRadius: 23,
        background: P.card,
        border: `2px solid ${P.line}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 20px",
        fontFamily: mono,
        fontSize: 25,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {icon === "lock" ? <Lock /> : <FileIcon />}
      <span style={{ color: P.ink, fontWeight: 600 }}>{host}</span>
      {path && <span style={{ color: P.ink3, fontWeight: 500, marginLeft: -12 }}>{path}</span>}
    </div>
  </div>
);

export const BrowserProof: React.FC<{
  panel: Rect;
  host: string;
  path?: string;
  icon?: "lock" | "file";
  shot: Shot;
  cam: Cam;
  enter: number;
  out: number;
  /** Page background outside the screenshot (dark pages need a dark one). */
  pageBg?: string;
  children?: React.ReactNode;
}> = ({ panel, host, path, icon, shot, cam, enter, out, pageBg = P.card, children }) => {
  const view = viewOf(panel);
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
        background: pageBg,
        border: `${BORDER}px solid ${P.ink}`,
        boxShadow: shadow.soft,
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${(1 - enter) * 340 + out * 120}px) scale(${(0.7 + 0.3 * enter) * (1 - 0.12 * out)}) rotate(${(1 - Math.min(enter, 1)) * -5}deg)`,
        opacity: Math.min(1, enter * 1.5) * (1 - out),
      }}
    >
      <AddressBar host={host} path={path} icon={icon} />
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: shot.width,
            height: shot.height,
            transformOrigin: "0 0",
            transform: `translate(${view.w / 2 - cam.cx * cam.z}px, ${view.h / 2 - cam.cy * cam.z}px) scale(${cam.z})`,
          }}
        >
          <Img src={staticFile(shot.file)} style={{ position: "absolute", left: 0, top: 0, width: shot.width, height: shot.height }} />
          {children}
        </div>
      </div>
    </div>
  );
};
