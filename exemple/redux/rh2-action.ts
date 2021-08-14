/*
 * File: rh2-action.ts                                                         *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:23 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */




export const POUR_TEST_ACTION = 'POUR_TEST_ACTION'; // À des fins de test

export type TypeActionPayload = {type: string, payload: string};

export const pourTestAction = (param?: any): TypeActionPayload => {
    return { type: POUR_TEST_ACTION,
        payload: param };
}
