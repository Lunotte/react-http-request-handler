import { ConfigAxiosEtat, ConfigAxiosTrigger } from './../models/AxiosConfig';

/**
 *          DÉCLARATION DES ACTIONS
 * 
 */

// GESTION DES REQUÊTES À EXÉCUTER 

export const CHARGEMENT_STARTED_ACTION = 'CHARGEMENT_STARTED_ACTION';
export const CHARGEMENT_FINISHED_ACTION = 'CHARGEMENT_FINISHED_ACTION';

// export const CHARGER_CONFIG_ACTION = 'CHARGER_CONFIG_ACTION'; // Ajouter les infos d'une requête à executer "axiosconfig"
// export const DESACTIVER_CONFIG_ACTION = 'DESACTIVER_CONFIG_ACTION';
// export const UTILISER_CONFIG_ACTION = 'UTILISER_CONFIG_ACTION'; // Utiliser une config précédemment chargée

export const INIT_SETTINGS_ACTION = 'INIT_SETTINGS_ACTION'; // Utiliser une config précédemment chargée

export const POUR_TEST_ACTION = 'POUR_TEST_ACTION'; // Utiliser une config précédemment chargée

export const chargementStartedAction = (label: string) => ({ type: CHARGEMENT_STARTED_ACTION, label });
export const chargementFinishedAction = (label: string) => ({ type: CHARGEMENT_FINISHED_ACTION, label });

// export const chargerConfigAction = (configs: ConfigAxiosEtat[]) => {
//     return { type: CHARGER_CONFIG_ACTION, payload: configs };
// };

// export const desactiverConfigAction = (configCible: ConfigAxiosTrigger) => {
//     return { type: DESACTIVER_CONFIG_ACTION, payload: configCible };
// };

// export const utiliserConfigAction = (configCible: ConfigAxiosTrigger) => {
//     return { type: UTILISER_CONFIG_ACTION, payload: configCible };
// };

// export const initSettingsAction = (settings: SettingsInitializerRnhrh) => {
//     return { type: INIT_SETTINGS_ACTION, payload: settings };
// }

export const pourTestAction = (param: any) => {
    return { type: POUR_TEST_ACTION, payload: param };
}


