/*
 * File: Rh2DirectoryService.spec.ts                                           *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 14                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 05:23 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






import { AxiosRequestConfig } from 'axios';
import { ConfigQueryParameter } from '../../src/models/Rh2Directory';
import { default as rh2DirectoryService } from '../../src/services/Rh2DirectoryService';

describe('Remove Configuration', () => {

    it('Supprime les éléments configurés', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        rh2DirectoryService.addConfigQueryParameter(config);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        rh2DirectoryService.removeAllQueryDirectory();
        expect(rh2DirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    it('Supprime un élément sans paramètre', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

        rh2DirectoryService.addConfigQueryParameter(config);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method)).toBe(true);
        rh2DirectoryService.removeQueryDirectory(axiosConfig);
        expect(rh2DirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    afterAll(() => rh2DirectoryService.removeAllQueryDirectory());
});

describe('Add Configuration', () => {

    beforeEach(() => rh2DirectoryService.removeAllQueryDirectory());

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        rh2DirectoryService.addConfigQueryParameter(config);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method)).toBe(true);
    });

    describe('Add Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {}};
            rh2DirectoryService.addConfigQueryParameter(config);
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method)).toBeTruthy();
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, null)).toBe(true);
        });
    });

    describe('Add Configuration - Tester params non vide', () => {

        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {unParam: 'unParam'}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {val: 5}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const configT: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(configT);
            expect(rh2DirectoryService.hasConfigQueryParameter(configT.url, configT.method, configT.params)).toBe(true);

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier : 'unParam', second: 2, troisieme: 'deuxParam'}};
            rh2DirectoryService.addConfigQueryParameter(config);
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);

            rh2DirectoryService.addConfigQueryParameter(config);
            expect(rh2DirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });
    });
});


describe('Find Configuration', () => {

    beforeEach(() => {
        rh2DirectoryService.removeAllQueryDirectory();
    });

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        rh2DirectoryService.addConfigQueryParameter(config);

        const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method);
        
        expect(resultat).not.toBe(null);
        expect(resultat.method).toBe('GET');
        expect(resultat.url).toBe('uneUrl');
    });

    describe('Rechercher Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(0);
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, null);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params).toBe(null);
        });
    });

    describe('Rechercher Configuration - Tester params non vide', () => {

        it('url - method - param array avec pour valeur unParamn mais rechercher avec null', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier: 'unParam'}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, null);
            
            expect(resultat).toBeUndefined();
        });


        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier: 'unParam'}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier: 'unParam'});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(1);
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier: 5}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier: 5});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(1);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier : 'unParam', second: 2, troisieme: 'deuxParam'}};
            rh2DirectoryService.addConfigQueryParameter(config);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier : 'unParam', second: 2, troisieme: 'deuxParam'});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(3);
        });
    });
});