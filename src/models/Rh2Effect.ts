import { ParamListBase, RouteProp } from '@react-navigation/native';
import { AxiosRequestConfig } from 'axios';
import { TypeQueryParameter } from '.';

export interface Rh2EffectLabelFilter {
    readonly label: string;
}

export interface Rh2EffectAxiosConfigHandler {
    readonly config: AxiosRequestConfig;
    readonly justeReponse?: boolean; // si true ou non défini alors vaut true sinon false
    readonly errorHandler?: OptionalParamVoidMethod
}

export interface Rh2EffectSuccessRequiredHandler extends Rh2EffectAxiosConfigHandler {
    readonly successHandler: OptionalParamVoidMethod,
}

export interface Rh2EffectSuccessNotRequiredHandler extends Rh2EffectAxiosConfigHandler {
    readonly successHandler?: OptionalParamVoidMethod,
}

export interface Rh2EffectManageConfigAndReturnData {
    readonly addToDirectory: boolean;
    readonly action: any;
    readonly dispatch: any;
}

export interface Rh2EffectTreatmentToManageRequest extends Rh2EffectManageConfigAndReturnData, Rh2EffectLabelFilter, Rh2EffectSuccessNotRequiredHandler {
}

export interface Rh2EffectFromParameter {
    readonly params: string[];
    readonly typeQueryParameter: TypeQueryParameter;
}

export interface Rh2EffectTakeParamsInRoute extends Rh2EffectFromParameter, Rh2EffectSuccessNotRequiredHandler { }
export interface Rh2EffectTreatmentToManageParameters extends Rh2EffectTakeParamsInRoute, Rh2EffectLabelFilter {
    route: RouteProp<ParamListBase, string>;
    readonly action: any;
    readonly dispatch: any;
}

type OptionalParamVoidMethod = (param?: any) => void;