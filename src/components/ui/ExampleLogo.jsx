/** Logo de ejemplo (se sustituye por el logo real de cada empresa). */
const MARKS = [
  <g key="a"><circle cx="9" cy="9" r="7" /><circle cx="9" cy="9" r="3" /></g>,
  <g key="b"><rect x="2" y="2" width="14" height="14" rx="4" /><path d="M6 12 12 6" /></g>,
  <g key="c"><path d="M2 14 9 3l7 11Z" /><path d="M6 10h6" /></g>,
  <g key="d"><circle cx="6" cy="9" r="4.5" /><circle cx="12" cy="9" r="4.5" /></g>,
];

export default function ExampleLogo({ variant = 0, src, name = 'Logo de ejemplo', className = '' }) {
  if (src) return <img src={src} alt={name} className={`h-5 w-auto object-contain ${className}`} />;
  return (
    <span className={`inline-flex items-center gap-1.5 text-graphite-soft ${className}`} aria-label={name}>
      <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {MARKS[variant % MARKS.length]}
      </svg>
      <span className="font-geist text-[0.8rem] font-semibold tracking-tight">logo</span>
    </span>
  );
}
