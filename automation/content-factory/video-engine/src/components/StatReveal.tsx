import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../brand/tokens";

/**
 * Familia "data visualization" — número grande + etiqueta, para contrastes
 * antes/después o cifras de impacto. Nunca debe llevar una cifra que no venga
 * dada explícitamente por el guion (ver regla Brand Safety: no inventar datos).
 */
export const StatReveal: React.FC<{
  value: string;
  label: string;
  tone?: "accent" | "danger" | "positive";
  startFrame?: number;
}> = ({ value, label, tone = "accent", startFrame = 0 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  if (frame < 0) return null;
  const p = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const scale = interpolate(p, [0, 1], [0.85, 1]);
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const color =
    tone === "danger"
      ? colors.accentRed
      : tone === "positive"
      ? colors.accentGreen
      : colors.accentBlue;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 800,
            fontSize: 160,
            color,
            textShadow: `0 0 60px ${color}55`,
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 30,
            color: colors.textSecondary,
            marginTop: 18,
            letterSpacing: 1,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
