/*
 * File: Rh2EffectsService.ts                                                  *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 16                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 23 - 03:20 pm                                        *
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
import { isModeDebugThenDisplayInfo, isModeDebugThenDisplayWarn } from '../tools/Utils';
import { Rh2EffectAxiosConfigHandler, Rh2EffectData, Rh2EffectTreatmentToManageRequest, Rh2Hook } from './../models/Rh2Effect';
import { fetchApi } from './FetchApiService';
import { default as rh2AxiosConfigService } from './Rh2AxiosConfigService';
import { default as rh2ConfigService } from './Rh2ConfigService';
import { default as rh2DirectoryService } from './Rh2DirectoryService';
import { default as rh2ManagerToQueryInProgressService } from './Rh2ManagerToQueryInProgressService';


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
    ] = useState({
        loading: false,
        completed: false,
        failed: false,
        success: false,
        data: null
    });

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
    ] = useState({
        loading: false,
        completed: false,
        failed: false,
        success: false,
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
                    axiosRequestConfig: configSelected?.axiosRequestConfig,
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

    let configToUse = { ...configuration.axiosRequestConfig,
        data: (configuration.optionalParameters?.data != null) ? configuration.optionalParameters.data : configuration.axiosRequestConfig.data
    };

    if (configuration.optionalParameters?.pathParams != null) {
        configToUse = { ...configToUse, url: configToUse.url.concat(configuration.optionalParameters.pathParams) };
    }

    if (configuration.optionalParameters?.params != null) {
        configToUse = { ...configToUse, params: configuration.optionalParameters.params };
    }

    return configToUse;
    
}

async function traitementToManageRequest(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter: boolean
) {
    if (configuration.axiosRequestConfig != null) {

        const configAxios = configuration.axiosRequestConfig;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {

            isModeDebugThenDisplayInfo(`State filter is ${filter} and configuration is ${configuration}`);

            configuration.action({
                loading: true,
                completed: false,
                failed: false,
                success: false,
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

            loadingcompletedd(configuration);
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
        baseUrl: configuration.axiosRequestConfig.baseURL,
        url: configuration.axiosRequestConfig.url,
        method: configuration.axiosRequestConfig.method,
        params: configuration.axiosRequestConfig.params,
        data: configuration.axiosRequestConfig.data,
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
function loadingcompletedd(configuration: Rh2EffectTreatmentToManageRequest): void {
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
        completed: true,
        failed: false,
        success: true,
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
        completed: true,
        failed: true,
        success: false,
        data: null 
    });
    rh2ManagerToQueryInProgressService.addErrorApi(configuration.label, reponse);
}

