/*
 * File: Rh2AxiosInstanceService.spec.ts                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: Su Aug yyyy                                                   *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: 2022 02 12 - 04:37 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */
import {
    AxiosRequestConfig
} from 'axios';
import {
    ejectInterceptor,
    generateHeaders,
    initAxiosInstance
} from '../../src/services/Rh2AxiosInstanceService';
import {
    AxiosRequestConfigExtended, KeyValue
} from './../../src/models/Rh2Config';

const KEY_DEFAULT = 'default';

describe('Init Axios instance', () => {

    it('List Axios request is null', () => {
        const resultat = initAxiosInstance(null);
        expect(Object.keys(resultat)).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('List Axios request is empty', () => {
        const resultat = initAxiosInstance([]);
        expect(Object.keys(resultat)).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('List Axios request axios request not defined', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfigExtended: any = {
            key 
        };
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);
        expect(Object.keys(resultat)).toEqual([
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
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);
        expect(Object.keys(resultat)).toEqual([
            KEY_DEFAULT 
        ]);
    });

    it('Interceptor par defaut vaut null', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {
            baseURL: 'http://test.fr' 
        };
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
            key,
            axiosConfig: axiosRequestConfig 
        };
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);

        
        expect(Object.keys(resultat)).toEqual([
            key 
        ]);
        expect(Object.values(resultat)[0].interceptor).not.toBeNull();
    });

    it('Interceptor par defaut vaut true', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {
            baseURL: 'http://test.fr' 
        };
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
            key,
            axiosConfig: axiosRequestConfig,
            defaultInterceptor: true
        };
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);

        
        expect(Object.keys(resultat)).toEqual([
            key 
        ]);
        expect(Object.values(resultat)[0].interceptor).not.toBeNull();
    });

    it('Pas de interceptor par defaut', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {
            baseURL: 'http://test.fr' 
        };
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
            key,
            axiosConfig: axiosRequestConfig,
            defaultInterceptor: false
        };
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);

        
        expect(Object.keys(resultat)).toEqual([
            key 
        ]);
        expect(Object.values(resultat)[0].interceptor).toBeNull();
    });

    it('Eject Instance', () => {
        
        const key = 'TEST_VALUE';
        const axiosRequestConfig: AxiosRequestConfig = {
            baseURL: 'http://test.fr' 
        };
        const axiosRequestConfigExtended: AxiosRequestConfigExtended = {
            key,
            axiosConfig: axiosRequestConfig,
            defaultInterceptor: false
        };
       
        const resultat = initAxiosInstance([
            axiosRequestConfigExtended 
        ]);

        ejectInterceptor(resultat);
    });

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

    it('Header param is bizarre', async () => {
        
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();

        const test: any = 'sdfsdf';

        const resultat = await generateHeaders(axiosConfig, [
            test as KeyValue<string> 
        ]);
        
        expect(resultat.headers[0]).toBeFalsy();
    });

    it('Header param is bizarre', async () => {
        
        const axiosConfig: AxiosRequestConfig = {
            method: 'GET' 
        };
        expect(axiosConfig.headers).toBeFalsy();

        const test: KeyValue<string> = {
            key: 'Content-Type',
            value: 'application/json' 
        };

        const resultat = await generateHeaders(axiosConfig, [
            test
        ]);
        
        expect(resultat.headers).toEqual({
            'Content-Type': 'application/json' 
        });
    });

    it('Header param - method is an option', async () => {
        
        const axiosConfig: AxiosRequestConfig = {
            method: 'OPTIONS' 
        };
        expect(axiosConfig.headers).toBeFalsy();
        const resultat = await generateHeaders(axiosConfig, []);
        expect(resultat.headers).toBeFalsy();
    });


    it('Header param 1', async () => {
        
        const unHeader: KeyValue<string>[] = [
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
        
        const unHeader: KeyValue<string>[] = [
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
