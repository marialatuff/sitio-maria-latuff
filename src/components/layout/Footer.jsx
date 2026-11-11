import { Link } from 'react-router-dom';
import { FORM_URL, NAV, CTA_LABEL } from '../../content/site.js';

export default function Footer() {
  return (
    <footer className="container-site pb-8 pt-4">
      <div className="flex flex-col gap-6 border-t border-ink/10 pt-8 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="text-sm font-semibold tracking-tight">
          María Latuff
        </Link>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm text-ink-soft transition-colors hover:text-ink">
              {item.label}
            </Link>
          ))}
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-soft underline decoration-glow decoration-2 underline-offset-4 hover:text-ink"
          >
            {CTA_LABEL}
          </a>
        </nav>
        <p className="text-label text-ink-soft">© {new Date().getFullYear()} María Latuff</p>
      </div>
    </footer>
  );
}
