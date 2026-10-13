import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks';
import { img } from '../api';
import Reveal from '../components/Reveal';
import Counter from '../components/Counter';
import PetCard from '../components/PetCard';
import AdoptModal from '../components/AdoptModal';
import AnimalStage from '../components/AnimalStage';
import PawTrail from '../components/PawTrail';
import Icon, { IconBadge } from '../components/Icons';

export const WHY = [
  ['care', 'Care Advice', "Expert guidance tailored to your pet's needs, from day one."],
  ['chat', 'Caring Support', 'A friendly team beside you through every step of adoption.'],
  ['siren', 'Emergency Help', "Quick response so your pet's safety always comes first."],
  ['shield', 'Veterinary Care', 'Trusted vets for any health concern along the way.'],
];

export default function Home() {
  const { data, loading, error } = useApi('/home');
  const [adopting, setAdopting] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    ['Happy adoptions', data?.stats?.adopted],
    ['Pets to adopt', data?.stats?.available],
    ['Services', data?.stats?.services],
    ['Veterinarians', data?.stats?.vets],
  ];

  return (
    <>
      {/* HERO - animals on the right, message + live numbers on the left */}
      <section className="hero">
        <PawTrail count={12} />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><Icon name="paw" /> Paw Avenue Sanctuary</p>
            <h1>
              Adopt a street dog or cat, and let <span className="hl">love<i aria-hidden="true" /></span> rewrite their story.
            </h1>
            <p className="hero-sub">Rescue · Rehab · Rehome. Meet the aspins and puspins who are healed, vaccinated and ready for a forever family.</p>
            <div className="hero-actions">
              <Link to="/adopt" className="btn btn-dark btn-lg">Meet our rescues <Icon name="arrow" className="btn-icon" /></Link>
              <Link to="/about" className="btn btn-glass btn-lg">Our story</Link>
            </div>
            <ul className="hero-stats" aria-label="Sanctuary numbers">
              {stats.map(([label, n]) => (
                <li key={label}><strong><Counter to={n ?? 0} />+</strong><span>{label}</span></li>
              ))}
            </ul>
          </div>
          <div className="hero-art"><AnimalStage /></div>
        </div>
      </section>

      {/* PETS */}
      <section className="section" id="pets">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <p className="kicker">Waiting for you</p>
              <h2>Meet our rescues</h2>
            </div>
            <Link to="/adopt" className="link-arrow">See all pets <Icon name="arrow" /></Link>
          </Reveal>
          {loading && <p className="muted center">Fetching our furry friends…</p>}
          {error && <div className="alert alert-error">{error.message}</div>}
          <div className="grid grid-pets">
            {data?.pets.map((p, i) => <PetCard key={p.id} pet={p} delay={(i % 4) * 70} onAdopt={setAdopting} />)}
          </div>
        </div>
      </section>

      {/* WHY US - one slim panel instead of four big cards */}
      <section className="section section-tight">
        <div className="container">
          <Reveal className="why-panel">
            {WHY.map(([icon, title, text]) => (
              <div className="why-item" key={title}>
                <IconBadge name={icon} />
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-warm">
        <div className="container">
          <Reveal className="section-head">
            <div>
              <p className="kicker">Happy tails</p>
              <h2>Families we’ve helped</h2>
            </div>
          </Reveal>
          <div className="grid grid-3">
            {data?.testimonials.map((t, i) => (
              <Reveal key={t.id} anim="up" delay={i * 90}>
                <figure className="testimonial">
                  <p>{t.message}</p>
                  <figcaption>
                    <img src={img(t.image)} alt="" loading="lazy" />
                    <div><strong>{t.name}</strong><small>{t.role}</small></div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + CTA side by side */}
      <section className="section">
        <div className="container faq-layout">
          <Reveal anim="left" className="faq-intro">
            <p className="kicker">First-time owner?</p>
            <h2>Good questions, honest answers</h2>
            <p className="muted">Not sure what your new best friend needs? Book a free chat with our team and we’ll guide you.</p>
            <Link to="/contact#consultation" className="btn btn-primary">Book a free consultation <Icon name="calendar" className="btn-icon" /></Link>
          </Reveal>
          <div className="faq-list">
            {data?.faqs.map((f, i) => (
              <Reveal key={f.id} anim="up" delay={i * 70}>
                <div className={`faq ${openFaq === i ? 'open' : ''}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                    <span>{f.question}</span><Icon name="plus" />
                  </button>
                  <div className="faq-body"><ul>{f.answer.split('\n').filter(Boolean).map((l, j) => <li key={j}>{l}</li>)}</ul></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {adopting && <AdoptModal pet={adopting} onClose={() => setAdopting(null)} />}
    </>
  );
}
