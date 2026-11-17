import React from "react";
import { AbsoluteFill, random } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { SceneShell } from "../components/SceneShell";
import { Title } from "../components/Title";
import { range, useAbsT, usePop } from "../components/motion";
import { colors, fontFamily } from "../theme";

type Props = { start: number; end: number; titleAt: number; adAt: number; coinsAt: number };

const CARD = { x: 540, y: 930 };

const Visitor: React.FC<{ x: number; y: number; scale: number; opacity: number; color: string }> = ({ x, y, scale, opacity, color }) => (
  <div style={{ position: "absolute", left: x - 40, top: y - 48, width: 80, height: 96, opacity, transform: `scale(${scale})` }}>
    <div style={{ position: "absolute", left: 22, top: 0, width: 36, height: 36, borderRadius: 36, background: color }} />
    <div style={{ position: "absolute", left: 4, top: 44, width: 72, height: 50, borderRadius: "36px 36px 12px 12px", background: color }} />
  </div>
);

const Coin: React.FC<{ x: number; y: number; r: number; rot: number; opacity: number }> = ({ x, y, r, rot, opacity }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, background: `radial-gradient(circle at 35% 30%, #FEF08A, ${colors.yellow} 60%, #CA8A04)`, border: "5px solid #A16207", opacity, transform: `rotateY(${rot}deg)`, boxShadow: `0 0 30px ${colors.yellow}88` }}>
    <div style={{ position: "absolute", inset: r * 0.3, borderRadius: r * 2, border: "4px solid #CA8A04" }} />
  </div>
);

/** Scene 2: visitors flow into a website, an ad appears, coins pop out. */
export const SceneTraffic: React.FC<Props> = ({ start, end, titleAt, adAt, coinsAt }) => {
  const t = useAbsT(start);
  const card = usePop(t, start + 0.05, { damping: 14 });
  const ad = usePop(t, adAt, { damping: 9, stiffness: 160 });
  const visitors = Array.from({ length: 24 }, (_, i) => i);
  return (
    <SceneShell start={start} end={end}>
      <AbsoluteFill>
        <Title t={t} at={titleAt} top={340} lines={[{ text: "TRAFFIC", color: colors.cyan, size: 150 }, { text: "= POTENTIAL", color: colors.yellow, size: 104 }]} tilt={2} />
        <div style={{ position: "absolute", left: CARD.x - 340, top: CARD.y - 220, transform: `scale(${0.6 + 0.4 * card})`, opacity: card }}>
          <BrowserFrame width={680} height={440} label="your website" glow={0.6}>
            <div style={{ width: 460, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ height: 36, borderRadius: 10, background: colors.navy3, width: "70%" }} />
              <div style={{ height: 20, borderRadius: 10, background: "#CBD5E1", width: "100%" }} />
              <div style={{ height: 20, borderRadius: 10, background: "#CBD5E1", width: "88%" }} />
              <div style={{ height: 70, borderRadius: 14, background: `linear-gradient(90deg, ${colors.yellow}, #FDE68A)`, width: "62%" }} />
            </div>
          </BrowserFrame>
        </div>
        {visitors.map((i) => {
          const left = i % 2 === 0;
          const t0 = start + 0.4 + i * 0.17;
          const p = range(t, t0, t0 + 1.5);
          const sx = left ? -80 : 1160;
          const sy = 720 + random(`vy${i}`) * 480;
          const x = sx + (CARD.x - sx) * p;
          const y = sy + (CARD.y - sy) * p + Math.sin(p * Math.PI) * -90;
          const o = p <= 0 ? 0 : p > 0.9 ? 1 - (p - 0.9) * 10 : 1;
          return <Visitor key={i} x={x} y={y} scale={1.0 - 0.45 * p} opacity={o} color={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.cyan : colors.white} />;
        })}
        <div style={{ position: "absolute", left: 730, top: 690, transform: `scale(${ad}) rotate(${(1 - Math.min(ad, 1)) * 18}deg)`, opacity: Math.min(1, ad * 2) }}>
          <div style={{ width: 250, height: 170, borderRadius: 24, background: colors.white, border: `5px solid ${colors.yellow}`, boxShadow: `0 0 50px ${colors.yellow}66`, padding: 18, boxSizing: "border-box" }}>
            <div style={{ display: "inline-block", fontFamily, fontWeight: 900, fontSize: 28, color: colors.navy, background: colors.yellow, borderRadius: 8, padding: "2px 12px" }}>AD</div>
            <div style={{ height: 16, borderRadius: 8, background: "#CBD5E1", marginTop: 16, width: "90%" }} />
            <div style={{ height: 16, borderRadius: 8, background: "#CBD5E1", marginTop: 10, width: "60%" }} />
          </div>
        </div>
        {Array.from({ length: 9 }, (_, i) => {
          const t0 = coinsAt + i * 0.07;
          const p = t < t0 ? -1 : t - t0;
          if (p < 0) return null;
          const dir = (i - 4) / 4;
          const x = CARD.x + dir * 260 + Math.sin(i * 3) * 30;
          const y = CARD.y - 180 - p * 520 + p * p * 700;
          const o = Math.max(0, 1 - Math.max(0, p - 1.0) * 2);
          return <Coin key={i} x={x} y={y} r={38 + (i % 3) * 8} rot={p * 540} opacity={o} />;
        })}
      </AbsoluteFill>
    </SceneShell>
  );
};
