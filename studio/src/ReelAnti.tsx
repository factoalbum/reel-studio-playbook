import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { anti as ep } from "./episodes/anti";
import { CAM_ORIGIN, cam, CtaScene, EngineScene, FollowScene, FreeScene, HookScene, MakeScene, OpenScene, QcScene, StepsScene, Streaks, StyleScene, TwistScene, Wipes } from "./anti/Scenes";

/**
 * Creator Secrets: "Claude par ₹2,000... sirf reels edit karne ke liye?!" → Google Antigravity's free plan in four
 * steps → the 18 Nov model change → check it yourself → comment EDIT. Remotion is the master timeline; every scene
 * reads its times from src/episodes/anti.ts. `cover` hides the subtitles and progress bar.
 */
export const ReelAnti: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <FreeScene t={t} />
        <StepsScene t={t} />
        <OpenScene t={t} />
        <EngineScene t={t} />
        <StyleScene t={t} />
        <MakeScene t={t} />
        <TwistScene t={t} />
        <QcScene t={t} />
        <CtaScene t={t} />
        <FollowScene t={t} />
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
