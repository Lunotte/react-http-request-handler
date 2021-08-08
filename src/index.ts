export * from 'axios';
export { default as InitializerRnhrh } from './InitializerRnhrh';
export { ConfigQueryParameter, MethodRnhrh, MultiplePossibleValues, ParamRnhnh, TypeQueryParameter } from './models';
export type { ActionToDispatch, ErreurFetchApi, KeyValue, ResponseFetchApi, Rh2AxiosConfig, Rh2InitializationParameter, Rh2State, Rh2StateErreurApi } from './models';
export { getAxiosInstances, rh2AxiosConfigService, rh2ConfigService } from './services';
export {
    useRh2WithName, useRh2WithNameTakeParamsInRoute, useRh2WithParameters, useRh2WithParametersTakeParamsInRoute
} from './services/Rh2EffectsService';

