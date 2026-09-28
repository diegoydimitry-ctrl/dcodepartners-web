/* ==========================================================================
   WEBS DE EJEMPLO EN 3D · el escenario (rev. 2, 28/09/2026 tarde)
   - Escritorio: cuatro ventanas en profundidad; la elegida al frente y usable (se baja, se navega, se reserva);
     las otras, a los lados, más atrás e inertes. El puntero inclina el escenario.
   - Rendimiento (rev. 2): SOLO LA WEB ELEGIDA ESTÁ VIVA. Su HTML vive en un <template> y se crea al elegirla; al
     dejarla, se borra (duerme) y en su lugar queda un cartel de pocos nodos. Sin reflejo ni filtros (pintaban cada
     ventana dos veces). Las imágenes se piden al despertar la web que las usa.
   - Tableta: lo mismo con menos giro. Teléfono: sin 3D, marcos de teléfono en fila (scroll-snap); despierta la que
     queda centrada y duerme la que sale.
   - Movimiento reducido: los cambios son directos (CSS), sin inclinación con el puntero.
   ========================================================================== */
const REDUCIDO = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EN = () => document.documentElement.lang === "en";

export function montarWebs(raiz) {
  const escena = raiz.querySelector("[data-w3-escena]"), mundo = raiz.querySelector("[data-w3-mundo]");
  const ventanas = [...raiz.querySelectorAll("[data-w3-v]")], pest = [...raiz.querySelectorAll("[data-w3-t]")];
  const N = ventanas.length; let sel = 0;
  const movil = matchMedia("(max-width: 640px)"), tableta = matchMedia("(max-width: 1023px)");

  // ---- despertar / dormir: una web viva a la vez
  const dormidas = new Map();
  function despertar(v) {
    clearTimeout(dormidas.get(v)); dormidas.delete(v);
    if (v.classList.contains("is-viva")) return;
    const vista = v.querySelector(".w3-vista"), tpl = v.querySelector("template[data-w3-plantilla]");
    if (!vista.firstElementChild && tpl) vista.append(tpl.content.cloneNode(true));
    vista.querySelectorAll("img[data-src]").forEach((im) => { im.decoding = "async"; im.src = im.dataset.src; im.removeAttribute("data-src"); });
    vista.scrollTop = 0;
    v.classList.add("is-viva");
  }
  function dormir(v, ya) {
    if (!v.classList.contains("is-viva") || dormidas.has(v)) return;
    // se espera a que termine de girar hacia el lado: el cartel aparece cuando ya está atrás
    dormidas.set(v, setTimeout(() => { dormidas.delete(v); v.classList.remove("is-viva"); v.querySelector(".w3-vista").replaceChildren(); }, ya ? 0 : 950));
  }

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
      if (d === 0) despertar(v); else dormir(v);
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
  // una ventana de lado (o, en el teléfono, un cartel dormido) se trae al frente con un clic
  ventanas.forEach((v, i) => v.addEventListener("click", (e) => {
    if (!movil.matches && i !== sel) { e.preventDefault(); e.stopPropagation(); elegir(i); }
    else if (movil.matches && !v.classList.contains("is-viva")) { e.preventDefault(); e.stopPropagation(); sel = i; despertar(v); }
  }, true));
  raiz.querySelector("[data-w3-ant]")?.addEventListener("click", () => elegir(sel - 1));
  raiz.querySelector("[data-w3-sig]")?.addEventListener("click", () => elegir(sel + 1));
  // en el teléfono: despierta la web que queda centrada y duerme las que salen
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => {
      if (!movil.matches) return;
      for (const e of es) {
        if (e.isIntersecting && e.intersectionRatio > 0.6) { sel = +e.target.dataset.w3V; pest.forEach((p, k) => p.setAttribute("aria-selected", k === sel)); despertar(e.target); }
        else if (e.intersectionRatio < 0.2) dormir(e.target, true);
      }
    }, { root: mundo, threshold: [0.2, 0.6] });
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
  const cuerpo = dlg?.querySelector("[data-w3-dialogo-cuerpo]");
  raiz.querySelector("[data-w3-grande]")?.addEventListener("click", () => {
    const v = ventanas[sel]; despertar(v);
    cuerpo.innerHTML = v.querySelector(".w3-vista").innerHTML; dlg.querySelector("[data-w3-dialogo-url]").textContent = v.querySelector(".w3-url").textContent;
    cuerpo.querySelectorAll("[id]").forEach((x) => { x.dataset.id = x.id; x.removeAttribute("id"); });   // sin ids repetidos en la copia
    dlg.showModal();
  });
  dlg?.querySelector("[data-w3-cerrar]")?.addEventListener("click", () => dlg.close());
  dlg?.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg?.addEventListener("close", () => cuerpo.replaceChildren());

  ventanas.forEach((v) => vivo(v)); if (cuerpo) vivo(cuerpo);
  colocar();
  if (movil.matches) despertar(ventanas[0]);
}

/* Lo que hace cada web de ejemplo cuando se toca (formularios de muestra: no envían nada). Delegado en la ventana:
   vale para la web viva, se cree cuando se cree. */
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
    // el taller: aprobar el presupuesto y ver avanzar el coche por la pista
    const sigue = b.closest("[data-br-sigue]");
    if (sigue) {
      const titulos = sigue.dataset.titulos.split("|");
      const paso = (k) => { sigue.dataset.paso = String(k); sigue.querySelector("[data-br-titulo]").textContent = titulos[k]; };
      if (b.matches("[data-br-aprobar], [data-br-llamar]")) {
        sigue.querySelector("[data-br-presu]").hidden = true;
        const ap = sigue.querySelector("[data-br-aprobado]");
        if (b.matches("[data-br-llamar]")) ap.textContent = EN() ? "Javier will call you in 10 minutes." : "Javier te llama en 10 minutos.";
        else { paso(3); sigue.querySelector("[data-br-avanzar]").hidden = false; }
        ap.hidden = false;
      } else if (b.matches("[data-br-avanzar]")) { paso(4); b.hidden = true; }
      return;
    }
    // grupos de opciones: una sola elegida
    const grupo = b.parentElement.closest(".or-ops, .vh-visita, .cs-semana, .br-ops");
    if (b.hasAttribute("aria-pressed") && grupo) {
      grupo.querySelectorAll("button[aria-pressed]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (grupo.classList.contains("cs-semana")) {
        const dia = b.closest(".cs-dia").querySelector("b").textContent, hora = b.textContent;
        const boton = r.querySelector("[data-reservar]"), ok = r.querySelector(".cs-ok b");
        if (boton) boton.textContent = `${EN() ? "Book" : "Reservar"} · ${dia} · ${hora}`;
        if (ok) ok.textContent = `${EN() ? "Booked" : "Reservada"} · ${dia} · ${hora}`;
      }
      if (grupo.classList.contains("br-ops")) {
        const form = b.closest(".br-form"), [s, h] = [...form.querySelectorAll(".br-ops")].map((g) => g.querySelector('[aria-pressed="true"]')?.textContent || "");
        const ok = form.querySelector(".br-ok b"); if (ok) ok.textContent = `${EN() ? "Booked" : "Cita confirmada"} · ${h} · ${s}`;
      }
      return;
    }
    if (b.matches("[data-confirmar], [data-pedir], [data-reservar]")) {
      const caja = b.closest("[data-reserva], [data-visita], [data-cita]"); const ok = caja?.querySelector("[data-ok]");
      if (ok) { ok.hidden = false; b.hidden = true; ok.focus?.(); }
    }
  });
}
