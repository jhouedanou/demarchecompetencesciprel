export interface User {
    id: string;
    displayName: string;
    email: string;
    [key: string]: any;
}
export interface UserProgress {
    competenceId: string;
    progressPercentage: number;
    [key: string]: any;
}
export interface QuizResult {
    id: string;
    quizType: 'Introduction' | 'Sondage';
    completedAt: Date;
    score: number;
    [key: string]: any;
}
export * from '../types/index';
//# sourceMappingURL=types.d.ts.map