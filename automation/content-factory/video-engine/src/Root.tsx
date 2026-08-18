import React from "react";
import { Composition } from "remotion";
import { BrandVideo } from "./templates/BrandVideo";
import { formats } from "./brand/tokens";
import { totalDuration } from "./schema/storyboard";
import { loadBrandFonts } from "./fonts";
import {
  video1_educational,
  video2_painpoint_linkedin,
  video2_painpoint_reel,
  video3_opinion,
} from "./storyboards/testBatch";

loadBrandFonts();

const compositions = [
  video1_educational,
  video2_painpoint_linkedin,
  video2_painpoint_reel,
  video3_opinion,
];

// Placeholder storyboard used only as defaultProps for Remotion Studio preview.
// En producción, el pipeline de GitHub Actions siempre pasa --props con el
// storyboard real generado por el workflow "CF/Concept -> Script -> Storyboard
// -> Render" de n8n — ver .github/workflows/render-video.yml.
const dynamicPlaceholder = video1_educational;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((storyboard) => {
        const dims = formats[storyboard.formato];
        return (
          <Composition
            key={storyboard.videoId}
            id={storyboard.videoId}
            component={BrandVideo}
            durationInFrames={totalDuration(storyboard)}
            fps={storyboard.fps}
            width={dims.width}
            height={dims.height}
            defaultProps={{ storyboard }}
          />
        );
      })}
      {/* Composición genérica para render dinámico (CI): la duración y el
          formato se recalculan a partir del storyboard real vía --props. */}
      <Composition
        id="dynamic"
        component={BrandVideo}
        durationInFrames={totalDuration(dynamicPlaceholder)}
        fps={30}
        width={formats.reel.width}
        height={formats.reel.height}
        defaultProps={{ storyboard: dynamicPlaceholder }}
        calculateMetadata={async ({ props }) => {
          const storyboard = (props as { storyboard: typeof dynamicPlaceholder }).storyboard;
          const dims = formats[storyboard.formato] ?? formats.reel;
          return {
            durationInFrames: totalDuration(storyboard),
            fps: storyboard.fps || 30,
            width: dims.width,
            height: dims.height,
          };
        }}
      />
    </>
  );
};
