import * as React from 'react';
import { Stack, Text, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from '@fluentui/react';
const QuizIntroduction = ({ onNavigate }) => {
    return (React.createElement(Stack, { tokens: { childrenGap: 30 }, styles: { root: { maxWidth: 800, margin: '0 auto' } } },
        React.createElement(Stack, { horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#0078d4' } } }, "\uD83D\uDCDD Quiz d'Introduction"),
            React.createElement(Text, { variant: "large", styles: { root: { textAlign: 'center', color: '#605e5c' } } }, "D\u00E9couvrez les comp\u00E9tences fondamentales de CIPREL")),
        React.createElement(MessageBar, { messageBarType: MessageBarType.info },
            React.createElement("strong", null, "Information :"),
            " Ce quiz vous permettra de vous familiariser avec les comp\u00E9tences cl\u00E9s attendues chez CIPREL. Il n'y a pas de bonnes ou mauvaises r\u00E9ponses."),
        React.createElement(Stack, { tokens: { childrenGap: 20 } },
            React.createElement(Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "\u00C0 quoi vous attendre :"),
            React.createElement("ul", { style: { fontSize: '14px', lineHeight: '1.5' } },
                React.createElement("li", null, "\u2705 Questions sur les valeurs et la culture CIPREL"),
                React.createElement("li", null, "\u2705 Comp\u00E9tences techniques de base"),
                React.createElement("li", null, "\u2705 Soft skills et collaboration"),
                React.createElement("li", null, "\u2705 Vision et objectifs de l'entreprise"),
                React.createElement("li", null, "\u2705 Dur\u00E9e estim\u00E9e : 10-15 minutes"))),
        React.createElement(Stack, { tokens: { childrenGap: 20 } },
            React.createElement(Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Instructions :"),
            React.createElement("ol", { style: { fontSize: '14px', lineHeight: '1.5' } },
                React.createElement("li", null, "Lisez attentivement chaque question"),
                React.createElement("li", null, "R\u00E9pondez de mani\u00E8re spontan\u00E9e et honn\u00EAte"),
                React.createElement("li", null, "Vous pouvez naviguer entre les questions"),
                React.createElement("li", null, "Votre progression est automatiquement sauvegard\u00E9e"))),
        React.createElement(MessageBar, { messageBarType: MessageBarType.warning },
            React.createElement("strong", null, "Note :"),
            " Ce quiz est en cours de d\u00E9veloppement. Les questions seront bient\u00F4t disponibles."),
        React.createElement(Stack, { horizontal: true, horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(DefaultButton, { text: "\u2190 Retour au tableau de bord", onClick: () => onNavigate('dashboard'), iconProps: { iconName: 'Back' } }),
            React.createElement(PrimaryButton, { text: "Commencer le Quiz", onClick: () => {
                    // TODO: Start quiz logic
                    alert('Quiz en cours de développement');
                }, iconProps: { iconName: 'Play' }, disabled: true }))));
};
export default QuizIntroduction;
//# sourceMappingURL=QuizIntroduction.js.map