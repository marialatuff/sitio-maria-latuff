import { Link } from 'react-router-dom';
import { PROJECT_CTA } from '../../content/site.js';

/** Tarjeta de proyecto. `cover` (url) opcional; sin cover muestra un disco con el número. */
export default function ProjectCard({ project, index = 0, className = '', ...rest }) {
  return (
    <Link
      {...rest}
      to={`/proyectos/${project.slug}`}
      className={`group surface-card flex flex-col overflow-hidden p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow ${className}`}
    >
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.5rem] bg-surface-page">
        {project.cover ? (
          <img
            src={project.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid h-24 w-24 place-items-center rounded-full bg-surface-raised text-3xl font-light tabular-nums shadow-raised transition-shadow duration-500 group-hover:shadow-glow"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-5">
        <h3 className="text-xl font-medium tracking-tight">{project.title}</h3>
        {project.description && <p className="text-ink-soft">{project.description}</p>}
        <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold">
          {PROJECT_CTA}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
