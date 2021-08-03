import { ResponseFetchApi } from "../models";

export const CHARGEMENT_STARTED_ACTION = 'CHARGEMENT_STARTED_ACTION';
export const CHARGEMENT_FINISHED_ACTION = 'CHARGEMENT_FINISHED_ACTION';

export const API_ERROR_ACTION = 'API_ERROR_ACTION';
export const POUR_TEST_ACTION = 'POUR_TEST_ACTION'; // À des fins de test

export type TypeChargementAction = {type: string, label: string};
export type TypeActionPayload = {type: string, payload: string};
export type TypeErrordAction = {type: string, label: string, error: ResponseFetchApi};

export const chargementStartedAction = (label: string): TypeChargementAction => ({ type: CHARGEMENT_STARTED_ACTION,
    label });
export const chargementFinishedAction = (label: string): TypeChargementAction => ({ type: CHARGEMENT_FINISHED_ACTION,
    label });

export const apiErrordAction = (label: string, error: ResponseFetchApi): TypeErrordAction => ({ type: API_ERROR_ACTION,
    label,
    error });

export const pourTestAction = (param?: any): TypeActionPayload => {
    return { type: POUR_TEST_ACTION,
        payload: param };
}
