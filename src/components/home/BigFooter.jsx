import { HOME_V2, SOCIAL } from '../../content/site.js';
import { useInView } from '../../hooks/useInView.js';
import Reveal from '../ui/Reveal.jsx';
import HomeButton from './HomeButton.jsx';
import Signature from './Signature.jsx';

const ICONS = [
  {
    key: 'linkedin',
    label: 'LinkedIn',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2c0-1.4 1-2.3 2.2-2.3s2 .9 2 2.3V16M11.5 10.5V16" />
      </>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.2 6.8v.1" />
      </>
    ),
  },
];

/** Redes sociales (LinkedIn e Instagram) como botones redondos. Se usa en el footer y en Trabajemos juntos. */
export function SocialLinks({ className = '' }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {ICONS.map((icon) => (
        <li key={icon.key}>
          <a
            href={SOCIAL[icon.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={icon.label}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-snow/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-hover-light hover:bg-hover-light hover:text-hover-light-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {icon.path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Footer gigante con el bloque de contacto, redes y la firma dibujándose al entrar.
 * `compact`: solo el pie de página (línea de crédito), sin el bloque grande ni la firma.
 */
export default function BigFooter({ compact = false }) {
  const { title, body, credit } = HOME_V2.footer;
  const [creditRef, creditSeen] = useInView({ threshold: 0.8 }); // el destello ocurre solo la primera vez
  return (
    // El footer es oscuro en ambos modos (colores fijos coal/snow).
    <footer id="home-footer" className="relative overflow-hidden bg-coal text-snow">
      {!compact && (
        <>
          {/* Firma gigante de fondo, detrás del contenido (no suma altura al footer) */}
          {/* Mismo grosor que la firma del logo del header (≈1,4 px) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 text-footer-sig" aria-hidden="true">
            <Signature className="ml-[-4%] w-[108%] max-w-none translate-y-[18%]" strokeWidth={1.4} duration={2.4} fine />
          </div>

          <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-20 md:grid-cols-2 md:gap-16">
            <Reveal>
              <h2 className="t-h2 text-snow">{title}</h2>
              <SocialLinks className="mt-8" />
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-md font-geist text-lg leading-[1.75] text-snow/70">{body}</p>
              <HomeButton variant="light" className="mt-8" />
            </Reveal>
          </div>
        </>
      )}

      <div className="relative z-10 border-t border-white/10 bg-coal/80 backdrop-blur-[2px]">
        <p ref={creditRef} className="mx-auto max-w-6xl px-5 py-7 text-center sm:px-8">
          <span
            className={`shine-text relative inline-block font-geist text-[0.72rem] tracking-wide ${creditSeen ? 'is-on' : ''}`}
          >
            {credit}
            <span className="credit-spark top" aria-hidden="true" />
            <span className="credit-spark bottom" aria-hidden="true" />
          </span>
        </p>
      </div>
    </footer>
  );
}
