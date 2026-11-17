import React from "react";
import { LAYOUT, mono, palette as P, sans, shadow, type } from "../brand/tokens";
import { BrowserCard } from "../brand/ProofPanel";
import { Headline } from "../brand/Headline";
import { Sticker } from "../brand/Bits";
import { range, usePop } from "../components/motion";

/** "Tum ise free mein bana sakte ho! Kaise?" (10.75 to 14.1 s): code types itself, flips into your own tool page, then a big "?". */
const PANEL = LAYOUT.panel;
const CODE: { text: string; color: string; indent: number }[] = [
  { text: '<div class="ruler">', color: P.lime, indent: 0 },
  { text: '<ticks count="300" />', color: "#D8F68F", indent: 1 },
  { text: "</div>", color: P.lime, indent: 0 },
  { text: "function measure(px) {", color: P.gold, indent: 0 },
  { text: "return px / dpi * 2.54;", color: P.paper, indent: 1 },
  { text: "}", color: P.gold, indent: 0 },
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
      <Headline
        t={t}
        top={LAYOUT.headerTop}
        inAt={10.98}
        outAt={13.95}
        lines={[
          { size: 88, segs: [{ text: "Build your own", at: 10.98 }] },
          { size: 80, segs: [{ text: "tool website", at: 11.18, tone: "lime" }] },
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
              background: P.ink,
              border: `4px solid ${P.ink}`,
              boxShadow: shadow.soft,
              transform: `rotateY(${codeAngle}deg)`,
              padding: "34px 40px",
              fontFamily: mono,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.62,
            }}
          >
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              {[P.pink, P.gold, P.lime].map((c) => (
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
                  {caret && <span style={{ color: P.paper, opacity: Math.floor(t * 6) % 2 ? 1 : 0.2 }}>▌</span>}
                </div>
              );
            })}
          </div>
        )}
        {siteAngle < 90 && (
          <div style={{ position: "absolute", inset: 0, transform: `rotateY(${-siteAngle}deg)` }}>
            <BrowserCard width={PANEL.w} height={PANEL.h} url="your-tool-website">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ ...type.label, fontSize: 24, color: P.olive }}>Free tool</div>
                <div style={{ ...type.display, fontSize: 56, color: P.ink }}>Online Ruler</div>
                <LimeRuler width={740} height={140} shine={range(t, 12.4, 13.2)} />
              </div>
            </BrowserCard>
          </div>
        )}
        {how > 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              background: `rgba(250,249,246,${Math.min(1, how) * 0.78})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: sans,
                fontWeight: 700,
                fontSize: 330,
                lineHeight: 1,
                color: P.lime,
                transform: `scale(${how}) rotate(${Math.sin((t - 13.28) * 9) * 8 * Math.max(0, 1 - (t - 13.28) / 0.8)}deg)`,
                textShadow: `16px 16px 0 ${P.ink}`,
                WebkitTextStroke: `16px ${P.ink}`,
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
      <Sticker size={52} rotate={-4} pop={p}>
        Free to start ✓
      </Sticker>
    </div>
  );
};

/** Our own ruler drawing for "your tool": lime, ink ticks, Plex numbers. `shine` (0 to 1) sweeps a highlight across it. */
const LimeRuler: React.FC<{ width: number; height: number; shine: number }> = ({ width, height, shine }) => {
  const cm = 10;
  const step = (width - 60) / (cm * 10);
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= cm * 10; i++) {
    const x = 30 + i * step;
    const major = i % 10 === 0;
    const mid = i % 5 === 0;
    ticks.push(<line key={i} x1={x} x2={x} y1={0} y2={major ? 54 : mid ? 38 : 24} stroke={P.ink} strokeWidth={major ? 4 : 2.4} strokeLinecap="round" />);
    if (major) {
      ticks.push(
        <text key={`n${i}`} x={x} y={94} textAnchor="middle" fontSize={32} fontWeight={700} fill={P.ink} fontFamily={sans}>
          {i / 10}
        </text>
      );
    }
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="v4shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="v4rulerClip">
          <rect x="0" y="0" width={width} height={height} rx="16" />
        </clipPath>
      </defs>
      <rect x="7" y="7" width={width} height={height} rx="16" fill={P.ink} />
      <rect x="0" y="0" width={width} height={height} rx="16" fill={P.lime} />
      <g clipPath="url(#v4rulerClip)">
        {ticks}
        <rect x={shine * (width + 200) - 160} y="-10" width="120" height={height + 20} fill="url(#v4shine)" transform="skewX(-18)" />
      </g>
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="15" fill="none" stroke={P.ink} strokeWidth="4" />
    </svg>
  );
};
