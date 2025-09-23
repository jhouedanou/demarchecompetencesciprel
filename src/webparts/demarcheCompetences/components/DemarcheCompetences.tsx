import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { ThemeProvider, Theme, Spinner, MessageBar, MessageBarType } from '@fluentui/react';
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

// CIPREL theme colors
const ciprelTheme: Partial<Theme> = {
  palette: {
    themePrimary: '#ff6600',
    themeLighterAlt: '#fff8f5',
    themeLighter: '#ffe6d5',
    themeLight: '#ffd1aa',
    themeTertiary: '#ffa555',
    themeSecondary: '#ff7a1a',
    themeDarkAlt: '#e55c00',
    themeDark: '#c14e00',
    themeDarker: '#8f3900',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
    accent: '#107c10'
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
            <Spinner label="Chargement..." size="large" />
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
