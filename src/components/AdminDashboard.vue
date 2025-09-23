<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div class="header-brand">
        <img src="/assets/images/logo.webp" alt="CIPREL Logo" class="ciprel-logo" />
        <div class="header-text">
          <h1>Administration - Gestion des Quiz</h1>
          <p class="header-subtitle">Plateforme de gestion des compétences CIPREL</p>
        </div>
      </div>
      <div class="header-actions">
        <fluent-button appearance="secondary" @click="exportData" :disabled="loading">
          <fluent-icon icon="download" slot="start"></fluent-icon>
          Exporter Données
        </fluent-button>
      </div>
    </div>
    
    <!-- Messages d'erreur -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="error = null" class="close-error">&times;</button>
    </div>
    
    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      Chargement...
    </div>

    <!-- Statistiques rapides -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-ciprel-primary">
          <fluent-icon icon="quiz-new"></fluent-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalQuizQuestions }}</div>
          <div class="stat-label">Questions Quiz</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-ciprel-secondary">
          <fluent-icon icon="form"></fluent-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalSurveyQuestions }}</div>
          <div class="stat-label">Questions Sondage</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon gradient-ciprel-warm">
          <fluent-icon icon="people"></fluent-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalParticipants }}</div>
          <div class="stat-label">Participants</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon gradient-ciprel-cool">
          <fluent-icon icon="chart-line"></fluent-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ averageScore }}%</div>
          <div class="stat-label">Score Moyen</div>
        </div>
      </div>
    </div>

    <!-- Onglets de gestion -->
    <div class="admin-tabs">
      <fluent-tabs @tab-change="onTabChange" :selected-tab="activeTab">
        <fluent-tab id="quiz-intro">Quiz Introduction</fluent-tab>
        <fluent-tab id="quiz-sondage">Questions Sondage</fluent-tab>
        <fluent-tab id="results">Résultats</fluent-tab>
        <fluent-tab id="analytics">Analytics</fluent-tab>
      </fluent-tabs>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content">
      
      <!-- Gestion Quiz Introduction -->
      <div v-if="activeTab === 'quiz-intro'" class="quiz-management">
        <div class="section-header">
          <h2>Questions Quiz Introduction</h2>
          <fluent-button appearance="primary" @click="addNewQuestion('introduction')">
            <fluent-icon icon="add" slot="start"></fluent-icon>
            Ajouter Question
          </fluent-button>
        </div>
        
        <div class="questions-list">
          <div 
            v-for="question in introQuestions" 
            :key="question.id"
            class="question-card"
          >
            <div class="question-header">
              <div class="question-info">
                <h3>{{ question.title }}</h3>
                <span class="question-category">{{ question.category }}</span>
                <span class="question-points">{{ question.points }} pts</span>
              </div>
              <div class="question-actions">
                <fluent-button appearance="subtle" @click="editQuestion(question)">
                  <fluent-icon icon="edit"></fluent-icon>
                </fluent-button>
                <fluent-button appearance="subtle" @click="deleteQuestion(question.id)">
                  <fluent-icon icon="delete"></fluent-icon>
                </fluent-button>
              </div>
            </div>
            
            <div class="question-text">{{ question.question }}</div>
            
            <div class="question-options">
              <div 
                v-for="(option, index) in question.options" 
                :key="index"
                class="option-item"
                :class="{ 'correct': option.correct }"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                {{ option.text }}
                <fluent-icon v-if="option.correct" icon="checkmark" class="correct-icon"></fluent-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gestion Questions Sondage -->
      <div v-if="activeTab === 'quiz-sondage'" class="survey-management">
        <div class="section-header">
          <h2>Questions Sondage de Satisfaction</h2>
          <fluent-button appearance="primary" @click="addNewQuestion('sondage')">
            <fluent-icon icon="add" slot="start"></fluent-icon>
            Ajouter Question
          </fluent-button>
        </div>
        
        <div class="questions-list">
          <div 
            v-for="question in sondageQuestions" 
            :key="question.id"
            class="question-card"
          >
            <div class="question-header">
              <div class="question-info">
                <h3>{{ question.title }}</h3>
                <span class="question-type">{{ question.type }}</span>
                <span v-if="question.required" class="required-badge">Obligatoire</span>
              </div>
              <div class="question-actions">
                <fluent-button appearance="subtle" @click="editQuestion(question)">
                  <fluent-icon icon="edit"></fluent-icon>
                </fluent-button>
                <fluent-button appearance="subtle" @click="deleteQuestion(question.id)">
                  <fluent-icon icon="delete"></fluent-icon>
                </fluent-button>
              </div>
            </div>
            
            <div class="question-text">{{ question.question }}</div>
            
            <div v-if="question.type === 'multiple-choice'" class="question-options">
              <div 
                v-for="(option, index) in question.options" 
                :key="index"
                class="option-item"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                {{ option.text }}
              </div>
            </div>
            
            <div v-else-if="question.type === 'rating'" class="rating-preview">
              <span>Échelle de 1 à 5</span>
              <div class="rating-scale">
                <span v-for="n in 5" :key="n" class="rating-dot">{{ n }}</span>
              </div>
            </div>
            
            <div v-else-if="question.type === 'text'" class="text-preview">
              <fluent-text-area placeholder="Réponse libre..." disabled></fluent-text-area>
            </div>
          </div>
        </div>
      </div>

      <!-- Résultats -->
      <div v-if="activeTab === 'results'" class="results-management">
        <div class="section-header">
          <h2>Résultats des Participants</h2>
          <div class="filters">
            <fluent-select v-model="selectedQuizType">
              <option value="">Tous les quiz</option>
              <option value="Introduction">Quiz Introduction</option>
              <option value="Sondage">Sondage</option>
            </fluent-select>
            <fluent-button appearance="secondary" @click="exportResults">
              <fluent-icon icon="download" slot="start"></fluent-icon>
              Exporter
            </fluent-button>
          </div>
        </div>
        
        <div class="results-table">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Type Quiz</th>
                <th>Score</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="result in filteredResults" 
                :key="result.id"
                class="result-row"
              >
                <td>{{ result.userName }}</td>
                <td>{{ result.quizType }}</td>
                <td>
                  <span v-if="result.score !== undefined" class="score-badge">
                    {{ Math.round((result.correctAnswers / result.totalQuestions) * 100) }}%
                  </span>
                  <span v-else>N/A</span>
                </td>
                <td>{{ formatDate(result.endTime) }}</td>
                <td>{{ formatDuration(result.duration) }}</td>
                <td>
                  <span 
                    class="status-badge" 
                    :class="result.status.toLowerCase().replace(' ', '-')"
                  >
                    {{ result.status }}
                  </span>
                </td>
                <td>
                  <fluent-button appearance="subtle" @click="viewResultDetails(result)">
                    <fluent-icon icon="eye"></fluent-icon>
                  </fluent-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Analytics -->
      <div v-if="activeTab === 'analytics'" class="analytics-dashboard">
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Progression des Participations</h3>
            <canvas ref="participationChart" width="400" height="200"></canvas>
          </div>
          
          <div class="chart-card">
            <h3>Distribution des Scores</h3>
            <canvas ref="scoresChart" width="400" height="200"></canvas>
          </div>
          
          <div class="chart-card">
            <h3>Temps de Completion</h3>
            <canvas ref="timeChart" width="400" height="200"></canvas>
          </div>
          
          <div class="chart-card">
            <h3>Questions les Plus Difficiles</h3>
            <div class="difficult-questions">
              <div v-for="q in difficultQuestions" :key="q.id" class="difficult-item">
                <span class="question-title">{{ q.question }}</span>
                <span class="error-rate">{{ q.errorRate }}% d'erreur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/édition de question -->
    <fluent-dialog v-if="showQuestionModal" @close="closeQuestionModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingQuestion ? 'Modifier' : 'Ajouter' }} une Question</h2>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Titre de la question</label>
            <fluent-text-field v-model="questionForm.title" placeholder="Ex: Question 1"></fluent-text-field>
          </div>
          
          <div class="form-group">
            <label>Texte de la question</label>
            <fluent-text-area 
              v-model="questionForm.question" 
              placeholder="Saisissez votre question ici..."
              rows="3"
            ></fluent-text-area>
          </div>
          
          <div v-if="questionForm.type === 'introduction'" class="form-group">
            <label>Catégorie</label>
            <fluent-select v-model="questionForm.category">
              <option value="Définition">Définition</option>
              <option value="Responsabilité">Responsabilité</option>
              <option value="Compétences">Compétences</option>
              <option value="Étapes">Étapes</option>
            </fluent-select>
          </div>
          
          <div class="form-group">
            <label>Type de question</label>
            <fluent-select v-model="questionForm.questionType" @change="onQuestionTypeChange">
              <option value="multiple-choice">Choix multiple</option>
              <option value="text">Texte libre</option>
              <option value="rating">Notation</option>
            </fluent-select>
          </div>
          
          <!-- Options pour choix multiple -->
          <div v-if="questionForm.questionType === 'multiple-choice'" class="form-group">
            <label>Options de réponse</label>
            <div 
              v-for="(option, index) in questionForm.options" 
              :key="index"
              class="option-input"
            >
              <fluent-text-field 
                v-model="option.text" 
                :placeholder="`Option ${String.fromCharCode(65 + index)}`"
              ></fluent-text-field>
              <fluent-checkbox 
                v-if="questionForm.type === 'introduction'"
                v-model="option.correct"
                @change="onCorrectAnswerChange(index)"
              >
                Bonne réponse
              </fluent-checkbox>
              <fluent-button 
                appearance="subtle" 
                @click="removeOption(index)"
                :disabled="questionForm.options.length <= 2"
              >
                <fluent-icon icon="delete"></fluent-icon>
              </fluent-button>
            </div>
            
            <fluent-button 
              appearance="secondary" 
              @click="addOption"
              :disabled="questionForm.options.length >= 6"
            >
              <fluent-icon icon="add" slot="start"></fluent-icon>
              Ajouter Option
            </fluent-button>
          </div>
          
          <div v-if="questionForm.type === 'introduction'" class="form-group">
            <label>Points</label>
            <fluent-number-field v-model="questionForm.points" min="1" max="10"></fluent-number-field>
          </div>
          
          <div class="form-group">
            <label>Ordre d'affichage</label>
            <fluent-number-field v-model="questionForm.order" min="1"></fluent-number-field>
          </div>
          
          <div v-if="questionForm.type === 'sondage'" class="form-group">
            <fluent-checkbox v-model="questionForm.required">
              Question obligatoire
            </fluent-checkbox>
          </div>
        </div>
        
        <div class="modal-footer">
          <fluent-button appearance="secondary" @click="closeQuestionModal">
            Annuler
          </fluent-button>
          <fluent-button appearance="primary" @click="saveQuestion" :disabled="!isQuestionValid">
            {{ editingQuestion ? 'Modifier' : 'Ajouter' }}
          </fluent-button>
        </div>
      </div>
    </fluent-dialog>

    <!-- Modal de détails de résultat -->
    <fluent-dialog v-if="showResultModal" @close="closeResultModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Détails du Résultat</h2>
        </div>
        
        <div class="modal-body" v-if="selectedResult">
          <div class="result-summary">
            <h3>{{ selectedResult.userName }}</h3>
            <p>{{ selectedResult.quizType }} - {{ formatDate(selectedResult.endTime) }}</p>
          </div>
          
          <div class="responses-list">
            <div 
              v-for="response in selectedResult.responses" 
              :key="response.questionId"
              class="response-item"
            >
              <div class="response-question">Question {{ response.questionId }}</div>
              <div class="response-answer">{{ response.answer }}</div>
              <div v-if="response.correct !== undefined" class="response-status" :class="{ correct: response.correct }">
                {{ response.correct ? 'Correct' : 'Incorrect' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <fluent-button appearance="secondary" @click="closeResultModal">
            Fermer
          </fluent-button>
        </div>
      </div>
    </fluent-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import { useQuizStore } from '@stores/quiz';
import { useUserStore } from '@stores/user';
import type { QuizIntroductionItem, QuizSondageItem, QuizResultsItem } from '@types/index';
import { SharePointService } from '../webparts/demarcheCompetence/services/SharePointService';

const quizStore = useQuizStore();
const userStore = useUserStore();
const sharePointService = inject('sharePointService') as SharePointService;

// État réactif
const activeTab = ref('quiz-intro');
const showQuestionModal = ref(false);
const showResultModal = ref(false);
const editingQuestion = ref<QuizQuestion | null>(null);
const selectedResult = ref<QuizResult | null>(null);
const selectedQuizType = ref('');

// Formulaire de question
const questionForm = ref({
  title: '',
  question: '',
  type: 'introduction',
  questionType: 'multiple-choice',
  category: 'Définition',
  options: [
    { text: '', correct: false },
    { text: '', correct: false }
  ],
  points: 1,
  order: 1,
  required: false
});

// État des données
const introQuestions = ref<QuizIntroductionItem[]>([]);
const sondageQuestions = ref<QuizSondageItem[]>([]);
const allResults = ref<QuizResultsItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Computed
const totalQuizQuestions = computed(() => introQuestions.value.length);
const totalSurveyQuestions = computed(() => sondageQuestions.value.length);
const totalParticipants = computed(() => new Set(allResults.value.map(r => r.User?.Email || '')).size);
const averageScore = computed(() => {
  const scores = allResults.value.filter(r => r.Score !== undefined).map(r => r.Score!);
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
});

const filteredResults = computed(() => {
  if (!selectedQuizType.value) return allResults.value;
  return allResults.value.filter(r => r.QuizType === selectedQuizType.value);
});

const isQuestionValid = computed(() => {
  return questionForm.value.title && 
         questionForm.value.question && 
         (questionForm.value.questionType !== 'multiple-choice' || 
          questionForm.value.options.every(opt => opt.text.trim()));
});

const difficultQuestions = computed(() => {
  // Calculer les questions avec le plus d'erreurs
  return [
    { id: 1, question: "Question exemple 1", errorRate: 45 },
    { id: 2, question: "Question exemple 2", errorRate: 38 },
    { id: 3, question: "Question exemple 3", errorRate: 32 }
  ];
});

// Méthodes
const onTabChange = (tabId: string) => {
  activeTab.value = tabId;
};

const addNewQuestion = (type: 'introduction' | 'sondage') => {
  editingQuestion.value = null;
  questionForm.value = {
    title: '',
    question: '',
    type,
    questionType: 'multiple-choice',
    category: 'Définition',
    options: [
      { text: '', correct: false },
      { text: '', correct: false }
    ],
    points: 1,
    order: type === 'introduction' ? introQuestions.value.length + 1 : sondageQuestions.value.length + 1,
    required: false
  };
  showQuestionModal.value = true;
};

const editQuestion = (question: QuizQuestion) => {
  editingQuestion.value = question;
  questionForm.value = {
    title: question.title,
    question: question.question,
    type: question.correctAnswer ? 'introduction' : 'sondage',
    questionType: question.type,
    category: question.category || 'Définition',
    options: question.options.map(opt => ({ ...opt })),
    points: question.points,
    order: question.order,
    required: question.required || false
  };
  showQuestionModal.value = true;
};

const saveQuestion = async () => {
  try {
    const questionData = {
      title: questionForm.value.title,
      question: questionForm.value.question,
      type: questionForm.value.questionType,
      options: questionForm.value.options,
      points: questionForm.value.points,
      order: questionForm.value.order,
      category: questionForm.value.category,
      required: questionForm.value.required
    };

    if (editingQuestion.value) {
      // Modifier question existante
      await updateQuestion(editingQuestion.value.id, questionData);
    } else {
      // Ajouter nouvelle question
      await createQuestion(questionData);
    }

    closeQuestionModal();
    await loadAllData();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

const createQuestion = async (questionData: any) => {
  try {
    loading.value = true;
    error.value = null;
    
    if (questionData.type === 'introduction') {
      await sharePointService.addQuizIntroductionQuestion({
        Title: questionData.title,
        Question: questionData.question,
        Options: questionData.options,
        CorrectAnswer: questionData.options.find((opt: any) => opt.correct)?.value || '',
        Category: questionData.category,
        Points: questionData.points,
        Order: questionData.order
      });
      await loadIntroQuestions();
    } else {
      await sharePointService.addQuizSondageQuestion({
        Title: questionData.title,
        Question: questionData.question,
        QuestionType: questionData.questionType,
        Options: questionData.options,
        Required: questionData.required,
        Order: questionData.order
      });
      await loadSondageQuestions();
    }
  } catch (err) {
    error.value = 'Erreur lors de la création de la question';
    console.error('Erreur lors de la création:', err);
  } finally {
    loading.value = false;
  }
};

const updateQuestion = async (id: number, questionData: any) => {
  try {
    loading.value = true;
    error.value = null;
    
    if (questionData.type === 'introduction') {
      await sharePointService.updateQuizIntroductionQuestion(id, {
        Title: questionData.title,
        Question: questionData.question,
        Options: questionData.options,
        CorrectAnswer: questionData.options.find((opt: any) => opt.correct)?.value || '',
        Category: questionData.category,
        Points: questionData.points,
        Order: questionData.order
      });
      await loadIntroQuestions();
    } else {
      await sharePointService.updateQuizSondageQuestion(id, {
        Title: questionData.title,
        Question: questionData.question,
        QuestionType: questionData.questionType,
        Options: questionData.options,
        Required: questionData.required,
        Order: questionData.order
      });
      await loadSondageQuestions();
    }
  } catch (err) {
    error.value = 'Erreur lors de la mise à jour de la question';
    console.error('Erreur lors de la mise à jour:', err);
  } finally {
    loading.value = false;
  }
};

const deleteQuestion = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    try {
      loading.value = true;
      error.value = null;
      
      if (activeTab.value === 'quiz-intro') {
        await sharePointService.deleteQuizIntroductionQuestion(id);
        await loadIntroQuestions();
      } else {
        await sharePointService.deleteQuizSondageQuestion(id);
        await loadSondageQuestions();
      }
    } catch (err) {
      error.value = 'Erreur lors de la suppression de la question';
      console.error('Erreur lors de la suppression:', err);
    } finally {
      loading.value = false;
    }
  }
};

const closeQuestionModal = () => {
  showQuestionModal.value = false;
  editingQuestion.value = null;
};

const addOption = () => {
  if (questionForm.value.options.length < 6) {
    questionForm.value.options.push({ text: '', correct: false });
  }
};

const removeOption = (index: number) => {
  if (questionForm.value.options.length > 2) {
    questionForm.value.options.splice(index, 1);
  }
};

const onCorrectAnswerChange = (index: number) => {
  // Une seule bonne réponse pour les quiz d'introduction
  questionForm.value.options.forEach((opt, i) => {
    if (i !== index) opt.correct = false;
  });
};

const onQuestionTypeChange = () => {
  if (questionForm.value.questionType !== 'multiple-choice') {
    questionForm.value.options = [];
  } else {
    questionForm.value.options = [
      { text: '', correct: false },
      { text: '', correct: false }
    ];
  }
};

const viewResultDetails = (result: QuizResult) => {
  selectedResult.value = result;
  showResultModal.value = true;
};

const closeResultModal = () => {
  showResultModal.value = false;
  selectedResult.value = null;
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}min ${seconds % 60}s`;
};

const exportData = async () => {
  try {
    loading.value = true;
    await sharePointService.exportToExcel('Quiz_Introduction', 'questions-quiz.csv');
  } catch (err) {
    error.value = 'Erreur lors de l\'export des données';
    console.error('Erreur lors de l\'export:', err);
  } finally {
    loading.value = false;
  }
};

const exportResults = async () => {
  try {
    loading.value = true;
    await sharePointService.exportToExcel('Quiz_Results', 'resultats-quiz.csv');
  } catch (err) {
    error.value = 'Erreur lors de l\'export des résultats';
    console.error('Erreur lors de l\'export:', err);
  } finally {
    loading.value = false;
  }
};

const loadIntroQuestions = async () => {
  try {
    loading.value = true;
    error.value = null;
    introQuestions.value = await sharePointService.getQuizIntroductionQuestions();
  } catch (err) {
    error.value = 'Erreur lors du chargement des questions du quiz';
    console.error('Erreur lors du chargement des questions du quiz:', err);
  } finally {
    loading.value = false;
  }
};

const loadSondageQuestions = async () => {
  try {
    loading.value = true;
    error.value = null;
    sondageQuestions.value = await sharePointService.getQuizSondageQuestions();
  } catch (err) {
    error.value = 'Erreur lors du chargement des questions du sondage';
    console.error('Erreur lors du chargement des questions du sondage:', err);
  } finally {
    loading.value = false;
  }
};

const loadResults = async () => {
  try {
    loading.value = true;
    error.value = null;
    allResults.value = await sharePointService.getQuizResults();
  } catch (err) {
    error.value = 'Erreur lors du chargement des résultats';
    console.error('Erreur lors du chargement des résultats:', err);
  } finally {
    loading.value = false;
  }
};

const loadAllData = async () => {
  try {
    await Promise.all([
      loadIntroQuestions(),
      loadSondageQuestions(),
      loadResults()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

// Lifecycle
onMounted(async () => {
  if (sharePointService) {
    await loadAllData();
  }
});
</script>

<style scoped>
.admin-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: var(--font-family-primary);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--ciprel-primary);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.ciprel-logo {
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.ciprel-logo:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.header-text h1 {
  color: var(--ciprel-text-primary);
  margin: 0 0 5px 0;
  background: var(--ciprel-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold);
}

.header-subtitle {
  color: var(--ciprel-text-secondary);
  margin: 0;
  font-size: 0.9rem;
  font-weight: var(--font-weight-medium);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--ciprel-surface-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: var(--ciprel-shadow-md);
  border: 1px solid var(--ciprel-border-light);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ciprel-text-inverse);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
  color: var(--ciprel-text-primary);
}

.stat-label {
  color: var(--ciprel-text-secondary);
  font-size: 0.9rem;
}

.admin-tabs {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: var(--ciprel-text-primary);
  margin: 0;
}

.questions-list {
  display: grid;
  gap: 20px;
}

.question-card {
  background: var(--ciprel-surface-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  border: 1px solid var(--ciprel-border-light);
  box-shadow: var(--ciprel-shadow-sm);
  transition: var(--transition-base);
}

.question-card:hover {
  box-shadow: var(--ciprel-shadow-md);
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.question-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-info h3 {
  margin: 0;
  color: var(--ciprel-text-primary);
}

.question-category,
.question-type {
  background: var(--ciprel-primary);
  color: var(--ciprel-text-inverse);
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
  display: inline-block;
}

.question-points {
  background: var(--ciprel-secondary);
  color: var(--ciprel-text-inverse);
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
}

.required-badge {
  background: var(--ciprel-error);
  color: var(--ciprel-text-inverse);
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
}

.question-actions {
  display: flex;
  gap: 8px;
}

.question-text {
  color: var(--ciprel-text-primary);
  margin-bottom: 15px;
  font-weight: var(--font-weight-medium);
}

.question-options {
  display: grid;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--ciprel-neutral-100);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--ciprel-border-light);
}

.option-item.correct {
  background: var(--ciprel-success-light);
  border-color: var(--ciprel-success);
}

.option-letter {
  width: 24px;
  height: 24px;
  background: var(--ciprel-primary);
  color: var(--ciprel-text-inverse);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: 0.8rem;
}

.correct-icon {
  color: var(--ciprel-success);
  margin-left: auto;
}

.rating-preview {
  display: flex;
  align-items: center;
  gap: 15px;
}

.rating-scale {
  display: flex;
  gap: 8px;
}

.rating-dot {
  width: 32px;
  height: 32px;
  border: 2px solid var(--ciprel-border-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
}

.results-table {
  background: var(--ciprel-surface-tertiary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--ciprel-shadow-md);
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th {
  background: var(--ciprel-gradient-neutral);
  color: var(--ciprel-text-primary);
  padding: 15px;
  text-align: left;
  font-weight: var(--font-weight-semibold);
  border-bottom: 2px solid var(--ciprel-border-medium);
}

.results-table td {
  padding: 12px 15px;
  border-bottom: 1px solid var(--ciprel-border-light);
}

.result-row:hover {
  background: var(--ciprel-neutral-100);
}

.score-badge {
  background: var(--ciprel-gradient-primary);
  color: var(--ciprel-text-inverse);
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-weight: var(--font-weight-bold);
  font-size: 0.9rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: var(--border-radius-full);
  font-size: 0.8rem;
  font-weight: var(--font-weight-medium);
}

.status-badge.completed {
  background: var(--ciprel-success-light);
  color: var(--ciprel-success-dark);
}

.status-badge.in-progress {
  background: var(--ciprel-warning-light);
  color: var(--ciprel-warning-dark);
}

.status-badge.abandoned {
  background: var(--ciprel-error-light);
  color: var(--ciprel-error-dark);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  background: var(--ciprel-surface-tertiary);
  border-radius: var(--border-radius-lg);
  padding: 20px;
  border: 1px solid var(--ciprel-border-light);
  box-shadow: var(--ciprel-shadow-md);
}

.chart-card h3 {
  color: var(--ciprel-text-primary);
  margin: 0 0 20px 0;
  border-bottom: 2px solid var(--ciprel-primary);
  padding-bottom: 10px;
}

.difficult-questions {
  display: grid;
  gap: 12px;
}

.difficult-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--ciprel-neutral-100);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--ciprel-error);
}

.question-title {
  color: var(--ciprel-text-primary);
  font-weight: var(--font-weight-medium);
}

.error-rate {
  color: var(--ciprel-error);
  font-weight: var(--font-weight-bold);
}

.modal-content {
  background: var(--ciprel-surface-tertiary);
  border-radius: var(--border-radius-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 25px 25px 0 25px;
  border-bottom: 2px solid var(--ciprel-primary);
  margin-bottom: 25px;
}

.modal-header h2 {
  color: var(--ciprel-text-primary);
  margin: 0 0 20px 0;
}

.modal-body {
  padding: 0 25px 25px 25px;
}

.modal-footer {
  padding: 20px 25px 25px 25px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid var(--ciprel-border-light);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--ciprel-text-primary);
  font-weight: var(--font-weight-medium);
}

.option-input {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.option-input fluent-text-field {
  flex: 1;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Messages d'erreur */
.error-message {
  background-color: #fee;
  color: #c33;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  border-left: 4px solid #c33;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  color: #c33;
}

/* Indicateur de chargement */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--ciprel-primary);
  font-weight: 500;
}

.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--ciprel-primary);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* États désactivés */
fluent-button:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 15px;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .question-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>