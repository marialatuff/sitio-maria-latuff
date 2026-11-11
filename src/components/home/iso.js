/**
 * Utilidades de dibujo de líneas (isométrico + figuras humanas simples)
 * compartidas por el hero y las animaciones de Soluciones.
 */
const C30 = Math.cos(Math.PI / 6);
const f = (n) => n.toFixed(1);

/** Crea un set de primitivas isométricas centradas en (cx, cy) con escala s. */
export function makeIso(cx, cy, s = 1) {
  const proj = (x, y, z) => [cx + (x - y) * C30 * s, cy + ((x + y) * 0.5 - z) * s];
  const pt = (p) => `${f(p[0])} ${f(p[1])}`;
  const line = (a, b) => `M${pt(proj(...a))}L${pt(proj(...b))}`;
  const poly = (pts, close = true) =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${pt(proj(...p))}`).join('') + (close ? 'Z' : '');

  const ring = (r, z, ox = 0, oy = 0) =>
    poly(
      Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * Math.PI * 2;
        return [ox + r * Math.cos(t), oy + r * Math.sin(t), z];
      }),
    );

  const vring = (r, zc, plane = 'xz', ox = 0, oy = 0) =>
    poly(
      Array.from({ length: 48 }, (_, i) => {
        const t = (i / 48) * Math.PI * 2;
        const h = r * Math.cos(t);
        return plane === 'xz' ? [ox + h, oy, zc + r * Math.sin(t)] : [ox, oy + h, zc + r * Math.sin(t)];
      }),
    );

  /** Caja: aristas visibles. */
  const slab = (a, z, h, ox = 0, oy = 0) => [
    poly([[ox - a, oy - a, z + h], [ox + a, oy - a, z + h], [ox + a, oy + a, z + h], [ox - a, oy + a, z + h]]),
    poly([[ox - a, oy + a, z], [ox + a, oy + a, z], [ox + a, oy - a, z]], false),
    line([ox - a, oy + a, z], [ox - a, oy + a, z + h]),
    line([ox + a, oy + a, z], [ox + a, oy + a, z + h]),
    line([ox + a, oy - a, z], [ox + a, oy - a, z + h]),
  ];

  const rays = (z, r1, r2, n = 8, ox = 0, oy = 0) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return line([ox + r1 * Math.cos(t), oy + r1 * Math.sin(t), z], [ox + r2 * Math.cos(t), oy + r2 * Math.sin(t), z]);
    });

  /** Rejilla n×n sobre el plano (para "estrategia"). */
  const grid = (a, n, z = 0) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const v = -a + (2 * a * i) / n;
      out.push(line([v, -a, z], [v, a, z]), line([-a, v, z], [a, v, z]));
    }
    return out;
  };

  /** Recorrido por puntos de la rejilla (camino elegido). */
  const route = (pts, z = 0) => poly(pts.map(([x, y]) => [x, y, z]), false);

  const pyramid = (z = 0, k = 1, ox = 0, oy = 0) => [
    ...slab(90 * k, z, 14 * k, ox, oy),
    ...slab(68 * k, z + 14 * k, 14 * k, ox, oy),
    ...slab(46 * k, z + 28 * k, 14 * k, ox, oy),
    ...slab(24 * k, z + 42 * k, 14 * k, ox, oy),
  ];

  /**
   * Pantalla vertical en perspectiva isométrica (plano xz, a profundidad y).
   * blocks: rectángulos [x0, z0, x1, z1] y lines: [x0, x1, z] relativos a la esquina inferior izquierda.
   */
  const panel = (x, y, w, h, { bar = true, blocks = [], lines = [], z0 = 0 } = {}) => {
    const R = (a0, b0, a1, b1) =>
      poly([[x + a0, y, z0 + b0], [x + a1, y, z0 + b0], [x + a1, y, z0 + b1], [x + a0, y, z0 + b1]]);
    return [
      R(0, 0, w, h),
      ...(bar ? [line([x, y, z0 + h - 10], [x + w, y, z0 + h - 10])] : []),
      ...blocks.map(([a0, b0, a1, b1]) => R(a0, b0, a1, b1)),
      ...lines.map(([a0, a1, b]) => line([x + a0, y, z0 + b], [x + a1, y, z0 + b])),
    ];
  };

  return { proj, line, poly, ring, vring, slab, rays, grid, route, pyramid, panel };
}

/* ---------- Figuras humanas (busto en línea) ---------- */

/** Persona en busto: base = línea de hombros inferior. hair: 'long' (chica) | 'short'; tie: corbata. */
export function person(cx, base, s = 1, { hair = 'short', tie = false } = {}) {
  const hy = base - 62 * s; // centro de la cabeza
  const r = 12 * s;
  const head = `M${f(cx + r)} ${f(hy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx - r)} ${f(hy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx + r)} ${f(hy)}Z`;
  const body = `M${f(cx - 24 * s)} ${f(base)}C${f(cx - 24 * s)} ${f(base - 34 * s)} ${f(cx - 14 * s)} ${f(base - 42 * s)} ${f(cx)} ${f(base - 42 * s)}C${f(cx + 14 * s)} ${f(base - 42 * s)} ${f(cx + 24 * s)} ${f(base - 34 * s)} ${f(cx + 24 * s)} ${f(base)}`;
  const out = [head, body];
  if (hair === 'long') {
    out.push(
      `M${f(cx - r - 1 * s)} ${f(hy + 2 * s)}C${f(cx - r - 3 * s)} ${f(hy - r - 6 * s)} ${f(cx + r + 3 * s)} ${f(hy - r - 6 * s)} ${f(cx + r + 1 * s)} ${f(hy + 2 * s)}`,
      `M${f(cx + r)} ${f(hy - 2 * s)}C${f(cx + r + 8 * s)} ${f(hy + 6 * s)} ${f(cx + r + 6 * s)} ${f(hy + 18 * s)} ${f(cx + r + 2 * s)} ${f(hy + 24 * s)}`,
    );
  }
  if (tie) {
    out.push(`M${f(cx)} ${f(base - 40 * s)}L${f(cx - 4 * s)} ${f(base - 26 * s)}L${f(cx)} ${f(base - 18 * s)}L${f(cx + 4 * s)} ${f(base - 26 * s)}Z`);
  }
  return out;
}

/**
 * Mujer en busto: melena larga que cae sobre los hombros, flequillo,
 * pendiente y escote en V. Brazos opcionales: 'down' | 'up' | 'forward' | 'draw'.
 */
export function woman(cx, base, s = 1, { arms = 'down' } = {}) {
  const hy = base - 64 * s;
  const r = 13 * s;
  const P = (x, y) => `${f(cx + x * s)} ${f(base + y * s)}`;
  const H = (x, y) => `${f(cx + x * s)} ${f(hy + y * s)}`;
  const out = [
    // cabeza
    `M${f(cx + r)} ${f(hy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx - r)} ${f(hy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx + r)} ${f(hy)}Z`,
    // melena larga hasta los hombros
    `M${H(-18, 30)}C${H(-24, 6)} ${H(-22, -22)} ${H(0, -22)}C${H(22, -22)} ${H(24, 6)} ${H(18, 30)}`,
    // flequillo
    `M${H(-13, -3)}C${H(-5, -13)} ${H(6, -13)} ${H(13, -2)}`,
    // hombros con escote en V
    `M${P(-31, 0)}C${P(-31, -26)} ${P(-21, -36)} ${P(-9, -38)}L${P(0, -26)}L${P(9, -38)}C${P(21, -36)} ${P(31, -26)} ${P(31, 0)}`,
  ];
  if (arms === 'up') out.push(`M${P(-24, -30)}L${P(-36, -66)}`, `M${P(24, -30)}L${P(36, -66)}`);
  if (arms === 'forward') out.push(`M${P(22, -26)}C${P(36, -30)} ${P(48, -36)} ${P(60, -40)}`);
  if (arms === 'draw') out.push(`M${P(22, -26)}C${P(40, -36)} ${P(54, -52)} ${P(66, -62)}`);
  return out;
}

/** Estrella de 5 puntas. */
export function star(cx, cy, R, r = R * 0.45) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r : R;
    return `${f(cx + rad * Math.cos(a))} ${f(cy + rad * Math.sin(a))}`;
  });
  return `M${pts.join('L')}Z`;
}

export const curve = (pts) => {
  // Curva suave (Catmull-Rom → Bézier) por una lista de puntos.
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
};
