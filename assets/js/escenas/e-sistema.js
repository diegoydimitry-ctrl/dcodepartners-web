/* ESCENA · EL SISTEMA D-CODE (la única escena de la web)
   Un solo objeto, fabricado como un producto: una bandeja de aluminio
   mecanizado sobre la que vive la empresa entera.
     · Seis teclas de aluminio anodizado: las seis áreas (Comercial,
       Marketing, Clientes, Operaciones, Finanzas, Administración).
     · El núcleo: el logotipo de D-Code en metal; su píxel azul, de vidrio,
       es la IA.
     · Tres interruptores en cadena: las automatizaciones.
     · Una pantalla: el panel de dirección (y Finance, D-Code OS o la web).
     · Un puerto con dos cables que salen de la bandeja: las integraciones.
     · Pistas grabadas que unen todo; por ellas corre el dato.
   La misma pieza cuenta los nueve pasos del método al hacer scroll
   (data-paso en el hueco), y en el héroe se configura: data-foco enfoca un
   área o un módulo. En las páginas interiores, data-modo fija el foco. */
export default function (K, o) {
  const { THREE, M, G } = K;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
  const luces = K.luces(scene, { key: [-6, 11, 7], rim: [9, 5, -8], sombra: 8.5 });
  if (luces.key.castShadow) { luces.key.shadow.mapSize.set(2048, 2048); luces.key.shadow.radius = 7; }
  const raiz = new THREE.Group(); scene.add(raiz);
  const modo = o.modo || "estudio", el = o.el;
  let claro = K.claro;

  /* ---------------------------------------------------------- MATERIA */
  // Cepillado lineal: la textura del aluminio mecanizado, hecha aquí.
  const cepillado = (() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 512; const x = c.getContext("2d");
    const img = x.createImageData(512, 512), d = img.data;
    for (let j = 0; j < 512; j++) { let fila = 0; for (let i = 0; i < 512; i++) { fila = fila * 0.93 + (Math.random() - 0.5) * 0.9; const k = (j * 512 + i) * 4; d[k] = 128; d[k + 1] = 128 + fila * 40; d[k + 2] = 255; d[k + 3] = 255; } }
    x.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.anisotropy = 8; return t;
  })();
  const bandejaM = new THREE.MeshPhysicalMaterial({ metalness: 0.82, roughness: 0.4, normalMap: cepillado, normalScale: new THREE.Vector2(0.22, 0.22), clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const surcoM = new THREE.MeshPhysicalMaterial({ color: 0x0b0c0e, metalness: 0.6, roughness: 0.6 });
  // Placa interior: una segunda pieza, anodizada y más mate, encastrada.
  const placaM = new THREE.MeshPhysicalMaterial({ metalness: 0.9, roughness: 0.55, normalMap: cepillado, normalScale: new THREE.Vector2(0.08, 0.08) });
  const pintarBandeja = () => { bandejaM.color.set(claro ? 0xd6d8dc : 0x5f646d); bandejaM.roughness = claro ? 0.42 : 0.4; placaM.color.set(claro ? 0xbfc2c8 : 0x2a2d33); };
  pintarBandeja();
  const anodizado = (hex) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex).lerp(new THREE.Color(0x9aa0a8), 0.5), metalness: 1, roughness: 0.34, normalMap: cepillado, normalScale: new THREE.Vector2(0.12, 0.12), clearcoat: 0.4, clearcoatRoughness: 0.18 });

  /* ---------------------------------------------------------- BANDEJA */
  const bandeja = new THREE.Mesh(G.redondo(13.2, 0.5, 7.8, 0.22), bandejaM);
  bandeja.position.y = -0.25; bandeja.receiveShadow = true; raiz.add(bandeja);
  const interior = new THREE.Mesh(G.redondo(12.5, 0.1, 7.1, 0.05), placaM); interior.position.y = -0.045; interior.receiveShadow = true; raiz.add(interior);
  const suelo = K.sombra(17, 11, 0.9); suelo.position.y = -0.52; raiz.add(suelo);

  const grabado = (texto, x, z, w = 1.6, rot = 0) => {
    // Rótulo grabado a su medida: el texto cabe siempre, con su propio ancho.
    const c = document.createElement("canvas"), x0 = c.getContext("2d"), f = "600 40px 'JetBrains Mono', ui-monospace, monospace";
    x0.font = f; const tw = Math.ceil(x0.measureText(texto.toUpperCase()).width + texto.length * 6 + 24);
    c.width = tw; c.height = 64; const cx = c.getContext("2d"); cx.font = f; cx.fillStyle = "#fff"; cx.textBaseline = "middle"; cx.textAlign = "center";
    if ("letterSpacing" in cx) cx.letterSpacing = "6px";
    cx.fillText(texto.toUpperCase(), tw / 2, 34);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
    const alto = 0.17, m = new THREE.Mesh(new THREE.PlaneGeometry(alto * tw / 64, alto), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0.5 }));
    m.rotation.set(-Math.PI / 2, 0, rot); m.position.set(x, 0.014, z); raiz.add(m); return m;
  };
  const rotulos = [];
  const pintarRotulos = () => rotulos.forEach((r) => { r.material.color.set(claro ? 0x2a2c31 : 0xe6e9ef); r.material.opacity = claro ? 0.62 : 0.42; });

  /* ---------------------------------------------------------- ÁREAS */
  const AREAS = [
    ["comercial", "Comercial", 0x22c7e6, "sube"], ["marketing", "Marketing", 0xf06aa8, "megafono"], ["clientes", "Clientes", 0x2fd08f, "chat"],
    ["operaciones", "Operaciones", 0xf2a33a, "capas"], ["finanzas", "Finanzas", 0x5b8cff, "tarjeta"], ["administracion", "Administración", 0xa487ff, "doc"],
  ];
  function iconoArea(n) {
    const S = 256, c = document.createElement("canvas"); c.width = c.height = S; const x = c.getContext("2d");
    x.strokeStyle = "#fff"; x.lineWidth = 16; x.lineCap = x.lineJoin = "round"; x.translate(S / 2, S / 2); x.beginPath();
    if (n === "sube") { x.moveTo(-70, 45); x.lineTo(-20, -5); x.lineTo(15, 25); x.lineTo(70, -40); x.moveTo(35, -40); x.lineTo(70, -40); x.lineTo(70, -5); }
    else if (n === "megafono") { x.moveTo(-60, -20); x.lineTo(-20, -20); x.lineTo(45, -60); x.lineTo(45, 60); x.lineTo(-20, 20); x.lineTo(-60, 20); x.closePath(); x.moveTo(-40, 20); x.lineTo(-30, 60); }
    else if (n === "chat") { x.arc(0, -5, 62, 0.2, Math.PI * 2 - 0.2 + 0.2); x.moveTo(-40, 50); x.lineTo(-62, 72); x.lineTo(-20, 58); }
    else if (n === "capas") { for (const k of [-30, 0, 30]) { x.moveTo(-70, k); x.lineTo(0, k - 35); x.lineTo(70, k); x.lineTo(0, k + 35); x.closePath(); } }
    else if (n === "tarjeta") { x.rect(-75, -50, 150, 100); x.moveTo(-75, -15); x.lineTo(75, -15); x.moveTo(-50, 25); x.lineTo(-15, 25); }
    else { x.moveTo(-45, -70); x.lineTo(20, -70); x.lineTo(50, -40); x.lineTo(50, 70); x.lineTo(-45, 70); x.closePath(); x.moveTo(-20, 0); x.lineTo(25, 0); x.moveTo(-20, 30); x.lineTo(25, 30); }
    x.stroke();
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
  }
  const areas = AREAS.map(([id, nombre, col, ic], i) => {
    const g = new THREE.Group(), z = -2.9 + i * 1.16;
    g.position.set(-5.05, 0, z); raiz.add(g);
    const cuerpo = new THREE.Mesh(G.redondo(1.0, 0.46, 0.94, 0.13), anodizado(col)); cuerpo.position.y = 0.23; cuerpo.castShadow = cuerpo.receiveShadow = true;
    const grab = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0x0c0d10, alphaMap: iconoArea(ic), transparent: true, opacity: 0.55, depthWrite: false }));
    grab.rotation.x = -Math.PI / 2; grab.position.y = 0.461;
    const led = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0xffa23a, toneMapped: false })); led.scale.setScalar(0.035); led.position.set(0.36, 0.3, 0.475);
    const sh = K.sombra(1.6, 1.5, 0.7); sh.position.y = 0.002;
    g.add(cuerpo, grab, led, sh);
    const r = grabado(nombre, -5.05, z + 0.62); r.scale.setScalar(0.62); rotulos.push(r);
    return { id, nombre, col: new THREE.Color(col), g, cuerpo, led, z, fase: i * 1.7 };
  });

  /* ---------------------------------------------------------- NÚCLEO */
  const nucleo = new THREE.Group(); nucleo.position.set(0.1, 0, 0.1); raiz.add(nucleo);
  const base = new THREE.Mesh(G.redondo(3.1, 0.62, 3.1, 0.2), M.grafito); base.position.y = 0.31; base.castShadow = base.receiveShadow = true; nucleo.add(base);
  const S = 0.021, W = (x) => (x - 60) * S, H = (y) => (50 - y) * S;
  function banda(abajo) {
    const s = new THREE.Shape(), f = (y) => H(abajo ? 100 - y : y);
    s.moveTo(W(48), f(1)); s.lineTo(W(86), f(1));
    for (let i = 1; i <= 16; i++) { const a = -Math.PI / 2 + (i / 16) * (Math.PI / 2); s.lineTo(W(86 + Math.cos(a) * 32), f(33 + Math.sin(a) * 32)); }
    s.lineTo(W(118), f(38)); s.lineTo(W(102), f(38)); s.lineTo(W(102), f(33));
    for (let i = 1; i <= 16; i++) { const a = 0 - (i / 16) * (Math.PI / 2); s.lineTo(W(86 + Math.cos(a) * 16), f(33 + Math.sin(a) * 16)); }
    s.lineTo(W(48), f(17)); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 4, curveSegments: 24 });
    g.computeVertexNormals(); return g;
  }
  const logo = new THREE.Group(); logo.rotation.x = -Math.PI / 2; logo.position.set(-0.05, 0.625, 0); nucleo.add(logo);
  for (const ab of [false, true]) { const m = new THREE.Mesh(banda(ab), M.aluminio); m.castShadow = true; logo.add(m); }
  const barra = new THREE.Mesh(G.redondo(16 * S, 16 * S, 0.2, 0.02), M.aluminio); barra.position.set(W(110), H(51), 0.1); barra.castShadow = true; logo.add(barra);
  // Los píxeles del logotipo, en aluminio; el azul, de vidrio con luz dentro: la IA.
  [[26, 1, 16], [1, 27, 13], [35, 26, 13], [2, 64, 12], [35, 64, 13], [26, 83, 16]].forEach(([x, y, s]) => {
    const m = new THREE.Mesh(G.redondo(s * S, s * S, 0.2, 0.025), M.aluminio); m.position.set(W(x + s / 2), H(y + s / 2), 0.1); m.castShadow = true; logo.add(m);
  });
  const ia = new THREE.Group(); ia.position.set(W(23.5), H(52.5), 0.14); logo.add(ia);
  ia.add(new THREE.Mesh(G.redondo(15 * S, 15 * S, 0.28, 0.04), M.vidrioAzul));
  const iaLuz = new THREE.Mesh(G.esfera, M.luz(0x5b8cff, 2)); iaLuz.scale.setScalar(0.06); ia.add(iaLuz);
  const iaHalo = new THREE.PointLight(0x5b8cff, 0, 3, 2); ia.add(iaHalo);
  const nucleoSh = K.sombra(4.4, 4.4, 0.9); nucleoSh.position.y = 0.003; nucleo.add(nucleoSh);
  // Plano (paso «Diseño»): la huella del núcleo, trazada en luz antes de existir.
  const huella = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([[-1.6, -1.6], [1.6, -1.6], [1.6, 1.6], [-1.6, 1.6]].map(([a, b]) => new THREE.Vector3(a + 0.1, 0.01, b + 0.1))), new THREE.LineBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0 }));
  raiz.add(huella);
  rotulos.push(grabado("D-Code OS · un solo dato", 0.1, 2.05, 2.6));

  /* ---------------------------------------------------------- AUTOMATIZACIONES */
  const auto = new THREE.Group(); auto.position.set(3.7, 0, 1.75); raiz.add(auto);
  const placa = new THREE.Mesh(G.redondo(3.4, 0.14, 1.1, 0.06), M.grafito); placa.position.y = 0.07; placa.receiveShadow = true; auto.add(placa);
  const palancas = [-1.1, 0, 1.1].map((x) => {
    const zocalo = new THREE.Mesh(G.redondo(0.62, 0.2, 0.62, 0.08), M.acero); zocalo.position.set(x, 0.24, 0); zocalo.castShadow = true;
    const p = new THREE.Group(); p.position.set(x, 0.32, 0);
    const vara = new THREE.Mesh(G.cilindro(0.045, 0.06, 0.55, 24), M.aluminio); vara.position.y = 0.26; vara.castShadow = true;
    const pomo = new THREE.Mesh(G.esfera, M.plastico); pomo.scale.setScalar(0.1); pomo.position.y = 0.55;
    p.add(vara, pomo); p.rotation.x = 0.5;
    const luz = new THREE.Mesh(G.esfera, new THREE.MeshBasicMaterial({ color: 0x333842, toneMapped: false })); luz.scale.setScalar(0.04); luz.position.set(x + 0.22, 0.345, 0.24);
    auto.add(zocalo, p, luz);
    return { p, luz };
  });
  const autoSh = K.sombra(4.2, 1.8, 0.7); autoSh.position.y = 0.002; auto.add(autoSh);
  rotulos.push(grabado("Automatizaciones", 3.7, 2.72, 2.2));

  /* ---------------------------------------------------------- PANTALLA */
  const pantalla = new THREE.Group(); pantalla.position.set(3.9, 0, -1.75); pantalla.rotation.y = -0.32; raiz.add(pantalla);
  const pie = new THREE.Mesh(G.redondo(1.2, 0.08, 0.7, 0.04), M.aluminio); pie.position.y = 0.04; pie.castShadow = true;
  const cuello = new THREE.Mesh(G.redondo(0.16, 1.0, 0.1, 0.04), M.aluminio); cuello.position.set(0, 0.55, -0.12); cuello.castShadow = true;
  const marco = new THREE.Mesh(G.redondo(3.5, 2.2, 0.1, 0.07), M.grafito); marco.position.y = 2.0; marco.castShadow = true;
  const lienzo = document.createElement("canvas"); lienzo.width = 1024; lienzo.height = 624;
  const texPanel = new THREE.CanvasTexture(lienzo); texPanel.colorSpace = THREE.SRGBColorSpace; texPanel.anisotropy = 8;
  const vista = new THREE.Mesh(new THREE.PlaneGeometry(3.36, 2.06), new THREE.MeshBasicMaterial({ map: texPanel, toneMapped: false }));
  vista.position.set(0, 2.0, 0.052);
  const cristal = new THREE.Mesh(new THREE.PlaneGeometry(3.36, 2.06), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.08, clearcoat: 1, envMapIntensity: 1.4, depthWrite: false }));
  cristal.position.set(0, 2.0, 0.056);
  pantalla.add(pie, cuello, marco, vista, cristal);
  const pantSh = K.sombra(2.6, 1.6, 0.8); pantSh.position.y = 0.003; pantalla.add(pantSh);
  rotulos.push(grabado("Panel de dirección", 3.9, -0.62, 2.2));
  const METRICAS = ["Horas a mano", "Tiempo de respuesta", "Tareas sin dueño", "Días hasta cobrar"];
  const EN = (document.documentElement.lang || "es").startsWith("en");
  const MET_EN = ["Manual hours", "Response time", "Unowned tasks", "Days to get paid"];
  let ultimoPanel = -1;
  function pintarPanel(m) {
    const q = Math.round(m * 40); if (q === ultimoPanel) return; ultimoPanel = q;
    const x = lienzo.getContext("2d"), w = lienzo.width, h = lienzo.height;
    x.fillStyle = claro ? "#f4f5f7" : "#0e1014"; x.fillRect(0, 0, w, h);
    x.fillStyle = claro ? "#101217" : "#eceef1"; x.font = "600 40px 'Instrument Sans', Arial, sans-serif"; x.fillText(EN ? "Management panel" : "Panel de dirección", 56, 92);
    x.fillStyle = claro ? "#5d626b" : "#8a8f99"; x.font = "500 22px 'JetBrains Mono', monospace"; x.fillText(EN ? "ILLUSTRATIVE · NO CLIENT DATA" : "ILUSTRATIVO · SIN DATOS DE CLIENTES", 56, 132);
    (EN ? MET_EN : METRICAS).forEach((t, i) => {
      const y = 205 + i * 100, larg = 520 * (1 - m * (0.35 + i * 0.08));
      x.fillStyle = claro ? "#2a2d33" : "#d5d8de"; x.font = "500 28px 'Instrument Sans', Arial, sans-serif"; x.fillText(t, 56, y);
      x.fillStyle = claro ? "#e3e5ea" : "#1c1f25"; x.fillRect(440, y - 24, 520, 18);
      x.fillStyle = m > 0.02 ? "#5b8cff" : (claro ? "#b9bdc6" : "#3a3e47"); x.fillRect(440, y - 24, larg, 18);
      if (m > 0.3) { x.fillStyle = "#2fd08f"; x.font = "700 30px Arial"; x.fillText("↓", 975, y - 6); }
    });
    texPanel.needsUpdate = true;
  }
  // Capturas reales de producción para Finance, D-Code OS y la web.
  // (En producción «-light» es la captura oscura, pensada para la página clara.)
  const capturas = {};
  let capturaActual = null;
  function captura(n) {
    const u = n === "web" ? "/assets/img/webs/web-restaurante-600.webp" : `/assets/img/demos/${n}-${claro ? "dark" : "light"}-700.webp`;
    if (!capturas[u]) { capturas[u] = new THREE.TextureLoader().load(u, () => K.pedir && K.pedir()); capturas[u].colorSpace = THREE.SRGBColorSpace; capturas[u].anisotropy = 8; }
    return capturas[u];
  }
  function mostrar(n) {
    if (n === capturaActual) return; capturaActual = n;
    vista.material.map = n ? captura(n) : texPanel; vista.material.needsUpdate = true;
  }

  /* ---------------------------------------------------------- INTEGRACIONES */
  const puerto = new THREE.Group(); puerto.position.set(-2.4, 0, -3.35); raiz.add(puerto);
  const caja = new THREE.Mesh(G.redondo(1.9, 0.5, 0.7, 0.1), M.acero); caja.position.y = 0.25; caja.castShadow = true; puerto.add(caja);
  const cables = [-0.45, 0.45].map((x) => {
    const clavija = new THREE.Mesh(G.redondo(0.34, 0.3, 0.5, 0.06), M.aluminio); clavija.position.set(x, 0.28, -0.5); clavija.castShadow = true; puerto.add(clavija);
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, 0.28, -0.75), new THREE.Vector3(x * 1.3, 0.2, -1.6), new THREE.Vector3(x * 2.4, -0.4, -2.8), new THREE.Vector3(x * 4, -0.52, -4.5)]);
    const t = new THREE.Mesh(new THREE.TubeGeometry(c, 60, 0.07, 12), M.goma); t.castShadow = true; puerto.add(t);
    return c;
  });
  const puertoSh = K.sombra(2.8, 1.4, 0.7); puertoSh.position.y = 0.002; puerto.add(puertoSh);
  rotulos.push(grabado("Integraciones", -2.4, -2.62, 2));
  rotulos.push(grabado("Tu empresa", -5.05, 3.72, 1.6));
  pintarRotulos();

  /* ---------------------------------------------------------- PISTAS */
  const Y = 0.016;
  const P = (x, z) => new THREE.Vector3(x, Y, z);
  const rutas = [];
  areas.forEach((a, i) => rutas.push({ c: new THREE.CatmullRomCurve3([P(-4.5, a.z), P(-3.4, a.z), P(-2.3, a.z * 0.35 + 0.1), P(-1.45, a.z * 0.22 + 0.1)]), tipo: "area", i }));
  rutas.push({ c: new THREE.CatmullRomCurve3([P(1.65, 0.9), P(2.05, 1.5), P(2.6, 1.75)]), tipo: "auto" });
  rutas.push({ c: new THREE.CatmullRomCurve3([P(1.65, -0.6), P(2.6, -1.2), P(3.6, -1.55)]), tipo: "panel" });
  rutas.push({ c: new THREE.CatmullRomCurve3([P(-2.4, -2.95), P(-1.4, -2.2), P(-0.6, -1.45)]), tipo: "integ" });
  rutas.push({ c: new THREE.CatmullRomCurve3([P(3.9, -0.95), P(3.9, 0.2), P(3.9, 1.15)]), tipo: "panel" });
  const brillo = rutas.map((r) => {
    const surco = new THREE.Mesh(new THREE.TubeGeometry(r.c, 48, 0.05, 6), surcoM); surco.scale.y = 0.25; raiz.add(surco);
    const m = new THREE.Mesh(new THREE.TubeGeometry(r.c, 48, 0.018, 6), new THREE.MeshBasicMaterial({ color: 0x5b8cff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    m.position.y = 0.008; raiz.add(m); return m;
  });
  const pulsos = K.pulsos(rutas.map((r) => r.c), 2, 0xbcd0ff, 0.055); raiz.add(pulsos);
  const pulsosCable = K.pulsos(cables.map((c) => new THREE.CatmullRomCurve3(c.getPoints(24).reverse())), 3, 0xbcd0ff, 0.06); puerto.add(pulsosCable);

  /* ---------------------------------------------------------- ANÁLISIS */
  const escaner = new THREE.Group(); raiz.add(escaner);
  const hilo = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 7.9), M.luz(0x8fb0ff, 2.2));
  const velo = (() => {
    const c = document.createElement("canvas"); c.width = 4; c.height = 128; const x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, "rgba(143,176,255,0)"); g.addColorStop(1, "rgba(143,176,255,.55)"); x.fillStyle = g; x.fillRect(0, 0, 4, 128);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(7.9, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    m.rotation.y = Math.PI / 2; m.position.y = 0.7; return m;
  })();
  escaner.add(hilo, velo); escaner.visible = false;

  /* ---------------------------------------------------------- ESTADOS
     Cada paso del método es un estado de la misma pieza, más un plano. */
  const E0 = { caos: 0.3, conexion: 0, nucleo: 0, plano: 0, scan: 0, auto: 0, ia: 0, medicion: 0 };
  const PASOS = [
    null,
    { ...E0, caos: 0.35 },
    { ...E0, caos: 1 },
    { ...E0, caos: 0.5, scan: 1 },
    { ...E0, plano: 1, nucleo: 0.18 },
    { ...E0, nucleo: 1, conexion: 1 },
    { ...E0, nucleo: 1, conexion: 1, auto: 1 },
    { ...E0, nucleo: 1, conexion: 1, auto: 1, ia: 1 },
    { ...E0, nucleo: 1, conexion: 1, auto: 1, ia: 1, medicion: 1 },
    { ...E0, nucleo: 1, conexion: 1, auto: 1, ia: 1, medicion: 1 },
  ];
  const TODO = PASOS[9];
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const PLANOS = {
    todo: [v3(5.6, 10.6, 16.4), v3(-0.2, 0.1, 0)],
    p1: [v3(-9.6, 6.2, 10.4), v3(-4.2, 0.1, 0.1)], p2: [v3(-8.6, 4.2, 7.6), v3(-4.6, 0.3, 0.2)],
    p3: [v3(0.4, 12.5, 8.4), v3(0, 0, 0)], p4: [v3(0.3, 14.2, 4.2), v3(0, 0, 0)],
    p5: [v3(-4.6, 8.4, 12.4), v3(-1.4, 0, 0)], p6: [v3(7.2, 3.8, 7.2), v3(3.5, 0.3, 1.5)],
    p7: [v3(1.6, 3.4, 4.6), v3(0, 0.6, 0.05)], p8: [v3(6.4, 2.8, 4.6), v3(3.8, 1.5, -1.6)], p9: [v3(5.6, 10.6, 16.4), v3(-0.2, 0.1, 0)],
    ia: [v3(1.6, 3.4, 4.6), v3(0, 0.6, 0.05)], auto: [v3(7.2, 3.8, 7.2), v3(3.5, 0.3, 1.5)], panel: [v3(6.4, 2.8, 4.6), v3(3.8, 1.5, -1.6)],
    integ: [v3(-0.4, 3.8, 1.2), v3(-2.6, 0.2, -3.4)], nucleo: [v3(2.6, 5.2, 6.4), v3(0.1, 0.4, 0.1)],
  };
  areas.forEach((a) => { PLANOS["area:" + a.id] = [v3(-2.6, 2.8, a.z + 3.4), v3(-5.05, 0.3, a.z)]; });
  // Módulos del configurador y focos de las páginas interiores.
  const FOCOS = {
    finance: { plano: "panel", captura: "finance", area: "finanzas" }, os: { plano: "nucleo", captura: "os" }, ia: { plano: "ia" },
    auto: { plano: "auto" }, integ: { plano: "integ" }, web: { plano: "panel", captura: "web" }, panel: { plano: "panel" }, nucleo: { plano: "nucleo" },
    produccion: { plano: "area:operaciones", area: "operaciones" }, soporte: { plano: "area:clientes", area: "clientes" }, direccion: { plano: "panel" },
  };
  areas.forEach((a) => { FOCOS[a.id] = { plano: "area:" + a.id, area: a.id }; });

  const est = { ...E0 };
  const camPos = PLANOS.todo[0].clone(), camMira = PLANOS.todo[1].clone();
  camera.position.copy(camPos); camera.lookAt(camMira);
  let giro = 0, giroV = 0, zoom = 1, arrastre = null;

  // Interacción del héroe: arrastrar gira la bandeja; los mandos, también.
  if (modo === "estudio" && el) {
    el.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse" && e.button !== 0) return; arrastre = { x: e.clientX, y: e.clientY, g: giro, vivo: false }; });
    addEventListener("pointermove", (e) => {
      if (!arrastre) return; const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
      if (!arrastre.vivo && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) arrastre.vivo = true;
      if (arrastre.vivo) { giro = arrastre.g + dx * 0.006; K.pedir && K.pedir(); }
    }, { passive: true });
    addEventListener("pointerup", () => { arrastre = null; });
    el.addEventListener("escena:mando", (e) => { const d = e.detail; if (d === "izq") giro -= 0.5; else if (d === "der") giro += 0.5; else if (d === "mas") zoom = Math.max(0.6, zoom - 0.15); else if (d === "menos") zoom = Math.min(1.35, zoom + 0.15); else if (d === "reset") { giro = 0; zoom = 1; } });
  }

  const tmp = new THREE.Vector3(), ambar = new THREE.Color(0xffa23a), apagado = new THREE.Color(0x3a3f49);
  function update(t, dt, p, ptr) {
    // 1. ¿Qué toca enseñar?
    let objetivo = TODO, plano = "todo", foco = null;
    if (modo === "pasos") { const n = Math.max(1, Math.min(9, +(el && el.dataset.paso) || 1)); objetivo = PASOS[n]; plano = "p" + n; }
    else if (modo === "metodo") { const n = 1 + (Math.floor(t / 3.2) % 9); objetivo = PASOS[n]; plano = "p" + n; }
    else if (modo === "casos") { const antes = Math.floor(t / 4) % 2 === 0; objetivo = antes ? PASOS[2] : TODO; plano = "todo"; }
    else if (modo !== "estudio" && modo !== "todo") foco = FOCOS[modo] || null;
    if (modo === "estudio" && el && el.dataset.foco) foco = FOCOS[el.dataset.foco] || null;
    if (foco) plano = foco.plano;
    mostrar(foco && foco.captura ? foco.captura : null);

    // 2. El estado se acerca al objetivo con suavidad (nada salta).
    const k = o.quieto ? 1 : 1 - Math.exp(-3.2 * dt);
    for (const c in est) est[c] += (objetivo[c] - est[c]) * k;

    // 3. Áreas: sueltas y en ámbar; conectadas, en su color.
    const areaFoco = foco && foco.area;
    areas.forEach((a) => {
      const jit = est.caos * (o.quieto ? 0 : 1);
      a.g.position.y = jit * 0.06 * (0.5 + 0.5 * Math.sin(t * 1.3 + a.fase));
      a.g.rotation.y = jit * 0.14 * Math.sin(t * 0.7 + a.fase);
      const parpadeo = est.caos > 0.5 && Math.sin(t * 5 + a.fase) > 0 ? 1 : 0.35;
      a.led.material.color.copy(ambar).multiplyScalar(0.3 + 1.4 * parpadeo * (1 - est.conexion)).lerp(a.col.clone().multiplyScalar(1.8), est.conexion);
      const alto = areaFoco === a.id ? 1 : 0;
      a.cuerpo.position.y = 0.23 + alto * 0.12 * (1 - Math.exp(-4 * t));
    });

    // 4. Núcleo: sube de la bandeja; su huella se traza antes.
    nucleo.position.y = -0.95 * (1 - est.nucleo); nucleo.visible = est.nucleo > 0.06;
    huella.material.opacity = est.plano * (0.55 + 0.25 * Math.sin(t * 3));
    iaLuz.scale.setScalar(0.04 + 0.05 * est.ia * (0.75 + 0.25 * Math.sin(t * 2.4)));
    iaHalo.intensity = 3 * est.ia;

    // 5. Pistas: plano (tenues) y vivas (luz y dato).
    brillo.forEach((m, i) => { const r = rutas[i]; const on = r.tipo === "auto" ? Math.min(est.conexion, 0.3 + est.auto) : r.tipo === "panel" ? Math.min(est.conexion, 0.3 + est.medicion) : est.conexion; m.material.opacity = Math.max(est.plano * 0.35, on * 0.9); });
    pulsos.userData.mover(t, 0.2, est.conexion);
    pulsosCable.userData.mover(t, 0.16, est.conexion);

    // 6. Automatizaciones: cada palanca dispara la siguiente.
    palancas.forEach((q, i) => {
      const fase = ((t * 0.55) % 3) - i, on = est.auto > 0.5 ? (fase > 0 && fase < 1.6 ? 1 : 0) : 0;
      q.p.rotation.x += ((on ? -0.5 : 0.5) - q.p.rotation.x) * Math.min(1, dt * 10);
      q.luz.material.color.copy(apagado).lerp(new THREE.Color(0x5b8cff).multiplyScalar(2), on * est.auto);
    });

    // 7. Panel de dirección y análisis.
    if (!capturaActual) pintarPanel(est.medicion);
    escaner.visible = est.scan > 0.05;
    if (escaner.visible) { escaner.position.x = -6 + ((t * 0.25) % 1) * 12; velo.material.opacity = est.scan; }

    // Luz de filo neutra: el aluminio es gris, no azul.
    luces.rim.color.setHex(0xe8edf8); luces.rim.intensity = claro ? 0.35 : 0.7;
    // 8. Cámara: de plano a plano, con peso; el cursor y el arrastre la mueven.
    const pl = PLANOS[plano] || PLANOS.todo;
    const kc = o.quieto ? 1 : 1 - Math.exp(-2.2 * dt);
    // En los interiores el foco se ve dentro del sistema: un paso atrás.
    const lejos = modo === "estudio" || modo === "pasos" || modo === "metodo" || modo === "casos" ? 1 : 1.3;
    tmp.copy(pl[0]).sub(pl[1]).multiplyScalar(zoom * lejos).add(pl[1]);
    camPos.lerp(tmp, kc); camMira.lerp(pl[1], kc);
    giroV += (giro - giroV) * (o.quieto ? 1 : 1 - Math.exp(-5 * dt));
    const lento = (plano === "todo" || plano === "p9") && !o.quieto ? Math.sin(t * 0.12) * 0.12 : 0;
    raiz.rotation.y = giroV + lento + (ptr.sx || 0) * 0.08;
    camera.position.copy(camPos); camera.position.y += (ptr.sy || 0) * -0.3;
    camera.lookAt(camMira);
    return !o.quieto;
  }

  function tema(c) {
    claro = c; pintarBandeja(); pintarRotulos(); ultimoPanel = -1;
    if (capturaActual && capturaActual !== "web") { const n = capturaActual; capturaActual = null; mostrar(n); }
  }
  return { scene, camera, update, luces, tema };
}
