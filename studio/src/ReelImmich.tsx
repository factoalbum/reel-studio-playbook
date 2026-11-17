import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { immich as ep } from "./episodes/immich";
import {
  BackupScene,
  CAM_ORIGIN,
  cam,
  CtaScene,
  DarkVeil,
  FeatScene,
  HookScene,
  HookTitle,
  OwnScene,
  RevealScene,
  SearchScene,
  SeriesTag,
  ServerScene,
  SmashCut,
  SubsScene,
  Wipes,
} from "./immich/Scenes";

/**
 * Creator Secrets #02: Immich, a self-hosted Google Photos-like app, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/immich.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelImmich: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <DarkVeil t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <SubsScene t={t} />
        <OwnScene t={t} />
        <RevealScene t={t} />
        <FeatScene t={t} />
        <SearchScene t={t} />
        <ServerScene t={t} />
        <BackupScene t={t} />
        <CtaScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
        <SeriesTag t={t} />
      </div>
      <HookTitle t={t} />
      <Wipes t={t} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      <SmashCut t={t} />
      {!cover && <Subtitles captions={ep.captions.filter((c) => !ep.captionLow(c.start))} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => ep.captionLow(c.start))} top={ep.captionLowTop} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
