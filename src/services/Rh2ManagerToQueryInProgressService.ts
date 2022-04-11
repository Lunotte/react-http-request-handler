/*
 * File: Rh2ManagerToQueryInProgressService.ts                                 *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 03                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 04 04 - 08:57 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { ResponseFetchApi } from "../models";
import { Rh2EffectTreatmentToManageRequest } from "../models/Rh2Effect";

interface Rh2ErrorsApi {
    label: string;
    configuration: Rh2EffectTreatmentToManageRequest;
    error: ResponseFetchApi;
}

class Rh2ManagerToQueryInProgressService {

    private queryInProgress: string[] = [];
    private errorsApi: Rh2ErrorsApi[] = [];

    addQueryInProgress(label: string): void {
        if (!this.queryInProgress.includes(label)) {
            this.queryInProgress.push(label);
        }
    }

    removeQueryInProgress(label: string): void {
        if (this.queryInProgress.includes(label)) {
            const queries = this.queryInProgress.filter(query => query !== label);
            this.queryInProgress = queries;
        }
    }

    getQueriesInProgress(): string[] {
        return this.queryInProgress;
    }

    addErrorApi(label: string, configuration: Rh2EffectTreatmentToManageRequest, newError: ResponseFetchApi): void {
        if (this.errorsApi.some(error => error.label === label)) {
            const errorsApi = this.errorsApi.filter(erreur => erreur.label !== label);
            this.errorsApi = errorsApi;
            this.errorsApi.push({
                label,
                configuration,
                error: newError 
            });
        } else {
            this.errorsApi.push({
                label,
                configuration,
                error: newError 
            });
        }
    }

    getErrorsApi(): Rh2ErrorsApi[] {
        return this.errorsApi;
    }
}

/**
 * List of errors to each concerned api
 * 
 * @returns Rh2ErrorsApi[]
 */
export function getErrorsApi(): Rh2ErrorsApi[] {
    return rh2ManagerToQueryInProgressService.getErrorsApi();
}

const rh2ManagerToQueryInProgressService = new Rh2ManagerToQueryInProgressService();
export default rh2ManagerToQueryInProgressService;
