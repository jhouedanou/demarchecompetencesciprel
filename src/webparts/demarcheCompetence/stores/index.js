import { configureStore, createSlice } from '@reduxjs/toolkit';
// Import services
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';
// Service instances
let sharePointService;
let quizService;
let userService;
// App slice
const appSlice = createSlice({
    name: 'app',
    initialState: {
        loading: false,
        initialized: false,
        error: null,
        currentView: 'dashboard',
        notifications: [],
        settings: {
            theme: 'auto',
            compactMode: false,
            animationsEnabled: true,
            showNotifications: true
        }
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setInitialized: (state, action) => {
            state.initialized = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCurrentView: (state, action) => {
            state.currentView = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        updateSettings: (state, action) => {
            state.settings = Object.assign(Object.assign({}, state.settings), action.payload);
        }
    }
});
// User slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        currentUser: null,
        isAuthenticated: false,
        isUserLoaded: false,
        userProgress: [],
        userStatistics: null
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isUserLoaded = true;
        },
        setUserProgress: (state, action) => {
            state.userProgress = action.payload;
        },
        setUserStatistics: (state, action) => {
            state.userStatistics = action.payload;
        }
    }
});
// Quiz slice
const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        loading: false,
        error: null,
        introductionQuestions: [],
        sondageQuestions: [],
        currentQuizType: null,
        currentQuestionIndex: 0,
        quizInProgress: false,
        currentResponses: [],
        userResults: []
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setIntroductionQuestions: (state, action) => {
            state.introductionQuestions = action.payload;
        },
        setSondageQuestions: (state, action) => {
            state.sondageQuestions = action.payload;
        },
        startQuiz: (state, action) => {
            state.currentQuizType = action.payload;
            state.quizInProgress = true;
            state.currentQuestionIndex = 0;
            state.currentResponses = [];
        },
        endQuiz: (state) => {
            state.currentQuizType = null;
            state.quizInProgress = false;
            state.currentQuestionIndex = 0;
            state.currentResponses = [];
        },
        setCurrentQuestionIndex: (state, action) => {
            state.currentQuestionIndex = action.payload;
        },
        addResponse: (state, action) => {
            const existingIndex = state.currentResponses.findIndex(r => r.questionId === action.payload.questionId);
            if (existingIndex > -1) {
                state.currentResponses[existingIndex] = action.payload;
            }
            else {
                state.currentResponses.push(action.payload);
            }
        },
        setUserResults: (state, action) => {
            state.userResults = action.payload;
        }
    }
});
// Export actions
export const { setLoading: setAppLoading, setInitialized, setError: setAppError, setCurrentView, addNotification, removeNotification, clearNotifications, updateSettings } = appSlice.actions;
export const { setLoading: setUserLoading, setError: setUserError, setCurrentUser, setUserProgress, setUserStatistics } = userSlice.actions;
export const { setLoading: setQuizLoading, setError: setQuizError, setIntroductionQuestions, setSondageQuestions, startQuiz, endQuiz, setCurrentQuestionIndex, addResponse, setUserResults } = quizSlice.actions;
// Setup store
export function setupStore(context) {
    // Initialize services
    sharePointService = new SharePointService(context);
    quizService = new QuizService(sharePointService);
    userService = new UserService(sharePointService);
    const store = configureStore({
        reducer: {
            app: appSlice.reducer,
            user: userSlice.reducer,
            quiz: quizSlice.reducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST']
            }
        })
    });
    return store;
}
// Initialize all stores
export async function initializeAllStores(store, context) {
    try {
        store.dispatch(setAppLoading(true));
        // Initialize app
        store.dispatch(setInitialized(true));
        // Load current user
        const user = await userService.getCurrentUser();
        store.dispatch(setCurrentUser(user));
        store.dispatch(setAppError(null));
        store.dispatch(addNotification({
            id: `init-${Date.now()}`,
            type: 'success',
            title: 'Succès',
            message: 'Application initialisée avec succès',
            timestamp: new Date()
        }));
    }
    catch (error) {
        console.error('Error initializing stores:', error);
        store.dispatch(setAppError(error instanceof Error ? error.message : 'Erreur lors de l\'initialisation'));
        throw error;
    }
    finally {
        store.dispatch(setAppLoading(false));
    }
}
// Get services
export function getServices() {
    return {
        sharePointService,
        quizService,
        userService
    };
}
//# sourceMappingURL=index.js.map