import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Rh2AxiosConfig } from '..';
import { ResponseFetchApi } from '../models';
import { ConfigQueryParameter, MethodRnhrh } from '../models/Rh2Directory';
import { apiErrordAction, chargementFinishedAction, chargementStartedAction } from '../redux/rh2-action';
import { Rh2EffectSuccessNotRequiredHandler, Rh2EffectTakeParamsInRoute, Rh2EffectTreatmentToManageParameters, Rh2EffectTreatmentToManageRequest } from './../models/Rh2Effect';
import { fetchApi } from './FetchApiService';
import { default as rh2AxiosConfigService } from './Rh2AxiosConfigService';
import { default as rh2ConfigService } from './Rh2ConfigService';
import { default as rh2DirectoryService } from './Rh2DirectoryService';

/*************************************************************************** */

//          Les requêtes qui ne sont pas pré-chargées n’auront pas
//          la possibilité d’être stockées dans l’annuaire

/*************************************************************************** */


/**
 * Get data from configuration
 * 
 * @param configuration Request to execute
 * @param filter If true, trigger the request
 * @returns 
 */
export function useRh2WithParameters(
    configuration: Rh2EffectSuccessNotRequiredHandler,
    filter: boolean = true
): {
    loading: boolean;
    data: any;
} {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            return traitementToManageRequest(
                { ...configuration, action: setState, addToDirectory: false, dispatch, label: null }
            )
        }
        fetch();
    }, [configuration.config?.method, configuration.config?.url, configuration.config?.data, filter]);

    return state;
}


/**
 * Get data from label
 * 
 * @param label Name of the request pre loaded
 * @param filter If true, trigger the request
 * @returns 
 */
export function useRh2WithName(
    label: string,
    filter: boolean = true
): {
    loading: boolean;
    data: any;
} {
    const [state, setState] = useState({
        loading: false,
        data: null,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {

            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            return traitementToManageRequest(
                {
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    dispatch,
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

async function traitementToManageRequest(
    configuration: Rh2EffectTreatmentToManageRequest,
    filter: boolean = true,
) {
    if (configuration.config != null) {

        const configAxios = configuration.config;
        const configTmp = configToManageDirectory(configAxios);

        if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {

            configuration.action({ loading: true, data: null });
            loadingStartedDispatch(configuration);
            const reponse: ResponseFetchApi = await fetchApi(configuration.config, configuration.justeReponse == null || configuration.justeReponse === true);

            // Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
            if (configuration.addToDirectory) { // On ajoute à l'annuaire
                rh2DirectoryService.addConfigQueryParameter(configTmp);
            }

            if (reponse.isSuccess) {
                treatmentIfSuccessInUseRequest(configuration, reponse);
            } else {
                treatmentIfErrorInUseRequest(configuration, reponse);
            }

            loadingCompletedDispatch(configuration);
        }
    }
}

// @TODO On pourrait dipatch une action dans tous les cas; faire un hash de l'url, param et type que l'on ajouterait à la place du label en tant que clé unique
function loadingStartedDispatch(configuration: Rh2EffectTreatmentToManageRequest) {
    if (configuration.label) {
        configuration.dispatch(chargementStartedAction(configuration.label));
    }
}
// @TODO On pourrait dipatch une action dans tous les cas; faire un hash de l'url, param et type que l'on ajouterait à la place du label en tant que clé unique
function loadingCompletedDispatch(configuration: Rh2EffectTreatmentToManageRequest) {
    if (configuration.label) {
        configuration.dispatch(chargementFinishedAction(configuration.label));
    }
}


function treatmentIfSuccessInUseRequest(configuration, reponse) {
    if (configuration.successHandler) {
        configuration.successHandler(reponse.responseSuccess);
    } else {
        isModeDebugThenDisplayWarn('La méthode successHandler n\'a pas été défini');
    }
    configuration.action({ loading: false, data: reponse.responseSuccess });
}

function treatmentIfErrorInUseRequest(configuration, reponse) {
    if (configuration.errorHandler) {
        configuration.errorHandler(reponse);
    } else if (rh2ConfigService.getParameters().errorHandler) {
        rh2ConfigService.getParameters().errorHandler(reponse);
    } else {
        isModeDebugThenDisplayWarn('La méthode errorHandler n\'a pas été défini');
    }
    configuration.action({ loading: false, data: null });
    configuration.dispatch(apiErrordAction(configuration.label, reponse));
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
export function useRh2WithParametersTakeParamsInRoute(
    configuration: Rh2EffectTakeParamsInRoute,
    filter: boolean = true,
) {
    const route = useRoute();
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            traitementToManageParameters(
                {
                    label: null,
                    config: configuration.config,
                    justeReponse: configuration.justeReponse,
                    params: configuration.params,
                    typeQueryParameter: configuration.typeQueryParameter,
                    route,
                    successHandler: configuration.successHandler,
                    errorHandler: configuration.errorHandler,
                    action: setState,
                    dispatch
                },
                filter
            )
        }
        fetch();
    }, [configuration.config?.method, configuration.config?.url, configuration.config?.data, filter]);
    return state;
}

/**
 * 
 * Execute a pre-load query and add parameter provided by route navigation
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 */
export function useRh2WithNameTakeParamsInRoute(
    label: string,
    filter: boolean = true,
) {
    const route = useRoute();

    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            return traitementToManageParameters(
                {
                    label,
                    config: configSelected?.axiosRequestConfig,
                    justeReponse: configSelected?.justeReponse,
                    params: configSelected?.dataFromRoute.params,
                    typeQueryParameter: configSelected?.dataFromRoute.typeQueryParameter,
                    route,
                    successHandler: configSelected?.successHandler,
                    errorHandler: configSelected?.errorHandler,
                    action: setState,
                    dispatch
                },
                filter
            )
        }
        fetch();
    }, [label, filter]);
    return state;
}

/**
 * 
 * @param configuration 
 * @param filter 
 */
async function traitementToManageParameters(
    configuration: Rh2EffectTreatmentToManageParameters,
    filter: boolean = true
) {
    if (configuration.config != null) {
        const dataInRouteParam = getDataInRouteParam(configuration.params, configuration.route);

        if (configuration.route.params == null || dataInRouteParam == null) {
            isModeDebugThenDisplayWarn('Aucun paramètre dans la route ou récupéré dans la route');

            traitementToManageRequest(
                { ...configuration, addToDirectory: false, label: null },
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
                //    Chaque paramètre va etre precede d'un /
                let parametresConcatenes = Object.keys(dataInRouteParam).reduce((avant, maintenant) =>
                    avant.concat('/').concat(dataInRouteParam[maintenant]), '');

                apiAvecParam = { ...apiAvecParam, url: apiAvecParam.url.concat(parametresConcatenes) };
            }

            if (configuration.typeQueryParameter === 'REQUEST_PARAM') {
                apiAvecParam = { ...apiAvecParam, params: dataInRouteParam };
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
 * Récupèrer les paramètres dans l'url de navigation par rapport à ceux demandés en argument de la méthode
 * @param params Liste de clés à retrouver
 * @param route Hook useRoute seulement disponible pour la version native
 * @returns La liste des éléments retrouvés
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
    return Object.keys(data).length === 0 ? null : data;
}

function isModeDebugThenDisplayWarn(message: string): void {
    if (rh2ConfigService.isModeDebug()) {
        console.warn(message);
    }
}

function isModeDebugThenDisplayInfo(message: string, data?: unknown): void {
    if (rh2ConfigService.isModeDebug()) {
        console.info(message, data);
    }
}