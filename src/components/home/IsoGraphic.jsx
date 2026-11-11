import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView.js';
import { makeIso, person, star, woman } from './iso.js';

const g = makeIso(150, 175, 1);

/* ---------- Colaboración por proyecto ---------- */
// Solo geometría isométrica, en el mismo estilo que el loop:
// 1. Escucha activa → 2. Reunión de equipo → 3. Diseño web → 4. Lanzamiento → 5. Medición exitosa.
const S = Math.SQRT1_2;

// 1. Escucha activa de la solicitud: un punto que emite y recibe ondas.
const listening = [
  g.ring(14, 0),
  g.ring(14, 30),
  g.line([14 * S, -14 * S, 0], [14 * S, -14 * S, 30]),
  g.line([-14 * S, 14 * S, 0], [-14 * S, 14 * S, 30]),
  g.ring(44, 15),
  g.ring(72, 15),
  g.ring(100, 15),
];

// 2. Reunión de equipo: mesa redonda con cuatro bloques conectados al centro.
const seats = [[84, 0], [-84, 0], [0, 84], [0, -84]];
const meeting = [
  g.ring(44, 0),
  g.ring(44, 10),
  ...seats.flatMap(([x, y]) => g.slab(13, 0, 26, x, y)),
  ...seats.map(([x, y]) => g.line([x * 0.84, y * 0.84, 26], [0, 0, 10])),
  g.ring(5, 10),
];

// 3. Diseño de la solución web: pantalla con su estructura sobre una rejilla.
const webPanel = (z0, w = 120, h = 92) =>
  g.panel(-w / 2, 0, w, h, {
    z0,
    blocks: [[10, h * 0.45, w * 0.46, h * 0.82], [10, 10, w - 10, h * 0.32]],
    lines: [[w * 0.56, w - 10, h * 0.76], [w * 0.56, w - 22, h * 0.66], [w * 0.56, w - 10, h * 0.56]],
  });
const designing = [...g.grid(78, 3), ...webPanel(0)];

// 4. Lanzamiento: la pantalla se eleva sobre su plataforma, con estela y flecha.
const launching = [
  ...g.slab(70, 0, 10),
  ...webPanel(42, 104, 70),
  g.line([-30, 0, 14], [-30, 0, 36]),
  g.line([0, 0, 12], [0, 0, 38]),
  g.line([30, 0, 14], [30, 0, 36]),
  g.line([0, 0, 120], [0, 0, 150]),
  g.line([0, 0, 150], [-7, 7, 140]),
  g.line([0, 0, 150], [7, -7, 140]),
];

// 5. Medición de resultados exitosa: barras crecientes, tendencia y estrella.
const bars = [[-54, 28], [-18, 52], [18, 78], [54, 106]];
const [sx, sy] = g.proj(54, 22, 106);
const measuring = [
  ...g.grid(78, 3),
  ...bars.flatMap(([x, h]) => g.slab(12, 0, h, x, 22)),
  g.poly(bars.map(([x, h]) => [x, 22, h + 12]), false),
  star(sx, sy - 40, 13),
];

/* ---------- Loop de trabajo flexible ---------- */
const loopSteps = [
  [...g.slab(70, 0, 10), g.ring(8, 10)],
  [...g.slab(70, 0, 10), ...g.slab(55, 36, 10), ...g.slab(40, 72, 10), g.line([0, 0, 10], [0, 0, 72])],
  [...g.slab(30, 0, 8), g.ring(62, 82), g.vring(62, 82, 'xz'), g.vring(62, 82, 'yz'), g.ring(44, 124), g.ring(44, 40)],
];

/* ---------- Pilares (Conóceme) ---------- */
const gp = makeIso(150, 190, 1);

// 1. Investigación empírica: rejilla de datos → lupa → tendencia
const dataPts = [[-60, 40], [-20, 60], [20, -10], [50, 30], [-40, -40], [60, -50]];
const dots = dataPts.map(([x, y]) => gp.ring(5, 0, x, y));
const research = [
  [...gp.grid(80, 4), ...dots],
  [...gp.grid(80, 4), ...dots, gp.ring(30, 40, 20, -10), gp.line([20, -10, 10], [20, -10, 40]), gp.line([44, 8, 40], [80, 40, 74])],
  [...gp.grid(80, 4), ...dots, gp.route([[-60, 40], [-20, 60], [20, -10], [50, 30], [60, -50]], 0), gp.line([60, -50, 0], [60, -50, 60])],
];

// 2. Productos con propósito: diana → flecha → acierto
const target = [gp.ring(28, 0), gp.ring(56, 0), gp.ring(84, 0)];
const arrowFar = [gp.line([-140, -140, 130], [-100, -100, 95]), gp.line([-100, -100, 95], [-110, -96, 108]), gp.line([-100, -100, 95], [-96, -110, 108])];
const arrowIn = [gp.line([-70, -70, 70], [0, 0, 0]), gp.line([0, 0, 0], [-8, -2, 14]), gp.line([0, 0, 0], [-2, -8, 14])];
const purpose = [target, [...target, ...arrowFar], [...target, ...arrowIn, ...gp.rays(0, 96, 116, 8)]];

// 3. Desarrollo acelerado & vibe coding: </> → pantalla → interfaz
const glyph = ['M118 120L92 146L118 172', 'M140 180L162 112', 'M184 120L210 146L184 172'];
const screen = makeIso(150, 236, 1).panel(-70, 0, 140, 110, { bar: true });
const screenUI = makeIso(150, 236, 1).panel(-70, 0, 140, 110, {
  blocks: [[12, 44, 70, 88], [84, 70, 128, 88], [12, 12, 128, 32]],
  lines: [[84, 124, 60], [84, 112, 50]],
});
const code = [glyph, [...screen, ...glyph.map((d) => d)], screenUI];

// 4. Enfoque adaptado a tu negocio: dos piezas que encajan
const pieceA = (ox) => [...gp.slab(30, 0, 30, ox, 0), ...gp.slab(10, 10, 12, ox + 38, 0)];
const pieceB = (ox) => [...gp.slab(30, 0, 30, ox, 0)];
const fit = [
  [...pieceA(-90), ...pieceB(80)],
  [...pieceA(-60), ...pieceB(50)],
  [...pieceA(-40), ...pieceB(30), gp.ring(100, 0)],
];

// 5. Liderazgo estratégico y visionario: escalones → equipo → bandera
const stairs = [...gp.slab(26, 0, 20, -60, 40), ...gp.slab(26, 0, 44, 0, 0), ...gp.slab(26, 0, 68, 60, -40)];
const tops = [
  [-60, 40, 20],
  [0, 0, 44],
  [60, -40, 68],
].map(([x, y, z]) => gp.proj(x, y, z));
const team = tops.flatMap(([x, y], i) => person(x, y - 4, i === 2 ? 0.62 : 0.55));
const [lx, ly] = tops[2];
const flag = [`M${lx + 16} ${ly - 46}L${lx + 16} ${ly - 92}`, `M${lx + 16} ${ly - 92}L${lx + 44} ${ly - 82}L${lx + 16} ${ly - 72}`];
const lead = [stairs, [...stairs, ...team], [...stairs, ...team, ...flag, star(lx + 60, ly - 104, 9)]];

/* ---------- Mentalidad: Atleta Híbrida (Conóceme) ---------- */
const gm = makeIso(150, 200, 1);

// Enfoque y claridad: anillos amplios que se concentran en un punto nítido.
const focus = [
  [gm.ring(30, 0), gm.ring(60, 0), gm.ring(90, 0)],
  [gm.ring(30, 0), gm.ring(60, 0), gm.ring(90, 0), gm.line([0, 0, 0], [0, 0, 110]), gm.ring(10, 110)],
  [gm.ring(30, 0), gm.ring(10, 0), gm.line([0, 0, 0], [0, 0, 110]), gm.ring(10, 110), ...gm.rays(110, 18, 32, 8)],
];

// Disciplina y transparencia: capas transparentes, alineadas y en orden.
const glass = (z) => [
  ...gm.slab(60, z, 10),
  gm.poly([[-60, -60, z], [-60, 60, z], [60, 60, z]], false), // aristas traseras visibles: transparencia
  gm.line([-60, -60, z], [-60, -60, z + 10]),
];
const discipline = [
  glass(0),
  [...glass(0), ...glass(40), ...glass(80), gm.line([0, 0, 10], [0, 0, 80])],
  [...glass(0), ...glass(40), ...glass(80), gm.line([0, 0, 10], [0, 0, 80]), gm.ring(14, 128), gm.line([0, 0, 90], [0, 0, 114])],
];

// Alta resiliencia: cae, toca el suelo y vuelve a subir más alto.
const ground = gm.grid(70, 2);
const resilience = [
  [...ground, gm.ring(16, 120), gm.vring(16, 120, 'xz'), gm.line([0, 0, 96], [0, 0, 60])],
  [...ground, gm.ring(26, 0), gm.ring(16, 10), gm.vring(12, 14, 'xz'), gm.ring(40, 0)],
  [...ground, gm.ring(16, 140), gm.vring(16, 140, 'xz'), gm.poly([[0, 0, 20], [-20, 20, 70], [-10, 10, 116]], false)],
];

// Comunicación y mentalidad de éxito: el equipo se conecta y avanza hacia arriba.
const members = [[-70, 20], [20, 70], [40, -50]];
const team3 = members.flatMap(([x, y]) => gm.slab(14, 0, 28, x, y));
const links = members.map(([x, y], i) => {
  const [nx, ny] = members[(i + 1) % members.length];
  return gm.line([x, y, 28], [nx, ny, 28]);
});
const communication = [
  team3,
  [...team3, ...links, gm.ring(6, 28)],
  [...team3, ...links, gm.line([0, 0, 28], [0, 0, 120]), gm.line([0, 0, 120], [-8, 8, 108]), gm.line([0, 0, 120], [8, -8, 108])],
];

/* ---------- Gestión de producto (proyecto Bloo) ---------- */
// 1. Alineación con stakeholders (mesa de reunión) → 2. Investigación (datos + lupa) → 3. Planificación (hitos + bandera)
const gestion = [meeting, research[1], [...stairs, ...flag]];

/* ---------- Arquitectura de experiencia (proyecto Bloo) ---------- */
// 1. JTBD: tres roles → la tarea concreta de cada uno → se unen en un solo flujo
const roles = [[-70, 50], [0, 0], [70, -50]];
const roleSlabs = roles.flatMap(([x, y]) => gp.slab(16, 0, 10, x, y));
const roleTeam = roles.flatMap(([x, y], i) => {
  const [px, py] = gp.proj(x, y, 10);
  return person(px, py - 2, 0.5, { hair: i === 1 ? 'long' : 'short' });
});
const taskPts = roles.map(([x, y]) => [x + 46, y + 46]);
const taskSlabs = taskPts.flatMap(([x, y]) => gp.slab(9, 0, 6, x, y));
const taskLinks = roles.map(([x, y]) => gp.line([x + 16, y + 16, 3], [x + 37, y + 37, 3]));
const jtbdA = [...roleSlabs, ...roleTeam];
const jtbdB = [...jtbdA, ...taskSlabs, ...taskLinks];
const jtbd = [jtbdA, jtbdB, [...jtbdB, gp.route(taskPts, 6), gp.ring(18, 6, ...taskPts[2]), gp.ring(6, 6, ...taskPts[2])]];

// 2. Ejecución paralela: un requerimiento → tres pantallas a la vez → una elegida
const pBase = g.slab(84, 0, 8);
const pSeed = [g.ring(10, 8), g.line([0, 0, 8], [0, 0, 34]), g.ring(4, 34)];
const pFrames = [-84, -24, 36].flatMap((x) => g.panel(x, 0, 48, 64, { z0: 8 }));
const pUI = [-84, -24, 36].flatMap((x, i) =>
  g.panel(x, 0, 48, 64, {
    z0: 8,
    blocks: i === 1 ? [[6, 8, 22, 46], [26, 32, 42, 46]] : [[6, 30, 42, 46]],
    lines: i === 1 ? [[26, 42, 24], [26, 38, 16]] : [[6, 36, 22], [6, 30, 14]],
  }),
);
const [cx2, cy2] = g.proj(0, 0, 96);
const parallel = [[...pBase, ...pSeed], [...pBase, ...pFrames], [...pBase, ...pUI, star(cx2, cy2 - 6, 11)]];

// 3. Pruebas sintéticas: la interfaz → agentes que la recorren → la lupa encuentra el punto de fricción
const gs = makeIso(140, 200, 1); // centrada para que pantalla y agentes queden equilibrados
const sScreen = gs.panel(-62, 0, 124, 92, {
  blocks: [[10, 52, 34, 70], [50, 30, 74, 48], [90, 52, 114, 70]],
  lines: [[34, 50, 61], [74, 90, 39]],
});
const agents = [[-40, 50], [0, 58], [40, 50]];
const sAgents = agents.flatMap(([x, y]) => [gs.ring(9, 12, x, y), gs.vring(9, 12, 'xz', x, y), gs.ring(14, 0, x, y)]);
const sBeams = agents.map(([x, y]) => gs.line([x, y, 21], [x * 0.8, 0, 44]));
const sLens = [gs.vring(20, 40, 'xz', 0, -2), gs.vring(30, 40, 'xz', 0, -2), gs.line([14, -2, 26], [30, -2, 8])];
const synthetic = [sScreen, [...sScreen, ...sAgents, ...sBeams], [...sScreen, ...sAgents, ...sLens]];

// 4. Validación real: personas usando el producto → primeros datos → mejora con estrella
const [w1x, w1y] = g.proj(-46, 34, 0);
const [p1x, p1y] = g.proj(34, -46, 0);
const vPeople = [...g.grid(78, 3), ...woman(w1x, w1y, 0.62), ...person(p1x, p1y, 0.6)];
const vLow = [...g.grid(78, 3), ...bars.flatMap(([x, h]) => g.slab(12, 0, h * 0.45, x, 22))];
const validation = [vPeople, vLow, measuring];

export const SEQUENCES = {
  gestion: { steps: gestion, persistent: [], interval: 1500 },
  jtbd: { steps: jtbd, persistent: [], interval: 1700 },
  parallel: { steps: parallel, persistent: [], interval: 1700 },
  synthetic: { steps: synthetic, persistent: [], interval: 1700 },
  validation: { steps: validation, persistent: [], interval: 1700 },
  // Pilares: ritmo más ágil para captar el concepto rápido
  research: { steps: research, persistent: [], interval: 1500 },
  purpose: { steps: purpose, persistent: [], interval: 1500 },
  code: { steps: code, persistent: [], interval: 1500 },
  fit: { steps: fit, persistent: [], interval: 1500 },
  lead: { steps: lead, persistent: [], interval: 1500 },
  // Mentalidad (atleta híbrida)
  focus: { steps: focus, persistent: [], interval: 1500 },
  discipline: { steps: discipline, persistent: [], interval: 1500 },
  resilience: { steps: resilience, persistent: [], interval: 1500 },
  communication: { steps: communication, persistent: [], interval: 1500 },
  project: {
    steps: [listening, meeting, designing, launching, measuring],
    persistent: [g.ring(122, 0)],
    interval: 2400,
  },
  loop: {
    steps: loopSteps,
    interval: 2600,
    persistent: [
      g.ring(122, 0),
      ...Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2;
        return g.line([116 * Math.cos(t), 116 * Math.sin(t), 0], [128 * Math.cos(t), 128 * Math.sin(t), 0]);
      }),
    ],
    orbit: g.ring(122, 0),
  },
};

/**
 * Figura de líneas que se transforma paso a paso, en bucle.
 * La siguiente figura empieza a dibujarse mientras la anterior se borra,
 * para que no haya cortes. Al salir de pantalla se pausa sin borrarse.
 */
export default function IsoGraphic({ type = 'project', className = '' }) {
  const seq = SEQUENCES[type];
  const [ref, inView] = useInView({ threshold: 0.2, once: false });
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(seq.steps.length - 1);
      return undefined;
    }
    setActive((a) => (a < 0 ? 0 : a));
    const id = setInterval(() => setActive((a) => (a + 1) % seq.steps.length), seq.interval);
    return () => clearInterval(id);
  }, [inView, seq]);

  const speed = seq.interval / 2600; // animaciones más rápidas en secuencias más cortas

  return (
    <svg ref={ref} viewBox="0 0 300 300" className={className} aria-hidden="true">
      {/* Trazos nítidos: grosor fijo en píxeles (como en el hero) */}
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-ink-faint">
        {seq.persistent.map((d, i) => (
          <path key={`p${i}`} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {seq.orbit && (
        <circle r="3.5" className="fill-stroke">
          <animateMotion dur="9s" repeatCount="indefinite" path={seq.orbit} />
        </circle>
      )}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-ink-line"
      >
        {seq.steps.map((paths, s) =>
          paths.map((d, j) => {
            const on = s === active;
            return (
              <path
                key={`${s}-${j}`}
                d={d}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: on ? 0 : 1,
                  opacity: on ? 1 : 0,
                  transition: on
                    ? `stroke-dashoffset ${0.9 * speed}s cubic-bezier(0.5,0,0.2,1) ${0.12 + j * 0.03 * speed}s, opacity 0.3s ease 0.1s`
                    : `stroke-dashoffset ${0.8 * speed}s cubic-bezier(0.5,0,0.2,1), opacity ${0.6 * speed}s ease ${0.25 * speed}s`,
                }}
              />
            );
          }),
        )}
      </g>
      {/* Luz que recorre cada trazo mientras se dibuja (solo en modo oscuro) */}
      {active >= 0 && (
        <g
          key={active}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ opacity: 'var(--c-spark-a)' }}
        >
          {seq.steps[active].map((d, j) => (
            <path
              key={j}
              d={d}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              className="line-spark line-spark-run"
              style={{ '--spark-dur': `${0.9 * speed}s`, '--spark-delay': `${0.12 + j * 0.03 * speed}s` }}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
