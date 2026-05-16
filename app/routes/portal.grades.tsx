import { useEffect, useState } from "react";
import { getGrades } from "../lib/database";
import { calculateGpa, groupGradesBySemester, semesterGpa } from "../lib/gpa";
import { usePortalContext } from "../hooks/usePortalContext";
import { StudentInfoPanel } from "../components/StudentInfoPanel";
import type { Grade } from "../lib/types";

export function meta() {
  return [{ title: "Results & Grades | MIT Student Portal" }];
}

export default function PortalGrades() {
  const { session } = usePortalContext();
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    getGrades(session.userId).then(setGrades);
  }, [session.userId]);

  const { gpa: calculatedGpa, totalCredits } = calculateGpa(grades);
  const officialCgpa = session.cgpa > 0 ? session.cgpa : calculatedGpa;
  const bySemester = groupGradesBySemester(grades);
  const semesters = Object.keys(bySemester).sort().reverse();

  return (
    <>
      <h1 className="portal-page-title">Results &amp; Grades</h1>
      <p className="portal-page-subtitle">Semester-wise academic performance and GPA summary.</p>

      <StudentInfoPanel session={session} />

      <div className="portal-grid">
        <div className="portal-card">
          <h3>Official CGPA</h3>
          <p className="stat">{officialCgpa.toFixed(2)}</p>
        </div>
        <div className="portal-card">
          <h3>Total Credits</h3>
          <p className="stat">{totalCredits}</p>
        </div>
        <div className="portal-card">
          <h3>Courses Completed</h3>
          <p className="stat">{grades.length}</p>
        </div>
      </div>

      {semesters.map((sem) => {
        const semGrades = bySemester[sem]!;
        const sgpa = semesterGpa(semGrades);
        return (
          <div key={sem} className="portal-panel">
            <div className="portal-panel-header">
              {sem} — <span style={{ color: "var(--mit-red)" }}>GPA: {sgpa.toFixed(2)}</span>
            </div>
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course</th>
                  <th>Credit</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {semGrades.map((g) => (
                  <tr key={g.id}>
                    <td>{g.courseCode}</td>
                    <td>{g.courseName}</td>
                    <td>{g.credit}</td>
                    <td>
                      {g.marks}/{g.maxMarks}
                    </td>
                    <td>{g.grade}</td>
                    <td>{g.gradePoint.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
