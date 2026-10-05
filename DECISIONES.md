# DECISIONES.md — Portafolio personal

Documento de decisiones del proyecto integrador del Capítulo 1: Portales Web.

## Secciones del sitio

| Sección | Contenido | Por qué |
| --- | --- | --- |
| Inicio (hero) | Nombre, cargo, descripción, foto, enlaces de contacto y acciones | Es lo primero que ve un reclutador; debe responder en 5 segundos "quién soy y qué hago" |
| Sobre mí | 2 párrafos con mi formación, mis sistemas reales (POS, asistente de voz, app self-hosted) y mi forma de trabajar | Muestra que no solo hago ejercicios de clase: construyo proyectos que uso de verdad |
| Habilidades | Tecnologías por categoría: Frontend, Backend, Herramientas | Organiza lo que sé para que sea fácil de leer de un vistazo |
| Proyectos | 4 proyectos propios con imagen, descripción, tecnologías y enlace | El corazón del portafolio; solo proyectos donde yo tomé las decisiones |
| Formación | Trayectoria académica en orden cronológico inverso | Muestra contexto: soy estudiante del CECyT No. 3 del IPN |
| Contacto | Formulario validado + correo y GitHub | Cierra el ciclo: después de ver mi trabajo, que puedan escribirme |
| Extras (aside) | Mis cursos favoritos y una tarjeta "Fuera del código" | Da contexto humano sin alargar las secciones principales |

## Paleta de colores

Heredada de mi práctica 1.6 (actividad-1.6), donde ya la verifiqué con WebAIM Contrast Checker.

| Variable | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--color-primario` | #0569a8 | #7cc0f0 | Títulos de sección, enlaces, botones |
| `--color-fondo` | #f8fafc | #0f172a | Fondo general |
| `--color-tarjeta` | #ffffff | #1e293b | Tarjetas, header, footer |
| `--color-texto` | #0f172a | #f1f5f9 | Texto principal |
| `--color-texto-muted` | #475569 | #94a3b8 | Texto secundario |
| `--color-borde` | #cbd5e1 | #334155 | Bordes de tarjetas e inputs |
| `--color-focus` | #ea580c | #fb923c | Anillo de foco visible |

Por qué esta paleta: el azul #0569a8 da confianza y es el color institucional de mi escuela (IPN); sobre blanco tiene contraste de 6.1:1 (WCAG AA y AAA). El naranja de foco contrasta con el azul para que nunca se confunda el foco con un enlace normal. El modo oscuro solo cambia las variables: con 2 líneas de CSS todo el sitio se invierte.

## Tipografía

- **Inter** (400, 500, 600, 700, 800): fuente de lectura, moderna y legible en pantalla; la misma que ya uso en mis prácticas.
- **JetBrains Mono** (400, 600): para etiquetas de tecnología, fechas y citas; le da el toque "de programador".

Se cargan desde Google Fonts con carga no bloqueante (media="print" + onload) para no penalizar el Lighthouse Performance. La fuente del sistema queda como respaldo.

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
- Open Graph (og:title, og:description, og:image) para que el enlace se vea bien al compartirlo en redes.

## Despliegue

GitHub Pages desde un repositorio dedicado, porque es gratis, no requiere cuenta extra y deja el código visible como parte del portafolio.

## Decisiones que tomé conscientemente

- **Sin frameworks JS:** el portafolio usa HTML/CSS/JS vanilla para demostrar que entiendo los fundamentos.
- **Sin contenido inventado:** todos los proyectos son reales y los construí yo; el texto de "Sobre mí" describe mis sistemas reales (POS, asistente de voz, app self-hosted) que cualquiera puede verificar en mi GitHub.
- **4 proyectos, no 6:** prefiero pocos proyectos bien hechos y que pueda explicar en una entrevista.