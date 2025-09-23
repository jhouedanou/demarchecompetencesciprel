export declare type AppTheme = 'light' | 'dark' | 'auto';
export declare type AppLanguage = 'fr' | 'en';
export declare type AppView = 'dashboard' | 'quiz-introduction' | 'quiz-sondage' | 'progress' | 'competences' | 'results' | 'settings';
export interface AppNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    persistent?: boolean;
    timestamp: Date;
}
export interface AppSettings {
    theme: AppTheme;
    language: AppLanguage;
    autoSaveInterval: number;
    showNotifications: boolean;
    soundEnabled: boolean;
    animationsEnabled: boolean;
    compactMode: boolean;
}
export declare const useAppStore: import("pinia").StoreDefinition<"app", Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    initialized: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentView: import("vue").Ref<AppView, AppView>;
    previousView: import("vue").Ref<AppView | null, AppView | null>;
    navigationHistory: import("vue").Ref<AppView[], AppView[]>;
    settings: import("vue").Ref<{
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }, AppSettings | {
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }>;
    notifications: import("vue").Ref<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[], AppNotification[] | {
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    isOnline: import("vue").Ref<boolean, boolean>;
    isMobile: import("vue").Ref<boolean, boolean>;
    sidebarOpen: import("vue").Ref<boolean, boolean>;
    performanceMetrics: import("vue").Ref<{
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }, {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    } | {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }>;
    hasNotifications: import("vue").ComputedRef<boolean>;
    unreadNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    errorNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    currentTheme: import("vue").ComputedRef<"light" | "dark">;
    isOffline: import("vue").ComputedRef<boolean>;
    canGoBack: import("vue").ComputedRef<boolean>;
    setLoading: (value: boolean) => void;
    setInitialized: (value: boolean) => void;
    setError: (message: string | null) => void;
    clearError: () => void;
    navigateTo: (view: AppView, addToHistory?: boolean) => void;
    goBack: () => void;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    clearNonPersistentNotifications: () => void;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    loadSettingsFromStorage: () => void;
    saveSettingsToStorage: () => void;
    applyTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    updateOnlineStatus: () => void;
    updateMobileStatus: () => void;
    trackPerformance: (operation: string, duration: number) => void;
    trackError: (operation: string) => void;
    updateLastSync: () => void;
    initializeApp: () => Promise<void>;
    cleanup: () => void;
    resetApp: () => void;
    showSuccessMessage: (message: string, title?: string) => void;
    showErrorMessage: (message: string, title?: string) => void;
    showWarningMessage: (message: string, title?: string) => void;
    showInfoMessage: (message: string, title?: string) => void;
}, "settings" | "error" | "loading" | "initialized" | "currentView" | "previousView" | "navigationHistory" | "notifications" | "isOnline" | "isMobile" | "sidebarOpen" | "performanceMetrics">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    initialized: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentView: import("vue").Ref<AppView, AppView>;
    previousView: import("vue").Ref<AppView | null, AppView | null>;
    navigationHistory: import("vue").Ref<AppView[], AppView[]>;
    settings: import("vue").Ref<{
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }, AppSettings | {
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }>;
    notifications: import("vue").Ref<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[], AppNotification[] | {
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    isOnline: import("vue").Ref<boolean, boolean>;
    isMobile: import("vue").Ref<boolean, boolean>;
    sidebarOpen: import("vue").Ref<boolean, boolean>;
    performanceMetrics: import("vue").Ref<{
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }, {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    } | {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }>;
    hasNotifications: import("vue").ComputedRef<boolean>;
    unreadNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    errorNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    currentTheme: import("vue").ComputedRef<"light" | "dark">;
    isOffline: import("vue").ComputedRef<boolean>;
    canGoBack: import("vue").ComputedRef<boolean>;
    setLoading: (value: boolean) => void;
    setInitialized: (value: boolean) => void;
    setError: (message: string | null) => void;
    clearError: () => void;
    navigateTo: (view: AppView, addToHistory?: boolean) => void;
    goBack: () => void;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    clearNonPersistentNotifications: () => void;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    loadSettingsFromStorage: () => void;
    saveSettingsToStorage: () => void;
    applyTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    updateOnlineStatus: () => void;
    updateMobileStatus: () => void;
    trackPerformance: (operation: string, duration: number) => void;
    trackError: (operation: string) => void;
    updateLastSync: () => void;
    initializeApp: () => Promise<void>;
    cleanup: () => void;
    resetApp: () => void;
    showSuccessMessage: (message: string, title?: string) => void;
    showErrorMessage: (message: string, title?: string) => void;
    showWarningMessage: (message: string, title?: string) => void;
    showInfoMessage: (message: string, title?: string) => void;
}, "hasNotifications" | "unreadNotifications" | "errorNotifications" | "currentTheme" | "isOffline" | "canGoBack">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    initialized: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentView: import("vue").Ref<AppView, AppView>;
    previousView: import("vue").Ref<AppView | null, AppView | null>;
    navigationHistory: import("vue").Ref<AppView[], AppView[]>;
    settings: import("vue").Ref<{
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }, AppSettings | {
        theme: AppTheme;
        language: AppLanguage;
        autoSaveInterval: number;
        showNotifications: boolean;
        soundEnabled: boolean;
        animationsEnabled: boolean;
        compactMode: boolean;
    }>;
    notifications: import("vue").Ref<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[], AppNotification[] | {
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    isOnline: import("vue").Ref<boolean, boolean>;
    isMobile: import("vue").Ref<boolean, boolean>;
    sidebarOpen: import("vue").Ref<boolean, boolean>;
    performanceMetrics: import("vue").Ref<{
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }, {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    } | {
        loadTimes: {
            [key: string]: number;
        };
        errorCounts: {
            [key: string]: number;
        };
        lastSync: Date | null;
    }>;
    hasNotifications: import("vue").ComputedRef<boolean>;
    unreadNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    errorNotifications: import("vue").ComputedRef<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        duration?: number | undefined;
        persistent?: boolean | undefined;
        timestamp: Date;
    }[]>;
    currentTheme: import("vue").ComputedRef<"light" | "dark">;
    isOffline: import("vue").ComputedRef<boolean>;
    canGoBack: import("vue").ComputedRef<boolean>;
    setLoading: (value: boolean) => void;
    setInitialized: (value: boolean) => void;
    setError: (message: string | null) => void;
    clearError: () => void;
    navigateTo: (view: AppView, addToHistory?: boolean) => void;
    goBack: () => void;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    clearNonPersistentNotifications: () => void;
    updateSettings: (newSettings: Partial<AppSettings>) => void;
    loadSettingsFromStorage: () => void;
    saveSettingsToStorage: () => void;
    applyTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    updateOnlineStatus: () => void;
    updateMobileStatus: () => void;
    trackPerformance: (operation: string, duration: number) => void;
    trackError: (operation: string) => void;
    updateLastSync: () => void;
    initializeApp: () => Promise<void>;
    cleanup: () => void;
    resetApp: () => void;
    showSuccessMessage: (message: string, title?: string) => void;
    showErrorMessage: (message: string, title?: string) => void;
    showWarningMessage: (message: string, title?: string) => void;
    showInfoMessage: (message: string, title?: string) => void;
}, "setLoading" | "setInitialized" | "setError" | "clearError" | "navigateTo" | "goBack" | "addNotification" | "removeNotification" | "clearNotifications" | "clearNonPersistentNotifications" | "updateSettings" | "loadSettingsFromStorage" | "saveSettingsToStorage" | "applyTheme" | "toggleSidebar" | "setSidebarOpen" | "updateOnlineStatus" | "updateMobileStatus" | "trackPerformance" | "trackError" | "updateLastSync" | "initializeApp" | "cleanup" | "resetApp" | "showSuccessMessage" | "showErrorMessage" | "showWarningMessage" | "showInfoMessage">>;
//# sourceMappingURL=app.d.ts.map