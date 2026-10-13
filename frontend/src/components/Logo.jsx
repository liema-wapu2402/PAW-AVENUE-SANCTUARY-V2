import { Link } from 'react-router-dom';

/**
 * Responsive brand lockup: the original heart + dog + cat mark (tinted) with the name as live text.
 * tone: "light" (for light backgrounds) | "dark" (for dark backgrounds)
 */
export default function Logo({ tone = 'light', to = '/', className = '', compact = false }) {
  const mark = tone === 'dark' ? '/images/LOGO/paas-mark-cream.png' : '/images/LOGO/paas-mark-sunset.png';
  return (
    <Link to={to} className={`brand brand-${tone} ${compact ? 'brand-compact' : ''} ${className}`} aria-label="Paw Avenue Sanctuary - home">
      <img src={mark} alt="" width="500" height="464" />
      <span className="brand-text">
        <b>Paw Avenue</b>
        <small>Sanctuary</small>
      </span>
    </Link>
  );
}
