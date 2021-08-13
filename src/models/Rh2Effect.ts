/*
 * File: Rh2Effect.ts                                                          *
 * Project: react-http-request-handler                                         *
 * Created Date: Fri July 16 2021                                              *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: Fri Aug 13 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { ParamListBase, RouteProp } from '@react-navigation/native';
import { AxiosRequestConfig } from 'axios';
import { TypeQueryParameter } from '.';

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
 * @param config Axios settings
 * @param justeReponse If true or not defined then return data else all information about http request
 * @param errorHandler Method to be executed to handle the errors in the event of an error in the request. If it is not provided, we see if that of the global *                        configuration is provided otherwise, nothing is done.
 */
export interface Rh2EffectAxiosConfigHandler {
    readonly keyOfInstance?: string;
    readonly config: AxiosRequestConfig;
    readonly justeReponse?: boolean;
    readonly errorHandler?: OptionalParamVoidMethod
}

/**
 * @param successHandler Method to run to handle the data after the query has been successfully executed otherwise nothing is done
 */
export interface Rh2EffectSuccessNotRequiredHandler extends Rh2EffectAxiosConfigHandler {
    readonly successHandler?: OptionalParamVoidMethod,
}

/**
 * @param addToDirectory Determines if the request can be executed more than once. If True, the request call will not be sent.
 * @param action 
 */
export interface Rh2EffectManageConfigAndReturnData {
    readonly addToDirectory: boolean;
    readonly action: any;
}

export interface Rh2EffectTreatmentToManageRequest extends Rh2EffectManageConfigAndReturnData, Rh2EffectLabelFilter, Rh2EffectSuccessNotRequiredHandler {
    optionalParameters?: Rh2EffectData
}

/**
 * @param params List of parameters to retrieve in the route
 * @param typeQueryParameter Type of query to run by path or query
 */
export interface Rh2EffectFromParameter {
    readonly params: string[];
    readonly typeQueryParameter: TypeQueryParameter;
}

export interface Rh2EffectTakeParamsInRoute extends Rh2EffectFromParameter, Rh2EffectSuccessNotRequiredHandler { }
export interface Rh2EffectTreatmentToManageParameters extends Rh2EffectTakeParamsInRoute, Rh2EffectLabelFilter {
    route: RouteProp<ParamListBase, string>;
    readonly action: any;
}

type OptionalParamVoidMethod = (param?: any) => void;

//export interface Rh2OptionalParameters