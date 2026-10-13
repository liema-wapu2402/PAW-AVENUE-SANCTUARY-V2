import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Icon, { IconBadge } from '../components/Icons';
import { useForm, Field, SuccessBurst } from '../components/Form';

const CONSULT_SERVICES = ['Cat Sitting', 'Dog Walk', 'Pet Spa', 'Pet Grooming', 'Pet Daycare'];

const INFO = [
  ['pin', 'Address', '#1430 Gardenville Subdivision, Brgy. Lusacan, Tiaong, Quezon'],
  ['phone', 'Phone', '0991 617 8708 or 0995 485 2673'],
  ['mail', 'Email', 'paw_avenue@gmail.com'],
  ['globe', 'Website', 'Paw.Avenue.Sanctuary.com'],
];

export default function Contact() {
  const f = useForm('/contact', { name: '', email: '', subject: '', message: '' });
  const consult = useForm('/appointments', { full_name: '', email: '', phone: '', service: '', preferred_date: '', notes: '' });

  return (
    <>
      <PageHero title="Contact" subtitle="We’d love to hear from you" icon="mail" />

      <section className="section">
        <div className="container split split-top">
          <Reveal anim="left" className="contact-info">
            <p className="kicker">Say hello</p>
            <h2>Get in touch</h2>
            <ul className="info-list">
              {INFO.map(([icon, label, value]) => (
                <li key={label}><IconBadge name={icon} /><div><b>{label}</b><span>{value}</span></div></li>
              ))}
            </ul>
          </Reveal>
          <Reveal anim="right" className="card-form">
            <h2>Send us a message</h2>
            {f.success ? (
              <SuccessBurst message={f.success} />
            ) : (
              <form onSubmit={f.submit} className="form-grid">
                {f.error && <div className="alert alert-error full">{f.error}</div>}
                <Field label="Full name" error={f.errors.name}><input {...f.field('name')} required /></Field>
                <Field label="Email address" error={f.errors.email}><input type="email" {...f.field('email')} required /></Field>
                <div className="full"><Field label="Subject" error={f.errors.subject}><input {...f.field('subject')} required /></Field></div>
                <div className="full"><Field label="Message" error={f.errors.message}><textarea rows="5" {...f.field('message')} required /></Field></div>
                <button className="btn btn-primary full" disabled={f.busy}>{f.busy ? 'Sending…' : 'Send message'}</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FREE CONSULTATION (moved here from the Home page) */}
      <section className="section section-warm" id="consultation">
        <div className="container split split-top">
          <Reveal anim="left" className="split-text">
            <p className="kicker">On the house</p>
            <h2>Book a free consultation</h2>
            <p>Not sure what your new best friend needs? Book a free chat with our team and we will guide you, from the first vet visit to the first night at home.</p>
            <ul className="tick-list">
              <li><Icon name="check" />Advice matched to your home and lifestyle</li>
              <li><Icon name="check" />Help choosing the right rescue for you</li>
              <li><Icon name="check" />No obligation, no cost</li>
            </ul>
          </Reveal>
          <Reveal anim="right" className="card-form">
            {consult.success ? (
              <SuccessBurst message={consult.success} />
            ) : (
              <form onSubmit={consult.submit} className="form-grid">
                {consult.error && <div className="alert alert-error full">{consult.error}</div>}
                <Field label="Full name" error={consult.errors.full_name}><input {...consult.field('full_name')} required /></Field>
                <Field label="Email" error={consult.errors.email}><input type="email" {...consult.field('email')} required /></Field>
                <Field label="Service" error={consult.errors.service}>
                  <select {...consult.field('service')} required>
                    <option value="">Select a service</option>
                    {CONSULT_SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Preferred date" error={consult.errors.preferred_date}><input type="date" {...consult.field('preferred_date')} /></Field>
                <button className="btn btn-primary full" disabled={consult.busy}>{consult.busy ? 'Sending…' : 'Book consultation'}</button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
