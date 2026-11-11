import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import blooLogo from '../../assets/projects/bloo/logo.png';
import { C, I, Icon } from './BlooFlow.jsx';
import { MacWindow, PhoneFrame, PHONE_H, PHONE_W } from './devices.jsx';


// Ritmo de los recorridos: < 1 = más rápido (afecta esperas, clics y escritura)
const SPEED = 0.6;
/**
 * Recorrido "Aprobación de gastos mayores" (solo reproducción), en dos versiones a la vez:
 * web en ventana de Mac y responsiva en iPhone 16.
 * 1. Vista del módulo → 2. Detalle de solicitud → clic en Aprobar → 3. ¿Estás seguro? → Aprobar → 4. Aprobada exitosamente.
 * Pantallas recreadas a partir de los diseños de María.
 */

const WW = 1200; // lienzo web
const WH = 750;
const MW = PHONE_W; // lienzo móvil (iPhone 16)
const MH = PHONE_H;

const PURPLE = '#3d1470';
const PURPLE_SOFT = '#ece3f8';

const PHASES = [
  'Vista del módulo Aprobación de gastos mayores',
  'Detalle de la solicitud y clic en Aprobar',
  '¿Estás seguro de que deseas aprobar? Se confirma',
  'Solicitud aprobada exitosamente',
];

const REQ = {
  concepto: 'Equipamiento Laboratorio de Ciencias',
  desc: 'Compra de microscopios y material de laboratorio para mejorar experiencias prácticas en Ciencias Naturales.',
  monto: '$2.000.000',
  solicitante: 'Patricia Silva',
  area: 'Académica',
  fecha: '16/11/2024',
};

/* ---------- Piezas compartidas ---------- */
const pill = (bg, fg) => ({ background: bg, color: fg, borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6 });

function Stats({ approved, compact }) {
  const items = [
    ['Pendientes por ti', approved ? 9 : 10, C.ink],
    ['Pendientes por revisión director', approved ? 3 : 2, C.orange],
    ['Aprobadas por director', 3, C.green],
  ];
  return (
    <div className={`grid grid-cols-3 ${compact ? 'gap-2' : 'w-[620px] gap-4'}`}>
      {items.map(([l, v, c]) => (
        <div key={l} className="rounded-xl bg-white" style={{ border: `1px solid ${C.line}`, padding: compact ? '8px 9px' : '14px 18px' }}>
          <div style={{ fontSize: compact ? 9 : 11.5, color: C.mute, lineHeight: 1.25, minHeight: compact ? 22 : 0 }}>{l}</div>
          <div key={v} style={{ fontSize: compact ? 17 : 22, color: c, animation: 'bloo-pop .4s ease both' }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

function RequestCard({ first, approved, compact }) {
  const isDone = first && approved;
  return (
    <div className="rounded-2xl bg-white" style={{ border: `1px solid ${isDone ? '#bfe8cf' : C.line}`, padding: compact ? 14 : '18px 22px', transition: 'border-color .4s' }}>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: compact ? 13 : 15, color: C.ink }}>{REQ.concepto}</span>
        {isDone && <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9.5, background: '#e8f8ef', color: C.green, animation: 'bloo-pop .4s ease both' }}>Aprobada</span>}
      </div>
      <p style={{ fontSize: compact ? 10.5 : 11.5, color: C.mute, marginTop: 4 }}>{REQ.desc}</p>
      <div className={`mt-3 grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-4'}`} style={{ fontSize: compact ? 10.5 : 11.5 }}>
        {[['Solicitante', REQ.solicitante], ['Área', REQ.area], ['Fecha', REQ.fecha], ['Monto', REQ.monto]].map(([k, v]) => (
          <div key={k}><div style={{ color: C.mute, fontSize: compact ? 9.5 : 10.5 }}>{k}</div><div style={{ color: C.ink }}>{v}</div></div>
        ))}
      </div>
      <div className="mt-3 flex gap-2" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 10 }}>
        <span data-t={first ? 'ver-detalle' : undefined} className="px-3 py-1.5" style={{ ...pill('#fff', C.ink), border: `1px solid ${C.line}`, fontSize: compact ? 10.5 : 11 }}>
          <Icon d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" size={12} /> Ver detalle
        </span>
        <span className="px-3 py-1.5" style={{ ...pill('#fff', C.ink), border: `1px solid ${C.line}`, fontSize: compact ? 10.5 : 11 }}>
          <Icon d={I.upload} size={12} /> Cargar evidencia
        </span>
      </div>
    </div>
  );
}

function ApproveButtons({ prefix }) {
  return (
    <div className="flex justify-center gap-3 py-3" style={{ background: PURPLE_SOFT }}>
      <span data-t={`${prefix}-aprobar`} className="px-5 py-2" style={{ ...pill(PURPLE, '#fff'), fontSize: 12 }}>
        <Icon d="M5 12l4 4 10-10" size={13} color="#fff" /> Aprobar
      </span>
      <span className="px-5 py-2" style={{ ...pill('#ddd0f1', PURPLE), fontSize: 12 }}>
        <Icon d={I.x} size={13} color={PURPLE} /> Rechazar
      </span>
    </div>
  );
}

/* ---------- Modales ---------- */
export function ModalDetalle({ compact, obs }) {
  const field = (k, v) => (
    <div><div style={{ fontSize: 9.5, color: C.mute }}>{k}</div><div style={{ fontSize: compact ? 12 : 13, color: C.ink, lineHeight: 1.35 }}>{v}</div></div>
  );
  return (
    <div className="overflow-hidden rounded-2xl bg-white" style={{ width: compact ? 350 : 480, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)' }}>
      <div className="px-6 py-4" style={{ background: '#e6f0ff' }}>
        <div style={{ fontSize: compact ? 17 : 19, color: '#13294b' }}>Detalle de solicitud</div>
        <div style={{ fontSize: 11, color: C.ink }}>Revise cuidadosamente los detalles antes de firmar</div>
      </div>
      <div className="space-y-3 px-6 py-4">
        <div className="grid grid-cols-2 gap-4">{field('Concepto', REQ.concepto)}{field('Monto', REQ.monto)}</div>
        <div className="grid grid-cols-2 gap-4">{field('Solicitante', 'Patricia Velázquez')}{field('Área', 'Biología')}</div>
        {field('Descripción', REQ.desc)}
        {!compact && field('Justificación', 'Según el PME, se requiere fortalecer el área de ciencias con equipamiento moderno para cumplir con los objetivos de aprendizaje del currículum.')}
        <div className="rounded-lg px-3 py-2" style={{ border: `1px solid ${obs ? C.blue : C.line}`, fontSize: 11, color: obs ? C.ink : C.mute, minHeight: compact ? 44 : 56 }}>
          {obs || 'Observación: escriba aquí el mensaje formal que desea enviar a la comunidad educativa...'}
        </div>
      </div>
      <ApproveButtons prefix={compact ? 'm' : 'w'} />
      <div className="flex justify-center py-3">
        <span className="rounded-full px-6 py-1.5" style={{ border: `1px solid ${C.line}`, fontSize: 11.5, color: C.ink }}>Cancelar</span>
      </div>
    </div>
  );
}

function ModalConfirm({ compact }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-center" style={{ width: compact ? 330 : 430, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)' }}>
      <div className="px-6 pb-4 pt-6">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full" style={{ background: '#cfe0ff' }}>
          <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7 M12 17h.01" color={C.blue} size={20} />
        </span>
        <div className="mt-3" style={{ fontSize: compact ? 16 : 18, color: C.ink }}>¿Estás seguro de que deseas aprobar?</div>
        <div className="mt-1" style={{ fontSize: 11, color: C.mute }}>Esta aprobación será notificada tanto al administrativo financiero como al solicitante principal.</div>
      </div>
      <div className="flex justify-center gap-3 py-3" style={{ background: PURPLE_SOFT }}>
        <span data-t={compact ? 'm-confirmar' : 'w-confirmar'} className="px-5 py-2" style={{ ...pill(PURPLE, '#fff'), fontSize: 12 }}>
          <Icon d="M5 12l4 4 10-10" size={13} color="#fff" /> Aprobar
        </span>
        <span className="px-5 py-2" style={{ ...pill('#ddd0f1', PURPLE), fontSize: 12 }}>
          <Icon d={I.x} size={13} color={PURPLE} /> Rechazar
        </span>
      </div>
      <div className="flex justify-center py-3">
        <span className="rounded-full px-6 py-1.5" style={{ border: `1px solid ${C.line}`, fontSize: 11.5, color: C.ink }}>Cancelar</span>
      </div>
    </div>
  );
}

function ModalOk({ compact }) {
  return (
    <div className="rounded-2xl bg-white px-8 py-8 text-center" style={{ width: compact ? 320 : 420, boxShadow: '0 30px 60px -20px rgba(31,42,68,.45)' }}>
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full" style={{ background: '#cfe0ff' }}>
        <Icon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6" color={C.blue} size={20} />
      </span>
      <div className="mt-3" style={{ fontSize: compact ? 16 : 18, color: C.ink }}>Solicitud aprobada exitosamente</div>
      <div className="mt-2" style={{ fontSize: 11, color: C.mute }}>La solicitud será notificada al director.</div>
      <span data-t={compact ? 'm-continuar' : 'w-continuar'} className="mt-5 inline-block rounded-full px-5 py-2" style={{ background: PURPLE, color: '#fff', fontSize: 12 }}>Continuar</span>
    </div>
  );
}

/* ---------- Móvil: hojas que suben desde abajo, con los botones al alcance del pulgar ---------- */
const sheetBtn = (bg, fg) => ({ background: bg, color: fg, borderRadius: 14, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15 });

function SheetActions({ primaryT, primary = 'Aprobar', secondary = 'Rechazar', cancel = true }) {
  return (
    <div className="space-y-2 px-5 pb-9 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
      <div data-t={primaryT} style={sheetBtn(PURPLE, '#fff')}>
        <Icon d="M5 12l4 4 10-10" size={16} color="#fff" /> {primary}
      </div>
      {secondary && (
        <div style={sheetBtn('#ece3f8', PURPLE)}>
          <Icon d={I.x} size={16} color={PURPLE} /> {secondary}
        </div>
      )}
      {cancel && <div className="pt-1 text-center" style={{ fontSize: 14, color: C.mute }}>Cancelar</div>}
    </div>
  );
}

function Sheet({ ui }) {
  const field = (k, v) => (
    <div><div style={{ fontSize: 11, color: C.mute }}>{k}</div><div style={{ fontSize: 14, color: C.ink, lineHeight: 1.35 }}>{v}</div></div>
  );
  const icon = (d) => (
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full" style={{ background: '#cfe0ff' }}><Icon d={d} color={C.blue} size={22} /></span>
  );
  return (
    <div className="absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white" style={{ boxShadow: '0 -20px 40px -20px rgba(31,42,68,.35)' }}>
      {/* Asa de la hoja */}
      <div className="flex justify-center pb-1 pt-2.5"><span className="h-1.5 w-10 rounded-full" style={{ background: '#d5dbe6' }} /></div>
      {ui.modal === 'detalle' && (
        <>
          <div className="px-5 pb-3">
            <div style={{ fontSize: 19, color: '#13294b' }}>Detalle de solicitud</div>
            <div style={{ fontSize: 12, color: C.mute }}>Revise cuidadosamente los detalles antes de firmar</div>
          </div>
          <div className="space-y-3 px-5 pb-4">
            <div className="grid grid-cols-2 gap-3">{field('Concepto', REQ.concepto)}{field('Monto', REQ.monto)}</div>
            <div className="grid grid-cols-2 gap-3">{field('Solicitante', 'Patricia Velázquez')}{field('Área', 'Biología')}</div>
            {field('Descripción', REQ.desc)}
            <div className="rounded-xl px-3 py-2.5" style={{ border: `1px solid ${ui.obs ? C.blue : C.line}`, fontSize: 13, color: ui.obs ? C.ink : C.mute, minHeight: 50 }}>
              {ui.obs || 'Observación: escriba aquí el mensaje formal...'}
            </div>
          </div>
          <SheetActions primaryT="m-aprobar" />
        </>
      )}
      {ui.modal === 'confirm' && (
        <>
          <div className="px-6 pb-5 pt-3 text-center">
            {icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7 M12 17h.01')}
            <div className="mt-3" style={{ fontSize: 18, color: C.ink }}>¿Estás seguro de que deseas aprobar?</div>
            <div className="mt-1.5" style={{ fontSize: 13, color: C.mute }}>Esta aprobación será notificada tanto al administrativo financiero como al solicitante principal.</div>
          </div>
          <SheetActions primaryT="m-confirmar" primary="Sí, aprobar" />
        </>
      )}
      {ui.modal === 'ok' && (
        <>
          <div className="px-6 pb-5 pt-3 text-center">
            {icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6')}
            <div className="mt-3" style={{ fontSize: 18, color: C.ink }}>Solicitud aprobada exitosamente</div>
            <div className="mt-1.5" style={{ fontSize: 13, color: C.mute }}>La solicitud será notificada al director.</div>
          </div>
          <SheetActions primaryT="m-continuar" primary="Continuar" secondary={null} cancel={false} />
        </>
      )}
    </div>
  );
}

function Modal({ ui, compact }) {
  if (!ui.modal) return null;
  if (compact) {
    // La hoja entra deslizándose de abajo hacia arriba
    return (
      <div className="absolute inset-0 z-20" style={{ background: 'rgba(31,42,68,.32)', animation: 'bloo-fade .3s ease both' }}>
        <div key={ui.modal} className="absolute inset-0" style={{ animation: 'bloo-sheet .45s cubic-bezier(.2,.8,.2,1) both' }}>
          <Sheet ui={ui} />
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 z-20 grid place-items-center" style={{ background: 'rgba(31,42,68,.32)', animation: 'bloo-fade .3s ease both' }}>
      <div key={ui.modal} style={{ animation: 'bloo-pop .35s cubic-bezier(.2,.7,.2,1) both' }}>
        {ui.modal === 'detalle' && <ModalDetalle obs={ui.obs} />}
        {ui.modal === 'confirm' && <ModalConfirm />}
        {ui.modal === 'ok' && <ModalOk />}
      </div>
    </div>
  );
}
/* ---------- Pantalla web ---------- */
export function WebScreen({ ui }) {
  return (
    <div className="relative flex h-full font-sans" style={{ background: C.bg }}>
      <aside className="flex w-[210px] shrink-0 flex-col bg-white" style={{ borderRadius: '0 0 28px 0' }}>
        <div className="grid h-[74px] place-items-center" style={{ background: C.blue, borderRadius: '0 0 28px 0' }}>
          <img src={blooLogo} alt="" style={{ height: 34, filter: 'brightness(0) invert(1)' }} />
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3" style={{ fontSize: 12.5 }}>
          {[['Aranceles y cuotas', '$'], ['Aprobación de gastos', 'ok'], ['Comunicaciones', 'c']].map(([l], i) => (
            <div key={l} className="flex items-center gap-2.5 rounded-xl px-3 py-2" style={{ background: i === 1 ? C.blue : 'transparent', color: i === 1 ? '#fff' : C.ink }}>
              <Icon d={i === 0 ? I.note : i === 1 ? I.check : I.chat} size={15} /> {l}
            </div>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-hidden px-8 pt-6">
        <h3 style={{ color: C.blue, fontSize: 24, fontWeight: 700 }}>Aprobación de gastos mayores</h3>
        <p style={{ color: C.mute, fontSize: 12 }}>Revisión, firma y validación de solicitudes antes de enviar al Director</p>
        <div className="mt-4"><Stats approved={ui.approved} /></div>
        <div className="mt-4 space-y-3 rounded-2xl bg-white p-4">
          <RequestCard first approved={ui.approved} />
          <RequestCard />
        </div>
      </div>
      <Modal ui={ui} />
    </div>
  );
}

/* ---------- Pantalla móvil ---------- */
export function MobileScreen({ ui }) {
  return (
    <div className="relative h-full overflow-hidden font-sans" style={{ background: C.bg }}>
      <div className="flex items-end justify-between px-5 pb-3" style={{ background: C.blue, height: 104, borderRadius: '0 0 22px 22px' }}>
        <img src={blooLogo} alt="" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
        <span className="flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="block h-0.5 w-5 rounded bg-white" />)}</span>
      </div>
      <div className="px-4 pt-4">
        <h3 style={{ color: C.blue, fontSize: 20, fontWeight: 700, lineHeight: 1.15 }}>Aprobación de gastos mayores</h3>
        <p style={{ color: C.mute, fontSize: 11, marginTop: 4 }}>Revisión, firma y validación de solicitudes</p>
        <div className="mt-3"><Stats approved={ui.approved} compact /></div>
        <div className="mt-3 space-y-3">
          <RequestCard first approved={ui.approved} compact />
          <RequestCard compact />
        </div>
      </div>
      <Modal ui={ui} compact />
    </div>
  );
}

/* ---------- Lienzo escalado ---------- */
export function Scaled({ w, h, innerRef, children }) {
  const boxRef = useRef(null);
  const [s, setS] = useState(0.5);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      <div ref={innerRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 select-none" style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: '0 0' }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- Reproductor sincronizado ---------- */
export const INITIAL = { modal: null, approved: false, obs: '', phase: 0 };

export default function ApprovalFlow() {
  const webRef = useRef(null);
  const mobRef = useRef(null);
  const [ui, setUi] = useState(INITIAL);
  const [cur, setCur] = useState({ x: 900, y: 560, click: false, show: false }); // cursor web
  const [tap, setTap] = useState({ x: 300, y: 700, on: false, show: false }); // dedo móvil
  const [ref, inView] = useInView({ threshold: 0.3, once: false });

  useEffect(() => {
    if (!inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms * SPEED)); // ritmo ágil
    const set = (p) => alive && setUi((u) => ({ ...u, ...p }));
    const center = (root, w, t) => {
      const el = root?.querySelector(`[data-t="${t}"]`);
      if (!el) return null;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      const k = a.width / w;
      return { x: (b.left - a.left + b.width / 2) / k, y: (b.top - a.top + b.height / 2) / k };
    };
    // Lleva el cursor (web) y el dedo (móvil) a su botón y hace clic en ambos
    const press = async (t) => {
      const pw = center(webRef.current, WW, `w-${t}`) || center(webRef.current, WW, t);
      const pm = center(mobRef.current, MW, `m-${t}`) || center(mobRef.current, MW, t);
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
        set(INITIAL);
        setCur({ x: 900, y: 560, click: false, show: true });
        setTap({ x: 300, y: 700, on: false, show: false });
        await sleep(2200);
        await press('ver-detalle');
        set({ modal: 'detalle', phase: 1 });
        await sleep(900);
        const text = 'Aprobado según PME 2024.';
        for (let i = 1; i <= text.length && alive; i += 1) {
          set({ obs: text.slice(0, i) });
          await sleep(45);
        }
        await sleep(700);
        await press('aprobar');
        set({ modal: 'confirm', phase: 2 });
        await sleep(1500);
        await press('confirmar');
        set({ modal: 'ok', phase: 3 });
        await sleep(2000);
        await press('continuar');
        set({ modal: null, approved: true });
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
      <div className="grid items-center gap-[5%] rounded-xl px-[6%] py-[7%] sm:grid-cols-[1fr_0.3fr]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
        {/* Web en ventana de Mac */}
        <MacWindow>
          <Scaled w={WW} h={WH} innerRef={webRef}>
            <WebScreen ui={ui} />
            <div className="absolute left-0 top-0 z-40" style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, transition: 'transform .5s cubic-bezier(.45,0,.2,1)', opacity: cur.show ? 1 : 0 }}>
              <span className="absolute -left-5 -top-5 h-10 w-10 rounded-full" style={{ background: 'rgba(126,110,135,.35)', transform: `scale(${cur.click ? 1 : 0})`, transition: 'transform .26s' }} />
              <svg width="22" height="22" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))' }}>
                <path d="M4 3l16 7-7 2-2 7z" fill="#1f2a44" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
          </Scaled>
        </MacWindow>
        {/* Responsivo en iPhone 16 */}
        <div className="mx-auto w-[46%] sm:w-full">
          <PhoneFrame>
            <Scaled w={MW} h={MH} innerRef={mobRef}>
              <MobileScreen ui={ui} />
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
      {/* Paso actual */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-geist text-sm">
        <span className="flex gap-1.5" aria-hidden="true">
          {PHASES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === ui.phase ? 'w-6 bg-[#ded0e8]' : 'w-1.5 bg-paper-line'}`} />
          ))}
        </span>
        <span className="text-graphite-soft">
          <span className="text-night">{ui.phase + 1}.</span> {PHASES[ui.phase]} · web y versión móvil
        </span>
      </div>
      <p className="sr-only">
        Recorrido animado de Aprobación de gastos mayores en versión web y móvil: se abre el detalle de la solicitud, se pulsa Aprobar, se
        confirma y aparece el mensaje de solicitud aprobada exitosamente.
      </p>
    </div>
  );
}
