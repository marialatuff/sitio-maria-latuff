import ReadingText from '../about/ReadingText.jsx';
import Reveal from '../ui/Reveal.jsx';
import IsoGraphic from '../home/IsoGraphic.jsx';
import { JobFlowDiagram, MeetingDocDiagram, ParallelDiagram, SyntheticDiagram, TeamTestDiagram } from './ArchProcess.jsx';

/**
 * Los 4 pasos de "Arquitectura de Experiencia & Integración de IA".
 * Cada paso lleva una ilustración de línea del mismo estilo que Soluciones (se dibuja y transforma en bucle),
 * dentro de un contenedor sólido sin borde. Toda la tipografía es la de párrafo del sitio (Inter).
 */

// Pasos 1–3: diagramas de proceso técnicos; paso 4: ilustración de línea (IsoGraphic)
const DIAGRAM = {
  jobmap: JobFlowDiagram,
  parallel: ParallelDiagram,
  synthetic: SyntheticDiagram,
  // PUMA
  'puma-meeting': MeetingDocDiagram,
  'puma-test': TeamTestDiagram,
};

function Example({ ex }) {
  // Prueba sintética: hallazgos y decisiones como texto simple
  if (ex?.findings) {
    return (
      // Los hallazgos ya se ven en el diagrama; aquí quedan las decisiones
      <div className="mt-6 font-geist text-[0.95rem] leading-relaxed">
        <div>
          <p className="font-medium text-night">Decisiones</p>
          {/* Texto de lectura: gris que se ilumina en lila al leer */}
          <ul className="mt-2 space-y-1.5">
            {ex.decisions.map((d) => (
              <ReadingText key={d} as="li">
                {d}
              </ReadingText>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (!ex?.result) return null;
  return (
    <ReadingText className="mt-6 font-geist text-[0.95rem] leading-relaxed">
      <span className="font-medium">Resultado:</span> {ex.result}
    </ReadingText>
  );
}

function Step({ step, index }) {
  const flip = index % 2 === 1;
  const Diagram = DIAGRAM[step.visual];
  return (
    <li className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
      {/* Contenedor sólido, sin borde */}
      <div className={`rounded-xl bg-card ${Diagram ? 'p-5 sm:p-7' : 'px-6 py-4 sm:px-10'} ${flip ? 'md:order-2' : ''}`}>
        {Diagram ? (
          <Diagram example={step.example} screens={step.screens} />
        ) : (
          <IsoGraphic type={step.visual} className="mx-auto block aspect-square w-full max-w-[22rem]" />
        )}
      </div>
      <Reveal className="font-geist">
        <span className="inline-block rounded bg-night px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-paper">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-4 t-h4">{step.title}</h3>
        <ReadingText className="mt-3 text-[0.98rem] leading-[1.75]">{step.body}</ReadingText>
        <Example ex={step.example} />
      </Reveal>
    </li>
  );
}

export default function ArchSteps({ steps }) {
  return (
    <ol className="mt-20 space-y-20 sm:space-y-28">
      {steps.map((s, i) => (
        <Step key={s.title} step={s} index={i} />
      ))}
    </ol>
  );
}
