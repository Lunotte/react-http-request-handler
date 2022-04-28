/*
 * File: FetchApi.ts                                                           *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 21 - 11:11 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface ResponseFetchApi {
    readonly isSuccess: boolean;
    readonly isError: boolean;
    readonly responseSuccess: AxiosResponse;
    readonly responseErreur: ErreurFetchApi;
    readonly status: number;
}

export interface ErreurFetchApi {
    readonly isResponseError: boolean;
    readonly isRequestError: boolean;
    readonly responseError: AxiosError;
    readonly requestError: any;
    readonly messageError: string;
    readonly config: AxiosRequestConfig;
}
