import ReadingText from '../about/ReadingText.jsx';
import Reveal from '../ui/Reveal.jsx';
import { SectionTitle, Sheet } from './BlooCase.jsx';
import ArchSteps from './ArchSteps.jsx';
import MacGallery from './MacGallery.jsx';
import PumaFlow from './PumaFlow.jsx';
import { PostulanteFlow, UsuariosFlow } from './PumaFlows2.jsx';
import PumaMobileFlow from './PumaMobileFlow.jsx';
import PumaSolicitudesFlow from './PumaSolicitudesFlow.jsx';

/**
 * Caso PUMA Recruiter, con la misma estructura que Bloo (sin Gestión de producto):
 * ficha → recorrido 1 → problema y solución → arquitectura →
 * recorrido de usuarios (web) → vistas web estáticas → recorrido responsivo del postulante → otros proyectos.
 */
export default function PumaCase({ project }) {
  const { sheet, context, architecture, gallery } = project;
  return (
    <>
      <Sheet items={sheet} />

      {/* Recorrido 1: login, formularios y nueva pregunta */}
      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <PumaFlow />
      </section>

      {/* El problema y la solución estratégica */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle className="max-w-3xl">{context.title}</SectionTitle>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          {context.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 120}>
              <h3 className="t-h4">{it.title}</h3>
              <ReadingText className="mt-3 text-[0.98rem] leading-[1.75]">{it.body}</ReadingText>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Arquitectura de Experiencia & Integración de IA: los 3 pasos del documento */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle className="max-w-3xl">{architecture.title}</SectionTitle>
        <ArchSteps steps={architecture.steps} />
      </section>

      {/* Después de Validación y Refinamiento: recorrido web de Usuarios */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
        <UsuariosFlow />
      </section>

      {/* Vistas web estáticas, en orden */}
      <MacGallery images={gallery} title="PUMA Recruiter · Gestión interna" />

      {/* Recorrido responsivo: Postulante → Formularios */}
      <section className="mx-auto mt-5 max-w-6xl px-5 sm:px-8">
        <PostulanteFlow />
      </section>

      {/* Recorrido móvil: app de postulación */}
      <section className="mx-auto mt-5 max-w-6xl px-5 sm:px-8">
        <PumaMobileFlow />
      </section>

      {/* Último recorrido web: Solicitudes → Personal disponible → carga de exámenes → Guardar proceso */}
      <section className="mx-auto mt-5 max-w-6xl px-5 sm:px-8">
        <PumaSolicitudesFlow />
      </section>

      <section className="mx-auto mt-40 max-w-6xl px-5 sm:mt-48 sm:px-8">
        <Reveal as="h2" className="t-h2">
          Otros proyectos
        </Reveal>
      </section>
    </>
  );
}
