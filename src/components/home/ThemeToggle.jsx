import { useEffect, useState } from 'react';

/** Lee/aplica el modo (claro u oscuro). El modo inicial lo fija index.html antes de pintar. */
function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  // Si la persona no ha elegido, seguimos al sistema cuando cambie.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      try {
        if (localStorage.getItem('theme')) return;
      } catch {
        /* sin almacenamiento disponible: seguimos al sistema */
      }
      document.documentElement.classList.toggle('dark', e.matches);
      setDark(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');
    const apply = () => {
      root.classList.toggle('dark', next);
      setDark(next);
    };
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* sin almacenamiento: el cambio aplica igual en esta visita */
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      apply(); // cambio instantáneo, sin movimiento
      return;
    }
    if (document.startViewTransition) {
      // Desvanecimiento suave de toda la página: el modo anterior se funde en el nuevo.
      let applied = false;
      const run = () => {
        if (applied) return;
        applied = true;
        apply();
      };
      const transition = document.startViewTransition(run);
      // Salvaguarda: si el navegador no llega a pintar (pestaña en segundo plano), aplicar igual.
      window.setTimeout(() => {
        if (!applied) {
          transition.skipTransition?.();
          run();
        }
      }, 1000);
      return;
    }
    // Navegadores sin View Transitions: fundido de colores elemento a elemento.
    root.classList.add('theme-transition');
    apply();
    window.setTimeout(() => root.classList.remove('theme-transition'), 700);
  };

  return [dark, toggle];
}

/**
 * Botón sol/luna. Accesible: nombre que dice la acción, estado con aria-pressed,
 * foco visible y área táctil de 40 px.
 */
export default function ThemeToggle({ onDark = false, className = '' }) {
  const [dark, toggle] = useTheme();
  const label = dark ? 'Activar modo claro' : 'Activar modo oscuro';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
      title={label}
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        onDark
          ? 'border-white/20 text-snow hover:bg-white/10 focus-visible:outline-snow'
          : 'border-paper-line bg-paper/80 text-night hover:bg-paper-soft focus-visible:outline-night'
      } ${className}`}
    >
      {/* Sol (visible en modo oscuro: lleva a claro) */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-out motion-reduce:transition-none ${
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      {/* Luna (visible en modo claro: lleva a oscuro) */}
      <svg
        viewBox="0 0 24 24"
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-out motion-reduce:transition-none ${
          dark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
