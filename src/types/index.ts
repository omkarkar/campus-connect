// Common interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
  profilePicture?: string;
}

export interface Course {
  id: string;
  name: string;
  professorId: string;
  schedule: Schedule[];
  students: string[];
}

export interface Schedule {
  id: string;
  courseId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Note {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string;
  duration: number;
  totalMarks: number;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  examId: string;
  marks: number;
  feedback?: string;
}

export interface Attendance {
  id: string;
  courseId: string;
  date: string;
  presentStudents: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'assignment' | 'exam' | 'general';
  createdAt: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  chatRoomId: string;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  type: 'course' | 'assignment' | 'direct';
  participants: string[];
  name: string;
}
