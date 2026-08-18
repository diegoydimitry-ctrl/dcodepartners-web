import React from "react";
import { Composition, Still } from "remotion";
import { BrandVideo } from "./templates/BrandVideo";
import { StillCard } from "./templates/StillCard";
import { formats } from "./brand/tokens";
import { totalDuration } from "./schema/storyboard";
import { loadBrandFonts } from "./fonts";
import {
  video1_educational,
  video2_painpoint_linkedin,
  video2_painpoint_reel,
  video3_opinion,
  video4_minimalist,
} from "./storyboards/testBatch";
import { testPosts } from "./storyboards/testPosts";

loadBrandFonts();

const compositions = [
  video1_educational,
  video2_painpoint_linkedin,
  video2_painpoint_reel,
  video3_opinion,
  video4_minimalist,
];

// Post Engine — una Still por cada slide de cada post con piezas visuales
// (carrusel = varias, caption/post_visual = una sola tarjeta de apoyo).
const stillSlides = testPosts.flatMap((post) =>
  (post.slides ?? []).map((slide, i) => ({
    id: `still-${post.postId}-${i + 1}`,
    slide,
  }))
);

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
      {/* Post Engine: piezas estáticas (carruseles, tarjetas de apoyo) */}
      {stillSlides.map(({ id, slide }) => (
        <Still
          key={id}
          id={id}
          component={StillCard}
          width={formats.linkedinSquare.width}
          height={formats.linkedinSquare.height}
          defaultProps={{
            kicker: slide.kicker,
            headline: slide.headline,
            body: slide.body,
            footerCta: slide.footerCta,
            tone: slide.tone ?? "accent",
          }}
        />
      ))}
    </>
  );
};
