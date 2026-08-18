/**
 * D-Code Video Identity — tokens extraídos por análisis de fotograma de las
 * 2 referencias aportadas por Dirección (video_1.mp4, video_2.mp4), no inventados:
 * fondo casi negro con resplandor radial azul, tarjetas UI redondeadas con borde
 * sutil, tipografía condensada en mayúsculas para titulares, acentos azul/verde/rojo,
 * y la tarjeta final con el logo real de D-Code Partners.
 */

export const colors = {
  bgBase: "#05070C",
  bgVignetteCenter: "#132039",
  bgVignetteEdge: "#05070C",
  cardBg: "#0E1524",
  cardBorder: "rgba(255,255,255,0.08)",
  cardBorderAccent: "rgba(79,142,247,0.35)",
  textPrimary: "#F4F6FA",
  textSecondary: "#93A0B4",
  textMuted: "#5B6579",
  accentBlue: "#4F8EF7",
  accentBlueDim: "#2B4E86",
  accentGreen: "#2ECC71",
  accentRed: "#F0555F",
  accentAmber: "#F5A623",
  gridLine: "rgba(255,255,255,0.035)",
} as const;

export const fonts = {
  display: "Archivo", // condensado/bold para titulares kinéticos, mayúsculas
  body: "Inter", // UI, captions, cuerpo
  mono: "JetBrains Mono", // URL, cifras, elementos técnicos
} as const;

export const durations = {
  // en frames a 30fps
  hookHold: 90, // 3s
  beatHold: 75, // 2.5s
  cardReveal: 18, // 0.6s
  fastCut: 45, // 1.5s
} as const;

export const FPS = 30;

export const formats = {
  reel: { width: 1080, height: 1920, label: "Instagram Reels 9:16" },
  linkedinSquare: { width: 1080, height: 1080, label: "LinkedIn 1:1" },
  linkedinWide: { width: 1280, height: 720, label: "LinkedIn 16:9" },
} as const;

// Safe areas (Reels): Instagram superpone UI en top ~12% y bottom ~20% del frame.
export const safeArea = {
  reel: { top: 0.12, bottom: 0.2, left: 0.06, right: 0.06 },
  linkedin: { top: 0.06, bottom: 0.1, left: 0.05, right: 0.05 },
} as const;
