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
    getConfigAxios(id: string): Rh2AxiosConfig {
        return this.configsAxios.find(config => config.label === id);
    }

    /**
     * Check the setting
     * @param id Query name
     * @returns True If present else False
     */
    hasConfigAxios(id: string): boolean {
        return this.configsAxios.some((config) => config.label === id);
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
                axiosRequestConfig: { ...configAxios,
                    auth }
            };
            this.addConfigAxios(config);
        }
    }

    /**
     * Add body to a axios config
     * @param id Query name
     * @param body Body to the http request
     */
    addBodyToConfigAxios<T>(label: string, body: T): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.axiosRequestConfig;
            config = {
                ...config,
                axiosRequestConfig: { ...configAxios,
                    data: body }
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