# Internet Toolbox reel identity (permanent, from v4)

Every reel uses one look, taken from the website itself (internetoolbox.com). The code is in `src/brand/`; one picture of everything is `out/brand/internet-toolbox-reel-style-guide.png` (`npm run brand:board`). Reel 01 v4 (`src/Reel01v4.tsx`) is the reference reel.

## Look

| Part | Rule |
| --- | --- |
| Background | Paper `#FAF9F6` with a faint dot grid and a soft lime glow (`Backdrop`). |
| Text | Ink `#171717`. Secondary text `#57564F` / `#6B6A63`. |
| Accent | One accent: lime `#C8F169`. Olive `#3F5F12` for accent text. Gold, pink and teal only as small confetti and coins. |
| Type | IBM Plex Sans Bold, sentence case, tight tracking, for headlines, subtitles and tags. IBM Plex Mono uppercase, wide tracking, for small labels ("REAL WEBSITE"). Same fonts as the website. |
| Tags | Lime block, ink border, hard ink shadow, tilted 2 to 4 degrees (`Sticker`). Second accent: ink tag with lime text (`tone="ink"`). |
| Cards | White or paper, 4 px ink border, radius 26, soft shadow (`ProofPanel`, `BrowserCard`). |
| Logo | The website's mark: lime square inside an ink square with "IT" (`BrandMark`). |

## The avatar (`src/brand/Avatar.tsx`)

- Look since 15 Nov 2026 (approved by the owner): black middle-part hair that falls over the temples, slim face, thick brows, almond eyes a little larger than before, dotted stubble, warm closed smile.
- Outfit, never changes: black hoodie with lime drawstrings, lime headphones round the neck, the IT mark as a badge on the chest.
- The drawing is in `src/look/AvatarLook.tsx` and `src/look/parts.tsx`; `Avatar` in `src/brand/Avatar.tsx` uses it with the approved settings (`AVATAR_LOOK`), so every reel, cover and brand picture gets it.
- The first look (side-part hair, charcoal overshirt open over the lime IT tee, silver watch) is kept as `AvatarClassic`. To render an older reel exactly as it was posted, add `"mascot": "classic"` to the render's `--props` (or to its props file). Files as they were before the switch: `backup/2026-11-15-before-new-mascot/`.
- Poses: `rest`, `surprised`, `point` (with `aim` in degrees, -90 is straight up), `explain`, `oneMore`, `thumbs`, `think`, `wave`. Expressions: `talk`, `happy`, `surprised`, `excited`, `thinking`.
- The mouth follows the voice loudness (`scripts/voice-env.mjs`), blinks happen at the listed times, and a lime halo with rings sits behind it, like the website's hero drawing.
- Places: `LAYOUT.avatar.hero` (hook), `corner` (while showing something), `twist` (a big moment).
- Transparent pictures for thumbnails or a profile: `npx remotion still src/index.ts AvatarBoard out/brand/avatar.png --props='{"cells":[],"big":{"pose":"wave","expr":"happy"},"transparent":true}'`.

## Layout rhythm (`LAYOUT` in `tokens.ts`)

- Logo and name top left (y 258), honesty line top right.
- Headline at y 326, at most two lines, finished by about y 510.
- Proof panel x 80, y 540, 870 x 545.
- Subtitles at y 1170.
- Avatar big and centred for the hook, bottom left while things are shown.
- Everything important stays inside x 80 to 950, y 250 to 1580: Instagram covers the rest.

## Animation language

- Hook inside 2 seconds: `HeroTitle` slams in with a shake over the surprised avatar; reaction marks (`Mark`) pop around it.
- Every headline part lands when it is spoken (`Headline` segments carry their own time).
- Subtitles: one card per phrase; words wait in grey and turn ink when spoken; key words get the lime highlighter.
- Pops are springs (`usePop`), exits take 0.2 s, camera moves take 0.55 s with ease in and out.
- A sound on every pop, click and swipe. The music ducks under the voice (`ReelAudio`).
- Call to action is always the same: comment card typing the keyword, then the follow button tapped to "Following".

## Components (`src/brand`)

| Component | Use |
| --- | --- |
| `Backdrop`, `BrandBug`, `Disclaimer`, `ProgressBar` | Frame of every reel |
| `Avatar` | The presenter |
| `HeroTitle`, `Headline` | Title card and spoken headlines (tones `ink`, `olive`, `lime`, `inkTag`, `marker`) |
| `Subtitles` | Word-timed subtitles |
| `Sticker`, `LabelPill`, `Mark`, `Burst`, `Coin`, `Pointer`, `ClickRing` | Small parts |
| `ProofPanel` with `camAt`, `toFrame` | Real website screenshot with camera moves and callouts |
| `BrowserCard` | A page we draw ourselves (never for proof) |
| `CommentCard`, `FollowButton`, `TapPointer` | Call to action |
| `ReelAudio` | Voice, ducked music and effects |

## Profile picture and banners (`src/brand/Identity.tsx`)

`npm run brand:identity` renders all four into `out/brand/`:

| File | Size | Layout |
| --- | --- | --- |
| `internet-toolbox-profile-picture.png` | 1080 x 1080 | Avatar head and shoulders on lime, happy grin, slight head tilt. Readable down to 40 px. |
| `internet-toolbox-x-header-1500x500.png` | 1500 x 500 | Text left of centre, avatar centre right: clear of the profile picture (bottom left) and the phone app's round buttons (middle of both ends). |
| `internet-toolbox-youtube-banner-2560x1440.png` | 2560 x 1440 | Everything inside the middle 1546 x 423 that phones show. |
| `internet-toolbox-facebook-cover-1640x624.png` | 1640 x 624 | Everything inside the middle 1120 px that phones keep, above the profile picture. |

- Banner parts: the name lockup (logo + "Internet Toolbox"), the pillars line "AI • Websites • Tools • Online Growth" with lime dots, the site as a browser bar with the cursor, and the avatar waving in its lime disc with four pillar badges (AI sparkle, browser, toolbox, growth line) on a dotted orbit.
- Positions per platform live in `BANNERS`. Add `--props='{"guides":true}'` to draw the crop and profile-picture areas in red for checking.

## Pinterest pins (`src/brand/Pins.tsx`)

`npm run brand:pins` renders one 1000 x 1500 pin per calculator (EMI, GST, percentage) into `out/brand/`: brand row and avatar badge on top, a highlighted title, the formula card, what the letters mean, a worked example using the same numbers as the site's calculator, and the tool's address pinned to the bottom. To add a pin, add an entry to `PINS`. Keep prices in rupees (the pins load the fonts' latin-ext part for the ₹ sign) and avoid → and ≈, which the fonts lack.

## Honesty rules (never break)

- No income numbers, no fake dashboards, earnings screenshots or analytics. Money is only ever "possible", and the disclaimer stays on screen.
- Proof is the real website (a real screenshot or recording). Third-party ad creatives are blurred.
- Subtitles come from the actual recording (local transcript), never from the script.

## Making the next reel

1. Put the new voice in `public/`, transcribe it (README), and make a new episode file like `src/episodes/reel01v4.ts`: captions with word times, `avatarKeys` (one pose per line), `avatarPlaces`, `blinks`, `sfx`.
2. Copy `src/Reel01v4.tsx` and only the scenes you need from `src/v4/`. Keep the layer order: Backdrop, scenes, Avatar, hook title, BrandBug, Disclaimer, Subtitles, ProgressBar, ReelAudio.
3. Register it in `src/Root.tsx`, check it with `npm run sheet`, then render.
