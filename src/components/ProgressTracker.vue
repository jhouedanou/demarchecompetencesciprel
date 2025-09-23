<template>
  <div class="progress-tracker">
    <div class="tracker-header">
      <h1>Suivi des Progrès</h1>
      <div class="header-actions">
        <fluent-button appearance="secondary" @click="exportResults">
          <fluent-icon icon="download" slot="start"></fluent-icon>
          Exporter
        </fluent-button>
        <fluent-button appearance="primary" @click="refreshData">
          <fluent-icon icon="arrow-clockwise" slot="start"></fluent-icon>
          Actualiser
        </fluent-button>
      </div>
    </div>

    <div class="progress-grid">
      <!-- Overall Progress -->
      <div class="progress-card overall-progress">
        <h2>Progression Globale</h2>
        <div class="progress-circle">
          <canvas ref="progressChart" width="150" height="150"></canvas>
          <div class="progress-text">
            <span class="progress-percentage">{{ overallProgress }}%</span>
            <span class="progress-label">Terminé</span>
          </div>
        </div>
        <div class="progress-details">
          <div class="detail-item">
            <span class="detail-label">Quiz Introduction</span>
            <div class="detail-status" :class="{ 'completed': hasCompletedQuiz }">
              <fluent-icon :icon="hasCompletedQuiz ? 'checkmark' : 'circle'"></fluent-icon>
              {{ hasCompletedQuiz ? 'Terminé' : 'En attente' }}
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-label">Sondage Satisfaction</span>
            <div class="detail-status" :class="{ 'completed': hasCompletedSurvey }">
              <fluent-icon :icon="hasCompletedSurvey ? 'checkmark' : 'circle'"></fluent-icon>
              {{ hasCompletedSurvey ? 'Terminé' : 'En attente' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Results -->
      <div class="progress-card quiz-results">
        <h2>Résultats des Quiz</h2>
        <div v-if="quizResults.length > 0">
          <div 
            v-for="result in quizResults" 
            :key="result.id"
            class="result-item"
          >
            <div class="result-header">
              <h3>{{ result.quizType === 'Introduction' ? 'Quiz Introduction' : 'Sondage' }}</h3>
              <span class="result-date">{{ formatDate(result.endTime) }}</span>
            </div>
            
            <div v-if="result.quizType === 'Introduction'" class="score-display">
              <div class="score-circle-small">
                <span>{{ Math.round((result.correctAnswers! / result.totalQuestions) * 100) }}%</span>
              </div>
              <div class="score-details">
                <p>{{ result.correctAnswers }} / {{ result.totalQuestions }} bonnes réponses</p>
                <p>{{ result.score }} points</p>
                <p>Temps: {{ formatDuration(result.duration) }}</p>
              </div>
            </div>
            
            <div v-else class="survey-completion">
              <fluent-icon icon="form"></fluent-icon>
              <span>Sondage complété en {{ formatDuration(result.duration) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="no-results">
          <fluent-icon icon="info"></fluent-icon>
          <p>Aucun résultat disponible</p>
        </div>
      </div>

      <!-- Competence Evolution -->
      <div class="progress-card competence-evolution">
        <h2>Évolution des Compétences</h2>
        <div class="competence-chart">
          <canvas ref="competenceChart" width="400" height="300"></canvas>
        </div>
        <div class="competence-legend">
          <div 
            v-for="area in competenceAreas" 
            :key="area.id"
            class="legend-item"
          >
            <div class="legend-color" :style="{ backgroundColor: area.color }"></div>
            <span>{{ area.name }}</span>
          </div>
        </div>
      </div>

      <!-- Time Analysis -->
      <div class="progress-card time-analysis">
        <h2>Analyse du Temps</h2>
        <div class="time-stats">
          <div class="time-stat">
            <div class="stat-icon">
              <fluent-icon icon="clock"></fluent-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalTimeSpent }}</span>
              <span class="stat-label">Temps total</span>
            </div>
          </div>
          
          <div class="time-stat">
            <div class="stat-icon">
              <fluent-icon icon="timer"></fluent-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ averageTimePerQuestion }}</span>
              <span class="stat-label">Temps moyen/question</span>
            </div>
          </div>
          
          <div class="time-stat">
            <div class="stat-icon">
              <fluent-icon icon="calendar"></fluent-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ lastActivityDate }}</span>
              <span class="stat-label">Dernière activité</span>
            </div>
          </div>
        </div>
        
        <div class="time-chart">
          <canvas ref="timeChart" width="300" height="200"></canvas>
        </div>
      </div>

      <!-- Performance Trends -->
      <div class="progress-card performance-trends">
        <h2>Tendances de Performance</h2>
        <div class="trends-chart">
          <canvas ref="trendsChart" width="400" height="250"></canvas>
        </div>
        <div class="trends-summary">
          <div class="trend-item">
            <span class="trend-label">Progression moyenne</span>
            <span class="trend-value positive">+15%</span>
          </div>
          <div class="trend-item">
            <span class="trend-label">Constance</span>
            <span class="trend-value stable">Stable</span>
          </div>
        </div>
      </div>

      <!-- Next Goals -->
      <div class="progress-card next-goals">
        <h2>Prochains Objectifs</h2>
        <div class="goals-list">
          <div 
            v-for="goal in nextGoals" 
            :key="goal.id"
            class="goal-item"
            :class="{ 'completed': goal.completed }"
          >
            <div class="goal-icon">
              <fluent-icon :icon="goal.completed ? 'checkmark-circle' : 'target'"></fluent-icon>
            </div>
            <div class="goal-content">
              <h4>{{ goal.title }}</h4>
              <p>{{ goal.description }}</p>
              <div v-if="goal.deadline" class="goal-deadline">
                Échéance: {{ formatDate(goal.deadline) }}
              </div>
            </div>
            <div class="goal-progress">
              <div class="progress-bar-small">
                <div 
                  class="progress-fill-small" 
                  :style="{ width: `${goal.progress}%` }"
                ></div>
              </div>
              <span class="progress-text-small">{{ goal.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useQuizStore } from '@stores/quiz';
import { useUserStore } from '@stores/user';
import type { QuizResult, CompetenceArea } from '@types/index';

const quizStore = useQuizStore();
const userStore = useUserStore();

// Refs for charts
const progressChart = ref<HTMLCanvasElement>();
const competenceChart = ref<HTMLCanvasElement>();
const timeChart = ref<HTMLCanvasElement>();
const trendsChart = ref<HTMLCanvasElement>();

// Reactive data
const loading = ref(false);
const competenceAreas = ref<(CompetenceArea & { color: string })[]>([
  { id: '1', name: 'Leadership', description: '', levels: [], color: '#0078d4' },
  { id: '2', name: 'Communication', description: '', levels: [], color: '#107c10' },
  { id: '3', name: 'Technique', description: '', levels: [], color: '#d13438' },
  { id: '4', name: 'Management', description: '', levels: [], color: '#8a8400' },
  { id: '5', name: 'Innovation', description: '', levels: [], color: '#5c2d91' },
  { id: '6', name: 'Qualité', description: '', levels: [], color: '#0f6cbd' }
]);

const nextGoals = ref([
  {
    id: '1',
    title: 'Évaluation des compétences techniques',
    description: 'Programmer une évaluation avec votre manager',
    completed: false,
    progress: 25,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Formation en leadership',
    description: 'Suivre le module de formation en leadership',
    completed: false,
    progress: 0,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
]);

// Computed properties
const quizResults = computed(() => quizStore.userResults);

const hasCompletedQuiz = computed(() => 
  quizResults.value.some(r => r.quizType === 'Introduction' && r.status === 'Completed')
);

const hasCompletedSurvey = computed(() => 
  quizResults.value.some(r => r.quizType === 'Sondage' && r.status === 'Completed')
);

const overallProgress = computed(() => {
  let completed = 0;
  let total = 2;
  
  if (hasCompletedQuiz.value) completed++;
  if (hasCompletedSurvey.value) completed++;
  
  return Math.round((completed / total) * 100);
});

const totalTimeSpent = computed(() => {
  const totalSeconds = quizResults.value.reduce((sum, result) => sum + result.duration, 0);
  return formatDuration(totalSeconds);
});

const averageTimePerQuestion = computed(() => {
  const totalQuestions = quizResults.value.reduce((sum, result) => sum + result.totalQuestions, 0);
  const totalTime = quizResults.value.reduce((sum, result) => sum + result.duration, 0);
  
  if (totalQuestions === 0) return '0s';
  
  const avgSeconds = totalTime / totalQuestions;
  return `${Math.round(avgSeconds)}s`;
});

const lastActivityDate = computed(() => {
  if (quizResults.value.length === 0) return 'Aucune';
  
  const lastResult = quizResults.value.sort((a, b) => 
    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  )[0];
  
  return formatDate(lastResult.endTime);
});

// Methods
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

const refreshData = async () => {
  loading.value = true;
  try {
    await quizStore.loadUserResults();
    await nextTick();
    drawCharts();
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    loading.value = false;
  }
};

const exportResults = () => {
  // Export functionality
  const data = {
    overallProgress: overallProgress.value,
    quizResults: quizResults.value,
    competenceAreas: competenceAreas.value,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `competence-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const drawCharts = () => {
  drawProgressChart();
  drawCompetenceChart();
  drawTimeChart();
  drawTrendsChart();
};

const drawProgressChart = () => {
  if (!progressChart.value) return;
  
  const ctx = progressChart.value.getContext('2d');
  if (!ctx) return;
  
  const centerX = 75;
  const centerY = 75;
  const radius = 60;
  const progress = overallProgress.value / 100;
  
  // Clear canvas
  ctx.clearRect(0, 0, 150, 150);
  
  // Draw background circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#f3f2f1';
  ctx.lineWidth = 8;
  ctx.stroke();
  
  // Draw progress arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (progress * 2 * Math.PI));
  ctx.strokeStyle = '#0078d4';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();
};

const drawCompetenceChart = () => {
  if (!competenceChart.value) return;
  
  const ctx = competenceChart.value.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, 400, 300);
  
  // Sample radar chart data
  const data = competenceAreas.value.map(() => Math.floor(Math.random() * 5) + 1);
  const maxValue = 5;
  const centerX = 200;
  const centerY = 150;
  const radius = 100;
  
  // Draw grid
  ctx.strokeStyle = '#edebe9';
  ctx.lineWidth = 1;
  
  for (let i = 1; i <= maxValue; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, (radius * i) / maxValue, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // Draw axes
  for (let i = 0; i < competenceAreas.value.length; i++) {
    const angle = (i * 2 * Math.PI) / competenceAreas.value.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  
  // Draw data
  ctx.strokeStyle = '#0078d4';
  ctx.fillStyle = 'rgba(0, 120, 212, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  for (let i = 0; i < data.length; i++) {
    const angle = (i * 2 * Math.PI) / data.length - Math.PI / 2;
    const value = (data[i] * radius) / maxValue;
    const x = centerX + value * Math.cos(angle);
    const y = centerY + value * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawTimeChart = () => {
  if (!timeChart.value) return;
  
  const ctx = timeChart.value.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, 300, 200);
  
  // Simple bar chart for time spent
  const data = [45, 30, 60, 25, 40]; // Sample data in minutes
  const barWidth = 40;
  const barSpacing = 10;
  const maxHeight = 150;
  const maxValue = Math.max(...data);
  
  ctx.fillStyle = '#0078d4';
  
  for (let i = 0; i < data.length; i++) {
    const x = 20 + i * (barWidth + barSpacing);
    const height = (data[i] / maxValue) * maxHeight;
    const y = 180 - height;
    
    ctx.fillRect(x, y, barWidth, height);
  }
};

const drawTrendsChart = () => {
  if (!trendsChart.value) return;
  
  const ctx = trendsChart.value.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, 400, 250);
  
  // Sample trend line
  const data = [65, 70, 75, 78, 82, 85, 88];
  const stepX = 50;
  const stepY = 2;
  const offsetX = 30;
  const offsetY = 200;
  
  ctx.strokeStyle = '#107c10';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let i = 0; i < data.length; i++) {
    const x = offsetX + i * stepX;
    const y = offsetY - data[i] * stepY;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Draw points
  ctx.fillStyle = '#107c10';
  for (let i = 0; i < data.length; i++) {
    const x = offsetX + i * stepX;
    const y = offsetY - data[i] * stepY;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  }
};

// Lifecycle
onMounted(async () => {
  await refreshData();
});
</script>

<style scoped>
.progress-tracker {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edebe9;
}

.tracker-header h1 {
  color: #323130;
  margin: 0;
  font-size: 2rem;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.progress-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #edebe9;
}

.progress-card h2 {
  color: #323130;
  margin: 0 0 20px 0;
  font-size: 1.25rem;
}

/* Overall Progress */
.overall-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-circle {
  position: relative;
  margin-bottom: 25px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-percentage {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #0078d4;
}

.progress-label {
  display: block;
  font-size: 0.9rem;
  color: #605e5c;
}

.progress-details {
  width: 100%;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f2f1;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #323130;
  font-weight: 600;
}

.detail-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #605e5c;
  font-size: 0.9rem;
}

.detail-status.completed {
  color: #107c10;
}

/* Quiz Results */
.result-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #edebe9;
  border-radius: 6px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-header h3 {
  margin: 0;
  color: #323130;
}

.result-date {
  color: #605e5c;
  font-size: 0.9rem;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score-circle-small {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #0078d4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.score-details p {
  margin: 2px 0;
  color: #605e5c;
  font-size: 0.9rem;
}

.survey-completion {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #605e5c;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #605e5c;
}

/* Competence Evolution */
.competence-chart {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.competence-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* Time Analysis */
.time-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.time-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0078d4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #323130;
}

.stat-label {
  font-size: 0.8rem;
  color: #605e5c;
}

.time-chart {
  display: flex;
  justify-content: center;
}

/* Performance Trends */
.trends-chart {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.trends-summary {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.trend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.trend-label {
  color: #605e5c;
  font-size: 0.9rem;
}

.trend-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.trend-value.positive {
  color: #107c10;
}

.trend-value.stable {
  color: #8a8400;
}

/* Next Goals */
.goals-list {
  space-y: 15px;
}

.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border: 1px solid #edebe9;
  border-radius: 6px;
  margin-bottom: 15px;
}

.goal-item.completed {
  background-color: #f8f9fa;
  border-color: #107c10;
}

.goal-icon {
  width: 24px;
  height: 24px;
  color: #605e5c;
  margin-top: 2px;
}

.goal-item.completed .goal-icon {
  color: #107c10;
}

.goal-content {
  flex: 1;
}

.goal-content h4 {
  margin: 0 0 8px 0;
  color: #323130;
}

.goal-content p {
  margin: 0 0 8px 0;
  color: #605e5c;
  font-size: 0.9rem;
}

.goal-deadline {
  color: #d13438;
  font-size: 0.8rem;
  font-weight: 600;
}

.goal-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  min-width: 80px;
}

.progress-bar-small {
  width: 60px;
  height: 4px;
  background-color: #f3f2f1;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background-color: #0078d4;
  transition: width 0.3s ease;
}

.progress-text-small {
  font-size: 0.8rem;
  color: #605e5c;
  font-weight: 600;
}

@media (max-width: 768px) {
  .progress-tracker {
    padding: 15px;
  }
  
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .tracker-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .time-stats {
    grid-template-columns: 1fr;
  }
  
  .trends-summary {
    flex-direction: column;
    align-items: center;
  }
}
</style>