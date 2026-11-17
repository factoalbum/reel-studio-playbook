import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { fable52 as ep } from "./episodes/fable52";
import { CAM_ORIGIN, cam, CommentScene, CountScene, FollowScene, HookScene, KitScene, MascotScene, PlanScene, ProScene, Streaks, Wipes, WorkflowScene } from "./fable52/Scenes";

/**
 * "Fable 5.2 free?! 3 things to try": the Claude Pro launch offer, then a countdown 3 → 2 → 1 (your 3D animal
 * mascot, a 2027 month-by-month plan, a Claude Code reel workflow), comment KIT, follow.
 * Remotion is the master timeline; every scene reads its times from src/episodes/fable52.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelFable52: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <ProScene t={t} />
        <CountScene t={t} />
        <MascotScene t={t} />
        <PlanScene t={t} />
        <WorkflowScene t={t} />
        <KitScene t={t} />
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
