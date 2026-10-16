"""Portada v9, versión mínima: poquísima información, directa y que se entienda.

Cinco bloques: qué hacemos, qué automatizamos, cómo, el producto propio y la llamada.
Todas las frases salen de la web de producción (menú de capacidades, /garantias,
/contacto); aquí solo se acortan.
"""
from common import e, mark, page

T = {
    "es": {
        "h1": "Automatizamos el trabajo repetitivo.",
        "sub": "Vemos cómo trabaja tu empresa y construimos el sistema que lo hace solo.",
        "cta": ("Reservar 30 minutos", "/contacto"),
        "que_l": "Qué automatizamos",
        "que": [
            ("Facturas y cobros", "Cobra sin perseguir a nadie.", "/departamentos/finanzas"),
            ("Ventas", "Ninguna venta perdida por falta de seguimiento.", "/departamentos/comercial"),
            ("Atención al cliente", "Respuesta rápida, incluso fuera de horario.", "/departamentos/soporte"),
            ("Informes", "Una decisión clara cada mañana, con datos reales.", "/departamentos/direccion"),
        ],
        "que_mas": ("Ver las 8 áreas", "/departamentos"),
        "como_l": "Cómo trabajamos",
        "como": [("Analizamos.", "Dónde se pierde el tiempo."),
                 ("Construimos.", "El sistema, con tus herramientas."),
                 ("Medimos.", "Lo que cambia, con datos.")],
        "fin_l": "Producto propio",
        "fin_h": "D-Code Finance",
        "fin_p": "Facturas, cobros y gastos en un solo panel.",
        "fin_a": ("Ver la demo", "/sistema-financiero/demo"),
        "fin_alt": "Panel de D-Code Finance (demo con datos ficticios).",
        "end_h": "¿Hablamos?",
        "end_p": "En 30 minutos te decimos qué automatizaríamos y por dónde empezar.",
        "gar": ["Alcance por escrito", "Sin permanencia", "El sistema es tuyo"],
        "gar_href": "/garantias",
    },
    "en": {
        "h1": "We automate repetitive work.",
        "sub": "We look at how your company works and build the system that does it on its own.",
        "cta": ("Book 30 minutes", "/en/contacto"),
        "que_l": "What we automate",
        "que": [
            ("Invoices and collections", "Get paid without chasing anyone.", "/en/departamentos/finanzas"),
            ("Sales", "No sale lost for lack of follow-up.", "/en/departamentos/comercial"),
            ("Customer support", "Fast replies, even out of hours.", "/en/departamentos/soporte"),
            ("Reports", "One clear decision every morning, on real data.", "/en/departamentos/direccion"),
        ],
        "que_mas": ("See all 8 areas", "/en/departamentos"),
        "como_l": "How we work",
        "como": [("We analyse.", "Where the time goes."),
                 ("We build.", "The system, with your tools."),
                 ("We measure.", "What changes, with data.")],
        "fin_l": "Our own product",
        "fin_h": "D-Code Finance",
        "fin_p": "Invoices, collections and expenses in one dashboard.",
        "fin_a": ("See the demo", "/en/sistema-financiero/demo"),
        "fin_alt": "D-Code Finance dashboard (demo with fictitious data).",
        "end_h": "Shall we talk?",
        "end_p": "In 30 minutes we tell you what we would automate and where to start.",
        "gar": ["Scope in writing", "No lock-in", "The system is yours"],
        "gar_href": "/en/garantias",
    },
}


def build(lang: str = "es"):
    t = T[lang]
    que = "".join(
        f'<li data-r><a href="{h}"><span class="mq-t">{a}</span><span class="mq-d">{b}</span>'
        f'<span class="mq-go" aria-hidden="true"></span></a></li>'
        for a, b, h in t["que"]
    )
    como = "".join(f'<li data-r><h3>{a}</h3><p>{b}</p></li>' for a, b in t["como"])
    gar = "".join(f"<li>{g}</li>" for g in t["gar"])
    main = f"""<section class="mh">
  <div class="mh-text">
    <h1 data-r>{t['h1']}</h1>
    <p class="mh-sub" data-r>{t['sub']}</p>
    <p class="mh-act" data-r><a class="btn btn--big" href="{t['cta'][1]}">{t['cta'][0]}</a></p>
  </div>
  <div class="mh-mark">{mark('mark-xl', anim=True)}</div>
</section>

<section class="ms" aria-labelledby="mq-l">
  <h2 class="ms-l" id="mq-l" data-r>{t['que_l']}</h2>
  <ul class="mq">{que}</ul>
  <p class="ms-more" data-r><a class="link" href="{t['que_mas'][1]}">{t['que_mas'][0]}</a></p>
</section>

<section class="ms" aria-labelledby="mc-l">
  <h2 class="ms-l" id="mc-l" data-r>{t['como_l']}</h2>
  <ol class="mc">{como}</ol>
</section>

<section class="ms mf" aria-labelledby="mf-l">
  <h2 class="ms-l" id="mf-l" data-r>{t['fin_l']}</h2>
  <div class="mf-text" data-r>
    <h3>{t['fin_h']}</h3>
    <p>{t['fin_p']}</p>
    <a class="link" href="{t['fin_a'][1]}">{t['fin_a'][0]}</a>
  </div>
  <figure class="mf-shot" data-r>
    <img src="/assets/img/v9/finance-panel.webp" srcset="/assets/img/v9/finance-panel-960.webp 960w, /assets/img/v9/finance-panel.webp 1920w"
      sizes="(min-width: 1100px) 66vw, 100vw" width="1920" height="1200" loading="lazy" decoding="async" alt="{e(t['fin_alt'])}">
  </figure>
</section>

<section class="me" aria-labelledby="me-h">
  <h2 id="me-h" data-r>{t['end_h']}</h2>
  <p class="mh-sub" data-r>{t['end_p']}</p>
  <p class="mh-act" data-r><a class="btn btn--big" href="{t['cta'][1]}">{t['cta'][0]}</a></p>
  <ul class="mg" data-r>{gar}</ul>
</section>"""
    if lang == "es":
        page("index.html", "index.html", "es", "/", main, "p-home",
             title="D-Code Partners — Automatizamos el trabajo repetitivo de tu empresa",
             description="Vemos cómo trabaja tu empresa y construimos el sistema que hace solo el trabajo repetitivo. Facturas, ventas, atención al cliente e informes. Madrid.")
    else:
        page("en/index.html", "en/index.html", "en", "/en/", main, "p-home",
             title="D-Code Partners — We automate your company's repetitive work",
             description="We look at how your company works and build the system that does the repetitive work on its own. Invoices, sales, support and reports. Madrid.")
