/* ==========================================================================
   D-CODE · portada «el conjunto» · la dirección de escena
   --------------------------------------------------------------------------
   El contenido es HTML y está en la página desde el principio. Detrás van
   cinco escenas fotografiadas (imágenes hechas con trazado de rayos,
   scripts/v8/escenas.py) que este módulo enseña según el scroll, y cada una
   explica una cosa: las placas que se alinean, los cabos que se trenzan, la
   fila que cae sola, el líquido que toma forma y la llave que encaja.
     · cada <section data-acto> es un momento; entre uno y otro se pasan los
       fotogramas de lo que ocurre (o se funde una escena con la siguiente);
     · cada cosa de la imagen lleva su nombre escrito encima (los rótulos),
       colocado donde cae en la fotografía;
     · lo que se puede tocar: elegir uno de los cuatro cabos, pasar una
       factura por Finance (la llave entra y la cerradura gira) y escribir
       un nombre, que queda grabado en la primera placa.
   Movimiento reducido o ahorro de datos: no hay viaje, cada acto enseña su
   fotografía. Sin JavaScript, lo mismo por CSS. Todo sigue funcionando.
   ========================================================================== */
const DATOS = /*DATOS*/{"v":"5a637c8e4b","tr":[[-1,20],[1,14],[2,11],[3,14],[7,8]],"sec":16,"noche":[0,6,7,8],"tono":{"0":[43,52,66],"1":[228,228,227],"2":[228,228,228],"3":[217,216,215],"4":[249,249,249],"5":[233,232,232],"6":[38,50,69],"7":[38,50,69],"8":[41,51,67]},"foco":{"0":0.645,"1":0.7,"2":0.72,"3":0.66,"4":0.72,"5":0.58,"6":0.61,"7":0.61,"8":0.72},"anclas":{"0":{"personas":[0.4826,0.2267],"procesos":[0.6215,0.245],"datos":[0.7289,0.2592],"herramientas":[0.8145,0.2705]},"1":{"procesos":[0.4438,0.352],"herramientas":[0.8205,0.3559],"personas":[0.5853,0.2428],"datos":[0.9468,0.5207]},"2":{"procesos":[0.4618,0.2786],"herramientas":[0.6367,0.2391],"personas":[0.5534,0.1853],"datos":[0.7276,0.3178],"sistema":[0.8616,0.9428]},"3":{"entra":[0.5857,0.569],"registra":[0.6975,0.5084],"programa":[0.8331,0.3718],"avisa":[0.9873,0.3424]},"4":{"entra":[0.9175,0.4944],"sale":[0.4373,0.5831],"iman":[0.572,0.0915]},"5":{"proveedor":[0.484,0.2593],"importe":[0.5447,0.2588],"iva":[0.6047,0.2583],"vencimiento":[0.6639,0.2578]},"6":{"luz":[0.6138,0.491]},"8":{"placa":[[0.5321,0.4329],[0.9505,0.447],[0.9497,0.7225],[0.5329,0.6675]]}}}/*FIN*/;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = $("[data-maq]");
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const q = new URLSearchParams(location.search);
const EN = document.documentElement.lang === "en";
const tope = (v, a, b) => Math.min(b, Math.max(a, v));
const suave = (a, b, x) => { const t = tope((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const dos = (k) => String(k).padStart(2, "0");

/* De un rectángulo (w × h) a cuatro esquinas cualesquiera: la matriz que coloca un trozo de HTML sobre un plano de la fotografía. */
function matriz(w, h, e) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = e;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den, k = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, f = y3 - y0 + k * y3;
  return `matrix3d(${a / w},${d / w},0,${g / w},${b / h},${f / h},0,${k / h},0,0,1,0,${x0},${y0},0,1)`;
}

/* ------------------------------------------------------------ la escena */
function crearEscena(lienzo, { movil, ligera }) {
  const ctx = lienzo.getContext("2d", { alpha: false });
  if (!ctx) return null;
  const TR = new Map(DATOS.tr), SEC = DATOS.sec, LADO = 16 / 9;
  const mem = new Map(), cola = [];
  let W = 0, H = 0, dpr = 1, caja = { x: 0, y: 0, w: 1, h: 1 }, c = 0, sucio = true, enVuelo = 0, alPintar = null, alCargar = null;
  let llave = 0, abierta = false;   // la secuencia de Finance: cuánto ha entrado la llave (0…1) y si la cerradura ya ha girado
  const url = (n) => `/assets/v2/img/escena/${n}.webp?v=${DATOS.v}`;
  // la fotografía de cada acto (el 7, las demos, se queda con la del 6)
  const fija = (i) => (i === 5 && abierta ? "e-fin" : `h-${i === 7 ? 6 : tope(i, 0, 8)}`);
  // el fotograma k del tramo que empieza en el acto i (0 y n son las dos fotografías de los extremos)
  const cuadro = (i, k) => { const n = TR.get(i); if (!n || k >= n) return fija(i + 1); if (k <= 0) return i < 0 ? "t--1-01" : fija(i); return `t-${i}-${dos(k)}`; };
  const deLlave = (k) => (k <= 0 ? "h-5" : k > SEC ? "e-fin" : `e-${dos(k)}`);
  const bajar = () => {
    while (enVuelo < 4 && cola.length) {
      const n = cola.shift(), e = mem.get(n); if (e.pedida) continue;
      e.pedida = true; enVuelo++; const im = new Image(); im.decoding = "async"; e.im = im;
      im.onload = () => { e.ok = true; enVuelo--; sucio = true; if (alCargar) alCargar(n); bajar(); };
      im.onerror = () => { enVuelo--; bajar(); };
      im.src = url(n);
    }
  };
  const pedir = (n, antes) => { let e = mem.get(n); if (!e) { e = { ok: false, pedida: false, im: null }; mem.set(n, e); } if (!e.pedida) { const i = cola.indexOf(n); if (i >= 0) cola.splice(i, 1); antes ? cola.unshift(n) : cola.push(n); } return e; };
  const tramo = (i, antes) => { const n = TR.get(i); if (!n || ligera) return; const ns = []; for (let k = 1; k < n; k++) ns.push(cuadro(i, k)); (antes ? ns.reverse() : ns).forEach((x) => pedir(x, antes)); bajar(); };
  const lista = (n) => { const e = mem.get(n); return e && e.ok ? e.im : null; };
  const esperar = (ns) => { ns.forEach((x) => pedir(x, true)); bajar(); return new Promise((si) => { const mira = () => { if (ns.every(lista)) { alCargar = null; si(true); } }; alCargar = mira; mira(); }); };
  const deSecuencia = () => { const ns = ["e-fin"]; for (let k = 1; k <= SEC; k++) ns.push(deLlave(k)); return ns; };
  // en el teléfono cada fotografía se encuadra hacia donde está lo que cuenta
  const foco = (v) => { const i = tope(Math.floor(v), 0, 8), j = Math.min(8, i + 1), f = suave(0, 1, v - i); return DATOS.foco[i] + (DATOS.foco[j] - DATOS.foco[i]) * f; };

  function medir() {
    const r = lienzo.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2, (movil ? 1300 : 2000) / W);
    lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
    encuadrar(); sucio = true;
  }
  function encuadrar() {
    if (movil) { const h = Math.max(H, W), w = h * LADO; caja = { x: tope(W / 2 - foco(c) * w, W - w, 0), y: (H - h) / 2, w, h }; }   // a toda la altura del panel, recortada por los lados
    else { const h = Math.min(W / LADO, H), w = h * LADO; caja = { x: W - w, y: H - h, w, h }; }   // entera, sin recortar la escena, apoyada abajo y a la derecha
  }
  // una imagen y, donde no llega al borde de la pantalla, su fondo continuado hacia arriba y hacia la izquierda
  function poner(im, alfa) {
    ctx.globalAlpha = alfa; const iw = im.naturalWidth, ih = im.naturalHeight;
    ctx.drawImage(im, caja.x, caja.y, caja.w, caja.h);
    if (caja.x > 0.5) ctx.drawImage(im, 0, 0, 2, ih, 0, caja.y, caja.x + 1, caja.h);
    if (caja.y > 0.5) { ctx.drawImage(im, 0, 0, iw, 2, caja.x, 0, caja.w, caja.y + 1); if (caja.x > 0.5) ctx.drawImage(im, 0, 0, 2, 2, 0, 0, caja.x + 1, caja.y + 1); }
    ctx.globalAlpha = 1;
  }
  function pintar() {
    sucio = false;
    let A, B, a;
    if ((llave > 0) && !ligera && Math.abs(c - 5) < 0.02) { const pos = llave * (SEC + 1), k = Math.min(SEC, Math.floor(pos)); A = deLlave(k); B = deLlave(k + 1); a = suave(0.3, 0.7, pos - k); }   // fundido corto: la llave se mueve deprisa y a medio fundido se vería doble
    else {
      const i = tope(Math.floor(c), -1, 7), f = c - i, n = ligera ? 0 : TR.get(i) || 0;
      if (n) { const pos = f * n, k = Math.min(n - 1, Math.floor(pos)); A = cuadro(i, k); B = cuadro(i, k + 1); a = suave(0.12, 0.88, pos - k); }
      else { A = fija(i); B = fija(i + 1); a = suave(0.15, 0.85, f); }
      pedir(A, true); pedir(B, true); bajar();
    }
    let ia = lista(A), ib = lista(B);
    if (!ia && !ib) { ia = lista(fija(Math.round(c))) || lista(fija(tope(Math.floor(c), 0, 8))) || lista(fija(tope(Math.ceil(c), 0, 8))); if (!ia) return false; a = 0; }
    else if (!ia) { ia = ib; a = 0; } else if (!ib || A === B) a = 0;
    if (movil) encuadrar();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingQuality = "high";
    poner(ia, 1); if (a > 0.004) poner(ib, a);
    if (alPintar) alPintar();
    return true;
  }
  return {
    movil, ligera, get caja() { return caja; }, get c() { return c; }, get ancho() { return W; }, get alto() { return H; }, get llave() { return abierta ? 1 : llave; },
    medir, pintar: () => (sucio ? pintar() : true),
    ir(v) { v = tope(v, -1, 8); if (v !== c) { c = v; sucio = true; } },
    // se piden primero las fotografías de cada acto y después los viajes, empezando por los que rodean al acto en que se está
    cargar(desde) {
      const orden = [0, 1, 2, 3, 4, 5, 6, 8].sort((a, b) => Math.abs(a - desde) - Math.abs(b - desde)); orden.forEach((i) => pedir(fija(i)));
      [...TR.keys()].filter((i) => i >= 0).sort((a, b) => Math.abs(a + 0.5 - desde) - Math.abs(b + 0.5 - desde)).forEach((i) => tramo(i));
      if (!ligera) deSecuencia().forEach((n) => pedir(n)); else pedir("e-fin");
      bajar();
    },
    entrada() { if (ligera || !TR.get(-1)) return Promise.resolve(false); const ns = []; for (let k = 1; k < TR.get(-1); k++) ns.push(cuadro(-1, k)); ns.push(fija(0)); return esperar(ns); },
    primera(i) { return esperar([fija(i)]); },
    cerca(i) { tramo(i, true); if (i === 4 || i === 5) { (ligera ? ["e-fin"] : deSecuencia()).forEach((n) => pedir(n, true)); bajar(); } },
    alPintar(f) { alPintar = f; },
    // el fotograma entero más cercano: al dejar de mover el scroll la imagen se queda en una fotografía nítida, nunca a medio fundido entre dos
    rejilla(v) { const i = tope(Math.floor(v), -1, 7), n = ligera ? 1 : TR.get(i) || 1; return i + Math.round((v - i) * n) / n; },
    // Finance: la llave entra en la cerradura (0…1) y, al terminar, la cerradura queda girada
    secuencia() { return ligera ? esperar(["e-fin"]) : esperar(deSecuencia()); },
    girar(t) { llave = tope(t, 0, 1); sucio = true; },
    abrir(si) { abierta = !!si; if (si) llave = 0; sucio = true; },
    // dónde cae en la pantalla un punto de la fotografía (0…1)
    punto: (u, v) => [caja.x + u * caja.w, caja.y + v * caja.h],
  };
}

if (raiz) {
  const actos = $$("[data-acto]", raiz);
  const lienzo = $("[data-maq-lienzo]", raiz), plano = $("[data-esc-plano]", raiz);
  const velo = $(".maq-velo", raiz), html = document.documentElement;
  const movil = matchMedia("(max-width: 860px), (max-aspect-ratio: 21/20)").matches;
  const ahorro = navigator.connection && navigator.connection.saveData;
  const captura = q.has("captura");
  const NOCHE = new Set(DATOS.noche || []);
  let escena = null, cap = 0, visto = 0;
  raiz.classList.toggle("es-movil", movil);

  /* ---------------------------------------------- del scroll al capítulo */
  // Dentro de un acto la escena se queda donde está (mientras se lee); cambia al pasar de un acto a otro.
  function leerCapitulo() {
    const mitad = innerHeight * (movil ? 0.66 : 0.5), ancho = innerHeight * (movil ? 0.36 : 0.8);
    let c = +actos[0].dataset.acto;
    for (let i = 0; i < actos.length - 1; i++) {
      const frontera = actos[i + 1].getBoundingClientRect().top, a = +actos[i].dataset.acto, b = +actos[i + 1].dataset.acto;
      if (mitad >= frontera - ancho * 0.5) c = a + (b - a) * tope((mitad - (frontera - ancho * 0.5)) / ancho, 0, 1);
    }
    return c;
  }
  const presencia = actos.map((el) => [$(":scope > .acto-in", el), +el.dataset.acto]).filter(([el]) => el);
  const indice = $$("[data-indice]", raiz);
  let actual = -1;
  function alScroll() {
    cap = leerCapitulo();
    const n = Math.round(cap);
    if (n !== actual) {
      actual = n; indice.forEach((a) => a.setAttribute("aria-current", String(+a.dataset.indice === n)));
      html.classList.toggle("esc-noche", NOCHE.has(n));   // la cabecera y la tira de capítulos, con el texto claro sobre la escena oscura
      if (escena) { escena.cerca(Math.min(7, n)); escena.cerca(Math.max(0, n - 1)); }
    }
    // el texto de un acto se retira cuando la escena empieza a ser la del siguiente: nunca queda texto de una luz sobre la imagen de la otra
    if (!movil) for (const [el, a] of presencia) { const v = (1 - suave(0.26, 0.5, Math.abs(cap - a))).toFixed(3); if (el.__pres !== v) { el.__pres = v; el.style.opacity = v; el.style.pointerEvents = +v < 0.3 ? "none" : ""; } }
    const demos = cap > 6.55 && cap < 7.6;
    if (velo) velo.style.setProperty("--velo", demos ? "0.86" : "0");
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

  /* ------------------------------------------------- los cuatro cabos */
  const areas = $("[data-areas]", raiz);
  const rotulos = $$("[data-rot]", raiz).map((li, i) => { const [a, k] = li.dataset.rot.split(":"); return { li, a: +a, k, i: +li.style.getPropertyValue("--i") || 0, p: (DATOS.anclas[a] || {})[k], w: 0, ver: false }; }).filter((r) => r.p);
  let areaElegida = "";
  if (areas) {
    const pest = $$("[data-area]", areas);
    const elegir = (i, conFoco) => {
      pest.forEach((b, k) => { const si = k === i; b.setAttribute("aria-selected", String(si)); b.tabIndex = si ? 0 : -1; $("#area-" + k, areas).hidden = !si; if (si && conFoco) b.focus(); });
      areaElegida = pest[i].dataset.modulo || "";
      // en la fotografía, el nombre del cabo elegido se queda encendido y los otros se apagan
      rotulos.forEach((r) => { if (r.a === 2) { r.li.classList.toggle("is-elegido", !!areaElegida && r.k === areaElegida); r.li.classList.toggle("is-apagado", !!areaElegida && r.k !== areaElegida); } });
    };
    pest.forEach((b, i) => {
      b.addEventListener("click", () => elegir(i));
      b.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { e.preventDefault(); elegir((i + d + pest.length) % pest.length, true); } });
    });
  }

  /* --------------------------------------------------- Finance: la factura */
  const fz = $("[data-fz]", raiz);
  if (fz) {
    const ORDEN = ["prov", "num", "fecha", "base", "iva", "total", "vence"];
    const pasar = $("[data-fz-pasar]", fz), otra = $("[data-fz-otra]", fz), hecho = $("[data-fz-hecho]", fz), accion = $("[data-fz-accion]", fz), vacio = $("[data-fz-vacio]", fz), preguntas = $("[data-fz-preguntas]", fz), respuesta = $("[data-fz-respuesta]", fz), entrada = $("[data-fz-base]", fz);
    const filas = Object.fromEntries($$("[data-fz-campo]", fz).map((d) => [d.dataset.fzCampo, d]));
    const dinero = (n) => { const s = n.toLocaleString(EN ? "en-GB" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }); return EN ? "€" + s : s.replace(/^(\d)(\d{3},)/, "$1.$2") + " €"; };
    const leerCifra = (t) => { let s = String(t).replace(/[^\d.,]/g, ""); if (!s) return NaN; const dec = EN ? "." : ",", mil = EN ? "," : "."; if (s.includes(dec)) s = s.split(mil).join("").replace(dec, "."); else { const i = s.lastIndexOf(mil); s = i >= 0 && s.length - i - 1 !== 3 ? s.replace(mil, ".") : s.split(mil).join(""); } return parseFloat(s); };
    let datos = { base: 1240, iva: 260.4, total: 1500.4 }, enMarcha = 0;
    const poner = (base) => {
      base = Math.min(99999.99, Math.max(1, Math.round(base * 100) / 100)); const iva = Math.round(base * 21) / 100, total = Math.round((base + iva) * 100) / 100;
      datos = { base, iva, total };
      const t = { base: dinero(base), iva: dinero(iva), total: dinero(total) };
      for (const k of ["base", "iva", "total"]) $("dd span", filas[k]).textContent = t[k];
      $$("[data-fz-q]", fz).forEach((b) => { b.dataset.fzR = b.dataset.fzPlantilla.replace(/\{(\w+)\}/g, (_, k) => t[k]); });
      return t;
    };
    const terminar = () => { fz.classList.remove("is-leyendo"); fz.classList.add("is-leida"); vacio.hidden = true; hecho.hidden = false; accion.hidden = false; preguntas.hidden = false; otra.hidden = false; pasar.hidden = true; pasar.disabled = false; };
    const leer = () => {
      const v = leerCifra(entrada.value); poner(isFinite(v) ? v : datos.base); entrada.value = dinero(datos.base).replace(/\s?€|€/g, "");
      const turno = ++enMarcha, lanzados = new Set(), conLlave = escena && !escena.ligera && !REDUCIDO, dur = conLlave ? 3200 : 500;
      fz.classList.add("is-leyendo"); pasar.disabled = true; entrada.disabled = true;
      // la llave entra a la vez que se rellena el registro; si sus fotogramas tardan, no se espera por ellos
      Promise.race([conLlave ? escena.secuencia() : Promise.resolve(false), new Promise((si) => setTimeout(() => si(false), 1600))]).then((hayLlave) => {
        if (turno !== enMarcha) return;
        const t0 = performance.now();
        const paso = (ahora) => {
          if (turno !== enMarcha) return;
          const t = Math.min(1, (ahora - t0) / dur);
          if (hayLlave) escena.girar(t < 0.72 ? 0.7 * suave(0, 1, t / 0.72) : 0.7 + 0.3 * suave(0, 1, (t - 0.72) / 0.28));   // primero entra; después gira
          ORDEN.forEach((k, i) => { if (!lanzados.has(k) && t >= 0.12 + (i / ORDEN.length) * 0.6) { lanzados.add(k); filas[k].classList.add("is-lleno"); } });
          if (t < 1) requestAnimationFrame(paso); else { if (escena) escena.abrir(true); setTimeout(() => { if (turno === enMarcha) terminar(); }, 260); }
        };
        requestAnimationFrame(paso);
      });
    };
    pasar.addEventListener("click", leer);
    entrada.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (!pasar.disabled && !pasar.hidden) leer(); } });
    entrada.addEventListener("change", () => { const v = leerCifra(entrada.value); if (isFinite(v)) { poner(v); entrada.value = dinero(datos.base).replace(/\s?€|€/g, ""); } });
    otra.addEventListener("click", () => {
      enMarcha++; fz.classList.remove("is-leida", "is-leyendo"); if (escena) escena.abrir(false);
      Object.values(filas).forEach((f) => f.classList.remove("is-lleno"));
      vacio.hidden = false; hecho.hidden = true; accion.hidden = true; preguntas.hidden = true; otra.hidden = true; pasar.hidden = false; pasar.disabled = false; entrada.disabled = false; respuesta.textContent = ""; $$("[data-fz-q]", fz).forEach((b) => b.setAttribute("aria-pressed", "false"));
      entrada.focus(); entrada.select();
    });
    $$("[data-fz-q]", fz).forEach((b) => b.addEventListener("click", () => { $$("[data-fz-q]", fz).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); respuesta.textContent = b.dataset.fzR; }));
  }

  /* -------------------------------------- el tuyo: el nombre en la placa */
  const tuyo = $("[data-tuyo]", raiz), sobre = $('[data-sobre="placa"]', raiz);
  if (tuyo) {
    const nombre = $("[data-tuyo-nombre]", tuyo), piezas = $$("[data-tuyo-pieza]", tuyo), cta = $("[data-tuyo-cta]", tuyo), base = cta.getAttribute("href"), enPlaca = $("[data-esc-nombre]", raiz);
    const destino = () => { const p = new URLSearchParams(), n = nombre.value.trim(), a = piezas.filter((c) => c.checked).map((c) => c.value); if (n) p.set("empresa", n); if (a.length) p.set("areas", a.join(", ")); const s = p.toString(); cta.setAttribute("href", s ? base + "?" + s : base); };
    const grabar = () => { if (!enPlaca) return; const t = (nombre.value.trim() || nombre.placeholder).toUpperCase(); enPlaca.textContent = t; enPlaca.style.setProperty("--n", String(Math.max(10, t.length))); };
    nombre.addEventListener("input", () => { grabar(); destino(); });
    piezas.forEach((c) => c.addEventListener("change", destino));
    grabar();
  }

  /* ----------------------------------- lo que va encima de la fotografía */
  const PLACA = [1408, 400], ORDEN_PASADOR = { proveedor: 0, importe: 1, iva: 2, vencimiento: 3 };
  function colocar() {
    if (!escena) return;
    const c = escena.c, W = escena.ancho, H = escena.alto, arriba = movil ? 34 : 112;   // en el ordenador, por encima de esto está la cabecera
    // los nombres de las cosas, cada uno donde cae la suya en la fotografía; solo se leen con la escena quieta en su acto
    for (const r of rotulos) {
      const b = 1 - suave(0.05, 0.2, Math.abs(c - r.a));
      if (b < 0.01) { if (r.ver) { r.li.style.opacity = "0"; r.ver = false; } continue; }
      if (!r.w) r.w = r.li.offsetWidth || 1;
      const [x0, y0] = escena.punto(r.p[0], r.p[1]), fuera = x0 < -6 || x0 > W + 6 || y0 > H + 6;
      const x = tope(x0, r.w / 2 + 6, W - r.w / 2 - 6), y = movil && r.a === 0 ? y0 : Math.max(y0, arriba);   // en el teléfono los nombres de las placas van por debajo de su canto
      r.li.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`; r.li.style.opacity = fuera ? "0" : b.toFixed(3); r.ver = true;
      r.li.classList.toggle("is-borde", Math.abs(x - x0) > 3 || y !== y0);
      if (r.a === 5) r.li.classList.toggle("is-ok", escena.llave >= 0.36 + 0.1 * ORDEN_PASADOR[r.k]);   // cada dato se enciende cuando su pasador encaja
    }
    // el nombre de la empresa, grabado en la primera placa con su misma perspectiva
    if (sobre) {
      const d = DATOS.anclas[8] && DATOS.anclas[8].placa, ver = d && Math.abs(c - 8) < 0.05;
      sobre.classList.toggle("is-puesto", !!ver);
      if (ver) sobre.style.transform = matriz(PLACA[0], PLACA[1], d.map(([u, v]) => escena.punto(u, v)));
    }
  }

  /* ------------------------------------------------------- en marcha */
  const quieta = () => raiz.classList.add("is-quieta", "is-abierta");
  if (q.has("quieta") || !lienzo || !plano) quieta();
  else {
    escena = crearEscena(lienzo, { movil, ligera: REDUCIDO || ahorro || q.has("ligera") });
    if (!escena) quieta();
    else {
      window.__escena = escena;
      escena.alPintar(colocar);
      const medir = () => { if (movil) raiz.style.setProperty("--esc-alto", Math.round(Math.min(innerWidth, innerHeight * 0.5)) + "px"); escena.medir(); rotulos.forEach((r) => { r.w = 0; }); };
      medir(); cap = leerCapitulo(); visto = cap;
      let abierto = false, intro = null;
      const abrir = () => { if (!abierto) { abierto = true; raiz.classList.add("is-abierta"); } };
      const espera = setTimeout(abrir, 2600);
      const empezar = () => { raiz.classList.add("is-viva"); escena.cargar(cap); };
      if (cap > 0.3 || captura || REDUCIDO) { escena.ir(cap); escena.primera(Math.round(cap)).then(() => { clearTimeout(espera); abrir(); empezar(); if (captura) { escena.pintar(); window.__listo = true; } }); }
      else {
        // la entrada: las cuatro placas llegan desalineadas y se alinean; cuando la luz pasa, aparece el título
        escena.ir(-1);
        Promise.race([escena.entrada(), new Promise((si) => setTimeout(() => si(false), 2400))]).then((si) => {
          clearTimeout(espera);
          if (!si) { escena.ir(cap); escena.primera(0).then(empezar); abrir(); return; }
          raiz.classList.add("is-viva"); intro = { t0: performance.now() + 160, dur: 2400 };
          setTimeout(abrir, 900); setTimeout(() => escena.cargar(0), 1100);
        });
      }
      // el puntero mueve muy poco el encuadre, como quien se asoma
      let px = 0, py = 0, vx = 0, vy = 0;
      if (!movil && !REDUCIDO && matchMedia("(hover: hover)").matches) addEventListener("pointermove", (e) => { px = (e.clientX / innerWidth) * 2 - 1; py = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
      let antes = performance.now();
      const cuadro = (ahora) => {
        const dt = Math.min(0.1, (ahora - antes) / 1000); antes = ahora;
        if (intro) { const t = tope((ahora - intro.t0) / intro.dur, 0, 1); escena.ir(-1 + t * t * (3 - 2 * t)); visto = escena.c; if (t >= 1) { intro = null; visto = Math.min(cap, 0); } }
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
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { rotulos.forEach((r) => { r.w = 0; }); colocar(); });
    }
  }
  alScroll();
}
