import type { AvatarKey, AvatarPlace } from "../brand/Avatar";
import type { Cap } from "../brand/Subtitles";
import { LAYOUT } from "../brand/tokens";
import { reel01v3 } from "./reel01v3";

/**
 * Reel 01 v4: the same voice, words, timings, poses and sounds as v3 (reel01v3.ts says how they were measured),
 * in the permanent Internet Toolbox look: the owner's avatar, paper and lime, IBM Plex type.
 */
export const reel01v4 = {
  ...reel01v3,
  captions: reel01v3.captions as Cap[],
  avatarKeys: reel01v3.guideKeys as AvatarKey[],
  // Same moves as v3, at the series' standard spots.
  avatarPlaces: [
    { at: 0.0, ...LAYOUT.avatar.hero },
    { at: 2.78, ...LAYOUT.avatar.corner },
    { at: 9.2, ...LAYOUT.avatar.twist },
    { at: 10.75, ...LAYOUT.avatar.corner },
  ] as AvatarPlace[],
};
