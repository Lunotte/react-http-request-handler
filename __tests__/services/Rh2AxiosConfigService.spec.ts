import { AxiosRequestConfig } from 'axios';
import { Rh2AxiosConfig } from '../../src';
import { default as rh2AxiosConfigService } from '../../src/services/Rh2AxiosConfigService';

const GOOGLE = 'GOOGLE';
const MICROSOFT = 'MICROSOFT';

const axiosConfig: AxiosRequestConfig = { url: 'https://www.google.com', method: 'GET' };
const configACharger: Rh2AxiosConfig = { axiosRequestConfig: axiosConfig, label: GOOGLE, addToDirectory: true };

const axiosConfig2: AxiosRequestConfig = { url: 'https://www.microsoft.com', method: 'GET' };
const configACharger2: Rh2AxiosConfig = { axiosRequestConfig: axiosConfig2, label: MICROSOFT, addToDirectory: false};

describe('Remove Configuration', () => {
    it('Supprime les éléments configurés', () => {
        rh2AxiosConfigService.addConfigAxios(configACharger);
        rh2AxiosConfigService.addConfigAxios(configACharger2);

        expect(rh2AxiosConfigService.hasConfigAxios(GOOGLE)).toBe(true);
        expect(rh2AxiosConfigService.hasConfigAxios(MICROSOFT)).toBe(true);
        rh2AxiosConfigService.removeAllConfigAxios();
        expect(rh2AxiosConfigService.getAllConfigAxios()).toHaveLength(0);
    });

    it('Supprime un élément sans paramètre', () => {
        rh2AxiosConfigService.addConfigAxios(configACharger);
        expect(rh2AxiosConfigService.hasConfigAxios(GOOGLE)).toBe(true);
        rh2AxiosConfigService.removeConfigAxios(GOOGLE);
        expect(rh2AxiosConfigService.getAllConfigAxios()).toHaveLength(0);
    });

});

describe('Replace Configuration', () => {

    it('Replace a configuration', () => {
        rh2AxiosConfigService.addConfigAxios(configACharger);
        expect(rh2AxiosConfigService.hasConfigAxios(GOOGLE)).toBe(true);
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger2);
        expect(rh2AxiosConfigService.hasConfigAxios(MICROSOFT)).toBe(true);
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger2);
        expect(rh2AxiosConfigService.getAllConfigAxios().length).toBe(1);
    });

    it('Replace a configuration even doesn\'t exist ', () => {
        rh2AxiosConfigService.replaceConfig(GOOGLE, configACharger);
        expect(rh2AxiosConfigService.hasConfigAxios(GOOGLE)).toBe(true);
    });
    afterEach(() => rh2AxiosConfigService.removeAllConfigAxios());
});


describe('Add specific configuration', () => {

    afterEach(() => rh2AxiosConfigService.removeAllConfigAxios());
    beforeEach(() => initData())

    it('Add auth config', () => {
        initData();
        const auth = { username: 'Lunotte', password: 'pampers' };
        rh2AxiosConfigService.addAuthToConfigAxios(GOOGLE, auth);
        const confAfterAddAuth = rh2AxiosConfigService.getConfigAxios(GOOGLE);
        expect(confAfterAddAuth.axiosRequestConfig.auth).toBe(auth);
        rh2AxiosConfigService.addAuthToConfigAxios(MICROSOFT, auth);
        const confAfterAddAuthToMicrosoft = rh2AxiosConfigService.getConfigAxios(MICROSOFT);
        expect(confAfterAddAuthToMicrosoft).toBeUndefined();
    });

    it('Add body config', () => {
        initData();
        const body = { title: 'Die Hard' };
        rh2AxiosConfigService.addBodyToConfigAxios(GOOGLE, body);
        const confAfterAddBody = rh2AxiosConfigService.getConfigAxios(GOOGLE);
        expect(confAfterAddBody.axiosRequestConfig.data).toBe(body);
        rh2AxiosConfigService.addBodyToConfigAxios(MICROSOFT, body);
        const confAfterAddAuthToMicrosoft = rh2AxiosConfigService.getConfigAxios(MICROSOFT);
        expect(confAfterAddAuthToMicrosoft).toBeUndefined();
    });

    function initData() {
        rh2AxiosConfigService.addConfigAxios(configACharger);
        const conf = rh2AxiosConfigService.getConfigAxios(GOOGLE);
        expect(conf.axiosRequestConfig.auth).toBeFalsy();
    }

});
