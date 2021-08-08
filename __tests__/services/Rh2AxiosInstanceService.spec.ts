/*
 * File: Rh2AxiosInstanceService.spec.ts                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: Su Aug yyyy                                                   *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: Sun Aug 08 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */
import {
    AxiosRequestConfig
} from 'axios';
import {
    initAxiosInstance
} from '../../src/services/Rh2AxiosInstanceService';
import rh2ConfigService from '../../src/services/Rh2ConfigService';

const KEY_DEFAULT = 'default';

describe('Init Axios instance', () => {

    it('List Axios request is null', () => {
        initAxiosInstance(null);
        expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('List Axios request is empty', () => {
        initAxiosInstance([]);
        expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('List Axios request axios request not defined', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfigExtended: any = {
            key 
        };
       
        initAxiosInstance([
            axiosRequestConfigExtended 
        ]);
        expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('List Axios request axios request not defined', () => {
        
        const axiosRequestConfig: AxiosRequestConfig = {
            baseURL: 'http://test.fr' 
        };
        const axiosRequestConfigExtended: any = {
            axiosConfig: axiosRequestConfig 
        };
       
        initAxiosInstance([
            axiosRequestConfigExtended 
        ]);
        expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
            KEY_DEFAULT 
        ]);
    });

    // it('List Axios request with key and request', () => {
        
    //     const key = 'TEST_VALUE';
    //     const axiosRequestConfig: AxiosRequestConfig = {
    //         baseURL: 'http://test.fr' 
    //     };
    //     const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
    //         key,
    //         axiosConfig: axiosRequestConfig 
    //     };
       
    //     initAxiosInstance([
    //         axiosRequestConfigExtended 
    //     ]);

    //     console.log(rh2ConfigService.getAxiosInstances());
        
    //     expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
    //         key 
    //     ]);
    // });

    // it('List Axios request with key and request', () => {
        
    //     const key = 'TEST_VALUE';
    //     const axiosRequestConfig: AxiosRequestConfig = {
    //         baseURL: 'http://test.fr' 
    //     };
    //     const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
    //         key,
    //         axiosConfig: axiosRequestConfig,
    //         defaultInterceptor: false 
    //     };
       
    //     initAxiosInstance([
    //         axiosRequestConfigExtended 
    //     ]);
    //     expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
    //         key 
    //     ]);

    //     console.log(rh2ConfigService.getAxiosInstances());
    // });

    // it('List Axios request with key and request - 2 elements', () => {
        
    //     const key = 'TEST_VALUE';
    //     const axiosRequestConfig: AxiosRequestConfig = {
    //         baseURL: 'http://test.fr' 
    //     };
    //     const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
    //         key,
    //         axiosConfig: axiosRequestConfig 
    //     };
        
    //     const key2 = 'TEST_VALUE_2';
    //     const axiosRequestConfig2: AxiosRequestConfig = {
    //         baseURL: 'http://test2.fr' 
    //     };
    //     const axiosRequestConfigExtended2: AxiosRequestConfigExtended = {
    //         key: key2,
    //         axiosConfig: axiosRequestConfig2 
    //     };
       
    //     initAxiosInstance([
    //         axiosRequestConfigExtended,
    //         axiosRequestConfigExtended2 
    //     ]);
    //     expect(Object.keys(rh2ConfigService.getAxiosInstances())).toEqual([
    //         key,
    //         key2 
    //     ]);
    //     const axiosInstance1 = Object.values(rh2ConfigService.getAxiosInstances())[0];
    //     const axiosInstance2 = Object.values(rh2ConfigService.getAxiosInstances())[1];
    //     expect(axiosInstance1.axiosInstance.defaults.baseURL).toEqual(axiosRequestConfig.baseURL);
    //     expect(axiosInstance2.axiosInstance.defaults.baseURL).toEqual(axiosRequestConfig2.baseURL);
               
    //     console.log(rh2ConfigService.getAxiosInstances());
    // });
});


describe('Generate a header to interceptor', () => {
    const HEARDER_PAR_DEFAUT = {
        "Content-Type": "application/json" 
    };

    it('Header param is null', async () => {
        
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();
        const resultat = await generateHeaders(axiosConfig, null);
        expect(resultat.headers).toEqual(HEARDER_PAR_DEFAUT);
    });

    it('Header param is empty array', async () => {
        
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();
        const resultat = await generateHeaders(axiosConfig, []);
        expect(resultat.headers).toEqual(HEARDER_PAR_DEFAUT);
    });

    it('Header param 1', async () => {
        
        const unHeader: KeyValue[] = [
            {
                key: 'key-test',
                value: 'Test a value'
            }
        ];
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();
        const resultat = await generateHeaders(axiosConfig, unHeader);
        expect(resultat.headers).toEqual({
            'key-test': 'Test a value' 
        });
    });

    it('Header param 2', async () => {
        
        const unHeader: KeyValue[] = [
            {
                key: 'key-test',
                value: 'Test a value'
            },
            {
                key: 'other-test',
                value: 'Test another value'
            }
        ];
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();
        const resultat = await generateHeaders(axiosConfig, unHeader);
        expect(resultat.headers).toEqual({
            'key-test': 'Test a value',
            'other-test': 'Test another value' 
        });
    });
});
