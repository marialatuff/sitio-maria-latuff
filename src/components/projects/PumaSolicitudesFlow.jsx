import { FlowPlayer, Icon } from './BlooFlow.jsx';
import { P, Sidebar } from './PumaFlow.jsx';

/**
 * Recorrido web de PUMA Recruiter (solo reproducción): Solicitudes → Personal disponible.
 * Se abre el panel, se completan los filtros y se aplican; luego se pulsa "Exámenes. No cargados",
 * se elige un documento desde el Mac, se carga y se activa "Guardar proceso".
 * Pantalla recreada a partir del diseño de María.
 */

const SEARCH = 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4';
const DOC = 'M7 3h7l4 4v14H7z M10 12h5 M10 16h5';
const PHASES = ['Solicitudes: proceso Cuadrilla de Operadores', 'Personal disponible: completar los filtros', 'Cargar exámenes desde el computador', 'Guardar proceso'];

/* ---------- Pantalla de fondo: Solicitudes ---------- */
const STATUS = [
  ['Requeridos totales', 10, '#b9c9d6', '#7c97b3', '#22405f'],
  ['Postulantes totales', 6, '#d6c3d9', '#9c7ba6', '#4a2a55'],
  ['Contratados totales', 6, '#b9d9b5', '#5f9a5a', '#1e4a1b'],
  ['Descartados totales', 2, '#e3b5b5', '#b05656', '#6e1c1c'],
];

function Solicitudes() {
  return (
    <div className="flex h-full" style={{ background: P.bg }}>
      <Sidebar items={['Solicitudes']} active={-1} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-3 bg-white px-8 py-4" style={{ fontSize: 22, color: P.ink }}><span style={{ fontSize: 14 }}>↖</span> Solicitudes</div>
        <div className="px-8 pt-4">
          <div className="flex" style={{ fontSize: 12, color: P.ink }}>
            {[['Step 1', 'Agregar postulante'], ['Step 2', 'Gestionar postulante']].map(([s, l], i) => (
              <div key={s} className="w-[200px] rounded-t-lg px-3 py-2" style={{ background: i ? '#fff' : '#e9edf5' }}>
                <div style={{ fontWeight: 600 }}>{s}</div>{l}
              </div>
            ))}
          </div>
          <div className="rounded-b-xl rounded-tr-xl bg-white p-6">
            <div style={{ fontSize: 21, color: P.ink }}>Proceso Cuadrilla de Operadores - Puerto Montt</div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {STATUS.map(([l, v, bg, bd, fg]) => (
                <div key={l} className="rounded-lg px-3 py-2" style={{ background: bg, borderBottom: `4px solid ${bd}`, border: `2px solid ${bd}` }}>
                  <div style={{ fontSize: 9.5, color: fg }}>Estatus</div>
                  <div style={{ fontSize: 12, color: fg }}>{l}</div>
                  <div style={{ fontSize: 44, lineHeight: 1.05, color: fg }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-xl" style={{ border: `1px solid ${P.line}` }}>
              <div className="grid grid-cols-[1fr_1.4fr_2fr] text-white" style={{ fontSize: 14 }}>
                <span className="px-6 py-3 text-center" style={{ background: '#0f1f4c' }}>Visualizar</span>
                <span className="px-6 py-3" style={{ background: P.navy }}>Cargo</span>
                <span className="px-6 py-3" style={{ background: P.navy }}>Estado</span>
              </div>
              {[['Operador de grua', 6, 'v-grua'], ['Operador de camión', 4, 'v-camion']].map(([c, n, t], i) => (
                <div key={c} className="grid grid-cols-[1fr_1.4fr_2fr] items-center py-3" style={{ background: i ? '#f3f5fa' : '#fff', fontSize: 13, color: P.ink }}>
                  <span data-t={t} className="flex items-center justify-center gap-2"><Icon d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={14} color={P.mute} /> Visualizar</span>
                  <span className="px-6">{c}</span>
                  <span className="flex gap-2 px-6">
                    <span className="rounded-full px-3 py-1" style={{ border: '1px solid #8fb0d6', background: '#e3eefa', color: '#2a5a8f', fontSize: 12 }}>Requeridos ({n})</span>
                    <span className="rounded-full px-3 py-1" style={{ border: '1px solid #c6a6d0', background: '#f1e6f5', color: '#5a2a6a', fontSize: 12 }}>Postulantes ({n - 1})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Panel: Personal disponible ---------- */
const FILTERS = [
  ['Filtrar por estado del documento', 'Validado'],
  ['Filtro por origen', 'Postulación web'],
  ['Filtro por estado del exámenes', 'No cargados'],
  ['Filtro por estado ficha', 'Completa'],
  ['Filtro por estado formulario', 'Respondido'],
  ['Filtro por estado postulantes', 'Por llenar'],
];

function Select({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: P.ink, margin: '0 0 3px 10px' }}>{label}</div>
      <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: P.field, fontSize: 12, color: value ? P.ink : P.mute, border: `1px solid ${value ? '#b9c7ea' : 'transparent'}`, transition: 'all .3s' }}>
        {value || '-Seleccionar-'} <span style={{ color: P.blue }}>↓</span>
      </div>
    </div>
  );
}

function Chip({ bg, fg, children, t }) {
  return (
    <span data-t={t} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: bg, color: fg, fontSize: 10.5, lineHeight: 1.2, transition: 'all .4s' }}>
      <span className="grid h-6 w-5 place-items-center rounded" style={{ background: `${fg}22` }}><Icon d={DOC} size={12} color={fg} /></span>
      <span>{children}</span>
    </span>
  );
}

function Postulante({ name, state, exam, examT }) {
  const [sl, sbg, sfg] = state === 'ok' ? ['Contratado', '#d3f0d9', '#1e5a2a'] : ['Por llenar', '#f7f2c4', '#6a5a10'];
  const examChip = {
    no: ['#ffe6e6', '#d63c3c', <>Exámenes.<br />No cargados</>],
    up: ['#fff1dc', '#d9861a', <>Exámenes.<br />Cargando…</>],
    ok: ['#e1f5e6', '#1f8a3e', <>Exámenes.<br />Cargados</>],
    pending: ['#fff1dc', '#d9861a', <>Exámenes.<br />Cargado no validado</>],
  }[exam];
  return (
    <div className="rounded-xl bg-white px-4 py-3" style={{ border: `1px solid ${P.line}` }}>
      <div style={{ fontSize: 16, color: P.ink }}>{name}</div>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-full px-4 py-1" style={{ background: sbg, color: sfg, fontSize: 9.5, lineHeight: 1.2 }}>Postulante<br /><span style={{ fontSize: 13 }}>{sl}</span></span>
        <div className="flex gap-2">
          <Chip bg="#e1f5e6" fg="#1f8a3e">Documentos<br />cargados y validado</Chip>
          <Chip bg={examChip[0]} fg={examChip[1]} t={examT}>{examChip[2]}</Chip>
        </div>
      </div>
    </div>
  );
}

function Panel({ ui }) {
  return (
    <div className="absolute inset-0 z-20" style={{ background: 'rgba(19,35,90,.3)', animation: 'bloo-fade .25s ease both' }}>
      <div className="absolute bottom-3 right-3 top-3 w-[560px] overflow-hidden rounded-2xl bg-white" style={{ animation: 'puma-panel .45s cubic-bezier(.2,.8,.2,1) both', boxShadow: '-20px 0 50px -20px rgba(19,35,90,.45)' }}>
        <div className="space-y-3 px-6 pt-5" style={{ transform: `translateY(${ui.applied ? -140 : 0}px)`, transition: 'transform .8s cubic-bezier(.45,0,.2,1)' }}>
          <div className="flex items-center gap-2" style={{ fontSize: 22, color: P.ink }}><span style={{ fontSize: 14 }}>↖</span> Personal disponible</div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: P.field, border: `1px solid ${P.line}`, fontSize: 12.5, color: P.ink }}>
            {ui.q1 || <span style={{ color: P.mute }}>Buscar por nombre...</span>} <Icon d={SEARCH} color="#9fb0d8" />
          </div>
          <div>
            <div style={{ fontSize: 16, color: P.ink }}>Cuadrilla Operadores Montt</div>
            <div style={{ fontSize: 11, color: P.ink }}>Cargo operador de camión</div>
          </div>
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: P.field, border: `1px solid ${P.line}`, fontSize: 12.5, color: P.mute }}>
            Buscar por nombre / RUT <Icon d={SEARCH} color="#9fb0d8" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            {FILTERS.map(([l, v], i) => <Select key={l} label={l} value={ui.fill > i ? v : ''} />)}
          </div>
          <div data-t="aplicar" className="grid h-10 place-items-center rounded-md text-white" style={{ background: P.navy, fontSize: 13 }}>Aplicar filtro</div>
          <div className="space-y-2.5 pt-2">
            <Postulante name="Nombre postulante #1" state="ok" exam={ui.exam} examT="examenes" />
            <Postulante name="Nombre postulante #12" state="fill" exam="pending" />
          </div>
          <div className="pt-1">
            <div
              data-t="guardar-proceso"
              className="grid h-11 place-items-center rounded-lg text-white"
              style={{ background: ui.exam === 'ok' ? P.blue : '#c3c8d4', fontSize: 14, transition: 'background .4s', boxShadow: ui.exam === 'ok' ? `0 0 0 4px ${P.blue}22` : 'none' }}
            >
              Guardar proceso
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Ventana de archivos del Mac ---------- */
const FILES = [
  ['examen-preocupacional.pdf', '2,1 MB', 'pdf'],
  ['examen-altura-fisica.pdf', '1,3 MB'],
  ['licencia-clase-a2.pdf', '640 KB'],
  ['certificado-antecedentes.pdf', '410 KB'],
];

function MacFinder({ ui }) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center" style={{ background: 'rgba(0,0,0,.18)', animation: 'bloo-fade .2s ease both' }}>
      <div className="w-[640px] overflow-hidden rounded-xl bg-white" style={{ boxShadow: '0 30px 70px -20px rgba(0,0,0,.5)', animation: 'bloo-pop .3s cubic-bezier(.2,.7,.2,1) both', fontFamily: '-apple-system, "SF Pro Text", Helvetica, sans-serif' }}>
        <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ background: '#ececec', borderColor: '#d6d6d6' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
          <span className="flex-1 text-center" style={{ fontSize: 12.5, color: '#333' }}>Exámenes · Postulantes PUMA</span>
        </div>
        <div className="flex h-[300px]">
          <div className="w-[160px] px-3 py-3" style={{ background: '#f2f2f4', fontSize: 12, color: '#555' }}>
            <div style={{ fontSize: 10.5, color: '#999', fontWeight: 600 }}>Favoritos</div>
            {['Escritorio', 'Descargas', 'Documentos'].map((f, i) => (
              <div key={f} className="mt-1.5 rounded-md px-2 py-1" style={{ background: i === 2 ? '#dcdce0' : 'transparent' }}>📁 {f}</div>
            ))}
            <div className="mt-3" style={{ fontSize: 10.5, color: '#999', fontWeight: 600 }}>Ubicaciones</div>
            <div className="mt-1.5 px-2 py-1">☁ iCloud Drive</div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-[1fr_80px] border-b px-4 py-1.5" style={{ fontSize: 11, color: '#888', borderColor: '#e5e5e5' }}><span>Nombre</span><span>Tamaño</span></div>
            {FILES.map(([n, s, t], i) => {
              const sel = ui.pick && i === 0;
              return (
                <div key={n} data-t={t} className="grid grid-cols-[1fr_80px] items-center px-4 py-1.5" style={{ fontSize: 12.5, background: sel ? '#0a63d8' : i % 2 ? '#f6f6f8' : '#fff', color: sel ? '#fff' : '#222' }}>
                  <span className="flex items-center gap-2">
                    <span className="grid h-5 w-4 place-items-center rounded-sm" style={{ background: sel ? '#fff' : '#e8473d', color: sel ? '#e8473d' : '#fff', fontSize: 6, fontWeight: 700 }}>PDF</span>
                    {n}
                  </span>
                  <span style={{ color: sel ? '#fff' : '#888' }}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t px-4 py-2.5" style={{ borderColor: '#e5e5e5', fontSize: 12.5 }}>
          <span className="rounded-md px-4 py-1" style={{ border: '1px solid #ccc', color: '#333' }}>Cancelar</span>
          <span data-t="abrir" className="rounded-md px-5 py-1 text-white" style={{ background: ui.pick ? '#0a63d8' : '#9cbff0' }}>Abrir</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Guion ---------- */
const INITIAL = { panel: false, q1: '', fill: 0, applied: false, exam: 'no', finder: false, pick: false, toast: false, phase: 0 };

async function script({ set, moveTo, click, type, sleep }) {
  await sleep(1500);
  await moveTo('v-camion');
  await click();
  set({ panel: true, phase: 1 });
  await sleep(800);
  await type('q1', 'Cuadrilla Operadores Montt');
  for (let k = 1; k <= 6; k += 1) {
    set({ fill: k });
    await sleep(330);
  }
  await sleep(300);
  await moveTo('aplicar');
  await click();
  set({ applied: true });
  await sleep(1300);
  // Cargar exámenes desde el Mac
  set({ phase: 2 });
  await moveTo('examenes');
  await click();
  set({ finder: true });
  await sleep(800);
  await moveTo('pdf', 700);
  await click();
  set({ pick: true });
  await sleep(400);
  await moveTo('abrir', 600);
  await click();
  set({ finder: false, exam: 'up' });
  await sleep(1300);
  set({ exam: 'ok' });
  await sleep(700);
  // Guardar proceso
  set({ phase: 3 });
  await moveTo('guardar-proceso');
  await click();
  set({ toast: true });
  await sleep(2400);
  set({ toast: false });
  await sleep(600);
}

export default function PumaSolicitudesFlow() {
  return (
    <FlowPlayer
      phases={PHASES}
      initial={INITIAL}
      script={script}
      title="PUMA Recruiter · Solicitudes"
      bg={P.bg}
      description="Recorrido animado por PUMA Recruiter: en Solicitudes se abre Personal disponible, se completan y aplican los filtros, se cargan los exámenes de un postulante desde el computador y se guarda el proceso."
    >
      {(ui) => (
        <>
          <Solicitudes />
          {ui.panel && <Panel ui={ui} />}
          {ui.finder && <MacFinder ui={ui} />}
          <div
            className="absolute bottom-8 left-8 z-30 flex items-center gap-2 rounded-xl px-4 py-3 text-white"
            style={{ background: '#20b24a', fontSize: 13, transition: 'all .4s', opacity: ui.toast ? 1 : 0, transform: `translateY(${ui.toast ? 0 : 12}px)` }}
          >
            <Icon d="M5 12l4 4 10-10" color="#fff" /> Proceso guardado con éxito
          </div>
        </>
      )}
    </FlowPlayer>
  );
}
