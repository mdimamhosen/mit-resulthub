import type { Assignment, Submission } from "./types";

export type DeadlineStatus = "submitted" | "overdue" | "due-soon" | "upcoming";

export function getDeadlineStatus(
  assignment: Assignment,
  submission: Submission | undefined,
  now = Date.now(),
): DeadlineStatus {
  if (submission) return "submitted";
  const deadline = new Date(assignment.deadline).getTime();
  if (deadline < now) return "overdue";
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  if (deadline - now <= threeDays) return "due-soon";
  return "upcoming";
}

export function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusLabel(status: DeadlineStatus): string {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "overdue":
      return "Overdue";
    case "due-soon":
      return "Due soon";
    default:
      return "Upcoming";
  }
}

export async function readFileAsBase64(file: File): Promise<{ data: string; type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1]! : result;
      resolve({ data: base64, type: file.type || "application/octet-stream" });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
