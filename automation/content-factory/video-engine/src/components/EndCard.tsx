import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../brand/tokens";
import { LogoLockup } from "./Logo";

export const EndCard: React.FC<{
  valueProp: string;
  cta: string;
  url?: string;
  startFrame?: number;
}> = ({ valueProp, cta, url = "dcodepartners.com", startFrame = 0 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();
  if (frame < 0) return null;
  const p = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const y = interpolate(p, [0, 1], [14, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <LogoLockup />
        <div
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 25,
            color: colors.textSecondary,
            textAlign: "center",
            maxWidth: 560,
            lineHeight: 1.4,
          }}
        >
          {valueProp}
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${colors.accentBlue}, transparent)`,
          }}
        />
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 800,
            fontSize: 30,
            color: colors.textPrimary,
            textAlign: "center",
            maxWidth: 620,
          }}
        >
          {cta}
        </div>
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontWeight: 500,
            fontSize: 20,
            color: colors.accentBlue,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
