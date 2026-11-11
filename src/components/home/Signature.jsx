import { useInView } from '../../hooks/useInView.js';

/**
 * Firma "mf" de María como trazo (línea central calcada de SVG Logo.svg),
 * para poder animarla como si se escribiera.
 * Coordenadas en el sistema del SVG original (2391 × 976).
 */
export const MARK_D =
  'M 120 448 C 220 475 360 430 455 330 C 515 262 552 228 572 252 C 592 285 555 372 607 393 C 667 412 755 330 798 280 C 790 335 760 388 832 395 C 960 402 1130 320 1215 230 C 1262 178 1288 92 1318 86 C 1348 82 1312 170 1232 268 C 1085 448 880 706 786 882 L 812 866';

/** Desplazamiento de la segunda firma en el logo doble (igual que en el SVG original). */
export const MARK_OFFSET = { x: 892, y: 21 };

/** Firma doble "mf mf" como grupo SVG reutilizable dentro de otro <svg>. */
export function SignaturePaths({ drawn, duration = 2.6, strokeWidth = 22, className = '', delay = 0, fine = false }) {
  // fine: grosor fijo en píxeles (no crece con el tamaño de la firma), como el trazo del logo
  const base = {
    fill: 'none',
    strokeWidth,
    ...(fine ? { vectorEffect: 'non-scaling-stroke' } : {}),
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: 1,
    transition: `stroke-dashoffset ${duration}s cubic-bezier(0.6, 0.05, 0.3, 1)`,
  };
  return (
    <g className={className} stroke="currentColor">
      <path
        d={MARK_D}
        pathLength={1}
        style={{ ...base, strokeDashoffset: drawn ? 0 : 1, transitionDelay: `${delay}s` }}
      />
      <path
        d={MARK_D}
        pathLength={1}
        transform={`translate(${MARK_OFFSET.x} ${MARK_OFFSET.y})`}
        style={{ ...base, strokeDashoffset: drawn ? 0 : 1, transitionDelay: `${delay + duration * 0.85}s` }}
      />
    </g>
  );
}

/** Firma doble independiente que se dibuja al entrar en pantalla. */
export default function Signature({ className = '', strokeWidth = 22, duration = 2.2, fine = false }) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  return (
    <svg ref={ref} viewBox="90 60 2160 860" className={className} aria-hidden="true">
      <SignaturePaths drawn={inView} strokeWidth={strokeWidth} duration={duration} fine={fine} />
    </svg>
  );
}

/** Logo compacto para el header: una firma + "AI product builder". */
export function LogoMark({ className = '' }) {
  return (
    <span className={`inline-flex items-end gap-1 ${className}`}>
      <svg viewBox="100 60 1260 850" className="h-8 w-auto" aria-hidden="true">
        <path
          d={MARK_D}
          fill="none"
          stroke="currentColor"
          strokeWidth="38"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="-mb-1 font-script text-[0.95rem] leading-[0.85]">
        AI product
        <br />
        builder
      </span>
      <span className="sr-only">María Latuff · AI Product Builder</span>
    </span>
  );
}
