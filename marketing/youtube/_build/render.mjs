// Renderiza la escena fotograma a fotograma. Determinista: el mismo rango
// de fotogramas produce siempre los mismos PNG.
//
//   node render.mjs [desde] [hasta] [salida]
//
// Se puede trocear en varios procesos y luego concatenar, porque cada
// fotograma se pinta en función de su índice y de nada más.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const desde = Number(process.argv[2] ?? 0);
const hastaArg = process.argv[3];
const SALIDA = resolve(process.argv[4] ?? `${AQUI}/frames`);
mkdirSync(SALIDA, { recursive: true });

const nav = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none"],
});
const ctx = await nav.newContext({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.error("PAGEERROR:", String(e).slice(0, 300)));
await p.goto("file://" + resolve(AQUI, "escena.html"), { waitUntil: "load" });
await p.waitForFunction(() => window.LISTO === true, null, { timeout: 60000 });

const META = await p.evaluate(() => window.META);
const hasta = hastaArg ? Number(hastaArg) : META.FRAMES;
console.log(`escena ${META.W}x${META.H} @${META.FPS} · ${META.FRAMES} fotogramas · rango ${desde}..${hasta - 1}`);

const t0 = Date.now();
for (let f = desde; f < hasta; f++) {
  await p.evaluate((n) => window.pintaFrame(n), f);
  await p.locator("#c").screenshot({ path: `${SALIDA}/f${String(f).padStart(5, "0")}.png` });
  if ((f - desde) % 25 === 0 || f === hasta - 1) {
    const hechos = f - desde + 1;
    const seg = (Date.now() - t0) / 1000;
    const rest = ((hasta - desde - hechos) * (seg / hechos)) / 60;
    process.stdout.write(`\r  ${f + 1}/${hasta}  ${(seg / hechos).toFixed(2)} s/f  quedan ~${rest.toFixed(1)} min   `);
  }
}
console.log(`\nlisto en ${((Date.now() - t0) / 60000).toFixed(1)} min`);
await nav.close();
