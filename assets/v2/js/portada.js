/* ==========================================================================
   D-CODE · portada «el mundo» · la dirección de escena
   --------------------------------------------------------------------------
   El contenido es HTML y está desde el primer pintado. Este módulo:
     · traduce el scroll a capítulos (cada <section data-acto> es uno) y se lo
       dice al motor 3D (/assets/v2/js/mundo.js, que se pide cuando la página
       ya se ha pintado);
     · cuelga rótulos HTML de objetos de la escena;
     · atiende lo que se puede tocar: mantener pulsado para poner orden, elegir
       un área, pasar una factura por Finance.
   Movimiento reducido, ahorro de datos o sin WebGL2: no se carga el motor y
   cada capítulo enseña una fotografía fija de su escena. Todo sigue funcionando.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const raiz = $("[data-mundo]");
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const TACTIL = matchMedia("(hover: none)").matches;
const q = new URLSearchParams(location.search);

if (raiz) {
  const actos = $$("[data-acto]", raiz);
  const lienzo = $("[data-mundo-lienzo]", raiz);
  const velo = $(".mundo-velo", raiz);
  let mundo = null, cap = 0;

  /* ---------------------------------------------- del scroll al capítulo */
  // Dentro de un acto el capítulo no cambia (la escena se queda quieta mientras lees);
  // la transición ocurre al cruzar la frontera entre dos actos.
  function leerCapitulo() {
    const mitad = innerHeight * 0.5, ancho = innerHeight * 0.85;
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
    if (velo) velo.style.setProperty("--velo", cap > 6.5 && cap < 7.6 ? "0.55" : "0");
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
  const areas = $("[data-areas]", raiz);
  if (areas) {
    const pest = $$("[data-area]", areas);
    const elegir = (i, foco) => {
      pest.forEach((b, k) => { const si = k === i; b.setAttribute("aria-selected", String(si)); b.tabIndex = si ? 0 : -1; $("#area-" + k, areas).hidden = !si; if (si && foco) b.focus(); });
      if (mundo) mundo.carril(i);
    };
    pest.forEach((b, i) => {
      b.addEventListener("click", () => elegir(i));
      b.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { e.preventDefault(); elegir((i + d + pest.length) % pest.length, true); } });
    });
    areas.elegir = elegir;
  }

  /* --------------------------------------------------- Finance: la factura */
  const fz = $("[data-fz]", raiz);
  if (fz) {
    // dónde está cada dato en la hoja (u, v) y cuándo lo alcanza la lectura
    const CAMPOS = { num: [0.742, 0.912], fecha: [0.802, 0.879], prov: [0.336, 0.79], base: [0.802, 0.324], iva: [0.82, 0.279], total: [0.76, 0.2], vence: [0.247, 0.197] };
    const pasar = $("[data-fz-pasar]", fz), otra = $("[data-fz-otra]", fz), hecho = $("[data-fz-hecho]", fz), preguntas = $("[data-fz-preguntas]", fz), respuesta = $("[data-fz-respuesta]", fz);
    const filas = Object.fromEntries($$("[data-fz-campo]", fz).map((d) => [d.dataset.fzCampo, d]));
    let enMarcha = 0;
    const terminar = () => { fz.classList.remove("is-leyendo"); fz.classList.add("is-leida"); hecho.hidden = false; preguntas.hidden = false; otra.hidden = false; pasar.hidden = true; };
    const volar = (k) => {
      const fila = filas[k], dd = $("dd", fila), txt = $("span", dd).textContent;
      const o = mundo && cap > 4.6 && cap < 5.4 ? mundo.campo(3, CAMPOS[k][0], CAMPOS[k][1]) : null;
      if (!o || !o.visible || REDUCIDO) { fila.classList.add("is-lleno"); return; }
      const f = document.createElement("span"); f.className = "fz-ficha"; f.textContent = txt; document.body.appendChild(f);
      const r = dd.getBoundingClientRect(), w = f.offsetWidth, h = f.offsetHeight, x0 = o.x - w / 2, y0 = o.y - h / 2, x1 = r.right - w, y1 = r.top + (r.height - h) / 2;
      f.animate([{ transform: `translate(${x0}px, ${y0}px) scale(1.15)`, opacity: 0 }, { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1, offset: 0.18 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 1, offset: 0.9 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 0 }], { duration: 760, easing: "cubic-bezier(.5, 0, .1, 1)" }).onfinish = () => { f.remove(); fila.classList.add("is-lleno"); };
    };
    const leer = () => {
      const turno = ++enMarcha, t0 = performance.now(), dur = REDUCIDO || !mundo ? 900 : 2300, lanzados = new Set();
      fz.classList.add("is-leyendo"); pasar.disabled = true;
      const paso = (ahora) => {
        if (turno !== enMarcha) return;
        const t = Math.min(1, (ahora - t0) / dur), l = t * t * (3 - 2 * t);
        if (mundo) mundo.lectura(l, 1);
        for (const k in CAMPOS) if (!lanzados.has(k) && l >= 1 - CAMPOS[k][1] - 0.02) { lanzados.add(k); volar(k); }
        if (t < 1) requestAnimationFrame(paso); else setTimeout(() => { if (turno === enMarcha) { pasar.disabled = false; terminar(); } }, 820);
      };
      requestAnimationFrame(paso);
    };
    pasar.addEventListener("click", leer);
    otra.addEventListener("click", () => {
      enMarcha++; fz.classList.remove("is-leida", "is-leyendo"); Object.values(filas).forEach((f) => f.classList.remove("is-lleno"));
      hecho.hidden = true; preguntas.hidden = true; otra.hidden = true; pasar.hidden = false; pasar.disabled = false; respuesta.textContent = ""; $$("[data-fz-q]", fz).forEach((b) => b.setAttribute("aria-pressed", "false"));
      if (mundo) mundo.lectura(0, 0); pasar.focus();
    });
    $$("[data-fz-q]", fz).forEach((b) => b.addEventListener("click", () => { $$("[data-fz-q]", fz).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); respuesta.textContent = b.dataset.fzR; }));
  }

  /* --------------------------------------------------------- el motor 3D */
  const ahorro = navigator.connection && navigator.connection.saveData;
  const quieta = () => { raiz.classList.add("is-quieta", "is-abierta"); };
  const sinMotor = REDUCIDO || ahorro || q.has("quieta");
  if (sinMotor) quieta();
  else {
    const cargar = () => import("/assets/v2/js/mundo.js?v=bf4cb358be").then(({ crearMundo, hayWebGL2 }) => {
      if (!hayWebGL2()) return quieta();
      const movil = matchMedia("(max-width: 860px), (max-aspect-ratio: 1/1)").matches;
      const justo = (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
      const captura = q.has("captura");
      mundo = crearMundo(lienzo, { movil, idioma: document.documentElement.lang === "en" ? "en" : "es", hojas: +q.get("hojas") || (movil ? (justo ? 650 : 900) : justo ? 1500 : 2400), reflejo: !movil && !justo, captura, dpr: +q.get("dpr") || undefined, pixeles: +q.get("pixeles") || undefined });
      if (!mundo) return quieta();
      window.__mundo = mundo;
      cap = leerCapitulo(); mundo.capitulo(cap, true);
      const anclar = !movil && innerWidth >= 1100;
      raiz.classList.toggle("is-anclada", anclar);

      // la entrada: la tormenta lo llena todo y el claro se abre alrededor del título
      const entrar = () => { raiz.classList.add("is-abierta"); };
      if (cap > 0.3 || captura) { mundo.intro(1); entrar(); }
      else {
        const t0 = performance.now() + 500, dur = 2600; let abierto = false;
        const paso = (ahora) => { const t = Math.min(1, Math.max(0, (ahora - t0) / dur)); mundo.intro(t); if (!abierto && t > 0.42) { abierto = true; entrar(); } if (t < 1) requestAnimationFrame(paso); };
        requestAnimationFrame(paso);
      }

      // rótulos colgados de la escena
      const dolores = $$("[data-dolor]", raiz), DEST = [0, 3, 1, 4], leyenda = $$("[data-leyenda-i]", raiz), o = {};
      const cerca = (n) => Math.max(0, 1 - Math.abs(mundo.est.cap - n) * 2.6);
      mundo.alCuadro(() => {
        if (!anclar) return;
        const a = cerca(1) * (1 - mundo.est.mano), b = cerca(2);
        dolores.forEach((li, k) => {
          if (a <= 0.001) { if (li.style.getPropertyValue("--o") !== "0") li.style.setProperty("--o", "0"); return; }
          mundo.hoja(DEST[k], o);
          // a la derecha de su documento; si no cabe, a la izquierda
          const medio = innerWidth > 1500 ? 96 : 80, izq = o.x + medio + 250 > innerWidth - 60;
          li.classList.toggle("is-izq", izq);
          li.style.setProperty("--x", (izq ? o.x - medio - 240 : o.x + medio).toFixed(1) + "px"); li.style.setProperty("--y", (o.y - 10 + (k - 1.5) * 14).toFixed(1) + "px"); li.style.setProperty("--o", (a * a).toFixed(3));
        });
        leyenda.forEach((li, k) => {
          if (b <= 0.001) { if (li.style.getPropertyValue("--o") !== "0") li.style.setProperty("--o", "0"); return; }
          mundo.carrilEn(4, [-6.3, -3, 6][k], o);
          li.style.setProperty("--x", o.x.toFixed(1) + "px"); li.style.setProperty("--y", (o.y + 8).toFixed(1) + "px"); li.style.setProperty("--o", (b * b).toFixed(3));
        });
      });

      // el puntero mueve el aire; mantener pulsado pone orden
      if (!TACTIL) addEventListener("pointermove", (e) => mundo.puntero((e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2, true), { passive: true });
      const hoy = $(".acto--hoy", raiz), mano = $("[data-mano]", raiz);
      const sostener = (si) => { mundo.sostener(si); raiz.classList.toggle("is-sosteniendo", si); };
      if (hoy) {
        if (TACTIL && mano) {
          mano.addEventListener("pointerdown", (e) => { e.preventDefault(); mundo.puntero(0, 0.18, true); sostener(true); mano.setPointerCapture(e.pointerId); });
          for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) mano.addEventListener(ev, () => { sostener(false); mundo.puntero(0, 0, false); });
          mano.addEventListener("contextmenu", (e) => e.preventDefault());
        } else {
          hoy.addEventListener("pointerdown", (e) => { if (e.button === 0 && !e.target.closest("a, button")) sostener(true); });
          for (const ev of ["pointerup", "pointercancel", "blur"]) addEventListener(ev, () => sostener(false));
        }
      }
      if (areas) { const sel = $('[aria-selected="true"]', areas); mundo.carril(sel ? +sel.dataset.area : -1); }

      // solo se pinta mientras la sala se ve y la pestaña está delante
      const viva = () => { const dentro = raiz.getBoundingClientRect().bottom > 0, si = dentro && !document.hidden; if (si && !mundo.vivo) mundo.iniciar(); else if (!si && mundo.vivo) mundo.parar(); };
      addEventListener("scroll", viva, { passive: true }); document.addEventListener("visibilitychange", viva);
      let anchoPrevio = innerWidth, altoPrevio = innerHeight;
      addEventListener("resize", () => { if (innerWidth !== anchoPrevio || Math.abs(innerHeight - altoPrevio) > 130) { anchoPrevio = innerWidth; altoPrevio = innerHeight; mundo.medir(); } });
      if (captura) { mundo.paso(0.033); mundo.paso(0.033); raiz.classList.add("is-viva"); window.__listo = true; return; }
      mundo.iniciar(); viva();
      requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add("is-viva")));

      // si el aparato no llega, se baja la resolución antes que perder fluidez
      let n = 0, suma = 0, ultimo = 0, nivel = 0;
      mundo.alCuadro(() => {
        const t = performance.now(); if (ultimo) { suma += t - ultimo; n++; } ultimo = t;
        if (n === 70) { const ms = suma / n; n = 0; suma = 0; if (ms > 30 && nivel < 3) { nivel++; mundo.calidad(nivel); } }
      });
    }).catch((e) => { console.warn("mundo", e); quieta(); });
    (window.requestIdleCallback || ((f) => setTimeout(f, 80)))(cargar, { timeout: 600 });
  }
  alScroll();
}
