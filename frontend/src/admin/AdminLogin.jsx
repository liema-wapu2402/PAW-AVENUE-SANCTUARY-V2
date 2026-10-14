import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Paw from "../components/Paw";
import Icon, { IconDefs } from "../components/Icons";
import LoadingModal from "../components/LoadingModal";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ==========================================================================
   INSTANT LOGIN  (hard-coded switch)
   --------------------------------------------------------------------------
   instantLogin = 'on'   -> the login form opens with the default admin
                            email + password already filled in, so pressing
                            "Sign in" logs you straight in.
   instantLogin = 'off'  -> the fields start empty and NO admin info is used.

   Change the value below by hand (it is intentionally NOT read from .env).
   NOTE: these values end up inside the public JavaScript bundle, so set
   instantLogin to 'off' before the site goes live.
   ========================================================================== */
const instantLogin = "on";

// Default admin account used when instantLogin === 'on'.
const DEFAULT_ADMIN = {
  email: "admin@pawavenue.test",
  password: "password123",
};

const isInstant = instantLogin === "on";

const LOADING_STEPS = [
  "Checking your details…",
  "Unlocking the dashboard…",
  "Almost there…",
];

const EyeIcon = ({ off }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(isInstant ? DEFAULT_ADMIN.email : "");
  const [password, setPassword] = useState(
    isInstant ? DEFAULT_ADMIN.password : ""
  );
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await wait(900); // keep the loading modal on screen long enough to be seen
      await login(email, password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.errors?.email?.[0] || err.message);
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <IconDefs />
      <LoadingModal show={busy} title="Signing you in" steps={LOADING_STEPS} />
      <div className="login-paws" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <Paw
            key={i}
            className="login-paw"
            style={{ left: `${8 + i * 12}%`, animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>
      <div className="login-orb login-orb-a" aria-hidden="true" />
      <div className="login-orb login-orb-b" aria-hidden="true" />

      <form className="login-card" onSubmit={submit}>
        <div className="login-top">
          <img
            src="/images/LOGO/paas-mark-sunset.png"
            alt="Paw Avenue Sanctuary"
          />
          <span className="login-eyebrow">
            <Icon name="paw" /> Paw Avenue Sanctuary
          </span>
          <h1>Admin sign in</h1>
          <p className="muted">Staff only. Visitors don’t need an account.</p>
        </div>

        {isInstant && (
          <div className="login-hint" role="note">
            <Icon name="check" />
            <span>
              <b>Instant login is on.</b> The admin details are filled in. Just
              press <b>Sign in</b>.
            </span>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="you@pawavenue.com"
            required
            autoFocus={!isInstant}
          />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="pw-wrap">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              aria-pressed={showPw}
              title={showPw ? "Hide password" : "Show password"}
            >
              <EyeIcon off={showPw} />
            </button>
          </div>
        </label>

        <button
          className="btn btn-primary btn-lg btn-block"
          disabled={busy}
          autoFocus={isInstant}
        >
          {busy ? (
            "Signing in…"
          ) : (
            <>
              Sign in <Icon name="arrow" className="btn-icon" />
            </>
          )}
        </button>
        <Link to="/" className="back-link">
          ← Back to the website
        </Link>
      </form>
    </div>
  );
}
