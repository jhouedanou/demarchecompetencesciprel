import * as React from 'react';
import { Stack, Text, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from '@fluentui/react';
const QuizSondage = ({ onNavigate }) => {
    return (React.createElement(Stack, { tokens: { childrenGap: 30 }, styles: { root: { maxWidth: 800, margin: '0 auto' } } },
        React.createElement(Stack, { horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(Text, { variant: "xxLarge", styles: { root: { fontWeight: 600, color: '#107c10' } } }, "\uD83D\uDCCA Sondage Comp\u00E9tences"),
            React.createElement(Text, { variant: "large", styles: { root: { textAlign: 'center', color: '#605e5c' } } }, "\u00C9valuez vos comp\u00E9tences actuelles dans diff\u00E9rents domaines")),
        React.createElement(MessageBar, { messageBarType: MessageBarType.info },
            React.createElement("strong", null, "Information :"),
            " Ce sondage vous permettra d'auto-\u00E9valuer vos comp\u00E9tences dans les domaines cl\u00E9s de votre poste chez CIPREL."),
        React.createElement(Stack, { tokens: { childrenGap: 20 } },
            React.createElement(Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "Domaines d'\u00E9valuation :"),
            React.createElement("ul", { style: { fontSize: '14px', lineHeight: '1.5' } },
                React.createElement("li", null, "\uD83D\uDD27 Comp\u00E9tences techniques"),
                React.createElement("li", null, "\uD83D\uDCBC Management et leadership"),
                React.createElement("li", null, "\uD83E\uDD1D Communication et collaboration"),
                React.createElement("li", null, "\uD83D\uDCC8 Gestion de projet"),
                React.createElement("li", null, "\uD83D\uDCA1 Innovation et cr\u00E9ativit\u00E9"),
                React.createElement("li", null, "\uD83C\uDFAF Orientation r\u00E9sultats"))),
        React.createElement(Stack, { tokens: { childrenGap: 20 } },
            React.createElement(Text, { variant: "mediumPlus", styles: { root: { fontWeight: 600 } } }, "\u00C9chelle d'\u00E9valuation :"),
            React.createElement(Stack, { tokens: { childrenGap: 10 } },
                React.createElement(Text, { variant: "medium" },
                    "1\uFE0F\u20E3 ",
                    React.createElement("strong", null, "D\u00E9butant"),
                    " - Connaissances de base"),
                React.createElement(Text, { variant: "medium" },
                    "2\uFE0F\u20E3 ",
                    React.createElement("strong", null, "Interm\u00E9diaire"),
                    " - Ma\u00EEtrise partielle"),
                React.createElement(Text, { variant: "medium" },
                    "3\uFE0F\u20E3 ",
                    React.createElement("strong", null, "Confirm\u00E9"),
                    " - Bonne ma\u00EEtrise"),
                React.createElement(Text, { variant: "medium" },
                    "4\uFE0F\u20E3 ",
                    React.createElement("strong", null, "Expert"),
                    " - Ma\u00EEtrise avanc\u00E9e"),
                React.createElement(Text, { variant: "medium" },
                    "5\uFE0F\u20E3 ",
                    React.createElement("strong", null, "R\u00E9f\u00E9rent"),
                    " - Expertise reconnue"))),
        React.createElement(MessageBar, { messageBarType: MessageBarType.warning },
            React.createElement("strong", null, "Note :"),
            " Ce sondage est en cours de d\u00E9veloppement. Les questions d'\u00E9valuation seront bient\u00F4t disponibles."),
        React.createElement(Stack, { horizontal: true, horizontalAlign: "center", tokens: { childrenGap: 15 } },
            React.createElement(DefaultButton, { text: "\u2190 Retour au tableau de bord", onClick: () => onNavigate('dashboard'), iconProps: { iconName: 'Back' } }),
            React.createElement(PrimaryButton, { text: "Commencer l'\u00C9valuation", onClick: () => {
                    // TODO: Start survey logic
                    alert('Sondage en cours de développement');
                }, iconProps: { iconName: 'Survey' }, disabled: true }))));
};
export default QuizSondage;
//# sourceMappingURL=QuizSondage.js.map