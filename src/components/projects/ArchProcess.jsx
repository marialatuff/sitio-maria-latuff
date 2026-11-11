import { useInView } from '../../hooks/useInView.js';
import { person } from '../home/iso.js';

/**
 * Diagramas de proceso de "Arquitectura de Experiencia & Integración de IA" (Bloo).
 * Estilo del sitio: líneas finas que se dibujan, luz lila, tipografía de párrafo (Inter) y bloques sólidos sin borde.
 * Coordenadas en un lienzo de 400 de ancho; el texto escala con el contenedor (unidades cqw).
 * Los textos son ejemplos (TODO: confirmar con María).
 */

const VBW = 400;
const pct = (v, total) => `${(v / total) * 100}%`;
const fs = (px) => `${(px / VBW) * 100}cqw`; // tamaño de letra relativo al ancho del diagrama
const LINE = 'rgb(var(--c-ink-line))';
const SPARK = '#ded0e8';

// Trazo que se dibuja con retraso
const draw = (on, delay, dur = 0.7) => ({
  strokeDasharray: 1,
  strokeDashoffset: on ? 0 : 1,
  transition: `stroke-dashoffset ${dur}s cubic-bezier(.5,0,.2,1) ${delay}s`,
});
// Aparición con retraso
const fade = (on, delay) => ({
  opacity: on ? 1 : 0,
  transform: on ? 'none' : 'translateY(4px)',
  transition: `opacity .5s ease ${delay}s, transform .5s ease ${delay}s`,
});

/** Lienzo: SVG para las líneas + capa HTML para los bloques de texto, en el mismo sistema de coordenadas. */
function Canvas({ h, innerRef, lines, children }) {
  return (
    <div ref={innerRef} className="relative w-full font-geist" style={{ aspectRatio: `${VBW} / ${h}`, containerType: 'inline-size' }}>
      {children}
      {/* Las líneas van encima de los bloques para que no queden tapadas */}
      <svg viewBox={`0 0 ${VBW} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {lines}
      </svg>
    </div>
  );
}

/** Bloque sólido sin borde, posicionado en coordenadas del lienzo. */
function Box({ x, y, w, h, H, style, className = '', children }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[0.6cqw] bg-paper-soft ${className}`}
      style={{ left: pct(x, VBW), top: pct(y, H), width: pct(w, VBW), height: pct(h, H), padding: '1.6cqw 2cqw', ...style }}
    >
      {children}
    </div>
  );
}

function Label({ x, y, H, style, children }) {
  return (
    <span className="absolute whitespace-nowrap text-graphite-soft" style={{ left: pct(x, VBW), top: pct(y, H), fontSize: fs(8.5), ...style }}>
      {children}
    </span>
  );
}

const P = (d, style, extra = {}) => <path d={d} pathLength={1} stroke={LINE} strokeWidth="1.1" vectorEffect="non-scaling-stroke" style={style} {...extra} />;
const Arrow = (x, y, on, delay) => P(`M${x - 5} ${y - 4}L${x} ${y}L${x - 5} ${y + 4}`, draw(on, delay, 0.3));

/* ---------- 1. JTBD → tareas por rol → flujograma ---------- */
export function JobFlowDiagram() {
  const [ref, on] = useInView({ threshold: 0.35 });
  const H = 250;
  const nodes = [
    ['Director', 'Panel de control', 118],
    ['Tesorero', 'Aprobación de gastos', 163],
    ['Docente', 'Mis materias', 208],
  ];
  return (
    <Canvas
      h={H}
      innerRef={ref}
      lines={
        <>
          {/* JTBD → tareas */}
          {P('M184 46H214', draw(on, 1.0, 0.4))}
          {Arrow(214, 46, on, 1.3)}
          {/* tareas → inicio del flujo */}
          {P('M305 84C305 112 60 104 60 150', draw(on, 2.0, 0.9))}
          {/* inicio → decisión */}
          {P('M96 163H116', draw(on, 2.8, 0.3))}
          {/* rombo de decisión */}
          {P('M140 139L164 163L140 187L116 163Z', draw(on, 3.0, 0.6))}
          {/* ramas por rol */}
          {nodes.map(([, , y], i) => P(`M164 163C182 163 182 ${y} 200 ${y}`, draw(on, 3.5 + i * 0.12, 0.5), { key: `b${i}` }))}
          {/* convergen en la tarea resuelta */}
          {nodes.map(([, , y], i) => P(`M300 ${y}C312 ${y} 312 163 322 163`, draw(on, 4.3 + i * 0.1, 0.4), { key: `c${i}` }))}
          {/* luz que recorre el camino del Docente */}
          {on && (
            <path
              d="M60 150V163H116L140 187L164 163C182 163 182 208 200 208H300C312 208 312 163 322 163"
              pathLength={1}
              stroke={SPARK}
              strokeWidth="2"
              className="line-spark line-spark-run"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: 'var(--c-spark-a)', '--spark-dur': '1.6s', '--spark-delay': '5s' }}
            />
          )}
        </>
      }
    >
      <Label x={10} y={2} H={H} style={fade(on, 0.1)}>Job to be done</Label>
      <Box x={10} y={14} w={172} h={66} H={H} style={fade(on, 0.2)}>
        <p className="leading-snug text-graphite" style={{ fontSize: fs(9.5) }}>
          Cuando inicio mi jornada, quiero ver mis pendientes en un solo lugar, para preparar mi día sin perder tiempo.
        </p>
      </Box>
      <Label x={220} y={2} H={H} style={fade(on, 1.3)}>Tareas que se desprenden</Label>
      <Box x={220} y={14} w={170} h={66} H={H} style={fade(on, 1.4)}>
        {['Ver las clases de hoy', 'Revisar evaluaciones', 'Preparar recursos'].map((t, i) => (
          <p key={t} className="leading-snug text-graphite" style={{ fontSize: fs(9.5), ...fade(on, 1.55 + i * 0.15) }}>
            {i + 1}. {t}
          </p>
        ))}
      </Box>
      <Label x={10} y={128} H={H} style={fade(on, 2.4)}>Flujo de usuario</Label>
      <Box x={24} y={150} w={72} h={26} H={H} className="grid place-items-center !p-0" style={fade(on, 2.5)}>
        <span className="text-night" style={{ fontSize: fs(9) }}>Inicio</span>
      </Box>
      {/* Texto centrado dentro del rombo (sin translate: la animación usa transform) */}
      <span className="absolute grid place-items-center text-graphite" style={{ left: pct(116, VBW), top: pct(151, H), width: pct(48, VBW), height: pct(24, H), fontSize: fs(8.5), ...fade(on, 3.4) }}>
        ¿Rol?
      </span>
      {nodes.map(([role, view, y], i) => (
        <Box key={role} x={200} y={y - 14} w={100} h={28} H={H} className="!py-0 flex flex-col justify-center" style={fade(on, 3.8 + i * 0.12)}>
          <span className="leading-none text-night" style={{ fontSize: fs(8.5) }}>{role}</span>
          <span className="mt-[0.4cqw] leading-none text-graphite-mute" style={{ fontSize: fs(7.5) }}>{view}</span>
        </Box>
      ))}
      <Box x={322} y={150} w={70} h={26} H={H} className="grid place-items-center !p-0" style={{ ...fade(on, 4.7), background: 'rgba(222,208,232,.14)' }}>
        <span style={{ fontSize: fs(8.5), color: SPARK }}>Tarea resuelta</span>
      </Box>
    </Canvas>
  );
}

/* ---------- 2. JTBD → flujograma → Figma y Claude en paralelo → prototipo ---------- */
const CODE = ['<Sidebar rol="docente" />', '<Resumen clases={hoy} />', '<Pendientes lista={tareas} />', '<Modulos items={4} />'];

export function ParallelDiagram() {
  const [ref, on] = useInView({ threshold: 0.35 });
  const H = 290;
  const lane = 2.2; // momento en que arrancan las dos pistas a la vez
  return (
    <Canvas
      h={H}
      innerRef={ref}
      lines={
        <>
          {/* JTBD → flujograma */}
          {P('M132 44H150', draw(on, 0.8, 0.3))}
          {Arrow(150, 44, on, 1.0)}
          {/* mini flujograma */}
          {P('M170 44H186', draw(on, 1.1, 0.25))}
          {P('M198 32L210 44L198 56L186 44Z', draw(on, 1.25, 0.4))}
          {P('M210 44C220 44 220 30 230 30M210 44C220 44 220 58 230 58', draw(on, 1.5, 0.4))}
          {P('M262 30H272M262 58H272', draw(on, 1.75, 0.25))}
          {/* el flujograma se divide en dos pistas paralelas */}
          {P(`M220 76C220 96 104 92 104 116`, draw(on, lane - 0.4, 0.6))}
          {P(`M220 76C220 96 300 92 300 116`, draw(on, lane - 0.4, 0.6))}
          {/* Figma: marco con estructura */}
          {P('M60 158H96', draw(on, lane + 0.5, 0.4))}
          {P('M60 166H88M60 174H92M60 182H84', draw(on, lane + 0.6, 0.4))}
          {P('M104 152H180V214H104Z', draw(on, lane + 0.4, 0.7))}
          {P('M110 158H128V208H110Z', draw(on, lane + 0.9, 0.5))}
          {P('M134 158H174V172H134ZM134 178H152V208H134ZM156 178H174V208H156Z', draw(on, lane + 1.1, 0.7))}
          {/* Claude: vista previa que se arma con el código */}
          {P('M318 152H382V214H318Z', draw(on, lane + 0.4, 0.7))}
          {P('M322 156H334V210H322Z', draw(on, lane + 1.4, 0.4))}
          {P('M338 156H378V166H338Z', draw(on, lane + 1.7, 0.4))}
          {P('M338 170H356V190H338ZM360 170H378V190H360Z', draw(on, lane + 2.0, 0.5))}
          {P('M338 194H378V210H338Z', draw(on, lane + 2.3, 0.4))}
          {/* las dos pistas convergen en el prototipo */}
          {P('M120 232C120 252 200 246 200 260', draw(on, lane + 2.8, 0.6))}
          {P('M300 232C300 252 200 246 200 260', draw(on, lane + 2.8, 0.6))}
        </>
      }
    >
      <Label x={10} y={4} H={H} style={fade(on, 0.1)}>Job to be done</Label>
      <Box x={10} y={16} w={120} h={56} H={H} style={fade(on, 0.2)}>
        <p className="leading-snug text-graphite" style={{ fontSize: fs(8.5) }}>
          Cuando inicio mi jornada, quiero ver mis pendientes, para preparar mi día.
        </p>
      </Box>
      <Label x={152} y={4} H={H} style={fade(on, 1.0)}>Flujograma</Label>
      {[[152, 37, 'Inicio'], [230, 23, 'Director'], [230, 51, 'Docente']].map(([x, y, t], i) => (
        <Box key={t} x={x} y={y} w={x === 152 ? 18 : 32} h={14} H={H} className="grid place-items-center !p-0" style={fade(on, 1.1 + i * 0.25)}>
          <span className="leading-none text-graphite" style={{ fontSize: fs(x === 152 ? 5 : 6) }}>{x === 152 ? '' : t}</span>
        </Box>
      ))}
      {/* Pista Figma */}
      <Box x={40} y={116} w={150} h={116} H={H} style={{ ...fade(on, lane), background: 'rgb(var(--c-paper-soft) / .6)' }}>
        <span className="text-night" style={{ fontSize: fs(9) }}>Diseño en Figma</span>
      </Box>
      {/* Pista Claude */}
      <Box x={210} y={116} w={180} h={116} H={H} style={{ ...fade(on, lane), background: 'rgb(var(--c-paper-soft) / .6)' }}>
        <span className="text-night" style={{ fontSize: fs(9) }}>Vibe coding en Claude</span>
        <div className="mt-[1.2cqw] space-y-[0.6cqw]">
          {CODE.map((c, i) => (
            <p key={c} className="whitespace-nowrap leading-none text-graphite-mute" style={{ fontSize: fs(6.6), ...fade(on, lane + 0.8 + i * 0.35) }}>
              {c}
            </p>
          ))}
        </div>
      </Box>
      <Box x={140} y={260} w={120} h={24} H={H} className="grid place-items-center !p-0" style={{ ...fade(on, lane + 3.3), background: 'rgba(222,208,232,.14)' }}>
        <span style={{ fontSize: fs(8.5), color: SPARK }}>Prototipo para validar</span>
      </Box>
    </Canvas>
  );
}

/* ---------- 3. Prueba sintética en Claude → respuesta → decisión ---------- */
export function SyntheticDiagram({ example }) {
  const [ref, on] = useInView({ threshold: 0.35 });
  const H = 280;
  const answer = [
    ['Hallazgo', example.findings[0].text],
    ['Riesgo', example.findings[1].text],
    ['Recomendación', example.decisions[0]],
  ];
  return (
    <Canvas
      h={H}
      innerRef={ref}
      lines={
        <>
          {/* Diseño bajo prueba (izquierda) */}
          {P('M20 44H176V196H20Z', draw(on, 0.3, 0.8))}
          {P('M20 56H176', draw(on, 0.6, 0.4))}
          {P('M28 64H64V188H28Z', draw(on, 0.8, 0.5))}
          {P('M34 74H58M34 86H58M34 98H58M34 110H58M34 122H58', draw(on, 1.0, 0.5))}
          {P('M72 64H168V92H72ZM72 98H118V140H72ZM122 98H168V140H122ZM72 146H168V188H72Z', draw(on, 1.1, 0.8))}
          {/* el agente recorre el menú y se detiene donde hay fricción */}
          {P('M46 74V98H54V122', draw(on, 2.0, 0.9), { stroke: SPARK, strokeWidth: 1.6 })}
          {P('M46 122m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0', draw(on, 2.9, 0.5), { stroke: SPARK, strokeWidth: 1.4 })}
          {/* respuesta → decisión */}
          {P('M282 214V236', draw(on, 5.6, 0.3))}
          {Arrow(282, 238, on, 5.8)}
          {P('M50 254l5 5 9-10', draw(on, 6.4, 0.4), { stroke: SPARK, strokeWidth: 1.6 })}
        </>
      }
    >
      {/* Barra superior tipo ventana */}
      <Box x={10} y={6} w={380} h={22} H={H} className="flex items-center gap-[1cqw] !py-0" style={fade(on, 0.1)}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="rounded-full bg-graphite-mute/40" style={{ width: '1.4cqw', height: '1.4cqw' }} />
        ))}
        <span className="ml-[1.5cqw] text-graphite" style={{ fontSize: fs(8.5) }}>Claude · prueba con agentes por rol</span>
      </Box>
      <Label x={20} y={30} H={H} style={fade(on, 0.4)}>Diseño en prueba</Label>
      {/* Conversación */}
      <Box x={190} y={38} w={200} h={30} H={H} style={fade(on, 1.2)}>
        <p className="leading-snug text-graphite" style={{ fontSize: fs(8) }}>
          Actúa como Tesorero y aprueba un gasto en esta pantalla.
        </p>
      </Box>
      <Box x={190} y={74} w={200} h={140} H={H} style={{ ...fade(on, 3.2), background: 'transparent', padding: '1cqw 0' }}>
        {answer.map(([k, t], i) => (
          <p key={k} className="mb-[1.4cqw] leading-snug text-graphite" style={{ fontSize: fs(8), ...fade(on, 3.4 + i * 0.7) }}>
            <span className="text-night">{k}:</span> {t}
          </p>
        ))}
      </Box>
      {/* Decisión tomada */}
      <Box x={10} y={242} w={380} h={30} H={H} className="flex items-center !py-0" style={{ ...fade(on, 6.1), background: 'rgba(222,208,232,.12)', paddingLeft: '18cqw' }}>
        <p className="leading-snug" style={{ fontSize: fs(8.5), color: SPARK }}>
          Decisión: {example.decisions[0]}
        </p>
      </Box>
    </Canvas>
  );
}


/* =========================================================
   PUMA · 1. Reunión con el equipo → documento funcional con flujo de usuario
   ========================================================= */
export function MeetingDocDiagram() {
  const [ref, on] = useInView({ threshold: 0.35 });
  const H = 260;
  // Mesa de reunión (elipse en línea) con la diseñadora y el equipo alrededor
  const people = [
    [40, 128, 0.5, 'long'],
    [80, 112, 0.5, 'short'],
    [120, 112, 0.5, 'short'],
    [160, 128, 0.5, 'short'],
  ];
  const nodes = [
    [268, 62, 'Inicio'],
    [268, 104, 'Login'],
    [268, 152, '¿Perfil?'],
    [248, 204, 'Formularios'],
    [320, 204, 'Cargos'],
  ];
  return (
    <Canvas
      h={H}
      innerRef={ref}
      lines={
        <>
          {/* Mesa */}
          {P('M30 150C30 132 170 132 170 150C170 168 30 168 30 150Z', draw(on, 0.2, 0.8))}
          {/* Personas alrededor de la mesa */}
          {people.flatMap(([x, y, s, hair], i) =>
            person(x, y, s, { hair }).map((d, j) => P(d, draw(on, 0.5 + i * 0.15, 0.6), { key: `p${i}-${j}` })),
          )}
          {/* Notas sobre la mesa */}
          {P('M78 146H96M86 152H112M104 146H120', draw(on, 1.2, 0.4))}
          {/* De la reunión al documento */}
          {P('M178 150C192 150 192 120 204 120', draw(on, 1.6, 0.5))}
          {Arrow(206, 120, on, 2.0)}
          {/* Documento funcional (hoja con esquina doblada) */}
          {P('M212 22H336L356 42V244H212Z M336 22V42H356', draw(on, 2.0, 0.8))}
          {/* Flujo de usuario dentro del documento */}
          {P('M268 76V92 M268 118V136', draw(on, 2.8, 0.4))}
          {P('M268 136L284 152L268 168L252 152Z', draw(on, 3.0, 0.4))}
          {P('M252 152C244 152 248 170 248 192 M284 152C312 152 320 170 320 192', draw(on, 3.3, 0.5))}
          {/* Luz que recorre el flujo */}
          {on && (
            <path
              d="M268 76V136L284 152C312 152 320 170 320 192"
              pathLength={1}
              stroke={SPARK}
              strokeWidth="2"
              className="line-spark line-spark-run"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: 'var(--c-spark-a)', '--spark-dur': '1.4s', '--spark-delay': '4s' }}
            />
          )}
        </>
      }
    >
      <Label x={30} y={42} H={H} style={fade(on, 0.3)}>Reunión con el equipo PUMA</Label>
      <Label x={30} y={180} H={H} style={fade(on, 1.3)}>Diseñadora + selección + RR. HH.</Label>
      <Label x={220} y={4} H={H} style={fade(on, 2.2)}>Documento funcional</Label>
      {nodes.map(([x, y, t], i) =>
        i === 2 ? (
          // Texto dentro del rombo de decisión
          <span key={t} className="absolute grid place-items-center text-graphite" style={{ left: pct(x - 18, VBW), top: pct(y - 8, H), width: pct(36, VBW), height: pct(16, H), fontSize: fs(6.5), ...fade(on, 3.2) }}>
            {t}
          </span>
        ) : (
          <Box
            key={t}
            x={x - 30}
            y={y - 12}
            w={60}
            h={24}
            H={H}
            className="grid place-items-center !p-0"
            style={{ ...fade(on, 2.6 + i * 0.25), background: i >= 3 ? 'rgba(222,208,232,.14)' : undefined }}
          >
            <span className="whitespace-nowrap leading-none" style={{ fontSize: fs(8), color: i >= 3 ? SPARK : 'rgb(var(--c-night))' }}>{t}</span>
          </Box>
        ),
      )}
      <Label x={226} y={226} H={H} style={fade(on, 3.8)}>Flujo de usuario</Label>
    </Canvas>
  );
}

/* =========================================================
   PUMA · 3. Prueba de uso del producto con el equipo
   ========================================================= */
export function TeamTestDiagram({ screens = [] }) {
  const [ref, on] = useInView({ threshold: 0.35 });
  const H = 270;
  const tasks = [
    ['Iniciar sesión', 'Sin ayuda'],
    ['Crear un formulario', 'Sin ayuda'],
    ['Agregar una pregunta', 'Ajuste: botón más visible'],
  ];
  return (
    <Canvas
      h={H}
      innerRef={ref}
      lines={
        <>
          {/* Integrantes del equipo probando */}
          {[[44, 248, 'short'], [96, 248, 'long'], [148, 248, 'short']].flatMap(([x, y, hair], i) =>
            person(x, y, 0.5, { hair }).map((d, j) => P(d, draw(on, 0.2 + i * 0.15, 0.6), { key: `t${i}-${j}` })),
          )}
          {/* Miradas hacia las pantallas */}
          {[44, 96, 148].map((x, i) => P(`M${x} 196C${x} 180 ${60 + i * 60} 176 ${60 + i * 60} 160`, draw(on, 1.0 + i * 0.15, 0.5), { key: `l${i}` }))}
          {/* De la prueba a los resultados */}
          {P('M200 100H224', draw(on, 2.6, 0.3))}
          {Arrow(226, 100, on, 2.8)}
          {/* Checks de cada tarea */}
          {tasks.map((_, i) => P(`M236 ${58 + i * 46}l3.5 3.5 8-9`, draw(on, 3.2 + i * 0.4, 0.3), { key: `c${i}`, stroke: i === 2 ? '#f5c76b' : SPARK, strokeWidth: 1.6 }))}
        </>
      }
    >
      <Label x={10} y={2} H={H} style={fade(on, 0.1)}>Prueba de uso con el equipo PUMA</Label>
      {/* Pantallas reales del producto */}
      {screens.slice(0, 3).map((src, i) => (
        <Box key={i} x={10 + i * 62} y={18} w={58} h={140} H={H} className="!p-0" style={fade(on, 0.6 + i * 0.25)}>
          <img src={src} alt="" className="h-full w-full object-cover object-left-top" />
        </Box>
      ))}
      <Label x={236} y={30} H={H} style={fade(on, 2.9)}>Resultados por tarea</Label>
      {tasks.map(([t, r], i) => (
        <Box key={t} x={232} y={44 + i * 46} w={158} h={38} H={H} style={{ ...fade(on, 3.0 + i * 0.4), paddingLeft: '6cqw' }}>
          <p className="leading-tight text-night" style={{ fontSize: fs(8.5) }}>{t}</p>
          <p className="leading-tight" style={{ fontSize: fs(7.5), color: i === 2 ? '#f5c76b' : 'rgb(var(--c-graphite-soft))' }}>{r}</p>
        </Box>
      ))}
      <Box x={232} y={194} w={158} h={30} H={H} className="flex items-center" style={{ ...fade(on, 4.6), background: 'rgba(222,208,232,.12)' }}>
        <p className="leading-tight" style={{ fontSize: fs(8), color: SPARK }}>Interfaz ajustada con datos reales de uso</p>
      </Box>
    </Canvas>
  );
}