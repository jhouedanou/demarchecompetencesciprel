export interface QuizQuestion {
    id: string;
    title: string;
    question: string;
    type: 'multiple-choice' | 'text' | 'rating';
    options: QuizOption[];
    correctAnswer?: string;
    category?: string;
    points: number;
    order: number;
    required?: boolean;
    feedback?: string;
}
export interface QuizOption {
    id: string;
    text: string;
    correct?: boolean;
}
export interface QuizResponse {
    questionId: string;
    answer: string | number;
    correct?: boolean;
    timeSpent: number;
}
export interface QuizResult {
    id?: string;
    userId: string;
    userName: string;
    quizType: 'Introduction' | 'Sondage';
    responses: QuizResponse[];
    score?: number;
    totalQuestions: number;
    correctAnswers?: number;
    startTime: Date;
    endTime: Date;
    duration: number;
    status: 'Completed' | 'In Progress' | 'Abandoned';
}
export interface UserProgress {
    id?: string;
    userId: string;
    userName: string;
    competenceArea: string;
    currentLevel: number;
    targetLevel: number;
    lastAssessment: Date;
    nextAssessment: Date;
    progress: number;
}
export interface CompetenceArea {
    id: string;
    name: string;
    description: string;
    levels: CompetenceLevel[];
}
export interface CompetenceLevel {
    level: number;
    title: string;
    description: string;
    requirements: string[];
}
export interface SharePointListItem {
    Id: number;
    Title: string;
    Created: string;
    Modified: string;
    Author: {
        Title: string;
        Email: string;
    };
}
export interface QuizIntroductionItem extends SharePointListItem {
    Question: string;
    Options: string;
    CorrectAnswer: string;
    Category: string;
    Points: number;
    Order: number;
}
export interface QuizSondageItem extends SharePointListItem {
    Question: string;
    QuestionType: string;
    Options: string;
    Required: boolean;
    Order: number;
}
export interface QuizResultsItem extends SharePointListItem {
    User: {
        Title: string;
        Email: string;
    };
    QuizType: string;
    Responses: string;
    Score: number;
    CompletionDate: string;
    Duration: number;
    Status: string;
}
export interface UserProgressItem extends SharePointListItem {
    User: {
        Title: string;
        Email: string;
    };
    CompetenceArea: string;
    CurrentLevel: number;
    TargetLevel: number;
    LastAssessment: string;
    NextAssessment: string;
    Progress: number;
}
//# sourceMappingURL=index.d.ts.map