import { ParametersLib } from "../models/GestionConfig";

class GestionConfig {

    private parameters: ParametersLib;

    constructor() {
        this.parameters = {
            reduxIsActif: false,
            useAsyncStorage: false
        }
    }

    initializeParameters(parameters: ParametersLib) {
        this.parameters = parameters;
    }

    getParameters(): ParametersLib {
        return this.parameters;
    }

    getParameterUseAsyncStorage(): boolean {
        return this.parameters.useAsyncStorage;
    }

}

const gestionConfig = new GestionConfig();
export default gestionConfig;