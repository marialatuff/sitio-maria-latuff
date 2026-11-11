/**
 * Marcos de presentación:
 * - MacWindow: ventana de macOS sin bordes (barra superior con los tres botones), igual que el primer recorrido.
 * - PhoneFrame: iPhone 16 en aluminio claro, de frente, con Dynamic Island y botones laterales.
 */

/** Ventana de Mac: barra oscura con semáforo y título; el contenido va debajo, sin marco. */
export function MacWindow({ children, title = 'Bloo · Plataforma de gestión educativa', ratio = '16 / 10' }) {
  return (
    // Franja fina y radio pequeño; las medidas escalan con el ancho de la ventana (cqw)
    <div className="overflow-hidden" style={{ containerType: 'inline-size', borderRadius: 'clamp(4px, 0.9cqw, 8px)', boxShadow: '0 18px 40px -24px rgba(0,0,0,.28)' }}>
      <div className="flex items-center bg-[#202020]" style={{ gap: '0.7cqw', padding: '0.75cqw 1.2cqw' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} className="shrink-0 rounded-full" style={{ background: c, width: '0.95cqw', height: '0.95cqw', minWidth: 5, minHeight: 5 }} />
        ))}
        <span className="truncate text-snow/45" style={{ marginLeft: '1.2cqw', fontSize: 'clamp(7px, 1.05cqw, 11px)', lineHeight: 1 }}>{title}</span>
      </div>
      <div className="relative overflow-hidden bg-white" style={{ aspectRatio: ratio }}>
        {children}
      </div>
    </div>
  );
}

// Proporciones del iPhone 16 (pantalla 393 × 852 pt)
export const PHONE_W = 393;
export const PHONE_H = 852;

/* Acabados del iPhone: blanco (Bloo) y negro metálico (PUMA) */
const FINISH = {
  white: {
    rim: 'linear-gradient(90deg, #a9a7a2 0%, #e9e7e2 6%, #fbfaf7 22%, #f1efea 50%, #fbfaf7 78%, #e9e7e2 94%, #a9a7a2 100%)',
    edge: '#8f8d88',
    btn: 'linear-gradient(90deg, #8a8883 0%, #ecebe6 45%, #b7b5b0 100%)',
    btnR: 'linear-gradient(270deg, #8a8883 0%, #ecebe6 45%, #b7b5b0 100%)',
    glow: 'inset 0 0 0 1px rgba(255,255,255,.7), inset 0 2px 3px rgba(255,255,255,.9), inset 0 -2px 4px rgba(0,0,0,.18)',
  },
  black: {
    rim: 'linear-gradient(90deg, #0b0b0c 0%, #3b3b3f 6%, #6a6a70 14%, #26262a 35%, #1a1a1d 50%, #26262a 65%, #6a6a70 86%, #3b3b3f 94%, #0b0b0c 100%)',
    edge: '#000',
    btn: 'linear-gradient(90deg, #0d0d0f 0%, #5c5c62 45%, #232326 100%)',
    btnR: 'linear-gradient(270deg, #0d0d0f 0%, #5c5c62 45%, #232326 100%)',
    glow: 'inset 0 0 0 1px rgba(255,255,255,.12), inset 0 2px 3px rgba(255,255,255,.18), inset 0 -2px 4px rgba(0,0,0,.6)',
  },
};

/**
 * iPhone 16 realista: canto metálico con brillo, botones laterales que sobresalen
 * (acción y volumen a la izquierda; encendido y Control de Cámara a la derecha),
 * bisel negro fino y Dynamic Island. `color`: 'white' (Bloo) | 'black' (PUMA, negro metálico).
 */
export function PhoneFrame({ children, color = 'white' }) {
  const f = FINISH[color] || FINISH.white;
  const btn = (side, top, h) => (
    <span
      className="absolute"
      style={{
        [side]: '-2.9%',
        top,
        height: h,
        width: '3.4%',
        borderRadius: side === 'left' ? '3px 0 0 3px' : '0 3px 3px 0',
        background: side === 'left' ? f.btn : f.btnR,
        boxShadow: `0 0 0 0.5px ${f.edge}, 0 1px 2px rgba(0,0,0,.35)`,
      }}
    />
  );
  return (
    <div className="relative">
      {btn('left', '16.5%', '4.2%')}
      {btn('left', '24%', '7.4%')}
      {btn('left', '33%', '7.4%')}
      {btn('right', '26%', '10.5%')}
      {btn('right', '61%', '6%')}
      {/* Canto metálico */}
      <div
        className="relative rounded-[17.5%/8.1%] p-[2.5%]"
        style={{ background: f.rim, boxShadow: `${f.glow}, 0 0 0 1px ${f.edge}, 0 22px 40px -22px rgba(0,0,0,.45)` }}
      >
        {/* Bisel negro fino */}
        <div className="rounded-[16%/7.4%] bg-[#050506] p-[2.7%]" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)' }}>
          <div className="relative overflow-hidden rounded-[13.6%/6.3%] bg-white" style={{ aspectRatio: `${PHONE_W} / ${PHONE_H}` }}>
            {children}
            {/* Dynamic Island */}
            <span className="absolute left-1/2 top-[1.3%] z-30 h-[4.1%] w-[32%] -translate-x-1/2 rounded-full bg-black" />
            {/* Reflejo sutil del vidrio */}
            <span className="pointer-events-none absolute inset-0 z-30" style={{ background: 'linear-gradient(125deg, rgba(255,255,255,.08), transparent 35%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}