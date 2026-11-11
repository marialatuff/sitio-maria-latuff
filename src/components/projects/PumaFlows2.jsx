import pumaLogo from '../../assets/projects/puma/logo.png';
import { FlowPlayer, Icon } from './BlooFlow.jsx';
import { DualPlayer } from './ResponsiveFlows.jsx';
import { P, Sidebar } from './PumaFlow.jsx';

/**
 * Más recorridos de PUMA Recruiter (solo reproducción), recreados a partir de los diseños de María:
 * - UsuariosFlow (web): Usuarios → Agregar nuevo usuario → completar datos → guardar → aviso de guardado.
 * - PostulanteFlow (web + móvil): Postulante → card Formularios → panel de formularios → Volver.
 */

const USER_NAV = ['Cargos', 'Formularios', 'Documentos', 'Exámenes', 'Usuarios'];
const SEARCH = 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4';

/* ---------- Piezas ---------- */
const fieldBox = { background: P.field, borderRadius: 8, padding: '9px 12px', fontSize: 12, color: P.mute };
function Field({ label, value, select, tall, outline }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: P.ink, margin: '0 0 3px 8px' }}>
        {label}
        <span style={{ color: '#e04848' }}>*</span>
      </div>
      <div
        className="flex items-start justify-between"
        style={{ ...fieldBox, minHeight: tall ? 52 : 0, color: value ? P.ink : P.mute, background: outline ? '#fff' : P.field, border: outline ? `1px solid ${value ? P.blue : '#9aa6c2'}` : `1px solid ${value ? '#b9c7ea' : 'transparent'}`, transition: 'all .3s' }}
      >
        <span>{value || (select ? '-Seleccionar-' : 'Escribir...')}</span>
        {select && <span style={{ color: P.blue }}>↓</span>}
      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span className="relative inline-block h-[14px] w-[30px] rounded-full" style={{ background: '#dfe4ee' }}>
      <span className="absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full" style={{ left: on ? 13 : -1, background: on ? '#20b24a' : '#666' }} />
    </span>
  );
}

/* =========================================================
   Recorrido web: crear usuario
   ========================================================= */
function UsuariosList({ ui }) {
  const rows = Array.from({ length: 8 }, (_, i) => ['Nombre de cargo largo ejemplo', 'Nombre del rol', i === 0]);
  if (ui.saved) rows.unshift(['Camila Rojas Fuentes', 'Reclutadora', true, true]);
  return (
    <div className="flex h-full" style={{ background: P.bg }}>
      <Sidebar items={USER_NAV} active={4} />
      <div className="flex-1 overflow-hidden px-8 pt-5">
        <div style={{ fontSize: 22, fontWeight: 700, color: P.ink }}>Usuarios</div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-[300px] items-center justify-between rounded-lg bg-white px-3" style={{ border: `1px solid ${P.line}`, fontSize: 11.5, color: P.ink }}>
            Buscar por nombre de usuario <Icon d={SEARCH} color="#9fb0d8" />
          </div>
          {['Filtrar por estado...', 'Filtrar por Rol'].map((t) => (
            <div key={t} className="flex h-10 w-[150px] items-center justify-between rounded-lg bg-white px-3" style={{ border: `1px solid ${P.line}`, fontSize: 11.5, color: P.mute }}>
              {t} <span style={{ color: P.blue }}>↓</span>
            </div>
          ))}
          <span data-t="nuevo-usuario" className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-white" style={{ background: P.blue, fontSize: 12.5 }}>
            <span className="grid h-4 w-4 place-items-center rounded bg-white/25" style={{ fontSize: 11 }}>+</span> Agregar nuevo usuario
          </span>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl bg-white">
          <div className="grid grid-cols-[2fr_1.4fr_0.6fr] items-center px-6 py-3 text-white" style={{ background: P.navy, fontSize: 13 }}>
            <span className="text-center">Nombre de usuario</span><span className="text-center">Rol</span><span className="text-center">Activo</span>
          </div>
          {rows.slice(0, 9).map(([n, r, on, isNew], i) => (
            <div key={i} className="grid grid-cols-[2fr_1.4fr_0.6fr] items-center px-6 py-[12px]" style={{ background: isNew ? '#eaf6ee' : i % 2 ? '#f6f8fc' : '#fff', fontSize: 12, color: P.ink, animation: isNew ? 'bloo-in .6s ease both' : 'none' }}>
              <span className="pl-10">{n}</span><span className="pl-16">{r}</span><span className="text-center"><Toggle on={on} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Scroll del formulario según el campo que se está completando
const scrollOf = (k) => (k >= 11 ? 470 : k >= 9 ? 330 : k >= 6 ? 170 : 0);

function Chips({ label, hint, items, filled }) {
  return (
    <div className="rounded-lg p-2.5" style={{ border: `1px solid ${P.line}` }}>
      <div className="rounded-md bg-white" style={{ boxShadow: `0 0 0 1px ${P.line}` }}>
        <div style={{ fontSize: 10.5, color: P.ink, margin: '4px 0 0 10px' }}>
          {label}
          <span style={{ color: '#e04848' }}>*</span>
        </div>
        <div className="flex justify-between px-2.5 pb-2 pt-1" style={{ fontSize: 12, color: P.mute }}>-Seleccionar- <span style={{ color: P.blue }}>↓</span></div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 rounded-md px-2 py-2" style={{ background: '#fff' }}>
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="rounded-md px-2.5 py-1"
            style={{ background: filled || i < 2 ? '#a9b8e6' : '#dfe3ec', color: filled ? P.ink : '#5f6b88', fontSize: 11, animation: filled ? `bloo-pop .3s ease ${i * 0.1}s both` : 'none' }}
          >
            {t} <span style={{ marginLeft: 6 }}>x</span>
          </span>
        ))}
      </div>
      <div className="mt-1.5" style={{ fontSize: 9, color: P.mute }}>ⓘ {hint}</div>
    </div>
  );
}

function NuevoUsuario({ ui }) {
  const v = (k, txt) => (ui.fill >= k ? txt : '');
  return (
    <div className="flex h-full" style={{ background: P.bg }}>
      <Sidebar items={USER_NAV} active={4} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between bg-white px-8 py-4">
          <div className="flex items-center gap-3" style={{ fontSize: 22, color: P.ink }}><span style={{ fontSize: 14 }}>↖</span> Agregar usuario</div>
          <span data-t="guardar-usuario" className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-white" style={{ background: P.blue, fontSize: 13 }}>
            <span className="grid h-4 w-4 place-items-center rounded bg-white/25" style={{ fontSize: 11 }}>+</span> Agregar usuario
          </span>
        </div>
        <div className="flex gap-6 px-8 pt-5">
          <div className="flex-1">
            {/* Formulario con su propio scroll: baja a medida que se completan los datos */}
            <div className="relative h-[560px] overflow-hidden rounded-xl bg-white">
              <div className="space-y-2.5 p-5" style={{ transform: `translateY(${-scrollOf(ui.fill)}px)`, transition: 'transform .7s cubic-bezier(.45,0,.2,1)' }}>
                <Field label="RUT" value={v(1, '18.456.321-7')} outline />
                <Field label="Nombre" value={v(2, 'Camila Rojas Fuentes')} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Fecha de nacimiento" value={v(3, '14/03/1992')} select />
                  <Field label="Género" value={v(3, 'Femenino')} select />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nacionalidad" value={v(4, 'Chilena')} select />
                  <Field label="Estatus Migratorio" value={v(4, 'No aplica')} select />
                </div>
                <Field label="Dirección" value={v(5, 'Av. Providencia 1234, depto. 502')} tall />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Región" value={v(6, 'Metropolitana')} select />
                  <Field label="Comuna" value={v(6, 'Providencia')} select />
                </div>
                <Field label="Expectativas de renta líquida" value={v(7, '$1.500.000')} />
                <Chips label="Familia" hint="Puedes elegir hasta 2 familias" items={ui.fill >= 8 ? ['Prevención de riesgos', 'Operaciones'] : ['Ejemplo texto', 'Ejemplo texto']} filled={ui.fill >= 8} />
                <Chips label="Cargo" hint="Puedes elegir hasta 2 cargos por especialidad" items={ui.fill >= 9 ? ['Supervisor', 'Prevencionista'] : ['Ejemplo texto', 'Ejemplo', 'Ejemplo', 'Ejemplo texto']} filled={ui.fill >= 9} />
                <Field label="Nivel de estudio" value={v(10, 'Universitario completo')} select />
                <div className="grid grid-cols-[1fr_1fr] gap-8">
                  <Field label="Correo electrónico" value={v(11, 'camila.rojas@puma.cl')} />
                  <Field label="Teléfono" value={v(11, '+56 9 8765 4321')} />
                </div>
                <Field label="Comentarios" value={v(12, 'Disponibilidad inmediata para faenas en la zona norte.')} tall />
              </div>
              {/* Barra de scroll */}
              <span className="absolute right-1.5 top-2 w-1 rounded-full bg-[#c9cfdb]" style={{ height: 230, transform: `translateY(${scrollOf(ui.fill) * 0.55}px)`, transition: 'transform .7s cubic-bezier(.45,0,.2,1)' }} />
            </div>
            <span className="mt-3 inline-block rounded-lg px-5 py-2.5 text-white" style={{ background: '#9aa3b5', fontSize: 13 }}>Restablecer contraseña</span>
          </div>
          <div className="w-[300px] space-y-3">
            <div className="rounded-xl bg-white p-5 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: '#e8edf6' }}>
                <img src={pumaLogo} alt="" style={{ height: 14, filter: 'brightness(0) saturate(100%) invert(18%) sepia(38%) saturate(2500%) hue-rotate(208deg)' }} />
              </span>
              <div className="mt-2" style={{ fontSize: 18, color: P.ink }}>Antecedentes PUMA</div>
              <div className="mt-2 flex items-center justify-center gap-3" style={{ fontSize: 11.5, color: P.ink }}>
                <span className="rounded-md px-2 py-1" style={{ border: `1px solid ${P.line}` }}>☑ Trabajador PUMA</span>
                NOTA <span className="rounded-md px-2.5 py-1" style={{ border: `1px solid ${P.line}`, fontSize: 16 }}>20</span>
              </div>
              <div className="mt-3 rounded-lg py-2.5 text-white" style={{ background: P.orange, fontSize: 12 }}>Ver historial del trabajador</div>
            </div>
            <div className="grid grid-cols-3 gap-1.5" style={{ fontSize: 10, color: P.blue }}>
              {['Cargar exámenes', 'Cargar documentos', 'Descargar'].map((t) => (
                <span key={t} className="rounded-lg bg-white px-1.5 py-2 text-center" style={{ border: `1px solid ${P.line}` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const USER_PHASES = ['Vista de Usuarios', 'Agregar usuario', 'Nuevo usuario: completar los datos', 'Guardar usuario'];
const USER_INITIAL = { screen: 'list', fill: 0, modal: false, saved: false, phase: 0 };

async function userScript({ set, moveTo, click, sleep }) {
  // 1. Vista de Usuarios
  await sleep(1500);
  // 2. Agregar usuario
  set({ phase: 1 });
  await moveTo('nuevo-usuario');
  await click();
  // 3. Pantalla de nuevo usuario: se completan los datos
  set({ screen: 'new', phase: 2 });
  await sleep(700);
  for (let k = 1; k <= 12; k += 1) {
    set({ fill: k });
    await sleep(k === 6 || k === 9 || k === 11 ? 700 : 380);
  }
  await sleep(500);
  // 4. Guardar usuario
  set({ phase: 3 });
  await moveTo('guardar-usuario');
  await click();
  set({ modal: true });
  await sleep(1800);
  await moveTo('aceptar', 700);
  await click();
  set({ modal: false, screen: 'list', saved: true });
  await sleep(2300);
}

export function UsuariosFlow() {
  return (
    <FlowPlayer
      phases={USER_PHASES}
      initial={USER_INITIAL}
      script={userScript}
      title="PUMA Recruiter · Usuarios"
      bg={P.bg}
      description="Recorrido animado por PUMA Recruiter: en Usuarios se pulsa Agregar nuevo usuario, se completan sus datos y se guarda con un aviso de guardado exitoso."
    >
      {(ui) => (
        <>
          <div key={ui.screen} className="h-full" style={{ animation: 'bloo-screen .12s ease-out both' }}>
            {ui.screen === 'list' ? <UsuariosList ui={ui} /> : <NuevoUsuario ui={ui} />}
          </div>
          {ui.modal && (
            <div className="absolute inset-0 grid place-items-center" style={{ background: 'rgba(19,35,90,.35)', animation: 'bloo-fade .3s ease both' }}>
              <div className="w-[380px] rounded-2xl bg-white px-8 py-8 text-center" style={{ animation: 'bloo-pop .35s cubic-bezier(.2,.7,.2,1) both', boxShadow: '0 30px 60px -20px rgba(19,35,90,.45)' }}>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full" style={{ background: '#e3f6ea' }}>
                  <Icon d="M5 12l4 4 10-10" color="#20b24a" size={22} />
                </span>
                <div className="mt-3" style={{ fontSize: 18, color: P.ink }}>Usuario guardado exitosamente</div>
                <div className="mt-1" style={{ fontSize: 12, color: P.mute }}>Camila Rojas Fuentes ya puede ingresar a PUMA Recruiter.</div>
                <span data-t="aceptar" className="mt-5 inline-block rounded-lg px-8 py-2.5 text-white" style={{ background: P.blue, fontSize: 13 }}>Aceptar</span>
              </div>
            </div>
          )}
        </>
      )}
    </FlowPlayer>
  );
}

/* =========================================================
   Recorrido responsivo: Postulante → Formularios
   ========================================================= */
const VIEW_CARDS = [
  ['card-form', 'Formularios', 'M7 3h7l4 4v14H7z M10 12h5 M10 16h5'],
  [null, 'Postulaciones', 'M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L3.3 9.2l6.1-.6z'],
  [null, 'Documentos', 'M5 4h9l5 5v11H5z'],
  [null, 'Exámenes', 'M6 4h12v16H6z M9 9h6 M9 13h6'],
];

function Antecedentes({ compact }) {
  return (
    <div className="rounded-xl text-center" style={{ background: '#e4e9f3', padding: compact ? 14 : 18 }}>
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/70">
        <img src={pumaLogo} alt="" style={{ height: 12, filter: 'brightness(0) saturate(100%) invert(18%) sepia(38%) saturate(2500%) hue-rotate(208deg)' }} />
      </span>
      <div className="mt-2" style={{ fontSize: compact ? 17 : 18, color: P.ink }}>Antecedentes PUMA</div>
      <div className="mt-2 flex items-center justify-center gap-3" style={{ fontSize: 11, color: P.ink }}>
        <span className="rounded-md bg-white px-2 py-1">☑ Trabajador PUMA</span>
        NOTA <span className="rounded-md bg-white px-2.5 py-0.5" style={{ fontSize: 16 }}>20</span>
      </div>
    </div>
  );
}

function Categorizar({ compact }) {
  return (
    <div className="rounded-xl bg-white text-center" style={{ padding: compact ? 14 : 18 }}>
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-full" style={{ background: P.orange }}>
        <Icon d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L3.3 9.2l6.1-.6z" color="#fff" size={18} />
      </span>
      <div className="mt-2" style={{ fontSize: compact ? 16 : 18, color: P.ink }}>Categorizar para el proceso</div>
      <div className="mt-2 rounded-lg px-3 py-2 text-left" style={{ background: '#d5dbe8', fontSize: 11, color: P.mute }}>Clasificación del postulante</div>
      <div className="mt-2 flex justify-between rounded-lg px-3 py-2" style={{ background: P.field, fontSize: 11, color: P.mute }}>Clasificación para el proceso <span style={{ color: P.blue }}>↓</span></div>
      <div className="mt-3 grid grid-cols-2 gap-2" style={{ fontSize: 12 }}>
        <span className="rounded-lg py-2" style={{ border: `1px solid ${P.line}`, color: P.blue }}>✕ Rechazar</span>
        <span className="rounded-lg py-2 text-white" style={{ background: P.blue }}>✓ Guardar</span>
      </div>
    </div>
  );
}

function Visualizar({ compact }) {
  return (
    <div>
      <div style={{ fontSize: compact ? 17 : 19, color: P.ink }}>Visualizar</div>
      <div style={{ fontSize: 11, color: P.mute }}>Haz clic y visualiza el detalle de cada uno</div>
      <div className={`mt-2 grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {VIEW_CARDS.map(([t, l, d]) => (
          <div key={l} data-t={t || undefined} className="rounded-xl bg-white px-3 py-2.5" style={{ border: `1px solid ${P.line}`, color: P.blue }}>
            <Icon d={d} size={15} color="#5b74c4" />
            <div className="mt-1" style={{ fontSize: 12.5 }}>{l}</div>
            <div style={{ fontSize: 12 }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Panel / hoja: Formularios del postulante */
function FormulariosPanel({ compact }) {
  const q = (title) => (
    <div className="rounded-lg bg-white" style={{ border: `1px solid ${P.line}` }}>
      <div className="px-3 py-2" style={{ borderBottom: `1px solid ${P.line}`, fontSize: compact ? 12.5 : 13, color: P.ink }}>{title}</div>
      <div className="space-y-1.5 px-3 py-2" style={{ fontSize: 11 }}>
        {[true, false, false].map((c, i) => (
          <div key={i} className="flex items-center gap-2" style={{ color: c ? P.ink : '#b6bdcc' }}>
            <span className="grid h-3.5 w-3.5 place-items-center rounded-sm" style={{ border: `1.5px solid ${c ? P.ink : '#c9cfdb'}`, fontSize: 9 }}>{c ? '✓' : ''}</span>
            Ejemplo de respuesta texto largo
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="flex h-full flex-col" style={{ background: '#eef3fb' }}>
      <div className="flex-1 space-y-3 overflow-hidden px-5 pt-5">
        <div className="flex items-center gap-2" style={{ fontSize: compact ? 19 : 21, color: P.ink }}><span style={{ fontSize: 13 }}>↖</span> Formularios</div>
        <div className="space-y-2.5 rounded-xl bg-white p-4">
          <div style={{ fontSize: compact ? 15 : 17, color: P.ink }}>↖ Formulario proceso</div>
          <div style={{ fontSize: compact ? 14 : 15, color: P.ink }}>Pregunta por proyecto</div>
          <div className="grid grid-cols-2 gap-2" style={{ fontSize: 10.5 }}>
            <div className="rounded-lg px-2.5 py-2" style={{ background: P.field, color: P.mute }}>Nombre del proyecto</div>
            <div className="rounded-lg px-2.5 py-2" style={{ background: P.field, color: P.mute }}>Nombre del cargo</div>
          </div>
          {q('¿Cuál es su nivel de estudio?')}
          {!compact && q('Ejemplo de pregunta')}
        </div>
        {['Formulario 2', 'Formulario 3'].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-xl bg-white px-4 py-3" style={{ border: `1px solid ${P.line}` }}>
            <span style={{ fontSize: compact ? 15 : 17, color: P.ink }}>↖ {t}</span>
            <span className="rounded-lg px-3 py-1.5" style={{ background: P.field, fontSize: 11.5, color: P.blue }}>Visualizar</span>
          </div>
        ))}
      </div>
      <div className="px-5 pb-6 pt-3">
        <div data-t="volver" className="grid place-items-center rounded-xl text-white" style={{ background: P.blue, height: compact ? 48 : 42, fontSize: 14 }}>✓ Volver</div>
      </div>
    </div>
  );
}

function PostulanteWeb({ ui }) {
  return (
    <div className="relative flex h-full font-sans" style={{ background: P.bg }}>
      <Sidebar items={USER_NAV} active={4} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-3 bg-white px-8 py-4" style={{ fontSize: 22, color: P.ink }}><span style={{ fontSize: 14 }}>↖</span> Postulante 1.1.1.1</div>
        <div className="flex gap-5 px-6 pt-4">
          <div className="flex-1 space-y-2.5 rounded-xl bg-white p-4">
            <Field label="RUT" outline />
            <Field label="Nombre" />
            <div className="grid grid-cols-2 gap-3"><Field label="Fecha de nacimiento" select /><Field label="Género" select /></div>
            <div className="grid grid-cols-2 gap-3"><Field label="Nacionalidad" select /><Field label="Estatus Migratorio" select /></div>
            <div className="grid grid-cols-2 gap-3"><Field label="Región" select /><Field label="Comuna" select /></div>
            <Field label="Expectativas de renta líquida" />
            <Field label="Nivel de estudio" select />
          </div>
          <div className="w-[400px] space-y-3">
            <Antecedentes />
            <Categorizar />
            <Visualizar />
          </div>
        </div>
      </div>
      {/* Panel lateral de formularios */}
      {ui.panel && (
        <div className="absolute inset-0 z-20" style={{ background: 'rgba(19,35,90,.3)', animation: 'bloo-fade .3s ease both' }}>
          <div className="absolute bottom-3 right-3 top-3 w-[520px] overflow-hidden rounded-2xl" style={{ animation: 'puma-panel .45s cubic-bezier(.2,.8,.2,1) both', boxShadow: '-20px 0 50px -20px rgba(19,35,90,.45)' }}>
            <FormulariosPanel />
          </div>
        </div>
      )}
    </div>
  );
}

function PostulanteMobile({ ui }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden font-sans" style={{ background: P.bg }}>
      <div className="flex items-end justify-between px-5 pb-3" style={{ background: P.navy, height: 104, borderRadius: '0 0 22px 22px' }}>
        <img src={pumaLogo} alt="" style={{ height: 26 }} />
        <span className="flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="block h-0.5 w-5 rounded bg-white" />)}</span>
      </div>
      <div className="space-y-3 px-4 pt-4">
        <div style={{ fontSize: 20, color: P.ink }}>↖ Postulante 1.1.1.1</div>
        <Antecedentes compact />
        <Visualizar compact />
        <Categorizar compact />
      </div>
      {/* Hoja que sube desde abajo */}
      {ui.panel && (
        <div className="absolute inset-0 z-20" style={{ background: 'rgba(19,35,90,.3)', animation: 'bloo-fade .3s ease both' }}>
          <div className="absolute inset-x-0 bottom-0 top-[70px] overflow-hidden rounded-t-[26px]" style={{ animation: 'bloo-sheet .45s cubic-bezier(.2,.8,.2,1) both' }}>
            <div className="flex justify-center pb-1 pt-2.5" style={{ background: '#eef3fb' }}><span className="h-1.5 w-10 rounded-full" style={{ background: '#c3cfe3' }} /></div>
            <FormulariosPanel compact />
          </div>
        </div>
      )}
    </div>
  );
}

const POST_PHASES = ['Ficha del postulante', 'Formularios respondidos por el postulante', 'Volver a la ficha'];

async function postScript({ set, press, sleep }) {
  await sleep(1600);
  set({ phase: 1 });
  await press('card-form');
  set({ panel: true });
  await sleep(3000);
  set({ phase: 2 });
  await press('volver');
  set({ panel: false });
  await sleep(1600);
}

export function PostulanteFlow() {
  return (
    <DualPlayer
      label="Postulante"
      title="PUMA Recruiter · Postulante"
      phoneColor="black"
      phases={POST_PHASES}
      initial={{ phase: 0, panel: false }}
      script={postScript}
      Web={PostulanteWeb}
      Mobile={PostulanteMobile}
    />
  );
}
