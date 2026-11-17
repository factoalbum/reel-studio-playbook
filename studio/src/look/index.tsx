import React from "react";
import { AbsoluteFill, Composition, registerRoot } from "remotion";
import { AvatarLook } from "./AvatarLook";
import type { AvatarKey } from "../brand/Avatar";
import type { HairKind, OutfitKind } from "./parts";
import { Banner, ProfilePicture, ProfileSizes } from "./IdentityLook";

type Props = { pose: AvatarKey["pose"]; expr: AvatarKey["expr"]; head: number; eye: number; hair?: HairKind; outfit?: OutfitKind; stubble?: boolean };

const Look: React.FC<Props> = ({ pose, expr, head, eye, hair, outfit, stubble }) => (
  <AbsoluteFill style={{ background: "transparent" }}>
    <AvatarLook keys={[{ at: -10, pose, expr }]} places={[{ at: -10, x: 540, y: 700, s: 1.5 }]} env={[0]} blinks={[]} halo={false} head={head} eye={eye} hair={hair} outfit={outfit} stubble={stubble} />
  </AbsoluteFill>
);

const Root: React.FC = () => (
  <>
    <Composition id="Look" component={Look} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{ pose: "wave", expr: "happy", head: 1, eye: 1 } as Props} />
    {/* Profile picture and banners with the refreshed mascot, at each platform's upload size. */}
    <Composition id="ProfilePictureLook" component={ProfilePicture} width={1080} height={1080} fps={30} durationInFrames={1} defaultProps={{ expr: "happy" as const }} />
    <Composition id="BannerXLook" component={Banner} width={1500} height={500} fps={30} durationInFrames={1} defaultProps={{ spec: "x" as const, guides: false }} />
    <Composition id="BannerYouTubeLook" component={Banner} width={2560} height={1440} fps={30} durationInFrames={1} defaultProps={{ spec: "youtube" as const, guides: false }} />
    <Composition id="BannerFacebookLook" component={Banner} width={1640} height={624} fps={30} durationInFrames={1} defaultProps={{ spec: "facebook" as const, guides: false }} />
    <Composition id="ProfileSizesLook" component={ProfileSizes} width={1500} height={840} fps={30} durationInFrames={1} />
  </>
);

registerRoot(Root);
