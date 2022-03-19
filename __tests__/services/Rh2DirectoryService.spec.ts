import { AxiosRequestConfig } from 'axios';
import { ConfigQueryParameter } from '../../src/models/Rh2Directory';
import { default as rh2DirectoryService } from '../../src/services/Rh2DirectoryService';

describe('Remove Configuration', () => {

    it('Supprime les éléments configurés', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        rh2DirectoryService.addConfigQueryParameter(config, true);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, config.params)).toBe(true);
        rh2DirectoryService.removeAllQueryDirectoryLocked();
        expect(rh2DirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    it('Pas des suppressions car non locké', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        rh2DirectoryService.addConfigQueryParameter(config, false);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(false, config.url, config.method, config.params)).toBe(true);
    });

    it('Supprime un élément sans paramètre', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

        rh2DirectoryService.addConfigQueryParameter(config, false);
        expect(rh2DirectoryService.hasConfigQueryParameter(false, config.url, config.method)).toBe(true);
        
        rh2DirectoryService.removeQueryDirectoryNotLocked(axiosConfig);
        expect(rh2DirectoryService.hasConfigQueryParameter(false, config.url, config.method)).toBe(false);
    });

    it('Supprime un élément sans paramètre et avec lock', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

        rh2DirectoryService.addConfigQueryParameter(config, true);
        expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method)).toBe(true);
        
        rh2DirectoryService.removeQueryDirectoryLocked(axiosConfig);
        expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method)).toBe(false);
    });

    it('Supprime un élément sans paramètre impossible car lock et recherché sans lock', () => {

        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET'};
        const axiosConfig: AxiosRequestConfig = { url: config.url, method: config.method };

        rh2DirectoryService.addConfigQueryParameter(config, true);
        expect(rh2DirectoryService.hasConfigQueryParameter(false, config.url, config.method)).toBe(false);
        
        rh2DirectoryService.removeQueryDirectoryLocked(axiosConfig);
        expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method)).toBe(false);
    });

    afterAll(() => rh2DirectoryService.removeAllQueryDirectoryLocked());
});

describe('Add Configuration', () => {

    beforeEach(() => rh2DirectoryService.removeAllQueryDirectoryLocked());

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        rh2DirectoryService.addConfigQueryParameter(config, true);
        
        expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method)).toBe(true);
    });

    describe('Add Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method)).toBeTruthy();
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, null)).toBe(true);
        });
    });

    describe('Add Configuration - Tester params non vide', () => {

        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {unParam: 'unParam'}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {val: 5}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, config.params)).toBe(true);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const configT: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(configT, true);
            expect(rh2DirectoryService.hasConfigQueryParameter(true, configT.url, configT.method, configT.params)).toBe(true);

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier : 'unParam', second: 2, troisieme: 'deuxParam'}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, config.params)).toBe(true);

            rh2DirectoryService.addConfigQueryParameter(config, true);
            expect(rh2DirectoryService.hasConfigQueryParameter(true, config.url, config.method, config.params)).toBe(true);
        });
    });
});


describe('Find Configuration', () => {

    beforeEach(() => {
        rh2DirectoryService.removeAllQueryDirectoryLocked();
    });

    it('Get elements vide', () => {
        expect(rh2DirectoryService.getConfigQueryParameters()).toHaveLength(0);
    });

    it('url - method', () => {
        const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET' };
        rh2DirectoryService.addConfigQueryParameter(config, true);

        const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method);
        
        expect(resultat).not.toBe(null);
        expect(resultat.method).toBe('GET');
        expect(resultat.url).toBe('uneUrl');
    });

    describe('Rechercher Configuration - Tester params vide', () => {
        it('url - method - param array vide dans service, aucun param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method);
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(0);
        });

        it('url - method - param array vide dans service, null param recherché', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
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
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, null);
            
            expect(resultat).toBeUndefined();
        });


        it('url - method - param array avec pour valeur unParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier: 'unParam'}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier: 'unParam'});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(1);
        });

        it('url - method - param array avec pour valeur 5', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier: 5}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier: 5});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(1);
        });

        it('url - method - param array avec pour valeur unParam, 2, deuxParam', () => {

            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: {premier : 'unParam', second: 2, troisieme: 'deuxParam'}};
            rh2DirectoryService.addConfigQueryParameter(config, true);
            
            const resultat = rh2DirectoryService.getConfigQueryParameter(config.url, config.method, {premier : 'unParam', second: 2, troisieme: 'deuxParam'});
            
            expect(resultat).not.toBe(null);
            expect(resultat.method).toBe('GET');
            expect(resultat.url).toBe('uneUrl');
            expect(Object.keys(resultat.params).length).toBe(3);
        });



        describe('Has lock', () => {
            const config: ConfigQueryParameter = { url: 'uneUrl', method: 'GET', params: null };
            
            it('ne doit pas avoir de config avec lock', () => {
                expect(rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameterWithOrWithoutLock(config, true)).toBe(false);
            });

            it('ne doit pas avoir de config avec lock', () => {
                rh2DirectoryService.addConfigQueryParameter(config, true);
                expect(rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameterWithOrWithoutLock(config, true)).toBe(true);
            });

            it('ne doit pas avoir de config avec lock', () => {
                rh2DirectoryService.addConfigQueryParameter({...config, url: 'unesecondeurl'}, false);
                expect(rh2DirectoryService.hasConfigQueryParameterByConfigQueryParameterWithOrWithoutLock(config, true)).toBe(false);
            });
        })
    });

    describe('Gérer clé canceltoken ', () => {

        let axios;
        beforeEach(() => {
            jest.resetModules();
            axios = require('axios').default;
          });

        it('doit générer un token si parametre null fourni', () => {

            const cancelTokenSource: any = { cancel: jest.fn(), token: { reason: { message: 'user canceled' } } };
            jest.spyOn(rh2DirectoryService["cancelToken"], 'source').mockReturnValue(cancelTokenSource);
            
            expect(rh2DirectoryService.getOrGenerateCancelToken(null)).not.toEqual(null);
        });

        it('doit générer un token si parametre n\'existe pas', () => {

            const cancelTokenSource: any = { cancel: jest.fn(), token: { reason: { message: 'user canceled' } } };
            jest.spyOn(rh2DirectoryService["cancelToken"], 'source').mockReturnValue(cancelTokenSource);
            
            expect(rh2DirectoryService.getOrGenerateCancelToken("keyDoesNotExist")).not.toEqual(null);
            expect(rh2DirectoryService.getOrGenerateCancelToken("keyDoesNotExist")).not.toEqual(null);
        });

        it('ne doit aps supprimer de clé car n\'existe pas', () => {

            rh2DirectoryService.getOrGenerateCancelToken("keyExist");
            rh2DirectoryService.removeKeyCancelToken("keyDoesNotExist")
            expect(rh2DirectoryService.isKeyCancelToken("keyExist")).toBe(true);
        });

        it('doit supprimer une clé', () => {

            rh2DirectoryService.getOrGenerateCancelToken("keyExist");
            rh2DirectoryService.removeKeyCancelToken("keyExist")
            expect(rh2DirectoryService.isKeyCancelToken("keyExist")).toBe(false);
        });

    });
});