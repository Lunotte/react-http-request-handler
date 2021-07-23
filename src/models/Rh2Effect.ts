import { RouteProp, ParamListBase } from '@react-navigation/native';
import { Dispatch } from 'react';
import { AxiosRequestConfig } from 'axios';
import { ConfigQueryParameter, TypeQueryParameter } from '.';

export interface Rh2EffectLabelFilter {
    readonly label: string;
   // readonly filter: boolean;
}

export interface Rh2EffectAxiosConfigeHandler {
    readonly config: AxiosRequestConfig;
    readonly justeReponse?: boolean; // si true ou non défini alors vaut true sinon false
    readonly errorHandler?: OptionalParamVoidMethod
}

export interface Rh2EffectAxiosConfigHandlerSuccessHandlerRequired extends Rh2EffectAxiosConfigeHandler {
    readonly successHandler: OptionalParamVoidMethod,
}

export interface Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired extends Rh2EffectAxiosConfigeHandler {
    readonly successHandler?: OptionalParamVoidMethod,
}

export interface Rh2EffectManageConfigAndReturnData {
    readonly addToDirectory: boolean;
    readonly action: any;
    readonly dispatch: any;
}

export interface Rh2EffectTreatmentUseRequest extends Rh2EffectManageConfigAndReturnData, Rh2EffectLabelFilter, Rh2EffectAxiosConfigHandlerSuccessHandlerRequired { }

export interface Rh2EffectTreatmentUseRequestAllConfiguration extends Rh2EffectManageConfigAndReturnData, Rh2EffectLabelFilter, Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired {
}

export interface Rh2EffectFromParameter {
    readonly params: string[];
    readonly typeQueryParameter: TypeQueryParameter;
}

export interface Rh2EffectWithParamInRouteFromParameter extends Rh2EffectFromParameter, Rh2EffectAxiosConfigHandlerSuccessHandlerNotRequired { }
export interface Rh2EffectTreatmentWithParamInRouteFromParameter extends Rh2EffectWithParamInRouteFromParameter, Rh2EffectLabelFilter {
    route: RouteProp<ParamListBase, string>;
    readonly action: any;
    readonly dispatch: any;
}

type OptionalParamVoidMethod = (param?: any) => void;