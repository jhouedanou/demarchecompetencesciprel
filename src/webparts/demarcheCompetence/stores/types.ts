// Simple types for Vuex stores compatibility

// User interface for stores
export interface User {
  id: string;
  displayName: string;
  email: string;
  [key: string]: any; // Allow additional properties
}

// UserProgress interface for stores  
export interface UserProgress {
  competenceId: string;
  progressPercentage: number;
  [key: string]: any; // Allow additional properties
}

// QuizResult interface for stores
export interface QuizResult {
  id: string;
  quizType: 'Introduction' | 'Sondage';
  completedAt: Date;
  score: number;
  [key: string]: any; // Allow additional properties
}

// Re-export existing types
export * from '../types/index';
