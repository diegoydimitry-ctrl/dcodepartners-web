import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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
 * Añade el Audio Engine: cama musical de fondo (por familia, o silencio
 * intencionado si audio.familia es null) y SFX sincronizados al inicio de
 * cada escena que lleve soundCue. Sin voz/TTS (ver storyboard.ts, sección
 * audio) — DCP-CONTENT-FACTORY-003 la retiró del pipeline automático.
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

  const audio = storyboard.audio;

  return (
    <AbsoluteFill>
      <BackgroundGlow pulse />

      {audio?.familia && (
        <Audio
          src={staticFile(`audio/beds/${audio.familia}.mp3`)}
          volume={audio.bedVolume ?? 0.35}
        />
      )}

      {sceneRanges.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
          layout="none"
        >
          {scene.soundCue && (
            <Audio
              src={staticFile(`audio/sfx/${scene.soundCue}.wav`)}
              volume={0.7}
            />
          )}
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
