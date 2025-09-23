import * as React from 'react';
import { 
  PrimaryButton, 
  DefaultButton, 
  Text, 
  Stack,
  mergeStyles
} from '@fluentui/react';

import Card from './shared/CardComponent';
import { useNavigation, useUser } from '../contexts/AppContext';
import styles from './DemarcheCompetences.module.scss';

const cardSectionStyles = {
  root: {
    padding: '12px',
    borderBottom: '1px solid #edebe9'
  }
};

const iconStyles = mergeStyles({
  fontSize: '48px',
  margin: '0 16px 16px 0',
  color: '#ff6600'
});

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <Card className={styles.benefitCard}>
    <Card.Section styles={cardSectionStyles}>
      <Stack horizontal verticalAlign="start">
        <div className={iconStyles}>{icon}</div>
        <Stack>
          <Text variant="large" block>
            <strong>{title}</strong>
          </Text>
          <Text variant="medium" block>
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card.Section>
  </Card>
);

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, description }) => (
  <Card className={styles.stepCard}>
    <Card.Section styles={cardSectionStyles}>
      <Stack>
        <div className={styles.stepNumber}>{stepNumber}</div>
        <Text variant="large" block>
          <strong>{title}</strong>
        </Text>
        <Text variant="medium" block>
          {description}
        </Text>
      </Stack>
    </Card.Section>
  </Card>
);

const LandingPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { greeting, canViewDashboard } = useUser();

  const benefits = [
    {
      icon: '🎯',
      title: 'Développement ciblé',
      description: 'Identifiez vos forces et domaines d\'amélioration pour un développement personnalisé'
    },
    {
      icon: '📈',
      title: 'Évolution de carrière',
      description: 'Alignez vos compétences avec les besoins de l\'organisation et vos aspirations professionnelles'
    },
    {
      icon: '🤝',
      title: 'Collaboration renforcée',
      description: 'Améliorez la communication et la collaboration au sein des équipes'
    },
    {
      icon: '💪',
      title: 'Performance accrue',
      description: 'Optimisez vos performances individuelles et collectives'
    },
    {
      icon: '🔄',
      title: 'Amélioration continue',
      description: 'Établissez un processus d\'amélioration continue de vos compétences'
    },
    {
      icon: '🌟',
      title: 'Excellence opérationnelle',
      description: 'Contribuez à l\'excellence opérationnelle de CIPREL'
    }
  ];

  const steps = [
    {
      stepNumber: 1,
      title: 'Auto-évaluation',
      description: 'Évaluez vos compétences actuelles dans différents domaines'
    },
    {
      stepNumber: 2,
      title: 'Identification des besoins',
      description: 'Identifiez les compétences nécessaires pour votre poste et vos objectifs'
    },
    {
      stepNumber: 3,
      title: 'Plan de développement',
      description: 'Élaborez un plan personnalisé pour développer vos compétences'
    },
    {
      stepNumber: 4,
      title: 'Mise en œuvre',
      description: 'Mettez en pratique votre plan avec le soutien de votre hiérarchie'
    },
    {
      stepNumber: 5,
      title: 'Évaluation et ajustement',
      description: 'Évaluez les progrès et ajustez votre plan selon les besoins'
    }
  ];

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Text variant="mega" block className={styles.heroTitle}>
              Démarche Compétences CIPREL
            </Text>
            <Text variant="large" block className={styles.heroSubtitle}>
              {greeting} ! Développez vos compétences et excellez dans votre parcours professionnel.
            </Text>
            <Text variant="medium" block className={styles.heroDescription}>
              Notre plateforme vous accompagne dans l'identification, le développement et 
              l'évaluation de vos compétences pour une carrière épanouissante chez CIPREL.
            </Text>
            <Stack horizontal tokens={{ childrenGap: 16 }} className={styles.heroButtons}>
              <PrimaryButton 
                text="Commencer le Quiz" 
                onClick={() => navigateTo('quiz')}
                className={styles.ctaButton}
              />
              <DefaultButton 
                text="Répondre au Sondage" 
                onClick={() => navigateTo('sondage')}
                className={styles.secondaryButton}
              />
              {canViewDashboard && (
                <DefaultButton 
                  text="Voir le Tableau de bord" 
                  onClick={() => navigateTo('dashboard')}
                />
              )}
            </Stack>
          </div>
          <div className={styles.heroImage}>
            <img 
              src={require('../assets/ciprel-logo.png')} 
              alt="CIPREL" 
              className={styles.logo}
              onError={(e) => {
                // Fallback if logo doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className={styles.stepsSection}>
        <div className={styles.sectionHeader}>
          <Text variant="xxLarge" block className={styles.sectionTitle}>
            Les 5 étapes de la démarche compétences
          </Text>
          <Text variant="large" block className={styles.sectionSubtitle}>
            Un processus structuré pour votre développement professionnel
          </Text>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <StepCard
              key={index}
              stepNumber={step.stepNumber}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <Text variant="xxLarge" block className={styles.sectionTitle}>
            Les bénéfices attendus
          </Text>
          <Text variant="large" block className={styles.sectionSubtitle}>
            Découvrez comment la démarche compétences peut transformer votre parcours
          </Text>
        </div>
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <Card className={styles.ctaCard}>
          <Card.Section>
            <Stack horizontalAlign="center" tokens={{ childrenGap: 24 }}>
              <Text variant="xLarge" block>
                <strong>Prêt à commencer votre parcours ?</strong>
              </Text>
              <Text variant="medium" block style={{ textAlign: 'center', maxWidth: '600px' }}>
                Commencez par notre quiz d'introduction pour évaluer vos connaissances actuelles 
                sur la démarche compétences, puis partagez votre opinion dans notre sondage.
              </Text>
              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <PrimaryButton 
                  text="Quiz d'Introduction" 
                  onClick={() => navigateTo('quiz')}
                  iconProps={{ iconName: 'TestBeakerSolid' }}
                />
                <DefaultButton 
                  text="Sondage d'Opinion" 
                  onClick={() => navigateTo('sondage')}
                  iconProps={{ iconName: 'Feedback' }}
                />
              </Stack>
            </Stack>
          </Card.Section>
        </Card>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <Text variant="small">
          © 2024 CIPREL - Compagnie Ivoirienne de Production d'Électricité - 
          Tous droits réservés
        </Text>
      </footer>
    </div>
  );
};

export default LandingPage;
