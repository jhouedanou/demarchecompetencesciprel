<template>
  <div class="quiz-introduction">
    <div class="quiz-header">
      <div class="quiz-brand">
        <img src="/assets/images/logo.webp" alt="CIPREL Logo" class="quiz-logo" />
        <div class="quiz-title">
          <h2>Quiz d'Introduction - Démarche Compétence CIPREL</h2>
          <p class="quiz-description">Évaluez vos connaissances sur les compétences professionnelles</p>
        </div>
      </div>
      <div class="quiz-info">
        <span class="question-counter">Question {{ currentQuestionIndex + 1 }} sur {{ questions.length }}</span>
        <div class="timer" v-if="timeRemaining > 0">
          <fluent-icon icon="timer"></fluent-icon>
          <span>{{ formatTime(timeRemaining) }}</span>
        </div>
      </div>
    </div>

    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
      ></div>
    </div>

    <div v-if="!quizCompleted && currentQuestion" class="question-container">
      <div class="question-card">
        <h3 class="question-text">{{ currentQuestion.question }}</h3>
        <div class="question-category">{{ currentQuestion.category }}</div>
        
        <div class="options-container">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="option.id"
            class="option-item"
            :class="{ 'selected': selectedAnswer === option.id }"
            @click="selectAnswer(option.id)"
          >
            <div class="option-radio">
              <input 
                type="radio" 
                :id="`option-${option.id}`"
                :value="option.id"
                v-model="selectedAnswer"
              />
              <label :for="`option-${option.id}`">{{ option.text }}</label>
            </div>
          </div>
        </div>

        <div class="question-actions">
          <fluent-button 
            v-if="currentQuestionIndex > 0"
            appearance="secondary"
            @click="previousQuestion"
          >
            Précédent
          </fluent-button>
          
          <fluent-button 
            v-if="currentQuestionIndex < questions.length - 1"
            appearance="primary"
            :disabled="!selectedAnswer"
            @click="nextQuestion"
          >
            Suivant
          </fluent-button>
          
          <fluent-button 
            v-if="currentQuestionIndex === questions.length - 1"
            appearance="primary"
            :disabled="!selectedAnswer"
            @click="completeQuiz"
          >
            Terminer le Quiz
          </fluent-button>
        </div>
      </div>
    </div>

    <div v-if="quizCompleted" class="quiz-results">
      <div class="results-card">
        <div class="results-header">
          <fluent-icon icon="checkmark-circle" size="48"></fluent-icon>
          <h2>Quiz Terminé !</h2>
        </div>
        
        <div class="score-display">
          <div class="score-circle">
            <span class="score-value">{{ Math.round((correctAnswers / questions.length) * 100) }}%</span>
          </div>
          <div class="score-details">
            <p>{{ correctAnswers }} bonnes réponses sur {{ questions.length }}</p>
            <p>Score: {{ totalScore }} points</p>
            <p>Temps: {{ formatTime(totalDuration) }}</p>
          </div>
        </div>

        <div class="feedback-section">
          <h3>Votre Performance</h3>
          <p v-if="scorePercentage >= 80" class="feedback-excellent">
            Excellent ! Vous maîtrisez bien les concepts de la démarche compétence.
          </p>
          <p v-else-if="scorePercentage >= 60" class="feedback-good">
            Bien ! Vous avez une bonne compréhension générale, quelques révisions pourraient être utiles.
          </p>
          <p v-else class="feedback-needs-improvement">
            Il serait bénéfique de revoir les concepts fondamentaux de la démarche compétence.
          </p>
        </div>

        <div class="next-steps">
          <fluent-button appearance="primary" @click="goToDashboard">
            Voir le Tableau de Bord
          </fluent-button>
          <fluent-button appearance="secondary" @click="retakeQuiz">
            Reprendre le Quiz
          </fluent-button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <fluent-progress-ring></fluent-progress-ring>
      <p>Chargement du quiz...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useQuizStore } from '@stores/quiz';
import { useUserStore } from '@stores/user';
import type { QuizQuestion, QuizResponse } from '@types/index';

const quizStore = useQuizStore();
const userStore = useUserStore();

// Reactive data
const loading = ref(false);
const questions = ref<QuizQuestion[]>([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref('');
const responses = ref<QuizResponse[]>([]);
const startTime = ref<Date>(new Date());
const questionStartTime = ref<Date>(new Date());
const quizCompleted = ref(false);
const timeRemaining = ref(1800); // 30 minutes
let timer: NodeJS.Timeout | null = null;

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const correctAnswers = computed(() => responses.value.filter(r => r.correct).length);
const totalScore = computed(() => responses.value.reduce((sum, r) => sum + (r.correct ? questions.value.find(q => q.id === r.questionId)?.points || 0 : 0), 0));
const scorePercentage = computed(() => Math.round((correctAnswers.value / questions.value.length) * 100));
const totalDuration = computed(() => responses.value.reduce((sum, r) => sum + r.timeSpent, 0));

// Methods
const loadQuestions = async () => {
  loading.value = true;
  try {
    await quizStore.loadIntroductionQuestions();
    questions.value = quizStore.introductionQuestions;
    startTime.value = new Date();
    questionStartTime.value = new Date();
    startTimer();
  } catch (error) {
    console.error('Error loading questions:', error);
  } finally {
    loading.value = false;
  }
};

const startTimer = () => {
  timer = setInterval(() => {
    timeRemaining.value--;
    if (timeRemaining.value <= 0) {
      completeQuiz();
    }
  }, 1000);
};

const selectAnswer = (answerId: string) => {
  selectedAnswer.value = answerId;
};

const nextQuestion = () => {
  saveCurrentResponse();
  currentQuestionIndex.value++;
  selectedAnswer.value = '';
  questionStartTime.value = new Date();
};

const previousQuestion = () => {
  currentQuestionIndex.value--;
  const previousResponse = responses.value.find(r => r.questionId === currentQuestion.value.id);
  selectedAnswer.value = previousResponse?.answer as string || '';
};

const saveCurrentResponse = () => {
  const timeSpent = (new Date().getTime() - questionStartTime.value.getTime()) / 1000;
  const question = currentQuestion.value;
  const isCorrect = selectedAnswer.value === question.correctAnswer;

  const response: QuizResponse = {
    questionId: question.id,
    answer: selectedAnswer.value,
    correct: isCorrect,
    timeSpent
  };

  const existingIndex = responses.value.findIndex(r => r.questionId === question.id);
  if (existingIndex >= 0) {
    responses.value[existingIndex] = response;
  } else {
    responses.value.push(response);
  }

  // Auto-save progress
  saveProgress();
};

const completeQuiz = async () => {
  if (selectedAnswer.value) {
    saveCurrentResponse();
  }

  if (timer) {
    clearInterval(timer);
  }

  const endTime = new Date();
  const totalDuration = (endTime.getTime() - startTime.value.getTime()) / 1000;

  const result = {
    userId: userStore.currentUser?.email || '',
    userName: userStore.currentUser?.title || '',
    quizType: 'Introduction' as const,
    responses: responses.value,
    score: totalScore.value,
    totalQuestions: questions.value.length,
    correctAnswers: correctAnswers.value,
    startTime: startTime.value,
    endTime,
    duration: totalDuration,
    status: 'Completed' as const
  };

  try {
    await quizStore.saveQuizResult(result);
    quizCompleted.value = true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

const saveProgress = async () => {
  try {
    const progressData = {
      userId: userStore.currentUser?.email || '',
      quizType: 'Introduction',
      responses: responses.value,
      currentQuestion: currentQuestionIndex.value,
      startTime: startTime.value,
      status: 'In Progress'
    };
    await quizStore.saveProgress(progressData);
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

const retakeQuiz = () => {
  currentQuestionIndex.value = 0;
  selectedAnswer.value = '';
  responses.value = [];
  quizCompleted.value = false;
  timeRemaining.value = 1800;
  startTime.value = new Date();
  questionStartTime.value = new Date();
  startTimer();
};

const goToDashboard = () => {
  // Navigate to dashboard
  window.location.hash = '#/dashboard';
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Lifecycle
onMounted(() => {
  loadQuestions();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.quiz-introduction {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quiz-header h2 {
  color: #323130;
  margin: 0;
}

.quiz-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.question-counter {
  font-weight: 600;
  color: #605e5c;
}

.timer {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #d13438;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #f3f2f1;
  border-radius: 2px;
  margin-bottom: 30px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #0078d4;
  transition: width 0.3s ease;
}

.question-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #edebe9;
}

.question-text {
  font-size: 1.25rem;
  color: #323130;
  margin-bottom: 10px;
  line-height: 1.4;
}

.question-category {
  background-color: #f3f2f1;
  color: #605e5c;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 25px;
}

.options-container {
  margin-bottom: 30px;
}

.option-item {
  margin-bottom: 12px;
  padding: 15px;
  border: 1px solid #edebe9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #0078d4;
  background-color: #f8f9fa;
}

.option-item.selected {
  border-color: #0078d4;
  background-color: #deecf9;
}

.option-radio {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-radio input[type="radio"] {
  margin: 0;
}

.option-radio label {
  cursor: pointer;
  color: #323130;
  line-height: 1.4;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.quiz-results {
  text-align: center;
}

.results-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #edebe9;
}

.results-header {
  margin-bottom: 30px;
}

.results-header h2 {
  color: #107c10;
  margin: 10px 0 0 0;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0078d4, #106ebe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-value {
  font-size: 1.75rem;
  font-weight: 700;
}

.score-details {
  text-align: left;
}

.score-details p {
  margin: 5px 0;
  color: #605e5c;
}

.feedback-section {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 6px;
}

.feedback-excellent {
  color: #107c10;
  background-color: #f3f9f3;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #107c10;
}

.feedback-good {
  color: #8a8400;
  background-color: #fffef5;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #ffb900;
}

.feedback-needs-improvement {
  color: #d13438;
  background-color: #fdf6f6;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #d13438;
}

.next-steps {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .quiz-introduction {
    padding: 15px;
  }
  
  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .score-display {
    flex-direction: column;
    gap: 20px;
  }
  
  .next-steps {
    flex-direction: column;
  }
}
</style>