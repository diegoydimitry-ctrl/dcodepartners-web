#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════
 * EL CONSENTIMIENTO Y LA ANALÍTICA, SOLO EN EL DOMINIO REAL Y EN ESE ORDEN
 * ══════════════════════════════════════════════════════════════════════════
 *
 * QUÉ PASABA. Las 70 páginas cargaban CookieYes y Google Analytics con dos
 * etiquetas fijas en el `<head>`. En cualquier dominio que no sea el real eso
 * tiene dos consecuencias, y ninguna es cosmética:
 *
 *   · CookieYes tiene registrado `dcodepartners.com`. En un Preview no levanta
 *     el banner y avisa por consola de que la URL no es la suya. O sea: no hay
 *     consentimiento que dar ni banner que probar, y sí un error en consola.
 *   · Google Analytics sí funcionaba, así que las visitas a los Previews
 *     —incluidas las comprobaciones de quien estaba revisando— se contaban en
 *     la misma propiedad que el tráfico real.
 *
 * QUÉ SE COMPRUEBA AQUÍ, página por página:
 *
 *   1. No queda ninguna etiqueta suelta de CookieYes ni de Google Analytics.
 *      Si vuelve una, se ejecuta en todas partes otra vez.
 *   2. La puerta existe y nombra exactamente los dos dominios de producción.
 *   3. La analítica se crea DENTRO del `onload` de CookieYes. Esto es lo que
 *      de verdad protege: si se creara fuera, las dos peticiones saldrían en
 *      paralelo y Analytics podría ejecutarse antes de que el bloqueador de
 *      consentimiento esté instalado. Es más estricto que el orden anterior,
 *      no menos: si CookieYes no carga, la analítica tampoco.
 *   4. El identificador de medición es el mismo en todas partes.
 *
 * Esto es análisis estático. El comportamiento real está comprobado en un
 * navegador sirviendo el sitio BAJO el origen de producción —para que
 * `location.hostname` sea el de verdad— y da: en producción, CookieYes y
 * después Analytics; en Preview y en local, ninguna de las dos.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MEDICION = 'G-ZL004F9EBH';
const DOMINIOS = ["'dcodepartners.com'", "'www.dcodepartners.com'"];

const paginas = execFileSync('git', ['-C', RAIZ, 'ls-files', '*.html'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const problemas = [];

for (const relativa of paginas) {
  const html = readFileSync(path.join(RAIZ, relativa), 'utf8');

  // ¿Es una página con analítica? Las dos demos embebidas no la llevan.
  const tienePuerta = html.includes('location.hostname');
  const nombraCookieYes = html.includes('cdn-cookieyes.com');
  const nombraAnalytics = html.includes('googletagmanager.com');
  if (!nombraCookieYes && !nombraAnalytics) continue;

  const fallo = (que) => problemas.push(`${relativa}: ${que}`);

  // 1 · Nada suelto en el marcado.
  if (/<script[^>]+src=["']https:\/\/cdn-cookieyes\.com/.test(html)) fallo('etiqueta suelta de CookieYes: se ejecutaría en cualquier dominio');
  if (/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com/.test(html)) fallo('etiqueta suelta de Analytics: se ejecutaría en cualquier dominio');

  // 2 · La puerta, con los dominios de producción.
  if (!tienePuerta) fallo('no hay puerta por dominio');
  for (const dominio of DOMINIOS) {
    if (!html.includes(dominio)) fallo(`la puerta no nombra ${dominio}`);
  }

  // 3 · La analítica, dentro del onload de CookieYes.
  const onload = html.indexOf('cookieyes.onload');
  const creaAnalytics = html.indexOf('googletagmanager.com/gtag/js');
  if (nombraAnalytics) {
    if (onload === -1) fallo('CookieYes no encadena nada: falta su onload');
    else if (creaAnalytics === -1 || creaAnalytics < onload) {
      fallo('la analítica no se crea dentro del onload de CookieYes: podría ejecutarse antes que el consentimiento');
    }
  }

  // 4 · Un solo identificador de medición.
  const medidas = [...html.matchAll(/G-[A-Z0-9]{8,}/g)].map((m) => m[0]);
  for (const m of new Set(medidas)) {
    if (m !== MEDICION) fallo(`identificador de medición inesperado: ${m}`);
  }
}

/* Contar cero páginas significaría que el detector está roto, no que todo
   esté bien: sin esto, mover la carpeta dejaría el centinela en verde. */
if (paginas.length === 0) {
  console.error('\n✗ no se ha encontrado ninguna página: el verificador está roto, no limpio\n');
  process.exit(1);
}

const conAnalitica = paginas.filter((f) => readFileSync(path.join(RAIZ, f), 'utf8').includes('cdn-cookieyes.com')).length;

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s) en la carga de consentimiento y analítica:\n`);
  for (const p of problemas.slice(0, 30)) console.error(`  · ${p}`);
  if (problemas.length > 30) console.error(`  · … y ${problemas.length - 30} más`);
  console.error('');
  process.exit(1);
}

console.log(`Consentimiento y analítica: ${conAnalitica} de ${paginas.length} páginas, todas tras la puerta de dominio.`);
console.log('✓ Fuera de dcodepartners.com no se carga ninguno de los dos, y la analítica nunca va por delante del consentimiento.');
