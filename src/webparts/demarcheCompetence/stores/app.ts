import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type AppTheme = 'light' | 'dark' | 'auto';
export type AppLanguage = 'fr' | 'en';
export type AppView = 'dashboard' | 'quiz-introduction' | 'quiz-sondage' | 'progress' | 'competences' | 'results' | 'settings';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
}

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  autoSaveInterval: number; // in seconds
  showNotifications: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  compactMode: boolean;
}

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false);
  const initialized = ref(false);
  const error = ref<string | null>(null);
  
  // Current view and navigation
  const currentView = ref<AppView>('dashboard');
  const previousView = ref<AppView | null>(null);
  const navigationHistory = ref<AppView[]>([]);
  
  // App settings
  const settings = ref<AppSettings>({
    theme: 'auto',
    language: 'fr',
    autoSaveInterval: 30,
    showNotifications: true,
    soundEnabled: true,
    animationsEnabled: true,
    compactMode: false
  });

  // Notifications
  const notifications = ref<AppNotification[]>([]);
  
  // Application state
  const isOnline = ref(navigator.onLine);
  const isMobile = ref(window.innerWidth <= 768);
  const sidebarOpen = ref(!isMobile.value);
  
  // Performance tracking
  const performanceMetrics = ref<{
    loadTimes: { [key: string]: number };
    errorCounts: { [key: string]: number };
    lastSync: Date | null;
  }>({
    loadTimes: {},
    errorCounts: {},
    lastSync: null
  });

  // Computed
  const hasNotifications = computed(() => notifications.value.length > 0);
  
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.persistent)
  );

  const errorNotifications = computed(() => 
    notifications.value.filter(n => n.type === 'error')
  );

  const currentTheme = computed(() => {
    if (settings.value.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.value.theme;
  });

  const isOffline = computed(() => !isOnline.value);

  const canGoBack = computed(() => navigationHistory.value.length > 1);

  // Actions
  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setInitialized(value: boolean) {
    initialized.value = value;
  }

  function setError(message: string | null) {
    error.value = message;
    
    if (message) {
      addNotification({
        type: 'error',
        title: 'Erreur',
        message,
        persistent: true
      });
    }
  }

  function clearError() {
    error.value = null;
  }

  function navigateTo(view: AppView, addToHistory: boolean = true) {
    if (addToHistory && currentView.value !== view) {
      navigationHistory.value.push(currentView.value);
      // Keep history limited to last 10 views
      if (navigationHistory.value.length > 10) {
        navigationHistory.value.shift();
      }
    }
    
    previousView.value = currentView.value;
    currentView.value = view;
  }

  function goBack() {
    if (canGoBack.value) {
      const previousViewFromHistory = navigationHistory.value.pop();
      if (previousViewFromHistory) {
        previousView.value = currentView.value;
        currentView.value = previousViewFromHistory;
      }
    }
  }

  function addNotification(notification: Omit<AppNotification, 'id' | 'timestamp'>) {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    notifications.value.unshift(newNotification);

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, duration);
    }

    // Keep only last 50 notifications
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50);
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index >= 0) {
      notifications.value.splice(index, 1);
    }
  }

  function clearNotifications() {
    notifications.value = [];
  }

  function clearNonPersistentNotifications() {
    notifications.value = notifications.value.filter(n => n.persistent);
  }

  function updateSettings(newSettings: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...newSettings };
    saveSettingsToStorage();
    
    // Apply theme changes immediately
    if (newSettings.theme) {
      applyTheme();
    }
  }

  function loadSettingsFromStorage() {
    try {
      const savedSettings = localStorage.getItem('demarcheCompetence_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        settings.value = { ...settings.value, ...parsed };
      }
    } catch (error) {
      console.warn('Could not load settings from storage:', error);
    }
  }

  function saveSettingsToStorage() {
    try {
      localStorage.setItem('demarcheCompetence_settings', JSON.stringify(settings.value));
    } catch (error) {
      console.warn('Could not save settings to storage:', error);
    }
  }

  function applyTheme() {
    const theme = currentTheme.value;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function setSidebarOpen(open: boolean) {
    sidebarOpen.value = open;
  }

  function updateOnlineStatus() {
    isOnline.value = navigator.onLine;
    
    if (isOnline.value) {
      addNotification({
        type: 'success',
        title: 'Connexion rétablie',
        message: 'Vous êtes maintenant en ligne',
        duration: 3000
      });
    } else {
      addNotification({
        type: 'warning',
        title: 'Connexion perdue',
        message: 'Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.',
        persistent: true
      });
    }
  }

  function updateMobileStatus() {
    const wasMobile = isMobile.value;
    isMobile.value = window.innerWidth <= 768;
    
    // Auto-close sidebar on mobile
    if (isMobile.value && !wasMobile) {
      sidebarOpen.value = false;
    } else if (!isMobile.value && wasMobile) {
      sidebarOpen.value = true;
    }
  }

  function trackPerformance(operation: string, duration: number) {
    performanceMetrics.value.loadTimes[operation] = duration;
  }

  function trackError(operation: string) {
    performanceMetrics.value.errorCounts[operation] = 
      (performanceMetrics.value.errorCounts[operation] || 0) + 1;
  }

  function updateLastSync() {
    performanceMetrics.value.lastSync = new Date();
  }

  async function initializeApp() {
    try {
      setLoading(true);
      
      // Load settings from storage
      loadSettingsFromStorage();
      
      // Apply initial theme
      applyTheme();
      
      // Set up event listeners
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      window.addEventListener('resize', updateMobileStatus);
      
      // Theme change listener
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (settings.value.theme === 'auto') {
          applyTheme();
        }
      });

      setInitialized(true);
      
      addNotification({
        type: 'success',
        title: 'Application initialisée',
        message: 'Bienvenue dans la démarche compétence CIPREL',
        duration: 3000
      });
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'initialisation';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function cleanup() {
    // Remove event listeners
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
    window.removeEventListener('resize', updateMobileStatus);
    
    // Clear notifications
    clearNotifications();
    
    // Reset state
    initialized.value = false;
    currentView.value = 'dashboard';
    navigationHistory.value = [];
    error.value = null;
  }

  function resetApp() {
    // Clear all stored data
    localStorage.removeItem('demarcheCompetence_settings');
    
    // Reset to default settings
    settings.value = {
      theme: 'auto',
      language: 'fr',
      autoSaveInterval: 30,
      showNotifications: true,
      soundEnabled: true,
      animationsEnabled: true,
      compactMode: false
    };
    
    // Clear notifications and navigation
    clearNotifications();
    navigationHistory.value = [];
    currentView.value = 'dashboard';
    
    // Apply default theme
    applyTheme();
    
    addNotification({
      type: 'info',
      title: 'Application réinitialisée',
      message: 'Les paramètres ont été remis à zéro',
      duration: 3000
    });
  }

  function showSuccessMessage(message: string, title: string = 'Succès') {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }

  function showErrorMessage(message: string, title: string = 'Erreur') {
    addNotification({
      type: 'error',
      title,
      message,
      persistent: true
    });
  }

  function showWarningMessage(message: string, title: string = 'Attention') {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000
    });
  }

  function showInfoMessage(message: string, title: string = 'Information') {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 5000
    });
  }

  return {
    // State
    loading,
    initialized,
    error,
    currentView,
    previousView,
    navigationHistory,
    settings,
    notifications,
    isOnline,
    isMobile,
    sidebarOpen,
    performanceMetrics,

    // Computed
    hasNotifications,
    unreadNotifications,
    errorNotifications,
    currentTheme,
    isOffline,
    canGoBack,

    // Actions
    setLoading,
    setInitialized,
    setError,
    clearError,
    navigateTo,
    goBack,
    addNotification,
    removeNotification,
    clearNotifications,
    clearNonPersistentNotifications,
    updateSettings,
    loadSettingsFromStorage,
    saveSettingsToStorage,
    applyTheme,
    toggleSidebar,
    setSidebarOpen,
    updateOnlineStatus,
    updateMobileStatus,
    trackPerformance,
    trackError,
    updateLastSync,
    initializeApp,
    cleanup,
    resetApp,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
    showInfoMessage
  };
});