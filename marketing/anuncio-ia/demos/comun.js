/*
 * Utilidades comunes de las demos del anuncio.
 *
 * Cada demo funciona de dos formas:
 *   - EN VIVO (por defecto): bucle requestAnimationFrame y entrada real
 *     (teclado, ratón, rueda, táctil).
 *   - CAPTURA (?captura=1): no hay bucle; el grabador llama a
 *     window.renderAt(t) para cada fotograma y hace la foto. La entrada
 *     sale de un guion (las mismas teclas y movimientos que haría una
 *     persona), así la grabación es idéntica cada vez y sin tirones.
 */
export const params = new URLSearchParams(location.search)
export const CAPTURA = params.get('captura') === '1'

/** Estado de entrada compartido: lo rellena el usuario o el guion. */
export const entrada = {
  teclas: new Set(),
  raton: { x: 0.5, y: 0.5, abajo: false, visible: false },
  scroll: 0,
}

export function escucharEntradaReal(lienzo) {
  addEventListener('keydown', (e) => entrada.teclas.add(e.key.toLowerCase()))
  addEventListener('keyup', (e) => entrada.teclas.delete(e.key.toLowerCase()))
  const mover = (x, y) => {
    entrada.raton.x = x / innerWidth
    entrada.raton.y = y / innerHeight
    entrada.raton.visible = true
  }
  addEventListener('pointermove', (e) => mover(e.clientX, e.clientY))
  addEventListener('pointerdown', (e) => { mover(e.clientX, e.clientY); entrada.raton.abajo = true })
  addEventListener('pointerup', () => { entrada.raton.abajo = false })
  addEventListener('wheel', (e) => { entrada.scroll = Math.max(0, entrada.scroll + e.deltaY) }, { passive: true })
  if (lienzo) lienzo.style.touchAction = 'none'
}

/**
 * Bucle de la demo. `paso(t, dt)` avanza la simulación y dibuja.
 * En captura se expone window.renderAt(t) para avanzar a tiempo fijo.
 */
export function arrancar(paso, { fpsCaptura = 30, subpasos = 4 } = {}) {
  if (CAPTURA) {
    let tPrevio = 0
    window.renderAt = async (t) => {
      // avanza la simulación en pasos fijos hasta t, para que el resultado
      // no dependa de cuánto tarda cada fotograma
      const dtFijo = 1 / (fpsCaptura * subpasos)
      while (tPrevio + dtFijo <= t + 1e-9) { tPrevio += dtFijo; paso(tPrevio, dtFijo, false) }
      await paso(t, 0, true)
      await new Promise((r) => requestAnimationFrame(() => r()))
    }
    window.LISTO = true
    return
  }
  let t0 = performance.now(), tPrev = 0
  const bucle = (ahora) => {
    const t = (ahora - t0) / 1000
    const dt = Math.min(0.05, t - tPrev)
    tPrev = t
    paso(t, dt, true)
    requestAnimationFrame(bucle)
  }
  requestAnimationFrame(bucle)
  window.LISTO = true
}

/** Interpolación suave entre fotogramas clave [[t, valor], ...]. */
export function claves(lista, t) {
  if (t <= lista[0][0]) return lista[0][1]
  for (let i = 1; i < lista.length; i++) {
    const [t1, v1] = lista[i]
    const [t0, v0] = lista[i - 1]
    if (t <= t1) {
      const u = (t - t0) / (t1 - t0)
      const s = u * u * (3 - 2 * u)
      return typeof v0 === 'number' ? v0 + (v1 - v0) * s : v0.map((a, k) => a + (v1[k] - a) * s)
    }
  }
  return lista[lista.length - 1][1]
}

export const suave = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u) }
export const mezcla = (a, b, u) => a + (b - a) * u

/** Generador pseudoaleatorio con semilla (mismo resultado siempre). */
export function aleatorio(semilla = 1) {
  let s = semilla >>> 0
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}

/** Compila un programa WebGL2 de pantalla completa. */
export function programa(gl, fuenteFrag, fuenteVert) {
  const vs = fuenteVert || `#version 300 es
  in vec2 p; out vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`
  const sh = (tipo, src) => {
    const s = gl.createShader(tipo); gl.shaderSource(s, src); gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n'))
    return s
  }
  const pr = gl.createProgram()
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fuenteFrag))
  gl.bindAttribLocation(pr, 0, 'p'); gl.linkProgram(pr)
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr))
  const u = {}
  const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(pr, i); u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(pr, info.name) }
  return { pr, u }
}

let quadBuf = null
export function dibujarQuad(gl) {
  if (!quadBuf) {
    quadBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf)
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
