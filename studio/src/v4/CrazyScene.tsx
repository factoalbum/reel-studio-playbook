import React from "react";
import { palette as P } from "../brand/tokens";
import { Mark } from "../brand/Bits";
import { range, usePop } from "../components/motion";

/** "Aur sabse crazy baat?" (9.2 to 10.8 s): soft lime rays behind the avatar and two reaction marks. */
export const CrazyScene: React.FC<{ t: number }> = ({ t }) => {
  const p = usePop(t, 9.25, { damping: 14, stiffness: 120, mass: 0.8 });
  if (t < 9.2 || t > 10.85) return null;
  const out = range(t, 10.6, 10.8);
  const spin = (t - 9.2) * 14;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: (1 - out) * Math.min(1, p * 1.4) }}>
      <svg width={1600} height={1600} viewBox="-800 -800 1600 1600" style={{ position: "absolute", left: 540 - 800, top: 1000 - 800, transform: `scale(${0.6 + 0.4 * p}) rotate(${spin}deg)` }}>
        {Array.from({ length: 16 }, (_, i) => {
          const a0 = (i / 16) * Math.PI * 2;
          const a1 = a0 + Math.PI / 30;
          return <path key={i} d={`M0 0 L${Math.cos(a0) * 800} ${Math.sin(a0) * 800} L${Math.cos(a1) * 800} ${Math.sin(a1) * 800} Z`} fill={i % 2 ? P.gold : P.lime} opacity={i % 2 ? 0.22 : 0.45} />;
        })}
      </svg>
      <Mark t={t} at={9.82} x={790} y={600} text="!?" color={P.lime} size={150} rot={12} />
      <Mark t={t} at={9.95} x={150} y={640} text="!!" color={P.card} size={150} rot={-12} />
    </div>
  );
};
