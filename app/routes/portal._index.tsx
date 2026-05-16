import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  getAssignments,
  getCourses,
  getGrades,
  getNotices,
  getSubmissions,
} from "../lib/database";
import { getDeadlineStatus, statusLabel } from "../lib/assignments";
import { StudentInfoPanel } from "../components/StudentInfoPanel";
import { usePortalContext } from "../hooks/usePortalContext";
import type { Assignment, Notice, Submission } from "../lib/types";

export function meta() {
  return [{ title: "Dashboard | MIT Student Portal" }];
}

export default function PortalDashboard() {
  const { session } = usePortalContext();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [cgpa, setCgpa] = useState(session.cgpa ?? 0);
  const [courseCount, setCourseCount] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const uid = session.userId;
    Promise.all([
      getAssignments(uid),
      getSubmissions(uid),
      getCourses(uid),
      getNotices(),
    ]).then(([a, s, c, n]) => {
      setAssignments(a);
      setSubmissions(s);
      setCourseCount(c.length);
      setNotices(n.slice(0, 3));
    });
  }, [session.userId]);

  useEffect(() => {
    setCgpa(session.cgpa ?? 0);
  }, [session.cgpa]);

  const submissionMap = new Map(submissions.map((s) => [s.assignmentId, s]));
  const pending = assignments.filter((a) => !submissionMap.has(a.id));
  const overdue = pending.filter(
    (a) => getDeadlineStatus(a, undefined) === "overdue",
  );

  return (
    <>
      <h1 className="portal-page-title">Welcome, {session.fullName.split(" ")[0]}</h1>
      <p className="portal-page-subtitle">{session.degreeAwarded || session.program}</p>

      <StudentInfoPanel session={session} />

      <div className="portal-grid">
        <div className="portal-card">
          <h3>Enrolled Courses</h3>
          <p className="stat">{courseCount}</p>
        </div>
        <div className="portal-card">
          <h3>CGPA</h3>
          <p className="stat">{cgpa > 0 ? cgpa.toFixed(2) : "—"}</p>
        </div>
        <div className="portal-card">
          <h3>Pending Assignments</h3>
          <p className="stat">{pending.length}</p>
        </div>
        <div className="portal-card">
          <h3>Overdue</h3>
          <p className="stat" style={{ color: overdue.length ? "var(--mit-red)" : "inherit" }}>
            {overdue.length}
          </p>
        </div>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">Upcoming deadlines</div>
        {pending.length === 0 ? (
          <p style={{ padding: 20, margin: 0, color: "var(--mit-text-muted)" }}>No pending assignments.</p>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assignment</th>
                <th>Deadline</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pending.slice(0, 5).map((a) => {
                const status = getDeadlineStatus(a, undefined);
                return (
                  <tr key={a.id}>
                    <td>{a.courseCode}</td>
                    <td>{a.title}</td>
                    <td>{new Date(a.deadline).toLocaleDateString("en-AU")}</td>
                    <td>
                      <span className={`badge badge-${status}`}>{statusLabel(status)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p style={{ padding: "12px 20px", margin: 0 }}>
          <Link to="/portal/assignments">View all assignments →</Link>
        </p>
      </div>

      <div className="portal-panel">
        <div className="portal-panel-header">Latest notices</div>
        {notices.map((n) => (
          <div
            key={n.id}
            className={`notice-item${n.priority === "high" ? " notice-priority-high" : ""}`}
          >
            <h4>{n.title}</h4>
            <p className="notice-meta">
              {n.category} · {new Date(n.date).toLocaleDateString("en-AU")}
            </p>
            <p style={{ margin: 0, fontSize: 14 }}>{n.body.slice(0, 120)}…</p>
          </div>
        ))}
        <p style={{ padding: "12px 20px", margin: 0 }}>
          <Link to="/portal/notices">All notices →</Link>
        </p>
      </div>
    </>
  );
}
