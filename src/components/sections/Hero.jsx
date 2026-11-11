import { useEffect, useRef } from 'react';
import Dial from '../ui/Dial.jsx';

/** Título que entra palabra por palabra (efecto de revelado escalonado). */
function RiseText({ text, as: Tag = 'h1', className = '', stagger = 35 }) {
  const words = text.split(' ');
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="inline-block animate-rise" style={{ animationDelay: `${i * stagger}ms` }}>
              {w}
            </span>
          </span>{' '}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Hero reutilizable. Con `dial` muestra el disco firma que sigue suavemente el puntero.
 * `children` = párrafos; `actions` = botones.
 */
export default function Hero({ title, children, actions, dial = false, dialValue, compact = false }) {
  const dialRef = useRef(null);

  useEffect(() => {
    if (!dial) return undefined;
    const el = dialRef.current;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!el || !fine) return undefined;
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [dial]);

  return (
    <section className={`container-site ${compact ? 'pb-12 pt-14 sm:pt-20' : 'pb-16 pt-14 sm:pb-24 sm:pt-24'}`}>
      <div className={`grid items-center gap-12 ${dial ? 'lg:grid-cols-[1.35fr_1fr]' : ''}`}>
        <div className={dial ? '' : 'max-w-4xl'}>
          <RiseText
            text={title}
            className={`text-balance ${
              title.length > 90
                ? 'text-[2rem] font-light leading-[1.12] tracking-tight sm:text-[2.6rem] xl:text-5xl'
                : 'h-display'
            }`}
          />
          {children && (
            <div
              className="mt-8 max-w-2xl animate-rise space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg"
              style={{ animationDelay: '500ms' }}
            >
              {children}
            </div>
          )}
          {actions && (
            <div className="mt-10 flex animate-rise flex-wrap gap-3" style={{ animationDelay: '700ms' }}>
              {actions}
            </div>
          )}
        </div>

        {dial && (
          <div className="flex justify-center py-6 lg:py-0">
            <div ref={dialRef} className="transition-transform duration-500 ease-out will-change-transform">
              <Dial value={dialValue} suffix={dialValue ? '+' : undefined} size="lg" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
