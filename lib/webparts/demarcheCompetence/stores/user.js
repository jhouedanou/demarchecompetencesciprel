// Initial state
const initialState = () => ({
    loading: false,
    error: null,
    currentUser: null,
    isAuthenticated: false,
    isUserLoaded: false,
    userProgress: [],
    competenceAreas: [],
    userStatistics: null,
    userPreferences: {
        emailNotifications: true,
        weeklyDigest: false,
        reminderEnabled: true,
        preferredDifficulty: 'beginner',
        autoSave: true
    },
    userService: null
});
// Mutations
const mutations = {
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_CURRENT_USER(state, user) {
        state.currentUser = user;
        state.isAuthenticated = user !== null;
        state.isUserLoaded = true;
    },
    SET_USER_PROGRESS(state, progress) {
        state.userProgress = progress;
    },
    ADD_USER_PROGRESS(state, progress) {
        const existingIndex = state.userProgress.findIndex(p => p.competenceId === progress.competenceId);
        if (existingIndex > -1) {
            state.userProgress.splice(existingIndex, 1, progress);
        }
        else {
            state.userProgress.push(progress);
        }
    },
    SET_COMPETENCE_AREAS(state, areas) {
        state.competenceAreas = areas;
    },
    SET_USER_STATISTICS(state, statistics) {
        state.userStatistics = statistics;
    },
    SET_USER_PREFERENCES(state, preferences) {
        state.userPreferences = Object.assign(Object.assign({}, state.userPreferences), preferences);
    },
    SET_USER_SERVICE(state, service) {
        state.userService = service;
    },
    CLEAR_ALL_DATA(state) {
        Object.assign(state, initialState());
    }
};
// Actions
const actions = {
    async initializeUser({ commit, state }) {
        if (!state.userService) {
            throw new Error('User service not initialized');
        }
        commit('SET_LOADING', true);
        try {
            // Load current user
            const user = await state.userService.getCurrentUser();
            commit('SET_CURRENT_USER', user);
            if (user) {
                // Load user data in parallel
                const [progress, areas, statistics] = await Promise.all([
                    state.userService.getUserProgress(user.id),
                    state.userService.getCompetenceAreas(),
                    state.userService.getUserStatistics(user.id)
                ]);
                commit('SET_USER_PROGRESS', progress);
                commit('SET_COMPETENCE_AREAS', areas);
                commit('SET_USER_STATISTICS', statistics);
            }
            commit('SET_ERROR', null);
        }
        catch (error) {
            console.error('User initialization error:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de l\'initialisation utilisateur');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    async refreshUserData({ commit, state }) {
        if (!state.userService || !state.currentUser) {
            throw new Error('User service not initialized or user not loaded');
        }
        commit('SET_LOADING', true);
        try {
            const [progress, statistics] = await Promise.all([
                state.userService.getUserProgress(state.currentUser.id),
                state.userService.getUserStatistics(state.currentUser.id)
            ]);
            commit('SET_USER_PROGRESS', progress);
            commit('SET_USER_STATISTICS', statistics);
            commit('SET_ERROR', null);
        }
        catch (error) {
            console.error('User data refresh error:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de l\'actualisation des données');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    async updateUserProgress({ commit, state }, progress) {
        if (!state.userService) {
            throw new Error('User service not initialized');
        }
        try {
            const savedProgress = await state.userService.saveUserProgress(progress);
            commit('ADD_USER_PROGRESS', savedProgress);
            return savedProgress;
        }
        catch (error) {
            console.error('Error updating user progress:', error);
            throw error;
        }
    },
    async updateUserPreferences({ commit, state }, preferences) {
        if (!state.userService || !state.currentUser) {
            throw new Error('User service not initialized or user not loaded');
        }
        try {
            await state.userService.updateUserPreferences(state.currentUser.id, preferences);
            commit('SET_USER_PREFERENCES', preferences);
        }
        catch (error) {
            console.error('Error updating user preferences:', error);
            throw error;
        }
    },
    setUserService({ commit }, service) {
        commit('SET_USER_SERVICE', service);
    },
    clearAllData({ commit }) {
        commit('CLEAR_ALL_DATA');
    }
};
// Getters
const getters = {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    isAuthenticated: (state) => state.isAuthenticated,
    isUserLoaded: (state) => state.isUserLoaded,
    currentUser: (state) => state.currentUser,
    userDisplayName: (state) => { var _a; return ((_a = state.currentUser) === null || _a === void 0 ? void 0 : _a.displayName) || 'Utilisateur'; },
    userEmail: (state) => { var _a; return ((_a = state.currentUser) === null || _a === void 0 ? void 0 : _a.email) || ''; },
    // Progress getters
    overallProgress: (state) => {
        if (state.userProgress.length === 0)
            return 0;
        const totalProgress = state.userProgress.reduce((sum, p) => sum + p.progressPercentage, 0);
        return Math.round(totalProgress / state.userProgress.length);
    },
    competenceProgress: (state) => (competenceId) => {
        return state.userProgress.find(p => p.competenceId === competenceId);
    },
    completedCompetences: (state) => {
        return state.userProgress.filter(p => p.progressPercentage >= 100);
    },
    inProgressCompetences: (state) => {
        return state.userProgress.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100);
    },
    // Statistics getters
    totalQuizzesTaken: (state) => { var _a; return ((_a = state.userStatistics) === null || _a === void 0 ? void 0 : _a.totalQuizzesTaken) || 0; },
    averageScore: (state) => { var _a; return ((_a = state.userStatistics) === null || _a === void 0 ? void 0 : _a.averageQuizScore) || 0; },
    timeSpentLearning: (state) => { var _a; return ((_a = state.userStatistics) === null || _a === void 0 ? void 0 : _a.timeSpentLearning) || 0; },
    lastActivityDate: (state) => { var _a; return (_a = state.userStatistics) === null || _a === void 0 ? void 0 : _a.lastActivityDate; },
    // Preference getters
    userPreferences: (state) => state.userPreferences,
    hasEmailNotificationsEnabled: (state) => state.userPreferences.emailNotifications,
    isAutoSaveEnabled: (state) => state.userPreferences.autoSave
};
export const userModule = {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
// UserState interface is exported above
//# sourceMappingURL=user.js.map