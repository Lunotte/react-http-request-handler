/*
 * File: Rh2AxiosInstanceService.ts                                            *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 24                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 22 - 12:36 am                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeyValue } from '../models/Rh2Config';
import { AxiosRequestConfigExtended } from './../models/Rh2Config';

export type Rh2AxiosInstance = { [key: string]: {axiosInstance : AxiosInstance, interceptor: number} };
export type Rh2Header = {[key: string]: string};

const HEADER_URL: KeyValue<string>[] = [
    {
        key: 'Content-Type',
        value: 'application/json' 
    }
]

/**
 * Generate default instance of Axios with name « default »
 * @returns 
 */
function initInstance(): Rh2AxiosInstance {
    return {
        ['default']: {
            axiosInstance: axios.create(),
            interceptor: null 
        } 
    };
}

/**
 * Generate instances with given parameters
 * @param axiosRequestConfigExtended config to genarate instances
 * @returns List of Axios instance
 */
export function initAxiosInstance(axiosRequestConfigExtended: AxiosRequestConfigExtended[]): Rh2AxiosInstance {
    let listAxiosInstance: Rh2AxiosInstance;

    if (axiosRequestConfigExtended != null &&
        axiosRequestConfigExtended.length > 0) {

        axiosRequestConfigExtended.forEach(config => {
            if (config.key != null && config.axiosConfig != null) {
                const anInstance: AxiosInstance = axios.create(config.axiosConfig);

                let interceptor: number = null;
                if (config.defaultInterceptor == null || config.defaultInterceptor === true) {
                    interceptor = generateInterceptors(anInstance, config.headerUrl)
                }
                
                listAxiosInstance = {
                    ...listAxiosInstance,
                    [config.key]: {
                        axiosInstance: anInstance,
                        interceptor 
                    } 
                };
            }
        })
    }
    
    if (listAxiosInstance == null){
        listAxiosInstance = initInstance();
    }

    return listAxiosInstance;
}

/**
 * Generate interceptors
 * @param axiosInstance New instance
 * @param headersToAdd Header to link with the interceptor
 * @returns 
 */
function generateInterceptors(axiosInstance: AxiosInstance, headersToAdd: KeyValue<string>[]): number {
    
    return axiosInstance.interceptors.request.use(
        async (config) => {
            return generateHeaders(config, headersToAdd);
        },
        error => {
            return Promise.reject(error);
        });
}

/**
 * Eject interceptor of the instance
 * @param axiosInstances targeted instance
 */
export function ejectInterceptor(axiosInstances: Rh2AxiosInstance): void {
    Object.values(axiosInstances).forEach(instance => {
        instance.axiosInstance.interceptors.request.eject(instance.interceptor);
    })
}

/**
 * Generate new header
 * @param config Axios config
 * @param headersToAdd Headers to add
 * @returns 
 */
export async function generateHeaders(config: AxiosRequestConfig, headersToAdd: KeyValue<string>[]): Promise<AxiosRequestConfig<any>> {
    const headers = await addHeaderToUrl(headersToAdd);

    if (headers) {
        if (config.method !== 'OPTIONS') {
            config = {
                ...config,
                headers 
            };
        }
    }
    return config;
}

/**
 * Map default header else use the config provided
 * @param headersToAdd List of headers
 * @returns Headers
 */
async function addHeaderToUrl(headersToAdd: KeyValue<string>[]): Promise<Rh2Header> {
    const headersDefault: KeyValue<string>[] = HEADER_URL;

    if (headersToAdd == null || headersToAdd.length === 0) {
        return mapAllHeaders(headersDefault);
    } else {
        return mapAllHeaders(headersToAdd);
    }
}

/**
 * Map headers
 * @param headers List of headers
 * @returns headers
 */
function mapAllHeaders(headers: KeyValue<string>[]): Rh2Header {
    const headerAfterBuilding = {};
    headers.forEach((kv: KeyValue<string>) => headerAfterBuilding[kv.key] = kv.value);
    return headerAfterBuilding;
}
