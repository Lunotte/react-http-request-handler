export interface ConfigQueryParameter {
    readonly url: string;
    readonly method: MethodRnhrh;
    readonly params?: MultiplePossibleValues[];
}

export type MethodRnhrh = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MultiplePossibleValues = string | number | Date;