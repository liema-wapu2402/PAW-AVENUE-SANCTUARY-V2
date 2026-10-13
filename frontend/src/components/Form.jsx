import { useState } from 'react';
import { api } from '../api';
import Icon from './Icons';

/**
 * Tiny form helper for the visitor forms: handles values, submit, errors and success.
 * usage: const f = useForm('/contact', { name: '' }); <input {...f.field('name')} />
 */
export function useForm(endpoint, initial, onDone) {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setErrors({});
    try {
      const res = await api(endpoint, { method: 'POST', body: values });
      setSuccess(res.message);
      setValues(initial);
      onDone?.(res);
    } catch (err) {
      setError(err.message);
      setErrors(err.errors);
    } finally {
      setBusy(false);
    }
  };

  return { values, field, submit, busy, error, errors, success, reset: () => { setSuccess(''); setError(''); } };
}

export function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error[0]}</small>}
    </label>
  );
}

export function SuccessBurst({ message }) {
  return (
    <div className="success-burst" role="status">
      <span className="heart"><Icon name="heart" /></span>
      <p>{message}</p>
    </div>
  );
}
