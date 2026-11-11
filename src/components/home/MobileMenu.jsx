import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { HOME_NAV } from '../../content/site.js';
import HomeButton from './HomeButton.jsx';

/* Iconos de línea, uno por página (mismo trazo que el resto del sitio) */
const ICONS = {
  // Home: casa
  '/': (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  // Conóceme: dos manos que se toman
  '/conoceme': (
    <>
      <path d="M2.5 12.5 6 9l3 1.2 2.5-1.7a2 2 0 0 1 2.3 0l1.9 1.3" />
      <path d="M21.5 12.5 18 9l-2.2.8" />
      <path d="m6 15 3.2 3a1.6 1.6 0 0 0 2.2 0l5.1-4.8a1.5 1.5 0 0 0-2-2.2l-2.6 2.3" />
      <path d="m8.3 16.2 1.6-1.5M10.2 17.8l1.5-1.4" />
      <path d="M2.5 12.5 6 15M21.5 12.5 18 15.5" />
    </>
  ),
  // Soluciones: trofeo
  '/mi-oferta': (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
      <path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.6M16 6h2.5a2.5 2.5 0 0 1-2.6 3.6" />
      <path d="M12 13v3.5M9 20h6M10 16.5h4l.6 3.5H9.4Z" />
    </>
  ),
  // Proyectos: tarjetas apiladas
  '/proyectos': (
    <>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M7 4.5h10M8.5 11h7M8.5 14.5h4.5" />
    </>
  ),
};

/**
 * Menú móvil: panel que sube desde abajo, con fondo oscurecido.
 * Accesible: diálogo modal, se cierra con Escape, tocando fuera o al navegar,
 * y el foco va al primer enlace al abrirse.
 */
export default function MobileMenu({ open, onClose }) {
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => firstLinkRef.current?.focus(), 250);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden" aria-hidden={!open}>
      {/* Fondo oscurecido */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel que sube desde abajo */}
      <div
        id="home-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className={`fixed inset-x-0 bottom-0 rounded-t-[1.75rem] border-t border-paper-line bg-paper px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_50px_-20px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
          open ? 'visible translate-y-0' : 'invisible translate-y-full'
        }`}
      >
        {/* Asa del panel y botón de cerrar */}
        <div className="relative mb-4 flex items-center justify-center">
          <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-paper-line" />
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? undefined : -1}
            aria-label="Cerrar menú"
            className="absolute right-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-graphite-soft transition-colors hover:bg-paper-soft hover:text-night"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l10 10M15 5 5 15" />
            </svg>
          </button>
        </div>

        <nav aria-label="Móvil" className="flex flex-col">
          {HOME_NAV.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              ref={i === 0 ? firstLinkRef : undefined}
              tabIndex={open ? undefined : -1}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 py-3.5 font-geist text-2xl transition-all duration-500 ${
                  isActive ? 'bg-paper-soft text-night' : 'text-graphite hover:bg-paper-soft'
                } ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`
              }
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : '0ms' }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-paper-line text-night">
                <svg
                  viewBox="0 0 24 24"
                  className="h-[22px] w-[22px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[item.to]}
                </svg>
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <HomeButton className="mt-5 w-full justify-center py-3.5 text-base" />
      </div>
    </div>
  );
}
