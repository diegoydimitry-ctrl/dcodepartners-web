# Exposición de contenido interno en dcodepartners.com · 17-09-2026

## 1. Qué pasaba

El proyecto de Vercel `dcodepartners-web` está configurado así (API de Vercel):
- `framework: null`
- sin directorio de salida
- sin comando de build

Vercel publica **como estático todo lo que llega al despliegue**. En un despliegue desde Git llega todo el repositorio, menos:
- los ignores por defecto de Vercel (`.git`, `.gitignore`, `node_modules`…);
- lo que diga `.vercelignore`, que en `main` no existe.

Solo quedan fuera, además, `package.json`, `vercel.json` y el código de `api/`, porque Vercel los trata como configuración y funciones.

**Resultado: cualquier carpeta interna versionada queda publicada.**

## 2. Superficie real expuesta en producción

Medido el 17-09-2026 contra https://dcodepartners.com (deployment `dpl_3ksr95wdEQGg9JfvAnGsdMfmbZkH`, commit `9994abe`).

| Ruta | HTTP | Contenido |
|---|---|---|
| `/docs/estrategia-monetizacion-dcode-partners.md` | **200** | Estrategia de precios, márgenes y descuentos (interno) |
| `/automation/n8n/lead-ia-360/lead-ia-360.workflow.json` | **200** | Workflow n8n completo: prompts, lógica, email comercial. Sin secretos: las credenciales son `REPLACE_WITH_CREDENTIAL_ID` |
| `/automation/n8n/lead-ia-360/README.md` | **200** | Documentación interna |
| `/automation/n8n/linkedin-auto-post/*` | **200** | Workflow y README |
| `/scripts/*.js` (4 ficheros) | **200** | Scripts de QA y build |
| `/.github/workflows/qa-preview.yml` | **200** | CI |
| `/lib/providers.js` | **200** | Proveedores del asistente (sin claves) |
| `/README.md`, `/package.json`, `/vercel.json`, `/.gitignore`, `/api/*.js` | 404 | No expuestos |

**Reproducido en local exactamente igual.** Método:
1. `vercel build` (CLI oficial, sin conexión) sobre `git archive 9994abe`.
2. Selección de ficheros con la función real `buildFileTree` de `@vercel/client`.
3. Emulador mínimo de la Build Output API.

El resultado da los mismos 200 y 404 que producción, fila por fila. Ver §5.

## 3. El repositorio es PÚBLICO

Vercel informa `githubRepoVisibility: "public"` para `diegoydimitry-ctrl/dcodepartners-web`; el repo, además, se clona sin credenciales. Por tanto:
- **Todo lo versionado, en cualquier commit, es legible en GitHub**, arregle lo que arregle Vercel.
- Historial: 387 commits y 102 rutas internas que alguna vez se versionaron. Entre ellas:
  - `docs/estrategia-monetizacion-dcode-partners.md`
  - `docs/cambios-dcode-partners/` (DECISIONES-DIRECCION, CONTEXTO-MAESTRO, INCIDENCIAS, ROADMAP…)
  - `docs/AUDITORIA-ECOSISTEMA-N8N-AIRTABLE-20260908.md`
  - `docs/postgresql-neon-proteccion.md`
  - `docs/operaciones-ecosistema-dcode.md`
  - `docs/entregas/cierre-pendientes-20260901.pdf`
  - `auditoria/`, `propuestas/el-patio`, `automation/content-factory/`, `marketing/video-ad`
  - `CLAUDE.md`
- **Barrido de secretos en todo el historial:** 0 coincidencias en claves de Anthropic, OpenAI, AWS, Resend, Slack, GitHub, Google, JWT, claves privadas, cadenas de conexión PostgreSQL/Neon, tokens de Airtable, Twilio, n8n, Stripe o webhooks de Slack/Telegram.
- **Datos personales que ya son públicos en la propia web:** email de contacto, teléfonos de los fundadores (en la base de conocimiento del asistente) y la URL del webhook del formulario (el navegador la necesita).

**No se ha tocado la historia ni la visibilidad del repositorio.** Es decisión de Dirección (§6).

## 4. Corrección en la rama `diseno/dcode-design-system`

1. **`.vercelignore` pasa de lista negra a lista BLANCA**, el patrón que recomienda Vercel:
   - `/*` ignora todo lo que cuelga de la raíz.
   - Se re-incluyen solo `*.html`, `en/`, `blog/`, `departamentos/`, `servicios/`, `sistema-financiero/`, `assets/`, `robots.txt`, `sitemap.xml`, `api/`, `lib/`, `package.json` y `vercel.json`.
   - Así, una carpeta interna nueva **no** se publica hasta que alguien la añada a mano.
   - La lista negra anterior dejaba además `/.vercelignore` dentro del despliegue.
2. **`/lib` sigue desplegándose**, porque `api/chat.js` lo importa (verificado: `chat.func/lib/providers.js` está en la salida del build). Su lectura pública se corta con la redirección `/lib/:path* → /404`, ya presente en `vercel.json`.
3. **Centinela nuevo `npm run check:superficie`** (`scripts/check-deploy-surface.mjs`):
   - Parte de `git ls-files` y aplica los ignores de Vercel más `.vercelignore` con la misma librería (`ignore`) y la misma composición que `@vercel/client`.
   - **Falla si:**
     - entra cualquier ruta interna (`docs`, `scripts`, `.github`, `automation`, `auditoria`, `*.md`, `*.yml`, `*.workflow.json`, `CLAUDE.md`, `.env`…);
     - entra un tipo de fichero no público;
     - falta algo imprescindible;
     - una página HTML se queda fuera;
     - `/lib` pierde su redirección.
   - Con `--url <despliegue>` sondea también las rutas internas en vivo.
4. **CI:**
   - `.github/workflows/superficie-despliegue.yml` ejecuta el centinela en cada push y PR.
   - `qa-preview.yml` lo lanza contra la Preview del PR y en el smoke test manual.

## 5. Evidencia de la corrección

| Prueba | Resultado |
|---|---|
| Centinela con `.vercelignore` actual | ✓ 124 versionados → 110 desplegados, 0 internos |
| Centinela sin `.vercelignore` (= producción hoy) | ✗ 14 problemas (docs, scripts, automation, .github…) |
| Centinela con la lista negra anterior (62ca039) | ✗ `.vercelignore` desplegado |
| Mutación: olvidar `!/blog` | ✗ «Página HTML fuera del despliegue» |
| Mutación: añadir `!/docs` | ✗ «INTERNO en el despliegue» |
| Lista del centinela frente a `buildFileTree` real de `@vercel/client` | **Idénticas** (110 ficheros) |
| `vercel build` de la rama | OK: 2 funciones (`chat`, `contact-fallback`), salida estática sin `docs`, `scripts`, `automation` ni `.github` |
| Sondeo en vivo, build equivalente a producción | ✗ 6 rutas internas con 200 (igual que producción real) |
| Sondeo en vivo, build de la rama | ✓ 0 rutas internas; públicas 200; `/lib/providers.js` → 307 a /404 |

**Límite honesto:** el emulador reproduce las rutas de `config.json` y los estáticos, no la red de Vercel. La prueba definitiva es `npm run check:superficie -- --url <URL de la Preview>`, que CI ejecuta en el PR.

## 6. Pendiente de Dirección

1. **Visibilidad del repositorio.** Mientras sea público, todo lo de §3 se puede leer en GitHub. Pasarlo a privado es un ajuste de la cuenta; comprobar antes que ninguna integración dependa de que sea público.
2. **Reescritura de historial** (`git filter-repo`) para eliminar los documentos internos. Es destructiva, rompe los clones existentes y no borra copias ya indexadas o en forks. Solo con autorización expresa.
3. **Desplegar la corrección a producción.** Hasta entonces, las rutas de §2 siguen respondiendo 200.
4. **Previews de otras ramas** (`dcodepartners-web-git-*.vercel.app`) sirven el mismo contenido que su commit. Dependen de la protección de despliegues del proyecto.
