import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
export declare const setAppLoading: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "app/setLoading">, setInitialized: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "app/setInitialized">, setAppError: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "app/setError">, setCurrentView: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "app/setCurrentView">, addNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/addNotification">, removeNotification: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "app/removeNotification">, clearNotifications: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"app/clearNotifications">, updateSettings: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "app/updateSettings">;
export declare const setUserLoading: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "user/setLoading">, setUserError: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "user/setError">, setCurrentUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setCurrentUser">, setUserProgress: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<any[], "user/setUserProgress">, setUserStatistics: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setUserStatistics">;
export declare const setQuizLoading: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<boolean, "quiz/setLoading">, setQuizError: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "quiz/setError">, setIntroductionQuestions: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<any[], "quiz/setIntroductionQuestions">, setSondageQuestions: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<any[], "quiz/setSondageQuestions">, startQuiz: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<string, "quiz/startQuiz">, endQuiz: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"quiz/endQuiz">, setCurrentQuestionIndex: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<number, "quiz/setCurrentQuestionIndex">, addResponse: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "quiz/addResponse">, setUserResults: import("@reduxjs/toolkit").ActionCreatorWithOptionalPayload<any[], "quiz/setUserResults">;
export declare function setupStore(context: WebPartContext): import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    app: {
        loading: boolean;
        initialized: boolean;
        error: string;
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
        error: string;
        currentUser: any;
        isAuthenticated: boolean;
        isUserLoaded: boolean;
        userProgress: any[];
        userStatistics: any;
    };
    quiz: {
        loading: boolean;
        error: string;
        introductionQuestions: any[];
        sondageQuestions: any[];
        currentQuizType: string;
        currentQuestionIndex: number;
        quizInProgress: boolean;
        currentResponses: any[];
        userResults: any[];
    };
}, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("@reduxjs/toolkit").ThunkMiddleware<{
    app: {
        loading: boolean;
        initialized: boolean;
        error: string;
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
        error: string;
        currentUser: any;
        isAuthenticated: boolean;
        isUserLoaded: boolean;
        userProgress: any[];
        userStatistics: any;
    };
    quiz: {
        loading: boolean;
        error: string;
        introductionQuestions: any[];
        sondageQuestions: any[];
        currentQuizType: string;
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