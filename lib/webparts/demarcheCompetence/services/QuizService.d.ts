import { SharePointService } from './SharePointService';
import type { QuizQuestion, QuizResponse, QuizResult } from '@types/index';
export declare class QuizService {
    private sharePointService;
    constructor(sharePointService: SharePointService);
    /**
     * Load and transform introduction quiz questions
     */
    loadIntroductionQuestions(): Promise<QuizQuestion[]>;
    /**
     * Load and transform survey questions
     */
    loadSurveyQuestions(): Promise<QuizQuestion[]>;
    /**
     * Alias FR: Charger les questions du sondage (compatibilité avec le store)
     */
    loadSondageQuestions(): Promise<QuizQuestion[]>;
    /**
     * Save quiz result
     */
    saveQuizResult(result: QuizResult): Promise<void>;
    /**
     * Load user's quiz results
     */
    loadUserResults(userId?: string): Promise<QuizResult[]>;
    /**
     * Save quiz progress (for auto-save functionality)
     */
    saveProgress(progressData: {
        userId: string;
        quizType: string;
        responses: QuizResponse[];
        currentQuestion: number;
        startTime: Date;
        status: string;
    }): Promise<void>;
    /**
     * Load saved progress
     */
    loadProgress(userId: string, quizType: string): Promise<{
        responses: QuizResponse[];
        currentQuestion: number;
        startTime: Date;
        status: string;
    } | null>;
    /**
     * Clear saved progress
     */
    clearProgress(userId: string, quizType: string): Promise<void>;
    /**
     * Get quiz statistics
     */
    getQuizStatistics(quizType?: string): Promise<{
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    }>;
    /**
     * Export quiz results
     */
    exportResults(quizType?: string, format?: 'csv' | 'json'): Promise<void>;
    /**
     * Validate quiz responses
     */
    validateResponses(questions: QuizQuestion[], responses: QuizResponse[]): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Calculate quiz score
     */
    calculateScore(questions: QuizQuestion[], responses: QuizResponse[]): {
        score: number;
        totalPossible: number;
        correctAnswers: number;
        percentage: number;
    };
    /**
     * Transform SharePoint items to QuizQuestion format
     */
    private transformIntroductionItem;
    private transformSurveyItem;
    private transformResultItem;
    private mapQuestionType;
    private getTotalQuestions;
    private getCorrectAnswers;
    private calculateAverageScore;
    private calculateAverageCompletionTime;
    private calculateCategoryBreakdown;
    private exportToCSV;
    private exportToJSON;
}
//# sourceMappingURL=QuizService.d.ts.map