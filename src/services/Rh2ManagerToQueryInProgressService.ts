/*
 * File: Rh2ManagerToQueryInProgressService.ts                                 *
 * Project: react-http-request-handler                                         *
 * Created Date: Su Aug yyyy                                                   *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: Sun Aug 08 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import {
    ResponseFetchApi 
} from "../models";

interface Rh2ErreurApi {
    label: string;
    error: ResponseFetchApi;
}

class Rh2ManagerToQueryInProgressService {

    private queryInProgress: string[] = [];
    private erreurApi: Rh2ErreurApi[] = [];

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

    getQueryInProgress(): string[] {
        return this.queryInProgress;
    }

    addErrorApi(label: string, newError: ResponseFetchApi): void {
        if (this.erreurApi.some(error => error.label === label)) {
            const erreurApi = this.erreurApi.filter(erreur => erreur.label !== label);
            this.erreurApi = erreurApi;
            this.erreurApi.push({
                label: label,
                error: newError 
            });
        } else {
            this.erreurApi.push({
                label: label,
                error: newError 
            });
        }
    }

    getErreurApi(): Rh2ErreurApi[] {
        return this.erreurApi;
    }
}

const rh2ManagerToQueryInProgressService = new Rh2ManagerToQueryInProgressService();
export default rh2ManagerToQueryInProgressService;