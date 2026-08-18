import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(1);
Config.setChromiumOpenGlRenderer("angle");
// Reutiliza el Chromium de Playwright ya preinstalado en este entorno en vez
// de descargar el binario propio de Remotion (Headless Shell).
Config.setBrowserExecutable(
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
);
