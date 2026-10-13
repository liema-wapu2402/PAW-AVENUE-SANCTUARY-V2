import PawTrail from './PawTrail';
import { IconBadge } from './Icons';

export default function PageHero({ title, subtitle, icon = 'paw' }) {
  return (
    <section className="page-hero">
      <PawTrail count={8} />
      <div className="container page-hero-inner">
        <IconBadge name={icon} size="lg" className="page-hero-icon" />
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
