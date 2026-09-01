#!/usr/bin/env node
'use strict';

/**
 * COMPROBACIONES QUE NO NECESITAN UN DESPLIEGUE.
 *
 * ────────────────────────────────────────────────────────────────────────
 * EL HUECO QUE ESTO TAPA
 * ────────────────────────────────────────────────────────────────────────
 *
 * `qa-preview.yml` es bueno, pero solo se dispara en pull request y solo
 * puede correr DESPUES de que Vercel haya desplegado una Preview. Eso deja
 * un agujero concreto: un push directo a `main` va a produccion sin pasar
 * por ninguna comprobacion, porque cuando la QA podria ejecutarse el cambio
 * ya esta publicado.
 *
 * Contra un push directo, lo unico que puede evitar la promocion de una
 * version rota es una comprobacion que NO dependa de que el sitio ya este
 * desplegado. Eso es este fichero.
 *
 * No sustituye a la QA de navegador: la complementa. Esta corre en segundos,
 * sin red y sin Chromium, asi que puede ejecutarse en CADA push y tambien en
 * local antes de subir nada (`npm run verificar`).
 *
 * ────────────────────────────────────────────────────────────────────────
 * QUE COMPRUEBA, Y POR QUE CADA COSA
 * ────────────────────────────────────────────────────────────────────────
 *
 * Ninguna de las cuatro es decorativa: las cuatro corresponden a una clase
 * de fallo que este sitio puede sufrir de verdad.
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..');
const IGNORAR = new Set(['node_modules', '.git', '.github', 'docs']);

let fallos = 0;
let comprobaciones = 0;

function error(msg) {
  fallos++;
  console.error(`  ✗ ${msg}`);
}
function bien(msg) {
  console.log(`  ✓ ${msg}`);
}
function titulo(n, t) {
  console.log(`\n${n}. ${t}`);
}

/** Recorre el arbol saltando node_modules y demas. */
function ficheros(dir, ext, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || IGNORAR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) ficheros(p, ext, acc);
    else if (e.name.endsWith(ext)) acc.push(p);
  }
  return acc;
}

const rel = (p) => path.relative(RAIZ, p);

// ─────────────────────────────────────────────────────────────────────────
// 1. JAVASCRIPT QUE NO COMPILA
//
// Un error de sintaxis en `api/contact-fallback.js` no rompe el build de un
// sitio estatico: rompe la funcion serverless en caliente, cuando alguien
// intenta usarla. Cuesta un segundo comprobarlo y evita justo eso.
// ─────────────────────────────────────────────────────────────────────────
titulo(1, 'Sintaxis de JavaScript');
{
  const js = [
    ...ficheros(path.join(RAIZ, 'api'), '.js'),
    ...ficheros(path.join(RAIZ, 'lib'), '.js'),
    ...ficheros(path.join(RAIZ, 'scripts'), '.js'),
    ...ficheros(path.join(RAIZ, 'assets'), '.js'),
  ];
  for (const f of js) {
    comprobaciones++;
    try {
      execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
    } catch (e) {
      error(`${rel(f)} no compila: ${String(e.stderr || e.message).split('\n')[0]}`);
    }
  }
  if (fallos === 0) bien(`${js.length} ficheros JavaScript compilan`);
}

// ─────────────────────────────────────────────────────────────────────────
// 2. HTML CON ETIQUETAS DESCUADRADAS
//
// Una etiqueta sin cerrar no da error en ningun sitio: el navegador la
// arregla a su manera y la pagina sale mal solo para algunos visitantes.
// Es el tipo de fallo que llega a produccion sin que nadie lo vea venir.
// ─────────────────────────────────────────────────────────────────────────
titulo(2, 'Estructura del HTML');
{
  const VACIAS = new Set(['br','img','link','meta','input','hr','source','path','rect',
    'circle','use','area','base','col','embed','track','wbr','polyline','line','ellipse','polygon','stop']);
  const htmls = ficheros(RAIZ, '.html');
  let malos = 0;

  for (const f of htmls) {
    comprobaciones++;
    const texto = fs.readFileSync(f, 'utf8');
    const pila = [];
    const problemas = [];
    // Se ignora el contenido de <script> y <style>: dentro hay '<' que no son etiquetas.
    const limpio = texto
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<script></script>')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '<style></style>')
      .replace(/<!--[\s\S]*?-->/g, '');

    const re = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
    let m;
    while ((m = re.exec(limpio)) !== null) {
      const cierre = m[1] === '/';
      const nombre = m[2].toLowerCase();
      const autocierre = m[3] === '/';
      if (VACIAS.has(nombre) || autocierre) continue;
      if (!cierre) pila.push(nombre);
      else if (pila[pila.length - 1] === nombre) pila.pop();
      else if (pila.includes(nombre)) {
        while (pila.length && pila.pop() !== nombre) { /* se descarta lo mal anidado */ }
        problemas.push(`</${nombre}> cierra algo que no era lo ultimo abierto`);
      } else {
        problemas.push(`</${nombre}> sin apertura`);
      }
    }
    if (pila.length) problemas.push(`sin cerrar: <${pila.slice(0, 4).join('>, <')}>`);
    if (problemas.length) {
      malos++;
      error(`${rel(f)}: ${problemas.slice(0, 3).join(' | ')}`);
    }
  }
  if (!malos) bien(`${htmls.length} paginas HTML con las etiquetas cuadradas`);
}

// ─────────────────────────────────────────────────────────────────────────
// 3. EL DESTINATARIO DEL FORMULARIO SIGUE SIENDO FIJO
//
// GUARDARRAIL DE REGRESION, no un capricho de estilo.
//
// `api/contact-fallback.js` envia un correo. Si el destinatario saliera del
// cuerpo de la peticion, cualquiera podria hacer que el servidor enviase
// correo a quien quisiera: un relay abierto con el dominio de D-Code de
// remitente. Ya lo fue una vez y se corrigio fijando el destinatario en el
// codigo.
//
// Esta comprobacion existe para que no pueda volver a abrirse sin que nadie
// se entere.
// ─────────────────────────────────────────────────────────────────────────
titulo(3, 'El respaldo de contacto no puede convertirse en un relay abierto');
{
  comprobaciones++;
  const f = path.join(RAIZ, 'api', 'contact-fallback.js');
  if (!fs.existsSync(f)) {
    error('api/contact-fallback.js no existe (si se ha retirado a proposito, quita esta comprobacion)');
  } else {
    const src = fs.readFileSync(f, 'utf8');
    const fijo = /to:\s*\[\s*['"][^'"]+@[^'"]+['"]\s*\]/.test(src);
    // Un destinatario que venga del cuerpo de la peticion es exactamente el agujero.
    const desdePeticion = /to:\s*(?!\[)[^,\n]*\b(req|body|payload|datos)\b/.test(src);
    if (!fijo) error('el destinatario ya no es una direccion fija escrita en el codigo');
    else if (desdePeticion) error('el destinatario parece salir de la peticion: eso es un relay abierto');
    else bien('destinatario fijo en el codigo, no tomado de la peticion');
  }
}

// ─────────────────────────────────────────────────────────────────────────
// 4. NINGUNA PAGINA APUNTA A UN FICHERO QUE NO EXISTE
//
// Un CSS o un JS renombrado y no actualizado en el HTML despliega
// perfectamente y deja la pagina sin estilos o sin comportamiento. El
// despliegue sale verde; la web sale rota.
// ─────────────────────────────────────────────────────────────────────────
titulo(4, 'Los ficheros que referencia el HTML existen');
{
  const htmls = ficheros(RAIZ, '.html');
  const rotos = [];
  for (const f of htmls) {
    const texto = fs.readFileSync(f, 'utf8');
    const re = /(?:src|href)\s*=\s*["'](\/[^"'#?]+)(?:\?[^"']*)?["']/g;
    let m;
    while ((m = re.exec(texto)) !== null) {
      const ruta = m[1];
      // Solo ficheros con extension: las rutas de pagina las resuelve Vercel.
      if (!/\.[a-z0-9]{2,5}$/i.test(ruta)) continue;
      comprobaciones++;
      if (!fs.existsSync(path.join(RAIZ, ruta))) rotos.push(`${rel(f)} -> ${ruta}`);
    }
  }
  if (rotos.length) {
    for (const r of rotos.slice(0, 10)) error(r);
    if (rotos.length > 10) error(`...y ${rotos.length - 10} mas`);
  } else {
    bien('todas las referencias locales resuelven a un fichero real');
  }
}

// ─────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(64)}`);
if (fallos) {
  console.error(`FALLO: ${fallos} problema(s) en ${comprobaciones} comprobaciones.`);
  console.error('Esto NO debe llegar a produccion. Corrigelo antes de desplegar.');
  process.exit(1);
}
console.log(`OK: ${comprobaciones} comprobaciones, ningun problema.`);
