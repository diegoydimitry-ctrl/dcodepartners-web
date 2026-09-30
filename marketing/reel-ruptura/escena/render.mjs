// Render fotograma a fotograma de escena/reel.html (servido en http://localhost:8766 desde marketing/) → ffmpeg.
//   node escena/render.mjs                 → render/imagen.mp4
//   node escena/render.mjs --fotos 1,3.2   → render/fotos/*.png
import { createRequire } from "module"; import { spawn } from "child_process"; import fs from "fs"; import path from "path"; import url from "url";
const require = createRequire(import.meta.url);
const { chromium } = require("/home/claude/.npm-global/lib/node_modules/playwright/index.js");
const AQUI = path.dirname(url.fileURLToPath(import.meta.url)), OUT = path.join(AQUI, "..", "render"); fs.mkdirSync(OUT, { recursive: true });
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const nav = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--force-color-profile=srgb", "--font-render-hinting=none"] });
const pag = await nav.newPage({ viewport: { width: 1080, height: 1920 } });
pag.on("pageerror", (e) => { console.error("[escena] error:", e.message); process.exit(2); });
pag.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.error("[escena]", m.text().slice(0, 300)); });
await pag.goto("http://localhost:8766/reel-ruptura/escena/reel.html");
await pag.waitForFunction(() => window.LISTO === true, null, { timeout: 120000 });
const META = await pag.evaluate(() => window.META);
const [sx0, sy0, sx1, sy1] = META.segura; const fallos = {};
const revisa = (n, cajas) => { for (const b of cajas) { const fuera = b.x0 < sx0 - 1 || b.y0 < sy0 - 1 || b.x1 > sx1 + 1 || b.y1 > sy1 + 1, peq = b.px < META.minpx;
  if (fuera || peq) (fallos[`${b.s}${fuera ? " [fuera]" : ""}${peq ? ` [${b.px.toFixed(0)} px]` : ""}`] ||= []).push(n); } };
const foto = async (n, tipo) => { const cajas = await pag.evaluate((n) => window.pintaFrame(n), n); revisa(n, cajas);
  return pag.screenshot(tipo === "png" ? { type: "png" } : { type: "jpeg", quality: 94 }); };
if (arg("--fotos")) {
  const d = path.join(OUT, "fotos"); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true });
  const lista = arg("--fotos").split(",").map(Number); const t0 = Date.now();
  // para que los estados que dependen del orden (textura congelada) sean correctos, se pintan en orden
  for (const t of lista.sort((a, b) => a - b)) fs.writeFileSync(path.join(d, `t${t.toFixed(2).padStart(6, "0")}.png`), await foto(Math.round(t * META.fps), "png"));
  console.log(`${lista.length} fotos en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
} else {
  const desde = Number(arg("--desde") || 0), hasta = Number(arg("--hasta") || META.duracion), n0 = Math.round(desde * META.fps), n1 = Math.round(hasta * META.fps);
  const dest = path.join(OUT, arg("--salida") || "imagen.mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(META.fps), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", dest], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let n = n0; n < n1; n++) { const img = await foto(n); if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once("drain", r));
    if (n % 120 === 0) console.log(`  ${n}/${n1} · ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r)); console.log(`${n1 - n0} fotogramas → ${dest} en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
const inf = Object.entries(fallos).map(([k, ns]) => ({ texto: k, fotogramas: ns.length, primero: ns[0] / META.fps }));
fs.writeFileSync(path.join(OUT, "cajas.json"), JSON.stringify(inf, null, 1)); console.log(inf.length ? `AVISO: ${inf.length} textos fuera de zona segura o pequeños` : "texto: todo dentro de zona segura");
await nav.close();
