import { Fragment } from 'react';
import Reveal from '../ui/Reveal.jsx';
import { MacWindow } from './devices.jsx';

/**
 * Vistas web estáticas en ventana de Mac sin bordes (barra con los tres botones),
 * cada una sobre su fondo gris tipo estudio, en cuadrícula de 2 en 2.
 * `inserts`: { índice: nodo } agrega un bloque a todo el ancho después de esa imagen (recorridos responsivos).
 */
export default function MacGallery({ images, inserts = {}, children }) {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-5 sm:mt-32 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {images.map((img, i) => (
          <Fragment key={img.alt}>
            <Reveal delay={(i % 2) * 100}>
              <div className="grid place-items-center rounded-xl px-[9%] py-[12%]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
                <div className="w-full">
                  <MacWindow>
                    <img src={img.src} alt={img.alt} loading="lazy" className="h-full w-full object-cover object-top" />
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
