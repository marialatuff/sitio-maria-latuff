import { useEffect, useState } from 'react';
import blooFondo from '../../assets/projects/bloo/portada-fondo.jpg';
import { MacWindow } from './devices.jsx';
import { ModalDetalle, Scaled, WebScreen } from './ApprovalFlow.jsx';

/**
 * Portada del proyecto Bloo (video corto en bucle):
 * 1. Primero aparece sola la modal "Detalle de solicitud" sobre la luz azul y se completa la observación.
 * 2. La cámara se aleja: la modal retrocede a su lugar dentro de la vista web completa (ventana de Mac),
 *    que aparece detrás con el módulo Aprobación de gastos mayores.
 */

const W = 1200;
const H = 750;
const OBS = 'Aprobado según PME 2024.';
const ZOOM = 1.5; // acercamiento inicial sobre la modal

export default function BlooCover() {
  const [step, setStep] = useState(0); // 0 = modal sola · 1 = vista web completa
  const [obs, setObs] = useState('');
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(1);
      setObs(OBS);
      return undefined;
    }
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (alive) {
        setStep(0);
        setObs('');
        setFade(false);
        await sleep(900);
        // Se completa la observación dentro de la modal
        for (let i = 1; i <= OBS.length && alive; i += 1) {
          setObs(OBS.slice(0, i));
          await sleep(55);
        }
        await sleep(900);
        // Transición: de la modal (adelante) a la vista web completa (atrás)
        if (alive) setStep(1);
        await sleep(4200);
        // Fundido corto para volver a empezar
        if (alive) setFade(true);
        await sleep(450);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const ease = 'cubic-bezier(.7,0,.2,1)';

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#00071c]">
      <img src={blooFondo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0" style={{ opacity: fade ? 0 : 1, transition: `opacity ${fade ? 0.4 : 0.5}s ease` }}>
        {/* Ventana de Mac con la vista web; empieza muy cerca de la modal y se aleja */}
        <div
          className="absolute left-1/2 top-[13%] w-[72%] -translate-x-1/2"
          style={{ transform: `translateX(-50%) scale(${step ? 1 : ZOOM})`, transformOrigin: '50% 53%', transition: fade ? 'none' : `transform 1.7s ${ease}` }}
        >
          <MacWindow title="Bloo · Aprobación de gastos mayores">
            <Scaled w={W} h={H}>
              <WebScreen ui={{ modal: null, approved: false, obs: '' }} />
              {/* Capa que oculta la vista web al inicio (solo se ve la modal) y luego oscurece como un modal real */}
              <div className="absolute inset-0" style={{ background: 'rgba(31,42,68,.32)' }} />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(70% 60% at 50% 55%, #0b45d8, #031a55 70%, #01082a)',
                  opacity: step ? 0 : 1,
                  transition: fade ? 'none' : `opacity 1.3s ${ease} .2s`,
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div style={{ transform: `scale(${step ? 1 : 0.92})`, transition: fade ? 'none' : `transform 1.7s ${ease}`, boxShadow: step ? '0 30px 60px -20px rgba(31,42,68,.45)' : '0 40px 90px -20px rgba(0,0,0,.65)' }} className="rounded-2xl">
                  <ModalDetalle obs={obs} />
                </div>
              </div>
            </Scaled>
          </MacWindow>
        </div>
      </div>
    </div>
  );
}
