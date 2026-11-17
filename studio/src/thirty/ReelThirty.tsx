import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "../brand";
import { THIRTY, type ThirtyId } from "../episodes/thirty";
import { CAM_ORIGIN, cam, EndCard, ExperimentScene, HookScene, KitScene, LessonScene, SampleScene, TrackerScene, Wipes } from "./Scenes";

/**
 * "30 DAYS. ONE DIGITAL PRODUCT." reusable reel. One composition per episode is registered in Root.tsx with
 * `{ ep: "ep01" }`; everything episode specific lives in src/episodes/thirty/epNN.json.
 * `cover` hides the subtitles and progress bar. Without a voice file the reel plays silent (timing preview only).
 */
export const ReelThirty: React.FC<{ ep: ThirtyId; cover?: boolean }> = ({ ep: id, cover = false }) => {
  const ep = THIRTY[id];
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam(t, ep)})`, transformOrigin: CAM_ORIGIN }}>
        <HookScene t={t} ep={ep} />
        <ExperimentScene t={t} ep={ep} />
        <KitScene t={t} ep={ep} />
        <TrackerScene t={t} ep={ep} />
        <LessonScene t={t} ep={ep} />
        <SampleScene t={t} ep={ep} />
        <EndCard t={t} ep={ep} />
        <Avatar keys={ep.keys} places={ep.places} env={ep.env} blinks={ep.blinks} />
      </div>
      <Wipes t={t} ep={ep} />
      <BrandBug />
      <Disclaimer lines={ep.disclaimer} />
      {!cover && <Subtitles captions={ep.caps} />}
      {!cover && <ProgressBar />}
      {ep.voiceover && <ReelAudio voice={ep.voiceover} music={ep.music || undefined} env={ep.env} sfx={ep.effects} />}
    </AbsoluteFill>
  );
};
