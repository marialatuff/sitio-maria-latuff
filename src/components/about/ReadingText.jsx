import { useEffect, useRef, useState } from 'react';

/**
 * Texto que pasa de gris claro a iluminado cuando llega a la mitad de la pantalla,
 * para acompañar la lectura. Una vez leído se queda iluminado.
 * En modo oscuro, además, una franja de luz lo recorre una vez (clase read-sweep).
 */
export default function ReadingText({ as: Tag = 'p', className = '', children }) {
  const ref = useRef(null);
  const [read, setRead] = useState(false);
  const [swept, setSwept] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRead(true);
      setSwept(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRead(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -45% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      onAnimationEnd={(e) => e.target === ref.current && setSwept(true)}
      // Párrafos del sitio: Inter con interlineado 1.75 (tiene prioridad sobre el leading de cada uso)
      className={`!leading-[1.75] transition-colors duration-700 ease-out ${read ? 'text-read-lit' : 'text-ink-dim'} ${
        read && !swept ? 'read-sweep' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
