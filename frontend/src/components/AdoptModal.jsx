import { useEffect } from 'react';
import { useForm, Field, SuccessBurst } from './Form';
import { img } from '../api';

export default function AdoptModal({ pet, onClose }) {
  const f = useForm('/adoption-applications', {
    pet_id: pet.id, full_name: '', email: '', phone: '', address: '', living_situation: '', reason: '',
  });

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`Adopt ${pet.name}`}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-head">
          <img src={img(pet.image)} alt="" />
          <div>
            <h2>Adopt {pet.name}</h2>
            <p>Tell us a little about you and your home.</p>
          </div>
        </div>

        {f.success ? (
          <SuccessBurst message={f.success} />
        ) : (
          <form onSubmit={f.submit} className="form-grid">
            {f.error && <div className="alert alert-error full">{f.error}</div>}
            <Field label="Full name" error={f.errors.full_name}><input {...f.field('full_name')} required /></Field>
            <Field label="Email" error={f.errors.email}><input type="email" {...f.field('email')} required /></Field>
            <Field label="Phone" error={f.errors.phone}><input {...f.field('phone')} required /></Field>
            <Field label="Living situation" error={f.errors.living_situation}>
              <select {...f.field('living_situation')}>
                <option value="">Select…</option>
                <option>House with yard</option>
                <option>House, no yard</option>
                <option>Apartment / condo</option>
                <option>Other</option>
              </select>
            </Field>
            <div className="full"><Field label="Home address" error={f.errors.address}><input {...f.field('address')} required /></Field></div>
            <div className="full"><Field label={`Why would you like to adopt ${pet.name}?`} error={f.errors.reason}><textarea rows="4" {...f.field('reason')} required /></Field></div>
            <button className="btn btn-primary full" disabled={f.busy}>{f.busy ? 'Sending…' : 'Send application'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
