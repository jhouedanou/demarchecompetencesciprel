var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var QuizService = /** @class */ (function () {
    function QuizService(sharePointService) {
        this.sharePointService = sharePointService;
    }
    /**
     * Load and transform introduction quiz questions
     */
    QuizService.prototype.loadIntroductionQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sharePointService.getQuizIntroductionQuestions()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return _this.transformIntroductionItem(item); })];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error loading introduction questions:', error_1);
                        throw new Error('Impossible de charger les questions du quiz d\'introduction');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load and transform survey questions
     */
    QuizService.prototype.loadSurveyQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sharePointService.getQuizSondageQuestions()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return _this.transformSurveyItem(item); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error loading survey questions:', error_2);
                        throw new Error('Impossible de charger les questions du sondage');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Alias FR: Charger les questions du sondage (compatibilité avec le store)
     */
    QuizService.prototype.loadSondageQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.loadSurveyQuestions()];
            });
        });
    };
    /**
     * Save quiz result
     */
    QuizService.prototype.saveQuizResult = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var sharePointResult, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sharePointResult = {
                            QuizType: result.quizType,
                            Responses: JSON.stringify(result.responses),
                            Score: result.score,
                            CompletionDate: result.endTime.toISOString(),
                            Duration: result.duration,
                            Status: result.status
                        };
                        return [4 /*yield*/, this.sharePointService.saveQuizResult(sharePointResult)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error saving quiz result:', error_3);
                        throw new Error('Impossible de sauvegarder le résultat du quiz');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load user's quiz results
     */
    QuizService.prototype.loadUserResults = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sharePointService.getQuizResults(userId)];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return _this.transformResultItem(item); })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error loading user results:', error_4);
                        throw new Error('Impossible de charger les résultats de l\'utilisateur');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save quiz progress (for auto-save functionality)
     */
    QuizService.prototype.saveProgress = function (progressData) {
        return __awaiter(this, void 0, void 0, function () {
            var progressKey, progressInfo;
            return __generator(this, function (_a) {
                try {
                    progressKey = "quiz_progress_".concat(progressData.userId, "_").concat(progressData.quizType);
                    progressInfo = {
                        responses: progressData.responses,
                        currentQuestion: progressData.currentQuestion,
                        startTime: progressData.startTime.toISOString(),
                        status: progressData.status,
                        lastSaved: new Date().toISOString()
                    };
                    localStorage.setItem(progressKey, JSON.stringify(progressInfo));
                }
                catch (error) {
                    console.error('Error saving progress:', error);
                    // Don't throw error for progress saving as it's not critical
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Load saved progress
     */
    QuizService.prototype.loadProgress = function (userId, quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var progressKey, savedProgress, progress;
            return __generator(this, function (_a) {
                try {
                    progressKey = "quiz_progress_".concat(userId, "_").concat(quizType);
                    savedProgress = localStorage.getItem(progressKey);
                    if (!savedProgress) {
                        return [2 /*return*/, null];
                    }
                    progress = JSON.parse(savedProgress);
                    return [2 /*return*/, {
                            responses: progress.responses,
                            currentQuestion: progress.currentQuestion,
                            startTime: new Date(progress.startTime),
                            status: progress.status
                        }];
                }
                catch (error) {
                    console.error('Error loading progress:', error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Clear saved progress
     */
    QuizService.prototype.clearProgress = function (userId, quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var progressKey;
            return __generator(this, function (_a) {
                try {
                    progressKey = "quiz_progress_".concat(userId, "_").concat(quizType);
                    localStorage.removeItem(progressKey);
                }
                catch (error) {
                    console.error('Error clearing progress:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Get quiz statistics
     */
    QuizService.prototype.getQuizStatistics = function (quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var results, filteredResults, completedResults, statistics, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sharePointService.getQuizResults()];
                    case 1:
                        results = _a.sent();
                        filteredResults = results;
                        if (quizType) {
                            filteredResults = results.filter(function (r) { return r.QuizType === quizType; });
                        }
                        completedResults = filteredResults.filter(function (r) { return r.Status === 'Completed'; });
                        statistics = {
                            totalParticipants: filteredResults.length,
                            averageScore: this.calculateAverageScore(completedResults),
                            completionRate: filteredResults.length > 0 ? (completedResults.length / filteredResults.length) * 100 : 0,
                            averageCompletionTime: this.calculateAverageCompletionTime(completedResults),
                            categoryBreakdown: this.calculateCategoryBreakdown(completedResults)
                        };
                        return [2 /*return*/, statistics];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting quiz statistics:', error_5);
                        throw new Error('Impossible de charger les statistiques du quiz');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Export quiz results
     */
    QuizService.prototype.exportResults = function (quizType, format) {
        if (format === void 0) { format = 'csv'; }
        return __awaiter(this, void 0, void 0, function () {
            var results, dataToExport, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.sharePointService.getQuizResults()];
                    case 1:
                        results = _a.sent();
                        dataToExport = results;
                        if (quizType) {
                            dataToExport = results.filter(function (r) { return r.QuizType === quizType; });
                        }
                        if (!(format === 'csv')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.exportToCSV(dataToExport, quizType)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.exportToJSON(dataToExport, quizType)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_6 = _a.sent();
                        console.error('Error exporting results:', error_6);
                        throw new Error('Impossible d\'exporter les résultats');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate quiz responses
     */
    QuizService.prototype.validateResponses = function (questions, responses) {
        var errors = [];
        var warnings = [];
        // Check if all required questions are answered
        var requiredQuestions = questions.filter(function (q) { return q.required; });
        var answeredQuestionIds = responses.map(function (r) { return r.questionId; });
        for (var _i = 0, requiredQuestions_1 = requiredQuestions; _i < requiredQuestions_1.length; _i++) {
            var question = requiredQuestions_1[_i];
            if (!answeredQuestionIds.includes(question.id)) {
                errors.push("La question \"".concat(question.question, "\" est obligatoire"));
            }
        }
        var _loop_1 = function (response) {
            var question = questions.find(function (q) { return q.id === response.questionId; });
            if (!question) {
                warnings.push("Question non trouv\u00E9e pour la r\u00E9ponse ".concat(response.questionId));
                return "continue";
            }
            // Validate based on question type
            switch (question.type) {
                case 'multiple-choice':
                    if (!question.options.some(function (opt) { return opt.id === response.answer; })) {
                        errors.push("R\u00E9ponse invalide pour la question \"".concat(question.question, "\""));
                    }
                    break;
                case 'rating':
                    var rating = Number(response.answer);
                    if (isNaN(rating) || rating < 1 || rating > 5) {
                        errors.push("Note invalide pour la question \"".concat(question.question, "\" (doit \u00EAtre entre 1 et 5)"));
                    }
                    break;
                case 'text':
                    if (question.required && (!response.answer || response.answer.toString().trim().length === 0)) {
                        errors.push("R\u00E9ponse textuelle requise pour la question \"".concat(question.question, "\""));
                    }
                    break;
            }
        };
        // Check response formats
        for (var _a = 0, responses_1 = responses; _a < responses_1.length; _a++) {
            var response = responses_1[_a];
            _loop_1(response);
        }
        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    };
    /**
     * Calculate quiz score
     */
    QuizService.prototype.calculateScore = function (questions, responses) {
        var score = 0;
        var totalPossible = 0;
        var correctAnswers = 0;
        var _loop_2 = function (question) {
            if (question.correctAnswer) { // Only count questions with correct answers
                totalPossible += question.points;
                var response = responses.find(function (r) { return r.questionId === question.id; });
                if (response && response.answer === question.correctAnswer) {
                    score += question.points;
                    correctAnswers++;
                }
            }
        };
        for (var _i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
            var question = questions_1[_i];
            _loop_2(question);
        }
        return {
            score: score,
            totalPossible: totalPossible,
            correctAnswers: correctAnswers,
            percentage: totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 0
        };
    };
    /**
     * Transform SharePoint items to QuizQuestion format
     */
    QuizService.prototype.transformIntroductionItem = function (item) {
        return {
            id: item.Id.toString(),
            title: item.Title,
            question: item.Question,
            type: 'multiple-choice',
            options: Array.isArray(item.Options) ?
                item.Options.map(function (opt, index) { return ({
                    id: (index + 1).toString(),
                    text: opt,
                    correct: opt === item.CorrectAnswer
                }); }) : [],
            correctAnswer: item.CorrectAnswer,
            category: item.Category,
            points: item.Points,
            order: item.Order,
            required: true
        };
    };
    QuizService.prototype.transformSurveyItem = function (item) {
        return {
            id: item.Id.toString(),
            title: item.Title,
            question: item.Question,
            type: this.mapQuestionType(item.QuestionType),
            options: Array.isArray(item.Options) ?
                item.Options.map(function (opt, index) { return ({
                    id: (index + 1).toString(),
                    text: opt
                }); }) : [],
            points: 0,
            order: item.Order,
            required: item.Required
        };
    };
    QuizService.prototype.transformResultItem = function (item) {
        return {
            id: item.Id.toString(),
            userId: item.User.Email,
            userName: item.User.Title,
            quizType: item.QuizType,
            responses: Array.isArray(item.Responses) ? item.Responses : [],
            score: item.Score,
            totalQuestions: this.getTotalQuestions(item.Responses),
            correctAnswers: this.getCorrectAnswers(item.Responses),
            startTime: new Date(item.Created),
            endTime: new Date(item.CompletionDate || item.Modified),
            duration: item.Duration,
            status: item.Status
        };
    };
    QuizService.prototype.mapQuestionType = function (spType) {
        switch (spType) {
            case 'Multiple Choice': return 'multiple-choice';
            case 'Text': return 'text';
            case 'Rating': return 'rating';
            default: return 'text';
        }
    };
    QuizService.prototype.getTotalQuestions = function (responses) {
        if (Array.isArray(responses)) {
            return responses.length;
        }
        return 0;
    };
    QuizService.prototype.getCorrectAnswers = function (responses) {
        if (Array.isArray(responses)) {
            return responses.filter(function (r) { return r.correct === true; }).length;
        }
        return 0;
    };
    QuizService.prototype.calculateAverageScore = function (results) {
        if (results.length === 0)
            return 0;
        var totalScore = results.reduce(function (sum, result) { return sum + (result.Score || 0); }, 0);
        return Math.round(totalScore / results.length);
    };
    QuizService.prototype.calculateAverageCompletionTime = function (results) {
        if (results.length === 0)
            return 0;
        var totalTime = results.reduce(function (sum, result) { return sum + (result.Duration || 0); }, 0);
        return Math.round(totalTime / results.length);
    };
    QuizService.prototype.calculateCategoryBreakdown = function (results) {
        var breakdown = {};
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var result = results_1[_i];
            var category = result.QuizType || 'Unknown';
            breakdown[category] = (breakdown[category] || 0) + 1;
        }
        return breakdown;
    };
    QuizService.prototype.exportToCSV = function (data, quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, rows, csvContent, blob, url, a;
            return __generator(this, function (_a) {
                headers = [
                    'ID',
                    'Utilisateur',
                    'Email',
                    'Type de Quiz',
                    'Score',
                    'Statut',
                    'Date de Completion',
                    'Durée (secondes)',
                    'Date de Création'
                ];
                rows = data.map(function (item) { return [
                    item.Id,
                    item.User.Title,
                    item.User.Email,
                    item.QuizType,
                    item.Score || 0,
                    item.Status,
                    item.CompletionDate,
                    item.Duration || 0,
                    item.Created
                ]; });
                csvContent = __spreadArray([headers], rows, true).map(function (row) { return row.map(function (cell) { return "\"".concat(cell, "\""); }).join(','); })
                    .join('\n');
                blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                url = URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = "quiz-results".concat(quizType ? "-".concat(quizType) : '', "-").concat(new Date().toISOString().split('T')[0], ".csv");
                a.click();
                URL.revokeObjectURL(url);
                return [2 /*return*/];
            });
        });
    };
    QuizService.prototype.exportToJSON = function (data, quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var exportData, blob, url, a;
            return __generator(this, function (_a) {
                exportData = {
                    exportDate: new Date().toISOString(),
                    quizType: quizType || 'All',
                    totalRecords: data.length,
                    data: data
                };
                blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                url = URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = "quiz-results".concat(quizType ? "-".concat(quizType) : '', "-").concat(new Date().toISOString().split('T')[0], ".json");
                a.click();
                URL.revokeObjectURL(url);
                return [2 /*return*/];
            });
        });
    };
    return QuizService;
}());
export { QuizService };
//# sourceMappingURL=QuizService.js.map