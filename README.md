# Sitio web de María Latuff · AI Product Builder

Documento de **handoff** para el equipo de desarrollo frontend. Resume el proyecto, su stack, estructura, componentes, especificaciones de diseño y lo que queda por integrar.

> La guía de mantenimiento día a día está en **[docs/DOCUMENTACION.md](docs/DOCUMENTACION.md)**: cómo editar textos, crear animaciones, agregar proyectos, escribir recorridos animados y publicar. Este README es la vista general; esa guía, el detalle.

---

## Índice

1. [Resumen del proyecto y stack técnico](#1-resumen-del-proyecto-y-stack-técnico)
2. [Estructura de carpetas y archivos](#2-estructura-de-carpetas-y-archivos)
3. [Instalación, entorno y comandos](#3-instalación-entorno-y-comandos)
4. [Inventario de componentes de UI](#4-inventario-de-componentes-de-ui)
5. [Especificaciones de diseño](#5-especificaciones-de-diseño)
6. [Puntos de integración pendientes](#6-puntos-de-integración-pendientes)
7. [Notas para el equipo](#7-notas-para-el-equipo)

---

## 1. Resumen del proyecto y stack técnico

### Qué es

Portafolio personal de María Latuff (AI Product Builder, Chile). Es un sitio estático de una sola página (SPA), en español, que hoy se muestra **solo en modo oscuro**.

| Sección | Ruta | Contenido |
| --- | --- | --- |
| Home | `/` | Hero con hilos y firma animada, soluciones, carrusel de proyectos, testimonios, footer grande |
| Conóceme | `/conoceme` | Historia, pilares, mentalidad y foto |
| Soluciones | `/mi-oferta` | Servicios con ilustraciones de línea animadas |
| Proyectos | `/proyectos` | Listado en cards |
| Detalle de proyecto | `/proyectos/:slug` | Casos **Bloo**, **PUMA Recruiter** y **Datamedy**, con recorridos animados de producto |
| Trabajemos juntos | `/trabajemos-juntos` | Formulario de contacto con envío por correo |
| Contacto | `/contacto` | Página del diseño anterior; no está en el menú |

No hay backend ni base de datos. Todo el contenido está en `src/content/site.js`, y el formulario envía a un servicio externo (FormSubmit).

### Stack exacto (versiones instaladas, `package-lock.json`)

| Paquete | Versión | Rol |
| --- | --- | --- |
| `react` / `react-dom` | 18.3.1 | UI |
| `react-router-dom` | 6.30.6 | Rutas (`BrowserRouter`; `MemoryRouter` solo para `build:share`) |
| `vite` | 5.4.21 | Servidor de desarrollo y build |
| `@vitejs/plugin-react` | 4.7.0 | JSX / Fast Refresh |
| `tailwindcss` | 3.4.19 | Estilos utilitarios |
| `postcss` / `autoprefixer` | 8.5.32 / 10.6.2 | Procesamiento de CSS |
| `sharp` | 0.35.5 | (dev) utilidad de imágenes; no se usa en runtime |

- **Lenguaje:** JavaScript con JSX, módulos ES (`"type": "module"`). Sin TypeScript, sin linter configurado y sin tests.
- **Fuentes:**
  - **Caveat**: archivo local `src/assets/fonts/Caveat-VariableFont_wght.ttf`.
  - **Inter**: Google Fonts, cargada en `index.html`.
- **Sin librerías de animación:** todas las animaciones son CSS (transitions/keyframes), SVG (`stroke-dashoffset`) y `requestAnimationFrame`.
- **Servicios externos:**
  - Google Fonts.
  - FormSubmit (envío del formulario).
  - `flagcdn.com` (banderas del selector de país).

---

## 2. Estructura de carpetas y archivos

```
sitio-maria-latuff/
├── index.html                    HTML base · fuentes de Google · script DARK_ONLY (activa .dark antes de pintar)
├── package.json                  scripts y dependencias
├── vite.config.js                Vite + plugin React
├── tailwind.config.js            tokens de color → clases · fuentes · tamaños · keyframes
├── postcss.config.js
├── .gitignore                    excluye node_modules, dist, dist-share, .env*
├── README.md                     este documento (handoff)
├── docs/
│   └── DOCUMENTACION.md          guía detallada de mantenimiento
├── public/
│   ├── _redirects                Netlify: todas las rutas → index.html (SPA)
│   └── email/
│       ├── prospecto.html        plantilla de correo para María (variables {{…}})
│       ├── cliente.html          plantilla de confirmación al cliente
│       ├── vista-previa.html     previsualización con datos de ejemplo
│       └── logo.png              logo usado en los correos
└── src/
    ├── main.jsx                  entrada: Router + App + globals.css
    ├── App.jsx                   rutas
    ├── config.js                 DARK_ONLY = true
    ├── styles/
    │   └── globals.css           variables de color (claro/oscuro), clases t-h1…t-h4, keyframes
    ├── content/
    │   ├── site.js               TODO el copy, enlaces, testimonios y datos de proyectos
    │   └── countries.js          países, códigos ISO y prefijos telefónicos
    ├── hooks/
    │   └── useInView.js          IntersectionObserver → [ref, inView]
    ├── assets/
    │   ├── about/                foto de Conóceme
    │   ├── fonts/                Caveat (en uso) · Geist Italic (ya no se usa)
    │   ├── logos/                logos de clientes de los testimonios
    │   ├── testimonials/         fotos de testimonios
    │   └── projects/
    │       ├── bloo/             pantallas, logo y fondo de portada
    │       ├── puma/             pantallas, logo, collage de login y foto de portada
    │       └── datamedy/         landing web y móvil, mockups, logo, isologo, modal
    ├── pages/
    │   ├── Home.jsx · About.jsx · Offer.jsx · Projects.jsx
    │   ├── ProjectDetail.jsx     cabecera común + plantilla por layout (bloo | puma | datamedy | genérica)
    │   ├── WorkTogether.jsx      formulario de contacto
    │   └── Contact.jsx           (diseño anterior)
    └── components/
        ├── layout/Layout.jsx     header + main + footer · scroll al inicio en cada ruta
        ├── home/                 HomeHeader, MobileMenu, HomeButton, BigFooter, HeroThreads, HeroPortrait,
        │                         Solutions (+FlowLine), HomeTestimonials, ProjectCarousel (+ProjectSlide),
        │                         Signature, SignatureBackdrop, IsoGraphic, SequenceStrip, ThemeToggle, iso.js
        ├── about/                ReadingText, PhotoSlot
        ├── projects/             casos (BlooCase, PumaCase, DatamedyCase), recorridos (BlooFlow, BlooFlowPlanning,
        │                         ApprovalFlow, ResponsiveFlows, PumaFlow, PumaFlows2, PumaMobileFlow,
        │                         PumaSolicitudesFlow, DatamedyLanding, DatamedyModal), marca (DatamedyBrand),
        │                         portadas (BlooCover, PumaCover, DatamedyCover), diagramas (ArchSteps, ArchProcess),
        │                         galería (MacGallery), dispositivos (devices.jsx), stage.js
        ├── ui/                   Reveal, ImageSlot, ExampleLogo, Button, Dial
        ├── sections/             componentes del diseño anterior (solo CallToAction se usa, en /contacto)
        └── cards/                componentes del diseño anterior (sin uso)
```

---

## 3. Instalación, entorno y comandos

### Requisitos

- **Node.js 18 o superior** (probado con Node 26.13 y npm 11.20).
- npm. El repositorio incluye `package-lock.json`; usa npm, no yarn ni pnpm, para respetar las versiones exactas.
- Git, para clonar el repositorio privado `github.com/marialatuff/sitio-maria-latuff`.

### Instalación

```bash
git clone https://github.com/marialatuff/sitio-maria-latuff.git
cd sitio-maria-latuff
npm install
```

> En npm 11 puede aparecer un aviso de *install-scripts* sobre `esbuild`. El build funciona igual. Si Vite no arranca por falta del binario de esbuild, ejecuta `npm rebuild esbuild`.

### Variables de entorno

Para desarrollar no hace falta ninguna variable. La única opcional es:

| Variable | Archivo | Valores | Efecto |
| --- | --- | --- | --- |
| `VITE_ROUTER` | `.env.share` (no versionado) | `memory` | Usa `MemoryRouter` en lugar de `BrowserRouter`. Solo para `npm run build:share`. |

Para `build:share`, crea `.env.share` con la línea `VITE_ROUTER=memory`.

### Configuración que conviene conocer

| Dónde | Qué |
| --- | --- |
| `src/config.js` **y** `index.html` | `DARK_ONLY`. Para volver a mostrar el modo claro y el botón sol/luna, ponlo en `false` en **los dos** archivos. |
| `src/content/site.js` → `WORK_FORM.email` | Correo que recibe el formulario |
| `src/content/site.js` → `SOCIAL` | Enlaces de redes |

### Comandos

```bash
npm run dev          # desarrollo en http://localhost:5173 (con recarga en vivo)
npm run build        # build de producción → dist/
npm run preview      # sirve dist/ localmente
npm run build:share  # build en una sola página con navegación en memoria → dist-share/
```

> Si agregas un archivo nuevo con clases de Tailwind y no se aplican en desarrollo, reinicia `npm run dev`.

### Publicación

`dist/` es estático y sirve en Netlify, Vercel, GitHub Pages o cualquier hosting de archivos.

- **Rutas:** como es una SPA con rutas reales, el hosting debe devolver `index.html` para cualquier ruta. En Netlify ya lo resuelve `public/_redirects`; en otros servicios hay que configurar el equivalente.
- **FormSubmit:** después de publicar en un dominio nuevo, hay que activar el formulario desde el correo de activación (sección 6).

---

## 4. Inventario de componentes de UI

Convenciones:
- Las props con valor por defecto se muestran como `prop = valor`.
- Los **estados** son el estado interno (`useState` o refs) del componente.
- Todos los componentes animados respetan `prefers-reduced-motion`.

### 4.1 Estructura y navegación

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `Layout` | `layout/Layout.jsx` | — | Monta `HomeHeader`, `<Outlet/>` y `BigFooter`. Hace scroll al inicio en cada cambio de ruta. En `/trabajemos-juntos` pasa `compact` al footer. |
| `HomeHeader` | `home/HomeHeader.jsx` | — | `scrolled` (fondo con desenfoque al bajar), `open` (menú móvil), `overFooter` y `overViolet` (cambia a colores claros sobre fondos oscuros). Bloquea el scroll del body con el menú abierto. |
| `MobileMenu` | `home/MobileMenu.jsx` | `open`, `onClose` | Panel a pantalla completa con iconos de línea. Enfoca el primer enlace al abrirse. |
| `LogoMark` | `home/Signature.jsx` | `className = ''` | Logo: firma «m» + «AI product builder» |
| `ThemeToggle` | `home/ThemeToggle.jsx` | `onDark = false`, `className = ''` | Botón sol/luna. Guarda la preferencia en `localStorage.theme`. Oculto mientras `DARK_ONLY = true`. |
| `BigFooter` | `home/BigFooter.jsx` | `compact = false` | Firma gigante animada, título, redes, texto y CTA. Con `compact` muestra solo la línea de crédito. Estado: `creditSeen` (destello del crédito, una sola vez). |
| `SocialLinks` | `home/BigFooter.jsx` | `className = ''` | Botones redondos de LinkedIn e Instagram (de `SOCIAL`) |

### 4.2 Básicos

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `HomeButton` | `home/HomeButton.jsx` | `label = HOME_CTA`, `href = WORK_PATH`, `variant = 'dark' \| 'light' \| 'soft'`, `className` | Píldora con flecha. Si `href` empieza con `/` usa `<Link>`; si no, abre en otra pestaña. Hover: `#7e6e87`. |
| `Reveal` | `ui/Reveal.jsx` | `as = 'div'`, `delay = 0` (ms), `className`, `...rest` | Aparición suave (blur + desplazamiento) al entrar en pantalla, una sola vez |
| `ReadingText` | `about/ReadingText.jsx` | `as = 'p'`, `className`, `children` | `read` y `swept`. Pasa de gris (`--c-read-dim`) a una luz lila que lo recorre una vez y queda en gris claro (`--c-read-lit`). Interlineado fijo de 1.75. **Usar en todos los párrafos de lectura.** |
| `ImageSlot` | `ui/ImageSlot.jsx` | `src`, `alt = ''`, `className`, `aspect = 'aspect-[4/3]'` | Muestra un icono de relleno si `src` es nulo |
| `PhotoSlot` | `about/PhotoSlot.jsx` | `src`, `alt = ''`, `className`, `portrait = false` | Foto grande. `portrait` usa 4:5 y un ancho menor. |
| `ExampleLogo` | `ui/ExampleLogo.jsx` | `variant = 0`, `src`, `name`, `className` | Logo de relleno mientras no exista el real |
| `useInView` (hook) | `hooks/useInView.js` | `{ threshold = 0.2, rootMargin = '0px', once = true }` | Devuelve `[ref, inView]`. Con `once: false` se reactiva cada vez. |

### 4.3 Home y secciones

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `HeroThreads` | `home/HeroThreads.jsx` | `title`, `titleLines`, `paragraph`, `highlights = []` | Telón de entrada con «m», hilos que siguen el scroll y luz lila. Usa `requestAnimationFrame`. |
| `HeroPortrait` | `home/HeroPortrait.jsx` | `title`, `titleLines`, `paragraph` | Variante del hero con retrato |
| `Solutions` | `home/Solutions.jsx` | `data` | Lista de servicios con `IsoGraphic` y `FlowLine` |
| `FlowLine` | `home/Solutions.jsx` | `containerRef` | Línea continua entre los elementos `[data-flow]`. Avanza con el scroll y tiene un destello. |
| `ProjectCarousel` | `home/ProjectCarousel.jsx` | `projects` | Carrusel infinito con flechas. Estado en ref: `x`, `target`, `paused` (se pausa con hover o foco). |
| `ProjectSlide` | `home/ProjectCarousel.jsx` | `project`, `index`, `hidden`, `className` | Card de proyecto. Muestra la portada de `coverArt` (`COVERS`) o `cover`, y el título h2 en máximo 2 líneas. |
| `HomeTestimonials` | `home/HomeTestimonials.jsx` | `title`, `items` | Marquee de 2 filas con flechas. Estados por fila: velocidad, `goTo`, pausa. Cards expandibles. |
| `Signature` / `SignaturePaths` | `home/Signature.jsx` | `className`, `strokeWidth = 22`, `duration = 2.2`, `fine = false` / `drawn`, `delay` | Firma vectorial que se dibuja |
| `SignatureBackdrop` | `home/SignatureBackdrop.jsx` | `scrollRef` | Firma de fondo que se escribe al cargar y continúa con el scroll. Estados: `drawn`, `mobile`. |
| `IsoGraphic` | `home/IsoGraphic.jsx` | `type = 'project'` (clave de `SEQUENCES`), `className` | Ilustración isométrica de línea que se transforma en bucle. Estado: `active`. |
| `SequenceStrip` | `home/SequenceStrip.jsx` | `type`, `className` | Tira horizontal de pasos. En escritorio se dibuja al entrar en pantalla; en móvil sigue el scroll. |

### 4.4 Formulario

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `WorkTogether` | `pages/WorkTogether.jsx` | — | `country`, `phone` (solo dígitos, con prefijo automático del país) y `status`: `idle` · `sending` · `sent` · `error`. Envía JSON a FormSubmit con un límite de 25 s. |
| `CountrySelect` | `pages/WorkTogether.jsx` (interno) | `value`, `onChange`, `id` | `open`, `query`, `active`. Combobox con banderas y búsqueda sin tildes. Teclado: flechas, Enter, Escape. Se cierra al hacer clic fuera. |

### 4.5 Proyectos: estructura

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `ProjectDetail` | `pages/ProjectDetail.jsx` | — (usa `:slug`) | Cabecera común (título, intro, Solución, Equipo, Empresa). Elige la plantilla según `project.layout`. |
| `BlooCase` / `PumaCase` / `DatamedyCase` | `projects/*Case.jsx` | `project` | Plantillas a medida de cada caso |
| `Sheet` | `projects/BlooCase.jsx` | `items` (`[{label, value}]`) | Ficha del proyecto en 3 o 4 columnas |
| `SectionTitle` | `projects/BlooCase.jsx` | `children`, `className` | Título de sección (`t-h2`) con aparición |
| `ArchSteps` | `projects/ArchSteps.jsx` | `steps` (`[{title, body, visual, example?, screens?}]`) | Pasos alternados izquierda/derecha. `visual` elige un diagrama de `DIAGRAM` o, si no existe, una secuencia de `IsoGraphic`. |
| Diagramas | `projects/ArchProcess.jsx` | `JobFlowDiagram`, `ParallelDiagram`, `SyntheticDiagram({example})`, `MeetingDocDiagram`, `TeamTestDiagram({screens})` | Diagramas técnicos SVG + HTML que se arman al entrar en pantalla |
| `MacGallery` | `projects/MacGallery.jsx` | `images` (`[{src, alt}]`), `inserts = {}` (`{ índice: nodo }`), `children` | Imágenes estáticas en `MacWindow` de 2 en 2 sobre fondo gris. `inserts` agrega bloques a todo el ancho. |
| Portadas | `projects/BlooCover.jsx`, `PumaCover.jsx`, `DatamedyCover.jsx` | — | Bloo: video en bucle (modal → vista completa). PUMA: foto de oficina con pantallas montadas en perspectiva (homografía `matrix3d`). Datamedy: iPhone estático en 3D. |

### 4.6 Proyectos: dispositivos y reproductores de recorridos

| Componente | Archivo | Props | Estados / comportamiento |
| --- | --- | --- | --- |
| `MacWindow` | `projects/devices.jsx` | `children`, `title`, `ratio = '16 / 10'` | Ventana de macOS sin bordes, con barra fina (medidas en `cqw`) |
| `PhoneFrame` | `projects/devices.jsx` | `children`, `color = 'white' \| 'black'` | iPhone 16 (393 × 852) con canto metálico y botones laterales |
| `Scaled` | `projects/ApprovalFlow.jsx` | `w`, `h`, `innerRef`, `children` | Lienzo de tamaño fijo escalado al ancho disponible (ResizeObserver) |
| `FlowPlayer` | `projects/BlooFlow.jsx` | `phases`, `initial`, `script`, `children(ui)`, `description`, `title`, `bg` | Reproductor web con cursor. Estados: `ui` (lo define el recorrido), `cursor`, `scale`. Guion: `script({ set, moveTo, click, type, sleep })`. |
| `DualPlayer` | `projects/ResponsiveFlows.jsx` | `phases`, `initial`, `script`, `Web`, `Mobile`, `label`, `title`, `phoneColor = 'white'` | Web + iPhone sincronizados. Estados: `ui`, `cur` (cursor) y `tap` (dedo). Guion: `script({ set, press, sleep })`. |
| `Shell`, `ModalLayer` | `projects/BlooFlow.jsx` | `active`, `screenKey`, `children` / `children` | Estructura de las pantallas Bloo (menú + barra) y capa de modal |
| Recorridos | `BlooFlow`, `BlooFlowPlanning`, `ApprovalFlow`, `PanelFlow`, `AnotacionesFlow`, `PumaFlow`, `UsuariosFlow`, `PostulanteFlow`, `PumaMobileFlow`, `PumaSolicitudesFlow`, `DatamedyLanding`, `DatamedyModal`, `DatamedyBrand` | — | Cada uno define su estado `ui` y su guion. Se reproducen solo en pantalla y en bucle. Ritmo global: `SPEED = 0.6`. |

---

## 5. Especificaciones de diseño

### 5.1 Paleta de colores (HEX)

Los colores se definen como **variables CSS en canales RGB** (`--c-*` en `src/styles/globals.css`) y se usan con clases de Tailwind (`bg-paper`, `text-night`…). **El sitio publicado usa el modo oscuro.**

**Modo oscuro (activo)**

| Token | HEX | Clase Tailwind | Uso |
| --- | --- | --- | --- |
| `--c-paper` | `#121312` | `bg-paper` | Fondo principal |
| `--c-paper-soft` | `#1a1c1a` | `bg-paper-soft` | Bloques secundarios |
| `--c-card` | `#1e201e` | `bg-card` | Tarjetas y contenedores sólidos |
| `--c-paper-line` | `#2e312e` | `border-paper-line` | Bordes y divisores |
| `--c-night` | `#f2f4f0` | `text-night` | Títulos (blanco) |
| `--c-graphite` | `#dee0dc` | `text-graphite` | Texto principal |
| `--c-graphite-soft` | `#a8aca8` | `text-graphite-soft` | Texto secundario |
| `--c-graphite-mute` | `#8c908c` | `text-graphite-mute` | Etiquetas pequeñas |
| `--c-read-dim` | `#707470` | `text-ink-dim` | Párrafo aún no leído |
| `--c-read-lit` | `#bec1be` | `text-read-lit` | Párrafo ya leído |
| `--c-ink-line` / `--c-stroke` | `#7e6e87` | `text-ink-line` / `text-stroke` | **Acento lila**: líneas e ilustraciones |
| `--c-line-soft` | `#534a58` | `text-ink-faint` | Trazos secundarios |
| `--c-backdrop-line` | `#a698ae` | `text-backdrop-line` | Firma de fondo |
| `--c-hover` | `#7e6e87` | `bg-hover`, `text-hover` | Hover de botones y menú |
| `--c-hover-ink` | `#ffffff` | `text-hover-ink` | Texto sobre el hover |
| `--c-spark` | `#ded0e8` | `.line-spark` | **Luz lila brillante** (destellos) |
| `--c-footer-sig` | `#2e2e2e` | `text-footer-sig` | Firma del footer |

**Colores fijos** (iguales en ambos modos): `coal #0f0f0f` (footer), `snow #f7f9f7`. Texto del crédito «Este sitio fue creado con asistencia de IA…» con degradado `#c9b6d6 → #ded0e8`.

**Modo claro (guardado, no visible):** `paper #f7f9f7` · `paper-soft #eef1ed` · `card #ffffff` · `paper-line #e2e5e1` · `night #0f0f0f` · `graphite #333333` · `graphite-soft #626562` · `graphite-mute #6c6f6c` · `read-dim #888b88` · `read-lit #333333` · `ink-line #2b2b2b` · `hover #7e6e87`. El fondo de Soluciones en la Home es `#7b6b7a` (solo modo claro).

**Colores de los clientes** (solo dentro de sus mockups):

| Marca | Colores |
| --- | --- |
| Bloo | `#0b6bff` (azul), `#8b4fd6`, `#19a65a`, `#ff5a1f`, fondo `#eef3fb` |
| PUMA | `#1b2f6b` (azul marino), `#3a5bab`, `#e8781e` (naranja), fondo `#f5f8fd` |
| Datamedy | `#836fff` (violeta), `#79d7be` (verde menta), `#141a2e` |

### 5.2 Tipografía

| Rol | Fuente | Pesos | Clase |
| --- | --- | --- | --- |
| Títulos de página y sección | **Caveat** (local, variable 400–700) | 400–700 | `font-script`, `t-h1`, `t-h2` |
| Subtítulos, párrafos, interfaz | **Inter** (Google Fonts, variable 100–900, con itálica) | 400 / 500 / 600 | `font-geist`* , `t-h3`, `t-h4` |

\* La clase se llama `font-geist` por historia del proyecto, pero apunta a **Inter**.

Escala tipográfica (`globals.css`):

| Clase | Móvil | `sm` (≥640) | `lg` (≥1024) | Interlineado |
| --- | --- | --- | --- | --- |
| `t-h1` (Caveat) | 40px | 48px | 56px | 1.05 |
| `t-h2` (Caveat) | 36px | 40px | 44px | 1.08 |
| `t-h3` (Inter 500) | 20px | 24px | 24px | snug |
| `t-h4` (Inter 500) | 18px | 18px | 18px | snug |
| Párrafos (`ReadingText`) | 15.7–16.8px | — | — | **1.75** |
| Título de card de proyecto | 13.6px | 15.2px | — | snug, máximo 2 líneas |

**Reglas de texto:**
- Títulos en blanco.
- Párrafos en gris: una luz lila los recorre al hacer scroll y quedan en gris claro. **Nunca quedan en lila.**

### 5.3 Breakpoints responsive

Son los de Tailwind por defecto (no hay `screens` personalizados en `tailwind.config.js`):

| Prefijo | Ancho mínimo | Uso típico en el sitio |
| --- | --- | --- |
| *(base)* | 0 | Móvil: una columna, menú hamburguesa |
| `sm` | 640px | Grillas de 2 columnas, tamaños de título intermedios |
| `md` | 768px | Navegación de escritorio visible, menú móvil oculto, columnas lado a lado |
| `lg` | 1024px | Títulos grandes, fichas de 4 columnas |
| `xl` | 1280px | (poco usado) |
| `2xl` | 1536px | (no usado) |

Además, por JavaScript, `SignatureBackdrop` y `SequenceStrip` cambian a su versión móvil con `max-width: 639px`.

**Contenedor:** `max-w-6xl` (1152px) centrado, con relleno lateral `px-5` (20px) en móvil y `sm:px-8` (32px) desde 640px.

### 5.4 Otros tokens

- **Radios:** cards y contenedores `rounded-xl`, botones `rounded-full`, ventanas Mac de 4 a 8px.
- **Sombras:** suaves y cortas (`0 18px 40px -24px rgba(0,0,0,.28)`), sin bordes (stroke) en mockups ni contenedores.
- **Movimiento:**
  - Curva habitual `cubic-bezier(.7,0,.2,1)` (entra y sale suave) o `cubic-bezier(.2,.7,.2,1)` (salida).
  - Cambios de pantalla en recorridos casi instantáneos (0.12s).
  - Ritmo de recorridos `SPEED = 0.6`.
- **Iconografía:** SVG de línea en el código (trazo de 1.6 a 1.7), sin librería de iconos.

---

## 6. Puntos de integración pendientes

### 6.1 Formularios y APIs

| Integración | Estado | Qué falta |
| --- | --- | --- |
| **Formulario «Trabajemos juntos» → correo** | Funciona con **FormSubmit** (`https://formsubmit.co/ajax/<correo>`); destino en `WORK_FORM.email` | 1) En cada dominio nuevo hay que confirmar el correo de activación «Activate Form». 2) La respuesta automática al cliente (`_autoresponse`) es solo texto plano y no siempre se entrega. |
| **Correos con diseño** (prospecto + confirmación al cliente) | Plantillas listas en `public/email/` (variables `{{nombre}}`, `{{email}}`, `{{telefono}}`, `{{pais}}`, `{{estado}}`, `{{problema}}`, `{{fecha_1..3}}`, `{{web}}`) | Migrar el envío a **EmailJS** (María debe crear la cuenta), cargar las dos plantillas y reemplazar el `fetch` de `WorkTogether.jsx`. El logo de los correos debe servirse desde el dominio publicado. |
| **Mensaje de error del formulario** | Texto provisional | Confirmar el copy con María (`WORK_FORM.error`) |
| **Google Form antiguo** | `FORM_URL` en `site.js`, usado solo por componentes del diseño anterior (`/contacto`) | El enlace pide iniciar sesión. Eliminar o reemplazar. |
| **Banderas del selector de país** | `flagcdn.com` (CDN externo) | Opcional: alojarlas localmente para no depender de un tercero |
| **Analítica / SEO** | No implementado | Agregar meta tags por página, Open Graph, favicon definitivo y analítica si se requiere |

### 6.2 Assets y contenido por reemplazar

| Elemento | Ubicación | Qué falta |
| --- | --- | --- |
| Enlace de Instagram | `SOCIAL.instagram` | Hoy apunta a `instagram.com`; poner el perfil real |
| Foto de Franco Margozzini | `REAL_TESTIMONIALS` en `site.js` | Falta su foto (`photo: null`); hoy se muestran sus iniciales |
| Datos de ejemplo en recorridos animados | Componentes de `src/components/projects/` | Nombres, correos, cifras y textos inventados (estudiantes, prospectos, formularios, etc.). Confirmar con María. |
| Ejemplos de la sección Arquitectura (Bloo y PUMA) | `site.js` (`example`, `job`) y `ArchProcess.jsx` | Marcados con `// TODO`: JTBD, hallazgos, decisiones y resultados de las pruebas son ilustrativos |
| Pantallas pendientes del proceso visual de Bloo | `architecture.process.screens` | Dos marcadas como «Pantalla pendiente» |
| Versiones móviles de algunos recorridos | Bloo (Aprobación, Panel, Anotaciones) y PUMA (Postulante) | Recreadas sin diseño móvil original; ajustar si llega el diseño |
| Fuente sin uso | `src/assets/fonts/Geist-Italic-VariableFont_wght.ttf` | Se puede eliminar (el sitio ahora usa Inter) |
| Código del diseño anterior | `components/layout/Header.jsx`, `Footer.jsx`, `components/sections/*`, `components/cards/*`, `pages/Contact.jsx` | Evaluar si se elimina |

---

## 7. Notas para el equipo

- **Textos:** van en `src/content/site.js`, no dentro de los componentes.
- **Colores:** usar siempre los tokens (sección 5.1). Los colores fijos solo se usan en los mockups de clientes.
- **Párrafos:** usar `ReadingText`.
- **Recorridos animados:** no son videos, son pantallas recreadas en React. Para cambiarlos, edita el guion (`script`) y las pantallas del archivo correspondiente (ver `docs/DOCUMENTACION.md`, sección 9).
- **Imágenes:** optimizadas en `src/assets/`. Pantallas web a 1440px y landings móviles a 600px de ancho, en JPG con calidad ~80.
- **Antes de subir:** `npm run build` debe terminar sin errores; revisa el sitio en el navegador, incluidas las vistas móviles.
- **Repositorio:** privado, en `github.com/marialatuff/sitio-maria-latuff`, rama `main`.
