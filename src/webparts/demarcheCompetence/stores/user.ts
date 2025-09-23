import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  UserProgress,
  CompetenceArea
} from '../types/index';
import { UserService, User } from '@services/UserService';

export const useUserStore = defineStore('user', () => {
  // State
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // User Information
  const currentUser = ref<User | null>(null);
  const isAuthenticated = ref(false);
  
  // User Progress
  const userProgress = ref<UserProgress[]>([]);
  const competenceAreas = ref<(CompetenceArea & { userProgress?: UserProgress })[]>([]);
  
  // User Statistics
  const userStatistics = ref<{
    totalQuizzesTaken: number;
    averageQuizScore: number;
    timeSpentLearning: number;
    competencesInProgress: number;
    competencesCompleted: number;
    lastActivityDate: Date | null;
  } | null>(null);

  // Overall Progress
  const overallProgress = ref<{
    overallPercentage: number;
    competenceBreakdown: { [area: string]: number };
    totalAssessments: number;
    nextAssessmentDue: Date | null;
  } | null>(null);

  // Upcoming Assessments
  const upcomingAssessments = ref<{
    competenceArea: string;
    assessmentDate: Date;
    currentLevel: number;
    targetLevel: number;
    daysUntilDue: number;
  }[]>([]);

  // User service instance (will be injected)
  let userService: UserService | null = null;

  // Computed
  const isUserLoaded = computed(() => currentUser.value !== null);
  
  const userName = computed(() => currentUser.value?.title || 'Utilisateur');
  
  const userEmail = computed(() => currentUser.value?.email || '');

  const hasProgress = computed(() => userProgress.value.length > 0);

  const completedCompetences = computed(() => 
    userProgress.value.filter(p => p.progress >= 100).length
  );

  const inProgressCompetences = computed(() => 
    userProgress.value.filter(p => p.progress > 0 && p.progress < 100).length
  );

  const notStartedCompetences = computed(() => 
    userProgress.value.filter(p => p.progress === 0).length
  );

  const averageCompetenceLevel = computed(() => {
    if (userProgress.value.length === 0) return 0;
    
    const totalLevel = userProgress.value.reduce((sum, progress) => sum + progress.currentLevel, 0);
    return Math.round((totalLevel / userProgress.value.length) * 10) / 10;
  });

  const nextAssessmentDue = computed(() => {
    if (upcomingAssessments.value.length === 0) return null;
    
    return upcomingAssessments.value
      .sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime())[0];
  });

  const overallCompletionPercentage = computed(() => 
    overallProgress.value?.overallPercentage || 0
  );

  const isProfileComplete = computed(() => {
    return currentUser.value && userProgress.value.length > 0;
  });

  // Actions
  function setUserService(service: UserService) {
    userService = service;
  }

  async function loadCurrentUser() {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      currentUser.value = await userService.getCurrentUser();
      isAuthenticated.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur';
      isAuthenticated.value = false;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadUserProgress(userId?: string) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      userProgress.value = await userService.loadUserProgress(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des progrès';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadCompetenceAreas() {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      competenceAreas.value = await userService.getCompetenceAreasWithProgress();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des domaines de compétence';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadUserStatistics() {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      userStatistics.value = await userService.getUserStatistics();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadOverallProgress() {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      overallProgress.value = await userService.calculateOverallProgress();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du calcul des progrès globaux';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadUpcomingAssessments(daysAhead: number = 30) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      upcomingAssessments.value = await userService.getUpcomingAssessments(daysAhead);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des évaluations à venir';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function saveUserProgress(progress: UserProgress) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await userService.saveUserProgress(progress);
      
      // Update local state
      const existingIndex = userProgress.value.findIndex(p => p.competenceArea === progress.competenceArea);
      if (existingIndex >= 0) {
        userProgress.value[existingIndex] = progress;
      } else {
        userProgress.value.push(progress);
      }
      
      // Refresh related data
      await Promise.all([
        loadOverallProgress(),
        loadUpcomingAssessments()
      ]);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde des progrès';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateCompetenceLevel(competenceArea: string, newLevel: number, assessmentDate?: Date) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await userService.updateCompetenceLevel(competenceArea, newLevel, assessmentDate);
      
      // Reload user progress to reflect changes
      await loadUserProgress();
      await loadOverallProgress();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du niveau de compétence';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function setCompetenceTargets(targets: { [competenceArea: string]: number }) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await userService.setCompetenceTargets(targets);
      
      // Reload user progress to reflect changes
      await loadUserProgress();
      await loadOverallProgress();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la définition des objectifs';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function scheduleAssessment(competenceArea: string, assessmentDate: Date) {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await userService.scheduleNextAssessment(competenceArea, assessmentDate);
      
      // Update local state
      const progress = userProgress.value.find(p => p.competenceArea === competenceArea);
      if (progress) {
        progress.nextAssessment = assessmentDate;
      }
      
      // Refresh upcoming assessments
      await loadUpcomingAssessments();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la programmation de l\'évaluation';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function exportUserData(format: 'json' | 'csv' = 'json') {
    if (!userService) throw new Error('User service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await userService.exportUserData(format);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'export des données';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function initializeUser() {
    try {
      await loadCurrentUser();
      
      if (isAuthenticated.value) {
        // Load all user-related data in parallel
        await Promise.all([
          loadUserProgress(),
          loadCompetenceAreas(),
          loadUserStatistics(),
          loadOverallProgress(),
          loadUpcomingAssessments()
        ]);
      }
    } catch (err) {
      console.error('Error initializing user:', err);
      throw err;
    }
  }

  async function refreshUserData() {
    if (!isAuthenticated.value) return;
    
    try {
      await Promise.all([
        loadUserProgress(),
        loadUserStatistics(),
        loadOverallProgress(),
        loadUpcomingAssessments()
      ]);
    } catch (err) {
      console.error('Error refreshing user data:', err);
      throw err;
    }
  }

  function getProgressForCompetence(competenceArea: string): UserProgress | undefined {
    return userProgress.value.find(p => p.competenceArea === competenceArea);
  }

  function getCompetenceAreaById(id: string): (CompetenceArea & { userProgress?: UserProgress }) | undefined {
    return competenceAreas.value.find(area => area.id === id);
  }

  function getCompetenceAreaByName(name: string): (CompetenceArea & { userProgress?: UserProgress }) | undefined {
    return competenceAreas.value.find(area => area.name === name);
  }

  function calculateProgressPercentage(currentLevel: number, targetLevel: number): number {
    if (targetLevel === 0) return 0;
    return Math.min(Math.round((currentLevel / targetLevel) * 100), 100);
  }

  function getNextMilestone(competenceArea: string): { level: number; title: string; description: string } | null {
    const progress = getProgressForCompetence(competenceArea);
    const area = getCompetenceAreaByName(competenceArea);
    
    if (!progress || !area) return null;
    
    const nextLevel = progress.currentLevel + 1;
    const milestone = area.levels.find(level => level.level === nextLevel);
    
    return milestone ? {
      level: milestone.level,
      title: milestone.title,
      description: milestone.description
    } : null;
  }

  function getDaysUntilNextAssessment(competenceArea: string): number | null {
    const progress = getProgressForCompetence(competenceArea);
    if (!progress) return null;
    
    const today = new globalThis.Date();
    const nextAssessment = new globalThis.Date(progress.nextAssessment.getTime());
    const diffTime = nextAssessment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  function isAssessmentOverdue(competenceArea: string): boolean {
    const daysUntil = getDaysUntilNextAssessment(competenceArea);
    return daysUntil !== null && daysUntil < 0;
  }

  function getCompetencesByProgress(): {
    completed: UserProgress[];
    inProgress: UserProgress[];
    notStarted: UserProgress[];
  } {
    return {
      completed: userProgress.value.filter(p => p.progress >= 100),
      inProgress: userProgress.value.filter(p => p.progress > 0 && p.progress < 100),
      notStarted: userProgress.value.filter(p => p.progress === 0)
    };
  }

  function getRecentActivity(days: number = 30): UserProgress[] {
    const cutoffDate = new globalThis.Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return userProgress.value
      .filter(p => new globalThis.Date(p.lastAssessment.getTime()) >= cutoffDate)
      .sort((a, b) => new globalThis.Date(b.lastAssessment.getTime()).getTime() - new globalThis.Date(a.lastAssessment.getTime()).getTime());
  }

  // Clear all data
  function clearAllData() {
    currentUser.value = null;
    isAuthenticated.value = false;
    userProgress.value = [];
    competenceAreas.value = [];
    userStatistics.value = null;
    overallProgress.value = null;
    upcomingAssessments.value = [];
    error.value = null;
  }

  function logout() {
    clearAllData();
  }

  // Error handling
  function clearError() {
    error.value = null;
  }

  function setError(message: string) {
    error.value = message;
  }

  return {
    // State
    loading,
    error,
    currentUser,
    isAuthenticated,
    userProgress,
    competenceAreas,
    userStatistics,
    overallProgress,
    upcomingAssessments,

    // Computed
    isUserLoaded,
    userName,
    userEmail,
    hasProgress,
    completedCompetences,
    inProgressCompetences,
    notStartedCompetences,
    averageCompetenceLevel,
    nextAssessmentDue,
    overallCompletionPercentage,
    isProfileComplete,

    // Actions
    setUserService,
    loadCurrentUser,
    loadUserProgress,
    loadCompetenceAreas,
    loadUserStatistics,
    loadOverallProgress,
    loadUpcomingAssessments,
    saveUserProgress,
    updateCompetenceLevel,
    setCompetenceTargets,
    scheduleAssessment,
    exportUserData,
    initializeUser,
    refreshUserData,
    getProgressForCompetence,
    getCompetenceAreaById,
    getCompetenceAreaByName,
    calculateProgressPercentage,
    getNextMilestone,
    getDaysUntilNextAssessment,
    isAssessmentOverdue,
    getCompetencesByProgress,
    getRecentActivity,
    clearAllData,
    logout,
    clearError,
    setError
  };
});