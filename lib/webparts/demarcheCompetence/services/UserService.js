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
var UserService = /** @class */ (function () {
    function UserService(sharePointService) {
        this.currentUser = null;
        this.sharePointService = sharePointService;
    }
    /**
     * Get current user information
     */
    UserService.prototype.getCurrentUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        if (!!this.currentUser) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.sharePointService.getCurrentUser()];
                    case 1:
                        _a.currentUser = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.currentUser];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error getting current user:', error_1);
                        throw new Error('Impossible de récupérer les informations de l\'utilisateur actuel');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load user progress data
     */
    UserService.prototype.loadUserProgress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetUserId, _a, items, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = userId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        _a = (_b.sent()).email;
                        _b.label = 2;
                    case 2:
                        targetUserId = _a;
                        return [4 /*yield*/, this.sharePointService.getUserProgress(targetUserId)];
                    case 3:
                        items = _b.sent();
                        return [2 /*return*/, items.map(function (item) { return _this.transformProgressItem(item); })];
                    case 4:
                        error_2 = _b.sent();
                        console.error('Error loading user progress:', error_2);
                        throw new Error('Impossible de charger les progrès de l\'utilisateur');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save or update user progress
     */
    UserService.prototype.saveUserProgress = function (progress) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, existingProgress, existing, newProgress, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.sharePointService.getUserProgress(currentUser.email)];
                    case 2:
                        existingProgress = _a.sent();
                        existing = existingProgress.find(function (p) { return p.CompetenceArea === progress.competenceArea; });
                        if (!existing) return [3 /*break*/, 4];
                        // Update existing progress
                        return [4 /*yield*/, this.sharePointService.updateUserProgress(existing.Id, {
                                CurrentLevel: progress.currentLevel,
                                TargetLevel: progress.targetLevel,
                                LastAssessment: progress.lastAssessment.toISOString(),
                                NextAssessment: progress.nextAssessment.toISOString(),
                                Progress: progress.progress
                            })];
                    case 3:
                        // Update existing progress
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        newProgress = {
                            CompetenceArea: progress.competenceArea,
                            CurrentLevel: progress.currentLevel,
                            TargetLevel: progress.targetLevel,
                            LastAssessment: progress.lastAssessment.toISOString(),
                            NextAssessment: progress.nextAssessment.toISOString(),
                            Progress: progress.progress
                        };
                        return [4 /*yield*/, this.sharePointService.saveUserProgress(newProgress)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.error('Error saving user progress:', error_3);
                        throw new Error('Impossible de sauvegarder les progrès de l\'utilisateur');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update competence level
     */
    UserService.prototype.updateCompetenceLevel = function (competenceArea, newLevel, assessmentDate) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress, existing, updateData, newProgress, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.sharePointService.getUserProgress(currentUser.email)];
                    case 2:
                        userProgress = _a.sent();
                        existing = userProgress.find(function (p) { return p.CompetenceArea === competenceArea; });
                        updateData = {
                            CurrentLevel: newLevel,
                            LastAssessment: (assessmentDate || new Date()).toISOString(),
                            Progress: this.calculateProgress(newLevel, (existing === null || existing === void 0 ? void 0 : existing.TargetLevel) || 5)
                        };
                        if (!existing) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sharePointService.updateUserProgress(existing.Id, updateData)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        newProgress = __assign(__assign({ CompetenceArea: competenceArea }, updateData), { TargetLevel: 5, NextAssessment: this.calculateNextAssessment(assessmentDate || new Date()).toISOString() });
                        return [4 /*yield*/, this.sharePointService.saveUserProgress(newProgress)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        console.error('Error updating competence level:', error_4);
                        throw new Error('Impossible de mettre à jour le niveau de compétence');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set competence targets
     */
    UserService.prototype.setCompetenceTargets = function (targets) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress, updates, newEntries, _loop_1, this_1, _i, _a, _b, competenceArea, targetLevel, _c, newEntries_1, entry, error_5;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _d.sent();
                        return [4 /*yield*/, this.sharePointService.getUserProgress(currentUser.email)];
                    case 2:
                        userProgress = _d.sent();
                        updates = [];
                        newEntries = [];
                        _loop_1 = function (competenceArea, targetLevel) {
                            var existing = userProgress.find(function (p) { return p.CompetenceArea === competenceArea; });
                            if (existing) {
                                updates.push({
                                    id: existing.Id,
                                    data: {
                                        TargetLevel: targetLevel,
                                        Progress: this_1.calculateProgress(existing.CurrentLevel, targetLevel)
                                    }
                                });
                            }
                            else {
                                newEntries.push({
                                    CompetenceArea: competenceArea,
                                    CurrentLevel: 0,
                                    TargetLevel: targetLevel,
                                    LastAssessment: new Date().toISOString(),
                                    NextAssessment: this_1.calculateNextAssessment(new Date()).toISOString(),
                                    Progress: 0
                                });
                            }
                        };
                        this_1 = this;
                        for (_i = 0, _a = Object.entries(targets); _i < _a.length; _i++) {
                            _b = _a[_i], competenceArea = _b[0], targetLevel = _b[1];
                            _loop_1(competenceArea, targetLevel);
                        }
                        if (!(updates.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sharePointService.bulkUpdateItems('User_Progress', updates)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _c = 0, newEntries_1 = newEntries;
                        _d.label = 5;
                    case 5:
                        if (!(_c < newEntries_1.length)) return [3 /*break*/, 8];
                        entry = newEntries_1[_c];
                        return [4 /*yield*/, this.sharePointService.saveUserProgress(entry)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7:
                        _c++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_5 = _d.sent();
                        console.error('Error setting competence targets:', error_5);
                        throw new Error('Impossible de définir les objectifs de compétence');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get competence areas with user progress
     */
    UserService.prototype.getCompetenceAreasWithProgress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress_1, competenceAreas, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.loadUserProgress(currentUser.email)];
                    case 2:
                        userProgress_1 = _a.sent();
                        competenceAreas = this.getDefaultCompetenceAreas();
                        return [2 /*return*/, competenceAreas.map(function (area) {
                                var progress = userProgress_1.find(function (p) { return p.competenceArea === area.name; });
                                return __assign(__assign({}, area), { userProgress: progress });
                            })];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error getting competence areas with progress:', error_6);
                        throw new Error('Impossible de charger les domaines de compétence');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculate overall user progress
     */
    UserService.prototype.calculateOverallProgress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress, competenceBreakdown, totalProgress, nextAssessmentDue, _i, userProgress_2, progress, percentage, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.loadUserProgress(currentUser.email)];
                    case 2:
                        userProgress = _a.sent();
                        competenceBreakdown = {};
                        totalProgress = 0;
                        nextAssessmentDue = null;
                        for (_i = 0, userProgress_2 = userProgress; _i < userProgress_2.length; _i++) {
                            progress = userProgress_2[_i];
                            percentage = this.calculateProgress(progress.currentLevel, progress.targetLevel);
                            competenceBreakdown[progress.competenceArea] = percentage;
                            totalProgress += percentage;
                            // Find earliest next assessment date
                            if (!nextAssessmentDue || progress.nextAssessment < nextAssessmentDue) {
                                nextAssessmentDue = progress.nextAssessment;
                            }
                        }
                        return [2 /*return*/, {
                                overallPercentage: userProgress.length > 0 ? Math.round(totalProgress / userProgress.length) : 0,
                                competenceBreakdown: competenceBreakdown,
                                totalAssessments: userProgress.length,
                                nextAssessmentDue: nextAssessmentDue
                            }];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error calculating overall progress:', error_7);
                        throw new Error('Impossible de calculer les progrès globaux');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get user statistics
     */
    UserService.prototype.getUserStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, quizResults, userProgress, completedQuizzes, averageScore, totalTime, competencesInProgress, competencesCompleted, lastActivity, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.sharePointService.getQuizResults(currentUser.email)];
                    case 2:
                        quizResults = _a.sent();
                        return [4 /*yield*/, this.loadUserProgress(currentUser.email)];
                    case 3:
                        userProgress = _a.sent();
                        completedQuizzes = quizResults.filter(function (r) { return r.Status === 'Completed'; });
                        averageScore = completedQuizzes.length > 0 ?
                            completedQuizzes.reduce(function (sum, r) { return sum + (r.Score || 0); }, 0) / completedQuizzes.length : 0;
                        totalTime = quizResults.reduce(function (sum, r) { return sum + (r.Duration || 0); }, 0);
                        competencesInProgress = userProgress.filter(function (p) { return p.progress > 0 && p.progress < 100; }).length;
                        competencesCompleted = userProgress.filter(function (p) { return p.progress >= 100; }).length;
                        lastActivity = quizResults.length > 0 ?
                            new Date(Math.max.apply(Math, quizResults.map(function (r) { return new Date(r.CompletionDate || r.Created).getTime(); }))) : null;
                        return [2 /*return*/, {
                                totalQuizzesTaken: completedQuizzes.length,
                                averageQuizScore: Math.round(averageScore),
                                timeSpentLearning: totalTime,
                                competencesInProgress: competencesInProgress,
                                competencesCompleted: competencesCompleted,
                                lastActivityDate: lastActivity
                            }];
                    case 4:
                        error_8 = _a.sent();
                        console.error('Error getting user statistics:', error_8);
                        throw new Error('Impossible de charger les statistiques de l\'utilisateur');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Schedule next assessment
     */
    UserService.prototype.scheduleNextAssessment = function (competenceArea, assessmentDate) {
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress, existing, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.sharePointService.getUserProgress(currentUser.email)];
                    case 2:
                        userProgress = _a.sent();
                        existing = userProgress.find(function (p) { return p.CompetenceArea === competenceArea; });
                        if (!existing) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sharePointService.updateUserProgress(existing.Id, {
                                NextAssessment: assessmentDate.toISOString()
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("Aucun progr\u00E8s trouv\u00E9 pour le domaine de comp\u00E9tence: ".concat(competenceArea));
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_9 = _a.sent();
                        console.error('Error scheduling next assessment:', error_9);
                        throw new Error('Impossible de programmer la prochaine évaluation');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get upcoming assessments
     */
    UserService.prototype.getUpcomingAssessments = function (daysAhead) {
        if (daysAhead === void 0) { daysAhead = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, userProgress, cutoffDate_1, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _a.sent();
                        return [4 /*yield*/, this.loadUserProgress(currentUser.email)];
                    case 2:
                        userProgress = _a.sent();
                        cutoffDate_1 = new Date();
                        cutoffDate_1.setDate(cutoffDate_1.getDate() + daysAhead);
                        return [2 /*return*/, userProgress
                                .filter(function (p) { return p.nextAssessment <= cutoffDate_1; })
                                .map(function (p) { return ({
                                competenceArea: p.competenceArea,
                                assessmentDate: p.nextAssessment,
                                currentLevel: p.currentLevel,
                                targetLevel: p.targetLevel,
                                daysUntilDue: Math.ceil((p.nextAssessment.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                            }); })
                                .sort(function (a, b) { return a.assessmentDate.getTime() - b.assessmentDate.getTime(); })];
                    case 3:
                        error_10 = _a.sent();
                        console.error('Error getting upcoming assessments:', error_10);
                        throw new Error('Impossible de charger les évaluations à venir');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Export user data
     */
    UserService.prototype.exportUserData = function (format) {
        if (format === void 0) { format = 'json'; }
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, _a, userProgress, quizResults, statistics, exportData, blob, url, a, headers, rows, csvContent, blob, url, a, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCurrentUser()];
                    case 1:
                        currentUser = _b.sent();
                        return [4 /*yield*/, Promise.all([
                                this.loadUserProgress(currentUser.email),
                                this.sharePointService.getQuizResults(currentUser.email),
                                this.getUserStatistics()
                            ])];
                    case 2:
                        _a = _b.sent(), userProgress = _a[0], quizResults = _a[1], statistics = _a[2];
                        exportData = {
                            user: currentUser,
                            exportDate: new Date().toISOString(),
                            progress: userProgress,
                            quizResults: quizResults,
                            statistics: statistics
                        };
                        if (format === 'json') {
                            blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                            url = URL.createObjectURL(blob);
                            a = document.createElement('a');
                            a.href = url;
                            a.download = "user-data-".concat(currentUser.email, "-").concat(new Date().toISOString().split('T')[0], ".json");
                            a.click();
                            URL.revokeObjectURL(url);
                        }
                        else {
                            headers = ['Domaine de Compétence', 'Niveau Actuel', 'Niveau Cible', 'Progrès (%)', 'Dernière Évaluation', 'Prochaine Évaluation'];
                            rows = userProgress.map(function (p) { return [
                                p.competenceArea,
                                p.currentLevel,
                                p.targetLevel,
                                p.progress,
                                p.lastAssessment.toLocaleDateString('fr-FR'),
                                p.nextAssessment.toLocaleDateString('fr-FR')
                            ]; });
                            csvContent = __spreadArray([headers], rows, true).map(function (row) { return row.map(function (cell) { return "\"".concat(cell, "\""); }).join(','); })
                                .join('\n');
                            blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            url = URL.createObjectURL(blob);
                            a = document.createElement('a');
                            a.href = url;
                            a.download = "user-progress-".concat(currentUser.email, "-").concat(new Date().toISOString().split('T')[0], ".csv");
                            a.click();
                            URL.revokeObjectURL(url);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_11 = _b.sent();
                        console.error('Error exporting user data:', error_11);
                        throw new Error('Impossible d\'exporter les données de l\'utilisateur');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Private helper methods
     */
    UserService.prototype.transformProgressItem = function (item) {
        return {
            id: item.Id.toString(),
            userId: item.User.Email,
            userName: item.User.Title,
            competenceArea: item.CompetenceArea,
            currentLevel: item.CurrentLevel,
            targetLevel: item.TargetLevel,
            lastAssessment: new Date(item.LastAssessment),
            nextAssessment: new Date(item.NextAssessment),
            progress: item.Progress
        };
    };
    UserService.prototype.calculateProgress = function (currentLevel, targetLevel) {
        if (targetLevel === 0)
            return 0;
        return Math.min(Math.round((currentLevel / targetLevel) * 100), 100);
    };
    UserService.prototype.calculateNextAssessment = function (lastAssessment) {
        var nextAssessment = new Date(lastAssessment);
        nextAssessment.setMonth(nextAssessment.getMonth() + 6); // 6 months from last assessment
        return nextAssessment;
    };
    UserService.prototype.getDefaultCompetenceAreas = function () {
        return [
            {
                id: 'leadership',
                name: 'Leadership',
                description: 'Capacité à diriger et inspirer les équipes',
                levels: this.getDefaultLevels()
            },
            {
                id: 'communication',
                name: 'Communication',
                description: 'Aptitudes à communiquer efficacement',
                levels: this.getDefaultLevels()
            },
            {
                id: 'technique',
                name: 'Technique',
                description: 'Compétences techniques spécialisées',
                levels: this.getDefaultLevels()
            },
            {
                id: 'management',
                name: 'Management',
                description: 'Gestion d\'équipes et de projets',
                levels: this.getDefaultLevels()
            },
            {
                id: 'innovation',
                name: 'Innovation',
                description: 'Créativité et innovation',
                levels: this.getDefaultLevels()
            },
            {
                id: 'qualite',
                name: 'Qualité',
                description: 'Assurance qualité et amélioration continue',
                levels: this.getDefaultLevels()
            }
        ];
    };
    UserService.prototype.getDefaultLevels = function () {
        return [
            {
                level: 1,
                title: 'Débutant',
                description: 'Connaissances de base',
                requirements: ['Compréhension théorique', 'Supervision nécessaire']
            },
            {
                level: 2,
                title: 'Intermédiaire',
                description: 'Compétences pratiques développées',
                requirements: ['Application pratique', 'Supervision occasionnelle']
            },
            {
                level: 3,
                title: 'Confirmé',
                description: 'Maîtrise opérationnelle',
                requirements: ['Autonomie complète', 'Résolution de problèmes']
            },
            {
                level: 4,
                title: 'Expert',
                description: 'Expertise reconnue',
                requirements: ['Innovation', 'Formation d\'autres', 'Amélioration continue']
            },
            {
                level: 5,
                title: 'Maître',
                description: 'Leadership et vision stratégique',
                requirements: ['Vision stratégique', 'Transformation organisationnelle', 'Mentoring']
            }
        ];
    };
    return UserService;
}());
export { UserService };
//# sourceMappingURL=UserService.js.map