var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
export var pinia = createPinia();
// Service instances
var sharePointService;
var quizService;
var userService;
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
        sharePointService: sharePointService,
        quizService: quizService,
        userService: userService
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
        pinia: pinia,
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
export function initializeAllStores() {
    return __awaiter(this, void 0, void 0, function () {
        var appStore, quizStore, userStore, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appStore = useAppStore();
                    quizStore = useQuizStore();
                    userStore = useUserStore();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // Initialize app store first
                    return [4 /*yield*/, appStore.initializeApp()];
                case 2:
                    // Initialize app store first
                    _a.sent();
                    // Set services in stores
                    quizStore.setQuizService(quizService);
                    userStore.setUserService(userService);
                    // Initialize user store
                    return [4 /*yield*/, userStore.initializeUser()];
                case 3:
                    // Initialize user store
                    _a.sent();
                    appStore.showSuccessMessage('Application initialisée avec succès');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error initializing stores:', error_1);
                    appStore.showErrorMessage(error_1 instanceof Error ? error_1.message : 'Erreur lors de l\'initialisation');
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Reset all stores to initial state
 */
export function resetAllStores() {
    var appStore = useAppStore();
    var quizStore = useQuizStore();
    var userStore = useUserStore();
    quizStore.clearAllData();
    userStore.clearAllData();
    appStore.resetApp();
}
/**
 * Check if all required data is loaded
 */
export function isDataLoaded() {
    var userStore = useUserStore();
    var quizStore = useQuizStore();
    return userStore.isAuthenticated &&
        userStore.isUserLoaded &&
        (quizStore.hasIntroductionQuestions || quizStore.hasSondageQuestions);
}
/**
 * Refresh all store data
 */
export function refreshAllData() {
    return __awaiter(this, void 0, void 0, function () {
        var appStore, quizStore, userStore, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appStore = useAppStore();
                    quizStore = useQuizStore();
                    userStore = useUserStore();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    appStore.setLoading(true);
                    return [4 /*yield*/, Promise.all([
                            userStore.refreshUserData(),
                            quizStore.loadUserResults(),
                            // Refresh other data as needed
                        ])];
                case 2:
                    _a.sent();
                    appStore.updateLastSync();
                    appStore.showSuccessMessage('Données actualisées');
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error refreshing data:', error_2);
                    appStore.showErrorMessage(error_2 instanceof Error ? error_2.message : 'Erreur lors de l\'actualisation');
                    throw error_2;
                case 4:
                    appStore.setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Handle store errors globally
 */
export function handleStoreError(error, operation) {
    var appStore = useAppStore();
    console.error("Store error in ".concat(operation, ":"), error);
    appStore.trackError(operation);
    appStore.showErrorMessage(error.message || 'Une erreur inattendue s\'est produite', "Erreur - ".concat(operation));
}
/**
 * Track performance for store operations
 */
export function trackStoreOperation(operation, fn) {
    var appStore = useAppStore();
    var startTime = performance.now();
    return fn()
        .then(function (result) {
        var duration = performance.now() - startTime;
        appStore.trackPerformance(operation, duration);
        return result;
    })
        .catch(function (error) {
        appStore.trackError(operation);
        throw error;
    });
}
/**
 * Store middleware for automatic error handling
 */
export function withErrorHandling(operation, fn) {
    var _this = this;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, trackStoreOperation(operation, function () { return fn.apply(void 0, args); })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        handleStoreError(error_3, operation);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
}
/**
 * Batch operations utility
 */
export function batchOperations(operations, concurrency) {
    if (concurrency === void 0) { concurrency = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var results, i, batch, batchResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < operations.length)) return [3 /*break*/, 4];
                    batch = operations.slice(i, i + concurrency);
                    return [4 /*yield*/, Promise.all(batch.map(function (op) { return op(); }))];
                case 2:
                    batchResults = _a.sent();
                    results.push.apply(results, batchResults);
                    _a.label = 3;
                case 3:
                    i += concurrency;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, results];
            }
        });
    });
}
/**
 * Retry operation utility
 */
export function retryOperation(operation, maxRetries, delay) {
    if (maxRetries === void 0) { maxRetries = 3; }
    if (delay === void 0) { delay = 1000; }
    return __awaiter(this, void 0, void 0, function () {
        var lastError, _loop_1, i, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (i) {
                        var _b, error_4;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 4]);
                                    _b = {};
                                    return [4 /*yield*/, operation()];
                                case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                case 2:
                                    error_4 = _c.sent();
                                    lastError = error_4;
                                    if (i === maxRetries) {
                                        throw lastError;
                                    }
                                    // Wait before retrying
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay * Math.pow(2, i)); })];
                                case 3:
                                    // Wait before retrying
                                    _c.sent();
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i <= maxRetries)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: throw lastError;
            }
        });
    });
}
/**
 * Cache management for stores
 */
var StoreCache = /** @class */ (function () {
    function StoreCache() {
        this.cache = new Map();
    }
    StoreCache.prototype.get = function (key, fetcher, ttl // 5 minutes default
    ) {
        if (ttl === void 0) { ttl = 300000; }
        return __awaiter(this, void 0, void 0, function () {
            var cached, now, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.cache.get(key);
                        now = Date.now();
                        if (cached && (now - cached.timestamp) < cached.ttl) {
                            return [2 /*return*/, cached.data];
                        }
                        return [4 /*yield*/, fetcher()];
                    case 1:
                        data = _a.sent();
                        this.cache.set(key, { data: data, timestamp: now, ttl: ttl });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    StoreCache.prototype.invalidate = function (key) {
        this.cache.delete(key);
    };
    StoreCache.prototype.clear = function () {
        this.cache.clear();
    };
    StoreCache.prototype.size = function () {
        return this.cache.size;
    };
    return StoreCache;
}());
export { StoreCache };
// Global cache instance
export var storeCache = new StoreCache();
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