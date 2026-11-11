import { useEffect, useMemo, useRef, useState } from 'react';
import HomeButton from './HomeButton.jsx';
import { MARK_D } from './Signature.jsx';

/**
 * Hero de la Home (referencia de movimiento: usealia.com, con la marca de María).
 *
 * 1. Entrada: telón a pantalla completa donde se escribe la firma "ml".
 *    El telón se cierra hasta quedar en una sola línea.
 * 2. La línea cobra vida: se abre en tres hilos (psicología del usuario,
 *    objetivos de negocio y diseño) que ondulan y vuelven a unirse.
 *    Cada hilo se resalta junto a su fragmento del párrafo.
 * 3. Al hacer scroll: el título se parte en dos y los propios hilos se
 *    reúnen y se transforman en la firma completa (la línea "escribe" la firma).
 *    Después la sección siguiente sube por encima del hero, que queda fijo y se aleja.
 */

// Firma completa + una salida suave que la devuelve a la línea base (y = 448).
const SIG_BASE = { x: 120, y: 448 };
const SIG_END_X = 1720;
// Sin el remate final de la firma (un quiebre brusco): la salida continúa en curva, como en el footer
const MARK = MARK_D.replace(/\s*L 812 866$/, '');
const SIG_D = `${MARK} C 760 960 980 790 1160 620 C 1300 500 1560 448 ${SIG_END_X} ${SIG_BASE.y}`;
const SIG_TOP = 86; // punto más alto de la firma
const SIG_BOTTOM = 900; // punto más bajo
const SAMPLES = 640; // puntos por hilo (mismos en la onda y en la firma, para poder transformarla)

/** Suaviza una polilínea (media móvil, varias pasadas) para redondear los quiebres. */
function smooth(pts, radius, passes) {
  let src = pts;
  const n = pts.length / 2;
  for (let pass = 0; pass < passes; pass += 1) {
    const out = new Float32Array(src.length);
    for (let i = 0; i < n; i += 1) {
      let sx = 0;
      let sy = 0;
      let c = 0;
      for (let k = -radius; k <= radius; k += 1) {
        const j = Math.min(n - 1, Math.max(0, i + k));
        sx += src[j * 2];
        sy += src[j * 2 + 1];
        c += 1;
      }
      out[i * 2] = sx / c;
      out[i * 2 + 1] = sy / c;
    }
    src = out;
  }
  return src;
}

const THREADS = [
  { freq: 1.15, speed: 0.55, phase: 0 },
  { freq: 0.9, speed: -0.42, phase: 2.1 },
  { freq: 1.4, speed: 0.35, phase: 4.2 },
];

const clamp = (v) => Math.min(1, Math.max(0, v));
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const INTRO_KEY = 'ml-hero-intro';

export default function HeroThreads({ title, titleLines, paragraph, highlights = [] }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const pathRefs = useRef([]);
  const sigRef = useRef(null);
  const sparkRef = useRef(null);
  const lineRefs = useRef([]);
  const copyRef = useRef(null);

  const [size, setSize] = useState({ w: 1440, h: 800 });
  const [mobile, setMobile] = useState(false);
  // intro → collapse → done
  const [phase, setPhase] = useState('intro');
  const [active, setActive] = useState(0);
  const [textOn, setTextOn] = useState(false);

  const st = useRef({ life: 0, lifeStart: 0, split: 0, reduce: false });

  // Medidas del escenario (coordenadas en píxeles reales: trazo nítido)
  useEffect(() => {
    const el = stageRef.current;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setSize({ w: Math.max(1, width), h: Math.max(1, height) });
      setMobile(width < 768);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cy = size.h * (mobile ? 0.3 : 0.4);

  // Secuencia de entrada (una vez por visita; sin animación si se pide movimiento reducido)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    st.current.reduce = reduce;
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === '1';
    } catch {
      /* sin almacenamiento */
    }
    if (reduce || seen) {
      st.current.life = 1;
      setPhase('done');
      setTextOn(true);
      return undefined;
    }
    document.documentElement.style.overflow = 'hidden';
    const timers = [
      setTimeout(() => setPhase('collapse'), 1500),
      setTimeout(() => {
        // Se marca como vista al terminar (así el doble montaje de desarrollo no la salta)
        try {
          sessionStorage.setItem(INTRO_KEY, '1');
        } catch {
          /* sin almacenamiento */
        }
        setPhase('done');
        st.current.lifeStart = performance.now();
        document.documentElement.style.overflow = '';
      }, 2250),
      setTimeout(() => setTextOn(true), 2500),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Hilo activo: cambia cada 2,4 s, junto con el fragmento del párrafo
  useEffect(() => {
    if (!textOn || st.current.reduce) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % THREADS.length), 2400);
    return () => clearInterval(id);
  }, [textOn]);

  // Estado visual que lee el bucle de animación (sin re-renderizar)
  const vis = useRef({ phase, active, textOn });
  vis.current = { phase, active, textOn };

  /*
   * Recorrido destino: línea desde el borde izquierdo → firma completa "ml" →
   * salida suave → línea hasta el borde derecho. Se muestrea en SAMPLES puntos
   * repartidos por longitud, para que cada punto de los hilos tenga su pareja.
   */
  const target = useMemo(() => {
    const { w, h } = size;
    const sigW = SIG_END_X - SIG_BASE.x;
    const scale = Math.min((w * (mobile ? 0.86 : 0.5)) / sigW, (h * (mobile ? 0.26 : 0.5)) / (SIG_BOTTOM - SIG_TOP));
    const ox = w / 2 - (SIG_BASE.x + sigW / 2) * scale;
    const oy = cy - SIG_BASE.y * scale;
    const sx = SIG_BASE.x * scale + ox;
    const ex = SIG_END_X * scale + ox;

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('style', 'position:absolute;width:0;height:0;visibility:hidden');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', SIG_D);
    p.setAttribute('transform', `translate(${ox} ${oy}) scale(${scale})`);
    svg.appendChild(p);
    document.body.appendChild(svg);
    const sigLen = p.getTotalLength() * scale;
    const total = sx + sigLen + (w - ex);
    const pts = new Float32Array(SAMPLES * 2);
    for (let i = 0; i < SAMPLES; i += 1) {
      const l = (i / (SAMPLES - 1)) * total;
      let x;
      let y;
      if (l <= sx) {
        x = l;
        y = cy;
      } else if (l <= sx + sigLen) {
        const q = p.getPointAtLength((l - sx) / scale);
        x = q.x * scale + ox;
        y = q.y * scale + oy;
      } else {
        x = ex + (l - sx - sigLen);
        y = cy;
      }
      pts[i * 2] = x;
      pts[i * 2 + 1] = y;
    }
    svg.remove();
    // Redondea los quiebres de la firma para que el trazo sea siempre continuo
    return smooth(pts, 3, 3);
  }, [size, mobile, cy]);

  // Trazado de la firma (polilínea suavizada)
  const sigD = useMemo(() => {
    let d = '';
    for (let j = 0; j < SAMPLES; j += 1) d += `${j ? 'L' : 'M'}${target[j * 2].toFixed(1)} ${target[j * 2 + 1].toFixed(1)}`;
    return d;
  }, [target]);

  // Hilos ondulantes que, al hacer scroll, se transforman en la firma (rAF)
  useEffect(() => {
    const { w, h } = size;
    const x0 = mobile ? 0 : w * 0.05;
    const x1 = mobile ? w : w * 0.72;
    const amp = h * (mobile ? 0.1 : 0.17);
    const op = THREADS.map(() => 0);
    let raf = 0;
    let lastP = 0;
    let glow = 0;

    const render = (now) => {
      const s = st.current;
      const v = vis.current;
      if (s.lifeStart && s.life < 1) s.life = clamp((now - s.lifeStart) / 1600);
      const t = s.reduce ? 0 : now / 1000;
      const k = easeOut(s.life);
      /*
       * La firma nunca se deforma (así no hay picos):
       * a) los hilos se calman hasta ser una sola línea recta,
       * c) sobre esa línea, la firma se escribe de izquierda a derecha como un trazo
       *    de pluma; al terminar, la línea de base se funde con la firma.
       */
      const m = clamp(s.split * 1.25);
      const a = easeInOut(clamp(m / 0.45));
      const c = clamp((m - 0.3) / 0.7);
      if (sigRef.current) {
        sigRef.current.style.strokeDashoffset = String(1 - easeInOut(c));
        sigRef.current.style.strokeOpacity = c > 0 ? '1' : '0';
      }
      // Luz en la punta de la pluma: brilla mientras la firma se escribe con el scroll
      const spark = sparkRef.current;
      if (spark) {
        const p = easeInOut(c);
        const moving = Math.min(1, Math.abs(p - lastP) * 120);
        lastP = p;
        glow += (moving - glow) * (moving > glow ? 0.3 : 0.05);
        const len = Math.min(0.02, p);
        spark.style.strokeDasharray = `${len} 2`;
        spark.style.strokeDashoffset = String(-(p - len));
        spark.style.opacity = String(p > 0.002 && p < 0.998 ? glow : 0);
      }

      THREADS.forEach((th, i) => {
        const el = pathRefs.current[i];
        if (!el) return;
        let d = '';
        for (let j = 0; j < SAMPLES; j += 1) {
          // Punto de la onda (se aplana con a)
          const x = (j / (SAMPLES - 1)) * w;
          const u = clamp((x - x0) / (x1 - x0));
          const env = Math.sin(Math.PI * u) ** 1.4;
          const wave = amp * k * env * Math.sin(Math.PI * 2 * u * th.freq + t * th.speed + th.phase);
          const y = cy + wave * (1 - a);
          d += `${j ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        el.setAttribute('d', d);

        // Opacidad y grosor: el hilo activo destaca; al calmarse, los tres son una sola línea,
        // que al final se funde con la firma ya escrita
        const base = v.phase !== 'done' ? 0 : !v.textOn || v.active === i ? 1 : 0.28;
        op[i] += (base - op[i]) * (s.reduce ? 1 : 0.06);
        const fadeOut = 1 - easeInOut(clamp((c - 0.85) / 0.15));
        el.style.strokeOpacity = String((op[i] + (1 - op[i]) * a) * fadeOut);
        const width = (v.textOn && v.active === i ? 1.8 : 1.2) * (1 - a) + 1.8 * a;
        el.setAttribute('stroke-width', width.toFixed(2));
      });
      // Con movimiento reducido los hilos no ondulan (t = 0), pero siguen el scroll
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [size, mobile, cy, target]);

  // Scroll: el título se parte, aparece la "m" y la sección siguiente cubre el hero
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const vh = window.innerHeight;
      const y = -sec.getBoundingClientRect().top;
      const split = clamp(y / (vh * 0.6));
      const cover = clamp((y - vh * 0.6) / vh);
      st.current.split = split;
      const e = easeInOut(split);
      const shift = mobile ? 60 : 28; // vw

      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translateX(${(i === 0 ? -1 : 1) * e * shift}vw)`;
        el.style.opacity = String(1 - e * 0.9);
      });
      if (copyRef.current) {
        copyRef.current.style.opacity = String(1 - clamp(split * 1.6));
        copyRef.current.style.transform = `translateY(${split * 40}px)`;
      }
      if (stageRef.current) {
        // El hero se disuelve: sube un poco, se desenfoca y se desvanece mientras la sección siguiente llega
        const e2 = easeInOut(cover);
        stageRef.current.style.transform = `translateY(${-8 * e2}vh)`;
        stageRef.current.style.filter = cover > 0 ? `blur(${(e2 * 8).toFixed(2)}px)` : 'none';
        stageRef.current.style.opacity = String(1 - 0.85 * e2);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [mobile]);

  // Entrada de los textos
  const enter = (delay, dist = 24) => ({
    opacity: textOn ? 1 : 0,
    transform: textOn ? 'translateY(0)' : `translateY(${dist}px)`,
    filter: textOn ? 'blur(0)' : 'blur(6px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}s, filter 0.8s ease ${delay}s`,
  });

  // Párrafo con los fragmentos resaltables
  const parts = [];
  let rest = paragraph;
  highlights.forEach((hl, i) => {
    const at = rest.indexOf(hl);
    if (at < 0) return;
    if (at > 0) parts.push({ text: rest.slice(0, at) });
    parts.push({ text: hl, index: i });
    rest = rest.slice(at + hl.length);
  });
  if (rest) parts.push({ text: rest });

  return (
    <section ref={sectionRef} className="relative h-[260svh]" aria-label="Presentación">
      {/* Telón de entrada: se escribe la firma y se cierra en una línea */}
      {phase !== 'done' && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[70] bg-night"
          style={{
            transformOrigin: `50% ${cy}px`,
            transform: phase === 'collapse' ? 'scaleY(0.0025)' : 'scaleY(1)',
            transition: 'transform 0.75s cubic-bezier(0.76, 0, 0.24, 1)',
          }}
        >
          <svg
            viewBox="90 60 1260 850"
            className="absolute left-1/2 w-[min(60vw,420px)] -translate-x-1/2 -translate-y-1/2 text-curtain-ink"
            style={{
              top: cy,
              opacity: phase === 'collapse' ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            <path
              d={MARK_D}
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-intro-m"
            />
          </svg>
        </div>
      )}

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        <div ref={stageRef} className="relative h-full w-full origin-top overflow-hidden bg-paper will-change-transform">
          {/* Hilos */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="absolute inset-0 h-full w-full text-stroke"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              {THREADS.map((_, i) => (
                <path
                  key={i}
                  ref={(el) => (pathRefs.current[i] = el)}
                  d={`M0 ${cy}L${size.w} ${cy}`}
                  strokeWidth="1.2"
                  style={{ strokeOpacity: 0 }}
                />
              ))}
              {/* Firma completa que se escribe sobre la línea al hacer scroll */}
              <path
                ref={sigRef}
                d={sigD}
                pathLength={1}
                strokeWidth="1.9"
                style={{ strokeDasharray: 1, strokeDashoffset: 1, strokeOpacity: 0 }}
              />
            </g>
            {/* Luz brillante en la punta de la firma (solo en modo oscuro) */}
            <g style={{ opacity: 'var(--c-spark-a)' }}>
              <path
                ref={sparkRef}
                d={sigD}
                pathLength={1}
                fill="none"
                className="line-spark"
                strokeWidth="2.8"
                strokeLinecap="round"
                style={{ strokeDasharray: '0 2', opacity: 0 }}
              />
            </g>
          </svg>

          {/* Textos */}
          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-[9vh] sm:px-8 md:pb-[11vh]">
            <div className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-12">
              <h1
                aria-label={title}
                className="font-script text-[clamp(1.9rem,8.4vw,2.4rem)] leading-[1.05] text-night sm:text-5xl md:whitespace-nowrap md:text-[2.3rem] lg:text-[2.9rem] xl:text-[3.3rem]"
              >
                {/* Móvil: un solo bloque que fluye; escritorio: las 2 líneas definidas */}
                {(mobile || !titleLines ? [title] : titleLines).map((line, i) => (
                  <span key={line} aria-hidden="true" className="block">
                    {/* El span exterior se desplaza con el scroll; el interior hace la entrada */}
                    <span ref={(el) => (lineRefs.current[i] = el)} className="block will-change-transform">
                      <span className="-mr-[0.25em] block overflow-hidden pb-[0.12em] pr-[0.25em]">
                        <span
                          className="block"
                          style={{
                            ...enter(0.05 + i * 0.18, 0),
                            transform: textOn ? 'translateY(0)' : 'translateY(105%)',
                          }}
                        >
                          {line}
                        </span>
                      </span>
                    </span>
                  </span>
                ))}
              </h1>

              <div ref={copyRef}>
                <p className="max-w-md text-lg leading-[1.75] text-graphite-soft" style={enter(0.45)}>
                  {parts.map((p, i) =>
                    p.index === undefined ? (
                      <span key={i}>{p.text}</span>
                    ) : (
                      <span
                        key={i}
                        className="bg-[linear-gradient(currentColor,currentColor)] bg-left-bottom bg-no-repeat transition-[color,background-size] duration-700 ease-out"
                        style={{
                          color: active === p.index ? 'rgb(var(--c-night))' : undefined,
                          backgroundSize: active === p.index && textOn ? '100% 1px' : '0% 1px',
                        }}
                      >
                        {p.text}
                      </span>
                    ),
                  )}
                </p>
                <div className="mt-6" style={enter(0.6)}>
                  <HomeButton />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
