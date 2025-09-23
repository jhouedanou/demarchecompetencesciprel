import * as React from 'react';
import { 
  Stack, 
  Text, 
  Spinner, 
  MessageBar, 
  MessageBarType,
  mergeStyles
} from '@fluentui/react';

// Simple Card component replacement
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`${mergeStyles({ 
    backgroundColor: 'white', 
    border: '1px solid #edebe9', 
    borderRadius: '2px', 
    boxShadow: '0 1.6px 3.6px 0 rgba(0,0,0,.132), 0 0.3px 0.9px 0 rgba(0,0,0,.108)',
    padding: '12px'
  })} ${className || ''}`}>
    {children}
  </div>
);
import { useNavigation, useUser, useError, useLoading, useAppContext } from '../contexts/AppContext';
import { SharePointService } from '../services/SharePointService';
import { QuizResult, QuizQuestion } from '../types';
import ResultsView from './shared/ResultsView';
import styles from './DemarcheCompetences.module.scss';

const ResultsWrapper: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { user } = useUser();
  const { setError } = useError();
  const { setLoading } = useLoading();
  const { context } = useAppContext();
  
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const sharePointService = React.useMemo(() => new SharePointService(context), [context]);

  React.useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      
      try {
        // Load user's most recent quiz result
        const userResult = await sharePointService.getUserQuizResult(user.id, 'Introduction');
        
        if (!userResult) {
          setError('Aucun résultat de quiz trouvé. Veuillez d\'abord compléter le quiz.');
          navigateTo('quiz');
          return;
        }

        setResult(userResult);

        // Load questions for detailed analysis
        const quizQuestions = await sharePointService.getQuizQuestions('Introduction');
        setQuestions(quizQuestions);

      } catch (error) {
        console.error('Error loading results:', error);
        setError('Erreur lors du chargement des résultats. Veuillez réessayer.');
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    loadResults();
  }, [sharePointService, user.id, setError, setLoading, navigateTo]);

  const handleReturnToHome = () => {
    navigateTo('landing');
  };

  const handleRetakeQuiz = () => {
    navigateTo('quiz');
  };

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
          <Spinner label="Chargement des résultats..." size="large" />
        </Stack>
      </div>
    );
  }

  if (!result) {
    return (
      <Card>
        <Card.Section>
          <Stack horizontalAlign="center" tokens={{ childrenGap: 24 }}>
            <Text variant="xLarge">
              <strong>Aucun résultat trouvé</strong>
            </Text>
            <MessageBar messageBarType={MessageBarType.info}>
              Vous devez d'abord compléter le quiz d'introduction pour voir vos résultats.
            </MessageBar>
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <button onClick={() => navigateTo('quiz')}>
                Passer le Quiz
              </button>
              <button onClick={handleReturnToHome}>
                Retour à l'accueil
              </button>
            </Stack>
          </Stack>
        </Card.Section>
      </Card>
    );
  }

  return (
    <ResultsView
      result={result}
      questions={questions}
      onReturnToHome={handleReturnToHome}
      onRetakeQuiz={handleRetakeQuiz}
      showDetailedResults={true}
    />
  );
};

export default ResultsWrapper;
