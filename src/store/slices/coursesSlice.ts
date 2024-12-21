import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, Schedule, Attendance, Note, Exam } from '../../types';

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  notes: Note[];
  exams: Exam[];
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  notes: [],
  exams: [],
  attendance: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    // Course actions
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course>) => {
      state.currentCourse = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
      if (state.currentCourse?.id === action.payload) {
        state.currentCourse = null;
      }
    },

    // Notes actions
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },

    // Exam actions
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
    },
    addExam: (state, action: PayloadAction<Exam>) => {
      state.exams.push(action.payload);
    },
    updateExam: (state, action: PayloadAction<Exam>) => {
      const index = state.exams.findIndex(exam => exam.id === action.payload.id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    deleteExam: (state, action: PayloadAction<string>) => {
      state.exams = state.exams.filter(exam => exam.id !== action.payload);
    },

    // Attendance actions
    setAttendance: (state, action: PayloadAction<Attendance[]>) => {
      state.attendance = action.payload;
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendance.push(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<Attendance>) => {
      const index = state.attendance.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.attendance[index] = action.payload;
      }
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCourses,
  setCurrentCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setExams,
  addExam,
  updateExam,
  deleteExam,
  setAttendance,
  addAttendance,
  updateAttendance,
  setLoading,
  setError,
} = coursesSlice.actions;

export default coursesSlice.reducer;
