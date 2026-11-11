/**
 * Elemento firma del sistema: disco gris elevado dentro de un halo cálido,
 * con el canto inferior iluminado en ámbar. `progress` (0–1) dibuja el anillo activo.
 */
export default function Dial({ value, suffix, progress = null, size = 'lg', className = '' }) {
  const sizes = {
    sm: 'h-28 w-28 text-3xl',
    md: 'h-44 w-44 text-5xl',
    lg: 'h-40 w-40 text-5xl sm:h-64 sm:w-64 sm:text-numeral lg:h-72 lg:w-72',
  };
  const r = 47;
  const c = 2 * Math.PI * r;

  return (
    <div className={`relative grid place-items-center ${className}`} aria-hidden="true">
      {/* halo */}
      <div className="absolute inset-[-14%] rounded-full bg-surface-halo/40 blur-[2px]" />
      <div className="absolute inset-[-14%] animate-breathe rounded-full shadow-[0_0_60px_10px_rgb(var(--accent-glow)/0.25)]" />

      <div
        className={`relative grid place-items-center rounded-full bg-surface-raised font-light text-ink ${sizes[size]}`}
        style={{
          boxShadow:
            'inset 0 2px 0 rgb(var(--surface-highlight)), inset 0 -3px 0 rgb(var(--accent-glow)), 0 10px 30px -8px rgb(var(--accent-glow-deep) / 0.8), 0 30px 60px -30px rgb(0 0 0 / 0.35)',
        }}
      >
        {progress !== null && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(var(--surface-highlight))" strokeWidth="1.5" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="rgb(var(--accent-glow))"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2,0.7,0.2,1)' }}
            />
          </svg>
        )}
        {value !== undefined && (
          <span className="relative leading-none tabular-nums">
            {value}
            {suffix && <sup className="ml-1 align-top text-[0.3em] text-ink-soft">{suffix}</sup>}
          </span>
        )}
      </div>
    </div>
  );
}
