import { ResponseFetchApi } from "../models";

export const CHARGEMENT_STARTED_ACTION = 'CHARGEMENT_STARTED_ACTION';
export const CHARGEMENT_FINISHED_ACTION = 'CHARGEMENT_FINISHED_ACTION';

export const API_ERROR_ACTION = 'API_ERROR_ACTION';
export const POUR_TEST_ACTION = 'POUR_TEST_ACTION'; // À des fins de test

export const chargementStartedAction = (label: string) => ({ type: CHARGEMENT_STARTED_ACTION, label });
export const chargementFinishedAction = (label: string) => ({ type: CHARGEMENT_FINISHED_ACTION, label });

export const apiErrordAction = (label: string, error: ResponseFetchApi) => ({ type: API_ERROR_ACTION, label, error });

export const pourTestAction = (param?: any) => {
    return { type: POUR_TEST_ACTION, payload: param };
}
