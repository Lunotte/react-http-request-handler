import { SettingsInitializerRnhrh } from './../../src/models/Rh2Config';
import { Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired } from './../../src/models/Rh2Effect';
import { chargementFinishedAction, pourTestAction } from './../../src/redux/rh2-action';
import { AxiosRequestConfig } from "axios";
import { ResponseFetchApi, Rh2AxiosConfig, rh2AxiosConfigService, rh2ConfigService, useRequestFromName } from "../../src";
import rh2DirectoryService from "../../src/services/Rh2DirectoryService";
import * as FetchApiService from '../../src/services/FetchApiService';
import * as redux from 'react-redux';
import React from 'react';
import { traitementUseRequest, useRequestNotPreloadedWithParameter, useRequestPreloadedWithName } from "../../src/services/Rh2EffectsService";
import { chargementStartedAction } from "../../src/redux/rh2-action";
import { result } from 'lodash';

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';

const realUseState = React.useState

// Stub the initial state
const stubInitialState = ['stub data']

// let useStateSpy = jest.spyOn(React, 'useState');
// let mockStateFn = jest.fn();
// useStateSpy.;

const setState = jest.fn();
const useStateSpy = jest.spyOn(React, 'useState')
useStateSpy.mockImplementation((init) => [init, setState]);

let useDispatchSpy = jest.spyOn(redux, 'useDispatch');
let mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

let useEffect = jest.spyOn(React, "useEffect");;
const mockUseEffect = async () => {
    useEffect.mockImplementation(f => f());
}

let fetchApiSpy;
fetchApiSpy = jest.spyOn(FetchApiService, 'fetchApi');

const axiosConfigGoogle: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
const configurationGoogle: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired = { config: axiosConfigGoogle };

function resetMocksAndServices() {
    rh2AxiosConfigService.removeAllConfigAxios();
    rh2DirectoryService.removeAllQueryDirectory();
    resetMocks();
}

function resetMocks() {
    jest.clearAllMocks();
}

function initMocksServices() {
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    mockUseEffect();
}

beforeAll(() => {
    initMocksServices();
});

describe('useRequestNotPreloadedWithParameter', () => {

    afterEach(() => {
        resetMocksAndServices();
    });

    beforeEach(() => {
        initMocksServices();
    });

    it('Cas nominal avec succcess', async () => {

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
        }

        await mockFetchApi();

        await useRequestNotPreloadedWithParameter(configurationGoogle, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false, data: reponse });
    });

    it('Cas nominal avec succcess et successHandler', async () => {

        const configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired = { ...configurationGoogle, successHandler: () => console.log('Success !!!') };

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRequestNotPreloadedWithParameter(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false, data: reponse });

    });

    it('Cas nominal avec erreur', async () => {

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false, isError: true, responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRequestNotPreloadedWithParameter(configurationGoogle, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false, data: null });
    });

    it('Cas nominal avec erreur et errorHandler', async () => {

        const configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired = { ...configurationGoogle, errorHandler: () => console.log('Echec ...') };

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false, isError: true, responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRequestNotPreloadedWithParameter(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false, data: null });
    });

    it('Cas nominal avec erreur et errorHandler global', async () => {

        const initSettings: SettingsInitializerRnhrh = { errorHandler: () => console.log('Hello Guys, c\'est la loose ....') };
        rh2ConfigService.initializeParameters(initSettings);

        const configuration: Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired = configurationGoogle;

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false, isError: true, responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRequestNotPreloadedWithParameter(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false, data: null });
    });

});





describe('useRequestPreloadedWithName', () => {

    afterEach(() => {
        resetMocks();
    });

    // beforeEach(() => {
    //     initMocksServices();
    // });

    describe('useRequestPreloadedWithName', () => {
        it('Cas nominal avec succcess', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config, label: GOOGLE }
            rh2AxiosConfigService.addConfigAxios(configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRequestPreloadedWithName(GOOGLE, true);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenCalledWith({ loading: false, data: reponse });

            resetMocksAndServices();
        });

        it('Deuxième appel doit s\'executer car pas encore dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config, label: GOOGLE, addToDirectory: true }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRequestPreloadedWithName(GOOGLE, true);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenCalledWith({ loading: false, data: reponse });
        });

        it('Troisième appel ne doit pas s\'executer car deja dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config, label: GOOGLE, addToDirectory: true }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRequestPreloadedWithName(GOOGLE, true);
            expect(setState).toHaveBeenCalledTimes(0);
        });
    });


});




describe('useRequestPreloadedWithName', () => {
    it('ne doit pas s\'executer car pas ajouter à la liste des config', async () => {

        const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config, label: GOOGLE }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true, responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRequestPreloadedWithName(MICROSOFT, true);

        expect(setState).toHaveBeenCalledTimes(0);

    });
});


// describe('Remove Configuration', () => {

//     afterEach(() => {
//         rh2AxiosConfigService.removeAllConfigAxios();
//         rh2DirectoryService.removeAllQueryDirectory();
//         jest.clearAllMocks();
//     });

//     it('1 Supprime les éléments configurés', async () => {

//        const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
//         const configACharger: Rh2AxiosConfig = {
//             axiosRequestConfig: axiosConfig,
//             label: GOOGLE,
//             addToDirectory: true,
//             dataFromRoute: {
//                 params: ['itemId'],
//                 typeQueryParameter: 'REQUEST_PARAM'
//             }
//         }
//         rh2AxiosConfigService.addConfigAxios(configACharger);

//         mockDispatchFn = jest.fn();
//         useDispatchSpy.mockReturnValue(mockDispatchFn);

//         let fetchApiSpy;
//         const mockFetchApi = async () => {
//             return fetchApiSpy.mockReturnValue({ isSuccess: true } as ResponseFetchApi);
//         }
//         fetchApiSpy = jest.spyOn(FetchApiService, 'fetchApi');
//         await mockFetchApi();

//         const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(GOOGLE);
//         await traitementUseRequest(
//             {
//                 label: GOOGLE,
//                 config: configSelected?.axiosRequestConfig,
//                 justeReponse: configSelected?.justeReponse,
//                 addToDirectory:  configSelected?.addToDirectory,
//                 successHandler: configSelected?.successHandler,
//                 errorHandler: configSelected?.errorHandler,
//                 action: mockDispatchFn,
//             },
//             true
//         );

//         expect(mockDispatchFn).toBeCalledTimes(2);
//         expect(mockDispatchFn).toHaveBeenCalledWith(chargementStartedAction(GOOGLE));
//         expect(mockDispatchFn).toHaveBeenCalledWith(chargementFinishedAction(GOOGLE));
//     });

//     it('2 Supprime les éléments configurés', () => {

//         const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios('MICROsoft');

//         traitementUseRequest(
//             {
//                 label: GOOGLE,
//                 config: configSelected?.axiosRequestConfig,
//                 justeReponse: configSelected?.justeReponse,
//                 addToDirectory:  configSelected?.addToDirectory,
//                 successHandler: configSelected?.successHandler,
//                 errorHandler: configSelected?.errorHandler,
//                 action: mockDispatchFn,
//             },
//             true
//         );

//         expect(mockDispatchFn).toBeCalledTimes(0);
//     });





//     it('3 Supprime les éléments configurés', async () => {

//         const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com/', method: 'GET' };
//         const configACharger: Rh2AxiosConfig = {
//             axiosRequestConfig: axiosConfig,
//             label: GOOGLE,
//             addToDirectory: true,
//             dataFromRoute: {
//                 params: ['itemId'],
//                 typeQueryParameter: 'REQUEST_PARAM'
//             },
//             successHandler: () => mockDispatchFn(pourTestAction('Voici ma première offre'))
//         }
//         rh2AxiosConfigService.addConfigAxios(configACharger);

//         mockDispatchFn = jest.fn();
//         useDispatchSpy.mockReturnValue(mockDispatchFn);

//         let fetchApiSpy;
//         const mockFetchApi = async () => {
//             return fetchApiSpy.mockReturnValue({ isSuccess: true } as ResponseFetchApi);
//         }
//         fetchApiSpy = jest.spyOn(FetchApiService, 'fetchApi');
//         await mockFetchApi();
//         //await mockEffectFn();
//         await mockUseEffect();

//         await useRequestFromName(GOOGLE, true);

//     //    const configSelected: Rh2AxiosConfig = rh2AxiosConfigService.getConfigAxios(GOOGLE);

//     //     traitementUseRequest(
//     //         {
//     //             label: GOOGLE,
//     //             config: configSelected?.axiosRequestConfig,
//     //             justeReponse: configSelected?.justeReponse,
//     //             addToDirectory:  configSelected?.addToDirectory,
//     //             successHandler: configSelected?.successHandler,
//     //             errorHandler: configSelected?.errorHandler,
//     //             action: mockDispatchFn,
//     //         },
//     //         true
//     //     );

//         expect(mockDispatchFn).toBeCalledTimes(3);
//         expect(mockDispatchFn).toHaveBeenCalledWith(chargementStartedAction(GOOGLE));
//         expect(mockDispatchFn).toHaveBeenCalledWith(chargementFinishedAction('GOOGLE'));
//         expect(mockDispatchFn).toHaveBeenCalledWith(pourTestAction('Voici ma première offre'));
//     });

// });
