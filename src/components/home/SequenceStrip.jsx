import { useEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import { SEQUENCES } from './IsoGraphic.jsx';

/**
 * Animación de un servicio en Soluciones, siempre en horizontal:
 * - Escritorio: tira completa que se dibuja paso a paso al entrar en pantalla.
 * - Móvil: la tira queda fija mientras bajas por la página y se desplaza
 *   de lado con tu scroll; cada paso se dibuja al llegar al centro.
 */
const CELL = 300;
// Escritorio: la tira completa termina en 1,5 s como máximo, tenga 3 o 5 pasos.
const DESKTOP_TOTAL_S = 1.5;
const DESKTOP_START_S = 0.05;
const DESKTOP_DRAW_S = 0.5; // trazo de cada paso
const DESKTOP_STAGGER_S = 0.1; // desfase total entre las líneas de un mismo paso
const desktopStep = (n) =>
  n > 1 ? (DESKTOP_TOTAL_S - DESKTOP_START_S - DESKTOP_DRAW_S - DESKTOP_STAGGER_S) / (n - 1) : 0;

const LINE = {
  fill: 'none',
  stroke: 'currentColor', // color según modo: ver className de cada elemento
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

/** Contenido SVG de la tira. `isOn(i)` dice si el paso i está dibujado; `delayOf(i)` su retraso. */
function StripContent({ seq, isOn, delayOf, connectorStyle, drawS = 1.1, maxStagger = Infinity, quick = false }) {
  // Detalles (fondo, nodo y número) más breves cuando la tira debe ser rápida.
  const fadeS = quick ? 0.3 : 0.8;
  const metaIn = quick ? 0.15 : 0.3;
  const n = seq.steps.length;
  const W = CELL * n;
  return (
    <>
      <path d={`M20 292H${W - 20}`} pathLength={1} {...LINE} className="text-ink-faint" style={connectorStyle} />
      {seq.steps.map((paths, i) => {
        const on = isOn(i);
        const delay = delayOf(i);
        return (
          <g key={i} transform={`translate(${CELL * i} 0)`}>
            <g opacity="0.6">
              {seq.persistent.map((d, k) => (
                <path
                  key={`p${k}`}
                  d={d}
                  {...LINE}
                  className="text-ink-faint"
                  strokeWidth="1"
                  style={{ opacity: on ? 1 : 0, transition: `opacity ${fadeS}s ease ${delay}s` }}
                />
              ))}
            </g>
            {paths.map((d, j) => {
              const stagger = Math.min(0.015, maxStagger / Math.max(1, paths.length));
              return (
                <path
                  key={j}
                  d={d}
                  pathLength={1}
                  {...LINE}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: on ? 0 : 1,
                    transition: `stroke-dashoffset ${drawS}s cubic-bezier(0.5, 0, 0.2, 1) ${delay + j * stagger}s`,
                  }}
                />
              );
            })}
            {/* Luz que recorre cada trazo mientras se dibuja (solo en modo oscuro) */}
            {on && (
              <g style={{ opacity: 'var(--c-spark-a)' }}>
                {paths.map((d, j) => {
                  const stagger = Math.min(0.015, maxStagger / Math.max(1, paths.length));
                  return (
                    <path
                      key={j}
                      d={d}
                      pathLength={1}
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="line-spark line-spark-run"
                      style={{ '--spark-dur': `${drawS}s`, '--spark-delay': `${delay + j * stagger}s` }}
                    />
                  );
                })}
              </g>
            )}
            <circle
              cx={CELL / 2}
              cy="292"
              r="4.5"
              className="fill-stroke"
              style={{ opacity: on ? 1 : 0, transition: `opacity ${quick ? 0.25 : 0.4}s ease ${delay + metaIn}s` }}
            />
            <text
              x={CELL / 2}
              y="322"
              textAnchor="middle"
              fontSize="13"
              className="fill-graphite-mute font-geist"
              style={{ opacity: on ? 1 : 0, transition: `opacity ${quick ? 0.25 : 0.5}s ease ${delay + metaIn + 0.05}s` }}
            >
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** Escritorio: se dibuja entera, paso a paso, al entrar en pantalla. */
function DesktopStrip({ seq, className }) {
  const n = seq.steps.length;
  const [ref, on] = useInView({ threshold: 0.2 }); // empieza antes, apenas asoma
  const step = desktopStep(n);
  return (
    <div className={className}>
      <svg ref={ref} viewBox={`0 0 ${CELL * n} 330`} className="mx-auto block h-auto w-full text-ink-line" aria-hidden="true">
        <StripContent
          seq={seq}
          isOn={() => on}
          quick
          drawS={DESKTOP_DRAW_S}
          maxStagger={DESKTOP_STAGGER_S}
          delayOf={(i) => DESKTOP_START_S + i * step}
          connectorStyle={{
            strokeDasharray: 1,
            strokeDashoffset: on ? 0 : 1,
            transition: `stroke-dashoffset ${DESKTOP_TOTAL_S - DESKTOP_START_S}s linear ${DESKTOP_START_S}s`,
          }}
        />
      </svg>
    </div>
  );
}

/**
 * Móvil: tira horizontal "fijada" mientras se baja por la página.
 * El scroll vertical la desplaza de lado y va dibujando cada paso.
 */
function MobileScrollStrip({ seq, className }) {
  const n = seq.steps.length;
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);
  const [reached, setReached] = useState(-1); // último paso alcanzado (los dibujados no se borran)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let current = 0;
    const tick = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (wrap && track) {
        const r = wrap.getBoundingClientRect();
        const travel = Math.max(1, r.height - window.innerHeight);
        const target = Math.min(1, Math.max(0, -r.top / travel));
        current = reduce ? target : current + (target - current) * 0.12; // suavizado
        const max = track.scrollWidth - track.parentElement.clientWidth;
        track.style.transform = `translate3d(${-current * Math.max(0, max)}px,0,0)`;
        if (lineRef.current) lineRef.current.style.strokeDashoffset = String(1 - current);
        // Un paso se dibuja cuando su centro llega al centro de la pantalla.
        const idx = Math.min(n - 1, Math.floor(current * (n - 1) + 0.5));
        if (r.top < window.innerHeight * 0.6) setReached((prev) => Math.max(prev, idx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [n]);

  return (
    // Alto extra = recorrido de scroll para ver todos los pasos
    <div ref={wrapRef} className={`relative ${className}`} style={{ height: `${55 + n * 45}svh` }}>
      <div className="sticky top-24 overflow-hidden">
        <div ref={trackRef} className="will-change-transform" style={{ width: `${n * 78}vw` }}>
          <svg viewBox={`0 0 ${CELL * n} 330`} className="block h-auto w-full text-ink-line" aria-hidden="true">
            <StripContent
              seq={seq}
              isOn={(i) => i <= reached}
              delayOf={() => 0}
              connectorStyle={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
            {/* Línea de progreso que avanza con el scroll */}
            <path
              ref={lineRef}
              d={`M20 292H${CELL * n - 20}`}
              pathLength={1}
              {...LINE}
              className="text-ink-line"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
        </div>
        {/* Indicador de avance */}
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
          {seq.steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i <= reached ? 'w-5 bg-night' : 'w-1.5 bg-paper-line'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SequenceStrip({ type, className = '' }) {
  const seq = SEQUENCES[type];
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return mobile ? <MobileScrollStrip seq={seq} className={className} /> : <DesktopStrip seq={seq} className={className} />;
}
