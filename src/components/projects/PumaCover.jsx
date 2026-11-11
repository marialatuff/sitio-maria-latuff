import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import oficina from '../../assets/projects/puma/portada-oficina.jpg';
import pumaFormularios from '../../assets/projects/puma/formularios.jpg';
import pumaUsuarios from '../../assets/projects/puma/usuarios.jpg';
import pumaAgregarUsuario from '../../assets/projects/puma/agregar-usuario.jpg';

/**
 * Portada de PUMA Recruiter como video corto: foto de oficina (de María) con las pantallas
 * del software montadas en el monitor, en perspectiva. La escena se acerca muy lento y
 * las vistas del sistema se van alternando y desplazando, como si alguien lo estuviera usando.
 */

const PHOTO_W = 2000;
const PHOTO_H = 1090;
// Esquinas de la pantalla del monitor dentro de la foto (sup-izq, sup-der, inf-der, inf-izq)
const QUAD = [
  [301, 141],
  [948, 129],
  [1005, 568],
  [366, 664],
];
const SCREEN_W = 1600;
const SCREEN_H = 900;

/** Matriz CSS que lleva un rectángulo w×h a un cuadrilátero (homografía). */
function quadMatrix(w, h, q) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const A = [];
  const b = [];
  src.forEach(([x, y], i) => {
    const [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  });
  // Eliminación de Gauss
  const n = 8;
  for (let c = 0; c < n; c += 1) {
    let p = c;
    for (let r = c + 1; r < n; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    [b[c], b[p]] = [b[p], b[c]];
    for (let r = c + 1; r < n; r += 1) {
      const f = A[r][c] / A[c][c];
      for (let k = c; k < n; k += 1) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const s = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r -= 1) {
    let acc = b[r];
    for (let k = r + 1; k < n; k += 1) acc -= A[r][k] * s[k];
    s[r] = acc / A[r][r];
  }
  const [a, bb, c, d, e, f, g, hh] = s;
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

const SCREENS = [pumaFormularios, pumaUsuarios, pumaAgregarUsuario];

export default function PumaCover() {
  const boxRef = useRef(null);
  const [fit, setFit] = useState({ s: 0.3, x: 0, y: 0 });
  const matrix = useMemo(() => quadMatrix(SCREEN_W, SCREEN_H, QUAD), []);

  // La foto cubre la tarjeta (como object-cover), centrada un poco hacia el monitor
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([en]) => {
      const { width: W, height: H } = en.contentRect;
      const s = Math.max(W / PHOTO_W, H / PHOTO_H);
      setFit({ s, x: Math.min(0, Math.max(W - PHOTO_W * s, (W - PHOTO_W * s) * 0.35)), y: (H - PHOTO_H * s) / 2 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative h-full w-full overflow-hidden bg-[#1b1b1b]">
      <div
        className="absolute left-0 top-0"
        style={{ width: PHOTO_W, height: PHOTO_H, transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.s})`, transformOrigin: '0 0' }}
      >
        {/* Escena que se acerca muy lento hacia el monitor */}
        <div className="absolute inset-0" style={{ transformOrigin: '33% 36%', animation: 'puma-cover-zoom 18s ease-in-out infinite alternate' }}>
          <img src={oficina} alt="" className="absolute inset-0 h-full w-full" />
          {/* Pantalla del monitor en perspectiva */}
          <div className="absolute left-0 top-0 overflow-hidden bg-white" style={{ width: SCREEN_W, height: SCREEN_H, transform: matrix, transformOrigin: '0 0' }}>
            {SCREENS.map((src, i) => (
              <div key={src} className="absolute inset-0" style={{ animation: `puma-cover-swap 12s linear ${i * 4}s infinite`, opacity: i === 0 ? 1 : 0 }}>
                <img src={src} alt="" className="block w-full" style={{ animation: 'puma-cover-pan 12s ease-in-out infinite' }} />
              </div>
            ))}
            {/* Brillo y viñeta para integrar la pantalla con la luz de la foto */}
            <span className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(120deg, rgba(255,255,255,.10), transparent 40%), linear-gradient(0deg, rgba(0,0,0,.18), transparent 35%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
