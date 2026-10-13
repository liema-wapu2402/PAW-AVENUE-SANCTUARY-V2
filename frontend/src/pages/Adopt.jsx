import { useState } from 'react';
import { useApi } from '../hooks';
import PageHero from '../components/PageHero';
import PetCard from '../components/PetCard';
import AdoptModal from '../components/AdoptModal';
import Icon from '../components/Icons';

export default function Adopt() {
  const [species, setSpecies] = useState('');
  const [search, setSearch] = useState('');
  const [adopting, setAdopting] = useState(null);

  const qs = new URLSearchParams();
  if (species) qs.set('species', species);
  if (search.trim()) qs.set('search', search.trim());
  const { data, loading, error } = useApi(`/pets${qs.toString() ? `?${qs}` : ''}`);

  return (
    <>
      <PageHero title="Adopt a Friend" subtitle="Every pet here is vaccinated, checked by our vets, and ready to love." icon="heart" />
      <section className="section">
        <div className="container">
          <div className="filters">
            {[['', 'All pets', 'paw'], ['dog', 'Dogs', 'dog'], ['cat', 'Cats', 'cat']].map(([v, label, icon]) => (
              <button key={v} className={`chip ${species === v ? 'active' : ''}`} onClick={() => setSpecies(v)}><Icon name={icon} />{label}</button>
            ))}
            <input className="search" type="search" placeholder="Search by name or breed…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {loading && <p className="muted center">Fetching our furry friends…</p>}
          {error && <div className="alert alert-error">{error.message}</div>}
          {data && data.length === 0 && <p className="muted center">No pets match that search — try another one.</p>}
          <div className="grid grid-pets">
            {data?.map((p, i) => <PetCard key={p.id} pet={p} delay={(i % 4) * 70} onAdopt={setAdopting} />)}
          </div>
        </div>
      </section>
      {adopting && <AdoptModal pet={adopting} onClose={() => setAdopting(null)} />}
    </>
  );
}
