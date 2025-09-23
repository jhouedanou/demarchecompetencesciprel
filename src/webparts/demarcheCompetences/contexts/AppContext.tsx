import * as React from 'react';
import { AppState, AppAction } from '../types';
import { UserService } from '../services/UserService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  userService: UserService;
  context: WebPartContext;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: action.payload,
        error: null
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};

interface AppProviderProps {
  children: React.ReactNode;
  context: WebPartContext;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, context }) => {
  const userService = React.useMemo(() => new UserService(context), [context]);

  const initialState: AppState = {
    currentPage: 'landing',
    user: userService.getCurrentUser(),
    isLoading: false,
    error: null
  };

  const [state, dispatch] = React.useReducer(appReducer, initialState);

  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
      userService,
      context
    }),
    [state, dispatch, userService, context]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Custom hooks for common operations
export const useNavigation = () => {
  const { state, dispatch } = useAppContext();

  const navigateTo = React.useCallback((page: AppState['currentPage']) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, [dispatch]);

  const goBack = React.useCallback(() => {
    // Simple back logic - could be enhanced with navigation stack
    switch (state.currentPage) {
      case 'quiz':
      case 'sondage':
      case 'dashboard':
      case 'results':
        navigateTo('landing');
        break;
      default:
        navigateTo('landing');
    }
  }, [state.currentPage, navigateTo]);

  return {
    currentPage: state.currentPage,
    navigateTo,
    goBack,
    isLoading: state.isLoading
  };
};

export const useUser = () => {
  const { state, userService } = useAppContext();

  const userInfo = React.useMemo(() => userService.getUserDisplayInfo(), [userService]);
  const greeting = React.useMemo(() => userService.getUserGreeting(), [userService]);
  const canViewDashboard = React.useMemo(() => userService.canViewDashboard(), [userService]);

  return {
    user: state.user,
    userInfo,
    greeting,
    canViewDashboard,
    isCurrentUser: (userId: number) => userService.isCurrentUser(userId)
  };
};

export const useError = () => {
  const { state, dispatch } = useAppContext();

  const setError = React.useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const clearError = React.useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [dispatch]);

  return {
    error: state.error,
    setError,
    clearError,
    hasError: !!state.error
  };
};

export const useLoading = () => {
  const { state, dispatch } = useAppContext();

  const setLoading = React.useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, [dispatch]);

  return {
    isLoading: state.isLoading,
    setLoading
  };
};