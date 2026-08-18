import { z } from "zod";

/**
 * Contrato entre el Content Engine (n8n, produce este JSON) y el Video Engine
 * (Remotion, lo consume). Cualquier workflow de n8n que genere un guion debe
 * emitir un objeto que valide contra este esquema.
 */

export const SceneSchema = z.object({
  type: z.enum([
    "title", // KineticTitle — hook / statement
    "uiList", // UICardList — notificaciones/tareas
    "network", // NetworkDiagram — sistemas conectados
    "stat", // StatReveal — cifra grande
    "caption", // Caption sobre fondo simple (transición/respiro)
    "endcard", // EndCard — cierre de marca
  ]),
  durationInFrames: z.number().int().positive(),
  props: z.record(z.string(), z.any()),
});

export const StoryboardSchema = z.object({
  videoId: z.string(),
  scriptId: z.string(),
  title: z.string(),
  pilar: z.string(),
  tipo: z.enum([
    "TREND",
    "NEWS",
    "EVERGREEN",
    "OPINION",
    "EDUCATIONAL",
    "PROMOTIONAL",
  ]),
  formato: z.enum(["reel", "linkedinSquare", "linkedinWide"]),
  fps: z.number().default(30),
  scenes: z.array(SceneSchema).min(2),
  caption: z.object({
    headline: z.string(),
    body: z.string(),
    hashtags: z.array(z.string()).max(6),
  }),
});

export type Storyboard = z.infer<typeof StoryboardSchema>;
export type Scene = z.infer<typeof SceneSchema>;

export const totalDuration = (storyboard: Storyboard) =>
  storyboard.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
