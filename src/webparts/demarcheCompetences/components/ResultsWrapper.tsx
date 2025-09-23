import * as React from 'react';
import { 
  Stack, 
  Text, 
  Spinner, 
  MessageBar, 
  MessageBarType,
  SpinnerSize
} from '@fluentui/react';

import Card from './shared/CardComponent';
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
          <Spinner label="Chargement des résultats..." size={SpinnerSize.large} />
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
