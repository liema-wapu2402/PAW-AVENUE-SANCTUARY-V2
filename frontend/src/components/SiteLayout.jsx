import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Logo from './Logo';
import Icon, { IconDefs } from './Icons';

const LINKS = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/adopt', 'Adopt'],
  ['/veterinarians', 'Veterinarians'],
  ['/services', 'Services'],
  ['/contact', 'Contact'],
];

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  // new page -> top (or to the #section if the link had one)
  useEffect(() => {
    setOpen(false);
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock page scroll behind the open mobile menu, close it with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="site">
      <IconDefs />
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`nav ${scrolled ? 'nav-solid' : ''} ${open ? 'nav-open' : ''}`}>
        <div className="container">
          <div className="nav-bar">
            <Logo />
            <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-nav">
              <span /><span /><span />
            </button>
            <nav className="nav-links" id="site-nav">
              {LINKS.map(([to, label]) => (
                <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
              ))}
              <Link to="/adopt" className="btn btn-primary btn-sm nav-cta">Adopt a friend <Icon name="paw" className="btn-icon" /></Link>
            </nav>
          </div>
        </div>
      </header>
      {open && <button className="nav-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <main id="main"><Outlet /></main>
      <Footer />
    </div>
  );
}
