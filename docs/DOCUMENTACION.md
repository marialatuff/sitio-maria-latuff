# Documentación para desarrolladores

Guía para editar y mantener el sitio web de **María Latuff · AI Product Builder**.
Léela completa antes del primer cambio: explica cómo está armado el proyecto, dónde está cada cosa y qué reglas de diseño hay que respetar.

---

## Índice

1. [Resumen técnico](#1-resumen-técnico)
2. [Puesta en marcha](#2-puesta-en-marcha)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Páginas y rutas](#4-páginas-y-rutas)
5. [Contenidos: dónde se editan los textos](#5-contenidos-dónde-se-editan-los-textos)
6. [Sistema de diseño](#6-sistema-de-diseño)
7. [Animaciones del sitio](#7-animaciones-del-sitio)
8. [Proyectos: cómo funcionan y cómo agregar uno](#8-proyectos-cómo-funcionan-y-cómo-agregar-uno)
9. [Recorridos animados (videos de producto)](#9-recorridos-animados-videos-de-producto)
10. [Formulario «Trabajemos juntos» y correos](#10-formulario-trabajemos-juntos-y-correos)
11. [Imágenes: formatos y tamaños](#11-imágenes-formatos-y-tamaños)
12. [Publicación](#12-publicación)
13. [Flujo de trabajo con Git](#13-flujo-de-trabajo-con-git)
14. [Convenciones del código](#14-convenciones-del-código)
15. [Código heredado y pendientes](#15-código-heredado-y-pendientes)

---

## 1. Resumen técnico

| Tema | Detalle |
| --- | --- |
| Framework | React 18 (componentes en `.jsx`, sin TypeScript) |
| Empaquetador | Vite 5 |
| Rutas | React Router 6 (`BrowserRouter`) |
| Estilos | Tailwind CSS 3 + variables CSS propias (`src/styles/globals.css`) |
| Tipografías | **Caveat** (títulos, archivo local) e **Inter** (todo lo demás, Google Fonts) |
| Modo de color | Solo modo oscuro por ahora (ver `DARK_ONLY`, sección 6.1) |
| Datos | Sin backend ni base de datos: todo el contenido vive en `src/content/site.js` |
| Formulario | Envío por correo con FormSubmit (ver sección 10) |

No hay pruebas automatizadas. Antes de subir cambios, ejecuta `npm run build` (debe terminar sin errores) y revisa el sitio en el navegador.

---

## 2. Puesta en marcha

Requisitos: **Node.js 18 o superior** y **npm**.

```bash
npm install        # instala dependencias (solo la primera vez o si cambia package.json)
npm run dev        # servidor local en http://localhost:5173 con recarga en vivo
npm run build      # genera la versión final en dist/
npm run preview    # sirve dist/ localmente para revisarla
```

> Si agregas un archivo nuevo con clases de Tailwind y los estilos no aparecen en el servidor de desarrollo, reinicia `npm run dev`. Lo mismo después de cambiar `tailwind.config.js`.

---

## 3. Estructura de carpetas

```
index.html                    HTML base: fuentes de Google, script que activa el modo oscuro antes de pintar
tailwind.config.js            colores (mapeados a variables CSS), fuentes, tamaños y animaciones de Tailwind
vite.config.js                configuración de Vite
public/
  _redirects                  regla para Netlify: todas las rutas sirven index.html
  email/                      plantillas HTML de correo (prospecto, cliente) y su vista previa
src/
  main.jsx                    punto de entrada (Router + App + estilos globales)
  App.jsx                     definición de rutas
  config.js                   DARK_ONLY (modo solo oscuro)
  styles/globals.css          variables de color, clases tipográficas, keyframes de animaciones
  content/
    site.js                   TODOS los textos, enlaces, testimonios y datos de proyectos
    countries.js              países y prefijos telefónicos del formulario
  hooks/useInView.js          detecta cuándo un elemento entra en pantalla (dispara animaciones)
  assets/                     imágenes (about/, logos/, testimonials/, projects/<proyecto>/, fonts/)
  pages/                      una página por ruta
  components/
    layout/Layout.jsx         estructura común: header, contenido, footer, scroll al inicio
    home/                     header, menú móvil, footer, hero, soluciones, testimonios, carrusel,
                              firma animada, ilustraciones de línea (IsoGraphic, SequenceStrip, iso.js)
    about/                    ReadingText (texto que se ilumina al leer) y PhotoSlot
    projects/                 casos de proyecto, recorridos animados, mockups de dispositivos, portadas
    ui/                       Reveal (aparición al hacer scroll), ImageSlot, ExampleLogo, Button
    sections/, cards/         componentes del diseño anterior (ver sección 15)
```

---

## 4. Páginas y rutas

Definidas en `src/App.jsx`. Todas comparten `Layout` (header + footer).

| Ruta | Página | Archivo |
| --- | --- | --- |
| `/` | Home | `src/pages/Home.jsx` |
| `/conoceme` | Conóceme | `src/pages/About.jsx` |
| `/mi-oferta` | Soluciones (en el menú se llama «Soluciones») | `src/pages/Offer.jsx` |
| `/proyectos` | Listado de proyectos | `src/pages/Projects.jsx` |
| `/proyectos/:slug` | Detalle de un proyecto | `src/pages/ProjectDetail.jsx` |
| `/trabajemos-juntos` | Formulario de contacto | `src/pages/WorkTogether.jsx` |
| `/contacto` | Contacto (diseño anterior, no está en el menú) | `src/pages/Contact.jsx` |
| cualquier otra | redirige a `/` | — |

- El menú principal sale de `HOME_NAV` en `site.js`.
- Todos los botones «Trabajemos juntos» (`HomeButton`) llevan a `WORK_PATH` (`/trabajemos-juntos`). Si `href` empieza con `/` navega dentro del sitio; si es una URL externa abre otra pestaña.
- En `/trabajemos-juntos` el footer se muestra compacto (solo la línea de crédito): ver `Layout.jsx`.

---

## 5. Contenidos: dónde se editan los textos

**Regla principal: los textos no se escriben dentro de los componentes; van en `src/content/site.js`.** Los componentes los importan.

Constantes principales de `site.js`:

| Constante | Qué contiene |
| --- | --- |
| `HOME_NAV` | Enlaces del menú |
| `HOME_CTA`, `WORK_PATH` | Texto y destino del botón «Trabajemos juntos» |
| `WORK_FORM` | Textos del formulario, mensajes de éxito/error, correo de destino y respuesta automática |
| `HOME_V2` | Textos de la Home: hero, soluciones, títulos de secciones, footer |
| `SOCIAL` | Enlaces de LinkedIn e Instagram (Instagram aún es un enlace general) |
| `PROJECTS` | Lista de proyectos (orden = orden en el sitio) |
| `TESTIMONIALS` | Testimonios del carrusel |
| `ABOUT`, `ABOUT_PHOTOS` | Textos y foto de Conóceme |
| `OFFER` | Textos de Soluciones |

Para cambiar un texto: búscalo en `site.js`, edítalo y guarda. Los campos marcados con `// TODO` son contenido pendiente o de ejemplo.

---

## 6. Sistema de diseño

### 6.1 Colores y modo oscuro

- Los colores son **variables CSS en canales RGB** definidas en `src/styles/globals.css`:
  - `:root { … }` → modo claro
  - `html.dark { … }` → modo oscuro
- `tailwind.config.js` las expone como clases: `bg-paper`, `text-night`, `text-graphite`, `bg-card`, `text-hover`, etc. Ejemplo de definición: `paper: 'rgb(var(--c-paper) / <alpha-value>)'`.
- **No uses colores fijos (`#fff`, `text-white`, `bg-[#…]`) en la interfaz del sitio**; usa los tokens para que funcionen en ambos modos. Excepción: los mockups de productos de clientes (Bloo, PUMA, Datamedy), que reproducen la marca del cliente.
- **Solo modo oscuro:** `DARK_ONLY = true` en `src/config.js` **y** en el script de `index.html`. Para recuperar el modo claro y el botón sol/luna, pon `false` en **los dos** lugares. El modo claro sigue completo en el código.

Colores de marca más usados (modo oscuro):

| Uso | Valor |
| --- | --- |
| Fondo | `#121312` (`--c-paper`) |
| Acento lila (líneas, hover de botones y menú) | `#7e6e87` (`--c-ink-line`, `--c-hover`) |
| Luz lila brillante (destellos, texto de crédito) | `#ded0e8` (`--c-spark`) |
| Texto no leído / leído | `--c-read-dim` / `--c-read-lit` (grises) |

### 6.2 Tipografía

- **Títulos de página y sección:** Caveat → clases `t-h1` y `t-h2`.
- **Subtítulos:** `t-h3`, `t-h4` (Inter, peso medio).
- **Todo lo demás:** Inter. La clase de Tailwind se llama `font-geist` por historia del proyecto, pero apunta a Inter (ver `tailwind.config.js`). No la renombres sin reemplazar todos sus usos.
- **Párrafos: interlineado 1.75.**

### 6.3 Regla de los párrafos de lectura (importante)

Todos los párrafos de lectura usan el componente **`ReadingText`** (`src/components/about/ReadingText.jsx`):

- Por defecto el texto es **gris** (`text-ink-dim`).
- Al llegar a la mitad de la pantalla, una **franja de luz lila lo recorre una vez** (clase `read-sweep`) y queda en **gris claro** (`text-read-lit`).
- **Los párrafos nunca quedan en lila.** El lila solo aparece en la luz que pasa.
- **Los títulos van en blanco** (`text-night` en modo oscuro).
- `ReadingText` fuerza el interlineado 1.75.

```jsx
import ReadingText from '../components/about/ReadingText.jsx';

<ReadingText className="mt-4 text-[1.05rem]">{texto}</ReadingText>
```

### 6.4 Componentes básicos

| Componente | Uso |
| --- | --- |
| `Reveal` (`ui/Reveal.jsx`) | Aparición suave al entrar en pantalla. `as` define la etiqueta y `delay` el retraso en ms. |
| `HomeButton` (`home/HomeButton.jsx`) | Botón píldora. Variantes: `dark`, `light` (sobre fondos oscuros fijos), `soft`. El hover usa el lila `#7e6e87`. |
| `ImageSlot` | Imagen con relleno neutro mientras no exista la real. |
| `useInView` (hook) | Devuelve `[ref, inView]`. Con `once: false` se reactiva cada vez que entra en pantalla. |

---

## 7. Animaciones del sitio

Estilo general: **líneas finas que se dibujan, con una luz lila que las recorre** (`line-spark`). Todas respetan `prefers-reduced-motion`: si el usuario pidió menos movimiento, se muestran en su estado final.

| Animación | Archivo | Qué hace |
| --- | --- | --- |
| Hero de la Home | `home/HeroThreads.jsx` | Hilos y firma «m» que se dibujan |
| Firma de fondo | `home/SignatureBackdrop.jsx` | Firma grande que se escribe y sigue con el scroll (Soluciones, Trabajemos juntos) |
| Ilustraciones isométricas | `home/IsoGraphic.jsx` + `home/iso.js` | Figuras de línea que se transforman en bucle. Cada figura es una secuencia en `SEQUENCES`. |
| Tiras de pasos | `home/SequenceStrip.jsx` | Varias figuras en fila (Soluciones, Gestión de producto) |
| Línea continua | `FlowLine` en `home/Solutions.jsx` | Línea que une secciones con el scroll |
| Texto que se ilumina | `about/ReadingText.jsx` | Ver sección 6.3 |

**Crear una ilustración nueva:** agrega una secuencia en `SEQUENCES` (`IsoGraphic.jsx`) usando las primitivas de `iso.js` (`makeIso`, `slab`, `ring`, `panel`, `person`, `woman`, `star`…). Cada paso es un arreglo de trazos SVG (`d`). Después úsala con `<IsoGraphic type="nombre" />` o `<SequenceStrip type="nombre" />`.

Los `@keyframes` propios (`bloo-*`, `puma-*`, `mac-scroll`, `line-spark-run`, etc.) están al final de `globals.css`.

---

## 8. Proyectos: cómo funcionan y cómo agregar uno

### 8.1 Datos

Cada proyecto es un objeto en `PROJECTS` (`site.js`). Campos comunes:

| Campo | Uso |
| --- | --- |
| `slug` | Parte final de la URL: `/proyectos/<slug>` |
| `title` | Título (h1 del detalle y título de la card, máximo 2 líneas en la card) |
| `intro` | Descripción de la cabecera |
| `tags` | Etiquetas de «Solución» |
| `team` | (opcional) Bloque «Equipo», por ejemplo `[{ role: 'Líder Técnico', name: '…' }]` |
| `company`, `logo`, `logoColor` | Empresa y logo. Con `logoColor: true` el logo se muestra a color original. |
| `cover` | Imagen de la card |
| `coverArt` | (opcional) Portada compuesta en código: `'bloo'`, `'puma'`, `'datamedy'` |
| `layout` | Qué plantilla de detalle usar (ver 8.2) |

### 8.2 Plantillas de detalle

`ProjectDetail.jsx` dibuja la cabecera común (título, intro, Solución, Equipo, Empresa) y luego elige el contenido según `layout`:

| `layout` | Componente | Contenido |
| --- | --- | --- |
| *(sin layout)* | `GenericSections` | 3 secciones con título, texto y 2 imágenes (`sections`) |
| `'bloo'` | `projects/BlooCase.jsx` | Ficha, recorridos, contexto, gestión, arquitectura, galería |
| `'puma'` | `projects/PumaCase.jsx` | Ficha, recorridos, problema/solución, arquitectura, galería |
| `'datamedy'` | `projects/DatamedyCase.jsx` | Requerimientos, marca animada, landing, mockups, modal |

Piezas reutilizables entre casos:

- `Sheet`, `SectionTitle` (exportados desde `BlooCase.jsx`)
- `ArchSteps` → pasos con diagrama o ilustración. El campo `visual` de cada paso elige el gráfico: diagramas técnicos en `ArchProcess.jsx` (registro `DIAGRAM` en `ArchSteps.jsx`) o, si no hay diagrama, una secuencia de `IsoGraphic` con ese nombre.
- `MacGallery` → imágenes estáticas en ventana de Mac de 2 en 2. Con `inserts={{ 1: <Algo /> }}` se inserta un bloque a todo el ancho después de la imagen 1.

### 8.3 Agregar un proyecto nuevo

1. Crea la carpeta `src/assets/projects/<proyecto>/` y guarda ahí las imágenes optimizadas (ver sección 11).
2. Importa las imágenes al inicio de `site.js` y crea el objeto del proyecto.
3. Agrégalo en `PROJECTS` en la posición deseada.
4. **Opción simple:** usa `sections` sin `layout`.
5. **Opción a medida:** crea `projects/<Proyecto>Case.jsx` (copia `PumaCase.jsx` como base), asigna `layout: '<nombre>'` y agrega la rama correspondiente en `ProjectDetail.jsx`.
6. Para una portada compuesta, crea `projects/<Proyecto>Cover.jsx` y regístrala en `COVERS` dentro de `home/ProjectCarousel.jsx`. Después usa `coverArt: '<nombre>'`.

---

## 9. Recorridos animados (videos de producto)

Los «videos» de los proyectos **no son archivos de video**: son pantallas recreadas en React que se reproducen solas (el visitante no puede interactuar). Así se ven nítidos a cualquier tamaño.

### 9.1 Marcos de dispositivo (`projects/devices.jsx`)

- `MacWindow` → ventana de macOS sin bordes, con barra fina y semáforo. Props: `title`, `ratio`.
- `PhoneFrame` → iPhone 16 realista con botones laterales. Prop `color`: `'white'` (Bloo, Datamedy) o `'black'` (PUMA, negro metálico).
- `PHONE_W` × `PHONE_H` = 393 × 852: medida del lienzo móvil.

### 9.2 Reproductores

| Reproductor | Dónde | Uso |
| --- | --- | --- |
| `FlowPlayer` | `projects/BlooFlow.jsx` | Solo web, con cursor. Lienzo de 1200 × 750. Props: `phases`, `initial`, `script`, `title`, `bg` y `children(ui)`. |
| `DualPlayer` | `projects/ResponsiveFlows.jsx` | Web + iPhone sincronizados (cursor + toque). Props: `Web`, `Mobile`, `phoneColor`, `label`, `title`. |
| Propios | `PumaMobileFlow.jsx`, `DatamedyLanding.jsx`, `DatamedyModal.jsx`, `BlooCover.jsx` | Casos especiales |

### 9.3 Cómo se escribe un recorrido

1. Dibuja las pantallas como componentes que reciben `ui` (el estado).
2. Marca los elementos donde el cursor hace clic con `data-t="nombre"`.
3. Escribe el guion como función `async` con el contexto que da el reproductor:

```js
async function script({ set, moveTo, click, type, sleep }) {   // FlowPlayer
  await sleep(1500);
  await moveTo('boton-guardar');   // el cursor va al elemento con data-t="boton-guardar"
  await click();
  set({ modal: 'ok', phase: 1 });  // cambia el estado y la frase del paso
}
// En DualPlayer el contexto es { set, press, sleep }: press('t') mueve cursor y dedo y hace clic en ambos.
```

- **Ritmo:** la constante `SPEED` (0.6) multiplica todas las esperas. Si es menor, el recorrido va más rápido.
- **Cambio de pantalla:** casi instantáneo (`bloo-screen .12s`), como un software real. No vuelvas a usar transiciones tipo cortina.
- **Modales en móvil:** son hojas que suben desde abajo (`bloo-sheet`), con los botones abajo y grandes.
- Los recorridos se reproducen solo cuando están en pantalla (`useInView` con `once: false`).

---

## 10. Formulario «Trabajemos juntos» y correos

- **Página:** `src/pages/WorkTogether.jsx`. Textos y configuración en `WORK_FORM` (`site.js`).
- **Envío actual:** POST JSON a `https://formsubmit.co/ajax/<correo>`, con el correo de `WORK_FORM.email`.
  - El primer envío desde un dominio nuevo manda a ese correo un mensaje de activación («Activate Form») que hay que confirmar.
  - `_autoresponse` manda al cliente una respuesta automática en texto plano (`WORK_FORM.autoReply`).
  - Si el servicio no responde en 25 segundos, se muestra el mensaje de error.
- **Correos con diseño (pendiente):** las plantillas están en `public/email/prospecto.html` (para María) y `public/email/cliente.html` (para el cliente), con variables `{{nombre}}`, `{{email}}`, etc. Se previsualizan en `/email/vista-previa.html`. FormSubmit no permite diseño propio; la idea es migrar a **EmailJS**, que requiere que María cree la cuenta.
- **Logo de los correos:** `public/email/logo.png`. Debe servirse desde el dominio publicado (Gmail no carga imágenes de localhost).

---

## 11. Imágenes: formatos y tamaños

- Guarda las imágenes en `src/assets/...` e impórtalas: Vite les agrega un hash y las optimiza en el build.
- Tamaños recomendados:
  - Pantallas web: **1440 px** de ancho.
  - Landings móviles completas: **600 px** de ancho (más del doble de lo que ocupan en el iPhone).
  - Mockups y portadas: **2000 px** de ancho.
- Formato **JPG calidad ~80** para capturas y fotos; **PNG** solo si hace falta transparencia (logos).
- **No subas originales de 5–10 MB:** reduce el tamaño antes.
- **Ojo:** las imágenes pegadas en un chat suelen reducirse a 2000 px por el lado más largo. Para páginas muy altas, pide el archivo original.

---

## 12. Publicación

```bash
npm run build    # genera dist/
```

- `dist/` es un sitio estático: se puede publicar en Netlify, Vercel, GitHub Pages u otro hosting estático.
- `public/_redirects` hace que en Netlify todas las rutas (`/conoceme`, `/proyectos/...`) sirvan `index.html`. En otros servicios hay que configurar algo equivalente («SPA fallback»).
- `npm run build:share` genera `dist-share/` con navegación en memoria (`VITE_ROUTER=memory`, archivo `.env.share`). Sirve para compartir el sitio como página única sin rutas reales. Normalmente no se necesita.
- Después de publicar en un dominio nuevo, confirma de nuevo el correo de activación de FormSubmit (sección 10).

---

## 13. Flujo de trabajo con Git

- **Repositorio:** `github.com/marialatuff/sitio-maria-latuff` (privado). Rama principal: `main`.
- Para cambios grandes, trabaja en una rama y abre un Pull Request:

```bash
git checkout -b nombre-del-cambio
# … cambios …
npm run build                      # comprobar que compila
git add -A
git commit -m "Descripción clara del cambio"
git push -u origin nombre-del-cambio
```

- No se versionan `node_modules/`, `dist/`, `dist-share/` ni archivos `.env` (ver `.gitignore`).

---

## 14. Convenciones del código

- **Idioma:** comentarios y textos en **español**.
- **Comentarios:** cada componente empieza con un comentario que explica qué hace. Mantén ese estilo.
- **Colores:** siempre con tokens (sección 6.1), salvo en mockups de clientes.
- **Textos:** en `site.js`, no dentro de los componentes.
- **Párrafos:** con `ReadingText` (gris → luz lila → gris claro).
- **Accesibilidad:**
  - Las animaciones decorativas llevan `aria-hidden="true"` y los recorridos incluyen una descripción con `sr-only`.
  - Respeta `prefers-reduced-motion`.
  - Mantén el contraste de los tokens; están calculados para WCAG y anotados en `globals.css`.
- **Contenido inventado:** los datos de ejemplo en los recorridos (nombres, correos, cifras) están marcados con `// TODO` o en comentarios. Confírmalos con María antes de publicarlos.

---

## 15. Código heredado y pendientes

**Código del diseño anterior (v1)**, que se conserva pero casi no se usa:

- `components/layout/Header.jsx` y `Footer.jsx` (el sitio usa `home/HomeHeader.jsx` y `home/BigFooter.jsx`)
- `components/sections/*` y `components/cards/*` (solo `CallToAction` se usa, en `/contacto`)
- `pages/Contact.jsx` (no está en el menú)
- `home/ThemeToggle.jsx` (oculto mientras `DARK_ONLY = true`)

Se pueden eliminar cuando se confirme que no hacen falta.

**Pendientes de contenido o funcionalidad:**

- Conectar EmailJS para los correos con diseño (sección 10).
- Enlace real de Instagram en `SOCIAL`.
- Proyecto 4: contenido de ejemplo.
- Datos de ejemplo de los recorridos y textos marcados con `// TODO`, por confirmar con María.
