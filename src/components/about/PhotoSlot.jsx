import Reveal from '../ui/Reveal.jsx';

/** Foto entre secciones. Sin imagen muestra un hueco neutro de relleno. */
export default function PhotoSlot({ src, alt = '', className = '', portrait = false }) {
  // Retrato: formato vertical al ancho de la columna de texto, para no recortar la cara.
  const frame = portrait ? 'max-w-2xl' : 'max-w-4xl';
  const ratio = portrait ? 'aspect-[4/5]' : 'aspect-[16/10]';
  return (
    <Reveal className={`mx-auto w-full ${frame} px-5 sm:px-8 ${className}`}>
      <div className={`${ratio} overflow-hidden rounded-2xl bg-paper-soft`}>
        {src ? (
          <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-ink-faint" aria-hidden="true">
            <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="6" y="10" width="36" height="28" rx="4" />
              <circle cx="18" cy="21" r="4" />
              <path d="m8 34 10-9 8 7 6-5 8 7" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </Reveal>
  );
}
