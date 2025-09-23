import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
export declare const setAppLoading: any, setInitialized: any, setAppError: any, setCurrentView: any, addNotification: any, removeNotification: any, clearNotifications: any, updateSettings: any;
export declare const setUserLoading: any, setUserError: any, setCurrentUser: any, setUserProgress: any, setUserStatistics: any;
export declare const setQuizLoading: any, setQuizError: any, setIntroductionQuestions: any, setSondageQuestions: any, startQuiz: any, endQuiz: any, setCurrentQuestionIndex: any, addResponse: any, setUserResults: any;
export declare function setupStore(context: WebPartContext): any;
export declare function initializeAllStores(store: any, context: WebPartContext): Promise<void>;
export declare function getServices(): {
    sharePointService: SharePointService;
    quizService: QuizService;
    userService: UserService;
};
export declare type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>;
export declare type AppDispatch = ReturnType<typeof setupStore>['dispatch'];
//# sourceMappingURL=index.d.ts.map