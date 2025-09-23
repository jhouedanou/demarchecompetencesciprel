import { Module } from 'vuex';
import type {
  CompetenceArea
} from '../types/index';
import { UserService } from '@services/UserService';
import { User, UserProgress } from './types';

export interface UserState {
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  isUserLoaded: boolean;
  userProgress: UserProgress[];
  competenceAreas: (CompetenceArea & { userProgress?: UserProgress })[];
  userStatistics: {
    totalQuizzesTaken: number;
    averageQuizScore: number;
    timeSpentLearning: number;
    competencesInProgress: number;
    competencesCompleted: number;
    lastActivityDate: Date | null;
  } | null;
  userPreferences: {
    emailNotifications: boolean;
    weeklyDigest: boolean;
    reminderEnabled: boolean;
    preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
    autoSave: boolean;
  };
  userService: UserService | null;
}

// Initial state
const initialState = (): UserState => ({
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
  SET_LOADING(state: UserState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: UserState, error: string | null) {
    state.error = error;
  },

  SET_CURRENT_USER(state: UserState, user: User | null) {
    state.currentUser = user;
    state.isAuthenticated = user !== null;
    state.isUserLoaded = true;
  },

  SET_USER_PROGRESS(state: UserState, progress: UserProgress[]) {
    state.userProgress = progress;
  },

  ADD_USER_PROGRESS(state: UserState, progress: UserProgress) {
    const existingIndex = state.userProgress.findIndex(p => p.competenceId === progress.competenceId);
    if (existingIndex > -1) {
      state.userProgress.splice(existingIndex, 1, progress);
    } else {
      state.userProgress.push(progress);
    }
  },

  SET_COMPETENCE_AREAS(state: UserState, areas: (CompetenceArea & { userProgress?: UserProgress })[]) {
    state.competenceAreas = areas;
  },

  SET_USER_STATISTICS(state: UserState, statistics: UserState['userStatistics']) {
    state.userStatistics = statistics;
  },

  SET_USER_PREFERENCES(state: UserState, preferences: Partial<UserState['userPreferences']>) {
    state.userPreferences = { ...state.userPreferences, ...preferences };
  },

  SET_USER_SERVICE(state: UserState, service: UserService) {
    state.userService = service;
  },

  CLEAR_ALL_DATA(state: UserState) {
    Object.assign(state, initialState());
  }
};

// Actions
const actions = {
  async initializeUser({ commit, state }: any) {
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
    } catch (error) {
      console.error('User initialization error:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de l\'initialisation utilisateur');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async refreshUserData({ commit, state }: any) {
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
    } catch (error) {
      console.error('User data refresh error:', error);
      commit('SET_ERROR', error instanceof Error ? error.message : 'Erreur lors de l\'actualisation des données');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateUserProgress({ commit, state }: any, progress: UserProgress) {
    if (!state.userService) {
      throw new Error('User service not initialized');
    }

    try {
      const savedProgress = await state.userService.saveUserProgress(progress);
      commit('ADD_USER_PROGRESS', savedProgress);
      return savedProgress;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  },

  async updateUserPreferences({ commit, state }: any, preferences: Partial<UserState['userPreferences']>) {
    if (!state.userService || !state.currentUser) {
      throw new Error('User service not initialized or user not loaded');
    }

    try {
      await state.userService.updateUserPreferences(state.currentUser.id, preferences);
      commit('SET_USER_PREFERENCES', preferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  setUserService({ commit }: any, service: UserService) {
    commit('SET_USER_SERVICE', service);
  },

  clearAllData({ commit }: any) {
    commit('CLEAR_ALL_DATA');
  }
};

// Getters
const getters = {
  isLoading: (state: UserState) => state.loading,
  hasError: (state: UserState) => state.error !== null,
  isAuthenticated: (state: UserState) => state.isAuthenticated,
  isUserLoaded: (state: UserState) => state.isUserLoaded,
  currentUser: (state: UserState) => state.currentUser,
  userDisplayName: (state: UserState) => state.currentUser?.displayName || 'Utilisateur',
  userEmail: (state: UserState) => state.currentUser?.email || '',
  
  // Progress getters
  overallProgress: (state: UserState) => {
    if (state.userProgress.length === 0) return 0;
    const totalProgress = state.userProgress.reduce((sum, p) => sum + p.progressPercentage, 0);
    return Math.round(totalProgress / state.userProgress.length);
  },

  competenceProgress: (state: UserState) => (competenceId: string) => {
    return state.userProgress.find(p => p.competenceId === competenceId);
  },

  completedCompetences: (state: UserState) => {
    return state.userProgress.filter(p => p.progressPercentage >= 100);
  },

  inProgressCompetences: (state: UserState) => {
    return state.userProgress.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100);
  },

  // Statistics getters
  totalQuizzesTaken: (state: UserState) => state.userStatistics?.totalQuizzesTaken || 0,
  averageScore: (state: UserState) => state.userStatistics?.averageQuizScore || 0,
  timeSpentLearning: (state: UserState) => state.userStatistics?.timeSpentLearning || 0,
  lastActivityDate: (state: UserState) => state.userStatistics?.lastActivityDate,

  // Preference getters
  userPreferences: (state: UserState) => state.userPreferences,
  hasEmailNotificationsEnabled: (state: UserState) => state.userPreferences.emailNotifications,
  isAutoSaveEnabled: (state: UserState) => state.userPreferences.autoSave
};

export const userModule: Module<UserState, any> = {
  namespaced: true,
  state: initialState,
  mutations,
  actions,
  getters
};

// UserState interface is exported above