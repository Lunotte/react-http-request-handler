import { SettingsInitializerRnhrh } from "../models/GestionConfig";

class GestionConfig {

    private parameters: SettingsInitializerRnhrh;

    constructor() {
        this.parameters = {
            baseUrl: null,
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

    getParameterUseAsyncStorage(): boolean {
        return this.parameters.useAsyncStorage;
    }

}

const gestionConfig = new GestionConfig();
export default gestionConfig;