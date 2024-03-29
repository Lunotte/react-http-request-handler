/*
 * File: Rh2AxiosConfigService.ts                                              *
 * Project: react-http-request-handler                                         *
 * Created Date: 2021 07 04                                                    *
 * Author: Charly Beaugrand                                                    *
 * -----                                                                       *
 * Last Modified: 2022 03 22 - 12:31 am                                        *
 * Modified By: Charly Beaugrand                                               *
 * -----                                                                       *
 * Copyright (c) 2021 Lunotte                                                  *
 * ----------	---	---------------------------------------------------------  *
 */

import { Rh2AxiosConfig } from "..";

/**
 * Query configuration service
 * Allows you to centralize the requests to be made, to execute one, just call it by name
 */
class Rh2AxiosConfigService {

    private configsAxios: Rh2AxiosConfig[] = [];

    /**
     * Get all stored items
     * @returns Result table
     */
    getAllConfigAxios(): Rh2AxiosConfig[] {
        return this.configsAxios;
    }

    /**
     * Get a stored item
     * @param label Query name
     * @returns The element searched if it exists
     */
    getConfigAxios(label: string): Rh2AxiosConfig {
        return this.configsAxios.find(config => config.label === label);
    }

    /**
     * Check the setting
     * @param label Query name
     * @returns True If present else False
     */
    hasConfigAxios(label: string): boolean {
        return this.configsAxios.some((config) => config.label === label);
    }

    /**
      * Add a new setting
      * If the name already exists, the setting will not be added
      * @param configAxios new setting
      */
    addConfigAxios(configAxios: Rh2AxiosConfig): void {
        if (!this.hasConfigAxios(configAxios.label)) {
            this.configsAxios.push(configAxios);
        }
    }

    /**
     * Add or update auth to a axios config
     * @param label Query name
     * @param auth Ident to HTTP Basic auth
     */
    addOrUpdateAuthToConfigAxios(label: string, auth: { username: string, password: string }): void {
        this.addAuthToConfigAxios(label, auth);
    }

    /**
     * @deprecated You need to use addOrUdateAuthToConfigAxios method  
     * 
     * Add auth to a axios config
     * @param label Query name
     * @param auth Ident to HTTP Basic auth
     */
    addAuthToConfigAxios(label: string, auth: { username: string, password: string }): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.axiosRequestConfig;
            config = {
                ...config,
                axiosRequestConfig: {
                    ...configAxios,
                    auth 
                }
            };
            this.addConfigAxios(config);
        }
    }

    /**
     * Add body to an axios config
     * @param label Query name
     * @param body Body to the http request
     */
    addBodyToConfigAxios<T>(label: string, body: T): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.axiosRequestConfig;
            config = {
                ...config,
                axiosRequestConfig: {
                    ...configAxios,
                    data: body 
                }
            };
            this.addConfigAxios(config);
        }
    }


    /**
     * Replace config
     * @param label Query name
     * @param configAxios Config to replace
     */
    replaceConfig(label: string, configAxios: Rh2AxiosConfig): void {
        if (this.hasConfigAxios(label)) {
            this.removeConfigAxios(label);
            this.addConfigAxios(configAxios);
        } else {
            this.addConfigAxios(configAxios);
        }
    }


    /**
     * Delete the element sent as a parameter
     * @param label Label
     */
    removeConfigAxios(label: string): void {
        this.configsAxios = this.configsAxios.filter(config => config.label !== label);
    }

    /**
     * Empty all items
     */
    removeAllConfigAxios(): void {
        this.configsAxios = []
    }

}

const rh2AxiosConfigService = new Rh2AxiosConfigService();
export default rh2AxiosConfigService;
