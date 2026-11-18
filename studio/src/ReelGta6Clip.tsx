import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { gta6clip as ep } from "./episodes/gta6clip";
import { CAM_ORIGIN, cam, CtaScene, HonestScene, HookScene, NumberScene, Step1Scene, Step2Scene, Step3Scene, Step4Scene, Streaks, ViceBackdrop, WhatScene, Wipes } from "./gta6clip/Scenes";

/**
 * Creator Secrets: GTA 6 launch-day clipping → real rate → 4 steps → permission → comment / type GTA6.
 * Remotion is the master timeline; every scene reads its times from src/episodes/gta6clip.ts. `cover` hides the
 * subtitles and progress bar.
 */
export const ReelGta6Clip: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <ViceBackdrop t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <WhatScene t={t} />
        <NumberScene t={t} />
        <Step1Scene t={t} />
        <Step2Scene t={t} />
        <Step3Scene t={t} />
        <Step4Scene t={t} />
        <HonestScene t={t} />
        <CtaScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      </div>
      <Streaks t={t} />
      <Wipes t={t} />
      <BrandBug />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
