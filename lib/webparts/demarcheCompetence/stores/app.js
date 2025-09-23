var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export var useAppStore = defineStore('app', function () {
    // State
    var loading = ref(false);
    var initialized = ref(false);
    var error = ref(null);
    // Current view and navigation
    var currentView = ref('dashboard');
    var previousView = ref(null);
    var navigationHistory = ref([]);
    // App settings
    var settings = ref({
        theme: 'auto',
        language: 'fr',
        autoSaveInterval: 30,
        showNotifications: true,
        soundEnabled: true,
        animationsEnabled: true,
        compactMode: false
    });
    // Notifications
    var notifications = ref([]);
    // Application state
    var isOnline = ref(navigator.onLine);
    var isMobile = ref(window.innerWidth <= 768);
    var sidebarOpen = ref(!isMobile.value);
    // Performance tracking
    var performanceMetrics = ref({
        loadTimes: {},
        errorCounts: {},
        lastSync: null
    });
    // Computed
    var hasNotifications = computed(function () { return notifications.value.length > 0; });
    var unreadNotifications = computed(function () {
        return notifications.value.filter(function (n) { return !n.persistent; });
    });
    var errorNotifications = computed(function () {
        return notifications.value.filter(function (n) { return n.type === 'error'; });
    });
    var currentTheme = computed(function () {
        if (settings.value.theme === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return settings.value.theme;
    });
    var isOffline = computed(function () { return !isOnline.value; });
    var canGoBack = computed(function () { return navigationHistory.value.length > 1; });
    // Actions
    function setLoading(value) {
        loading.value = value;
    }
    function setInitialized(value) {
        initialized.value = value;
    }
    function setError(message) {
        error.value = message;
        if (message) {
            addNotification({
                type: 'error',
                title: 'Erreur',
                message: message,
                persistent: true
            });
        }
    }
    function clearError() {
        error.value = null;
    }
    function navigateTo(view, addToHistory) {
        if (addToHistory === void 0) { addToHistory = true; }
        if (addToHistory && currentView.value !== view) {
            navigationHistory.value.push(currentView.value);
            // Keep history limited to last 10 views
            if (navigationHistory.value.length > 10) {
                navigationHistory.value.shift();
            }
        }
        previousView.value = currentView.value;
        currentView.value = view;
    }
    function goBack() {
        if (canGoBack.value) {
            var previousViewFromHistory = navigationHistory.value.pop();
            if (previousViewFromHistory) {
                previousView.value = currentView.value;
                currentView.value = previousViewFromHistory;
            }
        }
    }
    function addNotification(notification) {
        var newNotification = __assign(__assign({}, notification), { id: Date.now().toString() + Math.random().toString(36).substr(2, 9), timestamp: new Date() });
        notifications.value.unshift(newNotification);
        // Auto-remove non-persistent notifications
        if (!notification.persistent) {
            var duration = notification.duration || 5000;
            setTimeout(function () {
                removeNotification(newNotification.id);
            }, duration);
        }
        // Keep only last 50 notifications
        if (notifications.value.length > 50) {
            notifications.value = notifications.value.slice(0, 50);
        }
    }
    function removeNotification(id) {
        var index = notifications.value.findIndex(function (n) { return n.id === id; });
        if (index >= 0) {
            notifications.value.splice(index, 1);
        }
    }
    function clearNotifications() {
        notifications.value = [];
    }
    function clearNonPersistentNotifications() {
        notifications.value = notifications.value.filter(function (n) { return n.persistent; });
    }
    function updateSettings(newSettings) {
        settings.value = __assign(__assign({}, settings.value), newSettings);
        saveSettingsToStorage();
        // Apply theme changes immediately
        if (newSettings.theme) {
            applyTheme();
        }
    }
    function loadSettingsFromStorage() {
        try {
            var savedSettings = localStorage.getItem('demarcheCompetence_settings');
            if (savedSettings) {
                var parsed = JSON.parse(savedSettings);
                settings.value = __assign(__assign({}, settings.value), parsed);
            }
        }
        catch (error) {
            console.warn('Could not load settings from storage:', error);
        }
    }
    function saveSettingsToStorage() {
        try {
            localStorage.setItem('demarcheCompetence_settings', JSON.stringify(settings.value));
        }
        catch (error) {
            console.warn('Could not save settings to storage:', error);
        }
    }
    function applyTheme() {
        var theme = currentTheme.value;
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    function toggleSidebar() {
        sidebarOpen.value = !sidebarOpen.value;
    }
    function setSidebarOpen(open) {
        sidebarOpen.value = open;
    }
    function updateOnlineStatus() {
        isOnline.value = navigator.onLine;
        if (isOnline.value) {
            addNotification({
                type: 'success',
                title: 'Connexion rétablie',
                message: 'Vous êtes maintenant en ligne',
                duration: 3000
            });
        }
        else {
            addNotification({
                type: 'warning',
                title: 'Connexion perdue',
                message: 'Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.',
                persistent: true
            });
        }
    }
    function updateMobileStatus() {
        var wasMobile = isMobile.value;
        isMobile.value = window.innerWidth <= 768;
        // Auto-close sidebar on mobile
        if (isMobile.value && !wasMobile) {
            sidebarOpen.value = false;
        }
        else if (!isMobile.value && wasMobile) {
            sidebarOpen.value = true;
        }
    }
    function trackPerformance(operation, duration) {
        performanceMetrics.value.loadTimes[operation] = duration;
    }
    function trackError(operation) {
        performanceMetrics.value.errorCounts[operation] =
            (performanceMetrics.value.errorCounts[operation] || 0) + 1;
    }
    function updateLastSync() {
        performanceMetrics.value.lastSync = new Date();
    }
    function initializeApp() {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                try {
                    setLoading(true);
                    // Load settings from storage
                    loadSettingsFromStorage();
                    // Apply initial theme
                    applyTheme();
                    // Set up event listeners
                    window.addEventListener('online', updateOnlineStatus);
                    window.addEventListener('offline', updateOnlineStatus);
                    window.addEventListener('resize', updateMobileStatus);
                    // Theme change listener
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
                        if (settings.value.theme === 'auto') {
                            applyTheme();
                        }
                    });
                    setInitialized(true);
                    addNotification({
                        type: 'success',
                        title: 'Application initialisée',
                        message: 'Bienvenue dans la démarche compétence CIPREL',
                        duration: 3000
                    });
                }
                catch (err) {
                    message = err instanceof Error ? err.message : 'Erreur lors de l\'initialisation';
                    setError(message);
                    throw err;
                }
                finally {
                    setLoading(false);
                }
                return [2 /*return*/];
            });
        });
    }
    function cleanup() {
        // Remove event listeners
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        window.removeEventListener('resize', updateMobileStatus);
        // Clear notifications
        clearNotifications();
        // Reset state
        initialized.value = false;
        currentView.value = 'dashboard';
        navigationHistory.value = [];
        error.value = null;
    }
    function resetApp() {
        // Clear all stored data
        localStorage.removeItem('demarcheCompetence_settings');
        // Reset to default settings
        settings.value = {
            theme: 'auto',
            language: 'fr',
            autoSaveInterval: 30,
            showNotifications: true,
            soundEnabled: true,
            animationsEnabled: true,
            compactMode: false
        };
        // Clear notifications and navigation
        clearNotifications();
        navigationHistory.value = [];
        currentView.value = 'dashboard';
        // Apply default theme
        applyTheme();
        addNotification({
            type: 'info',
            title: 'Application réinitialisée',
            message: 'Les paramètres ont été remis à zéro',
            duration: 3000
        });
    }
    function showSuccessMessage(message, title) {
        if (title === void 0) { title = 'Succès'; }
        addNotification({
            type: 'success',
            title: title,
            message: message,
            duration: 4000
        });
    }
    function showErrorMessage(message, title) {
        if (title === void 0) { title = 'Erreur'; }
        addNotification({
            type: 'error',
            title: title,
            message: message,
            persistent: true
        });
    }
    function showWarningMessage(message, title) {
        if (title === void 0) { title = 'Attention'; }
        addNotification({
            type: 'warning',
            title: title,
            message: message,
            duration: 6000
        });
    }
    function showInfoMessage(message, title) {
        if (title === void 0) { title = 'Information'; }
        addNotification({
            type: 'info',
            title: title,
            message: message,
            duration: 5000
        });
    }
    return {
        // State
        loading: loading,
        initialized: initialized,
        error: error,
        currentView: currentView,
        previousView: previousView,
        navigationHistory: navigationHistory,
        settings: settings,
        notifications: notifications,
        isOnline: isOnline,
        isMobile: isMobile,
        sidebarOpen: sidebarOpen,
        performanceMetrics: performanceMetrics,
        // Computed
        hasNotifications: hasNotifications,
        unreadNotifications: unreadNotifications,
        errorNotifications: errorNotifications,
        currentTheme: currentTheme,
        isOffline: isOffline,
        canGoBack: canGoBack,
        // Actions
        setLoading: setLoading,
        setInitialized: setInitialized,
        setError: setError,
        clearError: clearError,
        navigateTo: navigateTo,
        goBack: goBack,
        addNotification: addNotification,
        removeNotification: removeNotification,
        clearNotifications: clearNotifications,
        clearNonPersistentNotifications: clearNonPersistentNotifications,
        updateSettings: updateSettings,
        loadSettingsFromStorage: loadSettingsFromStorage,
        saveSettingsToStorage: saveSettingsToStorage,
        applyTheme: applyTheme,
        toggleSidebar: toggleSidebar,
        setSidebarOpen: setSidebarOpen,
        updateOnlineStatus: updateOnlineStatus,
        updateMobileStatus: updateMobileStatus,
        trackPerformance: trackPerformance,
        trackError: trackError,
        updateLastSync: updateLastSync,
        initializeApp: initializeApp,
        cleanup: cleanup,
        resetApp: resetApp,
        showSuccessMessage: showSuccessMessage,
        showErrorMessage: showErrorMessage,
        showWarningMessage: showWarningMessage,
        showInfoMessage: showInfoMessage
    };
});
//# sourceMappingURL=app.js.map