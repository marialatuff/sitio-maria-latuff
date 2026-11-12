import ReadingText from '../about/ReadingText.jsx';
import Reveal from '../ui/Reveal.jsx';
import { SectionTitle } from './BlooCase.jsx';
import DatamedyBrand from './DatamedyBrand.jsx';
import DatamedyLanding from './DatamedyLanding.jsx';
import DatamedyModal from './DatamedyModal.jsx';
import { FeaturesMock, PlansMock } from './DatamedyMockups.jsx';

/**
 * Caso Datamedy: requerimientos → 1. La marca (animación de construcción del logo) →
 * 2. Landing / UI Kit (video web que se transforma en móvil, mockups estáticos y modal animada) → otros proyectos.
 */
export default function DatamedyCase({ project }) {
  const { requirements, brand, web, gallery } = project;
  return (
    <>
      {/* Requerimientos */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-28 sm:px-8">
        <Reveal as="h2" className="t-h3">
          {requirements.title}
        </Reveal>
        <ReadingText className="mt-4 max-w-2xl text-[1.05rem]">{requirements.body}</ReadingText>
      </section>

      {/* 1. Diseño de identidad de marca */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
        <SectionTitle className="max-w-3xl">{brand.title}</SectionTitle>
        {brand.body && (
          <ReadingText className="mt-4 max-w-2xl text-[1.05rem]">{brand.body}</ReadingText>
        )}
        <div className="mt-10">
          <DatamedyBrand />
        </div>
      </section>

      {/* 2. Landing page / UI Kit */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle className="max-w-3xl">{web.title}</SectionTitle>
        <div className="mt-10">
          <DatamedyLanding />
        </div>
      </section>

      {/* Mockups estáticos, uno al lado del otro (ya traen su fondo violeta) */}
      <section className="mx-auto mt-5 max-w-6xl px-5 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {gallery.map((img, i) => (
            <Reveal key={img.alt} delay={(i % 2) * 100}>
              {img.anim === 'features' ? (
                <FeaturesMock src={img.src} alt={img.alt} />
              ) : img.anim === 'plans' ? (
                <PlansMock src={img.src} alt={img.alt} />
              ) : (
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full rounded-xl" />
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Modal animada: prueba gratuita */}
      <section className="mx-auto mt-5 max-w-6xl px-5 sm:px-8">
        <DatamedyModal />
      </section>

      <section className="mx-auto mt-40 max-w-6xl px-5 sm:mt-48 sm:px-8">
        <Reveal as="h2" className="t-h2">
          Otros proyectos
        </Reveal>
      </section>
    </>
  );
}
