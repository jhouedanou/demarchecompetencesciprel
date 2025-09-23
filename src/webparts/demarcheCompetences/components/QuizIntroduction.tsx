import * as React from 'react';
import { 
  PrimaryButton, 
  DefaultButton, 
  Text, 
  Stack, 
  MessageBar,
  MessageBarType
} from '@fluentui/react';

import Card from './shared/CardComponent';

import { useNavigation, useUser, useError, useLoading, useAppContext } from '../contexts/AppContext';
import { useQuiz } from '../contexts/QuizContext';
import { SharePointService } from '../services/SharePointService';
import { QuizService } from '../services/QuizService';
import QuizEngine from './shared/QuizEngine';
import { QuizQuestion } from '../types';
import styles from './DemarcheCompetences.module.scss';

const QuizIntroduction: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const { user } = useUser();
  const { setError } = useError();
  const { setLoading } = useLoading();
  const { context } = useAppContext();
  const { quizState, startQuiz, resetQuiz } = useQuiz();
  
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [hasExistingResult, setHasExistingResult] = React.useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = React.useState(true);

  const sharePointService = React.useMemo(() => new SharePointService(context), [context]);

  // Check for existing results and load questions
  React.useEffect(() => {
    const initializeQuiz = async () => {
      setLoading(true);
      setIsCheckingExisting(true);
      
      try {
        // Check if user has already completed the quiz
        const existingResult = await sharePointService.getUserQuizResult(user.id, 'Introduction');
        setHasExistingResult(!!existingResult);

        // Load quiz questions
        const quizQuestions = await sharePointService.getQuizQuestions('Introduction');
        
        if (quizQuestions.length === 0) {
          // Load default questions if none exist
          await loadDefaultQuestions();
          const freshQuestions = await sharePointService.getQuizQuestions('Introduction');
          setQuestions(freshQuestions);
        } else {
          setQuestions(quizQuestions);
        }

        // Validate questions
        const validation = QuizService.validateQuizData(questions);
        if (!validation.isValid) {
          setError(`Erreur dans les données du quiz: ${validation.errors.join(', ')}`);
          return;
        }

      } catch (error) {
        console.error('Error initializing quiz:', error);
        setError('Erreur lors du chargement du quiz. Veuillez réessayer.');
      } finally {
        setLoading(false);
        setIsCheckingExisting(false);
      }
    };

    initializeQuiz();
  }, [sharePointService, user.id, setError, setLoading]);

  const loadDefaultQuestions = async () => {
    const defaultQuestions: Omit<QuizQuestion, 'Id'>[] = [
      {
        Title: 'Question 1 - Définition',
        Question: 'La démarche compétence c\'est :',
        OptionA: 'Un processus d\'évaluation annuel des employés',
        OptionB: 'Un système de gestion intégrée des compétences pour le développement personnel et organisationnel',
        OptionC: 'Un programme de formation obligatoire',
        CorrectAnswer: 'B',
        Category: 'Definition',
        Points: 10,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 2 - Responsabilité',
        Question: 'La démarche compétence est la responsabilité de :',
        OptionA: 'Uniquement les Ressources Humaines',
        OptionB: 'Seulement les managers',
        OptionC: 'Tous les collaborateurs de l\'organisation',
        CorrectAnswer: 'C',
        Category: 'Responsabilite',
        Points: 10,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 3 - Types de compétences',
        Question: 'Les compétences sont essentiellement :',
        OptionA: 'Uniquement techniques',
        OptionB: 'Techniques, comportementales et fondamentales',
        OptionC: 'Seulement liées à l\'expérience',
        CorrectAnswer: 'B',
        Category: 'Competences',
        Points: 10,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 4 - Savoir-faire',
        Question: 'Le savoir-faire c\'est :',
        OptionA: 'Les connaissances théoriques',
        OptionB: 'La capacité à assurer des tâches techniques et/ou managériales',
        OptionC: 'L\'expérience professionnelle',
        CorrectAnswer: 'B',
        Category: 'Competences',
        Points: 10,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 5 - Savoir-être',
        Question: 'Le savoir-être c\'est :',
        OptionA: 'Les capacités cognitives et relationnelles',
        OptionB: 'Les diplômes obtenus',
        OptionC: 'Les années d\'expérience',
        CorrectAnswer: 'A',
        Category: 'Competences',
        Points: 10,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 6 - Étapes',
        Question: 'Quelles sont les principales étapes de la démarche compétence :',
        OptionA: 'Évaluation, Formation, Certification',
        OptionB: 'Auto-évaluation, Identification des besoins, Plan de développement, Mise en œuvre, Évaluation et ajustement',
        OptionC: 'Recrutement, Formation, Évaluation',
        CorrectAnswer: 'B',
        Category: 'Etapes',
        Points: 15,
        QuizType: 'Introduction'
      },
      {
        Title: 'Question 7 - Bénéfices',
        Question: 'Le principal bénéfice de la démarche compétence est :',
        OptionA: 'Réduction des coûts de formation',
        OptionB: 'Amélioration continue des performances individuelles et organisationnelles',
        OptionC: 'Simplification des processus RH',
        CorrectAnswer: 'B',
        Category: 'Definition',
        Points: 15,
        QuizType: 'Introduction'
      }
    ];

    for (const question of defaultQuestions) {
      try {
        await sharePointService.createQuizQuestion(question);
      } catch (error) {
        console.warn('Error creating question:', error);
      }
    }
  };

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      setError('Aucune question disponible pour le quiz.');
      return;
    }
    
    startQuiz();
    setShowQuiz(true);
  };

  const handleQuizComplete = async (result: any) => {
    try {
      setLoading(true);
      
      // Save result to SharePoint
      await sharePointService.saveQuizResult(result);
      
      // Navigate to results
      navigateTo('results');
      
    } catch (error) {
      console.error('Error saving quiz result:', error);
      setError('Erreur lors de la sauvegarde des résultats. Vos réponses ont été perdues.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    setHasExistingResult(false);
    setShowQuiz(true);
  };

  if (isCheckingExisting) {
    return (
      <div className={styles.loadingContainer}>
        <Text variant="large">Vérification de votre progression...</Text>
      </div>
    );
  }

  if (showQuiz && !quizState.isCompleted) {
    return (
      <QuizEngine
        questions={questions}
        onComplete={handleQuizComplete}
        onBack={() => {
          setShowQuiz(false);
          resetQuiz();
        }}
      />
    );
  }

  return (
    <div className={styles.quizIntroduction}>
      <Card className={styles.introCard}>
        <Stack tokens={{ childrenGap: 24 }}>
          {/* Header */}
          <Stack>
            <Text variant="xxLarge" block>
              <strong>Quiz d'Introduction</strong>
            </Text>
            <Text variant="large" block>
              Testez vos connaissances sur la démarche compétences chez CIPREL
            </Text>
          </Stack>

          {/* Existing Result Message */}
          {hasExistingResult && (
            <MessageBar messageBarType={MessageBarType.info}>
              Vous avez déjà complété ce quiz. Vous pouvez le repasser pour mettre à jour vos résultats.
            </MessageBar>
          )}

          {/* Quiz Description */}
          <Stack tokens={{ childrenGap: 16 }}>
            <Text variant="medium" block>
              Ce quiz d'introduction comprend <strong>7 questions</strong> conçues pour évaluer 
              votre compréhension actuelle de la démarche compétences.
            </Text>
            
            <Stack tokens={{ childrenGap: 8 }}>
              <Text variant="mediumPlus" block>
                <strong>📋 Contenu du quiz :</strong>
              </Text>
              <ul className={styles.quizContent}>
                <li>Définition et concepts fondamentaux</li>
                <li>Responsabilités dans la démarche</li>
                <li>Types de compétences (savoir, savoir-faire, savoir-être)</li>
                <li>Étapes du processus</li>
                <li>Bénéfices attendus</li>
              </ul>
            </Stack>

            <Stack tokens={{ childrenGap: 8 }}>
              <Text variant="mediumPlus" block>
                <strong>⏱️ Modalités :</strong>
              </Text>
              <ul className={styles.quizModalities}>
                <li>Durée estimée : 5-10 minutes</li>
                <li>Questions à choix multiples (A, B, C)</li>
                <li>Résultats immédiats avec feedback détaillé</li>
                <li>Possibilité de repasser le quiz</li>
              </ul>
            </Stack>
          </Stack>

          {/* Benefits Box */}
          <Card className={styles.benefitsBox}>
            <Stack tokens={{ childrenGap: 12 }}>
              <Text variant="mediumPlus" block>
                <strong>🎯 Pourquoi faire ce quiz ?</strong>
              </Text>
              <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="medium">
                  ✅ Évaluez votre niveau de connaissance actuel
                </Text>
                <Text variant="medium">
                  ✅ Identifiez les domaines à approfondir
                </Text>
                <Text variant="medium">
                  ✅ Préparez-vous à la mise en œuvre de la démarche
                </Text>
                <Text variant="medium">
                  ✅ Contribuez aux statistiques globales de l'organisation
                </Text>
              </Stack>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            {hasExistingResult ? (
              <>
                <PrimaryButton 
                  text="Repasser le Quiz" 
                  onClick={handleRetakeQuiz}
                  iconProps={{ iconName: 'Refresh' }}
                />
                <DefaultButton 
                  text="Voir mes Résultats" 
                  onClick={() => navigateTo('results')}
                  iconProps={{ iconName: 'BarChartVertical' }}
                />
              </>
            ) : (
              <PrimaryButton 
                text="Commencer le Quiz" 
                onClick={handleStartQuiz}
                iconProps={{ iconName: 'Play' }}
                className={styles.startButton}
              />
            )}
            <DefaultButton 
              text="Retour" 
              onClick={goBack}
              iconProps={{ iconName: 'Back' }}
            />
          </Stack>

          {/* Footer Note */}
          <Text variant="small" block style={{ fontStyle: 'italic', textAlign: 'center' }}>
            Vos réponses seront sauvegardées automatiquement et contribueront aux 
            analyses globales pour améliorer la démarche compétences chez CIPREL.
          </Text>
        </Stack>
      </Card>
    </div>
  );
};

export default QuizIntroduction;
