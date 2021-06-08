import { ConfigQueryParameter } from './../../src/models/QueryDirectory';
import { default as queryDirectoryService } from '../../src/services/QueryDirectoryService';
import { AxiosRequestConfig } from 'axios';

describe('Remove Configuration', () => {

    it('Supprime les éléments configurés', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        queryDirectoryService.addConfigQueryParameter(config);
        
        expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        queryDirectoryService.removeAllQueryDirectory();
        expect(queryDirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    it('Supprime un élément sans paramètre', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

        queryDirectoryService.addConfigQueryParameter(config);
        
        expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method)).toBe(true);
        queryDirectoryService.removeQueryDirectory(axiosConfig);
        expect(queryDirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    afterAll(() => queryDirectoryService.removeAllQueryDirectory());
});

describe('Add Configuration', () => {

    beforeEach(() => queryDirectoryService.removeAllQueryDirectory());

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        queryDirectoryService.addConfigQueryParameter(config);
        
        expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method)).toBe(true);
    });

    describe('Add Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: []};
            queryDirectoryService.addConfigQueryParameter(config);

            expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method)).toBeTruthy();
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            queryDirectoryService.addConfigQueryParameter(config);
            
            expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method, null)).toBe(true);
        });
    });

    describe('Add Configuration - Tester params non vide', () => {

        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: ['unParam']};
            queryDirectoryService.addConfigQueryParameter(config);
            
            expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: [5]};
            queryDirectoryService.addConfigQueryParameter(config);
            
            expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: ['unParam', 2, 'deuxParam']};
            queryDirectoryService.addConfigQueryParameter(config);
            
            expect(queryDirectoryService.hasConfigQueryParameter(config.url, config.method, config.params)).toBe(true);
        });
    });
});


describe('Find Configuration', () => {

    beforeEach(() => {
        queryDirectoryService.removeAllQueryDirectory();
    });

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        queryDirectoryService.addConfigQueryParameter(config);

        const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method);
        
        expect(resultat).not.toBe(null);
        expect(resultat.method).toBe('GET');
        expect(resultat.url).toBe('uneUrl');
    });

    describe('Rechercher Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: []};
            queryDirectoryService.addConfigQueryParameter(config);
            
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params.length).toBe(0);
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            queryDirectoryService.addConfigQueryParameter(config);
            
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method, null);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params).toBe(null);
        });
    });

    describe('Rechercher Configuration - Tester params non vide', () => {

        it('url - method - param array avec pour valeur unParamn mais rechercher avec null', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: ['unParam']};
            queryDirectoryService.addConfigQueryParameter(config);
            
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method, null);
            
            expect(resultat).toBeUndefined();
        });


        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: ['unParam']};
            queryDirectoryService.addConfigQueryParameter(config);
            
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method, ['unParam']);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params.length).toBe(1);
            expect(resultat.params[0]).toBe('unParam');
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: [5]};
            queryDirectoryService.addConfigQueryParameter(config);
            
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method, [5]);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params.length).toBe(1);
            expect(resultat.params[0]).toBe(5);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: ['unParam', 2, 'deuxParam']};
            queryDirectoryService.addConfigQueryParameter(config);
            
            console.log(queryDirectoryService.getConfigQueryParameters());
            const resultat = queryDirectoryService.getConfigQueryParameter(config.url, config.method, ['unParam', 2, 'deuxParam']);
            console.log(resultat);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(resultat.params.length).toBe(3);
            expect(resultat.params[0]).toBe('unParam');
            expect(resultat.params[1]).toBe(2);
            expect(resultat.params[2]).toBe('deuxParam');
        });
    });
});