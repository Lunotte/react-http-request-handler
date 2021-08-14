/*
 * File: AxiosConfig.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Project: react-http-request-handler                                         *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 06:02 pm                                        *
 * Last Modified: 2021 08 14 - 06:02 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { Rh2EffectAxiosConfigHandler } from './Rh2Effect';
/*
 * File: AxiosConfig.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 05 15                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:10 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






/**
 * keyOfInstance: If is not provided, first instance will be used
 */
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}

export type ConfigAxiosTrigger = string;

export type ActionToDispatch = { type: string; payload?: any };
