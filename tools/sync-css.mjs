#!/usr/bin/env node
/**
 * Genera el bloque CSS inline de index.html.
 *
 * Los 7 archivos de css/ son la ÚNICA fuente de verdad (así lo pide el tema).
 * El CSS de pantalla se sirve inline para que el primer pintado no espere su
 * descarga; este script lo regenera desde los archivos para que nunca se
 * desincronicen. No edites el bloque inline de index.html a mano: corre
 * `node tools/sync-css.mjs` después de cambiar cualquier archivo de css/.
 *
 * Uso:  node tools/sync-css.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

const ARCHIVOS = [
  '00-reset.css',
  '01-variables.css',
  '02-tipografia.css',
  '03-layout.css',
  '04-componentes.css',
  '05-utilidades.css',
  '06-responsive.css',
];

const MARCA_INICIO = '/* CSS-INLINE:START';
const MARCA_FIN = '/* CSS-INLINE:END */';
const SANGRIA = '        ';

/** Minificado conservador: quita comentarios y espacios sobrantes del CSS. */
function minificar(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};:,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const partes = [readFileSync(join(raiz, 'fonts', 'fuentes.css'), 'utf8')];
for (const archivo of ARCHIVOS) {
  partes.push(readFileSync(join(raiz, 'css', archivo), 'utf8'));
}

const css = minificar(partes.join('\n'))
  // El CSS inline vive en index.html (raíz), no dentro de css/: se ajustan las rutas.
  .replace(/url\('\.\.\/img\//g, "url('img/")
  .replace(/url\("\.\.\/img\//g, 'url("img/');

const bloque =
  `${MARCA_INICIO} — generado por tools/sync-css.mjs desde css/*.css; no editar a mano */\n` +
  `${SANGRIA}${css}\n` +
  `${SANGRIA}${MARCA_FIN}`;

const rutaHtml = join(raiz, 'index.html');
const html = readFileSync(rutaHtml, 'utf8');
const inicio = html.indexOf(MARCA_INICIO);
const fin = html.indexOf(MARCA_FIN);

if (inicio === -1 || fin === -1) {
  console.error('✗ No encontre los marcadores CSS-INLINE en index.html');
  process.exit(1);
}

writeFileSync(rutaHtml, html.slice(0, inicio) + bloque + html.slice(fin + MARCA_FIN.length));
console.log(
  `✓ CSS inline regenerado: ${css.length} caracteres ` +
    `(${ARCHIVOS.length} archivos de css/ + fonts/fuentes.css)`,
);
