import { useEffect, useRef, useState } from 'react';
import Dial from '../ui/Dial.jsx';
import Reveal from '../ui/Reveal.jsx';

/** Mini‑diagrama: nodos conectados que se encienden hasta el paso actual. */
function StepDiagram({ total, current }) {
  return (
    <div className="flex items-center" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          {i > 0 && (
            <span
              className={`h-px w-5 transition-colors duration-500 sm:w-7 ${i <= current ? 'bg-glow-deep' : 'bg-ink/15'}`}
            />
          )}
          <span
            className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? 'scale-125 bg-glow shadow-[0_0_10px_2px_rgb(var(--accent-glow)/0.8)]'
                : i < current
                  ? 'bg-glow-deep'
                  : 'bg-ink/15'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Sección tipo "Anatomy": columna fija con título + dial de progreso,
 * y tarjetas que se activan (brillo ámbar) a medida que se hace scroll.
 * items: [{ title, body? }]
 */
export default function AnatomyScroll({ title, subtitle, intro, items, actions }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const total = items.length;

  // Activa la tarjeta cuyo centro está más cerca del centro de la ventana
  // (robusto ante scroll rápido, a diferencia de un IntersectionObserver por bandas).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [total]);

  return (
    <section className="container-site py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        {/* Columna fija */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Reveal>
            <h2 className="h-section text-balance">{title}</h2>
            {subtitle && <p className="mt-5 text-base leading-[1.75] text-ink-soft sm:text-lg">{subtitle}</p>}
            {intro}
          </Reveal>
          <div className="mt-12 hidden items-center gap-8 lg:flex">
            <Dial
              size="md"
              value={String(active + 1).padStart(2, '0')}
              suffix={`/${String(total).padStart(2, '0')}`}
              progress={(active + 1) / total}
            />
            <div className="max-w-[14rem]">
              <p className="eyebrow">{String(active + 1).padStart(2, '0')}</p>
              <p className="mt-2 text-lg font-medium leading-snug" aria-live="polite">
                {items[active]?.title}
              </p>
            </div>
          </div>
          {actions && <div className="mt-10 hidden flex-wrap gap-3 lg:flex">{actions}</div>}
        </div>

        {/* Tarjetas */}
        <ol className="flex flex-col gap-5 lg:gap-8 lg:py-[20vh]">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li
                key={item.title}
                ref={(el) => (refs.current[i] = el)}
                data-index={i}
                className={`surface-card p-7 transition-all duration-500 sm:p-9 lg:min-h-[16rem] ${
                  isActive ? 'shadow-glow lg:scale-[1.02]' : 'lg:opacity-55'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-4xl font-light tabular-nums text-ink/70">{String(i + 1).padStart(2, '0')}</span>
                  <StepDiagram total={total} current={i} />
                </div>
                <h3 className="mt-6 text-xl font-medium leading-snug tracking-tight sm:text-2xl">{item.title}</h3>
                {item.body && <p className="mt-3 leading-[1.75] text-ink-soft">{item.body}</p>}
              </li>
            );
          })}
        </ol>

        {actions && <div className="flex flex-wrap gap-3 lg:hidden">{actions}</div>}
      </div>
    </section>
  );
}
