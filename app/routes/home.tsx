import { useState, useEffect, type FormEvent } from "react";
import "./../styles/archive.css";

export function meta() {
  return [
    {
      title: "Melbourne Institute of Technology | Higher Education Excellence",
    },
    {
      name: "description",
      content:
        "Expertise in Business, Accounting, IT, Networking, Engineering and Telecommunications.",
    },
  ];
}

// Mock Data for Result Archive
const STUDENT_DB: Record<string, any> = {
  M21431111194: {
    id: "M21431111194",
    regNo: "UU26793",
    name: "FAZLA RABBI",
    department: "Business Administration",
    degree: "Bachelor of Business Administration",
    cgpa: "2.54",
    passingYear: "2018",
    certificateNo: "8982",
    status: "Passed",
  },
  F21434211011: {
    id: "F21434211011",
    regNo: "UU26713",
    name: "AFSANA NASRIN",
    department: "Physical Education",
    degree: "Bachelor of Physical Education",
    cgpa: "3.45",
    passingYear: "2015",
    certificateNo: "7712",
    status: "Passed",
  },
  M21435121050: {
    id: "M21435121050",
    regNo: "UU26903",
    name: "MD. MEHEDI HASAN",
    department: "Civil Engineering",
    degree: "B.Sc in Civil Engineering",
    cgpa: "2.72",
    passingYear: "2018",
    certificateNo: "10079",
    status: "Passed",
  },
  "10322209": {
    id: "10322209",
    regNo: "UU27011",
    name: "MAHEDI HASSAN SARKER",
    department: "Software Engineering (Fast Track)",
    degree: "Bachelor of Software Engineering (Honours)",
    cgpa: "3.64",
    passingYear: "2026",
    graduationDate: "January 3, 2026",
    certificateNo: "MIT-SE-2026-001",
    status: "Passed",
  },
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<"search" | "loading" | "result">("search");
  const [studentId, setStudentId] = useState("");
  const [studentResult, setStudentResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Securly connecting to MIT database...",
  );

  const loadingMessages = [
    "Securly connecting to MIT database...",
    "Authenticating student profile...",
    "Retrieving academic records...",
    "Verifying transcript authenticity...",
    "Finalizing report generation...",
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;

    setView("loading");
    setProgress(0);
    setLoadingMessage(loadingMessages[0]);

    const duration = 5000;
    const intervalTime = 100;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = (currentStep / steps) * 100;
      setProgress(nextProgress);

      const msgIndex = Math.min(
        Math.floor((currentStep / steps) * loadingMessages.length),
        loadingMessages.length - 1,
      );
      setLoadingMessage(loadingMessages[msgIndex]);

      if (currentStep >= steps) {
        clearInterval(interval);
        const result = STUDENT_DB[studentId.toUpperCase().trim()];
        setStudentResult(result || null);
        setView("result");
        setTimeout(() => {
          document
            .getElementById("archive-section")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }, intervalTime);
  };

  const reset = () => {
    setView("search");
    setStudentId("");
    setStudentResult(null);
  };

  return (
    <div className="landing-wrapper">
      {/* Utility Nav */}
      <div className="utility-nav">
        <div className="container-wide utility-content">
          <span className="utility-link">Campus location ▼</span>
          <span className="utility-link">Quick links ▼</span>
          <span className="utility-link apply-now" style={{ color: "white" }}>
            Apply now
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container-wide header-flex">
          <img
            src="/logo-removebg-preview.png"
            alt="MIT Logo"
            className="mit-logo"
          />

          <div
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </div>

          <nav className={`nav-links ${isMenuOpen ? "mobile-active" : ""}`}>
            <span className="nav-item">Courses</span>
            <span className="nav-item">How to apply</span>
            <span className="nav-item">Entry requirements</span>
            <span className="nav-item">Scholarships</span>
            <span className="nav-item">Contact us</span>
          </nav>

          <div className="header-search">
            <input type="text" placeholder="Search..." />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="container-wide">
          <div className="scholarship-card">
            <h2>Equity and Access</h2>
            <h3>Scholarships</h3>
            <button className="btn-red">LEARN MORE ›</button>
          </div>
        </div>
      </section>

      {/* Quick Action Tabs */}
      <section className="status-tabs">
        <div className="container-wide tabs-flex">
          <div className="tab-item">
            <div className="tab-icon">🏛️</div>
            <div>DOMESTIC STUDENT</div>
          </div>
          <div className="tab-item">
            <div className="tab-icon">🌏</div>
            <div>INTERNATIONAL STUDENT</div>
          </div>
          <div className="tab-item">
            <div className="tab-icon">💡</div>
            <div>NON-AWARD STUDENT</div>
          </div>
          <div className="tab-item">
            <div className="tab-icon">🎓</div>
            <div>RESEARCH</div>
          </div>
        </div>
      </section>

      {/* Find Your Course */}
      <section className="mit-section">
        <div className="container-wide">
          <h2 className="section-title">
            Find your <span>course</span>
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: "40px",
              maxWidth: "700px",
              margin: "0 auto 40px",
            }}
          >
            We're a small institute with big dreams. Find out where you want to
            go and our supportive, intimate environment will help you get there.
          </p>

          <div className="course-grid">
            {[
              { name: "Accounting", icon: "📊" },
              { name: "Business Analytics", icon: "📈" },
              { name: "Cyber Security", icon: "🔒" },
              { name: "Data Analytics", icon: "📂" },
              { name: "Management", icon: "👥" },
              { name: "Network", icon: "🌐" },
              { name: "Marketing and Digital Communications", icon: "📱" },
              { name: "Networking", icon: "🔌" },
              { name: "Software Engineering", icon: "💻" },
              { name: "Cloud Computing", icon: "☁️" },
              { name: "Visual Effects and Animation", icon: "🎨" },
              { name: "Engineering", icon: "⚙️" },
              { name: "Project Management", icon: "📝" },
              { name: "Information Technology", icon: "🖥️" },
              { name: "Telecommunications Engineering", icon: "📡" },
              { name: "Higher Education", icon: "🎓" },
            ].map((course, i) => (
              <div key={i} className="course-item">
                <div className="course-icon-wrapper">
                  <div className="course-icon">{course.icon}</div>
                </div>
                <div className="course-name">{course.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Result Archive Section (Restored to Previous UI) */}
      <section
        id="archive-section"
        className="mit-section"
        style={{ background: "#f8fafc", padding: "40px 0" }}
      >
        <div className="mit-container">
          <div className="archive-header">
            <div className="logo-section">
              <img
                src="/logo-removebg-preview.png"
                alt="Melbourne Institute of Technology Logo"
                className="mit-logo"
              />
            </div>

            <div className="social-icons">
              <div className="icon-circle">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div className="icon-circle">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </div>
              <div className="icon-circle">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="icon-circle">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
              </div>
            </div>

            <h1 className="archive-title">Result Archive</h1>
          </div>

          <div className="main-card">
            {view === "search" && (
              <div className="search-box">
                <div className="input-header">
                  Student ID / Registration No{" "}
                  <span style={{ color: "red" }}>*</span>
                </div>
                <div className="input-body">
                  <form onSubmit={handleSearch} className="search-form">
                    <input
                      type="text"
                      className="archive-input"
                      placeholder="Enter Your Input"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                    <button type="submit" className="archive-button">
                      Search
                    </button>
                  </form>
                </div>
              </div>
            )}

            {view === "loading" && (
              <div className="loader-container">
                <div className="loading-circle"></div>
                <div className="loading-progress">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${progress}%`,
                      transition: "width 0.1s linear",
                    }}
                  ></div>
                </div>
              </div>
            )}

            {view === "result" && (
              <div className="result-box">
                <div className="input-header">
                  Student ID / Registration No{" "}
                  <span style={{ color: "red" }}>*</span>
                </div>
                <div className="input-body" style={{ marginBottom: "20px" }}>
                  <div className="search-form">
                    <input
                      type="text"
                      className="archive-input"
                      value={studentId}
                      readOnly
                    />
                    <button className="archive-button" onClick={reset}>
                      Search
                    </button>
                  </div>
                </div>

                {studentResult ? (
                  <>
                    <div className="info-header">Student Information</div>
                    <div
                      className="result-table-container"
                      style={{ margin: "0 20px 25px 20px" }}
                    >
                      <table className="result-table">
                        <tbody>
                          <tr>
                            <td className="label-cell">Student ID</td>
                            <td className="value-cell">{studentResult.id}</td>
                          </tr>
                          <tr>
                            <td className="label-cell">Registration No</td>
                            <td className="value-cell">
                              {studentResult.regNo}
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Student Name</td>
                            <td
                              className="value-cell"
                              style={{ fontWeight: "bold" }}
                            >
                              {studentResult.name}
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Department</td>
                            <td className="value-cell">
                              {studentResult.department}
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Degree Awarded</td>
                            <td className="value-cell">
                              {studentResult.degree}
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">CGPA</td>
                            <td
                              className="value-cell"
                              style={{ fontWeight: "600", color: "#2D3748" }}
                            >
                              {studentResult.cgpa}
                            </td>
                          </tr>
                          <tr>
                            <td className="label-cell">Passing Year</td>
                            <td className="value-cell">
                              {studentResult.passingYear}
                            </td>
                          </tr>
                          {studentResult.graduationDate && (
                            <tr>
                              <td className="label-cell">Graduation Date</td>
                              <td className="value-cell">
                                {studentResult.graduationDate}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td className="label-cell">Status</td>
                            <td
                              className="value-cell status-passed"
                              style={{ color: "green", fontWeight: "bold" }}
                            >
                              {studentResult.status}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: "50px", marginBottom: "20px" }}>
                      🔍
                    </div>
                    <h2 style={{ color: "var(--primary-red)" }}>
                      No Result Found
                    </h2>
                    <p style={{ color: "#718096" }}>
                      The ID "{studentId}" does not exist in our archive.
                    </p>
                  </div>
                )}
                <div
                  className="back-link"
                  onClick={reset}
                  style={{ padding: "0 20px 20px" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "8px" }}
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Search
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Study */}
      <section className="mit-section">
        <div className="container-wide">
          <h2 className="section-title">
            Why <span>study</span> at MIT
          </h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <h4>Personalised support</h4>
              <p>
                You'll fill our coffee lounge and our hearts, we don't have huge
                crowds so we can support you individually. We'll encourage you
                to step out of your comfort zone and find that amazing version
                of you.
              </p>
            </div>
            <div className="benefit-card">
              <h4>Student support that goes the extra mile</h4>
              <p>
                You can count on us to go the extra mile - from academic to
                career help, our staff can assist with everything from finding a
                doctor to finding work, making sure you can reach your maximum
                potential at MIT.
              </p>
            </div>
            <div className="benefit-card">
              <h4>More part-skills development</h4>
              <p>
                MIT courses are designed with added value - it focuses on making
                sure you are industry-ready when you graduate with industry
                placement, hands-on learning and many more help along the
                journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section className="mit-section" style={{ background: "#f8fafc" }}>
        <div className="container-wide">
          <h2 className="section-title">
            News and <span>Events</span>
          </h2>
          <div className="news-grid">
            <div className="news-card">
              <img src="/news-1.png" alt="Momo Fest" className="news-img" />
              <div className="news-body">
                <span className="news-tag">NEWS</span>
                <h3 className="news-title">
                  MIT Supports MOMO Fest 2024 - Strategic Corporate Social
                  Responsibility Initiative
                </h3>
                <p className="news-date">March 2024</p>
                <span className="read-more">Learn more ›</span>
              </div>
            </div>
            <div className="news-card">
              <img src="/news-2.png" alt="White Ribbon" className="news-img" />
              <div className="news-body">
                <span className="news-tag">EVENTS</span>
                <h3 className="news-title">
                  White Ribbon Awareness Day: Promoting Safety and Equality
                </h3>
                <p className="news-date">April 2024</p>
                <span className="read-more">Join event ›</span>
              </div>
            </div>
            <div className="news-card">
              <img
                src="/logo-removebg-preview.png"
                alt="MIT status"
                className="news-img"
                style={{
                  objectFit: "contain",
                  padding: "20px",
                  background: "#eee",
                }}
              />
              <div className="news-body">
                <span className="news-tag">NEWS</span>
                <h3 className="news-title">
                  Melbourne Institute of Technology (MIT) Achieves
                  Self-Accrediting Authority Status
                </h3>
                <p className="news-date">January 2024</p>
                <span className="read-more">Read details ›</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mit-footer">
        <div className="container-wide">
          <div className="footer-grid">
            <div className="footer-col">
              <img
                src="/logo-removebg-preview.png"
                alt="Footer Logo"
                className="footer-logo"
              />
              <p
                style={{ fontSize: "14px", lineHeight: "1.6", opacity: "0.8" }}
              >
                Melbourne Institute of Technology provides industry-relevant
                education in a supportive environment.
              </p>
            </div>
            <div className="footer-col">
              <h5>Quick Links</h5>
              <ul className="footer-links">
                <li>Courses</li>
                <li>How to apply</li>
                <li>Entry requirements</li>
                <li>Scholarships</li>
                <li>Contact us</li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Future Students</h5>
              <ul className="footer-links">
                <li>Domestic</li>
                <li>International</li>
                <li>Study at MIT Sydney</li>
                <li>Study at MIT Melbourne</li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Connect</h5>
              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <span style={{ cursor: "pointer" }}>Facebook</span>
                <span style={{ cursor: "pointer" }}>LinkedIn</span>
                <span style={{ cursor: "pointer" }}>Twitter</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; 2024 Melbourne Institute of Technology. All Rights Reserved.
            | CRICOS Provider Code: 01545C
          </div>
        </div>
      </footer>
    </div>
  );
}
