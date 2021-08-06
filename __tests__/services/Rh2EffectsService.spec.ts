import { AxiosRequestConfig } from "axios";
import React from 'react';
import * as redux from 'react-redux';
import { ResponseFetchApi, Rh2AxiosConfig, rh2AxiosConfigService, rh2ConfigService, Rh2InitializationParameter } from "../../src";
import { Rh2EffectSuccessNotRequiredHandler, Rh2EffectTakeParamsInRoute } from "../../src/models/Rh2Effect";
import * as FetchApiService from '../../src/services/FetchApiService';
import rh2DirectoryService from "../../src/services/Rh2DirectoryService";
import { useRh2WithName, useRh2WithNameTakeParamsInRoute, useRh2WithParameters, useRh2WithParametersTakeParamsInRoute } from "../../src/services/Rh2EffectsService";

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';

// Stub the initial state
const stubInitialState = [
    'stub data'
]

jest.mock('@react-navigation/native', () => ({
    // @ts-ignore
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => ({
        params: {
            paramTest: 'Réponse à paramTest',
        }
    }),
}));

const setState = jest.fn();
const useStateSpy = jest.spyOn(React, 'useState')
// @ts-ignore
useStateSpy.mockImplementation((init) => [
    init,
    setState
]);

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
let mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(mockDispatchFn);

const useEffect = jest.spyOn(React, "useEffect");
const mockUseEffect = async () => {
    useEffect.mockImplementation(f => f());
}

let fetchApiSpy;
fetchApiSpy = jest.spyOn(FetchApiService, 'fetchApi');

const axiosConfigGoogle: AxiosRequestConfig = { url: 'https://www.google.com/',
    method: 'GET' };
const configurationGoogle: Rh2EffectSuccessNotRequiredHandler = { config: axiosConfigGoogle };

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

describe('useRh2WithParameters', () => {

    afterEach(() => {
        resetMocksAndServices();
    });

    beforeEach(() => {
        initMocksServices();
    });

    it('Cas nominal avec succcess', async () => {

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }

        await mockFetchApi();

        await useRh2WithParameters(configurationGoogle, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false,
            data: reponse });
    });

    it('Cas nominal avec succcess et successHandler', async () => {

        const configuration: Rh2EffectSuccessNotRequiredHandler = { ...configurationGoogle,
            successHandler: () => console.log('Success !!!') };

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false,
            data: reponse });

    });

    it('Cas nominal avec erreur', async () => {

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false,
                isError: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configurationGoogle, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false,
            data: null });
    });

    it('Cas nominal avec erreur et errorHandler', async () => {

        const configuration: Rh2EffectSuccessNotRequiredHandler = { ...configurationGoogle,
            errorHandler: () => console.log('Echec ...') };

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false,
                isError: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false,
            data: null });
    });

    it('Cas nominal avec erreur et errorHandler global', async () => {

        const initSettings: Rh2InitializationParameter = { errorHandler: () => console.log('Hello Guys, c\'est la loose ....') };
        rh2ConfigService.initializeParameters(initSettings);

        const configuration: Rh2EffectSuccessNotRequiredHandler = configurationGoogle;

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: false,
                isError: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenCalledWith({ loading: false,
            data: null });
    });

});





describe('useRh2WithName', () => {

    afterEach(() => {
        resetMocks();
    });

    // beforeEach(() => {
    //     initMocksServices();
    // });

    describe('useRh2WithName', () => {
        it('Cas nominal avec succcess', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config,
                label: GOOGLE }
            rh2AxiosConfigService.addConfigAxios(configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true,
                    responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE, true);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenCalledWith({ loading: false,
                data: reponse });

            resetMocksAndServices();
        });

        it('Deuxième appel doit s\'executer car pas encore dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config,
                label: GOOGLE,
                addToDirectory: true }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true,
                    responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE, true);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenCalledWith({ loading: false,
                data: reponse });
        });

        it('Troisième appel ne doit pas s\'executer car deja dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config,
                label: GOOGLE,
                addToDirectory: true }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = { data: 'something' };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({ isSuccess: true,
                    responseSuccess: reponse } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE, true);
            expect(setState).toHaveBeenCalledTimes(0);
        });
    });


});


describe('useRh2WithName', () => {
    it('ne doit pas s\'executer car pas ajouter à la liste des config', async () => {

        const configACharger: Rh2AxiosConfig = { axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(MICROSOFT, true);

        expect(setState).toHaveBeenCalledTimes(0);
        resetMocksAndServices();
    });
});



describe('useRh2WithNameTakeParamsInRoute', () => {

    afterEach(() => {
        resetMocksAndServices();
    });

    it('Cas nominal avec PATH_PARAM', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'PATH_PARAM',
                params: [
                    'paramTest'
                ] }
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithNameTakeParamsInRoute(GOOGLE, true);

        expect(setState).toHaveBeenCalledTimes(2);
    });

    it('Cas nominal avec REQUEST_PARAM', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'REQUEST_PARAM',
                params: [
                    'paramTest'
                ] }
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithNameTakeParamsInRoute(GOOGLE, true);

        expect(setState).toHaveBeenCalledTimes(2);
    });

    it('Cas nominal avec affichage des logs debug', async () => {

        const initSettings: Rh2InitializationParameter = { modeDebug: true };
        rh2ConfigService.initializeParameters(initSettings);

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'PATH_PARAM',
                params: [
                    'paramTest'
                ] }
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithNameTakeParamsInRoute(GOOGLE, true);

        expect(setState).toHaveBeenCalledTimes(2);
    });

    it('Pas de config axios', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: null,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'PATH_PARAM',
                params: [
                    'paramTest'
                ] }
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        await useRh2WithNameTakeParamsInRoute(GOOGLE, true);

        expect(setState).toHaveBeenCalledTimes(0);
    });

    it('Pas de params', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'PATH_PARAM',
                params: [] }
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithNameTakeParamsInRoute(GOOGLE, true);

        expect(setState).toHaveBeenCalledTimes(2);
    });
});

describe('useRh2WithParametersTakeParamsInRoute', () => {
    it('Cas nominal', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.config,
            label: GOOGLE,
            dataFromRoute: { typeQueryParameter: 'PATH_PARAM',
                params: [
                    'paramTest'
                ] }
        }
        const configuration: Rh2EffectTakeParamsInRoute = { ...configurationGoogle,
            params: [
                'paramTest'
            ],
            typeQueryParameter: 'PATH_PARAM' };

        const reponse = { data: 'something' };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({ isSuccess: true,
                responseSuccess: reponse } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParametersTakeParamsInRoute(configuration, true);

        expect(setState).toHaveBeenCalledTimes(2);
        resetMocksAndServices();
    });
});