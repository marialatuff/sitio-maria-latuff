import HeroThreads from '../components/home/HeroThreads.jsx';
import HomeButton from '../components/home/HomeButton.jsx';
import ProjectCarousel from '../components/home/ProjectCarousel.jsx';
import Solutions from '../components/home/Solutions.jsx';
import HomeTestimonials from '../components/home/HomeTestimonials.jsx';
import { HOME_V2, PROJECTS, TESTIMONIALS } from '../content/site.js';

/** Home v2. Header y footer gigante vienen del Layout. */
export default function Home() {
  const { hero, solutions, testimonialsTitle } = HOME_V2;
  return (
    <div className="font-geist text-graphite">
      {/* 1. Hero: telón con la "m", hilos que ondulan y título que se parte al hacer scroll */}
      <HeroThreads
        title={hero.title}
        titleLines={hero.titleLines}
        paragraph={hero.paragraph}
        highlights={hero.highlights}
      />

      {/*
        El resto de la Home sube sobre el hero fijo, que se disuelve (desenfoque + fundido).
        Sin bordes ni sombra: un degradado del color del fondo hace que el hero se funda con la sección.      */}
      <div className="relative z-10 -mt-[100svh] bg-paper pt-10 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-full h-[35svh] bg-gradient-to-b from-paper/0 to-paper"
        />
        {/* 2. Proyectos (sin título) */}
        <div id="proyectos-home" className="relative z-10 scroll-mt-24">
          <ProjectCarousel projects={PROJECTS} />
          <div className="flex justify-center pb-16">
            <HomeButton variant="soft" label="Ver proyectos" href="/proyectos" />
          </div>
        </div>

        {/* 3. Soluciones */}
        <div className="relative z-10">
          <Solutions data={solutions} />
        </div>

        {/* 4. Testimonios */}
        <HomeTestimonials title={testimonialsTitle} items={TESTIMONIALS} />
      </div>
    </div>
  );
}
