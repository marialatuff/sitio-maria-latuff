import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BlooCover from '../projects/BlooCover.jsx';
import PumaCover from '../projects/PumaCover.jsx';
import DatamedyCover from '../projects/DatamedyCover.jsx';

const COVERS = { bloo: BlooCover, puma: PumaCover, datamedy: DatamedyCover };

/** Portada de relleno hasta tener capturas reales: líneas finas sobre fondo oscuro. */
function CoverPlaceholder({ index }) {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="260" fill="#1a1a1a" />
      <g fill="none" stroke="rgb(var(--c-cover-line))" strokeWidth="1">
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M -10 ${60 + i * 22} C 120 ${20 + i * 30 + index * 6}, 260 ${200 - i * 18}, 410 ${80 + i * 16}`}
          />
        ))}
      </g>
    </svg>
  );
}

/** Tarjeta de proyecto (Home y listado de Proyectos). `className` controla el ancho. */
export function ProjectSlide({ project, index, hidden, className = 'w-[82vw] shrink-0 sm:w-[30rem]' }) {
  return (
    <Link
      to={`/proyectos/${project.slug}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      className={`group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-coal ${className}`}
    >
      {COVERS[project.coverArt] ? (
        // Portada compuesta (fondo + vista web)
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]">
          {(() => {
            const Cover = COVERS[project.coverArt];
            return <Cover />;
          })()}
        </div>
      ) : project.cover ? (
        <img
          src={project.cover}
          alt=""
          loading="lazy"
          className={`h-full w-full object-cover ${project.coverPosition || ''} transition-transform duration-700 group-hover:scale-[1.03]`}
        />
      ) : (
        <CoverPlaceholder index={index} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
        {/* Solo el título: h2 en la fuente secundaria (Inter), pequeño, hasta 2 líneas */}
        <h2 className="line-clamp-2 max-w-[78%] font-geist text-[0.85rem] font-medium leading-snug text-white sm:text-[0.95rem]">
          {project.title}
        </h2>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/70 text-white transition-all duration-300 group-hover:border-hover-light group-hover:bg-hover-light group-hover:text-hover-light-ink">
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M6 14 14 6M7 6h7v7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/**
 * Carrusel infinito que avanza solo; se pausa al pasar el cursor o al enfocar,
 * y se puede mover con flechas discretas.
 */
export default function ProjectCarousel({ projects }) {
  const trackRef = useRef(null);
  const state = useRef({ x: 0, target: null, paused: false, half: 0 });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (el) state.current.half = el.scrollWidth / 2;
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    measure();
    window.addEventListener('resize', measure);
    let raf = 0;
    let last = 0;
    const tick = (now) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const s = state.current;
      if (s.target !== null) {
        s.x += (s.target - s.x) * 0.12;
        if (Math.abs(s.target - s.x) < 0.5) {
          s.x = s.target;
          s.target = null;
        }
      } else if (!s.paused && !reduce) {
        s.x += dt * 0.035;
      }
      if (s.half) {
        if (s.x >= s.half) {
          s.x -= s.half;
          if (s.target !== null) s.target -= s.half;
        }
        if (s.x < 0) {
          s.x += s.half;
          if (s.target !== null) s.target += s.half;
        }
      }
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${-s.x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const step = (dir) => {
    const el = trackRef.current;
    const card = el?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const s = state.current;
    s.target = (s.target ?? s.x) + dir * (card.getBoundingClientRect().width + gap);
  };

  const loop = [...projects, ...projects];
  const setPaused = (v) => () => {
    state.current.paused = v;
  };

  return (
    <section aria-label="Proyectos" className="relative py-10">
      <div
        className="overflow-hidden"
        onMouseEnter={setPaused(true)}
        onMouseLeave={setPaused(false)}
        onFocus={setPaused(true)}
        onBlur={setPaused(false)}
      >
        <div ref={trackRef} className="flex w-max gap-5 px-5 will-change-transform sm:px-8">
          {loop.map((p, i) => (
            <ProjectSlide key={`${p.slug}-${i}`} project={p} index={i % projects.length} hidden={i >= projects.length} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl justify-end gap-2 px-5 sm:px-8">
        {[
          { dir: -1, label: 'Proyecto anterior', d: 'M12 5 7 10l5 5' },
          { dir: 1, label: 'Proyecto siguiente', d: 'M8 5l5 5-5 5' },
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
    </section>
  );
}
