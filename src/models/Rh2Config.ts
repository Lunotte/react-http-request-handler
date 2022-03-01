/*
 * File: Rh2Config.ts                                                          *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 02 12 - 04:35 pm                                        *
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
    errorHandler?: (param?: any) => void;
    debugMode?: boolean
}

export interface KeyValue<T> {
    key: string;
    value: T;
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
    headerUrl?: KeyValue<string>[]; // Par défaut : [{key: 'Content-Type', value: 'application/json'}]
}