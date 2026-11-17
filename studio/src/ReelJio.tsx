import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { jio as ep } from "./episodes/jio";
import { BonusScene, CAM_ORIGIN, cam, CountdownScene, CtaScene, HookScene, OpenerBg, SeriesTag, ShareScene, TeaseScene, UseScene, WarningScene, Wipes } from "./jio/Scenes";

/**
 * Creator Secrets #04: "Jio ne AI free diya? (5 use cases)", in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/jio.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelJio: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <OpenerBg t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <CountdownScene t={t} />
        {[0, 1, 2, 3, 4].map((i) => (
          <UseScene key={i} t={t} i={i} />
        ))}
        <TeaseScene t={t} />
        <BonusScene t={t} />
        <WarningScene t={t} />
        <ShareScene t={t} />
        <CtaScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
        <SeriesTag t={t} />
      </div>
      <Wipes t={t} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
