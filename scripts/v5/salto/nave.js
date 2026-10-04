/* ==========================================================================
   EL SALTO · por dentro
   --------------------------------------------------------------------------
   La tubería forzada (un túnel de acero por el que la cámara baja con el agua)
   y la nave de la central: cuatro grupos generadores, el puente grúa, la luz
   que entra por las ventanas altas y, al fondo, el contador.
   Se construye en coordenadas propias (la nave empieza en z = 0 y mide 132 m)
   y el material la coloca lejos del valle.
   aMat: 0 muro · 1 suelo · 2 acero oscuro · 3 luminaria · 4 máquina pintada · 5 contador · 6 ventana · 7 piloto · 8 tubería · 9 rótulo
   ========================================================================== */
export const NAVE = { largo: 99, medio: 14, alto: 19, origen: [0, -3000, 0], grupos: [26, 48, 70], xGrupo: 4.5, contador: { y: 9.4, ancho: 24, alto: 5.34 } };

export function geometriaNave() {
  const pos = [], nor = [], dat = [], ind = [];
  const caja = (c, t, m = 0, dentro = false, extra = 0) => {
    const [cx, cy, cz] = c, [sx, sy, sz] = t, base = pos.length / 3, C = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]], k = dentro ? -1 : 1;
    C.forEach((n, f) => {
      const u = [n[1], n[2], n[0]], w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { pos.push(cx + (n[0] + u[0] * a + w[0] * b) * sx * 0.5, cy + (n[1] + u[1] * a + w[1] * b) * sy * 0.5, cz + (n[2] + u[2] * a + w[2] * b) * sz * 0.5); nor.push(n[0] * k, n[1] * k, n[2] * k); dat.push(m, extra); }
      const o = base + f * 4; dentro ? ind.push(o, o + 2, o + 1, o, o + 3, o + 2) : ind.push(o, o + 1, o + 2, o, o + 2, o + 3);
    });
  };
  /* cilindro de eje vertical (o a lo largo de z si tumbado) */
  const cilindro = (c, r, h, m, lados = 40, tapa = true, extra = 0, dentro = false, tumbado = false) => {
    const base = pos.length / 3, P = (x, y, z) => (tumbado ? pos.push(c[0] + x, c[1] + z, c[2] + y) : pos.push(c[0] + x, c[1] + y, c[2] + z)), Nn = (x, y, z) => (tumbado ? nor.push(x, z, y) : nor.push(x, y, z)), k = dentro ? -1 : 1;
    for (let i = 0; i <= lados; i++) { const q = (i / lados) * Math.PI * 2, co = Math.cos(q), si = Math.sin(q); for (const y of [0, h]) { P(co * r, y, si * r); Nn(co * k, 0, si * k); dat.push(m, extra); } }
    for (let i = 0; i < lados; i++) { const o = base + i * 2; (dentro !== tumbado) ? ind.push(o, o + 1, o + 2, o + 1, o + 3, o + 2) : ind.push(o, o + 2, o + 1, o + 1, o + 2, o + 3); }
    if (tapa) { const o = pos.length / 3; P(0, h, 0); Nn(0, 1, 0); dat.push(m, extra); for (let i = 0; i <= lados; i++) { const q = (i / lados) * Math.PI * 2; P(Math.cos(q) * r, h, Math.sin(q) * r); Nn(0, 1, 0); dat.push(m, extra); } for (let i = 0; i < lados; i++) ind.push(o, o + 2 + i, o + 1 + i); }
  };
  const { largo: L, medio: M, alto: H } = NAVE;
  // la caja de la nave, vista desde dentro: suelo, muros y techo
  caja([0, -0.5, L / 2], [M * 2, 1, L], 1);
  caja([-M - 0.5, H / 2, L / 2], [1, H, L], 0); caja([0, H + 0.5, L / 2], [M * 2 + 2, 1, L], 0); caja([0, H / 2, L + 0.5], [M * 2 + 2, H, 1], 0);
  // el muro de las ventanas: macizo abajo y arriba, y machones entre ventana y ventana
  caja([M + 0.5, 5.75, L / 2], [1, 11.5, L], 0); caja([M + 0.5, 17.75, L / 2], [1, 2.5, L], 0);
  for (let k = 0; k <= 9; k++) { caja([M + 0.5, 14, k * 11], [1, 5, 6], 0); if (k < 9) caja([M + 0.9, 14, k * 11 + 5.5], [0.1, 5, 5], 6); }
  // el muro por el que entra la tubería: con el hueco redondo
  for (const [c, t] of [[[-8.6, H / 2, -0.5], [10.8, H, 1]], [[8.6, H / 2, -0.5], [10.8, H, 1]], [[0, 2.9, -0.5], [6.4, 5.8, 1]], [[0, 15.6, -0.5], [6.4, 6.8, 1]]]) caja(c, t, 0);
  // pilastras y vigas
  for (let k = 1; k < 9; k++) { const z = k * 11; caja([-M + 0.5, H / 2, z], [1, H, 1.3], 0); caja([M - 0.45, 5.75, z], [0.9, 11.5, 1.3], 0); caja([0, H - 0.75, z], [M * 2, 1.5, 0.9], 0); }
  // luminarias: dos tiras a lo largo de la nave
  for (const x of [-6, 6]) caja([x, H - 1.75, L / 2], [0.5, 0.18, L - 6], 3);
  // carriles y puente grúa
  for (const x of [-M + 1.3, M - 1.3]) caja([x, 11.0, L / 2], [0.9, 0.8, L - 2], 2);
  caja([0, 12.0, 56], [M * 2 - 2, 1.5, 2.2], 2); caja([0, 12.0, 59.6], [M * 2 - 2, 1.5, 2.2], 2); caja([-6, 12.9, 57.8], [3.2, 1.6, 5.4], 2);
  for (const dz of [-0.6, 0.6]) caja([-6, 9.3, 57.8 + dz], [0.06, 5.6, 0.06], 2); caja([-6, 6.3, 57.8], [0.9, 0.7, 0.9], 2);
  // los cuatro grupos: foso con barandilla, carcasa, excitatriz y pilotos
  NAVE.grupos.forEach((z, g) => {
    const c = [NAVE.xGrupo, 0, z];
    cilindro(c, 6.4, 0.5, 4, 48, true, g); cilindro([c[0], 0.5, c[2]], 5.3, 2.5, 4, 48, true, g); cilindro([c[0], 3.0, c[2]], 3.5, 2.2, 4, 40, true, g); cilindro([c[0], 5.2, c[2]], 1.5, 1.5, 4, 28, true, 10 + g); cilindro([c[0], 6.7, c[2]], 0.5, 0.9, 2, 12, true, g);
    for (let i = 0; i < 18; i++) { const q = (i / 18) * Math.PI * 2; caja([c[0] + Math.cos(q) * 5.34, 2.2, c[2] + Math.sin(q) * 5.34], [0.26, 0.26, 0.26], 7, false, g + i / 40); }
    for (let i = 0; i < 20; i++) { const q = (i / 20) * Math.PI * 2, q2 = ((i + 1) / 20) * Math.PI * 2, r = 7.6, a = [c[0] + Math.cos(q) * r, c[2] + Math.sin(q) * r], b = [c[0] + Math.cos(q2) * r, c[2] + Math.sin(q2) * r];
      caja([a[0], 0.55, a[1]], [0.07, 1.1, 0.07], 2); caja([(a[0] + b[0]) / 2, 1.1, (a[1] + b[1]) / 2], [Math.abs(b[0] - a[0]) + 0.06, 0.06, Math.abs(b[1] - a[1]) + 0.06], 2); }
    caja([-9.5, 1.0, z], [1.2, 2.0, 2.4], 4, false, g); caja([-9.5, 1.55, z - 0.0], [1.22, 0.5, 1.6], 7, false, g + 0.5);   // armario de mando
  });
  // el fondo: el contador, su marco, la puerta y el rótulo
  const K = NAVE.contador;
  caja([0, K.y, L - 0.25], [K.ancho + 1.2, K.alto + 1.2, 0.5], 2); caja([0, K.y, L - 0.52], [K.ancho, K.alto, 0.06], 5);
  caja([0, 15.6, L - 0.05], [16, 1.6, 0.06], 9);
  caja([-11.4, 1.1, L - 0.1], [1.2, 2.2, 0.2], 2); caja([-11.4, 2.55, L - 0.2], [0.5, 0.14, 0.3], 3);
  // la tubería forzada: un tubo de 215 m que desemboca en la nave
  cilindro([0, 9, -216], 3.2, 216, 8, 28, false, 0, true, true);
  return { pos: new Float32Array(pos), nor: new Float32Array(nor), dat: new Float32Array(dat), ind: new Uint32Array(ind) };
}

/* Los haces de luz de las ventanas: un paño inclinado por ventana. aHaz: [u a lo ancho, v a lo largo, ventana] */
export function geometriaHaces() {
  const pos = [], haz = [], ind = [], S = [0.60, 0.58], M = NAVE.medio;
  for (let k = 0; k < 9; k++) for (const dz of [-1.6, 0, 1.6]) {
    const z = k * 11 + 5.5 + dz, o = pos.length / 3, y0 = 11.5, y1 = 16.5, x0 = M - (y0 / S[1]) * S[0], x1 = M - (y1 / S[1]) * S[0];
    pos.push(M, y1, z, M, y0, z, x1, 0, z, x0, 0, z); haz.push(0, 0, k, 1, 0, k, 0, 1, k, 1, 1, k); ind.push(o, o + 1, o + 2, o + 1, o + 3, o + 2);
  }
  return { pos: new Float32Array(pos), haz: new Float32Array(haz), ind: new Uint32Array(ind) };
}
