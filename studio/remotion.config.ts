import { Config } from "@remotion/cli/config";

// PNG frames + yuv420p/bt709 keep colours correct on Instagram (JPEG frames produce full-range yuvj420p).
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");
Config.setOverwriteOutput(true);
