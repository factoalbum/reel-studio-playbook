import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { gta6 as ep } from "./episodes/gta6";
import { BuildScene, CAM_ORIGIN, cam, ChatScene, DateScene, FollowScene, GameOnScene, HookScene, IntroScene, KitScene, LinkScene, Streaks, TimelineScene, VoiceScene, Wipes } from "./gta6/Scenes";

/**
 * Creator Secrets: GTA 6 hype → how these reels are made (ChatGPT, Google AI Studio, Claude Code, Remotion) →
 * the AI Reel Kit, link in bio. Remotion is the master timeline; every scene reads its times from
 * src/episodes/gta6.ts. `cover` hides the subtitles and progress bar.
 */
export const ReelGta6: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <DateScene t={t} />
        <IntroScene t={t} />
        <ChatScene t={t} />
        <VoiceScene t={t} />
        <GameOnScene t={t} />
        <BuildScene t={t} />
        <TimelineScene t={t} />
        <KitScene t={t} />
        <LinkScene t={t} />
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
