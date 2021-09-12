/*
 * File: index.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 06 30                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 25 - 12:32 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






export * from 'axios';
export type {
    ErreurFetchApi, KeyValue, ResponseFetchApi, Rh2AxiosConfig, Rh2EffectAxiosConfigHandler, Rh2InitializationParameter
} from './models';
export { default as InitializerRnhrh } from './Rh2Initializer';
export { rh2AxiosConfigService, rh2ConfigService } from './services';
export { useRh2WithName, useRh2WithParameters } from './services/Rh2EffectsService';

