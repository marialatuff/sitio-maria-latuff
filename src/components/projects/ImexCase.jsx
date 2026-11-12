import ReadingText from '../about/ReadingText.jsx';
import Reveal from '../ui/Reveal.jsx';
import { SectionTitle, Sheet } from './BlooCase.jsx';
import ImexFlow from './ImexFlow.jsx';
import ImexResponsive from './ImexResponsive.jsx';
import MacGallery from './MacGallery.jsx';

/**
 * Caso Ecosistema de adquisición: misma arquitectura de página que Bloo.
 * Ficha → recorrido interactivo principal → contexto + necesidad → modo oscuro y modo claro (galería + responsivo) → otros proyectos.
 */
export default function ImexCase({ project }) {
  const { sheet, context, dark, light } = project;
  return (
    <>
      <Sheet items={sheet} />

      {/* Recorrido interactivo principal */}
      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <ImexFlow />
      </section>

      {/* Contexto y necesidad */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle className="max-w-3xl">{context.title}</SectionTitle>
        <ReadingText className="mt-6 max-w-3xl text-[1.05rem]">{context.body}</ReadingText>

        <Reveal as="h3" className="mt-16 t-h3">
          {context.needTitle}
        </Reveal>
        <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-10">
          {context.needs.map((it, i) => (
            <Reveal key={it.title} delay={i * 120}>
              <span className="inline-block rounded bg-night px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-paper">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="mt-4 t-h4">{it.title}</h4>
              <ReadingText className="mt-3 text-[0.98rem] leading-[1.75]">{it.body}</ReadingText>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Modo oscuro: vistas web + animación responsiva */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle>{dark.title}</SectionTitle>
      </section>
      <MacGallery images={dark.gallery} title="Plataforma de datos de comercio exterior" ratio="1440 / 1000" className="mt-10">
        <div className="mt-4">
          <ImexResponsive />
        </div>
      </MacGallery>

      {/* Modo claro: vistas web + animación responsiva */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle>{light.title}</SectionTitle>
      </section>
      <MacGallery images={light.gallery} title="Plataforma de datos de comercio exterior" ratio="1440 / 1000" className="mt-10">
        <div className="mt-4">
          <ImexResponsive theme="light" />
        </div>
      </MacGallery>

      <section className="mx-auto mt-40 max-w-6xl px-5 sm:mt-48 sm:px-8">
        <Reveal as="h2" className="t-h2">
          Otros proyectos
        </Reveal>
      </section>
    </>
  );
}
