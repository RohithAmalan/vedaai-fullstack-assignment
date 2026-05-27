export type QuestionType = 'MCQ' | 'Short Answer' | 'Long Answer';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  label: string;
  text: string;
}

export interface Question {
  questionNumber: number;
  questionText: string;
  difficulty: Difficulty;
  marks: number;
  type: QuestionType;
  options?: string[];
}

export interface Section {
  sectionLabel: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface StudentInfo {
  name: string;
  rollNumber: string;
  section: string;
}

export interface PaperMetadata {
  totalQuestions: number;
  totalMarks: number;
  estimatedTime: number;
  subject: string;
}

export interface GeneratedPaper {
  studentInfo: StudentInfo;
  sections: Section[];
  metadata: PaperMetadata;
}

export interface AssignmentConfig {
  title: string;
  subject: string;
  dueDate: string;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  marksPerQuestion: number;
  additionalInstructions?: string;
  classLevel?: string;
  fileId?: string;
}

export type JobStatus = 'waiting' | 'active' | 'completed' | 'failed';

export interface JobPayload {
  assignmentId: string;
  config: AssignmentConfig;
  fileText?: string;
}
