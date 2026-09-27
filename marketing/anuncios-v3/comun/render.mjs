// Render fotograma a fotograma de una escena (Chromium sin interfaz + ffmpeg).
//
//   node comun/render.mjs v1-youtube                    → render/imagen.mp4 (vídeo sin audio, todos los fotogramas)
//   node comun/render.mjs v1-youtube --fotos 0.5,4.1    → render/fotos/*.png (fotogramas sueltos, para revisar)
//   node comun/render.mjs v1-youtube --desde 10 --hasta 16
//
// La escena expone window.META ({W, H, fps, duracion, segura:[x0,y0,x1,y1], minpx}), window.LISTO y
// window.pintaFrame(n). En cada fotograma se recogen las cajas de texto (M.CAJAS) y se comprueba que todo el
// texto está dentro de la zona segura y por encima del tamaño mínimo: el informe queda en render/cajas.json.
//
// Variables: PLAYWRIGHT (ruta al paquete playwright), CHROMIUM (ejecutable).
import { createRequire } from "module";
import { spawn } from "child_process";
import fs from "fs"; import path from "path"; import url from "url";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");
const AQUI = path.dirname(url.fileURLToPath(import.meta.url));
const video = process.argv[2]; const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const base = path.join(AQUI, "..", video); const out = path.join(base, "render"); fs.mkdirSync(out, { recursive: true });

const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined,
  args: ["--allow-file-access-from-files", "--disable-web-security", "--force-color-profile=srgb", "--font-render-hinting=none"] });
const pag = await nav.newPage();
pag.on("console", (m) => { if (m.type() === "error") console.error("[escena]", m.text()); });
pag.on("pageerror", (e) => { console.error("[escena] error:", e.message); process.exit(2); });
// los datos de montaje (tiempos de voz y palabras) y los golpes de la banda sonora entran como window.DATOS
const DATOS = { montaje: JSON.parse(fs.readFileSync(path.join(base, "montaje.json"), "utf8")) };
for (const f of ["cortes.json", "golpes.json"]) { const p = path.join(base, "audio", f); if (fs.existsSync(p)) DATOS[f.replace(".json", "")] = JSON.parse(fs.readFileSync(p, "utf8")); }
await pag.addInitScript((d) => { window.DATOS = d; }, DATOS);
await pag.goto(url.pathToFileURL(path.join(base, "escena.html")).href);
await pag.waitForFunction(() => window.LISTO === true, null, { timeout: 60000 });
const META = await pag.evaluate(() => window.META);
await pag.setViewportSize({ width: META.W, height: META.H });
const lienzo = await pag.$("canvas");
const pinta = async (n) => {
  const cajas = await pag.evaluate((n) => { window.pintaFrame(n); return window.M.CAJAS; }, n);
  const png = await lienzo.screenshot({ type: "png" });
  return { png, cajas };
};

// comprobación de zonas seguras / tamaño mínimo
const [sx0, sy0, sx1, sy1] = META.segura; const fallos = {};
const revisa = (n, cajas) => {
  for (const b of cajas) {
    const fuera = b.x0 < sx0 - 1 || b.y0 < sy0 - 1 || b.x1 > sx1 + 1 || b.y1 > sy1 + 1;
    const peq = b.px < META.minpx && !b.s.startsWith("·");
    if (fuera || peq) { const k = `${b.s}${fuera ? " [fuera]" : ""}${peq ? ` [${b.px.toFixed(0)} px]` : ""}`; (fallos[k] ||= []).push(n); }
  }
};

const fotos = arg("--fotos");
if (fotos) {
  const d = path.join(out, "fotos"); fs.rmSync(d, { recursive: true, force: true }); fs.mkdirSync(d, { recursive: true });
  for (const t of fotos.split(",").map(Number)) {
    const n = Math.round(t * META.fps); const { png, cajas } = await pinta(n); revisa(n, cajas);
    fs.writeFileSync(path.join(d, `t${t.toFixed(2).padStart(6, "0")}.png`), png);
  }
  console.log(`${fotos.split(",").length} fotogramas en ${d}`);
} else {
  const n0 = Math.round((+arg("--desde") || 0) * META.fps);
  const n1 = Math.round((arg("--hasta") ? +arg("--hasta") : META.duracion) * META.fps);
  const dest = path.join(out, arg("--salida") || "imagen.mp4");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(META.fps), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", dest], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let n = n0; n < n1; n++) {
    const { png, cajas } = await pinta(n); revisa(n, cajas);
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once("drain", r));
    if (n % 150 === 0) console.log(`  ${n}/${n1} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on("close", r));
  console.log(`${n1 - n0} fotogramas → ${dest} en ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
const informe = Object.entries(fallos).map(([k, ns]) => ({ texto: k, fotogramas: ns.length, primero: ns[0] / META.fps }));
fs.writeFileSync(path.join(out, "cajas.json"), JSON.stringify(informe, null, 1));
console.log(informe.length ? `AVISO: ${informe.length} textos fuera de zona segura o por debajo de ${META.minpx}px → render/cajas.json`
                           : "texto: todo dentro de zona segura y por encima del tamaño mínimo");
await nav.close();
