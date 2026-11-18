# Render gotchas (learned the hard way)

- **Low RAM PC**: render with `--concurrency=1 --timeout=120000 --disallow-parallel-encoding`. Close Chrome tabs first.
- **Long reels (60 s+)**: if a render dies, render in parts with `--frames=0-899`, `--frames=900-1799` and so on,
  then join them with `npx remotion ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4`.
- **Props on Windows**: inline `--props='{"a":1}'` breaks in PowerShell. Write the props to a JSON file and pass
  `--props=path/to/props.json`.
- **Font timeout**: IBM Plex loads from Google Fonts; the first render can time out. `--timeout=120000` fixes it.
- **Hook bugs**: anything in the first 2 seconds is what people judge. Render a still at 0.3 s and 1.5 s and look.
- **Captions**: never type subtitles from the script. Transcribe the recording (`docs/workflow.md` step 3).
- **Output check**: `ffprobe out/<file>.mp4` should show 1080x1920, h264, yuv420p, aac, and the right duration.
- **3D (three.js)**: always add `--gl=angle`. See `docs/3d-skits.md`.
- **SVG logos**: an SVG without `xmlns="http://www.w3.org/2000/svg"` will not load in Remotion's `<Img>`. Add it.
- **ffprobe** takes one input file per run. **ffmpeg 7+**: `-vsync` is gone, use `-fps_mode passthrough`.
- **Changing numbers** (a counting price, a ticking counter): any paused frame can show a wrong value. Show fixed,
  true numbers instead.
- **Contact sheets**: render 6 stills, join them with `ffmpeg -i a.png -i b.png ... -filter_complex hstack=inputs=6`,
  look at them before every full render.
