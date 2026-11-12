import { DualPlayer } from './ResponsiveFlows.jsx';
import dashboard from '../../assets/projects/imex/dashboard.jpg';
import invoices from '../../assets/projects/imex/facturas.jpg';
import tickets from '../../assets/projects/imex/tickets.jpg';
import lightValue from '../../assets/projects/imex/claro-valor.jpg';
import lightAbout from '../../assets/projects/imex/claro-about.jpg';
import lightTickets from '../../assets/projects/imex/tickets-light.jpg';

/**
 * Animación responsiva (solo reproducción) en modo oscuro o claro (`theme`).
 * Oscuro: Propuesta de valor → Facturas → Mis tickets. Claro: Propuesta de valor → About Imex → Mis tickets.
 * Web: las pantallas originales de María (1440 × 1000) en ventana de Mac; el cursor navega por el menú lateral.
 * Móvil: la misma vista adaptada a iPhone (recreada en HTML con el sistema visual de la plataforma); el dedo usa la barra inferior.
 */

const WW = 1440;
const WH = 1000;
const FONT = '"Work Sans", Inter, system-ui, sans-serif';

const PALETTE = {
  dark: {
    bg: '#141517',
    top: 'radial-gradient(120% 100% at 100% 0%, rgba(40,110,100,.35), transparent 60%)',
    card: '#1d1f20',
    line: '#2a2d2e',
    nav: '#101112',
    ink: '#f2f2f2',
    soft: '#c9cccc',
    mute: '#5f6466',
    teal: '#3fb8a6',
    cyan: '#66f3f8',
    pill: '#26302f',
    pillIcon: '#7fe3d2',
    medal: { ribbon: '#d9dcdc', ring: '#1f3a3a', stroke: '#4d6b6b', num: '#f2f2f2' },
  },
  light: {
    bg: '#f1f3f3',
    top: 'radial-gradient(120% 100% at 0% 100%, rgba(150,200,195,.35), transparent 60%)',
    card: '#ffffff',
    line: '#dfe3e3',
    nav: '#fbfcfc',
    ink: '#2b2f30',
    soft: '#4a5052',
    mute: '#a3a9aa',
    teal: '#3fa898',
    cyan: '#5ff0f5',
    pill: '#e3efed',
    pillIcon: '#2f8f80',
    medal: { ribbon: '#a8b8b6', ring: '#c9d3d2', stroke: '#b5c1c0', num: '#ffffff' },
  },
};

const SCREENS = {
  dark: [
    { key: 'value', web: dashboard, label: 'Propuesta de valor', tab: 'Inicio', y: 138 },
    { key: 'invoices', web: invoices, label: 'Facturas', tab: 'Facturas', y: 392 },
    { key: 'tickets', web: tickets, label: 'Mis tickets', tab: 'Tickets', y: 445 },
  ],
  light: [
    { key: 'value', web: lightValue, label: 'Propuesta de valor', tab: 'Inicio', y: 135 },
    { key: 'about', web: lightAbout, label: 'About Imex', tab: 'About', y: 187 },
    { key: 'tickets', web: lightTickets, label: 'Mis tickets', tab: 'Tickets', y: 442 },
  ],
};

const ICON = {
  value: 'M8 3h8l-2 6h-4z M12 21a6 6 0 1 0 0-12 6 6 0 0 0 0 12z',
  invoices: 'M6 3h12v18H6z M9 8h6 M9 12h6 M9 16h4',
  about: 'M4 21V8l8-5 8 5v13 M9 21v-6h6v6 M8 11h2 M14 11h2',
  tickets: 'M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z M12 7v10',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  down: 'M12 4v11 M7 10l5 5 5-5 M5 20h14',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
  cal: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
  plus: 'M12 5v14 M5 12h14',
  send: 'M3 11l18-8-8 18-2-8z',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
};

function Svg({ d, size = 16, color, sw = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
      <path d={d} />
    </svg>
  );
}

/* ---------- Web: pantallas originales + zonas del menú lateral ---------- */
function Web({ ui }) {
  const list = SCREENS[ui.theme];
  const s = list[ui.phase];
  return (
    <div className="absolute inset-0" style={{ background: PALETTE[ui.theme].bg }}>
      <img key={s.key} src={s.web} alt="" className="absolute inset-0 block" style={{ width: WW, height: WH, animation: 'bloo-screen .12s ease-out both' }} />
      {list.map((it) => (
        <div key={it.key} data-t={it.key} className="absolute" style={{ left: 18, top: it.y, width: 150, height: 26 }} />
      ))}
    </div>
  );
}

/* ---------- Móvil: piezas comunes ---------- */
function Medal({ K }) {
  const m = K.medal;
  return (
    <svg width="44" height="50" viewBox="0 0 44 50" fill="none">
      <path d="M8 2h10l6 14M36 2H26l-6 14" stroke={m.ribbon} strokeWidth="1.4" />
      <path d="M8 2l8 16M36 2l-8 16" stroke={m.ribbon} strokeWidth="1" opacity=".7" />
      <circle cx="22" cy="32" r="13" fill={m.ring} stroke={m.stroke} strokeWidth="1.2" />
      <text x="22" y="38" textAnchor="middle" fill={m.num} fontSize="16" fontFamily={FONT}>
        1
      </text>
    </svg>
  );
}

function DocIcon() {
  return (
    <div className="relative" style={{ width: 40, height: 64, borderRadius: 3, background: 'linear-gradient(160deg, #3fc3b5, #13615a)', boxShadow: 'inset -4px 0 0 rgba(255,255,255,.25)' }}>
      {[14, 22, 30, 38].map((y) => (
        <span key={y} className="absolute" style={{ top: y, left: 9, width: 20, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.45)' }} />
      ))}
    </div>
  );
}

function Card({ K, title, sub, icon, height = 200 }) {
  const shadow = K === PALETTE.light ? '0 6px 18px -10px rgba(0,0,0,.18)' : 'none';
  return (
    <div style={{ background: K.card, borderRadius: 6, padding: 12, height, boxShadow: shadow }}>
      {icon}
      <div style={{ marginTop: 14, fontSize: 13, lineHeight: '17px', color: K.ink }}>{title}</div>
      {sub && <div style={{ marginTop: 8, fontSize: 10.5, lineHeight: '14px', color: K.mute }}>{sub}</div>}
      <div className="flex" style={{ gap: 16, marginTop: 16 }}>
        <Svg d={ICON.eye} color={K.soft} />
        <Svg d={ICON.down} color={K.soft} />
      </div>
    </div>
  );
}

function PageHead({ K, title, sub }) {
  return (
    <>
      <div style={{ fontSize: 31, lineHeight: '36px', color: K.ink }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 15, color: K.mute }}>{sub}</div>
    </>
  );
}

/* ---------- Móvil: vistas ---------- */
function ValueMobile({ K, light }) {
  const cards = light
    ? [['Proposal title 1', 'Lorem ipsum dolor sit amet consectetur.'], ['Proposal title 2', 'Lorem ipsum dolor sit amet consectetur.'], ['Proposal title 3', 'Lorem ipsum dolor sit amet consectetur.']]
    : [['Nowcasting revenue with customs data'], ['Anticipando actividad agro exportadora…'], ['Registros Aduaneros como…']];
  return (
    <div style={{ padding: '18px 20px 0' }}>
      <div className="relative text-center" style={{ paddingTop: 22 }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: 320, height: 160, background: `radial-gradient(50% 50% at 50% 30%, ${light ? 'rgba(150,220,200,.35)' : 'rgba(80,170,150,.28)'}, transparent 70%)` }} />
        <div className="relative" style={{ fontSize: 30, color: K.ink }}>Hi, Renato!</div>
        <div className="relative" style={{ marginTop: 8, fontSize: 15, color: K.soft }}>Check out all the options we have for you</div>
      </div>
      <div className="flex" style={{ gap: 12, marginTop: 26, marginRight: -20 }}>
        {cards.map(([t, s]) => (
          <div key={t} className="shrink-0" style={{ width: 150 }}>
            <Card K={K} title={t} sub={s} icon={<Medal K={K} />} height={196} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, borderRadius: 10, overflow: 'hidden', background: '#6fae95' }}>
        <div style={{ padding: '16px 18px', background: 'linear-gradient(120deg, #22d39a, #1b6f58 70%)' }}>
          <div style={{ fontSize: 22, color: '#fff' }}>Latest News</div>
          <div style={{ marginTop: 4, fontSize: 13.5, color: '#e6fff6' }}>Stay up to date on our activities</div>
        </div>
        <div style={{ margin: 10, background: '#fff', borderRadius: 4, padding: 12 }}>
          <div style={{ fontSize: 14, color: '#111' }}>April 2026 country coverage expansion</div>
          <div style={{ marginTop: 6, fontSize: 10.5, lineHeight: '15px', color: '#444' }}>We've expanded our country coverage with new customs data sources across key trade markets.</div>
          <span className="inline-block" style={{ marginTop: 10, padding: '3px 10px', borderRadius: 10, background: '#222', color: '#fff', fontSize: 9 }}>Read more</span>
        </div>
      </div>
    </div>
  );
}

function InvoicesMobile({ K }) {
  return (
    <div style={{ padding: '22px 20px 0' }}>
      <PageHead K={K} title="Invoices" sub="Invoices / Payment Information" />
      <div className="inline-flex items-center" style={{ marginTop: 18, gap: 30, padding: '10px 12px', background: K.card, borderRadius: 4, fontSize: 13, color: K.ink }}>
        Date <Svg d={ICON.cal} size={18} color={K.soft} />
      </div>
      <div className="grid grid-cols-2" style={{ gap: 12, marginTop: 22 }}>
        <Card K={K} title="Invoice 1 title large lorem ipsum…" sub="Date: June 03, 2026" icon={<DocIcon />} />
        <Card K={K} title="Invoice 2 title" sub="Date: June 03, 2026" icon={<DocIcon />} />
      </div>
    </div>
  );
}

function AboutMobile({ K }) {
  return (
    <div style={{ padding: '22px 20px 0' }}>
      <PageHead K={K} title="About Imexdbusiness" sub="Full access to all our institutional information" />
      <div className="flex" style={{ marginTop: 20, fontSize: 12, borderBottom: `1px solid ${K.line}` }}>
        <span style={{ padding: '10px 14px', background: '#dde3e3', color: '#6b7375', borderRadius: '6px 6px 0 0' }}>Our Databases</span>
        <span style={{ padding: '10px 14px', background: K.card, color: K.soft, borderRadius: '6px 6px 0 0' }}>Our company details</span>
      </div>
      <div className="grid grid-cols-2" style={{ gap: 12, marginTop: 22 }}>
        <Card K={K} title="Brochure" sub="Lorem ipsum dolor sit amet consectetur." icon={<DocIcon />} />
        <Card K={K} title="Executive one pager" sub="Lorem ipsum dolor sit amet consectetur." icon={<DocIcon />} />
      </div>
    </div>
  );
}

function TicketsMobile({ K, light }) {
  const rows = [
    ['Messager', 'Example lorem ipsum', 'July 22, 2026 · 15:45 hrs.', 'Support'],
    ['ChatApp', 'Sample placeholder text', 'August 5, 2026 · 10:30 hrs.', 'Request'],
    ['MessageHub', 'Another example text', 'September 15, 2026 · 12:00 hrs.', 'Request'],
  ];
  return (
    <div style={{ padding: '22px 20px 0' }}>
      <PageHead K={K} title="My tickets" sub="View your requests, issues, or inquiries" />
      <div className="flex" style={{ gap: 10, marginTop: 18 }}>
        <div className="flex flex-1 items-center" style={{ gap: 8, padding: '10px 12px', background: K.card, borderRadius: 4, fontSize: 12, color: K.mute }}>
          <Svg d={ICON.search} size={17} color={K.soft} /> Search…
        </div>
        <div className="flex items-center" style={{ gap: 6, padding: '0 14px', borderRadius: 20, border: `1px solid ${light ? '#cfd5d5' : '#4a4e50'}`, background: light ? '#fff' : '#26292a', fontSize: 12.5, color: K.ink }}>
          <Svg d={ICON.plus} size={14} color={K.ink} /> New
        </div>
      </div>
      <div className="flex flex-col" style={{ gap: 10, marginTop: 18 }}>
        {rows.map(([app, t, d, type]) => (
          <div key={app} style={{ background: K.card, borderRadius: 6, padding: '12px 14px', boxShadow: light ? '0 6px 18px -12px rgba(0,0,0,.2)' : 'none' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 10.5, color: K.teal }}>{app}</span>
              <span className="flex items-center" style={{ gap: 4, padding: '2px 9px', borderRadius: 10, background: K.cyan, color: '#0b3a3c', fontSize: 10 }}>
                <Svg d={ICON.send} size={11} color="#0b3a3c" /> Sent
              </span>
            </div>
            <div className="flex" style={{ gap: 10, marginTop: 8 }}>
              <span className="grid shrink-0 place-items-center" style={{ width: 30, height: 30, borderRadius: '50%', background: '#9fb3b0', color: light ? '#fff' : K.bg, fontSize: 18, fontWeight: 600 }}>?</span>
              <div>
                <div style={{ fontSize: 13.5, color: K.ink }}>{t}</div>
                <div style={{ marginTop: 2, fontSize: 11.5, lineHeight: '15px', color: K.soft }}>Content…Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                <div style={{ marginTop: 8, fontSize: 10.5, color: K.mute }}>
                  {d} · {type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOBILE = { value: ValueMobile, invoices: InvoicesMobile, about: AboutMobile, tickets: TicketsMobile };

function Mobile({ ui }) {
  const K = PALETTE[ui.theme];
  const light = ui.theme === 'light';
  const list = SCREENS[ui.theme];
  const s = list[ui.phase];
  const Screen = MOBILE[s.key];
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: K.bg, fontFamily: FONT }}>
      {/* Barra superior */}
      <div className="flex items-center justify-between" style={{ height: 104, padding: '54px 20px 0', background: K.top }}>
        <span style={{ fontSize: 15, fontStyle: 'italic', color: '#2ea6c4', letterSpacing: '.01em' }}>
          Imex<b style={{ fontStyle: 'normal', background: '#1b8ac0', color: light ? '#fff' : '#062a3a', padding: '0 2px', margin: '0 1px' }}>DB</b>usiness
        </span>
        <span className="flex items-center" style={{ gap: 12 }}>
          <span className="grid place-items-center" style={{ width: 30, height: 30, borderRadius: '50%', background: light ? '#ffffff' : '#cfd8d6', boxShadow: light ? '0 2px 6px rgba(0,0,0,.12)' : 'none' }}>
            <Svg d="M6 4h12l3 5-9 11L3 9z M3 9h18 M9 4l3 16 3-16" size={16} color="#3a4a48" sw={1.3} />
          </span>
          <Svg d={ICON.menu} size={22} color={K.ink} />
        </span>
      </div>
      <div key={s.key} style={{ animation: 'bloo-screen .12s ease-out both' }}>
        <Screen K={K} light={light} />
      </div>
      {/* Barra inferior de navegación */}
      <div className="absolute inset-x-0 bottom-0 flex justify-around" style={{ height: 84, paddingTop: 10, background: K.nav, borderTop: `1px solid ${K.line}` }}>
        {list.map((it, i) => {
          const on = i === ui.phase;
          return (
            <span key={it.key} data-t={it.key} className="flex flex-col items-center" style={{ gap: 4, width: 90, fontSize: 10.5, color: on ? K.ink : K.mute }}>
              <span className="grid place-items-center" style={{ width: 44, height: 28, borderRadius: 14, background: on ? K.pill : 'transparent' }}>
                <Svg d={ICON[it.key]} size={18} color={on ? K.pillIcon : K.mute} />
              </span>
              {it.tab}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ImexResponsive({ theme = 'dark' }) {
  const list = SCREENS[theme];
  return (
    <DualPlayer
      label={theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
      title="Plataforma de datos de comercio exterior"
      phases={list.map((s) => s.label)}
      initial={{ phase: 0, theme }}
      phoneColor={theme === 'light' ? 'white' : 'black'}
      ww={WW}
      wh={WH}
      Web={Web}
      Mobile={Mobile}
      script={async ({ set, press, sleep }) => {
        for (const i of [1, 2, 0]) {
          await sleep(2400);
          await press(list[i].key);
          set({ phase: i });
        }
        await sleep(600);
      }}
    />
  );
}
