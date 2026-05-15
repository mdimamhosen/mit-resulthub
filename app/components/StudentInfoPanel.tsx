import type { Session } from "../lib/types";

const ROWS: { label: string; key: keyof Session }[] = [
  { label: "Student ID", key: "studentId" },
  { label: "Registration No", key: "registrationNo" },
  { label: "Student Name", key: "fullName" },
  { label: "Department", key: "department" },
  { label: "Degree Awarded", key: "degreeAwarded" },
  { label: "CGPA", key: "cgpa" },
  { label: "Passing Year", key: "passingYear" },
  { label: "Graduation Date", key: "graduationDate" },
  { label: "Status", key: "academicStatus" },
];

function formatValue(session: Session, key: keyof Session): string {
  if (key === "cgpa") {
    const val = session.cgpa;
    return typeof val === "number" && val > 0 ? val.toFixed(2) : String(val ?? "—");
  }
  const val = session[key];
  return val != null && val !== "" ? String(val) : "—";
}

export function StudentInfoPanel({ session }: { session: Session }) {
  return (
    <div className="portal-panel student-info-panel">
      <div className="portal-panel-header">Student Information</div>
      <table className="portal-table student-info-table">
        <tbody>
          {ROWS.map(({ label, key }) => (
            <tr key={key}>
              <td className="student-info-label">{label}</td>
              <td
                className={`student-info-value${
                  key === "academicStatus" && session.academicStatus === "Passed"
                    ? " status-passed"
                    : ""
                }${key === "fullName" ? " student-name" : ""}`}
              >
                {formatValue(session, key)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
