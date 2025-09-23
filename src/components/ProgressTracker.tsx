import * as React from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  MessageBar,
  MessageBarType,
  ProgressIndicator
} from '@fluentui/react';

interface ProgressTrackerProps {
  onNavigate: (view: string) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ onNavigate }) => {
  // Mock data for demonstration
  const mockProgress = [
    { name: 'Compétences techniques', progress: 0.7, color: '#0078d4' },
    { name: 'Communication', progress: 0.85, color: '#107c10' },
    { name: 'Management', progress: 0.4, color: '#d83b01' },
    { name: 'Innovation', progress: 0.6, color: '#8764b8' }
  ];

  return (
    <Stack tokens={{ childrenGap: 30 }} styles={{ root: { maxWidth: 900, margin: '0 auto' } }}>
      
      <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#d83b01' } }}>
          📈 Suivi des Progrès
        </Text>
        <Text variant="large" styles={{ root: { textAlign: 'center', color: '#605e5c' } }}>
          Consultez votre évolution et vos résultats
        </Text>
      </Stack>

      <MessageBar messageBarType={MessageBarType.info}>
        <strong>Aperçu :</strong> Voici un aperçu de votre progression dans les différents domaines 
        de compétences. Les données réelles seront disponibles après avoir complété les évaluations.
      </MessageBar>

      {/* Progress Cards */}
      <Stack horizontal wrap tokens={{ childrenGap: 20 }} horizontalAlign="center">
        {mockProgress.map((item, index) => (
          <Stack 
            key={index} 
            styles={{ 
              root: { 
                width: 250, 
                padding: 20, 
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                border: '1px solid #edebe9'
              } 
            }}
          >
            <Stack tokens={{ childrenGap: 10 }}>
              <Text variant="medium" styles={{ root: { fontWeight: 600 } }}>
                {item.name}
              </Text>
              <ProgressIndicator
                percentComplete={item.progress}
                description={`${Math.round(item.progress * 100)}% complété`}
                barHeight={8}
              />
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="small">Niveau actuel</Text>
                <Text variant="small" styles={{ root: { fontWeight: 600, color: item.color } }}>
                  {item.progress >= 0.8 ? 'Expert' : 
                   item.progress >= 0.6 ? 'Confirmé' : 
                   item.progress >= 0.4 ? 'Intermédiaire' : 'Débutant'}
                </Text>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* Overall Stats */}
      <Stack 
        styles={{ 
          root: { 
            padding: 30, 
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            border: '1px solid #edebe9'
          } 
        }}
      >
        <Stack tokens={{ childrenGap: 20 }}>
          <Text variant="xLarge" styles={{ root: { fontWeight: 600, textAlign: 'center' } }}>
            📊 Statistiques Globales
          </Text>
          
          <Stack horizontal wrap tokens={{ childrenGap: 30 }} horizontalAlign="space-around">
            <Stack tokens={{ childrenGap: 5 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#0078d4' } }}>
                0
              </Text>
              <Text variant="medium">Quiz complétés</Text>
            </Stack>
            
            <Stack tokens={{ childrenGap: 5 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#107c10' } }}>
                0%
              </Text>
              <Text variant="medium">Score moyen</Text>
            </Stack>
            
            <Stack tokens={{ childrenGap: 5 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#d83b01' } }}>
                0h
              </Text>
              <Text variant="medium">Temps d'apprentissage</Text>
            </Stack>
            
            <Stack tokens={{ childrenGap: 5 }} horizontalAlign="center">
              <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#8764b8' } }}>
                0/12
              </Text>
              <Text variant="medium">Compétences maîtrisées</Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <MessageBar messageBarType={MessageBarType.warning}>
        <strong>En cours de développement :</strong> Les données de progression réelles seront 
        disponibles une fois que vous aurez complété les quiz et évaluations.
      </MessageBar>

      {/* Actions */}
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <DefaultButton
          text="← Retour au tableau de bord"
          onClick={() => onNavigate('dashboard')}
          iconProps={{ iconName: 'Back' }}
        />
        <DefaultButton
          text="Commencer une évaluation"
          onClick={() => onNavigate('quiz-introduction')}
          iconProps={{ iconName: 'TestBeaker' }}
        />
      </Stack>

    </Stack>
  );
};

export default ProgressTracker;
