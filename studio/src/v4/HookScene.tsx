import React from "react";
import { LAYOUT, palette as P } from "../brand/tokens";
import { HeroTitle } from "../brand/Headline";
import { Coin, Mark } from "../brand/Bits";
import { range, usePop } from "../components/motion";

/** Hook (0 to 2.8 s): the title slams in over the surprised avatar, then shrinks into the header for the website reveal. */
export const HookScene: React.FC<{ t: number }> = ({ t }) => {
  if (t > 6.75) return null;
  const shrink = range(t, 2.78, 3.12);
  const out = range(t, 6.45, 6.7);
  const shake = t > 0.14 && t < 0.6 ? Math.sin(t * 90) * 12 * (1 - (t - 0.14) / 0.46) : 0;
  const marksOut = range(t, 2.7, 2.9);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "540px 336px",
          transform: `translate(${shake}px, ${-out * 40}px) scale(${1 - 0.38 * shrink})`,
          opacity: 1 - out,
        }}
      >
        <HeroTitle
          t={t}
          at={0.12}
          top={LAYOUT.headerTop}
          lines={[
            { text: "Ruler website", size: 100 },
            { text: "se paisa?!", size: 132, tone: "lime" },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - marksOut }}>
        <Mark t={t} at={0.55} x={150} y={690} text="?" color={P.lime} size={150} rot={-14} />
        <Mark t={t} at={0.8} x={860} y={660} text="!" color={P.card} size={160} rot={12} />
        <Mark t={t} at={2.3} x={880} y={900} text="?" color={P.gold} size={110} rot={16} />
        <RulerSticker t={t} at={0.86} x={40} y={900} />
        <HookCoin t={t} at={2.3} x={70} y={1040} />
      </div>
    </>
  );
};

const RulerSticker: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 9, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: x, top: y + Math.sin((t - at) * 4) * 6, transform: `scale(${p}) rotate(-18deg)`, opacity: Math.min(1, p * 2) }}>
      <svg width={200} height={74} viewBox="0 0 200 74" style={{ overflow: "visible" }}>
        <rect x={9} y={9} width={184} height={58} rx={12} fill={P.ink} />
        <rect x={3} y={3} width={184} height={58} rx={12} fill={P.lime} stroke={P.ink} strokeWidth={6} />
        {Array.from({ length: 17 }, (_, i) => (
          <line key={i} x1={14 + i * 10} x2={14 + i * 10} y1={6} y2={i % 5 === 0 ? 34 : 22} stroke={P.ink} strokeWidth={i % 5 === 0 ? 4 : 2.5} strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
};

const HookCoin: React.FC<{ t: number; at: number; x: number; y: number }> = ({ t, at, x, y }) => {
  const p = usePop(t, at, { damping: 8, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: x, top: y - p * 30, transform: `scale(${p})`, opacity: Math.min(1, p * 2) }}>
      <Coin size={96} spin={Math.cos((t - at) * 7)} />
    </div>
  );
};
