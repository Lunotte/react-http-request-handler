/*
 * File: AxiosConfig.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 05 15                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 25 - 12:30 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { Rh2EffectAxiosConfigHandler } from './Rh2Effect';


/**
 * keyOfInstance: If is not provided, first instance will be used
 */
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}

export type ConfigAxiosTrigger = string;

export type ActionToDispatch = { type: string; payload?: any };
