# D-Code Partners — Sitio Web

Landing page corporativa de **D-Code Partners**, Growth Partners & especialistas en automatización con Inteligencia Artificial.

## Contenido del repositorio

```
index.html              → Página web completa (HTML + CSS + JS en un único archivo)
assets/
  dcode-icon.svg               → Icono de marca suelto (favicon, redes sociales, apps)
  dcode-logo-horizontal.svg    → Logo completo (icono + wordmark) para fondos claros
  dcode-logo-horizontal-dark-bg.svg → Logo completo, versión invertida para fondos oscuros
```

## Ver la web en local

No necesita build ni dependencias. Basta con abrir `index.html` en cualquier navegador,
o servirlo con un servidor estático simple:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

## Publicar con GitHub Pages

1. Sube este repositorio a GitHub (ver pasos más abajo).
2. Entra en **Settings → Pages** del repositorio.
3. En "Source", selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL del tipo `https://tu-usuario.github.io/nombre-repo/`.

## Notas

- El formulario de contacto es solo de front-end (muestra un mensaje de confirmación,
  pero no envía datos todavía). Para recibir solicitudes reales hay que conectarlo a un
  backend, un servicio como Formspree, o un CRM.
- Los teléfonos y el email de contacto están escritos directamente en el HTML
  (sección `#contacto`); edítalos ahí si cambian.
