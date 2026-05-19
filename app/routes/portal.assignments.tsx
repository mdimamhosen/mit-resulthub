import { useEffect, useState, type FormEvent } from "react";
import { addSubmission, getAssignments, getSubmissions } from "../lib/database";
import {
  formatDeadline,
  getDeadlineStatus,
  readFileAsBase64,
  statusLabel,
} from "../lib/assignments";
import { usePortalContext } from "../hooks/usePortalContext";
import type { Assignment, Submission } from "../lib/types";

export function meta() {
  return [{ title: "Assignments | MIT Student Portal" }];
}

export default function PortalAssignments() {
  const { session } = usePortalContext();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [uploadFor, setUploadFor] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    Promise.all([
      getAssignments(session.userId),
      getSubmissions(session.userId),
    ]).then(([a, s]) => {
      // Force all assignment deadlines into December 2025
      const updatedAssignments = a.map((assignment, index) => ({
        ...assignment,
        deadline: new Date(
          2025,
          11, // December
          Math.min(5 + index * 5, 30),
          23,
          59,
          0,
        ).toISOString(),
      }));

      setAssignments(
        updatedAssignments.sort(
          (x, y) => +new Date(x.deadline) - +new Date(y.deadline),
        ),
      );

      setSubmissions(s);
    });
  };

  useEffect(() => {
    load();
  }, [session.userId]);

  const submissionMap = new Map(submissions.map((s) => [s.assignmentId, s]));

  const handleSubmit = async (e: FormEvent, assignmentId: string) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      const { data, type } = await readFileAsBase64(file);

      const submission: Submission = {
        id: crypto.randomUUID(),
        userId: session.userId,
        assignmentId,
        fileName: file.name,
        fileType: type,
        fileData: data,
        submittedAt: new Date().toISOString(),
      };

      await addSubmission(submission);

      setMessage(`Submitted "${file.name}" successfully.`);
      setFile(null);
      setUploadFor(null);

      load();
    } catch {
      setError("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <h1 className="portal-page-title">Assignments</h1>

      <p className="portal-page-subtitle">
        Upload coursework and track submission deadlines.
      </p>

      {error && <div className="auth-error">{error}</div>}

      {message && <div className="auth-success">{message}</div>}

      <div className="portal-panel">
        <div className="portal-panel-header">All assignments</div>

        <table className="portal-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Title</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Submission</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((a) => {
              const sub = submissionMap.get(a.id);
              const status = getDeadlineStatus(a, sub);

              return (
                <tr key={a.id}>
                  <td>{a.courseCode}</td>

                  <td>
                    <strong>{a.title}</strong>

                    <br />

                    <small
                      style={{
                        color: "var(--mit-text-muted)",
                      }}
                    >
                      {a.description.slice(0, 60)}…
                    </small>
                  </td>

                  <td>{formatDeadline(a.deadline)}</td>

                  <td>
                    <span className={`badge badge-${status}`}>
                      {statusLabel(status)}
                    </span>
                  </td>

                  <td>
                    {sub ? (
                      <>
                        {sub.fileName}

                        <br />

                        <small>
                          {new Date(sub.submittedAt).toLocaleString("en-AU")}
                        </small>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {!sub && (
                      <button
                        type="button"
                        className="btn-mit-outline"
                        onClick={() => {
                          setUploadFor(uploadFor === a.id ? null : a.id);
                          setFile(null);
                        }}
                      >
                        {uploadFor === a.id ? "Cancel" : "Upload"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {uploadFor && (
        <div className="portal-panel">
          <div className="portal-panel-header">Submit assignment</div>

          <form
            style={{ padding: 24 }}
            onSubmit={(e) => handleSubmit(e, uploadFor)}
          >
            <div className="form-row">
              <label htmlFor="assignment-file">
                Select file (PDF, DOC, ZIP)
              </label>

              <input
                id="assignment-file"
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
            </div>

            <button type="submit" className="btn-mit">
              Submit assignment
            </button>
          </form>
        </div>
      )}
    </>
  );
}
