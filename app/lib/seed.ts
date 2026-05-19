import {
  bulkSeed,
  countUsers,
  createUser,
  getNotices,
  getUserByUsername,
  replaceGradesForUser,
  updateUser,
} from "./database";
import { MAHEDI_STUDENT } from "./studentProfile";
import type {
  Assignment,
  ClassSchedule,
  Course,
  CourseMaterial,
  Grade,
  Notice,
  User,
} from "./types";

const SEED_FLAG = "mit_portal_seeded_v4";
const PROFILE_SYNC_KEY = "mit_profile_sync_v4";

export const DEMO_USER = MAHEDI_STUDENT;

function uid() {
  return crypto.randomUUID();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function daysAgo(days: number): string {
  return daysFromNow(-days);
}

export function buildSoftwareEngineeringGrades(userId: string): Grade[] {
  return [
    {
      id: uid(),
      userId,
      semester: "Semester 2, 2026",
      courseCode: "MIT401",
      courseName: "Software Engineering Capstone",
      credit: 4,
      marks: 92,
      maxMarks: 100,
      grade: "HD",
      gradePoint: 4,
    },
    {
      id: uid(),
      userId,
      semester: "Semester 2, 2026",
      courseCode: "MIT402",
      courseName: "Advanced Software Design",
      credit: 4,
      marks: 86,
      maxMarks: 100,
      grade: "D",
      gradePoint: 3.5,
    },
    {
      id: uid(),
      userId,
      semester: "Semester 1, 2026",
      courseCode: "MIT301",
      courseName: "Full Stack Development",
      credit: 4,
      marks: 84,
      maxMarks: 100,
      grade: "D",
      gradePoint: 3.5,
    },
    {
      id: uid(),
      userId,
      semester: "Semester 1, 2026",
      courseCode: "MIT302",
      courseName: "Cloud & Distributed Systems",
      credit: 3,
      marks: 80,
      maxMarks: 100,
      grade: "C",
      gradePoint: 3,
    },
    {
      id: uid(),
      userId,
      semester: "Semester 2, 2024",
      courseCode: "MIT201",
      courseName: "Object-Oriented Programming",
      credit: 4,
      marks: 88,
      maxMarks: 100,
      grade: "D",
      gradePoint: 3.5,
    },
  ];
}

export function buildStudentSeed(userId: string, _fullName: string) {
  const c1 = uid();
  const c2 = uid();
  const c3 = uid();
  const c4 = uid();

  const courses: Course[] = [
    {
      id: c1,
      userId,
      code: "MIT301",
      name: "Advanced Software Engineering",
      credit: 4,
      instructor: "Dr. Sarah Chen",
      semester: "Semester 1, 2026",
    },
    {
      id: c2,
      userId,
      code: "MIT302",
      name: "Cloud Computing & DevOps",
      credit: 4,
      instructor: "Prof. James Wong",
      semester: "Semester 1, 2026",
    },
    {
      id: c3,
      userId,
      code: "MIT303",
      name: "Cybersecurity Fundamentals",
      credit: 3,
      instructor: "Dr. Emily Park",
      semester: "Semester 1, 2026",
    },
    {
      id: c4,
      userId,
      code: "MIT210",
      name: "Database Management Systems",
      credit: 3,
      instructor: "Mr. David Liu",
      semester: "Semester 1, 2026",
    },
  ];

  const materials: CourseMaterial[] = [
    { id: uid(), courseId: c1, userId, title: "Week 1 - Lecture Slides", type: "slides", url: "#" },
    { id: uid(), courseId: c1, userId, title: "Assignment Brief PDF", type: "pdf", url: "#" },
    { id: uid(), courseId: c2, userId, title: "Docker & Kubernetes Guide", type: "pdf", url: "#" },
    { id: uid(), courseId: c2, userId, title: "AWS Lab Recording", type: "video", url: "#" },
    { id: uid(), courseId: c3, userId, title: "OWASP Top 10 Reference", type: "link", url: "#" },
    { id: uid(), courseId: c4, userId, title: "SQL Practice Workbook", type: "pdf", url: "#" },
  ];

  const schedules: ClassSchedule[] = [
    { id: uid(), userId, courseId: c1, courseCode: "MIT301", day: "Monday", startTime: "09:00", endTime: "11:00", room: "LT-201", type: "Lecture" },
    { id: uid(), userId, courseId: c1, courseCode: "MIT301", day: "Wednesday", startTime: "14:00", endTime: "16:00", room: "Lab-3B", type: "Lab" },
    { id: uid(), userId, courseId: c2, courseCode: "MIT302", day: "Tuesday", startTime: "10:00", endTime: "12:00", room: "LT-105", type: "Lecture" },
    { id: uid(), userId, courseId: c2, courseCode: "MIT302", day: "Thursday", startTime: "13:00", endTime: "15:00", room: "Lab-2A", type: "Lab" },
    { id: uid(), userId, courseId: c3, courseCode: "MIT303", day: "Monday", startTime: "13:00", endTime: "15:00", room: "LT-302", type: "Lecture" },
    { id: uid(), userId, courseId: c3, courseCode: "MIT303", day: "Friday", startTime: "09:00", endTime: "10:00", room: "LT-302", type: "Tutorial" },
    { id: uid(), userId, courseId: c4, courseCode: "MIT210", day: "Tuesday", startTime: "14:00", endTime: "16:00", room: "LT-108", type: "Lecture" },
    { id: uid(), userId, courseId: c4, courseCode: "MIT210", day: "Thursday", startTime: "09:00", endTime: "11:00", room: "Lab-1C", type: "Lab" },
  ];

  const assignments: Assignment[] = [
    {
      id: uid(),
      userId,
      courseId: c1,
      courseCode: "MIT301",
      title: "Software Architecture Report",
      description: "Submit a 2500-word report on microservices architecture patterns.",
      deadline: "2025-12-05T23:59:59.000Z",
      maxMarks: 30,
    },
    {
      id: uid(),
      userId,
      courseId: c2,
      courseCode: "MIT302",
      title: "Docker Deployment Project",
      description: "Containerise a sample app and deploy using Docker Compose.",
      deadline: "2025-12-12T23:59:59.000Z",
      maxMarks: 25,
    },
    {
      id: uid(),
      userId,
      courseId: c3,
      courseCode: "MIT303",
      title: "Security Audit Lab",
      description: "Complete penetration testing lab worksheet and findings summary.",
      deadline: "2025-12-20T23:59:59.000Z",
      maxMarks: 20,
    },
    {
      id: uid(),
      userId,
      courseId: c4,
      courseCode: "MIT210",
      title: "Database Design Assignment",
      description: "ER diagram, normalisation, and SQL implementation.",
      deadline: "2025-12-15T23:59:59.000Z",
      maxMarks: 35,
    },
  ];

  const grades: Grade[] = buildSoftwareEngineeringGrades(userId);

  return { courses, materials, schedules, assignments, grades };
}

const GLOBAL_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "Semester 1, 2026 Orientation Week",
    body: "All new and returning students must attend orientation sessions from 24–28 February. Check your timetable in the student portal.",
    date: daysAgo(3),
    priority: "high",
    category: "Academic",
  },
  {
    id: "notice-2",
    title: "Library Extended Hours During Exam Period",
    body: "Melbourne campus library will remain open until 11 PM, Monday through Friday, from 10 March to 28 March.",
    date: daysAgo(7),
    priority: "normal",
    category: "Campus",
  },
  {
    id: "notice-3",
    title: "FEE-HELP Census Date Reminder",
    body: "The census date for Semester 1, 2026 is 31 March. Review your enrolment before this date to avoid financial penalties.",
    date: daysAgo(14),
    priority: "high",
    category: "Finance",
  },
  {
    id: "notice-4",
    title: "Careers Fair 2026 – Register Now",
    body: "Meet employers from IT, engineering, and business sectors on 15 April at the Melbourne campus. Registration via AMS.",
    date: daysAgo(1),
    priority: "normal",
    category: "Careers",
  },
];

export async function initializeDatabase(): Promise<void> {
  if (typeof indexedDB === "undefined") return;

  const count = await countUsers();
  if (localStorage.getItem(SEED_FLAG) === "true" && count > 0) return;

  const demoId = uid();
  const demoUser: User = {
    id: demoId,
    username: DEMO_USER.username.toLowerCase(),
    password: DEMO_USER.password,
    fullName: DEMO_USER.fullName,
    email: DEMO_USER.email,
    studentId: DEMO_USER.studentId,
    program: DEMO_USER.program,
    registrationNo: DEMO_USER.registrationNo,
    department: DEMO_USER.department,
    degreeAwarded: DEMO_USER.degreeAwarded,
    cgpa: DEMO_USER.cgpa,
    passingYear: DEMO_USER.passingYear,
    graduationDate: DEMO_USER.graduationDate,
    academicStatus: DEMO_USER.academicStatus,
    createdAt: new Date().toISOString(),
  };

  const existing = await countUsers();
  if (existing === 0) {
    await createUser(demoUser);
    const seed = buildStudentSeed(demoId, demoUser.fullName);
    await bulkSeed({ ...seed, notices: GLOBAL_NOTICES });
  } else {
    // If upgrading to v4, recreate the assignments for the demo user
    const db = await import("./database").then((m) => m.getDb());
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("assignments", "readwrite");
      tx.objectStore("assignments").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    
    const user = await getUserByUsername(demoUser.username);
    if (user) {
      const seed = buildStudentSeed(user.id, user.fullName);
      await bulkSeed({ assignments: seed.assignments });
    }

    if ((await getNotices()).length === 0) {
      await bulkSeed({ notices: GLOBAL_NOTICES });
    }
  }

  localStorage.setItem(SEED_FLAG, "true");
  await syncMahediStudentProfile();
}

export async function syncMahediStudentProfile(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  if (localStorage.getItem(PROFILE_SYNC_KEY) === "true") return;

  const user = await getUserByUsername(DEMO_USER.username);
  if (!user) return;

  await updateUser({
    ...user,
    fullName: DEMO_USER.fullName,
    studentId: DEMO_USER.studentId,
    program: DEMO_USER.program,
    email: DEMO_USER.email,
    registrationNo: DEMO_USER.registrationNo,
    department: DEMO_USER.department,
    degreeAwarded: DEMO_USER.degreeAwarded,
    cgpa: DEMO_USER.cgpa,
    passingYear: DEMO_USER.passingYear,
    graduationDate: DEMO_USER.graduationDate,
    academicStatus: DEMO_USER.academicStatus,
  });

  await replaceGradesForUser(user.id, buildSoftwareEngineeringGrades(user.id));
  localStorage.setItem(PROFILE_SYNC_KEY, "true");
}
