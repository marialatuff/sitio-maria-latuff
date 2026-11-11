import pumaLogo from '../../assets/projects/puma/logo.png';
import pumaCollage from '../../assets/projects/puma/login-collage.jpg';
import { FlowPlayer, Icon, I } from './BlooFlow.jsx';

/**
 * Recorrido 1 de PUMA Recruiter (solo reproducción):
 * 1. Login → se inicia sesión → 2. Formularios → Agregar nuevo formulario →
 * 3. Agregar nueva pregunta → se completa la pregunta → se agrega → se guarda el formulario con aviso de éxito.
 * Pantallas recreadas a partir de los diseños de María.
 */

export const P = {
  navy: '#1b2f6b',
  navy2: '#13235a',
  blue: '#3a5bab',
  orange: '#e8781e',
  ink: '#1c2a4f',
  mute: '#6b7590',
  line: '#e3e8f2',
  field: '#f3f6fc',
  bg: '#f5f8fd',
};

const PHASES = [
  'Inicio de sesión en PUMA Recruiter',
  'Formularios: agregar un nuevo formulario',
  'Nueva pregunta: completar, agregar y guardar',
];

/* ---------- 1. Login ---------- */
function Login({ ui }) {
  return (
    <div className="flex h-full" style={{ background: `linear-gradient(135deg, ${P.navy2}, #1e3577)` }}>
      <div className="flex w-[46%] flex-col items-center justify-center px-16 text-white">
        <img src={pumaLogo} alt="" style={{ height: 62 }} />
        <div className="mt-8" style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 700 }}>Hola, bienvenido a PUMA</div>
        <div className="mt-2" style={{ fontSize: 14, opacity: 0.85 }}>Por favor, inicia sesión</div>
        <div className="mt-8 w-full max-w-[400px] space-y-5">
          {[['Correo electrónico', ui.email, false], ['Contraseña', ui.pass, true]].map(([l, v, eye]) => (
            <div key={l} className="relative">
              <span className="absolute -top-2 left-3 rounded px-1.5" style={{ background: P.navy2, fontSize: 10.5 }}>{l}</span>
              <div className="flex h-11 items-center justify-between rounded bg-white px-3" style={{ color: P.ink, fontSize: 13 }}>
                <span>{v}</span>
                {eye && <Icon d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" color={P.ink} />}
              </div>
            </div>
          ))}
          <div data-t="ingresar" className="grid h-11 place-items-center rounded-md" style={{ background: P.blue, fontSize: 14 }}>Ingresar</div>
          <div className="text-center" style={{ fontSize: 12 }}>
            ¿Olvidaste tu contraseña?<br /><span style={{ color: '#f0a23a' }}>Haz click aquí para recuperarla</span>
          </div>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <img src={pumaCollage} alt="" className="absolute inset-0 h-full w-full object-cover object-left" />
      </div>
    </div>
  );
}

/* ---------- 2. Formularios ---------- */
const NAV = ['Cargos', 'Formularios', 'Documentos', 'Exámenes', 'Usuarios', 'Configuración', 'Nacionalidad', 'Estatus migratorio', 'Región', 'Comuna', 'Proyectos'];

export function Sidebar({ items = NAV, active = 1 }) {
  return (
    <aside className="flex w-[200px] shrink-0 flex-col" style={{ background: `linear-gradient(180deg, ${P.navy} 60%, #2a4a9a)`, borderRadius: '0 28px 28px 0' }}>
      <div className="grid h-[96px] place-items-center"><img src={pumaLogo} alt="" style={{ height: 40 }} /></div>
      <nav className="mt-2 space-y-1.5 px-3" style={{ fontFamily: 'Georgia, serif', fontSize: 11.5, color: '#fff' }}>
        {items.map((n, i) => (
          <div key={n} className="flex items-center justify-between rounded-md px-3 py-[7px]" style={{ background: i === active ? '#2b4691' : items === NAV && i > 5 ? 'rgba(255,255,255,.04)' : 'transparent', border: i === active ? '1px solid #4b66b0' : '1px solid transparent', paddingLeft: items === NAV && i > 5 ? 22 : 12 }}>
            <span>{n}</span>
            {!(items === NAV && i === 5) && <span style={{ opacity: 0.8 }}>↗</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
}

const ROWS = [false, true, true, true, true, false, false];

function Toggle({ on }) {
  return (
    <span className="relative inline-block h-[14px] w-[30px] rounded-full" style={{ background: '#dfe4ee' }}>
      <span className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full" style={{ left: on ? 13 : -1, background: on ? '#20b24a' : '#666' }} />
    </span>
  );
}

function Formularios({ ui }) {
  const rows = ui.saved ? [['Evaluación de salud ocupacional', 'Personas', true, true], ...ROWS.slice(0, 6).map((a) => ['Nombre largo ejemplo', 'Nombre largo ejemplo', a])] : ROWS.map((a) => ['Nombre largo ejemplo', 'Nombre largo ejemplo', a]);
  return (
    <div className="flex h-full" style={{ background: P.bg }}>
      <Sidebar />
      <div className="flex-1 overflow-hidden px-8 pt-5">
        <div style={{ fontSize: 22, fontWeight: 700, color: P.ink }}>Formularios</div>
        <div className="mt-3 flex h-10 w-[440px] items-center justify-between rounded-lg px-3" style={{ background: '#fff', border: `1px solid ${P.line}`, fontSize: 11.5, color: P.mute }}>
          Buscar por nombre, palabra clave... <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4" color="#9fb0d8" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ fontSize: 12, color: P.ink }}>
            Tipo
            {['Persona', 'Cargo', 'Proceso'].map((t, i) => (
              <span key={t} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2" style={{ border: `1.5px solid ${i === 0 ? P.blue : '#fff'}` }}>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full" style={{ border: `1.5px solid ${P.blue}` }}>{i === 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: P.blue }} />}</span>
                {t}
              </span>
            ))}
          </div>
          <span data-t="nuevo-form" className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-white" style={{ background: P.blue, fontSize: 12.5 }}>
            <span className="grid h-4 w-4 place-items-center rounded bg-white/25" style={{ fontSize: 11 }}>+</span> Agregar nuevo formulario
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl bg-white">
          <div className="grid grid-cols-[2.2fr_1.6fr_1fr_1fr_1fr_0.7fr] items-center px-5 py-3 text-white" style={{ background: P.navy, fontSize: 13 }}>
            <span className="text-center">Nombre del formulario</span><span className="text-center">Tipo</span><span>Visualizar</span><span>Editar</span><span>Eliminar</span><span>Activo</span>
          </div>
          {rows.map(([n, t, on, isNew], i) => (
            <div key={i} className="grid grid-cols-[2.2fr_1.6fr_1fr_1fr_1fr_0.7fr] items-center px-5 py-[11px]" style={{ background: isNew ? '#eaf6ee' : i % 2 ? '#f6f8fc' : '#fff', fontSize: 12, color: P.ink, animation: isNew ? 'bloo-in .6s ease both' : 'none' }}>
              <span className="pl-6">{n}</span><span className="pl-4">{t}</span>
              <span className="flex items-center gap-1.5"><Icon d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={13} color={P.mute} /> Visualizar</span>
              <span className="flex items-center gap-1.5" style={{ opacity: on ? 1 : 0.35 }}><Icon d="M4 20l4-1 11-11-3-3L5 16z" size={13} /> Editar</span>
              <span className="flex items-center gap-1.5" style={{ opacity: on ? 1 : 0.35 }}><Icon d="M6 7h12l-1 13H7z M9 7V4h6v3" size={13} /> Eliminar</span>
              <Toggle on={on} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. Modales ---------- */
const field = { background: P.field, borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: P.ink };
const label = (t) => <div style={{ fontSize: 10.5, color: P.ink, margin: '0 0 4px 10px' }}>{t}</div>;

function Question({ title, isNew }) {
  return (
    <div className="rounded-lg" style={{ border: `1px solid ${isNew ? '#9fd9b5' : P.line}`, animation: isNew ? 'bloo-in .6s ease both' : 'none' }}>
      <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${P.line}`, fontSize: 13, color: P.ink }}>
        {title}
        <span className="flex gap-3" style={{ color: P.blue }}><Icon d="M12 3v18 M3 12h18" size={13} /><Icon d="M4 20l4-1 11-11-3-3L5 16z" size={13} /><Icon d="M6 7h12l-1 13H7z" size={13} /></span>
      </div>
      <div className="space-y-2 px-3 py-2.5">
        {(isNew ? ['Sí', 'No'] : ['Ejemplo de respuesta texto largo', 'Ejemplo de respuesta texto largo']).map((r, i) => (
          <div key={i} className="flex items-center gap-2" style={{ fontSize: 11.5, color: P.mute }}>
            <span className="h-3.5 w-3.5 rounded-sm" style={{ border: `1.5px solid ${P.ink}` }} /> {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModalForm({ ui }) {
  return (
    <div className="w-[600px] rounded-2xl bg-white px-7 pb-6 pt-6" style={{ boxShadow: '0 30px 60px -20px rgba(19,35,90,.45)' }}>
      <div className="flex items-center gap-3" style={{ fontSize: 21, color: P.ink }}><span style={{ fontSize: 15 }}>↖</span> Agregar formulario</div>
      <div className="mt-5 space-y-3">
        <div>{label('Nombre del formulario')}<div style={{ ...field, color: ui.formName ? P.ink : P.mute }}>{ui.formName || 'Ejemplo nombre del formulario'}</div></div>
        <div>{label('Seleccione tipo de formulario')}<div className="flex justify-between" style={field}>Personas <span style={{ color: P.blue }}>↓</span></div></div>
      </div>
      <div className="mt-4 flex items-center justify-between border-y py-3" style={{ borderColor: P.line }}>
        <div className="flex gap-5" style={{ fontSize: 13, color: P.blue }}>
          <span data-t="guardar" className="flex items-center gap-1.5"><Icon d="M5 4h11l3 3v13H5z M8 4v5h7V4" size={15} /> Guardar</span>
          <span className="flex items-center gap-1.5"><Icon d="M4 20l4-1 11-11-3-3L5 16z" size={14} /> Editar</span>
          <span className="flex items-center gap-1.5"><Icon d="M6 7h12l-1 13H7z" size={14} /> Eliminar</span>
        </div>
        <span data-t="nueva-pregunta" className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-white" style={{ background: P.orange, fontSize: 12.5 }}>
          <span className="grid h-4 w-4 place-items-center rounded bg-white/30" style={{ fontSize: 11 }}>+</span> Agregar nueva pregunta
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {ui.added && <Question title="¿Sufre de vértigo o mareos frecuentes?" isNew />}
        <Question title="¿Cuál es su nivel de estudio?" />
      </div>
    </div>
  );
}

function ModalPregunta({ ui }) {
  const alt = (txt, i) => (
    <div key={i} className="rounded-lg px-4 pb-3 pt-2" style={{ background: '#f6f8fd', border: `1px solid ${P.line}` }}>
      <div className="flex justify-end gap-3" style={{ color: P.blue }}><Icon d="M12 3v18 M3 12h18" size={13} /><Icon d="M4 20l4-1 11-11-3-3L5 16z" size={13} /><Icon d="M6 7h12l-1 13H7z" size={13} /></div>
      {label('Alternativa')}
      <div style={{ ...field, background: '#fff', color: txt ? P.ink : P.mute }}>{txt || 'Escribir...'}</div>
      <div className="mt-2 flex items-center justify-end gap-3" style={{ fontSize: 11, color: P.ink }}>
        Puntaje <span className="rounded-md bg-white px-3 py-1" style={{ fontSize: 17 }}>20</span>
        <span className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5" style={{ fontSize: 12.5 }}><span className="grid h-3.5 w-3.5 place-items-center rounded-sm" style={{ border: `1.5px solid ${P.ink}`, fontSize: 9 }}>✓</span> Excluyente</span>
      </div>
    </div>
  );
  return (
    <div className="w-[620px] rounded-2xl bg-white px-7 pb-6 pt-5" style={{ boxShadow: '0 30px 60px -20px rgba(19,35,90,.45)' }}>
      <div>{label('Enunciado')}<div style={{ ...field, color: ui.q ? P.ink : P.mute }}>{ui.q || 'Escriba el enunciado de la pregunta'}</div></div>
      <div className="mt-3">{label('Tipo de respuesta')}<div className="flex justify-between" style={field}>Alternativa <span style={{ color: P.blue }}>↓</span></div></div>
      <div className="mt-3 flex items-center gap-3" style={{ fontSize: 12.5, color: P.ink }}>
        <span className="w-[120px]">Tipo de selección</span>
        {[['unica', 'Única'], ['multiple', 'Selección múltiple']].map(([k, l]) => {
          const on = ui.sel === k;
          return (
            <span key={k} data-t={`sel-${k}`} className="flex items-center gap-2 rounded-lg px-4 py-2" style={{ border: `1.5px solid ${on ? P.blue : P.line}`, transition: 'border-color .3s' }}>
              <span className="grid h-3.5 w-3.5 place-items-center rounded-full" style={{ border: `1.5px solid ${P.blue}` }}>{on && <span className="h-1.5 w-1.5 rounded-full" style={{ background: P.blue }} />}</span>
              {l}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end">
        <span className="flex items-center gap-2 rounded-lg px-4 py-2 text-white" style={{ background: P.orange, fontSize: 12.5 }}>+ Agregar alternativa</span>
      </div>
      <div className="mt-3 space-y-2.5">{[ui.a1, ui.a2].map(alt)}</div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <span className="grid h-10 place-items-center rounded-lg" style={{ border: `1px solid ${P.line}`, fontSize: 13, color: P.blue }}>✕ Cancelar</span>
        <span data-t="agregar-pregunta" className="grid h-10 place-items-center rounded-lg text-white" style={{ background: P.blue, fontSize: 13 }}>✓ Agregar pregunta</span>
      </div>
    </div>
  );
}

/* ---------- Guion ---------- */
const INITIAL = { screen: 'login', email: '', pass: '', modal: null, formName: '', q: '', sel: 'unica', a1: '', a2: '', added: false, saved: false, toast: false, phase: 0 };

async function script({ set, moveTo, click, type, sleep }) {
  await sleep(900);
  await type('email', 'maria@ejemplo.com');
  await type('pass', '••••••••••••');
  await moveTo('ingresar');
  await click();
  set({ screen: 'form', phase: 1 });
  await sleep(1500);
  await moveTo('nuevo-form');
  await click();
  set({ modal: 'form' });
  await sleep(700);
  await type('formName', 'Evaluación de salud ocupacional');
  await sleep(400);
  set({ phase: 2 });
  await moveTo('nueva-pregunta');
  await click();
  set({ modal: 'pregunta' });
  await sleep(600);
  await type('q', '¿Sufre de vértigo o mareos frecuentes?');
  await moveTo('sel-multiple', 700);
  await click();
  set({ sel: 'multiple' });
  await sleep(400);
  await type('a1', 'Sí');
  await type('a2', 'No');
  await sleep(500);
  await moveTo('agregar-pregunta');
  await click();
  set({ modal: 'form', added: true });
  await sleep(1400);
  await moveTo('guardar');
  await click();
  set({ modal: null, saved: true, toast: true });
  await sleep(2600);
  set({ toast: false });
  await sleep(700);
}

export default function PumaFlow() {
  return (
    <FlowPlayer
      phases={PHASES}
      initial={INITIAL}
      script={script}
      title="PUMA Recruiter · Gestión interna"
      bg={P.bg}
      description="Recorrido animado por PUMA Recruiter: inicio de sesión, módulo Formularios, creación de un nuevo formulario con una pregunta de selección múltiple y guardado exitoso."
    >
      {(ui) => (
        <>
          <div key={ui.screen} className="h-full" style={{ animation: 'bloo-screen .12s ease-out both' }}>
            {ui.screen === 'login' ? <Login ui={ui} /> : <Formularios ui={ui} />}
          </div>
          {ui.modal && (
            <div className="absolute inset-0 grid place-items-center" style={{ background: 'rgba(19,35,90,.35)', animation: 'bloo-fade .3s ease both' }}>
              <div key={ui.modal} style={{ animation: 'bloo-pop .35s cubic-bezier(.2,.7,.2,1) both' }}>
                {ui.modal === 'form' ? <ModalForm ui={ui} /> : <ModalPregunta ui={ui} />}
              </div>
            </div>
          )}
          <div
            className="absolute bottom-8 right-8 flex items-center gap-2 rounded-xl px-4 py-3 text-white"
            style={{ background: '#20b24a', fontSize: 13, transition: 'all .4s', opacity: ui.toast ? 1 : 0, transform: `translateY(${ui.toast ? 0 : 12}px)` }}
          >
            <Icon d="M5 12l4 4 10-10" color="#fff" /> Formulario guardado con éxito
          </div>
        </>
      )}
    </FlowPlayer>
  );
}
