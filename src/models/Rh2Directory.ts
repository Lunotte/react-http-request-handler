/*
 * File: Rh2Directory.ts                                                       *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 14                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:12 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */






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