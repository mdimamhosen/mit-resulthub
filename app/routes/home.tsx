import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { getSession, login } from "../lib/auth";
import { ensureDbInitialized } from "../lib/init";
import "../styles/login.css";

export function meta() {
  return [
    { title: "Log in | Melbourne Institute of Technology" },
    {
      name: "description",
      content: "Log in to your Melbourne Institute of Technology account.",
    },
  ];
}

const CURRENT_STUDENTS = [
  "AMS",
  "Orientation",
  "Enrolments",
  "Academic Calendar",
  "FEE-HELP",
  "Library",
  "Student Services",
];

const STUDY_WITH_US = [
  "How to Apply",
  "Information for Agents",
  "Student Testimonials",
  "International Students",
];

const INFORMATION_ABOUT = [
  "MIT",
  "Governance",
  "School of Business",
  "School of IT and Engineering",
  "MIT Contacts",
  "Campuses and Maps",
  "Corporate and Social Responsibilities",
  "Reporting Sexual Harassment",
  "MIT's Stance Against Domestic Violence",
  "MIT Group Foundation",
];

const CAMPUSES = {
  melbourne: {
    address: "288 La Trobe Street, Melbourne, VIC 3000, Australia",
    phone: "+61 03 8600 6700",
    email: "enquiries@mit.edu.au",
  },
  sydney: {
    address: "154-158 Sussex Street, Sydney, NSW 2000, Australia",
    phone: "+61 02 8267 1400",
    email: "info.sydney@mit.edu.au",
  },
} as const;

type CampusKey = keyof typeof CAMPUSES;

type AriaBool = "true" | "false";

function ariaExpandedAttr(expanded: boolean): { "aria-expanded": AriaBool } {
  return expanded ? { "aria-expanded": "true" } : { "aria-expanded": "false" };
}

function ariaSelectedAttr(selected: boolean): { "aria-selected": AriaBool } {
  return selected ? { "aria-selected": "true" } : { "aria-selected": "false" };
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="16" height="16">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden width="18" height="18">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function FooterLinks({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="footer-col">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <a href="#">{item}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "reset">("login");
  const [campusOpen, setCampusOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);
  const [activeCampus, setActiveCampus] = useState<CampusKey>("melbourne");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authReady, setAuthReady] = useState(false);

  const campus = CAMPUSES[activeCampus];

  useEffect(() => {
    ensureDbInitialized().then(() => {
      if (getSession()) navigate("/portal", { replace: true });
      setAuthReady(true);
    });
  }, [navigate]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = await login(username, password);
    if (!result.ok) {
      setLoginError(result.error);
      return;
    }
    navigate("/portal", { replace: true });
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="login-page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="login-header">
        <div className="header-inner">
          <button
            type="button"
            className="menu-toggle"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            {...ariaExpandedAttr(mobileMenuOpen)}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <a href="/" className="header-logo" aria-label="Melbourne Institute of Technology home">
            <img src="/logo-removebg-preview.png" alt="Melbourne Institute of Technology" />
          </a>

          <div className={`header-actions ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <div className="search-wrap">
              <input type="search" placeholder="search" aria-label="Search" />
              <SearchIcon />
            </div>

            <div className="header-dropdown">
              <button
                type="button"
                className="header-dropdown-btn"
                {...ariaExpandedAttr(campusOpen)}
                onClick={() => {
                  setCampusOpen(!campusOpen);
                  setQuickLinksOpen(false);
                }}
              >
                Campus location
              </button>
              {campusOpen && (
                <ul className="header-dropdown-menu">
                  <li>
                    <button type="button" onClick={() => setCampusOpen(false)}>
                      Melbourne Campus
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => setCampusOpen(false)}>
                      Sydney Campus
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <div className="header-dropdown">
              <button
                type="button"
                className="header-dropdown-btn"
                {...ariaExpandedAttr(quickLinksOpen)}
                onClick={() => {
                  setQuickLinksOpen(!quickLinksOpen);
                  setCampusOpen(false);
                }}
              >
                Quick links
              </button>
              {quickLinksOpen && (
                <ul className="header-dropdown-menu">
                  <li>
                    <a href="#">Library</a>
                  </li>
                  <li>
                    <a href="#">AMS</a>
                  </li>
                </ul>
              )}
            </div>

            <button type="button" className="btn-apply">
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="login-main">
        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            {...ariaSelectedAttr(activeTab === "login")}
            className={`login-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            <LockIcon />
            Log in
          </button>
          <button
            type="button"
            role="tab"
            {...ariaSelectedAttr(activeTab === "reset")}
            className={`login-tab ${activeTab === "reset" ? "active" : ""}`}
            onClick={() => setActiveTab("reset")}
          >
            <LockIcon />
            Reset your password
          </button>
        </div>

        <div className="login-form-panel">
          {!authReady ? (
            <p className="form-hint">Loading…</p>
          ) : activeTab === "login" ? (
            <form onSubmit={handleLogin}>
              {loginError && <div className="auth-error">{loginError}</div>}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <UserIcon />
                  Username <span className="required">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
                <p className="form-hint">
                  Enter your Melbourne Institute of Technology username.
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <LockIcon />
                  Password <span className="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <p className="form-hint">
                  Enter the password that accompanies your username.
                </p>
              </div>

              <button type="submit" className="btn-login">
                Log in
              </button>
              <p className="auth-link-row">
                New student? <Link to="/signup">Create an account</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleReset} className="reset-panel">
              <p>
                Enter your username or email address and we will send you instructions
                on how to reset your password.
              </p>
              <div className="form-group form-group-first">
                <label htmlFor="reset-email" className="form-label">
                  <UserIcon />
                  Username or email address <span className="required">*</span>
                </label>
                <input
                  id="reset-email"
                  type="text"
                  className="form-input"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-login">
                Reset password
              </button>
            </form>
          )}
        </div>
      </main>

      <nav className="sub-nav" aria-label="Quick actions">
        <div className="sub-nav-inner">
          <a href="#" className="sub-nav-item whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat with us
          </a>
          <a href="#" className="sub-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Enquire now
          </a>
          <a href="#" className="sub-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download student guide
          </a>
        </div>
      </nav>

      <footer className="footer-red">
        <div className="footer-red-inner">
          <div className="footer-brand">
            <img src="/logo-removebg-preview.png" alt="" />
          </div>

          <FooterLinks title="Current Students" items={CURRENT_STUDENTS} />
          <FooterLinks title="Study With Us" items={STUDY_WITH_US} />
          <FooterLinks title="Information About" items={INFORMATION_ABOUT} />

          <div className="footer-col">
            <h3>Connect with Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l6.35 3.27-6.35 3.27z" />
                </svg>
              </a>
            </div>

            <div className="campus-tabs">
              <button
                type="button"
                className={`campus-tab ${activeCampus === "melbourne" ? "active" : ""}`}
                onClick={() => setActiveCampus("melbourne")}
              >
                Melbourne
              </button>
              <button
                type="button"
                className={`campus-tab ${activeCampus === "sydney" ? "active" : ""}`}
                onClick={() => setActiveCampus("sydney")}
              >
                Sydney
              </button>
            </div>

            <div className="contact-block">
              <p>
                <strong>Address</strong>
                {campus.address}
              </p>
              <p>
                <strong>Phone</strong>
                {campus.phone}
              </p>
              <p>
                <strong>Email</strong>
                <a href={`mailto:${campus.email}`}>{campus.email}</a>
              </p>
            </div>
          </div>

          <div className="footer-legal-links">
            <a href="#">Copyright</a>
            <a href="#">Disclaimer</a>
            <a href="#">Privacy</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>

      <footer className="footer-dark">
        <div className="footer-dark-inner">
          <div className="acknowledgement">
            <h4>Acknowledgement of country</h4>
            <p>
              We work and learn on the lands of the Wurundjeri people of the Kulin
              Nation and the Gadigal people of the Eora Nation, who have been
              custodians of this land for thousands of years. We acknowledge and pay
              our respects to their Elders past, present and emerging.
            </p>
          </div>

          <div className="footer-bottom-row">
            <p>
              Melbourne Institute of Technology Pty Ltd
              <br />
              ABN: 20 072 324 755
              <br />
              CRICOS Provider No: 01545C, 03245K (NSW)
              <br />
              TEQSA Provider Identification Number: 12138
            </p>
            <p>
              Copyright: Melbourne Institute of Technology, 2026
              <br />
              Institute Of Higher Education
              <br />
              Authorised by: Corporate &amp; Legal Department
              <br />
              Content coordinator: Systems Development Division
            </p>
          </div>
        </div>
      </footer>

      <button
        type="button"
        className={`scroll-top-btn ${showScrollTop ? "visible" : ""}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </button>
    </div>
  );
}
