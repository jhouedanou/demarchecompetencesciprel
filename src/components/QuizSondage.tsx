import * as React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import styles from './QuizSondage.module.scss';

interface QuizSondageProps {
  onNavigate: (view: string) => void;
}

const QuizSondage: React.FC<QuizSondageProps> = ({ onNavigate }) => {
  return (
    <Stack tokens={{ childrenGap: 30 }} styles={{ root: { maxWidth: 800, margin: '0 auto' } }}>
      
      <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#107c10' } }}>
          📊 Sondage Compétences
        </Text>
        <Text variant="large" styles={{ root: { textAlign: 'center', color: '#605e5c' } }}>
          Évaluez vos compétences actuelles dans différents domaines
        </Text>
      </Stack>

      <MessageBar messageBarType={MessageBarType.info}>
        <strong>Information :</strong> Ce sondage vous permettra d'auto-évaluer vos compétences 
        dans les domaines clés de votre poste chez CIPREL.
      </MessageBar>

      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Domaines d'évaluation :
        </Text>
        
        <ul className={styles.quizList}>
          <li>🔧 Compétences techniques</li>
          <li>💼 Management et leadership</li>
          <li>🤝 Communication et collaboration</li>
          <li>📈 Gestion de projet</li>
          <li>💡 Innovation et créativité</li>
          <li>🎯 Orientation résultats</li>
        </ul>
      </Stack>

      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Échelle d'évaluation :
        </Text>
        
        <Stack tokens={{ childrenGap: 10 }}>
          <Text variant="medium">1️⃣ <strong>Débutant</strong> - Connaissances de base</Text>
          <Text variant="medium">2️⃣ <strong>Intermédiaire</strong> - Maîtrise partielle</Text>
          <Text variant="medium">3️⃣ <strong>Confirmé</strong> - Bonne maîtrise</Text>
          <Text variant="medium">4️⃣ <strong>Expert</strong> - Maîtrise avancée</Text>
          <Text variant="medium">5️⃣ <strong>Référent</strong> - Expertise reconnue</Text>
        </Stack>
      </Stack>

      <MessageBar messageBarType={MessageBarType.warning}>
        <strong>Note :</strong> Ce sondage est en cours de développement. 
        Les questions d'évaluation seront bientôt disponibles.
      </MessageBar>

      {/* Actions */}
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <DefaultButton
          text="← Retour au tableau de bord"
          onClick={() => onNavigate('dashboard')}
          iconProps={{ iconName: 'Back' }}
        />
        <PrimaryButton
          text="Commencer l'Évaluation"
          onClick={() => {
            // TODO: Start survey logic
            alert('Sondage en cours de développement');
          }}
          iconProps={{ iconName: 'Survey' }}
          disabled
        />
      </Stack>

    </Stack>
  );
};

export default QuizSondage;
