import { Module } from 'vuex';
import type {
  QuizQuestion,
  QuizResponse
} from '../types/index';
import { QuizResult } from './types';
import { QuizService } from '@services/QuizService';

export interface QuizState {
  loading: boolean;
  error: string | null;
  
  // Quiz Questions
  introductionQuestions: QuizQuestion[];
  sondageQuestions: QuizQuestion[];
  
  // Current Quiz State
  currentQuizType: 'Introduction' | 'Sondage' | null;
  currentQuestionIndex: number;
  quizStartTime: Date | null;
  quizInProgress: boolean;
  currentResponses: QuizResponse[];
  
  // Results
  userResults: QuizResult[];
  quizStatistics: {
    totalParticipants: number;
    averageScore: number;
    completionRate: number;
    averageTimeToComplete: number;
  };
  
  // Quiz Settings
  quizSettings: {
    timeLimit: number; // in minutes, 0 = no limit
    allowReview: boolean;
    randomizeQuestions: boolean;
    randomizeAnswers: boolean;
    showResultsImmediately: boolean;
    requireAllAnswers: boolean;
  };
  
  // Auto-save
  autoSaveEnabled: boolean;
  lastAutoSave: Date | null;
  
  // Service
  quizService: QuizService | null;
}

// Initial state
const initialState = (): QuizState => ({
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
  SET_LOADING(state: QuizState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: QuizState, error: string | null) {
    state.error = error;
  },

  SET_INTRODUCTION_QUESTIONS(state: QuizState, questions: QuizQuestion[]) {
    state.introductionQuestions = questions;
  },

  SET_SONDAGE_QUESTIONS(state: QuizState, questions: QuizQuestion[]) {
    state.sondageQuestions = questions;
  },

  START_QUIZ(state: QuizState, quizType: 'Introduction' | 'Sondage') {
    state.currentQuizType = quizType;
    state.quizInProgress = true;
    state.quizStartTime = new Date();
    state.currentQuestionIndex = 0;
    state.currentResponses = [];
  },

  END_QUIZ(state: QuizState) {
    state.currentQuizType = null;
    state.quizInProgress = false;
    state.quizStartTime = null;
    state.currentQuestionIndex = 0;
    state.currentResponses = [];
  },

  SET_CURRENT_QUESTION_INDEX(state: QuizState, index: number) {
    state.currentQuestionIndex = index;
  },

  ADD_RESPONSE(state: QuizState, response: QuizResponse) {
    const existingIndex = state.currentResponses.findIndex(r => r.questionId === response.questionId);
    if (existingIndex > -1) {
      state.currentResponses.splice(existingIndex, 1, response);
    } else {
      state.currentResponses.push(response);
    }
  },

  SET_USER_RESULTS(state: QuizState, results: QuizResult[]) {
    state.userResults = results;
  },

  ADD_USER_RESULT(state: QuizState, result: QuizResult) {
    state.userResults.push(result);
  },

  SET_QUIZ_STATISTICS(state: QuizState, statistics: QuizState['quizStatistics']) {
    state.quizStatistics = statistics;
  },

  SET_QUIZ_SETTINGS(state: QuizState, settings: Partial<QuizState['quizSettings']>) {
    state.quizSettings = { ...state.quizSettings, ...settings };
  },

  SET_AUTO_SAVE_ENABLED(state: QuizState, enabled: boolean) {
    state.autoSaveEnabled = enabled;
  },

  UPDATE_LAST_AUTO_SAVE(state: QuizState) {
    state.lastAutoSave = new Date();
  },

  SET_QUIZ_SERVICE(state: QuizState, service: QuizService) {
    state.quizService = service;
  },

  CLEAR_ALL_DATA(state: QuizState) {
    Object.assign(state, initialState());
  }
};

// Actions
const actions = {
  async loadIntroductionQuestions({ commit, state }: any) {
    if (!state.quizService) {
      throw new Error('Quiz service not initialized');
    }

    commit('SET_LOADING', true);
    try {
      const questions = await state.quizService.getIntroductionQuestions();
      commit('SET_INTRODUCTION_QUESTIONS', questions);
      commit('SET_ERROR', null);
      return questions;
    } catch (error) {
      console.error('Error loading introduction questions:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors du chargement des questions');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async loadSondageQuestions({ commit, state }: any) {
    if (!state.quizService) {
      throw new Error('Quiz service not initialized');
    }

    commit('SET_LOADING', true);
    try {
      const questions = await state.quizService.getSondageQuestions();
      commit('SET_SONDAGE_QUESTIONS', questions);
      commit('SET_ERROR', null);
      return questions;
    } catch (error) {
      console.error('Error loading sondage questions:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors du chargement des questions');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async loadUserResults({ commit, state }: any, userId?: string) {
    if (!state.quizService) {
      throw new Error('Quiz service not initialized');
    }

    try {
      const results = await state.quizService.getUserResults(userId);
      commit('SET_USER_RESULTS', results);
      return results;
    } catch (error) {
      console.error('Error loading user results:', error);
      throw error;
    }
  },

  startQuiz({ commit, dispatch }: any, quizType: 'Introduction' | 'Sondage') {
    commit('START_QUIZ', quizType);
    
    // Load questions if not already loaded
    if (quizType === 'Introduction') {
      dispatch('loadIntroductionQuestions');
    } else {
      dispatch('loadSondageQuestions');
    }
  },

  endQuiz({ commit }: any) {
    commit('END_QUIZ');
  },

  nextQuestion({ commit, state, getters }: any) {
    if (getters.canGoNext) {
      commit('SET_CURRENT_QUESTION_INDEX', state.currentQuestionIndex + 1);
    }
  },

  previousQuestion({ commit, state, getters }: any) {
    if (getters.canGoPrevious) {
      commit('SET_CURRENT_QUESTION_INDEX', state.currentQuestionIndex - 1);
    }
  },

  goToQuestion({ commit, getters }: any, index: number) {
    if (index >= 0 && index < getters.totalQuestions) {
      commit('SET_CURRENT_QUESTION_INDEX', index);
    }
  },

  addResponse({ commit, dispatch }: any, response: QuizResponse) {
    commit('ADD_RESPONSE', response);
    
    // Auto-save if enabled
    dispatch('autoSave');
  },

  async submitQuiz({ commit, state, dispatch }: any) {
    if (!state.quizService) {
      throw new Error('Quiz service not initialized');
    }

    commit('SET_LOADING', true);
    try {
      const result = await state.quizService.submitQuizResponse({
        quizType: state.currentQuizType!,
        responses: state.currentResponses,
        startTime: state.quizStartTime!,
        endTime: new Date()
      });

      commit('ADD_USER_RESULT', result);
      commit('END_QUIZ');
      return result;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de la soumission');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async autoSave({ state, commit }: any) {
    if (!state.autoSaveEnabled || !state.quizInProgress || !state.quizService) {
      return;
    }

    try {
      await state.quizService.saveQuizProgress({
        quizType: state.currentQuizType!,
        currentIndex: state.currentQuestionIndex,
        responses: state.currentResponses,
        startTime: state.quizStartTime!
      });
      commit('UPDATE_LAST_AUTO_SAVE');
    } catch (error) {
      console.error('Auto-save error:', error);
      // Don't throw error for auto-save failures
    }
  },

  setQuizService({ commit }: any, service: QuizService) {
    commit('SET_QUIZ_SERVICE', service);
  },

  clearAllData({ commit }: any) {
    commit('CLEAR_ALL_DATA');
  }
};

// Getters
const getters = {
  isLoading: (state: QuizState) => state.loading,
  hasError: (state: QuizState) => state.error !== null,
  
  // Question getters
  hasIntroductionQuestions: (state: QuizState) => state.introductionQuestions.length > 0,
  hasSondageQuestions: (state: QuizState) => state.sondageQuestions.length > 0,
  
  currentQuestions: (state: QuizState) => {
    return state.currentQuizType === 'Introduction' 
      ? state.introductionQuestions 
      : state.sondageQuestions;
  },
  
  currentQuestion: (state: QuizState, getters: any) => {
    const questions = getters.currentQuestions;
    return questions[state.currentQuestionIndex] || null;
  },
  
  totalQuestions: (state: QuizState, getters: any) => {
    return getters.currentQuestions.length;
  },
  
  // Navigation getters
  canGoPrevious: (state: QuizState) => state.currentQuestionIndex > 0,
  canGoNext: (state: QuizState, getters: any) => state.currentQuestionIndex < getters.totalQuestions - 1,
  isLastQuestion: (state: QuizState, getters: any) => state.currentQuestionIndex === getters.totalQuestions - 1,
  
  // Progress getters
  progressPercentage: (state: QuizState, getters: any) => {
    if (getters.totalQuestions === 0) return 0;
    return Math.round((state.currentQuestionIndex + 1) / getters.totalQuestions * 100);
  },
  
  answeredQuestions: (state: QuizState) => {
    return state.currentResponses.length;
  },
  
  // Response getters
  getResponseForQuestion: (state: QuizState) => (questionId: string) => {
    return state.currentResponses.find(r => r.questionId === questionId);
  },
  
  hasResponseForCurrentQuestion: (state: QuizState, getters: any) => {
    const currentQuestion = getters.currentQuestion;
    return currentQuestion ? state.currentResponses.some(r => r.questionId === currentQuestion.id) : false;
  },
  
  // Results getters
  latestResult: (state: QuizState) => {
    if (state.userResults.length === 0) return null;
    return state.userResults.reduce((latest, current) => 
      (current as any).completedAt > (latest as any).completedAt ? current : latest
    );
  },
  
  resultsByType: (state: QuizState) => (type: 'Introduction' | 'Sondage') => {
    return state.userResults.filter(r => r.quizType === type);
  },
  
  averageScore: (state: QuizState) => {
    if (state.userResults.length === 0) return 0;
    const totalScore = state.userResults.reduce((sum, result) => sum + (result as any).score, 0);
    return Math.round(totalScore / state.userResults.length);
  },
  
  // Time getters
  timeElapsed: (state: QuizState) => {
    if (!state.quizStartTime) return 0;
    return Math.floor((Date.now() - state.quizStartTime.getTime()) / 1000);
  },
  
  timeRemaining: (state: QuizState, getters: any) => {
    if (state.quizSettings.timeLimit === 0) return null;
    const timeLimit = state.quizSettings.timeLimit * 60; // Convert to seconds
    return Math.max(0, timeLimit - getters.timeElapsed);
  }
};

export const quizModule: Module<QuizState, any> = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
  getters
};

// QuizState interface is exported above