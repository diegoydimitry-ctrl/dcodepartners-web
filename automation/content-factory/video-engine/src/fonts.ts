import { staticFile } from "remotion";

/**
 * Fuentes auto-alojadas en public/fonts (descargadas de Google Fonts en build
 * time, ver scripts/fetch-fonts.sh) en vez de cargarlas desde fonts.gstatic.com
 * en tiempo de render: el Chromium headless de este entorno no confía en el CA
 * del proxy saliente y el render fallaría con ERR_CERT_AUTHORITY_INVALID.
 * Autoalojar fuentes es además más robusto para producción (sin dependencia de
 * red durante el render).
 */
const face = (family: string, weight: string, file: string) => `
@font-face {
  font-family: '${family}';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('${staticFile(`fonts/${file}`)}') format('woff2');
}`;

let injected = false;

export const loadBrandFonts = () => {
  if (injected) return;
  injected = true;
  const css = [
    face("Archivo", "700", "Archivo-700.woff2"),
    face("Archivo", "800", "Archivo-800.woff2"),
    face("Inter", "500", "Inter-500.woff2"),
    face("Inter", "600", "Inter-600.woff2"),
    face("Inter", "700", "Inter-700.woff2"),
    face("JetBrains Mono", "500", "JetBrainsMono-500.woff2"),
  ].join("\n");
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};
