import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Icon, { IconBadge } from '../components/Icons';
import { WHY } from './Home';

export default function About() {
  return (
    <>
      <PageHero title="About Us" subtitle="The story behind Paw Avenue Sanctuary" icon="dog" />
      <section className="section">
        <div className="container split">
          <Reveal anim="left" className="split-media"><img src="/images/bg-3.jpg" alt="A rescued dog at Paw Avenue Sanctuary" /></Reveal>
          <Reveal anim="right" className="split-text">
            <p className="kicker">Who we are</p>
            <h2>What is Paw Avenue Sanctuary?</h2>
            <p>Paw Avenue Sanctuary is a beacon of hope not only for street dogs, or <em>askals</em>, but also for street cats, affectionately known as <em>puspin</em>, who have faced hardship and adversity in their lives. With unwavering dedication, we provide a nurturing environment where these animals can heal, both physically and emotionally. Our team of compassionate caregivers works tirelessly to ensure that each cat and dog receives the individualized care and attention they need to thrive.</p>
            <p>Through our comprehensive rehabilitation programs, we address their medical needs, offer behavioral training, and shower them with love and affection. As we prepare these resilient animals for their journey to adoption, we strive to match them with loving families who will provide them with the forever homes they deserve. Together, let's write a new chapter in the lives of these remarkable animals.</p>
            <Link to="/adopt" className="btn btn-primary">Meet the pets <Icon name="paw" className="btn-icon" /></Link>
          </Reveal>
        </div>
      </section>
      <section className="section section-warm">
        <div className="container">
          <Reveal className="section-head"><div><p className="kicker">Our promise</p><h2>What we promise</h2></div></Reveal>
          <div className="grid grid-4">
            {WHY.map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80}><div className="feature"><IconBadge name={icon} size="lg" /><h3>{title}</h3><p>{text}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
