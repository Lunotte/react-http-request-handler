/*
 * File: AxiosConfig.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 05 15                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 22 - 12:02 am                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { Rh2EffectAxiosConfigHandler } from './Rh2Effect';

/**
 * label To identify the configuration
 */
export interface Rh2AxiosConfig extends Rh2EffectAxiosConfigHandler {
    readonly label: ConfigAxiosTrigger;
}

export type ConfigAxiosTrigger = string;
