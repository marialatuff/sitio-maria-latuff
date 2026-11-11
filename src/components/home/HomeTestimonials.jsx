import { useEffect, useRef, useState } from 'react';
import Reveal from '../ui/Reveal.jsx';
import HomeButton from './HomeButton.jsx';

/** Logo de ejemplo (sustituir por el logo real de cada cliente). */
function ExampleLogo({ variant = 0 }) {
  const marks = [
    <g key="a"><circle cx="9" cy="9" r="7" /><circle cx="9" cy="9" r="3" /></g>,
    <g key="b"><rect x="2" y="2" width="14" height="14" rx="4" /><path d="M6 12 12 6" /></g>,
    <g key="c"><path d="M2 14 9 3l7 11Z" /><path d="M6 10h6" /></g>,
    <g key="d"><circle cx="6" cy="9" r="4.5" /><circle cx="12" cy="9" r="4.5" /></g>,
  ];
  return (
    <span className="inline-flex items-center gap-1.5 text-graphite-soft" aria-label="Logo de ejemplo">
      <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {marks[variant % marks.length]}
      </svg>
      <span className="font-geist text-[0.8rem] font-semibold tracking-tight">logo</span>
    </span>
  );
}

/** Dominio legible a partir de la URL (ej. "https://www.kpi.cl/" → "kpi.cl"). */
const domainOf = (url) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');

function GlobeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M1.75 8h12.5M8 1.75c1.8 1.9 2.7 4 2.7 6.25S9.8 12.35 8 14.25C6.2 12.35 5.3 10.25 5.3 8S6.2 3.65 8 1.75Z" />
    </svg>
  );
}

/** Foto del cliente; sin foto muestra sus iniciales en un fondo neutro. */
function ClientPhoto({ t }) {
  const initials = t.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  return (
    // Pegada a los bordes de la tarjeta, sin margen ni radio propio.
    // Móvil: franja superior a todo el ancho. Escritorio: columna izquierda de arriba abajo.
    <div className="h-40 w-full shrink-0 overflow-hidden bg-paper-soft sm:h-auto sm:w-52 sm:self-stretch">
      {t.photo ? (
        <img src={t.photo} alt={t.name} className="h-full w-full object-cover object-[center_30%]" />
      ) : (
        <div className="grid h-full w-full place-items-center font-geist text-2xl font-medium text-graphite-mute" aria-hidden="true">
          {initials}
        </div>
      )}
    </div>
  );
}

/** Máximo de caracteres visibles antes de "Leer más" (mantiene la foto casi cuadrada). */
const MAX_CHARS = 110;

/** Recorta en el último espacio antes del límite, sin cortar palabras. */
function shorten(text) {
  if (text.length <= MAX_CHARS) return null;
  const cut = text.slice(0, MAX_CHARS);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '') + '…';
}

function ChevronIcon({ up }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-3.5 w-3.5 transition-transform duration-300 ${up ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

/**
 * Texto del testimonio: muestra hasta 200 caracteres. "Leer más" abre el texto
 * completo dentro de la misma tarjeta (con scroll interno), sin agrandarla.
 */
function Quote({ text, hidden, onToggle }) {
  const [open, setOpen] = useState(false);
  const short = shorten(text);
  const toggle = () => {
    setOpen((v) => !v);
    onToggle?.(!open);
  };

  if (!short) {
    return <blockquote className="mt-3 flex-1 font-geist text-[0.9rem] leading-relaxed text-graphite-soft">{text}</blockquote>;
  }

  return (
    <div className="mt-3 flex flex-1 flex-col">
      <blockquote className="relative flex-1 font-geist text-[0.9rem] leading-relaxed text-graphite-soft">
        {/* El texto corto fija la altura de la tarjeta */}
        <span className={open ? 'invisible' : undefined} aria-hidden={open || undefined}>
          {short}
        </span>
        {open && (
          <span
            className="absolute inset-0 overflow-y-auto pr-2 [scrollbar-width:thin]"
            style={{
              maskImage: 'linear-gradient(to bottom, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent)',
            }}
          >
            {text}
            <span className="block h-4" />
          </span>
        )}
      </blockquote>
      <button
        type="button"
        onClick={toggle}
        tabIndex={hidden ? -1 : undefined}
        aria-expanded={open}
        className="mt-2 inline-flex items-center gap-1 self-start font-geist text-xs font-medium text-night underline-offset-4 hover:underline"
      >
        {open ? 'Leer menos' : 'Leer más'}
        <ChevronIcon up={open} />
      </button>
    </div>
  );
}

function TestimonialCard({ t, index, hidden, onToggle }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      // Mismo radio que las tarjetas de proyectos (rounded-2xl)
      className="flex w-[82vw] max-w-[22rem] shrink-0 flex-col overflow-hidden rounded-2xl sm:max-w-none sm:flex-row bg-card transition-transform duration-500 ease-out hover:-translate-y-1 sm:w-[40rem] sm:gap-6"
    >
      {/* Izquierda: foto del cliente */}
      <ClientPhoto t={t} />

      {/* Derecha: testimonio */}
      <div className="flex min-w-0 flex-1 flex-col p-5 sm:py-6 sm:pl-0 sm:pr-6">
      <p className="font-geist text-[1.05rem] font-medium leading-snug text-night">“{t.headline}”</p>
      <Quote text={t.quote} hidden={hidden} onToggle={onToggle} />
      <figcaption className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <span className="min-w-0">
          <span className="block font-geist text-[0.9rem] font-medium text-night">{t.name}</span>
          <span className="block font-geist text-xs text-graphite-soft">
            {t.role}
            {t.company ? ` · ${t.company}` : ''}
          </span>
          {/* Sitio web de la empresa, con icono */}
          {t.website && (
            <a
              href={t.website}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={hidden ? -1 : undefined}
              className="mt-2 inline-flex items-center gap-1.5 font-geist text-xs text-graphite-soft underline-offset-4 transition-colors hover:text-night hover:underline"
            >
              <GlobeIcon />
              {domainOf(t.website)}
            </a>
          )}
        </span>
        {t.logo ? (
          <img src={t.logo} alt={t.company} className="logo-mono h-7 w-auto max-w-[6.5rem] shrink-0 object-contain" />
        ) : t.website ? null : (
          // Solo los testimonios de ejemplo (sin sitio web) llevan el logo de muestra
          <ExampleLogo variant={index} />
        )}
      </figcaption>
      </div>
    </figure>
  );
}

/**
 * Fila infinita con desplazamiento suave por rAF: desacelera al pasar el cursor
 * (en vez de frenar en seco) y vuelve a acelerar al salir.
 */
function MarqueeRow({ items, direction = 1, speed = 0.03 }) {
  const trackRef = useRef(null);
  // goTo: destino al pulsar las flechas (salta una tarjeta con desplazamiento suave)
  const st = useRef({ x: 0, v: 1, target: 1, half: 0, goTo: null });

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = trackRef.current;
    const measure = () => {
      st.current.half = el.scrollWidth / 2;
      if (direction < 0 && st.current.x === 0) st.current.x = st.current.half;
    };
    measure();
    window.addEventListener('resize', measure);

    let raf = 0;
    let last = 0;
    const tick = (now) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const s = st.current;
      if (s.goTo !== null) {
        // Flechas: va al destino con frenado suave
        s.x += (s.goTo - s.x) * 0.12;
        if (Math.abs(s.goTo - s.x) < 0.5) {
          s.x = s.goTo;
          s.goTo = null;
        }
      } else if (!reduce) {
        s.v += (s.target - s.v) * 0.05; // aceleración/desaceleración suave
        s.x += dt * speed * s.v * direction;
      }
      if (s.half) {
        const shift = s.x >= s.half ? -s.half : s.x < 0 ? s.half : 0;
        if (shift) {
          s.x += shift;
          if (s.goTo !== null) s.goTo += shift;
        }
      }
      el.style.transform = `translate3d(${-s.x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [direction, speed]);

  // Mientras hay un testimonio abierto ("Leer más"), la fila se detiene para poder leerlo.
  const openCount = useRef(0);
  const onToggle = (isOpen) => {
    openCount.current = Math.max(0, openCount.current + (isOpen ? 1 : -1));
    st.current.target = openCount.current ? 0 : 0.12;
  };

  // Flechas: avanza o retrocede una tarjeta (ancho + separación)
  const step = (dir) => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const s = st.current;
    s.goTo = (s.goTo ?? s.x) + dir * (card.getBoundingClientRect().width + gap);
  };

  const loop = [...items, ...items];
  return (
    <>
      <div
        className="overflow-hidden py-3"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
        onMouseEnter={() => (st.current.target = openCount.current ? 0 : 0.12)}
        onMouseLeave={() => (st.current.target = openCount.current ? 0 : 1)}
      >
        <div ref={trackRef} className="flex w-max gap-5 will-change-transform">
          {loop.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i % items.length} hidden={i >= items.length} onToggle={onToggle} />
          ))}
        </div>
      </div>

      {/* Mismas flechas que el carrusel de proyectos */}
      <div className="mx-auto mt-6 flex max-w-6xl justify-end gap-2 px-5 sm:px-8">
        {[
          { dir: -1, label: 'Testimonio anterior', d: 'M12 5 7 10l5 5' },
          { dir: 1, label: 'Testimonio siguiente', d: 'M8 5l5 5-5 5' },
        ].map((b) => (
          <button
            key={b.dir}
            type="button"
            onClick={() => step(b.dir)}
            aria-label={b.label}
            className="grid h-10 w-10 place-items-center rounded-full border border-paper-line text-graphite-soft transition-colors hover:border-hover hover:text-hover"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d={b.d} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </>
  );
}

export default function HomeTestimonials({ title, items }) {
  return (
    <section className="py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl px-5 text-center">
        <span className="inline-block rounded-full bg-card px-3 py-1 font-geist text-xs text-graphite-soft shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
          Testimonios
        </span>
        <h2 className="mt-4 t-h2">{title}</h2>
      </Reveal>

      <div className="relative mt-12">
        {/* Una sola fila de tarjetas anchas */}
        <MarqueeRow items={items} direction={1} speed={0.035} />
      </div>

      <div className="mt-12 flex justify-center">
        <HomeButton variant="soft" />
      </div>
    </section>
  );
}
