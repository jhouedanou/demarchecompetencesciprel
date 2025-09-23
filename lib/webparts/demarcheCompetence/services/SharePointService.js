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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
import '@pnp/sp/site-users/web';
import '@pnp/sp/profiles';
var SharePointService = /** @class */ (function () {
    function SharePointService(context) {
        /**
         * Cache Management
         */
        this.cache = new Map();
        this.context = context;
        this.sp = spfi().using(SPFx(context));
    }
    /**
     * Get current user information
     */
    SharePointService.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.currentUser()];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, {
                                id: user.Id,
                                title: user.Title,
                                email: user.Email,
                                loginName: user.LoginName
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting current user:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Quiz Introduction Methods
     */
    SharePointService.prototype.getQuizIntroductionQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Introduction')
                                .items
                                .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')
                                .orderBy('Order', true)()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return (__assign(__assign({}, item), { Options: _this.parseJSON(item.Options, []) })); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error loading quiz introduction questions:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.addQuizIntroductionQuestion = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var questionData, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        questionData = {
                            Title: question.Title,
                            Question: question.Question,
                            Options: JSON.stringify(question.Options),
                            CorrectAnswer: question.CorrectAnswer,
                            Category: question.Category,
                            Points: question.Points,
                            Order: question.Order
                        };
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Introduction')
                                .items
                                .add(questionData)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.getQuizIntroductionQuestionById(result.data.Id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error adding quiz introduction question:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.updateQuizIntroductionQuestion = function (id, question) {
        return __awaiter(this, void 0, void 0, function () {
            var questionData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        questionData = __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (question.Title && { Title: question.Title })), (question.Question && { Question: question.Question })), (question.Options && { Options: JSON.stringify(question.Options) })), (question.CorrectAnswer && { CorrectAnswer: question.CorrectAnswer })), (question.Category && { Category: question.Category })), (question.Points && { Points: question.Points })), (question.Order && { Order: question.Order }));
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Introduction')
                                .items
                                .getById(id)
                                .update(questionData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error updating quiz introduction question:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.deleteQuizIntroductionQuestion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Introduction')
                                .items
                                .getById(id)
                                .delete()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error deleting quiz introduction question:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.getQuizIntroductionQuestionById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Introduction')
                                .items
                                .getById(id)
                                .select('Id', 'Title', 'Question', 'Options', 'CorrectAnswer', 'Category', 'Points', 'Order', 'Created', 'Modified')()];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, item), { Options: this.parseJSON(item.Options, []) })];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error getting quiz introduction question by id:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Quiz Sondage Methods
     */
    SharePointService.prototype.getQuizSondageQuestions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Sondage')
                                .items
                                .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')
                                .orderBy('Order', true)()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return (__assign(__assign({}, item), { Options: _this.parseJSON(item.Options, []) })); })];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error loading quiz sondage questions:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.addQuizSondageQuestion = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var questionData, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        questionData = {
                            Title: question.Title,
                            Question: question.Question,
                            QuestionType: question.QuestionType,
                            Options: JSON.stringify(question.Options),
                            Required: question.Required,
                            Order: question.Order
                        };
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Sondage')
                                .items
                                .add(questionData)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.getQuizSondageQuestionById(result.data.Id)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error adding quiz sondage question:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.updateQuizSondageQuestion = function (id, question) {
        return __awaiter(this, void 0, void 0, function () {
            var questionData, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        questionData = __assign(__assign(__assign(__assign(__assign(__assign({}, (question.Title && { Title: question.Title })), (question.Question && { Question: question.Question })), (question.QuestionType && { QuestionType: question.QuestionType })), (question.Options && { Options: JSON.stringify(question.Options) })), (question.Required !== undefined && { Required: question.Required })), (question.Order && { Order: question.Order }));
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Sondage')
                                .items
                                .getById(id)
                                .update(questionData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error updating quiz sondage question:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.deleteQuizSondageQuestion = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Sondage')
                                .items
                                .getById(id)
                                .delete()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error deleting quiz sondage question:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.getQuizSondageQuestionById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Sondage')
                                .items
                                .getById(id)
                                .select('Id', 'Title', 'Question', 'QuestionType', 'Options', 'Required', 'Order', 'Created', 'Modified')()];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, item), { Options: this.parseJSON(item.Options, []) })];
                    case 2:
                        error_11 = _a.sent();
                        console.error('Error getting quiz sondage question by id:', error_11);
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Quiz Results Methods
     */
    SharePointService.prototype.getQuizResults = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, items, error_12;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = this.sp.web.lists
                            .getByTitle('Quiz_Results')
                            .items
                            .select('Id', 'Title', 'User/Title', 'User/Email', 'QuizType', 'Responses', 'Score', 'CompletionDate', 'Duration', 'Status', 'Created', 'Modified')
                            .expand('User')
                            .orderBy('CompletionDate', false);
                        if (userId) {
                            query = query.filter("User/Email eq '".concat(userId, "'"));
                        }
                        return [4 /*yield*/, query()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return (__assign(__assign({}, item), { Responses: _this.parseJSON(item.Responses, []), CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : '' })); })];
                    case 2:
                        error_12 = _a.sent();
                        console.error('Error loading quiz results:', error_12);
                        throw error_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.saveQuizResult = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, resultData, response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        resultData = {
                            Title: result.Title || "".concat(result.QuizType, " - ").concat(currentUser.title, " - ").concat(new Date().toLocaleDateString('fr-FR')),
                            UserId: currentUser.id,
                            QuizType: result.QuizType,
                            Responses: JSON.stringify(result.Responses),
                            Score: result.Score || 0,
                            CompletionDate: result.CompletionDate || new Date().toISOString(),
                            Duration: result.Duration,
                            Status: result.Status
                        };
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Results')
                                .items
                                .add(resultData)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.getQuizResultById(response.data.Id)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_13 = _a.sent();
                        console.error('Error saving quiz result:', error_13);
                        throw error_13;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.updateQuizResult = function (id, result) {
        return __awaiter(this, void 0, void 0, function () {
            var resultData, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        resultData = __assign(__assign(__assign(__assign(__assign(__assign({}, (result.QuizType && { QuizType: result.QuizType })), (result.Responses && { Responses: JSON.stringify(result.Responses) })), (result.Score !== undefined && { Score: result.Score })), (result.CompletionDate && { CompletionDate: result.CompletionDate })), (result.Duration !== undefined && { Duration: result.Duration })), (result.Status && { Status: result.Status }));
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Results')
                                .items
                                .getById(id)
                                .update(resultData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.error('Error updating quiz result:', error_14);
                        throw error_14;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.deleteQuizResult = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Results')
                                .items
                                .getById(id)
                                .delete()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _a.sent();
                        console.error('Error deleting quiz result:', error_15);
                        throw error_15;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.getQuizResultById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('Quiz_Results')
                                .items
                                .getById(id)
                                .select('Id', 'Title', 'User/Title', 'User/Email', 'QuizType', 'Responses', 'Score', 'CompletionDate', 'Duration', 'Status', 'Created', 'Modified')
                                .expand('User')()];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, item), { Responses: this.parseJSON(item.Responses, []), CompletionDate: item.CompletionDate ? new Date(item.CompletionDate).toISOString() : '' })];
                    case 2:
                        error_16 = _a.sent();
                        console.error('Error getting quiz result by id:', error_16);
                        throw error_16;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * User Progress Methods
     */
    SharePointService.prototype.getUserProgress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, items, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = this.sp.web.lists
                            .getByTitle('User_Progress')
                            .items
                            .select('Id', 'Title', 'User/Title', 'User/Email', 'CompetenceArea', 'CurrentLevel', 'TargetLevel', 'LastAssessment', 'NextAssessment', 'Progress', 'Created', 'Modified')
                            .expand('User')
                            .orderBy('CompetenceArea', true);
                        if (userId) {
                            query = query.filter("User/Email eq '".concat(userId, "'"));
                        }
                        return [4 /*yield*/, query()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, items.map(function (item) { return (__assign(__assign({}, item), { LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '', NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : '' })); })];
                    case 2:
                        error_17 = _a.sent();
                        console.error('Error loading user progress:', error_17);
                        throw error_17;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.saveUserProgress = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, progressData, response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        progressData = {
                            Title: progress.Title || "".concat(progress.CompetenceArea, " - ").concat(currentUser.title),
                            UserId: currentUser.id,
                            CompetenceArea: progress.CompetenceArea,
                            CurrentLevel: progress.CurrentLevel,
                            TargetLevel: progress.TargetLevel,
                            LastAssessment: progress.LastAssessment,
                            NextAssessment: progress.NextAssessment,
                            Progress: progress.Progress
                        };
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('User_Progress')
                                .items
                                .add(progressData)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.getUserProgressById(response.data.Id)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_18 = _a.sent();
                        console.error('Error saving user progress:', error_18);
                        throw error_18;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.updateUserProgress = function (id, progress) {
        return __awaiter(this, void 0, void 0, function () {
            var progressData, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        progressData = __assign(__assign(__assign(__assign(__assign(__assign({}, (progress.CompetenceArea && { CompetenceArea: progress.CompetenceArea })), (progress.CurrentLevel !== undefined && { CurrentLevel: progress.CurrentLevel })), (progress.TargetLevel !== undefined && { TargetLevel: progress.TargetLevel })), (progress.LastAssessment && { LastAssessment: progress.LastAssessment })), (progress.NextAssessment && { NextAssessment: progress.NextAssessment })), (progress.Progress !== undefined && { Progress: progress.Progress }));
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('User_Progress')
                                .items
                                .getById(id)
                                .update(progressData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_19 = _a.sent();
                        console.error('Error updating user progress:', error_19);
                        throw error_19;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.deleteUserProgress = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('User_Progress')
                                .items
                                .getById(id)
                                .delete()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_20 = _a.sent();
                        console.error('Error deleting user progress:', error_20);
                        throw error_20;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.getUserProgressById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var item, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists
                                .getByTitle('User_Progress')
                                .items
                                .getById(id)
                                .select('Id', 'Title', 'User/Title', 'User/Email', 'CompetenceArea', 'CurrentLevel', 'TargetLevel', 'LastAssessment', 'NextAssessment', 'Progress', 'Created', 'Modified')
                                .expand('User')()];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, item), { LastAssessment: item.LastAssessment ? new Date(item.LastAssessment).toISOString() : '', NextAssessment: item.NextAssessment ? new Date(item.NextAssessment).toISOString() : '' })];
                    case 2:
                        error_21 = _a.sent();
                        console.error('Error getting user progress by id:', error_21);
                        throw error_21;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Utility Methods
     */
    SharePointService.prototype.checkListExists = function (listTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.sp.web.lists.getByTitle(listTitle)()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_22 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.getListItems = function (listTitle, select, filter, orderBy, top) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = this.sp.web.lists.getByTitle(listTitle).items;
                        if (select) {
                            query = query.select.apply(query, select);
                        }
                        if (filter) {
                            query = query.filter(filter);
                        }
                        if (orderBy) {
                            query = query.orderBy(orderBy, true);
                        }
                        if (top) {
                            query = query.top(top);
                        }
                        return [4 /*yield*/, query()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_23 = _a.sent();
                        console.error("Error getting items from list ".concat(listTitle, ":"), error_23);
                        throw error_23;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.bulkUpdateItems = function (listTitle, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var batch_1, list_1, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        batch_1 = this.sp.web.createBatch();
                        list_1 = this.sp.web.lists.getByTitle(listTitle);
                        updates.forEach(function (update) {
                            list_1.items.getById(update.id).inBatch(batch_1).update(update.data);
                        });
                        return [4 /*yield*/, batch_1.execute()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_24 = _a.sent();
                        console.error("Error bulk updating items in list ".concat(listTitle, ":"), error_24);
                        throw error_24;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SharePointService.prototype.exportToExcel = function (listTitle, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var items, data, headers_1, csvContent, blob, link, url, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getListItems(listTitle)];
                    case 1:
                        items = _a.sent();
                        data = items.map(function (item) {
                            // Remove complex objects and keep only simple properties
                            var simpleItem = {};
                            for (var key in item) {
                                if (typeof item[key] !== 'object' || item[key] === null) {
                                    simpleItem[key] = item[key];
                                }
                            }
                            return simpleItem;
                        });
                        // Convert to CSV
                        if (data.length === 0)
                            return [2 /*return*/];
                        headers_1 = Object.keys(data[0]);
                        csvContent = __spreadArray([
                            headers_1.join(',')
                        ], data.map(function (row) { return headers_1.map(function (header) {
                            return JSON.stringify(row[header] || '');
                        }).join(','); }), true).join('\n');
                        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        link = document.createElement('a');
                        url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', fileName || "".concat(listTitle, "-export.csv"));
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        return [3 /*break*/, 3];
                    case 2:
                        error_25 = _a.sent();
                        console.error('Error exporting to Excel:', error_25);
                        throw error_25;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper Methods
     */
    SharePointService.prototype.parseJSON = function (jsonString, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        try {
            return jsonString ? JSON.parse(jsonString) : defaultValue;
        }
        catch (error) {
            console.warn('Error parsing JSON:', error);
            return defaultValue;
        }
    };
    SharePointService.prototype.formatDate = function (date) {
        var d = new Date(date);
        return d.toISOString();
    };
    SharePointService.prototype.getCachedData = function (key, fetcher, ttl // 5 minutes default
    ) {
        if (ttl === void 0) { ttl = 300000; }
        return __awaiter(this, void 0, void 0, function () {
            var cached, now, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cached = this.cache.get(key);
                        now = Date.now();
                        if (cached && (now - cached.timestamp) < cached.ttl) {
                            return [2 /*return*/, cached.data];
                        }
                        return [4 /*yield*/, fetcher()];
                    case 1:
                        data = _a.sent();
                        this.cache.set(key, { data: data, timestamp: now, ttl: ttl });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SharePointService.prototype.clearCache = function () {
        this.cache.clear();
    };
    SharePointService.prototype.removeCacheEntry = function (key) {
        this.cache.delete(key);
    };
    /**
     * Error Handling and Retry Logic
     */
    SharePointService.prototype.retryOperation = function (operation, maxRetries, delay) {
        if (maxRetries === void 0) { maxRetries = 3; }
        if (delay === void 0) { delay = 1000; }
        return __awaiter(this, void 0, void 0, function () {
            var lastError, _loop_1, i, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_1 = function (i) {
                            var _b, error_26;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 4]);
                                        _b = {};
                                        return [4 /*yield*/, operation()];
                                    case 1: return [2 /*return*/, (_b.value = _c.sent(), _b)];
                                    case 2:
                                        error_26 = _c.sent();
                                        lastError = error_26;
                                        if (i === maxRetries) {
                                            throw lastError;
                                        }
                                        // Wait before retrying
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay * Math.pow(2, i)); })];
                                    case 3:
                                        // Wait before retrying
                                        _c.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i <= maxRetries)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: throw lastError;
                }
            });
        });
    };
    return SharePointService;
}());
export { SharePointService };
//# sourceMappingURL=SharePointService.js.map