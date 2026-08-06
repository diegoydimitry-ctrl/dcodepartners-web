# LinkedIn Auto-Post D-Code — Plantilla n8n

Publicación automática en LinkedIn del calendario de contenido de 4 semanas
(3–28 de agosto de 2026, 3 posts/semana). Stack: **n8n + LinkedIn (OAuth2)**.

## Qué hace

Cada día, a las 08:30 (Europe/Madrid), el workflow revisa un calendario de 12
posts embebido en el propio nodo de código y publica en LinkedIn el que
corresponde a la fecha de hoy — si hay uno programado. Los días sin post
programado, no hace nada. No hay riesgo de publicar el mismo post dos veces:
cada entrada del calendario tiene su propia fecha fija.

```
Disparador Diario (Schedule Trigger, 08:30 Europe/Madrid)
  → Calendario de Contenido                      [Code]
    · Calendario de 12 posts embebido (fecha, pilar, hook, cuerpo, CTA, hashtags)
    · Compara la fecha de hoy y arma el texto final del post si toca
  → ¿Hay Post Programado Hoy?                     [If]
      ✓ → Publicar en LinkedIn                    [LinkedIn · Post/Create]
      ✗ → Sin Publicación Hoy                     [NoOp]
```

El calendario vive **dentro del Code node**, no en `assets/data/` del sitio:
n8n Cloud no tiene acceso al repositorio, así que el workflow tiene que ser
autocontenido para poder importarse solo y funcionar sin depender de nada
externo.

## Requisitos para activarlo

1. **Cuenta de LinkedIn conectada en n8n.** Crea una credencial de tipo
   *LinkedIn OAuth2 API* en n8n (`Credentials → New → LinkedIn`). Requiere
   crear una app en el [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
   con el producto *Sign In with LinkedIn using OpenID Connect* habilitado
   (da acceso al scope `w_member_social`, necesario para publicar). El flujo
   OAuth se hace una sola vez, desde la propia pantalla de credenciales de
   n8n.
2. **Importa `linkedin-auto-post.workflow.json`** en tu instancia de n8n
   (`Workflows → Import from File`).
3. **Abre el nodo "Publicar en LinkedIn"** y confirma manualmente:
   - La credencial de LinkedIn que acabas de crear.
   - "Publicar como" → *Person* (perfil personal de Diego o Dimitry — no
     organización: publicar como página de empresa requiere que LinkedIn
     apruebe acceso a la Community Management API, un proceso de partner
     independiente y mucho más lento de conseguir).

   Esto no es un error del JSON: los campos de tipo selector de n8n
   (credencial, "Publicar como") casi siempre piden reselección manual tras
   importar un workflow desde archivo, por diseño de n8n.
4. **Activa el workflow.** A partir de ahí publica solo, sin intervención,
   en las fechas programadas.

## Cómo extender o reprogramar el calendario

Todo el contenido está en el array `CALENDARIO` dentro del nodo **Calendario
de Contenido**:

- **Añadir más semanas:** añade entradas nuevas al array con formato
  `{ date: 'YYYY-MM-DD', pillar, hook, body, cta, hashtags }`.
- **Reprogramar el calendario actual a otras fechas:** cambia el campo
  `date` de las 12 entradas, manteniendo el mismo orden. La secuencia de
  pilares (Dolor → Fundamentos → Bastidores → Método → Caso de uso,
  alternados) está pensada para no repetir el mismo tipo de post dos veces
  seguidas — conviene no reordenar el contenido, solo desplazar las fechas.

## Limitaciones conocidas

- **Solo texto.** El post se publica como texto plano
  (`shareMediaCategory: "NONE"`), sin imagen ni carrusel — los formatos
  visuales sugeridos en el calendario (carrusel, diagrama, foto) hay que
  subirlos a mano si se quiere usar imagen, LinkedIn no permite adjuntar
  medios reales por API sin un paso adicional de subida de asset.
- **Perfil personal, no página de empresa.** Ver punto 3 de arriba.
- **Sin resharing automático a la página de empresa de D-Code Partners.**
  Resharear desde la página, si se quiere, sigue siendo manual — la reach
  orgánica de LinkedIn suele premiar más el post nativo desde perfil
  personal que el reshare desde página, así que no es una limitación grave.
