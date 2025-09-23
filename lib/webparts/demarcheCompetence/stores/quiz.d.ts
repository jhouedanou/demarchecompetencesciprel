import type { QuizQuestion, QuizResponse, QuizResult } from '@types/index';
import { QuizService } from '@services/QuizService';
export declare const useQuizStore: import("pinia").StoreDefinition<"quiz", Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    introductionQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    sondageQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    currentQuizType: import("vue").Ref<"Introduction" | "Sondage" | null, "Introduction" | "Sondage" | null>;
    currentQuestionIndex: import("vue").Ref<number, number>;
    quizStartTime: import("vue").Ref<Date | null, Date | null>;
    quizInProgress: import("vue").Ref<boolean, boolean>;
    currentResponses: import("vue").Ref<{
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[], QuizResponse[] | {
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[]>;
    userResults: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[], QuizResult[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[]>;
    quizStatistics: import("vue").Ref<{
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null, {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null>;
    hasIntroductionQuestions: import("vue").ComputedRef<boolean>;
    hasSondageQuestions: import("vue").ComputedRef<boolean>;
    currentQuestion: import("vue").ComputedRef<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    } | null>;
    totalQuestions: import("vue").ComputedRef<number>;
    quizProgress: import("vue").ComputedRef<number>;
    hasCompletedIntroduction: import("vue").ComputedRef<boolean>;
    hasCompletedSondage: import("vue").ComputedRef<boolean>;
    latestIntroductionResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    latestSondageResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    setQuizService: (service: QuizService) => void;
    loadIntroductionQuestions: () => Promise<void>;
    loadSondageQuestions: () => Promise<void>;
    loadUserResults: (userId?: string | undefined) => Promise<void>;
    startQuiz: (quizType: 'Introduction' | 'Sondage') => Promise<void>;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    addResponse: (response: QuizResponse) => void;
    updateResponse: (questionId: string, answer: string | number) => void;
    getResponse: (questionId: string) => QuizResponse | undefined;
    saveProgress: (progressData: any) => Promise<void>;
    saveQuizResult: (result: QuizResult) => Promise<void>;
    resetQuizState: () => void;
    abandonQuiz: () => void;
    loadQuizStatistics: (quizType?: string | undefined) => Promise<void>;
    exportQuizResults: (quizType?: string | undefined, format?: 'csv' | 'json') => Promise<void>;
    validateCurrentResponses: () => {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    calculateCurrentScore: () => {
        score: number;
        totalPossible: number;
        correctAnswers: number;
        percentage: number;
    };
    getQuestionsByCategory: (category: string) => QuizQuestion[];
    getAverageTimePerQuestion: () => number;
    getResponsesWithCorrectness: () => Array<QuizResponse & {
        isCorrect?: boolean;
        question?: QuizQuestion;
    }>;
    clearAllData: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "error" | "loading" | "introductionQuestions" | "sondageQuestions" | "currentQuizType" | "currentQuestionIndex" | "quizStartTime" | "quizInProgress" | "currentResponses" | "userResults" | "quizStatistics">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    introductionQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    sondageQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    currentQuizType: import("vue").Ref<"Introduction" | "Sondage" | null, "Introduction" | "Sondage" | null>;
    currentQuestionIndex: import("vue").Ref<number, number>;
    quizStartTime: import("vue").Ref<Date | null, Date | null>;
    quizInProgress: import("vue").Ref<boolean, boolean>;
    currentResponses: import("vue").Ref<{
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[], QuizResponse[] | {
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[]>;
    userResults: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[], QuizResult[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[]>;
    quizStatistics: import("vue").Ref<{
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null, {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null>;
    hasIntroductionQuestions: import("vue").ComputedRef<boolean>;
    hasSondageQuestions: import("vue").ComputedRef<boolean>;
    currentQuestion: import("vue").ComputedRef<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    } | null>;
    totalQuestions: import("vue").ComputedRef<number>;
    quizProgress: import("vue").ComputedRef<number>;
    hasCompletedIntroduction: import("vue").ComputedRef<boolean>;
    hasCompletedSondage: import("vue").ComputedRef<boolean>;
    latestIntroductionResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    latestSondageResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    setQuizService: (service: QuizService) => void;
    loadIntroductionQuestions: () => Promise<void>;
    loadSondageQuestions: () => Promise<void>;
    loadUserResults: (userId?: string | undefined) => Promise<void>;
    startQuiz: (quizType: 'Introduction' | 'Sondage') => Promise<void>;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    addResponse: (response: QuizResponse) => void;
    updateResponse: (questionId: string, answer: string | number) => void;
    getResponse: (questionId: string) => QuizResponse | undefined;
    saveProgress: (progressData: any) => Promise<void>;
    saveQuizResult: (result: QuizResult) => Promise<void>;
    resetQuizState: () => void;
    abandonQuiz: () => void;
    loadQuizStatistics: (quizType?: string | undefined) => Promise<void>;
    exportQuizResults: (quizType?: string | undefined, format?: 'csv' | 'json') => Promise<void>;
    validateCurrentResponses: () => {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    calculateCurrentScore: () => {
        score: number;
        totalPossible: number;
        correctAnswers: number;
        percentage: number;
    };
    getQuestionsByCategory: (category: string) => QuizQuestion[];
    getAverageTimePerQuestion: () => number;
    getResponsesWithCorrectness: () => Array<QuizResponse & {
        isCorrect?: boolean;
        question?: QuizQuestion;
    }>;
    clearAllData: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "currentQuestion" | "totalQuestions" | "hasIntroductionQuestions" | "hasSondageQuestions" | "quizProgress" | "hasCompletedIntroduction" | "hasCompletedSondage" | "latestIntroductionResult" | "latestSondageResult">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    introductionQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    sondageQuestions: import("vue").Ref<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[], QuizQuestion[] | {
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    }[]>;
    currentQuizType: import("vue").Ref<"Introduction" | "Sondage" | null, "Introduction" | "Sondage" | null>;
    currentQuestionIndex: import("vue").Ref<number, number>;
    quizStartTime: import("vue").Ref<Date | null, Date | null>;
    quizInProgress: import("vue").Ref<boolean, boolean>;
    currentResponses: import("vue").Ref<{
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[], QuizResponse[] | {
        questionId: string;
        answer: string | number;
        correct?: boolean | undefined;
        timeSpent: number;
    }[]>;
    userResults: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[], QuizResult[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }[]>;
    quizStatistics: import("vue").Ref<{
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null, {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | {
        totalParticipants: number;
        averageScore: number;
        completionRate: number;
        averageCompletionTime: number;
        categoryBreakdown: {
            [key: string]: number;
        };
    } | null>;
    hasIntroductionQuestions: import("vue").ComputedRef<boolean>;
    hasSondageQuestions: import("vue").ComputedRef<boolean>;
    currentQuestion: import("vue").ComputedRef<{
        id: string;
        title: string;
        question: string;
        type: "text" | "rating" | "multiple-choice";
        options: {
            id: string;
            text: string;
            correct?: boolean | undefined;
        }[];
        correctAnswer?: string | undefined;
        category?: string | undefined;
        points: number;
        order: number;
        required?: boolean | undefined;
        feedback?: string | undefined;
    } | null>;
    totalQuestions: import("vue").ComputedRef<number>;
    quizProgress: import("vue").ComputedRef<number>;
    hasCompletedIntroduction: import("vue").ComputedRef<boolean>;
    hasCompletedSondage: import("vue").ComputedRef<boolean>;
    latestIntroductionResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    latestSondageResult: import("vue").ComputedRef<{
        id?: string | undefined;
        userId: string;
        userName: string;
        quizType: "Introduction" | "Sondage";
        responses: {
            questionId: string;
            answer: string | number;
            correct?: boolean | undefined;
            timeSpent: number;
        }[];
        score?: number | undefined;
        totalQuestions: number;
        correctAnswers?: number | undefined;
        startTime: Date;
        endTime: Date;
        duration: number;
        status: "Completed" | "In Progress" | "Abandoned";
    }>;
    setQuizService: (service: QuizService) => void;
    loadIntroductionQuestions: () => Promise<void>;
    loadSondageQuestions: () => Promise<void>;
    loadUserResults: (userId?: string | undefined) => Promise<void>;
    startQuiz: (quizType: 'Introduction' | 'Sondage') => Promise<void>;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    addResponse: (response: QuizResponse) => void;
    updateResponse: (questionId: string, answer: string | number) => void;
    getResponse: (questionId: string) => QuizResponse | undefined;
    saveProgress: (progressData: any) => Promise<void>;
    saveQuizResult: (result: QuizResult) => Promise<void>;
    resetQuizState: () => void;
    abandonQuiz: () => void;
    loadQuizStatistics: (quizType?: string | undefined) => Promise<void>;
    exportQuizResults: (quizType?: string | undefined, format?: 'csv' | 'json') => Promise<void>;
    validateCurrentResponses: () => {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    calculateCurrentScore: () => {
        score: number;
        totalPossible: number;
        correctAnswers: number;
        percentage: number;
    };
    getQuestionsByCategory: (category: string) => QuizQuestion[];
    getAverageTimePerQuestion: () => number;
    getResponsesWithCorrectness: () => Array<QuizResponse & {
        isCorrect?: boolean;
        question?: QuizQuestion;
    }>;
    clearAllData: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "setError" | "clearError" | "setQuizService" | "loadIntroductionQuestions" | "loadSondageQuestions" | "loadUserResults" | "startQuiz" | "nextQuestion" | "previousQuestion" | "goToQuestion" | "addResponse" | "updateResponse" | "getResponse" | "saveProgress" | "saveQuizResult" | "resetQuizState" | "abandonQuiz" | "loadQuizStatistics" | "exportQuizResults" | "validateCurrentResponses" | "calculateCurrentScore" | "getQuestionsByCategory" | "getAverageTimePerQuestion" | "getResponsesWithCorrectness" | "clearAllData">>;
//# sourceMappingURL=quiz.d.ts.map