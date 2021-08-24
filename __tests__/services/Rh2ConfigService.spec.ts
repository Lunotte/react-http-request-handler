/*
 * File: Rh2ConfigService.spec.ts                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 24 - 12:26 pm                                         *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 24 - 12:26 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { rh2ConfigService, Rh2InitializationParameter } from '../../src';
import { AxiosRequestConfigExtended } from '../../src/models/Rh2Config';


describe('Configuration', () => {

    describe('initializeParameters', () => {

        function emptyAllParameters() {
            const allParameters = rh2ConfigService.getParameters();
            expect(allParameters.axiosConfig).toEqual([]);
            expect(allParameters.debugMode).toBeFalsy();
            expect(allParameters.errorHandler).toBeNull();
        }

        it('is empty', () => {
            emptyAllParameters();
        });

        it('is parameters is null', () => {
            rh2ConfigService.initializeParameters(null);
            emptyAllParameters();
        });

        it('add a parameter without errorHandler and debugMode', () => {

            const key = 'TEST_KEY';
            const baseURL = 'baseURLTest';
            const axiosConfig: AxiosRequestConfigExtended = { key, axiosConfig: { baseURL } };

            const parameters: Rh2InitializationParameter = {
                axiosConfig: [axiosConfig]
            };
            rh2ConfigService.initializeParameters(parameters);

            const allParameters = rh2ConfigService.getParameters();
            expect(allParameters.axiosConfig).toEqual([axiosConfig]);
            expect(allParameters.debugMode).toBe(false);
            expect(allParameters.errorHandler).toBeNull();

            expect(Object.keys(rh2ConfigService.getAxiosInstances())).toHaveLength(1);
            expect(rh2ConfigService.getAxiosInstance(key)).toBeTruthy();
        });

        it('add a parameter', () => {

            const key = 'TEST_KEY';
            const baseURL = 'baseURLTest';
            const axiosConfig: AxiosRequestConfigExtended = { key, axiosConfig: { baseURL } };

            const parameters: Rh2InitializationParameter = {
                debugMode: true,
                errorHandler: () => console.log('test'),
                axiosConfig: [axiosConfig]
            };
            rh2ConfigService.initializeParameters(parameters);

            const allParameters = rh2ConfigService.getParameters();
            expect(allParameters.axiosConfig).toEqual([axiosConfig]);
            expect(allParameters.debugMode).toBe(true);
            expect(allParameters.errorHandler).not.toBeNull();
            expect(allParameters.errorHandler).not.toBeUndefined();
        });


        it('Set error handler', () => {
            rh2ConfigService.setErrorHandler((param) => console.log('value to test', param));
            expect(rh2ConfigService.getParameters()).toBeTruthy();
        });

    });
});

