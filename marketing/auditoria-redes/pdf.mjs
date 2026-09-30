import { createRequire } from "module"; import url from "url"; import path from "path";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ["--allow-file-access-from-files"] });
const p = await b.newPage();
await p.goto(url.pathToFileURL(path.resolve("auditoria-redes-dcode.html")).href); await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: "AUDITORIA-REDES-DCODE-30-09-2026.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
await b.close();
