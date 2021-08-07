import { rh2ConfigService, Rh2InitializationParameter } from '../../src';
import { isModeDebugThenDisplayError, isModeDebugThenDisplayInfo, isModeDebugThenDisplayWarn } from '../../src/tools/Utils';

describe('Utils file', () => {

    const parameters: Rh2InitializationParameter = {modeDebug: true};
    rh2ConfigService.initializeParameters(parameters);

    describe('isModeDebugThenDisplayInfo', () => {

        console.info = jest.fn();

        it('Only message', async () => {

            const expectedResult = '[RH2 INFO] hello';
            
            isModeDebugThenDisplayInfo('hello');
            expect(console.info).toHaveBeenCalled();
            expect(console.info).toHaveBeenCalledWith(expectedResult);
        });

        it('Message et 1 param', async () => {

            isModeDebugThenDisplayInfo('hello', ['Jack']);
            expect(console.info).toHaveBeenCalled();
        });
    });

    describe('isModeDebugThenDisplayWarn', () => {

        console.warn = jest.fn();

        it('Only message', async () => {

            const expectedResult = '[RH2 WARN] hello';
            
            isModeDebugThenDisplayWarn('hello');
            expect(console.warn).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalledWith(expectedResult);
        });

        it('Message et 1 param', async () => {

            isModeDebugThenDisplayWarn('hello', ['Jack']);
            expect(console.warn).toHaveBeenCalled();
        });
    });

    describe('isModeDebugThenDisplayError', () => {

        console.error = jest.fn();

        it('Only message', async () => {

            const expectedResult = '[RH2 WARN] hello';
            
            isModeDebugThenDisplayError('hello');
            expect(console.error).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith(expectedResult);
        });

        it('Message et 1 param', async () => {

            isModeDebugThenDisplayError('hello', ['Jack']);
            expect(console.error).toHaveBeenCalled();
        });
    });
});



// describe('Utils file - Pas de debug', () => {
//     const parameters: Rh2InitializationParameter = {modeDebug: false};
//     rh2ConfigService.initializeParameters(parameters);
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
    
//     it('Pas de debug - Info', async () => {
//         console.info = jest.fn();
//         isModeDebugThenDisplayInfo('hello');
//         expect(console.info).toHaveBeenCalledTimes(0);
//     });
//     it('Pas de debug - Warn', async () => {
//         console.warn = jest.fn();
//         isModeDebugThenDisplayWarn('hello');
//         expect(console.warn).toHaveBeenCalledTimes(0);
//     });
//     it('Pas de debug - Error', async () => {
//         console.error = jest.fn();
//         isModeDebugThenDisplayError('hello');
//         expect(console.error).toHaveBeenCalledTimes(0);
//     });
// });
