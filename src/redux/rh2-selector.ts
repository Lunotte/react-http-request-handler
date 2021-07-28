import { useSelector } from "react-redux";
import { createSelector } from 'reselect';
import { Rh2State, Rh2StateErreurApi } from '../models/Rh2State';

const selectErreurs = (state: Rh2State) => state.erreurApi;

const selectErreur = (state: Rh2State, label: string) => 
    state.erreurApi.find(erreur => erreur.label === label);


// const selectErreurLabel = (state: Rh2State, erreurLabel: string) => erreurLabel;

// export function selectErrors(): Rh2StateErreurApi[] {
//     return useSelector((state: Rh2State) => state.erreurApi)
// }

// const selectError = createSelector([selectErreurs, selectErreurLabel], (erreurs, label) => {
//     console.log(erreurs);

//     return erreurs.find(erreur => erreur.label === label);
// });

// export function rh2Error(label: string): Rh2StateErreurApi {
//     return useSelector((state: Rh2State) => selectError(state, label));
// }

const selectErrors = createSelector([
    selectErreurs
], (erreurs) => erreurs);

const selectError = createSelector([
    selectErreur
], (erreur) => erreur);

/**
 * Get the list of http errors. 
 * Each request is storage with the key of the api provided in the configuration
 * @returns List of erreurs
 */
export function rh2Errors(): Rh2StateErreurApi[] {
    return useSelector((state: Rh2State) => selectErrors(state))
}

/**
 * Get the error corresponding of the key
 * @param label Key of the request
 * @returns Error 
 */
export function rh2Error(label: string): Rh2StateErreurApi {
    return useSelector((state: Rh2State) => selectError(state, label));
}
