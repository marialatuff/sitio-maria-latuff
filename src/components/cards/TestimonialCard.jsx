/** Tarjeta de testimonio: logo del cliente, texto, nombre y empresa (sin estrellas). */
export default function TestimonialCard({ testimonial }) {
  const { quote, name, company, logo } = testimonial;
  return (
    <figure className="surface-card flex h-full flex-col gap-6 p-7 transition-shadow duration-500 hover:shadow-glow sm:p-8">
      <div className="flex h-10 items-center">
        {logo ? (
          <img src={logo} alt={company} className="h-8 w-auto object-contain" />
        ) : (
          <span aria-hidden="true" className="h-10 w-10 rounded-full bg-surface-page shadow-[inset_0_2px_6px_rgb(0_0_0/0.12)]" />
        )}
      </div>
      <blockquote className="flex-1 text-lg font-light leading-relaxed sm:text-xl">{quote}</blockquote>
      <figcaption className="border-t border-ink/10 pt-5">
        <p className="font-semibold">{name}</p>
        <p className="text-label text-ink-soft">{company}</p>
      </figcaption>
    </figure>
  );
}
