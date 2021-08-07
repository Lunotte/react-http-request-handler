/*
 * File: Rh2AxiosInstanceService.ts                                            *
 * Project: react-http-request-handler                                         *
 * Created Date: Su Aug yyyy                                                   *
 * Author: <<author>                                                           *
 * -----                                                                       *
 * Last Modified: Thu Aug 05 2021                                              *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeyValue } from '../models/Rh2Config';
import { AxiosRequestConfigExtended } from './../models/Rh2Config';
import rh2ConfigService from './Rh2ConfigService';

type Rh2AxiosInstance = { [key: string]: AxiosInstance };

export let axiosInstances: Rh2AxiosInstance = initInstance();

function initInstance() {
    return { ['default']: axios.create() };
}

export function initAxiosInstance(axiosRequestConfigExtended: AxiosRequestConfigExtended[]): void {
    let listAxiosInstance: Rh2AxiosInstance;

    if (axiosRequestConfigExtended != null &&
        axiosRequestConfigExtended.length > 0) {

        axiosRequestConfigExtended.forEach(config => {
            if (config.key != null && config.axiosConfig != null) {
                const anInstance: AxiosInstance = axios.create(config.axiosConfig);
                
                listAxiosInstance = { ...listAxiosInstance,
                    [config.key]: anInstance };
                if (config.defaultInterceptor == null || config.defaultInterceptor === true) {
                    generateInterceptors(anInstance, config.headerUrl)
                }
            }
        })
    }
    
    if (listAxiosInstance == null){
        listAxiosInstance = initInstance();
    }
    axiosInstances = listAxiosInstance;
}

export function getAxiosinstance() {
    return axiosInstances;
}

function generateInterceptors(axiosInstance: AxiosInstance, headersToAdd: KeyValue[]) {
    
    axiosInstance.interceptors.request.use(
        async (config) => {
            return generateHeaders(config, headersToAdd);
        },
        error => {
            return Promise.reject(error);
        });
}

export async function generateHeaders(config: AxiosRequestConfig, headersToAdd: KeyValue[]) {
    const headers = await addHeaderToUrl(headersToAdd);

    if (headers) {
        if (config.method !== 'OPTIONS') {
            config = { ...config,
                headers };
        }
    }
    return config;
}

async function addHeaderToUrl(headersToAdd: KeyValue[]): Promise<{[k: string]: string}> {
    const headersDefault: KeyValue[] = rh2ConfigService.HEADER_URL;

    if (headersToAdd == null || headersToAdd.length === 0) {
        return mapAllHeaders(headersDefault);
    } else {
        return mapAllHeaders(headersToAdd);
    }
}

function mapAllHeaders(headers: KeyValue[]): {[k: string]: string} {
    const headerAfterBuilding = {};
    headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
    return headerAfterBuilding;
}

/**
 * If the user has initialized library with SettingsInitializerRnhrh and provided data for the param axiosConfig
 * All instances requested will be accessible. You can use them to make interceptors
 * If nothing provided, default instance has been created
 * @returns All Axios instances generate 
 */
export function getAxiosInstances(): Rh2AxiosInstance {
    return axiosInstances;
}

export default axiosInstances;