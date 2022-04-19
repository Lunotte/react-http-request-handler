/*
 * File: Rh2ErrorsApi.ts                                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2022 04 17                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 04 17 - 22:46 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { ResponseFetchApi } from "./FetchApi";
import { Rh2EffectTreatmentToManageRequest } from "./Rh2Effect";

export interface Rh2ErrorsApi {
    label: string;
    configuration: Rh2EffectTreatmentToManageRequest;
    error: ResponseFetchApi;
}
