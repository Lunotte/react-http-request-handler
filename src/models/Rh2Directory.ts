/*
 * File: Rh2Directory.ts                                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 14                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 02 07 - 07:10 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { CancelTokenSource } from "axios";


export interface DirectoryConfigQueryParameter extends ConfigQueryParameter {
    readonly lock: boolean; // Signifie que l’on interdit de la manipuler sauf si c’est explicitement demandé
    readonly sourceCancelToken: CancelTokenSource;
}

export interface ConfigQueryParameter {
    readonly url: string;
    readonly method: MethodRnhrh;
    readonly params?: ParamRnhnh;
}

export type MethodRnhrh = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ParamRnhnh {
    [name: string]: MultiplePossibleValues;
}

export type MultiplePossibleValues = string | number | Date;