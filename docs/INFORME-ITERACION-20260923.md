# Iteración del 23/09/2026 — precios, compartir, formulario y repaso integral

Rama `diseno/dcode-design-system`. Preview de Vercel. `main` y Production, sin tocar.

## 1 · Precios de referencia

Los precios «desde» viven en **`precios.json`** y los escribe `npm run build:precios`
en las marcas `data-precio` de la web; `npm run check:precios` falla si no coinciden.
Junto a cada uno se publica el aviso de que son de referencia y de que el precio final
depende del alcance.

| Oferta | Publicado | Dónde |
|---|---|---|
| D-Code Finance | Desde 79 €/mes · más 690 € de implantación | portada |
| Sistema a medida | Desde 1.500 € · según el alcance | portada y /servicios |
| Agentes e integraciones | Desde 750 € · según el alcance | portada y /servicios |

**Pendiente de decisión humana.** Se dio como referencia «Finance desde 29 €/mes».
La página de planes publica 690 € + 79 €/mes (plan 01) y esos tres planes son la base
de la comparativa con Holded, Odoo y Sage. Publicar 29 €/mes en la portada dejaría la
web contradiciéndose a un clic de distancia, así que se publica el precio real y la
decisión queda abierta: crear un plan de 29 €/mes y rehacer la página de planes, o
mantener 79 €/mes. Se cambia en `precios.json` y se ejecuta `build:precios`.

## 2 · Lo que se ve al compartir el enlace

`assets/og-image.png` decía «Growth Partners · Un mes de servicio gratuito»: una
posición y una oferta que ya no existen en ninguna página. Ahora se genera
(`npm run build:og`) con la tipografía, los colores y el mensaje de la portada, más una
captura real de Finance, y hay versión en inglés (`og-image-en.png`) enlazada desde las
33 páginas EN.

## 3 · Formulario de contacto

El error lo daba el navegador: un globo en inglés sobre una página en español
(«Please include an '@'…») que además desaparece al desplazarse. Ahora el mensaje se
escribe debajo del campo, en el idioma de la página, con `aria-invalid` y
`aria-describedby` para lectores de pantalla, y se borra al corregir. La validación
sigue siendo la del navegador: solo cambia cómo se cuenta.

## 4 · Repaso integral

- **Propuesta comercial**: bloque «Tres formas de empezar» en la portada con precio por
  oferta; en /servicios, precio por pieza y las cuatro capturas etiquetadas con la pieza
  que llevan dentro (producto propio, automatización, agentes, integraciones).
- **Dispositivos**: teléfono, tableta y escritorio revisados con capturas en los dos temas.
- **Temas**: oscuro con cajas claras y claro con cajas oscuras, también en las tarjetas
  nuevas (añadidas a la lista de cajas del generador de superficies).
- **Demos**: se montan por encima de 900 px (iPad incluido); la ficha de lectura con
  captura real se queda en el teléfono.
- **SEO**: títulos, descripciones, canónicas y hreflang revisados en las 64 URLs del
  sitemap; 404 con `noindex`.
- **Texto provisional**: no queda ninguno salvo los datos legales marcados como
  pendientes (NIF/CIF, domicilio y registro en Aviso Legal y Privacidad).

## 5 · Comprobado

`check:estado`, `check:precios`, `check:og`, `check:enlaces`, `check:tema`,
`check:superficie`, `check:demo`, `qa:demo`, `qa:solapes` (70 páginas × 5 anchos),
axe-core WCAG 2.2 AA en las 64 páginas y los dos temas, y rendimiento medido en
teléfono, tableta y escritorio.

## 6 · Pendiente humano

1. **Precio de entrada de Finance** (ver arriba).
2. **Datos legales**: NIF/CIF, domicilio social y datos registrales en Aviso Legal, y
   NIF/CIF y domicilio en Privacidad. Siguen marcados como pendientes a propósito.
