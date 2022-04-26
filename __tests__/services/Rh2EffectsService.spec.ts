/*
 * File: Rh2EffectsService.spec.ts                                             *
 * Project: react-http-request-handler                                         *
 * Created Date: Fri July 16 2021                                              *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 21 - 09:10 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */


/* eslint-disable no-eval */
import { AxiosRequestConfig } from "axios";
import React from 'react';
// import * as redux from 'react-redux';
import {
    ResponseFetchApi, Rh2AxiosConfig, rh2AxiosConfigService, rh2ConfigService, Rh2InitializationParameter
} from "../../src";
import { Rh2EffectAxiosConfigHandler } from "../../src/models/Rh2Effect";
import * as FetchApiService from '../../src/services/FetchApiService';
import rh2DirectoryService from "../../src/services/Rh2DirectoryService";
import { useRh2WithName, useRh2WithParameters } from "../../src/services/Rh2EffectsService";

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';

jest.mock('@react-navigation/native', () => ({
    // @ts-ignore
    ...jest.requireActual('@react-navigation/native'),
    useRoute: () => ({
        params: {
            paramTest: 'Réponse à paramTest'
        }
    })
}));

const setState = jest.fn();
const useStateSpy = jest.spyOn(React, 'useState')
// @ts-ignore
useStateSpy.mockImplementation((init) => [
    init,
    setState
]);

let redux2 = {useDispatch: () => {}}
const useDispatchSpy = jest.spyOn(redux2, 'useDispatch');
//let mockDispatchFn = jest.fn();
useDispatchSpy.mockReturnValue(redux2.useDispatch());

const useEffect = jest.spyOn(React, "useEffect");
const mockUseEffect = async () => {
    useEffect.mockImplementation(f => f());
}

let fetchApiSpy;
fetchApiSpy = jest.spyOn(FetchApiService, 'fetchApi');

const axiosConfigGoogle: AxiosRequestConfig = {
    url: 'https://www.google.com/',
    method: 'GET'
};
const configurationGoogle: Rh2EffectAxiosConfigHandler = {
    axiosRequestConfig: axiosConfigGoogle,
    lock: false
};

function resetMocksAndServices() {
    rh2AxiosConfigService.removeAllConfigAxios();
    rh2DirectoryService.removeAllQueriesDirectoryLocked();
    resetMocks();
}

function resetMocks() {
    jest.clearAllMocks();
}

function initMocksServices() {
   //  mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(redux2.useDispatch());
    mockUseEffect();
}

beforeAll(() => {
    initMocksServices();
});

describe('useRh2WithParameters', () => {

    const cancelTokenSource: any = { cancel: jest.fn(), token: { reason: { message: 'user canceled' } } };
    jest.spyOn(rh2DirectoryService["cancelToken"], 'source').mockReturnValue(cancelTokenSource);

    afterEach(() => {
        resetMocksAndServices();
    });

    beforeEach(() => {
        initMocksServices();
    });

    it('Cas nominal avec succcess', async () => {

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }

        await mockFetchApi();

        // await useRh2WithParameters(configurationGoogle, false);
        // expect(setState).toHaveBeenCalledTimes(0);
        await useRh2WithParameters(configurationGoogle);
        expect(setState).toHaveBeenCalledTimes(2);
    });

    it('Cas nominal avec succcess', async () => {

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }

        await mockFetchApi();

        await useRh2WithParameters(configurationGoogle);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenNthCalledWith(1, {
            loading: true,
            completed: false,
            failed: false,
            success: false,
            data: null
        });
        expect(setState).toHaveBeenNthCalledWith(2, {
            loading: false,
            completed: true,
            failed: false,
            success: true,
            data: reponse
        });
    });

    it('Cas nominal avec succcess et successHandler', async () => {

        const configuration: Rh2EffectAxiosConfigHandler = {
            ...configurationGoogle,
            successHandler: () => console.log('Success !!!')
        };

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();
        await useRh2WithParameters(configuration);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenNthCalledWith(1, {
            loading: true,
            completed: false,
            failed: false,
            success: false,
            data: null
        });
        expect(setState).toHaveBeenNthCalledWith(2, {
            loading: false,
            completed: true,
            failed: false,
            success: true,
            data: reponse
        });

    });

    it('Cas nominal avec erreur', async () => {

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: false,
                isError: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configurationGoogle);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenNthCalledWith(1, {
            loading: true,
            completed: false,
            failed: false,
            success: false,
            data: null
        });
        expect(setState).toHaveBeenNthCalledWith(2, {
            loading: false,
            completed: true,
            failed: true,
            success: false,
            data: null
        });
    });

    it('Cas nominal avec erreur et errorHandler', async () => {

        const configuration: Rh2EffectAxiosConfigHandler = {
            ...configurationGoogle,
            errorHandler: () => console.log('Echec ...')
        };

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: false,
                isError: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configuration);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenNthCalledWith(1, {
            loading: true,
            completed: false,
            failed: false,
            success: false,
            data: null
        });
        expect(setState).toHaveBeenNthCalledWith(2, {
            loading: false,
            completed: true,
            failed: true,
            success: false,
            data: null
        });
    });

    it('Cas nominal avec erreur et errorHandler global', async () => {

        const initSettings: Rh2InitializationParameter = {
            errorHandler: () => console.log('Hello Guys, c\'est la loose ....') 
        };
        rh2ConfigService.initializeParameters(initSettings);

        const configuration: Rh2EffectAxiosConfigHandler = configurationGoogle;

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: false,
                isError: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithParameters(configuration);

        expect(setState).toHaveBeenCalledTimes(2);
        expect(setState).toHaveBeenNthCalledWith(1, {
            loading: true,
            completed: false,
            failed: false,
            success: false,
            data: null
        });
        expect(setState).toHaveBeenNthCalledWith(2, {
            loading: false,
            completed: true,
            failed: true,
            success: false,
            data: null
        });
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

            const configACharger: Rh2AxiosConfig = {
                axiosRequestConfig: configurationGoogle.axiosRequestConfig,
                label: GOOGLE,
                messageCancelToken: 'Query canceled'
            }
            rh2AxiosConfigService.addConfigAxios(configACharger);

            const reponse = {
                data: 'something' 
            };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({
                    isSuccess: true,
                    responseSuccess: reponse
                } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenNthCalledWith(1, {
                loading: true,
                completed: false,
                failed: false,
                success: false,
                data: null
            });
            expect(setState).toHaveBeenNthCalledWith(2, {
                loading: false,
                completed: true,
                failed: false,
                success: true,
                data: reponse
            });

            resetMocksAndServices();
        });

        it('Deuxième appel doit s\'executer car pas encore dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = {
                axiosRequestConfig: configurationGoogle.axiosRequestConfig,
                label: GOOGLE,
                lock: true
            }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = {
                data: 'something' 
            };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({
                    isSuccess: true,
                    responseSuccess: reponse
                } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE);

            expect(setState).toHaveBeenCalledTimes(2);
            expect(setState).toHaveBeenNthCalledWith(1, {
                loading: true,
                completed: false,
                failed: false,
                success: false,
                data: null
            });
            expect(setState).toHaveBeenNthCalledWith(2, {
                loading: false,
                completed: true,
                failed: false,
                success: true,
                data: reponse
            });
            
        });

        it('Troisième appel ne doit pas s\'executer car deja dans l\'annuaire', async () => {

            const configACharger: Rh2AxiosConfig = {
                axiosRequestConfig: configurationGoogle.axiosRequestConfig,
                label: GOOGLE,
                lock: true
            }
            rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

            const reponse = {
                data: 'something' 
            };
            const mockFetchApi = async () => {
                return fetchApiSpy.mockReturnValue({
                    isSuccess: true,
                    responseSuccess: reponse
                } as ResponseFetchApi);
            }
            await mockFetchApi();

            await useRh2WithName(GOOGLE);
            expect(setState).toHaveBeenCalledTimes(0);
        });
    });
});


describe('useRh2WithName', () => {
    it('ne doit pas s\'executer car pas ajouter à la liste des config', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.axiosRequestConfig,
            label: GOOGLE
        }
        rh2AxiosConfigService.addConfigAxios(configACharger);

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(MICROSOFT);

        expect(setState).toHaveBeenCalledTimes(0);
        resetMocksAndServices();
    });
});

describe('useRh2WithName', () => {
    it('avec query params', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.axiosRequestConfig,
            label: GOOGLE,
            successHandler: (data) => setState(data) 
        }
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(GOOGLE, true, {
            params: {
                une: 'valeur',
                chatte: 'chienne'
            }
        });

        expect(setState).toHaveBeenCalledTimes(3);
        resetMocksAndServices();
    });
});


describe('useRh2WithName', () => {
    it('avec body params', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.axiosRequestConfig,
            label: GOOGLE,
            successHandler: (data) => setState(data) 
        }
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(GOOGLE, true, {
            data: {
                une: 'valeur',
                chatte: 'chienne'
            }
        });

        expect(setState).toHaveBeenCalledTimes(3);
        resetMocksAndServices();
    });
});


describe('useRh2WithName', () => {
    it('avec path params', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.axiosRequestConfig,
            label: GOOGLE,
            successHandler: (data) => setState(data) 
        }
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(GOOGLE, true, {
            pathParams: '/2/trote'
        });

        expect(setState).toHaveBeenCalledTimes(3);
        resetMocksAndServices();
    });
});

describe('useRh2WithName', () => {
    it('with path and query params', async () => {

        const configACharger: Rh2AxiosConfig = {
            axiosRequestConfig: configurationGoogle.axiosRequestConfig,
            label: GOOGLE,
            successHandler: (data) => setState(data),
            onlyResult: false
        }
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);

        const spyFetchApi = jest.spyOn(FetchApiService, 'fetchApi');

        const reponse = {
            data: 'something' 
        };
        const mockFetchApi = async () => {
            return fetchApiSpy.mockReturnValue({
                isSuccess: true,
                responseSuccess: reponse
            } as ResponseFetchApi);
        }
        await mockFetchApi();

        await useRh2WithName(GOOGLE, true, {
            pathParams: '2/trote',
            params: {
                une: 'valeur',
                chatte: 'chienne'
            }
        });

        expect(spyFetchApi).toHaveBeenCalled();
        expect(spyFetchApi.mock.calls[0][1]).toEqual({
            url: 'https://www.google.com/2/trote',
            method: 'GET',
            data: undefined,
            params: { une: 'valeur', chatte: 'chienne' },
            cancelToken: {
                reason: {
                    message: "user canceled"
                }
            }
          });
        expect(setState).toHaveBeenCalledTimes(3);
        resetMocksAndServices();
    });
});

