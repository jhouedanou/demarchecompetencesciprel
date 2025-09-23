import * as React from 'react';
import {
  Stack,
  Text,
  Card,
  PrimaryButton,
  DefaultButton,
  ProgressIndicator,
  Icon,
  Separator,
  IStackTokens,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  SelectionMode
} from '@fluentui/react';
import { QuizResult, QuizQuestion } from '../../types';
import { QuizService } from '../../services/QuizService';
import ProgressBar from './ProgressBar';

export interface ResultsViewProps {
  result: QuizResult;
  questions: QuizQuestion[];
  onReturnToHome: () => void;
  onRetakeQuiz: () => void;
  showDetailedResults?: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  questions,
  onReturnToHome,
  onRetakeQuiz,
  showDetailedResults = true
}) => {
  const stackTokens: IStackTokens = { childrenGap: 24 };
  const cardTokens: IStackTokens = { childrenGap: 20, padding: 24 };

  const answers = React.useMemo(() => {
    try {
      return JSON.parse(result.Responses);
    } catch {
      return [];
    }
  }, [result.Responses]);

  const detailedResults = React.useMemo(() => {
    return QuizService.getDetailedResults(questions, answers);
  }, [questions, answers]);

  const feedback = React.useMemo(() => {
    return QuizService.getPerformanceFeedback(result.Score || 0, detailedResults.maxScore);
  }, [result.Score, detailedResults.maxScore]);

  const durationText = React.useMemo(() => {
    return QuizService.formatDuration(result.Duration);
  }, [result.Duration]);

  const answersColumns: IColumn[] = [
    {
      key: 'question',
      name: 'Question',
      fieldName: 'question',
      minWidth: 200,
      maxWidth: 400,
      isResizable: true,
      onRender: (item) => (
        <Text variant="medium">{item.question.Question}</Text>
      )
    },
    {
      key: 'userAnswer',
      name: 'Votre réponse',
      fieldName: 'userAnswer',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => (
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Icon
            iconName={item.isCorrect ? 'CheckMark' : 'Cancel'}
            styles={{
              root: {
                color: item.isCorrect ? '#107c10' : '#d13438',
                fontSize: 16
              }
            }}
          />
          <Text variant="medium">{item.userAnswer}</Text>
        </Stack>
      )
    },
    {
      key: 'correctAnswer',
      name: 'Bonne réponse',
      fieldName: 'correctAnswer',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item) => (
        <Text
          variant="medium"
          styles={{
            root: {
              color: item.isCorrect ? '#107c10' : '#d13438',
              fontWeight: item.isCorrect ? 400 : 600
            }
          }}
        >
          {item.correctAnswer}
        </Text>
      )
    },
    {
      key: 'points',
      name: 'Points',
      fieldName: 'points',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item) => (
        <Text variant="medium" styles={{ root: { textAlign: 'center' } }}>
          {item.points}/{item.question.Points}
        </Text>
      )
    }
  ];

  return (
    <Stack tokens={stackTokens}>
      {/* Résultats principaux */}
      <Card>
        <Stack tokens={cardTokens} horizontalAlign="center">
          <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
            <Icon
              iconName={
                feedback.level === 'excellent' ? 'Trophy' :
                feedback.level === 'good' ? 'Like' :
                feedback.level === 'average' ? 'Info' : 'Warning'
              }
              styles={{
                root: {
                  fontSize: 48,
                  color: feedback.color
                }
              }}
            />

            <Text variant="xxLarge" styles={{ root: { fontWeight: 700 } }}>
              {detailedResults.percentage}%
            </Text>

            <Text variant="large" styles={{ root: { color: feedback.color } }}>
              {result.Score} / {detailedResults.maxScore} points
            </Text>

            <Text variant="medium" styles={{ root: { textAlign: 'center', maxWidth: 400 } }}>
              {feedback.message}
            </Text>
          </Stack>

          <Separator />

          <Stack horizontal tokens={{ childrenGap: 40 }} horizontalAlign="center">
            <Stack horizontalAlign="center" tokens={{ childrenGap: 4 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                {detailedResults.correctAnswers}
              </Text>
              <Text variant="medium" styles={{ root: { color: '#666' } }}>
                Bonnes réponses
              </Text>
            </Stack>

            <Stack horizontalAlign="center" tokens={{ childrenGap: 4 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                {detailedResults.totalQuestions}
              </Text>
              <Text variant="medium" styles={{ root: { color: '#666' } }}>
                Questions totales
              </Text>
            </Stack>

            <Stack horizontalAlign="center" tokens={{ childrenGap: 4 }}>
              <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                {durationText}
              </Text>
              <Text variant="medium" styles={{ root: { color: '#666' } }}>
                Temps écoulé
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {/* Résultats par catégorie */}
      <Card>
        <Stack tokens={cardTokens}>
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Résultats par catégorie
          </Text>

          <Stack tokens={{ childrenGap: 16 }}>
            {detailedResults.categoryResults.map((category) => (
              <Stack key={category.category} tokens={{ childrenGap: 8 }}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Text variant="medium" styles={{ root: { fontWeight: 500 } }}>
                    {category.category}
                  </Text>
                  <Text variant="medium" styles={{ root: { color: '#666' } }}>
                    {category.score}/{category.maxScore} points ({category.percentage}%)
                  </Text>
                </Stack>

                <ProgressIndicator
                  percentComplete={category.percentage / 100}
                  styles={{
                    root: {
                      selectors: {
                        '.ms-ProgressIndicator-progressBar': {
                          backgroundColor: category.percentage >= 75 ? '#107c10' :
                                         category.percentage >= 50 ? '#ff8c00' : '#d13438'
                        }
                      }
                    }
                  }}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>

      {/* Détails des réponses */}
      {showDetailedResults && (
        <Card>
          <Stack tokens={cardTokens}>
            <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
              Détail des réponses
            </Text>

            <DetailsList
              items={detailedResults.answersDetails}
              columns={answersColumns}
              layoutMode={DetailsListLayoutMode.justified}
              selectionMode={SelectionMode.none}
              styles={{
                root: {
                  selectors: {
                    '.ms-DetailsRow': {
                      borderBottom: '1px solid #e1e5e9'
                    }
                  }
                }
              }}
            />
          </Stack>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <Stack tokens={cardTokens}>
          <Stack horizontal tokens={{ childrenGap: 16 }} horizontalAlign="center">
            <PrimaryButton
              text="Retour à l'accueil"
              onClick={onReturnToHome}
              iconProps={{ iconName: 'Home' }}
            />

            <DefaultButton
              text="Refaire le quiz"
              onClick={onRetakeQuiz}
              iconProps={{ iconName: 'Refresh' }}
            />
          </Stack>

          <Text variant="small" styles={{ root: { textAlign: 'center', color: '#666' } }}>
            Quiz terminé le {result.CompletedDate.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
};

export default React.memo(ResultsView);