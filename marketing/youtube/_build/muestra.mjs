import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const SAL = "/tmp/muestra"; mkdirSync(SAL, { recursive: true });
const SEGS = process.argv.slice(2).map(Number);
const nav = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args:["--force-color-profile=srgb","--font-render-hinting=none"] });
const ctx = await nav.newContext({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
p.on("pageerror", e => console.error("ERR:", String(e).slice(0,200)));
await p.goto("file://" + resolve(AQUI, "escena.html"), { waitUntil: "load" });
await p.waitForFunction(() => window.LISTO === true, null, { timeout: 60000 });
let i = 0;
for (const s of SEGS) {
  await p.evaluate((n) => window.pintaFrame(n), Math.round(s * 30));
  await p.locator("#c").screenshot({ path: `${SAL}/m${String(i++).padStart(2,"0")}_${String(s).replace(".","_")}s.png` });
}
console.log("muestras:", SEGS.join(" "));
await nav.close();
