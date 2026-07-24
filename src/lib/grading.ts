// Grading for the exam simulation, modeled on Teil 1 of the German IHK
// "gestreckte Abschlussprüfung": a written knowledge test scored on a
// 100-point scale, with 50 points being the pass threshold ("ausreichend").
// This is our simulation format, not a byte-for-byte copy of the real
// exam (Teil 2 is project-based and can't be simulated as a quiz).

export const PASS_THRESHOLD = 50;

export interface GradeResult {
  points: number; // 0-100
  grade: number; // 1 (best) - 6 (worst), the German school-grade scale
  gradeLabel: string;
  passed: boolean;
}

const GRADE_BANDS: { min: number; grade: number; label: string }[] = [
  { min: 92, grade: 1, label: "Sehr gut" },
  { min: 81, grade: 2, label: "Gut" },
  { min: 67, grade: 3, label: "Befriedigend" },
  { min: 50, grade: 4, label: "Ausreichend" },
  { min: 30, grade: 5, label: "Mangelhaft" },
  { min: 0, grade: 6, label: "Ungenügend" },
];

/** Maps a raw correct/total score onto the 100-point IHK scale and grade. */
export function gradeExam(correct: number, total: number): GradeResult {
  const points = total > 0 ? Math.round((correct / total) * 100) : 0;
  const band = GRADE_BANDS.find((b) => points >= b.min) ?? GRADE_BANDS[GRADE_BANDS.length - 1];
  return {
    points,
    grade: band.grade,
    gradeLabel: band.label,
    passed: points >= PASS_THRESHOLD,
  };
}
