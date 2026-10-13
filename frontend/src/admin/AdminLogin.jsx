import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import Paw from '../components/Paw';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.errors?.email?.[0] || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-paws" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <Paw key={i} className="login-paw" style={{ left: `${8 + i * 12}%`, animationDelay: `${i * 0.7}s` }} />)}</div>
      <form className="login-card" onSubmit={submit}>
        <img src="/images/LOGO/paas-mark-sunset.png" alt="Paw Avenue Sanctuary" />
        <h1>Admin sign in</h1>
        <p className="muted">Staff only. Visitors don’t need an account.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required autoFocus /></label>
        <label className="field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="back-link">← Back to the website</Link>
      </form>
    </div>
  );
}
