import * as React from 'react';
import { Stack, Text, DefaultButton, MessageBar, MessageBarType, ProgressIndicator, Card } from '@fluentui/react';
const cardTokens = { childrenMargin: 12 };
const ProgressTracker = ({ onNavigate }) => {
    // Mock data for demonstration
    const mockProgress = [
        { name: 'Compétences techniques', progress: 0.7, color: '#0078d4' },
        { name: 'Communication', progress: 0.85, color: '#107c10' },
        { name: 'Management', progress: 0.4, color: '#d83b01' },
        { name: 'Innovation', progress: 0.6, color: '#8764b8' }
    ];
    return (React.createElement(Stack, { tokens: { childrenGap: 30 }, styles: { root: { maxWidth: 900, margin: '0 auto' } } },
        React.createElement(Stack, { horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#d83b01' } } }, "\uD83D\uDCC8 Suivi des Progr\u00E8s"),
            React.createElement(Text, { variant: "large", styles: { root: { textAlign: 'center', color: '#605e5c' } } }, "Consultez votre \u00E9volution et vos r\u00E9sultats")),
        React.createElement(MessageBar, { messageBarType: MessageBarType.info },
            React.createElement("strong", null, "Aper\u00E7u :"),
            " Voici un aper\u00E7u de votre progression dans les diff\u00E9rents domaines de comp\u00E9tences. Les donn\u00E9es r\u00E9elles seront disponibles apr\u00E8s avoir compl\u00E9t\u00E9 les \u00E9valuations."),
        React.createElement(Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 20 }, horizontalAlign: "center" }, mockProgress.map((item, index) => (React.createElement(Card, { key: index, tokens: cardTokens, styles: { root: { width: 250, padding: 20 } } },
            React.createElement(Stack, { tokens: { childrenGap: 10 } },
                React.createElement(Text, { variant: "medium", styles: { root: { fontWeight: 600 } } }, item.name),
                React.createElement(ProgressIndicator, { percentComplete: item.progress, description: `${Math.round(item.progress * 100)}% complété`, barHeight: 8 }),
                React.createElement(Stack, { horizontal: true, horizontalAlign: "space-between" },
                    React.createElement(Text, { variant: "small" }, "Niveau actuel"),
                    React.createElement(Text, { variant: "small", styles: { root: { fontWeight: 600, color: item.color } } }, item.progress >= 0.8 ? 'Expert' :
                        item.progress >= 0.6 ? 'Confirmé' :
                            item.progress >= 0.4 ? 'Intermédiaire' : 'Débutant'))))))),
        React.createElement(Card, { tokens: cardTokens, styles: { root: { padding: 30 } } },
            React.createElement(Stack, { tokens: { childrenGap: 20 } },
                React.createElement(Text, { variant: "xLarge", styles: { root: { fontWeight: 600, textAlign: 'center' } } }, "\uD83D\uDCCA Statistiques Globales"),
                React.createElement(Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 30 }, horizontalAlign: "space-around" },
                    React.createElement(Stack, { tokens: { childrenGap: 5 }, horizontalAlign: "center" },
                        React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#0078d4' } } }, "0"),
                        React.createElement(Text, { variant: "medium" }, "Quiz compl\u00E9t\u00E9s")),
                    React.createElement(Stack, { tokens: { childrenGap: 5 }, horizontalAlign: "center" },
                        React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#107c10' } } }, "0%"),
                        React.createElement(Text, { variant: "medium" }, "Score moyen")),
                    React.createElement(Stack, { tokens: { childrenGap: 5 }, horizontalAlign: "center" },
                        React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#d83b01' } } }, "0h"),
                        React.createElement(Text, { variant: "medium" }, "Temps d'apprentissage")),
                    React.createElement(Stack, { tokens: { childrenGap: 5 }, horizontalAlign: "center" },
                        React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#8764b8' } } }, "0/12"),
                        React.createElement(Text, { variant: "medium" }, "Comp\u00E9tences ma\u00EEtris\u00E9es"))))),
        React.createElement(MessageBar, { messageBarType: MessageBarType.warning },
            React.createElement("strong", null, "En cours de d\u00E9veloppement :"),
            " Les donn\u00E9es de progression r\u00E9elles seront disponibles une fois que vous aurez compl\u00E9t\u00E9 les quiz et \u00E9valuations."),
        React.createElement(Stack, { horizontal: true, horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(DefaultButton, { text: "\u2190 Retour au tableau de bord", onClick: () => onNavigate('dashboard'), iconProps: { iconName: 'Back' } }),
            React.createElement(DefaultButton, { text: "Commencer une \u00E9valuation", onClick: () => onNavigate('quiz-introduction'), iconProps: { iconName: 'TestBeaker' } }))));
};
export default ProgressTracker;
//# sourceMappingURL=ProgressTracker.js.map