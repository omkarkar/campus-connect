import { makeAutoObservable } from 'mobx';
import assignmentsData from '../data/assignments.json';
import { Course } from './CoursesStore';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  totalPoints: number;
  type: 'homework' | 'project' | 'quiz' | 'exam';
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded';
  studentSubmission?: {
    submissionDate: Date;
    submissionLink?: string;
    score?: number;
    feedback?: string;
  };
}

export class AssignmentStore {
  assignments: Assignment[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedAssignment: Assignment | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadAssignments();
  }

  private loadAssignments() {
    // Explicitly type and convert assignments
    this.assignments = assignmentsData.assignments.map(assignment => {
      const convertedAssignment: Assignment = {
        id: assignment.id,
        courseId: assignment.courseId,
        title: assignment.title,
        description: assignment.description,
        dueDate: new Date(assignment.dueDate),
        maxScore: assignment.maxScore,
        totalPoints: assignment.totalPoints,
        type: assignment.type as Assignment['type'],
        status: assignment.status as Assignment['status'],
        studentSubmission: assignment.studentSubmission ? {
          submissionDate: assignment.studentSubmission.submissionDate 
            ? new Date(assignment.studentSubmission.submissionDate) 
            : new Date(),
          submissionLink: assignment.studentSubmission.submissionLink,
          score: assignment.studentSubmission.score,
          feedback: assignment.studentSubmission.feedback
        } : undefined
      };
      return convertedAssignment;
    });
  }

  getAssignmentsByCourse(courseId: string) {
    return this.assignments.filter(assignment => assignment.courseId === courseId);
  }

  getAssignmentById(id: string) {
    return this.assignments.find(assignment => assignment.id === id);
  }

  updateAssignmentStatus(id: string, status: Assignment['status']) {
    const assignment = this.getAssignmentById(id);
    if (assignment) {
      assignment.status = status;
    }
  }

  submitAssignment(id: string, studentId: string, fileUrls: string[], comment?: string) {
    const assignment = this.getAssignmentById(id);
    if (assignment) {
      assignment.studentSubmission = {
        submissionDate: new Date(),
        submissionLink: fileUrls.join(','),
        feedback: comment
      };
      assignment.status = 'submitted';
    }
  }

  get upcomingAssignments() {
    const now = new Date();
    return this.assignments
      .filter(assignment => 
        assignment.status !== 'submitted' && 
        assignment.status !== 'graded' && 
        assignment.dueDate > now
      )
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  // Placeholder methods to match component usage
  fetchAssignments() {
    this.loading = false;
  }

  addAssignment(assignment: Partial<Assignment>) {
    const newAssignment: Assignment = {
      id: `assign${this.assignments.length + 1}`,
      courseId: assignment.courseId || '',
      title: assignment.title || '',
      description: assignment.description || '',
      dueDate: assignment.dueDate 
        ? (typeof assignment.dueDate === 'string' 
          ? new Date(assignment.dueDate) 
          : assignment.dueDate)
        : new Date(),
      maxScore: assignment.maxScore || 100,
      totalPoints: assignment.totalPoints || 100,
      type: assignment.type || 'homework',
      status: 'not_started'
    };
    this.assignments.push(newAssignment);
    return newAssignment;
  }

  deleteAssignment(assignmentId: string) {
    const index = this.assignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      this.assignments.splice(index, 1);
    }
  }

  getAssignmentStatus(assignmentId: string, studentId: string) {
    const assignment = this.getAssignmentById(assignmentId);
    if (!assignment) return null;

    const now = new Date();
    const dueDate = assignment.dueDate;
    const submission = assignment.studentSubmission;

    if (submission) {
      return {
        status: 'submitted',
        submittedAt: submission.submissionDate,
        score: submission.score,
        feedback: submission.feedback
      };
    }

    if (now > dueDate) {
      return {
        status: 'overdue',
        dueDate: assignment.dueDate
      };
    }

    return {
      status: 'pending',
      dueDate: assignment.dueDate
    };
  }
}

export const assignmentStore = new AssignmentStore();
export default assignmentStore;
