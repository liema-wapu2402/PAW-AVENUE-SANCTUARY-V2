import { useEffect, useState } from 'react';
import Paw from './Paw';

/**
 * Full-screen loading modal (used while signing in / signing out).
 *   <LoadingModal show={busy} title="Signing you in" steps={['Checking…', 'Almost there…']} />
 * `steps` (optional) rotates a short status line; otherwise `text` is shown.
 */
export default function LoadingModal({ show, title = 'Please wait', text = 'Just a moment…', steps }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show || !steps?.length) return setStep(0);
    const t = setInterval(() => setStep((n) => Math.min(n + 1, steps.length - 1)), 1100);
    return () => clearInterval(t);
  }, [show, steps]);

  if (!show) return null;
  const line = steps?.length ? steps[step] : text;
  return (
    <div className="loading-modal" role="alertdialog" aria-modal="true" aria-live="polite" aria-busy="true" aria-label={title}>
      <div className="loading-card">
        <div className="loading-spinner" aria-hidden="true">
          <span className="loading-ring" />
          <img src="/images/LOGO/paas-mark-sunset.png" alt="" />
        </div>
        <h2>{title}<span className="loading-dots" aria-hidden="true"><i /><i /><i /></span></h2>
        <p key={line}>{line}</p>
        <div className="loading-trail" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((n) => <Paw key={n} className="loading-step" style={{ animationDelay: `${n * 0.25}s` }} />)}
        </div>
      </div>
    </div>
  );
}
