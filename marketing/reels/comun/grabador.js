// Grabador que se inyecta en la web (navegador integrado, en el PC). Graba el lienzo WebGL REAL de la página tal
// como lo pinta la GPU, en tiempo real, y simula la mano de una persona: ratón con curvas y microtemblor, rueda a
// golpes, teclas. Todo lo que hace la «mano» queda en un registro con tiempos para dibujar después el cursor.
(() => {
  if (window.__G) return "ya estaba";
  const G = (window.__G = { log: [], t0: 0, rec: null, trozos: [], x: innerWidth / 2, y: innerHeight / 2, estado: "listo" });
  const ahora = () => performance.now() - G.t0;
  G.lienzo = () => [...document.querySelectorAll("canvas")].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  G.graba = (fps = 60, mbps = 40) => {
    const cv = G.lienzo(); if (!cv) return "sin lienzo";
    const st = cv.captureStream(fps);
    const tipo = ["video/mp4;codecs=avc1", "video/webm;codecs=vp9"].find((t) => MediaRecorder.isTypeSupported(t));
    G.trozos = []; G.log = []; G.tipo = tipo;
    G.rec = new MediaRecorder(st, { mimeType: tipo, videoBitsPerSecond: mbps * 1e6 });
    G.rec.ondataavailable = (e) => e.data.size && G.trozos.push(e.data);
    G.rec.start(500); G.t0 = performance.now(); G.estado = "grabando";
    G.log.push({ t: 0, ev: "inicio", w: cv.width, h: cv.height, cw: cv.clientWidth, ch: cv.clientHeight, vw: innerWidth, vh: innerHeight });
    return `grabando ${cv.width}×${cv.height} ${tipo}`;
  };
  G.para = () => new Promise((ok) => { G.rec.onstop = () => { G.estado = "parado"; ok(G.trozos.reduce((s, b) => s + b.size, 0)); }; G.rec.stop(); });
  G.baja = (nombre) => {
    const blob = new Blob(G.trozos, { type: G.tipo }); const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
    const js = new Blob([JSON.stringify({ nombre, tipo: G.tipo, log: G.log })], { type: "application/json" });
    const b = document.createElement("a"); b.href = URL.createObjectURL(js); b.download = nombre.replace(/\.\w+$/, "") + ".json"; document.body.appendChild(b); b.click(); b.remove();
    return blob.size;
  };
  const dispara = (tipo, x, y, extra = {}) => {
    const el = document.elementFromPoint(x, y) || document.body;
    const o = { bubbles: true, cancelable: true, clientX: x, clientY: y, screenX: x, screenY: y, pageX: x + scrollX, pageY: y + scrollY, view: window, ...extra };
    if (tipo.startsWith("pointer")) el.dispatchEvent(new PointerEvent(tipo, { pointerId: 1, pointerType: "mouse", isPrimary: true, ...o }));
    else el.dispatchEvent(new MouseEvent(tipo, o));
  };
  // movimiento humano: curva de Bézier con leve arco, velocidad en campana, microtemblor; 120 eventos/s
  G.mueve = (x1, y1, ms = 900, arco = 0.12) => new Promise((ok) => {
    const x0 = G.x, y0 = G.y, dx = x1 - x0, dy = y1 - y0, cx = x0 + dx / 2 - dy * arco, cy = y0 + dy / 2 + dx * arco, ini = performance.now();
    const paso = () => {
      const k = Math.min(1, (performance.now() - ini) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const bx = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * x1, by = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * y1;
      const j = (1 - k) * 0.8; G.x = bx + (Math.random() - 0.5) * j; G.y = by + (Math.random() - 0.5) * j;
      dispara("pointermove", G.x, G.y); dispara("mousemove", G.x, G.y);
      if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "m", x: G.x, y: G.y });
      k < 1 ? setTimeout(paso, 8) : ok();
    };
    paso();
  });
  G.clic = async (x, y) => {
    if (x != null) await G.mueve(x, y, 700);
    dispara("pointerdown", G.x, G.y, { button: 0, buttons: 1 }); dispara("mousedown", G.x, G.y, { button: 0, buttons: 1 });
    if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "clic", x: G.x, y: G.y });
    await new Promise((r) => setTimeout(r, 90));
    dispara("pointerup", G.x, G.y, { button: 0 }); dispara("mouseup", G.x, G.y, { button: 0 }); dispara("click", G.x, G.y, { button: 0 });
  };
  G.arrastra = async (x1, y1, ms = 1500) => {
    dispara("pointerdown", G.x, G.y, { button: 0, buttons: 1 }); dispara("mousedown", G.x, G.y, { button: 0, buttons: 1 });
    if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "baja", x: G.x, y: G.y });
    const x0 = G.x, y0 = G.y, ini = performance.now();
    await new Promise((ok) => { const paso = () => { const k = Math.min(1, (performance.now() - ini) / ms), e = 0.5 - Math.cos(Math.PI * k) / 2;
      G.x = x0 + (x1 - x0) * e; G.y = y0 + (y1 - y0) * e;
      dispara("pointermove", G.x, G.y, { buttons: 1 }); dispara("mousemove", G.x, G.y, { buttons: 1 });
      if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "m", x: G.x, y: G.y, b: 1 }); k < 1 ? setTimeout(paso, 8) : ok(); }; paso(); });
    dispara("pointerup", G.x, G.y); dispara("mouseup", G.x, G.y);
    if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "sube", x: G.x, y: G.y });
  };
  // rueda: golpes discretos como un ratón real (100 px por golpe), con su cadencia
  G.rueda = async (golpes = 1, cada = 600, dy = 100) => {
    for (let i = 0; i < golpes; i++) {
      const el = document.elementFromPoint(G.x, G.y) || document.body;
      el.dispatchEvent(new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: dy, deltaMode: 0, clientX: G.x, clientY: G.y }));
      if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "rueda", dy });
      await new Promise((r) => setTimeout(r, cada));
    }
  };
  G.tecla = async (key, ms = 400) => {
    const code = { ArrowUp: "ArrowUp", ArrowDown: "ArrowDown", ArrowLeft: "ArrowLeft", ArrowRight: "ArrowRight", " ": "Space" }[key] || ("Key" + key.toUpperCase());
    const kc = { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, " ": 32 }[key] || key.toUpperCase().charCodeAt(0);
    const o = { key, code, keyCode: kc, which: kc, bubbles: true, cancelable: true };
    for (const t of [window, document, document.body, G.lienzo()]) t?.dispatchEvent(new KeyboardEvent("keydown", o));
    if (G.estado === "grabando") G.log.push({ t: ahora(), ev: "tecla", key, ms });
    await new Promise((r) => setTimeout(r, ms));
    for (const t of [window, document, document.body, G.lienzo()]) t?.dispatchEvent(new KeyboardEvent("keyup", o));
  };
  G.espera = (ms) => new Promise((r) => setTimeout(r, ms));
  G.fps = () => new Promise((ok) => { let n = 0; const t0 = performance.now(); const f = () => { n++; performance.now() - t0 < 1000 ? requestAnimationFrame(f) : ok(n); }; requestAnimationFrame(f); setTimeout(() => ok(n), 1500); });
  return "grabador listo";
})();
