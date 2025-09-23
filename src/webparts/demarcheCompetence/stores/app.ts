import { Module } from 'vuex';

export type AppTheme = 'light' | 'dark' | 'auto';
export type AppLanguage = 'fr' | 'en';
export type AppView = 'dashboard' | 'quiz-introduction' | 'quiz-sondage' | 'progress' | 'competences' | 'results' | 'settings';

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
  autoSaveInterval: number; // in seconds
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
    operations: { [key: string]: number[] };
    errors: { [key: string]: number };
    averageLoadTime: number;
    lastSync: Date | null;
  };
  services: {
    sharePointService?: any;
    quizService?: any;
    userService?: any;
  };
}

// Initial state
const initialState = (): AppState => ({
  loading: false,
  initialized: false,
  error: null,
  currentView: 'dashboard',
  previousView: null,
  navigationHistory: [],
  settings: {
    theme: 'auto',
    language: 'fr',
    autoSaveInterval: 30,
    showNotifications: true,
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false
  },
  notifications: [],
  sidebarOpen: false,
  performance: {
    operations: {},
    errors: {},
    averageLoadTime: 0,
    lastSync: null
  },
  services: {}
});

// Mutations
const mutations = {
  SET_LOADING(state: AppState, loading: boolean) {
    state.loading = loading;
  },

  SET_INITIALIZED(state: AppState, initialized: boolean) {
    state.initialized = initialized;
  },

  SET_ERROR(state: AppState, error: string | null) {
    state.error = error;
  },

  SET_CURRENT_VIEW(state: AppState, view: AppView) {
    if (state.currentView !== view) {
      state.previousView = state.currentView;
      state.navigationHistory.push(state.currentView);
      state.currentView = view;
    }
  },

  CLEAR_NAVIGATION_HISTORY(state: AppState) {
    state.navigationHistory = [];
    state.previousView = null;
  },

  SET_SETTINGS(state: AppState, settings: Partial<AppSettings>) {
    state.settings = { ...state.settings, ...settings };
  },

  ADD_NOTIFICATION(state: AppState, notification: AppNotification) {
    state.notifications.push(notification);
  },

  REMOVE_NOTIFICATION(state: AppState, notificationId: string) {
    const index = state.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      state.notifications.splice(index, 1);
    }
  },

  CLEAR_ALL_NOTIFICATIONS(state: AppState) {
    state.notifications = [];
  },

  SET_SIDEBAR_OPEN(state: AppState, open: boolean) {
    state.sidebarOpen = open;
  },

  TOGGLE_SIDEBAR(state: AppState) {
    state.sidebarOpen = !state.sidebarOpen;
  },

  TRACK_PERFORMANCE(state: AppState, { operation, duration }: { operation: string; duration: number }) {
    if (!state.performance.operations[operation]) {
      state.performance.operations[operation] = [];
    }
    state.performance.operations[operation].push(duration);
  },

  TRACK_ERROR(state: AppState, operation: string) {
    if (!state.performance.errors[operation]) {
      state.performance.errors[operation] = 0;
    }
    state.performance.errors[operation]++;
  },

  UPDATE_LAST_SYNC(state: AppState) {
    state.performance.lastSync = new Date();
  },

  SET_SERVICES(state: AppState, services: any) {
    state.services = { ...state.services, ...services };
  },

  RESET_APP(state: AppState) {
    Object.assign(state, initialState());
  }
};

// Actions
const actions = {
  async initializeApp({ commit }: any) {
    commit('SET_LOADING', true);
    try {
      // Initialize app logic here
      commit('SET_INITIALIZED', true);
      commit('SET_ERROR', null);
    } catch (error) {
      console.error('App initialization error:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur d\'initialisation');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  setLoading({ commit }: any, loading: boolean) {
    commit('SET_LOADING', loading);
  },

  setError({ commit }: any, error: string | null) {
    commit('SET_ERROR', error);
  },

  navigateTo({ commit }: any, view: AppView) {
    commit('SET_CURRENT_VIEW', view);
  },

  goBack({ state, commit }: any) {
    if (state.previousView) {
      const previous = state.previousView;
      commit('SET_CURRENT_VIEW', previous);
    }
  },

  showNotification({ commit }: any, notification: Omit<AppNotification, 'id' | 'timestamp'>) {
    const fullNotification: AppNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };

    commit('ADD_NOTIFICATION', fullNotification);

    // Auto-remove notification after duration
    if (!notification.persistent && notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', fullNotification.id);
      }, duration);
    }
  },

  showSuccessMessage({ dispatch }: any, message: string, title: string = 'Succès') {
    dispatch('showNotification', {
      type: 'success',
      title,
      message,
      duration: 3000
    });
  },

  showErrorMessage({ dispatch }: any, { message, title = 'Erreur' }: { message: string; title?: string }) {
    dispatch('showNotification', {
      type: 'error',
      title,
      message,
      duration: 8000
    });
  },

  showWarningMessage({ dispatch }: any, message: string, title: string = 'Attention') {
    dispatch('showNotification', {
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  },

  showInfoMessage({ dispatch }: any, message: string, title: string = 'Information') {
    dispatch('showNotification', {
      type: 'info',
      title,
      message,
      duration: 4000
    });
  },

  removeNotification({ commit }: any, notificationId: string) {
    commit('REMOVE_NOTIFICATION', notificationId);
  },

  clearAllNotifications({ commit }: any) {
    commit('CLEAR_ALL_NOTIFICATIONS');
  },

  updateSettings({ commit }: any, settings: Partial<AppSettings>) {
    commit('SET_SETTINGS', settings);
  },

  toggleSidebar({ commit }: any) {
    commit('TOGGLE_SIDEBAR');
  },

  setSidebarOpen({ commit }: any, open: boolean) {
    commit('SET_SIDEBAR_OPEN', open);
  },

  trackPerformance({ commit }: any, { operation, duration }: { operation: string; duration: number }) {
    commit('TRACK_PERFORMANCE', { operation, duration });
  },

  trackError({ commit }: any, operation: string) {
    commit('TRACK_ERROR', operation);
  },

  updateLastSync({ commit }: any) {
    commit('UPDATE_LAST_SYNC');
  },

  setServices({ commit }: any, services: any) {
    commit('SET_SERVICES', services);
  },

  resetApp({ commit }: any) {
    commit('RESET_APP');
  }
};

// Getters
const getters = {
  isLoading: (state: AppState) => state.loading,
  isInitialized: (state: AppState) => state.initialized,
  hasError: (state: AppState) => state.error !== null,
  currentView: (state: AppState) => state.currentView,
  canGoBack: (state: AppState) => state.previousView !== null,
  activeNotifications: (state: AppState) => state.notifications,
  notificationCount: (state: AppState) => state.notifications.length,
  isSidebarOpen: (state: AppState) => state.sidebarOpen,
  currentTheme: (state: AppState) => state.settings.theme,
  isCompactMode: (state: AppState) => state.settings.compactMode,
  averagePerformance: (state: AppState) => (operation: string) => {
    const operations = state.performance.operations[operation];
    if (!operations || operations.length === 0) return 0;
    return operations.reduce((sum, duration) => sum + duration, 0) / operations.length;
  },
  errorCount: (state: AppState) => (operation: string) => state.performance.errors[operation] || 0,
  lastSyncTime: (state: AppState) => state.performance.lastSync
};

export const appModule: Module<AppState, any> = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
  getters
};

// AppState interface is exported above