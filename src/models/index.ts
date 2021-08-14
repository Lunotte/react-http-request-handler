/*
 * File: index.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 06 30                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 06:00 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






import type { Rh2AxiosConfig } from './AxiosConfig';
import type { ErreurFetchApi, ResponseFetchApi } from './FetchApi';
import type { KeyValue, Rh2InitializationParameter } from './Rh2Config';
import { ConfigQueryParameter, MethodRnhrh, MultiplePossibleValues, ParamRnhnh } from './Rh2Directory';

export type { Rh2InitializationParameter, KeyValue, Rh2AxiosConfig, ResponseFetchApi, ErreurFetchApi };
export { ConfigQueryParameter, MethodRnhrh, ParamRnhnh, MultiplePossibleValues };

