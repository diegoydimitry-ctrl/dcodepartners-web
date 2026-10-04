/* ==========================================================================
   D-CODE · portada «el banco de trabajo» · la dirección de escena
   --------------------------------------------------------------------------
   El contenido es HTML y está en la página desde el principio. La escena es
   una sola fotografía en movimiento: imágenes hechas con trazado de rayos
   (scripts/v7/escena.py) que este módulo va enseñando según el scroll.
     · cada <section data-acto> es un momento del recorrido; entre uno y otro
       se pasan los fotogramas del viaje de la cámara y de las cosas;
     · encima de la imagen van, con su misma perspectiva, dos trozos de HTML
       de verdad: lo que Finance registra en la pantalla del portátil y el
       nombre de tu empresa en la placa de la base;
     · lo que se puede tocar: elegir una de las cuatro partes, pasar una
       factura por Finance con la cifra que se quiera, escribir un nombre.
   Movimiento reducido o ahorro de datos: no hay viaje, cada acto enseña su
   fotografía. Sin JavaScript, lo mismo por CSS. Todo sigue funcionando.
   ========================================================================== */
const DATOS = /*DATOS*/{"v":"3d5b4e25b0","fondo":"rgb(233, 233, 232)","tr":{"h":[[-1,10],[0,10],[1,16],[2,20],[3,20],[4,20],[5,20],[7,20]],"v":[[-1,8],[0,8],[1,14]]},"sobre":{"5h":{"pantalla":[[0.49368,0.2283],[0.90632,0.2283],[0.91167,0.68023],[0.48833,0.68023]]},"8h":{"chapa":[[0.62579,0.76695],[0.96764,0.6735],[0.96723,0.71653],[0.62592,0.81661]]},"5v":{"pantalla":[[0.24211,0.30896],[0.75789,0.30896],[0.76459,0.62672],[0.23541,0.62672]]},"8v":{"chapa":[[0.44646,0.6448],[0.83646,0.58585],[0.83594,0.61346],[0.44656,0.67659]]}},"cajas":{"h":{"movil":[0.3692,0.5371,0.441,0.758],"tableta":[0.4294,0.4224,0.6271,0.7085],"portatil":[0.598,0.2824,0.8874,0.6846],"factura":[0.8266,0.1777,0.9568,0.5682]},"v":{"movil":[0.1224,0.4965,0.2049,0.6405],"tableta":[0.1922,0.4225,0.4208,0.6085],"portatil":[0.3879,0.3318,0.7234,0.5941],"factura":[0.6536,0.2639,0.8045,0.5188]}}}/*FIN*/;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = $("[data-maq]");
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const q = new URLSearchParams(location.search);
const EN = document.documentElement.lang === "en";
const tope = (v, a, b) => Math.min(b, Math.max(a, v));
const suave = (a, b, x) => { const t = tope((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* De un rectángulo (w × h) a cuatro esquinas cualesquiera: la matriz que coloca un trozo de HTML sobre un plano de la fotografía. */
function matriz(w, h, e) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = e;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, k = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, f = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${f / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}

/* ------------------------------------------------------------ la escena */
function crearEscena(lienzo, plano, { movil, ligera }) {
  const ctx = lienzo.getContext("2d", { alpha: false });
  if (!ctx) return null;
  const P = movil ? ["v", "u"] : ["h", "t"], TR = new Map(DATOS.tr[movil ? "v" : "h"]), FONDO = DATOS.fondo, LADO = movil ? 1 : 16 / 9;
  const mem = new Map(), cola = [];
  let W = 0, H = 0, dpr = 1, caja = { x: 0, y: 0, w: 1, h: 1 }, c = 0, sucio = true, enVuelo = 0, alPintar = null, alCargar = null;
  const url = (n) => `/assets/v2/img/escena/${n}.webp?v=${DATOS.v}`;
  const fija = (i) => `${P[0]}-${i === 7 ? 6 : tope(i, 0, 8)}`;
  // el fotograma k del tramo que empieza en el acto i (0 y n son las dos fotografías de los extremos)
  const cuadro = (i, k) => { const n = TR.get(i); if (!n || k >= n) return fija(i + 1); if (k <= 0) return i < 0 ? `${P[1]}--1-01` : fija(i); return `${P[1]}-${i}-${String(k).padStart(2, "0")}`; };
  // el gris del fondo del plató en la esquina de arriba a la izquierda de una imagen: con él se continúa la pared donde la fotografía no llega
  const gota = document.createElement("canvas"); gota.width = gota.height = 1; const gctx = gota.getContext("2d", { willReadFrequently: true });
  const techo = (im) => { try { gctx.drawImage(im, 0, 0, im.naturalWidth * 0.05, 3, 0, 0, 1, 1); const d = gctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; } catch (err) { return null; } };
  const bajar = () => {
    while (enVuelo < 4 && cola.length) {
      const n = cola.shift(), e = mem.get(n); if (e.pedida) continue;
      e.pedida = true; enVuelo++; const im = new Image(); im.decoding = "async"; e.im = im;
      im.onload = () => { e.ok = true; e.techo = techo(im); enVuelo--; sucio = true; if (alCargar) alCargar(n); bajar(); };
      im.onerror = () => { enVuelo--; bajar(); };
      im.src = url(n);
    }
  };
  const pedir = (n, antes) => { let e = mem.get(n); if (!e) { e = { ok: false, pedida: false, im: null }; mem.set(n, e); } if (!e.pedida) { const i = cola.indexOf(n); if (i >= 0) cola.splice(i, 1); antes ? cola.unshift(n) : cola.push(n); } return e; };
  const tramo = (i, antes) => { const n = TR.get(i); if (!n || ligera) return; const ns = []; for (let k = 1; k < n; k++) ns.push(cuadro(i, k)); (antes ? ns.reverse() : ns).forEach((x) => pedir(x, antes)); bajar(); };
  const lista = (n) => { const e = mem.get(n); return e && e.ok ? e.im : null; };

  function medir() {
    const r = lienzo.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2, (movil ? 1200 : 2000) / W);
    lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
    if (movil) { const l = Math.max(W, H); caja = { x: (W - l) / 2, y: (H - l) * 0.42, w: l, h: l }; }   // cuadrada, llenando el panel
    else { const h = Math.min(W / LADO, H), w = h * LADO; caja = { x: W - w, y: H - h, w, h }; }   // entera, sin recortar la escena, apoyada abajo y a la derecha
    sucio = true;
  }
  function pintar() {
    sucio = false;
    const i = tope(Math.floor(c), -1, 7), f = c - i, n = ligera ? 0 : TR.get(i) || 0;
    let A, B, a;
    if (n) { const pos = f * n, k = Math.min(n - 1, Math.floor(pos)); A = cuadro(i, k); B = cuadro(i, k + 1); a = suave(0.12, 0.88, pos - k); }
    else { A = fija(i); B = fija(i + 1); a = suave(0.15, 0.85, f); }
    pedir(A, true); pedir(B, true); bajar();
    let ia = lista(A), ib = lista(B);
    if (!ia && !ib) { ia = lista(fija(Math.round(c))) || lista(fija(i)) || lista(fija(i + 1)); if (!ia) return false; a = 0; }
    else if (!ia) { ia = ib; a = 0; } else if (!ib || A === B) a = 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = FONDO; ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(ia, caja.x, caja.y, caja.w, caja.h);
    if (a > 0.004) { ctx.globalAlpha = a; ctx.drawImage(ib, caja.x, caja.y, caja.w, caja.h); ctx.globalAlpha = 1; }
    // donde la fotografía no llega al borde de la pantalla, el plató continúa: la pared hacia arriba (con su mismo gris) y hacia la izquierda
    if (caja.x > 1) { ctx.drawImage(ia, 0, 0, 2, ia.naturalHeight, 0, caja.y, caja.x + 1, caja.h); if (a > 0.004) { ctx.globalAlpha = a; ctx.drawImage(ib, 0, 0, 2, ib.naturalHeight, 0, caja.y, caja.x + 1, caja.h); ctx.globalAlpha = 1; } }
    if (caja.y > 1) {
      const ta = (mem.get(A) || {}).techo || mem.get(fija(Math.round(c)))?.techo || [209, 209, 209], tb = (a > 0.004 && (mem.get(B) || {}).techo) || ta, t = ta.map((v, k) => Math.round(v + (tb[k] - v) * a)), m = caja.h * 0.12;
      const g = ctx.createLinearGradient(0, caja.y, 0, caja.y + m); g.addColorStop(0, `rgb(${t})`); g.addColorStop(1, `rgba(${t}, 0)`);
      ctx.fillStyle = `rgb(${t})`; ctx.fillRect(0, 0, W, caja.y + 1); ctx.fillStyle = g; ctx.fillRect(0, caja.y, W, m);
    }
    if (alPintar) alPintar();
    return true;
  }
  return {
    movil, get caja() { return caja; }, get c() { return c; },
    medir, pintar: () => (sucio ? pintar() : true),
    ir(v) { v = tope(v, -1, 8); if (v !== c) { c = v; sucio = true; } },
    // se piden primero las fotografías de cada acto y después los viajes, empezando por los que rodean al acto en que se está
    cargar(desde) {
      const orden = [0, 1, 2, 3, 4, 5, 6, 8].sort((a, b) => Math.abs(a - desde) - Math.abs(b - desde)); orden.forEach((i) => pedir(fija(i)));
      [...TR.keys()].filter((i) => i >= 0).sort((a, b) => Math.abs(a + 0.5 - desde) - Math.abs(b + 0.5 - desde)).forEach((i) => tramo(i));
      bajar();
    },
    entrada() { if (ligera || !TR.get(-1)) return Promise.resolve(false); const ns = []; for (let k = 1; k < TR.get(-1); k++) ns.push(cuadro(-1, k)); ns.push(fija(0)); ns.forEach((x) => pedir(x, true)); bajar(); return new Promise((si) => { const mira = () => { if (ns.every(lista)) { alCargar = null; si(true); } }; alCargar = mira; mira(); }); },
    primera(i) { pedir(fija(i), true); bajar(); return new Promise((si) => { const mira = () => { if (lista(fija(i))) { alCargar = null; si(true); } }; alCargar = mira; mira(); }); },
    cerca(i) { tramo(i, true); },
    alPintar(f) { alPintar = f; },
    // el fotograma entero más cercano: al dejar de mover el scroll la imagen se queda en una fotografía nítida, nunca a medio fundido entre dos
    rejilla(v) { const i = tope(Math.floor(v), -1, 7), n = ligera ? 1 : TR.get(i) || 1; return i + Math.round((v - i) * n) / n; },
    lista: (n) => !!lista(n), fija,
    // dónde cae en la pantalla un punto de la fotografía (0…1)
    punto: (u, v) => [caja.x + u * caja.w, caja.y + v * caja.h],
  };
}

if (raiz) {
  const actos = $$("[data-acto]", raiz);
  const lienzo = $("[data-maq-lienzo]", raiz), plano = $("[data-esc-plano]", raiz), panel = $(".maq-escena", raiz);
  const velo = $(".maq-velo", raiz);
  const movil = matchMedia("(max-width: 860px), (max-aspect-ratio: 21/20)").matches;
  const ahorro = navigator.connection && navigator.connection.saveData;
  const captura = q.has("captura");
  let escena = null, cap = 0, visto = 0;
  raiz.classList.toggle("es-movil", movil);

  /* ---------------------------------------------- del scroll al capítulo */
  // Dentro de un acto la escena se queda donde está (mientras se lee); la cámara viaja al pasar de un acto a otro.
  function leerCapitulo() {
    const mitad = innerHeight * (movil ? 0.72 : 0.5), ancho = innerHeight * 0.9;
    let c = +actos[0].dataset.acto;
    for (let i = 0; i < actos.length - 1; i++) {
      const frontera = actos[i + 1].getBoundingClientRect().top, a = +actos[i].dataset.acto, b = +actos[i + 1].dataset.acto;
      if (mitad >= frontera - ancho * 0.5) c = a + (b - a) * tope((mitad - (frontera - ancho * 0.5)) / ancho, 0, 1);
    }
    return c;
  }
  const indice = $$("[data-indice]", raiz);
  let actual = -1;
  function alScroll() {
    cap = leerCapitulo();
    const n = Math.round(cap);
    if (n !== actual) { actual = n; indice.forEach((a) => a.setAttribute("aria-current", String(+a.dataset.indice === n))); if (escena) { escena.cerca(Math.min(7, n)); escena.cerca(Math.max(0, n - 1)); } }
    const demos = cap > 6.55 && cap < 7.6;
    if (velo) velo.style.setProperty("--velo", demos ? "0.82" : "0");
    raiz.classList.toggle("is-demos", demos);
    raiz.classList.toggle("is-fuera", raiz.getBoundingClientRect().bottom < innerHeight * 0.6);
  }
  addEventListener("scroll", alScroll, { passive: true });
  addEventListener("resize", alScroll);

  // el texto de cada acto entra cuando llega
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visto"); }), { threshold: movil ? 0.12 : 0.28 });
    actos.forEach((a) => io.observe(a));
  } else actos.forEach((a) => a.classList.add("is-visto"));

  /* ------------------------------------------------------------ las áreas */
  const areas = $("[data-areas]", raiz), rotulos = $$("[data-modulo-i]", raiz), foco = $("[data-esc-foco]", raiz);
  const COSA = { personas: "movil", procesos: "tableta", herramientas: "portatil", datos: "factura" };
  let areaElegida = "", elegirArea = () => {};
  if (areas) {
    const pest = $$("[data-area]", areas);
    elegirArea = (i, foco_) => {
      pest.forEach((b, k) => { const si = k === i; b.setAttribute("aria-selected", String(si)); b.tabIndex = si ? 0 : -1; $("#area-" + k, areas).hidden = !si; if (si && foco_) b.focus(); });
      areaElegida = pest[i].dataset.modulo || "";
      rotulos.forEach((li) => li.classList.toggle("is-elegido", li.dataset.moduloI === areaElegida));
      colocar();
    };
    pest.forEach((b, i) => {
      b.addEventListener("click", () => elegirArea(i));
      b.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { e.preventDefault(); elegirArea((i + d + pest.length) % pest.length, true); } });
    });
    // los nombres colgados de cada cosa también se pueden pulsar
    $$("[data-modulo-b]", raiz).forEach((b) => b.addEventListener("click", () => { const i = +b.dataset.moduloB; elegirArea(areaElegida === pest[i].dataset.modulo ? 0 : i); }));
  }

  /* --------------------------------------------------- Finance: la factura */
  const fz = $("[data-fz]", raiz), sobreP = $('[data-sobre="pantalla"]', raiz);
  if (fz) {
    const ORDEN = ["prov", "num", "fecha", "base", "iva", "total", "vence"];
    const pasar = $("[data-fz-pasar]", fz), otra = $("[data-fz-otra]", fz), hecho = $("[data-fz-hecho]", fz), accion = $("[data-fz-accion]", fz), vacio = $("[data-fz-vacio]", fz), preguntas = $("[data-fz-preguntas]", fz), respuesta = $("[data-fz-respuesta]", fz), entrada = $("[data-fz-base]", fz);
    const filas = Object.fromEntries($$("[data-fz-campo]", fz).map((d) => [d.dataset.fzCampo, d]));
    const enPantalla = Object.fromEntries($$("[data-esc-campo]", raiz).map((d) => [d.dataset.escCampo, d]));
    const dinero = (n) => { const s = n.toLocaleString(EN ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }); return EN ? "€" + s : s.replace(/^(\d)(\d{3},)/, "$1.$2") + " €"; };
    const leerCifra = (t) => { let s = String(t).replace(/[^\d.,]/g, ""); if (!s) return NaN; const dec = EN ? "." : ",", mil = EN ? "," : "."; if (s.includes(dec)) s = s.split(mil).join("").replace(dec, "."); else { const i = s.lastIndexOf(mil); s = i >= 0 && s.length - i - 1 !== 3 ? s.replace(mil, ".") : s.split(mil).join(""); } return parseFloat(s); };
    let datos = { base: 1240, iva: 260.4, total: 1500.4 }, enMarcha = 0;
    const poner = (base) => {
      base = Math.min(99999.99, Math.max(1, Math.round(base * 100) / 100)); const iva = Math.round(base * 21) / 100, total = Math.round((base + iva) * 100) / 100;
      datos = { base, iva, total };
      const t = { base: dinero(base), iva: dinero(iva), total: dinero(total) };
      for (const k of ["base", "iva", "total"]) { $("dd span", filas[k]).textContent = t[k]; if (enPantalla[k]) $("dd", enPantalla[k]).textContent = t[k]; }
      $$("[data-fz-q]", fz).forEach((b) => { b.dataset.fzR = b.dataset.fzPlantilla.replace(/\{(\w+)\}/g, (_, k) => t[k]); });
      return t;
    };
    const llenar = (k) => { filas[k].classList.add("is-lleno"); if (enPantalla[k]) enPantalla[k].classList.add("is-lleno"); };
    const terminar = () => { fz.classList.remove("is-leyendo"); fz.classList.add("is-leida"); if (sobreP) { sobreP.classList.remove("is-leyendo"); sobreP.classList.add("is-leida"); } vacio.hidden = true; hecho.hidden = false; accion.hidden = false; preguntas.hidden = false; otra.hidden = false; pasar.hidden = true; };
    const leer = () => {
      const v = leerCifra(entrada.value); poner(isFinite(v) ? v : datos.base); entrada.value = dinero(datos.base).replace(/\s?€|€/g, "");
      const turno = ++enMarcha, t0 = performance.now(), dur = REDUCIDO ? 500 : 2300, lanzados = new Set();
      fz.classList.add("is-leyendo"); if (sobreP) sobreP.classList.add("is-leyendo"); pasar.disabled = true; entrada.disabled = true;
      const paso = (ahora) => {
        if (turno !== enMarcha) return;
        const t = Math.min(1, (ahora - t0) / dur);
        if (sobreP) sobreP.style.setProperty("--lee", t.toFixed(3));
        ORDEN.forEach((k, i) => { if (!lanzados.has(k) && t >= 0.1 + (i / ORDEN.length) * 0.84) { lanzados.add(k); llenar(k); } });
        if (t < 1) requestAnimationFrame(paso); else setTimeout(() => { if (turno === enMarcha) { pasar.disabled = false; terminar(); } }, 320);
      };
      requestAnimationFrame(paso);
    };
    pasar.addEventListener("click", leer);
    entrada.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); leer(); } });
    entrada.addEventListener("change", () => { const v = leerCifra(entrada.value); if (isFinite(v)) { poner(v); entrada.value = dinero(datos.base).replace(/\s?€|€/g, ""); } });
    otra.addEventListener("click", () => {
      enMarcha++; fz.classList.remove("is-leida", "is-leyendo"); if (sobreP) sobreP.classList.remove("is-leida", "is-leyendo");
      [...Object.values(filas), ...Object.values(enPantalla)].forEach((f) => f.classList.remove("is-lleno"));
      vacio.hidden = false; hecho.hidden = true; accion.hidden = true; preguntas.hidden = true; otra.hidden = true; pasar.hidden = false; pasar.disabled = false; entrada.disabled = false; respuesta.textContent = ""; $$("[data-fz-q]", fz).forEach((b) => b.setAttribute("aria-pressed", "false"));
      entrada.focus(); entrada.select();
    });
    $$("[data-fz-q]", fz).forEach((b) => b.addEventListener("click", () => { $$("[data-fz-q]", fz).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); respuesta.textContent = b.dataset.fzR; }));
  }

  /* ------------------------------------------ el tuyo: el nombre en la placa */
  const tuyo = $("[data-tuyo]", raiz), sobreC = $('[data-sobre="chapa"]', raiz);
  if (tuyo) {
    const nombre = $("[data-tuyo-nombre]", tuyo), piezas = $$("[data-tuyo-pieza]", tuyo), cta = $("[data-tuyo-cta]", tuyo), base = cta.getAttribute("href"), enPlaca = $("[data-esc-nombre]", raiz);
    const destino = () => { const p = new URLSearchParams(), n = nombre.value.trim(), a = piezas.filter((c) => c.checked).map((c) => c.value); if (n) p.set("empresa", n); if (a.length) p.set("areas", a.join(", ")); const s = p.toString(); cta.setAttribute("href", s ? base + "?" + s : base); };
    const grabar = () => { if (!enPlaca) return; const t = (nombre.value.trim() || nombre.placeholder).toUpperCase(); enPlaca.textContent = t; enPlaca.style.setProperty("--n", String(Math.max(12, t.length))); };
    nombre.addEventListener("input", () => { grabar(); destino(); });
    piezas.forEach((c) => c.addEventListener("change", destino));
    grabar();
  }

  /* ----------------------------------- lo que va encima de la fotografía */
  const BASE = { pantalla: [760, 475], chapa: [1756, 100] };
  function colocar() {
    if (!escena) return;
    const c = escena.c, s = escena.movil ? "v" : "h", pt = ([u, v]) => escena.punto(u, v);
    for (const [el, clave, momento, margen] of [[sobreP, "pantalla", 5, 0.05], [sobreC, "chapa", 8, 0.05]]) {
      if (!el) continue;
      const d = DATOS.sobre[momento + s], ver = d && Math.abs(c - momento) < margen;
      el.classList.toggle("is-puesto", !!ver);
      if (ver) el.style.transform = matriz(BASE[clave][0], BASE[clave][1], d[clave].map(pt));
    }
    // los nombres de las cuatro partes, cada uno sobre la suya, y el foco sobre la elegida
    const b = 1 - suave(0.04, 0.16, Math.abs(c - 2)), cajas = DATOS.cajas[s];
    rotulos.forEach((li) => {
      const k = cajas[COSA[li.dataset.moduloI]]; if (!k) return;
      const [x, y] = escena.punto((k[0] + k[2]) / 2, k[1]);
      li.style.setProperty("--x", x.toFixed(1) + "px"); li.style.setProperty("--y", (y - 10).toFixed(1) + "px"); li.style.setProperty("--o", b.toFixed(3));
      li.classList.toggle("is-activo", b > 0.5);
    });
    if (foco) {
      const k = areaElegida && cajas[COSA[areaElegida]];
      if (k && b > 0.02) { const [x0, y0] = escena.punto(k[0], k[1]), [x1, y1] = escena.punto(k[2], k[3]), m = escena.caja.w * 0.012; foco.style.cssText = `left:${(x0 - m).toFixed(1)}px;top:${(y0 - m).toFixed(1)}px;width:${(x1 - x0 + m * 2).toFixed(1)}px;height:${(y1 - y0 + m * 2).toFixed(1)}px;opacity:${b.toFixed(3)}`; }
      else foco.style.opacity = "0";
    }
  }

  /* ------------------------------------------------------- en marcha */
  const quieta = () => raiz.classList.add("is-quieta", "is-abierta");
  if (q.has("quieta") || !lienzo || !plano) quieta();
  else {
    escena = crearEscena(lienzo, plano, { movil, ligera: REDUCIDO || ahorro || q.has("ligera") });
    if (!escena) quieta();
    else {
      window.__escena = escena;
      escena.alPintar(colocar);
      const medir = () => { if (movil) raiz.style.setProperty("--esc-alto", Math.round(Math.min(innerWidth, innerHeight * 0.5)) + "px"); escena.medir(); };
      medir(); cap = leerCapitulo(); visto = cap;
      let abierto = false, intro = null;
      const abrir = () => { if (!abierto) { abierto = true; raiz.classList.add("is-abierta"); } };
      const espera = setTimeout(abrir, 2600);
      const empezar = () => { raiz.classList.add("is-viva"); escena.cargar(cap); };
      if (cap > 0.3 || captura || REDUCIDO) { escena.ir(cap); escena.primera(Math.round(cap)).then(() => { clearTimeout(espera); abrir(); empezar(); if (captura) { escena.pintar(); window.__listo = true; } }); }
      else {
        // la entrada: cada cosa llega al cuadro desde un sitio distinto; cuando ya están, aparece el título
        escena.ir(-1);
        Promise.race([escena.entrada(), new Promise((si) => setTimeout(() => si(false), 2400))]).then((si) => {
          clearTimeout(espera);
          if (!si) { escena.ir(cap); escena.primera(0).then(empezar); abrir(); return; }
          raiz.classList.add("is-viva"); intro = { t0: performance.now() + 120, dur: 2100 };
          setTimeout(abrir, 700); setTimeout(() => escena.cargar(0), 900);
        });
      }
      // el puntero mueve muy poco el encuadre, como quien se asoma
      let px = 0, py = 0, vx = 0, vy = 0;
      if (!movil && !REDUCIDO && matchMedia("(hover: hover)").matches) addEventListener("pointermove", (e) => { px = (e.clientX / innerWidth) * 2 - 1; py = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
      let antes = performance.now();
      const cuadro = (ahora) => {
        const dt = Math.min(0.1, (ahora - antes) / 1000); antes = ahora;
        if (intro) { const t = tope((ahora - intro.t0) / intro.dur, 0, 1); escena.ir(-1 + (1 - Math.pow(1 - t, 3))); visto = escena.c; if (t >= 1) { intro = null; visto = Math.min(cap, 0); } }
        else {
          // la imagen sigue al scroll con un poco de inercia (sin ella con movimiento reducido)
          const meta = escena.rejilla(cap);
          visto = REDUCIDO || captura ? cap : Math.abs(meta - visto) < 0.0006 ? meta : visto + (meta - visto) * (1 - Math.exp(-dt * 7.5));
          escena.ir(REDUCIDO ? Math.round(visto) : visto);
        }
        if (!document.hidden) escena.pintar();
        if (Math.abs(px - vx) + Math.abs(py - vy) > 0.0015) { vx += (px - vx) * (1 - Math.exp(-dt * 5)); vy += (py - vy) * (1 - Math.exp(-dt * 5)); plano.style.transform = `translate3d(${(-vx * 9).toFixed(2)}px, ${(-vy * 6).toFixed(2)}px, 0) scale(1.014)`; }
        requestAnimationFrame(cuadro);
      };
      requestAnimationFrame(cuadro);
      let anchoPrevio = innerWidth, altoPrevio = innerHeight;
      addEventListener("resize", () => { if (innerWidth !== anchoPrevio || Math.abs(innerHeight - altoPrevio) > 130) { anchoPrevio = innerWidth; altoPrevio = innerHeight; medir(); } });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(colocar);
    }
  }
  alScroll();
}
