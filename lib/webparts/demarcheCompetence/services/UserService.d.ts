import { SharePointService } from './SharePointService';
import type { UserProgress, CompetenceArea } from '@types/index';
export interface User {
    id: number;
    title: string;
    email: string;
    loginName: string;
}
export declare class UserService {
    private sharePointService;
    private currentUser;
    constructor(sharePointService: SharePointService);
    /**
     * Get current user information
     */
    getCurrentUser(): Promise<User>;
    /**
     * Load user progress data
     */
    loadUserProgress(userId?: string): Promise<UserProgress[]>;
    /**
     * Save or update user progress
     */
    saveUserProgress(progress: UserProgress): Promise<void>;
    /**
     * Update competence level
     */
    updateCompetenceLevel(competenceArea: string, newLevel: number, assessmentDate?: Date): Promise<void>;
    /**
     * Set competence targets
     */
    setCompetenceTargets(targets: {
        [competenceArea: string]: number;
    }): Promise<void>;
    /**
     * Get competence areas with user progress
     */
    getCompetenceAreasWithProgress(): Promise<(CompetenceArea & {
        userProgress?: UserProgress;
    })[]>;
    /**
     * Calculate overall user progress
     */
    calculateOverallProgress(): Promise<{
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    }>;
    /**
     * Get user statistics
     */
    getUserStatistics(): Promise<{
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    }>;
    /**
     * Schedule next assessment
     */
    scheduleNextAssessment(competenceArea: string, assessmentDate: Date): Promise<void>;
    /**
     * Get upcoming assessments
     */
    getUpcomingAssessments(daysAhead?: number): Promise<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[]>;
    /**
     * Export user data
     */
    exportUserData(format?: 'json' | 'csv'): Promise<void>;
    /**
     * Private helper methods
     */
    private transformProgressItem;
    private calculateProgress;
    private calculateNextAssessment;
    private getDefaultCompetenceAreas;
    private getDefaultLevels;
}
//# sourceMappingURL=UserService.d.ts.map