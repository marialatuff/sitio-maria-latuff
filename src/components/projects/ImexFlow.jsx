import { FlowPlayer } from './BlooFlow.jsx';
import login from '../../assets/projects/imex/login.jpg';
import landing from '../../assets/projects/imex/aterrizaje.jpg';
import landingClean from '../../assets/projects/imex/aterrizaje-clean.jpg';
import onboardingClean from '../../assets/projects/imex/onboarding-clean.jpg';
import analyzing from '../../assets/projects/imex/scree.jpg';
import analyzingClean from '../../assets/projects/imex/scree-clean.jpg';
import dashboard from '../../assets/projects/imex/dashboard.jpg';
import tickets from '../../assets/projects/imex/tickets.jpg';
import ticketsLight from '../../assets/projects/imex/tickets-light.jpg';

/**
 * Recorrido principal del Ecosistema de adquisición (solo reproducción).
 * Login → Aterrizaje → Onboarding (3 preguntas) → Análisis del perfil → Sala virtual → Mis tickets → modo claro.
 * Se usan las pantallas originales de María (1440 × 1000). Donde hay animación, una copia "limpia" de la
 * pantalla hace de fondo y encima se dibujan (o se recortan del original) los elementos que se mueven.
 */

const W = 1440;
const H = 1000;
const FONT = '"Work Sans", Inter, system-ui, sans-serif';
const CYAN = '#01ffcd';

const PHASES = [
  'Inicio de sesión',
  'Aterrizaje: bienvenida personalizada',
  'Onboarding: perfil de comercio exterior',
  'El sistema analiza las respuestas y detecta el tipo de usuario',
  'Sala virtual: propuesta de valor según el perfil',
  'Mis tickets y cambio a modo claro',
];

const QUESTIONS = [
  {
    text: "To begin, could you briefly tell us about your role and the type of decisions you're involved in on a daily basis?",
    placeholder:
      'Example: I oversee project delivery and strategic planning, making decisions that align technology solutions with client needs to ensure successful digital transformation and innovation.',
  },
  {
    text: 'Which product categories matter most to your import and export operations?',
    options: ['Agri-food', 'Machinery', 'Textiles', 'Chemicals', 'Electronics', 'Automotive'],
  },
  {
    text: 'Which markets would you like to monitor in your virtual room?',
    options: ['India', 'European Union', 'United States', 'Latin America', 'China', 'Middle East'],
  },
];
const ANSWER = 'I lead sourcing at an agri-food importer. I decide which suppliers and origin countries we buy from each season.';

export const INITIAL = { phase: 0, screen: 'login', email: '', pass: '', q: 0, answer: '', picked: [], progress: 0, gauge: 0, analyzed: false, profile: false, theme: 'dark' };

/** Zona invisible a la que apunta el cursor (data-t). */
function Target({ t, x, y, w, h }) {
  return <div data-t={t} className="absolute" style={{ left: x, top: y, width: w, height: h }} />;
}

/** Recorte de la pantalla original que entra con animación sobre el fondo limpio. */
function Piece({ src, rect: [x0, y0, x1, y1], delay = 0, anim = 'imex-rise' }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: `${W}px ${H}px`,
        clipPath: `inset(${y0}px ${W - x1}px ${H - y1}px ${x0}px)`,
        animation: `${anim} .8s cubic-bezier(.2,.7,.2,1) ${delay}s both`,
      }}
    />
  );
}

const Img = ({ src }) => <img src={src} alt="" className="absolute inset-0 block" style={{ width: W, height: H }} />;

function Caret() {
  return <span style={{ display: 'inline-block', width: 1.5, height: '1.1em', marginLeft: 1, verticalAlign: 'text-bottom', background: '#e6e6e6', animation: 'imex-caret 1s steps(1) infinite' }} />;
}

/* ---------- 1. Login ---------- */
function Login({ ui }) {
  const input = (top, width, value) =>
    value ? (
      <div className="absolute flex items-center" style={{ left: 551, top, width, height: 48, background: '#1f2022', borderRadius: 4, paddingLeft: 10, fontSize: 16, color: '#e6e6e6', letterSpacing: value.startsWith('•') ? 2 : 0 }}>
        {value}
        <Caret />
      </div>
    ) : null;
  return (
    <>
      <Img src={login} />
      {/* Luz verde superior que late lento */}
      <div
        className="absolute"
        style={{ left: 270, top: -140, width: 900, height: 420, background: 'radial-gradient(50% 50% at 50% 35%, rgba(70,255,200,.55), rgba(20,160,140,.18) 45%, transparent 70%)', mixBlendMode: 'screen', animation: 'imex-glow 3.6s ease-in-out infinite' }}
      />
      {input(336, 338, ui.email)}
      {input(410, 280, ui.pass)}
      <Target t="email" x={551} y={336} w={338} h={48} />
      <Target t="pass" x={551} y={410} w={280} h={48} />
      <Target t="continue" x={568} y={504} w={304} h={36} />
    </>
  );
}

/* ---------- 2. Aterrizaje ---------- */
function Landing() {
  return (
    <>
      <Img src={landingClean} />
      <Piece src={landing} rect={[88, 255, 748, 442]} delay={0.1} />
      <Piece src={landing} rect={[158, 484, 562, 676]} delay={0.35} />
      <Piece src={landing} rect={[152, 716, 438, 788]} delay={0.55} />
      <Piece src={landing} rect={[872, 262, 1440, 748]} delay={0.25} anim="imex-slide" />
      <Target t="start" x={182} y={736} w={226} h={32} />
    </>
  );
}

/* ---------- 3. Onboarding ---------- */
function Onboarding({ ui }) {
  const q = QUESTIONS[ui.q];
  const p = ui.progress;
  return (
    <div style={{ fontFamily: FONT }}>
      <Img src={onboardingClean} />
      {/* Barra de progreso con luz en la punta */}
      <span className="absolute" style={{ left: 377, top: 90, fontSize: 16, color: '#f2f2f2' }}>0%</span>
      <div className="absolute" style={{ left: 411, top: 96, width: 581, height: 10, borderRadius: 5, background: '#505251' }}>
        <div className="absolute inset-y-0 left-0" style={{ width: `${p}%`, borderRadius: 5, background: CYAN, transition: 'width .9s cubic-bezier(.45,0,.2,1)' }}>
          <span
            className="absolute"
            style={{ right: -26, top: -21, width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,255,250,.95) 0 8%, rgba(1,255,205,.55) 22%, transparent 65%)', opacity: p > 0 ? 1 : 0, transition: 'opacity .3s' }}
          />
        </div>
      </div>
      <span className="absolute" style={{ left: 1003, top: 90, fontSize: 16, color: '#f2f2f2', fontVariantNumeric: 'tabular-nums' }}>{p}%</span>

      {/* Pregunta actual */}
      <div key={ui.q} style={{ animation: 'imex-rise .45s cubic-bezier(.2,.7,.2,1) both' }}>
        <p className="absolute text-center" style={{ left: 366, top: 308, width: 680, fontSize: 20, fontWeight: 400, lineHeight: '35px', color: '#f2f2f2', letterSpacing: '.01em' }}>
          {q.text}
        </p>
        {q.options ? (
          <div className="absolute grid grid-cols-3" style={{ left: 345, top: 430, width: 723, gap: 16 }}>
            {q.options.map((o) => {
              const on = ui.picked.includes(o);
              return (
                <span
                  key={o}
                  data-t={`opt-${o}`}
                  className="flex items-center justify-center"
                  style={{
                    height: 56,
                    gap: 8,
                    borderRadius: 28,
                    fontSize: 15,
                    border: `1px solid ${on ? CYAN : '#353a38'}`,
                    background: on ? 'rgba(1,255,205,.1)' : '#1d2120',
                    color: on ? CYAN : '#d6d9d8',
                    boxShadow: on ? '0 0 22px -6px rgba(1,255,205,.55)' : 'none',
                    transition: 'all .25s ease',
                  }}
                >
                  {on && <span style={{ fontSize: 13 }}>✓</span>}
                  {o}
                </span>
              );
            })}
          </div>
        ) : (
          <div data-t="answer" className="absolute" style={{ left: 345, top: 419, width: 723, height: 201, background: '#1d2120', padding: '16px 12px', fontSize: 13.5, lineHeight: '22px' }}>
            {ui.answer ? (
              <span style={{ color: '#e8eaea' }}>
                {ui.answer}
                <Caret />
              </span>
            ) : (
              <span style={{ color: '#8a8f8d' }}>{q.placeholder}</span>
            )}
          </div>
        )}
      </div>
      <Target t="next" x={977} y={663} w={78} h={29} />
    </div>
  );
}

/* ---------- 4. Análisis del perfil ---------- */
function Analyzing({ ui }) {
  // Arco abierto abajo (≈244°) centrado en el medidor original
  const cx = 721;
  const cy = 240;
  const r = 102;
  const a0 = (148 * Math.PI) / 180; // abajo a la izquierda
  const a1 = (32 * Math.PI) / 180; // abajo a la derecha
  const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)];
  const p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
  const arc = `M${p0[0]} ${p0[1]} A ${r} ${r} 0 1 1 ${p1[0]} ${p1[1]}`;
  return (
    <div style={{ fontFamily: FONT }}>
      <Img src={analyzingClean} />
      <svg className="absolute left-0 top-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="imex-gauge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2ffff" />
            <stop offset="1" stopColor="#5ff6fe" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy + 8} r={88} fill="#0e1211" />
        <path d={arc} fill="none" stroke="#1d2423" strokeWidth="15" strokeLinecap="round" />
        <path d={arc} pathLength="100" fill="none" stroke="url(#imex-gauge)" strokeWidth="15" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={100 - ui.gauge} style={{ filter: 'drop-shadow(0 0 6px rgba(95,246,254,.45))' }} />
        <text x={cx + 4} y={cy + 13} textAnchor="middle" fill="#00fecc" fontSize="42" fontWeight="600" fontFamily={FONT}>
          {ui.gauge}%
        </text>
        <text x={cx} y={cy + 42} textAnchor="middle" fill="#e8eaea" fontSize="13.5" fontFamily={FONT}>
          Inputs analyzed
        </text>
      </svg>
      {ui.analyzed && (
        <>
          <Piece src={analyzing} rect={[355, 412, 1085, 602]} />
          <Piece src={analyzing} rect={[628, 652, 814, 714]} delay={0.3} />
        </>
      )}
      {/* Perfil detectado por el sistema */}
      {ui.profile && (
        <div className="absolute flex w-full justify-center" style={{ top: 760, animation: 'imex-rise .5s cubic-bezier(.2,.7,.2,1) both' }}>
          <span className="flex items-center" style={{ gap: 10, padding: '10px 20px', borderRadius: 24, border: '1px solid rgba(1,255,205,.35)', background: 'rgba(1,255,205,.07)', fontSize: 14.5, color: '#d6d9d8' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: CYAN, boxShadow: `0 0 10px ${CYAN}` }} />
            Profile detected: <span style={{ color: CYAN }}>Importer · Agri-food · India / EU</span>
          </span>
        </div>
      )}
      <Target t="room" x={650} y={671} w={140} h={27} />
    </div>
  );
}

/* ---------- 5–6. Sala virtual y Mis tickets ---------- */
function Dashboard() {
  return (
    <>
      <Img src={dashboard} />
      <Target t="tickets" x={18} y={633} w={140} h={26} />
    </>
  );
}

function Tickets({ ui }) {
  const light = ui.theme === 'light';
  return (
    <>
      <Img src={tickets} />
      {/* Modo claro: cambio de tema con fundido suave */}
      <div className="absolute inset-0" style={{ opacity: light ? 1 : 0, transition: 'opacity .55s ease' }}>
        <Img src={ticketsLight} />
      </div>
      <Target t="theme" x={1137} y={22} w={32} h={32} />
    </>
  );
}

export const SCREENS = { login: Login, landing: Landing, onboarding: Onboarding, analyzing: Analyzing, dashboard: Dashboard, tickets: Tickets };

export default function ImexFlow() {
  return (
    <FlowPlayer
      phases={PHASES}
      initial={INITIAL}
      w={W}
      h={H}
      bg="#141517"
      title="Plataforma de datos de comercio exterior"
      description="Recorrido: inicio de sesión, aterrizaje personalizado, onboarding de tres preguntas, análisis del perfil, sala virtual, mis tickets y cambio a modo claro."
      script={async ({ set, moveTo, click, type, sleep, alive }) => {
        // 1. Login
        await sleep(1800);
        await moveTo('email');
        await click();
        await type('email', 'renato@agroimports.in');
        await moveTo('pass', 600);
        await click();
        await type('pass', '••••••••••');
        await moveTo('continue', 700);
        await click();
        if (!alive()) return;
        // 2. Aterrizaje
        set({ phase: 1, screen: 'landing' });
        await sleep(2800);
        await moveTo('start');
        await click();
        if (!alive()) return;
        // 3. Onboarding
        set({ phase: 2, screen: 'onboarding', q: 0, progress: 0 });
        await sleep(900);
        await moveTo('answer', 700);
        await click();
        await type('answer', ANSWER);
        await moveTo('next');
        await click();
        set({ q: 1, progress: 33, picked: [] });
        await sleep(1000);
        for (const o of ['Agri-food', 'Machinery']) {
          await moveTo(`opt-${o}`, 700);
          await click();
          set({ picked: o === 'Agri-food' ? [o] : ['Agri-food', o] });
        }
        await moveTo('next');
        await click();
        set({ q: 2, progress: 66, picked: [] });
        await sleep(1000);
        for (const o of ['India', 'European Union']) {
          await moveTo(`opt-${o}`, 700);
          await click();
          set({ picked: o === 'India' ? [o] : ['India', o] });
        }
        await moveTo('next');
        await click();
        set({ progress: 100 });
        await sleep(1500);
        if (!alive()) return;
        // 4. Análisis del perfil
        set({ phase: 3, screen: 'analyzing', gauge: 0 });
        await sleep(500);
        for (let g = 4; g <= 100 && alive(); g += 4) {
          set({ gauge: g });
          await sleep(60);
        }
        set({ analyzed: true });
        await sleep(1500);
        set({ profile: true });
        await sleep(2000);
        await moveTo('room');
        await click();
        if (!alive()) return;
        // 5. Sala virtual
        set({ phase: 4, screen: 'dashboard' });
        await sleep(2800);
        await moveTo('tickets');
        await click();
        // 6. Mis tickets → modo claro
        set({ phase: 5, screen: 'tickets' });
        await sleep(2000);
        await moveTo('theme');
        await click();
        set({ theme: 'light' });
        await sleep(3200);
      }}
    >
      {(ui) => {
        const Screen = SCREENS[ui.screen];
        return (
          <div key={ui.screen} className="absolute inset-0" style={{ animation: 'bloo-screen .12s ease-out both' }}>
            <Screen ui={ui} />
          </div>
        );
      }}
    </FlowPlayer>
  );
}
