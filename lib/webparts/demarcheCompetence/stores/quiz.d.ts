import { Module } from 'vuex';
import type { QuizQuestion, QuizResponse } from '../types/index';
import { QuizResult } from './types';
import { QuizService } from '@services/QuizService';
export interface QuizState {
    loading: boolean;
    error: string | null;
    introductionQuestions: QuizQuestion[];
    sondageQuestions: QuizQuestion[];
    currentQuizType: 'Introduction' | 'Sondage' | null;
    currentQuestionIndex: number;
    quizStartTime: Date | null;
    quizInProgress: boolean;
    currentResponses: QuizResponse[];
    userResults: QuizResult[];
    quizStatistics: {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageTimeToComplete: number;
    };
    quizSettings: {
        timeLimit: number;
        allowReview: boolean;
        randomizeQuestions: boolean;
        randomizeAnswers: boolean;
        showResultsImmediately: boolean;
        requireAllAnswers: boolean;
    };
    autoSaveEnabled: boolean;
    lastAutoSave: Date | null;
    quizService: QuizService | null;
}
export declare const quizModule: Module<QuizState, any>;
//# sourceMappingURL=quiz.d.ts.map