import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentView, removeNotification, clearNotifications, updateSettings } from '@stores/index';
import { Stack, Spinner, SpinnerSize, MessageBar, MessageBarType, CommandBar, Panel, PanelType, DefaultButton, PrimaryButton, Text, ThemeProvider, Separator } from '@fluentui/react';
// Import child components (you'll need to create these)
import Dashboard from '@components/Dashboard';
import QuizIntroduction from '@components/QuizIntroduction';
import QuizSondage from '@components/QuizSondage';
import ProgressTracker from '@components/ProgressTracker';
const customTheme = {
    palette: {
        themePrimary: '#0078d4',
        themeSecondary: '#106ebe',
        themeDarkAlt: '#005a9e',
        neutralLight: '#f3f2f1',
        neutralLighter: '#faf9f8',
        white: '#ffffff'
    }
};
const DemarcheCompetenceApp = ({ webPartProperties, webPartContext, domElement }) => {
    var _a;
    const dispatch = useDispatch();
    // Redux state
    const app = useSelector((state) => state.app);
    const user = useSelector((state) => state.user);
    const quiz = useSelector((state) => state.quiz);
    // Local state
    const [showSettings, setShowSettings] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    // Navigation items
    const navigationItems = [
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
    const farItems = [
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
    const handleDismissNotification = (id) => {
        dispatch(removeNotification(id));
    };
    // Render loading state
    if (app.loading && !app.initialized) {
        return (React.createElement(ThemeProvider, { theme: customTheme },
            React.createElement(Stack, { horizontalAlign: "center", verticalAlign: "center", styles: { root: { height: '400px', background: '#f3f2f1' } } },
                React.createElement(Spinner, { size: SpinnerSize.large, label: "Chargement en cours..." }),
                React.createElement(Text, { variant: "medium", styles: { root: { marginTop: 20 } } }, "Initialisation de l'application"))));
    }
    // Render error state
    if (app.error && !app.initialized) {
        return (React.createElement(ThemeProvider, { theme: customTheme },
            React.createElement(Stack, { horizontalAlign: "center", verticalAlign: "center", styles: { root: { height: '400px', padding: 40, background: '#f3f2f1' } } },
                React.createElement(MessageBar, { messageBarType: MessageBarType.error, isMultiline: true },
                    React.createElement("strong", null, "Erreur d'Application"),
                    React.createElement("br", null),
                    app.error),
                React.createElement(PrimaryButton, { text: "R\u00E9essayer", onClick: () => window.location.reload(), styles: { root: { marginTop: 20 } } }))));
    }
    // Main render
    return (React.createElement(ThemeProvider, { theme: customTheme },
        React.createElement(Stack, { styles: { root: { height: '100%', minHeight: '400px' } } },
            React.createElement(CommandBar, { items: navigationItems, farItems: farItems, styles: {
                    root: {
                        padding: '0 20px',
                        backgroundColor: (_a = customTheme.palette) === null || _a === void 0 ? void 0 : _a.neutralLighter
                    }
                } }),
            app.notifications.length > 0 && (React.createElement(Stack, { tokens: { childrenGap: 10 }, styles: { root: { padding: '10px 20px' } } }, app.notifications.slice(0, 3).map((notification) => (React.createElement(MessageBar, { key: notification.id, messageBarType: notification.type === 'success' ? MessageBarType.success :
                    notification.type === 'error' ? MessageBarType.error :
                        notification.type === 'warning' ? MessageBarType.warning :
                            MessageBarType.info, onDismiss: () => handleDismissNotification(notification.id), isMultiline: false },
                React.createElement("strong", null, notification.title),
                ": ",
                notification.message))))),
            React.createElement(Stack.Item, { grow: true, styles: { root: { padding: '20px', overflow: 'auto' } } },
                app.currentView === 'dashboard' && (React.createElement(Dashboard, { user: user.currentUser, canStartIntro: user.isAuthenticated, canStartSurvey: user.isAuthenticated, onNavigate: (view) => dispatch(setCurrentView(view)) })),
                app.currentView === 'quiz-introduction' && (React.createElement(QuizIntroduction, { onNavigate: (view) => dispatch(setCurrentView(view)) })),
                app.currentView === 'quiz-sondage' && (React.createElement(QuizSondage, { onNavigate: (view) => dispatch(setCurrentView(view)) })),
                app.currentView === 'progress' && (React.createElement(ProgressTracker, { onNavigate: (view) => dispatch(setCurrentView(view)) })),
                !['dashboard', 'quiz-introduction', 'quiz-sondage', 'progress'].includes(app.currentView) && (React.createElement(Stack, { horizontalAlign: "center", tokens: { childrenGap: 20 } },
                    React.createElement(Text, { variant: "xLarge" }, "\uD83D\uDE80 D\u00E9marche Comp\u00E9tence CIPREL"),
                    React.createElement(Text, { variant: "large" }, "Application de gestion des comp\u00E9tences"),
                    React.createElement(Separator, null),
                    React.createElement(PrimaryButton, { text: "Aller au tableau de bord", onClick: () => dispatch(setCurrentView('dashboard')) })))),
            React.createElement(Panel, { isOpen: showSettings, onDismiss: () => setShowSettings(false), type: PanelType.medium, headerText: "Param\u00E8tres" },
                React.createElement(Stack, { tokens: { childrenGap: 20 }, styles: { root: { padding: '20px 0' } } },
                    React.createElement(Text, { variant: "mediumPlus" }, "Configuration de l'application"),
                    React.createElement(DefaultButton, { text: `Thème: ${app.settings.theme}`, onClick: () => {
                            const newTheme = app.settings.theme === 'auto' ? 'light' :
                                app.settings.theme === 'light' ? 'dark' : 'auto';
                            dispatch(updateSettings({ theme: newTheme }));
                        } }),
                    React.createElement(DefaultButton, { text: `Mode compact: ${app.settings.compactMode ? 'Activé' : 'Désactivé'}`, onClick: () => {
                            dispatch(updateSettings({ compactMode: !app.settings.compactMode }));
                        } }),
                    React.createElement(DefaultButton, { text: `Animations: ${app.settings.animationsEnabled ? 'Activées' : 'Désactivées'}`, onClick: () => {
                            dispatch(updateSettings({ animationsEnabled: !app.settings.animationsEnabled }));
                        } }))),
            React.createElement(Panel, { isOpen: showNotifications, onDismiss: () => setShowNotifications(false), type: PanelType.medium, headerText: "Notifications" },
                React.createElement(Stack, { tokens: { childrenGap: 15 }, styles: { root: { padding: '20px 0' } } }, app.notifications.length === 0 ? (React.createElement(Text, null, "Aucune notification")) : (React.createElement(React.Fragment, null,
                    React.createElement(DefaultButton, { text: "Effacer toutes", onClick: () => dispatch(clearNotifications()) }),
                    app.notifications.map((notification) => (React.createElement(MessageBar, { key: notification.id, messageBarType: notification.type === 'success' ? MessageBarType.success :
                            notification.type === 'error' ? MessageBarType.error :
                                notification.type === 'warning' ? MessageBarType.warning :
                                    MessageBarType.info, onDismiss: () => handleDismissNotification(notification.id), isMultiline: true },
                        React.createElement("strong", null, notification.title),
                        React.createElement("br", null),
                        notification.message,
                        React.createElement("br", null),
                        React.createElement("small", null, new Date(notification.timestamp).toLocaleString('fr-FR'))))))))))));
};
export default DemarcheCompetenceApp;
//# sourceMappingURL=DemarcheCompetenceApp.js.map