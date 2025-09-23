import Vuex from 'vuex';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
import { AppState } from './app';
import { QuizState } from './quiz';
import { UserState } from './user';
export interface RootState {
    app: AppState;
    quiz: QuizState;
    user: UserState;
}
export declare const store: Vuex.Store<RootState>;
/**
 * Initialize services and stores with SharePoint context
 */
export declare function initializeStores(context: WebPartContext): void;
/**
 * Get service instances
 */
export declare function getServices(): {
    sharePointService: SharePointService;
    quizService: QuizService;
    userService: UserService;
};
/**
 * Setup stores for Vue app
 */
export declare function setupStores(app: any, context: WebPartContext): {
    store: Vuex.Store<RootState>;
    services: {
        sharePointService: SharePointService;
        quizService: QuizService;
        userService: UserService;
    };
};
/**
 * Initialize all stores with their respective services
 */
export declare function initializeAllStores(): Promise<void>;
/**
 * Reset all stores to initial state
 */
export declare function resetAllStores(): void;
/**
 * Check if all required data is loaded
 */
export declare function isDataLoaded(): boolean;
/**
 * Refresh all store data
 */
export declare function refreshAllData(): Promise<void>;
/**
 * Handle store errors globally
 */
export declare function handleStoreError(error: Error, operation: string): void;
/**
 * Track performance for store operations
 */
export declare function trackStoreOperation<T>(operation: string, fn: () => Promise<T>): Promise<T>;
/**
 * Store middleware for automatic error handling
 */
export declare function withErrorHandling<T extends any[], R>(operation: string, fn: (...args: T) => Promise<R>): (...args: T) => Promise<R>;
/**
 * Cache management for stores
 */
export declare class StoreCache {
    private cache;
    get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T>;
    invalidate(key: string): void;
    clear(): void;
    size(): number;
}
export declare const storeCache: StoreCache;
export default store;
//# sourceMappingURL=index.d.ts.map