/*
 * File: Rh2DirectoryService.ts                                                *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                   *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2021 09 11 - 11:40 am                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */



import { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { ConfigQueryParameter, MethodRnhrh, ParamRnhnh } from "../models/Rh2Directory";
import { isDebugModeThenDisplayWarn } from "../tools/Utils";


/**
 * Storage service for executed requests
 */
class Rh2DirectoryService {

    private configQueryParameter: ConfigQueryParameter[] = [];

    /**
     * Get all stored items
     * @returns Result table
     */
    getConfigQueryParameters(): ConfigQueryParameter[] {
        return this.configQueryParameter;
    }

    /**
     * Get a stored item
     * @param url Url searched
     * @param method Method searched
     * @param params Settings searched
     * @returns The element searched if it exists
     */
    getConfigQueryParameter(url: string, method: MethodRnhrh, params?: ParamRnhnh): ConfigQueryParameter {
        return this.configQueryParameter.find(config => comparatorUrlMethodParams(config, url, method, params));
    }

    /**
     * Check the setting
     * @param url Url searched
     * @param method Method searched
     * @param params Settings searched
     * @returns True if present else False
     */
    hasConfigQueryParameter(url: string, method: MethodRnhrh, params?: ParamRnhnh): boolean {
        return this.configQueryParameter.some((config) => comparatorUrlMethodParams(config, url, method, params));
    }

    /**
     * Check the setting
     * @param parameter Url searched
     * @returns True If present else False
     */
    hasConfigQueryParameterByConfigQueryParameter(parameter: ConfigQueryParameter): boolean {
        return this.hasConfigQueryParameter(parameter.url, parameter.method, parameter.params);
    }

    /**
     * Add a new setting
     * @param configTmp new setting
     */
    addConfigQueryParameter(configTmp: ConfigQueryParameter): void {
        if (!this.hasConfigQueryParameterByConfigQueryParameter(configTmp)) {
            this.configQueryParameter.push(configTmp);       
        } else {
            isDebugModeThenDisplayWarn('New config was not added because it already exists', configTmp);
        }
    }

    /**
     * Removes the element send as a paraneter
     * @param axiosRequestConfig Item to delete
     */
    removeQueryDirectory(axiosRequestConfig: AxiosRequestConfig): void {
        this.configQueryParameter = this.configQueryParameter.filter(config =>
            !comparatorUrlMethodParams(config, axiosRequestConfig.url, axiosRequestConfig.method, axiosRequestConfig.params));
    }

    /**
     * Empty all items
     */
    removeAllQueryDirectory(): void {
        this.configQueryParameter = []
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

/**
 * Compare url, method type and parameters
 * @param config Configuration in memory
 * @param url Url received
 * @param method Method received
 * @param params Params received
 * @returns True if the comparison is strictly identical
 */
const comparatorUrlMethodParams = (config, url, method, params): boolean =>
    config.url === url && config.method === method && compareParams(config.params, params);

const rh2DirectoryService = new Rh2DirectoryService();
export default rh2DirectoryService;