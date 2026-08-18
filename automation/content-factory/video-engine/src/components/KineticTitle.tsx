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
 * Titular centrado tipo "hook card" — así aparecen "Y AQUÍ ESTÁ EL PROBLEMA."
 * y "A VECES ES EL PROCESO." en las referencias: una o dos líneas, mayúsculas
 * parciales, entrada con slide+fade corto, sin permanecer más de lo necesario.
 */
export const KineticTitle: React.FC<{
  lines: string[];
  emphasisIndex?: number; // qué línea recibe el color de acento
  size?: number;
  align?: "center" | "left";
  startFrame?: number;
}> = ({ lines, emphasisIndex, size = 56, align = "center", startFrame = 0 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  if (frame < 0) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        padding: align === "center" ? 0 : "0 8%",
      }}
    >
      <div style={{ textAlign: align, maxWidth: "84%" }}>
        {lines.map((line, i) => {
          const delay = i * 6;
          const p = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200, mass: 0.6 },
          });
          const translateY = interpolate(p, [0, 1], [16, 0]);
          const opacity = interpolate(p, [0, 1], [0, 1]);
          return (
            <div
              key={i}
              style={{
                fontFamily: "Archivo",
                fontWeight: 800,
                fontSize: size,
                lineHeight: 1.14,
                color:
                  i === emphasisIndex ? colors.accentBlue : colors.textPrimary,
                textShadow:
                  i === emphasisIndex
                    ? `0 0 28px ${colors.accentBlue}55`
                    : "0 2px 24px rgba(0,0,0,0.4)",
                transform: `translateY(${translateY}px)`,
                opacity,
                letterSpacing: -0.5,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{ text: string; startFrame?: number }> = ({
  text,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame() - startFrame;
  if (frame < 0) return null;
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: "12%",
          maxWidth: "82%",
          textAlign: "center",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 30,
          color: colors.textPrimary,
          opacity,
          background: "rgba(5,7,12,0.55)",
          padding: "10px 22px",
          borderRadius: 12,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
