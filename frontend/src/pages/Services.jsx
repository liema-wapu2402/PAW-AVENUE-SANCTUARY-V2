import { useApi } from '../hooks';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { IconBadge, serviceIcon } from '../components/Icons';
import { WHY } from './Home';

export default function Services() {
  const { data, loading, error } = useApi('/services');
  return (
    <>
      <PageHero title="Our Services" subtitle="Everything your pet needs, under one roof" icon="bubbles" />
      <section className="section">
        <div className="container">
          <Reveal className="section-head"><div><p className="kicker">Why families trust us</p><h2>Why choose us?</h2></div></Reveal>
          <div className="grid grid-4">
            {WHY.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 70}><div className="feature"><IconBadge name={icon} size="lg" /><h3>{title}</h3><p>{text}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-warm">
        <div className="container">
          <Reveal className="section-head"><div><p className="kicker">What we offer</p><h2>Care for every day</h2></div></Reveal>
          {loading && <p className="muted center">Loading…</p>}
          {error && <div className="alert alert-error">{error.message}</div>}
          <div className="grid grid-3">
            {data?.map((s, i) => (
              <Reveal key={s.id} anim="zoom" delay={(i % 3) * 80}>
                <div className="service-card"><IconBadge name={serviceIcon(s.title)} size="lg" /><h3>{s.title}</h3><p>{s.description}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
