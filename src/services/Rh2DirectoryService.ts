/*
 * File: Rh2DirectoryService.ts                                                *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                   *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 02 17 - 08:38 pm                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import _ from "lodash";
import { ConfigQueryParameter, DirectoryConfigQueryParameter, MethodRnhrh, ParamRnhnh } from "../models/Rh2Directory";
import { isDebugModeThenDisplayWarn } from "../tools/Utils";
import { KeyValue } from './../models/Rh2Config';


/**
 * Storage service for executed requests
 * Manages the queries used. If they are locked, we keep them until we explicitly ask to delete them,
 * for the others we delete them when the requests are finished
 */
class Rh2DirectoryService {

    private directoryConfigQueryParameter: DirectoryConfigQueryParameter[] = [];

    private keysCancelToken: KeyValue<CancelTokenSource>[] = [];

    private cancelToken = axios.CancelToken;

    isKeyCancelToken(searchedKey: string): boolean {
        return this.keysCancelToken.some(keyCancelToken => keyCancelToken.key === searchedKey);
    }

    getKeyCancelToken(searchedKey: string): CancelTokenSource {
        if (this.isKeyCancelToken(searchedKey)) {
            const source: KeyValue<CancelTokenSource> = this.keysCancelToken.find(keyCancelToken => keyCancelToken.key === searchedKey);
            return (source != null) ? source.value : null;
        }
        return null
    }

    setKeyCancelToken(keyCancelToken: string): CancelTokenSource {
        this.keysCancelToken.push({
            key: keyCancelToken,
            value: this.generateCancelToken() 
        });
        return this.getKeyCancelToken(keyCancelToken);
    }

    /**
     * Remove cancel token
     * 
     * @param searchedKey Search key
     */
    removeKeyCancelToken(searchedKey: string): void {
        if (this.isKeyCancelToken(searchedKey)) {
            this.keysCancelToken = this.keysCancelToken.filter(keyCancelToken => keyCancelToken.key !== searchedKey);
        }
    }

    private generateCancelToken(): CancelTokenSource {
        return this.cancelToken.source();
    }

    /**
     * Get or create CancelToken
     * When the searched key is empty, it means that there is no need to memorize the generated token.
     * When the key is entered, we will look for the associated token if it exists, otherwise we generate it.
     * @param searchedKey Search key
     * @returns CancelTokenSource
     */
    getOrGenerateCancelToken(searchedKey: string): CancelTokenSource {
        if (searchedKey == null) {
            return this.generateCancelToken();
        } else {
            return (this.isKeyCancelToken(searchedKey) ? this.getKeyCancelToken(searchedKey) : this.setKeyCancelToken(searchedKey));
        }
    }
    
    /**
     * Get all stored items
     * @returns Result table
     */
    getConfigQueryParameters(): DirectoryConfigQueryParameter[] {
        return this.directoryConfigQueryParameter;
    }

    /**
     * Get a stored item
     * @param url Url searched
     * @param method Method searched
     * @param params Settings searched
     * @returns The element searched if it exists
     */
    getConfigQueryParameter(url: string, method: MethodRnhrh, params?: ParamRnhnh): DirectoryConfigQueryParameter {
        return this.directoryConfigQueryParameter.find(config => comparatorUrlMethodParamsWithLock(config, url, method, params));
    }

    /**
     * Check the setting
     * @param lock Lock searched
     * @param url Url searched
     * @param method Method searched
     * @param params Settings searched
     * @returns True if present else False
     */
    hasConfigQueryParameter(lock: boolean, url: string, method: MethodRnhrh, params?: ParamRnhnh): boolean {
        if (lock == null) {
            return this.directoryConfigQueryParameter.some((config) => comparatorUrlMethodParams(config, url, method, params));
        } else if (lock === true) {
            return this.directoryConfigQueryParameter.some((config) => comparatorUrlMethodParamsWithLock(config, url, method, params));
        } else {
            return this.directoryConfigQueryParameter.some((config) => comparatorUrlMethodParamsWithoutLock(config, url, method, params));
        }
    }

    /**
     * Check the setting
     * @param parameter Url searched
     * @returns True If present else False
     */
    hasConfigQueryParameterByConfigQueryParameter(parameter: ConfigQueryParameter): boolean {
        return this.hasConfigQueryParameter(null, parameter.url, parameter.method, parameter.params);
    }

    /**
     * Check the setting
     * @param parameter Url searched
     * @param lock Lock searched
     * @returns True If present else False
     */
    hasConfigQueryParameterByConfigQueryParameterWithOrWithoutLock(parameter: ConfigQueryParameter, lock: boolean): boolean {
        return this.hasConfigQueryParameter(lock, parameter.url, parameter.method, parameter.params);
    }

    /**
     * Add a new setting
     * @param configTmp new setting
     * @param lock we want use this query one time
     */
    addConfigQueryParameter(configTmp: ConfigQueryParameter, lock: boolean, sourceCancelToken: CancelTokenSource = null): void {
        if (!this.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
            this.directoryConfigQueryParameter.push({
                ...configTmp,
                lock,
                sourceCancelToken
            });       
        } else {
            isDebugModeThenDisplayWarn('New config was not added because it already exists', configTmp);
        }
    }

    /**
     * Remove the element send as a parameter used with lock
     * @param axiosRequestConfig Item to delete
     */
    removeQueryDirectoryLocked(axiosRequestConfig: AxiosRequestConfig): void {
        this.directoryConfigQueryParameter = this.directoryConfigQueryParameter.filter(config =>
            !comparatorUrlMethodParamsWithLock(config, axiosRequestConfig.url, axiosRequestConfig.method, axiosRequestConfig.params));
    }

    /**
     * Empty all items without items not locked
     */
    removeAllQueryDirectoryLocked(): void {
        const removeConfigLocked = this.directoryConfigQueryParameter.filter(config => !config.lock);
        this.directoryConfigQueryParameter = removeConfigLocked
    }

    /**
     * Remove the element send as a parameter and not locked
     * @param axiosRequestConfig Item to delete
     */
    removeQueryDirectoryNotLocked(axiosRequestConfig: AxiosRequestConfig): void {
        this.directoryConfigQueryParameter = this.directoryConfigQueryParameter.filter(config =>
            !comparatorUrlMethodParamsWithoutLock(config, axiosRequestConfig.url, axiosRequestConfig.method, axiosRequestConfig.params));
    }

}

/**
 * Compare the parameters of two sources provided
 * @param params1 
 * @param params2 
 * @returns True If the parameters are identical, null or empty otherwise False
 */
const compareParams = (params1: ParamRnhnh, params2: ParamRnhnh): boolean => {
    if (params1 == null && params2 == null) {
        return true;
    } else if ((params1 == null && params2 != null && Object.keys(params2).length === 0) ||
        params2 == null && params1 != null && Object.keys(params1).length === 0) {
        return true;
    } else if (params1 != null && params2 != null) {
        return _.isEqual(params1, params2);
    } else {
        return false;
    }
}

const comparatorUrlMethodParamsWithoutLock = (config: DirectoryConfigQueryParameter, url, method, params): boolean =>
    !config.lock && comparatorUrlMethodParams(config, url, method, params);

const comparatorUrlMethodParamsWithLock = (config: DirectoryConfigQueryParameter, url, method, params): boolean =>
    config.lock && comparatorUrlMethodParams(config, url, method, params);

/**
 * Compare url, method type and parameters
 * @param config Configuration in memory
 * @param url Url received
 * @param method Method received
 * @param params Params received
 * @returns True if the comparison is strictly identical
 */
const comparatorUrlMethodParams = (config: DirectoryConfigQueryParameter, url, method, params): boolean =>
    config.url === url && config.method === method && compareParams(config.params, params);

const rh2DirectoryService = new Rh2DirectoryService();
export default rh2DirectoryService;