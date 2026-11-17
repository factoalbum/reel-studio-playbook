import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { agent as ep } from "./episodes/agent";
import { CAM_ORIGIN, cam, CommentScene, ControlScene, CtaScene, FollowScene, HookScene, OrganiseScene, PatternScene, PlanScene, ProfileScene, RehookScene, ReplyScene, RevealScene, SetupScene, Streaks, Wipes, WorkflowScene } from "./agent/Scenes";

/**
 * Creator Secrets: "Claude ne Instagram ka game khatam kar diya!" → the free Instagram Agent Skill pack for
 * Claude Code (drafts comments, replies, profile, weekly plan, virality research; you post) → comment AGENT.
 * Remotion is the master timeline; every scene reads its times from src/episodes/agent.ts. `cover` hides the
 * subtitles and progress bar.
 */
export const ReelAgent: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <WorkflowScene t={t} />
        <RevealScene t={t} />
        <OrganiseScene t={t} />
        <CommentScene t={t} />
        <ReplyScene t={t} />
        <ProfileScene t={t} />
        <PlanScene t={t} />
        <RehookScene t={t} />
        <PatternScene t={t} />
        <SetupScene t={t} />
        <ControlScene t={t} />
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
