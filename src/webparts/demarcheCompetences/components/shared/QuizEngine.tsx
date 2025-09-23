import * as React from 'react';
import {
  Stack,
  Text,
  ChoiceGroup,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  IStackTokens,
  Separator
} from '@fluentui/react';

import Card from './CardComponent';
import { QuizEngineProps, QuizAnswer } from '../../types';
import { useQuiz } from '../../contexts/QuizContext';
import { useUser } from '../../contexts/AppContext';
import { QuizService } from '../../services/QuizService';
import ProgressBar from './ProgressBar';

const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  onComplete,
  onBack
}) => {
  const {
    quizState,
    getCurrentQuestion,
    getProgress,
    answerQuestion,
    nextQuestion,
    completeQuiz,
    getAnswer,
    canProceed,
    isLastQuestion
  } = useQuiz();
  const { user } = useUser();

  const [selectedAnswer, setSelectedAnswer] = React.useState<'A' | 'B' | 'C' | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  React.useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = getAnswer(currentQuestion.Id);
      setSelectedAnswer(existingAnswer ? existingAnswer.answer : null);
      setShowFeedback(false);
    }
  }, [currentQuestion, getAnswer]);

  const stackTokens: IStackTokens = { childrenGap: 20 };
  const cardTokens: IStackTokens = { childrenGap: 16, padding: 24 };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C') => {
    if (!answer) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(false);

    if (currentQuestion) {
      const quizAnswer: QuizAnswer = {
        questionId: currentQuestion.Id,
        answer,
        isCorrect: answer === currentQuestion.CorrectAnswer
      };

      answerQuestion(quizAnswer);
    }
  };

  const handleNext = () => {
    if (isLastQuestion()) {
      handleComplete();
    } else {
      nextQuestion();
    }
  };

  const handleComplete = () => {
    completeQuiz();

    if (quizState.startTime) {
      const endTime = new Date();
      const result = QuizService.generateQuizResult(
        user.id,
        user.email,
        questions,
        quizState.answers,
        quizState.startTime,
        endTime
      );

      onComplete({
        Id: 0,
        ...result
      });
    }
  };

  const handleShowFeedback = () => {
    setShowFeedback(true);
  };

  if (!currentQuestion) {
    return (
      <Card>
        <Stack tokens={cardTokens}>
          <Text variant="xLarge">Quiz non disponible</Text>
          <Text>Aucune question n'a pu être chargée.</Text>
          <DefaultButton text="Retour" onClick={onBack} />
        </Stack>
      </Card>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.CorrectAnswer;

  return (
    <Stack tokens={stackTokens}>
      <Card>
        <Stack tokens={cardTokens}>
          <Stack tokens={{ childrenGap: 16 }}>
            <ProgressBar
              current={progress.current}
              total={progress.total}
              label="Progression du quiz"
              color="blue"
            />

            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Text variant="medium" styles={{ root: { color: '#666' } }}>
                Question {progress.current} sur {progress.total}
              </Text>
              <Text variant="medium" styles={{ root: { color: '#666' } }}>
                Catégorie: {currentQuestion.Category}
              </Text>
            </Stack>
          </Stack>

          <Separator />

          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            {currentQuestion.Question}
          </Text>

          <ChoiceGroup
            selectedKey={selectedAnswer}
            options={[
              {
                key: 'A',
                text: currentQuestion.OptionA,
                styles: {
                  root: {
                    padding: 12,
                    border: selectedAnswer === 'A' ? '2px solid #0078d4' : '1px solid #e1e5e9',
                    borderRadius: 4,
                    backgroundColor: selectedAnswer === 'A' ? '#f8f9fa' : 'transparent'
                  }
                }
              },
              {
                key: 'B',
                text: currentQuestion.OptionB,
                styles: {
                  root: {
                    padding: 12,
                    border: selectedAnswer === 'B' ? '2px solid #0078d4' : '1px solid #e1e5e9',
                    borderRadius: 4,
                    backgroundColor: selectedAnswer === 'B' ? '#f8f9fa' : 'transparent'
                  }
                }
              },
              {
                key: 'C',
                text: currentQuestion.OptionC,
                styles: {
                  root: {
                    padding: 12,
                    border: selectedAnswer === 'C' ? '2px solid #0078d4' : '1px solid #e1e5e9',
                    borderRadius: 4,
                    backgroundColor: selectedAnswer === 'C' ? '#f8f9fa' : 'transparent'
                  }
                }
              }
            ]}
            onChange={(ev, option) => handleAnswerSelect(option?.key as 'A' | 'B' | 'C')}
          />

          {showFeedback && selectedAnswer && (
            <MessageBar
              messageBarType={isCorrect ? MessageBarType.success : MessageBarType.warning}
              styles={{
                root: {
                  marginTop: 16
                }
              }}
            >
              {isCorrect ? (
                <Text>
                  <strong>Correct !</strong> Vous avez gagné {currentQuestion.Points} point(s).
                </Text>
              ) : (
                <Text>
                  <strong>Incorrect.</strong> La bonne réponse était "{currentQuestion.CorrectAnswer}".
                  La réponse correcte était: {
                    currentQuestion.CorrectAnswer === 'A' ? currentQuestion.OptionA :
                    currentQuestion.CorrectAnswer === 'B' ? currentQuestion.OptionB :
                    currentQuestion.OptionC
                  }
                </Text>
              )}
            </MessageBar>
          )}

          <Stack horizontal tokens={{ childrenGap: 16 }} horizontalAlign="space-between">
            <DefaultButton
              text="Retour"
              onClick={onBack}
              iconProps={{ iconName: 'ChevronLeft' }}
            />

            <Stack horizontal tokens={{ childrenGap: 12 }}>
              {selectedAnswer && !showFeedback && (
                <DefaultButton
                  text="Voir la réponse"
                  onClick={handleShowFeedback}
                  iconProps={{ iconName: 'View' }}
                />
              )}

              <PrimaryButton
                text={isLastQuestion() ? 'Terminer le quiz' : 'Question suivante'}
                onClick={handleNext}
                disabled={!canProceed()}
                iconProps={{
                  iconName: isLastQuestion() ? 'CheckMark' : 'ChevronRight'
                }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default React.memo(QuizEngine);