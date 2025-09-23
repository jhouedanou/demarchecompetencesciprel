import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  QuizQuestion,
  QuizResponse,
  QuizResult
} from '../types/index';
import { QuizService } from '@services/QuizService';

export const useQuizStore = defineStore('quiz', () => {
  // State
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Quiz Questions
  const introductionQuestions = ref<QuizQuestion[]>([]);
  const sondageQuestions = ref<QuizQuestion[]>([]);
  
  // Current Quiz State
  const currentQuizType = ref<'Introduction' | 'Sondage' | null>(null);
  const currentQuestionIndex = ref(0);
  const quizStartTime = ref<Date | null>(null);
  const quizInProgress = ref(false);
  const currentResponses = ref<QuizResponse[]>([]);
  
  // Results
  const userResults = ref<QuizResult[]>([]);
  const quizStatistics = ref<{
    totalParticipants: number;
    averageScore: number;
    completionRate: number;
    averageCompletionTime: number;
    categoryBreakdown: { [key: string]: number };
  } | null>(null);

  // Quiz service instance (will be injected)
  let quizService: QuizService | null = null;

  // Computed
  const hasIntroductionQuestions = computed(() => introductionQuestions.value.length > 0);
  const hasSondageQuestions = computed(() => sondageQuestions.value.length > 0);
  
  const currentQuestion = computed(() => {
    if (currentQuizType.value === 'Introduction') {
      return introductionQuestions.value[currentQuestionIndex.value];
    } else if (currentQuizType.value === 'Sondage') {
      return sondageQuestions.value[currentQuestionIndex.value];
    }
    return null;
  });

  const totalQuestions = computed(() => {
    if (currentQuizType.value === 'Introduction') {
      return introductionQuestions.value.length;
    } else if (currentQuizType.value === 'Sondage') {
      return sondageQuestions.value.length;
    }
    return 0;
  });

  const quizProgress = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
  });

  const hasCompletedIntroduction = computed(() => 
    userResults.value.some(result => 
      result.quizType === 'Introduction' && result.status === 'Completed'
    )
  );

  const hasCompletedSondage = computed(() => 
    userResults.value.some(result => 
      result.quizType === 'Sondage' && result.status === 'Completed'
    )
  );

  const latestIntroductionResult = computed(() => 
    userResults.value
      .filter(result => result.quizType === 'Introduction' && result.status === 'Completed')
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())[0] || null
  );

  const latestSondageResult = computed(() => 
    userResults.value
      .filter(result => result.quizType === 'Sondage' && result.status === 'Completed')
      .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())[0] || null
  );

  // Actions
  function setQuizService(service: QuizService) {
    quizService = service;
  }

  async function loadIntroductionQuestions() {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      introductionQuestions.value = await quizService.loadIntroductionQuestions();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des questions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadSondageQuestions() {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      sondageQuestions.value = await quizService.loadSondageQuestions();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des questions du sondage';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function loadUserResults(userId?: string) {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      userResults.value = await quizService.loadUserResults(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des résultats';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function startQuiz(quizType: 'Introduction' | 'Sondage') {
    currentQuizType.value = quizType;
    currentQuestionIndex.value = 0;
    quizStartTime.value = new Date();
    quizInProgress.value = true;
    currentResponses.value = [];
    error.value = null;

    // Load questions if not already loaded
    if (quizType === 'Introduction' && !hasIntroductionQuestions.value) {
      await loadIntroductionQuestions();
    } else if (quizType === 'Sondage' && !hasSondageQuestions.value) {
      await loadSondageQuestions();
    }

    // Try to load saved progress
    if (quizService) {
      try {
        const savedProgress = await quizService.loadProgress('current-user', quizType);
        if (savedProgress) {
          currentQuestionIndex.value = savedProgress.currentQuestion;
          currentResponses.value = savedProgress.responses;
          quizStartTime.value = savedProgress.startTime;
        }
      } catch (err) {
        console.warn('Could not load saved progress:', err);
      }
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  }

  function goToQuestion(index: number) {
    if (index >= 0 && index < totalQuestions.value) {
      currentQuestionIndex.value = index;
    }
  }

  function addResponse(response: QuizResponse) {
    const existingIndex = currentResponses.value.findIndex(r => r.questionId === response.questionId);
    if (existingIndex >= 0) {
      currentResponses.value[existingIndex] = response;
    } else {
      currentResponses.value.push(response);
    }
  }

  function updateResponse(questionId: string, answer: string | number) {
    const response = currentResponses.value.find(r => r.questionId === questionId);
    if (response) {
      response.answer = answer;
    }
  }

  function getResponse(questionId: string): QuizResponse | undefined {
    return currentResponses.value.find(r => r.questionId === questionId);
  }

  async function saveProgress(progressData: any) {
    if (!quizService) return;
    
    try {
      await quizService.saveProgress(progressData);
    } catch (err) {
      console.warn('Could not save progress:', err);
    }
  }

  async function saveQuizResult(result: QuizResult) {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await quizService.saveQuizResult(result);
      
      // Add to local results
      userResults.value.push(result);
      
      // Clear progress
      await quizService.clearProgress(result.userId, result.quizType);
      
      // Reset quiz state
      resetQuizState();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du résultat';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function resetQuizState() {
    currentQuizType.value = null;
    currentQuestionIndex.value = 0;
    quizStartTime.value = null;
    quizInProgress.value = false;
    currentResponses.value = [];
  }

  function abandonQuiz() {
    if (quizService && currentQuizType.value && quizStartTime.value) {
      // Save as abandoned result
      const result: QuizResult = {
        userId: 'current-user', // Will be replaced by actual user ID in service
        userName: 'Current User',
        quizType: currentQuizType.value,
        responses: currentResponses.value,
        totalQuestions: totalQuestions.value,
        startTime: quizStartTime.value,
        endTime: new Date(),
        duration: Math.round((new Date().getTime() - quizStartTime.value.getTime()) / 1000),
        status: 'Abandoned'
      };

      quizService.saveQuizResult(result).catch(err => {
        console.warn('Could not save abandoned quiz:', err);
      });
    }

    resetQuizState();
  }

  async function loadQuizStatistics(quizType?: string) {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      quizStatistics.value = await quizService.getQuizStatistics(quizType);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function exportQuizResults(quizType?: string, format: 'csv' | 'json' = 'csv') {
    if (!quizService) throw new Error('Quiz service not initialized');
    
    loading.value = true;
    error.value = null;
    
    try {
      await quizService.exportResults(quizType, format);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de l\'export';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function validateCurrentResponses(): { isValid: boolean; errors: string[]; warnings: string[] } {
    if (!quizService || !currentQuizType.value) {
      return { isValid: false, errors: ['Quiz non initialisé'], warnings: [] };
    }

    const questions = currentQuizType.value === 'Introduction' 
      ? introductionQuestions.value 
      : sondageQuestions.value;

    return quizService.validateResponses(questions, currentResponses.value);
  }

  function calculateCurrentScore(): {
    score: number;
    totalPossible: number;
    correctAnswers: number;
    percentage: number;
  } {
    if (!quizService || currentQuizType.value !== 'Introduction') {
      return { score: 0, totalPossible: 0, correctAnswers: 0, percentage: 0 };
    }

    return quizService.calculateScore(introductionQuestions.value, currentResponses.value);
  }

  function getQuestionsByCategory(category: string): QuizQuestion[] {
    return introductionQuestions.value.filter(q => q.category === category);
  }

  function getAverageTimePerQuestion(): number {
    if (currentResponses.value.length === 0) return 0;
    
    const totalTime = currentResponses.value.reduce((sum, response) => sum + response.timeSpent, 0);
    return Math.round(totalTime / currentResponses.value.length);
  }

  function getResponsesWithCorrectness(): Array<QuizResponse & { isCorrect?: boolean; question?: QuizQuestion }> {
    return currentResponses.value.map(response => {
      const question = currentQuizType.value === 'Introduction' 
        ? introductionQuestions.value.find(q => q.id === response.questionId)
        : sondageQuestions.value.find(q => q.id === response.questionId);

      return {
        ...response,
        isCorrect: question?.correctAnswer ? response.answer === question.correctAnswer : undefined,
        question
      };
    });
  }

  // Clear all data
  function clearAllData() {
    introductionQuestions.value = [];
    sondageQuestions.value = [];
    userResults.value = [];
    quizStatistics.value = null;
    resetQuizState();
    error.value = null;
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
    introductionQuestions,
    sondageQuestions,
    currentQuizType,
    currentQuestionIndex,
    quizStartTime,
    quizInProgress,
    currentResponses,
    userResults,
    quizStatistics,

    // Computed
    hasIntroductionQuestions,
    hasSondageQuestions,
    currentQuestion,
    totalQuestions,
    quizProgress,
    hasCompletedIntroduction,
    hasCompletedSondage,
    latestIntroductionResult,
    latestSondageResult,

    // Actions
    setQuizService,
    loadIntroductionQuestions,
    loadSondageQuestions,
    loadUserResults,
    startQuiz,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    addResponse,
    updateResponse,
    getResponse,
    saveProgress,
    saveQuizResult,
    resetQuizState,
    abandonQuiz,
    loadQuizStatistics,
    exportQuizResults,
    validateCurrentResponses,
    calculateCurrentScore,
    getQuestionsByCategory,
    getAverageTimePerQuestion,
    getResponsesWithCorrectness,
    clearAllData,
    clearError,
    setError
  };
});