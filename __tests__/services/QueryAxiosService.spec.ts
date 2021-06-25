import { ConfigQueryParameter } from '../../src/models/QueryDirectory';
import { default as queryAxiosService } from '../../src/services/QueryAxiosService';
import { AxiosRequestConfig } from 'axios';
import { ConfigAxiosEtat, ConfigAxios } from '../../src';
import { pourTestAction } from '../../src/redux/hook-action';

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';

const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
const configAxiosEtat: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig, label: GOOGLE, addToDirectory: true }
const configACharger: ConfigAxios = { configAxiosEtat, actionToDispatch: pourTestAction };

const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
const configAxiosEtat2: ConfigAxiosEtat = { axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false }
const configACharger2: ConfigAxios = { configAxiosEtat: configAxiosEtat2, actionToDispatch: pourTestAction };

describe('Remove Configuration', () => {
    it('Supprime les éléments configurés', () => {
        queryAxiosService.addConfigAxios(configACharger);
        queryAxiosService.addConfigAxios(configACharger2);
        
        expect(queryAxiosService.hasConfigAxios(GOOGLE)).toBe(true);
        expect(queryAxiosService.hasConfigAxios(MICROSOFT)).toBe(true);
        queryAxiosService.removeAllConfigAxios();
        expect(queryAxiosService.getAllConfigAxios()).toHaveLength(0);
    });

    it('Supprime un élément sans paramètre', () => {
        queryAxiosService.addConfigAxios(configACharger);
        expect(queryAxiosService.hasConfigAxios(GOOGLE)).toBe(true);
        queryAxiosService.removeConfigAxios(GOOGLE);
        expect(queryAxiosService.getAllConfigAxios()).toHaveLength(0);
    });

});

describe('Replace Configuration', () => {

    it('Replace a configuration', () => {
        queryAxiosService.addConfigAxios(configACharger);
        expect(queryAxiosService.hasConfigAxios(GOOGLE)).toBe(true);
        queryAxiosService.replaceConfig(GOOGLE, configACharger2);
        expect(queryAxiosService.hasConfigAxios(MICROSOFT)).toBe(true);
        queryAxiosService.replaceConfig(GOOGLE, configACharger2);
        expect(queryAxiosService.getAllConfigAxios().length).toBe(1);
    });
    afterEach(() => queryAxiosService.removeAllConfigAxios());
});


describe('Add specific configuration', () => {

    afterEach(() => queryAxiosService.removeAllConfigAxios());
    beforeEach(() => initData())
    
    it('Add auth config', () => {
        initData();
        const auth = { username: 'Lunotte', password: 'pampers' };
        queryAxiosService.addAuthToConfigAxios(GOOGLE, auth);
        const confAfterAddAuth = queryAxiosService.getConfigAxios(GOOGLE);
        expect(confAfterAddAuth.configAxiosEtat.axiosRequestConfig.auth).toBe(auth);
        queryAxiosService.addAuthToConfigAxios(MICROSOFT, auth);
        const confAfterAddAuthToMicrosoft = queryAxiosService.getConfigAxios(MICROSOFT);
        expect(confAfterAddAuthToMicrosoft).toBeUndefined();
    });

    it('Add body config', () => {
        initData();
        const body = { title: 'Die Hard' };
        queryAxiosService.addBodyToConfigAxios(GOOGLE, body);
        const confAfterAddBody = queryAxiosService.getConfigAxios(GOOGLE);
        expect(confAfterAddBody.configAxiosEtat.axiosRequestConfig.data).toBe(body);
        queryAxiosService.addBodyToConfigAxios(MICROSOFT, body);
        const confAfterAddAuthToMicrosoft = queryAxiosService.getConfigAxios(MICROSOFT);
        expect(confAfterAddAuthToMicrosoft).toBeUndefined();
    });

    function initData() {
        queryAxiosService.addConfigAxios(configACharger);
        const conf = queryAxiosService.getConfigAxios(GOOGLE);
        expect(conf.configAxiosEtat.axiosRequestConfig.auth).toBeFalsy();
    }

});
