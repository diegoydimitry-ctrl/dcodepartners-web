#!/usr/bin/env python3
"""
Genera la locución de un anuncio con Kokoro local (vía `npx hyperframes tts`) y
la deja lista, numerada, para `montar-voz.py`.

No es el flujo por defecto — es el que se usa SOLO si, tras escuchar las
pruebas, se decide adoptar Kokoro. Lee los mismos fragmentos que ya usa
`montar-voz.py` (la tabla de narración de GUION.md / GUION-2.md), así que los
tiempos nunca se duplican a mano.

Uso:
    python3 tools/generar-locucion-kokoro.py --anuncio 1 --voz em_alex --out voces/anuncio-1
    python3 tools/generar-locucion-kokoro.py --anuncio 2 --voz em_alex --out voces/anuncio-2 --speed 1.1

Requiere: `npx hyperframes tts` (Kokoro local) y, para español, `espeak-ng`
instalado en el sistema (fonemizador). La primera llamada por voz descarga
~27 MB de datos del modelo.
"""

import argparse
import os
import re
import subprocess
import sys

DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ANUNCIOS = {
    '1': ('GUION.md', '| Entrada | Salida | Texto |'),
    '2': ('GUION-2.md', '| Entra | Sale | Texto | Cómo |'),
    '4': ('GUION-4.md', '| Entrada | Salida | Texto |'),
}


def fragmentos(guion, cabecera):
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


def duracion(path, ffmpeg):
    p = subprocess.run([ffmpeg, '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration:\s*(\d+):(\d+):(\d+\.?\d*)', p.stderr)
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def ffmpeg_bin():
    for c in (os.environ.get('FFMPEG_PATH'), '/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg'):
        if c and os.path.exists(c):
            return c
    out = subprocess.run(['node', '-e', "process.stdout.write(require('ffmpeg-static'))"],
                          capture_output=True, text=True, cwd=DIR)
    if out.returncode == 0 and os.path.exists(out.stdout.strip()):
        return out.stdout.strip()
    sys.exit('No se encontró ffmpeg. Define FFMPEG_PATH.')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--anuncio', choices=('1', '2', '4'), required=True)
    ap.add_argument('--voz', default='em_alex', help='ID de voz Kokoro (por defecto em_alex, hombre)')
    ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--out', required=True, help='carpeta donde dejar 01.wav, 02.wav…')
    a = ap.parse_args()

    ffmpeg = ffmpeg_bin()
    guion, cabecera = ANUNCIOS[a.anuncio]
    frags = fragmentos(guion, cabecera)

    out_dir = a.out if os.path.isabs(a.out) else os.path.join(DIR, a.out)
    os.makedirs(out_dir, exist_ok=True)

    print(f'Anuncio {a.anuncio} · voz {a.voz} · velocidad {a.speed} · {len(frags)} fragmentos\n')
    huecos_superados = []

    for i, (ent, sal, texto) in enumerate(frags, 1):
        dest = os.path.join(out_dir, f'{i:02d}.wav')
        cmd = ['npx', '--yes', 'hyperframes', 'tts', texto,
               '--voice', a.voz, '--speed', str(a.speed), '-o', dest]
        r = subprocess.run(cmd, capture_output=True, text=True, cwd=DIR)
        if r.returncode != 0 or not os.path.exists(dest):
            print(f'  {i:02d}. FALLO: {texto[:60]}')
            print(r.stderr.strip()[-400:])
            sys.exit(1)
        d = duracion(dest, ffmpeg)
        hueco = sal - ent
        estado = 'ok' if d <= hueco * 1.05 else f'SUPERA EL HUECO (+{d - hueco:.2f}s)'
        if d > hueco * 1.05:
            huecos_superados.append((i, texto, d, hueco))
        print(f'  {i:02d}. {d:5.2f}s / hueco {hueco:5.2f}s   {estado}')
        print(f'      {texto[:78]}')

    print(f'\n{len(frags)} clips en {out_dir}')
    if huecos_superados:
        print('\nAvisa antes de montar — estos fragmentos no caben en su hueco original:')
        for i, texto, d, hueco in huecos_superados:
            print(f'  {i:02d}. {d:.2f}s vs {hueco:.2f}s de hueco → {texto[:70]}')
        print('Opciones: acortar el texto, ensanchar la ventana en el guion, o subir '
              '--speed (con cuidado: por encima de ~1.2x Kokoro empieza a sonar forzado).')


if __name__ == '__main__':
    main()
