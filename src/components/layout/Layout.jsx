import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HomeHeader from '../home/HomeHeader.jsx';
import BigFooter from '../home/BigFooter.jsx';
import { WORK_PATH } from '../../content/site.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Páginas ya rediseñadas con el sistema v2 (gestionan su propio espacio superior).
const V2_PAGES = ['/', '/conoceme', '/mi-oferta', '/proyectos'];

export default function Layout() {
  const { pathname } = useLocation();
  const isV2 = V2_PAGES.includes(pathname) || pathname.startsWith('/proyectos/');

  // El sistema de diseño nuevo (colores, fuentes, header y footer) aplica a todo el sitio.
  useEffect(() => {
    document.documentElement.dataset.theme = 'home';
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-geist">
      <ScrollToTop />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-paper"
      >
        Saltar al contenido
      </a>
      <HomeHeader />
      <main id="contenido" className={`flex-1 ${isV2 ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      {/* En la página del formulario solo queda el pie de página (crédito) */}
      <BigFooter compact={pathname === WORK_PATH} />
    </div>
  );
}
