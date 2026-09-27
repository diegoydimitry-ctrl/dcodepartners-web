# Product

<!-- impeccable:product-schema 1 -->

> Escrito el 27/09/2026 sin ronda de preguntas: Dirección pidió expresamente no ser preguntada («No me preguntes… toma decisiones profesionales y ejecuta»). Todo lo de aquí sale del contexto maestro del proyecto (Dirección), de `catalogo.json`, `precios.json` y del código existente. Lo que es inferencia va marcado **[INFERIDO]**.

## Platform

web

## Users

- Dueños, gerentes y responsables de operaciones de pymes españolas (cualquier sector al que se pueda aplicar D-Code), que hoy sostienen la empresa con hojas de cálculo, correo, WhatsApp, papel y varias herramientas que no se hablan.
- Llegan desde LinkedIn, Instagram, YouTube, Google Ads (landings de la Fase 0) o la visita de un vendedor (Madrid, Málaga, Asturias). **[INFERIDO]** la mayoría abre la web en el móvil tras una conversación o un anuncio, y vuelve en el ordenador para ver precios y demos.
- Su trabajo al entrar: entender en segundos qué hace D-Code, comprobar que es real (tocar algo), ver cuánto cuesta y pedir una llamada.

## Product Purpose

D-Code Partners (Madrid; fundada por Diego Siñeriz y Dimitry Sosenko) detecta dónde una empresa pierde tiempo con trabajo manual, repetido o desconectado y construye el sistema que lo une: automatizaciones, agentes de IA, integraciones, sistemas a medida, webs y dos productos propios (D-Code Finance y D-Code OS). Visión: *Intelligent Business Operating Systems* adaptados a cada empresa.

Éxito de la web: que el visitante entienda el mecanismo, toque un sistema funcionando y pida una llamada o haga el diagnóstico.

## Positioning

- No vende herramientas sueltas ni licencias: construye el sistema con el que funciona esa empresa, sobre sus datos.
- Software propio (Finance, OS) que D-Code usa dentro de casa.
- Todo se puede tocar antes de hablar: cuatro demos funcionando con datos inventados (Finance, Comercial, Operaciones, Atención) y la capa D-Code OS.
- Alcance, plazo y precio por escrito antes de empezar. Sin permanencia.

## Operating Context

El mundo del cliente: facturas, albaranes, pedidos, partes de trabajo, contratos, presupuestos; el correo, la hoja de Excel, el programa de facturación, el teléfono y WhatsApp; la persona que copia de un sitio a otro. Flujo de D-Code: problema → análisis → diseño → sistema → automatización → IA → operación → mejora. Método en cuatro fases: analizamos, diseñamos, implantamos, medimos y mejoramos.

## Capabilities and Constraints

- Sitio estático HTML/CSS/JS escrito a mano, sin framework, desplegado en Vercel (proyecto `dcodepartners-web`), ES/EN (37 + 37 páginas), `cleanUrls`.
- Fuente única comercial: `catalogo.json` y `precios.json` (scripts `build:*` / `check:*`). Ningún precio se cambia a mano en HTML.
- Demos: `assets/js/finance-demo*.js`, `demo-*.js`, `dcode-os.js`, diagnóstico en `main.js`, configurador de contacto (`configurador.js`), chatbot (`/api`).
- Formularios con Turnstile y Resend (`/api`); consentimiento y analítica existentes.
- Three.js r180 vendorizado en `assets/vendor/` (MIT).
- Hoy no hay pago online: se solicita la activación y D-Code implanta.

## Brand Commitments

- Nombre: D-Code Partners. Logotipo con el símbolo de píxeles/lazo (dos fundadores) en `assets/logo/`.
- Dark first, con modo claro real (petición expresa de Dirección).
- Voz: directa, concreta, sin hype ni porcentajes inventados; tuteo; «Nada de esto hay que creérselo: se comprueba».

## Evidence on Hand

- Precios reales «desde» (sin IVA): Finance desde 29 €/mes (+ puesta en marcha desde 390 €); D-Code OS desde 2.900 € de implantación; sistema a medida desde 1.500 €; agentes e integraciones desde 750 €; packs con nombre en `catalogo.json`.
- Demos funcionando con datos ficticios etiquetados.
- Casos: solo los internos (`/casos-exito`, sistemas que D-Code usa en casa). **No existen testimonios, logos de clientes ni métricas de resultados publicables: no se inventan.**
- Primer cliente en cierre (Sánchez Rubio): no se menciona en la web sin autorización.

## Product Principles

1. Demostrar antes que afirmar: lo que se enseña funciona o se dice que es ilustrativo.
2. Un dato, una vez: el sistema une lo que hoy se copia a mano.
3. La persona decide lo importante; la IA lee, clasifica y propone.
4. Todo por escrito: alcance, plazo, precio.

## Accessibility & Inclusion

WCAG 2.2 AA (hay batería axe-core en el repo), `prefers-reduced-motion`, navegación por teclado, sin información crítica solo en canvas.
