import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';

/**
 * Mockups animados de Datamedy. Usan la imagen original (con su fondo violeta) como base y,
 * encima, una capa en HTML alineada a la imagen que simula la interacción.
 * Todas las medidas están en px de la imagen original (2000 × 1268) y se convierten a `cqw`,
 * así la capa escala exactamente con la imagen.
 */

const u = (n) => `${n / 20}cqw`; // 2000 px de la imagen = 100cqw
const EASE = 'cubic-bezier(.45,0,.2,1)';
const SERIF = '"DM Serif Display", Georgia, serif';
const SANS = '"Open Sans", Inter, system-ui, sans-serif';

/** Bucle que corre mientras la imagen está en pantalla. `script(sleep, alive)` es async. */
function useLoop(inView, script) {
  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (alive) await script(sleep, () => alive);
    })();
    return () => {
      alive = false;
    };
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Cursor con pulso al hacer clic (tamaño fijo relativo a la imagen). */
function Cursor({ x, y, click, hidden }) {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0"
      style={{ transform: `translate(${u(x)}, ${u(y)})`, transition: `transform .65s ${EASE}, opacity .3s`, opacity: hidden ? 0 : 1, zIndex: 30 }}
    >
      <span
        className="absolute rounded-full"
        style={{ left: u(-36), top: u(-36), width: u(72), height: u(72), background: 'rgba(131,111,255,.4)', transform: `scale(${click ? 1 : 0})`, opacity: click ? 1 : 0, transition: 'transform .26s, opacity .26s' }}
      />
      <svg viewBox="0 0 24 24" style={{ width: u(52), height: u(52), filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))', transform: `scale(${click ? 0.85 : 1})`, transformOrigin: '0 0', transition: 'transform .15s' }}>
        <path d="M4 3l16 7-7 2-2 7z" fill="#1f2a44" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function useCursor(initial) {
  const [cursor, setCursor] = useState({ ...initial, click: false, hidden: false });
  const move = (x, y) => setCursor((c) => ({ ...c, x, y, hidden: false }));
  const press = async (sleep) => {
    setCursor((c) => ({ ...c, click: true }));
    await sleep(220);
    setCursor((c) => ({ ...c, click: false }));
  };
  return [cursor, move, press, setCursor];
}

function Frame({ src, alt, frameRef, children }) {
  return (
    <div ref={frameRef} className="relative overflow-hidden rounded-xl [container-type:inline-size]">
      <img src={src} alt={alt} loading="lazy" className="block w-full" />
      {children}
    </div>
  );
}

/* ───────────────────────── 1. Características (tabs) ───────────────────────── */

const FEATURES = [
  { title: 'Agendamiento', body: 'Organiza tus consultas presenciales y telemáticas con un sistema de citas en línea.' },
  { title: 'Ficha técnica', body: 'Registra cada atención en la ficha clínica de tu paciente y guarda sus citas en un solo lugar.' },
  { title: 'Boletas electrónicas' },
  { title: 'Telemedicina' },
  { title: 'Ejemplo 4' },
];
const ACC = { x: 380, y: 411, w: 387, open: 209, row: 56, gap: 24 };
const SCREEN = { x: 940, y: 484, w: 660, h: 431 };

function accTop(i, open) {
  let y = ACC.y;
  for (let j = 0; j < i; j++) y += (j === open ? ACC.open : ACC.row) + ACC.gap;
  return y;
}

/** Pantalla 2 de la plataforma: agenda del día con el modal «Agendar nueva cita». */
function AgendaScreen({ stage }) {
  // stage: 'form' | 'saving' | 'saved'
  const rows = [
    ['09:00', 'Pedro Soto', 'Presencial', 'Confirmada'],
    ['09:30', 'Ana Díaz', 'Telemedicina', 'Confirmada'],
    ['10:30', 'Camila Fuentes', 'Presencial', 'Nueva', true],
    ['11:00', 'Luis Rojas', 'Presencial', 'Pendiente'],
  ];
  const saved = stage === 'saved';
  const field = (label, value, top) => (
    <div className="absolute flex items-center" style={{ left: u(18), top: u(top), width: u(304) }}>
      <span style={{ width: u(70), fontSize: u(9), color: '#333', textAlign: 'right', paddingRight: u(10) }}>{label}</span>
      <span className="flex items-center" style={{ flex: 1, height: u(22), border: '1px solid #e3e3e3', borderRadius: u(4), padding: `0 ${u(8)}`, fontSize: u(9), color: '#111' }}>
        {value}
      </span>
    </div>
  );
  return (
    <div className="absolute inset-0" style={{ background: '#f7f8fa', fontFamily: SANS, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
      {/* Barra superior */}
      <div className="absolute flex items-center" style={{ left: u(22), top: u(14), gap: u(8), fontSize: u(8), color: '#9a9a9a' }}>
        <span style={{ width: u(8), height: u(8), borderRadius: 2, border: '1px solid #bbb' }} />
        Datamedy &nbsp;›&nbsp; Agenda
      </div>
      <div className="absolute" style={{ left: u(150), top: u(52), fontSize: u(13), fontWeight: 700, color: '#1d1d1f' }}>
        Agenda · Jueves 14 nov
      </div>
      {/* Tabla */}
      <div className="absolute" style={{ left: u(150), top: u(84), width: u(460) }}>
        <div className="flex" style={{ fontSize: u(8), color: '#8a8a8a', paddingBottom: u(8), borderBottom: '1px solid #e6e6e6' }}>
          <span style={{ width: u(60) }}>Hora</span>
          <span style={{ width: u(150) }}>Paciente</span>
          <span style={{ width: u(120) }}>Modalidad</span>
          <span>Estado</span>
        </div>
        {rows
          .filter((r) => !r[4] || saved)
          .map(([h, p, m, e, isNew]) => (
            <div
              key={h}
              className="flex items-center"
              style={{
                height: u(34),
                fontSize: u(9),
                color: '#222',
                borderBottom: '1px solid #eee',
                background: isNew ? 'rgba(121,215,190,.22)' : 'transparent',
                animation: isNew ? 'bloo-fade .5s ease both' : 'none',
              }}
            >
              <span style={{ width: u(60), fontWeight: 600 }}>{h}</span>
              <span style={{ width: u(150) }}>{p}</span>
              <span style={{ width: u(120), color: '#666' }}>{m}</span>
              <span
                style={{
                  fontSize: u(8),
                  padding: `${u(2)} ${u(8)}`,
                  borderRadius: u(10),
                  background: e === 'Pendiente' ? '#fff1d6' : isNew ? '#79d7be' : '#e9e5ff',
                  color: e === 'Pendiente' ? '#9a6a00' : isNew ? '#0b3b30' : '#5b47e0',
                }}
              >
                {e}
              </span>
            </div>
          ))}
      </div>

      {/* Fondo oscuro + modal */}
      <div className="absolute inset-0" style={{ background: 'rgba(30,30,30,.82)', opacity: saved ? 0 : 1, transition: 'opacity .35s ease' }} />
      <div
        className="absolute bg-white"
        style={{
          left: u(160),
          top: u(62),
          width: u(340),
          height: u(300),
          borderRadius: u(6),
          boxShadow: '0 8px 30px rgba(0,0,0,.3)',
          opacity: saved ? 0 : 1,
          transform: saved ? 'scale(.96)' : 'none',
          transition: 'opacity .3s ease, transform .3s ease',
        }}
      >
        <div className="absolute" style={{ left: u(16), top: u(14), fontSize: u(10.5), fontWeight: 700, color: '#111' }}>
          Agendar nueva cita
        </div>
        <div className="absolute" style={{ left: u(16), top: u(30), fontSize: u(7.5), color: '#777' }}>
          Ingresa los datos para guardar la cita del paciente.
        </div>
        <div className="absolute" style={{ right: u(14), top: u(10), fontSize: u(11), color: '#999' }}>
          ×
        </div>
        {field('Paciente', 'Camila Fuentes', 62)}
        {field('Fecha', '14 nov 2026', 94)}
        {field('Hora', '10:30', 126)}
        <div className="absolute flex items-center" style={{ left: u(18), top: u(160), width: u(304) }}>
          <span style={{ width: u(70), fontSize: u(9), color: '#333', textAlign: 'right', paddingRight: u(10) }}>Modalidad</span>
          <span style={{ fontSize: u(8.5), padding: `${u(4)} ${u(10)}`, borderRadius: u(12), border: '1px solid #836fff', color: '#5b47e0', marginRight: u(6) }}>Presencial</span>
          <span style={{ fontSize: u(8.5), padding: `${u(4)} ${u(10)}`, borderRadius: u(12), border: '1px solid #e3e3e3', color: '#666' }}>Telemedicina</span>
        </div>
        <div className="absolute flex items-center" style={{ left: u(18), top: u(196), width: u(304) }}>
          <span style={{ width: u(70), fontSize: u(9), color: '#333', textAlign: 'right', paddingRight: u(10) }}>Motivo</span>
          <span style={{ flex: 1, height: u(44), border: '1px solid #e3e3e3', borderRadius: u(4), padding: u(6), fontSize: u(8.5), color: '#777' }}>Control anual</span>
        </div>
        <div
          className="absolute flex items-center justify-center"
          style={{ right: u(16), bottom: u(16), width: u(92), height: u(24), borderRadius: u(4), background: '#f4553a', color: '#fff', fontSize: u(8.5), fontWeight: 600 }}
        >
          {stage === 'saving' ? 'Guardando…' : 'Guardar cita'}
        </div>
      </div>

      {/* Aviso de confirmación */}
      <div
        className="absolute flex items-center bg-white"
        style={{
          right: u(20),
          top: u(16),
          gap: u(6),
          padding: `${u(7)} ${u(12)}`,
          borderRadius: u(6),
          boxShadow: '0 4px 16px rgba(0,0,0,.12)',
          fontSize: u(8.5),
          color: '#111',
          opacity: saved ? 1 : 0,
          transform: saved ? 'none' : `translateY(${u(-8)})`,
          transition: 'opacity .3s ease .15s, transform .3s ease .15s',
        }}
      >
        <span className="flex items-center justify-center" style={{ width: u(14), height: u(14), borderRadius: '50%', background: '#79d7be', color: '#0b3b30', fontSize: u(8), fontWeight: 700 }}>
          ✓
        </span>
        Cita guardada · 14 nov, 10:30
      </div>
    </div>
  );
}

export function FeaturesMock({ src, alt }) {
  const [ref, inView] = useInView({ threshold: 0.4, once: false });
  const [open, setOpen] = useState(0);
  const [stage, setStage] = useState('form');
  const [cursor, move, press, setCursor] = useCursor({ x: 1250, y: 1120 });

  // Coordenadas del «+» de cada fila cerrada
  const plusAt = (i, o) => [722, accTop(i, o) + ACC.row / 2];

  useLoop(inView, async (sleep, alive) => {
    setOpen(0);
    setStage('form');
    setCursor({ x: 1250, y: 1120, click: false, hidden: false });
    await sleep(1400);
    if (!alive()) return;
    move(...plusAt(1, 0)); // «+» de Ficha técnica
    await sleep(750);
    await press(sleep);
    setOpen(1);
    await sleep(1300);
    if (!alive()) return;
    move(SCREEN.x + 160 + 340 - 16 - 46, SCREEN.y + 62 + 300 - 16 - 12); // botón «Guardar cita»
    await sleep(800);
    await press(sleep);
    setStage('saving');
    await sleep(450);
    setStage('saved');
    await sleep(1900);
    if (!alive()) return;
    move(...plusAt(0, 1)); // «+» de Agendamiento
    await sleep(800);
    await press(sleep);
    setOpen(0);
    setStage('form');
    await sleep(1600);
  });

  const accTransition = 'top .45s cubic-bezier(.2,.7,.2,1), height .45s cubic-bezier(.2,.7,.2,1), background-color .3s';

  return (
    <Frame src={src} alt={alt} frameRef={ref}>
      {/* Columna izquierda: acordeón */}
      <div className="absolute" style={{ left: u(338), top: u(398), width: u(450), height: u(570), background: '#001d32' }}>
        {/* Indicador vertical */}
        <div className="absolute" style={{ left: u(11), top: u(13), width: u(6), height: u(544), borderRadius: u(3), background: '#fefdff' }} />
        <div
          className="absolute"
          style={{ left: u(11), top: u(accTop(open, open) - 398), width: u(6), height: u(137), borderRadius: u(3), background: '#7ad6bf', transition: 'top .45s cubic-bezier(.2,.7,.2,1)' }}
        />
      </div>
      {FEATURES.map((f, i) => {
        const isOpen = i === open;
        return (
          <div
            key={f.title}
            className="absolute overflow-hidden"
            style={{
              left: u(ACC.x),
              top: u(accTop(i, open)),
              width: u(ACC.w),
              height: u(isOpen ? ACC.open : ACC.row),
              borderRadius: u(10),
              background: isOpen ? '#02243d' : '#022135',
              border: `1px solid ${isOpen ? 'transparent' : '#11324b'}`,
              transition: accTransition,
            }}
          >
            <div
              className="absolute"
              style={{
                left: u(19),
                top: u(isOpen ? 16 : 11),
                fontFamily: SERIF,
                fontSize: u(isOpen ? 27 : 26),
                lineHeight: 1.3,
                color: isOpen ? '#79d7be' : '#fff',
                transition: 'top .45s ease, color .3s, font-size .3s',
              }}
            >
              {f.title}
            </div>
            <span
              className="absolute"
              style={{ right: u(28), top: u(9), fontSize: u(40), lineHeight: 1, fontWeight: 300, color: '#79d7be', opacity: isOpen ? 0 : 1, transition: 'opacity .25s' }}
            >
              +
            </span>
            <div
              className="absolute"
              style={{ left: u(19), top: u(66), width: u(330), fontFamily: SANS, color: '#fff', opacity: isOpen ? 1 : 0, transition: isOpen ? 'opacity .35s ease .2s' : 'opacity .15s' }}
            >
              <p style={{ fontSize: u(16), lineHeight: 1.62 }}>{f.body}</p>
              <p style={{ marginTop: u(18), fontSize: u(20), color: '#836fff', fontWeight: 600 }}>Probar gratis ›</p>
            </div>
          </div>
        );
      })}

      {/* Pantalla de la derecha: se reemplaza por la agenda al abrir «Ficha técnica» */}
      <div
        className="absolute overflow-hidden"
        style={{ left: u(SCREEN.x), top: u(SCREEN.y), width: u(SCREEN.w), height: u(SCREEN.h), borderRadius: u(26), opacity: open === 1 ? 1 : 0, transition: 'opacity .35s ease' }}
      >
        <AgendaScreen stage={open === 1 ? stage : 'form'} />
      </div>

      <Cursor {...cursor} />
    </Frame>
  );
}

/* ───────────────────────── 2. Planes especiales ───────────────────────── */

const PLANS = [
  {
    price: '$14.900',
    name: 'Starter Care',
    items: ['Pacientes ilimitados.', 'Agendamiento básico.', 'Fichas médicas digitales.', 'Confirmación por correo.'],
  },
  {
    price: '$24.900',
    name: 'Proactive Care',
    items: [
      'Pacientes ilimitados.',
      'Agendamiento personalizado.',
      'Fichas médicas digitales.',
      'Confirmación por correo y WhatsApp.',
      'Pagos a través de la plataforma.',
      'Boletas electrónicas.',
      'Soporte prioritario.',
    ],
  },
  {
    price: '$29.950',
    name: 'Complete Care',
    popular: true,
    items: [
      'Pacientes ilimitados.',
      'Agendamiento personalizado',
      'Fichas médicas digitales.',
      'Confirmación por correo y WhatsApp.',
      'Pagos a través de la plataforma.',
      'Boletas electrónicas.',
      'Soporte técnico prioritario.',
      'Telemedicina.',
      'Comunicación por correo electrónico',
    ],
  },
];
const PANEL = { x: 542, y: 460, w: 919, h: 568 };
const COL_W = 305;
const CARD = { y: 434, w: 309, h: 622 };
const BTN = { w: 208, h: 52 };
const colX = (i) => PANEL.x + i * COL_W;
const btnCenter = (i, sel) => [colX(i) + 30 + BTN.w / 2, (sel ? CARD.y + CARD.h - 24 : 984) - BTN.h / 2];

function Check({ dark }) {
  return (
    <svg viewBox="0 0 20 20" style={{ width: u(19), height: u(19), flex: 'none', marginTop: u(1) }}>
      <circle cx="10" cy="10" r="10" fill={dark ? '#24384a' : '#ece2ff'} />
      <path d="M6 10.3l2.6 2.5L14 7.4" fill="none" stroke={dark ? '#fff' : '#9d7bff'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlansMock({ src, alt }) {
  const [ref, inView] = useInView({ threshold: 0.4, once: false });
  const [sel, setSel] = useState(2);
  const [cursor, move, press, setCursor] = useCursor({ x: 1000, y: 1150 });

  useLoop(inView, async (sleep, alive) => {
    setSel(2);
    setCursor({ x: 1000, y: 1150, click: false, hidden: false });
    for (const i of [0, 1, 2]) {
      await sleep(1500);
      if (!alive()) return;
      move(...btnCenter(i, false));
      await sleep(750);
      await press(sleep);
      setSel(i);
    }
    await sleep(1200);
  });

  const t = '.5s cubic-bezier(.2,.7,.2,1)';

  return (
    <Frame src={src} alt={alt} frameRef={ref}>
      {/* Tapa la tarjeta destacada original (con su sombra), respetando el fondo de dos tonos */}
      <div
        className="absolute"
        style={{ left: u(1120), top: u(420), width: u(380), height: u(720), background: `linear-gradient(#ecf6ff 0 ${u(340)}, #f9fafc ${u(340)})` }}
      />
      {/* Panel blanco de los tres planes */}
      <div className="absolute bg-white" style={{ left: u(PANEL.x), top: u(PANEL.y), width: u(PANEL.w), height: u(PANEL.h), borderRadius: u(24) }} />
      {/* Tarjeta destacada que se desplaza al plan elegido */}
      <div
        className="absolute"
        style={{
          left: u(colX(sel)),
          top: u(CARD.y),
          width: u(CARD.w),
          height: u(CARD.h),
          borderRadius: u(22),
          background: '#001c31',
          boxShadow: `0 ${u(30)} ${u(50)} rgba(131,111,255,.28)`,
          transition: `left ${t}`,
        }}
      />
      {PLANS.map((p, i) => {
        const on = i === sel;
        const c = (a, b) => (on ? a : b);
        return (
          <div key={p.name} className="absolute" style={{ left: u(colX(i) + 30), top: u(CARD.y), width: u(CARD.w - 50), height: u(CARD.h), fontFamily: SANS, lineHeight: 1.25 }}>
            {p.popular && (
              <span
                className="absolute"
                style={{
                  right: u(0),
                  top: u(21),
                  padding: `${u(5)} ${u(16)}`,
                  borderRadius: u(14),
                  fontSize: u(10),
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  background: c('#3b3486', '#eee9ff'),
                  color: c('#79d7be', '#6a55f0'),
                  transition: `background-color ${t}, color ${t}`,
                }}
              >
                MOST POPULAR
              </span>
            )}
            <div className="absolute flex items-baseline" style={{ top: u(70), gap: u(10) }}>
              <span style={{ fontSize: u(36), fontWeight: 700, color: c('#fff', '#1d1d4a'), transition: `color ${t}` }}>{p.price}</span>
              <span style={{ fontSize: u(16), color: c('#8a98a8', '#8a8f99'), transition: `color ${t}` }}>/mes</span>
            </div>
            <div className="absolute" style={{ top: u(124), fontSize: u(29), color: c('#fff', '#2a2a5a'), transition: `color ${t}` }}>
              {p.name}
            </div>
            <div className="absolute" style={{ top: u(172), fontSize: u(14.5), color: c('#c9d1da', '#8a8f99'), transition: `color ${t}` }}>
              Primeros 12 meses
            </div>
            <div className="absolute" style={{ top: u(216), width: u(240) }}>
              {p.items.map((it) => (
                <div key={it} className="flex" style={{ gap: u(11), marginBottom: u(7), fontSize: u(14), lineHeight: 1.35, color: c('#e8edf2', '#6b7280'), transition: `color ${t}` }}>
                  <Check dark={on} />
                  <span>{it}</span>
                </div>
              ))}
            </div>
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: 0,
                top: u((on ? CARD.h - 24 : 984 - CARD.y) - BTN.h),
                width: u(BTN.w),
                height: u(BTN.h),
                borderRadius: u(26),
                fontSize: u(15.5),
                border: `${u(2)} solid #836fff`,
                background: c('#836fff', '#fff'),
                color: c('#fff', '#7b61ff'),
                transition: `top ${t}, background-color ${t}, color ${t}`,
              }}
            >
              Elegir plan
            </div>
          </div>
        );
      })}

      <Cursor {...cursor} />
    </Frame>
  );
}
