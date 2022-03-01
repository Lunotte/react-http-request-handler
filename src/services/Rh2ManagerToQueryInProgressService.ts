/*
 * File: Rh2ManagerToQueryInProgressService.ts                                 *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 03                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 02 07 - 05:41 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






import { ResponseFetchApi } from "../models";

interface Rh2ErreurApi {
    label: string;
    error: ResponseFetchApi;
}

class Rh2ManagerToQueryInProgressService {

    private queryInProgress: string[] = [];
    private erreurApi: Rh2ErreurApi[] = [];

    isQueryInProgress(label: string): boolean {
        return this.queryInProgress.find(query => query !== label) != null;
    }

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