// Initial state
const initialState = () => ({
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
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    SET_INITIALIZED(state, initialized) {
        state.initialized = initialized;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_CURRENT_VIEW(state, view) {
        if (state.currentView !== view) {
            state.previousView = state.currentView;
            state.navigationHistory.push(state.currentView);
            state.currentView = view;
        }
    },
    CLEAR_NAVIGATION_HISTORY(state) {
        state.navigationHistory = [];
        state.previousView = null;
    },
    SET_SETTINGS(state, settings) {
        state.settings = Object.assign(Object.assign({}, state.settings), settings);
    },
    ADD_NOTIFICATION(state, notification) {
        state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, notificationId) {
        const index = state.notifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            state.notifications.splice(index, 1);
        }
    },
    CLEAR_ALL_NOTIFICATIONS(state) {
        state.notifications = [];
    },
    SET_SIDEBAR_OPEN(state, open) {
        state.sidebarOpen = open;
    },
    TOGGLE_SIDEBAR(state) {
        state.sidebarOpen = !state.sidebarOpen;
    },
    TRACK_PERFORMANCE(state, { operation, duration }) {
        if (!state.performance.operations[operation]) {
            state.performance.operations[operation] = [];
        }
        state.performance.operations[operation].push(duration);
    },
    TRACK_ERROR(state, operation) {
        if (!state.performance.errors[operation]) {
            state.performance.errors[operation] = 0;
        }
        state.performance.errors[operation]++;
    },
    UPDATE_LAST_SYNC(state) {
        state.performance.lastSync = new Date();
    },
    SET_SERVICES(state, services) {
        state.services = Object.assign(Object.assign({}, state.services), services);
    },
    RESET_APP(state) {
        Object.assign(state, initialState());
    }
};
// Actions
const actions = {
    async initializeApp({ commit }) {
        commit('SET_LOADING', true);
        try {
            // Initialize app logic here
            commit('SET_INITIALIZED', true);
            commit('SET_ERROR', null);
        }
        catch (error) {
            console.error('App initialization error:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur d\'initialisation');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    setLoading({ commit }, loading) {
        commit('SET_LOADING', loading);
    },
    setError({ commit }, error) {
        commit('SET_ERROR', error);
    },
    navigateTo({ commit }, view) {
        commit('SET_CURRENT_VIEW', view);
    },
    goBack({ state, commit }) {
        if (state.previousView) {
            const previous = state.previousView;
            commit('SET_CURRENT_VIEW', previous);
        }
    },
    showNotification({ commit }, notification) {
        const fullNotification = Object.assign(Object.assign({}, notification), { id: `notification-${Date.now()}-${Math.random()}`, timestamp: new Date() });
        commit('ADD_NOTIFICATION', fullNotification);
        // Auto-remove notification after duration
        if (!notification.persistent && notification.duration !== 0) {
            const duration = notification.duration || 5000;
            setTimeout(() => {
                commit('REMOVE_NOTIFICATION', fullNotification.id);
            }, duration);
        }
    },
    showSuccessMessage({ dispatch }, message, title = 'Succès') {
        dispatch('showNotification', {
            type: 'success',
            title,
            message,
            duration: 3000
        });
    },
    showErrorMessage({ dispatch }, { message, title = 'Erreur' }) {
        dispatch('showNotification', {
            type: 'error',
            title,
            message,
            duration: 8000
        });
    },
    showWarningMessage({ dispatch }, message, title = 'Attention') {
        dispatch('showNotification', {
            type: 'warning',
            title,
            message,
            duration: 5000
        });
    },
    showInfoMessage({ dispatch }, message, title = 'Information') {
        dispatch('showNotification', {
            type: 'info',
            title,
            message,
            duration: 4000
        });
    },
    removeNotification({ commit }, notificationId) {
        commit('REMOVE_NOTIFICATION', notificationId);
    },
    clearAllNotifications({ commit }) {
        commit('CLEAR_ALL_NOTIFICATIONS');
    },
    updateSettings({ commit }, settings) {
        commit('SET_SETTINGS', settings);
    },
    toggleSidebar({ commit }) {
        commit('TOGGLE_SIDEBAR');
    },
    setSidebarOpen({ commit }, open) {
        commit('SET_SIDEBAR_OPEN', open);
    },
    trackPerformance({ commit }, { operation, duration }) {
        commit('TRACK_PERFORMANCE', { operation, duration });
    },
    trackError({ commit }, operation) {
        commit('TRACK_ERROR', operation);
    },
    updateLastSync({ commit }) {
        commit('UPDATE_LAST_SYNC');
    },
    setServices({ commit }, services) {
        commit('SET_SERVICES', services);
    },
    resetApp({ commit }) {
        commit('RESET_APP');
    }
};
// Getters
const getters = {
    isLoading: (state) => state.loading,
    isInitialized: (state) => state.initialized,
    hasError: (state) => state.error !== null,
    currentView: (state) => state.currentView,
    canGoBack: (state) => state.previousView !== null,
    activeNotifications: (state) => state.notifications,
    notificationCount: (state) => state.notifications.length,
    isSidebarOpen: (state) => state.sidebarOpen,
    currentTheme: (state) => state.settings.theme,
    isCompactMode: (state) => state.settings.compactMode,
    averagePerformance: (state) => (operation) => {
        const operations = state.performance.operations[operation];
        if (!operations || operations.length === 0)
            return 0;
        return operations.reduce((sum, duration) => sum + duration, 0) / operations.length;
    },
    errorCount: (state) => (operation) => state.performance.errors[operation] || 0,
    lastSyncTime: (state) => state.performance.lastSync
};
export const appModule = {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
// AppState interface is exported above
//# sourceMappingURL=app.js.map