import { useEffect, useRef, useState } from 'react';
import { MARK_D } from './Signature.jsx';

/**
 * Firma "mf" gigante y clarita de fondo (la del hero de la Home).
 * Se escribe al cargar; el trazo largo de la "f" continúa hacia abajo con el scroll.
 * Se coloca dentro de un contenedor `relative`; `scrollRef` es el bloque cuyo alto
 * marca cuánto scroll hace falta para completar la continuación.
 */
const MARK = MARK_D.replace(/\s*L 812 866$/, ''); // sin el remate final: la línea continúa
const TIP = [786, 882];
const EXTENSION = `M${TIP[0]} ${TIP[1]} C 748 948 724 1030 722 1120 L 720 1640`;

export default function SignatureBackdrop({ scrollRef }) {
  const extRef = useRef(null);
  const extSparkRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // 1. La firma se escribe al cargar.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return undefined;
    }
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);

  // 2. La continuación de la "f" avanza con el scroll (suavizada).
  useEffect(() => {
    const path = extRef.current;
    if (!path) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      path.style.strokeDashoffset = '0';
      return undefined;
    }
    const spark = extSparkRef.current;
    let current = 0;
    let glow = 0;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const h = scrollRef?.current?.offsetHeight || window.innerHeight;
      const intro = Math.min(1, Math.max(0, (now - start - 2900) / 900)) * 0.12;
      const target = Math.min(1, Math.max(intro, intro + (window.scrollY / (h * 0.9)) * (1 - intro)));
      const delta = target - current;
      current += delta * 0.08;
      path.style.strokeDashoffset = String(1 - current);
      // Luz en la punta: brilla mientras la línea baja con el scroll
      if (spark) {
        const moving = Math.min(1, Math.abs(delta) * 40);
        glow += (moving - glow) * (moving > glow ? 0.25 : 0.04);
        const len = Math.min(0.03, current);
        spark.style.strokeDasharray = `${len} 2`;
        spark.style.strokeDashoffset = String(-(current - len));
        spark.style.opacity = String(current > 0.002 && current < 0.998 ? glow : 0);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRef]);

  return (
    <svg
      viewBox={mobile ? '430 170 560 1500' : '345 196 700 1600'}
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[170svh] w-full text-backdrop-line"
      aria-hidden="true"
    >
      {/* Trazo fino y constante, como las líneas del hero de la Home */}
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path
          d={MARK}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition: 'stroke-dashoffset 2.8s cubic-bezier(0.55, 0, 0.25, 1)',
          }}
        />
        <path ref={extRef} d={EXTENSION} pathLength={1} vectorEffect="non-scaling-stroke" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      </g>
      {/* Luz brillante (solo en modo oscuro): recorre la firma al escribirse y sigue la línea con el scroll */}
      <g fill="none" strokeWidth="2.6" strokeLinecap="round" style={{ opacity: 'var(--c-spark-a)' }}>
        {drawn && (
          <path
            d={MARK}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            className="line-spark line-spark-run"
            style={{ '--spark-dur': '2.8s', strokeDasharray: '0.04 2' }}
          />
        )}
        <path
          ref={extSparkRef}
          d={EXTENSION}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          className="line-spark"
          style={{ strokeDasharray: '0 2', opacity: 0 }}
        />
      </g>
    </svg>
  );
}
