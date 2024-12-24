import { makeAutoObservable } from 'mobx';
import coursesData from '../data/courses.json';

export interface Note {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: Date;
  link?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  instructor: string;
  semester: string;
  description?: string;
  students: string[];
  schedule: {
    id: string;
    dayOfWeek: Date;
    startTime?: string;
    endTime?: string;
    room?: string;
  }[];
}

export class CoursesStore {
  courses: Course[] = [];
  notes: Note[] = [];
  selectedCourse: Course | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadCourses();
  }

  private loadCourses() {
    // Convert dayOfWeek strings to Date objects
    this.courses = coursesData.courses.map(course => ({
      ...course,
      schedule: course.schedule.map(session => ({
        ...session,
        dayOfWeek: new Date(session.dayOfWeek)
      }))
    }));

    // Convert createdAt strings to Date objects
    this.notes = coursesData.notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt)
    }));
  }

  selectCourse(courseId: string) {
    this.selectedCourse = this.courses.find(c => c.id === courseId) || null;
    return this.selectedCourse;
  }

  // Placeholder methods to match component usage
  fetchCourses() {
    this.loading = false;
  }

  addCourse(course: Partial<Course>) {
    const newCourse: Course = {
      id: `course${this.courses.length + 1}`,
      title: course.title || '',
      code: course.code || '',
      instructor: course.instructor || '',
      semester: course.semester || '',
      description: course.description || '',
      students: course.students || [],
      schedule: course.schedule || []
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  updateNote(note: Partial<Note>) {
    const index = this.notes.findIndex(n => n.id === note.id);
    if (index !== -1) {
      this.notes[index] = {
        ...this.notes[index],
        ...note,
        createdAt: note.createdAt || this.notes[index].createdAt
      };
    }
  }

  addNote(note: Partial<Note>) {
    const newNote: Note = {
      id: `note${this.notes.length + 1}`,
      courseId: note.courseId || '',
      title: note.title || '',
      content: note.content || '',
      createdAt: note.createdAt || new Date(),
      link: note.link
    };
    this.notes.push(newNote);
    return newNote;
  }

  deleteNote(noteId: string) {
    const index = this.notes.findIndex(n => n.id === noteId);
    if (index !== -1) {
      this.notes.splice(index, 1);
    }
  }
}

export const coursesStore = new CoursesStore();
export default coursesStore;
