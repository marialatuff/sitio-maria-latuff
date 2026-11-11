import { useEffect, useRef, useState } from 'react';
import Reveal from '../ui/Reveal.jsx';
import HomeButton from './HomeButton.jsx';
import IsoGraphic from './IsoGraphic.jsx';

/* Rizo tipo firma (dibujado en una caja de 120×400, centro x=60) */
const CURL = [
  [60, 0], [60, 70], [66, 120], [52, 160], [40, 196], [22, 214], [30, 228], [40, 244], [66, 226], [62, 204],
  [58, 182], [44, 196], [46, 230], [48, 280], [60, 330], [60, 400],
];

/** Segmento vertical de y1 a y2 en x, con el rizo escalado al alto del tramo. */
function curlSegment(x, y1, y2, flip) {
  const h = y2 - y1;
  const P = CURL.map(([cx, cy]) => [x + (cx - 60) * (flip ? -1 : 1), y1 + (cy / 400) * h]);
  let d = `M${P[0][0]} ${P[0][1]}`;
  for (let i = 1; i < P.length; i += 3) {
    const [a, b, c] = [P[i], P[i + 1] || P[i], P[i + 2] || P[i]];
    d += `C${a[0]} ${a[1]} ${b[0]} ${b[1]} ${c[0]} ${c[1]}`;
  }
  return d;
}

/**
 * Línea continua que recorre toda la sección (entre el título, cada figura
 * y el botón) y se dibuja con el scroll de forma suavizada.
 */
/** Largo de la luz que viaja en la punta de la línea (fracción del recorrido total). */
const SPARK_LEN = 0.012;

export function FlowLine({ containerRef }) {
  const pathRef = useRef(null);
  const sparkRef = useRef(null);
  const [geom, setGeom] = useState({ d: '', h: 0, w: 0 });

  // Recalcula el trazado a partir de la posición real de los anclajes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const build = () => {
      const box = el.getBoundingClientRect();
      const anchors = [...el.querySelectorAll('[data-flow]')].map((a) => {
        const r = a.getBoundingClientRect();
        return { top: r.top - box.top, bottom: r.bottom - box.top };
      });
      const x = box.width / 2;
      let d = '';
      for (let i = 0; i < anchors.length - 1; i++) {
        const y1 = anchors[i].bottom + 12;
        const y2 = anchors[i + 1].top - 12;
        if (y2 - y1 > 40) d += curlSegment(x, y1, y2, i % 2 === 1);
      }
      setGeom({ d, h: box.height, w: box.width });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // Progreso suavizado (se acerca al valor real poco a poco: sin saltos ni cortes).
  useEffect(() => {
    const path = pathRef.current;
    const el = containerRef.current;
    if (!path || !el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.strokeDashoffset = '0';
      return undefined;
    }
    const spark = sparkRef.current;
    let current = 0;
    let glow = 0;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const target = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / (r.height - vh * 0.1)));
      const delta = target - current;
      current += delta * 0.07;
      path.style.strokeDashoffset = String(1 - current);
      // Luz en la punta: se enciende mientras la línea avanza con el scroll y se apaga al detenerse
      if (spark) {
        const moving = Math.min(1, Math.abs(delta) * 60);
        glow += (moving - glow) * (moving > glow ? 0.25 : 0.04);
        const len = Math.min(SPARK_LEN, current);
        spark.style.strokeDasharray = `${len} 2`;
        spark.style.strokeDashoffset = String(-(current - len));
        spark.style.opacity = String(current > 0.002 && current < 0.998 ? glow : 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [containerRef, geom.d]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden md:block"
      width={geom.w}
      height={geom.h}
      viewBox={`0 0 ${geom.w || 1} ${geom.h || 1}`}
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={geom.d}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        className="text-stroke"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      {/* Luz brillante que guía la vista (solo en modo oscuro) */}
      <g style={{ opacity: 'var(--c-spark-a)' }}>
        <path
          ref={sparkRef}
          d={geom.d}
          pathLength={1}
          fill="none"
          className="line-spark"
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{ strokeDasharray: '0 2', opacity: 0 }}
        />
      </g>
    </svg>
  );
}

function SolutionRow({ item }) {
  return (
    <article id={item.id} className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">
      <Reveal>
        <span className="inline-block rounded bg-night px-1.5 py-0.5 font-geist text-[0.7rem] font-medium tracking-wider text-paper">
          {item.label}
        </span>
        <h3 className="mt-3 t-h3 sm:max-w-[14rem]">
          {item.title}
        </h3>
      </Reveal>
      <div className="flex justify-center" data-flow>
        <IsoGraphic type={item.graphic} className="h-60 w-60 sm:h-72 sm:w-72" />
      </div>
      <Reveal delay={120}>
        <p className="max-w-sm font-geist text-base leading-[1.75] text-graphite md:ml-auto">{item.body}</p>
      </Reveal>
    </article>
  );
}

export default function Solutions({ data }) {
  const flowRef = useRef(null);
  return (
    // solutions-violet: en modo claro el fondo es #7b6b7a y los colores internos se invierten (ver globals.css)
    <section id="soluciones" className="solutions-violet bg-paper-soft py-20 sm:py-28">
      <div ref={flowRef} className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <FlowLine containerRef={flowRef} />

        <Reveal className="mx-auto max-w-2xl text-center" data-flow>
          <h2 className="t-h2">{data.title}</h2>
          <p className="mx-auto mt-5 max-w-lg font-geist text-base leading-[1.75] text-graphite">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-16 md:mt-44 md:gap-44">
          {data.items.map((item) => (
            <SolutionRow key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-14 flex justify-center md:mt-40" data-flow>
          <HomeButton variant="soft" />
        </div>
      </div>
    </section>
  );
}
