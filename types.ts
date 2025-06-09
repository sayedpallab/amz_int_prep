
export interface STARL {
  situation: string;
  task: string;
  action: string;
  result: string;
  learning: string;
}

export enum QuestionType {
  LEADERSHIP_PRINCIPLE = "Leadership Principle",
  FREESTYLE = "Freestyle",
}

export enum View {
  ALL_QUESTIONS = "All Questions",
  FLASHCARDS = "Flashcards",
  PROGRESS = "Progress",
  INTERVIEW_MODE = "Interview Mode", // New View
}

export type ConfidenceLevel = 'low' | 'medium' | 'high' | null;

export interface QuestionAnswerItem {
  id: string;
  question: string;
  answerSTARL?: STARL;
  answerFreestyle?: string;
  type: QuestionType;
  principleOrCategory: string; // e.g., "Customer Obsession" or "General Behavioural"
  mastered: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  flaggedForInterview?: boolean; // New field
  confidenceLevel?: ConfidenceLevel; // New field
  tags?: string[]; // Optional: for future custom tagging
}

export type Theme = 'light' | 'dark';

export interface AiSuggestion {
  originalQuestion: string;
  originalAnswer?: STARL | string;
  suggestedText: string;
}

export interface PanelSimulationRecord {
  id: string;
  completedAt: string; // ISO date string
  questions: { id: string; question: string; type: QuestionType; principleOrCategory: string }[];
  durationMinutes: number;
}