import { useInView } from '../hooks';

/** Fades/slides children in when scrolled into view. anim: up | left | right | zoom | bounce */
export default function Reveal({ children, anim = 'up', delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const [ref, seen] = useInView();
  return (
    <Tag ref={ref} className={`reveal reveal-${anim} ${seen ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
