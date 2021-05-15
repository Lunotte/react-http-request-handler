import { AXIOS_CONFIG_JOUR_SEMAINE } from './../query';
import { ConfigAxiosTrigger } from './../models/AxiosConfig';
import { ConfigAxios } from '../models/AxiosConfig';

/**
 *          DÉCLARATION DES ACTIONS
 * 
 */

// GESTION DES REQUÊTES À EXÉCUTER 

export const CHARGEMENT_STARTED_ACTION = 'CHARGEMENT_STARTED_ACTION';
export const CHARGEMENT_FINISHED_ACTION = 'CHARGEMENT_FINISHED_ACTION';

export const CHARGER_CONFIG_ACTION = 'CHARGER_CONFIG_ACTION'; // Ajouter les infos d'une requête à executer "axiosconfig"
export const DECHARGER_CONFIG_ACTION = 'DECHARGER_CONFIG_ACTION';
export const UTILISER_CONFIG_ACTION = 'UTILISER_CONFIG_ACTION'; // Utiliser une config précédemment chargée

export const chargementStartedAction = () => ({ type: CHARGEMENT_STARTED_ACTION });
export const chargementFinishedAction = () => ({ type: CHARGEMENT_FINISHED_ACTION });

export const chargerConfigAction = (configs: ConfigAxios[]) => {
    return { type: CHARGER_CONFIG_ACTION, payload: configs };
};

export const dechargerConfigAction = (configCible: ConfigAxiosTrigger) => {
    return { type: DECHARGER_CONFIG_ACTION, payload: configCible };
};

export const utiliserConfigAction = () => {
    return { type: UTILISER_CONFIG_ACTION, payload: AXIOS_CONFIG_JOUR_SEMAINE };
};
