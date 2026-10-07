# DECISIONES.md — Portafolio personal

Documento de decisiones del proyecto integrador del Capítulo 1: Portales Web.

## Secciones del sitio

| Sección | Contenido | Por qué |
| --- | --- | --- |
| Inicio (hero) | Nombre, cargo, descripción, foto, enlaces de contacto y acciones | Es lo primero que ve un reclutador; debe responder en 5 segundos "quién soy y qué hago" |
| Sobre mí | 2 párrafos con mi formación, mis sistemas reales (POS, asistente de voz, app self-hosted) y mi forma de trabajar | Muestra que no solo hago ejercicios de clase: construyo proyectos que uso de verdad |
| Habilidades | Tecnologías por categoría: Frontend, Backend, Herramientas | Organiza lo que sé para que sea fácil de leer de un vistazo |
| Proyectos | 4 proyectos propios con imagen, descripción, tecnologías y enlace a GitHub | El corazón del portafolio; los más recientes: clon de Astra AI, generador de audiolibros, FoodYou + Foto IA y sistema POS |
| Formación | Trayectoria académica en orden cronológico inverso | Muestra contexto: soy estudiante del CECyT No. 3 del IPN |
| Contacto | Formulario validado + correo y GitHub | Cierra el ciclo: después de ver mi trabajo, que puedan escribirme |
| Extras (aside) | Mis cursos favoritos y una tarjeta "Fuera del código" | Da contexto humano sin alargar las secciones principales |

## Paleta de colores

Rediseñada como tema oscuro por defecto, inspirado en una referencia visual de perfil de desarrollador minimalista (fondo carbón, un solo acento intenso, botones redondos).

| Variable | Oscuro | Claro | Uso |
| --- | --- | --- | --- |
| `--color-primario` | #ff4da6 | #a70d69 | Títulos de sección, enlaces, botones |
| `--color-fondo` | #17181c | #f7f7f9 | Fondo general |
| `--color-tarjeta` | #1e1e24 | #ffffff | Tarjetas, header, perfiles |
| `--color-texto` | #e5e7eb | #1f2328 | Texto principal |
| `--color-texto-muted` | #9ca3af | #5b6470 | Texto secundario |
| `--color-borde` | rgba(255,255,255,.09) | rgba(15,23,42,.10) | Bordes de tarjetas e inputs |
| `--color-focus` | #ffd166 | #ea580c | Anillo de foco visible |

Por qué esta paleta: el magenta #ff4da6 es el acento único de la referencia y da la identidad visual; el carbón #17181c hace que el acento y la portada destaquen. Todos los pares de texto pasan WCAG AA (verificado 5.0:1 mínimo). El modo claro conserva el mismo magenta (más oscuro para mantener contraste). El cambio claro/oscuro solo cambia variables: con 2 líneas de CSS todo el sitio se invierte.

## Tipografía

- **Inter** (400 a 800, variable): fuente de lectura, moderna y legible en pantalla; la misma que ya uso en mis prácticas.
- **JetBrains Mono** (400 a 800, variable): para etiquetas de tecnología, fechas y citas; le da el toque "de programador".

Se sirven **desde el propio sitio** (`fonts/`), no desde Google Fonts: sin DNS ni
TLS de terceros y con `preload` de la fuente de texto para que no cambie de
tipografía después del primer pintado. Son fuentes variables recortadas con
`tools/subset-fonts.py`: solo el juego de caracteres que usa el sitio
(Latin-1 completo, que cubre todo el español, más comillas tipográficas y
guiones largos) y el eje de pesos limitado a 400-800. Pasan de 86.6 KB a
52.9 KB en 2 archivos, y los pesos 600 y 700 siguen siendo exactos (no
sintetizados).

## Layout

- **Grid (macrolayout):** la página es una cuadrícula `1fr 300px` en escritorio: columna de contenido + columna de extras (aside). En móvil se apila a 1 columna.
- **Flexbox (microlayout):** navegación, hero, tarjetas de pasatiempos, formulario y pie de página.
- **Mobile-first con 4 breakpoints:** 640px (tabletas chicas), 860px (menú hamburguesa → menú horizontal), 1024px (dos columnas), 1280px (tipografía más grande).
- **Sticky header** para que la navegación siempre esté disponible, con `scroll-margin-top` para que los anclajes no queden ocultos detrás de él.

## JavaScript

Solo vanilla, sin frameworks, porque el Capítulo 1 es sobre fundamentos.

1. **Menú hamburguesa:** toggles de clase + `aria-expanded`, se cierra con Escape y al elegir una sección.
2. **Modo oscuro:** detecta `prefers-color-scheme`, permite alternar con un botón y guarda la preferencia en `localStorage`. Cambia solo variables CSS.
3. **Scroll suave:** `scrollIntoView({ behavior: 'smooth' })` en los enlaces del menú; respeta `prefers-reduced-motion`.
4. **Formulario de contacto:** validación (nombre ≥ 2 letras, formato de correo, mensaje ≥ 10 caracteres), mensajes de error por campo, `aria-invalid` y mensaje de éxito en una región `aria-live`.
5. **fetch:** los proyectos se cargan desde `data/proyectos.json` y se renderizan como tarjetas, para demostrar peticiones asíncronas.

## Accesibilidad (WCAG AA)

- Skip link al inicio para saltar la navegación.
- Jerarquía de encabezados correcta (h1 único, h2 por sección, h3 en tarjetas).
- Contraste mínimo 4.5:1 verificado en todas las combinaciones.
- Foco visible naranja en todos los elementos interactivos.
- `alt` descriptivo en todas las imágenes.
- Formulario con `label` asociado y región `aria-live` para feedback.
- Probado con teclado: Tab, Enter, Escape.

## SEO

- Title y meta description únicos.
- `rel="canonical"` apuntando a la URL final del sitio.
- Open Graph (og:title, og:description, og:image) para que el enlace se vea bien al compartirlo en redes.
- `robots.txt` y `sitemap.xml` en la raíz del sitio.

## Rendimiento (Lighthouse)

Puntaje objetivo: 100 en las cuatro categorías. Lo que se ajustó y por qué:

| Cambio | Problema que resolvía |
| --- | --- |
| El tema claro/oscuro se decide con un `<script>` inline en la cabecera | Con `app.js` (carga diferida) la página pintaba en oscuro y **cambiaba de tema después del primer pintado**: eso dispara el Speed Index aunque el FCP sea bueno |
| Fuentes propias, preload y subconjunto | Las fuentes de Google venían de otro origen (DNS + TLS extra) y entraban **después** del primer pintado, volviendo a maquetar todo el texto |
| Los 7 archivos CSS dejan de re-aplicarse en pantalla | El CSS inline y los 7 archivos tenían **el mismo contenido**: se aplicaba dos veces y forzaba un segundo recálculo de estilos y layout de toda la página |
| Brillo del banner horneado en el webp | Un `filter` de CSS sobre el elemento LCP obliga a un paso extra de pintado |
| Imágenes de proyecto en WebP | 35 KB -> 22 KB sin diferencia visible |

Los dos scripts que mantienen esto sano:

- `node tools/sync-css.mjs` — regenera el bloque CSS inline desde `css/*.css`
  (que siguen siendo la única fuente de verdad).
- `python3 tools/subset-fonts.py` — regenera las fuentes recortadas.

## Despliegue

GitHub Pages desde un repositorio dedicado, porque es gratis, no requiere cuenta extra y deja el código visible como parte del portafolio.

## Decisiones que tomé conscientemente

- **Sin frameworks JS:** el portafolio usa HTML/CSS/JS vanilla para demostrar que entiendo los fundamentos.
- **Sin contenido inventado:** todos los proyectos son reales y los construí yo; el texto de "Sobre mí" describe mis sistemas reales (clon de Astra AI, audiolibros con TTS local, FoodYou con visión por IA, sistema POS) que cualquiera puede verificar en mi GitHub.
- **4 proyectos, no 6:** prefiero pocos proyectos bien hechos y que pueda explicar en una entrevista; incluyo los más recientes donde tomé decisiones reales de arquitectura.
- **CSS crítico inline:** el CSS de pantalla va dentro del HTML para que el primer dibujado no espere a descargar los 7 archivos CSS (bajó el FCP de 2.8 s a 0.8 s en móvil con 4G lento). Los 7 archivos siguen existiendo y enlazados; para que no vuelvan a aplicarse sobre el mismo CSS y fuercen un segundo recálculo de toda la página, se enlazan como hoja de impresión, y el bloque inline se regenera desde ellos con `node tools/sync-css.mjs` para que nunca se desincronicen.
