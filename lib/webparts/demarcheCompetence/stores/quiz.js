var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
export var useQuizStore = defineStore('quiz', function () {
    // State
    var loading = ref(false);
    var error = ref(null);
    // Quiz Questions
    var introductionQuestions = ref([]);
    var sondageQuestions = ref([]);
    // Current Quiz State
    var currentQuizType = ref(null);
    var currentQuestionIndex = ref(0);
    var quizStartTime = ref(null);
    var quizInProgress = ref(false);
    var currentResponses = ref([]);
    // Results
    var userResults = ref([]);
    var quizStatistics = ref(null);
    // Quiz service instance (will be injected)
    var quizService = null;
    // Computed
    var hasIntroductionQuestions = computed(function () { return introductionQuestions.value.length > 0; });
    var hasSondageQuestions = computed(function () { return sondageQuestions.value.length > 0; });
    var currentQuestion = computed(function () {
        if (currentQuizType.value === 'Introduction') {
            return introductionQuestions.value[currentQuestionIndex.value];
        }
        else if (currentQuizType.value === 'Sondage') {
            return sondageQuestions.value[currentQuestionIndex.value];
        }
        return null;
    });
    var totalQuestions = computed(function () {
        if (currentQuizType.value === 'Introduction') {
            return introductionQuestions.value.length;
        }
        else if (currentQuizType.value === 'Sondage') {
            return sondageQuestions.value.length;
        }
        return 0;
    });
    var quizProgress = computed(function () {
        if (totalQuestions.value === 0)
            return 0;
        return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
    });
    var hasCompletedIntroduction = computed(function () {
        return userResults.value.some(function (result) {
            return result.quizType === 'Introduction' && result.status === 'Completed';
        });
    });
    var hasCompletedSondage = computed(function () {
        return userResults.value.some(function (result) {
            return result.quizType === 'Sondage' && result.status === 'Completed';
        });
    });
    var latestIntroductionResult = computed(function () {
        return userResults.value
            .filter(function (result) { return result.quizType === 'Introduction' && result.status === 'Completed'; })
            .sort(function (a, b) { return new Date(b.endTime).getTime() - new Date(a.endTime).getTime(); })[0] || null;
    });
    var latestSondageResult = computed(function () {
        return userResults.value
            .filter(function (result) { return result.quizType === 'Sondage' && result.status === 'Completed'; })
            .sort(function (a, b) { return new Date(b.endTime).getTime() - new Date(a.endTime).getTime(); })[0] || null;
    });
    // Actions
    function setQuizService(service) {
        quizService = service;
    }
    function loadIntroductionQuestions() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = introductionQuestions;
                        return [4 /*yield*/, quizService.loadIntroductionQuestions()];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        error.value = err_1 instanceof Error ? err_1.message : 'Erreur lors du chargement des questions';
                        throw err_1;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadSondageQuestions() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = sondageQuestions;
                        return [4 /*yield*/, quizService.loadSondageQuestions()];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _b.sent();
                        error.value = err_2 instanceof Error ? err_2.message : 'Erreur lors du chargement des questions du sondage';
                        throw err_2;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadUserResults(userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = userResults;
                        return [4 /*yield*/, quizService.loadUserResults(userId)];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_3 = _b.sent();
                        error.value = err_3 instanceof Error ? err_3.message : 'Erreur lors du chargement des résultats';
                        throw err_3;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function startQuiz(quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var savedProgress, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentQuizType.value = quizType;
                        currentQuestionIndex.value = 0;
                        quizStartTime.value = new Date();
                        quizInProgress.value = true;
                        currentResponses.value = [];
                        error.value = null;
                        if (!(quizType === 'Introduction' && !hasIntroductionQuestions.value)) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadIntroductionQuestions()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(quizType === 'Sondage' && !hasSondageQuestions.value)) return [3 /*break*/, 4];
                        return [4 /*yield*/, loadSondageQuestions()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!quizService) return [3 /*break*/, 8];
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, quizService.loadProgress('current-user', quizType)];
                    case 6:
                        savedProgress = _a.sent();
                        if (savedProgress) {
                            currentQuestionIndex.value = savedProgress.currentQuestion;
                            currentResponses.value = savedProgress.responses;
                            quizStartTime.value = savedProgress.startTime;
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        err_4 = _a.sent();
                        console.warn('Could not load saved progress:', err_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    function nextQuestion() {
        if (currentQuestionIndex.value < totalQuestions.value - 1) {
            currentQuestionIndex.value++;
        }
    }
    function previousQuestion() {
        if (currentQuestionIndex.value > 0) {
            currentQuestionIndex.value--;
        }
    }
    function goToQuestion(index) {
        if (index >= 0 && index < totalQuestions.value) {
            currentQuestionIndex.value = index;
        }
    }
    function addResponse(response) {
        var existingIndex = currentResponses.value.findIndex(function (r) { return r.questionId === response.questionId; });
        if (existingIndex >= 0) {
            currentResponses.value[existingIndex] = response;
        }
        else {
            currentResponses.value.push(response);
        }
    }
    function updateResponse(questionId, answer) {
        var response = currentResponses.value.find(function (r) { return r.questionId === questionId; });
        if (response) {
            response.answer = answer;
        }
    }
    function getResponse(questionId) {
        return currentResponses.value.find(function (r) { return r.questionId === questionId; });
    }
    function saveProgress(progressData) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!quizService)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, quizService.saveProgress(progressData)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        console.warn('Could not save progress:', err_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function saveQuizResult(result) {
        return __awaiter(this, void 0, void 0, function () {
            var err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, quizService.saveQuizResult(result)];
                    case 2:
                        _a.sent();
                        // Add to local results
                        userResults.value.push(result);
                        // Clear progress
                        return [4 /*yield*/, quizService.clearProgress(result.userId, result.quizType)];
                    case 3:
                        // Clear progress
                        _a.sent();
                        // Reset quiz state
                        resetQuizState();
                        return [3 /*break*/, 6];
                    case 4:
                        err_6 = _a.sent();
                        error.value = err_6 instanceof Error ? err_6.message : 'Erreur lors de la sauvegarde du résultat';
                        throw err_6;
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function resetQuizState() {
        currentQuizType.value = null;
        currentQuestionIndex.value = 0;
        quizStartTime.value = null;
        quizInProgress.value = false;
        currentResponses.value = [];
    }
    function abandonQuiz() {
        if (quizService && currentQuizType.value && quizStartTime.value) {
            // Save as abandoned result
            var result = {
                userId: 'current-user',
                userName: 'Current User',
                quizType: currentQuizType.value,
                responses: currentResponses.value,
                totalQuestions: totalQuestions.value,
                startTime: quizStartTime.value,
                endTime: new Date(),
                duration: Math.round((new Date().getTime() - quizStartTime.value.getTime()) / 1000),
                status: 'Abandoned'
            };
            quizService.saveQuizResult(result).catch(function (err) {
                console.warn('Could not save abandoned quiz:', err);
            });
        }
        resetQuizState();
    }
    function loadQuizStatistics(quizType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = quizStatistics;
                        return [4 /*yield*/, quizService.getQuizStatistics(quizType)];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_7 = _b.sent();
                        error.value = err_7 instanceof Error ? err_7.message : 'Erreur lors du chargement des statistiques';
                        throw err_7;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function exportQuizResults(quizType, format) {
        if (format === void 0) { format = 'csv'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!quizService)
                            throw new Error('Quiz service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, quizService.exportResults(quizType, format)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_8 = _a.sent();
                        error.value = err_8 instanceof Error ? err_8.message : 'Erreur lors de l\'export';
                        throw err_8;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function validateCurrentResponses() {
        if (!quizService || !currentQuizType.value) {
            return { isValid: false, errors: ['Quiz non initialisé'], warnings: [] };
        }
        var questions = currentQuizType.value === 'Introduction'
            ? introductionQuestions.value
            : sondageQuestions.value;
        return quizService.validateResponses(questions, currentResponses.value);
    }
    function calculateCurrentScore() {
        if (!quizService || currentQuizType.value !== 'Introduction') {
            return { score: 0, totalPossible: 0, correctAnswers: 0, percentage: 0 };
        }
        return quizService.calculateScore(introductionQuestions.value, currentResponses.value);
    }
    function getQuestionsByCategory(category) {
        return introductionQuestions.value.filter(function (q) { return q.category === category; });
    }
    function getAverageTimePerQuestion() {
        if (currentResponses.value.length === 0)
            return 0;
        var totalTime = currentResponses.value.reduce(function (sum, response) { return sum + response.timeSpent; }, 0);
        return Math.round(totalTime / currentResponses.value.length);
    }
    function getResponsesWithCorrectness() {
        return currentResponses.value.map(function (response) {
            var question = currentQuizType.value === 'Introduction'
                ? introductionQuestions.value.find(function (q) { return q.id === response.questionId; })
                : sondageQuestions.value.find(function (q) { return q.id === response.questionId; });
            return __assign(__assign({}, response), { isCorrect: (question === null || question === void 0 ? void 0 : question.correctAnswer) ? response.answer === question.correctAnswer : undefined, question: question });
        });
    }
    // Clear all data
    function clearAllData() {
        introductionQuestions.value = [];
        sondageQuestions.value = [];
        userResults.value = [];
        quizStatistics.value = null;
        resetQuizState();
        error.value = null;
    }
    // Error handling
    function clearError() {
        error.value = null;
    }
    function setError(message) {
        error.value = message;
    }
    return {
        // State
        loading: loading,
        error: error,
        introductionQuestions: introductionQuestions,
        sondageQuestions: sondageQuestions,
        currentQuizType: currentQuizType,
        currentQuestionIndex: currentQuestionIndex,
        quizStartTime: quizStartTime,
        quizInProgress: quizInProgress,
        currentResponses: currentResponses,
        userResults: userResults,
        quizStatistics: quizStatistics,
        // Computed
        hasIntroductionQuestions: hasIntroductionQuestions,
        hasSondageQuestions: hasSondageQuestions,
        currentQuestion: currentQuestion,
        totalQuestions: totalQuestions,
        quizProgress: quizProgress,
        hasCompletedIntroduction: hasCompletedIntroduction,
        hasCompletedSondage: hasCompletedSondage,
        latestIntroductionResult: latestIntroductionResult,
        latestSondageResult: latestSondageResult,
        // Actions
        setQuizService: setQuizService,
        loadIntroductionQuestions: loadIntroductionQuestions,
        loadSondageQuestions: loadSondageQuestions,
        loadUserResults: loadUserResults,
        startQuiz: startQuiz,
        nextQuestion: nextQuestion,
        previousQuestion: previousQuestion,
        goToQuestion: goToQuestion,
        addResponse: addResponse,
        updateResponse: updateResponse,
        getResponse: getResponse,
        saveProgress: saveProgress,
        saveQuizResult: saveQuizResult,
        resetQuizState: resetQuizState,
        abandonQuiz: abandonQuiz,
        loadQuizStatistics: loadQuizStatistics,
        exportQuizResults: exportQuizResults,
        validateCurrentResponses: validateCurrentResponses,
        calculateCurrentScore: calculateCurrentScore,
        getQuestionsByCategory: getQuestionsByCategory,
        getAverageTimePerQuestion: getAverageTimePerQuestion,
        getResponsesWithCorrectness: getResponsesWithCorrectness,
        clearAllData: clearAllData,
        clearError: clearError,
        setError: setError
    };
});
//# sourceMappingURL=quiz.js.map