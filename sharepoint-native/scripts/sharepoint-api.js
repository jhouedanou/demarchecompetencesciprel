/**
 * SharePoint API - Service pour interagir avec les listes SharePoint
 * Version native sans framework
 */

class SharePointAPI {
    constructor() {
        this.siteUrl = _spPageContextInfo ? _spPageContextInfo.webAbsoluteUrl : '';
        this.listUrls = {
            quizIntroduction: `${this.siteUrl}/_api/web/lists/getbytitle('Quiz_Introduction')/items`,
            quizSondage: `${this.siteUrl}/_api/web/lists/getbytitle('Quiz_Sondage')/items`,
            quizResults: `${this.siteUrl}/_api/web/lists/getbytitle('Quiz_Results')/items`,
            userProgress: `${this.siteUrl}/_api/web/lists/getbytitle('User_Progress')/items`
        };
        
        // Headers par défaut pour les requêtes SharePoint
        this.headers = {
            'Accept': 'application/json; odata=verbose',
            'Content-Type': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val() || ''
        };
    }

    /**
     * Obtenir les informations de l'utilisateur actuel
     */
    async getCurrentUser() {
        try {
            const response = await fetch(`${this.siteUrl}/_api/web/currentuser`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                id: data.d.Id,
                title: data.d.Title,
                email: data.d.Email,
                loginName: data.d.LoginName
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
            // Fallback pour les tests hors SharePoint
            return {
                id: 1,
                title: 'Utilisateur Test',
                email: 'test@ciprel.ci',
                loginName: 'test'
            };
        }
    }

    /**
     * Obtenir les questions du quiz d'introduction
     */
    async getQuizIntroductionQuestions() {
        try {
            const response = await fetch(`${this.listUrls.quizIntroduction}?$orderby=Order`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data.d.results.map(item => ({
                id: item.Id,
                title: item.Title,
                question: item.Question,
                options: this.parseJSON(item.Options, []),
                correctAnswer: item.CorrectAnswer,
                category: item.Category,
                points: item.Points || 1,
                order: item.Order || 0
            }));
        } catch (error) {
            console.error('Erreur lors du chargement des questions d\'introduction:', error);
            // Retourner des données de test
            return this.getTestQuizData();
        }
    }

    /**
     * Obtenir les questions du sondage
     */
    async getQuizSondageQuestions() {
        try {
            const response = await fetch(`${this.listUrls.quizSondage}?$orderby=Order`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data.d.results.map(item => ({
                id: item.Id,
                title: item.Title,
                question: item.Question,
                type: this.mapQuestionType(item.QuestionType),
                options: this.parseJSON(item.Options, []),
                required: item.Required || false,
                order: item.Order || 0
            }));
        } catch (error) {
            console.error('Erreur lors du chargement des questions du sondage:', error);
            // Retourner des données de test
            return this.getTestSurveyData();
        }
    }

    /**
     * Sauvegarder un résultat de quiz
     */
    async saveQuizResult(result) {
        try {
            const user = await this.getCurrentUser();
            
            const itemData = {
                __metadata: { type: 'SP.Data.Quiz_ResultsListItem' },
                Title: `${result.quizType} - ${user.title} - ${new Date().toLocaleDateString('fr-FR')}`,
                UserId: user.id,
                QuizType: result.quizType,
                Responses: JSON.stringify(result.responses),
                Score: result.score || 0,
                CompletionDate: result.endTime.toISOString(),
                Duration: result.duration || 0,
                Status: result.status || 'Completed'
            };

            const response = await fetch(this.listUrls.quizResults, {
                method: 'POST',
                headers: {
                    ...this.headers,
                    'X-RequestDigest': await this.getRequestDigest()
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            console.log('Résultat sauvegardé avec succès');
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du résultat:', error);
            // En mode test, juste logger
            console.log('Mode test: résultat non sauvegardé', result);
        }
    }

    /**
     * Obtenir les résultats d'un utilisateur
     */
    async getUserResults(userId) {
        try {
            const user = userId ? { email: userId } : await this.getCurrentUser();
            const filter = `$filter=User/Email eq '${user.email}'&$expand=User&$orderby=CompletionDate desc`;
            
            const response = await fetch(`${this.listUrls.quizResults}?${filter}`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data.d.results.map(item => ({
                id: item.Id,
                userId: item.User.Email,
                userName: item.User.Title,
                quizType: item.QuizType,
                responses: this.parseJSON(item.Responses, []),
                score: item.Score || 0,
                completionDate: new Date(item.CompletionDate),
                duration: item.Duration || 0,
                status: item.Status
            }));
        } catch (error) {
            console.error('Erreur lors du chargement des résultats:', error);
            return [];
        }
    }

    /**
     * Obtenir le Request Digest pour les opérations POST
     */
    async getRequestDigest() {
        try {
            const response = await fetch(`${this.siteUrl}/_api/contextinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json; odata=verbose'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            return data.d.GetContextWebInformation.FormDigestValue;
        } catch (error) {
            console.error('Erreur lors de l\'obtention du Request Digest:', error);
            return '';
        }
    }

    /**
     * Utilitaires
     */
    parseJSON(jsonString, defaultValue = []) {
        try {
            return jsonString ? JSON.parse(jsonString) : defaultValue;
        } catch (error) {
            console.warn('Erreur lors du parsing JSON:', error);
            return defaultValue;
        }
    }

    mapQuestionType(spType) {
        switch (spType) {
            case 'Multiple Choice': return 'multiple-choice';
            case 'Text': return 'text';
            case 'Rating': return 'rating';
            default: return 'text';
        }
    }

    /**
     * Données de test pour le développement hors SharePoint
     */
    getTestQuizData() {
        return [
            {
                id: 1,
                title: "Connaissance de base",
                question: "Qu'est-ce que la démarche compétence ?",
                options: [
                    "Une méthode d'évaluation des performances",
                    "Un processus de développement des compétences",
                    "Un système de gestion des ressources humaines",
                    "Un outil de formation continue"
                ],
                correctAnswer: "Un processus de développement des compétences",
                category: "Général",
                points: 2,
                order: 1
            },
            {
                id: 2,
                title: "Objectifs de la démarche",
                question: "Quels sont les principaux objectifs de la démarche compétence chez CIPREL ?",
                options: [
                    "Améliorer les performances individuelles",
                    "Développer les compétences techniques",
                    "Favoriser l'évolution de carrière",
                    "Toutes les réponses ci-dessus"
                ],
                correctAnswer: "Toutes les réponses ci-dessus",
                category: "Objectifs",
                points: 3,
                order: 2
            },
            {
                id: 3,
                title: "Processus d'évaluation",
                question: "À quelle fréquence les évaluations de compétences doivent-elles être réalisées ?",
                options: [
                    "Tous les mois",
                    "Tous les trimestres", 
                    "Tous les semestres",
                    "Tous les ans"
                ],
                correctAnswer: "Tous les semestres",
                category: "Processus",
                points: 2,
                order: 3
            }
        ];
    }

    getTestSurveyData() {
        return [
            {
                id: 1,
                title: "Satisfaction générale",
                question: "Comment évaluez-vous votre satisfaction générale concernant la démarche compétence ?",
                type: "rating",
                options: ["1", "2", "3", "4", "5"],
                required: true,
                order: 1
            },
            {
                id: 2,
                title: "Formation reçue",
                question: "La formation reçue répond-elle à vos attentes ?",
                type: "multiple-choice",
                options: [
                    "Tout à fait",
                    "Plutôt oui",
                    "Plutôt non",
                    "Pas du tout"
                ],
                required: true,
                order: 2
            },
            {
                id: 3,
                title: "Suggestions",
                question: "Avez-vous des suggestions d'amélioration ?",
                type: "text",
                options: [],
                required: false,
                order: 3
            }
        ];
    }
}

// Instance globale
window.SharePointAPI = new SharePointAPI();
