import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../lib/auth";
import { ensureDbInitialized } from "../lib/init";
import "../styles/login.css";
import "../styles/portal.css";

export function meta() {
  return [
    { title: "Sign up | Melbourne Institute of Technology" },
    { name: "description", content: "Create your MIT student portal account." },
  ];
}

export default function Signup() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    studentId: "",
    program: "",
  });

  useEffect(() => {
    ensureDbInitialized().finally(() => setReady(true));
  }, []);

  const update = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const result = await register({
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      email: form.email,
      studentId: form.studentId,
      program: form.program || "Bachelor Program",
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/portal", { replace: true });
  };

  if (!ready) {
    return <div className="portal-loading">Preparing registration…</div>;
  }

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <img src="/logo-removebg-preview.png" alt="Melbourne Institute of Technology" />
          </Link>
        </div>
      </header>

      <main className="login-main auth-main-container">
        <h1 className="portal-page-title" style={{ marginTop: 24 }}>
          Create student account
        </h1>
        <p className="portal-page-subtitle">
          Register for the MIT Student Portal. Your data is stored locally in this browser.
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form-panel">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              className="form-input"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              Student ID <span className="required">*</span>
            </label>
            <input
              id="studentId"
              className="form-input"
              value={form.studentId}
              onChange={(e) => update("studentId", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="program">
              Program
            </label>
            <input
              id="program"
              className="form-input"
              value={form.program}
              onChange={(e) => update("program", e.target.value)}
              placeholder="e.g. Bachelor of Networking"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username <span className="required">*</span>
            </label>
            <input
              id="username"
              className="form-input"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm password <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" className="btn-login">
            Sign up
          </button>
          <p className="auth-link-row">
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
