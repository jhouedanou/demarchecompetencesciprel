<template>
  <div class="quiz-sondage">
    <div class="quiz-header">
      <h2>Sondage de Satisfaction - Démarche Compétence</h2>
      <div class="quiz-info">
        <span class="question-counter">Question {{ currentQuestionIndex + 1 }} sur {{ questions.length }}</span>
      </div>
    </div>

    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
      ></div>
    </div>

    <div v-if="!surveyCompleted && currentQuestion" class="question-container">
      <div class="question-card">
        <h3 class="question-text">{{ currentQuestion.question }}</h3>
        <div class="question-required" v-if="currentQuestion.required">
          <span class="required-indicator">*</span>
          <span>Cette question est obligatoire</span>
        </div>
        
        <!-- Multiple Choice Questions -->
        <div v-if="currentQuestion.type === 'multiple-choice'" class="options-container">
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

        <!-- Rating Questions -->
        <div v-if="currentQuestion.type === 'rating'" class="rating-container">
          <div class="rating-scale">
            <div class="rating-labels">
              <span>Très insatisfait</span>
              <span>Très satisfait</span>
            </div>
            <div class="rating-buttons">
              <div 
                v-for="rating in 5" 
                :key="rating"
                class="rating-button"
                :class="{ 'selected': selectedAnswer === rating.toString() }"
                @click="selectAnswer(rating.toString())"
              >
                <span>{{ rating }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Questions -->
        <div v-if="currentQuestion.type === 'text'" class="text-container">
          <fluent-text-area
            v-model="textAnswer"
            placeholder="Votre réponse..."
            rows="4"
            resize="vertical"
            @input="onTextInput"
          ></fluent-text-area>
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
            :disabled="!isAnswerValid"
            @click="nextQuestion"
          >
            Suivant
          </fluent-button>
          
          <fluent-button 
            v-if="currentQuestionIndex === questions.length - 1"
            appearance="primary"
            :disabled="!isAnswerValid"
            @click="completeSurvey"
          >
            Terminer le Sondage
          </fluent-button>
        </div>
      </div>
    </div>

    <div v-if="surveyCompleted" class="survey-results">
      <div class="results-card">
        <div class="results-header">
          <fluent-icon icon="checkmark-circle" size="48"></fluent-icon>
          <h2>Sondage Terminé !</h2>
          <p>Merci pour votre participation et vos commentaires précieux.</p>
        </div>
        
        <div class="completion-summary">
          <div class="summary-item">
            <fluent-icon icon="form"></fluent-icon>
            <div>
              <strong>{{ answeredQuestions }}</strong>
              <span>questions répondues</span>
            </div>
          </div>
          
          <div class="summary-item">
            <fluent-icon icon="clock"></fluent-icon>
            <div>
              <strong>{{ formatTime(totalDuration) }}</strong>
              <span>temps total</span>
            </div>
          </div>
        </div>

        <div class="feedback-message">
          <h3>Vos réponses nous aident à améliorer</h3>
          <p>
            Votre feedback est essentiel pour l'amélioration continue de notre démarche compétence. 
            Vos suggestions seront analysées par l'équipe RH et prises en compte dans les prochaines évolutions.
          </p>
        </div>

        <div class="next-steps">
          <fluent-button appearance="primary" @click="goToDashboard">
            Retour au Tableau de Bord
          </fluent-button>
          <fluent-button appearance="secondary" @click="viewResults">
            Voir Mes Résultats
          </fluent-button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <fluent-progress-ring></fluent-progress-ring>
      <p>Chargement du sondage...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
const textAnswer = ref('');
const responses = ref<QuizResponse[]>([]);
const startTime = ref<Date>(new Date());
const questionStartTime = ref<Date>(new Date());
const surveyCompleted = ref(false);

// Computed properties
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const answeredQuestions = computed(() => responses.value.length);
const totalDuration = computed(() => responses.value.reduce((sum, r) => sum + r.timeSpent, 0));

const isAnswerValid = computed(() => {
  if (!currentQuestion.value) return false;
  
  if (currentQuestion.value.required) {
    if (currentQuestion.value.type === 'text') {
      return textAnswer.value.trim().length > 0;
    } else {
      return selectedAnswer.value !== '';
    }
  }
  
  return true; // Non-required questions are always valid
});

// Methods
const loadQuestions = async () => {
  loading.value = true;
  try {
    await quizStore.loadSondageQuestions();
    questions.value = quizStore.sondageQuestions;
    startTime.value = new Date();
    questionStartTime.value = new Date();
  } catch (error) {
    console.error('Error loading survey questions:', error);
  } finally {
    loading.value = false;
  }
};

const selectAnswer = (answerId: string) => {
  selectedAnswer.value = answerId;
};

const onTextInput = () => {
  selectedAnswer.value = textAnswer.value;
};

const nextQuestion = () => {
  saveCurrentResponse();
  currentQuestionIndex.value++;
  resetAnswerState();
};

const previousQuestion = () => {
  currentQuestionIndex.value--;
  loadPreviousAnswer();
};

const resetAnswerState = () => {
  selectedAnswer.value = '';
  textAnswer.value = '';
  questionStartTime.value = new Date();
};

const loadPreviousAnswer = () => {
  const previousResponse = responses.value.find(r => r.questionId === currentQuestion.value.id);
  if (previousResponse) {
    selectedAnswer.value = previousResponse.answer as string;
    if (currentQuestion.value.type === 'text') {
      textAnswer.value = previousResponse.answer as string;
    }
  } else {
    resetAnswerState();
  }
};

const saveCurrentResponse = () => {
  const timeSpent = (new Date().getTime() - questionStartTime.value.getTime()) / 1000;
  const question = currentQuestion.value;
  
  let answerValue: string | number = selectedAnswer.value;
  if (question.type === 'rating') {
    answerValue = parseInt(selectedAnswer.value);
  }

  const response: QuizResponse = {
    questionId: question.id,
    answer: answerValue,
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

const completeSurvey = async () => {
  if (isAnswerValid.value) {
    saveCurrentResponse();
  }

  const endTime = new Date();
  const totalDuration = (endTime.getTime() - startTime.value.getTime()) / 1000;

  const result = {
    userId: userStore.currentUser?.email || '',
    userName: userStore.currentUser?.title || '',
    quizType: 'Sondage' as const,
    responses: responses.value,
    totalQuestions: questions.value.length,
    startTime: startTime.value,
    endTime,
    duration: totalDuration,
    status: 'Completed' as const
  };

  try {
    await quizStore.saveQuizResult(result);
    surveyCompleted.value = true;
  } catch (error) {
    console.error('Error saving survey result:', error);
  }
};

const saveProgress = async () => {
  try {
    const progressData = {
      userId: userStore.currentUser?.email || '',
      quizType: 'Sondage',
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

const goToDashboard = () => {
  window.location.hash = '#/dashboard';
};

const viewResults = () => {
  window.location.hash = '#/results';
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}min ${remainingSeconds}s`;
};

// Lifecycle
onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
.quiz-sondage {
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
  margin-bottom: 15px;
  line-height: 1.4;
}

.question-required {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 25px;
  color: #d13438;
  font-size: 0.9rem;
}

.required-indicator {
  font-weight: bold;
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

.rating-container {
  margin-bottom: 30px;
}

.rating-scale {
  text-align: center;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #605e5c;
}

.rating-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.rating-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #edebe9;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #605e5c;
}

.rating-button:hover {
  border-color: #0078d4;
  background-color: #f8f9fa;
}

.rating-button.selected {
  border-color: #0078d4;
  background-color: #0078d4;
  color: white;
}

.text-container {
  margin-bottom: 30px;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.survey-results {
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
  margin: 10px 0;
}

.results-header p {
  color: #605e5c;
  font-size: 1.1rem;
}

.completion-summary {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-item div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.summary-item strong {
  font-size: 1.25rem;
  color: #323130;
}

.summary-item span {
  color: #605e5c;
  font-size: 0.9rem;
}

.feedback-message {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #0078d4;
}

.feedback-message h3 {
  color: #323130;
  margin-bottom: 10px;
}

.feedback-message p {
  color: #605e5c;
  line-height: 1.5;
  margin: 0;
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
  .quiz-sondage {
    padding: 15px;
  }
  
  .quiz-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .completion-summary {
    flex-direction: column;
    gap: 20px;
  }
  
  .next-steps {
    flex-direction: column;
  }
  
  .rating-buttons {
    gap: 5px;
  }
  
  .rating-button {
    width: 40px;
    height: 40px;
  }
}
</style>