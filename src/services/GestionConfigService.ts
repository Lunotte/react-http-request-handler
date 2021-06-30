import { KeyValue, SettingsInitializerRnhrh } from "../models/GestionConfig";

class GestionConfig {

    private parameters: SettingsInitializerRnhrh;

    constructor() {
        this.parameters = {
            baseUrl: null,
            headerUrl: [{key: 'Content-Type', value: 'application/json'}],
            reduxIsActif: false,
            useAsyncStorage: false
        }
    }

    initializeParameters(parameters: SettingsInitializerRnhrh) {
        this.parameters = parameters;
    }

    getParameters(): SettingsInitializerRnhrh {
        return this.parameters;
    }

    getParameterBaseUrl(): string {
        return this.parameters.baseUrl;
    }

    getParameterHeaderUrl(): KeyValue[] {
        return this.parameters.headerUrl;
    }

    isUseAsyncStorage(): boolean {
        return this.parameters.useAsyncStorage;
    }

}

const gestionConfig = new GestionConfig();
export default gestionConfig;