// Render de un Reel fotograma a fotograma (Chromium sin interfaz + ffmpeg).
//
//   node comun/render-reel.mjs ia                  → ia/render/imagen.mp4
//   node comun/render-reel.mjs ia --fotos 0.5,4.2  → ia/render/fotos/*.png
//   node comun/render-reel.mjs ia --portada 0.4    → ia/entrega/portada.png
//
// Copia comun/reel.html a <reel>/escena.html (las rutas relativas valen igual: son carpetas hermanas) y le pasa
// reel.json y cache/medios.json como window.DATOS. Revisa en cada fotograma que el texto quede en la zona segura.
import { createRequire } from "module"; import { spawn } from "child_process";
import fs from "fs"; import path from "path"; import url from "url";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");
const AQUI = path.dirname(url.fileURLToPath(import.meta.url));
const reel = process.argv[2]; const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const base = path.join(AQUI, "..", reel), out = path.join(base, "render"); fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(path.join(AQUI, "reel.html"), path.join(base, "escena.html"));
const DATOS = { reel: JSON.parse(fs.readFileSync(path.join(base, "reel.json"), "utf8")), medios: JSON.parse(fs.readFileSync(path.join(base, "cache", "medios.json"), "utf8")) };
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined,
  args: ["--allow-file-access-from-files", "--disable-web-security", "--force-color-profile=srgb", "--font-render-hinting=none"] });
const pag = await nav.newPage();
pag.on("pageerror", (e) => { console.error("[escena] error:", e.message); process.exit(2); });
pag.on("console", (m) => { if (m.type() === "error") console.error("[escena]", m.text()); });
await pag.addInitScript((d) => { window.DATOS = d; }, DATOS);
await pag.goto(url.pathToFileURL(path.join(base, "escena.html")).href);
await pag.waitForFunction(() => window.LISTO === true, null, { timeout: 60000 });
const META = await pag.evaluate(() => window.META);
await pag.setViewportSize({ width: META.W, height: META.H });
const lienzo = await pag.$("canvas");
// en el render completo se usa JPEG al 95 % (mucho más rápido que PNG y sin pérdida visible antes del x264 final)
const RAPIDO = !(arg("--fotos") || arg("--portada"));
const pinta = async (n) => { const cajas = await pag.evaluate((n) => window.pintaFrame(n), n);
  return { png: await lienzo.screenshot(RAPIDO ? { type: "jpeg", quality: 95 } : { type: "png" }), cajas }; };
const [sx0, sy0, sx1, sy1] = META.segura; const fallos = {};
const revisa = (n, cajas) => { for (const b of cajas) { const fuera = b.x0 < sx0 - 1 || b.y0 < sy0 - 1 || b.x1 > sx1 + 1 || b.y1 > sy1 + 1, peq = b.px < META.minpx;
  if (fuera || peq) (fallos[`${b.s}${fuera ? " [fuera]" : ""}${peq ? ` [${b.px.toFixed(0)} px]` : ""}`] ||= []).push(n); } };
if (arg("--fotos") || arg("--portada")) {
  const lista = (arg("--fotos") || arg("--portada")).split(",").map(Number);
  const d = arg("--portada") ? path.join(base, "entrega") : path.join(out, "fotos");
  if (!arg("--portada")) fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true });
  for (const t of lista) { const n = Math.round(t * META.fps); const { png, cajas } = await pinta(n); revisa(n, cajas);
    fs.writeFileSync(path.join(d, arg("--portada") ? "portada-9x16.png" : `t${t.toFixed(2).padStart(6, "0")}.png`), png); }
  console.log(`${lista.length} fotogramas → ${d}`);
} else {
  const n1 = Math.round(META.duracion * META.fps), dest = path.join(out, "imagen.mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(META.fps), "-i", "-", "-c:v", "libx264", "-preset", "slow",
    "-crf", "14", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", dest], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let n = 0; n < n1; n++) { const { png, cajas } = await pinta(n); revisa(n, cajas); if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (n % 150 === 0) console.log(`  ${n}/${n1} · ${((Date.now() - t0) / 1000).toFixed(0)} s`); }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r));
  console.log(`${n1} fotogramas → ${dest} en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
const inf = Object.entries(fallos).map(([k, ns]) => ({ texto: k, fotogramas: ns.length, primero: ns[0] / META.fps }));
fs.writeFileSync(path.join(out, "cajas.json"), JSON.stringify(inf, null, 1));
console.log(inf.length ? `AVISO: ${inf.length} textos fuera de zona segura o pequeños → render/cajas.json` : "texto: todo dentro de zona segura");
await nav.close();
