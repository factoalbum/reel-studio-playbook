import React from "react";
import { AbsoluteFill } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { Ruler } from "../components/Ruler";
import { SceneShell } from "../components/SceneShell";
import { Title } from "../components/Title";
import { range, useAbsT, usePop } from "../components/motion";
import { colors, fontFamily, monoFamily } from "../theme";

type Props = { start: number; end: number; codeAt: number; titleAt: number; pillAt: number; morphAt: number; howAt: number };

const CODE = [
  '<div class="ruler">',
  '  <ticks count="150" />',
  "</div>",
  "",
  "function measure(px) {",
  "  return px / dpi * 2.54;",
  "}",
];

/** Scene 3: code turns into a simple browser tool. "You can build this / free to start". */
export const SceneBuild: React.FC<Props> = ({ start, end, codeAt, titleAt, pillAt, morphAt, howAt }) => {
  const t = useAbsT(start);
  const total = CODE.join("\n").length;
  const typed = Math.floor(range(t, codeAt, morphAt - 0.2) * total);
  let remaining = typed;
  const shown = CODE.map((line) => {
    const take = Math.max(0, Math.min(line.length, remaining));
    remaining -= line.length + 1;
    return line.slice(0, take);
  });
  const m = range(t, morphAt, morphAt + 0.55);
  const pill = usePop(t, pillAt, { damping: 10, stiffness: 170 });
  const howP = usePop(t, howAt, { damping: 8, stiffness: 200 });
  const showHow = t >= howAt;
  const titleOut = showHow ? 0 : 1;
  return (
    <SceneShell start={start} end={end}>
      <AbsoluteFill>
        <div style={{ opacity: titleOut }}>
          <Title t={t} at={titleAt} top={345} lines={[{ text: "YOU CAN", size: 120 }, { text: "BUILD THIS", size: 140, color: colors.cyan }]} />
        </div>
        {showHow && (
          <div
            style={{
              position: "absolute",
              left: 60,
              width: 960,
              top: 370,
              textAlign: "center",
              fontFamily,
              fontWeight: 900,
              fontSize: 230,
              color: colors.yellow,
              transform: `scale(${0.4 + 0.6 * Math.min(howP, 1.1)}) rotate(${(1 - Math.min(howP, 1)) * -10}deg)`,
              opacity: Math.min(1, howP * 2),
              WebkitTextStroke: `14px ${colors.navy}`,
              paintOrder: "stroke fill",
              textShadow: `0 10px 0 ${colors.navy}, 0 0 60px ${colors.yellow}66`,
            }}
          >
            HOW?
          </div>
        )}
        <div style={{ position: "absolute", left: 100, top: 720, width: 880, height: 440, perspective: 1600 }}>
          <div style={{ position: "absolute", inset: 0, transform: `rotateY(${m * 90}deg)`, opacity: m >= 1 ? 0 : 1, backfaceVisibility: "hidden" }}>
            <div style={{ width: 880, height: 440, borderRadius: 34, background: "#0B1430", border: `3px solid ${colors.cyan}66`, boxShadow: `0 0 60px ${colors.cyan}33, 0 40px 90px #00000088`, padding: "34px 44px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", gap: 14, marginBottom: 26 }}>
                {["#FB7185", "#FACC15", "#4ADE80"].map((c) => (
                  <div key={c} style={{ width: 20, height: 20, borderRadius: 20, background: c }} />
                ))}
              </div>
              {shown.map((l, i) => (
                <div key={i} style={{ fontFamily: monoFamily, fontWeight: 500, fontSize: 36, lineHeight: 1.45, color: i < 3 ? colors.cyan : colors.yellow, whiteSpace: "pre", minHeight: 52 }}>
                  {l}
                  {i === shown.findIndex((x, idx) => x.length < CODE[idx].length) && Math.floor(t * 4) % 2 === 0 ? "▍" : ""}
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", inset: 0, transform: `rotateY(${-90 + m * 90}deg)`, opacity: m <= 0 ? 0 : 1, backfaceVisibility: "hidden" }}>
            <BrowserFrame width={880} height={440} label="your tool" glow={0.8}>
              <Ruler width={760} height={150} shine={range(t, morphAt + 0.5, morphAt + 1.3)} />
            </BrowserFrame>
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1120, display: "flex", justifyContent: "center", transform: `scale(${pill}) rotate(-3deg)`, opacity: Math.min(1, pill * 2) }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 56, color: colors.navy, background: colors.yellow, borderRadius: 60, padding: "14px 48px", boxShadow: `0 0 50px ${colors.yellow}77`, letterSpacing: -1 }}>FREE TO START ✓</div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
