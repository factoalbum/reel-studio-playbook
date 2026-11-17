import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneShell } from "../components/SceneShell";
import { range, useAbsT, usePop } from "../components/motion";
import { colors, fontFamily } from "../theme";

type Props = { start: number; end: number; commentAt: number; followAt: number; part2At: number };

/** Scene 4: LEARN comment bubble, follow button, PART 2 stamp. */
export const SceneCta: React.FC<Props> = ({ start, end, commentAt, followAt, part2At }) => {
  const t = useAbsT(start);
  const bubble = usePop(t, commentAt, { damping: 10, stiffness: 150 });
  const letters = Math.floor(range(t, commentAt + 0.15, commentAt + 0.75) * 5);
  const word = "LEARN".slice(0, letters);
  const send = usePop(t, commentAt + 0.85, { damping: 8, stiffness: 220 });
  const followIn = usePop(t, followAt - 0.35, { damping: 11 });
  const tap = t >= followAt;
  const press = tap ? 1 - 0.1 * Math.max(0, 1 - (t - followAt) / 0.18) : 1;
  const done = usePop(t, followAt + 0.05, { damping: 10, stiffness: 180 });
  const part2 = usePop(t, part2At, { damping: 11, stiffness: 200, mass: 0.7 });
  const burst = range(t, part2At, part2At + 0.5);
  return (
    <SceneShell start={start} end={end}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 100, width: 880, top: 370, opacity: Math.min(1, bubble * 2) }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 54, color: colors.cyan, letterSpacing: 4, marginBottom: 18, textAlign: "center" }}>COMMENT</div>
          <div style={{ transform: `scale(${0.5 + 0.5 * bubble})`, background: colors.white, borderRadius: 60, height: 150, display: "flex", alignItems: "center", padding: "0 30px", boxShadow: `0 0 60px ${colors.cyan}55, 0 30px 70px #00000066` }}>
            <div style={{ width: 80, height: 80, borderRadius: 80, background: `linear-gradient(135deg, ${colors.cyan}, ${colors.yellow})`, marginRight: 24, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily, fontWeight: 900, fontSize: 84, color: colors.navy, letterSpacing: 2 }}>
              {word}
              <span style={{ opacity: Math.floor(t * 4) % 2 === 0 && letters < 5 ? 1 : 0, color: colors.cyan }}>|</span>
            </div>
            <div style={{ width: 84, height: 84, borderRadius: 84, background: colors.cyan, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * send})`, fontSize: 44, color: colors.navy, fontWeight: 900 }}>➤</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 100, width: 880, top: 740, display: "flex", justifyContent: "center", transform: `scale(${followIn * press})`, opacity: Math.min(1, followIn * 2) }}>
          <div
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: 64,
              borderRadius: 70,
              padding: "26px 70px",
              color: tap ? colors.navy : colors.navy,
              background: tap && done > 0.5 ? colors.yellow : colors.cyan,
              boxShadow: `0 0 60px ${(tap && done > 0.5 ? colors.yellow : colors.cyan) + "88"}`,
              letterSpacing: -1,
            }}
          >
            {tap && done > 0.5 ? "✓ FOLLOWING" : "+ FOLLOW"}
          </div>
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          const r1 = 250 + burst * 120;
          return (
            <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r1 - 6, top: 1060 + Math.sin(a) * r1 * 0.7 - 30, width: 12, height: 60, borderRadius: 6, background: i % 2 ? colors.cyan : colors.yellow, opacity: burst > 0 ? 1 - burst : 0, transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }} />
          );
        })}
        <div style={{ position: "absolute", left: 100, width: 880, top: 940, display: "flex", justifyContent: "center", transform: `scale(${part2}) rotate(${-6 + (1 - Math.min(part2, 1)) * 14}deg)`, opacity: Math.min(1, part2 * 2) }}>
          <div style={{ fontFamily, fontWeight: 900, fontSize: 168, lineHeight: 1, letterSpacing: -4, color: colors.navy, background: colors.yellow, borderRadius: 40, padding: "18px 56px", boxShadow: `0 0 90px ${colors.yellow}88, 0 24px 0 #A16207` }}>PART 2</div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
