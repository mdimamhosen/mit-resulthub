import { useEffect, useState } from "react";
import { getNotices } from "../lib/database";
import type { Notice } from "../lib/types";

export function meta() {
  return [{ title: "Notices | MIT Student Portal" }];
}

export default function PortalNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    getNotices().then((n) =>
      setNotices(n.sort((a, b) => +new Date(b.date) - +new Date(a.date))),
    );
  }, []);

  return (
    <>
      <h1 className="portal-page-title">Notices &amp; Announcements</h1>
      <p className="portal-page-subtitle">Official updates from Melbourne Institute of Technology.</p>

      <div className="portal-panel">
        {notices.length === 0 ? (
          <p style={{ padding: 24, margin: 0, color: "var(--mit-text-muted)" }}>No notices at this time.</p>
        ) : (
          notices.map((n) => (
            <article
              key={n.id}
              className={`notice-item${n.priority === "high" ? " notice-priority-high" : ""}`}
            >
              <h4>{n.title}</h4>
              <p className="notice-meta">
                {n.category} · {new Date(n.date).toLocaleDateString("en-AU", { dateStyle: "full" })}
                {n.priority === "high" && " · Important"}
              </p>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{n.body}</p>
            </article>
          ))
        )}
      </div>
    </>
  );
}
