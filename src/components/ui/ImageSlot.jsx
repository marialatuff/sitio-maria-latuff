/** Imagen con relleno neutro mientras no exista la real. */
export default function ImageSlot({ src, alt = '', className = '', aspect = 'aspect-[4/3]' }) {
  return (
    <div className={`${aspect} overflow-hidden rounded-2xl bg-paper-soft ${className}`}>
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
  );
}
