import React from "react";
import { colors } from "../brand/tokens";

/**
 * Reconstrucción aproximada del isotipo de D-Code Partners a partir de los
 * fotogramas de referencia (dos puntos de acento + wordmark "D-Code /
 * PARTNERS"). NO es el archivo vectorial original — Dirección debe aportar el
 * SVG/PNG real del logo para una reproducción exacta. Se usa el propio
 * carácter "D" en la tipografía de marca (Archivo 800) como icono: es fiable
 * de renderizar y evita el defecto de la v1 (rejilla de puntos ilegible,
 * detectado y corregido en QA visual antes de aprobar el primer vídeo).
 */
export const Logo: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = colors.textPrimary,
}) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: size * 0.14, marginRight: size * 0.06 }}>
      <div
        style={{
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: "50%",
          background: colors.accentBlue,
          boxShadow: `0 0 ${size * 0.18}px ${colors.accentBlue}`,
        }}
      />
      <div
        style={{
          width: size * 0.13,
          height: size * 0.13,
          borderRadius: "50%",
          background: colors.accentBlue,
          boxShadow: `0 0 ${size * 0.18}px ${colors.accentBlue}`,
        }}
      />
    </div>
    <span
      style={{
        fontFamily: "Archivo",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color,
      }}
    >
      D
    </span>
  </div>
);

export const LogoLockup: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transform: `scale(${scale})`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <Logo size={56} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "Archivo",
            fontWeight: 800,
            fontSize: 46,
            color: colors.textPrimary,
            letterSpacing: -0.5,
          }}
        >
          -Code
        </span>
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 15,
            color: colors.accentBlue,
            letterSpacing: 6,
            marginTop: 2,
          }}
        >
          PARTNERS
        </span>
      </div>
    </div>
  </div>
);
