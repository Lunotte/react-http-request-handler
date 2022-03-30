/*
 * File: index.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 06 30                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 30 - 07:26 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

export * from 'axios';
export type {
    ErreurFetchApi, KeyValue, ResponseFetchApi, Rh2AxiosConfig, Rh2EffectAxiosConfigHandler, Rh2InitializationParameter
} from './models';
export { default as Rh2Initializer } from './Rh2Initializer';
export {
    getErrorsApi, rh2AxiosConfigService, rh2ConfigService, rh2DirectoryService, useRh2WithName, useRh2WithParameters 
} from './services';

