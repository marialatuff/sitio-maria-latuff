import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import logo from '../../assets/projects/datamedy/logo.png';

/**
 * Animación de marca Datamedy (en bucle):
 * 1. Se dibuja la retícula de construcción en líneas grises.
 * 2. Aparece el isologo (los dos cuadrados) en grande, con sus líneas guía y medidas.
 * 3. El isologo escala hasta su lugar y se revela el logo completo (original de María).
 */

const VW = 1200;
const VH = 560;
// Logo original: 1066 × 308. Cuadrados dentro del logo (en px del archivo)
const LOGO_W = 1066;
const LOGO_H = 308;
const PURPLE = { x: 951, y: 0, s: 54, c: '#836fff' };
const GREEN = { x: 1012, y: 64, s: 54, c: '#79d7be' };
const K = 780 / LOGO_W; // escala final del logo en el lienzo
const LX = (VW - LOGO_W * K) / 2;
const LY = (VH - LOGO_H * K) / 2 + 10;
// Centro del isologo (en px del logo) y escala inicial en grande
const ICX = (PURPLE.x + GREEN.x + GREEN.s) / 2;
const ICY = (PURPLE.y + GREEN.y + GREEN.s) / 2;
const BIG = 2.4;

const GRID = 40;
const LINE = '#3a3c3a';
const GUIDE = '#5c5f5c';

export default function DatamedyBrand() {
  const [ref, inView] = useInView({ threshold: 0.35, once: false });
  const [step, setStep] = useState(0); // 0 vacío · 1 retícula · 2 isologo grande · 3 logo completo

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(3);
      return undefined;
    }
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (alive) {
        setStep(0);
        await sleep(150);
        if (alive) setStep(1);
        await sleep(550);
        if (alive) setStep(2);
        await sleep(1300);
        if (alive) setStep(3);
        await sleep(3400);
      }
    })();
    return () => {
      alive = false;
    };
  }, [inView]);

  // Transformación del isologo: grande y centrado → en su lugar dentro del logo
  const final = `translate(${LX}px, ${LY}px) scale(${K})`;
  const big = `translate(${VW / 2 - ICX * K * BIG}px, ${VH / 2 - ICY * K * BIG}px) scale(${K * BIG})`;
  const ease = 'cubic-bezier(.7,0,.2,1)';

  // Líneas guía alineadas a los bordes de los cuadrados (en px del logo)
  const guidesX = [PURPLE.x, PURPLE.x + PURPLE.s, GREEN.x, GREEN.x + GREEN.s];
  const guidesY = [PURPLE.y, PURPLE.y + PURPLE.s, GREEN.y, GREEN.y + GREEN.s];

  return (
    <div ref={ref} className="overflow-hidden rounded-xl bg-[#141514]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full" aria-label="Construcción del logo de Datamedy">
        {/* 1. Retícula gris */}
        <g stroke={LINE} strokeWidth="1" style={{ opacity: step >= 1 ? 1 : 0, transition: step >= 1 ? 'opacity .45s ease' : 'none' }}>
          {Array.from({ length: VW / GRID + 1 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * GRID}
              y1="0"
              x2={i * GRID}
              y2={VH}
            />
          ))}
          {Array.from({ length: VH / GRID + 1 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * GRID}
              x2={VW}
              y2={i * GRID}
            />
          ))}
        </g>

        {/* 2–3. Isologo + guías, que se mueven juntos */}
        <g style={{ transform: step >= 3 ? final : big, transformOrigin: '0 0', transition: step >= 3 ? `transform .9s ${ease}` : 'none' }}>
          {/* Guías de construcción */}
          <g stroke={GUIDE} strokeWidth={1 / K} strokeDasharray={`${4 / K} ${4 / K}`} style={{ opacity: step === 2 ? 1 : step === 3 ? 0.35 : 0, transition: 'opacity .6s ease .2s' }}>
            {guidesX.map((x) => <line key={`gx${x}`} x1={x} y1={-60} x2={x} y2={GREEN.y + GREEN.s + 60} />)}
            {guidesY.map((y) => <line key={`gy${y}`} x1={PURPLE.x - 60} y1={y} x2={GREEN.x + GREEN.s + 60} y2={y} />)}
            <circle cx={ICX} cy={ICY} r={Math.hypot(GREEN.x + GREEN.s - ICX, GREEN.y + GREEN.s - ICY)} fill="none" />
            <line x1={PURPLE.x} y1={PURPLE.y} x2={GREEN.x + GREEN.s} y2={GREEN.y + GREEN.s} />
          </g>
          {/* Medidas */}
          <g fill="#8a8d8a" fontSize={9 / K * 0.6} fontFamily="Inter, sans-serif" style={{ opacity: step === 2 ? 1 : 0, transition: 'opacity .5s ease .5s' }}>
            <text x={PURPLE.x + PURPLE.s / 2} y={-10} textAnchor="middle">1x</text>
            <text x={PURPLE.x - 12} y={PURPLE.y + PURPLE.s / 2 + 3} textAnchor="end">1x</text>
            <text x={(PURPLE.x + PURPLE.s + GREEN.x) / 2} y={GREEN.y + GREEN.s + 22} textAnchor="middle">0.13x</text>
          </g>
          {/* Cuadrados del isologo */}
          {[PURPLE, GREEN].map((q, i) => (
            <rect
              key={q.c}
              x={q.x}
              y={q.y}
              width={q.s}
              height={q.s}
              rx={3}
              fill={q.c}
              style={{ opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? 'none' : 'scale(.6)', transformOrigin: `${q.x + q.s / 2}px ${q.y + q.s / 2}px`, transformBox: 'view-box', transition: step >= 2 ? `opacity .4s ease ${i * 0.15}s, transform .6s cubic-bezier(.2,.8,.2,1.2) ${i * 0.15}s` : 'none' }}
            />
          ))}
        </g>

        {/* Logo completo (original), que se revela de izquierda a derecha al llegar el isologo */}
        <image
          href={logo}
          x={LX}
          y={LY}
          width={LOGO_W * K}
          height={LOGO_H * K}
          style={{ opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? 'none' : 'scale(.97)', transformOrigin: '50% 50%', transformBox: 'fill-box', transition: step >= 3 ? 'opacity .6s ease .45s, transform .8s cubic-bezier(.2,.7,.2,1) .45s' : 'none' }}
        />

        {/* Leyenda */}
        <text x="40" y={VH - 30} fill="#8a8d8a" fontSize="14" fontFamily="Inter, sans-serif" style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity .5s' }}>
          {step >= 3 ? 'Logo · isologo + logotipo' : step === 2 ? 'Isologo · construcción en retícula' : 'Retícula de construcción'}
        </text>
      </svg>
    </div>
  );
}
