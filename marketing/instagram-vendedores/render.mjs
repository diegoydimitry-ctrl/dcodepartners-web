// Renderiza el anuncio fotograma a fotograma. Determinista: el mismo rango produce siempre los mismos PNG.
//
//   node render.mjs [desde] [hasta] [salida]
//   node render.mjs --muestras 0,140,300,470,620,712   (solo esos fotogramas, para revisar el diseño)
//
// Misma idea que marketing/youtube/_build/render.mjs: cada fotograma se pinta en función de su índice y de
// nada más, así que el trabajo se puede trocear en varios procesos y concatenar después.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const EXE = process.env.CHROMIUM || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const args = process.argv.slice(2);
const iM = args.indexOf("--muestras");
const muestras = iM >= 0 ? args[iM + 1].split(",").map(Number) : null;
const resto = iM >= 0 ? args.slice(0, iM) : args;
const desde = Number(resto[0] ?? 0);
const hastaArg = resto[1];
const SALIDA = resolve(resto[2] ?? `${AQUI}/frames`);
mkdirSync(SALIDA, { recursive: true });

const nav = await chromium.launch({
  executablePath: EXE,
  args: ["--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none", "--no-sandbox"],
});
const ctx = await nav.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
p.on("pageerror", (e) => console.error("PAGEERROR:", String(e).slice(0, 300)));
await p.goto("file://" + resolve(AQUI, "escena.html"), { waitUntil: "load" });
await p.waitForFunction(() => window.LISTO === true, null, { timeout: 60000 });

const META = await p.evaluate(() => window.META);
const lista = muestras ?? Array.from({ length: (hastaArg ? Number(hastaArg) : META.FRAMES) - desde }, (_, i) => desde + i);
console.log(`escena ${META.W}x${META.H} @${META.FPS} · ${META.FRAMES} fotogramas · se renderizan ${lista.length}`);

const t0 = Date.now();
let hechos = 0;
for (const f of lista) {
  await p.evaluate((n) => window.pintaFrame(n), f);
  await p.locator("#c").screenshot({ path: `${SALIDA}/f${String(f).padStart(5, "0")}.png` });
  hechos++;
  if (hechos % 30 === 0 || hechos === lista.length) {
    const seg = (Date.now() - t0) / 1000;
    const rest = ((lista.length - hechos) * (seg / hechos)) / 60;
    process.stdout.write(`\r  ${hechos}/${lista.length}  ${(seg / hechos).toFixed(2)} s/f  quedan ~${rest.toFixed(1)} min   `);
  }
}
console.log(`\nlisto en ${((Date.now() - t0) / 60000).toFixed(1)} min · ${SALIDA}`);
await nav.close();
