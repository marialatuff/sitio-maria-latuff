import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HOME_NAV } from '../../content/site.js';
import HomeButton from './HomeButton.jsx';
import { LogoMark } from './Signature.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { DARK_ONLY } from '../../config.js';
import MobileMenu from './MobileMenu.jsx';

/**
 * Header: transparente y con desenfoque progresivo al hacer scroll.
 * Incluye el cambio de modo claro/oscuro (sol/luna).
 */
export default function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  const closeMenu = useCallback(() => setOpen(false), []);

  // Sobre el footer (siempre oscuro) el header usa colores claros fijos para mantener el contraste.
  // Igual sobre el bloque violeta de la página Soluciones.
  const [overFooter, setOverFooter] = useState(false);
  const [overViolet, setOverViolet] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const footer = document.getElementById('home-footer');
      setOverFooter(!!footer && footer.getBoundingClientRect().top < 96);
      const violet = document.getElementById('violet-hero');
      setOverViolet(!!violet && violet.getBoundingClientRect().bottom > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onViolet = overViolet && !overFooter && !open;
  const onDark = (overFooter || overViolet) && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50 font-geist">
      {/* Capa de desenfoque: más intensa arriba y se desvanece hacia abajo */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-500 ${
          scrolled || open ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: onViolet
            ? 'linear-gradient(to bottom, rgb(126 110 135 / 0.85), rgb(126 110 135 / 0))'
            : onDark
            ? 'linear-gradient(to bottom, rgb(15 15 15 / 0.85), rgb(15 15 15 / 0))'
            : 'linear-gradient(to bottom, rgb(var(--c-paper) / 0.85), rgb(var(--c-paper) / 0))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(to bottom, black 45%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 45%, transparent)',
        }}
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          to="/"
          className={`transition-colors duration-300 ${onDark ? 'text-snow' : 'text-night'}`}
          aria-label="Inicio"
        >
          <LogoMark />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {HOME_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  onDark
                    ? isActive
                      ? 'text-snow'
                      : onViolet
                        ? 'text-snow/75 hover:text-snow' // sobre el violeta, el hover violeta no se vería
                        : 'text-snow/70 hover:text-hover'
                    : isActive
                      ? 'text-night'
                      : 'text-graphite-soft hover:text-hover'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Botón sol/luna oculto mientras el sitio es solo oscuro (ver src/config.js) */}
          {!DARK_ONLY && <ThemeToggle onDark={onDark} />}
          <div className="hidden md:block">
            <HomeButton variant={onDark ? 'light' : 'dark'} />
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-paper-line bg-paper/80 md:hidden"
            aria-expanded={open}
            aria-controls="home-mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 top-0 h-px w-4 bg-night transition-transform duration-300 ${
                  open ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-4 bg-night transition-transform duration-300 ${
                  open ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={closeMenu} />
    </header>
  );
}
