/*
 * File: rh2-reducer.ts                                                        *
 * Project: react-http-request-handler                                         *
 * Created Date: 07 04 2021                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:23 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */


 
 




import { POUR_TEST_ACTION } from './rh2-action';
import { Rh2State } from './Rh2State';

export const initialHookState: Rh2State = {
    test: null,
};

export default function hookReducer(state: Rh2State = initialHookState, action) {

    switch (action.type) {
    case POUR_TEST_ACTION:
        return {...state, test: action.payload};
    default:
        return state;
    }
}
