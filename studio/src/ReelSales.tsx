import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { C, sales as ep } from "./episodes/sales";
import { CAM_ORIGIN, cam, ChallengeScene, CommentScene, DraftScene, FollowScene, HonestNote, HookScene, HowScene, KitScene, LinkScene, NoAdsScene, TopmateScene, Wipes } from "./sales/Scenes";

/**
 * Build in Public, Episode 02: how I made my first ebook sales, in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/sales.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelSales: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <NoAdsScene t={t} />
        <HowScene t={t} />
        <DraftScene t={t} />
        <KitScene t={t} />
        <TopmateScene t={t} />
        <ChallengeScene t={t} />
        <CommentScene t={t} />
        <LinkScene t={t} />
        <FollowScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      </div>
      <HonestNote t={t} at={0.35} out={C.noAds} />
      <Wipes t={t} />
      <BrandBug />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
