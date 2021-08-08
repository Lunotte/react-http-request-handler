/*
 * File: Rh2EffectsService.ts                                                  *
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



import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { Rh2AxiosConfig } from '..';
import { ResponseFetchApi } from '../models';
import { ConfigQueryParameter, MethodRnhrh } from '../models/Rh2Directory';
import { isModeDebugThenDisplayInfo, isModeDebugThenDisplayWarn } from '../tools/Utils';
import { Rh2EffectSuccessNotRequiredHandler, Rh2EffectTakeParamsInRoute, Rh2EffectTreatmentToManageParameters, Rh2EffectTreatmentToManageRequest } from './../models/Rh2Effect';
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
    filter = true,
    data?: any
): {
    loading: boolean;
    data: any;
} {
    const [
        state,
        setState
    ] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {
            return traitementToManageRequest(
                { ...configuration,
                    action: setState,
                    addToDirectory: false,
                    label: null,
                    data
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
    filter = true,
    data?: any
): {
    loading: boolean;
    data: any;
} {
    const [
        state,
        setState
    ] = useState({
        loading: false,
        data: null,
    });

    useEffect(() => {
        async function fetch() {

            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);
            isModeDebugThenDisplayInfo('The following configuration was found', configSelected);

            return traitementToManageRequest(
                {
                    keyOfInstance: configSelected?.keyOfInstance,
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    addToDirectory: configSelected?.addToDirectory,
                    data
                }
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
    return { method: configAxios?.method as MethodRnhrh,
        url: configAxios?.url,
        params: configAxios?.params } as ConfigQueryParameter;
}

async function traitementToManageRequest(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter = true,
) {
    if (configuration.config != null) {

        const configAxios = configuration.config;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {

            configuration.action({ loading: true,
                data: null });
            loadingStarted(configuration);
            console.log(rh2ManagerToQueryInProgressService.getQueryInProgress());
            
            const reponse: ResponseFetchApi = await fetchApi(configuration.keyOfInstance,
                {...configuration.config,
                    data: (configuration.data != null) ? configuration.data : configuration.config.data },
                configuration.justeReponse == null || configuration.justeReponse === true);
            
            console.log(reponse);
            

            // Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
            if (configuration.addToDirectory) { // On ajoute à l'annuaire
                rh2DirectoryService.addConfigQueryParameter(configTmp);
            }

            if (reponse.isSuccess) {
                treatmentIfSuccessInUseRequest(configuration, reponse);
            } else {
                treatmentIfErrorInUseRequest(configuration, reponse);
            }

            console.log(rh2ManagerToQueryInProgressService.getErreurApi());

            loadingCompleted(configuration);
            console.log(rh2ManagerToQueryInProgressService.getQueryInProgress());
        }
    }
}

// @TODO On pourrait dipatch une action dans tous les cas; faire un hash de l'url,
// param et type que l'on ajouterait à la place du label en tant que clé unique
function loadingStarted(configuration: Rh2EffectTreatmentToManageRequest) {
    if (configuration.label) {
        rh2ManagerToQueryInProgressService.addQueryInProgress(configuration.label);
    }
}
// @TODO On pourrait dipatch une action dans tous les cas; faire un hash de l'url,
// param et type que l'on ajouterait à la place du label en tant que clé unique
function loadingCompleted(configuration: Rh2EffectTreatmentToManageRequest) {
    if (configuration.label) {
        rh2ManagerToQueryInProgressService.removeQueryInProgress(configuration.label);
    }
}


function treatmentIfSuccessInUseRequest(configuration: Rh2EffectTreatmentToManageRequest, reponse: ResponseFetchApi) {
    if (configuration.successHandler) {
        configuration.successHandler(reponse.responseSuccess);
    } else {
        isModeDebugThenDisplayWarn('The method successHandler has not provided. This is normal if you use the return of the hook');
    }
    configuration.action({ loading: false,
        data: reponse.responseSuccess });
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
    configuration.action({ loading: false,
        data: null });
    rh2ManagerToQueryInProgressService.addErrorApi(configuration.label, reponse);
}



/**
 * 
 * 
 * 
 * ------------------------------------------------------------------------
 * 
 *             !!!!!!!!!!!!!!!! ONLY REACT NATIVE !!!!!!!!!!!!!!!!
 * 
 * ------------------------------------------------------------------------
 * 
 * 
 */


/**
 * To be used if you need to add parameters to the request and you are in react native
 * In PATH_PARAM mode, we can concatenate with the values pre-entered in the config, it does not work with REQUEST_PARAM
 * 
 * @param configuration Request to execute
 * @param filter If True, execute the request
 * @param data Data to send in the request's body
 */
export function useRh2WithParametersTakeParamsInRoute(
    configuration: Rh2EffectTakeParamsInRoute,
    filter = true,
    data?: any
) {
    const route = useRoute();
    const [
        state,
        setState
    ] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {
            treatmentToManageParameters(
                {
                    ...configuration,
                    label: null,
                    route,
                    action: setState,
                    data
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
 * Execute a pre-load query and add parameter provided by route navigation
 * 
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 * @param data Data to send in the request's body
 */
export function useRh2WithNameTakeParamsInRoute(
    label: string,
    filter = true,
    data?: any
) {
    const route = useRoute();

    const [
        state,
        setState
    ] = useState({
        loading: true,
        data: null,
    });


    useEffect(() => {
        async function fetch() {
            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            isModeDebugThenDisplayInfo('The following configuration was found', configSelected);

            return treatmentToManageParameters(
                {
                    keyOfInstance: configSelected?.keyOfInstance,
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    params: configSelected?.dataFromRoute.params,
                    typeQueryParameter: configSelected?.dataFromRoute.typeQueryParameter,
                    route,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    data
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

async function treatmentToManageParameters(
    configuration: Rh2EffectTreatmentToManageParameters,
    filter = true
) {
    if (configuration.config != null) {
        const dataInRouteParam = getDataInRouteParam(configuration.params, configuration.route);

        if (configuration.route.params == null || dataInRouteParam == null) {
            isModeDebugThenDisplayWarn('No parameters in the route or recovered in the route. The classic treatment will be carried out');

            traitementToManageRequest(
                { ...configuration,
                    addToDirectory: false,
                    label: null },
                filter
            );
        } else {
            let apiAvecParam = {
                ...configuration.config,
                url: configuration.config.url.endsWith('/') ?
                    configuration.config.url.substring(0, configuration.config.url.length - 1) :
                    configuration.config.url
            };

            if (configuration.typeQueryParameter === 'PATH_PARAM') {
                isModeDebugThenDisplayInfo('Construction of a Path type method');
                //    Chaque paramètre va etre precede d'un /
                const parametresConcatenes = Object.keys(dataInRouteParam).reduce((avant, maintenant) =>
                    avant.concat('/').concat(dataInRouteParam[maintenant]), '');

                apiAvecParam = { ...apiAvecParam,
                    url: apiAvecParam.url.concat(parametresConcatenes) };
            }

            if (configuration.typeQueryParameter === 'REQUEST_PARAM') {
                isModeDebugThenDisplayInfo('Construction of a Query type method');
                apiAvecParam = { ...apiAvecParam,
                    params: dataInRouteParam };
            }

            traitementToManageRequest(
                {
                    ...configuration,
                    label: null,
                    config: apiAvecParam,
                    addToDirectory: false

                },
                filter
            );
        }
    }
}

/**
 * Retrieve the parameters in the navigation url in relation to those requested as argument of the method
 * @param params List of keys to find
 * @param route Hook useRoute only available for native version
 * @returns The list of elements found
 */
export function getDataInRouteParam(params: string[], route: RouteProp<ParamListBase, string>) {
    const data = {};

    params.forEach((key) => {
        const param = route.params[key];
        if (param != null) {
            data[key] = param;
        }
    });
    isModeDebugThenDisplayInfo('List of params obtained in the route', data)
    return Object.keys(data).length === 0 ? null : data;
}
