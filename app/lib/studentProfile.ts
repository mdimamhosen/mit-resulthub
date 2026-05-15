import type { StudentProfile } from "./types";

export const MAHEDI_STUDENT_PROFILE: StudentProfile = {
  registrationNo: "UU27011",
  department: "Software Engineering (Fast Track)",
  degreeAwarded: "Bachelor of Software Engineering (Honours)",
  cgpa: 3.64,
  passingYear: "2026",
  graduationDate: "January 3, 2026",
  academicStatus: "Passed",
};

export const MAHEDI_STUDENT = {
  username: "mahedione",
  password: "Sakiya2020",
  fullName: "MAHEDI HASSAN SARKER",
  email: "mahedi.hassan@student.mit.edu.au",
  studentId: "10322209",
  program: "Bachelor of Software Engineering (Honours)",
  ...MAHEDI_STUDENT_PROFILE,
};

export function defaultProfileForNewStudent(program: string): StudentProfile {
  return {
    registrationNo: "—",
    department: program || "General Studies",
    degreeAwarded: program || "Bachelor Program",
    cgpa: 0,
    passingYear: "—",
    graduationDate: "—",
    academicStatus: "Enrolled",
  };
}
