import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import fondo from '../../assets/projects/datamedy/modal-prueba.jpg';
import { Scaled } from './ApprovalFlow.jsx';
import { MacWindow } from './devices.jsx';

/**
 * Modal "Iniciemos tu prueba gratuita" de Datamedy (Group 37), animada:
 * aparece la modal sobre la agenda médica, se completan los datos y se pulsa "Iniciar prueba gratuita".
 * El fondo es el diseño de María; la modal se recrea encima en la misma posición para poder animarla.
 */

const W = 2000;
const H = 1123;
// Posición de la modal en el diseño original
const MODAL = { x: 817, y: 231, w: 474, h: 714 };
const SERIF = '"DM Serif Display", Georgia, serif';
const VIOLET = '#836fff';
const SPEED = 0.6;

const FIELDS = [
  ['nombre', 'Nombre y Apellido', 'Carla Gómez Ruiz'],
  ['tel', 'Teléfono', '+56 9 7654 3210', true],
  ['esp', 'Soy médico...', 'Kinesióloga'],
];

function Field({ label, value, req, active }) {
  return (
    <div>
      <div style={{ fontSize: 15, color: '#1f2433', marginBottom: 6 }}>
        {label}
        {req && <span style={{ color: '#e04848' }}>*</span>}
      </div>
      <div className="flex items-center rounded-md px-3" style={{ height: 40, border: `1px solid ${active ? VIOLET : '#c9ccd6'}`, boxShadow: active ? `0 0 0 3px ${VIOLET}22` : 'none', fontSize: 14, color: value ? '#1f2433' : '#9aa0ad', transition: 'all .25s' }}>
        {value || label}
        {active && <span className="ml-px inline-block h-4 w-px animate-pulse bg-[#1f2433]" />}
      </div>
    </div>
  );
}

export default function DatamedyModal() {
  const [ref, inView] = useInView({ threshold: 0.3, once: false });
  const [ui, setUi] = useState({ open: false, nombre: '', tel: '', esp: '', mail: '', active: null, press: false, done: false });
  const [cursor, setCursor] = useState({ x: 1500, y: 900, show: false, click: false });
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED));
    const set = (p) => alive && setUi((u) => ({ ...u, ...p }));
    const moveTo = async (t) => {
      const root = canvasRef.current;
      const el = root?.querySelector(`[data-t="${t}"]`);
      if (!el || !alive) return;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const k = a.width / W;
      setCursor({ x: (b.left - a.left + b.width / 2) / k, y: (b.top - a.top + b.height / 2) / k, show: true, click: false });
      await sleep(850);
      setCursor((c) => ({ ...c, click: true }));
      await sleep(250);
      setCursor((c) => ({ ...c, click: false }));
    };
    const type = async (key, text) => {
      set({ active: key });
      for (let i = 1; i <= text.length && alive; i += 1) {
        set({ [key]: text.slice(0, i) });
        await sleep(55);
      }
    };
    (async () => {
      while (alive) {
        set({ open: false, nombre: '', tel: '', esp: '', mail: '', active: null, press: false, done: false });
        setCursor({ x: 1500, y: 900, show: false, click: false });
        await sleep(1000);
        set({ open: true });
        await sleep(1100);
        for (const [k, , v] of FIELDS) {
          await moveTo(`f-${k}`);
          await type(k, v);
          await sleep(250);
        }
        await moveTo('f-mail');
        await type('mail', 'carla.gomez@correo.cl');
        set({ active: null });
        await sleep(400);
        await moveTo('iniciar');
        set({ press: true });
        await sleep(900);
        set({ done: true });
        await sleep(2600);
      }
    })();
    return () => {
      alive = false;
    };
  }, [inView]);

  return (
    <div ref={ref}>
      <div className="rounded-xl px-[6%] py-[6%]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
        <MacWindow title="datamedy · Agenda médica" ratio={`${W} / ${H}`}>
          <Scaled w={W} h={H} innerRef={canvasRef}>
            <img src={fondo} alt="" className="absolute inset-0 h-full w-full" />
            {/* Antes de abrir: la agenda sin oscurecer (se tapa la modal del diseño) */}
            <div className="absolute" style={{ left: MODAL.x - 4, top: MODAL.y - 4, width: MODAL.w + 8, height: MODAL.h + 8, background: '#a9a9ab', borderRadius: 18 }} />
            {/* Modal recreada */}
            <div
              className="absolute rounded-2xl bg-white px-8 pt-7"
              style={{
                left: MODAL.x,
                top: MODAL.y,
                width: MODAL.w,
                height: MODAL.h,
                opacity: ui.open ? 1 : 0,
                transform: ui.open ? 'none' : 'translateY(18px) scale(.97)',
                transition: 'all .45s cubic-bezier(.2,.7,.2,1)',
                boxShadow: '0 30px 70px -20px rgba(0,0,0,.45)',
              }}
            >
              {ui.done ? (
                <div className="flex h-full flex-col items-center justify-center pb-10 text-center" style={{ animation: 'bloo-pop .4s ease both' }}>
                  <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: '#e8f8f2' }}>
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2bb38a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                  </span>
                  <div className="mt-5" style={{ fontFamily: SERIF, fontSize: 30, color: '#141a2e', lineHeight: 1.15 }}>¡Tu prueba gratuita<br /><span style={{ color: VIOLET }}>ya comenzó!</span></div>
                  <div className="mt-3 px-4" style={{ fontSize: 14, color: '#5d6375' }}>Te enviamos un código a carla.gomez@correo.cl para que inicies sesión estos 14 días.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: SERIF, fontSize: 29, color: '#141a2e', lineHeight: 1.2 }}>
                    Iniciemos tu prueba gratuita
                    <br />
                    <span style={{ color: VIOLET }}>por 14 días</span> con datamedy
                  </div>
                  <div className="mt-5 space-y-3.5 rounded-lg px-6 py-5" style={{ border: '1px solid #e6e8ee' }}>
                    <div style={{ fontFamily: SERIF, fontSize: 16, color: '#4a5068' }}>Datos Personales</div>
                    {FIELDS.map(([k, l, , req]) => (
                      <div key={k} data-t={`f-${k}`}>
                        <Field label={l} value={ui[k]} req={req} active={ui.active === k} />
                      </div>
                    ))}
                    <div className="pt-2" style={{ fontFamily: SERIF, fontSize: 15.5, color: '#4a5068', lineHeight: 1.3 }}>
                      Por favor, danos tu correo. Este es el mismo que usarás para iniciar sesión en estos 14 días
                    </div>
                    <div data-t="f-mail"><Field label="Correo electrónico" value={ui.mail} req active={ui.active === 'mail'} /></div>
                    <div style={{ fontSize: 10.5, color: '#5d6375', lineHeight: 1.4 }}>
                      Al completar el formulario, te llegará un código momentáneo al correo electrónico, el cual te servirá como contraseña estos 14 días.
                    </div>
                    <div
                      data-t="iniciar"
                      className="grid h-11 place-items-center rounded-full text-white"
                      style={{ background: VIOLET, fontSize: 15, transform: ui.press ? 'scale(.98)' : 'none', filter: ui.press ? 'brightness(.92)' : 'none', transition: 'all .2s' }}
                    >
                      {ui.press ? 'Creando tu cuenta…' : 'Iniciar prueba gratuita'}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Cursor */}
            <div className="absolute left-0 top-0 z-40" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)`, transition: 'transform .5s cubic-bezier(.45,0,.2,1), opacity .3s', opacity: cursor.show ? 1 : 0 }}>
              <span className="absolute -left-7 -top-7 h-14 w-14 rounded-full" style={{ background: 'rgba(131,111,255,.35)', transform: `scale(${cursor.click ? 1 : 0})`, transition: 'transform .25s' }} />
              <svg width="34" height="34" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))' }}>
                <path d="M4 3l16 7-7 2-2 7z" fill="#1f2433" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </Scaled>
        </MacWindow>
      </div>
      <p className="mt-3 font-geist text-sm text-graphite-soft">
        <span className="text-night">Prueba gratuita:</span> se completa el formulario y se inicia la prueba por 14 días
      </p>
    </div>
  );
}
