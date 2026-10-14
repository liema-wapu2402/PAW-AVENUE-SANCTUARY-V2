import { Link } from "react-router-dom";
import { useApi } from "../hooks";
import Logo from "./Logo";
import Icon from "./Icons";

const fmt = (d) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const LINKS = [
  ["/", "Home"],
  ["/about", "About"],
  ["/adopt", "Adopt"],
  ["/veterinarians", "Veterinarians"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];

export default function Footer() {
  const { data: news } = useApi("/news");
  const latest = news?.[0];

  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo tone="dark" />
          <p>Rescue · Rehab · Rehome. Follow our journey for more updates.</p>
          <div className="socials">
            <a href="#" aria-label="Facebook">
              <Icon name="facebook" />
            </a>
            <a href="#" aria-label="Instagram">
              <Icon name="instagram" />
            </a>
            <a href="#" aria-label="X (Twitter)">
              <Icon name="x" />
            </a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <h4>Explore</h4>
          <ul>
            {LINKS.map(([to, label]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-contact">
          <h4>Visit &amp; reach us</h4>
          <ul>
            <li>
              <Icon name="pin" />
              <span>
                #1430 Gardenville Subdivision, Brgy. Lusacan, Tiaong, Quezon
              </span>
            </li>
            <li>
              <Icon name="phone" />
              <a href="tel:+639916178708">0991 617 8708</a>
            </li>
            <li>
              <Icon name="mail" />
              <a href="mailto:paw_avenue@gmail.com">paw_avenue@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <span>© {new Date().getFullYear()} Paw Avenue Sanctuary</span>
          {latest && (
            <span className="footer-news">
              <Icon name="paw" /> Latest: <b>{latest.title}</b> ·{" "}
              {fmt(latest.published_at)}
            </span>
          )}
          <Link to="/admin/login" className="staff-login">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.200"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4.500" y="10.500" width="15" height="10" rx="2.500" />
              <path d="M8 10.500V8a4 4 0 0 1 8 0v2.500" />
            </svg>
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}
