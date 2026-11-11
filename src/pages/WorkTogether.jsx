import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Reveal from '../components/ui/Reveal.jsx';
import { SocialLinks } from '../components/home/BigFooter.jsx';
import SignatureBackdrop from '../components/home/SignatureBackdrop.jsx';
import { COUNTRIES, flagUrl } from '../content/countries.js';
import { WORK_FORM } from '../content/site.js';

/* ---------- Estilos compartidos de los campos ---------- */
const FIELD =
  // Fondo sólido: la línea de la firma pasa por detrás sin cruzar el texto
  'w-full rounded-xl border border-paper-line bg-paper px-4 py-3 font-geist text-[0.95rem] text-night placeholder:text-graphite-mute transition-colors focus:border-hover focus:outline-none focus:ring-2 focus:ring-hover/30';
const LABEL = 'mb-2 block font-geist text-sm text-graphite-soft';

function Field({ label, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Block({ title, children }) {
  return (
    <fieldset className="space-y-5 border-t border-paper-line pt-8">
      {title && <legend className="float-left mb-6 w-full font-geist text-base font-medium text-night">{title}</legend>}
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}

/* ---------- Selector de país con banderas y búsqueda ---------- */
function CountrySelect({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listId = useId();
  const selected = COUNTRIES.find((c) => c.code === value);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').includes(q) || c.dial.includes(q),
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    searchRef.current?.focus();
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (c) => {
    onChange(c.code);
    setOpen(false);
    setQuery('');
  };

  const onKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) pick(results[active]);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${FIELD} flex items-center gap-3 text-left`}
      >
        {selected ? (
          <>
            <img src={flagUrl(selected.code)} alt="" className="h-4 w-6 rounded-[2px] object-cover" />
            <span className="flex-1">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-graphite-mute">Selecciona tu país</span>
        )}
        <svg viewBox="0 0 20 20" className={`h-4 w-4 text-graphite-soft transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-paper-line bg-paper shadow-[0_20px_40px_-12px_rgb(0_0_0/0.5)]">
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKey}
            placeholder="Buscar país"
            aria-controls={listId}
            className="w-full border-b border-paper-line bg-transparent px-4 py-3 font-geist text-sm text-night placeholder:text-graphite-mute focus:outline-none"
          />
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {results.map((c, i) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.code === value}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(c)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2 font-geist text-sm ${
                  i === active ? 'bg-hover/20 text-night' : 'text-graphite'
                }`}
              >
                <img src={flagUrl(c.code)} alt="" loading="lazy" className="h-4 w-6 rounded-[2px] object-cover" />
                <span className="flex-1">{c.name}</span>
                <span className="text-graphite-mute">{c.dial}</span>
              </li>
            ))}
            {!results.length && <li className="px-4 py-3 font-geist text-sm text-graphite-mute">Sin resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Página ---------- */
export default function WorkTogether() {
  const { title, stages, success, error, sending, email, autoReply } = WORK_FORM;
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const pageRef = useRef(null);
  const selected = COUNTRIES.find((c) => c.code === country);
  const dial = selected?.dial;
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const fd = new FormData(e.currentTarget);
    const get = (k) => (fd.get(k) || '').toString().trim() || '—';
    // Nombres legibles: así aparecen en el correo
    const payload = {
      'Nombre y Apellido': get('nombre'),
      Cargo: get('cargo'),
      // FormSubmit necesita el campo "email" (en minúscula) para mandar la respuesta automática
      email: get('email'),
      Empresa: get('empresa'),
      País: selected?.name || '—',
      'Teléfono / WhatsApp': phone ? `${dial} ${phone}` : '—',
      'Estado del proyecto': get('estado'),
      'Problema o necesidad': get('problema'),
      'Fecha opción 1': get('fecha_1'),
      'Fecha opción 2': get('fecha_2'),
      'Fecha opción 3': get('fecha_3'),
      // El nombre al final evita que Gmail junte todos los prospectos en una sola conversación
      _subject: `¡Tienes nuevo prospecto! · ${get('nombre')}`,
      _replyto: get('email'),
      _autoresponse: autoReply.replace('{web}', window.location.origin),
      _template: 'table',
      _captcha: 'false',
    };

    if (!email) {
      // Sin correo configurado todavía: solo se muestra el mensaje
      setStatus('sent');
      return;
    }
    setStatus('sending');
    // Si el servicio no responde en 25 s, se muestra el error en vez de quedar "Enviando…"
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        signal: ctrl.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      setStatus(res.ok && String(data.success) !== 'false' ? 'sent' : 'error');
    } catch {
      setStatus('error');
    } finally {
      clearTimeout(timer);
    }
  };

  return (
    <article className="relative overflow-x-clip font-geist">
      {/* Firma de fondo, la misma línea animada de Soluciones: se escribe al llegar y sigue con el scroll */}
      <SignatureBackdrop scrollRef={pageRef} />

      <div ref={pageRef} className="relative z-10 mx-auto grid max-w-6xl gap-14 px-5 pb-28 pt-40 sm:px-8 sm:pt-48 md:grid-cols-[1fr_1.35fr] md:gap-20">
        {/* Lado izquierdo: título */}
        <div>
          <div className="md:sticky md:top-32">
            <Reveal as="h1" className="t-h1">
              {title}
            </Reveal>
            <Reveal delay={120}>
              <SocialLinks className="mt-8" />
            </Reveal>
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <form onSubmit={onSubmit} className="space-y-10">
          <Block>
            <Field label="Nombre y Apellido" htmlFor="f-nombre">
              <input id="f-nombre" name="nombre" type="text" autoComplete="name" required className={FIELD} />
            </Field>
            <Field label="Cargo" htmlFor="f-cargo">
              <input id="f-cargo" name="cargo" type="text" autoComplete="organization-title" className={FIELD} />
            </Field>
            <Field label="Email" htmlFor="f-email">
              <input id="f-email" name="email" type="email" autoComplete="email" required className={FIELD} />
            </Field>
            <Field label="Nombre de la empresa" htmlFor="f-empresa">
              <input id="f-empresa" name="empresa" type="text" autoComplete="organization" className={FIELD} />
            </Field>
          </Block>

          <Block title="Ubicación y Contacto">
            <Field label="País" htmlFor="f-pais">
              <CountrySelect id="f-pais" value={country} onChange={setCountry} />
              <input type="hidden" name="pais" value={country} />
            </Field>
            <Field label="Teléfono / WhatsApp" htmlFor="f-tel">
              <div className="flex gap-2">
                <span
                  className="flex min-w-[5.5rem] items-center justify-center gap-2 rounded-xl border border-paper-line bg-paper px-3 font-geist text-[0.95rem] text-night"
                  aria-live="polite"
                >
                  {country && <img src={flagUrl(country)} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />}
                  {dial || '+'}
                </span>
                <input
                  id="f-tel"
                  name="telefono"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={country ? 'Número sin el código' : 'Elige primero tu país'}
                  className={FIELD}
                />
                <input type="hidden" name="telefono_completo" value={phone ? `${dial || ''}${phone}` : ''} />
              </div>
            </Field>
          </Block>

          <Block title="Tu Proyecto">
            <div role="radiogroup" aria-labelledby="f-estado">
              <p id="f-estado" className={LABEL}>
                ¿En qué estado se encuentra tu proyecto?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {stages.map((s, i) => (
                  <label
                    key={s}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-paper-line bg-paper px-4 py-3 text-[0.95rem] text-graphite transition-colors hover:border-hover has-[:checked]:border-hover has-[:checked]:bg-hover/15 has-[:checked]:text-night"
                  >
                    <input type="radio" name="estado" value={s} required={i === 0} className="mt-1 accent-[#7e6e87]" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <Field label="¿Qué problema o necesidad te lleva a contactarme?" htmlFor="f-problema">
              <textarea id="f-problema" name="problema" rows={3} className={`${FIELD} resize-y`} />
            </Field>
          </Block>

          <Block title="La cita">
            <p className={LABEL}>¿Qué fecha tienes disponible para nuestra llamada? Puedes añadirme unas 3 opciones</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n}>
                  <label htmlFor={`f-fecha-${n}`} className="mb-1.5 block font-geist text-xs text-graphite-mute">
                    Opción {n}
                  </label>
                  <input id={`f-fecha-${n}`} name={`fecha_${n}`} type="date" min={today} className={FIELD} />
                </div>
              ))}
            </div>
          </Block>

          <div className="border-t border-paper-line pt-8">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="disabled:cursor-wait disabled:opacity-60 group inline-flex items-center gap-2 rounded-full bg-night px-6 py-3 font-geist text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-hover-solid hover:text-hover-ink"
            >
              Enviar
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>
            <p role="status" aria-live="polite" className="mt-6 min-h-[1.5rem] font-geist text-base">
              {status === 'sending' && <span className="text-graphite-soft">{sending}</span>}
              {status === 'sent' && <span className="shine-text">{success}</span>}
              {status === 'error' && <span className="text-graphite">{error}</span>}
            </p>
          </div>
        </form>
      </div>
    </article>
  );
}
