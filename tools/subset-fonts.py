#!/usr/bin/env python3
"""Recorta las fuentes de fonts/ para que pesen menos.

Que hace:
  1. Subset: deja solo los caracteres que usa el sitio (ASCII + Latin-1 completo,
     que cubre todo el espanol, mas comillas tipograficas, guiones largos,
     puntos suspensivos, euro, flechas y la palomita).
  2. Instancia parcial del eje de pesos: lo limita a 400-800, que es lo que usa
     el diseno, sin perder ningun peso real.
  3. Tira las tablas que no se usan al renderizar:
       - FFTM, BASE, STAT: metadatos (marca de tiempo de FontForge, linea base, ejes).
       - ccmp, locl: composicion de acentos combinantes y variantes por idioma;
         el texto usa acentos precompuestos y es Spanish, no hacen falta.
       - Para la monoespaciada, ademas GSUB completo: sus ligaduras de
         programacion viven en ss01 y el CSS no las activa, asi que son peso muerto.

Resultado medido: Inter 47.1 -> 24.5 KB, JetBrains Mono 39.5 -> 13.3 KB
(86.6 -> 37.8 KB en total, con todos los pesos 400-800 exactos y el mismo render).

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
    + list(range(0xA0, 0x100))   # Latin-1: acentos, n con virgulilla, signos invertidos
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

# (archivo, caracteristicas de layout que se conservan, tablas extra que se tiran)
FUENTES = [
    ('Inter-var.woff2', ['kern', 'liga', 'clig', 'calt'], ['ccmp', 'locl']),
    ('JetBrainsMono-var.woff2', ['kern'], ['ccmp', 'locl', 'GDEF', 'GSUB']),
]

TABLAS_METADATOS = ['DSIG', 'FFTM', 'BASE', 'STAT']


def recortar(archivo: str, features: list[str], extra: list[str]) -> tuple[int, int]:
    ruta = os.path.join(RAIZ, 'fonts', archivo)
    antes = os.path.getsize(ruta)

    fuente = TTFont(ruta)

    opciones = subset.Options()
    opciones.flavor = None
    opciones.layout_features = features
    opciones.name_IDs = ['*']
    opciones.notdef_outline = True
    opciones.drop_tables += TABLAS_METADATOS + extra

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
    for archivo, _, _ in FUENTES:
        if not os.path.isfile(os.path.join(RAIZ, 'fonts', archivo)):
            print(f'✗ no encuentro fonts/{archivo}', file=sys.stderr)
            return 1

    total_antes = total_despues = 0
    for archivo, features, extra in FUENTES:
        antes, despues = recortar(archivo, features, extra)
        total_antes += antes
        total_despues += despues
        print(f'✓ {archivo:26} {antes / 1024:6.1f} KB -> {despues / 1024:6.1f} KB')
    print(f'  {"TOTAL":26} {total_antes / 1024:6.1f} KB -> {total_despues / 1024:6.1f} KB')
    print('\nRecuerda: node tools/sync-css.mjs si cambiaste fonts/fuentes.css')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
