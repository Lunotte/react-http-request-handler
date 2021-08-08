
export const POUR_TEST_ACTION = 'POUR_TEST_ACTION'; // À des fins de test

export type TypeActionPayload = {type: string, payload: string};

export const pourTestAction = (param?: any): TypeActionPayload => {
    return { type: POUR_TEST_ACTION,
        payload: param };
}
