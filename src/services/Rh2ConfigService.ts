import { KeyValue, SettingsInitializerRnhrh } from "../models/Rh2Config";
import { AxiosRequestConfigExtended } from './../models/Rh2Config';

class Rh2ConfigService {

    private parameters: SettingsInitializerRnhrh;

    public HEADER_URL: KeyValue[] = [{ key: 'Content-Type', value: 'application/json' }]

    constructor() {
        this.parameters = {
            axiosConfig: [],
            reduxIsActif: false,
            useAsyncStorage: false,
            errorHandler: null,
            modeDebug: false
        }
    }

    initializeParameters(parameters: SettingsInitializerRnhrh) {
        this.parameters = {
            ...this.parameters,
            axiosConfig: parameters.axiosConfig,
            reduxIsActif: parameters.reduxIsActif == null ? this.parameters.reduxIsActif : parameters.reduxIsActif,
            useAsyncStorage: parameters.useAsyncStorage == null ? this.parameters.useAsyncStorage : parameters.useAsyncStorage,
            errorHandler: parameters.errorHandler == null ? this.parameters.errorHandler : parameters.errorHandler,
            modeDebug: parameters.modeDebug == null ? this.parameters.modeDebug : parameters.modeDebug
        };
    }

    getParameters(): SettingsInitializerRnhrh {
        return this.parameters;
    }

    getParametersAxiosConfigs(): AxiosRequestConfigExtended[] {
        return this.parameters.axiosConfig;
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