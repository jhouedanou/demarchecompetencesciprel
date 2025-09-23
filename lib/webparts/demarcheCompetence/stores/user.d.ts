import { Module } from 'vuex';
import type { CompetenceArea } from '../types/index';
import { UserService } from '@services/UserService';
import { User, UserProgress } from './types';
export interface UserState {
    loading: boolean;
    error: string | null;
    currentUser: User | null;
    isAuthenticated: boolean;
    isUserLoaded: boolean;
    userProgress: UserProgress[];
    competenceAreas: (CompetenceArea & {
        userProgress?: UserProgress;
    })[];
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
export declare const userModule: Module<UserState, any>;
//# sourceMappingURL=user.d.ts.map