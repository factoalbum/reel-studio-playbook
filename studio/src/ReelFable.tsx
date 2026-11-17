import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { fable as ep } from "./episodes/fable";
import { BillingScene, CAM_ORIGIN, cam, CommentScene, FollowScene, HiggsScene, HookScene, HowScene, RevealScene, Step1Scene, Step2Scene, Step3Scene, Streaks, ThreeScene, Wipes } from "./fable/Scenes";

/**
 * Creator Secrets #06: Claude Fable 5.2 + the Higgsfield MCP connector (3 steps, the reveal, billing terms).
 * Remotion is the master timeline; every scene reads its times from src/episodes/fable.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelFable: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <HiggsScene t={t} />
        <HowScene t={t} />
        <ThreeScene t={t} />
        <Step1Scene t={t} />
        <Step2Scene t={t} />
        <Step3Scene t={t} />
        <RevealScene t={t} />
        <BillingScene t={t} />
        <CommentScene t={t} />
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
