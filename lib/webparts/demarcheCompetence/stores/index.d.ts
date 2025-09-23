import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
export declare const setAppLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "app/setLoading">, setInitialized: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "app/setInitialized">, setAppError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "app/setError">, setCurrentView: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/setCurrentView">, addNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/addNotification">, removeNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "app/removeNotification">, clearNotifications: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"app/clearNotifications">, updateSettings: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/updateSettings">;
export declare const setUserLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "user/setLoading">, setUserError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "user/setError">, setCurrentUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setCurrentUser">, setUserProgress: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "user/setUserProgress">, setUserStatistics: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setUserStatistics">;
export declare const setQuizLoading: import("@reduxjs/toolkit").ActionCreatorWithPayload<boolean, "quiz/setLoading">, setQuizError: import("@reduxjs/toolkit").ActionCreatorWithPayload<string | null, "quiz/setError">, setIntroductionQuestions: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "quiz/setIntroductionQuestions">, setSondageQuestions: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "quiz/setSondageQuestions">, startQuiz: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "quiz/startQuiz">, endQuiz: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"quiz/endQuiz">, setCurrentQuestionIndex: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "quiz/setCurrentQuestionIndex">, addResponse: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "quiz/addResponse">, setUserResults: import("@reduxjs/toolkit").ActionCreatorWithPayload<any[], "quiz/setUserResults">;
export declare function setupStore(context: WebPartContext): import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    app: {
        loading: boolean;
        initialized: boolean;
        error: string | null;
        currentView: string;
        notifications: any[];
        settings: {
            theme: string;
            compactMode: boolean;
            animationsEnabled: boolean;
            showNotifications: boolean;
        };
    };
    user: {
        loading: boolean;
        error: string | null;
        currentUser: any;
        isAuthenticated: boolean;
        isUserLoaded: boolean;
        userProgress: any[];
        userStatistics: any;
    };
    quiz: {
        loading: boolean;
        error: string | null;
        introductionQuestions: any[];
        sondageQuestions: any[];
        currentQuizType: string | null;
        currentQuestionIndex: number;
        quizInProgress: boolean;
        currentResponses: any[];
        userResults: any[];
    };
}, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("@reduxjs/toolkit").ThunkMiddleware<{
    app: {
        loading: boolean;
        initialized: boolean;
        error: string | null;
        currentView: string;
        notifications: any[];
        settings: {
            theme: string;
            compactMode: boolean;
            animationsEnabled: boolean;
            showNotifications: boolean;
        };
    };
    user: {
        loading: boolean;
        error: string | null;
        currentUser: any;
        isAuthenticated: boolean;
        isUserLoaded: boolean;
        userProgress: any[];
        userStatistics: any;
    };
    quiz: {
        loading: boolean;
        error: string | null;
        introductionQuestions: any[];
        sondageQuestions: any[];
        currentQuizType: string | null;
        currentQuestionIndex: number;
        quizInProgress: boolean;
        currentResponses: any[];
        userResults: any[];
    };
}, import("redux").AnyAction, undefined>]>>;
export declare function initializeAllStores(store: any, context: WebPartContext): Promise<void>;
export declare function getServices(): {
    sharePointService: SharePointService;
    quizService: QuizService;
    userService: UserService;
};
export declare type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>;
export declare type AppDispatch = ReturnType<typeof setupStore>['dispatch'];
//# sourceMappingURL=index.d.ts.map