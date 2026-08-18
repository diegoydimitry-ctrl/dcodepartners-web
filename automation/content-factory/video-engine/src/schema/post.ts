import { z } from "zod";

/**
 * Contrato del Post Engine — independiente del Video Engine (schema/storyboard.ts).
 * Un "post" nunca es un vídeo recortado: LinkedIn e Instagram tienen su propio
 * texto, su propia estructura y, cuando aplica, sus propias piezas visuales
 * (Remotion Still, no timeline).
 */

export const CardSlideSchema = z.object({
  kicker: z.string().optional(),
  headline: z.string(),
  body: z.string().optional(),
  tone: z.enum(["accent", "danger", "positive"]).optional(),
  footerCta: z.string().optional(),
});

export const PostSchema = z.object({
  postId: z.string(),
  ideaId: z.string(),
  red: z.enum(["LinkedIn", "Instagram"]),
  tipoPost: z.enum([
    // LinkedIn
    "educativo",
    "opinion",
    "analisis",
    "storytelling",
    "caso",
    "reflexion",
    "pregunta",
    "framework",
    // Instagram
    "caption",
    "post_visual",
    "carrusel",
    "microcontenido",
  ]),
  texto: z.string(), // cuerpo del post (LinkedIn) o caption (Instagram)
  hashtags: z.array(z.string()).max(6),
  cta: z.string(),
  slides: z.array(CardSlideSchema).optional(), // presente solo si tipoPost = "carrusel" o hay tarjeta de apoyo
});

export type Post = z.infer<typeof PostSchema>;
export type CardSlide = z.infer<typeof CardSlideSchema>;
