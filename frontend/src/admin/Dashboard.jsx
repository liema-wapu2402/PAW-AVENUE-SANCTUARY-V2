import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";
import Counter from "../components/Counter";
import Icon from "../components/Icons";
import Paw from "../components/Paw";

const CARDS = [
  {
    key: "pets_available",
    label: "Pets available",
    hint: "Waiting for a home",
    icon: "paw",
    to: "/admin/pets",
    tone: "sun",
  },
  {
    key: "pets_adopted",
    label: "Adopted",
    hint: "Found their family",
    icon: "heart",
    to: "/admin/pets",
    tone: "rose",
  },
  {
    key: "applications_pending",
    label: "Applications to review",
    hint: "Adoption requests",
    icon: "check",
    to: "/admin/applications",
    tone: "orange",
    urgent: true,
  },
  {
    key: "appointments_pending",
    label: "Consultations pending",
    hint: "Awaiting confirmation",
    icon: "calendar",
    to: "/admin/appointments",
    tone: "green",
    urgent: true,
  },
  {
    key: "messages_unread",
    label: "Unread messages",
    hint: "From visitors",
    icon: "mail",
    to: "/admin/messages",
    tone: "brown",
    urgent: true,
  },
  {
    key: "vets",
    label: "Veterinarians",
    hint: "In the directory",
    icon: "care",
    to: "/admin/vets",
    tone: "teal",
  },
];

const ACTIONS = [
  { label: "Add a pet", icon: "paw", to: "/admin/pets" },
  { label: "Review applications", icon: "check", to: "/admin/applications" },
  { label: "Read messages", icon: "chat", to: "/admin/messages" },
  { label: "Post news", icon: "star", to: "/admin/news" },
  { label: "Manage services", icon: "bubbles", to: "/admin/services" },
  { label: "Consultations", icon: "calendar", to: "/admin/appointments" },
];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

const today = () =>
  new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "🐾";

/** Cursor-follow glow on a card. */
const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

function AdoptionRing({ adopted = 0, available = 0, ready }) {
  const total = adopted + available;
  const pct = total ? Math.round((adopted / total) * 100) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="ring">
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd24d" />
            <stop offset=".55" stopColor="#ffa21f" />
            <stop offset="1" stopColor="#ee6a17" />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={R} className="ring-track" />
        <circle
          cx="70"
          cy="70"
          r={R}
          className="ring-bar"
          style={{
            strokeDasharray: C,
            strokeDashoffset: ready ? C - (C * pct) / 100 : C,
          }}
        />
      </svg>
      <div className="ring-center">
        <strong>
          <Counter to={pct} />%
        </strong>
        <small>adopted</small>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/dashboard")
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  const ready = !!stats;
  const needs = [
    {
      key: "applications_pending",
      label: "adoption applications to review",
      to: "/admin/applications",
      icon: "check",
    },
    {
      key: "appointments_pending",
      label: "consultations awaiting confirmation",
      to: "/admin/appointments",
      icon: "calendar",
    },
    {
      key: "messages_unread",
      label: "unread visitor messages",
      to: "/admin/messages",
      icon: "mail",
    },
  ].map((n) => ({ ...n, count: stats?.[n.key] ?? 0 }));
  const totalNeeds = needs.reduce((s, n) => s + n.count, 0);
  const firstName = (user?.name || "").split(" ")[0];

  return (
    <div className="dash">
      {/* ---------- hero ---------- */}
      <section className="dash-hero">
        <div className="dash-glow" aria-hidden="true" />
        <Paw className="dash-paw dp1" />
        <Paw className="dash-paw dp2" />
        <Paw className="dash-paw dp3" />
        <div className="dash-copy">
          <span className="dash-date">{today()}</span>
          <h1>
            {greeting()}
            {firstName ? `, ${firstName}` : ""}!
          </h1>
          <p>
            {!ready ? (
              "Gathering the latest from the sanctuary…"
            ) : totalNeeds ? (
              <>
                You have <b>{totalNeeds}</b>{" "}
                {totalNeeds === 1 ? "item" : "items"} waiting for your attention
                today.
              </>
            ) : (
              "Everything is caught up. The sanctuary is running smoothly."
            )}
          </p>
          <div className="dash-cta">
            <Link to="/admin/pets" className="btn btn-primary btn-sm">
              <Icon name="plus" /> Add a pet
            </Link>
            <Link
              to="/admin/applications"
              className="btn btn-glass-dark btn-sm"
            >
              Review applications <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <div className="dash-art" aria-hidden="true">
          <img src="/images/LOGO/paas-mark-cream.png" alt="" />
        </div>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ---------- stat cards ---------- */}
      <section className="stat-grid" aria-label="Overview">
        {CARDS.map((c, i) => (
          <Link
            to={c.to}
            key={c.key}
            className={`stat-card tone-${c.tone} ${!ready ? "is-loading" : ""}`}
            style={{ "--i": i }}
            onMouseMove={spotlight}
          >
            <span className="stat-top">
              <span className="stat-ico">
                <Icon name={c.icon} />
              </span>
              {c.urgent && ready && stats[c.key] > 0 && (
                <span className="stat-pulse" title="Needs attention" />
              )}
              <Icon name="arrow" className="stat-go" />
            </span>
            <strong className="stat-num">
              <Counter to={stats?.[c.key] ?? 0} />
            </strong>
            <span className="stat-label">{c.label}</span>
            <small>{c.hint}</small>
          </Link>
        ))}
      </section>

      {/* ---------- main bento ---------- */}
      <div className="dash-grid">
        <section className="panel dash-recent" style={{ "--i": 6 }}>
          <div className="panel-head">
            <div>
              <h2>Recent adoption applications</h2>
              <p className="muted">
                The latest people hoping to give a pet a home.
              </p>
            </div>
            <Link to="/admin/applications" className="link-arrow">
              View all <Icon name="arrow" />
            </Link>
          </div>
          {!ready ? (
            <ul className="recent">
              {[0, 1, 2].map((n) => (
                <li key={n} className="skeleton-row">
                  <span className="sk sk-av" />
                  <span className="sk sk-line" />
                  <span className="sk sk-pill" />
                </li>
              ))}
            </ul>
          ) : stats.recent_applications?.length ? (
            <ul className="recent">
              {stats.recent_applications.map((a, i) => (
                <li key={a.id} style={{ "--i": i }}>
                  <Link to="/admin/applications">
                    <span className="avatar">{initials(a.full_name)}</span>
                    <span className="recent-text">
                      <b>{a.full_name}</b>
                      <small>
                        wants to adopt <em>{a.pet || "a pet"}</em>
                      </small>
                    </span>
                    <span className={`badge badge-${a.status}`}>
                      {a.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <Paw className="empty-paw" />
              <p className="muted">
                No applications yet. They'll show up here.
              </p>
            </div>
          )}
        </section>

        <aside className="dash-side">
          <section className="panel dash-ring" style={{ "--i": 7 }}>
            <div className="panel-head">
              <h2>Adoption progress</h2>
            </div>
            <AdoptionRing
              adopted={stats?.pets_adopted}
              available={stats?.pets_available}
              ready={ready}
            />
            <div className="ring-legend">
              <span>
                <i className="dot dot-sun" /> Adopted{" "}
                <b>{stats?.pets_adopted ?? 0}</b>
              </span>
              <span>
                <i className="dot dot-sand" /> Still waiting{" "}
                <b>{stats?.pets_available ?? 0}</b>
              </span>
            </div>
          </section>

          <section className="panel dash-needs" style={{ "--i": 8 }}>
            <div className="panel-head">
              <h2>Needs your attention</h2>
            </div>
            <ul>
              {needs.map((n) => (
                <li key={n.key}>
                  <Link to={n.to} className={n.count ? "has" : ""}>
                    <span className="need-ico">
                      <Icon name={n.icon} />
                    </span>
                    <span className="need-text">
                      <b>{n.count}</b> {n.label}
                    </span>
                    <Icon name="arrow" className="need-go" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* ---------- quick actions ---------- */}
      <section className="panel dash-actions" style={{ "--i": 9 }}>
        <div className="panel-head">
          <h2>Quick actions</h2>
        </div>
        <div className="action-grid">
          {ACTIONS.map((a) => (
            <Link to={a.to} key={a.label} className="action">
              <span className="action-ico">
                <Icon name={a.icon} />
              </span>
              <span>{a.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
