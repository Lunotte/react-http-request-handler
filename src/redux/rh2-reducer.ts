import { Rh2State } from '../models/Rh2State';
import { API_ERROR_ACTION, CHARGEMENT_FINISHED_ACTION, CHARGEMENT_STARTED_ACTION } from './rh2-action';

export const initialHookState: Rh2State = {
    globalConfig: {
        baseUrl: null
    },
    configs: [],
    queryInProgress: [],
    erreurApi: []
};

export default function hookReducer(state: Rh2State = initialHookState, action) {

    switch (action.type) {
    case CHARGEMENT_STARTED_ACTION:
        if (!state.queryInProgress.includes(action.label)) {
            return { ...state,
                queryInProgress: [
                    ...state.queryInProgress,
                    action.label
                ] }
        }
        return state;
    case CHARGEMENT_FINISHED_ACTION:
        return loadingFinished(state, action);
    case API_ERROR_ACTION:
        if (state.erreurApi.some(error => error.label === action.label)) {
            const erreurApi = state.erreurApi.filter(erreur => erreur.label !== action.label);
            return { ...state,
                erreurApi: [
                    ...erreurApi,
                    {label: action.label,
                        error: action.error}
                ] }
        } else {
            return { ...state,
                erreurApi: [
                    ...state.erreurApi,
                    {label: action.label,
                        error: action.error}
                ] }
        }
    default:
        return state;
    }
}

function loadingFinished(state: Rh2State, action) {
    if (state.queryInProgress.includes(action.label)) {
        const queries = state.queryInProgress.filter(query => query !== action.label);
        return { ...state,
            queryInProgress: queries }
    }
    return state;
}
