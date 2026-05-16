import { useEffect, useState } from "react";
import { getCourses, getMaterials } from "../lib/database";
import { usePortalContext } from "../hooks/usePortalContext";
import type { Course, CourseMaterial } from "../lib/types";

export function meta() {
  return [{ title: "My Courses | MIT Student Portal" }];
}

export default function PortalCourses() {
  const { session } = usePortalContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);

  useEffect(() => {
    Promise.all([getCourses(session.userId), getMaterials(session.userId)]).then(
      ([c, m]) => {
        setCourses(c);
        setMaterials(m);
      },
    );
  }, [session.userId]);

  return (
    <>
      <h1 className="portal-page-title">My Courses</h1>
      <p className="portal-page-subtitle">Enrolled units and course materials for this semester.</p>

      {courses.map((course) => {
        const courseMaterials = materials.filter((m) => m.courseId === course.id);
        return (
          <div key={course.id} className="portal-panel">
            <div className="portal-panel-header">
              {course.code} — {course.name}
            </div>
            <div style={{ padding: "16px 20px" }}>
              <p style={{ margin: "0 0 8px", fontSize: 14 }}>
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 14 }}>
                <strong>Semester:</strong> {course.semester} · <strong>Credit:</strong>{" "}
                {course.credit}
              </p>
              <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>Course materials</h4>
              {courseMaterials.length === 0 ? (
                <p style={{ color: "var(--mit-text-muted)", fontSize: 14 }}>No materials uploaded yet.</p>
              ) : (
                <ul className="material-list">
                  {courseMaterials.map((m) => (
                    <li key={m.id}>
                      <span>{m.title}</span>
                      <span className="material-type">{m.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
