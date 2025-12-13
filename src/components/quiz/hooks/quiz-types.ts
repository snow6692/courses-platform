import { QuizSettings } from "../QuizSettingsModal";

// Storage keys
export const getQuizStorageKey = (quizId: string) => `quiz_state_${quizId}`;
export const getQuizResultKey = (quizId: string) => `quiz_result_${quizId}`;

// Stored state interface
export interface StoredQuizState {
  quizSettings: QuizSettings;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  sectionTimers: Record<string, number>;
  expiredSections: string[];
  answers: Record<string, string | string[]>;
  startTime: number;
  timestamp: number;
}

// Quiz section type
export interface QuizSection {
  id: string;
  title: string;
  timeLimit: number | null;
  questions: QuizQuestion[];
}

// Quiz question type
export interface QuizQuestion {
  id: string;
  text: string;
  imageKey: string | null;
  answers: QuizAnswer[];
  favoriteQuestions?: { id: string }[];
}

// Quiz answer type
export interface QuizAnswer {
  id: string;
  text: string;
  imageKey: string | null;
  isCorrect: boolean;
}

// Meme type
export interface QuizMeme {
  meme: {
    id: string;
    fileKey: string;
    type: "IMAGE" | "GIF" | "VIDEO";
    trigger: string;
  };
}
