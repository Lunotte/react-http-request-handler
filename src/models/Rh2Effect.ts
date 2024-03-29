/*
 * File: Rh2Effect.ts                                                          *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 16                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 21 - 11:30 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { AxiosRequestConfig } from 'axios';

/**
 * @param label Name of the preloaded configuration
 */ 
export interface Rh2EffectLabelFilter {
    readonly label: string;
}

/**
 * @param data Data to send in the request's body
 */
export interface Rh2EffectData {
    readonly data?: any;
    readonly params?: any;
    readonly pathParams?: any;
}

/**
 * @param keyOfInstance If is not provided, first Axios instance will be used
 * @param axiosRequestConfig Axios settings
 * @param lock Lock the query to prevent a query from running multiple times. Determines if the request can be executed more than once. If True, the request call will not be sent.
 * @param onlyResult If true or not defined then return data else all information about http request
 * @param errorHandler Method to be executed to handle the errors in the event of an error in the request. If it is not provided, we see if that of the global *                        configuration is provided otherwise, nothing is done.
 * @param successHandler
 * @param messageCancelToken Associated message if the request is canceled
 * @param keyCancelToken Key to identify requests that must be joined together if a cancellation is requested
 */
export interface Rh2EffectAxiosConfigHandler {
    readonly keyOfInstance?: string;
    readonly axiosRequestConfig: AxiosRequestConfig;
    readonly lock?: boolean;
    readonly onlyResult?: boolean;
    readonly errorHandler?: OptionalParamVoidMethod;
    readonly successHandler?: OptionalParamVoidMethod;
    readonly messageCancelToken?: string;
    readonly keyCancelToken?: string;
}

/**
 * @param action 
 */
export interface Rh2EffectManageConfigAndReturnData {
    readonly action: any;
}

/**
 * optionalParameters Important parameter to custom query. Three parameters are available
 * - data is used to send body to the request
 * - params its content is combined with that of the "params" parameter of axios
 * - pathParams its content is concat with url
 */
export interface Rh2EffectTreatmentToManageRequest extends Rh2EffectManageConfigAndReturnData, Rh2EffectLabelFilter, Rh2EffectAxiosConfigHandler {
    optionalParameters?: Rh2EffectData
}

type OptionalParamVoidMethod = (param?: any) => void;

export interface Rh2Response {
    loading: boolean;
    completed: boolean;
    failed: boolean,
    success: boolean,
    data: any;
}
