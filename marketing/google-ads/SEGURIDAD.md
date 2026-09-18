# Seguridad — landings y captación de Google Ads

## Lo que el código garantiza (con pruebas)

| Garantía | Dónde | Prueba |
|---|---|---|
| Ningún secreto en el navegador ni en el repositorio | `assets/ads/config.js` solo tiene valores públicos; tokens solo por variable de entorno | `check-ads-fase0` busca patrones de claves en todo lo desplegable |
| Production NO acepta leads de las landings hasta activarlo a mano | `ADS_LEAD_PRODUCTION_ENABLED` distinto de `1` → 503 | backend.test «Production sin activar» |
| Un Preview NUNCA escribe en la base real | Si `VERCEL_ENV≠production` y la base es `app5JfVEjK4JiMXEm` → bloqueado | backend.test «config» |
| Por defecto no se guarda nada (dryrun) | `ADS_LEAD_MODE` vacío = `dryrun` | backend.test «config» |
| Solo peticiones del propio sitio | cabecera `Origin` = host | backend.test «handler» |
| Límite de ritmo, tamaño de cuerpo, tipo de contenido | 8 envíos/min/IP, 16 KB, JSON | backend.test «handler» |
| Anti-bot | campo trampa + tiempo mínimo 2,5 s; Turnstile si hay secreto (falla cerrado) | backend.test |
| Datos mínimos | solo los 8 campos + privacidad + origen; el resto se ignora | backend.test «se ignoran campos» |
| Nada de datos personales en URLs ni eventos | la URL de gracias lleva una referencia opaca y se borra antes de cargar etiquetas | e2e «Google Ads E2E» |
| Almacenamiento del navegador solo con consentimiento | `localStorage` solo si publicidad = granted; se borra al retirarlo | e2e «consentimiento» |
| Consent Mode v2 denegado por defecto; CookieYes antes que Google | puerta de dominio en `<head>` | e2e «producción simulada» + `npm run check:consentimiento` |
| Fuera de dcodepartners.com no se llama a terceros | Previews y local: 0 peticiones externas | e2e (todas las landings) |
| Lectura de la web del lead sin SSRF | sin IPs privadas, sin redirecciones, 4 s, 400 KB, solo HTML | backend.test «evidencia» |
| El navegador nunca recibe la ficha interna | respuesta = `{ok, ref, modo, duplicado}` | backend.test «éxito devuelve SOLO la referencia» |
| Nada interno se despliega | `marketing/`, `tests/` fuera de la lista blanca de `.vercelignore` | `npm run check:superficie` |

## Variables de entorno (NO creadas; decisión humana)

| Variable | Preview | Production (día de activación) |
|---|---|---|
| `ADS_LEAD_MODE` | `airtable` (o vacío = dryrun) | `airtable` |
| `AIRTABLE_ADS_TOKEN` | token con acceso SOLO a la base de PRUEBAS | token con acceso SOLO a la base real |
| `AIRTABLE_ADS_BASE_ID` | `appwMWJvQPpu0Ypvg` (PRUEBAS) | `app5JfVEjK4JiMXEm` |
| `AIRTABLE_ADS_TABLE` | `Leads` | `Leads` |
| `ADS_LEAD_PRODUCTION_ENABLED` | — | `1` |
| `ADS_FICHA_LEER_WEB` | `1` opcional | `1` opcional |
| `TURNSTILE_SECRET_KEY` | — (la clave de sitio no vale en Preview) | la misma que usa Lead IA 360 |

Se configuran en Vercel → Project → Settings → Environment Variables, eligiendo el entorno. Nunca en el repositorio.
