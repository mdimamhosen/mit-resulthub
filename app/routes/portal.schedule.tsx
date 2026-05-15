import { useEffect, useState } from "react";
import { getSchedules } from "../lib/database";
import { usePortalContext } from "../hooks/usePortalContext";
import type { ClassSchedule } from "../lib/types";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function meta() {
  return [{ title: "Class Routine | MIT Student Portal" }];
}

export default function PortalSchedule() {
  const { session } = usePortalContext();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);

  useEffect(() => {
    getSchedules(session.userId).then(setSchedules);
  }, [session.userId]);

  const byDay = DAYS.map((day) => ({
    day,
    items: schedules
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((d) => d.items.length > 0);

  return (
    <>
      <h1 className="portal-page-title">Class Routine</h1>
      <p className="portal-page-subtitle">Weekly lecture, lab, and tutorial schedule.</p>

      <div className="routine-grid">
        {byDay.map(({ day, items }) => (
          <div key={day} className="routine-day-card">
            <h4>{day}</h4>
            {items.map((s) => (
              <div key={s.id} className="routine-item">
                <strong>
                  {s.startTime} – {s.endTime}
                </strong>
                <br />
                {s.courseCode} ({s.type})
                <br />
                Room: {s.room}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
