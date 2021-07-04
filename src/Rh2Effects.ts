import { ConfigQueryParameter, MethodRnhrh, TypeQueryParameter } from './models/Rh2Directory';
import { apiErrordAction, chargementFinishedAction, chargementStartedAction } from './redux/rh2-action';
import { AxiosRequestConfig } from 'axios';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { fetchApi } from './services/FetchApiService';
import { default as rh2DirectoryService } from './services/Rh2DirectoryService';
import { default as rh2AxiosConfigService } from './services/Rh2AxiosConfigService';
import { default as rh2ConfigService } from './services/Rh2ConfigService';
import { Rh2AxiosConfig, ActionToDispatch } from '.';
import { ResponseFetchApi } from './models';

/*************************************************************************** */

//          Les requêtes qui ne sont pas pré-chargées n’auront pas
//          la possibilité d’être stockées dans l’annuaire

/*************************************************************************** */


/**
 * Faire une requete sans avoir à faire un dispatch post execution
 * Si codeAdditionel ALORS l'algo sera utilisé SINON on retourne la données sous la forme {loading: boolean, data: any}
 * 
 * @param config 
 * @param justeReponse 
 * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
 * @returns 
 */
export function useRequestWithoutDispatchFromParameter(config: AxiosRequestConfig, filter: boolean = true, justeReponse: boolean = true,
    codeAdditionel?: (param?: any) => void) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });
     
    useEffect(() => {
        async function fetch() {
            if (config && filter) {
                return traitementUseRequestAllConfiguration(
                    config,
                    justeReponse,
                    false,
                    setState,
                    null,
                    null,
                )
            }
        }
        fetch();
    }, [config?.method, config?.url, config?.data, filter]);

    return state;
}


/**
 * Faire une requete sans avoir à faire un dispatch post execution
 * Si codeAdditionel ALORS l'algo sera utilisé SINON on retourne la données sous la forme {loading: boolean, data: any}
 * 
 * @param label 
 * @param filter 
 * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
 * @return Si codeAdditionnel ? loading: boolean, data: resutat : loading: boolean, data: null
 */
 export function useRequestWithoutDispatchFromName<T>(label: string, filter: boolean = true, codeAdditionel?: (param?: T) => void) {
    const [state, setState] = useState({
        loading: false,
        data: null,
    });
     
    useEffect(() => {
        async function fetch() {

            const configSelected = rh2AxiosConfigService.getConfigAxios(label);
            if (configSelected != null) {

                let configTmp: ConfigQueryParameter;
                const configAxios = configSelected.axiosRequestConfig;
                configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };
                
                if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
                    return traitementUseRequestAllConfiguration(
                        configAxios,
                        configSelected.justeReponse,
                        configSelected.addToDirectory,
                        setState,
                        configSelected.successHandler,
                        configSelected.errorHandler,
                        configTmp
                    )
                }
            }
        }
        fetch();
    }, [label, filter]);

    return state;
}

// async function traitementUseRequestWithoutDispatch(
//     axiosRequestConfig: AxiosRequestConfig,
//     justeReponse: boolean,
//     addToDirectory: boolean,
//     setState: Dispatch<React.SetStateAction<{
//         loading: boolean;
//         data: any;
//     }>>,
//     codeAdditionel?: (param?: any) => void,
//     configTmp?: ConfigQueryParameter 
// ) {
//     setState({ loading: true, data: null });
//     const reponse: ResponseFetchApi = await fetchApi(axiosRequestConfig, justeReponse == null || justeReponse === true);

//     // Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
//     if (addToDirectory) { // On ajoute à l'annuaire
//         rh2DirectoryService.addConfigQueryParameter(configTmp);
//     }

//     if (reponse.isError && codeAdditionel) {
//         codeAdditionel(reponse);
//         setState({ loading: false, data: null });
//     } else {
//         setState({ loading: false, data: reponse });
//     }
// }



async function traitementUseRequestAllConfiguration(
    axiosRequestConfig: AxiosRequestConfig,
    justeReponse: boolean, // Si une erreur pour la requête alors ce param est ignoré
    addToDirectory: boolean,
    setState: Dispatch<React.SetStateAction<{
        loading: boolean;
        data: any;
    }>>, // valeur retournée dans tous les cas
    successHandler?: (param?: any) => void, // Si param defaut alors la réponse est utilisée
    errorHandler?: (param?: any) => void,// Si param defaut alors la réponse est utilisée
    configTmp?: ConfigQueryParameter 
) {
    setState({ loading: true, data: null });
    const reponse: ResponseFetchApi = await fetchApi(axiosRequestConfig, justeReponse == null || justeReponse === true);
    
    // Si mode annuaire demandé, et que la requete est en echec, celle-ci est tout de meme ajouté à l'annaire
    if (addToDirectory) { // On ajoute à l'annuaire
        rh2DirectoryService.addConfigQueryParameter(configTmp);
    }

    if (reponse.isSuccess) {
        if (successHandler) {
            successHandler(reponse.responseSuccess);
        }
        setState({ loading: false, data: reponse.responseSuccess });
    } else {
        if (errorHandler) {
            errorHandler(reponse);
        } else if (rh2ConfigService.getParameters().errorHandler) {
            rh2ConfigService.getParameters().errorHandler(reponse);
        }
        setState({ loading: false, data: null });
    }
}


/**
 * Execute a pre-load query
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 */
 export function useRequestFromName(
    label: string,
    filter: boolean = true, // Si on authorise le hook à s'executer
): void {
    const dispatch = useDispatch();
     
    useEffect(() => {
        async function fetch() {
            const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

            if (configSelected != null) {
                traitementUseRequest(
                    label,
                    configSelected.axiosRequestConfig,
                    configSelected.justeReponse,
                    configSelected.addToDirectory,
                    dispatch,
                    configSelected.successHandler,
                    filter,
                    configSelected.errorHandler,
                );
            }
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
export function useRequestFromParameter<Kind>(
    config: AxiosRequestConfig,
    successHandler: (param?: any) => void, // Si param defaut alors la réponse est utilisée
    justeReponse?: boolean,
    filter: boolean = true,
    errorHandler?: (param?: any) => void,// Si param defaut alors la réponse est utilisée
): void {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            if (config != null) {
                traitementUseRequest(
                    null,
                    config,
                    justeReponse,
                    false,
                    dispatch,
                    successHandler,
                    filter,
                    errorHandler
                );
            }
        }
        fetch();
    }, [rh2DirectoryService, filter]);
}

// export async function traitementUseRequest(
//     label: string,
//     axiosRequestConfig: AxiosRequestConfig,
//     justeReponse: boolean,
//     addToDirectory: boolean,
//     actionToDispatch: (reponse: any) => void,
//     actionToDispatchSuplementaires: ActionToDispatch[],
//     dispatch: Dispatch<any>,
//     filter: boolean = true
// ) {

//     let configTmp: ConfigQueryParameter;
//     const configAxios = axiosRequestConfig;
//     configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };

//     if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
//         dispatch(chargementStartedAction(label));

//         const reponse: ResponseFetchApi = await fetchApi(axiosRequestConfig, justeReponse == null || justeReponse === true);
        
//         if (reponse != null) {
//             if (addToDirectory) { // On ajoute à l'annuaire
//                 rh2DirectoryService.addConfigQueryParameter(configTmp);
//             }

//             if(reponse.isSuccess) {
//                 dispatch(actionToDispatch(reponse.responseSuccess));
//                 if (actionToDispatchSuplementaires != null && actionToDispatchSuplementaires.length > 0) {
//                     actionToDispatchSuplementaires.forEach((as) => dispatch(as));
//                 }
//                 dispatch(chargementFinishedAction(label));
//             } else {
//                 dispatch(apiErrordAction(label, reponse.responseErreur));
//             }
//         }
//     }
// }




export async function traitementUseRequest(
    label: string,
    axiosRequestConfig: AxiosRequestConfig,
    justeReponse: boolean,
    addToDirectory: boolean,
    dispatch: Dispatch<any>,
    successHandler: (param?: any) => void, // Si param defaut alors la réponse est utilisée
    filter: boolean = true,
    errorHandler?: (param?: any) => void,// Si param defaut alors la réponse est utilisée
) {

    let configTmp: ConfigQueryParameter;
    const configAxios = axiosRequestConfig;
    configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };

    if (filter && !rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
        dispatch(chargementStartedAction(label));

        const reponse: ResponseFetchApi = await fetchApi(axiosRequestConfig, justeReponse == null || justeReponse === true);
        
        if (reponse != null) {
            if (addToDirectory) { // On ajoute à l'annuaire
                rh2DirectoryService.addConfigQueryParameter(configTmp);
            }

            if(reponse.isSuccess) {
                if (successHandler) {
                    successHandler(reponse.responseSuccess);
                } else {
                    if (rh2ConfigService.isModeDebug) {
                        console.warn('La méthode successHandler n\'a pas été défini');
                    }
                }
            } else {
                if (errorHandler) {
                    errorHandler(reponse);
                } else if (rh2ConfigService.getParameters().errorHandler) {
                    rh2ConfigService.getParameters().errorHandler(reponse);
                }
                dispatch(apiErrordAction(label, reponse));
            }
            dispatch(chargementFinishedAction(label));
        }
    }
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
export function useFetchWithParamInRouteFromParameter<Kind>(
    params: string[],
    typeQueryParameter: TypeQueryParameter,
    config: AxiosRequestConfig,
    successHandler: (param?: any) => void,
    filter: boolean = true,
    justeReponse?: boolean,
    errorHandler?: (param?: any) => void,
) {
    const route = useRoute();
    if (config != null) {
        
        traitementUseFetch(
            params,
            typeQueryParameter,
            config,
            justeReponse,
            route,
            successHandler,
            filter,
            errorHandler
        )
    }
}

/**
 * Execute a pre-load query and add parameter provided by route navigation
 * @param label Name of the query to execute
 * @param filter If True, execute the request
 */
export function useFetchWithParamInRouteFromName(
    label: string,
    filter: boolean = true,
) {
    const route = useRoute();
    const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(label);

    if (configSelected != null) {
        const configAxios = configSelected.axiosRequestConfig;
        traitementUseFetch(
            configSelected.dataFromRoute.params,
            configSelected.dataFromRoute.typeQueryParameter,
            configAxios,
            configSelected.justeReponse,
            route,
            configSelected.successHandler,
            filter,
            configSelected.errorHandler
        )
    }
}

/**
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
    params: string[],
    typeQueryParameter: TypeQueryParameter,
    config: AxiosRequestConfig,
    justeReponse: boolean,
    route: RouteProp<ParamListBase, string>,
    successHandler: (param?: any) => void,
    filter: boolean = true,
    errorHandler?: (param?: any) => void
) {

    const dataInRouteParam = getDataInRouteParam(params, route);

    if (route.params == null || dataInRouteParam == null) {
        console.warn('Aucun paramètre dans la route ou récupéré dans la route');
        
        useRequestFromParameter(config, successHandler, justeReponse, filter, errorHandler);
    } else {
        let apiAvecParam = { ...config, url: config.url.endsWith('/') ? config.url.substring(0, config.url.length - 1) : config.url };

        if (typeQueryParameter === 'PATH_PARAM') {
            //    Chaque paramètre va etre precede d'un /
            let parametresConcatenes = Object.keys(dataInRouteParam).reduce((avant, maintenant) =>
                avant.concat('/').concat(dataInRouteParam[maintenant]), '');
            
            apiAvecParam = { ...apiAvecParam, url: apiAvecParam.url.concat(parametresConcatenes) };
        }

        if (typeQueryParameter === 'REQUEST_PARAM') {
            apiAvecParam = { ...apiAvecParam, params: dataInRouteParam };
        }

        useRequestFromParameter(apiAvecParam, successHandler, justeReponse, filter, errorHandler);
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
    return data;
}
