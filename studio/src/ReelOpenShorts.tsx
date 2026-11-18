import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, BrandBug, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { openshorts as ep } from "./episodes/openshorts";
import { AiScene, CAM_ORIGIN, cam, CtaScene, FlowScene, FreeScene, HookScene, NeedScene, NightBackdrop, RiskScene, StartScene, Streaks, ToolsScene, WhatScene, Wipes } from "./openshorts/Scenes";

/**
 * Creator Secrets: OpenShorts, the free open-source AI clipper (GTA 6 launch week). Vice City night theme.
 * Remotion is the master timeline; every scene reads its times from src/episodes/openshorts.ts. `cover` hides the
 * subtitles and progress bar.
 */
export const ReelOpenShorts: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0614", overflow: "hidden" }}>
      <NightBackdrop t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} />
        <AiScene t={t} />
        <WhatScene t={t} />
        <ToolsScene t={t} />
        <FreeScene t={t} />
        <FlowScene t={t} />
        <NeedScene t={t} />
        <RiskScene t={t} />
        <StartScene t={t} />
        <CtaScene t={t} />
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      </div>
      <Streaks t={t} />
      <Wipes t={t} />
      <BrandBug light />
      {!cover && <Subtitles captions={ep.captions} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
