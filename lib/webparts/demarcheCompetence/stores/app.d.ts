import { Module } from 'vuex';
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
export interface AppState {
    loading: boolean;
    initialized: boolean;
    error: string | null;
    currentView: AppView;
    previousView: AppView | null;
    navigationHistory: AppView[];
    settings: AppSettings;
    notifications: AppNotification[];
    sidebarOpen: boolean;
    performance: {
        operations: {
            [key: string]: number[];
        };
        errors: {
            [key: string]: number;
        };
        averageLoadTime: number;
        lastSync: Date | null;
    };
    services: {
        sharePointService?: any;
        quizService?: any;
        userService?: any;
    };
}
export declare const appModule: Module<AppState, any>;
//# sourceMappingURL=app.d.ts.map