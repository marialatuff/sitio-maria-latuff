import { Link } from 'react-router-dom';
import { HOME_CTA, WORK_PATH } from '../../content/site.js';

const variants = {
  // máximo contraste: negro en modo claro, claro en modo oscuro
  // (en modo oscuro todos los hover pasan al acento #7e6e87)
  dark: 'bg-night text-paper hover:bg-hover-solid hover:text-hover-ink',
  // fijo claro, para usar sobre fondos siempre oscuros (footer)
  light: 'bg-snow text-coal hover:bg-hover-light hover:text-hover-light-ink',
  // CTAs dentro de la página: gris → negro al pasar el cursor, con una luz suave E6E2DA
  soft: 'btn-soft bg-paper-line text-graphite hover:bg-hover hover:text-hover-ink hover:shadow-[0_0_0_4px_rgb(var(--c-hover-glow)/var(--c-hover-glow-a)),0_10px_28px_-4px_rgb(var(--c-hover-glow)/var(--c-hover-glow-a))] focus-visible:bg-hover focus-visible:text-hover-ink',
};

/**
 * Botón píldora del sistema Home v2. Por defecto lleva a la página del formulario.
 * Las rutas internas ("/...") navegan dentro del sitio; los enlaces externos abren otra pestaña.
 */
export default function HomeButton({ label = HOME_CTA, href = WORK_PATH, variant = 'dark', className = '' }) {
  const cls = `group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-geist text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${variants[variant]} ${className}`;
  const inner = (
    <>
      {label}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  if (href.startsWith('/')) {
    return (
      <Link to={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}
