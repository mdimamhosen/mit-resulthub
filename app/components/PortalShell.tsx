import { NavLink, Outlet, useNavigate } from "react-router";
import { clearSession } from "../lib/auth";
import type { Session } from "../lib/types";
import "../styles/portal.css";

const NAV = [
  { to: "/portal", label: "Dashboard", end: true },
  { to: "/portal/assignments", label: "Assignments" },
  { to: "/portal/grades", label: "Results & Grades" },
  { to: "/portal/courses", label: "My Courses" },
  { to: "/portal/schedule", label: "Class Routine" },
  { to: "/portal/notices", label: "Notices" },
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
              {item.label}
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
