import type { Grade } from "./types";

export function calculateGpa(grades: Grade[]): { gpa: number; totalCredits: number } {
  if (grades.length === 0) return { gpa: 0, totalCredits: 0 };

  let points = 0;
  let credits = 0;
  for (const g of grades) {
    points += g.gradePoint * g.credit;
    credits += g.credit;
  }
  return {
    gpa: credits > 0 ? Math.round((points / credits) * 100) / 100 : 0,
    totalCredits: credits,
  };
}

export function groupGradesBySemester(grades: Grade[]): Record<string, Grade[]> {
  return grades.reduce<Record<string, Grade[]>>((acc, g) => {
    if (!acc[g.semester]) acc[g.semester] = [];
    acc[g.semester].push(g);
    return acc;
  }, {});
}

export function semesterGpa(grades: Grade[]): number {
  return calculateGpa(grades).gpa;
}
