import React from "react";

/** Original vector ruler: 15 cm with millimetre ticks. `shine` (0 to 1) sweeps a highlight across it. */
export const Ruler: React.FC<{ width?: number; height?: number; shine?: number }> = ({ width = 760, height = 150, shine = 0 }) => {
  const cm = 15;
  const step = (width - 60) / (cm * 10);
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= cm * 10; i++) {
    const x = 30 + i * step;
    const major = i % 10 === 0;
    const mid = i % 5 === 0;
    ticks.push(<line key={i} x1={x} x2={x} y1={0} y2={major ? 56 : mid ? 40 : 26} stroke="#3B2F05" strokeWidth={major ? 4 : 2.4} strokeLinecap="round" />);
    if (major) {
      ticks.push(
        <text key={`n${i}`} x={x} y={96} textAnchor="middle" fontSize={34} fontWeight={800} fill="#3B2F05" fontFamily="Montserrat, sans-serif">
          {i / 10}
        </text>
      );
    }
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="rulerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#FACC15" />
        </linearGradient>
        <linearGradient id="shineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.65" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="rulerClip">
          <rect x="0" y="0" width={width} height={height} rx="18" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width={width} height={height} rx="18" fill="url(#rulerGrad)" />
      <g clipPath="url(#rulerClip)">
        {ticks}
        <rect x={shine * (width + 200) - 160} y="-10" width="120" height={height + 20} fill="url(#shineGrad)" transform="skewX(-18)" />
      </g>
      <rect x="2" y="2" width={width - 4} height={height - 4} rx="17" fill="none" stroke="#FFFFFF55" strokeWidth="3" />
    </svg>
  );
};
