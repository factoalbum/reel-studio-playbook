import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { claude as ep } from "./episodes/claude";
import { ApiScene, CAM_ORIGIN, cam, CommentScene, FollowScene, GeminiScene, HookScene, InstallScene, LoginScene, ProScene, ReviewScene, ThreeScene, Wipes } from "./claude/Scenes";

/**
 * Creator Secrets #05: Claude Code comes with Claude Pro, 3 setup steps, API billing, and the Gemini CLI update.
 * Remotion is the master timeline; every scene reads its times from src/episodes/claude.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelClaude: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <ProScene t={t} />
        <ThreeScene t={t} />
        <InstallScene t={t} />
        <LoginScene t={t} />
        <ReviewScene t={t} />
        <ApiScene t={t} />
        <GeminiScene t={t} />
        <CommentScene t={t} />
        <FollowScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      </div>
      <Wipes t={t} />
      <BrandBug />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
