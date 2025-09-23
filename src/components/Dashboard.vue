<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Tableau de Bord - Démarche Compétence</h1>
      <div class="user-info">
        <fluent-icon icon="person"></fluent-icon>
        <span>{{ userStore.currentUser?.title || 'Utilisateur' }}</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Quick Actions -->
      <div class="dashboard-card quick-actions">
        <h2>Actions Rapides</h2>
        <div class="action-buttons">
          <fluent-button 
            appearance="primary" 
            size="large"
            @click="startIntroQuiz"
            :disabled="hasCompletedIntroQuiz"
          >
            <fluent-icon icon="play" slot="start"></fluent-icon>
            {{ hasCompletedIntroQuiz ? 'Quiz Terminé' : 'Commencer le Quiz' }}
          </fluent-button>
          
          <fluent-button 
            appearance="secondary" 
            size="large"
            @click="startSurvey"
            :disabled="!hasCompletedIntroQuiz || hasCompletedSurvey"
          >
            <fluent-icon icon="form" slot="start"></fluent-icon>
            {{ hasCompletedSurvey ? 'Sondage Terminé' : 'Remplir le Sondage' }}
          </fluent-button>
          
          <fluent-button 
            appearance="outline" 
            size="large"
            @click="viewProgress"
          >
            <fluent-icon icon="chart-line" slot="start"></fluent-icon>
            Voir Mon Progrès
          </fluent-button>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="dashboard-card progress-overview">
        <h2>Vue d'Ensemble des Progrès</h2>
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-value">{{ completionPercentage }}%</div>
            <div class="stat-label">Completion Globale</div>
            <div class="stat-bar">
              <div 
                class="stat-fill" 
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-value">{{ quizScore || 'N/A' }}</div>
            <div class="stat-label">Score Quiz Introduction</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-value">{{ competenceAreas.length }}</div>
            <div class="stat-label">Domaines de Compétence</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="dashboard-card recent-activity">
        <h2>Activité Récente</h2>
        <div class="activity-list">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon">
              <fluent-icon :icon="getActivityIcon(activity.type)"></fluent-icon>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-date">{{ formatDate(activity.date) }}</div>
            </div>
            <div class="activity-status" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </div>
          </div>
          
          <div v-if="recentActivities.length === 0" class="no-activity">
            <fluent-icon icon="info"></fluent-icon>
            <p>Aucune activité récente. Commencez par le quiz d'introduction !</p>
          </div>
        </div>
      </div>

      <!-- Competence Areas -->
      <div class="dashboard-card competence-areas">
        <h2>Domaines de Compétence</h2>
        <div class="competence-grid">
          <div 
            v-for="area in competenceAreas" 
            :key="area.id"
            class="competence-item"
            @click="viewCompetenceDetails(area)"
          >
            <div class="competence-header">
              <h3>{{ area.name }}</h3>
              <div class="competence-level">
                Niveau {{ area.currentLevel || 0 }}/{{ area.maxLevel || 5 }}
              </div>
            </div>
            <div class="competence-progress">
              <div 
                class="competence-fill" 
                :style="{ width: `${(area.currentLevel || 0) / (area.maxLevel || 5) * 100}%` }"
              ></div>
            </div>
            <div class="competence-description">{{ area.description }}</div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="dashboard-card next-steps">
        <h2>Prochaines Étapes</h2>
        <div class="steps-list">
          <div 
            v-for="step in nextSteps" 
            :key="step.id"
            class="step-item"
            :class="{ 'completed': step.completed }"
          >
            <div class="step-icon">
              <fluent-icon :icon="step.completed ? 'checkmark-circle' : 'circle'"></fluent-icon>
            </div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-description">{{ step.description }}</div>
              <div v-if="step.dueDate" class="step-due">
                Échéance: {{ formatDate(step.dueDate) }}
              </div>
            </div>
            <fluent-button 
              v-if="!step.completed && step.action" 
              appearance="outline"
              size="small"
              @click="executeStepAction(step)"
            >
              {{ step.actionText }}
            </fluent-button>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="dashboard-card quick-stats">
        <h2>Statistiques</h2>
        <div class="chart-container">
          <canvas ref="statsChart"></canvas>
        </div>
        <div class="stats-summary">
          <div class="summary-item">
            <span class="summary-label">Temps total</span>
            <span class="summary-value">{{ totalTimeSpent }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Dernière activité</span>
            <span class="summary-value">{{ lastActivityDate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@stores/quiz';
import { useUserStore } from '@stores/user';
import type { CompetenceArea, QuizResult } from '@types/index';

const quizStore = useQuizStore();
const userStore = useUserStore();

// Reactive data
const loading = ref(false);
const competenceAreas = ref<CompetenceArea[]>([
  {
    id: '1',
    name: 'Leadership',
    description: 'Capacité à diriger et inspirer les équipes',
    levels: []
  },
  {
    id: '2',
    name: 'Communication',
    description: 'Aptitudes à communiquer efficacement',
    levels: []
  },
  {
    id: '3',
    name: 'Technique',
    description: 'Compétences techniques spécialisées',
    levels: []
  },
  {
    id: '4',
    name: 'Management',
    description: 'Gestion d\'équipes et de projets',
    levels: []
  },
  {
    id: '5',
    name: 'Innovation',
    description: 'Créativité et innovation',
    levels: []
  },
  {
    id: '6',
    name: 'Qualité',
    description: 'Assurance qualité et amélioration continue',
    levels: []
  }
]);

const recentActivities = ref([]);
const nextSteps = ref([
  {
    id: '1',
    title: 'Compléter le Quiz d\'Introduction',
    description: 'Évaluez vos connaissances sur la démarche compétence',
    completed: false,
    action: 'startIntroQuiz',
    actionText: 'Commencer'
  },
  {
    id: '2',
    title: 'Remplir le Sondage de Satisfaction',
    description: 'Partagez votre feedback sur la formation',
    completed: false,
    action: 'startSurvey',
    actionText: 'Remplir'
  },
  {
    id: '3',
    title: 'Planifier l\'Évaluation des Compétences',
    description: 'Programmer votre prochaine évaluation avec votre manager',
    completed: false,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
]);

// Computed properties
const hasCompletedIntroQuiz = computed(() => {
  return quizStore.userResults.some(r => r.quizType === 'Introduction' && r.status === 'Completed');
});

const hasCompletedSurvey = computed(() => {
  return quizStore.userResults.some(r => r.quizType === 'Sondage' && r.status === 'Completed');
});

const quizScore = computed(() => {
  const introResult = quizStore.userResults.find(r => r.quizType === 'Introduction' && r.status === 'Completed');
  return introResult ? `${Math.round((introResult.correctAnswers! / introResult.totalQuestions) * 100)}%` : null;
});

const completionPercentage = computed(() => {
  let completed = 0;
  let total = 2; // Quiz + Survey
  
  if (hasCompletedIntroQuiz.value) completed++;
  if (hasCompletedSurvey.value) completed++;
  
  return Math.round((completed / total) * 100);
});

const totalTimeSpent = computed(() => {
  const totalSeconds = quizStore.userResults.reduce((sum, result) => sum + result.duration, 0);
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes} min`;
});

const lastActivityDate = computed(() => {
  if (quizStore.userResults.length === 0) return 'Aucune';
  
  const lastResult = quizStore.userResults.sort((a, b) => 
    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  )[0];
  
  return formatDate(lastResult.endTime);
});

// Methods
const startIntroQuiz = () => {
  window.location.hash = '#/quiz-introduction';
};

const startSurvey = () => {
  window.location.hash = '#/quiz-sondage';
};

const viewProgress = () => {
  window.location.hash = '#/progress';
};

const viewCompetenceDetails = (area: CompetenceArea) => {
  window.location.hash = `#/competence/${area.id}`;
};

const executeStepAction = (step: any) => {
  switch (step.action) {
    case 'startIntroQuiz':
      startIntroQuiz();
      break;
    case 'startSurvey':
      startSurvey();
      break;
    default:
      console.log('Action not implemented:', step.action);
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'quiz': return 'quiz-new';
    case 'survey': return 'form';
    case 'assessment': return 'clipboard-task';
    default: return 'info';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed': return 'Terminé';
    case 'in-progress': return 'En cours';
    case 'pending': return 'En attente';
    default: return status;
  }
};

const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const loadDashboardData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      quizStore.loadUserResults(),
      // Load other dashboard data
    ]);
    
    // Update next steps based on completion status
    updateNextSteps();
    
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const updateNextSteps = () => {
  // Update completion status of steps
  nextSteps.value[0].completed = hasCompletedIntroQuiz.value;
  nextSteps.value[1].completed = hasCompletedSurvey.value;
};

// Lifecycle
onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edebe9;
}

.dashboard-header h1 {
  color: #323130;
  margin: 0;
  font-size: 2rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #605e5c;
  font-weight: 600;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #edebe9;
}

.dashboard-card h2 {
  color: #323130;
  margin: 0 0 20px 0;
  font-size: 1.25rem;
}

/* Quick Actions */
.quick-actions {
  grid-column: span 2;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Progress Overview */
.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0078d4;
  margin-bottom: 5px;
}

.stat-label {
  color: #605e5c;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.stat-bar {
  width: 100%;
  height: 6px;
  background-color: #f3f2f1;
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background-color: #0078d4;
  transition: width 0.5s ease;
}

/* Recent Activity */
.activity-list {
  space-y: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid #edebe9;
  border-radius: 6px;
  margin-bottom: 10px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f2f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #605e5c;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  color: #323130;
  margin-bottom: 4px;
}

.activity-date {
  color: #605e5c;
  font-size: 0.85rem;
}

.activity-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.activity-status.completed {
  background-color: #dff6dd;
  color: #107c10;
}

.activity-status.in-progress {
  background-color: #fff4ce;
  color: #8a8400;
}

.activity-status.pending {
  background-color: #f3f2f1;
  color: #605e5c;
}

.no-activity {
  text-align: center;
  padding: 30px;
  color: #605e5c;
}

.no-activity p {
  margin: 10px 0 0 0;
}

/* Competence Areas */
.competence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.competence-item {
  padding: 20px;
  border: 1px solid #edebe9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.competence-item:hover {
  border-color: #0078d4;
  background-color: #f8f9fa;
}

.competence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.competence-header h3 {
  margin: 0;
  color: #323130;
  font-size: 1rem;
}

.competence-level {
  font-size: 0.8rem;
  color: #605e5c;
  font-weight: 600;
}

.competence-progress {
  width: 100%;
  height: 4px;
  background-color: #f3f2f1;
  border-radius: 2px;
  margin-bottom: 10px;
  overflow: hidden;
}

.competence-fill {
  height: 100%;
  background-color: #0078d4;
  transition: width 0.5s ease;
}

.competence-description {
  color: #605e5c;
  font-size: 0.85rem;
  line-height: 1.3;
}

/* Next Steps */
.steps-list {
  space-y: 15px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  border: 1px solid #edebe9;
  border-radius: 6px;
  margin-bottom: 10px;
}

.step-item.completed {
  background-color: #f8f9fa;
  border-color: #107c10;
}

.step-icon {
  width: 24px;
  height: 24px;
  color: #605e5c;
  margin-top: 2px;
}

.step-item.completed .step-icon {
  color: #107c10;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: #323130;
  margin-bottom: 4px;
}

.step-description {
  color: #605e5c;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.step-due {
  color: #d13438;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Quick Stats */
.chart-container {
  height: 200px;
  margin-bottom: 20px;
}

.stats-summary {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.summary-label {
  color: #605e5c;
  font-size: 0.9rem;
}

.summary-value {
  color: #323130;
  font-weight: 600;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    grid-column: span 1;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: 10px;
  }
}
</style>