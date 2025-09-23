import * as React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Card,
  ICardTokens,
  Icon
} from '@fluentui/react';

interface DashboardProps {
  user: any;
  canStartIntro: boolean;
  canStartSurvey: boolean;
  onNavigate: (view: string) => void;
}

const cardTokens: ICardTokens = { childrenMargin: 12 };

const Dashboard: React.FC<DashboardProps> = ({
  user,
  canStartIntro,
  canStartSurvey,
  onNavigate
}) => {
  return (
    <Stack tokens={{ childrenGap: 30 }}>
      
      {/* Header */}
      <Stack horizontalAlign="center" tokens={{ childrenGap: 10 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#0078d4' } }}>
          🚀 Démarche Compétence CIPREL
        </Text>
        <Text variant="large" styles={{ root: { color: '#605e5c' } }}>
          Plateforme de gestion des compétences
        </Text>
        {user && (
          <Text variant="medium" styles={{ root: { color: '#323130' } }}>
            Bienvenue, {user.displayName || user.email || 'Utilisateur'}
          </Text>
        )}
      </Stack>

      {/* Quick Actions */}
      <Stack horizontal horizontalAlign="center" wrap tokens={{ childrenGap: 20 }}>
        
        <Card tokens={cardTokens} styles={{ root: { maxWidth: 300, padding: 20 } }}>
          <Stack tokens={{ childrenGap: 15 }} horizontalAlign="center">
            <Icon iconName="TestBeaker" styles={{ root: { fontSize: 48, color: '#0078d4' } }} />
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              Quiz d'Introduction
            </Text>
            <Text variant="medium" styles={{ root: { textAlign: 'center' } }}>
              Découvrez les compétences fondamentales de CIPREL
            </Text>
            <PrimaryButton
              text="Commencer le Quiz"
              onClick={() => onNavigate('quiz-introduction')}
              disabled={!canStartIntro}
              styles={{ root: { width: '100%' } }}
            />
          </Stack>
        </Card>

        <Card tokens={cardTokens} styles={{ root: { maxWidth: 300, padding: 20 } }}>
          <Stack tokens={{ childrenGap: 15 }} horizontalAlign="center">
            <Icon iconName="Survey" styles={{ root: { fontSize: 48, color: '#107c10' } }} />
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              Sondage Compétences
            </Text>
            <Text variant="medium" styles={{ root: { textAlign: 'center' } }}>
              Évaluez vos compétences actuelles dans différents domaines
            </Text>
            <PrimaryButton
              text="Commencer le Sondage"
              onClick={() => onNavigate('quiz-sondage')}
              disabled={!canStartSurvey}
              styles={{ root: { width: '100%' } }}
            />
          </Stack>
        </Card>

        <Card tokens={cardTokens} styles={{ root: { maxWidth: 300, padding: 20 } }}>
          <Stack tokens={{ childrenGap: 15 }} horizontalAlign="center">
            <Icon iconName="ProgressRingDots" styles={{ root: { fontSize: 48, color: '#d83b01' } }} />
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              Suivi des Progrès
            </Text>
            <Text variant="medium" styles={{ root: { textAlign: 'center' } }}>
              Consultez votre évolution et vos résultats
            </Text>
            <DefaultButton
              text="Voir les Progrès"
              onClick={() => onNavigate('progress')}
              disabled={!user}
              styles={{ root: { width: '100%' } }}
            />
          </Stack>
        </Card>

      </Stack>

      {/* Information Section */}
      <Stack tokens={{ childrenGap: 20 }} styles={{ root: { maxWidth: 800, alignSelf: 'center' } }}>
        <Text variant="xLarge" styles={{ root: { fontWeight: 600, textAlign: 'center' } }}>
          À propos de la Démarche Compétence
        </Text>
        
        <Stack tokens={{ childrenGap: 15 }}>
          <Text variant="medium">
            La <strong>Démarche Compétence CIPREL</strong> est un programme conçu pour identifier, 
            développer et valoriser les compétences de nos collaborateurs.
          </Text>
          
          <Text variant="medium">
            🎯 <strong>Objectifs :</strong>
          </Text>
          <ul>
            <li>Identifier les compétences clés de votre poste</li>
            <li>Évaluer votre niveau actuel</li>
            <li>Définir un plan de développement personnalisé</li>
            <li>Suivre votre progression dans le temps</li>
          </ul>
          
          <Text variant="medium">
            📊 <strong>Processus :</strong> Quiz d'introduction → Sondage d'évaluation → Plan de développement → Suivi des progrès
          </Text>
        </Stack>
      </Stack>

      {/* Footer */}
      <Stack horizontalAlign="center" styles={{ root: { marginTop: 40, paddingTop: 20, borderTop: '1px solid #edebe9' } }}>
        <Text variant="small" styles={{ root: { color: '#605e5c' } }}>
          © 2025 CIPREL - Plateforme de Gestion des Compétences
        </Text>
      </Stack>

    </Stack>
  );
};

export default Dashboard;
