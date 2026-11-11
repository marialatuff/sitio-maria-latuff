import ReadingText from '../about/ReadingText.jsx';
import Reveal from '../ui/Reveal.jsx';
import SequenceStrip from '../home/SequenceStrip.jsx';
import { useInView } from '../../hooks/useInView.js';
import BlooFlow from './BlooFlow.jsx';
import BlooFlowPlanning from './BlooFlowPlanning.jsx';
import MacGallery from './MacGallery.jsx';
import ApprovalFlow from './ApprovalFlow.jsx';
import { AnotacionesFlow, PanelFlow } from './ResponsiveFlows.jsx';

import ArchSteps from './ArchSteps.jsx';

export function SectionTitle({ children, className = '' }) {
  return (
    <Reveal as="h2" className={`t-h2 ${className}`}>
      {children}
    </Reveal>
  );
}

/* ---------- Ficha del proyecto ---------- */
export function Sheet({ items }) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-28 sm:px-8">
      <Reveal as="h2" className="t-h3">
        Ficha del Proyecto
      </Reveal>
      <dl className={`mt-8 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line ${items.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 80} className="bg-paper p-6">
            <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-graphite-mute">{it.label}</dt>
            <ReadingText as="dd" className="mt-3 text-[0.98rem] leading-snug">
              {it.value}
            </ReadingText>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Gestión de producto: timeline ilustrado ---------- */
function Management({ data }) {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
      <SectionTitle>{data.title}</SectionTitle>
      {/* Las ilustraciones de línea de Soluciones, una por etapa */}
      <SequenceStrip type="gestion" className="mt-10" />
      <ol className="mt-6 grid gap-10 sm:grid-cols-3 sm:gap-8">
        {data.steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 120} className="relative">
            <span className="inline-block rounded bg-night px-1.5 py-0.5 text-[0.7rem] font-medium tracking-wider text-paper">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 t-h4">{s.title}</h3>
            <ReadingText className="mt-3 text-[0.98rem] leading-[1.75]">{s.body}</ReadingText>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Arquitectura: del requerimiento estratégico al diseño ---------- */
function FlowDiagram({ steps, on }) {
  // Nodos en zigzag unidos por líneas que se dibujan al entrar en pantalla
  const pts = steps.map((_, i) => [40 + (i % 2) * 120, 34 + i * 62]);
  return (
    <svg viewBox={`0 0 260 ${34 + (steps.length - 1) * 62 + 34}`} className="w-full" aria-hidden="true">
      {pts.slice(1).map(([x, y], i) => {
        const [px, py] = pts[i];
        const d = `M${px + 50} ${py + 14} C ${px + 50} ${py + 40}, ${x + 50} ${y - 26}, ${x + 50} ${y - 14}`;
        return (
          <g key={i}>
            <path
              d={d}
              pathLength={1}
              fill="none"
              stroke="rgb(var(--c-ink-line))"
              strokeWidth="1.3"
              style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset .7s ease ${0.5 + i * 0.35}s` }}
            />
            {on && (
              <path
                d={d}
                pathLength={1}
                fill="none"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="line-spark line-spark-run"
                style={{ opacity: 'var(--c-spark-a)', '--spark-dur': '0.9s', '--spark-delay': `${0.5 + i * 0.35}s` }}
              />
            )}
          </g>
        );
      })}
      {pts.map(([x, y], i) => (
        <g key={i} style={{ opacity: on ? 1 : 0, transition: `opacity .5s ease ${0.3 + i * 0.35}s` }}>
          <rect x={x} y={y - 14} width="100" height="28" rx="14" fill="rgb(var(--c-paper))" stroke="rgb(var(--c-ink-line))" strokeWidth="1.2" />
          <text x={x + 50} y={y + 4} textAnchor="middle" fontSize="10.5" fill="rgb(var(--c-night))" fontFamily="Inter, sans-serif">
            {steps[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Process({ data }) {
  const [ref, on] = useInView({ threshold: 0.3 });
  const stage = (i) => ({ opacity: on ? 1 : 0, transform: on ? 'none' : 'translateY(16px)', transition: `all .8s cubic-bezier(.2,.7,.2,1) ${i * 0.9}s` });
  // Contenedores sólidos sin borde; tipografía de párrafo (Inter)
  const head = 'font-geist text-[0.95rem] font-medium text-night';
  return (
    <div ref={ref} className="mt-12 grid items-start gap-5 font-geist md:grid-cols-3">
      {/* 1. Requerimiento estratégico */}
      <div className="rounded-xl bg-card p-6 sm:p-7" style={stage(0)}>
        <p className={head}>
          <span className="mr-2 text-graphite-mute">01</span>Job to be done
        </p>
        <ReadingText className="mt-5 text-[1rem] leading-relaxed">“{data.job}”</ReadingText>
        <p className="mt-4 text-sm text-graphite-mute">Docente · Bloo</p>
      </div>
      {/* 2. Flujo de usuario */}
      <div className="rounded-xl bg-card p-6 sm:p-7" style={stage(1)}>
        <p className={head}>
          <span className="mr-2 text-graphite-mute">02</span>Flujo de usuario
        </p>
        <div className="mt-4">
          <FlowDiagram steps={data.flow} on={on} />
        </div>
      </div>
      {/* 3. Diseño resultante */}
      <div className="rounded-xl bg-card p-6 sm:p-7" style={stage(2)}>
        <p className={head}>
          <span className="mr-2 text-graphite-mute">03</span>Diseño
        </p>
        <div className="relative mt-5 h-72">
          {data.screens.map((src, i) => (
            <div
              key={i}
              className="absolute inset-x-0 top-0 mx-auto aspect-[4/5] w-[70%] overflow-hidden rounded-xl bg-paper-soft"
              style={{
                transform: on ? `translate(${(i - 1) * 26}px, ${i * 14}px) rotate(${(i - 1) * 4}deg)` : 'none',
                transition: `transform .9s cubic-bezier(.2,.7,.2,1) ${2 + i * 0.15}s`,
                zIndex: data.screens.length - i,
                boxShadow: '0 24px 48px -24px rgba(0,0,0,.7)',
              }}
            >
              {src ? (
                <img src={src} alt="" className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center text-xs text-graphite-mute">Pantalla pendiente</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Architecture({ data }) {
  return (
    <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
      <SectionTitle className="max-w-3xl">{data.title}</SectionTitle>
      <Process data={data.process} />
      {/* Los 4 pasos, cada uno con su gráfico de ejemplo */}
      <ArchSteps steps={data.steps} />
    </section>
  );
}

/** Caso Bloo: ficha → recorrido animado → contexto → galería → gestión → arquitectura → otros proyectos. */
export default function BlooCase({ project }) {
  const { sheet, context, gallery, management, architecture } = project;
  return (
    <>
      <Sheet items={sheet} />

      {/* Recorrido animado por la plataforma */}
      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <BlooFlow />
      </section>

      {/* Contexto, fricción y solución */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:mt-40 sm:px-8">
        <SectionTitle className="max-w-3xl">{context.title}</SectionTitle>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-10">
          {context.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 120}>
              <h3 className="t-h4">{it.title}</h3>
              <ReadingText className="mt-3 text-[0.98rem] leading-[1.75]">{it.body}</ReadingText>
            </Reveal>
          ))}
        </div>
      </section>
      {/* Segundo recorrido: Mis asignaturas y Planificación */}
      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <BlooFlowPlanning />
      </section>

      <Management data={management} />
      <Architecture data={architecture} />

      {/* Aprobación de gastos mayores: recorrido web + móvil, después de Validación con usuarios reales */}
      <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
        <ApprovalFlow />
      </section>

      {/* Vistas web estáticas; tras Panel de control e Inicio del docente van sus recorridos responsivos */}
      <MacGallery
        images={gallery}
        inserts={{
          1: (
            <div className="space-y-5">
              <PanelFlow />
              <AnotacionesFlow />
            </div>
          ),
        }}
      />

      <section className="mx-auto mt-40 max-w-6xl px-5 sm:mt-48 sm:px-8">
        <Reveal as="h2" className="t-h2">
          Otros proyectos
        </Reveal>
      </section>
    </>
  );
}
