import * as React from 'react';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider, Spinner, MessageBar, MessageBarType, SpinnerSize } from '@fluentui/react';
import styles from './DemarcheCompetences.module.scss';
import type { IDemarcheCompetencesProps } from './IDemarcheCompetencesProps';
import { useAppContext, useNavigation, useError } from '../contexts/AppContext';
import Navigation from './shared/Navigation';
import LandingPage from './LandingPage';
import QuizIntroduction from './QuizIntroduction';
import SondageOpinion from './SondageOpinion';
import Dashboard from './Dashboard';
import ResultsWrapper from './ResultsWrapper';

// Initialize Fluent UI icons
initializeIcons();

// CIPREL theme colors (simplified for compatibility)
const ciprelTheme = {
  palette: {
    themePrimary: '#ff6600',
    themeLighterAlt: '#fff8f5',
    themeLighter: '#ffe6d5',
    themeLight: '#ffd1aa',
    themeTertiary: '#ffa555',
    themeSecondary: '#ff7a1a',
    themeDarkAlt: '#e55c00',
    themeDark: '#c14e00',
    themeDarker: '#8f3900'
  }
};

const AppRouter: React.FC = () => {
  const { state } = useAppContext();
  
  switch (state.currentPage) {
    case 'quiz':
      return <QuizIntroduction />;
    case 'sondage':
      return <SondageOpinion />;
    case 'dashboard':
      return <Dashboard />;
    case 'results':
      return <ResultsWrapper />;
    case 'landing':
    default:
      return <LandingPage />;
  }
};

const DemarcheCompetences: React.FC<IDemarcheCompetencesProps> = (props) => {
  const { error, hasError, clearError } = useError();
  const { isLoading } = useNavigation();
  const {
    isDarkTheme,
    hasTeamsContext
  } = props;

  return (
    <ThemeProvider theme={ciprelTheme}>
      <section className={`${styles.demarcheCompetences} ${hasTeamsContext ? styles.teams : ''} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}`}>
        <Navigation />
        
        {hasError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={clearError}
            dismissButtonAriaLabel="Fermer"
            className={styles.errorMessage}
          >
            {error}
          </MessageBar>
        )}

        {isLoading && (
          <div className={styles.loadingContainer}>
            <Spinner label="Chargement..." size={SpinnerSize.large} />
          </div>
        )}

        <div className={styles.content}>
          <AppRouter />
        </div>
      </section>
    </ThemeProvider>
  );
};

export default DemarcheCompetences;
