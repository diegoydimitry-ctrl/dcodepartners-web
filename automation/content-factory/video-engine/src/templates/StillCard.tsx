import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../brand/tokens";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { LogoLockup } from "../components/Logo";

/**
 * Post Engine — pieza visual estática (Remotion Still, no vídeo). Reutiliza
 * exactamente los mismos tokens de marca que el Video Engine: es la misma
 * identidad D-Code, solo que congelada en un fotograma. Sirve para:
 *   - Instagram: post conceptual único, o cada slide de un carrusel.
 *   - LinkedIn: tarjeta de apoyo opcional para un post de texto.
 */
export const StillCard: React.FC<{
  kicker?: string; // ej. "01 / 04" en un carrusel, o el pilar editorial
  headline: string;
  body?: string;
  footerCta?: string;
  tone?: "accent" | "danger" | "positive";
  showLogo?: boolean;
}> = ({ kicker, headline, body, footerCta, tone = "accent", showLogo = true }) => {
  const toneColor =
    tone === "danger"
      ? colors.accentRed
      : tone === "positive"
      ? colors.accentGreen
      : colors.accentBlue;

  return (
    <AbsoluteFill>
      <BackgroundGlow gridOpacity={0.7} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "9%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, maxWidth: "88%" }}>
          {kicker && (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 4,
                color: toneColor,
                textTransform: "uppercase",
              }}
            >
              {kicker}
            </div>
          )}
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 800,
              fontSize: 54,
              lineHeight: 1.18,
              textAlign: "center",
              color: colors.textPrimary,
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            }}
          >
            {headline}
          </div>
          {body && (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontSize: 26,
                lineHeight: 1.5,
                textAlign: "center",
                color: colors.textSecondary,
                maxWidth: "92%",
              }}
            >
              {body}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: "7%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          {footerCta && (
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 20,
                color: colors.textSecondary,
              }}
            >
              {footerCta}
            </div>
          )}
          {showLogo && <LogoLockup scale={0.5} />}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
