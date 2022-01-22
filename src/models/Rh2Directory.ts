/*
 * File: Rh2Directory.ts                                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 14                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 01 09 - 06:15 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */


export interface DirectoryConfigQueryParameter extends ConfigQueryParameter {
    readonly lock: boolean; // Ne pas utiliser cette query
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