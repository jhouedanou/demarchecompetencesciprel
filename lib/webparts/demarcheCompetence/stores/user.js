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
export var useUserStore = defineStore('user', function () {
    // State
    var loading = ref(false);
    var error = ref(null);
    // User Information
    var currentUser = ref(null);
    var isAuthenticated = ref(false);
    // User Progress
    var userProgress = ref([]);
    var competenceAreas = ref([]);
    // User Statistics
    var userStatistics = ref(null);
    // Overall Progress
    var overallProgress = ref(null);
    // Upcoming Assessments
    var upcomingAssessments = ref([]);
    // User service instance (will be injected)
    var userService = null;
    // Computed
    var isUserLoaded = computed(function () { return currentUser.value !== null; });
    var userName = computed(function () { var _a; return ((_a = currentUser.value) === null || _a === void 0 ? void 0 : _a.title) || 'Utilisateur'; });
    var userEmail = computed(function () { var _a; return ((_a = currentUser.value) === null || _a === void 0 ? void 0 : _a.email) || ''; });
    var hasProgress = computed(function () { return userProgress.value.length > 0; });
    var completedCompetences = computed(function () {
        return userProgress.value.filter(function (p) { return p.progress >= 100; }).length;
    });
    var inProgressCompetences = computed(function () {
        return userProgress.value.filter(function (p) { return p.progress > 0 && p.progress < 100; }).length;
    });
    var notStartedCompetences = computed(function () {
        return userProgress.value.filter(function (p) { return p.progress === 0; }).length;
    });
    var averageCompetenceLevel = computed(function () {
        if (userProgress.value.length === 0)
            return 0;
        var totalLevel = userProgress.value.reduce(function (sum, progress) { return sum + progress.currentLevel; }, 0);
        return Math.round((totalLevel / userProgress.value.length) * 10) / 10;
    });
    var nextAssessmentDue = computed(function () {
        if (upcomingAssessments.value.length === 0)
            return null;
        return upcomingAssessments.value
            .sort(function (a, b) { return a.assessmentDate.getTime() - b.assessmentDate.getTime(); })[0];
    });
    var overallCompletionPercentage = computed(function () { var _a; return ((_a = overallProgress.value) === null || _a === void 0 ? void 0 : _a.overallPercentage) || 0; });
    var isProfileComplete = computed(function () {
        return currentUser.value && userProgress.value.length > 0;
    });
    // Actions
    function setUserService(service) {
        userService = service;
    }
    function loadCurrentUser() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = currentUser;
                        return [4 /*yield*/, userService.getCurrentUser()];
                    case 2:
                        _a.value = _b.sent();
                        isAuthenticated.value = true;
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        error.value = err_1 instanceof Error ? err_1.message : 'Erreur lors du chargement de l\'utilisateur';
                        isAuthenticated.value = false;
                        throw err_1;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadUserProgress(userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = userProgress;
                        return [4 /*yield*/, userService.loadUserProgress(userId)];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_2 = _b.sent();
                        error.value = err_2 instanceof Error ? err_2.message : 'Erreur lors du chargement des progrès';
                        throw err_2;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadCompetenceAreas() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = competenceAreas;
                        return [4 /*yield*/, userService.getCompetenceAreasWithProgress()];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_3 = _b.sent();
                        error.value = err_3 instanceof Error ? err_3.message : 'Erreur lors du chargement des domaines de compétence';
                        throw err_3;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadUserStatistics() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = userStatistics;
                        return [4 /*yield*/, userService.getUserStatistics()];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_4 = _b.sent();
                        error.value = err_4 instanceof Error ? err_4.message : 'Erreur lors du chargement des statistiques';
                        throw err_4;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadOverallProgress() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = overallProgress;
                        return [4 /*yield*/, userService.calculateOverallProgress()];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_5 = _b.sent();
                        error.value = err_5 instanceof Error ? err_5.message : 'Erreur lors du calcul des progrès globaux';
                        throw err_5;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function loadUpcomingAssessments(daysAhead) {
        if (daysAhead === void 0) { daysAhead = 30; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = upcomingAssessments;
                        return [4 /*yield*/, userService.getUpcomingAssessments(daysAhead)];
                    case 2:
                        _a.value = _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_6 = _b.sent();
                        error.value = err_6 instanceof Error ? err_6.message : 'Erreur lors du chargement des évaluations à venir';
                        throw err_6;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function saveUserProgress(progress) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, userService.saveUserProgress(progress)];
                    case 2:
                        _a.sent();
                        existingIndex = userProgress.value.findIndex(function (p) { return p.competenceArea === progress.competenceArea; });
                        if (existingIndex >= 0) {
                            userProgress.value[existingIndex] = progress;
                        }
                        else {
                            userProgress.value.push(progress);
                        }
                        // Refresh related data
                        return [4 /*yield*/, Promise.all([
                                loadOverallProgress(),
                                loadUpcomingAssessments()
                            ])];
                    case 3:
                        // Refresh related data
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        err_7 = _a.sent();
                        error.value = err_7 instanceof Error ? err_7.message : 'Erreur lors de la sauvegarde des progrès';
                        throw err_7;
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function updateCompetenceLevel(competenceArea, newLevel, assessmentDate) {
        return __awaiter(this, void 0, void 0, function () {
            var err_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, userService.updateCompetenceLevel(competenceArea, newLevel, assessmentDate)];
                    case 2:
                        _a.sent();
                        // Reload user progress to reflect changes
                        return [4 /*yield*/, loadUserProgress()];
                    case 3:
                        // Reload user progress to reflect changes
                        _a.sent();
                        return [4 /*yield*/, loadOverallProgress()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        err_8 = _a.sent();
                        error.value = err_8 instanceof Error ? err_8.message : 'Erreur lors de la mise à jour du niveau de compétence';
                        throw err_8;
                    case 6:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function setCompetenceTargets(targets) {
        return __awaiter(this, void 0, void 0, function () {
            var err_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, 6, 7]);
                        return [4 /*yield*/, userService.setCompetenceTargets(targets)];
                    case 2:
                        _a.sent();
                        // Reload user progress to reflect changes
                        return [4 /*yield*/, loadUserProgress()];
                    case 3:
                        // Reload user progress to reflect changes
                        _a.sent();
                        return [4 /*yield*/, loadOverallProgress()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5:
                        err_9 = _a.sent();
                        error.value = err_9 instanceof Error ? err_9.message : 'Erreur lors de la définition des objectifs';
                        throw err_9;
                    case 6:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function scheduleAssessment(competenceArea, assessmentDate) {
        return __awaiter(this, void 0, void 0, function () {
            var progress, err_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, userService.scheduleNextAssessment(competenceArea, assessmentDate)];
                    case 2:
                        _a.sent();
                        progress = userProgress.value.find(function (p) { return p.competenceArea === competenceArea; });
                        if (progress) {
                            progress.nextAssessment = assessmentDate;
                        }
                        // Refresh upcoming assessments
                        return [4 /*yield*/, loadUpcomingAssessments()];
                    case 3:
                        // Refresh upcoming assessments
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        err_10 = _a.sent();
                        error.value = err_10 instanceof Error ? err_10.message : 'Erreur lors de la programmation de l\'évaluation';
                        throw err_10;
                    case 5:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function exportUserData(format) {
        if (format === void 0) { format = 'json'; }
        return __awaiter(this, void 0, void 0, function () {
            var err_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userService)
                            throw new Error('User service not initialized');
                        loading.value = true;
                        error.value = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, userService.exportUserData(format)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        err_11 = _a.sent();
                        error.value = err_11 instanceof Error ? err_11.message : 'Erreur lors de l\'export des données';
                        throw err_11;
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function initializeUser() {
        return __awaiter(this, void 0, void 0, function () {
            var err_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, loadCurrentUser()];
                    case 1:
                        _a.sent();
                        if (!isAuthenticated.value) return [3 /*break*/, 3];
                        // Load all user-related data in parallel
                        return [4 /*yield*/, Promise.all([
                                loadUserProgress(),
                                loadCompetenceAreas(),
                                loadUserStatistics(),
                                loadOverallProgress(),
                                loadUpcomingAssessments()
                            ])];
                    case 2:
                        // Load all user-related data in parallel
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        err_12 = _a.sent();
                        console.error('Error initializing user:', err_12);
                        throw err_12;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function refreshUserData() {
        return __awaiter(this, void 0, void 0, function () {
            var err_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isAuthenticated.value)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all([
                                loadUserProgress(),
                                loadUserStatistics(),
                                loadOverallProgress(),
                                loadUpcomingAssessments()
                            ])];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_13 = _a.sent();
                        console.error('Error refreshing user data:', err_13);
                        throw err_13;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function getProgressForCompetence(competenceArea) {
        return userProgress.value.find(function (p) { return p.competenceArea === competenceArea; });
    }
    function getCompetenceAreaById(id) {
        return competenceAreas.value.find(function (area) { return area.id === id; });
    }
    function getCompetenceAreaByName(name) {
        return competenceAreas.value.find(function (area) { return area.name === name; });
    }
    function calculateProgressPercentage(currentLevel, targetLevel) {
        if (targetLevel === 0)
            return 0;
        return Math.min(Math.round((currentLevel / targetLevel) * 100), 100);
    }
    function getNextMilestone(competenceArea) {
        var progress = getProgressForCompetence(competenceArea);
        var area = getCompetenceAreaByName(competenceArea);
        if (!progress || !area)
            return null;
        var nextLevel = progress.currentLevel + 1;
        var milestone = area.levels.find(function (level) { return level.level === nextLevel; });
        return milestone ? {
            level: milestone.level,
            title: milestone.title,
            description: milestone.description
        } : null;
    }
    function getDaysUntilNextAssessment(competenceArea) {
        var progress = getProgressForCompetence(competenceArea);
        if (!progress)
            return null;
        var today = new Date();
        var nextAssessment = new Date(progress.nextAssessment);
        var diffTime = nextAssessment.getTime() - today.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    function isAssessmentOverdue(competenceArea) {
        var daysUntil = getDaysUntilNextAssessment(competenceArea);
        return daysUntil !== null && daysUntil < 0;
    }
    function getCompetencesByProgress() {
        return {
            completed: userProgress.value.filter(function (p) { return p.progress >= 100; }),
            inProgress: userProgress.value.filter(function (p) { return p.progress > 0 && p.progress < 100; }),
            notStarted: userProgress.value.filter(function (p) { return p.progress === 0; })
        };
    }
    function getRecentActivity(days) {
        if (days === void 0) { days = 30; }
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return userProgress.value
            .filter(function (p) { return new Date(p.lastAssessment) >= cutoffDate; })
            .sort(function (a, b) { return new Date(b.lastAssessment).getTime() - new Date(a.lastAssessment).getTime(); });
    }
    // Clear all data
    function clearAllData() {
        currentUser.value = null;
        isAuthenticated.value = false;
        userProgress.value = [];
        competenceAreas.value = [];
        userStatistics.value = null;
        overallProgress.value = null;
        upcomingAssessments.value = [];
        error.value = null;
    }
    function logout() {
        clearAllData();
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
        currentUser: currentUser,
        isAuthenticated: isAuthenticated,
        userProgress: userProgress,
        competenceAreas: competenceAreas,
        userStatistics: userStatistics,
        overallProgress: overallProgress,
        upcomingAssessments: upcomingAssessments,
        // Computed
        isUserLoaded: isUserLoaded,
        userName: userName,
        userEmail: userEmail,
        hasProgress: hasProgress,
        completedCompetences: completedCompetences,
        inProgressCompetences: inProgressCompetences,
        notStartedCompetences: notStartedCompetences,
        averageCompetenceLevel: averageCompetenceLevel,
        nextAssessmentDue: nextAssessmentDue,
        overallCompletionPercentage: overallCompletionPercentage,
        isProfileComplete: isProfileComplete,
        // Actions
        setUserService: setUserService,
        loadCurrentUser: loadCurrentUser,
        loadUserProgress: loadUserProgress,
        loadCompetenceAreas: loadCompetenceAreas,
        loadUserStatistics: loadUserStatistics,
        loadOverallProgress: loadOverallProgress,
        loadUpcomingAssessments: loadUpcomingAssessments,
        saveUserProgress: saveUserProgress,
        updateCompetenceLevel: updateCompetenceLevel,
        setCompetenceTargets: setCompetenceTargets,
        scheduleAssessment: scheduleAssessment,
        exportUserData: exportUserData,
        initializeUser: initializeUser,
        refreshUserData: refreshUserData,
        getProgressForCompetence: getProgressForCompetence,
        getCompetenceAreaById: getCompetenceAreaById,
        getCompetenceAreaByName: getCompetenceAreaByName,
        calculateProgressPercentage: calculateProgressPercentage,
        getNextMilestone: getNextMilestone,
        getDaysUntilNextAssessment: getDaysUntilNextAssessment,
        isAssessmentOverdue: isAssessmentOverdue,
        getCompetencesByProgress: getCompetencesByProgress,
        getRecentActivity: getRecentActivity,
        clearAllData: clearAllData,
        logout: logout,
        clearError: clearError,
        setError: setError
    };
});
//# sourceMappingURL=user.js.map