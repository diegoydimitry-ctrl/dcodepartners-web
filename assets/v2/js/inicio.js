/* ==========================================================================
   D-CODE · portada
   Las piezas: una secuencia de fotogramas renderizados con trazado de rayos
   (Blender Cycles), con fondo transparente, que avanza con el scroll.
   Por qué así y no 3D en tiempo real: el realismo es el de un render de
   producto y es IGUAL en un móvil modesto que en un ordenador; dibujar un
   fotograma en un canvas cuesta lo mismo en cualquier aparato.
   - Carga progresiva: primero 1 de cada 8 fotogramas; luego el resto.
   - Entre dos fotogramas se funde (sin saltos aunque falten intermedios).
   - El scroll se suaviza con un muelle críticamente amortiguado.
   - Movimiento reducido o sin canvas: la pieza montada, quieta.
   ========================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const EN = document.documentElement.lang === "en";
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;

const N = 72;
const sec = $("[data-piezas]");
if (sec) {
  const lienzo = $("[data-piezas-lienzo]", sec);
  const caps = $$("[data-cap]", sec);
  const ctx = lienzo.getContext && lienzo.getContext("2d", { alpha: true });
  if (REDUCIDO || !ctx || !("createImageBitmap" in window)) {
    sec.classList.add("is-quieta");
    const p = $("[data-piezas-poster]", sec); if (p) p.src = p.src.replace(/\d{3}\.webp$/, "072.webp");
  } else {
    const movil = matchMedia("(max-width: 760px)").matches || (navigator.deviceMemory || 8) <= 2;
    const RES = movil ? 700 : 1100;
    const url = (i) => `/assets/v2/img/piezas/${RES}/${String(i + 1).padStart(3, "0")}.webp`;
    const cuadros = new Array(N).fill(null);

    // Orden de carga: extremos y 1 de cada 8, después cada 4, cada 2 y el resto.
    const orden = [];
    const pon = (i) => { if (i >= 0 && i < N && !orden.includes(i)) orden.push(i); };
    // En móvil, con ahorro de datos o red lenta, 1 de cada 2 (36 fotogramas, ~1,3 MB): el fundido
    // entre vecinos basta y la mitad de datos importa más que la mitad de fotogramas.
    const red = navigator.connection || {};
    const minimo = movil || red.saveData || /(^|-)2g|3g/.test(red.effectiveType || "") ? 2 : 1;
    pon(0); pon(N - 1); for (const paso of [8, 4, 2, 1]) if (paso >= minimo) for (let i = 0; i < N; i += paso) pon(i);
    let cola = 0;
    const cargar = async () => {
      while (cola < orden.length) {
        const i = orden[cola++];
        try { const r = await fetch(url(i)); const b = await r.blob(); cuadros[i] = await createImageBitmap(b); pedir(); } catch (e) { /* sigue con el resto */ }
      }
    };

    /* Tamaño y encuadre: la pieza ocupa un cuadrado. En ancho, a la derecha
       y centrada en alto; en móvil, arriba, dejando el texto debajo. */
    let W = 0, H = 0, dpr = 1, caja = { x: 0, y: 0, s: 0 };
    const medir = () => {
      const r = lienzo.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height; lienzo.width = Math.round(W * dpr); lienzo.height = Math.round(H * dpr);
      if (W <= 760) { const s = Math.min(W * 1.08, H * 0.66); caja = { x: (W - s) / 2, y: H * 0.04, s }; }
      else { const s = Math.min(H * 1.06, W * 0.62); caja = { x: W * 0.72 - s / 2, y: (H - s) / 2, s }; }
      pedir();
    };

    /* Progreso del scroll dentro de la sección, suavizado con un muelle. */
    let objetivo = 0, actual = 0, vel = 0, ultimo = performance.now(), pendiente = false;
    const leer = () => {
      const r = sec.getBoundingClientRect();
      const total = r.height - innerHeight;
      objetivo = Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
    };
    const cap = (p) => (p < 0.1 ? 0 : p < 0.38 ? 1 : p < 0.7 ? 2 : 3);
    let capActual = 0;
    const pintarCap = (p) => {
      const c = cap(p); if (c === capActual) return; capActual = c;
      caps.forEach((el) => el.classList.toggle("is-activo", +el.dataset.cap === c));
    };
    const cercano = (i, dir) => { for (let k = 0; k < N; k++) { const j = i + dir * k; if (j >= 0 && j < N && cuadros[j]) return j; } return -1; };
    const dibujar = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const f = Math.min(1, actual / 0.94) * (N - 1);
      let a = cercano(Math.floor(f), -1), b = cercano(Math.ceil(f), 1);
      if (a < 0) a = b; if (b < 0) b = a; if (a < 0) return;
      const t = a === b ? 0 : (f - a) / (b - a);
      ctx.imageSmoothingQuality = "high";
      ctx.globalAlpha = 1; ctx.drawImage(cuadros[a], caja.x, caja.y, caja.s, caja.s);
      if (t > 0.01 && b !== a) { ctx.globalAlpha = t; ctx.drawImage(cuadros[b], caja.x, caja.y, caja.s, caja.s); ctx.globalAlpha = 1; }
      if (!sec.classList.contains("is-escena") && cuadros[a]) sec.classList.add("is-escena");
    };
    const bucle = (ahora) => {
      pendiente = false;
      const dt = Math.min(0.05, (ahora - ultimo) / 1000); ultimo = ahora;
      // muelle críticamente amortiguado: sigue al dedo sin rebotar
      const k = 90, c = 2 * Math.sqrt(k);
      vel += ((objetivo - actual) * k - vel * c) * dt; actual += vel * dt;
      if (Math.abs(objetivo - actual) < 0.0004 && Math.abs(vel) < 0.001) { actual = objetivo; vel = 0; }
      dibujar(); pintarCap(actual);
      sec.classList.toggle("is-bajado", actual > 0.02);
      if (actual !== objetivo) pedir();
    };
    function pedir() { if (!pendiente) { pendiente = true; ultimo = performance.now(); requestAnimationFrame(bucle); } }

    addEventListener("scroll", () => { leer(); pedir(); }, { passive: true });
    new ResizeObserver(medir).observe(lienzo);
    leer(); actual = objetivo; medir(); pintarCap(actual);
    cargar(); cargar(); cargar(); cargar(); // cuatro descargas a la vez
  }
}

/* ---------------------------------------------------------- visor de demos
   Las demos son aplicaciones enteras: se cargan solo al pedirlas, dentro de
   un diálogo nativo (foco atrapado, Escape cierra). */
const DEMOS = {
  finance: [EN ? "/en/sistema-financiero/app" : "/sistema-financiero/app", "D-Code Finance"],
  comercial: [(EN ? "/en" : "") + "/demos/comercial", EN ? "Sales" : "Comercial"],
  operaciones: [(EN ? "/en" : "") + "/demos/operaciones", EN ? "Operations" : "Operaciones"],
  atencion: [(EN ? "/en" : "") + "/demos/atencion", EN ? "Customer service" : "Atención al cliente"],
  os: [(EN ? "/en" : "") + "/demos/os", "D-Code OS"],
};
const visor = $("[data-visor]");
if (visor) {
  const marco = $("[data-visor-marco]", visor), titulo = $("[data-visor-t]", visor);
  let volver = null;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-demo-abrir]"); if (!b) return;
    const d = DEMOS[b.dataset.demoAbrir]; if (!d) return;
    e.preventDefault(); volver = b;
    titulo.textContent = d[1] + (EN ? " · demo, invented data" : " · demo, datos inventados");
    if (marco.getAttribute("src") !== d[0]) marco.src = d[0];
    marco.title = d[1];
    visor.showModal();
  });
  $("[data-visor-cerrar]", visor).addEventListener("click", () => visor.close());
  visor.addEventListener("click", (e) => { if (e.target === visor) visor.close(); });
  visor.addEventListener("close", () => volver && volver.focus());
}
