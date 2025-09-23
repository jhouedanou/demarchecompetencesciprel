<template>
  <div 
    class="demarche-competence-app" 
    :class="appClasses"
    :data-theme="currentTheme"
  >
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="app-loading-overlay">
      <div class="loading-content">
        <fluent-progress-ring></fluent-progress-ring>
        <h3>Chargement en cours...</h3>
        <p>Initialisation de l'application</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError && !isInitialized" class="app-error-state">
      <div class="error-content">
        <fluent-icon icon="error-circle" size="48"></fluent-icon>
        <h2>Erreur d'Application</h2>
        <p>{{ error }}</p>
        <fluent-button appearance="primary" @click="retryInitialization">
          Réessayer
        </fluent-button>
      </div>
    </div>

    <!-- Main Application -->
    <div v-else class="app-container">
      <!-- Header -->
      <header class="app-header" v-if="showTitle">
        <div class="header-content">
          <div class="header-left">
            <fluent-button 
              v-if="isMobile"
              appearance="subtle"
              icon-only
              @click="toggleSidebar"
            >
              <fluent-icon icon="navigation"></fluent-icon>
            </fluent-button>
            <div class="header-brand">
              <img :src="ciprelLogoUrl" alt="CIPREL Logo" class="ciprel-logo" />
              <div class="brand-text">
                <h1 class="app-title">{{ webPartProperties.title }}</h1>
                <p class="app-subtitle">Plateforme de gestion des compétences</p>
              </div>
            </div>
          </div>
          
          <div class="header-right">
            <div class="header-actions">
              <!-- User Info -->
              <div class="user-info" v-if="currentUser">
                <fluent-persona
                  :name="userDisplayName"
                  :secondary-text="currentUser.email"
                  size="24"
                ></fluent-persona>
              </div>

              <!-- Notifications -->
              <div class="notification-container">
                <fluent-button 
                  class="notification-bell"
                  appearance="subtle" 
                  icon-only 
                  @click="showNotifications = !showNotifications"
                >
                  <fluent-icon icon="alert"></fluent-icon>
                  <span 
                    v-if="notificationCount > 0" 
                    class="notification-badge"
                  >
                    {{ notificationCount }}
                  </span>
                </fluent-button>

                <!-- Notifications Panel -->
                <div v-if="showNotifications" class="notifications-panel">
                  <div class="panel-header">
                    <h3>Notifications</h3>
                    <fluent-button 
                      appearance="subtle" 
                      size="small"
                      @click="clearAllNotifications"
                    >
                      Tout effacer
                    </fluent-button>
                  </div>
                  
                  <div class="notifications-list">
                    <div 
                      v-for="notification in activeNotifications" 
                      :key="notification.id"
                      :class="['notification-item', `notification-${notification.type}`]"
                    >
                      <fluent-icon :icon="getNotificationIcon(notification.type)"></fluent-icon>
                      <div class="notification-content">
                        <h4>{{ notification.title }}</h4>
                        <p>{{ notification.message }}</p>
                        <small>{{ formatNotificationTime(notification.timestamp) }}</small>
                      </div>
                      <fluent-button 
                        appearance="subtle" 
                        icon-only 
                        size="small"
                        @click="removeNotification(notification.id)"
                      >
                        <fluent-icon icon="dismiss"></fluent-icon>
                      </fluent-button>
                    </div>
                    
                    <div v-if="activeNotifications.length === 0" class="no-notifications">
                      <fluent-icon icon="checkmark-circle"></fluent-icon>
                      <p>Aucune notification</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Settings -->
              <fluent-button 
                appearance="subtle" 
                icon-only 
                @click="showSettings = !showSettings"
                aria-label="Paramètres"
              >
                <fluent-icon icon="settings"></fluent-icon>
              </fluent-button>

              <!-- Settings Panel -->
              <div v-if="showSettings" class="settings-panel">
                <div class="panel-header">
                  <h3>Paramètres</h3>
                </div>
                
                <div class="settings-content">
                  <div class="setting-group">
                    <label for="theme-select">Thème</label>
                    <fluent-select 
                      id="theme-select"
                      v-model="selectedTheme"
                      @change="updateTheme"
                    >
                      <fluent-option value="auto">Automatique</fluent-option>
                      <fluent-option value="light">Clair</fluent-option>
                      <fluent-option value="dark">Sombre</fluent-option>
                    </fluent-select>
                  </div>

                  <div class="setting-group">
                    <fluent-checkbox 
                      v-model="compactMode"
                      @change="updateSettings"
                    >
                      Mode compact
                    </fluent-checkbox>
                  </div>

                  <div class="setting-group">
                    <fluent-checkbox 
                      v-model="animationsEnabled"
                      @change="updateSettings"
                    >
                      Animations activées
                    </fluent-checkbox>
                  </div>

                  <div class="setting-group">
                    <fluent-checkbox 
                      v-model="showNotificationsEnabled"
                      @change="updateSettings"
                    >
                      Notifications activées
                    </fluent-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="app-main">
        <!-- Sidebar -->
        <aside 
          v-if="!isMobile || isSidebarOpen" 
          class="app-sidebar"
          :class="{ 'mobile-open': isMobile && isSidebarOpen }"
        >
          <nav class="sidebar-nav">
            <fluent-button 
              :appearance="currentView === 'dashboard' ? 'primary' : 'subtle'"
              @click="navigateTo('dashboard')"
              class="nav-item"
            >
              <fluent-icon icon="home"></fluent-icon>
              Tableau de bord
            </fluent-button>

            <fluent-button 
              :appearance="currentView === 'quiz-introduction' ? 'primary' : 'subtle'"
              :disabled="!canStartIntroQuiz"
              @click="navigateTo('quiz-introduction')"
              class="nav-item"
            >
              <fluent-icon icon="quiz-new"></fluent-icon>
              Quiz d'introduction
              <fluent-icon 
                v-if="hasCompletedIntroQuiz" 
                icon="checkmark-circle" 
                class="completed-icon"
              ></fluent-icon>
            </fluent-button>

            <fluent-button 
              :appearance="currentView === 'quiz-sondage' ? 'primary' : 'subtle'"
              :disabled="!canStartSurvey"
              @click="navigateTo('quiz-sondage')"
              class="nav-item"
            >
              <fluent-icon icon="form"></fluent-icon>
              Sondage compétences
              <fluent-icon 
                v-if="hasCompletedSurvey" 
                icon="checkmark-circle" 
                class="completed-icon"
              ></fluent-icon>
            </fluent-button>

            <fluent-button 
              :appearance="currentView === 'progress' ? 'primary' : 'subtle'"
              :disabled="!isAuthenticated"
              @click="navigateTo('progress')"
              class="nav-item"
            >
              <fluent-icon icon="progress-ring-dots"></fluent-icon>
              Suivi des progrès
            </fluent-button>

            <fluent-button 
              :appearance="currentView === 'competences' ? 'primary' : 'subtle'"
              :disabled="!isAuthenticated"
              @click="navigateTo('competences')"
              class="nav-item"
            >
              <fluent-icon icon="library"></fluent-icon>
              Compétences
            </fluent-button>

            <fluent-button 
              :appearance="currentView === 'results' ? 'primary' : 'subtle'"
              :disabled="!isAuthenticated"
              @click="navigateTo('results')"
              class="nav-item"
            >
              <fluent-icon icon="chart-multiple"></fluent-icon>
              Résultats
            </fluent-button>
          </nav>
        </aside>

        <!-- Content Area -->
        <div class="app-content">
          <!-- Dashboard -->
          <Dashboard 
            v-if="currentView === 'dashboard'" 
            :user="currentUser"
            :can-start-intro="canStartIntroQuiz"
            :can-start-survey="canStartSurvey"
            :has-completed-intro="hasCompletedIntroQuiz"
            :has-completed-survey="hasCompletedSurvey"
            @navigate="navigateTo"
          />

          <!-- Quiz Introduction -->
          <QuizIntroduction 
            v-else-if="currentView === 'quiz-introduction'"
            @navigate="navigateTo"
          />

          <!-- Quiz Sondage -->
          <QuizSondage 
            v-else-if="currentView === 'quiz-sondage'"
            @navigate="navigateTo"
          />

          <!-- Progress Tracker -->
          <ProgressTracker 
            v-else-if="currentView === 'progress'"
            @navigate="navigateTo"
          />

          <!-- Competences -->
          <div v-else-if="currentView === 'competences'" class="competences-view">
            <h2>Référentiel de Compétences</h2>
            <p>Cette section sera développée pour afficher le référentiel complet.</p>
          </div>

          <!-- Results -->
          <div v-else-if="currentView === 'results'" class="results-view">
            <h2>Résultats et Analyses</h2>
            <p>Cette section affichera vos résultats détaillés.</p>
          </div>

          <!-- Settings -->
          <div v-else-if="currentView === 'settings'" class="settings-view">
            <h2>Paramètres</h2>
            <p>Configurez votre expérience d'apprentissage.</p>
          </div>
        </div>
      </main>

      <!-- Sidebar Overlay for Mobile -->
      <div 
        v-if="isMobile && isSidebarOpen" 
        class="sidebar-overlay"
        @click="setSidebarOpen(false)"
      ></div>

      <!-- Offline Banner -->
      <div v-if="!isOnline" class="offline-banner">
        <fluent-icon icon="wifi-off"></fluent-icon>
        <span>Mode hors ligne - Certaines fonctionnalités peuvent être limitées</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapGetters, mapActions } from 'vuex';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

// Import components
import Dashboard from '@components/Dashboard.vue';
import QuizIntroduction from '@components/QuizIntroduction.vue';
import QuizSondage from '@components/QuizSondage.vue';
import ProgressTracker from '@components/ProgressTracker.vue';
import ciprelLogoUrl from '@assets/images/logo.webp';

interface Props {
  webPartProperties: any;
  webPartContext: WebPartContext;
  domElement: HTMLElement;
}

export default {
  name: 'DemarcheCompetenceApp',
  
  components: {
    Dashboard,
    QuizIntroduction,
    QuizSondage,
    ProgressTracker
  },

  props: {
    webPartProperties: {
      type: Object,
      required: true
    },
    webPartContext: {
      type: Object,
      required: true
    },
    domElement: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showNotifications: false,
      showSettings: false,
      selectedTheme: 'auto' as string,
      ciprelLogoUrl
    };
  },

  computed: {
    // App store getters
    ...mapState('app', [
      'loading',
      'initialized',
      'error',
      'currentView',
      'sidebarOpen',
      'settings',
      'notifications'
    ]),
    
    ...mapGetters('app', [
      'isLoading',
      'isInitialized',
      'hasError',
      'currentTheme',
      'isCompactMode',
      'isSidebarOpen',
      'activeNotifications',
      'notificationCount'
    ]),

    // User store getters
    ...mapState('user', ['currentUser']),
    ...mapGetters('user', [
      'isAuthenticated',
      'userDisplayName'
    ]),

    // Quiz store getters
    ...mapGetters('quiz', [
      'hasCompletedIntroduction',
      'hasCompletedSondage'
    ]),

    // Local computed properties
    isMobile(): boolean {
      return window.innerWidth <= 768;
    },

    isOnline(): boolean {
      return navigator.onLine;
    },

    showTitle(): boolean {
      return this.webPartProperties.showTitle !== false;
    },

    appClasses(): object {
      return {
        'compact-mode': this.settings.compactMode,
        'mobile': this.isMobile,
        'animations-disabled': !this.settings.animationsEnabled,
        'sidebar-open': this.sidebarOpen
      };
    },

    canStartIntroQuiz(): boolean {
      return this.isAuthenticated;
    },

    canStartSurvey(): boolean {
      return this.isAuthenticated && this.hasCompletedIntroduction;
    },

    hasCompletedIntroQuiz(): boolean {
      return this.hasCompletedIntroduction;
    },

    hasCompletedSurvey(): boolean {
      return this.hasCompletedSondage;
    },

    compactMode: {
      get(): boolean {
        return this.settings.compactMode;
      },
      set(value: boolean) {
        this.updateSettings({ compactMode: value });
      }
    },

    animationsEnabled: {
      get(): boolean {
        return this.settings.animationsEnabled;
      },
      set(value: boolean) {
        this.updateSettings({ animationsEnabled: value });
      }
    },

    showNotificationsEnabled: {
      get(): boolean {
        return this.settings.showNotifications;
      },
      set(value: boolean) {
        this.updateSettings({ showNotifications: value });
      }
    }
  },

  methods: {
    // App store actions
    ...mapActions('app', [
      'navigateTo',
      'toggleSidebar',
      'setSidebarOpen',
      'updateSettings',
      'removeNotification',
      'clearAllNotifications',
      'showSuccessMessage',
      'showErrorMessage'
    ]),

    // Local methods
    retryInitialization() {
      window.location.reload();
    },

    updateTheme() {
      this.updateSettings({ theme: this.selectedTheme });
    },

    getNotificationIcon(type: string): string {
      switch (type) {
        case 'success': return 'checkmark-circle';
        case 'error': return 'error-circle';
        case 'warning': return 'warning';
        case 'info': return 'info';
        default: return 'info';
      }
    },

    formatNotificationTime(timestamp: Date): string {
      const now = new Date();
      const diff = now.getTime() - timestamp.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'À l\'instant';
      if (minutes < 60) return `il y a ${minutes} min`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `il y a ${hours}h`;
      
      return timestamp.toLocaleDateString('fr-FR');
    },

    handleResize() {
      // Force reactivity update for isMobile
      this.$forceUpdate();
    },

    handleOnlineStatus() {
      // Force reactivity update for isOnline
      this.$forceUpdate();
    },

    handleOutsideClick(event: Event) {
      const target = event.target as Element;
      
      if (!target.closest('.notifications-panel') && !target.closest('.notification-bell')) {
        this.showNotifications = false;
      }
      
      if (!target.closest('.settings-panel') && !target.closest('[aria-label="Paramètres"]')) {
        this.showSettings = false;
      }
    }
  },

  mounted() {
    // Initialize selectedTheme from store
    this.selectedTheme = this.settings.theme;

    // Set up event listeners
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
    document.addEventListener('click', this.handleOutsideClick);
  },

  beforeDestroy() {
    // Clean up event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
    document.removeEventListener('click', this.handleOutsideClick);
  }
};
</script>

<style scoped>
.demarche-competence-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  height: 100%;
  min-height: 400px;
  background: var(--neutral-layer-1);
  color: var(--neutral-foreground-rest);
  position: relative;
  overflow: hidden;
}

.app-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  padding: 40px;
}

.loading-content h3 {
  margin: 20px 0 10px 0;
  color: #106ebe;
}

.loading-content p {
  margin: 0;
  color: #605e5c;
}

.app-error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  background: #f3f2f1;
}

.error-content {
  text-align: center;
  padding: 40px;
  max-width: 500px;
}

.error-content fluent-icon {
  color: #d83b01;
  margin-bottom: 20px;
}

.error-content h2 {
  color: #323130;
  margin: 10px 0;
}

.error-content p {
  color: #605e5c;
  margin: 20px 0;
}

.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--neutral-layer-2);
  border-bottom: 1px solid var(--neutral-stroke-divider-rest);
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ciprel-logo {
  height: 32px;
  width: auto;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--accent-foreground-rest);
}

.app-subtitle {
  font-size: 0.875rem;
  margin: 0;
  color: var(--neutral-foreground-hint);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.user-info {
  margin-right: 15px;
}

.notification-container {
  position: relative;
}

.notification-bell {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #d83b01;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.75rem;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notifications-panel, .settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  max-height: 400px;
  background: var(--neutral-layer-floating);
  border: 1px solid var(--neutral-stroke-divider-rest);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  z-index: 200;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--neutral-stroke-divider-rest);
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--neutral-stroke-divider-rest);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item fluent-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-success fluent-icon {
  color: #107c10;
}

.notification-error fluent-icon {
  color: #d83b01;
}

.notification-warning fluent-icon {
  color: #ffb900;
}

.notification-info fluent-icon {
  color: #106ebe;
}

.notification-content {
  flex-grow: 1;
  min-width: 0;
}

.notification-content h4 {
  margin: 0 0 4px 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.notification-content p {
  margin: 0 0 4px 0;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.notification-content small {
  font-size: 0.75rem;
  color: var(--neutral-foreground-hint);
}

.no-notifications {
  text-align: center;
  padding: 40px 20px;
  color: var(--neutral-foreground-hint);
}

.no-notifications fluent-icon {
  color: #107c10;
  margin-bottom: 8px;
}

.settings-content {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 20px;
}

.setting-group label {
  display: block;
  margin-bottom: 8px;
  color: #323130;
  font-weight: 500;
}

.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-sidebar {
  width: 250px;
  background: var(--neutral-layer-2);
  border-right: 1px solid var(--neutral-stroke-divider-rest);
  display: flex;
  flex-direction: column;
  position: relative;
}

.sidebar-nav {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  justify-content: flex-start;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
}

.nav-item fluent-icon {
  flex-shrink: 0;
}

.completed-icon {
  margin-left: auto;
  color: #107c10;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  background: var(--neutral-layer-1);
  position: relative;
}

.competences-view, .results-view, .settings-view {
  padding: 30px;
  color: #605e5c;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 500;
}

.offline-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffb900;
  color: #323130;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .app-header {
    padding: 0 15px;
    height: 50px;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .app-subtitle {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .app-sidebar {
    position: fixed;
    top: 50px;
    left: 0;
    bottom: 0;
    z-index: 600;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .app-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .notifications-panel, .settings-panel {
    width: 280px;
    right: -140px;
  }
}

/* Compact Mode */
.compact-mode .app-header {
  height: 48px;
}

.compact-mode .app-title {
  font-size: 1.25rem;
}

.compact-mode .sidebar-nav {
  padding: 15px;
  gap: 6px;
}

.compact-mode .nav-item {
  padding: 8px 12px;
}

/* Animations Disabled */
.animations-disabled * {
  transition: none !important;
  animation: none !important;
}

/* Dark Theme Support */
[data-theme="dark"] .app-loading-overlay {
  background: rgba(32, 31, 30, 0.9);
}

[data-theme="dark"] .loading-content h3 {
  color: #9aa0a6;
}

[data-theme="dark"] .error-content h2 {
  color: #f3f2f1;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .app-header {
    border-bottom: 2px solid;
  }
  
  .notification-badge {
    border: 1px solid;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>