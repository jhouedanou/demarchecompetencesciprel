import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/index';
import { 
  setCurrentView, 
  addNotification, 
  removeNotification, 
  clearNotifications,
  updateSettings
} from '@stores/index';

import {
  Stack,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  CommandBar,
  ICommandBarItemProps,
  Panel,
  PanelType,
  DefaultButton,
  PrimaryButton,
  Text,
  ThemeProvider,
  PartialTheme,
  Separator
} from '@fluentui/react';

import { WebPartContext } from '@microsoft/sp-webpart-base';

// Import child components (you'll need to create these)
import Dashboard from '@components/Dashboard';
import QuizIntroduction from '@components/QuizIntroduction';
import QuizSondage from '@components/QuizSondage';
import ProgressTracker from '@components/ProgressTracker';

interface Props {
  webPartProperties: any;
  webPartContext: WebPartContext;
  domElement: HTMLElement;
}

const customTheme: PartialTheme = {
  palette: {
    themePrimary: '#0078d4',
    themeSecondary: '#106ebe',
    themeDarkAlt: '#005a9e',
    neutralLight: '#f3f2f1',
    neutralLighter: '#faf9f8',
    white: '#ffffff'
  }
};

const DemarcheCompetenceApp: React.FC<Props> = ({
  webPartProperties,
  webPartContext,
  domElement
}) => {
  const dispatch = useDispatch();
  
  // Redux state
  const app = useSelector((state: RootState) => state.app);
  const user = useSelector((state: RootState) => state.user);
  const quiz = useSelector((state: RootState) => state.quiz);

  // Local state
  const [showSettings, setShowSettings] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  // Navigation items
  const navigationItems: ICommandBarItemProps[] = [
    {
      key: 'dashboard',
      text: 'Tableau de bord',
      iconProps: { iconName: 'Home' },
      onClick: () => dispatch(setCurrentView('dashboard'))
    },
    {
      key: 'quiz-introduction',
      text: 'Quiz d\'introduction',
      iconProps: { iconName: 'TestBeaker' },
      onClick: () => dispatch(setCurrentView('quiz-introduction')),
      disabled: !user.isAuthenticated
    },
    {
      key: 'quiz-sondage',
      text: 'Sondage compétences',
      iconProps: { iconName: 'Survey' },
      onClick: () => dispatch(setCurrentView('quiz-sondage')),
      disabled: !user.isAuthenticated
    },
    {
      key: 'progress',
      text: 'Suivi des progrès',
      iconProps: { iconName: 'ProgressRingDots' },
      onClick: () => dispatch(setCurrentView('progress')),
      disabled: !user.isAuthenticated
    }
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'notifications',
      text: `Notifications (${app.notifications.length})`,
      iconProps: { iconName: 'Ringer' },
      onClick: () => setShowNotifications(true)
    },
    {
      key: 'settings',
      text: 'Paramètres',
      iconProps: { iconName: 'Settings' },
      onClick: () => setShowSettings(true)
    }
  ];

  // Handle notification dismiss
  const handleDismissNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  // Render loading state
  if (app.loading && !app.initialized) {
    return (
      <ThemeProvider theme={customTheme}>
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{ root: { height: '400px', background: '#f3f2f1' } }}
        >
          <Spinner size={SpinnerSize.large} label="Chargement en cours..." />
          <Text variant="medium" styles={{ root: { marginTop: 20 } }}>
            Initialisation de l'application
          </Text>
        </Stack>
      </ThemeProvider>
    );
  }

  // Render error state
  if (app.error && !app.initialized) {
    return (
      <ThemeProvider theme={customTheme}>
        <Stack
          horizontalAlign="center"
          verticalAlign="center"
          styles={{ root: { height: '400px', padding: 40, background: '#f3f2f1' } }}
        >
          <MessageBar messageBarType={MessageBarType.error} isMultiline>
            <strong>Erreur d'Application</strong><br />
            {app.error}
          </MessageBar>
          <PrimaryButton
            text="Réessayer"
            onClick={() => window.location.reload()}
            styles={{ root: { marginTop: 20 } }}
          />
        </Stack>
      </ThemeProvider>
    );
  }

  // Main render
  return (
    <ThemeProvider theme={customTheme}>
      <Stack styles={{ root: { height: '100%', minHeight: '400px' } }}>
        
        {/* Header / Navigation */}
        <CommandBar
          items={navigationItems}
          farItems={farItems}
          styles={{
            root: {
              padding: '0 20px',
              backgroundColor: customTheme.palette?.neutralLighter
            }
          }}
        />

        {/* Active notifications */}
        {app.notifications.length > 0 && (
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: '10px 20px' } }}>
            {app.notifications.slice(0, 3).map((notification) => (
              <MessageBar
                key={notification.id}
                messageBarType={
                  notification.type === 'success' ? MessageBarType.success :
                  notification.type === 'error' ? MessageBarType.error :
                  notification.type === 'warning' ? MessageBarType.warning :
                  MessageBarType.info
                }
                onDismiss={() => handleDismissNotification(notification.id)}
                isMultiline={false}
              >
                <strong>{notification.title}</strong>: {notification.message}
              </MessageBar>
            ))}
          </Stack>
        )}

        {/* Main Content */}
        <Stack.Item grow styles={{ root: { padding: '20px', overflow: 'auto' } }}>
          {app.currentView === 'dashboard' && (
            <Dashboard
              user={user.currentUser}
              canStartIntro={user.isAuthenticated}
              canStartSurvey={user.isAuthenticated}
              onNavigate={(view: string) => dispatch(setCurrentView(view))}
            />
          )}
          
          {app.currentView === 'quiz-introduction' && (
            <QuizIntroduction
              onNavigate={(view: string) => dispatch(setCurrentView(view))}
            />
          )}
          
          {app.currentView === 'quiz-sondage' && (
            <QuizSondage
              onNavigate={(view: string) => dispatch(setCurrentView(view))}
            />
          )}
          
          {app.currentView === 'progress' && (
            <ProgressTracker
              onNavigate={(view: string) => dispatch(setCurrentView(view))}
            />
          )}

          {/* Fallback content */}
          {!['dashboard', 'quiz-introduction', 'quiz-sondage', 'progress'].includes(app.currentView) && (
            <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }}>
              <Text variant="xLarge">🚀 Démarche Compétence CIPREL</Text>
              <Text variant="large">Application de gestion des compétences</Text>
              <Separator />
              <PrimaryButton
                text="Aller au tableau de bord"
                onClick={() => dispatch(setCurrentView('dashboard'))}
              />
            </Stack>
          )}
        </Stack.Item>

        {/* Settings Panel */}
        <Panel
          isOpen={showSettings}
          onDismiss={() => setShowSettings(false)}
          type={PanelType.medium}
          headerText="Paramètres"
        >
          <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: '20px 0' } }}>
            <Text variant="mediumPlus">Configuration de l'application</Text>
            
            <DefaultButton
              text={`Thème: ${app.settings.theme}`}
              onClick={() => {
                const newTheme = app.settings.theme === 'auto' ? 'light' : 
                                app.settings.theme === 'light' ? 'dark' : 'auto';
                dispatch(updateSettings({ theme: newTheme }));
              }}
            />
            
            <DefaultButton
              text={`Mode compact: ${app.settings.compactMode ? 'Activé' : 'Désactivé'}`}
              onClick={() => {
                dispatch(updateSettings({ compactMode: !app.settings.compactMode }));
              }}
            />
            
            <DefaultButton
              text={`Animations: ${app.settings.animationsEnabled ? 'Activées' : 'Désactivées'}`}
              onClick={() => {
                dispatch(updateSettings({ animationsEnabled: !app.settings.animationsEnabled }));
              }}
            />
          </Stack>
        </Panel>

        {/* Notifications Panel */}
        <Panel
          isOpen={showNotifications}
          onDismiss={() => setShowNotifications(false)}
          type={PanelType.medium}
          headerText="Notifications"
        >
          <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: '20px 0' } }}>
            {app.notifications.length === 0 ? (
              <Text>Aucune notification</Text>
            ) : (
              <>
                <DefaultButton
                  text="Effacer toutes"
                  onClick={() => dispatch(clearNotifications())}
                />
                {app.notifications.map((notification) => (
                  <MessageBar
                    key={notification.id}
                    messageBarType={
                      notification.type === 'success' ? MessageBarType.success :
                      notification.type === 'error' ? MessageBarType.error :
                      notification.type === 'warning' ? MessageBarType.warning :
                      MessageBarType.info
                    }
                    onDismiss={() => handleDismissNotification(notification.id)}
                    isMultiline
                  >
                    <strong>{notification.title}</strong><br />
                    {notification.message}<br />
                    <small>{new Date(notification.timestamp).toLocaleString('fr-FR')}</small>
                  </MessageBar>
                ))}
              </>
            )}
          </Stack>
        </Panel>

      </Stack>
    </ThemeProvider>
  );
};

export default DemarcheCompetenceApp;
