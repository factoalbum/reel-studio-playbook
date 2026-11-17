import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./components/Background";
import { Guide } from "./components/Guide";
import { WordCaptions } from "./components/WordCaptions";
import { HookScene } from "./v3/HookScene";
import { WebsiteScene } from "./v3/WebsiteScene";
import { CrazyScene } from "./v3/CrazyScene";
import { BuildScene } from "./v3/BuildScene";
import { CtaScene } from "./v3/CtaScene";
import { reel01v3 as ep } from "./episodes/reel01v3";
import { colors, fontFamily, SAFE } from "./theme";

const Brand: React.FC = () => (
  <div style={{ position: "absolute", left: SAFE.left, top: 258, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 54, height: 54, borderRadius: 12, background: colors.cyan, color: colors.navy, fontFamily, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>IT</div>
    <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: colors.white, letterSpacing: 1, opacity: 0.9 }}>INTERNET TOOLBOX</div>
  </div>
);

const Disclaimer: React.FC = () => (
  <div style={{ position: "absolute", right: 1080 - SAFE.right, top: 262, textAlign: "right", fontFamily, fontWeight: 600, fontSize: 22, lineHeight: 1.3, color: colors.muted, opacity: 0.9 }}>
    {ep.disclaimer.map((l) => (
      <div key={l}>{l}</div>
    ))}
  </div>
);

/** The music bed ducks under the voice: louder in pauses, quieter while words are spoken. */
function musicVolume(f: number) {
  let e = 0;
  for (let i = f - 6; i <= f + 2; i++) e = Math.max(e, ep.env[Math.max(0, Math.min(ep.env.length - 1, i))] ?? 0);
  return 0.4 * (1 - 0.5 * Math.min(1, e * 1.4));
}

/** `cover` hides the captions and progress bar, for rendering the Instagram cover image. */
export const Reel01v3: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.navy }}>
      <Background />
      <CrazyScene t={t} />
      <HookScene t={t} />
      <WebsiteScene t={t} />
      <BuildScene t={t} />
      <CtaScene t={t} />
      <Guide keys={ep.guideKeys} places={ep.guidePlaces} env={ep.env} blinks={ep.blinks} />
      <Brand />
      <Disclaimer />
      {!cover && <WordCaptions captions={ep.captions} top={1170} />}
      {!cover && <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${(frame / durationInFrames) * 100}%`, background: colors.cyan }} />}
      <Audio src={staticFile(ep.voiceover)} />
      <Audio src={staticFile(ep.music)} volume={musicVolume} />
      {ep.sfx.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.round(at * fps)} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
