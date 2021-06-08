import { ConfigQueryParameter, MethodRnhrh } from './models/QueryDirectory';
import { RootState } from './redux/hook-store';
import { chargementFinishedAction, chargementStartedAction, desactiverConfigAction, chargerConfigAction } from './redux/hook-action';
import { ConfigAxios, ConfigAxiosEtat } from './models/AxiosConfig';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { fetchApi } from './services/ApiServiceFetch';
import { default as queryDirectoryService } from './services/QueryDirectoryService';

//let httpRequestManager: ConfigParamRequest[] = [];


//
//  @TODO
// Il pourrait être interessant de fusionner "useRequestWithConfigAxios" avec "useRequest"
//
// Idee: Lister les requetes possible dans un annuaire ( comme pour useRequestWithConfigAxios )
// Bénéfice ??? On aura les requetes listées dans le state et on pourra toujours gérer le cache + amélioration du systeme de filtre
// qui sera basé sur les actif (comme pour useRequestWithConfigAxios)
// 

/**
 * Ce hook permet d'appeler une requete que l'on voudrait declencher plusieurs fois
 * Ceci n'utilise pas de cache
 * @param config Information concernant la requête à executer
 */
 export function useRequestWithConfigAxios(config: ConfigAxios) {
    console.log('Dans useRequestWithConfigAxios ----->>>> config', config);
    
    const dispatch = useDispatch();
    console.log('dispatch', dispatch);

    const configSelecteur = useSelector((state: RootState) => state.lib.configs.find((con: ConfigAxiosEtat) => con.label === config.configAxiosEtat.label));

    useEffect(() => {
        async function fetch() {
            console.log('fetch');
            if (configSelecteur && configSelecteur.actif) {
                const reponse = await fetchApi(config.configAxiosEtat.axiosRequestConfig);
                console.log(reponse);
                
                if (reponse != null) {
                    if (config.actionToDispatch) {
                        dispatch(config.actionToDispatch(reponse.data));
                    }
                    dispatch(desactiverConfigAction(config.configAxiosEtat.label));
                }
            }
        }
        fetch();
    }, [config, configSelecteur]);
}


/**
 * Charger la configuration des requêtes qui seront executées
 * @param configs 
 */
export function useToLoadConfig(configs: ConfigAxios[]) {
    console.log('Dans useToLoadConfig ====>>>> configs', configs);
    
    const dispatch = useDispatch();
    dispatch(chargerConfigAction(configs.map(config => config.configAxiosEtat)));

    configs.forEach(config => {
        useRequestWithConfigAxios(config);
    })
}



// /**
//  * Faire une requete sans avoir à faire une action post execution
//  * @param config 
//  * @param justeReponse 
//  * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
//  * @returns 
//  */
//  export function useRequestWithoutDispatch(config: AxiosRequestConfig, justeReponse: boolean = true, codeAdditionel?: (param?: any) => void) {
//     const [state, setState] = useState({
//         loading: true,
//         data: null,
//     });

//     useEffect(() => {
//         async function fetch() {
//             if (config) {
//                 const reponse = await fetchApi(config);
//                 const retour = justeReponse ? reponse.data : reponse;
//                 if (codeAdditionel) {
//                     codeAdditionel(retour);
//                 } else {
//                     setState({ loading: false, data: retour});
//                 }
//             }
//         }
//         fetch();
//     }, [config?.method, config?.url, config?.data]);

//     return state;
// }


/**
 * Faire une requete sans avoir à faire une action post execution
 * @param config 
 * @param justeReponse 
 * @param codeAdditionel Peut posseder un param qui sera le resultat de la requete
 * @returns 
 */
 export function useRequestWithoutDispatch2(configLabel: string, justeReponse: boolean = true, codeAdditionel?: (param?: any) => void, postData?: any) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });
     
    const configSelecteur: ConfigAxiosEtat = useSelector((state: RootState) => state.lib.configs.find((con: ConfigAxiosEtat) => con.label === configLabel));
    console.log('configSelecteur', configSelecteur);
     
    let axiosRequest = configSelecteur?.axiosRequestConfig;
     
    if (postData) {
        axiosRequest = { ...axiosRequest, data: postData};
    }
    console.log('axiosRequest2', axiosRequest);

    useEffect(() => {
        async function fetch() {
            if (configSelecteur) {
                console.log('configSelecteur', configSelecteur);
                
                const reponse = await fetchApi(axiosRequest);
                const retour = justeReponse ? reponse.data : reponse;
                if (codeAdditionel) {
                    codeAdditionel(retour);
                } else {
                    setState({ loading: false, data: retour});
                }
            }
        }
        fetch();
    }, [axiosRequest?.method, axiosRequest?.url, axiosRequest?.data]);

    return state;
}

// interface ConfigParamRequest {
//     url: string;
//     method: string;
//     params: any;
// }

/**
 * Va cher executer une requête Http
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration des paramètres pour la requête Http
 * @param justeReponse true par défaut, va simplement retourner la réponse, si false, retourne le header, etc...
 * @param actionSuplementaires
 */
export function useRequest<Kind>(
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    filter: boolean = true,
    justeReponse?: boolean,
    actionSuplementaires?: { type: string; payload?: any }[]
): void {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            // Checker la valeur de config permet 2 choses:
            // 1 : C'est un principe de base
            // 2 : Comme les conditions peuvent seulement être effectuées dans le effect ou de manière général dans le Hook le plus bas.
            //     Si la requête ne doit pas être envoyée directement quand l'utilisateur arrive sur sa page, ça nous permet d'attendre que la config
            //     soit ajoutée pour pouvoir effectuer la requête

            let configTmp: ConfigQueryParameter;
            if (config != null) {
                configTmp = { method: config.method as MethodRnhrh, url: config.url, params: config.params };
            }

            if (filter && !queryDirectoryService.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
                if (configTmp.url !== 'user/you') {
                    queryDirectoryService.addConfigQueryParameter(configTmp);
                }
                dispatch(chargementStartedAction());

                const reponse = await fetchApi(config);
                console.log(reponse);
                
                dispatch(actionToDispatch(justeReponse == null || justeReponse === true ? reponse.data : reponse));

                if (actionSuplementaires != null && actionSuplementaires.length > 0) {
                    actionSuplementaires.forEach((as) => dispatch(as));
                }

                dispatch(chargementFinishedAction());
            }
        }
        fetch();
    }, [queryDirectoryService, filter]);
}

/**
 * A utiliser s'il faut ajouter des paramètres à la requête
 * @param param Paramètre fourni ( Exemple : profileId -> situé dans la route (navigation page du mobile) )  --->>> PATH PARAM <<---
 * @param actionToDispatch Action principal à dispatch lorsque la requête a été faite
 * @param config Configuration des paramètres pour la requête Http
 * @param filter Filtre pour savoir si la requ^^ete doit être executer maintenant ou non
 */
export function useFetchAvecOuSansParametre<Kind>(
    params: string[],
    actionToDispatch: (reponse: Kind) => void,
    config: AxiosRequestConfig,
    filter: boolean = true,
    justeReponse?: boolean,
    actionSuplementaires?: { type: string; payload?: any }[]
) {
    const route = useRoute();

    if (route.params == null || getObjectInRouteParam(params) == null) {
        useRequest<Kind>(actionToDispatch, config, filter, justeReponse, actionSuplementaires);
    } else {
        const apiAvecParam = { ...config };
        apiAvecParam.url = config.url.concat('/').concat(getObjectInRouteParam(params));

        useRequest<Kind>(actionToDispatch, apiAvecParam, filter, justeReponse, actionSuplementaires);
    }
}

// @TODO retourner key/value 
// Dans useFetchAvecOuSansParametre prendre en param la clé a rechercher comme actuellement
// Si dans la requette http on aura besoin d'ajouter un autre param en get,
// il faudra ajouter une propriete qui prendra en param la key/value 
// Ensuite on pourra mapper les bonne valeur d'après les clés pour construire l'url
export function getObjectInRouteParam(params: string[]) {
    const route = useRoute();
    let data = null;
    params.forEach((v) => {
        if (data == null) {
            data = route.params[v];
        } else {
            data = data[v];
        }
    });
    return data;
}
