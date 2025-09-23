import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, PropertyPaneToggle, PropertyPaneDropdown, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import * as Vue from 'vue';
// Import main Vue app component
import DemarcheCompetenceApp from './app/DemarcheCompetenceApp.vue';
// Import store setup
import { setupStores, initializeAllStores, store } from '@stores/index';
// Import styles
import './app/styles/main.scss';
export default class DemarcheCompetenceWebPart extends BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        this.vueApp = null;
    }
    async onInit() {
        await super.onInit();
        // Initialize performance tracking
        const startTime = performance.now();
        try {
            // Log initialization start
            console.log('Initializing Démarche Compétence WebPart...');
            // Validate SharePoint context
            if (!this.context) {
                throw new Error('SharePoint context not available');
            }
            // Check required permissions
            await this.checkPermissions();
            // Log successful initialization
            const initTime = performance.now() - startTime;
            console.log(`WebPart initialized successfully in ${initTime.toFixed(2)}ms`);
        }
        catch (error) {
            console.error('Error initializing WebPart:', error);
            this.showErrorMessage('Erreur lors de l\'initialisation de l\'application');
            throw error;
        }
    }
    render() {
        try {
            // Destroy existing Vue app if it exists
            if (this.vueApp) {
                this.vueApp.unmount();
                this.vueApp = null;
            }
            // Create container element
            this.domElement.innerHTML = `
        <div id="demarche-competence-app" 
             data-title="${escape(this.properties.title || 'Démarche Compétence CIPREL')}"
             data-theme="${escape(this.properties.theme || 'auto')}"
             data-compact="${this.properties.compactMode || false}"
             data-debug="${this.properties.debugMode || false}">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Chargement de l'application...</p>
          </div>
        </div>
      `;
            // Initialize Vue application
            this.initializeVueApp();
        }
        catch (error) {
            console.error('Error rendering WebPart:', error);
            this.showErrorMessage('Erreur lors du rendu de l\'application');
        }
    }
    async initializeVueApp() {
        try {
            // Setup stores with SharePoint context
            const { services } = setupStores(null, this.context);
            // Create Vue app instance with Vue 2 syntax
            this.vueApp = new Vue({
                store,
                data: () => ({
                    webPartProperties: this.properties,
                    webPartContext: this.context,
                    domElement: this.domElement,
                    services
                }),
                provide() {
                    return {
                        webPartContext: this.webPartContext,
                        webPartProperties: this.webPartProperties,
                        services: this.services,
                        sharePointService: this.services.sharePointService
                    };
                },
                render: h => h(DemarcheCompetenceApp, {
                    props: {
                        webPartProperties: this.properties,
                        webPartContext: this.context,
                        domElement: this.domElement
                    }
                })
            });
            // Mount the app
            this.vueApp.$mount('#demarche-competence-app');
            // Initialize stores after mounting
            await initializeAllStores();
            console.log('Vue application mounted successfully');
        }
        catch (error) {
            console.error('Error initializing Vue app:', error);
            this.showErrorMessage('Erreur lors de l\'initialisation de l\'interface');
            throw error;
        }
    }
    async checkPermissions() {
        try {
            // Check if user has access to required SharePoint lists
            const listsToCheck = ['Quiz_Introduction', 'Quiz_Sondage', 'Quiz_Results', 'User_Progress'];
            for (const listTitle of listsToCheck) {
                // This would be implemented with actual permission checking
                // For now, we'll assume permissions are available
                console.log(`Checking permissions for list: ${listTitle}`);
            }
        }
        catch (error) {
            console.warn('Permission check failed:', error);
            // Continue anyway - permissions will be checked when actually accessing lists
        }
    }
    showErrorMessage(message) {
        this.domElement.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h3>Erreur d'Application</h3>
        <p>${escape(message)}</p>
        <button onclick="location.reload()" class="retry-button">
          Réessayer
        </button>
      </div>
    `;
    }
    onDispose() {
        try {
            // Cleanup Vue app
            if (this.vueApp) {
                this.vueApp.$destroy();
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
    }
    get dataVersion() {
        return Version.parse('1.0');
    }
    getPropertyPaneConfiguration() {
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
    }
    onPropertyPaneFieldChanged(propertyPath, oldValue, newValue) {
        // Handle property changes that require re-rendering
        if (['theme', 'compactMode', 'title'].includes(propertyPath)) {
            this.render();
        }
        // Handle auto-save interval changes
        if (propertyPath === 'autoSaveEnabled' && !newValue) {
            // Disable auto-save if toggled off
            this.properties.autoSaveInterval = 0;
        }
        super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
    get disableReactivePropertyChanges() {
        return false;
    }
}
//# sourceMappingURL=DemarcheCompetenceWebPart.js.map