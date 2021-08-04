/*
 * File: Rh2Config.ts                                                          *
 * Project: react-http-request-handler                                         *
 * Created Date: Su Aug yyyy                                                   *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: Wed Aug 04 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { AxiosRequestConfig } from 'axios';

/**
 * axiosConfig: If not provided then a default instance of axios is generated
 * errorHandler: Manipuler un callback specifique
 */
export interface Rh2InitializationParameter {
    axiosConfig?: AxiosRequestConfigExtended[];
    // reduxIsActif?: boolean; // Si l'application qui implémente la lib utilise redux
    // useAsyncStorage?: boolean; // Si l'application qui implémente la lib utilise @react-native-async-storage/async-storage
    // et quelle veut l'utiliser nécessaire dans les cas des authentifications de type Bearer
    errorHandler?: (param?: any) => void;
    modeDebug?: boolean
}

export interface KeyValue {
    key: string;
    value: string;
}

/**
 * @param key Key to find instance
 * @param axiosConfig Paramètrage Axios
 * @param headerUrl An interceptor is generate to each instance of axios, per default, Content-Type: application/json is added if this parameter is null
 * @param defaultInterceptor Default is true, in the interceptor only headerUrl is used. If you want to custom interceptor of the instance, choose false. 
 * If default Interceptor is true and you implement an interceptor, yours will not work
 */
export interface AxiosRequestConfigExtended {
    key: string;
    axiosConfig: AxiosRequestConfig;
    defaultInterceptor?: boolean;
    headerUrl?: KeyValue[]; // Par défaut : [{key: 'Content-Type', value: 'application/json'}]
}