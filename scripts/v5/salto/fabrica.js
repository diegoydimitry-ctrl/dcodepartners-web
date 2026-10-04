/* ==========================================================================
   EL SALTO · la fábrica
   --------------------------------------------------------------------------
   Todo lo que hay que calcular antes de pintar el mundo (el mapa de alturas,
   las mallas, las sombras de las montañas, las texturas de ruido y de roca)
   sale de aquí como datos planos. Se ejecuta en un hilo aparte (obrero.js)
   para que la página no se pare mientras tanto; si el navegador no deja,
   se ejecuta en el hilo principal y da lo mismo.
   ========================================================================== */
import { datosRuido, datosRoca } from "./ruido.js";
import { crearMapa, datosTerreno, geometriaTerreno, horizonte } from "./terreno.js";
import { geometriaRio, datosBruma } from "./agua.js";
import { geometriaPresa, crearObra, geometriaHojas, geometriaChorros, lucesValle, bocaToma } from "./presa.js";
import { geometriaNave, geometriaHaces } from "./nave.js";

function normales(pos, ind) {
  const n = new Float32Array(pos.length);
  for (let i = 0; i < ind.length; i += 3) {
    const a = ind[i] * 3, b = ind[i + 1] * 3, c = ind[i + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const x = uy * vz - uz * vy, y = uz * vx - ux * vz, z = ux * vy - uy * vx;
    n[a] += x; n[a + 1] += y; n[a + 2] += z; n[b] += x; n[b + 1] += y; n[b + 2] += z; n[c] += x; n[c + 1] += y; n[c + 2] += z;
  }
  for (let i = 0; i < n.length; i += 3) { const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1; n[i] /= l; n[i + 1] /= l; n[i + 2] /= l; }
  return n;
}

export function fabricar({ movil = false } = {}) {
  const mapa = crearMapa();
  const terreno = geometriaTerreno(mapa, movil ? 220 : 320, movil ? 300 : 440); terreno.nor = normales(terreno.pos, terreno.ind);
  const obra = crearObra(mapa), horObra = new Float32Array(obra.pos.length / 3);
  for (let i = 0; i < horObra.length; i++) horObra[i] = horizonte(mapa, obra.pos[i * 3], obra.pos[i * 3 + 1] + 0.5, obra.pos[i * 3 + 2], false);
  const nf = obra.faroles.length, farBase = new Float32Array(nf * 3), farDat = new Float32Array(nf * 2);
  obra.faroles.forEach((f, i) => { farBase.set(f, i * 3); farDat[i * 2] = 4.2; farDat[i * 2 + 1] = 0.05 + 0.2 * ((i * 0.618) % 1); });
  // bajo el agua: rayos de luz y motas que derivan hacia la toma
  const boca = bocaToma(); let s = 31; const azar = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const nR = movil ? 26 : 44, rayBase = new Float32Array(nR * 3), rayDat = new Float32Array(nR * 2);
  for (let i = 0; i < nR; i++) { rayBase.set([boca.p[0] - 34 + azar() * 60, 0, boca.p[2] - 4 - azar() * 86], i * 3); rayDat.set([3 + azar() * 7, azar()], i * 2); }
  const nM = movil ? 260 : 520, motBase = new Float32Array(nM * 3), motDat = new Float32Array(nM * 2);
  for (let i = 0; i < nM; i++) { const d = 8 + azar() * 64, a = (azar() - 0.5) * 1.5, e = (azar() - 0.5) * 0.9; motBase.set([boca.p[0] + (boca.n[0] * Math.cos(a) - boca.n[2] * Math.sin(a)) * d, boca.p[1] + Math.sin(e) * d * 0.6 + 2, boca.p[2] + (boca.n[2] * Math.cos(a) + boca.n[0] * Math.sin(a)) * d], i * 3); motDat.set([0.07 + azar() * 0.16, azar()], i * 2); }
  return {
    ruido: datosRuido(256), roca: datosRoca(512), datosTerreno: datosTerreno(mapa),
    terreno, rio: geometriaRio(mapa), bruma: datosBruma(movil ? 90 : 150),
    presa: geometriaPresa(mapa), obra: { pos: obra.pos, nor: obra.nor, mat: obra.mat, ind: obra.ind, hor: horObra }, hojas: geometriaHojas(), chorros: geometriaChorros(mapa),
    faroles: { base: farBase, dat: farDat }, valle: lucesValle(mapa, movil ? 900 : 1500), rayos: { base: rayBase, dat: rayDat }, motas: { base: motBase, dat: motDat },
    nave: geometriaNave(), haces: geometriaHaces(),
  };
}
/* Los búferes que se pueden pasar de un hilo a otro sin copiarlos */
export function transferibles(d, lista = []) { for (const v of Object.values(d)) { if (ArrayBuffer.isView(v)) lista.push(v.buffer); else if (v && typeof v === "object") transferibles(v, lista); } return [...new Set(lista)]; }
