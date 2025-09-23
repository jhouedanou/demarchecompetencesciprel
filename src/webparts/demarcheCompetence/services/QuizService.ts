import { SharePointService } from './SharePointService';
import type {
  QuizQuestion,
  QuizResponse,
  QuizResult,
  QuizIntroductionItem,
  QuizSondageItem,
  QuizResultsItem
} from '@types/index';

export class QuizService {
  private sharePointService: SharePointService;

  constructor(sharePointService: SharePointService) {
    this.sharePointService = sharePointService;
  }

  /**
   * Load and transform introduction quiz questions
   */
  public async loadIntroductionQuestions(): Promise<QuizQuestion[]> {
    try {
      const items = await this.sharePointService.getQuizIntroductionQuestions();
      return items.map(item => this.transformIntroductionItem(item));
    } catch (error) {
      console.error('Error loading introduction questions:', error);
      throw new Error('Impossible de charger les questions du quiz d\'introduction');
    }
  }

  /**
   * Load and transform survey questions
   */
  public async loadSurveyQuestions(): Promise<QuizQuestion[]> {
    try {
      const items = await this.sharePointService.getQuizSondageQuestions();
      return items.map(item => this.transformSurveyItem(item));
    } catch (error) {
      console.error('Error loading survey questions:', error);
      throw new Error('Impossible de charger les questions du sondage');
    }
  }

  /**
   * Alias FR: Charger les questions du sondage (compatibilité avec le store)
   */
  public async loadSondageQuestions(): Promise<QuizQuestion[]> {
    return this.loadSurveyQuestions();
  }

  /**
   * Save quiz result
   */
  public async saveQuizResult(result: QuizResult): Promise<void> {
    try {
      const sharePointResult: Partial<QuizResultsItem> = {
        QuizType: result.quizType,
        Responses: JSON.stringify(result.responses),
        Score: result.score,
        CompletionDate: result.endTime.toISOString(),
        Duration: result.duration,
        Status: result.status
      };

      await this.sharePointService.saveQuizResult(sharePointResult);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw new Error('Impossible de sauvegarder le résultat du quiz');
    }
  }

  /**
   * Load user's quiz results
   */
  public async loadUserResults(userId?: string): Promise<QuizResult[]> {
    try {
      const items = await this.sharePointService.getQuizResults(userId);
      return items.map(item => this.transformResultItem(item));
    } catch (error) {
      console.error('Error loading user results:', error);
      throw new Error('Impossible de charger les résultats de l\'utilisateur');
    }
  }

  /**
   * Save quiz progress (for auto-save functionality)
   */
  public async saveProgress(progressData: {
    userId: string;
    quizType: string;
    responses: QuizResponse[];
    currentQuestion: number;
    startTime: Date;
    status: string;
  }): Promise<void> {
    try {
      // Use local storage for progress saving as it's temporary data
      const progressKey = `quiz_progress_${progressData.userId}_${progressData.quizType}`;
      const progressInfo = {
        responses: progressData.responses,
        currentQuestion: progressData.currentQuestion,
        startTime: progressData.startTime.toISOString(),
        status: progressData.status,
        lastSaved: new Date().toISOString()
      };

      localStorage.setItem(progressKey, JSON.stringify(progressInfo));
    } catch (error) {
      console.error('Error saving progress:', error);
      // Don't throw error for progress saving as it's not critical
    }
  }

  /**
   * Load saved progress
   */
  public async loadProgress(userId: string, quizType: string): Promise<{
    responses: QuizResponse[];
    currentQuestion: number;
    startTime: Date;
    status: string;
  } | null> {
    try {
      const progressKey = `quiz_progress_${userId}_${quizType}`;
      const savedProgress = localStorage.getItem(progressKey);

      if (!savedProgress) {
        return null;
      }

      const progress = JSON.parse(savedProgress);
      return {
        responses: progress.responses,
        currentQuestion: progress.currentQuestion,
        startTime: new Date(progress.startTime),
        status: progress.status
      };
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  /**
   * Clear saved progress
   */
  public async clearProgress(userId: string, quizType: string): Promise<void> {
    try {
      const progressKey = `quiz_progress_${userId}_${quizType}`;
      localStorage.removeItem(progressKey);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }

  /**
   * Get quiz statistics
   */
  public async getQuizStatistics(quizType?: string): Promise<{
    totalParticipants: number;
    averageScore: number;
    completionRate: number;
    averageCompletionTime: number;
    categoryBreakdown: { [key: string]: number };
  }> {
    try {
      const results = await this.sharePointService.getQuizResults();
      
      let filteredResults = results;
      if (quizType) {
        filteredResults = results.filter(r => r.QuizType === quizType);
      }

      const completedResults = filteredResults.filter(r => r.Status === 'Completed');
      
      const statistics = {
        totalParticipants: filteredResults.length,
        averageScore: this.calculateAverageScore(completedResults),
        completionRate: filteredResults.length > 0 ? (completedResults.length / filteredResults.length) * 100 : 0,
        averageCompletionTime: this.calculateAverageCompletionTime(completedResults),
        categoryBreakdown: this.calculateCategoryBreakdown(completedResults)
      };

      return statistics;
    } catch (error) {
      console.error('Error getting quiz statistics:', error);
      throw new Error('Impossible de charger les statistiques du quiz');
    }
  }

  /**
   * Export quiz results
   */
  public async exportResults(quizType?: string, format: 'csv' | 'json' = 'csv'): Promise<void> {
    try {
      const results = await this.sharePointService.getQuizResults();
      
      let dataToExport = results;
      if (quizType) {
        dataToExport = results.filter(r => r.QuizType === quizType);
      }

      if (format === 'csv') {
        await this.exportToCSV(dataToExport, quizType);
      } else {
        await this.exportToJSON(dataToExport, quizType);
      }
    } catch (error) {
      console.error('Error exporting results:', error);
      throw new Error('Impossible d\'exporter les résultats');
    }
  }

  /**
   * Validate quiz responses
   */
  public validateResponses(questions: QuizQuestion[], responses: QuizResponse[]): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if all required questions are answered
    const requiredQuestions = questions.filter(q => q.required);
    const answeredQuestionIds = responses.map(r => r.questionId);

    for (const question of requiredQuestions) {
      if (!answeredQuestionIds.includes(question.id)) {
        errors.push(`La question "${question.question}" est obligatoire`);
      }
    }

    // Check response formats
    for (const response of responses) {
      const question = questions.find(q => q.id === response.questionId);
      if (!question) {
        warnings.push(`Question non trouvée pour la réponse ${response.questionId}`);
        continue;
      }

      // Validate based on question type
      switch (question.type) {
        case 'multiple-choice':
          if (!question.options.some(opt => opt.id === response.answer)) {
            errors.push(`Réponse invalide pour la question "${question.question}"`);
          }
          break;
        case 'rating':
          const rating = Number(response.answer);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            errors.push(`Note invalide pour la question "${question.question}" (doit être entre 1 et 5)`);
          }
          break;
        case 'text':
          if (question.required && (!response.answer || response.answer.toString().trim().length === 0)) {
            errors.push(`Réponse textuelle requise pour la question "${question.question}"`);
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Calculate quiz score
   */
  public calculateScore(questions: QuizQuestion[], responses: QuizResponse[]): {
    score: number;
    totalPossible: number;
    correctAnswers: number;
    percentage: number;
  } {
    let score = 0;
    let totalPossible = 0;
    let correctAnswers = 0;

    for (const question of questions) {
      if (question.correctAnswer) { // Only count questions with correct answers
        totalPossible += question.points;
        
        const response = responses.find(r => r.questionId === question.id);
        if (response && response.answer === question.correctAnswer) {
          score += question.points;
          correctAnswers++;
        }
      }
    }

    return {
      score,
      totalPossible,
      correctAnswers,
      percentage: totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0
    };
  }

  /**
   * Transform SharePoint items to QuizQuestion format
   */
  private transformIntroductionItem(item: QuizIntroductionItem): QuizQuestion {
    return {
      id: item.Id.toString(),
      title: item.Title,
      question: item.Question,
      type: 'multiple-choice',
      options: Array.isArray(item.Options) ? 
        item.Options.map((opt, index) => ({
          id: (index + 1).toString(),
          text: opt,
          correct: opt === item.CorrectAnswer
        })) : [],
      correctAnswer: item.CorrectAnswer,
      category: item.Category,
      points: item.Points,
      order: item.Order,
      required: true
    };
  }

  private transformSurveyItem(item: QuizSondageItem): QuizQuestion {
    return {
      id: item.Id.toString(),
      title: item.Title,
      question: item.Question,
      type: this.mapQuestionType(item.QuestionType),
      options: Array.isArray(item.Options) ? 
        item.Options.map((opt, index) => ({
          id: (index + 1).toString(),
          text: opt
        })) : [],
      points: 0,
      order: item.Order,
      required: item.Required
    };
  }

  private transformResultItem(item: QuizResultsItem): QuizResult {
    return {
      id: item.Id.toString(),
      userId: item.User.Email,
      userName: item.User.Title,
      quizType: item.QuizType as 'Introduction' | 'Sondage',
      responses: Array.isArray(item.Responses) ? item.Responses : [],
      score: item.Score,
      totalQuestions: this.getTotalQuestions(item.Responses),
      correctAnswers: this.getCorrectAnswers(item.Responses),
      startTime: new Date(item.Created),
      endTime: new Date(item.CompletionDate || item.Modified),
      duration: item.Duration,
      status: item.Status as 'Completed' | 'In Progress' | 'Abandoned'
    };
  }

  private mapQuestionType(spType: string): 'multiple-choice' | 'text' | 'rating' {
    switch (spType) {
      case 'Multiple Choice': return 'multiple-choice';
      case 'Text': return 'text';
      case 'Rating': return 'rating';
      default: return 'text';
    }
  }

  private getTotalQuestions(responses: any): number {
    if (Array.isArray(responses)) {
      return responses.length;
    }
    return 0;
  }

  private getCorrectAnswers(responses: any): number {
    if (Array.isArray(responses)) {
      return responses.filter(r => r.correct === true).length;
    }
    return 0;
  }

  private calculateAverageScore(results: QuizResultsItem[]): number {
    if (results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, result) => sum + (result.Score || 0), 0);
    return Math.round(totalScore / results.length);
  }

  private calculateAverageCompletionTime(results: QuizResultsItem[]): number {
    if (results.length === 0) return 0;
    
    const totalTime = results.reduce((sum, result) => sum + (result.Duration || 0), 0);
    return Math.round(totalTime / results.length);
  }

  private calculateCategoryBreakdown(results: QuizResultsItem[]): { [key: string]: number } {
    const breakdown: { [key: string]: number } = {};
    
    for (const result of results) {
      const category = result.QuizType || 'Unknown';
      breakdown[category] = (breakdown[category] || 0) + 1;
    }
    
    return breakdown;
  }

  private async exportToCSV(data: QuizResultsItem[], quizType?: string): Promise<void> {
    const headers = [
      'ID',
      'Utilisateur',
      'Email',
      'Type de Quiz',
      'Score',
      'Statut',
      'Date de Completion',
      'Durée (secondes)',
      'Date de Création'
    ];

    const rows = data.map(item => [
      item.Id,
      item.User.Title,
      item.User.Email,
      item.QuizType,
      item.Score || 0,
      item.Status,
      item.CompletionDate,
      item.Duration || 0,
      item.Created
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results${quizType ? `-${quizType}` : ''}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async exportToJSON(data: QuizResultsItem[], quizType?: string): Promise<void> {
    const exportData = {
      exportDate: new Date().toISOString(),
      quizType: quizType || 'All',
      totalRecords: data.length,
      data: data
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results${quizType ? `-${quizType}` : ''}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}