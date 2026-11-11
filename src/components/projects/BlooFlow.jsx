import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import blooLogo from '../../assets/projects/bloo/logo.png';


// Ritmo de los recorridos: < 1 = más rápido (afecta esperas, clics y escritura)
const SPEED = 0.6;
/**
 * Recorrido animado por la plataforma Bloo (solo reproducción: el visitante no interactúa).
 * Pantallas recreadas en código a partir de los diseños de María, para que se vean nítidas a cualquier tamaño.
 * Flujo: 1. Inicio docente → 2. Mis materias → detalle → evaluaciones → 3. Recursos del docente → nuevo recurso.
 */

const W = 1200; // tamaño de diseño del lienzo; se escala al ancho disponible
const H = 750;

const C = {
  blue: '#0b6bff',
  blueSoft: '#eaf2ff',
  bg: '#eef3fb',
  ink: '#1f2a44',
  mute: '#6b7690',
  line: '#e3e9f3',
  purple: '#8b4fd6',
  green: '#19a65a',
  orange: '#ff5a1f',
};

const PHASES = [
  'Vista de control de acceso docente',
  'Mis materias: vista principal, detalle de la asignatura y evaluaciones',
  'Recursos del docente: creación de un nuevo recurso',
];

/* ---------- Piezas de la interfaz ---------- */
function Icon({ d, size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const I = {
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  book: 'M4 5.5C6 4.5 9 4.5 12 6c3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5z M12 6v13.5',
  check: 'M6 4h12v16H6z M9 12l2 2 4-4',
  note: 'M5 4h10l4 4v12H5z M9 12h6 M9 16h4',
  cal: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  res: 'M7 3h7l4 4v14H7z M14 3v4h4',
  chat: 'M4 5h16v11H9l-5 4z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4z M10 21h4',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  file: 'M7 3h7l4 4v14H7z M10 13h5 M10 17h5',
  upload: 'M12 16V5 M7 10l5-5 5 5 M5 19h14',
  x: 'M6 6l12 12 M18 6 6 18',
};

const NAV = [
  ['inicio', 'Inicio', I.home],
  ['materias', 'Mis materias', I.book],
  ['asistencias', 'Asistencias', I.check],
  ['anotaciones', 'Anotaciones', I.note],
  ['planificacion', 'Planificación', I.cal],
  ['recursos', 'Recursos del docente', I.res, true],
  ['leccionario', 'Leccionario', I.book],
  ['calificaciones', 'Calificaciones', I.note],
  ['mensajeria', 'Mensajería', I.chat],
];

function Sidebar({ active }) {
  return (
    <aside style={{ width: 210, background: '#fff', borderRadius: '0 0 28px 0', boxShadow: '4px 0 24px -12px rgba(31,42,68,.18)' }} className="flex shrink-0 flex-col">
      <div style={{ background: C.blue, height: 74, borderRadius: '0 0 28px 0' }} className="grid place-items-center">
        <img src={blooLogo} alt="" style={{ height: 34, filter: 'brightness(0) invert(1)' }} />
      </div>
      <nav className="mt-4 flex flex-col gap-1 px-3">
        {NAV.map(([key, label, d, sub]) => {
          const on = active === key || (active === 'materias' && key === 'materias');
          return (
            <div
              key={key}
              data-t={`nav-${key}`}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2"
              style={{
                marginLeft: sub ? 18 : 0,
                background: on ? C.blue : 'transparent',
                color: on ? '#fff' : C.ink,
                fontSize: 12.5,
                whiteSpace: 'nowrap',
                transition: 'background .35s, color .35s',
              }}
            >
              <Icon d={d} size={15} />
              {label}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="flex items-center justify-end gap-3 px-8 pt-4">
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-white" style={{ boxShadow: '0 2px 8px rgba(31,42,68,.08)' }}>
        <Icon d={I.bell} color={C.blue} />
        <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full text-[9px] font-semibold" style={{ background: '#ffcc33', color: C.ink }}>12</span>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5" style={{ border: `1px solid ${C.line}` }}>
        <span className="grid h-7 w-7 place-items-center rounded-md text-[11px] font-semibold text-white" style={{ background: C.blue }}>ML</span>
        <span className="leading-tight" style={{ fontSize: 10.5, color: C.ink }}>María Latuff<br /><span style={{ color: C.mute, fontSize: 9 }}>Directora</span></span>
      </div>
      <span style={{ fontFamily: 'Georgia, serif', color: '#e2a400', fontSize: 18, letterSpacing: '.04em' }}>PATMOS</span>
    </div>
  );
}

const card = { background: '#fff', borderRadius: 16, border: `1px solid ${C.line}` };
const btn = (bg) => ({ background: bg, color: '#fff', borderRadius: 8, fontSize: 11.5, padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 });

function ScreenInicio() {
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 24, fontWeight: 700 }}>¡Bienvenida de vuelta, Felipe!</h3>
      <p style={{ color: C.mute, fontSize: 12 }}>Aquí está el resumen de tu jornada educativa</p>
      <div className="mt-4 flex gap-4">
        {[['Estudiantes', '116'], ['Anotaciones', '12'], ['Asistencia', '98%']].map(([l, v]) => (
          <div key={l} className="flex w-44 items-center justify-between p-4" style={{ ...card, background: '#f5f8fe' }}>
            <div><div style={{ fontSize: 11, color: C.mute }}>{l}</div><div style={{ fontSize: 22, color: C.ink }}>{v}</div></div>
            <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: C.blueSoft }}><Icon d={I.chat} color={C.blue} /></span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4" style={card}>
        <div className="flex items-center gap-4 rounded-xl p-4 text-white" style={{ background: C.purple }}>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/25"><Icon d={I.user} size={22} color="#fff" /></span>
          <div className="flex-1">
            <div style={{ fontSize: 16, fontWeight: 600 }}>Felipe Morales</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Docente · 4 cursos asignados · 18 hrs semanales</div>
          </div>
          <span className="rounded-full px-3 py-1.5" style={{ background: '#2d1460', fontSize: 10.5 }}>+ Ver perfil completo</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[['Matemática', '7° Básico A · 10:00 - 11:30', C.blue, '#f1f6ff'], ['Geometría', '8° Básico A · 14:00 - 15:30', C.green, '#effaf3']].map(([t, s, b, bg]) => (
            <div key={t} className="rounded-lg px-3 py-2.5" style={{ background: bg, borderLeft: `3px solid ${b}` }}>
              <div style={{ fontSize: 12, color: C.ink }}>{t}</div>
              <div style={{ fontSize: 10, color: C.purple }}>{s}</div>
            </div>
          ))}
        </div>
        <div className="mt-4" style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Módulos del Sistema</div>
        <div className="mt-2 grid grid-cols-3 gap-3">
          {[['Mis Materias', '4 materias · 116 estudiantes', C.blue], ['Planificación', '1 pendiente de entrega', '#9b2cf0'], ['Asistencia', 'Asistencia tomada hoy', C.orange]].map(([t, s, b]) => (
            <div key={t} className="p-3" style={{ ...card, background: '#fafcff' }}>
              <div style={{ fontSize: 12.5, color: C.ink }}>{t}</div>
              <div style={{ fontSize: 10, color: b, margin: '4px 0 8px' }}>{s}</div>
              <div style={{ ...btn(b), justifyContent: 'center', width: '100%', padding: '5px 0', fontSize: 10.5 }}>Abrir <Icon d={I.arrow} size={11} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const EVALS = [
  ['Matemática 7°A', 'Prueba Escrita', 'Números Enteros', '31 de diciembre de 2024'],
  ['Geometría 8°A', 'Trabajo Práctico', 'Figuras Geométricas', '02 de diciembre de 2024'],
  ['Matemática 7°B', 'Prueba Escrita', 'Fracciones', '04 de diciembre de 2024'],
  ['Álgebra 8°B', 'Disertación', 'Ecuaciones Lineales', '07 de diciembre de 2024'],
];

function ScreenMaterias() {
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Mis asignaturas</h3>
      <p style={{ color: C.mute, fontSize: 12 }}>Asignaturas, evaluaciones y seguimiento académico</p>
      <div className="mt-4 p-5" style={card}>
        <div style={{ fontSize: 13, color: C.ink }}>Mis Asignaturas</div>
        <div className="mt-3 flex gap-4">
          {[['Matemática', '7° Básico A, 7° Básico B'], ['Geometría', '7° Básico A, 8° Básico B']].map(([t, s], i) => (
            <div key={t} className="w-64 p-4" style={{ ...card, background: '#f1f6ff', borderColor: '#d6e4fb' }}>
              <div style={{ fontSize: 14, color: C.ink }}>{t}</div>
              <div style={{ fontSize: 10.5, color: C.blue }}>{s}</div>
              <div style={{ fontSize: 10, color: C.mute, margin: '10px 0' }}>2 cursos</div>
              <div data-t={i === 0 ? 'ver-detalle' : undefined} className="text-center" style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 8, fontSize: 10.5, padding: '6px 0', color: C.ink }}>
                Ver Detalle de la Asignatura →
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 p-5" style={card}>
        <div className="flex items-center gap-2" style={{ fontSize: 13, color: C.ink }}><Icon d={I.cal} size={14} color={C.blue} /> Próximas Evaluaciones</div>
        <table className="mt-3 w-full" style={{ fontSize: 11, color: C.ink }}>
          <thead><tr style={{ color: C.mute, textAlign: 'left' }}>{['Materia', 'Tipo', 'Tema', 'Fecha', 'Estado'].map((h) => <th key={h} className="pb-2 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {EVALS.map((r) => (
              <tr key={r[2]} style={{ borderTop: `1px solid ${C.line}` }}>
                {r.map((c, k) => <td key={k} className="py-2">{k === 1 ? <span className="rounded px-1.5 py-0.5" style={{ background: '#f2f4f8', fontSize: 10 }}>{c}</span> : c}</td>)}
                <td><span className="rounded-full px-2 py-0.5" style={{ background: C.blueSoft, color: C.blue, fontSize: 10 }}>Próxima</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const STUDENTS = [
  ['Juan Pérez Silva', 6.2], ['María González López', 5.8], ['Pedro Martínez Rojas', 4.9], ['Ana Fernández Castro', 6.7],
  ['Luis Rodríguez Vera', 5.3], ['Carmen Silva Morales', 6.9], ['Roberto Torres Núñez', 4.6], ['Isabel Campos Soto', 6.4],
];
const noteColor = (n) => (n >= 6 ? ['#e8f8ef', C.green] : n >= 5 ? ['#fff6df', '#c98a00'] : ['#ffeaea', '#d93b3b']);

function ScreenDetalle({ tab }) {
  return (
    <div className="px-8 pt-2">
      <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Matemática</h3>
      <div className="mt-3 p-5" style={card}>
        <div className="w-80 p-4" style={{ ...card, background: '#f1f6ff', borderColor: '#d6e4fb' }}>
          <div style={{ fontSize: 14, color: C.ink }}>Matemática</div>
          <div style={{ fontSize: 10.5, color: C.blue }}>7° Básico A, 7° Básico B</div>
          <div className="mt-2 grid grid-cols-2 gap-1" style={{ fontSize: 10, color: C.mute }}>
            <span>Lunes: 08:00-09:30</span><span>Martes: 08:00-09:30</span><span>Miércoles: 10:00-11:30</span><span>Jueves: 10:00-11:30</span>
          </div>
        </div>
        <div className="mt-5 flex gap-6" style={{ fontSize: 12, borderBottom: `1px solid ${C.line}` }}>
          {[['estudiantes', 'Lista de Estudiantes'], ['evaluaciones', 'Evaluaciones']].map(([k, l]) => (
            <div key={k} data-t={`tab-${k}`} className="pb-2" style={{ color: tab === k ? C.blue : C.mute, borderBottom: `2px solid ${tab === k ? C.blue : 'transparent'}`, transition: 'all .3s' }}>{l}</div>
          ))}
        </div>
        {tab === 'estudiantes' ? (
          <table className="mt-3 w-full" style={{ fontSize: 11, color: C.ink }}>
            <thead><tr style={{ color: C.mute, textAlign: 'left' }}><th className="pb-2 font-medium">Nombre</th><th className="pb-2 font-medium">Curso</th><th className="pb-2 text-right font-medium">Promedio</th></tr></thead>
            <tbody>
              {STUDENTS.map(([n, p]) => {
                const [bg, fg] = noteColor(p);
                return (
                  <tr key={n} style={{ borderTop: `1px solid ${C.line}` }}>
                    <td className="py-1.5">{n}</td><td>7° Básico A</td>
                    <td className="text-right"><span className="rounded px-1.5 py-0.5" style={{ background: bg, color: fg, fontSize: 10 }}>{p.toFixed(1)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="mt-4">
            <div style={{ fontSize: 11.5, color: C.ink }}>Próximas Evaluaciones</div>
            <div className="mt-2 flex gap-3">
              {[['Números Enteros', '31 de diciembre de 2024'], ['Fracciones', '04 de diciembre de 2024']].map(([t, f]) => (
                <div key={t} className="w-56 p-3" style={{ ...card, background: '#f5f8fe' }}>
                  <span className="rounded px-1.5 py-0.5" style={{ background: '#fff', fontSize: 9.5, color: C.mute }}>Prueba Escrita</span>
                  <div style={{ fontSize: 12, color: C.ink, marginTop: 6 }}>{t}</div>
                  <div style={{ fontSize: 10, color: C.mute }}>{f} · 7° Básico A</div>
                </div>
              ))}
            </div>
            <div className="mt-4" style={{ fontSize: 11.5, color: C.ink }}>Evaluaciones Realizadas</div>
            <div className="mt-2 w-[470px] p-3" style={{ ...card, background: '#effaf3', borderColor: '#cdeedb' }}>
              <div className="flex justify-between" style={{ fontSize: 10, color: C.mute }}><span>Control</span><span className="rounded px-1.5 text-white" style={{ background: C.green }}>Realizada</span></div>
              <div style={{ fontSize: 12, color: C.ink, marginTop: 4 }}>Operaciones Básicas</div>
              <div style={{ fontSize: 10, color: C.mute }}>7° Básico A</div>
              <div data-t="ver-notas" className="mt-2 inline-block rounded-md bg-white px-2.5 py-1" style={{ fontSize: 10.5, color: C.ink, border: `1px solid ${C.line}` }}>Ver Notas de Alumnos</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalNotas() {
  return (
    <div className="w-[520px] p-5" style={{ ...card, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)' }}>
      <div style={{ fontSize: 15, color: C.ink }}>Evaluación realizada</div>
      <div style={{ fontSize: 10.5, color: C.mute }}>Visualiza la información de la evaluación y las notas de los alumnos</div>
      <div className="mt-3 p-3" style={{ ...card, background: '#f7f9fc' }}>
        <div className="flex justify-between" style={{ fontSize: 10, color: C.mute }}><span>Prueba Escrita</span><span className="rounded px-1.5 text-white" style={{ background: C.green }}>Realizada</span></div>
        <div style={{ fontSize: 12.5, color: C.ink }}>Perímetros y Áreas · 8° Básico A</div>
      </div>
      <table className="mt-3 w-full" style={{ fontSize: 11, color: C.ink }}>
        <thead><tr style={{ color: C.mute, textAlign: 'left' }}><th className="pb-2 font-medium">Alumno</th><th className="pb-2 font-medium">Nota</th><th className="pb-2 font-medium">Imagen</th></tr></thead>
        <tbody>
          {[['Carlos Muñoz Díaz', 6.2], ['Sofía Ramírez Torres', 5.6], ['Diego Herrera Jiménez', 4.8]].map(([n, p]) => {
            const [bg, fg] = noteColor(p);
            return (
              <tr key={n} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-2">{n}</td>
                <td><span className="rounded px-1.5 py-0.5" style={{ background: bg, color: fg, fontSize: 10 }}>{p.toFixed(1)}</span></td>
                <td style={{ color: C.blue }}>Ver</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        <span data-t="cerrar" className="rounded-md px-6 py-1.5" style={{ background: '#efe6fb', color: C.purple, fontSize: 11 }}>Cerrar</span>
      </div>
    </div>
  );
}

const RESOURCES = [
  ['Guía Números Enteros', 'Matemática · 7° Básico A', 'Guía'],
  ['Presentación Figuras Geométricas', 'Geometría · 8° Básico A', 'Presentación'],
  ['Pauta Ecuaciones Lineales', 'Álgebra · 8° Básico B', 'Evaluación'],
];

function ScreenRecursos({ added }) {
  const rows = added ? [['Guía de Fracciones', 'Matemática · 7° Básico B', 'Guía'], ...RESOURCES] : RESOURCES;
  return (
    <div className="px-8 pt-2">
      <div className="flex items-end justify-between">
        <div>
          <h3 style={{ color: C.blue, fontSize: 22, fontWeight: 700 }}>Recursos del docente</h3>
          <p style={{ color: C.mute, fontSize: 12 }}>Material de apoyo organizado por asignatura y curso</p>
        </div>
        <span data-t="nuevo-recurso" style={btn(C.blue)}><Icon d={I.plus} size={13} color="#fff" /> Nuevo recurso</span>
      </div>
      <div className="mt-4 p-5" style={card}>
        {rows.map(([t, s, k], i) => (
          <div
            key={t}
            className="flex items-center gap-3 px-3 py-3"
            style={{
              borderTop: i ? `1px solid ${C.line}` : 'none',
              background: added && i === 0 ? '#f1f6ff' : 'transparent',
              borderRadius: 10,
              animation: added && i === 0 ? 'bloo-in .6s ease both' : 'none',
            }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: C.blueSoft }}><Icon d={I.file} color={C.blue} /></span>
            <div className="flex-1"><div style={{ fontSize: 12.5, color: C.ink }}>{t}</div><div style={{ fontSize: 10.5, color: C.mute }}>{s}</div></div>
            <span className="rounded-full px-2 py-0.5" style={{ background: '#f2f4f8', fontSize: 10, color: C.mute }}>{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalRecurso({ typed, filled }) {
  return (
    <div className="w-[500px] p-6" style={{ ...card, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)' }}>
      <div className="flex items-center justify-between"><span style={{ fontSize: 15, color: C.ink }}>Nuevo recurso</span><Icon d={I.x} color={C.mute} /></div>
      <label className="mt-4 block" style={{ fontSize: 10.5, color: C.mute }}>Título</label>
      <div className="mt-1 rounded-lg px-3 py-2" style={{ border: `1px solid ${typed ? C.blue : C.line}`, fontSize: 12, color: C.ink, minHeight: 34 }}>
        {typed}<span className="bloo-caret" style={{ display: typed !== null && !filled ? 'inline-block' : 'none' }} />
      </div>
      <label className="mt-3 block" style={{ fontSize: 10.5, color: C.mute }}>Asignatura y curso</label>
      <div className="mt-1 flex justify-between rounded-lg px-3 py-2" style={{ border: `1px solid ${C.line}`, fontSize: 12, color: filled ? C.ink : C.mute }}>
        {filled ? 'Matemática · 7° Básico B' : 'Selecciona'} <span>⌄</span>
      </div>
      <label className="mt-3 block" style={{ fontSize: 10.5, color: C.mute }}>Tipo</label>
      <div className="mt-1 flex gap-2">
        {['Guía', 'Presentación', 'Evaluación'].map((t, i) => (
          <span key={t} className="rounded-full px-3 py-1" style={{ fontSize: 11, border: `1px solid ${filled && i === 0 ? C.blue : C.line}`, background: filled && i === 0 ? C.blueSoft : '#fff', color: filled && i === 0 ? C.blue : C.mute }}>{t}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-3" style={{ border: `1px dashed ${filled ? C.blue : C.line}`, fontSize: 11, color: filled ? C.ink : C.mute }}>
        <Icon d={filled ? I.file : I.upload} color={filled ? C.blue : C.mute} /> {filled ? 'guia-fracciones.pdf · 1,2 MB' : 'Arrastra o sube un archivo'}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <span className="rounded-lg px-4 py-2" style={{ fontSize: 11.5, color: C.mute, border: `1px solid ${C.line}` }}>Cancelar</span>
        <span data-t="guardar" style={{ ...btn(C.blue), padding: '8px 18px' }}>Guardar recurso</span>
      </div>
    </div>
  );
}

/* ---------- Reproductor (compartido por los recorridos de Bloo) ---------- */
/**
 * Marco de navegador + lienzo escalado + cursor + leyenda del paso.
 * `script(ctx)` mueve el cursor y cambia el estado; `children(ui)` dibuja la pantalla según ese estado.
 * Solo reproducción: el visitante no puede interactuar.
 */
export function FlowPlayer({ phases, initial, script, children, description, title = 'Bloo · Plataforma de gestión educativa', bg = C.bg }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(0.6);
  const [ui, setUi] = useState(initial);
  const [cursor, setCursor] = useState({ x: 900, y: 560, click: false, hidden: true });
  const [viewRef, inView] = useInView({ threshold: 0.35, once: false });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED)); // ritmo ágil
    const set = (patch) => alive && setUi((u) => ({ ...u, ...patch }));
    // Mueve el cursor al centro del elemento marcado con data-t
    const moveTo = async (t, ms = 900) => {
      const canvas = canvasRef.current;
      const el = canvas?.querySelector(`[data-t="${t}"]`);
      if (!el || !alive) return;
      const a = canvas.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const s = a.width / W;
      setCursor({ x: (b.left - a.left + b.width / 2) / s, y: (b.top - a.top + b.height / 2) / s, click: false, hidden: false });
      await sleep(ms);
    };
    const click = async () => {
      if (!alive) return;
      setCursor((c) => ({ ...c, click: true }));
      await sleep(260);
      setCursor((c) => ({ ...c, click: false }));
    };
    const type = async (key, text) => {
      for (let i = 1; i <= text.length && alive; i += 1) {
        set({ [key]: text.slice(0, i) });
        await sleep(55);
      }
    };
    const restart = () => {
      set({ ...initial });
      setCursor({ x: 900, y: 560, click: false, hidden: false });
    };
    (async () => {
      while (alive) {
        restart();
        await script({ set, moveTo, click, type, sleep, alive: () => alive });
      }
    })();
    return () => {
      alive = false;
      setUi(initial);
      setCursor((c) => ({ ...c, hidden: true }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <figure ref={viewRef} className="m-0">
      {/* Escenario con fondo lila suave */}
      <div
        className="relative overflow-hidden rounded-xl p-4 sm:p-8"
        style={{ background: 'radial-gradient(120% 90% at 50% 0%, rgba(126,110,135,.38), rgba(26,26,26,.9) 60%), #141414' }}
      >
        {/* Ventana de Mac: franja fina y radio pequeño */}
        <div className="overflow-hidden rounded-md" style={{ boxShadow: '0 24px 50px -30px rgba(0,0,0,.45)' }}>
          <div className="flex items-center gap-1 bg-[#202020] px-2.5 py-1.5">
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="h-[7px] w-[7px] rounded-full" style={{ background: c }} />)}
            <span className="ml-2.5 text-[0.62rem] leading-none text-snow/45">{title}</span>
          </div>
          <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ height: H * scale }}>
            <div
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 select-none font-sans"
              style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: '0 0', background: bg }}
            >
              {children(ui)}

              {/* Cursor */}
              <div
                className="absolute left-0 top-0"
                style={{
                  transform: `translate(${cursor.x}px, ${cursor.y}px)`,
                  transition: 'transform .5s cubic-bezier(.45,0,.2,1), opacity .3s',
                  opacity: cursor.hidden ? 0 : 1,
                  zIndex: 50,
                }}
              >
                <span
                  className="absolute -left-5 -top-5 h-10 w-10 rounded-full"
                  style={{ background: 'rgba(126,110,135,.35)', transform: `scale(${cursor.click ? 1 : 0})`, opacity: cursor.click ? 1 : 0, transition: 'transform .26s, opacity .26s' }}
                />
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))', transform: `scale(${cursor.click ? 0.85 : 1})`, transition: 'transform .15s' }}>
                  <path d="M4 3l16 7-7 2-2 7z" fill="#1f2a44" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paso actual */}
      <figcaption className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-geist text-sm">
        <span className="flex gap-1.5" aria-hidden="true">
          {phases.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === ui.phase ? 'w-6 bg-[#ded0e8]' : 'w-1.5 bg-paper-line'}`} />
          ))}
        </span>
        <span className="text-graphite-soft">
          <span className="text-night">{ui.phase + 1}.</span> {phases[ui.phase]}
        </span>
      </figcaption>
      <p className="sr-only">{description}</p>
    </figure>
  );
}

/** Pantalla con menú lateral, barra superior y transición al cambiar de vista. */
export function Shell({ active, screenKey, children }) {
  return (
    <div className="flex h-full">
      <Sidebar active={active} />
      <div className="relative flex-1 overflow-hidden">
        <Topbar />
        <div key={screenKey} style={{ animation: 'bloo-screen .12s ease-out both' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalLayer({ children }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: 'rgba(31,42,68,.28)', animation: 'bloo-fade .3s ease both' }}>
      <div style={{ animation: 'bloo-pop .35s cubic-bezier(.2,.7,.2,1) both' }}>{children}</div>
    </div>
  );
}

export { C, I, Icon, card, btn, ScreenMaterias };

/* ---------- Recorrido 1: acceso docente, Mis materias y Recursos ---------- */
const INITIAL = { screen: 'inicio', tab: 'estudiantes', modal: null, typed: null, filled: false, added: false, toast: false, phase: 0 };

async function script1({ set, moveTo, click, type, sleep }) {
  await sleep(2200);
  // 2. Mis materias
  set({ phase: 1 });
  await moveTo('nav-materias');
  await click();
  set({ screen: 'materias' });
  await sleep(1700);
  await moveTo('ver-detalle');
  await click();
  set({ screen: 'detalle', tab: 'estudiantes' });
  await sleep(1800);
  await moveTo('tab-evaluaciones');
  await click();
  set({ tab: 'evaluaciones' });
  await sleep(1400);
  await moveTo('ver-notas');
  await click();
  set({ modal: 'notas' });
  await sleep(2400);
  await moveTo('cerrar', 700);
  await click();
  set({ modal: null });
  await sleep(600);
  // 3. Recursos del docente
  set({ phase: 2 });
  await moveTo('nav-recursos');
  await click();
  set({ screen: 'recursos' });
  await sleep(1500);
  await moveTo('nuevo-recurso');
  await click();
  set({ modal: 'recurso', typed: '' });
  await sleep(700);
  await type('typed', 'Guía de Fracciones');
  await sleep(300);
  set({ filled: true });
  await sleep(1100);
  await moveTo('guardar', 800);
  await click();
  set({ modal: null, added: true, toast: true });
  await sleep(2600);
  set({ toast: false });
  await sleep(800);
}

export default function BlooFlow() {
  return (
    <FlowPlayer
      phases={PHASES}
      initial={INITIAL}
      script={script1}
      description="Recorrido animado por la plataforma Bloo: vista de inicio del docente, módulo Mis materias con el detalle de la asignatura y sus evaluaciones, y creación de un nuevo recurso en Recursos del docente."
    >
      {(ui) => (
        <>
          <Shell active={ui.screen === 'detalle' ? 'materias' : ui.screen} screenKey={ui.screen}>
            {ui.screen === 'inicio' && <ScreenInicio />}
            {ui.screen === 'materias' && <ScreenMaterias />}
            {ui.screen === 'detalle' && <ScreenDetalle tab={ui.tab} />}
            {ui.screen === 'recursos' && <ScreenRecursos added={ui.added} />}
          </Shell>
          {ui.modal && <ModalLayer>{ui.modal === 'notas' ? <ModalNotas /> : <ModalRecurso typed={ui.typed} filled={ui.filled} />}</ModalLayer>}
          <div
            className="absolute bottom-8 right-8 flex items-center gap-2 rounded-xl px-4 py-3 text-white"
            style={{ background: C.green, fontSize: 12.5, transition: 'all .4s', opacity: ui.toast ? 1 : 0, transform: `translateY(${ui.toast ? 0 : 12}px)` }}
          >
            <Icon d="M5 12l4 4 10-10" color="#fff" /> Recurso creado con éxito
          </div>
        </>
      )}
    </FlowPlayer>
  );
}