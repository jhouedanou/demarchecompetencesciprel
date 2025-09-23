import { createPinia } from 'pinia';
// Import stores
export { useAppStore } from './app';
export { useQuizStore } from './quiz';
export { useUserStore } from './user';
// Import services
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
// Create pinia instance
export const pinia = createPinia();
// Service instances
let sharePointService;
let quizService;
let userService;
/**
 * Initialize stores with SharePoint context and services
 */
export function initializeStores(context) {
    // Initialize services
    sharePointService = new SharePointService(context);
    quizService = new QuizService(sharePointService);
    userService = new UserService(sharePointService);
    // The stores will be initialized when first accessed
    // We'll provide the services through the store actions
}
/**
 * Get service instances
 */
export function getServices() {
    return {
        sharePointService,
        quizService,
        userService
    };
}
/**
 * Setup stores for Vue app
 */
export function setupStores(app, context) {
    // Install Pinia
    app.use(pinia);
    // Initialize services
    initializeStores(context);
    return {
        pinia,
        services: getServices()
    };
}
/**
 * Store utilities for common operations
 */
import { useAppStore } from './app';
import { useQuizStore } from './quiz';
import { useUserStore } from './user';
/**
 * Initialize all stores with their respective services
 */
export async function initializeAllStores() {
    const appStore = useAppStore();
    const quizStore = useQuizStore();
    const userStore = useUserStore();
    try {
        // Initialize app store first
        await appStore.initializeApp();
        // Set services in stores
        quizStore.setQuizService(quizService);
        userStore.setUserService(userService);
        // Initialize user store
        await userStore.initializeUser();
        appStore.showSuccessMessage('Application initialisée avec succès');
    }
    catch (error) {
        console.error('Error initializing stores:', error);
        appStore.showErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'initialisation');
        throw error;
    }
}
/**
 * Reset all stores to initial state
 */
export function resetAllStores() {
    const appStore = useAppStore();
    const quizStore = useQuizStore();
    const userStore = useUserStore();
    quizStore.clearAllData();
    userStore.clearAllData();
    appStore.resetApp();
}
/**
 * Check if all required data is loaded
 */
export function isDataLoaded() {
    const userStore = useUserStore();
    const quizStore = useQuizStore();
    return userStore.isAuthenticated &&
        userStore.isUserLoaded &&
        (quizStore.hasIntroductionQuestions || quizStore.hasSondageQuestions);
}
/**
 * Refresh all store data
 */
export async function refreshAllData() {
    const appStore = useAppStore();
    const quizStore = useQuizStore();
    const userStore = useUserStore();
    try {
        appStore.setLoading(true);
        await Promise.all([
            userStore.refreshUserData(),
            quizStore.loadUserResults(),
            // Refresh other data as needed
        ]);
        appStore.updateLastSync();
        appStore.showSuccessMessage('Données actualisées');
    }
    catch (error) {
        console.error('Error refreshing data:', error);
        appStore.showErrorMessage(error instanceof Error ? error.message : 'Erreur lors de l\'actualisation');
        throw error;
    }
    finally {
        appStore.setLoading(false);
    }
}
/**
 * Handle store errors globally
 */
export function handleStoreError(error, operation) {
    const appStore = useAppStore();
    console.error(`Store error in ${operation}:`, error);
    appStore.trackError(operation);
    appStore.showErrorMessage(error.message || 'Une erreur inattendue s\'est produite', `Erreur - ${operation}`);
}
/**
 * Track performance for store operations
 */
export function trackStoreOperation(operation, fn) {
    const appStore = useAppStore();
    const startTime = performance.now();
    return fn()
        .then(result => {
        const duration = performance.now() - startTime;
        appStore.trackPerformance(operation, duration);
        return result;
    })
        .catch(error => {
        appStore.trackError(operation);
        throw error;
    });
}
/**
 * Store middleware for automatic error handling
 */
export function withErrorHandling(operation, fn) {
    return async (...args) => {
        try {
            return await trackStoreOperation(operation, () => fn(...args));
        }
        catch (error) {
            handleStoreError(error, operation);
            throw error;
        }
    };
}
/**
 * Batch operations utility
 */
export async function batchOperations(operations, concurrency = 3) {
    const results = [];
    for (let i = 0; i < operations.length; i += concurrency) {
        const batch = operations.slice(i, i + concurrency);
        const batchResults = await Promise.all(batch.map(op => op()));
        results.push(...batchResults);
    }
    return results;
}
/**
 * Retry operation utility
 */
export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            if (i === maxRetries) {
                throw lastError;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
    throw lastError;
}
/**
 * Cache management for stores
 */
export class StoreCache {
    constructor() {
        this.cache = new Map();
    }
    async get(key, fetcher, ttl = 300000 // 5 minutes default
    ) {
        const cached = this.cache.get(key);
        const now = Date.now();
        if (cached && (now - cached.timestamp) < cached.ttl) {
            return cached.data;
        }
        const data = await fetcher();
        this.cache.set(key, { data, timestamp: now, ttl });
        return data;
    }
    invalidate(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        return this.cache.size;
    }
}
// Global cache instance
export const storeCache = new StoreCache();
/**
 * Compose all stores for easier access
 */
export function useStores() {
    return {
        app: useAppStore(),
        quiz: useQuizStore(),
        user: useUserStore()
    };
}
//# sourceMappingURL=index.js.map