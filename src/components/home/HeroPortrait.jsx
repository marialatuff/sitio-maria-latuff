import { useEffect, useRef, useState } from 'react';
import photo from '../../assets/maria.webp';
import { curve } from './iso.js';

/**
 * Hero (Wire-home (2).pdf):
 * 1. La "m" de la firma entra por la izquierda con un trazo grueso.
 * 2. Al llegar a la foto, el mismo trazo sigue en zigzag y, por donde pasa,
 *    va descubriendo la fotografía (como una pincelada).
 * 3. La foto queda completa; su base se difumina con el fondo y, al hacer
 *    scroll, se desvanece y sube suavemente hacia la sección siguiente.
 */
const VB = { w: 1440, h: 820 };
const PHOTO = { x: 780, y: 180, w: 611, h: 640 }; // proporción de la foto: 1527 × 1600

// "m" de la firma (primer tramo de MARK_D), llevada a coordenadas del hero.
// Escala y posición: empieza en el borde izquierdo y termina dentro del pelo (lado izquierdo de la foto).
const SX = 0.85;
const SY = 1.1;
const TX = -50;
const TY = -60; // la "m" ocupa la franja alta; el título queda debajo, como en el wireframe
const M_RAW = [
  [120, 448], [220, 475], [360, 430], [455, 330],
  [515, 262], [552, 228], [572, 252],
  [592, 285], [555, 372], [607, 393],
  [667, 412], [755, 330], [798, 280],
  [790, 335], [760, 388], [832, 395],
  [960, 402], [1130, 320], [1215, 230],
];
const P = M_RAW.map(([x, y]) => [x * SX + TX, y * SY + TY]);
const M_PATH =
  `M${P[0][0]} ${P[0][1]}` +
  Array.from({ length: (P.length - 1) / 3 }, (_, k) => {
    const [a, b, c] = [P[1 + k * 3], P[2 + k * 3], P[3 + k * 3]];
    return `C${a[0]} ${a[1]} ${b[0]} ${b[1]} ${c[0]} ${c[1]}`;
  }).join('');
const M_END = P[P.length - 1];

// Pincelada en zigzag que recorre la foto de arriba abajo.
const BRUSH = curve([
  M_END,
  [1320, 215],
  [850, 320],
  [1385, 310],
  [800, 435],
  [1395, 430],
  [790, 555],
  [1395, 560],
  [790, 680],
  [1395, 690],
  [800, 805],
  [1395, 815],
]);

const T = { m: 1.8, brushStart: 1.65, brush: 2.1, reveal: 3.55, fadeLine: 3.8 };

export default function HeroPortrait({ title, titleLines, paragraph }) {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const [on, setOn] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true);
      return undefined;
    }
    const t = setTimeout(() => setOn(true), 250);
    return () => clearTimeout(t);
  }, []);

  // Al hacer scroll la foto se desvanece un poco más y sube ligeramente.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      const el = photoRef.current;
      const sec = sectionRef.current;
      if (!el || !sec) return;
      const p = Math.min(1, Math.max(0, window.scrollY / (sec.offsetHeight * 0.75)));
      el.style.opacity = String(1 - 0.7 * p);
      el.style.transform = reduce ? 'none' : `translateY(${-40 * p}px)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Entrada de los textos: suben, se enfocan y aparecen, sincronizados con el trazo.
  const enter = (delay, dist = 100) => ({
    opacity: on ? 1 : 0,
    transform: on ? 'translateY(0)' : dist === 100 ? 'translateY(105%)' : `translateY(${dist}px)`,
    filter: on ? 'blur(0)' : 'blur(6px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}s, filter 0.8s ease ${delay}s`,
  });

  const draw = (dur, delay) => ({
    strokeDasharray: 1,
    strokeDashoffset: on ? 0 : 1,
    transition: `stroke-dashoffset ${dur}s cubic-bezier(0.5, 0, 0.25, 1) ${delay}s`,
  });

  const art = (
    <svg
      viewBox={mobile ? '600 110 840 710' : `0 0 ${VB.w} ${VB.h}`}
      // Escritorio: ocupa todo el alto (la foto grande a la derecha); en pantallas estrechas se recorta el inicio de la "m".
      preserveAspectRatio={mobile ? 'xMidYMid meet' : 'xMaxYMax slice'}
      className={mobile ? 'block h-auto w-full' : 'absolute inset-0 h-full w-full'}
      role="img"
      aria-label="Fotografía de María Latuff dibujada por el trazo de su firma"
    >
      <defs>
        {/* Lo que la pincelada ya ha descubierto */}
        <mask id="hero-brush" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
          <rect width={VB.w} height={VB.h} fill="black" />
          <path
            d={BRUSH}
            pathLength={1}
            fill="none"
            stroke="white"
            strokeWidth="150"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={draw(T.brush, T.brushStart)}
          />
          {/* Al final, la foto se completa del todo */}
          <rect
            x={PHOTO.x}
            y={PHOTO.y}
            width={PHOTO.w}
            height={PHOTO.h}
            fill="white"
            style={{ opacity: on ? 1 : 0, transition: `opacity 0.6s ease ${T.reveal}s` }}
          />
        </mask>
        {/* Difuminado permanente de la base de la foto */}
        <linearGradient id="hero-fade" x1="0" y1={PHOTO.y} x2="0" y2={PHOTO.y + PHOTO.h} gradientUnits="userSpaceOnUse">
          <stop offset="0.68" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id="hero-fade-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VB.w} height={VB.h}>
          <rect width={VB.w} height={VB.h} fill="url(#hero-fade)" />
        </mask>
      </defs>

      {/* Fotografía */}
      <g ref={photoRef} style={{ transition: 'opacity 0.2s linear' }}>
        <g mask="url(#hero-fade-mask)">
          <image
            href={photo}
            x={PHOTO.x}
            y={PHOTO.y}
            width={PHOTO.w}
            height={PHOTO.h}
            preserveAspectRatio="xMidYMax meet"
            mask="url(#hero-brush)"
          />
        </g>
      </g>

      {/* Trazo grueso visible: la "m" y la pincelada */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-night"
      >
        <path d={M_PATH} pathLength={1} strokeWidth="13" style={draw(T.m, 0)} />
        <g style={{ opacity: on ? 0 : 1, transition: `opacity 0.8s ease ${T.fadeLine}s` }}>
          <path d={BRUSH} pathLength={1} strokeWidth="13" style={draw(T.brush, T.brushStart)} />
        </g>
      </g>
    </svg>
  );

  const text = (
    <div className={mobile ? 'px-5 pb-16 pt-8' : 'relative z-10'}>
      {/* Escritorio: siempre 2 líneas (cada una sin saltos), con tamaño ajustado al ancho */}
      <h1
        aria-label={title}
        className="font-script text-5xl leading-[1.08] text-night md:text-[2.7rem] lg:text-[3.3rem] xl:text-6xl"
      >
        {(titleLines || [title]).map((line, i) => (
          // Cada línea sube y se enfoca mientras la "m" se dibuja
          // pr/-mr: margen para que el trazo final de la letra manuscrita no se recorte
          <span key={line} aria-hidden="true" className="-mr-[0.25em] block overflow-hidden pb-[0.12em] pr-[0.25em] md:whitespace-nowrap">
            <span className="block" style={enter(0.45 + i * 0.22)}>
              {line}
            </span>
          </span>
        ))}
      </h1>
      <p className="mt-6 max-w-md text-lg leading-[1.75] text-graphite" style={enter(1.15, 16)}>
        {paragraph}
      </p>
    </div>
  );

  if (mobile) {
    return (
      <section ref={sectionRef} className="pt-20">
        {art}
        {text}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden">
      {art}
      <div className="mx-auto flex min-h-[100svh] max-w-6xl items-end px-5 pb-[12vh] sm:px-8">{text}</div>
    </section>
  );
}
