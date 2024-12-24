import { makeAutoObservable } from 'mobx';
import gradesData from '../data/grades.json';
import { Course } from './CoursesStore';
import { Assignment } from './AssignmentStore';

export interface Grade {
  id: string;
  courseId: string;
  assignmentId: string;
  studentId: string;
  score: number;
  maxScore: number;
  totalPoints: number;
  feedback?: string;
  gradedDate: Date | null;
}

export class GradesStore {
  grades: Grade[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedGrade: Grade | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadGrades();
  }

  private loadGrades() {
    // Convert gradedDate strings to Date objects or null
    this.grades = gradesData.grades.map(grade => ({
      ...grade,
      gradedDate: grade.gradedDate ? new Date(grade.gradedDate) : null
    }));
  }

  getGradesByStudent(studentId: string) {
    return this.grades.filter(grade => grade.studentId === studentId);
  }

  getGradesByCourse(courseId: string) {
    return this.grades.filter(grade => grade.courseId === courseId);
  }

  getGradeByAssignment(assignmentId: string) {
    return this.grades.find(grade => grade.assignmentId === assignmentId);
  }

  calculateCourseGPA(studentId: string) {
    const studentGrades = this.getGradesByStudent(studentId);
    
    if (studentGrades.length === 0) return 0;

    const totalWeightedScore = studentGrades.reduce((total, grade) => {
      const percentageScore = (grade.score / grade.totalPoints) * 100;
      let gradePoint;

      if (percentageScore >= 93) gradePoint = 4.0;
      else if (percentageScore >= 90) gradePoint = 3.7;
      else if (percentageScore >= 87) gradePoint = 3.3;
      else if (percentageScore >= 83) gradePoint = 3.0;
      else if (percentageScore >= 80) gradePoint = 2.7;
      else if (percentageScore >= 77) gradePoint = 2.3;
      else if (percentageScore >= 73) gradePoint = 2.0;
      else if (percentageScore >= 70) gradePoint = 1.7;
      else if (percentageScore >= 67) gradePoint = 1.3;
      else if (percentageScore >= 63) gradePoint = 1.0;
      else if (percentageScore >= 60) gradePoint = 0.7;
      else gradePoint = 0.0;

      return total + gradePoint;
    }, 0);

    return Number((totalWeightedScore / studentGrades.length).toFixed(2));
  }

  get overallPerformance() {
    const studentId = '1'; // Assuming current student
    const grades = this.getGradesByStudent(studentId);
    
    return {
      gpa: this.calculateCourseGPA(studentId),
      totalAssignments: grades.length,
      averageScore: Number((grades.reduce((sum, grade) => sum + (grade.score / grade.totalPoints * 100), 0) / grades.length).toFixed(2))
    };
  }

  // Placeholder methods to match component usage
  fetchGrades(courseId?: string) {
    this.loading = false;
  }

  setSelectedGrade(gradeId: string | null) {
    this.selectedGrade = gradeId 
      ? this.grades.find(g => g.id === gradeId) || null 
      : null;
  }

  gradeSubmission(gradeId: string, score: number, feedback?: string) {
    const grade = this.grades.find(g => g.id === gradeId);
    if (grade) {
      grade.score = score;
      grade.feedback = feedback;
      grade.gradedDate = new Date();
    }
  }

  calculateCourseAverage(courseId: string) {
    const courseGrades = this.getGradesByCourse(courseId);
    if (courseGrades.length === 0) return 0;
    return courseGrades.reduce((sum, grade) => sum + (grade.score / grade.totalPoints * 100), 0) / courseGrades.length;
  }
}

export const gradesStore = new GradesStore();
export default gradesStore;
