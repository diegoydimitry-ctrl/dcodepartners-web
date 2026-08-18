import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../brand/tokens";

export const BackgroundGlow: React.FC<{
  tint?: string;
  gridOpacity?: number;
  pulse?: boolean;
}> = ({ tint = colors.bgVignetteCenter, gridOpacity = 1, pulse = false }) => {
  const frame = useCurrentFrame();
  const pulseScale = pulse
    ? interpolate(Math.sin(frame / 40), [-1, 1], [0.96, 1.04])
    : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bgBase }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 42%, ${tint} 0%, ${colors.bgVignetteEdge} 72%)`,
          transform: `scale(${pulseScale})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: gridOpacity,
          backgroundImage: `linear-gradient(${colors.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${colors.gridLine} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.55) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
