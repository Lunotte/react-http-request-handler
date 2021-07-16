import { Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired, Rh2EffectTreatmentUseRequest, Rh2EffectTreatmentUseRequestAllConfiguration, Rh2EffectAxiosConfigHandlerSuccessHandlerRequired, Rh2EffectTreatmentWithParamInRouteFromParameter, Rh2EffectWithParamInRouteFromParameter } from './../models/Rh2Effect';
import { ConfigQueryParameter, MethodRnhrh } from '../models/Rh2Directory';
import { apiErrordAction, chargementFinishedAction, chargementStartedAction } from '../redux/rh2-action';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { fetchApi } from './FetchApiService';
import { default as rh2DirectoryService } from './Rh2DirectoryService';
import { default as rh2AxiosConfigService } from './Rh2AxiosConfigService';
import { default as rh2ConfigService } from './Rh2ConfigService';
import { Rh2AxiosConfig } from '..';
import { ResponseFetchApi } from '../models';
import { AxiosRequestConfig } from 'axios';

/*************************************************************************** */

//          Les requêtes qui ne sont pas pré-chargées n’auront pas
//          la possibilité d’être stockées dans l’annuaire

/*************************************************************************** */


/**
 * 
 * 
 * @param configuration Request to execute
 * @param filter If true, trigger the request
 * @returns 
 */
export async function useRequestNotPreloadedWithParameter(// useRh2WithParameters
    configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired,
    filter: boolean = true
): Promise<{
    loading: boolean;
    data: any;
}> {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {
            return traitementUseRequestAllConfiguration(
                {...configuration, action: setState, addToDirectory: false}
            )
        }
        fetch();
    }, [configuration.config?.method, configuration.config?.url, configuration.config?.data, filter]);
    
    return state;
}


/**
 * 
 * @param label Name of the request pre loaded
 * @param filter If true, trigger the request
 * @returns 
 */
export async function useRequestPreloadedWithName(
    label: string,
    filter: boolean = true
): Promise<{
    loading: boolean;
    data: any;
}> {
    const [state, setState] = useState({
        loading: false,
        data: null,
    });
     
    useEffect(() => {
        async function fetch() {

            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            const configAxios = configSelected?.axiosRequestConfig;
            const configTmp = configToManageDirectory(configAxios);

            console.log('configTmp', configTmp);
            return traitementUseRequestAllConfiguration(
                {
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    addToDirectory: configSelected?.addToDirectory
                }
            )
        }
        fetch();
    }, [label, filter]);

    return state;
}

function configToManageDirectory(configAxios: AxiosRequestConfig): ConfigQueryParameter {
   return { method: configAxios?.method as MethodRnhrh, url: configAxios?.url, params: configAxios?.params } as ConfigQueryParameter;
}


async function traitementUseRequestAllConfiguration(
    configuration: Rh2EffectTreatmentUseRequestAllConfiguration,
    filter: boolean = true,
) {

	if (configuration.config != null) {
        
        const configAxios = configuration.config;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
			configuration.action({ loading: true, data: null });
			const reponse: ResponseFetchApi = await fetchApi(configuration.config, configuration.justeReponse == null || configuration.justeReponse === true);
			
			// Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
			if (configuration.addToDirectory) { // On ajoute à l'annuaire
				rh2DirectoryService.addConfigQueryParameter(configTmp);
			}

			if (reponse.isSuccess) {
				if (configuration.successHandler) {
					configuration.successHandler(reponse.responseSuccess);
				}
				
				configuration.action({ loading: false, data: reponse.responseSuccess });
			} else {
				if (configuration.errorHandler) {
					configuration.errorHandler(reponse);
				} else if (rh2ConfigService.getParameters().errorHandler) { // Si dans la config global on a défini un handler
					rh2ConfigService.getParameters().errorHandler(reponse);
				}
				configuration.action({ loading: false, data: null });
			}
		}
	}
}


/**
 * Execute a pre-load query
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 */
 export function useRequestFromName(// useRh2WithName
    label: string,
    filter: boolean = true, // Si on authorise le hook à s'executer
): void {
    const dispatch = useDispatch();
    useEffect(() => {
        async function fetch() {
            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            traitementUseRequest(
                {
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    addToDirectory:  configSelected?.addToDirectory,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: dispatch,
                },
                filter
            );
        }
        fetch();
    });
}

/**
 * Va cher executer une requête Http
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration des paramètres pour la requête Http
 * @param justeReponse true par défaut, va simplement retourner la réponse, si false, retourne le header, etc...
 * @param actionToDispatchSuplementaires
 */
export function useRequestFromParameter<Kind>( // useRh2WithParametersAndNeedDispatch -> nom à changer
    configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerRequired,
    filter: boolean = true
): void {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            traitementUseRequest(
                {
                    label: null,
                    config: configuration.config,
                    justeReponse: configuration.justeReponse,
                    addToDirectory:  false,
                    successHandler: configuration.successHandler,
                    errorHandler: configuration.errorHandler,
                    action: dispatch,
                },
                filter
            );
        }
        fetch();
    }, [rh2DirectoryService, filter]);
}


export async function traitementUseRequest(
    configuration: Rh2EffectTreatmentUseRequest,
    filter: boolean = true,
) {
    if (configuration.config != null) {
        
        const configAxios = configuration.config;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
            console.log('Le filtre est OK');
            configuration.action(chargementStartedAction(configuration.label));

            const reponse: ResponseFetchApi = await fetchApi(configuration.config, configuration.justeReponse == null || configuration.justeReponse === true);
            console.log('La réponse', reponse.isSuccess);
            if (reponse != null) {
                if (configuration.addToDirectory) { // On ajoute à l'annuaire
                    rh2DirectoryService.addConfigQueryParameter(configTmp);
                }

                if (reponse.isSuccess) {
                    treatmentIfSuccessInUseRequest(configuration, reponse);
                } else {
                    treatmentIfErrorInUseRequest(configuration, reponse);
                }
                configuration.action(chargementFinishedAction(configuration.label));
            }
        }
    }
}

function treatmentIfSuccessInUseRequest(configuration, reponse) {
    if (configuration.successHandler) {
        configuration.successHandler(reponse.responseSuccess);
    } else {
        isModeDebugThenDisplayWarn('La méthode successHandler n\'a pas été défini');
    }
}

function treatmentIfErrorInUseRequest(configuration, reponse) {
    if (configuration.errorHandler) {
        configuration.errorHandler(reponse);
    } else if (rh2ConfigService.getParameters().errorHandler) {
        rh2ConfigService.getParameters().errorHandler(reponse);
    }
    configuration.action(apiErrordAction(configuration.label, reponse));
}



/**
 * A utiliser s'il faut ajouter des paramètres à la requête
 * En mode PATH_PARAM, on peut concaténer avec les valeurs pré-saisies dans la config, cela ne fonctionne pas avec REQUEST_PARAM
 * 
 * Ce mode ne permet pas l'ajout en mémoire des requêtes
 * 
 * @param params Paramètre fourni ( Exemple : profileId -> situé dans la route (parametre navigation entre les pages)) 
 *              Les parametres données vont servir à extraire les parametres qui sont egalement present dans la navigation
 * @param typeQueryParameter Determine si on veut faire une requete avec des paramètres split par des / ou par des &
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration Axios des paramètres pour la requête Http
 * @param addToDirectory Doit on ajouter en mémoire la requête qui vient d'être executée
 * @param filter Filtre pour savoir si la requête doit être executer maintenant ou non
 * @param justeReponse S'il on veut seulement le contenu de la réponse ou toutes les infos
 * @param actionToDispatchSuplementaires Liste des actions en plus de "actionToDispatch"
 */
export function useFetchWithParamInRouteFromParameter(
    configuration: Rh2EffectWithParamInRouteFromParameter,
    filter: boolean = true,
) {
    const route = useRoute();
    if (configuration.config != null) {
        
        traitementUseFetch(
            {
                config: configuration.config,
                justeReponse: configuration.justeReponse,
                params: configuration.params,
                typeQueryParameter: configuration.typeQueryParameter,
                route,
                successHandler: configuration.successHandler,
                errorHandler: configuration.errorHandler,
            },
            filter
        )
    }
}

/**
 * Execute a pre-load query and add parameter provided by route navigation
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 */
export function useFetchWithParamInRouteFromName(// useRh2WithNameTakeParamsInRoute
    label: string,
    filter: boolean = true,
) {
    const route = useRoute();
    const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

    if (configSelected != null) {
        traitementUseFetch(
            {
                config: configSelected.axiosRequestConfig,
                justeReponse: configSelected.justeReponse,
                params: configSelected.dataFromRoute.params,
                typeQueryParameter: configSelected.dataFromRoute.typeQueryParameter,
                route,
                successHandler: configSelected.successHandler,
                errorHandler: configSelected.errorHandler,
            },
            filter
        )
    }
}

/**
 * 
 *  !!!!!!!!!!!!!!!! ONLY REACT NATIVE !!!!!!!!!!!!!!!!
 * 
 * @param params 
 * @param typeQueryParameter 
 * @param config 
 * @param justeReponse 
 * @param route 
 * @param successHandler Ce champ est obligatoire pour obtenir un résultat
 * @param errorHandler 
 * @param filter 
 */
async function traitementUseFetch(
    configuration: Rh2EffectTreatmentWithParamInRouteFromParameter,
    filter: boolean = true
) {

    const dataInRouteParam = getDataInRouteParam(configuration.params, configuration.route);

    if (configuration.route.params == null || dataInRouteParam == null) {
        isModeDebugThenDisplayWarn('Aucun paramètre dans la route ou récupéré dans la route');
        
        useRequestFromParameter(
            {
                config: configuration.config,
                successHandler: configuration.successHandler,
                justeReponse: configuration.justeReponse,
                errorHandler: configuration.errorHandler
            },
            filter
        );
    } else {
        let apiAvecParam = {
            ...configuration.config,
            url: configuration.config.url.endsWith('/') ? configuration.config.url.substring(0, configuration.config.url.length - 1) : configuration.config.url
        };

        if (configuration.typeQueryParameter === 'PATH_PARAM') {
            //    Chaque paramètre va etre precede d'un /
            let parametresConcatenes = Object.keys(dataInRouteParam).reduce((avant, maintenant) =>
                avant.concat('/').concat(dataInRouteParam[maintenant]), '');
            
            apiAvecParam = { ...apiAvecParam, url: apiAvecParam.url.concat(parametresConcatenes) };
        }

        if (configuration.typeQueryParameter === 'REQUEST_PARAM') {
            apiAvecParam = { ...apiAvecParam, params: dataInRouteParam };
        }

        useRequestFromParameter(
            {
                config: apiAvecParam,
                successHandler: configuration.successHandler,
                justeReponse: configuration.justeReponse,
                errorHandler: configuration.errorHandler
            },
            filter
        );
    }
}

/**
 * Récupèrer les paramètres dans l'url de navigation par rapport à ceux demandés en argument de la méthode
 * @param params Liste de clés à retrouver
 * @returns 
 */
export function getDataInRouteParam(params: string[], route: RouteProp<ParamListBase, string>) {
    let data = {};

    params.forEach((key) => {
        const param = route.params[key];
        if (param != null) {
            data[key] = param;
        }
    });
    isModeDebugThenDisplayInfo('Liste des params obtenu dans la route', data)
    return data;
}

function isModeDebugThenDisplayWarn(message: string): void {
    if (rh2ConfigService.isModeDebug) {
        console.warn(message);
    }
}

function isModeDebugThenDisplayInfo(message: string, data?: unknown): void {
    if (rh2ConfigService.isModeDebug) {
        console.info(message, data);
    }
}