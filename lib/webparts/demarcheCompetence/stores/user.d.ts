import type { UserProgress, CompetenceArea } from '@types/index';
import { UserService, User } from '@services/UserService';
export declare const useUserStore: import("pinia").StoreDefinition<"user", Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentUser: import("vue").Ref<{
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null, User | {
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null>;
    isAuthenticated: import("vue").Ref<boolean, boolean>;
    userProgress: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[], UserProgress[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[]>;
    competenceAreas: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[], (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    })[] | {
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[]>;
    userStatistics: import("vue").Ref<{
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null, {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null>;
    overallProgress: import("vue").Ref<{
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null, {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null>;
    upcomingAssessments: import("vue").Ref<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[], {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[] | {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[]>;
    isUserLoaded: import("vue").ComputedRef<boolean>;
    userName: import("vue").ComputedRef<string>;
    userEmail: import("vue").ComputedRef<string>;
    hasProgress: import("vue").ComputedRef<boolean>;
    completedCompetences: import("vue").ComputedRef<number>;
    inProgressCompetences: import("vue").ComputedRef<number>;
    notStartedCompetences: import("vue").ComputedRef<number>;
    averageCompetenceLevel: import("vue").ComputedRef<number>;
    nextAssessmentDue: import("vue").ComputedRef<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    } | null>;
    overallCompletionPercentage: import("vue").ComputedRef<number>;
    isProfileComplete: import("vue").ComputedRef<boolean | null>;
    setUserService: (service: UserService) => void;
    loadCurrentUser: () => Promise<void>;
    loadUserProgress: (userId?: string | undefined) => Promise<void>;
    loadCompetenceAreas: () => Promise<void>;
    loadUserStatistics: () => Promise<void>;
    loadOverallProgress: () => Promise<void>;
    loadUpcomingAssessments: (daysAhead?: number) => Promise<void>;
    saveUserProgress: (progress: UserProgress) => Promise<void>;
    updateCompetenceLevel: (competenceArea: string, newLevel: number, assessmentDate?: Date | undefined) => Promise<void>;
    setCompetenceTargets: (targets: {
        [competenceArea: string]: number;
    }) => Promise<void>;
    scheduleAssessment: (competenceArea: string, assessmentDate: Date) => Promise<void>;
    exportUserData: (format?: 'json' | 'csv') => Promise<void>;
    initializeUser: () => Promise<void>;
    refreshUserData: () => Promise<void>;
    getProgressForCompetence: (competenceArea: string) => UserProgress | undefined;
    getCompetenceAreaById: (id: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    getCompetenceAreaByName: (name: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    calculateProgressPercentage: (currentLevel: number, targetLevel: number) => number;
    getNextMilestone: (competenceArea: string) => {
        level: number;
        title: string;
        description: string;
    } | null;
    getDaysUntilNextAssessment: (competenceArea: string) => number | null;
    isAssessmentOverdue: (competenceArea: string) => boolean;
    getCompetencesByProgress: () => {
        completed: UserProgress[];
        inProgress: UserProgress[];
        notStarted: UserProgress[];
    };
    getRecentActivity: (days?: number) => UserProgress[];
    clearAllData: () => void;
    logout: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "error" | "loading" | "userProgress" | "currentUser" | "isAuthenticated" | "competenceAreas" | "userStatistics" | "overallProgress" | "upcomingAssessments">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentUser: import("vue").Ref<{
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null, User | {
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null>;
    isAuthenticated: import("vue").Ref<boolean, boolean>;
    userProgress: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[], UserProgress[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[]>;
    competenceAreas: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[], (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    })[] | {
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[]>;
    userStatistics: import("vue").Ref<{
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null, {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null>;
    overallProgress: import("vue").Ref<{
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null, {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null>;
    upcomingAssessments: import("vue").Ref<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[], {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[] | {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[]>;
    isUserLoaded: import("vue").ComputedRef<boolean>;
    userName: import("vue").ComputedRef<string>;
    userEmail: import("vue").ComputedRef<string>;
    hasProgress: import("vue").ComputedRef<boolean>;
    completedCompetences: import("vue").ComputedRef<number>;
    inProgressCompetences: import("vue").ComputedRef<number>;
    notStartedCompetences: import("vue").ComputedRef<number>;
    averageCompetenceLevel: import("vue").ComputedRef<number>;
    nextAssessmentDue: import("vue").ComputedRef<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    } | null>;
    overallCompletionPercentage: import("vue").ComputedRef<number>;
    isProfileComplete: import("vue").ComputedRef<boolean | null>;
    setUserService: (service: UserService) => void;
    loadCurrentUser: () => Promise<void>;
    loadUserProgress: (userId?: string | undefined) => Promise<void>;
    loadCompetenceAreas: () => Promise<void>;
    loadUserStatistics: () => Promise<void>;
    loadOverallProgress: () => Promise<void>;
    loadUpcomingAssessments: (daysAhead?: number) => Promise<void>;
    saveUserProgress: (progress: UserProgress) => Promise<void>;
    updateCompetenceLevel: (competenceArea: string, newLevel: number, assessmentDate?: Date | undefined) => Promise<void>;
    setCompetenceTargets: (targets: {
        [competenceArea: string]: number;
    }) => Promise<void>;
    scheduleAssessment: (competenceArea: string, assessmentDate: Date) => Promise<void>;
    exportUserData: (format?: 'json' | 'csv') => Promise<void>;
    initializeUser: () => Promise<void>;
    refreshUserData: () => Promise<void>;
    getProgressForCompetence: (competenceArea: string) => UserProgress | undefined;
    getCompetenceAreaById: (id: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    getCompetenceAreaByName: (name: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    calculateProgressPercentage: (currentLevel: number, targetLevel: number) => number;
    getNextMilestone: (competenceArea: string) => {
        level: number;
        title: string;
        description: string;
    } | null;
    getDaysUntilNextAssessment: (competenceArea: string) => number | null;
    isAssessmentOverdue: (competenceArea: string) => boolean;
    getCompetencesByProgress: () => {
        completed: UserProgress[];
        inProgress: UserProgress[];
        notStarted: UserProgress[];
    };
    getRecentActivity: (days?: number) => UserProgress[];
    clearAllData: () => void;
    logout: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "userName" | "nextAssessmentDue" | "isUserLoaded" | "userEmail" | "hasProgress" | "completedCompetences" | "inProgressCompetences" | "notStartedCompetences" | "averageCompetenceLevel" | "overallCompletionPercentage" | "isProfileComplete">, Pick<{
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    currentUser: import("vue").Ref<{
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null, User | {
        id: number;
        title: string;
        email: string;
        loginName: string;
    } | null>;
    isAuthenticated: import("vue").Ref<boolean, boolean>;
    userProgress: import("vue").Ref<{
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[], UserProgress[] | {
        id?: string | undefined;
        userId: string;
        userName: string;
        competenceArea: string;
        currentLevel: number;
        targetLevel: number;
        lastAssessment: Date;
        nextAssessment: Date;
        progress: number;
    }[]>;
    competenceAreas: import("vue").Ref<{
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[], (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    })[] | {
        id: string;
        name: string;
        description: string;
        levels: {
            level: number;
            title: string;
            description: string;
            requirements: string[];
        }[];
        userProgress?: {
            id?: string | undefined;
            userId: string;
            userName: string;
            competenceArea: string;
            currentLevel: number;
            targetLevel: number;
            lastAssessment: Date;
            nextAssessment: Date;
            progress: number;
        } | undefined;
    }[]>;
    userStatistics: import("vue").Ref<{
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null, {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | {
        totalQuizzesTaken: number;
        averageQuizScore: number;
        timeSpentLearning: number;
        competencesInProgress: number;
        competencesCompleted: number;
        lastActivityDate: Date | null;
    } | null>;
    overallProgress: import("vue").Ref<{
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null, {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | {
        overallPercentage: number;
        competenceBreakdown: {
            [area: string]: number;
        };
        totalAssessments: number;
        nextAssessmentDue: Date | null;
    } | null>;
    upcomingAssessments: import("vue").Ref<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[], {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[] | {
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    }[]>;
    isUserLoaded: import("vue").ComputedRef<boolean>;
    userName: import("vue").ComputedRef<string>;
    userEmail: import("vue").ComputedRef<string>;
    hasProgress: import("vue").ComputedRef<boolean>;
    completedCompetences: import("vue").ComputedRef<number>;
    inProgressCompetences: import("vue").ComputedRef<number>;
    notStartedCompetences: import("vue").ComputedRef<number>;
    averageCompetenceLevel: import("vue").ComputedRef<number>;
    nextAssessmentDue: import("vue").ComputedRef<{
        competenceArea: string;
        assessmentDate: Date;
        currentLevel: number;
        targetLevel: number;
        daysUntilDue: number;
    } | null>;
    overallCompletionPercentage: import("vue").ComputedRef<number>;
    isProfileComplete: import("vue").ComputedRef<boolean | null>;
    setUserService: (service: UserService) => void;
    loadCurrentUser: () => Promise<void>;
    loadUserProgress: (userId?: string | undefined) => Promise<void>;
    loadCompetenceAreas: () => Promise<void>;
    loadUserStatistics: () => Promise<void>;
    loadOverallProgress: () => Promise<void>;
    loadUpcomingAssessments: (daysAhead?: number) => Promise<void>;
    saveUserProgress: (progress: UserProgress) => Promise<void>;
    updateCompetenceLevel: (competenceArea: string, newLevel: number, assessmentDate?: Date | undefined) => Promise<void>;
    setCompetenceTargets: (targets: {
        [competenceArea: string]: number;
    }) => Promise<void>;
    scheduleAssessment: (competenceArea: string, assessmentDate: Date) => Promise<void>;
    exportUserData: (format?: 'json' | 'csv') => Promise<void>;
    initializeUser: () => Promise<void>;
    refreshUserData: () => Promise<void>;
    getProgressForCompetence: (competenceArea: string) => UserProgress | undefined;
    getCompetenceAreaById: (id: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    getCompetenceAreaByName: (name: string) => (CompetenceArea & {
        userProgress?: UserProgress | undefined;
    }) | undefined;
    calculateProgressPercentage: (currentLevel: number, targetLevel: number) => number;
    getNextMilestone: (competenceArea: string) => {
        level: number;
        title: string;
        description: string;
    } | null;
    getDaysUntilNextAssessment: (competenceArea: string) => number | null;
    isAssessmentOverdue: (competenceArea: string) => boolean;
    getCompetencesByProgress: () => {
        completed: UserProgress[];
        inProgress: UserProgress[];
        notStarted: UserProgress[];
    };
    getRecentActivity: (days?: number) => UserProgress[];
    clearAllData: () => void;
    logout: () => void;
    clearError: () => void;
    setError: (message: string) => void;
}, "setError" | "clearError" | "clearAllData" | "setUserService" | "loadCurrentUser" | "loadUserProgress" | "loadCompetenceAreas" | "loadUserStatistics" | "loadOverallProgress" | "loadUpcomingAssessments" | "saveUserProgress" | "updateCompetenceLevel" | "setCompetenceTargets" | "scheduleAssessment" | "exportUserData" | "initializeUser" | "refreshUserData" | "getProgressForCompetence" | "getCompetenceAreaById" | "getCompetenceAreaByName" | "calculateProgressPercentage" | "getNextMilestone" | "getDaysUntilNextAssessment" | "isAssessmentOverdue" | "getCompetencesByProgress" | "getRecentActivity" | "logout">>;
//# sourceMappingURL=user.d.ts.map