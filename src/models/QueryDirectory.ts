export interface ConfigQueryParameter {
    readonly url: string;
    readonly method: string;
    readonly params: MultiplePossibleValues[];
}

export type MultiplePossibleValues = string | number | Date;