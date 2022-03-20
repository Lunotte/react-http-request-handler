/*
 * File: Rh2EffectsService.ts                                                  *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 16                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 20 - 07:29 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { AxiosRequestConfig, CancelTokenSource, Method } from 'axios';
import hash from 'object-hash';
import { useEffect, useState } from 'react';
import { Rh2AxiosConfig } from '..';
import { ResponseFetchApi } from '../models';
import { ConfigQueryParameter, DirectoryConfigQueryParameter, MethodRnhrh } from '../models/Rh2Directory';
import { isDebugModeThenDisplayInfo, isDebugModeThenDisplayWarn } from '../tools/Utils';
import { Rh2EffectAxiosConfigHandler, Rh2EffectData, Rh2EffectTreatmentToManageRequest, Rh2Hook } from './../models/Rh2Effect';
import { fetchApi } from './FetchApiService';
import { default as rh2AxiosConfigService } from './Rh2AxiosConfigService';
import { default as rh2ConfigService } from './Rh2ConfigService';
import { default as rh2DirectoryService } from './Rh2DirectoryService';
import { default as rh2ManagerToQueryInProgressService } from './Rh2ManagerToQueryInProgressService';

const initState = {
    loading: false,
    completed: false,
    failed: false,
    success: false,
    data: null
} 


/**
 * Get data from configuration
 * 
 * @param configuration Request to execute
 * @param filter If true, trigger the request
 * @param data Data to send in the request's body
 * @returns 
 */
export function useRh2WithParameters(
    configuration: Rh2EffectAxiosConfigHandler,
    filter = true,
    optionalParameters?: Rh2EffectData
): Rh2Hook {
    const [
        state,
        setState
    ] = useState(initState);

    useEffect(() => {
        async function fetch() {
            traitementToManageRequest(
                {
                    ...configuration,
                    action: setState,
                    label: null,
                    optionalParameters
                },
                filter
            )
        }
        fetch();
        return () => {
            setState(initState)
        }
    }, [
        configuration.axiosRequestConfig?.method,
        configuration.axiosRequestConfig?.url,
        configuration.axiosRequestConfig?.data,
        configuration.axiosRequestConfig?.params,
        optionalParameters?.data,
        optionalParameters?.params,
        optionalParameters?.pathParams,
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
    filter = true,
    optionalParameters?: Rh2EffectData
): Rh2Hook {
    const [
        state,
        setState
    ] = useState(initState);

    useEffect(() => {
        async function fetch() {

            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);
            isDebugModeThenDisplayInfo('The following configuration was found', configSelected);

            traitementToManageRequest(
                {
                    keyOfInstance: configSelected?.keyOfInstance,
                    label,
                    axiosRequestConfig: configSelected?.axiosRequestConfig,
                    onlyResult: configSelected?.onlyResult,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    addToDirectory: configSelected?.addToDirectory,
                    messageCancelToken: configSelected.messageCancelToken,
                    keyCancelToken: configSelected.keyCancelToken,
                    optionalParameters
                },
                filter
            )
        }
        fetch();
        return () => {
            setState(initState)
        }
    }, [
        label,
        optionalParameters,
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

    let configToUse = {
        ...configuration.axiosRequestConfig,
        data: (configuration.optionalParameters?.data != null) ? configuration.optionalParameters.data : configuration.axiosRequestConfig.data
    };

    if (configuration.optionalParameters?.pathParams != null) {
        configToUse = {
            ...configToUse,
            url: configToUse.url.concat(configuration.optionalParameters.pathParams) 
        };
    }

    if (configuration.optionalParameters?.params != null) {
        configToUse = {
            ...configToUse,
            params: configuration.optionalParameters.params 
        };
    }

    return configToUse;
    
}

async function traitementToManageRequest(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter: boolean
) {

    console.log('On appel traitementToManageRequest');
    
    if (configuration.axiosRequestConfig != null) {

        const configAxios: AxiosRequestConfig<any> = configuration.axiosRequestConfig;
        const configTmp: ConfigQueryParameter = configToManageDirectory(configAxios);

        if (filter) {

            // Si la requête est en cours et quelle n’est pas lock
            if (rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameterWithOrWithoutLock(configTmp, false)) {
                console.log('la requête est en cours ...');
                
                // On l’a stoppe pour en déclencher une nouvelle
                const myConfigToCancelRequest: DirectoryConfigQueryParameter = rh2DirectoryService.getConfigQueryParameter(configTmp.url, configTmp.method, configTmp.params);
               
                // On declenche le cancel
                cancelToken(myConfigToCancelRequest, configuration);
                // on supprime de l’annuaire
                rh2DirectoryService.removeQueryDirectoryNotLocked(configTmp);
                executeQuery(configuration, filter, configTmp, rh2DirectoryService.getOrGenerateCancelToken(configuration.keyCancelToken));
            }
            // Si elle n’est pas en cours, on fait le traitement classique
            else if (!rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
                executeQuery(configuration, filter, configTmp, rh2DirectoryService.getOrGenerateCancelToken(null));
            }
            // sinon on ne fait rien
            else {
                isDebugModeThenDisplayWarn('The query is configured to be executed only once', configTmp);
            }
        }
    }
}

function cancelToken(
    myConfigToCancelRequest: DirectoryConfigQueryParameter,
    configuration: Rh2EffectTreatmentToManageRequest
): void {
    isDebugModeThenDisplayWarn('Cancel token called', configuration, myConfigToCancelRequest);
    if (configuration.messageCancelToken == null) {
        myConfigToCancelRequest.sourceCancelToken.cancel();
    } else {
        myConfigToCancelRequest.sourceCancelToken.cancel(configuration.messageCancelToken);
    }
    rh2DirectoryService.removeKeyCancelToken(configuration.keyCancelToken);
}

async function executeQuery(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter: boolean,
    configTmp: ConfigQueryParameter,
    sourceCancelToken: CancelTokenSource
): Promise<void> {

    isDebugModeThenDisplayInfo(`State filter is ${filter} and configuration is`, configuration);

    configuration.action({
        loading: true,
        completed: false,
        failed: false,
        success: false,
        data: null 
    });
    
    loadingStarted(configuration);

    rh2DirectoryService.addConfigQueryParameter(configTmp, configuration.addToDirectory, sourceCancelToken);

    const reponse: ResponseFetchApi = await fetchApi(configuration.keyOfInstance,
        buildConfigToAxios(configuration),
        configuration.onlyResult == null || configuration.onlyResult === true);
    
    if (reponse.isSuccess) {
        treatmentIfSuccessInUseRequest(configuration, reponse);
    } else {
        treatmentIfErrorInUseRequest(configuration, reponse);
    }

    loadingcompleted(configuration);
    
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
        baseUrl: configuration.axiosRequestConfig.baseURL,
        url: configuration.axiosRequestConfig.url,
        method: configuration.axiosRequestConfig.method,
        params: configuration.axiosRequestConfig.params,
        data: configuration.axiosRequestConfig.data
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
function loadingcompleted(configuration: Rh2EffectTreatmentToManageRequest): void {
    if (configuration.label) {
        rh2ManagerToQueryInProgressService.removeQueryInProgress(configuration.label);
    } else {
        const hashResult = hashConfiguration(configuration);
        rh2ManagerToQueryInProgressService.removeQueryInProgress(hashResult);
    }
}

function treatmentIfSuccessInUseRequest(configuration: Rh2EffectTreatmentToManageRequest, reponse: ResponseFetchApi) {
    
    // Si on n'a pas demandé d'ajouter cette config en tant que config lock, on en a plus besoin
    if (!configuration.addToDirectory) {
        rh2DirectoryService.removeQueryDirectoryNotLocked(configuration.axiosRequestConfig);
    }

    if (configuration.successHandler) {
        configuration.successHandler(reponse.responseSuccess);
    } else {
        isDebugModeThenDisplayWarn('The method successHandler has not provided. This is normal if you use the return of the hook');
    }
    configuration.action({
        loading: false,
        completed: true,
        failed: false,
        success: true,
        data: reponse.responseSuccess 
    });
}

function treatmentIfErrorInUseRequest(configuration: Rh2EffectTreatmentToManageRequest, reponse: ResponseFetchApi) {
    isDebugModeThenDisplayWarn('An error was encountered', configuration.label, reponse);
    if (configuration.errorHandler) {
        configuration.errorHandler(reponse);
    } else if (rh2ConfigService.getParameters().errorHandler) {
        rh2ConfigService.getParameters().errorHandler(reponse);
    } else {
        isDebugModeThenDisplayWarn('The method errorHandler has not provided. This is normal if you use the return of the hook');
    }
    configuration.action({
        loading: false,
        completed: true,
        failed: true,
        success: false,
        data: null 
    });
    rh2ManagerToQueryInProgressService.addErrorApi(configuration.label, reponse);
}

