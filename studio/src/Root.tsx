import React from "react";
import { Composition } from "remotion";
import { Reel01 } from "./Reel01";
import { Reel01v3 } from "./Reel01v3";
import { Reel01v4 } from "./Reel01v4";
import { Reel02 } from "./Reel02";
import { ReelMDH } from "./ReelMDH";
import { ReelGoogle } from "./ReelGoogle";
import { CoverGoogle } from "./google/Cover";
import { ReelSecrets } from "./ReelSecrets";
import { ReelEbay } from "./ReelEbay";
import { CoverEbay } from "./ebay/Cover";
import { ebay } from "./episodes/ebay";
import { ReelBonus } from "./ReelBonus";
import { CoverBonus } from "./bonus/Cover";
import { bonus } from "./episodes/bonus";
import { CoverSecrets } from "./secrets/Cover";
import { ReelImmich } from "./ReelImmich";
import { CoverImmich } from "./immich/Cover";
import { immich } from "./episodes/immich";
import { ReelGoogle5 } from "./ReelGoogle5";
import { CoverGoogle5 } from "./google5/Cover";
import { google5 } from "./episodes/google5";
import { ReelJio } from "./ReelJio";
import { CoverJio } from "./jio/Cover";
import { jio } from "./episodes/jio";
import { ReelThirty } from "./thirty/ReelThirty";
import { CoverThirty } from "./thirty/Cover";
import { THIRTY } from "./episodes/thirty";
import { ReelLaunch } from "./ReelLaunch";
import { CoverLaunch } from "./launch/Cover";
import { launch } from "./episodes/launch";
import { ReelSales } from "./ReelSales";
import { CoverSales } from "./sales/Cover";
import { sales } from "./episodes/sales";
import { ReelClaude } from "./ReelClaude";
import { CoverClaude } from "./claude/Cover";
import { claude } from "./episodes/claude";
import { ReelFable } from "./ReelFable";
import { CoverFable } from "./fable/Cover";
import { fable } from "./episodes/fable";
import { ReelFable52 } from "./ReelFable52";
import { CoverFable52 } from "./fable52/Cover";
import { fable52 } from "./episodes/fable52";
import { ReelGta6 } from "./ReelGta6";
import { CoverGta6 } from "./gta6/Cover";
import { ReelAgent } from "./ReelAgent";
import { CoverAgent } from "./agent/Cover";
import { agent } from "./episodes/agent";
import { ReelAnti } from "./ReelAnti";
import { CoverAnti } from "./anti/Cover";
import { LookSkit } from "./skit/LookSkit";
import { anti } from "./episodes/anti";
import { ReelTokens } from "./ReelTokens";
import { CoverTokens } from "./tokens/Cover";
import { tokens } from "./episodes/tokens";
import { gta6 } from "./episodes/gta6";
import { Sheet } from "./Sheet";
import { AvatarBoard } from "./brand/AvatarBoard";
import { StyleGuide } from "./brand/StyleGuide";
import { Banner, ProfilePicture, ProfileSizes } from "./brand/Identity";
import { FormulaPin } from "./brand/Pins";
import { reel01v4 } from "./episodes/reel01v4";
import { reel01 } from "./episodes/reel01";
import { reel01v3 } from "./episodes/reel01v3";
import { reel02 } from "./episodes/reel02";
import { mdh } from "./episodes/mdh";
import { google } from "./episodes/google";
import { secrets } from "./episodes/secrets";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Reel01"
      component={Reel01}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      // The length follows the real voiceover file (plus a short tail).
      durationInFrames={Math.round((reel01.voiceSeconds + reel01.tailSeconds) * FPS)}
    />
    <Composition
      id="Reel01v3"
      component={Reel01v3}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={Math.round((reel01v3.voiceSeconds + reel01v3.tailSeconds) * FPS)}
    />
    <Composition
      id="Reel01v4"
      component={Reel01v4}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={Math.round((reel01v4.voiceSeconds + reel01v4.tailSeconds) * FPS)}
    />
    <Composition
      id="Reel02"
      component={Reel02}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={Math.round((reel02.voiceSeconds + reel02.tailSeconds) * FPS)}
    />
    {/* Internet Stories: The Million Dollar Homepage. */}
    <Composition
      id="ReelMDH"
      component={ReelMDH}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={Math.round((mdh.voiceSeconds + mdh.tailSeconds) * FPS)}
      defaultProps={{ cover: false }}
    />
    <Composition
      id="SheetMDH"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={2200}
      defaultProps={{ times: [0.6, 3.9, 9.6, 13.6, 17.6, 19.5, 23.0, 26.3, 28.6], reel: "mdh" as const }}
    />
    <Composition
      id="ReelGoogle"
      component={ReelGoogle}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={Math.round((google.voiceSeconds + google.tailSeconds) * FPS)}
      defaultProps={{ cover: false }}
    />
    <Composition id="CoverGoogle" component={CoverGoogle} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetGoogle"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={2700}
      defaultProps={{ times: [0.6, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0], reel: "google" as const }}
    />
    {/* Internet Stories #03: eBay's first sale was broken. */}
    <Composition id="ReelEbay" component={ReelEbay} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((ebay.voiceSeconds + ebay.tailSeconds) * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverEbay" component={CoverEbay} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetEbay"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1300}
      defaultProps={{ times: [0.1, 0.5, 1.2, 2.5, 4.9, 6.0, 7.5, 9.0, 10.5], reel: "ebay" as const }}
    />
    {/* Diwali special 2026: statutory bonus rights. */}
    <Composition id="ReelBonus" component={ReelBonus} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((bonus.voiceSeconds + bonus.tailSeconds) * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverBonus" component={CoverBonus} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetBonus"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1600}
      defaultProps={{ times: [0.3, 1.0, 1.6, 2.6, 4.0, 5.2, 8.0, 11.0, 14.0], reel: "bonus" as const }}
    />
    {/* Creator Secrets #02: Immich, a self-hosted Google Photos-like app. */}
    <Composition id="ReelImmich" component={ReelImmich} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((immich.voiceSeconds + immich.tailSeconds) * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverImmich" component={CoverImmich} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetImmich"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1500}
      defaultProps={{ times: [0.3, 1.0, 2.0, 3.0, 4.3, 5.5, 7.5, 9.5, 11.5], reel: "immich" as const }}
    />
    {/* Creator Secrets #03: 5 Google AI tools. */}
    <Composition id="ReelGoogle5" component={ReelGoogle5} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((google5.voiceSeconds + google5.tailSeconds) * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverGoogle5" component={CoverGoogle5} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetGoogle5"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={2000}
      defaultProps={{ times: [0.5, 2.5, 4.5, 5.8, 8.0, 13.0, 16.5, 19.5, 21.5], reel: "google5" as const }}
    />
    {/* Creator Secrets #04: Jio ne AI free diya? (5 use cases). */}
    <Composition id="ReelJio" component={ReelJio} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((jio.voiceSeconds + jio.tailSeconds) * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverJio" component={CoverJio} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetJio"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={{ times: [0.5, 1.5, 2.3, 3.3, 5.2, 7.0], reel: "jio" as const }}
    />
    {/* 30 DAYS. ONE DIGITAL PRODUCT. (reusable template; one Reel/Cover/Sheet trio per episode, data in src/episodes/thirty). */}
    <Composition id="ReelThirtyEp01" component={ReelThirty} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((THIRTY.ep01.voiceSeconds + THIRTY.ep01.tailSeconds) * FPS)} defaultProps={{ ep: "ep01" as const, cover: false }} />
    <Composition id="CoverThirtyEp01" component={CoverThirty} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} defaultProps={{ ep: "ep01" as const }} />
    <Composition
      id="SheetThirtyEp01"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1200}
      defaultProps={{ times: [0.6, 2.2, 5.0, 8.6, 11.0, 13.0, 15.6, 19.6, 21.5], reel: "thirty01" as const }}
    />
    {/* Official ebook launch reel, Episode 01 (Ebook Launch Kit for India, ₹99). Runs the full length of the WAV. */}
    <Composition id="ReelLaunch" component={ReelLaunch} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(launch.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverLaunch" component={CoverLaunch} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetLaunch"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1320}
      defaultProps={{ times: [0.0, 1.2, 3.1, 5.6, 6.8, 9.4, 10.3, 12.9, 14.5], reel: "launch" as const }}
    />
    {/* Build in Public, Episode 02: how I made my first ebook sales. Runs the full length of the WAV (44.20 s). */}
    <Composition id="ReelSales" component={ReelSales} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(sales.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverSales" component={CoverSales} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetSales"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1330}
      defaultProps={{ times: [0.0, 2.5, 5.0, 8.6, 10.9, 13.9, 17.8, 21.8, 24.3], reel: "sales" as const }}
    />
    {/* Creator Secrets #05: Claude Code with Claude Pro, 3 steps, API billing, the Gemini CLI update (46.64 s). */}
    <Composition id="ReelClaude" component={ReelClaude} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(claude.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverClaude" component={CoverClaude} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetClaude"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1400}
      defaultProps={{ times: [0.0, 3.6, 8.8, 10.8, 14.6, 19.6, 25.9, 30.0, 37.5], reel: "claude" as const }}
    />
    {/* Creator Secrets #06: Claude Fable 5.2 + Higgsfield MCP connector, 3 steps, billing terms (45.68 s). */}
    <Composition id="ReelFable" component={ReelFable} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(fable.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverFable" component={CoverFable} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetFable"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1371}
      defaultProps={{ times: [0.0, 3.3, 5.6, 10.6, 13.6, 18.4, 22.9, 27.9, 30.6], reel: "fable" as const }}
    />
    {/* Fable 5.2 free?! 3 things to try: the Claude Pro launch offer, mascot, 2027 plan, Claude Code workflow (42.44 s). */}
    <Composition id="ReelFable52" component={ReelFable52} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(fable52.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverFable52" component={CoverFable52} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetFable52"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1274}
      defaultProps={{ times: [0.0, 2.6, 4.4, 7.6, 10.2, 14.6, 18.6, 22.6, 25.2], reel: "fable52" as const }}
    />
    <Composition
      id="SheetFable52b"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1274}
      defaultProps={{ times: [26.6, 28.6, 30.3, 32.2, 33.3, 34.9, 37.6, 40.4, 42.2], reel: "fable52" as const }}
    />
    {/* Creator Secrets: Google Antigravity free reel editing, comment EDIT (58.24 s). */}
    <Composition id="ReelAnti" component={ReelAnti} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(anti.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverAnti" component={CoverAnti} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    {/* Creator Secrets: FreeLLMAPI, comment / type TOKENS (93.36 s). */}
    <Composition id="ReelTokens" component={ReelTokens} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(tokens.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverTokens" component={CoverTokens} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition id="SheetTokens" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={2801} defaultProps={{ times: [0.3, 2.4, 5.4, 7.9, 11.6, 14.8, 18.6, 23.4, 29.5], reel: "tokens" as const }} />
    <Composition id="SheetTokensb" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={2801} defaultProps={{ times: [34.6, 37.2, 40.4, 42.6, 46.0, 50.9, 55.2, 57.8, 61.9], reel: "tokens" as const }} />
    <Composition id="SheetTokensc" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={2801} defaultProps={{ times: [66.6, 72.9, 76.8, 78.8, 82.4, 86.0, 89.6, 91.4, 93.2], reel: "tokens" as const }} />
    {/* 3D desk skit: look test, one frame per camera setup. */}
    <Composition id="LookSkit" component={LookSkit} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={5} />
    <Composition id="SheetAnti" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={1748} defaultProps={{ times: [0.1, 3.2, 5.2, 9.8, 12.4, 16.2, 21.2, 22.6, 26.9], reel: "anti" as const }} />
    <Composition id="SheetAntib" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={1748} defaultProps={{ times: [28.6, 33.0, 34.9, 37.9, 41.2, 43.4, 46.5, 50.6, 53.9], reel: "anti" as const }} />
    {/* Creator Secrets: Instagram Agent Skill for Claude Code, comment AGENT (59.48 s). */}
    <Composition id="ReelAgent" component={ReelAgent} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(agent.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverAgent" component={CoverAgent} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition id="SheetAgent" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={1785} defaultProps={{ times: [0.1, 2.9, 7.9, 12.3, 16.3, 20.6, 23.6, 27.0, 33.5], reel: "agent" as const }} />
    <Composition id="SheetAgentb" component={Sheet} width={1080} height={1920} fps={FPS} durationInFrames={1785} defaultProps={{ times: [37.0, 40.0, 45.4, 49.9, 51.9, 52.8, 55.7, 58.9, 59.4], reel: "agent" as const }} />
    {/* Creator Secrets: GTA 6 hype, how the reels are made, the AI Reel Kit (53.00 s). */}
    <Composition id="ReelGta6" component={ReelGta6} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.ceil(gta6.voiceSeconds * FPS)} defaultProps={{ cover: false }} />
    <Composition id="CoverGta6" component={CoverGta6} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={1} />
    <Composition
      id="SheetGta6"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1590}
      defaultProps={{ times: [0.0, 2.6, 6.7, 9.6, 12.2, 15.2, 19.5, 22.2, 24.5], reel: "gta6" as const }}
    />
    <Composition
      id="SheetGta6b"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1590}
      defaultProps={{ times: [27.4, 29.9, 32.7, 35.0, 38.3, 42.0, 44.2, 46.8, 48.6], reel: "gta6" as const }}
    />
    {/* Creator Secrets #01: how the reels are made, six steps. */}
    <Composition id="ReelSecrets" component={ReelSecrets} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={Math.round((secrets.voiceSeconds + secrets.tailSeconds) * FPS)} />
    <Composition id="CoverSecrets" component={CoverSecrets} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={90} />
    <Composition
      id="SheetSecrets"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={2200}
      defaultProps={{ times: [0.6, 3.0, 6.0, 9.0, 12.0, 15.0, 18.0, 21.0, 24.0], reel: "secrets" as const }}
    />
    <Composition id="StyleGuide" component={StyleGuide} width={1080} height={1920} fps={FPS} durationInFrames={1} />
    {/* Brand identity: profile picture and channel banners at each platform's upload size. */}
    <Composition id="ProfilePicture" component={ProfilePicture} width={1080} height={1080} fps={FPS} durationInFrames={1} defaultProps={{ expr: "happy" as const }} />
    <Composition id="BannerX" component={Banner} width={1500} height={500} fps={FPS} durationInFrames={1} defaultProps={{ spec: "x" as const, guides: false }} />
    <Composition id="BannerYouTube" component={Banner} width={2560} height={1440} fps={FPS} durationInFrames={1} defaultProps={{ spec: "youtube" as const, guides: false }} />
    <Composition id="BannerFacebook" component={Banner} width={1640} height={624} fps={FPS} durationInFrames={1} defaultProps={{ spec: "facebook" as const, guides: false }} />
    <Composition id="ProfileSizes" component={ProfileSizes} width={1500} height={840} fps={FPS} durationInFrames={1} />
    {/* Pinterest pins, one calculator each: pin = "emi" | "gst" | "percent". */}
    <Composition id="Pin" component={FormulaPin} width={1000} height={1500} fps={FPS} durationInFrames={1} defaultProps={{ pin: "emi" as const }} />
    <Composition
      id="AvatarBoard"
      component={AvatarBoard}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1}
      defaultProps={{
        cells: [
          { pose: "rest", expr: "talk", label: "rest" },
          { pose: "surprised", expr: "surprised", label: "surprised" },
          { pose: "point", aim: -70, expr: "talk", level: 0.7, look: [0.5, -0.8], label: "point" },
          { pose: "thumbs", expr: "happy", label: "thumbs" },
          { pose: "think", expr: "thinking", look: [-0.6, -0.9], label: "think" },
          { pose: "wave", expr: "excited", label: "wave" },
        ],
      }}
    />
    {/* Preview only: 9 frames of a reel on one image. Long duration because frames are clamped to it. */}
    <Composition
      id="Sheet"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={600}
      defaultProps={{ times: [0.6, 2.4, 3.9, 5.0, 7.9, 9.9, 11.5, 13.5, 16.6], reel: "v4" as const }}
    />
    <Composition
      id="Sheet02"
      component={Sheet}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={1200}
      defaultProps={{ times: [0.6, 2.5, 3.6, 5.0, 6.4, 7.8, 9.7, 11.0, 12.6], reel: "02" as const }}
    />
  </>
);
