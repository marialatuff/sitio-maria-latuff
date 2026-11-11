# Sitio web de María Latuff · AI Product Builder

Portafolio personal: Home, Conóceme, Soluciones, Proyectos (Bloo, PUMA Recruiter, Datamedy) y Trabajemos juntos.

Hecho con **Vite + React 18 + React Router 6 + Tailwind CSS 3**. Tipografías: Caveat (títulos) e Inter (párrafos).

## Cómo ejecutarlo en tu computador

Requiere **Node.js 18 o superior** (https://nodejs.org).

```bash
npm install
npm run dev
```

Luego abre http://localhost:5173

Para generar la versión final (carpeta `dist/`, lista para publicar):

```bash
npm run build
```

## Dónde está cada cosa

```
index.html                  página base (fuentes de Google y modo oscuro)
tailwind.config.js          colores y tipografías → clases de Tailwind
src/styles/globals.css      variables de color (modo claro/oscuro), animaciones
src/config.js               DARK_ONLY: el sitio se muestra solo en modo oscuro
src/content/site.js         TODOS los textos del sitio y los datos de cada proyecto
src/content/countries.js    países y prefijos del formulario
src/assets/                 imágenes, logos y fotos
public/email/               plantillas de correo (prospecto y confirmación al cliente)
src/pages/                  páginas: Home, About (Conóceme), Offer (Soluciones),
                            Projects, ProjectDetail, WorkTogether (formulario)
src/components/home/        header, footer, hero, soluciones, testimonios, carrusel
src/components/about/       texto de lectura con luz lila, fotos
src/components/projects/    casos de proyecto, recorridos animados, mockups, portadas
```

## Pendientes

- Formulario «Trabajemos juntos»: conectar EmailJS para los correos con diseño.
- Instagram: reemplazar el enlace general por el perfil (en `src/content/site.js`, `SOCIAL`).
- Proyecto 4: contenido de ejemplo.
