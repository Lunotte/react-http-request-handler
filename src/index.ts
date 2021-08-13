/*
 * File: index.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: Sun June 13 2021                                              *
 * Author:  Charly Beaugrand                                                   *
 * -----                                                                       *
 * Last Modified: Fri Aug 13 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



export * from 'axios';
export { ConfigQueryParameter, MethodRnhrh, MultiplePossibleValues, ParamRnhnh, TypeQueryParameter } from './models';
export type { ActionToDispatch, ErreurFetchApi, KeyValue, ResponseFetchApi, Rh2AxiosConfig, Rh2InitializationParameter, Rh2State } from './models';
export { default as InitializerRnhrh } from './Rh2Initializer';
export { rh2AxiosConfigService, rh2ConfigService } from './services';
export { useRh2WithName, useRh2WithParameters } from './services/Rh2EffectsService';

