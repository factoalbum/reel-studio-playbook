import React from "react";
import { colors, fontFamily, monoFamily } from "../theme";
import { range, usePop } from "../components/motion";
import { BrowserFrame } from "../components/BrowserFrame";
import { Ruler } from "../components/Ruler";
import { KineticHeader } from "../components/KineticHeader";
import { PANEL } from "./WebsiteScene";

/** "Tum ise free mein bana sakte ho! Kaise?" (10.75 to 14.1 s): code types itself, flips into your own tool, then a big "?". */
const CODE: { text: string; color: string; indent: number }[] = [
  { text: '<div class="ruler">', color: colors.cyan, indent: 0 },
  { text: '<ticks count="300" />', color: "#A5B4FC", indent: 1 },
  { text: "</div>", color: colors.cyan, indent: 0 },
  { text: "function measure(px) {", color: colors.yellow, indent: 0 },
  { text: "return px / dpi * 2.54;", color: colors.white, indent: 1 },
  { text: "}", color: colors.yellow, indent: 0 },
];
const TYPE_FROM = 11.0;
const TYPE_TO = 11.8;
const FLIP = 11.86;

export const BuildScene: React.FC<{ t: number }> = ({ t }) => {
  const enter = usePop(t, 10.82, { damping: 14, stiffness: 130, mass: 0.8 });
  const how = usePop(t, 13.28, { damping: 8, stiffness: 190, mass: 0.7 });
  if (t < 10.75 || t > 14.2) return null;
  const out = range(t, 13.95, 14.15);
  const flip = range(t, FLIP, FLIP + 0.5);
  const codeAngle = Math.min(90, flip * 180);
  const siteAngle = Math.max(0, 90 - Math.max(0, flip * 180 - 90));
  const total = CODE.reduce((s, l) => s + l.text.length, 0);
  const typed = Math.floor(range(t, TYPE_FROM, TYPE_TO) * total);
  let left = typed;
  return (
    <>
      <KineticHeader
        t={t}
        top={326}
        inAt={10.98}
        outAt={13.95}
        lines={[
          { size: 88, segs: [{ text: "BUILD YOUR OWN", at: 10.98 }] },
          { size: 88, segs: [{ text: "TOOL WEBSITE", at: 11.18, color: colors.yellow }] },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          perspective: 1800,
          transform: `translateY(${(1 - enter) * 320 + out * 120}px) scale(${(0.75 + 0.25 * enter) * (1 - 0.1 * out)})`,
          opacity: Math.min(1, enter * 1.5) * (1 - out),
        }}
      >
        {codeAngle < 90 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              background: "#0B1226",
              border: `4px solid ${colors.cyan}88`,
              boxShadow: `0 0 70px ${colors.cyan}44, 0 40px 90px #00000099`,
              transform: `rotateY(${codeAngle}deg)`,
              padding: "34px 40px",
              fontFamily: monoFamily,
              fontWeight: 700,
              fontSize: 40,
              lineHeight: 1.62,
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              {["#FB7185", "#FACC15", "#4ADE80"].map((c) => (
                <div key={c} style={{ width: 18, height: 18, borderRadius: 18, background: c }} />
              ))}
            </div>
            {CODE.map((l, i) => {
              const n = Math.max(0, Math.min(l.text.length, left));
              left -= l.text.length;
              const caret = n < l.text.length && n > 0;
              return (
                <div key={i} style={{ color: l.color, paddingLeft: l.indent * 48, whiteSpace: "pre" }}>
                  {l.text.slice(0, n)}
                  {caret && <span style={{ color: colors.white, opacity: Math.floor(t * 6) % 2 ? 1 : 0.2 }}>▌</span>}
                </div>
              );
            })}
          </div>
        )}
        {siteAngle < 90 && (
          <div style={{ position: "absolute", inset: 0, transform: `rotateY(${-siteAngle}deg)` }}>
            <BrowserFrame width={PANEL.w} height={PANEL.h} label="your-tool-website" glow={0.7}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                <div style={{ fontFamily, fontWeight: 900, fontSize: 44, color: "#0A1128" }}>Online Ruler</div>
                <Ruler width={760} height={150} shine={range(t, 12.4, 13.2)} />
              </div>
            </BrowserFrame>
          </div>
        )}
        {how > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              background: `${colors.navy}${Math.round(Math.min(1, how) * 170).toString(16).padStart(2, "0")}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily,
                fontWeight: 900,
                fontSize: 330,
                lineHeight: 1,
                color: colors.yellow,
                transform: `scale(${how}) rotate(${Math.sin((t - 13.28) * 9) * 8 * Math.max(0, 1 - (t - 13.28) / 0.8)}deg)`,
                textShadow: `0 12px 0 ${colors.navy}, 0 0 70px ${colors.yellow}AA`,
                WebkitTextStroke: `16px ${colors.navy}`,
                paintOrder: "stroke fill",
              }}
            >
              ?
            </div>
          </div>
        )}
      </div>
      <FreePill t={t} out={out} />
    </>
  );
};

const FreePill: React.FC<{ t: number; out: number }> = ({ t, out }) => {
  const p = usePop(t, 11.4, { damping: 9, stiffness: 210, mass: 0.6 });
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, width: 1030, top: 1030, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 2) * (1 - out) }}>
      <div
        style={{
          transform: `scale(${p}) rotate(-4deg)`,
          fontFamily,
          fontWeight: 900,
          fontSize: 50,
          color: colors.navy,
          background: colors.yellow,
          border: `6px solid ${colors.navy}`,
          borderRadius: 60,
          padding: "6px 34px 8px",
          whiteSpace: "nowrap",
          boxShadow: `0 0 40px ${colors.yellow}88, 0 14px 30px #00000066`,
        }}
      >
        FREE TO START ✓
      </div>
    </div>
  );
};
