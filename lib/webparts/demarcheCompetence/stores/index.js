import Vuex from 'vuex';
// Import services
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
// Import store modules
import { appModule } from './app';
import { quizModule } from './quiz';
import { userModule } from './user';
// Service instances
let sharePointService;
let quizService;
let userService;
// Create Vuex store
export const store = new Vuex.Store({
    modules: {
        app: appModule,
        quiz: quizModule,
        user: userModule
    },
    strict: process.env.NODE_ENV !== 'production'
});
/**
 * Initialize services and stores with SharePoint context
 */
export function initializeStores(context) {
    // Initialize services
    sharePointService = new SharePointService(context);
    quizService = new QuizService(sharePointService);
    userService = new UserService(sharePointService);
    // Set services in store
    store.dispatch('app/setServices', { sharePointService, quizService, userService });
    store.dispatch('quiz/setQuizService', quizService);
    store.dispatch('user/setUserService', userService);
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
    // Initialize services
    initializeStores(context);
    return {
        store,
        services: getServices()
    };
}
/**
 * Initialize all stores with their respective services
 */
export async function initializeAllStores() {
    try {
        // Initialize app store first
        await store.dispatch('app/initializeApp');
        // Initialize user store
        await store.dispatch('user/initializeUser');
        store.dispatch('app/showSuccessMessage', 'Application initialisée avec succès');
    }
    catch (error) {
        console.error('Error initializing stores:', error);
        store.dispatch('app/showErrorMessage', {
            message: error instanceof Error ? error.message : 'Erreur lors de l\'initialisation'
        });
        throw error;
    }
}
/**
 * Reset all stores to initial state
 */
export function resetAllStores() {
    store.dispatch('quiz/clearAllData');
    store.dispatch('user/clearAllData');
    store.dispatch('app/resetApp');
}
/**
 * Check if all required data is loaded
 */
export function isDataLoaded() {
    const state = store.state;
    return state.user.isAuthenticated &&
        state.user.isUserLoaded &&
        (state.quiz.introductionQuestions.length > 0 || state.quiz.sondageQuestions.length > 0);
}
/**
 * Refresh all store data
 */
export async function refreshAllData() {
    try {
        store.dispatch('app/setLoading', true);
        await Promise.all([
            store.dispatch('user/refreshUserData'),
            store.dispatch('quiz/loadUserResults'),
        ]);
        store.dispatch('app/updateLastSync');
        store.dispatch('app/showSuccessMessage', 'Données actualisées');
    }
    catch (error) {
        console.error('Error refreshing data:', error);
        store.dispatch('app/showErrorMessage', {
            message: error instanceof Error ? error.message : 'Erreur lors de l\'actualisation'
        });
        throw error;
    }
    finally {
        store.dispatch('app/setLoading', false);
    }
}
/**
 * Handle store errors globally
 */
export function handleStoreError(error, operation) {
    console.error(`Store error in ${operation}:`, error);
    store.dispatch('app/trackError', operation);
    store.dispatch('app/showErrorMessage', {
        message: error.message || 'Une erreur inattendue s\'est produite',
        title: `Erreur - ${operation}`
    });
}
/**
 * Track performance for store operations
 */
export function trackStoreOperation(operation, fn) {
    const startTime = performance.now();
    return fn()
        .then(result => {
        const duration = performance.now() - startTime;
        store.dispatch('app/trackPerformance', { operation, duration });
        return result;
    })
        .catch(error => {
        store.dispatch('app/trackError', operation);
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
// Export store for component access
export default store;
//# sourceMappingURL=index.js.map