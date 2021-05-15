import { chargementFinishedAction, chargementStartedAction, dechargerConfigAction } from './redux/hook-action';
import { ConfigAxios } from './models/AxiosConfig';
import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { fetchApi } from './services/ApiServiceFetch';

let httpRequestManager: ConfigParamRequest[] = [];


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
    console.log('config', config);
    
    const dispatch = useDispatch();
    console.log('dispatch', dispatch);

    useEffect(() => {
        async function fetch() {
            console.log('fetch');
            if (config && config.actif) {
                const reponse = await fetchApi(config.axiosRequestConfig);
                console.log(reponse);
                
                if (reponse != null) {
                    dispatch(config.actionToDispatch(reponse.data));
                    dispatch(dechargerConfigAction(config.label));
                }
            }
        }
        fetch();
    }, [config]);

}

export function useRequestWithoutDispatch(config: AxiosRequestConfig, justeReponse: boolean = true) {
    const [state, setState] = useState({
        loading: true,
        data: null,
    });

    useEffect(() => {
        async function fetch() {
            if (config) {
                const reponse = await fetchApi(config);
                setState({ loading: false, data: justeReponse ? reponse.data : reponse });
            }
        }
        fetch();
    }, [config]);

    return state;
}

interface ConfigParamRequest {
    url: string;
    method: string;
    params: any;
}

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
) {
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetch() {
            // Checker la valeur de config permet 2 choses:
            // 1 : C'est un principe de base
            // 2 : Comme les conditions peuvent seulement être effectuées dans le effect ou de manière général dans le Hook le plus bas.
            //     Si la requête ne doit pas être envoyée directement quand l'utilisateur arrive sur sa page, ça nous permet d'attendre que la config
            //     soit ajoutée pour pouvoir effectuer la requête

            let configTmp: ConfigParamRequest;
            if (config != null) {
                configTmp = { method: config.method, url: config.url, params: config.params };
            }

            if (filter && !httpRequestManager.some((x) => x.url === configTmp.url && x.method === configTmp.method && x.params === configTmp.params)) {
                if (configTmp.url !== 'user/you') {
                    httpRequestManager.push(configTmp);
                }
                dispatch(chargementStartedAction());

                const reponse = await fetchApi(config);
                if (reponse != null) {
                    dispatch(actionToDispatch(justeReponse == null || justeReponse === true ? reponse.data : reponse));

                    if (actionSuplementaires != null && actionSuplementaires.length > 0) {
                        actionSuplementaires.forEach((as) => dispatch(as));
                    }

                    dispatch(chargementFinishedAction());
                }
            }
        }
        fetch();
    }, [httpRequestManager, filter]);
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
