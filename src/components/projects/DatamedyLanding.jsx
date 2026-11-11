import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import landing from '../../assets/projects/datamedy/landing.jpg';
import landingMobile from '../../assets/projects/datamedy/landing-mobile.jpg';
import { MacWindow, PhoneFrame, PHONE_H, PHONE_W } from './devices.jsx';

/**
 * Video de la landing de Datamedy (en bucle, una sola vista):
 * 1. La landing en web se recorre con scroll, deteniéndose en cada sección.
 * 2. La ventana web se transforma en un iPhone y la landing sigue en su versión móvil.
 * Imagen de la landing: diseño de María (Landing Datamedy 2025).
 */

const IMG_RATIO = 2000 / 480; // alto / ancho de la imagen de la landing web
const MOBILE_RATIO = 2000 / 100; // alto / ancho de la landing móvil
const STOPS = [0, 0.14, 0.3, 0.46, 0.6, 0.76, 1]; // paradas del scroll (secciones), 0 = arriba, 1 = final
const WEB_STOPS = [2, 4, 6]; // en web se recorre en 3 saltos, más rápido
const PHASES = ['Landing web: recorrido por las secciones', 'Transformación a la versión móvil', 'Landing móvil'];

function useWidth(ref) {
  const [w, setW] = useState(600);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export default function DatamedyLanding() {
  const [ref, inView] = useInView({ threshold: 0.3, once: false });
  const webRef = useRef(null);
  const phoneRef = useRef(null);
  const webW = useWidth(webRef);
  const phoneW = useWidth(phoneRef);
  const [ui, setUi] = useState({ mode: 'web', stop: 0, mstop: 0, phase: 0 });

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const set = (p) => alive && setUi((u) => ({ ...u, ...p }));
    (async () => {
      while (alive) {
        set({ mode: 'web', stop: 0, mstop: 0, phase: 0 });
        await sleep(700);
        // Scroll por las secciones en web (ágil, para llegar pronto a la versión móvil)
        for (const i of WEB_STOPS) {
          if (!alive) break;
          set({ stop: i });
          await sleep(850);
        }
        await sleep(250);
        // La ventana se transforma en iPhone
        set({ mode: 'phone', phase: 1, mstop: 0 });
        await sleep(1600);
        set({ phase: 2 });
        for (let i = 1; i < STOPS.length && alive; i += 2) {
          set({ mstop: i });
          await sleep(1300);
        }
        set({ mstop: STOPS.length - 1 });
        await sleep(1600);
      }
    })();
    return () => {
      alive = false;
    };
  }, [inView]);

  const ease = 'cubic-bezier(.7,0,.2,1)';
  // Desplazamiento en px de la imagen dentro de cada pantalla
  const webViewH = webW * (10 / 16);
  const webShift = (webW * IMG_RATIO - webViewH) * STOPS[ui.stop];
  // En móvil se usa el diseño de la landing móvil, a lo ancho del teléfono
  const mobileViewH = phoneW * (PHONE_H / PHONE_W);
  const mobileShift = (phoneW * MOBILE_RATIO - mobileViewH) * STOPS[ui.mstop];
  const isPhone = ui.mode === 'phone';

  return (
    <div ref={ref}>
      <div className="relative overflow-hidden rounded-xl px-[6%] py-[6%]" style={{ background: 'radial-gradient(120% 90% at 50% 20%, #e6e6e8, #cfcfd2 70%, #c4c4c8)' }}>
        <div className="relative mx-auto" style={{ aspectRatio: '16 / 10.6' }}>
          {/* Web: ventana de Mac que se encoge y desaparece al convertirse en móvil */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              transform: isPhone ? 'scale(.32)' : 'none',
              opacity: isPhone ? 0 : 1,
              transformOrigin: '50% 40%',
              transition: `transform 1.3s ${ease}, opacity .5s ease ${isPhone ? '.8s' : '0s'}`,
            }}
          >
            <MacWindow title="datamedy.cl">
              <div ref={webRef} className="absolute inset-0 overflow-hidden">
                <img src={landing} alt="" className="block w-full" style={{ transform: `translateY(${-webShift}px)`, transition: `transform .8s ${ease}` }} />
              </div>
            </MacWindow>
          </div>
          {/* Móvil: iPhone que aparece desde la ventana */}
          <div
            className="absolute left-1/2 top-0 w-[26%]"
            style={{
              transform: `translateX(-50%) scale(${isPhone ? 1 : 1.9})`,
              opacity: isPhone ? 1 : 0,
              transformOrigin: '50% 30%',
              transition: `transform 1.3s ${ease}, opacity .6s ease ${isPhone ? '.4s' : '0s'}`,
            }}
          >
            <PhoneFrame color="white">
              <div ref={phoneRef} className="absolute inset-0 overflow-hidden bg-[#f7f8fc]">
                <img src={landingMobile} alt="" className="block w-full" style={{ transform: `translateY(${-mobileShift}px)`, transition: `transform 1.1s ${ease}` }} />
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-geist text-sm">
        <span className="flex gap-1.5" aria-hidden="true">
          {PHASES.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === ui.phase ? 'w-6 bg-[#ded0e8]' : 'w-1.5 bg-paper-line'}`} />
          ))}
        </span>
        <span className="text-graphite-soft">
          <span className="text-night">Landing Datamedy:</span> {PHASES[ui.phase]}
        </span>
      </div>
      <p className="sr-only">Video de la landing de Datamedy: recorrido con scroll por sus secciones en web y transformación a la versión móvil.</p>
    </div>
  );
}
