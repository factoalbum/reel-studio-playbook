import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Avatar, Backdrop, BrandBug, Disclaimer, palette, ProgressBar, ReelAudio, Subtitles } from "./brand";
import { AskBubbles, AskScene, BuyerScene, CalendarScene, CAM_ORIGIN, hookCam, HookBack, HookFront, ListingScene, Outro, PayoffScene, PenInHand, RoomScene, SeriesScene, Tunnel, TwistScene, Wipes } from "./ebay/Story";
import { C, ebay as ep } from "./episodes/ebay";

/**
 * Internet Stories ep 3: "eBay's first sale was broken", in the permanent Internet Toolbox look.
 * Remotion is the master timeline; every scene reads its times from src/episodes/ebay.ts.
 * `cover` hides the subtitles and progress bar.
 */
export const ReelEbay: React.FC<{ cover?: boolean }> = ({ cover = false }) => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const dark = (t > C.irisAt + 0.25 && t < C.roomAt) || (t > C.calFrom && t < C.camAt);
  return (
    <AbsoluteFill style={{ backgroundColor: palette.paper, overflow: "hidden" }}>
      <Backdrop />
      <HookBack t={t} />
      <RoomScene t={t} />
      <ListingScene t={t} />
      <BuyerScene t={t} />
      <TwistScene t={t} />
      <PayoffScene t={t} />
      <AskScene t={t} />
      <SeriesScene t={t} />
      <Outro t={t} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${hookCam(t)})`, transformOrigin: CAM_ORIGIN }}>
        <Avatar keys={ep.avatarKeys} places={ep.avatarPlaces} env={ep.env} blinks={ep.blinks} />
      </div>
      <PenInHand t={t} />
      <AskBubbles t={t} />
      <HookFront t={t} />
      <CalendarScene t={t} />
      <Tunnel t={t} />
      <Wipes t={t} />
      {/* The logo row is ink text, so it gets a paper plate on the two dark scenes. */}
      {dark && <div style={{ position: "absolute", left: 66, top: 246, width: 344, height: 66, borderRadius: 14, background: palette.paper }} />}
      {dark && <div style={{ position: "absolute", right: 118, top: 254, width: 318, height: 70, borderRadius: 14, background: palette.paper }} />}
      <BrandBug />
      {t < ep.disclaimerTo && <Disclaimer lines={ep.disclaimer} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => !ep.captionLow(c.start))} />}
      {!cover && <Subtitles captions={ep.captions.filter((c) => ep.captionLow(c.start))} top={ep.captionLowTop} />}
      {!cover && <ProgressBar />}
      <ReelAudio voice={ep.voiceover} music={ep.music} env={ep.env} sfx={ep.sfx} />
    </AbsoluteFill>
  );
};
