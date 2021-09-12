/*
 * File: Utils.spec.ts                                                         *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 08 24 - 12:26 pm                                         *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 25 - 11:12 am                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { rh2ConfigService, Rh2InitializationParameter } from '../../src';
import { isDebugModeThenDisplayError, isDebugModeThenDisplayInfo, isDebugModeThenDisplayWarn } from '../../src/tools/Utils';

describe('Utils file', () => {

    describe('Pas de debug ', () => {

        it('Info', async () => {
            console.info = jest.fn();
            isDebugModeThenDisplayInfo('hello');
            expect(console.info).toHaveBeenCalledTimes(0);
        });

        it('Warn', async () => {
            console.warn = jest.fn();
            isDebugModeThenDisplayWarn('hello');
            expect(console.warn).toHaveBeenCalledTimes(0);
        });
        it('Error', async () => {
            console.error = jest.fn();
            isDebugModeThenDisplayError('hello');
            expect(console.error).toHaveBeenCalledTimes(0);
        });
    });

    describe('Avec debug', () => {

        beforeAll(() => {
            const parameters: Rh2InitializationParameter = {debugMode: true};
            rh2ConfigService.initializeParameters(parameters);
        });
    
        describe('isDebugModeThenDisplayInfo', () => {

            console.info = jest.fn();

            it('Only message', async () => {

                const expectedResult = '[RH2 INFO] hello';
                
                isDebugModeThenDisplayInfo('hello');
                expect(console.info).toHaveBeenCalled();
                expect(console.info).toHaveBeenCalledWith(expectedResult);
            });

            it('Message et 1 param', async () => {

                isDebugModeThenDisplayInfo('hello', ['Jack']);
                expect(console.info).toHaveBeenCalled();
            });
        });

        describe('isDebugModeThenDisplayWarn', () => {

            console.warn = jest.fn();

            it('Only message', async () => {

                const expectedResult = '[RH2 WARN] hello';
                
                isDebugModeThenDisplayWarn('hello');
                expect(console.warn).toHaveBeenCalled();
                expect(console.warn).toHaveBeenCalledWith(expectedResult);
            });

            it('Message et 1 param', async () => {

                isDebugModeThenDisplayWarn('hello', ['Jack']);
                expect(console.warn).toHaveBeenCalled();
            });
        });

        describe('isDebugModeThenDisplayError', () => {

            console.error = jest.fn();

            it('Only message', async () => {

                const expectedResult = '[RH2 WARN] hello';
                
                isDebugModeThenDisplayError('hello');
                expect(console.error).toHaveBeenCalled();
                expect(console.error).toHaveBeenCalledWith(expectedResult);
            });

            it('Message et 1 param', async () => {

                isDebugModeThenDisplayError('hello', ['Jack']);
                expect(console.error).toHaveBeenCalled();
            });
        });
    });
});


// describe('Utils file - Pas de debug', () => {
//     const parameters: Rh2InitializationParameter = {debugMode: false};
//     rh2ConfigService.initializeParameters(parameters);
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
    
//     it('Pas de debug - Info', async () => {
//         console.info = jest.fn();
//         isDebugModeThenDisplayInfo('hello');
//         expect(console.info).toHaveBeenCalledTimes(0);
//     });
//     it('Pas de debug - Warn', async () => {
//         console.warn = jest.fn();
//         isDebugModeThenDisplayWarn('hello');
//         expect(console.warn).toHaveBeenCalledTimes(0);
//     });
//     it('Pas de debug - Error', async () => {
//         console.error = jest.fn();
//         isDebugModeThenDisplayError('hello');
//         expect(console.error).toHaveBeenCalledTimes(0);
//     });
// });
