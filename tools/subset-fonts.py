#!/usr/bin/env python3
"""Recorta las fuentes de fonts/ para que pesen menos.

Que hace:
  1. Subset: deja solo los caracteres que usa el sitio (ASCII + Latin-1 completo,
     que cubre todo el espanol, mas comillas tipograficas, guiones largos,
     puntos suspensivos, euro, flechas y la palomita).
  2. Instancia parcial del eje de pesos: lo limita a 400-800, que es lo que usa
     el diseno, sin perder ningun peso real.

Resultado medido: Inter 47.1 -> 24.8 KB, JetBrains Mono 39.5 -> 28.1 KB.

Uso:
    python3 -m venv /tmp/fv && /tmp/fv/bin/pip install fonttools brotli
    /tmp/fv/bin/python tools/subset-fonts.py

Si el navegador necesitara algun caracter que no este en el subconjunto,
lo toma de la fuente del sistema (solo ese caracter), asi que no se rompe.
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PESOS = (400, 800)  # rango del eje de pesos que usa el sitio

UNICODES = (
    list(range(0x20, 0x7F))      # ASCII imprimible
    + list(range(0xA0, 0x100))   # Latin-1: cubre acentos, n con virgulilla, invertedos
    + [
        0x2013, 0x2014,          # guion medio y guion largo
        0x2018, 0x2019,          # comillas simples curvas
        0x201C, 0x201D,          # comillas dobles curvas
        0x2022, 0x2026,          # vinetas, puntos suspensivos
        0x2039, 0x203A,          # comillas angulares
        0x20AC,                  # euro
        0x2190, 0x2191, 0x2192, 0x2193,  # flechas
        0x2212,                  # signo menos
        0x2713,                  # palomita
    ]
)


def recortar(ruta: str) -> tuple[int, int]:
    antes = os.path.getsize(ruta)
    fuente = TTFont(ruta)

    opciones = subset.Options()
    opciones.flavor = None
    opciones.layout_features = ['kern', 'liga', 'clig', 'calt', 'ccmp', 'locl']
    opciones.name_IDs = ['*']
    opciones.notdef_outline = True
    opciones.drop_tables += ['DSIG']

    recortador = subset.Subsetter(options=opciones)
    recortador.populate(unicodes=UNICODES)
    recortador.subset(fuente)

    instancer.instantiateVariableFont(
        fuente, {'wght': PESOS}, inplace=True, updateFontNames=False
    )

    fuente.flavor = 'woff2'
    fuente.save(ruta)
    return antes, os.path.getsize(ruta)


def main() -> int:
    fuentes = [
        os.path.join(RAIZ, 'fonts', 'Inter-var.woff2'),
        os.path.join(RAIZ, 'fonts', 'JetBrainsMono-var.woff2'),
    ]
    for ruta in fuentes:
        if not os.path.isfile(ruta):
            print(f'✗ no encuentro {ruta}', file=sys.stderr)
            return 1
    for ruta in fuentes:
        antes, despues = recortar(ruta)
        print(
            f'✓ {os.path.basename(ruta):26} {antes / 1024:6.1f} KB -> {despues / 1024:6.1f} KB'
        )
    print('\nRecuerda: node tools/sync-css.mjs si cambiaste fonts/fuentes.css')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
