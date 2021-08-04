/*
 * File: Rh2ConfigService.ts                                                   *
 * Project: react-http-request-handler                                         *
 * Created Date: Sunday, August 1st 2021, 8:45:24 pm                                                 *
 * Author: Charly Beaugrand                                                            *
 * -----                                                                       *
 * Last Modified: Thu Aug 05 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { KeyValue, Rh2InitializationParameter } from "../models/Rh2Config";
import { isModeDebugThenDisplayError } from "../tools/Utils";
import { AxiosRequestConfigExtended } from './../models/Rh2Config';
import { initAxiosInstance } from "./Rh2AxiosInstanceService";

/**
 * Application configuration
 */
class Rh2ConfigService {

    private parameters: Rh2InitializationParameter;

    public HEADER_URL: KeyValue[] = [
        { key: 'Content-Type',
            value: 'application/json' }
    ]

    constructor() {
        this.parameters = {
            axiosConfig: [],
            errorHandler: null,
            modeDebug: false
        }
    }

    initializeParameters(parameters: Rh2InitializationParameter) {

        if (parameters == null) {
            isModeDebugThenDisplayError('The parameter of Rh2ConfigService should be not null');
        } else {
            this.parameters = {
                ...this.parameters,
                axiosConfig: parameters.axiosConfig,
                errorHandler: parameters.errorHandler == null ? this.parameters.errorHandler : parameters.errorHandler,
                modeDebug: parameters.modeDebug == null ? this.parameters.modeDebug : parameters.modeDebug
            };
            initAxiosInstance(this.getParametersAxiosConfigs())
        }
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

}

const rh2ConfigService = new Rh2ConfigService();
export default rh2ConfigService;