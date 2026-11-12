import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import logo from '../../assets/projects/datamedy/logo.png';

/**
 * Animación de marca Datamedy (en bucle):
 * 1. Se dibuja la retícula de construcción en líneas grises.
 * 2. Aparecen dos burbujas de chat (morada y verde) que conversan: el concepto de comunicación.
 * 3. Las burbujas se transforman en los dos cuadrados del isologo, con sus líneas guía y medidas.
 * 4. El isologo escala hasta su lugar y se revela el logo completo (original de María).
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

// Burbujas de chat (en px del logo): la morada habla a la izquierda, la verde responde a la derecha
const BW = 124;
const BH = 78;
const BUBBLES = [
  { ...PURPLE, bx: 872, by: -36, tail: 'left', dot: 'rgba(255,255,255,.92)' },
  { ...GREEN, bx: 1000, by: 72, tail: 'right', dot: '#123a30' },
];

const GRID = 40;
const LINE = '#3a3c3a';
const GUIDE = '#5c5f5c';
const EASE = 'cubic-bezier(.7,0,.2,1)';

// Pasos: 0 vacío · 1 retícula · 2 chat · 3 isologo (cuadrados + guías) · 4 logo completo
const TIMELINE = [
  [0, 150],
  [1, 450],
  [2, 1500],
  [3, 1300],
  [4, 3400],
];

/** Colita de la burbuja, pegada a su esquina inferior (izquierda o derecha). */
function tailPath(b) {
  const y = b.by + BH;
  if (b.tail === 'left') {
    const x = b.bx;
    return `M${x + 16} ${y - 10} L${x + 2} ${y + 18} L${x + 40} ${y - 2} Z`;
  }
  const x = b.bx + BW;
  return `M${x - 16} ${y - 10} L${x - 2} ${y + 18} L${x - 40} ${y - 2} Z`;
}

export default function DatamedyBrand() {
  const [ref, inView] = useInView({ threshold: 0.35, once: false });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(4);
      return undefined;
    }
    let alive = true;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      while (alive) {
        for (const [s, ms] of TIMELINE) {
          if (!alive) return;
          setStep(s);
          await sleep(ms);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [inView]);

  // Transformación del grupo: grande y centrado → en su lugar dentro del logo
  const final = `translate(${LX}px, ${LY}px) scale(${K})`;
  const big = `translate(${VW / 2 - ICX * K * BIG}px, ${VH / 2 - ICY * K * BIG}px) scale(${K * BIG})`;

  // Líneas guía alineadas a los bordes de los cuadrados (en px del logo)
  const guidesX = [PURPLE.x, PURPLE.x + PURPLE.s, GREEN.x, GREEN.x + GREEN.s];
  const guidesY = [PURPLE.y, PURPLE.y + PURPLE.s, GREEN.y, GREEN.y + GREEN.s];

  const chat = step === 2;
  const legend =
    step >= 4 ? 'Logo · isologo + logotipo' : step === 3 ? 'Isologo · construcción en retícula' : step === 2 ? 'Concepto · comunicación' : 'Retícula de construcción';

  return (
    <div ref={ref} className="overflow-hidden rounded-xl bg-[#141514]">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full" aria-label="Construcción del logo de Datamedy">
        {/* 1. Retícula gris */}
        <g stroke={LINE} strokeWidth="1" style={{ opacity: step >= 1 ? 1 : 0, transition: step >= 1 ? 'opacity .45s ease' : 'none' }}>
          {Array.from({ length: VW / GRID + 1 }, (_, i) => (
            <line key={`v${i}`} x1={i * GRID} y1="0" x2={i * GRID} y2={VH} />
          ))}
          {Array.from({ length: VH / GRID + 1 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * GRID} x2={VW} y2={i * GRID} />
          ))}
        </g>

        {/* 2–4. Burbujas → isologo + guías, que se mueven juntos */}
        <g style={{ transform: step >= 4 ? final : big, transformOrigin: '0 0', transition: step >= 4 ? `transform .9s ${EASE}` : 'none' }}>
          {/* Guías de construcción */}
          <g
            stroke={GUIDE}
            strokeWidth={1 / K}
            strokeDasharray={`${4 / K} ${4 / K}`}
            style={{ opacity: step === 3 ? 1 : step === 4 ? 0.35 : 0, transition: step >= 3 ? 'opacity .6s ease .45s' : 'none' }}
          >
            {guidesX.map((x) => <line key={`gx${x}`} x1={x} y1={-60} x2={x} y2={GREEN.y + GREEN.s + 60} />)}
            {guidesY.map((y) => <line key={`gy${y}`} x1={PURPLE.x - 60} y1={y} x2={GREEN.x + GREEN.s + 60} y2={y} />)}
            <circle cx={ICX} cy={ICY} r={Math.hypot(GREEN.x + GREEN.s - ICX, GREEN.y + GREEN.s - ICY)} fill="none" />
            <line x1={PURPLE.x} y1={PURPLE.y} x2={GREEN.x + GREEN.s} y2={GREEN.y + GREEN.s} />
          </g>
          {/* Medidas */}
          <g fill="#8a8d8a" fontSize={(9 / K) * 0.6} fontFamily="Inter, sans-serif" style={{ opacity: step === 3 ? 1 : 0, transition: step === 3 ? 'opacity .5s ease .7s' : 'opacity .3s' }}>
            <text x={PURPLE.x + PURPLE.s / 2} y={-10} textAnchor="middle">1x</text>
            <text x={PURPLE.x - 12} y={PURPLE.y + PURPLE.s / 2 + 3} textAnchor="end">1x</text>
            <text x={(PURPLE.x + PURPLE.s + GREEN.x) / 2} y={GREEN.y + GREEN.s + 22} textAnchor="middle">0.13x</text>
          </g>

          {/* Burbujas de chat que se transforman en los cuadrados del isologo */}
          {BUBBLES.map((b, i) => {
            const shown = step >= 2;
            // Geometría: burbuja (paso 2) → cuadrado (paso 3+)
            const g = chat ? { x: b.bx, y: b.by, w: BW, h: BH, r: 26 } : { x: b.x, y: b.y, w: b.s, h: b.s, r: 3 };
            const delay = i * 0.35; // la verde responde después
            const morph = `x .7s ${EASE}, y .7s ${EASE}, width .7s ${EASE}, height .7s ${EASE}, rx .7s ${EASE}, ry .7s ${EASE}`;
            const cx = b.bx + BW / 2;
            const cy = b.by + BH / 2;
            return (
              <g
                key={b.c}
                style={{
                  opacity: shown ? 1 : 0,
                  transform: shown ? 'none' : 'scale(.4)',
                  transformOrigin: `${b.tail === 'left' ? b.bx : b.bx + BW}px ${b.by + BH}px`,
                  transition: chat ? `opacity .3s ease ${delay}s, transform .5s cubic-bezier(.2,.9,.25,1.25) ${delay}s` : 'none',
                }}
              >
                <path
                  d={tailPath(b)}
                  fill={b.c}
                  style={{ opacity: chat ? 1 : 0, transition: chat ? 'none' : 'opacity .2s ease' }}
                />
                <rect
                  x={g.x}
                  y={g.y}
                  width={g.w}
                  height={g.h}
                  rx={g.r}
                  fill={b.c}
                  style={{ x: `${g.x}px`, y: `${g.y}px`, width: `${g.w}px`, height: `${g.h}px`, rx: `${g.r}px`, ry: `${g.r}px`, transition: chat || step < 2 ? 'none' : morph }}
                />
                {/* Puntos de “escribiendo…” */}
                <g fill={b.dot} style={{ opacity: chat ? 1 : 0, transition: chat ? `opacity .2s ease ${delay + 0.2}s` : 'opacity .15s ease' }}>
                  {[-20, 0, 20].map((dx, k) => (
                    <circle
                      key={dx}
                      cx={cx + dx}
                      cy={cy}
                      r="6"
                      style={{ animation: chat ? `dm-typing 1s ease-in-out ${delay + k * 0.15}s infinite` : 'none', transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  ))}
                </g>
              </g>
            );
          })}
        </g>

        {/* Logo completo (original), que se revela al llegar el isologo */}
        <image
          href={logo}
          x={LX}
          y={LY}
          width={LOGO_W * K}
          height={LOGO_H * K}
          style={{
            opacity: step >= 4 ? 1 : 0,
            transform: step >= 4 ? 'none' : 'scale(.97)',
            transformOrigin: '50% 50%',
            transformBox: 'fill-box',
            transition: step >= 4 ? 'opacity .6s ease .45s, transform .8s cubic-bezier(.2,.7,.2,1) .45s' : 'none',
          }}
        />

        {/* Leyenda */}
        <text x="40" y={VH - 30} fill="#8a8d8a" fontSize="14" fontFamily="Inter, sans-serif" style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity .5s' }}>
          {legend}
        </text>
      </svg>
    </div>
  );
}
