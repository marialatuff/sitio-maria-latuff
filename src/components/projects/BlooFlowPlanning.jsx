import { useEffect, useState } from 'react';
import { C, I, Icon, FlowPlayer, ScreenMaterias, Shell, card } from './BlooFlow.jsx';

/**
 * Recorrido 2 de Bloo (solo reproducción):
 * 1. Mis asignaturas → se elige Matemática → las tarjetas de arriba muestran sus resultados.
 * 2. Planificación → vista principal → Planificación Matemática → pestañas Planificación y Cronograma (timeline animado).
 */

const PHASES = [
  'Mis asignaturas: se elige una materia y se revisan sus resultados',
  'Planificación: vista principal, Planificación Matemática y cronograma de seguimiento',
];

const INITIAL = { screen: 'materias', metric: 'promedio', tab: 'plan', phase: 0 };

/* ---------- Número que sube hasta su valor ---------- */
function CountUp({ to, decimals = 0, suffix = '' }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900);
      setV(to * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return (
    <>
      {v.toFixed(decimals)}
      {suffix}
    </>
  );
}

/* ---------- 1. Resultados de la materia ---------- */
const METRICS = [
  { key: 'promedio', label: 'Promedio general', to: 5.8, decimals: 1, color: C.blue },
  { key: 'asistencia', label: 'Asistencia', to: 94.5, decimals: 1, suffix: '%', color: C.purple },
  { key: 'aprobacion', label: 'Aprobación', to: 88, suffix: '%', color: C.green },
  { key: 'evaluaciones', label: 'Evaluaciones', to: 6, color: C.orange },
];

function ResultPanel({ metric }) {
  if (metric === 'asistencia') {
    // Asistencia mensual (línea)
    const pts = [92, 95, 93, 96, 94, 97];
    const months = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
    const xy = pts.map((p, i) => [40 + i * 104, 170 - (p - 88) * 16]);
    const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
    return (
      <svg viewBox="0 0 600 200" className="w-full">
        {[0, 1, 2].map((i) => <path key={i} d={`M30 ${50 + i * 55}H590`} stroke={C.line} strokeDasharray="4 4" />)}
        <path d={d} fill="none" stroke={C.purple} strokeWidth="2.5" pathLength={1} style={{ strokeDasharray: 1, animation: 'bloo-draw 1.2s ease both' }} />
        {xy.map(([x, y], i) => (
          <g key={i} style={{ animation: `bloo-fade .3s ease ${0.2 + i * 0.15}s both` }}>
            <circle cx={x} cy={y} r="4.5" fill="#fff" stroke={C.purple} strokeWidth="2" />
            <text x={x} y="195" textAnchor="middle" fontSize="11" fill={C.mute}>{months[i]}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (metric === 'aprobacion') {
    // Estado de aprobación (barras horizontales por curso)
    return (
      <div className="space-y-4 px-2 py-3">
        {[['7° Básico A', 88, C.green], ['7° Básico B', 81, C.blue], ['Meta del establecimiento', 85, '#c9d3e6']].map(([t, v, c], i) => (
          <div key={t}>
            <div className="flex justify-between" style={{ fontSize: 11.5, color: C.ink }}><span>{t}</span><span>{v}%</span></div>
            <div className="mt-1.5 h-2.5 rounded-full" style={{ background: '#eef1f6' }}>
              <div className="h-full origin-left rounded-full" style={{ width: `${v}%`, background: c, animation: `bloo-grow-x .9s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s both` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  // Promedio por evaluación (barras)
  const bars = [['Diagnóstico', 5.1], ['Números Enteros', 6.0], ['Fracciones', 5.6], ['Operaciones', 6.2], ['Ecuaciones', 5.9]];
  return (
    <div className="flex h-[200px] items-end justify-around gap-4 px-4 pb-6 pt-3">
      {bars.map(([t, v], i) => (
        <div key={t} className="flex flex-1 flex-col items-center gap-1.5">
          <span style={{ fontSize: 11, color: C.ink }}>{v.toFixed(1)}</span>
          <div className="w-full origin-bottom rounded-t-md" style={{ height: (v - 3) * 42, background: i === 3 ? C.blue : '#bcd3fb', animation: `bloo-grow-y .8s cubic-bezier(.2,.7,.2,1) ${i * 0.1}s both` }} />
          <span style={{ fontSize: 10, color: C.mute }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

const PANEL_TITLE = {
  promedio: ['Promedio por evaluación', 'Notas promedio del curso en cada evaluación'],
  asistencia: ['Asistencia mensual', 'Porcentaje de asistencia por mes'],
  aprobacion: ['Aprobación por curso', 'Comparación con la meta del establecimiento'],
};

function ScreenResultados({ metric }) {
  const [title, sub] = PANEL_TITLE[metric] || PANEL_TITLE.promedio;
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Matemática</h3>
      <p style={{ color: C.mute, fontSize: 12 }}>7° Básico A · 32 estudiantes</p>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {METRICS.map((m) => {
          const on = m.key === metric;
          return (
            <div
              key={m.key}
              data-t={`card-${m.key}`}
              className="p-4"
              style={{ ...card, borderColor: on ? m.color : C.line, boxShadow: on ? `0 0 0 3px ${m.color}22` : 'none', transition: 'all .35s' }}
            >
              <div style={{ fontSize: 11, color: C.mute }}>{m.label}</div>
              <div style={{ fontSize: 24, color: on ? m.color : C.ink, transition: 'color .35s' }}>
                <CountUp to={m.to} decimals={m.decimals} suffix={m.suffix} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-5" style={card}>
        <div key={metric} style={{ animation: 'bloo-fade .4s ease both' }}>
          <div style={{ fontSize: 14, color: C.ink }}>{title}</div>
          <div style={{ fontSize: 11, color: C.mute }}>{sub}</div>
          <div className="mt-3">
            <ResultPanel metric={metric} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Planificación ---------- */
const PLANS = [
  { t: 'Planificación Matemática', s: '7° Básico A · Unidad 2 de 4', state: 'En curso', color: C.blue, progress: 45, key: 'plan-mate' },
  { t: 'Planificación Geometría', s: '8° Básico B · Unidad 1 de 3', state: 'Pendiente de entrega', color: '#9b2cf0', progress: 20 },
  { t: 'Planificación Álgebra', s: '1° Medio A · Unidad 3 de 4', state: 'Aprobada por UTP', color: C.green, progress: 70 },
];

function ScreenPlanificacion() {
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Planificación</h3>
      <p style={{ color: C.mute, fontSize: 12 }}>Planificaciones docentes según MINEDUC</p>
      <div className="mt-5 grid grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <div key={p.t} data-t={p.key} className="p-5" style={{ ...card, background: '#fafcff' }}>
            <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${p.color}18` }}><Icon d={I.cal} color={p.color} /></span>
            <div className="mt-3" style={{ fontSize: 14, color: C.ink }}>{p.t}</div>
            <div style={{ fontSize: 11, color: C.mute }}>{p.s}</div>
            <span className="mt-3 inline-block rounded-full px-2 py-0.5" style={{ fontSize: 10, background: `${p.color}15`, color: p.color }}>{p.state}</span>
            <div className="mt-4 h-1.5 rounded-full" style={{ background: '#eef1f6' }}>
              <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.color }} />
            </div>
            <div className="mt-1 text-right" style={{ fontSize: 10, color: C.mute }}>{p.progress}% avance</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const UNITS = [
  ['Unidad 1 · Números enteros', 'OA 01 · OA 02', 'Semanas 1 – 6', 'Completada', C.green],
  ['Unidad 2 · Fracciones y decimales', 'OA 03 · OA 04', 'Semanas 7 – 12', 'En curso', C.blue],
  ['Unidad 3 · Ecuaciones lineales', 'OA 08 · OA 09', 'Semanas 13 – 18', 'Por iniciar', C.mute],
  ['Unidad 4 · Geometría', 'OA 12', 'Semanas 19 – 24', 'Por iniciar', C.mute],
];

const MILESTONES = [
  ['Mar', 'Inicio Unidad 1', 'done'],
  ['Abr', 'Evaluación diagnóstica', 'done'],
  ['May', 'Unidad 2 en curso', 'now'],
  ['Jun', 'Evaluación sumativa', 'next'],
  ['Jul', 'Unidad 3', 'next'],
  ['Ago', 'Revisión UTP', 'next'],
];

function Cronograma() {
  const n = MILESTONES.length;
  const x = (i) => 60 + i * ((840 - 120) / (n - 1));
  return (
    <div className="pt-6">
      <div className="relative" style={{ height: 170 }}>
        {/* Línea base y avance animado hasta el hito actual */}
        <div className="absolute rounded-full" style={{ left: x(0), width: x(n - 1) - x(0), top: 58, height: 4, background: '#e6ecf6' }} />
        <div
          className="absolute origin-left rounded-full"
          style={{ left: x(0), width: x(2) - x(0), top: 58, height: 4, background: C.blue, animation: 'bloo-grow-x 1.6s cubic-bezier(.45,0,.2,1) .2s both' }}
        />
        {MILESTONES.map(([m, t, st], i) => {
          const done = st === 'done';
          const now = st === 'now';
          return (
            <div key={m} className="absolute flex w-32 flex-col items-center text-center" style={{ left: x(i) - 64, top: 0, animation: `bloo-pop .45s cubic-bezier(.2,.7,.2,1) ${0.3 + i * 0.28}s both` }}>
              <span style={{ fontSize: 11, color: C.mute }}>{m}</span>
              <span
                className="mt-5 grid place-items-center rounded-full"
                style={{
                  width: now ? 22 : 16,
                  height: now ? 22 : 16,
                  marginTop: now ? 15 : 18,
                  background: done ? C.blue : '#fff',
                  border: `2px solid ${done || now ? C.blue : '#c9d3e6'}`,
                  boxShadow: now ? `0 0 0 6px ${C.blue}22` : 'none',
                  animation: now ? 'bloo-pulse 1.6s ease-in-out 2s infinite' : 'none',
                }}
              >
                {done && <Icon d="M5 12l4 4 10-10" size={10} color="#fff" />}
              </span>
              <span className="mt-4" style={{ fontSize: 11.5, color: now ? C.blue : C.ink, fontWeight: now ? 600 : 400 }}>{t}</span>
              <span style={{ fontSize: 10, color: C.mute }}>{done ? 'Cumplido' : now ? 'Semana 9' : 'Programado'}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: C.blueSoft, fontSize: 11.5, color: C.ink, animation: 'bloo-fade .5s ease 2.2s both' }}>
        <Icon d={I.check} color={C.blue} /> Vas al día con tu planificación: 2 de 6 hitos cumplidos, próximo hito en 3 semanas.
      </div>
    </div>
  );
}

function ScreenPlanMate({ tab }) {
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Planificación Matemática</h3>
      <p style={{ color: C.mute, fontSize: 12 }}>7° Básico A · Año escolar 2024</p>
      <div className="mt-4 p-5" style={card}>
        <div className="flex gap-6" style={{ fontSize: 12, borderBottom: `1px solid ${C.line}` }}>
          {[['plan', 'Planificación'], ['crono', 'Cronograma de seguimiento']].map(([k, l]) => (
            <div key={k} data-t={`tab-${k}`} className="pb-2" style={{ color: tab === k ? C.blue : C.mute, borderBottom: `2px solid ${tab === k ? C.blue : 'transparent'}`, transition: 'all .3s' }}>{l}</div>
          ))}
        </div>
        <div key={tab} style={{ animation: 'bloo-fade .4s ease both' }}>
          {tab === 'plan' ? (
            <table className="mt-3 w-full" style={{ fontSize: 11.5, color: C.ink }}>
              <thead><tr style={{ color: C.mute, textAlign: 'left' }}>{['Unidad', 'Objetivos', 'Período', 'Estado'].map((h) => <th key={h} className="pb-2 font-medium">{h}</th>)}</tr></thead>
              <tbody>
                {UNITS.map(([u, oa, w, st, c], i) => (
                  <tr key={u} style={{ borderTop: `1px solid ${C.line}`, animation: `bloo-fade .35s ease ${i * 0.1}s both` }}>
                    <td className="py-3">{u}</td>
                    <td style={{ color: C.mute }}>{oa}</td>
                    <td style={{ color: C.mute }}>{w}</td>
                    <td><span className="rounded-full px-2 py-0.5" style={{ fontSize: 10, background: `${c}15`, color: c }}>{st}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Cronograma />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Guion ---------- */
async function script({ set, moveTo, click, sleep }) {
  await sleep(1500);
  await moveTo('ver-detalle');
  await click();
  set({ screen: 'resultados', metric: 'promedio' });
  await sleep(2200);
  await moveTo('card-asistencia');
  await click();
  set({ metric: 'asistencia' });
  await sleep(2200);
  await moveTo('card-aprobacion');
  await click();
  set({ metric: 'aprobacion' });
  await sleep(2200);
  // 2. Planificación
  set({ phase: 1 });
  await moveTo('nav-planificacion');
  await click();
  set({ screen: 'planificacion' });
  await sleep(1800);
  await moveTo('plan-mate');
  await click();
  set({ screen: 'planmate', tab: 'plan' });
  await sleep(2400);
  await moveTo('tab-crono');
  await click();
  set({ tab: 'crono' });
  await sleep(5200);
}

export default function BlooFlowPlanning() {
  return (
    <FlowPlayer
      phases={PHASES}
      initial={INITIAL}
      script={script}
      description="Recorrido animado por Bloo: en Mis asignaturas se elige Matemática y se revisan sus resultados; luego en Planificación se abre la planificación de Matemática y su cronograma de seguimiento."
    >
      {(ui) => (
        <Shell active={ui.screen === 'materias' || ui.screen === 'resultados' ? 'materias' : 'planificacion'} screenKey={ui.screen}>
          {ui.screen === 'materias' && <ScreenMaterias />}
          {ui.screen === 'resultados' && <ScreenResultados metric={ui.metric} />}
          {ui.screen === 'planificacion' && <ScreenPlanificacion />}
          {ui.screen === 'planmate' && <ScreenPlanMate tab={ui.tab} />}
        </Shell>
      )}
    </FlowPlayer>
  );
}
