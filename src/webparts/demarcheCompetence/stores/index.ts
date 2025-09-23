import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Import services
import { SharePointService } from '@services/SharePointService';
import { QuizService } from '@services/QuizService';
import { UserService } from '@services/UserService';

// Service instances
let sharePointService: SharePointService;
let quizService: QuizService;
let userService: UserService;

// App slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    loading: false,
    initialized: false,
    error: null as string | null,
    currentView: 'dashboard' as string,
    notifications: [] as any[],
    settings: {
      theme: 'auto',
      compactMode: false,
      animationsEnabled: true,
      showNotifications: true
    }
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.currentView = action.payload;
    },
    addNotification: (state, action: PayloadAction<any>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    updateSettings: (state, action: PayloadAction<any>) => {
      state.settings = { ...state.settings, ...action.payload };
    }
  }
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    error: null as string | null,
    currentUser: null as any,
    isAuthenticated: false,
    isUserLoaded: false,
    userProgress: [] as any[],
    userStatistics: null as any
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isUserLoaded = true;
    },
    setUserProgress: (state, action: PayloadAction<any[]>) => {
      state.userProgress = action.payload;
    },
    setUserStatistics: (state, action: PayloadAction<any>) => {
      state.userStatistics = action.payload;
    }
  }
});

// Quiz slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    loading: false,
    error: null as string | null,
    introductionQuestions: [] as any[],
    sondageQuestions: [] as any[],
    currentQuizType: null as string | null,
    currentQuestionIndex: 0,
    quizInProgress: false,
    currentResponses: [] as any[],
    userResults: [] as any[]
  },
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setIntroductionQuestions: (state, action: PayloadAction<any[]>) => {
      state.introductionQuestions = action.payload;
    },
    setSondageQuestions: (state, action: PayloadAction<any[]>) => {
      state.sondageQuestions = action.payload;
    },
    startQuiz: (state, action: PayloadAction<string>) => {
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
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    addResponse: (state, action: PayloadAction<any>) => {
      const existingIndex = state.currentResponses.findIndex(r => r.questionId === action.payload.questionId);
      if (existingIndex > -1) {
        state.currentResponses[existingIndex] = action.payload;
      } else {
        state.currentResponses.push(action.payload);
      }
    },
    setUserResults: (state, action: PayloadAction<any[]>) => {
      state.userResults = action.payload;
    }
  }
});

// Export actions
export const { 
  setLoading: setAppLoading,
  setInitialized,
  setError: setAppError,
  setCurrentView,
  addNotification,
  removeNotification,
  clearNotifications,
  updateSettings
} = appSlice.actions;

export const {
  setLoading: setUserLoading,
  setError: setUserError,
  setCurrentUser,
  setUserProgress,
  setUserStatistics
} = userSlice.actions;

export const {
  setLoading: setQuizLoading,
  setError: setQuizError,
  setIntroductionQuestions,
  setSondageQuestions,
  startQuiz,
  endQuiz,
  setCurrentQuestionIndex,
  addResponse,
  setUserResults
} = quizSlice.actions;

// Setup store
export function setupStore(context: WebPartContext) {
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
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST']
        }
      })
  });

  return store;
}

// Initialize all stores
export async function initializeAllStores(store: any, context: WebPartContext) {
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
    
  } catch (error) {
    console.error('Error initializing stores:', error);
    store.dispatch(setAppError(error instanceof Error ? error.message : 'Erreur lors de l\'initialisation'));
    throw error;
  } finally {
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

// Types
export type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>;
export type AppDispatch = ReturnType<typeof setupStore>['dispatch'];