import { ErreurFetchApi, ResponseFetchApi } from '../../src/models';
import { Rh2EffectTreatmentToManageRequest } from '../../src/models/Rh2Effect';
import rh2ManagerToQueryInProgressService from '../../src/services/Rh2ManagerToQueryInProgressService';

describe('Configuration en cours', () => {
    const LABEL = 'toto';
    
    describe('Ajouter', () => {

        it('label configuration', () => {
            rh2ManagerToQueryInProgressService.addQueryInProgress(LABEL);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress().length).toBe(1);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress()).toEqual([LABEL]);
        });

        it('label configuration, ne doit pas être ajouté 2 fois', () => {
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress().length).toBe(1);
            rh2ManagerToQueryInProgressService.addQueryInProgress(LABEL);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress().length).toBe(1);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress()).toEqual([LABEL]);
        });
    });

    describe('Supprimer', () => {
        it('label configuration', () => {
            rh2ManagerToQueryInProgressService.removeQueryInProgress(LABEL);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress().length).toBe(0);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress()).toEqual([]);
        });

        it('label configuration n\'existe plus', () => {
            rh2ManagerToQueryInProgressService.removeQueryInProgress(LABEL);
            expect(rh2ManagerToQueryInProgressService.getQueriesInProgress().length).toBe(0);
        });
    });
});


describe('Configuration erreur', () => {
    const LABEL = 'toto';
    const configuration: Rh2EffectTreatmentToManageRequest = { action: null, label: LABEL, axiosRequestConfig: null };
    
    describe('Ajouter', () => {
        let responseFetchApi: ResponseFetchApi = {isError: true, isSuccess: false, status: null, responseSuccess: null, responseErreur: null};

        it('Erreur api', () => {
            const erreurFetchApi: Partial<ErreurFetchApi> = { isRequestError: true, isResponseError: false };
            responseFetchApi = { ...responseFetchApi, responseErreur: erreurFetchApi as ErreurFetchApi };
            rh2ManagerToQueryInProgressService.addErrorApi(LABEL, configuration, responseFetchApi);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi().length).toBe(1);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi()).toEqual([{label: LABEL, configuration, error: responseFetchApi}]);
        });

        it('Erreur api, doit mettre à jour si label deja existant', () => {
            const erreurFetchApi: Partial<ErreurFetchApi> = {isRequestError: false, isResponseError: true};
            responseFetchApi = { ...responseFetchApi, responseErreur: erreurFetchApi as ErreurFetchApi };

            rh2ManagerToQueryInProgressService.addErrorApi(LABEL, configuration, responseFetchApi);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi().length).toBe(1);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi()).toEqual([{label: LABEL, configuration, error: responseFetchApi}]);
        });

        it('Erreur api, ajouté un second élément', () => {
            const LABEL2 = 'titi';

            rh2ManagerToQueryInProgressService.addErrorApi(LABEL2, configuration, responseFetchApi);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi().length).toBe(2);
            expect(rh2ManagerToQueryInProgressService.getErrorsApi()).toEqual([{label: LABEL, configuration, error: responseFetchApi}, {label: LABEL2, configuration, error: responseFetchApi}]);
        });

    });

});
