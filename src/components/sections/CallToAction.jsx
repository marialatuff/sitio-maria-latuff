import { CONTACT } from '../../content/site.js';
import { FormCta } from '../ui/Button.jsx';
import Reveal from '../ui/Reveal.jsx';

/**
 * Bloque de contacto de cierre (estilo footer de contacto a pantalla ancha).
 * Por defecto usa el copy compartido de Arquitectura.md; se puede sobrescribir.
 */
export default function CallToAction({
  title = CONTACT.title,
  subtitle = CONTACT.subtitle,
  cta = CONTACT.cta,
  as: Heading = 'h2',
  variant = 'contact',
}) {
  const isContact = variant === 'contact';
  return (
    <section className="container-site py-12 sm:py-16">
      <Reveal
        className={`relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12 sm:py-24 ${
          isContact ? 'bg-ink text-surface-highlight' : 'surface-card'
        }`}
      >
        {/* Brillo ámbar en el canto inferior, como el control de referencia */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-[46rem] max-w-[140%] -translate-x-1/2 animate-breathe rounded-full bg-glow/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-3xl">
          <Heading className="text-balance text-3xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </Heading>
          {subtitle && (
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-[1.75] sm:text-lg ${isContact ? 'opacity-75' : 'text-ink-soft'}`}>
              {subtitle}
            </p>
          )}
          <div className="mt-10 flex justify-center">
            <FormCta label={cta} variant={isContact ? 'raised' : 'ink'} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
