import { useEffect, useState } from 'react';
import { useInView } from '../hooks';

export default function Counter({ to = 0, duration = 1400 }) {
  const [ref, seen] = useInView();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to === 0) return setN(to);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return <span ref={ref}>{n}</span>;
}
