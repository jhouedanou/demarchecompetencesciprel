import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import './app/styles/main.scss';
export interface IDemarcheCompetenceWebPartProps {
    title: string;
    description: string;
    showTitle: boolean;
    autoSaveEnabled: boolean;
    autoSaveInterval: number;
    theme: 'light' | 'dark' | 'auto';
    compactMode: boolean;
    enableNotifications: boolean;
    enableAnimations: boolean;
    debugMode: boolean;
}
export default class DemarcheCompetenceWebPart extends BaseClientSideWebPart<IDemarcheCompetenceWebPartProps> {
    private store;
    protected onInit(): Promise<void>;
    render(): void;
    private initializeReactApp;
    private checkPermissions;
    private showErrorMessage;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
    protected get disableReactivePropertyChanges(): boolean;
}
//# sourceMappingURL=DemarcheCompetenceWebPart.d.ts.map