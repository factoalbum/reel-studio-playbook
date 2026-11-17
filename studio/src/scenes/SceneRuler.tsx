import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { Ruler } from "../components/Ruler";
import { SceneShell } from "../components/SceneShell";
import { Title } from "../components/Title";
import { range, useAbsT, usePop } from "../components/motion";
import { colors, fontFamily } from "../theme";

type Props = { start: number; end: number; titleAt: number; screenshot?: string };

/** Scene 1: a dramatic zoom onto a plain browser tool, then the title slams in. */
export const SceneRuler: React.FC<Props> = ({ start, end, titleAt, screenshot }) => {
  const t = useAbsT(start);
  const reveal = range(t, 0, 1.0);
  const zoom = 1 + 1.35 * (1 - reveal) + 0.07 * range(t, 1.0, end);
  const sinceSlam = Math.max(0, t - titleAt);
  const shake = sinceSlam < 0.5 ? Math.sin(sinceSlam * 70) * 14 * (1 - sinceSlam / 0.5) : 0;
  const shine = range(t, 1.1, 1.9) + range(t, 3.4, 4.2) * 0.0;
  const shine2 = range(t, 3.4, 4.3);
  const q = usePop(t, titleAt + 0.1);
  return (
    <SceneShell start={start} end={end} first>
      <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
        <div style={{ position: "absolute", left: 100, top: 720, transform: `scale(${zoom})`, transformOrigin: "440px 270px" }}>
          <BrowserFrame width={880} height={560} glow={0.4 + 0.4 * reveal}>
            {screenshot ? (
              <Img src={staticFile(screenshot)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ transform: "scale(1.0)" }}>
                <Ruler width={780} height={160} shine={Math.max(shine, shine2)} />
              </div>
            )}
          </BrowserFrame>
        </div>
        <Title t={t} at={titleAt} top={345} lines={[{ text: "JUST A", size: 118 }, { text: "RULER?!", size: 168, color: colors.yellow }]} />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: [90, 905, 520][i],
              top: [655, 650, 640][i],
              fontFamily,
              fontWeight: 900,
              fontSize: [70, 70, 0][i],
              color: colors.cyan,
              opacity: Math.min(1, q * 1.4) * 0.9,
              transform: `translateY(${Math.sin(t * 3 + i) * 10}px) rotate(${(i - 1) * 12}deg) scale(${q})`,
            }}
          >
            ?
          </div>
        ))}
      </AbsoluteFill>
    </SceneShell>
  );
};
