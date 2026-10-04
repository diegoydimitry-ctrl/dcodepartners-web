/* ==========================================================================
   D-CODE · portada «el salto» · la dirección de escena
   --------------------------------------------------------------------------
   El contenido es HTML y está en la página desde el principio. Este módulo:
     · traduce el scroll a capítulos (cada <section data-acto> es uno) y se lo
       dice al mundo 3D (/assets/v2/js/salto.js, que se pide cuando la página
       ya se ha pintado): el scroll lleva la cámara por el valle, bajo el agua,
       por la tubería y por la central;
     · dirige la entrada: primero se sale de la bruma del salto y después
       aparece el título;
     · cuelga de cada compuerta el nombre de su área;
     · atiende lo que se puede tocar: mover la cámara con el puntero o el dedo,
       mantener pulsado para ver la presa construirse, elegir un área, pasar
       una factura por Finance con la cifra que se quiera, grabar un nombre en
       el muro.
   Movimiento reducido, ahorro de datos o sin WebGL2: no se carga el mundo y
   cada capítulo enseña una fotografía fija de su escena. Todo sigue funcionando.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = $("[data-maq]");
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const TACTIL = matchMedia("(hover: none)").matches;
const q = new URLSearchParams(location.search);
const EN = document.documentElement.lang === "en";

if (raiz) {
  const actos = $$("[data-acto]", raiz);
  const lienzo = $("[data-maq-lienzo]", raiz);
  const velo = $(".maq-velo", raiz);
  let mundo = null, cap = 0;

  /* ---------------------------------------------- del scroll al capítulo */
  // Dentro de un acto la escena se queda donde está (mientras se lee); la cámara viaja al pasar de un acto a otro.
  function leerCapitulo() {
    const mitad = innerHeight * 0.5, ancho = innerHeight * 0.9;
    let c = +actos[0].dataset.acto;
    for (let i = 0; i < actos.length - 1; i++) {
      const frontera = actos[i + 1].getBoundingClientRect().top, a = +actos[i].dataset.acto, b = +actos[i + 1].dataset.acto;
      if (mitad >= frontera - ancho * 0.5) c = a + (b - a) * Math.min(1, Math.max(0, (mitad - (frontera - ancho * 0.5)) / ancho));
    }
    return c;
  }
  const indice = $$("[data-indice]", raiz);
  let actual = -1;
  function alScroll() {
    cap = leerCapitulo();
    if (mundo) mundo.capitulo(cap);
    const n = Math.round(cap);
    if (n !== actual) { actual = n; indice.forEach((a) => a.setAttribute("aria-current", String(+a.dataset.indice === n))); }
    if (velo) velo.style.setProperty("--velo", cap > 6.55 && cap < 7.6 ? "0.55" : "0");
    raiz.classList.toggle("is-fuera", raiz.getBoundingClientRect().bottom < innerHeight * 0.6);
  }
  addEventListener("scroll", alScroll, { passive: true });
  addEventListener("resize", alScroll);

  // el texto de cada acto entra cuando llega
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visto"); }), { threshold: 0.28 });
    actos.forEach((a) => io.observe(a));
  } else actos.forEach((a) => a.classList.add("is-visto"));

  /* ------------------------------------------------------------ las áreas */
  const areas = $("[data-areas]", raiz), rotulos = $$("[data-modulo-i]", raiz);
  let areaElegida = "";
  if (areas) {
    const pest = $$("[data-area]", areas);
    const elegir = (i, foco) => {
      pest.forEach((b, k) => { const si = k === i; b.setAttribute("aria-selected", String(si)); b.tabIndex = si ? 0 : -1; $("#area-" + k, areas).hidden = !si; if (si && foco) b.focus(); });
      areaElegida = pest[i].dataset.modulo || "";
      rotulos.forEach((li) => li.classList.toggle("is-elegido", li.dataset.moduloI === areaElegida));
      if (mundo) mundo.area(areaElegida || null);
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
    const terminar = () => { fz.classList.remove("is-leyendo"); fz.classList.add("is-leida"); vacio.hidden = true; hecho.hidden = false; accion.hidden = false; preguntas.hidden = false; otra.hidden = false; pasar.hidden = true; };
    // cada dato sale del contador del fondo de la sala y vuela a su casilla
    const o = {};
    const volar = (k) => {
      const fila = filas[k], dd = $("dd", fila), txt = $("span", dd).textContent;
      const p = mundo && cap > 4.6 && cap < 5.4 ? mundo.puntoContador(o) : null;
      if (!p || !p.visible || REDUCIDO) { fila.classList.add("is-lleno"); return; }
      const f = document.createElement("span"); f.className = "fz-ficha"; f.textContent = txt; document.body.appendChild(f);
      const r = dd.getBoundingClientRect(), w = f.offsetWidth, h = f.offsetHeight, x0 = p.x - w / 2, y0 = p.y - h / 2, x1 = r.right - w, y1 = r.top + (r.height - h) / 2;
      f.animate([{ transform: `translate(${x0}px, ${y0}px) scale(.8)`, opacity: 0 }, { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1, offset: 0.18 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 1, offset: 0.9 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 0 }], { duration: 760, easing: "cubic-bezier(.5, 0, .1, 1)" }).onfinish = () => { f.remove(); fila.classList.add("is-lleno"); };
    };
    const leer = () => {
      const v = leerCifra(entrada.value); poner(isFinite(v) ? v : datos.base); entrada.value = dinero(datos.base).replace(/\s?€|€/g, "");
      const turno = ++enMarcha, t0 = performance.now(), dur = REDUCIDO || !mundo ? 900 : 2600, lanzados = new Set();
      fz.classList.add("is-leyendo"); pasar.disabled = true; entrada.disabled = true;
      const paso = (ahora) => {
        if (turno !== enMarcha) return;
        const t = Math.min(1, (ahora - t0) / dur), l = t * t * (3 - 2 * t);
        if (mundo) mundo.lectura(l);
        ORDEN.forEach((k, i) => { if (!lanzados.has(k) && l >= 0.38 + (i / ORDEN.length) * 0.56) { lanzados.add(k); volar(k); if (k === "total" && mundo) mundo.registro(Math.round(datos.total * 100)); } });
        if (t < 1) requestAnimationFrame(paso); else setTimeout(() => { if (turno === enMarcha) { pasar.disabled = false; terminar(); } }, 820);
      };
      requestAnimationFrame(paso);
    };
    pasar.addEventListener("click", leer);
    entrada.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); leer(); } });
    entrada.addEventListener("change", () => { const v = leerCifra(entrada.value); if (isFinite(v)) { poner(v); entrada.value = dinero(datos.base).replace(/\s?€|€/g, ""); } });
    otra.addEventListener("click", () => {
      enMarcha++; fz.classList.remove("is-leida", "is-leyendo"); Object.values(filas).forEach((f) => f.classList.remove("is-lleno"));
      vacio.hidden = false; hecho.hidden = true; accion.hidden = true; preguntas.hidden = true; otra.hidden = true; pasar.hidden = false; pasar.disabled = false; entrada.disabled = false; respuesta.textContent = ""; $$("[data-fz-q]", fz).forEach((b) => b.setAttribute("aria-pressed", "false"));
      if (mundo) { mundo.lectura(0); mundo.registro(0); } entrada.focus(); entrada.select();
    });
    $$("[data-fz-q]", fz).forEach((b) => b.addEventListener("click", () => { $$("[data-fz-q]", fz).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); respuesta.textContent = b.dataset.fzR; }));
    fz.poner = poner; fz.datos = () => datos;
  }

  /* ------------------------------------------- el tuyo: el nombre en el muro */
  const tuyo = $("[data-tuyo]", raiz);
  let grabar = () => {};
  if (tuyo) {
    const nombre = $("[data-tuyo-nombre]", tuyo), piezas = $$("[data-tuyo-pieza]", tuyo), cta = $("[data-tuyo-cta]", tuyo), base = cta.getAttribute("href");
    const destino = () => { const p = new URLSearchParams(), n = nombre.value.trim(), a = piezas.filter((c) => c.checked).map((c) => c.value); if (n) p.set("empresa", n); if (a.length) p.set("areas", a.join(", ")); const s = p.toString(); cta.setAttribute("href", s ? base + "?" + s : base); };
    grabar = () => { if (mundo) mundo.grabar({ rotulo: raiz.dataset.grabado || "", nombre: (nombre.value.trim() || nombre.placeholder).toUpperCase() }); };
    nombre.addEventListener("input", () => { grabar(); destino(); });
    piezas.forEach((c) => c.addEventListener("change", destino));
  }

  /* --------------------------------------------------------- el mundo 3D */
  const ahorro = navigator.connection && navigator.connection.saveData;
  const quieta = () => { raiz.classList.add("is-quieta", "is-abierta"); };
  const sinMundo = REDUCIDO || ahorro || q.has("quieta");
  if (sinMundo) quieta();
  else {
    // si la escena tarda, el título no espera
    const espera = setTimeout(() => raiz.classList.add("is-abierta"), 2800);
    const cargar = () => import("/assets/v2/js/salto.js?v=ccdfa4f111").then(({ crearSalto, hayWebGL2 }) => {
      if (!hayWebGL2()) { clearTimeout(espera); return quieta(); }
      const movil = matchMedia("(max-width: 860px), (max-aspect-ratio: 1/1)").matches;
      const justo = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
      const captura = q.has("captura"), alta = q.has("reel");
      mundo = crearSalto(lienzo, { movil, idioma: EN ? "en" : "es", dpr: +q.get("dpr") || undefined, pixeles: +q.get("pixeles") || (alta ? 9e6 : movil ? (justo ? 0.9e6 : 1.4e6) : justo ? 2.0e6 : 3.2e6), muestras: alta ? 4 : movil || justo ? 0 : 4 });
      if (!mundo) { clearTimeout(espera); return quieta(); }
      window.__salto = mundo;
      // si el navegador se queda sin contexto gráfico (pasa en teléfonos con poca memoria), la portada pasa a las fotos fijas en vez de quedarse en negro
      lienzo.addEventListener("webglcontextlost", (e) => { e.preventDefault(); try { mundo.parar(); } catch (err) {} quieta(); }, { once: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { mundo.redibujar(); grabar(); });
      cap = leerCapitulo(); mundo.capitulo(cap, true); grabar();
      const anclar = !movil && innerWidth >= 1100;
      raiz.classList.toggle("is-anclada", anclar);

      // la entrada: se empieza dentro de la bruma del salto; la cámara sale hacia atrás y entonces aparece el título
      const abrir = () => { clearTimeout(espera); raiz.classList.add("is-abierta"); };
      if (cap > 0.3 || captura) { mundo.intro(1); abrir(); }
      else {
        mundo.intro(0);
        const t0 = performance.now() + 300, dur = 4200; let abierto = false;
        const paso = (ahora) => { const t = Math.min(1, Math.max(0, (ahora - t0) / dur)); mundo.intro(t); if (!abierto && t > 0.36) { abierto = true; abrir(); } if (t < 1) requestAnimationFrame(paso); };
        requestAnimationFrame(paso);
      }

      // el nombre de cada área, colgado de su compuerta
      const o = {};
      mundo.alCuadro(() => {
        if (!anclar) return;
        const b = Math.max(0, 1 - Math.abs(mundo.est.cap - 2) * 2.6);
        rotulos.forEach((li) => {
          if (b <= 0.001) { if (li.style.getPropertyValue("--o") !== "0") li.style.setProperty("--o", "0"); return; }
          mundo.modulo(li.dataset.moduloI, o);
          li.style.setProperty("--x", o.x.toFixed(1) + "px"); li.style.setProperty("--y", (o.y - 8).toFixed(1) + "px"); li.style.setProperty("--o", (o.visible ? b * b * (areaElegida && areaElegida !== li.dataset.moduloI ? 0.35 : 1) : 0).toFixed(3));
        });
      });

      // el puntero mueve la cámara; arrastrar la gira; mantener pulsado construye la presa
      const pulso = $("[data-maq-pulso]", raiz);
      const sostener = (si) => { mundo.sostener(si); raiz.classList.toggle("is-sosteniendo", si); };
      if (pulso) mundo.alCuadro(() => { if (raiz.classList.contains("is-sosteniendo")) pulso.style.setProperty("--avance", mundo.est.mano.toFixed(3)); });
      if (!TACTIL) {
        let abajo = false, movido = 0, x0 = 0, y0 = 0, tiempo = 0;
        addEventListener("pointermove", (e) => {
          mundo.puntero((e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2);
          if (pulso) { pulso.style.setProperty("--px", e.clientX + "px"); pulso.style.setProperty("--py", e.clientY + "px"); }
          if (abajo) { movido += Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0); mundo.arrastrar(e.clientX - x0); x0 = e.clientX; y0 = e.clientY; if (movido > 14) { clearTimeout(tiempo); sostener(false); } }
        }, { passive: true });
        raiz.addEventListener("pointerdown", (e) => {
          if (e.button !== 0 || e.target.closest("a, button, input, label, summary, dialog, .tocalo")) return;
          abajo = true; movido = 0; x0 = e.clientX; y0 = e.clientY; raiz.classList.add("is-arrastrando");
          if (cap < 1.5) tiempo = setTimeout(() => { if (abajo && movido <= 14) sostener(true); }, 160);
        });
        for (const ev of ["pointerup", "pointercancel", "blur"]) addEventListener(ev, () => { abajo = false; clearTimeout(tiempo); sostener(false); raiz.classList.remove("is-arrastrando"); });
      } else {
        // con el dedo: deslizar en vertical es el scroll; en horizontal, girar la cámara
        let x0 = 0, y0 = 0, eje = "";
        raiz.addEventListener("touchstart", (e) => { const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; eje = ""; }, { passive: true });
        raiz.addEventListener("touchmove", (e) => { const t = e.touches[0], dx = t.clientX - x0, dy = t.clientY - y0; if (!eje && Math.abs(dx) + Math.abs(dy) > 8) eje = Math.abs(dx) > Math.abs(dy) * 1.3 ? "x" : "y"; if (eje === "x") mundo.arrastrar(dx * 1.8); x0 = t.clientX; y0 = t.clientY; }, { passive: true });
        // inclinar el teléfono mueve la cámara (donde el navegador lo da sin pedir permiso; en iOS habría que pedirlo, y no se pide)
        if ("DeviceOrientationEvent" in window && typeof DeviceOrientationEvent.requestPermission !== "function" && !REDUCIDO) {
          let b0 = null, g0 = null; const tope = (v) => Math.max(-1, Math.min(1, v));
          addEventListener("deviceorientation", (e) => {
            if (e.beta == null || e.gamma == null) return; if (b0 === null) { b0 = e.beta; g0 = e.gamma; }
            b0 += (e.beta - b0) * 0.015; g0 += (e.gamma - g0) * 0.015;   // el centro sigue despacio la postura de quien lo sujeta
            mundo.puntero(tope((e.gamma - g0) / 14), tope(-(e.beta - b0) / 14));
          }, { passive: true });
        }
        const mano = $("[data-mano]", raiz);
        if (mano) {
          mano.addEventListener("pointerdown", (e) => { e.preventDefault(); sostener(true); mano.setPointerCapture(e.pointerId); });
          for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) mano.addEventListener(ev, () => sostener(false));
          mano.addEventListener("contextmenu", (e) => e.preventDefault());
        }
      }
      if (areas) mundo.area(areaElegida || null);

      // solo se pinta mientras la escena se ve y la pestaña está delante
      const viva = () => { if (captura) return; const dentro = raiz.getBoundingClientRect().bottom > 0, si = dentro && !document.hidden; if (si && !mundo.vivo) mundo.iniciar(); else if (!si && mundo.vivo) mundo.parar(); };
      addEventListener("scroll", viva, { passive: true }); document.addEventListener("visibilitychange", viva);
      let anchoPrevio = innerWidth, altoPrevio = innerHeight;
      addEventListener("resize", () => { if (innerWidth !== anchoPrevio || Math.abs(innerHeight - altoPrevio) > 130) { anchoPrevio = innerWidth; altoPrevio = innerHeight; mundo.medir(); } });
      if (captura) { mundo.paso(0.033); mundo.paso(0.033); raiz.classList.add("is-viva"); window.__listo = true; return; }
      mundo.iniciar(); viva();
      requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add("is-viva")));

      // si el aparato no llega, se baja la calidad antes que perder fluidez
      let n = 0, suma = 0, ultimo = 0, nivel = 0;
      mundo.alCuadro(() => {
        const t = performance.now(); if (ultimo) { suma += t - ultimo; n++; } ultimo = t;
        if (n === 70) { const ms = suma / n; n = 0; suma = 0; if (ms > 30 && nivel < 3) { nivel++; mundo.calidad(nivel); } }
      });
    }).catch((e) => { console.warn("salto", e); clearTimeout(espera); quieta(); });
    (window.requestIdleCallback || ((f) => setTimeout(f, 80)))(cargar, { timeout: 500 });
  }
  alScroll();
}
