<template>
  <div 
    class="demarche-competence-app" 
    :class="appClasses"
    :data-theme="currentTheme"
  >
    <!-- Loading Overlay -->
    <div v-if="appStore.loading" class="app-loading-overlay">
      <div class="loading-content">
        <fluent-progress-ring></fluent-progress-ring>
        <h3>Chargement en cours...</h3>
        <p>Initialisation de l'application</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="appStore.error && !appStore.initialized" class="app-error-state">
      <div class="error-content">
        <fluent-icon icon="error-circle" size="48"></fluent-icon>
        <h2>Erreur d'Application</h2>
        <p>{{ appStore.error }}</p>
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
              @click="appStore.toggleSidebar"
            >
              <fluent-icon icon="navigation"></fluent-icon>
            </fluent-button>
            <h1 class="app-title">{{ webPartProperties.title }}</h1>
          </div>
          
          <div class="header-right">
            <!-- Notifications -->
            <div class="notification-bell" v-if="appStore.hasNotifications">
              <fluent-button
                appearance="subtle"
                icon-only
                @click="showNotifications = !showNotifications"
                :aria-label="`${appStore.unreadNotifications.length} notifications non lues`"
              >
                <fluent-icon icon="alert"></fluent-icon>
                <span class="notification-count" v-if="appStore.unreadNotifications.length > 0">
                  {{ appStore.unreadNotifications.length }}
                </span>
              </fluent-button>
            </div>

            <!-- User Info -->
            <div class="user-info" v-if="userStore.isAuthenticated">
              <fluent-icon icon="person"></fluent-icon>
              <span class="user-name">{{ userStore.userName }}</span>
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
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div class="app-main" :class="{ 'with-sidebar': !isMobile }">
        <!-- Sidebar Navigation -->
        <nav 
          class="app-sidebar" 
          v-if="appStore.sidebarOpen"
          :class="{ 'mobile-sidebar': isMobile }"
        >
          <div class="sidebar-content">
            <div class="nav-section">
              <h3>Navigation</h3>
              <ul class="nav-list">
                <li>
                  <fluent-button
                    appearance="subtle"
                    :class="{ 'active': appStore.currentView === 'dashboard' }"
                    @click="navigateTo('dashboard')"
                  >
                    <fluent-icon icon="home" slot="start"></fluent-icon>
                    Tableau de Bord
                  </fluent-button>
                </li>
                <li>
                  <fluent-button
                    appearance="subtle"
                    :class="{ 'active': appStore.currentView === 'quiz-introduction' }"
                    @click="navigateTo('quiz-introduction')"
                    :disabled="!canStartIntroQuiz"
                  >
                    <fluent-icon icon="quiz-new" slot="start"></fluent-icon>
                    Quiz Introduction
                    <fluent-badge v-if="!hasCompletedIntroQuiz" appearance="accent" size="small">
                      Nouveau
                    </fluent-badge>
                  </fluent-button>
                </li>
                <li>
                  <fluent-button
                    appearance="subtle"
                    :class="{ 'active': appStore.currentView === 'quiz-sondage' }"
                    @click="navigateTo('quiz-sondage')"
                    :disabled="!canStartSurvey"
                  >
                    <fluent-icon icon="form" slot="start"></fluent-icon>
                    Sondage Satisfaction
                    <fluent-badge v-if="canStartSurvey && !hasCompletedSurvey" appearance="accent" size="small">
                      Disponible
                    </fluent-badge>
                  </fluent-button>
                </li>
                <li>
                  <fluent-button
                    appearance="subtle"
                    :class="{ 'active': appStore.currentView === 'progress' }"
                    @click="navigateTo('progress')"
                  >
                    <fluent-icon icon="chart-line" slot="start"></fluent-icon>
                    Mes Progrès
                  </fluent-button>
                </li>
                <li>
                  <fluent-button
                    appearance="subtle"
                    :class="{ 'active': appStore.currentView === 'competences' }"
                    @click="navigateTo('competences')"
                  >
                    <fluent-icon icon="clipboard-task" slot="start"></fluent-icon>
                    Compétences
                  </fluent-button>
                </li>
              </ul>
            </div>

            <!-- Quick Stats -->
            <div class="nav-section quick-stats" v-if="userStore.hasProgress">
              <h3>Aperçu Rapide</h3>
              <div class="stat-item">
                <span class="stat-label">Progression Globale</span>
                <div class="stat-bar">
                  <div 
                    class="stat-fill" 
                    :style="{ width: `${userStore.overallCompletionPercentage}%` }"
                  ></div>
                </div>
                <span class="stat-value">{{ userStore.overallCompletionPercentage }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Compétences Complétées</span>
                <span class="stat-value">{{ userStore.completedCompetences }}</span>
              </div>
            </div>
          </div>
        </nav>

        <!-- Content Area -->
        <main class="app-content">
          <!-- Dashboard -->
          <Dashboard v-if="appStore.currentView === 'dashboard'" />
          
          <!-- Quiz Introduction -->
          <QuizIntroduction v-else-if="appStore.currentView === 'quiz-introduction'" />
          
          <!-- Quiz Sondage -->
          <QuizSondage v-else-if="appStore.currentView === 'quiz-sondage'" />
          
          <!-- Progress Tracker -->
          <ProgressTracker v-else-if="appStore.currentView === 'progress'" />
          
          <!-- Competences View -->
          <div v-else-if="appStore.currentView === 'competences'" class="competences-view">
            <h2>Gestion des Compétences</h2>
            <p>Vue détaillée des compétences - À implémenter</p>
          </div>
          
          <!-- Default/Unknown View -->
          <div v-else class="unknown-view">
            <h2>Vue non trouvée</h2>
            <p>La vue "{{ appStore.currentView }}" n'existe pas.</p>
            <fluent-button appearance="primary" @click="navigateTo('dashboard')">
              Retour au Tableau de Bord
            </fluent-button>
          </div>
        </main>
      </div>

      <!-- Notifications Panel -->
      <div v-if="showNotifications" class="notifications-panel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <fluent-button
            appearance="subtle"
            icon-only
            @click="showNotifications = false"
          >
            <fluent-icon icon="dismiss"></fluent-icon>
          </fluent-button>
        </div>
        <div class="notifications-content">
          <div 
            v-for="notification in appStore.notifications" 
            :key="notification.id"
            class="notification-item"
            :class="notification.type"
          >
            <div class="notification-icon">
              <fluent-icon :icon="getNotificationIcon(notification.type)"></fluent-icon>
            </div>
            <div class="notification-text">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ formatNotificationTime(notification.timestamp) }}</span>
            </div>
            <fluent-button
              appearance="subtle"
              icon-only
              @click="appStore.removeNotification(notification.id)"
            >
              <fluent-icon icon="dismiss"></fluent-icon>
            </fluent-button>
          </div>
          
          <div v-if="appStore.notifications.length === 0" class="no-notifications">
            <fluent-icon icon="info"></fluent-icon>
            <p>Aucune notification</p>
          </div>
        </div>
      </div>

      <!-- Settings Panel -->
      <div v-if="showSettings" class="settings-panel">
        <div class="settings-header">
          <h3>Paramètres</h3>
          <fluent-button
            appearance="subtle"
            icon-only
            @click="showSettings = false"
          >
            <fluent-icon icon="dismiss"></fluent-icon>
          </fluent-button>
        </div>
        <div class="settings-content">
          <div class="setting-group">
            <label>Thème</label>
            <fluent-select v-model="selectedTheme" @change="updateTheme">
              <option value="auto">Automatique</option>
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
            </fluent-select>
          </div>
          
          <div class="setting-group">
            <label>
              <fluent-checkbox 
                v-model="appStore.settings.showNotifications"
                @change="updateSettings"
              />
              Afficher les notifications
            </label>
          </div>
          
          <div class="setting-group">
            <label>
              <fluent-checkbox 
                v-model="appStore.settings.animationsEnabled"
                @change="updateSettings"
              />
              Activer les animations
            </label>
          </div>
          
          <div class="setting-group">
            <label>
              <fluent-checkbox 
                v-model="appStore.settings.compactMode"
                @change="updateSettings"
              />
              Mode compact
            </label>
          </div>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="isMobile && appStore.sidebarOpen" 
        class="sidebar-overlay"
        @click="appStore.setSidebarOpen(false)"
      ></div>
    </div>

    <!-- Offline Banner -->
    <div v-if="appStore.isOffline" class="offline-banner">
      <fluent-icon icon="wifi-off"></fluent-icon>
      <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useStores } from '@stores/index';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

// Import components
import Dashboard from '@components/Dashboard.vue';
import QuizIntroduction from '@components/QuizIntroduction.vue';
import QuizSondage from '@components/QuizSondage.vue';
import ProgressTracker from '@components/ProgressTracker.vue';

// Props
interface Props {
  webPartProperties: any;
  webPartContext: WebPartContext;
  domElement: HTMLElement;
}

const props = defineProps<Props>();

// Stores
const { app: appStore, quiz: quizStore, user: userStore } = useStores();

// Reactive data
const showNotifications = ref(false);
const showSettings = ref(false);
const selectedTheme = ref(appStore.settings.theme);

// Computed
const currentTheme = computed(() => appStore.currentTheme);
const isMobile = computed(() => appStore.isMobile);
const showTitle = computed(() => props.webPartProperties.showTitle !== false);

const appClasses = computed(() => ({
  'compact-mode': appStore.settings.compactMode,
  'mobile': isMobile.value,
  'animations-disabled': !appStore.settings.animationsEnabled,
  'sidebar-open': appStore.sidebarOpen
}));

const canStartIntroQuiz = computed(() => userStore.isAuthenticated);
const canStartSurvey = computed(() => 
  userStore.isAuthenticated && quizStore.hasCompletedIntroduction
);

const hasCompletedIntroQuiz = computed(() => quizStore.hasCompletedIntroduction);
const hasCompletedSurvey = computed(() => quizStore.hasCompletedSondage);

// Methods
function navigateTo(view: string) {
  appStore.navigateTo(view as any);
  
  if (isMobile.value) {
    appStore.setSidebarOpen(false);
  }
}

function retryInitialization() {
  window.location.reload();
}

function updateTheme() {
  appStore.updateSettings({ theme: selectedTheme.value as any });
}

function updateSettings() {
  // Settings are automatically updated via v-model
  appStore.saveSettingsToStorage();
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'success': return 'checkmark-circle';
    case 'error': return 'error-circle';
    case 'warning': return 'warning';
    case 'info': return 'info';
    default: return 'info';
  }
}

function formatNotificationTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  
  return timestamp.toLocaleDateString('fr-FR');
}

function handleResize() {
  appStore.updateMobileStatus();
}

function handleOnlineStatus() {
  appStore.updateOnlineStatus();
}

// Lifecycle
onMounted(() => {
  // Set up event listeners
  window.addEventListener('resize', handleResize);
  window.addEventListener('online', handleOnlineStatus);
  window.addEventListener('offline', handleOnlineStatus);
  
  // Close panels when clicking outside
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    
    if (!target.closest('.notifications-panel') && !target.closest('.notification-bell')) {
      showNotifications.value = false;
    }
    
    if (!target.closest('.settings-panel') && !target.closest('[aria-label="Paramètres"]')) {
      showSettings.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('online', handleOnlineStatus);
  window.removeEventListener('offline', handleOnlineStatus);
});
</script>

<style scoped>
.demarche-competence-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
}

.app-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-content h3 {
  margin: 20px 0 10px 0;
  color: #323130;
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
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content h2 {
  color: #d13438;
  margin: 20px 0 10px 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  background: white;
  border-bottom: 1px solid #edebe9;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.app-title {
  margin: 0;
  color: #323130;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-bell {
  position: relative;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #d13438;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #605e5c;
}

.app-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.app-sidebar {
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #edebe9;
  overflow-y: auto;
  z-index: 200;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

.sidebar-content {
  padding: 20px;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-section h3 {
  margin: 0 0 15px 0;
  color: #323130;
  font-size: 1rem;
  font-weight: 600;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 5px;
}

.nav-list fluent-button {
  width: 100%;
  justify-content: flex-start;
  text-align: left;
}

.nav-list fluent-button.active {
  background-color: #deecf9;
  color: #0078d4;
}

.quick-stats {
  background: white;
  padding: 15px;
  border-radius: 6px;
}

.stat-item {
  margin-bottom: 15px;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #605e5c;
  margin-bottom: 5px;
}

.stat-bar {
  width: 100%;
  height: 4px;
  background: #f3f2f1;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.stat-fill {
  height: 100%;
  background: #0078d4;
  transition: width 0.3s ease;
}

.stat-value {
  font-size: 0.9rem;
  color: #323130;
  font-weight: 600;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.notifications-panel,
.settings-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 350px;
  max-height: 500px;
  background: white;
  border: 1px solid #edebe9;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.notifications-header,
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #edebe9;
}

.notifications-header h3,
.settings-header h3 {
  margin: 0;
  color: #323130;
}

.notifications-content,
.settings-content {
  padding: 15px 20px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.notification-item.success {
  background: #f3f9f3;
  border-left: 3px solid #107c10;
}

.notification-item.error {
  background: #fdf6f6;
  border-left: 3px solid #d13438;
}

.notification-item.warning {
  background: #fffef5;
  border-left: 3px solid #ffb900;
}

.notification-item.info {
  background: #f8f9fa;
  border-left: 3px solid #0078d4;
}

.notification-text h4 {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  color: #323130;
}

.notification-text p {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  color: #605e5c;
}

.notification-time {
  font-size: 0.75rem;
  color: #8a8886;
}

.no-notifications {
  text-align: center;
  padding: 30px;
  color: #605e5c;
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
  
  .header-right {
    gap: 10px;
  }
  
  .app-content {
    padding: 15px;
  }
  
  .notifications-panel,
  .settings-panel {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
}

/* Compact Mode */
.compact-mode .app-header {
  height: 45px;
  padding: 0 15px;
}

.compact-mode .app-title {
  font-size: 1.1rem;
}

.compact-mode .sidebar-content {
  padding: 15px;
}

.compact-mode .app-content {
  padding: 15px;
}

/* Animations */
.demarche-competence-app:not(.animations-disabled) * {
  transition: all 0.2s ease;
}

/* Dark Theme */
[data-theme="dark"] .demarche-competence-app {
  background: #2b2a29;
  color: #ffffff;
}

[data-theme="dark"] .app-header {
  background: #323130;
  border-bottom-color: #484644;
}

[data-theme="dark"] .app-sidebar {
  background: #323130;
  border-right-color: #484644;
}

[data-theme="dark"] .notifications-panel,
[data-theme="dark"] .settings-panel {
  background: #323130;
  border-color: #484644;
}
</style>