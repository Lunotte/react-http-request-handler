import { ConfigAxios, ActionToDispatch } from './models/AxiosConfig';
import { ConfigQueryParameter, MethodRnhrh, TypeQueryParameter } from './models/QueryDirectory';
import { chargementFinishedAction, chargementStartedAction } from './redux/hook-action';
import { AxiosRequestConfig } from 'axios';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { fetchApi } from './services/ApiServiceFetch';
import { default as queryDirectoryService } from './services/QueryDirectoryService';
import { default as queryAxiosService } from './services/QueryAxiosService';




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
 export function useRequestWithoutDispatchFromParameter(config: AxiosRequestConfig, filter: boolean = true, justeReponse: boolean = true, codeAdditionel?: (param?: any) => void) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });
     
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            if (config && filter) {
                return traitementUseRequestWithoutDispatch(
                    dispatch,
                    config,
                    justeReponse,
                    false,
                    setState,
                    codeAdditionel
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
 * @param config 
 * @param justeReponse 
 * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
 * @return Si codeAdditionnel ? loading: boolean, data: resutat : loading: boolean, data: null
 */
 export function useRequestWithoutDispatchFromName(config: string, filter: boolean = true, codeAdditionel?: (param?: any) => void) {
    const [state, setState] = useState({
        loading: false,
        data: null,
    });
     
    const dispatch = useDispatch();
     
    useEffect(() => {
        async function fetch() {

            const configSelected = queryAxiosService.getConfigAxios(config);
            if (configSelected != null) {

                let configTmp: ConfigQueryParameter;
                const configAxios = configSelected.configAxiosEtat.axiosRequestConfig;
                configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };
                
                if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
                    return traitementUseRequestWithoutDispatch(
                        dispatch,
                        configAxios,
                        configSelected.justeReponse,
                        configSelected.configAxiosEtat.addToDirectory,
                        setState,
                        codeAdditionel,
                        configTmp
                    )
                }
            }
        }
        fetch();
    }, [config, filter]);

    return state;
}

async function traitementUseRequestWithoutDispatch(
    dispatch: Dispatch<any>,
    axiosRequestConfig: AxiosRequestConfig,
    justeReponse: boolean,
    addToDirectory: boolean,
    setState: Dispatch<React.SetStateAction<{
        loading: boolean;
        data: any;
    }>>,
    codeAdditionel?: (param?: any) => void,
    configTmp?: ConfigQueryParameter 
) {
    setState({ loading: true, data: null });
    const reponse = await fetchApi(axiosRequestConfig);

    if (addToDirectory) { // On ajoute à l'annuaire
        queryDirectoryService.addConfigQueryParameter(configTmp);
    }

    const resultat = justeReponse ? reponse.data : reponse;
    if (codeAdditionel) {
        codeAdditionel(resultat);
        setState({ loading: false, data: null });
    } else {
        setState({ loading: false, data: resultat });
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
            const configSelected: ConfigAxios = queryAxiosService.getConfigAxios(label);

            if (configSelected != null) {
                const configAxios = configSelected.configAxiosEtat.axiosRequestConfig;
                traitementUseRequest(
                    label,
                    configAxios,
                    configSelected.justeReponse,
                    configSelected.configAxiosEtat.addToDirectory,
                    configSelected.actionToDispatch,
                    configSelected.actionToDispatchSuplementaires,
                    dispatch,
                    filter
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
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    filter: boolean = true,
    justeReponse?: boolean,
    actionToDispatchSuplementaires?: ActionToDispatch[]
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
                    actionToDispatch,
                    actionToDispatchSuplementaires,
                    dispatch,
                    filter
                );
            }
        }
        fetch();
    }, [queryDirectoryService, filter]);
}

export async function traitementUseRequest(
    label: string,
    axiosRequestConfig: AxiosRequestConfig,
    justeReponse: boolean,
    addToDirectory: boolean,
    actionToDispatch: (reponse: any) => void,
    actionToDispatchSuplementaires: ActionToDispatch[],
    dispatch: Dispatch<any>,
    filter: boolean = true
) {

    let configTmp: ConfigQueryParameter;
    const configAxios = axiosRequestConfig;
    configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };

    if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
        dispatch(chargementStartedAction(label));

        const reponse = await fetchApi(axiosRequestConfig);
        
        if (addToDirectory) { // On ajoute à l'annuaire
            queryDirectoryService.addConfigQueryParameter(configTmp);
        }

        dispatch(actionToDispatch(justeReponse == null || justeReponse === true ? reponse.data : reponse));
        if (actionToDispatchSuplementaires != null && actionToDispatchSuplementaires.length > 0) {
            actionToDispatchSuplementaires.forEach((as) => dispatch(as));
        }
        dispatch(chargementFinishedAction(label));
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
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    filter: boolean = true,
    justeReponse?: boolean,
    actionToDispatchSuplementaires?: ActionToDispatch[]
) {
    const route = useRoute();
    if (config != null) {
        
        traitementUseFetch(
            params,
            typeQueryParameter,
            config,
            justeReponse,
            actionToDispatch,
            actionToDispatchSuplementaires,
            route,
            filter
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
    const configSelected: ConfigAxios = queryAxiosService.getConfigAxios(label);

    if (configSelected != null) {
        const configAxios = configSelected.configAxiosEtat.axiosRequestConfig;
        traitementUseFetch(
            configSelected.dataFromRoute.params,
            configSelected.dataFromRoute.typeQueryParameter,
            configAxios,
            configSelected.justeReponse,
            configSelected.actionToDispatch,
            configSelected.actionToDispatchSuplementaires,
            route,
            filter
        )
    }
}

async function traitementUseFetch(
    params: string[],
    typeQueryParameter: TypeQueryParameter,
    config: AxiosRequestConfig,
    justeReponse: boolean,
    actionToDispatch: (reponse: any) => void,
    actionToDispatchSuplementaires: ActionToDispatch[],
    route: RouteProp<ParamListBase, string>,
    filter: boolean = true
) {

    const dataInRouteParam = getDataInRouteParam(params, route);

    if (route.params == null || dataInRouteParam == null) {
        console.warn('Aucun paramètre dans la route ou récupéré dans la route');
        
        useRequestFromParameter(actionToDispatch, config, filter, justeReponse, actionToDispatchSuplementaires);
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

        useRequestFromParameter(actionToDispatch, apiAvecParam, filter, justeReponse, actionToDispatchSuplementaires);
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
