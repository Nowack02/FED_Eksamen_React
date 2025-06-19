export interface Exam {
  id: string;
  examtermin: string;
  courseName: string;
  date: string;
  numberOfQuestions: number;
  examDurationMinutes: number;
  startTime: string;
  isCompleted?: boolean;
}

export interface Student {
  id: string;
  examId: string;
  studentNo: string;
  name: string;
  questionNo?: number;
  actualExamTimeMinutes?: number;
  notes?: string;
  grade?: string;
}