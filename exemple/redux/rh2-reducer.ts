import { Rh2State } from '../../src/models/Rh2State';
import { POUR_TEST_ACTION } from './rh2-action';

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
