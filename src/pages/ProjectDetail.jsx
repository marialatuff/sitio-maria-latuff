import { useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ProjectCarousel from '../components/home/ProjectCarousel.jsx';
import { FlowLine } from '../components/home/Solutions.jsx';
import ReadingText from '../components/about/ReadingText.jsx';
import ExampleLogo from '../components/ui/ExampleLogo.jsx';
import ImageSlot from '../components/ui/ImageSlot.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import BlooCase from '../components/projects/BlooCase.jsx';
import PumaCase from '../components/projects/PumaCase.jsx';
import DatamedyCase from '../components/projects/DatamedyCase.jsx';
import ImexCase from '../components/projects/ImexCase.jsx';
import { PROJECTS } from '../content/site.js';

function MetaLabel({ children }) {
  return <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-graphite-mute">{children}</dt>;
}

/** Secciones genéricas (proyectos de ejemplo): h2, párrafo largo y 2 imágenes. */
function GenericSections({ project }) {
  const flowRef = useRef(null);
  return (
    <div ref={flowRef} className="relative">
      <FlowLine containerRef={flowRef} />
      {project.sections.map((s, i) => {
        const last = i === project.sections.length - 1;
        return (
          <section key={i} className="relative mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
            <div className="max-w-2xl">
              <Reveal as="h2" className="t-h3">
                {s.title}
              </Reveal>
              <ReadingText className="mt-6 text-[1.05rem] leading-[1.8]">{s.body}</ReadingText>
            </div>
            <div className="relative mt-10 grid gap-4 bg-paper sm:grid-cols-2 sm:gap-6" {...(last ? { 'data-flow': true } : {})}>
              {s.images.map((src, k) => (
                <Reveal key={k} delay={k * 100}>
                  <ImageSlot src={src} aspect="aspect-[4/5]" />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
      <section className="relative mt-40 sm:mt-48">
        <div data-flow className="relative mx-auto max-w-6xl bg-paper px-5 sm:px-8">
          <Reveal as="h2" className="t-h2">
            Otros proyectos
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/**
 * Detalle de proyecto:
 * título → descripción + soluciones (tags) + empresa (logo) → contenido del caso → otros proyectos.
 * Los proyectos con `layout` propio (Bloo) tienen bloques a medida.
 */
export default function ProjectDetail() {
  const { slug } = useParams();
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) return <Navigate to="/proyectos" replace />;

  const project = PROJECTS[index];
  const others = [...PROJECTS.slice(index + 1), ...PROJECTS.slice(0, index)];

  return (
    <article className="pb-16 font-geist">
      {/* Cabecera */}
      <header className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <Link to="/proyectos" className="inline-flex items-center gap-2 text-sm text-graphite-soft transition-colors hover:text-night">
          <span aria-hidden="true">←</span> Proyectos
        </Link>
        <Reveal as="h1" className="mt-6 max-w-4xl t-h1">
          {project.title}
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
          <ReadingText className="max-w-2xl text-[1.05rem] leading-[1.8]">{project.intro}</ReadingText>

          <dl className="space-y-6">
            <div>
              <MetaLabel>Solución</MetaLabel>
              <dd className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="rounded-full border border-paper-line bg-card px-3 py-1 text-xs font-medium text-graphite">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
            {project.team && (
              <div>
                <MetaLabel>Equipo</MetaLabel>
                <dd className="mt-3 space-y-1">
                  {project.team.map((m) => (
                    <p key={m.name} className="text-sm text-graphite">
                      <span className="text-graphite-soft">{m.role}:</span> {m.name}
                    </p>
                  ))}
                </dd>
              </div>
            )}
            <div>
              <MetaLabel>Empresa</MetaLabel>
              <dd className="mt-3 flex items-center gap-3">
                {project.confidential ? (
                  // Empresa reservada: solo texto, sin logo
                  <span className="text-sm text-graphite">{project.company}</span>
                ) : project.logoColor ? (
                  // Logo real a color original
                  <img src={project.logo} alt={project.company} className="h-9 w-auto object-contain" />
                ) : (
                  <>
                    <ExampleLogo src={project.logo} name={project.company} variant={index} />
                    <span className="text-sm text-graphite">{project.company}</span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {project.layout === 'bloo' ? (
        <BlooCase project={project} />
      ) : project.layout === 'puma' ? (
        <PumaCase project={project} />
      ) : project.layout === 'datamedy' ? (
        <DatamedyCase project={project} />
      ) : project.layout === 'imex' ? (
        <ImexCase project={project} />
      ) : (
        <GenericSections project={project} />
      )}

      <div className="relative z-10 mt-4">
        <ProjectCarousel projects={others} />
      </div>
    </article>
  );
}
