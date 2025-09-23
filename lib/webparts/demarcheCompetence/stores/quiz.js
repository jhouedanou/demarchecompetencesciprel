// Initial state
const initialState = () => ({
    loading: false,
    error: null,
    introductionQuestions: [],
    sondageQuestions: [],
    currentQuizType: null,
    currentQuestionIndex: 0,
    quizStartTime: null,
    quizInProgress: false,
    currentResponses: [],
    userResults: [],
    quizStatistics: {
        totalParticipants: 0,
        averageScore: 0,
        completionRate: 0,
        averageTimeToComplete: 0
    },
    quizSettings: {
        timeLimit: 0,
        allowReview: true,
        randomizeQuestions: false,
        randomizeAnswers: false,
        showResultsImmediately: true,
        requireAllAnswers: true
    },
    autoSaveEnabled: true,
    lastAutoSave: null,
    quizService: null
});
// Mutations
const mutations = {
    SET_LOADING(state, loading) {
        state.loading = loading;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_INTRODUCTION_QUESTIONS(state, questions) {
        state.introductionQuestions = questions;
    },
    SET_SONDAGE_QUESTIONS(state, questions) {
        state.sondageQuestions = questions;
    },
    START_QUIZ(state, quizType) {
        state.currentQuizType = quizType;
        state.quizInProgress = true;
        state.quizStartTime = new Date();
        state.currentQuestionIndex = 0;
        state.currentResponses = [];
    },
    END_QUIZ(state) {
        state.currentQuizType = null;
        state.quizInProgress = false;
        state.quizStartTime = null;
        state.currentQuestionIndex = 0;
        state.currentResponses = [];
    },
    SET_CURRENT_QUESTION_INDEX(state, index) {
        state.currentQuestionIndex = index;
    },
    ADD_RESPONSE(state, response) {
        const existingIndex = state.currentResponses.findIndex(r => r.questionId === response.questionId);
        if (existingIndex > -1) {
            state.currentResponses.splice(existingIndex, 1, response);
        }
        else {
            state.currentResponses.push(response);
        }
    },
    SET_USER_RESULTS(state, results) {
        state.userResults = results;
    },
    ADD_USER_RESULT(state, result) {
        state.userResults.push(result);
    },
    SET_QUIZ_STATISTICS(state, statistics) {
        state.quizStatistics = statistics;
    },
    SET_QUIZ_SETTINGS(state, settings) {
        state.quizSettings = Object.assign(Object.assign({}, state.quizSettings), settings);
    },
    SET_AUTO_SAVE_ENABLED(state, enabled) {
        state.autoSaveEnabled = enabled;
    },
    UPDATE_LAST_AUTO_SAVE(state) {
        state.lastAutoSave = new Date();
    },
    SET_QUIZ_SERVICE(state, service) {
        state.quizService = service;
    },
    CLEAR_ALL_DATA(state) {
        Object.assign(state, initialState());
    }
};
// Actions
const actions = {
    async loadIntroductionQuestions({ commit, state }) {
        if (!state.quizService) {
            throw new Error('Quiz service not initialized');
        }
        commit('SET_LOADING', true);
        try {
            const questions = await state.quizService.getIntroductionQuestions();
            commit('SET_INTRODUCTION_QUESTIONS', questions);
            commit('SET_ERROR', null);
            return questions;
        }
        catch (error) {
            console.error('Error loading introduction questions:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors du chargement des questions');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    async loadSondageQuestions({ commit, state }) {
        if (!state.quizService) {
            throw new Error('Quiz service not initialized');
        }
        commit('SET_LOADING', true);
        try {
            const questions = await state.quizService.getSondageQuestions();
            commit('SET_SONDAGE_QUESTIONS', questions);
            commit('SET_ERROR', null);
            return questions;
        }
        catch (error) {
            console.error('Error loading sondage questions:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors du chargement des questions');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    async loadUserResults({ commit, state }, userId) {
        if (!state.quizService) {
            throw new Error('Quiz service not initialized');
        }
        try {
            const results = await state.quizService.getUserResults(userId);
            commit('SET_USER_RESULTS', results);
            return results;
        }
        catch (error) {
            console.error('Error loading user results:', error);
            throw error;
        }
    },
    startQuiz({ commit, dispatch }, quizType) {
        commit('START_QUIZ', quizType);
        // Load questions if not already loaded
        if (quizType === 'Introduction') {
            dispatch('loadIntroductionQuestions');
        }
        else {
            dispatch('loadSondageQuestions');
        }
    },
    endQuiz({ commit }) {
        commit('END_QUIZ');
    },
    nextQuestion({ commit, state, getters }) {
        if (getters.canGoNext) {
            commit('SET_CURRENT_QUESTION_INDEX', state.currentQuestionIndex + 1);
        }
    },
    previousQuestion({ commit, state, getters }) {
        if (getters.canGoPrevious) {
            commit('SET_CURRENT_QUESTION_INDEX', state.currentQuestionIndex - 1);
        }
    },
    goToQuestion({ commit, getters }, index) {
        if (index >= 0 && index < getters.totalQuestions) {
            commit('SET_CURRENT_QUESTION_INDEX', index);
        }
    },
    addResponse({ commit, dispatch }, response) {
        commit('ADD_RESPONSE', response);
        // Auto-save if enabled
        dispatch('autoSave');
    },
    async submitQuiz({ commit, state, dispatch }) {
        if (!state.quizService) {
            throw new Error('Quiz service not initialized');
        }
        commit('SET_LOADING', true);
        try {
            const result = await state.quizService.submitQuizResponse({
                quizType: state.currentQuizType,
                responses: state.currentResponses,
                startTime: state.quizStartTime,
                endTime: new Date()
            });
            commit('ADD_USER_RESULT', result);
            commit('END_QUIZ');
            return result;
        }
        catch (error) {
            console.error('Error submitting quiz:', error);
            commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de la soumission');
            throw error;
        }
        finally {
            commit('SET_LOADING', false);
        }
    },
    async autoSave({ state, commit }) {
        if (!state.autoSaveEnabled || !state.quizInProgress || !state.quizService) {
            return;
        }
        try {
            await state.quizService.saveQuizProgress({
                quizType: state.currentQuizType,
                currentIndex: state.currentQuestionIndex,
                responses: state.currentResponses,
                startTime: state.quizStartTime
            });
            commit('UPDATE_LAST_AUTO_SAVE');
        }
        catch (error) {
            console.error('Auto-save error:', error);
            // Don't throw error for auto-save failures
        }
    },
    setQuizService({ commit }, service) {
        commit('SET_QUIZ_SERVICE', service);
    },
    clearAllData({ commit }) {
        commit('CLEAR_ALL_DATA');
    }
};
// Getters
const getters = {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    // Question getters
    hasIntroductionQuestions: (state) => state.introductionQuestions.length > 0,
    hasSondageQuestions: (state) => state.sondageQuestions.length > 0,
    currentQuestions: (state) => {
        return state.currentQuizType === 'Introduction'
            ? state.introductionQuestions
            : state.sondageQuestions;
    },
    currentQuestion: (state, getters) => {
        const questions = getters.currentQuestions;
        return questions[state.currentQuestionIndex] || null;
    },
    totalQuestions: (state, getters) => {
        return getters.currentQuestions.length;
    },
    // Navigation getters
    canGoPrevious: (state) => state.currentQuestionIndex > 0,
    canGoNext: (state, getters) => state.currentQuestionIndex < getters.totalQuestions - 1,
    isLastQuestion: (state, getters) => state.currentQuestionIndex === getters.totalQuestions - 1,
    // Progress getters
    progressPercentage: (state, getters) => {
        if (getters.totalQuestions === 0)
            return 0;
        return Math.round((state.currentQuestionIndex + 1) / getters.totalQuestions * 100);
    },
    answeredQuestions: (state) => {
        return state.currentResponses.length;
    },
    // Response getters
    getResponseForQuestion: (state) => (questionId) => {
        return state.currentResponses.find(r => r.questionId === questionId);
    },
    hasResponseForCurrentQuestion: (state, getters) => {
        const currentQuestion = getters.currentQuestion;
        return currentQuestion ? state.currentResponses.some(r => r.questionId === currentQuestion.id) : false;
    },
    // Results getters
    latestResult: (state) => {
        if (state.userResults.length === 0)
            return null;
        return state.userResults.reduce((latest, current) => current.completedAt > latest.completedAt ? current : latest);
    },
    resultsByType: (state) => (type) => {
        return state.userResults.filter(r => r.quizType === type);
    },
    averageScore: (state) => {
        if (state.userResults.length === 0)
            return 0;
        const totalScore = state.userResults.reduce((sum, result) => sum + result.score, 0);
        return Math.round(totalScore / state.userResults.length);
    },
    // Time getters
    timeElapsed: (state) => {
        if (!state.quizStartTime)
            return 0;
        return Math.floor((Date.now() - state.quizStartTime.getTime()) / 1000);
    },
    timeRemaining: (state, getters) => {
        if (state.quizSettings.timeLimit === 0)
            return null;
        const timeLimit = state.quizSettings.timeLimit * 60; // Convert to seconds
        return Math.max(0, timeLimit - getters.timeElapsed);
    }
};
export const quizModule = {
    namespaced: true,
    state: initialState,
    mutations,
    actions,
    getters
};
// QuizState interface is exported above
//# sourceMappingURL=quiz.js.map