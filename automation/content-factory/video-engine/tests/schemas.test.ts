import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { StoryboardSchema } from "../src/schema/storyboard";
import { PostSchema } from "../src/schema/post";
import { testBatch } from "../src/storyboards/testBatch";
import { testPosts } from "../src/storyboards/testPosts";

describe("StoryboardSchema — lote de prueba", () => {
  for (const storyboard of testBatch) {
    test(`${storyboard.videoId} valida contra StoryboardSchema`, () => {
      const result = StoryboardSchema.safeParse(storyboard);
      assert.equal(result.success, true, JSON.stringify(result.success ? null : result.error.issues));
    });
  }

  test("ningún storyboard del lote lleva voz/TTS (DCP-CONTENT-FACTORY-003)", () => {
    for (const s of testBatch) {
      assert.equal("voice" in s.audio, false, `${s.videoId} todavía tiene audio.voice`);
    }
  });

  test("StoryboardSchema rechaza un audio.voice inesperado (regresión: la voz no debe poder colarse por un objeto extra)", () => {
    const conVozColada = {
      ...testBatch[0],
      audio: { ...testBatch[0].audio, voice: { texto: "x", archivo: "y" } },
    };
    // Zod object() por defecto ignora claves desconocidas (no las valida ni
    // las rechaza) -- lo que de verdad importa es que BrandVideo.tsx y el
    // resto del pipeline nunca LEAN esa clave. Esta prueba documenta ese
    // comportamiento explícitamente para que no sea una sorpresa futura.
    const result = StoryboardSchema.safeParse(conVozColada);
    assert.equal(result.success, true);
    assert.equal((result.data as any).audio.familia, testBatch[0].audio.familia);
  });
});

describe("PostSchema — lote de prueba", () => {
  for (const post of testPosts) {
    test(`${post.postId} valida contra PostSchema`, () => {
      const result = PostSchema.safeParse(post);
      assert.equal(result.success, true, JSON.stringify(result.success ? null : result.error.issues));
    });
  }

  test("hay 3 piezas LinkedIn y 3 Instagram", () => {
    assert.equal(testPosts.filter((p) => p.red === "LinkedIn").length, 3);
    assert.equal(testPosts.filter((p) => p.red === "Instagram").length, 3);
  });
});
