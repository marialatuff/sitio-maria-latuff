import { ProjectSlide } from '../components/home/ProjectCarousel.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { PROJECTS, PROJECTS_PAGE_TITLE } from '../content/site.js';

/** Proyectos: título grande y todos los proyectos en rejilla de 2 columnas, sin categorías.
 *  Las tarjetas son las mismas que las del carrusel de la Home. */
export default function Projects() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-32 font-geist sm:px-8 sm:pt-40">
      <Reveal as="h1" className="t-h1">
        {PROJECTS_PAGE_TITLE}
      </Reveal>

      <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 md:gap-8">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 100}>
            <ProjectSlide project={p} index={i} className="w-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
