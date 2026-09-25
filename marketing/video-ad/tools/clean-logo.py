#!/usr/bin/env python3
"""
Extrae el logotipo de D-Code Partners sobre fondo transparente real.

assets/logo/dcode-icon-sm.png trae una plancha negra semitransparente
(rgba 0,0,0,62 ≈ 24 %) que cubre todo el lienzo. Sobre la cabecera casi negra
de la web no se nota, pero en el cierre del anuncio —azul marino con
resplandor— aparece como un recuadro oscuro alrededor de la marca.

Este script NO redibuja el logotipo: deshace la composición. Si la imagen es
    Co·Ao = Cm·Am        y      Ao = Am + p·(1 − Am)
con p = 62/255, entonces
    Am = (Ao − p) / (1 − p)      y      Cm = Co·Ao / Am
lo que devuelve exactamente los píxeles originales de la marca.

Uso:  python3 tools/clean-logo.py ../../assets/logo/dcode-icon-sm.png assets/dcode-mark.png
"""

import struct
import sys
import zlib

PLATE = 62 / 255.0          # opacidad de la plancha negra a eliminar


def read_png(path):
    d = open(path, 'rb').read()
    assert d[:8] == b'\x89PNG\r\n\x1a\n', 'no es un PNG'
    pos, idat, ihdr = 8, b'', None
    while pos < len(d):
        ln = struct.unpack('>I', d[pos:pos + 4])[0]
        typ = d[pos + 4:pos + 8]
        data = d[pos + 8:pos + 8 + ln]
        if typ == b'IHDR':
            ihdr = struct.unpack('>IIBBBBB', data)
        elif typ == b'IDAT':
            idat += data
        pos += 12 + ln
    w, h, bd, ct = ihdr[0], ihdr[1], ihdr[2], ihdr[3]
    assert (bd, ct) == (8, 6), f'se esperaba RGBA de 8 bits, se recibió bd={bd} ct={ct}'

    raw = zlib.decompress(idat)
    stride = w * 4
    out, prev, p = bytearray(), bytearray(stride), 0
    for _ in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p + stride]); p += stride
        for x in range(stride):
            a = line[x - 4] if x >= 4 else 0
            b = prev[x]
            c = prev[x - 4] if x >= 4 else 0
            if f == 1:   line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out += line
        prev = line
    return w, h, out


def unplate(w, h, px):
    out = bytearray(len(px))
    for i in range(w * h):
        r, g, b, a = px[i * 4:i * 4 + 4]
        ao = a / 255.0
        am = (ao - PLATE) / (1.0 - PLATE)
        if am <= 0.0018:                       # solo era plancha
            out[i * 4:i * 4 + 4] = bytes(4)
            continue
        am = min(1.0, am)
        k = ao / am                            # Cm = Co·Ao/Am
        out[i * 4 + 0] = min(255, round(r * k))
        out[i * 4 + 1] = min(255, round(g * k))
        out[i * 4 + 2] = min(255, round(b * k))
        out[i * 4 + 3] = round(am * 255)
    return out


def write_png(path, w, h, px):
    stride = w * 4
    raw = bytearray()
    for y in range(h):                          # sin filtrar (tipo 0)
        raw.append(0)
        raw += px[y * stride:(y + 1) * stride]

    def chunk(typ, data):
        c = struct.pack('>I', len(data)) + typ + data
        return c + struct.pack('>I', zlib.crc32(typ + data) & 0xFFFFFFFF)

    png = (b'\x89PNG\r\n\x1a\n'
           + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
           + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
           + chunk(b'IEND', b''))
    open(path, 'wb').write(png)


if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else '../../assets/logo/dcode-icon-sm.png'
    dst = sys.argv[2] if len(sys.argv) > 2 else 'assets/dcode-mark.png'
    w, h, px = read_png(src)
    clean = unplate(w, h, px)
    write_png(dst, w, h, clean)
    opaque = sum(1 for i in range(w * h) if clean[i * 4 + 3] > 8)
    print(f'{src} → {dst}  ({w}×{h}, {opaque} px de marca, plancha eliminada)')
