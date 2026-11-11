import { useRef } from 'react';
import HomeButton from '../components/home/HomeButton.jsx';
import SequenceStrip from '../components/home/SequenceStrip.jsx';
import SignatureBackdrop from '../components/home/SignatureBackdrop.jsx';
import { FlowLine } from '../components/home/Solutions.jsx';
import ReadingText from '../components/about/ReadingText.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import { HOME_V2 } from '../content/site.js';

/**
 * Soluciones: los mismos servicios de la Home, contados con calma.
 * Estructura tipo Conóceme (columna de lectura) y animación horizontal grande.
 */
export default function Offer() {
  const { title, subtitle, items } = HOME_V2.solutions;
  const flowRef = useRef(null);
  const articleRef = useRef(null);
  const introRef = useRef(null);

  return (
    <article ref={articleRef} className="relative overflow-x-clip pb-24 font-geist">
      {/* Firma de fondo, la misma animación del hero de la Home */}
      <SignatureBackdrop scrollRef={introRef} />

      {/* ref usado para medir el scroll de la continuación de la firma */}
      <header ref={introRef} className="relative z-10 mx-auto max-w-2xl px-5 pt-56 sm:px-8 sm:pt-64">
        <Reveal as="h1" className="t-h1">
          {title}
        </Reveal>
        <ReadingText className="mt-8 text-[1.05rem] leading-[1.8]">{subtitle}</ReadingText>
      </header>

      {/* Servicios, uno a uno, unidos por la línea continua */}
      <div ref={flowRef} className="relative mt-32 sm:mt-40">
        <FlowLine containerRef={flowRef} />
        <div className="flex flex-col gap-40 sm:gap-56">
          {items.map((item) => (
            <section key={item.id} id={item.id} data-flow className="relative bg-paper">
              <Reveal className="mx-auto max-w-2xl px-5 text-center sm:px-8">
                <span className="inline-block rounded bg-night px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-paper">
                  {item.label}
                </span>
                <h2 className="mt-4 t-h3">{item.title}</h2>
              </Reveal>

              <SequenceStrip type={item.graphic} className="mx-auto mt-10 max-w-6xl px-3 sm:mt-14 sm:px-8" />

              <div className="mx-auto mt-10 max-w-2xl px-5 text-center sm:px-8">
                <ReadingText className="text-[1.05rem] leading-[1.8]">{item.body}</ReadingText>
                <HomeButton variant="soft" className="mt-8" />
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
