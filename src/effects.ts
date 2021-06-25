import { ConfigAxios, ActionToDispatch } from './models/AxiosConfig';
import { ConfigQueryParameter, MethodRnhrh, TypeQueryParameter } from './models/QueryDirectory';
import { chargementFinishedAction, chargementStartedAction } from './redux/hook-action';
import { AxiosRequestConfig } from 'axios';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
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
 export function useRequestWithoutDispatch(config: AxiosRequestConfig, justeReponse: boolean = true, codeAdditionel?: (param?: any) => void) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {
            if (config) {
                const reponse = await fetchApi(config);
                const retour = justeReponse ? reponse.data : reponse;
                if (codeAdditionel) {
                    codeAdditionel(retour);
                } else {
                    setState({ loading: false, data: retour });
                }
            }
        }
        fetch();
    }, [config?.method, config?.url, config?.data]);

    return state;
}


/**
 * Faire une requete sans avoir à faire un dispatch post execution
 * Si codeAdditionel ALORS l'algo sera utilisé SINON on retourne la données sous la forme {loading: boolean, data: any}
 * 
 * @param config 
 * @param justeReponse 
 * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
 * @return loading: boolean, data: any
 */
 export function useRequestWithoutDispatch2(config: string, codeAdditionel?: (param?: any) => void) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {

            const configSelected = queryAxiosService.getConfigAxios(config);

            if (configSelected != null) {
                const reponse = await fetchApi(configSelected.configAxiosEtat.axiosRequestConfig);
                const retour = configSelected.justeReponse ? reponse.data : reponse;
                if (codeAdditionel) {
                    codeAdditionel(retour);
                } else {
                    setState({ loading: false, data: retour });
                }
            }
        }
        fetch();
    }, [config]);

    return state;
}

/**
 * Va executer une requête Http
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration des paramètres pour la requête Http
 * @param justeReponse true par défaut, va simplement retourner la réponse, si false, retourne le header, etc...
 * @param actionSuplementaires
 */
 export function useRequest2(
    config: string,
    filter: boolean = true, // Si on authorise le hook à s'executer
): void {
    const dispatch = useDispatch();
     
    useEffect(() => {
        async function fetch() {

            // Checker la valeur de config permet 2 choses:
            // 1 : C'est un principe de base
            // 2 : Comme les conditions peuvent seulement être effectuées dans le effect ou de manière général dans le Hook le plus bas.
            //     Si la requête ne doit pas être envoyée directement quand l'utilisateur arrive sur sa page, ça nous permet d'attendre que la config
            //     soit ajoutée pour pouvoir effectuer la requête

            const configSelected: ConfigAxios = queryAxiosService.getConfigAxios(config);
            // let configTmp: ConfigQueryParameter;
            // if (configSelected != null) {
            //     const configAxios = configSelected.configAxiosEtat.axiosRequestConfig;
            //     configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };
            // }

            // if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
              
            //     dispatch(chargementStartedAction());

            //     const reponse = await fetchApi(configSelected.configAxiosEtat.axiosRequestConfig);
            //     console.log(reponse);
                
            //     if (configSelected.configAxiosEtat.addToDirectory) { // On ajoute à l'annuaire
            //         queryDirectoryService.addConfigQueryParameter(configTmp);
            //     }

            //     dispatch(configSelected.actionToDispatch(configSelected.justeReponse == null || configSelected.justeReponse === true ? reponse.data : reponse));

            //     if (configSelected.actionToDispatchSuplementaires != null && configSelected.actionToDispatchSuplementaires.length > 0) {
            //         configSelected.actionToDispatchSuplementaires.forEach((as) => dispatch(as));
            //     }

            //     dispatch(chargementFinishedAction());
            // }

            if (configSelected != null) {
                const configAxios = configSelected.configAxiosEtat.axiosRequestConfig;
                traitementUseRequest(
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


async function traitementUseRequest(
    axiosRequestConfig: AxiosRequestConfig,
    justeReponse: boolean,
    addToDirectory: boolean,
    actionToDispatch: (reponse: any) => void,
    actionToDispatchSuplementaires: ActionToDispatch[],
    dispatch: Dispatch<any>,
    filter: boolean = true) {

    let configTmp: ConfigQueryParameter;
    const configAxios = axiosRequestConfig;
    configTmp = { method: configAxios.method as MethodRnhrh, url: configAxios.url, params: configAxios.params };

    if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
        
        dispatch(chargementStartedAction());

        const reponse = await fetchApi(axiosRequestConfig);
        console.log(reponse);
        
        if (addToDirectory) { // On ajoute à l'annuaire
            queryDirectoryService.addConfigQueryParameter(configTmp);
        }

        dispatch(actionToDispatch(justeReponse == null || justeReponse === true ? reponse.data : reponse));

        if (actionToDispatchSuplementaires != null && actionToDispatchSuplementaires.length > 0) {
            actionToDispatchSuplementaires.forEach((as) => dispatch(as));
        }

        dispatch(chargementFinishedAction());
    }
}


/**
 * Va cher executer une requête Http
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration des paramètres pour la requête Http
 * @param justeReponse true par défaut, va simplement retourner la réponse, si false, retourne le header, etc...
 * @param actionToDispatchSuplementaires
 */
export function useRequest<Kind>(
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    filter: boolean = true,
    justeReponse?: boolean,
    actionToDispatchSuplementaires?: ActionToDispatch[]
): void {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            // Checker la valeur de config permet 2 choses:
            // 1 : C'est un principe de base
            // 2 : Comme les conditions peuvent seulement être effectuées dans le effect ou de manière général dans le Hook le plus bas.
            //     Si la requête ne doit pas être envoyée directement quand l'utilisateur arrive sur sa page, ça nous permet d'attendre que la config
            //     soit ajoutée pour pouvoir effectuer la requête

            // let configTmp: ConfigQueryParameter;
            // if (config != null) {
            //     configTmp = { method: config.method as MethodRnhrh, url: config.url, params: config.params };
            // }

            // if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
            //     if (configTmp.url !== 'user/you') {
            //         queryDirectoryService.addConfigQueryParameter(configTmp);
            //     }
            //     dispatch(chargementStartedAction());

            //     const reponse = await fetchApi(config);
            //     console.log(reponse);

            //     dispatch(actionToDispatch(justeReponse == null || justeReponse === true ? reponse.data : reponse));

            //     if (actionSuplementaires != null && actionSuplementaires.length > 0) {
            //         actionSuplementaires.forEach((as) => dispatch(as));
            //     }

            //     dispatch(chargementFinishedAction());
            // }

            if (config != null) {
                traitementUseRequest(
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

/**
 * A utiliser s'il faut ajouter des paramètres à la requête
 * En mode PATH_PARAM, on peut concaténer avec les valeurs pré-saisies dans la config, cela ne fonctionne pas avec REQUEST_PARAM
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
export function useFetchAvecOuSansParametre<Kind>(
    params: string[],
    typeQueryParameter: TypeQueryParameter,
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    addToDirectory: boolean,
    filter: boolean = true,
    justeReponse?: boolean,
    actionToDispatchSuplementaires?: ActionToDispatch[]
) {
    const route = useRoute();
    const dataInRouteParam = getDataInRouteParam(params);

    if (route.params == null || dataInRouteParam == null) {
        useRequest<Kind>(actionToDispatch, config, filter, justeReponse, actionToDispatchSuplementaires);
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

        useRequest<Kind>(actionToDispatch, apiAvecParam, filter, justeReponse, actionToDispatchSuplementaires);
    }
}

/**
 * Récupèrer les paramètres dans l'url de navigation par rapport à ceux demandés en argument de la méthode
 * @param params Liste de clés à retrouver
 * @returns 
 */
export function getDataInRouteParam(params: string[]) {
    const route = useRoute();
    let data = {};

    params.forEach((key) => {
        const param = route.params[key];
        if (param != null) {
            console.log(param);
            data[key] = param;
        }
    });
    return data;
}
