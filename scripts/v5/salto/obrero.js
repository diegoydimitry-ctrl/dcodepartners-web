/* EL SALTO · el hilo que construye el mundo (ver fabrica.js) */
import { fabricar, transferibles } from "./fabrica.js";
self.onmessage = (e) => { const d = fabricar(e.data || {}); self.postMessage(d, transferibles(d)); };
