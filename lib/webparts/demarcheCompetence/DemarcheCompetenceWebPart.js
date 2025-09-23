var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, PropertyPaneToggle, PropertyPaneDropdown, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { createApp } from 'vue';
// Import main Vue app component
import DemarcheCompetenceApp from './app/DemarcheCompetenceApp.vue';
// Import store setup
import { setupStores, initializeAllStores } from '@stores/index';
// Import styles
import './app/styles/main.scss';
var DemarcheCompetenceWebPart = /** @class */ (function (_super) {
    __extends(DemarcheCompetenceWebPart, _super);
    function DemarcheCompetenceWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.vueApp = null;
        return _this;
    }
    DemarcheCompetenceWebPart.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, initTime, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.onInit.call(this)];
                    case 1:
                        _a.sent();
                        startTime = performance.now();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        // Log initialization start
                        console.log('Initializing Démarche Compétence WebPart...');
                        // Validate SharePoint context
                        if (!this.context) {
                            throw new Error('SharePoint context not available');
                        }
                        // Check required permissions
                        return [4 /*yield*/, this.checkPermissions()];
                    case 3:
                        // Check required permissions
                        _a.sent();
                        initTime = performance.now() - startTime;
                        console.log("WebPart initialized successfully in ".concat(initTime.toFixed(2), "ms"));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error initializing WebPart:', error_1);
                        this.showErrorMessage('Erreur lors de l\'initialisation de l\'application');
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DemarcheCompetenceWebPart.prototype.render = function () {
        try {
            // Destroy existing Vue app if it exists
            if (this.vueApp) {
                this.vueApp.unmount();
                this.vueApp = null;
            }
            // Create container element
            this.domElement.innerHTML = "\n        <div id=\"demarche-competence-app\" \n             data-title=\"".concat(escape(this.properties.title || 'Démarche Compétence CIPREL'), "\"\n             data-theme=\"").concat(escape(this.properties.theme || 'auto'), "\"\n             data-compact=\"").concat(this.properties.compactMode || false, "\"\n             data-debug=\"").concat(this.properties.debugMode || false, "\">\n          <div class=\"loading-container\">\n            <div class=\"loading-spinner\"></div>\n            <p>Chargement de l'application...</p>\n          </div>\n        </div>\n      ");
            // Initialize Vue application
            this.initializeVueApp();
        }
        catch (error) {
            console.error('Error rendering WebPart:', error);
            this.showErrorMessage('Erreur lors du rendu de l\'application');
        }
    };
    DemarcheCompetenceWebPart.prototype.initializeVueApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, pinia, services, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // Create Vue app instance
                        this.vueApp = createApp(DemarcheCompetenceApp, {
                            webPartProperties: this.properties,
                            webPartContext: this.context,
                            domElement: this.domElement
                        });
                        _a = setupStores(this.vueApp, this.context), pinia = _a.pinia, services = _a.services;
                        // Provide additional dependencies
                        this.vueApp.provide('webPartContext', this.context);
                        this.vueApp.provide('webPartProperties', this.properties);
                        this.vueApp.provide('services', services);
                        this.vueApp.provide('sharePointService', services.sharePointService);
                        // Mount the app
                        this.vueApp.mount('#demarche-competence-app');
                        // Initialize stores after mounting
                        return [4 /*yield*/, initializeAllStores()];
                    case 1:
                        // Initialize stores after mounting
                        _b.sent();
                        console.log('Vue application mounted successfully');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error initializing Vue app:', error_2);
                        this.showErrorMessage('Erreur lors de l\'initialisation de l\'interface');
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DemarcheCompetenceWebPart.prototype.checkPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listsToCheck, _i, listsToCheck_1, listTitle;
            return __generator(this, function (_a) {
                try {
                    listsToCheck = ['Quiz_Introduction', 'Quiz_Sondage', 'Quiz_Results', 'User_Progress'];
                    for (_i = 0, listsToCheck_1 = listsToCheck; _i < listsToCheck_1.length; _i++) {
                        listTitle = listsToCheck_1[_i];
                        // This would be implemented with actual permission checking
                        // For now, we'll assume permissions are available
                        console.log("Checking permissions for list: ".concat(listTitle));
                    }
                }
                catch (error) {
                    console.warn('Permission check failed:', error);
                    // Continue anyway - permissions will be checked when actually accessing lists
                }
                return [2 /*return*/];
            });
        });
    };
    DemarcheCompetenceWebPart.prototype.showErrorMessage = function (message) {
        this.domElement.innerHTML = "\n      <div class=\"error-container\">\n        <div class=\"error-icon\">\u26A0\uFE0F</div>\n        <h3>Erreur d'Application</h3>\n        <p>".concat(escape(message), "</p>\n        <button onclick=\"location.reload()\" class=\"retry-button\">\n          R\u00E9essayer\n        </button>\n      </div>\n    ");
    };
    DemarcheCompetenceWebPart.prototype.onDispose = function () {
        try {
            // Cleanup Vue app
            if (this.vueApp) {
                this.vueApp.unmount();
                this.vueApp = null;
            }
            // Clear DOM
            if (this.domElement) {
                this.domElement.innerHTML = '';
            }
            console.log('WebPart disposed successfully');
        }
        catch (error) {
            console.error('Error disposing WebPart:', error);
        }
    };
    Object.defineProperty(DemarcheCompetenceWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    DemarcheCompetenceWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: 'Configuration de l\'application Démarche Compétence'
                    },
                    groups: [
                        {
                            groupName: 'Paramètres Généraux',
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: 'Titre de l\'application',
                                    value: 'Démarche Compétence CIPREL'
                                }),
                                PropertyPaneTextField('description', {
                                    label: 'Description',
                                    multiline: true,
                                    rows: 3,
                                    value: 'Application de gestion des compétences pour CIPREL'
                                }),
                                PropertyPaneToggle('showTitle', {
                                    label: 'Afficher le titre',
                                    checked: true
                                })
                            ]
                        },
                        {
                            groupName: 'Paramètres de Fonctionnement',
                            groupFields: [
                                PropertyPaneToggle('autoSaveEnabled', {
                                    label: 'Sauvegarde automatique activée',
                                    checked: true
                                }),
                                PropertyPaneSlider('autoSaveInterval', {
                                    label: 'Intervalle de sauvegarde (secondes)',
                                    min: 10,
                                    max: 300,
                                    step: 10,
                                    value: 30,
                                    showValue: true,
                                    disabled: !this.properties.autoSaveEnabled
                                }),
                                PropertyPaneDropdown('theme', {
                                    label: 'Thème',
                                    options: [
                                        { key: 'auto', text: 'Automatique' },
                                        { key: 'light', text: 'Clair' },
                                        { key: 'dark', text: 'Sombre' }
                                    ],
                                    selectedKey: 'auto'
                                })
                            ]
                        },
                        {
                            groupName: 'Interface Utilisateur',
                            groupFields: [
                                PropertyPaneToggle('compactMode', {
                                    label: 'Mode compact',
                                    checked: false
                                }),
                                PropertyPaneToggle('enableNotifications', {
                                    label: 'Notifications activées',
                                    checked: true
                                }),
                                PropertyPaneToggle('enableAnimations', {
                                    label: 'Animations activées',
                                    checked: true
                                })
                            ]
                        },
                        {
                            groupName: 'Développement',
                            groupFields: [
                                PropertyPaneToggle('debugMode', {
                                    label: 'Mode debug',
                                    checked: false
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    DemarcheCompetenceWebPart.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        // Handle property changes that require re-rendering
        if (['theme', 'compactMode', 'title'].includes(propertyPath)) {
            this.render();
        }
        // Handle auto-save interval changes
        if (propertyPath === 'autoSaveEnabled' && !newValue) {
            // Disable auto-save if toggled off
            this.properties.autoSaveInterval = 0;
        }
        _super.prototype.onPropertyPaneFieldChanged.call(this, propertyPath, oldValue, newValue);
    };
    Object.defineProperty(DemarcheCompetenceWebPart.prototype, "disableReactivePropertyChanges", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    return DemarcheCompetenceWebPart;
}(BaseClientSideWebPart));
export default DemarcheCompetenceWebPart;
//# sourceMappingURL=DemarcheCompetenceWebPart.js.map