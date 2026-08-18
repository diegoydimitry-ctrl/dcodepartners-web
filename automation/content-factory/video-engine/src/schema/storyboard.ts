import { z } from "zod";

/**
 * Contrato entre el Content Engine (n8n, produce este JSON) y el Video Engine
 * (Remotion, lo consume). Cualquier workflow de n8n que genere un guion debe
 * emitir un objeto que valide contra este esquema.
 */

// SFX del Audio Engine (public/audio/sfx/*.wav) — ver scripts/generate_audio.py
export const SoundCueSchema = z.enum([
  "whoosh",
  "impact",
  "blip",
  "riser",
  "soft-close",
]);

// Camas musicales del Audio Engine (public/audio/beds/*.mp3), una por
// familia sonora — ver scripts/generate_audio.py para el diseño de cada una.
export const AudioFamilySchema = z.enum([
  "tech",
  "cinematic",
  "educational",
  "problem",
  "storytelling",
  "opinion",
  "experimental",
]);

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
  // Efecto sonoro disparado en el frame 0 de esta escena — la sincronización
  // audiovisual que pedía el encargo: un cambio de escena/reveal SIN soundCue
  // es una decisión consciente (silencio intencionado), no un olvido.
  soundCue: SoundCueSchema.optional(),
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
  audio: z.object({
    // "none" = silencio intencionado (opción legítima, no un vídeo a medio
    // hacer). El Format/Audio Decision Engine (n8n) es quien elige esto,
    // nunca un valor por defecto sin decidir.
    familia: AudioFamilySchema.nullable(),
    bedVolume: z.number().min(0).max(1).default(0.35),
    voice: z
      .object({
        texto: z.string(),
        // Ruta al wav generado por scripts/generate-tts.sh para ESTE vídeo
        // en concreto (la voz es específica del guion, no un asset fijo).
        archivo: z.string(),
      })
      .nullable(),
  }),
});

export type Storyboard = z.infer<typeof StoryboardSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type SoundCue = z.infer<typeof SoundCueSchema>;
export type AudioFamily = z.infer<typeof AudioFamilySchema>;

export const totalDuration = (storyboard: Storyboard) =>
  storyboard.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
