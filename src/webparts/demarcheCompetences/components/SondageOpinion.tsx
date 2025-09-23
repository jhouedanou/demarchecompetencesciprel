import * as React from 'react';
import { 
  PrimaryButton, 
  DefaultButton, 
  Text, 
  Stack, 
  Card,
  ChoiceGroup,
  IChoiceGroupOption,
  TextField,
  Checkbox,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { useNavigation, useUser, useError, useLoading, useAppContext } from '../contexts/AppContext';
import { useSondage } from '../contexts/QuizContext';
import { SharePointService } from '../services/SharePointService';
import ProgressBar from './shared/ProgressBar';
import { SondageResponse } from '../types';
import styles from './DemarcheCompetences.module.scss';

interface SondageQuestionProps {
  questionId: number;
  title: string;
  question: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  currentAnswer?: string | string[];
  onAnswer: (questionId: number, answer: string | string[]) => void;
  required?: boolean;
}

const SondageQuestion: React.FC<SondageQuestionProps> = ({
  questionId,
  title,
  question,
  type,
  options = [],
  currentAnswer,
  onAnswer,
  required = false
}) => {
  const handleSingleChoice = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
    if (option) {
      onAnswer(questionId, option.key);
    }
  };

  const handleMultipleChoice = (optionKey: string) => (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
    const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
    let newAnswers: string[];

    if (checked) {
      newAnswers = [...currentAnswers, optionKey];
    } else {
      newAnswers = currentAnswers.filter(answer => answer !== optionKey);
    }

    onAnswer(questionId, newAnswers);
  };

  const handleTextAnswer = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    onAnswer(questionId, newValue || '');
  };

  const choiceOptions: IChoiceGroupOption[] = options.map(option => ({
    key: option,
    text: option
  }));

  return (
    <Card className={styles.sondageQuestion}>
      <Card.Section>
        <Stack tokens={{ childrenGap: 16 }}>
          <Stack tokens={{ childrenGap: 8 }}>
            <Text variant="large" block>
              <strong>{title}</strong>
              {required && <span style={{ color: '#d13438' }}> *</span>}
            </Text>
            <Text variant="medium" block>
              {question}
            </Text>
          </Stack>

          {type === 'single' && (
            <ChoiceGroup
              options={choiceOptions}
              selectedKey={typeof currentAnswer === 'string' ? currentAnswer : undefined}
              onChange={handleSingleChoice}
            />
          )}

          {type === 'multiple' && (
            <Stack tokens={{ childrenGap: 8 }}>
              {options.map(option => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                  onChange={handleMultipleChoice(option)}
                />
              ))}
            </Stack>
          )}

          {type === 'text' && (
            <TextField
              multiline
              rows={4}
              value={typeof currentAnswer === 'string' ? currentAnswer : ''}
              onChange={handleTextAnswer}
              placeholder="Saisissez votre réponse..."
            />
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
};

const SondageOpinion: React.FC = () => {
  const { navigateTo, goBack } = useNavigation();
  const { user } = useUser();
  const { setError, clearError } = useError();
  const { setLoading } = useLoading();
  const { context } = useAppContext();
  const { sondageState, startSondage, answerQuestion, getAnswer, getProgress, canComplete } = useSondage();
  
  const [hasStarted, setHasStarted] = React.useState(false);
  const [hasExistingResponse, setHasExistingResponse] = React.useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = React.useState(true);

  const sharePointService = React.useMemo(() => new SharePointService(context), [context]);
  
  const sondageQuestions = [
    {
      id: 1,
      title: 'Question 1 - Connaissance préalable',
      question: 'Savez-vous ce que c\'est que la démarche compétence ?',
      type: 'single' as const,
      options: ['Oui', 'Non', 'J\'en ai une vague idée'],
      required: true
    },
    {
      id: 2,
      title: 'Question 2 - Définition personnelle',
      question: 'Selon vous, qu\'est-ce qu\'une démarche compétence chez CIPREL ?',
      type: 'single' as const,
      options: [
        'Un processus d\'évaluation des employés',
        'Un système de gestion des talents',
        'Une approche de développement personnel et organisationnel',
        'Un programme de formation',
        'Je ne sais pas'
      ],
      required: true
    },
    {
      id: 3,
      title: 'Question 3 - Bénéfices attendus',
      question: 'Quels sont selon vous les principaux bénéfices d\'une démarche compétence ? (Plusieurs réponses possibles)',
      type: 'multiple' as const,
      options: [
        'Amélioration des performances individuelles',
        'Développement de carrière',
        'Meilleure collaboration en équipe',
        'Innovation et créativité',
        'Satisfaction au travail',
        'Efficacité organisationnelle'
      ],
      required: true
    },
    {
      id: 4,
      title: 'Question 4 - Attentes personnelles',
      question: 'Qu\'attendez-vous personnellement de cette démarche compétence ?',
      type: 'text' as const,
      required: true
    },
    {
      id: 5,
      title: 'Question 5 - Inquiétudes',
      question: 'Quelles sont vos principales inquiétudes concernant la mise en place de cette démarche ?',
      type: 'text' as const,
      required: false
    },
    {
      id: 6,
      title: 'Question 6 - Informations nécessaires',
      question: 'De quel type d\'information avez-vous besoin pour mieux comprendre cette démarche ? (Plusieurs réponses possibles)',
      type: 'multiple' as const,
      options: [
        'Guide pratique détaillé',
        'Exemples concrets d\'application',
        'Formation en présentiel',
        'Sessions de questions-réponses',
        'Témoignages d\'autres collaborateurs',
        'Support vidéo/multimédia'
      ],
      required: true
    }
  ];

  // Check for existing response
  React.useEffect(() => {
    const checkExistingResponse = async () => {
      setIsCheckingExisting(true);
      try {
        const existingResponse = await sharePointService.getUserSondageResponse(user.id);
        setHasExistingResponse(!!existingResponse);
      } catch (error) {
        console.error('Error checking existing response:', error);
      } finally {
        setIsCheckingExisting(false);
      }
    };

    checkExistingResponse();
  }, [sharePointService, user.id]);

  const handleStart = () => {
    startSondage();
    setHasStarted(true);
    clearError();
  };

  const handleAnswer = (questionId: number, answer: string | string[]) => {
    answerQuestion({ questionId, answer });
  };

  const handleSubmit = async () => {
    if (!canComplete()) {
      setError('Veuillez répondre à toutes les questions obligatoires.');
      return;
    }

    try {
      setLoading(true);

      // Prepare the response data
      const responseData: Omit<SondageResponse, 'Id'> = {
        Title: `Sondage Opinion - ${user.email} - ${new Date().toISOString()}`,
        UserId: user.id,
        UserEmail: user.email,
        Q1_Connaissance: getAnswer(1)?.answer as string || '',
        Q2_Definition: getAnswer(2)?.answer as string || '',
        Q3_Benefices: Array.isArray(getAnswer(3)?.answer) ? (getAnswer(3)?.answer as string[]).join(';') : '',
        Q4_Attentes: getAnswer(4)?.answer as string || '',
        Q5_Inquietudes: getAnswer(5)?.answer as string || '',
        Q6_Informations: Array.isArray(getAnswer(6)?.answer) ? (getAnswer(6)?.answer as string[]).join(';') : '',
        SubmittedDate: new Date()
      };

      await sharePointService.saveSondageResponse(responseData);
      
      navigateTo('landing');
      
    } catch (error) {
      console.error('Error submitting sondage:', error);
      setError('Erreur lors de la soumission du sondage. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const progress = getProgress();

  if (isCheckingExisting) {
    return (
      <div className={styles.loadingContainer}>
        <Text variant="large">Vérification de votre progression...</Text>
      </div>
    );
  }

  if (hasExistingResponse) {
    return (
      <div className={styles.sondageCompleted}>
        <Card>
          <Card.Section>
            <Stack horizontalAlign="center" tokens={{ childrenGap: 24 }}>
              <div className={styles.completionIcon}>✅</div>
              <Text variant="xxLarge" block>
                <strong>Sondage déjà complété</strong>
              </Text>
              <Text variant="large" block style={{ textAlign: 'center' }}>
                Merci ! Vous avez déjà répondu à notre sondage d'opinion. 
                Vos réponses contribuent à améliorer la démarche compétences chez CIPREL.
              </Text>
              <DefaultButton 
                text="Retour à l'accueil" 
                onClick={() => navigateTo('landing')}
                iconProps={{ iconName: 'Home' }}
              />
            </Stack>
          </Card.Section>
        </Card>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className={styles.sondageIntroduction}>
        <Card className={styles.introCard}>
          <Card.Section>
            <Stack tokens={{ childrenGap: 24 }}>
              <Stack>
                <Text variant="xxLarge" block>
                  <strong>Sondage d'Opinion</strong>
                </Text>
                <Text variant="large" block>
                  Partagez votre vision sur la démarche compétences chez CIPREL
                </Text>
              </Stack>

              <Stack tokens={{ childrenGap: 16 }}>
                <Text variant="medium" block>
                  Votre opinion est importante pour nous ! Ce sondage nous aidera à mieux 
                  comprendre vos attentes et à adapter la démarche compétences aux besoins 
                  de tous les collaborateurs.
                </Text>
                
                <Stack tokens={{ childrenGap: 8 }}>
                  <Text variant="mediumPlus" block>
                    <strong>📋 À propos de ce sondage :</strong>
                  </Text>
                  <ul className={styles.sondageInfo}>
                    <li>6 questions sur vos connaissances et attentes</li>
                    <li>Durée estimée : 5-10 minutes</li>
                    <li>Questions à choix multiples et texte libre</li>
                    <li>Anonymat respecté dans les analyses</li>
                  </ul>
                </Stack>
              </Stack>

              <MessageBar messageBarType={MessageBarType.info}>
                Vos réponses nous aideront à personnaliser l'approche et à répondre 
                aux préoccupations les plus courantes.
              </MessageBar>

              <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 16 }}>
                <PrimaryButton 
                  text="Commencer le Sondage" 
                  onClick={handleStart}
                  iconProps={{ iconName: 'Feedback' }}
                />
                <DefaultButton 
                  text="Retour" 
                  onClick={goBack}
                  iconProps={{ iconName: 'Back' }}
                />
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.sondageOpinion}>
      {/* Header */}
      <div className={styles.sondageHeader}>
        <Text variant="xxLarge" block>
          <strong>Sondage d'Opinion</strong>
        </Text>
        <Text variant="large" block>
          Question {progress.current} sur {progress.total}
        </Text>
        <ProgressBar 
          current={progress.current} 
          total={progress.total} 
          showPercentage={true}
        />
      </div>

      {/* Questions */}
      <div className={styles.questionsContainer}>
        {sondageQuestions.map(question => (
          <SondageQuestion
            key={question.id}
            questionId={question.id}
            title={question.title}
            question={question.question}
            type={question.type}
            options={question.options}
            currentAnswer={getAnswer(question.id)?.answer}
            onAnswer={handleAnswer}
            required={question.required}
          />
        ))}
      </div>

      {/* Actions */}
      <Card className={styles.actionsCard}>
        <Card.Section>
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
            <DefaultButton 
              text="Retour" 
              onClick={goBack}
              iconProps={{ iconName: 'Back' }}
            />
            
            <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="center">
              <Text variant="medium">
                Progression: {progress.percentage}%
              </Text>
              <PrimaryButton 
                text="Soumettre le Sondage" 
                onClick={handleSubmit}
                disabled={!canComplete()}
                iconProps={{ iconName: 'Send' }}
              />
            </Stack>
          </Stack>
        </Card.Section>
      </Card>
    </div>
  );
};

export default SondageOpinion;
