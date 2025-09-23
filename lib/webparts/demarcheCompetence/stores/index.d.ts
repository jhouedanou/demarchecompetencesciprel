import { App } from 'vue';
import { WebPartContext } from '@microsoft/sp-webpart-base';
export { useAppStore } from './app';
export { useQuizStore } from './quiz';
export { useUserStore } from './user';
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
export declare const pinia: import("pinia").Pinia;
/**
 * Initialize stores with SharePoint context and services
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
export declare function setupStores(app: App, context: WebPartContext): {
    pinia: import("pinia").Pinia;
    services: {
        sharePointService: SharePointService;
        quizService: QuizService;
        userService: UserService;
    };
};
/**
 * Store utilities for common operations
 */
import { useAppStore } from './app';
import { useQuizStore } from './quiz';
import { useUserStore } from './user';
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
 * Batch operations utility
 */
export declare function batchOperations<T>(operations: Array<() => Promise<T>>, concurrency?: number): Promise<T[]>;
/**
 * Retry operation utility
 */
export declare function retryOperation<T>(operation: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>;
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
/**
 * Type definitions for store composition
 */
export interface StoreComposition {
    app: ReturnType<typeof useAppStore>;
    quiz: ReturnType<typeof useQuizStore>;
    user: ReturnType<typeof useUserStore>;
}
/**
 * Compose all stores for easier access
 */
export declare function useStores(): StoreComposition;
//# sourceMappingURL=index.d.ts.map