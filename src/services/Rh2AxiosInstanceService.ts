/*
 * File: Rh2AxiosInstanceService.ts                                            *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 24                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 08 14 - 01:14 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeyValue } from '../models/Rh2Config';
import { AxiosRequestConfigExtended } from './../models/Rh2Config';

export type Rh2AxiosInstance = { [key: string]: {axiosInstance : AxiosInstance, interceptor: number} };

const HEADER_URL: KeyValue[] = [
    {
        key: 'Content-Type',
        value: 'application/json' 
    }
]

function initInstance() {
    return {
        ['default']: {
            axiosInstance: axios.create(),
            interceptor: null 
        } 
    };
}

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

function generateInterceptors(axiosInstance: AxiosInstance, headersToAdd: KeyValue[]): number {
    
    return axiosInstance.interceptors.request.use(
        async (config) => {
            return generateHeaders(config, headersToAdd);
        },
        error => {
            return Promise.reject(error);
        });
}

export function ejectInterceptor(axiosInstances: Rh2AxiosInstance): void {
    Object.values(axiosInstances).forEach(instance => {
        instance.axiosInstance.interceptors.request.eject(instance.interceptor);
    })
}

export async function generateHeaders(config: AxiosRequestConfig, headersToAdd: KeyValue[]) {
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

async function addHeaderToUrl(headersToAdd: KeyValue[]): Promise<{[k: string]: string}> {
    const headersDefault: KeyValue[] = HEADER_URL;

    if (headersToAdd == null || headersToAdd.length === 0) {
        return mapAllHeaders(headersDefault);
    } else {
        return mapAllHeaders(headersToAdd);
    }
}

function mapAllHeaders(headers: KeyValue[]): {[k: string]: string} {
    const headerAfterBuilding = {
    };
    headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
    return headerAfterBuilding;
}
