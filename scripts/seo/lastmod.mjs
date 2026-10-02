/* Fecha del último cambio REAL de contenido de cada página.
   Guarda en scripts/seo/lastmod.json una huella del título, la descripción y el
   texto de <main>. Si la huella cambia, la fecha pasa a hoy; si no, se conserva.
   La primera vez, la fecha sale del último commit que tocó el fichero.
   La usan el sitemap (<lastmod>) y los datos estructurados (dateModified). */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REG = path.join(RAIZ, "scripts/seo/lastmod.json");
const registro = fs.existsSync(REG) ? JSON.parse(fs.readFileSync(REG, "utf8")) : {};
export const hoy = new Date().toISOString().slice(0, 10);

export const huella = (s) => {
  const t = (s.match(/<title>[^<]*<\/title>/) || [""])[0] + (s.match(/<meta name="description"[^>]*>/) || [""])[0] + (s.match(/<main[\s\S]*<\/main>/) || [s])[0].replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(t).digest("hex").slice(0, 16);
};
const fechaGit = (rel) => { try { return execFileSync("git", ["log", "-1", "--format=%cs", "--", rel], { cwd: RAIZ, encoding: "utf8" }).trim() || hoy; } catch { return hoy; } };

/** Fecha de última modificación de la página `rel` cuyo HTML es `html`. Actualiza el registro en memoria. */
export function fechaDe(rel, html) {
  const h = huella(html), previo = registro[rel];
  const fecha = !previo ? fechaGit(rel) : previo.huella === h ? previo.fecha : hoy;
  registro[rel] = { huella: h, fecha };
  return fecha;
}
/** Escribe el registro, solo con las páginas indicadas (las que siguen existiendo y son indexables). */
export function guardar(rels) {
  const out = Object.fromEntries(Object.entries(registro).filter(([k]) => !rels || rels.includes(k)).sort());
  fs.writeFileSync(REG, JSON.stringify(out, null, 1) + "\n");
}
