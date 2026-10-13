import { useApi } from '../hooks';
import { img } from '../api';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';

export default function Vets() {
  const { data, loading, error } = useApi('/vets');
  return (
    <>
      <PageHero title="Meet Our Veterinary Doctors" subtitle="The caring professionals behind every rescue" icon="care" />
      <section className="section">
        <div className="container">
          {loading && <p className="muted center">Loading our doctors…</p>}
          {error && <div className="alert alert-error">{error.message}</div>}
          <div className="grid grid-2">
            {data?.map((v, i) => (
              <Reveal key={v.id} anim={i % 2 ? 'right' : 'left'}>
                <article className="vet-card">
                  <img src={img(v.image)} alt={v.name} loading="lazy" />
                  <div>
                    <h3>{v.name}</h3>
                    <span className="tag">{v.title}</span>
                    <p>{v.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
