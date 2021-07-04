import { KeyValue, SettingsInitializerRnhrh } from "../models/Rh2Config";

class Rh2ConfigService {

    private parameters: SettingsInitializerRnhrh;

    constructor() {
        this.parameters = {
            baseUrl: null,
            headerUrl: [{key: 'Content-Type', value: 'application/json'}],
            reduxIsActif: false,
            useAsyncStorage: false,
            errorHandler: null,
            modeDebug: false
        }
    }

    initializeParameters(parameters: SettingsInitializerRnhrh) {
        this.parameters = {
            ...this.parameters,
            baseUrl: parameters.baseUrl == null ? this.parameters.baseUrl : parameters.baseUrl,
            headerUrl: parameters.headerUrl == null ? this.parameters.headerUrl : parameters.headerUrl,
            reduxIsActif: parameters.reduxIsActif == null ? this.parameters.reduxIsActif : parameters.reduxIsActif,
            useAsyncStorage: parameters.useAsyncStorage == null ? this.parameters.useAsyncStorage : parameters.useAsyncStorage,
            errorHandler: parameters.errorHandler == null ? this.parameters.errorHandler : parameters.errorHandler,
            modeDebug: parameters.modeDebug == null ? this.parameters.modeDebug : parameters.modeDebug
        };
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

    isModeDebug(): boolean {
        return this.parameters.modeDebug;
    }

}

const rh2ConfigService = new Rh2ConfigService();
export default rh2ConfigService;