import { useState } from 'react';
import { api, img } from '../api';

/** Generic create/edit modal driven by the field list in resources.js. */
export default function ResourceForm({ resource, def, row, onClose, onSaved }) {
  const [values, setValues] = useState(() => {
    const v = {};
    def.fields.forEach((f) => {
      if (f.type === 'image') return;
      v[f.name] = row ? row[f.name] ?? '' : f.default ?? (f.type === 'checkbox' ? false : '');
    });
    if (row?.published_at) v.published_at = String(row.published_at).slice(0, 10);
    return v;
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setErrors({});

    const body = new FormData();
    def.fields.forEach((f) => {
      if (f.type === 'image') return;
      const val = values[f.name];
      body.append(f.name, f.type === 'checkbox' ? (val ? '1' : '0') : val ?? '');
    });
    if (file) body.append('image', file);

    try {
      // Multipart updates go through POST (PHP does not parse multipart on PUT).
      await api(row ? `/admin/${resource}/${row.id}` : `/admin/${resource}`, { method: 'POST', body });
      onSaved();
    } catch (err) {
      setError(err.message);
      setErrors(err.errors);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <h2>{row ? 'Edit' : 'Add'} — {def.label}</h2>
        <form onSubmit={submit} className="form-grid">
          {error && <div className="alert alert-error full">{error}</div>}
          {def.fields.map((f) => (
            <label key={f.name} className={`field ${f.wide ? 'full' : ''} ${f.type === 'checkbox' ? 'field-check' : ''}`}>
              <span>{f.label}{f.required && ' *'}</span>
              {f.type === 'textarea' ? (
                <textarea rows={f.rows || 4} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
              ) : f.type === 'select' ? (
                <select value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required}>
                  {f.options.map((o) => <option key={o} value={o}>{o || '—'}</option>)}
                </select>
              ) : f.type === 'checkbox' ? (
                <input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
              ) : f.type === 'image' ? (
                <>
                  {row?.image && !file && <img className="thumb thumb-lg" src={img(row.image)} alt="" />}
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
                </>
              ) : (
                <input type={f.type || 'text'} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required} />
              )}
              {errors[f.name] && <small className="field-error">{errors[f.name][0]}</small>}
            </label>
          ))}
          <div className="full form-actions">
            <button type="button" className="btn btn-ghost-dark" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
