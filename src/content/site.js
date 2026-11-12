/**
 * Todo el copy del sitio. Base: Contenido.md y Arquitectura.md, con las
 * correcciones aprobadas por María (rol, años, contacto unificado y gramática).
 * Este archivo es ahora la fuente de verdad del copy.
 * Los campos marcados con TODO no tienen copy todavía.
 */

// Logos de clientes (testimonios)
import kpiManagersLogo from '../assets/logos/kpi-managers.png';
import foreachLogo from '../assets/logos/foreach.png';
import mariaPhoto1 from '../assets/about/maria-1.jpg';
// Proyecto Bloo
import blooLogo from '../assets/projects/bloo/logo.png';
import blooInicio from '../assets/projects/bloo/inicio-docente.jpg';
import blooPanel from '../assets/projects/bloo/panel-director.jpg';
// Proyecto Datamedy
import dmLogo from '../assets/projects/datamedy/logo.png';
import dmHero from '../assets/projects/datamedy/mock-hero.jpg';
import dmCaracteristicas from '../assets/projects/datamedy/mock-caracteristicas.jpg';
import dmPlanes from '../assets/projects/datamedy/mock-planes.jpg';
import dmFooter from '../assets/projects/datamedy/mock-footer.jpg';
// Proyecto PUMA
import pumaLogo from '../assets/projects/puma/logo.png';
import pumaLoginImg from '../assets/projects/puma/login.jpg';
import pumaFormularios from '../assets/projects/puma/formularios.jpg';
import pumaAgregarPregunta from '../assets/projects/puma/agregar-pregunta.jpg';
import pumaAgregarUsuario from '../assets/projects/puma/agregar-usuario.jpg';
import pumaCargaDocs from '../assets/projects/puma/carga-documentos.jpg';
import pumaPostulante from '../assets/projects/puma/postulante.jpg';
import pumaPostulanteForms from '../assets/projects/puma/postulante-formularios.jpg';
import blooEvaluaciones from '../assets/projects/bloo/mis-evaluaciones.png';
import blooAsistencia from '../assets/projects/bloo/control-asistencia.png';
// Fotos de clientes (testimonios)
import imexCover from '../assets/projects/imex/aterrizaje.jpg';
import imexPortada from '../assets/projects/imex/portada.jpg';
import imexOnboarding from '../assets/projects/imex/onboarding.jpg';
import imexDashboard from '../assets/projects/imex/dashboard.jpg';
import imexPerfil from '../assets/projects/imex/perfil.jpg';
import imexContrato from '../assets/projects/imex/contrato.jpg';
import imexFacturas from '../assets/projects/imex/facturas.jpg';
import imexTickets from '../assets/projects/imex/tickets.jpg';
import imexTicketsVacio from '../assets/projects/imex/tickets-vacio.jpg';
import imexClaroValor from '../assets/projects/imex/claro-valor.jpg';
import imexClaroAbout from '../assets/projects/imex/claro-about.jpg';
import imexClaroDocumento from '../assets/projects/imex/claro-documento.jpg';
import imexClaroTickets from '../assets/projects/imex/tickets-light.jpg';
import imexClaroPropuesta from '../assets/projects/imex/claro-propuesta.jpg';

import robertoPhoto from '../assets/testimonials/roberto-perez-de-arce.jpg';

// Enlace público (viewform) del Google Form; no usar el enlace /edit
export const FORM_URL =
  'https://docs.google.com/forms/d/1dbhpoVFxC_rf5Ik19cDMUD_ETXzBBLwNQZ400cVk0X8/viewform';

export const CTA_LABEL = 'Deseo trabajar contigo María';

export const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/conoceme', label: 'Conóceme' },
  { to: '/mi-oferta', label: 'Mi oferta' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
];

/* ---------- Bloque de contacto (igual en todas las páginas) ---------- */
export const CONTACT = {
  title: '¡A un paso de trabajar juntos y sumar a tu equipo!',
  subtitle:
    'Para avanzar, ¿podrías compartirme algunos detalles sobre tus expectativas? Con esa información, me pondré en contacto contigo en las próximas 24 horas para coordinar una llamada y aterrizar la propuesta.',
  cta: CTA_LABEL,
};

/* ---------- A. Inicio ---------- */
export const HOME = {
  hero: {
    title:
      'Los grandes productos no ocurren por casualidad: deben ser investigados, diseñados y proyectados con la posibilidad de adaptarse a los cambios del mercado. Y eso es lo que hago.',
    paragraphStrong:
      'Soy una AI Product Builder con +7 años de trayectoria. Mi trabajo consiste en ser el puente entre la psicología del usuario, los objetivos de negocio y el diseño de soluciones tecnológicas.',
    paragraph:
      'Combino la Inteligencia Artificial con criterio humano y profesional para desarrollar productos adaptados a las necesidades reales de cada negocio y sus clientes.',
    cta: CTA_LABEL,
  },
  testimonialsTitle: 'Ellos delegaron en mí y este fue el resultado',
};

/* ---------- Home v2 (wireframe Wire-home.pdf) ---------- */
export const HOME_CTA = 'Trabajemos juntos';
// Página propia del formulario (destino del botón "Trabajemos juntos")
export const WORK_PATH = '/trabajemos-juntos';

export const WORK_FORM = {
  title: 'Trabajemos juntos',
  stages: [
    'Aún no he empezado (Tengo una idea)',
    'En fase inicial (Diseño o requerimientos)',
    'Fase avanzada (Desarrollo en curso)',
    'Ya cuento con un MVP / Producto en producción',
  ],
  success: 'Mensaje enviado, ¡Feliz de que demos el primer paso!',
  error: 'No se pudo enviar. Inténtalo de nuevo en unos minutos.', // TODO: confirmar copy con María
  sending: 'Enviando…',
  /*
   * Correo donde llegan las respuestas (servicio FormSubmit, sin cuenta).
   * El primer envío manda a ese correo un email de activación que hay que confirmar.
   * Después FormSubmit da un código que puede reemplazar al correo aquí, para no mostrarlo en el código.
   * Vacío = el formulario solo muestra el mensaje, sin enviar nada.
   */
  email: 'mglm92@gmail.com',
  // Correo automático que recibe el cliente al enviar (FormSubmit solo permite texto plano).
  // {web} se reemplaza por la dirección del sitio desde donde se envió.
  autoReply:
    '¡Hola! He recibido tu formulario.\n\nTe contactaré dentro del plazo para confirmar nuestra reunión. Será por esta misma vía, el correo electrónico.\n\n¡Un saludo!\n\nMaría Latuff\nAI Product Builder\n{web}',
};

export const HOME_NAV = [
  { to: '/', label: 'Home' },
  { to: '/conoceme', label: 'Conóceme' },
  { to: '/mi-oferta', label: 'Soluciones' },
  { to: '/proyectos', label: 'Proyectos' },
];

export const HOME_V2 = {
  hero: {
    title: 'Hola, soy María Latuff y transformo productos en experiencia de impacto.',
    titleLines: ['Hola, soy María Latuff y transformo', 'productos en experiencia de impacto.'], // título en 2 líneas
    paragraph:
      'Soy el puente entre la psicología del usuario, los objetivos de negocio y el diseño de tus soluciones tecnológicas.',
    // Fragmentos del párrafo que se resaltan uno a uno (uno por cada hilo del hero)
    highlights: ['la psicología del usuario', 'los objetivos de negocio', 'el diseño de tus soluciones tecnológicas'],
  },
  intro: {
    title: 'Los mejores productos se diseñan con estrategia y visión de futuro. Eso es lo que hago.',
    subtitle:
      'Como AI Product Builder fusiono IA con visión estratégica para desarrollar productos que resuelven problemas reales.',
  },
  solutions: {
    title: 'Soluciones adaptadas a tu necesidad.',
    subtitle:
      'He diseñado propuestas de gestión con las que podemos tomar las riendas del proyecto y dar resultados estratégicos y exitosos.',
    items: [
      {
        id: 'colaboracion-por-proyecto',
        label: '01',
        title: 'Colaboración por proyecto',
        body: 'Transformo tu idea desde cero o hago evolucionar tu producto actual mediante investigación, definición de alcance y prototipado con IA. Validamos y probamos la solución antes de escribir una sola línea de código para garantizar un producto preciso y adaptado al mercado.',
        graphic: 'project',
      },
      {
        id: 'loop-de-trabajo-flexible',
        label: '02',
        title: 'Loop de trabajo flexible',
        body: 'Comenzamos un breve periodo de colaboración juntos y permanezco contigo hasta que el producto esté en el mercado. Los tiempos los validamos juntos.',
        graphic: 'loop',
      },
    ],
  },
  testimonialsTitle: 'La experiencia de colaborar conmigo',
  footer: {
    title: '¿Listo para dar el paso?',
    body: 'Coordinemos una llamada de 30 minutos gratuita.',
    credit: 'Este sitio fue creado con asistencia de IA bajo mi criterio humano. Powered by María Latuff',
  },
};

export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/in/maria-gabriela-latuff-millan',
  instagram: 'https://www.instagram.com/', // TODO: cambiar por el perfil cuando esté listo
  email: 'https://mail.google.com/', // enlace general de Gmail
};

/* ---------- Proyectos (placeholder hasta tener copy) ---------- */
export const PROJECT_CTA = 'Ver proyecto';

export const PROJECTS_PAGE_TITLE = 'Proyectos';

const LOREM_LONG =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/**
 * Proyectos (contenido de ejemplo hasta tener la información real).
 * - title / description: tarjeta del listado y del carrusel de la Home
 * - cover: imagen de la tarjeta (null = relleno)
 * - company / logo: empresa con la que participé (logo null = logo de ejemplo)
 * - tags: soluciones aportadas
 * - intro: texto descriptivo de la cabecera del detalle
 * - sections: 3 bloques con h2, párrafo largo y 2 imágenes (null = relleno)
 */
const EXAMPLE_TAGS = [
  ['Product Designer', 'UX UI Designer'],
  ['UI Designer', 'Branding'],
  ['Product Designer', 'Research'],
  ['UX UI Designer', 'Prototipado con IA'],
];

/* Proyecto 1: Bloo (copy de Proyectos.md) */
const BLOO = {
  slug: 'bloo-gestion-educativa',
  layout: 'bloo', // página con bloques propios (ver src/components/projects/BlooCase.jsx)
  title: 'Plataforma Modulable de Gestión Educativa SaaS para el Mercado Chileno',
  cover: blooInicio,
  coverPosition: 'object-top',
  coverArt: 'bloo', // portada compuesta: fondo azul + web y móvil (src/components/projects/BlooCover.jsx)
  company: 'Bloo',
  logo: blooLogo,
  logoColor: true, // el logo se muestra con su color original
  tags: ['AI Product Builder', 'Product Manager', 'Research'],
  intro:
    'Diseño y arquitectura de una plataforma B2B multi-tenant para Bloo, creada para resolver la complejidad operativa del sistema educativo en Chile. El producto permite estructurar permisos granulares y habilitar módulos específicos según el rol administrativo (Institución, Director, Tesorero), adaptándose con flexibilidad a la escala organizativa de cualquier establecimiento académico.',
  sheet: [
    { label: 'Rol', value: 'AI Product Builder & Strategist' },
    { label: 'Alcance', value: 'B2B / SaaS empresarial / Sector de tecnología educativa' },
    { label: 'Mercado', value: 'Chile' },
    { label: 'Metodología', value: 'Pruebas con usuarios sintéticos + Prototipado paralelo con IA' },
  ],
  context: {
    title: 'Contexto, fricción operativa y solución estratégica',
    items: [
      {
        title: 'El Contexto',
        body: 'Las instituciones educativas en Chile operan bajo estructuras administrativas muy heterogéneas. La empresa Bloo identificó la oportunidad de mercado de desarrollar una solución integral de gestión, con la visión de centralizar la administración operativa y financiera en una plataforma única.',
      },
      {
        title: 'La Fricción Operativa y Financiera',
        body: 'La mayoría de los softwares de gestión educativa en el mercado chileno sufren de rigidez estructural: no logran adaptarse a la diversidad de canales internos ni a las jerarquías operativas reales. Esta falta de flexibilidad generaba cuellos de botella en la asignación de permisos, riesgos en la seguridad de la información financiera y alta fricción en la adopción por parte del personal administrativo.',
      },
      {
        title: 'La Solución Estratégica',
        body: 'Diseñamos y estructuramos una arquitectura de producto modular y altamente configurable. El sistema permite a Bloo aprovisionar capacidades a la medida de cada cliente, ajustando vistas, permisos y herramientas según el perfil operativo (Directivos, Tesorería, Administración) y la escala de la institución.',
      },
    ],
  },
  // Galería final en pantallas MacBook (la primera va en grande); alt = leyenda bajo cada pantalla
  gallery: [
    { src: blooPanel, alt: 'Panel de control del Director' },
    { src: blooInicio, alt: 'Inicio del docente' },
    { src: blooEvaluaciones, alt: 'Mis evaluaciones' },
    { src: blooAsistencia, alt: 'Control de asistencia' },
    // Previsualización de evaluación se reemplazó por el recorrido interactivo de Aprobación de gastos
  ],
  management: {
    title: 'Gestión de producto',
    steps: [
      {
        title: 'Etapa Pre-Diseño (Alineación Estratégica)',
        body: 'Definición del marco de trabajo junto a los stakeholders de Bloo. Evaluamos variables críticas de tiempo, costo y alcance para establecer una hoja de ruta con objetivos de producto realistas y alcanzables desde la primera iteración.',
      },
      {
        title: 'Etapa de Investigación (Market & Competitor Intelligence)',
        body: 'Ejecución de un análisis competitivo profundo del sector EdTech en Chile. Presentamos los hallazgos clave a la dirección para tomar decisiones informadas sobre la diferenciación del producto y las funcionalidades nucleares.',
      },
      {
        title: 'Etapa de Planificación y Mitigación de Riesgos',
        body: 'Descomposición del desarrollo en entregables clave, estableciendo hitos de validación, calendario de revisiones y un plan proactivo de gestión de riesgos para proteger los plazos de salida al mercado.',
      },
    ],
  },
  architecture: {
    title: 'Arquitectura de Experiencia & Integración de IA',
    steps: [
      {
        title: 'Mapeo de Flujos basado en Jobs-to-be-Done (JTBD)',
        body: 'Estructuración de la experiencia de usuario priorizando las tareas reales y necesidades concretas de cada perfil administrativo y canal institucional.',
        // TODO: ejemplos ilustrativos propuestos por Claude; María debe confirmarlos o reemplazarlos por los reales
        visual: 'jobmap',
        example: {
          stages: ['Planificar', 'Ejecutar', 'Controlar'],
          roles: [
            { name: 'Director', tasks: ['Revisar indicadores', 'Aprobar planificaciones', 'Monitorear asistencia'] },
            { name: 'Tesorero', tasks: ['Proyectar ingresos', 'Aprobar gastos', 'Conciliar cuentas'] },
            { name: 'Docente', tasks: ['Preparar clases', 'Tomar asistencia', 'Registrar notas'] },
          ],
          result: 'El menú de cada rol se ordena por su trabajo real, no por módulos del sistema.',
        },
      },
      {
        title: 'Ejecución Paralela Impulsada por IA',
        body: 'Aceleración del ciclo de diseño mediante entornos de Vibe Coding y prototipado rápido. Evaluamos la arquitectura de información en fases de mediana fidelidad, reduciendo drásticamente el tiempo entre el concepto y la validación.',
        visual: 'parallel',
        example: {
          variants: [
            { name: 'Variante A', note: 'Menú por módulos' },
            { name: 'Variante B', note: 'Menú por rol', chosen: true },
            { name: 'Variante C', note: 'Panel de tareas' },
          ],
          result: 'Tres arquitecturas en mediana fidelidad comparadas en un mismo ciclo; la B pasa a pruebas.',
        },
      },
      {
        title: 'Pruebas Sintéticas con Agentes de IA',
        body: 'Implementación de pruebas con usuarios sintéticos simulando los distintos roles (Director, Tesorero, Administrativo) para detectar inconsistencias de navegación, sesgos en los flujos de permisos y vacíos lógicos en la interfaz de forma previa a las pruebas en campo.',
        visual: 'synthetic',
        example: {
          findings: [
            { agent: 'Tesorero', status: 'error', text: 'Recorre tres módulos antes de encontrar «Solicitud de gastos».' },
            { agent: 'Director', status: 'warn', text: 'Ve el detalle financiero de Tesorería sin necesitarlo: permiso demasiado amplio.' },
            { agent: 'Administrativo', status: 'ok', text: 'Completa la matrícula de un estudiante sin bloqueos.' },
          ],
          decisions: [
            '«Solicitud de gastos» pasa al menú principal del rol Tesorero.',
            'El Director ve solo el resumen financiero; el detalle queda en Tesorería.',
          ],
        },
      },
      {
        title: 'Validación y Refinamiento con Usuarios Reales',
        body: 'Verificación final con usuarios del sistema educativo chileno, ajustando la interfaz a partir de datos reales de usabilidad y asegurando una curva de aprendizaje mínima para el personal académico.',
        visual: 'validation',
        example: {
          tasks: ['Tomar asistencia', 'Registrar una calificación', 'Crear un recurso'],
          result: 'Ajustes finales de interfaz a partir del uso real: las tareas diarias se resuelven sin ayuda.',
        },
      },
    ],
    // Proceso visual: del requerimiento estratégico al diseño (se itera con María)
    process: {
      job: 'Cuando inicio mi jornada, quiero ver mis clases, materias y pendientes en un solo lugar, para preparar mi día sin perder tiempo.', // TODO: JTBD de ejemplo, confirmar con María
      flow: ['Inicio docente', 'Mis materias', 'Detalle asignatura', 'Evaluaciones'],
      screens: [blooInicio, null, null], // TODO: pantallas que subirá María
    },
  },
};

/* Proyecto 2: PUMA Recruiter (copy de Proyectos (1).md) */
const PUMA = {
  slug: 'puma-recruiter',
  layout: 'puma', // misma estructura de página que Bloo (ver src/components/projects/PumaCase.jsx)
  title: 'PUMA Recruiter: Gestión interna',
  coverArt: 'puma',
  company: 'PUMA',
  logo: pumaLogo,
  logoColor: true,
  tags: ['UX UI Designer'],
  team: [{ role: 'Líder Técnico', name: 'Roberto Pérez de Arce' }], // bloque "Equipo" bajo Solución
  intro: 'Diseño y experiencia de plataforma de gestión interna web responsiva de Puma.',
  sheet: [
    { label: 'Rol', value: 'UX UI Designer' },
    { label: 'Alcance', value: 'Sector HR Tech (Tecnología de Recursos Humanos)' },
    { label: 'Mercado', value: 'Chile' },
  ],
  context: {
    title: 'El problema y la solución estratégica',
    items: [
      {
        title: 'El problema',
        body: 'PUMA gestionaba sus procesos de selección mediante plataformas de terceros que no se adaptaban a su flujo operativo. Esto generaba dispersión en la información y poca autonomía en el seguimiento de candidatos.',
      },
      {
        title: 'La solución Estratégica',
        body: 'Puga, Mujica Asociados S.A. (PUMA) es una destacada empresa chilena de ingeniería y construcción con más de 40 años de trayectoria. Para optimizar su gestión del talento, se desarrolló un software personalizado que permite a su equipo de selección captar y gestionar integralmente los procesos de reclutamiento.',
      },
    ],
  },
  management: {
    title: 'Gestión de producto',
    steps: [
      {
        title: 'Etapa Alineación Estratégica',
        body: 'Definición del marco de trabajo junto al equipo de PUMA. Evaluamos variables y alcance para establecer una hoja de ruta con objetivos.',
      },
    ],
  },
  architecture: {
    title: 'Arquitectura de Experiencia & Integración de IA',
    steps: [
      {
        title: 'Mapeo de Flujos de usuario y expectativa de usuario / negocio',
        body: 'Estructuración de la experiencia de usuario priorizando las tareas reales y necesidades concretas de cada perfil.',
        visual: 'puma-meeting', // reunión con el equipo → documento funcional con flujo de usuario
      },
      {
        title: 'Ejecución Paralela Impulsada por IA',
        body: 'Aceleración del ciclo de diseño mediante entornos de Vibe Coding y prototipado rápido. Evaluamos la arquitectura de información en fases de mediana fidelidad, reduciendo drásticamente el tiempo entre el concepto y la validación.',
        visual: 'parallel',
      },
      {
        title: 'Validación y Refinamiento con equipo PUMA',
        body: 'Verificación final con usuarios PUMA, ajustando la interfaz a partir de datos reales de usabilidad.',
        visual: 'puma-test', // prueba de uso con el equipo, con las pantallas reales
        screens: [pumaLoginImg, pumaFormularios, pumaAgregarPregunta],
      },
    ],
  },
  // Vistas web estáticas, en el orden indicado por María (van entre los dos recorridos finales)
  gallery: [
    { src: pumaAgregarUsuario, alt: 'Agregar usuario y descarga de antecedentes' },
    { src: pumaCargaDocs, alt: 'Carga de documentos' },
    { src: pumaPostulante, alt: 'Ficha del postulante' },
    { src: pumaPostulanteForms, alt: 'Formularios del postulante' },
  ],
};

/* Proyecto 3: Datamedy */
const DATAMEDY = {
  slug: 'datamedy-landing',
  layout: 'datamedy', // ver src/components/projects/DatamedyCase.jsx
  title: 'Landing page Datamedy / UI KiT',
  cover: dmHero,
  coverArt: 'datamedy', // portada estática: iPhone en perspectiva (src/components/projects/DatamedyCover.jsx)
  company: 'Datamedy',
  logo: dmLogo,
  logoColor: true,
  tags: ['Diseñador de Marca', 'Diseñador UX UI'],
  intro: 'Diseño y experiencia de Landing page de la empresa.',
  requirements: {
    title: 'Sobre el proyecto',
    body: 'Datamedy es una aplicación que le permite al profesional de la salud gestionar sus citas médicas en Chile. Sus fundamentos son la comunicación y la conexión con el paciente.',
  },
  brand: {
    title: '1. Diseño de identidad de marca',
    body: 'Conceptualización y diseño de sistemas de identidad visual estratégicos para datamedy. Transformo la esencia y propuesta de valor de un negocio en una marca memorable, coherente y escalable a través de todos sus puntos de contacto.',
  },
  web: { title: '2. Landing page / UI Kit' },
  // Mockups estáticos (ya traen su fondo violeta)
  gallery: [
    { src: dmHero, alt: 'Hero de la landing' },
    { src: dmCaracteristicas, alt: 'Características', anim: 'features' },
    { src: dmPlanes, alt: 'Planes especiales', anim: 'plans' },
    { src: dmFooter, alt: 'Llamado a la acción y footer' },
  ],
};

const IMEX = {
  slug: 'ecosistema-de-adquisicion',
  layout: 'imex', // misma arquitectura de página que Bloo (ver src/components/projects/ImexCase.jsx)
  title: 'Ecosistema de adquisición',
  cover: imexPortada, // portada de la tarjeta (imagen de María)
  company: 'Reservada',
  confidential: true, // la empresa se muestra como texto, sin logo
  logo: null,
  tags: ['AI Product Builder', 'Research'],
  intro: 'Diseñar un ecosistema de adquisición y activación de usuarios interesados en datos de comercio exterior.',
  sheet: [
    { label: 'Alcance', value: 'B2C' },
    { label: 'Mercado', value: 'India / Europa' },
    { label: 'Metodología', value: 'Investigación + Prototipado paralelo con IA' },
  ],
  context: {
    title: 'Contexto',
    body: 'Diseñar un ecosistema de adquisición y activación de usuarios interesados en datos de comercio exterior. El reto consistió en estructurar un embudo de conversión multicanal que guiara a los prospectos desde el primer contacto hasta la plataforma principal, logrando tres objetivos clave.',
    needTitle: 'Necesidad',
    needs: [
      { title: 'Captación multicanal', body: 'Integrar distintos puntos de entrada para atraer y registrar clientes potenciales de forma fluida.' },
      { title: 'Onboarding personalizado', body: 'Diseñar un flujo de bienvenida orientado a perfilar los intereses comerciales de cada usuario desde el primer momento.' },
      { title: 'Conversión a plataforma', body: 'Conducir a los usuarios calificados hacia el entorno premium, entregándoles inteligencia de datos relevante según su perfil.' },
    ],
  },
  // Modo oscuro: vistas web en ventana de Mac (2 en 2) + animación responsiva de 3 pantallas
  dark: {
    title: 'Modo Oscuro',
    gallery: [
      { src: imexCover, alt: 'Aterrizaje' },
      { src: imexOnboarding, alt: 'Onboarding' },
      { src: imexDashboard, alt: 'Sala virtual: propuesta de valor' },
      { src: imexPerfil, alt: 'Perfil' },
      { src: imexContrato, alt: 'Vista de contrato' },
      { src: imexFacturas, alt: 'Facturas' },
      { src: imexTickets, alt: 'Mis tickets' },
      { src: imexTicketsVacio, alt: 'Mis tickets: sin solicitudes' },
    ],
  },
  // Modo claro: vistas web (la propuesta larga ocupa el ancho y se desplaza sola) + animación responsiva
  light: {
    title: 'Modo Claro',
    gallery: [
      { src: imexClaroValor, alt: 'Propuesta de valor' },
      { src: imexClaroAbout, alt: 'About Imexdbusiness' },
      { src: imexClaroDocumento, alt: 'Vista de documento' },
      { src: imexClaroTickets, alt: 'Mis tickets' },
      { src: imexClaroPropuesta, alt: 'Propuesta: Nowcasting revenue with customs data', wide: true, shift: '-71.85%' },
    ],
  },
};

// Proyecto de ejemplo (ya no se muestra; se reemplazó por el Ecosistema de adquisición)
const EXAMPLE_PROJECTS = [4].map((n, i) => ({
  slug: `proyecto-${n}`,
  title: `Título de ejemplo ${n}`, // TODO
  description: 'Texto descriptivo de ejemplo', // TODO
  cover: null, // TODO
  company: `Empresa ${n}`, // TODO
  logo: null, // TODO: ruta al logo
  tags: EXAMPLE_TAGS[i + 1], // TODO
  intro: LOREM_LONG, // TODO
  sections: [1, 2, 3].map((k) => ({
    title: `Título de sección ${k}`, // TODO
    body: LOREM_LONG, // TODO
    images: [null, null], // TODO
  })),
}));

export const PROJECTS = [BLOO, PUMA, DATAMEDY, IMEX];

/* ---------- Testimonios ----------
 * headline: frase destacada · quote: testimonio · name / role: persona y cargo
 * company: empresa · photo: foto de la persona · logo: ruta al logo (se muestra en blanco y negro)
 * website: sitio web
 */
const REAL_TESTIMONIALS = [
  {
    headline: 'Va más allá del diseño',
    quote:
      'Hemos hecho varios trabajos con María y siempre ha respondido a tiempo y con una actitud propositiva que va más allá del solo diseño.',
    name: 'Roberto Pérez De Arce',
    role: 'Gerente general',
    company: 'KPI Managers',
    photo: robertoPhoto,
    logo: kpiManagersLogo,
    website: 'https://kpimanagers.com/',
  },
  {
    headline: 'María tiene criterio, cumplimiento y calidad',
    quote:
      'Trabajamos con María en el diseño de distintas piezas para ForEach Software. Destacó su buena disposición y su compromiso con cada encargo: siempre estuvo abierta a recibir comentarios y a hacer los ajustes necesarios. Cumple con los tiempos de entrega, algo que para nosotros es fundamental, y el resultado gráfico es de buena calidad. Funciona muy bien cuando recibe un brief claro con los objetivos de cada pieza, y a partir de ahí resuelve el diseño con criterio y buen gusto.',
    name: 'Franco Margozzini Valdés',
    role: 'Founder',
    company: 'ForEach Software',
    photo: null, // pendiente: foto de LinkedIn
    logo: foreachLogo,
    website: 'https://foreach.cl/',
  },
];

// Relleno temporal hasta completar los testimonios reales
const LOREM_TESTIMONIALS = [
  ['Consectetur adipiscing elit', 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'],
  ['Sed do eiusmod tempor', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
  ['Ut enim ad minim veniam', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'],
].map(([headline, quote], i) => ({
  headline,
  quote,
  name: 'Lorem Ipsum',
  role: 'Cargo',
  company: `Empresa ${i + 2}`,
  photo: null,
  logo: null,
  website: '',
}));

export const TESTIMONIALS = [...REAL_TESTIMONIALS, ...LOREM_TESTIMONIALS];

/* ---------- B. Conóceme ---------- */
export const ABOUT = {
  hero: {
    title: 'María Latuff: Tu partner en diseño de productos',
    paragraphs: [
      [
        'Soy una ',
        { strong: 'AI Product Builder con +7 años de trayectoria' },
        '. Mi trabajo consiste en ser el puente entre la psicología del usuario, los objetivos de negocio y el diseño de soluciones tecnológicas. Combino la Inteligencia Artificial con criterio humano y profesional para desarrollar productos adaptados a las necesidades reales de cada negocio y sus clientes.',
      ],
      ['Me encanta pensar profundamente, encontrar oportunidades en cada hallazgo y, sobre todo, innovar.'],
      [
        'Antes de la primera línea de diseño, y como futura psicóloga clínica, busco entender el estado actual de la solicitud. Diseño procesos que permiten adaptar el desarrollo de producto a un mercado innovador. Soy una estratega apasionada por los objetivos y enfocada en planes de acción.',
      ],
      [
        'Como diseñadora externa que te acompañará en ese recorrido, juntos diseñaremos la mejor solución a las inquietudes del día a día.',
      ],
    ],
  },
  pillars: {
    title: 'Mis pilares para un camino lleno de éxito',
    items: [
      {
        title: 'Investigación Empírica & Psicología de Producto',
        body: 'Me sumerjo profundamente en las necesidades reales del usuario utilizando herramientas de psicología cognitiva, testeo y métricas de comportamiento para diseñar con base en datos.',
      },
      {
        title: 'Productos con Propósito',
        body: 'Diseño soluciones enfocadas estrictamente en lo que se necesita, reduciendo al mínimo las suposiciones y maximizando el valor del producto.',
      },
      {
        title: 'Desarrollo Acelerado & Vibe Coding con IA',
        body: 'Integro flujos de desarrollo asistidos por Inteligencia Artificial para prototipar, construir y probar en tiempos récord. Esto me permite reducir la brecha entre la idea y el software funcional, validado con datos.',
      },
      {
        title: 'Enfoque de Trabajo Adaptado a tu Negocio',
        body: 'Me integro como una partner clave de tu equipo, diseñando una metodología de colaboración totalmente alineada con tus objetivos.',
      },
      {
        title: 'Liderazgo Estratégico y Visionario',
        body: 'No solo obtendrás una aliada técnica, sino un liderazgo transformacional. Creo firmemente que todos tenemos potencial de éxito, y una de mis metas al trabajar en equipo es impulsarlo en los demás, porque juntos somos más fuertes.',
      },
    ],
  },
  mindset: {
    title: 'La mentalidad detrás de mi gestión: Atleta Híbrida con estrategia y resiliencia',
    subtitle:
      'Como atleta híbrida (CrossFit + MMA), mi día a día se rige por la consistencia, la estrategia y la adaptabilidad. Aplico exactamente esa misma disciplina de alto rendimiento al diseño y desarrollo de productos digitales.',
    items: [
      {
        title: 'Enfoque y Claridad:',
        body: 'La exigencia deportiva me otorga la disciplina y la visión necesarias para tomar decisiones estratégicas firmes y acertadas.',
      },
      {
        title: 'Disciplina y Transparencia:',
        body: 'En el alto rendimiento no existen los atajos; por eso trabajo con procesos claros, honestidad radical y comunicación transparente.',
      },
      {
        title: 'Alta Resiliencia:',
        body: 'El deporte enseña a gestionar escenarios complejos antes, durante y después de competir. Esa experiencia me convierte en una profesional resiliente, enfocada en iterar y mejorar continuamente.',
      },
      {
        title: 'Comunicación y mentalidad de éxito:',
        body: 'Sabemos que existe una curva de adaptación y aprendizaje. Como tu líder encargada, apoyaré al equipo en este proceso sacando lo mejor de cada uno para lograr los objetivos.',
      },
    ],
  },
};

/** Animación de cada pilar (mismo orden que ABOUT.pillars.items). */
export const PILLAR_GRAPHICS = ['research', 'purpose', 'code', 'fit', 'lead'];

/** Fotos de Conóceme: rutas a las imágenes cuando estén (null = hueco de relleno). */
export const ABOUT_PHOTOS = [mariaPhoto1]; // Única foto de Conóceme

/* ---------- C. Mi oferta ---------- */
// Los servicios muestran solo su título (sin "Servicio 1/2/3").
const PROCESS_BASE = [
  'Combinamos investigación de producto y estrategia comercial.',
  'Definimos el alcance.',
  'Diseñamos la solución y la prototipamos con asistencia de inteligencia artificial para validarla.',
  'Realizamos pruebas antes de la primera línea de código.',
];

export const OFFER = {
  hero: {
    title: 'Soluciones adaptadas a tu necesidad.',
    paragraph:
      'He diseñado propuestas de gestión con las que podemos tomar las riendas del proyecto y obtener resultados estratégicos y exitosos.',
  },
  services: [
    {
      id: 'colaboracion-por-proyecto',
      title: 'Colaboración por proyecto',
      bullets: [
        'Tienes una idea de producto que no sabes cómo desarrollar.',
        'Ya tienes el producto avanzado y deseas continuidad.',
      ],
      process: PROCESS_BASE,
    },
    {
      id: 'acompanamiento-escalado',
      title: 'Acompañamiento escalado.',
      paragraph:
        'Comenzamos un breve periodo de colaboración juntos y permanezco contigo hasta que el producto esté en el mercado. Los tiempos los validamos juntos.',
      process: [...PROCESS_BASE, 'Hacemos una evaluación post mortem.'],
    },
    {
      id: 'trabajo-semanal',
      title: 'Trabajo semanal.',
      paragraph:
        'Podemos desarrollar un plan de trabajo adaptado y fijo semanal, acorde al estado del proyecto y a tu persona, sin sacrificar el éxito del desarrollo de producto.',
      process: [
        'Diagnosticamos el estado actual del proyecto y sus prioridades.',
        'Acordamos un plan de trabajo semanal fijo, con objetivos y entregables claros.',
        'Ejecutamos las tareas de producto planificadas para la semana.',
        'Revisamos los avances juntos y ajustamos el plan de la semana siguiente.',
      ],
    },
  ],
  advance: {
    title: '¡Avancemos!',
    subtitle:
      'Escríbeme y, en una llamada de 30 minutos en la que me contarás tu necesidad, seguro armaremos un plan de trabajo adaptado y exitoso.',
  },
};
