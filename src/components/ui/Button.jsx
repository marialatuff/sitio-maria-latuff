import { Link } from 'react-router-dom';
import { CTA_LABEL, FORM_URL } from '../../content/site.js';

const base =
  'group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-out focus-visible:outline-offset-4';

const variants = {
  // Cara elevada gris; al hover se "enciende" el borde ámbar
  raised: 'bg-surface-raised text-ink shadow-raised hover:-translate-y-0.5 hover:shadow-glow',
  // Relleno en tinta para máxima jerarquía
  ink: 'bg-ink text-surface-highlight shadow-raised hover:-translate-y-0.5 hover:shadow-glow',
  ghost: 'text-ink hover:bg-surface-raised/60',
};

function GlowDot() {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-2 w-2 shrink-0 rounded-full bg-glow shadow-[0_0_10px_2px_rgb(var(--accent-glow)/0.8)] transition-transform duration-300 group-hover:scale-125"
    />
  );
}

/** Botón genérico: `to` (ruta interna), `href` (externo) o `<button>`. */
export default function Button({ to, href, variant = 'raised', dot = true, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {dot && <GlowDot />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {content}
    </button>
  );
}

/** CTA principal: siempre lleva al Google Form. */
export function FormCta({ label = CTA_LABEL, variant = 'ink', className = '' }) {
  return (
    <Button href={FORM_URL} variant={variant} className={className}>
      {label}
    </Button>
  );
}
