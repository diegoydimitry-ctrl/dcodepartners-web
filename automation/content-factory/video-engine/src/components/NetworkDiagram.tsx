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
 * Diagrama de nodos hexagonal — el mismo lenguaje que EMAIL/CRM/SISTEMAS/
 * DOCUMENTOS/WHATSAPP conectados entre sí en la referencia 2.
 */
export const NetworkDiagram: React.FC<{
  nodes: string[]; // hasta 6, se colocan en círculo
  startFrame?: number;
  radius?: number;
}> = ({ nodes, startFrame = 0, radius = 210 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const n = Math.min(nodes.length, 6);
  const points = Array.from({ length: n }, (_, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const lineP = spring({ frame, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {points.map((a, i) =>
          points.map((b, j) => {
            if (j <= i) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={a.x}
                y1={a.y}
                x2={a.x + (b.x - a.x) * lineP}
                y2={a.y + (b.y - a.y) * lineP}
                stroke={colors.accentBlueDim}
                strokeWidth={1.5}
              />
            );
          })
        )}
      </svg>
      {points.map((p, i) => {
        const d = spring({
          frame: frame - i * 4,
          fps,
          config: { damping: 200 },
        });
        const scale = interpolate(d, [0, 1], [0.4, 1]);
        const opacity = interpolate(d, [0, 1], [0, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              background: colors.cardBg,
              border: `1.5px solid ${colors.accentBlue}`,
              borderRadius: 10,
              padding: "10px 18px",
              fontFamily: "Inter",
              fontWeight: 700,
              fontSize: 20,
              color: colors.textPrimary,
              boxShadow: `0 0 20px ${colors.accentBlue}33`,
              whiteSpace: "nowrap",
            }}
          >
            {nodes[i]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
