/**
 * Países del formulario: código ISO (para la bandera) y prefijo telefónico.
 * Latinoamérica primero en importancia, pero la lista se muestra en orden alfabético.
 */
const LIST = [
  ['ar', 'Argentina', '+54'],
  ['bo', 'Bolivia', '+591'],
  ['br', 'Brasil', '+55'],
  ['cl', 'Chile', '+56'],
  ['co', 'Colombia', '+57'],
  ['cr', 'Costa Rica', '+506'],
  ['cu', 'Cuba', '+53'],
  ['ec', 'Ecuador', '+593'],
  ['sv', 'El Salvador', '+503'],
  ['gt', 'Guatemala', '+502'],
  ['hn', 'Honduras', '+504'],
  ['mx', 'México', '+52'],
  ['ni', 'Nicaragua', '+505'],
  ['pa', 'Panamá', '+507'],
  ['py', 'Paraguay', '+595'],
  ['pe', 'Perú', '+51'],
  ['pr', 'Puerto Rico', '+1'],
  ['do', 'República Dominicana', '+1'],
  ['uy', 'Uruguay', '+598'],
  ['ve', 'Venezuela', '+58'],
  ['us', 'Estados Unidos', '+1'],
  ['ca', 'Canadá', '+1'],
  ['es', 'España', '+34'],
  ['pt', 'Portugal', '+351'],
  ['fr', 'Francia', '+33'],
  ['it', 'Italia', '+39'],
  ['de', 'Alemania', '+49'],
  ['gb', 'Reino Unido', '+44'],
  ['ie', 'Irlanda', '+353'],
  ['nl', 'Países Bajos', '+31'],
  ['be', 'Bélgica', '+32'],
  ['ch', 'Suiza', '+41'],
  ['at', 'Austria', '+43'],
  ['se', 'Suecia', '+46'],
  ['no', 'Noruega', '+47'],
  ['dk', 'Dinamarca', '+45'],
  ['fi', 'Finlandia', '+358'],
  ['pl', 'Polonia', '+48'],
  ['il', 'Israel', '+972'],
  ['ae', 'Emiratos Árabes Unidos', '+971'],
  ['in', 'India', '+91'],
  ['jp', 'Japón', '+81'],
  ['cn', 'China', '+86'],
  ['kr', 'Corea del Sur', '+82'],
  ['sg', 'Singapur', '+65'],
  ['au', 'Australia', '+61'],
  ['nz', 'Nueva Zelanda', '+64'],
  ['za', 'Sudáfrica', '+27'],
];

const collator = new Intl.Collator('es');

export const COUNTRIES = LIST.map(([code, name, dial]) => ({ code, name, dial })).sort((a, b) =>
  collator.compare(a.name, b.name),
);

/** Bandera como imagen (los emoji de bandera no se ven en Windows). */
export const flagUrl = (code) => `https://flagcdn.com/w40/${code}.png`;
