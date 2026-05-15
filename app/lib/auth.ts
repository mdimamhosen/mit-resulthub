import { createUser, getUserById, getUserByUsername } from "./database";
import { defaultProfileForNewStudent } from "./studentProfile";
import type { Session, User } from "./types";
import { seedNewStudentData } from "./database";

const SESSION_KEY = "mit_portal_session";

export function getSession(): Session | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSession(user: User): Session {
  const session: Session = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    studentId: user.studentId,
    program: user.program,
    registrationNo: user.registrationNo,
    department: user.department,
    degreeAwarded: user.degreeAwarded,
    cgpa: user.cgpa,
    passingYear: user.passingYear,
    graduationDate: user.graduationDate,
    academicStatus: user.academicStatus,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function refreshSession(): Promise<Session | null> {
  const current = getSession();
  if (!current) return null;
  const user = await getUserById(current.userId);
  if (!user) return null;
  return setSession(user);
}

export async function login(
  username: string,
  password: string,
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const user = await getUserByUsername(username.trim());
  if (!user) return { ok: false, error: "Invalid username or password." };
  if (user.password !== password) return { ok: false, error: "Invalid username or password." };
  return { ok: true, session: setSession(user) };
}

export async function register(data: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  studentId: string;
  program: string;
}): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const username = data.username.trim().toLowerCase();
  if (username.length < 3) return { ok: false, error: "Username must be at least 3 characters." };
  if (data.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const existing = await getUserByUsername(username);
  if (existing) return { ok: false, error: "Username is already taken." };

  const program = data.program.trim() || "Bachelor Program";
  const user: User = {
    id: crypto.randomUUID(),
    username,
    password: data.password,
    fullName: data.fullName.trim().toUpperCase(),
    email: data.email.trim(),
    studentId: data.studentId.trim(),
    program,
    createdAt: new Date().toISOString(),
    ...defaultProfileForNewStudent(program),
  };

  await createUser(user);
  await seedNewStudentData(user.id, user.fullName);
  return { ok: true, session: setSession(user) };
}
