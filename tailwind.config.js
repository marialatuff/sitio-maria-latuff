/**
 * Sistema de diseño "Brand" (Claude) → Tailwind.
 * Fuente: tokens muestreados de Sistema-diseño-MariaLatuff.jpeg
 * (control redondo gris claro con borde ámbar iluminado).
 * Los valores viven en src/styles/globals.css como variables CSS.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          page: 'rgb(var(--surface-page) / <alpha-value>)',
          raised: 'rgb(var(--surface-raised) / <alpha-value>)',
          highlight: 'rgb(var(--surface-highlight) / <alpha-value>)',
          halo: 'rgb(var(--surface-halo) / <alpha-value>)',
        },
        glow: {
          DEFAULT: 'rgb(var(--accent-glow) / <alpha-value>)',
          deep: 'rgb(var(--accent-glow-deep) / <alpha-value>)',
        },
        /* Sistema Home v2 (colorimetría limpia estilo cavrix) */
        /* Colores con modo claro/oscuro: valores en src/styles/globals.css */
        paper: {
          DEFAULT: 'rgb(var(--c-paper) / <alpha-value>)', // fondo principal
          soft: 'rgb(var(--c-paper-soft) / <alpha-value>)', // bloques secundarios
          line: 'rgb(var(--c-paper-line) / <alpha-value>)', // bordes y divisores
        },
        graphite: {
          DEFAULT: 'rgb(var(--c-graphite) / <alpha-value>)', // texto principal
          soft: 'rgb(var(--c-graphite-soft) / <alpha-value>)', // texto secundario
          mute: 'rgb(var(--c-graphite-mute) / <alpha-value>)', // etiquetas pequeñas
        },
        night: 'rgb(var(--c-night) / <alpha-value>)', // contraste máximo (títulos, botones)
        card: 'rgb(var(--c-card) / <alpha-value>)', // tarjetas
        ink: {
          // Sistema antiguo (páginas aún no rediseñadas)
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          // Sistema nuevo
          line: 'rgb(var(--c-ink-line) / <alpha-value>)', // trazos de ilustración
          faint: 'rgb(var(--c-line-soft) / <alpha-value>)', // trazos secundarios
          sig: 'rgb(var(--c-sig) / <alpha-value>)', // firma de fondo
          dim: 'rgb(var(--c-read-dim) / <alpha-value>)', // texto aún no leído
        },
        /* Acentos (en modo oscuro: #7e6e87 y derivados) */
        stroke: 'rgb(var(--c-stroke) / <alpha-value>)',
        'curtain-ink': 'rgb(var(--c-curtain-ink) / <alpha-value>)',
        'footer-sig': 'rgb(var(--c-footer-sig) / <alpha-value>)',
        'backdrop-line': 'rgb(var(--c-backdrop-line) / <alpha-value>)',
        'read-lit': 'rgb(var(--c-read-lit) / <alpha-value>)',
        hover: {
          DEFAULT: 'rgb(var(--c-hover) / <alpha-value>)',
          ink: 'rgb(var(--c-hover-ink) / <alpha-value>)',
          solid: 'rgb(var(--c-hover-solid) / <alpha-value>)',
          light: 'rgb(var(--c-hover-light) / <alpha-value>)',
          'light-ink': 'rgb(var(--c-hover-light-ink) / <alpha-value>)',
        },
        /* Fijos en ambos modos (footer y tarjetas oscuras) */
        coal: '#0f0f0f',
        snow: '#f7f9f7',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        script: ['Caveat', 'cursive'],
        // La clase se llama `geist` por historia, pero la fuente de párrafo ahora es Inter
        geist: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        label: ['0.8125rem', { lineHeight: '1.125rem', fontWeight: '500' }],
        body: ['0.9375rem', { lineHeight: '1.375rem' }],
        numeral: ['5.25rem', { lineHeight: '5.5rem', fontWeight: '300' }],
      },
      borderRadius: {
        card: '2rem',
        soft: '1.25rem',
      },
      boxShadow: {
        // Relieve suave: luz arriba (highlight), sombra abajo
        raised:
          'inset 0 1px 0 rgb(var(--surface-highlight)), 0 18px 40px -18px rgb(0 0 0 / 0.28), 0 2px 6px -2px rgb(0 0 0 / 0.12)',
        halo: '0 0 0 12px rgb(var(--surface-halo) / 0.45), 0 30px 60px -30px rgb(0 0 0 / 0.3)',
        // Estado activo: borde ámbar iluminado en el canto inferior
        glow:
          'inset 0 1px 0 rgb(var(--surface-highlight)), 0 4px 0 -1px rgb(var(--accent-glow)), 0 10px 28px -6px rgb(var(--accent-glow-deep) / 0.75)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(0.6em)', filter: 'blur(6px)' },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        breathe: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        rise: 'rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        breathe: 'breathe 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
