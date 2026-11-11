import { useRef } from 'react';
import HomeButton from '../components/home/HomeButton.jsx';
import IsoGraphic from '../components/home/IsoGraphic.jsx';
import { FlowLine } from '../components/home/Solutions.jsx';
import ReadingText from '../components/about/ReadingText.jsx';
import PhotoSlot from '../components/about/PhotoSlot.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { ABOUT, ABOUT_PHOTOS, PILLAR_GRAPHICS } from '../content/site.js';

/** Ilustración de cada punto de la mentalidad (mismo orden que ABOUT.mindset.items). */
const MINDSET_GRAPHICS = ['focus', 'discipline', 'resilience', 'communication'];

/** Párrafo con partes en negrita (formato de ABOUT.hero.paragraphs). */
function Rich({ parts }) {
  return parts.map((p, i) =>
    typeof p === 'string' ? (
      <span key={i}>{p}</span>
    ) : (
      <strong key={i} className="font-semibold">
        {p.strong}
      </strong>
    ),
  );
}

/** Conóceme: una carta personal en una sola columna, con fotos entre capítulos. */
export default function About() {
  const { hero, pillars, mindset } = ABOUT;
  const pillarsRef = useRef(null);

  return (
    <article className="pb-24 font-geist">
      {/* Apertura */}
      <header className="mx-auto max-w-2xl px-5 pt-32 sm:px-8 sm:pt-40">
        <Reveal as="h1" className="t-h1">
          {hero.title}
        </Reveal>
        <div className="mt-10 space-y-6 text-[1.05rem] leading-[1.8]">
          {hero.paragraphs.map((parts, i) => (
            <ReadingText key={i}>
              <Rich parts={parts} />
            </ReadingText>
          ))}
        </div>
        <HomeButton variant="soft" className="mt-10" />
      </header>

      <PhotoSlot src={ABOUT_PHOTOS[0]} alt="María Latuff" portrait className="mt-20 sm:mt-28" />

      {/* Pilares: verticales, unidos por la línea continua */}
      <section className="mt-24 sm:mt-32">
        <Reveal className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <h2 className="t-h2">{pillars.title}</h2>
        </Reveal>

        <div ref={pillarsRef} className="relative mx-auto mt-10 max-w-2xl px-5 sm:px-8">
          <FlowLine containerRef={pillarsRef} />
          <div className="flex flex-col gap-28 sm:gap-36">
            {pillars.items.map((item, i) => (
              <div key={item.title} data-flow className="relative bg-paper text-center">
                <div className="flex justify-center">
                  <IsoGraphic type={PILLAR_GRAPHICS[i]} className="h-56 w-56 sm:h-64 sm:w-64" />
                </div>
                <span className="mt-4 inline-block rounded bg-night px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-paper">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mx-auto mt-3 max-w-md t-h3">{item.title}</h3>
                <ReadingText className="mx-auto mt-4 max-w-lg text-[1.02rem] leading-[1.8]">{item.body}</ReadingText>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <HomeButton variant="soft" />
        </div>
      </section>

      {/* Mentalidad: cada punto con su ilustración animada */}
      <section className="mx-auto mt-24 max-w-2xl px-5 sm:mt-32 sm:px-8">
        <Reveal as="h2" className="t-h2">
          {mindset.title}
        </Reveal>
        <ReadingText className="mt-8 text-[1.05rem] leading-[1.8]">{mindset.subtitle}</ReadingText>
        <ol className="mt-12 border-t border-paper-line">
          {mindset.items.map((item, i) => (
            <li
              key={item.title}
              className="grid items-center gap-4 border-b border-paper-line py-8 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <IsoGraphic type={MINDSET_GRAPHICS[i]} className="h-36 w-36" />
              <div>
                <h3 className="t-h4">{item.title}</h3>
                <ReadingText className="mt-2 text-[1.02rem] leading-[1.8]">{item.body}</ReadingText>
              </div>
            </li>
          ))}
        </ol>
        <HomeButton variant="soft" className="mt-10" />
      </section>
    </article>
  );
}
