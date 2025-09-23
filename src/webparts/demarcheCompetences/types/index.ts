export interface QuizQuestion {
  Id: number;
  Title: string;
  Question: string;
  OptionA: string;
  OptionB: string;
  OptionC: string;
  CorrectAnswer: 'A' | 'B' | 'C';
  Category: 'Definition' | 'Responsabilite' | 'Competences' | 'Etapes';
  Points: number;
  QuizType: 'Introduction' | 'Sondage';
}

export interface QuizResult {
  Id: number;
  Title: string;
  UserId: number;
  UserEmail: string;
  QuizType: 'Introduction' | 'Sondage';
  Score?: number;
  TotalQuestions: number;
  Responses: string;
  CompletedDate: Date;
  Duration: number;
}

export interface SondageResponse {
  Id: number;
  Title: string;
  UserId: number;
  UserEmail: string;
  Q1_Connaissance: string;
  Q2_Definition: string;
  Q3_Benefices: string;
  Q4_Attentes: string;
  Q5_Inquietudes: string;
  Q6_Informations: string;
  SubmittedDate: Date;
}

export interface QuizAnswer {
  questionId: number;
  answer: 'A' | 'B' | 'C';
  isCorrect?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  score: number;
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface SondageAnswer {
  questionId: number;
  answer: string | string[];
}

export interface SondageState {
  answers: SondageAnswer[];
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface AppState {
  currentPage: 'landing' | 'quiz' | 'sondage' | 'dashboard' | 'results';
  user: {
    id: number;
    email: string;
    displayName: string;
  };
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_PAGE'; payload: AppState['currentPage'] }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export type QuizAction =
  | { type: 'START_QUIZ' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'ANSWER_QUESTION'; payload: QuizAnswer }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESET_QUIZ' };

export type SondageAction =
  | { type: 'START_SONDAGE' }
  | { type: 'ANSWER_QUESTION'; payload: SondageAnswer }
  | { type: 'COMPLETE_SONDAGE' }
  | { type: 'RESET_SONDAGE' };

export interface NavigationProps {
  currentPage: AppState['currentPage'];
  onNavigate: (page: AppState['currentPage']) => void;
}

export interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  onBack: () => void;
}

export interface DashboardData {
  totalParticipants: number;
  averageScore: number;
  completionRate: number;
  categoryScores: Record<string, number>;
  recentResults: QuizResult[];
}