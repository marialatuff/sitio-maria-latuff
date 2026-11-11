import { useInView } from '../../hooks/useInView.js';

/** Aparición suave al entrar en viewport. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? 'translate-y-0 opacity-100 blur-none' : 'translate-y-6 opacity-0 blur-[3px]'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
