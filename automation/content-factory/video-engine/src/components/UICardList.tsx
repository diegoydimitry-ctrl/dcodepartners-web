import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../brand/tokens";

export type UICardItem = {
  title: string;
  subtitle?: string;
  badgeColor?: string;
  checked?: boolean;
  meta?: string;
};

/**
 * Mockup de lista de notificaciones/tareas — el mismo lenguaje visual que
 * "Llamada perdida / 4 mensajes nuevos / Recordatorio..." y la lista de
 * "Responder correos ×68 / Copiar datos al CRM ×75..." de las referencias.
 */
export const UICardList: React.FC<{
  items: UICardItem[];
  startFrame?: number;
  staggerFrames?: number;
  width?: number;
}> = ({ items, startFrame = 0, staggerFrames = 5, width = 620 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ width, display: "flex", flexDirection: "column", gap: 14 }}>
        {items.map((item, i) => {
          const f = frame - i * staggerFrames;
          const p = spring({ frame: f, fps, config: { damping: 200 } });
          const x = interpolate(p, [0, 1], [-28, 0]);
          const opacity = interpolate(p, [0, 1], [0, 1]);
          return (
            <div
              key={i}
              style={{
                transform: `translateX(${x}px)`,
                opacity,
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: colors.cardBg,
                border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16,
                padding: "18px 22px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
            >
              {item.checked !== undefined ? (
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${
                      item.checked ? colors.accentGreen : colors.textMuted
                    }`,
                    background: item.checked ? colors.accentGreen : "transparent",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: item.badgeColor ?? colors.accentBlue,
                    flexShrink: 0,
                    boxShadow: `0 0 12px ${item.badgeColor ?? colors.accentBlue}`,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: 24,
                    color: colors.textPrimary,
                  }}
                >
                  {item.title}
                </div>
                {item.subtitle && (
                  <div
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: 18,
                      color: colors.textSecondary,
                      marginTop: 2,
                    }}
                  >
                    {item.subtitle}
                  </div>
                )}
              </div>
              {item.meta && (
                <div
                  style={{
                    fontFamily: "JetBrains Mono",
                    fontSize: 18,
                    color: colors.textMuted,
                  }}
                >
                  {item.meta}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
