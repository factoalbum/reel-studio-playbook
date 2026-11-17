import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { C, launch as ep } from "./episodes/launch";
import {
  CAM_ORIGIN,
  cam,
  CtaScene,
  DarkBug,
  DarkRoom,
  FilesScene,
  FollowScene,
  HookFront,
  HookScene,
  JourneyScene,
  OpenerLaptop,
  PriceScene,
  ProblemScene,
  RevealScene,
  ValueScene,
  Wipes,
} from "./launch/Scenes";

/**
 * Official ebook launch reel, Episode 01, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/launch.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelLaunch: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <DarkRoom t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <OpenerLaptop t={t} />
        <HookScene t={t} />
        <ProblemScene t={t} />
        <RevealScene t={t} />
        <FilesScene t={t} />
        <ValueScene t={t} />
        <PriceScene t={t} />
        <JourneyScene t={t} />
        <CtaScene t={t} />
        <FollowScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
        <HookFront t={t} />
      </div>
      <Wipes t={t} />
      {t < C.reveal + 0.22 ? <DarkBug t={t} /> : <BrandBug />}
      {t > C.reveal + 0.3 && t < C.rupaye + 0.6 && <Disclaimer lines={ep.disclaimer} />}
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
