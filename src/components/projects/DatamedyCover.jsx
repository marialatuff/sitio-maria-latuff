import landingMobile from '../../assets/projects/datamedy/landing-mobile.jpg';
import { PhoneFrame } from './devices.jsx';

/**
 * Portada estática de Datamedy: iPhone en perspectiva, de pie sobre una base oscura,
 * con una luz violeta de fondo (colores de la marca). La pantalla muestra el inicio de la landing móvil.
 */
export default function DatamedyCover() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'radial-gradient(70% 80% at 62% 30%, #b4a7ff 0%, #836fff 28%, #4a35b8 55%, #1a1240 85%, #0d0a22 100%)' }}
    >
      {/* Base oscura sobre la que se apoya el teléfono */}
      <div className="absolute inset-x-[-10%] bottom-[-38%] h-[62%] rounded-[50%]" style={{ background: 'radial-gradient(60% 45% at 50% 30%, #2a2160, #0b0920 70%)' }} />
      {/* Sombra en la base */}
      <div className="absolute bottom-[13%] left-[51%] h-[6%] w-[26%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />

      {/* iPhone en perspectiva */}
      <div className="absolute left-1/2 top-[7%] w-[22%] -translate-x-1/2" style={{ perspective: '1400px' }}>
        <div style={{ transform: 'rotateX(10deg) rotateY(-24deg) rotateZ(4deg)', transformStyle: 'preserve-3d', filter: 'drop-shadow(-18px 30px 30px rgba(10,6,40,.55))' }}>
          <PhoneFrame color="black">
            <div className="absolute inset-0 overflow-hidden bg-white">
              <img src={landingMobile} alt="" className="block w-full" />
            </div>
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
