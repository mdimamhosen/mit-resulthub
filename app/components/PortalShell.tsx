import { NavLink, Outlet, useNavigate } from "react-router";
import { clearSession } from "../lib/auth";
import type { Session } from "../lib/types";
import "../styles/portal.css";

const NAV = [
  {
    to: "/portal",
    label: "Dashboard",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: "/portal/assignments",
    label: "Assignments",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    to: "/portal/grades",
    label: "Results & Grades",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    to: "/portal/courses",
    label: "My Courses",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    to: "/portal/schedule",
    label: "Class Routine",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    to: "/portal/notices",
    label: "Notices",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
];

export function PortalShell({ session }: { session: Session }) {
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="portal-app">
      <header className="portal-topbar">
        <a href="/portal" className="portal-topbar-brand">
          <img src="/logo-removebg-preview.png" alt="MIT" />
          <span>
            Student Portal
            <br />
            <small style={{ fontWeight: 400, opacity: 0.9 }}>
              Melbourne Institute of Technology
            </small>
          </span>
        </a>
        <div className="portal-topbar-user">
          <span>
            {session.fullName} ({session.studentId})
          </span>
          <button type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <div className="portal-body">
        <nav className="portal-sidebar" aria-label="Portal navigation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `portal-nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className="portal-main">
          <Outlet context={{ session }} />
        </main>
      </div>
    </div>
  );
}
