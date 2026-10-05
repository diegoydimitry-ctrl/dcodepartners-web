// Utilidades de animación compartidas por las escenas.
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u;
export const ss = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
export const eio = (u) => { u = clamp(u); return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
export const eout = (u) => 1 - Math.pow(1 - clamp(u), 3), ein = (u) => clamp(u) ** 3;
export const rango = (t, a, b) => clamp((t - a) / (b - a));
export const semilla = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
