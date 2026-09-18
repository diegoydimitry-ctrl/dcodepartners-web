'use strict';
/**
 * Evidencia pública de la web del lead para la ficha interna.
 * Solo se lee la portada que el propio lead nos ha dado, con defensas contra
 * SSRF (nada de IPs privadas, puertos raros ni redirecciones a otro host),
 * tiempo y tamaño limitados. Lo que se extrae son HECHOS literales de la
 * página (título, descripción, primer titular), con fecha y URL.
 */
const dns = require('node:dns').promises;
const net = require('node:net');

const MAX_BYTES = 400 * 1024;
const TIMEOUT_MS = 4000;

function ipPrivada(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  if (net.isIPv6(ip)) {
    const s = ip.toLowerCase();
    return s === '::1' || s === '::' || s.startsWith('fc') || s.startsWith('fd') ||
      s.startsWith('fe80') || s.startsWith('::ffff:');
  }
  return true;
}

async function hostSeguro(hostname, lookup = dns.lookup) {
  if (net.isIP(hostname)) return false; // no se aceptan IPs literales
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(hostname)) return false;
  const addrs = await lookup(hostname, { all: true });
  return addrs.length > 0 && addrs.every((a) => !ipPrivada(a.address));
}

function extraer(html) {
  const pick = (re) => {
    const m = html.match(re);
    return m ? m[1].replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim().slice(0, 200) : '';
  };
  return {
    titulo: pick(/<title[^>]*>([^<]{1,300})<\/title>/i),
    descripcion: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{1,400})["']/i) ||
      pick(/<meta[^>]+content=["']([^"']{1,400})["'][^>]+name=["']description["']/i),
    h1: pick(/<h1[^>]*>([\s\S]{1,300}?)<\/h1>/i).replace(/<[^>]+>/g, '').trim(),
  };
}

/**
 * @returns {Promise<{ok:boolean, url:string, fecha:string, hechos:string[], motivo?:string}>}
 */
async function leerWeb(url, { fetchImpl = fetch, lookup = dns.lookup, now = () => new Date() } = {}) {
  const fecha = now().toISOString();
  let u;
  try { u = new URL(url); } catch { return { ok: false, url, fecha, hechos: [], motivo: 'URL no válida' }; }
  if (!/^https?:$/.test(u.protocol) || (u.port && !['80', '443'].includes(u.port))) {
    return { ok: false, url, fecha, hechos: [], motivo: 'Protocolo o puerto no permitido' };
  }
  try {
    if (!(await hostSeguro(u.hostname, lookup))) {
      return { ok: false, url, fecha, hechos: [], motivo: 'Host no permitido (privado o sin resolver)' };
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetchImpl(u.toString(), {
      redirect: 'manual', signal: ctrl.signal,
      headers: { 'user-agent': 'DCodeFichaBot/1.0 (+https://dcodepartners.com)', accept: 'text/html' },
    });
    clearTimeout(t);
    if (res.status >= 300 && res.status < 400) {
      return { ok: false, url, fecha, hechos: [], motivo: `La web redirige (HTTP ${res.status}); no se sigue la redirección` };
    }
    if (!res.ok) return { ok: false, url, fecha, hechos: [], motivo: `La web respondió HTTP ${res.status}` };
    const ct = String(res.headers.get('content-type') || '');
    if (!ct.includes('text/html')) return { ok: false, url, fecha, hechos: [], motivo: 'No es una página HTML' };
    const buf = Buffer.from(await res.arrayBuffer()).subarray(0, MAX_BYTES);
    const d = extraer(buf.toString('utf8'));
    const hechos = [`La web ${u.hostname} responde (HTTP ${res.status}) a ${fecha.slice(0, 10)}.`];
    if (d.titulo) hechos.push(`Título de la portada: «${d.titulo}».`);
    if (d.descripcion) hechos.push(`Descripción publicada: «${d.descripcion}».`);
    if (d.h1) hechos.push(`Primer titular (h1): «${d.h1}».`);
    return { ok: true, url: u.toString(), fecha, hechos, datos: d };
  } catch (e) {
    return { ok: false, url, fecha, hechos: [], motivo: e.name === 'AbortError' ? 'Tiempo de espera agotado' : 'No se pudo leer la web' };
  }
}

module.exports = { leerWeb, ipPrivada, hostSeguro, extraer };
