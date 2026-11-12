import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import blooLogo from '../../assets/projects/bloo/logo.png';
import { C, I, Icon } from './BlooFlow.jsx';
import { Scaled } from './ApprovalFlow.jsx';
import { MacWindow, PhoneFrame, PHONE_H, PHONE_W } from './devices.jsx';

/**
 * Recorridos responsivos (solo reproducción) de Panel de control e Inicio del docente:
 * la misma secuencia en web (ventana de Mac) y en móvil (iPhone 16), sincronizadas.
 * Pantallas recreadas a partir de los diseños de María.
 */

const SPEED = 0.6; // mismo ritmo ágil que el resto de recorridos
const WW = 1200;
const WH = 750;

/* ---------- Reproductor doble (web + móvil) ---------- */
export function DualPlayer({ phases, initial, script, Web, Mobile, label, title, phoneColor = 'white', ww = WW, wh = WH }) {
  const webRef = useRef(null);
  const mobRef = useRef(null);
  const [ui, setUi] = useState(initial);
  const [cur, setCur] = useState({ x: 900, y: 560, click: false, show: false });
  const [tap, setTap] = useState({ x: 300, y: 700, on: false, show: false });
  const [ref, inView] = useInView({ threshold: 0.3, once: false });

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED));
    const set = (p) => alive && setUi((u) => ({ ...u, ...p }));
    const center = (root, w, t) => {
      const el = root?.querySelector(`[data-t="${t}"]`);
      if (!el) return null;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const k = a.width / w;
      return { x: (b.left - a.left + b.width / 2) / k, y: (b.top - a.top + b.height / 2) / k };
    };
    // Cursor (web) y dedo (móvil) van a su elemento y hacen clic a la vez
    const press = async (t) => {
      const pw = center(webRef.current, ww, t);
      const pm = center(mobRef.current, PHONE_W, t);
      if (!alive) return;
      if (pw) setCur({ ...pw, click: false, show: true });
      if (pm) setTap({ ...pm, on: false, show: true });
      await sleep(950);
      if (!alive) return;
      setCur((c) => ({ ...c, click: true }));
      setTap((c) => ({ ...c, on: true }));
      await sleep(280);
      setCur((c) => ({ ...c, click: false }));
      setTap((c) => ({ ...c, on: false }));
    };
    (async () => {
      while (alive) {
        set(initial);
        setCur({ x: 900, y: 560, click: false, show: true });
        setTap({ x: 300, y: 700, on: false, show: false });
        await script({ set, press, sleep });
      }
    })();
    return () => {
      alive = false;
      setUi(initial);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div ref={ref}>
      <div className="grid items-center gap-[5%] rounded-xl px-[6%] py-[7%] sm:grid-cols-[1fr_0.3fr]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
        <MacWindow {...(title ? { title } : {})} ratio={`${ww} / ${wh}`}>
          <Scaled w={ww} h={wh} innerRef={webRef}>
            <Web ui={ui} />
            <div className="absolute left-0 top-0 z-40" style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, transition: 'transform .5s cubic-bezier(.45,0,.2,1)', opacity: cur.show ? 1 : 0 }}>
              <span className="absolute -left-5 -top-5 h-10 w-10 rounded-full" style={{ background: 'rgba(126,110,135,.35)', transform: `scale(${cur.click ? 1 : 0})`, transition: 'transform .26s' }} />
              <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))' }}>
                <path d="M4 3l16 7-7 2-2 7z" fill="#1f2a44" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </Scaled>
        </MacWindow>
        <div className="mx-auto w-[46%] sm:w-full">
          <PhoneFrame color={phoneColor}>
            <Scaled w={PHONE_W} h={PHONE_H} innerRef={mobRef}>
              <Mobile ui={ui} />
              <span
                className="absolute left-0 top-0 z-40 -ml-5 -mt-5 h-10 w-10 rounded-full"
                style={{
                  transform: `translate(${tap.x}px, ${tap.y}px) scale(${tap.on ? 0.8 : 1})`,
                  transition: 'transform .5s cubic-bezier(.45,0,.2,1), opacity .3s',
                  background: 'rgba(126,110,135,.45)',
                  boxShadow: tap.on ? '0 0 0 10px rgba(126,110,135,.2)' : 'none',
                  opacity: tap.show ? 1 : 0,
                }}
              />
            </Scaled>
          </PhoneFrame>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-geist text-sm">
        <span className="flex gap-1.5" aria-hidden="true">
          {phases.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === ui.phase ? 'w-6 bg-[#ded0e8]' : 'w-1.5 bg-paper-line'}`} />
          ))}
        </span>
        <span className="text-graphite-soft">
          <span className="text-night">{label}:</span> {phases[ui.phase]} · web y versión móvil
        </span>
      </div>
    </div>
  );
}

/* ---------- Piezas comunes ---------- */
function WebSidebar({ items, active }) {
  return (
    <aside className="flex w-[210px] shrink-0 flex-col bg-white" style={{ borderRadius: '0 0 28px 0' }}>
      <div className="grid h-[74px] place-items-center" style={{ background: C.blue, borderRadius: '0 0 28px 0' }}>
        <img src={blooLogo} alt="" style={{ height: 34, filter: 'brightness(0) invert(1)' }} />
      </div>
      <nav className="mt-4 flex flex-col gap-1 px-3" style={{ fontSize: 12.5 }}>
        {items.map(([l, d], i) => (
          <div key={l} className="flex items-center gap-2.5 rounded-xl px-3 py-2" style={{ background: i === active ? C.blue : 'transparent', color: i === active ? '#fff' : C.ink }}>
            <Icon d={d} size={15} /> {l}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function MobileHeader() {
  return (
    <div className="flex shrink-0 items-end justify-between px-5 pb-3" style={{ background: C.blue, height: 104, borderRadius: '0 0 22px 22px' }}>
      <img src={blooLogo} alt="" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
      <span className="flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="block h-0.5 w-5 rounded bg-white" />)}</span>
    </div>
  );
}

// Contenido que se desplaza (simula el scroll de la página)
const scrollStyle = (y) => ({ transform: `translateY(${-y}px)`, transition: 'transform .9s cubic-bezier(.45,0,.2,1)' });
const box = { background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14 };

function CountUp({ to, decimals = 0, suffix = '' }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 800);
      setV(to * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v.toFixed(decimals)}{suffix}</>;
}

/* =========================================================
   Panel de control (Director)
   ========================================================= */
const KPIS = [
  { key: 'asis', label: 'Asistencia Actual', to: 91.5, dec: 1, suf: '%', meta: 'Meta: 93%', delta: '-1.5% vs meta', bad: true },
  { key: 'simce', label: 'Promedio SIMCE', to: 281, meta: 'Meta: 282.5', delta: '-1.5% vs meta', bad: true },
  { key: 'ret', label: 'Retención Escolar', to: 98.2, dec: 1, suf: '%', meta: 'Meta: 97%', delta: '+1.2% vs meta' },
];
const MONTHS = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];
const ATT = [91.6, 92.8, 90.4, 94.1, 93.4, 91.9];
const SIMCE = [['Lenguaje', 92, 86], ['Matemática', 94, 88], ['C. Naturales', 90, 84], ['Historia', 87, 81]];
const GOALS = [['Implementación Nuevo Currículum', 75], ['Certificación Excelencia Académica', 62], ['Mejora Infraestructura Digital', 88]];

function KpiCard({ k, ui, compact }) {
  const on = ui.kpi === k.key;
  return (
    <div data-t={`kpi-${k.key}`} style={{ ...box, padding: compact ? '9px 10px' : '14px 18px', borderColor: on ? C.blue : C.line, boxShadow: on ? `0 0 0 3px ${C.blue}22` : 'none', transition: 'all .35s' }}>
      <div style={{ fontSize: compact ? 9 : 11, color: C.mute }}>{k.label}</div>
      <div style={{ fontSize: compact ? 17 : 24, color: C.ink }}><CountUp to={k.to} decimals={k.dec} suffix={k.suf} /></div>
      <div style={{ fontSize: compact ? 8 : 9.5, color: C.mute }}>{k.meta}</div>
      <div style={{ fontSize: compact ? 8 : 9.5, color: k.bad ? '#d93b3b' : C.green }}>{k.delta}</div>
    </div>
  );
}

function AttendanceChart({ ui, w = 500, h = 190 }) {
  const x = (i) => 40 + i * ((w - 60) / 5);
  const y = (v) => 20 + ((100 - v) / 15) * (h - 50);
  const d = ATT.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  const hl = ui.kpi === 'asis';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[100, 97, 93, 89, 85].map((v) => (
        <g key={v}>
          <path d={`M32 ${y(v)}H${w - 10}`} stroke={C.line} strokeDasharray="3 4" />
          <text x="26" y={y(v) + 3} fontSize="9" textAnchor="end" fill={C.mute}>{v}</text>
        </g>
      ))}
      <path d={`M32 ${y(93)}H${w - 10}`} stroke={C.purple} strokeDasharray="5 4" strokeWidth="1.5" />
      <path d={d} fill="none" stroke={C.purple} strokeWidth={hl ? 3 : 2} pathLength={1} style={{ strokeDasharray: 1, animation: 'bloo-draw 1.1s ease both', transition: 'stroke-width .3s' }} />
      {ATT.map((v, i) => (
        <g key={i}>
          <circle data-t={i === 3 ? 'pt-jun' : undefined} cx={x(i)} cy={y(v)} r={ui.tip && i === 3 ? 6 : 4} fill="#fff" stroke={C.purple} strokeWidth="2" style={{ transition: 'r .3s' }} />
          <text x={x(i)} y={h - 6} fontSize="9.5" textAnchor="middle" fill={C.mute}>{MONTHS[i]}</text>
        </g>
      ))}
      {ui.tip && (
        <g style={{ animation: 'bloo-fade .3s ease both' }}>
          <rect x={x(3) - 52} y={y(ATT[3]) - 44} width="104" height="32" rx="8" fill={C.ink} />
          <text x={x(3)} y={y(ATT[3]) - 30} fontSize="10" textAnchor="middle" fill="#fff">Junio · 94.1%</text>
          <text x={x(3)} y={y(ATT[3]) - 18} fontSize="9" textAnchor="middle" fill="#9fd9b7">+1.1% sobre la meta</text>
        </g>
      )}
    </svg>
  );
}

function SimceChart({ h = 170 }) {
  return (
    <div className="flex items-end justify-around gap-3" style={{ height: h }}>
      {SIMCE.map(([t, meta, act], i) => (
        <div key={t} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full items-end justify-center gap-1" style={{ height: h - 24 }}>
            <div className="w-[38%] origin-bottom rounded-t" style={{ height: `${meta}%`, background: '#d4dcec', animation: `bloo-grow-y .8s ease ${i * 0.08}s both` }} />
            <div className="w-[38%] origin-bottom rounded-t" style={{ height: `${act}%`, background: C.blue, animation: `bloo-grow-y .8s ease ${0.1 + i * 0.08}s both` }} />
          </div>
          <span style={{ fontSize: 9.5, color: C.mute }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function Goals({ ui, compact }) {
  return (
    <div style={{ ...box, padding: compact ? 14 : 20 }}>
      <div style={{ fontSize: compact ? 13 : 14, color: C.ink }}>Avance de Objetivos Estratégicos 2024</div>
      <div className="mt-3 space-y-3">
        {GOALS.map(([t, v], i) => (
          <div key={t}>
            <div className="flex justify-between" style={{ fontSize: compact ? 10.5 : 11.5, color: C.ink }}><span>{t}</span><span>{v}%</span></div>
            <div className="mt-1.5 h-2 rounded-full" style={{ background: '#e8edf5' }}>
              <div className="h-full rounded-full" style={{ width: ui.goals ? `${v}%` : '0%', background: C.blue, transition: `width 1.1s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANEL_NAV = [['Resumen', I.note], ['Proyectos PME', I.res], ['Matrícula y SEP', I.user], ['Finanzas', I.cal], ['Aprobación Gastos', I.check], ['Comunicaciones', I.chat]];

function PanelWeb({ ui }) {
  return (
    <div className="relative flex h-full font-sans" style={{ background: C.bg }}>
      <WebSidebar items={PANEL_NAV} active={0} />
      <div className="flex-1 overflow-hidden">
        <div className="px-8 pt-6" style={scrollStyle(ui.scroll ? 250 : 0)}>
          <h3 style={{ color: C.blue, fontSize: 24, fontWeight: 700 }}>Panel de control</h3>
          <p style={{ color: C.mute, fontSize: 12 }}>Gestión de Cumplimientos - Objetivos Anuales 2024</p>
          <div className="mt-4 grid w-[640px] grid-cols-3 gap-4">{KPIS.map((k) => <KpiCard key={k.key} k={k} ui={ui} />)}</div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div style={{ ...box, padding: 18 }}>
              <div style={{ fontSize: 14, color: C.ink }}>Evolución Asistencia Mensual</div>
              <div style={{ fontSize: 11, color: C.mute }}>Comparación meta vs actual</div>
              <AttendanceChart ui={ui} />
            </div>
            <div style={{ ...box, padding: 18 }}>
              <div style={{ fontSize: 14, color: C.ink }}>Resultados SIMCE por Asignatura</div>
              <div style={{ fontSize: 11, color: C.mute, marginBottom: 12 }}>Meta vs puntaje obtenido</div>
              <SimceChart />
            </div>
          </div>
          <div className="mt-4"><Goals ui={ui} /></div>
        </div>
      </div>
    </div>
  );
}

function PanelMobile({ ui }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden font-sans" style={{ background: C.bg }}>
      <MobileHeader />
      <div className="flex-1 overflow-hidden">
        <div className="space-y-3 px-4 pt-4" style={scrollStyle(ui.scroll ? 420 : 0)}>
          <div>
            <h3 style={{ color: C.blue, fontSize: 20, fontWeight: 700 }}>Panel de control</h3>
            <p style={{ color: C.mute, fontSize: 11 }}>Objetivos Anuales 2024</p>
          </div>
          <div className="grid grid-cols-3 gap-2">{KPIS.map((k) => <KpiCard key={k.key} k={k} ui={ui} compact />)}</div>
          <div style={{ ...box, padding: 12 }}>
            <div style={{ fontSize: 13, color: C.ink }}>Evolución Asistencia Mensual</div>
            <AttendanceChart ui={ui} w={340} h={190} />
          </div>
          <div style={{ ...box, padding: 12 }}>
            <div style={{ fontSize: 13, color: C.ink, marginBottom: 8 }}>Resultados SIMCE</div>
            <SimceChart h={140} />
          </div>
          <Goals ui={ui} compact />
        </div>
      </div>
    </div>
  );
}

const PANEL_PHASES = ['Indicadores clave del año', 'Evolución de la asistencia mensual', 'Avance de objetivos estratégicos'];

async function panelScript({ set, press, sleep }) {
  await sleep(1800);
  set({ phase: 1 });
  await press('kpi-asis');
  set({ kpi: 'asis' });
  await sleep(900);
  await press('pt-jun');
  set({ tip: true });
  await sleep(2200);
  set({ phase: 2, tip: false, kpi: null, scroll: true });
  await sleep(1000);
  set({ goals: true });
  await sleep(2800);
}

export function PanelFlow() {
  return (
    <DualPlayer
      label="Panel de control"
      phases={PANEL_PHASES}
      initial={{ phase: 0, kpi: null, tip: false, scroll: false, goals: false }}
      script={panelScript}
      Web={PanelWeb}
      Mobile={PanelMobile}
    />
  );
}

/* =========================================================
   Anotaciones docente
   ========================================================= */
const ANOT_NAV = [['Resumen', I.note], ['Proyectos PME', I.res], ['Matrícula y SEP', I.user], ['Finanzas', I.cal], ['Aprobación Gastos', I.check], ['Comunicaciones', I.chat]];
const PURPLE = '#3d1470';
const TYPES = {
  pos: ['Anotación Positiva', '#e8f8ef', C.green],
  grave: ['Negativa Grave', '#ffe9e9', '#d93b3b'],
  leve: ['Negativa Leve', '#fff6d6', '#b78a00'],
};
const NOTES = [
  { type: 'pos', name: 'Sofía Ramírez Torres', course: '7° Básico A', subject: 'Matemática', text: 'Excelente participación en clase. Ayudó a sus compañeros a resolver ejercicios de álgebra.', date: '28/11/2024 10:30' },
  { type: 'grave', name: 'Diego Muñoz Silva', course: '7° Básico A', subject: 'Matemática', text: 'Agresión verbal a compañera durante actividad grupal. Falta de respeto reiterada.', date: '27/11/2024 11:45' },
  { type: 'leve', name: 'Valentina López Díaz', course: '8° Básico B', subject: 'Geometría', text: 'Olvido de materiales de clase (tercera vez en el mes).', date: '26/11/2024 09:15' },
];
const NEW_NOTE = { type: 'pos', name: 'Tomás Fuentes Vera', course: '7° Básico A', subject: 'Matemática', text: 'Lideró el trabajo en equipo y apoyó a sus compañeros en la guía de fracciones.', date: '29/11/2024 12:10' };

const Tag = ({ type, small }) => {
  const [l, bg, fg] = TYPES[type];
  return <span className="rounded-md px-2 py-0.5" style={{ background: bg, color: fg, fontSize: small ? 9.5 : 10.5 }}>{l}</span>;
};
const HistBtn = ({ t, small }) => (
  <span data-t={t} className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1" style={{ border: `1px solid ${C.line}`, fontSize: small ? 10.5 : 11.5, color: C.ink }}>
    <Icon d="M8 3h8v3H8z M6 5H5v16h14V5h-1 M12 11v4l2 1" size={13} /> Ver historial
  </span>
);

function NoteCard({ n, first, isNew, compact }) {
  return (
    <div className="rounded-xl bg-white" style={{ border: `1px solid ${isNew ? '#bfe8cf' : C.line}`, padding: compact ? 12 : '14px 18px', animation: isNew ? 'bloo-in .6s ease both' : 'none' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Tag type={n.type} small={compact} />
          <span style={{ fontSize: compact ? 12.5 : 14, color: C.ink }}>{n.name}</span>
          <span style={{ fontSize: compact ? 10 : 11, color: C.mute }}>· {n.course}</span>
        </div>
        {!compact && <HistBtn t={first ? 'historial' : undefined} />}
      </div>
      <span className="mt-1.5 inline-block rounded-md px-2 py-0.5" style={{ border: `1px solid ${C.line}`, fontSize: 10, color: C.ink }}>{n.subject}</span>
      <p style={{ fontSize: compact ? 11.5 : 13, color: C.ink, marginTop: 6 }}>{n.text}</p>
      <div className="mt-1 flex items-center justify-between" style={{ fontSize: compact ? 10 : 11, color: C.mute }}>
        <span>{n.date} · Registrado por: Ana María González</span>
        {compact && <HistBtn t={first ? 'historial' : undefined} small />}
      </div>
    </div>
  );
}

function AnotStats({ ui, compact }) {
  const items = [['Positivas', ui.added ? 4 : 3], ['Neg. leves', 12], ['Neg. moderadas', 10], ['Neg. graves', 10]];
  return (
    <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-4'}`}>
      {items.map(([l, v]) => (
        <div key={l} className="flex items-center justify-between rounded-xl" style={{ background: '#f1f6ff', padding: compact ? '10px 12px' : '16px 20px' }}>
          <div>
            <div style={{ fontSize: compact ? 10 : 11.5, color: C.mute }}>{l}</div>
            <div key={v} style={{ fontSize: compact ? 18 : 24, color: C.ink, animation: 'bloo-pop .4s ease both' }}>{v}</div>
          </div>
          {!compact && <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: '#dfeaff' }}><Icon d={I.chat} color={C.blue} /></span>}
        </div>
      ))}
    </div>
  );
}

/* Modal: Historial de anotaciones */
function Historial({ compact }) {
  const stat = (l, v, bg, fg) => (
    <div className="rounded-lg px-2.5 py-2" style={{ background: bg, border: `1px solid ${fg}33` }}>
      <div style={{ fontSize: 8.5, color: fg }}>{l}</div>
      <div style={{ fontSize: compact ? 15 : 17, color: fg === C.mute ? C.ink : fg }}>{v}</div>
    </div>
  );
  return (
    <>
      <div className="px-6 py-4" style={{ background: '#e6f0ff' }}>
        <div style={{ fontSize: compact ? 17 : 19, color: '#13294b' }}>Historial de anotaciones</div>
        <div style={{ fontSize: 11, color: C.ink }}>Registro completo de anotaciones del estudiante por todos los docentes del establecimiento</div>
      </div>
      <div className="space-y-3 px-6 py-4">
        <div className={`grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-5'}`}>
          {stat('Total Anotaciones', 2, '#fff', C.mute)}
          {stat('Positivas', 2, '#effaf3', C.green)}
          {stat('Negativas Leves', 0, '#fffbe6', '#b78a00')}
          {!compact && stat('Neg. Moderadas', 0, '#fff4ec', C.orange)}
          {!compact && stat('Neg. Graves', 0, '#fff1f1', '#d93b3b')}
        </div>
        <div className="rounded-xl p-3" style={{ background: '#eaf2ff' }}>
          <div className="flex items-center gap-2" style={{ fontSize: 12, color: '#13294b' }}><Icon d={I.user} size={13} color={C.blue} /> Docentes que han registrado anotaciones (2)</div>
          <div className="mt-2 flex gap-2">
            {[['Ana María', '1 anotación'], ['Carlos Pérez Soto', '1 anotación']].map(([n, s]) => (
              <div key={n} className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-2">
                <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: '#e3edff' }}><Icon d={I.user} size={12} color={C.blue} /></span>
                <div><div style={{ fontSize: 11.5, color: C.ink }}>{n}</div><div style={{ fontSize: 9.5, color: C.mute }}>{s}</div></div>
              </div>
            ))}
          </div>
        </div>
        {!compact && (
          <div className="rounded-xl p-3" style={{ border: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12, color: C.ink }}><Icon d={I.file} size={13} /> Asignaturas involucradas (2)</div>
            <div className="mt-2 flex gap-2">
              {['Matemática (1)', 'Lenguaje (1)'].map((s) => <span key={s} className="rounded-lg px-3 py-1.5" style={{ border: `1px solid ${C.line}`, fontSize: 11.5, color: C.ink }}>{s}</span>)}
            </div>
          </div>
        )}
        <div className="rounded-xl p-3" style={{ background: '#f2fbf5', border: '1px solid #d4efdf' }}>
          <div className="flex gap-2"><Tag type="pos" small /><span className="rounded-md px-2 py-0.5" style={{ border: `1px solid ${C.line}`, fontSize: 9.5, color: C.ink, background: '#fff' }}>Matemática</span></div>
          <p style={{ fontSize: 12, color: C.ink, marginTop: 6 }}>Excelente participación en clase. Ayudó a sus compañeros a resolver ejercicios de álgebra.</p>
          <div className="mt-2 flex items-center justify-between" style={{ fontSize: 10, color: C.mute }}><span>Ana María González · Docente</span><span>28/11/2024 10:30</span></div>
        </div>
      </div>
    </>
  );
}

/* Modal: Nueva anotación */
function NuevaForm({ ui, compact }) {
  const field = (label, value, icon) => (
    <div className="flex items-center justify-between rounded-lg px-3" style={{ border: `1px solid ${value ? C.blue : C.line}`, height: compact ? 44 : 40, fontSize: compact ? 13 : 12, color: value ? C.ink : C.mute, transition: 'border-color .3s' }}>
      <span>{value || <>{label}<span style={{ color: '#d93b3b' }}>*</span></>}</span>
      <Icon d={icon} size={14} color={C.ink} />
    </div>
  );
  return (
    <>
      <div className="px-6 py-4" style={{ background: '#e6f0ff' }}>
        <div style={{ fontSize: compact ? 17 : 19, color: '#13294b' }}>Nueva anotación</div>
        <div style={{ fontSize: 11, color: C.ink }}>Complete los datos de la anotación del estudiante</div>
      </div>
      <div className="space-y-2.5 px-6 py-4">
        {field('Tipo de anotación', ui.f1 && 'Anotación positiva', 'M6 9l6 6 6-6')}
        {field('Asignatura', ui.f2 && 'Matemática', 'M6 9l6 6 6-6')}
        {field('Estudiante', ui.f3 && 'Tomás Fuentes Vera · 7° Básico A', 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4')}
        <div className="rounded-lg px-3 py-2" style={{ border: `1px solid ${ui.desc ? C.blue : C.line}`, minHeight: compact ? 84 : 76, fontSize: compact ? 13 : 12, color: ui.desc ? C.ink : C.mute }}>
          {ui.desc || 'Describa el caso....'}
        </div>
      </div>
    </>
  );
}

function AnotModal({ ui, compact }) {
  if (!ui.modal) return null;
  const isHist = ui.modal === 'hist';
  const footer = isHist ? (
    <div className="flex justify-center py-3" style={{ background: '#efe7fa' }}>
      <span data-t="volver" className="rounded-full px-10" style={{ background: '#dccdf3', color: PURPLE, fontSize: compact ? 15 : 12.5, height: compact ? 46 : 34, display: 'inline-flex', alignItems: 'center' }}>Volver</span>
    </div>
  ) : (
    <div className="flex justify-center gap-3 py-3" style={{ background: '#efe7fa', padding: compact ? '12px 20px 30px' : undefined }}>
      <span className={`${compact ? 'flex-1' : ''} rounded-full px-8 text-center`} style={{ background: '#e3d6f6', color: PURPLE, fontSize: compact ? 15 : 12.5, height: compact ? 48 : 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Cancelar</span>
      <span data-t="registrar" className={`${compact ? 'flex-1' : ''} rounded-full px-8 text-center`} style={{ background: PURPLE, color: '#fff', fontSize: compact ? 15 : 12.5, height: compact ? 48 : 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Registrar</span>
    </div>
  );
  const body = isHist ? <Historial compact={compact} /> : <NuevaForm ui={ui} compact={compact} />;
  if (compact) {
    // Móvil: hoja que sube desde abajo, con los botones al alcance del pulgar
    return (
      <div className="absolute inset-0 z-20" style={{ background: 'rgba(31,42,68,.32)', animation: 'bloo-fade .3s ease both' }}>
        <div key={ui.modal} className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-[26px] bg-white" style={{ animation: 'bloo-sheet .45s cubic-bezier(.2,.8,.2,1) both' }}>
          <div className="flex justify-center bg-[#e6f0ff] pb-1 pt-2.5"><span className="h-1.5 w-10 rounded-full" style={{ background: '#c3cfe3' }} /></div>
          {body}
          {footer}
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 z-20 grid place-items-center" style={{ background: 'rgba(31,42,68,.32)', animation: 'bloo-fade .3s ease both' }}>
      <div key={ui.modal} className="overflow-hidden rounded-2xl bg-white" style={{ width: isHist ? 680 : 480, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)', animation: 'bloo-pop .35s cubic-bezier(.2,.7,.2,1) both' }}>
        {body}
        {footer}
      </div>
    </div>
  );
}

function Toast({ ui }) {
  return (
    <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-2.5 text-white" style={{ background: C.green, fontSize: 12.5, transition: 'opacity .4s', opacity: ui.toast ? 1 : 0, whiteSpace: 'nowrap' }}>
      <Icon d="M5 12l4 4 10-10" color="#fff" size={14} /> Anotación registrada
    </div>
  );
}

function AnotWeb({ ui }) {
  const list = ui.added ? [NEW_NOTE, ...NOTES.slice(0, 2)] : NOTES;
  return (
    <div className="relative flex h-full font-sans" style={{ background: C.bg }}>
      <WebSidebar items={ANOT_NAV} active={5} />
      <div className="flex-1 overflow-hidden px-8 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 style={{ color: C.blue, fontSize: 24, fontWeight: 700 }}>Anotaciones</h3>
            <p style={{ color: C.mute, fontSize: 12 }}>Gestiona anotaciones positivas y negativas de tus estudiantes</p>
          </div>
          <span data-t="nueva" className="inline-flex items-center gap-1.5 rounded-full px-4 py-2" style={{ background: PURPLE, color: '#fff', fontSize: 12 }}>
            <Icon d={I.plus} size={13} color="#fff" /> Nueva anotación
          </span>
        </div>
        <div className="mt-4"><AnotStats ui={ui} /></div>
        <div className="mt-4 rounded-2xl bg-white p-4">
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 11.5, color: C.mute }}>Mostrando {ui.added ? 15 : 14} de {ui.added ? 15 : 14} anotaciones</span>
            <div className="flex rounded-full p-1" style={{ background: '#eef1f6', fontSize: 11 }}>
              {['Todas', 'Positivas', 'Negativas'].map((t, i) => <span key={t} className="rounded-full px-3 py-1" style={{ background: i === 0 ? '#fff' : 'transparent', color: C.ink }}>{t}</span>)}
            </div>
          </div>
          <div className="mt-3 space-y-2.5">
            {list.map((n, i) => <NoteCard key={n.name} n={n} first={i === 0 && !ui.added} isNew={ui.added && i === 0} />)}
          </div>
        </div>
      </div>
      <AnotModal ui={ui} />
      <Toast ui={ui} />
    </div>
  );
}

function AnotMobile({ ui }) {
  const list = ui.added ? [NEW_NOTE, ...NOTES] : NOTES;
  return (
    <div className="relative flex h-full flex-col overflow-hidden font-sans" style={{ background: C.bg }}>
      <MobileHeader />
      <div className="space-y-3 px-4 pt-4">
        <div>
          <h3 style={{ color: C.blue, fontSize: 20, fontWeight: 700 }}>Anotaciones</h3>
          <p style={{ color: C.mute, fontSize: 11 }}>Anotaciones positivas y negativas de tus estudiantes</p>
        </div>
        <span data-t="nueva" className="flex w-full items-center justify-center gap-1.5 rounded-xl" style={{ background: PURPLE, color: '#fff', fontSize: 14, height: 44 }}>
          <Icon d={I.plus} size={15} color="#fff" /> Nueva anotación
        </span>
        <AnotStats ui={ui} compact />
        <div className="space-y-2.5">
          {list.map((n, i) => <NoteCard key={n.name} n={n} first={i === 0 && !ui.added} isNew={ui.added && i === 0} compact />)}
        </div>
      </div>
      <AnotModal ui={ui} compact />
      <Toast ui={ui} />
    </div>
  );
}

const ANOT_PHASES = ['Vista general de anotaciones', 'Historial de anotaciones del estudiante', 'Nueva anotación: completar y registrar'];

async function anotScript({ set, press, sleep }) {
  await sleep(1600);
  set({ phase: 1 });
  await press('historial');
  set({ modal: 'hist' });
  await sleep(2800);
  await press('volver');
  set({ modal: null });
  await sleep(700);
  set({ phase: 2 });
  await press('nueva');
  set({ modal: 'nueva' });
  await sleep(700);
  set({ f1: true });
  await sleep(500);
  set({ f2: true });
  await sleep(500);
  set({ f3: true });
  await sleep(500);
  for (let i = 1; i <= NEW_NOTE.text.length; i += 2) {
    set({ desc: NEW_NOTE.text.slice(0, i) });
    await sleep(40);
  }
  set({ desc: NEW_NOTE.text });
  await sleep(600);
  await press('registrar');
  set({ modal: null, added: true, toast: true });
  await sleep(2400);
  set({ toast: false });
  await sleep(800);
}

export function AnotacionesFlow() {
  return (
    <DualPlayer
      label="Anotaciones docente"
      phases={ANOT_PHASES}
      initial={{ phase: 0, modal: null, f1: false, f2: false, f3: false, desc: '', added: false, toast: false }}
      script={anotScript}
      Web={AnotWeb}
      Mobile={AnotMobile}
    />
  );
}