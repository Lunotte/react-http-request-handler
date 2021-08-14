/*
 * File: Rh2EffectsService.ts                                                  *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 16                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:16 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { AxiosRequestConfig, Method } from 'axios';
import hash from 'object-hash';
import { useEffect, useState } from 'react';
import { Rh2AxiosConfig } from '..';
import { ResponseFetchApi } from '../models';
import { ConfigQueryParameter, MethodRnhrh } from '../models/Rh2Directory';
import { isModeDebugThenDisplayError, isModeDebugThenDisplayInfo, isModeDebugThenDisplayWarn } from '../tools/Utils';
import { Rh2EffectData, Rh2EffectSuccessNotRequiredHandler, Rh2EffectTreatmentToManageRequest } from './../models/Rh2Effect';
import { fetchApi } from './FetchApiService';
import { default as rh2AxiosConfigService } from './Rh2AxiosConfigService';
import { default as rh2ConfigService } from './Rh2ConfigService';
import { default as rh2DirectoryService } from './Rh2DirectoryService';
import { default as rh2ManagerToQueryInProgressService } from './Rh2ManagerToQueryInProgressService';

/*************************************************************************** */

//          Requests that are not pre-loaded will not have
//          the possibility of being stored in the directory

/*************************************************************************** */


/**
 * Get data from configuration
 * 
 * @param configuration Request to execute
 * @param filter If true, trigger the request
 * @param data Data to send in the request's body
 * @returns 
 */
export function useRh2WithParameters(
    configuration: Rh2EffectSuccessNotRequiredHandler,
    optionalParameters?: Rh2EffectData,
    filter = true
): {
    loading: boolean;
    data: any;
} {
    const [
        state,
        setState
    ] = useState({
        loading: true,
        data: null
    });

    useEffect(() => {
        async function fetch() {
            traitementToManageRequest(
                {
                    ...configuration,
                    action: setState,
                    addToDirectory: false,
                    label: null,
                    optionalParameters
                },
                filter
            )
        }
        fetch();
    }, [
        configuration.config?.method,
        configuration.config?.url,
        configuration.config?.data,
        configuration.config?.params,
        filter
    ]);

    return state;
}


/**
 * Get data from label
 * 
 * @param label Name of the request pre loaded
 * @param filter If true, trigger the request
 * @param data Data to send in the request's body
 * @returns 
 */
export function useRh2WithName(
    label: string,
    optionalParameters?: Rh2EffectData,
    filter = true
): {
    loading: boolean;
    data: any;
} {
    const [
        state,
        setState
    ] = useState({
        loading: false,
        data: null
    });

    useEffect(() => {
        async function fetch() {

            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);
            isModeDebugThenDisplayInfo('The following configuration was found', configSelected);

            traitementToManageRequest(
                {
                    keyOfInstance: configSelected?.keyOfInstance,
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    addToDirectory: configSelected?.addToDirectory,
                    optionalParameters
                },
                filter
            )
        }
        fetch();
    }, [
        label,
        filter
    ]);

    return state;
}

function configToManageDirectory(configAxios: AxiosRequestConfig): ConfigQueryParameter {
    return {
        method: configAxios?.method as MethodRnhrh,
        url: configAxios?.url,
        params: configAxios?.params 
    } as ConfigQueryParameter;
}

/**
 * Build a configuration to Axios with user's optional parameters
 * @param configuration 
 * @returns config to use by Axios
 */
function buildConfigToAxios(configuration: Rh2EffectTreatmentToManageRequest): AxiosRequestConfig {

    let configToUse = { ...configuration.config,
        data: (configuration.optionalParameters?.data != null) ? configuration.optionalParameters.data : configuration.config.data
    };
    
    if (configuration.optionalParameters?.params != null || configuration.optionalParameters?.pathParams != null) {

        if (configuration.optionalParameters?.params != null && configuration.optionalParameters?.pathParams != null) {
            isModeDebugThenDisplayError('Query and path parameters are defined. Path will be used');

            configToUse = {
                ...configToUse,
                url: configuration.config.url.concat(configuration.optionalParameters.pathParams)
            };

        } else if (configuration.optionalParameters?.params != null) {
            configToUse = { ...configToUse, params: configuration.optionalParameters.params };
        } else {
            configToUse = {...configToUse, url: configToUse.url.concat(configuration.optionalParameters.pathParams)};
        }
    }
    return configToUse;
    
}

async function traitementToManageRequest(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter: boolean
) {
    if (configuration.config != null) {

        const configAxios = configuration.config;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {

            configuration.action({
                loading: true,
                data: null 
            });
            loadingStarted(configuration);

            const reponse: ResponseFetchApi = await fetchApi(configuration.keyOfInstance,
                buildConfigToAxios(configuration),
                configuration.justeReponse == null || configuration.justeReponse === true);
            
            // Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
            if (configuration.addToDirectory) { // On ajoute à l'annuaire
                rh2DirectoryService.addConfigQueryParameter(configTmp);
            }

            if (reponse.isSuccess) {
                treatmentIfSuccessInUseRequest(configuration, reponse);
            } else {
                treatmentIfErrorInUseRequest(configuration, reponse);
            }

            loadingCompleted(configuration);
        }
    }
}

interface ObjectToHash {
    readonly baseUrl: string;
    readonly url: string;
    readonly method: Method;
    readonly params: any;
    readonly data: any;
}

function buildObjectToHash(configuration: Rh2EffectTreatmentToManageRequest): ObjectToHash {
    return {
        baseUrl: configuration.config.baseURL,
        url: configuration.config.url,
        method: configuration.config.method,
        params: configuration.config.params,
        data: configuration.config.data,
    };
}

function hashConfiguration(configuration: Rh2EffectTreatmentToManageRequest) {
    return hash(buildObjectToHash(configuration));
}

function loadingStarted(configuration: Rh2EffectTreatmentToManageRequest): void {
    if (configuration.label) {
        rh2ManagerToQueryInProgressService.addQueryInProgress(configuration.label);
    } else {
        const hashResult = hashConfiguration(configuration);
        rh2ManagerToQueryInProgressService.addQueryInProgress(hashResult);
    }
}
function loadingCompleted(configuration: Rh2EffectTreatmentToManageRequest): void {
    if (configuration.label) {
        rh2ManagerToQueryInProgressService.removeQueryInProgress(configuration.label);
    } else {
        const hashResult = hashConfiguration(configuration);
        rh2ManagerToQueryInProgressService.removeQueryInProgress(hashResult);
    }
}

function treatmentIfSuccessInUseRequest(configuration: Rh2EffectTreatmentToManageRequest, reponse: ResponseFetchApi) {
    if (configuration.successHandler) {
        configuration.successHandler(reponse.responseSuccess);
    } else {
        isModeDebugThenDisplayWarn('The method successHandler has not provided. This is normal if you use the return of the hook');
    }
    configuration.action({
        loading: false,
        data: reponse.responseSuccess 
    });
}

function treatmentIfErrorInUseRequest(configuration: Rh2EffectTreatmentToManageRequest, reponse: ResponseFetchApi) {
    isModeDebugThenDisplayWarn('An error is to be handled', configuration.label, reponse);
    if (configuration.errorHandler) {
        configuration.errorHandler(reponse);
    } else if (rh2ConfigService.getParameters().errorHandler) {
        rh2ConfigService.getParameters().errorHandler(reponse);
    } else {
        isModeDebugThenDisplayWarn('The method errorHandler has not provided. This is normal if you use the return of the hook');
    }
    configuration.action({
        loading: false,
        data: null 
    });
    rh2ManagerToQueryInProgressService.addErrorApi(configuration.label, reponse);
}

