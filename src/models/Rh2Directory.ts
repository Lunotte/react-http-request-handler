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

export type TypeQueryParameter = 'REQUEST_PARAM' | 'PATH_PARAM';