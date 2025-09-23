import { SharePointService } from './SharePointService';
import type {
  UserProgress,
  UserProgressItem,
  CompetenceArea,
  CompetenceLevel
} from '@types/index';

export interface User {
  id: number;
  title: string;
  email: string;
  loginName: string;
}

export class UserService {
  private sharePointService: SharePointService;
  private currentUser: User | null = null;

  constructor(sharePointService: SharePointService) {
    this.sharePointService = sharePointService;
  }

  /**
   * Get current user information
   */
  public async getCurrentUser(): Promise<User> {
    try {
      if (!this.currentUser) {
        this.currentUser = await this.sharePointService.getCurrentUser();
      }
      return this.currentUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Impossible de récupérer les informations de l\'utilisateur actuel');
    }
  }

  /**
   * Load user progress data
   */
  public async loadUserProgress(userId?: string): Promise<UserProgress[]> {
    try {
      const targetUserId = userId || (await this.getCurrentUser()).email;
      const items = await this.sharePointService.getUserProgress(targetUserId);
      return items.map(item => this.transformProgressItem(item));
    } catch (error) {
      console.error('Error loading user progress:', error);
      throw new Error('Impossible de charger les progrès de l\'utilisateur');
    }
  }

  /**
   * Save or update user progress
   */
  public async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      
      // Check if progress already exists for this competence area
      const existingProgress = await this.sharePointService.getUserProgress(currentUser.email);
      const existing = existingProgress.find(p => p.CompetenceArea === progress.competenceArea);

      if (existing) {
        // Update existing progress
        await this.sharePointService.updateUserProgress(existing.Id, {
          CurrentLevel: progress.currentLevel,
          TargetLevel: progress.targetLevel,
          LastAssessment: progress.lastAssessment.toISOString(),
          NextAssessment: progress.nextAssessment.toISOString(),
          Progress: progress.progress
        });
      } else {
        // Create new progress entry
        const newProgress: Partial<UserProgressItem> = {
          CompetenceArea: progress.competenceArea,
          CurrentLevel: progress.currentLevel,
          TargetLevel: progress.targetLevel,
          LastAssessment: progress.lastAssessment.toISOString(),
          NextAssessment: progress.nextAssessment.toISOString(),
          Progress: progress.progress
        };

        await this.sharePointService.saveUserProgress(newProgress);
      }
    } catch (error) {
      console.error('Error saving user progress:', error);
      throw new Error('Impossible de sauvegarder les progrès de l\'utilisateur');
    }
  }

  /**
   * Update competence level
   */
  public async updateCompetenceLevel(
    competenceArea: string,
    newLevel: number,
    assessmentDate?: Date
  ): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.sharePointService.getUserProgress(currentUser.email);
      const existing = userProgress.find(p => p.CompetenceArea === competenceArea);

      const updateData = {
        CurrentLevel: newLevel,
        LastAssessment: (assessmentDate || new Date()).toISOString(),
        Progress: this.calculateProgress(newLevel, existing?.TargetLevel || 5)
      };

      if (existing) {
        await this.sharePointService.updateUserProgress(existing.Id, updateData);
      } else {
        const newProgress: Partial<UserProgressItem> = {
          CompetenceArea: competenceArea,
          ...updateData,
          TargetLevel: 5, // Default target level
          NextAssessment: this.calculateNextAssessment(assessmentDate || new Date()).toISOString()
        };

        await this.sharePointService.saveUserProgress(newProgress);
      }
    } catch (error) {
      console.error('Error updating competence level:', error);
      throw new Error('Impossible de mettre à jour le niveau de compétence');
    }
  }

  /**
   * Set competence targets
   */
  public async setCompetenceTargets(targets: { [competenceArea: string]: number }): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.sharePointService.getUserProgress(currentUser.email);

      const updates: Array<{ id: number; data: Partial<UserProgressItem> }> = [];
      const newEntries: Array<Partial<UserProgressItem>> = [];

      for (const [competenceArea, targetLevel] of Object.entries(targets)) {
        const existing = userProgress.find(p => p.CompetenceArea === competenceArea);

        if (existing) {
          updates.push({
            id: existing.Id,
            data: {
              TargetLevel: targetLevel,
              Progress: this.calculateProgress(existing.CurrentLevel, targetLevel)
            }
          });
        } else {
          newEntries.push({
            CompetenceArea: competenceArea,
            CurrentLevel: 0,
            TargetLevel: targetLevel,
            LastAssessment: new Date().toISOString(),
            NextAssessment: this.calculateNextAssessment(new Date()).toISOString(),
            Progress: 0
          });
        }
      }

      // Execute bulk updates
      if (updates.length > 0) {
        await this.sharePointService.bulkUpdateItems('User_Progress', updates);
      }

      // Create new entries
      for (const entry of newEntries) {
        await this.sharePointService.saveUserProgress(entry);
      }
    } catch (error) {
      console.error('Error setting competence targets:', error);
      throw new Error('Impossible de définir les objectifs de compétence');
    }
  }

  /**
   * Get competence areas with user progress
   */
  public async getCompetenceAreasWithProgress(): Promise<(CompetenceArea & { userProgress?: UserProgress })[]> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.loadUserProgress(currentUser.email);
      
      const competenceAreas = this.getDefaultCompetenceAreas();
      
      return competenceAreas.map(area => {
        const progress = userProgress.find(p => p.competenceArea === area.name);
        return {
          ...area,
          userProgress: progress
        };
      });
    } catch (error) {
      console.error('Error getting competence areas with progress:', error);
      throw new Error('Impossible de charger les domaines de compétence');
    }
  }

  /**
   * Calculate overall user progress
   */
  public async calculateOverallProgress(): Promise<{
    overallPercentage: number;
    competenceBreakdown: { [area: string]: number };
    totalAssessments: number;
    nextAssessmentDue: Date | null;
  }> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.loadUserProgress(currentUser.email);

      const competenceBreakdown: { [area: string]: number } = {};
      let totalProgress = 0;
      let nextAssessmentDue: Date | null = null;

      for (const progress of userProgress) {
        const percentage = this.calculateProgress(progress.currentLevel, progress.targetLevel);
        competenceBreakdown[progress.competenceArea] = percentage;
        totalProgress += percentage;

        // Find earliest next assessment date
        if (!nextAssessmentDue || progress.nextAssessment < nextAssessmentDue) {
          nextAssessmentDue = progress.nextAssessment;
        }
      }

      return {
        overallPercentage: userProgress.length > 0 ? Math.round(totalProgress / userProgress.length) : 0,
        competenceBreakdown,
        totalAssessments: userProgress.length,
        nextAssessmentDue
      };
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      throw new Error('Impossible de calculer les progrès globaux');
    }
  }

  /**
   * Get user statistics
   */
  public async getUserStatistics(): Promise<{
    totalQuizzesTaken: number;
    averageQuizScore: number;
    timeSpentLearning: number;
    competencesInProgress: number;
    competencesCompleted: number;
    lastActivityDate: Date | null;
  }> {
    try {
      const currentUser = await this.getCurrentUser();
      
      // Get quiz results
      const quizResults = await this.sharePointService.getQuizResults(currentUser.email);
      
      // Get user progress
      const userProgress = await this.loadUserProgress(currentUser.email);

      // Calculate statistics
      const completedQuizzes = quizResults.filter(r => r.Status === 'Completed');
      const averageScore = completedQuizzes.length > 0 ? 
        completedQuizzes.reduce((sum, r) => sum + (r.Score || 0), 0) / completedQuizzes.length : 0;
      
      const totalTime = quizResults.reduce((sum, r) => sum + (r.Duration || 0), 0);
      
      const competencesInProgress = userProgress.filter(p => p.progress > 0 && p.progress < 100).length;
      const competencesCompleted = userProgress.filter(p => p.progress >= 100).length;

      const lastActivity = quizResults.length > 0 ? 
        new Date(Math.max(...quizResults.map(r => new Date(r.CompletionDate || r.Created).getTime()))) : null;

      return {
        totalQuizzesTaken: completedQuizzes.length,
        averageQuizScore: Math.round(averageScore),
        timeSpentLearning: totalTime,
        competencesInProgress,
        competencesCompleted,
        lastActivityDate: lastActivity
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw new Error('Impossible de charger les statistiques de l\'utilisateur');
    }
  }

  /**
   * Schedule next assessment
   */
  public async scheduleNextAssessment(competenceArea: string, assessmentDate: Date): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.sharePointService.getUserProgress(currentUser.email);
      const existing = userProgress.find(p => p.CompetenceArea === competenceArea);

      if (existing) {
        await this.sharePointService.updateUserProgress(existing.Id, {
          NextAssessment: assessmentDate.toISOString()
        });
      } else {
        throw new Error(`Aucun progrès trouvé pour le domaine de compétence: ${competenceArea}`);
      }
    } catch (error) {
      console.error('Error scheduling next assessment:', error);
      throw new Error('Impossible de programmer la prochaine évaluation');
    }
  }

  /**
   * Get upcoming assessments
   */
  public async getUpcomingAssessments(daysAhead: number = 30): Promise<{
    competenceArea: string;
    assessmentDate: Date;
    currentLevel: number;
    targetLevel: number;
    daysUntilDue: number;
  }[]> {
    try {
      const currentUser = await this.getCurrentUser();
      const userProgress = await this.loadUserProgress(currentUser.email);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

      return userProgress
        .filter(p => p.nextAssessment <= cutoffDate)
        .map(p => ({
          competenceArea: p.competenceArea,
          assessmentDate: p.nextAssessment,
          currentLevel: p.currentLevel,
          targetLevel: p.targetLevel,
          daysUntilDue: Math.ceil((p.nextAssessment.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => a.assessmentDate.getTime() - b.assessmentDate.getTime());
    } catch (error) {
      console.error('Error getting upcoming assessments:', error);
      throw new Error('Impossible de charger les évaluations à venir');
    }
  }

  /**
   * Export user data
   */
  public async exportUserData(format: 'json' | 'csv' = 'json'): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const [userProgress, quizResults, statistics] = await Promise.all([
        this.loadUserProgress(currentUser.email),
        this.sharePointService.getQuizResults(currentUser.email),
        this.getUserStatistics()
      ]);

      const exportData = {
        user: currentUser,
        exportDate: new Date().toISOString(),
        progress: userProgress,
        quizResults,
        statistics
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${currentUser.email}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // CSV export for progress data
        const headers = ['Domaine de Compétence', 'Niveau Actuel', 'Niveau Cible', 'Progrès (%)', 'Dernière Évaluation', 'Prochaine Évaluation'];
        const rows = userProgress.map(p => [
          p.competenceArea,
          p.currentLevel,
          p.targetLevel,
          p.progress,
          p.lastAssessment.toLocaleDateString('fr-FR'),
          p.nextAssessment.toLocaleDateString('fr-FR')
        ]);

        const csvContent = [headers, ...rows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-progress-${currentUser.email}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Impossible d\'exporter les données de l\'utilisateur');
    }
  }

  /**
   * Private helper methods
   */
  private transformProgressItem(item: UserProgressItem): UserProgress {
    return {
      id: item.Id.toString(),
      userId: item.User.Email,
      userName: item.User.Title,
      competenceArea: item.CompetenceArea,
      currentLevel: item.CurrentLevel,
      targetLevel: item.TargetLevel,
      lastAssessment: new Date(item.LastAssessment),
      nextAssessment: new Date(item.NextAssessment),
      progress: item.Progress
    };
  }

  private calculateProgress(currentLevel: number, targetLevel: number): number {
    if (targetLevel === 0) return 0;
    return Math.min(Math.round((currentLevel / targetLevel) * 100), 100);
  }

  private calculateNextAssessment(lastAssessment: Date): Date {
    const nextAssessment = new Date(lastAssessment);
    nextAssessment.setMonth(nextAssessment.getMonth() + 6); // 6 months from last assessment
    return nextAssessment;
  }

  private getDefaultCompetenceAreas(): CompetenceArea[] {
    return [
      {
        id: 'leadership',
        name: 'Leadership',
        description: 'Capacité à diriger et inspirer les équipes',
        levels: this.getDefaultLevels()
      },
      {
        id: 'communication',
        name: 'Communication',
        description: 'Aptitudes à communiquer efficacement',
        levels: this.getDefaultLevels()
      },
      {
        id: 'technique',
        name: 'Technique',
        description: 'Compétences techniques spécialisées',
        levels: this.getDefaultLevels()
      },
      {
        id: 'management',
        name: 'Management',
        description: 'Gestion d\'équipes et de projets',
        levels: this.getDefaultLevels()
      },
      {
        id: 'innovation',
        name: 'Innovation',
        description: 'Créativité et innovation',
        levels: this.getDefaultLevels()
      },
      {
        id: 'qualite',
        name: 'Qualité',
        description: 'Assurance qualité et amélioration continue',
        levels: this.getDefaultLevels()
      }
    ];
  }

  private getDefaultLevels(): CompetenceLevel[] {
    return [
      {
        level: 1,
        title: 'Débutant',
        description: 'Connaissances de base',
        requirements: ['Compréhension théorique', 'Supervision nécessaire']
      },
      {
        level: 2,
        title: 'Intermédiaire',
        description: 'Compétences pratiques développées',
        requirements: ['Application pratique', 'Supervision occasionnelle']
      },
      {
        level: 3,
        title: 'Confirmé',
        description: 'Maîtrise opérationnelle',
        requirements: ['Autonomie complète', 'Résolution de problèmes']
      },
      {
        level: 4,
        title: 'Expert',
        description: 'Expertise reconnue',
        requirements: ['Innovation', 'Formation d\'autres', 'Amélioration continue']
      },
      {
        level: 5,
        title: 'Maître',
        description: 'Leadership et vision stratégique',
        requirements: ['Vision stratégique', 'Transformation organisationnelle', 'Mentoring']
      }
    ];
  }
}