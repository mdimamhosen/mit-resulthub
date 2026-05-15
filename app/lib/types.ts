export interface StudentProfile {
  registrationNo: string;
  department: string;
  degreeAwarded: string;
  cgpa: number;
  passingYear: string;
  graduationDate: string;
  academicStatus: string;
}

export interface User extends StudentProfile {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  studentId: string;
  program: string;
  createdAt: string;
}

export interface Session extends StudentProfile {
  userId: string;
  username: string;
  fullName: string;
  studentId: string;
  program: string;
}

export interface Course {
  id: string;
  userId: string;
  code: string;
  name: string;
  credit: number;
  instructor: string;
  semester: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  userId: string;
  title: string;
  type: "pdf" | "slides" | "link" | "video";
  url: string;
}

export interface ClassSchedule {
  id: string;
  userId: string;
  courseId: string;
  courseCode: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "Lecture" | "Lab" | "Tutorial";
}

export interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
}

export interface Submission {
  id: string;
  userId: string;
  assignmentId: string;
  fileName: string;
  fileType: string;
  fileData: string;
  submittedAt: string;
}

export interface Grade {
  id: string;
  userId: string;
  semester: string;
  courseCode: string;
  courseName: string;
  credit: number;
  marks: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  priority: "high" | "normal" | "low";
  category: string;
}
