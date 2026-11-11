import ProjectCard from '../cards/ProjectCard.jsx';

/**
 * Cards en movimiento continuo (se pausa al hover/foco).
 * La lista se duplica para un bucle sin cortes; el duplicado se oculta a lectores de pantalla.
 */
export default function ProjectMarquee({ projects }) {
  const loop = [...projects, ...projects];
  return (
    <section aria-label="Proyectos" className="relative overflow-hidden py-6">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-surface-page to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-surface-page to-transparent sm:w-24"
        aria-hidden="true"
      />
      <ul className="flex w-max animate-marquee gap-5 px-5 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {loop.map((p, i) => {
          const isClone = i >= projects.length;
          return (
            <li key={`${p.slug}-${i}`} aria-hidden={isClone || undefined} className="w-[78vw] max-w-sm shrink-0 sm:w-80">
              <ProjectCard project={p} index={i % projects.length} className="h-full" {...(isClone ? { tabIndex: -1 } : {})} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
