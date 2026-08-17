#!/usr/bin/env python3
"""
Monta la locución sobre un máster ya renderizado.

Coloca cada clip de voz en su segundo exacto —los tiempos se leen de las tablas
de narración de GUION.md / GUION-2.md, que son la única fuente de verdad— y lo
mezcla con la música, que ya viene atenuada en esos tramos. El vídeo no se
recodifica (`-c:v copy`).

Los clips se ordenan por nombre y se emparejan con los fragmentos en ese orden,
así que conviene numerarlos: 01, 02, 03… Valen wav, mp3, m4a, ogg o flac.

    python3 montar-voz.py --anuncio 1 --voces voces/anuncio-1
    python3 montar-voz.py --anuncio 2 --voces voces/anuncio-2 --fmt 16x9
    python3 montar-voz.py --anuncio 1 --voces voces/anuncio-1 --volumen 1.8

Antes de montar avisa si algún clip no cabe en su hueco (invadiría el
siguiente): es el fallo más habitual cuando la voz se genera demasiado lenta.
"""

import argparse
import os
import re
import subprocess
import sys

DIR = os.path.dirname(os.path.abspath(__file__))

ANUNCIOS = {
    '1': dict(guion='GUION.md', cabecera='| Entrada | Salida | Texto |',
              master='out/dcode-anuncio-{fmt}.mp4', dur=40.0),
    '2': dict(guion='GUION-2.md', cabecera='| Entra | Sale | Texto | Cómo |',
              master='out/dcode-ad2-{fmt}.mp4', dur=60.0),
}

AUDIO_EXT = ('.wav', '.mp3', '.m4a', '.aac', '.ogg', '.flac', '.opus')


def ffmpeg_bin():
    for c in (os.environ.get('FFMPEG_PATH'),
              '/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg'):
        if c and os.path.exists(c):
            return c
    try:                                   # ffmpeg-static instalado con npm
        out = subprocess.run(
            ['node', '-e', "process.stdout.write(require('ffmpeg-static'))"],
            capture_output=True, text=True, cwd=DIR)
        if out.returncode == 0 and os.path.exists(out.stdout.strip()):
            return out.stdout.strip()
    except Exception:
        pass
    sys.exit('No se encontró ffmpeg. Instálalo con `npm i ffmpeg-static` '
             'o define FFMPEG_PATH.')


FFMPEG = ffmpeg_bin()


def fragmentos(guion, cabecera):
    """Lee (entrada, salida, texto) de la tabla de narración del guion."""
    src = open(os.path.join(DIR, guion), encoding='utf-8').read()
    i = src.index(cabecera)
    filas = []
    for linea in src[i:].split('\n'):
        if not linea.startswith('|'):
            if filas:
                break
            continue
        c = [x.strip() for x in linea.strip('|').split('|')]
        if len(c) < 3 or not re.match(r'^\d+,\d+$', c[0]):
            continue
        texto = re.sub(r'\*\(.*?\)\*', '', c[2]).strip()
        filas.append((float(c[0].replace(',', '.')),
                      float(c[1].replace(',', '.')),
                      re.sub(r'\s+', ' ', texto)))
    return filas


def duracion(path):
    """Duración en segundos, leída de la salida de ffmpeg."""
    p = subprocess.run([FFMPEG, '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.?\d*)', p.stderr)
    if not m:
        sys.exit(f'No se pudo leer la duración de {path}')
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--anuncio', choices=('1', '2'), required=True)
    ap.add_argument('--voces', required=True,
                    help='carpeta con los clips, numerados por orden')
    ap.add_argument('--fmt', default='9x16', choices=('9x16', '16x9'))
    ap.add_argument('--volumen', type=float, default=1.6,
                    help='ganancia de la voz sobre la música (por defecto 1,6)')
    ap.add_argument('--salida', default=None)
    ap.add_argument('--forzar', action='store_true',
                    help='monta aunque algún clip se salga de su hueco')
    a = ap.parse_args()

    cfg = ANUNCIOS[a.anuncio]
    frags = fragmentos(cfg['guion'], cfg['cabecera'])
    master = os.path.join(DIR, cfg['master'].format(fmt=a.fmt))
    if not os.path.exists(master):
        sys.exit(f'No existe el máster {master}. Renderízalo antes.')

    carpeta = a.voces if os.path.isabs(a.voces) else os.path.join(DIR, a.voces)
    clips = sorted(f for f in os.listdir(carpeta) if f.lower().endswith(AUDIO_EXT))
    if len(clips) != len(frags):
        sys.exit(f'Hay {len(clips)} clips y el anuncio {a.anuncio} tiene '
                 f'{len(frags)} fragmentos. Deben coincidir y estar numerados '
                 f'por orden.\nEsperados:\n' +
                 '\n'.join(f'  {i+1:02d}. {t}' for i, (_, _, t) in enumerate(frags)))

    print(f'Anuncio {a.anuncio} · {a.fmt} · {len(clips)} fragmentos\n')
    problemas = []
    rutas = []
    for i, (clip, (ent, sal, texto)) in enumerate(zip(clips, frags), 1):
        ruta = os.path.join(carpeta, clip)
        d = duracion(ruta)
        hueco = sal - ent
        # margen real: hasta que entra el siguiente fragmento
        siguiente = frags[i][0] if i < len(frags) else cfg['dur']
        margen = siguiente - ent
        estado = 'ok'
        if d > margen:
            estado = f'SE SOLAPA (+{d - margen:.2f}s)'
            problemas.append((i, texto, d, margen))
        elif d > hueco:
            estado = f'se pasa del hueco pero cabe (+{d - hueco:.2f}s)'
        print(f'  {i:02d}. {ent:6.2f}s  clip {d:5.2f}s / hueco {hueco:5.2f}s  {estado}')
        print(f'      {texto[:78]}')
        rutas.append((ruta, ent))

    if problemas and not a.forzar:
        print('\nAlgún clip invade el fragmento siguiente:')
        for i, texto, d, margen in problemas:
            print(f'  {i:02d}. dura {d:.2f}s y solo hay {margen:.2f}s → {texto[:60]}')
        print('\nGenera esos fragmentos algo más rápidos, o monta igualmente '
              'con --forzar si prefieres corregirlo en la edición.')
        sys.exit(1)

    salida = a.salida or master.replace('.mp4', '-vo.mp4')

    # Cada voz se retrasa a su entrada; luego se suman entre sí y se mezclan
    # con el audio del máster, que ya está atenuado bajo estos tramos.
    entradas, filtros, etiquetas = [], [], []
    for n, (ruta, ent) in enumerate(rutas, start=1):
        entradas += ['-i', ruta]
        ms = int(round(ent * 1000))
        filtros.append(f'[{n}:a]aresample=44100,adelay={ms}|{ms}[v{n}]')
        etiquetas.append(f'[v{n}]')
    filtros.append(''.join(etiquetas) +
                   f'amix=inputs={len(rutas)}:normalize=0,'
                   f'volume={a.volumen}[voz]')
    filtros.append('[0:a][voz]amix=inputs=2:duration=first:normalize=0[a]')

    cmd = [FFMPEG, '-y', '-loglevel', 'error', '-i', master] + entradas + [
        '-filter_complex', ';'.join(filtros),
        '-map', '0:v', '-map', '[a]',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2',
        '-movflags', '+faststart', salida]

    print(f'\nmontando → {salida}')
    r = subprocess.run(cmd)
    if r.returncode != 0:
        sys.exit('ffmpeg falló al montar.')
    mb = os.path.getsize(salida) / 1048576
    print(f'listo ({mb:.2f} MB)')


if __name__ == '__main__':
    main()
