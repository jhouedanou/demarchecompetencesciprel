import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import '@pnp/sp/site-users/web';
import '@pnp/sp/profiles';
import type { QuizIntroductionItem, QuizSondageItem, QuizResultsItem, UserProgressItem, SharePointListItem } from '@types/index';
export declare class SharePointService {
    private sp;
    private context;
    constructor(context: WebPartContext);
    /**
     * Get current user information
     */
    getCurrentUser(): Promise<{
        id: number;
        title: string;
        email: string;
        loginName: string;
    }>;
    /**
     * Quiz Introduction Methods
     */
    getQuizIntroductionQuestions(): Promise<QuizIntroductionItem[]>;
    addQuizIntroductionQuestion(question: Partial<QuizIntroductionItem>): Promise<QuizIntroductionItem>;
    updateQuizIntroductionQuestion(id: number, question: Partial<QuizIntroductionItem>): Promise<void>;
    deleteQuizIntroductionQuestion(id: number): Promise<void>;
    private getQuizIntroductionQuestionById;
    /**
     * Quiz Sondage Methods
     */
    getQuizSondageQuestions(): Promise<QuizSondageItem[]>;
    addQuizSondageQuestion(question: Partial<QuizSondageItem>): Promise<QuizSondageItem>;
    updateQuizSondageQuestion(id: number, question: Partial<QuizSondageItem>): Promise<void>;
    deleteQuizSondageQuestion(id: number): Promise<void>;
    private getQuizSondageQuestionById;
    /**
     * Quiz Results Methods
     */
    getQuizResults(userId?: string): Promise<QuizResultsItem[]>;
    saveQuizResult(result: Partial<QuizResultsItem>): Promise<QuizResultsItem>;
    updateQuizResult(id: number, result: Partial<QuizResultsItem>): Promise<void>;
    deleteQuizResult(id: number): Promise<void>;
    private getQuizResultById;
    /**
     * User Progress Methods
     */
    getUserProgress(userId?: string): Promise<UserProgressItem[]>;
    saveUserProgress(progress: Partial<UserProgressItem>): Promise<UserProgressItem>;
    updateUserProgress(id: number, progress: Partial<UserProgressItem>): Promise<void>;
    deleteUserProgress(id: number): Promise<void>;
    private getUserProgressById;
    /**
     * Utility Methods
     */
    checkListExists(listTitle: string): Promise<boolean>;
    getListItems<T = SharePointListItem>(listTitle: string, select?: string[], filter?: string, orderBy?: string, top?: number): Promise<T[]>;
    bulkUpdateItems<T = any>(listTitle: string, updates: Array<{
        id: number;
        data: Partial<T>;
    }>): Promise<void>;
    exportToExcel(listTitle: string, fileName?: string): Promise<void>;
    /**
     * Helper Methods
     */
    private parseJSON;
    private formatDate;
    /**
     * Cache Management
     */
    private cache;
    private getCachedData;
    clearCache(): void;
    removeCacheEntry(key: string): void;
    /**
     * Error Handling and Retry Logic
     */
    private retryOperation;
}
//# sourceMappingURL=SharePointService.d.ts.map