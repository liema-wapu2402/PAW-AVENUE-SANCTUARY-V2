import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../auth";
import { IconDefs } from "../components/Icons";
import { RESOURCES, NAV_ORDER } from "./resources";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const signOut = async () => {
    await logout();
    navigate("/admin/login");
  };

  // Close the mobile menu on navigation, and give the top bar a shadow once scrolled.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initial = (user?.name || "A").trim()[0].toUpperCase();

  return (
    <div className={`admin ${open ? "menu-open" : ""}`}>
      <IconDefs />
      <aside className="admin-side">
        <Link to="/admin" className="admin-brand">
          <img src="/images/LOGO/paas-mark-cream.png" alt="" />
          <span>
            Paw Avenue Sanctuary<small>Admin</small>
          </span>
        </Link>
        <nav>
          <NavLink to="/admin" end>
            <i className="nav-ico">📊</i>
            <span>Dashboard</span>
          </NavLink>
          {NAV_ORDER.map((k) => (
            <NavLink key={k} to={`/admin/${k}`}>
              <i className="nav-ico">{RESOURCES[k].icon}</i>
              <span>{RESOURCES[k].label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-side-foot">
          <a href="/" target="_blank" rel="noreferrer">
            <i className="nav-ico">🌐</i>
            <span>View website</span>
          </a>
          <button onClick={signOut}>
            <i className="nav-ico">⎋</i>
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      {open && <div className="admin-scrim" onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className={`admin-top ${scrolled ? "is-scrolled" : ""}`}>
          <button
            className="admin-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="admin-hello">
            Hello, {user.name} <span className="wave">👋</span>
          </span>
          <span className="admin-chip" title={user.name}>
            {initial}
          </span>
        </header>
        <div className="admin-content" key={pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
