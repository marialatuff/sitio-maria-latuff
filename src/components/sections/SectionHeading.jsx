import Reveal from '../ui/Reveal.jsx';

export default function SectionHeading({ title, subtitle, align = 'left', className = '' }) {
  return (
    <Reveal className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <h2 className="h-section text-balance">{title}</h2>
      {subtitle && <p className="mt-5 text-base leading-[1.75] text-ink-soft sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}
