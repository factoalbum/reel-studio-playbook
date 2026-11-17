import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { tokens as ep } from "./episodes/tokens";
import { AgentsScene, BrainScene, BuildScene, CAM_ORIGIN, cam, CtaScene, DashScene, EndpointScene, FailoverScene, GameScene, HonestScene, HookScene, MitScene, NumbersScene, PackScene, QuotaScene, Streaks, TrialScene, WaysScene, Wipes } from "./tokens/Scenes";

/**
 * Creator Secrets: "Kisi ne Claude Code ko free mein chalane ka tareeka open-source kar diya" → FreeLLMAPI → comment /
 * type TOKENS. Remotion is the master timeline; every scene reads its times from src/episodes/tokens.ts. `cover` hides
 * the subtitles and progress bar.
 */
export const ReelTokens: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <TrialScene t={t} />
        <WaysScene t={t} />
        <MitScene t={t} />
        <EndpointScene t={t} />
        <NumbersScene t={t} />
        <PackScene t={t} />
        <GameScene t={t} />
        <BrainScene t={t} />
        <DashScene t={t} />
        <FailoverScene t={t} />
        <QuotaScene t={t} />
        <AgentsScene t={t} />
        <BuildScene t={t} />
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
