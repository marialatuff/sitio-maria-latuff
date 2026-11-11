import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import pumaLogo from '../../assets/projects/puma/logo.png';
import { Icon } from './BlooFlow.jsx';
import { Scaled } from './ApprovalFlow.jsx';
import { PhoneFrame, PHONE_H, PHONE_W } from './devices.jsx';
import { P } from './PumaFlow.jsx';

/**
 * Recorrido móvil de PUMA Recruiter (solo reproducción, iPhone 16):
 * 1. Inicio de sesión en la app → 2. Postulaciones → Postularme →
 * 3. Ficha de postulación → carpeta Documentos → se carga un PDF → se activa Postularme →
 *    postulación exitosa → vuelve a Postulaciones con el botón "Postulado".
 * Pantallas recreadas a partir de los diseños de María.
 */

const SPEED = 0.6;
const SERIF = 'Georgia, "DM Serif Display", serif';
const PHASES = ['Inicio de sesión en la app', 'Postulaciones: elegir una oferta', 'Cargar documentos y postular', 'Postulación enviada'];

/* ---------- Encabezado con líneas verticales ---------- */
function Header({ title }) {
  return (
    <div className="relative overflow-hidden px-4 pt-[52px]" style={{ background: '#0c1d45', height: title ? 162 : 162 }}>
      <div className="pointer-events-none absolute right-6 top-0 flex h-full gap-[5px] opacity-40">
        {Array.from({ length: 14 }, (_, i) => <span key={i} className="h-full w-px bg-white/70" />)}
      </div>
      <div className="relative flex items-center justify-between">
        <img src={pumaLogo} alt="" style={{ height: 34 }} />
        <span className="grid h-9 w-10 place-items-center rounded-md bg-white">
          <span className="flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="block h-0.5 w-4 rounded bg-[#0c1d45]" />)}</span>
        </span>
      </div>
      {title && <div className="relative mt-6 text-white" style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>{title}</div>}
    </div>
  );
}

function Pending({ done }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: done ? '#e5f6ec' : '#e6ebfa', transition: 'background .4s' }}>
      <span className="relative grid h-10 w-10 place-items-center rounded-full" style={{ background: done ? '#2bb35a' : '#5470e8' }}>
        <Icon d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z" color="#fff" size={18} />
        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white" style={{ background: '#2bb35a', fontSize: 9, color: '#fff' }}>★</span>
      </span>
      <div>
        <div style={{ fontSize: 13.5, color: P.ink, fontWeight: 600 }}>{done ? 'Documentos al día' : 'Tienes documentos pendientes'}</div>
        <div style={{ fontSize: 12.5, color: P.mute }}>Visualizar documentos</div>
      </div>
    </div>
  );
}

/* ---------- 1. Login ---------- */
function Login({ ui }) {
  return (
    <div className="flex h-full flex-col items-center px-7 pt-[120px] text-white" style={{ background: 'linear-gradient(180deg, #0c1d45, #1b3274)' }}>
      <img src={pumaLogo} alt="" style={{ height: 52 }} />
      <div className="mt-8 text-center" style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700 }}>Hola, bienvenido a PUMA</div>
      <div className="mt-1" style={{ fontSize: 13, opacity: 0.85 }}>Por favor, inicia sesión</div>
      <div className="mt-8 w-full space-y-5">
        {[['Correo electrónico', ui.email], ['Contraseña', ui.pass]].map(([l, v]) => (
          <div key={l} className="relative">
            <span className="absolute -top-2 left-3 rounded px-1.5" style={{ background: '#13275c', fontSize: 10.5 }}>{l}</span>
            <div className="flex h-12 items-center rounded-lg bg-white px-3" style={{ color: P.ink, fontSize: 14 }}>{v}</div>
          </div>
        ))}
        <div data-t="ingresar" className="grid h-12 place-items-center rounded-xl" style={{ background: P.blue, fontSize: 15 }}>Ingresar</div>
        <div className="text-center" style={{ fontSize: 12 }}>¿Olvidaste tu contraseña?<br /><span style={{ color: '#f0a23a' }}>Haz click aquí para recuperarla</span></div>
      </div>
    </div>
  );
}

/* ---------- 2. Postulaciones ---------- */
function Postulaciones({ ui }) {
  const cards = [
    { state: 'off', toggle: true },
    { state: ui.applied ? 'done' : 'on', key: 'postularme' },
    { state: 'on', toggle: true },
  ];
  return (
    <div className="h-full" style={{ background: '#f6f8fd' }}>
      <Header title="Postulaciones" />
      <div className="space-y-3 px-3.5 pt-6">
        <Pending done={ui.applied} />
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white px-6 py-5" style={{ boxShadow: '0 4px 14px -6px rgba(12,29,69,.15)', border: c.state === 'done' ? '1px solid #b5e3c5' : '1px solid transparent', transition: 'border-color .4s' }}>
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-lg" style={{ background: '#e3e9f6' }}>
                <Icon d="M4 14l7-4 2 4-7 4z M11 10l5-6 3 2-4 6 M15 9h4" color={P.ink} size={20} />
              </span>
              {c.toggle && (
                <span className="relative mt-3 inline-block h-[10px] w-[26px] rounded-full" style={{ background: '#dfe4ee' }}>
                  <span className="absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rounded-full" style={{ left: -1, background: '#777' }} />
                </span>
              )}
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div style={{ fontSize: 16, color: P.ink, fontWeight: 600 }}>Operador de grua</div>
                <div style={{ fontSize: 13.5, color: P.mute }}>Proyecto xXXX 2025</div>
              </div>
              <span
                data-t={c.key}
                className="flex items-center gap-1.5 rounded-md px-3.5 py-2.5"
                style={{
                  background: c.state === 'off' ? '#cfd2d8' : c.state === 'done' ? '#2bb35a' : '#ff6f0f',
                  color: '#fff',
                  fontSize: 13,
                  animation: c.state === 'done' ? 'bloo-pop .4s ease both' : 'none',
                }}
              >
                {c.state === 'done' && <Icon d="M5 12l4 4 10-10" color="#fff" size={13} />}
                {c.state === 'done' ? 'Postulado' : 'Postularme'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3. Ficha de postulación ---------- */
function Folder({ t, title, status }) {
  const [label, bg, fg] = {
    no: ['No cargado', '#ff7b7b', '#7a1010'],
    up: ['Cargando…', '#ffd98a', '#7a4d00'],
    ok: ['Cargado', '#8fe0a8', '#0f5a26'],
  }[status];
  return (
    <div data-t={t} className="relative pt-[30px]">
      {/* Pestaña de la carpeta */}
      <svg viewBox="0 0 308 60" className="absolute left-0 top-0 w-full" aria-hidden="true">
        <path d="M0 6Q0 0 6 0H92L132 28H302Q308 28 308 34V60H0Z" fill="#3a4b78" />
      </svg>
      <div className="relative rounded-xl px-4 py-5" style={{ background: '#8fa4d8' }}>
        <div className="flex items-center justify-between">
          <div style={{ fontSize: 20, color: '#fff', lineHeight: 1.2, maxWidth: 210 }}>{title}</div>
          <span style={{ fontSize: 36, color: '#2c3d6b', lineHeight: 1 }}>›</span>
        </div>
        <span className="mt-2 inline-block rounded-full px-3 py-0.5" style={{ background: bg, color: fg, fontSize: 11.5, border: `1px solid ${fg}55`, transition: 'all .3s' }}>{label}</span>
        {status === 'up' && (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/40">
            <div className="h-full rounded-full bg-white" style={{ animation: 'bloo-grow-x 1.1s ease-out both', transformOrigin: 'left' }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Ficha({ ui }) {
  return (
    <div className="relative h-full" style={{ background: '#f6f8fd' }}>
      <Header />
      <div className="px-4 pt-6">
        <Pending done={ui.doc === 'ok'} />
        <div className="mt-4" style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 700, color: '#0c1d45', lineHeight: 1.2 }}>Postulación operador de grua proyecto xx</div>
        <div className="mt-3" style={{ fontSize: 13, color: P.ink }}>Por favor, complete los documentos restantes para poder postular.</div>
        <div className="mt-5 space-y-4 px-2">
          <Folder t="folder-docs" title="Documentos para postular" status={ui.doc} />
          <Folder title="Formulario para postular" status="no" />
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-9">
        <div data-t="enviar" className="grid h-12 place-items-center rounded-xl text-white" style={{ background: ui.doc === 'ok' ? '#ff6f0f' : '#cfd2d8', fontSize: 15, transition: 'background .4s' }}>Postularme</div>
      </div>

      {/* Selector de archivos del teléfono (hoja desde abajo) */}
      {ui.picker && (
        <div className="absolute inset-0 z-20" style={{ background: 'rgba(0,0,0,.3)', animation: 'bloo-fade .25s ease both' }}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-[#f2f2f7] px-4 pb-8 pt-3" style={{ animation: 'bloo-sheet .4s cubic-bezier(.2,.8,.2,1) both' }}>
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[#c7c7cc]" />
            <div className="flex items-center justify-between" style={{ fontSize: 15 }}>
              <span style={{ color: '#0a84ff' }}>Cancelar</span>
              <span style={{ fontWeight: 600, color: '#111' }}>Archivos</span>
              <span style={{ color: '#c7c7cc' }}>Abrir</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl bg-white">
              {[
                ['licencia-operador-grua.pdf', '1,4 MB', 'pdf-file'],
                ['certificado-antecedentes.pdf', '820 KB'],
                ['curriculum-2025.pdf', '310 KB'],
              ].map(([n, s, t], i) => (
                <div key={n} data-t={t} className="flex items-center gap-3 px-3 py-3" style={{ borderTop: i ? '1px solid #e5e5ea' : 'none', background: ui.pick && i === 0 ? '#e8f0ff' : '#fff' }}>
                  <span className="grid h-9 w-8 place-items-center rounded" style={{ background: '#ff3b30', color: '#fff', fontSize: 8.5, fontWeight: 700 }}>PDF</span>
                  <div className="flex-1"><div style={{ fontSize: 13.5, color: '#111' }}>{n}</div><div style={{ fontSize: 11.5, color: '#8e8e93' }}>{s}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Postulación exitosa */}
      {ui.success && (
        <div className="absolute inset-0 z-20" style={{ background: 'rgba(12,29,69,.35)', animation: 'bloo-fade .25s ease both' }}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white px-6 pb-9 pt-7 text-center" style={{ animation: 'bloo-sheet .4s cubic-bezier(.2,.8,.2,1) both' }}>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full" style={{ background: '#e3f6ea' }}><Icon d="M5 12l4 4 10-10" color="#2bb35a" size={26} /></span>
            <div className="mt-3" style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: '#0c1d45' }}>¡Postulación exitosa!</div>
            <div className="mt-1.5" style={{ fontSize: 13, color: P.mute }}>Tu postulación a Operador de grua fue enviada. Te avisaremos cuando el equipo PUMA la revise.</div>
            <div data-t="volver" className="mt-5 grid h-12 place-items-center rounded-xl text-white" style={{ background: P.blue, fontSize: 15 }}>Volver a postulaciones</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reproductor (solo móvil) ---------- */
const INITIAL = { screen: 'login', email: '', pass: '', applied: false, doc: 'no', picker: false, pick: false, success: false, phase: 0 };

export default function PumaMobileFlow() {
  const mobRef = useRef(null);
  const [ui, setUi] = useState(INITIAL);
  const [tap, setTap] = useState({ x: 200, y: 600, on: false, show: false });
  const [ref, inView] = useInView({ threshold: 0.3, once: false });

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED));
    const set = (p) => alive && setUi((u) => ({ ...u, ...p }));
    const press = async (t) => {
      const root = mobRef.current;
      const el = root?.querySelector(`[data-t="${t}"]`);
      if (!el || !alive) return;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const k = a.width / PHONE_W;
      setTap({ x: (b.left - a.left + b.width / 2) / k, y: (b.top - a.top + b.height / 2) / k, on: false, show: true });
      await sleep(900);
      if (!alive) return;
      setTap((c) => ({ ...c, on: true }));
      await sleep(260);
      setTap((c) => ({ ...c, on: false }));
    };
    const type = async (key, text) => {
      for (let i = 1; i <= text.length && alive; i += 1) {
        set({ [key]: text.slice(0, i) });
        await sleep(50);
      }
    };
    (async () => {
      while (alive) {
        set(INITIAL);
        setTap({ x: 200, y: 600, on: false, show: false });
        // 1. Login
        await sleep(800);
        await type('email', 'operador@ejemplo.com');
        await type('pass', '••••••••••');
        await press('ingresar');
        // 2. Postulaciones
        set({ screen: 'list', phase: 1 });
        await sleep(1300);
        await press('postularme');
        // 3. Ficha: carpeta → cargar PDF → postular
        set({ screen: 'ficha', phase: 2 });
        await sleep(1200);
        await press('folder-docs');
        set({ picker: true });
        await sleep(900);
        await press('pdf-file');
        set({ pick: true });
        await sleep(300);
        set({ picker: false, pick: false, doc: 'up' });
        await sleep(1900);
        set({ doc: 'ok' });
        await sleep(900);
        await press('enviar');
        set({ success: true, phase: 3 });
        await sleep(2000);
        await press('volver');
        // De vuelta en Postulaciones, con el botón "Postulado"
        set({ success: false, screen: 'list', applied: true });
        await sleep(2600);
      }
    })();
    return () => {
      alive = false;
      setUi(INITIAL);
    };
  }, [inView]);

  return (
    <div ref={ref}>
      <div className="grid place-items-center rounded-xl px-[6%] py-[6%]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
        <div className="w-[62%] max-w-[300px]">
          <PhoneFrame color="black">
            <Scaled w={PHONE_W} h={PHONE_H} innerRef={mobRef}>
              <div key={ui.screen} className="h-full" style={{ animation: 'bloo-screen .12s ease-out both' }}>
                {ui.screen === 'login' && <Login ui={ui} />}
                {ui.screen === 'list' && <Postulaciones ui={ui} />}
                {ui.screen === 'ficha' && <Ficha ui={ui} />}
              </div>
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
          {PHASES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === ui.phase ? 'w-6 bg-[#ded0e8]' : 'w-1.5 bg-paper-line'}`} />
          ))}
        </span>
        <span className="text-graphite-soft">
          <span className="text-night">App móvil:</span> {PHASES[ui.phase]}
        </span>
      </div>
      <p className="sr-only">
        Recorrido animado de la app móvil de PUMA: inicio de sesión, lista de postulaciones, carga de un documento PDF desde el teléfono,
        postulación exitosa y regreso a la lista con la oferta marcada como postulada.
      </p>
    </div>
  );
}
