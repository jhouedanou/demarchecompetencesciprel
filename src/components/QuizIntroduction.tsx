import * as React from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import styles from './QuizIntroduction.module.scss';

interface QuizIntroductionProps {
  onNavigate: (view: string) => void;
}

const QuizIntroduction: React.FC<QuizIntroductionProps> = ({ onNavigate }) => {
  return (
    <Stack tokens={{ childrenGap: 30 }} styles={{ root: { maxWidth: 800, margin: '0 auto' } }}>
      
      <Stack horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <Text variant="xxLarge" styles={{ root: { fontWeight: 600, color: '#0078d4' } }}>
          📝 Quiz d'Introduction
        </Text>
        <Text variant="large" styles={{ root: { textAlign: 'center', color: '#605e5c' } }}>
          Découvrez les compétences fondamentales de CIPREL
        </Text>
      </Stack>

      <MessageBar messageBarType={MessageBarType.info}>
        <strong>Information :</strong> Ce quiz vous permettra de vous familiariser avec les compétences 
        clés attendues chez CIPREL. Il n'y a pas de bonnes ou mauvaises réponses.
      </MessageBar>

      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          À quoi vous attendre :
        </Text>
        
        <ul className={styles.quizList}>
          <li>✅ Questions sur les valeurs et la culture CIPREL</li>
          <li>✅ Compétences techniques de base</li>
          <li>✅ Soft skills et collaboration</li>
          <li>✅ Vision et objectifs de l'entreprise</li>
          <li>✅ Durée estimée : 10-15 minutes</li>
        </ul>
      </Stack>

      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Instructions :
        </Text>
        
        <ol className={styles.instructionsList}>
          <li>Lisez attentivement chaque question</li>
          <li>Répondez de manière spontanée et honnête</li>
          <li>Vous pouvez naviguer entre les questions</li>
          <li>Votre progression est automatiquement sauvegardée</li>
        </ol>
      </Stack>

      <MessageBar messageBarType={MessageBarType.warning}>
        <strong>Note :</strong> Ce quiz est en cours de développement. 
        Les questions seront bientôt disponibles.
      </MessageBar>

      {/* Actions */}
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 15 }}>
        <DefaultButton
          text="← Retour au tableau de bord"
          onClick={() => onNavigate('dashboard')}
          iconProps={{ iconName: 'Back' }}
        />
        <PrimaryButton
          text="Commencer le Quiz"
          onClick={() => {
            // TODO: Start quiz logic
            alert('Quiz en cours de développement');
          }}
          iconProps={{ iconName: 'Play' }}
          disabled
        />
      </Stack>

    </Stack>
  );
};

export default QuizIntroduction;
