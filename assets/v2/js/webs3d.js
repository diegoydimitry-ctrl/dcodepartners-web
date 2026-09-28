/* ==========================================================================
   WEBS DE EJEMPLO EN 3D · el escenario (rev. 28/09/2026)
   - Escritorio: cuatro ventanas en profundidad; la elegida al frente y usable (se baja, se navega, se reserva);
     las otras, a los lados y más atrás, inertes. El puntero inclina el escenario y mueve el brillo del cristal.
   - Tableta: lo mismo con menos giro. Teléfono: sin 3D, marcos de teléfono en fila (scroll-snap).
   - Movimiento reducido: los cambios son directos (CSS), sin inclinación con el puntero.
   Todo el contenido está en el HTML; esto solo coloca, elige y da vida a los formularios de ejemplo.
   ========================================================================== */
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function montarWebs(raiz) {
  const escena = raiz.querySelector("[data-w3-escena]"), mundo = raiz.querySelector("[data-w3-mundo]");
  const ventanas = [...raiz.querySelectorAll("[data-w3-v]")], pest = [...raiz.querySelectorAll("[data-w3-t]")];
  const N = ventanas.length; let sel = 0;
  const movil = matchMedia("(max-width: 640px)"), tableta = matchMedia("(max-width: 1023px)");

  // imágenes: solo ahora (la sección ya está cerca)
  raiz.querySelectorAll("img[data-src]").forEach((im) => { im.loading = "lazy"; im.decoding = "async"; im.src = im.dataset.src; });

  function colocar() {
    if (movil.matches) { ventanas.forEach((v) => { v.inert = false; v.removeAttribute("aria-hidden"); v.classList.add("is-activa"); v.classList.remove("is-lejos"); }); return; }
    const W = escena.clientWidth, ancho = ventanas[0].offsetWidth;
    ventanas.forEach((v, i) => {
      let d = i - sel; if (d > N / 2) d -= N; if (d < -N / 2 + 0.01) d += N;   // el más cercano por cada lado
      const lejos = Math.abs(d) >= 2;
      const paso = Math.min(ancho * (tableta.matches ? 0.78 : 0.72), (W - ancho) / 2 + ancho * 0.42);
      v.style.setProperty("--x", `${d * paso}px`);
      v.style.setProperty("--z", `${-Math.abs(d) * (tableta.matches ? 260 : 420) - (lejos ? 400 : 0)}px`);
      v.style.setProperty("--ry", `${-Math.sign(d) * (tableta.matches ? 18 : 34)}deg`);
      v.style.zIndex = String(10 - Math.abs(d));
      v.classList.toggle("is-activa", d === 0); v.classList.toggle("is-lejos", lejos);
      v.inert = d !== 0; if (d === 0) v.removeAttribute("aria-hidden"); else v.setAttribute("aria-hidden", "true");
    });
  }
  function elegir(i, foco) {
    sel = (i + N) % N;
    pest.forEach((p, k) => { p.setAttribute("aria-selected", k === sel); p.tabIndex = k === sel ? 0 : -1; if (k === sel && foco) p.focus(); });
    if (movil.matches) ventanas[sel].scrollIntoView({ behavior: REDUCIDO ? "auto" : "smooth", block: "nearest", inline: "center" });
    colocar();
  }
  pest.forEach((p, i) => {
    p.addEventListener("click", () => elegir(i));
    p.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!k && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault(); elegir(e.key === "Home" ? 0 : e.key === "End" ? N - 1 : i + k, true);
    });
  });
  // una ventana de lado se trae al frente con un clic
  ventanas.forEach((v, i) => v.addEventListener("click", (e) => { if (!movil.matches && i !== sel) { e.preventDefault(); elegir(i); } }, true));
  raiz.querySelector("[data-w3-ant]")?.addEventListener("click", () => elegir(sel - 1));
  raiz.querySelector("[data-w3-sig]")?.addEventListener("click", () => elegir(sel + 1));
  // en el teléfono, la pestaña sigue a la web que está a la vista
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => { if (!movil.matches) return; for (const e of es) if (e.isIntersecting && e.intersectionRatio > 0.6) { sel = +e.target.dataset.w3V; pest.forEach((p, k) => p.setAttribute("aria-selected", k === sel)); } }, { root: mundo, threshold: [0.6] });
    ventanas.forEach((v) => io.observe(v));
  }
  // inclinación con el puntero (solo escritorio)
  if (!REDUCIDO) {
    let raf = 0, px = 0, py = 0;
    escena.addEventListener("pointermove", (e) => {
      if (tableta.matches || e.pointerType !== "mouse") return;
      const r = escena.getBoundingClientRect(); px = ((e.clientX - r.left) / r.width) * 2 - 1; py = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; raiz.style.setProperty("--px", px.toFixed(3)); raiz.style.setProperty("--py", py.toFixed(3)); });
    });
    escena.addEventListener("pointerleave", () => { raiz.style.setProperty("--px", "0"); raiz.style.setProperty("--py", "0"); });
  }
  addEventListener("resize", colocar, { passive: true });
  movil.addEventListener?.("change", colocar); tableta.addEventListener?.("change", colocar);

  // pantalla completa: la web elegida, a todo el ancho (se maqueta sola para ese ancho)
  const dlg = raiz.querySelector("[data-w3-dialogo]");
  raiz.querySelector("[data-w3-grande]")?.addEventListener("click", () => {
    const v = ventanas[sel]; const cuerpo = dlg.querySelector("[data-w3-dialogo-cuerpo]");
    cuerpo.innerHTML = v.querySelector(".w3-vista").innerHTML; dlg.querySelector("[data-w3-dialogo-url]").textContent = v.querySelector(".w3-url").textContent;
    cuerpo.querySelectorAll("[id]").forEach((x) => { x.dataset.id = x.id; x.removeAttribute("id"); });   // sin ids repetidos en la copia
    vivo(cuerpo); dlg.showModal();
  });
  dlg?.querySelector("[data-w3-cerrar]")?.addEventListener("click", () => dlg.close());
  dlg?.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  ventanas.forEach((v) => vivo(v));
  colocar();
}

/* Lo que hace cada web de ejemplo cuando se toca (formularios de muestra: no envían nada). */
function vivo(r) {
  r.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (a && a.getAttribute("href").startsWith("#")) {
      e.preventDefault();
      const ir = a.dataset.ir; const sitio = a.closest("[data-sitio-vistas]");
      if (ir && sitio) {
        const destino = sitio.querySelector(`[data-vista="${ir}"]`), ancla = sitio.querySelector(`[data-vista-ancla="${ir}"]`);
        if (destino) { sitio.querySelectorAll("[data-vista]").forEach((x) => { x.hidden = x !== destino; }); (sitio.closest(".w3-vista, .w3-dialogo-cuerpo") || sitio).scrollTo({ top: 0 }); }
        else if (ancla) { sitio.querySelectorAll("[data-vista]").forEach((x) => { x.hidden = x.dataset.vista !== "inicio"; }); ancla.scrollIntoView({ behavior: REDUCIDO ? "auto" : "smooth", block: "start" }); }
      } else if (a.getAttribute("href").length > 1) {
        const h = a.getAttribute("href").slice(1), t = r.querySelector(`[id="${h}"], [data-id="${h}"]`); t?.scrollIntoView({ behavior: REDUCIDO ? "auto" : "smooth", block: "start" });
      }
      return;
    }
    const b = e.target.closest("button"); if (!b || b.disabled) return;
    // grupos de opciones: una sola elegida
    const grupo = b.parentElement.closest(".or-ops, .vh-visita, .cs-semana");
    if (b.hasAttribute("aria-pressed") && grupo) {
      grupo.querySelectorAll("button[aria-pressed]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (grupo.classList.contains("cs-semana")) {
        const en = !!r.closest("[data-lang='en']") || document.documentElement.lang === "en";
        const dia = b.closest(".cs-dia").querySelector("b").textContent, hora = b.textContent;
        const boton = r.querySelector("[data-reservar]"), ok = r.querySelector(".cs-ok b");
        if (boton) boton.textContent = `${en ? "Book" : "Reservar"} · ${dia} · ${hora}`;
        if (ok) ok.textContent = `${en ? "Booked" : "Reservada"} · ${dia} · ${hora}`;
      }
      return;
    }
    if (b.matches("[data-confirmar], [data-pedir], [data-reservar]")) {
      const caja = b.closest("[data-reserva], [data-visita], [data-cita]"); const ok = caja?.querySelector("[data-ok]");
      if (ok) { ok.hidden = false; b.hidden = true; ok.focus?.(); }
    }
  });
}
