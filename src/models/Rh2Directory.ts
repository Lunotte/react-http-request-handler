/*
 * File: Rh2Directory.ts                                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 14                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 21 - 11:18 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { CancelTokenSource } from "axios";

/**
 * lock If true, the request will be handled only once during the entire session. To reset the value, use the Rh2DirectoryService service
 * sourceCancelToken Provided to cancel request
 */
export interface DirectoryConfigQueryParameter extends ConfigQueryParameter {
    readonly lock: boolean; // Signifie que l’on interdit de la manipuler sauf si c’est explicitement demandé
    readonly sourceCancelToken: CancelTokenSource;
}

export interface ConfigQueryParameter {
    readonly url: string;
    readonly method: Rh2Method;
    readonly params?: Rh2Param;
}

export type Rh2Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface Rh2Param {
    [name: string]: MultiplePossibleValues;
}

export type MultiplePossibleValues = string | number | Date;