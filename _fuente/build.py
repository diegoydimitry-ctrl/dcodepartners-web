#!/usr/bin/env python3
"""Expande {{img nombre | sizes | alt | clase | loading}} en <img srcset> con los anchos generados."""
import re, os, glob, sys
B=os.path.dirname(os.path.abspath(__file__))
def anchos(site,n):
    fs=glob.glob(f'{B}/sitio/{site}/img/{n}-*.webp')
    ws=sorted(int(m.group(1)) for f in fs for m in [re.fullmatch(re.escape(n)+r'-(\d+)\.webp',os.path.basename(f))] if m)
    if not ws: sys.exit(f'falta imagen {site}/{n}')
    return ws
def alto(site,n,w):
    from PIL import Image
    return Image.open(f'{B}/sitio/{site}/img/{n}-{w}.webp').size[1]
def expand(site,html):
    def rep(m):
        p=[x.strip() for x in m.group(1).split('|')]
        n,sizes,alt=p[0],p[1],p[2]; cls=p[3] if len(p)>3 else ''; load=p[4] if len(p)>4 else 'lazy'
        ws=anchos(site,n); src=f'img/{n}-{ws[0] if len(ws)==1 else ws[min(1,len(ws)-1)]}.webp'
        w0=ws[-1]; h0=alto(site,n,w0)
        ss=', '.join(f'img/{n}-{w}.webp {w}w' for w in ws)
        extra=' fetchpriority="high"' if load=='eager' else ''
        c=f' class="{cls}"' if cls else ''
        return f'<img{c} src="{src}" srcset="{ss}" sizes="{sizes}" width="{w0}" height="{h0}" alt="{alt}" loading="{load}" decoding="async"{extra}>'
    return re.sub(r'\{\{img (.+?)\}\}',rep,html)
for site in sys.argv[1:]:
    h=open(f'{B}/src/{site}.html',encoding='utf-8').read()
    open(f'{B}/sitio/{site}/index.html','w',encoding='utf-8').write(expand(site,h))
    print('ok',site)
