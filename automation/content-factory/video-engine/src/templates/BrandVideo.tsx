import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { BackgroundGlow } from "../components/BackgroundGlow";
import { KineticTitle, Caption } from "../components/KineticTitle";
import { UICardList } from "../components/UICardList";
import { NetworkDiagram } from "../components/NetworkDiagram";
import { StatReveal } from "../components/StatReveal";
import { EndCard } from "../components/EndCard";
import type { Storyboard } from "../schema/storyboard";

/**
 * Motor genérico: recorre storyboard.scenes y monta cada una en su Sequence,
 * con un único fondo continuo (evita el efecto "diapositivas" plantilla-Canva).
 */
export const BrandVideo: React.FC<{ storyboard: Storyboard }> = ({
  storyboard,
}) => {
  let cursor = 0;
  const sceneRanges = storyboard.scenes.map((scene) => {
    const from = cursor;
    cursor += scene.durationInFrames;
    return { ...scene, from };
  });

  return (
    <AbsoluteFill>
      <BackgroundGlow pulse />
      {sceneRanges.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
          layout="none"
        >
          {scene.type === "title" && (
            <KineticTitle
              lines={scene.props.lines}
              emphasisIndex={scene.props.emphasisIndex}
              size={scene.props.size ?? 56}
            />
          )}
          {scene.type === "uiList" && (
            <UICardList items={scene.props.items} />
          )}
          {scene.type === "network" && (
            <NetworkDiagram nodes={scene.props.nodes} />
          )}
          {scene.type === "stat" && (
            <StatReveal
              value={scene.props.value}
              label={scene.props.label}
              tone={scene.props.tone}
            />
          )}
          {scene.type === "caption" && <Caption text={scene.props.text} />}
          {scene.type === "endcard" && (
            <EndCard
              valueProp={scene.props.valueProp}
              cta={scene.props.cta}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
