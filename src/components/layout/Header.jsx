import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV } from '../../content/site.js';
import { FormCta } from '../ui/Button.jsx';

function navClass({ isActive }) {
  return `relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
    isActive ? 'bg-surface-highlight text-ink shadow-glow' : 'text-ink-soft hover:text-ink'
  }`;
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={`container-site flex items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 transition-all duration-300 sm:pl-6 ${
          scrolled || open ? 'bg-surface-raised/85 shadow-raised backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight">
          <span
            aria-hidden="true"
            className="h-3 w-3 rounded-full bg-surface-highlight shadow-[inset_0_-2px_0_rgb(var(--accent-glow)),0_2px_8px_rgb(var(--accent-glow-deep)/0.8)]"
          />
          María Latuff
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <FormCta className="!px-5 !py-2.5" />
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full bg-surface-raised shadow-raised lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? 'translate-y-[5.25px] rotate-45' : ''
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                open ? '-translate-y-[5.25px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-3 top-[4.75rem] origin-top rounded-card bg-surface-raised p-4 shadow-raised transition-all duration-300 lg:hidden ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
      >
        <nav aria-label="Móvil" className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-soft px-4 py-3.5 text-lg font-light ${isActive ? 'bg-surface-highlight shadow-glow' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <FormCta className="mt-4 w-full" />
      </div>
    </header>
  );
}
