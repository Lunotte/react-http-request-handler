/*
 * File: Rh2ConfigService.ts                                                   *
 * Project: react-http-request-handler                                         *
 * Project: react-http-request-handler                                         *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: Sun Aug 08 2021                                              *
 * Last Modified: Sun Aug 08 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { AxiosInstance } from 'axios';
/*
 * File: Rh2ConfigService.ts                                                   *
 * Project: react-http-request-handler                                         *
 * Created Date: Sunday, August 1st 2021, 8:45:24 pm                                                 *
 * Author: Charly Beaugrand                                                            *
 * -----                                                                       *
 * Last Modified: Sun Aug 08 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */
import { Rh2InitializationParameter } from "../models/Rh2Config";
import { AxiosRequestConfigExtended } from './../models/Rh2Config';
import { ejectInterceptor, initAxiosInstance, Rh2AxiosInstance } from './Rh2AxiosInstanceService';

/**
 * Application configuration
 */
class Rh2ConfigService {

    private axiosInstances: Rh2AxiosInstance;

    private parameters: Rh2InitializationParameter;

    constructor() {
        this.parameters = {
            axiosConfig: [],
            errorHandler: null,
            modeDebug: false
        }

        this.axiosInstances = initAxiosInstance(null);
    }

    initializeParameters(parameters: Rh2InitializationParameter): void {
        if (parameters == null) {
            console.error('The parameter of Rh2ConfigService should be not null');
        } else {

            ejectInterceptor(this.axiosInstances);

            this.parameters = {
                ...this.parameters,
                axiosConfig: parameters.axiosConfig,
                errorHandler: parameters.errorHandler == null ? this.parameters.errorHandler : parameters.errorHandler,
                modeDebug: parameters.modeDebug == null ? this.parameters.modeDebug : parameters.modeDebug
            };
            this.axiosInstances = initAxiosInstance(this.getParametersAxiosConfigs())
        }
    }

    setErrorHandler(treatment: (param?: any) => void): void {
        this.parameters = { ...this.parameters, errorHandler: treatment };
    }

    getParameters(): Rh2InitializationParameter {
        return this.parameters;
    }

    getParametersAxiosConfigs(): AxiosRequestConfigExtended[] {
        return this.parameters.axiosConfig;
    }

    isModeDebug(): boolean {
        return this.parameters.modeDebug;
    }

    /**
     * If the user has initialized library with SettingsInitializerRnhrh and provided data for the param axiosConfig
     * All instances requested will be accessible. You can use them to make interceptors
     * If nothing provided, default instance has been created
     * @returns All Axios instances generate 
     */
    getAxiosInstances(): Rh2AxiosInstance {
        return this.axiosInstances;
    }

    getAxiosInstance(key: string): AxiosInstance {
        return this.axiosInstances[key].axiosInstance;
    }

}

const rh2ConfigService = new Rh2ConfigService();
export default rh2ConfigService;