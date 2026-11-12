import { Fragment } from 'react';
import Reveal from '../ui/Reveal.jsx';
import { MacWindow } from './devices.jsx';

/**
 * Vistas web estáticas en ventana de Mac sin bordes (barra con los tres botones),
 * cada una sobre su fondo gris tipo estudio, en cuadrícula de 2 en 2.
 * `inserts`: { índice: nodo } agrega un bloque a todo el ancho después de esa imagen (recorridos responsivos).
 * Imagen con `wide`: ocupa las dos columnas. Con `shift` (p. ej. '-71.8%'): pantalla larga que se desplaza sola dentro de la ventana.
 */
export default function MacGallery({ images, inserts = {}, children, title, ratio, className = 'mt-24 sm:mt-32' }) {
  return (
    <section className={`mx-auto max-w-6xl px-5 sm:px-8 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {images.map((img, i) => (
          <Fragment key={img.alt}>
            <Reveal delay={(i % 2) * 100} className={img.wide ? 'sm:col-span-2' : ''}>
              <div className={`grid place-items-center rounded-xl ${img.wide ? 'px-[6%] py-[6%] sm:px-[16%]' : 'px-[9%] py-[12%]'}`} style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
                <div className="w-full">
                  <MacWindow {...(title ? { title } : {})} {...(ratio ? { ratio } : {})}>
                    {img.shift ? (
                      <img src={img.src} alt={img.alt} loading="lazy" className="block w-full" style={{ '--mac-shift': img.shift, animation: 'mac-scroll 16s ease-in-out infinite' }} />
                    ) : (
                      <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover object-top" />
                    )}
                  </MacWindow>
                </div>
              </div>
              <p className="mt-3 font-geist text-sm text-graphite-soft">{img.alt}</p>
            </Reveal>
            {inserts[i] && <div className="sm:col-span-2">{inserts[i]}</div>}
          </Fragment>
        ))}
        {children && <div className="sm:col-span-2">{children}</div>}
      </div>
    </section>
  );
}
